// Materials use closed factual responses and three short explanations; the rubber sample label retains prior editions.
export const MATERIAL_MIXED_VERSION='20261125-material-mixed-responses';
const unit='c22-s32-u01',prior='32dd8850295d81ce';
const review={
  "33": {
    "prompt": "가위의 날은 철, 손잡이는 플라스틱으로 만들었어요. 바르게 설명한 것을 고르세요.",
    "form": "choice",
    "answer": "③",
    "explanation": "한 개의 가위에도 철과 플라스틱이 함께 쓰였어요. 물체가 한 개라고 한 가지 물질로만 만드는 것은 아니에요.",
    "required": [
      "한 물체에 여러 물질이 쓰였음을 찾기"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "choices": [
      "가위 전체를 철로 만들었다.",
      "가위 전체를 플라스틱으로 만들었다.",
      "한 개의 가위에 두 가지 물질을 썼다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": "4fb7d9bd39c2aa6f"
  },
  "34": {
    "prompt": "살펴본 플라스틱 판은 불투명했어요. 「모든 플라스틱은 불투명하다」를 이 판에 맞는 한 문장으로 고쳐 쓰세요.",
    "form": "written",
    "answer": "이번에 살펴본 플라스틱 판은 불투명해요.",
    "explanation": "살펴본 것은 한 플라스틱 판이에요. 다른 플라스틱 물건까지 모두 불투명하다고 정하지 않아요.",
    "required": [
      "살펴본 플라스틱 판의 성질로 고친 문장"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "이번에 살펴본 플라스틱 판은 불투명해요.",
      "required": [
        "살펴본 플라스틱 판의 성질로 고친 문장"
      ]
    },
    "before": "3ee2d2d5b42a25c3"
  },
  "35": {
    "prompt": "나무 컵을 유리 모둠에 잘못 넣었어요. 만든 물질에 따라 나누려면 [ ] 모둠으로 옮겨요.",
    "form": "blank",
    "answer": "나무",
    "explanation": "컵의 재료가 나무이므로 나무 모둠에 놓아요. 쓰임이 같은 컵이어도 재료는 다를 수 있어요.",
    "required": [
      "만든 물질인 나무로 분류"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "accepted": [
      "나무",
      "나무 모둠"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "나무",
      "accepted": [
        "나무",
        "나무 모둠"
      ]
    },
    "before": "991d4a0ecfb6f714"
  },
  "36": {
    "prompt": "두 판의 재료가 다를 때 휘는 정도를 비교해요. 재료의 차이만 알아보려면 두 판의 두께는 [ ] 맞추어요.",
    "form": "blank",
    "answer": "같게",
    "explanation": "두께가 다르면 그 영향도 함께 나타날 수 있어요. 두께를 같게 맞추어요. 길이와 힘주는 방법 등 다른 조건도 같게 해요.",
    "required": [
      "비교할 두께를 같게 맞춤"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "accepted": [
      "같게",
      "똑같게",
      "동일하게",
      "비슷하게"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "같게",
      "accepted": [
        "같게",
        "똑같게",
        "동일하게",
        "비슷하게"
      ]
    },
    "before": "5b2b64f89e9c9b12"
  },
  "37": {
    "prompt": "표에서 관찰 통의 창으로 ‘다’를 고른 까닭을 두 성질로 짧게 써 보세요.",
    "form": "written",
    "answer": "안이 비쳐 보이고 쉽게 깨지지 않아서예요.",
    "explanation": "‘다’는 투명하고 쉽게 깨지지 않는다고 표에 나와요. 안을 볼 수 있는 창의 쓰임과 연결해 짧게 답해요.",
    "required": [
      "투명해서 안이 보인다는 답 / 쉽게 깨지지 않는다는 답"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "안이 비쳐 보이고 쉽게 깨지지 않아서예요.",
      "required": [
        "투명해서 안이 보인다는 답 / 쉽게 깨지지 않는다는 답"
      ]
    },
    "before": "baafe3ecbbf1a512"
  },
  "38": {
    "prompt": "관찰 통의 창과 손잡이에 필요한 성질이에요. 빈칸을 채우세요.\n(1) 안을 볼 창은 [ ] 해야 해요.\n(2) 통을 지탱할 손잡이는 [ ] 해야 해요.",
    "form": "blank",
    "answer": "(1) 투명 (2) 튼튼",
    "explanation": "창은 안쪽을 보는 곳이에요. 손잡이는 손으로 잡고 통을 드는 곳이에요. 두 부분의 쓰임에 맞는 성질을 하나씩 짧게 써요.",
    "required": [
      "창이 투명해서 안이 보임",
      "손잡이가 통을 지탱할 만큼 튼튼함"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "투명",
            "투명해",
            "투명하기",
            "안이 비쳐 보여야",
            "안이 보여야"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "튼튼",
            "튼튼해",
            "단단",
            "단단해"
          ]
        }
      ]
    },
    "before": "451880c37acbf239"
  },
  "39": {
    "prompt": "통의 이음새에서 물이 새서 이음새를 고치려고 해요. 고친 뒤 물이 새는지 어떻게 확인할까요? 물의 양이나 살펴보는 시간을 생각해 한 문장으로 쓰세요.",
    "form": "written",
    "answer": "같은 양의 물을 넣어 같은 시간 동안 새는지 살펴요.",
    "explanation": "물이 샌 이음새를 고친 뒤에도 다시 물을 넣어 살펴봐야 해요. 물의 양과 살펴보는 시간을 같게 하면 고치기 전후를 비교하기 좋아요.",
    "required": [
      "물을 넣어 새는지 다시 살펴보는 방법",
      "물의 양이나 관찰 시간 등 비교 조건을 같게 함"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "같은 양의 물을 넣어 같은 시간 동안 새는지 살펴요.",
      "required": [
        "물을 넣어 새는지 다시 살펴보는 방법",
        "물의 양이나 관찰 시간 등 비교 조건을 같게 함"
      ]
    },
    "before": "ac8cfb106c168cb6"
  },
  "40": {
    "prompt": "친구가 “창이 불투명해서 안이 안 보여.”라고 말했어요. 안이 보이게 하려면 창을 [ ] 재료로 바꾸어요. 투명한·불투명한 중 알맞은 말을 쓰세요.",
    "form": "blank",
    "answer": "투명한",
    "explanation": "친구가 말한 불편은 안이 보이지 않는다는 점이에요. 안이 비쳐 보이는 재료를 골라 창을 고쳐요. 실제로 만들 때에는 고친 뒤 친구가 잘 볼 수 있는지도 함께 살펴요.",
    "required": [
      "안을 볼 수 있는 투명한 창 재료"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "accepted": [
      "투명한",
      "투명",
      "안이 비쳐 보이는",
      "안이 보이는"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "투명한",
      "accepted": [
        "투명한",
        "투명",
        "안이 비쳐 보이는",
        "안이 보이는"
      ]
    },
    "before": "ae7b80ed3c3de437"
  }
};
const bankReview={
  "c22-s32-u01-b08": {
    "prompt": "가위의 날은 철, 손잡이는 플라스틱으로 만들었어요. 바르게 설명한 것을 고르세요.",
    "form": "choice",
    "answer": "③",
    "explanation": "한 개의 가위에도 철과 플라스틱이 함께 쓰였어요. 물체가 한 개라고 한 가지 물질로만 만드는 것은 아니에요.",
    "required": [
      "한 물체에 여러 물질이 쓰였음을 찾기"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "choices": [
      "가위 전체를 철로 만들었다.",
      "가위 전체를 플라스틱으로 만들었다.",
      "한 개의 가위에 두 가지 물질을 썼다."
    ],
    "key": 2,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 2
    },
    "before": [
      "78d4b913363d1505"
    ]
  },
  "c22-s32-u01-b16": {
    "prompt": "살펴본 플라스틱 판은 불투명했어요. 「모든 플라스틱은 불투명하다」를 이 판에 맞는 한 문장으로 고쳐 쓰세요.",
    "form": "written",
    "answer": "이번에 살펴본 플라스틱 판은 불투명해요.",
    "explanation": "살펴본 것은 한 플라스틱 판이에요. 다른 플라스틱 물건까지 모두 불투명하다고 정하지 않아요.",
    "required": [
      "살펴본 플라스틱 판의 성질로 고친 문장"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "이번에 살펴본 플라스틱 판은 불투명해요.",
      "required": [
        "살펴본 플라스틱 판의 성질로 고친 문장"
      ]
    },
    "before": [
      "436bc9384a76139e"
    ]
  },
  "c22-s32-u01-b24": {
    "prompt": "나무 컵을 유리 모둠에 잘못 넣었어요. 만든 물질에 따라 나누려면 [ ] 모둠으로 옮겨요.",
    "form": "blank",
    "answer": "나무",
    "explanation": "컵의 재료가 나무이므로 나무 모둠에 놓아요. 쓰임이 같은 컵이어도 재료는 다를 수 있어요.",
    "required": [
      "만든 물질인 나무로 분류"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "accepted": [
      "나무",
      "나무 모둠"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "나무",
      "accepted": [
        "나무",
        "나무 모둠"
      ]
    },
    "before": [
      "07673b2686cfab88"
    ]
  },
  "c22-s32-u01-b32": {
    "prompt": "두 판의 재료가 다를 때 휘는 정도를 비교해요. 재료의 차이만 알아보려면 두 판의 두께는 [ ] 맞추어요.",
    "form": "blank",
    "answer": "같게",
    "explanation": "두께가 다르면 그 영향도 함께 나타날 수 있어요. 두께를 같게 맞추어요. 길이와 힘주는 방법 등 다른 조건도 같게 해요.",
    "required": [
      "비교할 두께를 같게 맞춤"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "accepted": [
      "같게",
      "똑같게",
      "동일하게",
      "비슷하게"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "같게",
      "accepted": [
        "같게",
        "똑같게",
        "동일하게",
        "비슷하게"
      ]
    },
    "before": [
      "f15cb3b1de95c047"
    ]
  },
  "c22-s32-u01-b40": {
    "prompt": "표에서 관찰 통의 창으로 ‘다’를 고른 까닭을 두 성질로 짧게 써 보세요.",
    "form": "written",
    "answer": "안이 비쳐 보이고 쉽게 깨지지 않아서예요.",
    "explanation": "‘다’는 투명하고 쉽게 깨지지 않는다고 표에 나와요. 안을 볼 수 있는 창의 쓰임과 연결해 짧게 답해요.",
    "required": [
      "투명해서 안이 보인다는 답 / 쉽게 깨지지 않는다는 답"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "안이 비쳐 보이고 쉽게 깨지지 않아서예요.",
      "required": [
        "투명해서 안이 보인다는 답 / 쉽게 깨지지 않는다는 답"
      ]
    },
    "before": [
      "616c4788762ba83e"
    ]
  },
  "c22-s32-u01-b48": {
    "prompt": "관찰 통의 창과 손잡이에 필요한 성질이에요. 빈칸을 채우세요.\n(1) 안을 볼 창은 [ ] 해야 해요.\n(2) 통을 지탱할 손잡이는 [ ] 해야 해요.",
    "form": "blank",
    "answer": "(1) 투명 (2) 튼튼",
    "explanation": "창은 안쪽을 보는 곳이에요. 손잡이는 손으로 잡고 통을 드는 곳이에요. 두 부분의 쓰임에 맞는 성질을 하나씩 짧게 써요.",
    "required": [
      "창이 투명해서 안이 보임",
      "손잡이가 통을 지탱할 만큼 튼튼함"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "ordered-term-parts",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "parts": [
        {
          "kind": "short-text",
          "accepted": [
            "투명",
            "투명해",
            "투명하기",
            "안이 비쳐 보여야",
            "안이 보여야"
          ]
        },
        {
          "kind": "short-text",
          "accepted": [
            "튼튼",
            "튼튼해",
            "단단",
            "단단해"
          ]
        }
      ]
    },
    "before": [
      "c394fbc004f559ae"
    ]
  },
  "c22-s32-u01-b56": {
    "prompt": "통의 이음새에서 물이 새서 이음새를 고치려고 해요. 고친 뒤 물이 새는지 어떻게 확인할까요? 물의 양이나 살펴보는 시간을 생각해 한 문장으로 쓰세요.",
    "form": "written",
    "answer": "같은 양의 물을 넣어 같은 시간 동안 새는지 살펴요.",
    "explanation": "물이 샌 이음새를 고친 뒤에도 다시 물을 넣어 살펴봐야 해요. 물의 양과 살펴보는 시간을 같게 하면 고치기 전후를 비교하기 좋아요.",
    "required": [
      "물을 넣어 새는지 다시 살펴보는 방법",
      "물의 양이나 관찰 시간 등 비교 조건을 같게 함"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "contract": {
      "kind": "written-explanation",
      "teacherRequired": true,
      "actualPerformanceMustNotBeInferred": true,
      "sample": "같은 양의 물을 넣어 같은 시간 동안 새는지 살펴요.",
      "required": [
        "물을 넣어 새는지 다시 살펴보는 방법",
        "물의 양이나 관찰 시간 등 비교 조건을 같게 함"
      ]
    },
    "before": [
      "28dbc43d209363ab"
    ]
  },
  "c22-s32-u01-b64": {
    "prompt": "친구가 “창이 불투명해서 안이 안 보여.”라고 말했어요. 안이 보이게 하려면 창을 [ ] 재료로 바꾸어요. 투명한·불투명한 중 알맞은 말을 쓰세요.",
    "form": "blank",
    "answer": "투명한",
    "explanation": "친구가 말한 불편은 안이 보이지 않는다는 점이에요. 안이 비쳐 보이는 재료를 골라 창을 고쳐요. 실제로 만들 때에는 고친 뒤 친구가 잘 볼 수 있는지도 함께 살펴요.",
    "required": [
      "안을 볼 수 있는 투명한 창 재료"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "accepted": [
      "투명한",
      "투명",
      "안이 비쳐 보이는",
      "안이 보이는"
    ],
    "contract": {
      "kind": "short-text",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": "투명한",
      "accepted": [
        "투명한",
        "투명",
        "안이 비쳐 보이는",
        "안이 보이는"
      ]
    },
    "before": [
      "4f3cee9930029817"
    ]
  },
  "c22-s32-u01-t12": {
    "prompt": "같은 모양과 크기의 막대 네 개를 비교한 표예요. 표에 맞는 설명을 고르세요.",
    "form": "choice",
    "answer": "②",
    "explanation": "표에서 나무 막대만 물에 뜨고 나머지는 가라앉았어요. 모양과 크기가 같아도 만든 물질이 다르면 성질이 다를 수 있어요. 이 표에 나온 막대의 결과를 비교한 것이에요.",
    "required": [
      "같은 모양과 크기여도 만든 물질에 따라 성질이 다를 수 있음"
    ],
    "misconception": "물체의 쓰임과 그 부분을 만든 물질의 성질을 함께 살펴요.",
    "choices": [
      "모양과 크기가 같으므로 네 막대의 모든 성질이 같다.",
      "물에 넣었을 때의 모습이 달랐으므로 만든 물질의 성질을 살펴야 한다.",
      "막대 네 개가 모두 물에 떴으므로 모두 같은 물질이다."
    ],
    "key": 1,
    "contract": {
      "kind": "single-choice",
      "teacherRequired": false,
      "actualPerformanceMustNotBeInferred": true,
      "answer": 1
    },
    "before": [
      "287570d6bba93da4"
    ]
  },
  "c22-s32-u01-t05": {
    "labelOnly": true,
    "before": [
      "d2872f5cacfa0236"
    ]
  },
  "c22-s32-u01-t09": {
    "labelOnly": true,
    "before": [
      "1e855695d2558ed7"
    ]
  },
  "c22-s32-u01-t10": {
    "labelOnly": true,
    "before": [
      "b76fb1ba647c71d0"
    ]
  }
};
const clone=x=>JSON.parse(JSON.stringify(x));
function fingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const banks=new WeakMap(),books=new WeakMap(),labels={choice:'객관식',blank:'빈칸 넣기',short:'단답형',written:'짧게 설명하기',draw:'그림 설명'};
const response=e=>e.contract?clone(e.contract):{kind:Object.hasOwn(e,'drawingExplanationLines')?'drawing':'written-explanation',teacherRequired:true,actualPerformanceMustNotBeInferred:true,sample:e.answer,required:[...e.required]};
// seasonContract is the existing shared closed-response grading adapter.
function answerContract(e){const c=response(e);return{type:e.form==='written'?'written-explanation':e.form==='choice'?'single-choice':'short-text',...(e.form==='written'?{sample:e.answer,teacherRequired:true,reviewRequired:true,rubric:{required:[...e.required],pass:'뜻이 같은 짧은 답과 타당한 다른 방법도 교사가 확인해요.'}}:e.form==='choice'?{answer:e.key,accepted:[e.key]}:{answer:e.answer,accepted:c.accepted||[e.answer],inputHint:c.parts?'빈칸의 답을 쉼표로 나누어 차례대로 써요.':'짧은 낱말로 답해요.'}),seasonContract:c};}
const materialSampleIds=new Set(['c22-s32-u01-t05','c22-s32-u01-t09','c22-s32-u01-t10','c22-s32-u01-t12']);
function materialSamplePrior(q){if(!materialSampleIds.has(q.id)||!q.givens||!JSON.stringify(q.givens).includes('고무(네오프렌 고무)'))return q;return{...q,givens:JSON.parse(JSON.stringify(q.givens).replaceAll('고무(네오프렌 고무)','고무(천연고무)'))};}
function materialSampleGivens(q){if(!materialSampleIds.has(q.id)||!q.givens||!JSON.stringify(q.givens).includes('고무(천연고무)'))return q.givens;return JSON.parse(JSON.stringify(q.givens).replaceAll('고무(천연고무)','고무(네오프렌 고무)'));}
export function materialMixedItems(rows,u){
 if(u!==unit||!rows?.length)return rows;let changed=false;
 const next=rows.map(q=>{const e=bankReview[q.id],prior=materialSamplePrior(q);if(!e||q.status!=='authored'||!['authored-supplement','authored-lesson','authored-practice'].includes(q.sourceRef?.type)||!e.before.includes(fingerprint(prior)))return q;changed=true;if(banks.has(q))return banks.get(q);if(e.labelOnly){const result={...q,givens:materialSampleGivens(q),materialSampleCorrection:MATERIAL_MIXED_VERSION,materialMixedResponse:MATERIAL_MIXED_VERSION,contentVersion:MATERIAL_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(prior),version:prior.contentVersion||1,snapshotKind:'full-question'}]};if(q.diagnosticOverride?.version===q.contentVersion)result.diagnosticOverride={...q.diagnosticOverride,version:MATERIAL_MIXED_VERSION};banks.set(q,result);return result;}
 const result={...q,givens:materialSampleGivens(q),prompt:e.prompt,explanation:e.explanation,misconception:e.misconception,responseContract:response(e),answerContract:answerContract(e),bookResponseForm:e.form,taxonomy:{...q.taxonomy,format:labels[e.form]},choices:e.choices?clone(e.choices):null,diagnosticOverride:{version:MATERIAL_MIXED_VERSION,distractors:null,typed:null,cloze:null,cells:null},materialMixedResponse:MATERIAL_MIXED_VERSION,contentVersion:MATERIAL_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(prior),version:prior.contentVersion||1,snapshotKind:'full-question'}]};banks.set(q,result);return result;});return changed?next:rows;
}
export function withMaterialMixedClassroom(u,mod){if(u!==unit)return mod;const classroomItems=materialMixedItems(mod?.classroomItems,u);return classroomItems===mod.classroomItems?mod:{...mod,classroomItems};}
export function withMaterialMixedWorkbook(w){
 if(w?.unit!==unit||fingerprint(w)!==prior)return w;if(books.has(w))return books.get(w);
 const questions=w.questions.map(q=>{const e=review[q.no];if(!e||fingerprint(q)!==e.before)return q;
 const result={...q,prompt:e.prompt,answer:e.answer,explanation:e.explanation,misconception:e.misconception,form:e.form,formLabel:labels[e.form],bookResponseForm:e.form,choices:e.choices?clone(e.choices):null,requirements:[...e.required],criteria:e.required.join(' / '),responseContract:response(e),materialMixedResponse:MATERIAL_MIXED_VERSION,contentVersion:MATERIAL_MIXED_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};delete result.parts;delete result.answerPerPart;if(e.form==='written')result.lines=1;else delete result.lines;if(Object.hasOwn(e,'key'))result.key=e.key;
 if(q.sourceRef?.type==='authored-supplement'){result.sourceContract=answerContract(e);result.sourceExplanation=e.explanation;}
 return result;});
 const quickPages=w.quickPages.map(p=>({...p,blocks:p.blocks.map(b=>b.type!=='table'?b:{...b,rows:b.rows.map(row=>{const e=review[Number(row[0])];return e&&!e.contract.teacherRequired?[row[0],labels[e.form]+(String(row[1]).includes(' · ')?String(row[1]).slice(String(row[1]).indexOf(' · ')):''),e.answer]:row;})})}));
 const titles={33:'물체와 재료를 살펴요',35:'알맞은 말을 채워요',37:'쓰임에 맞는 성질을 찾아요',39:'고친 뒤 다시 살펴요'};
 const pages=rows=>rows.map(p=>{const ids=p.blocks.flatMap(b=>b.ids||[]),first=Number(ids[0]?.slice(-3));return titles[first]&&ids.length===2?{...p,section:'생각해 보기 '+first+'~'+(first+1),title:titles[first]}:p;});
 const result={...w,questions,quickPages,pages:pages(w.pages),teacherStudentPages:pages(w.teacherStudentPages)};books.set(w,result);return result;
}
