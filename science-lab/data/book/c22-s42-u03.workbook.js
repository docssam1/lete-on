import{withGasUpperScience}from'./c22-s42-u03.editorial.js?v=20261105-gas-upper-science';
import{withLearnerExplanations}from'./learner-explanations.js';
import {withGasEditorial} from './c22-s42-u03.editorial.js';
// 여러 가지 기체 — 편집 교재(문제집형 A4). scripts/gen-science-workbook-c22s42u03.mjs 가 만든다(직접 고치지 말 것).
// 그리는 곳: v2/think-workbook-paper.js → #/c22-s42-u03/workbook/student|teacher|answers|quick
const baseWorkbook = {
 "unit": "c22-s42-u03",
 "title": "여러 가지 기체",
 "semester": "4-2",
 "no": 3,
 "theme": "#2456c4",
 "richText": true,
 "questions": [
  {
   "id": "c22-s42-u03-w001",
   "no": 1,
   "form": "choice",
   "topic": "같은 부피 용기와 공기의 무게",
   "prompt": "공기의 무게를 알아보려 합니다. 같은 모양과 바깥 부피를 유지하는 용기를 고른 뒤 가장 알맞게 비교할 방법은 무엇인가요?",
   "answer": "③ 같은 용기에 공기를 더 넣기 전후를 잰다.",
   "explanation": "비교할 것은 공기를 더 넣기 전후의 무게입니다. 용기·마개·바깥 부피와 저울을 같게 두어야 공기 양의 영향과 다른 물질의 영향을 나눌 수 있습니다. 공기와 물을 함께 넣거나 다른 용기를 쓰는 비교는 맞지 않습니다.",
   "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b01",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-01",
   "choices": [
    "같은 용기에 공기와 물을 더한 전후를 잰다.",
    "같은 용기의 마개를 바꾸고 공기를 더해 잰다.",
    "같은 용기에 공기를 더 넣기 전후를 잰다.",
    "같은 용기의 크기를 늘리고 공기를 더해 잰다.",
    "공기를 더한 용기와 다른 빈 용기를 잰다."
   ],
   "key": 2
  },
  {
   "id": "c22-s42-u03-w002",
   "no": 2,
   "form": "choice",
   "topic": "무게 측정 자료와 작은 차이",
   "prompt": "같은 용기에서 공기를 일부 뺀 연습 자료가 147.9g→147.5g입니다. 자료를 바르게 읽은 것은 무엇인가요?",
   "answer": "⑤ 0.4g 줄었고 뺀 공기의 무게와 연결한다.",
   "explanation": "처음과 나중 값의 차이는0.4 g 감소입니다. 다른 조건이 같다면 밖으로 뺀 공기의 무게와 연결할 수 있습니다. 감소를 증가로 바꾸거나 이 차이를 용기 전체·처음 공기 전체의 무게로 해석하지 않습니다.",
   "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b07",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-01",
   "choices": [
    "0.4g 늘었고 뺀 공기의 무게와 연결한다.",
    "0.4g 줄었고 용기와 공기 전체의 무게라고 한다.",
    "0.4g 줄었고 처음 공기 전체의 무게라고 한다.",
    "0.4g 늘었고 남은 공기 전체의 무게라고 한다.",
    "0.4g 줄었고 뺀 공기의 무게와 연결한다."
   ],
   "key": 4
  },
  {
   "id": "c22-s42-u03-w003",
   "no": 3,
   "form": "choice",
   "topic": "무게 비교의 조건과 오류",
   "prompt": "공기를 추가한 뒤 더 무거운 금속 마개로 바꾸어 쟀습니다. 무엇이 문제인가요?",
   "answer": "② 마개가 바뀌어 공기만의 차이로 보기 어렵다.",
   "explanation": "전체 무게에는 공기뿐 아니라 마개도 포함됩니다. 더 무거운 마개로 바꾸었다면 마개와 공기의 영향이 함께 섞여 공기만의 무게 차이로 해석하기 어렵습니다. 같은 마개로 비교해야 합니다.",
   "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b13",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-01",
   "choices": [
    "마개가 무거워졌으니 공기 무게는 늘지 않았다.",
    "마개가 바뀌어 공기만의 차이로 보기 어렵다.",
    "마개와 공기의 무게 차이를 모두 공기에 돌린다.",
    "용기만 같으면 마개가 달라도 비교 조건은 같다.",
    "마개를 바꾸었으니 전후 차이의 방향만 보면 된다."
   ],
   "key": 1
  },
  {
   "id": "c22-s42-u03-w004",
   "no": 4,
   "form": "choice",
   "topic": "공기 무게의 근거와 적용",
   "prompt": "풍선이 커졌다는 관찰만으로 바로 알 수 있는 것은 무엇인가요?",
   "answer": "① 풍선이 차지하는 공간이 커졌다는 점",
   "explanation": "풍선이 커진 모습은 차지하는 공간, 곧 부피가 커졌다는 관찰입니다. 이 모습만으로 무게의 정확한 값·공기 출입·온도 변화 중 어느 것도 모두 확인한 것은 아닙니다. 무게는 조건을 맞춘 저울 자료가 필요합니다.",
   "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b19",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-01",
   "choices": [
    "풍선이 차지하는 공간이 커졌다는 점",
    "풍선 안 공기의 양이 그대로라는 점",
    "풍선 안 공기의 무게를 정확히 쟀다는 점",
    "풍선 안 기체의 종류가 바뀌었다는 점",
    "풍선 안 온도만 높아졌다는 점"
   ],
   "key": 0
  },
  {
   "id": "c22-s42-u03-w005",
   "no": 5,
   "form": "choice",
   "topic": "압력과 부피의 관찰",
   "prompt": "같은 온도에서 같은 공기가 새지 않는 주사기를 누릅니다. 힘을 더 주어 압축하면 공기 부피는 어떻게 될 수 있나요?",
   "answer": "④ 더 작아질 수 있다.",
   "explanation": "같은 온도에서 새지 않는다는 조건이므로 공기 양은 유지됩니다. 더 큰 압력을 가하면 같은 공기가 더 작은 공간을 차지할 수 있습니다. 공간이 줄었다고 공기가 빠져나가거나 다른 물질로 변했다는 뜻은 아닙니다.",
   "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b25",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-02",
   "choices": [
    "공기 양이 줄어들어 차지한 공간이 작아진다.",
    "온도가 같으므로 공기 부피도 그대로다.",
    "더 작은 공간이면 공기가 밖으로 샌 것이다.",
    "더 작아질 수 있다.",
    "누르는 압력이 커지면 공기 부피도 커진다."
   ],
   "key": 3
  },
  {
   "id": "c22-s42-u03-w006",
   "no": 6,
   "form": "choice",
   "topic": "온도와 부피의 관찰",
   "prompt": "같은 공기가 새지 않는 말랑한 주머니를 따뜻하게 했습니다. 바깥 압력이 비슷하고 주머니가 부풀 수 있을 때 예상은 무엇인가요?",
   "answer": "③ 공기 부피가 커질 수 있다.",
   "explanation": "같은 양의 공기가 새지 않고, 주머니가 부풀 수 있으며 바깥 압력이 비슷한 조건입니다. 따뜻해지면 공기 부피가 커질 수 있습니다. 공간이 커졌다고 공기 양이나 기체 종류까지 바뀌었다고 하지 않습니다.",
   "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b31",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-02",
   "choices": [
    "같은 양이므로 따뜻해져도 부피는 그대로다.",
    "부피가 커지면 안의 공기 양도 반드시 늘었다.",
    "공기 부피가 커질 수 있다.",
    "따뜻해지면 같은 공기가 더 작은 공간을 차지한다.",
    "바깥 압력이 같으면 온도 변화는 관계없다."
   ],
   "key": 2
  },
  {
   "id": "c22-s42-u03-w007",
   "no": 7,
   "form": "choice",
   "topic": "생활 속 온도·압력 변화 구별",
   "prompt": "객실 압력이 지상보다 낮아지고 온도가 비슷한 예에서 밀봉 과자 봉지가 부풀었습니다. 우선 연결할 조건은 무엇인가요?",
   "answer": "⑤ 바깥 압력이 낮아진 점",
   "explanation": "밀봉되어 양이 같고 온도가 비슷하다는 예입니다. 주어진 변화인 바깥 압력의 감소를 봉지 부피 증가와 연결합니다. 봉지가 커졌다는 사실을 공기 양 증가나 기체 종류 변화로 바꾸지 않습니다.",
   "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b37",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-02",
   "choices": [
    "안의 공기 양이 저절로 늘어난 점",
    "바깥 압력이 낮아지면 부피도 작아지는 점",
    "온도가 비슷하면 부피도 같아야 하는 점",
    "봉지가 커지면 안의 기체 종류가 바뀌는 점",
    "바깥 압력이 낮아진 점"
   ],
   "key": 4
  },
  {
   "id": "c22-s42-u03-w008",
   "no": 8,
   "form": "choice",
   "topic": "비교 실험의 조건·자료 해석",
   "prompt": "두 조건에서 온도와 압력을 한꺼번에 바꾼 뒤 공기 부피가 달라졌습니다. 자료로 알 수 있는 범위는 무엇인가요?",
   "answer": "② 한 조건만의 효과를 가려내기 어렵다.",
   "explanation": "온도와 압력을 함께 바꾸면 두 영향이 결과에 섞일 수 있습니다. 부피가 달라졌다는 점은 읽어도 온도만 또는 압력만의 효과를 따로 정할 수는 없습니다. 하나의 영향을 보려면 다른 조건을 같게 둔 비교가 필요합니다.",
   "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b43",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-02",
   "choices": [
    "온도만 바꾼 경우와 같은 결론을 내릴 수 있다.",
    "한 조건만의 효과를 가려내기 어렵다.",
    "압력만 바꾼 경우와 같은 결론을 내릴 수 있다.",
    "온도와 압력이 각각 얼마만큼 영향을 줬는지 안다.",
    "부피가 달라졌으므로 공기의 양도 달랐다고 안다."
   ],
   "key": 1
  },
  {
   "id": "c22-s42-u03-w009",
   "no": 9,
   "form": "choice",
   "topic": "산소의 성질과 이용",
   "prompt": "기체 산소를 성질과 연결한 말로 바른 것을 고르세요.",
   "answer": "① 다른 물질이 타는 것을 돕는 기체다.",
   "explanation": "산소의 역할은 다른 물질이 타는 것을 돕는 것입니다. 연료가 타도록 돕는 기체와 스스로 타는 연료를 구별합니다. 이 성질 하나로 모든 이용 상황이나 안전성을 정하지 않습니다.",
   "misconception": "대표적 쓰임을 모든 경우에 적용하거나 기체의 성질을 서로 바꾸지 않았나요?",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b49",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-03",
   "choices": [
    "다른 물질이 타는 것을 돕는 기체다.",
    "다른 물질이 타면 산소가 연료 역할을 한다.",
    "기체가 타는 동안 산소의 역할은 항상 없다.",
    "산소는 불을 끄는 모든 소화기에 넣는 기체다.",
    "공기 중 산소는 다른 기체와 구별할 성질이 없다."
   ],
   "key": 0
  },
  {
   "id": "c22-s42-u03-w010",
   "no": 10,
   "form": "choice",
   "topic": "이산화 탄소의 성질과 이용",
   "prompt": "탄산음료의 기포와 연결되는 대표 기체를 고르세요.",
   "answer": "④ 이산화 탄소",
   "explanation": "탄산음료와 연결되는 대표 기체는 이산화 탄소입니다. 음료에 녹아 있던 이산화 탄소가 기포로 나올 수 있습니다. 기포가 보인다는 사실만으로 모든 음료나 모든 기포의 성분을 같게 정하지는 않습니다.",
   "misconception": "대표적 쓰임을 모든 경우에 적용하거나 기체의 성질을 서로 바꾸지 않았나요?",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b55",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-03",
   "choices": [
    "공기(여러 기체의 혼합물)",
    "산소",
    "수소",
    "이산화 탄소",
    "헬륨"
   ],
   "key": 3
  },
  {
   "id": "c22-s42-u03-w011",
   "no": 11,
   "form": "choice",
   "topic": "공기·질소와 생활",
   "prompt": "건조한 공기에서 대부분을 이루는 두 기체를 고르세요.",
   "answer": "③ 질소와 산소",
   "explanation": "건조한 공기의 대부분을 이루는 대표 두 기체는 질소와 산소입니다. 공기는 여러 기체가 섞인 혼합물입니다. 한 기체가 더 많다는 사실을 다른 성분이 전혀 없다는 뜻으로 해석하지 않습니다.",
   "misconception": "대표적 쓰임을 모든 경우에 적용하거나 기체의 성질을 서로 바꾸지 않았나요?",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b61",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-03",
   "choices": [
    "수소와 헬륨",
    "헬륨과 네온",
    "질소와 산소",
    "산소와 이산화 탄소",
    "네온과 이산화 탄소"
   ],
   "key": 2
  },
  {
   "id": "c22-s42-u03-w012",
   "no": 12,
   "form": "choice",
   "topic": "여러 기체의 쓰임과 정보 범위",
   "prompt": "공중에 뜨는 비행선에 가벼우면서 잘 타지 않는 대표 기체를 고릅니다. 무엇인가요?",
   "answer": "⑤ 헬륨",
   "explanation": "공기보다 가볍고 잘 타지 않는다는 두 조건에 맞는 대표 기체는 헬륨입니다. 수소는 가볍다는 조건만으로 같은 선택이 되지 않습니다. 이용 자료를 조사하는 문제이며 기체 흡입으로 확인하지 않습니다.",
   "misconception": "대표적 쓰임을 모든 경우에 적용하거나 기체의 성질을 서로 바꾸지 않았나요?",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b67",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-03",
   "choices": [
    "산소",
    "수소",
    "이산화 탄소",
    "네온",
    "헬륨"
   ],
   "key": 4
  },
  {
   "id": "c22-s42-u03-w013",
   "no": 13,
   "form": "choice",
   "topic": "공기로 작동하는 장치 설계",
   "prompt": "공기로 종이 판을 들어 올리는 장치를 설계합니다. 목표와 성질의 연결로 알맞은 것은 무엇인가요?",
   "answer": "② 갇힌 공기가 물체를 미는 작용을 쓴다.",
   "explanation": "공기가 든 주머니가 종이판을 밀어 올리도록 공기의 미는 작용과 공간 차지를 구조에 연결합니다. 주머니 무게나 종이 색만으로 판이 올라가는 원리를 설명하지 않습니다. 실제 작동은 안전한 재료로 시험해 확인합니다.",
   "misconception": "설계와 실제 제작·시험을 구별하고 한 부분씩 바꾸어 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b73",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-04",
   "choices": [
    "종이판의 색이 공기 부피를 바꾸는 작용을 쓴다.",
    "갇힌 공기가 물체를 미는 작용을 쓴다.",
    "주머니 밖 공기만 식혀 종이판을 받치려 한다.",
    "공기가 든 주머니의 무게만으로 판을 위로 민다.",
    "공기가 새는 틈이 클수록 판을 더 오래 받친다."
   ],
   "key": 1
  },
  {
   "id": "c22-s42-u03-w014",
   "no": 14,
   "form": "choice",
   "topic": "장치의 비교·안전·평가 기준",
   "prompt": "두 공기 장치의 성능을 비교하려 합니다. 공정한 방법을 고르세요.",
   "answer": "① 같은 하중과 같은 작동 조건으로 비교한다.",
   "explanation": "두 장치에서 목표·하중·시작 상태·작동 방법과 비교 기준을 같게 둡니다. 한쪽만 가벼운 판을 쓰거나 공기를 오래 넣으면 구조 차이 외의 영향이 섞입니다. 각 장치의 가장 좋은 한 번만 고르는 것도 공정한 비교가 아닙니다.",
   "misconception": "설계와 실제 제작·시험을 구별하고 한 부분씩 바꾸어 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b79",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-04",
   "choices": [
    "같은 하중과 같은 작동 조건으로 비교한다.",
    "한 장치만 더 가벼운 판을 받치게 비교한다.",
    "각 장치가 가장 잘 된 한 번의 값만 비교한다.",
    "장치마다 성공 높이를 다르게 정해 비교한다.",
    "한 장치는 공기를 더 오래 넣은 뒤 비교한다."
   ],
   "key": 0
  },
  {
   "id": "c22-s42-u03-w015",
   "no": 15,
   "form": "choice",
   "topic": "실제 제작·시험과 개선",
   "prompt": "같은 판·시작 상태·펌프 방법으로 시험한 가상 기록입니다. 연결부 한 곳만 고친 뒤의 변화로 알맞게 설명한 것은 무엇인가요?",
   "answer": "④ 누출이 줄어 공기가 판을 더 오래 받쳤을 수 있다.",
   "explanation": "같은 판과 공기 넣는 방법에서 연결부 한 곳만 고쳤고, 새는 소리와 받친 시간이 함께 달라졌습니다. 누출을 줄여 공기가 판을 더 오래 받쳤을 가능성과 연결할 수 있습니다. 이 두 시험만으로 항상 같은 시간이 나온다고 확정하지 않습니다.",
   "misconception": "설계와 실제 제작·시험을 구별하고 한 부분씩 바꾸어 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "figure": "reuse-c22-s42-u03-b85",
   "sourceId": "c22-s42-u03-b85",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-04",
   "choices": [
    "연결을 고치면 어떤 판도 언제나6초 받친다.",
    "받친 시간이 늘면 안의 공기 양은 같을 수 없다.",
    "연결을 고쳤으므로 처음2초라는 값은 틀렸다.",
    "누출이 줄어 공기가 판을 더 오래 받쳤을 수 있다.",
    "시간 변화만으로 펌프가 새 공기를 만들었다고 안다."
   ],
   "key": 3
  },
  {
   "id": "c22-s42-u03-w016",
   "no": 16,
   "form": "choice",
   "topic": "장치 소개와 근거·의견 반영",
   "prompt": "두 장치를 같은 판·시작 상태·펌프 방법으로5번씩 시험했습니다. 표로 확인할 수 있는 것은 무엇인가요?",
   "answer": "③ 이 기록에서는 나의 성공 횟수가 더 많다.",
   "explanation": "각 장치를 같은 조건에서5번씩 시험한 기록입니다. 가의 성공3번과 나의 성공5번을 비교하면 이 기록에서는 나의 성공 횟수가 많습니다. 한 번의 최대 높이나 다른 조건의 횟수로 결론을 바꾸지 않습니다.",
   "misconception": "설계와 실제 제작·시험을 구별하고 한 부분씩 바꾸어 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "figure": "reuse-c22-s42-u03-b91",
   "sourceId": "c22-s42-u03-b91",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-04",
   "choices": [
    "가가 나보다 항상 더 오래 판을 받친다.",
    "나의 최대 높이는 가보다 반드시 더 크다.",
    "이 기록에서는 나의 성공 횟수가 더 많다.",
    "나는 앞으로 어떤 조건에서도 성공한다.",
    "가의 실패는 공기 양이 없었다는 증거다."
   ],
   "key": 2
  },
  {
   "id": "c22-s42-u03-w017",
   "no": 17,
   "form": "choice",
   "topic": "같은 부피 용기와 공기의 무게",
   "prompt": "같은 용기의 공기를 일부 뺀 뒤 같은 마개를 닫아 재었습니다. 다른 물질의 출입과 바깥 부피 변화가 없을 때 예상할 무게 변화는 무엇인가요?",
   "answer": "⑤ 공기를 빼기 전보다 줄어든다.",
   "explanation": "용기·마개·바깥 부피는 같고 공기 일부만 밖으로 나간 조건입니다. 공기도 무게가 있으므로 용기와 남은 공기의 전체 무게는 전보다 줄어듭니다. 용기가 같다는 사실이 전체 무게까지 같다는 뜻은 아닙니다.",
   "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b03",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-01",
   "choices": [
    "공기 양이 줄어도 용기가 같으므로 무게는 같다.",
    "공기를 뺀 양만큼 마개 무게도 함께 줄어든다.",
    "빠져나간 공기가 가벼워 남은 용기는 무거워진다.",
    "공기를 조금 빼면 처음 무게가 모두 없어진다.",
    "공기를 빼기 전보다 줄어든다."
   ],
   "key": 4
  },
  {
   "id": "c22-s42-u03-w018",
   "no": 18,
   "form": "choice",
   "topic": "무게 측정 자료와 작은 차이",
   "prompt": "눈금이 큰 저울에서는 공기 추가 전후 값이 같게 보였습니다. 다음 판단으로 알맞은 것은 무엇인가요?",
   "answer": "② 작은 차이를 못 읽었을 수 있어 다시 확인한다.",
   "explanation": "이 저울에서 작은 차이를 구분하지 못했을 수 있습니다. 실제로 같은 표시를 읽었다는 기록은 보존하고 눈금·누출·비교 조건을 다시 확인합니다. 같은 표시는 공기 무게가0이라는 결론이나 같은 공기 양이라는 증거가 아닙니다.",
   "misconception": "같은 용기·마개·바깥 부피로 비교했는지 살펴요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b09",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-01",
   "choices": [
    "전후 표시가 같으므로 추가한 공기 양도 같다고 한다.",
    "작은 차이를 못 읽었을 수 있어 다시 확인한다.",
    "전후 표시가 같으므로 공기의 무게는 0이라고 한다.",
    "전후 표시가 같으므로 바깥 부피가 변했다고 한다.",
    "전후 표시가 같으므로 용기 무게만 비교했다고 한다."
   ],
   "key": 1
  },
  {
   "id": "c22-s42-u03-w019",
   "no": 19,
   "form": "choice",
   "topic": "압력과 부피의 관찰",
   "prompt": "물과 공기를 같은 크기 주사기에 따로 넣어 막고 눌렀습니다. 물과 공기를 비교한 설명으로 알맞은 것은 무엇인가요?",
   "answer": "① 물은 거의 그대로이고 공기는 줄 수 있다.",
   "explanation": "이 비교의 압력 범위에서 물은 부피가 거의 변하지 않지만 공기는 압축될 수 있습니다. 같은 양이라는 조건이 부피가 변하지 않는다는 뜻은 아닙니다. 두 물질이 늘 같은 비율로 줄어든다고도 말하지 않습니다.",
   "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b27",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-02",
   "choices": [
    "물은 거의 그대로이고 공기는 줄 수 있다.",
    "물과 공기 모두 누르는 정도만큼 똑같이 줄어든다.",
    "물은 크게 줄지만 공기는 거의 변하지 않는다.",
    "물과 공기 모두 양이 같으면 부피가 변하지 않는다.",
    "물과 공기 모두 부피가 줄면 일부가 빠져나갔다."
   ],
   "key": 0
  },
  {
   "id": "c22-s42-u03-w020",
   "no": 20,
   "form": "choice",
   "topic": "생활 속 온도·압력 변화 구별",
   "prompt": "뜨거운 음식 위의 랩이 식으면서 안으로 들어갔습니다. 한 번의 모습만으로 원인을 검토할 때 바른 태도는 무엇인가요?",
   "answer": "④ 공기 냉각 외에 수증기·밀봉 조건도 살핀다.",
   "explanation": "음식 위에는 공기뿐 아니라 수증기와 밀봉 상태 등도 관련될 수 있습니다. 랩이 들어간 한 모습만으로 공기 온도 하나의 영향이라고 확정하기 어렵습니다. 냉각·수증기의 응결·밀봉 조건을 함께 살펴야 합니다.",
   "misconception": "공기 양·압력·온도·움직이는 경계 중 무엇이 달라졌는지 확인해요.",
   "criteria": "선택한 기호와 선택지 내용이 모두 맞으면 정답이에요.",
   "sourceId": "c22-s42-u03-b39",
   "sourceRef": {
    "type": "authored-supplement",
    "edition": "2022 개정 현행 범위 보충",
    "note": "원문 짝이 없는 독립 창작. 제시 수치/기록은 연습 자료이며 실제 학생 측정/제작/소통 증거가 아님."
   },
   "standard": "4과15-02",
   "choices": [
    "랩 크기만 보면 안의 공기 양도 정확히 안다.",
    "랩의 재질과 밀봉은 달라도 온도만 읽으면 된다.",
    "안으로 들어간 크기를 공기 무게로 바꿀 수 있다.",
    "공기 냉각 외에 수증기·밀봉 조건도 살핀다.",
    "랩이 들어가면 기체가 모두 빠져나갔다고 한다."
   ],
   "key": 3
  },
  {
   "id": "c22-s42-u03-w021",
   "no": 21,
   "form": "blank",
   "topic": "공기의 무게",
   "prompt": "공기는 눈에 잘 보이지 않지만 [ ]을 차지하고 [ ]가 있어요.",
   "answer": "공간 / 무게",
   "explanation": "공기는 눈에 잘 보이지 않아도 용기 안에서 공간을 차지해요. 다른 조건을 맞춘 공기 추가 전후 저울값은 무게가 있다는 근거가 돼요. 보이는지 여부와 공간·무게를 나누어 설명해요.",
   "misconception": "보이지 않는다는 이유로 공간이나 무게도 없다고 하지 않았나요?",
   "criteria": "첫 칸은 공간, 둘째 칸은 무게에 해당하는 뜻을 순서대로 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "공기의 무게",
    "inquirySkill": "조건을 적용한 개념 정리"
   },
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "공간",
      "무게"
     ]
    ],
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w022",
   "no": 22,
   "form": "blank",
   "topic": "압력과 부피",
   "prompt": "공기 양과 온도가 같을 때 압력이 커지면 공기의 부피는 [ ].",
   "answer": "줄어든다",
   "explanation": "공기 양과 온도는 같고 누르는 압력만 커지는 비교예요. 공기가 새지 않으면 같은 공기가 더 작은 공간을 차지하므로 부피는 줄어들어요. 공기가 밖으로 빠진 것과 구별해요.",
   "misconception": "공기 양이 같으면 부피도 같아야 한다고 생각하지 않았나요?",
   "criteria": "압력이 커지는 방향과 부피가 줄어드는 방향을 맞게 연결하면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "압력과 부피",
    "inquirySkill": "조건을 적용한 개념 정리"
   },
   "responseContract": {
    "type": "word",
    "accepted": [
     "줄어든다",
     "작아진다",
     "감소한다"
    ],
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w023",
   "no": 23,
   "form": "blank",
   "topic": "온도와 부피",
   "prompt": "공기 양과 바깥 압력이 같고 경계가 움직일 때, 온도가 높아지면 부피는 [ ].",
   "answer": "커진다",
   "explanation": "같은 공기 양·같은 바깥 압력과 움직일 수 있는 경계라는 조건을 함께 읽어요. 온도가 높아지면 그 조건의 공기 부피는 커져요. 딱딱한 병 자체의 크기도 반드시 커진다는 뜻은 아니에요.",
   "misconception": "따뜻해지면 공기가 더 생긴다거나 모든 용기가 똑같이 커진다고 하지 않았나요?",
   "criteria": "제시 조건에서 부피가 커진다는 뜻을 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도와 부피",
    "inquirySkill": "조건을 적용한 개념 정리"
   },
   "responseContract": {
    "type": "word",
    "accepted": [
     "커진다",
     "늘어난다",
     "증가한다"
    ],
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w024",
   "no": 24,
   "form": "blank",
   "topic": "기체의 쓰임",
   "prompt": "다른 물질의 연소를 돕고 호흡에 필요한 기체는 [ ]예요.",
   "answer": "산소",
   "explanation": "두 단서는 호흡에 필요함과 다른 물질의 연소를 도움입니다. 이 단서에 맞는 기체는 산소예요. 연소를 돕는 역할을 산소 자체가 타는 연료라는 뜻으로 바꾸지 않아요.",
   "misconception": "연소를 돕는 기체와 스스로 타는 연료의 역할을 구별했나요?",
   "criteria": "두 성질에 해당하는 산소를 쓰면 인정해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "기체의 쓰임",
    "inquirySkill": "조건을 적용한 개념 정리"
   },
   "responseContract": {
    "type": "word",
    "accepted": [
     "산소"
    ],
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w025",
   "no": 25,
   "form": "blank",
   "topic": "공정한 비교",
   "prompt": "무엇이 영향을 주었는지 알아보려면 한 번에 [ ] 조건만 바꾸어요.",
   "answer": "한 가지",
   "explanation": "한 조건의 영향을 알아보려면 바꿀 조건 하나를 정하고 다른 관련 조건을 맞추어요. 예를 들어 압력과 온도를 함께 바꾸면 부피 차이를 어느 한 조건의 영향으로만 나누기 어려워요.",
   "misconception": "관찰할 결과인 부피까지 미리 같게 만들어야 한다고 생각하지 않았나요?",
   "criteria": "한 가지라는 뜻을 쓰면 인정해요. 다른 조건은 비교를 위해 맞춘다는 설명도 타당해요.",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "공정한 비교",
    "inquirySkill": "조건을 적용한 개념 정리"
   },
   "responseContract": {
    "type": "word",
    "accepted": [
     "한 가지",
     "한가지",
     "하나"
    ],
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w026",
   "no": 26,
   "form": "multi",
   "topic": "압력 비교",
   "prompt": "같은 공기의 압력과 부피를 비교할 때 같게 할 조건을 모두 골라요.",
   "answer": "①, ③, ⑤",
   "explanation": "압력은 달리할 조건이고 부피는 관찰할 결과예요. 공기 양·온도와 관찰 기구·읽는 방법을 같게 두어 다른 영향이 섞이지 않게 해요. 압력이나 결과 부피까지 같게 맞추는 선택은 질문과 맞지 않아요.",
   "misconception": "바꿀 압력과 결과 부피를 같게 둘 조건에 포함하지 않았나요?",
   "criteria": "공기 양·온도·같은 기구와 읽는 방법 세 항목을 모두 고르고 나머지는 제외해요.",
   "choices": [
    "공기의 양",
    "공기를 누르는 압력",
    "공기의 온도",
    "결과로 나온 부피",
    "관찰할 기구와 읽는 방법"
   ],
   "key": [
    0,
    2,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "압력 비교",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      0,
      2,
      4
     ]
    ],
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u03-w027",
   "no": 27,
   "form": "multi",
   "topic": "온도 비교",
   "prompt": "온도에 따른 부피 변화를 살펴볼 조건으로 알맞은 것을 모두 골라요.",
   "answer": "①, ②, ④",
   "explanation": "온도만 달리해 부피를 비교하려면 같은 양의 공기, 거의 같은 바깥 압력, 움직일 수 있는 경계가 필요해요. 공기를 빼면 양도 달라지고 딱딱한 병의 바깥 크기만 재면 안의 부피 변화를 보기 어려워요.",
   "misconception": "온도만 다르게 보려는 비교에 공기 출입이나 고정된 경계를 섞지 않았나요?",
   "criteria": "공기 양·바깥 압력·움직일 경계의 세 조건을 모두 고르면 인정해요.",
   "choices": [
    "같은 양의 공기",
    "거의 같은 바깥 압력",
    "공기 일부를 차례마다 빼기",
    "가볍게 움직일 수 있는 경계",
    "딱딱한 병의 바깥 크기만 재기"
   ],
   "key": [
    0,
    1,
    3
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 비교",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      0,
      1,
      3
     ]
    ],
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u03-w028",
   "no": 28,
   "form": "multi",
   "topic": "자료 해석",
   "prompt": "같은 바깥 부피의 용기에 공기만 더 넣자120.0 g에서120.3 g이 되었어요. 자료의 해석과 확인할 점으로 알맞은 것을 모두 골라요.",
   "answer": "②, ③, ⑤",
   "explanation": "나중120.3 g에서 처음120.0 g을 빼면0.3 g 증가예요. 용기·마개·바깥 부피가 같고 다른 물질 출입이 없다는 조건에서 공기의 무게를 설명할 근거가 돼요. 차이를 모든 공기의 무게나 안의 전체 공기 무게라고 하지 않아요.",
   "misconception": "전후 차이0.3 g과 용기 안 공기 전체의 무게를 구별했나요?",
   "criteria": "증가량·공기 무게의 근거·다른 조건 확인의 세 항목을 고르면 인정해요.",
   "choices": [
    "공기는 어떤 상황에서도 0.3 g이다",
    "늘어난 무게는 0.3 g이다",
    "공기도 무게가 있다는 근거다",
    "늘어난 값은 용기 안 공기 전체의 무게다",
    "용기·마개 등 다른 조건도 확인해야 한다"
   ],
   "key": [
    1,
    2,
    4
   ],
   "given": [
    "가상 학습 자료 · 같은 용기·마개·바깥 부피 · 다른 물질의 출입 없음"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "자료 해석",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      1,
      2,
      4
     ]
    ],
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u03-w029",
   "no": 29,
   "form": "multi",
   "topic": "장치 개선",
   "prompt": "공기 인형이 잘 움직이지 않을 때 알맞은 행동을 모두 골라요.",
   "answer": "②, ④, ⑤",
   "explanation": "잘 움직이지 않는 까닭은 연결부 누출·관 막힘·움직일 부분의 걸림 등일 수 있어요. 먼저 단서를 확인하고 한 부분만 고친 뒤 같은 기준으로 다시 시험해요. 여러 부분을 한꺼번에 바꾸면 어느 수정의 효과인지 가리기 어려워요.",
   "misconception": "원인을 확인하기 전에 펌프 방법이나 여러 재료를 함께 바꾸지 않았나요?",
   "criteria": "누출 확인·관 상태 확인·한 부분 수정 후 재시험을 모두 고르면 인정해요.",
   "choices": [
    "관·주머니·종이 무게를 한꺼번에 바꾼다",
    "공기가 새는 연결부를 살핀다",
    "원인 확인 없이 펌프 횟수만 늘려 같은 비교로 본다",
    "관이 눌리거나 막혔는지 살핀다",
    "한 부분만 고친 뒤 다시 시험한다"
   ],
   "key": [
    1,
    3,
    4
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 개선",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      1,
      3,
      4
     ]
    ],
    "teacherRequired": false,
    "orderSensitive": false
   }
  },
  {
   "id": "c22-s42-u03-w030",
   "no": 30,
   "form": "match",
   "topic": "조건 구별",
   "prompt": "〈보기〉에서 알맞은 기호를 골라 조건과 결과를 연결해요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "압력 비교에서 바꿀 것은 누르는 압력이므로ㄴ이에요. 온도 비교에서 공기 양과 바깥 압력은 같게 둘 조건이므로ㄷ이고, 두 비교에서 관찰할 부피는ㄱ이에요. 같은 낱말을 질문마다 다른 역할로 읽지 않아요.",
   "misconception": "바꿀 것·같게 둘 것·관찰할 결과를 서로 바꾸지 않았나요?",
   "criteria": "각 부분에ㄴ·ㄷ·ㄱ을 순서대로 연결하면 인정해요.",
   "parts": [
    "(1) 압력 비교에서 바꿀 것",
    "(2) 온도 비교에서 같게 둘 것",
    "(3) 두 실험에서 관찰할 결과"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 공기의 부피  ㄴ. 공기를 누르는 압력  ㄷ. 공기 양과 바깥 압력"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "조건 구별",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "ㄴ",
      "ㄷ",
      "ㄱ"
     ]
    ],
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w031",
   "no": 31,
   "form": "match",
   "topic": "기체와 쓰임",
   "prompt": "자료에서 확인한 기체와 대표적인 이용을 연결해요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "산소는 호흡과 관련되어 호흡 보조ㄷ, 질소는 낮은 반응성을 이용한 일부 식품 포장ㄱ, 이산화 탄소는 탄산음료ㄴ과 연결돼요. 대표 사례를 모든 식품·모든 포장에 넓혀 적용하지 않아요.",
   "misconception": "기체 이름만 외우지 않고 어떤 성질이 쓰임과 이어지는지 생각했나요?",
   "criteria": "산소ㄷ·질소ㄱ·이산화 탄소ㄴ을 각 칸에 연결하면 인정해요.",
   "parts": [
    "(1) 산소",
    "(2) 질소",
    "(3) 이산화 탄소"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 일부 식품 포장  ㄴ. 탄산음료  ㄷ. 호흡 보조"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "기체와 쓰임",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
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
   }
  },
  {
   "id": "c22-s42-u03-w032",
   "no": 32,
   "form": "match",
   "topic": "모형 결과",
   "prompt": "같은 양의 공기를 비교한 모형 결과를 보고 기호를 골라요.",
   "answer": "(1) ㄴ (2) ㄱ (3) ㄷ",
   "explanation": "먼저 압력 비교와 온도 비교를 나누어요. 자료에서 상대 압력1의60 mL는ㄴ, 상대 압력3의20 mL는ㄱ, 온도30 ℃의62 mL는ㄷ이에요. 이 모형의 표시값을 다른 기구의 실제 측정값으로 바꾸지 않아요.",
   "misconception": "서로 다른 비교의 압력 숫자와 온도 숫자를 한 줄의 같은 조건처럼 합치지 않았나요?",
   "criteria": "각 자료값에 해당하는ㄴ·ㄱ·ㄷ을 순서대로 연결하면 인정해요.",
   "parts": [
    "(1) 상대 압력 1",
    "(2) 상대 압력 3",
    "(3) 온도 30 ℃"
   ],
   "answerPerPart": true,
   "given": [
    "〈모형 결과〉 상대 압력 1: 60 mL · 상대 압력 3: 20 mL · 온도 30 ℃: 62 mL",
    "〈보기〉 ㄱ. 20 mL  ㄴ. 60 mL  ㄷ. 62 mL"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "모형 결과",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
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
   }
  },
  {
   "id": "c22-s42-u03-w033",
   "no": 33,
   "form": "order",
   "topic": "비교 실험",
   "prompt": "공기 부피 비교 실험을 알맞은 순서로 배열해요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "질문과 예상을 정해야 무엇의 영향을 비교할지 알 수 있어요. 그 뒤 바꿀 조건과 같게 둘 조건을 정하고 관찰값을 남겨요. 마지막에는 그 기록을 근거로 설명하므로ㄴ→ㄹ→ㄱ→ㄷ이에요.",
   "misconception": "조건을 정하거나 관찰하기 전에 결론부터 확정하지 않았나요?",
   "criteria": "질문·조건 설계·관찰 기록·근거 설명의 순서로 배열하면 인정해요.",
   "given": [
    "ㄱ. 조건별 부피를 관찰하고 기록한다",
    "ㄴ. 알아볼 질문과 예상을 정한다",
    "ㄷ. 기록을 비교하고 근거로 설명한다",
    "ㄹ. 바꿀 조건과 같게 둘 조건을 정한다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "비교 실험",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
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
   }
  },
  {
   "id": "c22-s42-u03-w034",
   "no": 34,
   "form": "order",
   "topic": "장치 개선",
   "prompt": "공기 인형을 개선할 과정을 순서대로 배열해요.",
   "answer": "ㄷ → ㄴ → ㄹ → ㄱ",
   "explanation": "공기 경로와 성공 기준을 설계한 뒤 실제로 만들어 시험해요. 작동이 부족한 근거를 찾아 한 곳만 고치고 같은 기준으로 다시 시험해야 개선 여부를 비교할 수 있어요. 따라서ㄷ→ㄴ→ㄹ→ㄱ이에요.",
   "misconception": "고친 사실만으로 재시험의 성공까지 확인했다고 하지 않았나요?",
   "criteria": "설계·제작 시험·근거에 따른 수정·같은 기준 재시험을 순서대로 연결해요.",
   "given": [
    "ㄱ. 고친 뒤 같은 기준으로 다시 시험한다",
    "ㄴ. 실제로 만들어 움직임을 시험한다",
    "ㄷ. 공기 경로와 성공 기준을 설계한다",
    "ㄹ. 문제 근거를 찾아 한 부분만 고친다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 개선",
    "inquirySkill": "조건·근거 분류와 절차 검토"
   },
   "responseContract": {
    "type": "sequence",
    "accepted": [
     [
      "ㄷ",
      "ㄴ",
      "ㄹ",
      "ㄱ"
     ]
    ],
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w035",
   "no": 35,
   "form": "written",
   "topic": "공기 양과 부피",
   "prompt": "공기가 새지 않는 주사기를 같은 온도에서 누르고 있어요. “공기가 없어져서 부피가 줄었다”는 말을 바르게 고쳐 써요.",
   "answer": "공기가 새지 않으면 양은 같다. 압력이 커져 같은 공기가 더 작은 공간을 차지한다.",
   "explanation": "새지 않는 같은 공기라는 조건을 먼저 확인해요. 피스톤을 누를 때 부피가 줄어도 안의 공기 양은 같아요. 같은 공기가 더 작은 공간을 차지한다고 고치고, 빠져나가 없어진 것처럼 설명하지 않아요.",
   "misconception": "줄어든 눈금을 줄어든 공기 양으로 바꾸어 말하지 않았나요?",
   "criteria": "밀폐되어 공기 양이 같음과 압력 증가에 따른 부피 감소를 모두 연결하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "공기 양과 부피",
    "inquirySkill": "조건과 자료를 연결한 설명·설계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "밀폐되어 공기 양이 같음과 압력 증가에 따른 부피 감소를 모두 연결하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w036",
   "no": 36,
   "form": "written",
   "topic": "온도 비교의 조건",
   "prompt": "따뜻한 물에 넣은 딱딱한 병이 거의 커지지 않았어요. 이것만으로 “온도는 공기 부피와 관계없다.”고 해도 될까요?",
   "answer": "그렇게 말할 수 없다. 딱딱한 병은 부피가 거의 고정되어 있으므로 유연한 주머니처럼 경계가 움직이는 조건에서 비교해야 한다.",
   "explanation": "확인한 것은 딱딱한 병의 바깥 크기가 거의 달라지지 않았다는 점이에요. 경계가 움직일 수 없는 병과 움직일 수 있는 주머니는 조건이 달라요. 같은 양·바깥 압력을 유지하고 경계가 움직일 때의 부피 자료가 더 필요해요.",
   "misconception": "용기 바깥 크기와 경계가 움직이는 공기의 부피 관찰을 같게 보지 않았나요?",
   "criteria": "고정된 경계의 한계와 움직일 경계에서 다른 조건을 맞춘 비교를 설명하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 비교의 조건",
    "inquirySkill": "조건과 자료를 연결한 설명·설계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "고정된 경계의 한계와 움직일 경계에서 다른 조건을 맞춘 비교를 설명하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w037",
   "no": 37,
   "form": "written",
   "topic": "사진과 원인",
   "prompt": "봉지가 부푼 사진 한 장만 보고 온도 때문이라고 말하기 어려운 까닭을 써요.",
   "answer": "공기 양·온도·바깥 압력·누출 여부를 모르기 때문이다. 다른 조건을 확인해야 원인을 구별할 수 있다.",
   "explanation": "사진 한 장은 부푼 모습만 보여 줘요. 전후 온도·바깥 압력·공기 출입 등 어떤 조건이 달랐는지 모르므로 온도 하나의 영향이라고 정할 수 없어요. 원인을 나누려면 다른 조건을 맞춘 비교 자료를 확인해요.",
   "misconception": "부푼 결과만 보고 사진에 없는 온도 변화나 공기 출입을 지어내지 않았나요?",
   "criteria": "확인할 관련 조건 두 가지 이상과 단일 원인을 정할 수 없는 한계를 설명해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "사진과 원인",
    "inquirySkill": "조건과 자료를 연결한 설명·설계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "확인할 관련 조건 두 가지 이상과 단일 원인을 정할 수 없는 한계를 설명해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w038",
   "no": 38,
   "form": "written",
   "topic": "모형의 한계",
   "prompt": "모형은30 ℃에서62 mL, 다른 주머니는 같은 온도에서60 mL였다고 정한 자료예요. 두 값이 다르니 어느 하나를 고쳐야 할까요? 비교하기 전에 확인할 조건을 써요.",
   "answer": "임의로 고치면 안 된다. 모형 값과 다른 주머니의 기록을 구별하고 공기 양·바깥 압력·주머니 경계·기다린 때 등의 조건을 확인한다. 같은 온도만으로 같은 부피가 되어야 한다고 할 수 없다.",
   "explanation": "같은30 ℃라도 주머니 안 공기 양·바깥 압력·경계의 재질·충분히 기다린 때가 다르면 같은 비교가 아니에요.62 mL는 모형 값,60 mL는 따로 읽었다고 정한 기록이에요. 수치를 서로 맞추기보다 조건과 자료의 성격을 확인해요.",
   "misconception": "온도 하나가 같다는 이유로 다른 공기 양과 기구의 부피도 같아야 한다고 하지 않았나요?",
   "criteria": "자료의 성격 구별과 비교할 조건 두 가지 이상을 제시하고 어느 값을 임의로 고치지 않으면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "모형의 한계",
    "inquirySkill": "조건과 자료를 연결한 설명·설계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "자료의 성격 구별과 비교할 조건 두 가지 이상을 제시하고 어느 값을 임의로 고치지 않으면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w039",
   "no": 39,
   "form": "draw",
   "topic": "공기 장치 설계",
   "prompt": "손 펌프·관·얇은 주머니·가벼운 종이판으로 인형을 일으킬 장치를 그려요. 공기 이동과 주머니가 종이판을 미는 방향을 다른 화살표로, 연결부와 안전하게 멈출 기준도 표시해요.",
   "answer": "공기 이동은 펌프→관→주머니까지 표시한다. 주머니가 부풀어 종이판을 미는 방향은 다른 화살표로 표시한다. 네 부분의 연결과 연결부 밀봉·멈춤 기준을 나타낸다.",
   "explanation": "공기를 보내는 펌프·공기가 지나가는 관·부풀 수 있는 주머니·움직일 종이판을 연결해 생각해요. 공기 이동 화살표는 펌프→관→주머니, 종이판 움직임은 주머니가 미는 방향으로 따로 표시해요. 주머니에서 종이판 안으로 공기가 흐르는 그림과 구별해요.",
   "misconception": "공기가 지나는 길과 주머니가 판을 미는 방향을 같은 화살표로 섞지 않았나요?",
   "criteria": "네 부분·이어진 공기 경로·판의 움직임과 연결부/멈춤 기준을 나타낸 타당한 설계를 인정해요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "공기 장치 설계",
    "inquirySkill": "조건과 자료를 연결한 설명·설계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "네 부분·이어진 공기 경로·판의 움직임과 연결부/멈춤 기준을 나타낸 타당한 설계를 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w040",
   "no": 40,
   "form": "draw",
   "topic": "개선 시험 설계",
   "prompt": "설계한 장치의 연결부에서 공기가 샌다고 생각해요. 고칠 한 곳·같게 둘 조건 두 가지와 같은 기준으로 비교할 결과를 그림에 덧붙여요.",
   "answer": "연결부 밀봉 한 곳을 고치고, 같은 주머니·종이 인형·시작 상태·펌프 방법을 같게 둔다. 수정 전후 움직임을 같은 기준으로 비교한다.",
   "explanation": "새는 연결부 한 곳을 밀봉하도록 고치고 다른 조건은 유지해요. 같은 주머니·종이판·시작 상태·펌프 방법 중 두 가지 이상을 정하고, 수정 전후 움직임을 같은 기준으로 비교해요. 그림은 그 재시험의 계획이에요.",
   "misconception": "연결부를 고칠 때 종이 무게와 펌프 방법까지 함께 바꾸지 않았나요?",
   "criteria": "고칠 한 곳·같게 둘 조건 둘 이상·같은 비교 기준이 있으면 다른 타당한 설계도 인정해요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "개선 시험 설계",
    "inquirySkill": "조건과 자료를 연결한 설명·설계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "고칠 한 곳·같게 둘 조건 둘 이상·같은 비교 기준이 있으면 다른 타당한 설계도 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w041",
   "no": 41,
   "form": "choice",
   "topic": "무게 비교 자료",
   "prompt": "3회째 처음 저울값이 앞선 두 회와 조금 달라요. 세 기록을 비교할 방법으로 알맞은 것은?",
   "answer": "③ 각 회의 넣기 전후 차이를 비교한다",
   "explanation": "각 회의 처음 값과 나중 값을 짝지어 빼야 공기를 더한 뒤의 변화를 비교할 수 있어요. 세 차이는 모두0.4 g이에요. 나중 값끼리만 빼거나 서로 다른 회를 섞으면 같은 공기 추가 전후의 차이가 아니에요.",
   "misconception": "처음 값이 다른3회를 버리거나 값을 고쳐 다른 회와 같게 만들지 않았나요?",
   "criteria": "각 회의 전후 차이를 비교하는 보기를 고르면 인정해요.",
   "choices": [
    "세 회의 넣은 뒤 값만 서로 뺀다",
    "3회 전 값을120.2 g으로 고쳐 쓴다",
    "각 회의 넣기 전후 차이를 비교한다",
    "1회 전과3회 후만 짝지어 뺀다",
    "3회 값이 다르니 그 기록을 버린다"
   ],
   "key": 2,
   "contextRef": "mass-trials-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "무게 비교 자료",
    "inquirySkill": "무게 비교 조건과 측정 한계"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     2
    ]
   }
  },
  {
   "id": "c22-s42-u03-w042",
   "no": 42,
   "form": "multi",
   "topic": "무게 비교 자료",
   "prompt": "자료를 바르게 해석하고 비교 조건을 확인한 말을 모두 고르세요.",
   "answer": "①, ③, ④",
   "explanation": "120.6−120.2,120.6−120.2,120.7−120.3은 각각0.4 g이에요. 공기 외 조건이 같다는 자료와 함께 공기도 무게 있다는 근거가 돼요. 처음 값이 조금 달라도 차이는 같고,0.4 g을 모든 공기의 무게로 일반화하지 않아요.",
   "misconception": "서로 다른 처음 표시값과 각각의 증가량을 혼동하지 않았나요?",
   "criteria": "세 비교의 증가량·기체 무게의 근거·다른 물질 확인 항목을 모두 고르면 인정해요.",
   "choices": [
    "세 비교에서 각각0.4 g 늘었다",
    "모든 공기의 무게가0.4 g이다",
    "공기도 무게가 있다는 근거다",
    "다른 물질의 출입도 확인해야 한다",
    "세 회의 처음 값이 달라 증가량도 모두 다르다"
   ],
   "key": [
    0,
    2,
    3
   ],
   "contextRef": "mass-trials-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "무게 비교 자료",
    "inquirySkill": "무게 비교 조건과 측정 한계"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      0,
      2,
      3
     ]
    ],
    "orderSensitive": false,
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w043",
   "no": 43,
   "form": "blank",
   "topic": "저울의 한계",
   "prompt": "눈금이 거친 저울에서 넣기 전후 값이 같게 보였다는 사실만으로, 공기의 무게가0이라고 단정할 수 [ ].",
   "answer": "없다",
   "explanation": "같은 표시값은 그 저울에서 차이를 구분하지 못했다는 기록일 수 있어요. 공기를 더 넣었는지·누출·눈금의 한계를 확인하기 전에는 무게가0이라고 단정할 수 없어요. 빈칸은 없다는 뜻이에요.",
   "misconception": "표시에서 구분되지 않은 차이를 공기 자체의 무게0으로 해석하지 않았나요?",
   "criteria": "없다·없어요·없음처럼 단정할 수 없다는 뜻이면 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "없다",
     "없어요",
     "없음"
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "저울의 한계",
    "inquirySkill": "무게 비교 조건과 측정 한계"
   }
  },
  {
   "id": "c22-s42-u03-w044",
   "no": 44,
   "form": "short",
   "topic": "무게 비교 자료",
   "prompt": "3회째 넣기 전후 저울값의 차이는 얼마인가요? 단위까지 쓰세요.",
   "answer": "0.4 g",
   "explanation": "3회의 나중120.7 g에서 처음120.3 g을 빼면0.4 g이에요. 단위g까지 적어 차이의 뜻을 밝혀요. 안의 공기 전체 무게를 구한 것은 아니며, 서로 다른 회의 값을 짝지어 빼면 이 질문의 답이 아니에요.",
   "misconception": "전체 무게120.7 g이나 다른 회의 나중 값과의 차이를 답하지 않았나요?",
   "criteria": "0.4와g 단위를 함께 쓴 동등한 수량 표현을 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "0.4 g"
    ],
    "teacherRequired": false,
    "value": 0.4,
    "unit": "g",
    "unitRequired": true,
    "tolerance": 0.00001
   },
   "contextRef": "mass-trials-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "무게 비교 자료",
    "inquirySkill": "무게 비교 조건과 측정 한계"
   }
  },
  {
   "id": "c22-s42-u03-w045",
   "no": 45,
   "form": "match",
   "topic": "관찰과 해석",
   "prompt": "문장의 역할을 〈보기〉와 연결하세요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "저울 표시가 바뀌었다는 문장은 관찰ㄷ이에요. 공기의 무게와 연결한 문장은 그 근거를 해석한ㄱ, 물방울을 확인하자는 문장은 다른 원인을 살필ㄴ이에요. 관찰값과 그 까닭의 해석은 같은 정보가 아니에요.",
   "misconception": "저울이 보여 준 숫자만으로 다른 물질의 출입까지 모두 확인했다고 하지 않았나요?",
   "criteria": "관찰ㄷ·해석ㄱ·추가 확인ㄴ을 각 부분에 연결하면 인정해요.",
   "parts": [
    "(1) 저울 표시가120.2 g에서120.6 g으로 바뀌었다.",
    "(2) 조건을 확인하면 공기도 무게가 있다는 근거가 된다.",
    "(3) 마개에 물방울이 묻지 않았는지 확인하자."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 근거를 해석한 말  ㄴ. 추가로 확인할 일  ㄷ. 관찰한 사실"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "관찰과 해석",
    "inquirySkill": "무게 비교 조건과 측정 한계"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄴ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w046",
   "no": 46,
   "form": "order",
   "topic": "무게 비교 계획",
   "prompt": "교사가 준비한 비교 자료를 검토하는 순서로 기호를 쓰세요.",
   "answer": "ㄴ → ㄹ → ㄱ → ㄷ",
   "explanation": "알아볼 무게를 정한 뒤 용기·마개·바깥 부피·저울 조건을 확인해요. 그 기준으로 전후 값을 기록하고, 차이와 다른 물질 출입 여부를 함께 설명하므로ㄴ→ㄹ→ㄱ→ㄷ이에요. 결과만 읽고 조건 확인을 생략하지 않아요.",
   "misconception": "기체 무게라는 결론을 정하려고 차이에 영향을 줄 다른 물질을 무시하지 않았나요?",
   "criteria": "질문·조건 확인·전후 기록·조건과 함께 해석하는 순서로 배열해요.",
   "given": [
    "ㄱ. 전후 값을 나란히 기록한다.",
    "ㄴ. 무엇의 무게를 알아볼지 정한다.",
    "ㄷ. 다른 물질의 출입 여부와 차이를 함께 설명한다.",
    "ㄹ. 용기·마개·바깥 부피·저울 조건을 확인한다."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "무게 비교 계획",
    "inquirySkill": "무게 비교 조건과 측정 한계"
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
   "id": "c22-s42-u03-w047",
   "no": 47,
   "form": "written",
   "topic": "저울의 한계",
   "prompt": "한 모둠의 저울에서는 전후 값이 같게 보였어요. 「공기는 무게가 없다」고 발표하려는 친구에게 확인할 점 두 가지를 제안하세요.",
   "answer": "저울이 얼마나 작은 차이를 나타낼 수 있는지 확인한다. 공기가 실제로 더 들어갔는지, 새지 않았는지, 같은 용기·마개로 쟀는지 확인하고 필요하면 교사의 더 알맞은 자료와 비교한다.",
   "explanation": "같은 표시는 작은 차이가 눈금에 드러나지 않았거나 실제 공기가 더 남지 않았을 때도 가능해요. 저울의 한계와 공기 출입·누출·같은 용기 조건을 확인해요. 기록을 그대로 남기고 무게가 없다는 결론 대신 추가 비교를 제안해요.",
   "misconception": "예상한 차이가 안 보인다는 이유로 원래 기록을 지우지 않았나요?",
   "criteria": "저울의 한계와 공기 출입/비교 조건 중 한 가지를 제안하며 성급한 결론을 고치면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "저울의 한계",
    "inquirySkill": "무게 비교 조건과 측정 한계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "저울의 한계와 공기 출입/비교 조건 중 한 가지를 제안하며 성급한 결론을 고치면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w048",
   "no": 48,
   "form": "draw",
   "topic": "무게 비교 설계",
   "prompt": "공기의 무게를 비교하는 「넣기 전·넣은 후」 자료 그림을 그리세요. 같게 할 것 세 가지와 저울값을 읽을 자리를 표시하고, 실제 실험과 자료 그림의 차이도 쓰세요.",
   "answer": "같은 단단한 용기·마개·바깥 부피와 저울을 두 상태에 표시하고 공기만 더 넣은 조건을 적는다. 저울 표시를 읽는 곳을 표시한다. 이것은 비교 계획이며 실제로 쟀다는 뜻은 아니다.",
   "explanation": "두 상태에 같은 용기·마개·바깥 부피와 저울을 표시하고 공기 양만 달라짐을 나타내요. 눈금 값을 읽을 곳을 두 상태에서 같은 기준으로 표시해야 비교가 돼요. 부피가 커진 풍선 두 개만 그리면 이 무게 비교의 조건과 다릅니다.",
   "misconception": "용기나 바깥 크기까지 함께 바뀌는 그림을 공기만의 무게 비교라고 하지 않았나요?",
   "criteria": "같은 조건 셋·공기만의 출입·두 상태의 저울 읽기 자리·비교 계획임을 나타내면 인정해요.",
   "drawing": "large",
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-01",
    "topic": "무게 비교 설계",
    "inquirySkill": "무게 비교 조건과 측정 한계"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "같은 조건 셋·공기만의 출입·두 상태의 저울 읽기 자리·비교 계획임을 나타내면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w049",
   "no": 49,
   "form": "choice",
   "topic": "열림과 닫힘",
   "prompt": "A에서 직접 읽은 관찰 사실에 해당하는 것은?",
   "answer": "⑤ 더 누를 때 눈금이25 mL가 되었다",
   "explanation": "자료에 직접 적힌 것은 더 누른 때 눈금이25 mL가 되었다는 관찰이에요. A의 공기는 새지 않으므로 부피 감소를 양 감소로 바꾸지 않아요. 손을 뗀 뒤 값은39 mL이고, 눈금만으로 누르는 힘의 크기를 잰 것도 아니에요.",
   "misconception": "실제로 적힌25/39 mL와 예상한40 mL를 섞지 않았나요?",
   "criteria": "A의 더 누른 때 눈금25 mL라는 관찰 보기를 고르면 인정해요.",
   "choices": [
    "공기의 양도40에서25만큼 줄었다",
    "손을 뗀 뒤 정확히40 mL가 되었다",
    "A와B 모두 공기 양이 일정했다",
    "이 눈금만으로 누른 힘의 크기를 쟀다",
    "더 누를 때 눈금이25 mL가 되었다"
   ],
   "key": 4,
   "contextRef": "closed-open-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "열림과 닫힘",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     4
    ]
   }
  },
  {
   "id": "c22-s42-u03-w050",
   "no": 50,
   "form": "multi",
   "topic": "압력 비교 조건",
   "prompt": "A에서 누르는 정도에 따른 부피 변화를 비교할 때 같게 해야 할 것을 모두 고르세요.",
   "answer": "②, ⑤",
   "explanation": "A에서 바꿀 것은 누르는 압력이고 관찰할 결과는 부피예요. 공기 양과 온도는 같게 유지해야 다른 영향이 섞이지 않아요. 피스톤 위치나 들어간 거리는 부피와 함께 달라지는 결과이므로 미리 같은 값으로 맞추지 않아요.",
   "misconception": "일정하게 둘 공기 양·온도와 압력·피스톤 위치라는 변화/결과를 구별했나요?",
   "criteria": "안에 가둔 공기 양과 공기 온도 두 항목만 고르면 인정해요.",
   "choices": [
    "누르는 정도",
    "안에 가둔 공기의 양",
    "피스톤이 가리키는 결과 눈금",
    "피스톤이 안으로 들어간 거리",
    "공기의 온도"
   ],
   "key": [
    1,
    4
   ],
   "contextRef": "closed-open-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "압력 비교 조건",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      1,
      4
     ]
    ],
    "orderSensitive": false,
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w051",
   "no": 51,
   "form": "blank",
   "topic": "공기 양과 부피",
   "prompt": "공기가 새지 않는A를 더 누르면 부피는 [ ], 안의 공기 양은 [ ].",
   "answer": "줄어든다 / 같다",
   "explanation": "A는 같은 온도에서 공기가 새지 않는 조건이에요. 더 누르면40 mL였던 공간이25 mL로 줄지만 안의 공기 양은 같아요. 따라서 두 칸은 줄어든다/같다예요. 부피와 공기 양을 같은 말로 취급하지 않아요.",
   "misconception": "눈금이 줄어든 것을 공기가 밖으로 나갔다는 뜻으로 바꾸지 않았나요?",
   "criteria": "줄어든다 또는 작아진다/같다를 두 칸에 순서대로 쓰면 인정해요.",
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "줄어든다",
      "같다"
     ],
     [
      "작아진다",
      "같다"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "closed-open-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "공기 양과 부피",
    "inquirySkill": "변인 통제와 관찰·추론"
   }
  },
  {
   "id": "c22-s42-u03-w052",
   "no": 52,
   "form": "short",
   "topic": "눈금 자료 읽기",
   "prompt": "B에서 읽은 피스톤 앞쪽 공간은 시작보다 몇mL 줄었나요? 단위까지 쓰세요.",
   "answer": "30 mL",
   "explanation": "B의 피스톤 앞 공간은 처음40 mL에서10 mL로 바뀌었으므로30 mL 줄었어요. 단위mL를 함께 적어요. B는 끝이 열려 공기가 나갈 수 있으므로 같은 양의 공기가30 mL만큼 압축되었다는 해석과는 달라요.",
   "misconception": "공간의 차이30 mL와 새지 않는 같은 공기의 압축을 같게 보지 않았나요?",
   "criteria": "40−10의 차이30 mL를 단위와 함께 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "30 mL"
    ],
    "teacherRequired": false,
    "value": 30,
    "unit": "mL",
    "unitRequired": true
   },
   "contextRef": "closed-open-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "눈금 자료 읽기",
    "inquirySkill": "변인 통제와 관찰·추론"
   }
  },
  {
   "id": "c22-s42-u03-w053",
   "no": 53,
   "form": "match",
   "topic": "비교의 한계",
   "prompt": "실험 조건과 알맞은 판단을 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "A는 공기 양과 온도가 같아 압력 비교ㄴ과 연결돼요. B는 열린 끝으로 공기 출입도 달라질 수 있어ㄷ, C는 압력과 온도를 함께 바꾸어 한 효과를 가리기 어려우므로ㄱ이에요. 피스톤 위치만으로 세 비교를 같게 묶지 않아요.",
   "misconception": "끝의 열림·닫힘과 동시에 바꾼 조건 수를 함께 확인했나요?",
   "criteria": "Aㄴ·Bㄷ·Cㄱ을 순서대로 연결하면 인정해요.",
   "parts": [
    "(1) 공기 양·온도가 같은 밀폐A",
    "(2) 끝이 열려 공기가 드나드는B",
    "(3) 누르는 정도와 온도를 함께 바꾼C"
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 두 조건의 영향을 나누기 어렵다  ㄴ. 같은 공기에서 압력을 비교한다  ㄷ. 공기 출입도 함께 달라질 수 있다"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "비교의 한계",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄴ",
      "ㄷ",
      "ㄱ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w054",
   "no": 54,
   "form": "order",
   "topic": "압력 관찰 순서",
   "prompt": "교사의 안내에 따라 바늘 없는 주사기를 관찰하는 순서로 쓰세요.",
   "answer": "ㄹ → ㄴ → ㄷ → ㄱ 또는 ㄴ → ㄹ → ㄷ → ㄱ",
   "explanation": "처음 눈금·마개와 같은 온도·누출 여부를 모두 확인한 뒤 조금 누르고 눈금을 읽어요. 그 뒤 손을 뗀 눈금을 읽어 비교해요. 처음 상태 확인ㄹ과 비교 조건 확인ㄴ은 순서를 바꾸어도 두 확인을 누르기 전에 끝내면 타당해요.",
   "misconception": "처음 두 확인의 순서보다 관찰 전 조건 확인과 전후 기록이 모두 갖추어졌는지 봤나요?",
   "criteria": "ㄹ→ㄴ→ㄷ→ㄱ 또는 ㄴ→ㄹ→ㄷ→ㄱ을 인정해요. 누르기와 손을 뗀 뒤 읽기의 순서는 유지해요.",
   "given": [
    "ㄷ. 무리한 힘 없이 조금 누르고 눈금을 읽는다.",
    "ㄹ. 처음 공기 눈금과 마개 상태를 확인한다.",
    "ㄱ. 손을 뗀 뒤 눈금을 읽고 전후를 비교한다.",
    "ㄴ. 같은 온도와 누출 없는 조건인지 확인한다."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "압력 관찰 순서",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "sequence",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄹ",
      "ㄴ",
      "ㄷ",
      "ㄱ"
     ],
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
   "id": "c22-s42-u03-w055",
   "no": 55,
   "form": "written",
   "topic": "열림과 닫힘",
   "prompt": "A와B 모두 피스톤 앞쪽 공간이 줄었어요. 두 결과를 모두 「같은 공기가 압축되었다」고 말하기 어려운 까닭을 쓰세요.",
   "answer": "A는 공기가 새지 않아 같은 양의 공기가 더 작은 공간을 차지한다. B는 끝이 열려 공기가 밖으로 나갈 수 있어 같은 양의 공기라는 조건이 유지되지 않는다.",
   "explanation": "A는 공기가 새지 않아 같은 양이 더 작은 공간을 차지해요. B는 끝이 열려 공기가 나갈 수 있어 같은 양이라는 조건이 유지되지 않을 수 있어요. 부피 감소라는 모습은 비슷해도 출입 조건이 달라 같은 압축 비교로 묶지 않아요.",
   "misconception": "같은 피스톤 이동을 같은 공기 양의 변화로 곧바로 해석하지 않았나요?",
   "criteria": "A의 밀폐·같은 양과 B는 끝이 열려 출입 가능함을 비교해 설명하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "열림과 닫힘",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "A의 밀폐·같은 양과 B는 끝이 열려 출입 가능함을 비교해 설명하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w056",
   "no": 56,
   "form": "draw",
   "topic": "압력 비교 그림",
   "prompt": "A의 시작과 더 누른 뒤를 나란히 그리세요. 공기가 차지한 공간과 눈금, 막힌 끝을 표시하고 양과 부피를 나누어 설명하세요.",
   "answer": "두 그림에 마개를 닫아 표시하고 시작40 mL와 누른 뒤25 mL의 공간을 구별한다. 새지 않아 공기 양은 같고 부피가 줄었다고 설명한다.",
   "explanation": "시작40 mL와 더 누른 뒤25 mL의 공간을 각각 그리고 끝과 연결부가 새지 않는 조건을 표시해요. 피스톤 앞 공간은 줄지만 공기 양은 같다고 설명해요. 공기가 밖으로 나가는 화살표는 이A의 조건과 맞지 않아요.",
   "misconception": "25 mL를 표시하면서 공기가 밖으로 빠지는 화살표를 함께 그리지 않았나요?",
   "criteria": "막힌 끝·40/25 mL 공간·같은 공기 양과 부피 감소를 그림/설명으로 나타내면 인정해요.",
   "drawing": "large",
   "given": [
    "A는 같은 온도에서 공기가 새지 않는 주사기예요. 시작40 mL, 더 누른 뒤25 mL예요."
   ],
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "압력 비교 그림",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "막힌 끝·40/25 mL 공간·같은 공기 양과 부피 감소를 그림/설명으로 나타내면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w057",
   "no": 57,
   "form": "choice",
   "topic": "온도 비교 자료",
   "prompt": "35 ℃에서 다시15 ℃로 바꾼 뒤의 자료를 바르게 읽은 것은?",
   "answer": "② 부피가62 mL에서58 mL로 줄었다",
   "explanation": "35 ℃의62 mL에서 다시15 ℃의58 mL로 읽은 자료예요. 따라서 부피가62 mL에서58 mL로 줄었다는 보기를 골라요. 새지 않는 조건이므로4 mL를 공기가 빠진 양으로 바꾸거나45 ℃의 값을 이 자료에서 읽었다고 하지 않아요.",
   "misconception": "차갑게 돌아온 기록과 따뜻해질 때 기록을 거꾸로 읽지 않았나요?",
   "criteria": "제시된62→58 mL의 부피 감소를 읽은 보기를 고르면 인정해요.",
   "choices": [
    "부피가58 mL에서62 mL로 늘었다",
    "부피가62 mL에서58 mL로 줄었다",
    "닫힌 주머니 밖으로 공기4 mL가 빠졌다",
    "45 ℃의 부피도 이 자료에서 읽을 수 있다",
    "다시15 ℃여도 부피는62 mL로 남았다"
   ],
   "key": 1,
   "contextRef": "warming-cooling-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 비교 자료",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     1
    ]
   }
  },
  {
   "id": "c22-s42-u03-w058",
   "no": 58,
   "form": "multi",
   "topic": "온도 자료의 범위",
   "prompt": "제시한 자료로 말할 수 있는 것을 모두 고르세요.",
   "answer": "②, ③, ④",
   "explanation": "같은 양·같은 바깥 압력에서 따뜻해질 때58→60→62 mL로 커졌고, 다시15 ℃에서 처음과 같은58 mL를 읽었어요. 이 세 설명은 자료와 맞아요. 제시하지 않은45 ℃의 정확한 값이나 모든 단단한 용기의 변화까지 정할 수는 없어요.",
   "misconception": "관찰한 범위의 변화 방향과 자료 밖 온도의 정확한 값을 구별했나요?",
   "criteria": "따뜻할 때 증가·다시15 ℃의 같은 값·같은 양 비교 세 항목을 고르면 인정해요.",
   "choices": [
    "45 ℃의 정확한 값도 반드시 알 수 있다",
    "이 조건에서 따뜻해질 때 부피가 커졌다",
    "다시15 ℃에서 처음과 같은 부피를 읽었다",
    "같은 양의 공기를 비교했다",
    "모든 딱딱한 용기 자체도 똑같이 커진다"
   ],
   "key": [
    1,
    2,
    3
   ],
   "contextRef": "warming-cooling-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 자료의 범위",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      1,
      2,
      3
     ]
    ],
    "orderSensitive": false,
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w059",
   "no": 59,
   "form": "blank",
   "topic": "온도와 공기 양",
   "prompt": "밀폐된 주머니를 차게 해 부피가 줄어도, 새지 않았다면 안의 공기 양은 [ ].",
   "answer": "같다",
   "explanation": "공기가 새지 않았다면 안의 양은 유지돼요. 차갑게 했을 때 같은 공기가 더 작은 공간을 차지한 것이므로 빈칸은 같다예요. 부피 감소만으로 공기 일부가 사라졌다거나 종류가 바뀌었다고 설명하지 않아요.",
   "misconception": "차지한 공간이 달라진 것을 안의 물질 양이 달라진 것으로 바꾸지 않았나요?",
   "criteria": "같다·변하지 않는다·일정하다처럼 양의 유지라는 뜻을 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "같다",
     "변하지 않는다",
     "일정하다"
    ],
    "teacherRequired": false
   },
   "contextRef": "warming-cooling-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도와 공기 양",
    "inquirySkill": "변인 통제와 관찰·추론"
   }
  },
  {
   "id": "c22-s42-u03-w060",
   "no": 60,
   "form": "short",
   "topic": "온도 자료 읽기",
   "prompt": "자료에서 가장 높은 온도와 가장 낮은 온도의 차이는 몇℃인가요? 단위까지 쓰세요.",
   "answer": "20 ℃",
   "explanation": "자료의 최고 온도35 ℃와 최저 온도15 ℃를 찾아 차이를 구하면20 ℃예요. 차례 수나 부피 차이4 mL를 묻는 문제가 아니에요. 자료에 없는 온도의 부피를 구하는 공식으로 이 차이를 쓰지 않아요.",
   "misconception": "온도 차이에 부피 단위mL를 쓰거나35라는 최고값만 답하지 않았나요?",
   "criteria": "35−15의 차이20 ℃를 온도 단위와 함께 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "20 ℃"
    ],
    "teacherRequired": false,
    "value": 20,
    "unit": "℃",
    "unitRequired": true
   },
   "contextRef": "warming-cooling-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 자료 읽기",
    "inquirySkill": "변인 통제와 관찰·추론"
   }
  },
  {
   "id": "c22-s42-u03-w061",
   "no": 61,
   "form": "match",
   "topic": "움직이는 경계",
   "prompt": "상황과 먼저 확인할 조건을 연결하세요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "팽팽한 주머니는 더 움직일 경계가 있는지ㄷ을 확인해요. 느슨한 마개는 공기 양이 유지되는지ㄱ, 한쪽을 손으로 누르는 상황은 누르는 조건이 같은지ㄴ과 연결돼요. 온도 이외에 부피에 영향을 줄 조건을 찾는 문제예요.",
   "misconception": "같은 온도만 맞추면 경계·누출·누르는 조건은 관계없다고 생각하지 않았나요?",
   "criteria": "경계ㄷ·공기 양ㄱ·누르는 조건ㄴ을 각 상황에 연결하면 인정해요.",
   "parts": [
    "(1) 주머니가 팽팽해 더 커지지 않는다.",
    "(2) 마개가 느슨해 공기가 샐 수 있다.",
    "(3) 한쪽만 손으로 계속 누르고 있다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 공기 양이 유지되는가  ㄴ. 누르는 조건이 같은가  ㄷ. 경계가 움직일 수 있는가"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "움직이는 경계",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄴ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w062",
   "no": 62,
   "form": "order",
   "topic": "온도 비교 순서",
   "prompt": "교사가 준비한 안전한 온도 비교 자료를 확인하는 순서로 쓰세요.",
   "answer": "ㄱ → ㄷ → ㄹ → ㄴ",
   "explanation": "같은 공기 양·바깥 압력·움직일 경계를 정한ㄱ 뒤 정한 온도가 될 때까지 기다리는ㄷ이 와요. 각 온도와 부피를 함께 기록ㄹ하고 변화 방향을 비교ㄴ하므로ㄱ→ㄷ→ㄹ→ㄴ이에요. 기다리기 전 예상값으로 결과를 대신하지 않아요.",
   "misconception": "주머니 안 공기가 조건에 맞게 변할 시간을 두기 전에 결과를 적지 않았나요?",
   "criteria": "조건 정하기·기다리기·온도와 부피 기록·비교 설명의 순서로 배열해요.",
   "given": [
    "ㄹ. 각 상태의 온도와 부피를 함께 적는다.",
    "ㄴ. 두 온도에서 변화 방향을 비교해 설명한다.",
    "ㄱ. 같은 공기 양·바깥 압력·움직일 경계를 정한다.",
    "ㄷ. 정한 온도가 될 때까지 기다린다."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 비교 순서",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "type": "sequence",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄱ",
      "ㄷ",
      "ㄹ",
      "ㄴ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w063",
   "no": 63,
   "form": "written",
   "topic": "온도 비교의 한계",
   "prompt": "한 번 따뜻하게 했는데 주머니가 눈에 띄게 커지지 않았어요. 「따뜻해져도 부피는 달라지지 않는다」고 결론 내리기 전에 무엇을 확인할까요?",
   "answer": "실제 안의 온도가 달라질 만큼 기다렸는지, 경계가 움직일 수 있는지, 공기가 새지 않았는지, 바깥에서 누르는 조건이 같은지 확인한다. 한 번의 불분명한 관찰만으로 일반화하지 않는다.",
   "explanation": "눈에 띄는 변화가 없다는 기록은 남겨요. 안의 온도가 충분히 달라졌는지, 경계가 움직이는지, 누출이 없는지와 바깥에서 누르는 조건을 살펴요. 한 번의 불분명한 관찰로 모든 기체의 온도·부피 관계를 부정할 수는 없어요.",
   "misconception": "한 번 안 보인 변화와 어떤 조건에서도 변화가 없다는 결론을 같게 보지 않았나요?",
   "criteria": "관련 조건 둘 이상과 성급하게 일반화하지 않는 판단을 제시하면 인정해요.",
   "lines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 비교의 한계",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "관련 조건 둘 이상과 성급하게 일반화하지 않는 판단을 제시하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w064",
   "no": 64,
   "form": "draw",
   "topic": "온도 비교 그림",
   "prompt": "같은 공기의15 ℃와35 ℃ 상태를 나란히 그리세요. 움직일 수 있는 경계와 부피를 표시하고, 같게 둔 조건 두 가지를 아래에 쓰세요.",
   "answer": "15 ℃58 mL,35 ℃62 mL의 주머니 공간을 구별한다. 같은 공기 양과 바깥 압력을 표시하고 경계가 움직일 수 있음을 나타낸다.",
   "explanation": "모형의15 ℃58 mL와35 ℃62 mL를 두 상태의 주머니 공간으로 나타내요. 경계가 움직이며 공기 양과 바깥 압력은 같다는 조건을 표시해야 온도 비교가 돼요. 기체가 드나드는 그림이나 딱딱한 병이 같은 비율로 커지는 그림은 이 자료와 달라요.",
   "misconception": "두 상태의 온도·부피만 적고 공기 양·바깥 압력·경계의 조건을 빠뜨리지 않았나요?",
   "criteria": "각 온도/부피·움직일 경계·같은 공기 양과 바깥 압력을 나타내면 인정해요.",
   "drawing": "large",
   "given": [
    "모형 자료: 새지 않고 경계가 움직이는 주머니.15 ℃58 mL,35 ℃62 mL. 공기 양과 바깥 압력은 같아요."
   ],
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-02",
    "topic": "온도 비교 그림",
    "inquirySkill": "변인 통제와 관찰·추론"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "각 온도/부피·움직일 경계·같은 공기 양과 바깥 압력을 나타내면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w065",
   "no": 65,
   "form": "choice",
   "topic": "기체 자료 조사",
   "prompt": "두 기체가 모두 색이 없다는 자료로 할 수 있는 판단은?",
   "answer": "① 색만으로 두 기체를 구별하기 어렵다",
   "explanation": "산소와 질소가 모두 색이 없다는 자료는 색만으로 둘을 구별하기 어렵다는 판단을 뒷받침해요. 같은 겉모습이 같은 종류·같은 성질·같은 공기 속 비율을 뜻하지는 않아요. 성질과 쓰임은 다른 자료 단서도 읽어야 해요.",
   "misconception": "겉모습 하나의 공통점을 기체의 모든 성질이나 양의 같음으로 넓히지 않았나요?",
   "criteria": "색만으로 두 기체를 구별하기 어렵다는 보기를 고르면 인정해요.",
   "choices": [
    "색만으로 두 기체를 구별하기 어렵다",
    "색이 같으면 반드시 같은 기체이다",
    "두 기체를 어느 곳에나 서로 대신 쓴다",
    "투명한 기체는 모두 호흡용이다",
    "공기에서 두 기체의 양도 같다"
   ],
   "key": 0,
   "contextRef": "rsc-gases-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "기체 자료 조사",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     0
    ]
   }
  },
  {
   "id": "c22-s42-u03-w066",
   "no": 66,
   "form": "multi",
   "topic": "출처와 확인",
   "prompt": "기체의 쓰임을 조사할 때 알맞은 행동을 모두 고르세요.",
   "answer": "①, ②, ③, ④",
   "explanation": "발행 기관·제목을 확인한 뒤 관련 본문을 읽고 이용 상황·제한 조건을 살펴요. 다른 신뢰할 자료와 뜻을 대조하는 것도 타당해요. 제목만 같다고 본문과 조건을 읽지 않고 같은 이용으로 합치는 판단은 맞지 않아요.",
   "misconception": "출처의 이름을 확인하는 일과 실제 관련 내용을 검토하는 일을 구별했나요?",
   "criteria": "기관/제목·본문·상황/제한·다른 자료와 대조 네 항목을 고르면 인정해요.",
   "choices": [
    "자료의 발행 기관과 제목을 확인한다",
    "조사할 성질과 관련된 본문을 읽는다",
    "이용할 상황과 제한 조건을 살핀다",
    "다른 신뢰할 자료와 뜻을 대조한다",
    "제목만 같으면 본문 없이 같은 이용으로 정한다"
   ],
   "key": [
    0,
    1,
    2,
    3
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "출처와 확인",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      0,
      1,
      2,
      3
     ]
    ],
    "orderSensitive": false,
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w067",
   "no": 67,
   "form": "blank",
   "topic": "성질과 쓰임",
   "prompt": "산소는 다른 물질의 [ ]를 돕고, 질소는 쉽게 [ ]하지 않는 성질을 일부 포장에 이용해요.",
   "answer": "연소 / 반응",
   "explanation": "산소는 다른 물질의 연소를 돕는 역할이므로 첫 칸은 연소예요. 질소는 쉽게 반응하지 않는 성질을 일부 식품 포장에 쓰므로 둘째는 반응이에요. 산소가 스스로 타거나 질소가 모든 변질을 막는다는 뜻은 아니에요.",
   "misconception": "두 기체의 역할을 서로 바꾸거나 일부 사례를 모든 포장에 적용하지 않았나요?",
   "criteria": "연소/반응을 두 칸에 순서대로 쓰면 인정해요.",
   "responseContract": {
    "type": "ordered-parts",
    "accepted": [
     [
      "연소",
      "반응"
     ]
    ],
    "teacherRequired": false
   },
   "contextRef": "rsc-gases-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "성질과 쓰임",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   }
  },
  {
   "id": "c22-s42-u03-w068",
   "no": 68,
   "form": "short",
   "topic": "공기 성분 자료",
   "prompt": "자료에 적힌 두 기체 중 공기에 더 많이 들어 있는 기체의 이름을 쓰세요.",
   "answer": "질소",
   "explanation": "자료에서 공기의 부피 비율은 질소 약78%, 산소 약21%예요. 두 기체 중 비율이 더 큰 것은 질소예요. 더 많다는 말이 공기에 질소만 있다거나 산소가 필요 없다는 뜻은 아니에요.",
   "misconception": "가장 많은 성분을 유일한 성분으로 해석하지 않았나요?",
   "criteria": "자료의 두 비율을 비교해 질소라고 쓰면 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "질소"
    ],
    "teacherRequired": false
   },
   "contextRef": "rsc-gases-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "공기 성분 자료",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   }
  },
  {
   "id": "c22-s42-u03-w069",
   "no": 69,
   "form": "match",
   "topic": "조사와 실제 활동",
   "prompt": "문장을 자료의 종류와 연결하세요.",
   "answer": "(1) ㄴ (2) ㄷ (3) ㄱ",
   "explanation": "RSC 자료를 읽은 것은 기체 성분 자료 조사ㄴ이에요. 장치를 시험해 종이가 올라간 것을 본 것은 직접 관찰ㄷ, 같은 조건에서 연결부를 바꾸어 비교하겠다는 것은 조건 비교 계획ㄱ이에요. 알아낸 근거가 어디서 왔는지 구별해요.",
   "misconception": "자료를 읽어 안 내용과 직접 본 움직임, 앞으로 비교할 방법을 섞지 않았나요?",
   "criteria": "자료 조사ㄴ·관찰ㄷ·조건 비교 계획ㄱ을 순서대로 연결하면 인정해요.",
   "parts": [
    "(1) 왕립화학회 기체 자료를 읽고 정리했다.",
    "(2) 교사와 준비한 장치를 직접 시험해 종이가 올라가는 것을 보았다.",
    "(3) 같은 종이와 펌프 방법을 두고 연결부 한 곳만 바꾸어 비교하겠다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 조건 비교 계획  ㄴ. 기체 성분 자료 조사  ㄷ. 직접 관찰 기록"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "조사와 실제 활동",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄴ",
      "ㄷ",
      "ㄱ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w070",
   "no": 70,
   "form": "order",
   "topic": "조사와 설명 순서",
   "prompt": "친구에게 기체 자료를 설명하는 과정을 순서대로 쓰세요.",
   "answer": "ㄷ → ㄱ → ㄹ → ㄴ",
   "explanation": "먼저 알아볼 기체와 질문ㄷ을 정해요. 출처와 관련 본문을 확인·대조ㄱ한 뒤 성질과 쓰임을 내 말로 연결ㄹ하고, 친구의 이해와 질문을 들어 표현ㄴ을 고쳐요. 확인하지 않은 내용부터 발표의 근거로 만들지 않아요.",
   "misconception": "이름과 쓰임을 나열하는 대신 성질과 이용이 어떻게 이어지는지 설명했나요?",
   "criteria": "질문·자료 검토·근거 정리·설명 보완의 순서ㄷ→ㄱ→ㄹ→ㄴ을 인정해요.",
   "given": [
    "ㄹ. 확인한 성질과 쓰임을 내 말로 연결한다.",
    "ㄴ. 친구가 이해했는지 듣고 표현을 고친다.",
    "ㄷ. 알아볼 기체와 질문을 정한다.",
    "ㄱ. 발행 기관·관련 본문을 확인하고 대조한다."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "조사와 설명 순서",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   },
   "responseContract": {
    "type": "sequence",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄹ",
      "ㄴ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w071",
   "no": 71,
   "form": "written",
   "topic": "성질과 판단",
   "prompt": "「산소와 질소는 모두 투명하니 성질도 쓰임도 같다」는 말을 자료를 근거로 고쳐 쓰세요.",
   "answer": "두 기체는 색이 없다는 점은 같지만 산소는 호흡과 연소를 돕는 데, 질소는 반응이 잘 일어나지 않는 환경을 만드는 데 쓰이는 등 성질과 쓰임이 다르다.",
   "explanation": "공통점은 두 기체 모두 색이 없다는 것이에요. 산소의 호흡·연소를 돕는 역할과 질소의 낮은 반응성을 이용한 일부 포장 쓰임을 각각 연결하면 차이도 드러나요. 공통점 하나가 성질과 이용 전체의 같음을 증명하지는 않아요.",
   "misconception": "공통점만 적거나 기체의 성질과 다른 기체의 쓰임을 짝짓지 않았나요?",
   "criteria": "색의 공통점과 산소/질소 각각의 성질·쓰임 연결을 함께 설명하면 인정해요.",
   "lines": 3,
   "given": [
    "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "성질과 판단",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "색의 공통점과 산소/질소 각각의 성질·쓰임 연결을 함께 설명하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w072",
   "no": 72,
   "form": "draw",
   "topic": "조사 카드 만들기",
   "prompt": "산소·질소 자료 카드 두 칸을 그리세요. 공통점·각 성질과 쓰임·출처를 넣고, 자료 조사임을 표시하세요.",
   "answer": "두 칸에 산소/질소를 나누고 모두 색이 없다는 공통점, 각각의 쓰임과 RSC 자료 출처를 적는다. 자료 조사이며 실제 기체 시험 기록이 아니라고 표시한다.",
   "explanation": "두 칸에 산소와 질소를 나누고 색이 없다는 공통점을 써요. 각 성질을 해당 쓰임과 연결하고 RSC 자료의 출처를 표시해 어떤 근거인지 밝혀요. 기체를 서로 다른 색으로 칠해 종류를 가려냈다고 설명하지 않아요.",
   "misconception": "눈에 보이지 않는 기체를 임의 색깔로 구별한 결과처럼 그리지 않았나요?",
   "criteria": "두 이름·색의 공통점·각 성질/쓰임·출처와 자료 조사임이 드러나면 다른 카드 구성도 인정해요.",
   "drawing": "large",
   "given": [
    "RSC 자료 요약: 산소와 질소는 색이 없어요. 산소는 호흡·연소를 돕는 데, 질소는 쉽게 반응하지 않는 성질을 이용한 일부 식품 포장에 쓰여요."
   ],
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-03",
    "topic": "조사 카드 만들기",
    "inquirySkill": "자료 조사와 성질·쓰임 연결"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "두 이름·색의 공통점·각 성질/쓰임·출처와 자료 조사임이 드러나면 다른 카드 구성도 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w073",
   "no": 73,
   "form": "choice",
   "topic": "장치 비교 자료",
   "prompt": "연결부 한 곳 밀봉의 영향을 비교하기에 가장 알맞은 짝은?",
   "answer": "④ 가와 나",
   "explanation": "가·나는 같은 종이·주머니·시작 상태·펌프 방법과 성공 기준에서 연결부 한 곳만 달라요. 다는 종이 무게도 다르고 라는 시험 결과가 없어요. 밀봉의 영향을 비교하려면 가와 나를 짝지어야 해요.",
   "misconception": "좋은 결과 두 개만 고르거나 아직 시험하지 않은 라를 비교 결과에 넣지 않았나요?",
   "criteria": "같은 조건에서 밀봉 한 곳만 달라지는 가와 나를 고르면 인정해요.",
   "choices": [
    "가와 다",
    "나와 다",
    "다와 라",
    "가와 나",
    "가와 라"
   ],
   "key": 3,
   "contextRef": "device-trials-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 비교 자료",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   },
   "responseContract": {
    "type": "single-choice",
    "teacherRequired": false,
    "accepted": [
     3
    ]
   }
  },
  {
   "id": "c22-s42-u03-w074",
   "no": 74,
   "form": "multi",
   "topic": "장치 기록의 범위",
   "prompt": "제공 기록에서 확인할 수 있는 것을 모두 고르세요.",
   "answer": "①, ④, ⑤",
   "explanation": "나는5번 중5번 성공, 라의 관 교체는 미시험, 가·나는 같은 성공 기준이라는 점은 기록에서 읽을 수 있어요. 다는 종이 무게도 달라졌으므로 그 영향이 없다고 확정할 수 없고, 나의5회가 모든 조건의 성공을 보장하지도 않아요.",
   "misconception": "기록에 있는5회 결과와 시험하지 않은 조건의 결과를 구별했나요?",
   "criteria": "나5회 성공·라미시험·가/나같은 기준 세 항목을 모두 고르면 인정해요.",
   "choices": [
    "나의 기록은5회 모두 성공이다",
    "나의 장치는 모든 조건에서 반드시 성공한다",
    "다의 결과는 종이 무게와 무관하다고 확정된다",
    "라의 관 교체는 아직 시험하지 않았다",
    "가·나는 같은 성공 기준으로 비교했다"
   ],
   "key": [
    0,
    3,
    4
   ],
   "contextRef": "device-trials-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 기록의 범위",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   },
   "responseContract": {
    "type": "multiple-selection",
    "accepted": [
     [
      0,
      3,
      4
     ]
    ],
    "orderSensitive": false,
    "teacherRequired": false
   }
  },
  {
   "id": "c22-s42-u03-w075",
   "no": 75,
   "form": "blank",
   "topic": "계획과 실제",
   "prompt": "연결부 밀봉이 작동에 준 영향을 알아보려면, 고치겠다는 생각에서 그치지 않고 실제로 고쳐 같은 조건으로 다시 [ ]해야 해요.",
   "answer": "시험",
   "explanation": "연결부를 밀봉하겠다는 계획만으로 작동이 좋아졌는지는 알 수 없어요. 실제로 한 곳을 고친 뒤 같은 판·시작 상태·펌프 방법과 성공 기준으로 다시 시험해야 수정 전후 결과를 비교할 수 있어요.",
   "misconception": "고친 그림이나 생각만으로 실제 성능이 나아졌다고 확정하지 않았나요?",
   "criteria": "빈칸에는 시험·재시험·실험처럼 고친 뒤 실제로 확인하는 활동을 쓰면 인정해요.",
   "responseContract": {
    "type": "word",
    "accepted": [
     "시험",
     "재시험",
     "실험"
    ],
    "teacherRequired": false
   },
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "계획과 실제",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   }
  },
  {
   "id": "c22-s42-u03-w076",
   "no": 76,
   "form": "short",
   "topic": "장치 시험 기록",
   "prompt": "기록에서 가·나의 시험 횟수를 합하면 몇회인가요? 단위까지 쓰세요.",
   "answer": "10회",
   "explanation": "가의 시험은5회, 나의 시험도5회이므로 합은10회예요. 성공3+5=8회는 성공 횟수의 합이며 전체 시험 횟수와 달라요. 라는 미시험이므로 계획을 추가 시험으로 세지 않아요.",
   "misconception": "시험 횟수와 성공 횟수, 아직 하지 않은 시험을 섞어 더하지 않았나요?",
   "criteria": "5+5의 합10회를 단위와 함께 쓰면 인정해요.",
   "responseContract": {
    "type": "quantity",
    "accepted": [
     "10회"
    ],
    "teacherRequired": false,
    "value": 10,
    "unit": "회",
    "unitRequired": true
   },
   "contextRef": "device-trials-v1",
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 시험 기록",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   }
  },
  {
   "id": "c22-s42-u03-w077",
   "no": 77,
   "form": "match",
   "topic": "장치 비교의 조건과 결과",
   "prompt": "장치 비교 문장과 그 역할을 연결하세요.",
   "answer": "(1) ㄷ (2) ㄱ (3) ㄴ",
   "explanation": "같은 종이와 펌프 방법은 같게 둔 조건ㄷ이에요. 표시선에 못 미친 것은 실제로 관찰한 작동 결과ㄱ, 연결부 한 곳을 밀봉한 것은 바꾼 조건ㄴ이에요. 관찰할 결과를 미리 같게 둘 조건에 넣지 않아요.",
   "misconception": "재료/작동 조건과 시험 뒤 나온 결과를 같은 항목으로 분류하지 않았나요?",
   "criteria": "통제 조건ㄷ·작동 결과ㄱ·바꾼 조건ㄴ을 각 문장에 연결하면 인정해요.",
   "parts": [
    "(1) 같은 종이와 같은 펌프 방법으로 비교한다.",
    "(2) 시험에서 종이판이 표시선에 못 미쳤다.",
    "(3) 연결부 한 곳을 밀봉해 수정 전과 비교한다."
   ],
   "answerPerPart": true,
   "given": [
    "〈보기〉 ㄱ. 관찰한 작동 결과  ㄴ. 바꾼 조건  ㄷ. 같게 둔 조건"
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 비교의 조건과 결과",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   },
   "responseContract": {
    "type": "ordered-parts",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄷ",
      "ㄱ",
      "ㄴ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w078",
   "no": 78,
   "form": "order",
   "topic": "장치 개선 순서",
   "prompt": "장치를 만들고 개선하는 과정을 순서대로 쓰세요.",
   "answer": "ㄷ → ㄹ → ㅁ → ㄱ → ㄴ",
   "explanation": "공기 경로와 성공 기준을 설계ㄷ한 뒤 실제로 제작·시험ㄹ해요. 결과에서 부족한 원인의 단서ㅁ를 찾고 연결부 한 곳ㄱ을 고친 뒤 같은 기준으로 재시험ㄴ하므로ㄷ→ㄹ→ㅁ→ㄱ→ㄴ이에요.",
   "misconception": "실패 단서를 보기 전에 여러 부분을 바꾸거나 고친 뒤 재시험을 생략하지 않았나요?",
   "criteria": "설계·첫 시험·원인 점검·한 곳 수정·같은 기준 재시험을 순서대로 배열해요.",
   "given": [
    "ㄱ. 연결부 한 곳을 고친다.",
    "ㄴ. 같은 기준으로 실제 재시험한다.",
    "ㄷ. 공기 경로와 성공 기준을 설계한다.",
    "ㄹ. 실제 장치를 만들어 시험한다.",
    "ㅁ. 기준에 못 미친 까닭을 기록에서 찾는다."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 개선 순서",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   },
   "responseContract": {
    "type": "sequence",
    "teacherRequired": false,
    "accepted": [
     [
      "ㄷ",
      "ㄹ",
      "ㅁ",
      "ㄱ",
      "ㄴ"
     ]
    ]
   }
  },
  {
   "id": "c22-s42-u03-w079",
   "no": 79,
   "form": "written",
   "topic": "장치 결론의 한계",
   "prompt": "나에서5회 모두 성공했으니 「어떤 종이와 펌프를 써도 항상 성공한다」고 발표해도 될까요? 제공 기록을 근거로 설명하세요.",
   "answer": "그렇게 일반화할 수 없다. 나는 같은 가벼운 종이와 펌프 방법에서5회 성공한 기록이다. 다른 무게의 종이를 쓴 다에서는5회 중2회 성공했으므로 조건을 밝히고 다른 조건은 따로 시험해야 한다.",
   "explanation": "나의5회 성공은 같은 가벼운 종이와 펌프 방법이라는 범위의 결과예요. 다는 더 무거운 종이에서2/5회였으므로 종이 조건이 다른 결과도 함께 읽어야 해요. 모든 종이·펌프에 일반화하지 말고 조건을 맞춘 추가 시험으로 확인해요.",
   "misconception": "나5/5를 항상 성공으로 바꾸거나 다의 종이 무게 차이를 무시하지 않았나요?",
   "criteria": "나의 조건/5회 범위·다의 다른 종이와2/5·모든 조건으로 일반화하지 않음을 연결하면 인정해요.",
   "lines": 3,
   "given": [
    "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
   ],
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 결론의 한계",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "나의 조건/5회 범위·다의 다른 종이와2/5·모든 조건으로 일반화하지 않음을 연결하면 인정해요."
    ]
   }
  },
  {
   "id": "c22-s42-u03-w080",
   "no": 80,
   "form": "draw",
   "topic": "장치 설명 그림",
   "prompt": "제공 기록을 소개하는 한 장을 설계하세요. 공기 이동과 종이판 움직임을 서로 다른 화살표로 그리고, 같은 조건의 가·나 결과와 미시험인 라를 나누어 표시하세요.",
   "answer": "공기 이동 펌프→관→주머니와 주머니가 종이판을 미는 방향을 다른 화살표로 표시한다. 가3/5·나5/5와 같게 둔 조건을 나란히 적는다. 라의 관 교체는 미시험 계획이며 제공된 자료의 비교라고 밝힌다.",
   "explanation": "공기 이동은 펌프→관→주머니까지, 종이판 움직임은 주머니가 미는 방향으로 따로 나타내요. 가3/5와 나5/5는 같게 둔 조건과 함께 비교하고 라의 관 교체는 미시험으로 표시해요. 구조와 자료의 범위를 함께 설명하는 그림이에요.",
   "misconception": "주머니에서 종이판 안으로 공기가 흐르는 화살표를 그리거나 라의 결과를 만들어 넣지 않았나요?",
   "criteria": "두 화살표의 뜻·같은 조건의 가/나 결과·라의 미시험과 제공 자료임이 드러나면 인정해요.",
   "drawing": "large",
   "given": [
    "가상 자료: 가는 수정 전3/5회 성공, 나는 연결부 한 곳만 밀봉 뒤5/5회 성공. 종이·주머니·시작 상태·펌프 방법·성공 기준은 같아요. 라의 관 교체는 아직 계획이에요."
   ],
   "drawingExplanationLines": 3,
   "status": "authored",
   "sourceRef": {
    "type": "independently-authored-workbook",
    "edition": "GFIELD 기체 교재 보강",
    "course": "초등4-2"
   },
   "taxonomy": {
    "standard": "4과15-04",
    "topic": "장치 설명 그림",
    "inquirySkill": "공기 장치 설계와 개선 근거"
   },
   "responseContract": {
    "teacherRequired": true,
    "requiredElements": [
     "두 화살표의 뜻·같은 조건의 가/나 결과·라의 미시험과 제공 자료임이 드러나면 인정해요."
    ]
   }
  }
 ],
 "pages": [
  {
   "section": "단원 열기",
   "title": "보이지 않는 공기를 어떻게 알아볼까?",
   "blocks": [
    {
     "type": "diagram",
     "key": "syringe",
     "caption": ""
    },
    {
     "type": "text",
     "text": "마개가 닫힌 바늘 없는 주사기를 떠올려요. 피스톤을 밀면 안의 공기는 어떻게 될까요? 먼저 예상하고, 비교할 조건을 정한 뒤 근거로 설명해요."
    },
    {
     "type": "heading",
     "text": "이 단원에서 할 일"
    },
    {
     "type": "list",
     "items": [
      "공기의 무게를 알아볼 비교 자료 읽기",
      "압력과 온도를 각각 바꾸어 부피 비교하기",
      "여러 기체의 성질과 쓰임 연결하기",
      "공기 장치를 설계하고 실제 시험 계획 세우기"
     ],
     "ordered": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 양과 부피를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "2022 개정 · 4학년 2학기 Ⅲ",
   "kind": "learn"
  },
  {
   "section": "배움 지도",
   "title": "보이지 않는 공기에도 근거가 있어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배울 것",
      "읽을 근거",
      "설명할 것"
     ],
     "rows": [
      [
       "공기의 무게",
       "같은 바깥 부피 용기의 전후 저울 표시",
       "공기만 더하거나 뺐는지"
      ],
      [
       "압력과 부피",
       "밀폐한 주사기에서 달라진 공간",
       "공기의 양과 차지하는 공간의 차이"
      ],
      [
       "온도와 부피",
       "경계가 움직이는 장치의 조건별 기록",
       "다른 조건이 같은지"
      ],
      [
       "기체의 쓰임·장치",
       "출처가 있는 조사 자료·시험 기록",
       "성질과 쓰임·수정의 근거"
      ]
     ]
    },
    {
     "type": "text",
     "text": "사진은 재료 모양을 살피는 설명 자료예요. 사진의 크기나 눈금으로 부피를 재지 않아요. 따로 제시한 수치는 가상 학습 자료이며, 실제로 수행한 결과와 구별해요."
    },
    {
     "type": "field",
     "title": "지금 궁금한 것",
     "hint": "공기의 무게·부피·쓰임 중 하나를 골라 무엇을 비교하면 좋을지 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같게 둘 것과 바꿀 것을 정한 뒤, 관찰할 결과를 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 공기라도 차지하는 공간이 달라질 수 있어요. 공기의 양과 부피를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "무게 비교의 설계",
   "title": "마개까지 같아야 공기만 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "아래는 같은 저울로 공기를 더 넣기 전후를 비교하는 가상 계획이에요. 바깥 부피가 유지되는 용기를 쓰고, 저울이 안정된 뒤 같은 방법으로 읽기로 했어요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "용기",
      "마개",
      "바깥 부피",
      "다른 변화"
     ],
     "rows": [
      [
       "가",
       "같음",
       "같음",
       "같음",
       "다른 물질 출입 없음"
      ],
      [
       "나",
       "같음",
       "다름",
       "같음",
       "다른 물질 출입 없음"
      ],
      [
       "다",
       "같음",
       "같음",
       "같음",
       "물방울도 넣음"
      ]
     ]
    },
    {
     "type": "example",
     "question": "어느 계획이 공기를 더 넣은 영향만 알아보기에 알맞을까요?",
     "steps": [
      [
       "바꾼 것 찾기",
       "공기를 더 넣었는지 여부만 달라야 해요."
      ],
      [
       "섞인 변화 찾기",
       "나는 마개, 다는 물방울의 무게도 함께 달라져요. 가는 그런 변화를 줄였어요."
      ],
      [
       "결과와 구별",
       "마지막 저울 표시는 미리 같게 만들 조건이 아니라 비교한 뒤 읽을 결과예요."
      ]
     ],
     "answer": "이 세 계획에서는 가예요. 실제로 공기가 새지 않았는지도 확인해요."
    },
    {
     "type": "field",
     "title": "계획 고치기",
     "hint": "나 또는 다를 골라 공기만 비교하도록 고칠 점을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 용기·마개·바깥 부피·저울과 읽는 방법을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "공기를 넣을 때 사용한 펌프를 저울 위에 함께 올려 전후 무게를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "측정의 한계",
   "title": "같은 표시가 곧 변화 없음일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "0.1 g 간격으로 표시하는 저울을 쓴 가상 기록이에요. 같은 바깥 부피의 용기에 공기만 조금 더 넣었지만, 전후 표시가 모두 80.0 g이었어요."
    },
    {
     "type": "table",
     "heads": [
      "읽은 것",
      "이 기록으로 확인되는 것",
      "더 확인할 것"
     ],
     "rows": [
      [
       "전 80.0 g / 후 80.0 g",
       "이 저울의 표시 차이가 보이지 않음",
       "기구가 작은 차이를 구분하는지"
      ],
      [
       "공기를 더 넣었다는 계획",
       "실제로 넣으려 한 방법",
       "연결부 누출·실제 수행 여부"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“표시가 같으니 공기의 무게는 0이다”라고 결론 내려도 될까요?",
     "steps": [
      [
       "관찰 읽기",
       "확인한 것은 두 번의 표시가 같았다는 점이에요."
      ],
      [
       "한계 찾기",
       "이 저울이 구분하기 어려운 작은 차이나 누출 가능성을 아직 확인하지 않았어요."
      ],
      [
       "결론 다듬기",
       "이 기록에서는 무게 차이를 확인하지 못했다고 적고, 기구와 비교 방법을 점검해요."
      ]
     ],
     "answer": "표시가 같다는 기록만으로 공기의 무게가 없다고 정할 수 없어요."
    },
    {
     "type": "field",
     "title": "다음 확인",
     "hint": "눈금·누출·읽는 때 중 하나를 골라 무엇을 확인할지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이지 않는 차이와 차이가 없다는 결론을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "예상에 맞추려고 표시를 바꾸어 적지 않아요. 실제로 읽은 값과 확인하지 못한 점을 함께 남겨요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념과 예제",
   "title": "공기만 달라진 비교를 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "공기의 무게를 확인하려면 같은 용기·마개·바깥 부피와 저울을 사용해요. 공기 이외의 물질이 들어오거나 나가면 그 영향도 섞여요."
    },
    {
     "type": "table",
     "heads": [
      "같게 할 것",
      "확인할 까닭"
     ],
     "rows": [
      [
       "용기·마개·바깥 부피",
       "용기나 바깥 크기가 달라진 영향을 줄여요."
      ],
      [
       "저울과 읽는 방법",
       "서로 다른 측정 기준이 섞이지 않게 해요."
      ],
      [
       "다른 물질의 출입",
       "물방울·추 등이 무게를 바꾸지 않게 해요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상 저울 자료: 공기만 더 넣기 전50.1 g, 넣은 후50.3 g이에요. 무엇을 근거로 설명할까요?",
     "steps": [
      [
       "조건",
       "같은 용기·마개·바깥 부피와 저울인지 확인해요."
      ],
      [
       "관찰",
       "뒤의 표시가0.2 g 더 커졌어요."
      ],
      [
       "해석",
       "다른 물질의 출입이 없다면 공기도 무게가 있다는 근거예요."
      ]
     ],
     "answer": "0.2 g은 이 비교의 차이이며 모든 공기의 무게가 아니에요."
    },
    {
     "type": "field",
     "title": "차이의 뜻",
     "hint": "이 예의 0.2 g으로 말할 수 있는 것과 말할 수 없는 것을 한 가지씩 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전후 차이와 공기 전체의 무게는 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "공기의 양과 부피",
   "title": "끝이 열린 주사기도 같은 비교일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "바늘 없는 주사기의 피스톤을 천천히 누르는 두 상황이에요. 같은 시작 눈금·같은 온도에서 시작한다고 정했어요. 손으로 무리하게 누르는 활동은 하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "끝부분의 조건",
      "함께 살필 것"
     ],
     "rows": [
      [
       "가",
       "막고, 연결부로 새지 않음",
       "공기를 가둔 채 차지하는 공간이 줄어드는지"
      ],
      [
       "나",
       "열려 있어 공기가 밖으로 나갈 수 있음",
       "공기가 빠져나가 안의 양도 달라지는지"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가와 나 모두 피스톤이 들어갔어요. “안의 공기 양이 같다”고 해도 될까요?",
     "steps": [
      [
       "공간 읽기",
       "피스톤 위치는 안의 공간이 달라졌다는 단서예요."
      ],
      [
       "출입 확인",
       "가는 새지 않는다는 조건이 있지만, 나는 공기가 나갈 수 있어요."
      ],
      [
       "설명 나누기",
       "가에서는 같은 공기가 더 작은 공간을 차지해요. 나까지 같은 양이라고 정할 수는 없어요."
      ]
     ],
     "answer": "피스톤 위치와 공기 양은 다른 정보예요. 끝과 연결부의 조건을 함께 읽어요."
    },
    {
     "type": "field",
     "title": "한 문장 설명",
     "hint": "“공간이 줄었으니 공기가 사라졌다”를 가의 조건에 맞게 고쳐 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "밀폐되어 새지 않을 때 공기 양과 부피를 나누어 생각해요."
    },
    {
     "title": "더 알아보기",
     "text": "눈금은 차지하는 공간을 읽는 기준이에요. 공기 양을 직접 센 숫자는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "압력 비교의 근거",
   "title": "누르는 압력 하나만 바꾸어요",
   "blocks": [
    {
     "type": "text",
     "text": "같은 기구로 누르는 압력에 따른 공기 부피를 비교할 계획이에요. 세 계획 모두 결과로 부피를 읽기로 했어요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "공기 양",
      "온도",
      "누르는 압력"
     ],
     "rows": [
      [
       "가",
       "같음",
       "같음",
       "다름"
      ],
      [
       "나",
       "다름",
       "같음",
       "다름"
      ],
      [
       "다",
       "같음",
       "다름",
       "다름"
      ]
     ]
    },
    {
     "type": "example",
     "question": "부피 차이를 압력 변화와 연결하기에 가장 알맞은 계획은?",
     "steps": [
      [
       "질문 확인",
       "알아볼 것은 누르는 압력을 달리했을 때의 부피예요."
      ],
      [
       "조건 비교",
       "가만 공기 양과 온도를 같게 두어요. 나는 양, 다는 온도까지 달라져요."
      ],
      [
       "결과 읽기",
       "같은 공기 양·온도에서 압력이 커질 때 부피가 줄어드는 방향을 관찰해요."
      ]
     ],
     "answer": "이 세 계획에서는 가예요. 결과 부피를 미리 같은 값으로 맞추지는 않아요."
    },
    {
     "type": "field",
     "title": "다른 계획의 한계",
     "hint": "나 또는 다에서 부피가 달라져도 압력 때문이라고만 말하기 어려운 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "압력은 바꿀 것, 부피는 관찰할 것, 공기 양·온도는 같게 둘 것이에요."
    },
    {
     "title": "더 알아보기",
     "text": "누르기 어렵거나 연결부가 불안하면 멈추고 선생님에게 알려요. 큰 힘으로 끝까지 밀지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "온도 비교의 근거",
   "title": "따뜻해진 뒤 원래 조건으로 돌아가요",
   "blocks": [
    {
     "type": "text",
     "text": "공기가 새지 않고 경계가 가볍게 움직이며 바깥 압력이 거의 같은 장치를 가정한 가상 기록이에요. 각 조건에서 충분히 기다린 뒤 읽었다고 정했어요. 실제 측정값은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "공기 온도(℃)",
      "부피(mL)"
     ],
     "rows": [
      [
       "1",
       "20",
       "40"
      ],
      [
       "2",
       "35",
       "42"
      ],
      [
       "3",
       "20",
       "40"
      ]
     ]
    },
    {
     "type": "example",
     "question": "두 번째와 세 번째 기록은 무엇을 설명하는 근거가 될까요?",
     "steps": [
      [
       "변화 읽기",
       "35 ℃에서 42 mL였다가 20 ℃로 돌아오자 40 mL가 되었어요."
      ],
      [
       "조건 확인",
       "공기 양·바깥 압력이 같고 경계가 움직인다는 조건에서 읽은 기록이에요."
      ],
      [
       "범위 정하기",
       "이 조건에서는 온도를 낮췄을 때 부피가 작아졌다고 설명해요. 모든 기구의 값이 같다는 뜻은 아니에요."
      ]
     ],
     "answer": "온도를 높일 때와 낮출 때를 나누어 보고, 처음과 같은 조건의 기록도 대조해요."
    },
    {
     "type": "field",
     "title": "기구가 다르다면",
     "hint": "딱딱한 병의 바깥 크기만 재면 이 기록과 곧바로 비교하기 어려운 까닭을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기 양·바깥 압력·움직일 경계와 기다린 때를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "뜨거운 물이나 불로 직접 데우지 않아요. 교사가 정한 안전한 물과 기구로만 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "다른 기록을 만났을 때",
   "title": "예상과 달라도 기록부터 남겨요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "관찰 기록",
      "바로 단정하지 않기",
      "확인할 것"
     ],
     "rows": [
      [
       "같은 시작 온도로 돌아왔지만 눈금이 달랐음",
       "기체의 성질이 사라졌다고 말하지 않음",
       "공기 누출·경계 걸림·기다린 때"
      ],
      [
       "같은 조건에서 두 번 값이 조금 달랐음",
       "한 번을 지우고 같은 값으로 만들지 않음",
       "눈높이·읽는 눈금·조건의 차이"
      ],
      [
       "온도는 적었지만 부피 칸이 비어 있음",
       "부피를 0 mL로 채우지 않음",
       "실제로 읽었는지·기록을 빠뜨렸는지"
      ]
     ]
    },
    {
     "type": "example",
     "question": "친구가 “첫 값으로 돌아와야 하니까 마지막 값을 고치자”고 했어요. 어떻게 할까요?",
     "steps": [
      [
       "사실 보존",
       "실제로 읽은 값과 읽은 때를 그대로 남겨요."
      ],
      [
       "원인 점검",
       "새는 곳이나 경계 걸림 등 조건이 유지되었는지 확인해요."
      ],
      [
       "다시 비교",
       "방법을 점검한 뒤 다시 시행하고 새 기록을 따로 남겨요. 예상에 맞춰 앞 기록을 바꾸지 않아요."
      ]
     ],
     "answer": "관찰·가능한 까닭·다음 확인을 나누어 적어요."
    },
    {
     "type": "field",
     "title": "기록을 덧붙여요",
     "hint": "“값이 달랐다” 뒤에 확인할 조건과 재시험 방법을 한 가지씩 이어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상은 관찰값을 고르는 기준이 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "한 번 더 했다는 사실만으로 믿을 만해지는 것은 아니에요. 비교 조건과 읽는 방법도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실험 설계",
   "title": "두 비교를 섞지 않기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "비교",
      "바꿀 것",
      "같게 둘 것",
      "관찰할 것"
     ],
     "rows": [
      [
       "압력",
       "누르는 압력",
       "공기 양·온도",
       "부피"
      ],
      [
       "온도",
       "공기 온도",
       "공기 양·바깥 압력·움직일 경계",
       "부피"
      ]
     ]
    },
    {
     "type": "text",
     "text": "수업 3D 실험실에서 조건별로 관찰하고 값을 읽어요. 아래 값은 모형 값이며 실제 실험의 측정값이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "상대 압력",
      "부피(mL)"
     ],
     "rows": [
      [
       "1",
       "60"
      ],
      [
       "2",
       "30"
      ],
      [
       "3",
       "20"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "온도(℃)",
      "부피(mL)"
     ],
     "rows": [
      [
       "10",
       "58"
      ],
      [
       "20",
       "60"
      ],
      [
       "30",
       "62"
      ]
     ]
    },
    {
     "type": "field",
     "title": "두 비교를 나누어요",
     "hint": "압력 비교와 온도 비교에서 같게 둘 조건이 다른 점을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "압력 비교에서는 온도, 온도 비교에서는 바깥 압력과 움직일 경계를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기체 자료 읽기",
   "title": "색이 없다고 같은 기체일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "산소와 질소는 모두 색이 없는 기체지만, 이것만으로 성질과 쓰임이 같다고 정하지 않아요. 아래는 왕립화학회 자료에서 읽을 수 있는 내용을 간추린 조사 예예요."
    },
    {
     "type": "table",
     "heads": [
      "기체",
      "자료에서 확인할 성질·역할",
      "이어지는 쓰임"
     ],
     "rows": [
      [
       "산소",
       "호흡에 필요함",
       "호흡과 관련된 이용"
      ],
      [
       "질소",
       "쉽게 반응하지 않는 환경을 만드는 데 이용",
       "일부 식품 포장 등에 이용"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“둘 다 색이 없으니 식품 포장에 언제나 바꾸어 써도 된다”는 말이 맞나요?",
     "steps": [
      [
       "같은 점",
       "보이는 색이 없다는 공통점은 있어요."
      ],
      [
       "빠진 조건",
       "반응하는 성질과 이용 목적까지 같다는 자료는 없어요."
      ],
      [
       "근거 연결",
       "각 기체의 성질과 이용 상황을 별도로 조사하고, 일부 사례를 모든 경우로 넓히지 않아요."
      ]
     ],
     "answer": "겉모습 하나로 종류·성질·쓰임을 모두 정하지 않아요."
    },
    {
     "type": "field",
     "title": "조사 카드 만들기",
     "hint": "기체 하나를 골라 기관·자료 제목·확인한 성질·그 성질과 관련된 쓰임을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종류 → 성질 → 쓰임 → 출처 순서로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "기체를 알아내려고 직접 냄새 맡거나 불을 붙이지 않아요. 공개된 자료를 조사해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념과 조사",
   "title": "같아 보이는 기체도 쓰임이 달라요",
   "blocks": [
    {
     "type": "text",
     "text": "색이 없다는 공통점만으로 기체 종류나 모든 성질을 정할 수는 없어요. 믿을 만한 자료에서 종류·성질·이용 상황을 함께 확인해요."
    },
    {
     "type": "table",
     "heads": [
      "기체",
      "성질과 대표적 이용",
      "과장하지 않기"
     ],
     "rows": [
      [
       "산소",
       "호흡에 필요하고 다른 물질의 연소를 도움",
       "스스로 타는 연료라는 뜻은 아니에요."
      ],
      [
       "질소",
       "쉽게 반응하지 않는 성질을 이용한 일부 식품 포장",
       "모든 변질을 무조건 막는 것은 아니에요."
      ],
      [
       "이산화 탄소",
       "탄산음료와CO₂식 소화기 등에 이용",
       "모든 불·모든 소화기를 하나로 묶지 않아요."
      ]
     ]
    },
    {
     "type": "field",
     "title": "자료 조사에서 남길 것",
     "hint": "발행 기관·자료 제목·확인한 성질과 쓰임을 짧게 적어요. 직접 기체를 시험한 기록과 구별해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 출처와 적용 조건을 같이 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념과 장치",
   "title": "공기가 움직이는 길을 설계해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "pumpTube"
    },
    {
     "type": "text",
     "text": "손 펌프·관에 얇은 주머니와 가벼운 종이판을 더해 장치를 설계해요. 사진은 두 재료의 모양 참고이며 완성된 연결 구조나 실제 작동 결과가 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "맡을 역할"
     ],
     "rows": [
      [
       "손 펌프",
       "공기를 보냄"
      ],
      [
       "관",
       "공기가 이동하는 길"
      ],
      [
       "얇은 주머니",
       "공기가 들어와 공간이 커짐"
      ],
      [
       "가벼운 종이판",
       "주머니에 밀려 움직임"
      ]
     ]
    },
    {
     "type": "field",
     "title": "만들기 전에 정하기",
     "hint": "교사와 안전한 재료·고정 방법·성공 기준·멈춤 기준을 정해요. 입으로 불거나 무리한 힘을 쓰지 않아요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설계·실제 제작·시험·수정·재시험을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "장치 개선의 증거",
   "title": "한 곳을 고친 뒤 같은 기준으로 시험해요",
   "blocks": [
    {
     "type": "text",
     "text": "손 펌프·관·주머니가 종이판을 밀어 올리는 장치를 실제로 시험했다고 가정한 연습용 기록이에요. 실제 제작을 대신하는 결과가 아니에요. 높이는 같은 자와 기준점으로 읽었다고 정했어요."
    },
    {
     "type": "table",
     "heads": [
      "시험",
      "바꾼 것",
      "같게 둔 것",
      "올라간 높이(cm)"
     ],
     "rows": [
      [
       "처음",
       "수정 전",
       "주머니·종이판·시작 상태·펌프 방법",
       "1"
      ],
      [
       "다시",
       "연결부 한 곳을 밀봉",
       "주머니·종이판·시작 상태·펌프 방법",
       "3"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“연결부를 고친 뒤 더 잘 움직였다”를 어떤 근거로 말할까요?",
     "steps": [
      [
       "수정 확인",
       "연결부 한 곳을 밀봉했고 다른 조건은 같게 두었다는 기록을 읽어요."
      ],
      [
       "결과 비교",
       "같은 기준에서 올라간 높이가 1 cm에서 3 cm로 커졌어요."
      ],
      [
       "한계 확인",
       "이 조건의 두 시험에서는 움직임이 커졌어요. 항상 3 cm가 되거나 다른 문제까지 해결됐다는 뜻은 아니에요."
      ]
     ],
     "answer": "수정한 부분과 전후 결과를 연결하고, 같은 조건으로 다시 확인해요."
    },
    {
     "type": "field",
     "title": "나의 개선 계획",
     "hint": "관이 눌린 장치를 떠올려 한 곳만 고칠 방법·같게 둘 조건 두 가지·성공과 멈춤 기준을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설계 → 제작 → 시험 → 근거로 수정 → 같은 기준의 재시험을 이어 가요."
    },
    {
     "title": "더 알아보기",
     "text": "그림이나 재료 사진만으로 작동에 성공했다고 기록하지 않아요. 아직 하지 않았으면 계획이라고 적어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본·적용 1~3",
   "title": "같은 부피 용기와 공기의 무게",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w001",
      "c22-s42-u03-w002",
      "c22-s42-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 4~6",
   "title": "공기 무게의 근거와 적용",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w004",
      "c22-s42-u03-w005",
      "c22-s42-u03-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 7~9",
   "title": "생활 속 온도·압력 변화 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w007",
      "c22-s42-u03-w008",
      "c22-s42-u03-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 10~12",
   "title": "이산화 탄소의 성질과 이용",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w010",
      "c22-s42-u03-w011",
      "c22-s42-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 13~15",
   "title": "공기로 작동하는 장치 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w013",
      "c22-s42-u03-w014",
      "c22-s42-u03-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 16~18",
   "title": "장치 소개와 근거·의견 반영",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w016",
      "c22-s42-u03-w017",
      "c22-s42-u03-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 19~20",
   "title": "압력과 부피의 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w019",
      "c22-s42-u03-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "개념 정리",
   "title": "공기의 성질을 말로 채우기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w021",
      "c22-s42-u03-w022",
      "c22-s42-u03-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈칸을 채운 뒤 같은 조건을 한 가지 더 말해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념 정리",
   "title": "성질과 공정한 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w024",
      "c22-s42-u03-w025"
     ]
    },
    {
     "type": "text",
     "text": "산소·질소·이산화 탄소의 대표적 쓰임을 다시 찾아보고, 모든 상황에 적용되지 않는 까닭도 생각해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기체의 성질을 실제 쓰임과 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "조건 고르기",
   "title": "압력과 온도를 나누어 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w026",
      "c22-s42-u03-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 조건과 같게 둘 조건을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료·개선",
   "title": "근거를 골라 설명하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w028",
      "c22-s42-u03-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 숫자와 실제 수행 여부를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연결하기",
   "title": "조건과 기체의 쓰임",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w030",
      "c22-s42-u03-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기호가 무엇을 뜻하는지 보기와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료·순서",
   "title": "모형 자료와 실험 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w032",
      "c22-s42-u03-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 값의 단위와 비교 조건을 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "순서·설명",
   "title": "고친 말에 근거 담기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w034",
      "c22-s42-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기가 사라진 것과 공간이 줄어든 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "서술형",
   "title": "관찰만으로 말할 수 있을까?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w036",
      "c22-s42-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이지 않은 조건을 지어내지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "모형과 실제",
   "title": "실제 측정과 설계를 구별하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화면 체험과 실제 실험은 각각의 근거를 남겨요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "설계하기",
   "title": "공기로 움직이는 인형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화살표로 공기의 경로를 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "개선하기",
   "title": "한 곳을 고쳐 같은 기준으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고칠 부분 하나, 같게 둘 조건 두 가지를 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ①",
   "title": "공기만 달라진 비교인가요?",
   "blocks": [
    {
     "type": "text",
     "text": "같은 단단한 용기·마개·바깥 부피와 같은 저울을 쓰고, 다른 물질의 출입 없이 공기만 더 넣었다고 가정한 가상 기록이에요."
    },
    {
     "type": "table",
     "heads": [
      "반복",
      "넣기 전(g)",
      "넣은 후(g)"
     ],
     "rows": [
      [
       "1",
       "120.2",
       "120.6"
      ],
      [
       "2",
       "120.2",
       "120.6"
      ],
      [
       "3",
       "120.3",
       "120.7"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w041",
      "c22-s42-u03-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 용기·마개·바깥 부피로 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "mass-trials-v1",
    "text": "연습용 가상 자료예요. 같은 단단한 용기·마개·바깥 부피와 같은 저울을 사용했어요. 교사가 공기만 더 넣어 준비했고 다른 물질의 출입은 없어요. 같은 조건으로 되돌려 세 번 비교했어요. 넣기 전→후: 1회120.2→120.6 g, 2회120.2→120.6 g, 3회120.3→120.7 g. 실제 내 실험 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ①",
   "title": "표시값과 결론을 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 자료예요. 같은 단단한 용기·마개·바깥 부피와 같은 저울을 사용했어요. 교사가 공기만 더 넣어 준비했고 다른 물질의 출입은 없어요. 같은 조건으로 되돌려 세 번 비교했어요. 넣기 전→후: 1회120.2→120.6 g, 2회120.2→120.6 g, 3회120.3→120.7 g. 실제 내 실험 결과가 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w043",
      "c22-s42-u03-w044",
      "c22-s42-u03-w045",
      "c22-s42-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관찰값·해석·추가 확인을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "mass-trials-v1",
    "text": "연습용 가상 자료예요. 같은 단단한 용기·마개·바깥 부피와 같은 저울을 사용했어요. 교사가 공기만 더 넣어 준비했고 다른 물질의 출입은 없어요. 같은 조건으로 되돌려 세 번 비교했어요. 넣기 전→후: 1회120.2→120.6 g, 2회120.2→120.6 g, 3회120.3→120.7 g. 실제 내 실험 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ① · 다시 생각",
   "title": "변화가 보이지 않으면 무엇을 확인할까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w047"
     ]
    },
    {
     "type": "field",
     "title": "교사의 비교 자료 읽기",
     "hint": "같은 조건인지 살펴본 자료와 아직 분명하지 않은 점을 짧게 적어요. 직접 측정하지 않았다면 자료 확인이라고 표시해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "결과가 불분명하면 성공한 값으로 바꿔 적지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ① · 그림",
   "title": "공기의 무게 비교를 설계해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획은 실제 측정 기록과 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ②",
   "title": "열린 주사기와 닫힌 주사기",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w049",
      "c22-s42-u03-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "끝이 열렸는지 닫혔는지부터 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "closed-open-v1",
    "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
   }
  },
  {
   "section": "생각 넓히기 ②",
   "title": "부피 감소의 설명도 같을까요?",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w051",
      "c22-s42-u03-w052",
      "c22-s42-u03-w053",
      "c22-s42-u03-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 양의 공기인지 확인하고 자료를 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "closed-open-v1",
    "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
   }
  },
  {
   "section": "생각 넓히기 ② · 해 보기",
   "title": "두 설명의 차이를 말해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w055"
     ]
    },
    {
     "type": "field",
     "title": "교사와 관찰한 사실",
     "hint": "바늘 없는 기구로 교사와 살펴본 변화만 적어요. 아직 하지 않았다면 예상으로 남겨요. 막힌 기구를 무리하게 누르지 않아요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "누르기 어려우면 멈추고 교사에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ② · 그림",
   "title": "같은 공기가 차지하는 공간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기 입자 그림이나 공식을 쓰지 않아도 돼요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ③",
   "title": "따뜻하게·차게 바꾼 자료",
   "blocks": [
    {
     "type": "text",
     "text": "같은 공기 양·바깥 압력, 새지 않고 가볍게 움직이는 주머니의 연습용 모형 자료예요. 각 온도에서 충분히 기다렸어요."
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "온도(℃)",
      "부피(mL)"
     ],
     "rows": [
      [
       "1",
       "15",
       "58"
      ],
      [
       "2",
       "25",
       "60"
      ],
      [
       "3",
       "35",
       "62"
      ],
      [
       "4",
       "15",
       "58"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w057",
      "c22-s42-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "따뜻해질 때와 차가워질 때를 함께 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "warming-cooling-v1",
    "text": "연습용 모형 자료예요. 같은 양의 공기를 얇은 주머니에 가두고, 바깥 압력을 같게 했어요. 주머니 경계는 가볍게 움직일 수 있고 공기가 새지 않아요. 각 온도에서 충분히 기다린 뒤 읽었어요. 15 ℃58 mL→25 ℃60 mL→35 ℃62 mL→다시15 ℃58 mL예요. 다른 온도의 정확한 값을 계산하는 공식은 배우지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "움직일 수 있는 경계인가요?",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 모형 자료예요. 같은 양의 공기를 얇은 주머니에 가두고, 바깥 압력을 같게 했어요. 주머니 경계는 가볍게 움직일 수 있고 공기가 새지 않아요. 각 온도에서 충분히 기다린 뒤 읽었어요. 15 ℃58 mL→25 ℃60 mL→35 ℃62 mL→다시15 ℃58 mL예요. 다른 온도의 정확한 값을 계산하는 공식은 배우지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w059",
      "c22-s42-u03-w060",
      "c22-s42-u03-w061",
      "c22-s42-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "온도·공기 양·바깥 압력·경계를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "warming-cooling-v1",
    "text": "연습용 모형 자료예요. 같은 양의 공기를 얇은 주머니에 가두고, 바깥 압력을 같게 했어요. 주머니 경계는 가볍게 움직일 수 있고 공기가 새지 않아요. 각 온도에서 충분히 기다린 뒤 읽었어요. 15 ℃58 mL→25 ℃60 mL→35 ℃62 mL→다시15 ℃58 mL예요. 다른 온도의 정확한 값을 계산하는 공식은 배우지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③ · 다시 생각",
   "title": "변화가 분명하지 않을 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w063"
     ]
    },
    {
     "type": "field",
     "title": "자료와 다음 확인",
     "hint": "제공 자료에서 확인한 변화와 실제 기구에서 추가로 살필 조건을 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "학생이 밀폐 가열이나 뜨거운 물 실험을 임의로 하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ③ · 그림",
   "title": "두 온도의 상태를 비교해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "제공 모형 값과 실제 측정값을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "자료로 기체의 성질을 알아봐요",
   "blocks": [
    {
     "type": "text",
     "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w065",
      "c22-s42-u03-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기체를 마시거나 냄새 맡는 방법으로 확인하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "rsc-gases-v1",
    "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ④",
   "title": "조사·관찰·계획을 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w067",
      "c22-s42-u03-w068",
      "c22-s42-u03-w069",
      "c22-s42-u03-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 출처와 내 실제 행동을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "rsc-gases-v1",
    "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ④ · 이야기",
   "title": "공통점 하나가 전부일까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w071"
     ]
    },
    {
     "type": "field",
     "title": "내 말로 설명하고 고치기",
     "hint": "자료 카드의 성질과 쓰임을 한 쌍씩 연결해 설명해요. 실제로 의견을 듣지 않았다면 예상 의견이라고 표시해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 자료를 실제 기체 시험으로 바꾸어 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④ · 그림",
   "title": "출처가 있는 비교 카드를 만들어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공통점과 차이점이 함께 보여야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ⑤",
   "title": "한 곳만 고친 비교를 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w073",
      "c22-s42-u03-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 부분이 하나인지와 성공 기준을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "device-trials-v1",
    "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ⑤",
   "title": "조건·결과와 재시험을 구별해요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w075",
      "c22-s42-u03-w076",
      "c22-s42-u03-w077",
      "c22-s42-u03-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험 횟수·성공 횟수·미실행을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "device-trials-v1",
    "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ⑤ · 발표",
   "title": "해 본 범위만큼 설명해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w079"
     ]
    },
    {
     "type": "field",
     "title": "실제로 만들 때의 점검",
     "hint": "교사와 안전한 재료·멈춤 기준을 정해요. 실제 제작·시험·재시험 각각의 상태와 달라진 점만 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "직접 만들거나 시험하지 않았다면 완료라고 표시하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ⑤ · 그림",
   "title": "구조·근거·남은 질문을 담아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구조를 그린 것과 실제 작동한 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "출처와 돌아보기",
   "title": "확인한 자료와 실제 수행을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "field",
     "title": "단원을 마치며",
     "hint": "처음 생각에서 고친 점, 자료로 확인한 점, 실제로 해 본 일과 아직 계획인 일을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "내가 하지 않은 실험의 값을 내 측정값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
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
      "c22-s42-u03-w001",
      "c22-s42-u03-w002",
      "c22-s42-u03-w003",
      "c22-s42-u03-w004"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w005",
      "c22-s42-u03-w006",
      "c22-s42-u03-w007",
      "c22-s42-u03-w008"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 9~12",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u03-w009",
      "c22-s42-u03-w010",
      "c22-s42-u03-w011",
      "c22-s42-u03-w012"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 13~16",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u03-w013",
      "c22-s42-u03-w014",
      "c22-s42-u03-w015",
      "c22-s42-u03-w016"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 17~20",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u03-w017",
      "c22-s42-u03-w018",
      "c22-s42-u03-w019",
      "c22-s42-u03-w020"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w021",
      "c22-s42-u03-w022",
      "c22-s42-u03-w023",
      "c22-s42-u03-w024"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w025",
      "c22-s42-u03-w026",
      "c22-s42-u03-w027",
      "c22-s42-u03-w028"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 29~32",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u03-w029",
      "c22-s42-u03-w030",
      "c22-s42-u03-w031",
      "c22-s42-u03-w032"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
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
      "c22-s42-u03-w033",
      "c22-s42-u03-w034",
      "c22-s42-u03-w035"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 36~38",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u03-w036",
      "c22-s42-u03-w037",
      "c22-s42-u03-w038"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w039",
      "c22-s42-u03-w040",
      "c22-s42-u03-w041"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w042",
      "c22-s42-u03-w043",
      "c22-s42-u03-w044",
      "c22-s42-u03-w045"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w046",
      "c22-s42-u03-w047",
      "c22-s42-u03-w048"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w049",
      "c22-s42-u03-w050",
      "c22-s42-u03-w051",
      "c22-s42-u03-w052"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w053",
      "c22-s42-u03-w054",
      "c22-s42-u03-w055"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w056",
      "c22-s42-u03-w057",
      "c22-s42-u03-w058"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w059",
      "c22-s42-u03-w060",
      "c22-s42-u03-w061",
      "c22-s42-u03-w062"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w063",
      "c22-s42-u03-w064",
      "c22-s42-u03-w065"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 66~69",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u03-w066",
      "c22-s42-u03-w067",
      "c22-s42-u03-w068",
      "c22-s42-u03-w069"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  },
  {
   "section": "정답·해설 70~72",
   "title": "정답·풀이·인정 답안",
   "kind": "answers",
   "blocks": [
    {
     "type": "solutions",
     "ids": [
      "c22-s42-u03-w070",
      "c22-s42-u03-w071",
      "c22-s42-u03-w072"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w073",
      "c22-s42-u03-w074",
      "c22-s42-u03-w075",
      "c22-s42-u03-w076"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w077",
      "c22-s42-u03-w078",
      "c22-s42-u03-w079"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
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
      "c22-s42-u03-w080"
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
     "text": "다시 확인할 조건과 근거를 적어요.",
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
       "객관식 · 같은 부피 용기와 공기의 무게",
       "③"
      ],
      [
       "2",
       "객관식 · 무게 측정 자료와 작은 차이",
       "⑤"
      ],
      [
       "3",
       "객관식 · 무게 비교의 조건과 오류",
       "②"
      ],
      [
       "4",
       "객관식 · 공기 무게의 근거와 적용",
       "①"
      ],
      [
       "5",
       "객관식 · 압력과 부피의 관찰",
       "④"
      ],
      [
       "6",
       "객관식 · 온도와 부피의 관찰",
       "③"
      ],
      [
       "7",
       "객관식 · 생활 속 온도·압력 변화 구별",
       "⑤"
      ],
      [
       "8",
       "객관식 · 비교 실험의 조건·자료 해석",
       "②"
      ],
      [
       "9",
       "객관식 · 산소의 성질과 이용",
       "①"
      ],
      [
       "10",
       "객관식 · 이산화 탄소의 성질과 이용",
       "④"
      ],
      [
       "11",
       "객관식 · 공기·질소와 생활",
       "③"
      ],
      [
       "12",
       "객관식 · 여러 기체의 쓰임과 정보 범위",
       "⑤"
      ],
      [
       "13",
       "객관식 · 공기로 작동하는 장치 설계",
       "②"
      ],
      [
       "14",
       "객관식 · 장치의 비교·안전·평가 기준",
       "①"
      ],
      [
       "15",
       "객관식 · 실제 제작·시험과 개선",
       "④"
      ],
      [
       "16",
       "객관식 · 장치 소개와 근거·의견 반영",
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
     "text": "정답뿐 아니라 적용한 조건도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 확인할 조건과 근거를 적어요.",
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
       "객관식 · 같은 부피 용기와 공기의 무게",
       "⑤"
      ],
      [
       "18",
       "객관식 · 무게 측정 자료와 작은 차이",
       "②"
      ],
      [
       "19",
       "객관식 · 압력과 부피의 관찰",
       "①"
      ],
      [
       "20",
       "객관식 · 생활 속 온도·압력 변화 구별",
       "④"
      ],
      [
       "21",
       "빈칸 · 공기의 무게",
       "공간 / 무게"
      ],
      [
       "22",
       "빈칸 · 압력과 부피",
       "줄어든다"
      ],
      [
       "23",
       "빈칸 · 온도와 부피",
       "커진다"
      ],
      [
       "24",
       "빈칸 · 기체의 쓰임",
       "산소"
      ],
      [
       "25",
       "빈칸 · 공정한 비교",
       "한 가지"
      ],
      [
       "26",
       "모두 고르기 · 압력 비교",
       "①, ③, ⑤"
      ],
      [
       "27",
       "모두 고르기 · 온도 비교",
       "①, ②, ④"
      ],
      [
       "28",
       "모두 고르기 · 자료 해석",
       "②, ③, ⑤"
      ],
      [
       "29",
       "모두 고르기 · 장치 개선",
       "②, ④, ⑤"
      ],
      [
       "30",
       "연결 · 조건 구별",
       "(1) ㄴ (2) ㄷ (3) ㄱ"
      ],
      [
       "31",
       "연결 · 기체와 쓰임",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "32",
       "연결 · 모형 결과",
       "(1) ㄴ (2) ㄱ (3) ㄷ"
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
     "text": "정답뿐 아니라 적용한 조건도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 확인할 조건과 근거를 적어요.",
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
       "순서 · 비교 실험",
       "ㄴ → ㄹ → ㄱ → ㄷ"
      ],
      [
       "34",
       "순서 · 장치 개선",
       "ㄷ → ㄴ → ㄹ → ㄱ"
      ],
      [
       "35",
       "서술 · 공기 양과 부피",
       "교사 확인(해설 쪽)"
      ],
      [
       "36",
       "서술 · 온도 비교의 조건",
       "교사 확인(해설 쪽)"
      ],
      [
       "37",
       "서술 · 사진과 원인",
       "교사 확인(해설 쪽)"
      ],
      [
       "38",
       "서술 · 모형의 한계",
       "교사 확인(해설 쪽)"
      ],
      [
       "39",
       "그림 · 공기 장치 설계",
       "교사 확인(해설 쪽)"
      ],
      [
       "40",
       "그림 · 개선 시험 설계",
       "교사 확인(해설 쪽)"
      ],
      [
       "41",
       "객관식 · 무게 비교 자료",
       "③"
      ],
      [
       "42",
       "모두 고르기 · 무게 비교 자료",
       "①, ③, ④"
      ],
      [
       "43",
       "빈칸 · 저울의 한계",
       "없다"
      ],
      [
       "44",
       "단답 · 무게 비교 자료",
       "0.4 g"
      ],
      [
       "45",
       "연결 · 관찰과 해석",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "46",
       "순서 · 무게 비교 계획",
       "ㄴ → ㄹ → ㄱ → ㄷ"
      ],
      [
       "47",
       "서술 · 저울의 한계",
       "교사 확인(해설 쪽)"
      ],
      [
       "48",
       "그림 · 무게 비교 설계",
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
     "text": "정답뿐 아니라 적용한 조건도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 확인할 조건과 근거를 적어요.",
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
       "객관식 · 열림과 닫힘",
       "⑤"
      ],
      [
       "50",
       "모두 고르기 · 압력 비교 조건",
       "②, ⑤"
      ],
      [
       "51",
       "빈칸 · 공기 양과 부피",
       "줄어든다 / 같다"
      ],
      [
       "52",
       "단답 · 눈금 자료 읽기",
       "30 mL"
      ],
      [
       "53",
       "연결 · 비교의 한계",
       "(1) ㄴ (2) ㄷ (3) ㄱ"
      ],
      [
       "54",
       "순서 · 압력 관찰 순서",
       "ㄹ → ㄴ → ㄷ → ㄱ 또는 ㄴ → ㄹ → ㄷ → ㄱ"
      ],
      [
       "55",
       "서술 · 열림과 닫힘",
       "교사 확인(해설 쪽)"
      ],
      [
       "56",
       "그림 · 압력 비교 그림",
       "교사 확인(해설 쪽)"
      ],
      [
       "57",
       "객관식 · 온도 비교 자료",
       "②"
      ],
      [
       "58",
       "모두 고르기 · 온도 자료의 범위",
       "②, ③, ④"
      ],
      [
       "59",
       "빈칸 · 온도와 공기 양",
       "같다"
      ],
      [
       "60",
       "단답 · 온도 자료 읽기",
       "20 ℃"
      ],
      [
       "61",
       "연결 · 움직이는 경계",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "62",
       "순서 · 온도 비교 순서",
       "ㄱ → ㄷ → ㄹ → ㄴ"
      ],
      [
       "63",
       "서술 · 온도 비교의 한계",
       "교사 확인(해설 쪽)"
      ],
      [
       "64",
       "그림 · 온도 비교 그림",
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
     "text": "정답뿐 아니라 적용한 조건도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 확인할 조건과 근거를 적어요.",
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
       "객관식 · 기체 자료 조사",
       "①"
      ],
      [
       "66",
       "모두 고르기 · 출처와 확인",
       "①, ②, ③, ④"
      ],
      [
       "67",
       "빈칸 · 성질과 쓰임",
       "연소 / 반응"
      ],
      [
       "68",
       "단답 · 공기 성분 자료",
       "질소"
      ],
      [
       "69",
       "연결 · 조사와 실제 활동",
       "(1) ㄴ (2) ㄷ (3) ㄱ"
      ],
      [
       "70",
       "순서 · 조사와 설명 순서",
       "ㄷ → ㄱ → ㄹ → ㄴ"
      ],
      [
       "71",
       "서술 · 성질과 판단",
       "교사 확인(해설 쪽)"
      ],
      [
       "72",
       "그림 · 조사 카드 만들기",
       "교사 확인(해설 쪽)"
      ],
      [
       "73",
       "객관식 · 장치 비교 자료",
       "④"
      ],
      [
       "74",
       "모두 고르기 · 장치 기록의 범위",
       "①, ④, ⑤"
      ],
      [
       "75",
       "빈칸 · 계획과 실제",
       "시험"
      ],
      [
       "76",
       "단답 · 장치 시험 기록",
       "10회"
      ],
      [
       "77",
       "연결 · 장치 비교의 조건과 결과",
       "(1) ㄷ (2) ㄱ (3) ㄴ"
      ],
      [
       "78",
       "순서 · 장치 개선 순서",
       "ㄷ → ㄹ → ㅁ → ㄱ → ㄴ"
      ],
      [
       "79",
       "서술 · 장치 결론의 한계",
       "교사 확인(해설 쪽)"
      ],
      [
       "80",
       "그림 · 장치 설명 그림",
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
     "text": "정답뿐 아니라 적용한 조건도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "다시 확인할 조건과 근거를 적어요.",
     "write": 6
    }
   ]
  }
 ],
 "figures": {
  "reuse-c22-s42-u03-b85": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">상태</th><th scope=\"col\">연결부</th><th scope=\"col\">받친 시간(초)</th></tr></thead><tbody><tr><td>처음</td><td>새는 소리가 남</td><td>2</td></tr><tr><td>수정 뒤</td><td>새는 소리가 줄어듦</td><td>6</td></tr></tbody></table><p>사고력 연습을 위한 가상 시험 기록이며 실제 학생의 제작·측정값이 아닙니다.</p>",
  "reuse-c22-s42-u03-b91": "<table class=\"ed-table\"><thead><tr><th scope=\"col\">장치</th><th scope=\"col\">성공/시험</th></tr></thead><tbody><tr><td>가</td><td>3/5</td></tr><tr><td>나</td><td>5/5</td></tr></tbody></table><p>사고력 연습을 위한 가상 시험 기록이며 실제 학생의 제작·측정값이 아닙니다.</p>",
  "syringe": "<div class=\"ed-photo\"><img src=\"../assets/book/c22-s42-u03-photo-syringe.webp\" alt=\"마개와 피스톤이 있는 바늘 없는 주사기\" loading=\"eager\"><p class=\"ed-photo-note\">모양을 살펴보는 설명 이미지예요. 눈금이나 측정 자료로 사용하지 않아요.</p><small class=\"ed-photo-credit\">실제 사진 아님</small></div>",
  "pumpTube": "<div class=\"ed-photo gas-material-photo\"><img src=\"../assets/activities/c22-s42-u03/pump-tube-reference.webp\" alt=\"별도로 놓인 손 펌프와 투명한 관\" loading=\"eager\"><p class=\"ed-photo-note\">펌프와 관의 모양 참고 · 완성 장치나 실제 작동 사진 아님</p><small class=\"ed-photo-credit\">실제 사진 아님</small></div>",
  "sources": "<div class=\"gas-sources\"><p>교육부 <a href=\"https://www.moe.go.kr/boardCnts/viewRenew.do?boardID=294&amp;boardSeq=93459&amp;lev=0&amp;m=020&amp;s=moe\">2022 개정 교육과정 확정·발표</a> · 4과15-01~04</p><p>왕립화학회 <a href=\"https://periodic-table.rsc.org/element/8/oxygen\">산소</a> · <a href=\"https://periodic-table.rsc.org/element/7/nitrogen\">질소</a> · 성질과 이용 자료</p><p>자료와 문항의 수치는 모형·가상 학습 자료로 표시했어요. 실제 측정이나 실제 제작 여부는 직접 수행한 기록과 구별해요.</p></div>"
 },
 "teacherStudentPages": [
  {
   "section": "단원 열기",
   "title": "보이지 않는 공기를 어떻게 알아볼까?",
   "blocks": [
    {
     "type": "diagram",
     "key": "syringe",
     "caption": ""
    },
    {
     "type": "text",
     "text": "마개가 닫힌 바늘 없는 주사기를 떠올려요. 피스톤을 밀면 안의 공기는 어떻게 될까요? 먼저 예상하고, 비교할 조건을 정한 뒤 근거로 설명해요."
    },
    {
     "type": "heading",
     "text": "이 단원에서 할 일"
    },
    {
     "type": "list",
     "items": [
      "공기의 무게를 알아볼 비교 자료 읽기",
      "압력과 온도를 각각 바꾸어 부피 비교하기",
      "여러 기체의 성질과 쓰임 연결하기",
      "공기 장치를 설계하고 실제 시험 계획 세우기"
     ],
     "ordered": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기의 양과 부피를 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "2022 개정 · 4학년 2학기 Ⅲ",
   "kind": "learn"
  },
  {
   "section": "배움 지도",
   "title": "보이지 않는 공기에도 근거가 있어요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "배울 것",
      "읽을 근거",
      "설명할 것"
     ],
     "rows": [
      [
       "공기의 무게",
       "같은 바깥 부피 용기의 전후 저울 표시",
       "공기만 더하거나 뺐는지"
      ],
      [
       "압력과 부피",
       "밀폐한 주사기에서 달라진 공간",
       "공기의 양과 차지하는 공간의 차이"
      ],
      [
       "온도와 부피",
       "경계가 움직이는 장치의 조건별 기록",
       "다른 조건이 같은지"
      ],
      [
       "기체의 쓰임·장치",
       "출처가 있는 조사 자료·시험 기록",
       "성질과 쓰임·수정의 근거"
      ]
     ]
    },
    {
     "type": "text",
     "text": "사진은 재료 모양을 살피는 설명 자료예요. 사진의 크기나 눈금으로 부피를 재지 않아요. 따로 제시한 수치는 가상 학습 자료이며, 실제로 수행한 결과와 구별해요."
    },
    {
     "type": "field",
     "title": "지금 궁금한 것",
     "hint": "공기의 무게·부피·쓰임 중 하나를 골라 무엇을 비교하면 좋을지 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같게 둘 것과 바꿀 것을 정한 뒤, 관찰할 결과를 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "같은 공기라도 차지하는 공간이 달라질 수 있어요. 공기의 양과 부피를 구별해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "무게 비교의 설계",
   "title": "마개까지 같아야 공기만 비교해요",
   "blocks": [
    {
     "type": "text",
     "text": "아래는 같은 저울로 공기를 더 넣기 전후를 비교하는 가상 계획이에요. 바깥 부피가 유지되는 용기를 쓰고, 저울이 안정된 뒤 같은 방법으로 읽기로 했어요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "용기",
      "마개",
      "바깥 부피",
      "다른 변화"
     ],
     "rows": [
      [
       "가",
       "같음",
       "같음",
       "같음",
       "다른 물질 출입 없음"
      ],
      [
       "나",
       "같음",
       "다름",
       "같음",
       "다른 물질 출입 없음"
      ],
      [
       "다",
       "같음",
       "같음",
       "같음",
       "물방울도 넣음"
      ]
     ]
    },
    {
     "type": "example",
     "question": "어느 계획이 공기를 더 넣은 영향만 알아보기에 알맞을까요?",
     "steps": [
      [
       "바꾼 것 찾기",
       "공기를 더 넣었는지 여부만 달라야 해요."
      ],
      [
       "섞인 변화 찾기",
       "나는 마개, 다는 물방울의 무게도 함께 달라져요. 가는 그런 변화를 줄였어요."
      ],
      [
       "결과와 구별",
       "마지막 저울 표시는 미리 같게 만들 조건이 아니라 비교한 뒤 읽을 결과예요."
      ]
     ],
     "answer": "이 세 계획에서는 가예요. 실제로 공기가 새지 않았는지도 확인해요."
    },
    {
     "type": "field",
     "title": "계획 고치기",
     "hint": "나 또는 다를 골라 공기만 비교하도록 고칠 점을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 용기·마개·바깥 부피·저울과 읽는 방법을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "공기를 넣을 때 사용한 펌프를 저울 위에 함께 올려 전후 무게를 비교하지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "측정의 한계",
   "title": "같은 표시가 곧 변화 없음일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "0.1 g 간격으로 표시하는 저울을 쓴 가상 기록이에요. 같은 바깥 부피의 용기에 공기만 조금 더 넣었지만, 전후 표시가 모두 80.0 g이었어요."
    },
    {
     "type": "table",
     "heads": [
      "읽은 것",
      "이 기록으로 확인되는 것",
      "더 확인할 것"
     ],
     "rows": [
      [
       "전 80.0 g / 후 80.0 g",
       "이 저울의 표시 차이가 보이지 않음",
       "기구가 작은 차이를 구분하는지"
      ],
      [
       "공기를 더 넣었다는 계획",
       "실제로 넣으려 한 방법",
       "연결부 누출·실제 수행 여부"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“표시가 같으니 공기의 무게는 0이다”라고 결론 내려도 될까요?",
     "steps": [
      [
       "관찰 읽기",
       "확인한 것은 두 번의 표시가 같았다는 점이에요."
      ],
      [
       "한계 찾기",
       "이 저울이 구분하기 어려운 작은 차이나 누출 가능성을 아직 확인하지 않았어요."
      ],
      [
       "결론 다듬기",
       "이 기록에서는 무게 차이를 확인하지 못했다고 적고, 기구와 비교 방법을 점검해요."
      ]
     ],
     "answer": "표시가 같다는 기록만으로 공기의 무게가 없다고 정할 수 없어요."
    },
    {
     "type": "field",
     "title": "다음 확인",
     "hint": "눈금·누출·읽는 때 중 하나를 골라 무엇을 확인할지 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이지 않는 차이와 차이가 없다는 결론을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "예상에 맞추려고 표시를 바꾸어 적지 않아요. 실제로 읽은 값과 확인하지 못한 점을 함께 남겨요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념과 예제",
   "title": "공기만 달라진 비교를 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "공기의 무게를 확인하려면 같은 용기·마개·바깥 부피와 저울을 사용해요. 공기 이외의 물질이 들어오거나 나가면 그 영향도 섞여요."
    },
    {
     "type": "table",
     "heads": [
      "같게 할 것",
      "확인할 까닭"
     ],
     "rows": [
      [
       "용기·마개·바깥 부피",
       "용기나 바깥 크기가 달라진 영향을 줄여요."
      ],
      [
       "저울과 읽는 방법",
       "서로 다른 측정 기준이 섞이지 않게 해요."
      ],
      [
       "다른 물질의 출입",
       "물방울·추 등이 무게를 바꾸지 않게 해요."
      ]
     ]
    },
    {
     "type": "example",
     "question": "가상 저울 자료: 공기만 더 넣기 전50.1 g, 넣은 후50.3 g이에요. 무엇을 근거로 설명할까요?",
     "steps": [
      [
       "조건",
       "같은 용기·마개·바깥 부피와 저울인지 확인해요."
      ],
      [
       "관찰",
       "뒤의 표시가0.2 g 더 커졌어요."
      ],
      [
       "해석",
       "다른 물질의 출입이 없다면 공기도 무게가 있다는 근거예요."
      ]
     ],
     "answer": "0.2 g은 이 비교의 차이이며 모든 공기의 무게가 아니에요."
    },
    {
     "type": "field",
     "title": "차이의 뜻",
     "hint": "이 예의 0.2 g으로 말할 수 있는 것과 말할 수 없는 것을 한 가지씩 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "전후 차이와 공기 전체의 무게는 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "공기의 양과 부피",
   "title": "끝이 열린 주사기도 같은 비교일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "바늘 없는 주사기의 피스톤을 천천히 누르는 두 상황이에요. 같은 시작 눈금·같은 온도에서 시작한다고 정했어요. 손으로 무리하게 누르는 활동은 하지 않아요."
    },
    {
     "type": "table",
     "heads": [
      "상황",
      "끝부분의 조건",
      "함께 살필 것"
     ],
     "rows": [
      [
       "가",
       "막고, 연결부로 새지 않음",
       "공기를 가둔 채 차지하는 공간이 줄어드는지"
      ],
      [
       "나",
       "열려 있어 공기가 밖으로 나갈 수 있음",
       "공기가 빠져나가 안의 양도 달라지는지"
      ]
     ]
    },
    {
     "type": "example",
     "question": "가와 나 모두 피스톤이 들어갔어요. “안의 공기 양이 같다”고 해도 될까요?",
     "steps": [
      [
       "공간 읽기",
       "피스톤 위치는 안의 공간이 달라졌다는 단서예요."
      ],
      [
       "출입 확인",
       "가는 새지 않는다는 조건이 있지만, 나는 공기가 나갈 수 있어요."
      ],
      [
       "설명 나누기",
       "가에서는 같은 공기가 더 작은 공간을 차지해요. 나까지 같은 양이라고 정할 수는 없어요."
      ]
     ],
     "answer": "피스톤 위치와 공기 양은 다른 정보예요. 끝과 연결부의 조건을 함께 읽어요."
    },
    {
     "type": "field",
     "title": "한 문장 설명",
     "hint": "“공간이 줄었으니 공기가 사라졌다”를 가의 조건에 맞게 고쳐 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "밀폐되어 새지 않을 때 공기 양과 부피를 나누어 생각해요."
    },
    {
     "title": "더 알아보기",
     "text": "눈금은 차지하는 공간을 읽는 기준이에요. 공기 양을 직접 센 숫자는 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "압력 비교의 근거",
   "title": "누르는 압력 하나만 바꾸어요",
   "blocks": [
    {
     "type": "text",
     "text": "같은 기구로 누르는 압력에 따른 공기 부피를 비교할 계획이에요. 세 계획 모두 결과로 부피를 읽기로 했어요."
    },
    {
     "type": "table",
     "heads": [
      "계획",
      "공기 양",
      "온도",
      "누르는 압력"
     ],
     "rows": [
      [
       "가",
       "같음",
       "같음",
       "다름"
      ],
      [
       "나",
       "다름",
       "같음",
       "다름"
      ],
      [
       "다",
       "같음",
       "다름",
       "다름"
      ]
     ]
    },
    {
     "type": "example",
     "question": "부피 차이를 압력 변화와 연결하기에 가장 알맞은 계획은?",
     "steps": [
      [
       "질문 확인",
       "알아볼 것은 누르는 압력을 달리했을 때의 부피예요."
      ],
      [
       "조건 비교",
       "가만 공기 양과 온도를 같게 두어요. 나는 양, 다는 온도까지 달라져요."
      ],
      [
       "결과 읽기",
       "같은 공기 양·온도에서 압력이 커질 때 부피가 줄어드는 방향을 관찰해요."
      ]
     ],
     "answer": "이 세 계획에서는 가예요. 결과 부피를 미리 같은 값으로 맞추지는 않아요."
    },
    {
     "type": "field",
     "title": "다른 계획의 한계",
     "hint": "나 또는 다에서 부피가 달라져도 압력 때문이라고만 말하기 어려운 까닭을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "압력은 바꿀 것, 부피는 관찰할 것, 공기 양·온도는 같게 둘 것이에요."
    },
    {
     "title": "더 알아보기",
     "text": "누르기 어렵거나 연결부가 불안하면 멈추고 선생님에게 알려요. 큰 힘으로 끝까지 밀지 않아요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "온도 비교의 근거",
   "title": "따뜻해진 뒤 원래 조건으로 돌아가요",
   "blocks": [
    {
     "type": "text",
     "text": "공기가 새지 않고 경계가 가볍게 움직이며 바깥 압력이 거의 같은 장치를 가정한 가상 기록이에요. 각 조건에서 충분히 기다린 뒤 읽었다고 정했어요. 실제 측정값은 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "공기 온도(℃)",
      "부피(mL)"
     ],
     "rows": [
      [
       "1",
       "20",
       "40"
      ],
      [
       "2",
       "35",
       "42"
      ],
      [
       "3",
       "20",
       "40"
      ]
     ]
    },
    {
     "type": "example",
     "question": "두 번째와 세 번째 기록은 무엇을 설명하는 근거가 될까요?",
     "steps": [
      [
       "변화 읽기",
       "35 ℃에서 42 mL였다가 20 ℃로 돌아오자 40 mL가 되었어요."
      ],
      [
       "조건 확인",
       "공기 양·바깥 압력이 같고 경계가 움직인다는 조건에서 읽은 기록이에요."
      ],
      [
       "범위 정하기",
       "이 조건에서는 온도를 낮췄을 때 부피가 작아졌다고 설명해요. 모든 기구의 값이 같다는 뜻은 아니에요."
      ]
     ],
     "answer": "온도를 높일 때와 낮출 때를 나누어 보고, 처음과 같은 조건의 기록도 대조해요."
    },
    {
     "type": "field",
     "title": "기구가 다르다면",
     "hint": "딱딱한 병의 바깥 크기만 재면 이 기록과 곧바로 비교하기 어려운 까닭을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기 양·바깥 압력·움직일 경계와 기다린 때를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "뜨거운 물이나 불로 직접 데우지 않아요. 교사가 정한 안전한 물과 기구로만 관찰해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "다른 기록을 만났을 때",
   "title": "예상과 달라도 기록부터 남겨요",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "관찰 기록",
      "바로 단정하지 않기",
      "확인할 것"
     ],
     "rows": [
      [
       "같은 시작 온도로 돌아왔지만 눈금이 달랐음",
       "기체의 성질이 사라졌다고 말하지 않음",
       "공기 누출·경계 걸림·기다린 때"
      ],
      [
       "같은 조건에서 두 번 값이 조금 달랐음",
       "한 번을 지우고 같은 값으로 만들지 않음",
       "눈높이·읽는 눈금·조건의 차이"
      ],
      [
       "온도는 적었지만 부피 칸이 비어 있음",
       "부피를 0 mL로 채우지 않음",
       "실제로 읽었는지·기록을 빠뜨렸는지"
      ]
     ]
    },
    {
     "type": "example",
     "question": "친구가 “첫 값으로 돌아와야 하니까 마지막 값을 고치자”고 했어요. 어떻게 할까요?",
     "steps": [
      [
       "사실 보존",
       "실제로 읽은 값과 읽은 때를 그대로 남겨요."
      ],
      [
       "원인 점검",
       "새는 곳이나 경계 걸림 등 조건이 유지되었는지 확인해요."
      ],
      [
       "다시 비교",
       "방법을 점검한 뒤 다시 시행하고 새 기록을 따로 남겨요. 예상에 맞춰 앞 기록을 바꾸지 않아요."
      ]
     ],
     "answer": "관찰·가능한 까닭·다음 확인을 나누어 적어요."
    },
    {
     "type": "field",
     "title": "기록을 덧붙여요",
     "hint": "“값이 달랐다” 뒤에 확인할 조건과 재시험 방법을 한 가지씩 이어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "예상은 관찰값을 고르는 기준이 아니에요."
    },
    {
     "title": "더 알아보기",
     "text": "한 번 더 했다는 사실만으로 믿을 만해지는 것은 아니에요. 비교 조건과 읽는 방법도 확인해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "실험 설계",
   "title": "두 비교를 섞지 않기",
   "blocks": [
    {
     "type": "table",
     "heads": [
      "비교",
      "바꿀 것",
      "같게 둘 것",
      "관찰할 것"
     ],
     "rows": [
      [
       "압력",
       "누르는 압력",
       "공기 양·온도",
       "부피"
      ],
      [
       "온도",
       "공기 온도",
       "공기 양·바깥 압력·움직일 경계",
       "부피"
      ]
     ]
    },
    {
     "type": "text",
     "text": "수업 3D 실험실에서 조건별로 관찰하고 값을 읽어요. 아래 값은 모형 값이며 실제 실험의 측정값이 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "상대 압력",
      "부피(mL)"
     ],
     "rows": [
      [
       "1",
       "60"
      ],
      [
       "2",
       "30"
      ],
      [
       "3",
       "20"
      ]
     ]
    },
    {
     "type": "table",
     "heads": [
      "온도(℃)",
      "부피(mL)"
     ],
     "rows": [
      [
       "10",
       "58"
      ],
      [
       "20",
       "60"
      ],
      [
       "30",
       "62"
      ]
     ]
    },
    {
     "type": "field",
     "title": "두 비교를 나누어요",
     "hint": "압력 비교와 온도 비교에서 같게 둘 조건이 다른 점을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "압력 비교에서는 온도, 온도 비교에서는 바깥 압력과 움직일 경계를 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기체 자료 읽기",
   "title": "색이 없다고 같은 기체일까요?",
   "blocks": [
    {
     "type": "text",
     "text": "산소와 질소는 모두 색이 없는 기체지만, 이것만으로 성질과 쓰임이 같다고 정하지 않아요. 아래는 왕립화학회 자료에서 읽을 수 있는 내용을 간추린 조사 예예요."
    },
    {
     "type": "table",
     "heads": [
      "기체",
      "자료에서 확인할 성질·역할",
      "이어지는 쓰임"
     ],
     "rows": [
      [
       "산소",
       "호흡에 필요함",
       "호흡과 관련된 이용"
      ],
      [
       "질소",
       "쉽게 반응하지 않는 환경을 만드는 데 이용",
       "일부 식품 포장 등에 이용"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“둘 다 색이 없으니 식품 포장에 언제나 바꾸어 써도 된다”는 말이 맞나요?",
     "steps": [
      [
       "같은 점",
       "보이는 색이 없다는 공통점은 있어요."
      ],
      [
       "빠진 조건",
       "반응하는 성질과 이용 목적까지 같다는 자료는 없어요."
      ],
      [
       "근거 연결",
       "각 기체의 성질과 이용 상황을 별도로 조사하고, 일부 사례를 모든 경우로 넓히지 않아요."
      ]
     ],
     "answer": "겉모습 하나로 종류·성질·쓰임을 모두 정하지 않아요."
    },
    {
     "type": "field",
     "title": "조사 카드 만들기",
     "hint": "기체 하나를 골라 기관·자료 제목·확인한 성질·그 성질과 관련된 쓰임을 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "종류 → 성질 → 쓰임 → 출처 순서로 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "기체를 알아내려고 직접 냄새 맡거나 불을 붙이지 않아요. 공개된 자료를 조사해요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념과 조사",
   "title": "같아 보이는 기체도 쓰임이 달라요",
   "blocks": [
    {
     "type": "text",
     "text": "색이 없다는 공통점만으로 기체 종류나 모든 성질을 정할 수는 없어요. 믿을 만한 자료에서 종류·성질·이용 상황을 함께 확인해요."
    },
    {
     "type": "table",
     "heads": [
      "기체",
      "성질과 대표적 이용",
      "과장하지 않기"
     ],
     "rows": [
      [
       "산소",
       "호흡에 필요하고 다른 물질의 연소를 도움",
       "스스로 타는 연료라는 뜻은 아니에요."
      ],
      [
       "질소",
       "쉽게 반응하지 않는 성질을 이용한 일부 식품 포장",
       "모든 변질을 무조건 막는 것은 아니에요."
      ],
      [
       "이산화 탄소",
       "탄산음료와CO₂식 소화기 등에 이용",
       "모든 불·모든 소화기를 하나로 묶지 않아요."
      ]
     ]
    },
    {
     "type": "field",
     "title": "자료 조사에서 남길 것",
     "hint": "발행 기관·자료 제목·확인한 성질과 쓰임을 짧게 적어요. 직접 기체를 시험한 기록과 구별해요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 출처와 적용 조건을 같이 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념과 장치",
   "title": "공기가 움직이는 길을 설계해요",
   "blocks": [
    {
     "type": "diagram",
     "key": "pumpTube"
    },
    {
     "type": "text",
     "text": "손 펌프·관에 얇은 주머니와 가벼운 종이판을 더해 장치를 설계해요. 사진은 두 재료의 모양 참고이며 완성된 연결 구조나 실제 작동 결과가 아니에요."
    },
    {
     "type": "table",
     "heads": [
      "부분",
      "맡을 역할"
     ],
     "rows": [
      [
       "손 펌프",
       "공기를 보냄"
      ],
      [
       "관",
       "공기가 이동하는 길"
      ],
      [
       "얇은 주머니",
       "공기가 들어와 공간이 커짐"
      ],
      [
       "가벼운 종이판",
       "주머니에 밀려 움직임"
      ]
     ]
    },
    {
     "type": "field",
     "title": "만들기 전에 정하기",
     "hint": "교사와 안전한 재료·고정 방법·성공 기준·멈춤 기준을 정해요. 입으로 불거나 무리한 힘을 쓰지 않아요.",
     "lines": 3,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설계·실제 제작·시험·수정·재시험을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "장치 개선의 증거",
   "title": "한 곳을 고친 뒤 같은 기준으로 시험해요",
   "blocks": [
    {
     "type": "text",
     "text": "손 펌프·관·주머니가 종이판을 밀어 올리는 장치를 실제로 시험했다고 가정한 연습용 기록이에요. 실제 제작을 대신하는 결과가 아니에요. 높이는 같은 자와 기준점으로 읽었다고 정했어요."
    },
    {
     "type": "table",
     "heads": [
      "시험",
      "바꾼 것",
      "같게 둔 것",
      "올라간 높이(cm)"
     ],
     "rows": [
      [
       "처음",
       "수정 전",
       "주머니·종이판·시작 상태·펌프 방법",
       "1"
      ],
      [
       "다시",
       "연결부 한 곳을 밀봉",
       "주머니·종이판·시작 상태·펌프 방법",
       "3"
      ]
     ]
    },
    {
     "type": "example",
     "question": "“연결부를 고친 뒤 더 잘 움직였다”를 어떤 근거로 말할까요?",
     "steps": [
      [
       "수정 확인",
       "연결부 한 곳을 밀봉했고 다른 조건은 같게 두었다는 기록을 읽어요."
      ],
      [
       "결과 비교",
       "같은 기준에서 올라간 높이가 1 cm에서 3 cm로 커졌어요."
      ],
      [
       "한계 확인",
       "이 조건의 두 시험에서는 움직임이 커졌어요. 항상 3 cm가 되거나 다른 문제까지 해결됐다는 뜻은 아니에요."
      ]
     ],
     "answer": "수정한 부분과 전후 결과를 연결하고, 같은 조건으로 다시 확인해요."
    },
    {
     "type": "field",
     "title": "나의 개선 계획",
     "hint": "관이 눌린 장치를 떠올려 한 곳만 고칠 방법·같게 둘 조건 두 가지·성공과 멈춤 기준을 써요.",
     "lines": 4,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "설계 → 제작 → 시험 → 근거로 수정 → 같은 기준의 재시험을 이어 가요."
    },
    {
     "title": "더 알아보기",
     "text": "그림이나 재료 사진만으로 작동에 성공했다고 기록하지 않아요. 아직 하지 않았으면 계획이라고 적어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "조건 → 관찰한 변화 → 말할 수 있는 범위를 연결해요.",
     "write": 6
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "기본·적용 1~3",
   "title": "같은 부피 용기와 공기의 무게",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w001",
      "c22-s42-u03-w002",
      "c22-s42-u03-w003"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 4~6",
   "title": "공기 무게의 근거와 적용",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w004",
      "c22-s42-u03-w005",
      "c22-s42-u03-w006"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 7~9",
   "title": "생활 속 온도·압력 변화 구별",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w007",
      "c22-s42-u03-w008",
      "c22-s42-u03-w009"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 10~12",
   "title": "이산화 탄소의 성질과 이용",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w010",
      "c22-s42-u03-w011",
      "c22-s42-u03-w012"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 13~15",
   "title": "공기로 작동하는 장치 설계",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w013",
      "c22-s42-u03-w014",
      "c22-s42-u03-w015"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 16~18",
   "title": "장치 소개와 근거·의견 반영",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w016",
      "c22-s42-u03-w017",
      "c22-s42-u03-w018"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "기본·적용 19~20",
   "title": "압력과 부피의 관찰",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w019",
      "c22-s42-u03-w020"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "조건과 자료에 있는 근거로 답을 골라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.",
   "kind": "check",
   "layout": "two"
  },
  {
   "section": "개념 정리",
   "title": "공기의 성질을 말로 채우기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w021",
      "c22-s42-u03-w022",
      "c22-s42-u03-w023"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "빈칸을 채운 뒤 같은 조건을 한 가지 더 말해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "개념 정리",
   "title": "성질과 공정한 비교",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w024",
      "c22-s42-u03-w025"
     ]
    },
    {
     "type": "text",
     "text": "산소·질소·이산화 탄소의 대표적 쓰임을 다시 찾아보고, 모든 상황에 적용되지 않는 까닭도 생각해요."
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기체의 성질을 실제 쓰임과 연결해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "조건 고르기",
   "title": "압력과 온도를 나누어 보기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w026",
      "c22-s42-u03-w027"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꿀 조건과 같게 둘 조건을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료·개선",
   "title": "근거를 골라 설명하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w028",
      "c22-s42-u03-w029"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 숫자와 실제 수행 여부를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "연결하기",
   "title": "조건과 기체의 쓰임",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w030",
      "c22-s42-u03-w031"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 기호가 무엇을 뜻하는지 보기와 대조해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "자료·순서",
   "title": "모형 자료와 실험 순서",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w032",
      "c22-s42-u03-w033"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "모형 값의 단위와 비교 조건을 함께 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "순서·설명",
   "title": "고친 말에 근거 담기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w034",
      "c22-s42-u03-w035"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기가 사라진 것과 공간이 줄어든 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "서술형",
   "title": "관찰만으로 말할 수 있을까?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w036",
      "c22-s42-u03-w037"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "보이지 않은 조건을 지어내지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "모형과 실제",
   "title": "실제 측정과 설계를 구별하기",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w038"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화면 체험과 실제 실험은 각각의 근거를 남겨요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "section": "설계하기",
   "title": "공기로 움직이는 인형",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w039"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "화살표로 공기의 경로를 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "개선하기",
   "title": "한 곳을 고쳐 같은 기준으로",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w040"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "고칠 부분 하나, 같게 둘 조건 두 가지를 표시해요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ①",
   "title": "공기만 달라진 비교인가요?",
   "blocks": [
    {
     "type": "text",
     "text": "같은 단단한 용기·마개·바깥 부피와 같은 저울을 쓰고, 다른 물질의 출입 없이 공기만 더 넣었다고 가정한 가상 기록이에요."
    },
    {
     "type": "table",
     "heads": [
      "반복",
      "넣기 전(g)",
      "넣은 후(g)"
     ],
     "rows": [
      [
       "1",
       "120.2",
       "120.6"
      ],
      [
       "2",
       "120.2",
       "120.6"
      ],
      [
       "3",
       "120.3",
       "120.7"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w041",
      "c22-s42-u03-w042"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 용기·마개·바깥 부피로 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "mass-trials-v1",
    "text": "연습용 가상 자료예요. 같은 단단한 용기·마개·바깥 부피와 같은 저울을 사용했어요. 교사가 공기만 더 넣어 준비했고 다른 물질의 출입은 없어요. 같은 조건으로 되돌려 세 번 비교했어요. 넣기 전→후: 1회120.2→120.6 g, 2회120.2→120.6 g, 3회120.3→120.7 g. 실제 내 실험 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ①",
   "title": "표시값과 결론을 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 자료예요. 같은 단단한 용기·마개·바깥 부피와 같은 저울을 사용했어요. 교사가 공기만 더 넣어 준비했고 다른 물질의 출입은 없어요. 같은 조건으로 되돌려 세 번 비교했어요. 넣기 전→후: 1회120.2→120.6 g, 2회120.2→120.6 g, 3회120.3→120.7 g. 실제 내 실험 결과가 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w043",
      "c22-s42-u03-w044",
      "c22-s42-u03-w045",
      "c22-s42-u03-w046"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "관찰값·해석·추가 확인을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "mass-trials-v1",
    "text": "연습용 가상 자료예요. 같은 단단한 용기·마개·바깥 부피와 같은 저울을 사용했어요. 교사가 공기만 더 넣어 준비했고 다른 물질의 출입은 없어요. 같은 조건으로 되돌려 세 번 비교했어요. 넣기 전→후: 1회120.2→120.6 g, 2회120.2→120.6 g, 3회120.3→120.7 g. 실제 내 실험 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ① · 다시 생각",
   "title": "변화가 보이지 않으면 무엇을 확인할까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w047"
     ]
    },
    {
     "type": "field",
     "title": "교사의 비교 자료 읽기",
     "hint": "같은 조건인지 살펴본 자료와 아직 분명하지 않은 점을 짧게 적어요. 직접 측정하지 않았다면 자료 확인이라고 표시해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "결과가 불분명하면 성공한 값으로 바꿔 적지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ① · 그림",
   "title": "공기의 무게 비교를 설계해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w048"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "계획은 실제 측정 기록과 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ②",
   "title": "열린 주사기와 닫힌 주사기",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w049",
      "c22-s42-u03-w050"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "끝이 열렸는지 닫혔는지부터 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "closed-open-v1",
    "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
   }
  },
  {
   "section": "생각 넓히기 ②",
   "title": "부피 감소의 설명도 같을까요?",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w051",
      "c22-s42-u03-w052",
      "c22-s42-u03-w053",
      "c22-s42-u03-w054"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "같은 양의 공기인지 확인하고 자료를 읽어요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "closed-open-v1",
    "text": "연습용 가상 자료예요. 같은 온도에서 바늘 없는 주사기를 비교했어요. A는 마개를 닫아 공기가 새지 않아요. 시작40 mL→살짝 누름30 mL→더 누름25 mL→손을 뗀 뒤39 mL예요. B는 끝이 열려 있어 공기가 드나들어요. 시작40 mL→누름10 mL예요. 두 주사기에서 피스톤 앞쪽 공간의 눈금을 읽었어요."
   }
  },
  {
   "section": "생각 넓히기 ② · 해 보기",
   "title": "두 설명의 차이를 말해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w055"
     ]
    },
    {
     "type": "field",
     "title": "교사와 관찰한 사실",
     "hint": "바늘 없는 기구로 교사와 살펴본 변화만 적어요. 아직 하지 않았다면 예상으로 남겨요. 막힌 기구를 무리하게 누르지 않아요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "누르기 어려우면 멈추고 교사에게 알려요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ② · 그림",
   "title": "같은 공기가 차지하는 공간",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w056"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공기 입자 그림이나 공식을 쓰지 않아도 돼요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ③",
   "title": "따뜻하게·차게 바꾼 자료",
   "blocks": [
    {
     "type": "text",
     "text": "같은 공기 양·바깥 압력, 새지 않고 가볍게 움직이는 주머니의 연습용 모형 자료예요. 각 온도에서 충분히 기다렸어요."
    },
    {
     "type": "table",
     "heads": [
      "차례",
      "온도(℃)",
      "부피(mL)"
     ],
     "rows": [
      [
       "1",
       "15",
       "58"
      ],
      [
       "2",
       "25",
       "60"
      ],
      [
       "3",
       "35",
       "62"
      ],
      [
       "4",
       "15",
       "58"
      ]
     ]
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w057",
      "c22-s42-u03-w058"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "따뜻해질 때와 차가워질 때를 함께 비교해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "warming-cooling-v1",
    "text": "연습용 모형 자료예요. 같은 양의 공기를 얇은 주머니에 가두고, 바깥 압력을 같게 했어요. 주머니 경계는 가볍게 움직일 수 있고 공기가 새지 않아요. 각 온도에서 충분히 기다린 뒤 읽었어요. 15 ℃58 mL→25 ℃60 mL→35 ℃62 mL→다시15 ℃58 mL예요. 다른 온도의 정확한 값을 계산하는 공식은 배우지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③",
   "title": "움직일 수 있는 경계인가요?",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 모형 자료예요. 같은 양의 공기를 얇은 주머니에 가두고, 바깥 압력을 같게 했어요. 주머니 경계는 가볍게 움직일 수 있고 공기가 새지 않아요. 각 온도에서 충분히 기다린 뒤 읽었어요. 15 ℃58 mL→25 ℃60 mL→35 ℃62 mL→다시15 ℃58 mL예요. 다른 온도의 정확한 값을 계산하는 공식은 배우지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w059",
      "c22-s42-u03-w060",
      "c22-s42-u03-w061",
      "c22-s42-u03-w062"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "온도·공기 양·바깥 압력·경계를 나누어요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "warming-cooling-v1",
    "text": "연습용 모형 자료예요. 같은 양의 공기를 얇은 주머니에 가두고, 바깥 압력을 같게 했어요. 주머니 경계는 가볍게 움직일 수 있고 공기가 새지 않아요. 각 온도에서 충분히 기다린 뒤 읽었어요. 15 ℃58 mL→25 ℃60 mL→35 ℃62 mL→다시15 ℃58 mL예요. 다른 온도의 정확한 값을 계산하는 공식은 배우지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ③ · 다시 생각",
   "title": "변화가 분명하지 않을 때",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w063"
     ]
    },
    {
     "type": "field",
     "title": "자료와 다음 확인",
     "hint": "제공 자료에서 확인한 변화와 실제 기구에서 추가로 살필 조건을 나누어 써요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "학생이 밀폐 가열이나 뜨거운 물 실험을 임의로 하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ③ · 그림",
   "title": "두 온도의 상태를 비교해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w064"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "제공 모형 값과 실제 측정값을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ④",
   "title": "자료로 기체의 성질을 알아봐요",
   "blocks": [
    {
     "type": "text",
     "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w065",
      "c22-s42-u03-w066"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기체를 마시거나 냄새 맡는 방법으로 확인하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "rsc-gases-v1",
    "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ④",
   "title": "조사·관찰·계획을 나누어요",
   "blocks": [
    {
     "type": "text",
     "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w067",
      "c22-s42-u03-w068",
      "c22-s42-u03-w069",
      "c22-s42-u03-w070"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "자료의 출처와 내 실제 행동을 구별해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "rsc-gases-v1",
    "text": "자료 카드: 왕립화학회(RSC) 산소·질소 원소 자료를 바탕으로 정리했어요. 산소와 질소는 보통의 기체 상태에서 색이 없어요. 산소는 호흡에 필요하고 다른 물질의 연소를 도와요. 질소는 다른 물질과 쉽게 반응하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 공기에는 부피로 질소가 약78%, 산소가 약21% 들어 있고 다른 기체도 있어요. 기체를 직접 마시거나 냄새 맡아 확인하지 않아요."
   }
  },
  {
   "section": "생각 넓히기 ④ · 이야기",
   "title": "공통점 하나가 전부일까요?",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w071"
     ]
    },
    {
     "type": "field",
     "title": "내 말로 설명하고 고치기",
     "hint": "자료 카드의 성질과 쓰임을 한 쌍씩 연결해 설명해요. 실제로 의견을 듣지 않았다면 예상 의견이라고 표시해요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "기관 자료를 실제 기체 시험으로 바꾸어 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ④ · 그림",
   "title": "출처가 있는 비교 카드를 만들어요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w072"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "공통점과 차이점이 함께 보여야 해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "생각 넓히기 ⑤",
   "title": "한 곳만 고친 비교를 찾아요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w073",
      "c22-s42-u03-w074"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "바꾼 부분이 하나인지와 성공 기준을 확인해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "device-trials-v1",
    "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ⑤",
   "title": "조건·결과와 재시험을 구별해요",
   "blocks": [
    {
     "type": "text",
     "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
    },
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w075",
      "c22-s42-u03-w076",
      "c22-s42-u03-w077",
      "c22-s42-u03-w078"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "시험 횟수·성공 횟수·미실행을 구분해요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice",
   "sharedContext": {
    "id": "device-trials-v1",
    "text": "연습용 가상 장치 기록이에요. 손 펌프→관→얇은 주머니로 공기를 보내 가벼운 종이판을 일으켜요. 성공 기준은 같은 시작선의 종이판이 표시선까지 올라가는 것이에요. 가·나는 같은 종이·주머니·시작 상태·펌프 방법으로 시험했어요. 가: 수정 전5회 중3회 성공. 나: 연결부 한 곳만 밀봉한 뒤5회 중5회 성공. 다: 연결부를 밀봉하고 더 무거운 종이로 바꿔5회 중2회 성공. 라: 관 교체를 계획했지만 시험하지 않았어요. 실제 내 제작 결과가 아니에요."
   }
  },
  {
   "section": "생각 넓히기 ⑤ · 발표",
   "title": "해 본 범위만큼 설명해요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w079"
     ]
    },
    {
     "type": "field",
     "title": "실제로 만들 때의 점검",
     "hint": "교사와 안전한 재료·멈춤 기준을 정해요. 실제 제작·시험·재시험 각각의 상태와 달라진 점만 적어요.",
     "lines": 5,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "직접 만들거나 시험하지 않았다면 완료라고 표시하지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "practice"
  },
  {
   "section": "생각 넓히기 ⑤ · 그림",
   "title": "구조·근거·남은 질문을 담아요",
   "blocks": [
    {
     "type": "questions",
     "ids": [
      "c22-s42-u03-w080"
     ]
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "구조를 그린 것과 실제 작동한 것은 달라요."
    },
    {
     "title": "더 알아보기",
     "text": "조건이 달라지면 같은 결과도 다르게 해석할 수 있어요."
    },
    {
     "title": "내가 정리할 것",
     "text": "자료의 근거와 아직 모르는 점을 나누어 써요.",
     "write": 5
    }
   ],
   "lead": "",
   "kind": "draw-task"
  },
  {
   "section": "출처와 돌아보기",
   "title": "확인한 자료와 실제 수행을 나누어요",
   "blocks": [
    {
     "type": "diagram",
     "key": "sources"
    },
    {
     "type": "field",
     "title": "단원을 마치며",
     "hint": "처음 생각에서 고친 점, 자료로 확인한 점, 실제로 해 본 일과 아직 계획인 일을 나누어 써요.",
     "lines": 6,
     "draw": false
    }
   ],
   "rail": [
    {
     "title": "핵심 정리",
     "text": "내가 하지 않은 실험의 값을 내 측정값으로 쓰지 않아요."
    },
    {
     "title": "더 알아보기",
     "text": "부피가 줄어도 밀폐된 안의 공기 양이 사라지는 것은 아니에요."
    },
    {
     "title": "내가 정리할 것",
     "text": "바꾼 것 → 관찰한 것 → 그렇게 판단한 근거",
     "write": 3
    }
   ],
   "lead": "",
   "kind": "learn"
  },
  {
   "kind": "duplex-blank"
  }
 ]
};

export const learnerPriorWorkbook=withGasEditorial(baseWorkbook);
export const gasUpperPriorWorkbook=withLearnerExplanations(learnerPriorWorkbook);
export const workbook=withGasUpperScience(gasUpperPriorWorkbook);
