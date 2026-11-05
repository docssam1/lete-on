import{withInfectionLearnerReasoning}from'./c22-s32-u04.rail-notes.js?v=20261105-infection-learner-reasoning';
import {withStudentOpeningLanguage} from './student-opening-language.js';
import {withInfectionRails,withInfectionUpperScience} from './c22-s32-u04.rail-notes.js?v=20261105-infection-upper-science';
// 감염병과 건강한 생활 — 편집 교재(문제집형 A4). scripts/gen-science-workbook-c22s32u04.mjs 가 만든다(직접 고치지 말 것).
// 그리는 곳: v2/think-workbook-paper.js → #/c22-s32-u04/workbook/student|teacher|answers|quick
const baseWorkbook = {
 "unit": "c22-s32-u04",
 "title": "감염병과 건강한 생활",
 "semester": "3-2",
 "no": 4,
 "theme": "#2456c4",
 "richText": true,
 "questions": [
  {
   "id": "c22-s32-u04-w001",
   "no": 1,
   "form": "choice",
   "topic": "감염병",
   "prompt": "감염병에 대한 설명으로 알맞은 것은?",
   "answer": "③ 병원체가 몸에 들어와 감염되어 생기는 병이다",
   "explanation": "병원체의 감염으로 생기는 병인지가 기준이에요. 몸이 아프다는 사실만으로 모두 감염병은 아니에요. 잠 부족이나 다친 원인과 구별해요.",
   "misconception": "아프거나 피곤하면 원인과 관계없이 감염병이라고 하지 않았나요?",
   "criteria": "병원체의 감염을 기준으로 설명한 보기를 골라요.",
   "choices": [
    "몸이 피곤하면 원인에 관계없이 생기는 병이다",
    "비슷한 증상이 있으면 모두 같은 감염병이다",
    "병원체가 몸에 들어와 감염되어 생기는 병이다",
    "가까이 있으면 누구나 반드시 옮는 병이다",
    "눈에 보이는 병원체만 일으키는 병이다"
   ],
   "key": 2,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "감염병",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     2
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w002",
   "no": 2,
   "form": "short",
   "topic": "손 씻기",
   "prompt": "손을 씻으면 감기가 덜 옮는 까닭은 무엇일까요? 처음 생각을 써요.",
   "answer": "손에 묻은 병원체가 씻겨 나가, 다른 사람이나 내 입·코로 옮겨 가는 것이 줄어들기 때문",
   "explanation": "처음 생각과 그 까닭을 남기는 문항이에요. 손에서 다른 곳으로 옮겨 가는 길을 예상하고 단원 뒤 모형 근거와 비교해요. 지금의 생각을 확정 정답으로 판정하지 않아요.",
   "misconception": "처음 예상과 실험 뒤의 근거 있는 설명을 같은 것으로 보지 않았나요?",
   "criteria": "처음 생각과 이유를 쓰면 인정해요. 옳고 그름이나 실제 예방 효과를 이 답으로 확정하지 않아요.",
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "처음 생각과 이유를 쓰면 인정해요. 옳고 그름이나 실제 예방 효과를 이 답으로 확정하지 않아요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "손 씻기",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   }
  },
  {
   "id": "c22-s32-u04-w003",
   "no": 3,
   "form": "multi",
   "topic": "예방 생활",
   "prompt": "감염병 예방에 도움이 되는 행동을 모두 고르세요.",
   "answer": "①, ③, ⑤",
   "explanation": "손 씻기·기침 예절·환기는 서로 다른 옮겨 가는 길을 줄이는 행동이에요. 같은 컵을 쓰거나 손바닥으로 가리면 다른 사람이나 물건으로 이어질 수 있어요. 여러 행동을 함께 실천해요.",
   "misconception": "한 수칙을 지키면 나머지 수칙은 필요 없다고 하지 않았나요?",
   "criteria": "손 씻기·옷소매로 가리기·환기를 모두 고르고 컵 공유·손바닥 가리기는 제외해요.",
   "choices": [
    "밖에서 돌아오면 비누로 손을 씻는다",
    "친구와 같은 컵으로 물을 나누어 마신다",
    "기침할 때 옷소매 안쪽으로 가린다",
    "손바닥으로 입을 가리고 기침한다",
    "교실 창문을 열어 자주 환기한다"
   ],
   "key": [
    0,
    2,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "예방 생활",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      2,
      4
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w004",
   "no": 4,
   "form": "blank",
   "topic": "병원체",
   "prompt": "세균·바이러스처럼 감염병을 일으키는 것을 묶어 [ ]라고 해요.",
   "answer": "병원체",
   "explanation": "빈칸은 감염병의 이름이 아니라 감염병을 일으키는 것을 묶은 말이에요. 세균·바이러스 등이 병원체의 예예요. 병의 이름과 원인이 되는 것을 구별해요.",
   "misconception": "감염병과 병원체를 서로 바꾸어 쓰지 않았나요?",
   "criteria": "병원체를 쓰면 인정해요. 세균 한 종류만 쓰면 묶어 부르는 말이 아니에요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "병원체",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "word",
    "teacherRequired": false,
    "accepted": [
     "병원체"
    ]
   }
  },
  {
   "id": "c22-s32-u04-w005",
   "no": 5,
   "form": "match",
   "topic": "감염병",
   "prompt": "감염병이면 ○, 감염병이 아니면 ×를 써요.",
   "answer": "(1) ○ (2) × (3) ○ (4) ○",
   "explanation": "감기·독감과 감염으로 생긴 장염은 병원체가 원인이에요. 넘어져 생긴 상처는 그 다친 사건을 뜻해요. 상처에 나중에 감염될 수 있다는 다른 상황을 더하지 않아요.",
   "misconception": "상처가 난 것과 상처가 감염된 것을 같은 상황으로 보지 않았나요?",
   "criteria": "감기○·넘어진 상처×·독감○·감염성 장염○를 순서대로 써요.",
   "parts": [
    "(1) 감기",
    "(2) 넘어져서 생긴 무릎 상처",
    "(3) 독감",
    "(4) 병원체 감염으로 생긴 장염"
   ],
   "answerPerPart": true,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "감염병",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "○",
      "×",
      "○",
      "○"
     ],
     [
      "O",
      "X",
      "O",
      "O"
     ]
    ]
   }
  },
  {
   "id": "c22-s32-u04-w006",
   "no": 6,
   "form": "choice",
   "topic": "병원체",
   "prompt": "세균·바이러스 같은 병원체에 대한 설명으로 알맞은 것은?",
   "answer": "⑤ 너무 작아 맨눈으로 보기 어렵다",
   "explanation": "세균·바이러스 같은 병원체는 맨눈으로 확인하기 어려워요. 손이 깨끗해 보인다는 관찰만으로 없다고 할 수 없어요. 손이나 물건을 거쳐 옮겨 갈 수 있어요.",
   "misconception": "겉모습으로 병원체의 유무를 확정하지 않았나요?",
   "criteria": "맨눈으로 보기 어렵다는 보기를 골라요. 보이지 않는다는 것이 없다는 뜻은 아니에요.",
   "choices": [
    "겉으로 깨끗해 보이면 병원체도 없다",
    "기침이 없으면 손과 물건으로는 옮지 않는다",
    "손을 씻은 뒤에는 다시 묻을 수 없다",
    "눈에 보이는 먼지의 양으로 그 수를 안다",
    "너무 작아 맨눈으로 보기 어렵다"
   ],
   "key": 4,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "병원체",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     4
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w007",
   "no": 7,
   "form": "written",
   "topic": "병원체",
   "prompt": "「손이 깨끗해 보이니까 밥 먹기 전에 손을 안 씻어도 돼.」 이 말을 바르게 고쳐 써요.",
   "answer": "병원체는 눈에 보이지 않아서 깨끗해 보이는 손에도 있을 수 있다. 그래서 밥 먹기 전에는 비누로 손을 씻어야 한다.",
   "explanation": "눈에 보이는 먼지가 없는 것과 병원체가 없는 것은 달라요. 깨끗해 보이는 손에도 묻어 있을 수 있어요. 그래서 식사 전 손 씻기를 겉모습만으로 생략하지 않아요.",
   "misconception": "보이지 않으니 손을 씻을 필요도 없다고 하지 않았나요?",
   "criteria": "겉모습으로 알 수 없음과 식사 전 비누 손 씻기를 연결하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "병원체",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "겉모습으로 알 수 없음과 식사 전 비누 손 씻기를 연결하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w008",
   "no": 8,
   "form": "choice",
   "topic": "배려",
   "prompt": "반 친구가 독감에 걸려 학교를 쉬게 되었어요. 가장 알맞은 행동은?",
   "answer": "② 쉬도록 응원하고 우리는 예방 수칙을 지킨다",
   "explanation": "친구가 쉬는 동안 회복을 응원하고 우리도 예방 행동을 지켜요. 감염 경로를 알지 못한 채 친구 탓으로 정하지 않아요. 도움과 예방은 함께 할 수 있어요.",
   "misconception": "예방한다는 이유로 친구를 탓하거나 따돌려도 된다고 생각하지 않았나요?",
   "criteria": "회복을 응원하고 수칙을 지키는 보기를 골라요.",
   "choices": [
    "친구가 돌아오면 아무와도 놀지 못하게 한다",
    "쉬도록 응원하고 우리는 예방 수칙을 지킨다",
    "친구 탓에 반 전체가 아플 거라고 말한다",
    "쉬는 친구 집에 바로 찾아가 함께 논다",
    "독감은 옮지 않으니 아무것도 조심하지 않는다"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "배려",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     1
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w009",
   "no": 9,
   "form": "blank",
   "topic": "옮겨 가는 길",
   "prompt": "기침이나 재채기를 할 때 입과 코에서 나오는 작은 침방울을 [ ]이라고 해요.",
   "answer": "비말",
   "explanation": "기침·재채기 때 나오는 작은 침방울을 비말이라고 해요. 그 침방울에 병원체가 섞여 있을 수 있어요. 비말 자체와 병원체는 같은 낱말이 아니에요.",
   "misconception": "침방울을 병원체 그 자체라고 쓰지 않았나요?",
   "criteria": "비말 또는 침방울을 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "word",
    "teacherRequired": false,
    "accepted": [
     "비말",
     "침방울"
    ]
   }
  },
  {
   "id": "c22-s32-u04-w010",
   "no": 10,
   "form": "written",
   "topic": "옮겨 가는 길",
   "prompt": "병원체로 오염된 음식을 먹어 감염된 가상 상황이에요. 병원체가 옮겨 간 길과 예방 행동을 한 가지씩 써요.",
   "answer": "음식 속 병원체가 음식을 먹을 때 몸에 들어갔다. 어른이 음식을 충분히 익혀 조리하고 손을 깨끗이 씻는 것이 예방에 도움이 된다.",
   "explanation": "음식을 통해 감염됐다고 주어진 가상 상황을 읽어요. 음식의 병원체가 몸으로 들어간 길과 안전한 조리·손 씻기를 연결해요. 배가 아프다는 증상만 보고 원인을 정한 문제가 아니에요.",
   "misconception": "증상 하나만 보고 음식이 원인이라고 진단하지 않았나요?",
   "criteria": "음식을 통한 경로와 충분한 조리 또는 조리 전 손 씻기의 연결을 인정해요. 학생에게 위험한 조리를 요구하지 않아요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "음식을 통한 경로와 충분한 조리 또는 조리 전 손 씻기의 연결을 인정해요. 학생에게 위험한 조리를 요구하지 않아요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w011",
   "no": 11,
   "form": "match",
   "topic": "옮겨 가는 길",
   "prompt": "옮겨 가는 길에 알맞은 예방 행동을 〈보기〉에서 골라 기호를 써요.",
   "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
   "explanation": "손·물건의 접촉에는 손 씻기, 침방울에는 기침 예절을 연결해요. 물·음식에는 안전한 물과 충분한 조리를 연결해요. 대표 연결이며 한 행동이 모든 경로를 막는다는 뜻은 아니에요.",
   "misconception": "경로마다 예방 행동이 완전히 하나뿐이라고 보지 않았나요?",
   "criteria": "접촉ㄱ·비말ㄴ·물과 음식ㄷ를 순서대로 연결해요.",
   "parts": [
    "(1) 손이나 물건이 닿아서(접촉)",
    "(2) 기침할 때 침방울로(비말)",
    "(3) 오염된 물과 음식으로"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 비누로 손 씻기",
    "ㄴ. 옷소매 안쪽으로 가리고 기침하기",
    "ㄷ. 음식은 익혀 먹고 물은 끓여 마시기"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄱ",
      "ㄴ",
      "ㄷ"
     ]
    ]
   }
  },
  {
   "id": "c22-s32-u04-w012",
   "no": 12,
   "form": "choice",
   "topic": "옮겨 가는 길",
   "prompt": "병원체가 묻은 문손잡이→손→눈으로 옮겨 갔다고 정한 가상 이야기예요. 제시한 경로는 무엇인가요?",
   "answer": "① 접촉",
   "explanation": "주어진 이야기는 문손잡이→손→눈의 접촉 경로예요. 손과 물건이 이어지는 점이 근거예요. 눈이 불편하다는 증상만으로 병명이나 원인을 정하지 않아요.",
   "misconception": "물건을 만진 이야기만으로 실제 감염을 확정하지 않았나요?",
   "criteria": "주어진 가상 경로에 해당하는 접촉을 골라요.",
   "choices": [
    "접촉",
    "비말",
    "공기",
    "물",
    "음식"
   ],
   "key": 0,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     0
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w013",
   "no": 13,
   "form": "multi",
   "topic": "옮겨 가는 길",
   "prompt": "호흡기 감염병이 유행해 환기·기침 예절·상황에 맞는 마스크 착용을 안내받았어요. 공기나 침방울을 통한 전달을 줄이는 행동을 모두 고르세요.",
   "answer": "①, ②, ④",
   "explanation": "환기는 실내 공기를 바꾸고 옷소매와 마스크는 침방울이 퍼지는 것을 줄이는 데 관련돼요. 음식 조리와 컵 공유 문제는 이 질문의 경로와 구별해요. 안내에 맞는 행동을 함께 해요.",
   "misconception": "한 경로에 맞는 행동을 다른 경로까지 완전히 막는 방법으로 보지 않았나요?",
   "criteria": "환기·옷소매로 가리기·안내에 맞는 마스크 착용을 모두 골라요.",
   "choices": [
    "교실 창문을 열어 환기한다",
    "기침할 때 옷소매로 가린다",
    "음식을 익히면 환기를 하지 않아도 된다",
    "안내에 맞게 마스크로 코와 입을 가린다",
    "컵만 각자 쓰면 기침을 가리지 않아도 된다"
   ],
   "key": [
    0,
    1,
    3
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      1,
      3
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w014",
   "no": 14,
   "form": "choice",
   "topic": "반짝이 모형",
   "prompt": "반짝이 가루 손 모형에서 반짝이 가루가 나타내는 것은?",
   "answer": "④ 손에서 손으로 옮겨 가는 병원체",
   "explanation": "반짝이는 손을 거쳐 옮겨 가는 병원체를 나타내는 표식이에요. 실제 병원체를 손에 묻혀 실험하는 것이 아니에요. 눈에 보이게 한 모형의 역할과 실제 물질을 구별해요.",
   "misconception": "반짝이 자체가 실제 병원체라고 하지 않았나요?",
   "criteria": "손에서 손으로 옮겨 가는 병원체를 나타낸다는 보기를 골라요.",
   "choices": [
    "병원체를 없애 주는 비누 거품",
    "손을 씻을 때 쓰는 깨끗한 물",
    "감염병에 걸린 사람의 높은 열",
    "손에서 손으로 옮겨 가는 병원체",
    "친구와 악수를 한 모든 횟수"
   ],
   "key": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "반짝이 모형",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     3
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w015",
   "no": 15,
   "form": "short",
   "topic": "반짝이 모형",
   "prompt": "아무도 손을 씻지 않을 때, 1차례 악수한 뒤 반짝이가 묻은 친구는 누구인가요?",
   "answer": "A, B",
   "explanation": "처음에는 A에게만 표식이 있어요. 첫 짝A-B가 악수하면 B에도 남고 C-D·E-F에는 옮겨 갈 표식이 없어요. 따라서 첫 차례 뒤 A와 B예요.",
   "misconception": "표식을 받은 B만 세거나 처음 A를 빼지 않았나요?",
   "criteria": "A와 B를 순서와 관계없이 모두 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "반짝이 모형",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "set",
    "teacherRequired": false,
    "accepted": [
     [
      "A",
      "B"
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w016",
   "no": 16,
   "form": "choice",
   "topic": "반짝이 모형",
   "prompt": "아무도 손을 씻지 않을 때, 악수 차례가 늘어날수록 결과는 어떠했나요?",
   "answer": "③ 차례마다 2명, 4명, 6명으로 늘어났다",
   "explanation": "정해진 짝을 처음A부터 차례대로 따라가요. 1차례A·B, 2차례A·B·C·F, 3차례에는 여섯 명 모두예요. 이 모형의2→4→6을 실제 감염 속도로 읽지 않아요.",
   "misconception": "다음 차례에 옮겨 받은 친구도 다시 옮길 수 있다는 점을 빠뜨리지 않았나요?",
   "criteria": "모형에서2명→4명→6명이라는 보기를 골라요.",
   "choices": [
    "세 차례 내내 A 한 명에게만 묻어 있었다",
    "차례마다 6명, 4명, 2명으로 줄어들었다",
    "차례마다 2명, 4명, 6명으로 늘어났다",
    "첫 차례부터 6명 모두에게 반짝이가 묻었다",
    "차례와 상관없이 늘 3명에게 묻어 있었다"
   ],
   "key": 2,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "반짝이 모형",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     2
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w017",
   "no": 17,
   "form": "written",
   "topic": "반짝이 모형",
   "prompt": "처음에는 A에게만 있던 반짝이가 3차례 뒤 6명 모두에게 묻은 까닭을 써요.",
   "answer": "악수할 때마다 반짝이가 묻은 손이 다른 친구의 손에 닿아 옮겨 갔기 때문이다. 옮겨 받은 친구가 다음 차례에 또 다른 친구에게 옮겼다.",
   "explanation": "표식이 묻은 손이 다른 손에 닿으면 그 손에도 남는 규칙이에요. 옮겨 받은 친구가 다음 짝에게도 옮겨요. 처음A만 계속 옮기는 것으로 설명하지 않아요.",
   "misconception": "모든 친구가 A와 직접 악수해야만 표식이 생긴다고 생각하지 않았나요?",
   "criteria": "손의 접촉과 옮겨 받은 친구의 다음 전달을 함께 설명하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "반짝이 모형",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "손의 접촉과 옮겨 받은 친구의 다음 전달을 함께 설명하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w018",
   "no": 18,
   "form": "short",
   "topic": "손 씻기 규칙",
   "prompt": "「B·D·F가 차례마다 손 씻기」 규칙에서, 2차례 뒤 반짝이가 묻은 친구는 누구인가요?",
   "answer": "A, F",
   "explanation": "첫 차례 뒤A·B에 표식이 있어요. 둘째 차례 전에B·D·F가 씻어 A만 남고, F-A에서 F에 옮겨요. 둘째 차례 뒤에는A와F예요.",
   "misconception": "씻기 전A·B를 둘째 차례 결과로 쓰지 않았나요?",
   "criteria": "A와F를 모두 쓰면 인정해요. 씻기와 악수의 시점을 구별해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "손 씻기 규칙",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "set",
    "teacherRequired": false,
    "accepted": [
     [
      "A",
      "F"
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w019",
   "no": 19,
   "form": "choice",
   "topic": "손 씻기 규칙",
   "prompt": "짝·차례가 같은 두 모형 규칙의3차례 뒤 결과를 비교한 설명으로 알맞은 것은?",
   "answer": "⑤ 손 씻기 규칙에서 표식 있는 친구 수가 줄었다",
   "explanation": "짝·시작 위치·차례는 같고 손 씻기 규칙만 달라요. 3차례 뒤 표식이 있는 친구는6명과2명이에요. 이 비교는 정해진 모형에서 표식 전달이 줄어든 근거예요.",
   "misconception": "6명과2명을 실제 환자 수나 정확한 예방 비율로 바꾸지 않았나요?",
   "criteria": "이 모형에서 표식이 있는 친구 수가 줄었다는 보기를 골라요.",
   "choices": [
    "시작 표식이 달라도 규칙 하나만의 효과를 비교한 것이다",
    "6명과2명은 우리 반의 실제 환자 수이다",
    "씻는 규칙에서는 아무도 악수를 하지 않았다",
    "한 사람이 씻으면 모든 차례에서 표식이0이 된다",
    "손 씻기 규칙에서 표식 있는 친구 수가 줄었다"
   ],
   "key": 4,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "손 씻기 규칙",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     4
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w020",
   "no": 20,
   "form": "written",
   "topic": "반짝이 모형",
   "prompt": "모형의 반짝이와 실제 병원체가 다른 점을 한 가지 써요.",
   "answer": "반짝이는 눈에 보이지만 실제 병원체는 너무 작아 눈에 보이지 않는다. (또는) 반짝이는 저절로 늘어나지 않지만 병원체는 몸속에서 수가 늘어날 수 있다.",
   "explanation": "반짝이는 맨눈으로 보이게 만든 표시예요. 세균·바이러스 같은 병원체와 크기·증식 등 모든 성질이 같지 않아요. 모형이 나타낸 접촉 전달과 나타내지 못한 성질을 나누어요.",
   "misconception": "모형과 실제가 한 점에서 비슷하면 모든 성질도 같다고 하지 않았나요?",
   "criteria": "보이는지 또는 몸속에서 늘어날 수 있는지의 차이를 타당하게 비교하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "반짝이 모형",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "보이는지 또는 몸속에서 늘어날 수 있는지의 차이를 타당하게 비교하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w021",
   "no": 21,
   "form": "blank",
   "topic": "손 씻기",
   "prompt": "손은 비누와 흐르는 물로 [ ]초 이상 꼼꼼히 씻어요.",
   "answer": "30",
   "explanation": "손 씻기 안내에서 비누와 흐르는 물로30초 이상 꼼꼼히 씻도록 한 점을 읽어요. 빈칸은 시간의 수이고 초는 이미 적혀 있어요. 시간뿐 아니라 여러 부위를 씻는 방법도 중요해요.",
   "misconception": "30초만 채우면 손바닥만 씻어도 된다고 생각하지 않았나요?",
   "criteria": "30을 쓰면 인정해요. 이미 인쇄된 초를 되풀이해도 뜻이 분명하면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "손 씻기",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "quantity",
    "teacherRequired": false,
    "accepted": [
     "30",
     "30초"
    ],
    "value": 30,
    "unit": "초",
    "unitRequired": false
   }
  },
  {
   "id": "c22-s32-u04-w022",
   "no": 22,
   "form": "order",
   "topic": "손 씻기",
   "prompt": "이 교재의 손 씻기6단계 안내에서 네 단계를 뽑았어요. 안내에 제시된 순서대로 기호를 써요.",
   "answer": "ㄴ → ㄹ → ㄷ → ㄱ",
   "explanation": "이 교재의6단계 안내에서 손바닥이 먼저이고 손가락 사이·엄지·손톱 밑으로 이어져요. 제시한 네 단계만 뽑으면ㄴ→ㄹ→ㄷ→ㄱ예요. 외운 순서만으로 실제로 꼼꼼히 씻었다고 판정하지 않아요.",
   "misconception": "안내 순서를 쓴 것과 실제로 모든 부위를 씻은 것을 같게 보지 않았나요?",
   "criteria": "안내에 제시된 네 단계 순서ㄴ→ㄹ→ㄷ→ㄱ를 인정해요.",
   "given": [
    "ㄱ. 손톱 밑을 반대편 손바닥에 문지른다",
    "ㄴ. 손바닥과 손바닥을 마주 대고 문지른다",
    "ㄷ. 엄지손가락을 다른 손으로 돌려 가며 문지른다",
    "ㄹ. 손깍지를 끼고 손가락 사이를 문지른다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "손 씻기",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "sequence",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄴ",
      "ㄹ",
      "ㄷ",
      "ㄱ"
     ]
    ]
   }
  },
  {
   "id": "c22-s32-u04-w023",
   "no": 23,
   "form": "choice",
   "topic": "기침 예절",
   "prompt": "재채기가 나오려고 할 때 휴지가 없다면 가장 알맞은 방법은?",
   "answer": "② 옷소매 안쪽으로 입과 코를 가린다",
   "explanation": "휴지가 없는 상황에서는 옷소매 안쪽으로 입과 코를 함께 가려요. 손바닥으로 가리면 그 손을 통해 물건 등으로 이어질 수 있어요. 입만 가리고 코를 그대로 두지 않아요.",
   "misconception": "손바닥으로 가리기와 옷소매 안쪽으로 가리기를 같은 방법으로 보지 않았나요?",
   "criteria": "옷소매 안쪽으로 입과 코를 가린다는 보기를 골라요.",
   "choices": [
    "손바닥으로 입과 코를 가린다",
    "옷소매 안쪽으로 입과 코를 가린다",
    "친구 쪽을 보며 그대로 재채기한다",
    "입만 가리고 코는 그대로 둔다",
    "재채기한 뒤 손을 바지에 닦는다"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "기침 예절",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     1
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w024",
   "no": 24,
   "form": "written",
   "topic": "기침 예절",
   "prompt": "손바닥으로 입을 가리고 기침하면 왜 좋지 않은지, 반짝이 가루 손 모형과 이어 써요.",
   "answer": "기침할 때 침방울이 손에 묻을 수 있다. 그 손이 다른 손이나 물건에 닿으면 반짝이 모형처럼 옮겨 갈 수 있다. 실제로 반드시 감염된다는 뜻은 아니다.",
   "explanation": "손바닥에 침방울이 묻으면 그 손이 닿는 물건·다른 손으로 이어질 수 있어요. 반짝이 모형은 접촉으로 표식이 옮겨 가는 연결을 보여 줘요. 실제로 반드시 감염된다고 말하는 근거는 아니에요.",
   "misconception": "손에 묻음과 실제 감염을 같은 단계로 보지 않았나요?",
   "criteria": "손의 침방울→접촉 전달 가능성과 모형의 연결을 설명하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "기침 예절",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "손의 침방울→접촉 전달 가능성과 모형의 연결을 설명하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w025",
   "no": 25,
   "form": "multi",
   "topic": "손 씻기",
   "prompt": "손을 씻을 때에 대한 설명으로 알맞은 것을 모두 고르세요.",
   "answer": "②, ③, ⑤",
   "explanation": "화장실 뒤·식사 전·밖에서 놀고 돌아온 뒤를 먼저 찾아요. 손이 오염됐을 수 있는 때에 씻는 행동을 연결해요. 다른 때는 어떤 상황에서도 씻으면 안 된다는 뜻은 아니에요.",
   "misconception": "보기에 없는 상황은 무조건 손을 씻지 않아도 된다고 넓히지 않았나요?",
   "criteria": "화장실 뒤·식사 전·밖에서 돌아온 뒤의 세 보기를 모두 골라요.",
   "choices": [
    "손이 깨끗해도 책 한 쪽을 넘길 때마다 반드시 씻는다",
    "화장실에 다녀온 뒤에는 손을 씻는다",
    "밥을 먹기 전에는 손을 씻는다",
    "식사 전이라도 손이 깨끗해 보이면 씻기를 건너뛴다",
    "밖에서 놀고 들어온 뒤에는 손을 씻는다"
   ],
   "key": [
    1,
    2,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "손 씻기",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      2,
      4
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w026",
   "no": 26,
   "form": "choice",
   "topic": "손 씻기",
   "prompt": "손 씻기에 대한 설명으로 알맞은 것은?",
   "answer": "① 손가락 사이와 손톱 밑까지 꼼꼼히 문지른다",
   "explanation": "손가락 사이와 손톱 밑도 빠뜨리지 않고 씻는 것이 맞아요. 물로 짧게 헹구거나 손바닥만 씻는 것은 다른 부위를 놓칠 수 있어요. 씻은 뒤에는 깨끗하게 말려요.",
   "misconception": "비누를 썼다는 사실만으로 모든 부위를 씻었다고 보지 않았나요?",
   "criteria": "손가락 사이·손톱 밑까지 꼼꼼히 문지른다는 보기를 골라요.",
   "choices": [
    "손가락 사이와 손톱 밑까지 꼼꼼히 문지른다",
    "물로만 3초 동안 빠르게 헹구고 끝낸다",
    "손바닥만 비누로 문질러도 모두 깨끗해진다",
    "씻은 뒤 젖은 손은 입은 옷에 닦는다",
    "깨끗해 보이면 비누를 쓰지 않아도 된다"
   ],
   "key": 0,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "손 씻기",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     0
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w027",
   "no": 27,
   "form": "choice",
   "topic": "예방 생활",
   "prompt": "감염병 예방 수칙을 반 친구들과 함께 지키면 좋은 까닭은?",
   "answer": "④ 함께 지키면 여러 옮겨 가는 길을 줄이는 데 도움이 되므로",
   "explanation": "여러 사람이 예방 행동을 하면 사람과 물건 사이로 이어지는 길을 줄이는 데 도움이 돼요. 친구가 지킨다는 이유로 내 행동을 생략하지 않아요. 모형의 수를 실제 효과 크기로 바꾸지 않아요.",
   "misconception": "한 사람의 실천이 반 전체의 완전한 안전을 보장한다고 하지 않았나요?",
   "criteria": "함께 지켜 옮겨 가는 길을 줄이는 데 도움이 된다는 보기를 골라요.",
   "choices": [
    "친구가 실천하면 나는 한 수칙도 지킬 필요가 없으므로",
    "한 사람만 지켜도 모든 감염병을 완전히 막으므로",
    "우리 반 수칙만 지키면 학교 밖 행동은 관계없으므로",
    "함께 지키면 여러 옮겨 가는 길을 줄이는 데 도움이 되므로",
    "한 번 실천한 날에는 이후의 접촉은 조심하지 않아도 되므로"
   ],
   "key": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "예방 생활",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     3
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w028",
   "no": 28,
   "form": "written",
   "topic": "손 씻기",
   "prompt": "손 씻기 6단계 가운데 사람들이 자주 빠뜨리는 곳을 하나 골라 쓰고, 그곳도 꼭 씻어야 하는 까닭을 써요.",
   "answer": "손톱 밑. 손톱 밑에는 병원체가 남기 쉽고, 그 손으로 음식을 먹거나 입·코를 만지면 몸에 들어갈 수 있다.",
   "explanation": "엄지·손가락 사이·손톱 밑처럼 빠뜨리기 쉬운 부위를 골라요. 그곳도 꼼꼼히 씻어 손에 남은 것이 입·코 등으로 이어지는 것을 줄여요. 반짝이가 남았다는 사실로 실제 병원체의 양을 정하지 않아요.",
   "misconception": "반짝이의 양을 실제 병원체의 수로 바꾸지 않았나요?",
   "criteria": "한 부위와 그곳도 씻어야 하는 접촉 전달의 까닭을 함께 쓰면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "손 씻기",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "한 부위와 그곳도 씻어야 하는 접촉 전달의 까닭을 함께 쓰면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w029",
   "no": 29,
   "form": "multi",
   "topic": "예방 생활",
   "prompt": "감염병을 막는 생활 습관을 모두 고르세요.",
   "answer": "②, ④, ⑤",
   "explanation": "안내에 맞는 예방 접종·안전한 물·아플 때 쉬기는 예방 생활과 연결돼요. 컵·수건은 각자 쓰고 음식은 충분히 익혀요. 접종 일정이나 등교 판단을 학생이 임의로 정하는 문항은 아니에요.",
   "misconception": "한 예방 방법을 다른 생활 수칙을 대신하는 방법으로 보지 않았나요?",
   "criteria": "안내에 맞는 접종·물 끓여 마시기·아플 때 쉬기를 모두 골라요.",
   "choices": [
    "수건과 컵을 친구와 함께 쓴다",
    "예방 접종을 제때 받는다",
    "고기는 덜 익혀 먹는다",
    "물은 끓여서 마신다",
    "아플 때는 집에서 쉰다"
   ],
   "key": [
    1,
    3,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "예방 생활",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      3,
      4
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w030",
   "no": 30,
   "form": "written",
   "topic": "배려",
   "prompt": "감기에 걸린 친구가 「나 때문에 다른 친구가 아플까 봐 걱정돼.」라고 해요. 친구에게 해 줄 말을 예방 수칙과 함께 써요.",
   "answer": "누구나 감기에 걸릴 수 있으니 너무 걱정하지 마. 집에서 푹 쉬고, 기침할 때 옷소매로 가리고 손을 자주 씻으면 덜 옮을 거야.",
   "explanation": "친구의 걱정을 듣고 탓하지 않는 말로 응원해요. 손 씻기·기침 예절 같은 구체적인 행동도 연결해요. 누가 누구에게 옮겼는지 알 수 없는데 친구를 원인으로 정하지 않아요.",
   "misconception": "걱정을 덜어 준다며 아무 수칙도 필요 없다고 하지 않았나요?",
   "criteria": "배려하는 말과 구체적인 예방 행동 한 가지 이상을 함께 쓰면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "배려",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "배려하는 말과 구체적인 예방 행동 한 가지 이상을 함께 쓰면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w031",
   "no": 31,
   "form": "choice",
   "topic": "자료 해석",
   "prompt": "세 주의 가상 집계 표에서 직접 확인할 수 있는 모습은 무엇인가요?",
   "answer": "③ 실천 집계가 늘 때 결석 집계가 줄었다",
   "explanation": "세 주의 가상 집계를 각각 읽으면 약속 실천10→17→22명, 결석5→3→2명이에요. 두 값이 함께 변한 모습은 확인돼요. 누가 결석했는지와 감소 원인은 이 표만으로 정하지 못해요.",
   "misconception": "같이 변한 두 집계만으로 원인이나 개인 행동을 확정하지 않았나요?",
   "criteria": "이 표에서 실천 집계가 늘 때 결석 집계가 줄었다는 관찰을 골라요.",
   "choices": [
    "실천하지 않은 친구만 결석한 것이 확인됐다",
    "손 씻기 하나 때문에 결석이 줄었다고 확정됐다",
    "실천 집계가 늘 때 결석 집계가 줄었다",
    "표에 없는 다음 주에도 결석이 반드시 줄어든다",
    "세 주의 차이는 없고 결석 수는 같았다"
   ],
   "key": 2,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "자료 해석",
    "inquirySkill": "관찰과 원인 구별"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     2
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w032",
   "no": 32,
   "form": "written",
   "topic": "자료 해석",
   "prompt": "이 표만 보고 「손 씻기 때문에 결석이 줄었다」고 딱 잘라 말하기 어려운 까닭을 한 가지 써요.",
   "answer": "세 주 동안 날씨나 감기가 유행한 정도 같은 다른 조건도 함께 달라졌을 수 있기 때문이다.",
   "explanation": "주마다 날씨·유행 정도·다른 접촉 등도 달라졌을 수 있어요. 손 씻기만 다르게 한 통제 비교가 아니에요. 따라서 이 표의 감소를 손 씻기 하나의 영향으로 단정하기 어려워요.",
   "misconception": "결석이 줄었다는 사실을 손 씻기만의 효과와 같게 보지 않았나요?",
   "criteria": "다른 관련 조건이 함께 바뀔 수 있어 한 원인만 가리기 어렵다는 설명을 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "자료 해석",
    "inquirySkill": "관찰과 원인 구별"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "다른 관련 조건이 함께 바뀔 수 있어 한 원인만 가리기 어렵다는 설명을 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w033",
   "no": 33,
   "form": "match",
   "topic": "옮겨 가는 길",
   "prompt": "병원체가 제시한 길로 옮겨 갔다고 정한 가상 이야기예요. 경로를 〈보기〉에서 골라 써요.",
   "answer": "(1) 접촉 (2) 비말 (3) 물·음식",
   "explanation": "주어진 가상 이야기에서 손·물건의 연결, 침방울, 마시는 물을 각각 찾아요. 접촉·비말·물과 음식에 대응해요. 실제 감염 여부를 학생이 증상으로 판정하는 문제가 아니에요.",
   "misconception": "경로를 묻는 가상 이야기와 실제 친구의 감염 진단을 섞지 않았나요?",
   "criteria": "접촉·비말 또는 침방울·물과 음식을 각 상황 순서로 써요.",
   "parts": [
    "(1) 문손잡이에 묻은 것이 손을 거쳐 코로 옮겨 갔다.",
    "(2) 재채기 때 나온 침방울이 다른 사람에게 닿았다.",
    "(3) 병원체가 묻은 물을 마셔 감염된 상황이다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 접촉 · 비말 · 공기 · 물·음식"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "접촉",
      "비말",
      "물·음식"
     ],
     [
      "접촉",
      "침방울",
      "물·음식"
     ]
    ]
   }
  },
  {
   "id": "c22-s32-u04-w034",
   "no": 34,
   "form": "draw",
   "topic": "손 씻기 규칙",
   "prompt": "여섯 친구A~F를 그리고, B·D·F가 매 차례 전에 손 씻는 모형의2차례 뒤 표식이 남은 친구만 색칠해요.1·2차례에 옮겨 간 악수는 차례 번호와 화살표로, 중간에 지워진 표식은 글로 표시해요.",
   "answer": "A·F만 색칠한다.1차례A→B와2차례A→F를 표시하고, 두 차례 사이에B의 표식을 지웠다고 쓴다.",
   "explanation": "첫 차례A→B 뒤 둘째 차례 전에B의 표식을 지워요. 둘째 차례F-A에서A→F로 옮겨 최종A·F가 남아요. 차례별 전달과 마지막 표식 상태를 다른 정보로 표시해요.",
   "misconception": "첫 차례 B에 남은 표식을 둘째 차례 뒤에도 그대로 칠하지 않았나요?",
   "criteria": "최종A·F만 색칠하고 두 차례 전달A→B/A→F와 중간B표식 제거를 구별하면 인정해요. 그림 솜씨는 채점하지 않아요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "손 씻기 규칙",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "최종A·F만 색칠하고 두 차례 전달A→B/A→F와 중간B표식 제거를 구별하면 인정해요. 그림 솜씨는 채점하지 않아요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w035",
   "no": 35,
   "form": "blank",
   "topic": "정리",
   "prompt": "병원체가 몸에 들어와 생기는 병을 [ ]이라고 해요.",
   "answer": "감염병",
   "explanation": "빈칸은 병원체 감염으로 생기는 병을 묶어 부르는 감염병이에요. 감기·독감은 그 예예요. 모든 배앓이나 모든 식중독을 이 한 문장으로 감염병이라 정하지 않아요.",
   "misconception": "증상이나 음식 관련 문제를 원인 확인 없이 모두 감염병이라 하지 않았나요?",
   "criteria": "감염병을 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "정리",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "word",
    "teacherRequired": false,
    "accepted": [
     "감염병"
    ]
   }
  },
  {
   "id": "c22-s32-u04-w036",
   "no": 36,
   "form": "blank",
   "topic": "정리",
   "prompt": "손이나 물건이 닿아 옮는 것은 [ ], 침방울로 옮는 것은 [ ]이에요.",
   "answer": "접촉 / 비말",
   "explanation": "손이나 물건을 통한 연결은 접촉, 작은 침방울은 비말이에요. 두 빈칸은 제시 순서에 맞춰요. 한 감염병에 여러 경로가 관련될 수 있어요.",
   "misconception": "한 병에는 경로가 꼭 하나뿐이라고 하지 않았나요?",
   "criteria": "접촉/비말 또는 침방울을 순서대로 써요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "정리",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "접촉",
      "비말"
     ],
     [
      "접촉",
      "침방울"
     ]
    ]
   }
  },
  {
   "id": "c22-s32-u04-w037",
   "no": 37,
   "form": "blank",
   "topic": "정리",
   "prompt": "기침이나 재채기를 할 때는 휴지나 [ ] 안쪽으로 입과 코를 가려요.",
   "answer": "옷소매",
   "explanation": "기침·재채기할 때 휴지나 옷소매 안쪽으로 입과 코를 가려요. 손바닥에 묻으면 손과 물건으로 이어질 수 있어요. 옷소매는 입만 가리는 뜻이 아니에요.",
   "misconception": "손바닥을 가리는 도구와 같은 것으로 쓰지 않았나요?",
   "criteria": "옷소매 또는 소매를 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "정리",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "word",
    "teacherRequired": false,
    "accepted": [
     "옷소매",
     "소매"
    ]
   }
  },
  {
   "id": "c22-s32-u04-w038",
   "no": 38,
   "form": "blank",
   "topic": "정리",
   "prompt": "반짝이 모형에서 몇 명이 손을 씻었더니 반짝이가 옮겨 간 친구의 수가 [ ].",
   "answer": "줄어들었어요",
   "explanation": "같은 모형의3차례 뒤 표식 있는 친구는 씻지 않을 때6명, 규칙을 넣을 때2명이에요. 따라서 줄어들었다고 써요. 완전히0이 되거나 실제 환자가4명 줄었다는 뜻은 아니에요.",
   "misconception": "줄어든 결과를 완전히 사라진 결과로 바꾸지 않았나요?",
   "criteria": "줄어들었어요·줄었다·적어졌다처럼 감소 뜻이면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "정리",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "word",
    "teacherRequired": false,
    "accepted": [
     "줄어들었어요",
     "줄었다",
     "적어졌다",
     "감소했다"
    ]
   }
  },
  {
   "id": "c22-s32-u04-w039",
   "no": 39,
   "form": "choice",
   "topic": "감염병",
   "prompt": "감염병이 아닌 것은?",
   "answer": "⑤ 넘어져서 생긴 무릎 상처",
   "explanation": "넘어져 생긴 상처는 다친 사건을 가리켜요. 나머지는 감기·감염성 눈병·독감·감염성 장염을 제시했어요. 증상 하나만으로 감염병을 판정하지 않도록 상황에 적힌 원인을 읽어요.",
   "misconception": "상처가 날 수 있다는 것과 상처 감염을 같은 것으로 보지 않았나요?",
   "criteria": "넘어져 생긴 무릎 상처를 골라요.",
   "choices": [
    "병원체에 감염되어 걸린 감기",
    "친구에게서 옮은 눈병",
    "여럿이 함께 걸린 독감",
    "병원체 감염으로 생긴 장염",
    "넘어져서 생긴 무릎 상처"
   ],
   "key": 4,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-01",
    "topic": "감염병",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     4
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w040",
   "no": 40,
   "form": "choice",
   "topic": "옮겨 가는 길",
   "prompt": "감염병이 옮겨 가는 길과 예방 행동의 짝이 알맞지 않은 것은?",
   "answer": "② 공기 — 음식을 익혀 먹기",
   "explanation": "공기 경로에는 실내 공기를 바꾸는 환기가 관련돼요. 음식을 익히는 행동은 음식 경로에 관련돼요. 다른 네 짝은 대표적인 경로와 예방 행동의 연결에 맞아요.",
   "misconception": "음식을 익히면 공기를 통한 전달도 막는다고 생각하지 않았나요?",
   "criteria": "알맞지 않은 짝인 공기—음식 익혀 먹기를 골라요.",
   "choices": [
    "접촉 — 비누로 손 씻기",
    "공기 — 음식을 익혀 먹기",
    "비말 — 옷소매로 가리기",
    "공기 — 창문 열어 환기하기",
    "물 — 물을 끓여 마시기"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     1
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w041",
   "no": 41,
   "form": "order",
   "topic": "옮겨 가는 길",
   "prompt": "병원체가 든 침방울이 손에 묻었다고 가정한 이야기예요. 손·물건을 거쳐 코로 옮겨 가는 순서를 기호로 써요. 실제로 따라 하지 않아요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "손바닥으로 가린 침방울이 문손잡이, 친구 손, 코로 이어지는 가상 흐름이에요. 처음 묻은 뒤 물건→다른 손→얼굴 순서를 읽어요. 실제로 따라 하거나 감염이 반드시 일어난다고 보지 않아요.",
   "misconception": "문손잡이를 잡는 두 사람의 순서를 바꾸지 않았나요?",
   "criteria": "ㄴ→ㄹ→ㄱ→ㄷ를 인정해요.",
   "given": [
    "ㄱ. 친구가 그 문손잡이를 잡는다",
    "ㄴ. 감기에 걸린 사람이 손으로 입을 가리고 기침한다",
    "ㄷ. 친구가 씻지 않은 손으로 코를 만진다",
    "ㄹ. 그 손으로 문손잡이를 잡는다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "sequence",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄴ",
      "ㄹ",
      "ㄱ",
      "ㄷ"
     ]
    ]
   }
  },
  {
   "id": "c22-s32-u04-w042",
   "no": 42,
   "form": "short",
   "topic": "반짝이 모형",
   "prompt": "아무도 손을 씻지 않을 때, 2차례 뒤 반짝이가 묻은 친구는 몇 명이고 누구인가요?",
   "answer": "4명(A·B·C·F)",
   "explanation": "첫 차례 뒤A·B가 남아요. 둘째 차례B-C에서C에, F-A에서F에 옮겨A·B·C·F예요. 받은 친구뿐 아니라 이전 표식도 남는 규칙이에요.",
   "misconception": "새로 받은C·F만 세고A·B를 빼지 않았나요?",
   "criteria": "4명과A·B·C·F를 모두 쓰면 인정해요. 이름 순서는 달라도 돼요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "반짝이 모형",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "count-and-set",
    "teacherRequired": false,
    "accepted": [
     {
      "value": 4,
      "unit": "명",
      "members": [
       "A",
       "B",
       "C",
       "F"
      ]
     }
    ],
    "orderSensitive": false,
    "unitRequired": true
   }
  },
  {
   "id": "c22-s32-u04-w043",
   "no": 43,
   "form": "multi",
   "topic": "반짝이 모형",
   "prompt": "반짝이 가루 손 모형에 대한 설명으로 알맞은 것을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "반짝이는 표시이고 짝과 차례를 같게 해 손 씻기 규칙만 비교했어요.3차례 뒤6명과2명으로 달라져요. 표식이 실제 병원체처럼 늘어나거나 완전히0이 된 것은 아니에요.",
   "misconception": "모형에서의 제거 규칙을 실제 모든 병원체 제거와 같게 보지 않았나요?",
   "criteria": "표식의 역할·같은 짝과 차례·규칙 하나의 비교 세 항목을 모두 골라요.",
   "choices": [
    "반짝이는 손으로 옮겨 가는 것을 보이게 한 표시이다",
    "반짝이는 실제 병원체처럼 몸속에서 늘어난다",
    "짝과 악수 순서는 두 규칙에서 같게 했다",
    "손 씻기 규칙만 바꾸어 결과를 비교했다",
    "손을 씻으면 옮겨 간 친구가 0명이 된다"
   ],
   "key": [
    0,
    2,
    3
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "반짝이 모형",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      2,
      3
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w044",
   "no": 44,
   "form": "choice",
   "topic": "옮겨 가는 길",
   "prompt": "호흡기 감염병이 유행해 교실 환기를 안내받았어요. 환기의 역할을 설명한 것은?",
   "answer": "① 실내 공기를 바꾸어 공기 중 병원체를 줄이는 데 도움이 된다",
   "explanation": "환기는 실내 공기를 바꾸어 공기 중 병원체가 머무는 정도를 줄이는 데 도움이 돼요. 손에 묻은 것을 씻는 작용과 달라요. 한 수칙으로 다른 수칙을 생략하지 않아요.",
   "misconception": "환기와 손 씻기를 같은 경로의 같은 작용으로 보지 않았나요?",
   "criteria": "실내 공기가 바뀌는 데 근거한 보기를 골라요.",
   "choices": [
    "실내 공기를 바꾸어 공기 중 병원체를 줄이는 데 도움이 된다",
    "실내 공기를 바꾸면 손에 묻은 것도 모두 씻긴다",
    "환기는 기침 예절을 지키지 않아도 되게 한다",
    "실내 공기를 한 번 바꾸면 이후에는 환기할 필요가 없다",
    "창문이 열려 있다는 사실만으로 모든 감염이 예방됐음을 안다"
   ],
   "key": 0,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "옮겨 가는 길",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     0
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w045",
   "no": 45,
   "form": "blank",
   "topic": "예방 생활",
   "prompt": "음식은 충분히 [ ] 먹고, 물은 [ ] 마셔요.",
   "answer": "익혀 / 끓여",
   "explanation": "물·음식으로 옮겨 가는 길에는 충분한 조리와 안전한 물을 연결해요. 빈칸 순서는 음식 익혀/물 끓여예요. 학생이 위험한 가열을 혼자 하라는 뜻은 아니에요.",
   "misconception": "익히기와 끓이기를 손 씻기나 환기의 대체 방법으로 보지 않았나요?",
   "criteria": "익혀/끓여를 순서대로 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "예방 생활",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "익혀",
      "끓여"
     ]
    ]
   }
  },
  {
   "id": "c22-s32-u04-w046",
   "no": 46,
   "form": "written",
   "topic": "손 씻기 규칙",
   "prompt": "반짝이 가루 손 모형에서 두 규칙의3차례 뒤 결과를 비교해 쓰고,이 수가 실제 감염자 수인지 설명해요.",
   "answer": "모형에서 B·D·F의 손 씻기 규칙을 넣으니3차례 뒤 반짝이가 묻은 친구가 6명에서 2명으로 줄었다. 이 결과를 실제 환자 수나 손 씻기의 정확한 효과로 바꾸어 말할 수는 없다.",
   "explanation": "짝과 차례가 같은3차례 뒤 표식 있는 친구는6명에서2명으로 줄어요. 이 수는 규칙으로 정한 모형 결과예요. 사람의 건강 상태나 실제 감염 조건을 재지 않았으므로 실제 감염자 수가 아니에요.",
   "misconception": "6명→2명을 실제 감염자나 정확한 예방률로 쓰지 않았나요?",
   "criteria": "모형 수치6명→2명과 실제 감염자 수가 아니라는 한계를 함께 설명하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "손 씻기 규칙",
    "inquirySkill": "모형의 조건·표식 전달·한계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "모형 수치6명→2명과 실제 감염자 수가 아니라는 한계를 함께 설명하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w047",
   "no": 47,
   "form": "draw",
   "topic": "창의",
   "prompt": "우리 반 「감염병 예방 약속」 안내문을 그려요. 손 씻기·기침 예절·환기 가운데 두 가지 이상을 그림과 짧은 글로 넣어요.",
   "answer": "예) 세면대 그림 + 「밥 먹기 전, 비누로 30초!」 / 옷소매로 가린 얼굴 그림 + 「기침은 옷소매에!」 / 창문 그림 + 「쉬는 시간마다 창문 열기」",
   "explanation": "손 씻기·기침 예절·환기 중 두 행동을 골라요. 언제와 어떻게 할지 그림과 짧은 글로 나타내요. 안내문을 만든 것과 실제로 실천한 것은 구별해요.",
   "misconception": "예쁜 그림만으로 친구가 방법을 이해했다고 정하지 않았나요?",
   "criteria": "두 가지 이상의 정확한 행동이 그림·글로 드러나면 인정해요. 그림 솜씨만으로 평가하지 않아요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "창의",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "두 가지 이상의 정확한 행동이 그림·글로 드러나면 인정해요. 그림 솜씨만으로 평가하지 않아요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w048",
   "no": 48,
   "form": "written",
   "topic": "창의",
   "prompt": "감기가 유행하는 겨울, 우리 반이 함께 지킬 계획을 「손」「기침」「공기」 세 가지로 나누어 써요.",
   "answer": "손: 밥 먹기 전과 쉬는 시간이 끝난 뒤 비누로 30초 씻는다. 기침: 휴지나 옷소매 안쪽으로 가린다. 공기: 쉬는 시간마다 창문을 열어 환기한다.",
   "explanation": "손에는 비누 손 씻기, 기침에는 휴지·옷소매, 공기에는 안전한 환기를 연결해요. 우리 반에서 언제·어떻게 할 수 있을지 구체화해요. 계획을 쓴 것만으로 실천 완료로 세지 않아요.",
   "misconception": "세 항목 모두에 같은 행동만 쓰거나 계획을 실천으로 세지 않았나요?",
   "criteria": "손·기침·공기에 맞는 행동과 실행할 때를 쓰면 인정해요. 두 항목만 있으면 부분 인정해요.",
   "lines": 5,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "창의",
    "inquirySkill": "생활 사례와 예방 행동의 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "손·기침·공기에 맞는 행동과 실행할 때를 쓰면 인정해요. 두 항목만 있으면 부분 인정해요."
    ]
   }
  },
  {
   "id": "c22-s32-u04-w049",
   "no": 49,
   "form": "choice",
   "topic": "종이 표식 비교",
   "prompt": "표식을 빼지 않을 때, 2차례까지 마친 뒤 표식이 있는 카드는?",
   "answer": "④ A와 B",
   "explanation": "첫A가1차례A-B에서B로 옮겨A·B에 남아요.2차례C-D에는 표식이 없어 변화가 없어요. 모든 차례마다 반드시 늘어난다고 가정하지 않아요.",
   "misconception": "표식 없는 짝끼리 만나도 새 표식이 생긴다고 하지 않았나요?",
   "criteria": "A와B를 나타낸 보기를 골라요.",
   "choices": [
    "A와 C",
    "B와 D",
    "C와 D",
    "A와 B",
    "A부터 D까지"
   ],
   "key": 3,
   "contextRef": "paper4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     3
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w050",
   "no": 50,
   "form": "multi",
   "topic": "종이 표식 비교",
   "prompt": "두 규칙을 비교할 때 같게 해야 할 조건을 모두 고르세요.",
   "answer": "②, ⑤",
   "explanation": "비교하려는 차이는B의 표식을 빼는 규칙이에요. 처음 위치와 짝·차례를 같게 두어 다른 영향을 나누어요. 마지막 위치·카드 수는 미리 같게 맞출 조건이 아닌 관찰 결과예요.",
   "misconception": "결과도 처음부터 같게 만들어야 공정하다고 생각하지 않았나요?",
   "criteria": "처음 위치와 짝·차례만 모두 골라요.",
   "choices": [
    "B의 표식을 빼는 규칙",
    "처음 표식을 놓은 카드",
    "마지막 표식 위치",
    "마지막 표식 카드 수",
    "짝과 차례"
   ],
   "key": [
    1,
    4
   ],
   "contextRef": "paper4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      4
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w051",
   "no": 51,
   "form": "blank",
   "topic": "종이 표식 비교",
   "prompt": "3차례 뒤 표식을 빼지 않은 규칙은 [ ]장, B의 표식을 뺀 규칙은 [ ]장에 표식이 남아요.",
   "answer": "3 / 1",
   "explanation": "빼지 않으면A→B→C로 이어져A·B·C예요.2차례 전B표식을 빼면 남은 짝에 옮겨 갈 표식이 없어A만 남아요. 두 결과는3장/1장이며 실제 환자 수가 아니에요.",
   "misconception": "B의 표식을 뺀 시점을3차례 뒤로 옮기지 않았나요?",
   "criteria": "3/1을 두 규칙의 제시 순서대로 쓰면 인정해요.",
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "3",
      "1"
     ]
    ],
    "teacherRequired": false,
    "units": "장"
   },
   "contextRef": "paper4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   }
  },
  {
   "id": "c22-s32-u04-w052",
   "no": 52,
   "form": "short",
   "topic": "종이 표식 비교",
   "prompt": "B의 표식을 뺀 규칙에서, 3차례 뒤 표식이 남은 카드의 이름을 쓰세요.",
   "answer": "A",
   "explanation": "1차례 뒤A·B에서2차례 전에B의 표식을 빼요.2차례C-D와3차례B-C는 표식 없는 카드끼리 만나므로A만 남아요. 지나간B의 표식을 되살리지 않아요.",
   "misconception": "없어진 표식을 다음 차례에도 남아 있다고 세지 않았나요?",
   "criteria": "카드A만 쓰면 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "A"
    ],
    "teacherRequired": false
   },
   "contextRef": "paper4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   }
  },
  {
   "id": "c22-s32-u04-w053",
   "no": 53,
   "form": "match",
   "topic": "종이 표식 비교",
   "prompt": "비교에서 맡은 역할을 〈보기〉와 이어요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "처음A에만 두기는 두 규칙에서 유지해요. B표식 빼기는 바꿀 조건, 마지막 수는 살펴볼 결과예요. 각 정보의 역할을 구별해야 비교가 분명해요.",
   "misconception": "바꿀 조건과 그 뒤 나온 결과를 서로 뒤집지 않았나요?",
   "criteria": "같게 둘ㄴ/바꿀ㄱ/결과ㄷ를 순서대로 연결해요.",
   "parts": [
    "(1) 처음에 A에만 표식을 놓기",
    "(2) B의 표식을 빼는 규칙",
    "(3) 3차례 뒤 표식 카드 수"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 바꿀 조건  ㄴ. 같게 할 조건  ㄷ. 살펴볼 결과"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄴ",
      "ㄱ",
      "ㄷ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   }
  },
  {
   "id": "c22-s32-u04-w054",
   "no": 54,
   "form": "order",
   "topic": "종이 표식 비교",
   "prompt": "B의 표식을 빼는 규칙을 실행하는 순서로 기호를 쓰세요.",
   "answer": "ㄴ → ㄹ → ㅁ → ㄱ → ㄷ",
   "explanation": "먼저 모든 표식을 치우고A만 있는 시작을 만들어요.1차례 뒤B를 지우고2·3차례를 실행한 뒤 기록해요. 제거 시점을 바꾸면 다른 규칙의 모형이에요.",
   "misconception": "B표식 제거를1차례 전이나 마지막 기록 뒤로 옮기지 않았나요?",
   "criteria": "ㄴ→ㄹ→ㅁ→ㄱ→ㄷ를 인정해요.",
   "given": [
    "ㄱ. 2차례 C-D와 3차례 B-C를 실행한다.",
    "ㄴ. 모든 표식을 치운 뒤 A에만 표식을 놓는다.",
    "ㄷ. 3차례 뒤 표식 카드 수를 기록한다.",
    "ㄹ. 1차례 A-B를 실행한다.",
    "ㅁ. B의 표식을 뺀다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄴ",
      "ㄹ",
      "ㅁ",
      "ㄱ",
      "ㄷ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   }
  },
  {
   "id": "c22-s32-u04-w055",
   "no": 55,
   "form": "written",
   "topic": "종이 표식 비교",
   "prompt": "첫 규칙을 마친 카드의 표식을 그대로 두고 둘째 규칙을 시작하면 왜 비교하기 어려울까요?",
   "answer": "둘째 규칙도 처음에는 A에만 표식이 있어야 한다. 첫 규칙의 표식을 남기면 처음 표식 위치까지 달라져, 표식을 빼는 규칙의 효과만 비교하기 어렵다.",
   "explanation": "두 규칙 모두 같은A만 있는 상태에서 시작해야 해요. 첫 결과를 그대로 두면 초기 위치도 달라져요. 그러면 제거 규칙 하나의 영향과 시작 차이를 나누기 어려워요.",
   "misconception": "두 규칙을 이어 하는 한 실험처럼 실행하지 않았나요?",
   "criteria": "처음 위치도 달라짐과 규칙만의 효과를 나누기 어려움을 함께 쓰면 인정해요.",
   "lines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "처음 위치도 달라짐과 규칙만의 효과를 나누기 어려움을 함께 쓰면 인정해요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   }
  },
  {
   "id": "c22-s32-u04-w056",
   "no": 56,
   "form": "draw",
   "topic": "종이 표식 비교",
   "prompt": "두 규칙의 3차례 뒤 결과를 카드 A~D로 각각 그려요. 표식이 남은 곳을 표시하고, 실제 감염자 수를 뜻하지 않는 까닭을 아래에 써요.",
   "answer": "표식을 빼지 않음: A·B·C / B의 표식을 뺌: A. 종이 표식은 병원체나 환자가 아니므로 실제 감염자 수를 알 수 없다.",
   "explanation": "각 규칙을 처음A부터 따로 따라가면3차례 뒤A·B·C와A예요. 카드와 표식은 사람·병원체의 실제 감염 조건을 재지 않아요. 두 그림의 차이와 모형의 한계를 함께 보여 줘요.",
   "misconception": "표식 카드3장과1장을 실제 환자 수로 쓰지 않았나요?",
   "criteria": "두 카드 위치와 실제 환자 수가 아니라는 설명을 인정해요.",
   "drawing": "large",
   "given": [
    "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
   ],
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "두 카드 위치와 실제 환자 수가 아니라는 설명을 인정해요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "종이 표식 비교",
    "inquirySkill": "모형 규칙과 비교 조건"
   }
  },
  {
   "id": "c22-s32-u04-w057",
   "no": 57,
   "form": "choice",
   "topic": "실천 기록 읽기",
   "prompt": "화요일의 「실천 미기록」을 바르게 읽은 것은?",
   "answer": "③ 실제로 했는지 이 기록만으로 모른다",
   "explanation": "화요일의 기회는3번으로 적혔지만 실천은 비어 있어요. 이 기록만으로0번인지3번인지 알 수 없어요. 기회가 없었던 때와도 달라요.",
   "misconception": "미기록을 실천0번이나 기회0번으로 채우지 않았나요?",
   "criteria": "실제로 했는지 이 기록만으로 모른다는 보기를 골라요.",
   "choices": [
    "세 번 모두 실천하지 않은 것이다",
    "세 번 모두 실천한 것이 분명하다",
    "실제로 했는지 이 기록만으로 모른다",
    "그날 손을 씻을 기회가 없었다",
    "그날 손에 병원체가 없었다"
   ],
   "key": 2,
   "contextRef": "practice4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     2
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w058",
   "no": 58,
   "form": "multi",
   "topic": "실천 기록 읽기",
   "prompt": "기록에서 확인할 수 있는 것을 모두 고르세요.",
   "answer": "①, ②, ③, ④",
   "explanation": "월2/2·수1/2·목0/1은 기록에서 읽을 수 있어요. 화요일은 실천 미기록이라 실제 횟수를 정하지 못해요.0번과 기회 없음은 구별해요.",
   "misconception": "목요일의 실천0번을 기회가 없었다는 뜻으로 보지 않았나요?",
   "criteria": "월·수의 실천, 화의 모름, 목의 기회 있었음 네 항목을 모두 골라요.",
   "choices": [
    "월요일은 정한 기회마다 실천했다",
    "수요일은 두 기회 중 한 번 실천했다",
    "화요일의 실제 실천 여부는 알 수 없다",
    "목요일은 기회가 있었지만 실천0번이었다",
    "목요일에는 실천 기회가 없었다"
   ],
   "key": [
    0,
    1,
    2,
    3
   ],
   "contextRef": "practice4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      1,
      2,
      3
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w059",
   "no": 59,
   "form": "blank",
   "topic": "실천 기록 읽기",
   "prompt": "목요일의 실천0번은 「하지 않음」이고, 화요일의 미기록은 「했는지 [ ]」이에요.",
   "answer": "모름",
   "explanation": "목요일0은 하지 않았다고 적힌 값이에요. 화요일 미기록은 했는지 모르는 상태예요. 모름을0으로 대신 쓰지 않아야 기록의 뜻을 보존해요.",
   "misconception": "아무 숫자가 없다는 이유로0이라고 정하지 않았나요?",
   "criteria": "모름·모른다·알 수 없음처럼 알지 못한다는 뜻을 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "모름",
     "알 수 없음",
     "모른다"
    ],
    "teacherRequired": false
   },
   "contextRef": "practice4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   }
  },
  {
   "id": "c22-s32-u04-w060",
   "no": 60,
   "form": "short",
   "topic": "실천 기록 읽기",
   "prompt": "실천 횟수가 적힌 월·수·목요일에 확인된 실천을 합하면 몇 번인가요? 단위까지 써요.",
   "answer": "3번",
   "explanation": "확인된 월2·수1·목0을 합하면3번이에요. 화요일은 알 수 없으므로 더할 수 없어요.3번은 확인된 소계이며 나흘 전체의 실제 합계가 아니에요.",
   "misconception": "확인된 소계를 미기록까지 포함한 전체 실천으로 말하지 않았나요?",
   "criteria": "3번을 단위와 함께 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "3번"
    ],
    "teacherRequired": false,
    "value": 3,
    "unit": "번",
    "unitRequired": true
   },
   "contextRef": "practice4-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   }
  },
  {
   "id": "c22-s32-u04-w061",
   "no": 61,
   "form": "match",
   "topic": "실천 기록 읽기",
   "prompt": "문장을 기록의 종류와 이어요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "내일 하겠다는 말은 계획이에요. 오늘 했다고 남긴 말은 실천 기록이고, 적지 않은 것은 미기록이에요. 서로 다른 상태를 하나의 실천 횟수로 합하지 않아요.",
   "misconception": "하려는 마음을 이미 한 행동으로 세지 않았나요?",
   "criteria": "계획ㄷ/실천ㄱ/미기록ㄴ을 순서대로 연결해요.",
   "parts": [
    "(1) 내일 점심 전에 손을 씻겠다.",
    "(2) 오늘 점심 전에 비누로 손을 씻었다.",
    "(3) 어제 했는지는 적지 않았다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 실천 기록  ㄴ. 미기록  ㄷ. 계획"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄴ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   }
  },
  {
   "id": "c22-s32-u04-w062",
   "no": 62,
   "form": "order",
   "topic": "실천 기록 읽기",
   "prompt": "약속을 더 잘 지키기 위한 과정을 순서대로 쓰세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "어려운 때를 기록에서 찾고 그 까닭에 맞는 방법을 정해요. 바꾼 방법을 실제로 해 본 뒤 행동·어려움을 남겨요. 계획만 쓰면 방법이 도움이 됐는지 확인할 수 없어요.",
   "misconception": "실제로 해 보기 전에 효과가 있었다고 적지 않았나요?",
   "criteria": "ㄴ→ㄹ→ㄱ→ㄷ를 인정해요.",
   "given": [
    "ㄱ. 바꾼 방법을 실제로 해 본다.",
    "ㄴ. 어려운 때를 내 기록에서 찾는다.",
    "ㄷ. 해 본 행동과 남은 어려움을 적는다.",
    "ㄹ. 그 어려움을 줄일 새 방법을 정한다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄴ",
      "ㄹ",
      "ㄱ",
      "ㄷ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   }
  },
  {
   "id": "c22-s32-u04-w063",
   "no": 63,
   "form": "written",
   "topic": "실천 기록 읽기",
   "prompt": "급식 전에 세면대 줄이 길어 손 씻기를 놓쳤다고 해요. 친구를 탓하지 않고 실천을 돕는 방법과, 그 방법을 점검할 기록을 써요.",
   "answer": "선생님과 의논해 차례를 나누거나 미리 준비할 시간을 정한다. 다음 급식 전에 손을 씻을 기회와 실제로 한 행동, 기다릴 때의 어려움을 기록한다.",
   "explanation": "세면대 대기는 실천을 어렵게 하는 조건이에요. 시간·차례를 어른과 의논하고 다음 기회의 행동과 대기 어려움을 기록해요. 약속 여부만으로 실제 손 씻기를 판정하지 않아요.",
   "misconception": "친구의 의지 부족만 탓하고 줄이 길다는 조건을 무시하지 않았나요?",
   "criteria": "실행 가능한 지원과 실제 행동을 점검할 기록을 함께 쓰면 인정해요.",
   "lines": 5,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "실행 가능한 지원과 실제 행동을 점검할 기록을 함께 쓰면 인정해요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   }
  },
  {
   "id": "c22-s32-u04-w064",
   "no": 64,
   "form": "draw",
   "topic": "실천 기록 읽기",
   "prompt": "실천 점검표의 빈 양식을 그려요. 「언제·기회·실제로 한 일·어려움·다음 행동」 칸을 넣고, 아직 하지 않은 일은 어떻게 남길지도 적어요.",
   "answer": "다섯 항목이 있는 빈 표를 그리고, 아직 하지 않은 것은 계획이나 미실천으로 구별한다. 실제로 했는지 모르면 미기록이라고 남긴다.",
   "explanation": "언제·기회·행동·어려움·다음 행동을 각각 적을 칸이 필요해요. 아직 하지 않은 일은 계획, 했는지 모르면 미기록으로 남겨요. 빈 양식의 완성은 실제 실천 완료를 뜻하지 않아요.",
   "misconception": "계획·미실천·미기록을 모두 같은 표시로 묶지 않았나요?",
   "criteria": "다섯 항목과 상태 구별 방법을 인정해요. 실제 실천 완료를 답안으로 판정하지 않아요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "다섯 항목과 상태 구별 방법을 인정해요. 실제 실천 완료를 답안으로 판정하지 않아요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "실천 기록 읽기",
    "inquirySkill": "실천 자료의 범위와 미기록"
   }
  },
  {
   "id": "c22-s32-u04-w065",
   "no": 65,
   "form": "choice",
   "topic": "출처와 안내문",
   "prompt": "손 씻기 방법을 알아볼 때 자료를 확인하는 방법으로 알맞은 것은?",
   "answer": "⑤ 가의 발행 기관·갱신일·현재 본문을 확인한다",
   "explanation": "가의 기관·갱신일로 자료의 출처와 시점을 확인하고 현재 본문도 읽어요. 기관 이름만 알거나 날짜만 최신이라고 내용까지 확인한 것은 아니에요. 출처 없는 완전 예방 문구를 근거로 쓰지 않아요.",
   "misconception": "제목·날짜·기관 중 하나만 보고 본문도 맞다고 정하지 않았나요?",
   "criteria": "가의 발행 기관·갱신일·현재 본문을 확인하는 보기를 골라요.",
   "choices": [
    "제목이 같으면 본문도 같은지 확인하지 않는다",
    "출처 없는 완전 예방 문구를 그대로 근거로 삼는다",
    "오래된 정보라도 기관 이름만 있으면 현재 내용으로 본다",
    "친구가 전달했으면 발행 기관은 확인하지 않는다",
    "가의 발행 기관·갱신일·현재 본문을 확인한다"
   ],
   "key": 4,
   "contextRef": "sourcecards-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     4
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w066",
   "no": 66,
   "form": "multi",
   "topic": "출처와 안내문",
   "prompt": "예방 안내를 친구에게 알려 주기 전에 할 일을 모두 고르세요.",
   "answer": "②, ③, ④",
   "explanation": "안내를 전달하기 전 출처와 현재 내용을 확인해요. 친구가 이해할 수 있는 말로 바꾸되 핵심 뜻을 보존해요. 친구 이름이나 근거 없는 완전 예방 주장은 근거가 아니에요.",
   "misconception": "친구가 이해하기 쉬우면 근거 확인은 생략해도 된다고 생각하지 않았나요?",
   "criteria": "출처·최신 안내·쉬운 표현의 세 항목을 모두 골라요.",
   "choices": [
    "아픈 친구 이름을 안내에 넣는다",
    "어디에서 나온 정보인지 확인한다",
    "최신 안내와 같은지 확인한다",
    "친구가 이해하기 쉬운 말로 고친다",
    "좋아 보이면 모든감염병0을 믿는다"
   ],
   "key": [
    1,
    2,
    3
   ],
   "contextRef": "sourcecards-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      1,
      2,
      3
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w067",
   "no": 67,
   "form": "blank",
   "topic": "출처와 안내문",
   "prompt": "자료가의 손 씻기는 감염병 전파 위험을 [ ] 수 있지만, 모든 감염병이 반드시0이 된다는 뜻은 아니에요.",
   "answer": "줄일",
   "explanation": "자료가의 안내는 전파 위험 감소에 관한 것이에요. 위험을 줄이는 것과 모든 감염병을 반드시0으로 만드는 것은 달라요. 빈칸은 줄일 또는 낮출이에요.",
   "misconception": "위험 감소를 완전 예방 보장으로 바꾸지 않았나요?",
   "criteria": "줄일 또는 낮출을 쓰면 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "줄일",
     "낮출"
    ],
    "teacherRequired": false
   },
   "contextRef": "sourcecards-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   }
  },
  {
   "id": "c22-s32-u04-w068",
   "no": 68,
   "form": "short",
   "topic": "출처와 안내문",
   "prompt": "자료나에 적혀 있지 않아 더 확인해야 할 두 정보의 기호를 쓰세요.",
   "answer": "ㄱ, ㄴ",
   "explanation": "자료나에는 출처와 작성·갱신 날짜가 없다고 제시됐어요. 기관과 그 날짜는 더 확인해야 해요. 광고 문구는 이미 자료에 있으므로 빠진 정보와 구별해요.",
   "misconception": "자료를 읽은 내 날짜와 자료가 작성·갱신된 날짜를 혼동하지 않았나요?",
   "criteria": "ㄱ·ㄴ을 순서와 관계없이 모두 쓰면 인정해요.",
   "given": [
    "〈보기〉 ㄱ. 발행 기관  ㄴ. 작성·갱신 날짜  ㄷ. 비누 광고 문구"
   ],
   "responseContract": {
    "type": "set",
    "accepted": [
     [
      "ㄱ",
      "ㄴ"
     ]
    ],
    "teacherRequired": false,
    "orderSensitive": false
   },
   "contextRef": "sourcecards-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   }
  },
  {
   "id": "c22-s32-u04-w069",
   "no": 69,
   "form": "match",
   "topic": "출처와 안내문",
   "prompt": "문장과 판단을 이어요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "위험 감소는가의 내용과 맞아요. 모든 감염병0은 제시한 근거를 넘고, 나의 작성·갱신 시점은 적혀 있지 않아요. 근거 있는 설명·과장·모르는 정보를 나누어요.",
   "misconception": "확인할 수 없음과 거짓으로 확정됨을 같은 것으로 보지 않았나요?",
   "criteria": "가와 맞음ㄴ/지나친 주장ㄱ/없는 정보ㄷ를 순서대로 연결해요.",
   "parts": [
    "(1) 손 씻기는 전파 위험을 줄이는 데 도움이 된다.",
    "(2) 이 비누만 쓰면 모든 감염병이 반드시0이다.",
    "(3) 자료나를 언제 작성·갱신됐는지 알 수 있다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 제시된 근거보다 지나친 주장  ㄴ. 가의 안내와 맞는 설명  ㄷ. 자료나에 없는 정보"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄴ",
      "ㄱ",
      "ㄷ"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "sourcecards-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   }
  },
  {
   "id": "c22-s32-u04-w070",
   "no": 70,
   "form": "order",
   "topic": "출처와 안내문",
   "prompt": "친구에게 예방 안내를 전달하는 순서로 기호를 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
   "explanation": "출처와 현재 내용을 확인한 뒤 초안을 만들어요. 친구가 이해했는지 물어 헷갈린 부분을 고친 다음 나눠요. 실제로 묻기 전의 예상 반응을 친구 의견으로 쓰지 않아요.",
   "misconception": "안내를 나누기 전에 이미 의견을 받았다고 꾸미지 않았나요?",
   "criteria": "ㄷ→ㄱ→ㄹ→ㄴ를 인정해요.",
   "given": [
    "ㄱ. 초안을 만들어 친구가 이해했는지 묻는다.",
    "ㄴ. 고친 안내를 나눈다.",
    "ㄷ. 출처와 현재 안내를 확인한다.",
    "ㄹ. 친구가 헷갈린 부분을 고쳐 쓴다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄹ",
      "ㄴ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   }
  },
  {
   "id": "c22-s32-u04-w071",
   "no": 71,
   "form": "written",
   "topic": "출처와 안내문",
   "prompt": "자료나의 「이 비누만 쓰면 모든 감염병이0」을 그대로 반 안내문에 쓰면 안 되는 까닭을 두 가지 써요.",
   "answer": "출처와 날짜가 없어 내용을 확인하기 어렵다. 손 씻기는 위험을 줄이는 방법이지 모든 감염병을 완전히 없앤다고 보장하는 방법은 아니다.",
   "explanation": "출처·날짜가 없으면 누구의 언제 정보인지 확인하기 어려워요. 모든 감염병0은 위험 감소 안내보다 강한 주장이고 그 근거가 없어요. 확인 가능성과 주장 범위를 따로 설명해요.",
   "misconception": "두 까닭을 모두 출처 없다는 같은 말로 반복하지 않았나요?",
   "criteria": "출처·날짜 확인의 어려움과 완전 예방 보장 근거가 없음을 각각 쓰면 인정해요.",
   "lines": 5,
   "given": [
    "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
   ],
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "출처·날짜 확인의 어려움과 완전 예방 보장 근거가 없음을 각각 쓰면 인정해요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   }
  },
  {
   "id": "c22-s32-u04-w072",
   "no": 72,
   "form": "draw",
   "topic": "출처와 안내문",
   "prompt": "「깨끗하게 씻자」라는 초안을 세 칸 그림 안내로 고쳐요. 손 씻기 전·씻는 중·씻은 뒤에 할 일을 각각 그림과 짧은 글로 넣어요.",
   "answer": "전: 손을 씻을 때와 비누·물 준비. 중: 비누와 흐르는 물로 여러 부위를30초 이상 꼼꼼히. 뒤: 충분히 헹구고 깨끗하게 말리기.",
   "explanation": "준비·씻는 중·마무리를 세 칸으로 구별해요. 비누와 흐르는 물·여러 부위·30초 이상, 헹굼과 깨끗한 건조를 연결해요. 시간만 적고 방법을 빼지 않아요.",
   "misconception": "손바닥만 그리거나 건조를 빼고 꼼꼼한 방법이라 하지 않았나요?",
   "criteria": "전·중·뒤, 꼼꼼한 방법, 헹굼·건조가 전달되면 다른 타당한 그림도 인정해요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "전·중·뒤, 꼼꼼한 방법, 헹굼·건조가 전달되면 다른 타당한 그림도 인정해요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "출처와 안내문",
    "inquirySkill": "출처와 근거 판단"
   }
  },
  {
   "id": "c22-s32-u04-w073",
   "no": 73,
   "form": "choice",
   "topic": "함께 해결하기",
   "prompt": "교실의 높은 창문을 열기 어려울 때 알맞은 계획은?",
   "answer": "② 선생님께 도움을 요청해 안전하게 환기한다",
   "explanation": "높은 창문은 학생이 혼자 올라가 여는 해결책보다 안전한 도움을 찾아요. 선생님과 환기 방법을 의논하고 다른 예방 행동도 이어가요. 어려움 하나가 모든 수칙을 포기할 까닭은 아니에요.",
   "misconception": "도움이 필요한 환기와 혼자 위험하게 하는 환기를 같게 보지 않았나요?",
   "criteria": "선생님께 도움을 요청해 안전하게 환기한다는 보기를 골라요.",
   "choices": [
    "학생들이 순서만 정해 높은 창문에 혼자 올라간다",
    "선생님께 도움을 요청해 안전하게 환기한다",
    "환기가 어려우니 다른 예방 행동도 모두 중단한다",
    "높은 창문이라도 열겠다는 계획을 실제 환기로 기록한다",
    "창문을 못 열었는데 열었다고 적어 약속을 지킨다"
   ],
   "key": 1,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     1
    ],
    "orderSensitive": true
   }
  },
  {
   "id": "c22-s32-u04-w074",
   "no": 74,
   "form": "multi",
   "topic": "함께 해결하기",
   "prompt": "반 친구들과 예방 약속을 나눌 때 알맞은 내용을 모두 고르세요.",
   "answer": "①, ④, ⑤",
   "explanation": "확인한 행동을 우리 반에서 가능한 방법과 필요한 도움에 연결해요. 병력 공개나 누가 옮겼는지 추측은 예방 약속의 근거가 아니에요. 함께 할 수 있는 행동을 나눠요.",
   "misconception": "친구의 건강정보를 공개해야 수칙을 지킬 수 있다고 생각하지 않았나요?",
   "criteria": "확인한 행동·가능한 방법·의논할 어른을 모두 골라요.",
   "choices": [
    "확인한 예방 행동",
    "아픈 친구의 이름과 병력",
    "누가 처음 병을 퍼뜨렸는지 추측",
    "우리 반에서 가능한 실천 방법",
    "도움이 필요할 때 의논할 어른"
   ],
   "key": [
    0,
    3,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   },
   "responseContract": {
    "type": "multiple-choice",
    "teacherRequired": false,
    "accepted": [
     [
      0,
      3,
      4
     ]
    ],
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s32-u04-w075",
   "no": 75,
   "form": "blank",
   "topic": "함께 해결하기",
   "prompt": "손에 묻은 병원체가 몸으로 들어갈 수 있는 얼굴 부위 세 곳을 써요. 씻지 않은 손으로 [ ], [ ], [ ]을 만지지 않아요.",
   "answer": "눈·코·입",
   "explanation": "손에 묻은 것이 얼굴의 눈·코·입으로 이어질 수 있어요. 씻지 않은 손으로 만지지 않는 생활 행동을 연결해요. 만졌다는 사실만으로 실제 감염 여부를 판정하지 않아요.",
   "misconception": "손이 닿기만 하면 반드시 감염된다고 쓰지 않았나요?",
   "criteria": "눈·코·입 세 곳을 순서와 관계없이 모두 쓰면 인정해요.",
   "responseContract": {
    "type": "unordered-words",
    "accepted": [
     [
      "눈",
      "코",
      "입"
     ]
    ],
    "teacherRequired": false,
    "orderSensitive": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   }
  },
  {
   "id": "c22-s32-u04-w076",
   "no": 76,
   "form": "short",
   "topic": "함께 해결하기",
   "prompt": "환기 계획3번 중 실제로 창문을 열었다고 기록한 것이2번, 나머지1번은 미기록이에요. 기록으로 확인된 실천은 몇 번인가요?",
   "answer": "2번",
   "explanation": "계획3번 중 실제로 열었다고 확인된 기록은2번이에요. 남은1번은 미기록이라 실행이나 미실행으로 정하지 못해요. 계획 합계와 확인된 실천을 구별해요.",
   "misconception": "계획3번을 그대로 실천3번으로 옮겨 적지 않았나요?",
   "criteria": "2번을 단위와 함께 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "2번"
    ],
    "teacherRequired": false,
    "value": 2,
    "unit": "번",
    "unitRequired": true
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   }
  },
  {
   "id": "c22-s32-u04-w077",
   "no": 77,
   "form": "match",
   "topic": "함께 해결하기",
   "prompt": "상황에 맞는 도움을 이어요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "줄이 길면 시간·차례를, 높은 창문은 어른의 안전한 도움을 의논해요. 쉬는 친구의 배움 걱정에는 자료 지원을 연결해요. 상황의 어려움과 도움이 맞아야 실행할 수 있어요.",
   "misconception": "예방이라는 이유로 모든 상황에 같은 도움을 연결하지 않았나요?",
   "criteria": "차례 조정ㄷ/환기 도움ㄱ/수업 자료ㄴ를 순서대로 연결해요.",
   "parts": [
    "(1) 세면대 줄이 길어 약속을 놓친다.",
    "(2) 높은 창문이라 직접 열기 어렵다.",
    "(3) 아픈 친구가 수업을 놓칠까 걱정한다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 선생님께 안전한 환기 도움 요청  ㄴ. 쉬도록 응원하고 수업 자료 전달 의논  ㄷ. 선생님과 시간·차례 나누기 의논"
   ],
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄴ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   }
  },
  {
   "id": "c22-s32-u04-w078",
   "no": 78,
   "form": "order",
   "topic": "함께 해결하기",
   "prompt": "병원체가 든 침방울이 손에 묻었다고 가정한 종이 이야기예요. 손·물건을 거쳐 옮겨 가는 과정을 순서대로 쓰세요.",
   "answer": "ㄹ → ㄱ → ㄷ → ㄴ",
   "explanation": "손바닥에 묻음→문손잡이→친구 손→눈의 가상 흐름이에요. 한 연결이 앞의 연결 뒤에 생기는 순서를 읽어요. 실제로 기침해 시험하거나 반드시 감염된다고 말하지 않아요.",
   "misconception": "두 사람의 손과 문손잡이 사이 순서를 바꾸지 않았나요?",
   "criteria": "ㄹ→ㄱ→ㄷ→ㄴ를 인정해요.",
   "given": [
    "ㄱ. 그 손으로 문손잡이를 잡는다.",
    "ㄴ. 다른 친구가 그 손으로 눈을 비빈다.",
    "ㄷ. 다른 친구가 그 문손잡이를 잡는다.",
    "ㄹ. 손바닥으로 기침을 가려 침방울이 손에 묻는다."
   ],
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄹ",
      "ㄱ",
      "ㄷ",
      "ㄴ"
     ]
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-02",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   }
  },
  {
   "id": "c22-s32-u04-w079",
   "no": 79,
   "form": "written",
   "topic": "함께 해결하기",
   "prompt": "아픈 친구에게 「네가 옮겼으니 오지 마」라고 말했어요. 친구를 탓하지 않으면서 건강한 생활을 돕는 말과 행동으로 고쳐 써요.",
   "answer": "누구나 아플 수 있으니 편히 쉬고 어른의 안내를 따르자고 말한다. 필요한 수업 자료를 도울 방법을 선생님과 의논하고,우리는 손 씻기·기침 예절 같은 수칙을 지킨다.",
   "explanation": "전파 원인을 알지 못한 채 친구를 탓하지 않아요. 쉬도록 응원하고 수업 자료 지원·예방 행동을 함께 연결해요. 학생이 치료나 등교 시점을 정하는 답은 요구하지 않아요.",
   "misconception": "배려한다며 예방을 생략하거나 예방한다며 친구를 따돌리지 않았나요?",
   "criteria": "탓하지 않는 말·구체적인 지원·예방 행동을 함께 쓰면 인정해요.",
   "lines": 5,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "탓하지 않는 말·구체적인 지원·예방 행동을 함께 쓰면 인정해요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   }
  },
  {
   "id": "c22-s32-u04-w080",
   "no": 80,
   "form": "draw",
   "topic": "함께 해결하기",
   "prompt": "가상의 교실에 「세면대 한 곳·기다릴 자리·비누·깨끗하게 말릴 도구」가 있다고 해요. 서두르지 않고 손을 씻을 수 있게 위치나 차례를 간단히 그리고,도움을 요청할 때도 적어요.",
   "answer": "세면대와 기다릴 자리를 나누고 비누와 말릴 도구가 어디에 있는지 표시한다. 차례나 준비물이 부족하면 선생님께 도움을 요청한다.",
   "explanation": "씻는 곳과 기다릴 곳을 나누고 비누·말릴 도구 위치를 표시해요. 주어진 조건에서 차례가 겹치지 않게 하고 어려우면 어른에게 도움을 요청해요. 설계 그림은 실제 설치나 실천 완료 기록이 아니에요.",
   "misconception": "동선 그림을 그렸다는 사실로 실제로 해 보았다고 쓰지 않았나요?",
   "criteria": "네 조건과 실행 가능한 차례·도움 요청을 설명하면 인정해요. 실제 평면도나 친구 이름은 필요하지 않아요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "네 조건과 실행 가능한 차례·도움 요청을 설명하면 인정해요. 실제 평면도나 친구 이름은 필요하지 않아요."
    ]
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 감염병 교재 보강",
    "course": "초등3-2"
   },
   "taxonomy": {
    "standard": "4과08-03",
    "topic": "함께 해결하기",
    "inquirySkill": "생활 조건을 고려한 문제 해결"
   }
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "반짝이 가루가 알려 준 손 씻기",
   "blocks": [
    {
     "type": "diagram",
     "key": "hero"
    },
    {
     "type": "text",
     "text": "감기는 어떻게 친구에게서 나에게 올까요? 눈에 보이지 않는 병원체가 옮겨 가는 모습을 반짝이 가루로 보이게 해 봐요."
    },
    {
     "type": "heading",
     "text": "미리 보는 낱말"
    },
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻"
     ],
     "rows": [
      [
       "감염병",
       "병원체가 몸에 들어와 생기는 병"
      ],
      [
       "병원체",
       "감염병을 일으키는 세균·바이러스 등"
      ],
      [
       "비말",
       "기침·재채기를 할 때 나오는 작은 침방울"
      ],
      [
       "환기",
       "창문을 열어 실내 공기를 바꾸는 것"
      ]
     ]
    },
    {
     "type": "heading",
     "text": "이 단원에서 할 일"
    },
    {
     "type": "list",
     "items": [
      "감염병과 병원체가 무엇인지 알아봐요.",
      "병원체가 옮겨 가는 길(접촉·비말·공기·물과 음식)을 알아봐요.",
      "반짝이 가루 손 모형으로 손 씻기가 왜 도움이 되는지 실험해요.",
      "우리 반이 함께 지킬 예방 수칙을 계획해요."
     ],
     "ordered": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "몇 명만 손을 씻어도 감염병이 덜 옮겨 갈까?"
    },
    {
     "title": "더 알아보기",
     "text": "사이언스 랩 v2 → 「3-2 Ⅳ 감염병과 건강한 생활」 → 스스로 공부하기에서 악수 차례와 손 씻기 규칙을 바꿔 봐요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 6
    }
   ],
   "lead": "보이지 않는 것을 보이게 하고, 모형으로 확인하고, 개념으로 설명해요.",
   "kind": "opener",
   "teacherNote": "첫 질문에 대한 예상만 받고 답은 말하지 않아요. 7~9쪽 모형 결과로 확인하게 해요."
  },
  {
   "section": "배움 지도",
   "title": "생활 장면에서 예방의 근거까지 이어 가요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배울 것",
      "살필 자료",
      "설명할 것"
     ],
     "rows": [
      [
       "감염병과 병원체",
       "병 이름이 확인된 사례와 보이는 모습",
       "증상만 보고 병 이름을 정하지 않는 까닭"
      ],
      [
       "옮겨 가는 길",
       "손·물건·침방울·공기·물과 음식",
       "그 길과 연결되는 예방 행동"
      ],
      [
       "표식 모형",
       "처음 위치·짝·차례·표식 빼기",
       "규칙을 비교한 결과와 모형의 한계"
      ],
      [
       "함께 지키는 생활",
       "실천 기회·행동·어려움",
       "가능한 도움과 다음에 확인할 것"
      ]
     ]
    },
    {
     "type": "text",
     "text": "사진은 상황을 살피는 설명 자료예요. 사진 속 입자나 표식이 실제 병원체를 촬영한 것은 아니에요. 이 책의 수치·이야기·실천 기록은 따로 제시한 가상 자료예요."
    },
    {
     "type": "field",
     "title": "나의 질문",
     "hint": "생활 속에서 궁금했던 장면 하나와, 더 확인해야 할 정보를 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "단서 → 옮겨 가는 길 → 예방 행동 → 확인할 근거 순서로 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "몸이 불편하면 어른에게 알려요. 이 책으로 병 이름이나 치료 방법을 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "준비 점검",
   "title": "처음 생각을 남겨요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w001",
      "c22-s32-u04-w002",
      "c22-s32-u04-w003",
      "c22-s32-u04-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "맞힌 개수보다 처음 생각과 그 까닭을 남기는 것이 중요해요."
    },
    {
     "title": "더 알아보기",
     "text": "단원을 마치면 2번 답을 다시 읽고 바뀐 생각을 적어요.",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "틀려도 괜찮아요. 처음 생각을 그대로 써요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "① 감염병과 병원체",
   "title": "눈에 보이지 않는 병원체",
   "blocks": [
    {
     "type": "text",
     "text": "감염병을 일으키는 세균·바이러스 등을 **병원체**라고 해요. 병원체는 너무 작아서 눈으로는 볼 수 없어요."
    },
    {
     "type": "text",
     "text": "병원체가 몸에 들어와 생기는 병을 **감염병**이라고 해요. 감염병은 사람에게서 사람에게, 또는 물건이나 음식을 거쳐 옮겨 갈 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "감염병",
      "주로 옮겨 가는 길",
      "나타나는 모습"
     ],
     "rows": [
      [
       "감기",
       "침방울, 손",
       "콧물, 기침, 목 아픔"
      ],
      [
       "독감",
       "침방울, 손",
       "높은 열, 온몸이 쑤심"
      ],
      [
       "병원체 감염으로 생긴 눈병",
       "손, 함께 쓰는 수건",
       "눈이 빨개지고 가려움"
      ],
      [
       "병원체 감염으로 생긴 장염",
       "병원체가 묻은 물·음식 등",
       "배 아픔, 설사 등이 있을 수 있음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "사례에서 확인한 정보 하나와, 모습만 보고 정하면 안 되는 판단 하나를 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "병원체에 감염되어 생기는 질병 = 감염병"
    },
    {
     "title": "더 알아보기",
     "text": "열·기침 같은 모습만으로 병 이름을 정할 수 없어요. 몸이 불편하면 어른에게 알리고 안내를 받아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "넘어져 생긴 상처나 충분히 자지 않아 피곤한 것은 감염병이 아니에요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "① 감염병과 병원체 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w005",
      "c22-s32-u04-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "사례의 단서",
   "title": "같이 아프다고 모두 같은 병일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "다음은 자료 판단을 위해 지어낸 이야기 카드예요. 감염병 사례라고 확인된 정보와, 겉으로 나타난 모습만 적힌 정보를 구별해요."
    },
    {
     "type": "table",
     "heads": [
      "카드",
      "주어진 정보",
      "말할 수 있는 범위"
     ],
     "rows": [
      [
       "가",
       "진료를 받고 독감이라고 안내받았다고 정한 이야기",
       "감염병 사례로 살펴볼 수 있어요."
      ],
      [
       "나",
       "달리다가 넘어져 무릎을 다쳤다는 이야기",
       "넘어진 상처 자체를 감염병이라고 하지는 않아요."
      ],
      [
       "다",
       "오늘 기침을 했다는 말만 있는 이야기",
       "이 정보만으로 병 이름이나 원인을 정할 수 없어요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "다도 기침을 했으니 독감이라고 정해도 될까요?",
     "steps": [
      [
       "단서 찾기",
       "다에는 기침했다는 모습만 있고, 병 이름을 확인한 정보는 없어요."
      ],
      [
       "비교하기",
       "가에는 독감이라고 안내받았다는 조건이 있지만 다에는 그 조건이 없어요."
      ],
      [
       "판단 고치기",
       "기침이라는 모습과 병 이름이 같다는 판단을 구별해요. 실제로 불편하면 어른에게 알려요."
      ]
     ],
     "answer": "이 카드만으로 다의 병 이름을 정할 수 없어요."
    },
    {
     "type": "field",
     "title": "말을 고쳐요",
     "hint": "“같이 기침하니까 같은 병이야”를 자료의 범위에 맞게 고쳐 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이는 모습만으로 병 이름·감염 여부·누가 옮겼는지를 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "아픈 친구를 탓하는 대신 쉬도록 배려하고, 확인된 예방 수칙을 함께 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "① 감염병과 병원체 · 유형 연습",
   "title": "병원체와 감염병을 바르게 알아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w007",
      "c22-s32-u04-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "「눈에 보이지 않는다」 「누구나 걸릴 수 있다」 두 가지를 기억해요."
    },
    {
     "title": "더 알아보기",
     "text": "아픈 친구를 탓하지 않아요. 쉬도록 돕고 함께 예방 수칙을 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "② 옮겨 가는 길",
   "title": "병원체는 어떻게 옮겨 갈까요?",
   "blocks": [
    {
     "type": "text",
     "text": "병원체는 여러 길로 옮겨 가요. 손이나 함께 쓰는 물건이 닿아 옮겨 가는 것을 **접촉**, 기침·재채기의 침방울로 옮겨 가는 것을 **비말**이라고 해요."
    },
    {
     "type": "text",
     "text": "실내 공기를 떠다니다 옮겨 가기도 하고, 병원체가 묻은 물이나 음식으로 옮겨 가기도 해요. 컵이나 수저를 함께 쓰면 침으로 옮겨 갈 수 있어요."
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s32-u04-photo-doorknob.webp",
       "alt": "문손잡이를 잡는 손",
       "cap": "접촉 — 손·물건"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-sneeze.webp",
       "alt": "재채기할 때 퍼지는 작은 침방울",
       "cap": "비말 — 기침·재채기"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-cooking.webp",
       "alt": "채소를 씻고 물을 끓이는 부엌",
       "cap": "물·음식"
      }
     ],
     "numbered": true,
     "cols": 3,
     "credit": "실제 사진 아님"
    },
    {
     "type": "table",
     "heads": [
      "옮겨 가는 길",
      "생활 속 연결",
      "예방 행동의 예"
     ],
     "rows": [
      [
       "접촉",
       "손·함께 쓰는 물건",
       "비누로 손 씻기"
      ],
      [
       "비말",
       "기침·재채기의 작은 침방울",
       "휴지나 옷소매로 입과 코 가리기"
      ],
      [
       "공기",
       "실내 공기",
       "안전하게 자주 환기하기"
      ],
      [
       "물·음식",
       "먹고 마시는 것",
       "안전하게 조리된 음식과 물 이용"
      ],
      [
       "타액",
       "침·함께 쓰는 컵",
       "컵·수저는 각자 쓰기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "표의 한 경로를 골라 생활 속 연결과 그 연결을 줄이는 행동을 내 말로 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "접촉 → 손 씻기 · 비말 → 기침 예절 · 공기 → 환기 · 물·음식 → 익혀 먹기 · 침 → 자기 컵"
    },
    {
     "title": "더 알아보기",
     "text": "한 가지 감염병이 여러 길로 옮겨 가기도 해요. 감기는 침방울로도, 손으로도 옮겨 가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "옮겨 가는 길과 막는 행동을 엇갈려 짝 짓지 않도록 표로 정리해 둬요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "② 옮겨 가는 길 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w009",
      "c22-s32-u04-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "경로와 생활 습관",
   "title": "중간에 무엇을 거쳤는지 따라가요",
   "blocks": [
    {
     "type": "text",
     "text": "병원체가 묻었다고 가정한 종이 이야기예요. 실제로 병원체를 묻히거나 기침을 하며 시험하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "순서",
      "이야기 속 연결",
      "연결을 줄이는 행동"
     ],
     "rows": [
      [
       "1",
       "기침할 때 나온 것이 손에 묻음",
       "휴지나 옷소매로 입과 코 가리기"
      ],
      [
       "2",
       "그 손이 문손잡이에 닿음",
       "기침 뒤 비누로 손 씻기"
      ],
      [
       "3",
       "다른 손이 문손잡이를 잡음",
       "씻지 않은 손으로 눈·코·입 만지지 않기"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 이야기에는 침방울과 손·물건이 모두 나와요. 하나만 고르면 될까요?",
     "steps": [
      [
       "연결 읽기",
       "처음에는 기침으로 나온 것이 손에 묻고, 다음에는 손과 물건이 닿아요."
      ],
      [
       "행동 연결",
       "기침 예절은 처음의 퍼짐과, 손 씻기는 손을 거친 연결과 관련돼요."
      ],
      [
       "범위 확인",
       "여러 과정이 이어질 수 있어요. 이 이야기만으로 누가 반드시 감염됐다고 말하지 않아요."
      ]
     ],
     "answer": "장면마다 거친 곳을 읽고 여러 예방 행동을 연결해요."
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "한 연결을 골라 예방 행동이 그 연결과 어떻게 관련되는지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "경로 이름만 외우지 말고 무엇이 어디에 닿았는지 따라가요."
    },
    {
     "title": "더 알아보기",
     "text": "하나의 감염병이 여러 경로와 관련될 수 있어요. 병마다 길이 하나라고 단정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "② 옮겨 가는 길 · 유형 연습",
   "title": "길과 막는 행동을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w011",
      "c22-s32-u04-w012",
      "c22-s32-u04-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황에서 「무엇이 닿았나·무엇이 나왔나·무엇을 먹었나」를 먼저 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "각 보기가 어느 길을 막는지 옆에 적어 두고 짝지어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "비교의 조건",
   "title": "표식 빼기 규칙만 바꾼 계획은?",
   "blocks": [
    {
     "type": "text",
     "text": "여섯 카드 A~F를 쓰는 비교 계획이에요. 한쪽은 표식을 빼지 않고, 다른 쪽은 매 차례 전에 B·D·F의 표식을 빼요. 두 비교는 각각 처음 상태에서 시작해요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "처음 표식 위치",
      "짝과 차례"
     ],
     "rows": [
      [
       "가",
       "A / A",
       "같음 / 같음"
      ],
      [
       "나",
       "A / A와C",
       "같음 / 같음"
      ],
      [
       "다",
       "A / A",
       "원래 차례 / 바꾼 차례"
      ]
     ]
    },
    {
     "type": "example",
     "question": "세 계획 중 표식을 빼는 규칙의 영향을 비교하기에 알맞은 것은?",
     "steps": [
      [
       "바꿀 것",
       "B·D·F의 표식을 매 차례 전에 빼는지 여부예요."
      ],
      [
       "같게 둘 것",
       "가는 처음 위치와 짝·차례를 같게 두어요. 나는 처음 위치, 다는 짝의 차례까지 달라져요."
      ],
      [
       "결과와 구별",
       "마지막 표식 위치와 수는 미리 같게 맞출 조건이 아니라 실행 뒤 비교할 결과예요."
      ]
     ],
     "answer": "이 세 계획에서는 가예요. 처음 상태가 같은지도 다시 확인해요."
    },
    {
     "type": "field",
     "title": "왜 처음으로 돌아가나요?",
     "hint": "첫 규칙의 표식을 모두 남긴 채 다음 비교를 시작하면 무엇까지 달라지는지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 규칙·같게 둘 조건·살펴볼 결과를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "손 씻기의 실제 제거율이나 사람의 감염 확률은 이 종이 규칙에서 계산하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "③ 반짝이 가루 손 모형",
   "title": "보이지 않는 것을 보이게 해요",
   "blocks": [
    {
     "type": "text",
     "text": "병원체는 눈에 보이지 않아서 어떻게 옮겨 가는지 보기 어려워요. 그래서 A의 손에만 반짝이 가루를 묻히고, 정해진 짝끼리 차례로 악수해 반짝이가 어디까지 옮겨 가는지 살펴봐요."
    },
    {
     "type": "table",
     "heads": [
      "준비와 실행",
      "확인할 내용"
     ],
     "rows": [
      [
       "처음",
       "A에만 표식을 놓아요."
      ],
      [
       "짝과 차례",
       "아래 표의 짝을 같은 순서로 실행해요."
      ],
      [
       "비교 규칙",
       "매 차례 악수 전에 B·D·F의 표식을 빼는 규칙을 적용해요."
      ],
      [
       "기록",
       "각 차례 뒤 표식이 남은 이름과 수를 적어요."
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "악수하는 짝"
     ],
     "rows": [
      [
       "1차례",
       "A-B · C-D · E-F"
      ],
      [
       "2차례",
       "B-C · D-E · F-A"
      ],
      [
       "3차례",
       "C-D · E-F · A-B"
      ]
     ]
    },
    {
     "type": "text",
     "text": "손 씻기 규칙 두 가지(「손 씻기 없음」, 「B·D·F가 차례마다 손 씻기」)로 해 보고 결과를 비교해요. 짝과 차례는 두 규칙에서 똑같이 해요."
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "두 규칙에서 같게 둘 것과 바꿀 것, 실행 뒤 기록할 것을 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "손 씻기 규칙 하나만 바꿔요."
    },
    {
     "title": "더 알아보기",
     "text": "처음 반짝이를 묻힌 사람(A), 짝, 악수 차례"
    },
    {
     "title": "내가 정리할 것",
     "text": "반짝이는 병원체가 아니라 「옮겨 가는 것」을 보이게 한 표시예요."
    }
   ],
   "lead": "바꿀 조건은 하나, 나머지는 모두 같게.",
   "kind": "learn",
   "teacherNote": "3D 실험실에서 학생이 직접 규칙을 바꿔 보게 한 뒤 다음 쪽을 풀어요."
  },
  {
   "section": "③ 반짝이 가루 손 모형 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w014",
      "c22-s32-u04-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "차례를 읽는 법",
   "title": "새로 남길 표식은 이전 상태에서 정해요",
   "blocks": [
    {
     "type": "text",
     "text": "아래는 여섯 카드 모형의 한 비교 규칙을 두 번째 차례까지만 따라간 예예요. 매 차례 전에 B·D·F의 표식을 빼고, 그 뒤 같은 차례의 짝을 실행해요."
    },
    {
     "type": "table",
     "heads": [
      "단계",
      "확인할 상태",
      "표식이 있는 카드"
     ],
     "rows": [
      [
       "처음",
       "A에만 놓음",
       "A"
      ],
      [
       "1차례 전",
       "B·D·F의 표식 빼기",
       "A"
      ],
      [
       "1차례 뒤",
       "A-B / C-D / E-F 실행",
       "A·B"
      ],
      [
       "2차례 전",
       "B·D·F의 표식 빼기",
       "A"
      ],
      [
       "2차례 뒤",
       "B-C / D-E / F-A 실행",
       "A·F"
      ]
     ]
    },
    {
     "type": "example",
     "question": "2차례가 시작될 때 B에도 표식이 있다고 읽으면 무엇을 놓친 걸까요?",
     "steps": [
      [
       "단계 찾기",
       "1차례 결과 A·B와 2차례 실행 전 상태는 달라요."
      ],
      [
       "규칙 적용",
       "2차례 전에 B의 표식을 빼므로 실행 전에는 A만 남아요."
      ],
      [
       "다시 따라가기",
       "이전 상태 A를 기준으로 짝을 읽어요. F-A에서 F에 표식이 남고 A도 유지돼요."
      ]
     ],
     "answer": "표식 빼기 단계가 빠졌어요. “차례 전”과 “차례 뒤”를 따로 기록해요."
    },
    {
     "type": "field",
     "title": "기록 점검",
     "hint": "결과가 달랐다면 어느 단계부터 다시 살필지 이유와 함께 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 → 표식 빼기 → 짝 실행 → 기록의 순서를 따라가요."
    },
    {
     "title": "더 알아보기",
     "text": "한 차례의 짝들은 서로 겹치지 않아요. 다음 차례로 넘어갈 때 이전 결과를 이어 받아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "③ 반짝이 모형 · 결과 읽기",
   "title": "아무도 손을 씻지 않으면?",
   "blocks": [
    {
     "type": "diagram",
     "key": "shake"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w016",
      "c22-s32-u04-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "차례마다 「반짝이가 있는 친구와 악수한 친구」를 찾아 더해요."
    },
    {
     "title": "더 알아보기",
     "text": "옮겨 받은 친구가 다음 차례에 또 옮겨서 점점 퍼져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "정답 확인(손 씻기 없음): 1차례 2명(A·B) · 2차례 4명(A·B·C·F) · 3차례 6명(A·B·C·D·E·F)"
  },
  {
   "section": "③ 반짝이 모형 · 손 씻기 규칙",
   "title": "세 친구만 손을 씻어도 달라질까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "wash"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w018",
      "c22-s32-u04-w019",
      "c22-s32-u04-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "3차례 뒤 6명 → 2명. 이 모형에서는 반짝이가 묻은 친구가 줄었어요."
    },
    {
     "title": "더 알아보기",
     "text": "이 모형의 표식 수는 실제 감염자 수가 아니에요. 실제 생활에서는 손 씻기·기침 예절·환기 등을 함께 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "「손을 씻으면 절대 안 옮는다」도, 「씻어도 소용없다」도 맞지 않아요."
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "손 씻기 규칙: 1차례 2명(A·B) · 2차례 2명(A·F) · 3차례 2명(A·B)"
  },
  {
   "section": "모형과 실제",
   "title": "표식이 줄었다는 결과로 어디까지 말할까요?",
   "blocks": [
    {
     "type": "text",
     "text": "종이 표식은 손에서 손으로 옮겨 가는 연결을 눈에 보이게 나타내요. 규칙으로 표식을 빼는 것과 실제로 손을 씻는 일은 같지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "모형이 보여 주는 것",
      "이 모형만으로 알 수 없는 것"
     ],
     "rows": [
      [
       "정한 짝과 차례에서 표식이 이어진 위치",
       "실제 교실에서 누가 감염되는지"
      ],
      [
       "표식 빼기 규칙이 있을 때 달라진 결과",
       "손 씻기의 정확한 병원체 제거율"
      ],
      [
       "처음 위치와 순서를 같게 비교하는 방법",
       "모든 감염병에서 같은 결과가 나오는지"
      ]
     ]
    },
    {
     "type": "example",
     "question": "표식이 3장인 종이 자료를 보고 “실제 환자도 3명”이라고 말했어요. 맞을까요?",
     "steps": [
      [
       "센 대상",
       "이 자료에서 센 것은 종이 표식이 남은 카드 수예요."
      ],
      [
       "빠진 정보",
       "실제 병원체나 사람의 건강 상태를 측정한 자료가 아니에요."
      ],
      [
       "결론 다듬기",
       "정해진 모형에서 표식이 남은 카드가 3장이라고만 설명해요."
      ]
     ],
     "answer": "환자 수로 바꾸어 말할 수 없어요. 센 대상과 확인한 범위를 함께 적어요."
    },
    {
     "type": "field",
     "title": "모형 설명 한 문장",
     "hint": "옮겨 가는 연결을 생각하는 데 도움이 되는 점과 한계 하나를 함께 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "표식 수·병원체 수·환자 수는 서로 바꿔 쓸 수 없어요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 생활에서는 손 씻기뿐 아니라 기침 예절·환기 등 알맞은 예방 행동을 함께 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 손 씻기",
   "title": "비누로 30초, 여섯 곳을 꼼꼼히",
   "blocks": [
    {
     "type": "text",
     "text": "손은 병원체가 옮겨 갈 수 있는 여러 길 중 하나예요. **비누와 흐르는 물로 30초 이상**, 손바닥·손등·손가락 사이·손가락·엄지손가락·손톱 밑까지 꼼꼼히 씻어요."
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s32-u04-photo-handwash.webp",
       "alt": "비누 거품으로 손을 씻는 모습",
       "cap": "비누 거품을 내어 30초 이상"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-glitter-left.webp",
       "alt": "물로만 헹군 뒤 손가락 사이와 손톱 밑에 남은 반짝이",
       "cap": "반짝이가 남은 설명 장면 — 실제 제거량 측정은 아님"
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "실제 사진 아님"
    },
    {
     "type": "table",
     "heads": [
      "빠뜨리지 않을 곳",
      "살필 점"
     ],
     "rows": [
      [
       "손바닥·손등",
       "손바닥만 문지르지 않았나요?"
      ],
      [
       "손가락 사이·손가락",
       "손가락 사이와 마주 잡은 손가락도 씻었나요?"
      ],
      [
       "엄지손가락·손톱 밑",
       "엄지 둘레와 손톱 밑까지 꼼꼼히 씻었나요?"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "씻을 때와 씻는 부위를 골라 언제·어떻게 확인할지 써요. 아직 하지 않았다면 계획으로 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비누 + 흐르는 물 + 30초 이상 + 여섯 곳"
    },
    {
     "title": "더 알아보기",
     "text": "노래 속도는 다를 수 있어요. 실제 시간과 씻는 부위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "밥 먹기 전 · 화장실 뒤 · 밖에서 들어온 뒤 · 코를 풀거나 기침한 뒤"
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 손 씻기 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w021",
      "c22-s32-u04-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "④ 예방 수칙 · 기침 예절과 환기",
   "title": "침방울과 공기도 막아요",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s32-u04-photo-cough-kit.webp",
       "alt": "교실 책상에 놓인 휴지 상자와 작은 휴지통",
       "cap": "기침 예절을 위한 준비물의 예"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-ventilation.webp",
       "alt": "창문과 문을 연 빈 교실의 설명 장면",
       "cap": "어른의 도움으로 안전하게 환기해요"
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "기침이나 재채기를 할 때는 휴지나 **옷소매 안쪽**으로 입과 코를 가려요. 손바닥으로 가리면 침방울이 손에 묻어 다시 옮겨 가요. 교실은 쉬는 시간마다 창문을 열어 **환기**해요."
    },
    {
     "type": "table",
     "heads": [
      "언제",
      "연결할 행동"
     ],
     "rows": [
      [
       "기침·재채기할 때",
       "휴지나 옷소매로 입과 코 가리기"
      ],
      [
       "휴지를 쓴 뒤",
       "휴지통에 버리고 손 씻기"
      ],
      [
       "실내 공기를 바꿀 때",
       "어른과 안전한 환기 방법 정하기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "휴지가 없을 때의 행동과 안전하게 환기하기 위해 필요한 도움을 각각 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기침은 휴지나 옷소매 안쪽에 · 쓴 휴지는 바로 버리고 손 씻기"
    },
    {
     "title": "더 알아보기",
     "text": "사람이 많은 곳에서 마스크를 쓰면 침방울이 덜 퍼져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "손바닥으로 가리는 것은 「손으로 옮겨 가는 길」을 다시 여는 일이에요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 기침 예절과 환기 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w023",
      "c22-s32-u04-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "손 씻기 방법의 근거",
   "title": "시간과 씻는 부위를 함께 확인해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "wash",
     "caption": "비누 거품을 내어 손을 씻는 설명 장면"
    },
    {
     "type": "text",
     "text": "질병관리청은 비누와 물로 30초 이상 꼼꼼히 씻도록 안내해요. 다음은 실제 효과를 잰 결과가 아니라 방법을 점검하는 가상 계획이에요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "비누·흐르는 물",
      "시간",
      "씻는 곳"
     ],
     "rows": [
      [
       "가",
       "비누 사용·흐르는 물",
       "35초",
       "손바닥만"
      ],
      [
       "나",
       "비누 사용·흐르는 물",
       "35초",
       "손바닥·손등·손가락 사이·손가락·엄지·손톱 밑"
      ],
      [
       "다",
       "비누 없음·흐르는 물",
       "35초",
       "손바닥·손등"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가와 나는 둘 다 35초예요. 같은 방법이라고 할 수 있을까요?",
     "steps": [
      [
       "같은 점",
       "두 계획 모두 비누·흐르는 물과 35초라는 조건이 같아요."
      ],
      [
       "다른 점",
       "가는 손바닥만, 나는 여러 부위를 빠뜨리지 않고 씻기로 했어요."
      ],
      [
       "안내와 연결",
       "시간만 채우는 대신 씻는 부위까지 꼼꼼히 확인해야 해요. 이 표로 실제 제거량을 정하지 않아요."
      ]
     ],
     "answer": "시간이 같아도 씻는 부위가 달라요. 방법 전체를 점검해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비누·흐르는 물·충분한 시간·빠뜨리지 않는 부위를 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "헹군 뒤 깨끗하게 말려요. 노래 길이나 사진 한 장으로 씻은 시간·효과를 확인하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 유형 연습",
   "title": "언제, 어떻게 씻을까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w025",
      "c22-s32-u04-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "「언제」 문제는 병원체를 만났을 때와 입으로 들어가기 전을 떠올려요."
    },
    {
     "title": "더 알아보기",
     "text": "오늘 손을 씻은 때를 모두 적어 봐요.",
     "write": 7
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "⑤ 함께 지키는 건강한 생활",
   "title": "나를 지키고 친구를 지켜요",
   "blocks": [
    {
     "type": "text",
     "text": "감염병 예방 수칙은 한 사람만 지키는 것보다 여럿이 함께 지킬 때 더 큰 힘을 내요. 반짝이 모형에서 여섯 명 가운데 세 명만 손을 씻어도 퍼지는 친구가 줄었어요."
    },
    {
     "type": "table",
     "heads": [
      "",
      "나를 지켜요",
      "친구를 지켜요"
     ],
     "rows": [
      [
       "손",
       "밥 먹기 전 손 씻기",
       "기침한 뒤 손 씻고 악수하기"
      ],
      [
       "기침",
       "아플 때 집에서 쉬기",
       "옷소매로 가리고 기침하기"
      ],
      [
       "생활",
       "예방 접종 제때 받기",
       "컵·수건은 각자 쓰기"
      ]
     ]
    },
    {
     "type": "example",
     "question": "여섯 명 가운데 세 명만 손을 씻어도 도움이 될까요?",
     "steps": [
      [
       "조건 확인",
       "짝과 차례는 같고 손 씻기 규칙만 달라요."
      ],
      [
       "결과 비교",
       "3차례 뒤 6명 → 2명"
      ],
      [
       "결론",
       "정해진 모형에서는 표식이 있는 카드가 줄었어요. 이 수를 실제 환자 수로 해석하지 않아요."
      ]
     ],
     "answer": "모형으로 옮겨 가는 길을 생각하고 실제 생활에서는 여러 예방 행동을 함께 지켜요."
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "친구를 탓하지 않으면서 서로의 건강한 생활을 도울 약속을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예방 수칙은 함께 지킬수록 효과가 커요."
    },
    {
     "title": "더 알아보기",
     "text": "예방 접종은 병원체를 이겨 낼 힘을 미리 기르는 방법이에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아픈 친구를 탓하지 않고 낫도록 응원해요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "⑤ 함께 지키는 건강한 생활 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w027",
      "c22-s32-u04-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "⑤ 함께 지키는 생활 · 유형 연습",
   "title": "우리가 할 수 있는 일",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w029",
      "c22-s32-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "「나를 지키는 일」과 「친구를 지키는 일」을 나눠 생각해요."
    },
    {
     "title": "더 알아보기",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "두 기록을 연결하기",
   "title": "함께 달라졌다고 원인이 확인된 걸까요?",
   "blocks": [
    {
     "type": "text",
     "text": "두 주 동안 같은 20명을 살폈다고 정한 연습용 가상 표예요. 손 씻기 약속 실천과 감기 결석의 집계만 있고, 다른 조건이나 개인별 자료는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "주",
      "전체",
      "약속 실천",
      "감기 결석"
     ],
     "rows": [
      [
       "첫째 주",
       "20명",
       "8명",
       "4명"
      ],
      [
       "둘째 주",
       "20명",
       "16명",
       "2명"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“손 씻기 하나 때문에 결석이 줄었다”는 말을 이 표로 확인할 수 있나요?",
     "steps": [
      [
       "변화 읽기",
       "약속 실천은 8명에서 16명, 결석은 4명에서 2명으로 달라졌어요."
      ],
      [
       "없는 조건",
       "환기나 생활 조건이 같았는지, 각 친구가 어떤 행동을 했는지는 표에 없어요."
      ],
      [
       "결론의 범위",
       "두 집계의 변화는 읽을 수 있지만, 손 씻기 하나만의 원인이라고 확정할 수는 없어요."
      ]
     ],
     "answer": "표의 변화와 예방 수칙의 근거를 연결하되, 이 표가 증명하지 않은 원인을 덧붙이지 않아요."
    },
    {
     "type": "field",
     "title": "표에 있는 말·더 확인할 말",
     "hint": "자료로 확인되는 변화 하나와, 추가로 필요한 정보 하나를 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기록이 보여 주는 변화와 그 변화의 원인을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "개인 이름이나 병력을 모으지 않고도, 표의 조건과 빠진 정보를 따져 볼 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료 깊이 읽기 1",
   "title": "표가 말해 주는 것과 말해 주지 않는 것",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "주",
      "손 씻기 약속을 지킨 친구(24명 중)",
      "감기로 결석한 친구"
     ],
     "rows": [
      [
       "1주",
       "10명",
       "5명"
      ],
      [
       "2주",
       "17명",
       "3명"
      ],
      [
       "3주",
       "22명",
       "2명"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w031",
      "c22-s32-u04-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 표의 수치는 연습을 위해 지은 가상 학습값이에요. 실제 기록이 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "제목 → 단위 → 늘었나 줄었나 → 표에 없는 것은 말하지 않기"
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2",
   "title": "상황 속에서 옮겨 가는 길 찾기 · 1",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황마다 「무엇이 닿았나·무엇이 나왔나·무엇을 먹었나」를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "친구 여섯 명을 동그라미로 그리고, 차례마다 손 씻기 → 악수 순서로 따라가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2",
   "title": "상황 속에서 옮겨 가는 길 찾기 · 2",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황마다 「무엇이 닿았나·무엇이 나왔나·무엇을 먹었나」를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "친구 여섯 명을 동그라미로 그리고, 차례마다 손 씻기 → 악수 순서로 따라가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "빈칸으로 정리",
   "title": "단원의 핵심을 한눈에",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w035",
      "c22-s32-u04-w036",
      "c22-s32-u04-w037",
      "c22-s32-u04-w038"
     ]
    },
    {
     "type": "field",
     "title": "한 문장으로 정리",
     "hint": "「병원체 → 옮겨 가는 길 → 손 씻기·기침 예절·환기 → 함께 지키기」를 넣어 한 문장으로 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈칸이 막히면 그 개념 쪽(①~⑤)으로 돌아가요."
    },
    {
     "title": "더 알아보기",
     "text": "감염병 / 옮겨 가는 길 / 손 씻기 / 기침 예절 — 네 가지를 설명할 수 있나요?"
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "단원평가 1",
   "title": "개념으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w039",
      "c22-s32-u04-w040",
      "c22-s32-u04-w041",
      "c22-s32-u04-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물음이 「알맞은 것」인지 「알맞지 않은 것」인지 먼저 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "단원평가 2",
   "title": "모형과 생활을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w043",
      "c22-s32-u04-w044",
      "c22-s32-u04-w045",
      "c22-s32-u04-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모두 고르기는 맞는 보기를 모두 골랐는지 다시 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "답 → 모형 근거(몇 명 → 몇 명) → 결론 순서로 써요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "서술형 · 창의",
   "title": "우리 반 예방 약속을 만들어요 · 1",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "손 · 기침 · 공기 — 세 가지 길을 모두 막았나요?"
    },
    {
     "title": "더 알아보기",
     "text": "2번에 쓴 처음 생각이 어떻게 바뀌었나요?",
     "write": 5
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "서술형 · 창의",
   "title": "우리 반 예방 약속을 만들어요 · 2",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "손 · 기침 · 공기 — 세 가지 길을 모두 막았나요?"
    },
    {
     "title": "더 알아보기",
     "text": "2번에 쓴 처음 생각이 어떻게 바뀌었나요?",
     "write": 5
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "생각 넓히기 ①",
   "title": "종이 표식으로 규칙을 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "짝",
      "비교 규칙에서 먼저 할 일"
     ],
     "rows": [
      [
       "처음",
       "A에만 표식",
       "A에만 표식"
      ],
      [
       "1",
       "A-B",
       "그대로"
      ],
      [
       "2",
       "C-D",
       "B의 표식 빼기"
      ],
      [
       "3",
       "B-C",
       "그대로"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w049",
      "c22-s32-u04-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "표식은 실제 병원체나 환자가 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "paper4-v1",
    "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
   }
  },
  {
   "section": "생각 넓히기 ①",
   "title": "조건과 결과를 따로 읽어요",
   "blocks": [
    {
     "type": "text",
     "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w051",
      "c22-s32-u04-w052",
      "c22-s32-u04-w053",
      "c22-s32-u04-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 조건·같게 할 조건·살펴볼 결과를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "paper4-v1",
    "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
   }
  },
  {
   "section": "생각 넓히기 ① · 해 보기",
   "title": "카드로 직접 실행해 확인해요",
   "blocks": [
    {
     "type": "heading",
     "text": "준비와 실행"
    },
    {
     "type": "list",
     "items": [
      "A~D라고 쓴 종이 카드4장과 종이 표식을 준비해요.",
      "처음A에만 표식을 놓고,제시한 짝과 차례를 따라가요.",
      "두 규칙을 각각 처음 상태에서 실행하고 결과를 적어요.",
      "실제로 해 보지 않았다면 예상이나 자료 확인이라고 적어요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "실제로 해 본 기록",
     "hint": "두 규칙에서 표식이 남은 카드와 다른 결과가 나왔다면 그 과정을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이만 사용해요. 서로 악수하거나 병원체를 옮기는 실험을 하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ① · 그림",
   "title": "모형의 결과와 한계를 나타내요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료로 알 수 있는 것과 알 수 없는 것을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "실행을 돕는 조건",
   "title": "하지 않음과 알 수 없음을 나누어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "요일",
      "정한 기회",
      "실천 기록",
      "덧붙인 정보"
     ],
     "rows": [
      [
       "월",
       "2번",
       "2번",
       "준비물과 시간이 있었음"
      ],
      [
       "화",
       "2번",
       "미기록",
       "실천 여부를 적지 않음"
      ],
      [
       "수",
       "2번",
       "0번",
       "실천하지 않았다고 적음"
      ]
     ]
    },
    {
     "type": "example",
     "question": "화요일 칸을 0번으로 채우고 “수요일과 같다”고 해도 될까요?",
     "steps": [
      [
       "기록 뜻",
       "화요일은 실제로 했는지 적지 않았고, 수요일은 하지 않았다고 적었어요."
      ],
      [
       "판단 구별",
       "화요일을 0번이나 2번으로 정할 정보가 없어요. 빈칸을 예상으로 채우지 않아요."
      ],
      [
       "다음 행동",
       "실제로 한 행동을 적고, 어려움이 있었다면 시간·차례·준비물 중 필요한 도움을 정해요."
      ]
     ],
     "answer": "미기록은 모름이고, 0번은 하지 않았다는 기록이에요."
    },
    {
     "type": "table",
     "heads": [
      "실천을 어렵게 한 상황",
      "의논할 도움"
     ],
     "rows": [
      [
       "세면대 줄이 길었음",
       "선생님과 시간·차례 나누기 의논"
      ],
      [
       "비누나 말릴 도구가 부족했음",
       "필요한 준비물을 어른에게 알리기"
      ],
      [
       "창문이 높아 혼자 열기 어려움",
       "올라가지 않고 어른에게 도움 요청"
      ]
     ]
    },
    {
     "type": "field",
     "title": "내가 해 볼 약속",
     "hint": "언제·어떻게·필요한 도움·확인할 기록을 함께 써요. 아직 하지 않았다면 계획이라고 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제 행동·하지 않음·미기록을 서로 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "방법을 지키기 어렵다고 친구를 탓하지 않아요. 실행할 수 있게 도와주는 조건을 찾아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "생각 넓히기 ②",
   "title": "실천0번과 미기록은 달라요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 기록이에요. 기회는 손을 씻기로 정한 때의 횟수, 미기록은 실제로 했는지 적지 않은 것이에요."
    },
    {
     "type": "table",
     "heads": [
      "요일",
      "실천 기회",
      "실천"
     ],
     "rows": [
      [
       "월",
       "2번",
       "2번"
      ],
      [
       "화",
       "3번",
       "미기록"
      ],
      [
       "수",
       "2번",
       "1번"
      ],
      [
       "목",
       "1번",
       "0번"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w057",
      "c22-s32-u04-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈 기록을0번으로 채워 넣지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "practice4-v1",
    "text": "연습용 가상 기록: 월요일 기회2번·실천2번, 화요일 기회3번·실천미기록, 수요일 기회2번·실천1번, 목요일 기회1번·실천0번. 기회는 손을 씻기로 정한 때의 횟수이고, 미기록은 실제로 했는지 적지 않은 것이에요."
   }
  },
  {
   "section": "생각 넓히기 ②",
   "title": "기록으로 확인되는 만큼만 말해요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 기록: 월요일 기회2번·실천2번, 화요일 기회3번·실천미기록, 수요일 기회2번·실천1번, 목요일 기회1번·실천0번. 기회는 손을 씻기로 정한 때의 횟수이고, 미기록은 실제로 했는지 적지 않은 것이에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w059",
      "c22-s32-u04-w060",
      "c22-s32-u04-w061",
      "c22-s32-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제 행동·미기록을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "practice4-v1",
    "text": "연습용 가상 기록: 월요일 기회2번·실천2번, 화요일 기회3번·실천미기록, 수요일 기회2번·실천1번, 목요일 기회1번·실천0번. 기회는 손을 씻기로 정한 때의 횟수이고, 미기록은 실제로 했는지 적지 않은 것이에요."
   }
  },
  {
   "section": "생각 넓히기 ② · 해 보기",
   "title": "어려움을 줄일 방법을 정해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w063"
     ]
    },
    {
     "type": "heading",
     "text": "다음 기회에 짧게 점검하기"
    },
    {
     "type": "field",
     "title": "기회와 행동",
     "hint": "한 번의 기회를 골라 실제로 한 행동·어려움·다음 방법만 적어요. 아직 하지 않았다면 계획으로 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "친구의 병력이나 실제 감염자 이름을 수집하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ② · 그림",
   "title": "실천 점검표를 설계해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양식을 잘 그린 것과 실제 실천한 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ③",
   "title": "안내문의 출처와 날짜를 살펴요",
   "blocks": [
    {
     "type": "text",
     "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w065",
      "c22-s32-u04-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광고나 큰 글씨가 과학적 근거를 대신하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sourcecards-v1",
    "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "근거에 맞게 말해요",
   "blocks": [
    {
     "type": "text",
     "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w067",
      "c22-s32-u04-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "확인한 정보와 확인할 수 없는 정보를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sourcecards-v1",
    "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "판단을 설명하고 안내를 나눠요",
   "blocks": [
    {
     "type": "text",
     "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w069",
      "c22-s32-u04-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "근거를 확인하고 친구가 이해했는지 점검해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sourcecards-v1",
    "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
   }
  },
  {
   "section": "생각 넓히기 ③ · 해 보기",
   "title": "친구가 따라 할 수 있게 고쳐요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w071"
     ]
    },
    {
     "type": "field",
     "title": "초안과 실제 의견",
     "hint": "예방 안내 초안을 만들고 가능하면 친구에게 이해하기 쉬운지 물어봐요. 묻지 않았다면 아직 의견을 듣지 못했다고 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 의견을 받기 전에는 예상 의견이라고 밝혀요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ③ · 그림",
   "title": "전·중·뒤의 안내를 만들어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "그림 솜씨보다 방법과 순서가 분명한지 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "혼자 하기 어려우면 도움을 찾아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w073",
      "c22-s32-u04-w074",
      "c22-s32-u04-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생활의 어려움과 필요한 도움을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "계획·실행·배려를 구별해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w076",
      "c22-s32-u04-w077",
      "c22-s32-u04-w078",
      "c22-s32-u04-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예방 행동을 돕되 친구를 탓하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④ · 그림",
   "title": "함께 지킬 수 있는 방법을 설계해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 조건 안에서 실행할 수 있게 그려요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "출처와 돌아보기",
   "title": "확인한 자료와 내 생각을 구별해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "field",
     "title": "단원을 마치며",
     "hint": "처음 생각에서 달라진 점과 아직 더 알아보고 싶은 점을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 교재의 수치·광고·실천 기록은 학습용 모형과 가상 자료예요."
    },
    {
     "title": "더 알아보기",
     "text": "현재 안내가 달라졌는지 어른과 함께 출처를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "실제로 해 본 일과 아직 계획인 일을 구별해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
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
      "c22-s32-u04-w001",
      "c22-s32-u04-w002",
      "c22-s32-u04-w003",
      "c22-s32-u04-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
      "c22-s32-u04-w005",
      "c22-s32-u04-w006",
      "c22-s32-u04-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
      "c22-s32-u04-w008",
      "c22-s32-u04-w009",
      "c22-s32-u04-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
      "c22-s32-u04-w011",
      "c22-s32-u04-w012",
      "c22-s32-u04-w013",
      "c22-s32-u04-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
      "c22-s32-u04-w015",
      "c22-s32-u04-w016",
      "c22-s32-u04-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
      "c22-s32-u04-w018",
      "c22-s32-u04-w019",
      "c22-s32-u04-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 21~23",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w021",
      "c22-s32-u04-w022",
      "c22-s32-u04-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 24~26",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w024",
      "c22-s32-u04-w025",
      "c22-s32-u04-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 27~29",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w027",
      "c22-s32-u04-w028",
      "c22-s32-u04-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 30~32",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w030",
      "c22-s32-u04-w031",
      "c22-s32-u04-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 33~35",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w033",
      "c22-s32-u04-w034",
      "c22-s32-u04-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 36~39",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w036",
      "c22-s32-u04-w037",
      "c22-s32-u04-w038",
      "c22-s32-u04-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 40~43",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w040",
      "c22-s32-u04-w041",
      "c22-s32-u04-w042",
      "c22-s32-u04-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 44~46",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w044",
      "c22-s32-u04-w045",
      "c22-s32-u04-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 47~49",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w047",
      "c22-s32-u04-w048",
      "c22-s32-u04-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 50~53",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w050",
      "c22-s32-u04-w051",
      "c22-s32-u04-w052",
      "c22-s32-u04-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 54~56",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w054",
      "c22-s32-u04-w055",
      "c22-s32-u04-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 57~60",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w057",
      "c22-s32-u04-w058",
      "c22-s32-u04-w059",
      "c22-s32-u04-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 61~63",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w061",
      "c22-s32-u04-w062",
      "c22-s32-u04-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 64~66",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w064",
      "c22-s32-u04-w065",
      "c22-s32-u04-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 67~70",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w067",
      "c22-s32-u04-w068",
      "c22-s32-u04-w069",
      "c22-s32-u04-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 71~73",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w071",
      "c22-s32-u04-w072",
      "c22-s32-u04-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 74~77",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w074",
      "c22-s32-u04-w075",
      "c22-s32-u04-w076",
      "c22-s32-u04-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 78~80",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u04-w078",
      "c22-s32-u04-w079",
      "c22-s32-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서술·그림 문항은 낱말이 같은지보다 조건과 근거가 들어 있는지를 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "틀린 문항의 「오개념 점검」을 읽고 해당 개념 쪽으로 돌아가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
       "객관식 · 감염병",
       "③"
      ],
      [
       "2",
       "단답 · 손 씻기",
       "교사 확인(해설 쪽)"
      ],
      [
       "3",
       "모두 고르기 · 예방 생활",
       "①, ③, ⑤"
      ],
      [
       "4",
       "빈칸 · 병원체",
       "병원체"
      ],
      [
       "5",
       "연결 · 감염병",
       "(1) ○ (2) × (3) ○ (4) ○"
      ],
      [
       "6",
       "객관식 · 병원체",
       "⑤"
      ],
      [
       "7",
       "서술 · 병원체",
       "교사 확인(해설 쪽)"
      ],
      [
       "8",
       "객관식 · 배려",
       "②"
      ],
      [
       "9",
       "빈칸 · 옮겨 가는 길",
       "비말"
      ],
      [
       "10",
       "서술 · 옮겨 가는 길",
       "교사 확인(해설 쪽)"
      ],
      [
       "11",
       "연결 · 옮겨 가는 길",
       "(1) ㄱ (2) ㄴ (3) ㄷ"
      ],
      [
       "12",
       "객관식 · 옮겨 가는 길",
       "①"
      ],
      [
       "13",
       "모두 고르기 · 옮겨 가는 길",
       "①, ②, ④"
      ],
      [
       "14",
       "객관식 · 반짝이 모형",
       "④"
      ],
      [
       "15",
       "단답 · 반짝이 모형",
       "A, B"
      ],
      [
       "16",
       "객관식 · 반짝이 모형",
       "③"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "풀이의 조건과 자료 범위를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
       "서술 · 반짝이 모형",
       "교사 확인(해설 쪽)"
      ],
      [
       "18",
       "단답 · 손 씻기 규칙",
       "A, F"
      ],
      [
       "19",
       "객관식 · 손 씻기 규칙",
       "⑤"
      ],
      [
       "20",
       "서술 · 반짝이 모형",
       "교사 확인(해설 쪽)"
      ],
      [
       "21",
       "빈칸 · 손 씻기",
       "30"
      ],
      [
       "22",
       "순서 · 손 씻기",
       "ㄴ → ㄹ → ㄷ → ㄱ"
      ],
      [
       "23",
       "객관식 · 기침 예절",
       "②"
      ],
      [
       "24",
       "서술 · 기침 예절",
       "교사 확인(해설 쪽)"
      ],
      [
       "25",
       "모두 고르기 · 손 씻기",
       "②, ③, ⑤"
      ],
      [
       "26",
       "객관식 · 손 씻기",
       "①"
      ],
      [
       "27",
       "객관식 · 예방 생활",
       "④"
      ],
      [
       "28",
       "서술 · 손 씻기",
       "교사 확인(해설 쪽)"
      ],
      [
       "29",
       "모두 고르기 · 예방 생활",
       "②, ④, ⑤"
      ],
      [
       "30",
       "서술 · 배려",
       "교사 확인(해설 쪽)"
      ],
      [
       "31",
       "객관식 · 자료 해석",
       "③"
      ],
      [
       "32",
       "서술 · 자료 해석",
       "교사 확인(해설 쪽)"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "풀이의 조건과 자료 범위를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
       "연결 · 옮겨 가는 길",
       "(1) 접촉 (2) 비말 (3) 물·음식"
      ],
      [
       "34",
       "그림 · 손 씻기 규칙",
       "교사 확인(해설 쪽)"
      ],
      [
       "35",
       "빈칸 · 정리",
       "감염병"
      ],
      [
       "36",
       "빈칸 · 정리",
       "접촉 / 비말"
      ],
      [
       "37",
       "빈칸 · 정리",
       "옷소매"
      ],
      [
       "38",
       "빈칸 · 정리",
       "줄어들었어요"
      ],
      [
       "39",
       "객관식 · 감염병",
       "⑤"
      ],
      [
       "40",
       "객관식 · 옮겨 가는 길",
       "②"
      ],
      [
       "41",
       "순서 · 옮겨 가는 길",
       "ㄴ → ㄹ → ㄱ → ㄷ"
      ],
      [
       "42",
       "단답 · 반짝이 모형",
       "4명(A·B·C·F)"
      ],
      [
       "43",
       "모두 고르기 · 반짝이 모형",
       "①, ③, ④"
      ],
      [
       "44",
       "객관식 · 옮겨 가는 길",
       "①"
      ],
      [
       "45",
       "빈칸 · 예방 생활",
       "익혀 / 끓여"
      ],
      [
       "46",
       "서술 · 손 씻기 규칙",
       "교사 확인(해설 쪽)"
      ],
      [
       "47",
       "그림 · 창의",
       "교사 확인(해설 쪽)"
      ],
      [
       "48",
       "서술 · 창의",
       "교사 확인(해설 쪽)"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "풀이의 조건과 자료 범위를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
       "객관식 · 종이 표식 비교",
       "④"
      ],
      [
       "50",
       "모두 고르기 · 종이 표식 비교",
       "②, ⑤"
      ],
      [
       "51",
       "빈칸 · 종이 표식 비교",
       "3 / 1"
      ],
      [
       "52",
       "단답 · 종이 표식 비교",
       "A"
      ],
      [
       "53",
       "연결 · 종이 표식 비교",
       "(1) ㄴ (2) ㄱ (3) ㄷ"
      ],
      [
       "54",
       "순서 · 종이 표식 비교",
       "ㄴ → ㄹ → ㅁ → ㄱ → ㄷ"
      ],
      [
       "55",
       "서술 · 종이 표식 비교",
       "교사 확인(해설 쪽)"
      ],
      [
       "56",
       "그림 · 종이 표식 비교",
       "교사 확인(해설 쪽)"
      ],
      [
       "57",
       "객관식 · 실천 기록 읽기",
       "③"
      ],
      [
       "58",
       "모두 고르기 · 실천 기록 읽기",
       "①, ②, ③, ④"
      ],
      [
       "59",
       "빈칸 · 실천 기록 읽기",
       "모름"
      ],
      [
       "60",
       "단답 · 실천 기록 읽기",
       "3번"
      ],
      [
       "61",
       "연결 · 실천 기록 읽기",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "62",
       "순서 · 실천 기록 읽기",
       "ㄴ → ㄹ → ㄱ → ㄷ"
      ],
      [
       "63",
       "서술 · 실천 기록 읽기",
       "교사 확인(해설 쪽)"
      ],
      [
       "64",
       "그림 · 실천 기록 읽기",
       "교사 확인(해설 쪽)"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "풀이의 조건과 자료 범위를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
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
       "객관식 · 출처와 안내문",
       "⑤"
      ],
      [
       "66",
       "모두 고르기 · 출처와 안내문",
       "②, ③, ④"
      ],
      [
       "67",
       "빈칸 · 출처와 안내문",
       "줄일"
      ],
      [
       "68",
       "단답 · 출처와 안내문",
       "ㄱ, ㄴ"
      ],
      [
       "69",
       "연결 · 출처와 안내문",
       "(1) ㄴ (2) ㄱ (3) ㄷ"
      ],
      [
       "70",
       "순서 · 출처와 안내문",
       "ㄷ → ㄱ → ㄹ → ㄴ"
      ],
      [
       "71",
       "서술 · 출처와 안내문",
       "교사 확인(해설 쪽)"
      ],
      [
       "72",
       "그림 · 출처와 안내문",
       "교사 확인(해설 쪽)"
      ],
      [
       "73",
       "객관식 · 함께 해결하기",
       "②"
      ],
      [
       "74",
       "모두 고르기 · 함께 해결하기",
       "①, ④, ⑤"
      ],
      [
       "75",
       "빈칸 · 함께 해결하기",
       "눈·코·입"
      ],
      [
       "76",
       "단답 · 함께 해결하기",
       "2번"
      ],
      [
       "77",
       "연결 · 함께 해결하기",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "78",
       "순서 · 함께 해결하기",
       "ㄹ → ㄱ → ㄷ → ㄴ"
      ],
      [
       "79",
       "서술 · 함께 해결하기",
       "교사 확인(해설 쪽)"
      ],
      [
       "80",
       "그림 · 함께 해결하기",
       "교사 확인(해설 쪽)"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "채점만 빠르게 할 때 써요. 풀이와 인정 답안은 정답·해설 쪽에 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "풀이의 조건과 자료 범위를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 볼 번호와 그 까닭을 적어요.",
     "write": 6
    }
   ]
  }
 ],
 "figures": {
  "sources": "<div class=\"infection-sources\"><p><a href=\"https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=6545\">질병관리청 국가건강정보포털 · 손씻기</a><br>2026년4월15일 갱신. 비누·물·꼼꼼한 씻기와 전파 위험 감소를 확인했어요.</p><p><a href=\"https://health.kdca.go.kr/healthinfo/biz/health/gnrlzHealthInfo/gnrlzHealthInfo/gnrlzHealthInfoView.do?cntnts_sn=5283\">질병관리청 국가건강정보포털 · 홍역·볼거리·풍진</a><br>여러 전파 경로를 통해 옮겨 갈 수 있다는 배경을 확인했어요. 진단·치료·접종 일정을 이 교재로 정하지 않아요.</p><p><a href=\"https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&amp;boardSeq=93459&amp;lev=0&amp;m=020&amp;s=moe\">교육부 · 2022 개정 교육과정 확정·발표</a><br>감염병 사례·생활 습관과 감염 과정·예방 수칙 공유와 실천을 연결해요.</p></div>",
  "hero": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u04-photo-glitter-shake.webp\" alt=\"반짝이 가루가 묻은 두 손이 악수하는 모습\" loading=\"eager\"><p class=\"ed-photo-note\">한 사람의 손에 묻은 반짝이가 악수할 때 옮겨 가요. 눈에 보이지 않는 병원체도 이렇게 옮겨 갈 수 있어요.</p><small class=\"ed-photo-credit\">실제 사진 아님</small></div>",
  "start": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u04-glit-start.webp\" alt=\"여섯 친구 A~F가 둥글게 선 모습\" loading=\"eager\"><p class=\"ed-photo-note\">처음에는 A의 손에만 반짝이가 있어요.</p><small class=\"ed-photo-credit\">3D 모형 렌더 · 학습용 모형(반짝이는 병원체가 아님)</small></div>",
  "shake": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u04-photo-glitter-shake.webp\" alt=\"반짝이 가루가 묻은 두 손이 맞닿은 설명 장면\" loading=\"eager\"><p class=\"ed-photo-note\">손이 닿는 상황을 살피는 설명 장면이에요. 여섯 카드의 짝·차례·결과는 별도 표에서 읽어요. 실제 병원체나 전파량을 촬영한 것이 아니에요.</p><small class=\"ed-photo-credit\">실제 사진 아님</small></div>",
  "wash": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u04-photo-handwash.webp\" alt=\"흐르는 물과 비누 거품으로 손을 씻는 설명 장면\" loading=\"eager\"><p class=\"ed-photo-note\">손을 씻는 방법을 살피는 장면이에요. 이 사진으로 씻은 시간이나 병원체 제거량을 알 수는 없어요.</p><small class=\"ed-photo-credit\">실제 사진 아님</small></div>",
  "sleeve": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u04-glit-sleeve.webp\" alt=\"옷소매 안쪽으로 입과 코를 가리고 기침하는 모습\" loading=\"eager\"><p class=\"ed-photo-note\">휴지가 없으면 옷소매 안쪽으로 가려요.</p><small class=\"ed-photo-credit\">3D 모형 렌더 · 학습용 모형(반짝이는 병원체가 아님)</small></div>"
 },
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "반짝이 가루가 알려 준 손 씻기",
   "blocks": [
    {
     "type": "diagram",
     "key": "hero"
    },
    {
     "type": "text",
     "text": "감기는 어떻게 친구에게서 나에게 올까요? 눈에 보이지 않는 병원체가 옮겨 가는 모습을 반짝이 가루로 보이게 해 봐요."
    },
    {
     "type": "heading",
     "text": "미리 보는 낱말"
    },
    {
     "type": "table",
     "heads": [
      "낱말",
      "뜻"
     ],
     "rows": [
      [
       "감염병",
       "병원체가 몸에 들어와 생기는 병"
      ],
      [
       "병원체",
       "감염병을 일으키는 세균·바이러스 등"
      ],
      [
       "비말",
       "기침·재채기를 할 때 나오는 작은 침방울"
      ],
      [
       "환기",
       "창문을 열어 실내 공기를 바꾸는 것"
      ]
     ]
    },
    {
     "type": "heading",
     "text": "이 단원에서 할 일"
    },
    {
     "type": "list",
     "items": [
      "감염병과 병원체가 무엇인지 알아봐요.",
      "병원체가 옮겨 가는 길(접촉·비말·공기·물과 음식)을 알아봐요.",
      "반짝이 가루 손 모형으로 손 씻기가 왜 도움이 되는지 실험해요.",
      "우리 반이 함께 지킬 예방 수칙을 계획해요."
     ],
     "ordered": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "몇 명만 손을 씻어도 감염병이 덜 옮겨 갈까?"
    },
    {
     "title": "더 알아보기",
     "text": "사이언스 랩 v2 → 「3-2 Ⅳ 감염병과 건강한 생활」 → 스스로 공부하기에서 악수 차례와 손 씻기 규칙을 바꿔 봐요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 6
    }
   ],
   "lead": "보이지 않는 것을 보이게 하고, 모형으로 확인하고, 개념으로 설명해요.",
   "kind": "opener",
   "teacherNote": "첫 질문에 대한 예상만 받고 답은 말하지 않아요. 7~9쪽 모형 결과로 확인하게 해요."
  },
  {
   "section": "배움 지도",
   "title": "생활 장면에서 예방의 근거까지 이어 가요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배울 것",
      "살필 자료",
      "설명할 것"
     ],
     "rows": [
      [
       "감염병과 병원체",
       "병 이름이 확인된 사례와 보이는 모습",
       "증상만 보고 병 이름을 정하지 않는 까닭"
      ],
      [
       "옮겨 가는 길",
       "손·물건·침방울·공기·물과 음식",
       "그 길과 연결되는 예방 행동"
      ],
      [
       "표식 모형",
       "처음 위치·짝·차례·표식 빼기",
       "규칙을 비교한 결과와 모형의 한계"
      ],
      [
       "함께 지키는 생활",
       "실천 기회·행동·어려움",
       "가능한 도움과 다음에 확인할 것"
      ]
     ]
    },
    {
     "type": "text",
     "text": "사진은 상황을 살피는 설명 자료예요. 사진 속 입자나 표식이 실제 병원체를 촬영한 것은 아니에요. 이 책의 수치·이야기·실천 기록은 따로 제시한 가상 자료예요."
    },
    {
     "type": "field",
     "title": "나의 질문",
     "hint": "생활 속에서 궁금했던 장면 하나와, 더 확인해야 할 정보를 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "단서 → 옮겨 가는 길 → 예방 행동 → 확인할 근거 순서로 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "몸이 불편하면 어른에게 알려요. 이 책으로 병 이름이나 치료 방법을 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "준비 점검",
   "title": "처음 생각을 남겨요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w001",
      "c22-s32-u04-w002",
      "c22-s32-u04-w003",
      "c22-s32-u04-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "맞힌 개수보다 처음 생각과 그 까닭을 남기는 것이 중요해요."
    },
    {
     "title": "더 알아보기",
     "text": "단원을 마치면 2번 답을 다시 읽고 바뀐 생각을 적어요.",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "틀려도 괜찮아요. 처음 생각을 그대로 써요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "① 감염병과 병원체",
   "title": "눈에 보이지 않는 병원체",
   "blocks": [
    {
     "type": "text",
     "text": "감염병을 일으키는 세균·바이러스 등을 **병원체**라고 해요. 병원체는 너무 작아서 눈으로는 볼 수 없어요."
    },
    {
     "type": "text",
     "text": "병원체가 몸에 들어와 생기는 병을 **감염병**이라고 해요. 감염병은 사람에게서 사람에게, 또는 물건이나 음식을 거쳐 옮겨 갈 수 있어요."
    },
    {
     "type": "table",
     "heads": [
      "감염병",
      "주로 옮겨 가는 길",
      "나타나는 모습"
     ],
     "rows": [
      [
       "감기",
       "침방울, 손",
       "콧물, 기침, 목 아픔"
      ],
      [
       "독감",
       "침방울, 손",
       "높은 열, 온몸이 쑤심"
      ],
      [
       "병원체 감염으로 생긴 눈병",
       "손, 함께 쓰는 수건",
       "눈이 빨개지고 가려움"
      ],
      [
       "병원체 감염으로 생긴 장염",
       "병원체가 묻은 물·음식 등",
       "배 아픔, 설사 등이 있을 수 있음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "사례에서 확인한 정보 하나와, 모습만 보고 정하면 안 되는 판단 하나를 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "병원체에 감염되어 생기는 질병 = 감염병"
    },
    {
     "title": "더 알아보기",
     "text": "열·기침 같은 모습만으로 병 이름을 정할 수 없어요. 몸이 불편하면 어른에게 알리고 안내를 받아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "넘어져 생긴 상처나 충분히 자지 않아 피곤한 것은 감염병이 아니에요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "① 감염병과 병원체 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w005",
      "c22-s32-u04-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "사례의 단서",
   "title": "같이 아프다고 모두 같은 병일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "다음은 자료 판단을 위해 지어낸 이야기 카드예요. 감염병 사례라고 확인된 정보와, 겉으로 나타난 모습만 적힌 정보를 구별해요."
    },
    {
     "type": "table",
     "heads": [
      "카드",
      "주어진 정보",
      "말할 수 있는 범위"
     ],
     "rows": [
      [
       "가",
       "진료를 받고 독감이라고 안내받았다고 정한 이야기",
       "감염병 사례로 살펴볼 수 있어요."
      ],
      [
       "나",
       "달리다가 넘어져 무릎을 다쳤다는 이야기",
       "넘어진 상처 자체를 감염병이라고 하지는 않아요."
      ],
      [
       "다",
       "오늘 기침을 했다는 말만 있는 이야기",
       "이 정보만으로 병 이름이나 원인을 정할 수 없어요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "다도 기침을 했으니 독감이라고 정해도 될까요?",
     "steps": [
      [
       "단서 찾기",
       "다에는 기침했다는 모습만 있고, 병 이름을 확인한 정보는 없어요."
      ],
      [
       "비교하기",
       "가에는 독감이라고 안내받았다는 조건이 있지만 다에는 그 조건이 없어요."
      ],
      [
       "판단 고치기",
       "기침이라는 모습과 병 이름이 같다는 판단을 구별해요. 실제로 불편하면 어른에게 알려요."
      ]
     ],
     "answer": "이 카드만으로 다의 병 이름을 정할 수 없어요."
    },
    {
     "type": "field",
     "title": "말을 고쳐요",
     "hint": "“같이 기침하니까 같은 병이야”를 자료의 범위에 맞게 고쳐 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이는 모습만으로 병 이름·감염 여부·누가 옮겼는지를 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "아픈 친구를 탓하는 대신 쉬도록 배려하고, 확인된 예방 수칙을 함께 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "① 감염병과 병원체 · 유형 연습",
   "title": "병원체와 감염병을 바르게 알아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w007",
      "c22-s32-u04-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "「눈에 보이지 않는다」 「누구나 걸릴 수 있다」 두 가지를 기억해요."
    },
    {
     "title": "더 알아보기",
     "text": "아픈 친구를 탓하지 않아요. 쉬도록 돕고 함께 예방 수칙을 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "② 옮겨 가는 길",
   "title": "병원체는 어떻게 옮겨 갈까요?",
   "blocks": [
    {
     "type": "text",
     "text": "병원체는 여러 길로 옮겨 가요. 손이나 함께 쓰는 물건이 닿아 옮겨 가는 것을 **접촉**, 기침·재채기의 침방울로 옮겨 가는 것을 **비말**이라고 해요."
    },
    {
     "type": "text",
     "text": "실내 공기를 떠다니다 옮겨 가기도 하고, 병원체가 묻은 물이나 음식으로 옮겨 가기도 해요. 컵이나 수저를 함께 쓰면 침으로 옮겨 갈 수 있어요."
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s32-u04-photo-doorknob.webp",
       "alt": "문손잡이를 잡는 손",
       "cap": "접촉 — 손·물건"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-sneeze.webp",
       "alt": "재채기할 때 퍼지는 작은 침방울",
       "cap": "비말 — 기침·재채기"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-cooking.webp",
       "alt": "채소를 씻고 물을 끓이는 부엌",
       "cap": "물·음식"
      }
     ],
     "numbered": true,
     "cols": 3,
     "credit": "실제 사진 아님"
    },
    {
     "type": "table",
     "heads": [
      "옮겨 가는 길",
      "생활 속 연결",
      "예방 행동의 예"
     ],
     "rows": [
      [
       "접촉",
       "손·함께 쓰는 물건",
       "비누로 손 씻기"
      ],
      [
       "비말",
       "기침·재채기의 작은 침방울",
       "휴지나 옷소매로 입과 코 가리기"
      ],
      [
       "공기",
       "실내 공기",
       "안전하게 자주 환기하기"
      ],
      [
       "물·음식",
       "먹고 마시는 것",
       "안전하게 조리된 음식과 물 이용"
      ],
      [
       "타액",
       "침·함께 쓰는 컵",
       "컵·수저는 각자 쓰기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "표의 한 경로를 골라 생활 속 연결과 그 연결을 줄이는 행동을 내 말로 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "접촉 → 손 씻기 · 비말 → 기침 예절 · 공기 → 환기 · 물·음식 → 익혀 먹기 · 침 → 자기 컵"
    },
    {
     "title": "더 알아보기",
     "text": "한 가지 감염병이 여러 길로 옮겨 가기도 해요. 감기는 침방울로도, 손으로도 옮겨 가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "옮겨 가는 길과 막는 행동을 엇갈려 짝 짓지 않도록 표로 정리해 둬요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "② 옮겨 가는 길 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w009",
      "c22-s32-u04-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "경로와 생활 습관",
   "title": "중간에 무엇을 거쳤는지 따라가요",
   "blocks": [
    {
     "type": "text",
     "text": "병원체가 묻었다고 가정한 종이 이야기예요. 실제로 병원체를 묻히거나 기침을 하며 시험하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "순서",
      "이야기 속 연결",
      "연결을 줄이는 행동"
     ],
     "rows": [
      [
       "1",
       "기침할 때 나온 것이 손에 묻음",
       "휴지나 옷소매로 입과 코 가리기"
      ],
      [
       "2",
       "그 손이 문손잡이에 닿음",
       "기침 뒤 비누로 손 씻기"
      ],
      [
       "3",
       "다른 손이 문손잡이를 잡음",
       "씻지 않은 손으로 눈·코·입 만지지 않기"
      ]
     ]
    },
    {
     "type": "example",
     "question": "이 이야기에는 침방울과 손·물건이 모두 나와요. 하나만 고르면 될까요?",
     "steps": [
      [
       "연결 읽기",
       "처음에는 기침으로 나온 것이 손에 묻고, 다음에는 손과 물건이 닿아요."
      ],
      [
       "행동 연결",
       "기침 예절은 처음의 퍼짐과, 손 씻기는 손을 거친 연결과 관련돼요."
      ],
      [
       "범위 확인",
       "여러 과정이 이어질 수 있어요. 이 이야기만으로 누가 반드시 감염됐다고 말하지 않아요."
      ]
     ],
     "answer": "장면마다 거친 곳을 읽고 여러 예방 행동을 연결해요."
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "한 연결을 골라 예방 행동이 그 연결과 어떻게 관련되는지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "경로 이름만 외우지 말고 무엇이 어디에 닿았는지 따라가요."
    },
    {
     "title": "더 알아보기",
     "text": "하나의 감염병이 여러 경로와 관련될 수 있어요. 병마다 길이 하나라고 단정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "② 옮겨 가는 길 · 유형 연습",
   "title": "길과 막는 행동을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w011",
      "c22-s32-u04-w012",
      "c22-s32-u04-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황에서 「무엇이 닿았나·무엇이 나왔나·무엇을 먹었나」를 먼저 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "각 보기가 어느 길을 막는지 옆에 적어 두고 짝지어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "비교의 조건",
   "title": "표식 빼기 규칙만 바꾼 계획은?",
   "blocks": [
    {
     "type": "text",
     "text": "여섯 카드 A~F를 쓰는 비교 계획이에요. 한쪽은 표식을 빼지 않고, 다른 쪽은 매 차례 전에 B·D·F의 표식을 빼요. 두 비교는 각각 처음 상태에서 시작해요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "처음 표식 위치",
      "짝과 차례"
     ],
     "rows": [
      [
       "가",
       "A / A",
       "같음 / 같음"
      ],
      [
       "나",
       "A / A와C",
       "같음 / 같음"
      ],
      [
       "다",
       "A / A",
       "원래 차례 / 바꾼 차례"
      ]
     ]
    },
    {
     "type": "example",
     "question": "세 계획 중 표식을 빼는 규칙의 영향을 비교하기에 알맞은 것은?",
     "steps": [
      [
       "바꿀 것",
       "B·D·F의 표식을 매 차례 전에 빼는지 여부예요."
      ],
      [
       "같게 둘 것",
       "가는 처음 위치와 짝·차례를 같게 두어요. 나는 처음 위치, 다는 짝의 차례까지 달라져요."
      ],
      [
       "결과와 구별",
       "마지막 표식 위치와 수는 미리 같게 맞출 조건이 아니라 실행 뒤 비교할 결과예요."
      ]
     ],
     "answer": "이 세 계획에서는 가예요. 처음 상태가 같은지도 다시 확인해요."
    },
    {
     "type": "field",
     "title": "왜 처음으로 돌아가나요?",
     "hint": "첫 규칙의 표식을 모두 남긴 채 다음 비교를 시작하면 무엇까지 달라지는지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 규칙·같게 둘 조건·살펴볼 결과를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "손 씻기의 실제 제거율이나 사람의 감염 확률은 이 종이 규칙에서 계산하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "③ 반짝이 가루 손 모형",
   "title": "보이지 않는 것을 보이게 해요",
   "blocks": [
    {
     "type": "text",
     "text": "병원체는 눈에 보이지 않아서 어떻게 옮겨 가는지 보기 어려워요. 그래서 A의 손에만 반짝이 가루를 묻히고, 정해진 짝끼리 차례로 악수해 반짝이가 어디까지 옮겨 가는지 살펴봐요."
    },
    {
     "type": "table",
     "heads": [
      "준비와 실행",
      "확인할 내용"
     ],
     "rows": [
      [
       "처음",
       "A에만 표식을 놓아요."
      ],
      [
       "짝과 차례",
       "아래 표의 짝을 같은 순서로 실행해요."
      ],
      [
       "비교 규칙",
       "매 차례 악수 전에 B·D·F의 표식을 빼는 규칙을 적용해요."
      ],
      [
       "기록",
       "각 차례 뒤 표식이 남은 이름과 수를 적어요."
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "악수하는 짝"
     ],
     "rows": [
      [
       "1차례",
       "A-B · C-D · E-F"
      ],
      [
       "2차례",
       "B-C · D-E · F-A"
      ],
      [
       "3차례",
       "C-D · E-F · A-B"
      ]
     ]
    },
    {
     "type": "text",
     "text": "손 씻기 규칙 두 가지(「손 씻기 없음」, 「B·D·F가 차례마다 손 씻기」)로 해 보고 결과를 비교해요. 짝과 차례는 두 규칙에서 똑같이 해요."
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "두 규칙에서 같게 둘 것과 바꿀 것, 실행 뒤 기록할 것을 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "손 씻기 규칙 하나만 바꿔요."
    },
    {
     "title": "더 알아보기",
     "text": "처음 반짝이를 묻힌 사람(A), 짝, 악수 차례"
    },
    {
     "title": "내가 정리할 것",
     "text": "반짝이는 병원체가 아니라 「옮겨 가는 것」을 보이게 한 표시예요."
    }
   ],
   "lead": "바꿀 조건은 하나, 나머지는 모두 같게.",
   "kind": "learn",
   "teacherNote": "3D 실험실에서 학생이 직접 규칙을 바꿔 보게 한 뒤 다음 쪽을 풀어요."
  },
  {
   "section": "③ 반짝이 가루 손 모형 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w014",
      "c22-s32-u04-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "차례를 읽는 법",
   "title": "새로 남길 표식은 이전 상태에서 정해요",
   "blocks": [
    {
     "type": "text",
     "text": "아래는 여섯 카드 모형의 한 비교 규칙을 두 번째 차례까지만 따라간 예예요. 매 차례 전에 B·D·F의 표식을 빼고, 그 뒤 같은 차례의 짝을 실행해요."
    },
    {
     "type": "table",
     "heads": [
      "단계",
      "확인할 상태",
      "표식이 있는 카드"
     ],
     "rows": [
      [
       "처음",
       "A에만 놓음",
       "A"
      ],
      [
       "1차례 전",
       "B·D·F의 표식 빼기",
       "A"
      ],
      [
       "1차례 뒤",
       "A-B / C-D / E-F 실행",
       "A·B"
      ],
      [
       "2차례 전",
       "B·D·F의 표식 빼기",
       "A"
      ],
      [
       "2차례 뒤",
       "B-C / D-E / F-A 실행",
       "A·F"
      ]
     ]
    },
    {
     "type": "example",
     "question": "2차례가 시작될 때 B에도 표식이 있다고 읽으면 무엇을 놓친 걸까요?",
     "steps": [
      [
       "단계 찾기",
       "1차례 결과 A·B와 2차례 실행 전 상태는 달라요."
      ],
      [
       "규칙 적용",
       "2차례 전에 B의 표식을 빼므로 실행 전에는 A만 남아요."
      ],
      [
       "다시 따라가기",
       "이전 상태 A를 기준으로 짝을 읽어요. F-A에서 F에 표식이 남고 A도 유지돼요."
      ]
     ],
     "answer": "표식 빼기 단계가 빠졌어요. “차례 전”과 “차례 뒤”를 따로 기록해요."
    },
    {
     "type": "field",
     "title": "기록 점검",
     "hint": "결과가 달랐다면 어느 단계부터 다시 살필지 이유와 함께 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "처음 → 표식 빼기 → 짝 실행 → 기록의 순서를 따라가요."
    },
    {
     "title": "더 알아보기",
     "text": "한 차례의 짝들은 서로 겹치지 않아요. 다음 차례로 넘어갈 때 이전 결과를 이어 받아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "③ 반짝이 모형 · 결과 읽기",
   "title": "아무도 손을 씻지 않으면?",
   "blocks": [
    {
     "type": "diagram",
     "key": "shake"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w016",
      "c22-s32-u04-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "차례마다 「반짝이가 있는 친구와 악수한 친구」를 찾아 더해요."
    },
    {
     "title": "더 알아보기",
     "text": "옮겨 받은 친구가 다음 차례에 또 옮겨서 점점 퍼져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "정답 확인(손 씻기 없음): 1차례 2명(A·B) · 2차례 4명(A·B·C·F) · 3차례 6명(A·B·C·D·E·F)"
  },
  {
   "section": "③ 반짝이 모형 · 손 씻기 규칙",
   "title": "세 친구만 손을 씻어도 달라질까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "wash"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w018",
      "c22-s32-u04-w019",
      "c22-s32-u04-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "3차례 뒤 6명 → 2명. 이 모형에서는 반짝이가 묻은 친구가 줄었어요."
    },
    {
     "title": "더 알아보기",
     "text": "이 모형의 표식 수는 실제 감염자 수가 아니에요. 실제 생활에서는 손 씻기·기침 예절·환기 등을 함께 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "「손을 씻으면 절대 안 옮는다」도, 「씻어도 소용없다」도 맞지 않아요."
    }
   ],
   "lead": "",
   "kind": "practice",
   "teacherNote": "손 씻기 규칙: 1차례 2명(A·B) · 2차례 2명(A·F) · 3차례 2명(A·B)"
  },
  {
   "section": "모형과 실제",
   "title": "표식이 줄었다는 결과로 어디까지 말할까요?",
   "blocks": [
    {
     "type": "text",
     "text": "종이 표식은 손에서 손으로 옮겨 가는 연결을 눈에 보이게 나타내요. 규칙으로 표식을 빼는 것과 실제로 손을 씻는 일은 같지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "모형이 보여 주는 것",
      "이 모형만으로 알 수 없는 것"
     ],
     "rows": [
      [
       "정한 짝과 차례에서 표식이 이어진 위치",
       "실제 교실에서 누가 감염되는지"
      ],
      [
       "표식 빼기 규칙이 있을 때 달라진 결과",
       "손 씻기의 정확한 병원체 제거율"
      ],
      [
       "처음 위치와 순서를 같게 비교하는 방법",
       "모든 감염병에서 같은 결과가 나오는지"
      ]
     ]
    },
    {
     "type": "example",
     "question": "표식이 3장인 종이 자료를 보고 “실제 환자도 3명”이라고 말했어요. 맞을까요?",
     "steps": [
      [
       "센 대상",
       "이 자료에서 센 것은 종이 표식이 남은 카드 수예요."
      ],
      [
       "빠진 정보",
       "실제 병원체나 사람의 건강 상태를 측정한 자료가 아니에요."
      ],
      [
       "결론 다듬기",
       "정해진 모형에서 표식이 남은 카드가 3장이라고만 설명해요."
      ]
     ],
     "answer": "환자 수로 바꾸어 말할 수 없어요. 센 대상과 확인한 범위를 함께 적어요."
    },
    {
     "type": "field",
     "title": "모형 설명 한 문장",
     "hint": "옮겨 가는 연결을 생각하는 데 도움이 되는 점과 한계 하나를 함께 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "표식 수·병원체 수·환자 수는 서로 바꿔 쓸 수 없어요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 생활에서는 손 씻기뿐 아니라 기침 예절·환기 등 알맞은 예방 행동을 함께 지켜요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 손 씻기",
   "title": "비누로 30초, 여섯 곳을 꼼꼼히",
   "blocks": [
    {
     "type": "text",
     "text": "손은 병원체가 옮겨 갈 수 있는 여러 길 중 하나예요. **비누와 흐르는 물로 30초 이상**, 손바닥·손등·손가락 사이·손가락·엄지손가락·손톱 밑까지 꼼꼼히 씻어요."
    },
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s32-u04-photo-handwash.webp",
       "alt": "비누 거품으로 손을 씻는 모습",
       "cap": "비누 거품을 내어 30초 이상"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-glitter-left.webp",
       "alt": "물로만 헹군 뒤 손가락 사이와 손톱 밑에 남은 반짝이",
       "cap": "반짝이가 남은 설명 장면 — 실제 제거량 측정은 아님"
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "실제 사진 아님"
    },
    {
     "type": "table",
     "heads": [
      "빠뜨리지 않을 곳",
      "살필 점"
     ],
     "rows": [
      [
       "손바닥·손등",
       "손바닥만 문지르지 않았나요?"
      ],
      [
       "손가락 사이·손가락",
       "손가락 사이와 마주 잡은 손가락도 씻었나요?"
      ],
      [
       "엄지손가락·손톱 밑",
       "엄지 둘레와 손톱 밑까지 꼼꼼히 씻었나요?"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "씻을 때와 씻는 부위를 골라 언제·어떻게 확인할지 써요. 아직 하지 않았다면 계획으로 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비누 + 흐르는 물 + 30초 이상 + 여섯 곳"
    },
    {
     "title": "더 알아보기",
     "text": "노래 속도는 다를 수 있어요. 실제 시간과 씻는 부위를 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "밥 먹기 전 · 화장실 뒤 · 밖에서 들어온 뒤 · 코를 풀거나 기침한 뒤"
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 손 씻기 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w021",
      "c22-s32-u04-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "④ 예방 수칙 · 기침 예절과 환기",
   "title": "침방울과 공기도 막아요",
   "blocks": [
    {
     "type": "gallery",
     "items": [
      {
       "src": "../assets/book/c22-s32-u04-photo-cough-kit.webp",
       "alt": "교실 책상에 놓인 휴지 상자와 작은 휴지통",
       "cap": "기침 예절을 위한 준비물의 예"
      },
      {
       "src": "../assets/book/c22-s32-u04-photo-ventilation.webp",
       "alt": "창문과 문을 연 빈 교실의 설명 장면",
       "cap": "어른의 도움으로 안전하게 환기해요"
      }
     ],
     "numbered": false,
     "cols": 2,
     "credit": "실제 사진 아님"
    },
    {
     "type": "text",
     "text": "기침이나 재채기를 할 때는 휴지나 **옷소매 안쪽**으로 입과 코를 가려요. 손바닥으로 가리면 침방울이 손에 묻어 다시 옮겨 가요. 교실은 쉬는 시간마다 창문을 열어 **환기**해요."
    },
    {
     "type": "table",
     "heads": [
      "언제",
      "연결할 행동"
     ],
     "rows": [
      [
       "기침·재채기할 때",
       "휴지나 옷소매로 입과 코 가리기"
      ],
      [
       "휴지를 쓴 뒤",
       "휴지통에 버리고 손 씻기"
      ],
      [
       "실내 공기를 바꿀 때",
       "어른과 안전한 환기 방법 정하기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "휴지가 없을 때의 행동과 안전하게 환기하기 위해 필요한 도움을 각각 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기침은 휴지나 옷소매 안쪽에 · 쓴 휴지는 바로 버리고 손 씻기"
    },
    {
     "title": "더 알아보기",
     "text": "사람이 많은 곳에서 마스크를 쓰면 침방울이 덜 퍼져요."
    },
    {
     "title": "내가 정리할 것",
     "text": "손바닥으로 가리는 것은 「손으로 옮겨 가는 길」을 다시 여는 일이에요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 기침 예절과 환기 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w023",
      "c22-s32-u04-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "손 씻기 방법의 근거",
   "title": "시간과 씻는 부위를 함께 확인해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "wash",
     "caption": "비누 거품을 내어 손을 씻는 설명 장면"
    },
    {
     "type": "text",
     "text": "질병관리청은 비누와 물로 30초 이상 꼼꼼히 씻도록 안내해요. 다음은 실제 효과를 잰 결과가 아니라 방법을 점검하는 가상 계획이에요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "비누·흐르는 물",
      "시간",
      "씻는 곳"
     ],
     "rows": [
      [
       "가",
       "비누 사용·흐르는 물",
       "35초",
       "손바닥만"
      ],
      [
       "나",
       "비누 사용·흐르는 물",
       "35초",
       "손바닥·손등·손가락 사이·손가락·엄지·손톱 밑"
      ],
      [
       "다",
       "비누 없음·흐르는 물",
       "35초",
       "손바닥·손등"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가와 나는 둘 다 35초예요. 같은 방법이라고 할 수 있을까요?",
     "steps": [
      [
       "같은 점",
       "두 계획 모두 비누·흐르는 물과 35초라는 조건이 같아요."
      ],
      [
       "다른 점",
       "가는 손바닥만, 나는 여러 부위를 빠뜨리지 않고 씻기로 했어요."
      ],
      [
       "안내와 연결",
       "시간만 채우는 대신 씻는 부위까지 꼼꼼히 확인해야 해요. 이 표로 실제 제거량을 정하지 않아요."
      ]
     ],
     "answer": "시간이 같아도 씻는 부위가 달라요. 방법 전체를 점검해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "비누·흐르는 물·충분한 시간·빠뜨리지 않는 부위를 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "헹군 뒤 깨끗하게 말려요. 노래 길이나 사진 한 장으로 씻은 시간·효과를 확인하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "④ 예방 수칙 · 유형 연습",
   "title": "언제, 어떻게 씻을까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w025",
      "c22-s32-u04-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "「언제」 문제는 병원체를 만났을 때와 입으로 들어가기 전을 떠올려요."
    },
    {
     "title": "더 알아보기",
     "text": "오늘 손을 씻은 때를 모두 적어 봐요.",
     "write": 7
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "⑤ 함께 지키는 건강한 생활",
   "title": "나를 지키고 친구를 지켜요",
   "blocks": [
    {
     "type": "text",
     "text": "감염병 예방 수칙은 한 사람만 지키는 것보다 여럿이 함께 지킬 때 더 큰 힘을 내요. 반짝이 모형에서 여섯 명 가운데 세 명만 손을 씻어도 퍼지는 친구가 줄었어요."
    },
    {
     "type": "table",
     "heads": [
      "",
      "나를 지켜요",
      "친구를 지켜요"
     ],
     "rows": [
      [
       "손",
       "밥 먹기 전 손 씻기",
       "기침한 뒤 손 씻고 악수하기"
      ],
      [
       "기침",
       "아플 때 집에서 쉬기",
       "옷소매로 가리고 기침하기"
      ],
      [
       "생활",
       "예방 접종 제때 받기",
       "컵·수건은 각자 쓰기"
      ]
     ]
    },
    {
     "type": "example",
     "question": "여섯 명 가운데 세 명만 손을 씻어도 도움이 될까요?",
     "steps": [
      [
       "조건 확인",
       "짝과 차례는 같고 손 씻기 규칙만 달라요."
      ],
      [
       "결과 비교",
       "3차례 뒤 6명 → 2명"
      ],
      [
       "결론",
       "정해진 모형에서는 표식이 있는 카드가 줄었어요. 이 수를 실제 환자 수로 해석하지 않아요."
      ]
     ],
     "answer": "모형으로 옮겨 가는 길을 생각하고 실제 생활에서는 여러 예방 행동을 함께 지켜요."
    },
    {
     "type": "field",
     "title": "조건과 행동을 연결해요",
     "hint": "친구를 탓하지 않으면서 서로의 건강한 생활을 도울 약속을 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예방 수칙은 함께 지킬수록 효과가 커요."
    },
    {
     "title": "더 알아보기",
     "text": "예방 접종은 병원체를 이겨 낼 힘을 미리 기르는 방법이에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아픈 친구를 탓하지 않고 낫도록 응원해요."
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "⑤ 함께 지키는 건강한 생활 · 확인",
   "title": "배운 개념을 조건에 적용해요",
   "kind": "practice",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w027",
      "c22-s32-u04-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞쪽의 설명에서 조건과 근거를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "문항이 제시한 상황과 모형·실제의 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ]
  },
  {
   "section": "⑤ 함께 지키는 생활 · 유형 연습",
   "title": "우리가 할 수 있는 일",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w029",
      "c22-s32-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "「나를 지키는 일」과 「친구를 지키는 일」을 나눠 생각해요."
    },
    {
     "title": "더 알아보기",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "두 기록을 연결하기",
   "title": "함께 달라졌다고 원인이 확인된 걸까요?",
   "blocks": [
    {
     "type": "text",
     "text": "두 주 동안 같은 20명을 살폈다고 정한 연습용 가상 표예요. 손 씻기 약속 실천과 감기 결석의 집계만 있고, 다른 조건이나 개인별 자료는 없어요."
    },
    {
     "type": "table",
     "heads": [
      "주",
      "전체",
      "약속 실천",
      "감기 결석"
     ],
     "rows": [
      [
       "첫째 주",
       "20명",
       "8명",
       "4명"
      ],
      [
       "둘째 주",
       "20명",
       "16명",
       "2명"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“손 씻기 하나 때문에 결석이 줄었다”는 말을 이 표로 확인할 수 있나요?",
     "steps": [
      [
       "변화 읽기",
       "약속 실천은 8명에서 16명, 결석은 4명에서 2명으로 달라졌어요."
      ],
      [
       "없는 조건",
       "환기나 생활 조건이 같았는지, 각 친구가 어떤 행동을 했는지는 표에 없어요."
      ],
      [
       "결론의 범위",
       "두 집계의 변화는 읽을 수 있지만, 손 씻기 하나만의 원인이라고 확정할 수는 없어요."
      ]
     ],
     "answer": "표의 변화와 예방 수칙의 근거를 연결하되, 이 표가 증명하지 않은 원인을 덧붙이지 않아요."
    },
    {
     "type": "field",
     "title": "표에 있는 말·더 확인할 말",
     "hint": "자료로 확인되는 변화 하나와, 추가로 필요한 정보 하나를 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기록이 보여 주는 변화와 그 변화의 원인을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "개인 이름이나 병력을 모으지 않고도, 표의 조건과 빠진 정보를 따져 볼 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료 깊이 읽기 1",
   "title": "표가 말해 주는 것과 말해 주지 않는 것",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "주",
      "손 씻기 약속을 지킨 친구(24명 중)",
      "감기로 결석한 친구"
     ],
     "rows": [
      [
       "1주",
       "10명",
       "5명"
      ],
      [
       "2주",
       "17명",
       "3명"
      ],
      [
       "3주",
       "22명",
       "2명"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w031",
      "c22-s32-u04-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 표의 수치는 연습을 위해 지은 가상 학습값이에요. 실제 기록이 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "제목 → 단위 → 늘었나 줄었나 → 표에 없는 것은 말하지 않기"
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2",
   "title": "상황 속에서 옮겨 가는 길 찾기 · 1",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황마다 「무엇이 닿았나·무엇이 나왔나·무엇을 먹었나」를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "친구 여섯 명을 동그라미로 그리고, 차례마다 손 씻기 → 악수 순서로 따라가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "자료 깊이 읽기 2",
   "title": "상황 속에서 옮겨 가는 길 찾기 · 2",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "상황마다 「무엇이 닿았나·무엇이 나왔나·무엇을 먹었나」를 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "친구 여섯 명을 동그라미로 그리고, 차례마다 손 씻기 → 악수 순서로 따라가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "빈칸으로 정리",
   "title": "단원의 핵심을 한눈에",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w035",
      "c22-s32-u04-w036",
      "c22-s32-u04-w037",
      "c22-s32-u04-w038"
     ]
    },
    {
     "type": "field",
     "title": "한 문장으로 정리",
     "hint": "「병원체 → 옮겨 가는 길 → 손 씻기·기침 예절·환기 → 함께 지키기」를 넣어 한 문장으로 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈칸이 막히면 그 개념 쪽(①~⑤)으로 돌아가요."
    },
    {
     "title": "더 알아보기",
     "text": "감염병 / 옮겨 가는 길 / 손 씻기 / 기침 예절 — 네 가지를 설명할 수 있나요?"
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "단원평가 1",
   "title": "개념으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w039",
      "c22-s32-u04-w040",
      "c22-s32-u04-w041",
      "c22-s32-u04-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물음이 「알맞은 것」인지 「알맞지 않은 것」인지 먼저 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "",
     "write": 6
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "단원평가 2",
   "title": "모형과 생활을 이어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w043",
      "c22-s32-u04-w044",
      "c22-s32-u04-w045",
      "c22-s32-u04-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모두 고르기는 맞는 보기를 모두 골랐는지 다시 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "답 → 모형 근거(몇 명 → 몇 명) → 결론 순서로 써요."
    },
    {
     "title": "내가 정리할 것",
     "text": "",
     "write": 4
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "서술형 · 창의",
   "title": "우리 반 예방 약속을 만들어요 · 1",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "손 · 기침 · 공기 — 세 가지 길을 모두 막았나요?"
    },
    {
     "title": "더 알아보기",
     "text": "2번에 쓴 처음 생각이 어떻게 바뀌었나요?",
     "write": 5
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "서술형 · 창의",
   "title": "우리 반 예방 약속을 만들어요 · 2",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "손 · 기침 · 공기 — 세 가지 길을 모두 막았나요?"
    },
    {
     "title": "더 알아보기",
     "text": "2번에 쓴 처음 생각이 어떻게 바뀌었나요?",
     "write": 5
    },
    {
     "title": "내가 정리할 것",
     "text": "내 판단의 근거와 다시 볼 것을 적어요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "test",
   "layout": "two"
  },
  {
   "section": "생각 넓히기 ①",
   "title": "종이 표식으로 규칙을 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "짝",
      "비교 규칙에서 먼저 할 일"
     ],
     "rows": [
      [
       "처음",
       "A에만 표식",
       "A에만 표식"
      ],
      [
       "1",
       "A-B",
       "그대로"
      ],
      [
       "2",
       "C-D",
       "B의 표식 빼기"
      ],
      [
       "3",
       "B-C",
       "그대로"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w049",
      "c22-s32-u04-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "표식은 실제 병원체나 환자가 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "paper4-v1",
    "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
   }
  },
  {
   "section": "생각 넓히기 ①",
   "title": "조건과 결과를 따로 읽어요",
   "blocks": [
    {
     "type": "text",
     "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w051",
      "c22-s32-u04-w052",
      "c22-s32-u04-w053",
      "c22-s32-u04-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 조건·같게 할 조건·살펴볼 결과를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "paper4-v1",
    "text": "카드 A~D와 종이 표식을 사용해요. 처음에는 A에만 표식이 있어요. 짝 중 한쪽에 표식이 있으면 양쪽에 표식을 남겨요. 1차례 A-B, 2차례 C-D, 3차례 B-C 순서예요. 비교 규칙에서는 2차례를 시작하기 직전에 B의 표식만 빼요. 실제 사람이나 병원체의 실험이 아닌 종이 모형이에요."
   }
  },
  {
   "section": "생각 넓히기 ① · 해 보기",
   "title": "카드로 직접 실행해 확인해요",
   "blocks": [
    {
     "type": "heading",
     "text": "준비와 실행"
    },
    {
     "type": "list",
     "items": [
      "A~D라고 쓴 종이 카드4장과 종이 표식을 준비해요.",
      "처음A에만 표식을 놓고,제시한 짝과 차례를 따라가요.",
      "두 규칙을 각각 처음 상태에서 실행하고 결과를 적어요.",
      "실제로 해 보지 않았다면 예상이나 자료 확인이라고 적어요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "실제로 해 본 기록",
     "hint": "두 규칙에서 표식이 남은 카드와 다른 결과가 나왔다면 그 과정을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종이만 사용해요. 서로 악수하거나 병원체를 옮기는 실험을 하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ① · 그림",
   "title": "모형의 결과와 한계를 나타내요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료로 알 수 있는 것과 알 수 없는 것을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "실행을 돕는 조건",
   "title": "하지 않음과 알 수 없음을 나누어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "요일",
      "정한 기회",
      "실천 기록",
      "덧붙인 정보"
     ],
     "rows": [
      [
       "월",
       "2번",
       "2번",
       "준비물과 시간이 있었음"
      ],
      [
       "화",
       "2번",
       "미기록",
       "실천 여부를 적지 않음"
      ],
      [
       "수",
       "2번",
       "0번",
       "실천하지 않았다고 적음"
      ]
     ]
    },
    {
     "type": "example",
     "question": "화요일 칸을 0번으로 채우고 “수요일과 같다”고 해도 될까요?",
     "steps": [
      [
       "기록 뜻",
       "화요일은 실제로 했는지 적지 않았고, 수요일은 하지 않았다고 적었어요."
      ],
      [
       "판단 구별",
       "화요일을 0번이나 2번으로 정할 정보가 없어요. 빈칸을 예상으로 채우지 않아요."
      ],
      [
       "다음 행동",
       "실제로 한 행동을 적고, 어려움이 있었다면 시간·차례·준비물 중 필요한 도움을 정해요."
      ]
     ],
     "answer": "미기록은 모름이고, 0번은 하지 않았다는 기록이에요."
    },
    {
     "type": "table",
     "heads": [
      "실천을 어렵게 한 상황",
      "의논할 도움"
     ],
     "rows": [
      [
       "세면대 줄이 길었음",
       "선생님과 시간·차례 나누기 의논"
      ],
      [
       "비누나 말릴 도구가 부족했음",
       "필요한 준비물을 어른에게 알리기"
      ],
      [
       "창문이 높아 혼자 열기 어려움",
       "올라가지 않고 어른에게 도움 요청"
      ]
     ]
    },
    {
     "type": "field",
     "title": "내가 해 볼 약속",
     "hint": "언제·어떻게·필요한 도움·확인할 기록을 함께 써요. 아직 하지 않았다면 계획이라고 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제 행동·하지 않음·미기록을 서로 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "방법을 지키기 어렵다고 친구를 탓하지 않아요. 실행할 수 있게 도와주는 조건을 찾아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 단서와 내 판단을 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "생각 넓히기 ②",
   "title": "실천0번과 미기록은 달라요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 기록이에요. 기회는 손을 씻기로 정한 때의 횟수, 미기록은 실제로 했는지 적지 않은 것이에요."
    },
    {
     "type": "table",
     "heads": [
      "요일",
      "실천 기회",
      "실천"
     ],
     "rows": [
      [
       "월",
       "2번",
       "2번"
      ],
      [
       "화",
       "3번",
       "미기록"
      ],
      [
       "수",
       "2번",
       "1번"
      ],
      [
       "목",
       "1번",
       "0번"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w057",
      "c22-s32-u04-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈 기록을0번으로 채워 넣지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "practice4-v1",
    "text": "연습용 가상 기록: 월요일 기회2번·실천2번, 화요일 기회3번·실천미기록, 수요일 기회2번·실천1번, 목요일 기회1번·실천0번. 기회는 손을 씻기로 정한 때의 횟수이고, 미기록은 실제로 했는지 적지 않은 것이에요."
   }
  },
  {
   "section": "생각 넓히기 ②",
   "title": "기록으로 확인되는 만큼만 말해요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 기록: 월요일 기회2번·실천2번, 화요일 기회3번·실천미기록, 수요일 기회2번·실천1번, 목요일 기회1번·실천0번. 기회는 손을 씻기로 정한 때의 횟수이고, 미기록은 실제로 했는지 적지 않은 것이에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w059",
      "c22-s32-u04-w060",
      "c22-s32-u04-w061",
      "c22-s32-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획·실제 행동·미기록을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "practice4-v1",
    "text": "연습용 가상 기록: 월요일 기회2번·실천2번, 화요일 기회3번·실천미기록, 수요일 기회2번·실천1번, 목요일 기회1번·실천0번. 기회는 손을 씻기로 정한 때의 횟수이고, 미기록은 실제로 했는지 적지 않은 것이에요."
   }
  },
  {
   "section": "생각 넓히기 ② · 해 보기",
   "title": "어려움을 줄일 방법을 정해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w063"
     ]
    },
    {
     "type": "heading",
     "text": "다음 기회에 짧게 점검하기"
    },
    {
     "type": "field",
     "title": "기회와 행동",
     "hint": "한 번의 기회를 골라 실제로 한 행동·어려움·다음 방법만 적어요. 아직 하지 않았다면 계획으로 남겨요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "친구의 병력이나 실제 감염자 이름을 수집하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ② · 그림",
   "title": "실천 점검표를 설계해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "양식을 잘 그린 것과 실제 실천한 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ③",
   "title": "안내문의 출처와 날짜를 살펴요",
   "blocks": [
    {
     "type": "text",
     "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w065",
      "c22-s32-u04-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광고나 큰 글씨가 과학적 근거를 대신하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sourcecards-v1",
    "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "근거에 맞게 말해요",
   "blocks": [
    {
     "type": "text",
     "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w067",
      "c22-s32-u04-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "확인한 정보와 확인할 수 없는 정보를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sourcecards-v1",
    "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "판단을 설명하고 안내를 나눠요",
   "blocks": [
    {
     "type": "text",
     "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w069",
      "c22-s32-u04-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "근거를 확인하고 친구가 이해했는지 점검해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "sourcecards-v1",
    "text": "가: 질병관리청 「손씻기」, 2026년4월15일 갱신, 비누와 물로30초 이상 꼼꼼히 씻기. 나: 출처·날짜가 없는 연습용 광고, 「이 비누만 쓰면 모든 감염병이0!」. 광고 나는 자료 판단 연습을 위해 지어냈어요."
   }
  },
  {
   "section": "생각 넓히기 ③ · 해 보기",
   "title": "친구가 따라 할 수 있게 고쳐요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w071"
     ]
    },
    {
     "type": "field",
     "title": "초안과 실제 의견",
     "hint": "예방 안내 초안을 만들고 가능하면 친구에게 이해하기 쉬운지 물어봐요. 묻지 않았다면 아직 의견을 듣지 못했다고 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 의견을 받기 전에는 예상 의견이라고 밝혀요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ③ · 그림",
   "title": "전·중·뒤의 안내를 만들어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "그림 솜씨보다 방법과 순서가 분명한지 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "혼자 하기 어려우면 도움을 찾아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w073",
      "c22-s32-u04-w074",
      "c22-s32-u04-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "생활의 어려움과 필요한 도움을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "계획·실행·배려를 구별해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w076",
      "c22-s32-u04-w077",
      "c22-s32-u04-w078",
      "c22-s32-u04-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예방 행동을 돕되 친구를 탓하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④ · 그림",
   "title": "함께 지킬 수 있는 방법을 설계해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 조건 안에서 실행할 수 있게 그려요."
    },
    {
     "title": "더 알아보기",
     "text": "자료가 보여 주는 범위와 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "근거를 짚고 내 말로 설명해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "출처와 돌아보기",
   "title": "확인한 자료와 내 생각을 구별해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "field",
     "title": "단원을 마치며",
     "hint": "처음 생각에서 달라진 점과 아직 더 알아보고 싶은 점을 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 교재의 수치·광고·실천 기록은 학습용 모형과 가상 자료예요."
    },
    {
     "title": "더 알아보기",
     "text": "현재 안내가 달라졌는지 어른과 함께 출처를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "실제로 해 본 일과 아직 계획인 일을 구별해요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  }
 ]
};

export const infectionUpperPriorWorkbook=withStudentOpeningLanguage(withInfectionRails(baseWorkbook));
export const infectionReasoningPriorWorkbook=withInfectionUpperScience(infectionUpperPriorWorkbook);
export const workbook=withInfectionLearnerReasoning(infectionReasoningPriorWorkbook);
