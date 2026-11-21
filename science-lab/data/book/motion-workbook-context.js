export const MOTION_CONTEXT_VERSION='20261116-motion-workbook-context';
// 문항 전체와 해당 쪽의 자료가 이전 원고와 같을 때만 검토한 문구를 적용한다.
const review={
 "patches": [
  {
   "previous": {
    "id": "c22-s61-u02-w044",
    "no": 44,
    "form": "written",
    "type": "T03",
    "topic": "시간 기록의 일관성",
    "prompt": "A는 앞부분이 출발선을 지날 때, B는 뒷부분이 출발선을 지날 때 시계를 시작했습니다. 끝낼 때는 둘 다 앞부분이 도착선을 지날 때 멈췄습니다. 어떻게 고쳐 비교할지 쓰세요.",
    "answer": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
    "explanation": "두 수레 모두 앞부분이 출발선을 지날 때부터 앞부분이 도착선을 지날 때까지 재는 것처럼, 같은 부분으로 시간을 재야 해요.",
    "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
    "requirements": [
     "기준 부분 차이 지적",
     "같은 부분으로 시작/끝 정하기",
     "새 측정으로 비교하고 옛값 보존"
    ],
    "lines": 8,
    "criteria": "기준 부분 차이 지적 / 같은 부분으로 시작/끝 정하기 / 새 측정으로 비교하고 옛값 보존",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
     "required": [
      "기준 부분 차이 지적",
      "같은 부분으로 시작/끝 정하기",
      "새 측정으로 비교하고 옛값 보존"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "criteria": "기준 부분이 달라 측정 구간도 달라질 수 있음을 설명한다. / 같은 부분이 출발선과 도착선을 지날 때를 기준으로 정한다. / 같은 구간을 다시 재어 걸린 시간을 비교한다.",
    "requirements": [
     "기준 부분이 달라 측정 구간도 달라질 수 있음을 설명한다.",
     "같은 부분이 출발선과 도착선을 지날 때를 기준으로 정한다.",
     "같은 구간을 다시 재어 걸린 시간을 비교한다."
    ],
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
     "required": [
      "기준 부분이 달라 측정 구간도 달라질 수 있음을 설명한다.",
      "같은 부분이 출발선과 도착선을 지날 때를 기준으로 정한다.",
      "같은 구간을 다시 재어 걸린 시간을 비교한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u02-w047",
    "no": 47,
    "form": "written",
    "type": "T03",
    "topic": "다른 거리의 함정",
    "prompt": "한 길을 한 방향으로 가는 4m를 2초에, 나는 12m를 3초에 갔습니다. “2초가 짧으니 가가 빠르다”는 설명을 고쳐 보세요.",
    "answer": "이동 거리가 달라 시간만 비교하면 안 돼요. 가는 4÷2=2m/s, 나는 12÷3=4m/s라서 이 조건에서는 나가 더 빨라요.",
    "explanation": "같은 거리라는 조건이 없으면 거리와 시간을 함께 비교해요.",
    "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
    "model": {
     "kind": "two-ratios",
     "distance": [
      4,
      12
     ],
     "time": [
      2,
      3
     ],
     "rates": [
      2,
      4
     ]
    },
    "requirements": [
     "거리 차이 지적",
     "2m/s와 4m/s 검산",
     "나가 더 빠름과 조건 한정"
    ],
    "lines": 8,
    "criteria": "거리 차이 지적 / 2m/s와 4m/s 검산 / 나가 더 빠름과 조건 한정",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "dataProvenance": "author-created-practice-data-not-learner-measurement",
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "이동 거리가 달라 시간만 비교하면 안 돼요. 가는 4÷2=2m/s, 나는 12÷3=4m/s라서 이 조건에서는 나가 더 빨라요.",
     "required": [
      "거리 차이 지적",
      "2m/s와 4m/s 검산",
      "나가 더 빠름과 조건 한정"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "prompt": "두 수레가 한 길을 한 방향으로 움직였어요. 수레 가는 4m를 2초에, 수레 나는 12m를 3초에 갔어요. “2초가 짧으니 수레 가가 더 빠르다”는 설명을 고쳐 보세요."
   }
  },
  {
   "previous": {
    "id": "c22-s61-u02-w048",
    "no": 48,
    "form": "draw",
    "type": "T03",
    "topic": "같은 거리 측정 계획도",
    "prompt": "안전한 실내에서 수레 두 대가 같은 구간을 가는 시간을 재는 배치를 그리세요. 시작/끝선·같은 기준 부분·측정자의 위치를 표시하세요.",
    "answer": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
    "explanation": "두 수레가 같은 출발선과 도착선 사이를 가도록 그려요. 수레 앞부분처럼 시간을 잴 때 기준으로 삼을 부분과, 이동하는 길 밖에 선 측정자의 위치도 표시해요.",
    "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
    "requirements": [
     "같은 출발/도착 구간",
     "같은 수레 기준 부분 표시",
     "경로를 비킨 측정자 위치와 계획 표시"
    ],
    "drawing": "large",
    "criteria": "같은 출발/도착 구간 / 같은 수레 기준 부분 표시 / 경로를 비킨 측정자 위치와 계획 표시",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "responseContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
     "required": [
      "같은 출발/도착 구간",
      "같은 수레 기준 부분 표시",
      "경로를 비킨 측정자 위치와 계획 표시"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "criteria": "같은 출발선과 도착선 사이의 구간을 나타낸다. / 시간을 잴 수레의 같은 기준 부분을 표시한다. / 측정자가 수레의 이동 경로 밖에 있도록 표시한다.",
    "requirements": [
     "같은 출발선과 도착선 사이의 구간을 나타낸다.",
     "시간을 잴 수레의 같은 기준 부분을 표시한다.",
     "측정자가 수레의 이동 경로 밖에 있도록 표시한다."
    ],
    "responseContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
     "required": [
      "같은 출발선과 도착선 사이의 구간을 나타낸다.",
      "시간을 잴 수레의 같은 기준 부분을 표시한다.",
      "측정자가 수레의 이동 경로 밖에 있도록 표시한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u02-w064",
    "no": 64,
    "form": "draw",
    "type": "T04",
    "topic": "거리 비교 기록표",
    "prompt": "두 수레가 같은 시간 동안 간 거리를 3회 재려고 합니다. 수레 이름·같은 시간·회차·거리와 단위를 남길 빈 표를 그리세요.",
    "answer": "A와 B, 1~3회를 적을 칸을 나누어요. 관찰 시간과 이동 거리, 단위를 적고, 측정 조건과 잘 보지 못한 점을 적을 자리도 만들어요.",
    "explanation": "수레 이름과 1~3회, 같은 관찰 시간, 이동 거리와 단위를 적을 칸이 필요해요. 아직 재지 않았으므로 결과를 적을 칸은 비워 두어요.",
    "misconception": "같은 시간에 이동 거리가 길수록 빨라요.",
    "requirements": [
     "A/B와 1~3회 구분",
     "같은 시간과 거리 단위",
     "조건/불분명과 측정 전 빈칸"
    ],
    "drawing": "large",
    "criteria": "A/B와 1~3회 구분 / 같은 시간과 거리 단위 / 조건/불분명과 측정 전 빈칸",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "responseContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "A와 B, 1~3회를 적을 칸을 나누어요. 관찰 시간과 이동 거리, 단위를 적고, 측정 조건과 잘 보지 못한 점을 적을 자리도 만들어요.",
     "required": [
      "A/B와 1~3회 구분",
      "같은 시간과 거리 단위",
      "조건/불분명과 측정 전 빈칸"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "criteria": "두 수레의 이름과 1~3회 측정 칸을 구분한다. / 같은 관찰 시간과 이동 거리의 단위를 적을 곳을 마련한다. / 아직 재지 않은 거리 칸은 비워 둔다.",
    "requirements": [
     "두 수레의 이름과 1~3회 측정 칸을 구분한다.",
     "같은 관찰 시간과 이동 거리의 단위를 적을 곳을 마련한다.",
     "아직 재지 않은 거리 칸은 비워 둔다."
    ],
    "responseContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "A와 B, 1~3회를 적을 칸을 나누어요. 관찰 시간과 이동 거리, 단위를 적고, 측정 조건과 잘 보지 못한 점을 적을 자리도 만들어요.",
     "required": [
      "두 수레의 이름과 1~3회 측정 칸을 구분한다.",
      "같은 관찰 시간과 이동 거리의 단위를 적을 곳을 마련한다.",
      "아직 재지 않은 거리 칸은 비워 둔다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u02-w079",
    "no": 79,
    "form": "written",
    "type": "T07",
    "topic": "수치와 단위를 넣어 설명하기",
    "prompt": "한 길을 한 방향으로 A는 9m를 3초에, B는 8m를 4초에 갔어요. “A가 더 빠르다”는 설명에 속력과 단위를 넣어 까닭을 설명하세요.",
    "answer": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
    "explanation": "A는 9÷3=3m/s, B는 8÷4=2m/s예요. 어느 수레가 더 빠른지 쓸 때 두 속력과 단위를 함께 쓰면 비교한 까닭이 분명해져요.",
    "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
    "model": {
     "kind": "two-ratios",
     "distance": [
      9,
      8
     ],
     "time": [
      3,
      4
     ],
     "values": [
      3,
      2
     ]
    },
    "requirements": [
     "A3m/s와 B2m/s",
     "A가 빠름",
     "제시 구간/한 방향과 같은 단위 명시"
    ],
    "lines": 8,
    "criteria": "A3m/s와 B2m/s / A가 빠름 / 제시 구간/한 방향과 같은 단위 명시",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "dataProvenance": "author-created-practice-data-not-learner-measurement",
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
     "required": [
      "A3m/s와 B2m/s",
      "A가 빠름",
      "제시 구간/한 방향과 같은 단위 명시"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "criteria": "A의 속력 3m/s와 B의 속력 2m/s를 나타낸다. / 같은 단위의 속력을 비교하여 A가 더 빠른 까닭을 설명한다.",
    "requirements": [
     "A의 속력 3m/s와 B의 속력 2m/s를 나타낸다.",
     "같은 단위의 속력을 비교하여 A가 더 빠른 까닭을 설명한다."
    ],
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
     "required": [
      "A의 속력 3m/s와 B의 속력 2m/s를 나타낸다.",
      "같은 단위의 속력을 비교하여 A가 더 빠른 까닭을 설명한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u02-w086",
    "no": 86,
    "form": "written",
    "type": "T12",
    "topic": "우리 모둠의 측정 계획",
    "prompt": "안전한 실내에서 작은 수레가 한 길을 한 방향으로 이동할 때의 속력을 재는 계획을 쓰세요. 아직 재지 않은 숫자를 결과로 쓰지는 마세요.",
    "answer": "선생님이 준비한 평평한 실내 길에 출발선과 도착선을 표시해요. 수레 앞부분이 각 선을 지날 때를 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에 서서 같은 방법으로 세 번 재요.",
    "explanation": "어디부터 어디까지 재는지, 어떤 도구를 쓰는지 정해요. 수레의 같은 부분을 기준으로 거리와 시간을 재고 단위를 적어요. 관찰자는 길 밖에서 보고 같은 방법으로 여러 번 재요.",
    "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
    "requirements": [
     "비운 평평한 실내와 길 밖 관찰",
     "출발/도착과 같은 기준 부분",
     "줄자/초시계 등 도구와 거리/시간 단위",
     "3회 반복과 불분명/미측정 보존"
    ],
    "lines": 8,
    "criteria": "비운 평평한 실내와 길 밖 관찰 / 출발/도착과 같은 기준 부분 / 줄자/초시계 등 도구와 거리/시간 단위 / 3회 반복과 불분명/미측정 보존",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "선생님이 준비한 평평한 실내 길에 출발선과 도착선을 표시해요. 수레 앞부분이 각 선을 지날 때를 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에 서서 같은 방법으로 세 번 재요.",
     "required": [
      "비운 평평한 실내와 길 밖 관찰",
      "출발/도착과 같은 기준 부분",
      "줄자/초시계 등 도구와 거리/시간 단위",
      "3회 반복과 불분명/미측정 보존"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "criteria": "물건을 치운 평평한 실내 길과 이동 경로 밖의 관찰 위치를 정한다. / 출발선·도착선과 시간을 잴 수레의 같은 기준 부분을 정한다. / 거리와 시간을 잴 도구 및 기록할 단위를 정한다. / 같은 방법으로 반복해 잴 계획을 세우고 아직 재지 않은 값을 결과로 쓰지 않는다.",
    "requirements": [
     "물건을 치운 평평한 실내 길과 이동 경로 밖의 관찰 위치를 정한다.",
     "출발선·도착선과 시간을 잴 수레의 같은 기준 부분을 정한다.",
     "거리와 시간을 잴 도구 및 기록할 단위를 정한다.",
     "같은 방법으로 반복해 잴 계획을 세우고 아직 재지 않은 값을 결과로 쓰지 않는다."
    ],
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "선생님이 준비한 평평한 실내 길에 출발선과 도착선을 표시해요. 수레 앞부분이 각 선을 지날 때를 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에 서서 같은 방법으로 세 번 재요.",
     "required": [
      "물건을 치운 평평한 실내 길과 이동 경로 밖의 관찰 위치를 정한다.",
      "출발선·도착선과 시간을 잴 수레의 같은 기준 부분을 정한다.",
      "거리와 시간을 잴 도구 및 기록할 단위를 정한다.",
      "같은 방법으로 반복해 잴 계획을 세우고 아직 재지 않은 값을 결과로 쓰지 않는다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u02-w091",
    "no": 91,
    "form": "written",
    "type": "T12",
    "topic": "기기 눈금과 표현",
    "prompt": "0.1초 단위로 읽는 초시계에 2.3초가 보였어요. 친구가 2.30000초라고 쓰고 더 정확히 쟀다고 했어요. 기록과 설명을 고쳐 보세요.",
    "answer": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
    "explanation": "초시계가 보여 준 2.3초를 그대로 적어요. 뒤에 0을 더 붙여도 더 자세히 잰 값이 되는 것은 아니에요. 시계를 누른 순간의 차이도 있으므로 같은 방법으로 여러 번 재어요.",
    "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
    "requirements": [
     "실제 표시2.3초 보존",
     "0 추가만으로 정밀해지지 않음",
     "시작/정지의 차이와 반복 필요"
    ],
    "lines": 8,
    "criteria": "실제 표시2.3초 보존 / 0 추가만으로 정밀해지지 않음 / 시작/정지의 차이와 반복 필요",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-02",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
     "required": [
      "실제 표시2.3초 보존",
      "0 추가만으로 정밀해지지 않음",
      "시작/정지의 차이와 반복 필요"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "criteria": "초시계에 표시된 2.3초로 기록한다. / 뒤에 0을 더 쓴 것만으로 더 정확히 측정한 것은 아님을 설명한다.",
    "requirements": [
     "초시계에 표시된 2.3초로 기록한다.",
     "뒤에 0을 더 쓴 것만으로 더 정확히 측정한 것은 아님을 설명한다."
    ],
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
     "required": [
      "초시계에 표시된 2.3초로 기록한다.",
      "뒤에 0을 더 쓴 것만으로 더 정확히 측정한 것은 아님을 설명한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  },
  {
   "previous": {
    "id": "c22-s61-u02-w111",
    "no": 111,
    "form": "written",
    "type": "T10",
    "topic": "모형에서 실제로 확대하기",
    "prompt": "작은 수레가 멈추기까지 간 거리로 실제 자동차가 멈추는 거리를 알 수 있다고 했어요. 두 결과를 같다고 말하기 어려운 까닭과 모형에서 알 수 있는 점을 쓰세요.",
    "answer": "수레와 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 달라요. 자동차에는 운전자가 반응하는 데 걸린 시간도 있어 수레의 거리를 그대로 쓸 수 없어요. 모형에서는 사용한 조건에서 본 움직임까지만 설명해요.",
    "explanation": "수레 모형과 자동차는 여러 조건이 달라요. 모형에서 멈춘 거리는 그 모형의 결과이며, 실제 자동차도 같은 거리에서 멈춘다고 말할 수는 없어요.",
    "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
    "requirements": [
     "실제 차와 다른 두 가지 이상 조건",
     "자동차 거리로 직접 환산/보장 보류",
     "사용한 모형 조건과 관찰 범위 명시"
    ],
    "lines": 8,
    "criteria": "실제 차와 다른 두 가지 이상 조건 / 자동차 거리로 직접 환산/보장 보류 / 사용한 모형 조건과 관찰 범위 명시",
    "origin": "independently-authored-current-curriculum",
    "status": "authored-draft",
    "standard": "6과10-03",
    "sourceRef": {
     "type": "authored",
     "curriculum": "2022 개정",
     "course": "6-1",
     "unit": "Ⅱ. 물체의 운동",
     "originalExam": false
    },
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레와 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 달라요. 자동차에는 운전자가 반응하는 데 걸린 시간도 있어 수레의 거리를 그대로 쓸 수 없어요. 모형에서는 사용한 조건에서 본 움직임까지만 설명해요.",
     "required": [
      "실제 차와 다른 두 가지 이상 조건",
      "자동차 거리로 직접 환산/보장 보류",
      "사용한 모형 조건과 관찰 범위 명시"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "fields": {
    "criteria": "수레와 자동차에서 결과에 영향을 줄 수 있는 조건의 차이를 설명한다. / 수레가 멈춘 거리를 실제 자동차의 정지 거리로 그대로 쓸 수 없음을 밝힌다. / 모형에서 사용한 조건과 관찰한 범위 안에서 알 수 있는 점을 쓴다.",
    "requirements": [
     "수레와 자동차에서 결과에 영향을 줄 수 있는 조건의 차이를 설명한다.",
     "수레가 멈춘 거리를 실제 자동차의 정지 거리로 그대로 쓸 수 없음을 밝힌다.",
     "모형에서 사용한 조건과 관찰한 범위 안에서 알 수 있는 점을 쓴다."
    ],
    "responseContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레와 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 달라요. 자동차에는 운전자가 반응하는 데 걸린 시간도 있어 수레의 거리를 그대로 쓸 수 없어요. 모형에서는 사용한 조건에서 본 움직임까지만 설명해요.",
     "required": [
      "수레와 자동차에서 결과에 영향을 줄 수 있는 조건의 차이를 설명한다.",
      "수레가 멈춘 거리를 실제 자동차의 정지 거리로 그대로 쓸 수 없음을 밝힌다.",
      "모형에서 사용한 조건과 관찰한 범위 안에서 알 수 있는 점을 쓴다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  }
 ],
 "directions": [
  {
   "previous": {
    "section": "운동과 위치 표현 · 4~5",
    "title": "무엇을 기준으로 비교할까요?",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w004",
       "c22-s61-u02-w005"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "물체의 위치를 비교할 때 같은 기준을 사용해요."
     },
     {
      "title": "더 알아보기",
      "text": "운동을 영상으로 분석할 때에는 고정된 배경이나 눈금을 함께 찍으면 위치를 비교하기 쉬워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "두 사진에서 같은 기준으로 삼을 부분을 찾아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w004",
     "no": 4,
     "form": "multi",
     "type": "T01",
     "topic": "관찰할 기준",
     "prompt": "운동하는지 비교할 때 필요한 방법을 모두 고르세요.",
     "answer": "②, ③, ⑤",
     "explanation": "같은 기준 장소에서 시간 순서를 정하고 위치를 비교해야 해요. 물체의 이름이나 색은 위치 변화의 근거가 아니에요.",
     "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
     "choices": [
      "큰 물체를 무조건 움직였다고 정한다.",
      "같은 기준에서 위치를 비교한다.",
      "같은 벽의 눈금을 기준으로 삼는다.",
      "색이 진한 물체를 움직였다고 정한다.",
      "처음과 나중의 시각을 구분한다."
     ],
     "key": [
      1,
      2,
      4
     ],
     "criteria": "「같은 기준에서 위치를 비교한다. / 같은 벽의 눈금을 기준으로 삼는다. / 처음과 나중의 시각을 구분한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       1,
       2,
       4
      ],
      "orderSensitive": false,
      "extraSelectionAllowed": false
     }
    },
    {
     "id": "c22-s61-u02-w005",
     "no": 5,
     "form": "match",
     "type": "T01",
     "topic": "확인한 것과 더 필요한 것",
     "prompt": "보기: ㄱ 위치가 달라진 것을 알 수 있음 / ㄴ 자료가 더 필요함",
     "answer": "(1) ㄱ (2) ㄴ (3) ㄴ",
     "explanation": "같은 기준으로 서로 다른 시각의 위치를 비교해야 해요. 사진 한 장이나 색이 달라졌다는 말만으로 움직였는지 알 수는 없어요.",
     "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
     "parts": [
      "(1) 같은 벽 기준으로 0초에는 1눈금, 2초에는 3눈금에 있었다. [ ]",
      "(2) 수레 사진 한 장만 있다. [ ]",
      "(3) 공의 색이 달라졌다는 말만 있다. [ ]"
     ],
     "answerPerPart": true,
     "criteria": "「(1) ㄱ (2) ㄴ (3) ㄴ」 또는 명시한 동등 표현으로 답한다. 서로 다른 시각의 위치 비교가 있어야 해요. 한 사진이나 색 변화만으로 이동 여부를 확정할 수 없어요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "ordered-parts",
      "answers": [
       "ㄱ",
       "ㄴ",
       "ㄴ"
      ],
      "orderSensitive": true,
      "answerPerPart": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "두 사진에서 같은 기준으로 삼을 부분을 찾아요.",
     "value": "고정된 벽을 기준으로 두 시각의 위치를 비교하면 움직였는지 알 수 있는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "운동과 위치 표현 · 8~10",
    "title": "같은 기준에서 비교해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w008",
       "c22-s61-u02-w009",
       "c22-s61-u02-w010"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "처음과 나중의 위치는 같은 눈금으로 나타내요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 측정값을 그래프로 옮길 때 축의 눈금 간격을 일정하게 정해요. 간격이 다르면 변화가 실제와 다르게 보일 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "눈금이 달라진 두 그림을 어떻게 고칠까요?",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w008",
     "no": 8,
     "form": "blank",
     "type": "T01",
     "topic": "기준의 일관성",
     "prompt": "두 시각의 위치를 비교할 때에는 [ ] 기준 장소를 사용해요.",
     "answer": "같은",
     "explanation": "기준이 달라지면 사진 속 변화의 원인을 구별하기 어려워요.",
     "misconception": "처음/나중 시각과 같은 기준 위치를 함께 확인해요.",
     "accepted": [
      "동일한"
     ],
     "criteria": "「같은」 또는 명시한 동등 표현으로 답한다. 기준이 달라지면 사진 속 변화의 원인을 구별하기 어려워요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "같은",
       "동일한"
      ],
      "orderSensitive": true
     }
    },
    {
     "id": "c22-s61-u02-w009",
     "no": 9,
     "form": "short",
     "type": "T11",
     "topic": "한 점의 좌표",
     "prompt": "그림의 점 P를 (가로 눈금, 세로 눈금)으로 나타내세요.",
     "answer": "(3, 2)",
     "explanation": "가로 3눈금과 세로 2눈금이 만나는 곳이므로 (3, 2)예요. 두 수의 순서를 바꾸지 않아요.",
     "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
     "plot": {
      "range": 5,
      "points": [
       {
        "label": "P",
        "x": 3,
        "y": 2,
        "shape": "circle"
       }
      ]
     },
     "model": {
      "kind": "point-coordinate",
      "label": "P",
      "x": 3,
      "y": 2
     },
     "criteria": "「(3, 2)」 또는 명시한 동등 표현으로 답한다. 가로 3눈금과 세로 2눈금이 만나는 곳이므로 (3, 2)예요. 두 수의 순서를 바꾸지 않아요.",
     "figure": "motion-question-9",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "dataProvenance": "author-created-practice-data-not-learner-measurement",
     "responseContract": {
      "kind": "coordinate-pair",
      "values": [
       3,
       2
      ],
      "orderSensitive": true,
      "separatorRequired": true,
      "accepted": [
       "(3, 2)",
       "3,2",
       "가로 3, 세로 2"
      ]
     }
    },
    {
     "id": "c22-s61-u02-w010",
     "no": 10,
     "form": "blank",
     "type": "T11",
     "topic": "좌표를 읽는 순서",
     "prompt": "이 교재의 (가로 눈금, 세로 눈금) 표현에서 먼저 쓰는 것은 [ ] 눈금이에요.",
     "answer": "가로",
     "explanation": "먼저 가로 위치를 쓰고 다음에 세로 위치를 써요. 두 수를 늘 같은 순서로 써야 어느 점인지 바르게 읽을 수 있어요.",
     "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
     "criteria": "「가로」 또는 명시한 동등 표현으로 답한다. 먼저 가로 위치, 다음에 세로 위치를 써서 같은 점을 일관되게 표현해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "가로"
      ],
      "orderSensitive": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "눈금이 달라진 두 그림을 어떻게 고칠까요?",
     "value": "P의 가로와 세로 위치를 읽고, 처음과 나중 위치를 같은 눈금으로 표시해야 하는 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "운동과 위치 표현 · 16",
    "title": "두 위치를 그림으로 나타내요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w016"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "두 위치를 한 좌표 평면에 표시하면 변화를 비교할 수 있어요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 위치 변화의 크기와 방향을 함께 나타내는 변위를 배워요. 실제로 지나간 길의 길이와 구별해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "처음과 나중 점에 시각 이름표를 붙여요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w016",
     "no": 16,
     "form": "draw",
     "type": "T11",
     "topic": "처음과 나중을 그리기",
     "prompt": "가로·세로 눈금이 0~5인 좌표 평면을 그리고 처음 A(1, 2), 나중 B(4, 3)를 표시하세요. 이름표와 좌표를 읽는 순서도 쓰세요.",
     "answer": "가로축과 세로축에 0~5 눈금을 표시하고 A(1, 2)는 처음, B(4, 3)는 나중이라고 써요. 좌표는 가로의 수를 먼저, 세로의 수를 나중에 읽는다고 적어요.",
     "explanation": "A는 가로 1·세로 2, B는 가로 4·세로 3에 표시해요. 좌표는 가로의 수, 세로의 수 순서로 읽어요. 처음과 나중을 구별하고 두 점의 거리는 계산하지 않아요.",
     "misconception": "가로 눈금을 먼저, 세로 눈금을 나중에 읽으며 두 점 사이 거리는 계산하지 않아요.",
     "requirements": [
      "가로/세로와 0~5눈금",
      "A(1, 2), B(4, 3)의 위치",
      "처음/나중 및 가로 먼저라는 이름표"
     ],
     "drawing": "large",
     "criteria": "가로/세로와 0~5눈금 / A(1, 2), B(4, 3)의 위치 / 처음/나중 및 가로 먼저라는 이름표",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-01",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "teacher-drawing",
      "teacherRequired": true,
      "sample": "가로축과 세로축에 0~5 눈금을 표시하고 A(1, 2)는 처음, B(4, 3)는 나중이라고 써요. 좌표는 가로의 수를 먼저, 세로의 수를 나중에 읽는다고 적어요.",
      "required": [
       "가로/세로와 0~5눈금",
       "A(1, 2), B(4, 3)의 위치",
       "처음/나중 및 가로 먼저라는 이름표"
      ],
      "actualPerformanceMustNotBeInferred": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "처음과 나중 점에 시각 이름표를 붙여요.",
     "value": "처음 위치 A와 나중 위치 B를 표시하고, 가로와 세로의 수를 차례로 읽어요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 거리의 시간 비교 · 33~35",
    "title": "같은 거리를 누가 더 빨리 갔나요?",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w033",
       "c22-s61-u02-w034",
       "c22-s61-u02-w035"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "같은 거리에서 가장 짧은 시간이 가장 빠른 기록이에요."
     },
     {
      "title": "더 알아보기",
      "text": "스포츠 기록에는 시간뿐 아니라 코스 길이와 경기 조건도 중요해요. 서로 다른 종목의 시간만으로 빠르기를 정하지 않아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "가장 빠른 기록과 가장 느린 기록을 찾아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w033",
     "no": 33,
     "form": "choice",
     "type": "T03",
     "topic": "같은 거리의 빠르기",
     "prompt": "같은 12m를 걸은 기록입니다. 가장 빠른 사람을 고르세요.",
     "answer": "⑤ 수아",
     "explanation": "같은 거리에서는 시간이 짧을수록 빨라요. 수아의 6초가 가장 짧아요.",
     "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
     "table": {
      "heads": [
       "이름",
       "걸린 시간(초)"
      ],
      "rows": [
       [
        "민준",
        8
       ],
       [
        "수아",
        6
       ],
       [
        "다온",
        10
       ]
      ]
     },
     "model": {
      "kind": "min-name-choice",
      "names": [
       "민준",
       "수아",
       "다온"
      ],
      "values": [
       8,
       6,
       10
      ]
     },
     "choices": [
      "다온",
      "모두 같음",
      "거리로만 비교 가능",
      "민준",
      "수아"
     ],
     "key": 4,
     "criteria": "제시한 조건에서 「수아」을 고른다. 같은 거리에서는 시간이 짧을수록 빨라요. 수아의 6초가 가장 짧아요.",
     "figure": "motion-question-33",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "dataProvenance": "author-created-practice-data-not-learner-measurement",
     "responseContract": {
      "kind": "single-choice",
      "answer": 4
     }
    },
    {
     "id": "c22-s61-u02-w034",
     "no": 34,
     "form": "blank",
     "type": "T03",
     "topic": "짧은 시간",
     "prompt": "같은 거리를 이동했을 때 걸린 시간이 [ ]수록 더 빨라요.",
     "answer": "짧을",
     "explanation": "같은 거리를 더 적은 시간에 가면 단위 시간 동안 더 멀리 간 셈이에요.",
     "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
     "accepted": [
      "짧을수록",
      "짧은",
      "짧아질"
     ],
     "criteria": "「짧을」 또는 명시한 동등 표현으로 답한다. 같은 거리를 더 적은 시간에 가면 단위 시간 동안 더 멀리 간 셈이에요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "짧을",
       "짧을수록",
       "짧은",
       "짧아질"
      ],
      "orderSensitive": true
     }
    },
    {
     "id": "c22-s61-u02-w035",
     "no": 35,
     "form": "short",
     "type": "T03",
     "topic": "가장 느린 수레",
     "prompt": "같은 8m를 간 수레의 기록입니다. 가장 느린 수레를 쓰세요.",
     "answer": "나",
     "explanation": "같은 거리에서 가장 긴 8초가 걸린 나가 가장 느려요.",
     "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
     "table": {
      "heads": [
       "수레",
       "걸린 시간(초)"
      ],
      "rows": [
       [
        "가",
        4
       ],
       [
        "나",
        8
       ],
       [
        "다",
        5
       ]
      ]
     },
     "model": {
      "kind": "max-name",
      "names": [
       "가",
       "나",
       "다"
      ],
      "values": [
       4,
       8,
       5
      ]
     },
     "criteria": "「나」 또는 명시한 동등 표현으로 답한다. 같은 거리에서 가장 긴 8초가 걸린 나가 가장 느려요.",
     "figure": "motion-question-35",
     "origin": "independently-authored-current-curriculum",
     "accepted": [
      "수레 나",
      "나 수레"
     ],
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "dataProvenance": "author-created-practice-data-not-learner-measurement",
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "나",
       "수레 나",
       "나 수레"
      ],
      "orderSensitive": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "가장 빠른 기록과 가장 느린 기록을 찾아요.",
     "value": "33번 표에서 가장 빠른 기록을, 35번 표에서 가장 느린 기록을 찾고 같은 이동 거리인지 확인해요."
    }
   ]
  },
  {
   "previous": {
    "section": "같은 거리의 시간 비교 · 40~42",
    "title": "걸린 시간은 어떻게 구할까요?",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w040",
       "c22-s61-u02-w041",
       "c22-s61-u02-w042"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "걸린 시간은 출발 시각부터 도착 시각까지의 시간이에요."
     },
     {
      "title": "더 알아보기",
      "text": "영상의 재생 시각과 촬영 때 실제로 흐른 시간은 다를 수 있어요. 느린 화면을 분석할 때에는 촬영 정보를 확인해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "출발과 도착 시각으로 걸린 시간을 구해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w040",
     "no": 40,
     "form": "blank",
     "type": "T03",
     "topic": "시간의 측정 구간",
     "prompt": "걸린 시간은 도착 시각에서 [ ] 시각을 뺀 값이에요.",
     "answer": "출발",
     "explanation": "도착 시각에서 출발 시각을 빼면 걸린 시간을 알 수 있어요. 두 시각을 같은 시계와 단위로 읽어야 해요.",
     "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
     "criteria": "「출발」 또는 명시한 동등 표현으로 답한다. 각자의 출발과 도착을 같은 시간 기준으로 읽어 차이를 구해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "출발"
      ],
      "orderSensitive": true
     }
    },
    {
     "id": "c22-s61-u02-w041",
     "no": 41,
     "form": "short",
     "type": "T03",
     "topic": "서로 같은 빠르기",
     "prompt": "가와 나는 같은 6m를 각각 3초에 갔습니다. 두 수레의 빠르기는 같은가요?",
     "answer": "같다",
     "explanation": "거리와 시간이 각각 같으므로 속력도 같아요. 움직이는 모든 순간의 빠르기까지 같았다는 뜻은 아니에요.",
     "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
     "accepted": [
      "같음",
      "같습니다",
      "빠르기가 같다",
      "네",
      "예",
      "같아요",
      "속력이 같다"
     ],
     "criteria": "「같다」 또는 명시한 동등 표현으로 답한다. 거리와 시간이 각각 같으므로 속력도 같아요. 움직이는 모든 순간의 빠르기까지 같았다는 뜻은 아니에요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "같다",
       "같음",
       "같습니다",
       "빠르기가 같다",
       "네",
       "예",
       "같아요",
       "속력이 같다"
      ],
      "orderSensitive": true
     }
    },
    {
     "id": "c22-s61-u02-w042",
     "no": 42,
     "form": "multi",
     "type": "T03",
     "topic": "기록으로 타당하게 말하기",
     "prompt": "세 로봇이 같은 18m를 갔어요. 알맞은 설명을 모두 고르세요.",
     "answer": "①, ②, ③",
     "explanation": "같은 18m를 가는 데 나는 6초, 가는 9초, 다는 12초가 걸렸어요. 시간이 짧을수록 빠르므로 나, 가, 다의 순서예요.",
     "misconception": "같은 거리에서 걸린 시간이 짧을수록 빨라요.",
     "table": {
      "heads": [
       "로봇",
       "걸린 시간(초)"
      ],
      "rows": [
       [
        "가",
        9
       ],
       [
        "나",
        6
       ],
       [
        "다",
        12
       ]
      ]
     },
     "choices": [
      "이 조건에서 나는 가보다 빠르다.",
      "나가 가장 빠르다.",
      "다가 가장 느리다.",
      "가는 나보다 빠르다.",
      "로봇 나는 어떤 상황에서도 가장 빠르다."
     ],
     "key": [
      0,
      1,
      2
     ],
     "criteria": "「이 조건에서 나는 가보다 빠르다. / 나가 가장 빠르다. / 다가 가장 느리다.」을 모두 고르고 다른 보기를 넣지 않는다.",
     "figure": "motion-question-42",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "dataProvenance": "author-created-practice-data-not-learner-measurement",
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       1,
       2
      ],
      "orderSensitive": false,
      "extraSelectionAllowed": false
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "출발과 도착 시각으로 걸린 시간을 구해요.",
     "value": "42번에서 같은 18m를 간 로봇 중 가장 짧은 시간이 걸린 로봇을 찾고, 더 빠른 까닭을 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "속력의 의미와 단위 · 68~69",
    "title": "속력의 식은 무엇을 뜻할까요?",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w068",
       "c22-s61-u02-w069"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "거리를 시간으로 나눈 값은 같은 시간의 이동 거리를 비교하게 해 줘요."
     },
     {
      "title": "더 알아보기",
      "text": "물리량을 나눌 때에는 숫자뿐 아니라 단위도 함께 나누어요. 더 깊이 배우면 단위로 식이 나타내는 양을 점검해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "속력을 구할 때 무엇을 무엇으로 나누나요? 식에서 이동 거리와 걸린 시간이 각각 어디에 있는지 확인해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w068",
     "no": 68,
     "form": "multi",
     "type": "T05",
     "topic": "속력 계산의 뜻",
     "prompt": "한 길을 한 방향으로 이동한 속력에 관한 설명 중 알맞은 것을 모두 고르세요.",
     "answer": "②, ④, ⑤",
     "explanation": "이동 거리를 걸린 시간으로 나누고 단위를 함께 써요. m와 s로 구했다면 m/s로 나타내요. 이 값만으로 움직이는 동안 매 순간의 빠르기가 같았다고 할 수는 없어요.",
     "misconception": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누어요.",
     "choices": [
      "걸린 시간을 이동 거리로 나눈다.",
      "m와 s로 계산했다면 m/s로 쓴다.",
      "속력은 매 순간 반드시 같다.",
      "서로 비교할 때 단위를 확인한다.",
      "이동 거리를 걸린 시간으로 나눈다."
     ],
     "key": [
      1,
      3,
      4
     ],
     "criteria": "「m와 s로 계산했다면 m/s로 쓴다. / 서로 비교할 때 단위를 확인한다. / 이동 거리를 걸린 시간으로 나눈다.」을 모두 고르고 다른 보기를 넣지 않는다.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       1,
       3,
       4
      ],
      "orderSensitive": false,
      "extraSelectionAllowed": false
     }
    },
    {
     "id": "c22-s61-u02-w069",
     "no": 69,
     "form": "match",
     "type": "T06",
     "topic": "속력 단위 읽기",
     "prompt": "보기: ㄱ 1초에 이동한 거리 / ㄴ 1시간에 이동한 거리 / ㄷ 거리만 나타낸 양",
     "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
     "explanation": "m/s는 1초에 몇 m, km/h는 1시간에 몇 km를 이동한 셈인지 나타내는 속력 단위예요. m는 거리만 나타내는 단위예요.",
     "misconception": "거리와 기준 시간의 단위를 함께 읽어요.",
     "parts": [
      "(1) m/s [ ]",
      "(2) km/h [ ]",
      "(3) m [ ]"
     ],
     "answerPerPart": true,
     "criteria": "「(1) ㄱ (2) ㄴ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. m/s와 km/h에는 거리와 기준 시간이 함께 있어요. m에는 거리 단위만 있어 속력과 구별해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "ordered-parts",
      "answers": [
       "ㄱ",
       "ㄴ",
       "ㄷ"
      ],
      "orderSensitive": true,
      "answerPerPart": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "속력을 구할 때 무엇을 무엇으로 나누나요? 식에서 이동 거리와 걸린 시간이 각각 어디에 있는지 확인해요.",
     "value": "속력을 구하려면 무엇을 무엇으로 나누나요? m/s에서 m와 s가 각각 무엇의 단위인지 써요."
    }
   ]
  },
  {
   "previous": {
    "section": "속력의 의미와 단위 · 80",
    "title": "표와 그래프로 비교해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w080"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "표나 그래프에 이름과 단위를 써서 비교 결과를 나타내요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 그래프의 기울기로 운동의 특징을 읽어요. 축의 양과 단위를 확인한 뒤 기울기를 해석해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "속력이 같은 두 수레를 같은 높이로 나타내요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w080",
     "no": 80,
     "form": "draw",
     "type": "T07",
     "topic": "비교 자료로 표현하기",
     "prompt": "한 길을 한 방향으로 A는 6m를 3초에, B는 8m를 4초에 갔어요. 속력을 표나 막대그래프로 비교하세요. 이름과 단위, 속력을 구한 계산도 나타내세요.",
     "answer": "A는 6÷3=2m/s, B는 8÷4=2m/s예요. 표에는 거리와 시간, 속력과 단위를 적어요. 막대그래프에는 A와 B의 이름, 속력 단위 m/s를 쓰고 두 막대를 같은 높이로 그려요.",
     "explanation": "A는 6÷3=2m/s, B는 8÷4=2m/s이므로 속력이 같아요. 표에는 거리·시간·속력과 단위를 쓰고, 속력 막대그래프에서는 두 막대의 높이를 같게 나타내요.",
     "misconception": "다른 거리와 시간은 같은 단위 시간의 거리로 비교해요.",
     "model": {
      "kind": "two-ratios",
      "distance": [
       6,
       8
      ],
      "time": [
       3,
       4
      ],
      "values": [
       2,
       2
      ]
     },
     "requirements": [
      "A/B를 구별한 표 또는 막대그래프",
      "두 속력2m/s와 단위",
      "6÷3과8÷4의 근거"
     ],
     "drawing": "large",
     "criteria": "A/B를 구별한 표 또는 막대그래프 / 두 속력2m/s와 단위 / 6÷3과8÷4의 근거",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "dataProvenance": "author-created-practice-data-not-learner-measurement",
     "responseContract": {
      "kind": "teacher-drawing",
      "teacherRequired": true,
      "sample": "A는 6÷3=2m/s, B는 8÷4=2m/s예요. 표에는 거리와 시간, 속력과 단위를 적어요. 막대그래프에는 A와 B의 이름, 속력 단위 m/s를 쓰고 두 막대를 같은 높이로 그려요.",
      "required": [
       "A/B를 구별한 표 또는 막대그래프",
       "두 속력2m/s와 단위",
       "6÷3과8÷4의 근거"
      ],
      "actualPerformanceMustNotBeInferred": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "속력이 같은 두 수레를 같은 높이로 나타내요.",
     "value": "같은 단위를 써서 두 수레의 속력을 나타내요. 표에는 두 값을 나란히 쓰고, 막대그래프에서는 두 막대의 높이를 같게 해요."
    }
   ]
  },
  {
   "previous": {
    "section": "실제 측정과 반복 · 94~95",
    "title": "측정 순서를 정하고 비교해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w094",
       "c22-s61-u02-w095"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "장소와 기준을 정한 뒤 측정하고 같은 방법으로 반복해요."
     },
     {
      "title": "더 알아보기",
      "text": "실험의 재현성을 높이려면 다른 사람도 따라 할 수 있게 조건과 절차를 설명해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "측정 순서에서 빠뜨린 준비를 찾아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w094",
     "no": 94,
     "form": "order",
     "type": "T12",
     "topic": "실제 측정 순서",
     "prompt": "거리와 시간의 실제 측정 활동을 순서대로 쓰세요.",
     "answer": "ㄴ → ㄷ → ㄱ → ㄹ",
     "explanation": "장소와 도구, 시간을 재기 시작하고 끝낼 기준을 먼저 정해요. 거리와 시간을 재어 단위와 함께 적고, 같은 방법으로 여러 번 잰 기록을 비교해요.",
     "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
     "given": [
      "ㄱ 거리와 시간을 재어 단위와 잘 보지 못한 점을 적는다.",
      "ㄴ 안전한 장소와 출발선·도착선, 기준으로 삼을 수레 부분을 정한다.",
      "ㄷ 도구를 놓고 수레가 가는 길 밖에 관찰할 자리를 정한다.",
      "ㄹ 같은 방법으로 여러 번 재고 기록을 비교한다."
     ],
     "criteria": "「ㄴ → ㄷ → ㄱ → ㄹ」 또는 명시한 동등 표현으로 답한다. 안전과 규칙을 먼저 확인하고 실제 값을 읽어 기록해요. 반복한 뒤 결과와 조건을 비교해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "ordered-sequence",
      "sequence": [
       "ㄴ",
       "ㄷ",
       "ㄱ",
       "ㄹ"
      ],
      "orderSensitive": true
     }
    },
    {
     "id": "c22-s61-u02-w095",
     "no": 95,
     "form": "written",
     "type": "T03",
     "topic": "측정한 시간으로 빠르기 비교하기",
     "prompt": "두 수레가 같은 거리를 이동했어요. 한 수레는 2초, 다른 수레는 4초가 걸렸어요. 더 빠른 수레와 그렇게 생각한 까닭을 쓰세요.",
     "answer": "2초가 걸린 수레가 더 빨라요. 같은 거리를 이동하는 데 걸린 시간이 더 짧기 때문이에요.",
     "explanation": "같은 거리를 이동한 경우 걸린 시간이 짧을수록 더 빨라요.",
     "misconception": "같은 거리를 이동한 경우 걸린 시간이 짧을수록 더 빨라요.",
     "requirements": [
      "제공된 연습 자료임을 명시",
      "직접 계산과 실제 측정의 구별",
      "별도 실제 측정 또는 미측정 상태"
     ],
     "lines": 8,
     "criteria": "같은 거리를 이동한 경우 걸린 시간이 짧을수록 더 빨라요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "teacher-explanation",
      "teacherRequired": true,
      "sample": "2초가 걸린 수레가 더 빨라요. 같은 거리를 이동하는 데 걸린 시간이 더 짧기 때문이에요.",
      "required": [
       "같은 거리를 이동한 경우 걸린 시간이 짧을수록 더 빨라요."
      ],
      "actualPerformanceMustNotBeInferred": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "측정 순서에서 빠뜨린 준비를 찾아요.",
     "value": "측정 전에 장소와 기준을 정하는 까닭을 써요. 같은 거리를 간 두 기록은 걸린 시간으로 빠르기를 비교해요."
    }
   ]
  },
  {
   "previous": {
    "section": "속력과 안전한 생활 · 100~101",
    "title": "안전장치의 역할을 비교해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w100",
       "c22-s61-u02-w101"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "에어백은 안전띠와 함께 탑승자를 보호해요."
     },
     {
      "title": "더 알아보기",
      "text": "충돌 때 힘을 받는 시간이 달라지면 몸에 작용하는 힘도 달라질 수 있어요. 고등학교에서는 충격량으로 이 관계를 배워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "탑승자를 보호하는 장치와 감속 시설을 나누어요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w100",
     "no": 100,
     "form": "multi",
     "type": "T08",
     "topic": "역할이 맞는 설명",
     "prompt": "안전장치와 시설의 역할을 바르게 연결한 것을 모두 고르세요.",
     "answer": "①, ③, ④",
     "explanation": "안전띠는 몸을 잡아 주고 에어백은 안전띠와 함께 몸을 보호해요. 과속 방지 턱은 운전자가 속력을 줄이도록 해요. 신호가 있어도 모든 차가 멈췄다고 생각하지 않고 확인해야 해요.",
     "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
     "choices": [
      "안전띠: 몸이 크게 쏠리는 것을 줄인다.",
      "도로 반사경: 탑승자의 몸을 좌석에 잡아 준다.",
      "에어백: 안전띠와 함께 몸을 보호한다.",
      "과속 방지 턱: 운전자가 속력을 줄이도록 한다.",
      "횡단보도 신호: 모든 차량의 정지를 보장한다."
     ],
     "key": [
      0,
      2,
      3
     ],
     "criteria": "「안전띠: 몸이 크게 쏠리는 것을 줄인다. / 에어백: 안전띠와 함께 탑승자 보호를 돕는다. / 과속 방지 턱: 운전자의 감속을 유도한다.」을 모두 고르고 다른 보기를 넣지 않는다.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       2,
       3
      ],
      "orderSensitive": false,
      "extraSelectionAllowed": false
     }
    },
    {
     "id": "c22-s61-u02-w101",
     "no": 101,
     "form": "match",
     "type": "T08",
     "topic": "설치 장소와 기능",
     "prompt": "보기: ㄱ 몸을 좌석에 잡아 줌 / ㄴ 충돌 때 안전띠와 함께 몸을 보호함 / ㄷ 운전자가 속력을 줄이도록 함",
     "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
     "explanation": "안전띠는 ㄱ, 에어백은 ㄴ, 과속 방지 턱은 ㄷ과 연결해요. 에어백이 있어도 안전띠를 바르게 매야 해요.",
     "misconception": "도로의 감속 장치와 자동차 안의 탑승자 보호 장치를 구별해요.",
     "parts": [
      "(1) 안전띠 [ ]",
      "(2) 에어백 [ ]",
      "(3) 과속 방지 턱 [ ]"
     ],
     "answerPerPart": true,
     "criteria": "「(1) ㄱ (2) ㄴ (3) ㄷ」 또는 명시한 동등 표현으로 답한다. 장치 이름을 외우는 데서 끝내지 않고 누구에게 어떤 도움을 주는지 구별해요. 에어백은 안전띠를 대체하지 않아요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "ordered-parts",
      "answers": [
       "ㄱ",
       "ㄴ",
       "ㄷ"
      ],
      "orderSensitive": true,
      "answerPerPart": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "탑승자를 보호하는 장치와 감속 시설을 나누어요.",
     "value": "탑승자를 보호하는 장치와 운전자가 속력을 줄이도록 하는 시설을 나누어요."
    }
   ]
  },
  {
   "previous": {
    "section": "속력과 안전한 생활 · 108~109",
    "title": "안전 행동의 까닭을 설명해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w108",
       "c22-s61-u02-w109"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "안전 행동을 할 때 필요한 까닭도 함께 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 힘이 운동을 바꾸는 데 작용함을 배워요. 자동차를 멈추는 제동도 운동을 바꾸는 힘과 연결돼요."
     },
     {
      "title": "내가 정리할 것",
      "text": "멈춤, 주변 확인, 걷기를 순서대로 연결해요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w108",
     "no": 108,
     "form": "written",
     "type": "T09",
     "topic": "행동과 까닭 연결",
     "prompt": "“초록 신호일 때 건넌다”는 안내에 무엇을 보완할까요? 멈춤·주변 확인·차량 확인·걷기를 연결해 설명하세요.",
     "answer": "건너기 전에 멈춰 신호와 좌우·주변을 살피고 차량이 멈췄는지 확인한 뒤 걸어서 건너요. 신호만 보고 모든 차가 멈췄다고 단정하지 않아요.",
     "explanation": "해야 할 행동과 그 까닭을 함께 전달해요. 실제 도로에서 속력이나 제동 실험을 하라는 안내가 아니에요.",
     "misconception": "신호와 함께 주변·차량 정지를 확인하는 안전 행동을 지켜요.",
     "requirements": [
      "멈춤과 신호/주변 확인",
      "차량 움직임/정지 확인",
      "걸어서 건넘과 신호만으로 단정하지 않는 이유"
     ],
     "lines": 8,
     "criteria": "멈춤과 신호/주변 확인 / 차량 움직임/정지 확인 / 걸어서 건넘과 신호만으로 단정하지 않는 이유",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "teacher-explanation",
      "teacherRequired": true,
      "sample": "건너기 전에 멈춰 신호와 좌우·주변을 살피고 차량이 멈췄는지 확인한 뒤 걸어서 건너요. 신호만 보고 모든 차가 멈췄다고 단정하지 않아요.",
      "required": [
       "멈춤과 신호/주변 확인",
       "차량 움직임/정지 확인",
       "걸어서 건넘과 신호만으로 단정하지 않는 이유"
      ],
      "actualPerformanceMustNotBeInferred": true
     }
    },
    {
     "id": "c22-s61-u02-w109",
     "no": 109,
     "form": "choice",
     "type": "T10",
     "topic": "안전한 모형 탐구",
     "prompt": "자동차의 속력과 멈추기까지의 움직임을 알아보는 학습 방법으로 알맞은 것은?",
     "answer": "③ 실내 모형에서 관찰하고 모형으로 알 수 있는 점을 설명한다.",
     "explanation": "안전한 실내 수레 모형에서 관찰해요. 수레와 실제 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 다르므로, 모형에서 본 결과를 모든 자동차에 그대로 쓰지 않아요.",
     "misconception": "다른 조건이 같을 때의 관계를 말하며 정확한 정지 거리를 꾸며 내지 않아요.",
     "choices": [
      "장난감 기록을 모든 자동차에 적용한다.",
      "모형 결과에 임의로 100을 곱해 환산한다.",
      "실내 모형에서 관찰하고 모형으로 알 수 있는 점을 설명한다.",
      "차도에서 접근하는 차 앞에 표를 세운다.",
      "친구가 탄 자전거 앞으로 갑자기 나간다."
     ],
     "key": 2,
     "criteria": "제시한 조건에서 「실내 모형을 관찰하고 적용 범위를 밝힌다.」을 고른다. 교사가 준비한 낮은 실내 모형에서 관찰하고 실제 자동차와 다른 조건을 밝혀요. 차도에서 차량 앞에 서는 실험은 하지 않아요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "single-choice",
      "answer": 2
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "멈춤, 주변 확인, 걷기를 순서대로 연결해요.",
     "value": "멈추기, 주변 살피기, 차량이 멈췄는지 확인하기, 걸어서 건너기를 순서대로 연결해요."
    }
   ]
  },
  {
   "previous": {
    "section": "근거를 담은 설명과 공유 · 116~117",
    "title": "안전장치의 역할을 연결해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w116",
       "c22-s61-u02-w117"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "조사한 내용과 우리 모형에서 관찰한 결과를 구별해요."
     },
     {
      "title": "더 알아보기",
      "text": "더 깊은 탐구에서는 실험실 결과를 실제 환경에 적용할 수 있는지 별도로 검토해요. 조건의 차이가 결론에 영향을 주기 때문이에요."
     },
     {
      "title": "내가 정리할 것",
      "text": "안내문에서 직접 확인할 수 있는 주장을 골라요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w116",
     "no": 116,
     "form": "multi",
     "type": "T13",
     "topic": "설명과 기록의 근거",
     "prompt": "안전 수칙을 조사하여 설명할 때 알맞은 방법을 모두 고르세요.",
     "answer": "①, ③, ④",
     "explanation": "안전띠와 에어백이 함께 몸을 보호한다는 점을 바르게 설명해요. 수레 모형과 자동차의 다른 점, 안전 수칙을 찾아본 자료도 밝혀요.",
     "misconception": "모형의 수치를 실제 자동차에 그대로 적용하지 않아요.",
     "choices": [
      "자동차와 모형의 조건이 다른 점을 밝힌다.",
      "수레 모형의 정지 거리를 모든 자동차의 값으로 쓴다.",
      "안전띠와 에어백이 함께 몸을 보호함을 설명한다.",
      "안전 수칙을 찾아본 자료의 제목과 기관을 밝힌다.",
      "초록 신호이면 모든 자동차가 이미 멈췄다고 설명한다."
     ],
     "key": [
      0,
      2,
      3
     ],
     "criteria": "안전장치의 역할과 적용 조건을 정확히 설명하고 알아본 자료를 밝혀요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       2,
       3
      ],
      "orderSensitive": false,
      "extraSelectionAllowed": false
     }
    },
    {
     "id": "c22-s61-u02-w117",
     "no": 117,
     "form": "match",
     "type": "T13",
     "topic": "안전장치의 역할 연결하기",
     "prompt": "보기: ㄱ 안전띠 / ㄴ 과속 방지 턱 / ㄷ 에어백",
     "answer": "(1) ㄱ (2) ㄴ (3) ㄷ",
     "explanation": "안전띠는 몸을 잡아 주고, 과속 방지 턱은 속력을 줄이도록 하며, 에어백은 안전띠와 함께 몸을 보호해요.",
     "misconception": "안전띠는 몸을 잡아 주고, 과속 방지 턱은 감속을 유도하며, 에어백은 안전띠와 함께 몸을 보호해요.",
     "parts": [
      "(1) 급정지나 충돌 때 차에 탄 사람의 몸을 잡아 준다. [ ]",
      "(2) 운전자가 속력을 줄이도록 한다. [ ]",
      "(3) 충돌 때 안전띠와 함께 차에 탄 사람을 보호한다. [ ]"
     ],
     "answerPerPart": true,
     "criteria": "안전띠는 몸을 잡아 주고, 과속 방지 턱은 감속을 유도하며, 에어백은 안전띠와 함께 몸을 보호해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "ordered-parts",
      "answers": [
       "ㄱ",
       "ㄴ",
       "ㄷ"
      ],
      "orderSensitive": true,
      "answerPerPart": true
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "조사한 내용과 우리 모형에서 관찰한 결과를 구별해요.",
     "value": "안전장치와 시설이 하는 일을 구별하고, 조사한 내용의 출처를 함께 밝혀요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "안내문에서 직접 확인할 수 있는 주장을 골라요.",
     "value": "안전띠·에어백·과속 방지턱의 역할을 나누고, 조사한 자료의 출처를 쓰는 까닭을 정리해요."
    }
   ]
  },
  {
   "previous": {
    "section": "근거를 담은 설명과 공유 · 120~122",
    "title": "속력과 안전 행동을 연결해요",
    "blocks": [
     {
      "type": "questions",
      "ids": [
       "c22-s61-u02-w120",
       "c22-s61-u02-w121",
       "c22-s61-u02-w122"
      ]
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "거리와 시간으로 속력을 구하고 안전 행동의 까닭을 설명해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 속력이 커질 때 운동 에너지가 커짐을 배워요. 고등학교에서는 같은 질량에서 운동 에너지가 속력의 제곱에 비례함을 배워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "비교하는 두 상황에서 같은 조건을 찾아요.",
      "write": 5
     }
    ],
    "kind": "practice",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [
    {
     "id": "c22-s61-u02-w120",
     "no": 120,
     "form": "blank",
     "type": "T06",
     "topic": "속력의 뜻 되짚기",
     "prompt": "한 길을 한 방향으로 이동한 거리를 걸린 시간으로 나누면 물체의 [ ]을 구할 수 있어요.",
     "answer": "속력",
     "explanation": "속력은 이동 거리를 걸린 시간으로 나눈 양이에요.",
     "misconception": "속력은 이동 거리를 걸린 시간으로 나눈 양이에요.",
     "accepted": [
      "빠르기"
     ],
     "criteria": "속력은 이동 거리를 걸린 시간으로 나눈 양이에요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "속력",
       "빠르기"
      ],
      "orderSensitive": true
     }
    },
    {
     "id": "c22-s61-u02-w121",
     "no": 121,
     "form": "short",
     "type": "T07",
     "topic": "속력으로 빠르기 비교하기",
     "prompt": "한 길을 한 방향으로 움직인 두 수레의 기록이에요. 속력이 더 큰 수레의 속력을 단위와 함께 쓰세요.",
     "answer": "2m/s",
     "explanation": "가는 6÷3=2m/s이고 나는 8÷8=1m/s이므로 가의 속력이 더 커요.",
     "misconception": "가는 6÷3=2m/s이고 나는 8÷8=1m/s이므로 가의 속력이 더 커요.",
     "accepted": [
      "2 m/s",
      "2 m / s",
      "초속 2m",
      "1초에 2m"
     ],
     "table": {
      "heads": [
       "수레",
       "이동 거리",
       "걸린 시간"
      ],
      "rows": [
       [
        "가",
        "6m",
        "3초"
       ],
       [
        "나",
        "8m",
        "8초"
       ]
      ]
     },
     "model": {
      "A": {
       "distance": 6,
       "time": 3,
       "speed": 2
      },
      "B": {
       "distance": 8,
       "time": 8,
       "speed": 1
      },
      "unit": "m/s"
     },
     "criteria": "가는 6÷3=2m/s이고 나는 8÷8=1m/s이므로 가의 속력이 더 커요.",
     "figure": "motion-question-121",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-02",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "dataProvenance": "author-created-practice-data-not-learner-measurement",
     "responseContract": {
      "kind": "short-text",
      "accepted": [
       "2m/s",
       "2 m/s",
       "2 m / s",
       "초속 2m",
       "1초에 2m"
      ],
      "orderSensitive": true
     }
    },
    {
     "id": "c22-s61-u02-w122",
     "no": 122,
     "form": "multi",
     "type": "T13",
     "topic": "속력과 안전 행동",
     "prompt": "다른 조건이 같을 때 속력과 안전에 관한 설명으로 알맞은 것을 모두 고르세요.",
     "answer": "①, ②, ⑤",
     "explanation": "속력이 클수록 정지하는 데 더 긴 거리가 필요할 수 있어요. 안전띠를 바르게 매고, 건너기 전에는 차량이 멈췄는지 확인해요.",
     "misconception": "속력이 클수록 정지하는 데 더 긴 거리가 필요할 수 있어요. 안전띠를 바르게 매고, 건너기 전에는 차량이 멈췄는지 확인해요.",
     "choices": [
      "빠른 자동차는 위험을 보고도 곧바로 멈추기 어렵다.",
      "에어백이 있어도 안전띠를 바르게 매야 한다.",
      "속력 수치만 알면 모든 자동차의 정지 거리를 정확히 구할 수 있다.",
      "초록 신호가 켜지면 주변을 살피지 않아도 된다.",
      "횡단하기 전에 차량이 멈췄는지 확인해야 한다."
     ],
     "key": [
      0,
      1,
      4
     ],
     "criteria": "속력이 클수록 정지하는 데 더 긴 거리가 필요할 수 있어요. 안전띠를 바르게 매고, 건너기 전에는 차량이 멈췄는지 확인해요.",
     "origin": "independently-authored-current-curriculum",
     "status": "authored-draft",
     "standard": "6과10-03",
     "sourceRef": {
      "type": "authored",
      "curriculum": "2022 개정",
      "course": "6-1",
      "unit": "Ⅱ. 물체의 운동",
      "originalExam": false
     },
     "responseContract": {
      "kind": "multi-choice",
      "answers": [
       0,
       1,
       4
      ],
      "orderSensitive": false,
      "extraSelectionAllowed": false
     }
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "비교하는 두 상황에서 같은 조건을 찾아요.",
     "value": "121번의 두 속력을 같은 단위로 구해 비교해요. 속력만으로 실제 자동차의 정지 거리를 정할 수 있을까요?"
    }
   ]
  },
  {
   "previous": {
    "section": "오답과 다음 확인",
    "title": "빠뜨린 조건을 다시 확인해요",
    "blocks": [
     {
      "type": "field",
      "title": "다시 볼 문항과 빠진 조건",
      "hint": "문항 번호·내 답·빠뜨린 기준/단위와 고친 까닭을 연결해요.",
      "lines": 7,
      "draw": false
     },
     {
      "type": "field",
      "title": "다음에 실제로 확인할 것",
      "hint": "아직 못 마친 측정/공유·더 필요한 자료와 안전한 다음 행동을 써요.",
      "lines": 7,
      "draw": false
     }
    ],
    "rail": [
     {
      "title": "핵심 정리",
      "text": "문제에서 놓친 기준, 시간, 단위를 다시 확인해요."
     },
     {
      "title": "더 알아보기",
      "text": "과학에서는 새로운 자료로 설명을 수정해요. 계산 실수와 비교 조건의 차이를 구별하면 어떤 근거가 더 필요한지 알 수 있어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "고친 답의 까닭을 한 문장으로 설명해요.",
      "write": 5
     }
    ],
    "kind": "learn",
    "lead": "",
    "layout": "motion-workbook"
   },
   "questions": [],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "빠뜨린 조건을 다시 확인해요",
     "value": "문제의 조건과 답을 다시 확인해요"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "문제에서 놓친 기준, 시간, 단위를 다시 확인해요.",
     "value": "기준, 시간, 단위를 확인하며 답의 근거를 다시 살펴요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "고친 답의 까닭을 한 문장으로 설명해요.",
     "value": "처음 답의 근거를 확인하고, 고칠 부분이 있으면 까닭과 함께 고쳐요."
    },
    {
     "path": [
      "blocks",
      0,
      "title"
     ],
     "previous": "다시 볼 문항과 빠진 조건",
     "value": "다시 볼 문항과 확인할 조건"
    },
    {
     "path": [
      "blocks",
      0,
      "hint"
     ],
     "previous": "문항 번호·내 답·빠뜨린 기준/단위와 고친 까닭을 연결해요.",
     "value": "문항 번호·내 답·확인한 기준과 단위를 연결해요. 고칠 부분이 있다면 그 까닭도 써요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x));
export function withMotionContextWorkbook(workbook){
 if(workbook?.unit!=='c22-s61-u02'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const key of f.path.slice(0,-1))at=at[key];at[f.path.at(-1)]=clone(f.value);}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}

const bankPatches=[
 {
  "previous": {
   "id": "c22-s61-u02-b044",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 44,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u02-w044",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E2",
    "type": "T03",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-02",
    "topic": "시간 기록의 일관성",
    "concept": "같은 거리의 시간 비교",
    "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
   },
   "prompt": "A는 앞부분이 출발선을 지날 때, B는 뒷부분이 출발선을 지날 때 시계를 시작했습니다. 끝낼 때는 둘 다 앞부분이 도착선을 지날 때 멈췄습니다. 어떻게 고쳐 비교할지 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
    "rubric": {
     "required": [
      "기준 부분 차이 지적",
      "같은 부분으로 시작/끝 정하기",
      "새 측정으로 비교하고 옛값 보존"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
     "required": [
      "기준 부분 차이 지적",
      "같은 부분으로 시작/끝 정하기",
      "새 측정으로 비교하고 옛값 보존"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "explanation": "두 수레 모두 앞부분이 출발선을 지날 때부터 앞부분이 도착선을 지날 때까지 재는 것처럼, 같은 부분으로 시간을 재야 해요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   },
   "contentVersion": "20261106-motion-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u02-b044",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 44,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u02-w044",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "시간 기록의 일관성",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
     },
     "prompt": "A는 앞부분이 출발선을 지날 때, B는 뒷부분이 출발선을 지날 때 시계를 시작했습니다. 끝낼 때는 둘 다 앞부분이 도착선을 지날 때 멈췄습니다. 어떻게 고쳐 비교할지 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
      "rubric": {
       "required": [
        "기준 부분 차이 지적",
        "같은 부분으로 시작/끝 정하기",
        "새 측정으로 비교하고 옛값 보존"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-explanation",
       "teacherRequired": true,
       "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
       "required": [
        "기준 부분 차이 지적",
        "같은 부분으로 시작/끝 정하기",
        "새 측정으로 비교하고 옛값 보존"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "측정할 물체의 기준 부분과 시작/끝 규칙을 일관되게 맞춰요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
    "rubric": {
     "required": [
      "기준 부분이 달라 측정 구간도 달라질 수 있음을 설명한다.",
      "같은 부분이 출발선과 도착선을 지날 때를 기준으로 정한다.",
      "같은 구간을 다시 재어 걸린 시간을 비교한다."
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레의 같은 부분이 출발선과 도착선을 지나는 순간을 기준으로 정해 다시 재요. 서로 다른 부분을 기준으로 재면 실제 측정 구간이 달라질 수 있어요.",
     "required": [
      "기준 부분이 달라 측정 구간도 달라질 수 있음을 설명한다.",
      "같은 부분이 출발선과 도착선을 지날 때를 기준으로 정한다.",
      "같은 구간을 다시 재어 걸린 시간을 비교한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u02-b047",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 47,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u02-w047",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E2",
    "type": "T03",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-02",
    "topic": "다른 거리의 함정",
    "concept": "같은 거리의 시간 비교",
    "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
   },
   "prompt": "한 길을 한 방향으로 가는 4m를 2초에, 나는 12m를 3초에 갔습니다. “2초가 짧으니 가가 빠르다”는 설명을 고쳐 보세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "이동 거리가 달라 시간만 비교하면 안 돼요. 가는 4÷2=2m/s, 나는 12÷3=4m/s라서 이 조건에서는 나가 더 빨라요.",
    "rubric": {
     "required": [
      "거리 차이 지적",
      "2m/s와 4m/s 검산",
      "나가 더 빠름과 조건 한정"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "이동 거리가 달라 시간만 비교하면 안 돼요. 가는 4÷2=2m/s, 나는 12÷3=4m/s라서 이 조건에서는 나가 더 빨라요.",
     "required": [
      "거리 차이 지적",
      "2m/s와 4m/s 검산",
      "나가 더 빠름과 조건 한정"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "explanation": "같은 거리라는 조건이 없으면 거리와 시간을 함께 비교해요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   }
  },
  "fields": {
   "prompt": "두 수레가 한 길을 한 방향으로 움직였어요. 수레 가는 4m를 2초에, 수레 나는 12m를 3초에 갔어요. “2초가 짧으니 수레 가가 더 빠르다”는 설명을 고쳐 보세요."
  }
 },
 {
  "previous": {
   "id": "c22-s61-u02-b048",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 48,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "draw",
   "bookQuestionId": "c22-s61-u02-w048",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E2",
    "type": "T03",
    "format": "그림 완성",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-02",
    "topic": "같은 거리 측정 계획도",
    "concept": "같은 거리의 시간 비교",
    "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
   },
   "prompt": "안전한 실내에서 수레 두 대가 같은 구간을 가는 시간을 재는 배치를 그리세요. 시작/끝선·같은 기준 부분·측정자의 위치를 표시하세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
    "rubric": {
     "required": [
      "같은 출발/도착 구간",
      "같은 수레 기준 부분 표시",
      "경로를 비킨 측정자 위치와 계획 표시"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
     "required": [
      "같은 출발/도착 구간",
      "같은 수레 기준 부분 표시",
      "경로를 비킨 측정자 위치와 계획 표시"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "explanation": "두 수레가 같은 출발선과 도착선 사이를 가도록 그려요. 수레 앞부분처럼 시간을 잴 때 기준으로 삼을 부분과, 이동하는 길 밖에 선 측정자의 위치도 표시해요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   },
   "contentVersion": "20261106-motion-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u02-b048",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 48,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "draw",
     "bookQuestionId": "c22-s61-u02-w048",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T03",
      "format": "그림 완성",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "같은 거리 측정 계획도",
      "concept": "같은 거리의 시간 비교",
      "inquirySkill": "이동 거리가 같을 때 걸린 시간이 짧을수록 빠름을 설명한다."
     },
     "prompt": "안전한 실내에서 수레 두 대가 같은 구간을 가는 시간을 재는 배치를 그리세요. 시작/끝선·같은 기준 부분·측정자의 위치를 표시하세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
      "rubric": {
       "required": [
        "같은 출발/도착 구간",
        "같은 수레 기준 부분 표시",
        "경로를 비킨 측정자 위치와 계획 표시"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-drawing",
       "teacherRequired": true,
       "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
       "required": [
        "같은 출발/도착 구간",
        "같은 수레 기준 부분 표시",
        "경로를 비킨 측정자 위치와 계획 표시"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "그림은 계획이며 실제로 잰 시간은 아직 채우지 않아요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
    "rubric": {
     "required": [
      "같은 출발선과 도착선 사이의 구간을 나타낸다.",
      "시간을 잴 수레의 같은 기준 부분을 표시한다.",
      "측정자가 수레의 이동 경로 밖에 있도록 표시한다."
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "같은 출발선과 도착선을 그린 뒤 수레 앞부분 등 기준 부분을 표시해요. 측정자는 이동 경로를 비켜서 시간을 재요.",
     "required": [
      "같은 출발선과 도착선 사이의 구간을 나타낸다.",
      "시간을 잴 수레의 같은 기준 부분을 표시한다.",
      "측정자가 수레의 이동 경로 밖에 있도록 표시한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u02-b064",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 64,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "draw",
   "bookQuestionId": "c22-s61-u02-w064",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E2",
    "type": "T04",
    "format": "그림 완성",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-02",
    "topic": "거리 비교 기록표",
    "concept": "같은 시간의 거리 비교",
    "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
   },
   "prompt": "두 수레가 같은 시간 동안 간 거리를 3회 재려고 합니다. 수레 이름·같은 시간·회차·거리와 단위를 남길 빈 표를 그리세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "A와 B, 1~3회를 적을 칸을 나누어요. 관찰 시간과 이동 거리, 단위를 적고, 측정 조건과 잘 보지 못한 점을 적을 자리도 만들어요.",
    "rubric": {
     "required": [
      "A/B와 1~3회 구분",
      "같은 시간과 거리 단위",
      "조건/불분명과 측정 전 빈칸"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "A와 B, 1~3회를 적을 칸을 나누어요. 관찰 시간과 이동 거리, 단위를 적고, 측정 조건과 잘 보지 못한 점을 적을 자리도 만들어요.",
     "required": [
      "A/B와 1~3회 구분",
      "같은 시간과 거리 단위",
      "조건/불분명과 측정 전 빈칸"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "explanation": "수레 이름과 1~3회, 같은 관찰 시간, 이동 거리와 단위를 적을 칸이 필요해요. 아직 재지 않았으므로 결과를 적을 칸은 비워 두어요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   },
   "contentVersion": "20261106-motion-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u02-b064",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 64,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "draw",
     "bookQuestionId": "c22-s61-u02-w064",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E2",
      "type": "T04",
      "format": "그림 완성",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "거리 비교 기록표",
      "concept": "같은 시간의 거리 비교",
      "inquirySkill": "이동 시간이 같을 때 더 긴 거리를 이동한 물체가 빠름을 설명한다."
     },
     "prompt": "두 수레가 같은 시간 동안 간 거리를 3회 재려고 합니다. 수레 이름·같은 시간·회차·거리와 단위를 남길 빈 표를 그리세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "A/B와 1~3회, 관찰 시간, 이동 거리(cm 또는 m), 조건/불분명 칸을 둬요.",
      "rubric": {
       "required": [
        "A/B와 1~3회 구분",
        "같은 시간과 거리 단위",
        "조건/불분명과 측정 전 빈칸"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-drawing",
       "teacherRequired": true,
       "sample": "A/B와 1~3회, 관찰 시간, 이동 거리(cm 또는 m), 조건/불분명 칸을 둬요.",
       "required": [
        "A/B와 1~3회 구분",
        "같은 시간과 거리 단위",
        "조건/불분명과 측정 전 빈칸"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "관찰 전 표를 설계하는 활동이에요. 실제로 재지 않은 결과를 미리 채우지 않아요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "A와 B, 1~3회를 적을 칸을 나누어요. 관찰 시간과 이동 거리, 단위를 적고, 측정 조건과 잘 보지 못한 점을 적을 자리도 만들어요.",
    "rubric": {
     "required": [
      "두 수레의 이름과 1~3회 측정 칸을 구분한다.",
      "같은 관찰 시간과 이동 거리의 단위를 적을 곳을 마련한다.",
      "아직 재지 않은 거리 칸은 비워 둔다."
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-drawing",
     "teacherRequired": true,
     "sample": "A와 B, 1~3회를 적을 칸을 나누어요. 관찰 시간과 이동 거리, 단위를 적고, 측정 조건과 잘 보지 못한 점을 적을 자리도 만들어요.",
     "required": [
      "두 수레의 이름과 1~3회 측정 칸을 구분한다.",
      "같은 관찰 시간과 이동 거리의 단위를 적을 곳을 마련한다.",
      "아직 재지 않은 거리 칸은 비워 둔다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u02-b079",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 79,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u02-w079",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E3",
    "type": "T07",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-02",
    "topic": "수치와 단위를 넣어 설명하기",
    "concept": "속력 자료의 정량 비교",
    "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
   },
   "prompt": "한 길을 한 방향으로 A는 9m를 3초에, B는 8m를 4초에 갔어요. “A가 더 빠르다”는 설명에 속력과 단위를 넣어 까닭을 설명하세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
    "rubric": {
     "required": [
      "A3m/s와 B2m/s",
      "A가 빠름",
      "제시 구간/한 방향과 같은 단위 명시"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
     "required": [
      "A3m/s와 B2m/s",
      "A가 빠름",
      "제시 구간/한 방향과 같은 단위 명시"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "explanation": "A는 9÷3=3m/s, B는 8÷4=2m/s예요. 어느 수레가 더 빠른지 쓸 때 두 속력과 단위를 함께 쓰면 비교한 까닭이 분명해져요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   },
   "contentVersion": "20261106-motion-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u02-b079",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 79,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u02-w079",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "정량적으로 전달하기",
      "concept": "속력 자료의 정량 비교",
      "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
     },
     "prompt": "A가 더 빠르다고만 적은 설명을 보완하려고 합니다. 한 방향 이동 자료가 A 9m/3초, B 8m/4초일 때 비교 문장을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
      "rubric": {
       "required": [
        "A3m/s와 B2m/s",
        "A가 빠름",
        "제시 구간/한 방향과 같은 단위 명시"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-explanation",
       "teacherRequired": true,
       "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
       "required": [
        "A3m/s와 B2m/s",
        "A가 빠름",
        "제시 구간/한 방향과 같은 단위 명시"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "빠른 대상·각 속력·단위·관찰 구간을 함께 전달하면 다른 사람이 근거를 확인할 수 있어요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "version": 1
    },
    {
     "id": "c22-s61-u02-b079",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 79,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u02-w079",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E3",
      "type": "T07",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "수치와 단위를 넣어 설명하기",
      "concept": "속력 자료의 정량 비교",
      "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
     },
     "prompt": "A가 더 빠르다고만 적은 설명을 보완하려고 합니다. 한 방향 이동 자료가 A 9m/3초, B 8m/4초일 때 비교 문장을 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
      "rubric": {
       "required": [
        "A3m/s와 B2m/s",
        "A가 빠름",
        "제시 구간/한 방향과 같은 단위 명시"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-explanation",
       "teacherRequired": true,
       "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
       "required": [
        "A3m/s와 B2m/s",
        "A가 빠름",
        "제시 구간/한 방향과 같은 단위 명시"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "빠른 대상·각 속력·단위·관찰 구간을 함께 전달하면 다른 사람이 근거를 확인할 수 있어요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "contentVersion": "20261105-observation-language",
     "previousVersions": [
      {
       "id": "c22-s61-u02-b079",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 79,
        "section": "교과 연결 사고력"
       },
       "bookResponseForm": "written",
       "bookQuestionId": "c22-s61-u02-w079",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 1,
        "unit": "u02",
        "area": "운동과 에너지",
        "element": "E3",
        "type": "T07",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "6과10-02",
        "topic": "정량적으로 전달하기",
        "concept": "속력 자료의 정량 비교",
        "inquirySkill": "제시 조건과 단위를 확인하고 표/수치의 속력을 비교한다."
       },
       "prompt": "A가 더 빠르다고만 적은 설명을 보완하려고 합니다. 한 방향 이동 자료가 A 9m/3초, B 8m/4초일 때 비교 문장을 쓰세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
        "rubric": {
         "required": [
          "A3m/s와 B2m/s",
          "A가 빠름",
          "제시 구간/한 방향과 같은 단위 명시"
         ],
         "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
        },
        "motionContract": {
         "kind": "teacher-explanation",
         "teacherRequired": true,
         "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
         "required": [
          "A3m/s와 B2m/s",
          "A가 빠름",
          "제시 구간/한 방향과 같은 단위 명시"
         ],
         "actualPerformanceMustNotBeInferred": true
        }
       },
       "explanation": "빠른 대상·각 속력·단위·관찰 구간을 함께 전달하면 다른 사람이 근거를 확인할 수 있어요.",
       "evidence": {
        "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
        "date": "2026-10-21",
        "gates": [
         "authored",
         "science",
         "answer"
        ],
        "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
       },
       "version": 1
      }
     ],
     "version": "20261105-observation-language"
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
    "rubric": {
     "required": [
      "A의 속력 3m/s와 B의 속력 2m/s를 나타낸다.",
      "같은 단위의 속력을 비교하여 A가 더 빠른 까닭을 설명한다."
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "제시 구간에서 A는 3m/s, B는 2m/s이므로 A가 더 빨라요. 한 길을 한 방향으로 이동한 거리와 시간을 같은 단위로 비교했어요.",
     "required": [
      "A의 속력 3m/s와 B의 속력 2m/s를 나타낸다.",
      "같은 단위의 속력을 비교하여 A가 더 빠른 까닭을 설명한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u02-b086",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 86,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u02-w086",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T12",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-02",
    "topic": "우리 모둠의 측정 계획",
    "concept": "거리·시간의 실제 측정",
    "inquirySkill": "기준 위치와 측정 시작/끝·단위·반복·불확실성을 정하고 실제 측정값으로 비교한다."
   },
   "prompt": "안전한 실내에서 작은 수레가 한 길을 한 방향으로 이동할 때의 속력을 재는 계획을 쓰세요. 아직 재지 않은 숫자를 결과로 쓰지는 마세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "선생님이 준비한 평평한 실내 길에 출발선과 도착선을 표시해요. 수레 앞부분이 각 선을 지날 때를 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에 서서 같은 방법으로 세 번 재요.",
    "rubric": {
     "required": [
      "비운 평평한 실내와 길 밖 관찰",
      "출발/도착과 같은 기준 부분",
      "줄자/초시계 등 도구와 거리/시간 단위",
      "3회 반복과 불분명/미측정 보존"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "선생님이 준비한 평평한 실내 길에 출발선과 도착선을 표시해요. 수레 앞부분이 각 선을 지날 때를 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에 서서 같은 방법으로 세 번 재요.",
     "required": [
      "비운 평평한 실내와 길 밖 관찰",
      "출발/도착과 같은 기준 부분",
      "줄자/초시계 등 도구와 거리/시간 단위",
      "3회 반복과 불분명/미측정 보존"
     ],
     "actualPerformanceMustNotBeInferred": true
    },
    "reviewRequired": true
   },
   "explanation": "어디부터 어디까지 재는지, 어떤 도구를 쓰는지 정해요. 수레의 같은 부분을 기준으로 거리와 시간을 재고 단위를 적어요. 관찰자는 길 밖에서 보고 같은 방법으로 여러 번 재요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   },
   "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
   "workbookRef": {
    "id": "c22-s61-u02-w086",
    "no": 86
   },
   "contentVersion": "20261106-motion-readable-workbook",
   "previousVersions": [
    {
     "version": 1,
     "id": "c22-s61-u02-b086",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 86,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u02-w086",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "우리 모둠의 측정 계획",
      "concept": "거리·시간의 실제 측정",
      "inquirySkill": "기준 위치와 측정 시작/끝·단위·반복·불확실성을 정하고 실제 측정값으로 비교한다."
     },
     "prompt": "안전한 실내에서 작은 수레가 한 길을 한 방향으로 이동할 때의 평균 속력을 재는 계획을 쓰세요. 아직 재지 않은 숫자를 결과로 쓰지는 마세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
      "rubric": {
       "required": [
        "비운 평평한 실내와 길 밖 관찰",
        "출발/도착과 같은 기준 부분",
        "줄자/초시계 등 도구와 거리/시간 단위",
        "3회 반복과 불분명/미측정 보존"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-explanation",
       "teacherRequired": true,
       "sample": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
       "required": [
        "비운 평평한 실내와 길 밖 관찰",
        "출발/도착과 같은 기준 부분",
        "줄자/초시계 등 도구와 거리/시간 단위",
        "3회 반복과 불분명/미측정 보존"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "구간·도구·기준 부분·기록·반복·안전이 있어야 다른 사람이 같은 방법을 따라 할 수 있어요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     }
    },
    {
     "id": "c22-s61-u02-b086",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 86,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u02-w086",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "우리 모둠의 측정 계획",
      "concept": "거리·시간의 실제 측정",
      "inquirySkill": "기준 위치와 측정 시작/끝·단위·반복·불확실성을 정하고 실제 측정값으로 비교한다."
     },
     "prompt": "안전한 실내에서 작은 수레가 한 길을 한 방향으로 이동할 때의 속력을 재는 계획을 쓰세요. 아직 재지 않은 숫자를 결과로 쓰지는 마세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
      "rubric": {
       "required": [
        "비운 평평한 실내와 길 밖 관찰",
        "출발/도착과 같은 기준 부분",
        "줄자/초시계 등 도구와 거리/시간 단위",
        "3회 반복과 불분명/미측정 보존"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-explanation",
       "teacherRequired": true,
       "sample": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
       "required": [
        "비운 평평한 실내와 길 밖 관찰",
        "출발/도착과 같은 기준 부분",
        "줄자/초시계 등 도구와 거리/시간 단위",
        "3회 반복과 불분명/미측정 보존"
       ],
       "actualPerformanceMustNotBeInferred": true
      },
      "reviewRequired": true
     },
     "explanation": "구간·도구·기준 부분·기록·반복·안전이 있어야 다른 사람이 같은 방법을 따라 할 수 있어요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "misconception": "실제 측정·반복·불분명과 제공된 연습 자료를 구별해요.",
     "workbookRef": {
      "id": "c22-s61-u02-w086",
      "no": 86
     },
     "contentVersion": "20261104-motion-class",
     "previousVersions": [
      {
       "version": 1,
       "id": "c22-s61-u02-b086",
       "status": "authored",
       "sourceRef": {
        "type": "authored-supplement",
        "label": "현행 범위 독립 창작",
        "bookNo": 86,
        "section": "교과 연결 사고력"
       },
       "bookResponseForm": "written",
       "bookQuestionId": "c22-s61-u02-w086",
       "taxonomy": {
        "curriculum": "2022 개정",
        "grade": 6,
        "semester": 1,
        "unit": "u02",
        "area": "운동과 에너지",
        "element": "E5",
        "type": "T12",
        "format": "서술형",
        "level": "기본",
        "track": "교과",
        "standard": "6과10-02",
        "topic": "우리 모둠의 측정 계획",
        "concept": "거리·시간의 실제 측정",
        "inquirySkill": "기준 위치와 측정 시작/끝·단위·반복·불확실성을 정하고 실제 측정값으로 비교한다."
       },
       "prompt": "안전한 실내에서 작은 수레가 한 길을 한 방향으로 이동할 때의 평균 속력을 재는 계획을 쓰세요. 아직 재지 않은 숫자를 결과로 쓰지는 마세요.",
       "givens": null,
       "choices": null,
       "responseContract": "written-explanation",
       "answerContract": {
        "type": "written-explanation",
        "sample": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
        "rubric": {
         "required": [
          "비운 평평한 실내와 길 밖 관찰",
          "출발/도착과 같은 기준 부분",
          "줄자/초시계 등 도구와 거리/시간 단위",
          "3회 반복과 불분명/미측정 보존"
         ],
         "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
        },
        "motionContract": {
         "kind": "teacher-explanation",
         "teacherRequired": true,
         "sample": "교사가 정한 비운 길에 출발/도착선을 표시해요. 수레 앞부분이 각 선을 지나는 순간을 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에서 보고 같은 방법으로 3회 재요.",
         "required": [
          "비운 평평한 실내와 길 밖 관찰",
          "출발/도착과 같은 기준 부분",
          "줄자/초시계 등 도구와 거리/시간 단위",
          "3회 반복과 불분명/미측정 보존"
         ],
         "actualPerformanceMustNotBeInferred": true
        }
       },
       "explanation": "구간·도구·기준 부분·기록·반복·안전이 있어야 다른 사람이 같은 방법을 따라 할 수 있어요.",
       "evidence": {
        "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
        "date": "2026-10-21",
        "gates": [
         "authored",
         "science",
         "answer"
        ],
        "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
       }
      }
     ],
     "version": "20261104-motion-class"
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "선생님이 준비한 평평한 실내 길에 출발선과 도착선을 표시해요. 수레 앞부분이 각 선을 지날 때를 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에 서서 같은 방법으로 세 번 재요.",
    "rubric": {
     "required": [
      "물건을 치운 평평한 실내 길과 이동 경로 밖의 관찰 위치를 정한다.",
      "출발선·도착선과 시간을 잴 수레의 같은 기준 부분을 정한다.",
      "거리와 시간을 잴 도구 및 기록할 단위를 정한다.",
      "같은 방법으로 반복해 잴 계획을 세우고 아직 재지 않은 값을 결과로 쓰지 않는다."
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "선생님이 준비한 평평한 실내 길에 출발선과 도착선을 표시해요. 수레 앞부분이 각 선을 지날 때를 기준으로 거리와 시간을 재고 단위를 써요. 관찰자는 길 밖에 서서 같은 방법으로 세 번 재요.",
     "required": [
      "물건을 치운 평평한 실내 길과 이동 경로 밖의 관찰 위치를 정한다.",
      "출발선·도착선과 시간을 잴 수레의 같은 기준 부분을 정한다.",
      "거리와 시간을 잴 도구 및 기록할 단위를 정한다.",
      "같은 방법으로 반복해 잴 계획을 세우고 아직 재지 않은 값을 결과로 쓰지 않는다."
     ],
     "actualPerformanceMustNotBeInferred": true
    },
    "reviewRequired": true
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u02-b091",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 91,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u02-w091",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E5",
    "type": "T12",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-02",
    "topic": "기기 눈금과 표현",
    "concept": "거리·시간의 실제 측정",
    "inquirySkill": "기준 위치와 측정 시작/끝·단위·반복·불확실성을 정하고 실제 측정값으로 비교한다."
   },
   "prompt": "0.1초 단위로 읽는 초시계에 2.3초가 보였어요. 친구가 2.30000초라고 쓰고 더 정확히 쟀다고 했어요. 기록과 설명을 고쳐 보세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
    "rubric": {
     "required": [
      "실제 표시2.3초 보존",
      "0 추가만으로 정밀해지지 않음",
      "시작/정지의 차이와 반복 필요"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
     "required": [
      "실제 표시2.3초 보존",
      "0 추가만으로 정밀해지지 않음",
      "시작/정지의 차이와 반복 필요"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "explanation": "초시계가 보여 준 2.3초를 그대로 적어요. 뒤에 0을 더 붙여도 더 자세히 잰 값이 되는 것은 아니에요. 시계를 누른 순간의 차이도 있으므로 같은 방법으로 여러 번 재어요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   },
   "contentVersion": "20261106-motion-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u02-b091",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 91,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u02-w091",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E5",
      "type": "T12",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-02",
      "topic": "기기 눈금과 표현",
      "concept": "거리·시간의 실제 측정",
      "inquirySkill": "기준 위치와 측정 시작/끝·단위·반복·불확실성을 정하고 실제 측정값으로 비교한다."
     },
     "prompt": "0.1초 단위로 읽는 초시계에 2.3초가 보였습니다. 친구가 2.30000초로 기록하며 더 정확하다고 했습니다. 기록과 설명을 고쳐 보세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
      "rubric": {
       "required": [
        "실제 표시2.3초 보존",
        "0 추가만으로 정밀해지지 않음",
        "시작/정지의 차이와 반복 필요"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-explanation",
       "teacherRequired": true,
       "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
       "required": [
        "실제 표시2.3초 보존",
        "0 추가만으로 정밀해지지 않음",
        "시작/정지의 차이와 반복 필요"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "표시된 숫자와 측정의 정확성은 구별해요. 기기나 관찰이 확인하지 못한 정밀함을 숫자로 꾸미지 않아요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
    "rubric": {
     "required": [
      "초시계에 표시된 2.3초로 기록한다.",
      "뒤에 0을 더 쓴 것만으로 더 정확히 측정한 것은 아님을 설명한다."
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "기기가 보여 준 2.3초로 남겨요. 뒤에 0을 더 붙인다고 실제로 더 자세히 잰 것은 아니에요. 손으로 시작/정지한 순간의 차이도 있을 수 있어 같은 방법으로 반복해요.",
     "required": [
      "초시계에 표시된 2.3초로 기록한다.",
      "뒤에 0을 더 쓴 것만으로 더 정확히 측정한 것은 아님을 설명한다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  }
 },
 {
  "previous": {
   "id": "c22-s61-u02-b111",
   "status": "authored",
   "sourceRef": {
    "type": "authored-supplement",
    "label": "현행 범위 독립 창작",
    "bookNo": 111,
    "section": "교과 연결 사고력"
   },
   "bookResponseForm": "written",
   "bookQuestionId": "c22-s61-u02-w111",
   "taxonomy": {
    "curriculum": "2022 개정",
    "grade": 6,
    "semester": 1,
    "unit": "u02",
    "area": "운동과 에너지",
    "element": "E4",
    "type": "T10",
    "format": "서술형",
    "level": "기본",
    "track": "교과",
    "standard": "6과10-03",
    "topic": "모형에서 실제로 확대하기",
    "concept": "빠르기와 충돌 위험",
    "inquirySkill": "다른 조건이 같을 때 속력과 정지/충돌 위험의 관계를 조건 있게 설명한다."
   },
   "prompt": "작은 수레가 멈추기까지 간 거리로 실제 자동차가 멈추는 거리를 알 수 있다고 했어요. 두 결과를 같다고 말하기 어려운 까닭과 모형에서 알 수 있는 점을 쓰세요.",
   "givens": null,
   "choices": null,
   "responseContract": "written-explanation",
   "answerContract": {
    "type": "written-explanation",
    "sample": "수레와 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 달라요. 자동차에는 운전자가 반응하는 데 걸린 시간도 있어 수레의 거리를 그대로 쓸 수 없어요. 모형에서는 사용한 조건에서 본 움직임까지만 설명해요.",
    "rubric": {
     "required": [
      "실제 차와 다른 두 가지 이상 조건",
      "자동차 거리로 직접 환산/보장 보류",
      "사용한 모형 조건과 관찰 범위 명시"
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레와 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 달라요. 자동차에는 운전자가 반응하는 데 걸린 시간도 있어 수레의 거리를 그대로 쓸 수 없어요. 모형에서는 사용한 조건에서 본 움직임까지만 설명해요.",
     "required": [
      "실제 차와 다른 두 가지 이상 조건",
      "자동차 거리로 직접 환산/보장 보류",
      "사용한 모형 조건과 관찰 범위 명시"
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   },
   "explanation": "수레 모형과 자동차는 여러 조건이 달라요. 모형에서 멈춘 거리는 그 모형의 결과이며, 실제 자동차도 같은 거리에서 멈춘다고 말할 수는 없어요.",
   "evidence": {
    "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
    "date": "2026-10-21",
    "gates": [
     "authored",
     "science",
     "answer"
    ],
    "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
   },
   "contentVersion": "20261106-motion-readable-workbook",
   "previousVersions": [
    {
     "id": "c22-s61-u02-b111",
     "status": "authored",
     "sourceRef": {
      "type": "authored-supplement",
      "label": "현행 범위 독립 창작",
      "bookNo": 111,
      "section": "교과 연결 사고력"
     },
     "bookResponseForm": "written",
     "bookQuestionId": "c22-s61-u02-w111",
     "taxonomy": {
      "curriculum": "2022 개정",
      "grade": 6,
      "semester": 1,
      "unit": "u02",
      "area": "운동과 에너지",
      "element": "E4",
      "type": "T10",
      "format": "서술형",
      "level": "기본",
      "track": "교과",
      "standard": "6과10-03",
      "topic": "모형에서 실제로 확대하기",
      "concept": "빠르기와 충돌 위험",
      "inquirySkill": "다른 조건이 같을 때 속력과 정지/충돌 위험의 관계를 조건 있게 설명한다."
     },
     "prompt": "작은 수레를 멈추게 한 거리로 실제 자동차의 정지 거리를 구할 수 있다고 했습니다. 그대로 옮기기 어려운 까닭과 모형에서 말할 수 있는 범위를 쓰세요.",
     "givens": null,
     "choices": null,
     "responseContract": "written-explanation",
     "answerContract": {
      "type": "written-explanation",
      "sample": "질량·바퀴·바닥·멈추게 하는 방법과 운전자의 반응 등이 달라 수레 거리를 자동차 거리로 그대로 옮길 수 없어요. 이 모형에서 사용한 조건과 관찰한 움직임의 관계까지 설명해요.",
      "rubric": {
       "required": [
        "실제 차와 다른 두 가지 이상 조건",
        "자동차 거리로 직접 환산/보장 보류",
        "사용한 모형 조건과 관찰 범위 명시"
       ],
       "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
      },
      "motionContract": {
       "kind": "teacher-explanation",
       "teacherRequired": true,
       "sample": "질량·바퀴·바닥·멈추게 하는 방법과 운전자의 반응 등이 달라 수레 거리를 자동차 거리로 그대로 옮길 수 없어요. 이 모형에서 사용한 조건과 관찰한 움직임의 관계까지 설명해요.",
       "required": [
        "실제 차와 다른 두 가지 이상 조건",
        "자동차 거리로 직접 환산/보장 보류",
        "사용한 모형 조건과 관찰 범위 명시"
       ],
       "actualPerformanceMustNotBeInferred": true
      }
     },
     "explanation": "모형은 관계를 생각하는 데 도움을 주지만 실제 차의 정확한 수치나 안전거리를 보장하지 않아요.",
     "evidence": {
      "checkedBy": "창작 원고 재독·자료모형/응답 계약 검산",
      "date": "2026-10-21",
      "gates": [
       "authored",
       "science",
       "answer"
      ],
      "note": "독립 창작. 연습 자료는 실제 학생 측정값이 아니며 수행은 별도로 확인한다. 화면/인쇄 검수는 별도 기록."
     },
     "version": 1
    }
   ]
  },
  "fields": {
   "answerContract": {
    "type": "written-explanation",
    "sample": "수레와 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 달라요. 자동차에는 운전자가 반응하는 데 걸린 시간도 있어 수레의 거리를 그대로 쓸 수 없어요. 모형에서는 사용한 조건에서 본 움직임까지만 설명해요.",
    "rubric": {
     "required": [
      "수레와 자동차에서 결과에 영향을 줄 수 있는 조건의 차이를 설명한다.",
      "수레가 멈춘 거리를 실제 자동차의 정지 거리로 그대로 쓸 수 없음을 밝힌다.",
      "모형에서 사용한 조건과 관찰한 범위 안에서 알 수 있는 점을 쓴다."
     ],
     "pass": "실제 그림/측정/공유는 교사 확인. 타당한 동등 표현 인정"
    },
    "motionContract": {
     "kind": "teacher-explanation",
     "teacherRequired": true,
     "sample": "수레와 자동차는 무게와 바퀴, 바닥과 멈추는 방법 등이 달라요. 자동차에는 운전자가 반응하는 데 걸린 시간도 있어 수레의 거리를 그대로 쓸 수 없어요. 모형에서는 사용한 조건에서 본 움직임까지만 설명해요.",
     "required": [
      "수레와 자동차에서 결과에 영향을 줄 수 있는 조건의 차이를 설명한다.",
      "수레가 멈춘 거리를 실제 자동차의 정지 거리로 그대로 쓸 수 없음을 밝힌다.",
      "모형에서 사용한 조건과 관찰한 범위 안에서 알 수 있는 점을 쓴다."
     ],
     "actualPerformanceMustNotBeInferred": true
    }
   }
  }
 }
];
const bankCache=new WeakMap();
export function motionContextItems(rows,unit){
 if(unit!=='c22-s61-u02'||!Array.isArray(rows))return rows;let changed=false;
 const next=rows.map(q=>{const patch=bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(bankCache.has(q))return bankCache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:MOTION_CONTEXT_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};bankCache.set(q,current);return current;});return changed?next:rows;
}
export function withMotionContextClassroom(unit,book){
 const rows=motionContextItems(book?.classroomItems,unit);return rows===book?.classroomItems?book:{...book,classroomItems:rows};
}
