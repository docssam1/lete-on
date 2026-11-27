// 잎 사진·측정 자료·환경·설계를 연결하는 수업. 실제 관찰 기록은 원래 교재에 보존한다.
export const chapter = {
 "plantThinking": true,
 "plantInteraction": {
  "predict": {
   "q": "잎 사진을 나눌 기준만 정하면, 사진만으로 언제나 두 모둠을 정할 수 있을까요?",
   "options": [
    "어떤 기준이든 사진만 보면 나눌 수 있다",
    "기준에 따라 실제 측정 같은 추가 자료가 필요하다",
    "자료를 더 살핀 뒤 판단하겠다"
   ],
   "answer": 1,
   "result": "톱니 모양은 사진에서 살필 수 있어도 실제 길이는 실제 길이를 알려 주는 눈금이나 직접 잰 값이 더 필요해요."
  }
 },
 "labRecordTitle": "내 잎 사진 기준 비교",
 "slideCues": {
  "cover": "같은 잎 사진에서 보이는 모양과 실제로 재어야 아는 길이를 구별해 봐요.",
  "photos": "잎의 가장자리를 보아요. 화면에서 큰 잎이 실제로도 큰지 생각해요.",
  "design": "같은 네 잎을 가장자리와 실제 길이 기준으로 살펴요. 필요한 자료도 비교해요.",
  "scope": "사진에서 관찰한 부분을 가리키고 같은 부분끼리 비교해요.",
  "measurements": "이 표는 별도 가상 잎 자료예요. 앞의 사진을 잰 값이 아니에요.",
  "habitat": "식물마다 몸의 어느 부분이 어디에 있고 어떻게 생활하는지 연결해요.",
  "design-function": "식물의 특징이 물건의 어느 부분에서 어떤 기능을 도울지 설명해요.",
  "share": "친구의 질문을 듣고 설계를 다듬고 필요한 확인 방법을 제안해요.",
  "predict": "기준에 따라 실제 측정 같은 추가 자료가 필요한지 먼저 예상해요.",
  "lab": "잎 가장자리와 실제 길이의 두 기준에서 사진으로 확인할 수 있는 범위를 비교해요.",
  "results": "사진에서 보이는 모양과 직접 재어야 아는 길이를 구별해 설명해요.",
  "conclusion": "처음 예상과 확인한 자료를 연결하고, 부족한 자료는 무엇인지 설명해요.",
  "end": "관찰 범위와 필요한 자료, 식물의 생활과 설계의 기능을 연결해요."
 },
 "title": "잎의 기준과 필요한 자료를 비교해요",
 "startDescriptions": [
  "사진에서 먼저 분류하고 설명 자료와 비교해요.",
  "모양과 실제 길이를 판단할 자료를 구별해요.",
  "환경·특징·기능을 연결해 설계를 토의해요."
 ],
 "check": [
  "1-1",
  "1-5",
  "1-10",
  "1-11",
  "1-13",
  "1-17",
  "1-18",
  "1-20"
 ],
 "webBookDescription": "잎 사진과 자료·문제를 읽고 기준에 필요한 자료를 비교해요."
};
export const plan = {
 "minutes": 80,
 "note": "사진 관찰·두 기준의 자료 비교·환경 자료·설계 토의의 수업 예시. 실제 수행 기록은 선택 교재로 이어진다.",
 "phases": [
  {
   "id": "open",
   "name": "현상·예상",
   "min": 10,
   "aim": "사진에서 알 수 있는 특징과 필요한 자료를 예상한다."
  },
  {
   "id": "observe",
   "name": "잎 사진 비교",
   "min": 20,
   "aim": "가장자리와 실제 길이 기준에서 먼저 판단하고 자료와 비교한다."
  },
  {
   "id": "result",
   "name": "결과 설명",
   "min": 10,
   "aim": "기준에 따라 판단할 수 있는 범위와 부족한 자료를 설명한다."
  },
  {
   "id": "concept",
   "name": "관찰·측정 기준",
   "min": 10,
   "aim": "관찰 범위·사진 확대·실제 측정값을 구별한다."
  },
  {
   "id": "research",
   "name": "환경과 생활",
   "min": 10,
   "aim": "식물별 자료로 환경·생김새·생활을 연결한다."
  },
  {
   "id": "extend",
   "name": "설계·소통",
   "min": 15,
   "aim": "특징·기능·확인 방법을 말과 그림으로 제안한다."
  },
  {
   "id": "check",
   "name": "확인",
   "min": 5,
   "aim": "자료와 근거로 확인 문제를 푼다."
  }
 ],
 "say": {
  "lab": "자료 더 필요를 오답으로 처리하지 않습니다. 길이 기준에서 네 사진 모두 판단을 보류할 이유를 설명하게 합니다."
 }
};
export const checks = [
 {
  "id": "s31-u03-v003",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 3
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E1",
   "type": "T03",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "두 모둠이 같은 잎을 분류할 때 판단이 달라지기 쉬운 기준은 무엇입니까?",
  "givens": null,
  "choices": [
   "관찰한 잎의 끝이 둥근 모양인가?",
   "관찰한 잎이 바늘처럼 길쭉한가?",
   "관찰한 잎 가장자리가 톱니 모양인가?",
   "한 자루에 작고 넓적한 부분이 여러 개 달렸는가?",
   "잎의 색깔이 아름답게 느껴지는가?"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 4,
   "accepted": [
    4
   ]
  },
  "explanation": "아름답다는 느낌은 사람마다 달라 같은 잎도 다르게 놓을 수 있어요. 끝·가장자리·한 자루의 작고 넓적한 부분처럼 관찰할 부분을 정한 기준과 구별해요. 관찰 기준도 살핀 범위와 말뜻을 맞춰야 해요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v004",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 4
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E1",
   "type": "T04",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "잎 관찰 기록을 읽고 가장자리가 톱니 모양인 카드만 고르시오.",
  "givens": {
   "보기": [
    "㉠ 가장자리에 작은 톱니가 보였다.",
    "㉡ 가장자리가 매끈했다.",
    "㉢ 가장자리에 톱니가 보이고 끝이 뾰족했다.",
    "㉣ 바늘처럼 가늘고 가장자리가 매끈했다."
   ]
  },
  "choices": [
   "㉠, ㉡",
   "㉠, ㉢",
   "㉡, ㉣",
   "㉢, ㉣",
   "㉠, ㉢, ㉣"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 1,
   "accepted": [
    1
   ]
  },
  "explanation": "㉠·㉢에는 가장자리의 톱니가 기록돼 있어요. ㉢의 끝이 뾰족하다는 다른 특징이나 ㉣의 바늘 같은 전체 모양을 톱니의 근거로 대신하지 않아요. 선택한 두 카드 모두 같은 기준에 맞는지 확인해요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v009",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 9
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E3",
   "type": "T08",
   "format": "서술형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "다음 관찰 기록으로 부레옥잠이 물에 뜨는 까닭을 설명하시오.",
  "givens": {
   "지문": "관찰 기록: 볼록한 잎자루의 속에 작은 공기주머니가 많았다."
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "잎자루의 공기주머니 덕분에 물에 뜰 수 있다.",
   "rubric": {
    "required": [
     "잎자루 속 공기가 물에 뜨는 데 도움이 됨"
    ],
    "pass": "채점 기준을 모두 담으면 정답"
   }
  },
  "explanation": "기록의 잎자루 속 공기 공간을 물에 뜨는 데 도움이 되는 특징으로 연결해요. 잎자루라는 부분만 쓰거나 뿌리의 모양으로 바꾸면 까닭이 빠져요. 공기주머니·공기가 든 공간처럼 같은 뜻으로 설명할 수 있고 무게 수치를 만들 필요는 없어요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v001",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 1
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E1",
   "type": "T01",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "관찰 기록에 이름표를 붙이려고 합니다. 알맞은 식물을 고르시오.",
  "givens": {
   "지문": "그늘진 화단에서도 자랐다. 잎은 좁고 길쭉했고 보라색 꽃이 피어 있었다."
  },
  "choices": [
   "맥문동",
   "토끼풀",
   "회양목",
   "강아지풀",
   "단풍나무"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "좁고 길쭉한 잎과 보라색 꽃이라는 두 기록을 함께 대조하면 보기 중 맥문동이에요. 그늘에서 자랐다는 장소 하나만으로 이름을 정하거나 모든 식물이 같은 꽃을 피운다고 판단하지 않아요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v005",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 5
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E1",
   "type": "T04",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "기록 카드의 두 상자에 붙일 수 있는 분류 기준을 고르시오.",
  "givens": {
   "지문": "해당함 상자: 바늘 모양 잎 카드, 길고 좁은 잎 카드\n해당하지 않음 상자: 둥근 잎 카드, 손바닥처럼 갈라진 잎 카드"
  },
  "choices": [
   "잎이 귀엽게 느껴지는가?",
   "모든 잎 끝 모양이 둥근가?",
   "한 자루에 작고 넓적한 부분이 여러 개 달렸는가?",
   "잎 가장자리가 모두 톱니인가?",
   "잎 전체 모양이 길쭉한가?"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 4,
   "accepted": [
    4
   ]
  },
  "explanation": "바늘 모양과 길고 좁은 잎은 전체 모양이 길쭉하다는 질문에 함께 해당해요. 둥근 잎과 손바닥처럼 갈라진 잎은 반대 상자예요. 가장자리나 넓적한 부분의 수라는 다른 기준으로 중간에 바꾸지 않아요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v010",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 10
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E3",
   "type": "T07",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "연못 전시의 이름표에 맞는 식물 하나를 고르시오.",
  "givens": {
   "지문": "전시 이름표: 뿌리가 땅에 닿지 않고 물속으로 뻗으며, 물에 떠서 사는 식물"
  },
  "choices": [
   "개구리밥",
   "연꽃",
   "부들",
   "갈대",
   "검정말"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "이름표의 물에 뜸과 뿌리가 물속으로 뻗음에 맞는 보기는 개구리밥이에요. 뿌리가 물속에 있다는 것과 바닥의 땅에 박혀 있다는 것은 달라요. 물속에 잠겨 사는 검정말과도 구별해요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v011",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 11
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E3",
   "type": "T07",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "안내문에 맞지 않아 다른 전시로 옮겨야 하는 식물을 고르시오.",
  "givens": {
   "지문": "전시 안내: 잎이 물 위로 높이 자라고 뿌리는 물속이나 물가의 땅에 있는 식물"
  },
  "choices": [
   "연꽃",
   "부들",
   "물상추",
   "갈대",
   "창포"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 2,
   "accepted": [
    2
   ]
  },
  "explanation": "물상추는 물에 떠서 사는 예이므로 바닥이나 물가 땅에 뿌리를 두고 높이 자라는 전시 안내와 달라요. 물 위에 잎이 보인다는 한 특징만으로 연·부들·갈대와 모두 같은 생활이라고 묶지 않아요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v013",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 13
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E4",
   "type": "T10",
   "format": "서술형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "두 식물의 기록에 나타난 공통적인 물 저장 방법을 쓰시오.",
  "givens": {
   "지문": "용설란: 잎이 두껍고 안쪽에 물기가 많았다.\n알로에: 두꺼운 잎 안쪽이 촉촉했다."
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "written-explanation",
  "answerContract": {
   "type": "written-explanation",
   "sample": "두꺼운 잎에 물을 저장한다.",
   "rubric": {
    "required": [
     "두꺼운 잎에 물을 저장하는 공통 특징"
    ],
    "pass": "채점 기준을 모두 담으면 정답"
   }
  },
  "explanation": "용설란과 알로에 기록 모두 두꺼운 잎 안쪽의 물기를 소개해요. 두꺼운 잎에 물을 저장한다는 공통점을 쓰고, 선인장의 줄기 저장으로 부분을 바꾸지 않아요. 두 식물을 따로 길게 설명하거나 날씨를 반복할 필요는 없어요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v017",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 17
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E5",
   "type": "T11",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "한라솜다리가 주로 사는 환경에 대한 설명으로 알맞은 것을 고르세요.",
  "givens": null,
  "choices": [
   "비가 거의 내리지 않아 메마릅니다.",
   "물이 고여 있어 뿌리가 물에 잠깁니다.",
   "소금 성분이 많은 바닷물이 드나듭니다.",
   "큰 나무가 많아 햇빛이 거의 들지 않습니다.",
   "기온이 낮고 바람이 강하게 붑니다."
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 4,
   "accepted": [
    4
   ]
  },
  "explanation": "이 단원에서 한라솜다리를 소개하는 높은 산의 낮은 기온·강한 바람을 골라요. 건조한 사막, 바닷물이 드나드는 곳, 물이 고인 곳과 구별해요. 높은 산의 모든 지점과 계절이 항상 같은 상태라는 뜻은 아니에요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v018",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 18
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E6",
   "type": "T13",
   "format": "단답형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "단풍나무 열매를 참고하여 회전하는 종이 날개 모형을 설계하려 합니다. 참고한 특징을 골라 기호를 쓰시오.",
  "givens": {
   "보기": [
    "㉠ 끈끈한 표면에 먼지가 붙는다.",
    "㉡ 빙글빙글 돌면서 천천히 떨어진다.",
    "㉢ 뾰족한 가시가 있어 몸을 보호한다."
   ]
  },
  "choices": null,
  "visualModel": null,
  "variantRules": null,
  "responseContract": "short-text",
  "answerContract": {
   "type": "short-text",
   "answer": "㉡",
   "accepted": [
    "㉡",
    "ㄴ",
    "나"
   ]
  },
  "explanation": "㉡의 빙글빙글 회전하며 천천히 떨어짐을 종이 날개 모형의 목표와 연결해요. 갈고리로 붙기나 가시로 보호하기는 다른 쓰임이에요. 이 문제의 설계 아이디어로 특정 실제 비행체의 발명 역사나 성능을 확정하지 않아요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 },
 {
  "id": "s31-u03-v020",
  "status": "authored",
  "sourceRef": {
   "type": "similar",
   "of": {
    "set": 1,
    "no": 20
   }
  },
  "taxonomy": {
   "curriculum": "2022 개정",
   "grade": 3,
   "semester": 1,
   "unit": "u03",
   "area": "생명",
   "element": "E6",
   "type": "T13",
   "format": "선택형",
   "level": "기본",
   "track": "교과"
  },
  "prompt": "도꼬마리 열매를 관찰한 뒤 쉽게 붙였다 떼는 띠를 설계하려 합니다. 가장 관련 있는 물건을 고르시오.",
  "givens": {
   "지문": "관찰 기록: 열매의 가시 끝이 갈고리처럼 휘어 천에 잘 걸렸다."
  },
  "choices": [
   "찍찍이 테이프",
   "낙하산",
   "철조망",
   "회전 날개 모형",
   "물에 젖지 않는 옷감"
  ],
  "visualModel": null,
  "variantRules": null,
  "responseContract": "single-choice",
  "answerContract": {
   "type": "single-choice",
   "answer": 0,
   "accepted": [
    0
   ]
  },
  "explanation": "기록의 갈고리 끝이 천에 걸림을 찍찍이 테이프의 붙였다 떼는 부분과 연결해요. 낙하산이나 물에 젖지 않는 옷감은 다른 기능이에요. 특징을 참고했다는 것만으로 새 띠의 붙는 힘과 내구성이 확인되는 것은 아니에요.",
  "evidence": {
   "checkedBy": "문항 검수",
   "date": "2026-10-17",
   "gates": [
    "science",
    "answer"
   ]
  }
 }
];
export const lab = {
 "kind": "plant-compare",
 "rowsKey": "plantCompareRows",
 "goal": "잎 사진을 먼저 나누고 자료와 비교해요. 기준에 따라 필요한 자료가 달라지는지 설명해요.",
 "columns": [
  "기준",
  "자료 보기 전 내 분류",
  "자료로 확인한 분류"
 ]
};
