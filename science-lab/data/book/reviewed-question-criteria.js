export const REVIEWED_CRITERIA_VERSION='20261115-reviewed-answer-criteria';
export const REVIEWED_CRITERIA_UNITS=["c22-s51-u02", "c22-s52-u01", "c22-s52-u02", "c22-s52-u03", "c22-s52-u04", "c22-s61-u01"];
// Exact reviewed current presentations; earlier saved work keeps its own criteria.
const patches={
  "c22-s51-u02-b001": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-01",
    "no": 1,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "빛이 전혀 들어오지 않는 상자 속의 빨간 공을 볼 수 있을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 0,
    "previousChoices": [
      "공에서 온 빛이 눈에 와야 보인다.",
      "공이 빨가면 빛이 전혀 없어도 볼 수 있다.",
      "눈이 빛을 만들어 공 쪽으로 내보내면 보인다.",
      "어둠에 익숙해지면 빛이 없어도 모양이 보인다.",
      "공의 색을 기억하면 상자 속 실제 공도 보인다."
    ],
    "choices": [
      "공에서 반사된 빛이 눈에 와야 볼 수 있다.",
      "공이 빨가면 빛이 전혀 없어도 볼 수 있다.",
      "눈이 빛을 만들어 공 쪽으로 내보내면 보인다.",
      "어둠에 익숙해지면 빛이 없어도 모양이 보인다.",
      "공의 색을 기억하면 상자 속 실제 공도 보인다."
    ],
    "workbookRef": {
      "id": "light-book-01",
      "no": 1,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b013": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-13",
    "no": 13,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "불투명한 카드 뒤에 빛이 닿지 않는 부분이 생긴 까닭은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 4,
    "previousChoices": [
      "카드가 빛을 통과시켜 뒤쪽 전체에 보내었다.",
      "카드에서 나온 어둠이 뒤쪽의 빛을 밀어내었다.",
      "빛이 카드를 피해 돌아간 뒤 앞쪽으로 모였다.",
      "주변 빛이 카드 뒤쪽에 더 많이 모여 밝아졌다.",
      "카드가 직진하는 빛을 가렸다."
    ],
    "choices": [
      "카드가 빛을 통과시켜 뒤쪽 전체에 보내었다.",
      "카드에서 나온 어둠이 뒤쪽의 빛을 밀어내었다.",
      "빛이 카드를 피해 돌아간 뒤 앞쪽으로 모였다.",
      "주변 빛이 카드 뒤쪽에 더 많이 모여 밝아졌다.",
      "카드가 곧게 가는 빛을 가렸기 때문이다."
    ],
    "workbookRef": {
      "id": "light-book-13",
      "no": 13,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b018": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-18",
    "no": 18,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "벽에 가려 직접 보이지 않는 카드를 거울로 보았습니다. 거울의 역할은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 0,
    "previousChoices": [
      "빛의 방향을 바꾸어 눈으로 보낸다.",
      "가려진 카드를 복제하여 거울 뒤에 놓는다.",
      "카드를 비추도록 눈에서 새로운 빛을 꺼낸다.",
      "카드의 실제 위치를 가림판 앞으로 옮긴다.",
      "빛이 없이도 보이도록 카드의 색을 바꾼다."
    ],
    "choices": [
      "빛의 진행 방향을 바꾸어 눈으로 보낸다.",
      "가려진 카드를 복제하여 거울 뒤에 놓는다.",
      "카드를 비추도록 눈에서 새로운 빛을 꺼낸다.",
      "카드의 실제 위치를 가림판 앞으로 옮긴다.",
      "빛이 없이도 보이도록 카드의 색을 바꾼다."
    ],
    "workbookRef": {
      "id": "light-book-18",
      "no": 18,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b020": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-20",
    "no": 20,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "거울에서 빛이 반사되는 방향을 살필 때 알맞은 방법은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 1,
    "previousChoices": [
      "경로를 찾기 위해 LED의 빛을 친구 눈에 비춘다.",
      "교사와 LED 경로를 종이 위에서 본다.",
      "거울로 햇빛을 눈에 모아 가장 밝은 점을 찾는다.",
      "밝은 광원을 거울에 대고 눈으로 직접 들여다본다.",
      "빛을 더 잘 보기 위해 깨진 거울을 손으로 잡는다."
    ],
    "choices": [
      "경로를 찾기 위해 LED의 빛을 친구 눈에 비춘다.",
      "교사와 LED 빛을 종이 위에서 관찰한다.",
      "거울로 햇빛을 눈에 모아 가장 밝은 점을 찾는다.",
      "밝은 광원을 거울에 대고 눈으로 직접 들여다본다.",
      "빛을 더 잘 보기 위해 깨진 거울을 손으로 잡는다."
    ],
    "workbookRef": {
      "id": "light-book-20",
      "no": 20,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b024": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-24",
    "no": 24,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "물에 비스듬히 꽂은 곧은 막대가 꺾여 보였습니다. 알맞은 설명은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 2,
    "previousChoices": [
      "막대가 물에 젖어 실제로 두 조각으로 부러졌다.",
      "물이 막대를 녹여 잠긴 부분의 위치를 바꾸었다.",
      "물·공기 경계에서 빛이 굴절했다.",
      "눈이 막대로 보낸 빛이 잠긴 부분을 구부렸다.",
      "물속 부분이 사라지고 다른 막대가 나타났다."
    ],
    "choices": [
      "막대가 물에 젖어 실제로 두 조각으로 부러졌다.",
      "물이 막대를 녹여 잠긴 부분의 위치를 바꾸었다.",
      "막대에서 온 빛이 물과 공기 경계에서 굴절했다.",
      "눈이 막대로 보낸 빛이 잠긴 부분을 구부렸다.",
      "물속 부분이 사라지고 다른 막대가 나타났다."
    ],
    "workbookRef": {
      "id": "light-book-24",
      "no": 24,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b029": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-29",
    "no": 29,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "가게의 가려진 모퉁이를 살피는 거울의 주된 쓰임은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 4,
    "previousChoices": [
      "가려진 물체가 앞으로 실제로 옮겨 오게 한다.",
      "다른 곳의 빛 없이도 모퉁이를 스스로 밝힌다.",
      "뒤쪽 물체의 실제 크기를 바꾸어 눈앞에 놓는다.",
      "사람이 눈에서 빛을 내어 통로를 비추게 한다.",
      "직접 보기 어려운 쪽을 본다."
    ],
    "choices": [
      "가려진 물체가 앞으로 실제로 옮겨 오게 한다.",
      "다른 곳의 빛 없이도 모퉁이를 스스로 밝힌다.",
      "뒤쪽 물체의 실제 크기를 바꾸어 눈앞에 놓는다.",
      "사람이 눈에서 빛을 내어 통로를 비추게 한다.",
      "직접 보기 어려운 쪽의 모습을 본다."
    ],
    "workbookRef": {
      "id": "light-book-29",
      "no": 29,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b036": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-36",
    "no": 36,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "돋보기의 쓰임을 조사한 기록으로 가장 알맞은 것은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 1,
    "previousChoices": [
      "돋보기는 둥글어 모든 조건에서 같다고 적었다.",
      "관찰 대상과 도움을 함께 적었다.",
      "친구가 썼다는 말을 내 직접 관찰로 옮겨 적었다.",
      "렌즈 사진을 저장한 일을 발표한 것으로 적었다.",
      "제품 이름을 찾았으므로 쓰임 조사를 끝냈다고 적었다."
    ],
    "choices": [
      "돋보기는 둥글어 모든 조건에서 같다고 적었다.",
      "돋보기로 확대해 관찰한 대상과 도움을 함께 적었다.",
      "친구가 썼다는 말을 내 직접 관찰로 옮겨 적었다.",
      "렌즈 사진을 저장한 일을 발표한 것으로 적었다.",
      "제품 이름을 찾았으므로 쓰임 조사를 끝냈다고 적었다."
    ],
    "workbookRef": {
      "id": "light-book-36",
      "no": 36,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b037": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-37",
    "no": 37,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "돋보기로 작은 글자를 관찰할 때 지킬 행동은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 2,
    "previousChoices": [
      "렌즈로 햇빛을 모아 작은 글자 위의 종이를 태운다.",
      "더 밝게 보기 위해 렌즈로 태양을 직접 바라본다.",
      "실내 조명 아래에서 글자를 본다.",
      "관찰을 돕기 위해 친구 눈으로 햇빛을 모아 준다.",
      "렌즈를 깨서 작은 조각으로 만든 뒤 손에 들고 본다."
    ],
    "choices": [
      "렌즈로 햇빛을 모아 작은 글자 위의 종이를 태운다.",
      "더 밝게 보기 위해 렌즈로 태양을 직접 바라본다.",
      "실내 조명 아래에서 종이 글자를 본다.",
      "관찰을 돕기 위해 친구 눈으로 햇빛을 모아 준다.",
      "렌즈를 깨서 작은 조각으로 만든 뒤 손에 들고 본다."
    ],
    "workbookRef": {
      "id": "light-book-37",
      "no": 37,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b042": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-42",
    "no": 42,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "A는 조명을 켜고 눈을 옮겼고, B는 조명을 끄고 처음 눈 위치에서 보았습니다. 설명으로 알맞은 것은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 3,
    "previousChoices": [
      "눈 위치와 조명이 달라도 밝기만 비교한 실험이다.",
      "눈 위치는 가려짐과 아무 관계없으므로 무시한다.",
      "기대한 결과와 같으면 비교 조건의 차이는 지운다.",
      "두 조건이 달라 빛만의 영향으로 단정하기 어렵다.",
      "결과가 다르면 눈 위치와 관계없이 조명이 원인이다."
    ],
    "choices": [
      "눈 위치와 조명이 달라도 밝기만 비교한 실험이다.",
      "눈 위치는 가려짐과 아무 관계없으므로 무시한다.",
      "기대한 결과와 같으면 비교 조건의 차이는 지운다.",
      "조명과 눈의 위치가 함께 달라져 조명의 영향만 알기는 어렵다.",
      "결과가 다르면 눈 위치와 관계없이 조명이 원인이다."
    ],
    "workbookRef": {
      "id": "light-book-42",
      "no": 42,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b057": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-57",
    "no": 57,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "빛을 내지 않는 나무 모형을 볼 수 있는 까닭으로 옳은 것은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 4,
    "previousChoices": [
      "눈에서 빛이 나와 나무 모형을 비추어 본다.",
      "빛 없이도 나무 모형이 항상 스스로 빛을 낸다.",
      "모형의 색을 알고 있으면 빛의 경로는 필요 없다.",
      "모형에 빛이 닿으면 눈에 오지 않아도 보인다.",
      "모형에서 반사된 빛이 눈에 온다."
    ],
    "choices": [
      "눈에서 빛이 나와 나무 모형을 비추어 본다.",
      "빛 없이도 나무 모형이 항상 스스로 빛을 낸다.",
      "모형의 색을 알고 있으면 빛의 경로는 필요 없다.",
      "모형에 빛이 닿으면 눈에 오지 않아도 보인다.",
      "모형에서 반사된 빛이 눈에 들어온다."
    ],
    "workbookRef": {
      "id": "light-book-57",
      "no": 57,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b059": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-59",
    "no": 59,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "세 구멍과 눈이 일직선일 때 LED 불빛이 보였습니다. 가운데 판만 옆으로 옮기면?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 0,
    "previousChoices": [
      "같은 눈 위치에서 안 보일 수 있다.",
      "가운데 판을 옮기면 빛이 구멍을 찾아 휘어 간다.",
      "불투명한 판을 옮기면 판 자체가 광원이 된다.",
      "가운데 구멍이 어긋나면 빛의 세기가 늘어난다.",
      "양끝 판이 같으면 가운데 판 위치는 영향 없다."
    ],
    "choices": [
      "같은 눈 위치에서 불빛이 안 보일 수 있다.",
      "가운데 판을 옮기면 빛이 구멍을 찾아 휘어 간다.",
      "불투명한 판을 옮기면 판 자체가 광원이 된다.",
      "가운데 구멍이 어긋나면 빛의 세기가 늘어난다.",
      "양끝 판이 같으면 가운데 판 위치는 영향 없다."
    ],
    "workbookRef": {
      "id": "light-book-59",
      "no": 59,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s51-u02-b070": {
    "unit": "c22-s51-u02",
    "workbookId": "light-book-70",
    "no": 70,
    "previousVersion": "20261106-light-readable-workbook",
    "prompt": "장치 시험에서 알맞은 행동은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 빛의 성질 은행 창작 학습",
      "course": "초등 5-1"
    },
    "responseContract": "single-choice",
    "answer": 4,
    "previousChoices": [
      "레이저로 친구 눈을 겨눠 경로가 맞는지 확인한다.",
      "렌즈를 통해 태양을 직접 보며 장치를 시험한다.",
      "깨진 거울 조각을 손으로 모아 장치에 붙인다.",
      "강한 빛이 반사되는 쪽에 눈을 대고 들여다본다.",
      "LED를 종이 쪽에 비추어 본다."
    ],
    "choices": [
      "레이저로 친구 눈을 겨눠 경로가 맞는지 확인한다.",
      "렌즈를 통해 태양을 직접 보며 장치를 시험한다.",
      "깨진 거울 조각을 손으로 모아 장치에 붙인다.",
      "강한 빛이 반사되는 쪽에 눈을 대고 들여다본다.",
      "LED를 종이 쪽에 비추고 경로를 살핀다."
    ],
    "workbookRef": {
      "id": "light-book-70",
      "no": 70,
      "edition": "지필드 빛의 성질 교재 편집본"
    }
  },
  "c22-s52-u01-b004": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-04",
    "no": 4,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "사진처럼 맑아진 물을 보고 “마셔도 안전하다.”고 했습니다. 이 말에 필요한 근거가 충분한가요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "맑음만으로 안전을 판단할 근거가 부족함과 녹은/보이지 않는 성분 또는 처리·수질 확인을 함께 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-04",
      "no": 4
    }
  },
  "c22-s52-u01-b010": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-10",
    "no": 10,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "모래 속 자갈을 얻으려는 사람과 소금물 속 소금을 얻으려는 사람이 같은 도구만 써도 될까요? 성질을 넣어 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "동일한 도구만으로는 안 됨과 모래/자갈의 크기·체, 소금물의 물 증발을 각각 연결한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-10",
      "no": 10
    }
  },
  "c22-s52-u01-b016": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-16",
    "no": 16,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "작은 모래도 큰 자갈도 모두 체 위에 남았습니다. 체 구멍이 너무 작다는 가설을 어떻게 확인할까요?",
    "sourceRef": {
      "type": "authored-pair",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2",
      "of": {
        "sourceId": "1UnZss7H2K_mLObS_lCSUD1yeQqNVVakl",
        "set": 2,
        "no": "1(1)"
      },
      "originalAuthoredType": "authored-supplement"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "구멍 크기만 바꾸고 같은 종류·양·마른 재료와 같은 체질 방법으로 위/아래를 비교하는 설계를 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-16",
      "no": 16
    }
  },
  "c22-s52-u01-b022": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-22",
    "no": 22,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "“물과 기름이 나뉘었으니 모든 두 액체는 가만히 두면 두 층이 된다.”를 고치세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "관찰한 물과 기름에서의 층 분리로 범위를 한정하고 다른 액체 조합은 따로 확인해야 함을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-22",
      "no": 22
    }
  },
  "c22-s52-u01-b028": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-28",
    "no": 28,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "소금과 모래의 색이 비슷해 손으로 고르기 어렵습니다. 물에 녹는 성질을 이용한 계획과 까닭을 설명하세요.",
    "sourceRef": {
      "type": "authored-pair",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2",
      "of": {
        "sourceId": "1UnZss7H2K_mLObS_lCSUD1yeQqNVVakl",
        "set": 5,
        "no": 8
      },
      "originalAuthoredType": "authored-supplement"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "충분한 물로 소금 용해→모래 거름→소금물 증발의 순서와 서로 다른 용해 성질을 함께 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-28",
      "no": 28
    }
  },
  "c22-s52-u01-b034": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-34",
    "no": 34,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "거른 소금물이 맑아 보입니다. “소금까지 제거되었다.”는 결론을 왜 고쳐야 하나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "녹은 소금은 물과 종이를 통과하므로 맑아도 소금물임을 설명한다. 증발 관찰을 추가 근거로 제안할 수 있다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-34",
      "no": 34
    }
  },
  "c22-s52-u01-b040": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-40",
    "no": 40,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "“소금물을 증발시키면 소금과 액체 물을 둘 다 따로 얻는다.”를 이 활동에 맞게 고치세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "이 활동에서는 물이 공기 중으로 증발하고 소금이 남으며 액체 물 수집 장치는 없었음을 모두 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-40",
      "no": 40
    }
  },
  "c22-s52-u01-b045": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-45",
    "no": 45,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "전력 공급이 불안정하고 교체 부품 배송이 늦는 지역에 장치를 제안합니다. 조사에 꼭 넣을 두 조건과 까닭을 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "전력 조건과 부품 교체/현지 관리 두 조건을 작동·지속 사용의 까닭과 연결한다. 타당한 같은 범위의 조건을 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-45",
      "no": 45
    }
  },
  "c22-s52-u01-b046": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-46",
    "no": 46,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "조사한 자료를 저장했지만 아직 친구에게 보여 주지 않았어요. 자료를 만든 일과 친구에게 소개한 일을 어떻게 나누어 적을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "실제 제작/저장은 표시하되 미공유 상태를 보존하고 실제 전달/의견은 그 뒤의 사실로 기록함을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-46",
      "no": 46
    }
  },
  "c22-s52-u01-b049": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-49",
    "no": 49,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "A모둠은 구멍만 다른 두 체를 비교하려고 재료 종류와 양, 흔드는 횟수도 모두 바꿨습니다. 계획을 고치세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "체 구멍만 다르게 하고 재료 종류·양·마른 상태·체질 방법을 가능한 같게 고친 설계를 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-49",
      "no": 49
    }
  },
  "c22-s52-u01-b050": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-50",
    "no": 50,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "가상 기록: 옮긴 기름 용기 바닥에 작은 물방울이 보였습니다. 이 관찰로 분리 결과와 다음 방법을 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "물방울이 함께 옮겨져 완전 분리가 아님과 경계 가까이 천천히 옮긴 뒤 다시 확인할 방법을 연결한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-50",
      "no": 50
    }
  },
  "c22-s52-u01-b053": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-53",
    "no": 53,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "앞 자료의 소금이1g 적었던 까닭을 “소금이 모두 물로 변해서”라고 했습니다. 가능한 다른 원인과 확인 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "흘림·종이/용기 잔류 등 가능한 원인 하나와 각 단계 관찰/기록으로 확인할 방법 하나를 연결한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-53",
      "no": 53
    }
  },
  "c22-s52-u01-b054": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-54",
    "no": 54,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "가상 자료: 젖은 모래8g과 마른 모래6g을 보고 모래가2g 생겼다고 했습니다. 무엇을 확인해야 하나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "물기·용기 무게·측정 조건을 살피고 같은 건조 조건으로 비교해야 함을 설명한다. 모래 생성으로 단정하지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-54",
      "no": 54
    }
  },
  "c22-s52-u01-b056": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-56",
    "no": 56,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "교실에서 모래 섞인 물을 거르는 모형을 만들었어요. 이 모형이 실제 정수장의 모든 일을 보여 준다고 할 수 있을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "교실 모형의 눈에 보이는 고체 분리 범위와 실제 시설의 여러 처리·관리·검사를 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-56",
      "no": 56
    }
  },
  "c22-s52-u01-b057": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-57",
    "no": 57,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "소금·모래 혼합물에서 두 물질을 얻는 흐름을 글상자·화살표로 나타내세요. 물을 넣기·거름·증발과 각 단계의 남는 물질 이름을 붙이세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "물 넣어 소금 용해→거름의 모래/소금물 두 갈래→소금물의 물 증발/소금 잔류를 이름표와 화살표로 나타낸다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-57",
      "no": 57
    }
  },
  "c22-s52-u01-b058": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-58",
    "no": 58,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "친구가 “거른 물은 왜 소금물인지 모르겠어.”라고 물었습니다. 자료를 어떻게 고치고 기록할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "녹은 소금이 물과 종이를 통과한다는 설명/이름표를 보완하고 실제 질문·수정·재설명 여부를 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-58",
      "no": 58
    }
  },
  "c22-s52-u01-b068": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-68",
    "no": 68,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "지름3mm와10mm인 마른 둥근 알갱이를 나눌 때 구멍6mm가 구멍1mm보다 적절한 까닭을 설명하세요.",
    "sourceRef": {
      "type": "authored-pair",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2",
      "of": {
        "sourceId": "1UnZss7H2K_mLObS_lCSUD1yeQqNVVakl",
        "set": 4,
        "no": 8
      },
      "originalAuthoredType": "authored-supplement"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "3mm<6mm<10mm로 작은 것만 통과함과 구멍1mm에서는 둘 다 남음을 비교해 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-68",
      "no": 68
    }
  },
  "c22-s52-u01-b072": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-72",
    "no": 72,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "물 위 기름층을 스포이트로 옮길 때 경계 가까이에서 천천히 하는 까닭은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "경계 가까이에서 천천히 옮기면 기름 아래의 물이 함께 옮겨지는 것을 줄일 수 있음을 설명한다. 경계와 옮긴 액체를 살핀다는 설명도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-72",
      "no": 72
    }
  },
  "c22-s52-u01-b076": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-76",
    "no": 76,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "소금·모래 혼합물에 물을 넣고 거르지 않은 채 물부터 증발시키면 두 고체가 잘 분리될까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "모래를 거르지 않으면 증발 뒤 소금과 함께 남음을 설명하고 먼저 모래 거름→소금물 증발로 고친다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-76",
      "no": 76
    }
  },
  "c22-s52-u01-b080": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-80",
    "no": 80,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "거르는 장치를 소개하며 “종이를 통과했으니 소금도 없고 바로 마셔도 된다.”라고 썼어요. 두 가지 잘못된 설명을 각각 고치세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "녹은 소금 통과와 맑음만으로 음용 안전을 확인할 수 없음의 두 주장을 각각 고친다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-80",
      "no": 80
    }
  },
  "c22-s52-u01-b083": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-83",
    "no": 83,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "소금·모래→물 넣고 저음→거름→소금물의 물 증발을 네 칸으로 그리세요. 거름 뒤 양쪽 물질과 물이 간 곳을 이름표로 붙이세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "네 단계의 흐름과 거름 뒤 모래/소금물·증발 뒤 소금/공기 중 물을 이름표로 구별해 그린다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-83",
      "no": 83
    }
  },
  "c22-s52-u01-b084": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-84",
    "no": 84,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "“분리가 잘되면 언제나 처음과 정확히 같은 무게의 마른 소금을 얻는다.”라고 했어요. 어떤 실험 조건을 더 확인해야 할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "흘림·용기나 종이에 남은 소금물·남은 물기·재는 방법 등 얻은 소금의 무게에 영향을 줄 조건을 근거로 설명한다. 반드시 같은 값이라고 요구하지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-84",
      "no": 84
    }
  },
  "c22-s52-u01-b088": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-88",
    "no": 88,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "분리 장치 하나를 골라 어떤 성질을 이용하는지, 어떤 도움이 되는지, 사용할 때 살필 조건 하나를 설명하세요. 알아본 자료를 쓰고, 아직 조사하지 않았다면 그 사실도 적으세요.",
    "sourceRef": {
      "type": "authored-pair",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2",
      "of": {
        "sourceId": "1UnZss7H2K_mLObS_lCSUD1yeQqNVVakl",
        "set": 5,
        "no": 7
      },
      "originalAuthoredType": "authored-supplement"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "선택한 장치의 성질·도움·사용 조건을 근거로 연결하고 실제 출처 또는 아직 미조사임을 밝힌다. 타당한 다른 장치를 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-88",
      "no": 88
    }
  },
  "c22-s52-u01-b092": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-92",
    "no": 92,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "소금물을 놓은 접시 그림만 보고 “내 접시의 물이 오늘 모두 증발했다.”라고 썼습니다. 이 설명을 고치고, 직접 확인할 것을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "그림만으로 내 접시의 상태를 정할 수 없음을 설명하고 물의 남음·고체의 유무 등 직접 관찰할 내용을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-92",
      "no": 92
    }
  },
  "c22-s52-u01-b095": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-95",
    "no": 95,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "친구가 “체와 거름종이가 하는 일이 헷갈려.”라고 했습니다. 공통점과 이 단원에서의 차이를 넣어 자료를 고치세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "통과/남음이라는 공통점과 마른 크기 다른 고체의 체·소금물/모래의 거름 차이를 연결해 보완한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-95",
      "no": 95
    }
  },
  "c22-s52-u01-b096": {
    "unit": "c22-s52-u01",
    "workbookId": "mixture-book-96",
    "no": 96,
    "previousVersion": "20261106-mixture-readable-workbook",
    "prompt": "처음 답 하나를 골라 지금의 설명과 비교하세요. 어떤 성질이나 실험 결과 때문에 생각을 고쳤는지, 아직 궁금한 것은 무엇인지 써 보세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 혼합물 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건에 맞는 과학적 설명1, 구체적 근거/한계1. 동등 표현·타당한 대안 인정. 실제 수행은 별도 확인."
    ],
    "required": [
      "처음/현재 설명의 비교와 이용한 성질·과정의 근거·남은 의문을 연결한다. 과학적으로 타당한 다른 사례를 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u01",
      "id": "mixture-book-96",
      "no": 96
    }
  },
  "c22-s52-u02-b004": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w004",
    "no": 4,
    "prompt": "차가운 물병을 수건으로 감싸면 더 빨리 따뜻해질까요? 지금 생각과 그렇게 예상한 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "예상과 까닭을 구분해 쓰면 인정. 아직 하지 않은 비교를 실제 결과로 쓰지 않음."
    ],
    "required": [
      "처음 예상과 그렇게 생각한 까닭을 함께 쓰면 인정한다. 아직 하지 않은 비교를 실제 결과로 쓰지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w004",
      "no": 4
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b008": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w008",
    "no": 8,
    "prompt": "같은 방에 오래 둔 금속 조각과 나무 조각 중 금속이 더 차갑게 느껴졌습니다. 이것만으로 금속의 온도가 더 낮다고 정할 수 없는 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "촉감과 온도 구분·열 이동의 차이·온도 측정 필요 중 두 요소 이상 연결."
    ],
    "required": [
      "촉감과 온도가 같지 않음을 손과 재료 사이의 열 이동으로 설명한다. 실제 온도를 재어 보자는 제안도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w008",
      "no": 8
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b014": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w014",
    "no": 14,
    "prompt": "가상 자료 A: 52→47→43℃, B: 22→27→30℃가 0·2·4분에 기록되었습니다. 이 자료로 아는 것과 10분 뒤에 대해 아직 모르는 것을 각각 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 변화 방향·차이 감소·미측정 시점의 한계를 모두 구별."
    ],
    "required": [
      "4분까지 A감소/B증가와 온도 차이 감소를 설명하고10분 값·같아진 시각은 미확인으로 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w014",
      "no": 14
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b020": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w020",
    "no": 20,
    "previousVersion": "20261106-heat-readable-workbook",
    "prompt": "구리·알루미늄·플라스틱 띠를 같은 물에 넣어 온도에 따라 색이 변하는 표시를 비교하려고 해요. 재료 종류 외에 같게 할 조건 세 가지와 그 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "타당한 통제 조건 세 가지·공정 비교의 이유. 실제 재료에서 같지 못한 조건은 한계로 인정."
    ],
    "required": [
      "재료 외의 타당한 통제 조건3가지와 재료 효과를 구별하려는 까닭을 함께 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w020",
      "no": 20
    }
  },
  "c22-s52-u02-b026": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w026",
    "no": 26,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "색소를 넣자마자 물을 세게 저었습니다. 색소가 빨리 퍼진 것을 가열에 의한 대류만의 결과라고 할 수 없는 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "저음이라는 다른 원인·비교/통제 또는 온도 확인 필요를 연결."
    ],
    "required": [
      "젓는 힘이 물을 움직이는 다른 원인임과 저음/넣는 힘 통제·온도/움직임 확인을 연결한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w026",
      "no": 26
    }
  },
  "c22-s52-u02-b028": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w028",
    "no": 28,
    "prompt": "바닥 한쪽에서 데워진 물이 그쪽에서 올라가고 반대쪽 물이 내려오는 관찰을 그림으로 나타내세요. 데운 위치와 물의 움직임에 이름표·화살표를 붙이세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "데운 위치·상승/다른 쪽 하강·화살표 의미·이름표. 타당한 순환 경로 허용."
    ],
    "required": [
      "데운 쪽 상승·위쪽 옆 이동·반대쪽 하강을 관찰 조건에 맞게 그리고 위치/물의 움직임 이름표와 화살표를 붙인다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w028",
      "no": 28
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b032": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w032",
    "no": 32,
    "prompt": "따뜻한 공기가 올라가는 모습을 보려던 방에서 선풍기를 켰습니다. 결과 해석에 어떤 점을 덧붙여야 하나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "팬의 영향·실제 조건 기록/비교를 모두 포함."
    ],
    "required": [
      "팬이 만드는 흐름을 다른 원인으로 밝히고 작동/위치 조건 기록과 비교 방법을 제시한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w032",
      "no": 32
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b038": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w038",
    "no": 38,
    "prompt": "검은 종이와 흰 종이가 빛을 받을 때의 온도 변화를 비교하려고 합니다. 색 이외의 조건과 측정 방법을 어떻게 정해야 하나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "타당한 통제 조건 세 가지 이상·처음/이후 같은 시점 측정을 포함."
    ],
    "required": [
      "색 이외의 재료·크기·두께·빛을 받는 거리와 시간 등 타당한 조건을 같게 하고, 처음과 같은 시점의 온도를 비교할 방법을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w038",
      "no": 38
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b044": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w044",
    "no": 44,
    "prompt": "얼음을 천으로 감싼 것과 그대로 둔 것을 같은 방에서 비교하려고 합니다. 천이 얼음을 직접 데운다고 말하기 어려운 까닭과 확인 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "열 이동 방향·천의 역할·공정 비교와 실제 확인을 연결."
    ],
    "required": [
      "천이 주위→얼음의 열 이동을 줄일 수 있음을 밝히고 같은 초기 상태/크기/받침/시간의 실제 비교를 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w044",
      "no": 44
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b050": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w050",
    "no": 50,
    "prompt": "1차 시험 뒤 뚜껑 틈을 줄이면서 물의 양도 두 배로 늘렸습니다. 성능이 좋아진 원인을 뚜껑만으로 설명하기 어려운 까닭과 다음 시험 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 변인의 혼동·한 조건 수정/다른 조건 통제·실제 재시험을 연결."
    ],
    "required": [
      "뚜껑 틈과 물 양이 함께 변한 문제를 밝히고 물 양 등 나머지 조건을 맞춘 한 조건 재시험을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w050",
      "no": 50
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b052": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w052",
    "no": 52,
    "prompt": "같은 컵을 이용해 따뜻한 물의 온도 변화를 늦출 장치를 설계하세요. 벽·바닥·뚜껑 중 두 곳 이상에 재료와 역할을 이름표로 쓰고, 비교할 조건도 적으세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 부분의 구조/역할·비교 조건·설계/실제 시험 구분. 타당한 대안 설계 허용."
    ],
    "required": [
      "따뜻한 물의 보온 목적에 맞는2부분 이상 재료/역할 이름표와 같은 컵·양·처음 온도·시간·주위의 비교를 제시한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w052",
      "no": 52
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b054": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w054",
    "no": 54,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "2분에는 44℃, 6분에는 38℃였습니다. 4분은 관찰하지 않았는데 41℃라고 쓴 기록을 어떻게 고쳐야 하나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "미측정 유지·예상값 분리·기존 두 실제 값 보존."
    ],
    "required": [
      "4분은 미측정으로 고치고41℃는 예상값으로 별도 표시한다. 기존 실제2/6분 값은 보존한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w054",
      "no": 54
    }
  },
  "c22-s52-u02-b056": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w056",
    "no": 56,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "반복한 연습 시험에서 A의 온도는 7·8·7℃, B는 7·7·8℃ 내려갔어요. B가 언제나 더 좋다고 말할 수 있을까요? 자료를 이용해 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "범위 겹침·항상이라는 일반화 제한·추가 확인."
    ],
    "required": [
      "반복한 자료에서 A와 B의 온도가 내려간 정도를 비교하고 B가 언제나 더 좋다고 단정할 수 없음을 설명한다. 같은 조건에서 다시 비교하자는 제안도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w056",
      "no": 56
    }
  },
  "c22-s52-u02-b059": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w059",
    "no": 59,
    "previousVersion": "20261106-heat-readable-workbook",
    "prompt": "햇빛이 비친 금속 컵 속 물이 따뜻해졌습니다. 이 현상을 복사 한 방식만 일어났다고 단정하지 않고 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "빛/금속/물 구간을 두 방식 이상과 연결·관찰 한계."
    ],
    "required": [
      "햇빛이 컵에 전달되는 복사와 컵을 따라 전달되는 전도 등 두 가지 이상의 열 이동을 연결한다. 물의 움직임을 관찰한 경우 대류 설명도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w059",
      "no": 59
    }
  },
  "c22-s52-u02-b060": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w060",
    "no": 60,
    "previousVersion": "20261106-heat-readable-workbook",
    "prompt": "가상 자료: 0·2·4·6분의 A는 50·46·42·39℃, B는 20·24·28·31℃입니다. 가로축 시간(분), 세로축 온도(℃)로 두 변화를 구별해 그리세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "축/단위·두 자료 8점·범례·측정 범위. 색 외에도 이름/선 표식으로 구별."
    ],
    "required": [
      "시간(분)/온도(℃) 축·A/B이름과8점을 정확히 구별해 표시한다. 측정 범위6분 밖을 실제 값으로 연장하지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w060",
      "no": 60
    }
  },
  "c22-s52-u02-b062": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w062",
    "no": 62,
    "prompt": "겨울 담요와 여름 보냉 가방이 모두 단열과 관련된 까닭을 열 이동 방향으로 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 상황의 온도 관계·각 방향·공통 단열 역할."
    ],
    "required": [
      "담요의 몸→차가운 주위, 보냉 가방의따뜻한 주위→내용물의 두 방향과 이동 감소를 모두 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w062",
      "no": 62
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b064": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w064",
    "no": 64,
    "previousVersion": "20261106-heat-readable-workbook",
    "prompt": "단열을 이용한 생활 사례 하나를 조사할 때 사진 외에 무엇을 확인하고 기록할지 네 가지 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "목적·구조/역할·본문 출처·조건/한계 중 네 요소. 실명/연락처 불필요."
    ],
    "required": [
      "목적·구조/재료·줄이려는 경로·출처 근거·사용 조건/한계·확인 날짜 중 타당한4가지를 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w064",
      "no": 64
    }
  },
  "c22-s52-u02-b080": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w080",
    "no": 80,
    "prompt": "따뜻한 물이 담긴 금속 컵을 찬물 속에 놓았습니다. 두 물이 섞이지 않았는데도 온도가 변할 수 있는 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 물 섞임 없음·높은→낮은 방향·벽을 통한 전달."
    ],
    "required": [
      "두 물이 섞이지 않아도 금속 벽을 통해 온도가 높은 쪽에서 낮은 쪽으로 열이 이동할 수 있음을 설명한다. 주위와 용기의 영향을 덧붙여도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w080",
      "no": 80
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b084": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w084",
    "no": 84,
    "prompt": "같은 크기의 재료 두 종류를 비교하려는데 한쪽은 30초, 다른 쪽은 2분에 색 변화를 확인했습니다. 이 결과의 문제와 보완을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "시간 차이 지적·동일 시점/조건·반복 비교."
    ],
    "required": [
      "30초와2분의 서로 다른 관찰 시점 문제와 같은 처음 조건/간격의 동시 관찰·반복 보완을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w084",
      "no": 84
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b089": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w089",
    "no": 89,
    "prompt": "태양빛을 받은 금속 난간의 한 부분이 따뜻해지고 옆 부분도 따뜻해졌습니다. 빛을 받는 과정과 금속을 따라 전달되는 과정을 구별해 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "빛→난간 복사·난간을 따름 전도 두 연결."
    ],
    "required": [
      "빛→난간의 복사와 금속을 따라 옆으로 전달되는 전도를 서로 다른 구간으로 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w089",
      "no": 89
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b093": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w093",
    "no": 93,
    "previousVersion": "20261106-heat-readable-workbook",
    "prompt": "같은 컵에 같은 양의 물을 넣어 같은 장소에서 비교했어요. 처음은 모두 44℃였고, 10분 뒤 A는 36℃, B는 39℃였어요. 알 수 있는 점과 더 확인할 점을 하나씩 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 변화 비교·조건/시간 한정·반복/일반화 한계."
    ],
    "required": [
      "같은 시작44℃에서10분 뒤 B가 덜 식었다고 한정하고 반복·다른 조건 미확인의 한계를1가지 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w093",
      "no": 93
    }
  },
  "c22-s52-u02-b096": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w096",
    "no": 96,
    "previousVersion": "20261106-heat-readable-workbook",
    "prompt": "차가운 물의 온도 상승을 늦출 용기를 설계하세요. 줄이려는 열 이동 방향, 단열할 부분 두 곳, 실제로 효과를 비교할 조건을 함께 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "밖→안 방향·두 부분 구조/역할·공정 비교·실제 시험 별도."
    ],
    "required": [
      "따뜻한 주위→차가운 물의 방향, 단열2부분과 역할, 같은 컵/양/처음 온도/시간/주위의 실제 비교 조건을 제시한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w096",
      "no": 96
    }
  },
  "c22-s52-u02-b099": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w099",
    "no": 99,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "자료를 설명한 뒤 “처음 온도가 달랐는데 왜 재료 효과라고 했나요?”라는 질문을 받았습니다. 어떻게 보완하고 기록할지 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "받은 질문·조건 한계·공정 재시험·버전/재전달 상태 구분."
    ],
    "required": [
      "받은 질문을 보존하고 초기 조건 차이를 한계로 고친다. 같은 시작 조건 재시험·수정 버전·재전달/계획을 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w099",
      "no": 99
    }
  },
  "c22-s52-u02-b101": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w101",
    "no": 101,
    "previousVersion": "20261106-heat-readable-workbook",
    "prompt": "“따뜻한 공기가 올라가므로 열은 언제나 위로만 이동한다.”를 고체와 공기의 사례로 고쳐 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "공기 대류의 조건·고체의 다른 방향 전달·언제나 일반화 수정."
    ],
    "required": [
      "따뜻한 공기의 상승은 대류 사례로 한정하고 고체에서는 높은→낮은 온도 방향이 옆/아래일 수도 있음을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w101",
      "no": 101
    }
  },
  "c22-s52-u02-b102": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w102",
    "no": 102,
    "prompt": "“단열 장치를 만들면 물 온도는 영원히 처음 값이다.”라는 설명을 고치고 확인 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "열 이동 줄임·영원히 고정 아님·시점별 실제 비교."
    ],
    "required": [
      "단열은 이동을 줄여 변화를 늦출 뿐 영원히 고정하지 않음을 고치고 시간별 실제 온도/주위 조건의 반복 확인을 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w102",
      "no": 102
    },
    "previousVersion": 1
  },
  "c22-s52-u02-b104": {
    "unit": "c22-s52-u02",
    "workbookId": "c22-s52-u02-w104",
    "no": 104,
    "previousVersion": "20261115-linked-workbook-answers",
    "prompt": "한 번의 단열 비교 결과를 친구에게 설명하려고 해요. 어떤 조건에서 시험했는지 알려 주고, 아직 모르는 점과 다음에 확인할 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 열과 우리 생활 독립 창작 교재",
      "course": "초등 5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "시험 조건 세 가지 이상·자료 한계·구체적 다음 확인."
    ],
    "required": [
      "컵이나 재료, 물의 양·처음 온도·주위 상태·잰 시각 등 실제 시험 조건을 밝히고, 한 번의 결과로 알 수 없는 점과 다음에 확인할 방법을 각각 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u02",
      "id": "c22-s52-u02-w104",
      "no": 104
    }
  },
  "c22-s52-u03-b004": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w004",
    "no": 4,
    "prompt": "안개 낀 날은 반드시 오후에 비가 올까요? 지금 생각과 확인하고 싶은 자료를 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "예상과 근거/추가로 확인할 자료를 구별. 처음 예상을 실제 오후 결과로 쓰지 않음."
    ],
    "required": [
      "처음 예상과 확인하고 싶은 지역/오후 예보 또는 강수 자료를 쓴다. 안개 관찰만으로 실제 오후 비를 확정하지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w004",
      "no": 4
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b010": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w010",
    "no": 10,
    "prompt": "A는 그늘에서10시에, B는 햇빛에 달궈진 벽 바로 옆에서14시에 기온을 쟀어요. 두 값이 다른 까닭을 장소 하나로 설명할 수 있을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "달라진 조건2개 이상·단일 원인 확정 불가·다시 비교할 조건."
    ],
    "required": [
      "시각과 빛/벽면 조건 등 둘 이상 달라졌음을 밝히고 장소만의 원인 확정을 제한하며 같은 기준의 재비교를 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w010",
      "no": 10
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b016": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w016",
    "no": 16,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "기온이 다른 두 방의 습도가 모두50%예요. 수증기의 실제 양도 같다고 결론 내릴 수 없는 까닭을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "습도와 절대량 구별·기온/부피 등 조건·확인하지 못한 양을 확정하지 않음."
    ],
    "required": [
      "같은 50%라도 기온이나 공간의 조건이 다르면 수증기의 실제 양이 같다고 할 수 없음을 설명한다. 습도와 수증기의 실제 양을 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w016",
      "no": 16
    }
  },
  "c22-s52-u03-b022": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w022",
    "no": 22,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "교사가 준비한 컵 비교에서 한쪽 외벽에만 물방울이 생겼어요. 어떤 조건과 다른 원인을 확인하고 응결로 설명할지 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "공정 비교·다른 물의 경로·수증기→액체·실제 확인 범위."
    ],
    "required": [
      "컵·물의 양·관찰 시각 등 타당한 조건을 같게 비교하고 튄 물·누수 등 다른 물의 경로를 확인한 뒤, 공기 중 수증기가 응결했다는 설명과 연결한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w022",
      "no": 22
    }
  },
  "c22-s52-u03-b028": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w028",
    "no": 28,
    "prompt": "병 안 벽면에는 물방울이 보였지만 공기 중 흐림은 분명하지 않았어요. 이 관찰로 안개 모형이 뚜렷하게 생겼다고 할 수 있을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "관찰/불분명 구별·안개 확정 금지·추가 확인 계획."
    ],
    "required": [
      "벽면 물방울과 공기 중 작은 물방울을 구별하고, 공기 중 흐림이 분명하지 않아 안개 모형이 뚜렷하게 생겼다고 확정할 수 없음을 설명한다. 다시 관찰할 방법을 덧붙여도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w028",
      "no": 28
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b034": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w034",
    "no": 34,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "작은 창문으로 찍은 사진에 구름이 가득 보여요. 그 지역 하늘 전체의 구름의 양이 많다고 바로 결론 내릴 수 없는 까닭은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "부분/전체 구별·관찰 방향과 시각·추가 확인."
    ],
    "required": [
      "사진은 창문에서 보이는 하늘 일부라는 점과 구름의 양은 정한 범위의 전체 하늘을 보고 판단한다는 점을 연결한다. 다른 방향을 더 관찰하자는 제안도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w034",
      "no": 34
    }
  },
  "c22-s52-u03-b040": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w040",
    "no": 40,
    "prompt": "같은 높이의 가상 두 지역 P1016hPa, Q1007hPa를 그리고 지표 부근 단순 모형의 이동 방향을 화살표로 나타내세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "지역·값/단위·P→Q·화살표 의미·모형 범위."
    ],
    "required": [
      "P1016hPa/Q1007hPa 이름·단위와P→Q 화살표를 그리고 지표 부근 단순 모형의 뜻/범위를 붙인다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w040",
      "no": 40
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b046": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w046",
    "no": 46,
    "prompt": "모래가 물보다 더 빨리 데워졌다는 온도 자료만 있어요. 실제 바닷가에서 그날 해풍이 불었다고 기록할 수 없는 까닭은?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "모형/현장 구별·온도/실제 흐름 구별·필요한 현장 자료."
    ],
    "required": [
      "쟁반 온도 비교와 실제 바닷가 풍향 관측이 다름을 밝히고 그 지역/시각의 기압·풍향/풍속 자료를 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w046",
      "no": 46
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b055": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w055",
    "no": 55,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "연습 자료인 09시 16℃, 12시 22℃, 15시 20℃를 그래프로 그리세요. 가로축과 세로축의 이름·단위를 쓰고, 사이 시간의 기온은 직접 재지 않았다는 점도 표시하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "축/단위·세 점·간격·미측정 시각과 선의 의미."
    ],
    "required": [
      "시각/기온℃ 축·적절한 간격·세 점(09,16)/(12,22)/(15,20)을 표시하고 선과 미측정 시각의 한계를 적는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w055",
      "no": 55
    }
  },
  "c22-s52-u03-b056": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w056",
    "no": 56,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "가상 표에서12시 기온을 재지 못했어요.09시16℃와15시20℃ 사이니까18℃로 채워도 될까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "미측정 보존·추정과 관측 구별·실제 기록 수정 금지."
    ],
    "required": [
      "못 잰12시를 미측정으로 보존하고18℃는 별도 추정으로만 표시하며 실제 관측값으로 채우지 않음을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w056",
      "no": 56
    }
  },
  "c22-s52-u03-b060": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w060",
    "no": 60,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "같은 높이 가상 자료 A1015hPa·B1003hPa·C1011hPa를 세 칸에 쓰고, B와 비교한 지표 부근 단순 모형의 이동 방향을 나타내세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "세 값/단위·두 방향·지표 부근 단순 모형 표시."
    ],
    "required": [
      "A1015/B1003/C1011hPa를 세 칸에 쓰고A→B 및C→B를 지표 부근 단순 모형이라고 표시한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w060",
      "no": 60
    }
  },
  "c22-s52-u03-b063": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w063",
    "no": 63,
    "prompt": "가상 비교에서 모래는 햇빛에서, 물은 그늘에서 관찰했어요. 모래/물의 재료 차이 때문이라고 바로 말할 수 있나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "혼입 조건·단일 원인 확정 불가·공정 비교 계획."
    ],
    "required": [
      "햇빛/그늘이라는 다른 조건을 지적해 재료만의 영향 확정을 제한하고 동일 빛·시각·양/용기·감지 조건 재비교를 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w063",
      "no": 63
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b066": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w066",
    "no": 66,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "하루 동안 관측했더니 학교의 12시 기온이 09시보다 높았어요. 매일 반드시 그렇다고 말하려면 어떤 자료가 더 필요할까요? 하루 자료로 알 수 없는 점도 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "여러 날짜/조건·하루 자료의 한계·인과/절대화 금지."
    ],
    "required": [
      "하루의 비교로 모든 날의 기온 변화를 정할 수 없음을 설명하고, 여러 날짜에 같은 시각·같은 기준으로 관측한 자료를 더 모아 비교할 필요를 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w066",
      "no": 66
    }
  },
  "c22-s52-u03-b070": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w070",
    "no": 70,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "이슬 컵 비교에서 바꾸려는 조건 하나와 같게 살필 조건 두 가지 이상을 적으세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "바꿀 조건1·같게 살필 조건2이상·준비/안전·실제 실행과 계획 구별."
    ],
    "required": [
      "바꿀 조건 한 가지와 같게 할 조건 두 가지 이상을 타당하게 쓴다. 물의 차가운 정도·컵·물의 양·장소·관찰 시각 등에서 비교 목적에 맞는 조건을 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w070",
      "no": 70
    }
  },
  "c22-s52-u03-b071": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w071",
    "no": 71,
    "prompt": "이슬 비교 장치를 그리세요. 컵 안/밖을 나누고 관찰할 위치, 실제 관찰/아직 계획 표시를 넣으세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "안/밖·대상 위치·조건/시각·실제/계획 구별."
    ],
    "required": [
      "비교할 컵의 안과 밖을 나누고 외벽 등 관찰 위치와 실제 관찰인지 아직 계획인지를 표시한다. 관찰하지 않은 결과를 미리 채우지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w071",
      "no": 71
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b072": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w072",
    "no": 72,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "안개 모형을 보기 위해 향을 피우거나 뜨거운 물을 학생이 직접 붓자는 제안 대신 어떻게 관찰을 준비할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "향/가열 배제·교사 준비·관찰 위치와 불분명 보존."
    ],
    "required": [
      "학생 향/불꽃/가열·뜨거운 물 붓기를 배제하고 교사 준비와 표면/공중 관찰 위치·불분명 보존을 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w072",
      "no": 72
    }
  },
  "c22-s52-u03-b075": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w075",
    "no": 75,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "모래/물의 온도는 쟀지만 공기 흐름은 보지 못했어요. 처음 기록과 결론, 다음 계획을 어떻게 쓰나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "온도/흐름 구별·미관찰 보존·추가 확인/교사와 안전."
    ],
    "required": [
      "온도 원자료와 흐름 미관찰을 각각 보존하고 바람 확인으로 바꾸지 않으며 교사와 안전한 기압/기류 확인 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w075",
      "no": 75
    }
  },
  "c22-s52-u03-b077": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w077",
    "no": 77,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "날씨가 학교 활동에 주는 영향을 조사했어요. 자료의 제목뿐 아니라 어디를 읽었고 무엇을 알게 되었는지 친구가 다시 찾아볼 수 있도록 적으려면 어떤 내용이 필요할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "출처 식별·본문 확인 내용/조건·확인 범위·제안과 사실 구별."
    ],
    "required": [
      "자료의 제목과 만든 곳, 쪽수나 주소 등 다시 찾을 정보와 실제 읽은 내용·알게 된 점을 연결한다. 자료에서 확인한 사실과 자신의 제안은 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w077",
      "no": 77
    }
  },
  "c22-s52-u03-b079": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w079",
    "no": 79,
    "prompt": "관측 기구를 읽지 못한 시간에 비가 안 온 것 같다며0mm로 썼어요. 어떻게 고칠까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "0/미측정 구별·수정 이력·대체 자료 출처/범위."
    ],
    "required": [
      "기구를 읽지 못한 값은 미측정으로 고치고 0 mm와 구별한다. 다른 자료로 확인했다면 그 출처와 관측한 지역·시각을 따로 밝힌다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w079",
      "no": 79
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b088": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w088",
    "no": 88,
    "prompt": "한 친구가 기온이 예상보다 낮다며 값을 높게 바꾸었어요. 관측 자료를 어떻게 다뤄야 할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "처음 기록 보존·도구/주위 점검·실제 재측정/미측정 구별."
    ],
    "required": [
      "예상과 다른 처음 값은 그대로 남기고, 잘못 잰 것으로 의심되면 도구와 주변 조건을 확인한 뒤 다시 잰 값을 별도 기록해야 함을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w088",
      "no": 88
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b092": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w092",
    "no": 92,
    "prompt": "차가운 컵에 물을 붓다가 외벽에 튀었어요. 그 물방울을 곧바로 응결의 증거로 쓸 수 없는 까닭과 보완을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "다른 원인·초기 외벽/누수/시각·실제 재관찰."
    ],
    "required": [
      "튀어 묻은 물이라는 다른 원인을 설명하고 외벽 닦기·누수/튐·시각 조건을 확인한 재관찰을 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w092",
      "no": 92
    },
    "previousVersion": 1
  },
  "c22-s52-u03-b100": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w100",
    "no": 100,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "A기온30℃, B기온20℃만 제시됐어요. A가 반드시 저기압이라고 할 수 없는 까닭과 추가 자료를 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "기온만으로 확정 불가·실제 기압/높이·분포/시각."
    ],
    "required": [
      "기온30/20℃만으로 실제 지표 기압을 확정하지 못함과 같은 높이/기준·시각의 실제 기압/주변 분포 추가 확인을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w100",
      "no": 100
    }
  },
  "c22-s52-u03-b104": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w104",
    "no": 104,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "모래와 물의 온도 변화, 공기의 흐름을 각각 확인할 계획을 그리세요. 온도나 공기의 흐름을 살펴볼 위치, 같게 할 조건, 관찰하지 못한 내용을 적을 칸, 교사와 준비할 것을 넣으세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "장치·같게 할 조건·온도/흐름 별도·미관찰·교사 안전."
    ],
    "required": [
      "두 감지 위치/용기·같은 빛/처음값/시각과 별도 기류 관찰 위치·미관찰 칸·교사 준비를 그린 계획에 넣는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w104",
      "no": 104
    }
  },
  "c22-s52-u03-b107": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w107",
    "no": 107,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "가상 예보에는15시 비, 실제15시 관측에는 강수 없음이 기록됐어요. 두 자료를 어떻게 보존하고 설명하나요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 자료 보존·시각/지역·예상/관측 차이·수정 이력/미확인."
    ],
    "required": [
      "예보와 실제15시 강수 관측을 각각 지역/날짜/발표·대상/관측 시각과 보존하고 차이를 설명하며 몰래 자료를 바꾸지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w107",
      "no": 107
    }
  },
  "c22-s52-u03-b110": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w110",
    "no": 110,
    "previousVersion": "20261106-weather-readable-workbook",
    "prompt": "1013hPa보다 낮으면 주변과 관계없이 모두 같은 저기압이라고 생각했어요. 두 곳1004/1010hPa를 이용해 고쳐 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "1010>1004·주변과 비교·고정 경계 오개념 수정."
    ],
    "required": [
      "1010>1004hPa의 상대 비교를 쓰고1013hPa가 모든 경우의 고정 경계가 아님을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w110",
      "no": 110
    }
  },
  "c22-s52-u03-b111": {
    "unit": "c22-s52-u03",
    "workbookId": "c22-s52-u03-w111",
    "no": 111,
    "prompt": "낮에는 모든 바닷가에서 반드시 해풍이라고 썼어요. 모형과 실제 자료를 나누어 고쳐 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 날씨 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "모형 조건·실제 다른 요인/관측·항상/반드시 수정."
    ],
    "required": [
      "낮 해풍의 모형 조건과 실제 큰 규모 기압/지형을 구별하고 항상이라는 말을 고쳐 그날 지역/시각 풍향 확인을 제안한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u03",
      "id": "c22-s52-u03-w111",
      "no": 111
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b004": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w004",
    "no": 4,
    "prompt": "재생에너지를 이용하면 에너지를 아무 때나 무한히 쓸 수 있을까요? 지금 생각과 확인할 자료를 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "처음 생각과 확인할 조건/자료를 함께 제시. 단순 찬반보다 이유를 확인."
    ],
    "required": [
      "처음 생각과 까닭·확인할 햇빛/바람·장소/설비 등 조건을 쓴다. 조사 전 예상을 실제 결과로 쓰지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w004",
      "no": 4
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b010": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w010",
    "no": 10,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "공책 한 권에 어떤 자원이 쓰이는지 조사할 계획을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "물건/재료·조사할 본문 출처·확인/미확인 구별 포함. 타당한 다른 생활 물건 인정."
    ],
    "required": [
      "공책의 종이/표지/철심 등 부분별 재료와 조사할 본문 출처를 정하고 확인한 내용/미확인을 나눈 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w010",
      "no": 10
    }
  },
  "c22-s52-u04-b016": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w016",
    "no": 16,
    "prompt": "“나무는 다시 심을 수 있으니 종이를 끝없이 써도 된다”를 고쳐 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "회복에 시간/조건 필요·이용량/낭비 줄이기 포함."
    ],
    "required": [
      "나무가 회복되는 시간/조건을 설명하고 이용량·관리와 종이 낭비 줄이기로 무한 이용 주장을 고친다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w016",
      "no": 16
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b022": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w022",
    "no": 22,
    "prompt": "재활용 표시만 있으면 모든 물건을 같은 통에 넣어도 될까요? 근거와 확인할 것을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "재질/오염·지역 기준 확인, 수거와 실제 처리 구별 포함."
    ],
    "required": [
      "재활용 표시만으로 같은 통에 넣지 않고 재질/오염·현재 지역 수거 기준을 확인하며 회수와 처리 결과를 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w022",
      "no": 22
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b028": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w028",
    "no": 28,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "맑은 날 태양 전지판 사진만 보고 하루 발전량을 알 수 있을까요? 더 필요한 자료를 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "사진만으로 확정 불가·시간/빛/설비/실제 측정 중 두 조건 이상."
    ],
    "required": [
      "사진 한 장만으로 하루 발전량을 정할 수 없음을 밝히고, 하루 동안 실제 발전량 기록·햇빛이 비친 시간·설비나 설치 조건 등 타당한 추가 자료를 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w028",
      "no": 28
    }
  },
  "c22-s52-u04-b034": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w034",
    "no": 34,
    "prompt": "모든 지역에서 한 가지 재생에너지만 쓰면 된다는 제안의 확인할 점을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "지역/시간의 조건 차이·설비/환경 또는 이용 목적 포함."
    ],
    "required": [
      "지역/시간에 따른 자연 조건 차이와 설비·환경 또는 목적을 비교해 한 종류를 모든 곳에 쓰는 제안의 한계를 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w034",
      "no": 34
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b040": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w040",
    "no": 40,
    "prompt": "다른 종류인 냉장고와 냉방기의 등급만으로 총사용량이 적은 제품을 정할 수 있을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "등급만으로 불가·기능/종류·용량/시간/실제 사용량 중 두 조건 이상."
    ],
    "required": [
      "서로 다른 종류의 제품은 등급만으로 총사용량을 비교할 수 없음을 설명한다. 같은 조건의 실제 사용량이나 제품 종류·용량·사용 시간 등 살필 조건을 근거로 들면 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w040",
      "no": 40
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b046": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w046",
    "no": 46,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "집 모형 B의 온도 변화가 A보다 작았어요. 실제 건물의 전기 사용량도 같은 비율로 줄었다고 할 수 있을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "모형 온도와 실제 전력/비용 구별·실제 조건/자료 필요 포함."
    ],
    "required": [
      "모형의 온도 변화와 실제 건물의 전력/비용을 구별하고 실제 사용/설비 조건·측정 자료가 더 필요함을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w046",
      "no": 46
    }
  },
  "c22-s52-u04-b055": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w055",
    "no": 55,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "우리 반이 하루 종이10장을 적게 썼어요. 학교 전체가1년 내내 같은 양을 줄였다고 발표해도 될까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "대상/기간의 차이·추가 자료·현재 확인 범위 포함."
    ],
    "required": [
      "한 반 하루의10장 감소라는 범위를 밝히고 다른 날짜/학급 자료 없이 학교 전체1년으로 넓히지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w055",
      "no": 55
    }
  },
  "c22-s52-u04-b060": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w060",
    "no": 60,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "“바이오 에너지는 모두 환경 영향이 없다”는 글을 검토할 질문 두 가지를 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "재료/과정과 자원/환경 등 서로 다른 확인 질문 두 가지."
    ],
    "required": [
      "바이오 재료/생산·이용 과정과 토지/물/환경 등 서로 다른 확인 질문 두 가지를 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w060",
      "no": 60
    }
  },
  "c22-s52-u04-b063": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w063",
    "no": 63,
    "prompt": "A는 큰 집/얇은 벽, B는 작은 집/두꺼운 벽이에요. 창 구조의 효과만 비교하려면 무엇을 고칠까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "크기/벽의 혼입 문제·창 외 조건 통제·같은 시점 측정 포함."
    ],
    "required": [
      "크기와 벽의 혼입을 지적하고 창 외의 크기/벽 재료·두께를 맞추며 같은 시점으로 재비교할 방법을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w063",
      "no": 63
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b069": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w069",
    "no": 69,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "생활 물건 하나를 정해 자원의 출처와 사용 후 처리 방법을 조사할 계획을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "대상/질문·본문 출처·재료/처리 기준·확인/미확인 포함."
    ],
    "required": [
      "물건/재료·출처/작성 시점·지역 처리 안내를 조사할 질문과 연결하고 재사용/수거의 확인/미확인을 나눈 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w069",
      "no": 69
    }
  },
  "c22-s52-u04-b070": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w070",
    "no": 70,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "공책 또는 생활 물건 하나에서 자원→재료→물건→사용 후 처리의 관계를 그림과 이름표로 나타내세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "최소 네 단계·재료/처리·확인/미확인 표시. 타당한 대안 인정."
    ],
    "required": [
      "자원→재료→물건→사용 후 처리의 네 단계 관계와 이름표를 그린다. 여러 재료가 쓰인 물건은 갈래를 나누어도 인정하며, 아직 확인하지 않은 내용은 꾸며 채우지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w070",
      "no": 70
    }
  },
  "c22-s52-u04-b071": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w071",
    "no": 71,
    "prompt": "두 종류의 재생에너지를 비교할 조사표에 들어갈 항목 네 가지를 정하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "서로 다른 항목 네 가지·조건/설비/환경/출처 포함."
    ],
    "required": [
      "이용 대상·장소/시간·설비/자원·주변 영향/출처 등 서로 다른 조사 항목 네 가지를 조건에 맞게 정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w071",
      "no": 71
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b072": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w072",
    "no": 72,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "창 구조만 달리할 두 집 모형을 그리고 같게 할 조건과 온도 측정 위치를 표시하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "한 가지 차이·통제 조건·같은 감지 위치/시간·안전한 준비·설계임 표시."
    ],
    "required": [
      "두 집의 창 구조만 다르게 하고, 크기·벽 재료와 두께 등 창 외의 타당한 조건을 같게 할 계획과 온도를 재는 위치를 표시한다. 실제 시험 전이면 계획으로 표시한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w072",
      "no": 72
    }
  },
  "c22-s52-u04-b074": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w074",
    "no": 74,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "같은 창 비교를 반복할 때 매번 기록할 조건과 값, 이상이 생겼을 때의 처리 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "회차/조건/시점·실제 값/단위·이상/미측정 보존 포함."
    ],
    "required": [
      "회차별 처음/주위·감지 위치·같은 시점의 실제 온도/단위를 남기고 문 열림/도구 이탈·미측정도 보존하는 방법을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w074",
      "no": 74
    }
  },
  "c22-s52-u04-b075": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w075",
    "no": 75,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "실제 만든 집 모형을 수정하기 전/후로 그릴 칸입니다. 바꾼 한 부분과 그대로 둔 부분을 표시하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "실제/아직 계획 구별·전/후 버전·한 변화·유지 조건·재시험 연결."
    ],
    "required": [
      "수정 전후 모습에서 바꾼 한 부분과 그대로 둔 부분을 구별해 표시한다. 아직 고치지 않았다면 계획으로 표시하고, 날짜나 재시험 계획을 덧붙여도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w075",
      "no": 75
    }
  },
  "c22-s52-u04-b076": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w076",
    "no": 76,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "집 모형의 실제 온도 기록이 불분명하거나 반복마다 달랐어요. 결론을 어떻게 쓰고 무엇을 확인할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "불분명/변동 인정·처음 기록 보존·조건 점검·다음 계획 포함."
    ],
    "required": [
      "불분명/반복 변동을 인정해 원자료를 보존하고 처음값·감지/문/틈·시점/주위를 점검할 다음 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w076",
      "no": 76
    }
  },
  "c22-s52-u04-b078": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w078",
    "no": 78,
    "prompt": "실천 행동·이유·확인 방법을 담은 안내 카드 초안을 그리세요. 미측정 값은 넣지 마세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "구체 행동·과학적 이유·확인/미확인·읽을 사람 고려. 초안/실제 제작 구별."
    ],
    "required": [
      "구체적인 실천 행동과 타당한 이유·확인 방법이 카드에 드러나게 그린다. 초안임을 표시하고 직접 재지 않은 수치를 관찰값으로 넣지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w078",
      "no": 78
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b079": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w079",
    "no": 79,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "실제로 한 실천 한 가지의 날짜·행동·자료와 아직 못 한 점을 쓰세요. 아직 전이면 계획으로 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "실제/계획 구별·날짜/행동·근거/미측정·다음 점검."
    ],
    "required": [
      "실행했다면 실제 날짜/행동/자료·효과 미측정과 다음 점검을 쓰고 미실행이면 계획/확인 방법으로 남긴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w079",
      "no": 79
    }
  },
  "c22-s52-u04-b089": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w089",
    "no": 89,
    "prompt": "사용 줄이기와 재사용의 차이를 생활 예로 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 개념의 차이·각 타당한 예 포함."
    ],
    "required": [
      "사용량 자체를 줄이기와 같은 물건 다시 쓰기의 뜻을 각각 타당한 생활 예와 연결해 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w089",
      "no": 89
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b094": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w094",
    "no": 94,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "재생에너지 한 종류를 골라 이용하는 흐름/자원과 설비, 확인할 조건을 이름표와 함께 그리세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "자원/흐름·설비·이용 조건·확인 범위. 원리 세부 계산은 요구하지 않음."
    ],
    "required": [
      "선택한 재생에너지의 흐름/자원→설비를 이름표로 그리고 장소/시간 등 이용 조건과 실제 확인 범위를 붙인다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w094",
      "no": 94
    }
  },
  "c22-s52-u04-b098": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w098",
    "no": 98,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "가상 값: 같은 조건/10분에 A31℃→24℃, B31℃→27℃. 온도 변화의 비교와 결론의 한계를 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 변화/단위·B의 작은 변화·가상/모형 범위·전력/비용 미측정."
    ],
    "required": [
      "A는 7℃, B는 4℃ 내려가 B의 변화가 작음을 설명하고 제시한 같은 조건의 가상 모형 자료에 한정한 결론임을 밝힌다. 실제 전기 사용량이나 비용까지 알 수 없다는 설명도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w098",
      "no": 98
    }
  },
  "c22-s52-u04-b103": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w103",
    "no": 103,
    "prompt": "교실에서 필요한 밝기를 유지하면서 조명 사용을 줄일 방법과 확인 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "구체 행동·필요한 밝기/기능·날짜/시간/조건과 실제 기록·교사 안내."
    ],
    "required": [
      "필요한 밝기를 유지하는 구체적인 조명 사용 줄이기 방법과, 같은 활동·시간 등 조건에서 사용한 정도를 기록하여 확인할 방법을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w103",
      "no": 103
    },
    "previousVersion": 1
  },
  "c22-s52-u04-b106": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w106",
    "no": 106,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "자원의 유한함과 재생에너지의 조건을 함께 고려한 실천 제안을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "유한함·필요한 기능/낭비 줄이기·재생의 조건·실행/계획/실제 근거 구별."
    ],
    "required": [
      "자원의 양에 한계가 있다는 점과 재생에너지를 쓸 때의 지역·시간·설비 등 조건을 고려하여 낭비를 줄이거나 이용 방법을 조정하는 타당한 제안을 쓴다. 아직 실천 전이면 계획으로 남긴다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w106",
      "no": 106
    }
  },
  "c22-s52-u04-b108": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w108",
    "no": 108,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "집 모형의 한 부분을 고치기 전과 후의 모습을 그리세요. 그대로 둘 조건과 다시 시험할 때 잴 것도 적으세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "전/후·한 변화·유지 조건·시점/측정값·안전/실제 또는 계획 표시."
    ],
    "required": [
      "전후 모습에 바꾼 한 부분·그대로 둘 타당한 조건·다시 시험할 때 잴 것을 표시한다. 실제로 고친 모습인지 아직 계획인지 구별한다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w108",
      "no": 108
    }
  },
  "c22-s52-u04-b110": {
    "unit": "c22-s52-u04",
    "workbookId": "c22-s52-u04-w110",
    "no": 110,
    "previousVersion": "20261106-energy-readable-workbook",
    "prompt": "줄이기·재사용·재활용의 차이를 생활 예 세 장면과 이름표로 나타내세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 자원과 에너지 독립 창작 교재",
      "course": "초등5-2"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "세 개념과 타당한 예·순환을 무한함으로 표현하지 않음."
    ],
    "required": [
      "줄이기·재사용·재활용의 서로 다른 생활 예 세 장면과 알맞은 이름표를 나타낸다."
    ],
    "workbookRef": {
      "unit": "c22-s52-u04",
      "id": "c22-s52-u04-w110",
      "no": 110
    }
  },
  "c22-s61-u01-b004": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w004",
    "no": 4,
    "prompt": "산성 용액과 염기성 용액을 섞으면 어떤 변화가 있을까요? 지금 생각과 확인하고 싶은 관찰을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "예상과 확인할 색/첨가 기록을 구별하면 타당한 다른 예상도 인정."
    ],
    "required": [
      "혼합 뒤의 예상과 확인할 색 변화/첨가 기록을 나누어 쓴다. 타당한 다른 예상도 인정하며 실제 관찰처럼 쓰지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w004",
      "no": 4
    },
    "previousVersion": 1
  },
  "c22-s61-u01-b010": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w010",
    "no": 10,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "겉보기 성질이 비슷한 A와 B를 더 구분할 방법과 필요한 기록을 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "지시약이라는 새 기준·비교 조건·전후 관찰 기록을 포함. 맛/피부 접촉 제안은 인정하지 않음."
    ],
    "required": [
      "새 기준인 지시약·같은 시료/지시약 양과 방법·전후 색 기록을 연결한다. 맛/피부 검사 제안은 인정하지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w010",
      "no": 10
    }
  },
  "c22-s61-u01-b016": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w016",
    "no": 16,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "용액의 원래 색이 진해서 지시약의 색 변화를 구별하기 어려워요. 관찰 기록에 쓸 내용과 더 확인할 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "불분명 보존·방해 조건·교사와 타당한 추가 확인 포함."
    ],
    "required": [
      "색 구별 불분명을 보존하고 처음 색·양/도구·조명 등 방해 조건을 적으며 교사와 타당한 추가 지시약/비교 방법을 정한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w016",
      "no": 16
    }
  },
  "c22-s61-u01-b022": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w022",
    "no": 22,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "푸른 리트머스 시험지가 그대로였다는 이유만으로 B를 염기성이라고 했어요. 설명을 고치세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "단정 보류·붉은 종이 등 추가 확인과 그 변화 기준을 포함."
    ],
    "required": [
      "푸른 종이 유지 하나로 염기성을 단정하지 않고 새 붉은 종이의 푸른색 변화 등 구체 추가 기준을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w022",
      "no": 22
    }
  },
  "c22-s61-u01-b028": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w028",
    "no": 28,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "“페놀프탈레인을 넣었을 때 무색이면 모든 용액의 성질이 같다”는 설명이 알맞은지 쓰고 까닭을 설명하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "무색 단독 근거의 한계·구체적인 추가 관찰·모든 성질로 확대하지 않음을 포함."
    ],
    "required": [
      "페놀프탈레인 무색 단독 근거의 한계와 리트머스 등 구체 추가 관찰을 제시하고 모든 성질이 같다는 확대를 고친다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w028",
      "no": 28
    }
  },
  "c22-s61-u01-b034": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w034",
    "no": 34,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "같은 용액에 양배추 지시약을 넣었는데 두 모둠이 색의 이름을 다르게 적었어요. 어떻게 다시 비교하면 좋을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "원기록 보존·구체 조건 두 가지 이상·재관찰 계획 포함."
    ],
    "required": [
      "서로 다른 처음 색 기록을 보존하고 같은 지시약·양·빛·관찰 시각 등 타당한 조건을 맞춰 다시 비교할 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w034",
      "no": 34
    }
  },
  "c22-s61-u01-b040": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w040",
    "no": 40,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "대리석이 산성 용액과 반응한 결과를 바탕으로 돌로 만든 조각상을 보호할 방법을 조사하려고 해요. 이 실험으로 알 수 있는 점과 더 조사할 점을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "반응 성질 연결·실제 재질/노출 조건과 다른 원인·자료 확인 필요 포함."
    ],
    "required": [
      "실험한 대리석이 산성 용액과 반응했다는 결과를 조각상 보호와 연결하고, 실제 조각상의 돌 성분이나 주변 환경 등 더 조사할 점을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w040",
      "no": 40
    }
  },
  "c22-s61-u01-b046": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w046",
    "no": 46,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "흰자와 껍데기를 같은 물질이라고 생각하여 산성 용액과 염기성 용액에서의 결과를 합쳐 적었어요. 무엇을 고쳐야 할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "두 성분/부분의 구별·재료와 용액/시간을 연결한 별도 기록 포함."
    ],
    "required": [
      "흰자와 껍데기를 서로 다른 재료로 나누고 각 재료를 넣은 용액과 관찰 시간·결과를 따로 기록해야 함을 설명한다. 단백질이나 탄산 칼슘을 덧붙여도 인정한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w046",
      "no": 46
    }
  },
  "c22-s61-u01-b052": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w052",
    "no": 52,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "산성 용액과 염기성 용액을 같은 부피로 섞으면 항상 같은 색이 된다는 주장을 고치세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "항상이라는 단정 보류·처음 조건과 지시약·실제 색 관찰 필요 포함."
    ],
    "required": [
      "같은 부피면 항상 같은 색이라는 단정을 고치고 처음 용액·지시약의 상태/양과 실제 색 관찰 필요를 연결한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w052",
      "no": 52
    }
  },
  "c22-s61-u01-b058": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w058",
    "no": 58,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "자료에는 어떤 산성 세척액이 탄산 칼슘을 포함한 침전물과 반응한다고 나와 있어요. 소개 카드에 설명할 내용과, 이 자료만으로는 알 수 없는 점을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "탄산 칼슘 반응·자료의 특정 대상/조건·출처와 일반화 한계 포함."
    ],
    "required": [
      "제공 세척액과 탄산 칼슘 침전물의 반응을 쓰임에 연결하고 해당 대상/조건·출처 범위를 밝히며 다른 제품/재질로 일반화하지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w058",
      "no": 58
    }
  },
  "c22-s61-u01-b064": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w064",
    "no": 64,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "산성비가 토양과 숲에 어떤 영향을 주는지 조사하려고 해요. 무엇을 찾아보고 설명할지 계획을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "토양/생태계 피해 연결·본문 출처·지역/조건 또는 다른 원인·조사 계획임을 포함."
    ],
    "required": [
      "토양과 나무에 미치는 영향을 알아볼 자료와 지역·기간·토양 상태 등 확인할 내용을 정하여 조사 계획으로 쓴다. 이미 조사한 결과로 꾸미지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w064",
      "no": 64
    }
  },
  "c22-s61-u01-b083": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w083",
    "no": 83,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "성질을 모르는 두 용액을 리트머스 시험지로 분류하려고 해요. 안전하게 비교할 계획을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "교사 준비·새 두 종류 종이/오염 방지·같은 조명과 전후 색 포함."
    ],
    "required": [
      "교사 준비 시료·새 붉고 푸른 종이·시료별 도구/오염 방지·같은 조명·처음/나중 색과 불분명을 포함한 비교 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w083",
      "no": 83
    }
  },
  "c22-s61-u01-b084": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w084",
    "no": 84,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "용액 A와 B에 붉은 시험지와 푸른 시험지를 묻히기 전과 뒤의 색을 적을 빈 표를 그리세요. 각 칸에 무엇을 적을지 이름도 써 주세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "A/B·두 종류 종이·전후 색·시점/불분명 구역 포함. 타당한 다른 표 배열 인정."
    ],
    "required": [
      "A/B와 붉은 시험지·푸른 시험지를 구별하고 처음 색과 나중 색을 적을 빈칸에 이름표를 붙인다. 다른 타당한 배열과 관찰 시각·불분명한 점을 적을 칸도 인정한다. 실제 없는 결과를 미리 채우지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w084",
      "no": 84
    }
  },
  "c22-s61-u01-b086": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w086",
    "no": 86,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "리트머스 시험지의 색 변화가 예상과 달랐어요. 무엇을 다시 확인하고, 처음 결과와 다시 관찰한 결과를 어떻게 적을까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "예상/실제 구분·점검 항목 두 가지 이상·첫 기록과 재관찰 보존 포함."
    ],
    "required": [
      "시험지의 처음 색·용액 표시·도구 오염·관찰 조건 등 타당한 확인 항목과 재관찰할 방법을 쓴다. 처음과 다시 관찰한 결과는 나누어 남긴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w086",
      "no": 86
    }
  },
  "c22-s61-u01-b088": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w088",
    "no": 88,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "짧은 시간 동안 관찰했는데 기포가 뚜렷하게 보이지 않았어요. 관찰한 결과와 더 확인할 점을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "관찰 범위/불분명 보존·구체 조건 확인·안전한 재관찰 포함."
    ],
    "required": [
      "해당 시간/조건에서 기포가 뚜렷하지 않았음을 보존하고 성분·크기·용액/관찰 조건을 교사와 확인한 안전한 재관찰 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w088",
      "no": 88
    }
  },
  "c22-s61-u01-b089": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w089",
    "no": 89,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "선생님이 묽은 염산에 묽은 수산화 나트륨 용액을 조금씩 넣는 모습을 관찰하려고 해요. 넣은 양과 색 변화를 적을 빈 표를 그리세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "처음 조건·단계·추가/누적 구분·색·관찰 시점/불분명 포함. 결과는 미리 채우지 않음."
    ],
    "required": [
      "넣은 차례와 양, 관찰한 색을 적을 빈칸을 구별한다. 처음 용액·지시약 조건, 누적한 양, 관찰한 때나 불분명한 점을 적을 칸을 더해도 인정한다. 결과를 미리 채우지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w089",
      "no": 89
    }
  },
  "c22-s61-u01-b091": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w091",
    "no": 91,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "같은 혼합 실험을 다시 관찰하려고 해요. 처음 기록을 어떻게 남겨 두고, 어떤 조건을 같게 해야 할까요?",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "첫 회차 보존·회차 구분·처음/방법/관찰 조건 두 가지 이상·차이 기록 포함."
    ],
    "required": [
      "처음 기록을 남겨 두고 다시 관찰한 기록을 나눈다. 처음 용액과 지시약의 양·넣는 방법·관찰 시각·조명 등 타당한 비교 조건을 같게 할 계획을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w091",
      "no": 91
    }
  },
  "c22-s61-u01-b092": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w092",
    "no": 92,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "용액의 성질을 생활에 이용하는 예를 소개할 빈 카드를 그리세요. 어떤 내용을 넣을지 칸 이름을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "사례/대상·성질/목적·조건/한계·출처/날짜의 읽기 쉬운 배열 포함."
    ],
    "required": [
      "사례/대상·이용 성질/목적·조건/한계·본문 출처/확인 날짜·미확인 칸을 읽기 쉽게 그린다. 실제 약품 사용 실험 도면으로 바꾸지 않는다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w092",
      "no": 92
    }
  },
  "c22-s61-u01-b100": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w100",
    "no": 100,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "지시약으로 용액을 분류한 까닭을 설명하려고 해요. 어떤 관찰 내용을 함께 말하면 좋을지 한두 문장으로 정리하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "조건·색/시점·기준과 한계를 연결하면 타당한 다른 표현 인정."
    ],
    "required": [
      "처음 시료/지시약 조건·전후 색/시점·해당 분류 기준과 불분명/한계를 연결해 한두 문장으로 요약한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w100",
      "no": 100
    }
  },
  "c22-s61-u01-b111": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w111",
    "no": 111,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "“페놀프탈레인이 무색이면 반드시 산성이다”라는 설명을 고치고, 더 확인할 방법을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "단독 확정 불가·구체 추가 도구/변화 기준 포함."
    ],
    "required": [
      "페놀프탈레인 무색 단독으로 산성을 확정하지 않고 푸른 리트머스의 붉어짐 등 도구와 변화 기준이 구체적인 추가 확인을 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w111",
      "no": 111
    }
  },
  "c22-s61-u01-b112": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w112",
    "no": 112,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "용액 A와 B에 같은 껍데기 조각을 넣어 비교하는 실험을 그림으로 나타내세요. 다르게 할 것, 같게 할 것, 관찰할 것을 표시하세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "A/B·같은 표본/양·시간/방법·관찰 대상 이름표 포함. 타당한 다른 배치 인정."
    ],
    "required": [
      "A/B 용액·동일 성분의 껍데기 양/크기·같은 용액 양/시간/방법·기포/표본 변화를 볼 곳의 이름표를 비교 배치에 그린다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w112",
      "no": 112
    }
  },
  "c22-s61-u01-b120": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w120",
    "no": 120,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "약해진 나무 사진 한 장을 보고 산성비 때문이라고만 설명했어요. 더 조사할 내용과 이 사진만으로 알 수 있는 점을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "사진 한계·실제 환경/토양 자료·다른 원인과 결론 범위 포함."
    ],
    "required": [
      "사진 한 장의 원인 확정 한계를 밝히고 지역/기간의 산성비·토양/생장 조건과 다른 원인 자료를 확인할 필요를 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w120",
      "no": 120
    }
  },
  "c22-s61-u01-b123": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w123",
    "no": 123,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "두 모둠의 마지막 색은 달라요. 하지만 처음 용액과 지시약의 양, 더 넣은 양은 적혀 있지 않아요. 기록에서 알 수 있는 점과 아직 알 수 없는 점을 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "색 차이 관찰 인정·첨가량 단정 불가·처음 조건/실제 과정 자료 필요 포함."
    ],
    "required": [
      "마지막 색의 차이는 인정하되 실제 첨가량은 단정하지 못하며 처음 시료/지시약 조건과 실제 첨가 기록이 필요함을 설명한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w123",
      "no": 123
    }
  },
  "c22-s61-u01-b125": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w125",
    "no": 125,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "틀린 문제 하나를 골라 처음 생각과 놓친 조건, 생각을 고친 까닭을 차례로 쓰세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "자기 문항의 처음 생각·구체 놓친 조건·타당한 수정 설명 포함."
    ],
    "required": [
      "고른 문항의 처음 생각과 놓친 조건, 근거를 반영해 생각을 고친 까닭을 차례로 쓴다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w125",
      "no": 125
    }
  },
  "c22-s61-u01-b127": {
    "unit": "c22-s61-u01",
    "workbookId": "c22-s61-u01-w127",
    "no": 127,
    "previousVersion": "20261106-acid-readable-workbook",
    "prompt": "지금 기록만으로는 답하기 어려운 질문 한 가지를 쓰세요. 안전하게 더 알아볼 계획도 적어 보세요.",
    "sourceRef": {
      "type": "authored-supplement",
      "edition": "GFIELD 산과 염기 독립 창작 교재",
      "course": "초등6-1"
    },
    "responseContract": "written-explanation",
    "previousRequired": [
      "실제 남은 질문·안전/교사 범위·얻을 근거·미실행 상태 포함."
    ],
    "required": [
      "실제 남은 질문·교사와 할 안전한 비교 방법·얻을 근거와 조건·미실행 상태를 함께 제시한다."
    ],
    "workbookRef": {
      "unit": "c22-s61-u01",
      "id": "c22-s61-u01-w127",
      "no": 127
    }
  }
};
const workbookPatches={
  "mixture-book-72": {
    "unit": "c22-s52-u01",
    "no": 72,
    "prompt": "물 위 기름층을 스포이트로 옮길 때 경계 가까이에서 천천히 하는 까닭은?",
    "previousCriteria": "물까지 함께 옮기는 것을 줄이려는 목적과 경계/옮긴 액체 상태 확인을 연결한다.",
    "criteria": "경계 가까이에서 천천히 옮기면 기름 아래의 물이 함께 옮겨지는 것을 줄일 수 있음을 설명한다. 경계와 옮긴 액체를 살핀다는 설명도 인정한다."
  },
  "mixture-book-84": {
    "unit": "c22-s52-u01",
    "no": 84,
    "prompt": "“분리가 잘되면 언제나 처음과 정확히 같은 무게의 마른 소금을 얻는다.”라고 했어요. 어떤 실험 조건을 더 확인해야 할까요?",
    "previousCriteria": "흘림·잔류·건조·측정 등 실제 회수 질량에 영향을 줄 조건을 근거로 설명한다. 반드시 같은 값이라 강요하지 않는다.",
    "criteria": "흘림·용기나 종이에 남은 소금물·남은 물기·재는 방법 등 얻은 소금의 무게에 영향을 줄 조건을 근거로 설명한다. 반드시 같은 값이라고 요구하지 않는다."
  },
  "c22-s52-u02-w004": {
    "unit": "c22-s52-u02",
    "no": 4,
    "prompt": "차가운 물병을 수건으로 감싸면 더 빨리 따뜻해질까요? 지금 생각과 그렇게 예상한 까닭을 쓰세요.",
    "previousCriteria": "처음 예상과 까닭을 쓴다. 바깥이 더 따뜻한 조건에서 수건이 안으로 들어오는 열을 줄일 수 있음을 생각하며 미실행을 실제 결과로 쓰지 않는다.",
    "criteria": "처음 예상과 그렇게 생각한 까닭을 함께 쓰면 인정한다. 아직 하지 않은 비교를 실제 결과로 쓰지 않는다."
  },
  "c22-s52-u02-w008": {
    "unit": "c22-s52-u02",
    "no": 8,
    "prompt": "같은 방에 오래 둔 금속 조각과 나무 조각 중 금속이 더 차갑게 느껴졌습니다. 이것만으로 금속의 온도가 더 낮다고 정할 수 없는 까닭을 쓰세요.",
    "previousCriteria": "촉감이 손과 재료 사이 열 이동에도 영향을 받음을 설명하고 실제 온도 측정을 제안한다.",
    "criteria": "촉감과 온도가 같지 않음을 손과 재료 사이의 열 이동으로 설명한다. 실제 온도를 재어 보자는 제안도 인정한다."
  },
  "c22-s52-u02-w038": {
    "unit": "c22-s52-u02",
    "no": 38,
    "prompt": "검은 종이와 흰 종이가 빛을 받을 때의 온도 변화를 비교하려고 합니다. 색 이외의 조건과 측정 방법을 어떻게 정해야 하나요?",
    "previousCriteria": "색 이외 타당한 통제 조건3가지 이상과 처음/이후 같은 시점 온도 측정을 함께 설명한다.",
    "criteria": "색 이외의 재료·크기·두께·빛을 받는 거리와 시간 등 타당한 조건을 같게 하고, 처음과 같은 시점의 온도를 비교할 방법을 쓴다."
  },
  "c22-s52-u02-w056": {
    "unit": "c22-s52-u02",
    "no": 56,
    "prompt": "반복한 연습 시험에서 A의 온도는 7·8·7℃, B는 7·7·8℃ 내려갔어요. B가 언제나 더 좋다고 말할 수 있을까요? 자료를 이용해 설명하세요.",
    "previousCriteria": "반복 범위가 겹치고 순서가 일정하지 않음을 근거로 항상 우수 주장을 제한하고 조건/오차 점검과 추가 반복을 제안한다.",
    "criteria": "반복한 자료에서 A와 B의 온도가 내려간 정도를 비교하고 B가 언제나 더 좋다고 단정할 수 없음을 설명한다. 같은 조건에서 다시 비교하자는 제안도 인정한다."
  },
  "c22-s52-u02-w059": {
    "unit": "c22-s52-u02",
    "no": 59,
    "prompt": "햇빛이 비친 금속 컵 속 물이 따뜻해졌습니다. 이 현상을 복사 한 방식만 일어났다고 단정하지 않고 설명하세요.",
    "previousCriteria": "빛→컵의 복사·금속을 따르는 전도·물 움직임의 대류를 구간으로 나누고 실제 관찰 조건을 붙인다.",
    "criteria": "햇빛이 컵에 전달되는 복사와 컵을 따라 전달되는 전도 등 두 가지 이상의 열 이동을 연결한다. 물의 움직임을 관찰한 경우 대류 설명도 인정한다."
  },
  "c22-s52-u02-w080": {
    "unit": "c22-s52-u02",
    "no": 80,
    "prompt": "따뜻한 물이 담긴 금속 컵을 찬물 속에 놓았습니다. 두 물이 섞이지 않았는데도 온도가 변할 수 있는 까닭을 쓰세요.",
    "previousCriteria": "섞임 없이 금속 벽을 통해 높은→낮은 쪽으로 전달될 수 있음을 쓰고 주위/용기의 영향도 고려한다.",
    "criteria": "두 물이 섞이지 않아도 금속 벽을 통해 온도가 높은 쪽에서 낮은 쪽으로 열이 이동할 수 있음을 설명한다. 주위와 용기의 영향을 덧붙여도 인정한다."
  },
  "c22-s52-u02-w104": {
    "unit": "c22-s52-u02",
    "no": 104,
    "prompt": "한 번의 단열 비교 결과를 친구에게 설명하려고 해요. 어떤 조건에서 시험했는지 알려 주고, 아직 모르는 점과 다음에 확인할 방법을 쓰세요.",
    "previousCriteria": "컵/재료·양·처음 온도·주위·시점과 한 번 시험/측정/통제의 한계를 밝히고 같은 조건 반복 또는 한 부분 수정 재시험을 제안한다.",
    "criteria": "컵이나 재료, 물의 양·처음 온도·주위 상태·잰 시각 등 실제 시험 조건을 밝히고, 한 번의 결과로 알 수 없는 점과 다음에 확인할 방법을 각각 쓴다."
  },
  "c22-s52-u03-w016": {
    "unit": "c22-s52-u03",
    "no": 16,
    "prompt": "기온이 다른 두 방의 습도가 모두50%예요. 수증기의 실제 양도 같다고 결론 내릴 수 없는 까닭을 쓰세요.",
    "previousCriteria": "같은50%라도 기온/공간 조건에 따라 실제 수증기 양이 같다고 할 수 없음을 설명하고%와 질량을 구별한다.",
    "criteria": "같은 50%라도 기온이나 공간의 조건이 다르면 수증기의 실제 양이 같다고 할 수 없음을 설명한다. 습도와 수증기의 실제 양을 구별한다."
  },
  "c22-s52-u03-w022": {
    "unit": "c22-s52-u03",
    "no": 22,
    "prompt": "교사가 준비한 컵 비교에서 한쪽 외벽에만 물방울이 생겼어요. 어떤 조건과 다른 원인을 확인하고 응결로 설명할지 쓰세요.",
    "previousCriteria": "같은 컵/양/주위/시각·초기 외벽과 누수/튀는 물을 확인하고 수증기→액체 응결을 실제 확인 범위로 설명한다.",
    "criteria": "컵·물의 양·관찰 시각 등 타당한 조건을 같게 비교하고 튄 물·누수 등 다른 물의 경로를 확인한 뒤, 공기 중 수증기가 응결했다는 설명과 연결한다."
  },
  "c22-s52-u03-w028": {
    "unit": "c22-s52-u03",
    "no": 28,
    "prompt": "병 안 벽면에는 물방울이 보였지만 공기 중 흐림은 분명하지 않았어요. 이 관찰로 안개 모형이 뚜렷하게 생겼다고 할 수 있을까요?",
    "previousCriteria": "벽면 물방울 관찰과 공중 흐림 불분명을 나누고 안개 발생 확정을 제한하며 조건을 남긴 재관찰 계획을 쓴다.",
    "criteria": "벽면 물방울과 공기 중 작은 물방울을 구별하고, 공기 중 흐림이 분명하지 않아 안개 모형이 뚜렷하게 생겼다고 확정할 수 없음을 설명한다. 다시 관찰할 방법을 덧붙여도 인정한다."
  },
  "c22-s52-u03-w034": {
    "unit": "c22-s52-u03",
    "no": 34,
    "prompt": "작은 창문으로 찍은 사진에 구름이 가득 보여요. 그 지역 하늘 전체의 구름의 양이 많다고 바로 결론 내릴 수 없는 까닭은?",
    "previousCriteria": "창문 사진의 부분 시야와 전체 하늘을 구별하고 같은 시각의 정한 범위/다른 방향 추가 관찰을 설명한다.",
    "criteria": "사진은 창문에서 보이는 하늘 일부라는 점과 구름의 양은 정한 범위의 전체 하늘을 보고 판단한다는 점을 연결한다. 다른 방향을 더 관찰하자는 제안도 인정한다."
  },
  "c22-s52-u03-w066": {
    "unit": "c22-s52-u03",
    "no": 66,
    "prompt": "하루 동안 관측했더니 학교의 12시 기온이 09시보다 높았어요. 매일 반드시 그렇다고 말하려면 어떤 자료가 더 필요할까요? 하루 자료로 알 수 없는 점도 쓰세요.",
    "previousCriteria": "하루12시>09시를 모든 날로 넓히지 않고 여러 날짜의 같은 시각/관측 조건 비교와 인과 설명의 한계를 쓴다.",
    "criteria": "하루의 비교로 모든 날의 기온 변화를 정할 수 없음을 설명하고, 여러 날짜에 같은 시각·같은 기준으로 관측한 자료를 더 모아 비교할 필요를 쓴다."
  },
  "c22-s52-u03-w070": {
    "unit": "c22-s52-u03",
    "no": 70,
    "prompt": "이슬 컵 비교에서 바꾸려는 조건 하나와 같게 살필 조건 두 가지 이상을 적으세요.",
    "previousCriteria": "바꿀 물의 차가운 조건 하나와 같은 컵/양/장소/시각 등 둘 이상·초기 외벽 점검을 적고 준비 계획과 실제 실행을 구별한다.",
    "criteria": "바꿀 조건 한 가지와 같게 할 조건 두 가지 이상을 타당하게 쓴다. 물의 차가운 정도·컵·물의 양·장소·관찰 시각 등에서 비교 목적에 맞는 조건을 인정한다."
  },
  "c22-s52-u03-w071": {
    "unit": "c22-s52-u03",
    "no": 71,
    "prompt": "이슬 비교 장치를 그리세요. 컵 안/밖을 나누고 관찰할 위치, 실제 관찰/아직 계획 표시를 넣으세요.",
    "previousCriteria": "두 컵의 안/밖·외벽 관찰 위치·시각/누수 점검과 계획/실제 표시를 그린다. 관찰 전 결과를 채우지 않는다.",
    "criteria": "비교할 컵의 안과 밖을 나누고 외벽 등 관찰 위치와 실제 관찰인지 아직 계획인지를 표시한다. 관찰하지 않은 결과를 미리 채우지 않는다."
  },
  "c22-s52-u03-w077": {
    "unit": "c22-s52-u03",
    "no": 77,
    "prompt": "날씨가 학교 활동에 주는 영향을 조사했어요. 자료의 제목뿐 아니라 어디를 읽었고 무엇을 알게 되었는지 친구가 다시 찾아볼 수 있도록 적으려면 어떤 내용이 필요할까요?",
    "previousCriteria": "기관/제목·쪽이나주소·확인 날짜·대상 지역/시각·본문 영향/조건을 적고 자료의 사실·내 제안·미확인을 구별한다.",
    "criteria": "자료의 제목과 만든 곳, 쪽수나 주소 등 다시 찾을 정보와 실제 읽은 내용·알게 된 점을 연결한다. 자료에서 확인한 사실과 자신의 제안은 구별한다."
  },
  "c22-s52-u03-w079": {
    "unit": "c22-s52-u03",
    "no": 79,
    "prompt": "관측 기구를 읽지 못한 시간에 비가 안 온 것 같다며0mm로 썼어요. 어떻게 고칠까요?",
    "previousCriteria": "읽지 못한 강수값을 미측정/이유로 고치고 실제0mm와 구별하며 대체 자료의 지역/시각/출처/범위를 별도로 남긴다.",
    "criteria": "기구를 읽지 못한 값은 미측정으로 고치고 0 mm와 구별한다. 다른 자료로 확인했다면 그 출처와 관측한 지역·시각을 따로 밝힌다."
  },
  "c22-s52-u03-w088": {
    "unit": "c22-s52-u03",
    "no": 88,
    "prompt": "한 친구가 기온이 예상보다 낮다며 값을 높게 바꾸었어요. 관측 자료를 어떻게 다뤄야 할까요?",
    "previousCriteria": "예상과 다른 원래 값/조건을 보존하고 감지 부분·표시 안정·빛/주위를 점검한 실제 재측정과 점검 이력을 따로 남긴다.",
    "criteria": "예상과 다른 처음 값은 그대로 남기고, 잘못 잰 것으로 의심되면 도구와 주변 조건을 확인한 뒤 다시 잰 값을 별도 기록해야 함을 설명한다."
  },
  "c22-s52-u04-w028": {
    "unit": "c22-s52-u04",
    "no": 28,
    "prompt": "맑은 날 태양 전지판 사진만 보고 하루 발전량을 알 수 있을까요? 더 필요한 자료를 쓰세요.",
    "previousCriteria": "사진만으로 하루 발전량을 확정하지 않고 시간/빛·설비/설치·실제 에너지 측정 중 둘 이상 필요한 자료를 쓴다.",
    "criteria": "사진 한 장만으로 하루 발전량을 정할 수 없음을 밝히고, 하루 동안 실제 발전량 기록·햇빛이 비친 시간·설비나 설치 조건 등 타당한 추가 자료를 쓴다."
  },
  "c22-s52-u04-w040": {
    "unit": "c22-s52-u04",
    "no": 40,
    "prompt": "다른 종류인 냉장고와 냉방기의 등급만으로 총사용량이 적은 제품을 정할 수 있을까요?",
    "previousCriteria": "다른 종류의 등급만으로 총사용량을 정하지 못함과 기능/종류·용량/시간/실제 사용량 중 둘 이상을 설명한다.",
    "criteria": "서로 다른 종류의 제품은 등급만으로 총사용량을 비교할 수 없음을 설명한다. 같은 조건의 실제 사용량이나 제품 종류·용량·사용 시간 등 살필 조건을 근거로 들면 인정한다."
  },
  "c22-s52-u04-w070": {
    "unit": "c22-s52-u04",
    "no": 70,
    "prompt": "공책 또는 생활 물건 하나에서 자원→재료→물건→사용 후 처리의 관계를 그림과 이름표로 나타내세요.",
    "previousCriteria": "자원→재료→물건→사용 후 처리의 네 단계 이상과 이름표를 그리고 복합 재료의 갈래·확인 범위를 표시한다.",
    "criteria": "자원→재료→물건→사용 후 처리의 네 단계 관계와 이름표를 그린다. 여러 재료가 쓰인 물건은 갈래를 나누어도 인정하며, 아직 확인하지 않은 내용은 꾸며 채우지 않는다."
  },
  "c22-s52-u04-w072": {
    "unit": "c22-s52-u04",
    "no": 72,
    "prompt": "창 구조만 달리할 두 집 모형을 그리고 같게 할 조건과 온도 측정 위치를 표시하세요.",
    "previousCriteria": "두 집의 창 구조 하나만 다르게 그리고 같은 크기/벽/문/틈·받침·내부 감지 위치·처음/주위/시점과 안전한 설계임을 표시한다.",
    "criteria": "두 집의 창 구조만 다르게 하고, 크기·벽 재료와 두께 등 창 외의 타당한 조건을 같게 할 계획과 온도를 재는 위치를 표시한다. 실제 시험 전이면 계획으로 표시한다."
  },
  "c22-s52-u04-w075": {
    "unit": "c22-s52-u04",
    "no": 75,
    "prompt": "실제 만든 집 모형을 수정하기 전/후로 그릴 칸입니다. 바꾼 한 부분과 그대로 둔 부분을 표시하세요.",
    "previousCriteria": "실제/계획을 밝히고 수정 전후 버전/날짜·바꾼 한 부분·유지 조건과 재시험 연결을 그림에 표시한다.",
    "criteria": "수정 전후 모습에서 바꾼 한 부분과 그대로 둔 부분을 구별해 표시한다. 아직 고치지 않았다면 계획으로 표시하고, 날짜나 재시험 계획을 덧붙여도 인정한다."
  },
  "c22-s52-u04-w078": {
    "unit": "c22-s52-u04",
    "no": 78,
    "prompt": "실천 행동·이유·확인 방법을 담은 안내 카드 초안을 그리세요. 미측정 값은 넣지 마세요.",
    "previousCriteria": "구체적 실천·자원의 한계라는 이유·날짜/확인 항목과 안전/지역 조건을 넣고 초안임을 표시하며 미측정 수치는 넣지 않는다.",
    "criteria": "구체적인 실천 행동과 타당한 이유·확인 방법이 카드에 드러나게 그린다. 초안임을 표시하고 직접 재지 않은 수치를 관찰값으로 넣지 않는다."
  },
  "c22-s52-u04-w098": {
    "unit": "c22-s52-u04",
    "no": 98,
    "prompt": "가상 값: 같은 조건/10분에 A31℃→24℃, B31℃→27℃. 온도 변화의 비교와 결론의 한계를 쓰세요.",
    "previousCriteria": "A31−24=7℃/B31−27=4℃ 하강과 B의 작은 변화를 설명하고 가상 모형 범위·실제 전력/비용 미측정을 밝힌다.",
    "criteria": "A는 7℃, B는 4℃ 내려가 B의 변화가 작음을 설명하고 제시한 같은 조건의 가상 모형 자료에 한정한 결론임을 밝힌다. 실제 전기 사용량이나 비용까지 알 수 없다는 설명도 인정한다."
  },
  "c22-s52-u04-w103": {
    "unit": "c22-s52-u04",
    "no": 103,
    "prompt": "교실에서 필요한 밝기를 유지하면서 조명 사용을 줄일 방법과 확인 방법을 쓰세요.",
    "previousCriteria": "필요한 밝기를 유지하는 구체 행동과 교사 안내·같은 활동/시간/조건·실제 기록을 이용한 확인 방법을 설명한다.",
    "criteria": "필요한 밝기를 유지하는 구체적인 조명 사용 줄이기 방법과, 같은 활동·시간 등 조건에서 사용한 정도를 기록하여 확인할 방법을 설명한다."
  },
  "c22-s52-u04-w106": {
    "unit": "c22-s52-u04",
    "no": 106,
    "prompt": "자원의 유한함과 재생에너지의 조건을 함께 고려한 실천 제안을 쓰세요.",
    "previousCriteria": "자원 유한함과 필요한 기능/낭비 줄이기·재생의 지역/시간/설비/환경 조건을 연결하고 실제 근거와 실행/계획을 나눈 제안을 쓴다.",
    "criteria": "자원의 양에 한계가 있다는 점과 재생에너지를 쓸 때의 지역·시간·설비 등 조건을 고려하여 낭비를 줄이거나 이용 방법을 조정하는 타당한 제안을 쓴다. 아직 실천 전이면 계획으로 남긴다."
  },
  "c22-s52-u04-w108": {
    "unit": "c22-s52-u04",
    "no": 108,
    "prompt": "집 모형의 한 부분을 고치기 전과 후의 모습을 그리세요. 그대로 둘 조건과 다시 시험할 때 잴 것도 적으세요.",
    "previousCriteria": "전후 버전·한 부분 변화·유지할 크기/재료/처음/주위·감지 위치/시점/온도와 안전·실제/계획을 그림에 넣는다.",
    "criteria": "전후 모습에 바꾼 한 부분·그대로 둘 타당한 조건·다시 시험할 때 잴 것을 표시한다. 실제로 고친 모습인지 아직 계획인지 구별한다."
  },
  "c22-s52-u04-w110": {
    "unit": "c22-s52-u04",
    "no": 110,
    "prompt": "줄이기·재사용·재활용의 차이를 생활 예 세 장면과 이름표로 나타내세요.",
    "previousCriteria": "줄이기·재사용·재활용의 서로 다른 생활 예 세 장면과 이름표를 그리고 순환을 무한함으로 나타내지 않는다.",
    "criteria": "줄이기·재사용·재활용의 서로 다른 생활 예 세 장면과 알맞은 이름표를 나타낸다."
  },
  "c22-s61-u01-w034": {
    "unit": "c22-s61-u01",
    "no": 34,
    "prompt": "같은 용액에 양배추 지시약을 넣었는데 두 모둠이 색의 이름을 다르게 적었어요. 어떻게 다시 비교하면 좋을까요?",
    "previousCriteria": "서로 다른 색 이름의 원기록을 보존하고 같은 추출액·양·배경/빛·시점 중 두 조건 이상을 맞춰 재관찰할 계획을 쓴다.",
    "criteria": "서로 다른 처음 색 기록을 보존하고 같은 지시약·양·빛·관찰 시각 등 타당한 조건을 맞춰 다시 비교할 계획을 쓴다."
  },
  "c22-s61-u01-w040": {
    "unit": "c22-s61-u01",
    "no": 40,
    "prompt": "대리석이 산성 용액과 반응한 결과를 바탕으로 돌로 만든 조각상을 보호할 방법을 조사하려고 해요. 이 실험으로 알 수 있는 점과 더 조사할 점을 쓰세요.",
    "previousCriteria": "탄산 칼슘 반응을 석조물 보호 설명에 연결하되 실제 재질·노출 조건·다른 원인은 별도 본문 자료로 확인해야 함을 쓴다.",
    "criteria": "실험한 대리석이 산성 용액과 반응했다는 결과를 조각상 보호와 연결하고, 실제 조각상의 돌 성분이나 주변 환경 등 더 조사할 점을 쓴다."
  },
  "c22-s61-u01-w046": {
    "unit": "c22-s61-u01",
    "no": 46,
    "prompt": "흰자와 껍데기를 같은 물질이라고 생각하여 산성 용액과 염기성 용액에서의 결과를 합쳐 적었어요. 무엇을 고쳐야 할까요?",
    "previousCriteria": "흰자의 단백질과 껍데기의 탄산 칼슘을 구별하고 각 재료·용액·시간/조건의 결과를 별도 기록하도록 고친다.",
    "criteria": "흰자와 껍데기를 서로 다른 재료로 나누고 각 재료를 넣은 용액과 관찰 시간·결과를 따로 기록해야 함을 설명한다. 단백질이나 탄산 칼슘을 덧붙여도 인정한다."
  },
  "c22-s61-u01-w064": {
    "unit": "c22-s61-u01",
    "no": 64,
    "prompt": "산성비가 토양과 숲에 어떤 영향을 주는지 조사하려고 해요. 무엇을 찾아보고 설명할지 계획을 쓰세요.",
    "previousCriteria": "토양 영양분/나무 생장 피해의 연결·기관 본문 출처·지역/기간/토양 조건 또는 다른 원인 확인을 조사 계획으로 제시한다.",
    "criteria": "토양과 나무에 미치는 영향을 알아볼 자료와 지역·기간·토양 상태 등 확인할 내용을 정하여 조사 계획으로 쓴다. 이미 조사한 결과로 꾸미지 않는다."
  },
  "c22-s61-u01-w084": {
    "unit": "c22-s61-u01",
    "no": 84,
    "prompt": "용액 A와 B에 붉은 시험지와 푸른 시험지를 묻히기 전과 뒤의 색을 적을 빈 표를 그리세요. 각 칸에 무엇을 적을지 이름도 써 주세요.",
    "previousCriteria": "A/B 구분·두 종이의 처음/나중 색·시점/불분명 칸과 이름표를 그린다. 타당한 다른 표 배열도 인정하고 가상 결과를 미리 채우지 않는다.",
    "criteria": "A/B와 붉은 시험지·푸른 시험지를 구별하고 처음 색과 나중 색을 적을 빈칸에 이름표를 붙인다. 다른 타당한 배열과 관찰 시각·불분명한 점을 적을 칸도 인정한다. 실제 없는 결과를 미리 채우지 않는다."
  },
  "c22-s61-u01-w086": {
    "unit": "c22-s61-u01",
    "no": 86,
    "prompt": "리트머스 시험지의 색 변화가 예상과 달랐어요. 무엇을 다시 확인하고, 처음 결과와 다시 관찰한 결과를 어떻게 적을까요?",
    "previousCriteria": "예상과 실제 색의 첫 기록을 보존하고 종이 처음 색·오염·표지·관찰 조건 중 둘 이상 점검하여 재관찰을 새 기록으로 남긴다.",
    "criteria": "시험지의 처음 색·용액 표시·도구 오염·관찰 조건 등 타당한 확인 항목과 재관찰할 방법을 쓴다. 처음과 다시 관찰한 결과는 나누어 남긴다."
  },
  "c22-s61-u01-w089": {
    "unit": "c22-s61-u01",
    "no": 89,
    "prompt": "선생님이 묽은 염산에 묽은 수산화 나트륨 용액을 조금씩 넣는 모습을 관찰하려고 해요. 넣은 양과 색 변화를 적을 빈 표를 그리세요.",
    "previousCriteria": "처음 시료/지시약 조건·단계·이번 추가량/누적량·색·시점/불분명 칸을 구별한 빈 표를 그린다. 실제 없는 색을 채우지 않는다.",
    "criteria": "넣은 차례와 양, 관찰한 색을 적을 빈칸을 구별한다. 처음 용액·지시약 조건, 누적한 양, 관찰한 때나 불분명한 점을 적을 칸을 더해도 인정한다. 결과를 미리 채우지 않는다."
  },
  "c22-s61-u01-w091": {
    "unit": "c22-s61-u01",
    "no": 91,
    "prompt": "같은 혼합 실험을 다시 관찰하려고 해요. 처음 기록을 어떻게 남겨 두고, 어떤 조건을 같게 해야 할까요?",
    "previousCriteria": "첫 회차를 보존하고 반복 회차를 나누며 처음 시료/지시약·첨가량/방법·시점/조명 중 둘 이상의 조건과 차이/변경을 기록한다.",
    "criteria": "처음 기록을 남겨 두고 다시 관찰한 기록을 나눈다. 처음 용액과 지시약의 양·넣는 방법·관찰 시각·조명 등 타당한 비교 조건을 같게 할 계획을 쓴다."
  },
  "c22-s61-u01-w125": {
    "unit": "c22-s61-u01",
    "no": 125,
    "prompt": "틀린 문제 하나를 골라 처음 생각과 놓친 조건, 생각을 고친 까닭을 차례로 쓰세요.",
    "previousCriteria": "자기 오답 문항 번호와 처음 생각·구체적으로 놓친 조건·근거를 반영한 수정 설명을 연결한다.",
    "criteria": "고른 문항의 처음 생각과 놓친 조건, 근거를 반영해 생각을 고친 까닭을 차례로 쓴다."
  }
};
const cache=new WeakMap();
const clone=value=>JSON.parse(JSON.stringify(value));
export function reviewedQuestionCriteria(rows,unit){
 if(!REVIEWED_CRITERIA_UNITS.includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(question=>{
  const patch=patches[question.id];
  if(!patch||patch.unit!==unit||question.status!=='authored'||question.sourceContent||(question.contentVersion||1)!==patch.previousVersion||question.prompt!==patch.prompt||JSON.stringify(question.sourceRef)!==JSON.stringify(patch.sourceRef)||JSON.stringify(question.workbookRef)!==JSON.stringify(patch.workbookRef)||question.responseContract!==patch.responseContract)return question;
  if(patch.required&&(!['written-explanation','drawing'].includes(question.answerContract?.type)||JSON.stringify(question.answerContract.rubric?.required)!==JSON.stringify(patch.previousRequired)))return question;
  if(patch.choices&&(question.answerContract?.type!=='single-choice'||question.answerContract.answer!==patch.answer||JSON.stringify(question.choices)!==JSON.stringify(patch.previousChoices)))return question;
  changed=true;if(cache.has(question))return cache.get(question);
  const fields=patch.required?{answerContract:{...question.answerContract,rubric:{...question.answerContract.rubric,required:[...patch.required]}}}:{choices:[...patch.choices]};
  const current={...question,...fields,contentVersion:REVIEWED_CRITERIA_VERSION,previousVersions:[...(question.previousVersions?clone(question.previousVersions):[]),{...clone(question),version:question.contentVersion||1,snapshotKind:'full-question'}]};
  cache.set(question,current);return current;
 });return changed?next:rows;
}
export function withReviewedWorkbookCriteria(workbook){
 if(!workbook?.questions)return workbook;
 let changed=false;
 const questions=workbook.questions.map(q=>{
  const patch=workbookPatches[q.id];
  if(!patch||workbook.unit!==patch.unit||q.no!==patch.no||q.prompt!==patch.prompt||q.criteria!==patch.previousCriteria)return q;
  changed=true;return{...q,criteria:patch.criteria};
 });return changed?{...workbook,questions}:workbook;
}
export function withReviewedCriteriaClassroom(unit,mod){
 if(!mod?.classroomItems)return mod;
 const classroomItems=reviewedQuestionCriteria(mod.classroomItems,unit);
 return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};
}
