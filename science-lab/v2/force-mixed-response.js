// Closed factual checks and three single-sentence explanations retain force comparison and drawings.
export const FORCE_MIXED_VERSION='20261125-force-mixed-responses';
const unit='s31-u01',prior='8e6b09ac237c7d9e';
const review={
  "35": {
    "prompt": "형과 동생이 받침점에서 같은 거리에 앉았더니 형 쪽이 내려갔어요. 동생은 그대로 두고 형의 자리만 바꾸려고 해요. 수평을 잡으려면 형은 어느 쪽으로 옮겨야 할까요?",
    "form": "choice",
    "answer": "③",
    "required": [
      "형이 받침점에 더 가까이 옮겨 앉는 방법"
    ],
    "explanation": "같은 거리에 앉았을 때 형 쪽이 내려갔으므로 형이 더 무거워요. 형이 받침점에 더 가까이 옮겨 앉으며 수평을 맞출 수 있어요. 한 번 옮겼다고 꼭 수평이 되는 것은 아니므로 양쪽 높이를 보며 조절해요.",
    "misconception": "이번에는 동생의 자리는 그대로 두고 형의 자리만 바꾸어요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "choices": [
      "받침점에서 더 멀리 옮겨 앉는다.",
      "그대로 앉아 있는다.",
      "받침점에 더 가까이 옮겨 앉는다."
    ],
    "key": 2,
    "before": "bcd4301afea3aa64"
  },
  "36": {
    "prompt": "생활에서 저울을 쓰는 때와 무게를 재는 물체를 한 문장으로 써 보세요.",
    "form": "written",
    "answer": "빵을 만들 때 밀가루의 무게를 재요.",
    "required": [
      "저울을 쓰는 상황 한 가지",
      "그 상황에서 무게를 재는 물체"
    ],
    "explanation": "빵을 만들 때 밀가루의 무게를 재거나, 우체국에서 소포의 무게를 잴 수 있어요. 언제 쓰는지와 무엇을 재는지가 이어지면 돼요. 다른 알맞은 생활 사례도 인정해요.",
    "misconception": "저울이라는 도구 이름 대신, 저울을 쓰는 때와 무게를 재는 물체를 써요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "빵을 만들 때 밀가루의 무게를 재요.",
      "required": [
        "저울을 쓰는 상황 한 가지",
        "그 상황에서 무게를 재는 물체"
      ]
    },
    "before": "40683929163afea7"
  },
  "37": {
    "prompt": "빈 판자의 수평을 맞춘 뒤 사과와 귤의 무게를 비교해요. 빈칸을 채우세요.\n(1) 받침점에서 두 과일까지의 거리는 [ ] 해요.\n(2) 그때 [ ] 쪽 과일이 더 무거워요.",
    "form": "blank",
    "answer": "(1) 같게 (2) 내려간",
    "required": [
      "받침점 양쪽의 같은 거리에 과일을 놓기",
      "내려간 쪽 과일이 더 무거움"
    ],
    "explanation": "빈 판자가 수평인 상태에서 받침점 양쪽의 같은 거리에 사과와 귤을 하나씩 놓아요. 그때 내려간 쪽 과일이 더 무거워요. 먼저 놓을 거리를 정하고, 그다음 기울어진 모습을 읽어요.",
    "misconception": "받침점에서 두 과일까지의 거리가 다르면 기울어진 모습만으로 무게를 비교하지 않아요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "같게",
            "똑같게",
            "같도록",
            "동일하게"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "내려간",
            "기울어진",
            "아래로 내려간",
            "아래"
          ]
        }
      ]
    },
    "before": "ea0b780674edb528"
  },
  "38": {
    "prompt": "빈 판자의 수평을 맞추고 두 주머니를 받침점 양쪽의 같은 거리에 놓았어요. 판자가 왼쪽으로 기울어진 까닭을 주머니의 무게와 연결해 한 문장으로 써 보세요.",
    "form": "written",
    "answer": "같은 거리에 놓인 왼쪽 주머니가 더 무거워서예요.",
    "required": [
      "같은 거리에 놓인 왼쪽 주머니가 더 무겁다는 까닭(수치를 쓰지 않아도 인정)"
    ],
    "explanation": "자료에서 왼쪽 주머니는 60 g, 오른쪽은 30 g이에요. 두 주머니가 받침점에서 같은 거리에 있으므로 더 무거운 왼쪽이 내려가요. 까닭에는 왼쪽이 더 무겁다는 뜻이 담기면 돼요.",
    "misconception": "두 주머니를 같은 거리에 놓았는지 살핀 뒤 무게를 비교해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "같은 거리에 놓인 왼쪽 주머니가 더 무거워서예요.",
      "required": [
        "같은 거리에 놓인 왼쪽 주머니가 더 무겁다는 까닭(수치를 쓰지 않아도 인정)"
      ]
    },
    "before": "458cf748194369aa"
  },
  "39": {
    "prompt": "지레를 이용한 생활 도구 하나와 그 쓰임을 한 문장으로 써 보세요.",
    "form": "written",
    "answer": "병따개로 병뚜껑을 따요.",
    "required": [
      "지레를 이용한 도구 한 가지",
      "그 도구에 알맞은 쓰임"
    ],
    "explanation": "병따개는 병뚜껑을 딸 때, 장도리는 못을 뺄 때 쓸 수 있어요. 지레를 이용한 도구 이름과 그 쓰임이 알맞게 이어지면 돼요. 다른 타당한 도구와 쓰임도 인정해요.",
    "misconception": "도구 이름과 그 도구로 하는 일을 짝지어 생각해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "병따개로 병뚜껑을 따요.",
      "required": [
        "지레를 이용한 도구 한 가지",
        "그 도구에 알맞은 쓰임"
      ]
    },
    "before": "6ee763455b709d7f"
  },
  "40": {
    "prompt": "받침점에서 같은 거리에 앉자 할아버지 쪽이 내려갔어요. 할아버지는 그대로 있어요. 수평을 잡으려면 민수가 받침점에서 더 [ ] 옮겨 앉아요. 가까이·멀리 중 알맞은 말을 쓰세요.",
    "form": "blank",
    "answer": "멀리",
    "required": [
      "민수가 받침점에서 더 멀리 옮겨 앉는 방법"
    ],
    "explanation": "같은 거리에 앉았을 때 할아버지 쪽이 내려갔으므로 할아버지가 더 무거워요. 할아버지의 자리를 그대로 두면 가벼운 민수가 받침점에서 더 멀리 옮겨 앉으며 수평을 맞출 수 있어요. 양쪽 높이를 보며 조금씩 조절해요.",
    "misconception": "이번에는 할아버지는 그대로 있고 민수의 자리만 바꾸어요.",
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "멀리",
      "accepted": [
        "멀리",
        "멀게"
      ]
    },
    "accepted": [
      "멀리",
      "멀게"
    ],
    "before": "4af89a932b23eab5"
  },
  "63": {
    "prompt": "㉡과 ㉢은 모두 수평이에요. 물체의 무게가 같다고 알 수 있는 기록과 그 까닭을 바르게 짝지은 것을 고르세요.",
    "form": "choice",
    "answer": "②",
    "required": [
      "같은 거리에서 수평인 ㉢을 고름"
    ],
    "explanation": "㉡은 가를 4번, 나를 2번에 놓아 받침점에서의 거리가 달라요. ㉢은 가와 다를 양쪽 3번의 같은 거리에 놓았을 때 수평이에요. 따라서 무게가 같다고 알 수 있는 기록은 ㉢이에요.",
    "misconception": "수평이라는 결과뿐 아니라 받침점에서 물체까지의 거리도 함께 살펴요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "choices": [
      "㉡ — 서로 다른 거리에 놓아 수평이기 때문이다.",
      "㉢ — 같은 거리에 놓아 수평이기 때문이다.",
      "㉡과 ㉢ 모두 — 거리에 관계없이 수평이기 때문이다."
    ],
    "key": 1,
    "before": "e1ffac7d1b97f01b"
  },
  "64": {
    "prompt": "같은 상자를 직접 들어 올릴 때와 빗면으로 옮길 때를 비교해요. 빈칸을 채우세요.\n(1) 상자가 도착하는 높이는 [ ] 해요.\n(2) 두 방법에서 상자를 옮기는 데 드는 [ ]을 비교해요.",
    "form": "blank",
    "answer": "(1) 같게 (2) 힘",
    "required": [
      "같은 도착 높이를 정하기",
      "상자를 옮기는 데 드는 힘 비교"
    ],
    "explanation": "같은 상자를 같은 높이까지 옮기며 두 방법을 비교해요. 상자나 도착 높이가 다르면 방법 때문에 힘이 달라졌는지 알기 어려워요. 여기서는 직접 들 때와 빗면으로 옮길 때 드는 힘을 비교하면 돼요.",
    "misconception": "같은 상자와 같은 도착 높이에서 옮기는 방법을 바꾸어 비교해요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "같게",
            "똑같게",
            "같도록",
            "동일하게"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "힘",
            "드는 힘",
            "필요한 힘"
          ]
        }
      ]
    },
    "before": "36aecde64e860814"
  }
};
const bankReview={
  "s31-u01-v009": {
    "prompt": "형과 동생이 받침점에서 같은 거리에 앉았더니 형 쪽이 내려갔어요. 동생은 그대로 두고 형의 자리만 바꾸려고 해요. 수평을 잡으려면 형은 어느 쪽으로 옮겨야 할까요?",
    "form": "choice",
    "answer": "③",
    "required": [
      "형이 받침점에 더 가까이 옮겨 앉는 방법"
    ],
    "explanation": "같은 거리에 앉았을 때 형 쪽이 내려갔으므로 형이 더 무거워요. 형이 받침점에 더 가까이 옮겨 앉으며 수평을 맞출 수 있어요. 한 번 옮겼다고 꼭 수평이 되는 것은 아니므로 양쪽 높이를 보며 조절해요.",
    "misconception": "이번에는 동생의 자리는 그대로 두고 형의 자리만 바꾸어요.",
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "choices": [
      "받침점에서 더 멀리 옮겨 앉는다.",
      "그대로 앉아 있는다.",
      "받침점에 더 가까이 옮겨 앉는다."
    ],
    "key": 2,
    "before": [
      "31e920a217718d04",
      "758430e8702378e6"
    ]
  },
  "s31-u01-v012": {
    "prompt": "생활에서 저울을 쓰는 때와 무게를 재는 물체를 한 문장으로 써 보세요.",
    "form": "written",
    "answer": "빵을 만들 때 밀가루의 무게를 재요.",
    "required": [
      "저울을 쓰는 상황 한 가지",
      "그 상황에서 무게를 재는 물체"
    ],
    "explanation": "빵을 만들 때 밀가루의 무게를 재거나, 우체국에서 소포의 무게를 잴 수 있어요. 언제 쓰는지와 무엇을 재는지가 이어지면 돼요. 다른 알맞은 생활 사례도 인정해요.",
    "misconception": "저울이라는 도구 이름 대신, 저울을 쓰는 때와 무게를 재는 물체를 써요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "빵을 만들 때 밀가루의 무게를 재요.",
      "required": [
        "저울을 쓰는 상황 한 가지",
        "그 상황에서 무게를 재는 물체"
      ]
    },
    "before": [
      "87ed996b06eeb8d1"
    ]
  },
  "s31-u01-v028": {
    "prompt": "빈 판자의 수평을 맞춘 뒤 사과와 귤의 무게를 비교해요. 빈칸을 채우세요.\n(1) 받침점에서 두 과일까지의 거리는 [ ] 해요.\n(2) 그때 [ ] 쪽 과일이 더 무거워요.",
    "form": "blank",
    "answer": "(1) 같게 (2) 내려간",
    "required": [
      "받침점 양쪽의 같은 거리에 과일을 놓기",
      "내려간 쪽 과일이 더 무거움"
    ],
    "explanation": "빈 판자가 수평인 상태에서 받침점 양쪽의 같은 거리에 사과와 귤을 하나씩 놓아요. 그때 내려간 쪽 과일이 더 무거워요. 먼저 놓을 거리를 정하고, 그다음 기울어진 모습을 읽어요.",
    "misconception": "받침점에서 두 과일까지의 거리가 다르면 기울어진 모습만으로 무게를 비교하지 않아요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "같게",
            "똑같게",
            "같도록",
            "동일하게"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "내려간",
            "기울어진",
            "아래로 내려간",
            "아래"
          ]
        }
      ]
    },
    "before": [
      "9c7dadf53c64fbbb"
    ]
  },
  "s31-u01-v050": {
    "prompt": "빈 판자의 수평을 맞추고 두 주머니를 받침점 양쪽의 같은 거리에 놓았어요. 판자가 왼쪽으로 기울어진 까닭을 주머니의 무게와 연결해 한 문장으로 써 보세요.",
    "form": "written",
    "answer": "같은 거리에 놓인 왼쪽 주머니가 더 무거워서예요.",
    "required": [
      "같은 거리에 놓인 왼쪽 주머니가 더 무겁다는 까닭(수치를 쓰지 않아도 인정)"
    ],
    "explanation": "자료에서 왼쪽 주머니는 60 g, 오른쪽은 30 g이에요. 두 주머니가 받침점에서 같은 거리에 있으므로 더 무거운 왼쪽이 내려가요. 까닭에는 왼쪽이 더 무겁다는 뜻이 담기면 돼요.",
    "misconception": "두 주머니를 같은 거리에 놓았는지 살핀 뒤 무게를 비교해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "같은 거리에 놓인 왼쪽 주머니가 더 무거워서예요.",
      "required": [
        "같은 거리에 놓인 왼쪽 주머니가 더 무겁다는 까닭(수치를 쓰지 않아도 인정)"
      ]
    },
    "before": [
      "df53f3037532f595"
    ]
  },
  "s31-u01-v058": {
    "prompt": "지레를 이용한 생활 도구 하나와 그 쓰임을 한 문장으로 써 보세요.",
    "form": "written",
    "answer": "병따개로 병뚜껑을 따요.",
    "required": [
      "지레를 이용한 도구 한 가지",
      "그 도구에 알맞은 쓰임"
    ],
    "explanation": "병따개는 병뚜껑을 딸 때, 장도리는 못을 뺄 때 쓸 수 있어요. 지레를 이용한 도구 이름과 그 쓰임이 알맞게 이어지면 돼요. 다른 타당한 도구와 쓰임도 인정해요.",
    "misconception": "도구 이름과 그 도구로 하는 일을 짝지어 생각해요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "병따개로 병뚜껑을 따요.",
      "required": [
        "지레를 이용한 도구 한 가지",
        "그 도구에 알맞은 쓰임"
      ]
    },
    "before": [
      "84634039c3469d37"
    ]
  },
  "s31-u01-v067": {
    "prompt": "받침점에서 같은 거리에 앉자 할아버지 쪽이 내려갔어요. 할아버지는 그대로 있어요. 수평을 잡으려면 민수가 받침점에서 더 [ ] 옮겨 앉아요. 가까이·멀리 중 알맞은 말을 쓰세요.",
    "form": "blank",
    "answer": "멀리",
    "required": [
      "민수가 받침점에서 더 멀리 옮겨 앉는 방법"
    ],
    "explanation": "같은 거리에 앉았을 때 할아버지 쪽이 내려갔으므로 할아버지가 더 무거워요. 할아버지의 자리를 그대로 두면 가벼운 민수가 받침점에서 더 멀리 옮겨 앉으며 수평을 맞출 수 있어요. 양쪽 높이를 보며 조금씩 조절해요.",
    "misconception": "이번에는 할아버지는 그대로 있고 민수의 자리만 바꾸어요.",
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "멀리",
      "accepted": [
        "멀리",
        "멀게"
      ]
    },
    "accepted": [
      "멀리",
      "멀게"
    ],
    "before": [
      "2cf4b022da30c94c"
    ]
  },
  "s31-u01-v078": {
    "prompt": "상자가 잘 미끄러지는 빗면을 이용해 같은 상자를 같은 높이까지 올려요. 직접 들어 올릴 때보다 [ ] 힘으로 올릴 수 있어요. 큰·작은 중 알맞은 말을 쓰세요.",
    "form": "blank",
    "answer": "작은",
    "accepted": [
      "작은",
      "더 작은"
    ],
    "required": [
      "빗면을 이용해 더 작은 힘으로 같은 높이까지 올림"
    ],
    "explanation": "같은 상자를 같은 높이까지 올려 비교해요. 상자가 잘 미끄러지는 빗면에서는 더 먼 거리를 옮기는 대신 더 작은 힘으로 올릴 수 있어요. 실제 비교에서는 빗면의 표면도 살펴요.",
    "misconception": "옮기는 방법을 비교할 때 상자와 도착 높이를 같게 해요.",
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "작은",
      "accepted": [
        "작은",
        "더 작은"
      ]
    },
    "before": [
      "d6e9af1c85f619c6"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'짧게 설명하기',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
// seasonContract is the existing shared closed-response grading adapter.
function answerContract(e){const c=response(e);return{type:e.form==='written'?'written-explanation':e.form==='choice'?'single-choice':'short-text',...(e.form==='written'?{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 타당한 다른 방법도 교사가 확인해요.'}}:e.form==='choice'?{answer:e.key,accepted:[e.key]}:{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}),seasonContract:c};}
export function forceMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id];if(!e||q.status!=='authored'||!['similar'].includes(q.sourceRef?.type)||!e.before.includes(fingerprint(q)))return q;changed=true;if(banks.has(q))return banks.get(q);
 const result={...q,prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:FORCE_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null},forceMixedResponse:FORCE_MIXED_VERSION,contentVersion:FORCE_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withForceMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=forceMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withForceMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),forceMixedResponse:FORCE_MIXED_VERSION,contentVersion:FORCE_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};delete result.parts;delete result.answerPerPart;if(e.form==='written')result.lines=1;else delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 if(q.sourceRef?.type==='similar'){result.sourceContract=answerContract(e);result.sourceExplanation=e.explanation;}
 return result;});
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const e=review[Number(row[0])];return e&&!e.contract.teacherRequired?[row[0],labels[e.form]+(String(row[1]).includes(' · ')?String(row[1]).slice(String(row[1]).indexOf(' · ')):''),e.answer]:row;})})}));
 const result={...w,questions,quickPages};books.set(w,result);return result;
}
