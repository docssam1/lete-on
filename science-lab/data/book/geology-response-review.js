export const GEOLOGY_RESPONSE_VERSION='20261115-geology-response-review';
// Teacher review follows each prompt; previous full presentations remain available.
const review={
 "patches": [
  {
   "previous": {
    "id": "c22-s51-u01-w011",
    "no": 11,
    "form": "written",
    "topic": "지층이 쌓인 순서",
    "prompt": "세 지층의 색과 두께만 보고 가장 두꺼운 층이 먼저 쌓였다고 했습니다. 쌓인 순서를 판단하려면 무엇을 확인해야 하는지 설명하세요.",
    "answer": "처음 쌓인 순서가 뒤집힘 등으로 바뀌지 않았는지 확인한다. 그런 조건에서 아래층이 위층보다 먼저 쌓였다고 설명하며 색·두께만으로 정확한 나이나 퇴적 기간은 정하지 않는다.",
    "explanation": "지층이 뒤집히거나 쌓인 순서가 바뀌지 않았는지 먼저 확인해요. 순서가 그대로라면 아래층이 위층보다 먼저 쌓였어요. 층이 두껍거나 색이 어둡다는 것만으로 먼저 쌓였다고 할 수는 없어요.",
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
   "fields": {
    "criteria": "층이 뒤집히거나 순서가 바뀌지 않았는지 확인하고, 그런 경우 아래층이 먼저 쌓였다고 설명하면 인정해요. 색이나 두께만으로 순서를 정하지 않아요.",
    "sourceContract": {
     "type": "written-explanation",
     "sample": "처음 쌓인 순서가 뒤집힘 등으로 바뀌지 않았는지 확인한다. 그런 조건에서 아래층이 위층보다 먼저 쌓였다고 설명하며 색·두께만으로 정확한 나이나 퇴적 기간은 정하지 않는다.",
     "rubric": {
      "required": [
       "층이 뒤집히거나 순서가 바뀌지 않았는지 확인",
       "그 조건에서 아래층이 먼저 쌓였다는 근거"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w021",
    "no": 21,
    "form": "written",
    "topic": "사진 속 두께와 실제 두께",
    "prompt": "사진에서 위쪽 지층이 아래쪽보다 두껍게 보여요. 사진에서 알 수 있는 것과 아직 알 수 없는 것을 쓰고, 더 살펴볼 자료도 적으세요.",
    "answer": "사진에서 위쪽 층이 더 두껍게 보인다고 적는다. 실제 두께나 쌓이는 데 걸린 시간은 이 사진만으로 알 수 없다. 실제 크기를 알려 주는 표시나 다른 방향에서 찍은 사진을 더 살펴본다.",
    "explanation": "사진에 보이는 곳에서는 위쪽 층이 더 두껍다고 말할 수 있어요. 실제 두께를 알려면 크기를 알려 주는 표시와 사진을 찍은 방향 등을 더 살펴야 해요. 두께만으로 쌓인 기간은 알 수 없어요.",
    "misconception": "두껍게 보인다는 관찰만으로 실제cm나 걸린 시간을 알 수는 없어요.",
    "criteria": "관찰 범위 / 실제 길이·기간 미확인 / 배율·방향 등 추가 자료",
    "lines": 8,
    "standard": "6과01-01",
    "figure": "geoHorizontal"
   },
   "fields": {
    "criteria": "사진에서 보이는 두께 차이와 사진만으로 알 수 없는 정보 한 가지를 나누고, 그 정보를 알아볼 자료나 방법을 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w022",
    "no": 22,
    "form": "written",
    "topic": "큰 자갈과 쌓는 차례",
    "prompt": "진흙→모래→자갈을 한 종류씩 따로 쌓았는데 “자갈이 크니 맨 아래에 있을 것”이라고 했습니다. 이 모형의 조건과 올바른 위치를 설명하세요.",
    "answer": "뒤집거나 깎지 않고 각각 따로 쌓았으므로 처음 넣은 진흙이 아래, 모래가 가운데, 마지막 자갈이 위에 있다. 섞은 재료가 가라앉는 실험과 구별한다.",
    "explanation": "재료를 섞어 한꺼번에 넣은 실험이 아니에요. 진흙을 먼저 넣고 그 위에 모래, 마지막에 자갈을 넣었으므로 아래부터 진흙·모래·자갈이에요.",
    "misconception": "세 재료를 섞어 가라앉힌 실험이 아니에요. 따로 넣은 진흙이 아래, 마지막 자갈이 위예요.",
    "criteria": "따로 쌓음·순서 보존 / 아래·가운데·위 / 섞어 넣는 실험과 구별",
    "lines": 8,
    "standard": "6과01-01"
   },
   "fields": {
    "criteria": "한 종류씩 따로 쌓고 순서를 바꾸지 않았다는 조건과 진흙·모래·자갈의 아래·가운데·위 위치를 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w042",
    "no": 42,
    "form": "written",
    "topic": "알갱이 크기로 퇴적암 분류하기",
    "prompt": "이암·사암·역암을 모아 분류표를 만들려고 합니다. 같은 기준으로 세 암석을 구별하는 근거를 쓰세요.",
    "answer": "암석을 이루는 알갱이 크기를 기준으로 한다. 아주 작은 진흙 알갱이 중심은 이암, 모래 크기 중심은 사암, 자갈 크기가 뚜렷하면 역암으로 나누고 불분명한 표본은 더 관찰한다.",
    "explanation": "세 암석 모두 암석을 이루는 알갱이의 크기로 나누어요. 매우 작은 진흙 알갱이는 이암, 모래 크기는 사암, 큰 자갈 알갱이가 뚜렷하면 역암이에요.",
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
   "fields": {
    "criteria": "알갱이의 크기를 공통 기준으로 삼고 이암·사암·역암을 각각 어떤 알갱이로 구별했는지 설명하면 인정해요.",
    "sourceContract": {
     "type": "written-explanation",
     "sample": "암석을 이루는 알갱이 크기를 기준으로 한다. 아주 작은 진흙 알갱이 중심은 이암, 모래 크기 중심은 사암, 자갈 크기가 뚜렷하면 역암으로 나누고 불분명한 표본은 더 관찰한다.",
     "rubric": {
      "required": [
       "구성 알갱이의 크기라는 공통 기준",
       "이암·사암·역암을 구별한 각 알갱이의 특징"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w049",
    "no": 49,
    "form": "written",
    "topic": "암석을 분류한 까닭 비교하기",
    "prompt": "같은 암석을 한 모둠은 붉은색이라서 사암, 다른 모둠은 모래 크기 알갱이가 보인다고 사암으로 분류했습니다. 두 근거를 비교하고 더 확인할 점을 쓰세요.",
    "answer": "붉은색이라는 것만으로 사암이라고 할 수 없다. 모래 크기의 알갱이를 관찰한 모둠의 설명이 분류 기준에 맞는다. 같은 표본을 돋보기 등으로 다시 살피고, 잘 보이지 않으면 아직 분류하지 않고 더 관찰한다.",
    "explanation": "이름이 모두 사암이어도 분류한 까닭은 달라요. 붉은색이라는 것만으로는 사암인지 알 수 없어요. 모래 크기의 알갱이가 보인다는 둘째 모둠의 설명이 분류 기준에 맞아요.",
    "misconception": "같은 사암이라는 결론이어도 붉은색이라는 근거와 모래 크기 알갱이라는 근거의 타당성은 달라요.",
    "criteria": "색만으로 확정하지 않음 / 알갱이 크기 기준 / 도구·배율·불분명 재확인",
    "lines": 8,
    "standard": "6과01-02"
   },
   "fields": {
    "criteria": "색만으로 이름을 정할 수 없다는 점과 알갱이 크기라는 분류 근거를 비교하고, 더 확인할 알갱이의 특징이나 관찰 방법을 한 가지 쓰면 인정해요."
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w066",
    "no": 66,
    "form": "written",
    "topic": "화석에 남은 생물의 몸과 흔적",
    "prompt": "친구가 화석은 죽은 생물의 몸 전체가 돌이 된 것만 있다고 했습니다. 화석의 여러 증거와 관찰할 특징을 설명하세요.",
    "answer": "몸의 일부나 잎·껍데기의 모양, 발자국 같은 활동 흔적도 화석으로 남을 수 있다. 화석에서 실제로 보이는 생물의 특징을 살피고, 어디에서 발견된 것인지 알아본다. 오늘 남긴 무늬나 사람이 만든 모형과는 구별한다.",
    "explanation": "화석에는 몸 전체뿐 아니라 잎이나 껍데기 일부, 살아 있을 때 남긴 발자국도 있어요. 표본에서 어떤 몸의 특징이나 활동 흔적이 보이는지 찾아 설명해요.",
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
   "fields": {
    "criteria": "몸의 일부와 활동 흔적의 예를 들어 화석이 몸 전체만 남은 것은 아니라고 설명하고, 화석에서 살펴볼 생물의 특징을 쓰면 인정해요.",
    "sourceContract": {
     "type": "written-explanation",
     "sample": "몸의 일부나 잎·껍데기 같은 모양뿐 아니라 생물이 살아서 남긴 발자국 등 활동 흔적도 보존될 수 있다. 표본의 보이는 생물 특징과 출처·보존 맥락을 확인하고 오늘 무늬·유물·모형과 구별한다.",
     "rubric": {
      "required": [
       "몸의 일부와 활동 흔적도 화석의 증거가 될 수 있다는 설명",
       "화석에서 살펴볼 생물의 모양이나 특징"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w067",
    "no": 67,
    "form": "written",
    "topic": "화석으로 과거 환경 추리하기",
    "prompt": "지층에서 바다 생물의 화석이 발견되었습니다. 그곳의 과거 환경을 추리하고, 그렇게 생각한 까닭과 아직 알 수 없는 점을 쓰세요.",
    "answer": "그 생물이 바다에 살았다는 자료와 화석이 나온 지층을 함께 살펴본다. 그 지층이 만들어질 때 바다와 관련된 환경이었을 수 있다. 지금도 바다인지, 당시 기온이나 정확한 연도는 화석 하나만으로 알 수 없다.",
    "explanation": "화석의 특징을 살피고, 그 생물이 어디에 살았는지와 화석이 어느 지층에서 발견됐는지를 함께 읽어요. 바다에 살던 생물의 화석이라면 과거 바다와 관련된 환경이었다고 추리할 수 있어요.",
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
   "fields": {
    "criteria": "바다 생물의 생활 자료와 발견된 지층을 연결해 과거 환경을 추리하고, 이 자료만으로 알 수 없는 점을 한 가지 설명하면 인정해요.",
    "sourceContract": {
     "type": "written-explanation",
     "sample": "화석의 보이는 특징·생물 생활 자료와 발견 지층·출처를 연결한다. 그 지층이 생길 무렵 바다와 관련된 환경이었을 가능성을 추리하되 지금도 바다라는 결론이나 정확한 기온·연도를 하나의 화석으로 확정하지 않는다.",
     "rubric": {
      "required": [
       "바다에서 살던 생물이라는 자료와 발견 지층을 연결",
       "과거 바다와 관련된 환경이었을 가능성",
       "이 자료만으로 알 수 없는 점 한 가지"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w077",
    "no": 77,
    "form": "written",
    "topic": "현재 산과 과거 환경",
    "prompt": "주어진 학습용 자료로 그곳의 과거 환경을 추리하세요. 자료로 알 수 있는 것과 아직 알 수 없는 것을 나누어 설명하세요.",
    "answer": "A는 바다에 살았고, 그 화석이 옮겨온 돌이 아니라 이 지층에 남아 있다는 두 자료를 연결한다. 그 지층이 만들어질 무렵 바다와 관련된 환경이었을 수 있다. 지금도 바다인지, 당시 수온과 정확한 연도는 이 자료만으로 알 수 없다.",
    "explanation": "그 지층에서 발견된 화석 A가 바다에 살던 생물이라는 두 자료를 연결해요. 과거 바다와 관련된 환경이었을 수 있지만 지금도 바다라고 하거나 정확한 수온과 연도를 정할 수는 없어요.",
    "misconception": "현재 산의 모습만으로 과거를 정하지 않아요. 발견 지층과 바다 생활 자료를 함께 써요.",
    "criteria": "발견 지층·생활 자료 / 과거 환경의 가능성 / 현재·정확한 수치의 한계",
    "lines": 8,
    "standard": "6과01-03",
    "figure": "geoPast"
   },
   "fields": {
    "criteria": "주어진 생물의 생활 자료와 발견된 지층을 연결해 과거 환경을 추리하고, 이 자료만으로 알 수 없는 점을 한 가지 설명하면 인정해요."
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-w078",
    "no": 78,
    "form": "blank",
    "topic": "환경 추리의 두 근거",
    "prompt": "화석으로 과거 환경을 추리할 때는 생물의 ㉠[ ] 모습에 관한 자료와 화석이 발견된 ㉡[ ]을 함께 살펴요.",
    "answer": "㉠ 생활 · ㉡ 지층",
    "explanation": "생물의 생활 모습을 알려 주는 자료와 화석이 발견된 지층을 함께 살펴요. 두 자료를 연결해 과거 환경을 추리해요.",
    "misconception": "생물의 생활과 화석의 발견 지층을 연결해요. 사진의 모양만으로 환경을 정하지 않아요.",
    "criteria": "생활과 지층을 각각 확인하고 두 근거가 지지하는 추리를 설명해요.",
    "standard": "6과01-03"
   },
   "fields": {
    "criteria": "㉠에 생활, ㉡에 지층을 알맞게 넣으면 인정해요."
   }
  }
 ],
 "bankPatches": [
  {
   "previous": {
    "id": "c22-s51-u01-b024",
    "status": "authored",
    "sourceRef": {
     "type": "authored-supplement",
     "edition": "GFIELD 지층과 화석 창작 학습",
     "course": "초등5-1"
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E2",
     "type": "T03",
     "format": "서술형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-01",
     "topic": "지층이 쌓인 순서",
     "concept": "층이 쌓인 순서와 조건",
     "inquirySkill": "근거 설명·모형·수행 구별"
    },
    "prompt": "세 지층의 색과 두께만 보고 가장 두꺼운 층이 먼저 쌓였다고 했습니다. 쌓인 순서를 판단하려면 무엇을 확인해야 하는지 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
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
    "explanation": "지층이 뒤집히거나 쌓인 순서가 바뀌지 않았는지 먼저 확인해요. 순서가 그대로라면 아래층이 위층보다 먼저 쌓였어요. 층이 두껍거나 색이 어둡다는 것만으로 먼저 쌓였다고 할 수는 없어요.",
    "evidence": {
     "checkedBy": "창작 학습 문항 검수",
     "date": "2026-10-18",
     "gates": [
      "science",
      "answer"
     ],
     "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
     "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
    },
    "contentVersion": "20261106-geology-readable-workbook",
    "previousVersions": [
     {
      "id": "c22-s51-u01-b024",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E2",
       "type": "T03",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-01",
       "topic": "층이 쌓인 순서와 조건",
       "concept": "층이 쌓인 순서와 조건",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "세 층의 색과 두께만 보고 가장 두꺼운 층이 가장 오래됐다고 했습니다. 순서를 해석할 조건과 근거를 설명하세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "상대적인 쌓임 순서와 정확한 형성 연도·기간은 구별해요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "version": 1
     },
     {
      "id": "c22-s51-u01-b024",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E2",
       "type": "T03",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-01",
       "topic": "지층이 쌓인 순서",
       "concept": "층이 쌓인 순서와 조건",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "세 지층의 색과 두께만 보고 가장 두꺼운 층이 먼저 쌓였다고 했습니다. 쌓인 순서를 판단하려면 무엇을 확인해야 하는지 설명하세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "상대적인 쌓임 순서와 정확한 형성 연도·기간은 구별해요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "contentVersion": "20261105-geology-student-language",
      "previousVersions": [
       {
        "id": "c22-s51-u01-b024",
        "status": "authored",
        "sourceRef": {
         "type": "authored-supplement",
         "edition": "GFIELD 지층과 화석 창작 학습",
         "course": "초등5-1"
        },
        "taxonomy": {
         "curriculum": "2022 개정",
         "grade": 5,
         "semester": 1,
         "unit": "u01",
         "area": "지구와 우주",
         "element": "E2",
         "type": "T03",
         "format": "서술형",
         "level": "기본",
         "track": "교과",
         "standard": "6과01-01",
         "topic": "층이 쌓인 순서와 조건",
         "concept": "층이 쌓인 순서와 조건",
         "inquirySkill": "근거 설명·모형·수행 구별"
        },
        "prompt": "세 층의 색과 두께만 보고 가장 두꺼운 층이 가장 오래됐다고 했습니다. 순서를 해석할 조건과 근거를 설명하세요.",
        "givens": null,
        "choices": null,
        "responseContract": "written-explanation",
        "answerContract": {
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
        "explanation": "상대적인 쌓임 순서와 정확한 형성 연도·기간은 구별해요.",
        "evidence": {
         "checkedBy": "창작 학습 문항 검수",
         "date": "2026-10-18",
         "gates": [
          "science",
          "answer"
         ],
         "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
         "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
        },
        "version": 1
       }
      ],
      "version": "20261105-geology-student-language"
     }
    ]
   },
   "fields": {
    "answerContract": {
     "type": "written-explanation",
     "sample": "처음 쌓인 순서가 뒤집힘 등으로 바뀌지 않았는지 확인한다. 그런 조건에서 아래층이 위층보다 먼저 쌓였다고 설명하며 색·두께만으로 정확한 나이나 퇴적 기간은 정하지 않는다.",
     "rubric": {
      "required": [
       "층이 뒤집히거나 순서가 바뀌지 않았는지 확인",
       "그 조건에서 아래층이 먼저 쌓였다는 근거"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-b056",
    "status": "authored",
    "sourceRef": {
     "type": "authored-supplement",
     "edition": "GFIELD 지층과 화석 창작 학습",
     "course": "초등5-1"
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E4",
     "type": "T07",
     "format": "서술형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-02",
     "topic": "알갱이 크기로 퇴적암 분류하기",
     "concept": "이암·사암·역암 분류",
     "inquirySkill": "근거 설명·모형·수행 구별"
    },
    "prompt": "이암·사암·역암을 모아 분류표를 만들려고 합니다. 같은 기준으로 세 암석을 구별하는 근거를 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
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
    "explanation": "세 암석 모두 암석을 이루는 알갱이의 크기로 나누어요. 매우 작은 진흙 알갱이는 이암, 모래 크기는 사암, 큰 자갈 알갱이가 뚜렷하면 역암이에요.",
    "evidence": {
     "checkedBy": "창작 학습 문항 검수",
     "date": "2026-10-18",
     "gates": [
      "science",
      "answer"
     ],
     "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
     "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
    },
    "contentVersion": "20261106-geology-readable-workbook",
    "previousVersions": [
     {
      "id": "c22-s51-u01-b056",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E4",
       "type": "T07",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-02",
       "topic": "이암·사암·역암 분류",
       "concept": "이암·사암·역암 분류",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "이암·사암·역암을 모아 분류표를 만들려고 합니다. 같은 기준으로 세 암석을 구별하는 근거를 쓰세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "표본마다 색·전체 무게 등 다른 기준을 적용하지 않아요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "version": 1
     },
     {
      "id": "c22-s51-u01-b056",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E4",
       "type": "T07",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-02",
       "topic": "알갱이 크기로 퇴적암 분류하기",
       "concept": "이암·사암·역암 분류",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "이암·사암·역암을 모아 분류표를 만들려고 합니다. 같은 기준으로 세 암석을 구별하는 근거를 쓰세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "표본마다 색·전체 무게 등 다른 기준을 적용하지 않아요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "contentVersion": "20261105-geology-student-language",
      "previousVersions": [
       {
        "id": "c22-s51-u01-b056",
        "status": "authored",
        "sourceRef": {
         "type": "authored-supplement",
         "edition": "GFIELD 지층과 화석 창작 학습",
         "course": "초등5-1"
        },
        "taxonomy": {
         "curriculum": "2022 개정",
         "grade": 5,
         "semester": 1,
         "unit": "u01",
         "area": "지구와 우주",
         "element": "E4",
         "type": "T07",
         "format": "서술형",
         "level": "기본",
         "track": "교과",
         "standard": "6과01-02",
         "topic": "이암·사암·역암 분류",
         "concept": "이암·사암·역암 분류",
         "inquirySkill": "근거 설명·모형·수행 구별"
        },
        "prompt": "이암·사암·역암을 모아 분류표를 만들려고 합니다. 같은 기준으로 세 암석을 구별하는 근거를 쓰세요.",
        "givens": null,
        "choices": null,
        "responseContract": "written-explanation",
        "answerContract": {
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
        "explanation": "표본마다 색·전체 무게 등 다른 기준을 적용하지 않아요.",
        "evidence": {
         "checkedBy": "창작 학습 문항 검수",
         "date": "2026-10-18",
         "gates": [
          "science",
          "answer"
         ],
         "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
         "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
        },
        "version": 1
       }
      ],
      "version": "20261105-geology-student-language"
     }
    ]
   },
   "fields": {
    "answerContract": {
     "type": "written-explanation",
     "sample": "암석을 이루는 알갱이 크기를 기준으로 한다. 아주 작은 진흙 알갱이 중심은 이암, 모래 크기 중심은 사암, 자갈 크기가 뚜렷하면 역암으로 나누고 불분명한 표본은 더 관찰한다.",
     "rubric": {
      "required": [
       "구성 알갱이의 크기라는 공통 기준",
       "이암·사암·역암을 구별한 각 알갱이의 특징"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-b072",
    "status": "authored",
    "sourceRef": {
     "type": "authored-supplement",
     "edition": "GFIELD 지층과 화석 창작 학습",
     "course": "초등5-1"
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E5",
     "type": "T09",
     "format": "서술형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-03",
     "topic": "화석에 남은 생물의 몸과 흔적",
     "concept": "동물·식물·활동 흔적 화석",
     "inquirySkill": "근거 설명·모형·수행 구별"
    },
    "prompt": "친구가 화석은 죽은 생물의 몸 전체가 돌이 된 것만 있다고 했습니다. 화석의 여러 증거와 관찰할 특징을 설명하세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
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
    "explanation": "화석에는 몸 전체뿐 아니라 잎이나 껍데기 일부, 살아 있을 때 남긴 발자국도 있어요. 표본에서 어떤 몸의 특징이나 활동 흔적이 보이는지 찾아 설명해요.",
    "evidence": {
     "checkedBy": "창작 학습 문항 검수",
     "date": "2026-10-18",
     "gates": [
      "science",
      "answer"
     ],
     "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
     "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
    },
    "contentVersion": "20261106-geology-readable-workbook",
    "previousVersions": [
     {
      "id": "c22-s51-u01-b072",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E5",
       "type": "T09",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-03",
       "topic": "동물·식물·활동 흔적 화석",
       "concept": "동물·식물·활동 흔적 화석",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "친구가 화석은 죽은 생물의 몸 전체가 돌이 된 것만 있다고 했습니다. 화석의 여러 증거와 관찰할 특징을 설명하세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "모든 화석이 몸 전체이거나 모두 같은 방식으로 돌이 된 것은 아니에요. 이 단원에서는 특징이 분명한 동식물 표본을 중심으로 관찰해요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "version": 1
     },
     {
      "id": "c22-s51-u01-b072",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E5",
       "type": "T09",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-03",
       "topic": "화석에 남은 생물의 몸과 흔적",
       "concept": "동물·식물·활동 흔적 화석",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "친구가 화석은 죽은 생물의 몸 전체가 돌이 된 것만 있다고 했습니다. 화석의 여러 증거와 관찰할 특징을 설명하세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "모든 화석이 몸 전체이거나 모두 같은 방식으로 돌이 된 것은 아니에요. 이 단원에서는 특징이 분명한 동식물 표본을 중심으로 관찰해요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "contentVersion": "20261105-geology-student-language",
      "previousVersions": [
       {
        "id": "c22-s51-u01-b072",
        "status": "authored",
        "sourceRef": {
         "type": "authored-supplement",
         "edition": "GFIELD 지층과 화석 창작 학습",
         "course": "초등5-1"
        },
        "taxonomy": {
         "curriculum": "2022 개정",
         "grade": 5,
         "semester": 1,
         "unit": "u01",
         "area": "지구와 우주",
         "element": "E5",
         "type": "T09",
         "format": "서술형",
         "level": "기본",
         "track": "교과",
         "standard": "6과01-03",
         "topic": "동물·식물·활동 흔적 화석",
         "concept": "동물·식물·활동 흔적 화석",
         "inquirySkill": "근거 설명·모형·수행 구별"
        },
        "prompt": "친구가 화석은 죽은 생물의 몸 전체가 돌이 된 것만 있다고 했습니다. 화석의 여러 증거와 관찰할 특징을 설명하세요.",
        "givens": null,
        "choices": null,
        "responseContract": "written-explanation",
        "answerContract": {
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
        "explanation": "모든 화석이 몸 전체이거나 모두 같은 방식으로 돌이 된 것은 아니에요. 이 단원에서는 특징이 분명한 동식물 표본을 중심으로 관찰해요.",
        "evidence": {
         "checkedBy": "창작 학습 문항 검수",
         "date": "2026-10-18",
         "gates": [
          "science",
          "answer"
         ],
         "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
         "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
        },
        "version": 1
       }
      ],
      "version": "20261105-geology-student-language"
     }
    ]
   },
   "fields": {
    "answerContract": {
     "type": "written-explanation",
     "sample": "몸의 일부나 잎·껍데기 같은 모양뿐 아니라 생물이 살아서 남긴 발자국 등 활동 흔적도 보존될 수 있다. 표본의 보이는 생물 특징과 출처·보존 맥락을 확인하고 오늘 무늬·유물·모형과 구별한다.",
     "rubric": {
      "required": [
       "몸의 일부와 활동 흔적도 화석의 증거가 될 수 있다는 설명",
       "화석에서 살펴볼 생물의 모양이나 특징"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  },
  {
   "previous": {
    "id": "c22-s51-u01-b088",
    "status": "authored",
    "sourceRef": {
     "type": "authored-supplement",
     "edition": "GFIELD 지층과 화석 창작 학습",
     "course": "초등5-1"
    },
    "taxonomy": {
     "curriculum": "2022 개정",
     "grade": 5,
     "semester": 1,
     "unit": "u01",
     "area": "지구와 우주",
     "element": "E6",
     "type": "T11",
     "format": "서술형",
     "level": "기본",
     "track": "교과",
     "standard": "6과01-03",
     "topic": "화석으로 과거 환경 추리하기",
     "concept": "화석으로 과거 환경 추리",
     "inquirySkill": "근거 설명·모형·수행 구별"
    },
    "prompt": "지층에서 바다 생물의 화석이 발견되었습니다. 그곳의 과거 환경을 추리하고, 그렇게 생각한 까닭과 아직 알 수 없는 점을 쓰세요.",
    "givens": null,
    "choices": null,
    "responseContract": "written-explanation",
    "answerContract": {
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
    "explanation": "화석의 특징을 살피고, 그 생물이 어디에 살았는지와 화석이 어느 지층에서 발견됐는지를 함께 읽어요. 바다에 살던 생물의 화석이라면 과거 바다와 관련된 환경이었다고 추리할 수 있어요.",
    "evidence": {
     "checkedBy": "창작 학습 문항 검수",
     "date": "2026-10-18",
     "gates": [
      "science",
      "answer"
     ],
     "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
     "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
    },
    "contentVersion": "20261106-geology-readable-workbook",
    "previousVersions": [
     {
      "id": "c22-s51-u01-b088",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E6",
       "type": "T11",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-03",
       "topic": "화석으로 과거 환경 추리",
       "concept": "화석으로 과거 환경 추리",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "지층에서 발견된 바다 생물의 화석으로 과거 환경을 설명하려 합니다. 사용할 근거와 과장하지 않을 결론을 쓰세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "현재 위치와 보존 맥락도 함께 확인해 추리의 범위를 밝혀요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "version": 1
     },
     {
      "id": "c22-s51-u01-b088",
      "status": "authored",
      "sourceRef": {
       "type": "authored-supplement",
       "edition": "GFIELD 지층과 화석 창작 학습",
       "course": "초등5-1"
      },
      "taxonomy": {
       "curriculum": "2022 개정",
       "grade": 5,
       "semester": 1,
       "unit": "u01",
       "area": "지구와 우주",
       "element": "E6",
       "type": "T11",
       "format": "서술형",
       "level": "기본",
       "track": "교과",
       "standard": "6과01-03",
       "topic": "화석으로 과거 환경 추리하기",
       "concept": "화석으로 과거 환경 추리",
       "inquirySkill": "근거 설명·모형·수행 구별"
      },
      "prompt": "지층에서 바다 생물의 화석이 발견되었습니다. 그곳의 과거 환경을 추리하고, 그렇게 생각한 까닭과 아직 알 수 없는 점을 쓰세요.",
      "givens": null,
      "choices": null,
      "responseContract": "written-explanation",
      "answerContract": {
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
      "explanation": "현재 위치와 보존 맥락도 함께 확인해 추리의 범위를 밝혀요.",
      "evidence": {
       "checkedBy": "창작 학습 문항 검수",
       "date": "2026-10-18",
       "gates": [
        "science",
        "answer"
       ],
       "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
       "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
      },
      "contentVersion": "20261105-geology-student-language",
      "previousVersions": [
       {
        "id": "c22-s51-u01-b088",
        "status": "authored",
        "sourceRef": {
         "type": "authored-supplement",
         "edition": "GFIELD 지층과 화석 창작 학습",
         "course": "초등5-1"
        },
        "taxonomy": {
         "curriculum": "2022 개정",
         "grade": 5,
         "semester": 1,
         "unit": "u01",
         "area": "지구와 우주",
         "element": "E6",
         "type": "T11",
         "format": "서술형",
         "level": "기본",
         "track": "교과",
         "standard": "6과01-03",
         "topic": "화석으로 과거 환경 추리",
         "concept": "화석으로 과거 환경 추리",
         "inquirySkill": "근거 설명·모형·수행 구별"
        },
        "prompt": "지층에서 발견된 바다 생물의 화석으로 과거 환경을 설명하려 합니다. 사용할 근거와 과장하지 않을 결론을 쓰세요.",
        "givens": null,
        "choices": null,
        "responseContract": "written-explanation",
        "answerContract": {
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
        "explanation": "현재 위치와 보존 맥락도 함께 확인해 추리의 범위를 밝혀요.",
        "evidence": {
         "checkedBy": "창작 학습 문항 검수",
         "date": "2026-10-18",
         "gates": [
          "science",
          "answer"
         ],
         "against": "교육부6과01-01~03·이론/실험 본문·NPS 화석 자료",
         "note": "가상자료·모식도는 실제 학생 결과가 아니며 실제 활동과 공식 성적을 확정하지 않는다."
        },
        "version": 1
       }
      ],
      "version": "20261105-geology-student-language"
     }
    ]
   },
   "fields": {
    "answerContract": {
     "type": "written-explanation",
     "sample": "화석의 보이는 특징·생물 생활 자료와 발견 지층·출처를 연결한다. 그 지층이 생길 무렵 바다와 관련된 환경이었을 가능성을 추리하되 지금도 바다라는 결론이나 정확한 기온·연도를 하나의 화석으로 확정하지 않는다.",
     "rubric": {
      "required": [
       "바다에서 살던 생물이라는 자료와 발견 지층을 연결",
       "과거 바다와 관련된 환경이었을 가능성",
       "이 자료만으로 알 수 없는 점 한 가지"
      ],
      "criteria": [
       "직접 작성한 학습용 기준이며 공식 배점표가 아니다."
      ],
      "pass": "관찰 근거와 설명을 교사가 확인한다."
     }
    }
   }
  }
 ],
 "directions": [
  {
   "previous": {
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
      "text": "재료를 섞지 않고 한 가지씩 넣는 모형이에요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 흐름이 약해지며 알갱이가 가라앉아 생긴 점이층리도 배워요. 따로 넣어 쌓는 모형과 과정이 달라요."
     },
     {
      "title": "내가 정리할 것",
      "text": "섞어 가라앉히기와 따로 쌓기의 차이를 쓰세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w006",
     "no": 6,
     "form": "choice",
     "topic": "지층이 쌓인 순서",
     "prompt": "학생이 같은 색의 점토를 맨 아래와 맨 위에 따로 쌓았습니다. 색만으로 판단할 수 없는 것은 무엇인가요?",
     "answer": "③ 두 층을 같은 때 쌓았는지 여부",
     "explanation": "같은 색 점토라도 먼저 쌓은 층과 나중에 쌓은 층에 따로 쓸 수 있어요. 색만 보고 두 층을 같은 때 쌓았는지는 알 수 없어요.",
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
     "topic": "지층 모형과 실제 지층 비교하기",
     "prompt": "지층 형성을 표현하는 모형에서 색 점토가 나타내는 것은 무엇인가요?",
     "answer": "⑤ 차례로 쌓인 퇴적물의 층",
     "explanation": "색 점토를 한 종류씩 쌓아 만든 층은 퇴적물이 차례로 쌓이는 모습을 나타내요. 점토의 색이 실제 지층의 재료나 시간을 모두 알려 주는 것은 아니에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "재료를 섞지 않고 한 가지씩 넣는 모형이에요.",
     "value": "같은 색의 층도 서로 다른 차례에 쌓을 수 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "섞어 가라앉히기와 따로 쌓기의 차이를 쓰세요.",
     "value": "같은 색의 층이라고 해서 같은 때 쌓았다고 할 수 없는 까닭을 쓰세요."
    }
   ]
  },
  {
   "previous": {
    "section": "연습 10",
    "title": "지층의 색과 두께",
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
      "text": "색과 두께는 눈으로 관찰할 수 있는 지층의 특징이에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교 광물 관찰에서는 겉색과 조흔색을 구별해요. 겉색 하나만으로 물질의 종류를 모두 정할 수는 없어요."
     },
     {
      "title": "내가 정리할 것",
      "text": "관찰한 색이 같은 층의 다른 특징도 찾으세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w010",
     "no": 10,
     "form": "short",
     "topic": "지층의 특징 관찰하기",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "색과 두께는 눈으로 관찰할 수 있는 지층의 특징이에요.",
     "value": "암석이 여러 겹의 층으로 쌓여 있는 것을 지층이라고 해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "관찰한 색이 같은 층의 다른 특징도 찾으세요.",
     "value": "암석이 층을 이루는 모습을 관찰할 때 살펴볼 특징을 두 가지 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "계획한 순서대로 층을 쌓고 실제 모습을 확인해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 퇴적암과 변성암을 생성 과정으로 구별해요. 점토를 눌러 모양을 바꾸는 일이 실제 변성암 생성과 같지는 않아요."
     },
     {
      "title": "내가 정리할 것",
      "text": "점토 모형과 실제 암석이 다른 점을 설명하세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w018",
     "no": 18,
     "form": "multi",
     "topic": "지층 모형 만들기",
     "prompt": "지층 모형을 만들고 설명하는 방법으로 알맞은 두 가지를 고르세요.",
     "answer": "②, ⑤",
     "explanation": "실제로 쌓은 차례를 적고 모형을 뒤집었는지 확인해요. 층의 경계가 뭉개졌다면 그 모습도 남긴 뒤 한 부분을 고쳐 다시 비교해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "층 모형의 실제 제작",
     "value": "층 모형의 순서와 관찰"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "계획한 순서대로 층을 쌓고 실제 모습을 확인해요.",
     "value": "같게 둔 재료·통과 다르게 한 쌓는 순서를 구별해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "점토 모형과 실제 암석이 다른 점을 설명하세요.",
     "value": "두 모형에서 같게 둔 것과 다르게 한 것을 하나씩 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "그림으로 계획한 것과 실제 만든 모형은 구별해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교의 지질 모형은 층의 배치뿐 아니라 사건의 순서에 관한 설명을 검토하는 데에도 쓰여요."
     },
     {
      "title": "내가 정리할 것",
      "text": "실제로 만든 뒤 확인한 모습을 적으세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w025",
     "no": 25,
     "form": "blank",
     "topic": "계획과 제작",
     "prompt": "층을 어떻게 놓을지 정한 그림은 ㉠[ ]이고, 재료를 실제로 놓아 만든 뒤 살핀 것은 제작과 ㉡[ ]이에요.",
     "answer": "㉠ 설계/계획 · ㉡ 관찰",
     "explanation": "만들 모습을 미리 정한 그림은 설계 또는 계획이에요. 재료를 쌓아 직접 만든 뒤 그 모습을 살펴보는 것은 관찰이에요.",
     "misconception": "계획 그림을 실제 제작·관찰 결과로 적지 않아요. 두 활동의 상태를 나누어요.",
     "criteria": "첫 빈칸은 설계 또는 계획, 둘째는 관찰을 인정해요.",
     "standard": "6과01-01"
    },
    {
     "id": "c22-s51-u01-w026",
     "no": 26,
     "form": "match",
     "topic": "지층 모형이 나타내는 것",
     "prompt": "층 모형의 요소와 뜻을 연결하세요.",
     "answer": "㉠-② · ㉡-③ · ㉢-①",
     "explanation": "점토나 종이의 층은 지층의 여러 층(②), 그 위에 차례로 놓는 일은 쌓이는 모습(③)을 나타내요. 짧은 시간과 모형 재료는 실제 지층과 다른 점(①)이에요.",
     "misconception": "층을 표현하는 재료·차례를 표현하는 행동·실제와 다른 제작 시간을 서로 구별해요.",
     "criteria": "재료의 층→층 표현, 쌓는 행동→순서 표현, 시간·재료 차이→한계를 연결해요.",
     "parts": [
      "㉠ 색이 다른 점토·종이의 층",
      "㉡ 먼저 쌓은 층 위에 다음 층을 놓기",
      "㉢ 짧은 제작 시간과 사람이 고른 재료"
     ],
     "answerPerPart": true,
     "standard": "6과01-01",
     "given": [
      "① 실제 지층과 다른 점  ② 지층의 여러 층을 나타냄  ③ 차례로 쌓인 모습을 나타냄"
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "실제로 만든 뒤 확인한 모습을 적으세요.",
     "value": "계획 그림과 실제로 만든 모형이 어떻게 다른지 한 가지 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "고치기 전후 모형에서 무엇을 바꿨는지 살펴요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교의 지질 구조 모형에서는 같은 층도 변형 전후 위치가 달라질 수 있어 지층의 연속성을 따라가요."
     },
     {
      "title": "내가 정리할 것",
      "text": "고친 부분이 층의 경계에 준 영향을 적으세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w027",
     "no": 27,
     "form": "order",
     "topic": "층 모형을 만들고 고치기",
     "prompt": "쌓는 순서를 정했습니다. 다음 계획을 실행하는 순서를 쓰세요.",
     "answer": "㉢→㉡→㉠→㉣",
     "explanation": "재료와 받침을 준비하고(㉢), 정한 차례대로 세 층을 놓아요(㉡). 계획한 모습과 실제 층을 비교한 뒤(㉠), 한 부분을 고쳐 다시 만들어요(㉣).",
     "misconception": "준비와 쌓기 뒤에 실제 모양을 비교해요. 수정한 결과를 처음 결과로 바꾸지 않아요.",
     "criteria": "재료 준비→차례로 쌓기→계획과 비교→한 부분 수정·재비교를 연결해요.",
     "given": [
      "㉠ 실제 경계와 위치를 계획과 비교하기",
      "㉡ 첫째·둘째·셋째 층을 차례로 놓기",
      "㉢ 구별되는 재료·안전한 받침 준비하기",
      "㉣ 바꿀 부분 하나를 정해 다시 만들고 비교하기"
     ],
     "standard": "6과01-01"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "고친 부분이 층의 경계에 준 영향을 적으세요.",
     "value": "다시 만든 모형을 계획과 비교할 때 확인할 특징을 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "이암은 매우 작은 알갱이, 사암은 주로 모래 알갱이로 이루어져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 암석을 생성 과정에 따라 화성암·퇴적암·변성암으로 나누고 각각의 특징을 비교해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "이암과 사암을 나눈 관찰 근거를 쓰세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w033",
     "no": 33,
     "form": "choice",
     "topic": "알갱이 크기로 퇴적암 분류하기",
     "prompt": "자갈 크기의 큰 알갱이가 작은 알갱이와 함께 굳어 있는 암석입니다. 이암·사암·역암 중 무엇인가요?",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "이암은 매우 작은 알갱이, 사암은 주로 모래 알갱이로 이루어져요.",
     "value": "자갈 크기의 알갱이가 작은 알갱이와 함께 굳어 있으면 역암으로 분류해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "이암과 사암을 나눈 관찰 근거를 쓰세요.",
     "value": "사진의 큰 알갱이와 그 주변을 살펴보고 역암으로 분류한 까닭을 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "역암에는 자갈 크기의 알갱이가 작은 알갱이와 함께 있어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 퇴적암 외에 현무암·화강암 등의 화성암도 비교해, 알갱이가 커 보이는 까닭을 생성 과정과 연결해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "역암의 큰 알갱이와 주변 부분을 그리세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w034",
     "no": 34,
     "form": "choice",
     "topic": "알갱이 크기로 퇴적암 분류하기",
     "prompt": "주로 모래 크기의 알갱이로 이루어진 암석입니다. 이암·사암·역암 중 무엇인가요?",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "역암에는 자갈 크기의 알갱이가 작은 알갱이와 함께 있어요.",
     "value": "주로 모래 크기의 알갱이로 이루어진 퇴적암은 사암이에요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "역암의 큰 알갱이와 주변 부분을 그리세요.",
     "value": "이 암석을 사암이라고 분류한 까닭을 알갱이의 크기와 이어 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "자갈·모래·진흙은 퇴적암을 이루는 재료가 될 수 있어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 풍화로 암석이 부서지거나 성질이 변하고, 그 산물이 토양 형성과도 연결됨을 배워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "암석에서 퇴적물이 되는 과정을 설명하세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w037",
     "no": 37,
     "form": "multi",
     "topic": "퇴적물과 퇴적암의 관계",
     "prompt": "퇴적물과 퇴적암을 설명한 내용 중 맞는 두 가지를 고르세요.",
     "answer": "①, ③",
     "explanation": "자갈·모래·진흙 같은 퇴적물은 쌓인 뒤 다져지고 굳어 퇴적암이 될 수 있어요. 이암·사암·역암은 암석을 이루는 알갱이의 크기로 비교해요.",
     "misconception": "쌓인 퇴적물과 다져지고 굳은 퇴적암을 구별하고, 실제 알갱이의 관찰을 근거로 골라요.",
     "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
     "choices": [
      "퇴적물이 쌓인 뒤 다져지고 굳을 수 있다.",
      "지층의 모든 층은 색과 재료가 완전히 같다.",
      "알갱이 크기를 보고 세 퇴적암을 비교한다.",
      "쌓인 모래는 그 순간 모두 단단한 사암이다.",
      "전체 돌 크기만 재면 암석을 이루는 알갱이도 알 수 있다."
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
     "topic": "알갱이 크기로 퇴적암 분류하기",
     "prompt": "이암·사암·역암을 분류한 설명 중 맞는 두 가지를 고르세요.",
     "answer": "②, ③",
     "explanation": "진흙처럼 매우 작은 알갱이로 이루어진 암석은 이암이에요. 자갈 크기의 큰 알갱이가 뚜렷한 암석은 역암이에요. 돌 전체의 무게나 색으로 나누지는 않아요.",
     "misconception": "세 암석에 같은 구성 알갱이 크기 기준을 적용해요. 표본마다 색·무게로 기준을 바꾸지 않아요.",
     "criteria": "자료의 조건과 과학적 근거를 연결한 같은 뜻의 표현을 인정해요.",
     "choices": [
      "알갱이가 작으면 실제로 알갱이가 없는 암석이다.",
      "진흙처럼 매우 작은 알갱이로 이루어져 있으면 이암으로 분류한다.",
      "자갈 크기의 알갱이가 뚜렷하게 보이면 역암으로 분류한다.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "암석에서 퇴적물이 되는 과정을 설명하세요.",
     "value": "퇴적물이 쌓인 뒤 퇴적암이 되기까지의 과정을 설명하세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "쌓인 모래와 단단히 굳은 사암을 구별해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교에서는 퇴적물 알갱이 사이의 공간과 그 공간을 채운 물질도 암석의 특징으로 살펴요."
     },
     {
      "title": "내가 정리할 것",
      "text": "모래와 사암의 같은 점과 다른 점을 적으세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w039",
     "no": 39,
     "form": "short",
     "topic": "퇴적물과 퇴적암의 관계",
     "prompt": "이암·사암·역암과 같이 퇴적물이 다져지고 굳어서 만들어진 암석을 무엇이라고 하나요?",
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
     "topic": "퇴적암의 알갱이 관찰하기",
     "prompt": "작은 알갱이를 더 크게 보려고 사용하는 간단한 확대 도구의 이름을 쓰세요.",
     "answer": "돋보기",
     "explanation": "돋보기는 작은 알갱이의 모습을 더 크게 볼 수 있게 해요. 돋보기로 본 알갱이의 크기와 모양을 적어 비교해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "퇴적물과 퇴적암의 관계",
     "value": "퇴적암의 이름과 관찰 도구"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "쌓인 모래와 단단히 굳은 사암을 구별해요.",
     "value": "퇴적물이 다져지고 굳으면 퇴적암이 돼요. 작은 알갱이는 돋보기로 더 살펴볼 수 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "모래와 사암의 같은 점과 다른 점을 적으세요.",
     "value": "작은 알갱이를 살펴보는 데 돋보기가 도움이 되는 까닭을 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "분류에는 모든 표본에 적용할 같은 기준이 필요해요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 한 암석을 겉색으로, 다른 암석을 생성 과정으로 나누면 서로 다른 분류 기준이 섞인다고 살펴요."
     },
     {
      "title": "내가 정리할 것",
      "text": "세 표본에 공통으로 적용할 기준을 적으세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w041",
     "no": 41,
     "form": "short",
     "topic": "알갱이 크기로 퇴적암 분류하기",
     "prompt": "모래 크기의 알갱이를 중심으로 이루어진 퇴적암의 이름을 쓰세요.",
     "answer": "사암",
     "explanation": "주로 모래 크기의 알갱이로 이루어진 퇴적암은 사암이에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "분류에는 모든 표본에 적용할 같은 기준이 필요해요.",
     "value": "사암은 주로 모래 크기의 알갱이로 이루어져 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "세 표본에 공통으로 적용할 기준을 적으세요.",
     "value": "돌 전체의 크기와 알갱이의 크기 중, 사암을 분류할 때 살펴본 것을 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "작은 알갱이가 잘 안 보인다고 없는 것은 아니에요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 광물의 결정 크기가 매우 작아 눈으로 구별하기 어려운 암석도 생성 과정과 함께 살펴요."
     },
     {
      "title": "내가 정리할 것",
      "text": "관찰하기 어려운 부분과 보완할 도구를 쓰세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w042",
     "no": 42,
     "form": "written",
     "topic": "알갱이 크기로 퇴적암 분류하기",
     "prompt": "이암·사암·역암을 모아 분류표를 만들려고 합니다. 같은 기준으로 세 암석을 구별하는 근거를 쓰세요.",
     "answer": "암석을 이루는 알갱이 크기를 기준으로 한다. 아주 작은 진흙 알갱이 중심은 이암, 모래 크기 중심은 사암, 자갈 크기가 뚜렷하면 역암으로 나누고 불분명한 표본은 더 관찰한다.",
     "explanation": "세 암석 모두 암석을 이루는 알갱이의 크기로 나누어요. 매우 작은 진흙 알갱이는 이암, 모래 크기는 사암, 큰 자갈 알갱이가 뚜렷하면 역암이에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "작은 알갱이가 잘 안 보인다고 없는 것은 아니에요.",
     "value": "이암·사암·역암을 나눌 때에는 모두 알갱이의 크기를 비교해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "관찰하기 어려운 부분과 보완할 도구를 쓰세요.",
     "value": "세 암석을 이루는 알갱이의 크기가 어떻게 다른지 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "암석은 재료가 쌓인 뒤 여러 과정을 거쳐 만들어져요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교 암석 순환에서는 깊이 묻힌 암석이 열과 압력을 받아 변성암으로 바뀌는 과정도 배워요."
     },
     {
      "title": "내가 정리할 것",
      "text": "퇴적암이 되는 과정과 다른 암석으로 바뀌는 과정을 나누세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w045",
     "no": 45,
     "form": "choice",
     "topic": "퇴적물과 퇴적암",
     "prompt": "통에 모래층을 만든 뒤 적절하게 설명한 것을 고르세요.",
     "answer": "⑤ 모래층을 만들었지만 사암을 만든 것은 아니다",
     "explanation": "통에는 모래를 쌓아 층을 만들었어요. 실제 사암이 되려면 모래가 오랫동안 다져지고 굳는 과정이 더 필요해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "암석은 재료가 쌓인 뒤 여러 과정을 거쳐 만들어져요.",
     "value": "모래층을 쌓는 모형과 실제 모래가 다져지고 굳어 사암이 되는 과정은 달라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "퇴적암이 되는 과정과 다른 암석으로 바뀌는 과정을 나누세요.",
     "value": "모래를 쌓은 모형에서 볼 수 있는 것과 아직 나타내지 못한 과정을 나누어 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "분류표에는 표본 이름과 같은 관찰 항목을 넣어요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교에서는 광물의 겉색과 흰 판에 긁은 가루색인 조흔색을 구별하여 기록해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "분류표의 열 제목을 같은 기준으로 고치세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w052",
     "no": 52,
     "form": "match",
     "topic": "알갱이 크기로 분류하기",
     "prompt": "관찰 기록의 예를 읽고 알맞은 퇴적암을 연결하세요.",
     "answer": "㉠-③ · ㉡-① · ㉢-②",
     "explanation": "매우 작은 진흙 알갱이는 이암(③), 자갈 크기의 큰 알갱이는 역암(①), 모래 크기의 알갱이는 사암(②)과 연결해요.",
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
     "topic": "더 관찰할 점과 방법",
     "prompt": "관찰의 어려움과 다음 방법을 연결하세요.",
     "answer": "㉠-② · ㉡-③ · ㉢-①",
     "explanation": "배율을 모르면 실제 크기를 알려 주는 표시와 사진 설명을 확인해요(②). 알갱이가 흐리면 다시 관찰하고(③), 분류한 까닭이 다르면 같은 표본과 도구로 알갱이 크기를 비교해요(①).",
     "misconception": "배율 미확인·흐린 알갱이·근거 불일치는 필요한 보완 방법이 서로 달라요.",
     "criteria": "배율→축척 자료, 흐린 알갱이→재관찰, 근거 차이→같은 기준 대조를 연결해요.",
     "parts": [
      "㉠ 사진의 배율을 모름",
      "㉡ 암석을 이루는 알갱이가 흐려 안 보임",
      "㉢ 두 모둠의 분류 근거가 다름"
     ],
     "answerPerPart": true,
     "standard": "6과01-02",
     "given": [
      "① 같은 표본과 관찰 도구를 사용해 알갱이 크기 비교  ② 사진의 축척과 촬영 방법 확인  ③ 돋보기나 더 선명한 사진으로 다시 관찰"
     ]
    }
   ],
   "fields": [
    {
     "path": [
      "title"
     ],
     "previous": "분류표의 같은 기준",
     "value": "분류 근거와 더 관찰할 방법"
    },
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "분류표에는 표본 이름과 같은 관찰 항목을 넣어요.",
     "value": "알갱이의 특징으로 분류하고, 불분명한 부분은 다시 관찰해요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "분류표의 열 제목을 같은 기준으로 고치세요.",
     "value": "알갱이가 잘 보이지 않는 표본을 더 살펴볼 방법을 정하고, 그 방법이 필요한 까닭을 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "퇴적물과 퇴적암은 재료와 만들어진 상태가 달라요."
     },
     {
      "title": "더 알아보기",
      "text": "중학교의 암석 순환 그림에서는 풍화·침식·퇴적·다져짐과 굳어짐을 각각의 변화로 연결해요."
     },
     {
      "title": "내가 정리할 것",
      "text": "그림에서 쌓임과 굳어짐을 따로 나타내세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w056",
     "no": 56,
     "form": "draw",
     "topic": "퇴적물과 퇴적암 비교하기",
     "prompt": "통에 모래를 쌓은 모형과 실제 사암이 만들어지는 과정을 비교하는 그림을 그리세요. 모형에서 한 일과 실제 사암이 되기까지 더 필요한 과정, 모형으로 나타내지 못한 점을 표시하세요.",
     "answer": "통의 모래 쌓임과 실제 모래가 오랜 시간 다져지고 굳어 사암이 되는 과정을 나누어 그린다. 통 모형은 긴 시간·굳어짐을 재현하지 않았다고 밝힌다.",
     "explanation": "한쪽에는 통에 모래가 쌓인 모습을 그려요. 다른 쪽에는 모래가 오랫동안 다져지고 굳어 사암이 되는 과정을 그려요. 통에 쌓는 모형은 굳는 과정까지 보여 주지는 못해요.",
     "misconception": "모래를 쌓은 통과 굳은 사암이 만들어지는 실제 과정을 하나의 완료된 실험으로 합치지 않아요.",
     "criteria": "쌓임 / 실제 다져짐·굳어짐 / 시간·재현 한계 / 구별된 설명",
     "drawing": "large",
     "standard": "6과01-02"
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "퇴적물과 퇴적암은 재료와 만들어진 상태가 달라요.",
     "value": "모래 알갱이가 쌓여 있는 상태와 단단히 굳은 사암을 구별해요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "겉모양이 남는 모형과 실제 화석 형성을 비교해요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교의 화석 자료 해석에서는 생물의 흔적이 보존된 방식이 달라 남는 정보도 달라짐을 살펴요."
     },
     {
      "title": "내가 정리할 것",
      "text": "내 모형이 잘 보여 주는 특징 하나를 쓰세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w059",
     "no": 59,
     "form": "choice",
     "topic": "화석 모형과 실제 화석 비교하기",
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
     "topic": "화석 모형과 실제 화석 비교하기",
     "prompt": "생물의 몸 일부가 퇴적물에 빨리 묻혔어요. 화석이 되는 과정을 바르게 설명한 것은?",
     "answer": "⑤ 반드시 화석이 되는 것은 아니다.",
     "explanation": "몸이 빨리 묻히면 흔적이 남는 데 도움이 될 수 있어요. 하지만 묻힌 뒤의 환경 등도 영향을 주므로 모든 생물이 반드시 화석이 되는 것은 아니에요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "내 모형이 잘 보여 주는 특징 하나를 쓰세요.",
     "value": "59번 점토 모형이 생물의 어떤 모습을 표현하는지 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "모든 생물이 화석으로 남는 것은 아니에요."
     },
     {
      "title": "더 알아보기",
      "text": "더 깊은 화석 연구에서는 단단한 부분의 유무와 매몰·분해 조건 때문에 화석 기록에 남기 쉬운 생물이 다름을 살펴요."
     },
     {
      "title": "내가 정리할 것",
      "text": "어떤 생물이 살았다는 사실과 그 생물의 화석이 남았다는 사실은 어떻게 다른가요?",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w065",
     "no": 65,
     "form": "multi",
     "topic": "화석 모형과 실제 화석 비교하기",
     "prompt": "화석 모형과 실제 화석을 비교한 설명 중 맞는 두 가지를 고르세요.",
     "answer": "④, ⑤",
     "explanation": "점토 모형은 생물의 겉모양이 남는 모습을 보여 줘요. 사람이 짧은 시간에 만든 모형이므로 실제 화석과 재료·시간·만들어지는 과정은 달라요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "모든 생물이 화석으로 남는 것은 아니에요.",
     "value": "모형은 겉모양이 남는 모습을 보여 주지만 재료와 시간은 실제와 달라요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "어떤 생물이 살았다는 사실과 그 생물의 화석이 남았다는 사실은 어떻게 다른가요?",
     "value": "점토 모형이 표현하는 모습 하나와 실제 화석과 다른 점 하나를 쓰세요."
    }
   ]
  },
  {
   "previous": {
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
      "text": "발자국은 생물이 한 활동을 보여 주는 증거가 될 수 있어요."
     },
     {
      "title": "더 알아보기",
      "text": "고등학교의 과거 환경 해석에서는 발자국이 남은 퇴적면과 주변 퇴적 구조를 함께 살펴요."
     },
     {
      "title": "내가 정리할 것",
      "text": "발자국에서 관찰한 것과 추리한 것을 나누세요.",
      "write": 5
     }
    ],
    "lead": "",
    "kind": "learn"
   },
   "questions": [
    {
     "id": "c22-s51-u01-w066",
     "no": 66,
     "form": "written",
     "topic": "화석에 남은 생물의 몸과 흔적",
     "prompt": "친구가 화석은 죽은 생물의 몸 전체가 돌이 된 것만 있다고 했습니다. 화석의 여러 증거와 관찰할 특징을 설명하세요.",
     "answer": "몸의 일부나 잎·껍데기의 모양, 발자국 같은 활동 흔적도 화석으로 남을 수 있다. 화석에서 실제로 보이는 생물의 특징을 살피고, 어디에서 발견된 것인지 알아본다. 오늘 남긴 무늬나 사람이 만든 모형과는 구별한다.",
     "explanation": "화석에는 몸 전체뿐 아니라 잎이나 껍데기 일부, 살아 있을 때 남긴 발자국도 있어요. 표본에서 어떤 몸의 특징이나 활동 흔적이 보이는지 찾아 설명해요.",
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
    }
   ],
   "fields": [
    {
     "path": [
      "rail",
      0,
      "text"
     ],
     "previous": "발자국은 생물이 한 활동을 보여 주는 증거가 될 수 있어요.",
     "value": "몸의 일부와 활동 흔적도 화석으로 남을 수 있어요."
    },
    {
     "path": [
      "rail",
      2,
      "text"
     ],
     "previous": "발자국에서 관찰한 것과 추리한 것을 나누세요.",
     "value": "몸의 일부가 남은 화석과 활동 흔적이 남은 화석의 예를 하나씩 쓰세요."
    }
   ]
  }
 ]
};
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b),clone=x=>JSON.parse(JSON.stringify(x)),cache=new WeakMap();
export function geologyResponseItems(rows,unit){
 if(unit!=='c22-s51-u01'||!Array.isArray(rows))return rows;let changed=false;
 const result=rows.map(q=>{const patch=review.bankPatches.find(p=>same(p.previous,q));if(!patch)return q;changed=true;if(cache.has(q))return cache.get(q);
 const current={...q,...clone(patch.fields),contentVersion:GEOLOGY_RESPONSE_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};cache.set(q,current);return current;});return changed?result:rows;
}
export function withGeologyResponseWorkbook(workbook){
 if(workbook?.unit!=='c22-s51-u01'||!Array.isArray(workbook.questions)||!Array.isArray(workbook.pages))return workbook;
 const source=new Map(workbook.questions.map(q=>[q.id,q]));let changed=false;
 const questions=workbook.questions.map(q=>{const patch=review.patches.find(p=>p.previous.id===q.id&&same(p.previous,q));if(!patch)return q;changed=true;return{...q,...clone(patch.fields)};});
 const revise=rows=>rows?.map(page=>{const patch=review.directions.find(p=>same(p.previous,page)&&p.questions.every(q=>same(source.get(q.id),q)));if(!patch)return page;changed=true;const next=clone(page);for(const f of patch.fields){let at=next;for(const k of f.path.slice(0,-1))at=at[k];at[f.path.at(-1)]=f.value;}return next;});
 const pages=revise(workbook.pages),teacher=revise(workbook.teacherStudentPages);return changed?{...workbook,questions,pages,...(teacher?{teacherStudentPages:teacher}:{})}:workbook;
}
