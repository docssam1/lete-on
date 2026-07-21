export const groups = [
  { id: "foundation", level: "A", color: "green", title: { ko: "모양을 보고 쌓기", zh: "观察并搭建", ja: "見て積み上げる", en: "Look and Build" } },
  { id: "counting", level: "B", color: "blue", title: { ko: "개수를 세고 채우기", zh: "计数与填充", ja: "数えて埋める", en: "Count and Complete" } },
  { id: "transform", level: "C", color: "orange", title: { ko: "움직이고 기억하기", zh: "移动与记忆", ja: "動かして覚える", en: "Move and Remember" } },
  { id: "reasoning", level: "D", color: "violet", title: { ko: "여러 방향으로 생각하기", zh: "从多个方向思考", ja: "いろいろな方向から考える", en: "Think from Every Side" } }
];

export const games = [
  {
    id: "copy-build", group: "foundation", number: "01", ready: true, href: "../games/copy-build/?v=cube-town3", thumb: "copy", levels: "Lv. 1–5",
    name: { ko: "똑같이 쌓기", zh: "搭出相同形状", ja: "同じ形を作ろう", en: "Copy the Build" },
    description: { ko: "문제 모양을 돌려 보고 같은 자리에 블록을 쌓아요.", zh: "旋转观察题目，并在相同位置搭建方块。", ja: "見本を回して、同じ場所にブロックを積みます。", en: "Turn the model and place cubes in the matching positions." }
  },
  {
    id: "count-cubes", group: "foundation", number: "02", ready: true, href: "../games/count-heights/?v=3", thumb: "count", levels: "Lv. 1–5",
    name: { ko: "쌓기나무 개수 세기", zh: "数一数积木", ja: "つみきの数を数えよう", en: "Count the Cubes" },
    description: { ko: "쌓기나무 맨 위에 수를 쓰고 모두 더해 전체 개수를 구해요.", zh: "在每列积木顶部写数字，再相加求总数。", ja: "積み木の上に数を書いて、全部たして数えます。", en: "Write numbers on top of the cube columns and add them to count all cubes." }
  },
  {
    id: "hidden-count", group: "counting", number: "03", ready: true, href: "../games/hidden-count/?v=2", thumb: "hidden", levels: "Lv. 1–6",
    name: { ko: "숨은 쌓기나무 찾기", zh: "寻找隐藏方块", ja: "かくれたつみきを探す", en: "Find Hidden Cubes" },
    description: { ko: "보이는 블록을 단서로 안쪽에 숨은 개수를 찾아요.", zh: "根据可见方块推理内部隐藏的数量。", ja: "見えるブロックから、内側に隠れた数を考えます。", en: "Use the visible cubes to reason about the cubes hidden inside." }
  },
  {
    id: "fill-box", group: "counting", number: "04", ready: true, href: "../games/fill-box/?v=1", thumb: "fill", levels: "Lv. 1–4",
    name: { ko: "큐브 박스 채우기", zh: "填满方块盒", ja: "キューブボックスを満たす", en: "Fill the Cube Box" },
    description: { ko: "직육면체 상자를 가득 채우려면 몇 개가 더 필요한지 구해요.", zh: "计算填满长方体盒子还需要多少方块。", ja: "直方体の箱を満たすのにあと何個必要か考えます。", en: "Work out how many more cubes are needed to fill the box." }
  },
  {
    id: "tunnel", group: "counting", number: "05", ready: false, thumb: "tunnel", levels: "Lv. 2–5",
    name: { ko: "큐브 터널", zh: "方块隧道", ja: "キューブトンネル", en: "Cube Tunnels" },
    description: { ko: "반대편까지 뚫린 구멍을 층별로 표시하고 남은 개수를 세요.", zh: "逐层标出贯通的孔洞并计算剩余方块。", ja: "反対側まで通る穴を層ごとに示して残りを数えます。", en: "Mark through-tunnels layer by layer and count what remains." }
  },
  {
    id: "join-pieces", group: "transform", number: "06", ready: false, thumb: "pieces", levels: "Lv. 1–5",
    name: { ko: "큐브 조각 연구소", zh: "方块组合实验室", ja: "キューブピース研究所", en: "Cube Piece Lab" },
    description: { ko: "여러 조각을 회전하고 이어 붙여 목표 모양을 만들어요.", zh: "旋转并组合多个部件，完成目标形状。", ja: "ピースを回してつなぎ、目標の形を作ります。", en: "Rotate and join pieces to create the target solid." }
  },
  {
    id: "memory", group: "transform", number: "07", ready: false, thumb: "memory", levels: "Lv. 1–4",
    name: { ko: "큐브 메모리", zh: "方块记忆", ja: "キューブメモリー", en: "Cube Memory" },
    description: { ko: "10초 동안 본 모양과 색을 기억해 똑같이 재현해요.", zh: "记住十秒内看到的形状和颜色并重现。", ja: "10秒間見た形と色を覚えて再現します。", en: "Remember the shape and colors for ten seconds, then rebuild it." }
  },
  {
    id: "views", group: "transform", number: "08", ready: false, thumb: "views", levels: "Lv. 1–5",
    name: { ko: "세 방향 관찰소", zh: "三方向观察站", ja: "三方向観察所", en: "Three-View Station" },
    description: { ko: "앞·옆·위에서 본 모양을 표에 직접 색칠해요.", zh: "在表格中画出前视图、侧视图和俯视图。", ja: "前・横・上から見た形を表に塗ります。", en: "Color the front, side, and top views on matching grids." }
  },
  {
    id: "transparent", group: "reasoning", number: "09", ready: false, thumb: "transparent", levels: "Lv. 2–5",
    name: { ko: "크리스털 큐브", zh: "水晶方块", ja: "クリスタルキューブ", en: "Crystal Cubes" },
    description: { ko: "투명 케이스의 세 방향 카드를 만족하는 모양을 만들어요.", zh: "搭出满足透明盒三方向卡片的形状。", ja: "透明ケースの三方向カードに合う形を作ります。", en: "Build a solid that matches all three cards in a clear case." }
  },
  {
    id: "blueprint", group: "reasoning", number: "10", ready: false, thumb: "blueprint", levels: "Lv. 2–5",
    name: { ko: "큐브 설계도", zh: "方块蓝图", ja: "キューブ設計図", en: "Cube Blueprints" },
    description: { ko: "위·앞·옆의 바탕그림만 보고 가능한 입체를 완성해요.", zh: "只看上、前、侧视图完成可能的立体。", ja: "上・前・横の図だけから立体を完成させます。", en: "Use only top, front, and side drawings to complete a solid." }
  },
  {
    id: "find-shape", group: "reasoning", number: "11", ready: false, thumb: "find", levels: "Lv. 3–5",
    name: { ko: "단서로 모양 찾기", zh: "根据线索找形状", ja: "手がかりから形を探す", en: "Find the Shape" },
    description: { ko: "층별 개수와 방향별 모양에 맞는 쌓기나무를 골라요.", zh: "根据各层数量和方向视图选择正确形状。", ja: "層の数と方向別の形に合うものを選びます。", en: "Choose the solid that matches the layer counts and view clues." }
  },
  {
    id: "minmax", group: "reasoning", number: "12", ready: false, thumb: "minmax", levels: "Lv. 4–5",
    name: { ko: "최대·최소 큐브 챌린지", zh: "最多最少方块挑战", ja: "最大・最小キューブチャレンジ", en: "Cube Min–Max Challenge" },
    description: { ko: "같은 세 방향 그림을 만드는 가장 많고 적은 개수를 찾아요.", zh: "找出符合三方向图的最多和最少方块数。", ja: "同じ三方向図になる最大・最小の数を探します。", en: "Find the greatest and least cube counts for the same three views." }
  }
];
