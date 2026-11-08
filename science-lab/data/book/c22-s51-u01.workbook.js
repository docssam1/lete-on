import{withGrade5StudyNotes}from'./grade5-study-notes.js?v=20261108-grade5-study-notes';
import{withGeologyReadableWorkbook}from'./c22-s51-u01.editorial.js?v=20261106-geology-readable-workbook';
import{withGeologyStudentLanguage}from'./geology-student-language.js';
import{withGeologyEditorial}from'./c22-s51-u01.editorial.js';
// 지층과 화석80문항. scripts/gen-science-workbook-c22s51u01.mjs가 생성.
const baseWorkbook = {
 "unit": "c22-s51-u01",
 "title": "지층과 화석",
 "semester": "5-1",
 "no": 1,
 "theme": "#97643d",
 "richText": true,
 "questions": [
  {
   "id": "c22-s51-u01-w001",
   "no": 1,
   "form": "choice",
   "topic": "지층의 층·경계·색과 두께",
   "prompt": "절벽의 지층 사진을 관찰할 때 먼저 기록할 특징은 무엇인가요?",
   "answer": "④ 층의 경계와 색·두께",
   "explanation": "지층의 보이는 층과 경계·색·두께를 관찰해요. 사진 밖이나 정확한 생성 날짜까지 보았다고 하지 않아요.",
   "misconception": "사진에서 보이는 층 경계와 두께를 기록한 것인지, 생성 날짜까지 보았다고 한 것인지 구별해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b001",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-01",
   "choices": [
    "사진에 보이지 않는 안쪽 전체",
    "층마다 생긴 정확한 연도",
    "모든 층이 쌓인 전체 기간",
    "층의 경계와 색·두께",
    "확대 비율을 모른 채 잰 실제 두께"
   ],
   "key": 3,
   "previousId": "c22-s51-u01-w001",
   "previousNo": 1,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "지층의 보이는 층과 경계·색·두께를 관찰해요. 사진 밖이나 정확한 생성 날짜까지 보았다고 하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w002",
   "no": 2,
   "form": "choice",
   "topic": "지층의 층·경계·색과 두께",
   "prompt": "한 지층에서 층마다 색이 달랐습니다. 자료에 맞는 설명은 무엇인가요?",
   "answer": "② 층마다 보이는 색이 다를 수 있다.",
   "explanation": "지층의 여러 층은 색·두께·알갱이가 다를 수 있어요. 색만으로 생성 순서·동시성을 확정하지 않아요.",
   "misconception": "같은 색이면 같은 시기라는 판단은 색 관찰만으로 뒷받침되지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b002",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "standard": "6과01-01",
   "choices": [
    "지층이면 모든 층의 색이 반드시 같다.",
    "층마다 보이는 색이 다를 수 있다.",
    "어두운 층은 색만으로 항상 가장 오래됐다.",
    "색이 다르면 암석이 층을 이룰 수 없다.",
    "색이 같은 두 층은 반드시 동시에 생겼다."
   ],
   "key": 1,
   "previousId": "c22-s51-u01-w002",
   "previousNo": 2,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "지층의 여러 층은 색·두께·알갱이가 다를 수 있어요. 색만으로 생성 순서·동시성을 확정하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w003",
   "no": 3,
   "form": "choice",
   "topic": "지층의 모양·관찰 범위",
   "prompt": "지층 모양 자료에서 나처럼 층의 경계가 휘어 보입니다. 관찰한 모습에 맞는 말은 무엇인가요?",
   "answer": "⑤ 층의 경계가 구부러져 보인다.",
   "explanation": "휘어진 지층의 보이는 모습을 관찰해요. 이 단원에서 휘어지는 원리를 필수로 설명하게 하지 않아요.",
   "misconception": "경계가 휘어 보인다는 관찰과 휘게 한 힘을 설명하는 것은 달라요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b009",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-01",
   "figure": "strata-shapes.svg",
   "choices": [
    "층이 휘면 암석의 층은 모두 없어졌다.",
    "구부러진 무늬는 실제 지층일 수 없다.",
    "휘어진 층은 항상 한 가지 색이다.",
    "사진만으로 휘어진 정확한 힘을 잰다.",
    "층의 경계가 구부러져 보인다."
   ],
   "key": 4,
   "previousId": "c22-s51-u01-w003",
   "previousNo": 3,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "휘어진 지층의 보이는 모습을 관찰해요. 이 단원에서 휘어지는 원리를 필수로 설명하게 하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w004",
   "no": 4,
   "form": "choice",
   "topic": "지층의 모양·관찰 범위",
   "prompt": "층이 끊어져 서로 어긋난 사진을 관찰했습니다. 타당한 기록은 무엇인가요?",
   "answer": "① 보이는 층의 경계가 끊기고 어긋나 있다.",
   "explanation": "보이는 끊어짐·어긋남을 기록해요. 생성 원리나 사진 밖의 모든 상태를 자료 하나로 확정하지 않아요.",
   "misconception": "끊어진 경계와 어긋난 위치가 보이는지 먼저 확인해요. 사진 밖 상태까지 단정하지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b010",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "standard": "6과01-01",
   "choices": [
    "보이는 층의 경계가 끊기고 어긋나 있다.",
    "끊어진 층이면 모든 암석이 같은 순간 생겼다.",
    "암석이 끊어졌으므로 층이 있던 적이 없다.",
    "사진 밖에서도 모두 같은 정도로 어긋났다.",
    "어긋난 거리로 생성 연도를 바로 계산한다."
   ],
   "key": 0,
   "previousId": "c22-s51-u01-w004",
   "previousNo": 4,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "보이는 끊어짐·어긋남을 기록해요. 생성 원리나 사진 밖의 모든 상태를 자료 하나로 확정하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w005",
   "no": 5,
   "form": "choice",
   "topic": "층이 쌓인 순서와 조건",
   "prompt": "뒤집히거나 순서가 바뀌지 않은 세 층에서 가장 아래 가층이 있습니다. 쌓인 순서에 맞는 것은 무엇인가요?",
   "answer": "③ 가층이 위의 두 층보다 먼저 쌓였다.",
   "explanation": "순서가 바뀌지 않은 쌓임에서는 먼저 쌓인 것이 아래예요. 색·두께나 위치만으로 정확한 연도는 알 수 없어요.",
   "misconception": "아래층이 먼저라는 설명에는 뒤집히거나 순서가 바뀌지 않았다는 조건이 필요해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b017",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "standard": "6과01-01",
   "figure": "layers-abc.svg",
   "choices": [
    "가층이 두꺼우면 나중에 쌓인 것이 확실하다.",
    "가층 색이 어두워 먼저 쌓였다는 뜻이다.",
    "가층이 위의 두 층보다 먼저 쌓였다.",
    "아래에 있으면 항상 정확한 생성 연도를 안다.",
    "가층은 맨 아래라 반드시 가장 나중에 쌓였다."
   ],
   "key": 2,
   "previousId": "c22-s51-u01-w005",
   "previousNo": 5,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "순서가 바뀌지 않은 쌓임에서는 먼저 쌓인 것이 아래예요. 색·두께나 위치만으로 정확한 연도는 알 수 없어요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w006",
   "no": 6,
   "form": "choice",
   "topic": "층이 쌓인 순서와 조건",
   "prompt": "학생이 같은 색의 점토를 맨 아래와 맨 위에 따로 쌓았습니다. 색만으로 판단할 수 없는 것은 무엇인가요?",
   "answer": "③ 두 층을 같은 때 쌓았는지 여부",
   "explanation": "같은 색을 다른 순서로 쌓을 수 있어요. 색이 같다는 것과 생성 시기가 같다는 것은 다른 판단이에요.",
   "misconception": "맨 아래와 맨 위에 같은 색을 따로 쌓을 수 있으므로 색의 일치가 동시성을 뜻하지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b020",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-01",
   "choices": [
    "관찰 기록에 적은 색의 이름",
    "맨 아래 층이 있는 위치",
    "두 층을 같은 때 쌓았는지 여부",
    "모형에 같은 색이 두 곳 있다는 사실",
    "맨 위 층이 있는 위치"
   ],
   "key": 2,
   "previousId": "c22-s51-u01-w006",
   "previousNo": 6,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "같은 색을 다른 순서로 쌓을 수 있어요. 색이 같다는 것과 생성 시기가 같다는 것은 다른 판단이에요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w007",
   "no": 7,
   "form": "choice",
   "topic": "지층 형성 모형과 한계",
   "prompt": "지층 형성을 표현하는 모형에서 색 점토가 나타내는 것은 무엇인가요?",
   "answer": "⑤ 차례로 쌓인 퇴적물의 층",
   "explanation": "층층이 쌓는 모습과 실제 퇴적층을 대응해요. 점토가 실제 모든 재료·시간·과정을 그대로 재현한 것은 아니에요.",
   "misconception": "점토의 각 층은 퇴적층을 나타내요. 점토 자체를 실제 모든 지층의 재료라고 하지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b025",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-01",
   "choices": [
    "모든 지층에 있는 같은 성분",
    "실제 암석이 생긴 정확한 날짜",
    "실제 지층의 모든 생성 원인",
    "화석이 있음을 증명한 생물 수",
    "차례로 쌓인 퇴적물의 층"
   ],
   "key": 4,
   "previousId": "c22-s51-u01-w007",
   "previousNo": 7,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "층층이 쌓는 모습과 실제 퇴적층을 대응해요. 점토가 실제 모든 재료·시간·과정을 그대로 재현한 것은 아니에요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w008",
   "no": 8,
   "form": "choice",
   "topic": "지층 형성 모형과 한계",
   "prompt": "점토를 몇 분 동안 쌓아 층을 만들었습니다. 실제 지층과 비교한 설명으로 맞는 것은 무엇인가요?",
   "answer": "② 모형 시간과 실제 지층 형성 시간은 다르다.",
   "explanation": "모형은 쌓이는 순서와 층의 모습 등을 표현해요. 실제 퇴적물이 오랜 시간 다져지고 굳는 과정 전체와 같지 않아요.",
   "misconception": "모형의 제작 시간과 자연 지층의 형성 시간을 같은 값으로 바꾸지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b026",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-01",
   "choices": [
    "점토를 누르면 실제 퇴적암의 모든 변화가 끝난다.",
    "모형 시간과 실제 지층 형성 시간은 다르다.",
    "몇 분 만들었으니 실제 지층도 모두 몇 분 걸린다.",
    "모형 한 번으로 모든 지층의 생긴 날짜를 안다.",
    "모형 색이 같으면 실제 지층 성분도 모두 같다."
   ],
   "key": 1,
   "previousId": "c22-s51-u01-w008",
   "previousNo": 8,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "모형은 쌓이는 순서와 층의 모습 등을 표현해요. 실제 퇴적물이 오랜 시간 다져지고 굳는 과정 전체와 같지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w009",
   "no": 9,
   "form": "multi",
   "topic": "지층의 모양·관찰 범위",
   "prompt": "여러 지층의 모양을 비교할 때 맞는 설명 두 가지를 고르세요.",
   "answer": "①, ②",
   "explanation": "지층의 다양한 모양을 관찰하고 자료 범위를 밝혀요. 이 단원은 휘거나 끊어지는 생성 원리를 필수로 요구하지 않아요.",
   "misconception": "수평·휘어짐·끊어짐은 보이는 형태예요. 그 사진만으로 힘과 형성 시기를 측정한 것은 아니에요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "choices": [
    "보인 범위와 가려진 부분을 나누어 적는다.",
    "수평·휘어짐·끊어짐의 모습을 살핀다.",
    "지층의 모든 층은 같은 색이어야 한다.",
    "사진 밖의 지층도 모두 관찰한 것으로 센다.",
    "휘어진 지층의 생성 힘을 숫자로 외워야 한다."
   ],
   "key": [
    0,
    1
   ],
   "sourceId": "c22-s51-u01-b014",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     0,
     1
    ]
   },
   "standard": "6과01-01",
   "previousId": "c22-s51-u01-w025",
   "previousNo": 25,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "지층의 다양한 모양을 관찰하고 자료 범위를 밝혀요. 이 단원은 휘거나 끊어지는 생성 원리를 필수로 요구하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w010",
   "no": 10,
   "form": "short",
   "topic": "지층의 층·경계·색과 두께",
   "prompt": "암석이 여러 겹의 층으로 쌓여 있는 것을 무엇이라고 하나요?",
   "answer": "지층",
   "explanation": "암석이 층으로 쌓인 것을 지층이라고 해요. 물체 표면에 그린 줄무늬와 구별해요.",
   "misconception": "암석이 여러 겹 쌓인 구조와 표면에 그려진 줄무늬를 구별해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b007",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "지층",
    "accepted": [
     "지층"
    ]
   },
   "standard": "6과01-01",
   "accepted": [
    "지층"
   ],
   "previousId": "c22-s51-u01-w029",
   "previousNo": 29,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "암석이 층으로 쌓인 것을 지층이라고 해요. 물체 표면에 그린 줄무늬와 구별해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w011",
   "no": 11,
   "form": "written",
   "topic": "층이 쌓인 순서와 조건",
   "prompt": "세 층의 색과 두께만 보고 가장 두꺼운 층이 가장 오래됐다고 했습니다. 순서를 해석할 조건과 근거를 설명하세요.",
   "answer": "처음 쌓인 순서가 뒤집힘 등으로 바뀌지 않았는지 확인한다. 그런 조건에서 아래층이 위층보다 먼저 쌓였다고 설명하며 색·두께만으로 정확한 나이나 퇴적 기간은 정하지 않는다.",
   "explanation": "상대적인 쌓임 순서와 정확한 형성 연도·기간은 구별해요.",
   "misconception": "두꺼운 층이 반드시 먼저 쌓인 것은 아니에요. 순서 보존 조건과 아래·위 위치를 연결해요.",
   "criteria": "순서 보존 조건과 아래/위 근거 / 색·두께·정확한 나이의 한계",
   "lines": 8,
   "sourceId": "c22-s51-u01-b024",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "처음 쌓인 순서가 뒤집힘 등으로 바뀌지 않았는지 확인한다. 그런 조건에서 아래층이 위층보다 먼저 쌓였다고 설명하며 색·두께만으로 정확한 나이나 퇴적 기간은 정하지 않는다.",
    "rubric": {
     "required": [
      "순서 보존 조건과 아래/위 근거",
      "색·두께·정확한 나이의 한계"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "관찰 근거와 설명을 교사가 확인한다."
    }
   },
   "standard": "6과01-01",
   "previousId": "c22-s51-u01-w033",
   "previousNo": 33,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "상대적인 쌓임 순서와 정확한 형성 연도·기간은 구별해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w012",
   "no": 12,
   "form": "blank",
   "topic": "층의 순서",
   "prompt": "뒤집히거나 순서가 바뀌지 않았다면 [ ]층이 먼저, [ ]층이 나중에 쌓였어요.",
   "answer": "아래 / 위",
   "explanation": "새 퇴적물은 먼저 쌓인 층 위에 쌓여요.",
   "misconception": "먼저·나중에 대응하는 아래·위를 거꾸로 쓰지 않았는지 실제 쌓는 동작으로 확인해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "previousId": "c22-s51-u01-w037",
   "previousNo": 37,
   "origin": "previous46",
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w013",
   "no": 13,
   "form": "order",
   "topic": "층 쌓기",
   "prompt": "진흙 → 모래 → 자갈을 따로 쌓았어요. 뒤집지 않은 모형에서 아래층부터 위층까지 기호로 써요.",
   "answer": "ㄴ → ㄷ → ㄱ",
   "explanation": "먼저 넣은 진흙이 아래에, 마지막에 넣은 자갈이 위에 있어요.",
   "misconception": "자갈이 크다는 이유로 맨 아래에 놓지 않아요. 주어진 따로 넣는 순서를 따라가요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "given": [
    "ㄱ. 자갈층",
    "ㄴ. 진흙층",
    "ㄷ. 모래층"
   ],
   "previousId": "c22-s51-u01-w043",
   "previousNo": 43,
   "origin": "previous46",
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w014",
   "no": 14,
   "form": "draw",
   "topic": "내 모형 설계",
   "prompt": "세 재료를 따로 쌓는 순서를 하나 정해 세 층을 그려요. 아래·가운데·위의 재료와 먼저·나중을 표시해요.",
   "answer": "예: 모래 → 자갈 → 진흙을 넣으면 아래 모래, 가운데 자갈, 위 진흙이다. 아래를 먼저, 위를 나중으로 표시한다. 뒤집거나 깎지 않는 조건을 쓴다.",
   "explanation": "재료 크기가 아니라 자신이 정한 넣는 차례와 층의 위치가 일치해야 해요.",
   "misconception": "그림에서 재료의 위치가 자신이 정한 투입 순서와 맞는지, 순서 보존 조건을 썼는지 봐요.",
   "criteria": "각 재료를 한 번씩 사용하고 넣는 순서·세 위치·먼저/나중·순서 보존 조건이 서로 맞으면 인정해요.",
   "drawing": "large",
   "previousId": "c22-s51-u01-w045",
   "previousNo": 45,
   "origin": "previous46",
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w015",
   "no": 15,
   "form": "choice",
   "topic": "원사진의 관찰 범위",
   "prompt": "지층 사진에서 직접 관찰해 남길 내용으로 알맞은 것을 고르세요.",
   "answer": "④ 보이는 층의 경계와 상대 두께",
   "explanation": "사진의 보이는 범위와 배율·시기 등 미확인을 나누어요.",
   "misconception": "사진에서 비교한 상대 두께를 실제 길이나 퇴적 연수로 바꾸지 않아요.",
   "criteria": "보이는 경계·상대 두께를 고르고 실제 길이·연수와 구별해 설명해요.",
   "standard": "6과01-01",
   "figure": "geoHorizontal",
   "choices": [
    "사진 속 두께만으로 계산한 정확한 퇴적 연수",
    "사진 밖까지 직접 본 것처럼 이어 그린 전체 지층",
    "같은 색의 모든 층이 같은 날 쌓였다는 결론",
    "보이는 층의 경계와 상대 두께",
    "가려진 층의 모든 경계를 확인했다고 쓴 기록"
   ],
   "key": 3
  },
  {
   "id": "c22-s51-u01-w016",
   "no": 16,
   "form": "choice",
   "topic": "형태와 생성 원인",
   "prompt": "세 사진을 비교할 때 먼저 말할 관찰 내용은 무엇인가요?",
   "answer": "① 층 경계의 수평·휘어짐·어긋남",
   "explanation": "보이는 형태를 비교하고 생성 힘·정확한 시기를 임의로 확정하지 않아요.",
   "misconception": "보이는 형태를 말하는 보기와 자료에 없는 생성 원인을 단정한 보기를 나누어요.",
   "criteria": "수평·휘어짐·어긋남을 관찰 특징으로 고르고 생성 힘의 확정과 구별해요.",
   "standard": "6과01-01",
   "figure": "geoShapes",
   "choices": [
    "층 경계의 수평·휘어짐·어긋남",
    "사진만으로 확인한 모든 힘의 정확한 방향과 크기",
    "지구 전체가 이 사진과 같은 날 만들어졌다는 사실",
    "모든 층이 같은 속도로 쌓인 정확한 기간",
    "사진 밖에 있는 모든 층의 뒤집힌 횟수"
   ],
   "key": 0
  },
  {
   "id": "c22-s51-u01-w017",
   "no": 17,
   "form": "multi",
   "topic": "여러 지층의 외형",
   "prompt": "사진의 관찰에 맞는 설명 두 가지를 고르세요.",
   "answer": "②, ④",
   "explanation": "형태를 관찰하고 사진만으로 알 수 없는 원인·수치를 구별해요.",
   "misconception": "휘고 끊어진 층도 관찰 대상이에요. 모든 지층을 수평으로만 한정하지 않아요.",
   "criteria": "휘거나 끊어진 모습도 있음과 같은 관찰 기준 적용을 함께 골라요.",
   "choices": [
    "모든 지층은 반드시 수평으로만 보인다",
    "휘거나 끊어져 보이는 층도 관찰할 수 있다",
    "보이지 않는 힘의 크기를 사진으로 정확히 측정했다",
    "보이는 경계와 형태를 같은 기준으로 비교한다",
    "층의 색만 알면 형성 연도를 정확히 정할 수 있다"
   ],
   "key": [
    1,
    3
   ],
   "standard": "6과01-01",
   "figure": "geoShapes"
  },
  {
   "id": "c22-s51-u01-w018",
   "no": 18,
   "form": "multi",
   "topic": "층 모형의 실제 제작",
   "prompt": "타당한 활동과 설명 두 가지를 고르세요.",
   "answer": "②, ⑤",
   "explanation": "실제 제작·관찰과 계획을 나누며 실패·바뀐 조건도 근거예요.",
   "misconception": "설계와 실제 쌓기를 구별해요. 뭉개진 경계를 감추지 않고 수정 전후를 비교해요.",
   "criteria": "실제 순서 확인과 뭉개짐을 남긴 수정·재비교를 함께 골라요.",
   "choices": [
    "계획 그림만 쓰면 실제 쌓기까지 모두 끝났다",
    "실제 쌓은 차례와 뒤집힘 여부를 확인한다",
    "모형의 몇 초가 실제 지층의 나이이다",
    "순서를 바꾼 모형도 원래 순서였다고 기록한다",
    "경계가 뭉개진 부분은 남기고 한 부분을 고쳐 다시 만든다"
   ],
   "key": [
    1,
    4
   ],
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w019",
   "no": 19,
   "form": "short",
   "topic": "순서만 바꾸는 비교",
   "prompt": "같은 재료·같은 통으로 두 모형을 만들되 자갈→모래→진흙과 진흙→모래→자갈로 비교했어요. 다르게 한 조건을 쓰세요.",
   "answer": "넣는 순서",
   "explanation": "재료를 따로 넣는 차례만 바꾼 비교예요.",
   "misconception": "재료와 통은 그대로 두었어요. 두 모형에서 바꾼 것은 재료를 넣는 차례예요.",
   "criteria": "넣는 순서·쌓는 순서·재료를 넣는 차례 등 같은 뜻을 인정해요.",
   "standard": "6과01-01",
   "accepted": [
    "넣는 순서",
    "쌓는 순서",
    "재료를 넣는 순서",
    "재료를 쌓는 순서"
   ]
  },
  {
   "id": "c22-s51-u01-w020",
   "no": 20,
   "form": "short",
   "topic": "사진 크기와 실제 크기",
   "prompt": "사진이 실제 대상을 몇 배 크게 또는 작게 보여 주는지 나타내는 정보를 무엇이라고 하나요?",
   "answer": "배율",
   "explanation": "그 정보를 모르면 인쇄된 길이를 곧 실제 길이로 쓰지 않아요.",
   "misconception": "인쇄 크기는 실제 길이와 다를 수 있어요. 확대·축소 정도를 나타내는 정보가 필요해요.",
   "criteria": "배율·확대 배율·축소 배율을 인정해요. 실제 길이라는 답과 구별해요.",
   "standard": "6과01-01",
   "accepted": [
    "배율",
    "확대 배율",
    "축소 배율"
   ]
  },
  {
   "id": "c22-s51-u01-w021",
   "no": 21,
   "form": "written",
   "topic": "사진의 상대 두께와 실제 두께",
   "prompt": "지층 사진에서 위쪽 층이 아래쪽 층보다 두껍게 보입니다. 남길 수 있는 관찰과 바로 확정할 수 없는 정보, 더 확인할 자료를 설명하세요.",
   "answer": "사진의 보이는 위치에서 두께가 다르게 보인다고 기록한다. 배율·보는 방향이 없으면 실제 두께cm나 퇴적 기간을 정하지 않고 축척·다른 방향 사진 등 추가 자료를 확인한다.",
   "explanation": "사진 속 상대적인 모습과 실제 길이·기간을 구별해요.",
   "misconception": "두껍게 보인다는 관찰만으로 실제cm나 걸린 시간을 알 수는 없어요.",
   "criteria": "관찰 범위 / 실제 길이·기간 미확인 / 배율·방향 등 추가 자료",
   "lines": 8,
   "standard": "6과01-01",
   "figure": "geoHorizontal"
  },
  {
   "id": "c22-s51-u01-w022",
   "no": 22,
   "form": "written",
   "topic": "큰 자갈과 쌓는 차례",
   "prompt": "진흙→모래→자갈을 한 종류씩 따로 쌓았는데 “자갈이 크니 맨 아래에 있을 것”이라고 했습니다. 이 모형의 조건과 올바른 위치를 설명하세요.",
   "answer": "뒤집거나 깎지 않고 각각 따로 쌓았으므로 처음 넣은 진흙이 아래, 모래가 가운데, 마지막 자갈이 위에 있다. 섞은 재료가 가라앉는 실험과 구별한다.",
   "explanation": "알갱이 크기보다 실제 넣는 차례와 순서 보존 조건이 이 비교의 근거예요.",
   "misconception": "세 재료를 섞어 가라앉힌 실험이 아니에요. 따로 넣은 진흙이 아래, 마지막 자갈이 위예요.",
   "criteria": "따로 쌓음·순서 보존 / 아래·가운데·위 / 섞어 넣는 실험과 구별",
   "lines": 8,
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w023",
   "no": 23,
   "form": "blank",
   "topic": "지층 관찰 항목",
   "prompt": "지층에서는 서로 구별되는 층의 색·상대 ㉠[ ]와 층 사이의 ㉡[ ]를 같은 기준으로 관찰해요.",
   "answer": "㉠ 두께 · ㉡ 경계",
   "explanation": "사진 밖까지 보았다고 하거나 배율 없이 실제cm로 정하지 않아요.",
   "misconception": "색 다음 빈칸에는 층의 두께, 두 층을 구별하는 자리에는 경계를 연결해요.",
   "criteria": "두께와 경계를 각각 맞는 빈칸에 넣었는지 따로 확인해요.",
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w024",
   "no": 24,
   "form": "blank",
   "topic": "먼저 쌓은 층",
   "prompt": "순서가 바뀌지 않은 모형에서 새 재료는 앞선 층의 ㉠[ ]에 쌓여요. 그래서 ㉡[ ]층이 먼저 놓인 층이에요.",
   "answer": "㉠ 위 · ㉡ 아래",
   "explanation": "재료의 색·두께가 아니라 쌓은 순서와 위치를 연결해요.",
   "misconception": "새 층은 앞선 층 위에 놓여요. 먼저 쌓인 층과 나중에 쌓인 층의 위치를 구별해요.",
   "criteria": "위와 아래를 순서대로 연결해요. 먼저·나중의 위치가 뒤집히면 다시 살펴요.",
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w025",
   "no": 25,
   "form": "blank",
   "topic": "계획과 제작",
   "prompt": "층을 어떻게 놓을지 정한 그림은 ㉠[ ]이고, 재료를 실제로 놓아 만든 뒤 살핀 것은 제작과 ㉡[ ]이에요.",
   "answer": "㉠ 설계/계획 · ㉡ 관찰",
   "explanation": "설계만 한 상태를 실제 제작 결과로 바꾸어 쓰지 않아요.",
   "misconception": "계획 그림을 실제 제작·관찰 결과로 적지 않아요. 두 활동의 상태를 나누어요.",
   "criteria": "첫 빈칸은 설계 또는 계획, 둘째는 관찰을 인정해요.",
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w026",
   "no": 26,
   "form": "match",
   "topic": "층 모형 요소의 뜻",
   "prompt": "층 모형의 요소와 뜻을 연결하세요.",
   "answer": "㉠-② · ㉡-③ · ㉢-①",
   "explanation": "층과 순서를 표현한 점과 실제와 다른 점을 함께 설명해요.",
   "misconception": "층을 표현하는 재료·차례를 표현하는 행동·실제와 다른 제작 시간을 서로 구별해요.",
   "criteria": "재료의 층→층 표현, 쌓는 행동→순서 표현, 시간·재료 차이→한계를 연결해요.",
   "parts": [
    "㉠ 구별되는 점토·종이의 층",
    "㉡ 먼저 쌓고 그 위에 차례로 놓기",
    "㉢ 짧은 제작 시간과 인공 재료"
   ],
   "answerPerPart": true,
   "standard": "6과01-01",
   "given": [
    "① 실제 지층과 다른 한계  ② 지층의 층을 표현  ③ 순서가 보존된 쌓임 표현"
   ]
  },
  {
   "id": "c22-s51-u01-w027",
   "no": 27,
   "form": "order",
   "topic": "층 모형을 만들고 고치기",
   "prompt": "쌓는 순서를 정했습니다. 다음 계획을 실행하는 순서를 쓰세요.",
   "answer": "㉢→㉡→㉠→㉣",
   "explanation": "실제 만든 모형을 관찰한 뒤 수정하고 처음 결과도 남겨요.",
   "misconception": "준비와 쌓기 뒤에 실제 모양을 비교해요. 수정한 결과를 처음 결과로 바꾸지 않아요.",
   "criteria": "재료 준비→차례로 쌓기→계획과 비교→한 부분 수정·재비교를 연결해요.",
   "given": [
    "㉠ 실제 경계와 위치를 계획과 비교하기",
    "㉡ 첫째·둘째·셋째 층을 차례로 놓기",
    "㉢ 구별되는 재료·안전한 받침 준비하기",
    "㉣ 바꿀 부분 하나를 정해 다시 만들고 비교하기"
   ],
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w028",
   "no": 28,
   "form": "draw",
   "topic": "두 순서의 층 비교",
   "prompt": "자갈→모래→진흙과 진흙→모래→자갈을 각각 따로 쌓은 모습을 두 칸에 그리세요. 아래·가운데·위 이름과 먼저/나중, 순서 보존 조건을 표시하세요.",
   "answer": "첫째는 아래 자갈·가운데 모래·위 진흙, 둘째는 아래 진흙·가운데 모래·위 자갈이다. 각각 아래 먼저·위 나중, 뒤집거나 깎지 않은 조건을 표시한다.",
   "explanation": "세 재료의 실제 투입 차례와 위치가 일치하는지 확인해요.",
   "misconception": "두 그림 모두 큰 자갈을 아래에 놓지 않아요. 각기 다른 투입 순서에 맞춰 위치를 바꿔요.",
   "criteria": "두 순서 / 세 위치 / 먼저·나중 / 순서 보존 조건",
   "drawing": "large",
   "standard": "6과01-01"
  },
  {
   "id": "c22-s51-u01-w029",
   "no": 29,
   "form": "choice",
   "topic": "퇴적물과 퇴적암의 관계",
   "prompt": "자갈·모래·진흙 등이 물에 실려 와 바닥에 쌓였습니다. 이때 쌓인 물질을 부르는 말은 무엇인가요?",
   "answer": "⑤ 퇴적물",
   "explanation": "옮겨져 쌓인 자갈·모래·진흙 등은 퇴적물이에요. 쌓였다는 것만으로 곧바로 단단한 퇴적암이 되었다고 하지 않아요.",
   "misconception": "실려 와 쌓인 물질은 퇴적물이에요. 쌓였다는 사실만으로 굳은 퇴적암이 된 것은 아니에요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b033",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "standard": "6과01-02",
   "choices": [
    "아직 흐르고 있는 용암",
    "생물의 몸이나 활동이 남은 화석",
    "이미 단단하게 굳어진 퇴적암",
    "땅속에서 녹아 있는 마그마",
    "퇴적물"
   ],
   "key": 4,
   "previousId": "c22-s51-u01-w009",
   "previousNo": 9,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "옮겨져 쌓인 자갈·모래·진흙 등은 퇴적물이에요. 쌓였다는 것만으로 곧바로 단단한 퇴적암이 되었다고 하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w030",
   "no": 30,
   "form": "choice",
   "topic": "퇴적물과 퇴적암의 관계",
   "prompt": "퇴적물이 쌓인 직후 젖은 모래와 오랜 시간 굳은 사암을 비교한 설명으로 맞는 것은 무엇인가요?",
   "answer": "① 쌓인 퇴적물과 굳은 암석을 구별한다.",
   "explanation": "퇴적물이 계속 쌓이고 다져져 굳는 과정과 쌓인 직후의 상태를 나누어요.",
   "misconception": "젖은 모래와 사암은 모두 모래와 관련되지만 다져지고 굳은 상태가 같지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b034",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 4,
    "accepted": [
     4
    ]
   },
   "standard": "6과01-02",
   "choices": [
    "쌓인 퇴적물과 굳은 암석을 구별한다.",
    "젖은 모래는 쌓인 순간 모두 사암이다.",
    "암석이면 어떤 알갱이로 이루어졌는지 볼 수 없다.",
    "모래는 물만 닿으면 어떤 조건에서도 바로 굳는다.",
    "오래 지나면 모든 퇴적물이 같은 색의 이암이 된다."
   ],
   "key": 0,
   "previousId": "c22-s51-u01-w010",
   "previousNo": 10,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "퇴적물이 계속 쌓이고 다져져 굳는 과정과 쌓인 직후의 상태를 나누어요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w031",
   "no": 31,
   "form": "choice",
   "topic": "알갱이 관찰 도구와 비교",
   "prompt": "암석의 작은 알갱이가 눈에 잘 보이지 않습니다. 적절한 관찰 방법은 무엇인가요?",
   "answer": "④ 확대 도구를 쓰고 보이지 않는 부분은 남긴다.",
   "explanation": "돋보기 등으로 실제 특징을 살피고 도구의 한계도 적어요. 맛보기·부수기를 관찰의 필수로 요구하지 않아요.",
   "misconception": "눈으로 안 보인다는 것은 알갱이가 없다는 뜻이 아니에요. 확대해 보되 불분명함도 남겨요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b041",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-02",
   "choices": [
    "안 보이면 알갱이가 전혀 없다고 확정한다.",
    "표본 색이 진하면 알갱이도 반드시 크다고 한다.",
    "관찰 대신 친구가 정한 이름만 복사한다.",
    "확대 도구를 쓰고 보이지 않는 부분은 남긴다.",
    "표본을 맛보아 알갱이 크기를 정한다."
   ],
   "key": 3,
   "previousId": "c22-s51-u01-w011",
   "previousNo": 11,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "돋보기 등으로 실제 특징을 살피고 도구의 한계도 적어요. 맛보기·부수기를 관찰의 필수로 요구하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w032",
   "no": 32,
   "form": "choice",
   "topic": "알갱이 관찰 도구와 비교",
   "prompt": "서로 다른 배율의 암석 사진 두 장을 비교합니다. 주의할 것은 무엇인가요?",
   "answer": "③ 인쇄된 알갱이 크기를 바로 실제 크기로 보지 않는다.",
   "explanation": "배율·축척이 달라지면 사진에 보이는 크기도 달라져요. 같은 관찰 기준인지 확인해요.",
   "misconception": "두 사진의 배율이 다르면 인쇄된 알갱이가 커 보이는 쪽이 실제로 더 크다고 할 수 없어요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b042",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-02",
   "choices": [
    "더 크게 보인 쪽이 어떤 조건에서도 실제 더 크다.",
    "사진 배율을 알면 보이지 않은 알갱이도 다 관찰됐다.",
    "인쇄된 알갱이 크기를 바로 실제 크기로 보지 않는다.",
    "사진 크기가 같으면 실제 배율도 반드시 같다.",
    "색이 같으면 확대율을 확인할 필요가 없다."
   ],
   "key": 2,
   "previousId": "c22-s51-u01-w012",
   "previousNo": 12,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "배율·축척이 달라지면 사진에 보이는 크기도 달라져요. 같은 관찰 기준인지 확인해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w033",
   "no": 33,
   "form": "choice",
   "topic": "이암·사암·역암 분류",
   "prompt": "암석에 자갈처럼 큰 알갱이가 다른 작은 알갱이와 함께 굳어 있습니다. 이 단원의 세 퇴적암 중 알맞은 이름은 무엇인가요?",
   "answer": "② 역암",
   "explanation": "자갈 크기의 큰 알갱이가 뚜렷한 특징을 근거로 역암을 살펴요. 큰 알갱이 사이에 작은 알갱이가 함께 있을 수도 있어요.",
   "misconception": "역암에는 자갈 크기와 작은 알갱이가 함께 있을 수 있어요. 한 작은 알갱이만 고르지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b049",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "standard": "6과01-02",
   "figure": "rock-c.png",
   "choices": [
    "이암",
    "역암",
    "현무암",
    "화강암",
    "사암"
   ],
   "key": 1,
   "previousId": "c22-s51-u01-w013",
   "previousNo": 13,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "자갈 크기의 큰 알갱이가 뚜렷한 특징을 근거로 역암을 살펴요. 큰 알갱이 사이에 작은 알갱이가 함께 있을 수도 있어요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w034",
   "no": 34,
   "form": "choice",
   "topic": "이암·사암·역암 분류",
   "prompt": "주로 모래 크기의 알갱이가 보이는 표본을 이암·사암·역암 중 분류하면 무엇인가요?",
   "answer": "② 사암",
   "explanation": "모래 크기 알갱이를 근거로 사암으로 분류해요. 전체 돌 크기나 색으로 이름을 고르지 않아요.",
   "misconception": "사암의 근거는 모래 크기 구성 알갱이예요. 전체 돌의 크기나 색을 기준으로 바꾸지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b050",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "standard": "6과01-02",
   "figure": "rock-b.png",
   "choices": [
    "전체 돌이 크면 무조건 역암",
    "사암",
    "이암",
    "역암",
    "세 암석 모두 같은 기준 없이 선택"
   ],
   "key": 1,
   "previousId": "c22-s51-u01-w014",
   "previousNo": 14,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "모래 크기 알갱이를 근거로 사암으로 분류해요. 전체 돌 크기나 색으로 이름을 고르지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w035",
   "no": 35,
   "form": "choice",
   "topic": "분류 근거와 미확인",
   "prompt": "붉은색 암석 사진만 보고 사암이라고 확정했습니다. 적절한 판단은 무엇인가요?",
   "answer": "④ 알갱이 특징을 더 확인해야 한다.",
   "explanation": "암석 색은 다양할 수 있어요. 이 단원의 분류 근거인 알갱이 크기를 확인해야 해요.",
   "misconception": "붉은색만으로 사암을 정할 수 없어요. 알갱이 크기가 보이는지 더 확인해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b057",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "standard": "6과01-02",
   "choices": [
    "사암은 언제나 붉은색 하나로만 나타난다.",
    "사진이 있으니 실제 표본 전체를 관찰했다.",
    "색을 확인했으니 알갱이는 볼 필요 없다.",
    "알갱이 특징을 더 확인해야 한다.",
    "붉은색이면 어떤 암석도 사암이 확실하다."
   ],
   "key": 3,
   "previousId": "c22-s51-u01-w015",
   "previousNo": 15,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "암석 색은 다양할 수 있어요. 이 단원의 분류 근거인 알갱이 크기를 확인해야 해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w036",
   "no": 36,
   "form": "choice",
   "topic": "분류 근거와 미확인",
   "prompt": "역암 표본에 작은 알갱이도 보입니다. 자료를 해석한 말 중 맞는 것은 무엇인가요?",
   "answer": "① 자갈 크기와 작은 알갱이가 함께 있을 수 있다.",
   "explanation": "큰 자갈 알갱이 사이에 모래·진흙 같은 작은 알갱이가 섞일 수 있어요. 표본 전체의 특징을 기준으로 살펴요.",
   "misconception": "작은 알갱이가 함께 있다는 이유만으로 자갈 크기의 특징을 무시하지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b061",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 3,
    "accepted": [
     3
    ]
   },
   "standard": "6과01-02",
   "choices": [
    "자갈 크기와 작은 알갱이가 함께 있을 수 있다.",
    "알갱이가 섞이면 퇴적암은 될 수 없다.",
    "작은 알갱이 하나면 역암일 수 없다.",
    "역암의 모든 알갱이는 정확히 같은 크기다.",
    "큰 알갱이를 보았어도 전체 색만으로 다시 정한다."
   ],
   "key": 0,
   "previousId": "c22-s51-u01-w016",
   "previousNo": 16,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "큰 자갈 알갱이 사이에 모래·진흙 같은 작은 알갱이가 섞일 수 있어요. 표본 전체의 특징을 기준으로 살펴요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w037",
   "no": 37,
   "form": "multi",
   "topic": "퇴적물과 퇴적암의 관계",
   "prompt": "퇴적물과 퇴적암을 설명한 내용 중 맞는 두 가지를 고르세요.",
   "answer": "①, ③",
   "explanation": "쌓임과 굳은 암석을 구별하고 구성 알갱이를 직접 관찰해요.",
   "misconception": "쌓인 퇴적물과 다져지고 굳은 퇴적암을 구별하고, 실제 알갱이의 관찰을 근거로 골라요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "choices": [
    "퇴적물이 쌓인 뒤 다져지고 굳을 수 있다.",
    "지층의 모든 층은 색과 재료가 완전히 같다.",
    "알갱이 크기를 보고 세 퇴적암을 비교한다.",
    "쌓인 모래는 그 순간 모두 단단한 사암이다.",
    "전체 돌 크기만 재면 구성 알갱이도 알 수 있다."
   ],
   "key": [
    0,
    2
   ],
   "sourceId": "c22-s51-u01-b038",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     0,
     2
    ]
   },
   "standard": "6과01-02",
   "previousId": "c22-s51-u01-w026",
   "previousNo": 26,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "쌓임과 굳은 암석을 구별하고 구성 알갱이를 직접 관찰해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w038",
   "no": 38,
   "form": "multi",
   "topic": "이암·사암·역암 분류",
   "prompt": "이암·사암·역암을 분류한 설명 중 맞는 두 가지를 고르세요.",
   "answer": "②, ③",
   "explanation": "관찰한 구성 알갱이를 세 퇴적암의 기준과 연결해요. 색·전체 무게를 분류 기준으로 바꾸지 않아요.",
   "misconception": "세 암석에 같은 구성 알갱이 크기 기준을 적용해요. 표본마다 색·무게로 기준을 바꾸지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "choices": [
    "알갱이가 작으면 실제로 알갱이가 없는 암석이다.",
    "진흙처럼 작은 알갱이 중심이면 이암으로 살핀다.",
    "자갈 크기 알갱이가 뚜렷하면 역암으로 살핀다.",
    "가장 무거운 돌은 언제나 역암이다.",
    "붉은 표본은 알갱이에 관계없이 모두 사암이다."
   ],
   "key": [
    1,
    2
   ],
   "sourceId": "c22-s51-u01-b054",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     1,
     2
    ]
   },
   "standard": "6과01-02",
   "previousId": "c22-s51-u01-w027",
   "previousNo": 27,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "관찰한 구성 알갱이를 세 퇴적암의 기준과 연결해요. 색·전체 무게를 분류 기준으로 바꾸지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w039",
   "no": 39,
   "form": "short",
   "topic": "퇴적물과 퇴적암의 관계",
   "prompt": "이 단원에서 이암·사암·역암을 함께 부르는 암석 종류를 쓰세요.",
   "answer": "퇴적암",
   "explanation": "쌓인 퇴적물이 굳어 만들어진 암석을 퇴적암이라고 해요. 세 암석은 알갱이 크기로 비교해요.",
   "misconception": "퇴적물이라는 재료 이름과 퇴적암이라는 굳은 암석 종류를 구별해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b039",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "퇴적암",
    "accepted": [
     "퇴적암"
    ]
   },
   "standard": "6과01-02",
   "accepted": [
    "퇴적암"
   ],
   "previousId": "c22-s51-u01-w030",
   "previousNo": 30,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "쌓인 퇴적물이 굳어 만들어진 암석을 퇴적암이라고 해요. 세 암석은 알갱이 크기로 비교해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w040",
   "no": 40,
   "form": "short",
   "topic": "알갱이 관찰 도구와 비교",
   "prompt": "작은 알갱이를 더 크게 보려고 사용하는 간단한 확대 도구의 이름을 쓰세요.",
   "answer": "돋보기",
   "explanation": "돋보기나 확대경으로 작은 특징을 살필 수 있어요. 실제 사용 여부와 관찰한 부분을 기록해요.",
   "misconception": "돋보기는 관찰을 돕는 도구예요. 도구 이름을 쓴 것과 실제로 관찰한 것은 달라요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b047",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "돋보기",
    "accepted": [
     "돋보기",
     "확대경"
    ]
   },
   "standard": "6과01-02",
   "accepted": [
    "돋보기",
    "확대경"
   ],
   "previousId": "c22-s51-u01-w031",
   "previousNo": 31,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "돋보기나 확대경으로 작은 특징을 살필 수 있어요. 실제 사용 여부와 관찰한 부분을 기록해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w041",
   "no": 41,
   "form": "short",
   "topic": "이암·사암·역암 분류",
   "prompt": "모래 크기의 알갱이를 중심으로 이루어진 퇴적암의 이름을 쓰세요.",
   "answer": "사암",
   "explanation": "모래 알갱이가 다져지고 굳은 암석을 사암으로 살펴요. 이름과 관찰 근거를 연결해요.",
   "misconception": "모래가 관련된다는 이유만으로 모래 더미를 사암이라고 하지 않아요. 굳은 암석의 이름을 써요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b055",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "short-text",
    "answer": "사암",
    "accepted": [
     "사암"
    ]
   },
   "standard": "6과01-02",
   "accepted": [
    "사암"
   ],
   "previousId": "c22-s51-u01-w032",
   "previousNo": 32,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "모래 알갱이가 다져지고 굳은 암석을 사암으로 살펴요. 이름과 관찰 근거를 연결해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w042",
   "no": 42,
   "form": "written",
   "topic": "이암·사암·역암 분류",
   "prompt": "이암·사암·역암을 모아 분류표를 만들려고 합니다. 같은 기준으로 세 암석을 구별하는 근거를 쓰세요.",
   "answer": "암석을 이루는 알갱이 크기를 기준으로 한다. 아주 작은 진흙 알갱이 중심은 이암, 모래 크기 중심은 사암, 자갈 크기가 뚜렷하면 역암으로 나누고 불분명한 표본은 더 관찰한다.",
   "explanation": "표본마다 색·전체 무게 등 다른 기준을 적용하지 않아요.",
   "misconception": "이암·사암·역암을 각각 다른 색이나 전체 크기로 구별하지 않고 같은 알갱이 기준으로 비교해요.",
   "criteria": "구성 알갱이 크기라는 공통 기준 / 세 암석의 근거와 불분명 처리",
   "lines": 8,
   "sourceId": "c22-s51-u01-b056",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "암석을 이루는 알갱이 크기를 기준으로 한다. 아주 작은 진흙 알갱이 중심은 이암, 모래 크기 중심은 사암, 자갈 크기가 뚜렷하면 역암으로 나누고 불분명한 표본은 더 관찰한다.",
    "rubric": {
     "required": [
      "구성 알갱이 크기라는 공통 기준",
      "세 암석의 근거와 불분명 처리"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "관찰 근거와 설명을 교사가 확인한다."
    }
   },
   "standard": "6과01-02",
   "previousId": "c22-s51-u01-w034",
   "previousNo": 34,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "표본마다 색·전체 무게 등 다른 기준을 적용하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w043",
   "no": 43,
   "form": "blank",
   "topic": "알갱이 기준",
   "prompt": "이암·사암·역암은 구성 [ ]의 [ ]를 같은 기준으로 비교해요.",
   "answer": "알갱이 / 크기",
   "explanation": "돌 전체 크기나 색으로 이름을 확정하지 않아요.",
   "misconception": "비교할 크기는 돌 전체의 크기가 아니라 돌을 이루는 알갱이의 크기예요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "previousId": "c22-s51-u01-w038",
   "previousNo": 38,
   "origin": "previous46",
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w044",
   "no": 44,
   "form": "match",
   "topic": "암석 분류",
   "prompt": "〈보기〉의 알맞은 기호를 골라 알갱이와 퇴적암을 연결해요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "같은 기준인 구성 알갱이 크기로 비교해요.",
   "misconception": "진흙·모래·자갈에 대응하는 암석 이름을 같은 알갱이 기준으로 짝지었는지 확인해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "parts": [
    "(1) 진흙처럼 아주 작은 알갱이 중심",
    "(2) 모래 크기 알갱이 중심",
    "(3) 자갈 크기의 알갱이가 뚜렷함"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 역암  ㄴ. 이암  ㄷ. 사암"
   ],
   "previousId": "c22-s51-u01-w041",
   "previousNo": 41,
   "origin": "previous46",
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w045",
   "no": 45,
   "form": "choice",
   "topic": "퇴적물과 퇴적암",
   "prompt": "통에 모래층을 만든 뒤 적절하게 설명한 것을 고르세요.",
   "answer": "⑤ 모래층을 만들었지만 사암을 만든 것은 아니다",
   "explanation": "퇴적물을 쌓는 모형과 오랜 시간 다져지고 굳는 실제 과정을 구별해요.",
   "misconception": "모래를 통에 쌓은 활동은 실제 사암의 다져짐·굳어짐까지 재현한 것이 아니에요.",
   "criteria": "모래층의 쌓임과 사암의 다져짐·굳어짐이 다름을 근거로 골라요.",
   "standard": "6과01-02",
   "choices": [
    "모래를 넣자 실제 사암의 오랜 형성 시간이 모두 끝났다",
    "통의 물이 맑으면 모든 퇴적물이 곧 암석으로 바뀐다",
    "모형을 한 번 보면 실제 모든 퇴적암의 나이를 정확히 안다",
    "모래의 색만 같으면 모든 지층의 환경도 같은 것으로 확정한다",
    "모래층을 만들었지만 사암을 만든 것은 아니다"
   ],
   "key": 4
  },
  {
   "id": "c22-s51-u01-w046",
   "no": 46,
   "form": "choice",
   "topic": "작은 알갱이가 함께 있는 역암",
   "prompt": "가상 기록 다를 분류할 때 타당한 설명을 고르세요.",
   "answer": "③ 큰 자갈 알갱이를 근거로 역암으로 분류한다",
   "explanation": "구성 알갱이의 특징을 전체적으로 살피고 전체 돌 크기·색만으로 분류하지 않아요.",
   "misconception": "기록 다에는 큰 자갈이 뚜렷해요. 작은 알갱이의 존재만으로 이암으로 바꾸지 않아요.",
   "criteria": "기록 다의 자갈 크기 특징을 역암의 근거로 연결해요.",
   "standard": "6과01-02",
   "figure": "geoCompare",
   "choices": [
    "작은 알갱이가 하나라도 보이면 반드시 이암 하나로 분류한다",
    "큰 돌 사진을 더 작게 인쇄하면 실제로 다른 암석이 된다",
    "큰 자갈 알갱이를 근거로 역암으로 분류한다",
    "자갈 크기가 보여도 전체 돌이 작으면 반드시 사암이다",
    "표본의 색이 같으면 알갱이 특징은 더 관찰할 필요가 없다"
   ],
   "key": 2
  },
  {
   "id": "c22-s51-u01-w047",
   "no": 47,
   "form": "multi",
   "topic": "같은 기준으로 암석 분류",
   "prompt": "타당한 분류 방법 두 가지를 고르세요.",
   "answer": "②, ④",
   "explanation": "같은 표본·도구·배율과 관찰 근거를 확인해요.",
   "misconception": "사진 크기의 일치는 배율의 일치를 보장하지 않아요. 흐린 표본은 다시 관찰해요.",
   "criteria": "같은 알갱이 기준 적용과 불분명한 표본의 재관찰을 함께 골라요.",
   "choices": [
    "돌 전체가 가장 크면 언제나 역암이다",
    "세 표본에 구성 알갱이 크기 기준을 적용한다",
    "사진 크기가 같으면 실제 배율도 반드시 같다",
    "알갱이가 불분명한 표본은 더 관찰한다",
    "붉은색 암석이면 알갱이를 보지 않고 사암이라고 정한다"
   ],
   "key": [
    1,
    3
   ],
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w048",
   "no": 48,
   "form": "short",
   "topic": "퇴적암의 구성 재료",
   "prompt": "이암을 이루는 매우 작은 알갱이의 대표 재료를 자갈·모래·진흙 중 골라 쓰세요.",
   "answer": "진흙",
   "explanation": "이 단원은 구성 알갱이 크기를 중심으로 세 퇴적암을 분류해요.",
   "misconception": "세 재료 중 이암에 대응하는 것은 매우 작은 진흙 알갱이예요. 암석 이름과 재료를 구별해요.",
   "criteria": "진흙을 인정해요. 이암은 암석 이름이며 이 질문이 묻는 재료와 달라요.",
   "standard": "6과01-02",
   "accepted": [
    "진흙"
   ]
  },
  {
   "id": "c22-s51-u01-w049",
   "no": 49,
   "form": "written",
   "topic": "두 분류의 다른 근거",
   "prompt": "같은 암석을 한 모둠은 붉은색이라서 사암, 다른 모둠은 모래 크기 알갱이가 보인다고 사암으로 분류했습니다. 두 근거를 비교하고 더 확인할 점을 쓰세요.",
   "answer": "색만으로 확정한 첫 근거는 부족하다. 두 번째처럼 구성 알갱이 크기를 같은 기준으로 관찰하고 표본·도구·배율과 실제 보인 알갱이를 다시 확인한다. 불분명하면 분류를 보류한다.",
   "explanation": "이름이 같아도 사용한 근거가 모두 타당한 것은 아니에요.",
   "misconception": "같은 사암이라는 결론이어도 붉은색이라는 근거와 모래 크기 알갱이라는 근거의 타당성은 달라요.",
   "criteria": "색만으로 확정하지 않음 / 알갱이 크기 기준 / 도구·배율·불분명 재확인",
   "lines": 8,
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w050",
   "no": 50,
   "form": "blank",
   "topic": "알갱이와 도구",
   "prompt": "이암의 알갱이가 눈으로 잘 안 보인다고 알갱이가 ㉠[ ]는 뜻은 아니에요. ㉡[ ] 같은 확대 도구로 더 살펴볼 수 있어요.",
   "answer": "㉠ 없다 · ㉡ 돋보기/확대경",
   "explanation": "미확인과 없음을 구별하고 실제 관찰 범위를 밝혀요.",
   "misconception": "알갱이가 안 보임과 알갱이가 없음을 구별해요. 확대해도 불분명하면 단정하지 않아요.",
   "criteria": "없다와 돋보기 또는 확대경을 각각 확인해요. 관찰 불가와 부재를 구별해요.",
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w051",
   "no": 51,
   "form": "blank",
   "topic": "쌓임과 굳어짐",
   "prompt": "물 등에 실려 와 쌓인 자갈·모래·진흙 등을 ㉠[ ]이라 해요. 이것이 오랫동안 다져지고 굳어 형성된 암석은 ㉡[ ]이에요.",
   "answer": "㉠ 퇴적물 · ㉡ 퇴적암",
   "explanation": "통에 쌓기만 한 것과 실제 암석 형성을 구별해요.",
   "misconception": "퇴적물과 퇴적암을 뒤바꾸지 않아요. 뒤쪽 빈칸은 다져지고 굳어 형성된 암석이에요.",
   "criteria": "퇴적물과 퇴적암을 각각 맞는 빈칸에 넣었는지 확인해요.",
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w052",
   "no": 52,
   "form": "match",
   "topic": "분류표의 같은 기준",
   "prompt": "가상 관찰 기록과 이 단원의 세 퇴적암을 연결하세요.",
   "answer": "㉠-③ · ㉡-① · ㉢-②",
   "explanation": "색·전체 돌의 크기 대신 알갱이 기준을 적용해요.",
   "misconception": "진흙·자갈·모래의 제시 순서와 이암·역암·사암의 대응을 하나씩 확인해요.",
   "criteria": "진흙→이암, 자갈→역암, 모래→사암의 세 대응을 각각 확인해요.",
   "parts": [
    "㉠ 진흙처럼 매우 작은 알갱이 중심",
    "㉡ 자갈 크기 알갱이가 뚜렷함",
    "㉢ 모래 크기의 알갱이 중심"
   ],
   "answerPerPart": true,
   "standard": "6과01-02",
   "given": [
    "① 역암  ② 사암  ③ 이암"
   ]
  },
  {
   "id": "c22-s51-u01-w053",
   "no": 53,
   "form": "match",
   "topic": "미확인과 다음 관찰",
   "prompt": "관찰의 어려움과 다음 방법을 연결하세요.",
   "answer": "㉠-② · ㉡-③ · ㉢-①",
   "explanation": "관찰하지 못한 정보를 지어내지 말고 필요한 근거를 더 모아요.",
   "misconception": "배율 미확인·흐린 알갱이·근거 불일치는 필요한 보완 방법이 서로 달라요.",
   "criteria": "배율→축척 자료, 흐린 알갱이→재관찰, 근거 차이→같은 기준 대조를 연결해요.",
   "parts": [
    "㉠ 사진의 배율을 모름",
    "㉡ 구성 알갱이가 흐려 안 보임",
    "㉢ 두 모둠의 분류 근거가 다름"
   ],
   "answerPerPart": true,
   "standard": "6과01-02",
   "given": [
    "① 같은 표본·기준·도구로 근거를 대조  ② 축척·촬영 조건 자료 확인  ③ 돋보기·더 선명한 자료로 재관찰"
   ]
  },
  {
   "id": "c22-s51-u01-w054",
   "no": 54,
   "form": "order",
   "topic": "표본을 관찰해 분류하기",
   "prompt": "교사가 세 표본을 준비했습니다. 이 분류 계획의 순서를 쓰세요.",
   "answer": "㉢→㉣→㉠→㉡",
   "explanation": "분류 이름을 먼저 정해 관찰 결과를 맞추지 않아요.",
   "misconception": "이름을 먼저 정하고 관찰을 맞추지 않아요. 준비→관찰→분류→재확인 순서예요.",
   "criteria": "도구·조건 확인→알갱이 관찰→이름·근거 분류→재관찰·설명의 순서예요.",
   "given": [
    "㉠ 같은 알갱이 기준으로 이름과 근거 짝짓기",
    "㉡ 불분명한 점을 다시 관찰하고 근거 설명하기",
    "㉢ 표본 이름표·확대 도구와 조건 확인하기",
    "㉣ 구성 알갱이의 보이는 특징 관찰하기"
   ],
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w055",
   "no": 55,
   "form": "draw",
   "topic": "알갱이 분류 안내 카드",
   "prompt": "가상 기록 가·나·다를 알갱이 크기 기준으로 분류하는 안내 카드를 그리세요. 같은 기준과 각 이름의 근거, 불분명할 때의 확인 방법을 표시하세요.",
   "answer": "가 이암·나 사암·다 역암으로 연결하고 매우 작은/모래/자갈 크기 근거를 표시한다. 흐리면 도구·배율을 확인해 재관찰하거나 미확인으로 남긴다고 적는다.",
   "explanation": "학생이 그리는 알갱이는 모식 표현이며 실제 배율 그림이 아니라고 설명해요.",
   "misconception": "그린 알갱이 크기를 실제 배율이라고 주장하지 않아요. 세 분류와 재확인 방법을 함께 표시해요.",
   "criteria": "세 이름·크기 근거 / 같은 기준 / 재확인 / 모식 표현",
   "drawing": "large",
   "standard": "6과01-02",
   "figure": "geoCompare"
  },
  {
   "id": "c22-s51-u01-w056",
   "no": 56,
   "form": "draw",
   "topic": "퇴적물과 퇴적암 비교도",
   "prompt": "통에 모래를 쌓는 모형과 실제 사암 형성을 비교하는 그림을 그리세요. 모형에서 한 일, 실제에서 더 필요한 과정, 재현하지 못한 것을 표시하세요.",
   "answer": "통의 모래 쌓임과 실제 모래가 오랜 시간 다져지고 굳어 사암이 되는 과정을 나누어 그린다. 통 모형은 긴 시간·굳어짐을 재현하지 않았다고 밝힌다.",
   "explanation": "모형을 보고 실제 사암을 바로 만들었다는 결론을 쓰지 않아요.",
   "misconception": "모래를 쌓은 통과 굳은 사암이 만들어지는 실제 과정을 하나의 완료된 실험으로 합치지 않아요.",
   "criteria": "쌓임 / 실제 다져짐·굳어짐 / 시간·재현 한계 / 구별된 설명",
   "drawing": "large",
   "standard": "6과01-02"
  },
  {
   "id": "c22-s51-u01-w057",
   "no": 57,
   "form": "choice",
   "topic": "동물·식물·활동 흔적 화석",
   "prompt": "오랜 과거 생물의 몸이나 활동 흔적이 지층 등에 남은 증거를 무엇이라고 하나요?",
   "answer": "① 화석",
   "explanation": "화석은 과거 생물의 몸이나 활동 흔적이 보존된 증거예요. 오래된 물건·오늘 흔적·비생물 무늬를 모두 화석이라고 하지 않아요.",
   "misconception": "오래되었다는 사실만으로 토기나 모든 무늬가 화석이 되지는 않아요. 생물의 증거인지 확인해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b065",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "화석",
    "모든 오래된 토기",
    "물결이 만든 모든 모래 무늬",
    "오늘 남긴 신발 자국",
    "최근에 떨어진 모든 낙엽"
   ],
   "key": 0,
   "previousId": "c22-s51-u01-w017",
   "previousNo": 17,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "화석은 과거 생물의 몸이나 활동 흔적이 보존된 증거예요. 오래된 물건·오늘 흔적·비생물 무늬를 모두 화석이라고 하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w058",
   "no": 58,
   "form": "choice",
   "topic": "동물·식물·활동 흔적 화석",
   "prompt": "화석으로 살펴볼 수 있는 과거 생물의 활동 흔적은 무엇인가요?",
   "answer": "③ 오래된 지층에 보존된 생물 발자국",
   "explanation": "생물이 살아서 남긴 발자국도 지층 등에 보존되면 화석의 증거가 될 수 있어요. 반드시 몸 전체가 남아야 하는 것은 아니에요.",
   "misconception": "발자국은 몸 일부가 아니라 활동의 증거예요. 오래된 지층에 보존된 맥락도 필요해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b066",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 2,
    "accepted": [
     2
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "바위에 새로 칠한 물감 자국",
    "사람이 만든 오래된 그릇의 무늬",
    "오래된 지층에 보존된 생물 발자국",
    "오늘 운동장에 남은 내 운동화 자국",
    "물결이 모래에 만든 모든 줄무늬"
   ],
   "key": 2,
   "previousId": "c22-s51-u01-w018",
   "previousNo": 18,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "생물이 살아서 남긴 발자국도 지층 등에 보존되면 화석의 증거가 될 수 있어요. 반드시 몸 전체가 남아야 하는 것은 아니에요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w059",
   "no": 59,
   "form": "choice",
   "topic": "화석 생성 모형과 실제",
   "prompt": "점토에 조개 모형을 누른 뒤 떼어냈습니다. 남은 모양이 표현하는 것은 무엇인가요?",
   "answer": "② 생물의 겉모양이 남은 흔적",
   "explanation": "눌러 남긴 겉모양을 관찰하는 모형이에요. 실제 생물이 보존되는 모든 과정·시간·성분을 재현하지 않아요.",
   "misconception": "점토에 남은 것은 교구의 겉모양이에요. 실제 생물의 몸 성분이나 보존 시간을 만든 것은 아니에요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b073",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "실제 화석의 정확한 나이",
    "생물의 겉모양이 남은 흔적",
    "과거 바다의 실제 수온",
    "조개가 반드시 멸종했다는 사실",
    "모든 화석의 완성된 성분"
   ],
   "key": 1,
   "previousId": "c22-s51-u01-w019",
   "previousNo": 19,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "눌러 남긴 겉모양을 관찰하는 모형이에요. 실제 생물이 보존되는 모든 과정·시간·성분을 재현하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w060",
   "no": 60,
   "form": "choice",
   "topic": "화석 생성 모형과 실제",
   "prompt": "생물의 몸 일부가 퇴적물에 빨리 묻혔습니다. 화석 형성에 대한 타당한 설명은 무엇인가요?",
   "answer": "⑤ 반드시 화석이 되는 것은 아니다.",
   "explanation": "빠른 매몰과 단단한 부분 등은 보존 가능성에 관련되지만 모든 생물이 반드시 화석이 되는 것은 아니에요.",
   "misconception": "빨리 묻힘은 보존에 도움이 될 수 있지만 모든 생물이 화석이 된다는 보장은 아니에요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b075",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "한 사례로 모든 화석 생성 방식이 같다고 안다.",
    "빠르게 묻혀도 흔적은 절대로 보존될 수 없다.",
    "묻힌 순간 정확한 종과 나이가 저절로 표시된다.",
    "모든 생물은 죽으면 언제나 화석이 된다.",
    "반드시 화석이 되는 것은 아니다."
   ],
   "key": 4,
   "previousId": "c22-s51-u01-w020",
   "previousNo": 20,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "빠른 매몰과 단단한 부분 등은 보존 가능성에 관련되지만 모든 생물이 반드시 화석이 되는 것은 아니에요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w061",
   "no": 61,
   "form": "choice",
   "topic": "화석으로 과거 환경 추리",
   "prompt": "바다에서 살던 생물이라는 조사 자료와 그 생물의 화석이 지층에서 발견된 자료가 있습니다. 알맞은 추리는 무엇인가요?",
   "answer": "④ 과거 바다와 관련된 환경이었을 수 있다.",
   "explanation": "바다 생물의 생활 자료와 발견 지층을 연결한 추리예요. 현재 환경이나 정확한 수치를 확정하지 않아요.",
   "misconception": "바다 생활 자료와 발견 지층을 함께 연결해요. 지금도 바다라는 결론으로 바꾸지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b081",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "화석 하나로 지구 전체가 같은 환경이었다고 한다.",
    "현재 그 생물이 없으면 과거에도 없었다고 한다.",
    "당시의 정확한 수온과 날짜를 이 자료만으로 안다.",
    "과거 바다와 관련된 환경이었을 수 있다.",
    "지금도 반드시 바다여야 한다고 확정한다."
   ],
   "key": 3,
   "previousId": "c22-s51-u01-w021",
   "previousNo": 21,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "바다 생물의 생활 자료와 발견 지층을 연결한 추리예요. 현재 환경이나 정확한 수치를 확정하지 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w062",
   "no": 62,
   "form": "choice",
   "topic": "화석으로 과거 환경 추리",
   "prompt": "생물 화석이 있는 곳은 지금 산입니다. 과거 환경을 생각하는 방법으로 알맞은 것은 무엇인가요?",
   "answer": "③ 화석과 지층 자료를 함께 살펴 과거를 추리한다.",
   "explanation": "현재의 모습과 과거 환경은 다를 수 있어요. 화석·지층과 생물 생활 자료를 함께 살펴요.",
   "misconception": "지금 산이라는 사실이 과거에도 늘 산이었다는 증거는 아니에요. 과거 자료를 따로 살펴요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b083",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "현재 물이 없으므로 바다 생물 화석은 불가능하다.",
    "지금 산이면 과거에도 언제나 산이었다고 한다.",
    "화석과 지층 자료를 함께 살펴 과거를 추리한다.",
    "산의 높이만으로 정확한 화석 연도를 정한다.",
    "화석이 있으니 오늘도 그 생물이 살아 있다고 한다."
   ],
   "key": 2,
   "previousId": "c22-s51-u01-w022",
   "previousNo": 22,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "현재의 모습과 과거 환경은 다를 수 있어요. 화석·지층과 생물 생활 자료를 함께 살펴요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w063",
   "no": 63,
   "form": "choice",
   "topic": "화석의 가치·보전·설명",
   "prompt": "화석을 가치 있게 보는 까닭으로 알맞은 것은 무엇인가요?",
   "answer": "① 과거 생물과 환경을 알아보는 증거가 된다.",
   "explanation": "화석은 과거의 생물 모습·활동·환경을 알아보는 소중한 자료예요. 하나의 표본이 모든 것을 알려 주지는 않아요.",
   "misconception": "화석은 과거 생물·환경의 증거지만 한 표본이 당시의 모든 생물과 정확한 수치를 알려 주지는 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b089",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 0,
    "accepted": [
     0
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "과거 생물과 환경을 알아보는 증거가 된다.",
    "모든 생물의 현재 수를 즉시 알려 준다.",
    "화석 하나면 과거 모든 날짜를 계산한다.",
    "표본이 예쁘면 출처를 알 필요가 없다.",
    "몸 전체가 없으면 아무 정보도 남지 않는다."
   ],
   "key": 0,
   "previousId": "c22-s51-u01-w023",
   "previousNo": 23,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "화석은 과거의 생물 모습·활동·환경을 알아보는 소중한 자료예요. 하나의 표본이 모든 것을 알려 주지는 않아요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w064",
   "no": 64,
   "form": "choice",
   "topic": "화석의 가치·보전·설명",
   "prompt": "친구가 화석 표본을 만져야만 가치를 알 수 있다고 했습니다. 적절한 말은 무엇인가요?",
   "answer": "⑤ 훼손하지 않고 특징과 자료를 살피며 가치를 배운다.",
   "explanation": "표본·사진·실감형 자료로도 특징과 과거의 증거를 살필 수 있어요. 관찰 방식과 실제 수행 여부는 구별해요.",
   "misconception": "표본을 직접 만져야만 배울 수 있는 것은 아니에요. 사진·자료로도 훼손 없이 특징을 살필 수 있어요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "sourceId": "c22-s51-u01-b092",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "single-choice",
    "answer": 1,
    "accepted": [
     1
    ]
   },
   "standard": "6과01-03",
   "choices": [
    "표본 설명보다 손으로 부순 결과만 중요하다.",
    "출처 없이 이름만 외우면 모든 가치가 확인된다.",
    "모든 표본을 긁어야 과거 환경을 알 수 있다.",
    "사진 관찰은 어떤 학습 근거도 될 수 없다.",
    "훼손하지 않고 특징과 자료를 살피며 가치를 배운다."
   ],
   "key": 4,
   "previousId": "c22-s51-u01-w024",
   "previousNo": 24,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "표본·사진·실감형 자료로도 특징과 과거의 증거를 살필 수 있어요. 관찰 방식과 실제 수행 여부는 구별해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w065",
   "no": 65,
   "form": "multi",
   "topic": "화석 생성 모형과 실제",
   "prompt": "화석 모형과 실제 화석을 비교한 설명 중 맞는 두 가지를 고르세요.",
   "answer": "④, ⑤",
   "explanation": "모형이 보여 준 모습과 실제 화석의 보존을 구별해요. 표현하지 못한 과정은 한계로 남겨요.",
   "misconception": "모형에서 남긴 흔적과 실제 화석의 보존 과정을 같게 보지 않아요. 표현하지 못한 점도 비교해요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "choices": [
    "사람이 누른 점토가 실제 오래된 화석이다.",
    "모형에 이름을 쓰면 실제 생물 종이 확인된다.",
    "모형 한 번이면 모든 화석 생성 방식을 증명한다.",
    "재료·시간과 보존 과정의 차이를 밝힌다.",
    "생물 겉모양이 남는 모습을 표현할 수 있다."
   ],
   "key": [
    3,
    4
   ],
   "sourceId": "c22-s51-u01-b078",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "multi-choice",
    "answers": [
     3,
     4
    ]
   },
   "standard": "6과01-03",
   "previousId": "c22-s51-u01-w028",
   "previousNo": 28,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "모형이 보여 준 모습과 실제 화석의 보존을 구별해요. 표현하지 못한 과정은 한계로 남겨요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w066",
   "no": 66,
   "form": "written",
   "topic": "동물·식물·활동 흔적 화석",
   "prompt": "친구가 화석은 죽은 생물의 몸 전체가 돌이 된 것만 있다고 했습니다. 화석의 여러 증거와 관찰할 특징을 설명하세요.",
   "answer": "몸의 일부나 잎·껍데기 같은 모양뿐 아니라 생물이 살아서 남긴 발자국 등 활동 흔적도 보존될 수 있다. 표본의 보이는 생물 특징과 출처·보존 맥락을 확인하고 오늘 무늬·유물·모형과 구별한다.",
   "explanation": "모든 화석이 몸 전체이거나 모두 같은 방식으로 돌이 된 것은 아니에요. 이 단원에서는 특징이 분명한 동식물 표본을 중심으로 관찰해요.",
   "misconception": "몸 전체·돌로 된 것만 화석이라고 한정하지 않아요. 몸 일부와 살아서 남긴 활동 증거도 살펴요.",
   "criteria": "몸 일부·활동 흔적의 증거 / 출처·특징과 다른 무늬/모형 구별",
   "lines": 8,
   "sourceId": "c22-s51-u01-b072",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "몸의 일부나 잎·껍데기 같은 모양뿐 아니라 생물이 살아서 남긴 발자국 등 활동 흔적도 보존될 수 있다. 표본의 보이는 생물 특징과 출처·보존 맥락을 확인하고 오늘 무늬·유물·모형과 구별한다.",
    "rubric": {
     "required": [
      "몸 일부·활동 흔적의 증거",
      "출처·특징과 다른 무늬/모형 구별"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "관찰 근거와 설명을 교사가 확인한다."
    }
   },
   "standard": "6과01-03",
   "previousId": "c22-s51-u01-w035",
   "previousNo": 35,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "모든 화석이 몸 전체이거나 모두 같은 방식으로 돌이 된 것은 아니에요. 이 단원에서는 특징이 분명한 동식물 표본을 중심으로 관찰해요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w067",
   "no": 67,
   "form": "written",
   "topic": "화석으로 과거 환경 추리",
   "prompt": "지층에서 발견된 바다 생물의 화석으로 과거 환경을 설명하려 합니다. 사용할 근거와 과장하지 않을 결론을 쓰세요.",
   "answer": "화석의 보이는 특징·생물 생활 자료와 발견 지층·출처를 연결한다. 그 지층이 생길 무렵 바다와 관련된 환경이었을 가능성을 추리하되 지금도 바다라는 결론이나 정확한 기온·연도를 하나의 화석으로 확정하지 않는다.",
   "explanation": "현재 위치와 보존 맥락도 함께 확인해 추리의 범위를 밝혀요.",
   "misconception": "바다 생물이라는 생활 자료와 그 지층에 보존되었다는 자료를 연결하되 정확한 수온·연도를 만들지 않아요.",
   "criteria": "화석·생물 생활·발견 맥락 연결 / 과거/현재와 정확한 수치의 한계",
   "lines": 8,
   "sourceId": "c22-s51-u01-b088",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "GFIELD 지층과 화석 창작 학습",
    "course": "초등5-1"
   },
   "sourceContract": {
    "type": "written-explanation",
    "sample": "화석의 보이는 특징·생물 생활 자료와 발견 지층·출처를 연결한다. 그 지층이 생길 무렵 바다와 관련된 환경이었을 가능성을 추리하되 지금도 바다라는 결론이나 정확한 기온·연도를 하나의 화석으로 확정하지 않는다.",
    "rubric": {
     "required": [
      "화석·생물 생활·발견 맥락 연결",
      "과거/현재와 정확한 수치의 한계"
     ],
     "criteria": [
      "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
     ],
     "pass": "관찰 근거와 설명을 교사가 확인한다."
    }
   },
   "standard": "6과01-03",
   "previousId": "c22-s51-u01-w036",
   "previousNo": 36,
   "origin": "previous46",
   "sourceGivens": null,
   "sourceExplanation": "현재 위치와 보존 맥락도 함께 확인해 추리의 범위를 밝혀요.",
   "sourcePool": "items"
  },
  {
   "id": "c22-s51-u01-w068",
   "no": 68,
   "form": "blank",
   "topic": "화석의 증거",
   "prompt": "과거 생물의 [ ]이나 [ ] 흔적이 지층 등에 보존된 증거가 화석이에요.",
   "answer": "몸 / 활동",
   "explanation": "몸 전체가 남지 않더라도 잎·껍데기 일부나 발자국 등이 보존될 수 있어요.",
   "misconception": "몸과 활동의 순서를 확인해요. 발자국은 몸 자체가 아니라 활동 흔적의 예예요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "previousId": "c22-s51-u01-w039",
   "previousNo": 39,
   "origin": "previous46",
   "standard": "6과01-03"
  },
  {
   "id": "c22-s51-u01-w069",
   "no": 69,
   "form": "blank",
   "topic": "추리의 근거",
   "prompt": "과거 환경을 추리하려면 화석의 특징과 생물 [ ] 자료, 화석이 발견된 [ ]을 함께 살펴요.",
   "answer": "생활 / 지층",
   "explanation": "현재의 모습과 과거 환경이 같다고 단정하지 않아요.",
   "misconception": "생물의 생활 자료와 발견 지층은 다른 근거예요. 현재 풍경 하나로 두 근거를 대신하지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "previousId": "c22-s51-u01-w040",
   "previousNo": 40,
   "origin": "previous46",
   "standard": "6과01-03"
  },
  {
   "id": "c22-s51-u01-w070",
   "no": 70,
   "form": "match",
   "topic": "관찰과 추리",
   "prompt": "직접 보이는 특징과 그 특징을 근거로 한 추리를 연결해요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "근거와 결론을 연결하고 정확한 형성 연도·수온은 다른 자료가 필요함을 구별해요.",
   "misconception": "관찰한 근거마다 지지하는 결론이 달라요. 알갱이·층 위치·화석의 맥락을 서로 바꾸지 않아요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "parts": [
    "(1) 아래층이라는 위치와 순서 보존 조건",
    "(2) 모래 크기 알갱이라는 관찰",
    "(3) 바다 생물 화석과 발견 맥락"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 사암으로 분류  ㄴ. 과거 바다 관련 환경 추리  ㄷ. 위층보다 먼저 쌓임"
   ],
   "previousId": "c22-s51-u01-w042",
   "previousNo": 42,
   "origin": "previous46",
   "standard": "6과01-03"
  },
  {
   "id": "c22-s51-u01-w071",
   "no": 71,
   "form": "order",
   "topic": "화석 모양 모형",
   "prompt": "조개 겉모양이 남는 점토 모형을 만드는 순서대로 배열해요.",
   "answer": "ㄴ → ㄹ → ㄷ → ㄱ",
   "explanation": "겉모양이 남는 모습을 표현해요. 실제 화석이 생성되는 오랜 시간·모든 과정을 재현한 것은 아니에요.",
   "misconception": "교구를 떼기 전에 점토에 눌러요. 남은 모양 관찰은 실제 화석과의 차이 비교로 이어져요.",
   "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
   "given": [
    "ㄱ. 남은 모양을 관찰하고 실제 화석과 다른 점을 설명한다",
    "ㄴ. 점토를 평평하게 편다",
    "ㄷ. 교구를 조심스럽게 떼어 낸다",
    "ㄹ. 조개 모양 교구를 점토에 누른다"
   ],
   "previousId": "c22-s51-u01-w044",
   "previousNo": 44,
   "origin": "previous46",
   "standard": "6과01-03"
  },
  {
   "id": "c22-s51-u01-w072",
   "no": 72,
   "form": "draw",
   "topic": "증거로 과거 그리기",
   "prompt": "가상 자료를 읽고 이 지층이 쌓일 무렵의 환경을 그려요. 관찰·생활 자료에서 가져온 근거 두 가지와 아직 알 수 없는 것 한 가지를 덧붙여요.",
   "answer": "바다와 관련된 환경을 그린다. 지층 속 화석이 그 자리에 보존되었다는 발견 자료와 바다에서 살았다는 생물 생활 자료를 근거로 쓴다. 정확한 수온·연도 등은 알 수 없다고 쓴다.",
   "explanation": "상상한 풍경과 자료로 뒷받침한 내용의 범위를 구별해요.",
   "misconception": "상상해서 그린 장면과 제공 자료가 뒷받침하는 과거 바다 환경을 나누고 미확인 정보도 밝혀요.",
   "criteria": "발견 맥락·생물 생활을 모두 근거로 들고 과거 바다 관련 환경과 미확인 정보를 나누면 인정해요.",
   "drawing": "large",
   "given": [
    "〈가상 학습 자료〉 산의 지층에서 화석 A를 발견했다. 옮겨온 돌이 아니라 그 지층에 보존된 것으로 조사했다.",
    "생물 생활 자료: A는 바다에서 살던 생물이다. 이 자료에는 당시 수온과 정확한 연도가 없다."
   ],
   "previousId": "c22-s51-u01-w046",
   "previousNo": 46,
   "origin": "previous46",
   "standard": "6과01-03"
  },
  {
   "id": "c22-s51-u01-w073",
   "no": 73,
   "form": "choice",
   "topic": "몸과 활동의 증거",
   "prompt": "화석의 증거를 바르게 설명한 것을 고르세요.",
   "answer": "② 과거 생물의 몸 일부나 활동 흔적도 보존될 수 있다",
   "explanation": "생물의 증거와 지질학적 보존 맥락을 함께 살펴요.",
   "misconception": "오늘의 발자국·물결무늬·토기를 모두 화석으로 부르지 않아요. 몸이나 활동의 보존 증거를 찾아요.",
   "criteria": "몸 일부와 활동 흔적도 보존될 수 있음을 고르고 비생물 무늬와 구별해요.",
   "standard": "6과01-03",
   "choices": [
    "오늘 남긴 모든 신발 자국은 이미 화석으로 확정된다",
    "과거 생물의 몸 일부나 활동 흔적도 보존될 수 있다",
    "바람과 물결이 만든 모든 무늬는 생물 활동 화석이다",
    "사람이 만든 오래된 토기는 모두 생물의 화석이다",
    "몸 전체가 하나도 빠짐없이 돌이 된 것만 화석이다"
   ],
   "key": 1
  },
  {
   "id": "c22-s51-u01-w074",
   "no": 74,
   "form": "choice",
   "topic": "화석 사진과 환경 추리",
   "prompt": "물고기 화석 사진으로 과거 환경을 추리하려 합니다. 더 확인할 근거를 고르세요.",
   "answer": "④ 생물의 생활 자료와 화석이 발견된 지층",
   "explanation": "모양만으로 바다·강·호수를 확정하지 않아요. 생활과 발견 맥락을 연결해요.",
   "misconception": "물고기처럼 보인다는 이유로 바다를 확정하지 않아요. 생활 환경과 발견 지층의 자료가 더 필요해요.",
   "criteria": "생물의 생활 자료와 발견 지층을 함께 고르고 사진만의 추리와 구별해요.",
   "standard": "6과01-03",
   "figure": "geoFish",
   "choices": [
    "물고기처럼 보이면 바다라고 정한 나의 첫 느낌",
    "사진 파일의 크기와 공책 표지의 색깔",
    "사진을 크게 인쇄한 횟수와 화면 밝기",
    "생물의 생활 자료와 화석이 발견된 지층",
    "자료에 없는 실제 수온을 임의로 적은 숫자"
   ],
   "key": 3
  },
  {
   "id": "c22-s51-u01-w075",
   "no": 75,
   "form": "multi",
   "topic": "흔적 모형과 실제 화석",
   "prompt": "점토 흔적 모형의 타당한 해석 두 가지를 고르세요.",
   "answer": "①, ④",
   "explanation": "겉모양 표현과 실제 보존의 모든 과정을 구별해요.",
   "misconception": "점토에 겉모양이 남아도 실제 보존의 긴 시간과 모든 과정이 재현된 것은 아니에요.",
   "criteria": "겉모양 표현과 실제와 다른 재료·시간·과정을 함께 골라요.",
   "choices": [
    "교구의 겉모양이 남는 모습을 표현할 수 있다",
    "사람이 누르면 실제 생물의 보존 시간이 모두 재현된다",
    "모형이 잘 나오면 모든 생물은 반드시 화석이 된다",
    "실제 화석과 재료·시간·과정이 다른 점을 밝힌다",
    "모형 사진만 있으면 실제 화석의 정확한 종과 나이를 안다"
   ],
   "key": [
    0,
    3
   ],
   "standard": "6과01-03"
  },
  {
   "id": "c22-s51-u01-w076",
   "no": 76,
   "form": "short",
   "topic": "활동을 보여 주는 증거",
   "prompt": "오랜 과거 동물의 발자국이 지층에 보존되었어요. 몸의 일부와 활동 흔적 중 어느 증거인지 쓰세요.",
   "answer": "활동 흔적",
   "explanation": "살아 있을 때 남긴 활동의 흔적도 화석으로 보존될 수 있어요.",
   "misconception": "발자국은 살아서 남긴 활동의 흔적이에요. 몸의 일부가 남았다는 답과 구별해요.",
   "criteria": "활동 흔적·생물의 활동 증거 등 같은 뜻을 인정해요. 몸 일부라는 답과 구별해요.",
   "standard": "6과01-03",
   "accepted": [
    "활동 흔적",
    "생물 활동 흔적",
    "활동의 흔적"
   ]
  },
  {
   "id": "c22-s51-u01-w077",
   "no": 77,
   "form": "written",
   "topic": "현재 산과 과거 환경",
   "prompt": "별도 연습 자료를 이용해 과거 환경의 추리와 아직 확인하지 못한 것을 나누어 설명하세요.",
   "answer": "지층에 보존된 화석이라는 발견 맥락과 A가 바다에서 살았다는 생활 자료를 연결해 그 지층이 형성될 무렵 바다와 관련된 환경이었을 가능성을 추리한다. 지금도 바다라는 결론이나 정확한 수온·연도는 확정하지 않는다.",
   "explanation": "현재 장소와 과거 환경을 같다고 정하지 않고 두 근거를 함께 사용해요.",
   "misconception": "현재 산의 모습만으로 과거를 정하지 않아요. 발견 지층과 바다 생활 자료를 함께 써요.",
   "criteria": "발견 지층·생활 자료 / 과거 환경의 가능성 / 현재·정확한 수치의 한계",
   "lines": 8,
   "standard": "6과01-03",
   "figure": "geoPast"
  },
  {
   "id": "c22-s51-u01-w078",
   "no": 78,
   "form": "blank",
   "topic": "환경 추리의 두 근거",
   "prompt": "화석으로 과거 환경을 추리할 때는 생물이 살던 ㉠[ ] 자료와 화석이 발견된 ㉡[ ]의 맥락을 함께 확인해요.",
   "answer": "㉠ 생활 · ㉡ 지층",
   "explanation": "화석의 모양 하나로 과거의 모든 환경을 확정하지 않아요.",
   "misconception": "생물의 생활과 화석의 발견 지층을 연결해요. 사진의 모양만으로 환경을 정하지 않아요.",
   "criteria": "생활과 지층을 각각 확인하고 두 근거가 지지하는 추리를 설명해요.",
   "standard": "6과01-03"
  },
  {
   "id": "c22-s51-u01-w079",
   "no": 79,
   "form": "match",
   "topic": "화석의 가치와 근거",
   "prompt": "화석을 살펴 알 수 있는 내용과 필요한 근거를 연결하세요.",
   "answer": "㉠-③ · ㉡-① · ㉢-②",
   "explanation": "관찰한 모습·추리의 근거·모형 한계를 나누어요.",
   "misconception": "생김새 관찰·환경 추리·모형 비교에 각각 필요한 근거가 무엇인지 구분해요.",
   "criteria": "생김새→보존된 특징, 환경→생활·발견 지층, 모형 차이→재료·시간·과정을 연결해요.",
   "parts": [
    "㉠ 과거 생물의 생김새",
    "㉡ 과거 생물이 살던 환경",
    "㉢ 모형과 실제 화석의 차이"
   ],
   "answerPerPart": true,
   "standard": "6과01-03",
   "given": [
    "① 생물 생활 자료와 발견 지층  ② 재료·제작 시간·보존 과정 비교  ③ 화석에 보존된 몸·잎 등의 특징"
   ]
  },
  {
   "id": "c22-s51-u01-w080",
   "no": 80,
   "form": "draw",
   "topic": "화석 겉모양 모형 안내",
   "prompt": "안전한 실온 점토와 조개 모양 교구로 흔적 모형을 만드는 안내 그림을 그리세요. 누르기 전·누르기·떼어 낸 뒤와 관찰할 특징, 실제 화석과 다른 점을 넣으세요.",
   "answer": "점토와 교구 준비→가볍게 누르기→조심히 떼어 윤곽·무늬 관찰을 표시한다. 실온의 안전한 교구로 하며 실제 보존 시간·모든 과정을 재현하지 못한다고 밝힌다.",
   "explanation": "그림 뒤 실제로 만들어 겉모양을 비교해요. 계획 그림만 있으면 제작 완료가 아니에요.",
   "misconception": "안내 그림만 그린 상태는 제작 전이에요. 실제로 누르고 떼어 윤곽·무늬를 확인해야 해요.",
   "criteria": "세 단계 / 윤곽·무늬 / 안전한 재료 / 실제와 다른 시간·과정",
   "drawing": "large",
   "standard": "6과01-03"
  }
 ],
 "pages": [
  {
   "section": "교과 연결 사고력",
   "title": "지층과 화석",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoHorizontal",
     "caption": ""
    },
    {
     "type": "text",
     "text": "지층의 모습을 관찰하고 쌓임을 모형으로 표현해요. 퇴적암을 알갱이로 분류하고, 화석과 생활 자료에서 과거의 증거를 찾아 설명해요."
    },
    {
     "type": "field",
     "title": "처음 생각",
     "hint": "큰 자갈은 언제나 맨 아래일까요? 화석은 생물의 몸 전체가 돌로 된 것만 있을까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·알갱이·화석은 각각 다른 판단의 근거예요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰한 것·모형이 보여 준 것과 과거를 추리한 내용을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "관찰하고 · 만들고 · 분류하고 · 근거로 추리하는 과학",
   "kind": "opener"
  },
  {
   "section": "배움의 지도",
   "title": "세 질문으로 땅의 이야기를 읽어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "현행 성취기준",
      "배울 내용·연습 번호"
     ],
     "rows": [
      [
       "6과01-01",
       "지층 특징·쌓임 모형 / 1~28번"
      ],
      [
       "6과01-02",
       "퇴적물·세 퇴적암 분류 / 29~56번"
      ],
      [
       "6과01-03",
       "화석 관찰·모형·과거 추리 / 57~80번"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "사진·자료·예제에서 판단의 근거를 찾아요.",
      "객관식·복수선택·단답·서술·빈칸·연결·순서·그림으로 연습해요.",
      "층 모형과 겉모양 흔적 모형을 직접 만들고 실제와 비교해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "나의 질문",
     "hint": "더 관찰할 층·암석·화석의 특징과 알아볼 점을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문제의 정답과 실제 관찰·제작 완료는 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "교사 준비 표본·안전한 실온 재료로 활동하고 위험한 절벽에 접근하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "지층의 보이는 특징",
   "title": "경계·색·상대 두께와 형태",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoShapes",
     "caption": ""
    },
    {
     "type": "field",
     "title": "같은 기준으로 관찰",
     "hint": "세 사진의 공통점과 차이를 보이는 근거로 설명해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "아직 모르는 것",
     "hint": "가려진 부분·사진 배율·정확한 형성 시기 중 더 확인할 것을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평·휘어짐·끊어짐의 보이는 모습을 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "이 단원에서는 생성 힘의 정확한 방향·크기나 사진 밖 전체 모습을 정답으로 요구하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "층 쌓기 모형 비교",
   "title": "넣는 차례와 층의 위치",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoStrata",
     "caption": ""
    },
    {
     "type": "field",
     "title": "두 조건의 비교",
     "hint": "넣는 순서가 다른 두 기록에서 아래·위 재료가 어떻게 달라졌는지 써요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "순서를 읽을 조건",
     "hint": "먼저/나중을 설명하려면 무엇을 확인해야 하나요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뒤집거나 깎지 않아 순서가 보존된 조건에서 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "큰 알갱이가 무조건 아래라는 설명 대신 따로 넣은 차례와 위치를 연결해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "층 모형 실제 만들기",
   "title": "계획과 제작·관찰을 이어 가요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoClay",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "구별되는 실온 점토나 종이 띠 세 종류와 받침을 준비해요.",
      "넣을 차례를 정하고 실제로 첫째·둘째·셋째 층을 위에 쌓아요.",
      "앞면의 경계와 위치를 계획과 비교하고 바뀐 조건·뭉개진 부분도 살펴요.",
      "한 부분을 고쳐 다시 만들고 처음/수정 모형의 근거를 설명해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "실제와 다른 점",
     "hint": "내 모형의 재료·시간·굳는 과정 중 실제 지층과 다른 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "새 층은 앞선 층 위에 쌓여요. 모형은 실제 암석의 긴 형성 시간을 재현하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "교사와 활동하며 점토를 먹거나 가열·절단·세게 밀지 않아요. 사진의 절단 절차를 따라 하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "퇴적물과 퇴적암",
   "title": "쌓는 것과 굳어지는 것은 달라요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "단계",
      "이 단원에서 살펴볼 것"
     ],
     "rows": [
      [
       "퇴적물",
       "물 등에 실려 와 쌓인 자갈·모래·진흙 등"
      ],
      [
       "퇴적암",
       "퇴적물이 오랫동안 다져지고 굳어 만들어진 암석"
      ]
     ]
    },
    {
     "type": "example",
     "question": "통에 모래를 쌓으면 사암을 만든 걸까요?",
     "steps": [
      [
       "한 일",
       "모래를 층으로 쌓는 모습을 살폈어요."
      ],
      [
       "더 필요한 과정",
       "실제 다져지고 굳어지는 과정을 재현하지 않았어요."
      ]
     ],
     "answer": "쌓임 모형과 실제 사암 형성을 구별해요."
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "모형이 보여 준 것과 재현하지 못한 것을 나누어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 단원에서 살피는 지층은 퇴적암으로 이루어져 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "모형의 몇 초·몇 분을 실제 형성 연도·기간으로 바꾸지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "알갱이 관찰",
   "title": "전체 돌과 구성 알갱이를 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoRocks",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "geoRockRecords",
     "caption": ""
    },
    {
     "type": "field",
     "title": "관찰 도구와 근거",
     "hint": "같은 표본·도구·배율에서 구성 알갱이를 어떻게 확인할지 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "크기 기준은 전체 돌 크기나 사진 크기와 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "눈에 잘 안 보임과 알갱이가 없음을 구별해요. 돋보기나 선명한 자료로 보완해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "퇴적암 분류",
   "title": "세 암석에 같은 기준 적용하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "구성 알갱이의 대표 특징",
      "이 단원의 분류"
     ],
     "rows": [
      [
       "구성 알갱이가 매우 작아 눈으로 낱낱이 구별하기 어렵다",
       "이암"
      ],
      [
       "주로 모래 크기의 알갱이가 보인다",
       "사암"
      ],
      [
       "자갈 크기의 큰 알갱이가 작은 알갱이와 함께 굳어 있다",
       "역암"
      ]
     ]
    },
    {
     "type": "example",
     "question": "역암에 작은 알갱이도 보인다면?",
     "steps": [
      [
       "관찰",
       "자갈 크기가 작은 알갱이와 함께 굳어 있어요."
      ],
      [
       "분류",
       "한 작은 알갱이만 고르지 않고 구성 특징을 살펴요."
      ]
     ],
     "answer": "작은 알갱이가 함께 있다는 이유만으로 이암이라고 바꾸지 않아요."
    },
    {
     "type": "field",
     "title": "분류 재검토",
     "hint": "두 모둠의 분류가 다를 때 확인할 기준과 관찰 방법을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이암·사암·역암은 구성 알갱이 크기를 기준으로 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "표본마다 다른 기준을 적용하지 않아요. 색·전체 크기·다수결로 이름을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "화석 사진 관찰",
   "title": "보이는 모습과 자료 설명을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoFish",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "geoFern",
     "caption": ""
    },
    {
     "type": "field",
     "title": "사진에서 본 특징",
     "hint": "몸·뼈·지느러미나 잎의 모양에서 보이는 특징을 짧게 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이는 특징과 정확한 종·발견 장소·형성 연도를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진에 눈금이 없으면 화석의 실제 크기를 재지 않아요. 닮은 모습만으로 생활 환경을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "화석의 여러 증거",
   "title": "몸 일부와 활동 흔적도 살펴요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "생물의 증거 예",
      "구별할 점"
     ],
     "rows": [
      [
       "뼈·껍데기·잎 등의 일부",
       "몸 전체가 모두 남아야만 하는 것은 아님"
      ],
      [
       "발자국·굴을 판 흔적 등",
       "살아 있을 때 남긴 활동의 증거일 수도 있음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "오해 고치기",
     "hint": "“오래된 물건이나 모든 무늬는 화석이다”를 근거와 함께 고쳐요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "text",
     "text": "화석은 지층 등 지질학적 맥락에 보존된 생물의 증거예요. 오래된 토기·오늘의 발자국·물결무늬를 모두 화석으로 부르지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "과거 생물의 증거인지와 보존 맥락을 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "일부 화석만 보고 모든 화석이 몸 전체·돌·퇴적암뿐이라고 일반화하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "겉모양 흔적 모형 만들기",
   "title": "안전한 재료로 누르고 떼어 관찰해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사 준비 실온 점토·받침·안전한 조개 모양 교구를 준비해요.",
      "누르기 전 교구의 겉모양을 살피고 점토 표면을 고르게 해요.",
      "가볍게 눌렀다 조심히 떼어 남은 윤곽·무늬를 비교해요.",
      "뭉개진 부분을 남기고 누르는 방법 한 가지를 고쳐 다시 해 봐요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "모형 계획과 관찰할 것",
     "hint": "세 단계의 계획과 관찰할 특징을 그려 보아요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "text",
     "text": "교구·점토를 입에 넣지 않고 활동 후 손을 씻어요. 가열·칼·깨지는 교구·수지/경화제를 쓰지 않아요. 그림만 그렸다면 아직 제작 전이에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 생물의 겉모양이 남는 모습을 표현해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 오래된 화석이나 모든 화석 보존의 시간·과정을 만든 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "모형과 실제 비교",
   "title": "같은 점과 다른 점을 근거로 설명해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "모형에서 살핀 것",
      "실제 화석과 다른 점"
     ],
     "rows": [
      [
       "겉모양의 윤곽·무늬가 남음",
       "사람이 짧은 시간에 점토로 만듦"
      ],
      [
       "남은 모양·뭉개짐을 비교함",
       "모든 생물의 보존·굳어짐·오랜 시간을 재현하지 않음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "비교 설명",
     "hint": "모형이 표현하는 점과 재현하지 못한 점 두 가지를 나누어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "text",
     "text": "빠른 매몰과 단단한 부분 등은 보존 가능성을 높일 수 있어요. 그렇다고 모든 생물이 반드시 화석이 되는 것은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "만든 모형의 장점과 한계를 함께 말해요."
    },
    {
     "title": "더 알아보기",
     "text": "한 번의 모형 제작으로 모든 화석의 형성 방식을 증명했다고 하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "과거 환경 추리",
   "title": "화석·생활·발견 맥락을 함께 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoPast",
     "caption": ""
    },
    {
     "type": "example",
     "question": "지금 산이므로 과거에도 늘 산이었을까요?",
     "steps": [
      [
       "근거 연결",
       "A의 바다 생활과 그 지층에 보존된 화석이라는 자료를 연결해요."
      ],
      [
       "추리 범위",
       "그 지층이 형성될 무렵 바다 관련 환경이었을 가능성을 설명해요."
      ]
     ],
     "answer": "현재 모습과 과거 환경이 반드시 같다는 뜻은 아니에요."
    },
    {
     "type": "field",
     "title": "확인한 것과 미확인",
     "hint": "사용한 두 근거와 더 확인해야 할 정보를 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞의 물고기 사진만으로 바다 환경이라고 정한 것이 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "정확한 수온·연도·모든 생물 수를 이 자료만으로 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "화석의 가치와 설명",
   "title": "근거를 찾아 실제로 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "화석은 과거 어떤 생물이 살았고 어떤 환경과 관계가 있었는지 알아보는 데 도움을 줘요. 교사 선정 박물관·기관 자료에서 관심 있는 화석 하나를 더 살펴요."
    },
    {
     "type": "field",
     "title": "내가 소개할 근거",
     "hint": "화석의 특징·생활 자료·발견 지층과 출처를 정리해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "질문을 듣고 보완하기",
     "hint": "실제로 들은 질문과 고친 설명, 아직 할 계획을 나누어요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "diagram",
     "key": "geoSources",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 설명·질문과 아직 나누지 않은 계획은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "화석 표본을 깨거나 긁지 않아요. 직접 만져야만 가치를 알 수 있는 것도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "한눈에 정리",
   "title": "서로 다른 세 근거 연결하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "판단할 내용",
      "필요한 근거"
     ],
     "rows": [
      [
       "어느 층이 먼저일까?",
       "순서가 보존된 조건과 아래·위 위치"
      ],
      [
       "이암·사암·역암 중 무엇일까?",
       "구성 알갱이 크기의 같은 기준"
      ],
      [
       "과거 환경은 어땠을까?",
       "화석·생물 생활·발견 지층의 맥락"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 핵심 설명",
     "hint": "세 근거 중 하나를 골라 관찰→판단→한계를 한 문장씩 정리해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이름만 외우지 말고 어떤 자료로 판단했는지 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모형·실물 관찰·자료 읽기와 추리의 범위를 나누면 타당한 다른 표현도 인정할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 1~2",
   "title": "지층의 층·경계·색과 두께",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w001",
      "c22-s51-u01-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 3",
   "title": "지층의 모양·관찰 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 4",
   "title": "지층의 모양·관찰 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 5",
   "title": "층이 쌓인 순서와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 6~7",
   "title": "층이 쌓인 순서와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w006",
      "c22-s51-u01-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 8~9",
   "title": "지층 형성 모형과 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w008",
      "c22-s51-u01-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 10",
   "title": "지층의 층·경계·색과 두께",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 11",
   "title": "층이 쌓인 순서와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 12~13",
   "title": "층의 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w012",
      "c22-s51-u01-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 14",
   "title": "내 모형 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 15",
   "title": "원사진의 관찰 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 16",
   "title": "형태와 생성 원인",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 17",
   "title": "여러 지층의 외형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 18~19",
   "title": "층 모형의 실제 제작",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w018",
      "c22-s51-u01-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 20",
   "title": "사진 크기와 실제 크기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 21",
   "title": "사진의 상대 두께와 실제 두께",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 22",
   "title": "큰 자갈과 쌓는 차례",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 23~24",
   "title": "지층 관찰 항목",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w023",
      "c22-s51-u01-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 25~26",
   "title": "계획과 제작",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w025",
      "c22-s51-u01-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 27",
   "title": "층 모형을 만들고 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 28",
   "title": "두 순서의 층 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 29~30",
   "title": "퇴적물과 퇴적암의 관계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w029",
      "c22-s51-u01-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 31~32",
   "title": "알갱이 관찰 도구와 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w031",
      "c22-s51-u01-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 33",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 34",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 35~36",
   "title": "분류 근거와 미확인",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w035",
      "c22-s51-u01-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 37~38",
   "title": "퇴적물과 퇴적암의 관계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w037",
      "c22-s51-u01-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 39~40",
   "title": "퇴적물과 퇴적암의 관계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w039",
      "c22-s51-u01-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 41",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 42",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 43~44",
   "title": "알갱이 기준",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w043",
      "c22-s51-u01-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 45",
   "title": "퇴적물과 퇴적암",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 46",
   "title": "작은 알갱이가 함께 있는 역암",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 47~48",
   "title": "같은 기준으로 암석 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w047",
      "c22-s51-u01-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 49",
   "title": "두 분류의 다른 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 50~51",
   "title": "알갱이와 도구",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w050",
      "c22-s51-u01-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 52~53",
   "title": "분류표의 같은 기준",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w052",
      "c22-s51-u01-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 54",
   "title": "표본을 관찰해 분류하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 55",
   "title": "알갱이 분류 안내 카드",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 56",
   "title": "퇴적물과 퇴적암 비교도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 57~58",
   "title": "동물·식물·활동 흔적 화석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w057",
      "c22-s51-u01-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 59~60",
   "title": "화석 생성 모형과 실제",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w059",
      "c22-s51-u01-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 61~62",
   "title": "화석으로 과거 환경 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w061",
      "c22-s51-u01-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 63~64",
   "title": "화석의 가치·보전·설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w063",
      "c22-s51-u01-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 65",
   "title": "화석 생성 모형과 실제",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 66",
   "title": "동물·식물·활동 흔적 화석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 67",
   "title": "화석으로 과거 환경 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 68~69",
   "title": "화석의 증거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w068",
      "c22-s51-u01-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 70~71",
   "title": "관찰과 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w070",
      "c22-s51-u01-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 72",
   "title": "증거로 과거 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 73",
   "title": "몸과 활동의 증거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 74",
   "title": "화석 사진과 환경 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 75~76",
   "title": "흔적 모형과 실제 화석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w075",
      "c22-s51-u01-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 77",
   "title": "현재 산과 과거 환경",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 78~79",
   "title": "환경 추리의 두 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w078",
      "c22-s51-u01-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 80",
   "title": "화석 겉모양 모형 안내",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
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
      "c22-s51-u01-w001",
      "c22-s51-u01-w002",
      "c22-s51-u01-w003",
      "c22-s51-u01-w004"
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
   "section": "정답·해설 5~8",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w005",
      "c22-s51-u01-w006",
      "c22-s51-u01-w007",
      "c22-s51-u01-w008"
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
   "section": "정답·해설 9~11",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w009",
      "c22-s51-u01-w010",
      "c22-s51-u01-w011"
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
   "section": "정답·해설 12~14",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w012",
      "c22-s51-u01-w013",
      "c22-s51-u01-w014"
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
   "section": "정답·해설 15~18",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w015",
      "c22-s51-u01-w016",
      "c22-s51-u01-w017",
      "c22-s51-u01-w018"
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
   "section": "정답·해설 19~21",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w019",
      "c22-s51-u01-w020",
      "c22-s51-u01-w021"
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
      "c22-s51-u01-w022",
      "c22-s51-u01-w023",
      "c22-s51-u01-w024"
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
      "c22-s51-u01-w025",
      "c22-s51-u01-w026",
      "c22-s51-u01-w027"
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
      "c22-s51-u01-w028",
      "c22-s51-u01-w029",
      "c22-s51-u01-w030"
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
      "c22-s51-u01-w031",
      "c22-s51-u01-w032",
      "c22-s51-u01-w033",
      "c22-s51-u01-w034"
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
      "c22-s51-u01-w035",
      "c22-s51-u01-w036",
      "c22-s51-u01-w037",
      "c22-s51-u01-w038"
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
      "c22-s51-u01-w039",
      "c22-s51-u01-w040",
      "c22-s51-u01-w041"
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
   "section": "정답·해설 42~44",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w042",
      "c22-s51-u01-w043",
      "c22-s51-u01-w044"
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
      "c22-s51-u01-w045",
      "c22-s51-u01-w046",
      "c22-s51-u01-w047",
      "c22-s51-u01-w048"
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
   "section": "정답·해설 49~51",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w049",
      "c22-s51-u01-w050",
      "c22-s51-u01-w051"
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
   "section": "정답·해설 52~54",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w052",
      "c22-s51-u01-w053",
      "c22-s51-u01-w054"
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
   "section": "정답·해설 55~57",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w055",
      "c22-s51-u01-w056",
      "c22-s51-u01-w057"
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
   "section": "정답·해설 58~61",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w058",
      "c22-s51-u01-w059",
      "c22-s51-u01-w060",
      "c22-s51-u01-w061"
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
   "section": "정답·해설 62~65",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w062",
      "c22-s51-u01-w063",
      "c22-s51-u01-w064",
      "c22-s51-u01-w065"
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
      "c22-s51-u01-w066",
      "c22-s51-u01-w067",
      "c22-s51-u01-w068"
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
   "section": "정답·해설 69~71",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w069",
      "c22-s51-u01-w070",
      "c22-s51-u01-w071"
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
   "section": "정답·해설 72~74",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s51-u01-w072",
      "c22-s51-u01-w073",
      "c22-s51-u01-w074"
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
      "c22-s51-u01-w075",
      "c22-s51-u01-w076",
      "c22-s51-u01-w077"
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
      "c22-s51-u01-w078",
      "c22-s51-u01-w079",
      "c22-s51-u01-w080"
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
   "title": "1~28번",
   "kind": "quick",
   "blocks": [
    {
     "type": "diagram",
     "key": "quick-1",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 해설의 조건·근거·인정 기준을 확인해요."
    },
    {
     "title": "다시 살필 것",
     "text": "틀린 번호와 필요한 근거를 적어요.",
     "write": 4
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
     "key": "quick-29",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 해설의 조건·근거·인정 기준을 확인해요."
    },
    {
     "title": "다시 살필 것",
     "text": "틀린 번호와 필요한 근거를 적어요.",
     "write": 4
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
     "key": "quick-57",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "확인할 때",
     "text": "서술·그림은 해설의 조건·근거·인정 기준을 확인해요."
    },
    {
     "title": "다시 살필 것",
     "text": "틀린 번호와 필요한 근거를 적어요.",
     "write": 4
    }
   ]
  }
 ],
 "figures": {
  "strata": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u01-photo-strata.webp\" alt=\"층의 경계와 색 차이가 보이는 암석 절벽\" loading=\"eager\"><p class=\"ed-photo-note\">층의 모습을 살펴보는 설명 이미지예요. 실제 위치·연도·두께를 재는 자료가 아니에요.</p><small class=\"ed-photo-credit\">특정 지층의 현장 조사 자료 아님</small></div>",
  "strata-shapes.svg": "<div class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/strata-shapes.svg\" alt=\"지층 모양 자료에서 나처럼 층의 경계가 휘어 보입니다. 관찰한 모습에 맞는 말은 무엇인가요?\"><small class=\"ed-photo-credit\">창작 학습 모식도 · 실제 크기·연도 자료 아님</small></div>",
  "layers-abc.svg": "<div class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/layers-abc.svg\" alt=\"뒤집히거나 순서가 바뀌지 않은 세 층에서 가장 아래 가층이 있습니다. 쌓인 순서에 맞는 것은 무엇인가요?\"><small class=\"ed-photo-credit\">창작 학습 모식도 · 실제 크기·연도 자료 아님</small></div>",
  "rock-c.png": "<div class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/rock-c.png\" alt=\"암석에 자갈처럼 큰 알갱이가 다른 작은 알갱이와 함께 굳어 있습니다. 이 단원의 세 퇴적암 중 알맞은 이름은 무엇인가요?\"><small class=\"ed-photo-credit\">지필드 과학 교재 제공 원본 사진 · 배율·발견 장소·형성 연도 미확인</small></div>",
  "rock-b.png": "<div class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/rock-b.png\" alt=\"주로 모래 크기의 알갱이가 보이는 표본을 이암·사암·역암 중 분류하면 무엇인가요?\"><small class=\"ed-photo-credit\">지필드 과학 교재 제공 원본 사진 · 배율·발견 장소·형성 연도 미확인</small></div>",
  "geoHorizontal": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u01-source-horizontal.png\" alt=\"수평으로 놓인 지층을 보여 주는 원교재 사진\"><figcaption>자체 이론421 PDF22쪽. 원촬영 정보·장소·배율은 미확인이에요. 사진 밖의 전체 모양·정확한 두께를 확정하지 않아요.</figcaption></figure>",
  "geoClay": "<figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u01-source-clay.png\" alt=\"여러 색의 층과 경계를 보여 주는 교재의 점토 모형 사진\"><figcaption>같은 원자료의 모형 예예요. 실제 지층이나 학생 제작 결과가 아니에요. 이 수업에서는 칼로 자르지 않아요.</figcaption></figure>",
  "geoFish": "<figure class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/fossil-fish.png\" alt=\"교재에서 물고기로 제시한 화석 사진\"><figcaption>자체 이론421 PDF24쪽. 발견 장소·형성 연도·생활 환경은 미확인이에요. 사진만으로 바다 생물이라고 정하지 않아요.</figcaption></figure>",
  "geoFern": "<figure class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/fossil-fern.png\" alt=\"교재에서 고사리로 제시한 식물 화석 사진\"><figcaption>같은 원자료의 식물 화석이에요. 보이는 잎의 모양과 자료 설명을 나누어 읽어요.</figcaption></figure>",
  "geoShapes": "<div style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:2mm\"><figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u01-source-horizontal.png\" alt=\"수평으로 놓인 모습\"><figcaption>수평으로 놓인 모습</figcaption></figure><figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u01-source-bent.png\" alt=\"휘어진 모습\"><figcaption>휘어진 모습</figcaption></figure><figure class=\"ed-photo\"><img src=\"../assets/book/c22-s51-u01-source-broken.png\" alt=\"끊어져 어긋난 모습\"><figcaption>끊어져 어긋난 모습</figcaption></figure></div><p class=\"ed-given\">자체 이론421 PDF22쪽 원사진이에요. 장소·시기·동일 배율은 미확인이에요.</p>",
  "geoRocks": "<div style=\"display:grid;grid-template-columns:repeat(3,1fr);gap:2mm\"><figure class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/rock-a.png\" alt=\"암석 표본 A\"><figcaption>표본 A</figcaption></figure><figure class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/rock-b.png\" alt=\"암석 표본 B\"><figcaption>표본 B</figcaption></figure><figure class=\"ed-photo\"><img src=\"../assets/bank/c22-s51-u01/rock-c.png\" alt=\"암석 표본 C\"><figcaption>표본 C</figcaption></figure></div><p class=\"ed-given\">자체 이론421 PDF23쪽. 사진의 동일 배율은 미확인이고 구성 알갱이의 기준은 아래 조사 설명과 연결해요.</p>",
  "geoRockRecords": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">표본</th><th scope=\"col\">교재 설명과 연결한 관찰 기록</th></tr></thead><tbody><tr><th scope=\"row\">A</th><td>구성 알갱이가 매우 작아 눈으로 낱낱이 구별하기 어렵다</td></tr><tr><th scope=\"row\">B</th><td>주로 모래 크기의 알갱이가 보인다</td></tr><tr><th scope=\"row\">C</th><td>자갈 크기의 큰 알갱이가 작은 알갱이와 함께 굳어 있다</td></tr></tbody></table>",
  "geoStrata": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">따로 넣은 순서</th><th scope=\"col\">아래층</th><th scope=\"col\">가운데층</th><th scope=\"col\">위층</th></tr></thead><tbody><tr><th scope=\"row\">자갈 → 모래 → 진흙</th><td>자갈</td><td>모래</td><td>진흙</td></tr><tr><th scope=\"row\">진흙 → 모래 → 자갈</th><td>진흙</td><td>모래</td><td>자갈</td></tr><tr><th scope=\"row\">모래 → 자갈 → 진흙</th><td>모래</td><td>자갈</td><td>진흙</td></tr></tbody></table><p class=\"ed-given\">세 재료를 한 가지씩 따로 쌓고 뒤집거나 깎지 않은 모형이에요. 섞은 재료가 알갱이 크기대로 가라앉는 실험과 달라요. 실제 퇴적 시간·암석으로 굳어짐·화석 생성은 재현하지 않아요.</p>",
  "geoPast": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">별도 연습 자료</th><th scope=\"col\">제공된 설명</th></tr></thead><tbody><tr><th scope=\"row\">발견 맥락</th><td>산의 지층에 보존된 생물 A의 화석을 조사함</td></tr><tr><th scope=\"row\">생물의 생활</th><td>A는 바다에서 살던 생물이라고 조사됨</td></tr></tbody></table><p class=\"ed-given\">앞의 물고기 사진과 별개인 가상 자료예요. 정확한 수온·연도는 제공하지 않았어요.</p>",
  "geoCompare": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">가상 관찰 기록</th><th scope=\"col\">알갱이의 모습</th></tr></thead><tbody><tr><th scope=\"row\">가</th><td>매우 작아 눈으로 낱낱이 구별하기 어려움</td></tr><tr><th scope=\"row\">나</th><td>주로 모래 크기의 알갱이가 보임</td></tr><tr><th scope=\"row\">다</th><td>자갈 크기의 알갱이와 작은 알갱이가 함께 굳음</td></tr></tbody></table>",
  "geoSources": "<p class=\"ed-given\">더 읽기: <a href=\"https://www.nps.gov/subjects/fossils/what-is-a-fossil.htm\" target=\"_blank\" rel=\"noopener noreferrer\">미국 국립공원청 · 화석의 여러 증거</a> / <a href=\"https://www.nps.gov/subjects/fossils/how-fossils-form.htm\" target=\"_blank\" rel=\"noopener noreferrer\">화석의 형성 과정</a>. 실습은 교사 준비 실온 재료로 하며 가열·절단·수지/경화제를 쓰지 않아요.</p>",
  "quick-1": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">1</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">2</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">3</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">4</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">5</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">6</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">7</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">8</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">9</th><td>모두 고르기</td><td>①, ②</td></tr><tr><th scope=\"row\">10</th><td>단답</td><td>지층</td></tr><tr><th scope=\"row\">11</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">12</th><td>빈칸</td><td>아래 / 위</td></tr><tr><th scope=\"row\">13</th><td>순서</td><td>ㄴ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">14</th><td>그림</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">15</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">16</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">17</th><td>모두 고르기</td><td>②, ④</td></tr><tr><th scope=\"row\">18</th><td>모두 고르기</td><td>②, ⑤</td></tr><tr><th scope=\"row\">19</th><td>단답</td><td>넣는 순서</td></tr><tr><th scope=\"row\">20</th><td>단답</td><td>배율</td></tr><tr><th scope=\"row\">21</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">22</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">23</th><td>빈칸</td><td>㉠ 두께 · ㉡ 경계</td></tr><tr><th scope=\"row\">24</th><td>빈칸</td><td>㉠ 위 · ㉡ 아래</td></tr><tr><th scope=\"row\">25</th><td>빈칸</td><td>㉠ 설계/계획 · ㉡ 관찰</td></tr><tr><th scope=\"row\">26</th><td>연결</td><td>㉠-② · ㉡-③ · ㉢-①</td></tr><tr><th scope=\"row\">27</th><td>순서</td><td>㉢→㉡→㉠→㉣</td></tr><tr><th scope=\"row\">28</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>",
  "quick-29": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">29</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">30</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">31</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">32</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">33</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">34</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">35</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">36</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">37</th><td>모두 고르기</td><td>①, ③</td></tr><tr><th scope=\"row\">38</th><td>모두 고르기</td><td>②, ③</td></tr><tr><th scope=\"row\">39</th><td>단답</td><td>퇴적암</td></tr><tr><th scope=\"row\">40</th><td>단답</td><td>돋보기</td></tr><tr><th scope=\"row\">41</th><td>단답</td><td>사암</td></tr><tr><th scope=\"row\">42</th><td>서술</td><td>교사 확인</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">43</th><td>빈칸</td><td>알갱이 / 크기</td></tr><tr><th scope=\"row\">44</th><td>연결</td><td>(1) ㄴ (2) ㄷ (3) ㄱ</td></tr><tr><th scope=\"row\">45</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">46</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">47</th><td>모두 고르기</td><td>②, ④</td></tr><tr><th scope=\"row\">48</th><td>단답</td><td>진흙</td></tr><tr><th scope=\"row\">49</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">50</th><td>빈칸</td><td>㉠ 없다 · ㉡ 돋보기/확대경</td></tr><tr><th scope=\"row\">51</th><td>빈칸</td><td>㉠ 퇴적물 · ㉡ 퇴적암</td></tr><tr><th scope=\"row\">52</th><td>연결</td><td>㉠-③ · ㉡-① · ㉢-②</td></tr><tr><th scope=\"row\">53</th><td>연결</td><td>㉠-② · ㉡-③ · ㉢-①</td></tr><tr><th scope=\"row\">54</th><td>순서</td><td>㉢→㉣→㉠→㉡</td></tr><tr><th scope=\"row\">55</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">56</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>",
  "quick-57": "<div class=\"mt-quick-grid\"><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">57</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">58</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">59</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">60</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">61</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">62</th><td>객관식</td><td>③</td></tr><tr><th scope=\"row\">63</th><td>객관식</td><td>①</td></tr><tr><th scope=\"row\">64</th><td>객관식</td><td>⑤</td></tr><tr><th scope=\"row\">65</th><td>모두 고르기</td><td>④, ⑤</td></tr><tr><th scope=\"row\">66</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">67</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">68</th><td>빈칸</td><td>몸 / 활동</td></tr></tbody></table><table class=\"ed-table\"><thead><tr><th scope=\"col\">번호</th><th scope=\"col\">형식</th><th scope=\"col\">정답</th></tr></thead><tbody><tr><th scope=\"row\">69</th><td>빈칸</td><td>생활 / 지층</td></tr><tr><th scope=\"row\">70</th><td>연결</td><td>(1) ㄷ (2) ㄱ (3) ㄴ</td></tr><tr><th scope=\"row\">71</th><td>순서</td><td>ㄴ → ㄹ → ㄷ → ㄱ</td></tr><tr><th scope=\"row\">72</th><td>그림</td><td>교사 확인</td></tr><tr><th scope=\"row\">73</th><td>객관식</td><td>②</td></tr><tr><th scope=\"row\">74</th><td>객관식</td><td>④</td></tr><tr><th scope=\"row\">75</th><td>모두 고르기</td><td>①, ④</td></tr><tr><th scope=\"row\">76</th><td>단답</td><td>활동 흔적</td></tr><tr><th scope=\"row\">77</th><td>서술</td><td>교사 확인</td></tr><tr><th scope=\"row\">78</th><td>빈칸</td><td>㉠ 생활 · ㉡ 지층</td></tr><tr><th scope=\"row\">79</th><td>연결</td><td>㉠-③ · ㉡-① · ㉢-②</td></tr><tr><th scope=\"row\">80</th><td>그림</td><td>교사 확인</td></tr></tbody></table></div>"
 },
 "teacherStudentPages": [
  {
   "section": "교과 연결 사고력",
   "title": "지층과 화석",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoHorizontal",
     "caption": ""
    },
    {
     "type": "text",
     "text": "지층의 모습을 관찰하고 쌓임을 모형으로 표현해요. 퇴적암을 알갱이로 분류하고, 화석과 생활 자료에서 과거의 증거를 찾아 설명해요."
    },
    {
     "type": "field",
     "title": "처음 생각",
     "hint": "큰 자갈은 언제나 맨 아래일까요? 화석은 생물의 몸 전체가 돌로 된 것만 있을까요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층·알갱이·화석은 각각 다른 판단의 근거예요."
    },
    {
     "title": "더 알아보기",
     "text": "관찰한 것·모형이 보여 준 것과 과거를 추리한 내용을 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "관찰하고 · 만들고 · 분류하고 · 근거로 추리하는 과학",
   "kind": "opener"
  },
  {
   "section": "배움의 지도",
   "title": "세 질문으로 땅의 이야기를 읽어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "현행 성취기준",
      "배울 내용·연습 번호"
     ],
     "rows": [
      [
       "6과01-01",
       "지층 특징·쌓임 모형 / 1~28번"
      ],
      [
       "6과01-02",
       "퇴적물·세 퇴적암 분류 / 29~56번"
      ],
      [
       "6과01-03",
       "화석 관찰·모형·과거 추리 / 57~80번"
      ]
     ]
    },
    {
     "type": "list",
     "items": [
      "사진·자료·예제에서 판단의 근거를 찾아요.",
      "객관식·복수선택·단답·서술·빈칸·연결·순서·그림으로 연습해요.",
      "층 모형과 겉모양 흔적 모형을 직접 만들고 실제와 비교해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "나의 질문",
     "hint": "더 관찰할 층·암석·화석의 특징과 알아볼 점을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "문제의 정답과 실제 관찰·제작 완료는 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "교사 준비 표본·안전한 실온 재료로 활동하고 위험한 절벽에 접근하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "지층의 보이는 특징",
   "title": "경계·색·상대 두께와 형태",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoShapes",
     "caption": ""
    },
    {
     "type": "field",
     "title": "같은 기준으로 관찰",
     "hint": "세 사진의 공통점과 차이를 보이는 근거로 설명해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "아직 모르는 것",
     "hint": "가려진 부분·사진 배율·정확한 형성 시기 중 더 확인할 것을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "수평·휘어짐·끊어짐의 보이는 모습을 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "이 단원에서는 생성 힘의 정확한 방향·크기나 사진 밖 전체 모습을 정답으로 요구하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "층 쌓기 모형 비교",
   "title": "넣는 차례와 층의 위치",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoStrata",
     "caption": ""
    },
    {
     "type": "field",
     "title": "두 조건의 비교",
     "hint": "넣는 순서가 다른 두 기록에서 아래·위 재료가 어떻게 달라졌는지 써요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "field",
     "title": "순서를 읽을 조건",
     "hint": "먼저/나중을 설명하려면 무엇을 확인해야 하나요?",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "뒤집거나 깎지 않아 순서가 보존된 조건에서 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "큰 알갱이가 무조건 아래라는 설명 대신 따로 넣은 차례와 위치를 연결해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "층 모형 실제 만들기",
   "title": "계획과 제작·관찰을 이어 가요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoClay",
     "caption": ""
    },
    {
     "type": "list",
     "items": [
      "구별되는 실온 점토나 종이 띠 세 종류와 받침을 준비해요.",
      "넣을 차례를 정하고 실제로 첫째·둘째·셋째 층을 위에 쌓아요.",
      "앞면의 경계와 위치를 계획과 비교하고 바뀐 조건·뭉개진 부분도 살펴요.",
      "한 부분을 고쳐 다시 만들고 처음/수정 모형의 근거를 설명해요."
     ],
     "ordered": false
    },
    {
     "type": "field",
     "title": "실제와 다른 점",
     "hint": "내 모형의 재료·시간·굳는 과정 중 실제 지층과 다른 점을 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "새 층은 앞선 층 위에 쌓여요. 모형은 실제 암석의 긴 형성 시간을 재현하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "교사와 활동하며 점토를 먹거나 가열·절단·세게 밀지 않아요. 사진의 절단 절차를 따라 하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "퇴적물과 퇴적암",
   "title": "쌓는 것과 굳어지는 것은 달라요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "단계",
      "이 단원에서 살펴볼 것"
     ],
     "rows": [
      [
       "퇴적물",
       "물 등에 실려 와 쌓인 자갈·모래·진흙 등"
      ],
      [
       "퇴적암",
       "퇴적물이 오랫동안 다져지고 굳어 만들어진 암석"
      ]
     ]
    },
    {
     "type": "example",
     "question": "통에 모래를 쌓으면 사암을 만든 걸까요?",
     "steps": [
      [
       "한 일",
       "모래를 층으로 쌓는 모습을 살폈어요."
      ],
      [
       "더 필요한 과정",
       "실제 다져지고 굳어지는 과정을 재현하지 않았어요."
      ]
     ],
     "answer": "쌓임 모형과 실제 사암 형성을 구별해요."
    },
    {
     "type": "field",
     "title": "나의 설명",
     "hint": "모형이 보여 준 것과 재현하지 못한 것을 나누어요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이 단원에서 살피는 지층은 퇴적암으로 이루어져 있어요."
    },
    {
     "title": "더 알아보기",
     "text": "모형의 몇 초·몇 분을 실제 형성 연도·기간으로 바꾸지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "알갱이 관찰",
   "title": "전체 돌과 구성 알갱이를 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoRocks",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "geoRockRecords",
     "caption": ""
    },
    {
     "type": "field",
     "title": "관찰 도구와 근거",
     "hint": "같은 표본·도구·배율에서 구성 알갱이를 어떻게 확인할지 설명해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "크기 기준은 전체 돌 크기나 사진 크기와 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "눈에 잘 안 보임과 알갱이가 없음을 구별해요. 돋보기나 선명한 자료로 보완해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "퇴적암 분류",
   "title": "세 암석에 같은 기준 적용하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "구성 알갱이의 대표 특징",
      "이 단원의 분류"
     ],
     "rows": [
      [
       "구성 알갱이가 매우 작아 눈으로 낱낱이 구별하기 어렵다",
       "이암"
      ],
      [
       "주로 모래 크기의 알갱이가 보인다",
       "사암"
      ],
      [
       "자갈 크기의 큰 알갱이가 작은 알갱이와 함께 굳어 있다",
       "역암"
      ]
     ]
    },
    {
     "type": "example",
     "question": "역암에 작은 알갱이도 보인다면?",
     "steps": [
      [
       "관찰",
       "자갈 크기가 작은 알갱이와 함께 굳어 있어요."
      ],
      [
       "분류",
       "한 작은 알갱이만 고르지 않고 구성 특징을 살펴요."
      ]
     ],
     "answer": "작은 알갱이가 함께 있다는 이유만으로 이암이라고 바꾸지 않아요."
    },
    {
     "type": "field",
     "title": "분류 재검토",
     "hint": "두 모둠의 분류가 다를 때 확인할 기준과 관찰 방법을 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이암·사암·역암은 구성 알갱이 크기를 기준으로 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "표본마다 다른 기준을 적용하지 않아요. 색·전체 크기·다수결로 이름을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "화석 사진 관찰",
   "title": "보이는 모습과 자료 설명을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoFish",
     "caption": ""
    },
    {
     "type": "diagram",
     "key": "geoFern",
     "caption": ""
    },
    {
     "type": "field",
     "title": "사진에서 본 특징",
     "hint": "몸·뼈·지느러미나 잎의 모양에서 보이는 특징을 짧게 적어요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이는 특징과 정확한 종·발견 장소·형성 연도를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "사진에 눈금이 없으면 화석의 실제 크기를 재지 않아요. 닮은 모습만으로 생활 환경을 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "화석의 여러 증거",
   "title": "몸 일부와 활동 흔적도 살펴요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "생물의 증거 예",
      "구별할 점"
     ],
     "rows": [
      [
       "뼈·껍데기·잎 등의 일부",
       "몸 전체가 모두 남아야만 하는 것은 아님"
      ],
      [
       "발자국·굴을 판 흔적 등",
       "살아 있을 때 남긴 활동의 증거일 수도 있음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "오해 고치기",
     "hint": "“오래된 물건이나 모든 무늬는 화석이다”를 근거와 함께 고쳐요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "text",
     "text": "화석은 지층 등 지질학적 맥락에 보존된 생물의 증거예요. 오래된 토기·오늘의 발자국·물결무늬를 모두 화석으로 부르지 않아요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "과거 생물의 증거인지와 보존 맥락을 함께 살펴요."
    },
    {
     "title": "더 알아보기",
     "text": "일부 화석만 보고 모든 화석이 몸 전체·돌·퇴적암뿐이라고 일반화하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "겉모양 흔적 모형 만들기",
   "title": "안전한 재료로 누르고 떼어 관찰해요",
   "blocks": [
    {
     "type": "list",
     "items": [
      "교사 준비 실온 점토·받침·안전한 조개 모양 교구를 준비해요.",
      "누르기 전 교구의 겉모양을 살피고 점토 표면을 고르게 해요.",
      "가볍게 눌렀다 조심히 떼어 남은 윤곽·무늬를 비교해요.",
      "뭉개진 부분을 남기고 누르는 방법 한 가지를 고쳐 다시 해 봐요."
     ],
     "ordered": true
    },
    {
     "type": "field",
     "title": "모형 계획과 관찰할 것",
     "hint": "세 단계의 계획과 관찰할 특징을 그려 보아요.",
     "lines": 3,
     "draw": true
    },
    {
     "type": "text",
     "text": "교구·점토를 입에 넣지 않고 활동 후 손을 씻어요. 가열·칼·깨지는 교구·수지/경화제를 쓰지 않아요. 그림만 그렸다면 아직 제작 전이에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형은 생물의 겉모양이 남는 모습을 표현해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 오래된 화석이나 모든 화석 보존의 시간·과정을 만든 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "모형과 실제 비교",
   "title": "같은 점과 다른 점을 근거로 설명해요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "모형에서 살핀 것",
      "실제 화석과 다른 점"
     ],
     "rows": [
      [
       "겉모양의 윤곽·무늬가 남음",
       "사람이 짧은 시간에 점토로 만듦"
      ],
      [
       "남은 모양·뭉개짐을 비교함",
       "모든 생물의 보존·굳어짐·오랜 시간을 재현하지 않음"
      ]
     ]
    },
    {
     "type": "field",
     "title": "비교 설명",
     "hint": "모형이 표현하는 점과 재현하지 못한 점 두 가지를 나누어요.",
     "lines": 6,
     "draw": false
    },
    {
     "type": "text",
     "text": "빠른 매몰과 단단한 부분 등은 보존 가능성을 높일 수 있어요. 그렇다고 모든 생물이 반드시 화석이 되는 것은 아니에요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "만든 모형의 장점과 한계를 함께 말해요."
    },
    {
     "title": "더 알아보기",
     "text": "한 번의 모형 제작으로 모든 화석의 형성 방식을 증명했다고 하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "과거 환경 추리",
   "title": "화석·생활·발견 맥락을 함께 읽어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "geoPast",
     "caption": ""
    },
    {
     "type": "example",
     "question": "지금 산이므로 과거에도 늘 산이었을까요?",
     "steps": [
      [
       "근거 연결",
       "A의 바다 생활과 그 지층에 보존된 화석이라는 자료를 연결해요."
      ],
      [
       "추리 범위",
       "그 지층이 형성될 무렵 바다 관련 환경이었을 가능성을 설명해요."
      ]
     ],
     "answer": "현재 모습과 과거 환경이 반드시 같다는 뜻은 아니에요."
    },
    {
     "type": "field",
     "title": "확인한 것과 미확인",
     "hint": "사용한 두 근거와 더 확인해야 할 정보를 나누어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "앞의 물고기 사진만으로 바다 환경이라고 정한 것이 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "정확한 수온·연도·모든 생물 수를 이 자료만으로 확정하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "화석의 가치와 설명",
   "title": "근거를 찾아 실제로 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "화석은 과거 어떤 생물이 살았고 어떤 환경과 관계가 있었는지 알아보는 데 도움을 줘요. 교사 선정 박물관·기관 자료에서 관심 있는 화석 하나를 더 살펴요."
    },
    {
     "type": "field",
     "title": "내가 소개할 근거",
     "hint": "화석의 특징·생활 자료·발견 지층과 출처를 정리해요.",
     "lines": 5,
     "draw": false
    },
    {
     "type": "field",
     "title": "질문을 듣고 보완하기",
     "hint": "실제로 들은 질문과 고친 설명, 아직 할 계획을 나누어요.",
     "lines": 4,
     "draw": false
    },
    {
     "type": "diagram",
     "key": "geoSources",
     "caption": ""
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "실제 설명·질문과 아직 나누지 않은 계획은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "화석 표본을 깨거나 긁지 않아요. 직접 만져야만 가치를 알 수 있는 것도 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "한눈에 정리",
   "title": "서로 다른 세 근거 연결하기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "판단할 내용",
      "필요한 근거"
     ],
     "rows": [
      [
       "어느 층이 먼저일까?",
       "순서가 보존된 조건과 아래·위 위치"
      ],
      [
       "이암·사암·역암 중 무엇일까?",
       "구성 알갱이 크기의 같은 기준"
      ],
      [
       "과거 환경은 어땠을까?",
       "화석·생물 생활·발견 지층의 맥락"
      ]
     ]
    },
    {
     "type": "field",
     "title": "나의 핵심 설명",
     "hint": "세 근거 중 하나를 골라 관찰→판단→한계를 한 문장씩 정리해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "이름만 외우지 말고 어떤 자료로 판단했는지 설명해요."
    },
    {
     "title": "더 알아보기",
     "text": "모형·실물 관찰·자료 읽기와 추리의 범위를 나누면 타당한 다른 표현도 인정할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 1~2",
   "title": "지층의 층·경계·색과 두께",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w001",
      "c22-s51-u01-w002"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 3",
   "title": "지층의 모양·관찰 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 4",
   "title": "지층의 모양·관찰 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w004"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 5",
   "title": "층이 쌓인 순서와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w005"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 6~7",
   "title": "층이 쌓인 순서와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w006",
      "c22-s51-u01-w007"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 8~9",
   "title": "지층 형성 모형과 한계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w008",
      "c22-s51-u01-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 10",
   "title": "지층의 층·경계·색과 두께",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w010"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 11",
   "title": "층이 쌓인 순서와 조건",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w011"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 12~13",
   "title": "층의 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w012",
      "c22-s51-u01-w013"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 14",
   "title": "내 모형 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w014"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 15",
   "title": "원사진의 관찰 범위",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 16",
   "title": "형태와 생성 원인",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w016"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 17",
   "title": "여러 지층의 외형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w017"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 18~19",
   "title": "층 모형의 실제 제작",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w018",
      "c22-s51-u01-w019"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 20",
   "title": "사진 크기와 실제 크기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 21",
   "title": "사진의 상대 두께와 실제 두께",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w021"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 22",
   "title": "큰 자갈과 쌓는 차례",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w022"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 23~24",
   "title": "지층 관찰 항목",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w023",
      "c22-s51-u01-w024"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 25~26",
   "title": "계획과 제작",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w025",
      "c22-s51-u01-w026"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 27",
   "title": "층 모형을 만들고 고치기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 28",
   "title": "두 순서의 층 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w028"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "층의 색·상대 두께·경계와 순서 보존 조건을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "따로 넣은 차례와 위치를 연결하고 실제 형성 기간·굳어짐의 한계를 밝혀요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 29~30",
   "title": "퇴적물과 퇴적암의 관계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w029",
      "c22-s51-u01-w030"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 31~32",
   "title": "알갱이 관찰 도구와 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w031",
      "c22-s51-u01-w032"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 33",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 34",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w034"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 35~36",
   "title": "분류 근거와 미확인",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w035",
      "c22-s51-u01-w036"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 37~38",
   "title": "퇴적물과 퇴적암의 관계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w037",
      "c22-s51-u01-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 39~40",
   "title": "퇴적물과 퇴적암의 관계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w039",
      "c22-s51-u01-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 41",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w041"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 42",
   "title": "이암·사암·역암 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 43~44",
   "title": "알갱이 기준",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w043",
      "c22-s51-u01-w044"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 45",
   "title": "퇴적물과 퇴적암",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w045"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 46",
   "title": "작은 알갱이가 함께 있는 역암",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 47~48",
   "title": "같은 기준으로 암석 분류",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w047",
      "c22-s51-u01-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 49",
   "title": "두 분류의 다른 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w049"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 50~51",
   "title": "알갱이와 도구",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w050",
      "c22-s51-u01-w051"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 52~53",
   "title": "분류표의 같은 기준",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w052",
      "c22-s51-u01-w053"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 54",
   "title": "표본을 관찰해 분류하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 55",
   "title": "알갱이 분류 안내 카드",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w055"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 56",
   "title": "퇴적물과 퇴적암 비교도",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전체 돌 크기·색 대신 구성 알갱이 크기 기준을 적용해요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 표본·도구·배율과 불분명한 부분을 확인하고 더 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 57~58",
   "title": "동물·식물·활동 흔적 화석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w057",
      "c22-s51-u01-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 59~60",
   "title": "화석 생성 모형과 실제",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w059",
      "c22-s51-u01-w060"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 61~62",
   "title": "화석으로 과거 환경 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w061",
      "c22-s51-u01-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 63~64",
   "title": "화석의 가치·보전·설명",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w063",
      "c22-s51-u01-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 65",
   "title": "화석 생성 모형과 실제",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w065"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 66",
   "title": "동물·식물·활동 흔적 화석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 67",
   "title": "화석으로 과거 환경 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w067"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 68~69",
   "title": "화석의 증거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w068",
      "c22-s51-u01-w069"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 70~71",
   "title": "관찰과 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w070",
      "c22-s51-u01-w071"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 72",
   "title": "증거로 과거 그리기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 73",
   "title": "몸과 활동의 증거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w073"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 74",
   "title": "화석 사진과 환경 추리",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 75~76",
   "title": "흔적 모형과 실제 화석",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w075",
      "c22-s51-u01-w076"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 77",
   "title": "현재 산과 과거 환경",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w077"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 78~79",
   "title": "환경 추리의 두 근거",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w078",
      "c22-s51-u01-w079"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연습 80",
   "title": "화석 겉모양 모형 안내",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s51-u01-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화석의 몸·활동 증거와 생활 자료·발견 맥락을 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "실제 제작/관찰·모형의 한계·과거 환경의 추리 범위를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "관찰한 근거와 설명을 연결하고 더 물어볼 점을 남겨요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "learn"
  }
 ],
 "modelNotice": "세 재료를 한 가지씩 따로 쌓고 뒤집거나 깎지 않은 모형이에요. 섞은 재료가 알갱이 크기대로 가라앉는 실험과 달라요. 실제 퇴적 시간·암석으로 굳어짐·화석 생성은 재현하지 않아요.",
 "previousSelection": [
  "c22-s51-u01-w001",
  "c22-s51-u01-w002",
  "c22-s51-u01-w003",
  "c22-s51-u01-w004",
  "c22-s51-u01-w005",
  "c22-s51-u01-w006",
  "c22-s51-u01-w007",
  "c22-s51-u01-w008",
  "c22-s51-u01-w025",
  "c22-s51-u01-w029",
  "c22-s51-u01-w033",
  "c22-s51-u01-w037",
  "c22-s51-u01-w043",
  "c22-s51-u01-w045",
  "c22-s51-u01-w009",
  "c22-s51-u01-w010",
  "c22-s51-u01-w011",
  "c22-s51-u01-w012",
  "c22-s51-u01-w013",
  "c22-s51-u01-w014",
  "c22-s51-u01-w015",
  "c22-s51-u01-w016",
  "c22-s51-u01-w026",
  "c22-s51-u01-w027",
  "c22-s51-u01-w030",
  "c22-s51-u01-w031",
  "c22-s51-u01-w032",
  "c22-s51-u01-w034",
  "c22-s51-u01-w038",
  "c22-s51-u01-w041",
  "c22-s51-u01-w017",
  "c22-s51-u01-w018",
  "c22-s51-u01-w019",
  "c22-s51-u01-w020",
  "c22-s51-u01-w021",
  "c22-s51-u01-w022",
  "c22-s51-u01-w023",
  "c22-s51-u01-w024",
  "c22-s51-u01-w028",
  "c22-s51-u01-w035",
  "c22-s51-u01-w036",
  "c22-s51-u01-w039",
  "c22-s51-u01-w040",
  "c22-s51-u01-w042",
  "c22-s51-u01-w044",
  "c22-s51-u01-w046"
 ],
 "sourceSelection": [
  "c22-s51-u01-b001",
  "c22-s51-u01-b002",
  "c22-s51-u01-b009",
  "c22-s51-u01-b010",
  "c22-s51-u01-b017",
  "c22-s51-u01-b020",
  "c22-s51-u01-b025",
  "c22-s51-u01-b026",
  "c22-s51-u01-b014",
  "c22-s51-u01-b007",
  "c22-s51-u01-b024",
  "c22-s51-u01-b033",
  "c22-s51-u01-b034",
  "c22-s51-u01-b041",
  "c22-s51-u01-b042",
  "c22-s51-u01-b049",
  "c22-s51-u01-b050",
  "c22-s51-u01-b057",
  "c22-s51-u01-b061",
  "c22-s51-u01-b038",
  "c22-s51-u01-b054",
  "c22-s51-u01-b039",
  "c22-s51-u01-b047",
  "c22-s51-u01-b055",
  "c22-s51-u01-b056",
  "c22-s51-u01-b065",
  "c22-s51-u01-b066",
  "c22-s51-u01-b073",
  "c22-s51-u01-b075",
  "c22-s51-u01-b081",
  "c22-s51-u01-b083",
  "c22-s51-u01-b089",
  "c22-s51-u01-b092",
  "c22-s51-u01-b078",
  "c22-s51-u01-b072",
  "c22-s51-u01-b088"
 ]
};

export const geologyReadablePriorWorkbook=withGeologyStudentLanguage(withGeologyEditorial(baseWorkbook));
export const grade5StudyNotesPriorWorkbook=withGeologyReadableWorkbook(geologyReadablePriorWorkbook);
export const workbook=withGrade5StudyNotes(grade5StudyNotesPriorWorkbook);
