export const LAB_CONTENT = {
  "stages": [
    {
      "id": "ready",
      "title": "랩코니와 실험 준비",
      "phase": "engage",
      "day": 1,
      "caption": "준비됐나요? 저를 눌러 시작해요.",
      "instruction": "샤를 랩코니를 누르고 오늘 사용할 탐구 방법을 골라요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "onboarding",
        "controls": [
          "click-labconi",
          "virtual-mode",
          "real-mode"
        ],
        "scene": "welcome",
        "defaultEvidenceType": "virtual"
      },
      "help": [
        "화면 실험만으로도 시작할 수 있어요.",
        "실물은 별도 키트를 어른과 함께 준비해요."
      ],
      "bookPage": [
        1,
        2
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "pouch",
      "title": "봉투 속에는 무엇이 있을까?",
      "phase": "engage",
      "day": 1,
      "caption": "흔들고, 열고, 하나씩 살펴요.",
      "instruction": "봉투를 흔들어 보고 윗부분을 열어 준비물을 펼쳐요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "unboxing",
        "scene": "pouch",
        "controls": [
          "shake",
          "tear",
          "replay",
          "select-part"
        ],
        "states": [
          "sealed",
          "shaken",
          "open",
          "parts"
        ],
        "parts": [
          "paper-B",
          "paper-D",
          "paper-E",
          "disc-upper",
          "disc-lower",
          "bar-magnet",
          "fish-label",
          "carrot-label",
          "tape"
        ],
        "label": "화면 속 준비물 모형 · 실제 키트의 구성과 수량은 따로 확인해요."
      },
      "help": [
        "흔들기와 열기 버튼으로도 할 수 있어요.",
        "부품을 누르면 이름과 쓰임을 볼 수 있어요."
      ],
      "bookPage": [
        8
      ],
      "completion": "open-pouch-then-explicit-next",
      "optional": false
    },
    {
      "id": "first-ideas",
      "title": "보이지 않는 힘을 예상해요",
      "phase": "engage",
      "day": 1,
      "caption": "먼저 떠오른 생각을 남겨요.",
      "instruction": "세 질문을 읽고 글이나 그림으로 예상해요. 모르는 것은 궁금한 점으로 남겨도 좋아요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "prediction",
        "scene": "magnet-preview",
        "sourceIds": [
          "S01-Q1",
          "S01-Q2",
          "S01-Q3"
        ],
        "questions": [
          "자석 주변에 자석의 힘이 작용하는 공간을 어떻게 볼 수 있나요?",
          "서로 다른 극을 가까이 하면 철가루는 어떻게 되나요?",
          "서로 같은 극을 가까이 하면 철가루는 어떻게 되나요?"
        ],
        "recordType": "prediction",
        "sealedToolOptional": true
      },
      "help": [
        "화면의 자석과 주변을 살펴보세요.",
        "밀봉 관찰 도구가 없으면 예상으로 남겨요."
      ],
      "bookPage": [
        3
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "clip-discovery",
      "title": "클립이 모이는 곳을 찾아요",
      "phase": "explore",
      "day": 1,
      "caption": "막대의 여러 곳, 동전의 여러 면을 비교해요.",
      "instruction": "클립을 잡아 자석의 끝·가운데, 동전자석의 위·아래·옆면에 가까이 해요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "clip-probe",
        "scene": "magnet-bench",
        "controls": [
          "magnet-bar",
          "magnet-disc",
          "drag-clip",
          "probe-left-end",
          "probe-center",
          "probe-right-end",
          "probe-top",
          "probe-bottom",
          "probe-side",
          "reset-trial",
          "record-observation"
        ],
        "regions": {
          "bar": [
            "left-end",
            "center",
            "right-end"
          ],
          "disc": [
            "top",
            "bottom",
            "side"
          ]
        },
        "recordType": "virtual",
        "sourceIds": [
          "S02-Q1"
        ],
        "comparison": "relative-response",
        "exactStrengthClaim": false
      },
      "help": [
        "자석의 위치를 바꿀 때 클립과 시작 거리는 같게 해요.",
        "클립의 위치를 누르는 버튼으로도 비교할 수 있어요."
      ],
      "bookPage": [
        4,
        5
      ],
      "completion": "two-regions-each-shape-or-save-incomplete",
      "optional": false
    },
    {
      "id": "eight-pairs",
      "title": "여덟 가지 만남",
      "phase": "explore",
      "day": 2,
      "caption": "모양이 달라도 마주 보는 극을 살펴요.",
      "instruction": "먼저 예상하고 두 자석을 가까이 해 보세요. 자석을 뒤집어 여덟 조합을 비교해요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "magnet-pairs",
        "scene": "pair-bench",
        "controls": [
          "select-pair",
          "flip-left",
          "flip-right",
          "near",
          "far",
          "predict",
          "run",
          "record-observation",
          "reset-trial"
        ],
        "pairIds": [
          "bar-disc-NN",
          "bar-disc-NS",
          "bar-disc-SN",
          "bar-disc-SS",
          "disc-disc-NN",
          "disc-disc-NS",
          "disc-disc-SN",
          "disc-disc-SS"
        ],
        "sourceIds": [
          "S02-Q2"
        ],
        "recordType": "virtual",
        "allPairsVisible": true
      },
      "help": [
        "N과 S 글자를 읽어 마주 보는 두 극을 확인해요.",
        "아직 하지 않은 조합은 빈칸으로 남아요."
      ],
      "bookPage": [
        6
      ],
      "completion": "eight-trials-or-save-incomplete",
      "optional": false
    },
    {
      "id": "magnet-pattern",
      "title": "관찰에서 규칙으로",
      "phase": "explain",
      "day": 2,
      "caption": "내 기록 옆에서 자석의 규칙을 읽어요.",
      "instruction": "앞에서 본 두 조합을 고른 뒤 같은 극과 다른 극의 설명을 읽어요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "concept-from-records",
        "scene": "pair-bench",
        "controls": [
          "compare-saved-trials",
          "replay-selected-pair",
          "show-law"
        ],
        "sourceIds": [
          "S04-CONCEPT"
        ],
        "recordType": "explanation",
        "revealAfter": "observation-attempt",
        "skipLabel": "아직 관찰하지 않았어요 · 설명 살펴보기",
        "instructionalText": [
          "자석에는 N극과 S극이 있어요.",
          "같은 극끼리는 서로 밀어내고, 다른 극끼리는 서로 끌어당겨요."
        ]
      },
      "help": [
        "내가 고른 두 기록의 극 표시를 비교해요.",
        "사진만으로 극을 알기 어려우면 N/S 모형을 확인해요."
      ],
      "bookPage": [
        7
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "assembly-jaw",
      "title": "아래턱을 만들어요",
      "phase": "explore",
      "day": 3,
      "caption": "사진과 모형을 번갈아 보며 1–3단계를 따라요.",
      "instruction": "E에 테이프를 붙이고 아래턱을 접은 뒤 B의 위턱 끝에 맞춰 붙여요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": [
        1,
        2,
        3
      ],
      "activity": {
        "type": "assembly-training",
        "scene": "crocodile-build",
        "controls": [
          "previous-phase",
          "next-phase",
          "perform-step",
          "undo-step",
          "replay-step",
          "rotate",
          "reset-camera",
          "photo-toggle",
          "help"
        ],
        "phaseRange": [
          1,
          3
        ],
        "gate": "none"
      },
      "help": [
        "사진에서 E와 B를 먼저 찾아요.",
        "접는 방향이 헷갈리면 모형을 옆으로 돌려요."
      ],
      "bookPage": [
        9
      ],
      "completion": "explicit-next-no-quiz",
      "optional": false
    },
    {
      "id": "assembly-body",
      "title": "몸통과 자석을 붙여요",
      "phase": "explore",
      "day": 3,
      "caption": "4–6단계, 자석 방향을 크게 살펴요.",
      "instruction": "몸통과 꼬리를 붙이고 두 턱의 동전자석 N극을 원본 방향대로 바깥쪽으로 놓아요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": [
        4,
        5,
        6
      ],
      "activity": {
        "type": "assembly-training",
        "scene": "crocodile-build",
        "controls": [
          "previous-phase",
          "next-phase",
          "perform-step",
          "undo-step",
          "replay-step",
          "rotate",
          "reset-camera",
          "photo-toggle",
          "flip-upper-pole",
          "flip-lower-pole",
          "restore-source-orientation",
          "help"
        ],
        "phaseRange": [
          4,
          6
        ],
        "gate": "none",
        "emphasisPhase": 6
      },
      "help": [
        "위턱과 아래턱을 따로 확대해요.",
        "원본 조립 사진의 N극 방향과 비교해요."
      ],
      "bookPage": [
        10
      ],
      "completion": "explicit-next-no-quiz",
      "optional": false
    },
    {
      "id": "assembly-food",
      "title": "먹이 손잡이를 완성해요",
      "phase": "explore",
      "day": 3,
      "caption": "7–10단계, 물고기 S·당근 N을 확인해요.",
      "instruction": "D상자에 막대자석을 넣고 S극 쪽에 물고기, N극 쪽에 당근을 붙여요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": [
        7,
        8,
        9,
        10
      ],
      "activity": {
        "type": "assembly-training",
        "scene": "crocodile-build",
        "controls": [
          "previous-phase",
          "next-phase",
          "perform-step",
          "undo-step",
          "replay-step",
          "rotate",
          "reset-camera",
          "photo-toggle",
          "inspect-food-poles",
          "help"
        ],
        "phaseRange": [
          7,
          10
        ],
        "gate": "none",
        "phase10Action": "place-fish-far-ready-for-trial"
      },
      "help": [
        "막대자석의 글자와 먹이를 붙인 쪽을 같이 봐요.",
        "조립 10단계는 먹이를 가져오는 동작이며 관찰 기록을 대신하지 않아요."
      ],
      "bookPage": [
        11
      ],
      "completion": "explicit-next-no-quiz",
      "optional": false
    },
    {
      "id": "food-predict",
      "title": "두 먹이의 반응을 예상해요",
      "phase": "engage",
      "day": 4,
      "caption": "물고기와 당근, 입은 어떻게 될까요?",
      "instruction": "가설과 두 먹이의 예상을 적고 아직 시험하지 않은 모습은 예상으로 남겨요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "prediction",
        "scene": "feeding-bench",
        "controls": [
          "fish",
          "carrot",
          "far",
          "inspect-poles"
        ],
        "fields": [
          "hypothesis",
          "resting-jaw-reason",
          "fish-prediction",
          "carrot-prediction"
        ],
        "sourceIds": [
          "S03-H",
          "S03-R1",
          "S03-R2"
        ],
        "recordType": "prediction"
      },
      "help": [
        "먹이 이름과 마주 보는 자석의 극을 따로 살펴요.",
        "잘 모르겠으면 확인하고 싶은 것을 적어요."
      ],
      "bookPage": [
        8,
        12
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "fish-trial",
      "title": "물고기를 가까이",
      "phase": "explore",
      "day": 4,
      "caption": "화면에서 먼저 천천히 움직여 봐요.",
      "instruction": "물고기의 S극을 악어 쪽으로 가까이 하고, 멀리 하며 턱의 변화를 관찰해요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": 10,
      "activity": {
        "type": "feeding",
        "scene": "feeding-bench",
        "food": "fish",
        "defaultPole": "S",
        "controls": [
          "distance-slider",
          "near",
          "far",
          "drag-food",
          "reset-trial",
          "record-observation"
        ],
        "recordType": "virtual",
        "sourceIds": [
          "S03-R2-fish"
        ]
      },
      "help": [
        "같은 자리에서 가까이·멀리만 바꾸어요.",
        "모형에서 본 입의 모습과 실물에서 본 모습은 따로 기록해요."
      ],
      "bookPage": [
        12
      ],
      "completion": "near-and-far-then-record-or-save-incomplete",
      "optional": false
    },
    {
      "id": "carrot-trial",
      "title": "당근으로 바꾸면",
      "phase": "explore",
      "day": 4,
      "caption": "먹이 외의 조건은 그대로 두어요.",
      "instruction": "같은 시작 자리에서 당근 N극을 가까이 하고 멀리 하며 관찰해요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": 10,
      "activity": {
        "type": "feeding",
        "scene": "feeding-bench",
        "food": "carrot",
        "defaultPole": "N",
        "controls": [
          "distance-slider",
          "near",
          "far",
          "drag-food",
          "reset-trial",
          "record-observation"
        ],
        "recordType": "virtual",
        "sourceIds": [
          "S03-R2-carrot"
        ]
      },
      "help": [
        "물고기 실험 때의 자석 방향과 시작 거리를 확인해요.",
        "입의 변화와 몸통 이동을 나누어 봐요."
      ],
      "bookPage": [
        12
      ],
      "completion": "near-and-far-then-record-or-save-incomplete",
      "optional": false
    },
    {
      "id": "fair-comparison",
      "title": "나란히 놓고 비교해요",
      "phase": "elaborate",
      "day": 4,
      "caption": "한 번에 한 조건씩 바꾸면 더 잘 보여요.",
      "instruction": "같은 거리와 조립 상태에서 물고기와 당근을 다시 시험하고 두 기록을 비교해요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "fair-comparison",
        "scene": "feeding-bench",
        "controls": [
          "choose-food",
          "set-shared-distance",
          "lock-assembly",
          "run-first",
          "run-second",
          "compare-records",
          "reset-trial"
        ],
        "lockedConditions": [
          "assembly-poles",
          "distance-path",
          "body-support"
        ],
        "changedCondition": "food-facing-pole",
        "recordType": "virtual",
        "fields": [
          "changed-condition",
          "same-conditions",
          "observed-difference"
        ]
      },
      "help": [
        "시작 거리와 움직이는 길을 같게 맞춰요.",
        "그림과 자석 극이 함께 바뀐 비교라는 점도 생각해 봐요."
      ],
      "bookPage": [
        12,
        13
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "repair",
      "title": "잘 안 될 때 탐정처럼",
      "phase": "elaborate",
      "day": 4,
      "caption": "하나를 고치고 다시 시험해요.",
      "instruction": "한쪽 턱의 극을 뒤집거나 먹이 극을 바꿔 보고, 문제가 생긴 까닭을 찾아 원래 배치로 돌려요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": 10,
      "activity": {
        "type": "fault-repair",
        "scene": "feeding-bench",
        "controls": [
          "flip-upper-pole",
          "flip-lower-pole",
          "flip-food-pole",
          "set-hinge-blocked",
          "inspect",
          "try-feed",
          "undo-last-change",
          "restore-source-assembly",
          "record-fix"
        ],
        "faults": [
          "upper-pole-reversed",
          "lower-pole-reversed",
          "food-pole-reversed",
          "hinge-blocked"
        ],
        "singleFaultDefault": true,
        "recordType": "virtual",
        "sourceIds": [
          "S07-Q1"
        ]
      },
      "help": [
        "먼저 턱이 움직이는 길을 살펴요.",
        "그다음 고정 상태와 마주 보는 N/S를 비교해요.",
        "한 가지를 고친 뒤 같은 먹이로 다시 시험해요."
      ],
      "bookPage": [
        15
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "crocodile-explain",
      "title": "왜 물고기를 먹었을까?",
      "phase": "explain",
      "day": 4,
      "caption": "내 관찰을 근거로 설명해요.",
      "instruction": "내 설명을 먼저 남기고 두 턱과 먹이의 N/S를 확대해 원리를 연결해요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": 10,
      "activity": {
        "type": "explain-from-evidence",
        "scene": "feeding-cutaway",
        "controls": [
          "show-own-records",
          "inspect-upper",
          "inspect-lower",
          "show-poles",
          "show-force-arrows",
          "replay-near-far"
        ],
        "sourceIds": [
          "S03-R3",
          "S04-CROCODILE"
        ],
        "recordType": "explanation",
        "revealAfter": "observation-attempt",
        "fields": [
          "claim",
          "evidence",
          "reasoning"
        ]
      },
      "help": [
        "입의 모습과 마주 본 극을 함께 말해요.",
        "몸통이 이동하지 않았어도 힘의 방향을 살펴볼 수 있어요."
      ],
      "bookPage": [
        13
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "everyday",
      "title": "우리 곁의 자석",
      "phase": "elaborate",
      "day": 5,
      "caption": "사진 속 물건과 내 주변을 연결해요.",
      "instruction": "생활 사진을 살피고 자석을 이용한 예 세 가지를 기록해요. 철 클립을 가까이 하는 선택 관찰도 할 수 있어요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "everyday-observation",
        "scene": "objects-bench",
        "controls": [
          "select-photo",
          "clip-near-jaw",
          "clip-far",
          "record-example"
        ],
        "photos": [
          "pencil-case",
          "hook",
          "curtain",
          "darts",
          "fridge-magnet",
          "bag"
        ],
        "fields": [
          "example1",
          "example2",
          "example3"
        ],
        "sourceIds": [
          "S05-Q1-adapted",
          "S05-Q2"
        ],
        "recordType": "explanation"
      },
      "help": [
        "모든 금속이 자석에 붙는다고 생각하지 않도록 관찰해요.",
        "칼이나 가위 대신 뭉툭한 철 클립을 사용해요."
      ],
      "bookPage": [
        14,
        16
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "challenge",
      "title": "악어가 그림을 알아볼까?",
      "phase": "elaborate",
      "day": 6,
      "caption": "주말 선택 · 이름만 바꾸어 시험해요.",
      "instruction": "자석의 극·위치·거리는 고정하고 먹이의 그림 이름표만 바꾸어 비교해요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": 10,
      "activity": {
        "type": "optional-challenge",
        "scene": "feeding-bench",
        "controls": [
          "lock-poles",
          "lock-distance",
          "swap-label-only",
          "run-first",
          "run-second",
          "compare-records"
        ],
        "changedCondition": "label-only",
        "lockedConditions": [
          "facing-pole",
          "distance-path",
          "assembly-poles",
          "body-support"
        ],
        "recordType": "virtual",
        "fields": [
          "prediction",
          "observations",
          "reasoning"
        ]
      },
      "help": [
        "그림을 바꾸어도 자석을 뒤집지 않아요.",
        "다른 점 하나, 같은 점들을 따로 적어요."
      ],
      "bookPage": [
        17
      ],
      "completion": "explicit-next",
      "optional": true
    },
    {
      "id": "concept-check",
      "title": "내 말로 확인해요",
      "phase": "evaluate",
      "day": 5,
      "caption": "원본 질문으로 생각을 정리해요.",
      "instruction": "옳지 않은 설명 하나를 고르고 내 기록에서 근거를 찾아요. 핵심 개념도 채워요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "source-check",
        "scene": "notebook",
        "sourceIds": [
          "S04-CHECK",
          "S08-CORE"
        ],
        "question": "다음 중 자석과 자석 악어에 대한 설명으로 옳지 않은 것을 고르세요.",
        "choices": [
          "자석의 극은 자석에서 힘이 가장 센 곳이다.",
          "자석의 극은 N극과 S극 두 개가 있다.",
          "자석의 같은 극끼리는 밀어낸다.",
          "자석의 다른 극끼리는 끌어당긴다.",
          "자석 악어가 먹이를 먹을 때는 두 자석 사이의 밀어내는 힘을 이용한다."
        ],
        "fields": [
          "selected-choice",
          "reason",
          "pole-blank",
          "fish-same-or-different",
          "carrot-same-or-different"
        ],
        "recordType": "response",
        "autoGrade": false
      },
      "help": [
        "어떤 조건의 기록을 근거로 쓸지 골라요.",
        "필요하면 조립이나 자석 비교를 다시 해 봐요."
      ],
      "bookPage": [
        14,
        20
      ],
      "completion": "explicit-next",
      "optional": false
    },
    {
      "id": "report",
      "title": "나의 실험실 기록",
      "phase": "evaluate",
      "day": 5,
      "caption": "예상, 관찰, 설명을 이어 한 주를 남겨요.",
      "instruction": "기록의 출처를 확인하며 보고서를 쓰고, 해결한 일·새로 안 점·다음 질문을 남겨요.",
      "mode": [
        "self",
        "teacher"
      ],
      "assemblyStage": null,
      "activity": {
        "type": "journal",
        "scene": "notebook",
        "controls": [
          "view-virtual-records",
          "view-real-records",
          "edit-report",
          "save-local-opt-in",
          "export-records",
          "resume",
          "revisit-stage"
        ],
        "sourceIds": [
          "S06-R",
          "S07-C",
          "S07-Q1",
          "S07-Q2",
          "S07-Q3",
          "S08-EVAL"
        ],
        "fields": [
          "topic",
          "hypothesis",
          "procedure",
          "results",
          "conclusion",
          "fix",
          "new-learning",
          "next-question",
          "self-assessment"
        ],
        "recordType": "reflection",
        "autoFillAnswers": false
      },
      "help": [
        "화면에서 본 것은 ‘가상 실험’, 키트로 본 것은 ‘실물 관찰’로 남겨요.",
        "하지 않은 활동은 미실행으로 두어도 괜찮아요."
      ],
      "bookPage": [
        18,
        19,
        20
      ],
      "completion": "explicit-next",
      "optional": false
    }
  ],
  "assemblyPhases": [
    {
      "id": 1,
      "title": "E에 발포양면테이프 붙이기",
      "objectId": "paper-E",
      "action": "attach-tape",
      "sourcePdfPage": 13,
      "photo": "assembly-01.png",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 2,
      "title": "이빨 접고 아래턱 바닥 붙이기",
      "objectId": "lower-jaw",
      "action": "fold-and-join",
      "sourcePdfPage": 13,
      "photo": "assembly-02.png",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 3,
      "title": "B다리 접고 아래턱 끝 맞추기",
      "objectId": "jaw-hinge",
      "action": "align-and-join",
      "sourcePdfPage": 13,
      "photo": "assembly-03-branded.svg",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 4,
      "title": "B바닥면 붙이기",
      "objectId": "body-base",
      "action": "fold-and-join",
      "sourcePdfPage": 13,
      "photo": "assembly-04-branded.svg",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 5,
      "title": "꼬리 붙이고 접기",
      "objectId": "tail",
      "action": "fold-and-join",
      "sourcePdfPage": 13,
      "photo": "assembly-05.png",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 6,
      "title": "양 턱에 동전자석 붙이기",
      "objectId": "jaw-magnets",
      "action": "place-with-source-poles",
      "sourcePdfPage": 14,
      "photo": "assembly-06.png",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 7,
      "title": "D를 상자로 접기",
      "objectId": "food-box",
      "action": "fold-and-join",
      "sourcePdfPage": 14,
      "photo": "assembly-07.png",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 8,
      "title": "상자에 막대자석 넣기",
      "objectId": "food-bar",
      "action": "insert",
      "sourcePdfPage": 14,
      "photo": "assembly-08.png",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 9,
      "title": "S물고기/N당근 붙이기",
      "objectId": "food-labels",
      "action": "attach-labels",
      "sourcePdfPage": 14,
      "photo": "assembly-09-branded.svg",
      "undoable": true,
      "quizGate": false
    },
    {
      "id": 10,
      "title": "먹이를 악어 앞으로 가져오기",
      "objectId": "food-handle",
      "action": "approach-and-observe",
      "sourcePdfPage": 14,
      "photo": "assembly-10-branded.svg",
      "undoable": true,
      "quizGate": false
    }
  ],
  "week": {
    "1": [
      "ready",
      "pouch",
      "first-ideas",
      "clip-discovery"
    ],
    "2": [
      "eight-pairs",
      "magnet-pattern"
    ],
    "3": [
      "assembly-jaw",
      "assembly-body",
      "assembly-food"
    ],
    "4": [
      "food-predict",
      "fish-trial",
      "carrot-trial",
      "fair-comparison",
      "repair",
      "crocodile-explain"
    ],
    "5": [
      "everyday",
      "concept-check",
      "report"
    ],
    "optionalWeekend": [
      "challenge"
    ]
  },
  "recordContract": {
    "kinds": [
      "prediction",
      "virtual",
      "real",
      "explanation",
      "response",
      "reflection"
    ],
    "immutableFirstPrediction": true,
    "attemptsAppendOnly": true,
    "realRecordsUserEnteredOnly": true,
    "automaticRealObservation": false,
    "virtualEventLogSeparateFromStudentText": true,
    "teacherWritesStudentStorage": false,
    "persistOptIn": true,
    "existingNotesPreserved": true
  },
  "modelContract": {
    "label": "원리를 살피는 가상 실험 모형",
    "notCalibrated": true,
    "distanceUnits": "near-far normalized, not real cm",
    "forcesFromPoles": true,
    "foodNameDoesNotDrivePhysics": true,
    "upperLowerJawIndependent": true,
    "bodyMovementNotGuaranteed": true,
    "clipResponseRelative": true,
    "exactClipCountIsNotForceMeasurement": true,
    "virtualCompletionNotPhysicalCompletion": true
  }
};
