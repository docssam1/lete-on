import{withStudentGuideLanguage}from'./student-opening-language.js?v=20261105-student-guide';
import{withObservationLanguage}from'./observation-language.js';
import{withEarthMotionEditorial}from'./c22-s61-u04.editorial.js?v=20261104-earth-motion-questions';
// 지구의 운동128문항. scripts/gen-science-workbook-c22s61u04.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s61-u04",
 "title": "지구의 운동",
 "semester": "6-1",
 "no": 4,
 "theme": "#2456c4",
 "book": "지필드 교과 연결 사고력",
 "richText": true,
 "questions": [
  {
   "id": "c22-s61-u04-w001",
   "no": 1,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T11",
   "topic": "하늘을 읽는 기준",
   "prompt": "서연이는 남쪽을 바라본 채 화면 왼쪽에 있는 별을 짚었습니다. 별의 방향을 바르게 읽은 것을 고르세요.",
   "answer": "① 남쪽을 바라본 왼쪽이므로 동쪽 쪽이다.",
   "explanation": "남쪽을 바라보는 관측자에게 왼쪽은 동쪽, 오른쪽은 서쪽이에요. 화면의 왼쪽이라는 말만으로 방위를 정하지 않고 바라보는 방향과 연결해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "남쪽을 바라본 왼쪽이므로 동쪽 쪽이다.",
    "남쪽을 바라본 왼쪽이므로 서쪽 쪽이다.",
    "화면 왼쪽은 관측 방향과 관계없이 북쪽이다.",
    "별이 있는 쪽이 언제나 남쪽 기준이 된다.",
    "그림의 위아래를 바꾸면 방위도 그대로 유지된다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 남쪽을 바라본 왼쪽이므로 동쪽 쪽이다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w002",
   "no": 2,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T07",
   "topic": "하늘을 읽는 기준",
   "prompt": "두 별자리 화면에서 계절에 따른 차이를 살펴보려 합니다. 비교하기에 가장 알맞은 두 기록은 무엇인가요?",
   "answer": "② 서울·남쪽·밤 9시·같은 확대율의 3월과 9월",
   "explanation": "장소·시각·방향·확대율은 맞추고 날짜를 달리해야 계절 비교의 조건이 갖춰져요. 같은 날의 시각 비교는 하루 변화에 해당해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "서울·3월·밤 9시와 같은 날 밤 10시의 같은 남쪽 기록",
    "서울·남쪽·밤 9시·같은 확대율의 3월과 9월",
    "서울·남쪽·밤 9시의 3월과 부산·북쪽·새벽 2시의 9월",
    "서울의 3월 오전 9시와 9월 밤 9시를 방향 없이 저장한 기록",
    "날짜·시각·장소를 지우고 별자리 이름만 남긴 두 기록"
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 서울·남쪽·밤 9시·같은 확대율의 3월과 9월 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w003",
   "no": 3,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "관찰 기록을 다른 사람이 다시 확인할 수 있게 남긴 설명을 고르세요. (2개 선택)",
   "answer": "③, ⑤",
   "explanation": "위치 기록은 언제·어디서·어느 방향에서 어떤 자료로 보았는지 함께 있어야 해요. 불분명한 상태를 예상 결과로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "잘 보이지 않은 별의 위치를 예상대로 채워 넣었다.",
    "“별이 오른쪽에 있었다”만 적었다.",
    "장소·날짜·시각과 바라본 방향을 함께 적었다.",
    "프로그램의 배경 풍경을 실제 학교 운동장 사진이라고 적었다.",
    "직접 야외에서 본 기록과 프로그램에서 본 기록을 구별했다."
   ],
   "key": [
    2,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     2,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ③, ⑤. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w004",
   "no": 4,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "같은 날짜의 밤 9시와 밤 10시 별무리 위치를 비교할 때 맞춰야 할 조건을 고르세요. (2개 선택)",
   "answer": "①, ④",
   "explanation": "이 비교에서는 같은 날의 시각을 바꾸고 장소·방향·확대율과 추적 대상을 맞춰요. 시각까지 같게 하면 한 시간 차이를 비교할 수 없어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "바라보는 방향",
    "같은 별무리를 고르지 않기",
    "날짜마다 다른 확대율 쓰기",
    "관측 장소",
    "시각을 두 화면 모두 밤 9시로 고정하기"
   ],
   "key": [
    0,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ①, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w005",
   "no": 5,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T11",
   "topic": "하늘을 읽는 기준",
   "prompt": "남쪽을 바라보는 사람의 왼쪽은 ㉠[ ], 오른쪽은 ㉡[ ]입니다. 빈칸에 방위를 쓰세요.",
   "answer": "㉠ 동쪽 / ㉡ 서쪽",
   "explanation": "기준은 남쪽을 바라보는 관측자예요. 관측자가 북쪽을 볼 때와 왼쪽·오른쪽을 섞지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "동쪽",
      "동"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "서쪽",
      "서"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "동쪽",
       "동"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "서쪽",
       "서"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 동쪽 / ㉡: 서쪽. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w006",
   "no": 6,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T07",
   "topic": "하늘을 읽는 기준",
   "prompt": "서로 다른 계절의 밤하늘을 비교하려면 같은 장소·방향·확대율에서 날짜는 달리하고, 하루 중 관찰 ㉠[ ]은 같게 맞춥니다.",
   "answer": "㉠ 시각",
   "explanation": "밤 9시와 새벽 2시처럼 다른 시각을 섞으면 하루 위치 변화도 함께 들어와 계절 차이만 읽기 어려워요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "시각",
      "시간"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "시각",
       "시간"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 시각. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w007",
   "no": 7,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T11",
   "topic": "하늘을 읽는 기준",
   "prompt": "같은 자리에서 남쪽을 바라보았습니다. 위치 설명을 방위와 연결하세요.",
   "answer": "(1) ㄱ / (2) ㄴ / (3) ㄷ",
   "explanation": "왼쪽 동쪽/오른쪽 서쪽은 남쪽을 향한다는 조건에서 정해져요. S는 남쪽 표시이며 별 자체의 이름이 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 남쪽 기준 화면 왼쪽의 별",
    "(2) 남쪽 기준 화면 오른쪽의 별",
    "(3) 화면 아래 S가 가리킨 기준 방향"
   ],
   "options": [
    "ㄱ. 동쪽 쪽",
    "ㄴ. 서쪽 쪽",
    "ㄷ. 남쪽"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄱ / (2) ㄴ / (3) ㄷ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 동쪽 쪽",
    "ㄴ. 서쪽 쪽",
    "ㄷ. 남쪽"
   ]
  },
  {
   "id": "c22-s61-u04-w008",
   "no": 8,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "각 기록을 자료 종류와 연결하세요.",
   "answer": "(1) ㄴ / (2) ㄷ / (3) ㄱ",
   "explanation": "세 자료는 서로 보완할 수 있지만 같은 종류의 수행 증거는 아니에요. 프로그램 설정이나 모형 조작을 야외 관측 완료로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 보호자와 운동장에서 직접 본 위치를 남김",
    "(2) 서울·특정 날짜를 설정한 소프트웨어에서 읽음",
    "(3) 별 카드와 지구의를 놓고 교실에서 비교함"
   ],
   "options": [
    "ㄱ. 교실 모형 비교 기록",
    "ㄴ. 실제 야외 관찰 기록",
    "ㄷ. 천체 관측 프로그램 기록"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄴ / (2) ㄷ / (3) ㄱ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 교실 모형 비교 기록",
    "ㄴ. 실제 야외 관찰 기록",
    "ㄷ. 천체 관측 프로그램 기록"
   ]
  },
  {
   "id": "c22-s61-u04-w009",
   "no": 9,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "같은 날의 실제 표시 시각을 이른 것부터 나열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "같은 날이라는 조건에서 9시→12시→15시예요. 다른 날짜가 섞였다면 시각 숫자만으로 순서를 정할 수 없어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 15:00",
    "ㄴ. 09:00",
    "ㄷ. 12:00"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 15:00",
    "ㄴ. 09:00",
    "ㄷ. 12:00"
   ]
  },
  {
   "id": "c22-s61-u04-w010",
   "no": 10,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "교사가 정한 비교 절차입니다. “같은 별무리를 선정하고 처음 위치를 기록한 다음, 한 시간 뒤 같은 자리에서 다시 본다”에 맞는 순서를 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄴ",
   "explanation": "같은 대상을 먼저 고른 뒤 처음 상태를 남겨야 뒤의 관찰과 대응할 수 있어요. 뒤의 결과를 보고 처음 기록을 만들어 넣는 순서가 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 처음 위치·시각을 기록한다.",
    "ㄴ. 한 시간 뒤 같은 방향에서 다시 보고 비교한다.",
    "ㄷ. 남쪽 하늘에서 계속 따라볼 별무리를 선정한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄷ → ㄱ → ㄴ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 처음 위치·시각을 기록한다.",
    "ㄴ. 한 시간 뒤 같은 방향에서 다시 보고 비교한다.",
    "ㄷ. 남쪽 하늘에서 계속 따라볼 별무리를 선정한다."
   ]
  },
  {
   "id": "c22-s61-u04-w011",
   "no": 11,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T07",
   "topic": "하늘을 읽는 기준",
   "prompt": "표의 A와 B를 계절 차이만의 비교라고 하기 어려운 이유 두 가지와 보완할 조건을 쓰세요.",
   "answer": "A와 B는 장소와 시각이 모두 다르다. 장소·시각·방향·확대율을 같게 하고 날짜를 달리해 다시 비교한다.",
   "explanation": "지구상의 위치와 하루 중 시각도 보이는 별무리의 위치에 영향을 줘요. 날짜가 다르다는 사실만으로 다른 조건을 무시할 수 없어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "장소 차이를 표에서 읽음",
    "시각 차이를 표에서 읽음",
    "장소·시각을 맞추고 날짜만 달리하는 보완"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "A와 B는 장소와 시각이 모두 다르다. 장소·시각·방향·확대율을 같게 하고 날짜를 달리해 다시 비교한다.",
    "required": [
     "장소 차이를 표에서 읽음",
     "시각 차이를 표에서 읽음",
     "장소·시각을 맞추고 날짜만 달리하는 보완"
    ]
   },
   "table": {
    "머리": [
     "기록",
     "장소",
     "날짜",
     "시각",
     "방향"
    ],
    "행": [
     [
      "A",
      "서울",
      "3월 21일",
      "21:00",
      "남쪽"
     ],
     [
      "B",
      "부산",
      "9월 21일",
      "23:00",
      "남쪽"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "장소 차이를 표에서 읽음 / 시각 차이를 표에서 읽음 / 장소·시각을 맞추고 날짜만 달리하는 보완. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-11"
  },
  {
   "id": "c22-s61-u04-w012",
   "no": 12,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "표의 두 기록 중 다시 같은 조건으로 화면을 열기 쉬운 것을 고르고, 다른 기록에서 빠진 조건 두 가지 이상을 쓰세요.",
   "answer": "“나”가 더 쉽다. 가에는 장소·날짜·시각·방향과 확대율 등이 빠져 있다. “오른쪽”은 바라보는 방향도 있어야 해석할 수 있다.",
   "explanation": "자료의 이름과 인상만으로 위치 비교를 재현할 수 없어요. 기록 나는 조건을 제공하지만 실제 야외 관측을 증명하는 것은 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "나 선택",
    "서로 다른 빠진 조건 첫째",
    "서로 다른 빠진 조건 둘째"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "“나”가 더 쉽다. 가에는 장소·날짜·시각·방향과 확대율 등이 빠져 있다. “오른쪽”은 바라보는 방향도 있어야 해석할 수 있다.",
    "required": [
     "나 선택",
     "서로 다른 빠진 조건 첫째",
     "서로 다른 빠진 조건 둘째"
    ]
   },
   "table": {
    "머리": [
     "기록",
     "남긴 내용"
    ],
    "행": [
     [
      "가",
      "프로그램에서 밝은 별이 오른쪽에 보였다."
     ],
     [
      "나",
      "서울·2026-03-21·한국 21:00·남쪽·같은 확대율의 프로그램"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "나 선택 / 서로 다른 빠진 조건 첫째 / 서로 다른 빠진 조건 둘째. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-12"
  },
  {
   "id": "c22-s61-u04-w013",
   "no": 13,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T11",
   "topic": "하늘을 읽는 기준",
   "prompt": "남쪽을 본 친구와 북쪽을 본 친구가 모두 “왼쪽 별”이라고 말했습니다. 이 말만으로 같은 방향의 별을 가리켰다고 할 수 없는 까닭을 설명하세요.",
   "answer": "왼쪽은 관측자가 바라보는 방향에 따라 달라진다. 남쪽을 볼 때 왼쪽은 동쪽이고 북쪽을 볼 때 왼쪽은 서쪽이므로 방위와 관측 방향을 함께 적어야 한다.",
   "explanation": "상대적인 화면 위치와 방위를 구별하는 문제예요. 관측자마다 왼쪽이라는 말이 같은 방위를 뜻하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "바라보는 방향 차이",
    "남쪽을 볼 때 왼쪽은 동쪽/북쪽을 볼 때 왼쪽은 서쪽",
    "방위와 관측 방향 함께 표시"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "왼쪽은 관측자가 바라보는 방향에 따라 달라진다. 남쪽을 볼 때 왼쪽은 동쪽이고 북쪽을 볼 때 왼쪽은 서쪽이므로 방위와 관측 방향을 함께 적어야 한다.",
    "required": [
     "바라보는 방향 차이",
     "남쪽을 볼 때 왼쪽은 동쪽/북쪽을 볼 때 왼쪽은 서쪽",
     "방위와 관측 방향 함께 표시"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "바라보는 방향 차이 / 남쪽을 볼 때 왼쪽은 동쪽/북쪽을 볼 때 왼쪽은 서쪽 / 방위와 관측 방향 함께 표시. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w014",
   "no": 14,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "프로그램에서 별 이름표를 켰더니 작은 점에 이름이 많이 붙었습니다. “이 이름표의 별은 지금 우리 집 앞에서 모두 맨눈으로 보인다”는 주장을 어떻게 고칠까요?",
   "answer": "이름표는 프로그램이 표시하는 천체를 찾는 안내이다. 실제 맨눈 관찰 가능성은 밝기·날씨·가림·주변 빛 등 관측 여건도 확인해야 하며, 프로그램을 본 것과 야외에서 본 것을 구별한다.",
   "explanation": "이름표와 계산 화면은 실제 관측의 가시성이나 학생 수행을 자동으로 증명하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "이름표가 안내임을 구별",
    "실제 관측 여건의 구체적인 예",
    "프로그램/야외 관찰 구별"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "이름표는 프로그램이 표시하는 천체를 찾는 안내이다. 실제 맨눈 관찰 가능성은 밝기·날씨·가림·주변 빛 등 관측 여건도 확인해야 하며, 프로그램을 본 것과 야외에서 본 것을 구별한다.",
    "required": [
     "이름표가 안내임을 구별",
     "실제 관측 여건의 구체적인 예",
     "프로그램/야외 관찰 구별"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "이름표가 안내임을 구별 / 실제 관측 여건의 구체적인 예 / 프로그램/야외 관찰 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w015",
   "no": 15,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T11",
   "topic": "하늘을 읽는 기준",
   "prompt": "남쪽을 바라보는 관측자의 위치 안내 카드를 설계하세요. 사람의 시선, 남쪽·동쪽·서쪽, 화면 왼쪽·오른쪽을 혼동하지 않게 표시하세요.",
   "answer": "사람이 남쪽을 향하도록 그리고 시선 앞에 남쪽, 사람의 왼쪽에 동쪽·오른쪽에 서쪽을 표시한다. “남쪽을 바라볼 때”라는 조건을 쓴다.",
   "explanation": "방위 이름만 나열하기보다 관측자의 시선과 좌우의 대응이 보여야 해요. 그림의 예쁨이 아니라 방향 조건을 확인해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "관측자 시선은 남쪽",
    "관측자 왼쪽은 동쪽/오른쪽은 서쪽",
    "조건 문장과 방위 표시"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "사람이 남쪽을 향하도록 그리고 시선 앞에 남쪽, 사람의 왼쪽에 동쪽·오른쪽에 서쪽을 표시한다. “남쪽을 바라볼 때”라는 조건을 쓴다.",
    "required": [
     "관측자 시선은 남쪽",
     "관측자 왼쪽은 동쪽/오른쪽은 서쪽",
     "조건 문장과 방위 표시"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "관측자 시선은 남쪽 / 관측자 왼쪽은 동쪽/오른쪽은 서쪽 / 조건 문장과 방위 표시. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w016",
   "no": 16,
   "section": 1,
   "sectionTitle": "하늘을 읽는 기준",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "하늘을 읽는 기준",
   "prompt": "친구가 관측 프로그램의 두 화면을 다시 열어 비교할 수 있도록 기록칸을 설계하세요. 긴 보고서 대신 꼭 필요한 설정과 위치 기록을 넣으세요.",
   "answer": "장소·날짜·시각·방향·확대율·자료 종류 칸과 같은 별무리 표시/위치 기록 칸을 만든다. 실제 표시 시각도 남기고 모르는 칸은 꾸미지 않는다.",
   "explanation": "재현 가능한 짧은 기록이 목표예요. 위치를 다시 찾는 데 필요한 조건을 넣고 확인하지 못한 부분은 그대로 밝혀요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "장소·날짜·시각·방향",
    "확대율과 자료 종류",
    "같은 대상의 위치 기록과 불분명한 상태 보존"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "장소·날짜·시각·방향·확대율·자료 종류 칸과 같은 별무리 표시/위치 기록 칸을 만든다. 실제 표시 시각도 남기고 모르는 칸은 꾸미지 않는다.",
    "required": [
     "장소·날짜·시각·방향",
     "확대율과 자료 종류",
     "같은 대상의 위치 기록과 불분명한 상태 보존"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "장소·날짜·시각·방향 / 확대율과 자료 종류 / 같은 대상의 위치 기록과 불분명한 상태 보존. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w017",
   "no": 17,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T01",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "남쪽 하늘의 태양 위치 연습표를 읽었습니다. 이 기록이 나타내는 겉보기 이동을 고르세요.",
   "answer": "③ 동쪽 쪽에서 서쪽 쪽으로 위치가 달라진다.",
   "explanation": "남쪽을 볼 때 왼쪽은 동쪽, 오른쪽은 서쪽이에요. 이 연습 기록의 하루 겉보기 변화는 지구 자전과 연결해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "태양이 북극성을 중심으로 남쪽을 가로지른다.",
    "태양이 매일 지구 둘레를 공전했다는 직접 측정이다.",
    "동쪽 쪽에서 서쪽 쪽으로 위치가 달라진다.",
    "서쪽 쪽에서 동쪽 쪽으로 위치가 달라진다.",
    "같은 날의 태양 위치는 계절마다 반대로 바뀐다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "table": {
    "머리": [
     "시각",
     "위치"
    ],
    "행": [
     [
      "오전",
      "남쪽 기준 왼쪽 하늘"
     ],
     [
      "오후",
      "남쪽 기준 오른쪽 하늘"
     ]
    ]
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 동쪽 쪽에서 서쪽 쪽으로 위치가 달라진다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다.",
   "figure": "earth-question-data-17"
  },
  {
   "id": "c22-s61-u04-w018",
   "no": 18,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "같은 밤에 같은 별무리를 한 시간 간격으로 찾으려 합니다. 가장 적절한 방법을 고르세요.",
   "answer": "④ 같은 방향에서 별 배열을 대조해 위치를 비교한다.",
   "explanation": "같은 대상인지 확인한 뒤 기준 방향에 대한 위치를 비교해야 해요. 별의 배열은 대상을 찾는 근거이고 화면 설정을 바꾸면 겉보기 위치 비교가 어려워져요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "별무리를 찾을 때마다 다른 확대율과 방향을 사용한다.",
    "이름표가 있는 모든 점의 숫자만 세어 같은 별인지 정한다.",
    "나중 화면을 보고 처음 위치를 기억에 맞춰 새로 그린다.",
    "같은 방향에서 별 배열을 대조해 위치를 비교한다.",
    "첫 화면과 다른 별자리 이름을 골라 두 위치가 같다고 본다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 같은 방향에서 별 배열을 대조해 위치를 비교한다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w019",
   "no": 19,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "하루 동안의 태양 위치 활동을 안전하고 타당하게 하는 설명을 고르세요. (2개 선택)",
   "answer": "③, ④",
   "explanation": "태양을 직접 보지 않고 안전한 방법을 교사와 정해요. 하루 비교에서는 장소·날짜·방향을 맞추고 시각을 바꿔요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "태양을 맨눈으로 오래 응시하여 위치를 정한다.",
    "프로그램을 쓰면 야외 관측을 실제로 마쳤다고 적는다.",
    "교사가 준비한 안전한 간접 자료나 프로그램을 이용한다.",
    "같은 장소·날짜·바라보는 방향을 맞춰 시각별로 비교한다.",
    "더 정확하게 보려고 쌍안경으로 태양을 직접 본다."
   ],
   "key": [
    2,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     2,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ③, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w020",
   "no": 20,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "같은 밤 남쪽 별무리의 위치를 비교한 기록에서 가능한 해석을 고르세요. (2개 선택)",
   "answer": "③, ⑤",
   "explanation": "하루 변화와 계절 변화를 구별하고, 같은 대상과 방향 조건을 확인해요. 자료 읽기는 실제 수행과 별개예요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "별자리 선이 별들을 실제 줄로 연결했다는 뜻이다.",
    "사진만 읽었어도 학생이 야외 관측을 한 것으로 기록한다.",
    "두 시각의 별 배열로 같은 별무리인지 확인할 수 있다.",
    "한 시간의 위치 변화로 지구 공전의 일 년 주기를 직접 측정했다.",
    "관측자의 방향도 바뀌었으면 위치 차이의 원인이 섞일 수 있다."
   ],
   "key": [
    2,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     2,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ③, ⑤. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w021",
   "no": 21,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T01",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "남쪽을 바라보는 하루 태양 위치 기록에서 오전의 왼쪽 하늘은 ㉠[ ]쪽, 오후의 오른쪽 하늘은 ㉡[ ]쪽에 대응합니다.",
   "answer": "㉠ 동쪽 / ㉡ 서쪽",
   "explanation": "남쪽을 향한 지표 관측자의 좌우를 방위로 읽어요. 지구 바깥에서 자전을 내려다보는 그림의 좌우를 그대로 가져오지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "동쪽",
      "동"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "서쪽",
      "서"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "동쪽",
       "동"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "서쪽",
       "서"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 동쪽 / ㉡: 서쪽. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w022",
   "no": 22,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T04",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "같은 날 남쪽 하늘에서 태양과 별이 동쪽 쪽에서 서쪽 쪽으로 위치가 바뀌어 보이는 현상은 지구의 ㉠[ ]과 연결해 설명합니다.",
   "answer": "㉠ 자전",
   "explanation": "하루 위치 변화는 축 중심 자전과 관련돼요. 태양 둘레에서 지구 위치가 옮겨지는 공전의 계절 효과와 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "자전",
      "지구의자전",
      "지구 자전"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "자전",
       "지구의자전",
       "지구 자전"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 자전. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w023",
   "no": 23,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T01",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "같은 날 남쪽 기준 태양 위치의 연습 기록을 시각대와 연결하세요.",
   "answer": "(1) ㄷ / (2) ㄱ / (3) ㄴ",
   "explanation": "이 문항의 단순화한 연습 기록은 오전 동쪽 쪽·낮 남쪽 쪽·오후 서쪽 쪽이에요. 시계 12시에 항상 정확한 남쪽이나 머리 위라고 일반화하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 남쪽 기준 왼쪽 하늘의 태양",
    "(2) 남쪽 하늘 가까이의 태양",
    "(3) 남쪽 기준 오른쪽 하늘의 태양"
   ],
   "options": [
    "ㄱ. 낮무렵",
    "ㄴ. 오후",
    "ㄷ. 오전"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄷ / (2) ㄱ / (3) ㄴ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 낮무렵",
    "ㄴ. 오후",
    "ㄷ. 오전"
   ]
  },
  {
   "id": "c22-s61-u04-w024",
   "no": 24,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "기록을 관찰과 해석·미확인 상태로 연결하세요.",
   "answer": "(1) ㄱ / (2) ㄷ / (3) ㄴ",
   "explanation": "보인 위치 차이와 그 원인 설명은 역할이 다르고 안 보인 상태도 관찰 기록이에요. 구름 때문에 안 보인 것을 예상 위치로 채우지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 같은 별무리가 21시보다 22시에 남쪽 기준 더 오른쪽에 보임",
    "(2) 이 하루 변화를 지구의 자전과 연결해 설명함",
    "(3) 구름 때문에 22시의 별무리 위치를 읽지 못함"
   ],
   "options": [
    "ㄱ. 관찰한 위치 차이",
    "ㄴ. 확인하지 못한 상태",
    "ㄷ. 원인을 연결한 해석"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄱ",
     "ㄷ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄱ / (2) ㄷ / (3) ㄴ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 관찰한 위치 차이",
    "ㄴ. 확인하지 못한 상태",
    "ㄷ. 원인을 연결한 해석"
   ]
  },
  {
   "id": "c22-s61-u04-w025",
   "no": 25,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T01",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "하루 관측 연습 기록의 시간 순서를 쓰세요. 날짜는 모두 같습니다.",
   "answer": "ㄷ → ㄴ → ㄹ → ㄱ",
   "explanation": "같은 날 9시→15시→21시→22시의 순서예요. 태양·별 모두 하루 비교에 쓸 수 있지만 태양 직접 관측을 요구하는 것은 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 별무리 22:00",
    "ㄴ. 태양 15:00",
    "ㄷ. 태양 09:00",
    "ㄹ. 별무리 21:00"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄴ",
     "ㄹ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄷ → ㄴ → ㄹ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 별무리 22:00",
    "ㄴ. 태양 15:00",
    "ㄷ. 태양 09:00",
    "ㄹ. 별무리 21:00"
   ]
  },
  {
   "id": "c22-s61-u04-w026",
   "no": 26,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "같은 별무리 위치를 21시와 22시에 비교합니다. 미리 정한 단계의 순서를 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "처음 기록과 뒤 기록이 있어야 비교 해석을 할 수 있어요. 설정 확인→첫 기록→뒤 기록→비교라는 의존 관계가 있어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 22시에 같은 자리/방향에서 같은 별무리 위치를 남김",
    "ㄴ. 장소·날짜·남쪽 방향과 따라볼 별무리를 정함",
    "ㄷ. 21시 위치와 실제 표시 시각을 먼저 남김",
    "ㄹ. 두 기록의 별 배열·위치 차이와 조건을 대조함"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ",
     "ㄹ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄷ → ㄱ → ㄹ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 22시에 같은 자리/방향에서 같은 별무리 위치를 남김",
    "ㄴ. 장소·날짜·남쪽 방향과 따라볼 별무리를 정함",
    "ㄷ. 21시 위치와 실제 표시 시각을 먼저 남김",
    "ㄹ. 두 기록의 별 배열·위치 차이와 조건을 대조함"
   ]
  },
  {
   "id": "c22-s61-u04-w027",
   "no": 27,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T01",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "연습표에서 별무리의 겉보기 이동 방향을 읽고, 이 표만으로 별무리 모양이 완전히 바뀌었다고 할 수 없는 까닭을 설명하세요.",
   "answer": "남쪽 기준 왼쪽에서 가운데를 지나 오른쪽으로 이동했다. 표의 배열 표시는 같게 유지되어 같은 별무리를 따른 기록이며, 위치 차이와 별 배열 변화를 구별해야 한다.",
   "explanation": "남쪽 기준 좌우를 방위로 읽으면 동쪽 쪽에서 서쪽 쪽의 하루 변화예요. 제공 연습표이지 실제 프로그램 계산이나 학생 실측은 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "왼쪽 → 가운데 → 오른쪽으로 이동한 기록을 읽음",
    "같은 배열 표시를 근거로 삼음",
    "위치와 모양, 자료 종류를 구별함"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "남쪽 기준 왼쪽에서 가운데를 지나 오른쪽으로 이동했다. 표의 배열 표시는 같게 유지되어 같은 별무리를 따른 기록이며, 위치 차이와 별 배열 변화를 구별해야 한다.",
    "required": [
     "왼쪽 → 가운데 → 오른쪽으로 이동한 기록을 읽음",
     "같은 배열 표시를 근거로 삼음",
     "위치와 모양, 자료 종류를 구별함"
    ]
   },
   "table": {
    "머리": [
     "시각",
     "남쪽 기준 위치",
     "별 배열 표시"
    ],
    "행": [
     [
      "20:00",
      "왼쪽",
      "P와 주변 세 별"
     ],
     [
      "21:00",
      "가운데 쪽",
      "P와 주변 세 별"
     ],
     [
      "22:00",
      "오른쪽",
      "P와 주변 세 별"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "왼쪽 → 가운데 → 오른쪽으로 이동한 기록을 읽음 / 같은 배열 표시를 근거로 삼음 / 위치와 모양, 자료 종류를 구별함. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-27"
  },
  {
   "id": "c22-s61-u04-w028",
   "no": 28,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "표에서 22시 관찰을 어떻게 남겨야 할지 판단하고, 다음 관찰 방법을 제안하세요.",
   "answer": "22시에는 구름으로 위치를 읽지 못했다고 그대로 남긴다. 안전한 조건에서 다음 관찰을 이어가거나 같은 설정의 프로그램을 별도 자료로 비교한다. 예상값을 실측란에 채우지 않는다.",
   "explanation": "관측 불가는 별이 없다는 확정이 아니고 기록을 꾸며도 되는 이유도 아니에요. 재관측/프로그램의 자료 종류도 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "22시에 불분명했던 상태를 그대로 남김",
    "예상으로 실측을 대체하지 않음",
    "안전한 재관찰 또는 별도 프로그램 비교"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "22시에는 구름으로 위치를 읽지 못했다고 그대로 남긴다. 안전한 조건에서 다음 관찰을 이어가거나 같은 설정의 프로그램을 별도 자료로 비교한다. 예상값을 실측란에 채우지 않는다.",
    "required": [
     "22시에 불분명했던 상태를 그대로 남김",
     "예상으로 실측을 대체하지 않음",
     "안전한 재관찰 또는 별도 프로그램 비교"
    ]
   },
   "table": {
    "머리": [
     "시각",
     "같은 남쪽 별무리"
    ],
    "행": [
     [
      "21:00",
      "위치 확인"
     ],
     [
      "22:00",
      "구름으로 안 보임"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "22시에 불분명했던 상태를 그대로 남김 / 예상으로 실측을 대체하지 않음 / 안전한 재관찰 또는 별도 프로그램 비교. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-28"
  },
  {
   "id": "c22-s61-u04-w029",
   "no": 29,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T04",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "“밤하늘 별무리가 한 시간 뒤 서쪽 쪽에 보였으니 별들이 매일 지구 주위를 실제로 한 바퀴 공전한다”는 설명에서 관찰한 사실과 고쳐야 할 원인 설명을 나누어 쓰세요.",
   "answer": "한 시간 뒤 같은 별무리가 서쪽 쪽으로 위치가 달라져 보인 것은 관찰이다. 이 겉보기 하루 변화는 지구의 자전과 연결한다. 이 기록만으로 별들의 지구 둘레 공전을 실측했다고 하지 않는다.",
   "explanation": "겉보기 위치 변화를 관찰했다고 그 원인인 천체 운동을 그대로 실측한 것은 아니에요. 지표 관점과 설명 모형을 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "관찰한 위치 차이",
    "지구 자전으로 원인 연결",
    "별의 지구 둘레 공전을 실측했다는 주장 수정"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "한 시간 뒤 같은 별무리가 서쪽 쪽으로 위치가 달라져 보인 것은 관찰이다. 이 겉보기 하루 변화는 지구의 자전과 연결한다. 이 기록만으로 별들의 지구 둘레 공전을 실측했다고 하지 않는다.",
    "required": [
     "관찰한 위치 차이",
     "지구 자전으로 원인 연결",
     "별의 지구 둘레 공전을 실측했다는 주장 수정"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "관찰한 위치 차이 / 지구 자전으로 원인 연결 / 별의 지구 둘레 공전을 실측했다는 주장 수정. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w030",
   "no": 30,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T01",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "“한국의 시계가 12시이면 태양은 언제나 머리 바로 위에 있다”는 설명을 남쪽 하늘 관찰 조건에 맞게 고치세요.",
   "answer": "한국에서 태양이 항상 머리 바로 위에 오는 것은 아니다. 낮 무렵 남쪽 하늘의 위치를 비교하되 시계 12시와 정확히 남쪽에 오는 시각도 항상 같다고 하지 않고 날짜·장소·실제 시각을 확인한다.",
   "explanation": "시계 시각·남중 시각·머리 위 방향을 동일시하지 않아요. 이 단원에서는 정량 고도 계산이나 계절 기온 원인으로 넓히지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "머리 위라는 절대 주장 수정",
    "시계 12시와 정확한 남쪽 시각 구별",
    "날짜·장소·실제 위치 조건"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "한국에서 태양이 항상 머리 바로 위에 오는 것은 아니다. 낮 무렵 남쪽 하늘의 위치를 비교하되 시계 12시와 정확히 남쪽에 오는 시각도 항상 같다고 하지 않고 날짜·장소·실제 시각을 확인한다.",
    "required": [
     "머리 위라는 절대 주장 수정",
     "시계 12시와 정확한 남쪽 시각 구별",
     "날짜·장소·실제 위치 조건"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "머리 위라는 절대 주장 수정 / 시계 12시와 정확한 남쪽 시각 구별 / 날짜·장소·실제 위치 조건. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w031",
   "no": 31,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "같은 밤 별무리를 두 번 관찰하는 짧은 기록 그림틀을 설계하세요. 남쪽 기준 표시와 같은 별무리임을 찾을 표시, 두 시각을 넣으세요.",
   "answer": "같은 남쪽 기준의 두 칸에 21시·22시를 쓴다. 같은 밝은 별과 주변 배열을 표시하고 S에 대한 위치를 비교할 공간을 둔다. 실제 결과는 관찰 뒤 채우며 예상 그림을 실측으로 붙이지 않는다.",
   "explanation": "모양을 따라 같은 대상을 확인하고 기준에 대한 위치를 읽는 틀이 필요해요. 별자리 선의 정교함보다 대상 대응과 관측 조건이 기준이에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "두 시각과 같은 기준 방향",
    "같은 별무리 대응 표시",
    "관찰 전 예상과 실제 기록 구별"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "같은 남쪽 기준의 두 칸에 21시·22시를 쓴다. 같은 밝은 별과 주변 배열을 표시하고 S에 대한 위치를 비교할 공간을 둔다. 실제 결과는 관찰 뒤 채우며 예상 그림을 실측으로 붙이지 않는다.",
    "required": [
     "두 시각과 같은 기준 방향",
     "같은 별무리 대응 표시",
     "관찰 전 예상과 실제 기록 구별"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "두 시각과 같은 기준 방향 / 같은 별무리 대응 표시 / 관찰 전 예상과 실제 기록 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w032",
   "no": 32,
   "section": 2,
   "sectionTitle": "하루 동안 달라지는 태양과 별",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "하루 동안 달라지는 태양과 별",
   "prompt": "태양을 직접 보지 않고 하루 위치 변화를 비교하는 활동을 설계하세요. 사용할 자료·바꿀 조건·같게 할 조건·안전 방법을 그림이나 배치표로 표현하세요.",
   "answer": "관측 프로그램이나 교사 준비 간접 자료를 쓴다. 같은 날의 시각을 바꾸고 장소·남쪽 방향·확대율을 맞춘다. 태양을 직접 보거나 쌍안경으로 보지 않으며 자료 종류와 실제 표시 시각을 기록한다.",
   "explanation": "설계의 안전성과 비교 조건이 목표예요. 직접 태양을 보는 도구를 만들거나 검증되지 않은 필터를 쓰도록 하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "안전한 자료와 태양 직접 관찰 금지",
    "시각을 바꿈",
    "장소·날짜·방향·확대율을 맞춤",
    "자료 종류·실제 시각 기록"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "관측 프로그램이나 교사 준비 간접 자료를 쓴다. 같은 날의 시각을 바꾸고 장소·남쪽 방향·확대율을 맞춘다. 태양을 직접 보거나 쌍안경으로 보지 않으며 자료 종류와 실제 표시 시각을 기록한다.",
    "required": [
     "안전한 자료와 태양 직접 관찰 금지",
     "시각을 바꿈",
     "장소·날짜·방향·확대율을 맞춤",
     "자료 종류·실제 시각 기록"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "안전한 자료와 태양 직접 관찰 금지 / 시각을 바꿈 / 장소·날짜·방향·확대율을 맞춤 / 자료 종류·실제 시각 기록. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w033",
   "no": 33,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T04",
   "topic": "움직이는 관측자",
   "prompt": "고정 광원 앞에서 지구의가 서쪽에서 동쪽으로 자전합니다. 지구 위 관측자에게 보이는 광원의 겉보기 방향을 고르세요.",
   "answer": "⑤ 동쪽에서 서쪽으로 위치가 달라지는 것처럼 보인다.",
   "explanation": "관측자의 시선이 지구와 함께 서쪽에서 동쪽으로 돌아가므로 고정 광원은 반대 방향으로 이동하는 것처럼 보여요. 밖에서 본 광원 위치와 지구 위에서 본 방향을 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "서쪽에서 동쪽으로 위치가 달라지는 것처럼 보인다.",
    "북쪽에서 남쪽으로만 위치가 바뀌는 것처럼 보인다.",
    "관측자가 돌아도 광원의 보이는 방향은 항상 같다.",
    "관측자의 하루 회전 때문에 광원이 실제로 공전한다.",
    "동쪽에서 서쪽으로 위치가 달라지는 것처럼 보인다."
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 동쪽에서 서쪽으로 위치가 달라지는 것처럼 보인다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w034",
   "no": 34,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T08",
   "topic": "움직이는 관측자",
   "prompt": "모형 밖의 민수는 “전등은 그대로 있다”, 지구 위 관측자 역할의 수아는 “전등이 보이는 쪽이 바뀐다”고 말했습니다. 두 설명의 관계를 고르세요.",
   "answer": "① 같은 장치를 서로 다른 관점에서 설명한 것이다.",
   "explanation": "광원은 밖에서 보면 고정되어 있어도 지구와 함께 도는 관측자에게는 보이는 방향이 바뀔 수 있어요. 관점이 다르다는 조건을 먼저 살펴요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "같은 장치를 서로 다른 관점에서 설명한 것이다.",
    "전등이 멈췄다는 말과 방향이 바뀐다는 말은 함께 성립할 수 없다.",
    "두 설명이 다르면 반드시 전등의 위치를 바꿔야 한다.",
    "지구 위 관측자는 지구가 돌아도 같은 방향만 바라본다.",
    "교실 밖 관점에서의 회전과 별의 실제 공전은 같은 말이다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 같은 장치를 서로 다른 관점에서 설명한 것이다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w035",
   "no": 35,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T03",
   "topic": "움직이는 관측자",
   "prompt": "자전과 관측자의 방향을 바르게 설명한 문장을 고르세요. (3개 선택)",
   "answer": "①, ②, ④",
   "explanation": "동서 방위에 따른 자전과 북극 위에서 본 반시계 표현은 같은 운동을 다른 기준으로 설명한 것이에요. 시계 방향 표현에는 관점이 필요해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "지구는 서쪽에서 동쪽으로 자전한다고 설명한다.",
    "같은 자전을 북극 위에서 내려다보면 반시계 방향이다.",
    "지표에서 남쪽 하늘을 보는 관점과 북극 위 관점은 같다.",
    "남쪽 관측자에게 광원은 동쪽에서 서쪽으로 움직이는 듯 보인다.",
    "“시계 방향”이라고만 말하면 보는 곳을 정할 필요가 없다."
   ],
   "key": [
    0,
    1,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     1,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐이나 추가 없이 고른다: ①, ②, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w036",
   "no": 36,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T08",
   "topic": "움직이는 관측자",
   "prompt": "고정 광원과 회전하는 지구의를 설명한 문장 중 타당한 것을 고르세요. (2개 선택)",
   "answer": "②, ④",
   "explanation": "장치 밖의 위치와 관측자가 보는 방향을 구별해요. 이 모형은 관찰과 원인을 연결해 설명하지만 실제 지구 운동을 직접 측정한 자료는 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "교실 모형을 한 바퀴 돌리면 실제 지구 자전을 독립적으로 실측한 것이다.",
    "광원은 고정해도 지구 위 관측자의 시선은 바뀔 수 있다.",
    "자전은 지구의 중심을 태양 둘레 다른 위치로 옮기는 운동이다.",
    "관측자의 겉보기 광원 이동은 자전 방향과 반대일 수 있다.",
    "관측자 시선이 달라졌다는 말은 전등을 실제로 옮겼다는 뜻이다."
   ],
   "key": [
    1,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ②, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w037",
   "no": 37,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T03",
   "topic": "움직이는 관측자",
   "prompt": "지구는 ㉠[ ]에서 ㉡[ ]으로 자전합니다. 지표의 동서 방위를 기준으로 쓰세요.",
   "answer": "㉠ 서쪽 / ㉡ 동쪽",
   "explanation": "자전은 서쪽에서 동쪽으로 도는 운동이에요. 남쪽 하늘에서 태양·별이 이동해 보이는 방향과 서로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "서쪽",
      "서"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "동쪽",
      "동"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "서쪽",
       "서"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "동쪽",
       "동"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 서쪽 / ㉡: 동쪽. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w038",
   "no": 38,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T03",
   "topic": "움직이는 관측자",
   "prompt": "북극 위에서 지구 중심을 내려다본다고 정하면 지구의 자전은 ㉠[ ] 방향입니다.",
   "answer": "㉠ 반시계",
   "explanation": "방향을 판단하기 전에 관점을 정했어요. 다른 쪽에서 본 화면의 시계 방향 표현을 관점 없이 가져오지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "반시계",
      "반시계 방향",
      "시계 반대",
      "시계 반대 방향"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "반시계",
       "반시계 방향",
       "시계 반대",
       "시계 반대 방향"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 반시계. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w039",
   "no": 39,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T08",
   "topic": "움직이는 관측자",
   "prompt": "설명에 사용한 관점이나 대상을 연결하세요.",
   "answer": "(1) ㄷ / (2) ㄴ / (3) ㄱ",
   "explanation": "전등 위치·관측자 시선·방향 판단 관점이 각각 무엇인지 구별해요. 같은 장치에서도 묻는 대상이 다를 수 있어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) “전등은 교실의 같은 위치에 있다.”",
    "(2) “지구와 함께 도는 나에게 전등 방향이 바뀐다.”",
    "(3) “북극 위에서 축 중심 회전을 내려다본다.”"
   ],
   "options": [
    "ㄱ. 시계 방향을 판단할 때 정한 관점",
    "ㄴ. 지구 위 관측자의 시선",
    "ㄷ. 모형 밖에서 본 장치 위치"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄷ / (2) ㄴ / (3) ㄱ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 시계 방향을 판단할 때 정한 관점",
    "ㄴ. 지구 위 관측자의 시선",
    "ㄷ. 모형 밖에서 본 장치 위치"
   ]
  },
  {
   "id": "c22-s61-u04-w040",
   "no": 40,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T06",
   "topic": "움직이는 관측자",
   "prompt": "모형 설명을 대응하는 운동이나 현상과 연결하세요.",
   "answer": "(1) ㄴ / (2) ㄱ / (3) ㄷ",
   "explanation": "회전의 중심과 관측자의 위치를 읽어요. 축 중심 자전, 그에 따른 겉보기 변화, 태양 둘레 공전은 서로 바꾸어 부를 수 없어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 축 중심으로 지구의가 서쪽에서 동쪽으로 돎",
    "(2) 남쪽 하늘의 광원이 동쪽 쪽에서 서쪽 쪽으로 움직여 보임",
    "(3) 지구의 중심을 태양 둘레 다른 자리로 옮김"
   ],
   "options": [
    "ㄱ. 관측자의 하루 겉보기 위치 변화",
    "ㄴ. 자전 모형 조작",
    "ㄷ. 공전 모형 조작"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄴ / (2) ㄱ / (3) ㄷ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 관측자의 하루 겉보기 위치 변화",
    "ㄴ. 자전 모형 조작",
    "ㄷ. 공전 모형 조작"
   ]
  },
  {
   "id": "c22-s61-u04-w041",
   "no": 41,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T03",
   "topic": "움직이는 관측자",
   "prompt": "관점과 자전 방향을 설명하는 수업의 정해진 단계를 순서대로 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "보는 위치를 먼저 정하고 실제 조작을 확인한 뒤 그 기준의 시계 방향 표현을 붙여요. 관점 없이 반시계라는 낱말만 외우는 순서가 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 정한 관점에서 회전 방향을 반시계라고 설명함",
    "ㄴ. 북극 위에서 지구 중심을 내려다보는 위치를 먼저 정함",
    "ㄷ. 지표의 서쪽에서 동쪽으로 모형을 천천히 돌려 확인함"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 정한 관점에서 회전 방향을 반시계라고 설명함",
    "ㄴ. 북극 위에서 지구 중심을 내려다보는 위치를 먼저 정함",
    "ㄷ. 지표의 서쪽에서 동쪽으로 모형을 천천히 돌려 확인함"
   ]
  },
  {
   "id": "c22-s61-u04-w042",
   "no": 42,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T01",
   "topic": "움직이는 관측자",
   "prompt": "관측자 역할을 한 친구가 같은 날 정해진 세 시각에 고정 광원 방향을 기록했습니다. 이른 시각부터 배열하세요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "시각이 순서의 기준이에요. 남쪽을 향한 좌우 관계로 겉보기 이동을 읽되 광원이 실제로 교실을 돌았다고 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 15:00 · 남쪽 기준 오른쪽",
    "ㄴ. 09:00 · 남쪽 기준 왼쪽",
    "ㄷ. 12:00 · 남쪽 가운데 쪽"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "table": {
    "머리": [
     "자료 종류"
    ],
    "행": [
     [
      "하루 변화를 단순화한 교실 모형의 연습 기록"
     ]
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄷ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 15:00 · 남쪽 기준 오른쪽",
    "ㄴ. 09:00 · 남쪽 기준 왼쪽",
    "ㄷ. 12:00 · 남쪽 가운데 쪽"
   ],
   "figure": "earth-question-data-42"
  },
  {
   "id": "c22-s61-u04-w043",
   "no": 43,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T08",
   "topic": "움직이는 관측자",
   "prompt": "표의 두 관점을 연결해 광원의 위치와 보이는 방향이 왜 다른 말인지 설명하세요.",
   "answer": "밖에서 보면 광원은 고정되어 있다. 지구 위 관측자는 지구와 함께 돌아 시선이 바뀌므로 광원이 보이는 방향이 달라질 수 있다. 전등을 옮기지 않아도 두 설명이 함께 성립한다.",
   "explanation": "어떤 물체의 실제 위치를 말하는지, 누구의 시선에 대한 방향인지 구별하는 자료 해석이에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "밖에서 고정 광원 읽음",
    "관측자가 지구와 함께 회전함",
    "위치/겉보기 방향 구별"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "밖에서 보면 광원은 고정되어 있다. 지구 위 관측자는 지구와 함께 돌아 시선이 바뀌므로 광원이 보이는 방향이 달라질 수 있다. 전등을 옮기지 않아도 두 설명이 함께 성립한다.",
    "required": [
     "밖에서 고정 광원 읽음",
     "관측자가 지구와 함께 회전함",
     "위치/겉보기 방향 구별"
    ]
   },
   "table": {
    "머리": [
     "관점",
     "남긴 설명"
    ],
    "행": [
     [
      "모형 밖",
      "광원은 받침의 같은 곳에 있음"
     ],
     [
      "지구 위 관측자",
      "회전 뒤 광원이 보이는 방향이 달라짐"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "밖에서 고정 광원 읽음 / 관측자가 지구와 함께 회전함 / 위치/겉보기 방향 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-43"
  },
  {
   "id": "c22-s61-u04-w044",
   "no": 44,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T10",
   "topic": "움직이는 관측자",
   "prompt": "두 모둠의 기록을 읽고 자전의 겉보기 방향을 비교하기에 더 적절한 모둠과 이유를 쓰세요.",
   "answer": "가가 더 적절하다. 가는 광원을 고정하고 지구의 축 중심 회전만 바꿨다. 나는 광원도 옮겨 보이는 방향 차이에 두 조작이 섞인다.",
   "explanation": "어떤 변화를 원인으로 설명하려면 다른 원인 후보가 동시에 달라지지 않았는지 읽어야 해요. 모형의 조건이 결론 범위를 정해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "가 선택",
    "광원 고정과 축 회전 조건",
    "나의 광원 이동이 원인을 섞음"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "가가 더 적절하다. 가는 광원을 고정하고 지구의 축 중심 회전만 바꿨다. 나는 광원도 옮겨 보이는 방향 차이에 두 조작이 섞인다.",
    "required": [
     "가 선택",
     "광원 고정과 축 회전 조건",
     "나의 광원 이동이 원인을 섞음"
    ]
   },
   "table": {
    "머리": [
     "모둠",
     "지구의",
     "광원"
    ],
    "행": [
     [
      "가",
      "축 중심으로 회전",
      "고정"
     ],
     [
      "나",
      "축 중심으로 회전",
      "지구의 반대 방향으로 이동"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "가 선택 / 광원 고정과 축 회전 조건 / 나의 광원 이동이 원인을 섞음. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-44"
  },
  {
   "id": "c22-s61-u04-w045",
   "no": 45,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T04",
   "topic": "움직이는 관측자",
   "prompt": "“태양이 동쪽에서 서쪽으로 움직여 보이므로 지구도 동쪽에서 서쪽으로 자전한다”는 설명을 관측자 관점으로 고치세요.",
   "answer": "지구는 서쪽에서 동쪽으로 자전한다. 지구와 함께 돌아가는 관측자의 시선이 바뀌어 태양은 반대인 동쪽에서 서쪽으로 이동하는 것처럼 보인다. 실제 자전과 겉보기 방향을 구별한다.",
   "explanation": "보이는 이동 방향과 관측자가 탄 지구의 회전 방향을 같은 것으로 놓은 오류예요. 두 관점을 연결해 바로잡아야 해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "실제 자전 방향",
    "관측자 시선의 회전",
    "반대인 겉보기 방향"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "지구는 서쪽에서 동쪽으로 자전한다. 지구와 함께 돌아가는 관측자의 시선이 바뀌어 태양은 반대인 동쪽에서 서쪽으로 이동하는 것처럼 보인다. 실제 자전과 겉보기 방향을 구별한다.",
    "required": [
     "실제 자전 방향",
     "관측자 시선의 회전",
     "반대인 겉보기 방향"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "실제 자전 방향 / 관측자 시선의 회전 / 반대인 겉보기 방향. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w046",
   "no": 46,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T03",
   "topic": "움직이는 관측자",
   "prompt": "“지구는 시계 방향으로 돈다”라는 설명을 듣고 먼저 물어야 할 조건과, 북극 위 관점에서 바르게 고친 설명을 쓰세요.",
   "answer": "어디에서 어느 쪽을 바라보며 설명했는지 묻는다. 북극 위에서 지구 중심을 내려다보는 관점이면 자전은 반시계 방향이다. 축 중심 하루 회전이라는 운동도 함께 밝힌다.",
   "explanation": "시계 방향 표현은 관측 위치에 의존해요. 방향 낱말 하나만 반대로 바꾸기보다 관점·운동 중심을 함께 명시해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "보는 위치/방향 질문",
    "북극 위 반시계",
    "축 중심 자전 명시"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "어디에서 어느 쪽을 바라보며 설명했는지 묻는다. 북극 위에서 지구 중심을 내려다보는 관점이면 자전은 반시계 방향이다. 축 중심 하루 회전이라는 운동도 함께 밝힌다.",
    "required": [
     "보는 위치/방향 질문",
     "북극 위 반시계",
     "축 중심 자전 명시"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "보는 위치/방향 질문 / 북극 위 반시계 / 축 중심 자전 명시. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w047",
   "no": 47,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T08",
   "topic": "움직이는 관측자",
   "prompt": "같은 장치를 모형 밖에서 본 설명과 지구 위 관측자가 본 설명을 나란히 나타내는 두 칸 그림을 설계하세요. 광원을 옮기지 마세요.",
   "answer": "밖의 칸에는 고정 광원과 축 중심으로 회전하는 지구의를 표시한다. 관측자 칸에는 지구와 함께 바뀌는 시선과 광원의 겉보기 방향을 표시하고 각 관점을 제목으로 구별한다.",
   "explanation": "두 칸을 그려도 광원의 실제 이동을 새로 만들어 넣으면 설명이 바뀌어요. 관점 제목·시선·고정 광원이 핵심이에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-01",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "고정 광원",
    "관점 제목과 지구 회전",
    "관측자 시선/겉보기 방향"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "밖의 칸에는 고정 광원과 축 중심으로 회전하는 지구의를 표시한다. 관측자 칸에는 지구와 함께 바뀌는 시선과 광원의 겉보기 방향을 표시하고 각 관점을 제목으로 구별한다.",
    "required": [
     "고정 광원",
     "관점 제목과 지구 회전",
     "관측자 시선/겉보기 방향"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "고정 광원 / 관점 제목과 지구 회전 / 관측자 시선/겉보기 방향. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w048",
   "no": 48,
   "section": 3,
   "sectionTitle": "움직이는 관측자",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T03",
   "topic": "움직이는 관측자",
   "prompt": "북극 위 관점에서 자전 방향을 설명할 그림을 설계하세요. 축 중심 회전과 관측 위치가 드러나게 그리고, 지표의 남쪽 하늘 그림과 구별하는 문장을 붙이세요.",
   "answer": "북극 위에서 중심을 내려다보는 관점을 글로 밝히고 축 중심의 반시계 회전을 표시한다. “지표에서 남쪽 하늘을 보는 장면이 아니다”라고 구별하고 하루 한 바퀴 자전이라고 쓴다.",
   "explanation": "그림의 화살표 모양보다 어떤 관점·운동 중심·주기를 나타내는지가 판단 기준이에요. 종이 위 설명으로도 관측 위치와 회전 관계를 드러낼 수 있어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "북극 위 관점",
    "축 중심 반시계",
    "지표 관점과 구별하는 문장"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "북극 위에서 중심을 내려다보는 관점을 글로 밝히고 축 중심의 반시계 회전을 표시한다. “지표에서 남쪽 하늘을 보는 장면이 아니다”라고 구별하고 하루 한 바퀴 자전이라고 쓴다.",
    "required": [
     "북극 위 관점",
     "축 중심 반시계",
     "지표 관점과 구별하는 문장"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "북극 위 관점 / 축 중심 반시계 / 지표 관점과 구별하는 문장. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w049",
   "no": 49,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T02",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "광원을 고정하고 지구의의 우리나라 표시를 빛 받는 쪽에서 반대쪽으로 돌렸습니다. 이 변화를 바르게 설명한 것을 고르세요.",
   "answer": "② 자전으로 같은 지역이 빛을 받지 않는 면을 향해 밤이 된다.",
   "explanation": "표시를 그대로 둔 채 지구의가 축 중심으로 회전한 조작이에요. 같은 지역의 빛 받음 여부가 달라져 낮과 밤을 설명해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "표시를 다른 나라로 옮겼으므로 같은 지역의 비교가 아니다.",
    "자전으로 같은 지역이 빛을 받지 않는 면을 향해 밤이 된다.",
    "공전 한 바퀴를 마쳐 같은 지역의 하루가 끝났다는 뜻이다.",
    "달 모형을 새로 끼워야만 밤 상태를 만들 수 있다는 뜻이다.",
    "광원이 매일 지구 둘레를 실제로 돌았다는 측정 결과이다."
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 자전으로 같은 지역이 빛을 받지 않는 면을 향해 밤이 된다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w050",
   "no": 50,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T09",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "같은 순간 지구 모형의 A는 광원을 향한 면, B는 정반대 면에 있습니다. 가장 타당한 설명을 고르세요.",
   "answer": "③ A와 B는 태양에 대한 방향이 달라 낮밤이 다를 수 있다.",
   "explanation": "같은 순간에도 지역이 태양을 향한 방향이 달라 한쪽은 낮, 다른 쪽은 밤일 수 있어요. 시간 변화와 공간의 지역 차이를 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "A의 낮이 끝나야만 지구의 모든 다른 지역도 빛을 받을 수 있다.",
    "A와 B의 차이는 두 지역의 자전 방향이 반대라서 생긴다.",
    "A와 B는 태양에 대한 방향이 달라 낮밤이 다를 수 있다.",
    "같은 지구에 있으므로 A와 B의 낮밤은 항상 같아야 한다.",
    "B에는 태양빛이 원래 없으므로 자전해도 낮이 오지 않는다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: A와 B는 태양에 대한 방향이 달라 낮밤이 다를 수 있다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w051",
   "no": 51,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T10",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "낮과 밤 모형의 비교 조건으로 알맞은 것을 고르세요. (3개 선택)",
   "answer": "①, ③, ④",
   "explanation": "같은 지역·고정 광원·유지한 축을 조건으로 비교해요. 표시는 지구와 함께 회전해야 하고 원하는 결과로 기록을 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "광원을 일정한 위치에 고정한다.",
    "밤을 만들 때마다 표시를 빛 없는 곳으로 떼어 옮긴다.",
    "회전하는 동안 기울어진 축의 방향을 유지한다.",
    "같은 지역 표시를 계속 따라간다.",
    "회전할 때마다 자전축을 마음대로 눕혔다 세운다."
   ],
   "key": [
    0,
    2,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 3개를 빠짐이나 추가 없이 고른다: ①, ③, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w052",
   "no": 52,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T10",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "지구의 모형 활동으로 설명할 수 있는 것을 고르세요. (2개 선택)",
   "answer": "①, ③",
   "explanation": "이 모형은 빛 받음·자전·지역 위치를 연결하는 설명 모형이에요. 실제 거리·속도 실측이나 학생 수행 확인으로 과장하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "한 지역이 자전하며 빛 받는 면과 받지 않는 면을 지나감",
    "학교 운동장에서 실제 지구 자전 속도를 정확히 측정함",
    "같은 순간 서로 반대쪽 지역의 낮밤 상태가 다를 수 있음",
    "모형의 지구와 태양 사이 거리가 실제와 같은 비율임",
    "낮밤을 만들려면 광원을 지구 둘레로 옮겨야 함"
   ],
   "key": [
    0,
    2
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ①, ③. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w053",
   "no": 53,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T02",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "한 지역이 태양빛을 직접 받는 상태는 ㉠[ ], 빛을 직접 받지 않는 반대쪽 상태는 ㉡[ ]에 대응합니다.",
   "answer": "㉠ 낮 / ㉡ 밤",
   "explanation": "구형 지구의 한쪽 면은 직접 빛을 받고 반대쪽은 받지 않아요. 구름이 낀 낮과 밤을 같은 상태로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "낮"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "밤"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "낮"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "밤"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 낮 / ㉡: 밤. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w054",
   "no": 54,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T02",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "우리나라와 같은 지역에 낮과 밤이 번갈아 오는 주된 원인은 지구가 자전축을 중심으로 ㉠[ ]하기 때문입니다.",
   "answer": "㉠ 자전",
   "explanation": "같은 지역이 축 중심 회전으로 빛 받는 쪽과 반대쪽을 지나가요. 한 지역의 하루 낮밤을 일 년 공전으로 설명하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "자전",
      "회전"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "자전",
       "회전"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 자전. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w055",
   "no": 55,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T02",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "고정 광원이 왼쪽에서만 비추는 불투명한 공 모형입니다. 지점을 상태와 연결하세요. 경계 상태를 밤의 한가운데와 구별하세요.",
   "answer": "(1) ㄱ / (2) ㄴ / (3) ㄷ",
   "explanation": "광원을 향한 정면은 직접 빛을 받고 반대 정면은 받지 않아요. 직각 옆면은 단순화한 모형의 경계로 두 정면과 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 광원 쪽 정면인 왼쪽 표면",
    "(2) 광원과 직각인 옆면의 경계",
    "(3) 광원 반대쪽 정면인 오른쪽 표면"
   ],
   "options": [
    "ㄱ. 낮 한가운데에 대응",
    "ㄴ. 빛과 어둠의 경계",
    "ㄷ. 밤 한가운데에 대응"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ]
   },
   "verificationModel": {
    "kind": "illumination-parts",
    "sunVector": [
     -1,
     0,
     0
    ],
    "points": [
     [
      -1,
      0,
      0
     ],
     [
      0,
      1,
      0
     ],
     [
      1,
      0,
      0
     ]
    ],
    "answers": [
     "day",
     "boundary",
     "night"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄱ / (2) ㄴ / (3) ㄷ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 낮 한가운데에 대응",
    "ㄴ. 빛과 어둠의 경계",
    "ㄷ. 밤 한가운데에 대응"
   ]
  },
  {
   "id": "c22-s61-u04-w056",
   "no": 56,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T10",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "낮밤을 설명하는 모형 요소를 실제 대상과 연결하세요.",
   "answer": "(1) ㄴ / (2) ㄷ / (3) ㄱ",
   "explanation": "모형의 각 요소가 무엇을 대신하는지 먼저 정해야 빛 받음 변화를 낮밤과 연결할 수 있어요. 표시를 떼어 옮기는 조작은 같은 지역의 자전과 다릅니다.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 자전축을 중심으로 돌리는 지구의",
    "(2) 같은 위치에서 빛을 비추는 광원",
    "(3) 지구의에 붙여 계속 따라가는 우리나라 표시"
   ],
   "options": [
    "ㄱ. 같은 지역의 관측자를 나타냄",
    "ㄴ. 자전하는 지구를 나타냄",
    "ㄷ. 태양빛을 나타냄"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄴ / (2) ㄷ / (3) ㄱ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 같은 지역의 관측자를 나타냄",
    "ㄴ. 자전하는 지구를 나타냄",
    "ㄷ. 태양빛을 나타냄"
   ]
  },
  {
   "id": "c22-s61-u04-w057",
   "no": 57,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T02",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "우리나라 위치를 나타낸 같은 표시가 “낮 한가운데”에서 출발해 한 바퀴 자전합니다. 주어진 상태를 다음에 만나는 순서대로 쓰세요.",
   "answer": "ㄷ → ㄴ → ㄱ",
   "explanation": "출발 상태를 고정했으므로 낮→밤 쪽 경계→밤 한가운데→다시 낮 한가운데로 이어져요. 세 상태 사이의 모든 시각을 그렸다는 뜻은 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 다시 낮 한가운데",
    "ㄴ. 밤 한가운데",
    "ㄷ. 낮에서 밤으로 가는 경계"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄷ → ㄴ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 다시 낮 한가운데",
    "ㄴ. 밤 한가운데",
    "ㄷ. 낮에서 밤으로 가는 경계"
   ]
  },
  {
   "id": "c22-s61-u04-w058",
   "no": 58,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T10",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "교사가 정한 모형 비교 절차를 순서대로 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "같은 지역과 장치 조건을 정한 뒤 두 상태를 관찰하고 결론을 연결해요. 결론을 먼저 써 놓고 결과를 맞추는 절차가 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 같은 표시를 축 중심 회전으로 광원 반대쪽에 두고 비교함",
    "ㄴ. 광원·축·같은 지역 표시를 확인함",
    "ㄷ. 표시가 광원을 향한 상태의 빛 받음을 먼저 남김",
    "ㄹ. 두 상태를 낮밤과 연결해 설명함"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ",
     "ㄹ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄷ → ㄱ → ㄹ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 같은 표시를 축 중심 회전으로 광원 반대쪽에 두고 비교함",
    "ㄴ. 광원·축·같은 지역 표시를 확인함",
    "ㄷ. 표시가 광원을 향한 상태의 빛 받음을 먼저 남김",
    "ㄹ. 두 상태를 낮밤과 연결해 설명함"
   ]
  },
  {
   "id": "c22-s61-u04-w059",
   "no": 59,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T02",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "두 상태 표를 읽고 같은 지역에 밤이 온 원인과, 이 활동에서 고정한 요소를 각각 설명하세요.",
   "answer": "표시는 지구의 자전으로 광원 반대쪽을 향하게 되어 직접 빛을 받지 않아 밤에 대응한다. 광원 위치와 지구의 축 기울기·같은 지역 표시는 유지했다.",
   "explanation": "같은 지역인지와 무엇을 움직였는지를 자료에서 확인해 원인을 설명해야 해요. 광원 이동이나 표시 교체가 원인이 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "같은 지역 표시 유지",
    "축 중심 자전과 직접 빛 차이",
    "광원 위치/축 조건 고정"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "표시는 지구의 자전으로 광원 반대쪽을 향하게 되어 직접 빛을 받지 않아 밤에 대응한다. 광원 위치와 지구의 축 기울기·같은 지역 표시는 유지했다.",
    "required": [
     "같은 지역 표시 유지",
     "축 중심 자전과 직접 빛 차이",
     "광원 위치/축 조건 고정"
    ]
   },
   "table": {
    "머리": [
     "상태",
     "같은 표시의 방향",
     "직접 빛"
    ],
    "행": [
     [
      "처음",
      "광원 쪽",
      "받음"
     ],
     [
      "회전 뒤",
      "광원 반대쪽",
      "받지 않음"
     ]
    ]
   },
   "givens": {
    "조건": "광원은 고정, 축 기울기 유지, 같은 지역 표시를 떼지 않음"
   },
   "formLabel": "자료 해석",
   "criteria": "같은 지역 표시 유지 / 축 중심 자전과 직접 빛 차이 / 광원 위치/축 조건 고정. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "given": [
    "조건: 광원은 고정, 축 기울기 유지, 같은 지역 표시를 떼지 않음"
   ],
   "figure": "earth-question-data-59"
  },
  {
   "id": "c22-s61-u04-w060",
   "no": 60,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T10",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "예상과 달리 두 면 모두 밝게 보였습니다. 자료를 읽고 바로 “밤은 없다”고 결론내리지 말아야 할 이유와 재확인할 조건을 쓰세요.",
   "answer": "다른 교실 조명이 반대쪽 면까지 비추었을 수 있다. 주변 광원·반사광을 확인하고 고정 광원에 의한 직접 빛 받음과 구별해 다시 비교한다. 실제 밝게 보인 상태는 그대로 남긴다.",
   "explanation": "장치에서 의도하지 않은 빛이 들어오면 모형 조건이 달라져요. 기대 결과로 고치거나 실제 지구의 밤 존재를 부정할 근거로 삼지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "두 면 밝음 결과 보존",
    "주변 광원/반사광 조건",
    "직접 빛 구별과 재비교"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "다른 교실 조명이 반대쪽 면까지 비추었을 수 있다. 주변 광원·반사광을 확인하고 고정 광원에 의한 직접 빛 받음과 구별해 다시 비교한다. 실제 밝게 보인 상태는 그대로 남긴다.",
    "required": [
     "두 면 밝음 결과 보존",
     "주변 광원/반사광 조건",
     "직접 빛 구별과 재비교"
    ]
   },
   "table": {
    "머리": [
     "확인한 조건",
     "관찰"
    ],
    "행": [
     [
      "교실 천장등이 켜짐",
      "광원 반대쪽도 밝아 보임"
     ],
     [
      "모형 광원",
      "한 위치에 고정됨"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "두 면 밝음 결과 보존 / 주변 광원/반사광 조건 / 직접 빛 구별과 재비교. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-60"
  },
  {
   "id": "c22-s61-u04-w061",
   "no": 61,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T02",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "“밤은 달이 매일 태양을 가려 생긴다”는 주장을 오늘의 광원·지구의 모형에 근거해 고치세요.",
   "answer": "달을 끼우지 않아도 불투명한 지구의 반대쪽은 직접 빛을 받지 않는다. 지구가 자전하면서 같은 지역이 그쪽으로 돌아가면 밤에 대응한다. 매일의 낮밤과 다른 천체가 가리는 특별한 현상을 구별한다.",
   "explanation": "필요하지 않은 원인을 끼우지 않고 관찰한 장치 조건으로 설명해야 해요. 달 위상이나 월식 학습으로 범위를 넓히지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "달 없이도 반대쪽이 빛을 받지 않음",
    "같은 지역의 자전",
    "하루 낮밤과 가림 현상 구별"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "달을 끼우지 않아도 불투명한 지구의 반대쪽은 직접 빛을 받지 않는다. 지구가 자전하면서 같은 지역이 그쪽으로 돌아가면 밤에 대응한다. 매일의 낮밤과 다른 천체가 가리는 특별한 현상을 구별한다.",
    "required": [
     "달 없이도 반대쪽이 빛을 받지 않음",
     "같은 지역의 자전",
     "하루 낮밤과 가림 현상 구별"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "달 없이도 반대쪽이 빛을 받지 않음 / 같은 지역의 자전 / 하루 낮밤과 가림 현상 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w062",
   "no": 62,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T09",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "같은 순간 A 지역은 낮, 지구 반대쪽 B 지역은 밤입니다. 시간이 지나 A도 밤이 되는 과정과 처음 두 지역이 달랐던 이유를 나누어 설명하세요.",
   "answer": "처음에는 두 지역이 지구 위에서 태양을 향한 방향이 달라 빛 받음이 달랐다. 시간이 지나 지구가 자전하여 A도 직접 빛을 받지 않는 면으로 돌아가면 밤이 된다.",
   "explanation": "동시에 다른 지역을 비교한 공간 관계와 같은 지역의 시간 변화를 모두 설명해야 해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "처음 A/B의 태양에 대한 방향 차이",
    "자전으로 A 위치 방향 변화",
    "A의 직접 빛 없음과 밤 연결"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "처음에는 두 지역이 지구 위에서 태양을 향한 방향이 달라 빛 받음이 달랐다. 시간이 지나 지구가 자전하여 A도 직접 빛을 받지 않는 면으로 돌아가면 밤이 된다.",
    "required": [
     "처음 A/B의 태양에 대한 방향 차이",
     "자전으로 A 위치 방향 변화",
     "A의 직접 빛 없음과 밤 연결"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "처음 A/B의 태양에 대한 방향 차이 / 자전으로 A 위치 방향 변화 / A의 직접 빛 없음과 밤 연결. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w063",
   "no": 63,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "고정 광원과 지구의의 같은 지역 표시를 이용해 낮과 밤 두 상태를 그리세요. 축 중심 회전·광원·같은 표시의 대응을 드러내세요.",
   "answer": "두 칸에 광원을 같은 쪽에 고정한다. 축 기울기를 유지한 지구의에서 같은 표시가 광원 쪽/반대쪽을 향하게 그리고 직접 빛을 받는지와 낮/밤을 붙인다.",
   "explanation": "광원을 옮기거나 다른 지역으로 표시를 바꾸어 낮밤을 만든 그림은 요구 조건과 달라요. 실제 크기·거리 비율은 재현하지 않아도 돼요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "두 칸의 고정 광원",
    "같은 표시와 기울어진 축",
    "직접 빛과 낮/밤 대응"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "두 칸에 광원을 같은 쪽에 고정한다. 축 기울기를 유지한 지구의에서 같은 표시가 광원 쪽/반대쪽을 향하게 그리고 직접 빛을 받는지와 낮/밤을 붙인다.",
    "required": [
     "두 칸의 고정 광원",
     "같은 표시와 기울어진 축",
     "직접 빛과 낮/밤 대응"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "두 칸의 고정 광원 / 같은 표시와 기울어진 축 / 직접 빛과 낮/밤 대응. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w064",
   "no": 64,
   "section": 4,
   "sectionTitle": "낮과 밤을 만드는 모형",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "낮과 밤을 만드는 모형",
   "prompt": "낮밤 모형에서 주변 조명의 영향을 줄여 비교하는 방법을 설계하세요. 안전한 장치 배치와 관찰할 항목을 그림 또는 표로 나타내세요.",
   "answer": "교사가 안정된 LED 광원·받침·전선을 준비한다. 주변 빛을 확인하고 같은 광원·축·지역 표시를 유지해 두 상태의 직접 빛 받음을 관찰한다. 눈에 광원을 비추거나 뜨거운 기구를 사용하지 않는다.",
   "explanation": "장치를 어둡게 한다는 이유로 안전한 이동·받침 상태를 놓치지 않아요. 모형 조건과 실제 관찰 항목을 함께 설계해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "주변 광원 확인",
    "고정 조건과 직접 빛 비교",
    "안정된 LED/받침/전선·눈 보호"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "교사가 안정된 LED 광원·받침·전선을 준비한다. 주변 빛을 확인하고 같은 광원·축·지역 표시를 유지해 두 상태의 직접 빛 받음을 관찰한다. 눈에 광원을 비추거나 뜨거운 기구를 사용하지 않는다.",
    "required": [
     "주변 광원 확인",
     "고정 조건과 직접 빛 비교",
     "안정된 LED/받침/전선·눈 보호"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "주변 광원 확인 / 고정 조건과 직접 빛 비교 / 안정된 LED/받침/전선·눈 보호. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w065",
   "no": 65,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T03",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "지구의 중심을 다른 곳으로 옮기지 않고 기울어진 축을 중심으로 한 바퀴 돌렸습니다. 조작과 대응하는 운동을 고르세요.",
   "answer": "④ 자전이며 한 바퀴를 하루에 대응시킨다.",
   "explanation": "축 중심 회전은 자전이고 태양 둘레 지구 위치 이동은 공전이에요. 기간을 묻기 전에 회전·이동 중심을 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "자전이며 한 바퀴를 일 년에 대응시킨다.",
    "공전이며 한 바퀴를 일 년에 대응시킨다.",
    "축 회전과 태양 둘레 이동은 같은 조작이다.",
    "자전이며 한 바퀴를 하루에 대응시킨다.",
    "공전이며 한 바퀴를 하루에 대응시킨다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 자전이며 한 바퀴를 하루에 대응시킨다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w066",
   "no": 66,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T07",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "같은 장소·밤 9시·남쪽 하늘을 3월과 9월에 비교하여 다른 별무리 위치를 살폈습니다. 주로 연결할 지구 운동을 고르세요.",
   "answer": "⑤ 태양 둘레 공전으로 밤에 바라보는 방향이 달라짐",
   "explanation": "같은 시각·장소에서 날짜를 달리한 계절별 밤하늘 차이는 지구 공전과 연결해요. 자전은 하루 시간 범위의 변화와 구별해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "축 중심 자전 한 바퀴가 일 년에 걸려 일어남",
    "지구가 멈춰 있어 먼 별 카드만 매일 지구를 돎",
    "태양이 같은 지역 둘레를 하루에 한 바퀴 공전함",
    "축 중심 회전 방향이 계절마다 거꾸로 바뀜",
    "태양 둘레 공전으로 밤에 바라보는 방향이 달라짐"
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 태양 둘레 공전으로 밤에 바라보는 방향이 달라짐 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w067",
   "no": 67,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "자전과 공전의 대응이 바른 것을 고르세요. (2개 선택)",
   "answer": "①, ④",
   "explanation": "자전은 축/하루, 공전은 태양/일 년으로 구별해요. 두 운동 모두 지구의 운동이지만 중심과 시간 범위가 같지는 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "공전 — 태양 둘레 이동 — 일 년",
    "자전과 공전 — 중심과 기간이 모두 같음",
    "자전 — 태양 둘레 이동 — 일 년",
    "자전 — 자전축 중심 회전 — 하루",
    "공전 — 자전축 중심 회전 — 하루"
   ],
   "key": [
    0,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ①, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w068",
   "no": 68,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "하루 낮밤 변화와 계절별 별자리 차이를 설명한 문장을 고르세요. (2개 선택)",
   "answer": "①, ⑤",
   "explanation": "시간 범위와 같게 한 조건을 함께 읽어요. 두 운동은 함께 일어나지만 각 비교가 보여 주는 관계를 구별해야 해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "계절별 밤하늘 차이는 같은 시각에 보아도 나타날 수 있다.",
    "공전만 하고 축 중심 회전이 없어도 이 모형의 하루 자전을 마친 것이다.",
    "관측 시각을 바꾸어 얻은 한 시간 차이는 그 자체로 일 년 비교이다.",
    "관측 방향을 바꾸어도 계절이라는 원인만 그대로 검증한 것이다.",
    "같은 지역의 낮밤 변화는 자전과 빛 받는 면을 연결한다."
   ],
   "key": [
    0,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ①, ⑤. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w069",
   "no": 69,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "지구의 자전은 ㉠[ ] 중심으로 도는 하루 운동, 공전은 ㉡[ ] 둘레를 이동하는 일 년 운동입니다.",
   "answer": "㉠ 자전축 / ㉡ 태양",
   "explanation": "도는 중심을 구별하면 하루 자전과 일 년 공전을 바꾸어 부르는 오류를 줄일 수 있어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "자전축",
      "축"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "태양",
      "해"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "자전축",
       "축"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "태양",
       "해"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 자전축 / ㉡: 태양. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w070",
   "no": 70,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "지구는 자전축을 중심으로 약 ㉠[ ]에 한 바퀴 자전하고, 태양 둘레를 약 ㉡[ ]에 한 바퀴 공전합니다.",
   "answer": "㉠ 하루 / ㉡ 일 년",
   "explanation": "초등 학습의 하루·일 년 대응이에요. 한 시간의 별 위치 변화로 일 년 주기를 측정했다고 하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "하루",
      "1일",
      "24시간",
      "약 하루",
      "약 1일"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "일 년",
      "일년",
      "1년",
      "약 일 년",
      "약 1년"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "하루",
       "1일",
       "24시간",
       "약 하루",
       "약 1일"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "일 년",
       "일년",
       "1년",
       "약 일 년",
       "약 1년"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 하루 / ㉡: 일 년. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w071",
   "no": 71,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T10",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "수업에서 한 조작을 지구 운동 또는 관측 현상과 연결하세요.",
   "answer": "(1) ㄷ / (2) ㄱ / (3) ㄴ",
   "explanation": "자전 모형 조작과 그 결과인 관측자의 겉보기 변화도 다른 단계예요. 중심 이동의 유무를 확인해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 지구의 중심을 고정하고 축 주위로 돌림",
    "(2) 지구의를 중앙 태양 둘레 다른 자리로 옮김",
    "(3) 남쪽 별무리 위치가 같은 날 시각에 따라 달라져 보임"
   ],
   "options": [
    "ㄱ. 공전 모형",
    "ㄴ. 하루의 겉보기 변화",
    "ㄷ. 자전 모형"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄷ / (2) ㄱ / (3) ㄴ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 공전 모형",
    "ㄴ. 하루의 겉보기 변화",
    "ㄷ. 자전 모형"
   ]
  },
  {
   "id": "c22-s61-u04-w072",
   "no": 72,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "서로 다른 비교 기록을 주로 연결할 설명과 짝지으세요.",
   "answer": "(1) ㄱ / (2) ㄷ / (3) ㄴ",
   "explanation": "하루와 계절의 시간 차이, 동시에 다른 지역의 위치 차이를 나누어 읽어요. 모든 기록을 같은 기간의 같은 운동으로 설명하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 같은 장소·날짜·남쪽의 오전과 오후 태양",
    "(2) 같은 장소·밤 9시·남쪽의 3월과 9월 별무리",
    "(3) 같은 순간 광원 쪽과 반대쪽의 두 지역"
   ],
   "options": [
    "ㄱ. 자전과 하루 겉보기 이동",
    "ㄴ. 태양에 대한 지역 위치와 빛 받음",
    "ㄷ. 공전과 밤에 바라보는 방향"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄱ",
     "ㄷ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄱ / (2) ㄷ / (3) ㄴ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 자전과 하루 겉보기 이동",
    "ㄴ. 태양에 대한 지역 위치와 빛 받음",
    "ㄷ. 공전과 밤에 바라보는 방향"
   ]
  },
  {
   "id": "c22-s61-u04-w073",
   "no": 73,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "공전면 북쪽 위에서 내려다보는 모형입니다. 태양 오른쪽에서 출발해 반시계 방향으로 공전할 때, 주어진 네 위치의 순서를 쓰세요.",
   "answer": "ㄷ → ㄹ → ㄴ → ㄱ",
   "explanation": "모형 배치의 위·아래·왼쪽·오른쪽은 공전면을 위에서 본 위치예요. 오른쪽 출발의 반시계 이동은 위→왼쪽→아래로 이어져요. 지표 남쪽 하늘의 방위를 뜻하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 태양 아래쪽",
    "ㄴ. 태양 왼쪽",
    "ㄷ. 태양 오른쪽(출발)",
    "ㄹ. 태양 위쪽"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄹ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "verificationModel": {
    "kind": "orbit-order",
    "points": {
     "ㄱ": [
      0,
      -1
     ],
     "ㄴ": [
      -1,
      0
     ],
     "ㄷ": [
      1,
      0
     ],
     "ㄹ": [
      0,
      1
     ]
    },
    "start": "ㄷ",
    "direction": "counterclockwise",
    "expected": [
     "ㄷ",
     "ㄹ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄷ → ㄹ → ㄴ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 태양 아래쪽",
    "ㄴ. 태양 왼쪽",
    "ㄷ. 태양 오른쪽(출발)",
    "ㄹ. 태양 위쪽"
   ]
  },
  {
   "id": "c22-s61-u04-w074",
   "no": 74,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T07",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "한 해의 계절 비교 파일을 1월 1일에서 시작하는 달력 순서로 정리하세요. 모두 같은 해·같은 장소·밤 9시 기록입니다.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "달력의 시작점을 정했으므로 3→6→9→12월로 정렬해요. 시작점 없는 계절 순환 문제와 구별하며, 같은 시각 비교 조건도 유지해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 9월 21일",
    "ㄴ. 3월 21일",
    "ㄷ. 12월 21일",
    "ㄹ. 6월 21일"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄹ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄹ → ㄱ → ㄷ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 9월 21일",
    "ㄴ. 3월 21일",
    "ㄷ. 12월 21일",
    "ㄹ. 6월 21일"
   ]
  },
  {
   "id": "c22-s61-u04-w075",
   "no": 75,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "두 모형의 조작 기록에서 자전과 공전을 구별하고, 각각 연결할 시간 범위를 쓰세요.",
   "answer": "A는 축 중심 한 바퀴라 자전/하루, B는 태양 둘레 한 바퀴라 공전/일 년이다. 둘 다 원을 그렸다는 모양만으로 같은 운동이라고 하지 않는다.",
   "explanation": "움직임의 중심과 지구의 중심 위치 변화가 판단 근거예요. 원 모양 자체가 운동의 이름을 정하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "A의 축/하루 자전",
    "B의 태양/일 년 공전",
    "중심이 다른 근거"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "A는 축 중심 한 바퀴라 자전/하루, B는 태양 둘레 한 바퀴라 공전/일 년이다. 둘 다 원을 그렸다는 모양만으로 같은 운동이라고 하지 않는다.",
    "required": [
     "A의 축/하루 자전",
     "B의 태양/일 년 공전",
     "중심이 다른 근거"
    ]
   },
   "table": {
    "머리": [
     "모형",
     "조작",
     "지구의 중심"
    ],
    "행": [
     [
      "A",
      "기울어진 축 중심 한 바퀴",
      "제자리"
     ],
     [
      "B",
      "고정 태양 모형 둘레 한 바퀴",
      "태양 둘레로 이동"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "A의 축/하루 자전 / B의 태양/일 년 공전 / 중심이 다른 근거. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-75"
  },
  {
   "id": "c22-s61-u04-w076",
   "no": 76,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T07",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "두 기록 중 하루 변화와 계절별 차이를 각각 고르고, 시각이라는 조건의 역할을 설명하세요.",
   "answer": "가는 같은 날짜에 시각을 바꾼 하루 비교이고, 나는 같은 시각에서 날짜를 달리한 계절 비교이다. 계절 비교에서 시각을 맞춰 하루 위치 변화가 섞이지 않게 한다.",
   "explanation": "같은 시각은 모든 관찰에서 무조건 고정할 조건이 아니라 무엇을 비교하는지에 따라 역할이 달라져요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "가의 같은 날 시각 차이",
    "나의 같은 시각 날짜 차이",
    "비교 목적에 따른 시각 조건"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "가는 같은 날짜에 시각을 바꾼 하루 비교이고, 나는 같은 시각에서 날짜를 달리한 계절 비교이다. 계절 비교에서 시각을 맞춰 하루 위치 변화가 섞이지 않게 한다.",
    "required": [
     "가의 같은 날 시각 차이",
     "나의 같은 시각 날짜 차이",
     "비교 목적에 따른 시각 조건"
    ]
   },
   "table": {
    "머리": [
     "기록",
     "장소/방향",
     "날짜",
     "시각"
    ],
    "행": [
     [
      "가",
      "서울/남쪽",
      "3월 21일/3월 21일",
      "21시/22시"
     ],
     [
      "나",
      "서울/남쪽",
      "3월 21일/9월 21일",
      "21시/21시"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "가의 같은 날 시각 차이 / 나의 같은 시각 날짜 차이 / 비교 목적에 따른 시각 조건. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-76"
  },
  {
   "id": "c22-s61-u04-w077",
   "no": 77,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "“지구가 태양 둘레를 하루에 한 바퀴 자전한다”는 문장에는 어떤 개념이 섞였나요? 중심과 기간을 맞춰 두 문장으로 고치세요.",
   "answer": "지구는 자전축을 중심으로 하루에 한 바퀴 자전한다. 지구는 태양 둘레를 일 년에 한 바퀴 공전한다. 원문의 중심·운동 이름·기간을 서로 맞춘다.",
   "explanation": "태양 둘레와 자전이라는 말만 바꾸는 것으로 끝내지 않고 두 운동의 중심과 기간을 모두 재구성해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "축/하루/자전",
    "태양/일 년/공전",
    "혼합된 중심·이름·기간 수정"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "지구는 자전축을 중심으로 하루에 한 바퀴 자전한다. 지구는 태양 둘레를 일 년에 한 바퀴 공전한다. 원문의 중심·운동 이름·기간을 서로 맞춘다.",
    "required": [
     "축/하루/자전",
     "태양/일 년/공전",
     "혼합된 중심·이름·기간 수정"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "축/하루/자전 / 태양/일 년/공전 / 혼합된 중심·이름·기간 수정. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w078",
   "no": 78,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T06",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "지구는 자전도 공전도 합니다. 그런데 하루 별무리 이동 문제와 계절별 밤하늘 문제에서 주로 설명하는 운동이 다른 까닭을 쓰세요.",
   "answer": "같은 날 시각을 바꾼 비교는 관측자가 지구와 함께 도는 자전에 따른 겉보기 이동을 본다. 같은 장소·시각에서 계절 날짜를 바꾼 비교는 태양 둘레 지구 위치가 달라져 밤에 보는 방향이 달라지는 공전과 연결한다.",
   "explanation": "한 운동만 실제로 일어난다는 뜻이 아니라 관찰한 시간 범위와 조건에 맞는 관계를 설명하는 것이에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "같은 날/시각 변화와 자전",
    "같은 시각/계절 날짜와 공전",
    "두 운동 동시성과 비교 초점 구별"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "같은 날 시각을 바꾼 비교는 관측자가 지구와 함께 도는 자전에 따른 겉보기 이동을 본다. 같은 장소·시각에서 계절 날짜를 바꾼 비교는 태양 둘레 지구 위치가 달라져 밤에 보는 방향이 달라지는 공전과 연결한다.",
    "required": [
     "같은 날/시각 변화와 자전",
     "같은 시각/계절 날짜와 공전",
     "두 운동 동시성과 비교 초점 구별"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "같은 날/시각 변화와 자전 / 같은 시각/계절 날짜와 공전 / 두 운동 동시성과 비교 초점 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w079",
   "no": 79,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "지구 모형의 축 중심 회전과 태양 둘레 이동을 구별하는 두 칸 설명 그림을 설계하세요. 각 칸에 중심·한 바퀴에 대응하는 기간·이름을 붙이세요.",
   "answer": "첫 칸에는 지구의 중심을 고정한 축 회전과 자전/하루를 표시한다. 둘째 칸에는 고정 태양 둘레에서 지구의 중심 위치를 옮기는 경로와 공전/일 년을 표시한다.",
   "explanation": "두 칸에 같은 원을 그려 이름만 바꾸면 중심 차이가 전달되지 않아요. 실제 거리·속도의 비율까지 같은 그림이라고 주장하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "축 중심 회전 표시",
    "태양 둘레 중심 이동 표시",
    "이름·기간의 올바른 대응"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "첫 칸에는 지구의 중심을 고정한 축 회전과 자전/하루를 표시한다. 둘째 칸에는 고정 태양 둘레에서 지구의 중심 위치를 옮기는 경로와 공전/일 년을 표시한다.",
    "required": [
     "축 중심 회전 표시",
     "태양 둘레 중심 이동 표시",
     "이름·기간의 올바른 대응"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "축 중심 회전 표시 / 태양 둘레 중심 이동 표시 / 이름·기간의 올바른 대응. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w080",
   "no": 80,
   "section": 5,
   "sectionTitle": "하루와 일 년을 구별하기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T13",
   "topic": "하루와 일 년을 구별하기",
   "prompt": "하루 비교와 계절 비교를 헷갈리지 않게 책갈피 두 장을 설계하세요. 각 장에 바꿀 조건·같게 할 조건·연결할 운동을 넣고, 설정 예시임을 밝혀 기록 예를 제시하세요.",
   "answer": "하루 책갈피는 같은 장소·날짜·방향에서 시각 변화/자전으로, 계절 책갈피는 같은 장소·시각·방향·확대율에서 날짜 변화/공전으로 구성한다. 실제 결과가 아닌 설정 예시라는 표시도 둔다.",
   "explanation": "시간 범위와 비교 조건을 한눈에 읽게 하는 자료 제작이에요. 날짜와 시각 중 무엇을 바꾸는지 빠지면 목적이 흐려져요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "하루 비교 조건/자전",
    "계절 비교 조건/공전",
    "설정 예시와 실제 결과 구별"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "하루 책갈피는 같은 장소·날짜·방향에서 시각 변화/자전으로, 계절 책갈피는 같은 장소·시각·방향·확대율에서 날짜 변화/공전으로 구성한다. 실제 결과가 아닌 설정 예시라는 표시도 둔다.",
    "required": [
     "하루 비교 조건/자전",
     "계절 비교 조건/공전",
     "설정 예시와 실제 결과 구별"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "하루 비교 조건/자전 / 계절 비교 조건/공전 / 설정 예시와 실제 결과 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w081",
   "no": 81,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "태양 모형의 오른쪽에 지구가 있습니다. 한밤 관측자의 정면이 향하는 바깥 방향을 고르세요.",
   "answer": "① 태양 반대쪽인 오른쪽 바깥",
   "explanation": "지구에서 보면 태양이 왼쪽이므로 한밤 정면은 반대인 오른쪽 바깥이에요. 지구 위치와 광원 방향을 먼저 읽어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "태양 반대쪽인 오른쪽 바깥",
    "태양을 향하는 왼쪽 안쪽",
    "광원 위치와 무관한 위쪽 고정 방향",
    "지구가 어느 위치에 있어도 같은 별 카드 방향",
    "반시계 이동 경로와 항상 나란한 방향"
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "verificationModel": {
    "kind": "midnight-vector",
    "earth": [
     1,
     0
    ],
    "expected": [
     1,
     0
    ]
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 태양 반대쪽인 오른쪽 바깥 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w082",
   "no": 82,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "먼 별 카드들을 고정하고 지구만 태양 둘레 반대쪽 위치로 옮겼습니다. 각 위치에서 한밤 시선을 맞추면 무엇이 달라질 수 있나요?",
   "answer": "② 한밤 관측자가 정면으로 바라보는 카드",
   "explanation": "별 배치를 바꾸지 않아도 지구 위치가 달라지면 밤에 보는 방향이 달라져요. 가까운 카드의 거리가 실제 별 거리와 같다는 뜻은 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "지구의 공전 한 바퀴에 대응시킨 기간",
    "한밤 관측자가 정면으로 바라보는 카드",
    "교실 바깥쪽에 고정해 둔 별 카드 위치",
    "지구의 축 중심 하루 자전 방향",
    "태양 모형을 고정해 둔 교실 중심 위치"
   ],
   "key": 1,
   "responseContract": {
    "kind": "single-choice",
    "answer": 1
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 한밤 관측자가 정면으로 바라보는 카드 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w083",
   "no": 83,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "태양과 별 카드를 고정한 공전 모형에 대한 설명을 고르세요. (2개 선택)",
   "answer": "②, ④",
   "explanation": "광원과 관측자 방향을 맞춘 뒤 각 위치의 정면을 비교해요. 별 카드 고정이라는 조건을 깨면 원인을 바르게 설명할 수 없어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "카드 한 장이 실제 밤하늘 전체를 정확히 대신한다.",
    "한밤 정면은 태양 반대쪽 바깥으로 정한다.",
    "지구를 옮길 때마다 별 카드도 같이 한 바퀴 돌린다.",
    "지구 위치가 바뀌면 한밤 정면의 카드가 달라질 수 있다.",
    "한밤에 정면인 카드는 언제나 태양과 같은 쪽에 있다."
   ],
   "key": [
    1,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ②, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w084",
   "no": 84,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T07",
   "topic": "한밤에 바라보는 방향",
   "prompt": "태양과 같은 방향의 별과 반대 방향의 밤하늘을 설명한 문장을 고르세요. (2개 선택)",
   "answer": "①, ④",
   "explanation": "가시성과 존재를 구별하고 한밤의 시선 조건을 유지해요. 대표 별자리의 계절 설명을 배타적인 존재 규칙으로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "한밤에는 관측자의 정면을 태양 반대쪽으로 맞춘다.",
    "한 계절에는 이름 붙인 별자리가 오직 하나만 보인다.",
    "대표 별자리는 다른 계절의 어떤 시각에도 볼 수 없다.",
    "낮에도 그 방향의 별은 존재할 수 있지만 태양빛 때문에 보기 어렵다.",
    "태양 방향에 있는 별은 그 계절에 우주에서 사라진다."
   ],
   "key": [
    0,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ①, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w085",
   "no": 85,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "지구 모형의 한밤 관측자 정면은 태양 ㉠[ ]쪽을 향하고, 태양 둘레 지구 위치가 달라지는 운동은 ㉡[ ]입니다.",
   "answer": "㉠ 반대 / ㉡ 공전",
   "explanation": "빛을 받지 않는 한밤 표시는 태양 반대쪽으로 향해요. 이 단원에서 계절별 밤하늘 차이는 공전과 연결해 설명해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "반대",
      "반대쪽"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "공전",
      "지구의 공전",
      "지구 공전"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "반대",
       "반대쪽"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "공전",
       "지구의 공전",
       "지구 공전"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 반대 / ㉡: 공전. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w086",
   "no": 86,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T07",
   "topic": "한밤에 바라보는 방향",
   "prompt": "태양과 같은 방향의 별을 낮에 관찰하기 어려운 것은 별이 사라져서가 아니라 밝은 ㉠[ ] 때문입니다.",
   "answer": "㉠ 태양빛",
   "explanation": "낮에도 별은 존재할 수 있어요. 한 관측 조건에서 보기 어렵다는 것과 천체가 없다는 주장은 달라요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "태양빛",
      "햇빛",
      "태양 빛",
      "해의 빛"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "태양빛",
       "햇빛",
       "태양 빛",
       "해의 빛"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 태양빛. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w087",
   "no": 87,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "태양은 중앙이고 별 카드는 표와 같이 고정했습니다. 각 지구 위치의 한밤 정면 카드를 연결하세요.",
   "answer": "(1) ㄷ / (2) ㄴ / (3) ㄱ",
   "explanation": "각 위치에서 태양은 중앙 쪽이므로 한밤 정면은 바깥쪽이에요. 위쪽 지구→위쪽B, 왼쪽→왼쪽A, 아래쪽→아래쪽C로 대응해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 지구가 태양 위쪽",
    "(2) 지구가 태양 왼쪽",
    "(3) 지구가 태양 아래쪽"
   ],
   "options": [
    "ㄱ. 카드C",
    "ㄴ. 카드A",
    "ㄷ. 카드B"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄷ",
     "ㄴ",
     "ㄱ"
    ]
   },
   "table": {
    "머리": [
     "별 카드",
     "중앙 태양에 대한 위치"
    ],
    "행": [
     [
      "A",
      "왼쪽 바깥"
     ],
     [
      "B",
      "위쪽 바깥"
     ],
     [
      "C",
      "아래쪽 바깥"
     ]
    ]
   },
   "verificationModel": {
    "kind": "midnight-label-parts",
    "earths": [
     [
      0,
      1
     ],
     [
      -1,
      0
     ],
     [
      0,
      -1
     ]
    ],
    "cards": {
     "A": [
      -1,
      0
     ],
     "B": [
      0,
      1
     ],
     "C": [
      0,
      -1
     ]
    },
    "expected": [
     "B",
     "A",
     "C"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄷ / (2) ㄴ / (3) ㄱ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 카드C",
    "ㄴ. 카드A",
    "ㄷ. 카드B"
   ],
   "figure": "earth-question-data-87"
  },
  {
   "id": "c22-s61-u04-w088",
   "no": 88,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "발문의 뜻과 읽어야 할 모형 방향을 연결하세요.",
   "answer": "(1) ㄴ / (2) ㄱ / (3) ㄷ",
   "explanation": "“볼 방향”과“보기 어려운 태양 쪽”을 묻는 문장은 다른 대상을 가리켜요. 같은 보기 기호라도 발문의 뜻을 먼저 읽어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) “한밤 관측자의 정면에 놓인 카드”",
    "(2) “지구에서 태양을 바라보는 방향의 카드”",
    "(3) “계절 비교에서 움직이지 않게 둔 먼 별 자료”"
   ],
   "options": [
    "ㄱ. 태양 쪽 방향",
    "ㄴ. 태양 반대쪽 방향",
    "ㄷ. 교실 바깥쪽 고정 별 카드"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄴ / (2) ㄱ / (3) ㄷ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 태양 쪽 방향",
    "ㄴ. 태양 반대쪽 방향",
    "ㄷ. 교실 바깥쪽 고정 별 카드"
   ]
  },
  {
   "id": "c22-s61-u04-w089",
   "no": 89,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T06",
   "topic": "한밤에 바라보는 방향",
   "prompt": "공전면 북쪽 위 관점에서 지구는 태양 위쪽에서 출발해 반시계 방향으로 공전합니다. 지구 위치를 순서대로 쓰세요.",
   "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
   "explanation": "위쪽 출발의 반시계 이동은 왼쪽→아래쪽→오른쪽이에요. 지구의 공전 위치 순서이지 지표에서 본 별무리 이동 화살표가 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 아래쪽",
    "ㄴ. 위쪽(출발)",
    "ㄷ. 왼쪽",
    "ㄹ. 오른쪽"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄷ",
     "ㄱ",
     "ㄹ"
    ]
   },
   "verificationModel": {
    "kind": "orbit-order",
    "points": {
     "ㄱ": [
      0,
      -1
     ],
     "ㄴ": [
      0,
      1
     ],
     "ㄷ": [
      -1,
      0
     ],
     "ㄹ": [
      1,
      0
     ]
    },
    "start": "ㄴ",
    "direction": "counterclockwise",
    "expected": [
     "ㄴ",
     "ㄷ",
     "ㄱ",
     "ㄹ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄷ → ㄱ → ㄹ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 아래쪽",
    "ㄴ. 위쪽(출발)",
    "ㄷ. 왼쪽",
    "ㄹ. 오른쪽"
   ]
  },
  {
   "id": "c22-s61-u04-w090",
   "no": 90,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T10",
   "topic": "한밤에 바라보는 방향",
   "prompt": "두 공전 위치의 한밤 정면을 비교합니다. 정해진 방법의 순서를 쓰세요.",
   "answer": "ㄷ → ㄴ → ㄹ → ㄱ",
   "explanation": "각 위치에서 같은 한밤 조건을 먼저 맞춘 기록이 있어야 정면 카드를 비교할 수 있어요. 지구만 옮기고 표시 방향을 그대로 두면 낮밤 조건이 달라질 수 있어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 두 위치의 정면 카드를 대조해 이유를 설명함",
    "ㄴ. 첫 위치에서 표시를 태양 반대쪽으로 맞춰 카드를 남김",
    "ㄷ. 태양과 별 카드를 고정하고 첫 지구 위치를 정함",
    "ㄹ. 둘째 위치로 지구를 옮긴 뒤 다시 한밤 시선을 맞춰 남김"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄴ",
     "ㄹ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄷ → ㄴ → ㄹ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 두 위치의 정면 카드를 대조해 이유를 설명함",
    "ㄴ. 첫 위치에서 표시를 태양 반대쪽으로 맞춰 카드를 남김",
    "ㄷ. 태양과 별 카드를 고정하고 첫 지구 위치를 정함",
    "ㄹ. 둘째 위치로 지구를 옮긴 뒤 다시 한밤 시선을 맞춰 남김"
   ]
  },
  {
   "id": "c22-s61-u04-w091",
   "no": 91,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "표의 두 위치에서 한밤 정면 카드를 고르고, 태양 방향을 먼저 읽어야 하는 이유를 쓰세요.",
   "answer": "지구가 왼쪽일 때는 왼쪽 바깥 카드P, 오른쪽일 때는 오른쪽 바깥 카드Q가 정면이다. 각 위치에서 태양은 중앙 쪽이고 한밤 정면은 반대이므로 지구 위치와 광원 방향을 함께 읽는다.",
   "explanation": "태양 쪽 카드와 한밤 정면 카드를 바꾸는 오류를 점검해요. 실제 한 계절의 하늘이 한 카드라는 뜻은 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "왼쪽 P / 오른쪽 Q 대응",
    "각 위치의 태양 방향",
    "한밤 정면은 반대쪽"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "지구가 왼쪽일 때는 왼쪽 바깥 카드P, 오른쪽일 때는 오른쪽 바깥 카드Q가 정면이다. 각 위치에서 태양은 중앙 쪽이고 한밤 정면은 반대이므로 지구 위치와 광원 방향을 함께 읽는다.",
    "required": [
     "왼쪽 P / 오른쪽 Q 대응",
     "각 위치의 태양 방향",
     "한밤 정면은 반대쪽"
    ]
   },
   "table": {
    "머리": [
     "배치 요소",
     "태양에 대한 위치"
    ],
    "행": [
     [
      "별 카드P",
      "왼쪽 바깥"
     ],
     [
      "별 카드Q",
      "오른쪽 바깥"
     ],
     [
      "지구 위치 1",
      "태양 왼쪽"
     ],
     [
      "지구 위치 2",
      "태양 오른쪽"
     ]
    ]
   },
   "verificationModel": {
    "kind": "midnight-two-records",
    "earths": [
     [
      -1,
      0
     ],
     [
      1,
      0
     ]
    ],
    "expected": [
     "P",
     "Q"
    ],
    "cards": {
     "P": [
      -1,
      0
     ],
     "Q": [
      1,
      0
     ]
    }
   },
   "formLabel": "자료 해석",
   "criteria": "왼쪽 P / 오른쪽 Q 대응 / 각 위치의 태양 방향 / 한밤 정면은 반대쪽. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-91"
  },
  {
   "id": "c22-s61-u04-w092",
   "no": 92,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T10",
   "topic": "한밤에 바라보는 방향",
   "prompt": "모형 비교 뒤 두 모둠의 설명을 읽었습니다. 실제 조작과 맞는 설명을 고르고, 다른 설명에서 바뀐 것을 잘못 짚은 부분을 고치세요.",
   "answer": "나가 맞다. 별 카드는 고정했고 지구의 태양 둘레 위치를 바꾸었다. 가의 “별 카드를 돌렸다”는 설명을 지구 위치 변화와 밤에 보는 방향 차이로 고친다.",
   "explanation": "변화의 원인은 실제로 달리한 조건에 근거해야 해요. 카드의 이동을 관찰하지 않았는데 원인으로 새로 넣지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "나 선택",
    "고정 별 카드와 지구 위치 변화",
    "가의 잘못된 조작 설명 수정"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "나가 맞다. 별 카드는 고정했고 지구의 태양 둘레 위치를 바꾸었다. 가의 “별 카드를 돌렸다”는 설명을 지구 위치 변화와 밤에 보는 방향 차이로 고친다.",
    "required": [
     "나 선택",
     "고정 별 카드와 지구 위치 변화",
     "가의 잘못된 조작 설명 수정"
    ]
   },
   "givens": {
    "실제조작": "태양·먼 별 카드 고정, 지구만 태양 둘레 다른 위치로 옮기고 각 위치에서 한밤 시선을 맞춤"
   },
   "table": {
    "머리": [
     "모둠",
     "설명"
    ],
    "행": [
     [
      "가",
      "별 카드 자체를 돌려 다른 계절의 하늘을 만들었다."
     ],
     [
      "나",
      "지구 위치가 달라져 한밤에 보는 방향이 바뀌었다."
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "나 선택 / 고정 별 카드와 지구 위치 변화 / 가의 잘못된 조작 설명 수정. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "given": [
    "실제조작: 태양·먼 별 카드 고정, 지구만 태양 둘레 다른 위치로 옮기고 각 위치에서 한밤 시선을 맞춤"
   ],
   "figure": "earth-question-data-92"
  },
  {
   "id": "c22-s61-u04-w093",
   "no": 93,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T07",
   "topic": "한밤에 바라보는 방향",
   "prompt": "“대표 별자리가 겨울 별자리라면 다른 계절에는 절대로 볼 수 없다”는 말을 관측 조건과 공전의 관계로 고치세요.",
   "answer": "대표 별자리는 그 계절의 일정한 밤 시각에 찾기 좋다는 설명이지 다른 계절 모든 시각에 금지된다는 뜻이 아니다. 장소·날짜·시각·방향에 따라 가시 범위가 달라지므로 조건을 밝혀 프로그램이나 관찰로 확인한다.",
   "explanation": "계절별 밤하늘 차이를 배우되 대표 이름을 배타적인 가시성 규칙으로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "대표 계절과 배타성 구별",
    "장소·날짜·시각·방향 조건",
    "조건 맞춘 확인 방법"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "대표 별자리는 그 계절의 일정한 밤 시각에 찾기 좋다는 설명이지 다른 계절 모든 시각에 금지된다는 뜻이 아니다. 장소·날짜·시각·방향에 따라 가시 범위가 달라지므로 조건을 밝혀 프로그램이나 관찰로 확인한다.",
    "required": [
     "대표 계절과 배타성 구별",
     "장소·날짜·시각·방향 조건",
     "조건 맞춘 확인 방법"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "대표 계절과 배타성 구별 / 장소·날짜·시각·방향 조건 / 조건 맞춘 확인 방법. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w094",
   "no": 94,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T05",
   "topic": "한밤에 바라보는 방향",
   "prompt": "한밤 정면을 묻는 문항에서 태양 쪽 카드를 골랐습니다. 틀린 이유를 광원·관측자·밤의 관계로 설명하세요.",
   "answer": "밤의 관측자 표시는 빛을 직접 받지 않는 태양 반대쪽을 향한다. 태양 쪽 카드는 그 반대 방향이므로 한밤 정면 카드와 다르다. 지구에서 태양이 어느 쪽인지부터 확인해 바깥 방향 카드를 골라야 한다.",
   "explanation": "기호를 외워 고치는 대신 발문이 요구한 가시 방향과 광원 관계를 다시 구성해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "한밤 표시의 태양 반대 방향",
    "태양 쪽/정면 카드 구별",
    "지구 위치에서 광원 방향 먼저 읽기"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "밤의 관측자 표시는 빛을 직접 받지 않는 태양 반대쪽을 향한다. 태양 쪽 카드는 그 반대 방향이므로 한밤 정면 카드와 다르다. 지구에서 태양이 어느 쪽인지부터 확인해 바깥 방향 카드를 골라야 한다.",
    "required": [
     "한밤 표시의 태양 반대 방향",
     "태양 쪽/정면 카드 구별",
     "지구 위치에서 광원 방향 먼저 읽기"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "한밤 표시의 태양 반대 방향 / 태양 쪽/정면 카드 구별 / 지구 위치에서 광원 방향 먼저 읽기. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w095",
   "no": 95,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T10",
   "topic": "한밤에 바라보는 방향",
   "prompt": "태양 중앙·지구의 서로 다른 두 위치·고정 별 카드를 배치해 한밤 시선이 달라지는 모형을 설계하세요. 관측자의 시선과 태양 쪽을 둘 다 표시하세요.",
   "answer": "별 카드의 자리는 같게 두고 지구를 태양 둘레 두 곳에 놓는다. 각 위치에서 태양 방향과 정반대인 한밤 정면을 표시해 두 카드가 달라질 수 있음을 나타낸다. 실제 거리·하늘 전체를 재현한 모형은 아니라고 쓴다.",
   "explanation": "지구를 옮길 때 카드까지 함께 돌리거나 한밤 조건을 바꾸면 공전 위치의 효과를 설명하기 어려워요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "태양/별 카드 고정",
    "서로 다른 지구 위치",
    "태양/한밤 반대 시선",
    "거리/하늘 범위 한계"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "별 카드의 자리는 같게 두고 지구를 태양 둘레 두 곳에 놓는다. 각 위치에서 태양 방향과 정반대인 한밤 정면을 표시해 두 카드가 달라질 수 있음을 나타낸다. 실제 거리·하늘 전체를 재현한 모형은 아니라고 쓴다.",
    "required": [
     "태양/별 카드 고정",
     "서로 다른 지구 위치",
     "태양/한밤 반대 시선",
     "거리/하늘 범위 한계"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "태양/별 카드 고정 / 서로 다른 지구 위치 / 태양/한밤 반대 시선 / 거리/하늘 범위 한계. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w096",
   "no": 96,
   "section": 6,
   "sectionTitle": "한밤에 바라보는 방향",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T13",
   "topic": "한밤에 바라보는 방향",
   "prompt": "“한밤 정면으로 보는 카드”와 “태양 쪽이라 낮에 보기 어려운 방향”을 헷갈리지 않게 하는 문항 그림을 설계하세요. 정답 기호를 미리 강조하지 말고 발문에 필요한 조건을 넣으세요.",
   "answer": "지구와 태양의 위치·한밤 관측자 표시를 넣고 태양 쪽과 반대쪽 카드를 같은 스타일로 둔다. 지구 위치에서 광원 방향을 읽어 비교하게 하고 “정면”인지 “보기 어려운 방향”인지 발문을 분명히 쓴다.",
   "explanation": "답을 찾는 조건은 있어야 하지만 특정 카드에만 정답색이나 굵은 표시를 넣어 답을 누설하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "지구/태양/관측자 조건",
    "양쪽 카드의 동등한 표시",
    "발문 방향의 명확성",
    "정답 강조 배제"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "지구와 태양의 위치·한밤 관측자 표시를 넣고 태양 쪽과 반대쪽 카드를 같은 스타일로 둔다. 지구 위치에서 광원 방향을 읽어 비교하게 하고 “정면”인지 “보기 어려운 방향”인지 발문을 분명히 쓴다.",
    "required": [
     "지구/태양/관측자 조건",
     "양쪽 카드의 동등한 표시",
     "발문 방향의 명확성",
     "정답 강조 배제"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "지구/태양/관측자 조건 / 양쪽 카드의 동등한 표시 / 발문 방향의 명확성 / 정답 강조 배제. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w097",
   "no": 97,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "계절에 따른 별무리 차이를 보려고 두 프로그램 화면을 열었습니다. 바꿀 조건과 맞출 조건이 적절한 것을 고르세요.",
   "answer": "③ 날짜를 바꾸고 장소·시각·방향·확대율을 맞춘다.",
   "explanation": "계절 비교에서는 날짜를 달리하고 장소·하루 중 시각·방향·확대율은 맞춰요. 시각을 바꾸고 날짜를 맞추는 보기는 같은 날의 하루 비교에 해당해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "시각과 방향을 모두 바꾸고 별 이름만 맞춘다.",
    "처음 화면의 조건을 지우고 두 번째 화면만 저장한다.",
    "날짜를 바꾸고 장소·시각·방향·확대율을 맞춘다.",
    "시각을 바꾸고 날짜·장소·방향·확대율을 맞춘다.",
    "날짜와 장소를 모두 바꾸고 확대율만 맞춘다."
   ],
   "key": 2,
   "responseContract": {
    "kind": "single-choice",
    "answer": 2
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 날짜를 바꾸고 장소·시각·방향·확대율을 맞춘다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w098",
   "no": 98,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "서울·남쪽·밤 9시로 설정한 두 계절 화면에서 별무리 위치가 다릅니다. 다음으로 할 설명으로 가장 적절한 것은 무엇인가요?",
   "answer": "④ 맞춘 조건과 달라진 위치를 밝히고 공전과 연결한다.",
   "explanation": "설명은 비교 조건→위치 차이→지구 공전의 관계로 이어져야 해요. 프로그램 계산 화면을 실측이나 배타적인 계절 규칙으로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "화면의 배경이 학교 운동장을 실제로 촬영한 사진이라고 한다.",
    "같은 별자리는 다른 계절의 어떤 시각에도 없다고 한다.",
    "두 화면을 열었으므로 네 계절 야외 관측을 모두 마쳤다고 한다.",
    "맞춘 조건과 달라진 위치를 밝히고 공전과 연결한다.",
    "별 이름표의 개수만 세어 공전 속도를 계산했다고 한다."
   ],
   "key": 3,
   "responseContract": {
    "kind": "single-choice",
    "answer": 3
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 맞춘 조건과 달라진 위치를 밝히고 공전과 연결한다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w099",
   "no": 99,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "같은 밤 한 시간의 변화와 계절별 차이를 나누어 비교한 방법을 고르세요. (2개 선택)",
   "answer": "①, ③",
   "explanation": "무엇을 바꾸는지에 따라 하루와 계절 비교가 달라져요. 같은 대상을 찾는 방법과 표시 조건도 맞춰야 위치 차이를 해석하기 쉬워요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "같은 날짜에서 21시와 22시를 비교해 하루 변화를 살핀다.",
    "계절별 화면은 시각·방향·확대율을 모두 다르게 한다.",
    "같은 장소·21시·남쪽에서 날짜를 달리해 계절 차이를 살핀다.",
    "이름표를 한쪽만 켜면 같은 별무리의 위치가 자동으로 같아진다.",
    "같은 별자리인지 확인하지 않고 밝은 점 개수만 비교한다."
   ],
   "key": [
    0,
    2
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     0,
     2
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ①, ③. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w100",
   "no": 100,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "프로그램을 비교 자료로 사용할 때 적절한 확인을 고르세요. (2개 선택)",
   "answer": "③, ⑤",
   "explanation": "설정 링크만 믿기보다 화면에서 장소·방향·시각을 확인해요. 시간 진행이나 확대율 차이가 위치 비교에 섞이지 않게 해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "배경 풍경이 서울의 특정 학교라는 증거로 사용한다.",
    "다른 두 확대율에서 보이는 별 개수가 다르면 계절 때문이라고 정한다.",
    "아래 S와 장소 설정으로 남쪽·관측 지점을 확인한다.",
    "설정 링크를 열면 시간이 절대로 흐르지 않는다고 가정한다.",
    "시계를 멈추고 실제 표시 시각을 확인한다."
   ],
   "key": [
    2,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     2,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ③, ⑤. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w101",
   "no": 101,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "서울·밤 9시·남쪽·같은 확대율로 3월과 9월을 비교할 때 달리한 조건은 ㉠[ ]이고, 연결할 지구 운동은 ㉡[ ]입니다.",
   "answer": "㉠ 날짜 / ㉡ 공전",
   "explanation": "장소와 시각은 맞췄고 날짜가 달라졌어요. 하루 자전으로 인한 시각 차이와 구별해 계절별 밤에 보는 방향을 공전과 연결해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "날짜",
      "관찰 날짜"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "공전",
      "지구의 공전",
      "지구 공전"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "날짜",
       "관찰 날짜"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "공전",
       "지구의 공전",
       "지구 공전"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 날짜 / ㉡: 공전. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w102",
   "no": 102,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "같은 날짜의 21시와 22시를 비교할 때는 ㉠[ ]을 바꾼 하루 비교이며, 계절별 같은 21시 비교에서는 관찰 ㉡[ ]를 바꿉니다.",
   "answer": "㉠ 시각 / ㉡ 날짜",
   "explanation": "하루 중 시각과 달력 날짜가 비교에서 맡는 역할을 구별해요. 두 변화를 한꺼번에 섞지 않아야 원인 설명이 분명해져요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "시각",
      "시간"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "날짜"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "시각",
       "시간"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "날짜"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 시각 / ㉡: 날짜. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w103",
   "no": 103,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T12",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "설정이나 표시를 확인하는 목적과 연결하세요.",
   "answer": "(1) ㄱ / (2) ㄴ / (3) ㄷ",
   "explanation": "장소·방위·대상 찾기 안내는 서로 다른 역할이에요. 별자리 선은 실제로 별을 잇는 줄을 관찰한 것이 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 장소가 서울인지 확인함",
    "(2) 화면 아래 S를 확인함",
    "(3) 별자리 이름·선을 두 화면 모두 같은 상태로 켬"
   ],
   "options": [
    "ㄱ. 관측 지점 조건 확인",
    "ㄴ. 바라보는 남쪽 기준 확인",
    "ㄷ. 같은 별무리를 대응해 찾는 안내 맞춤"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄱ",
     "ㄴ",
     "ㄷ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄱ / (2) ㄴ / (3) ㄷ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 관측 지점 조건 확인",
    "ㄴ. 바라보는 남쪽 기준 확인",
    "ㄷ. 같은 별무리를 대응해 찾는 안내 맞춤"
   ]
  },
  {
   "id": "c22-s61-u04-w104",
   "no": 104,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "잘못된 비교와 우선 보완할 조건을 연결하세요.",
   "answer": "(1) ㄴ / (2) ㄷ / (3) ㄱ",
   "explanation": "각 기록에서 실제로 다른 조건을 읽어 보완해요. 별자리 이름을 먼저 바꾸는 것으로 설정 차이가 해결되지는 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 서울의 봄 화면과 다른 도시의 가을 화면을 비교함",
    "(2) 같은 도시지만 21시와새벽 2시의 계절 화면을 비교함",
    "(3) 두 화면을 서로 다른 방향으로 끌어 둠"
   ],
   "options": [
    "ㄱ. 같은 관측 방향 맞추기",
    "ㄴ. 같은 장소 맞추기",
    "ㄷ. 같은 시각 맞추기"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄴ",
     "ㄷ",
     "ㄱ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄴ / (2) ㄷ / (3) ㄱ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 같은 관측 방향 맞추기",
    "ㄴ. 같은 장소 맞추기",
    "ㄷ. 같은 시각 맞추기"
   ]
  },
  {
   "id": "c22-s61-u04-w105",
   "no": 105,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "같은 장소·남쪽·21시의 프로그램 파일을 3월부터 시작해 달력 순서로 정리하세요.",
   "answer": "ㄷ → ㄴ → ㄹ → ㄱ",
   "explanation": "시각과 장소는 맞췄으므로 달력 날짜를 읽어 정리해요. 계절 순환의 시작점이 명시되어 있어 순서가 하나로 정해져요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 12월 21일",
    "ㄴ. 6월 21일",
    "ㄷ. 3월 21일",
    "ㄹ. 9월 21일"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄴ",
     "ㄹ",
     "ㄱ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄷ → ㄴ → ㄹ → ㄱ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 12월 21일",
    "ㄴ. 6월 21일",
    "ㄷ. 3월 21일",
    "ㄹ. 9월 21일"
   ]
  },
  {
   "id": "c22-s61-u04-w106",
   "no": 106,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "교사가 정한 계절 비교 절차입니다. 기록에 앞서 시각을 멈추기로 했습니다. 순서를 쓰세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "처음 설정→정지와 첫 기록→다른 날짜의 같은 조건 기록→비교 설명으로 이어져요. 정지 상태가 확인되었다고 모든 화면이 같은 시각이라는 뜻은 아니므로 각각 확인해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 날짜만 달리한 다른 계절 화면도 같은 조건으로 기록함",
    "ㄴ. 장소·남쪽·확대율과 첫 날짜·시각을 정함",
    "ㄷ. 두 기록의 위치 차이와 공전 관계를 설명함",
    "ㄹ. 시간을 정지하고 첫 화면의 실제 표시 시각·위치를 남김"
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄹ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄹ → ㄱ → ㄷ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 날짜만 달리한 다른 계절 화면도 같은 조건으로 기록함",
    "ㄴ. 장소·남쪽·확대율과 첫 날짜·시각을 정함",
    "ㄷ. 두 기록의 위치 차이와 공전 관계를 설명함",
    "ㄹ. 시간을 정지하고 첫 화면의 실제 표시 시각·위치를 남김"
   ]
  },
  {
   "id": "c22-s61-u04-w107",
   "no": 107,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "다음은 실제 수업에서 열도록 확인한 설정 목록입니다. 계절 비교에 함께 쓸 행을 고르고, 하루 시각 비교에 쓸 다른 조합과 구별해 설명하세요.",
   "answer": "A와 C는 서울·남쪽·21시·같은 확대율이고 날짜가 달라 계절 비교이다. A와 B는 같은 3월 21일의 21시와 22시라 하루 시각 비교이다. 이 표는 설정 목록이며 실제 학생 관측 결과표는 아니다.",
   "explanation": "설정 조건을 읽는 문제예요. 어떤 별이 어느 위치에 보였는지는 실제 프로그램을 열어 따로 관찰해야 해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "verified-planetarium-configuration-not-observation-output"
   },
   "requirements": [
    "A/C 계절 비교",
    "A/B 하루 비교",
    "설정과 관찰 결과 구별"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "A와 C는 서울·남쪽·21시·같은 확대율이고 날짜가 달라 계절 비교이다. A와 B는 같은 3월 21일의 21시와 22시라 하루 시각 비교이다. 이 표는 설정 목록이며 실제 학생 관측 결과표는 아니다.",
    "required": [
     "A/C 계절 비교",
     "A/B 하루 비교",
     "설정과 관찰 결과 구별"
    ]
   },
   "table": {
    "머리": [
     "행",
     "서울·남쪽·같은 확대율의 날짜",
     "한국 시각"
    ],
    "행": [
     [
      "A",
      "2026-03-21",
      "21:00"
     ],
     [
      "B",
      "2026-03-21",
      "22:00"
     ],
     [
      "C",
      "2026-09-21",
      "21:00"
     ]
    ]
   },
   "programViews": [
    "spring-21",
    "spring-22",
    "autumn-21"
   ],
   "dataKind": "verified-planetarium-configuration-not-observation-output",
   "formLabel": "자료 해석",
   "criteria": "A/C 계절 비교 / A/B 하루 비교 / 설정과 관찰 결과 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-107"
  },
  {
   "id": "c22-s61-u04-w108",
   "no": 108,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "두 화면을 모두밤 9시로 비교하려 했습니다. 기록을 읽고 잘못 맞춘 조건과 고칠 방법을 쓰세요.",
   "answer": "B의 실제 표시 시각이 22:00이므로 두 화면의 시각이 맞지 않았다. 날짜는 달리하되 두 화면 모두 21시로 다시 맞추고 정지·표시 시각을 확인해 기록한다. 지금 차이를 계절만의 영향이라고 하지 않는다.",
   "explanation": "링크를 열었다는 사실보다 실제 표시된 조건이 비교의 근거예요. 시각 차이가 섞였으면 결과를 원하는 설명에 맞추지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "B의 22시를 자료에서 찾음",
    "양쪽 21시와 정지/표시 확인",
    "현재 차이의 원인 단정 보류"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "B의 실제 표시 시각이 22:00이므로 두 화면의 시각이 맞지 않았다. 날짜는 달리하되 두 화면 모두 21시로 다시 맞추고 정지·표시 시각을 확인해 기록한다. 지금 차이를 계절만의 영향이라고 하지 않는다.",
    "required": [
     "B의 22시를 자료에서 찾음",
     "양쪽 21시와 정지/표시 확인",
     "현재 차이의 원인 단정 보류"
    ]
   },
   "table": {
    "머리": [
     "화면",
     "날짜",
     "실제 표시 시각",
     "방향"
    ],
    "행": [
     [
      "A",
      "3월 21일",
      "21:00",
      "남쪽"
     ],
     [
      "B",
      "9월 21일",
      "22:00",
      "남쪽"
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "B의 22시를 자료에서 찾음 / 양쪽 21시와 정지/표시 확인 / 현재 차이의 원인 단정 보류. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-108"
  },
  {
   "id": "c22-s61-u04-w109",
   "no": 109,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "계절별 두 화면에서 같은 별자리도 발견했습니다. 이 관찰이 “계절에 따라 밤하늘의 별자리가 달라진다”는 설명과 반드시 모순되지 않는 이유를 쓰세요.",
   "answer": "계절별로 찾기 좋은 별무리와 위치는 달라질 수 있지만 모든 별자리가 계절마다 완전히 교체되는 것은 아니다. 같은 별자리가 겹쳐 보일 수 있고 관측 시각·장소·방향에 따라 범위도 달라진다. 비교한 조건과 실제 위치 차이를 함께 설명한다.",
   "explanation": "대표 별자리 목록을 서로 겹칠 수 없는 집합처럼 해석하는 오류를 피해야 해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "일부 겹침 가능",
    "관측 조건/위치 차이",
    "계절 차이와 완전 교체 구별"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "계절별로 찾기 좋은 별무리와 위치는 달라질 수 있지만 모든 별자리가 계절마다 완전히 교체되는 것은 아니다. 같은 별자리가 겹쳐 보일 수 있고 관측 시각·장소·방향에 따라 범위도 달라진다. 비교한 조건과 실제 위치 차이를 함께 설명한다.",
    "required": [
     "일부 겹침 가능",
     "관측 조건/위치 차이",
     "계절 차이와 완전 교체 구별"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "일부 겹침 가능 / 관측 조건/위치 차이 / 계절 차이와 완전 교체 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w110",
   "no": 110,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T12",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "여름 화면에는 달이 밝고 겨울 화면에는 배경이 더 어둡습니다. “별 점이 더 적으니 지구가 공전을 멈췄다”는 결론이 부적절한 까닭을 쓰세요.",
   "answer": "밝은 달·대기 표시·확대율 등은 화면에서 확인하기 쉬운 별의 수에 영향을 줄 수 있다. 점 개수 하나만으로 지구 공전의 중단을 판단할 수 없다. 같은 조건에서 별무리의 배열·위치와 날짜를 비교해 공전과 밤의 시선 관계를 설명한다.",
   "explanation": "달 위상을 이 단원의 평가로 넓히지 않고 관찰 조건이 결론에 미치는 영향을 점검하는 문제예요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "화면 가시성의 다른 조건",
    "점 개수로 공전 중단 단정 금지",
    "조건 맞춘 별무리 위치 비교"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "밝은 달·대기 표시·확대율 등은 화면에서 확인하기 쉬운 별의 수에 영향을 줄 수 있다. 점 개수 하나만으로 지구 공전의 중단을 판단할 수 없다. 같은 조건에서 별무리의 배열·위치와 날짜를 비교해 공전과 밤의 시선 관계를 설명한다.",
    "required": [
     "화면 가시성의 다른 조건",
     "점 개수로 공전 중단 단정 금지",
     "조건 맞춘 별무리 위치 비교"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "화면 가시성의 다른 조건 / 점 개수로 공전 중단 단정 금지 / 조건 맞춘 별무리 위치 비교. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w111",
   "no": 111,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T12",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "계절 비교를 하는 친구가 실제로 누를 수 있도록 설정 안내 카드를 설계하세요. 장소·시각·날짜·방향·확대율과 시계 정지 확인을 넣으세요.",
   "answer": "서울·21시·남쪽·같은 확대율이라는 고정 조건을 묶고 날짜를 3/6/9/12월로 바꾸는 칸을 둔다. 시간을 멈춘 뒤 실제 표시 시각을 확인하도록 하고 별자리 표시도 양쪽에서 맞추게 한다.",
   "explanation": "설정 안내는 보기 좋은 화면을 만드는 장식이 아니라 비교 조건을 맞추는 도구예요. 설정을 적었다는 사실을 실제 관찰 완료로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "고정 조건 네 가지",
    "바꿀 날짜",
    "정지/실제 시각·표시 상태 확인"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "서울·21시·남쪽·같은 확대율이라는 고정 조건을 묶고 날짜를 3/6/9/12월로 바꾸는 칸을 둔다. 시간을 멈춘 뒤 실제 표시 시각을 확인하도록 하고 별자리 표시도 양쪽에서 맞추게 한다.",
    "required": [
     "고정 조건 네 가지",
     "바꿀 날짜",
     "정지/실제 시각·표시 상태 확인"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "고정 조건 네 가지 / 바꿀 날짜 / 정지/실제 시각·표시 상태 확인. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w112",
   "no": 112,
   "section": 7,
   "sectionTitle": "조건을 맞춘 별자리 비교",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T07",
   "topic": "조건을 맞춘 별자리 비교",
   "prompt": "같은 밤 비교와 계절 비교를 각각 한 줄에 놓은 비교판을 설계하세요. 각 줄에서 바꾼 조건과 고정 조건, 실제 관찰할 위치를 표시하세요.",
   "answer": "첫 줄은 3월 21일21시/22시로 시각을 바꾸고, 둘째 줄은 3월/9월 21시로 날짜를 바꾼다. 서울·남쪽·확대율을 맞추고 같은 별무리의 위치를 S에 대해 남길 칸을 둔다. 결과는 실제 화면을 읽은 뒤 채운다.",
   "explanation": "두 줄은 다른 원인을 비교하는 설계예요. 두 줄 모두 날짜와 시각을 한꺼번에 바꾸는 그림은 목적과 맞지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "하루 줄의 같은 날/다른 시각",
    "계절 줄의 다른 날짜/같은 시각",
    "고정 기준과 실제 위치 기록칸"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "첫 줄은 3월 21일21시/22시로 시각을 바꾸고, 둘째 줄은 3월/9월 21시로 날짜를 바꾼다. 서울·남쪽·확대율을 맞추고 같은 별무리의 위치를 S에 대해 남길 칸을 둔다. 결과는 실제 화면을 읽은 뒤 채운다.",
    "required": [
     "하루 줄의 같은 날/다른 시각",
     "계절 줄의 다른 날짜/같은 시각",
     "고정 기준과 실제 위치 기록칸"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "하루 줄의 같은 날/다른 시각 / 계절 줄의 다른 날짜/같은 시각 / 고정 기준과 실제 위치 기록칸. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w113",
   "no": 113,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T01",
   "topic": "근거로 설명하고 고치기",
   "prompt": "관찰과 원인 설명이 알맞게 이어진 것을 고르세요.",
   "answer": "⑤ 같은 날 남쪽 태양의 위치 변화 → 지구 자전과 연결",
   "explanation": "자료의 시간 범위와 현상을 읽고 원인을 연결해요. 하루 변화·계절 차이·같은 순간 지역 차이는 서로 다른 조건을 포함해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-02",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "같은 날 남쪽 태양의 위치 변화 → 공전 주기를 하루로 확정",
    "계절별 같은 시각 별무리 차이 → 자전 방향이 반대로 바뀜",
    "광원을 향한 면과 반대 면의 차이 → 달이 매일 빛을 가림",
    "같은 별무리의 한 시간 위치 차이 → 별자리 모양이 매번 재생성됨",
    "같은 날 남쪽 태양의 위치 변화 → 지구 자전과 연결"
   ],
   "key": 4,
   "responseContract": {
    "kind": "single-choice",
    "answer": 4
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 같은 날 남쪽 태양의 위치 변화 → 지구 자전과 연결 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w114",
   "no": 114,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "single",
   "form": "choice",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "친구의 설명 카드에 “지구가 돌아서 다르다”만 적혀 있습니다. 근거를 가장 잘 보완한 문장을 고르세요.",
   "answer": "① 같은 장소·시각의 두 계절 별무리 차이를 태양 둘레 공전과 연결한다.",
   "explanation": "어떤 비교에서 무엇이 달랐는지와 어떤 지구 운동을 말하는지 구체적으로 이어야 해요. “돈다”라는 낱말만으로 설명을 끝내지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "같은 장소·시각의 두 계절 별무리 차이를 태양 둘레 공전과 연결한다.",
    "두 날짜 모두 밤 9시이므로 별무리 차이는 공전과 무관하다고 한다.",
    "축 중심 회전과 태양 둘레 이동을 모두 하루 운동으로 합친다.",
    "다른 방향의 별무리도 남쪽 하늘과 같은 조건으로 비교했다고 쓴다.",
    "공전 위치만 바꾼 카드 모형으로 실제 지구 자전을 측정했다고 쓴다."
   ],
   "key": 0,
   "responseContract": {
    "kind": "single-choice",
    "answer": 0
   },
   "formLabel": "객관식",
   "criteria": "선택할 문장: 같은 장소·시각의 두 계절 별무리 차이를 태양 둘레 공전과 연결한다. 발문에서 정한 관점·조건을 유지한 선택인지 확인한다."
  },
  {
   "id": "c22-s61-u04-w115",
   "no": 115,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "근거가 있는 설명 카드의 구성으로 적절한 것을 고르세요. (2개 선택)",
   "answer": "②, ⑤",
   "explanation": "짧아도 조건·보인 차이·원인의 연결이 필요해요. 불분명한 관찰과 예상은 따로 두고 질문을 통해 설명을 보완해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "관찰하지 못한 값도 모범 결과와 같게 채운다.",
    "무엇이 달라졌는지와 자전/공전 중 관련 운동을 연결한다.",
    "확인할 수 없는 출처를 지우면 모든 주장이 관측 사실이 된다.",
    "친구가 질문하면 조건을 없애 더 짧은 정답만 남긴다.",
    "장소·날짜·시각·방향과 자료 종류를 밝힌다."
   ],
   "key": [
    1,
    4
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     4
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ②, ⑤. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w116",
   "no": 116,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "multiple",
   "form": "multi",
   "type": "T10",
   "topic": "근거로 설명하고 고치기",
   "prompt": "자전·공전 모형을 사용한 뒤 설명할 수 있는 것과 한계를 바르게 구별한 문장을 고르세요. (2개 선택)",
   "answer": "②, ④",
   "explanation": "모형의 설명력은 대응시킨 관계에 있어요. 거리·속도·가시 범위까지 자동으로 재현된 것으로 확대하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "choices": [
    "한 계절에 정면인 카드가 하나이면 실제 별자리도 하나뿐이다.",
    "빛 받는 면 변화와 같은 지역의 낮밤을 연결할 수 있다.",
    "교실 카드의 거리는 실제 별 거리를 같은 비율로 나타낸다.",
    "지구 위치와 한밤 시선 변화로 계절별 밤하늘 차이를 설명한다.",
    "모형 관찰만으로 실제 지구 자전 속도의 정밀 측정을 끝냈다."
   ],
   "key": [
    1,
    3
   ],
   "responseContract": {
    "kind": "multi-choice",
    "answers": [
     1,
     3
    ]
   },
   "formLabel": "복수 선택",
   "criteria": "지정한 2개를 빠짐이나 추가 없이 고른다: ②, ④. 선택 순서는 상관없으며 중복·추가·누락 답은 인정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w117",
   "no": 117,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T06",
   "topic": "근거로 설명하고 고치기",
   "prompt": "“지구가 돈다”를 더 분명하게 씁니다. 하루 낮밤에는 축 중심 ㉠[ ], 계절별 밤하늘에는 태양 둘레 ㉡[ ]을 연결합니다.",
   "answer": "㉠ 자전 / ㉡ 공전",
   "explanation": "중심과 시간 범위가 다른 두 운동이에요. 같은 동사로 뭉뚱그리기보다 자료와 대응하는 이름을 써요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "자전",
      "지구의 자전",
      "지구 자전"
     ]
    },
    {
     "label": "㉡",
     "accepted": [
      "공전",
      "지구의 공전",
      "지구 공전"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "자전",
       "지구의 자전",
       "지구 자전"
      ]
     },
     {
      "label": "㉡",
      "accepted": [
       "공전",
       "지구의 공전",
       "지구 공전"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 자전 / ㉡: 공전. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말",
    "㉡에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w118",
   "no": 118,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "blank",
   "form": "blank",
   "type": "T12",
   "topic": "근거로 설명하고 고치기",
   "prompt": "“프로그램에서 보았다”는 자료 읽기이고, 직접 운동장에서 같은 별무리를 본 기록은 ㉠[ ] 관찰입니다. 두 자료 종류를 구별해 빈칸을 채우세요.",
   "answer": "㉠ 야외",
   "explanation": "프로그램과 실제 야외 관찰은 서로 보완할 수 있지만 자료가 만들어진 방법이 달라요. 설정 화면을 야외에서 직접 본 사진이라고 쓰지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "slots": [
    {
     "label": "㉠",
     "accepted": [
      "야외",
      "실제 야외",
      "직접 야외"
     ]
    }
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-term-parts",
    "parts": [
     {
      "label": "㉠",
      "accepted": [
       "야외",
       "실제 야외",
       "직접 야외"
      ]
     }
    ]
   },
   "formLabel": "빈칸 넣기",
   "criteria": "㉠: 야외. 칸별 의미와 대응을 보며 앞뒤를 바꾼 답은 인정하지 않는다. 타당한 다른 표현은 교사가 확인한다.",
   "parts": [
    "㉠에 들어갈 낱말"
   ]
  },
  {
   "id": "c22-s61-u04-w119",
   "no": 119,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "설명 카드의 부족한 부분과 보완 방법을 연결하세요.",
   "answer": "(1) ㄷ / (2) ㄱ / (3) ㄴ",
   "explanation": "잘못된 부분과 관련된 조건을 구체적으로 보완해요. 별자리 이름이나 장식 색만 늘리는 것으로 해결하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) “오른쪽으로 갔다”만 있고 바라본 방향이 없음",
    "(2) “한 바퀴 돈다”만 있고 운동의 중심·기간이 없음",
    "(3) 프로그램 화면을 직접 야외 촬영 사진이라고 적음"
   ],
   "options": [
    "ㄱ. 자전축/하루 또는 태양/일 년을 자료에 맞게 밝힘",
    "ㄴ. 자료 종류와 출처·설정을 실제에 맞게 고침",
    "ㄷ. 관측 방향과 기준 방위를 함께 표시함"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄷ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄷ / (2) ㄱ / (3) ㄴ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 자전축/하루 또는 태양/일 년을 자료에 맞게 밝힘",
    "ㄴ. 자료 종류와 출처·설정을 실제에 맞게 고침",
    "ㄷ. 관측 방향과 기준 방위를 함께 표시함"
   ]
  },
  {
   "id": "c22-s61-u04-w120",
   "no": 120,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "match",
   "form": "match",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "세 주장에 필요한 핵심 근거를 연결하세요.",
   "answer": "(1) ㄱ / (2) ㄷ / (3) ㄴ",
   "explanation": "주장에 맞는 관찰 시간 범위와 모형 관계를 골라야 해요. 서로 관련된 자료라도 모든 주장을 같은 표 하나로 검증할 수 있지는 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "parts": [
    "(1) 같은 지역에 낮과 밤이 번갈아 온다.",
    "(2) 계절에 따라 같은 시각의 밤하늘이 달라진다.",
    "(3) 남쪽 별무리의 같은 밤 위치가 달라져 보인다."
   ],
   "options": [
    "ㄱ. 같은 지역 표시의 회전과 직접 빛 받음 차이",
    "ㄴ. 같은 날짜의 시각별 위치 기록과 관측자의 자전",
    "ㄷ. 고정 조건의 날짜 비교와 공전 위치/밤의 시선"
   ],
   "answerPerPart": true,
   "responseContract": {
    "kind": "ordered-label-parts",
    "answers": [
     "ㄱ",
     "ㄷ",
     "ㄴ"
    ]
   },
   "formLabel": "연결하기",
   "criteria": "각 소문항 번호와 기호의 대응 (1) ㄱ / (2) ㄷ / (3) ㄴ를 확인한다. 번호 없이 옮겨 쓸 때에도 소문항 순서를 유지한다.",
   "given": [
    "ㄱ. 같은 지역 표시의 회전과 직접 빛 받음 차이",
    "ㄴ. 같은 날짜의 시각별 위치 기록과 관측자의 자전",
    "ㄷ. 고정 조건의 날짜 비교와 공전 위치/밤의 시선"
   ]
  },
  {
   "id": "c22-s61-u04-w121",
   "no": 121,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "친구가 “두 계절 화면의 시각이 달라요”라고 질문했습니다. 주장을 보완하는 다음 절차의 순서를 쓰세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "질문→원기록 확인→조건 보완→재관찰→설명 수정의 의존 관계가 있어요. 처음 기록을 모르게 지우거나 결과를 먼저 고치는 순서가 아니에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 고친 조건의 실제 화면에서 위치를 다시 읽는다.",
    "ㄴ. 원래 두 기록의 시각·장소·방향을 먼저 확인한다.",
    "ㄷ. 질문을 반영한 근거와 설명으로 카드를 고쳐 보여 준다.",
    "ㄹ. 시각 등 비교 조건을 맞추어 다시 설정한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄴ",
     "ㄹ",
     "ㄱ",
     "ㄷ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄴ → ㄹ → ㄱ → ㄷ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 고친 조건의 실제 화면에서 위치를 다시 읽는다.",
    "ㄴ. 원래 두 기록의 시각·장소·방향을 먼저 확인한다.",
    "ㄷ. 질문을 반영한 근거와 설명으로 카드를 고쳐 보여 준다.",
    "ㄹ. 시각 등 비교 조건을 맞추어 다시 설정한다."
   ]
  },
  {
   "id": "c22-s61-u04-w122",
   "no": 122,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "sequence",
   "form": "order",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "짧은 설명 카드를 만들고 나누는 정해진 수업 순서를 쓰세요. 먼저 비교할 현상과 조건을 정하기로 했습니다.",
   "answer": "ㄷ → ㄹ → ㄱ → ㄴ",
   "explanation": "계획한 조건의 실제 자료를 읽은 뒤 설명 자료를 만들고 나누어요. 정답 문장만 먼저 적은 것을 실제 관찰로 바꾸지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "options": [
    "ㄱ. 실제 자료의 위치 차이와 원인을 연결해 카드를 만든다.",
    "ㄴ. 친구에게 보여 주고 질문을 받아 근거가 부족한 곳을 고친다.",
    "ㄷ. 비교할 현상·조건·안전한 자료를 정한다.",
    "ㄹ. 정한 조건에서 관찰하거나 프로그램을 읽고 기록한다."
   ],
   "responseContract": {
    "kind": "ordered-label-sequence",
    "sequence": [
     "ㄷ",
     "ㄹ",
     "ㄱ",
     "ㄴ"
    ]
   },
   "formLabel": "순서 배열",
   "criteria": "지정한 출발점·관점·단계 조건에서 ㄷ → ㄹ → ㄱ → ㄴ 순서로 쓴다. 기호 사이 화살표나 쉼표는 달라도 대응 순서는 같아야 한다.",
   "given": [
    "ㄱ. 실제 자료의 위치 차이와 원인을 연결해 카드를 만든다.",
    "ㄴ. 친구에게 보여 주고 질문을 받아 근거가 부족한 곳을 고친다.",
    "ㄷ. 비교할 현상·조건·안전한 자료를 정한다.",
    "ㄹ. 정한 조건에서 관찰하거나 프로그램을 읽고 기록한다."
   ]
  },
  {
   "id": "c22-s61-u04-w123",
   "no": 123,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "표의 주장을 각각 자료에 맞게 판정하고 고쳐 쓰세요. 둘 다 짧게 근거를 붙이세요.",
   "answer": "주장가는 같은 날 시간 차이이므로 하루 자전과 연결해야 한다. 주장나는 장소·시각을 맞춘 날짜 차이이므로 공전과 밤에 보는 방향을 연결한다. 태양/별을 보았다는 말만으로 원인을 정하지 않고 조건을 읽는다.",
   "explanation": "표의 조건과 주장한 원인 사이의 대응을 확인해요. 별의 유무보다 날짜·시각 비교 구조가 핵심이에요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "가의 자전으로 수정",
    "나의 공전과 밤 시선",
    "표의 날짜/시각 조건을 근거로 사용"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "주장가는 같은 날 시간 차이이므로 하루 자전과 연결해야 한다. 주장나는 장소·시각을 맞춘 날짜 차이이므로 공전과 밤에 보는 방향을 연결한다. 태양/별을 보았다는 말만으로 원인을 정하지 않고 조건을 읽는다.",
    "required": [
     "가의 자전으로 수정",
     "나의 공전과 밤 시선",
     "표의 날짜/시각 조건을 근거로 사용"
    ]
   },
   "table": {
    "머리": [
     "기록",
     "비교 조건",
     "붙인 주장"
    ],
    "행": [
     [
      "가",
      "같은 날 서울·남쪽 21시/22시",
      "일 년 공전 차이만 비교했다."
     ],
     [
      "나",
      "서울·남쪽·21시의 3월/9월",
      "같은 시각이므로 공전과는 관계없다."
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "가의 자전으로 수정 / 나의 공전과 밤 시선 / 표의 날짜/시각 조건을 근거로 사용. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-123"
  },
  {
   "id": "c22-s61-u04-w124",
   "no": 124,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "data",
   "form": "written",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "다음은 설명 카드의 실제 수정 전후가 아닌 연습 사례입니다. 더 나아진 부분과 아직 확인해야 할 점을 각각 쓰세요.",
   "answer": "수정 뒤에는 장소·날짜·시각·방향과 자료 종류를 넣어 비교 조건이 분명해졌다. 하지만 어떤 별무리를 같은 대상으로 찾았고 위치가 어떻게 달랐는지 실제 화면 기록이 아직 필요하다. 설정만 쓴 것을 결과 확인으로 보지 않는다.",
   "explanation": "조건 보완은 진전이지만 조건이 있다고 관찰 결과까지 생기는 것은 아니에요. 근거가 아직 없는 부분을 구별하는 자료 평가예요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "설정 / 자료 종류 보완을 찾음",
    "대상/위치 차이 근거의 부족",
    "설정과 관찰 결과 구별"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "수정 뒤에는 장소·날짜·시각·방향과 자료 종류를 넣어 비교 조건이 분명해졌다. 하지만 어떤 별무리를 같은 대상으로 찾았고 위치가 어떻게 달랐는지 실제 화면 기록이 아직 필요하다. 설정만 쓴 것을 결과 확인으로 보지 않는다.",
    "required": [
     "설정 / 자료 종류 보완을 찾음",
     "대상/위치 차이 근거의 부족",
     "설정과 관찰 결과 구별"
    ]
   },
   "table": {
    "머리": [
     "상태",
     "카드 내용"
    ],
    "행": [
     [
      "수정 전",
      "지구가 돌아 별자리가 달라진다."
     ],
     [
      "수정 뒤",
      "서울·남쪽·21시의 3월/9월 프로그램을 비교한다."
     ]
    ]
   },
   "formLabel": "자료 해석",
   "criteria": "설정 / 자료 종류 보완을 찾음 / 대상/위치 차이 근거의 부족 / 설정과 관찰 결과 구별. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다.",
   "figure": "earth-question-data-124"
  },
  {
   "id": "c22-s61-u04-w125",
   "no": 125,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "친구가 “같은 별자리가 두 계절 화면에 있으니 공전 설명은 전부 틀렸어”라고 했습니다. 받아들일 관찰과 고칠 해석을 나누어 답하세요.",
   "answer": "같은 별자리를 두 화면에서 찾았다는 관찰은 남긴다. 일부 별자리가 겹쳐 보일 수 있으므로 그것만으로 계절별 위치 차이나 공전 설명 전체를 부정할 수 없다. 같은 조건에서 실제 위치와 다른 별무리도 함께 비교해 설명을 보완한다.",
   "explanation": "관찰이 예상과 다를 때 사실을 지우지 않되, 그 관찰이 반박하는 주장 범위를 정확히 정해야 해요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "겹쳐 보인 관찰 보존",
    "배타성 가정과 공전 설명 구별",
    "조건 맞춘 위치/다른 별무리 비교"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "같은 별자리를 두 화면에서 찾았다는 관찰은 남긴다. 일부 별자리가 겹쳐 보일 수 있으므로 그것만으로 계절별 위치 차이나 공전 설명 전체를 부정할 수 없다. 같은 조건에서 실제 위치와 다른 별무리도 함께 비교해 설명을 보완한다.",
    "required": [
     "겹쳐 보인 관찰 보존",
     "배타성 가정과 공전 설명 구별",
     "조건 맞춘 위치/다른 별무리 비교"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "겹쳐 보인 관찰 보존 / 배타성 가정과 공전 설명 구별 / 조건 맞춘 위치/다른 별무리 비교. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w126",
   "no": 126,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "reason",
   "form": "written",
   "type": "T12",
   "topic": "근거로 설명하고 고치기",
   "prompt": "“정답을 맞혔으니 실제 하늘 관찰과 지구의 활동도 끝났다”는 말이 과학 학습의 근거로 부족한 이유를 쓰세요. 실제로 더 해야 할 일을 한 가지 이상 제안하세요.",
   "answer": "문항 답은 개념 이해를 보여 줄 수 있지만 실제 관찰·모형 조작을 했다는 증거는 아니다. 교사와 안전한 조건에서 같은 지역의 빛 받음 모형을 직접 비교하거나 정한 조건의 하늘/프로그램 위치를 실제로 읽고 기록한다.",
   "explanation": "개념 설명과 실제 탐구 경험을 함께 갖추는 것이 목표예요. 수행을 못 했다고 개념 답을 없애거나 수행한 것처럼 기록하지 않아요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "개념 응답과 수행 증거 구별",
    "구체적인 관찰/모형 활동 제안",
    "안전 조건/자료 종류 보존"
   ],
   "lines": 8,
   "responseContract": {
    "kind": "written-explanation",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "문항 답은 개념 이해를 보여 줄 수 있지만 실제 관찰·모형 조작을 했다는 증거는 아니다. 교사와 안전한 조건에서 같은 지역의 빛 받음 모형을 직접 비교하거나 정한 조건의 하늘/프로그램 위치를 실제로 읽고 기록한다.",
    "required": [
     "개념 응답과 수행 증거 구별",
     "구체적인 관찰/모형 활동 제안",
     "안전 조건/자료 종류 보존"
    ]
   },
   "formLabel": "까닭 설명",
   "criteria": "개념 응답과 수행 증거 구별 / 구체적인 관찰/모형 활동 제안 / 안전 조건/자료 종류 보존. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w127",
   "no": 127,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "이번 단원의 핵심을 친구에게 설명할 한 장을 설계하세요. 하루 변화와 계절 차이를 나란히 놓고 관측 조건·위치 차이·지구 운동을 연결하세요.",
   "answer": "두 줄에 같은 날 시각 비교/자전과 같은 시각 날짜 비교/공전을 각각 둔다. 장소·방향·자료 종류와 실제 위치 차이를 밝히고 그림·화살표·근거 문장을 연결한다. 확정하지 못한 부분은 질문으로 남긴다.",
   "explanation": "기억한 정답 목록보다 비교 구조가 보이는 설명 자료가 필요해요. 사진·프로그램·모형 자료의 출처와 조건도 읽을 수 있게 넣어요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "하루 조건과 자전",
    "계절 조건과 공전",
    "실제 위치 차이 / 자료 종류 / 근거 문장",
    "미확인 부분 보존"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "두 줄에 같은 날 시각 비교/자전과 같은 시각 날짜 비교/공전을 각각 둔다. 장소·방향·자료 종류와 실제 위치 차이를 밝히고 그림·화살표·근거 문장을 연결한다. 확정하지 못한 부분은 질문으로 남긴다.",
    "required": [
     "하루 조건과 자전",
     "계절 조건과 공전",
     "실제 위치 차이 / 자료 종류 / 근거 문장",
     "미확인 부분 보존"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "하루 조건과 자전 / 계절 조건과 공전 / 실제 위치 차이 / 자료 종류 / 근거 문장 / 미확인 부분 보존. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  },
  {
   "id": "c22-s61-u04-w128",
   "no": 128,
   "section": 8,
   "sectionTitle": "근거로 설명하고 고치기",
   "bookResponseForm": "draw-design",
   "form": "draw",
   "type": "T13",
   "topic": "근거로 설명하고 고치기",
   "prompt": "짝과 설명 카드를 나눈 뒤 근거가 빠진 곳을 고치는 수업을 설계하세요. 실제 보여 줄 자료·친구에게 물을 질문·고칠 기준을 간단히 배치하세요.",
   "answer": "조건과 실제 위치 기록을 담은 카드를 교실에서 보여 준다. “두 기록의 시각이 같은가?”, “같은 별무리를 찾은 근거가 보이는가?”를 묻고 빠진 조건이나 위치 표시를 고쳐 다시 설명한다. 실제로 못 나눴다면 다음에 이어간다.",
   "explanation": "공개 게시나 외부 메시지를 요구하는 활동이 아니에요. 교실에서 설명이 통하는지 확인하고 근거를 보완하는 설계예요.",
   "misconception": "관측 조건·보인 사실·모형으로 설명한 원인을 구별해요.",
   "origin": "independently-authored-current-curriculum",
   "status": "authored",
   "standard": "6과12-03",
   "sourceRef": {
    "type": "authored",
    "curriculum": "2022 개정",
    "course": "6-1",
    "unit": "Ⅳ. 지구의 운동",
    "originalExam": false
   },
   "evidence": {
    "actualStudentObservation": false,
    "actualPlanetariumCalculation": false,
    "dataKind": "authored-practice-or-specified-model"
   },
   "requirements": [
    "실제 보여 줄 조건/위치 자료",
    "과학 조건과 근거를 묻는 질문",
    "수정 기준과 다시 설명하기"
   ],
   "lines": 0,
   "drawing": "large",
   "responseContract": {
    "kind": "drawing",
    "teacherRequired": true,
    "actualPerformanceMustNotBeInferred": true,
    "sample": "조건과 실제 위치 기록을 담은 카드를 교실에서 보여 준다. “두 기록의 시각이 같은가?”, “같은 별무리를 찾은 근거가 보이는가?”를 묻고 빠진 조건이나 위치 표시를 고쳐 다시 설명한다. 실제로 못 나눴다면 다음에 이어간다.",
    "required": [
     "실제 보여 줄 조건/위치 자료",
     "과학 조건과 근거를 묻는 질문",
     "수정 기준과 다시 설명하기"
    ]
   },
   "formLabel": "그림·설계",
   "drawingExplanationLines": 3,
   "criteria": "실제 보여 줄 조건/위치 자료 / 과학 조건과 근거를 묻는 질문 / 수정 기준과 다시 설명하기. 조건과 근거가 같은 다른 타당한 표현도 교사가 확인한다. 문장만으로 실제 관찰·제작·나눔을 완료했다고 정하지 않는다."
  }
 ],
 "pages": [
  {
   "section": "시작하기",
   "title": "지구의 운동",
   "blocks": [
    {
     "type": "diagram",
     "key": "sun",
     "caption": ""
    },
    {
     "type": "text",
     "text": "하루와 계절에 따라 달라지는 하늘을 관찰하고 지구의 **자전·공전**과 연결해요. 같은 지역의 낮과 밤은 지구의와 광원으로 비교하고, 계절별 별자리는 관측 프로그램에서 조건을 맞춰 찾아요."
    },
    {
     "type": "field",
     "title": "지금 궁금한 것",
     "hint": "이름·학습 날짜를 쓰고 하늘에서 더 알고 싶은 것을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측 조건과 근거에서 출발해 원인을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "태양은 맨눈이나 쌍안경·망원경으로 직접 보지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "조건에서 근거 있는 설명으로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 하늘을 읽는 기준",
       "1~16번"
      ],
      [
       "2. 하루 동안 달라지는 태양과 별",
       "17~32번"
      ],
      [
       "3. 움직이는 관측자",
       "33~48번"
      ],
      [
       "4. 낮과 밤을 만드는 빛",
       "49~64번"
      ],
      [
       "5. 하루와 일 년을 구별하기",
       "65~80번"
      ],
      [
       "6. 한밤에 바라보는 방향",
       "81~96번"
      ],
      [
       "7. 조건을 맞춘 별자리 비교",
       "97~112번"
      ],
      [
       "8. 근거로 설명하고 고치기",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "객관식·복수 선택·빈칸·연결·순서·자료 해석·까닭·그림/설계의 **8형식**을 연습해요. 오른쪽에는 핵심 정리·더 알아보기·내가 정리할 것을 두었어요."
    },
    {
     "type": "field",
     "title": "오늘의 학습 계획",
     "hint": "먼저 확인할 조건과 실제로 해 볼 활동을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 관찰·실험·설명 활동을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "각 40분의 4차시와 별도 확인 문제 45분의 수업 예시예요. 128문항 연습과 야외 관찰은 여러 시간에 나누어 이어가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 1 · 하늘을 읽는 기준",
   "title": "하늘을 읽는 기준",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "방위 기준",
       "관측자가 바라보는 방향과 동·서·남·북을 함께 정한 기준"
      ],
      [
       "관측 조건",
       "장소·날짜·시각·바라보는 방향·확대율"
      ],
      [
       "자료 종류",
       "야외 관찰, 천체 관측 프로그램, 교실 모형, 제공된 연습 자료"
      ]
     ]
    },
    {
     "type": "text",
     "text": "하늘의 **왼쪽·오른쪽**만으로는 방위를 알 수 없어요. 관측자가 어디를 바라보는지 먼저 정해요. 이 단원은 우리나라의 같은 장소에서 **남쪽 하늘**을 바라보는 관점으로 시작해요."
    },
    {
     "type": "table",
     "heads": [
      "바라보는 쪽",
      "왼쪽",
      "오른쪽"
     ],
     "rows": [
      [
       "남쪽",
       "동쪽",
       "서쪽"
      ],
      [
       "북쪽",
       "서쪽",
       "동쪽"
      ]
     ]
    },
    {
     "type": "text",
     "text": "나침반이나 지도는 교사와 안전하게 사용해요. 프로그램에서는 화면 아래의 S 표시와 관측 장소·시각을 함께 확인해요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "친구는 남쪽을 보고, 나는 북쪽을 봅니다. 두 사람의 왼쪽이 같은 방위일까요? 바라보는 방향과 함께 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "남쪽을 바라보는 관측자의 왼쪽은 동쪽, 오른쪽은 서쪽이에요."
    },
    {
     "title": "더 알아보기",
     "text": "북쪽을 보는 관측자의 왼쪽과 남쪽을 보는 관측자의 왼쪽은 같은 방위가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "하늘을 읽는 기준 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "서울의 남쪽 밤 9시 화면과 부산의 북쪽 새벽 2시 화면을 보고 계절 차이만 말해도 될까요?",
     "steps": [
      [
       "조건 찾기",
       "장소·시각·방향이 함께 달라졌어요."
      ],
      [
       "비교 목적 정하기",
       "계절 차이를 보려면 날짜를 바꾸고 다른 기준은 같게 맞춰요."
      ],
      [
       "근거 남기기",
       "맞춘 조건과 실제로 찾은 별무리 위치를 함께 기록해요."
      ]
     ],
     "answer": "서로 다른 여러 조건을 먼저 맞춘 뒤 계절별 위치를 다시 비교해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "남쪽을 바라보는 관측자의 왼쪽은 동쪽, 오른쪽은 서쪽이에요."
    },
    {
     "title": "더 알아보기",
     "text": "북쪽을 보는 관측자의 왼쪽과 남쪽을 보는 관측자의 왼쪽은 같은 방위가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w001",
      "c22-s61-u04-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 3~4",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w003",
      "c22-s61-u04-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 5~6",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w005",
      "c22-s61-u04-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 7~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w007",
      "c22-s61-u04-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w009",
      "c22-s61-u04-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 11",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 12",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 13",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 14",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 15",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 16",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ① · 방위와 안전",
   "title": "관측자의 기준을 먼저 정해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "nightEnvironment",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "교사와 안전한 관측 장소·시각과 함께할 어른을 정해요.",
      "남쪽을 바라보는 자리를 정하고 주변 기준물과 방위를 확인해요.",
      "야외/간접 자료/프로그램 중 오늘 사용한 방법을 구별해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "준비할 것",
      "나의 실제 계획"
     ],
     "rows": [
      [
       "장소·날짜·시각·함께할 어른",
       ""
      ],
      [
       "바라볼 남쪽과 주변 기준물",
       ""
      ],
      [
       "태양을 직접 보지 않는 안전한 방법",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "다시 확인할 여건",
     "hint": "흐림·가림·이동 안전과 준비가 필요한 것을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "야외 밤 관측은 어른과 안전한 곳에서 해요."
    },
    {
     "title": "더 알아보기",
     "text": "도로·옥상 가장자리나 혼자 밤에 나가는 방법을 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-safety",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 2 · 하루 동안 달라지는 태양과 별",
   "title": "하루 동안 달라지는 태양과 별",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "하루 위치 변화",
       "같은 날 시각이 달라질 때 보이는 위치의 변화"
      ],
      [
       "같은 별무리",
       "주변 별들의 배열을 근거로 계속 따라보는 대상"
      ],
      [
       "겉보기 이동",
       "관측자에게 움직이는 것처럼 보이는 위치 변화"
      ]
     ]
    },
    {
     "type": "text",
     "text": "우리나라에서 남쪽을 향해 태양 위치를 비교하면 오전에는 **동쪽 쪽**, 오후에는 **서쪽 쪽**으로 달라져요. 태양을 맨눈이나 쌍안경·망원경으로 직접 보지 않고 안전한 간접 자료나 프로그램을 사용해요."
    },
    {
     "type": "text",
     "text": "같은 밤의 별무리도 시각이 지나면 위치가 달라져요. 별 하나의 이름만 바꾸어 고르지 말고 **주변 배열**로 같은 대상을 찾은 뒤 위치를 비교해요."
    },
    {
     "type": "table",
     "heads": [
      "연습 기록",
      "남쪽 기준 위치",
      "배열 표시"
     ],
     "rows": [
      [
       "20:00",
       "왼쪽 쪽",
       "P와 주변 세 별"
      ],
      [
       "22:00",
       "오른쪽 쪽",
       "P와 주변 세 별"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "21시에는 별무리 위치를 읽었지만 22시에는 구름 때문에 못 보았습니다. 남길 기록과 다음에 확인할 방법을 나누어 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 날·자리·방향에서 시각을 바꾸고 같은 대상을 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "서울의 시계 12시에 태양이 항상 정확한 남쪽이나 머리 위에 있는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "하루 동안 달라지는 태양과 별 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "표에서 위치가 바뀌었으니 두 시간 만에 별자리 모양도 완전히 바뀐 것일까요?",
     "steps": [
      [
       "같은 대상 확인",
       "배열 표시가 같아서 같은 별무리를 따른 연습 기록이에요."
      ],
      [
       "변한 것 찾기",
       "남쪽 기준 위치가 왼쪽에서 오른쪽 쪽으로 달라졌어요."
      ],
      [
       "주장 구별",
       "위치 변화와 별 배열 자체의 변화를 같은 뜻으로 말하지 않아요."
      ]
     ],
     "answer": "같은 배열의 위치가 달라진 것으로 읽어요. 이 연습표를 실제 관측 결과로 옮겨 쓰지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 날·자리·방향에서 시각을 바꾸고 같은 대상을 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "서울의 시계 12시에 태양이 항상 정확한 남쪽이나 머리 위에 있는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 17~18",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w017",
      "c22-s61-u04-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 19~20",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w019",
      "c22-s61-u04-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 21~22",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w021",
      "c22-s61-u04-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 23~24",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w023",
      "c22-s61-u04-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 25~26",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w025",
      "c22-s61-u04-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 27",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 28",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 29",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 30",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 31",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 32",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ② · 태양 위치",
   "title": "시각만 바꾼 세 화면을 비교해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sky-sun-09",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-sun-12",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-sun-15",
     "caption": ""
    },
    {
     "type": "text",
     "text": "설정 링크에서 실제 날짜·시각을 확인해요. S를 기준으로 태양 위치를 비교하고, 화면에서 읽은 것을 남겨요. 프로그램을 야외 관측 사진이라고 쓰지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "한국 시각·실제 표시 확인",
      "남쪽 기준 태양의 위치"
     ],
     "rows": [
      [
       "09:00",
       ""
      ],
      [
       "12:00",
       ""
      ],
      [
       "15:00",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "같게 한 것·바꾼 것",
     "hint": "세 화면의 조건과 달라진 위치를 연결해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각 외의 장소·날짜·방향·확대율을 맞춰요."
    },
    {
     "title": "더 알아보기",
     "text": "링크를 연 뒤 시계 흐름이 멈췄는지와 실제 표시 시각도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-sun",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ③ · 같은 밤의 별",
   "title": "배열로 같은 별무리를 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sky-spring-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-spring-22",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "같은 날 21시 화면에서 남쪽의 밝은 별과 주변 배열을 골라요.",
      "22시 화면에서 같은 별무리를 배열로 다시 찾아요.",
      "두 화면의 실제 표시 시각과 S 기준 위치를 각각 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "두 시각의 위치와 같은 대상 표시",
     "hint": "두 칸에 시각·남쪽 기준·별무리 배열과 위치를 표시해요. 불분명하면 그대로 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "별무리의 모양과 하늘에서의 위치를 나누어 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "야외에서 이어 관찰한다면 어른과 같은 자리·방향에서 보고 프로그램 기록과 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-night",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 3 · 움직이는 관측자",
   "title": "움직이는 관측자",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "자전축",
       "지구가 스스로 도는 중심이 되는 가상의 축"
      ],
      [
       "지표 관측자",
       "지구와 함께 움직이며 하늘을 보는 사람"
      ],
      [
       "모형 밖 관점",
       "교실에서 지구의와 고정 광원을 함께 보는 위치"
      ]
     ]
    },
    {
     "type": "text",
     "text": "지구는 **서쪽에서 동쪽으로** 자전해요. 지구와 함께 움직이는 관측자에게는 태양·별이 반대 방향으로 위치를 바꾸는 것처럼 보여요. 모형 밖에서 고정 광원을 보는 사람과 지구 위 관측자의 설명을 나누어요."
    },
    {
     "type": "table",
     "heads": [
      "정한 관점",
      "설명"
     ],
     "rows": [
      [
       "지표의 동·서 방위",
       "지구가 서쪽에서 동쪽으로 자전"
      ],
      [
       "북극 위에서 지구 중심을 내려다봄",
       "지구가 반시계 방향으로 자전"
      ],
      [
       "지표에서 남쪽 하늘을 봄",
       "하루 동안 동쪽 쪽에서 서쪽 쪽으로 겉보기 위치 변화"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "친구가 지구의 위 표시와 함께 돌면서 전등을 보았습니다. 교실 전등의 실제 위치와 친구에게 보이는 방향을 나누어 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서로 다른 관점에서 본 운동과 겉보기 방향을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "시계·반시계라는 말에는 어디에서 내려다보는지 꼭 붙여요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "움직이는 관측자 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "교실 전등은 움직이지 않았는데 지구의 표시가 전등을 보는 방향은 달라졌어요. 두 설명이 모순일까요?",
     "steps": [
      [
       "고정한 대상",
       "전등은 교실의 같은 위치에 있어요."
      ],
      [
       "움직인 대상",
       "지구의와 표시는 축을 중심으로 함께 돌아요."
      ],
      [
       "관점 연결",
       "모형 위 표시가 전등을 바라보는 시선은 달라질 수 있어요."
      ]
     ],
     "answer": "고정한 물체와 움직이는 관측자의 시선을 구별하면 두 설명을 함께 이해할 수 있어요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서로 다른 관점에서 본 운동과 겉보기 방향을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "시계·반시계라는 말에는 어디에서 내려다보는지 꼭 붙여요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 33~34",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w033",
      "c22-s61-u04-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 35~36",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w035",
      "c22-s61-u04-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 37~39",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w037",
      "c22-s61-u04-w038",
      "c22-s61-u04-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 40~41",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w040",
      "c22-s61-u04-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 42",
   "title": "순서 배열로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 43",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 44",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 45",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 46",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 47",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 48",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ④ · 지구의 준비",
   "title": "광원과 관측자 표시를 맞춰요",
   "blocks": [
    {
     "type": "diagram",
     "key": "model",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "교사가 준비한 안정적인 LED 광원과 기울어진 축의 지구의를 사용해요.",
      "광원은 고정하고 우리나라의 같은 위치에 표시를 붙여요.",
      "지구의 바깥에서 보는 사람과 지구 위 표시의 시선을 구별해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "우리 장치의 조건",
     "hint": "광원 위치·축·같은 지역 표시와 주변 조명을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진의 표시가 실제 우리나라 위치라는 뜻은 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 지구의에서 우리나라 위치를 찾아 표시하고 전선·받침과 눈 보호를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-setup",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 4 · 낮과 밤을 만드는 빛",
   "title": "낮과 밤을 만드는 빛",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "낮",
       "한 지역이 태양빛을 직접 받는 상태"
      ],
      [
       "밤",
       "한 지역이 태양빛을 직접 받지 않는 상태"
      ],
      [
       "같은 지역의 교대",
       "지구 자전으로 같은 지역이 낮과 밤을 번갈아 지나는 변화"
      ]
     ]
    },
    {
     "type": "text",
     "text": "구형 지구에서 태양을 향한 면과 반대 면은 **직접 빛을 받는지**가 달라요. 같은 순간에도 지구 위 지역에 따라 낮과 밤이 다를 수 있어요."
    },
    {
     "type": "text",
     "text": "지구가 **기울어진 자전축**을 중심으로 하루에 한 바퀴 돌면 같은 지역이 빛 받는 면과 받지 않는 면을 지나가요. 낮과 밤의 하루 교대를 달이 매일 태양을 가리는 일로 설명하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "비교할 것",
      "살필 근거"
     ],
     "rows": [
      [
       "같은 순간의 A와 B",
       "태양을 향한 지역의 방향 차이"
      ],
      [
       "시간이 지난 같은 A",
       "축 중심 회전으로 바뀐 빛 받음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "구름이 낀 낮과 태양 반대쪽을 향한 밤은 모두 어둡게 보일 수 있습니다. 직접 빛과 지구 위 위치를 기준으로 두 상태를 구별해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공간의 두 지역을 비교하는 것과 같은 지역의 시간 변화를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "주변 조명이나 반사광이 있으면 모형의 어두운 면도 밝아 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "낮과 밤을 만드는 빛 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "공 양쪽이 모두 환하게 보였습니다. 지구에는 밤이 없다는 결론을 내려도 될까요?",
     "steps": [
      [
       "관찰 보존",
       "양쪽이 밝게 보인 결과는 그대로 남겨요."
      ],
      [
       "다른 조건 찾기",
       "주변 조명·벽의 반사광과 광원 위치를 확인해요."
      ],
      [
       "다시 비교",
       "안전한 환경에서 직접 빛을 받는 면과 반대 면을 구별해요."
      ]
     ],
     "answer": "모형 조건을 점검하고 다시 비교해요. 원하는 결과로 기록을 고치지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공간의 두 지역을 비교하는 것과 같은 지역의 시간 변화를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "주변 조명이나 반사광이 있으면 모형의 어두운 면도 밝아 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 49~50",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w049",
      "c22-s61-u04-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 51~52",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w051",
      "c22-s61-u04-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 53~54",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w053",
      "c22-s61-u04-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 55~56",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w055",
      "c22-s61-u04-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 57~58",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w057",
      "c22-s61-u04-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 59",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 60",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 61",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 62",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 63",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 64",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 자전과 낮밤",
   "title": "같은 지역이 받는 빛을 따라가요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "태양 모형에 해당하는 광원은 움직이지 않아요.",
      "기울어진 축을 유지하며 지구의를 서쪽에서 동쪽으로 천천히 돌려요.",
      "같은 지역 표시가 직접 빛을 받는 면과 반대 면을 지나는지 살펴요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "회전 과정·같은 지역",
      "실제로 본 직접 빛·주변 조명"
     ],
     "rows": [
      [
       "처음",
       ""
      ],
      [
       "천천히 돌린 뒤",
       ""
      ],
      [
       "한 바퀴 뒤",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "근거로 설명하기",
     "hint": "실제 관찰한 변화와 낮·밤을 연결해요. 예상과 달랐다면 조건도 확인해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 순간 두 지역의 차이와 같은 지역의 시간 변화를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "주변 조명·반사광이 영향을 주었는지 함께 확인하고 원래 관찰을 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-rotation",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 5 · 하루와 일 년을 구별하기",
   "title": "하루와 일 년을 구별하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "자전",
       "기울어진 자전축을 중심으로 하루에 한 바퀴 도는 운동"
      ],
      [
       "공전",
       "태양 둘레를 일 년에 한 바퀴 도는 운동"
      ],
      [
       "비교의 시간 범위",
       "같은 날 시각 차이인지 서로 다른 계절의 날짜 차이인지"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "운동",
      "도는 중심",
      "한 바퀴의 기간",
      "연결할 현상"
     ],
     "rows": [
      [
       "자전",
       "자전축",
       "하루",
       "태양·별의 하루 겉보기 위치, 낮과 밤"
      ],
      [
       "공전",
       "태양",
       "일 년",
       "계절에 따라 밤에 바라보는 방향 차이"
      ]
     ]
    },
    {
     "type": "text",
     "text": "중심이 다르면 운동의 이름도 달라요. 하루에 태양 둘레를 한 바퀴 돈다고 하거나, 자전축을 중심으로 일 년에 한 바퀴 돈다고 바꾸어 말하지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "“태양 둘레를 하루에 한 바퀴 도는 자전”이라는 문장에서 도는 중심과 기간을 다시 확인해 고쳐요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "운동 이름을 고르기 전에 도는 중심과 설명할 시간 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자전과 공전은 함께 일어나요. 수업의 비교 목적에 따라 주목하는 관계를 나누어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "하루와 일 년을 구별하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "가: 같은 날 21시와 22시. 나: 3월과 9월 같은 21시. 시각 조건의 역할은 같을까요?",
     "steps": [
      [
       "가의 목적",
       "하루 위치 변화를 보려고 시각을 달리해요."
      ],
      [
       "나의 목적",
       "계절 차이를 보려고 하루 중 시각을 같게 해요."
      ],
      [
       "다른 기준",
       "두 비교 모두 장소·방향·확대율과 따라볼 대상을 확인해요."
      ]
     ],
     "answer": "가에서는 시각을 바꾸고 자전과, 나에서는 날짜를 바꾸고 공전과 연결해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "운동 이름을 고르기 전에 도는 중심과 설명할 시간 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자전과 공전은 함께 일어나요. 수업의 비교 목적에 따라 주목하는 관계를 나누어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 65~66",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w065",
      "c22-s61-u04-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 67~68",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w067",
      "c22-s61-u04-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 69~70",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w069",
      "c22-s61-u04-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 71~72",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w071",
      "c22-s61-u04-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 73~74",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w073",
      "c22-s61-u04-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 75",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 76",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 77",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 78",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 79",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 80",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 6 · 한밤에 바라보는 방향",
   "title": "한밤에 바라보는 방향",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "한밤의 정면",
       "지구의 관측자 표시가 태양 반대쪽 바깥을 향하는 시선"
      ],
      [
       "고정 별 카드",
       "수업 중 위치를 옮기지 않는 먼 별의 모형"
      ],
      [
       "지구 위치 변화",
       "태양 둘레에서 지구의를 다른 곳으로 옮기는 조작"
      ]
     ]
    },
    {
     "type": "text",
     "text": "태양 모형과 바깥 별 카드는 고정해요. 지구의를 태양 둘레 다른 위치로 옮긴 뒤 매번 **한밤 시선**을 다시 맞춰요. 지구에서 중앙 태양을 보는 방향의 **반대쪽 바깥**에 있는 카드를 읽어요."
    },
    {
     "type": "table",
     "heads": [
      "지구 위치",
      "지구에서 본 태양 쪽",
      "한밤 정면"
     ],
     "rows": [
      [
       "태양 왼쪽",
       "오른쪽",
       "왼쪽 바깥"
      ],
      [
       "태양 오른쪽",
       "왼쪽",
       "오른쪽 바깥"
      ],
      [
       "태양 위쪽",
       "아래쪽",
       "위쪽 바깥"
      ],
      [
       "태양 아래쪽",
       "위쪽",
       "아래쪽 바깥"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "지구의를 태양 왼쪽에 놓았습니다. 지구에서 태양이 있는 방향과 한밤 정면 방향을 각각 말로 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지구 위치에서 태양 방향을 먼저 읽고 그 반대인 한밤 시선을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "카드 하나가 실제 밤하늘 전체는 아니며 실제 천체의 거리·크기를 같은 비율로 재현한 것도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "한밤에 바라보는 방향 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "지구의가 태양 아래쪽에 있어요. 한밤의 관측자가 태양 쪽 카드를 고른 답을 어떻게 점검할까요?",
     "steps": [
      [
       "지구 기준 읽기",
       "태양은 지구의 위쪽에 있어요."
      ],
      [
       "반대 시선 찾기",
       "한밤의 정면은 아래쪽 바깥이에요."
      ],
      [
       "발문 재확인",
       "보이는 정면을 물었는지 보기 어려운 방향을 물었는지 확인해요."
      ]
     ],
     "answer": "태양 방향과 반대인 아래쪽 바깥의 카드를 읽어요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지구 위치에서 태양 방향을 먼저 읽고 그 반대인 한밤 시선을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "카드 하나가 실제 밤하늘 전체는 아니며 실제 천체의 거리·크기를 같은 비율로 재현한 것도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 81~82",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w081",
      "c22-s61-u04-w082"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 83~84",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w083",
      "c22-s61-u04-w084"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 85~86",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w085",
      "c22-s61-u04-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 87",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w087"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 88~89",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w088",
      "c22-s61-u04-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 90",
   "title": "순서 배열로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 91",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 92",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 93",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 94",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 95",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 96",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 공전 모형",
   "title": "별 카드는 고정하고 지구를 옮겨요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "태양 모형은 중앙, 서로 다른 이름의 별 카드 네 장은 바깥에 고정해요.",
      "지구의를 네 위치로 옮긴 뒤 매번 같은 표시를 태양 반대쪽으로 돌려 한밤 시선을 맞춰요.",
      "지구 위치·태양 방향·한밤 정면 카드를 각각 기록해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "지구의 실제 배치",
      "태양을 보는 방향",
      "한밤 정면 카드"
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
      ],
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
     "title": "고정한 것과 바꾼 것",
     "hint": "달라진 정면 카드를 공전과 연결하고 모형의 한계도 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "태양과 별 카드의 위치를 수업 중 바꾸지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "카드의 거리·크기·보이는 범위는 실제 밤하늘과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-orbit",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 7 · 조건을 맞춘 별자리 비교",
   "title": "조건을 맞춘 별자리 비교",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "계절 비교",
       "장소·하루 중 시각·방향·확대율을 맞추고 날짜를 바꾼 비교"
      ],
      [
       "대표 별자리",
       "그 계절에 보기 좋은 별자리의 예"
      ],
      [
       "프로그램 설정과 결과",
       "열기 전 정한 조건과 실제 화면에서 확인한 위치의 구별"
      ]
     ]
    },
    {
     "type": "text",
     "text": "서울의 남쪽 하늘을 같은 **한국 시각 21시**와 확대율로 맞추고3·6·9·12월을 비교해요. 날짜별로 어떤 별무리 배열과 위치가 달라졌는지 실제 화면에서 찾아요."
    },
    {
     "type": "text",
     "text": "지구가 공전하면 밤에 바라보는 우주 방향이 달라져요. 여러 별자리가 함께 보일 수 있으며 계절마다 모든 별자리가 완전히 교체되는 것은 아니에요. 별자리 이름 암기보다 **위치와 관찰 조건**으로 설명해요."
    },
    {
     "type": "table",
     "heads": [
      "기록",
      "확인할 내용"
     ],
     "rows": [
      [
       "설정 목록",
       "장소·날짜·시각·방향·확대율"
      ],
      [
       "실제 화면 기록",
       "찾은 별무리와 주변 배열·기준에 대한 위치"
      ],
      [
       "아직 불분명",
       "구름·가림·화면 표시 등 확인하지 못한 상태"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "같은 별무리가 봄의 한밤과 여름의 새벽에 모두 보인 기록이 있습니다. 대표 계절과 관측 시각의 관계를 어떻게 설명할까요?",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건 목록만 적은 것을 관찰 결과로 바꾸지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "대표 계절이 있더라도 다른 계절의 다른 시각에 같은 별자리가 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "조건을 맞춘 별자리 비교 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 계절 화면의 별 점 개수가 달라요. 공전 속도가 바뀌었다는 근거일까요?",
     "steps": [
      [
       "가시성 조건",
       "달 밝기·대기 표시·확대율 등도 살펴요."
      ],
      [
       "같은 대상 찾기",
       "이름표 숫자 대신 같은 별무리의 배열과 위치를 비교해요."
      ],
      [
       "설명 범위",
       "점 개수 하나로 공전 중단이나 속도 변화를 결정하지 않아요."
      ]
     ],
     "answer": "비교 조건과 별무리 위치를 근거로 공전과 밤의 시선 관계를 설명해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건 목록만 적은 것을 관찰 결과로 바꾸지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "대표 계절이 있더라도 다른 계절의 다른 시각에 같은 별자리가 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 97~98",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w097",
      "c22-s61-u04-w098"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 99~100",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w099",
      "c22-s61-u04-w100"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 101~102",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w101",
      "c22-s61-u04-w102"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 103~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w103",
      "c22-s61-u04-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w105",
      "c22-s61-u04-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 107",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 108",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 109",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 110",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 111",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 112",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 계절 비교",
   "title": "같은 한국 시각 21시로 맞춰요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sky-spring-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-summer-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-autumn-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-winter-21",
     "caption": ""
    },
    {
     "type": "text",
     "text": "서울·남쪽·같은 확대율과 별자리 표시 상태를 맞춰요. 실제 화면에서 같은 별무리 배열과 위치를 비교하고 겹쳐 보이는 대상도 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "실제 표시 날짜·시각",
      "남쪽 기준 별무리·위치"
     ],
     "rows": [
      [
       "3월",
       ""
      ],
      [
       "6월",
       ""
      ],
      [
       "9월",
       ""
      ],
      [
       "12월",
       ""
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설정 목록과 실제로 읽은 위치 결과를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "기기 시간대와 프로그램의 시간 흐름·표시 설정을 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-seasons",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 계절 비교의 근거",
   "title": "두 화면의 차이를 설명해요",
   "blocks": [
    {
     "type": "field",
     "title": "선택한 두 화면과 조건",
     "hint": "실제 날짜·시각·장소·방향·확대율을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "같은 배열과 달라진 위치",
     "hint": "같은 대상이라고 찾은 근거와 위치 차이를 크게 표시해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "지구의 운동과 연결",
     "hint": "공전과 밤에 바라보는 방향을 연결하되 실제 자료가 말한 범위 안에서 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "별자리 이름보다 위치·조건과 그 까닭을 중심으로 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "한 별자리가 다른 계절에는 절대로 안 보인다고 단정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-season-evidence",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 8 · 근거로 설명하고 고치기",
   "title": "근거로 설명하고 고치기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "주장",
       "비교에서 알게 된 것을 설명한 문장"
      ],
      [
       "근거",
       "조건이 밝혀진 실제 위치 차이와 같은 대상임을 찾은 표시"
      ],
      [
       "설명 보완",
       "질문을 받아 조건이나 근거를 다시 확인해 고치는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "짧은 한 장에도 **대상·조건·위치·원인**의 연결이 보여야 해요. 직접 본 자료와 프로그램·모형·제공 자료를 구별하고 출처를 밝히세요."
    },
    {
     "type": "text",
     "text": "친구가 “시각이 다르다”고 질문하면 원기록을 확인하고 조건을 맞춰 실제로 다시 살펴요. 처음 자료를 몰래 고치거나, 관찰하지 못한 위치를 예상으로 채우지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "카드에서 볼 부분",
      "스스로 점검할 질문"
     ],
     "rows": [
      [
       "조건",
       "언제·어디에서·어느 방향을 보았나요?"
      ],
      [
       "대상과 위치",
       "같은 별무리임을 찾은 표시가 있나요?"
      ],
      [
       "원인",
       "하루/계절 비교와 자전/공전이 맞게 이어졌나요?"
      ],
      [
       "나눔과 보완",
       "실제로 들은 질문과 고친 부분은 무엇인가요?"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "친구가 두 화면의 방향이 다르다고 질문했습니다. 원기록 확인부터 설명 보완까지 실제로 이어서 할 일을 적어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측 조건 → 달라진 위치 → 지구의 운동을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항을 맞힌 것과 실제 관측·모형 조작·자료 제작·설명을 마친 것은 각각 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "근거로 설명하고 고치기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "사진은 크지만 날짜·시각·기준 방향과 실제 위치 표시가 없어요. 어떤 순서로 고칠까요?",
     "steps": [
      [
       "자료로 돌아가기",
       "사용한 자료 종류와 원래 조건을 확인해요."
      ],
      [
       "근거 붙이기",
       "실제로 찾은 대상·배열·위치를 표시해요."
      ],
      [
       "설명 다시 나누기",
       "이번 비교와 관련된 운동을 설명하고 질문을 받아 보완해요."
      ]
     ],
     "answer": "크게 꾸미기보다 친구가 조건과 근거를 따라 읽을 수 있게 고쳐요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측 조건 → 달라진 위치 → 지구의 운동을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항을 맞힌 것과 실제 관측·모형 조작·자료 제작·설명을 마친 것은 각각 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 113~114",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w113",
      "c22-s61-u04-w114"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 115~116",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w115",
      "c22-s61-u04-w116"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 117~118",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w117",
      "c22-s61-u04-w118"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 119~120",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w119",
      "c22-s61-u04-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 121~122",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w121",
      "c22-s61-u04-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 123",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 124",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 125",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 126",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 127",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 128",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 설명 카드",
   "title": "조건·위치·원인이 이어지는 한 장",
   "blocks": [
    {
     "type": "diagram",
     "key": "cardMaterials",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "실제로 확인한 두 관측 자료를 고르고 자료 종류와 출처를 밝혀요.",
      "장소·날짜·시각·방향과 같은 별무리를 찾은 표시를 넣어요.",
      "달라진 위치와 자전/공전의 관계를 한 문장으로 연결해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "내 자료의 큰 배치",
     "hint": "조건·대상·위치 표시·원인 문장·출처가 친구에게 읽히게 배치하고 실제로 만들어요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진의 크기보다 과학 조건과 근거의 연결을 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "긴 탐구보고서 대신 한 장 자료를 완성하고 교실에서 설명해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-design",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 설명과 보완",
   "title": "친구의 질문으로 근거를 고쳐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "완성한 자료를 교실에서 보여 주며 조건→위치→원인을 설명해요.",
      "친구가 같은 대상과 비교 기준을 찾을 수 있는지 물어봐요.",
      "질문을 받아 빠진 조건이나 위치 근거를 실제로 다시 확인하고 고쳐요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "실제로 보여 준 것과 받은 질문",
     "hint": "아직 못 나누었다면 그 상태와 다음에 물을 질문을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "확인한 근거와 고친 설명",
     "hint": "원기록을 보존하고 수정한 부분·이유·다시 설명한 내용을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예시 문장을 입력한 것만으로 제작·공유를 완료했다고 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "공개 인터넷 게시나 외부 메시지는 기본 과제로 요구하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 정리",
   "title": "관점과 시간 범위로 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "비교",
      "같게 할 기준",
      "주로 연결할 운동"
     ],
     "rows": [
      [
       "같은 날의 태양·별 위치",
       "장소·날짜·방향·대상",
       "자전"
      ],
      [
       "같은 지역의 낮과 밤",
       "고정 광원·축·같은 지역",
       "자전"
      ],
      [
       "같은 시각의 계절별 별자리",
       "장소·시각·방향·확대율",
       "공전"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각과 달라진 근거",
     "hint": "실제 관찰이나 모형·프로그램에서 확인한 근거와 아직 모르는 점을 나누어 써요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시각·지역 차이와 시간에 따른 변화의 근거를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "달의 위상·계절별 기온 원인·별자리 점성술은 이번 핵심 평가에 섞지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 수행평가 A · 6과12-01",
   "title": "같은 날의 위치를 근거로 읽어요",
   "blocks": [
    {
     "type": "text",
     "text": "교사와 정한 안전한 관찰·간접 자료나 프로그램에서 같은 날 두 시각의 태양 또는 별무리 위치를 실제로 비교해요. 어떤 방법을 사용했는지 밝히고 직접 보지 않은 부분을 실제 야외 관측으로 바꾸지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "사용한 방법·자료 종류",
      "장소·날짜·방향과 실제 시각"
     ],
     "rows": [
      [
       "",
       ""
      ],
      [
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "A-1 같은 대상과 위치 차이",
     "hint": "태양이면 안전한 간접 방법, 별무리면 주변 배열과 기준 방향을 함께 표시해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "A-2 규칙성과 더 확인할 것",
     "hint": "두 기록의 위치 변화와 불분명한 조건을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측자와 방위·시각·자료 종류를 실제 과정과 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 정답만 보고 학생이 실제 관측을 마쳤다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment-drawing",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 수행평가 B · 6과12-02",
   "title": "낮과 밤의 모형 근거를 설명해요",
   "blocks": [
    {
     "type": "text",
     "text": "수업의 실제 지구의·고정 광원 장치에서 같은 지역 표시가 빛을 받는지 비교해요. 기울어진 자전축과 광원 조건을 유지한 채 천천히 돌려요."
    },
    {
     "type": "table",
     "heads": [
      "같은 지역의 회전 전/후",
      "실제로 본 직접 빛과 조건"
     ],
     "rows": [
      [
       "",
       ""
      ],
      [
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "B-1 자전과 낮밤 연결",
     "hint": "돌리는 중심·기간과 같은 지역의 빛 받음 변화를 연결해요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "B-2 관점과 모형의 한계",
     "hint": "밖에서 본 조작과 관측자 시선, 실제 천체와 다르게 단순화한 점을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "달이 매일 빛을 가리는 것으로 낮과 밤을 설명하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "예상과 다른 관찰도 보존하고 주변 조명·광원 조건을 다시 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 수행평가 C · 6과12-03",
   "title": "계절별 하늘을 비교해 설명해요",
   "blocks": [
    {
     "type": "text",
     "text": "천체 관측 프로그램에서 서로 다른 두 계절을 실제로 열어 비교해요. 장소·하루 중 시각·방향·확대율을 맞추고 별무리 위치와 배열의 근거를 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "실제 설정·자료",
      "같은 대상·위치 비교 근거"
     ],
     "rows": [
      [
       "계절 A",
       ""
      ],
      [
       "계절 B",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "C-1 지구 공전과 밤의 방향",
     "hint": "별 이름을 나열하는 대신 공전·밤에 바라보는 방향·확인한 위치를 연결해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "C-2 설명 카드 보완",
     "hint": "실제로 받은 질문과 확인/수정한 근거, 아직 이어서 할 일을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사는 실제 프로그램 비교 과정과 자료·설명을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 별자리가 다른 계절에 겹쳐 보인 결과도 그대로 두고 조건으로 설명해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "earth-motion-workbook"
  }
 ],
 "teacherStudentPages": [
  {
   "section": "시작하기",
   "title": "지구의 운동",
   "blocks": [
    {
     "type": "diagram",
     "key": "sun",
     "caption": ""
    },
    {
     "type": "text",
     "text": "하루와 계절에 따라 달라지는 하늘을 관찰하고 지구의 **자전·공전**과 연결해요. 같은 지역의 낮과 밤은 지구의와 광원으로 비교하고, 계절별 별자리는 관측 프로그램에서 조건을 맞춰 찾아요."
    },
    {
     "type": "field",
     "title": "지금 궁금한 것",
     "hint": "이름·학습 날짜를 쓰고 하늘에서 더 알고 싶은 것을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측 조건과 근거에서 출발해 원인을 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "태양은 맨눈이나 쌍안경·망원경으로 직접 보지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "cover",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "차례와 공부 방법",
   "title": "조건에서 근거 있는 설명으로",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "공부할 내용",
      "연습 문항"
     ],
     "rows": [
      [
       "1. 하늘을 읽는 기준",
       "1~16번"
      ],
      [
       "2. 하루 동안 달라지는 태양과 별",
       "17~32번"
      ],
      [
       "3. 움직이는 관측자",
       "33~48번"
      ],
      [
       "4. 낮과 밤을 만드는 빛",
       "49~64번"
      ],
      [
       "5. 하루와 일 년을 구별하기",
       "65~80번"
      ],
      [
       "6. 한밤에 바라보는 방향",
       "81~96번"
      ],
      [
       "7. 조건을 맞춘 별자리 비교",
       "97~112번"
      ],
      [
       "8. 근거로 설명하고 고치기",
       "113~128번"
      ]
     ]
    },
    {
     "type": "text",
     "text": "객관식·복수 선택·빈칸·연결·순서·자료 해석·까닭·그림/설계의 **8형식**을 연습해요. 오른쪽에는 핵심 정리·더 알아보기·내가 정리할 것을 두었어요."
    },
    {
     "type": "field",
     "title": "오늘의 학습 계획",
     "hint": "먼저 확인할 조건과 실제로 해 볼 활동을 정해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 관찰·실험·설명 활동을 각각 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "각 40분의 4차시와 별도 확인 문제 45분의 수업 예시예요. 128문항 연습과 야외 관찰은 여러 시간에 나누어 이어가요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 1 · 하늘을 읽는 기준",
   "title": "하늘을 읽는 기준",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "방위 기준",
       "관측자가 바라보는 방향과 동·서·남·북을 함께 정한 기준"
      ],
      [
       "관측 조건",
       "장소·날짜·시각·바라보는 방향·확대율"
      ],
      [
       "자료 종류",
       "야외 관찰, 천체 관측 프로그램, 교실 모형, 제공된 연습 자료"
      ]
     ]
    },
    {
     "type": "text",
     "text": "하늘의 **왼쪽·오른쪽**만으로는 방위를 알 수 없어요. 관측자가 어디를 바라보는지 먼저 정해요. 이 단원은 우리나라의 같은 장소에서 **남쪽 하늘**을 바라보는 관점으로 시작해요."
    },
    {
     "type": "table",
     "heads": [
      "바라보는 쪽",
      "왼쪽",
      "오른쪽"
     ],
     "rows": [
      [
       "남쪽",
       "동쪽",
       "서쪽"
      ],
      [
       "북쪽",
       "서쪽",
       "동쪽"
      ]
     ]
    },
    {
     "type": "text",
     "text": "나침반이나 지도는 교사와 안전하게 사용해요. 프로그램에서는 화면 아래의 S 표시와 관측 장소·시각을 함께 확인해요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "친구는 남쪽을 보고, 나는 북쪽을 봅니다. 두 사람의 왼쪽이 같은 방위일까요? 바라보는 방향과 함께 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "남쪽을 바라보는 관측자의 왼쪽은 동쪽, 오른쪽은 서쪽이에요."
    },
    {
     "title": "더 알아보기",
     "text": "북쪽을 보는 관측자의 왼쪽과 남쪽을 보는 관측자의 왼쪽은 같은 방위가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 1",
   "title": "하늘을 읽는 기준 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "서울의 남쪽 밤 9시 화면과 부산의 북쪽 새벽 2시 화면을 보고 계절 차이만 말해도 될까요?",
     "steps": [
      [
       "조건 찾기",
       "장소·시각·방향이 함께 달라졌어요."
      ],
      [
       "비교 목적 정하기",
       "계절 차이를 보려면 날짜를 바꾸고 다른 기준은 같게 맞춰요."
      ],
      [
       "근거 남기기",
       "맞춘 조건과 실제로 찾은 별무리 위치를 함께 기록해요."
      ]
     ],
     "answer": "서로 다른 여러 조건을 먼저 맞춘 뒤 계절별 위치를 다시 비교해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "남쪽을 바라보는 관측자의 왼쪽은 동쪽, 오른쪽은 서쪽이에요."
    },
    {
     "title": "더 알아보기",
     "text": "북쪽을 보는 관측자의 왼쪽과 남쪽을 보는 관측자의 왼쪽은 같은 방위가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 1~2",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w001",
      "c22-s61-u04-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 3~4",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w003",
      "c22-s61-u04-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 5~6",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w005",
      "c22-s61-u04-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 7~8",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w007",
      "c22-s61-u04-w008"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 9~10",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w009",
      "c22-s61-u04-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 11",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 12",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 13",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 14",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 15",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하늘을 읽는 기준 · 16",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "방위를 혼동하지 않게 관측자·시선·남쪽 기준을 어떻게 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ① · 방위와 안전",
   "title": "관측자의 기준을 먼저 정해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "nightEnvironment",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "교사와 안전한 관측 장소·시각과 함께할 어른을 정해요.",
      "남쪽을 바라보는 자리를 정하고 주변 기준물과 방위를 확인해요.",
      "야외/간접 자료/프로그램 중 오늘 사용한 방법을 구별해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "준비할 것",
      "나의 실제 계획"
     ],
     "rows": [
      [
       "장소·날짜·시각·함께할 어른",
       ""
      ],
      [
       "바라볼 남쪽과 주변 기준물",
       ""
      ],
      [
       "태양을 직접 보지 않는 안전한 방법",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "다시 확인할 여건",
     "hint": "흐림·가림·이동 안전과 준비가 필요한 것을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "야외 밤 관측은 어른과 안전한 곳에서 해요."
    },
    {
     "title": "더 알아보기",
     "text": "도로·옥상 가장자리나 혼자 밤에 나가는 방법을 쓰지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-safety",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 2 · 하루 동안 달라지는 태양과 별",
   "title": "하루 동안 달라지는 태양과 별",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "하루 위치 변화",
       "같은 날 시각이 달라질 때 보이는 위치의 변화"
      ],
      [
       "같은 별무리",
       "주변 별들의 배열을 근거로 계속 따라보는 대상"
      ],
      [
       "겉보기 이동",
       "관측자에게 움직이는 것처럼 보이는 위치 변화"
      ]
     ]
    },
    {
     "type": "text",
     "text": "우리나라에서 남쪽을 향해 태양 위치를 비교하면 오전에는 **동쪽 쪽**, 오후에는 **서쪽 쪽**으로 달라져요. 태양을 맨눈이나 쌍안경·망원경으로 직접 보지 않고 안전한 간접 자료나 프로그램을 사용해요."
    },
    {
     "type": "text",
     "text": "같은 밤의 별무리도 시각이 지나면 위치가 달라져요. 별 하나의 이름만 바꾸어 고르지 말고 **주변 배열**로 같은 대상을 찾은 뒤 위치를 비교해요."
    },
    {
     "type": "table",
     "heads": [
      "연습 기록",
      "남쪽 기준 위치",
      "배열 표시"
     ],
     "rows": [
      [
       "20:00",
       "왼쪽 쪽",
       "P와 주변 세 별"
      ],
      [
       "22:00",
       "오른쪽 쪽",
       "P와 주변 세 별"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "21시에는 별무리 위치를 읽었지만 22시에는 구름 때문에 못 보았습니다. 남길 기록과 다음에 확인할 방법을 나누어 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 날·자리·방향에서 시각을 바꾸고 같은 대상을 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "서울의 시계 12시에 태양이 항상 정확한 남쪽이나 머리 위에 있는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 2",
   "title": "하루 동안 달라지는 태양과 별 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "표에서 위치가 바뀌었으니 두 시간 만에 별자리 모양도 완전히 바뀐 것일까요?",
     "steps": [
      [
       "같은 대상 확인",
       "배열 표시가 같아서 같은 별무리를 따른 연습 기록이에요."
      ],
      [
       "변한 것 찾기",
       "남쪽 기준 위치가 왼쪽에서 오른쪽 쪽으로 달라졌어요."
      ],
      [
       "주장 구별",
       "위치 변화와 별 배열 자체의 변화를 같은 뜻으로 말하지 않아요."
      ]
     ],
     "answer": "같은 배열의 위치가 달라진 것으로 읽어요. 이 연습표를 실제 관측 결과로 옮겨 쓰지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 날·자리·방향에서 시각을 바꾸고 같은 대상을 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "서울의 시계 12시에 태양이 항상 정확한 남쪽이나 머리 위에 있는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 17~18",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w017",
      "c22-s61-u04-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 19~20",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w019",
      "c22-s61-u04-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 21~22",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w021",
      "c22-s61-u04-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 23~24",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w023",
      "c22-s61-u04-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 25~26",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w025",
      "c22-s61-u04-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 27",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 28",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 29",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 30",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 31",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루 동안 달라지는 태양과 별 · 32",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "같은 별무리를 다시 찾았다는 근거와 위치 변화의 근거를 나누어 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ② · 태양 위치",
   "title": "시각만 바꾼 세 화면을 비교해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sky-sun-09",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-sun-12",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-sun-15",
     "caption": ""
    },
    {
     "type": "text",
     "text": "설정 링크에서 실제 날짜·시각을 확인해요. S를 기준으로 태양 위치를 비교하고, 화면에서 읽은 것을 남겨요. 프로그램을 야외 관측 사진이라고 쓰지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "한국 시각·실제 표시 확인",
      "남쪽 기준 태양의 위치"
     ],
     "rows": [
      [
       "09:00",
       ""
      ],
      [
       "12:00",
       ""
      ],
      [
       "15:00",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "같게 한 것·바꾼 것",
     "hint": "세 화면의 조건과 달라진 위치를 연결해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시각 외의 장소·날짜·방향·확대율을 맞춰요."
    },
    {
     "title": "더 알아보기",
     "text": "링크를 연 뒤 시계 흐름이 멈췄는지와 실제 표시 시각도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-sun",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ③ · 같은 밤의 별",
   "title": "배열로 같은 별무리를 찾아요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sky-spring-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-spring-22",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "같은 날 21시 화면에서 남쪽의 밝은 별과 주변 배열을 골라요.",
      "22시 화면에서 같은 별무리를 배열로 다시 찾아요.",
      "두 화면의 실제 표시 시각과 S 기준 위치를 각각 남겨요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "두 시각의 위치와 같은 대상 표시",
     "hint": "두 칸에 시각·남쪽 기준·별무리 배열과 위치를 표시해요. 불분명하면 그대로 남겨요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "별무리의 모양과 하늘에서의 위치를 나누어 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "야외에서 이어 관찰한다면 어른과 같은 자리·방향에서 보고 프로그램 기록과 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-night",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 3 · 움직이는 관측자",
   "title": "움직이는 관측자",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "자전축",
       "지구가 스스로 도는 중심이 되는 가상의 축"
      ],
      [
       "지표 관측자",
       "지구와 함께 움직이며 하늘을 보는 사람"
      ],
      [
       "모형 밖 관점",
       "교실에서 지구의와 고정 광원을 함께 보는 위치"
      ]
     ]
    },
    {
     "type": "text",
     "text": "지구는 **서쪽에서 동쪽으로** 자전해요. 지구와 함께 움직이는 관측자에게는 태양·별이 반대 방향으로 위치를 바꾸는 것처럼 보여요. 모형 밖에서 고정 광원을 보는 사람과 지구 위 관측자의 설명을 나누어요."
    },
    {
     "type": "table",
     "heads": [
      "정한 관점",
      "설명"
     ],
     "rows": [
      [
       "지표의 동·서 방위",
       "지구가 서쪽에서 동쪽으로 자전"
      ],
      [
       "북극 위에서 지구 중심을 내려다봄",
       "지구가 반시계 방향으로 자전"
      ],
      [
       "지표에서 남쪽 하늘을 봄",
       "하루 동안 동쪽 쪽에서 서쪽 쪽으로 겉보기 위치 변화"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "친구가 지구의 위 표시와 함께 돌면서 전등을 보았습니다. 교실 전등의 실제 위치와 친구에게 보이는 방향을 나누어 설명해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서로 다른 관점에서 본 운동과 겉보기 방향을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "시계·반시계라는 말에는 어디에서 내려다보는지 꼭 붙여요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 3",
   "title": "움직이는 관측자 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "교실 전등은 움직이지 않았는데 지구의 표시가 전등을 보는 방향은 달라졌어요. 두 설명이 모순일까요?",
     "steps": [
      [
       "고정한 대상",
       "전등은 교실의 같은 위치에 있어요."
      ],
      [
       "움직인 대상",
       "지구의와 표시는 축을 중심으로 함께 돌아요."
      ],
      [
       "관점 연결",
       "모형 위 표시가 전등을 바라보는 시선은 달라질 수 있어요."
      ]
     ],
     "answer": "고정한 물체와 움직이는 관측자의 시선을 구별하면 두 설명을 함께 이해할 수 있어요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "서로 다른 관점에서 본 운동과 겉보기 방향을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "시계·반시계라는 말에는 어디에서 내려다보는지 꼭 붙여요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 33~34",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w033",
      "c22-s61-u04-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 35~36",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w035",
      "c22-s61-u04-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 37~39",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w037",
      "c22-s61-u04-w038",
      "c22-s61-u04-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 40~41",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w040",
      "c22-s61-u04-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 42",
   "title": "순서 배열로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 43",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w043"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 44",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 45",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 46",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 47",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w047"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "움직이는 관측자 · 48",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "북극 위 관점과 남쪽 하늘을 보는 관점을 같은 화살표로 섞지 않으려면 무엇을 표시할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ④ · 지구의 준비",
   "title": "광원과 관측자 표시를 맞춰요",
   "blocks": [
    {
     "type": "diagram",
     "key": "model",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "교사가 준비한 안정적인 LED 광원과 기울어진 축의 지구의를 사용해요.",
      "광원은 고정하고 우리나라의 같은 위치에 표시를 붙여요.",
      "지구의 바깥에서 보는 사람과 지구 위 표시의 시선을 구별해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "우리 장치의 조건",
     "hint": "광원 위치·축·같은 지역 표시와 주변 조명을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진의 표시가 실제 우리나라 위치라는 뜻은 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 지구의에서 우리나라 위치를 찾아 표시하고 전선·받침과 눈 보호를 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-setup",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 4 · 낮과 밤을 만드는 빛",
   "title": "낮과 밤을 만드는 빛",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "낮",
       "한 지역이 태양빛을 직접 받는 상태"
      ],
      [
       "밤",
       "한 지역이 태양빛을 직접 받지 않는 상태"
      ],
      [
       "같은 지역의 교대",
       "지구 자전으로 같은 지역이 낮과 밤을 번갈아 지나는 변화"
      ]
     ]
    },
    {
     "type": "text",
     "text": "구형 지구에서 태양을 향한 면과 반대 면은 **직접 빛을 받는지**가 달라요. 같은 순간에도 지구 위 지역에 따라 낮과 밤이 다를 수 있어요."
    },
    {
     "type": "text",
     "text": "지구가 **기울어진 자전축**을 중심으로 하루에 한 바퀴 돌면 같은 지역이 빛 받는 면과 받지 않는 면을 지나가요. 낮과 밤의 하루 교대를 달이 매일 태양을 가리는 일로 설명하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "비교할 것",
      "살필 근거"
     ],
     "rows": [
      [
       "같은 순간의 A와 B",
       "태양을 향한 지역의 방향 차이"
      ],
      [
       "시간이 지난 같은 A",
       "축 중심 회전으로 바뀐 빛 받음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "구름이 낀 낮과 태양 반대쪽을 향한 밤은 모두 어둡게 보일 수 있습니다. 직접 빛과 지구 위 위치를 기준으로 두 상태를 구별해요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공간의 두 지역을 비교하는 것과 같은 지역의 시간 변화를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "주변 조명이나 반사광이 있으면 모형의 어두운 면도 밝아 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 4",
   "title": "낮과 밤을 만드는 빛 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "공 양쪽이 모두 환하게 보였습니다. 지구에는 밤이 없다는 결론을 내려도 될까요?",
     "steps": [
      [
       "관찰 보존",
       "양쪽이 밝게 보인 결과는 그대로 남겨요."
      ],
      [
       "다른 조건 찾기",
       "주변 조명·벽의 반사광과 광원 위치를 확인해요."
      ],
      [
       "다시 비교",
       "안전한 환경에서 직접 빛을 받는 면과 반대 면을 구별해요."
      ]
     ],
     "answer": "모형 조건을 점검하고 다시 비교해요. 원하는 결과로 기록을 고치지 않아요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공간의 두 지역을 비교하는 것과 같은 지역의 시간 변화를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "주변 조명이나 반사광이 있으면 모형의 어두운 면도 밝아 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 49~50",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w049",
      "c22-s61-u04-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 51~52",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w051",
      "c22-s61-u04-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 53~54",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w053",
      "c22-s61-u04-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 55~56",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w055",
      "c22-s61-u04-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 57~58",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w057",
      "c22-s61-u04-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 59",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w059"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 60",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 61",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w061"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 62",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 63",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w063"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "낮과 밤을 만드는 빛 · 64",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "A가 낮에서 밤으로 바뀐 이유와 처음 A/B가 달랐던 이유를 각각 써요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑤ · 자전과 낮밤",
   "title": "같은 지역이 받는 빛을 따라가요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "태양 모형에 해당하는 광원은 움직이지 않아요.",
      "기울어진 축을 유지하며 지구의를 서쪽에서 동쪽으로 천천히 돌려요.",
      "같은 지역 표시가 직접 빛을 받는 면과 반대 면을 지나는지 살펴요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "회전 과정·같은 지역",
      "실제로 본 직접 빛·주변 조명"
     ],
     "rows": [
      [
       "처음",
       ""
      ],
      [
       "천천히 돌린 뒤",
       ""
      ],
      [
       "한 바퀴 뒤",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "근거로 설명하기",
     "hint": "실제 관찰한 변화와 낮·밤을 연결해요. 예상과 달랐다면 조건도 확인해요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 순간 두 지역의 차이와 같은 지역의 시간 변화를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "주변 조명·반사광이 영향을 주었는지 함께 확인하고 원래 관찰을 고치지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-rotation",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 5 · 하루와 일 년을 구별하기",
   "title": "하루와 일 년을 구별하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "자전",
       "기울어진 자전축을 중심으로 하루에 한 바퀴 도는 운동"
      ],
      [
       "공전",
       "태양 둘레를 일 년에 한 바퀴 도는 운동"
      ],
      [
       "비교의 시간 범위",
       "같은 날 시각 차이인지 서로 다른 계절의 날짜 차이인지"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "운동",
      "도는 중심",
      "한 바퀴의 기간",
      "연결할 현상"
     ],
     "rows": [
      [
       "자전",
       "자전축",
       "하루",
       "태양·별의 하루 겉보기 위치, 낮과 밤"
      ],
      [
       "공전",
       "태양",
       "일 년",
       "계절에 따라 밤에 바라보는 방향 차이"
      ]
     ]
    },
    {
     "type": "text",
     "text": "중심이 다르면 운동의 이름도 달라요. 하루에 태양 둘레를 한 바퀴 돈다고 하거나, 자전축을 중심으로 일 년에 한 바퀴 돈다고 바꾸어 말하지 않아요."
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "“태양 둘레를 하루에 한 바퀴 도는 자전”이라는 문장에서 도는 중심과 기간을 다시 확인해 고쳐요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "운동 이름을 고르기 전에 도는 중심과 설명할 시간 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자전과 공전은 함께 일어나요. 수업의 비교 목적에 따라 주목하는 관계를 나누어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 5",
   "title": "하루와 일 년을 구별하기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "가: 같은 날 21시와 22시. 나: 3월과 9월 같은 21시. 시각 조건의 역할은 같을까요?",
     "steps": [
      [
       "가의 목적",
       "하루 위치 변화를 보려고 시각을 달리해요."
      ],
      [
       "나의 목적",
       "계절 차이를 보려고 하루 중 시각을 같게 해요."
      ],
      [
       "다른 기준",
       "두 비교 모두 장소·방향·확대율과 따라볼 대상을 확인해요."
      ]
     ],
     "answer": "가에서는 시각을 바꾸고 자전과, 나에서는 날짜를 바꾸고 공전과 연결해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "운동 이름을 고르기 전에 도는 중심과 설명할 시간 범위를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "자전과 공전은 함께 일어나요. 수업의 비교 목적에 따라 주목하는 관계를 나누어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 65~66",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w065",
      "c22-s61-u04-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 67~68",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w067",
      "c22-s61-u04-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 69~70",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w069",
      "c22-s61-u04-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 71~72",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w071",
      "c22-s61-u04-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 73~74",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w073",
      "c22-s61-u04-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 75",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w075"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 76",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 77",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 78",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 79",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "하루와 일 년을 구별하기 · 80",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "내가 읽은 자료에서 같게 한 조건과 달리한 조건을 먼저 표시해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 6 · 한밤에 바라보는 방향",
   "title": "한밤에 바라보는 방향",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "한밤의 정면",
       "지구의 관측자 표시가 태양 반대쪽 바깥을 향하는 시선"
      ],
      [
       "고정 별 카드",
       "수업 중 위치를 옮기지 않는 먼 별의 모형"
      ],
      [
       "지구 위치 변화",
       "태양 둘레에서 지구의를 다른 곳으로 옮기는 조작"
      ]
     ]
    },
    {
     "type": "text",
     "text": "태양 모형과 바깥 별 카드는 고정해요. 지구의를 태양 둘레 다른 위치로 옮긴 뒤 매번 **한밤 시선**을 다시 맞춰요. 지구에서 중앙 태양을 보는 방향의 **반대쪽 바깥**에 있는 카드를 읽어요."
    },
    {
     "type": "table",
     "heads": [
      "지구 위치",
      "지구에서 본 태양 쪽",
      "한밤 정면"
     ],
     "rows": [
      [
       "태양 왼쪽",
       "오른쪽",
       "왼쪽 바깥"
      ],
      [
       "태양 오른쪽",
       "왼쪽",
       "오른쪽 바깥"
      ],
      [
       "태양 위쪽",
       "아래쪽",
       "위쪽 바깥"
      ],
      [
       "태양 아래쪽",
       "위쪽",
       "아래쪽 바깥"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "지구의를 태양 왼쪽에 놓았습니다. 지구에서 태양이 있는 방향과 한밤 정면 방향을 각각 말로 써요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지구 위치에서 태양 방향을 먼저 읽고 그 반대인 한밤 시선을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "카드 하나가 실제 밤하늘 전체는 아니며 실제 천체의 거리·크기를 같은 비율로 재현한 것도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 6",
   "title": "한밤에 바라보는 방향 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "지구의가 태양 아래쪽에 있어요. 한밤의 관측자가 태양 쪽 카드를 고른 답을 어떻게 점검할까요?",
     "steps": [
      [
       "지구 기준 읽기",
       "태양은 지구의 위쪽에 있어요."
      ],
      [
       "반대 시선 찾기",
       "한밤의 정면은 아래쪽 바깥이에요."
      ],
      [
       "발문 재확인",
       "보이는 정면을 물었는지 보기 어려운 방향을 물었는지 확인해요."
      ]
     ],
     "answer": "태양 방향과 반대인 아래쪽 바깥의 카드를 읽어요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "지구 위치에서 태양 방향을 먼저 읽고 그 반대인 한밤 시선을 찾아요."
    },
    {
     "title": "더 알아보기",
     "text": "카드 하나가 실제 밤하늘 전체는 아니며 실제 천체의 거리·크기를 같은 비율로 재현한 것도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 81~82",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w081",
      "c22-s61-u04-w082"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 83~84",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w083",
      "c22-s61-u04-w084"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 85~86",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w085",
      "c22-s61-u04-w086"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 87",
   "title": "연결하기로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w087"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 88~89",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w088",
      "c22-s61-u04-w089"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 90",
   "title": "순서 배열로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 91",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w091"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 92",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 93",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w093"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 94",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 95",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w095"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "한밤에 바라보는 방향 · 96",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "태양의 위치와 한밤의 정면을 혼동하지 않는 설명 문장을 만들어요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑥ · 공전 모형",
   "title": "별 카드는 고정하고 지구를 옮겨요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "태양 모형은 중앙, 서로 다른 이름의 별 카드 네 장은 바깥에 고정해요.",
      "지구의를 네 위치로 옮긴 뒤 매번 같은 표시를 태양 반대쪽으로 돌려 한밤 시선을 맞춰요.",
      "지구 위치·태양 방향·한밤 정면 카드를 각각 기록해요."
     ],
     "ordered": true
    },
    {
     "type": "table",
     "heads": [
      "지구의 실제 배치",
      "태양을 보는 방향",
      "한밤 정면 카드"
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
      ],
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
     "title": "고정한 것과 바꾼 것",
     "hint": "달라진 정면 카드를 공전과 연결하고 모형의 한계도 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "태양과 별 카드의 위치를 수업 중 바꾸지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "카드의 거리·크기·보이는 범위는 실제 밤하늘과 같지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-orbit",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 7 · 조건을 맞춘 별자리 비교",
   "title": "조건을 맞춘 별자리 비교",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "계절 비교",
       "장소·하루 중 시각·방향·확대율을 맞추고 날짜를 바꾼 비교"
      ],
      [
       "대표 별자리",
       "그 계절에 보기 좋은 별자리의 예"
      ],
      [
       "프로그램 설정과 결과",
       "열기 전 정한 조건과 실제 화면에서 확인한 위치의 구별"
      ]
     ]
    },
    {
     "type": "text",
     "text": "서울의 남쪽 하늘을 같은 **한국 시각 21시**와 확대율로 맞추고3·6·9·12월을 비교해요. 날짜별로 어떤 별무리 배열과 위치가 달라졌는지 실제 화면에서 찾아요."
    },
    {
     "type": "text",
     "text": "지구가 공전하면 밤에 바라보는 우주 방향이 달라져요. 여러 별자리가 함께 보일 수 있으며 계절마다 모든 별자리가 완전히 교체되는 것은 아니에요. 별자리 이름 암기보다 **위치와 관찰 조건**으로 설명해요."
    },
    {
     "type": "table",
     "heads": [
      "기록",
      "확인할 내용"
     ],
     "rows": [
      [
       "설정 목록",
       "장소·날짜·시각·방향·확대율"
      ],
      [
       "실제 화면 기록",
       "찾은 별무리와 주변 배열·기준에 대한 위치"
      ],
      [
       "아직 불분명",
       "구름·가림·화면 표시 등 확인하지 못한 상태"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "같은 별무리가 봄의 한밤과 여름의 새벽에 모두 보인 기록이 있습니다. 대표 계절과 관측 시각의 관계를 어떻게 설명할까요?",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건 목록만 적은 것을 관찰 결과로 바꾸지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "대표 계절이 있더라도 다른 계절의 다른 시각에 같은 별자리가 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 7",
   "title": "조건을 맞춘 별자리 비교 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "두 계절 화면의 별 점 개수가 달라요. 공전 속도가 바뀌었다는 근거일까요?",
     "steps": [
      [
       "가시성 조건",
       "달 밝기·대기 표시·확대율 등도 살펴요."
      ],
      [
       "같은 대상 찾기",
       "이름표 숫자 대신 같은 별무리의 배열과 위치를 비교해요."
      ],
      [
       "설명 범위",
       "점 개수 하나로 공전 중단이나 속도 변화를 결정하지 않아요."
      ]
     ],
     "answer": "비교 조건과 별무리 위치를 근거로 공전과 밤의 시선 관계를 설명해요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건 목록만 적은 것을 관찰 결과로 바꾸지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "대표 계절이 있더라도 다른 계절의 다른 시각에 같은 별자리가 보일 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 97~98",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w097",
      "c22-s61-u04-w098"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 99~100",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w099",
      "c22-s61-u04-w100"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 101~102",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w101",
      "c22-s61-u04-w102"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 103~104",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w103",
      "c22-s61-u04-w104"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 105~106",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w105",
      "c22-s61-u04-w106"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 107",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 108",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w108"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 109",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 110",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w110"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 111",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "조건을 맞춘 별자리 비교 · 112",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w112"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건은 맞췄지만 실제 위치 기록이 빠진 자료에 무엇을 보완할까요?",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 계절 비교",
   "title": "같은 한국 시각 21시로 맞춰요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sky-spring-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-summer-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-autumn-21",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "sky-winter-21",
     "caption": ""
    },
    {
     "type": "text",
     "text": "서울·남쪽·같은 확대율과 별자리 표시 상태를 맞춰요. 실제 화면에서 같은 별무리 배열과 위치를 비교하고 겹쳐 보이는 대상도 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "실제 표시 날짜·시각",
      "남쪽 기준 별무리·위치"
     ],
     "rows": [
      [
       "3월",
       ""
      ],
      [
       "6월",
       ""
      ],
      [
       "9월",
       ""
      ],
      [
       "12월",
       ""
      ]
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설정 목록과 실제로 읽은 위치 결과를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "기기 시간대와 프로그램의 시간 흐름·표시 설정을 함께 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-seasons",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑦ · 계절 비교의 근거",
   "title": "두 화면의 차이를 설명해요",
   "blocks": [
    {
     "type": "field",
     "title": "선택한 두 화면과 조건",
     "hint": "실제 날짜·시각·장소·방향·확대율을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "같은 배열과 달라진 위치",
     "hint": "같은 대상이라고 찾은 근거와 위치 차이를 크게 표시해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "지구의 운동과 연결",
     "hint": "공전과 밤에 바라보는 방향을 연결하되 실제 자료가 말한 범위 안에서 설명해요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "별자리 이름보다 위치·조건과 그 까닭을 중심으로 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "한 별자리가 다른 계절에는 절대로 안 보인다고 단정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-season-evidence",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "개념 8 · 근거로 설명하고 고치기",
   "title": "근거로 설명하고 고치기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "낱말",
      "이번 공부에서의 뜻"
     ],
     "rows": [
      [
       "주장",
       "비교에서 알게 된 것을 설명한 문장"
      ],
      [
       "근거",
       "조건이 밝혀진 실제 위치 차이와 같은 대상임을 찾은 표시"
      ],
      [
       "설명 보완",
       "질문을 받아 조건이나 근거를 다시 확인해 고치는 일"
      ]
     ]
    },
    {
     "type": "text",
     "text": "짧은 한 장에도 **대상·조건·위치·원인**의 연결이 보여야 해요. 직접 본 자료와 프로그램·모형·제공 자료를 구별하고 출처를 밝히세요."
    },
    {
     "type": "text",
     "text": "친구가 “시각이 다르다”고 질문하면 원기록을 확인하고 조건을 맞춰 실제로 다시 살펴요. 처음 자료를 몰래 고치거나, 관찰하지 못한 위치를 예상으로 채우지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "카드에서 볼 부분",
      "스스로 점검할 질문"
     ],
     "rows": [
      [
       "조건",
       "언제·어디에서·어느 방향을 보았나요?"
      ],
      [
       "대상과 위치",
       "같은 별무리임을 찾은 표시가 있나요?"
      ],
      [
       "원인",
       "하루/계절 비교와 자전/공전이 맞게 이어졌나요?"
      ],
      [
       "나눔과 보완",
       "실제로 들은 질문과 고친 부분은 무엇인가요?"
      ]
     ]
    },
    {
     "type": "field",
     "title": "개념 한 문장 점검",
     "hint": "친구가 두 화면의 방향이 다르다고 질문했습니다. 원기록 확인부터 설명 보완까지 실제로 이어서 할 일을 적어요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측 조건 → 달라진 위치 → 지구의 운동을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항을 맞힌 것과 실제 관측·모형 조작·자료 제작·설명을 마친 것은 각각 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "concept",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "함께 생각하기 8",
   "title": "근거로 설명하고 고치기 · 조건으로 풀기",
   "blocks": [
    {
     "type": "example",
     "question": "사진은 크지만 날짜·시각·기준 방향과 실제 위치 표시가 없어요. 어떤 순서로 고칠까요?",
     "steps": [
      [
       "자료로 돌아가기",
       "사용한 자료 종류와 원래 조건을 확인해요."
      ],
      [
       "근거 붙이기",
       "실제로 찾은 대상·배열·위치를 표시해요."
      ],
      [
       "설명 다시 나누기",
       "이번 비교와 관련된 운동을 설명하고 질문을 받아 보완해요."
      ]
     ],
     "answer": "크게 꾸미기보다 친구가 조건과 근거를 따라 읽을 수 있게 고쳐요."
    },
    {
     "type": "field",
     "title": "내 말로 다시 설명하기",
     "hint": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측 조건 → 달라진 위치 → 지구의 운동을 이어 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "문항을 맞힌 것과 실제 관측·모형 조작·자료 제작·설명을 마친 것은 각각 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "worked",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 113~114",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w113",
      "c22-s61-u04-w114"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 115~116",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w115",
      "c22-s61-u04-w116"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 117~118",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w117",
      "c22-s61-u04-w118"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 119~120",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w119",
      "c22-s61-u04-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 121~122",
   "title": "조건을 읽고 여러 형식으로 풀어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w121",
      "c22-s61-u04-w122"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 123",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 124",
   "title": "자료 해석으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w124"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 125",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 126",
   "title": "까닭 설명으로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w126"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 127",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "근거로 설명하고 고치기 · 128",
   "title": "그림·설계로 확인해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s61-u04-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "발문이 묻는 대상·관점·시간 범위부터 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "제공 자료에서 읽은 것과 실제로 해 본 일을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "아직 확인하지 못한 부분은 다음 질문으로 남기고 실제로 한 일과 구별해요.",
     "write": 5
    }
   ],
   "kind": "practice",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑧ · 설명 카드",
   "title": "조건·위치·원인이 이어지는 한 장",
   "blocks": [
    {
     "type": "diagram",
     "key": "cardMaterials",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "실제로 확인한 두 관측 자료를 고르고 자료 종류와 출처를 밝혀요.",
      "장소·날짜·시각·방향과 같은 별무리를 찾은 표시를 넣어요.",
      "달라진 위치와 자전/공전의 관계를 한 문장으로 연결해요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "내 자료의 큰 배치",
     "hint": "조건·대상·위치 표시·원인 문장·출처가 친구에게 읽히게 배치하고 실제로 만들어요.",
     "lines": 3,
     "draw": true
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "사진의 크기보다 과학 조건과 근거의 연결을 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "긴 탐구보고서 대신 한 장 자료를 완성하고 교실에서 설명해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-design",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "실제 활동 ⑨ · 설명과 보완",
   "title": "친구의 질문으로 근거를 고쳐요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "완성한 자료를 교실에서 보여 주며 조건→위치→원인을 설명해요.",
      "친구가 같은 대상과 비교 기준을 찾을 수 있는지 물어봐요.",
      "질문을 받아 빠진 조건이나 위치 근거를 실제로 다시 확인하고 고쳐요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "실제로 보여 준 것과 받은 질문",
     "hint": "아직 못 나누었다면 그 상태와 다음에 물을 질문을 적어요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "확인한 근거와 고친 설명",
     "hint": "원기록을 보존하고 수정한 부분·이유·다시 설명한 내용을 써요.",
     "lines": 7,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예시 문장을 입력한 것만으로 제작·공유를 완료했다고 정하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "공개 인터넷 게시나 외부 메시지는 기본 과제로 요구하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "activity-share",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 정리",
   "title": "관점과 시간 범위로 연결해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "비교",
      "같게 할 기준",
      "주로 연결할 운동"
     ],
     "rows": [
      [
       "같은 날의 태양·별 위치",
       "장소·날짜·방향·대상",
       "자전"
      ],
      [
       "같은 지역의 낮과 밤",
       "고정 광원·축·같은 지역",
       "자전"
      ],
      [
       "같은 시각의 계절별 별자리",
       "장소·시각·방향·확대율",
       "공전"
      ]
     ]
    },
    {
     "type": "field",
     "title": "처음 생각과 달라진 근거",
     "hint": "실제 관찰이나 모형·프로그램에서 확인한 근거와 아직 모르는 점을 나누어 써요.",
     "lines": 8,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 시각·지역 차이와 시간에 따른 변화의 근거를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "달의 위상·계절별 기온 원인·별자리 점성술은 이번 핵심 평가에 섞지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "learn",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 수행평가 A · 6과12-01",
   "title": "같은 날의 위치를 근거로 읽어요",
   "blocks": [
    {
     "type": "text",
     "text": "교사와 정한 안전한 관찰·간접 자료나 프로그램에서 같은 날 두 시각의 태양 또는 별무리 위치를 실제로 비교해요. 어떤 방법을 사용했는지 밝히고 직접 보지 않은 부분을 실제 야외 관측으로 바꾸지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "사용한 방법·자료 종류",
      "장소·날짜·방향과 실제 시각"
     ],
     "rows": [
      [
       "",
       ""
      ],
      [
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "A-1 같은 대상과 위치 차이",
     "hint": "태양이면 안전한 간접 방법, 별무리면 주변 배열과 기준 방향을 함께 표시해요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "field",
     "title": "A-2 규칙성과 더 확인할 것",
     "hint": "두 기록의 위치 변화와 불분명한 조건을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관측자와 방위·시각·자료 종류를 실제 과정과 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진이나 정답만 보고 학생이 실제 관측을 마쳤다고 정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment-drawing",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 수행평가 B · 6과12-02",
   "title": "낮과 밤의 모형 근거를 설명해요",
   "blocks": [
    {
     "type": "text",
     "text": "수업의 실제 지구의·고정 광원 장치에서 같은 지역 표시가 빛을 받는지 비교해요. 기울어진 자전축과 광원 조건을 유지한 채 천천히 돌려요."
    },
    {
     "type": "table",
     "heads": [
      "같은 지역의 회전 전/후",
      "실제로 본 직접 빛과 조건"
     ],
     "rows": [
      [
       "",
       ""
      ],
      [
       "",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "B-1 자전과 낮밤 연결",
     "hint": "돌리는 중심·기간과 같은 지역의 빛 받음 변화를 연결해요.",
     "lines": 7,
     "draw": false
    },
    {
     "type": "field",
     "title": "B-2 관점과 모형의 한계",
     "hint": "밖에서 본 조작과 관측자 시선, 실제 천체와 다르게 단순화한 점을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "달이 매일 빛을 가리는 것으로 낮과 밤을 설명하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "예상과 다른 관찰도 보존하고 주변 조명·광원 조건을 다시 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "section": "단원 수행평가 C · 6과12-03",
   "title": "계절별 하늘을 비교해 설명해요",
   "blocks": [
    {
     "type": "text",
     "text": "천체 관측 프로그램에서 서로 다른 두 계절을 실제로 열어 비교해요. 장소·하루 중 시각·방향·확대율을 맞추고 별무리 위치와 배열의 근거를 남겨요."
    },
    {
     "type": "table",
     "heads": [
      "실제 설정·자료",
      "같은 대상·위치 비교 근거"
     ],
     "rows": [
      [
       "계절 A",
       ""
      ],
      [
       "계절 B",
       ""
      ]
     ]
    },
    {
     "type": "field",
     "title": "C-1 지구 공전과 밤의 방향",
     "hint": "별 이름을 나열하는 대신 공전·밤에 바라보는 방향·확인한 위치를 연결해요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "field",
     "title": "C-2 설명 카드 보완",
     "hint": "실제로 받은 질문과 확인/수정한 근거, 아직 이어서 할 일을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "교사는 실제 프로그램 비교 과정과 자료·설명을 함께 봐요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 별자리가 다른 계절에 겹쳐 보인 결과도 그대로 두고 조건으로 설명해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ],
   "kind": "assessment",
   "lead": "",
   "layout": "earth-motion-workbook"
  },
  {
   "kind": "duplex-blank",
   "layout": "earth-motion-workbook"
  }
 ],
 "teacherPages": [
  {
   "section": "정답·해설 1~3",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w001",
      "c22-s61-u04-w002",
      "c22-s61-u04-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 4~6",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w004",
      "c22-s61-u04-w005",
      "c22-s61-u04-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 7~9",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w007",
      "c22-s61-u04-w008",
      "c22-s61-u04-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 10~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w010",
      "c22-s61-u04-w011",
      "c22-s61-u04-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 13~14",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w013",
      "c22-s61-u04-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 15~17",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w015",
      "c22-s61-u04-w016",
      "c22-s61-u04-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 18~20",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w018",
      "c22-s61-u04-w019",
      "c22-s61-u04-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 21~23",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w021",
      "c22-s61-u04-w022",
      "c22-s61-u04-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 24~26",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w024",
      "c22-s61-u04-w025",
      "c22-s61-u04-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 27~28",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w027",
      "c22-s61-u04-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 29~30",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w029",
      "c22-s61-u04-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 31~32",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w031",
      "c22-s61-u04-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 33~35",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w033",
      "c22-s61-u04-w034",
      "c22-s61-u04-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 36~38",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w036",
      "c22-s61-u04-w037",
      "c22-s61-u04-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 39~41",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w039",
      "c22-s61-u04-w040",
      "c22-s61-u04-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 42~44",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w042",
      "c22-s61-u04-w043",
      "c22-s61-u04-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 45~46",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w045",
      "c22-s61-u04-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 47~49",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w047",
      "c22-s61-u04-w048",
      "c22-s61-u04-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 50~52",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w050",
      "c22-s61-u04-w051",
      "c22-s61-u04-w052"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 53~55",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w053",
      "c22-s61-u04-w054",
      "c22-s61-u04-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 56~58",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w056",
      "c22-s61-u04-w057",
      "c22-s61-u04-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 59~60",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w059",
      "c22-s61-u04-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 61~62",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w061",
      "c22-s61-u04-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 63~65",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w063",
      "c22-s61-u04-w064",
      "c22-s61-u04-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 66~68",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w066",
      "c22-s61-u04-w067",
      "c22-s61-u04-w068"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 69~71",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w069",
      "c22-s61-u04-w070",
      "c22-s61-u04-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 72~74",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w072",
      "c22-s61-u04-w073",
      "c22-s61-u04-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 75~76",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w075",
      "c22-s61-u04-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 77~78",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w077",
      "c22-s61-u04-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 79~81",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w079",
      "c22-s61-u04-w080",
      "c22-s61-u04-w081"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 82~84",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w082",
      "c22-s61-u04-w083",
      "c22-s61-u04-w084"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 85~87",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w085",
      "c22-s61-u04-w086",
      "c22-s61-u04-w087"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 88~90",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w088",
      "c22-s61-u04-w089",
      "c22-s61-u04-w090"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 91~92",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w091",
      "c22-s61-u04-w092"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 93~94",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w093",
      "c22-s61-u04-w094"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 95~96",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w095",
      "c22-s61-u04-w096"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 97~99",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w097",
      "c22-s61-u04-w098",
      "c22-s61-u04-w099"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 100~102",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w100",
      "c22-s61-u04-w101",
      "c22-s61-u04-w102"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 103~105",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w103",
      "c22-s61-u04-w104",
      "c22-s61-u04-w105"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 106~107",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w106",
      "c22-s61-u04-w107"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 108~109",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w108",
      "c22-s61-u04-w109"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 110~111",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w110",
      "c22-s61-u04-w111"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 112~114",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w112",
      "c22-s61-u04-w113",
      "c22-s61-u04-w114"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 115~117",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w115",
      "c22-s61-u04-w116",
      "c22-s61-u04-w117"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 118~120",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w118",
      "c22-s61-u04-w119",
      "c22-s61-u04-w120"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 121~123",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w121",
      "c22-s61-u04-w122",
      "c22-s61-u04-w123"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 124~125",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w124",
      "c22-s61-u04-w125"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 126~127",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w126",
      "c22-s61-u04-w127"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "정답·해설 128~128",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s61-u04-w128"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 의미가 같은 다른 타당한 표현도 인정해요."
    },
    {
     "title": "더 알아보기",
     "text": "열린 답의 문장 유사도만으로 실제 관측·모형 조작·설명을 완료했다고 판단하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 ·6과12-01",
   "title": "하루 위치 관찰 확인",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "사용한 실제 방법·대상·장소·날짜·시각·남쪽 기준을 확인한다. 별무리는 주변 배열로 같은 대상을 찾은 근거와 위치 차이를 나눈다. 태양 직접 관찰을 지시하지 않는다. 간접 자료/프로그램/실제 야외 관찰을 구별해 평가하고 불분명한 상태를 보존한다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "실제로 확인한 수행 근거와 아직 확인하지 못한 부분을 나누어 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 확인은 서로 다른 근거로 남겨요."
    },
    {
     "title": "더 알아보기",
     "text": "공식 학교 성적을 자동으로 확정하는 표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 ·6과12-02",
   "title": "자전과 낮밤 모형 확인",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "고정 광원·기울어진 자전축·같은 지역의 표시와 실제 조작을 확인한다. 같은 순간의 지역 간 차이와 시간에 따른 같은 지역의 변화를 구별한다. 북극 위에서 내려다본다는 조건 없이 반시계만 말하게 하지 않는다. 주변 광원·반사광과 실제 관찰의 범위를 살핀다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "실제로 확인한 수행 근거와 아직 확인하지 못한 부분을 나누어 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 확인은 서로 다른 근거로 남겨요."
    },
    {
     "title": "더 알아보기",
     "text": "공식 학교 성적을 자동으로 확정하는 표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "수행평가 지도 ·6과12-03",
   "title": "계절별 별자리 비교 확인",
   "kind": "answers",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "text",
     "text": "천체 관측 프로그램을 실제로 사용하며 장소·하루 중 시각·방향·확대율을 맞췄는지 확인한다. 설정 목록과 실제 읽은 별무리 위치를 구별하고 공전/밤의 시선으로 설명하는지 본다. 명칭 암기와 계절별 완전 교체 주장을 핵심 기준으로 쓰지 않는다."
    },
    {
     "type": "field",
     "title": "교사 관찰과 다음 지도",
     "hint": "실제로 확인한 수행 근거와 아직 확인하지 못한 부분을 나누어 남겨요.",
     "lines": 10,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문항 정답과 실제 수행 확인은 서로 다른 근거로 남겨요."
    },
    {
     "title": "더 알아보기",
     "text": "공식 학교 성적을 자동으로 확정하는 표가 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  }
 ],
 "quickPages": [
  {
   "section": "빠른 정답표",
   "title": "1~24번",
   "kind": "quick",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "earth-quick-0",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "서술·자료 해석·그림의 인정 기준은 정답·해설에서 읽고 실제 활동은 따로 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "25~48번",
   "kind": "quick",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "earth-quick-24",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "서술·자료 해석·그림의 인정 기준은 정답·해설에서 읽고 실제 활동은 따로 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "49~72번",
   "kind": "quick",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "earth-quick-48",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "서술·자료 해석·그림의 인정 기준은 정답·해설에서 읽고 실제 활동은 따로 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "73~96번",
   "kind": "quick",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "earth-quick-72",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "서술·자료 해석·그림의 인정 기준은 정답·해설에서 읽고 실제 활동은 따로 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "97~120번",
   "kind": "quick",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "earth-quick-96",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "서술·자료 해석·그림의 인정 기준은 정답·해설에서 읽고 실제 활동은 따로 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  },
  {
   "section": "빠른 정답표",
   "title": "121~128번",
   "kind": "quick",
   "layout": "earth-motion-workbook",
   "blocks": [
    {
     "type": "diagram",
     "key": "earth-quick-120",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "번호와 응답 형식을 함께 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "서술·자료 해석·그림의 인정 기준은 정답·해설에서 읽고 실제 활동은 따로 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "이번 비교에서 같게 한 것·바꾼 것과 내 근거를 적어요.",
     "write": 5
    }
   ]
  }
 ],
 "figures": {
  "sun": "<div class=\"earth-book-photo\"><img src=\"../assets/activities/c22-s42-u01/sun-PIA17669.jpg\" alt=\"SDO 관측 장비로 얻은 태양 자료\" loading=\"eager\"><p class=\"earth-book-photo-caption\">관측 장비로 얻은 자료예요. 맨눈으로 보이는 색이나 오늘 태양의 위치를 나타내지 않아요.<small>NASA/SDO/AIA · PIA17669 · 2013-03-28 관측 · science.nasa.gov/resource/pulses-from-the-sun/</small></p></div>",
  "model": "<div class=\"earth-book-photo\"><img src=\"../assets/activities/c22-s61-u04/model-preparation.webp\" alt=\"LED 광원과 빨간 표시가 있는 흰 공을 받침에 놓은 준비 예\" loading=\"eager\"><p class=\"earth-book-photo-caption\">광원과 공을 놓는 준비 참고예요. 실제 수업에서는 기울어진 축이 있는 지구의를 써요. 축 각도·낮밤 경계나 실험 결과를 이 그림으로 판단하지 않아요.<small>준비 배치 참고 자료 · 우리 반 실제 실험 사진이 아니에요.</small></p></div>",
  "nightEnvironment": "<div class=\"earth-book-photo\"><img src=\"../assets/activities/c22-s61-u04/night-environment.webp\" alt=\"어른과 아이들이 넓은 평지에서 하늘을 살펴보는 환경 준비 예\" loading=\"eager\"><p class=\"earth-book-photo-caption\">어른과 함께 안전한 관측 장소를 정해요. 사진의 별 점으로 실제 별자리 위치나 관측 시각을 판단하지 않아요.<small>관찰 환경 준비 참고 · 우리 반의 실제 야외 관측 사진이 아니에요.</small></p></div>",
  "cardMaterials": "<div class=\"earth-book-photo\"><img src=\"../assets/activities/c22-s61-u04/card-materials.webp\" alt=\"빈 종이 두 장과 연필을 책상에 놓은 설명 카드 준비 예\" loading=\"eager\"><p class=\"earth-book-photo-caption\">조건·위치·원인을 담을 한 장 자료를 준비해요. 아직 완성한 자료나 실제 설명 활동의 결과가 아니에요.<small>빈 종이와 연필 준비 참고 · 내 근거로 실제 자료를 만들고 설명해요.</small></p></div>",
  "sky-sun-09": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-sun-09-qr.png\" alt=\"오전 9시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-03-21T00%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">오전 9시 설정 열기 ↗</a><p>2026-03-21 · 한국 시각 09:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "sky-sun-12": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-sun-12-qr.png\" alt=\"낮 12시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-03-21T03%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">낮 12시 설정 열기 ↗</a><p>2026-03-21 · 한국 시각 12:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "sky-sun-15": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-sun-15-qr.png\" alt=\"오후 3시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-03-21T06%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">오후 3시 설정 열기 ↗</a><p>2026-03-21 · 한국 시각 15:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "sky-spring-21": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-spring-21-qr.png\" alt=\"3월 21일 · 밤 9시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-03-21T12%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">3월 21일 · 밤 9시 설정 열기 ↗</a><p>2026-03-21 · 한국 시각 21:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "sky-spring-22": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-spring-22-qr.png\" alt=\"3월 21일 · 밤 10시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-03-21T13%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">3월 21일 · 밤 10시 설정 열기 ↗</a><p>2026-03-21 · 한국 시각 22:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "sky-summer-21": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-summer-21-qr.png\" alt=\"6월 21일 · 밤 9시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-06-21T12%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">6월 21일 · 밤 9시 설정 열기 ↗</a><p>2026-06-21 · 한국 시각 21:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "sky-autumn-21": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-autumn-21-qr.png\" alt=\"9월 21일 · 밤 9시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-09-21T12%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">9월 21일 · 밤 9시 설정 열기 ↗</a><p>2026-09-21 · 한국 시각 21:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "sky-winter-21": "<div class=\"earth-book-link\"><img src=\"../assets/activities/c22-s61-u04/sky-winter-21-qr.png\" alt=\"12월 21일 · 밤 9시 설정 QR\" width=\"160\" height=\"160\"><div><a href=\"https://stellarium-web.org/?lat=37.56668&amp;lng=126.97829&amp;date=2026-12-21T12%3A00%3A00Z&amp;az=180&amp;alt=30&amp;fov=100\" target=\"_blank\" rel=\"noopener noreferrer\">12월 21일 · 밤 9시 설정 열기 ↗</a><p>2026-12-21 · 한국 시각 21:00 · 서울 · 남쪽 · 같은 확대율</p></div></div>",
  "earth-question-data-11": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">기록</th><th scope=\"col\">장소</th><th scope=\"col\">날짜</th><th scope=\"col\">시각</th><th scope=\"col\">방향</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>서울</td><td>3월 21일</td><td>21:00</td><td>남쪽</td></tr><tr><th scope=\"row\">B</th><td>부산</td><td>9월 21일</td><td>23:00</td><td>남쪽</td></tr></tbody></table>",
  "earth-question-data-12": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">기록</th><th scope=\"col\">남긴 내용</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>프로그램에서 밝은 별이 오른쪽에 보였다.</td></tr><tr><th scope=\"row\">나</th><td>서울·2026-03-21·한국 21:00·남쪽·같은 확대율의 프로그램</td></tr></tbody></table>",
  "earth-question-data-17": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">위치</th></tr></thead><tbody><tr><th scope=\"row\">오전</th><td>남쪽 기준 왼쪽 하늘</td></tr><tr><th scope=\"row\">오후</th><td>남쪽 기준 오른쪽 하늘</td></tr></tbody></table>",
  "earth-question-data-27": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">남쪽 기준 위치</th><th scope=\"col\">별 배열 표시</th></tr></thead><tbody><tr><th scope=\"row\">20:00</th><td>왼쪽</td><td>P와 주변 세 별</td></tr><tr><th scope=\"row\">21:00</th><td>가운데 쪽</td><td>P와 주변 세 별</td></tr><tr><th scope=\"row\">22:00</th><td>오른쪽</td><td>P와 주변 세 별</td></tr></tbody></table>",
  "earth-question-data-28": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">시각</th><th scope=\"col\">같은 남쪽 별무리</th></tr></thead><tbody><tr><th scope=\"row\">21:00</th><td>위치 확인</td></tr><tr><th scope=\"row\">22:00</th><td>구름으로 안 보임</td></tr></tbody></table>",
  "earth-question-data-42": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">자료 종류</th></tr></thead><tbody><tr><th scope=\"row\">하루 변화를 단순화한 교실 모형의 연습 기록</th></tr></tbody></table>",
  "earth-question-data-43": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">관점</th><th scope=\"col\">남긴 설명</th></tr></thead><tbody><tr><th scope=\"row\">모형 밖</th><td>광원은 받침의 같은 곳에 있음</td></tr><tr><th scope=\"row\">지구 위 관측자</th><td>회전 뒤 광원이 보이는 방향이 달라짐</td></tr></tbody></table>",
  "earth-question-data-44": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">모둠</th><th scope=\"col\">지구의</th><th scope=\"col\">광원</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>축 중심으로 회전</td><td>고정</td></tr><tr><th scope=\"row\">나</th><td>축 중심으로 회전</td><td>지구의 반대 방향으로 이동</td></tr></tbody></table>",
  "earth-question-data-59": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">같은 표시의 방향</th><th scope=\"col\">직접 빛</th></tr></thead><tbody><tr><th scope=\"row\">처음</th><td>광원 쪽</td><td>받음</td></tr><tr><th scope=\"row\">회전 뒤</th><td>광원 반대쪽</td><td>받지 않음</td></tr></tbody></table>",
  "earth-question-data-60": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">확인한 조건</th><th scope=\"col\">관찰</th></tr></thead><tbody><tr><th scope=\"row\">교실 천장등이 켜짐</th><td>광원 반대쪽도 밝아 보임</td></tr><tr><th scope=\"row\">모형 광원</th><td>한 위치에 고정됨</td></tr></tbody></table>",
  "earth-question-data-75": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">모형</th><th scope=\"col\">조작</th><th scope=\"col\">지구의 중심</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>기울어진 축 중심 한 바퀴</td><td>제자리</td></tr><tr><th scope=\"row\">B</th><td>고정 태양 모형 둘레 한 바퀴</td><td>태양 둘레로 이동</td></tr></tbody></table>",
  "earth-question-data-76": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">기록</th><th scope=\"col\">장소/방향</th><th scope=\"col\">날짜</th><th scope=\"col\">시각</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>서울/남쪽</td><td>3월 21일/3월 21일</td><td>21시/22시</td></tr><tr><th scope=\"row\">나</th><td>서울/남쪽</td><td>3월 21일/9월 21일</td><td>21시/21시</td></tr></tbody></table>",
  "earth-question-data-87": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">별 카드</th><th scope=\"col\">중앙 태양에 대한 위치</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>왼쪽 바깥</td></tr><tr><th scope=\"row\">B</th><td>위쪽 바깥</td></tr><tr><th scope=\"row\">C</th><td>아래쪽 바깥</td></tr></tbody></table>",
  "earth-question-data-91": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">배치 요소</th><th scope=\"col\">태양에 대한 위치</th></tr></thead><tbody><tr><th scope=\"row\">별 카드P</th><td>왼쪽 바깥</td></tr><tr><th scope=\"row\">별 카드Q</th><td>오른쪽 바깥</td></tr><tr><th scope=\"row\">지구 위치 1</th><td>태양 왼쪽</td></tr><tr><th scope=\"row\">지구 위치 2</th><td>태양 오른쪽</td></tr></tbody></table>",
  "earth-question-data-92": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">모둠</th><th scope=\"col\">설명</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>별 카드 자체를 돌려 다른 계절의 하늘을 만들었다.</td></tr><tr><th scope=\"row\">나</th><td>지구 위치가 달라져 한밤에 보는 방향이 바뀌었다.</td></tr></tbody></table>",
  "earth-question-data-107": "<table class=\"ed-table earth-book-table\"><caption>확인한 프로그램 설정 목록 · 관찰 결과표가 아니에요.</caption><thead><tr><th scope=\"col\">행</th><th scope=\"col\">서울·남쪽·같은 확대율의 날짜</th><th scope=\"col\">한국 시각</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>2026-03-21</td><td>21:00</td></tr><tr><th scope=\"row\">B</th><td>2026-03-21</td><td>22:00</td></tr><tr><th scope=\"row\">C</th><td>2026-09-21</td><td>21:00</td></tr></tbody></table>",
  "earth-question-data-108": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">화면</th><th scope=\"col\">날짜</th><th scope=\"col\">실제 표시 시각</th><th scope=\"col\">방향</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>3월 21일</td><td>21:00</td><td>남쪽</td></tr><tr><th scope=\"row\">B</th><td>9월 21일</td><td>22:00</td><td>남쪽</td></tr></tbody></table>",
  "earth-question-data-123": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">기록</th><th scope=\"col\">비교 조건</th><th scope=\"col\">붙인 주장</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>같은 날 서울·남쪽 21시/22시</td><td>일 년 공전 차이만 비교했다.</td></tr><tr><th scope=\"row\">나</th><td>서울·남쪽·21시의 3월/9월</td><td>같은 시각이므로 공전과는 관계없다.</td></tr></tbody></table>",
  "earth-question-data-124": "<table class=\"ed-table earth-book-table\"><caption>제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요.</caption><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">카드 내용</th></tr></thead><tbody><tr><th scope=\"row\">수정 전</th><td>지구가 돌아 별자리가 달라진다.</td></tr><tr><th scope=\"row\">수정 뒤</th><td>서울·남쪽·21시의 3월/9월 프로그램을 비교한다.</td></tr></tbody></table>",
  "earth-quick-0": "<div class=\"earth-quick-grid\"><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>① 남쪽을 바라본 왼쪽이므로 동쪽 쪽이다.</td></tr><tr><th scope=\"row\">2</th><td>객관식</td><td>② 서울·남쪽·밤 9시·같은 확대율의 3월과 9월</td></tr><tr><th scope=\"row\">3</th><td>복수 선택</td><td>③, ⑤</td></tr><tr><th scope=\"row\">4</th><td>복수 선택</td><td>①, ④</td></tr><tr><th scope=\"row\">5</th><td>빈칸 넣기</td><td>㉠ 동쪽 / ㉡ 서쪽</td></tr><tr><th scope=\"row\">6</th><td>빈칸 넣기</td><td>㉠ 시각</td></tr><tr><th scope=\"row\">7</th><td>연결하기</td><td>(1) ㄱ / (2) ㄴ / (3) ㄷ</td></tr><tr><th scope=\"row\">8</th><td>연결하기</td><td>(1) ㄴ / (2) ㄷ / (3) ㄱ</td></tr><tr><th scope=\"row\">9</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">10</th><td>순서 배열</td><td>ㄷ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">11</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">12</th><td>자료 해석</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">13</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">14</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">15</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">16</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">17</th><td>객관식</td><td>③ 동쪽 쪽에서 서쪽 쪽으로 위치가 달라진다.</td></tr><tr><th scope=\"row\">18</th><td>객관식</td><td>④ 같은 방향에서 별 배열을 대조해 위치를 비교한다.</td></tr><tr><th scope=\"row\">19</th><td>복수 선택</td><td>③, ④</td></tr><tr><th scope=\"row\">20</th><td>복수 선택</td><td>③, ⑤</td></tr><tr><th scope=\"row\">21</th><td>빈칸 넣기</td><td>㉠ 동쪽 / ㉡ 서쪽</td></tr><tr><th scope=\"row\">22</th><td>빈칸 넣기</td><td>㉠ 자전</td></tr><tr><th scope=\"row\">23</th><td>연결하기</td><td>(1) ㄷ / (2) ㄱ / (3) ㄴ</td></tr><tr><th scope=\"row\">24</th><td>연결하기</td><td>(1) ㄱ / (2) ㄷ / (3) ㄴ</td></tr></tbody></table></div>",
  "earth-quick-24": "<div class=\"earth-quick-grid\"><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">25</th><td>순서 배열</td><td>ㄷ → ㄴ → ㄹ → ㄱ</td></tr><tr><th scope=\"row\">26</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">27</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">28</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">29</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">30</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">31</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">32</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">33</th><td>객관식</td><td>⑤ 동쪽에서 서쪽으로 위치가 달라지는 것처럼 보인다.</td></tr><tr><th scope=\"row\">34</th><td>객관식</td><td>① 같은 장치를 서로 다른 관점에서 설명한 것이다.</td></tr><tr><th scope=\"row\">35</th><td>복수 선택</td><td>①, ②, ④</td></tr><tr><th scope=\"row\">36</th><td>복수 선택</td><td>②, ④</td></tr></tbody></table><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">37</th><td>빈칸 넣기</td><td>㉠ 서쪽 / ㉡ 동쪽</td></tr><tr><th scope=\"row\">38</th><td>빈칸 넣기</td><td>㉠ 반시계</td></tr><tr><th scope=\"row\">39</th><td>연결하기</td><td>(1) ㄷ / (2) ㄴ / (3) ㄱ</td></tr><tr><th scope=\"row\">40</th><td>연결하기</td><td>(1) ㄴ / (2) ㄱ / (3) ㄷ</td></tr><tr><th scope=\"row\">41</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">42</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">43</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">44</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">45</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">46</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">47</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">48</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "earth-quick-48": "<div class=\"earth-quick-grid\"><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">49</th><td>객관식</td><td>② 자전으로 같은 지역이 빛을 받지 않는 면을 향해 밤이 된다.</td></tr><tr><th scope=\"row\">50</th><td>객관식</td><td>③ A와 B는 태양에 대한 방향이 달라 낮밤이 다를 수 있다.</td></tr><tr><th scope=\"row\">51</th><td>복수 선택</td><td>①, ③, ④</td></tr><tr><th scope=\"row\">52</th><td>복수 선택</td><td>①, ③</td></tr><tr><th scope=\"row\">53</th><td>빈칸 넣기</td><td>㉠ 낮 / ㉡ 밤</td></tr><tr><th scope=\"row\">54</th><td>빈칸 넣기</td><td>㉠ 자전</td></tr><tr><th scope=\"row\">55</th><td>연결하기</td><td>(1) ㄱ / (2) ㄴ / (3) ㄷ</td></tr><tr><th scope=\"row\">56</th><td>연결하기</td><td>(1) ㄴ / (2) ㄷ / (3) ㄱ</td></tr><tr><th scope=\"row\">57</th><td>순서 배열</td><td>ㄷ → ㄴ → ㄱ</td></tr><tr><th scope=\"row\">58</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">59</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">60</th><td>자료 해석</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">61</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">62</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">63</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">64</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">65</th><td>객관식</td><td>④ 자전이며 한 바퀴를 하루에 대응시킨다.</td></tr><tr><th scope=\"row\">66</th><td>객관식</td><td>⑤ 태양 둘레 공전으로 밤에 바라보는 방향이 달라짐</td></tr><tr><th scope=\"row\">67</th><td>복수 선택</td><td>①, ④</td></tr><tr><th scope=\"row\">68</th><td>복수 선택</td><td>①, ⑤</td></tr><tr><th scope=\"row\">69</th><td>빈칸 넣기</td><td>㉠ 자전축 / ㉡ 태양</td></tr><tr><th scope=\"row\">70</th><td>빈칸 넣기</td><td>㉠ 하루 / ㉡ 일 년</td></tr><tr><th scope=\"row\">71</th><td>연결하기</td><td>(1) ㄷ / (2) ㄱ / (3) ㄴ</td></tr><tr><th scope=\"row\">72</th><td>연결하기</td><td>(1) ㄱ / (2) ㄷ / (3) ㄴ</td></tr></tbody></table></div>",
  "earth-quick-72": "<div class=\"earth-quick-grid\"><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">73</th><td>순서 배열</td><td>ㄷ → ㄹ → ㄴ → ㄱ</td></tr><tr><th scope=\"row\">74</th><td>순서 배열</td><td>ㄴ → ㄹ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">75</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">76</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">77</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">78</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">79</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">80</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">81</th><td>객관식</td><td>① 태양 반대쪽인 오른쪽 바깥</td></tr><tr><th scope=\"row\">82</th><td>객관식</td><td>② 한밤 관측자가 정면으로 바라보는 카드</td></tr><tr><th scope=\"row\">83</th><td>복수 선택</td><td>②, ④</td></tr><tr><th scope=\"row\">84</th><td>복수 선택</td><td>①, ④</td></tr></tbody></table><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">85</th><td>빈칸 넣기</td><td>㉠ 반대 / ㉡ 공전</td></tr><tr><th scope=\"row\">86</th><td>빈칸 넣기</td><td>㉠ 태양빛</td></tr><tr><th scope=\"row\">87</th><td>연결하기</td><td>(1) ㄷ / (2) ㄴ / (3) ㄱ</td></tr><tr><th scope=\"row\">88</th><td>연결하기</td><td>(1) ㄴ / (2) ㄱ / (3) ㄷ</td></tr><tr><th scope=\"row\">89</th><td>순서 배열</td><td>ㄴ → ㄷ → ㄱ → ㄹ</td></tr><tr><th scope=\"row\">90</th><td>순서 배열</td><td>ㄷ → ㄴ → ㄹ → ㄱ</td></tr><tr><th scope=\"row\">91</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">92</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">93</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">94</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">95</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">96</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>",
  "earth-quick-96": "<div class=\"earth-quick-grid\"><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">97</th><td>객관식</td><td>③ 날짜를 바꾸고 장소·시각·방향·확대율을 맞춘다.</td></tr><tr><th scope=\"row\">98</th><td>객관식</td><td>④ 맞춘 조건과 달라진 위치를 밝히고 공전과 연결한다.</td></tr><tr><th scope=\"row\">99</th><td>복수 선택</td><td>①, ③</td></tr><tr><th scope=\"row\">100</th><td>복수 선택</td><td>③, ⑤</td></tr><tr><th scope=\"row\">101</th><td>빈칸 넣기</td><td>㉠ 날짜 / ㉡ 공전</td></tr><tr><th scope=\"row\">102</th><td>빈칸 넣기</td><td>㉠ 시각 / ㉡ 날짜</td></tr><tr><th scope=\"row\">103</th><td>연결하기</td><td>(1) ㄱ / (2) ㄴ / (3) ㄷ</td></tr><tr><th scope=\"row\">104</th><td>연결하기</td><td>(1) ㄴ / (2) ㄷ / (3) ㄱ</td></tr><tr><th scope=\"row\">105</th><td>순서 배열</td><td>ㄷ → ㄴ → ㄹ → ㄱ</td></tr><tr><th scope=\"row\">106</th><td>순서 배열</td><td>ㄴ → ㄹ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">107</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">108</th><td>자료 해석</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">109</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">110</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">111</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">112</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">113</th><td>객관식</td><td>⑤ 같은 날 남쪽 태양의 위치 변화 → 지구 자전과 연결</td></tr><tr><th scope=\"row\">114</th><td>객관식</td><td>① 같은 장소·시각의 두 계절 별무리 차이를 태양 둘레 공전과 연결한다.</td></tr><tr><th scope=\"row\">115</th><td>복수 선택</td><td>②, ⑤</td></tr><tr><th scope=\"row\">116</th><td>복수 선택</td><td>②, ④</td></tr><tr><th scope=\"row\">117</th><td>빈칸 넣기</td><td>㉠ 자전 / ㉡ 공전</td></tr><tr><th scope=\"row\">118</th><td>빈칸 넣기</td><td>㉠ 야외</td></tr><tr><th scope=\"row\">119</th><td>연결하기</td><td>(1) ㄷ / (2) ㄱ / (3) ㄴ</td></tr><tr><th scope=\"row\">120</th><td>연결하기</td><td>(1) ㄱ / (2) ㄷ / (3) ㄴ</td></tr></tbody></table></div>",
  "earth-quick-120": "<div class=\"earth-quick-grid\"><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">121</th><td>순서 배열</td><td>ㄴ → ㄹ → ㄱ → ㄷ</td></tr><tr><th scope=\"row\">122</th><td>순서 배열</td><td>ㄷ → ㄹ → ㄱ → ㄴ</td></tr><tr><th scope=\"row\">123</th><td>자료 해석</td><td>교사 확인</td></tr><tr><th scope=\"row\">124</th><td>자료 해석</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table earth-book-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">125</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">126</th><td>까닭 설명</td><td>교사 확인</td></tr><tr><th scope=\"row\">127</th><td>그림·설계</td><td>교사 확인</td></tr><tr><th scope=\"row\">128</th><td>그림·설계</td><td>교사 확인</td></tr></tbody></table></div>"
 },
 "figureModels": {
  "sun": {
   "kind": "photo",
   "src": "../assets/activities/c22-s42-u01/sun-PIA17669.jpg",
   "alt": "SDO 관측 장비로 얻은 태양 자료",
   "caption": "관측 장비로 얻은 자료예요. 맨눈으로 보이는 색이나 오늘 태양의 위치를 나타내지 않아요.",
   "credit": "NASA/SDO/AIA · PIA17669 · 2013-03-28 관측 · science.nasa.gov/resource/pulses-from-the-sun/"
  },
  "model": {
   "kind": "photo",
   "src": "../assets/activities/c22-s61-u04/model-preparation.webp",
   "alt": "LED 광원과 빨간 표시가 있는 흰 공을 받침에 놓은 준비 예",
   "caption": "광원과 공을 놓는 준비 참고예요. 실제 수업에서는 기울어진 축이 있는 지구의를 써요. 축 각도·낮밤 경계나 실험 결과를 이 그림으로 판단하지 않아요.",
   "credit": "준비 배치 참고 자료 · 우리 반 실제 실험 사진이 아니에요."
  },
  "nightEnvironment": {
   "kind": "photo",
   "src": "../assets/activities/c22-s61-u04/night-environment.webp",
   "alt": "어른과 아이들이 넓은 평지에서 하늘을 살펴보는 환경 준비 예",
   "caption": "어른과 함께 안전한 관측 장소를 정해요. 사진의 별 점으로 실제 별자리 위치나 관측 시각을 판단하지 않아요.",
   "credit": "관찰 환경 준비 참고 · 우리 반의 실제 야외 관측 사진이 아니에요."
  },
  "cardMaterials": {
   "kind": "photo",
   "src": "../assets/activities/c22-s61-u04/card-materials.webp",
   "alt": "빈 종이 두 장과 연필을 책상에 놓은 설명 카드 준비 예",
   "caption": "조건·위치·원인을 담을 한 장 자료를 준비해요. 아직 완성한 자료나 실제 설명 활동의 결과가 아니에요.",
   "credit": "빈 종이와 연필 준비 참고 · 내 근거로 실제 자료를 만들고 설명해요."
  },
  "sky-sun-09": {
   "kind": "link",
   "label": "오전 9시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-03-21T00%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-03-21",
   "time": "09:00",
   "qr": "../assets/activities/c22-s61-u04/sky-sun-09-qr.png"
  },
  "sky-sun-12": {
   "kind": "link",
   "label": "낮 12시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-03-21T03%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-03-21",
   "time": "12:00",
   "qr": "../assets/activities/c22-s61-u04/sky-sun-12-qr.png"
  },
  "sky-sun-15": {
   "kind": "link",
   "label": "오후 3시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-03-21T06%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-03-21",
   "time": "15:00",
   "qr": "../assets/activities/c22-s61-u04/sky-sun-15-qr.png"
  },
  "sky-spring-21": {
   "kind": "link",
   "label": "3월 21일 · 밤 9시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-03-21T12%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-03-21",
   "time": "21:00",
   "qr": "../assets/activities/c22-s61-u04/sky-spring-21-qr.png"
  },
  "sky-spring-22": {
   "kind": "link",
   "label": "3월 21일 · 밤 10시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-03-21T13%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-03-21",
   "time": "22:00",
   "qr": "../assets/activities/c22-s61-u04/sky-spring-22-qr.png"
  },
  "sky-summer-21": {
   "kind": "link",
   "label": "6월 21일 · 밤 9시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-06-21T12%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-06-21",
   "time": "21:00",
   "qr": "../assets/activities/c22-s61-u04/sky-summer-21-qr.png"
  },
  "sky-autumn-21": {
   "kind": "link",
   "label": "9월 21일 · 밤 9시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-09-21T12%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-09-21",
   "time": "21:00",
   "qr": "../assets/activities/c22-s61-u04/sky-autumn-21-qr.png"
  },
  "sky-winter-21": {
   "kind": "link",
   "label": "12월 21일 · 밤 9시",
   "url": "https://stellarium-web.org/?lat=37.56668&lng=126.97829&date=2026-12-21T12%3A00%3A00Z&az=180&alt=30&fov=100",
   "date": "2026-12-21",
   "time": "21:00",
   "qr": "../assets/activities/c22-s61-u04/sky-winter-21-qr.png"
  },
  "earth-question-data-11": {
   "kind": "table",
   "heads": [
    "기록",
    "장소",
    "날짜",
    "시각",
    "방향"
   ],
   "rows": [
    [
     "A",
     "서울",
     "3월 21일",
     "21:00",
     "남쪽"
    ],
    [
     "B",
     "부산",
     "9월 21일",
     "23:00",
     "남쪽"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-12": {
   "kind": "table",
   "heads": [
    "기록",
    "남긴 내용"
   ],
   "rows": [
    [
     "가",
     "프로그램에서 밝은 별이 오른쪽에 보였다."
    ],
    [
     "나",
     "서울·2026-03-21·한국 21:00·남쪽·같은 확대율의 프로그램"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-17": {
   "kind": "table",
   "heads": [
    "시각",
    "위치"
   ],
   "rows": [
    [
     "오전",
     "남쪽 기준 왼쪽 하늘"
    ],
    [
     "오후",
     "남쪽 기준 오른쪽 하늘"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-27": {
   "kind": "table",
   "heads": [
    "시각",
    "남쪽 기준 위치",
    "별 배열 표시"
   ],
   "rows": [
    [
     "20:00",
     "왼쪽",
     "P와 주변 세 별"
    ],
    [
     "21:00",
     "가운데 쪽",
     "P와 주변 세 별"
    ],
    [
     "22:00",
     "오른쪽",
     "P와 주변 세 별"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-28": {
   "kind": "table",
   "heads": [
    "시각",
    "같은 남쪽 별무리"
   ],
   "rows": [
    [
     "21:00",
     "위치 확인"
    ],
    [
     "22:00",
     "구름으로 안 보임"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-42": {
   "kind": "table",
   "heads": [
    "자료 종류"
   ],
   "rows": [
    [
     "하루 변화를 단순화한 교실 모형의 연습 기록"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-43": {
   "kind": "table",
   "heads": [
    "관점",
    "남긴 설명"
   ],
   "rows": [
    [
     "모형 밖",
     "광원은 받침의 같은 곳에 있음"
    ],
    [
     "지구 위 관측자",
     "회전 뒤 광원이 보이는 방향이 달라짐"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-44": {
   "kind": "table",
   "heads": [
    "모둠",
    "지구의",
    "광원"
   ],
   "rows": [
    [
     "가",
     "축 중심으로 회전",
     "고정"
    ],
    [
     "나",
     "축 중심으로 회전",
     "지구의 반대 방향으로 이동"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-59": {
   "kind": "table",
   "heads": [
    "상태",
    "같은 표시의 방향",
    "직접 빛"
   ],
   "rows": [
    [
     "처음",
     "광원 쪽",
     "받음"
    ],
    [
     "회전 뒤",
     "광원 반대쪽",
     "받지 않음"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-60": {
   "kind": "table",
   "heads": [
    "확인한 조건",
    "관찰"
   ],
   "rows": [
    [
     "교실 천장등이 켜짐",
     "광원 반대쪽도 밝아 보임"
    ],
    [
     "모형 광원",
     "한 위치에 고정됨"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-75": {
   "kind": "table",
   "heads": [
    "모형",
    "조작",
    "지구의 중심"
   ],
   "rows": [
    [
     "A",
     "기울어진 축 중심 한 바퀴",
     "제자리"
    ],
    [
     "B",
     "고정 태양 모형 둘레 한 바퀴",
     "태양 둘레로 이동"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-76": {
   "kind": "table",
   "heads": [
    "기록",
    "장소/방향",
    "날짜",
    "시각"
   ],
   "rows": [
    [
     "가",
     "서울/남쪽",
     "3월 21일/3월 21일",
     "21시/22시"
    ],
    [
     "나",
     "서울/남쪽",
     "3월 21일/9월 21일",
     "21시/21시"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-87": {
   "kind": "table",
   "heads": [
    "별 카드",
    "중앙 태양에 대한 위치"
   ],
   "rows": [
    [
     "A",
     "왼쪽 바깥"
    ],
    [
     "B",
     "위쪽 바깥"
    ],
    [
     "C",
     "아래쪽 바깥"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-91": {
   "kind": "table",
   "heads": [
    "배치 요소",
    "태양에 대한 위치"
   ],
   "rows": [
    [
     "별 카드P",
     "왼쪽 바깥"
    ],
    [
     "별 카드Q",
     "오른쪽 바깥"
    ],
    [
     "지구 위치 1",
     "태양 왼쪽"
    ],
    [
     "지구 위치 2",
     "태양 오른쪽"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-92": {
   "kind": "table",
   "heads": [
    "모둠",
    "설명"
   ],
   "rows": [
    [
     "가",
     "별 카드 자체를 돌려 다른 계절의 하늘을 만들었다."
    ],
    [
     "나",
     "지구 위치가 달라져 한밤에 보는 방향이 바뀌었다."
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-107": {
   "kind": "table",
   "heads": [
    "행",
    "서울·남쪽·같은 확대율의 날짜",
    "한국 시각"
   ],
   "rows": [
    [
     "A",
     "2026-03-21",
     "21:00"
    ],
    [
     "B",
     "2026-03-21",
     "22:00"
    ],
    [
     "C",
     "2026-09-21",
     "21:00"
    ]
   ],
   "caption": "확인한 프로그램 설정 목록 · 관찰 결과표가 아니에요."
  },
  "earth-question-data-108": {
   "kind": "table",
   "heads": [
    "화면",
    "날짜",
    "실제 표시 시각",
    "방향"
   ],
   "rows": [
    [
     "A",
     "3월 21일",
     "21:00",
     "남쪽"
    ],
    [
     "B",
     "9월 21일",
     "22:00",
     "남쪽"
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-123": {
   "kind": "table",
   "heads": [
    "기록",
    "비교 조건",
    "붙인 주장"
   ],
   "rows": [
    [
     "가",
     "같은 날 서울·남쪽 21시/22시",
     "일 년 공전 차이만 비교했다."
    ],
    [
     "나",
     "서울·남쪽·21시의 3월/9월",
     "같은 시각이므로 공전과는 관계없다."
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-question-data-124": {
   "kind": "table",
   "heads": [
    "상태",
    "카드 내용"
   ],
   "rows": [
    [
     "수정 전",
     "지구가 돌아 별자리가 달라진다."
    ],
    [
     "수정 뒤",
     "서울·남쪽·21시의 3월/9월 프로그램을 비교한다."
    ]
   ],
   "caption": "제공된 연습 자료 · 실제 학생 관찰/측정값이 아니에요."
  },
  "earth-quick-0": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      1,
      "객관식",
      "① 남쪽을 바라본 왼쪽이므로 동쪽 쪽이다."
     ],
     [
      2,
      "객관식",
      "② 서울·남쪽·밤 9시·같은 확대율의 3월과 9월"
     ],
     [
      3,
      "복수 선택",
      "③, ⑤"
     ],
     [
      4,
      "복수 선택",
      "①, ④"
     ],
     [
      5,
      "빈칸 넣기",
      "㉠ 동쪽 / ㉡ 서쪽"
     ],
     [
      6,
      "빈칸 넣기",
      "㉠ 시각"
     ],
     [
      7,
      "연결하기",
      "(1) ㄱ / (2) ㄴ / (3) ㄷ"
     ],
     [
      8,
      "연결하기",
      "(1) ㄴ / (2) ㄷ / (3) ㄱ"
     ],
     [
      9,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      10,
      "순서 배열",
      "ㄷ → ㄱ → ㄴ"
     ],
     [
      11,
      "자료 해석",
      "교사 확인"
     ],
     [
      12,
      "자료 해석",
      "교사 확인"
     ]
    ],
    [
     [
      13,
      "까닭 설명",
      "교사 확인"
     ],
     [
      14,
      "까닭 설명",
      "교사 확인"
     ],
     [
      15,
      "그림·설계",
      "교사 확인"
     ],
     [
      16,
      "그림·설계",
      "교사 확인"
     ],
     [
      17,
      "객관식",
      "③ 동쪽 쪽에서 서쪽 쪽으로 위치가 달라진다."
     ],
     [
      18,
      "객관식",
      "④ 같은 방향에서 별 배열을 대조해 위치를 비교한다."
     ],
     [
      19,
      "복수 선택",
      "③, ④"
     ],
     [
      20,
      "복수 선택",
      "③, ⑤"
     ],
     [
      21,
      "빈칸 넣기",
      "㉠ 동쪽 / ㉡ 서쪽"
     ],
     [
      22,
      "빈칸 넣기",
      "㉠ 자전"
     ],
     [
      23,
      "연결하기",
      "(1) ㄷ / (2) ㄱ / (3) ㄴ"
     ],
     [
      24,
      "연결하기",
      "(1) ㄱ / (2) ㄷ / (3) ㄴ"
     ]
    ]
   ]
  },
  "earth-quick-24": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      25,
      "순서 배열",
      "ㄷ → ㄴ → ㄹ → ㄱ"
     ],
     [
      26,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ → ㄹ"
     ],
     [
      27,
      "자료 해석",
      "교사 확인"
     ],
     [
      28,
      "자료 해석",
      "교사 확인"
     ],
     [
      29,
      "까닭 설명",
      "교사 확인"
     ],
     [
      30,
      "까닭 설명",
      "교사 확인"
     ],
     [
      31,
      "그림·설계",
      "교사 확인"
     ],
     [
      32,
      "그림·설계",
      "교사 확인"
     ],
     [
      33,
      "객관식",
      "⑤ 동쪽에서 서쪽으로 위치가 달라지는 것처럼 보인다."
     ],
     [
      34,
      "객관식",
      "① 같은 장치를 서로 다른 관점에서 설명한 것이다."
     ],
     [
      35,
      "복수 선택",
      "①, ②, ④"
     ],
     [
      36,
      "복수 선택",
      "②, ④"
     ]
    ],
    [
     [
      37,
      "빈칸 넣기",
      "㉠ 서쪽 / ㉡ 동쪽"
     ],
     [
      38,
      "빈칸 넣기",
      "㉠ 반시계"
     ],
     [
      39,
      "연결하기",
      "(1) ㄷ / (2) ㄴ / (3) ㄱ"
     ],
     [
      40,
      "연결하기",
      "(1) ㄴ / (2) ㄱ / (3) ㄷ"
     ],
     [
      41,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      42,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ"
     ],
     [
      43,
      "자료 해석",
      "교사 확인"
     ],
     [
      44,
      "자료 해석",
      "교사 확인"
     ],
     [
      45,
      "까닭 설명",
      "교사 확인"
     ],
     [
      46,
      "까닭 설명",
      "교사 확인"
     ],
     [
      47,
      "그림·설계",
      "교사 확인"
     ],
     [
      48,
      "그림·설계",
      "교사 확인"
     ]
    ]
   ]
  },
  "earth-quick-48": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      49,
      "객관식",
      "② 자전으로 같은 지역이 빛을 받지 않는 면을 향해 밤이 된다."
     ],
     [
      50,
      "객관식",
      "③ A와 B는 태양에 대한 방향이 달라 낮밤이 다를 수 있다."
     ],
     [
      51,
      "복수 선택",
      "①, ③, ④"
     ],
     [
      52,
      "복수 선택",
      "①, ③"
     ],
     [
      53,
      "빈칸 넣기",
      "㉠ 낮 / ㉡ 밤"
     ],
     [
      54,
      "빈칸 넣기",
      "㉠ 자전"
     ],
     [
      55,
      "연결하기",
      "(1) ㄱ / (2) ㄴ / (3) ㄷ"
     ],
     [
      56,
      "연결하기",
      "(1) ㄴ / (2) ㄷ / (3) ㄱ"
     ],
     [
      57,
      "순서 배열",
      "ㄷ → ㄴ → ㄱ"
     ],
     [
      58,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ → ㄹ"
     ],
     [
      59,
      "자료 해석",
      "교사 확인"
     ],
     [
      60,
      "자료 해석",
      "교사 확인"
     ]
    ],
    [
     [
      61,
      "까닭 설명",
      "교사 확인"
     ],
     [
      62,
      "까닭 설명",
      "교사 확인"
     ],
     [
      63,
      "그림·설계",
      "교사 확인"
     ],
     [
      64,
      "그림·설계",
      "교사 확인"
     ],
     [
      65,
      "객관식",
      "④ 자전이며 한 바퀴를 하루에 대응시킨다."
     ],
     [
      66,
      "객관식",
      "⑤ 태양 둘레 공전으로 밤에 바라보는 방향이 달라짐"
     ],
     [
      67,
      "복수 선택",
      "①, ④"
     ],
     [
      68,
      "복수 선택",
      "①, ⑤"
     ],
     [
      69,
      "빈칸 넣기",
      "㉠ 자전축 / ㉡ 태양"
     ],
     [
      70,
      "빈칸 넣기",
      "㉠ 하루 / ㉡ 일 년"
     ],
     [
      71,
      "연결하기",
      "(1) ㄷ / (2) ㄱ / (3) ㄴ"
     ],
     [
      72,
      "연결하기",
      "(1) ㄱ / (2) ㄷ / (3) ㄴ"
     ]
    ]
   ]
  },
  "earth-quick-72": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      73,
      "순서 배열",
      "ㄷ → ㄹ → ㄴ → ㄱ"
     ],
     [
      74,
      "순서 배열",
      "ㄴ → ㄹ → ㄱ → ㄷ"
     ],
     [
      75,
      "자료 해석",
      "교사 확인"
     ],
     [
      76,
      "자료 해석",
      "교사 확인"
     ],
     [
      77,
      "까닭 설명",
      "교사 확인"
     ],
     [
      78,
      "까닭 설명",
      "교사 확인"
     ],
     [
      79,
      "그림·설계",
      "교사 확인"
     ],
     [
      80,
      "그림·설계",
      "교사 확인"
     ],
     [
      81,
      "객관식",
      "① 태양 반대쪽인 오른쪽 바깥"
     ],
     [
      82,
      "객관식",
      "② 한밤 관측자가 정면으로 바라보는 카드"
     ],
     [
      83,
      "복수 선택",
      "②, ④"
     ],
     [
      84,
      "복수 선택",
      "①, ④"
     ]
    ],
    [
     [
      85,
      "빈칸 넣기",
      "㉠ 반대 / ㉡ 공전"
     ],
     [
      86,
      "빈칸 넣기",
      "㉠ 태양빛"
     ],
     [
      87,
      "연결하기",
      "(1) ㄷ / (2) ㄴ / (3) ㄱ"
     ],
     [
      88,
      "연결하기",
      "(1) ㄴ / (2) ㄱ / (3) ㄷ"
     ],
     [
      89,
      "순서 배열",
      "ㄴ → ㄷ → ㄱ → ㄹ"
     ],
     [
      90,
      "순서 배열",
      "ㄷ → ㄴ → ㄹ → ㄱ"
     ],
     [
      91,
      "자료 해석",
      "교사 확인"
     ],
     [
      92,
      "자료 해석",
      "교사 확인"
     ],
     [
      93,
      "까닭 설명",
      "교사 확인"
     ],
     [
      94,
      "까닭 설명",
      "교사 확인"
     ],
     [
      95,
      "그림·설계",
      "교사 확인"
     ],
     [
      96,
      "그림·설계",
      "교사 확인"
     ]
    ]
   ]
  },
  "earth-quick-96": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      97,
      "객관식",
      "③ 날짜를 바꾸고 장소·시각·방향·확대율을 맞춘다."
     ],
     [
      98,
      "객관식",
      "④ 맞춘 조건과 달라진 위치를 밝히고 공전과 연결한다."
     ],
     [
      99,
      "복수 선택",
      "①, ③"
     ],
     [
      100,
      "복수 선택",
      "③, ⑤"
     ],
     [
      101,
      "빈칸 넣기",
      "㉠ 날짜 / ㉡ 공전"
     ],
     [
      102,
      "빈칸 넣기",
      "㉠ 시각 / ㉡ 날짜"
     ],
     [
      103,
      "연결하기",
      "(1) ㄱ / (2) ㄴ / (3) ㄷ"
     ],
     [
      104,
      "연결하기",
      "(1) ㄴ / (2) ㄷ / (3) ㄱ"
     ],
     [
      105,
      "순서 배열",
      "ㄷ → ㄴ → ㄹ → ㄱ"
     ],
     [
      106,
      "순서 배열",
      "ㄴ → ㄹ → ㄱ → ㄷ"
     ],
     [
      107,
      "자료 해석",
      "교사 확인"
     ],
     [
      108,
      "자료 해석",
      "교사 확인"
     ]
    ],
    [
     [
      109,
      "까닭 설명",
      "교사 확인"
     ],
     [
      110,
      "까닭 설명",
      "교사 확인"
     ],
     [
      111,
      "그림·설계",
      "교사 확인"
     ],
     [
      112,
      "그림·설계",
      "교사 확인"
     ],
     [
      113,
      "객관식",
      "⑤ 같은 날 남쪽 태양의 위치 변화 → 지구 자전과 연결"
     ],
     [
      114,
      "객관식",
      "① 같은 장소·시각의 두 계절 별무리 차이를 태양 둘레 공전과 연결한다."
     ],
     [
      115,
      "복수 선택",
      "②, ⑤"
     ],
     [
      116,
      "복수 선택",
      "②, ④"
     ],
     [
      117,
      "빈칸 넣기",
      "㉠ 자전 / ㉡ 공전"
     ],
     [
      118,
      "빈칸 넣기",
      "㉠ 야외"
     ],
     [
      119,
      "연결하기",
      "(1) ㄷ / (2) ㄱ / (3) ㄴ"
     ],
     [
      120,
      "연결하기",
      "(1) ㄱ / (2) ㄷ / (3) ㄴ"
     ]
    ]
   ]
  },
  "earth-quick-120": {
   "kind": "quick",
   "heads": [
    "번호",
    "형식",
    "정답"
   ],
   "tables": [
    [
     [
      121,
      "순서 배열",
      "ㄴ → ㄹ → ㄱ → ㄷ"
     ],
     [
      122,
      "순서 배열",
      "ㄷ → ㄹ → ㄱ → ㄴ"
     ],
     [
      123,
      "자료 해석",
      "교사 확인"
     ],
     [
      124,
      "자료 해석",
      "교사 확인"
     ]
    ],
    [
     [
      125,
      "까닭 설명",
      "교사 확인"
     ],
     [
      126,
      "까닭 설명",
      "교사 확인"
     ],
     [
      127,
      "그림·설계",
      "교사 확인"
     ],
     [
      128,
      "그림·설계",
      "교사 확인"
     ]
    ]
   ]
  }
 },
 "duplexAnswerStartsOnRecto": true,
 "questionSource": "c22-s61-u04.questions.js",
 "visualBindings": [
  {
   "no": 11,
   "figure": "earth-question-data-11",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 12,
   "figure": "earth-question-data-12",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 17,
   "figure": "earth-question-data-17",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 27,
   "figure": "earth-question-data-27",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 28,
   "figure": "earth-question-data-28",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 42,
   "figure": "earth-question-data-42",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 43,
   "figure": "earth-question-data-43",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 44,
   "figure": "earth-question-data-44",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 59,
   "figure": "earth-question-data-59",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 60,
   "figure": "earth-question-data-60",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 75,
   "figure": "earth-question-data-75",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 76,
   "figure": "earth-question-data-76",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 87,
   "figure": "earth-question-data-87",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 91,
   "figure": "earth-question-data-91",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 92,
   "figure": "earth-question-data-92",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 107,
   "figure": "earth-question-data-107",
   "kind": "verified-configuration-not-observation",
   "sameModelAsQuestion": true
  },
  {
   "no": 108,
   "figure": "earth-question-data-108",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 123,
   "figure": "earth-question-data-123",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  },
  {
   "no": 124,
   "figure": "earth-question-data-124",
   "kind": "provided-practice-table",
   "sameModelAsQuestion": true
  }
 ]
};

export const observationPriorWorkbook=withEarthMotionEditorial(baseWorkbook);
export const studentGuidePriorWorkbook=withObservationLanguage(observationPriorWorkbook);
export const workbook=withStudentGuideLanguage(studentGuidePriorWorkbook);
