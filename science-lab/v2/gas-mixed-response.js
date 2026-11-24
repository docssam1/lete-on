// Keep explanations of compression and observation; use brief factual checks.
export const GAS_MIXED_VERSION='20261124-gas-mixed-responses';
const unit='c22-s42-u03',prior='cf24d8fa166b40e8';
const review={
  "35": {
    "prompt": "공기가 새지 않는 주사기를 같은 온도에서 눌렀어요. 공기가 없어진 것이 아니라 어떻게 된 것인지 짧게 쓰세요.",
    "answer": "같은 공기가 더 작은 공간을 차지해요.",
    "explanation": "주사기 안에서 공기가 새지 않았다면 양은 같아요. 누르는 압력이 커지면서 같은 공기가 더 작은 공간을 차지해요.",
    "misconception": "제시된 조건과 실제로 관찰한 내용을 구별해요.",
    "form": "written",
    "required": [
      "같은 공기가 차지하는 공간이 줄었다는 설명"
    ],
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "같은 공기가 더 작은 공간을 차지해요.",
      "required": [
        "같은 공기가 차지하는 공간이 줄었다는 설명"
      ]
    },
    "before": "668b0d8ff944240d"
  },
  "36": {
    "prompt": "딱딱한 병은 크기가 거의 바뀌지 않아요. 온도에 따른 공기의 부피 변화를 보려면 어떤 것을 쓰는 것이 알맞을까요?",
    "answer": "②",
    "explanation": "딱딱한 병은 크기가 쉽게 바뀌지 않아요. 온도에 따른 공기의 부피 변화를 보려면 같은 양의 공기가 든 주머니처럼 크기가 변할 수 있는 것을 써요. 바깥 압력 등 다른 조건은 비슷하게 해요.",
    "misconception": "안의 공기가 따뜻해진 것과 딱딱한 병의 크기가 변하는 것을 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "두꺼운 유리병",
      "부풀 수 있는 얇은 주머니",
      "크기가 바뀌지 않는 금속 통"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "8c671703d8188b8d"
  },
  "37": {
    "prompt": "봉지가 부푼 사진만으로 온도 때문이라고 정하기 어려워요. 더 알아볼 정보를 고르세요.",
    "answer": "①",
    "explanation": "봉지가 부풀기 전과 후의 온도를 비교해요. 공기가 더 들어갔는지, 바깥 압력이 달라졌는지도 함께 살펴야 온도 때문이라고 설명할 수 있어요.",
    "misconception": "사진에 보이는 모습과 그 모습이 생긴 까닭을 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "부풀기 전과 후의 온도",
      "사진을 인쇄한 종이의 크기",
      "사진 파일을 저장한 날짜"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "485bd5800b387206"
  },
  "38": {
    "prompt": "30 ℃에서 모형의 부피는 62 mL, 다른 주머니는 60 mL라고 정한 자료예요. 숫자는 그대로 두고, 두 주머니에 든 공기의 (1)[ ]이 같은지 확인해요. 보기: 양·색",
    "answer": "양",
    "explanation": "온도가 같아도 안에 든 공기의 양이 다르면 부피가 다를 수 있어요. 바깥 압력과 주머니의 상태, 기다린 시간도 함께 살펴요. 두 값을 억지로 같게 고치지 않아요.",
    "misconception": "부피가 다르다고 측정값을 고치기 전에 비교한 조건을 살펴요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "양",
            "공기의 양",
            "공기 양"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "fdf3432faf4ea409"
  },
  "47": {
    "prompt": "같은 용기에 공기를 더 넣었고 새지 않는지도 확인했어요. 저울 표시가 같게 보일 때, 작은 무게 차이를 알아보는 방법을 고르세요.",
    "answer": "③",
    "explanation": "작은 무게 차이가 저울에 나타나는지 확인해요. 공기가 더 들어갔는지, 새지 않았는지도 살펴요. 실제로 읽은 숫자는 그대로 남겨요.",
    "misconception": "같게 보인 표시만으로 공기에 무게가 없다고 정하지 않아요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "더 큰 용기로 바꾸어 한 번만 잰다.",
      "마개를 떼고 다시 잰다.",
      "더 작은 무게 차이를 읽을 수 있는 저울로 잰다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "c80d4817b95e84d5"
  },
  "55": {
    "prompt": "A는 끝이 막혀 있고 B는 열려 있어요. B에서 공간이 줄었다는 것만으로 같은 양의 공기가 압축되었다고 하기 어려운 까닭을 짧게 쓰세요.",
    "answer": "B에서는 공기가 밖으로 나갈 수 있어요.",
    "explanation": "A는 새지 않는 같은 공기가 더 작은 공간을 차지해요. B는 공기가 밖으로 나갈 수 있어 같은 양이라는 조건이 유지되지 않을 수 있어요.",
    "misconception": "제시된 조건과 실제로 관찰한 내용을 구별해요.",
    "form": "written",
    "required": [
      "B의 열린 끝으로 공기가 드나들 수 있다는 설명"
    ],
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "B에서는 공기가 밖으로 나갈 수 있어요.",
      "required": [
        "B의 열린 끝으로 공기가 드나들 수 있다는 설명"
      ]
    },
    "before": "d8721353cdf13e3d"
  },
  "63": {
    "prompt": "따뜻하게 했는데 주머니가 눈에 띄게 커지지 않았어요. 더 확인할 점을 한 가지만 쓰세요.",
    "answer": "안의 공기가 따뜻해질 만큼 기다렸는지 확인해요.",
    "explanation": "잘 보이지 않은 결과는 그대로 남겨요. 공기가 충분히 따뜻해졌는지, 새지는 않았는지와 주머니가 더 부풀 수 있는지도 살펴요.",
    "misconception": "제시된 조건과 실제로 관찰한 내용을 구별해요.",
    "form": "written",
    "required": [
      "충분히 기다렸는지·공기 누출·부풀 여유·비슷한 바깥 압력 중 하나"
    ],
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "안의 공기가 따뜻해질 만큼 기다렸는지 확인해요.",
      "required": [
        "충분히 기다렸는지·공기 누출·부풀 여유·비슷한 바깥 압력 중 하나"
      ]
    },
    "before": "79c6a8f7b8bd2775"
  },
  "71": {
    "prompt": "질소는 다른 물질과 쉽게 (1)[ ]하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 보기: 반응·혼합",
    "answer": "반응",
    "explanation": "질소는 다른 물질과 쉽게 반응하지 않는 성질이 있어요. 기체의 색이 없는 점만으로 쓰임을 정하지 않아요.",
    "misconception": "질소의 성질과 식품 포장의 쓰임을 연결해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "반응"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "320785d77320e709"
  },
  "79": {
    "prompt": "더 무거운 종이를 쓴 다에서는 5회 중 몇 회 성공했나요?",
    "answer": "2회",
    "explanation": "다의 기록은 5회 중 2회 성공이에요. 가벼운 종이를 쓴 나에서 5회 성공했다고 더 무거운 종이를 쓴 다도 모두 성공한 것은 아니에요.",
    "misconception": "조건이 다른 시험의 성공 횟수를 따로 읽어요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "2",
        "2회",
        "두 번",
        "두번",
        "2번",
        "다섯 번 중 두 번",
        "5회 중 2회"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": "4ea5ad5b152c597d"
  }
};
const bankReview={
  "c22-s42-u03-b06": {
    "prompt": "공기의 무게를 알아보려고 같은 용기에 공기를 더 넣기 전과 후를 비교해요. 저울로 재어 비교할 것은 무엇인가요?",
    "answer": "무게",
    "explanation": "같은 용기에 공기를 더 넣기 전과 후의 무게를 저울로 재어 비교해요. 공기가 차지하는 공간의 크기와 무게는 다른 것이에요.",
    "misconception": "공기의 부피와 무게를 구별해요.",
    "form": "short",
    "required": [
      "알맞은 낱말"
    ],
    "contract": {
      "kind": "short-text",
      "accepted": [
        "무게",
        "용기의 무게",
        "용기 무게",
        "공기를 넣기 전후의 무게",
        "공기를 넣기 전과 후의 무게"
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "728aba9c131c9dea"
    ]
  },
  "c22-s42-u03-b12": {
    "prompt": "같은 용기에 공기를 더 넣었고 새지 않는지도 확인했어요. 저울 표시가 같게 보일 때, 작은 무게 차이를 알아보는 방법을 고르세요.",
    "answer": "③",
    "explanation": "저울이 작은 무게 차이를 나타낼 수 있는지 살펴요. 공기가 더 들어갔는지와 새지 않았는지도 함께 확인해요. 읽은 값은 그대로 남겨요.",
    "misconception": "같게 보인 표시만으로 공기에 무게가 없다고 정하지 않아요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "더 큰 용기로 바꾸어 한 번만 잰다.",
      "마개를 떼고 다시 잰다.",
      "더 작은 무게 차이를 읽을 수 있는 저울로 잰다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a57464468f7d4bc0"
    ]
  },
  "c22-s42-u03-b18": {
    "prompt": "공기를 더 넣은 뒤 마개를 더 큰 것으로 바꾸고 물방울도 넣었어요. 공기 외에 (1)[ ]와 물방울도 무게 비교에 영향을 줘요. 보기: 마개·병의 색",
    "answer": "마개",
    "explanation": "마개를 바꾸거나 물방울을 넣으면 공기 외의 무게도 달라질 수 있어요. 공기를 더 넣기 전후를 비교할 때에는 같은 용기와 부품을 써요.",
    "misconception": "공기 외에 달라진 것을 찾아요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "마개"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "87272fb9fc8fa07f"
    ]
  },
  "c22-s42-u03-b42": {
    "prompt": "봉지가 부푼 사진만으로 온도 때문이라고 정하기 어려워요. 더 알아볼 정보를 고르세요.",
    "answer": "①",
    "explanation": "부풀기 전과 후의 온도를 알아봐요. 공기의 출입과 바깥 압력도 살펴야 온도 때문이라고 설명할 수 있어요.",
    "misconception": "사진에 보이는 모습과 그 원인을 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "부풀기 전과 후의 온도",
      "사진을 인쇄한 종이의 크기",
      "사진 파일을 저장한 날짜"
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "0c3c7a1228216f80"
    ]
  },
  "c22-s42-u03-b48": {
    "prompt": "직접 실험하지 않고 주사기 자료를 읽었어요. 실제로 한 일에 알맞은 노트 제목을 고르세요.",
    "answer": "②",
    "explanation": "주사기 자료를 읽었으므로 자료 살펴보기라고 적어요. 직접 실험한 결과와 자료를 읽은 내용을 구별해요.",
    "misconception": "자료를 읽은 일과 직접 실험한 일을 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "내가 직접 한 주사기 실험",
      "주사기 자료 살펴보기",
      "내가 만든 주사기 장치"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "64c378f4676e232a"
    ]
  },
  "c22-s42-u03-b60": {
    "prompt": "이산화 탄소를 이용한 예를 고르세요.",
    "answer": "①",
    "explanation": "탄산음료에는 이산화 탄소를 넣어요. 산소는 호흡에 필요하고 다른 물질이 타는 것을 도와요.",
    "misconception": "이산화 탄소와 산소의 쓰임을 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "탄산음료에 기체를 넣는다.",
      "환자의 호흡을 돕는 기체로 쓴다.",
      "다른 물질이 더 잘 타도록 돕는다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "1a65e3037d920391"
    ]
  },
  "c22-s42-u03-b66": {
    "prompt": "질소는 다른 물질과 쉽게 (1)[ ]하지 않는 성질을 이용해 일부 식품 포장에 쓰여요. 보기: 반응·혼합",
    "answer": "반응",
    "explanation": "질소는 다른 물질과 쉽게 반응하지 않는 성질이 있어요. 그 성질을 일부 식품 포장에 이용해요.",
    "misconception": "기체의 성질과 쓰임을 연결해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "반응"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "71a65c6b18016bad"
    ]
  },
  "c22-s42-u03-b78": {
    "prompt": "관으로 연결한 두 주사기에서 한쪽을 누르면 안의 공기가 다른 쪽 피스톤을 (1)[ ]. 보기: 민다·잡아당긴다",
    "answer": "민다",
    "explanation": "한쪽을 눌렀을 때 연결된 공기가 다른 쪽 피스톤을 밀어요. 피스톤의 움직임은 실제 장치에서 관찰해 확인해요.",
    "misconception": "공기가 피스톤을 미는 작용과 당기는 작용을 구별해요.",
    "form": "blank",
    "required": [
      "빈칸의 낱말"
    ],
    "contract": {
      "kind": "ordered-term-parts",
      "parts": [
        {
          "label": "㉠",
          "accepted": [
            "민다"
          ]
        }
      ],
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "b9d35f3dfe582583"
    ]
  },
  "c22-s42-u03-b83": {
    "prompt": "두 장치에서 관을 고정하는 방법만 바꾸어 시험해요. 나머지 조건으로 알맞은 것을 고르세요.",
    "answer": "③",
    "explanation": "관을 고정하는 방법만 비교하려면 같은 종이판과 주머니, 같은 처음 상태와 펌프 방법으로 시험해요.",
    "misconception": "바꿀 조건 하나와 같게 둘 조건을 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "종이판의 무게도 함께 바꾼다.",
      "주머니의 크기도 함께 바꾼다.",
      "같은 종이판과 주머니를 쓴다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "answer": 2,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "3b607487e9e96475"
    ]
  },
  "c22-s42-u03-b84": {
    "prompt": "공기 장치의 목표는 종이판을 들어 올리는 것이에요. 작동했는지 살펴볼 것을 고르세요.",
    "answer": "②",
    "explanation": "실제로 종이판이 올라가는지와 얼마나 올라가는지 살펴요. 장치의 이름이나 꾸밈만으로 작동했다고 정하지 않아요.",
    "misconception": "장치의 겉모습과 실제 작동 결과를 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "종이판에 적은 장치의 이름",
      "종이판이 실제로 올라간 높이",
      "종이판을 꾸민 색의 수"
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "answer": 1,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "a0beafd16304a0d3"
    ]
  },
  "c22-s42-u03-b90": {
    "prompt": "어떤 학생은 완성 장치 사진을 보았지만 자기 장치의 관은 아직 연결하지 못했어요. 그 학생의 장치 상태를 고르세요.",
    "answer": "①",
    "explanation": "관을 아직 연결하지 못한 상태예요. 사진에서 본 완성 장치와 학생이 실제로 만든 상태는 다르게 기록해요.",
    "misconception": "설명 사진과 실제 제작 상태를 구별해요.",
    "form": "choice",
    "required": [
      "알맞은 설명 고르기"
    ],
    "choices": [
      "관을 연결하기 전이다.",
      "관을 연결하고 시험까지 마쳤다.",
      "사진 속 장치와 똑같이 완성했다."
    ],
    "key": 0,
    "contract": {
      "kind": "single-choice",
      "answer": 0,
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true
    },
    "before": [
      "c93bd1294b6e94ef"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'까닭 설명',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
function answerContract(e){const c=response(e);return{type:e.form==='choice'?'single-choice':e.contract?'short-text':'written-explanation',...(e.form==='choice'?{answer:e.key,accepted:[e.key]}:e.contract?{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}:{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 알맞은 이름표는 교사가 확인해요.'}}),seasonContract:c};}
export function gasMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),...(q.diagnosticOverride?{diagnosticOverride:{...q.diagnosticOverride,version:GAS_MIXED_VERSION}}:{}),...(e.form?{bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:GAS_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null}}:{}),gasMixedResponse:GAS_MIXED_VERSION,contentVersion:GAS_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withGasMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=gasMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withGasMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),gasMixedResponse:GAS_MIXED_VERSION,contentVersion:GAS_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};if(e.form==='written')result.lines=1;else delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 return result;});
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const e=review[Number(row[0])];return e&&!e.contract.teacherRequired?[row[0],labels[e.form]+row[1].slice(row[1].indexOf(' · ')),e.answer]:row;})})}));
 const amendPage=p=>{
  const nos=p.blocks.flatMap(b=>b.ids||[]);
  const section=nos.includes(unit+'-w036')?'알맞은 방법 고르기':nos.includes(unit+'-w079')?'생각 넓히기 ⑤ · 기록 읽기':p.section;
  const lead=p.lead==='답을 고른 뒤, 아래 줄에 선택한 근거와 헷갈린 보기를 적어 보세요.'?'사진과 표에서 필요한 내용을 찾아 문제를 풀어 보세요.':p.lead;
  return section===p.section&&lead===p.lead?p:{...p,section,...(lead===undefined?{}:{lead})};
 };
 const result={...w,questions,quickPages,pages:w.pages.map(amendPage),teacherStudentPages:w.teacherStudentPages.map(amendPage)};books.set(w,result);return result;
}
