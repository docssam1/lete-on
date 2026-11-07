import{withGrade3PracticeWorkbook}from'./c22-s32-practice-language.js?v=20261108-grade3-practice-language';
import{withSoundLearnerReasoning}from'./c22-s32-u03.rail-notes.js?v=20261105-sound-learner-reasoning';
import{withSoundPhotoLanguage}from'./c22-s32-u03.rail-notes.js?v=20261105-sound-motion-photo-language';
import{withSoundUpperScience}from'./c22-s32-u03.rail-notes.js?v=20261105-sound-upper-science';
import{withLearnerExplanations}from'./learner-explanations.js';
import {withStudentOpeningLanguage} from './student-opening-language.js';
import {withSoundRails} from './c22-s32-u03.rail-notes.js';
// 소리의 성질 A4. scripts/gen-science-workbook-c22s32u03.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s32-u03",
 "title": "소리의 성질",
 "semester": "3-2",
 "no": 3,
 "theme": "#5b4cc4",
 "richText": true,
 "questions": [
  {
   "id": "c22-s32-u03-w001",
   "no": 1,
   "form": "choice",
   "topic": "소리와 떨림",
   "prompt": "작은북의 떨림을 눈으로 확인할 때 알맞은 방법은 무엇인가요?",
   "answer": "② 가볍게 칠 때와 멈춘 뒤 종잇조각의 움직임을 비교한다.",
   "explanation": "눈으로 볼 근거는 북을 가볍게 칠 때와 멈춘 뒤 종잇조각이 어떻게 움직이는지예요. 북채의 위치나 높이, 정지 사진 한 장의 종잇조각 위치를 북 가죽의 시간에 따른 떨림과 같게 읽지 않아요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b01",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "눈으로 볼 근거는 북을 가볍게 칠 때와 멈춘 뒤 종잇조각이 어떻게 움직이는지예요. 북채의 위치나 높이, 정지 사진 한 장의 종잇조각 위치를 북 가죽의 시간에 따른 떨림과 같게 읽지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "북을 친 뒤 북채가 움직인 것만 북 가죽의 떨림으로 센다.",
    "가볍게 칠 때와 멈춘 뒤 종잇조각의 움직임을 비교한다.",
    "북채를 더 높이 들었는지만 보고 북의 떨림을 확정한다.",
    "정지 사진 한 장에서 종잇조각의 위치만 보고 움직임을 정한다.",
    "친 뒤 소리가 났다는 말만 적고 눈으로 볼 변화는 살피지 않는다."
   ],
   "key": 1
  },
  {
   "id": "c22-s32-u03-w002",
   "no": 2,
   "form": "choice",
   "topic": "소리와 떨림",
   "prompt": "자료에서 직접 관찰한 사실은 무엇인가요?",
   "answer": "⑤ 작은북을 가볍게 친 뒤 위의 종잇조각이 들썩였다.",
   "explanation": "가상 기록에 직접 적힌 것은 가볍게 친 뒤 종잇조각이 들썩였다는 모습이에요. 다른 물체의 높낮이·다음 날 움직임·종잇조각이 없을 때의 결과는 이 한 기록으로 확인하지 않았어요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b02",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceGivens": {
    "관찰 기록": "작은북을 가볍게 치자 위의 종잇조각이 들썩였습니다. 학습용 가상 기록이에요."
   },
   "sourceExplanation": "가상 기록에 직접 적힌 것은 가볍게 친 뒤 종잇조각이 들썩였다는 모습이에요. 다른 물체의 높낮이·다음 날 움직임·종잇조각이 없을 때의 결과는 이 한 기록으로 확인하지 않았어요.",
   "standard": "4과07-01",
   "figure": "given-c22-s32-u03-b02",
   "choices": [
    "종잇조각이 움직였으므로 모든 북의 소리 높이가 같았다.",
    "북을 치기 전에는 어떤 물체에도 떨림이 존재하지 않았다.",
    "이 종잇조각이 없으면 그 북에서는 소리가 나지 않는다.",
    "가볍게 쳤으므로 다음 날에도 종잇조각은 같은 만큼 움직인다.",
    "작은북을 가볍게 친 뒤 위의 종잇조각이 들썩였다."
   ],
   "key": 4
  },
  {
   "id": "c22-s32-u03-w003",
   "no": 3,
   "form": "choice",
   "topic": "소리와 떨림",
   "prompt": "소리굽쇠의 떨림을 관찰한 뒤 타당하게 설명한 것은 무엇인가요?",
   "answer": "① 소리가 나는 소리굽쇠의 떨림을 살펴 설명한다.",
   "explanation": "소리가 나는 소리굽쇠의 떨림과 관찰한 변화를 연결해 설명해요. 물 가까이에서 보인 변화가 물의 끓음이나 음의 높낮이를 재는 눈금인 것은 아니며, 물이 있어야만 소리가 나는 것도 아니에요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b03",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "소리가 나는 소리굽쇠의 떨림과 관찰한 변화를 연결해 설명해요. 물 가까이에서 보인 변화가 물의 끓음이나 음의 높낮이를 재는 눈금인 것은 아니며, 물이 있어야만 소리가 나는 것도 아니에요.",
   "standard": "4과07-01",
   "choices": [
    "소리가 나는 소리굽쇠의 떨림을 살펴 설명한다.",
    "물방울이 튀었으므로 물 온도가 높아져 끓었다고 설명한다.",
    "물방울이 높이 튀었으므로 소리의 높낮이도 높다고 설명한다.",
    "관찰 도구에 물이 있어야만 소리굽쇠가 소리를 낸다고 설명한다.",
    "물방울이 보이지 않은 순간에는 어떤 떨림도 없다고 확정한다."
   ],
   "key": 0
  },
  {
   "id": "c22-s32-u03-w004",
   "no": 4,
   "form": "choice",
   "topic": "소리와 떨림",
   "prompt": "같은 종의 울리는 상태와 멈춘 상태를 비교할 때 기록할 근거는 무엇인가요?",
   "answer": "④ 울릴 때와 멈춘 때 소리·떨림을 살핀 방법과 각각의 결과",
   "explanation": "같은 종이 울릴 때와 멈춘 때 각각 어떻게 소리와 떨림을 살폈고 무엇을 확인했는지 남겨요. 예상에 맞게 결과를 고치거나 다른 종의 기록을 옮기면 이 종의 두 상태를 비교한 근거가 되지 않아요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b04",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "같은 종이 울릴 때와 멈춘 때 각각 어떻게 소리와 떨림을 살폈고 무엇을 확인했는지 남겨요. 예상에 맞게 결과를 고치거나 다른 종의 기록을 옮기면 이 종의 두 상태를 비교한 근거가 되지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "실제로는 달랐지만 처음 예상과 같게 바꾼 두 조건의 결과",
    "소리는 듣지 않고 종이 클수록 높았을 것이라고만 쓴 설명",
    "눈에 떨림이 안 보였으므로 두 상태가 같았다고 정한 기록",
    "울릴 때와 멈춘 때 소리·떨림을 살핀 방법과 각각의 결과",
    "다른 종에서 들은 결과를 이 종의 두 상태로 옮겨 놓은 기록"
   ],
   "key": 3
  },
  {
   "id": "c22-s32-u03-w005",
   "no": 5,
   "form": "choice",
   "topic": "소리와 떨림",
   "prompt": "떨림이 눈에 잘 보이지 않을 때 알맞은 태도는 무엇인가요?",
   "answer": "③ 확인하지 못한 점을 남기고 안전한 다른 관찰 방법을 찾는다.",
   "explanation": "눈으로 떨림을 확인하지 못한 것은 이 방법에서 움직임이 잘 보이지 않았다는 기록이에요. 결과를 보았다고 채우지 않고, 교사와 안전한 시각·촉각 방법 등을 더 찾아 확인해요. 보이지 않음만으로 떨림이나 소리가 없었다고 단정하지 않아요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b05",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "눈으로 떨림을 확인하지 못한 것은 이 방법에서 움직임이 잘 보이지 않았다는 기록이에요. 결과를 보았다고 채우지 않고, 교사와 안전한 시각·촉각 방법 등을 더 찾아 확인해요. 보이지 않음만으로 떨림이나 소리가 없었다고 단정하지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "소리가 들렸으므로 보지 못한 움직임도 보았다고 채운다.",
    "눈에 안 보이면 그 물체에서는 소리도 안 났다고 고친다.",
    "확인하지 못한 점을 남기고 안전한 다른 관찰 방법을 찾는다.",
    "예시의 큰 움직임을 내 물체에서도 관찰한 것으로 옮긴다.",
    "눈에 보이지 않는다는 결과만으로 떨림이 전혀 없다고 정한다."
   ],
   "key": 2
  },
  {
   "id": "c22-s32-u03-w006",
   "no": 6,
   "form": "multi",
   "topic": "소리와 떨림",
   "prompt": "관찰 사실과 설명을 구별하여 기록한 것을 고르세요. (정답 2개)",
   "answer": "①, ②",
   "explanation": "종잇조각이 들썩인 모습은 관찰 사실, 그 움직임을 근거로 소리와 떨림의 관계를 말한 것은 설명이에요. 본 움직임을 기록하되 높낮이나 다른 북의 결과까지 실제로 확인한 사실로 합치지 않아요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "소리가 날 때 본 움직임을 근거로 떨림과의 관계를 설명한다.",
    "종잇조각이 들썩이는 모습을 직접 본 사실로 구별해 적는다.",
    "종잇조각이 들썩였으므로 소리의 높낮이도 높아졌다고 쓴다.",
    "다른 북의 움직임을 내가 살핀 북에서 본 사실로 합쳐 적는다.",
    "움직임을 보지 못한 경우도 예시와 같은 움직임을 보았다고 쓴다."
   ],
   "key": [
    0,
    1
   ],
   "sourceId": "c22-s32-u03-b06",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     0,
     1
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "종잇조각이 들썩인 모습은 관찰 사실, 그 움직임을 근거로 소리와 떨림의 관계를 말한 것은 설명이에요. 본 움직임을 기록하되 높낮이나 다른 북의 결과까지 실제로 확인한 사실로 합치지 않아요.",
   "standard": "4과07-01"
  },
  {
   "id": "c22-s32-u03-w007",
   "no": 7,
   "form": "short",
   "topic": "소리와 떨림",
   "prompt": "소리가 나는 물체에서 살펴볼 공통적인 움직임은 무엇인가요?",
   "answer": "떨림",
   "explanation": "소리가 나는 북 가죽·기타 줄 등의 떨림을 관찰해요. 보이는 변화와 소리의 관계를 근거로 설명해요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b07",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "떨림",
    "accepted": [
     "떨림",
     "떨리는 움직임",
     "진동"
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "소리가 나는 북 가죽·기타 줄 등의 떨림을 관찰해요. 보이는 변화와 소리의 관계를 근거로 설명해요.",
   "standard": "4과07-01",
   "accepted": [
    "떨림",
    "떨리는 움직임",
    "진동"
   ]
  },
  {
   "id": "c22-s32-u03-w008",
   "no": 8,
   "form": "written",
   "topic": "소리와 떨림",
   "prompt": "북을 친 때와 치지 않은 때를 비교한 가상 자료를 근거로 소리와 떨림의 관계를 설명해 보세요.",
   "answer": "북을 친 때에는 종잇조각이 움직이며 소리가 났고 치지 않은 때에는 움직임이 관찰되지 않았어요. 이 비교에서 소리가 날 때 북 가죽의 떨림을 살폈어요.",
   "explanation": "가볍게 친 때의 소리와 종잇조각 움직임을 치지 않은 때와 비교하여 떨림을 근거로 설명해요. 관찰하지 못했다는 기록을 모든 물체가 전혀 떨리지 않는다는 뜻으로 확대하지 않아요.",
   "misconception": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요.",
   "criteria": "두 조건의 관찰 차이를 근거로 씀 / 소리가 나는 물체의 떨림과 연결함",
   "lines": 3,
   "sourceId": "c22-s32-u03-b08",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "북을 친 때에는 종잇조각이 움직이며 소리가 났고 치지 않은 때에는 움직임이 관찰되지 않았어요. 이 비교에서 소리가 날 때 북 가죽의 떨림을 살폈어요.",
    "rubric": {
     "required": [
      "두 조건의 관찰 차이를 근거로 씀",
      "소리가 나는 물체의 떨림과 연결함"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
    }
   },
   "sourceGivens": {
    "표": {
     "머리": [
      "조건",
      "관찰"
     ],
     "행": [
      [
       "가볍게 친 때",
       "소리 남·위의 종잇조각이 움직임"
      ],
      [
       "치지 않은 때",
       "소리와 종잇조각 움직임을 관찰하지 못함"
      ]
     ]
    },
    "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
   },
   "sourceExplanation": "가볍게 친 때의 소리와 종잇조각 움직임을 치지 않은 때와 비교하여 떨림을 근거로 설명해요. 관찰하지 못했다는 기록을 모든 물체가 전혀 떨리지 않는다는 뜻으로 확대하지 않아요.",
   "standard": "4과07-01",
   "figure": "given-c22-s32-u03-b08"
  },
  {
   "id": "c22-s32-u03-w009",
   "no": 9,
   "form": "choice",
   "topic": "여러 감각과 안전",
   "prompt": "내 목소리의 떨림을 살피는 방법으로 알맞은 것은 무엇인가요?",
   "answer": "⑤ 내 목에 손을 살짝 대고 작게 말한다.",
   "explanation": "내 목에 가볍게 손을 대어 작은 목소리의 떨림을 살펴요. 목을 누르거나 귀 가까이에 큰 소리를 내지 않아요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b09",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "내 목에 가볍게 손을 대어 작은 목소리의 떨림을 살펴요. 목을 누르거나 귀 가까이에 큰 소리를 내지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "다른 친구의 목을 손으로 세게 누른다.",
    "귀 안에 손가락을 깊게 넣고 소리친다.",
    "가장 큰 소리를 오래 내며 겨루기 한다.",
    "아픈 느낌이 나도 소리를 계속 높인다.",
    "내 목에 손을 살짝 대고 작게 말한다."
   ],
   "key": 4
  },
  {
   "id": "c22-s32-u03-w010",
   "no": 10,
   "form": "choice",
   "topic": "여러 감각과 안전",
   "prompt": "청각만으로 비교하기 어려운 친구와 함께 관찰하는 방법은 무엇인가요?",
   "answer": "② 안전한 방법으로 눈에 보이는 움직임과 느낀 떨림도 살핀다.",
   "explanation": "소리의 떨림은 안전한 방법으로 눈에 보이는 움직임이나 손으로 느끼는 변화도 함께 살필 수 있어요. 관찰한 감각과 조건을 밝혀 서로의 기록을 비교하고, 같은 느낌을 강요하거나 확인하지 않은 감각을 대신 채우지 않아요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b10",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "소리의 떨림은 안전한 방법으로 눈에 보이는 움직임이나 손으로 느끼는 변화도 함께 살필 수 있어요. 관찰한 감각과 조건을 밝혀 서로의 기록을 비교하고, 같은 느낌을 강요하거나 확인하지 않은 감각을 대신 채우지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "듣는 기록이 어려우면 확인하지 않은 촉감을 대신 적는다.",
    "안전한 방법으로 눈에 보이는 움직임과 느낀 떨림도 살핀다.",
    "청각으로 확인한 기록만 남기고 눈으로 본 움직임은 빼 놓는다.",
    "모든 친구가 같은 느낌을 말할 때까지 소리만 계속 키운다.",
    "서로 다르게 기록했으면 예시에 맞는 한 사람의 느낌만 남긴다."
   ],
   "key": 1
  },
  {
   "id": "c22-s32-u03-w011",
   "no": 11,
   "form": "choice",
   "topic": "여러 감각과 안전",
   "prompt": "실 전화기 비교에서 안전한 방법은 무엇인가요?",
   "answer": "③ 작은 목소리로 말하며 조건을 비교한다.",
   "explanation": "작은 목소리로 같은 말을 하며 조건을 비교해요. 구멍과 날카로운 부분은 선생님이 준비하고 실을 몸에 감지 않아요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b11",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "작은 목소리로 같은 말을 하며 조건을 비교해요. 구멍과 날카로운 부분은 선생님이 준비하고 실을 몸에 감지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "날카로운 도구를 돌려 쓰며 구멍 낸다.",
    "귀에 컵을 대고 친구가 고함을 지른다.",
    "작은 목소리로 말하며 조건을 비교한다.",
    "팽팽한 실을 목에 감아 고정해 둔다.",
    "실을 귀 안으로 밀어 넣어 관찰한다."
   ],
   "key": 2
  },
  {
   "id": "c22-s32-u03-w012",
   "no": 12,
   "form": "choice",
   "topic": "여러 감각과 안전",
   "prompt": "관 피리를 비교하기 전에 확인할 일은 무엇인가요?",
   "answer": "① 선생님이 다듬은 안전한 끝부분",
   "explanation": "입 가까이에 쓰는 관은 선생님이 미리 다듬어 안전하게 준비해요. 개인 도구로 부드럽게 불고 끝이 거칠면 사용하지 않아요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b12",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "입 가까이에 쓰는 관은 선생님이 미리 다듬어 안전하게 준비해요. 개인 도구로 부드럽게 불고 끝이 거칠면 사용하지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "선생님이 다듬은 안전한 끝부분",
    "칼날이 잘 드는지 손으로 만진 결과",
    "누가 가장 큰 소리로 불 수 있는지",
    "날카로운 끝을 그대로 남긴 자국",
    "어느 관을 친구와 함께 입에 대는지"
   ],
   "key": 0
  },
  {
   "id": "c22-s32-u03-w013",
   "no": 13,
   "form": "choice",
   "topic": "여러 감각과 안전",
   "prompt": "소리가 불편하거나 귀가 아플 때의 행동은 무엇인가요?",
   "answer": "④ 멈추고 선생님에게 알린다.",
   "explanation": "불편하면 즉시 관찰을 멈추고 선생님에게 알려요. 더 크게·가까이·오래 듣는 것으로 실험을 이어 가지 않아요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b13",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "불편하면 즉시 관찰을 멈추고 선생님에게 알려요. 더 크게·가까이·오래 듣는 것으로 실험을 이어 가지 않아요.",
   "standard": "4과07-01",
   "choices": [
    "더 가까이에서 오래 듣는다.",
    "다른 귀로 번갈아 참아 듣는다.",
    "비교가 끝날 때까지 더 키운다.",
    "멈추고 선생님에게 알린다.",
    "아픈 친구만 참고 듣게 한다."
   ],
   "key": 3
  },
  {
   "id": "c22-s32-u03-w014",
   "no": 14,
   "form": "multi",
   "topic": "여러 감각과 안전",
   "prompt": "안전한 관찰 계획을 고르세요. (정답 2개)",
   "answer": "①, ③",
   "explanation": "안전한 작은 소리로 짧게 비교하고 시각·촉각 근거도 활용해요. 큰 소리나 무거운 물체의 낙하를 관찰 방법으로 쓰지 않아요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "관찰이 어려우면 다른 감각도 이용한다.",
    "친구가 불편해도 소리를 계속 높인다.",
    "큰 소리를 내지 않고 짧게 비교한다.",
    "무거운 물체를 떨어뜨려 효과음을 낸다.",
    "귀 가까이에서 악기를 세게 두드린다."
   ],
   "key": [
    0,
    2
   ],
   "sourceId": "c22-s32-u03-b14",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     0,
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "안전한 작은 소리로 짧게 비교하고 시각·촉각 근거도 활용해요. 큰 소리나 무거운 물체의 낙하를 관찰 방법으로 쓰지 않아요.",
   "standard": "4과07-01"
  },
  {
   "id": "c22-s32-u03-w015",
   "no": 15,
   "form": "short",
   "topic": "여러 감각과 안전",
   "prompt": "서로 다른 감각을 활용할 때 눈으로 움직임을 살피는 감각은 무엇인가요?",
   "answer": "시각",
   "explanation": "종잇조각이나 물의 움직임을 눈으로 보는 것은 시각 관찰이에요. 실제로 확인하지 못했다면 더 확인으로 남겨요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b15",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "시각",
    "accepted": [
     "시각",
     "눈으로 보기",
     "눈"
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "종잇조각이나 물의 움직임을 눈으로 보는 것은 시각 관찰이에요. 실제로 확인하지 못했다면 더 확인으로 남겨요.",
   "standard": "4과07-01",
   "accepted": [
    "시각",
    "눈으로 보기",
    "눈"
   ]
  },
  {
   "id": "c22-s32-u03-w016",
   "no": 16,
   "form": "written",
   "topic": "여러 감각과 안전",
   "prompt": "소리를 듣기 어려운 친구도 참여할 수 있게 떨림 관찰 방법과 안전 약속을 제안해 보세요.",
   "answer": "북 위 종잇조각의 움직임을 함께 보거나 내 목에 손을 가볍게 대어 떨림을 살필 수 있어요. 작은 목소리로 짧게 비교하고 불편하면 멈춰요.",
   "explanation": "눈으로 종잇조각을 보거나 내 목의 떨림을 가볍게 느끼는 등 여러 참여 방법을 제안해요. 작은 소리·짧은 비교·불편하면 멈추기를 포함하고 서로 같은 느낌을 강요하지 않아요.",
   "misconception": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요.",
   "criteria": "여러 감각을 이용한 타당한 방법 / 관찰에 맞는 구체적인 안전 약속",
   "lines": 3,
   "sourceId": "c22-s32-u03-b16",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "북 위 종잇조각의 움직임을 함께 보거나 내 목에 손을 가볍게 대어 떨림을 살필 수 있어요. 작은 목소리로 짧게 비교하고 불편하면 멈춰요.",
    "rubric": {
     "required": [
      "여러 감각을 이용한 타당한 방법",
      "관찰에 맞는 구체적인 안전 약속"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
    }
   },
   "sourceGivens": null,
   "sourceExplanation": "눈으로 종잇조각을 보거나 내 목의 떨림을 가볍게 느끼는 등 여러 참여 방법을 제안해요. 작은 소리·짧은 비교·불편하면 멈추기를 포함하고 서로 같은 느낌을 강요하지 않아요.",
   "standard": "4과07-01"
  },
  {
   "id": "c22-s32-u03-w017",
   "no": 17,
   "form": "choice",
   "topic": "소리의 세기",
   "prompt": "같은 북에서 두드리는 정도에 따른 세기를 비교할 때 같게 할 조건은 무엇인가요?",
   "answer": "③ 북과 듣는 위치를 같게 한다.",
   "explanation": "북과 듣는 위치 등 다른 조건을 같게 하고 두드리는 정도를 바꾸어요. 여러 조건을 한꺼번에 바꾸면 어떤 차이 때문인지 설명하기 어려워요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b17",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "북과 듣는 위치 등 다른 조건을 같게 하고 두드리는 정도를 바꾸어요. 여러 조건을 한꺼번에 바꾸면 어떤 차이 때문인지 설명하기 어려워요.",
   "standard": "4과07-02",
   "choices": [
    "북 종류와 듣는 거리를 함께 바꾼다.",
    "한 번은 북 한 번은 피리를 쓴다.",
    "북과 듣는 위치를 같게 한다.",
    "한 번은 멀리 한 번은 바로 옆에 선다.",
    "두 번의 관찰 결과를 미리 같게 쓴다."
   ],
   "key": 2
  },
  {
   "id": "c22-s32-u03-w018",
   "no": 18,
   "form": "choice",
   "topic": "소리의 세기",
   "prompt": "가상 관찰 표에서 세기가 더 큰 조건은 무엇인가요?",
   "answer": "① 조금 더 세게 친 나에서 더 큰 소리가 난 조건",
   "explanation": "표의 나는 조금 더 세게 쳤을 때 더 큰 소리와 더 많은 종잇조각 움직임을 기록한 조건이에요. 묻는 것은 크고 작음인 세기이며, 높낮이 변화나 북의 재료 변화는 표에 제시되지 않았어요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b18",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceGivens": {
    "표": {
     "머리": [
      "조건",
      "관찰"
     ],
     "행": [
      [
       "가·약하게 침",
       "작은 소리·종잇조각 조금 움직임"
      ],
      [
       "나·조금 더 세게 침",
       "더 큰 소리·종잇조각 더 움직임"
      ]
     ]
    },
    "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
   },
   "sourceExplanation": "표의 나는 조금 더 세게 쳤을 때 더 큰 소리와 더 많은 종잇조각 움직임을 기록한 조건이에요. 묻는 것은 크고 작음인 세기이며, 높낮이 변화나 북의 재료 변화는 표에 제시되지 않았어요.",
   "standard": "4과07-02",
   "figure": "given-c22-s32-u03-b18",
   "choices": [
    "조금 더 세게 친 나에서 더 큰 소리가 난 조건",
    "가와 나의 높낮이가 모두 높아졌다는 조건",
    "약하게 친 가에서 더 작은 소리가 난 조건",
    "가와 나의 북 재료가 서로 바뀌었다는 조건",
    "움직임이 다르므로 두 조건 모두 소리가 없었다는 조건"
   ],
   "key": 0
  },
  {
   "id": "c22-s32-u03-w019",
   "no": 19,
   "form": "choice",
   "topic": "소리의 세기",
   "prompt": "친구보다 가까운 곳에서 들어 더 크게 느꼈습니다. 북을 친 힘이 더 컸다고 정하기 어려운 까닭은 무엇인가요?",
   "answer": "⑤ 두드리는 정도 외에 듣는 거리도 달랐기 때문이다.",
   "explanation": "듣는 거리가 다르면 느낀 소리 크기에 그 영향도 섞일 수 있어요. 더 크게 들렸다는 결과만으로 북을 친 힘만 달랐다고 설명하기 어려우므로, 같은 북과 듣는 위치에서 두드리는 정도를 비교해요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b19",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "듣는 거리가 다르면 느낀 소리 크기에 그 영향도 섞일 수 있어요. 더 크게 들렸다는 결과만으로 북을 친 힘만 달랐다고 설명하기 어려우므로, 같은 북과 듣는 위치에서 두드리는 정도를 비교해요.",
   "standard": "4과07-02",
   "choices": [
    "가까이 들으면 북을 친 힘도 함께 커진 것이기 때문이다.",
    "큰 소리로 느꼈으면 높낮이도 반드시 높아진 것이기 때문이다.",
    "두 사람의 느낌이 다르면 북에서 소리가 안 난 것이기 때문이다.",
    "듣는 거리가 달라도 그 영향은 언제나 없기 때문이다.",
    "두드리는 정도 외에 듣는 거리도 달랐기 때문이다."
   ],
   "key": 4
  },
  {
   "id": "c22-s32-u03-w020",
   "no": 20,
   "form": "choice",
   "topic": "소리의 세기",
   "prompt": "같은 건반을 눌러 큰 소리와 작은 소리를 냈습니다. 바꾸어 비교한 성질은 무엇인가요?",
   "answer": "② 크고 작은 정도인 세기",
   "explanation": "같은 건반에서 큰 소리와 작은 소리를 비교했으므로 바꾼 성질은 세기예요. 크고 작음을 높고 낮음, 소리 나는 물체의 수나 길이와 바꾸어 읽지 않아요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b20",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "같은 건반에서 큰 소리와 작은 소리를 비교했으므로 바꾼 성질은 세기예요. 크고 작음을 높고 낮음, 소리 나는 물체의 수나 길이와 바꾸어 읽지 않아요.",
   "standard": "4과07-02",
   "choices": [
    "높고 낮은 정도인 높낮이",
    "크고 작은 정도인 세기",
    "소리를 만드는 건반의 길이",
    "소리를 전하는 공기의 유무",
    "소리 내는 건반의 개수"
   ],
   "key": 1
  },
  {
   "id": "c22-s32-u03-w021",
   "no": 21,
   "form": "choice",
   "topic": "소리의 세기",
   "prompt": "두 번의 비교 결과가 서로 달랐을 때 알맞은 일은 무엇인가요?",
   "answer": "④ 두드리는 방법과 듣는 위치를 맞추어 다시 비교한다.",
   "explanation": "다른 결과도 그대로 남기고 두드리는 방법·듣는 자리 등 비교 조건을 확인한 뒤 다시 살펴요. 같은 북이라는 조건 하나가 다른 조건까지 같다는 뜻은 아니며, 예시에 맞는 결과만 남기면 차이의 근거가 사라져요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b21",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "다른 결과도 그대로 남기고 두드리는 방법·듣는 자리 등 비교 조건을 확인한 뒤 다시 살펴요. 같은 북이라는 조건 하나가 다른 조건까지 같다는 뜻은 아니며, 예시에 맞는 결과만 남기면 차이의 근거가 사라져요.",
   "standard": "4과07-02",
   "choices": [
    "예시와 다른 결과만 지운 뒤 같은 조건이었다고 정한다.",
    "같은 북이면 듣는 거리가 달라도 조건은 모두 같다고 정한다.",
    "더 크게 들린 결과만 남겨 늘 같은 세기였다고 결론낸다.",
    "두드리는 방법과 듣는 위치를 맞추어 다시 비교한다.",
    "두 결과가 다르므로 실제 관찰 대신 처음 예상만 남긴다."
   ],
   "key": 3
  },
  {
   "id": "c22-s32-u03-w022",
   "no": 22,
   "form": "multi",
   "topic": "소리의 세기",
   "prompt": "세기 비교를 공정하게 할 조건을 고르세요. (정답 2개)",
   "answer": "①, ④",
   "explanation": "다른 조건을 같게 하여 두드리는 정도의 영향을 살펴요. 관찰 결과는 예상과 달라도 그대로 기록해요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "두드리는 정도만 바꾸어 비교한다.",
    "북 종류와 듣는 거리를 모두 바꾼다.",
    "매번 다른 소리를 듣고 같은 값으로 쓴다.",
    "같은 북과 같은 듣는 위치를 쓴다.",
    "처음 예상에 맞는 기록만 남긴다."
   ],
   "key": [
    0,
    3
   ],
   "sourceId": "c22-s32-u03-b22",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     0,
     3
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "다른 조건을 같게 하여 두드리는 정도의 영향을 살펴요. 관찰 결과는 예상과 달라도 그대로 기록해요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w023",
   "no": 23,
   "form": "short",
   "topic": "소리의 세기",
   "prompt": "소리가 크고 작은 정도를 무엇이라고 하나요?",
   "answer": "세기",
   "explanation": "크고 작은 정도는 소리의 세기이고 높고 낮은 정도는 높낮이예요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b23",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "세기",
    "accepted": [
     "세기",
     "소리의 세기"
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "크고 작은 정도는 소리의 세기이고 높고 낮은 정도는 높낮이예요.",
   "standard": "4과07-02",
   "accepted": [
    "세기",
    "소리의 세기"
   ]
  },
  {
   "id": "c22-s32-u03-w024",
   "no": 24,
   "form": "written",
   "topic": "소리의 세기",
   "prompt": "같은 북을 약하게 칠 때와 조금 더 세게 칠 때를 비교하는 계획을 써 보세요. 같게 할 조건과 기록할 결과를 넣어 보세요.",
   "answer": "같은 북을 같은 위치에 두고 같은 자리에서 들어요. 안전한 범위에서 두드리는 정도만 바꾸고 들리는 크기와 종잇조각의 움직임을 각각 기록해요.",
   "explanation": "같은 북·듣는 위치 등은 유지하고 두드리는 정도만 바꾸어요. 들리는 크기와 종잇조각 움직임을 실제 결과로 남기며 아직 비교하지 않았다면 계획으로 표시해요.",
   "misconception": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요.",
   "criteria": "다른 조건을 같게 하는 계획 / 세기·떨림의 실제 결과를 남길 항목",
   "lines": 3,
   "sourceId": "c22-s32-u03-b24",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "같은 북을 같은 위치에 두고 같은 자리에서 들어요. 안전한 범위에서 두드리는 정도만 바꾸고 들리는 크기와 종잇조각의 움직임을 각각 기록해요.",
    "rubric": {
     "required": [
      "다른 조건을 같게 하는 계획",
      "세기·떨림의 실제 결과를 남길 항목"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
    }
   },
   "sourceGivens": null,
   "sourceExplanation": "같은 북·듣는 위치 등은 유지하고 두드리는 정도만 바꾸어요. 들리는 크기와 종잇조각 움직임을 실제 결과로 남기며 아직 비교하지 않았다면 계획으로 표시해요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w025",
   "no": 25,
   "form": "choice",
   "topic": "길이 비교 설계",
   "prompt": "같은 자에서 내민 길이에 따른 높낮이 차이를 알아보려 해요. 바꿀 조건 한 가지는?",
   "answer": "④ 책상 밖으로 내민 자의 길이",
   "explanation": "길이만 바꾸고 같은 자·고정 방법·튕기는 정도·듣는 위치를 비슷하게 맞추어요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-02",
   "replacesHeldBankId": "c22-s32-u03-b25",
   "choices": [
    "자를 만든 물질의 종류",
    "자의 두께와 너비",
    "자를 고정해 누르는 방법",
    "책상 밖으로 내민 자의 길이",
    "소리를 듣는 사람의 위치"
   ],
   "key": 3
  },
  {
   "id": "c22-s32-u03-w026",
   "no": 26,
   "form": "choice",
   "topic": "길이와 높낮이",
   "prompt": "같은 재료·굵기의 한쪽이 막힌 관을 같은 방식으로 부드럽게 불어요. 길이만 다른 표의 세 관 중 가장 높은 소리가 날 것으로 예상되는 관은 무엇인가요?",
   "answer": "③ 가·8cm로 가장 짧은 관",
   "explanation": "이 비교는 관의 재료·굵기·막힌 방식과 부는 방법을 맞추고 길이만 다르게 해요. 같은 조건에서는 짧은 관 쪽이 더 높은 음을 낼 것으로 예상하므로, 8cm로 가장 짧은 가를 골라요. 표에는 소리의 높낮이를 실제로 잰 값은 없어요.",
   "misconception": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b26",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceGivens": {
    "표": {
     "머리": [
      "관",
      "길이"
     ],
     "행": [
      [
       "가",
       "8 cm"
      ],
      [
       "나",
       "11 cm"
      ],
      [
       "다",
       "14 cm"
      ]
     ]
    },
    "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
   },
   "sourceExplanation": "이 비교는 관의 재료·굵기·막힌 방식과 부는 방법을 맞추고 길이만 다르게 해요. 같은 조건에서는 짧은 관 쪽이 더 높은 음을 낼 것으로 예상하므로, 8cm로 가장 짧은 가를 골라요. 표에는 소리의 높낮이를 실제로 잰 값은 없어요.",
   "standard": "4과07-02",
   "figure": "given-c22-s32-u03-b26",
   "choices": [
    "세 관은 길이가 달라도 모두 같은 높이의 소리를 낸다.",
    "나·11cm로 중간 길이인 관",
    "가·8cm로 가장 짧은 관",
    "다·14cm로 가장 긴 관",
    "가·나·다 중 어떤 관이든 길이는 높낮이와 관계없다."
   ],
   "key": 2
  },
  {
   "id": "c22-s32-u03-w027",
   "no": 27,
   "form": "choice",
   "topic": "길이와 높낮이",
   "prompt": "길이 비교에서 한 관만 매우 세게 불어 다른 음이 났습니다. 다음에 할 일은 무엇인가요?",
   "answer": "② 길이 외의 부는 방법도 맞춘 뒤 부드럽게 다시 비교한다.",
   "explanation": "한 관만 매우 세게 불었다면 길이와 소리 내는 방법이 함께 달라진 비교예요. 부는 방법을 맞추고 부드럽게 다시 비교해야 길이와 높낮이의 관계를 살필 수 있어요. 큰 소리와 높은 소리도 구별해 기록해요.",
   "misconception": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b27",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "한 관만 매우 세게 불었다면 길이와 소리 내는 방법이 함께 달라진 비교예요. 부는 방법을 맞추고 부드럽게 다시 비교해야 길이와 높낮이의 관계를 살필 수 있어요. 큰 소리와 높은 소리도 구별해 기록해요.",
   "standard": "4과07-02",
   "choices": [
    "더 크게 들린 관은 실제 길이도 더 짧아졌다고 고쳐 적는다.",
    "길이 외의 부는 방법도 맞춘 뒤 부드럽게 다시 비교한다.",
    "부는 정도가 달라도 길이만의 영향으로 보고 결론낸다.",
    "높은 소리가 났으므로 그 관의 소리 세기도 가장 작다고 정한다.",
    "세게 불어 난 음을 같은 방식으로 낸 음과 같은 조건으로 묶는다."
   ],
   "key": 1
  },
  {
   "id": "c22-s32-u03-w028",
   "no": 28,
   "form": "choice",
   "topic": "길이와 높낮이",
   "prompt": "자료의 두 자를 보고 길이만의 효과라고 정하기 어려운 까닭은 무엇인가요?",
   "answer": "⑤ 내민 길이뿐 아니라 자의 재료와 두께도 다르다.",
   "explanation": "가는 얇은 플라스틱 자이고 나는 두꺼운 나무 자라서 길이 외에 재료와 두께도 달라요. 고정·튕김·듣는 자리까지 확인하고 같은 자의 내민 길이만 바꾸는 비교로 다시 살펴야 길이의 영향을 나누어 설명할 수 있어요.",
   "misconception": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b28",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": {
    "자료": "가: 얇은 플라스틱 자, 밖 길이 8 cm / 나: 두꺼운 나무 자, 밖 길이 12 cm. 학습용 가상 조건이에요."
   },
   "sourceExplanation": "가는 얇은 플라스틱 자이고 나는 두꺼운 나무 자라서 길이 외에 재료와 두께도 달라요. 고정·튕김·듣는 자리까지 확인하고 같은 자의 내민 길이만 바꾸는 비교로 다시 살펴야 길이의 영향을 나누어 설명할 수 있어요.",
   "standard": "4과07-02",
   "figure": "given-c22-s32-u03-b28",
   "choices": [
    "두 자의 내민 길이가 같으므로 바꾼 조건이 없다.",
    "두 자를 같은 날 비교하면 재료의 차이는 없어지기 때문이다.",
    "밖 길이를 적으면 두 자의 두께도 같아진 것으로 볼 수 있다.",
    "재료 이름을 알면 고정 방법의 차이는 결과에 영향을 못 준다.",
    "내민 길이뿐 아니라 자의 재료와 두께도 다르다."
   ],
   "key": 4
  },
  {
   "id": "c22-s32-u03-w029",
   "no": 29,
   "form": "choice",
   "topic": "길이와 높낮이",
   "prompt": "같은 자에서 밖으로 나온 길이가 짧을 때 높은 소리가 났습니다. 타당한 결론은 무엇인가요?",
   "answer": "① 이 자를 비교한 조건에서는 짧게 내밀 때 소리가 더 높았다.",
   "explanation": "같은 자를 비교한 조건에서 짧게 내민 쪽의 소리가 더 높았다는 범위로 결론을 써요. 높았다는 결과를 언제나 더 크다는 세기 설명이나 재료가 다른 모든 물체에 대한 판단으로 넓히지 않아요.",
   "misconception": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b29",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "같은 자를 비교한 조건에서 짧게 내민 쪽의 소리가 더 높았다는 범위로 결론을 써요. 높았다는 결과를 언제나 더 크다는 세기 설명이나 재료가 다른 모든 물체에 대한 판단으로 넓히지 않아요.",
   "standard": "4과07-02",
   "choices": [
    "이 자를 비교한 조건에서는 짧게 내밀 때 소리가 더 높았다.",
    "같은 자이면 듣는 위치와 고정 방법은 달라도 결과가 늘 같다.",
    "길이가 긴 어떤 물체도 소리를 전혀 내지 못한다.",
    "더 높은 소리가 났으므로 세기도 언제나 더 크다고 할 수 있다.",
    "이 자의 한 번 결과로 재료가 다른 모든 물체도 같다고 정한다."
   ],
   "key": 0
  },
  {
   "id": "c22-s32-u03-w030",
   "no": 30,
   "form": "multi",
   "topic": "길이와 높낮이",
   "prompt": "길이에 따른 높낮이 기록에 필요한 것을 고르세요. (정답 2개)",
   "answer": "②, ③",
   "explanation": "길이에 따른 높낮이를 설명하려면 실제 내민 길이와 단위, 같게 한 재료·두께·고정·소리 내는 방법을 함께 읽을 수 있어야 해요. 관찰하지 않은 값을 채우거나 크고 작음을 높고 낮음으로 바꾸어 기록하지 않아요.",
   "misconception": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "내민 길이가 다른데 같은 길이로 고쳐 놓은 관찰 기록",
    "같게 한 재료·두께·고정과 소리 내는 방법",
    "실제로 책상 밖에 나온 길이와 길이의 단위",
    "관찰하지 않은 길이에 예시의 높낮이를 그대로 채운 기록",
    "높낮이 대신 크고 작음만 듣고 둘을 같은 성질로 쓴 기록"
   ],
   "key": [
    1,
    2
   ],
   "sourceId": "c22-s32-u03-b30",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     1,
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "길이에 따른 높낮이를 설명하려면 실제 내민 길이와 단위, 같게 한 재료·두께·고정·소리 내는 방법을 함께 읽을 수 있어야 해요. 관찰하지 않은 값을 채우거나 크고 작음을 높고 낮음으로 바꾸어 기록하지 않아요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w031",
   "no": 31,
   "form": "short",
   "topic": "길이와 높낮이",
   "prompt": "소리가 높고 낮은 정도를 무엇이라고 하나요?",
   "answer": "높낮이",
   "explanation": "높고 낮은 정도는 소리의 높낮이예요. 소리가 큰지 작은지와는 구별해요.",
   "misconception": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b31",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "높낮이",
    "accepted": [
     "높낮이",
     "소리의 높낮이"
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "높고 낮은 정도는 소리의 높낮이예요. 소리가 큰지 작은지와는 구별해요.",
   "standard": "4과07-02",
   "accepted": [
    "높낮이",
    "소리의 높낮이"
   ]
  },
  {
   "id": "c22-s32-u03-w032",
   "no": 32,
   "form": "written",
   "topic": "길이와 높낮이",
   "prompt": "같은 자의 책상 밖 길이를 바꾼 가상 자료로 높낮이를 설명하고, 실제로 비교할 때 같게 할 조건을 한 가지 써 보세요.",
   "answer": "표에서는 8 cm일 때 12 cm일 때보다 높은 소리가 났어요. 같은 자를 같은 방법으로 고정하고 튕기는 정도와 듣는 위치를 맞추어 비교해요.",
   "explanation": "가상 표의8 cm와12 cm 조건에서 높고 낮은 소리를 연결해요. 실제 비교에서는 같은 자·고정 방법·튕기는 정도·듣는 위치를 맞추어 길이 외의 영향을 줄여요.",
   "misconception": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요.",
   "criteria": "제시된 길이·높낮이 관계를 근거로 씀 / 같게 할 타당한 조건을 제안함",
   "lines": 3,
   "sourceId": "c22-s32-u03-b32",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "표에서는 8 cm일 때 12 cm일 때보다 높은 소리가 났어요. 같은 자를 같은 방법으로 고정하고 튕기는 정도와 듣는 위치를 맞추어 비교해요.",
    "rubric": {
     "required": [
      "제시된 길이·높낮이 관계를 근거로 씀",
      "같게 할 타당한 조건을 제안함"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
    }
   },
   "sourceGivens": {
    "표": {
     "머리": [
      "밖 길이",
      "소리"
     ],
     "행": [
      [
       "8 cm",
       "더 높음"
      ],
      [
       "12 cm",
       "더 낮음"
      ]
     ]
    },
    "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
   },
   "sourceExplanation": "가상 표의8 cm와12 cm 조건에서 높고 낮은 소리를 연결해요. 실제 비교에서는 같은 자·고정 방법·튕기는 정도·듣는 위치를 맞추어 길이 외의 영향을 줄여요.",
   "standard": "4과07-02",
   "figure": "given-c22-s32-u03-b32"
  },
  {
   "id": "c22-s32-u03-w033",
   "no": 33,
   "form": "choice",
   "topic": "세기와 높낮이 구별",
   "prompt": "같은 높이의 음을 작게 내다가 더 크게 냈습니다. 달라진 소리의 성질은 무엇인가요?",
   "answer": "① 소리가 크고 작은 정도인 세기",
   "explanation": "문장에서 같은 높이의 음이라는 조건을 유지했고 크고 작은 정도만 달라졌어요. 그래서 세기가 달라졌다고 설명해요. 높낮이·소리의 지속 시간·사람 수의 변화는 이 문장에 제시되지 않았어요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b33",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "문장에서 같은 높이의 음이라는 조건을 유지했고 크고 작은 정도만 달라졌어요. 그래서 세기가 달라졌다고 설명해요. 높낮이·소리의 지속 시간·사람 수의 변화는 이 문장에 제시되지 않았어요.",
   "standard": "4과07-02",
   "choices": [
    "소리가 크고 작은 정도인 세기",
    "소리가 높고 낮은 정도인 높낮이",
    "목소리를 전하는 공기가 있는지",
    "소리가 이어지는 시간이 길고 짧은지",
    "소리를 내는 사람의 수가 많고 적은지"
   ],
   "key": 0
  },
  {
   "id": "c22-s32-u03-w034",
   "no": 34,
   "form": "choice",
   "topic": "세기와 높낮이 구별",
   "prompt": "피아노의 낮은 도와 높은 도를 소리가 비슷한 크기로 들리도록 연주했습니다. 구별하여 비교한 성질은 무엇인가요?",
   "answer": "④ 소리가 높고 낮은 정도인 높낮이",
   "explanation": "낮은 도와 높은 도는 높고 낮은 정도인 높낮이에서 구별돼요. 소리가 비슷한 크기로 들리도록 했다는 조건은 세기를 맞춘 것이므로, 크고 작음이나 사람 수를 비교한 문제와 구별해요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b34",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "낮은 도와 높은 도는 높고 낮은 정도인 높낮이에서 구별돼요. 소리가 비슷한 크기로 들리도록 했다는 조건은 세기를 맞춘 것이므로, 크고 작음이나 사람 수를 비교한 문제와 구별해요.",
   "standard": "4과07-02",
   "choices": [
    "소리가 이어지는 시간이 길고 짧은지",
    "건반을 누른 사람의 수가 많고 적은지",
    "공기를 통한 전달이 있는지 없는지",
    "소리가 높고 낮은 정도인 높낮이",
    "소리가 크고 작은 정도인 세기"
   ],
   "key": 3
  },
  {
   "id": "c22-s32-u03-w035",
   "no": 35,
   "form": "choice",
   "topic": "세기와 높낮이 구별",
   "prompt": "높은 소리와 작은 소리에 관한 타당한 설명은 무엇인가요?",
   "answer": "③ 높은 소리도 작게 낼 수 있다.",
   "explanation": "높낮이와 세기는 서로 다른 성질이에요. 높은 음을 작게 부르거나 낮은 음을 크게 부르는 비교가 가능해요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b35",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "높낮이와 세기는 서로 다른 성질이에요. 높은 음을 작게 부르거나 낮은 음을 크게 부르는 비교가 가능해요.",
   "standard": "4과07-02",
   "choices": [
    "작은 소리는 모두 낮은 소리다.",
    "낮은 소리는 반드시 들리지 않는다.",
    "높은 소리도 작게 낼 수 있다.",
    "큰 소리가 나면 높낮이는 없다.",
    "높은 소리는 언제나 가장 크다."
   ],
   "key": 2
  },
  {
   "id": "c22-s32-u03-w036",
   "no": 36,
   "form": "choice",
   "topic": "세기와 높낮이 구별",
   "prompt": "가상 효과음 표에서 높낮이는 같고 세기만 다른 두 소리는 무엇인가요?",
   "answer": "⑤ 가와 나",
   "explanation": "가와 나는 모두 높은 음이지만 크기가 작음·큼으로 달라요. 다는 낮은 음이라 높낮이도 달라요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b36",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceGivens": {
    "표": {
     "머리": [
      "소리",
      "높낮이",
      "세기"
     ],
     "행": [
      [
       "가",
       "높음",
       "작음"
      ],
      [
       "나",
       "높음",
       "큼"
      ],
      [
       "다",
       "낮음",
       "작음"
      ]
     ]
    },
    "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
   },
   "sourceExplanation": "가와 나는 모두 높은 음이지만 크기가 작음·큼으로 달라요. 다는 낮은 음이라 높낮이도 달라요.",
   "standard": "4과07-02",
   "figure": "given-c22-s32-u03-b36",
   "choices": [
    "비교할 수 있는 두 소리가 없음",
    "세 소리 모두",
    "가와 다",
    "나와 다",
    "가와 나"
   ],
   "key": 4
  },
  {
   "id": "c22-s32-u03-w037",
   "no": 37,
   "form": "choice",
   "topic": "세기와 높낮이 구별",
   "prompt": "작은 발소리 뒤에 큰 발소리를 넣는 효과음 계획에서 비교할 성질은 무엇인가요?",
   "answer": "② 크고 작은 정도인 세기 차이",
   "explanation": "계획에서 작은 발소리와 큰 발소리를 구별했으므로 크고 작음인 세기를 비교하려는 거예요. 높낮이·지속 시간·전달 물질의 차이는 이 계획에 주어진 비교 기준이 아니에요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b37",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "계획에서 작은 발소리와 큰 발소리를 구별했으므로 크고 작음인 세기를 비교하려는 거예요. 높낮이·지속 시간·전달 물질의 차이는 이 계획에 주어진 비교 기준이 아니에요.",
   "standard": "4과07-02",
   "choices": [
    "높고 낮은 정도만의 차이",
    "크고 작은 정도인 세기 차이",
    "소리가 이어지는 시간만의 차이",
    "발소리를 만드는 물체 개수만의 차이",
    "소리를 전하는 물질 종류만의 차이"
   ],
   "key": 1
  },
  {
   "id": "c22-s32-u03-w038",
   "no": 38,
   "form": "multi",
   "topic": "세기와 높낮이 구별",
   "prompt": "세기와 높낮이를 바르게 구별한 설명을 고르세요. (정답 2개)",
   "answer": "③, ④",
   "explanation": "낮은 음과 높은 음은 높낮이를, 같은 음을 작게 내다가 크게 낸 것은 세기를 구별한 설명이에요. 한 높낮이의 소리에서도 세기가 달라질 수 있으므로 두 성질을 같은 뜻으로 쓰지 않아요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "큰 소리를 내면 그 소리의 높낮이는 사라진다.",
    "높낮이가 같은 두 소리는 세기도 항상 같아야 한다.",
    "낮은 음과 높은 음은 높낮이를 구별한 설명이다.",
    "같은 음을 작게 내다가 크게 내면 세기가 달라진다.",
    "한 소리에서 높음과 작음은 함께 나타날 수 없다."
   ],
   "key": [
    2,
    3
   ],
   "sourceId": "c22-s32-u03-b38",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     2,
     3
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "낮은 음과 높은 음은 높낮이를, 같은 음을 작게 내다가 크게 낸 것은 세기를 구별한 설명이에요. 한 높낮이의 소리에서도 세기가 달라질 수 있으므로 두 성질을 같은 뜻으로 쓰지 않아요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w039",
   "no": 39,
   "form": "short",
   "topic": "세기와 높낮이 구별",
   "prompt": "같은 높이의 음을 작게 내다가 더 크게 냈습니다. 바꾼 소리의 성질은 무엇인가요?",
   "answer": "세기",
   "explanation": "같은 높이의 음을 유지하면서 더 크게 냈으므로 바뀐 성질은 세기예요. 조건을 유지한 높낮이와 바꾼 크고 작음을 나누어 읽어요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b39",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "세기",
    "accepted": [
     "세기",
     "소리의 세기"
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "같은 높이의 음을 유지하면서 더 크게 냈으므로 바뀐 성질은 세기예요. 조건을 유지한 높낮이와 바꾼 크고 작음을 나누어 읽어요.",
   "standard": "4과07-02",
   "accepted": [
    "세기",
    "소리의 세기"
   ]
  },
  {
   "id": "c22-s32-u03-w040",
   "no": 40,
   "form": "written",
   "topic": "세기와 높낮이 구별",
   "prompt": "“높은 소리는 언제나 큰 소리야.”라는 생각을 확인할 수 있는 안전한 비교 방법을 제안해 보세요.",
   "answer": "높은 음을 작은 목소리와 조금 더 큰 목소리로 짧게 내어 비교해요. 같은 높이에서도 세기가 다를 수 있는지 살피고 불편하면 멈춰요.",
   "explanation": "같은 높은 음을 작은 크기와 조금 더 큰 크기로 비교하면 높낮이와 세기가 다른 성질인지 확인할 수 있어요. 듣는 위치를 맞추고 귀가 불편해지도록 크게 내지 않아요.",
   "misconception": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요.",
   "criteria": "세기와 높낮이를 구별한 비교 / 큰 소리를 피하는 구체적 방법",
   "lines": 3,
   "sourceId": "c22-s32-u03-b40",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "높은 음을 작은 목소리와 조금 더 큰 목소리로 짧게 내어 비교해요. 같은 높이에서도 세기가 다를 수 있는지 살피고 불편하면 멈춰요.",
    "rubric": {
     "required": [
      "세기와 높낮이를 구별한 비교",
      "큰 소리를 피하는 구체적 방법"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
    }
   },
   "sourceGivens": null,
   "sourceExplanation": "같은 높은 음을 작은 크기와 조금 더 큰 크기로 비교하면 높낮이와 세기가 다른 성질인지 확인할 수 있어요. 듣는 위치를 맞추고 귀가 불편해지도록 크게 내지 않아요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w041",
   "no": 41,
   "form": "choice",
   "topic": "실 전화기 비교",
   "prompt": "같은 실 전화기에서 실을 손으로 잡는 효과를 알아보려 해요. 바꿀 조건 한 가지는?",
   "answer": "③ 실을 잡는지 놓는지",
   "explanation": "실을 잡는 여부만 바꾸고 전화기·목소리·거리·팽팽함을 비슷하게 맞추어 비교해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-03",
   "replacesHeldBankId": "c22-s32-u03-b41",
   "choices": [
    "실의 길이와 재료",
    "종이컵의 종류와 크기",
    "실을 잡는지 놓는지",
    "말하는 사람의 목소리 크기",
    "두 사람이 서 있는 위치"
   ],
   "key": 2
  },
  {
   "id": "c22-s32-u03-w042",
   "no": 42,
   "form": "choice",
   "topic": "여러 물질의 전달",
   "prompt": "서로 떨어진 두 친구가 교실에서 말하고 들어요. 두 사람 사이에서 목소리를 주로 전하는 물질은 무엇인가요?",
   "answer": "⑤ 두 사람 사이의 공기",
   "explanation": "떨어져 말하는 두 사람 사이의 목소리는 주로 기체인 공기를 통해 전달돼요. 손에 든 연필이나 바닥 지우개 같은 고체를 직접 잇고 살핀 비교와는 상황이 달라요. 이 답이 고체나 액체는 소리를 못 전한다는 뜻은 아니에요.",
   "misconception": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b42",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "떨어져 말하는 두 사람 사이의 목소리는 주로 기체인 공기를 통해 전달돼요. 손에 든 연필이나 바닥 지우개 같은 고체를 직접 잇고 살핀 비교와는 상황이 달라요. 이 답이 고체나 액체는 소리를 못 전한다는 뜻은 아니에요.",
   "standard": "4과07-03",
   "choices": [
    "두 사람이 입고 있는 옷의 천",
    "친구가 손에 든 연필의 나무",
    "바닥에 놓인 지우개의 고무",
    "책상 위에 놓인 종이의 물질",
    "두 사람 사이의 공기"
   ],
   "key": 4
  },
  {
   "id": "c22-s32-u03-w043",
   "no": 43,
   "form": "choice",
   "topic": "여러 물질의 전달",
   "prompt": "물속 두 지점 사이에서 소리가 전해진 가상 자료가 보여 주는 것은 무엇인가요?",
   "answer": "① 액체인 물도 소리를 전달한다.",
   "explanation": "이 자료는 물을 통한 소리의 전달을 보여 줘요. 전달되는 현상을 확인하는 범위이며 속력이나 높낮이까지 정하지 않아요.",
   "misconception": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b43",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "sourceGivens": {
    "자료": "방수 소리 장치와 방수 관찰 도구 사이에 물이 있고, 신호가 전해졌습니다. 학습용 가상 자료이며 일반 전자 기기를 물에 넣는 활동이 아니에요."
   },
   "sourceExplanation": "이 자료는 물을 통한 소리의 전달을 보여 줘요. 전달되는 현상을 확인하는 범위이며 속력이나 높낮이까지 정하지 않아요.",
   "standard": "4과07-03",
   "figure": "given-c22-s32-u03-b43",
   "choices": [
    "액체인 물도 소리를 전달한다.",
    "물이 있어야만 모든 소리가 난다.",
    "물에서는 언제나 소리가 사라진다.",
    "물속 소리는 언제나 더 높은 음이다.",
    "소리는 공기로만 전달된다."
   ],
   "key": 0
  },
  {
   "id": "c22-s32-u03-w044",
   "no": 44,
   "form": "choice",
   "topic": "여러 물질의 전달",
   "prompt": "나무 막대 비교의 결과를 해석할 때 확인할 것은 무엇인가요?",
   "answer": "④ 물질의 접촉·연결 경로와 소리를 낸 쪽·듣는 쪽의 조건",
   "explanation": "나무에 소리를 내고 듣는 쪽이 어떻게 접촉·연결되었는지, 다른 비교 조건은 어땠는지 확인해요. 들리는 차이를 높낮이 차이로 바로 바꾸거나 여러 경로를 하나의 경로로 단정하지 않아요.",
   "misconception": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b44",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "나무에 소리를 내고 듣는 쪽이 어떻게 접촉·연결되었는지, 다른 비교 조건은 어땠는지 확인해요. 들리는 차이를 높낮이 차이로 바로 바꾸거나 여러 경로를 하나의 경로로 단정하지 않아요.",
   "standard": "4과07-03",
   "choices": [
    "나무가 전했다고 정한 뒤 실제 접촉과 경로를 보지 않는다.",
    "나무 길이만 기록하고 소리를 내고 듣는 자리는 빼 놓는다.",
    "더 잘 들렸으므로 나무가 더 높은 음을 만들었다고 정한다.",
    "물질의 접촉·연결 경로와 소리를 낸 쪽·듣는 쪽의 조건",
    "서로 다른 경로의 결과를 하나의 같은 조건 결과로 합친다."
   ],
   "key": 3
  },
  {
   "id": "c22-s32-u03-w045",
   "no": 45,
   "form": "choice",
   "topic": "여러 물질의 전달",
   "prompt": "실 전화기에서 친구 말이 잘 들리지 않을 때 먼저 할 일은 무엇인가요?",
   "answer": "② 실의 팽팽함·컵과의 접촉·연결 상태를 살펴 다시 비교한다.",
   "explanation": "먼저 실의 팽팽함과 컵의 연결·접촉, 듣는 위치 등을 살펴 같은 작은 목소리로 다시 비교해요. 연결은 두고 목소리만 키우거나 여러 조건을 한꺼번에 바꾸면 무엇 때문에 차이가 났는지 설명하기 어려워요.",
   "misconception": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b45",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "먼저 실의 팽팽함과 컵의 연결·접촉, 듣는 위치 등을 살펴 같은 작은 목소리로 다시 비교해요. 연결은 두고 목소리만 키우거나 여러 조건을 한꺼번에 바꾸면 무엇 때문에 차이가 났는지 설명하기 어려워요.",
   "standard": "4과07-03",
   "choices": [
    "연결 상태는 두고 목소리만 계속 크게 하여 결과를 맞춘다.",
    "실의 팽팽함·컵과의 접촉·연결 상태를 살펴 다시 비교한다.",
    "듣는 거리가 달라도 결과는 같을 것이므로 위치는 살피지 않는다.",
    "실 길이와 컵도 함께 바꾼 뒤 실의 팽팽함만의 효과라고 정한다.",
    "잘 들린 다른 전화기의 결과를 지금 전화기의 결과로 대신 쓴다."
   ],
   "key": 1
  },
  {
   "id": "c22-s32-u03-w046",
   "no": 46,
   "form": "multi",
   "topic": "여러 물질의 전달",
   "prompt": "여러 물질을 통한 전달을 살피는 타당한 설명을 고르세요. (정답 2개)",
   "answer": "②, ③",
   "explanation": "공기·물·나무처럼 여러 물질을 통한 소리 전달 현상을 관찰할 수 있어요. 실제 비교한 연결 경로와 결과를 함께 남겨야 하며, 고체를 댔다는 이유만으로 공기를 통한 경로를 제외하거나 잘 들림을 높은 음과 같게 읽지 않아요.",
   "misconception": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "공기가 소리를 전하면 고체나 액체는 소리를 전할 수 없다.",
    "공기·물·나무 같은 여러 물질로 소리가 전해질 수 있다.",
    "비교한 물질의 연결 경로와 관찰 결과를 함께 기록한다.",
    "나무를 댄 조건에서 들리면 주변 공기를 통한 경로는 전혀 없다.",
    "더 잘 들린 물질은 전달한 소리의 높낮이도 언제나 더 높다."
   ],
   "key": [
    1,
    2
   ],
   "sourceId": "c22-s32-u03-b46",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     1,
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "공기·물·나무처럼 여러 물질을 통한 소리 전달 현상을 관찰할 수 있어요. 실제 비교한 연결 경로와 결과를 함께 남겨야 하며, 고체를 댔다는 이유만으로 공기를 통한 경로를 제외하거나 잘 들림을 높은 음과 같게 읽지 않아요.",
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w047",
   "no": 47,
   "form": "short",
   "topic": "여러 물질의 전달",
   "prompt": "실 전화기의 두 컵 사이에서 소리를 전하는 고체의 이름은 무엇인가요?",
   "answer": "실",
   "explanation": "이 활동에서는 고체인 실을 통한 전달을 살펴요. 실이 다른 물체에 닿는 조건과 목소리 크기도 함께 확인해요.",
   "misconception": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b47",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "실",
    "accepted": [
     "실",
     "팽팽한 실"
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "이 활동에서는 고체인 실을 통한 전달을 살펴요. 실이 다른 물체에 닿는 조건과 목소리 크기도 함께 확인해요.",
   "standard": "4과07-03",
   "accepted": [
    "실",
    "팽팽한 실"
   ]
  },
  {
   "id": "c22-s32-u03-w048",
   "no": 48,
   "form": "written",
   "topic": "여러 물질의 전달",
   "prompt": "실을 잡은 경우와 놓은 경우의 가상 자료에서 말할 수 있는 점과 더 확인할 조건을 설명해 보세요.",
   "answer": "이 자료에서는 같은 전화기의 실을 놓았을 때 말이 더 또렷하게 들렸어요. 목소리 크기·듣는 위치·실의 팽팽함이 같았는지 확인하고 실제로 해 보지 않았다면 자료 관찰이라고 밝혀요.",
   "explanation": "가상 표는 실을 놓은 때와 잡은 때의 또렷함 차이를 보여 줘요. 목소리·실의 팽팽함·듣는 위치도 같았는지 확인해야 실을 잡는 효과로 설명할 수 있어요.",
   "misconception": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요.",
   "criteria": "제시 자료의 차이를 근거로 설명함 / 비교 조건·자료의 한계를 짚음",
   "lines": 3,
   "sourceId": "c22-s32-u03-b48",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "이 자료에서는 같은 전화기의 실을 놓았을 때 말이 더 또렷하게 들렸어요. 목소리 크기·듣는 위치·실의 팽팽함이 같았는지 확인하고 실제로 해 보지 않았다면 자료 관찰이라고 밝혀요.",
    "rubric": {
     "required": [
      "제시 자료의 차이를 근거로 설명함",
      "비교 조건·자료의 한계를 짚음"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
    }
   },
   "sourceGivens": {
    "표": {
     "머리": [
      "조건",
      "관찰 기록"
     ],
     "행": [
      [
       "실을 놓음",
       "말이 더 또렷하게 들림"
      ],
      [
       "실을 손으로 잡음",
       "말이 덜 또렷하게 들림"
      ]
     ]
    },
    "안내": "문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요."
   },
   "sourceExplanation": "가상 표는 실을 놓은 때와 잡은 때의 또렷함 차이를 보여 줘요. 목소리·실의 팽팽함·듣는 위치도 같았는지 확인해야 실을 잡는 효과로 설명할 수 있어요.",
   "standard": "4과07-03",
   "figure": "given-c22-s32-u03-b48"
  },
  {
   "id": "c22-s32-u03-w049",
   "no": 49,
   "form": "choice",
   "topic": "소음 줄이기",
   "prompt": "같은 음악도 소음으로 느끼는 정도가 달라질 수 있는 까닭은 무엇인가요?",
   "answer": "⑤ 듣는 사람·시간·활동이 다를 수 있다.",
   "explanation": "소음은 사람·시간·장소·활동과 함께 살펴요. 소리 자체를 모두 나쁜 것으로 보거나 내 취향만으로 판단하지 않아요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b49",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "소음은 사람·시간·장소·활동과 함께 살펴요. 소리 자체를 모두 나쁜 것으로 보거나 내 취향만으로 판단하지 않아요.",
   "standard": "4과07-03",
   "choices": [
    "음악은 언제나 누구에게나 소음이다.",
    "좋아하는 음악은 밤새 크게 틀어도 된다.",
    "작은 음이면 누구에게도 방해가 안 된다.",
    "높은 음이면 상황과 관계없이 나쁘다.",
    "듣는 사람·시간·활동이 다를 수 있다."
   ],
   "key": 4
  },
  {
   "id": "c22-s32-u03-w050",
   "no": 50,
   "form": "choice",
   "topic": "소음 줄이기",
   "prompt": "의자를 끌 때 나는 소음을 줄일 계획으로 알맞은 것은 무엇인가요?",
   "answer": "② 안전하게 들어 옮기거나 덮개를 쓴다.",
   "explanation": "의자를 안전하게 옮기는 방법이나 다리 덮개로 소음 발생을 줄일 수 있어요. 실제 효과는 같은 조건에서 확인하고 계획과 실천을 구별해요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b50",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "의자를 안전하게 옮기는 방법이나 다리 덮개로 소음 발생을 줄일 수 있어요. 실제 효과는 같은 조건에서 확인하고 계획과 실천을 구별해요.",
   "standard": "4과07-03",
   "choices": [
    "바닥을 더 세게 긁으며 빨리 움직인다.",
    "안전하게 들어 옮기거나 덮개를 쓴다.",
    "아래층에 들리지 않았다고 미리 적는다.",
    "다른 친구가 공부할 때만 오래 끈다.",
    "끌리는 소리를 덮으려고 음악을 키운다."
   ],
   "key": 1
  },
  {
   "id": "c22-s32-u03-w051",
   "no": 51,
   "form": "choice",
   "topic": "소음 줄이기",
   "prompt": "계획한 소음 줄이기 행동의 효과를 알아볼 방법은 무엇인가요?",
   "answer": "④ 비슷한 조건에서 전후 소리와 상대 의견을 살핀다.",
   "explanation": "전후 장소·시간·행동과 듣는 위치 등 비교 조건을 비슷하게 맞추고 실제 소리와 상대 의견을 살펴요. 장소나 거리가 함께 달라진 차이를 모두 행동의 효과로 정하거나, 결과를 듣기 전에 모두 만족했다고 쓰지 않아요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b51",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "전후 장소·시간·행동과 듣는 위치 등 비교 조건을 비슷하게 맞추고 실제 소리와 상대 의견을 살펴요. 장소나 거리가 함께 달라진 차이를 모두 행동의 효과로 정하거나, 결과를 듣기 전에 모두 만족했다고 쓰지 않아요.",
   "standard": "4과07-03",
   "choices": [
    "전후 장소를 바꾸고 조용해진 차이는 모두 행동의 효과로 정한다.",
    "친구가 불편하다고 해도 내게 작게 들렸으면 모두 만족했다고 쓴다.",
    "방법이 좋아 보인다는 이유로 실제 소리를 듣기 전에 효과를 확정한다.",
    "비슷한 조건에서 전후 소리와 상대 의견을 살핀다.",
    "전후 들은 거리가 달라도 그 차이는 설명하지 않고 결과만 합친다."
   ],
   "key": 3
  },
  {
   "id": "c22-s32-u03-w052",
   "no": 52,
   "form": "choice",
   "topic": "소음 줄이기",
   "prompt": "안전을 알리는 신호음에 대해 타당한 태도는 무엇인가요?",
   "answer": "① 필요한 알림과 방해되는 소음을 구별한다.",
   "explanation": "소리는 안전을 알리거나 소통하는 데 필요해요. 필요한 기능을 유지하며 상황에 맞게 불편을 줄일 방법을 생각해요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b52",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "소리는 안전을 알리거나 소통하는 데 필요해요. 필요한 기능을 유지하며 상황에 맞게 불편을 줄일 방법을 생각해요.",
   "standard": "4과07-03",
   "choices": [
    "필요한 알림과 방해되는 소음을 구별한다.",
    "위험 알림도 음악으로 덮어 듣지 않는다.",
    "잘 들리지 않으면 귀 가까이서 시험한다.",
    "모든 소리가 나지 않도록 장치를 없앤다.",
    "높은 알림음은 언제나 나쁘다고 없앤다."
   ],
   "key": 0
  },
  {
   "id": "c22-s32-u03-w053",
   "no": 53,
   "form": "choice",
   "topic": "소음 줄이기",
   "prompt": "개인에게 맞는 소음 줄이기 제안은 무엇인가요?",
   "answer": "③ 어느 시간·장소에서 어떤 소리가 불편했는지 상대에게 묻는다.",
   "explanation": "누가 어느 시간·장소에서 어떤 소리를 불편하게 느꼈는지를 먼저 물어야 상황에 맞는 방법을 고를 수 있어요. 내 취향이나 소리의 크기 한 가지만으로 다른 사람의 불편함을 미리 정하지 않아요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b53",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "누가 어느 시간·장소에서 어떤 소리를 불편하게 느꼈는지를 먼저 물어야 상황에 맞는 방법을 고를 수 있어요. 내 취향이나 소리의 크기 한 가지만으로 다른 사람의 불편함을 미리 정하지 않아요.",
   "standard": "4과07-03",
   "choices": [
    "내가 좋아하는 음악이면 다른 사람에게도 방해가 없다고 정한다.",
    "작게 들리는 소리는 어느 때든 불편하지 않다고 미리 정한다.",
    "어느 시간·장소에서 어떤 소리가 불편했는지 상대에게 묻는다.",
    "상대의 활동을 묻지 않고 소리 종류만 보고 모두 금지한다.",
    "내게 크게 들린 순서만으로 상대가 불편한 순서도 정한다."
   ],
   "key": 2
  },
  {
   "id": "c22-s32-u03-w054",
   "no": 54,
   "form": "multi",
   "topic": "소음 줄이기",
   "prompt": "소음 줄이기의 근거를 남기는 방법을 고르세요. (정답 2개)",
   "answer": "②, ③",
   "explanation": "언제 어디서 무엇을 실제로 바꾸었는지와 상대가 말한 의견, 아직 확인하지 못한 조건을 함께 남겨요. 예상이나 다른 장소의 결과를 실천 효과로 대신 쓰지 않고, 기대와 다른 기록도 보관해요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "효과가 좋았을 것이라는 예상을 실제 전후 결과로 바꾸어 쓴다.",
    "실제로 상대가 말한 의견과 확인하지 못한 조건도 적는다.",
    "실천한 날짜·장소와 실제로 바꾼 행동을 기록한다.",
    "작아지지 않은 소리 기록은 지운 뒤 줄어든 기록만 남긴다.",
    "다른 장소에서 조용했던 결과를 지금 실천의 효과로 대신 쓴다."
   ],
   "key": [
    1,
    2
   ],
   "sourceId": "c22-s32-u03-b54",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     1,
     2
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "언제 어디서 무엇을 실제로 바꾸었는지와 상대가 말한 의견, 아직 확인하지 못한 조건을 함께 남겨요. 예상이나 다른 장소의 결과를 실천 효과로 대신 쓰지 않고, 기대와 다른 기록도 보관해요.",
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w055",
   "no": 55,
   "form": "short",
   "topic": "소음 줄이기",
   "prompt": "기분이나 활동에 방해가 될 수 있어 상황에 맞게 줄이려는 소리를 무엇이라고 하나요?",
   "answer": "소음",
   "explanation": "소음은 듣는 사람과 상황에 따라 판단해요. 모든 소리나 높은 음 자체가 나쁘다는 뜻은 아니에요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "sourceId": "c22-s32-u03-b55",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "소음",
    "accepted": [
     "소음"
    ]
   },
   "sourceGivens": null,
   "sourceExplanation": "소음은 듣는 사람과 상황에 따라 판단해요. 모든 소리나 높은 음 자체가 나쁘다는 뜻은 아니에요.",
   "standard": "4과07-03",
   "accepted": [
    "소음"
   ]
  },
  {
   "id": "c22-s32-u03-w056",
   "no": 56,
   "form": "written",
   "topic": "소음 줄이기",
   "prompt": "친구가 독서 중 의자 끄는 소리가 불편하다고 말했습니다. 소음을 줄일 행동과 효과를 확인할 방법을 제안해 보세요.",
   "answer": "의자를 안전하게 들어 옮기거나 알맞은 다리 덮개를 써요. 비슷한 독서 시간에 실천 전후의 소리와 친구가 실제로 느낀 점을 확인해요.",
   "explanation": "친구가 독서하는 상황에 맞게 의자 끄는 소리를 줄일 방법을 제안해요. 비슷한 조건에서 전후 소리와 실제 의견을 확인하되 계획만으로 효과를 확정하지 않아요.",
   "misconception": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요.",
   "criteria": "상황에 맞는 타당한 실천 / 효과·실제 의견을 확인할 방법",
   "lines": 3,
   "sourceId": "c22-s32-u03-b56",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 소리의 성질 보충",
    "course": "초등3-2"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "의자를 안전하게 들어 옮기거나 알맞은 다리 덮개를 써요. 비슷한 독서 시간에 실천 전후의 소리와 친구가 실제로 느낀 점을 확인해요.",
    "rubric": {
     "required": [
      "상황에 맞는 타당한 실천",
      "효과·실제 의견을 확인할 방법"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "여러 타당한 표현과 근거를 선생님과 확인한다."
    }
   },
   "sourceGivens": null,
   "sourceExplanation": "친구가 독서하는 상황에 맞게 의자 끄는 소리를 줄일 방법을 제안해요. 비슷한 조건에서 전후 소리와 실제 의견을 확인하되 계획만으로 효과를 확정하지 않아요.",
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w057",
   "no": 57,
   "form": "choice",
   "topic": "세기만 비교",
   "prompt": "표에서 내민 길이와 높낮이는 같고 소리의 세기만 다른 두 조건은?",
   "answer": "④ 가와 나",
   "explanation": "가와 나는 10 cm·중간 높낮이가 같고 작음·큼만 달라요. 다는 길이와 높낮이도 달라요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "가와 다",
    "나와 다",
    "세 조건 모두",
    "가와 나",
    "비교할 수 있는 조건 없음"
   ],
   "key": 3,
   "sharedFigure": "applied-results",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w058",
   "no": 58,
   "form": "choice",
   "topic": "높낮이 비교",
   "prompt": "표에서 튕기는 정도는 같고 길이에 따른 높낮이를 비교하는 두 조건은?",
   "answer": "① 가와 다",
   "explanation": "가와 다는 모두 약하게 튕겼고 내민 길이가10 cm·15 cm로 달라요. 표에서 중간·낮음의 높낮이를 비교해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "가와 다",
    "가와 나",
    "나와 다",
    "세 조건 모두",
    "비교할 수 있는 조건 없음"
   ],
   "key": 0,
   "sharedFigure": "applied-results",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w059",
   "no": 59,
   "form": "choice",
   "topic": "보이지 않는 떨림",
   "prompt": "소리가 나지만 떨림이 잘 안 보여요. 다음에 할 일로 알맞은 것은?",
   "answer": "② 안전한 다른 관찰 방법을 찾는다",
   "explanation": "작은 떨림은 눈으로 보기 어려울 수 있어요. 안전한 시각·촉각 관찰 방법과 도구를 교사와 정해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "떨림은 전혀 없다고 바로 확정한다",
    "안전한 다른 관찰 방법을 찾는다",
    "가장 큰 소리로 오랫동안 겨룬다",
    "관찰하지 못한 움직임을 지어 쓴다",
    "귀 가까이에 악기를 대고 세게 친다"
   ],
   "key": 1,
   "standard": "4과07-01"
  },
  {
   "id": "c22-s32-u03-w060",
   "no": 60,
   "form": "choice",
   "topic": "필요한 소리",
   "prompt": "도서관에서 불편한 소리는 줄이되 지켜야 할 소리의 예는?",
   "answer": "③ 위험을 알리는 필요한 경보음",
   "explanation": "안전 신호의 기능을 유지하면서 방해되는 소음을 줄여요. 모든 소리를 없애는 것이 목표는 아니에요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "의자를 계속 끄는 소리",
    "장난으로 가까이서 지르는 고함",
    "위험을 알리는 필요한 경보음",
    "조용한 독서를 방해하는 큰 음악",
    "책상을 반복해서 세게 치는 소리"
   ],
   "key": 2,
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w061",
   "no": 61,
   "form": "choice",
   "topic": "여러 물질의 전달",
   "prompt": "교실 목소리는 공기로, 실 전화기는 실로 전달을 살폈어요. 자료에 맞는 설명은?",
   "answer": "⑤ 여러 물질이 소리를 전할 수 있다",
   "explanation": "공기와 실처럼 서로 다른 물질을 통한 전달을 살필 수 있어요. 조건을 확인하고 높낮이·속력까지 임의로 정하지 않아요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "choices": [
    "공기가 아닌 물질은 소리를 못 전한다",
    "실이 소리를 전하면 공기는 못 전한다",
    "고체에서 전하면 반드시 음이 높아진다",
    "한 번 잘 들리면 어떤 조건도 상관없다",
    "여러 물질이 소리를 전할 수 있다"
   ],
   "key": 4,
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w062",
   "no": 62,
   "form": "blank",
   "topic": "떨림",
   "prompt": "북 가죽이나 기타 줄처럼 소리가 나는 부분에서 살펴볼 움직임은 [ ]이에요.",
   "answer": "떨림(진동)",
   "explanation": "눈에 잘 안 보이면 안전한 다른 방법으로 확인할 수 있어요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-01"
  },
  {
   "id": "c22-s32-u03-w063",
   "no": 63,
   "form": "blank",
   "topic": "소리의 세기",
   "prompt": "큰 소리와 작은 소리는 소리의 [ ]가 달라요.",
   "answer": "세기",
   "explanation": "높은 소리와 낮은 소리의 구별과 나누어 생각해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w064",
   "no": 64,
   "form": "blank",
   "topic": "소리의 높낮이",
   "prompt": "높은 소리와 낮은 소리를 구별하는 성질은 [ ]예요.",
   "answer": "높낮이",
   "explanation": "같은 높은 음도 작게 또는 크게 낼 수 있어요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w065",
   "no": 65,
   "form": "blank",
   "topic": "듣는 조건",
   "prompt": "두드리는 정도만 바꾸어 소리 크기를 비교할 때 듣는 [ ]도 같게 맞추어요.",
   "answer": "위치(거리)",
   "explanation": "멀리·가까이 듣는 차이가 결과에 섞이지 않게 해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w066",
   "no": 66,
   "form": "blank",
   "topic": "소리 전달",
   "prompt": "실 전화기의 실은 고체, 물은 액체, 교실의 공기는 [ ]예요.",
   "answer": "기체",
   "explanation": "소리는 여러 상태의 물질을 통해 전달될 수 있어요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w067",
   "no": 67,
   "form": "blank",
   "topic": "소음",
   "prompt": "듣는 사람과 활동에 방해가 되어 상황에 맞게 줄이려는 소리를 [ ]이라고 해요.",
   "answer": "소음",
   "explanation": "소리가 높거나 내가 싫어한다는 이유만으로 모두 없애지 않아요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w068",
   "no": 68,
   "form": "match",
   "topic": "성질과 뜻",
   "prompt": "설명과 낱말 기호를 연결해요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "떨림·세기·높낮이의 뜻을 나누어 읽어요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "parts": [
    "(1) 물체가 빠르게 흔들리는 움직임",
    "(2) 소리가 크고 작은 정도",
    "(3) 소리가 높고 낮은 정도"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 높낮이  ㄴ. 떨림  ㄷ. 세기"
   ],
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w069",
   "no": 69,
   "form": "match",
   "topic": "전달하는 물질",
   "prompt": "소리 전달을 살핀 물질과 상태를 연결해요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "물질의 상태와 전달 현상을 연결해요. 일반 전자 기기를 물에 넣는 활동이 아니에요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "parts": [
    "(1) 실 전화기의 실",
    "(2) 물속 장치 사이의 물",
    "(3) 교실의 공기"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 액체  ㄴ. 고체  ㄷ. 기체"
   ],
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w070",
   "no": 70,
   "form": "match",
   "topic": "길이 비교의 조건",
   "prompt": "높낮이를 알아보는 자 비교의 조건을 역할과 연결해요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "알아보려는 조건과 결과를 구별해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "parts": [
    "(1) 자를 책상 밖으로 내민 길이",
    "(2) 같은 자·고정 방법·튕기는 정도",
    "(3) 비교해서 들은 소리의 높낮이"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 같게 둘 것  ㄴ. 관찰할 결과  ㄷ. 바꿀 것"
   ],
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w071",
   "no": 71,
   "form": "match",
   "topic": "소음 줄이기",
   "prompt": "불편한 상황과 알맞은 행동을 연결해요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "상대와 활동을 고려해 소음을 줄여요. 안전 경보는 없애지 않아요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "parts": [
    "(1) 의자 다리를 끄는 소리",
    "(2) 독서 중 너무 큰 재생 소리",
    "(3) 악기 소리가 불편하다는 친구"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 멈추고 편한 관찰 방법 함께 정하기  ㄴ. 안전하게 옮기거나 알맞은 덮개 쓰기  ㄷ. 상황에 맞게 재생 크기 낮추기"
   ],
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w072",
   "no": 72,
   "form": "order",
   "topic": "떨림 비교",
   "prompt": "작은북의 소리와 떨림을 살필 순서로 배열해요.",
   "answer": "ㄴ → ㄷ → ㄹ → ㄱ",
   "explanation": "준비 → 비교 기준 → 가볍게 소리 내기 → 근거 설명으로 이어져요. 큰 소리를 내지 않아요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "given": [
    "ㄱ. 두 조건의 소리와 움직임을 비교해 설명한다",
    "ㄴ. 교사와 작은북·가벼운 종잇조각을 준비한다",
    "ㄷ. 치지 않은 때의 모습을 먼저 살핀다",
    "ㄹ. 가볍게 치고 종잇조각의 움직임을 본다"
   ],
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w073",
   "no": 73,
   "form": "order",
   "topic": "길이 비교",
   "prompt": "같은 자에서 길이에 따른 높낮이를 비교할 순서로 배열해요.",
   "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
   "explanation": "길이 외 조건을 비슷하게 유지해야 길이의 영향을 비교하기 쉬워요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "given": [
    "ㄱ. 길이만 바꾸어 같은 방법으로 다시 튕긴다",
    "ㄴ. 두 길이의 높낮이를 자료로 비교한다",
    "ㄷ. 같은 자와 고정·듣는 조건을 정한다",
    "ㄹ. 한 길이에서 튕기고 높낮이를 살핀다"
   ],
   "standard": "4과07-02"
  },
  {
   "id": "c22-s32-u03-w074",
   "no": 74,
   "form": "order",
   "topic": "소음 줄이기",
   "prompt": "의자 소음 줄이기 방법을 정하고 확인할 순서로 배열해요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "상황 → 실천 → 같은 기준의 비교 → 효과 설명으로 이어져요. 계획만 세웠다면 효과가 확인된 것은 아니에요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교 조건과 자료에 맞는 근거를 설명하면 같은 뜻의 답도 인정해요.",
   "given": [
    "ㄱ. 비슷한 조건에서 전후의 소리와 의견을 확인한다",
    "ㄴ. 언제 어떤 의자 소리가 불편한지 살핀다",
    "ㄷ. 확인한 효과와 더 필요한 점을 설명한다",
    "ㄹ. 안전한 이동 방법이나 덮개를 정해 사용한다"
   ],
   "standard": "4과07-03"
  },
  {
   "id": "c22-s32-u03-w075",
   "no": 75,
   "form": "draw",
   "topic": "떨림 관찰",
   "prompt": "작은북을 치기 전과 가볍게 친 뒤의 모습을 비교할 계획을 그려요. 살펴볼 부분과 움직임을 확인할 방법을 표시해요.",
   "answer": "북 가죽 위에 가벼운 종잇조각을 두고 치기 전후 움직임과 소리를 비교하는 배치를 나타낸다. 실제로 하지 않았다면 관찰 계획이라고 표시한다.",
   "explanation": "정지 그림은 실제 떨림 관찰 결과가 아니에요. 예상 움직임과 실제로 본 것을 나누어요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "비교할 두 상태·관찰 부분·안전한 확인 방법이 있으면 인정해요.",
   "drawing": "large",
   "standard": "4과07-01",
   "drawingExplanationLines": 3
  },
  {
   "id": "c22-s32-u03-w076",
   "no": 76,
   "form": "draw",
   "topic": "공정한 길이 비교",
   "prompt": "같은 자의 내민 길이만 바꾸는 두 배치를 그려요. 바꾼 것 한 가지와 같게 둘 조건 두 가지를 이름표로 표시해요.",
   "answer": "같은 자를 같은 책상에서 비슷하게 고정하고 내민 길이만 다르게 그린다. 튕기는 정도와 듣는 위치 등을 같게 둘 조건으로 표시한다.",
   "explanation": "자 재료·두께까지 달라지면 길이만의 효과인지 나누기 어려워요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "내민 길이 차이와 타당한 두 통제 조건이 드러나면 인정해요.",
   "drawing": "large",
   "standard": "4과07-02",
   "drawingExplanationLines": 3
  },
  {
   "id": "c22-s32-u03-w077",
   "no": 77,
   "form": "draw",
   "topic": "세기와 높낮이",
   "prompt": "칸을 네 개로 나누어 ‘높고 큰 소리·높고 작은 소리·낮고 큰 소리·낮고 작은 소리’를 글이나 그림으로 표현해요. 각 칸의 두 성질을 표시해요.",
   "answer": "네 조합을 서로 다르게 구별해 나타낸다. 같은 높은 음도 크게·작게 낼 수 있고 낮은 음도 크게·작게 낼 수 있음을 설명한다.",
   "explanation": "그림 크기가 실제 소리의 측정값은 아니에요. 높낮이와 세기를 이름표로 구별해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "네 조합을 빠뜨리지 않고 두 성질을 구별하면 인정해요.",
   "drawing": "large",
   "standard": "4과07-02",
   "drawingExplanationLines": 3
  },
  {
   "id": "c22-s32-u03-w078",
   "no": 78,
   "form": "draw",
   "topic": "전달 경로",
   "prompt": "실 전화기의 두 컵과 실을 그리고 말하는 쪽에서 듣는 쪽으로 이어지는 부분을 표시해요. 비교할 때 확인할 조건 두 가지도 적어요.",
   "answer": "두 컵과 이어진 팽팽한 실을 표시하고 목소리 크기·실 접촉·연결·듣는 위치 등을 확인할 조건으로 제안한다.",
   "explanation": "실은 몸에 감지 않아요. 주변 공기를 통한 전달도 있으므로 경로를 확인해 설명해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "컵과 실의 연결 및 타당한 두 비교 조건이 나타나면 인정해요.",
   "drawing": "large",
   "standard": "4과07-03",
   "drawingExplanationLines": 3
  },
  {
   "id": "c22-s32-u03-w079",
   "no": 79,
   "form": "draw",
   "topic": "소음 줄이기 설계",
   "prompt": "독서 중 의자 소리가 불편한 상황을 고칠 방법을 그려요. 소리가 나는 부분·고칠 방법·효과를 확인할 방법을 표시해요.",
   "answer": "의자 다리와 바닥의 접촉 부분, 적절한 덮개나 안전한 이동 방법을 나타낸다. 비슷한 조건에서 전후의 소리와 상대 의견을 확인하는 방법을 적는다.",
   "explanation": "그림을 그린 것만으로 효과가 확인되지는 않아요. 아직 하지 않았다면 계획이라고 표시해요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "상황에 맞는 방법과 전후 효과 확인이 연결되면 인정해요.",
   "drawing": "large",
   "standard": "4과07-03",
   "drawingExplanationLines": 3
  },
  {
   "id": "c22-s32-u03-w080",
   "no": 80,
   "form": "draw",
   "topic": "필요한 소리와 소음",
   "prompt": "모든 높은 소리나 큰 소리를 없애자는 주장을 고칠 안내 그림을 만들어요. 필요한 소리 한 가지와 불편을 줄일 행동 한 가지를 넣어요.",
   "answer": "위험 알림 등 필요한 기능은 지키고 독서 중 재생 소리 조절·의자 안전 이동 등 상황에 맞는 행동을 제안한다.",
   "explanation": "내 취향만으로 필요한 경보를 없애거나 다른 사람에게 불편을 참으라고 강요하지 않아요.",
   "misconception": "소리의 세기와 높낮이, 관찰한 사실과 아직 확인하지 않은 것을 구별해요.",
   "criteria": "필요한 기능과 상황에 맞는 소음 줄이기를 구별하면 인정해요.",
   "drawing": "large",
   "standard": "4과07-03",
   "drawingExplanationLines": 3
  }
 ],
 "pages": [
  {
   "section": "단원 열기",
   "title": "소리는 무엇이 떨릴 때 날까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "opener",
     "caption": ""
    },
    {
     "type": "text",
     "text": "북·자·목소리에서 떨림을 찾아요. 크고 작은 소리와 높고 낮은 소리를 구별하고, 소리가 전해지는 물질과 생활 속 소음을 살펴봐요."
    },
    {
     "type": "list",
     "items": [
      "소리가 나는 물체의 떨림 관찰하기",
      "길이와 튕기는 정도를 하나씩 바꾸어 비교하기",
      "소리를 전하는 여러 물질 살펴보기",
      "필요한 소리를 지키며 불편한 소음 줄이기"
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "내 첫 질문",
     "hint": "소리와 움직임에 관해 궁금한 점을 적어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리를 듣고, 움직임을 보고, 안전하게 떨림을 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "2022 개정 · 3학년 2학기 Ⅲ",
   "kind": "learn"
  },
  {
   "section": "떨림의 근거",
   "title": "사진에서 본 것과 움직임을 구별해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "제공한 기록",
      "직접 확인한 것"
     ],
     "rows": [
      [
       "북 위 종잇조각의 정지 사진",
       "사진을 찍은 순간의 위치"
      ],
      [
       "소리 내는 동안 조각의 움직임을 관찰",
       "조각이 위아래로 움직임"
      ],
      [
       "북소리가 멈춘 뒤 다시 관찰",
       "앞서 보이던 움직임이 멈춤"
      ]
     ]
    },
    {
     "type": "example",
     "question": "사진 한 장만으로 종잇조각이 움직였다고 할 수 있나요?",
     "steps": [
      [
       "기록의 종류",
       "사진은 한 순간의 위치를 보여 줘요."
      ],
      [
       "추가 근거",
       "소리가 날 때와 멈춘 뒤의 움직임 기록을 함께 살펴요."
      ]
     ],
     "answer": "한 장의 위치와 시간에 따른 움직임은 다른 정보예요."
    },
    {
     "type": "field",
     "title": "근거를 골라 설명해요",
     "hint": "소리 나는 물체의 떨림을 어떤 감각이나 도구로 확인할지, 무엇을 관찰할지 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "관찰한 위치·움직임과 그에 대한 설명을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 귀 가까이 크게 내는 대신 교사와 안전한 시각·촉각 방법을 정해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교 설계",
   "title": "길이만 바꾼 비교일까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "ruler",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "알아볼 것",
      "바꿀 것",
      "같게 둘 것",
      "관찰할 결과"
     ],
     "rows": [
      [
       "길이에 따른 높낮이",
       "내민 길이",
       "같은 자·고정·튕기는 정도·듣는 위치",
       "높고 낮은 정도"
      ],
      [
       "튕기는 정도에 따른 세기",
       "튕기는 정도",
       "같은 자·내민 길이·고정·듣는 위치",
       "크고 작은 정도"
      ]
     ]
    },
    {
     "type": "field",
     "title": "두 조건이 다르면?",
     "hint": "자 재료와 길이가 함께 달라지면 무엇을 알기 어려운지 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "한 번에 한 조건의 영향을 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "사진에서 내민 길이의 정확한 수치나 소리를 읽지 않아요. 숫자는 모형의 선택 조건에서 확인해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "세기 비교 계획",
   "title": "두드리는 정도만 다르게 할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "계획",
      "북",
      "두드리는 정도",
      "듣는 거리"
     ],
     "rows": [
      [
       "가",
       "같은 북",
       "약하게 / 조금 더 세게",
       "2m / 2m"
      ],
      [
       "나",
       "같은 북",
       "약하게 / 약하게",
       "2m / 2m"
      ],
      [
       "다",
       "같은 북",
       "약하게 / 조금 더 세게",
       "1m / 3m"
      ],
      [
       "라",
       "서로 다른 북",
       "약하게 / 조금 더 세게",
       "2m / 2m"
      ],
      [
       "마",
       "같은 북",
       "약하게 / 조금 더 세게",
       "3m / 3m"
      ]
     ]
    },
    {
     "type": "example",
     "question": "두드리는 정도에 따른 세기 차이를 살필 계획은?",
     "steps": [
      [
       "바꿀 조건",
       "약하게 / 조금 더 세게 두드리는 차이가 있어야 해요."
      ],
      [
       "같게 둘 조건",
       "북과 듣는 거리를 맞춘 가·마가 목적에 맞아요."
      ]
     ],
     "answer": "나에서는 두드리는 정도가 같고, 다·라는 다른 조건도 달라요."
    },
    {
     "type": "field",
     "title": "잘못된 계획 하나 고치기",
     "hint": "다 또는 라를 골라 바꿀 조건·같게 둘 조건·관찰할 것을 나누어 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "위 표는 비교 계획이며 관찰 결과가 아직 없어요."
    },
    {
     "title": "더 알아보기",
     "text": "조금 더 세게는 교사가 정한 안전한 범위예요. 귀가 불편한 소리를 내거나 큰 소리 겨루기를 하지 않아요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "모형 자료 읽기",
   "title": "높낮이와 세기는 따로 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "다음은 수업 3D의 모형 결과예요. 재생되는 음과 화면 떨림은 차이를 알아보기 위한 모형이며 실제 자의 진동수·음량을 측정한 값이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "내민 길이",
      "튕기는 정도",
      "높낮이",
      "세기",
      "떨림 크기"
     ],
     "rows": [
      [
       "5 cm",
       "약하게",
       "높은 소리",
       "작은 소리",
       "작게 떨림"
      ],
      [
       "5 cm",
       "세게",
       "높은 소리",
       "큰 소리",
       "크게 떨림"
      ],
      [
       "10 cm",
       "약하게",
       "중간 소리",
       "작은 소리",
       "작게 떨림"
      ],
      [
       "10 cm",
       "세게",
       "중간 소리",
       "큰 소리",
       "크게 떨림"
      ],
      [
       "15 cm",
       "약하게",
       "낮은 소리",
       "작은 소리",
       "작게 떨림"
      ],
      [
       "15 cm",
       "세게",
       "낮은 소리",
       "큰 소리",
       "크게 떨림"
      ]
     ]
    },
    {
     "type": "field",
     "title": "같은 길이에서 비교",
     "hint": "10 cm에서 약하게·세게를 비교해 달라진 것과 같은 것을 설명해요.",
     "lines": 3,
     "draw": false
    },
    {
     "type": "field",
     "title": "같은 세기에서 비교",
     "hint": "약하게 튕긴 5 cm와15 cm의 높낮이를 비교해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "같은 듣는 위치에서 크고 작음과 높고 낮음을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "기기의 음량·소리 끔 상태가 달라지면 들리는 크기를 바로 비교하기 어려워요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "길이와 높낮이",
   "title": "자를 짧게 내밀면 어떤 차이가 있을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "같은 자의 내민 길이",
      "가상 관찰의 높낮이"
     ],
     "rows": [
      [
       "8cm",
       "높음"
      ],
      [
       "12cm",
       "중간"
      ],
      [
       "16cm",
       "낮음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "재료·너비·두께가 같은 자를 같은 방법으로 고정하고 비슷하게 튕겼어요. 듣는 자리도 같아요. 길이만 다르게 한 가상 비교 기록이에요."
    },
    {
     "type": "example",
     "question": "12cm보다 높은 소리를 보인 기록은?",
     "steps": [
      [
       "조건 읽기",
       "내민 길이 외의 비교 조건은 같게 했어요."
      ],
      [
       "결과 연결",
       "8cm의 높음은 12cm의 중간보다 높은 소리예요."
      ]
     ],
     "answer": "이 비교에서는 짧게 내민 자 쪽이 더 높은 소리를 보였어요."
    },
    {
     "type": "field",
     "title": "조건이 달라지면",
     "hint": "두께가 다른 자를 비교했다면 길이만의 효과라고 정하기 어려운 까닭을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높낮이는 높고 낮음, 세기는 크고 작음이에요."
    },
    {
     "title": "더 알아보기",
     "text": "자를 무리하게 휘거나 얼굴 쪽으로 튕기지 않아요. 교사가 확인한 도구·보호 안경·고정 방법을 사용해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념 연결",
   "title": "세기와 높낮이를 섞지 않아요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "구별할 것",
      "자료에서 살필 근거",
      "설명 예"
     ],
     "rows": [
      [
       "세기",
       "같은 조건의 떨림 크기·들리는 크기",
       "크게 떨릴 때 더 큰 소리"
      ],
      [
       "높낮이",
       "같은 조건에서 떨리는 빠르기·높고 낮음",
       "빨리 떨릴 때 더 높은 소리"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 높은 음도 작게 또는 크게 낼 수 있어요. 낮은 소리도 작은 소리라는 뜻은 아니에요. 같은 물체·비교 조건을 확인하고 관찰한 차이를 설명해요."
    },
    {
     "type": "field",
     "title": "주장 고치기",
     "hint": "“더 큰 소리면 언제나 더 높은 소리다.”라는 주장에 반례를 들어 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높낮이와 세기는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "떨림의 수학적 계산·파형 공식·속력은 이 단원의 필수 답으로 요구하지 않아요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "두 성질로 분류",
   "title": "높고 작은 소리도 있을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "가상 소리 카드",
      "높낮이",
      "세기"
     ],
     "rows": [
      [
       "가",
       "높음",
       "큼"
      ],
      [
       "나",
       "낮음",
       "큼"
      ],
      [
       "다",
       "높음",
       "작음"
      ],
      [
       "라",
       "낮음",
       "작음"
      ]
     ]
    },
    {
     "type": "example",
     "question": "높낮이만 같은 짝과 세기만 같은 짝을 찾으면?",
     "steps": [
      [
       "높낮이로 묶기",
       "가·다는 모두 높지만 크기는 달라요. 나·라는 모두 낮아요."
      ],
      [
       "세기로 묶기",
       "가·나는 모두 크지만 높낮이는 달라요. 다·라는 모두 작아요."
      ]
     ],
     "answer": "가·다는 같은 높은 음이라도 세기가 다를 수 있음을 보여 줘요."
    },
    {
     "type": "field",
     "title": "주장 고치기",
     "hint": "“높은 소리이면 언제나 큰 소리다”라는 주장을 카드의 기호와 두 성질로 고쳐 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높음/낮음과 큼/작음을 서로 바꾸어 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "한 성질로 묶은 같은 모둠에서도 다른 성질은 다를 수 있어요. 이 표는 실제 들려 준 소리의 측정값이 아니에요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "반복 기록과 빈칸",
   "title": "기록하지 않은 것은 작은 소리일까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "같은 자의 조건",
      "1회",
      "2회",
      "3회"
     ],
     "rows": [
      [
       "약하게 튕김",
       "작게 들림",
       "작게 들림",
       "작게 들림"
      ],
      [
       "조금 더 세게 튕김",
       "더 크게 들림",
       "기록하지 않음",
       "더 크게 들림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 길이·고정 방법·듣는 자리에서 반복한 것으로 정한 가상 자료예요. 들림 기록과 함께 눈으로 본 떨림도 확인할 수 있어요."
    },
    {
     "type": "example",
     "question": "빈칸을 “소리가 안 남”으로 채워도 될까요?",
     "steps": [
      [
       "기록 구별",
       "2회는 들은 결과가 아니라 기록이 없는 칸이에요."
      ],
      [
       "가능한 설명",
       "확인한 1·3회에서는 더 크게 들렸다고 말할 수 있어요."
      ]
     ],
     "answer": "관찰하지 않은 결과를 새로 만들지 않고 다시 확인할 점으로 남겨요."
    },
    {
     "type": "field",
     "title": "다시 확인할 방법",
     "hint": "빠진 기록을 확인할 때 같게 둘 조건과 남길 관찰 항목을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "기록 없음은 작은 소리·소리 없음과 다르게 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 사람이 다르게 느낀 것을 오답으로 단정하지 않아요. 관찰 조건과 사용할 감각을 함께 정해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "전달 현상",
   "title": "공기만 소리를 전할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "설명용 관찰 사례",
      "살핀 물질",
      "자료에서 말할 수 있는 점"
     ],
     "rows": [
      [
       "교실에서 떨어진 친구 목소리를 들음",
       "공기(기체)",
       "공기가 전달 경로가 될 수 있음"
      ],
      [
       "연결된 실 전화기로 비교함",
       "실(고체)",
       "실을 통한 전달을 살필 수 있음"
      ],
      [
       "물속 방수 장치 사이 신호를 관찰함",
       "물(액체)",
       "액체도 전달 경로가 될 수 있음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "자료의 접촉·연결·거리와 다른 경로도 함께 살펴요. 잘 들린다는 것만으로 언제나 더 빠르거나 더 높은 음이라고 정하지 않아요. 일반 전자 기기를 물에 넣거나 귀를 물에 넣어 시험하는 활동은 하지 않아요."
    },
    {
     "type": "field",
     "title": "실 전화기 비교",
     "hint": "실을 잡았을 때 차이를 보려면 같게 둘 조건 두 가지와 관찰할 것을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "여러 물질을 통한 전달 현상을 근거로 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "조용한 목소리를 쓰고 실을 몸에 감지 않아요. 구멍·날카로운 부분은 교사가 준비해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실 전화기 비교",
   "title": "전달을 비교할 때 무엇을 같게 둘까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "계획의 항목",
      "정한 조건"
     ],
     "rows": [
      [
       "바꿀 것",
       "실을 손으로 잡는지 놓는지"
      ],
      [
       "같게 둘 것",
       "같은 전화기·실 길이·두 사람 위치·목소리 크기"
      ],
      [
       "살필 것",
       "같은 짧은 말을 전했을 때 들리는 차이"
      ],
      [
       "주의할 것",
       "실의 팽팽함과 연결 상태도 함께 확인"
      ]
     ]
    },
    {
     "type": "example",
     "question": "실을 잡는 쪽에서 더 큰 목소리로 말하면?",
     "steps": [
      [
       "조건의 충돌",
       "실을 잡는 여부와 목소리 크기가 함께 달라져요."
      ],
      [
       "계획 수정",
       "목소리·위치·연결을 맞춘 뒤 실을 잡는 여부만 바꾸어요."
      ]
     ],
     "answer": "한 조건의 효과를 살피려면 다른 조건이 섞이지 않게 비교해요."
    },
    {
     "type": "field",
     "title": "관찰 뒤 설명하기",
     "hint": "실을 잡기 전후 실제로 무엇을 적을지 써요. 이 계획만으로 아직 정할 수 없는 결과도 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리가 전달되는 현상과 비교 조건을 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "몸에 실을 감거나 큰 소리를 지르지 않아요. 실을 통한 관찰만으로 공기 등 다른 경로가 전혀 없다고 결론내리지 않아요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "함께 푸는 예제",
   "title": "필요한 소리를 지키며 소음 줄이기",
   "blocks": [
    {
     "type": "diagram",
     "key": "chair",
     "caption": ""
    },
    {
     "type": "example",
     "question": "독서 중 의자 소리가 불편하다는 의견을 받았어요.",
     "steps": [
      [
       "방법 제안",
       "알맞은 덮개나 안전하게 옮기는 방법을 생각해요."
      ],
      [
       "효과 확인",
       "같은 조건의 전후 소리와 상대 의견을 확인해요."
      ]
     ],
     "answer": "방법을 정한 것과 실제 효과를 확인한 결과를 나누어 설명해요."
    },
    {
     "type": "field",
     "title": "내가 제안할 방법",
     "hint": "고칠 부분과 이유, 효과를 확인할 기준을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 사람·시간·활동과 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "안전 경보·안내처럼 필요한 기능은 유지해요. 내게 좋은 음악도 다른 활동에는 방해가 될 수 있어요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "소리와 생활 맥락",
   "title": "같은 음악도 언제나 같은 소음일까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상황",
      "소리의 역할과 살필 점"
     ],
     "rows": [
      [
       "도서관에서 독서 중",
       "큰 음악이 독서에 방해되는지"
      ],
      [
       "공연장에서 약속한 공연 중",
       "음악을 듣는 활동과 다른 사람의 반응"
      ],
      [
       "대피가 필요한 때",
       "경보와 안내가 들려야 하는 기능"
      ]
     ]
    },
    {
     "type": "example",
     "question": "독서를 방해하는 소리를 줄이려면 모든 소리를 없애나요?",
     "steps": [
      [
       "상황 판단",
       "사람·장소·활동에 어떤 영향을 주는지 살펴요."
      ],
      [
       "필요한 기능",
       "경보·안내처럼 필요한 소리는 유지해요."
      ]
     ],
     "answer": "방해를 줄이면서 필요한 소리의 기능을 지키는 방법을 정해요."
    },
    {
     "type": "field",
     "title": "내가 정할 약속",
     "hint": "하나의 장소를 정하고 줄일 소리·남길 필요한 소리·상대에게 확인할 의견을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높은 소리 자체나 모든 소리를 나쁜 것으로 보지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "내가 좋아하는 소리라도 다른 활동에는 방해가 될 수 있어요. 상대의 상황을 듣고 조정해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실천 전후의 근거",
   "title": "덮개를 붙였더니 언제나 조용해질까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "가상 의자 이동 기록",
      "1회",
      "2회",
      "3회"
     ],
     "rows": [
      [
       "덮개 전",
       "크게 들림",
       "크게 들림",
       "크게 들림"
      ],
      [
       "덮개 후",
       "작게 들림",
       "기록하지 않음",
       "작게 들림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 의자·바닥·이동 거리와 방법·듣는 자리에서 덮개 유무만 다르게 한 연습 기록이에요. 실제 감소량을 측정한 표는 아니에요."
    },
    {
     "type": "example",
     "question": "이 표가 뒷받침하는 설명의 범위는?",
     "steps": [
      [
       "있는 결과",
       "덮개 후 1·3회에서 더 작게 들렸다는 기록이 있어요."
      ],
      [
       "없는 결과",
       "2회와 다른 의자·바닥에서의 효과는 아직 확인하지 않았어요."
      ]
     ],
     "answer": "이 기록의 개선 근거는 말하되 모든 상황에서 같다고 단정하지 않아요."
    },
    {
     "type": "field",
     "title": "실천으로 이어 가기",
     "hint": "허락받은 의자에 쓸 방법과 같은 조건의 전후 비교 계획을 적어요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "diagram",
     "key": "soundSources",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "계획·실제 실천·받은 의견·수정을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "의자를 일부러 세게 끌어 소음을 만들지 않아요. 이동과 덮개 부착은 교사 안내 아래 안전하게 해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 1~3",
   "title": "소리와 떨림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w001",
      "c22-s32-u03-w002",
      "c22-s32-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 4~6",
   "title": "소리와 떨림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w004",
      "c22-s32-u03-w005",
      "c22-s32-u03-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 7~8",
   "title": "소리와 떨림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w007",
      "c22-s32-u03-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 9~11",
   "title": "여러 감각과 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w009",
      "c22-s32-u03-w010",
      "c22-s32-u03-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 12~14",
   "title": "여러 감각과 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w012",
      "c22-s32-u03-w013",
      "c22-s32-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 15~16",
   "title": "여러 감각과 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w015",
      "c22-s32-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 17~19",
   "title": "소리의 세기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w017",
      "c22-s32-u03-w018",
      "c22-s32-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 20~22",
   "title": "소리의 세기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w020",
      "c22-s32-u03-w021",
      "c22-s32-u03-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 23~24",
   "title": "소리의 세기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w023",
      "c22-s32-u03-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 25~27",
   "title": "길이와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w025",
      "c22-s32-u03-w026",
      "c22-s32-u03-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 28~30",
   "title": "길이와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w028",
      "c22-s32-u03-w029",
      "c22-s32-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 31~32",
   "title": "길이와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w031",
      "c22-s32-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 33~35",
   "title": "세기와 높낮이 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w033",
      "c22-s32-u03-w034",
      "c22-s32-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 36~38",
   "title": "세기와 높낮이 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w036",
      "c22-s32-u03-w037",
      "c22-s32-u03-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 39~40",
   "title": "세기와 높낮이 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w039",
      "c22-s32-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 41~43",
   "title": "여러 물질의 전달",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w041",
      "c22-s32-u03-w042",
      "c22-s32-u03-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 44~46",
   "title": "여러 물질의 전달",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w044",
      "c22-s32-u03-w045",
      "c22-s32-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 47~48",
   "title": "여러 물질의 전달",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w047",
      "c22-s32-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 49~51",
   "title": "소음 줄이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w049",
      "c22-s32-u03-w050",
      "c22-s32-u03-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 52~54",
   "title": "소음 줄이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w052",
      "c22-s32-u03-w053",
      "c22-s32-u03-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 55~56",
   "title": "소음 줄이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w055",
      "c22-s32-u03-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료 해석 57~58",
   "title": "같은 조건의 짝을 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "applied-results",
     "caption": "57·58번 공통 자료"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w057",
      "c22-s32-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "표에서 같게 둔 조건과 달라진 결과를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "적용 59~61",
   "title": "관찰·전달·필요한 소리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w059",
      "c22-s32-u03-w060",
      "c22-s32-u03-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "한 관찰로 모든 소리와 모든 상황을 단정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "빈칸 62~64",
   "title": "떨림·세기·높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w062",
      "c22-s32-u03-w063",
      "c22-s32-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "낱말의 뜻과 자료의 차이를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "빈칸 65~67",
   "title": "비교 조건·전달·소음",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w065",
      "c22-s32-u03-w066",
      "c22-s32-u03-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 위치와 필요한 기능도 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연결 68~69",
   "title": "성질의 뜻과 전달 물질",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w068",
      "c22-s32-u03-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "크고 작음과 높고 낮음을 나누어 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연결 70~71",
   "title": "조건의 역할과 생활 속 행동",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w070",
      "c22-s32-u03-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "바꿀 것·같게 둘 것·결과를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "순서 72~73",
   "title": "관찰에서 근거 설명까지",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w072",
      "c22-s32-u03-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "준비·비교·해석의 흐름으로 생각해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "순서 74",
   "title": "실천 효과를 어떻게 확인할까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w074"
     ]
    },
    {
     "type": "field",
     "title": "비교할 기준",
     "hint": "전후 비교에서 같게 둘 것 두 가지를 덧붙여요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "효과를 미리 확정하지 않고 확인할 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 75",
   "title": "떨림 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 76",
   "title": "공정한 길이 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 77",
   "title": "세기와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 78",
   "title": "전달 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 79",
   "title": "소음 줄이기 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 80",
   "title": "필요한 소리와 소음",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
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
      "c22-s32-u03-w001",
      "c22-s32-u03-w002",
      "c22-s32-u03-w003",
      "c22-s32-u03-w004"
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
      "c22-s32-u03-w005",
      "c22-s32-u03-w006",
      "c22-s32-u03-w007"
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
      "c22-s32-u03-w008",
      "c22-s32-u03-w009",
      "c22-s32-u03-w010"
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
      "c22-s32-u03-w011",
      "c22-s32-u03-w012",
      "c22-s32-u03-w013",
      "c22-s32-u03-w014"
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
      "c22-s32-u03-w015",
      "c22-s32-u03-w016",
      "c22-s32-u03-w017"
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
   "section": "정답·해설 18~21",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w018",
      "c22-s32-u03-w019",
      "c22-s32-u03-w020",
      "c22-s32-u03-w021"
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
   "section": "정답·해설 22~24",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w022",
      "c22-s32-u03-w023",
      "c22-s32-u03-w024"
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
   "section": "정답·해설 25~28",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w025",
      "c22-s32-u03-w026",
      "c22-s32-u03-w027",
      "c22-s32-u03-w028"
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
   "section": "정답·해설 29~31",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w029",
      "c22-s32-u03-w030",
      "c22-s32-u03-w031"
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
   "section": "정답·해설 32~34",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w032",
      "c22-s32-u03-w033",
      "c22-s32-u03-w034"
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
   "section": "정답·해설 35~38",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w035",
      "c22-s32-u03-w036",
      "c22-s32-u03-w037",
      "c22-s32-u03-w038"
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
   "section": "정답·해설 39~41",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w039",
      "c22-s32-u03-w040",
      "c22-s32-u03-w041"
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
   "section": "정답·해설 42~45",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w042",
      "c22-s32-u03-w043",
      "c22-s32-u03-w044",
      "c22-s32-u03-w045"
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
   "section": "정답·해설 46~48",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w046",
      "c22-s32-u03-w047",
      "c22-s32-u03-w048"
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
      "c22-s32-u03-w049",
      "c22-s32-u03-w050",
      "c22-s32-u03-w051",
      "c22-s32-u03-w052"
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
      "c22-s32-u03-w053",
      "c22-s32-u03-w054",
      "c22-s32-u03-w055"
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
      "c22-s32-u03-w056",
      "c22-s32-u03-w057",
      "c22-s32-u03-w058"
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
      "c22-s32-u03-w059",
      "c22-s32-u03-w060",
      "c22-s32-u03-w061",
      "c22-s32-u03-w062"
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
   "section": "정답·해설 63~66",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w063",
      "c22-s32-u03-w064",
      "c22-s32-u03-w065",
      "c22-s32-u03-w066"
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
   "section": "정답·해설 67~70",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w067",
      "c22-s32-u03-w068",
      "c22-s32-u03-w069",
      "c22-s32-u03-w070"
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
   "section": "정답·해설 71~74",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w071",
      "c22-s32-u03-w072",
      "c22-s32-u03-w073",
      "c22-s32-u03-w074"
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
   "section": "정답·해설 75~77",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w075",
      "c22-s32-u03-w076",
      "c22-s32-u03-w077"
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
   "section": "정답·해설 78~80",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s32-u03-w078",
      "c22-s32-u03-w079",
      "c22-s32-u03-w080"
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
   "title": "1~17번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식",
      "정답"
     ],
     "rows": [
      [
       "1",
       "객관식",
       "②"
      ],
      [
       "2",
       "객관식",
       "⑤"
      ],
      [
       "3",
       "객관식",
       "①"
      ],
      [
       "4",
       "객관식",
       "④"
      ],
      [
       "5",
       "객관식",
       "③"
      ],
      [
       "6",
       "모두 고르기",
       "①, ②"
      ],
      [
       "7",
       "단답형",
       "떨림"
      ],
      [
       "8",
       "서술형",
       "교사 확인"
      ],
      [
       "9",
       "객관식",
       "⑤"
      ],
      [
       "10",
       "객관식",
       "②"
      ],
      [
       "11",
       "객관식",
       "③"
      ],
      [
       "12",
       "객관식",
       "①"
      ],
      [
       "13",
       "객관식",
       "④"
      ],
      [
       "14",
       "모두 고르기",
       "①, ③"
      ],
      [
       "15",
       "단답형",
       "시각"
      ],
      [
       "16",
       "서술형",
       "교사 확인"
      ],
      [
       "17",
       "객관식",
       "③"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 정답·해설의 근거와 기준을 함께 확인해요."
    },
    {
     "title": "다시 풀기",
     "text": "다시 살필 번호와 까닭을 적어요.",
     "write": 4
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "18~34번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식",
      "정답"
     ],
     "rows": [
      [
       "18",
       "객관식",
       "①"
      ],
      [
       "19",
       "객관식",
       "⑤"
      ],
      [
       "20",
       "객관식",
       "②"
      ],
      [
       "21",
       "객관식",
       "④"
      ],
      [
       "22",
       "모두 고르기",
       "①, ④"
      ],
      [
       "23",
       "단답형",
       "세기"
      ],
      [
       "24",
       "서술형",
       "교사 확인"
      ],
      [
       "25",
       "객관식",
       "④"
      ],
      [
       "26",
       "객관식",
       "③"
      ],
      [
       "27",
       "객관식",
       "②"
      ],
      [
       "28",
       "객관식",
       "⑤"
      ],
      [
       "29",
       "객관식",
       "①"
      ],
      [
       "30",
       "모두 고르기",
       "②, ③"
      ],
      [
       "31",
       "단답형",
       "높낮이"
      ],
      [
       "32",
       "서술형",
       "교사 확인"
      ],
      [
       "33",
       "객관식",
       "①"
      ],
      [
       "34",
       "객관식",
       "④"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 정답·해설의 근거와 기준을 함께 확인해요."
    },
    {
     "title": "다시 풀기",
     "text": "다시 살필 번호와 까닭을 적어요.",
     "write": 4
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "35~51번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식",
      "정답"
     ],
     "rows": [
      [
       "35",
       "객관식",
       "③"
      ],
      [
       "36",
       "객관식",
       "⑤"
      ],
      [
       "37",
       "객관식",
       "②"
      ],
      [
       "38",
       "모두 고르기",
       "③, ④"
      ],
      [
       "39",
       "단답형",
       "세기"
      ],
      [
       "40",
       "서술형",
       "교사 확인"
      ],
      [
       "41",
       "객관식",
       "③"
      ],
      [
       "42",
       "객관식",
       "⑤"
      ],
      [
       "43",
       "객관식",
       "①"
      ],
      [
       "44",
       "객관식",
       "④"
      ],
      [
       "45",
       "객관식",
       "②"
      ],
      [
       "46",
       "모두 고르기",
       "②, ③"
      ],
      [
       "47",
       "단답형",
       "실"
      ],
      [
       "48",
       "서술형",
       "교사 확인"
      ],
      [
       "49",
       "객관식",
       "⑤"
      ],
      [
       "50",
       "객관식",
       "②"
      ],
      [
       "51",
       "객관식",
       "④"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 정답·해설의 근거와 기준을 함께 확인해요."
    },
    {
     "title": "다시 풀기",
     "text": "다시 살필 번호와 까닭을 적어요.",
     "write": 4
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "52~68번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식",
      "정답"
     ],
     "rows": [
      [
       "52",
       "객관식",
       "①"
      ],
      [
       "53",
       "객관식",
       "③"
      ],
      [
       "54",
       "모두 고르기",
       "②, ③"
      ],
      [
       "55",
       "단답형",
       "소음"
      ],
      [
       "56",
       "서술형",
       "교사 확인"
      ],
      [
       "57",
       "객관식",
       "④"
      ],
      [
       "58",
       "객관식",
       "①"
      ],
      [
       "59",
       "객관식",
       "②"
      ],
      [
       "60",
       "객관식",
       "③"
      ],
      [
       "61",
       "객관식",
       "⑤"
      ],
      [
       "62",
       "빈칸 넣기",
       "떨림(진동)"
      ],
      [
       "63",
       "빈칸 넣기",
       "세기"
      ],
      [
       "64",
       "빈칸 넣기",
       "높낮이"
      ],
      [
       "65",
       "빈칸 넣기",
       "위치(거리)"
      ],
      [
       "66",
       "빈칸 넣기",
       "기체"
      ],
      [
       "67",
       "빈칸 넣기",
       "소음"
      ],
      [
       "68",
       "선 잇기",
       "(1) ㄴ (2) ㄷ (3) ㄱ"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 정답·해설의 근거와 기준을 함께 확인해요."
    },
    {
     "title": "다시 풀기",
     "text": "다시 살필 번호와 까닭을 적어요.",
     "write": 4
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "69~80번",
   "kind": "quick",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "번호",
      "형식",
      "정답"
     ],
     "rows": [
      [
       "69",
       "선 잇기",
       "(1) ㄴ (2) ㄱ (3) ㄷ"
      ],
      [
       "70",
       "선 잇기",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "71",
       "선 잇기",
       "(1) ㄴ (2) ㄷ (3) ㄱ"
      ],
      [
       "72",
       "순서 배열",
       "ㄴ → ㄷ → ㄹ → ㄱ"
      ],
      [
       "73",
       "순서 배열",
       "ㄷ → ㄹ → ㄱ → ㄴ"
      ],
      [
       "74",
       "순서 배열",
       "ㄴ → ㄹ → ㄱ → ㄷ"
      ],
      [
       "75",
       "그림·설명",
       "교사 확인"
      ],
      [
       "76",
       "그림·설명",
       "교사 확인"
      ],
      [
       "77",
       "그림·설명",
       "교사 확인"
      ],
      [
       "78",
       "그림·설명",
       "교사 확인"
      ],
      [
       "79",
       "그림·설명",
       "교사 확인"
      ],
      [
       "80",
       "그림·설명",
       "교사 확인"
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 정답·해설의 근거와 기준을 함께 확인해요."
    },
    {
     "title": "다시 풀기",
     "text": "다시 살필 번호와 까닭을 적어요.",
     "write": 4
    }
   ]
  }
 ],
 "figures": {
  "opener": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u03-photo-drum.webp\" alt=\"작은북 위 종잇조각과 옆의 북채\" loading=\"eager\"><p class=\"ed-photo-note\">떨림 관찰의 준비 모습을 소개해요. 정지 사진은 종잇조각이 움직였다는 실험 증거가 아니에요.</p><small class=\"ed-photo-credit\">실제 관찰 결과 아님</small></div>",
  "ruler": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u03-photo-ruler.webp\" alt=\"책으로 고정한 자의 한쪽 끝이 책상 밖으로 나온 준비 모습\" loading=\"eager\"><p class=\"ed-photo-note\">비교 배치를 소개하는 설명 이미지예요. 사진에서 길이나 진동수·소리 크기를 측정하지 않아요.</p><small class=\"ed-photo-credit\">실제 측정 사진 아님</small></div>",
  "chair": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s32-u03-photo-chair.webp\" alt=\"의자 다리 바닥의 부드러운 덮개를 표현한 모습\" loading=\"eager\"><p class=\"ed-photo-note\">소음 줄이기 방법의 예예요. 사진만으로 실제 감소 효과가 확인된 것은 아니에요.</p><small class=\"ed-photo-credit\">실제 효과 측정 사진 아님</small></div>",
  "given-c22-s32-u03-b02": "<p class=\"ed-given\"><b>관찰 기록</b> 작은북을 가볍게 치자 위의 종잇조각이 들썩였습니다. 학습용 가상 기록이에요.</p>",
  "given-c22-s32-u03-b08": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">관찰</th></tr></thead><tbody><tr><th scope=\"row\">가볍게 친 때</th><td>소리 남·위의 종잇조각이 움직임</td></tr><tr><th scope=\"row\">치지 않은 때</th><td>소리와 종잇조각 움직임을 관찰하지 못함</td></tr></tbody></table><p class=\"ed-given\"><b>안내</b> 문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요.</p>",
  "given-c22-s32-u03-b18": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">관찰</th></tr></thead><tbody><tr><th scope=\"row\">가·약하게 침</th><td>작은 소리·종잇조각 조금 움직임</td></tr><tr><th scope=\"row\">나·조금 더 세게 침</th><td>더 큰 소리·종잇조각 더 움직임</td></tr></tbody></table><p class=\"ed-given\"><b>안내</b> 문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요.</p>",
  "given-c22-s32-u03-b26": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">관</th><th scope=\"col\">길이</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>8 cm</td></tr><tr><th scope=\"row\">나</th><td>11 cm</td></tr><tr><th scope=\"row\">다</th><td>14 cm</td></tr></tbody></table><p class=\"ed-given\"><b>안내</b> 문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요.</p>",
  "given-c22-s32-u03-b28": "<p class=\"ed-given\"><b>자료</b> 가: 얇은 플라스틱 자, 밖 길이 8 cm / 나: 두꺼운 나무 자, 밖 길이 12 cm. 학습용 가상 조건이에요.</p>",
  "given-c22-s32-u03-b32": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">밖 길이</th><th scope=\"col\">소리</th></tr></thead><tbody><tr><th scope=\"row\">8 cm</th><td>더 높음</td></tr><tr><th scope=\"row\">12 cm</th><td>더 낮음</td></tr></tbody></table><p class=\"ed-given\"><b>안내</b> 문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요.</p>",
  "given-c22-s32-u03-b36": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">소리</th><th scope=\"col\">높낮이</th><th scope=\"col\">세기</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>높음</td><td>작음</td></tr><tr><th scope=\"row\">나</th><td>높음</td><td>큼</td></tr><tr><th scope=\"row\">다</th><td>낮음</td><td>작음</td></tr></tbody></table><p class=\"ed-given\"><b>안내</b> 문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요.</p>",
  "given-c22-s32-u03-b43": "<p class=\"ed-given\"><b>자료</b> 방수 소리 장치와 방수 관찰 도구 사이에 물이 있고, 신호가 전해졌습니다. 학습용 가상 자료이며 일반 전자 기기를 물에 넣는 활동이 아니에요.</p>",
  "given-c22-s32-u03-b48": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">관찰 기록</th></tr></thead><tbody><tr><th scope=\"row\">실을 놓음</th><td>말이 더 또렷하게 들림</td></tr><tr><th scope=\"row\">실을 손으로 잡음</th><td>말이 덜 또렷하게 들림</td></tr></tbody></table><p class=\"ed-given\"><b>안내</b> 문제 해석을 위한 가상 관찰 자료이며 직접 관찰한 결과가 아니에요.</p>",
  "applied-results": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">조건</th><th scope=\"col\">내민 길이</th><th scope=\"col\">튕기는 정도</th><th scope=\"col\">높낮이</th><th scope=\"col\">세기</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>10 cm</td><td>약하게</td><td>중간</td><td>작음</td></tr><tr><th scope=\"row\">나</th><td>10 cm</td><td>세게</td><td>중간</td><td>큼</td></tr><tr><th scope=\"row\">다</th><td>15 cm</td><td>약하게</td><td>낮음</td><td>작음</td></tr></tbody></table><p class=\"ed-given\">설명용 가상 자료예요. 같은 자·고정 방법·듣는 위치에서 비교했어요.</p>",
  "soundSources": "<div class=\"ed-source-guide\"><p>비교 방법을 더 살펴볼 교사 참고 자료</p><p><a href=\"https://primaryconnections.org.au/teaching-sequences/year-2/sound-studio/lesson-5-music-makers\" target=\"_blank\" rel=\"noopener\">Primary Connections · 자로 소리 만들기</a></p><p><a href=\"https://static.nsta.org/pdfs/EbookTeachersGuideSample-SoundAllAround.pdf\" target=\"_blank\" rel=\"noopener\">NSTA · Sound All Around 교사 자료</a></p><p>이 교재의 표는 조건을 정한 가상 학습 자료예요. 실제 관찰에서는 같은 조건을 맞추고 얻은 결과를 따로 남겨요.</p></div>"
 },
 "heldBankQuestions": [],
 "resolvedBankQuestions": [
  {
   "id": "c22-s32-u03-b25",
   "reason": "같게 둘 조건을 묻지만 원래 보기의 자 종류/방법, 듣는 위치/책상, 재료/고정/튕김 등이 모두 타당해 단일 정답이 불명확함.",
   "resolvedAt": "2026-10-22",
   "status": "bankChoicesRepaired",
   "note": "원래 은행 보기를 수정했고 교재는 기존 독립 대체 문제를 유지한다."
  },
  {
   "id": "c22-s32-u03-b41",
   "reason": "실 잡기 비교의 통제 조건을 묻지만 실 길이/컵 재료, 목소리/거리, 같은 전화기/위치 등 여러 보기가 타당함.",
   "resolvedAt": "2026-10-22",
   "status": "bankChoicesRepaired",
   "note": "원래 은행 보기를 수정했고 교재는 기존 독립 대체 문제를 유지한다."
  }
 ],
 "teacherStudentPages": [
  {
   "section": "단원 열기",
   "title": "소리는 무엇이 떨릴 때 날까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "opener",
     "caption": ""
    },
    {
     "type": "text",
     "text": "북·자·목소리에서 떨림을 찾아요. 크고 작은 소리와 높고 낮은 소리를 구별하고, 소리가 전해지는 물질과 생활 속 소음을 살펴봐요."
    },
    {
     "type": "list",
     "items": [
      "소리가 나는 물체의 떨림 관찰하기",
      "길이와 튕기는 정도를 하나씩 바꾸어 비교하기",
      "소리를 전하는 여러 물질 살펴보기",
      "필요한 소리를 지키며 불편한 소음 줄이기"
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "내 첫 질문",
     "hint": "소리와 움직임에 관해 궁금한 점을 적어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리를 듣고, 움직임을 보고, 안전하게 떨림을 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "2022 개정 · 3학년 2학기 Ⅲ",
   "kind": "learn"
  },
  {
   "section": "떨림의 근거",
   "title": "사진에서 본 것과 움직임을 구별해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "제공한 기록",
      "직접 확인한 것"
     ],
     "rows": [
      [
       "북 위 종잇조각의 정지 사진",
       "사진을 찍은 순간의 위치"
      ],
      [
       "소리 내는 동안 조각의 움직임을 관찰",
       "조각이 위아래로 움직임"
      ],
      [
       "북소리가 멈춘 뒤 다시 관찰",
       "앞서 보이던 움직임이 멈춤"
      ]
     ]
    },
    {
     "type": "example",
     "question": "사진 한 장만으로 종잇조각이 움직였다고 할 수 있나요?",
     "steps": [
      [
       "기록의 종류",
       "사진은 한 순간의 위치를 보여 줘요."
      ],
      [
       "추가 근거",
       "소리가 날 때와 멈춘 뒤의 움직임 기록을 함께 살펴요."
      ]
     ],
     "answer": "한 장의 위치와 시간에 따른 움직임은 다른 정보예요."
    },
    {
     "type": "field",
     "title": "근거를 골라 설명해요",
     "hint": "소리 나는 물체의 떨림을 어떤 감각이나 도구로 확인할지, 무엇을 관찰할지 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "관찰한 위치·움직임과 그에 대한 설명을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 귀 가까이 크게 내는 대신 교사와 안전한 시각·촉각 방법을 정해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교 설계",
   "title": "길이만 바꾼 비교일까요?",
   "blocks": [
    {
     "type": "diagram",
     "key": "ruler",
     "caption": ""
    },
    {
     "type": "table",
     "heads": [
      "알아볼 것",
      "바꿀 것",
      "같게 둘 것",
      "관찰할 결과"
     ],
     "rows": [
      [
       "길이에 따른 높낮이",
       "내민 길이",
       "같은 자·고정·튕기는 정도·듣는 위치",
       "높고 낮은 정도"
      ],
      [
       "튕기는 정도에 따른 세기",
       "튕기는 정도",
       "같은 자·내민 길이·고정·듣는 위치",
       "크고 작은 정도"
      ]
     ]
    },
    {
     "type": "field",
     "title": "두 조건이 다르면?",
     "hint": "자 재료와 길이가 함께 달라지면 무엇을 알기 어려운지 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "한 번에 한 조건의 영향을 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "사진에서 내민 길이의 정확한 수치나 소리를 읽지 않아요. 숫자는 모형의 선택 조건에서 확인해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "세기 비교 계획",
   "title": "두드리는 정도만 다르게 할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "계획",
      "북",
      "두드리는 정도",
      "듣는 거리"
     ],
     "rows": [
      [
       "가",
       "같은 북",
       "약하게 / 조금 더 세게",
       "2m / 2m"
      ],
      [
       "나",
       "같은 북",
       "약하게 / 약하게",
       "2m / 2m"
      ],
      [
       "다",
       "같은 북",
       "약하게 / 조금 더 세게",
       "1m / 3m"
      ],
      [
       "라",
       "서로 다른 북",
       "약하게 / 조금 더 세게",
       "2m / 2m"
      ],
      [
       "마",
       "같은 북",
       "약하게 / 조금 더 세게",
       "3m / 3m"
      ]
     ]
    },
    {
     "type": "example",
     "question": "두드리는 정도에 따른 세기 차이를 살필 계획은?",
     "steps": [
      [
       "바꿀 조건",
       "약하게 / 조금 더 세게 두드리는 차이가 있어야 해요."
      ],
      [
       "같게 둘 조건",
       "북과 듣는 거리를 맞춘 가·마가 목적에 맞아요."
      ]
     ],
     "answer": "나에서는 두드리는 정도가 같고, 다·라는 다른 조건도 달라요."
    },
    {
     "type": "field",
     "title": "잘못된 계획 하나 고치기",
     "hint": "다 또는 라를 골라 바꿀 조건·같게 둘 조건·관찰할 것을 나누어 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "위 표는 비교 계획이며 관찰 결과가 아직 없어요."
    },
    {
     "title": "더 알아보기",
     "text": "조금 더 세게는 교사가 정한 안전한 범위예요. 귀가 불편한 소리를 내거나 큰 소리 겨루기를 하지 않아요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "모형 자료 읽기",
   "title": "높낮이와 세기는 따로 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "다음은 수업 3D의 모형 결과예요. 재생되는 음과 화면 떨림은 차이를 알아보기 위한 모형이며 실제 자의 진동수·음량을 측정한 값이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "내민 길이",
      "튕기는 정도",
      "높낮이",
      "세기",
      "떨림 크기"
     ],
     "rows": [
      [
       "5 cm",
       "약하게",
       "높은 소리",
       "작은 소리",
       "작게 떨림"
      ],
      [
       "5 cm",
       "세게",
       "높은 소리",
       "큰 소리",
       "크게 떨림"
      ],
      [
       "10 cm",
       "약하게",
       "중간 소리",
       "작은 소리",
       "작게 떨림"
      ],
      [
       "10 cm",
       "세게",
       "중간 소리",
       "큰 소리",
       "크게 떨림"
      ],
      [
       "15 cm",
       "약하게",
       "낮은 소리",
       "작은 소리",
       "작게 떨림"
      ],
      [
       "15 cm",
       "세게",
       "낮은 소리",
       "큰 소리",
       "크게 떨림"
      ]
     ]
    },
    {
     "type": "field",
     "title": "같은 길이에서 비교",
     "hint": "10 cm에서 약하게·세게를 비교해 달라진 것과 같은 것을 설명해요.",
     "lines": 3,
     "draw": false
    },
    {
     "type": "field",
     "title": "같은 세기에서 비교",
     "hint": "약하게 튕긴 5 cm와15 cm의 높낮이를 비교해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "같은 듣는 위치에서 크고 작음과 높고 낮음을 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "기기의 음량·소리 끔 상태가 달라지면 들리는 크기를 바로 비교하기 어려워요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "길이와 높낮이",
   "title": "자를 짧게 내밀면 어떤 차이가 있을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "같은 자의 내민 길이",
      "가상 관찰의 높낮이"
     ],
     "rows": [
      [
       "8cm",
       "높음"
      ],
      [
       "12cm",
       "중간"
      ],
      [
       "16cm",
       "낮음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "재료·너비·두께가 같은 자를 같은 방법으로 고정하고 비슷하게 튕겼어요. 듣는 자리도 같아요. 길이만 다르게 한 가상 비교 기록이에요."
    },
    {
     "type": "example",
     "question": "12cm보다 높은 소리를 보인 기록은?",
     "steps": [
      [
       "조건 읽기",
       "내민 길이 외의 비교 조건은 같게 했어요."
      ],
      [
       "결과 연결",
       "8cm의 높음은 12cm의 중간보다 높은 소리예요."
      ]
     ],
     "answer": "이 비교에서는 짧게 내민 자 쪽이 더 높은 소리를 보였어요."
    },
    {
     "type": "field",
     "title": "조건이 달라지면",
     "hint": "두께가 다른 자를 비교했다면 길이만의 효과라고 정하기 어려운 까닭을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높낮이는 높고 낮음, 세기는 크고 작음이에요."
    },
    {
     "title": "더 알아보기",
     "text": "자를 무리하게 휘거나 얼굴 쪽으로 튕기지 않아요. 교사가 확인한 도구·보호 안경·고정 방법을 사용해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념 연결",
   "title": "세기와 높낮이를 섞지 않아요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "구별할 것",
      "자료에서 살필 근거",
      "설명 예"
     ],
     "rows": [
      [
       "세기",
       "같은 조건의 떨림 크기·들리는 크기",
       "크게 떨릴 때 더 큰 소리"
      ],
      [
       "높낮이",
       "같은 조건에서 떨리는 빠르기·높고 낮음",
       "빨리 떨릴 때 더 높은 소리"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 높은 음도 작게 또는 크게 낼 수 있어요. 낮은 소리도 작은 소리라는 뜻은 아니에요. 같은 물체·비교 조건을 확인하고 관찰한 차이를 설명해요."
    },
    {
     "type": "field",
     "title": "주장 고치기",
     "hint": "“더 큰 소리면 언제나 더 높은 소리다.”라는 주장에 반례를 들어 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높낮이와 세기는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "떨림의 수학적 계산·파형 공식·속력은 이 단원의 필수 답으로 요구하지 않아요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "두 성질로 분류",
   "title": "높고 작은 소리도 있을까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "가상 소리 카드",
      "높낮이",
      "세기"
     ],
     "rows": [
      [
       "가",
       "높음",
       "큼"
      ],
      [
       "나",
       "낮음",
       "큼"
      ],
      [
       "다",
       "높음",
       "작음"
      ],
      [
       "라",
       "낮음",
       "작음"
      ]
     ]
    },
    {
     "type": "example",
     "question": "높낮이만 같은 짝과 세기만 같은 짝을 찾으면?",
     "steps": [
      [
       "높낮이로 묶기",
       "가·다는 모두 높지만 크기는 달라요. 나·라는 모두 낮아요."
      ],
      [
       "세기로 묶기",
       "가·나는 모두 크지만 높낮이는 달라요. 다·라는 모두 작아요."
      ]
     ],
     "answer": "가·다는 같은 높은 음이라도 세기가 다를 수 있음을 보여 줘요."
    },
    {
     "type": "field",
     "title": "주장 고치기",
     "hint": "“높은 소리이면 언제나 큰 소리다”라는 주장을 카드의 기호와 두 성질로 고쳐 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높음/낮음과 큼/작음을 서로 바꾸어 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "한 성질로 묶은 같은 모둠에서도 다른 성질은 다를 수 있어요. 이 표는 실제 들려 준 소리의 측정값이 아니에요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "반복 기록과 빈칸",
   "title": "기록하지 않은 것은 작은 소리일까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "같은 자의 조건",
      "1회",
      "2회",
      "3회"
     ],
     "rows": [
      [
       "약하게 튕김",
       "작게 들림",
       "작게 들림",
       "작게 들림"
      ],
      [
       "조금 더 세게 튕김",
       "더 크게 들림",
       "기록하지 않음",
       "더 크게 들림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 길이·고정 방법·듣는 자리에서 반복한 것으로 정한 가상 자료예요. 들림 기록과 함께 눈으로 본 떨림도 확인할 수 있어요."
    },
    {
     "type": "example",
     "question": "빈칸을 “소리가 안 남”으로 채워도 될까요?",
     "steps": [
      [
       "기록 구별",
       "2회는 들은 결과가 아니라 기록이 없는 칸이에요."
      ],
      [
       "가능한 설명",
       "확인한 1·3회에서는 더 크게 들렸다고 말할 수 있어요."
      ]
     ],
     "answer": "관찰하지 않은 결과를 새로 만들지 않고 다시 확인할 점으로 남겨요."
    },
    {
     "type": "field",
     "title": "다시 확인할 방법",
     "hint": "빠진 기록을 확인할 때 같게 둘 조건과 남길 관찰 항목을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "기록 없음은 작은 소리·소리 없음과 다르게 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "다른 사람이 다르게 느낀 것을 오답으로 단정하지 않아요. 관찰 조건과 사용할 감각을 함께 정해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "전달 현상",
   "title": "공기만 소리를 전할까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "설명용 관찰 사례",
      "살핀 물질",
      "자료에서 말할 수 있는 점"
     ],
     "rows": [
      [
       "교실에서 떨어진 친구 목소리를 들음",
       "공기(기체)",
       "공기가 전달 경로가 될 수 있음"
      ],
      [
       "연결된 실 전화기로 비교함",
       "실(고체)",
       "실을 통한 전달을 살필 수 있음"
      ],
      [
       "물속 방수 장치 사이 신호를 관찰함",
       "물(액체)",
       "액체도 전달 경로가 될 수 있음"
      ]
     ]
    },
    {
     "type": "text",
     "text": "자료의 접촉·연결·거리와 다른 경로도 함께 살펴요. 잘 들린다는 것만으로 언제나 더 빠르거나 더 높은 음이라고 정하지 않아요. 일반 전자 기기를 물에 넣거나 귀를 물에 넣어 시험하는 활동은 하지 않아요."
    },
    {
     "type": "field",
     "title": "실 전화기 비교",
     "hint": "실을 잡았을 때 차이를 보려면 같게 둘 조건 두 가지와 관찰할 것을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "여러 물질을 통한 전달 현상을 근거로 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "조용한 목소리를 쓰고 실을 몸에 감지 않아요. 구멍·날카로운 부분은 교사가 준비해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실 전화기 비교",
   "title": "전달을 비교할 때 무엇을 같게 둘까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "계획의 항목",
      "정한 조건"
     ],
     "rows": [
      [
       "바꿀 것",
       "실을 손으로 잡는지 놓는지"
      ],
      [
       "같게 둘 것",
       "같은 전화기·실 길이·두 사람 위치·목소리 크기"
      ],
      [
       "살필 것",
       "같은 짧은 말을 전했을 때 들리는 차이"
      ],
      [
       "주의할 것",
       "실의 팽팽함과 연결 상태도 함께 확인"
      ]
     ]
    },
    {
     "type": "example",
     "question": "실을 잡는 쪽에서 더 큰 목소리로 말하면?",
     "steps": [
      [
       "조건의 충돌",
       "실을 잡는 여부와 목소리 크기가 함께 달라져요."
      ],
      [
       "계획 수정",
       "목소리·위치·연결을 맞춘 뒤 실을 잡는 여부만 바꾸어요."
      ]
     ],
     "answer": "한 조건의 효과를 살피려면 다른 조건이 섞이지 않게 비교해요."
    },
    {
     "type": "field",
     "title": "관찰 뒤 설명하기",
     "hint": "실을 잡기 전후 실제로 무엇을 적을지 써요. 이 계획만으로 아직 정할 수 없는 결과도 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리가 전달되는 현상과 비교 조건을 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "몸에 실을 감거나 큰 소리를 지르지 않아요. 실을 통한 관찰만으로 공기 등 다른 경로가 전혀 없다고 결론내리지 않아요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "함께 푸는 예제",
   "title": "필요한 소리를 지키며 소음 줄이기",
   "blocks": [
    {
     "type": "diagram",
     "key": "chair",
     "caption": ""
    },
    {
     "type": "example",
     "question": "독서 중 의자 소리가 불편하다는 의견을 받았어요.",
     "steps": [
      [
       "방법 제안",
       "알맞은 덮개나 안전하게 옮기는 방법을 생각해요."
      ],
      [
       "효과 확인",
       "같은 조건의 전후 소리와 상대 의견을 확인해요."
      ]
     ],
     "answer": "방법을 정한 것과 실제 효과를 확인한 결과를 나누어 설명해요."
    },
    {
     "type": "field",
     "title": "내가 제안할 방법",
     "hint": "고칠 부분과 이유, 효과를 확인할 기준을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 사람·시간·활동과 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "안전 경보·안내처럼 필요한 기능은 유지해요. 내게 좋은 음악도 다른 활동에는 방해가 될 수 있어요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "소리와 생활 맥락",
   "title": "같은 음악도 언제나 같은 소음일까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "상황",
      "소리의 역할과 살필 점"
     ],
     "rows": [
      [
       "도서관에서 독서 중",
       "큰 음악이 독서에 방해되는지"
      ],
      [
       "공연장에서 약속한 공연 중",
       "음악을 듣는 활동과 다른 사람의 반응"
      ],
      [
       "대피가 필요한 때",
       "경보와 안내가 들려야 하는 기능"
      ]
     ]
    },
    {
     "type": "example",
     "question": "독서를 방해하는 소리를 줄이려면 모든 소리를 없애나요?",
     "steps": [
      [
       "상황 판단",
       "사람·장소·활동에 어떤 영향을 주는지 살펴요."
      ],
      [
       "필요한 기능",
       "경보·안내처럼 필요한 소리는 유지해요."
      ]
     ],
     "answer": "방해를 줄이면서 필요한 소리의 기능을 지키는 방법을 정해요."
    },
    {
     "type": "field",
     "title": "내가 정할 약속",
     "hint": "하나의 장소를 정하고 줄일 소리·남길 필요한 소리·상대에게 확인할 의견을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높은 소리 자체나 모든 소리를 나쁜 것으로 보지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "내가 좋아하는 소리라도 다른 활동에는 방해가 될 수 있어요. 상대의 상황을 듣고 조정해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실천 전후의 근거",
   "title": "덮개를 붙였더니 언제나 조용해질까요?",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "가상 의자 이동 기록",
      "1회",
      "2회",
      "3회"
     ],
     "rows": [
      [
       "덮개 전",
       "크게 들림",
       "크게 들림",
       "크게 들림"
      ],
      [
       "덮개 후",
       "작게 들림",
       "기록하지 않음",
       "작게 들림"
      ]
     ]
    },
    {
     "type": "text",
     "text": "같은 의자·바닥·이동 거리와 방법·듣는 자리에서 덮개 유무만 다르게 한 연습 기록이에요. 실제 감소량을 측정한 표는 아니에요."
    },
    {
     "type": "example",
     "question": "이 표가 뒷받침하는 설명의 범위는?",
     "steps": [
      [
       "있는 결과",
       "덮개 후 1·3회에서 더 작게 들렸다는 기록이 있어요."
      ],
      [
       "없는 결과",
       "2회와 다른 의자·바닥에서의 효과는 아직 확인하지 않았어요."
      ]
     ],
     "answer": "이 기록의 개선 근거는 말하되 모든 상황에서 같다고 단정하지 않아요."
    },
    {
     "type": "field",
     "title": "실천으로 이어 가기",
     "hint": "허락받은 의자에 쓸 방법과 같은 조건의 전후 비교 계획을 적어요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "diagram",
     "key": "soundSources",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "계획·실제 실천·받은 의견·수정을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "의자를 일부러 세게 끌어 소음을 만들지 않아요. 이동과 덮개 부착은 교사 안내 아래 안전하게 해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 1~3",
   "title": "소리와 떨림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w001",
      "c22-s32-u03-w002",
      "c22-s32-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 4~6",
   "title": "소리와 떨림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w004",
      "c22-s32-u03-w005",
      "c22-s32-u03-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 7~8",
   "title": "소리와 떨림",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w007",
      "c22-s32-u03-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "떨림이 작아 눈에 잘 보이지 않을 수 있어요. 안전한 다른 방법으로 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 9~11",
   "title": "여러 감각과 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w009",
      "c22-s32-u03-w010",
      "c22-s32-u03-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 12~14",
   "title": "여러 감각과 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w012",
      "c22-s32-u03-w013",
      "c22-s32-u03-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 15~16",
   "title": "여러 감각과 안전",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w015",
      "c22-s32-u03-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "모두에게 같은 들림을 강요하지 않고 시각·촉각 관찰도 존중해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 17~19",
   "title": "소리의 세기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w017",
      "c22-s32-u03-w018",
      "c22-s32-u03-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 20~22",
   "title": "소리의 세기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w020",
      "c22-s32-u03-w021",
      "c22-s32-u03-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 23~24",
   "title": "소리의 세기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w023",
      "c22-s32-u03-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 거리도 소리 크기에 영향을 줄 수 있어요. 같은 조건에서 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 25~27",
   "title": "길이와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w025",
      "c22-s32-u03-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 25~27",
   "title": "길이와 높낮이 · 이어서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 28~30",
   "title": "길이와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w028",
      "c22-s32-u03-w029",
      "c22-s32-u03-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 31~32",
   "title": "길이와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w031",
      "c22-s32-u03-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "재료·두께·고정 방법이 달라지면 길이만의 효과로 정하기 어려워요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 33~35",
   "title": "세기와 높낮이 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w033",
      "c22-s32-u03-w034",
      "c22-s32-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 36~38",
   "title": "세기와 높낮이 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w036",
      "c22-s32-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 36~38",
   "title": "세기와 높낮이 구별 · 이어서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 39~40",
   "title": "세기와 높낮이 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w039",
      "c22-s32-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "높고 낮은 정도와 크고 작은 정도는 서로 다른 성질이에요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 41~43",
   "title": "여러 물질의 전달",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w041",
      "c22-s32-u03-w042",
      "c22-s32-u03-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 44~46",
   "title": "여러 물질의 전달",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w044",
      "c22-s32-u03-w045",
      "c22-s32-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 47~48",
   "title": "여러 물질의 전달",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w047",
      "c22-s32-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소리는 공기뿐 아니라 고체·액체를 통해서도 전달될 수 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본 49~51",
   "title": "소음 줄이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w049",
      "c22-s32-u03-w050",
      "c22-s32-u03-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "비교·선택 52~54",
   "title": "소음 줄이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w052",
      "c22-s32-u03-w053",
      "c22-s32-u03-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "내 말로 설명 55~56",
   "title": "소음 줄이기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w055",
      "c22-s32-u03-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "소음은 상황·사람·활동에 따라 살펴요. 필요한 안전 신호를 없애지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료 해석 57~58",
   "title": "같은 조건의 짝을 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "applied-results",
     "caption": "57·58번 공통 자료"
    },
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w057",
      "c22-s32-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "표에서 같게 둔 조건과 달라진 결과를 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "적용 59~61",
   "title": "관찰·전달·필요한 소리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w059",
      "c22-s32-u03-w060",
      "c22-s32-u03-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "한 관찰로 모든 소리와 모든 상황을 단정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "빈칸 62~64",
   "title": "떨림·세기·높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w062",
      "c22-s32-u03-w063",
      "c22-s32-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "낱말의 뜻과 자료의 차이를 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "빈칸 65~67",
   "title": "비교 조건·전달·소음",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w065",
      "c22-s32-u03-w066",
      "c22-s32-u03-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "듣는 위치와 필요한 기능도 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연결 68~69",
   "title": "성질의 뜻과 전달 물질",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w068",
      "c22-s32-u03-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "크고 작음과 높고 낮음을 나누어 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연결 70~71",
   "title": "조건의 역할과 생활 속 행동",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w070",
      "c22-s32-u03-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "바꿀 것·같게 둘 것·결과를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "순서 72~73",
   "title": "관찰에서 근거 설명까지",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w072",
      "c22-s32-u03-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "준비·비교·해석의 흐름으로 생각해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "순서 74",
   "title": "실천 효과를 어떻게 확인할까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w074"
     ]
    },
    {
     "type": "field",
     "title": "비교할 기준",
     "hint": "전후 비교에서 같게 둘 것 두 가지를 덧붙여요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "효과를 미리 확정하지 않고 확인할 방법을 정해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 75",
   "title": "떨림 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 76",
   "title": "공정한 길이 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 77",
   "title": "세기와 높낮이",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 78",
   "title": "전달 경로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 79",
   "title": "소음 줄이기 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "그림·설명 80",
   "title": "필요한 소리와 소음",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s32-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "정리할 것",
     "text": "부분·조건·근거를 이름표로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 조건에서 비교하고 확인한 범위 안에서 설명해요."
    },
    {
     "title": "내 말로 설명",
     "text": "무엇을 바꿨나 → 무엇이 달랐나 → 어떤 근거인가",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "kind": "duplex-blank",
   "section": "",
   "title": "",
   "blocks": [],
   "rail": []
  }
 ]
};

export const learnerPriorWorkbook=withStudentOpeningLanguage(withSoundRails(baseWorkbook));
export const soundUpperPriorWorkbook=withLearnerExplanations(learnerPriorWorkbook);
export const soundPhotoPriorWorkbook=withSoundUpperScience(soundUpperPriorWorkbook);
export const soundReasoningPriorWorkbook=withSoundPhotoLanguage(soundPhotoPriorWorkbook);
export const soundElementaryPriorWorkbook=withSoundLearnerReasoning(soundReasoningPriorWorkbook);
export const workbook=withGrade3PracticeWorkbook(soundElementaryPriorWorkbook);
