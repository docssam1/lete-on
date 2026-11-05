import{withObservationLanguage}from'./observation-language.js';
import {withStudentOpeningLanguage} from './student-opening-language.js';
// 생물과 환경 A4. scripts/gen-science-workbook-c22s42u02.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s42-u02",
 "title": "생물과 환경",
 "semester": "4-2",
 "no": 2,
 "theme": "#317247",
 "richText": true,
 "questions": [
  {
   "id": "c22-s42-u02-w001",
   "no": 1,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "죽은 나무의 물질을 분해해 양분을 얻는 생물로만 묶은 카드를 고르세요.",
   "choices": [
    "갈대·물풀",
    "달팽이·참새",
    "소나무·다람쥐",
    "버섯·분해 세균",
    "개구리·잠자리"
   ],
   "key": 3,
   "answer": "④ 버섯·분해 세균",
   "explanation": "버섯과 여러 세균은 분해자의 사례입니다. 같은 장소에 있다는 사실만으로 모두 분해자가 되지는 않습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v004",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 1,
     "no": 4,
     "originalSet": 1,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceExplanation": "버섯과 여러 세균은 분해자의 사례입니다. 같은 장소에 있다는 사실만으로 모두 분해자가 되지는 않습니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w002",
   "no": 2,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "바닷가 조사 목록에서 살아 있는 구성 요소를 고르세요.",
   "choices": [
    "모래",
    "게",
    "햇빛",
    "바닷물",
    "수온"
   ],
   "key": 1,
   "answer": "② 게",
   "explanation": "게는 생물 요소입니다. 바닷물·모래·빛·수온은 비생물 요소로 분류합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v016",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 2,
     "no": 1,
     "originalSet": 2,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceExplanation": "게는 생물 요소입니다. 바닷물·모래·빛·수온은 비생물 요소로 분류합니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w003",
   "no": 3,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "학교 연못을 생태계로 조사하는 방법으로 옳지 않은 것을 고르세요.",
   "choices": [
    "물속 생물과 주변 환경을 함께 살핀다.",
    "다른 장소의 생태계와 모습을 비교한다.",
    "작은 연못에도 생태계가 있음을 안다.",
    "수온과 물풀의 상태를 함께 기록한다.",
    "살아 있는 것만 적고 물과 빛은 뺀다."
   ],
   "key": 4,
   "answer": "⑤ 살아 있는 것만 적고 물과 빛은 뺀다.",
   "explanation": "생태계는 생물과 주변 비생물 환경을 함께 다룹니다. 생물 이름만으로 전체를 설명할 수 없습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v017",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 2,
     "no": 2,
     "originalSet": 2,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceExplanation": "생태계는 생물과 주변 비생물 환경을 함께 다룹니다. 생물 이름만으로 전체를 설명할 수 없습니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w004",
   "no": 4,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "하천 조사 목록에서 생물 요소가 아닌 것을 고르세요.",
   "choices": [
    "수온",
    "물풀",
    "우렁이",
    "붕어",
    "잠자리"
   ],
   "key": 0,
   "answer": "① 수온",
   "explanation": "수온은 물의 온도를 나타내는 비생물 환경 조건입니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v033",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 3,
     "no": 3,
     "originalSet": 3,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceExplanation": "수온은 물의 온도를 나타내는 비생물 환경 조건입니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w005",
   "no": 5,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "숲의 구성 요소에서 살아 있지 않은 것을 고르세요.",
   "choices": [
    "버섯",
    "노루",
    "공기",
    "고사리",
    "딱정벌레"
   ],
   "key": 2,
   "answer": "③ 공기",
   "explanation": "공기는 비생물 요소입니다. 식물·동물·균류도 생물 요소에 속합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v052",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 4,
     "no": 2,
     "originalSet": 4,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceExplanation": "공기는 비생물 요소입니다. 식물·동물·균류도 생물 요소에 속합니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w006",
   "no": 6,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "구성 요소를 분류한 문장 중 옳지 않은 것을 고르세요.",
   "choices": [
    "버섯은 생물 요소이고 온도는 비생물 요소이다.",
    "개구리는 생물 요소이고 공기는 비생물 요소이다.",
    "물은 생물 요소이고 물풀은 비생물 요소이다.",
    "물풀은 생물 요소이고 햇빛은 비생물 요소이다.",
    "붕어는 생물 요소이고 물은 비생물 요소이다."
   ],
   "key": 2,
   "answer": "③ 물은 생물 요소이고 물풀은 비생물 요소이다.",
   "explanation": "물은 비생물 요소이고 물풀은 생물 요소입니다. 영향을 준다는 사실이 분류를 바꾸지는 않습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v053",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 4,
     "no": 3,
     "originalSet": 4,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceExplanation": "물은 비생물 요소이고 물풀은 생물 요소입니다. 영향을 준다는 사실이 분류를 바꾸지는 않습니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w007",
   "no": 7,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "자료에서 양분을 얻는 방법에 맞게 나눈 것을 고르세요.",
   "choices": [
    "생산자 토끼 / 소비자 잔디 / 분해자 곰팡이 A",
    "생산자 곰팡이 A / 소비자 토끼 / 분해자 잔디",
    "생산자 잔디 / 소비자 곰팡이 A / 분해자 토끼",
    "생산자 토끼 / 소비자 곰팡이 A / 분해자 잔디",
    "생산자 잔디 / 소비자 토끼 / 분해자 곰팡이 A"
   ],
   "key": 4,
   "answer": "⑤ 생산자 잔디 / 소비자 토끼 / 분해자 곰팡이 A",
   "explanation": "스스로 만드는 식물, 먹이를 먹는 소비자, 죽은 물질을 분해하는 균류를 구별합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v054",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 4,
     "no": 4,
     "originalSet": 4,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": {
    "자료": "잔디는 빛으로 양분을 만든다. 토끼는 잔디를 먹는다. 곰팡이 A는 죽은 물질을 분해해 양분을 얻는다."
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceExplanation": "스스로 만드는 식물, 먹이를 먹는 소비자, 죽은 물질을 분해하는 균류를 구별합니다.",
   "standard": "4과14-01",
   "figure": "given-c22-s42-u02-v054"
  },
  {
   "id": "c22-s42-u02-w008",
   "no": 8,
   "form": "written",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "연못가 갈대가 생산자에 속하는 까닭을 양분을 얻는 방법과 연결해 설명하세요.",
   "answer": "갈대는 햇빛을 이용해 필요한 양분을 스스로 만드므로 생산자입니다.",
   "explanation": "먹이를 잡는 것이 아니라 양분을 스스로 만드는 점을 근거로 설명합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "갈대가 생산자임을 밝히기 / 햇빛을 이용해 양분을 스스로 만드는 방법과 연결하기",
   "lines": 8,
   "sourceId": "c22-s42-u02-v003",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 1,
     "no": 3,
     "originalSet": 1,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "written-explanation",
    "sample": "갈대는 햇빛을 이용해 필요한 양분을 스스로 만드므로 생산자입니다.",
    "rubric": {
     "required": [
      "갈대가 생산자임을 밝히기",
      "햇빛을 이용해 양분을 스스로 만드는 방법과 연결하기"
     ],
     "pass": "채점 기준을 모두 담으면 정답"
    }
   },
   "sourceExplanation": "먹이를 잡는 것이 아니라 양분을 스스로 만드는 점을 근거로 설명합니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w009",
   "no": 9,
   "form": "short",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "하천의 물·돌과 물속 생물, 이들이 서로 주고받는 영향을 함께 조사했습니다. 조사한 전체를 가리키는 낱말을 쓰세요.",
   "answer": "생태계",
   "explanation": "생물과 주변 비생물 환경이 서로 영향을 주고받는 전체가 생태계입니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-v001",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 1,
     "no": 1,
     "originalSet": 1,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "short-text",
    "answer": "생태계",
    "accepted": [
     "생태계"
    ]
   },
   "sourceExplanation": "생물과 주변 비생물 환경이 서로 영향을 주고받는 전체가 생태계입니다.",
   "standard": "4과14-01",
   "accepted": [
    "생태계"
   ]
  },
  {
   "id": "c22-s42-u02-w010",
   "no": 10,
   "form": "short",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "숲 조사 카드에서 생물 요소 세 가지의 이름을 쓰세요.",
   "answer": "소나무, 다람쥐, 버섯",
   "explanation": "나무·동물·버섯은 모두 살아 있는 구성 요소입니다. 물·빛·온도와 구별합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-v002",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 1,
     "no": 2,
     "originalSet": 1,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": {
    "카드": "소나무, 빗물, 다람쥐, 햇빛, 버섯, 온도"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "소나무, 다람쥐, 버섯",
    "accepted": [
     "소나무, 다람쥐, 버섯",
     "소나무, 버섯, 다람쥐",
     "다람쥐, 소나무, 버섯",
     "다람쥐, 버섯, 소나무",
     "버섯, 소나무, 다람쥐",
     "버섯, 다람쥐, 소나무"
    ]
   },
   "sourceExplanation": "나무·동물·버섯은 모두 살아 있는 구성 요소입니다. 물·빛·온도와 구별합니다.",
   "standard": "4과14-01",
   "figure": "given-c22-s42-u02-v002",
   "accepted": [
    "소나무, 다람쥐, 버섯",
    "소나무, 버섯, 다람쥐",
    "다람쥐, 소나무, 버섯",
    "다람쥐, 버섯, 소나무",
    "버섯, 소나무, 다람쥐",
    "버섯, 다람쥐, 소나무"
   ]
  },
  {
   "id": "c22-s42-u02-w011",
   "no": 11,
   "form": "short",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "제시한 자료에 맞게 양분 얻는 방법을 분류한 것을 골라 기호를 쓰세요.",
   "answer": "ㄷ",
   "explanation": "이 자료의 세균은 죽은 물질을 분해하므로 분해자입니다. 세균의 모든 종류가 같은 역할이라는 뜻은 아닙니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-v018",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 2,
     "no": 3,
     "originalSet": 2,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": {
    "자료": "물풀: 빛으로 양분을 만듦 / 우렁이: 물풀을 먹음 / 세균 A: 죽은 물질을 분해함",
    "보기": [
     "ㄱ. 물풀 - 소비자",
     "ㄴ. 우렁이 - 생산자",
     "ㄷ. 세균 A - 분해자"
    ]
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "ㄷ",
    "accepted": [
     "ㄷ"
    ]
   },
   "sourceExplanation": "이 자료의 세균은 죽은 물질을 분해하므로 분해자입니다. 세균의 모든 종류가 같은 역할이라는 뜻은 아닙니다.",
   "standard": "4과14-01",
   "figure": "given-c22-s42-u02-v018",
   "accepted": [
    "ㄷ"
   ]
  },
  {
   "id": "c22-s42-u02-w012",
   "no": 12,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "연습 기록에서 생물과 환경의 관계를 나타낸 것을 고르세요.",
   "choices": [
    "기록지에 붙인 스티커 수를 세었다.",
    "빛 조건별로 풀 상태를 비교했다.",
    "공책의 표지 색을 친구와 맞추었다.",
    "발표 제목의 글자 수만 세어 적었다.",
    "조사자의 신발 크기를 서로 비교했다."
   ],
   "key": 1,
   "answer": "② 빛 조건별로 풀 상태를 비교했다.",
   "explanation": "빛이라는 환경과 생물의 상태를 함께 살핀 기록입니다. 인과관계를 확정하려면 다른 조건도 확인해야 합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b03",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceExplanation": "빛이라는 환경과 생물의 상태를 함께 살핀 기록입니다. 인과관계를 확정하려면 다른 조건도 확인해야 합니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w013",
   "no": 13,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "흙을 비생물 요소로 분류한 뒤 붙일 설명으로 알맞은 것을 고르세요.",
   "choices": [
    "흙은 식물과 관계를 맺을 수 없다.",
    "흙 속의 모든 것은 살아 있지 않다.",
    "흙에 물이 들어가면 생물 요소가 된다.",
    "흙 속에는 지렁이 등 생물도 살 수 있다.",
    "지렁이는 흙에 살아 비생물 요소가 된다."
   ],
   "key": 3,
   "answer": "④ 흙 속에는 지렁이 등 생물도 살 수 있다.",
   "explanation": "환경으로서의 흙을 분류하는 것과 흙에 사는 생물을 분류하는 것은 다릅니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b07",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceExplanation": "환경으로서의 흙을 분류하는 것과 흙에 사는 생물을 분류하는 것은 다릅니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w014",
   "no": 14,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "자료에서 생산자 역할을 한 생물을 고르세요.",
   "choices": [
    "물풀 A",
    "잠자리 E",
    "작은 물고기 B",
    "우렁이 D",
    "큰 물고기 C"
   ],
   "key": 0,
   "answer": "① 물풀 A",
   "explanation": "A가 양분을 스스로 만든다고 제시되어 있습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b12",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": {
    "자료": "A는 빛을 이용해 양분을 만든다. B와 D는 A를 먹고 C는 B를 먹는다. E는 다른 작은 동물을 먹는다."
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceExplanation": "A가 양분을 스스로 만든다고 제시되어 있습니다.",
   "standard": "4과14-01",
   "figure": "given-c22-s42-u02-b12"
  },
  {
   "id": "c22-s42-u02-w015",
   "no": 15,
   "form": "choice",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "땅에 산다는 이유만으로 지렁이를 분해자로 정한 의견을 고칠 말을 고르세요.",
   "choices": [
    "흙에 사는 생물은 모두 비생물로 분류하자.",
    "움직임이 작으면 생산자로 분류하자.",
    "길이가 긴 생물은 모두 분해자로 정하자.",
    "같은 흙에 있으면 같은 역할로 정하자.",
    "사는 곳보다 양분을 얻는 방법을 확인하자."
   ],
   "key": 4,
   "answer": "⑤ 사는 곳보다 양분을 얻는 방법을 확인하자.",
   "explanation": "사는 곳이나 몸 모양 하나로 역할을 정하지 않습니다. 지렁이의 물질 섭취와 미생물의 분해를 그대로 같게 보지 않습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b18",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceExplanation": "사는 곳이나 몸 모양 하나로 역할을 정하지 않습니다. 지렁이의 물질 섭취와 미생물의 분해를 그대로 같게 보지 않습니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w016",
   "no": 16,
   "form": "short",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "죽은 나뭇잎의 물질을 분해해 양분을 얻는 곰팡이 A의 역할 이름을 쓰세요.",
   "answer": "분해자",
   "explanation": "주어진 양분 얻는 방법을 근거로 분류합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-b19",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "short-text",
    "answer": "분해자",
    "accepted": [
     "분해자"
    ]
   },
   "sourceExplanation": "주어진 양분 얻는 방법을 근거로 분류합니다.",
   "standard": "4과14-01",
   "accepted": [
    "분해자"
   ]
  },
  {
   "id": "c22-s42-u02-w017",
   "no": 17,
   "form": "written",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "학교 화단을 생태계로 조사할 때 식물 이름 외에 무엇을 함께 살필지 두 가지와 까닭을 쓰세요.",
   "answer": "빛이 드는 정도와 흙의 마른 정도를 함께 살핍니다. 식물이 주변 환경과 관계를 맺고 살아가기 때문입니다.",
   "explanation": "여러 타당한 조사 항목을 허용합니다. 실제로 조사한 것처럼 결과를 지어내지 않습니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "비생물 환경 또는 다른 생물 중 타당한 두 항목 제시 / 생물과 주변 환경의 관계로 조사 이유 설명",
   "lines": 8,
   "sourceId": "c22-s42-u02-b05",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "written-explanation",
    "sample": "빛이 드는 정도와 흙의 마른 정도를 함께 살핍니다. 식물이 주변 환경과 관계를 맺고 살아가기 때문입니다.",
    "rubric": {
     "required": [
      "비생물 환경 또는 다른 생물 중 타당한 두 항목 제시",
      "생물과 주변 환경의 관계로 조사 이유 설명"
     ],
     "pass": "타당한 근거·대안은 교사 확인"
    }
   },
   "sourceExplanation": "여러 타당한 조사 항목을 허용합니다. 실제로 조사한 것처럼 결과를 지어내지 않습니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w018",
   "no": 18,
   "form": "written",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "버섯과 바위를 각각 분류하고, 왜 둘을 다르게 분류했는지 설명하세요.",
   "answer": "버섯은 살아 있는 생물 요소이고 바위는 비생물 요소입니다. 움직임이 보이지 않아도 버섯은 생물입니다.",
   "explanation": "스스로 장소를 옮기지 않는다는 이유만으로 버섯과 바위를 같은 비생물 요소로 분류하지 않습니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "버섯을 생물 요소로 분류 / 바위를 비생물 요소로 분류 / 살아 있음과 연결한 이유 설명",
   "lines": 8,
   "sourceId": "c22-s42-u02-b10",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "written-explanation",
    "sample": "버섯은 살아 있는 생물 요소이고 바위는 비생물 요소입니다. 움직임이 보이지 않아도 버섯은 생물입니다.",
    "rubric": {
     "required": [
      "버섯을 생물 요소로 분류",
      "바위를 비생물 요소로 분류",
      "살아 있음과 연결한 이유 설명"
     ],
     "pass": "타당한 근거·대안은 교사 확인"
    }
   },
   "sourceExplanation": "스스로 장소를 옮기지 않는다는 이유만으로 버섯과 바위를 같은 비생물 요소로 분류하지 않습니다.",
   "standard": "4과14-01"
  },
  {
   "id": "c22-s42-u02-w019",
   "no": 19,
   "form": "written",
   "topic": "생태계 구성·양분 역할 분류",
   "prompt": "토끼와 곰팡이 A가 양분을 얻는 방법을 비교해 설명하세요.",
   "answer": "토끼는 풀을 먹어 양분을 얻는 소비자이고 곰팡이 A는 죽은 나무의 물질을 분해해 양분을 얻는 분해자입니다.",
   "explanation": "같은 장소에 살더라도 생태계에서 맡는 역할은 다를 수 있습니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "토끼의 먹이 섭취와 소비자 연결 / 제시된 곰팡이의 분해와 분해자 연결",
   "lines": 8,
   "sourceId": "c22-s42-u02-b20",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": {
    "자료": "토끼가 풀을 먹는다. 곰팡이 A가 죽은 나무의 물질을 분해한다."
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "토끼는 풀을 먹어 양분을 얻는 소비자이고 곰팡이 A는 죽은 나무의 물질을 분해해 양분을 얻는 분해자입니다.",
    "rubric": {
     "required": [
      "토끼의 먹이 섭취와 소비자 연결",
      "제시된 곰팡이의 분해와 분해자 연결"
     ],
     "pass": "타당한 근거·대안은 교사 확인"
    }
   },
   "sourceExplanation": "같은 장소에 살더라도 생태계에서 맡는 역할은 다를 수 있습니다.",
   "standard": "4과14-01",
   "figure": "given-c22-s42-u02-b20"
  },
  {
   "id": "c22-s42-u02-w020",
   "no": 20,
   "form": "choice",
   "topic": "사진에서 확인한 사실",
   "prompt": "제공 사진에서 직접 확인할 수 있는 사실을 고르세요.",
   "answer": "① 나무와 물이 보인다",
   "explanation": "사진에서 보이는 대상과 사진 밖의 정보·정밀 측정은 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-01",
   "choices": [
    "나무와 물이 보인다",
    "사진 속 나무는 모두 같은 종류이다",
    "맑아 보이는 물에는 오염 물질이 없다",
    "사진에 안 보이는 동물은 이곳에 살지 않는다",
    "물 가까이 있는 생물은 모두 물속에서 산다"
   ],
   "key": 0,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoHabitat"
  },
  {
   "id": "c22-s42-u02-w021",
   "no": 21,
   "form": "choice",
   "topic": "역할 판단의 근거",
   "prompt": "조사 카드의 분류를 점검할 때 적용할 기준을 고르세요.",
   "answer": "④ 양분을 얻는 방법",
   "explanation": "빛으로 만들기·먹이 섭취·죽은 물질 분해라는 설명을 근거로 분류해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-01",
   "choices": [
    "물속과 육지 중 사는 곳",
    "스스로 장소를 옮기는지",
    "햇빛을 받는 곳에 사는지",
    "양분을 얻는 방법",
    "몸이 초록색인지 아닌지"
   ],
   "key": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoRoleCards"
  },
  {
   "id": "c22-s42-u02-w022",
   "no": 22,
   "form": "multi",
   "topic": "생물과 환경의 구별",
   "prompt": "타당한 분류 설명을 모두 고르세요.",
   "answer": "②, ④",
   "explanation": "움직임이나 사는 곳보다 생물인지 환경 요소인지 기준을 확인해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "걸어 다니지 않는 버섯은 비생물이다",
    "흙이라는 환경 안에도 생물이 살 수 있다",
    "햇빛을 이용하는 나무의 빛도 생물이다",
    "버섯은 살아 있는 생물 요소이다",
    "한 장소의 구성 요소는 모두 같은 역할이다"
   ],
   "key": [
    1,
    3
   ],
   "standard": "4과14-01",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w023",
   "no": 23,
   "form": "blank",
   "topic": "생태계의 구성",
   "prompt": "나무·동물·버섯은 ㉠[ ] 요소, 물·공기·햇빛은 ㉡[ ] 요소예요.",
   "answer": "㉠ 생물 · ㉡ 비생물",
   "explanation": "살아 있는 구성 요소와 주변 환경을 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-01",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w024",
   "no": 24,
   "form": "blank",
   "topic": "양분 역할의 기준",
   "prompt": "생물을 역할로 나눌 때는 ㉠[ ]을 얻는 방법을 살펴요. 벼처럼 빛을 이용해 스스로 만드는 생물은 ㉡[ ]예요.",
   "answer": "㉠ 양분 · ㉡ 생산자",
   "explanation": "사는 곳·몸 크기보다 양분을 얻는 방법이 기준이에요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-01",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w025",
   "no": 25,
   "form": "blank",
   "topic": "분해자의 작용",
   "prompt": "곰팡이 A가 죽은 나뭇잎의 물질을 ㉠[ ]하며 양분을 얻는다면, 이 자료에서 A의 역할은 ㉡[ ]예요.",
   "answer": "㉠ 분해 · ㉡ 분해자",
   "explanation": "곰팡이 A의 주어진 작용을 근거로 분류해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-01",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w026",
   "no": 26,
   "form": "match",
   "topic": "양분 얻는 방법 연결",
   "prompt": "제공된 작용과 역할을 연결하세요.",
   "answer": "㉠-③ · ㉡-① · ㉢-②",
   "explanation": "주어진 양분 얻는 방법을 근거로 생산자·소비자·분해자를 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "parts": [
    "㉠ 벼가 빛을 이용해 양분을 만든다",
    "㉡ 메뚜기가 식물을 먹는다",
    "㉢ 곰팡이 A가 죽은 물질을 분해한다"
   ],
   "answerPerPart": true,
   "standard": "4과14-01",
   "given": [
    "① 소비자  ② 분해자  ③ 생산자"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w027",
   "no": 27,
   "form": "order",
   "topic": "조사하고 분류하는 계획",
   "prompt": "교사와 안전한 조사 구역을 정했습니다. 다음 계획의 순서를 쓰세요.",
   "answer": "㉡→㉣→㉠→㉢",
   "explanation": "관찰한 근거를 남긴 뒤 분류하고 미확인을 설명하는 계획이에요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "given": [
    "㉠ 기록에 근거해 생물·비생물로 나누기",
    "㉡ 정한 범위에서 생물과 주변 환경을 함께 관찰하기",
    "㉢ 분류 이유와 모르는 대상을 설명하기",
    "㉣ 실제 날짜·대상·위치 관계를 기록하기"
   ],
   "standard": "4과14-01",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "order",
    "teacherRequired": false,
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s42-u02-w028",
   "no": 28,
   "form": "draw",
   "topic": "구성 요소 관계 지도",
   "prompt": "제공 목록으로 생태계 구성 지도를 그리세요. 생물 요소와 비생물 요소를 나누고, 서로 관계를 맺을 수 있는 예 하나를 말풍선으로 표시하세요. 실제 조사 결과가 아님을 밝혀요.",
   "answer": "나무·개미·버섯은 생물, 물·햇빛·흙은 비생물로 나누고 나무가 빛·물을 이용하는 등 타당한 관계를 표시한다. 제공 목록을 이용한 관계 지도로 밝힌다.",
   "explanation": "죽은 물체나 흙 안의 생물과 환경으로서의 흙을 혼동하지 않아요. 관계는 타당한 다른 예도 인정해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "두 요소의 분류 / 타당한 관계 예 / 제공 자료임을 표시",
   "drawing": "large",
   "standard": "4과14-01",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "orderSensitive": false
   },
   "drawingExplanationLines": 3,
   "contextFigure": "ecoSurveyCards"
  },
  {
   "id": "c22-s42-u02-w029",
   "no": 29,
   "form": "choice",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "같은 풀을 먹는 토끼와 들쥐를 여우가 먹는 등 여러 먹이 사슬이 연결된 모형의 이름을 고르세요.",
   "choices": [
    "생활 계획표",
    "서식지 지도",
    "먹이그물",
    "날씨 기록",
    "생물 도감"
   ],
   "key": 2,
   "answer": "③ 먹이그물",
   "explanation": "여러 먹이 사슬이 연결되어 그물처럼 된 먹이 관계를 먹이그물이라고 합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v020",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 2,
     "no": 5,
     "originalSet": 2,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceExplanation": "여러 먹이 사슬이 연결되어 그물처럼 된 먹이 관계를 먹이그물이라고 합니다.",
   "standard": "4과14-02"
  },
  {
   "id": "c22-s42-u02-w030",
   "no": 30,
   "form": "choice",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "자료를 먹히는 쪽에서 먹는 쪽으로 연결한 것을 고르세요.",
   "choices": [
    "상추 → 새 A → 달팽이",
    "상추 → 달팽이 → 새 A",
    "새 A → 달팽이 → 상추",
    "달팽이 → 상추 → 새 A",
    "새 A → 상추 → 달팽이"
   ],
   "key": 1,
   "answer": "② 상추 → 달팽이 → 새 A",
   "explanation": "상추를 달팽이가 먹고 달팽이를 새가 먹으므로 화살표는 상추에서 달팽이, 새로 이어집니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v021",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 2,
     "no": 6,
     "originalSet": 2,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": {
    "자료": "달팽이는 상추를 먹고, 새 A는 달팽이를 먹습니다."
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceExplanation": "상추를 달팽이가 먹고 달팽이를 새가 먹으므로 화살표는 상추에서 달팽이, 새로 이어집니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-v021"
  },
  {
   "id": "c22-s42-u02-w031",
   "no": 31,
   "form": "choice",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "연습 모형의 먹이 관계를 바르게 연결한 것을 고르세요.",
   "choices": [
    "A → 물풀 → B",
    "물풀 → A → B",
    "B → A → 물풀",
    "B → 물풀 → A",
    "물풀 → B → A"
   ],
   "key": 1,
   "answer": "② 물풀 → A → B",
   "explanation": "물풀을 먹는 작은 물고기와 이를 먹는 큰 물고기의 순서입니다. 모든 물고기의 먹이가 같다는 뜻은 아닙니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v037",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 3,
     "no": 7,
     "originalSet": 3,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": {
    "자료": "작은 물고기 A는 물풀을 먹고, 큰 물고기 B는 A를 먹습니다."
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceExplanation": "물풀을 먹는 작은 물고기와 이를 먹는 큰 물고기의 순서입니다. 모든 물고기의 먹이가 같다는 뜻은 아닙니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-v037"
  },
  {
   "id": "c22-s42-u02-w032",
   "no": 32,
   "form": "choice",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "제시한 먹이그물에서 알 수 없는 것을 고르세요.",
   "choices": [
    "뱀이 먹는 생물",
    "개구리가 먹는 생물",
    "여러 사슬의 연결",
    "뱀의 실제 개체 수",
    "풀이 먹히는 연결"
   ],
   "key": 3,
   "answer": "④ 뱀의 실제 개체 수",
   "explanation": "그림에 없는 실제 개체 수는 연결만으로 알 수 없습니다. 먹이 관계 모형은 생태계의 모든 정보를 담지 않습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v038",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 3,
     "no": 8,
     "originalSet": 3,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": {
    "먹이그물": "풀 → 메뚜기 → 개구리 / 풀 → 들쥐 → 뱀 / 개구리 → 뱀"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceExplanation": "그림에 없는 실제 개체 수는 연결만으로 알 수 없습니다. 먹이 관계 모형은 생태계의 모든 정보를 담지 않습니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-v038"
  },
  {
   "id": "c22-s42-u02-w033",
   "no": 33,
   "form": "short",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "연습 자료의 이름을 먹히는 쪽에서 먹는 쪽으로 순서대로 쓰세요.",
   "answer": "참나무 잎 → 애벌레 → 박새 → 매",
   "explanation": "각 문장의 먹는 쪽과 먹히는 쪽을 확인해 한 사슬로 연결합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-v058",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 4,
     "no": 8,
     "originalSet": 4,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": {
    "자료": [
     "애벌레는 참나무 잎을 먹는다.",
     "매는 박새를 먹는다.",
     "박새는 애벌레를 먹는다."
    ]
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "참나무 잎 → 애벌레 → 박새 → 매",
    "accepted": [
     "참나무 잎 → 애벌레 → 박새 → 매",
     "참나무 잎, 애벌레, 박새, 매"
    ]
   },
   "sourceExplanation": "각 문장의 먹는 쪽과 먹히는 쪽을 확인해 한 사슬로 연결합니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-v058",
   "accepted": [
    "참나무 잎 → 애벌레 → 박새 → 매",
    "참나무 잎, 애벌레, 박새, 매"
   ]
  },
  {
   "id": "c22-s42-u02-w034",
   "no": 34,
   "form": "choice",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "먹이그물에서 뱀이 먹는 생물로만 묶은 것을 고르세요.",
   "choices": [
    "개구리·들쥐",
    "풀·들쥐",
    "메뚜기·들쥐",
    "풀·메뚜기",
    "풀·개구리"
   ],
   "key": 0,
   "answer": "① 개구리·들쥐",
   "explanation": "뱀으로 들어오는 두 화살표를 확인합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b26",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": {
    "모형": "풀 → 메뚜기 → 개구리 → 뱀 / 풀 → 들쥐 → 뱀"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceExplanation": "뱀으로 들어오는 두 화살표를 확인합니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-b26"
  },
  {
   "id": "c22-s42-u02-w035",
   "no": 35,
   "form": "choice",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "메뚜기가 줄었을 때 개구리가 이용할 수 있는 다른 먹이를 고르세요.",
   "choices": [
    "풀",
    "바위",
    "햇빛",
    "뱀",
    "파리"
   ],
   "key": 4,
   "answer": "⑤ 파리",
   "explanation": "이 모형에서 파리가 개구리로 연결됩니다. 대체 먹이가 있어도 양과 다른 조건에 따라 생존은 달라질 수 있습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b31",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": {
    "모형": "풀 → 메뚜기 → 개구리 → 뱀 / 파리 → 개구리"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceExplanation": "이 모형에서 파리가 개구리로 연결됩니다. 대체 먹이가 있어도 양과 다른 조건에 따라 생존은 달라질 수 있습니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-b31"
  },
  {
   "id": "c22-s42-u02-w036",
   "no": 36,
   "form": "choice",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "카드로 만든 먹이그물 모형의 한계로 알맞은 것을 고르세요.",
   "choices": [
    "먹고 먹히는 관계는 전혀 나타낼 수 없다.",
    "카드를 움직이면 현장 조사도 완료된다.",
    "생물의 실제 수와 모든 관계를 담지는 못한다.",
    "모형은 실제 생태계와 모든 점이 같다.",
    "화살표를 그리면 실제 생물이 늘어난다."
   ],
   "key": 2,
   "answer": "③ 생물의 실제 수와 모든 관계를 담지는 못한다.",
   "explanation": "모형은 목적에 맞춰 일부 관계를 나타낸 것입니다. 실제 조사나 실천을 대신하지 않습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b37",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceExplanation": "모형은 목적에 맞춰 일부 관계를 나타낸 것입니다. 실제 조사나 실천을 대신하지 않습니다.",
   "standard": "4과14-02"
  },
  {
   "id": "c22-s42-u02-w037",
   "no": 37,
   "form": "short",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "제시한 그물에서 두 먹이 사슬에 공통으로 들어가는 소비자 이름을 쓰세요.",
   "answer": "여우",
   "explanation": "두 경로 모두 여우로 이어집니다. 풀은 생산자이므로 질문의 소비자 조건과 구별합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-b29",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": {
    "그물": "풀 → 토끼 → 여우 / 풀 → 들쥐 → 여우"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "여우",
    "accepted": [
     "여우"
    ]
   },
   "sourceExplanation": "두 경로 모두 여우로 이어집니다. 풀은 생산자이므로 질문의 소비자 조건과 구별합니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-b29",
   "accepted": [
    "여우"
   ]
  },
  {
   "id": "c22-s42-u02-w038",
   "no": 38,
   "form": "written",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "친구가 만든 화살표의 오류를 고치고 까닭을 설명하세요.",
   "answer": "메뚜기 → 개구리로 고칩니다. 개구리가 메뚜기를 먹으므로 먹히는 메뚜기에서 먹는 개구리로 향해야 합니다.",
   "explanation": "화살표를 따라 누가 쫓아가는지를 표현하는 그림과 구별합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "메뚜기에서 개구리로 화살표 수정 / 먹히는 쪽에서 먹는 쪽이라는 근거",
   "lines": 8,
   "sourceId": "c22-s42-u02-b25",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": {
    "친구의 모형": "개구리 → 메뚜기",
    "조사 자료": "개구리가 메뚜기를 먹는다."
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "메뚜기 → 개구리로 고칩니다. 개구리가 메뚜기를 먹으므로 먹히는 메뚜기에서 먹는 개구리로 향해야 합니다.",
    "rubric": {
     "required": [
      "메뚜기에서 개구리로 화살표 수정",
      "먹히는 쪽에서 먹는 쪽이라는 근거"
     ],
     "pass": "타당한 근거·대안은 교사 확인"
    }
   },
   "sourceExplanation": "화살표를 따라 누가 쫓아가는지를 표현하는 그림과 구별합니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-b25"
  },
  {
   "id": "c22-s42-u02-w039",
   "no": 39,
   "form": "written",
   "topic": "먹이 관계·먹이그물 모형",
   "prompt": "한 먹이가 줄어도 모두 안전하다고 한 친구의 주장을 자료를 이용해 보완하세요.",
   "answer": "다른 먹이가 있으면 도움이 될 수 있지만, 그 먹이의 양이나 다른 환경도 확인해야 합니다. 그물만 보고 모두 반드시 살아남는다고 말할 수는 없습니다.",
   "explanation": "복잡한 그물이 유리한 까닭과 관찰의 한계를 함께 설명합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "대체 먹이의 도움 인정 / 양 또는 환경 등 추가 조건 제시 / 생존을 무조건 보장하지 않음",
   "lines": 8,
   "sourceId": "c22-s42-u02-b35",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": {
    "친구의 주장": "먹이그물에는 다른 길이 있으니 한 먹이가 줄어도 모든 생물이 반드시 살아남아."
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "다른 먹이가 있으면 도움이 될 수 있지만, 그 먹이의 양이나 다른 환경도 확인해야 합니다. 그물만 보고 모두 반드시 살아남는다고 말할 수는 없습니다.",
    "rubric": {
     "required": [
      "대체 먹이의 도움 인정",
      "양 또는 환경 등 추가 조건 제시",
      "생존을 무조건 보장하지 않음"
     ],
     "pass": "타당한 근거·대안은 교사 확인"
    }
   },
   "sourceExplanation": "복잡한 그물이 유리한 까닭과 관찰의 한계를 함께 설명합니다.",
   "standard": "4과14-02",
   "figure": "given-c22-s42-u02-b35"
  },
  {
   "id": "c22-s42-u02-w040",
   "no": 40,
   "form": "choice",
   "topic": "모형의 두 조건 비교",
   "prompt": "제공된 두 조건에서 알 수 있는 경향을 고르세요.",
   "answer": "① 여우가 없는 쪽은 토끼 수가 더 크고 풀 수는 더 작다",
   "explanation": "그대로 조건의 풀·토끼 수를 여우가 없어진 조건과 각각 비교해요. 이 모형에서는 토끼 수는 더 크고 풀 수는 더 작아요. 두 수의 변화 방향을 따로 읽으며 실제 개체 수의 예측으로 넓히지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-02",
   "choices": [
    "여우가 없는 쪽은 토끼 수가 더 크고 풀 수는 더 작다",
    "여우가 없는 쪽은 풀과 토끼의 수가 모두 더 크다",
    "여우가 없는 쪽은 토끼 수가 더 작고 풀 수는 더 크다",
    "여우가 없는 쪽은 풀과 토끼의 수가 모두 더 작다",
    "여우가 없는 쪽은 풀 수만 작고 토끼 수는 같다"
   ],
   "key": 0,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoMeadow"
  },
  {
   "id": "c22-s42-u02-w041",
   "no": 41,
   "form": "choice",
   "topic": "남아 있는 먹이 경로",
   "prompt": "제공 그물에서 개구리가 줄었을 때 뱀에게 남은 먹이 경로를 고르세요.",
   "answer": "③ 작은 새 → 뱀",
   "explanation": "제공된 여섯 관계에는 작은 새→뱀이 있어요. 뱀→작은 새는 방향이 뒤집혔고, 메뚜기→뱀·풀→뱀·개구리→작은 새는 이 자료에 없는 연결이에요. 남은 경로의 먹이 양과 환경은 더 살펴야 해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-02",
   "choices": [
    "뱀 → 작은 새",
    "메뚜기 → 뱀",
    "작은 새 → 뱀",
    "풀 → 뱀",
    "개구리 → 작은 새"
   ],
   "key": 2,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoWeb"
  },
  {
   "id": "c22-s42-u02-w042",
   "no": 42,
   "form": "multi",
   "topic": "자료에 맞는 화살표",
   "prompt": "제공한 여섯 관계와 맞는 화살표를 모두 고르세요.",
   "answer": "①, ③, ⑤",
   "explanation": "먹히는 쪽에서 먹는 쪽으로 이어요. 제공한 여섯 관계와 대조하면 풀→메뚜기, 애벌레→작은 새, 개구리→뱀이 맞고 나머지 둘은 방향이 뒤집혔어요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "풀 → 메뚜기",
    "메뚜기 → 풀",
    "애벌레 → 작은 새",
    "뱀 → 개구리",
    "개구리 → 뱀"
   ],
   "key": [
    0,
    2,
    4
   ],
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoChains"
  },
  {
   "id": "c22-s42-u02-w043",
   "no": 43,
   "form": "multi",
   "topic": "공통 카드로 연결하기",
   "prompt": "두 사슬을 한 먹이그물로 만드는 타당한 방법을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "같은 풀과 뱀을 각각 한 연결점으로 사용하고 여섯 관계를 모두 보존해요. 공통 이름이 있다고 관계를 지우거나 다른 생물로 바꾸지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "풀 카드 한 장을 두 사슬의 연결점으로 쓴다",
    "제공한 여섯 관계를 모두 남긴다",
    "사슬마다 뱀을 다른 생물로 바꾸어 적는다",
    "뱀 카드 한 장에 두 먹이 경로를 잇는다",
    "같은 생물이 나오면 그 생물의 관계는 지운다"
   ],
   "key": [
    0,
    1,
    3
   ],
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoChains"
  },
  {
   "id": "c22-s42-u02-w044",
   "no": 44,
   "form": "multi",
   "topic": "다른 경로의 도움과 한계",
   "prompt": "개구리가 줄었을 때 이 그물에 맞는 설명을 모두 고르세요.",
   "answer": "①, ⑤",
   "explanation": "다른 경로가 도움을 줄 가능성과 생존 보장은 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "작은 새를 먹는 경로가 뱀에게 남아 있다",
    "먹이 경로가 하나 남으면 뱀의 생존은 보장된다",
    "개구리가 줄면 자료에 없던 메뚜기→뱀 선을 더한다",
    "먹이그물은 모든 생물의 수가 일정함을 뜻한다",
    "남은 먹이의 양과 주변 환경도 더 확인한다"
   ],
   "key": [
    0,
    4
   ],
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoChains"
  },
  {
   "id": "c22-s42-u02-w045",
   "no": 45,
   "form": "multi",
   "topic": "수치 모형의 한계",
   "prompt": "토끼가 없어진 조건에서도 화면은 3년 뒤 여우 1을 표시합니다. 알맞은 판단을 모두 고르세요.",
   "answer": "②, ③, ⑤",
   "explanation": "화면의 3년 뒤 수는 미리 정한 연습 값이며 실측이나 실제 생존 기간의 계산 결과가 아니에요. 실제 생존에는 먹이와 환경 자료가 더 필요해요. 생태계의 수가 반드시 처음 값으로 돌아온다는 뜻도 아니에요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "화면의 여우 1은 먹이 없이 3년 생존했다는 실측이다",
    "이 수는 경향 비교를 위해 미리 정한 연습 값이다",
    "실제 생존을 알려면 먹이와 환경 자료가 더 필요하다",
    "모든 생태계는 변화 뒤 반드시 처음 수로 돌아온다",
    "이 모형만으로 실제 생존 기간을 정할 수 없다"
   ],
   "key": [
    1,
    2,
    4
   ],
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w046",
   "no": 46,
   "form": "blank",
   "topic": "화살표 약속",
   "prompt": "먹이 관계의 화살표는 ㉠[ ] 쪽에서 ㉡[ ] 쪽을 향해요.",
   "answer": "㉠ 먹히는 · ㉡ 먹는",
   "explanation": "누가 누구를 쫓는 방향과 혼동하지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w047",
   "no": 47,
   "form": "blank",
   "topic": "사슬과 그물",
   "prompt": "먹고 먹히는 관계를 한 줄로 이은 것을 ㉠[ ], 여러 사슬이 얽혀 연결된 것을 ㉡[ ]이라고 해요.",
   "answer": "㉠ 먹이 사슬 · ㉡ 먹이그물",
   "explanation": "한 줄의 연결과 여러 경로가 얽힌 연결을 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w048",
   "no": 48,
   "form": "blank",
   "topic": "같은 생물 연결",
   "prompt": "여러 사슬에서 같은 생물은 공통 ㉠[ ]으로 사용해요. 카드 한 장이 실제 생물 한 ㉡[ ]를 뜻하는 것은 아니에요.",
   "answer": "㉠ 연결점 · ㉡ 개체",
   "explanation": "생물의 종류를 나타내는 이름표와 개체 수를 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w049",
   "no": 49,
   "form": "blank",
   "topic": "남아 있는 경로",
   "prompt": "제공한 그물에서 개구리가 줄면 뱀에게는 ㉠[ ]를 먹는 경로가 남아요. 실제 영향을 알려면 먹이의 ㉡[ ]과 환경도 살펴요.",
   "answer": "㉠ 작은 새 · ㉡ 양",
   "explanation": "경로가 있다는 사실만으로 충분한 먹이나 생존을 보장하지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoWeb"
  },
  {
   "id": "c22-s42-u02-w050",
   "no": 50,
   "form": "match",
   "topic": "화살표로 바꾸기",
   "prompt": "제공된 먹는 관계와 알맞은 연결을 짝지으세요.",
   "answer": "㉠-② · ㉡-③ · ㉢-①",
   "explanation": "먹히는 쪽에서 먹는 쪽으로 관계를 바꾸어 나타내요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "parts": [
    "㉠ 메뚜기가 풀을 먹는다",
    "㉡ 개구리가 메뚜기를 먹는다",
    "㉢ 뱀이 개구리를 먹는다"
   ],
   "answerPerPart": true,
   "standard": "4과14-02",
   "given": [
    "① 개구리 → 뱀  ② 풀 → 메뚜기  ③ 메뚜기 → 개구리"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w051",
   "no": 51,
   "form": "match",
   "topic": "모형 요소의 뜻",
   "prompt": "카드 모형의 요소와 뜻을 연결하세요.",
   "answer": "㉠-③ · ㉡-① · ㉢-②",
   "explanation": "카드 수를 개체 수로 세지 않고 연결의 목적을 확인해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "parts": [
    "㉠ 생물 이름표 한 장",
    "㉡ 먹히는 쪽에서 먹는 쪽으로 잇는 화살표",
    "㉢ 풀과 뱀을 공통으로 사용한 두 사슬"
   ],
   "answerPerPart": true,
   "standard": "4과14-02",
   "given": [
    "① 제공한 먹이 관계  ② 여러 사슬이 얽힌 먹이그물  ③ 나타내려는 생물의 이름"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w052",
   "no": 52,
   "form": "order",
   "topic": "먹이그물 실제 만들기",
   "prompt": "먹이 관계 자료를 확보했습니다. 이 계획의 순서를 쓰세요.",
   "answer": "㉣→㉡→㉢→㉠",
   "explanation": "자료 확인·준비·제작·대조 수정을 이어 가요. 계획만 쓰고 제작 완료로 세지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "given": [
    "㉠ 자료와 대조해 빠진 선·뒤집힌 선 고치기",
    "㉡ 이름 카드·화살표와 배치를 준비하기",
    "㉢ 공통 카드를 사용해 실제로 연결하기",
    "㉣ 자료에서 먹히는 쪽과 먹는 쪽 확인하기"
   ],
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "order",
    "teacherRequired": false,
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s42-u02-w053",
   "no": 53,
   "form": "order",
   "topic": "새 조사와 모형 수정",
   "prompt": "새 자료가 이전 모형과 달라 이 계획으로 확인하려 합니다. 순서를 쓰세요.",
   "answer": "㉢→㉠→㉣→㉡",
   "explanation": "자료 범위를 확인한 다음 차이를 비교해 수정하고 아직 모르는 점을 밝혀요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "given": [
    "㉠ 이전 자료·모형과 어떤 연결이 다른지 비교하기",
    "㉡ 수정한 관계와 아직 미확인인 관계 설명하기",
    "㉢ 새 자료의 대상·시기·관계 근거 확인하기",
    "㉣ 근거가 확인된 관계를 모형에서 실제로 고치기"
   ],
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "order",
    "teacherRequired": false,
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s42-u02-w054",
   "no": 54,
   "form": "draw",
   "topic": "먹이그물 모형 설계",
   "prompt": "제공한 두 사슬을 하나의 먹이그물로 그리세요. 같은 생물의 이름표를 한 번씩 쓰고, 자료의 여섯 관계와 화살표 방향을 모두 보존하세요.",
   "answer": "풀·메뚜기·애벌레·개구리·작은 새·뱀을 한 번씩 놓고 풀→메뚜기, 풀→애벌레, 메뚜기→개구리, 애벌레→작은 새, 개구리→뱀, 작은 새→뱀의 여섯 관계를 표시한다.",
   "explanation": "그림 배치는 달라도 관계와 방향이 맞으면 인정해요. 뒤에는 카드로 실제 만들어 점검하고 설계와 제작을 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "이름표6개 / 관계6개 / 먹히는 쪽→먹는 쪽 / 공통 연결점",
   "drawing": "large",
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "orderSensitive": false
   },
   "drawingExplanationLines": 3,
   "contextFigure": "ecoChains"
  },
  {
   "id": "c22-s42-u02-w055",
   "no": 55,
   "form": "draw",
   "topic": "잘못된 연결 고치기",
   "prompt": "친구의 세 화살표를 제공된 관계에 맞게 고쳐 한 사슬로 그리세요. 먹히는 쪽과 먹는 쪽을 표시하고 고친 까닭을 짧게 쓰세요.",
   "answer": "풀→메뚜기→개구리→뱀으로 그린다. 모두 제공한 먹는 관계에서 먹히는 쪽→먹는 쪽으로 바꿨음을 설명한다.",
   "explanation": "동물 그림을 잘 그리는지보다 관계와 화살표의 뜻을 이해했는지 확인해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "네 이름 / 세 방향 수정 / 먹히는·먹는 쪽 / 수정 이유",
   "drawing": "large",
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "orderSensitive": false
   },
   "drawingExplanationLines": 3,
   "contextFigure": "ecoWrongArrows"
  },
  {
   "id": "c22-s42-u02-w056",
   "no": 56,
   "form": "draw",
   "topic": "남은 경로와 확인할 조건",
   "prompt": "두 사슬을 이용해 개구리가 줄어든 뒤 뱀에게 남은 먹이 경로를 표시하는 그림을 그리세요. 도움을 줄 수 있는 경로와 추가로 확인할 조건 하나를 적으세요.",
   "answer": "작은 새→뱀 경로가 남음을 표시하고 작은 새의 양·서식지 같은 조건 하나를 더 확인한다고 적는다. 개구리가 줄었다고 작은 새나 뱀이 반드시 늘거나 생존한다고 정하지 않는다.",
   "explanation": "이 자료에 없는 먹이를 임의로 더하지 않아요. 관계의 가능성과 실제 수량·생존의 예측을 구별해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "작은 새 경로 / 조건 하나 / 생존 보장하지 않음 / 제공 관계 보존",
   "drawing": "large",
   "standard": "4과14-02",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "orderSensitive": false
   },
   "drawingExplanationLines": 3,
   "contextFigure": "ecoChains"
  },
  {
   "id": "c22-s42-u02-w057",
   "no": 57,
   "form": "choice",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "다음 중 공기가 직접 오염되는 사례를 고르세요.",
   "choices": [
    "땅에 기름을 쏟은 뒤 그대로 둔다.",
    "쓰레기를 태우며 연기를 내보낸다.",
    "바닷물 위로 배의 기름이 흘러간다.",
    "하천으로 세제가 섞인 물을 내보낸다.",
    "농약이 빗물과 함께 하천에 들어간다."
   ],
   "key": 1,
   "answer": "② 쓰레기를 태우며 연기를 내보낸다.",
   "explanation": "쓰레기를 태울 때 나오는 연기는 대기 오염의 원인이 될 수 있습니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v028",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 2,
     "no": 13,
     "originalSet": 2,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceExplanation": "쓰레기를 태울 때 나오는 연기는 대기 오염의 원인이 될 수 있습니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w058",
   "no": 58,
   "form": "choice",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "사람이 생물의 이동을 도우려고 만든 시설을 고르세요.",
   "choices": [
    "밤새 밝은 빛으로 숲 전체를 비추는 조명",
    "동물이 다가오지 못하게 막은 포장 도로",
    "하천을 막아 쓰레기를 쌓아 놓은 둑",
    "숲을 잘라 만든 넓은 주차장과 울타리",
    "도로 위에 흙과 식물을 갖춘 생태 통로"
   ],
   "key": 4,
   "answer": "⑤ 도로 위에 흙과 식물을 갖춘 생태 통로",
   "explanation": "생태 통로는 도로 등으로 나뉜 서식지 사이에서 야생동물이 이동하도록 돕는 시설입니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v029",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 2,
     "no": 14,
     "originalSet": 2,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceExplanation": "생태 통로는 도로 등으로 나뉜 서식지 사이에서 야생동물이 이동하도록 돕는 시설입니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w059",
   "no": 59,
   "form": "choice",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "공장에서 나온 물질 때문에 주변 공기와 물이 더러워졌습니다. 이 현상에 해당하는 말을 고르세요.",
   "choices": [
    "공동 조사",
    "먹이그물 만들기",
    "서식지 복원",
    "환경 오염",
    "생물 분류"
   ],
   "key": 3,
   "answer": "④ 환경 오염",
   "explanation": "인간 활동으로 환경이 오염된 사례입니다. 보전이나 복원 활동과 구별합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-v046",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 3,
     "no": 16,
     "originalSet": 3,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceExplanation": "인간 활동으로 환경이 오염된 사례입니다. 보전이나 복원 활동과 구별합니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w060",
   "no": 60,
   "form": "short",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "사람이 버린 폐기물로 땅과 물이 더러워지는 현상을 두 낱말로 쓰세요.",
   "answer": "환경 오염",
   "explanation": "인간 활동으로 자연·생활 환경이 더러워지거나 훼손되는 현상입니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-v068",
   "sourcePool": "similar",
   "sourceRef": {
    "type": "similar",
    "of": {
     "set": 4,
     "no": 18,
     "originalSet": 4,
     "course": "초등 5-2"
    }
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "short-text",
    "answer": "환경 오염",
    "accepted": [
     "환경 오염"
    ]
   },
   "sourceExplanation": "인간 활동으로 자연·생활 환경이 더러워지거나 훼손되는 현상입니다.",
   "standard": "4과14-03",
   "accepted": [
    "환경 오염"
   ]
  },
  {
   "id": "c22-s42-u02-w061",
   "no": 61,
   "form": "choice",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "생물이 줄어든 원인을 판단하는 태도로 알맞은 것을 고르세요.",
   "choices": [
    "친구의 추측을 실제 측정값으로 바꾸어 적는다.",
    "예상과 다르면 이전 관찰 수를 모두 지운다.",
    "오염·먹이·날씨 등 여러 자료를 함께 확인한다.",
    "한 번 센 수만으로 원인을 하나로 확정한다.",
    "보기 싫은 생물은 조사 목록에서 제외한다."
   ],
   "key": 2,
   "answer": "③ 오염·먹이·날씨 등 여러 자료를 함께 확인한다.",
   "explanation": "수의 변화와 원인 규명은 다릅니다. 비교 조건과 다른 가능성을 살핍니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b43",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceExplanation": "수의 변화와 원인 규명은 다릅니다. 비교 조건과 다른 가능성을 살핍니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w062",
   "no": 62,
   "form": "choice",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "물이 맑아진 사진만 본 뒤 쓸 수 있는 판단을 고르세요.",
   "choices": [
    "맑아 보여도 성분을 더 확인한다.",
    "모든 오염 물질이 없어졌다고 확인되었다.",
    "먹이그물이 완전히 회복되었다고 확인되었다.",
    "물이 마시기에 적합하다고 확인되었다.",
    "모든 물고기가 돌아왔다고 확인되었다."
   ],
   "key": 0,
   "answer": "① 맑아 보여도 성분을 더 확인한다.",
   "explanation": "사진의 관찰과 성분·생물 회복에 대한 결론을 구별합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b53",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceExplanation": "사진의 관찰과 성분·생물 회복에 대한 결론을 구별합니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w063",
   "no": 63,
   "form": "choice",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "토의 의견이 서로 다를 때 다음 행동으로 알맞은 것을 고르세요.",
   "choices": [
    "다른 의견은 받은 적 없다고 삭제한다.",
    "의견을 듣는 대신 정답 문장만 복사한다.",
    "목소리가 큰 사람의 의견만 기록한다.",
    "확인 없이 모두 같은 결과를 냈다고 쓴다.",
    "근거로 실천할 대안을 함께 정한다."
   ],
   "key": 4,
   "answer": "⑤ 근거로 실천할 대안을 함께 정한다.",
   "explanation": "서로의 이유를 살피고 실천 가능성과 보전 효과를 비교합니다.",
   "misconception": "역할·관계와 제시한 조건을 함께 살펴요.",
   "criteria": "제공한 자료와 조건의 범위에서 판단해요.",
   "sourceId": "c22-s42-u02-b78",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceExplanation": "서로의 이유를 살피고 실천 가능성과 보전 효과를 비교합니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w064",
   "no": 64,
   "form": "short",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "야생동물이 도로 양쪽의 서식지 사이를 이동하도록 돕는 시설의 이름을 쓰세요.",
   "answer": "생태 통로",
   "explanation": "생태 통로의 효과는 실제 이용과 환경을 조사해 확인합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "sourceId": "c22-s42-u02-b59",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "short-text",
    "answer": "생태 통로",
    "accepted": [
     "생태 통로",
     "생태통로"
    ]
   },
   "sourceExplanation": "생태 통로의 효과는 실제 이용과 환경을 조사해 확인합니다.",
   "standard": "4과14-03",
   "accepted": [
    "생태 통로",
    "생태통로"
   ]
  },
  {
   "id": "c22-s42-u02-w065",
   "no": 65,
   "form": "written",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "주차장 공사로 풀밭이 줄어든 사례에서 생물과 환경에 생길 수 있는 영향을 두 가지 설명하세요.",
   "answer": "풀과 곤충이 살 공간이 줄 수 있고 땅이 포장되면 물이 스며드는 상태도 달라질 수 있습니다. 실제 변화는 조사해야 합니다.",
   "explanation": "가능한 영향과 실제 확인한 결과를 구별합니다. 모든 생물이 사라진다고 단정하지 않습니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "생물의 생활·서식 장소 영향 한 가지 / 비생물 환경 또는 다른 생물에 대한 타당한 영향 한 가지",
   "lines": 8,
   "sourceId": "c22-s42-u02-b45",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "written-explanation",
    "sample": "풀과 곤충이 살 공간이 줄 수 있고 땅이 포장되면 물이 스며드는 상태도 달라질 수 있습니다. 실제 변화는 조사해야 합니다.",
    "rubric": {
     "required": [
      "생물의 생활·서식 장소 영향 한 가지",
      "비생물 환경 또는 다른 생물에 대한 타당한 영향 한 가지"
     ],
     "pass": "타당한 근거·대안은 교사 확인"
    }
   },
   "sourceExplanation": "가능한 영향과 실제 확인한 결과를 구별합니다. 모든 생물이 사라진다고 단정하지 않습니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w066",
   "no": 66,
   "form": "written",
   "topic": "인간 활동·보전 토의와 실천",
   "prompt": "일회용 컵 사용을 줄이는 한 주 계획을 세우고 실제 실행과 효과를 어떻게 나눠 기록할지 설명하세요.",
   "answer": "등교할 때 물병을 챙기고 실제 사용한 날과 사용하지 못한 이유를 기록합니다. 일회용 컵을 몇 번 덜 썼는지 확인하되 하천 오염이 줄었다고 직접 측정한 것으로 적지 않습니다.",
   "explanation": "행동을 했다는 사실과 생태계 전체가 회복되었다는 주장을 구별합니다.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "행동·기간이 있는 계획 / 실행과 미실행 기록 방법 / 직접 확인한 효과의 범위 구별",
   "lines": 8,
   "sourceId": "c22-s42-u02-b65",
   "sourcePool": "items",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 연습 자료는 실제 학생·현장 관측값이 아니다."
   },
   "sourceGivens": null,
   "sourceContract": {
    "type": "written-explanation",
    "sample": "등교할 때 물병을 챙기고 실제 사용한 날과 사용하지 못한 이유를 기록합니다. 일회용 컵을 몇 번 덜 썼는지 확인하되 하천 오염이 줄었다고 직접 측정한 것으로 적지 않습니다.",
    "rubric": {
     "required": [
      "행동·기간이 있는 계획",
      "실행과 미실행 기록 방법",
      "직접 확인한 효과의 범위 구별"
     ],
     "pass": "타당한 근거·대안은 교사 확인"
    }
   },
   "sourceExplanation": "행동을 했다는 사실과 생태계 전체가 회복되었다는 주장을 구별합니다.",
   "standard": "4과14-03"
  },
  {
   "id": "c22-s42-u02-w067",
   "no": 67,
   "form": "choice",
   "topic": "쓰레기 사진의 근거",
   "prompt": "제공 사진을 설명한 문장 중 관찰 사실을 고르세요.",
   "answer": "② 물 위에 쓰레기가 보인다",
   "explanation": "사진에서 물 위 쓰레기는 직접 보여요. 다른 오염 원인·성분의 안전·사진 밖 쓰레기와 생물의 회복 시기는 사진 한 장으로 정하지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-03",
   "choices": [
    "보이는 쓰레기가 이곳 오염의 유일한 원인이다",
    "물 위에 쓰레기가 보인다",
    "쓰레기 옆의 물은 성분 검사 없이도 안전하다",
    "사진에 안 보이는 물속에도 쓰레기가 전혀 없다",
    "쓰레기만 치우면 모든 생물이 바로 돌아온다"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextFigure": "ecoWaste"
  },
  {
   "id": "c22-s42-u02-w068",
   "no": 68,
   "form": "choice",
   "topic": "계획과 실제 실행",
   "prompt": "한 주의 물병 사용을 점검하는 방법으로 알맞은 것을 고르세요.",
   "answer": "④ 사용한 날과 못 한 날을 나누어 남긴다",
   "explanation": "실제로 한 행동과 계획·미실행을 구별하고 확인한 효과의 범위를 지켜요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-03",
   "choices": [
    "물병을 준비한 날은 사용한 날로 함께 센다",
    "다음 주 계획을 이번 주의 실천 횟수에 더한다",
    "못 쓴 날은 실천 효과를 비교할 때 지워 버린다",
    "사용한 날과 못 한 날을 나누어 남긴다",
    "컵 한 개 대신 쓴 결과를 하천 전체의 회복으로 적는다"
   ],
   "key": 3,
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "choice",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w069",
   "no": 69,
   "form": "multi",
   "topic": "원인에 맞는 보전 행동",
   "prompt": "물·흙 오염을 줄이는 타당한 행동을 모두 고르세요.",
   "answer": "①, ③, ④, ⑤",
   "explanation": "기름·건전지는 정해진 수거 방법, 세제는 필요한 양, 위험한 폐기물은 교사의 도움을 이용해요. 페인트를 희석해도 빗물 배수구에 버리는 방법이 타당해지는 것은 아니에요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "폐식용유는 지역에서 정한 수거 방법을 확인한다",
    "남은 페인트는 물에 희석해 빗물 배수구에 붓는다",
    "폐건전지는 정해진 수거함에 배출한다",
    "세제는 제품 안내에 맞는 필요한 양만 쓴다",
    "날카로운 폐기물은 만지지 않고 교사에게 알린다"
   ],
   "key": [
    0,
    2,
    3,
    4
   ],
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w070",
   "no": 70,
   "form": "multi",
   "topic": "영향을 조사할 근거",
   "prompt": "풀밭 주변 공사 전후를 조사할 때 필요한 항목을 모두 고르세요.",
   "answer": "②, ③",
   "explanation": "같은 범위·방법을 가능한 한 유지하고 날짜·시간·날씨 등 비교 조건을 기록해요. 한 번의 변화만으로 원인을 하나로 정하거나 보이지 않은 생물의 소멸을 확정하지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "공사 전은 풀밭 한 곳, 공사 후는 학교 전체를 센다",
    "가능한 한 같은 범위·방법으로 생물과 환경을 살핀다",
    "조사한 날짜·시간과 날씨 등 다른 조건도 남긴다",
    "공사 뒤 한 번 줄어든 수만으로 공사가 원인이라 정한다",
    "안 보인 생물은 모두 그 지역에서 사라졌다고 적는다"
   ],
   "key": [
    1,
    2
   ],
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w071",
   "no": 71,
   "form": "multi",
   "topic": "실천 뒤 나누기",
   "prompt": "보전 행동을 소개할 때 타당한 설명을 모두 고르세요.",
   "answer": "①, ②, ④, ⑤",
   "explanation": "실제 행동과 확인한 효과를 구분하고, 못 한 이유와 다른 의견의 근거로 다음 방법을 고쳐요. 계획을 적은 것은 실제 사용 횟수가 아니에요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "choices": [
    "실제로 사용한 날과 확인한 효과를 나눈다",
    "사용하지 못한 이유를 다음 준비에 반영한다",
    "계획을 적은 날도 실제 사용 횟수로 센다",
    "짝의 다른 의견과 그 근거를 듣는다",
    "실행 여건을 살펴 다음 방법을 고친다"
   ],
   "key": [
    0,
    1,
    3,
    4
   ],
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "multi",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w072",
   "no": 72,
   "form": "blank",
   "topic": "환경 오염의 구별",
   "prompt": "배출 물질로 공기가 더러워지는 것은 ㉠[ ] 오염, 처리하지 않은 폐수로 물이 더러워지는 것은 ㉡[ ] 오염의 사례예요.",
   "answer": "㉠ 대기 · ㉡ 수질",
   "explanation": "환경 사이에 물질이 이동할 수 있어 실제 범위는 조사해야 해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w073",
   "no": 73,
   "form": "blank",
   "topic": "실행과 계획",
   "prompt": "물병을 실제로 사용한 것은 ㉠[ ]한 행동이에요. 다음 주 사용 방법만 정했다면 아직 ㉡[ ]이에요.",
   "answer": "㉠ 실천/실행 · ㉡ 계획",
   "explanation": "준비나 설계와 실제 행동을 나누어요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w074",
   "no": 74,
   "form": "blank",
   "topic": "효과 확인의 범위",
   "prompt": "사진에서 물이 맑아 보이는 사실과, 물속 ㉠[ ]을 측정한 결과는 달라요. 생물의 회복 여부도 별도 ㉡[ ]로 확인해요.",
   "answer": "㉠ 성분 · ㉡ 조사/관찰",
   "explanation": "겉모습 하나로 성분·수질·생물 전체 회복을 확정하지 않아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "blank",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w075",
   "no": 75,
   "form": "match",
   "topic": "문제와 대응 연결",
   "prompt": "연습 문제와 직접 대응할 방법을 연결하세요.",
   "answer": "㉠-② · ㉡-③ · ㉢-①",
   "explanation": "오염 원인을 줄이는 행동과 시설의 적절한 처리를 함께 생각해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "parts": [
    "㉠ 자동차의 불필요한 공회전",
    "㉡ 처리하지 않은 폐수 배출",
    "㉢ 폐건전지를 화단에 버림"
   ],
   "answerPerPart": true,
   "standard": "4과14-03",
   "given": [
    "① 지정 수거함 등 정해진 방법으로 배출  ② 보호자·학교와 공회전 줄이기 안내  ③ 적절한 처리·배출 관리"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w076",
   "no": 76,
   "form": "match",
   "topic": "짧은 기록의 상태",
   "prompt": "제공한 기록과 상태를 연결하세요.",
   "answer": "㉠-③ · ㉡-① · ㉢-②",
   "explanation": "실제 실행·미실행과 앞으로의 계획을 나누어요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "parts": [
    "㉠ 물병을 실제 사용해 컵1개 대신함",
    "㉡ 준비했으나 집에 두고 와 사용 못 함",
    "㉢ 다음 주 사용할 방법만 정함"
   ],
   "answerPerPart": true,
   "standard": "4과14-03",
   "given": [
    "① 미실행과 이유  ② 아직 계획  ③ 실제 행동과 확인한 범위"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w077",
   "no": 77,
   "form": "match",
   "topic": "보전의 역할 나누기",
   "prompt": "할 일과 맡을 역할을 연결하세요.",
   "answer": "㉠-② · ㉡-③ · ㉢-①",
   "explanation": "개인만의 책임으로 돌리지 않고 함께 할 역할을 찾아요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "parts": [
    "㉠ 내 물병 챙겨 사용하기",
    "㉡ 학급 공용 준비·안내 방법 정하기",
    "㉢ 지역의 안전한 폐기물 수거 체계 운영"
   ],
   "answerPerPart": true,
   "standard": "4과14-03",
   "given": [
    "① 지역·기관  ② 나  ③ 학급"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "match",
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u02-w078",
   "no": 78,
   "form": "order",
   "topic": "토의에서 실천 확인까지",
   "prompt": "보전 문제를 조사했습니다. 우리 반이 정한 실행 계획의 순서를 쓰세요.",
   "answer": "㉢→㉣→㉠→㉡",
   "explanation": "조사 뒤 토의·계획·실천·돌아보기를 이어 가요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "같은 뜻의 답과 자료에 맞는 다른 배치·실천 방법을 인정해요. 실제 조사·제작·토의·실천 여부는 문제 정답과 따로 확인해요.",
   "given": [
    "㉠ 정한 행동을 실제로 해 보기",
    "㉡ 실천 결과·못 한 이유를 확인해 다음 방법 고치기",
    "㉢ 두 방법을 근거·안전·여건으로 토의하기",
    "㉣ 실행할 행동·시기·역할·확인 방법 정하기"
   ],
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "order",
    "teacherRequired": false,
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s42-u02-w079",
   "no": 79,
   "form": "draw",
   "topic": "학교 숲 보전 계획도",
   "prompt": "학교 숲 일부를 통행 길로 바꾸려 합니다. 조사할 생물·환경과 길의 대안 두 가지를 비교하는 계획도를 그리세요. 사람의 이용과 생물의 사는 곳을 함께 고려하세요.",
   "answer": "현재 생물·서식 장소/이동·물이나 흙 상태 등을 조사할 항목으로 표시한다. 숲을 덜 지나는 위치·길 폭을 줄이는 등 두 대안을 비교하고 안전·이용 여건과 생물 보호 근거를 적는다.",
   "explanation": "어느 한 배치만 정답으로 강요하지 않아요. 실제 조사를 하지 않았다면 설계/계획으로 표시해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "생물·환경 조사 항목 / 대안 둘 / 이용과 보전 근거 / 계획 표시",
   "drawing": "large",
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "orderSensitive": false
   },
   "drawingExplanationLines": 3
  },
  {
   "id": "c22-s42-u02-w080",
   "no": 80,
   "form": "draw",
   "topic": "실천을 확인하는 안내 카드",
   "prompt": "제공된 가상 기록을 이용해 실행·미실행·계획을 나누는 안내 카드를 그리세요. 확인한 효과와 아직 확인하지 않은 효과를 구별해 표시하세요.",
   "answer": "월요일은 사용 못 함과 이유, 화요일은 실제 사용과 컵1개 대신함, 수요일은 다음 계획으로 나눈다. 확인한 범위는 내 행동과 컵 사용이며 강 전체의 수질 회복을 조사한 것은 아니라고 밝힌다.",
   "explanation": "미실행을 지우지 않고 근거에 맞게 구분하면 다른 배치도 인정해요.",
   "misconception": "생물의 역할·먹이 관계와 자료의 범위를 근거로 설명해요. 모형·계획을 실제 조사나 실천 결과로 바꾸지 않아요.",
   "criteria": "세 상태 / 실제 행동의 근거 / 효과 범위 / 가상 기록 표시",
   "drawing": "large",
   "standard": "4과14-03",
   "status": "authored",
   "sourceRef": {
    "type": "authored-workbook",
    "unit": "c22-s42-u02",
    "originalCounterpart": false
   },
   "responseContract": {
    "type": "draw",
    "teacherRequired": true,
    "orderSensitive": false
   },
   "drawingExplanationLines": 3,
   "contextFigure": "ecoPracticeCards"
  }
 ],
 "pages": [
  {
   "section": "교과 연결 사고력",
   "title": "생물과 환경",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoHabitat",
     "caption": ""
    },
    {
     "type": "text",
     "text": "생물과 주변 환경을 함께 조사해요. 먹이 관계를 모형으로 만들고, 인간 활동의 영향을 알아보며 보전 방법을 실제로 토의하고 실천해요."
    },
    {
     "type": "field",
     "title": "처음 생각",
     "hint": "움직이지 않는 버섯은 생물일까요? 한 먹이가 줄면 모든 생물이 반드시 사라질까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "조사하고 · 연결하고 · 만들고 · 지키는 과학",
   "kind": "opener"
  },
  {
   "section": "배움의 지도",
   "title": "세 질문으로 생태계를 살펴요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "현행 성취기준",
      "배울 내용·연습 번호"
     ],
     "rows": [
      [
       "4과14-01",
       "생태계 구성·양분 역할 분류 / 1~28번"
      ],
      [
       "4과14-02",
       "먹이 관계·먹이그물 모형 / 29~56번"
      ],
      [
       "4과14-03",
       "인간 활동·보전 토의/실천 / 57~80번"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "사진과 설명·예제에서 근거를 찾아요.",
      "객관식·복수선택·단답·서술·빈칸·연결·순서·그림으로 연습해요.",
      "먹이그물을 실제로 만들고 보전 행동을 해 본 뒤 확인해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "나의 질문",
     "hint": "조사하고 싶은 장소·생물이나 더 알아볼 관계를 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "생태계 조사",
   "title": "생물과 주변 환경을 함께 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoHabitat",
     "caption": ""
    },
    {
     "type": "text",
     "text": "생물과 비생물 환경이 서로 영향을 주고받는 체계를 생태계라고 해요. 숲·하천·바다·작은 화단에도 다양한 구성 요소와 관계가 있어요."
    },
    {
     "type": "field",
     "title": "사진에서 본 것",
     "hint": "직접 보이는 대상 두 가지와 이 사진만으로 모르는 것 한 가지를 나누어 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "구성 요소 분류",
   "title": "움직임 대신 살아 있는지 살펴요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "생물 요소",
      "비생물 요소"
     ],
     "rows": [
      [
       "식물·동물·버섯·곰팡이 등",
       "물·공기·흙·햇빛·온도 등"
      ]
     ]
    },
    {
     "type": "example",
     "question": "흙이 비생물이면 흙 안에 생물이 없을까요?",
     "steps": [
      [
       "분류한 것",
       "환경으로서의 흙을 비생물 요소로 분류했어요."
      ],
      [
       "함께 살펴볼 것",
       "흙 속 지렁이·개미 등은 살아 있는 생물일 수 있어요."
      ]
     ],
     "answer": "환경인 흙과 흙 속 생물을 나누어 살펴요."
    },
    {
     "type": "field",
     "title": "나의 분류 기준",
     "hint": "버섯과 바위를 다르게 분류하는 까닭을 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "양분을 얻는 방법",
   "title": "같은 장소에서도 역할이 달라요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoRoles",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "ecoRoleCards",
     "caption": ""
    },
    {
     "type": "example",
     "question": "곰팡이가 죽은 잎을 분해하면 무엇이 이어질까요?",
     "steps": [
      [
       "관계 확인",
       "분해자는 죽은 생물의 물질을 분해하며 양분을 얻어요."
      ],
      [
       "되돌아감",
       "분해 과정에서 환경으로 돌아간 양분은 식물이 다시 이용할 수 있어요."
      ]
     ],
     "answer": "죽은 잎의 물질도 생태계 관계에서 이어져요."
    },
    {
     "type": "field",
     "title": "역할의 근거",
     "hint": "생산자·소비자·분해자를 위 작용과 연결해 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "풀밭 관찰",
   "title": "풀밭의 생김새를 자세히 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoAnimals",
     "caption": ""
    },
    {
     "type": "text",
     "text": "사진에서 풀·토끼·여우의 모습을 살펴보아요. 먹이 관계와 실제 개체 수는 사진만으로 알 수 없어요. 다음 쪽의 모형 표와 사진을 구별해 읽어요."
    },
    {
     "type": "field",
     "title": "보이는 모습 설명하기",
     "hint": "풀·토끼·여우 중 두 생물을 골라 사진에서 확인한 생김새를 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "풀밭 모형 비교",
   "title": "한 조건을 바꾸어 경향을 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoMeadow",
     "caption": ""
    },
    {
     "type": "field",
     "title": "그대로와 비교",
     "hint": "여우가 없어진 조건에서 풀·토끼 수가 어떻게 다른지 표의 근거를 적어요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "모형의 한계",
     "hint": "화면의 수를 실제 생물 수나 생존 기간으로 예측할 수 없는 까닭을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "먹이 화살표",
   "title": "먹히는 쪽에서 먹는 쪽으로 이어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "제공된 먹는 관계",
      "알맞은 화살표"
     ],
     "rows": [
      [
       "메뚜기가 풀을 먹는다",
       "풀 → 메뚜기"
      ],
      [
       "개구리가 메뚜기를 먹는다",
       "메뚜기 → 개구리"
      ]
     ]
    },
    {
     "type": "example",
     "question": "개구리 → 메뚜기라고 그렸다면?",
     "steps": [
      [
       "관계 확인",
       "메뚜기를 먹는 생물이 개구리예요."
      ],
      [
       "방향 수정",
       "먹히는 메뚜기에서 먹는 개구리로 바꿔요."
      ]
     ],
     "answer": "메뚜기 → 개구리"
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "화살표의 시작과 끝이 무엇을 나타내는지 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "여러 사슬의 연결",
   "title": "같은 생물을 연결점으로 써요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "ecoWeb",
     "caption": ""
    },
    {
     "type": "field",
     "title": "같은 이름표 찾기",
     "hint": "두 사슬의 공통 생물과 연결되는 관계를 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "먹이그물 실제 만들기",
   "title": "카드와 화살표로 만들고 고쳐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "제공된 관계를 확인하고 이름 카드6장·화살표6개·큰 종이를 준비해요.",
      "같은 풀과 뱀 카드를 연결점으로 두 사슬을 실제로 이어 붙여요.",
      "짝과 자료를 대조해 누락된 선·뒤집힌 방향을 실제로 고쳐요.",
      "관계는 나타냈지만 실제 수·몸 크기·모든 환경 조건은 나타내지 못했음을 설명해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "제작 전 계획",
     "hint": "사용할 재료와 공통 카드를 어떻게 놓을지 그려 보아요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "text",
     "text": "교사 준비 재사용 종이·안전한 도구를 사용해요. 설계만 했거나 완성 그림을 보기만 했다면 아직 내 모형을 만든 것은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "다른 먹이 경로",
   "title": "도움이 될 수 있지만 생존 보장은 아니에요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "example",
     "question": "개구리가 줄면 뱀에게 무엇이 남을까요?",
     "steps": [
      [
       "남은 경로",
       "작은 새 → 뱀의 관계가 남아요."
      ],
      [
       "추가 조건",
       "작은 새의 양·서식지 등도 확인해야 해요."
      ]
     ],
     "answer": "다른 경로가 도움이 될 수 있지만 모든 생존을 보장하지 않아요."
    },
    {
     "type": "field",
     "title": "더 조사할 것",
     "hint": "한 먹이가 줄었을 때 영향을 알아볼 조건 두 가지를 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "인간 활동의 영향",
   "title": "보인 사실과 가능한 영향을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWaste",
     "caption": ""
    },
    {
     "type": "field",
     "title": "사진의 근거",
     "hint": "직접 보이는 사실과 성분·원인·생물 피해처럼 더 알아볼 것을 나누어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "text",
     "text": "인간 활동→바뀐 환경→생물에게 가능한 영향을 자료와 연결해요. 한 번 센 생물 수만으로 원인을 하나로 확정하지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "원인과 보전 방법",
   "title": "개인과 시설·지역의 할 일을 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoPollution",
     "caption": ""
    },
    {
     "type": "field",
     "title": "원인에 맞게 제안",
     "hint": "문제 한 가지를 골라 개인이 할 일과 학교·지역이 도울 일을 나누어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "text",
     "text": "풀밭 포장·숲을 가르는 도로는 사는 곳과 이동 길도 바꿀 수 있어요. 대안 위치·면적·이동 통로를 조사하고 만든 뒤 실제 이용도 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "근거로 실제 토의하기",
   "title": "보전 효과와 실행 여건을 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "컵 쓰레기를 줄일 방법 예",
      "비교할 점"
     ],
     "rows": [
      [
       "재사용 컵·물병 이용",
       "새 쓰레기 감소·세척/보관·준비 여건"
      ],
      [
       "분리배출 안내·점검",
       "이미 나온 쓰레기 처리·안내/수거 여건"
      ]
     ]
    },
    {
     "type": "field",
     "title": "다른 의견의 근거",
     "hint": "두 방법의 장점·어려움과 짝의 의견에서 알게 된 점을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "함께 정할 것",
     "hint": "행동·장소·시기·역할·효과 확인 방법을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 방법의 효과와 실행 여건을 근거로 비교해요. 서로 다른 의견의 장점을 찾아 함께 할 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원과 에너지를 효율적으로 이용하는 사례를 비교해요. 재사용 물품의 세척·보관에 필요한 물과 에너지도 살피면, 사용하는 과정까지 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 방법의 기대 효과와 필요한 준비를 비교하고, 친구에게 물어볼 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실천하고 돌아보기",
   "title": "내 행동과 확인한 효과를 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoPracticeCards",
     "caption": ""
    },
    {
     "type": "field",
     "title": "실행과 미실행",
     "hint": "세 기록의 차이와 다음에 고칠 준비 방법을 설명해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "text",
     "text": "실제 물병 사용이나 안전한 분리배출 등 정한 행동을 해 보고, 날짜·행동·확인 범위를 짧게 남겨요. 내 컵 사용을 줄였다고 강 전체의 수질·생물 회복을 측정한 것은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "근거를 설명하고 나누기",
   "title": "모형과 실천에서 알게 된 것을 연결해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "만든 먹이그물의 화살표 하나를 골라 관계의 근거를 설명해요.",
      "보전 행동의 실제 실행·못 한 이유·확인한 효과를 말해요.",
      "친구의 질문·다른 근거를 듣고 설명이나 다음 실천을 고쳐요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "내가 설명할 핵심",
     "hint": "구성 요소·먹이 관계·보전 중 한 가지를 근거와 함께 정리해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "diagram",
     "key": "ecoSources",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 1·2·3",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w001",
      "c22-s42-u02-w002",
      "c22-s42-u02-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분해자는 죽은 생물 등의 물질을 분해하며 양분을 얻어요. 사는 장소나 몸의 색만으로 역할을 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물을 분류하는 체계를 배워요. 버섯과 곰팡이는 균계로 묶어요. 이 분류와 생산자·소비자·분해자라는 역할 분류는 기준이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "소비자와 분해자가 양분을 얻는 방법에서 공통점과 차이점을 한 가지씩 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 4·5·6",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w004",
      "c22-s42-u02-w005",
      "c22-s42-u02-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 7",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 8",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 9·10·11",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w009",
      "c22-s42-u02-w010",
      "c22-s42-u02-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 12·13·14",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w012",
      "c22-s42-u02-w013",
      "c22-s42-u02-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 15·16",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w015",
      "c22-s42-u02-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분해자는 죽은 생물 등의 물질을 분해하며 양분을 얻어요. 사는 장소나 몸의 색만으로 역할을 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물을 분류하는 체계를 배워요. 버섯과 곰팡이는 균계로 묶어요. 이 분류와 생산자·소비자·분해자라는 역할 분류는 기준이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "소비자와 분해자가 양분을 얻는 방법에서 공통점과 차이점을 한 가지씩 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 17",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 18",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 19",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분해자는 죽은 생물 등의 물질을 분해하며 양분을 얻어요. 사는 장소나 몸의 색만으로 역할을 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물을 분류하는 체계를 배워요. 버섯과 곰팡이는 균계로 묶어요. 이 분류와 생산자·소비자·분해자라는 역할 분류는 기준이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "소비자와 분해자가 양분을 얻는 방법에서 공통점과 차이점을 한 가지씩 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 20",
   "title": "사진에서 확인한 사실",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoHabitat",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 21",
   "title": "역할 판단의 근거",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoRoleCards",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w021"
     ]
    },
    {
     "type": "field",
     "title": "분류 기준 설명하기",
     "hint": "위 카드의 두 생물을 골라 양분을 얻는 방법의 차이를 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 22·23·24·25",
   "title": "생물과 환경의 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w022",
      "c22-s42-u02-w023",
      "c22-s42-u02-w024",
      "c22-s42-u02-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 26·27",
   "title": "양분 얻는 방법 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w026",
      "c22-s42-u02-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 28",
   "title": "구성 요소 관계 지도",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoSurveyCards",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 29·30·31",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w029",
      "c22-s42-u02-w030",
      "c22-s42-u02-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 32·33·34",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w032",
      "c22-s42-u02-w033",
      "c22-s42-u02-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 35·36·37",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w035",
      "c22-s42-u02-w036",
      "c22-s42-u02-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 38",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 39",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 40·41",
   "title": "모형의 두 조건 비교",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoMeadow",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "ecoWeb",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w040",
      "c22-s42-u02-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 42·43·44",
   "title": "자료에 맞는 화살표",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w042",
      "c22-s42-u02-w043",
      "c22-s42-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 45·46·47·48",
   "title": "수치 모형의 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w045",
      "c22-s42-u02-w046",
      "c22-s42-u02-w047",
      "c22-s42-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 49·50",
   "title": "남아 있는 경로",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWeb",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w049",
      "c22-s42-u02-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 51·52·53",
   "title": "모형 요소의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w051",
      "c22-s42-u02-w052",
      "c22-s42-u02-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 54",
   "title": "먹이그물 모형 설계",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 55",
   "title": "잘못된 연결 고치기",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWrongArrows",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 56",
   "title": "남은 경로와 확인할 조건",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 57·58·59",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w057",
      "c22-s42-u02-w058",
      "c22-s42-u02-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 60·61·62",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w060",
      "c22-s42-u02-w061",
      "c22-s42-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 63·64",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w063",
      "c22-s42-u02-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 방법의 효과와 실행 여건을 근거로 비교해요. 서로 다른 의견의 장점을 찾아 함께 할 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원과 에너지를 효율적으로 이용하는 사례를 비교해요. 재사용 물품의 세척·보관에 필요한 물과 에너지도 살피면, 사용하는 과정까지 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 방법의 기대 효과와 필요한 준비를 비교하고, 친구에게 물어볼 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 65",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서식지가 줄거나 이동 길이 끊기면 생물의 생활도 달라질 수 있어요. 보전 방법은 생물과 사람의 이용을 함께 고려해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성을 유지하는 방법을 배워요. 서로 다른 생물이 살아갈 장소를 보전하는 일은 한 종류의 생물만 지키는 것보다 넓은 관점이에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 장소를 이용하는 두 대안을 제안하고, 생물의 사는 곳과 사람의 이용 면에서 비교해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 66",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 67·68",
   "title": "쓰레기 사진의 근거",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWaste",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w067",
      "c22-s42-u02-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 69·70·71",
   "title": "원인에 맞는 보전 행동",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w069",
      "c22-s42-u02-w070",
      "c22-s42-u02-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 72·73·74",
   "title": "환경 오염의 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w072",
      "c22-s42-u02-w073",
      "c22-s42-u02-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 75·76",
   "title": "문제와 대응 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w075",
      "c22-s42-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 77·78",
   "title": "보전의 역할 나누기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w077",
      "c22-s42-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 79",
   "title": "학교 숲 보전 계획도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서식지가 줄거나 이동 길이 끊기면 생물의 생활도 달라질 수 있어요. 보전 방법은 생물과 사람의 이용을 함께 고려해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성을 유지하는 방법을 배워요. 서로 다른 생물이 살아갈 장소를 보전하는 일은 한 종류의 생물만 지키는 것보다 넓은 관점이에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 장소를 이용하는 두 대안을 제안하고, 생물의 사는 곳과 사람의 이용 면에서 비교해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 80",
   "title": "실천을 확인하는 안내 카드",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoPracticeCards",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~4",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w001",
      "c22-s42-u02-w002",
      "c22-s42-u02-w003",
      "c22-s42-u02-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 5~7",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w005",
      "c22-s42-u02-w006",
      "c22-s42-u02-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 8~10",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w008",
      "c22-s42-u02-w009",
      "c22-s42-u02-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 11~14",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w011",
      "c22-s42-u02-w012",
      "c22-s42-u02-w013",
      "c22-s42-u02-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 15~17",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w015",
      "c22-s42-u02-w016",
      "c22-s42-u02-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 18~20",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w018",
      "c22-s42-u02-w019",
      "c22-s42-u02-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 21~24",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w021",
      "c22-s42-u02-w022",
      "c22-s42-u02-w023",
      "c22-s42-u02-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 25~27",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w025",
      "c22-s42-u02-w026",
      "c22-s42-u02-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 28~30",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w028",
      "c22-s42-u02-w029",
      "c22-s42-u02-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 31~34",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w031",
      "c22-s42-u02-w032",
      "c22-s42-u02-w033",
      "c22-s42-u02-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 35~37",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w035",
      "c22-s42-u02-w036",
      "c22-s42-u02-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 38~40",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w038",
      "c22-s42-u02-w039",
      "c22-s42-u02-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 41~44",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w041",
      "c22-s42-u02-w042",
      "c22-s42-u02-w043",
      "c22-s42-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 45~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w045",
      "c22-s42-u02-w046",
      "c22-s42-u02-w047",
      "c22-s42-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 49~52",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w049",
      "c22-s42-u02-w050",
      "c22-s42-u02-w051",
      "c22-s42-u02-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 53~55",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w053",
      "c22-s42-u02-w054",
      "c22-s42-u02-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 56~58",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w056",
      "c22-s42-u02-w057",
      "c22-s42-u02-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 59~62",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w059",
      "c22-s42-u02-w060",
      "c22-s42-u02-w061",
      "c22-s42-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 63~65",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w063",
      "c22-s42-u02-w064",
      "c22-s42-u02-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 66~68",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w066",
      "c22-s42-u02-w067",
      "c22-s42-u02-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 69~72",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w069",
      "c22-s42-u02-w070",
      "c22-s42-u02-w071",
      "c22-s42-u02-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 73~76",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w073",
      "c22-s42-u02-w074",
      "c22-s42-u02-w075",
      "c22-s42-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 77~79",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w077",
      "c22-s42-u02-w078",
      "c22-s42-u02-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  },
  {
   "section": "정답·해설 80~80",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "다시 가르칠 때",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~16번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "1",
       "객관식 · 생태계 구성·양분 역할 분류",
       "④"
      ],
      [
       "2",
       "객관식 · 생태계 구성·양분 역할 분류",
       "②"
      ],
      [
       "3",
       "객관식 · 생태계 구성·양분 역할 분류",
       "⑤"
      ],
      [
       "4",
       "객관식 · 생태계 구성·양분 역할 분류",
       "①"
      ],
      [
       "5",
       "객관식 · 생태계 구성·양분 역할 분류",
       "③"
      ],
      [
       "6",
       "객관식 · 생태계 구성·양분 역할 분류",
       "③"
      ],
      [
       "7",
       "객관식 · 생태계 구성·양분 역할 분류",
       "⑤"
      ],
      [
       "8",
       "서술 · 생태계 구성·양분 역할 분류",
       "교사 확인(해설 쪽)"
      ],
      [
       "9",
       "단답 · 생태계 구성·양분 역할 분류",
       "생태계"
      ],
      [
       "10",
       "단답 · 생태계 구성·양분 역할 분류",
       "소나무, 다람쥐, 버섯"
      ],
      [
       "11",
       "단답 · 생태계 구성·양분 역할 분류",
       "ㄷ"
      ],
      [
       "12",
       "객관식 · 생태계 구성·양분 역할 분류",
       "②"
      ],
      [
       "13",
       "객관식 · 생태계 구성·양분 역할 분류",
       "④"
      ],
      [
       "14",
       "객관식 · 생태계 구성·양분 역할 분류",
       "①"
      ],
      [
       "15",
       "객관식 · 생태계 구성·양분 역할 분류",
       "⑤"
      ],
      [
       "16",
       "단답 · 생태계 구성·양분 역할 분류",
       "분해자"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "17~32번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "17",
       "서술 · 생태계 구성·양분 역할 분류",
       "교사 확인(해설 쪽)"
      ],
      [
       "18",
       "서술 · 생태계 구성·양분 역할 분류",
       "교사 확인(해설 쪽)"
      ],
      [
       "19",
       "서술 · 생태계 구성·양분 역할 분류",
       "교사 확인(해설 쪽)"
      ],
      [
       "20",
       "객관식 · 사진에서 확인한 사실",
       "①"
      ],
      [
       "21",
       "객관식 · 역할 판단의 근거",
       "④"
      ],
      [
       "22",
       "모두 고르기 · 생물과 환경의 구별",
       "②, ④"
      ],
      [
       "23",
       "빈칸 · 생태계의 구성",
       "㉠ 생물 · ㉡ 비생물"
      ],
      [
       "24",
       "빈칸 · 양분 역할의 기준",
       "㉠ 양분 · ㉡ 생산자"
      ],
      [
       "25",
       "빈칸 · 분해자의 작용",
       "㉠ 분해 · ㉡ 분해자"
      ],
      [
       "26",
       "연결 · 양분 얻는 방법 연결",
       "㉠-③ · ㉡-① · ㉢-②"
      ],
      [
       "27",
       "순서 · 조사하고 분류하는 계획",
       "㉡→㉣→㉠→㉢"
      ],
      [
       "28",
       "그림 · 구성 요소 관계 지도",
       "교사 확인(해설 쪽)"
      ],
      [
       "29",
       "객관식 · 먹이 관계·먹이그물 모형",
       "③"
      ],
      [
       "30",
       "객관식 · 먹이 관계·먹이그물 모형",
       "②"
      ],
      [
       "31",
       "객관식 · 먹이 관계·먹이그물 모형",
       "②"
      ],
      [
       "32",
       "객관식 · 먹이 관계·먹이그물 모형",
       "④"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "33~48번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "33",
       "단답 · 먹이 관계·먹이그물 모형",
       "참나무 잎 → 애벌레 → 박새 → 매"
      ],
      [
       "34",
       "객관식 · 먹이 관계·먹이그물 모형",
       "①"
      ],
      [
       "35",
       "객관식 · 먹이 관계·먹이그물 모형",
       "⑤"
      ],
      [
       "36",
       "객관식 · 먹이 관계·먹이그물 모형",
       "③"
      ],
      [
       "37",
       "단답 · 먹이 관계·먹이그물 모형",
       "여우"
      ],
      [
       "38",
       "서술 · 먹이 관계·먹이그물 모형",
       "교사 확인(해설 쪽)"
      ],
      [
       "39",
       "서술 · 먹이 관계·먹이그물 모형",
       "교사 확인(해설 쪽)"
      ],
      [
       "40",
       "객관식 · 모형의 두 조건 비교",
       "①"
      ],
      [
       "41",
       "객관식 · 남아 있는 먹이 경로",
       "③"
      ],
      [
       "42",
       "모두 고르기 · 자료에 맞는 화살표",
       "①, ③, ⑤"
      ],
      [
       "43",
       "모두 고르기 · 공통 카드로 연결하기",
       "①, ②, ④"
      ],
      [
       "44",
       "모두 고르기 · 다른 경로의 도움과 한계",
       "①, ⑤"
      ],
      [
       "45",
       "모두 고르기 · 수치 모형의 한계",
       "②, ③, ⑤"
      ],
      [
       "46",
       "빈칸 · 화살표 약속",
       "㉠ 먹히는 · ㉡ 먹는"
      ],
      [
       "47",
       "빈칸 · 사슬과 그물",
       "㉠ 먹이 사슬 · ㉡ 먹이그물"
      ],
      [
       "48",
       "빈칸 · 같은 생물 연결",
       "㉠ 연결점 · ㉡ 개체"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "49~64번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "49",
       "빈칸 · 남아 있는 경로",
       "㉠ 작은 새 · ㉡ 양"
      ],
      [
       "50",
       "연결 · 화살표로 바꾸기",
       "㉠-② · ㉡-③ · ㉢-①"
      ],
      [
       "51",
       "연결 · 모형 요소의 뜻",
       "㉠-③ · ㉡-① · ㉢-②"
      ],
      [
       "52",
       "순서 · 먹이그물 실제 만들기",
       "㉣→㉡→㉢→㉠"
      ],
      [
       "53",
       "순서 · 새 조사와 모형 수정",
       "㉢→㉠→㉣→㉡"
      ],
      [
       "54",
       "그림 · 먹이그물 모형 설계",
       "교사 확인(해설 쪽)"
      ],
      [
       "55",
       "그림 · 잘못된 연결 고치기",
       "교사 확인(해설 쪽)"
      ],
      [
       "56",
       "그림 · 남은 경로와 확인할 조건",
       "교사 확인(해설 쪽)"
      ],
      [
       "57",
       "객관식 · 인간 활동·보전 토의와 실천",
       "②"
      ],
      [
       "58",
       "객관식 · 인간 활동·보전 토의와 실천",
       "⑤"
      ],
      [
       "59",
       "객관식 · 인간 활동·보전 토의와 실천",
       "④"
      ],
      [
       "60",
       "단답 · 인간 활동·보전 토의와 실천",
       "환경 오염"
      ],
      [
       "61",
       "객관식 · 인간 활동·보전 토의와 실천",
       "③"
      ],
      [
       "62",
       "객관식 · 인간 활동·보전 토의와 실천",
       "①"
      ],
      [
       "63",
       "객관식 · 인간 활동·보전 토의와 실천",
       "⑤"
      ],
      [
       "64",
       "단답 · 인간 활동·보전 토의와 실천",
       "생태 통로"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "65~80번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식 · 주제",
      "정답"
     ],
     "rows": [
      [
       "65",
       "서술 · 인간 활동·보전 토의와 실천",
       "교사 확인(해설 쪽)"
      ],
      [
       "66",
       "서술 · 인간 활동·보전 토의와 실천",
       "교사 확인(해설 쪽)"
      ],
      [
       "67",
       "객관식 · 쓰레기 사진의 근거",
       "②"
      ],
      [
       "68",
       "객관식 · 계획과 실제 실행",
       "④"
      ],
      [
       "69",
       "모두 고르기 · 원인에 맞는 보전 행동",
       "①, ③, ④, ⑤"
      ],
      [
       "70",
       "모두 고르기 · 영향을 조사할 근거",
       "②, ③"
      ],
      [
       "71",
       "모두 고르기 · 실천 뒤 나누기",
       "①, ②, ④, ⑤"
      ],
      [
       "72",
       "빈칸 · 환경 오염의 구별",
       "㉠ 대기 · ㉡ 수질"
      ],
      [
       "73",
       "빈칸 · 실행과 계획",
       "㉠ 실천/실행 · ㉡ 계획"
      ],
      [
       "74",
       "빈칸 · 효과 확인의 범위",
       "㉠ 성분 · ㉡ 조사/관찰"
      ],
      [
       "75",
       "연결 · 문제와 대응 연결",
       "㉠-② · ㉡-③ · ㉢-①"
      ],
      [
       "76",
       "연결 · 짧은 기록의 상태",
       "㉠-③ · ㉡-① · ㉢-②"
      ],
      [
       "77",
       "연결 · 보전의 역할 나누기",
       "㉠-② · ㉡-③ · ㉢-①"
      ],
      [
       "78",
       "순서 · 토의에서 실천 확인까지",
       "㉢→㉣→㉠→㉡"
      ],
      [
       "79",
       "그림 · 학교 숲 보전 계획도",
       "교사 확인(해설 쪽)"
      ],
      [
       "80",
       "그림 · 실천을 확인하는 안내 카드",
       "교사 확인(해설 쪽)"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "쓰는 법",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    }
   ]
  }
 ],
 "figures": {
  "ecoFungus": "<figure class=\"ed-photo\"><img src=\"../assets/activities/c22-s42-u02/fungus-photo.webp\" alt=\"교재에서 곰팡이로 제시한 확대 사진\"><figcaption>같은 문항의 곰팡이 사진. 배율·색 처리는 미확인이며 학생이 배양한 관찰 결과가 아니에요.</figcaption></figure>",
  "ecoHabitat": "<figure class=\"ed-photo\" data-ecology-photo=\"habitat\"><img src=\"../assets/book/ecology-20261028/habitat.jpg\" alt=\"나무와 풀이 자라고 물과 흙이 함께 보이는 연못가\" width=\"1536\" height=\"1024\" loading=\"eager\" style=\"width:100%;height:auto;max-height:94mm;object-fit:contain\"><figcaption>연못가의 나무·풀·물·흙을 함께 살펴보아요.</figcaption></figure>",
  "ecoAnimals": "<figure class=\"ed-photo\" data-ecology-photo=\"meadow\"><img src=\"../assets/book/ecology-20261028/meadow.jpg\" alt=\"풀을 먹는 토끼와 뒤쪽 풀밭에 서 있는 여우\" width=\"1536\" height=\"1024\" loading=\"eager\" style=\"width:100%;height:auto;max-height:94mm;object-fit:contain\"><figcaption>풀밭의 풀·토끼·여우 · 수 변화는 모형 표로 비교해요.</figcaption></figure>",
  "ecoWaste": "<figure class=\"ed-photo\" data-ecology-photo=\"water-waste\"><img src=\"../assets/book/ecology-20261028/water-waste.jpg\" alt=\"물 표면에 떠 있는 플라스틱병과 비닐봉지, 일회용 컵\" width=\"1536\" height=\"1024\" loading=\"eager\" style=\"width:100%;height:auto;max-height:94mm;object-fit:contain\"><figcaption>물 위에 보이는 쓰레기와 주변 환경을 살펴보아요.</figcaption></figure>",
  "ecoRice": "<figure class=\"ed-photo\" data-ecology-photo=\"rice\"><img src=\"../assets/book/ecology-20261028/rice.jpg\" alt=\"긴 잎과 알곡이 달린 가지가 늘어진 벼 이삭\" width=\"1536\" height=\"1024\" loading=\"eager\" style=\"width:100%;height:auto;max-height:94mm;object-fit:contain\"><figcaption>벼의 잎과 알곡이 달린 이삭을 살펴보아요.</figcaption></figure>",
  "ecoRoles": "<div style=\"display:grid;grid-template-columns:1fr 1fr;gap:3mm\"><figure class=\"ed-photo\" data-ecology-photo=\"rice\"><img src=\"../assets/book/ecology-20261028/rice.jpg\" alt=\"긴 잎과 알곡이 달린 가지가 늘어진 벼 이삭\" width=\"1536\" height=\"1024\" loading=\"eager\" style=\"width:100%;height:auto;max-height:94mm;object-fit:contain\"><figcaption>벼의 잎과 알곡이 달린 이삭을 살펴보아요.</figcaption></figure><figure class=\"ed-photo\"><img src=\"../assets/activities/c22-s42-u02/fungus-photo.webp\" alt=\"교재에서 곰팡이로 제시한 확대 사진\"><figcaption>같은 문항의 곰팡이 사진. 배율·색 처리는 미확인이며 학생이 배양한 관찰 결과가 아니에요.</figcaption></figure></div>",
  "ecoRoleCards": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">생물</th><th scope=\"col\">제공된 조사 설명</th></tr></thead><tbody><tr><th scope=\"row\">벼</th><td>빛을 이용해 양분을 스스로 만든다</td></tr><tr><th scope=\"row\">메뚜기</th><td>식물을 먹어 양분을 얻는다</td></tr><tr><th scope=\"row\">곰팡이 A</th><td>죽은 식물의 물질을 분해해 양분을 얻는다</td></tr></tbody></table>",
  "ecoMeadow": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">3년 뒤 모형 조건</th><th scope=\"col\">풀</th><th scope=\"col\">토끼</th><th scope=\"col\">여우</th></tr></thead><tbody><tr><th scope=\"row\">그대로</th><td>60</td><td>12</td><td>3</td></tr><tr><th scope=\"row\">여우가 사라짐</th><td>28</td><td>28</td><td>0</td></tr></tbody></table><p class=\"ed-given\">3년 뒤 수는 경향 비교를 위해 미리 정한 연습 값이에요. 실제 생물 수나 생존 기간을 계산한 예측이 아니에요. 실제 생태계에는 다른 먹이 관계와 물·빛·온도 등 여러 조건이 있어요.</p>",
  "ecoChains": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">연습 사슬</th><th scope=\"col\">제공한 관계</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>풀 → 메뚜기 → 개구리 → 뱀</td></tr><tr><th scope=\"row\">2</th><td>풀 → 애벌레 → 작은 새 → 뱀</td></tr></tbody></table><p class=\"ed-given\">이 자료에 제시한 관계만 사용해요. 이름 카드의 수는 실제 개체 수가 아니에요.</p>",
  "ecoWeb": "<svg xmlns=\"http://www.w3.org/2000/svg\" class=\"ecology-food-desktop\" viewBox=\"0 0 780 280\" role=\"img\" aria-label=\"연습 먹이그물. 풀에서 메뚜기와 애벌레로, 메뚜기에서 개구리로, 애벌레에서 작은 새로, 개구리와 작은 새에서 뱀으로 화살표가 이어집니다.\"><defs><marker id=\"ecology-food-arrow-h\" viewBox=\"0 0 10 10\" refX=\"9\" refY=\"5\" markerWidth=\"6\" markerHeight=\"6\" orient=\"auto\"><path d=\"M0 0 10 5 0 10Z\" fill=\"#2456c4\"/></marker></defs><path data-food-edge=\"풀→메뚜기\" d=\"M138 140 L221 65\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"풀→애벌레\" d=\"M138 140 L221 215\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"메뚜기→개구리\" d=\"M343 65 L426 65\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"애벌레→작은 새\" d=\"M343 215 L426 215\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"개구리→뱀\" d=\"M548 65 L636 140\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><path data-food-edge=\"작은 새→뱀\" d=\"M548 215 L636 140\" fill=\"none\" stroke=\"#2456c4\" stroke-width=\"3\" marker-end=\"url(#ecology-food-arrow-h)\"/><g data-food-node=\"풀\"><rect x=\"23\" y=\"113\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#edf6ef\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"80\" y=\"148\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">풀</text></g><g data-food-node=\"메뚜기\"><rect x=\"228\" y=\"38\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"285\" y=\"73\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">메뚜기</text></g><g data-food-node=\"애벌레\"><rect x=\"228\" y=\"188\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"285\" y=\"223\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">애벌레</text></g><g data-food-node=\"개구리\"><rect x=\"433\" y=\"38\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"490\" y=\"73\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">개구리</text></g><g data-food-node=\"작은 새\"><rect x=\"433\" y=\"188\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"490\" y=\"223\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">작은 새</text></g><g data-food-node=\"뱀\"><rect x=\"643\" y=\"113\" width=\"114\" height=\"54\" rx=\"8\" fill=\"#fff\" stroke=\"#566274\" stroke-width=\"2\"/><text x=\"700\" y=\"148\" text-anchor=\"middle\" font-family=\"Pretendard,sans-serif\" font-size=\"23\" font-weight=\"700\" fill=\"#182230\">뱀</text></g></svg><p class=\"ed-given\">제공한 여섯 생물의 연습 관계예요. 화살표는 먹히는 쪽 → 먹는 쪽이에요. 이름표 하나가 한 마리나 실제 개체 수를 뜻하지 않아요.</p>",
  "ecoSurveyCards": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">제공 목록</th><th scope=\"col\">분류할 대상</th></tr></thead><tbody><tr><th scope=\"row\">㉠</th><td>나무 · 물</td></tr><tr><th scope=\"row\">㉡</th><td>개미 · 햇빛</td></tr><tr><th scope=\"row\">㉢</th><td>버섯 · 흙</td></tr></tbody></table><p class=\"ed-given\">관계 지도 만들기를 위한 제공 목록이에요. 학생이 직접 조사한 결과가 아니에요.</p>",
  "ecoWrongArrows": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">제공된 관계</th><th scope=\"col\">친구의 연결</th></tr></thead><tbody><tr><th scope=\"row\">메뚜기가 풀을 먹는다</th><td>메뚜기 → 풀</td></tr><tr><th scope=\"row\">개구리가 메뚜기를 먹는다</th><td>개구리 → 메뚜기</td></tr><tr><th scope=\"row\">뱀이 개구리를 먹는다</th><td>뱀 → 개구리</td></tr></tbody></table>",
  "ecoPracticeCards": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">연습 기록</th><th scope=\"col\">상태</th></tr></thead><tbody><tr><th scope=\"row\">월요일</th><td>물병을 준비했지만 집에 두고 와 사용 못 함</td></tr><tr><th scope=\"row\">화요일</th><td>물병을 실제 사용해 일회용 컵1개 대신함</td></tr><tr><th scope=\"row\">수요일</th><td>다음 주에도 사용할 준비 계획만 세움</td></tr></tbody></table><p class=\"ed-given\">실행과 계획을 구별하기 위한 가상 기록이에요. 실제 학생의 수행 자료는 아니에요.</p>",
  "ecoPollution": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">연습 사례</th><th scope=\"col\">바뀌는 환경과 대응</th></tr></thead><tbody><tr><th scope=\"row\">자동차 공회전·배출</th><td>대기 오염을 줄이는 관리·교통 방법</td></tr><tr><th scope=\"row\">처리하지 않은 폐수 배출</th><td>적절한 처리와 배출 관리</td></tr><tr><th scope=\"row\">흙에 버린 기름·폐기물</th><td>정해진 수거·배출과 안전한 관리</td></tr></tbody></table>",
  "ecoSources": "<p class=\"ed-given\">더 읽기: <a href=\"https://www.noaa.gov/education/resource-collections/marine-life/aquatic-food-webs\" target=\"_blank\" rel=\"noopener noreferrer\">NOAA · 먹이그물</a> / <a href=\"https://www.nps.gov/yell/learn/nature/cyclesprocesses.htm\" target=\"_blank\" rel=\"noopener noreferrer\">미국 국립공원청 · 생태계 관계와 변화</a>. 이 교재의 여섯 관계와 연습 수치는 별도의 제공 모형이에요.</p>",
  "given-c22-s42-u02-v021": "<p class=\"ed-given\"><b>자료</b> 달팽이는 상추를 먹고, 새 A는 달팽이를 먹습니다.</p>",
  "given-c22-s42-u02-v037": "<p class=\"ed-given\"><b>자료</b> 작은 물고기 A는 물풀을 먹고, 큰 물고기 B는 A를 먹습니다.</p>",
  "given-c22-s42-u02-v038": "<p class=\"ed-given\"><b>먹이그물</b> 풀 → 메뚜기 → 개구리 / 풀 → 들쥐 → 뱀 / 개구리 → 뱀</p>",
  "given-c22-s42-u02-v054": "<p class=\"ed-given\"><b>자료</b> 잔디는 빛으로 양분을 만든다. 토끼는 잔디를 먹는다. 곰팡이 A는 죽은 물질을 분해해 양분을 얻는다.</p>",
  "given-c22-s42-u02-v002": "<p class=\"ed-given\"><b>카드</b> 소나무, 빗물, 다람쥐, 햇빛, 버섯, 온도</p>",
  "given-c22-s42-u02-v018": "<p class=\"ed-given\"><b>자료</b> 물풀: 빛으로 양분을 만듦 / 우렁이: 물풀을 먹음 / 세균 A: 죽은 물질을 분해함</p><div class=\"ed-given\"><b>보기</b><p>ㄱ. 물풀 - 소비자</p><p>ㄴ. 우렁이 - 생산자</p><p>ㄷ. 세균 A - 분해자</p></div>",
  "given-c22-s42-u02-v058": "<div class=\"ed-given\"><b>자료</b><p>애벌레는 참나무 잎을 먹는다.</p><p>매는 박새를 먹는다.</p><p>박새는 애벌레를 먹는다.</p></div>",
  "given-c22-s42-u02-b12": "<p class=\"ed-given\"><b>자료</b> A는 빛을 이용해 양분을 만든다. B와 D는 A를 먹고 C는 B를 먹는다. E는 다른 작은 동물을 먹는다.</p>",
  "given-c22-s42-u02-b26": "<p class=\"ed-given\"><b>모형</b> 풀 → 메뚜기 → 개구리 → 뱀 / 풀 → 들쥐 → 뱀</p>",
  "given-c22-s42-u02-b31": "<p class=\"ed-given\"><b>모형</b> 풀 → 메뚜기 → 개구리 → 뱀 / 파리 → 개구리</p>",
  "given-c22-s42-u02-b29": "<p class=\"ed-given\"><b>그물</b> 풀 → 토끼 → 여우 / 풀 → 들쥐 → 여우</p>",
  "given-c22-s42-u02-b20": "<p class=\"ed-given\"><b>자료</b> 토끼가 풀을 먹는다. 곰팡이 A가 죽은 나무의 물질을 분해한다.</p>",
  "given-c22-s42-u02-b25": "<p class=\"ed-given\"><b>친구의 모형</b> 개구리 → 메뚜기</p><p class=\"ed-given\"><b>조사 자료</b> 개구리가 메뚜기를 먹는다.</p>",
  "given-c22-s42-u02-b35": "<p class=\"ed-given\"><b>친구의 주장</b> 먹이그물에는 다른 길이 있으니 한 먹이가 줄어도 모든 생물이 반드시 살아남아.</p>"
 },
 "teacherStudentPages": [
  {
   "section": "교과 연결 사고력",
   "title": "생물과 환경",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoHabitat",
     "caption": ""
    },
    {
     "type": "text",
     "text": "생물과 주변 환경을 함께 조사해요. 먹이 관계를 모형으로 만들고, 인간 활동의 영향을 알아보며 보전 방법을 실제로 토의하고 실천해요."
    },
    {
     "type": "field",
     "title": "처음 생각",
     "hint": "움직이지 않는 버섯은 생물일까요? 한 먹이가 줄면 모든 생물이 반드시 사라질까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "조사하고 · 연결하고 · 만들고 · 지키는 과학",
   "kind": "opener"
  },
  {
   "section": "배움의 지도",
   "title": "세 질문으로 생태계를 살펴요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "현행 성취기준",
      "배울 내용·연습 번호"
     ],
     "rows": [
      [
       "4과14-01",
       "생태계 구성·양분 역할 분류 / 1~28번"
      ],
      [
       "4과14-02",
       "먹이 관계·먹이그물 모형 / 29~56번"
      ],
      [
       "4과14-03",
       "인간 활동·보전 토의/실천 / 57~80번"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "사진과 설명·예제에서 근거를 찾아요.",
      "객관식·복수선택·단답·서술·빈칸·연결·순서·그림으로 연습해요.",
      "먹이그물을 실제로 만들고 보전 행동을 해 본 뒤 확인해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "나의 질문",
     "hint": "조사하고 싶은 장소·생물이나 더 알아볼 관계를 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "생태계 조사",
   "title": "생물과 주변 환경을 함께 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoHabitat",
     "caption": ""
    },
    {
     "type": "text",
     "text": "생물과 비생물 환경이 서로 영향을 주고받는 체계를 생태계라고 해요. 숲·하천·바다·작은 화단에도 다양한 구성 요소와 관계가 있어요."
    },
    {
     "type": "field",
     "title": "사진에서 본 것",
     "hint": "직접 보이는 대상 두 가지와 이 사진만으로 모르는 것 한 가지를 나누어 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "구성 요소 분류",
   "title": "움직임 대신 살아 있는지 살펴요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "생물 요소",
      "비생물 요소"
     ],
     "rows": [
      [
       "식물·동물·버섯·곰팡이 등",
       "물·공기·흙·햇빛·온도 등"
      ]
     ]
    },
    {
     "type": "example",
     "question": "흙이 비생물이면 흙 안에 생물이 없을까요?",
     "steps": [
      [
       "분류한 것",
       "환경으로서의 흙을 비생물 요소로 분류했어요."
      ],
      [
       "함께 살펴볼 것",
       "흙 속 지렁이·개미 등은 살아 있는 생물일 수 있어요."
      ]
     ],
     "answer": "환경인 흙과 흙 속 생물을 나누어 살펴요."
    },
    {
     "type": "field",
     "title": "나의 분류 기준",
     "hint": "버섯과 바위를 다르게 분류하는 까닭을 설명해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "양분을 얻는 방법",
   "title": "같은 장소에서도 역할이 달라요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoRoles",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "ecoRoleCards",
     "caption": ""
    },
    {
     "type": "example",
     "question": "곰팡이가 죽은 잎을 분해하면 무엇이 이어질까요?",
     "steps": [
      [
       "관계 확인",
       "분해자는 죽은 생물의 물질을 분해하며 양분을 얻어요."
      ],
      [
       "되돌아감",
       "분해 과정에서 환경으로 돌아간 양분은 식물이 다시 이용할 수 있어요."
      ]
     ],
     "answer": "죽은 잎의 물질도 생태계 관계에서 이어져요."
    },
    {
     "type": "field",
     "title": "역할의 근거",
     "hint": "생산자·소비자·분해자를 위 작용과 연결해 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "풀밭 관찰",
   "title": "풀밭의 생김새를 자세히 살펴요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoAnimals",
     "caption": ""
    },
    {
     "type": "text",
     "text": "사진에서 풀·토끼·여우의 모습을 살펴보아요. 먹이 관계와 실제 개체 수는 사진만으로 알 수 없어요. 다음 쪽의 모형 표와 사진을 구별해 읽어요."
    },
    {
     "type": "field",
     "title": "보이는 모습 설명하기",
     "hint": "풀·토끼·여우 중 두 생물을 골라 사진에서 확인한 생김새를 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "풀밭 모형 비교",
   "title": "한 조건을 바꾸어 경향을 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoMeadow",
     "caption": ""
    },
    {
     "type": "field",
     "title": "그대로와 비교",
     "hint": "여우가 없어진 조건에서 풀·토끼 수가 어떻게 다른지 표의 근거를 적어요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "모형의 한계",
     "hint": "화면의 수를 실제 생물 수나 생존 기간으로 예측할 수 없는 까닭을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "먹이 화살표",
   "title": "먹히는 쪽에서 먹는 쪽으로 이어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "제공된 먹는 관계",
      "알맞은 화살표"
     ],
     "rows": [
      [
       "메뚜기가 풀을 먹는다",
       "풀 → 메뚜기"
      ],
      [
       "개구리가 메뚜기를 먹는다",
       "메뚜기 → 개구리"
      ]
     ]
    },
    {
     "type": "example",
     "question": "개구리 → 메뚜기라고 그렸다면?",
     "steps": [
      [
       "관계 확인",
       "메뚜기를 먹는 생물이 개구리예요."
      ],
      [
       "방향 수정",
       "먹히는 메뚜기에서 먹는 개구리로 바꿔요."
      ]
     ],
     "answer": "메뚜기 → 개구리"
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "화살표의 시작과 끝이 무엇을 나타내는지 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "여러 사슬의 연결",
   "title": "같은 생물을 연결점으로 써요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "ecoWeb",
     "caption": ""
    },
    {
     "type": "field",
     "title": "같은 이름표 찾기",
     "hint": "두 사슬의 공통 생물과 연결되는 관계를 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "먹이그물 실제 만들기",
   "title": "카드와 화살표로 만들고 고쳐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "제공된 관계를 확인하고 이름 카드6장·화살표6개·큰 종이를 준비해요.",
      "같은 풀과 뱀 카드를 연결점으로 두 사슬을 실제로 이어 붙여요.",
      "짝과 자료를 대조해 누락된 선·뒤집힌 방향을 실제로 고쳐요.",
      "관계는 나타냈지만 실제 수·몸 크기·모든 환경 조건은 나타내지 못했음을 설명해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "제작 전 계획",
     "hint": "사용할 재료와 공통 카드를 어떻게 놓을지 그려 보아요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "text",
     "text": "교사 준비 재사용 종이·안전한 도구를 사용해요. 설계만 했거나 완성 그림을 보기만 했다면 아직 내 모형을 만든 것은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "다른 먹이 경로",
   "title": "도움이 될 수 있지만 생존 보장은 아니에요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "example",
     "question": "개구리가 줄면 뱀에게 무엇이 남을까요?",
     "steps": [
      [
       "남은 경로",
       "작은 새 → 뱀의 관계가 남아요."
      ],
      [
       "추가 조건",
       "작은 새의 양·서식지 등도 확인해야 해요."
      ]
     ],
     "answer": "다른 경로가 도움이 될 수 있지만 모든 생존을 보장하지 않아요."
    },
    {
     "type": "field",
     "title": "더 조사할 것",
     "hint": "한 먹이가 줄었을 때 영향을 알아볼 조건 두 가지를 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "인간 활동의 영향",
   "title": "보인 사실과 가능한 영향을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWaste",
     "caption": ""
    },
    {
     "type": "field",
     "title": "사진의 근거",
     "hint": "직접 보이는 사실과 성분·원인·생물 피해처럼 더 알아볼 것을 나누어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "text",
     "text": "인간 활동→바뀐 환경→생물에게 가능한 영향을 자료와 연결해요. 한 번 센 생물 수만으로 원인을 하나로 확정하지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "원인과 보전 방법",
   "title": "개인과 시설·지역의 할 일을 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoPollution",
     "caption": ""
    },
    {
     "type": "field",
     "title": "원인에 맞게 제안",
     "hint": "문제 한 가지를 골라 개인이 할 일과 학교·지역이 도울 일을 나누어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "text",
     "text": "풀밭 포장·숲을 가르는 도로는 사는 곳과 이동 길도 바꿀 수 있어요. 대안 위치·면적·이동 통로를 조사하고 만든 뒤 실제 이용도 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "근거로 실제 토의하기",
   "title": "보전 효과와 실행 여건을 비교해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "컵 쓰레기를 줄일 방법 예",
      "비교할 점"
     ],
     "rows": [
      [
       "재사용 컵·물병 이용",
       "새 쓰레기 감소·세척/보관·준비 여건"
      ],
      [
       "분리배출 안내·점검",
       "이미 나온 쓰레기 처리·안내/수거 여건"
      ]
     ]
    },
    {
     "type": "field",
     "title": "다른 의견의 근거",
     "hint": "두 방법의 장점·어려움과 짝의 의견에서 알게 된 점을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "함께 정할 것",
     "hint": "행동·장소·시기·역할·효과 확인 방법을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 방법의 효과와 실행 여건을 근거로 비교해요. 서로 다른 의견의 장점을 찾아 함께 할 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원과 에너지를 효율적으로 이용하는 사례를 비교해요. 재사용 물품의 세척·보관에 필요한 물과 에너지도 살피면, 사용하는 과정까지 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 방법의 기대 효과와 필요한 준비를 비교하고, 친구에게 물어볼 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실천하고 돌아보기",
   "title": "내 행동과 확인한 효과를 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoPracticeCards",
     "caption": ""
    },
    {
     "type": "field",
     "title": "실행과 미실행",
     "hint": "세 기록의 차이와 다음에 고칠 준비 방법을 설명해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "text",
     "text": "실제 물병 사용이나 안전한 분리배출 등 정한 행동을 해 보고, 날짜·행동·확인 범위를 짧게 남겨요. 내 컵 사용을 줄였다고 강 전체의 수질·생물 회복을 측정한 것은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "근거를 설명하고 나누기",
   "title": "모형과 실천에서 알게 된 것을 연결해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "만든 먹이그물의 화살표 하나를 골라 관계의 근거를 설명해요.",
      "보전 행동의 실제 실행·못 한 이유·확인한 효과를 말해요.",
      "친구의 질문·다른 근거를 듣고 설명이나 다음 실천을 고쳐요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "내가 설명할 핵심",
     "hint": "구성 요소·먹이 관계·보전 중 한 가지를 근거와 함께 정리해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "diagram",
     "key": "ecoSources",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 1·2·3",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w001",
      "c22-s42-u02-w002",
      "c22-s42-u02-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분해자는 죽은 생물 등의 물질을 분해하며 양분을 얻어요. 사는 장소나 몸의 색만으로 역할을 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물을 분류하는 체계를 배워요. 버섯과 곰팡이는 균계로 묶어요. 이 분류와 생산자·소비자·분해자라는 역할 분류는 기준이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "소비자와 분해자가 양분을 얻는 방법에서 공통점과 차이점을 한 가지씩 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 4·5·6",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w004",
      "c22-s42-u02-w005",
      "c22-s42-u02-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 7",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 8",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 9·10·11",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w009",
      "c22-s42-u02-w010",
      "c22-s42-u02-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 12·13·14",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w012",
      "c22-s42-u02-w013",
      "c22-s42-u02-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 15·16",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w015",
      "c22-s42-u02-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분해자는 죽은 생물 등의 물질을 분해하며 양분을 얻어요. 사는 장소나 몸의 색만으로 역할을 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물을 분류하는 체계를 배워요. 버섯과 곰팡이는 균계로 묶어요. 이 분류와 생산자·소비자·분해자라는 역할 분류는 기준이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "소비자와 분해자가 양분을 얻는 방법에서 공통점과 차이점을 한 가지씩 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 17",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 18",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 19",
   "title": "생태계 구성·양분 역할 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "분해자는 죽은 생물 등의 물질을 분해하며 양분을 얻어요. 사는 장소나 몸의 색만으로 역할을 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물을 분류하는 체계를 배워요. 버섯과 곰팡이는 균계로 묶어요. 이 분류와 생산자·소비자·분해자라는 역할 분류는 기준이 달라요."
    },
    {
     "title": "내가 정리할 것",
     "text": "소비자와 분해자가 양분을 얻는 방법에서 공통점과 차이점을 한 가지씩 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 20",
   "title": "사진에서 확인한 사실",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoHabitat",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 21",
   "title": "역할 판단의 근거",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoRoleCards",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w021"
     ]
    },
    {
     "type": "field",
     "title": "분류 기준 설명하기",
     "hint": "위 카드의 두 생물을 골라 양분을 얻는 방법의 차이를 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물의 역할은 양분을 얻는 방법으로 나누어요. 생산자는 스스로 양분을 만들고, 소비자는 다른 생물을 먹어 양분을 얻어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 잎에서 일어나는 광합성을 배워요. 식물은 빛을 이용해 양분을 만들어요. 생산자의 역할을 식물의 잎이 하는 일과 연결할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생산자와 한 소비자가 양분을 얻는 방법을 비교해 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 22·23·24·25",
   "title": "생물과 환경의 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w022",
      "c22-s42-u02-w023",
      "c22-s42-u02-w024",
      "c22-s42-u02-w025"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생물 요소와 비생물 요소는 살아 있는지로 나누어요. 움직이지 않는 버섯도 생물이며, 흙 속에는 생물이 살 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 현미경으로 식물 세포를 관찰해요. 식물의 잎도 아주 작은 세포들로 이루어져 있어요. 세포는 생물을 이루는 기본 단위예요."
    },
    {
     "title": "내가 정리할 것",
     "text": "생물 요소와 비생물 요소를 하나씩 고르고, 그렇게 나눈 근거를 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 26·27",
   "title": "양분 얻는 방법 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w026",
      "c22-s42-u02-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 28",
   "title": "구성 요소 관계 지도",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoSurveyCards",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생태계는 생물과 비생물 환경이 서로 영향을 주고받는 체계예요. 생물 이름과 주변 환경을 함께 조사해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 식물 속 물의 이동을 알아봐요. 뿌리로 흡수한 물이 줄기를 거쳐 잎까지 이동하므로, 주변의 물은 식물의 생활과 이어져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물과 주변 환경 하나를 골라, 서로 어떤 관련이 있을지 조사할 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 29·30·31",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w029",
      "c22-s42-u02-w030",
      "c22-s42-u02-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 32·33·34",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w032",
      "c22-s42-u02-w033",
      "c22-s42-u02-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 35·36·37",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w035",
      "c22-s42-u02-w036",
      "c22-s42-u02-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 38",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 39",
   "title": "먹이 관계·먹이그물 모형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 40·41",
   "title": "모형의 두 조건 비교",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoMeadow",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "ecoWeb",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w040",
      "c22-s42-u02-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 42·43·44",
   "title": "자료에 맞는 화살표",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w042",
      "c22-s42-u02-w043",
      "c22-s42-u02-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 45·46·47·48",
   "title": "수치 모형의 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w045",
      "c22-s42-u02-w046",
      "c22-s42-u02-w047",
      "c22-s42-u02-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 49·50",
   "title": "남아 있는 경로",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWeb",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w049",
      "c22-s42-u02-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 51·52·53",
   "title": "모형 요소의 뜻",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w051",
      "c22-s42-u02-w052",
      "c22-s42-u02-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 필요한 관계나 경향을 골라 나타낸 것이에요. 실제 생물 수는 여러 조건의 영향을 받으므로 연습 수치를 그대로 예측값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 온도계로 온도를 재요. 생물의 수를 조사한 날의 온도도 함께 재면, 날짜마다 달랐던 환경을 측정값으로 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이 모형이 나타낸 것 하나와 나타내지 않은 것 하나를 구별하고, 더 필요한 조사 자료를 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 54",
   "title": "먹이그물 모형 설계",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 55",
   "title": "잘못된 연결 고치기",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWrongArrows",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "먹이 화살표는 먹히는 생물에서 먹는 생물을 향해요. 제공된 먹는 관계 하나하나를 화살표와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 동물이 먹이에서 얻은 양분으로 생명 활동에 필요한 에너지를 얻는 과정을 배워요. 먹이 화살표를 따라 양분과 에너지의 전달도 생각해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "먹이 관계 하나를 골라 “누가 무엇을 먹는다”와 화살표의 시작·끝을 함께 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 56",
   "title": "남은 경로와 확인할 조건",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoChains",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "여러 먹이 사슬의 같은 생물을 연결점으로 이으면 먹이그물이 돼요. 다른 경로가 남아도 먹이의 양과 환경을 함께 살펴야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성 보전을 배워요. 한 생물을 지키려면 그 생물뿐 아니라 먹이와 서식지 등 다른 생물·환경과의 관계도 함께 살펴야 해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "한 생물의 먹이가 줄었을 때 남는 경로를 표시하고, 영향을 알려면 무엇을 더 조사할지 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 57·58·59",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w057",
      "c22-s42-u02-w058",
      "c22-s42-u02-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 60·61·62",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w060",
      "c22-s42-u02-w061",
      "c22-s42-u02-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 63·64",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w063",
      "c22-s42-u02-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 방법의 효과와 실행 여건을 근거로 비교해요. 서로 다른 의견의 장점을 찾아 함께 할 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원과 에너지를 효율적으로 이용하는 사례를 비교해요. 재사용 물품의 세척·보관에 필요한 물과 에너지도 살피면, 사용하는 과정까지 비교할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "두 방법의 기대 효과와 필요한 준비를 비교하고, 친구에게 물어볼 질문을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 65",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서식지가 줄거나 이동 길이 끊기면 생물의 생활도 달라질 수 있어요. 보전 방법은 생물과 사람의 이용을 함께 고려해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성을 유지하는 방법을 배워요. 서로 다른 생물이 살아갈 장소를 보전하는 일은 한 종류의 생물만 지키는 것보다 넓은 관점이에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 장소를 이용하는 두 대안을 제안하고, 생물의 사는 곳과 사람의 이용 면에서 비교해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 66",
   "title": "인간 활동·보전 토의와 실천",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 67·68",
   "title": "쓰레기 사진의 근거",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoWaste",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w067",
      "c22-s42-u02-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 69·70·71",
   "title": "원인에 맞는 보전 행동",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w069",
      "c22-s42-u02-w070",
      "c22-s42-u02-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 72·73·74",
   "title": "환경 오염의 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w072",
      "c22-s42-u02-w073",
      "c22-s42-u02-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "인간 활동 → 바뀐 환경 → 생물에게 미칠 영향을 연결해요. 오염된 물이나 날카로운 폐기물은 만지지 않고 어른에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 산성화로 생태계가 피해를 입는 사례를 알아봐요. 물이 맑아 보이는지와 어떤 성질의 물인지가 서로 다른 조사 질문임을 알 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 사실 하나를 쓰고, 오염 원인이나 생물의 영향을 확인할 조사 질문을 덧붙여요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 75·76",
   "title": "문제와 대응 연결",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w075",
      "c22-s42-u02-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 77·78",
   "title": "보전의 역할 나누기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w077",
      "c22-s42-u02-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보전 행동은 원인에 맞게 골라요. 개인이 할 일과 학교·지역이 함께 할 일을 나누어 실행 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 물·산림·광물 자원을 효율적으로 이용하는 방법을 배워요. 물건을 오래 쓰고 재사용하면 새 물건을 만드는 데 드는 자원 사용을 줄일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "줄이려는 문제와 직접 연결되는 행동을 고르고, 누가 언제 어디서 할지 구체적으로 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "연습 79",
   "title": "학교 숲 보전 계획도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서식지가 줄거나 이동 길이 끊기면 생물의 생활도 달라질 수 있어요. 보전 방법은 생물과 사람의 이용을 함께 고려해요."
    },
    {
     "title": "더 알아보기",
     "text": "중학교에서는 생물다양성을 유지하는 방법을 배워요. 서로 다른 생물이 살아갈 장소를 보전하는 일은 한 종류의 생물만 지키는 것보다 넓은 관점이에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 장소를 이용하는 두 대안을 제안하고, 생물의 사는 곳과 사람의 이용 면에서 비교해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "연습 80",
   "title": "실천을 확인하는 안내 카드",
   "blocks": [
    {
     "type": "diagram",
     "key": "ecoPracticeCards",
     "caption": ""
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u02-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제로 한 행동·확인한 효과를 나누어요. 못 한 이유는 다음 실천의 준비를 고치는 데 활용해요."
    },
    {
     "title": "더 알아보기",
     "text": "5~6학년에서는 자원이 유한함을 배워요. 한 번 쓰고 버리는 물건의 사용을 줄이는 일은 쓰레기뿐 아니라 새로 쓰는 자원의 양도 줄이는 데 연결돼요."
    },
    {
     "title": "내가 정리할 것",
     "text": "확인할 수 있는 행동 하나와 그 효과를 살필 방법을 정하고, 다음에 고칠 점을 적어요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  }
 ],
 "modelNotice": "3년 뒤 수는 경향 비교를 위해 미리 정한 연습 값이에요. 실제 생물 수나 생존 기간을 계산한 예측이 아니에요. 실제 생태계에는 다른 먹이 관계와 물·빛·온도 등 여러 조건이 있어요.",
 "foodEdges": [
  [
   "풀",
   "메뚜기"
  ],
  [
   "풀",
   "애벌레"
  ],
  [
   "메뚜기",
   "개구리"
  ],
  [
   "애벌레",
   "작은 새"
  ],
  [
   "개구리",
   "뱀"
  ],
  [
   "작은 새",
   "뱀"
  ]
 ],
 "sourceSelection": [
  "c22-s42-u02-v004",
  "c22-s42-u02-v016",
  "c22-s42-u02-v017",
  "c22-s42-u02-v033",
  "c22-s42-u02-v052",
  "c22-s42-u02-v053",
  "c22-s42-u02-v054",
  "c22-s42-u02-v003",
  "c22-s42-u02-v001",
  "c22-s42-u02-v002",
  "c22-s42-u02-v018",
  "c22-s42-u02-b03",
  "c22-s42-u02-b07",
  "c22-s42-u02-b12",
  "c22-s42-u02-b18",
  "c22-s42-u02-b19",
  "c22-s42-u02-b05",
  "c22-s42-u02-b10",
  "c22-s42-u02-b20",
  "c22-s42-u02-v020",
  "c22-s42-u02-v021",
  "c22-s42-u02-v037",
  "c22-s42-u02-v038",
  "c22-s42-u02-v058",
  "c22-s42-u02-b26",
  "c22-s42-u02-b31",
  "c22-s42-u02-b37",
  "c22-s42-u02-b29",
  "c22-s42-u02-b25",
  "c22-s42-u02-b35",
  "c22-s42-u02-v028",
  "c22-s42-u02-v029",
  "c22-s42-u02-v046",
  "c22-s42-u02-v068",
  "c22-s42-u02-b43",
  "c22-s42-u02-b53",
  "c22-s42-u02-b78",
  "c22-s42-u02-b59",
  "c22-s42-u02-b45",
  "c22-s42-u02-b65"
 ]
};

export const observationPriorWorkbook=withStudentOpeningLanguage(baseWorkbook);
export const workbook=withObservationLanguage(observationPriorWorkbook);
