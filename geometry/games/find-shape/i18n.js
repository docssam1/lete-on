const common = {
  world: "GFIELD Geometry World",
  town: "GFIELD Cube Town",
  success: "GREAT JOB!",
  successGood: "GOOD JOB!",
  successPop: "SUCCESS!"
};

export const messages = {
  ko: { ...common,
    title: "단서로 모양 찾기", instruction: "층별 개수와 앞·오른쪽에서 본 모양을 모두 만족하는 쌓기나무를 골라 보세요.",
    clueTitle: "모양 단서", choicesTitle: "알맞은 쌓기나무", layerTitle: "층별 쌓기나무 수",
    frontView: "앞에서 본 모양", rightView: "오른쪽에서 본 모양", layerLine: "{level}층에는 {count}개가 있어요.",
    choosePrompt: "세 단서를 차례로 비교하고 한 가지 모양을 선택해 보세요.",
    check: "확인", hint: "힌트", reset: "선택 지우기", next: "다음 문제", level: "레벨 선택", exit: "나가기",
    progress: "레벨 {level} · {current}/{total}", guideStart: "층별 개수와 두 방향의 모양을 모두 확인해 보자.",
    chooseFirst: "먼저 알맞다고 생각하는 모양을 하나 선택해 봐.", wrong: "한 가지 단서가 맞지 않아. 옅게 빛나는 단서를 다시 비교해 볼까?",
    hintMessage: "층별 개수가 같은 후보들이야. 앞과 오른쪽의 가장 높은 칸을 하나씩 비교해 봐.",
    guideSuccess: "세 단서를 모두 만족하는 모양을 정확히 찾았어!", selected: "선택한 모양", option: "보기 {number}",
    tutorial1: "먼저 1층, 2층처럼 각 층에 있는 쌓기나무 수를 확인해.",
    tutorial2: "그다음 앞에서 본 높이와 오른쪽에서 본 높이를 비교해.",
    tutorial3: "모든 단서를 동시에 만족하는 모양은 하나뿐이야. 모양을 고르고 확인을 눌러!",
    tutorialNext: "다음", tutorialStart: "시작", audioOn: "음성 켜짐", audioOff: "음성 켜기",
    levelName: "레벨 {level}", levelDesc3: "2층 · 보기 3개", levelDesc4: "3층 · 보기 4개", levelDesc5: "최대 4×4×4 · 보기 4개", problemCount: "한 번에 5문제"
  },
  zh: { ...common,
    title: "根据线索找形状", instruction: "根据每层数量以及前视图和右视图，选择正确的积木造型。",
    clueTitle: "形状线索", choicesTitle: "选择正确形状", layerTitle: "每层积木数量",
    frontView: "前视图", rightView: "右视图", layerLine: "第 {level} 层有 {count} 个。",
    choosePrompt: "依次比较三个线索，再选择一个形状。", check: "确认", hint: "提示", reset: "清除选择", next: "下一题", level: "选择等级", exit: "退出",
    progress: "等级 {level} · {current}/{total}", guideStart: "同时检查每层数量和两个方向的形状。", chooseFirst: "请先选择一个形状。",
    wrong: "有一个线索不匹配。再比较发光的线索吧。", hintMessage: "这些选项的每层数量相同。逐列比较前面和右边的最高高度。",
    guideSuccess: "你找到了满足全部三个线索的形状！", selected: "已选形状", option: "选项 {number}",
    tutorial1: "先看第一层、第二层等每层有多少个方块。", tutorial2: "再比较从前面和右边看到的高度。", tutorial3: "只有一个形状同时满足所有线索。选好后点确认！",
    tutorialNext: "下一步", tutorialStart: "开始", audioOn: "语音已开", audioOff: "开启语音",
    levelName: "等级 {level}", levelDesc3: "2层 · 3个选项", levelDesc4: "3层 · 4个选项", levelDesc5: "最大4×4×4 · 4个选项", problemCount: "每次5题"
  },
  ja: { ...common,
    title: "手がかりから形を探す", instruction: "層ごとの数と、前・右から見た形に合う積み木を選ぼう。",
    clueTitle: "形の手がかり", choicesTitle: "正しい積み木", layerTitle: "層ごとの積み木の数",
    frontView: "前から見た形", rightView: "右から見た形", layerLine: "{level}層には{count}個あります。",
    choosePrompt: "3つの手がかりを比べて、形を一つ選ぼう。", check: "確認", hint: "ヒント", reset: "選択を消す", next: "次の問題", level: "レベル選択", exit: "出る",
    progress: "レベル {level} · {current}/{total}", guideStart: "層の数と二つの方向の形を全部確認しよう。", chooseFirst: "まず形を一つ選んでね。",
    wrong: "一つの手がかりが合っていないよ。光っている手がかりを比べよう。", hintMessage: "層ごとの数は全部同じ。前と右の一番高いマスを比べよう。",
    guideSuccess: "3つの手がかりに合う形を正しく見つけたね！", selected: "選んだ形", option: "選択肢 {number}",
    tutorial1: "まず1層、2層のように、各層の積み木の数を確認しよう。", tutorial2: "次に前から見た高さと右から見た高さを比べよう。", tutorial3: "全部の手がかりに合う形は一つだけ。選んで確認を押そう！",
    tutorialNext: "次へ", tutorialStart: "スタート", audioOn: "音声オン", audioOff: "音声を聞く",
    levelName: "レベル {level}", levelDesc3: "2層 · 3択", levelDesc4: "3層 · 4択", levelDesc5: "最大4×4×4 · 4択", problemCount: "1回5問"
  },
  en: { ...common,
    title: "Find the Shape", instruction: "Choose the cube solid that matches the layer counts and both the front and right views.",
    clueTitle: "Shape Clues", choicesTitle: "Choose the Solid", layerTitle: "Cubes on Each Layer",
    frontView: "Front View", rightView: "Right View", layerLine: "Layer {level} has {count} cubes.",
    choosePrompt: "Compare all three clues, then choose one solid.", check: "Check", hint: "Hint", reset: "Clear Choice", next: "Next", level: "Choose Level", exit: "Exit",
    progress: "Level {level} · {current}/{total}", guideStart: "Check the layer counts and both side views.", chooseFirst: "Choose one solid first.",
    wrong: "One clue does not match. Compare the softly glowing clue again.", hintMessage: "All choices have the same layer counts. Compare the tallest column in each front and right position.",
    guideSuccess: "You found the solid that matches all three clues!", selected: "Selected solid", option: "Option {number}",
    tutorial1: "First, count how many cubes sit on layer 1, layer 2, and so on.", tutorial2: "Next, compare the heights seen from the front and from the right.", tutorial3: "Only one solid matches every clue. Choose it and press Check!",
    tutorialNext: "Next", tutorialStart: "Start", audioOn: "Voice on", audioOff: "Voice",
    levelName: "Level {level}", levelDesc3: "2 layers · 3 choices", levelDesc4: "3 layers · 4 choices", levelDesc5: "Up to 4×4×4 · 4 choices", problemCount: "5 problems per round"
  }
};

export function text(lang, key) {
  return messages[lang]?.[key] ?? messages.ko[key] ?? key;
}
