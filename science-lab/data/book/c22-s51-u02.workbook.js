import{withGrade5StudyNotes}from'./grade5-study-notes.js?v=20261108-grade5-study-notes';
import{withLightReadableWorkbook}from'./c22-s51-u02.editorial.js?v=20261106-light-readable-workbook';
import {withLightStudentLanguage} from './light-student-language.js';
import {withLightEditorial,withLightPictureGuide} from './c22-s51-u02.editorial.js?v=20261105-light-picture-guide';
// 빛의 성질80문항. scripts/gen-science-workbook-c22s51u02.mjs가 생성.
const baseWorkbook = {
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "빛의 성질",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourcePencil",
     "caption": ""
    },
    {
     "type": "text",
     "text": "물속의 연필은 왜 꺾여 보일까요? 빛의 길을 관찰하고 한 조건씩 비교하면 물체 보기·직진·반사·굴절을 근거로 설명할 수 있어요."
    },
    {
     "type": "field",
     "title": "나의 시작 질문",
     "hint": "거울·물·렌즈에서 궁금한 점 하나를 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진의 보이는 모습과 실제 물체의 변화는 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰 사진·기존 설명 그림·별도 연습 자료와 내가 실제로 한 실험을 나누어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이름·학습 날짜와 처음 궁금한 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "차례와 사용법",
   "title": "관찰에서 장치 제작으로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "학습 길",
      "할 일"
     ],
     "rows": [
      [
       "빛과 물체 보기",
       "광원·반사된 빛·어둠상자 비교"
      ],
      [
       "같은 공기에서 직진",
       "구멍 위치 한 가지만 바꾸어 비교"
      ],
      [
       "평면거울 반사·물과 렌즈 굴절",
       "어느 경계와 구간의 빛인지 설명"
      ],
      [
       "거울·렌즈의 쓰임",
       "목적에 맞는 장치 설계·실제 제작·재시험"
      ],
      [
       "80문항으로 확인",
       "객관식·복수선택·빈칸·연결·순서·단답·서술·그림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "앞의 준비 점검은 첫 생각을 알아보는 활동이에요. 문제의 답과 실제 관찰·제작한 일을 따로 확인해요. 기록을 길게 채우기보다 필요한 근거와 설명을 남겨요."
    },
    {
     "type": "field",
     "title": "실험 준비",
     "hint": "교사와 준비할 장치와 실제 해 볼 활동을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "본문과 발문을 읽고 오른쪽 핵심·보충 설명을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실험 장치는 교사가 준비해요. 광원을 눈에 비추거나 태양을 렌즈로 보지 않고 햇빛 모으기·레이저·학생 칼질을 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "준비 점검 1~2",
   "title": "물체 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-01",
      "light-book-02"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "어둠에 익숙해짐과 빛이 전혀 없는 상태를 혼동하지 않는다. 경계에서 다른 물질로 들어가는 굴절과 구별한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "준비 점검 3~4",
   "title": "장치의 기능",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-03",
      "light-book-04"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "반짝이는 도구가 모두 렌즈인 것은 아니다. 보였다/안 보였다만으로 실험 방법까지 전해졌다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기",
   "title": "스스로 빛을 내거나 반사한 빛으로 보여요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceLight",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sourceSeeing",
     "caption": ""
    },
    {
     "type": "example",
     "question": "컵은 스스로 빛을 내는 물체일까요?",
     "steps": [
      [
       "광원",
       "전등은 스스로 빛을 내요."
      ],
      [
       "물체",
       "컵은 전등 빛을 반사해요."
      ],
      [
       "눈",
       "컵에서 온 빛이 눈에 들어와 보여요."
      ]
     ],
     "answer": "컵이 밝게 보인다는 사실만으로 광원이라고 할 수 없어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보통 물체를 볼 때는 광원 → 물체 → 눈으로 빛이 진행해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "달도 햇빛을 반사해 보여요. 눈에서 빛이 나가 책을 찾는 설명과 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ①",
   "title": "어둠상자의 조명만 바꾸어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "바꿀 것",
      "같게 둘 것",
      "살펴볼 것"
     ],
     "rows": [
      [
       "상자 안 LED 켜짐/꺼짐",
       "눈·상자·물체·관찰 구멍 위치",
       "같은 물체가 보이는지"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "교사 준비 상자에 공이나 카드를 놓고 처음 위치를 고정해요.",
      "내부를 비추는 약한 LED만 끄고 켜며 보임을 비교해요.",
      "상자 틈의 주변 빛도 확인해 잘 안 보임과 빛이 전혀 없음을 구별해요."
     ]
    },
    {
     "type": "field",
     "title": "근거로 설명",
     "hint": "두 조건의 보임과 물체에서 눈으로 오는 빛을 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조명과 물체 위치를 함께 바꾸면 조명만의 영향인지 알기 어려워요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이 활동은 교사 준비 장치에서 해요. 직접 안 했다면 자료나 시범을 본 범위를 설명해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기 5~6",
   "title": "빛의 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-05",
      "light-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈에서 책으로 빛이 나간다는 생각을 점검한다. 밝게 보임과 스스로 빛을 냄을 구별한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기 7~8",
   "title": "어둠상자 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-07",
      "light-book-08"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "여러 조건을 함께 바꾸면 결과의 까닭을 가리기 어렵다. 문장에 나온 순서를 그대로 답으로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기 9~10",
   "title": "물체 보기의 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-09",
      "light-book-10"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "빛이 공까지만 도달하면 눈의 위치와 무관하게 보인다는 생각을 점검한다. 장난감이 조명처럼 스스로 빛을 냈다고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛의 직진",
   "title": "같은 물질 안에서는 곧게 나아가요",
   "blocks": [
    {
     "type": "diagram",
     "key": "straight",
     "caption": "기존 설명 그림. 세 구멍과 눈이 한 줄인 배치와 가운데가 어긋난 배치를 비교해요."
    },
    {
     "type": "example",
     "question": "가운데 구멍만 옮기면 빛이 구멍을 찾아갈까요?",
     "steps": [
      [
       "한 줄",
       "같은 공기 속 곧은 경로로 통과할 수 있어요."
      ],
      [
       "어긋남",
       "그 길을 판이 가리면 저절로 굽어 가지 않아요."
      ]
     ],
     "answer": "이 비교는 빛의 직진을 뒷받침해요."
    },
    {
     "type": "field",
     "title": "내 설명",
     "hint": "구멍 배열과 빛의 경로를 연결해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속에서의 직진을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울 표면이나 다른 물질의 경계를 만나도 언제나 같은 방향으로만 간다는 뜻은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ②",
   "title": "맞춤 → 어긋남 → 다시 맞춤",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 약한 LED·세 구멍 판·목표 종이를 고정해요. 눈으로 광원을 들여다보지 않고 종이에 닿는 빛을 살펴요.",
      "구멍이 한 줄일 때와 가운데 판만 옆으로 옮겼을 때를 비교해요.",
      "가운데 판을 처음 자리로 돌려 처음 결과가 다시 나타나는지 확인해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "같게 둔 것",
      "바꾼 조건",
      "종이에서 실제로 본 것"
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
     "title": "다시 확인할 점",
     "hint": "판 흔들림·주변 빛·약한 불빛 등 불분명한 조건과 다시 해 볼 방법을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "다른 판·광원·목표 종이를 고정하고 가운데 구멍 위치만 바꾸어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공기 중에서 빛줄기가 늘 보이는 것은 아니에요. 준비한 종이 위 자취나 목표 종이에 닿는 곳을 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "직진과 조건 비교 11~12",
   "title": "직진",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-11",
      "light-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속 구멍 배열과 곧은 경로를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "빛이 언제 어디서나 경계도 무시하고 곧게 간다고 확대하지 않는다. 빛이 구멍을 찾아 굽어 들어간다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "직진과 조건 비교 13~14",
   "title": "그림자의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-13",
      "light-book-14"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속 구멍 배열과 곧은 경로를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "어둠이 카드에서 밖으로 나오는 물질처럼 설명하지 않는다. 모든 판을 다시 움직인 뒤 비교하면 한 조건의 영향을 가리기 어렵다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "직진과 조건 비교 15~16",
   "title": "상황과 성질",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-15",
      "light-book-16"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속 구멍 배열과 곧은 경로를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "두 현상 모두 빛이 있지만 관찰하는 구간이 다르다. 관찰 한 번으로 모든 물질 경계에서의 경로까지 같다고 단정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛의 반사",
   "title": "거울에서 되돌아 나아가요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceMirror",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "reflection",
     "caption": "기존 경로 그림의 한 거울 배치예요. 각도값을 계산하지 않아요."
    },
    {
     "type": "text",
     "text": "거울이 새 물체를 만들어 내거나 물체를 실제로 옮기는 것은 아니에요. 물체에서 온 빛이 거울에서 반사되어 눈에 들어오면 그 모습을 볼 수 있어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "반사는 경계에 닿은 빛이 되돌아 나오는 현상이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "책·종이도 빛을 반사하지만 평면거울처럼 또렷한 모습을 비추지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ③",
   "title": "거울 방향만 바꾸어 경로를 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 약한 LED 슬릿 광원·종이·안전 평면거울을 고정해요.",
      "종이 위에서 거울에 닿기 전과 반사되어 나간 뒤의 자취를 살펴요.",
      "광원·종이는 고정하고 거울 방향 한 곳만 바꾸어 빛이 닿는 곳을 비교해요."
     ]
    },
    {
     "type": "field",
     "title": "바뀐 경로와 근거",
     "hint": "거울을 돌리기 전후를 그리고 진행 화살표를 넣어요.",
     "lines": 4,
     "draw": true
    },
    {
     "type": "text",
     "text": "빛을 눈에 직접 비추지 않아요. 자취가 불분명하면 교사와 배치를 확인하고 관찰한 범위를 설명해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "카드와 눈이 그대로여도 거울 방향에 따라 카드가 안 보일 수 있어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "안 보인다는 사실만으로 카드가 없어졌다고 하지 않아요. 카드 → 거울 → 눈의 연결을 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "반사와 빛 경로 17~18",
   "title": "반사",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-17",
      "light-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 → 거울 → 눈으로 이어지는 빛을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈에서 거울로 빛을 쏘아 물체를 찾는 경로를 쓰지 않는다. 거울 속 모습과 실제 물체를 구분한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "반사와 빛 경로 19~20",
   "title": "반사 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-19",
      "light-book-20"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 → 거울 → 눈으로 이어지는 빛을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전등에서 거울로 직접 온 빛만으로 인형 모습을 본다고 설명하지 않는다. 잘 보려면 강한 빛을 눈으로 봐야 한다는 생각을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "반사와 빛 경로 21~22",
   "title": "반사의 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-21",
      "light-book-22"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 → 거울 → 눈으로 이어지는 빛을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울 속 공간에 실제 물체가 하나 더 있다는 생각을 점검한다. 보이지 않음과 물체가 없어짐을 같은 뜻으로 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛의 굴절",
   "title": "물체 자체와 보이는 모습은 달라요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourcePencil",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sourceCoin",
     "caption": ""
    },
    {
     "type": "text",
     "text": "물속 부분에서 온 빛이 물과 공기 경계를 지나 방향이 달라져 눈에 들어올 수 있어요. 연필이 실제로 부러지거나 동전이 스스로 떠올랐다는 뜻은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "다른 물질의 경계를 비스듬히 지날 때 꺾여 나아가는 굴절을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "두 동전 사진만으로 눈·그릇·동전이 같은 위치였다고 확인한 것은 아니에요. 실제 실험의 조건은 따로 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ④",
   "title": "눈·그릇·동전을 그대로 두어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "바꿀 것",
      "같게 둘 것",
      "살펴볼 것"
     ],
     "rows": [
      [
       "물 없음 / 물을 넣음",
       "눈·그릇·동전 위치",
       "동전이 보이는지·보이는 위치"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "교사와 처음 동전이 그릇 가장자리에 가려 안 보이는 눈 위치를 정해요.",
      "눈·그릇·동전을 움직이지 않고 물을 천천히 넣어 비교해요.",
      "눈이 움직이거나 동전이 밀렸다면 그 조건을 남기고 다시 맞추어 살펴요."
     ]
    },
    {
     "type": "field",
     "title": "조건을 고친 설명",
     "hint": "눈도 옮기고 물도 넣은 방법을 물 유무만 비교하도록 고쳐요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "text",
     "text": "물은 전기 기구와 떨어진 곳에서 쓰고 쏟으면 닦아요. 동전은 입에 넣지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관찰 결과와 그 까닭에 대한 설명을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "어느 시작 배치에서나 물만 넣으면 반드시 동전이 보인다고 하지 않아요. 경계에 들어가는 빛의 방향도 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "굴절과 관찰 범위 23~24",
   "title": "굴절",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-23",
      "light-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 물체 위치와 물질 경계를 지난 빛의 보임을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울에서 되돌아오는 반사와 혼동하지 않는다. 보이는 모양 변화와 실제 물체 변화가 반드시 같지는 않다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "굴절과 관찰 범위 25~26",
   "title": "동전 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-25",
      "light-book-26"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 물체 위치와 물질 경계를 지난 빛의 보임을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "결과가 잘 나오게 눈을 옮긴 뒤 굴절의 증거라고 기록하지 않는다. 진행 방향이 변했다는 말 하나로 두 현상을 같게 취급하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "굴절과 관찰 범위 27~28",
   "title": "굴절 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-27",
      "light-book-28"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 물체 위치와 물질 경계를 지난 빛의 보임을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진 한 장의 겉모습만으로 실제 변형을 단정하지 않는다. 물과 공기가 다르면 반드시 눈에 띄게 꺾인다는 절대 표현을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거울의 쓰임",
   "title": "목적과 빛의 경로를 함께 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourcePeriscope",
     "caption": "물체 쪽 첫 거울 → 눈 쪽 둘째 거울의 한 배치 예예요. 다른 문항은 그 문항의 위·아래 순서를 읽어요."
    },
    {
     "type": "table",
     "heads": [
      "도구",
      "보려는 대상과 도움"
     ],
     "rows": [
      [
       "세면대 거울",
       "얼굴 모습 살피기"
      ],
      [
       "자동차 뒤쪽 거울",
       "뒤쪽 상황 살피기"
      ],
      [
       "두 거울 잠망경",
       "직접 보기 어려운 곳의 대상 보기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "내가 조사한 쓰임",
     "hint": "교사 선정 자료의 도구·목적·도움과 자료 제목을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름만 쓰지 말고 무엇을 보도록 돕는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옆의 그림과 뒤 문항은 각각 제시된 배치를 읽어요. 모든 잠망경에서 위·아래 순서가 같은 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 제작 ①",
   "title": "가림판 너머의 카드를 볼 장치",
   "blocks": [
    {
     "type": "text",
     "text": "눈과 카드를 정한 자리에 두고, 가림판 때문에 직접 보이지 않는 카드를 안전 거울 두 개로 보려 해요."
    },
    {
     "type": "field",
     "title": "나의 설계",
     "hint": "카드·첫째 거울·둘째 거울·눈을 표시하고 빛의 경로를 이어요.",
     "lines": 4,
     "draw": true
    },
    {
     "type": "table",
     "heads": [
      "성공 기준",
      "같게 둘 조건",
      "처음 시험에서 확인할 것"
     ],
     "rows": [
      [
       "정한 눈 위치에서 카드가 보이는지",
       "",
       ""
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 관찰 창과 구멍을 준비한 종이 상자·안전 거울·받침·테이프로 실제 만들어 시험해요. 설계 그림만 있다면 아직 제작 전이에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 길이 첫 거울과 둘째 거울을 거쳐 눈까지 이어져야 해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "칼질·구멍 내기는 교사가 맡고 깨진 거울을 쓰지 않아요. 고정과 관찰 창의 위치도 목적에 맞게 정해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "거울의 쓰임과 설계 29~30",
   "title": "생활 속 거울",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-29",
      "light-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름·보려는 목적·빛이 눈에 도달하는 경로를 함께 말해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울을 사용하면 가려진 모든 곳이 무조건 보인다고 단정하지 않는다. 속이 빈 관만 있으면 빛이 관을 따라 저절로 굽는다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거울의 쓰임과 설계 31~32",
   "title": "장치의 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-31",
      "light-book-32"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름·보려는 목적·빛이 눈에 도달하는 경로를 함께 말해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울 순서를 바꾸어도 같은 배치에서 항상 보인다고 생각하지 않는다. 관 길이만이 실패 원인이라고 단정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거울의 쓰임과 설계 33~34",
   "title": "도구와 목적",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-33",
      "light-book-34"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름·보려는 목적·빛이 눈에 도달하는 경로를 함께 말해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울이 쓰였다는 공통점과 쓰임의 차이를 함께 살핀다. 거울 종류를 외우는 것만으로 장치 설명이 완성되었다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "렌즈의 굴절",
   "title": "렌즈를 넣기 전과 넣은 뒤의 빛",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceLens",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "관찰 장치",
      "살펴볼 것"
     ],
     "rows": [
      [
       "교사 준비 약한 LED 슬릿 광원·종이",
       "렌즈를 넣기 전 종이 위 빛 경로"
      ],
      [
       "같은 광원·종이와 볼록 렌즈",
       "렌즈 앞뒤에서 달라지는 경로"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사와 렌즈를 넣기 전과 넣은 뒤를 실제로 비교하고 바뀌는 구간을 가리켜 굴절을 설명해요. 사진의 진행 방향은 광원 위치와 함께 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈를 지나는 빛의 경로와 거울에서 되돌아 나오는 빛을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "렌즈의 모든 빛이 똑같이 꺾인다고 하지 않아요. 물체·눈과 렌즈의 거리에 따른 상의 크기·뒤집힘은 이 단원의 필수 비교가 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "렌즈의 쓰임과 재시험",
   "title": "관찰할 목적에 맞는 도구를 골라요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "필요",
      "도구와 도움"
     ],
     "rows": [
      [
       "작은 씨앗·글자의 특징 관찰",
       "돋보기로 자세히 살피기"
      ],
      [
       "보이지 않는 방향의 카드 관찰",
       "거울로 빛 경로 바꾸기"
      ]
     ]
    },
    {
     "type": "example",
     "question": "장치가 안 보이면 여러 곳을 한꺼번에 고칠까요?",
     "steps": [
      [
       "첫 결과",
       "안 보인 배치도 고칠 근거로 남겨요."
      ],
      [
       "한 변화",
       "다른 조건은 고정하고 거울 방향 한 곳을 바꾸어요."
      ],
      [
       "재시험",
       "같은 카드·눈 위치에서 다시 보이는지 확인해요."
      ]
     ],
     "answer": "수정 계획과 실제 재시험의 결과를 구별해요."
    },
    {
     "type": "field",
     "title": "나의 시험 기준",
     "hint": "보려는 대상과 성공 기준·같게 둘 조건을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조사 자료의 기능과 내가 직접 사용한 결과는 달라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실내 조명 아래에서 관찰하고 태양 직접 보기·햇빛 모으기·레이저를 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "렌즈·도구와 시험 35~36",
   "title": "렌즈 모양",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-35",
      "light-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈나 거울이 어떤 대상을 보는 데 도움을 주는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 렌즈의 지름이나 색만으로 종류를 판단하지 않는다. 조사 자료·친구 경험과 자신의 직접 관찰을 섞지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "렌즈·도구와 시험 37~38",
   "title": "렌즈 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-37",
      "light-book-38"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈나 거울이 어떤 대상을 보는 데 도움을 주는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "빛을 세게 모을수록 좋은 관찰이라는 생각을 점검한다. 평면거울을 쓰면 항상 확대된다는 생각을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "렌즈·도구와 시험 39~40",
   "title": "계획과 실제",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-39",
      "light-book-40"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈나 거울이 어떤 대상을 보는 데 도움을 주는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "예상한 결과를 실제 성공으로 옮겨 적지 않는다. 재료를 많이 넣으면 목적과 관계없이 좋은 장치라고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 41~42",
   "title": "반복 관찰 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-41",
      "light-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "연습 자료를 학생이 실제 측정한 기록으로 쓰지 않는다. 결과가 기대와 같으면 절차의 차이는 무시해도 된다는 생각을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 43~44",
   "title": "관찰과 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-43",
      "light-book-44"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰 기록 속에 이미 실제 변형이 확정되었다고 넣지 않는다. 결과를 지워 실패가 없었던 것처럼 만들지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 45",
   "title": "반사 경로 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-45"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울을 그대로 뚫거나 관의 벽을 따라 도는 빛으로 그리지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 46~47",
   "title": "경로 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-46",
      "light-book-47"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "두 번 반사되면 빛이 반드시 사라진다고 생각하지 않는다. 화살표가 빛의 세기나 물체의 이동 방향을 뜻한다고 혼동하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 48~49",
   "title": "경로의 일관성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-48",
      "light-book-49"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈이 받은 빛을 다시 책으로 쏘아 보게 된다는 생각을 점검한다. 밝음=광원이라는 오개념을 바로잡는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 50~51",
   "title": "증거의 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-50",
      "light-book-51"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 장치의 성공과 모든 장치의 검증을 혼동하지 않는다. 자료 속 사용 사례를 자신의 실험 결과로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 52",
   "title": "의견 반영",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-52"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "예쁘게 색칠하는 것만으로 사용법 질문이 해결되었다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "한눈에 정리",
   "title": "관찰 → 빛의 성질 → 생활 장치",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "근거가 된 비교",
      "연결할 내용"
     ],
     "rows": [
      [
       "조명만 바꾼 어둠상자",
       "물체를 보려면 눈에 들어오는 빛이 필요함"
      ],
      [
       "같은 공기에서 구멍 배열",
       "직진"
      ],
      [
       "거울에 닿아 되돌아 나오는 경로",
       "반사"
      ],
      [
       "물·렌즈 경계에서 달라지는 경로",
       "굴절"
      ],
      [
       "목적에 맞춘 장치와 재시험",
       "거울·렌즈의 쓰임과 실제 제작"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 핵심 설명",
     "hint": "한 사례를 골라 바꾼 조건·관찰·설명을 연결해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "성질 이름만 외우지 말고 어느 구간의 빛인지 가리켜 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "화살표는 빛의 진행 표식이에요. 관찰 사진·설명 그림·연습 자료와 실제 수행은 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "빈칸 정리 53~54",
   "title": "한눈에 정리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-53",
      "light-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 성질 이름과 관찰·예상의 뜻을 문맥에 맞게 써요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈에 보이는 모든 물체가 광원은 아니다. 직진과 반사는 같은 장치에서도 구간별로 나타날 수 있다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빈칸 정리 55~56",
   "title": "경계 정리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-55",
      "light-book-56"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 성질 이름과 관찰·예상의 뜻을 문맥에 맞게 써요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈을 빛의 출발점으로 놓지 않는다. 예상한 대로 결과를 고치지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 57~58",
   "title": "물체 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-57",
      "light-book-58"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체와 눈 사이에서 전달되는 것이 빛임을 확인한다. 경계의 굴절과 같은 상황으로 보지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 59~60",
   "title": "빛이 통과하는 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-59",
      "light-book-60"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "보이지 않으면 전등이 꺼졌다고 단정하지 않는다. 글씨를 아는 뇌의 처리와 빛의 진행 순서를 섞지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 61~62",
   "title": "빛 필요의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-61",
      "light-book-62"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공의 색이나 크기만으로 빛 없이도 보인다고 하지 않는다. 거울이 스스로 빛나는 것으로 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 63~64",
   "title": "세 성질",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-63",
      "light-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "성질 이름만 나열하지 말고 각 상황과 대응한다. 겉모습만으로 실제 파손을 확정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 65~66",
   "title": "실험 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-65",
      "light-book-66"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "바꿀 조건과 같게 할 조건을 뒤바꾸지 않는다. 거울에서 되돌아오는 반사로 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 67~68",
   "title": "거울의 쓰임",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-67",
      "light-book-68"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "확대경과 평면거울의 주된 기능을 구별한다. 관만으로 빛이 저절로 꺾인다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 69~70",
   "title": "렌즈 선택",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-69",
      "light-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "돋보기를 언제 어디서나 쓰면 항상 똑같이 보인다고 단정하지 않는다. 시험 성공을 위해 안전을 생략하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 71",
   "title": "장치 개선",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-71"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "수정 계획을 재시험 성공으로 기록하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 72",
   "title": "물체 보기 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-72"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전등 → 눈만 그린 것은 책을 본 경로가 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 73~74",
   "title": "탐구 기록",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-73",
      "light-book-74"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "표를 채웠다는 사실만으로 실제 관찰 완료가 되지 않는다. 모든 물질 경계에서도 무조건 직진한다는 절대 표현을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 75~76",
   "title": "창의 장치 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-75",
      "light-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "아이디어를 그린 것만으로 제작·성공까지 완료했다고 쓰지 않는다. 다운로드나 저장을 발표·공유 완료로 자동 처리하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "설명 보완 77~78",
   "title": "경로 다시 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-77",
      "light-book-78"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛 경로와 한 조건 비교로 설명을 보완해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈을 광원으로 생각하는 오개념을 재확인한다. 방향 변화만 보고 반사와 굴절을 같은 말로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "설명 보완 79~80",
   "title": "조건 다시 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-79",
      "light-book-80"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛 경로와 한 조건 비교로 설명을 보완해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "결과만 보이면 어떤 방법이든 같은 증거라고 생각하지 않는다. 교사 예시 문장을 실제 자신의 제작 결과처럼 베끼지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 찾아보기",
   "title": "근거를 다시 찾아 보아요",
   "blocks": [
    {
     "type": "heading",
     "text": "원교재와 현행 학습 범위"
    },
    {
     "type": "text",
     "text": "지필드 이론6-1-1 22~26쪽·실험6-A 18~21쪽과24쪽의 빛 관찰·거울/렌즈 장치를 참고했어요. 교육부 2022 개정 과학과 교육과정 [6과02-01~03]의 빛의 필요·직진/반사/굴절·거울과 렌즈의 쓰임 및 장치 만들기를 연결했어요."
    },
    {
     "type": "text",
     "text": "반사·굴절 법칙의 계산, 각도에 따른 거울상 개수, 렌즈의 거리별 상 비교, 햇빛으로 종이 태우기는 필수 활동으로 옮기지 않았어요."
    },
    {
     "type": "heading",
     "text": "사진·설명 그림·문항"
    },
    {
     "type": "text",
     "text": "사진4장과 기존 설명 그림3개는 원교재 이미지예요. 다른 경로 그림도 기존 자료를 보존했어요. 원촬영 장소·시각·배율은 미확인이며 사진을 내가 실제로 한 실험의 기록으로 쓰지 않아요. 80문항은 기존 독립 창작 교재의 발문·자료·답·풀이를 보존한 연습 문제예요."
    },
    {
     "type": "field",
     "title": "다시 볼 개념과 질문",
     "hint": "틀린 문항에서 필요한 근거와 다음 실제 관찰 계획을 정리해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "학생판·교사판·해설·빠른 정답표는 같은80문항을 사용해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옛단원 연계 원문 발췌40문항은 별도 은행에 출처와 함께 보존해요. 현행 단원 전체 시험지를 확보했다는 뜻은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  }
 ],
 "unit": "c22-s51-u02",
 "title": "빛의 성질",
 "semester": "5-1",
 "no": 2,
 "theme": "#2456c4",
 "book": "지필드 실험 과학",
 "questions": [
  {
   "id": "light-book-01",
   "no": 1,
   "status": "authored",
   "form": "choice",
   "topic": "물체 보기",
   "prompt": "빛이 전혀 들어오지 않는 상자 속의 빨간 공을 볼 수 있을까요?",
   "answer": "②",
   "explanation": "공의 색만으로는 볼 수 없다. 외부 빛이 공에서 반사되어 눈에 들어오는 조건이 필요하다.",
   "misconception": "어둠에 익숙해짐과 빛이 전혀 없는 상태를 혼동하지 않는다.",
   "criteria": "빛이 전혀 없다는 조건에서 공의 색만으로 볼 수 없으며 공에서 눈으로 오는 빛이 필요하다는 보기를 고른다.",
   "choices": [
    "공이 빨가므로 볼 수 있다.",
    "공에서 반사된 빛이 눈에 와야 볼 수 있다.",
    "눈이 빛을 내면 보인다.",
    "오래 기다리면 빛 없이 보인다."
   ],
   "key": 1,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-02",
   "no": 2,
   "status": "authored",
   "form": "blank",
   "topic": "성질 구별",
   "prompt": "빛이 거울에 닿아 되돌아 나오는 성질은 [ ]이다.",
   "answer": "반사",
   "explanation": "거울 표면에 닿은 빛의 진행 방향이 달라져 되돌아오는 상황이므로 반사이다.",
   "misconception": "경계에서 다른 물질로 들어가는 굴절과 구별한다.",
   "criteria": "거울에서 되돌아 나오는 문맥의 반사를 인정한다. 굴절과 구별한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-03",
   "no": 3,
   "status": "authored",
   "form": "match",
   "topic": "장치의 기능",
   "prompt": "쓰임과 알맞은 도구의 기호를 연결하세요.",
   "answer": "(1) ㄴ (2) ㄱ",
   "explanation": "얼굴 모습을 비추는 데 거울을, 작은 글자를 관찰하는 데 돋보기를 이용한다.",
   "misconception": "반짝이는 도구가 모두 렌즈인 것은 아니다.",
   "criteria": "두 연결을 각각 확인한다.",
   "given": [
    "ㄱ 돋보기   ㄴ 평면거울"
   ],
   "parts": [
    "(1) 얼굴 모습 보기: [ ]",
    "(2) 작은 글자 관찰하기: [ ]"
   ],
   "previousCriteria": "두 연결을 각각 확인한다.",
   "answerPerPart": true,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-04",
   "no": 4,
   "status": "authored",
   "form": "written",
   "topic": "탐구의 근거",
   "prompt": "“거울을 쓰니 뒤쪽 카드가 보였다.” 무엇을 더 기록하면 친구가 방법을 따라 할 수 있을까요?",
   "answer": "거울·카드·눈의 위치를 그림으로 나타내고 카드가 보인 조건을 기록한다.",
   "explanation": "결과 문장만으로는 배치를 알 수 없다. 위치 관계와 실행 조건이 있어야 방법을 재현해 확인할 수 있다.",
   "misconception": "보였다/안 보였다만으로 실험 방법까지 전해졌다고 생각하지 않는다.",
   "criteria": "배치와 조건 중 한 가지면 일부 이해, 두 요소를 구체적으로 제시하면 충분한 설명. 실제 실험했다고 추정하지 않는다.",
   "lines": 8,
   "previousCriteria": "배치와 조건 중 한 가지면 일부 이해, 두 요소를 구체적으로 제시하면 충분한 설명. 실제 실험했다고 추정하지 않는다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-05",
   "no": 5,
   "status": "authored",
   "form": "blank",
   "topic": "빛의 경로",
   "prompt": "스스로 빛을 내지 않는 책을 볼 때, 전등 → [ ] → 눈의 순서로 빛이 진행한다.",
   "answer": "책",
   "explanation": "전등 빛이 책에 닿고 책에서 반사된 빛이 눈에 들어와 책을 볼 수 있다.",
   "misconception": "눈에서 책으로 빛이 나간다는 생각을 점검한다.",
   "criteria": "빛 경로의 가운데에 책을 넣어 전등→책→눈으로 연결한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-06",
   "no": 6,
   "status": "authored",
   "form": "choice",
   "topic": "광원",
   "prompt": "스스로 빛을 내는 물체를 고르세요.",
   "answer": "③",
   "explanation": "켜진 LED 전등은 스스로 빛을 낸다. 달과 거울, 흰 종이는 다른 곳의 빛을 반사한다.",
   "misconception": "밝게 보임과 스스로 빛을 냄을 구별한다.",
   "criteria": "스스로 빛을 내는 광원을 고르고 다른 빛을 반사해 밝게 보이는 물체와 구별한다.",
   "choices": [
    "달",
    "거울",
    "켜진 LED 전등",
    "흰 종이"
   ],
   "key": 2,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-07",
   "no": 7,
   "status": "authored",
   "form": "choice",
   "topic": "어둠상자 비교",
   "prompt": "같은 상자 속 장난감을 볼 때 조명만 바꾸려 합니다. 알맞은 비교는?",
   "answer": "④",
   "explanation": "빛의 유무를 비교하려면 장난감, 상자, 눈과 관찰 구멍의 위치를 유지하고 조명만 바꾼다.",
   "misconception": "여러 조건을 함께 바꾸면 결과의 까닭을 가리기 어렵다.",
   "criteria": "눈·상자·장난감 위치가 같고 조명만 다른 두 조건을 비교한 보기를 고른다.",
   "choices": [
    "상자와 장난감을 모두 바꾼다.",
    "관찰 구멍을 두 배로 넓힌다.",
    "조명과 눈의 위치를 함께 바꾼다.",
    "같은 위치에서 조명만 켰다 끈다."
   ],
   "key": 3,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-08",
   "no": 8,
   "status": "authored",
   "form": "order",
   "topic": "빛의 경로",
   "prompt": "흰 종이를 보는 빛의 경로를 기호로 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "빛을 내는 전등이 출발이고 종이에서 반사된 빛이 눈에 도착한다. 눈은 이 경로의 출발점이 아니다.",
   "misconception": "문장에 나온 순서를 그대로 답으로 쓰지 않는다.",
   "criteria": "세 위치의 순서가 모두 맞는지 확인한다.",
   "given": [
    "ㄱ 눈에 들어옴   ㄴ 전등에서 나옴   ㄷ 종이에서 반사됨"
   ],
   "previousCriteria": "세 위치의 순서가 모두 맞는지 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-09",
   "no": 9,
   "status": "authored",
   "form": "multi",
   "topic": "물체 보기의 조건",
   "prompt": "스스로 빛을 내지 않는 공을 보기 위한 설명을 모두 고르세요.",
   "answer": "①, ③",
   "explanation": "공에 빛이 닿고 그 빛 중 일부가 눈에 들어와야 공을 볼 수 있다. 눈을 뜬 것만으로 빛이 생기지는 않는다.",
   "misconception": "빛이 공까지만 도달하면 눈의 위치와 무관하게 보인다는 생각을 점검한다.",
   "criteria": "①과 ③을 모두 고르고 다른 보기를 고르지 않았는지 확인한다.",
   "choices": [
    "빛이 공에 닿아야 한다.",
    "눈에서 공 쪽으로 빛을 보내야 한다.",
    "공에서 온 빛이 눈에 들어와야 한다.",
    "공은 반드시 스스로 빛을 내야 한다."
   ],
   "key": [
    0,
    2
   ],
   "previousCriteria": "①과 ③을 모두 고르고 다른 보기를 고르지 않았는지 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-10",
   "no": 10,
   "status": "authored",
   "form": "written",
   "topic": "보임과 어둠",
   "prompt": "빛을 막은 상자에서 장난감이 안 보이다가 조명을 켜니 보였습니다. 까닭을 빛의 경로로 설명하세요.",
   "answer": "조명에서 나온 빛이 장난감에 닿고, 장난감에서 반사된 빛이 눈에 들어왔기 때문이다.",
   "explanation": "장난감과 눈의 위치가 같은 비교에서 달라진 것은 조명이다. 물체를 보려면 물체에서 온 빛이 눈에 들어와야 한다.",
   "misconception": "장난감이 조명처럼 스스로 빛을 냈다고 설명하지 않는다.",
   "criteria": "빛이 장난감에 닿음 1, 반사된 빛이 눈에 들어옴 1의 학습용 기준. “밝아져서”만 쓰면 경로 보완.",
   "previousCriteria": "빛이 장난감에 닿음 1, 반사된 빛이 눈에 들어옴 1의 학습용 기준. “밝아져서”만 쓰면 경로 보완.",
   "lines": 8,
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-11",
   "no": 11,
   "status": "authored",
   "form": "blank",
   "topic": "직진",
   "prompt": "빛이 같은 물질 안에서 곧게 나아가는 성질을 [ ]이라고 한다.",
   "answer": "직진",
   "explanation": "공기처럼 같은 물질 안에서 빛의 경로가 곧게 이어지는 성질을 직진이라 한다.",
   "misconception": "빛이 언제 어디서나 경계도 무시하고 곧게 간다고 확대하지 않는다.",
   "criteria": "같은 물질 안에서 곧게 진행한다는 뜻의 직진을 인정한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-12",
   "no": 12,
   "status": "authored",
   "form": "choice",
   "topic": "구멍의 배열",
   "prompt": "구멍을 뚫은 세 판 너머의 LED 불빛이 잘 보이는 배열은?",
   "answer": "①",
   "explanation": "빛이 곧게 나아갈 수 있도록 세 구멍과 눈을 한 직선 위에 놓으면 통과한 빛이 눈에 들어온다.",
   "misconception": "빛이 구멍을 찾아 굽어 들어간다고 생각하지 않는다.",
   "criteria": "세 구멍과 눈이 한 직선 위에 놓이는 배열을 고르고 직진 경로와 연결한다.",
   "choices": [
    "세 구멍과 눈을 한 직선 위에 놓는다.",
    "가운데 구멍만 옆으로 옮긴다.",
    "세 구멍을 지그재그로 놓는다.",
    "구멍을 모두 판으로 막는다."
   ],
   "key": 0,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-13",
   "no": 13,
   "status": "authored",
   "form": "choice",
   "topic": "그림자의 근거",
   "prompt": "불투명한 카드 뒤에 빛이 닿지 않는 부분이 생긴 까닭은?",
   "answer": "④",
   "explanation": "공기 중에서 곧게 진행하던 빛을 불투명한 카드가 가려 그 뒤에 빛이 직접 닿지 않는 부분이 생긴다.",
   "misconception": "어둠이 카드에서 밖으로 나오는 물질처럼 설명하지 않는다.",
   "criteria": "불투명한 카드가 직진하는 빛의 길을 가린다는 근거를 확인한다.",
   "choices": [
    "카드가 빛을 새로 만들기 때문이다.",
    "카드가 뒤쪽 빛을 끌어당기기 때문이다.",
    "빛이 카드를 돌아서 가기 때문이다.",
    "카드가 곧게 가는 빛을 가렸기 때문이다."
   ],
   "key": 3,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-14",
   "no": 14,
   "status": "authored",
   "form": "short",
   "topic": "직진과 절차",
   "prompt": "세 구멍을 맞추었을 때 불빛이 보였습니다. 가운데 판을 옮긴 뒤에도 비교를 위해 유지할 조건 한 가지를 쓰세요.",
   "answer": "전등 위치 / 눈 위치 / 다른 판의 위치 중 한 가지",
   "explanation": "가운데 판 위치의 영향을 살피므로 다른 판, 전등, 눈 위치 등은 유지해야 한다.",
   "misconception": "모든 판을 다시 움직인 뒤 비교하면 한 조건의 영향을 가리기 어렵다.",
   "criteria": "제시한 조건 중 과학적으로 알맞은 한 가지를 인정한다. 가운데 판을 고정한다는 답은 바꿀 조건과 충돌한다.",
   "previousCriteria": "제시한 조건 중 과학적으로 알맞은 한 가지를 인정한다. 가운데 판을 고정한다는 답은 바꿀 조건과 충돌한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-15",
   "no": 15,
   "status": "authored",
   "form": "match",
   "topic": "상황과 성질",
   "prompt": "직진으로 설명하기 알맞은 것은 ㄱ, 반사로 설명하기 알맞은 것은 ㄴ으로 연결하세요.",
   "answer": "(1) ㄴ (2) ㄱ",
   "explanation": "거울에서 되돌아 나오는 것은 반사이고, 정렬된 구멍을 곧게 통과하는 것은 직진이다.",
   "misconception": "두 현상 모두 빛이 있지만 관찰하는 구간이 다르다.",
   "criteria": "각 부분을 따로 확인한다.",
   "parts": [
    "(1) 거울에서 빛의 방향이 달라짐: [ ]",
    "(2) 한 줄의 구멍을 빛이 통과함: [ ]"
   ],
   "previousCriteria": "각 부분을 따로 확인한다.",
   "answerPerPart": true,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-16",
   "no": 16,
   "status": "authored",
   "form": "written",
   "topic": "관찰과 결론",
   "prompt": "구멍이 일직선일 때만 불빛이 보인 관찰은 빛의 어떤 성질을 뒷받침하나요? 관찰과 성질을 연결하세요.",
   "answer": "어긋난 구멍 쪽으로 빛이 굽어 가지 않고, 일직선일 때 통과했으므로 빛의 직진을 뒷받침한다.",
   "explanation": "같은 공기 속에서 경로를 맞추었는지 비교한 관찰이다. 통과 여부를 직진과 연결하면 된다.",
   "misconception": "관찰 한 번으로 모든 물질 경계에서의 경로까지 같다고 단정하지 않는다.",
   "criteria": "일직선일 때만 통과한 관찰 1, 직진과의 연결 1. 단어만 쓰면 근거를 보완한다.",
   "previousCriteria": "일직선일 때만 통과한 관찰 1, 직진과의 연결 1. 단어만 쓰면 근거를 보완한다.",
   "lines": 8,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-17",
   "no": 17,
   "status": "authored",
   "form": "blank",
   "topic": "반사",
   "prompt": "평면거울에 비친 물체를 볼 때 물체 → [ ] → 눈으로 빛이 진행한다.",
   "answer": "평면거울",
   "explanation": "물체에서 온 빛이 평면거울에 닿아 반사되고 그 빛이 눈에 들어와 모습을 본다.",
   "misconception": "눈에서 거울로 빛을 쏘아 물체를 찾는 경로를 쓰지 않는다.",
   "criteria": "물체와 눈 사이에 평면거울 또는 거울을 넣어 반사 경로를 연결한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-18",
   "no": 18,
   "status": "authored",
   "form": "choice",
   "topic": "거울의 역할",
   "prompt": "벽에 가려 직접 보이지 않는 카드를 거울로 보았습니다. 거울의 역할은?",
   "answer": "②",
   "explanation": "카드에서 온 빛이 거울에서 반사되어 눈에 들어온다. 거울은 실제 카드를 다른 위치로 옮기지 않는다.",
   "misconception": "거울 속 모습과 실제 물체를 구분한다.",
   "criteria": "거울이 카드에서 온 빛의 방향을 바꾸어 눈으로 보내는 역할을 고른다.",
   "choices": [
    "카드와 같은 물체를 새로 만든다.",
    "빛의 진행 방향을 바꾸어 눈으로 보낸다.",
    "눈에서 나간 빛을 카드로 보낸다.",
    "카드가 있는 실제 위치를 옮긴다."
   ],
   "key": 1,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-19",
   "no": 19,
   "status": "authored",
   "form": "order",
   "topic": "반사 경로",
   "prompt": "전등을 비춘 인형을 거울로 보는 경로를 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "전등 빛이 인형에 닿고 인형에서 온 빛이 거울에서 반사된 다음 눈에 도착한다.",
   "misconception": "전등에서 거울로 직접 온 빛만으로 인형 모습을 본다고 설명하지 않는다.",
   "criteria": "네 지점 순서 모두 확인. 같은 뜻의 낱말 순서도 인정한다.",
   "given": [
    "ㄱ 거울   ㄴ 전등   ㄷ 인형   ㄹ 눈"
   ],
   "previousCriteria": "네 지점 순서 모두 확인. 같은 뜻의 낱말 순서도 인정한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-20",
   "no": 20,
   "status": "authored",
   "form": "choice",
   "topic": "거울 실험",
   "prompt": "거울에서 빛이 반사되는 방향을 살필 때 알맞은 방법은?",
   "answer": "③",
   "explanation": "종이 위에서 LED 빛의 경로를 살피면 눈에 직접 비추지 않고 진행 방향을 비교할 수 있다.",
   "misconception": "잘 보려면 강한 빛을 눈으로 봐야 한다는 생각을 점검한다.",
   "criteria": "같은 광원에서 거울에 닿기 전과 반사되어 나간 뒤의 경로를 살피는 방법을 고른다.",
   "choices": [
    "전등을 눈에 직접 비춘다.",
    "거울을 잡고 햇빛을 눈으로 모은다.",
    "교사와 LED 빛을 종이 위에서 관찰한다.",
    "다른 친구의 눈을 반사된 빛으로 찾는다."
   ],
   "key": 2,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-21",
   "no": 21,
   "status": "authored",
   "form": "multi",
   "topic": "반사의 설명",
   "prompt": "평면거울에 대한 설명 중 알맞은 것을 모두 고르세요.",
   "answer": "②, ④",
   "explanation": "평면거울은 다른 곳에서 온 빛을 반사하며, 배치가 맞으면 물체의 모습을 볼 수 있다. 스스로 빛을 내는 광원은 아니다.",
   "misconception": "거울 속 공간에 실제 물체가 하나 더 있다는 생각을 점검한다.",
   "criteria": "②와 ④를 모두 고른다.",
   "choices": [
    "빛이 전혀 없어도 모습을 비춘다.",
    "다른 곳에서 온 빛을 반사한다.",
    "스스로 빛을 내는 광원이다.",
    "물체에서 온 빛을 눈 쪽으로 보낼 수 있다."
   ],
   "key": [
    1,
    3
   ],
   "previousCriteria": "②와 ④를 모두 고른다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-22",
   "no": 22,
   "status": "authored",
   "form": "written",
   "topic": "배치와 관찰",
   "prompt": "거울을 돌리니 같은 카드가 보이지 않게 되었습니다. 카드가 사라진 것일까요? 까닭을 쓰세요.",
   "answer": "카드는 그대로 있다. 거울을 돌려 반사된 빛이 눈에 들어오지 않게 되었을 수 있다.",
   "explanation": "물체와 눈은 그대로인데 거울 방향이 달라졌다. 보이는 경로의 변화로 설명해야 한다.",
   "misconception": "보이지 않음과 물체가 없어짐을 같은 뜻으로 생각하지 않는다.",
   "criteria": "카드 위치 보존 1, 반사 방향/눈에 도달 여부 1. 거울 각도의 정량 법칙은 요구하지 않는다.",
   "previousCriteria": "카드 위치 보존 1, 반사 방향/눈에 도달 여부 1. 거울 각도의 정량 법칙은 요구하지 않는다.",
   "lines": 8,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-23",
   "no": 23,
   "status": "authored",
   "form": "blank",
   "topic": "굴절",
   "prompt": "빛이 공기에서 물로 비스듬히 들어가며 진행 방향이 꺾이는 현상은 [ ]이다.",
   "answer": "굴절",
   "explanation": "서로 다른 물질의 경계에서 빛의 진행 방향이 바뀌어 들어가는 현상으로 굴절에 해당한다.",
   "misconception": "거울에서 되돌아오는 반사와 혼동하지 않는다.",
   "criteria": "다른 물질로 비스듬히 들어가며 꺾이는 문맥의 굴절을 인정한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-24",
   "no": 24,
   "status": "authored",
   "form": "choice",
   "topic": "관찰과 실제",
   "prompt": "물에 비스듬히 꽂은 곧은 막대가 꺾여 보였습니다. 알맞은 설명은?",
   "answer": "④",
   "explanation": "막대 자체는 곧다. 물속 부분에서 온 빛이 공기와의 경계에서 굴절해 눈에 들어오므로 꺾여 보일 수 있다.",
   "misconception": "보이는 모양 변화와 실제 물체 변화가 반드시 같지는 않다.",
   "criteria": "곧은 막대의 실제 모양과 물·공기 경계에서 굴절한 빛에 의한 보임을 구별한다.",
   "choices": [
    "막대가 물에 닿아 실제로 부러졌다.",
    "물이 막대를 두 개로 나누었다.",
    "눈에서 나온 빛이 막대를 구부렸다.",
    "막대에서 온 빛이 물과 공기 경계에서 굴절했다."
   ],
   "key": 3,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-25",
   "no": 25,
   "status": "authored",
   "form": "choice",
   "topic": "동전 비교",
   "prompt": "고정된 눈 위치에서 빈 그릇의 동전이 가장자리에 가려 안 보였습니다. 물을 넣은 뒤 보이는지 비교하려면?",
   "answer": "①",
   "explanation": "물을 넣는 영향만 비교하려면 눈, 동전, 그릇을 유지한다. 눈을 움직이면 가려짐 자체가 달라져 비교가 흐려진다.",
   "misconception": "결과가 잘 나오게 눈을 옮긴 뒤 굴절의 증거라고 기록하지 않는다.",
   "criteria": "눈·그릇·동전 위치를 고정하고 물 유무만 바꾸는 방법을 고른다.",
   "choices": [
    "눈과 동전 위치를 그대로 둔다.",
    "물을 넣으면서 눈을 위로 옮긴다.",
    "동전을 그릇 밖으로 꺼낸다.",
    "동전과 그릇을 함께 들어 올린다."
   ],
   "key": 0,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-26",
   "no": 26,
   "status": "authored",
   "form": "match",
   "topic": "경계의 현상",
   "prompt": "반사는 ㄱ, 굴절은 ㄴ으로 연결하세요.",
   "answer": "(1) ㄴ (2) ㄱ",
   "explanation": "유리에서 공기로 비스듬히 나가면서 꺾여 진행하는 것은 굴절, 거울에서 되돌아 나오는 것은 반사이다.",
   "misconception": "진행 방향이 변했다는 말 하나로 두 현상을 같게 취급하지 않는다.",
   "criteria": "각 상황이 되돌아옴인지 다른 물질로 들어감인지 확인한다.",
   "parts": [
    "(1) 유리에서 공기로 비스듬히 나가며 꺾임: [ ]",
    "(2) 거울 표면에서 되돌아 나옴: [ ]"
   ],
   "previousCriteria": "각 상황이 되돌아옴인지 다른 물질로 들어감인지 확인한다.",
   "answerPerPart": true,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-27",
   "no": 27,
   "status": "authored",
   "form": "short",
   "topic": "굴절 관찰",
   "prompt": "막대가 실제로 휘었는지, 그렇게 보이기만 한 것인지 확인할 방법을 쓰세요.",
   "answer": "막대를 꺼내 곧은지 살핀 뒤 다시 같은 조건으로 물에 넣어 비교한다.",
   "explanation": "꺼낸 실제 막대의 형태와 물속에서 보이는 모습을 비교하면 실제 변화인지 구별하는 근거가 된다.",
   "misconception": "사진 한 장의 겉모습만으로 실제 변형을 단정하지 않는다.",
   "criteria": "실제 막대의 형태를 확인하는 타당한 방법을 인정한다.",
   "previousCriteria": "실제 막대의 형태를 확인하는 타당한 방법을 인정한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-28",
   "no": 28,
   "status": "authored",
   "form": "written",
   "topic": "굴절의 조건",
   "prompt": "“빛은 물에 들어가면 언제나 꺾인다.”라는 말을 고치고, 관찰해야 할 조건을 쓰세요.",
   "answer": "빛이 공기에서 물로 비스듬히 들어갈 때 경계에서 꺾일 수 있다. 경계에 들어가는 방향을 확인해야 한다.",
   "explanation": "수직으로 경계를 통과하는 빛은 진행 방향이 꺾이지 않는다. 따라서 모든 입사 방향으로 확대하면 틀린 설명이다.",
   "misconception": "물과 공기가 다르면 반드시 눈에 띄게 꺾인다는 절대 표현을 점검한다.",
   "criteria": "비스듬히 들어가는 조건 1, 수직일 때 방향이 꺾이지 않음 또는 관찰 방향 확인 1. 굴절률·법칙은 요구하지 않는다.",
   "previousCriteria": "비스듬히 들어가는 조건 1, 수직일 때 방향이 꺾이지 않음 또는 관찰 방향 확인 1. 굴절률·법칙은 요구하지 않는다.",
   "lines": 8,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-29",
   "no": 29,
   "status": "authored",
   "form": "choice",
   "topic": "생활 속 거울",
   "prompt": "가게의 가려진 모퉁이를 살피는 거울의 주된 쓰임은?",
   "answer": "②",
   "explanation": "가려져 직접 보기 어려운 방향에서 온 빛을 거울로 반사시켜 볼 수 있게 한다.",
   "misconception": "거울을 사용하면 가려진 모든 곳이 무조건 보인다고 단정하지 않는다.",
   "criteria": "가려진 모퉁이의 상황을 보도록 돕는 목적을 고른다. 거울이 물체를 실제로 옮긴다는 설명과 구별한다.",
   "choices": [
    "빛을 내어 물건을 데운다.",
    "직접 보기 어려운 쪽의 모습을 본다.",
    "작은 물체의 실제 크기를 키운다.",
    "물체를 다른 곳으로 옮긴다."
   ],
   "key": 1,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-30",
   "no": 30,
   "status": "authored",
   "form": "blank",
   "topic": "잠망경",
   "prompt": "잠망경에서 물체의 빛은 위 거울과 아래 거울에서 차례로 [ ]되어 눈에 들어온다.",
   "answer": "반사",
   "explanation": "두 거울이 각각 빛의 방향을 바꾸어 위쪽 물체에서 온 빛을 아래쪽 눈으로 보낸다.",
   "misconception": "속이 빈 관만 있으면 빛이 관을 따라 저절로 굽는다고 생각하지 않는다.",
   "criteria": "두 거울에서 일어나는 반사를 인정한다. 굴절로 바꾸지 않는다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-31",
   "no": 31,
   "status": "authored",
   "form": "order",
   "topic": "장치의 경로",
   "prompt": "두 거울 잠망경에서 물체에서 나온 빛의 경로를 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ → ㄹ",
   "explanation": "위쪽 물체에서 온 빛이 위 거울과 아래 거울을 거쳐 눈에 도착한다. 각 거울에서 반사가 일어난다.",
   "misconception": "거울 순서를 바꾸어도 같은 배치에서 항상 보인다고 생각하지 않는다.",
   "criteria": "물체·위 거울·아래 거울·눈 순서 확인.",
   "given": [
    "ㄱ 위 거울   ㄴ 아래 거울   ㄷ 물체   ㄹ 눈"
   ],
   "previousCriteria": "물체·위 거울·아래 거울·눈 순서 확인.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-32",
   "no": 32,
   "status": "authored",
   "form": "choice",
   "topic": "장치 시험",
   "prompt": "잠망경으로 카드가 안 보일 때 먼저 해 볼 점검은?",
   "answer": "③",
   "explanation": "거울이 빛을 다음 거울과 눈 쪽으로 보내는 배치인지 살핀다. 안 보인 결과도 그대로 남기고 한 부분씩 수정한다.",
   "misconception": "관 길이만이 실패 원인이라고 단정하지 않는다.",
   "criteria": "거울 방향·고정·관찰 구멍과 빛 경로의 연결을 먼저 확인하는 보기를 고른다.",
   "choices": [
    "관의 길이만 늘리면 보인다고 판단한다.",
    "거울 대신 관의 겉면 색만 바꾸어 본다.",
    "거울 방향과 관찰 구멍의 배치를 살핀다.",
    "눈과 카드를 함께 옮겨 원인을 찾는다."
   ],
   "key": 2,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-33",
   "no": 33,
   "status": "authored",
   "form": "match",
   "topic": "도구와 목적",
   "prompt": "도구와 주된 목적을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "세면대 거울은 얼굴 모습을, 자동차 거울은 뒤쪽 상황을, 잠망경은 장애물 너머의 모습을 살피도록 배치한다.",
   "misconception": "거울이 쓰였다는 공통점과 쓰임의 차이를 함께 살핀다.",
   "criteria": "세 연결을 각각 확인한다.",
   "given": [
    "ㄱ 장애물 너머 살피기   ㄴ 얼굴 모습 보기   ㄷ 뒤쪽 상황 살피기"
   ],
   "parts": [
    "(1) 세면대 거울: [ ]",
    "(2) 자동차 뒤쪽 거울: [ ]",
    "(3) 잠망경: [ ]"
   ],
   "previousCriteria": "세 연결을 각각 확인한다.",
   "answerPerPart": true,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-34",
   "no": 34,
   "status": "authored",
   "form": "written",
   "topic": "쓰임 설명",
   "prompt": "책상 위 가림판 뒤 카드를 보려는 장치를 만들었습니다. “거울을 썼다”보다 자세한 설명을 쓰세요.",
   "answer": "카드에서 온 빛을 거울에서 반사시켜 가림판 옆의 내 눈으로 보내도록 거울을 배치했다.",
   "explanation": "도구 이름만으로는 쓰임이 설명되지 않는다. 해결할 문제와 빛의 경로를 연결해야 한다.",
   "misconception": "거울 종류를 외우는 것만으로 장치 설명이 완성되었다고 생각하지 않는다.",
   "criteria": "가려진 카드 보기라는 목적 1, 거울의 반사와 눈에 도달하는 경로 1. 다른 타당한 배치도 인정한다.",
   "previousCriteria": "가려진 카드 보기라는 목적 1, 거울의 반사와 눈에 도달하는 경로 1. 다른 타당한 배치도 인정한다.",
   "lines": 8,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-35",
   "no": 35,
   "status": "authored",
   "form": "blank",
   "topic": "렌즈 모양",
   "prompt": "가장자리보다 가운데가 두꺼운 렌즈를 [ ] 렌즈라고 한다.",
   "answer": "볼록",
   "explanation": "가운데와 가장자리의 상대적인 두께로 볼록 렌즈의 형태를 구별한다.",
   "misconception": "전체 렌즈의 지름이나 색만으로 종류를 판단하지 않는다.",
   "criteria": "뒤의 렌즈와 이어 볼록 렌즈가 되도록 볼록을 넣는다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-36",
   "no": 36,
   "status": "authored",
   "form": "choice",
   "topic": "조사와 자료",
   "prompt": "돋보기의 쓰임을 조사한 기록으로 가장 알맞은 것은?",
   "answer": "①",
   "explanation": "실제로 무엇을 관찰했고 어떤 도움이 있었는지 쓰면 렌즈의 쓰임을 근거와 연결할 수 있다.",
   "misconception": "조사 자료·친구 경험과 자신의 직접 관찰을 섞지 않는다.",
   "criteria": "관찰 대상과 돋보기의 구체적인 도움을 함께 적은 기록을 고른다.",
   "choices": [
    "돋보기로 확대해 관찰한 대상과 도움을 함께 적었다.",
    "둥글어서 모든 상황에서 똑같이 보인다고 적었다.",
    "친구가 써 보았으므로 내가 관찰했다고 적었다.",
    "자료를 저장했으므로 발표했다고 적었다."
   ],
   "key": 0,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-37",
   "no": 37,
   "status": "authored",
   "form": "choice",
   "topic": "렌즈 안전",
   "prompt": "돋보기로 작은 글자를 관찰할 때 지킬 행동은?",
   "answer": "③",
   "explanation": "실내 조명 아래에서 글자를 관찰한다. 태양을 직접 보거나 햇빛을 눈에 모으는 행동은 하지 않는다.",
   "misconception": "빛을 세게 모을수록 좋은 관찰이라는 생각을 점검한다.",
   "criteria": "실내 조명 아래의 종이 관찰을 고른다. 태양 직접 보기·햇빛 모으기는 인정하지 않는다.",
   "choices": [
    "렌즈로 햇빛을 친구 눈에 모은다.",
    "렌즈로 태양을 직접 바라본다.",
    "실내 조명 아래에서 종이 글자를 본다.",
    "햇빛을 모아 종이를 태운다."
   ],
   "key": 2,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-38",
   "no": 38,
   "status": "authored",
   "form": "short",
   "topic": "필요와 도구",
   "prompt": "“작은 씨앗의 겉모습을 더 자세히 보자.”에 알맞은 도구와 이유를 쓰세요.",
   "answer": "돋보기. 작은 씨앗의 겉모습을 확대해 관찰하는 데 도움을 준다.",
   "explanation": "해결할 필요가 작은 부분 관찰이므로 렌즈를 이용한 돋보기를 고르고 도움을 설명한다.",
   "misconception": "평면거울을 쓰면 항상 확대된다는 생각을 점검한다.",
   "criteria": "돋보기와 구체적 관찰 목적을 함께 확인한다. 거리별 상의 변화는 요구하지 않는다.",
   "previousCriteria": "돋보기와 구체적 관찰 목적을 함께 확인한다. 거리별 상의 변화는 요구하지 않는다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-39",
   "no": 39,
   "status": "authored",
   "form": "multi",
   "topic": "계획과 실제",
   "prompt": "장치 만들기의 기록으로 알맞은 것을 모두 고르세요.",
   "answer": "①, ④",
   "explanation": "설계에서 예상한 경로와 실제 시험 결과를 구분한다. 실패와 다음 수정 계획도 유용한 근거다.",
   "misconception": "예상한 결과를 실제 성공으로 옮겨 적지 않는다.",
   "criteria": "①·④를 모두 고른다.",
   "choices": [
    "예상한 빛의 경로를 그림으로 표시했다.",
    "제작하지 않았지만 성공했다고 썼다.",
    "보이지 않은 결과를 보였다고 바꿨다.",
    "실패한 배치와 수정할 부분을 남겼다."
   ],
   "key": [
    0,
    3
   ],
   "previousCriteria": "①·④를 모두 고른다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-40",
   "no": 40,
   "status": "authored",
   "form": "written",
   "topic": "창의 장치의 조건",
   "prompt": "장치의 재료를 고르기 전에 확인할 두 가지를 쓰세요.",
   "answer": "해결할 문제(무엇을 어디에서 볼지)와 안전하게 시험할 방법을 확인한다.",
   "explanation": "목적에 따라 거울이나 렌즈를 고른다. 강한 빛, 날카로운 재료를 피하고 실제 확인 가능한 시험을 계획한다.",
   "misconception": "재료를 많이 넣으면 목적과 관계없이 좋은 장치라고 생각하지 않는다.",
   "criteria": "목적/관찰 대상 1, 안전·시험 가능성 중 구체적인 한 가지 1. 다양한 장치 아이디어를 인정한다.",
   "previousCriteria": "목적/관찰 대상 1, 안전·시험 가능성 중 구체적인 한 가지 1. 다양한 장치 아이디어를 인정한다.",
   "lines": 8,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-41",
   "no": 41,
   "status": "authored",
   "form": "short",
   "topic": "반복 관찰 자료",
   "prompt": "같은 상자로 연습 자료를 얻었습니다. 빛이 필요하다는 설명을 뒷받침하는 두 조건의 결과를 쓰세요.",
   "answer": "조명 꺼짐: 세 번 모두 안 보임 / 조명 켜짐: 세 번 모두 보임",
   "explanation": "같은 상자·물체·눈 위치에서 조명 조건별 결과가 반복되어 다르다. 자료는 빛 유무와 보임의 관련을 뒷받침한다.",
   "misconception": "연습 자료를 학생이 실제 측정한 기록으로 쓰지 않는다.",
   "criteria": "두 조건을 결과와 짝지어 쓰면 인정. 실제 수행 여부는 별도로 확인한다.",
   "given": [
    "연습 자료 · 실측 기록 아님",
    "조명 꺼짐: 안 보임 / 안 보임 / 안 보임",
    "조명 켜짐: 보임 / 보임 / 보임"
   ],
   "previousCriteria": "두 조건을 결과와 짝지어 쓰면 인정. 실제 수행 여부는 별도로 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-42",
   "no": 42,
   "status": "authored",
   "form": "choice",
   "topic": "비교의 한계",
   "prompt": "A는 조명을 켜고 눈을 옮겼고, B는 조명을 끄고 처음 눈 위치에서 보았습니다. 설명으로 알맞은 것은?",
   "answer": "②",
   "explanation": "조명과 눈 위치가 동시에 달랐으므로 보임의 차이를 조명만의 영향으로 가리기 어렵다. 눈 위치를 같게 해 다시 비교한다.",
   "misconception": "결과가 기대와 같으면 절차의 차이는 무시해도 된다는 생각을 점검한다.",
   "criteria": "조명과 눈 위치가 함께 바뀌어 조명 하나의 영향으로 정할 수 없다는 한계를 확인한다.",
   "choices": [
    "밝기만 비교한 공정한 실험이다.",
    "두 조건이 달라 빛 유무만의 영향으로 단정하기 어렵다.",
    "눈 위치는 보임과 관계없다.",
    "결과가 다르면 언제나 조명이 원인이다."
   ],
   "key": 1,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-43",
   "no": 43,
   "status": "authored",
   "form": "blank",
   "topic": "관찰과 추리",
   "prompt": "“물속 막대가 꺾여 보였다”는 [ ]이고, “경계에서 빛이 굴절했기 때문이다”는 그 까닭에 대한 설명이다.",
   "answer": "관찰",
   "explanation": "눈으로 확인한 보이는 모습을 기록한 문장과, 성질을 이용해 까닭을 설명하는 문장은 역할이 다르다.",
   "misconception": "관찰 기록 속에 이미 실제 변형이 확정되었다고 넣지 않는다.",
   "criteria": "보이는 사실을 나타내는 관찰을 인정한다. 까닭의 설명과 구별한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-44",
   "no": 44,
   "status": "authored",
   "form": "written",
   "topic": "오차와 재확인",
   "prompt": "동전 실험 중 눈을 움직였다는 것을 뒤늦게 알았습니다. 기록을 어떻게 보완할까요?",
   "answer": "눈을 움직였음을 남기고, 눈·그릇·동전 위치를 고정한 뒤 물 넣기 전후를 다시 비교한다.",
   "explanation": "불리한 조건도 기록해야 자료의 한계를 알 수 있다. 한 번의 성공으로 절차 차이를 감추지 말고 조건을 맞춰 재확인한다.",
   "misconception": "결과를 지워 실패가 없었던 것처럼 만들지 않는다.",
   "criteria": "문제 조건 기록 1, 눈 위치 고정한 재비교 1. 수정 전 기록 보존도 확인한다.",
   "previousCriteria": "문제 조건 기록 1, 눈 위치 고정한 재비교 1. 수정 전 기록 보존도 확인한다.",
   "lines": 8,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-45",
   "no": 45,
   "status": "authored",
   "form": "draw",
   "topic": "반사 경로 그리기",
   "prompt": "출발한 빛이 거울에 닿은 뒤 나아갈 경로를 화살표로 이어 그리고, 거울을 표시하세요.",
   "answer": "이 그림에서는 거울에 닿은 지점에서 위쪽으로 나아가는 화살표를 그린다.",
   "explanation": "그림의 거울은 왼쪽에서 온 빛을 위쪽으로 반사하는 배치이다. 화살표는 거울에서 시작하는 이어진 경로가 되어야 한다.",
   "misconception": "거울을 그대로 뚫거나 관의 벽을 따라 도는 빛으로 그리지 않는다.",
   "criteria": "거울에서 이어짐 1, 위쪽 진행 화살표 1. 각도값·정확한 작도는 요구하지 않고 교사가 그림을 본다.",
   "figure": "mirrorTask",
   "previousCriteria": "거울에서 이어짐 1, 위쪽 진행 화살표 1. 각도값·정확한 작도는 요구하지 않고 교사가 그림을 본다.",
   "drawing": "large",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-46",
   "no": 46,
   "status": "authored",
   "form": "order",
   "topic": "경로 설명",
   "prompt": "거울 두 개로 가려진 물체를 보는 과정을 배열하세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "물체에서 온 빛이 첫째 거울과 둘째 거울에서 각각 반사되어 눈에 도달한다.",
   "misconception": "두 번 반사되면 빛이 반드시 사라진다고 생각하지 않는다.",
   "criteria": "네 단계의 순서를 확인한다.",
   "given": [
    "ㄱ 둘째 거울에서 반사   ㄴ 물체에서 빛이 옴",
    "ㄷ 눈에 들어옴   ㄹ 첫째 거울에서 반사"
   ],
   "previousCriteria": "네 단계의 순서를 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-47",
   "no": 47,
   "status": "authored",
   "form": "short",
   "topic": "그림 설명",
   "prompt": "경로 그림에서 화살표를 표시하는 까닭은 무엇인가요?",
   "answer": "빛이 어느 쪽에서 어느 쪽으로 진행하는지 구별하기 위해서이다.",
   "explanation": "선만 있으면 방향을 알기 어렵다. 화살표는 물체·거울·눈의 순서를 설명하는 데 필요하다.",
   "misconception": "화살표가 빛의 세기나 물체의 이동 방향을 뜻한다고 혼동하지 않는다.",
   "criteria": "빛의 진행 방향을 나타낸다는 뜻이면 인정한다.",
   "previousCriteria": "빛의 진행 방향을 나타낸다는 뜻이면 인정한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-48",
   "no": 48,
   "status": "authored",
   "form": "written",
   "topic": "경로의 일관성",
   "prompt": "친구는 전등 → 눈 → 책으로 경로를 그렸습니다. 책을 보는 상황에 맞게 고치고 까닭을 쓰세요.",
   "answer": "전등 → 책 → 눈. 책에서 반사된 빛이 눈에 들어와야 책을 볼 수 있기 때문이다.",
   "explanation": "전등 빛이 눈에 직접 들어오는 것은 책의 모습을 보는 경로와 다르다. 책을 거쳐 온 빛이 필요하다.",
   "misconception": "눈이 받은 빛을 다시 책으로 쏘아 보게 된다는 생각을 점검한다.",
   "criteria": "경로 순서 1, 책에서 반사된 빛이 눈에 들어옴 1.",
   "previousCriteria": "경로 순서 1, 책에서 반사된 빛이 눈에 들어옴 1.",
   "lines": 8,
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-49",
   "no": 49,
   "status": "authored",
   "form": "written",
   "topic": "근거 있는 반박",
   "prompt": "“밤에 달이 밝으니 달은 스스로 빛을 낸다.”라는 말에 답하세요.",
   "answer": "밝게 보인다고 모두 광원은 아니다. 달은 햇빛을 반사해 밝게 보인다.",
   "explanation": "광원 여부는 밝기의 크기가 아니라 스스로 빛을 내는지로 판단한다. 달은 반사된 햇빛이 눈에 들어와 보인다.",
   "misconception": "밝음=광원이라는 오개념을 바로잡는다.",
   "criteria": "스스로 빛 냄의 기준 1, 달은 햇빛 반사 1.",
   "previousCriteria": "스스로 빛 냄의 기준 1, 달은 햇빛 반사 1.",
   "lines": 8,
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-50",
   "no": 50,
   "status": "authored",
   "form": "written",
   "topic": "증거의 범위",
   "prompt": "실내에서 평면거울 하나로 카드 글씨를 보았습니다. 이 결과만으로 “모든 거울 장치는 잘 작동한다”고 말해도 될까요?",
   "answer": "안 된다. 시험한 거울과 배치에서 카드가 보인 것만 확인했으며 다른 배치와 장치는 따로 시험해야 한다.",
   "explanation": "관찰은 정한 조건에서의 결과이다. 시험하지 않은 장치까지 한 번에 성공으로 일반화할 수 없다.",
   "misconception": "한 장치의 성공과 모든 장치의 검증을 혼동하지 않는다.",
   "criteria": "실험 범위 지적 1, 다른 배치/장치 재시험 필요 1.",
   "previousCriteria": "실험 범위 지적 1, 다른 배치/장치 재시험 필요 1.",
   "lines": 8,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-51",
   "no": 51,
   "status": "authored",
   "form": "written",
   "topic": "렌즈 쓰임의 조사",
   "prompt": "자료에는 “확대경으로 작은 부품을 살핀다”고 적혀 있습니다. 이 자료로 알 수 있는 것과 아직 확인하지 못한 것을 하나씩 쓰세요.",
   "answer": "알 수 있음: 작은 부품 관찰에 확대경을 이용함. 미확인: 내가 고른 확대경으로 실제 부품이 얼마나 잘 보이는지.",
   "explanation": "자료는 도구의 용례를 제공한다. 학생의 실제 렌즈·대상·조건에 대한 관찰은 별도로 필요하다.",
   "misconception": "자료 속 사용 사례를 자신의 실험 결과로 바꾸지 않는다.",
   "criteria": "자료로 확인 가능한 쓰임 1, 직접 시험 전의 미확인 사항 1. 수치 확대율은 요구하지 않는다.",
   "previousCriteria": "자료로 확인 가능한 쓰임 1, 직접 시험 전의 미확인 사항 1. 수치 확대율은 요구하지 않는다.",
   "lines": 8,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-52",
   "no": 52,
   "status": "authored",
   "form": "written",
   "topic": "의견 반영",
   "prompt": "친구가 “어디에 눈을 대는지 모르겠어”라고 했습니다. 장치 설명을 어떻게 고칠까요?",
   "answer": "관찰 구멍에 눈 위치 표시를 넣고, 물체에서 눈까지 빛이 진행하는 경로를 화살표로 덧붙인다.",
   "explanation": "친구 질문은 사용자가 빠진 정보를 알려 준다. 설명 그림과 사용 순서에서 그 정보를 보완하고 다시 확인받는다.",
   "misconception": "예쁘게 색칠하는 것만으로 사용법 질문이 해결되었다고 생각하지 않는다.",
   "criteria": "눈 위치 표시 1, 경로/사용 순서 보완 1. 실제 재확인 여부는 기록으로 별도 확인한다.",
   "previousCriteria": "눈 위치 표시 1, 경로/사용 순서 보완 1. 실제 재확인 여부는 기록으로 별도 확인한다.",
   "lines": 8,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-53",
   "no": 53,
   "status": "authored",
   "form": "blank",
   "topic": "한눈에 정리",
   "prompt": "스스로 빛을 내는 물체를 [ ]이라 하고, 책은 빛을 [ ]하여 보인다.",
   "answer": "광원 / 반사",
   "explanation": "전등 같은 광원은 스스로 빛을 내고 책은 다른 곳의 빛을 반사한다.",
   "misconception": "눈에 보이는 모든 물체가 광원은 아니다.",
   "criteria": "광원과 반사를 각각 맞는 빈칸에 넣었는지 따로 확인한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-54",
   "no": 54,
   "status": "authored",
   "form": "blank",
   "topic": "세 성질 정리",
   "prompt": "같은 물질 안에서 곧게 진행: [ ] / 거울에서 되돌아 진행: [ ]",
   "answer": "직진 / 반사",
   "explanation": "각 현상에서 관찰하는 구간과 방향을 구분하면 직진과 반사를 나눌 수 있다.",
   "misconception": "직진과 반사는 같은 장치에서도 구간별로 나타날 수 있다.",
   "criteria": "직진과 반사를 제시한 두 상황의 순서에 맞게 각각 쓴다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-55",
   "no": 55,
   "status": "authored",
   "form": "blank",
   "topic": "경계 정리",
   "prompt": "공기와 물의 경계에 비스듬히 들어갈 때 꺾임: [ ] / 물체 보기의 빛 경로가 마지막에 도달하는 곳: [ ]",
   "answer": "굴절 / 눈",
   "explanation": "물질 경계에서 방향이 달라지는 굴절과, 물체에서 온 빛을 받는 눈을 연결해 정리한다.",
   "misconception": "눈을 빛의 출발점으로 놓지 않는다.",
   "criteria": "굴절과 눈을 각각 확인한다. 성질 이름과 빛이 도착하는 곳을 구별한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-56",
   "no": 56,
   "status": "authored",
   "form": "blank",
   "topic": "탐구 정리",
   "prompt": "예상은 실험 [ ]에 쓰고, 결과는 실제 관찰한 [ ]를 바탕으로 쓴다.",
   "answer": "전 / 사실(내용)",
   "explanation": "실험 전 예상과 실험 후 확인한 사실을 분리해야 예상과 달랐을 때도 근거를 보존할 수 있다.",
   "misconception": "예상한 대로 결과를 고치지 않는다.",
   "criteria": "전과 사실 또는 내용을 인정한다. 예상과 관찰 결과의 시점을 구별한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-57",
   "no": 57,
   "status": "authored",
   "form": "choice",
   "topic": "물체 보기",
   "prompt": "빛을 내지 않는 나무 모형을 볼 수 있는 까닭으로 옳은 것은?",
   "answer": "②",
   "explanation": "나무 모형은 외부 빛을 반사하며 그 빛이 눈에 들어올 때 보인다.",
   "misconception": "물체와 눈 사이에서 전달되는 것이 빛임을 확인한다.",
   "criteria": "나무 모형에서 반사된 빛이 눈에 들어옴을 고른다. 눈이 빛을 내보내는 설명과 구별한다.",
   "choices": [
    "눈이 모형으로 빛을 보낸다.",
    "모형에서 반사된 빛이 눈에 들어온다.",
    "모형은 언제나 스스로 빛을 낸다.",
    "모형의 색만 알면 빛 없이도 보인다."
   ],
   "key": 1,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-58",
   "no": 58,
   "status": "authored",
   "form": "blank",
   "topic": "직진의 말",
   "prompt": "빛이 공기 중에서 곧게 나아가는 성질은 [ ]이다.",
   "answer": "직진",
   "explanation": "한 물질 안에서 관찰한 곧은 진행이므로 직진이다.",
   "misconception": "경계의 굴절과 같은 상황으로 보지 않는다.",
   "criteria": "공기 속에서 곧게 진행하는 직진을 인정한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-59",
   "no": 59,
   "status": "authored",
   "form": "choice",
   "topic": "빛이 통과하는 조건",
   "prompt": "세 구멍과 눈이 일직선일 때 LED 불빛이 보였습니다. 가운데 판만 옆으로 옮기면?",
   "answer": "③",
   "explanation": "불투명한 판이 곧게 진행하는 빛을 가리므로 같은 위치에서는 불빛이 안 보일 수 있다.",
   "misconception": "보이지 않으면 전등이 꺼졌다고 단정하지 않는다.",
   "criteria": "같은 광원·다른 판·눈 위치에서 가운데 판이 직진 경로를 가리는 보기를 고른다.",
   "choices": [
    "빛이 판을 피해 굽어 간다.",
    "판이 광원이 되어 빛난다.",
    "같은 눈 위치에서 불빛이 안 보일 수 있다.",
    "빛이 더 강해져 반드시 보인다."
   ],
   "key": 2,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-60",
   "no": 60,
   "status": "authored",
   "form": "order",
   "topic": "물체와 눈",
   "prompt": "종이에 비친 글씨를 눈으로 볼 때 빛의 경로를 배열하세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "전등 빛이 글씨가 있는 종이에 닿고 반사된 빛이 눈에 들어온다.",
   "misconception": "글씨를 아는 뇌의 처리와 빛의 진행 순서를 섞지 않는다.",
   "criteria": "빛의 실제 이동 순서 확인.",
   "given": [
    "ㄱ 종이   ㄴ 눈   ㄷ 전등"
   ],
   "previousCriteria": "빛의 실제 이동 순서 확인.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-61",
   "no": 61,
   "status": "authored",
   "form": "written",
   "topic": "빛 필요의 근거",
   "prompt": "빛을 완전히 막은 상자 속 공이 보이지 않는 까닭을 눈에 들어오는 빛과 연결해 쓰세요.",
   "answer": "공에 빛이 닿지 않아 공에서 반사되어 눈으로 들어오는 빛이 없기 때문이다.",
   "explanation": "빛을 내지 않는 공을 보려면 외부 빛이 공에서 반사되어 눈에 와야 한다. 완전히 막힌 조건에서는 그 경로가 없다.",
   "misconception": "공의 색이나 크기만으로 빛 없이도 보인다고 하지 않는다.",
   "criteria": "외부 빛 차단 1, 공에서 눈으로 오는 반사된 빛 없음 1.",
   "previousCriteria": "외부 빛 차단 1, 공에서 눈으로 오는 반사된 빛 없음 1.",
   "lines": 8,
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-62",
   "no": 62,
   "status": "authored",
   "form": "choice",
   "topic": "거울의 기능",
   "prompt": "평면거울이 물체의 모습을 볼 수 있게 하는 주된 성질은?",
   "answer": "①",
   "explanation": "물체에서 온 빛이 거울에서 반사되어 눈에 들어온다.",
   "misconception": "거울이 스스로 빛나는 것으로 설명하지 않는다.",
   "criteria": "물체의 빛이 거울에서 반사되어 눈에 들어오는 성질을 고른다.",
   "choices": [
    "빛을 반사한다.",
    "스스로 빛을 낸다.",
    "물체를 복제한다.",
    "눈에서 빛을 꺼낸다."
   ],
   "key": 0,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-63",
   "no": 63,
   "status": "authored",
   "form": "match",
   "topic": "세 성질",
   "prompt": "상황에 알맞은 성질의 기호를 연결하세요.",
   "answer": "(1) ㄷ (2) ㄴ (3) ㄱ",
   "explanation": "공기 중 곧은 진행은 직진, 거울에서 되돌아오는 진행은 반사, 다른 물질로 비스듬히 들어가며 꺾임은 굴절이다.",
   "misconception": "성질 이름만 나열하지 말고 각 상황과 대응한다.",
   "criteria": "세 대응을 각각 확인한다.",
   "given": [
    "ㄱ 굴절   ㄴ 반사   ㄷ 직진"
   ],
   "parts": [
    "(1) 공기 중에서 곧게 나아감: [ ]",
    "(2) 거울에서 되돌아 나옴: [ ]",
    "(3) 공기에서 물로 비스듬히 들어가며 꺾임: [ ]"
   ],
   "previousCriteria": "세 대응을 각각 확인한다.",
   "answerPerPart": true,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-64",
   "no": 64,
   "status": "authored",
   "form": "choice",
   "topic": "실제와 보임",
   "prompt": "물속 곧은 막대가 꺾여 보일 때 확인할 내용으로 알맞은 것은?",
   "answer": "④",
   "explanation": "실제 형태와 보이는 모습을 나누고, 물과 공기 경계를 지나는 빛의 굴절을 살핀다.",
   "misconception": "겉모습만으로 실제 파손을 확정하지 않는다.",
   "criteria": "실제 막대 모양과 경계에서 눈으로 오는 빛의 경로를 확인하는 보기를 고른다.",
   "choices": [
    "막대가 실제로 부러졌다고 바로 정한다.",
    "눈에서 빛이 나왔다고 정한다.",
    "막대가 물에 녹았다고 정한다.",
    "실제 형태와 경계의 빛 경로를 나누어 살핀다."
   ],
   "key": 3,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-65",
   "no": 65,
   "status": "authored",
   "form": "multi",
   "topic": "실험 조건",
   "prompt": "물 넣기 전후 동전이 보이는지 비교할 때 같게 할 것을 모두 고르세요.",
   "answer": "②, ③",
   "explanation": "물의 유무를 비교하려면 눈과 동전·그릇의 위치를 유지해야 한다. 물은 바꿀 조건이다.",
   "misconception": "바꿀 조건과 같게 할 조건을 뒤바꾸지 않는다.",
   "criteria": "②·③만 고르면 충분. 물의 양을 같게 한다는 답은 물 유무 비교와 충돌한다.",
   "choices": [
    "물의 유무",
    "눈의 위치",
    "동전과 그릇의 위치",
    "보일 때까지 움직인 거리"
   ],
   "key": [
    1,
    2
   ],
   "previousCriteria": "②·③만 고르면 충분. 물의 양을 같게 한다는 답은 물 유무 비교와 충돌한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-66",
   "no": 66,
   "status": "authored",
   "form": "written",
   "topic": "조건 있는 설명",
   "prompt": "공기에서 물로 비스듬히 들어간 빛의 방향이 경계에서 달라졌습니다. 관찰과 성질 이름을 함께 쓰세요.",
   "answer": "공기와 물의 경계에서 빛의 진행 방향이 꺾였으며, 이를 굴절이라고 한다.",
   "explanation": "경계를 지나 다른 물질로 들어가는 관찰과 방향 변화가 주어져 있으므로 굴절로 설명한다.",
   "misconception": "거울에서 되돌아오는 반사로 설명하지 않는다.",
   "criteria": "경계에서 꺾인 관찰 1, 굴절 1. 정량 각도는 요구하지 않는다.",
   "previousCriteria": "경계에서 꺾인 관찰 1, 굴절 1. 정량 각도는 요구하지 않는다.",
   "lines": 8,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-67",
   "no": 67,
   "status": "authored",
   "form": "choice",
   "topic": "거울의 쓰임",
   "prompt": "세면대 앞 거울의 주된 쓰임은?",
   "answer": "③",
   "explanation": "자기 얼굴에서 온 빛이 거울에서 반사되어 눈에 들어와 모습을 확인할 수 있다.",
   "misconception": "확대경과 평면거울의 주된 기능을 구별한다.",
   "criteria": "세면대 거울로 얼굴 모습을 살피는 목적을 고르고 다른 도구의 목적과 구별한다.",
   "choices": [
    "멀리 있는 소리를 듣기",
    "작은 글자를 확대하기",
    "얼굴 모습을 보기",
    "몸의 온도를 재기"
   ],
   "key": 2,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-68",
   "no": 68,
   "status": "authored",
   "form": "blank",
   "topic": "두 거울 장치",
   "prompt": "두 거울 잠망경에서 빛은 위 거울 → [ ] → 눈으로 진행한다.",
   "answer": "아래 거울",
   "explanation": "위 거울이 아래 거울 쪽으로 빛을 보내고 아래 거울은 그 빛을 눈 쪽으로 반사한다.",
   "misconception": "관만으로 빛이 저절로 꺾인다고 생각하지 않는다.",
   "criteria": "이 문항의 배치에서 위 거울 다음의 아래 거울을 넣는다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-69",
   "no": 69,
   "status": "authored",
   "form": "short",
   "topic": "렌즈 선택",
   "prompt": "작은 글자를 자세히 보기 위한 도구 한 가지와 그 도움을 쓰세요.",
   "answer": "돋보기 / 작은 글자를 확대해 관찰하는 데 도움",
   "explanation": "관찰 목적이 작은 부분을 자세히 보는 것이므로 돋보기를 이용한다. 실제 사용에서 보임은 안전한 실내 조건으로 확인한다.",
   "misconception": "돋보기를 언제 어디서나 쓰면 항상 똑같이 보인다고 단정하지 않는다.",
   "criteria": "도구 1, 도움 1의 학습용 기준. 거리별 상의 변화 설명은 요구하지 않는다.",
   "previousCriteria": "도구 1, 도움 1의 학습용 기준. 거리별 상의 변화 설명은 요구하지 않는다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-70",
   "no": 70,
   "status": "authored",
   "form": "choice",
   "topic": "빛 관찰 안전",
   "prompt": "장치 시험에서 알맞은 행동은?",
   "answer": "②",
   "explanation": "약한 LED를 종이 쪽으로 비추고 교사와 배치를 확인한다. 눈에 직접 빛을 보내거나 깨진 재료를 만지지 않는다.",
   "misconception": "시험 성공을 위해 안전을 생략하지 않는다.",
   "criteria": "LED를 종이 쪽으로 비추며 교사와 배치를 확인하는 방법을 고른다.",
   "choices": [
    "레이저로 친구 눈을 겨눈다.",
    "LED를 종이 쪽에 비추고 경로를 살핀다.",
    "렌즈로 태양을 직접 본다.",
    "깨진 거울을 손으로 모은다."
   ],
   "key": 1,
   "previousCriteria": "선택한 보기와 그 이유를 확인한다.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-71",
   "no": 71,
   "status": "authored",
   "form": "written",
   "topic": "장치 개선",
   "prompt": "거울 장치로 카드가 안 보였습니다. 거울 위치를 고쳐 다시 시험하려 합니다. 무엇을 기록해야 하나요?",
   "answer": "처음 거울 배치와 안 보인 결과, 바꾼 부분, 다시 시험한 조건과 실제 결과를 기록한다.",
   "explanation": "수정 전후를 비교해야 어떤 변화가 도움을 주었는지 설명할 수 있다. 재시험하지 않았다면 계획으로 남긴다.",
   "misconception": "수정 계획을 재시험 성공으로 기록하지 않는다.",
   "criteria": "처음 배치·결과 1, 변경과 실제 재시험 결과/미실행 구별 1.",
   "previousCriteria": "처음 배치·결과 1, 변경과 실제 재시험 결과/미실행 구별 1.",
   "lines": 8,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-72",
   "no": 72,
   "status": "authored",
   "form": "draw",
   "topic": "물체 보기 경로",
   "prompt": "전등·책·눈의 위치를 자유롭게 정하고, 책을 볼 때의 빛 경로를 화살표로 그리세요.",
   "answer": "전등 → 책 → 눈 순서로 이어지는 화살표와 각 이름표",
   "explanation": "전등 빛이 책에 닿고 책에서 반사된 빛이 눈에 도달하는 경로를 그려야 책의 모습을 보는 설명이 된다.",
   "misconception": "전등 → 눈만 그린 것은 책을 본 경로가 아니다.",
   "criteria": "세 지점과 순서 1, 화살표와 이름표의 일관성 1. 그림 솜씨는 평가하지 않는다.",
   "previousCriteria": "세 지점과 순서 1, 화살표와 이름표의 일관성 1. 그림 솜씨는 평가하지 않는다.",
   "drawing": "large",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-73",
   "no": 73,
   "status": "authored",
   "form": "short",
   "topic": "탐구 기록",
   "prompt": "연습 표의 값을 그대로 내 실험 결과로 옮겨 적어도 될까요? 어떻게 표시해야 하나요?",
   "answer": "안 된다. 연습 자료/제공 자료라고 표시하고 내 실제 결과와 구별한다.",
   "explanation": "자료 문제를 푼 사실은 실제 실험을 수행한 증거가 아니다. 사용한 자료의 성격을 밝혀야 한다.",
   "misconception": "표를 채웠다는 사실만으로 실제 관찰 완료가 되지 않는다.",
   "criteria": "연습 자료임을 밝히고 실제 결과와 나누는 설명을 인정한다.",
   "previousCriteria": "연습 자료임을 밝히고 실제 결과와 나누는 설명을 인정한다.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-74",
   "no": 74,
   "status": "authored",
   "form": "multi",
   "topic": "정확한 설명",
   "prompt": "맞는 설명을 모두 고르세요.",
   "answer": "①, ④",
   "explanation": "같은 공기 속에서 곧게 진행하는 빛을 관찰할 수 있다. 거울로 본 물체는 거울이 실제로 복제한 것이 아니다.",
   "misconception": "모든 물질 경계에서도 무조건 직진한다는 절대 표현을 점검한다.",
   "criteria": "①·④ 모두 확인.",
   "choices": [
    "빛은 공기 중에서 곧게 진행할 수 있다.",
    "물체를 보려면 눈이 빛을 내야 한다.",
    "빛은 물질 경계에서도 언제나 꺾이지 않는다.",
    "거울 속 모습은 물체가 실제로 복제된 것이 아니다."
   ],
   "key": [
    0,
    3
   ],
   "previousCriteria": "①·④ 모두 확인.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-75",
   "no": 75,
   "status": "authored",
   "form": "written",
   "topic": "창의 장치 설명",
   "prompt": "거울이나 렌즈를 이용해 생활의 불편을 줄이는 장치 한 가지를 제안하고 목적·쓰임·확인 방법을 쓰세요.",
   "answer": "예: 가림판 너머 카드를 보는 두 거울 장치. 반사로 빛을 눈까지 보내고, 같은 위치의 카드가 보이는지 실제로 시험한다.",
   "explanation": "문제 상황에 맞는 도구와 빛 성질을 연결하고 성공 여부를 판단할 관찰 방법을 제안해야 한다.",
   "misconception": "아이디어를 그린 것만으로 제작·성공까지 완료했다고 쓰지 않는다.",
   "criteria": "목적 1, 거울/렌즈의 타당한 쓰임 1, 관찰 가능한 확인 방법 1. 다양한 안전한 대안 인정.",
   "lines": 8,
   "previousCriteria": "목적 1, 거울/렌즈의 타당한 쓰임 1, 관찰 가능한 확인 방법 1. 다양한 안전한 대안 인정.",
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-76",
   "no": 76,
   "status": "authored",
   "form": "written",
   "topic": "소통과 수행",
   "prompt": "설명 자료를 저장했지만 아직 친구에게 보여 주지 않았습니다. 현재 상태와 다음 할 일을 쓰세요.",
   "answer": "자료 제작·저장은 했고 공유는 아직 하지 않았다. 친구에게 보여 주고 받은 질문이나 의견을 실제로 기록한다.",
   "explanation": "저장은 자신의 파일 상태이고 공유는 상대에게 전달한 실제 행동이다. 의견을 받지 못했으면 미수신으로 남긴다.",
   "misconception": "다운로드나 저장을 발표·공유 완료로 자동 처리하지 않는다.",
   "criteria": "제작/저장과 미공유 구분 1, 실제 전달·의견 기록 계획 1. 실제 수행은 별도 확인.",
   "previousCriteria": "제작/저장과 미공유 구분 1, 실제 전달·의견 기록 계획 1. 실제 수행은 별도 확인.",
   "lines": 8,
   "standard": "6과02-03",
   "origin": "previous80"
  },
  {
   "id": "light-book-77",
   "no": 77,
   "status": "authored",
   "form": "blank",
   "topic": "경로 다시 보기",
   "prompt": "“눈이 책에 빛을 보낸다”를 고쳐요. 책에서 [ ]된 빛이 [ ]에 들어와 책이 보인다.",
   "answer": "반사 / 눈",
   "explanation": "책은 외부 빛을 반사하며 그 빛이 눈으로 들어온다. 경로 방향을 거꾸로 쓰지 않는다.",
   "misconception": "눈을 광원으로 생각하는 오개념을 재확인한다.",
   "criteria": "반사와 눈을 순서대로 넣어 책에서 반사된 빛이 눈에 들어옴을 설명한다.",
   "previousCriteria": "같은 과학적 뜻의 낱말을 인정한다. 각 빈칸을 따로 확인한다.",
   "standard": "6과02-01",
   "origin": "previous80"
  },
  {
   "id": "light-book-78",
   "no": 78,
   "status": "authored",
   "form": "match",
   "topic": "현상 다시 구별",
   "prompt": "상황과 성질을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "통로에서 곧게 감은 직진, 거울에서 되돌아옴은 반사, 물질 경계로 들어가며 꺾임은 굴절이다.",
   "misconception": "방향 변화만 보고 반사와 굴절을 같은 말로 쓰지 않는다.",
   "criteria": "각 연결을 확인하고 틀린 성질은 해당 개념 쪽으로 돌아간다.",
   "given": [
    "ㄱ 굴절   ㄴ 직진   ㄷ 반사"
   ],
   "parts": [
    "(1) 같은 공기 속의 곧은 빛 경로: [ ]",
    "(2) 거울에서 되돌아오는 경로: [ ]",
    "(3) 공기·물 경계에서 비스듬히 꺾이는 경로: [ ]"
   ],
   "previousCriteria": "각 연결을 확인하고 틀린 성질은 해당 개념 쪽으로 돌아간다.",
   "answerPerPart": true,
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-79",
   "no": 79,
   "status": "authored",
   "form": "written",
   "topic": "조건 다시 고치기",
   "prompt": "“동전을 보기 위해 눈도 옮기고 물도 넣었다”를 물 유무만 비교하는 방법으로 고치세요.",
   "answer": "눈·동전·그릇의 위치를 그대로 두고 물을 넣기 전후를 비교한다.",
   "explanation": "원래 방법은 눈 위치와 물 유무를 함께 바꾸었다. 비교하려는 물 이외의 조건을 유지해야 한다.",
   "misconception": "결과만 보이면 어떤 방법이든 같은 증거라고 생각하지 않는다.",
   "criteria": "눈 위치 고정 1, 물 넣기 전후 동일 대상 비교 1.",
   "lines": 8,
   "previousCriteria": "눈 위치 고정 1, 물 넣기 전후 동일 대상 비교 1.",
   "standard": "6과02-02",
   "origin": "previous80"
  },
  {
   "id": "light-book-80",
   "no": 80,
   "status": "authored",
   "form": "written",
   "topic": "설명 다시 쓰기",
   "prompt": "내 장치 설명에 목적·빛의 경로·시험 결과 중 빠진 것이 있었나요? 하나를 골라 구체적으로 보완하세요.",
   "answer": "예: 물체 → 위 거울 → 아래 거울 → 눈의 화살표를 넣는다. 실제 시험 전이면 “아직 시험하지 않음”을 쓴다.",
   "explanation": "개인의 설명에서 빠진 정보를 찾아 보완하는 열린 문항이다. 목적과 배치, 실제 수행 상태가 서로 맞아야 한다.",
   "misconception": "교사 예시 문장을 실제 자신의 제작 결과처럼 베끼지 않는다.",
   "criteria": "선택한 빠진 정보의 구체적 보완 1, 실제/계획의 일치 1. 학생 설명에 따라 다양한 답 인정.",
   "lines": 8,
   "previousCriteria": "선택한 빠진 정보의 구체적 보완 1, 실제/계획의 일치 1. 학생 설명에 따라 다양한 답 인정.",
   "standard": "6과02-03",
   "origin": "previous80"
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "빛의 성질",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourcePencil",
     "caption": ""
    },
    {
     "type": "text",
     "text": "물속의 연필은 왜 꺾여 보일까요? 빛의 길을 관찰하고 한 조건씩 비교하면 물체 보기·직진·반사·굴절을 근거로 설명할 수 있어요."
    },
    {
     "type": "field",
     "title": "나의 시작 질문",
     "hint": "거울·물·렌즈에서 궁금한 점 하나를 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진의 보이는 모습과 실제 물체의 변화는 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰 사진·기존 설명 그림·별도 연습 자료와 내가 실제로 한 실험을 나누어요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이름·학습 날짜와 처음 궁금한 점을 남겨요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "차례와 사용법",
   "title": "관찰에서 장치 제작으로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "학습 길",
      "할 일"
     ],
     "rows": [
      [
       "빛과 물체 보기",
       "광원·반사된 빛·어둠상자 비교"
      ],
      [
       "같은 공기에서 직진",
       "구멍 위치 한 가지만 바꾸어 비교"
      ],
      [
       "평면거울 반사·물과 렌즈 굴절",
       "어느 경계와 구간의 빛인지 설명"
      ],
      [
       "거울·렌즈의 쓰임",
       "목적에 맞는 장치 설계·실제 제작·재시험"
      ],
      [
       "80문항으로 확인",
       "객관식·복수선택·빈칸·연결·순서·단답·서술·그림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "앞의 준비 점검은 첫 생각을 알아보는 활동이에요. 문제의 답과 실제 관찰·제작한 일을 따로 확인해요. 기록을 길게 채우기보다 필요한 근거와 설명을 남겨요."
    },
    {
     "type": "field",
     "title": "실험 준비",
     "hint": "교사와 준비할 장치와 실제 해 볼 활동을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "본문과 발문을 읽고 오른쪽 핵심·보충 설명을 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실험 장치는 교사가 준비해요. 광원을 눈에 비추거나 태양을 렌즈로 보지 않고 햇빛 모으기·레이저·학생 칼질을 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "준비 점검 1~2",
   "title": "물체 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-01",
      "light-book-02"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "어둠에 익숙해짐과 빛이 전혀 없는 상태를 혼동하지 않는다. 경계에서 다른 물질로 들어가는 굴절과 구별한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "준비 점검 3~4",
   "title": "장치의 기능",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-03",
      "light-book-04"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "반짝이는 도구가 모두 렌즈인 것은 아니다. 보였다/안 보였다만으로 실험 방법까지 전해졌다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기",
   "title": "스스로 빛을 내거나 반사한 빛으로 보여요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceLight",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sourceSeeing",
     "caption": ""
    },
    {
     "type": "example",
     "question": "컵은 스스로 빛을 내는 물체일까요?",
     "steps": [
      [
       "광원",
       "전등은 스스로 빛을 내요."
      ],
      [
       "물체",
       "컵은 전등 빛을 반사해요."
      ],
      [
       "눈",
       "컵에서 온 빛이 눈에 들어와 보여요."
      ]
     ],
     "answer": "컵이 밝게 보인다는 사실만으로 광원이라고 할 수 없어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보통 물체를 볼 때는 광원 → 물체 → 눈으로 빛이 진행해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "달도 햇빛을 반사해 보여요. 눈에서 빛이 나가 책을 찾는 설명과 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ①",
   "title": "어둠상자의 조명만 바꾸어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "바꿀 것",
      "같게 둘 것",
      "살펴볼 것"
     ],
     "rows": [
      [
       "상자 안 LED 켜짐/꺼짐",
       "눈·상자·물체·관찰 구멍 위치",
       "같은 물체가 보이는지"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "교사 준비 상자에 공이나 카드를 놓고 처음 위치를 고정해요.",
      "내부를 비추는 약한 LED만 끄고 켜며 보임을 비교해요.",
      "상자 틈의 주변 빛도 확인해 잘 안 보임과 빛이 전혀 없음을 구별해요."
     ]
    },
    {
     "type": "field",
     "title": "근거로 설명",
     "hint": "두 조건의 보임과 물체에서 눈으로 오는 빛을 연결해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조명과 물체 위치를 함께 바꾸면 조명만의 영향인지 알기 어려워요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "이 활동은 교사 준비 장치에서 해요. 직접 안 했다면 자료나 시범을 본 범위를 설명해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기 5~6",
   "title": "빛의 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-05",
      "light-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈에서 책으로 빛이 나간다는 생각을 점검한다. 밝게 보임과 스스로 빛을 냄을 구별한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기 7~8",
   "title": "어둠상자 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-07",
      "light-book-08"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "여러 조건을 함께 바꾸면 결과의 까닭을 가리기 어렵다. 문장에 나온 순서를 그대로 답으로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛과 물체 보기 9~10",
   "title": "물체 보기의 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-09",
      "light-book-10"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "광원 또는 물체에서 온 빛이 눈에 들어와야 보여요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "빛이 공까지만 도달하면 눈의 위치와 무관하게 보인다는 생각을 점검한다. 장난감이 조명처럼 스스로 빛을 냈다고 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛의 직진",
   "title": "같은 물질 안에서는 곧게 나아가요",
   "blocks": [
    {
     "type": "diagram",
     "key": "straight",
     "caption": "기존 설명 그림. 세 구멍과 눈이 한 줄인 배치와 가운데가 어긋난 배치를 비교해요."
    },
    {
     "type": "example",
     "question": "가운데 구멍만 옮기면 빛이 구멍을 찾아갈까요?",
     "steps": [
      [
       "한 줄",
       "같은 공기 속 곧은 경로로 통과할 수 있어요."
      ],
      [
       "어긋남",
       "그 길을 판이 가리면 저절로 굽어 가지 않아요."
      ]
     ],
     "answer": "이 비교는 빛의 직진을 뒷받침해요."
    },
    {
     "type": "field",
     "title": "내 설명",
     "hint": "구멍 배열과 빛의 경로를 연결해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속에서의 직진을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울 표면이나 다른 물질의 경계를 만나도 언제나 같은 방향으로만 간다는 뜻은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ②",
   "title": "맞춤 → 어긋남 → 다시 맞춤",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 약한 LED·세 구멍 판·목표 종이를 고정해요. 눈으로 광원을 들여다보지 않고 종이에 닿는 빛을 살펴요.",
      "구멍이 한 줄일 때와 가운데 판만 옆으로 옮겼을 때를 비교해요.",
      "가운데 판을 처음 자리로 돌려 처음 결과가 다시 나타나는지 확인해요."
     ]
    },
    {
     "type": "table",
     "heads": [
      "같게 둔 것",
      "바꾼 조건",
      "종이에서 실제로 본 것"
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
     "title": "다시 확인할 점",
     "hint": "판 흔들림·주변 빛·약한 불빛 등 불분명한 조건과 다시 해 볼 방법을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "다른 판·광원·목표 종이를 고정하고 가운데 구멍 위치만 바꾸어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공기 중에서 빛줄기가 늘 보이는 것은 아니에요. 준비한 종이 위 자취나 목표 종이에 닿는 곳을 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "직진과 조건 비교 11~12",
   "title": "직진",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-11",
      "light-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속 구멍 배열과 곧은 경로를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "빛이 언제 어디서나 경계도 무시하고 곧게 간다고 확대하지 않는다. 빛이 구멍을 찾아 굽어 들어간다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "직진과 조건 비교 13~14",
   "title": "그림자의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-13",
      "light-book-14"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속 구멍 배열과 곧은 경로를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "어둠이 카드에서 밖으로 나오는 물질처럼 설명하지 않는다. 모든 판을 다시 움직인 뒤 비교하면 한 조건의 영향을 가리기 어렵다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "직진과 조건 비교 15~16",
   "title": "상황과 성질",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-15",
      "light-book-16"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 공기 속 구멍 배열과 곧은 경로를 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "두 현상 모두 빛이 있지만 관찰하는 구간이 다르다. 관찰 한 번으로 모든 물질 경계에서의 경로까지 같다고 단정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛의 반사",
   "title": "거울에서 되돌아 나아가요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceMirror",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "reflection",
     "caption": "기존 경로 그림의 한 거울 배치예요. 각도값을 계산하지 않아요."
    },
    {
     "type": "text",
     "text": "거울이 새 물체를 만들어 내거나 물체를 실제로 옮기는 것은 아니에요. 물체에서 온 빛이 거울에서 반사되어 눈에 들어오면 그 모습을 볼 수 있어요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "반사는 경계에 닿은 빛이 되돌아 나오는 현상이에요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "책·종이도 빛을 반사하지만 평면거울처럼 또렷한 모습을 비추지는 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ③",
   "title": "거울 방향만 바꾸어 경로를 비교해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사가 준비한 약한 LED 슬릿 광원·종이·안전 평면거울을 고정해요.",
      "종이 위에서 거울에 닿기 전과 반사되어 나간 뒤의 자취를 살펴요.",
      "광원·종이는 고정하고 거울 방향 한 곳만 바꾸어 빛이 닿는 곳을 비교해요."
     ]
    },
    {
     "type": "field",
     "title": "바뀐 경로와 근거",
     "hint": "거울을 돌리기 전후를 그리고 진행 화살표를 넣어요.",
     "lines": 4,
     "draw": true
    },
    {
     "type": "text",
     "text": "빛을 눈에 직접 비추지 않아요. 자취가 불분명하면 교사와 배치를 확인하고 관찰한 범위를 설명해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "카드와 눈이 그대로여도 거울 방향에 따라 카드가 안 보일 수 있어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "안 보인다는 사실만으로 카드가 없어졌다고 하지 않아요. 카드 → 거울 → 눈의 연결을 확인해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "반사와 빛 경로 17~18",
   "title": "반사",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-17",
      "light-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 → 거울 → 눈으로 이어지는 빛을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈에서 거울로 빛을 쏘아 물체를 찾는 경로를 쓰지 않는다. 거울 속 모습과 실제 물체를 구분한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "반사와 빛 경로 19~20",
   "title": "반사 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-19",
      "light-book-20"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 → 거울 → 눈으로 이어지는 빛을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전등에서 거울로 직접 온 빛만으로 인형 모습을 본다고 설명하지 않는다. 잘 보려면 강한 빛을 눈으로 봐야 한다는 생각을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "반사와 빛 경로 21~22",
   "title": "반사의 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-21",
      "light-book-22"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 → 거울 → 눈으로 이어지는 빛을 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울 속 공간에 실제 물체가 하나 더 있다는 생각을 점검한다. 보이지 않음과 물체가 없어짐을 같은 뜻으로 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빛의 굴절",
   "title": "물체 자체와 보이는 모습은 달라요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourcePencil",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sourceCoin",
     "caption": ""
    },
    {
     "type": "text",
     "text": "물속 부분에서 온 빛이 물과 공기 경계를 지나 방향이 달라져 눈에 들어올 수 있어요. 연필이 실제로 부러지거나 동전이 스스로 떠올랐다는 뜻은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "다른 물질의 경계를 비스듬히 지날 때 꺾여 나아가는 굴절을 살펴요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "두 동전 사진만으로 눈·그릇·동전이 같은 위치였다고 확인한 것은 아니에요. 실제 실험의 조건은 따로 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 관찰 ④",
   "title": "눈·그릇·동전을 그대로 두어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "바꿀 것",
      "같게 둘 것",
      "살펴볼 것"
     ],
     "rows": [
      [
       "물 없음 / 물을 넣음",
       "눈·그릇·동전 위치",
       "동전이 보이는지·보이는 위치"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "교사와 처음 동전이 그릇 가장자리에 가려 안 보이는 눈 위치를 정해요.",
      "눈·그릇·동전을 움직이지 않고 물을 천천히 넣어 비교해요.",
      "눈이 움직이거나 동전이 밀렸다면 그 조건을 남기고 다시 맞추어 살펴요."
     ]
    },
    {
     "type": "field",
     "title": "조건을 고친 설명",
     "hint": "눈도 옮기고 물도 넣은 방법을 물 유무만 비교하도록 고쳐요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "text",
     "text": "물은 전기 기구와 떨어진 곳에서 쓰고 쏟으면 닦아요. 동전은 입에 넣지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관찰 결과와 그 까닭에 대한 설명을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "어느 시작 배치에서나 물만 넣으면 반드시 동전이 보인다고 하지 않아요. 경계에 들어가는 빛의 방향도 살펴요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "굴절과 관찰 범위 23~24",
   "title": "굴절",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-23",
      "light-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 물체 위치와 물질 경계를 지난 빛의 보임을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울에서 되돌아오는 반사와 혼동하지 않는다. 보이는 모양 변화와 실제 물체 변화가 반드시 같지는 않다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "굴절과 관찰 범위 25~26",
   "title": "동전 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-25",
      "light-book-26"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 물체 위치와 물질 경계를 지난 빛의 보임을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "결과가 잘 나오게 눈을 옮긴 뒤 굴절의 증거라고 기록하지 않는다. 진행 방향이 변했다는 말 하나로 두 현상을 같게 취급하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "굴절과 관찰 범위 27~28",
   "title": "굴절 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-27",
      "light-book-28"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 물체 위치와 물질 경계를 지난 빛의 보임을 나누어요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "사진 한 장의 겉모습만으로 실제 변형을 단정하지 않는다. 물과 공기가 다르면 반드시 눈에 띄게 꺾인다는 절대 표현을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거울의 쓰임",
   "title": "목적과 빛의 경로를 함께 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourcePeriscope",
     "caption": "물체 쪽 첫 거울 → 눈 쪽 둘째 거울의 한 배치 예예요. 다른 문항은 그 문항의 위·아래 순서를 읽어요."
    },
    {
     "type": "table",
     "heads": [
      "도구",
      "보려는 대상과 도움"
     ],
     "rows": [
      [
       "세면대 거울",
       "얼굴 모습 살피기"
      ],
      [
       "자동차 뒤쪽 거울",
       "뒤쪽 상황 살피기"
      ],
      [
       "두 거울 잠망경",
       "직접 보기 어려운 곳의 대상 보기"
      ]
     ]
    },
    {
     "type": "field",
     "title": "내가 조사한 쓰임",
     "hint": "교사 선정 자료의 도구·목적·도움과 자료 제목을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름만 쓰지 말고 무엇을 보도록 돕는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옆의 그림과 뒤 문항은 각각 제시된 배치를 읽어요. 모든 잠망경에서 위·아래 순서가 같은 것은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "실제 제작 ①",
   "title": "가림판 너머의 카드를 볼 장치",
   "blocks": [
    {
     "type": "text",
     "text": "눈과 카드를 정한 자리에 두고, 가림판 때문에 직접 보이지 않는 카드를 안전 거울 두 개로 보려 해요."
    },
    {
     "type": "field",
     "title": "나의 설계",
     "hint": "카드·첫째 거울·둘째 거울·눈을 표시하고 빛의 경로를 이어요.",
     "lines": 4,
     "draw": true
    },
    {
     "type": "table",
     "heads": [
      "성공 기준",
      "같게 둘 조건",
      "처음 시험에서 확인할 것"
     ],
     "rows": [
      [
       "정한 눈 위치에서 카드가 보이는지",
       "",
       ""
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사가 관찰 창과 구멍을 준비한 종이 상자·안전 거울·받침·테이프로 실제 만들어 시험해요. 설계 그림만 있다면 아직 제작 전이에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 길이 첫 거울과 둘째 거울을 거쳐 눈까지 이어져야 해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "칼질·구멍 내기는 교사가 맡고 깨진 거울을 쓰지 않아요. 고정과 관찰 창의 위치도 목적에 맞게 정해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "거울의 쓰임과 설계 29~30",
   "title": "생활 속 거울",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-29",
      "light-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름·보려는 목적·빛이 눈에 도달하는 경로를 함께 말해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울을 사용하면 가려진 모든 곳이 무조건 보인다고 단정하지 않는다. 속이 빈 관만 있으면 빛이 관을 따라 저절로 굽는다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거울의 쓰임과 설계 31~32",
   "title": "장치의 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-31",
      "light-book-32"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름·보려는 목적·빛이 눈에 도달하는 경로를 함께 말해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울 순서를 바꾸어도 같은 배치에서 항상 보인다고 생각하지 않는다. 관 길이만이 실패 원인이라고 단정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "거울의 쓰임과 설계 33~34",
   "title": "도구와 목적",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-33",
      "light-book-34"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "도구 이름·보려는 목적·빛이 눈에 도달하는 경로를 함께 말해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울이 쓰였다는 공통점과 쓰임의 차이를 함께 살핀다. 거울 종류를 외우는 것만으로 장치 설명이 완성되었다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "렌즈의 굴절",
   "title": "렌즈를 넣기 전과 넣은 뒤의 빛",
   "blocks": [
    {
     "type": "diagram",
     "key": "sourceLens",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "관찰 장치",
      "살펴볼 것"
     ],
     "rows": [
      [
       "교사 준비 약한 LED 슬릿 광원·종이",
       "렌즈를 넣기 전 종이 위 빛 경로"
      ],
      [
       "같은 광원·종이와 볼록 렌즈",
       "렌즈 앞뒤에서 달라지는 경로"
      ]
     ]
    },
    {
     "type": "text",
     "text": "교사와 렌즈를 넣기 전과 넣은 뒤를 실제로 비교하고 바뀌는 구간을 가리켜 굴절을 설명해요. 사진의 진행 방향은 광원 위치와 함께 확인해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈를 지나는 빛의 경로와 거울에서 되돌아 나오는 빛을 구별해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "렌즈의 모든 빛이 똑같이 꺾인다고 하지 않아요. 물체·눈과 렌즈의 거리에 따른 상의 크기·뒤집힘은 이 단원의 필수 비교가 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "렌즈의 쓰임과 재시험",
   "title": "관찰할 목적에 맞는 도구를 골라요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "필요",
      "도구와 도움"
     ],
     "rows": [
      [
       "작은 씨앗·글자의 특징 관찰",
       "돋보기로 자세히 살피기"
      ],
      [
       "보이지 않는 방향의 카드 관찰",
       "거울로 빛 경로 바꾸기"
      ]
     ]
    },
    {
     "type": "example",
     "question": "장치가 안 보이면 여러 곳을 한꺼번에 고칠까요?",
     "steps": [
      [
       "첫 결과",
       "안 보인 배치도 고칠 근거로 남겨요."
      ],
      [
       "한 변화",
       "다른 조건은 고정하고 거울 방향 한 곳을 바꾸어요."
      ],
      [
       "재시험",
       "같은 카드·눈 위치에서 다시 보이는지 확인해요."
      ]
     ],
     "answer": "수정 계획과 실제 재시험의 결과를 구별해요."
    },
    {
     "type": "field",
     "title": "나의 시험 기준",
     "hint": "보려는 대상과 성공 기준·같게 둘 조건을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조사 자료의 기능과 내가 직접 사용한 결과는 달라요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "실내 조명 아래에서 관찰하고 태양 직접 보기·햇빛 모으기·레이저를 하지 않아요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "렌즈·도구와 시험 35~36",
   "title": "렌즈 모양",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-35",
      "light-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈나 거울이 어떤 대상을 보는 데 도움을 주는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전체 렌즈의 지름이나 색만으로 종류를 판단하지 않는다. 조사 자료·친구 경험과 자신의 직접 관찰을 섞지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "렌즈·도구와 시험 37~38",
   "title": "렌즈 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-37",
      "light-book-38"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈나 거울이 어떤 대상을 보는 데 도움을 주는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "빛을 세게 모을수록 좋은 관찰이라는 생각을 점검한다. 평면거울을 쓰면 항상 확대된다는 생각을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "렌즈·도구와 시험 39~40",
   "title": "계획과 실제",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-39",
      "light-book-40"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "렌즈나 거울이 어떤 대상을 보는 데 도움을 주는지 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "예상한 결과를 실제 성공으로 옮겨 적지 않는다. 재료를 많이 넣으면 목적과 관계없이 좋은 장치라고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 41~42",
   "title": "반복 관찰 자료",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-41",
      "light-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "연습 자료를 학생이 실제 측정한 기록으로 쓰지 않는다. 결과가 기대와 같으면 절차의 차이는 무시해도 된다는 생각을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 43~44",
   "title": "관찰과 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-43",
      "light-book-44"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "관찰 기록 속에 이미 실제 변형이 확정되었다고 넣지 않는다. 결과를 지워 실패가 없었던 것처럼 만들지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 45",
   "title": "반사 경로 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-45"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "거울을 그대로 뚫거나 관의 벽을 따라 도는 빛으로 그리지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 46~47",
   "title": "경로 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-46",
      "light-book-47"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "두 번 반사되면 빛이 반드시 사라진다고 생각하지 않는다. 화살표가 빛의 세기나 물체의 이동 방향을 뜻한다고 혼동하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 48~49",
   "title": "경로의 일관성",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-48",
      "light-book-49"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈이 받은 빛을 다시 책으로 쏘아 보게 된다는 생각을 점검한다. 밝음=광원이라는 오개념을 바로잡는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 50~51",
   "title": "증거의 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-50",
      "light-book-51"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "한 장치의 성공과 모든 장치의 검증을 혼동하지 않는다. 자료 속 사용 사례를 자신의 실험 결과로 바꾸지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 근거로 깊이 풀기 52",
   "title": "의견 반영",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-52"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 조건·주어진 자료·관찰 범위를 근거로 주장을 검토해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "예쁘게 색칠하는 것만으로 사용법 질문이 해결되었다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "한눈에 정리",
   "title": "관찰 → 빛의 성질 → 생활 장치",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "근거가 된 비교",
      "연결할 내용"
     ],
     "rows": [
      [
       "조명만 바꾼 어둠상자",
       "물체를 보려면 눈에 들어오는 빛이 필요함"
      ],
      [
       "같은 공기에서 구멍 배열",
       "직진"
      ],
      [
       "거울에 닿아 되돌아 나오는 경로",
       "반사"
      ],
      [
       "물·렌즈 경계에서 달라지는 경로",
       "굴절"
      ],
      [
       "목적에 맞춘 장치와 재시험",
       "거울·렌즈의 쓰임과 실제 제작"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 핵심 설명",
     "hint": "한 사례를 골라 바꾼 조건·관찰·설명을 연결해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "성질 이름만 외우지 말고 어느 구간의 빛인지 가리켜 설명해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "화살표는 빛의 진행 표식이에요. 관찰 사진·설명 그림·연습 자료와 실제 수행은 구별해요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  },
  {
   "section": "빈칸 정리 53~54",
   "title": "한눈에 정리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-53",
      "light-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 성질 이름과 관찰·예상의 뜻을 문맥에 맞게 써요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈에 보이는 모든 물체가 광원은 아니다. 직진과 반사는 같은 장치에서도 구간별로 나타날 수 있다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "빈칸 정리 55~56",
   "title": "경계 정리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-55",
      "light-book-56"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛의 성질 이름과 관찰·예상의 뜻을 문맥에 맞게 써요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈을 빛의 출발점으로 놓지 않는다. 예상한 대로 결과를 고치지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 57~58",
   "title": "물체 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-57",
      "light-book-58"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "물체와 눈 사이에서 전달되는 것이 빛임을 확인한다. 경계의 굴절과 같은 상황으로 보지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 59~60",
   "title": "빛이 통과하는 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-59",
      "light-book-60"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "보이지 않으면 전등이 꺼졌다고 단정하지 않는다. 글씨를 아는 뇌의 처리와 빛의 진행 순서를 섞지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 61~62",
   "title": "빛 필요의 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-61",
      "light-book-62"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "공의 색이나 크기만으로 빛 없이도 보인다고 하지 않는다. 거울이 스스로 빛나는 것으로 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 63~64",
   "title": "세 성질",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-63",
      "light-book-64"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "성질 이름만 나열하지 말고 각 상황과 대응한다. 겉모습만으로 실제 파손을 확정하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 65~66",
   "title": "실험 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-65",
      "light-book-66"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "바꿀 조건과 같게 할 조건을 뒤바꾸지 않는다. 거울에서 되돌아오는 반사로 설명하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 67~68",
   "title": "거울의 쓰임",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-67",
      "light-book-68"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "확대경과 평면거울의 주된 기능을 구별한다. 관만으로 빛이 저절로 꺾인다고 생각하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 69~70",
   "title": "렌즈 선택",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-69",
      "light-book-70"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "돋보기를 언제 어디서나 쓰면 항상 똑같이 보인다고 단정하지 않는다. 시험 성공을 위해 안전을 생략하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 71",
   "title": "장치 개선",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-71"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "수정 계획을 재시험 성공으로 기록하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 72",
   "title": "물체 보기 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-72"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "전등 → 눈만 그린 것은 책을 본 경로가 아니다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 73~74",
   "title": "탐구 기록",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-73",
      "light-book-74"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "표를 채웠다는 사실만으로 실제 관찰 완료가 되지 않는다. 모든 물질 경계에서도 무조건 직진한다는 절대 표현을 점검한다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "단원 확인 75~76",
   "title": "창의 장치 설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-75",
      "light-book-76"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "물체 보기·직진·반사·굴절과 생활 장치를 근거로 연결해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "아이디어를 그린 것만으로 제작·성공까지 완료했다고 쓰지 않는다. 다운로드나 저장을 발표·공유 완료로 자동 처리하지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "설명 보완 77~78",
   "title": "경로 다시 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-77",
      "light-book-78"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛 경로와 한 조건 비교로 설명을 보완해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "눈을 광원으로 생각하는 오개념을 재확인한다. 방향 변화만 보고 반사와 굴절을 같은 말로 쓰지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "설명 보완 79~80",
   "title": "조건 다시 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "light-book-79",
      "light-book-80"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빛 경로와 한 조건 비교로 설명을 보완해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "결과만 보이면 어떤 방법이든 같은 증거라고 생각하지 않는다. 교사 예시 문장을 실제 자신의 제작 결과처럼 베끼지 않는다.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "이 쪽에서 헷갈린 번호와 고친 설명을 적어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": ""
  },
  {
   "section": "자료와 찾아보기",
   "title": "근거를 다시 찾아 보아요",
   "blocks": [
    {
     "type": "heading",
     "text": "원교재와 현행 학습 범위"
    },
    {
     "type": "text",
     "text": "지필드 이론6-1-1 22~26쪽·실험6-A 18~21쪽과24쪽의 빛 관찰·거울/렌즈 장치를 참고했어요. 교육부 2022 개정 과학과 교육과정 [6과02-01~03]의 빛의 필요·직진/반사/굴절·거울과 렌즈의 쓰임 및 장치 만들기를 연결했어요."
    },
    {
     "type": "text",
     "text": "반사·굴절 법칙의 계산, 각도에 따른 거울상 개수, 렌즈의 거리별 상 비교, 햇빛으로 종이 태우기는 필수 활동으로 옮기지 않았어요."
    },
    {
     "type": "heading",
     "text": "사진·설명 그림·문항"
    },
    {
     "type": "text",
     "text": "사진4장과 기존 설명 그림3개는 원교재 이미지예요. 다른 경로 그림도 기존 자료를 보존했어요. 원촬영 장소·시각·배율은 미확인이며 사진을 내가 실제로 한 실험의 기록으로 쓰지 않아요. 80문항은 기존 독립 창작 교재의 발문·자료·답·풀이를 보존한 연습 문제예요."
    },
    {
     "type": "field",
     "title": "다시 볼 개념과 질문",
     "hint": "틀린 문항에서 필요한 근거와 다음 실제 관찰 계획을 정리해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "학생판·교사판·해설·빠른 정답표는 같은80문항을 사용해요.",
     "write": 0
    },
    {
     "title": "더 알아보기",
     "text": "옛단원 연계 원문 발췌40문항은 별도 은행에 출처와 함께 보존해요. 현행 단원 전체 시험지를 확보했다는 뜻은 아니에요.",
     "write": 0
    },
    {
     "title": "내가 정리할 것",
     "text": "사용한 근거와 내 설명을 연결하고 더 확인할 점을 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": ""
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-01",
      "light-book-02",
      "light-book-03"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 4~6",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-04",
      "light-book-05",
      "light-book-06"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 7~9",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-07",
      "light-book-08",
      "light-book-09"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 10~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-10",
      "light-book-11",
      "light-book-12"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 13~15",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-13",
      "light-book-14",
      "light-book-15"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 16~18",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-16",
      "light-book-17",
      "light-book-18"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 19~21",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-19",
      "light-book-20",
      "light-book-21"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 22~24",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-22",
      "light-book-23",
      "light-book-24"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
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
      "light-book-25",
      "light-book-26",
      "light-book-27"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
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
      "light-book-28",
      "light-book-29",
      "light-book-30"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 31~33",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-31",
      "light-book-32",
      "light-book-33"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 34~36",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-34",
      "light-book-35",
      "light-book-36"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 37~39",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-37",
      "light-book-38",
      "light-book-39"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 40~42",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-40",
      "light-book-41",
      "light-book-42"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 43~45",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-43",
      "light-book-44",
      "light-book-45"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 46~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-46",
      "light-book-47",
      "light-book-48"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 49~51",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-49",
      "light-book-50",
      "light-book-51"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 52~54",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-52",
      "light-book-53",
      "light-book-54"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 55~58",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-55",
      "light-book-56",
      "light-book-57",
      "light-book-58"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 59~61",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-59",
      "light-book-60",
      "light-book-61"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 62~65",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-62",
      "light-book-63",
      "light-book-64",
      "light-book-65"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
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
      "light-book-66",
      "light-book-67",
      "light-book-68"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 69~71",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-69",
      "light-book-70",
      "light-book-71"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 72~74",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-72",
      "light-book-73",
      "light-book-74"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  },
  {
   "section": "정답·해설 75~77",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "light-book-75",
      "light-book-76",
      "light-book-77"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
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
      "light-book-78",
      "light-book-79",
      "light-book-80"
     ]
    }
   ],
   "rail": [
    {
     "title": "채점할 때",
     "text": "같은 뜻의 표현을 인정하고 문항의 조건·근거가 들어 있는지 확인해요.",
     "write": 0
    },
    {
     "title": "다시 설명할 때",
     "text": "오개념 점검에서 헷갈린 지점을 찾아 실제 관찰이나 개념 쪽과 연결해요.",
     "write": 0
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~28번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "light-quick-0",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 풀이의 조건·근거·인정 기준을 확인해요.",
     "write": 0
    },
    {
     "title": "다시 볼 근거",
     "text": "틀린 번호와 헷갈린 개념을 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "29~56번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "light-quick-28",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 풀이의 조건·근거·인정 기준을 확인해요.",
     "write": 0
    },
    {
     "title": "다시 볼 근거",
     "text": "틀린 번호와 헷갈린 개념을 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "57~80번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "light-quick-56",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 풀이의 조건·근거·인정 기준을 확인해요.",
     "write": 0
    },
    {
     "title": "다시 볼 근거",
     "text": "틀린 번호와 헷갈린 개념을 적어요.",
     "write": 5
    }
   ]
  }
 ],
 "figures": {
  "seeing": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 170\" role=\"img\" aria-label=\"광원에서물체를거쳐눈으로\"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style><rect x=\"15\" y=\"25\" width=\"84\" height=\"58\" rx=\"4\" fill=\"#edf2fa\" stroke=\"#52637c\"/><text x=\"26\" y=\"61\">켜진 전등</text><path class=\"ray\" d=\"M99 65L250 120\"/><polygon fill=\"#2456c4\" points=\"250,120 242.91246607425333,113.1613698117686 240.1745249615856,120.67826268472905\"/><path d=\"M215 120 L280 120 L297 139 L232 139Z\" fill=\"#fff\" stroke=\"#52637c\" stroke-width=\"2\"/><text x=\"234\" y=\"160\">책</text><path class=\"ray\" d=\"M250 120L399 51\"/><polygon fill=\"#2456c4\" points=\"399,51 389.15231909396636,51.1522523331174 392.5140506091986,58.411643576155214\"/><path class=\"edge\" d=\"M399 51 Q427 22 455 51 Q427 80 399 51Z\"/><circle cx=\"427\" cy=\"51\" r=\"9\" fill=\"#52637c\"/><text x=\"417\" y=\"94\">눈</text></svg>",
  "straight": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 172\" role=\"img\" aria-label=\"구멍이일직선인경우와어긋난경우\"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style><text x=\"8\" y=\"22\">가</text><text x=\"8\" y=\"105\">나</text><rect x=\"32\" y=\"33\" width=\"51\" height=\"28\" fill=\"#edf2fa\" stroke=\"#52637c\"/><text x=\"38\" y=\"53\">전등</text><path class=\"edge\" d=\"M150 19v20m0 16v20\"/><path class=\"edge\" d=\"M240 19v20m0 16v20\"/><path class=\"edge\" d=\"M330 19v20m0 16v20\"/><path class=\"ray\" d=\"M86 47H403\"/><polygon fill=\"#2456c4\" points=\"403,47 394,43 394,51\"/><text x=\"412\" y=\"53\">관찰 구멍</text><rect x=\"32\" y=\"116\" width=\"51\" height=\"28\" fill=\"#edf2fa\" stroke=\"#52637c\"/><text x=\"38\" y=\"136\">전등</text><path class=\"edge\" d=\"M150 102v20m0 16v20\"/><path class=\"edge\" d=\"M240 102v30m0 16v10\"/><path class=\"edge\" d=\"M330 102v20m0 16v20\"/><path class=\"ray\" d=\"M86 130H236\"/><polygon fill=\"#2456c4\" points=\"236,130 227,126 227,134\"/><text x=\"412\" y=\"136\">관찰 구멍</text></svg>",
  "reflection": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 135\" role=\"img\" aria-label=\"거울에서방향이달라진빛\"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style><text x=\"15\" y=\"74\">빛 출발</text><path class=\"ray\" d=\"M95 70H285\"/><polygon fill=\"#2456c4\" points=\"285,70 276,66 276,74\"/><path class=\"edge\" d=\"M250 105L320 35\"/><path class=\"ray\" d=\"M285 70V16\"/><polygon fill=\"#2456c4\" points=\"285,16 281,25 289,25\"/><text x=\"334\" y=\"102\">평면거울</text><text x=\"310\" y=\"27\">진행 방향</text><path stroke=\"#8a9bb5\" d=\"M253 108l8 8m1-17l8 8m1-17l8 8m1-17l8 8m1-17l8 8m1-17l8 8m1-17l8 8\"/></svg>",
  "refraction": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 175\" role=\"img\" aria-label=\"공기와물의경계를지나는빛\"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style><rect x=\"30\" y=\"75\" width=\"440\" height=\"88\" fill=\"#edf5fb\"/><path d=\"M30 75H470\" stroke=\"#52637c\" stroke-width=\"2\"/><text x=\"382\" y=\"51\">공기</text><text x=\"398\" y=\"142\">물</text><path class=\"ray\" d=\"M85 18L235 75\"/><polygon fill=\"#2456c4\" points=\"235,75 228.00781881719917,68.06390583203445 225.16607673221057,75.54217447674124\"/><path class=\"ray\" d=\"M235 75L285 153\"/><polygon fill=\"#2456c4\" points=\"285,153 283.5105215233716,143.2644232904434 276.7754884116606,147.58175220820686\"/><text x=\"319\" y=\"95\">경계</text></svg>",
  "periscope": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 270\" role=\"img\" aria-label=\"두거울을이용한빛의경로\"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style><path d=\"M65 15H235V200H395M65 60H175V245H395\" fill=\"none\" stroke=\"#8a9bb5\" stroke-width=\"2\"/><path class=\"edge\" d=\"M166 22L218 74M166 195L218 247\"/><path class=\"ray\" d=\"M15 48H192\"/><polygon fill=\"#2456c4\" points=\"192,48 183,44 183,52\"/><path class=\"ray\" d=\"M192 48V221\"/><polygon fill=\"#2456c4\" points=\"192,221 196,212 188,212\"/><path class=\"ray\" d=\"M192 221H420\"/><polygon fill=\"#2456c4\" points=\"420,221 411,217 411,225\"/><text x=\"10\" y=\"92\">물체 쪽</text><text x=\"340\" y=\"205\">눈 쪽</text><text x=\"250\" y=\"85\">위 거울</text><text x=\"250\" y=\"258\">아래 거울</text></svg>",
  "lenses": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 190\" role=\"img\" aria-label=\"가운데두께가다른두렌즈\"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style><path d=\"M120 20Q170 85 120 150Q70 85 120 20Z\" fill=\"#edf5fb\" stroke=\"#52637c\" stroke-width=\"2\"/><path d=\"M300 20Q330 85 300 150H355Q325 85 355 20Z\" fill=\"#edf5fb\" stroke=\"#52637c\" stroke-width=\"2\"/><text x=\"87\" y=\"178\">볼록 렌즈</text><text x=\"292\" y=\"178\">오목 렌즈</text></svg>",
  "mirrorTask": "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 500 170\" role=\"img\" aria-label=\"경로를완성할거울과시작빛\"><style>text{font:16px sans-serif;fill:#182230}.ray{fill:none;stroke:#2456c4;stroke-width:3}.edge{fill:none;stroke:#52637c;stroke-width:3}</style><text x=\"15\" y=\"65\">출발</text><path class=\"ray\" d=\"M70 60H260\"/><polygon fill=\"#2456c4\" points=\"260,60 251,56 251,64\"/><path class=\"edge\" d=\"M220 100L300 20\"/><text x=\"322\" y=\"105\">거울</text><text x=\"70\" y=\"150\">화살표 끝에서 이어지는 경로를 그려요.</text></svg>",
  "sourcePencil": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u02-source-pencil.png\" alt=\"물에 비스듬히 넣은 연필의 관찰 사진\"><figcaption>지필드 이론6-1-1 24쪽의 관찰 예. 실제 연필의 모양과 보이는 모습을 구별해요.</figcaption></figure>",
  "sourceCoin": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u02-source-coin.png\" alt=\"물 유무에 따라 동전이 다르게 보이는 원교재의 두 사진\"><figcaption>같은 원교재의 비교 예. 사진만으로 눈·그릇·동전이 고정되었다고 확정하지 않아요.</figcaption></figure>",
  "sourceLens": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u02-source-lens.png\" alt=\"렌즈 앞뒤의 빛 자취를 종이 위에서 살펴본 원교재 사진\"><figcaption>지필드 이론6-1-1 25쪽의 볼록 렌즈 관찰 예. 진행 방향은 광원 위치와 함께 확인해요.</figcaption></figure>",
  "sourceMirror": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u02-source-mirror.png\" alt=\"접힌 안전 거울에 주변 모습이 비치는 원교재 사진\"><figcaption>지필드 실험6-A 18쪽의 거울 관찰 예. 여기서는 각도별 상의 개수 계산을 하지 않아요.</figcaption></figure>",
  "sourceSeeing": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u02-source-seeing-object.png\" alt=\"광원에서 물체를 거쳐 눈으로 빛이 진행하는 원교재 설명 그림\"><figcaption>지필드 이론6-1-1 23쪽의 기존 설명 그림. 화살표는 빛의 진행 방향이에요.</figcaption></figure>",
  "sourceLight": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u02-source-seeing-source.png\" alt=\"전등에서 나온 빛이 직접 눈으로 향하는 원교재 설명 그림\"><figcaption>같은 원교재의 기존 설명 그림. 켜진 전등은 스스로 빛을 내요.</figcaption></figure>",
  "sourcePeriscope": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u02-source-periscope.png\" alt=\"두 평면거울을 통하여 눈으로 빛이 이어지는 원교재 설명 그림\"><figcaption>같은 원교재의 한 배치 예. 물체 쪽 첫 거울과 눈 쪽 둘째 거울의 순서를 살펴요.</figcaption></figure>",
  "light-quick-0": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">2</th><td>빈칸</td><td>반사</td></tr><tr><th scope=\"row\">3</th><td>연결</td><td>(1) ㄴ (2) ㄱ</td></tr><tr><th scope=\"row\">4</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">5</th><td>빈칸</td><td>책</td></tr><tr><th scope=\"row\">6</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">7</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">8</th><td>순서</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">9</th><td>복수</td><td>①, ③</td></tr><tr><th scope=\"row\">10</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">11</th><td>빈칸</td><td>직진</td></tr><tr><th scope=\"row\">12</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">13</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">14</th><td>단답</td><td>전등·눈·다른 판 중 한 위치</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">15</th><td>연결</td><td>(1) ㄴ (2) ㄱ</td></tr><tr><th scope=\"row\">16</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>빈칸</td><td>평면거울</td></tr><tr><th scope=\"row\">18</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">19</th><td>순서</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">20</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">21</th><td>복수</td><td>②, ④</td></tr><tr><th scope=\"row\">22</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">23</th><td>빈칸</td><td>굴절</td></tr><tr><th scope=\"row\">24</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">25</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">26</th><td>연결</td><td>(1) ㄴ (2) ㄱ</td></tr><tr><th scope=\"row\">27</th><td>단답</td><td>꺼내 모양 확인 후 같은 조건 재비교</td></tr><tr><th scope=\"row\">28</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>",
  "light-quick-28": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">29</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">30</th><td>빈칸</td><td>반사</td></tr><tr><th scope=\"row\">31</th><td>순서</td><td>ㄷ → ㄱ → ㄴ → ㄹ</td></tr><tr><th scope=\"row\">32</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">33</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">34</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">35</th><td>빈칸</td><td>볼록</td></tr><tr><th scope=\"row\">36</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">37</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">38</th><td>단답</td><td>돋보기·씨앗의 겉모습 자세히</td></tr><tr><th scope=\"row\">39</th><td>복수</td><td>①, ④</td></tr><tr><th scope=\"row\">40</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">41</th><td>단답</td><td>꺼짐3회 안 보임 / 켜짐3회 보임</td></tr><tr><th scope=\"row\">42</th><td>객관식</td><td>②</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">43</th><td>빈칸</td><td>관찰</td></tr><tr><th scope=\"row\">44</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">45</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">46</th><td>순서</td><td>ㄴ → ㄹ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">47</th><td>단답</td><td>빛의 진행 방향 표시</td></tr><tr><th scope=\"row\">48</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">49</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">50</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">51</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">52</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">53</th><td>빈칸</td><td>광원 / 반사</td></tr><tr><th scope=\"row\">54</th><td>빈칸</td><td>직진 / 반사</td></tr><tr><th scope=\"row\">55</th><td>빈칸</td><td>굴절 / 눈</td></tr><tr><th scope=\"row\">56</th><td>빈칸</td><td>전 / 사실(내용)</td></tr></tbody></table></div>",
  "light-quick-56": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">57</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">58</th><td>빈칸</td><td>직진</td></tr><tr><th scope=\"row\">59</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">60</th><td>순서</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">61</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">62</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">63</th><td>연결</td><td>(1) ㄷ (2) ㄴ (3) ㄱ</td></tr><tr><th scope=\"row\">64</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">65</th><td>복수</td><td>②, ③</td></tr><tr><th scope=\"row\">66</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">67</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">68</th><td>빈칸</td><td>아래 거울</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">69</th><td>단답</td><td>돋보기·작은 글자 자세히</td></tr><tr><th scope=\"row\">70</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">71</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">72</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">73</th><td>단답</td><td>제공 자료 표시·내 결과와 구별</td></tr><tr><th scope=\"row\">74</th><td>복수</td><td>①, ④</td></tr><tr><th scope=\"row\">75</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">76</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>빈칸</td><td>반사 / 눈</td></tr><tr><th scope=\"row\">78</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">79</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>서술</td><td>교사 확인</td></tr></tbody></table></div>"
 }
};

export const lightPicturePriorWorkbook=withLightStudentLanguage(withLightEditorial(baseWorkbook));
export const lightReadablePriorWorkbook=withLightPictureGuide(lightPicturePriorWorkbook);
export const grade5StudyNotesPriorWorkbook=withLightReadableWorkbook(lightReadablePriorWorkbook);
export const workbook=withGrade5StudyNotes(grade5StudyNotesPriorWorkbook);
