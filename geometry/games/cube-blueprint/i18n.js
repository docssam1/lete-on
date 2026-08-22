const common = {
  world: "GFIELD Geometry World", town: "GFIELD Cube Town",
  success: "Great job!", successGood: "Good job!", successPop: "Success!"
};

export const messages = {
  ko: { ...common,
    title: "큐브 설계도", instruction: "위·앞·오른쪽 설계도를 모두 만족하는 한 가지 쌓기나무를 완성해 보세요.",
    modelTitle: "내가 만든 입체", answerTitle: "세 방향 설계도", cardsTitle: "설계도",
    buildPrompt: "위에서 본 칸을 눌러 각 자리의 높이를 정해 보세요.",
    viewFront: "앞에서 본 모양", viewSide: "오른쪽에서 본 모양", viewTop: "위에서 본 모양",
    check: "확인", clear: "비우기", front: "앞", side: "오른쪽", top: "위", free: "돌려보기", revealShow: "오른쪽",
    example: "보기", hint: "힌트", reset: "다시", next: "다음 문제", level: "레벨 선택", height: "높이",
    progress: "레벨 {level} · {current}/{total}", blueprintWrong: "아직 맞지 않는 설계도가 있어. 빨간 테두리를 다시 살펴볼까?",
    blueprintEmpty: "먼저 위에서 본 칸을 눌러 쌓기나무를 놓아 보자.",
    guideStart: "세 방향 설계도를 보고 가능한 입체를 만들어 보자.",
    guideBuild: "위 그림으로 자리를 정하고, 앞과 오른쪽 그림으로 높이를 맞춰 봐.",
    guideHint: "위에서 색칠된 칸만 사용하고, 앞과 오른쪽에서 보이는 높이를 비교해 봐.",
    guideSuccess: "완벽해! 세 방향을 만족하는 하나뿐인 입체를 찾았어.",
    tutorialBlueprint1: "설계도에는 위·앞·오른쪽에서 본 모양이 함께 나와.",
    tutorialBlueprint2: "위에서 본 칸을 누르면 그 자리의 높이가 한 칸씩 올라가.",
    tutorialBlueprint3: "세 설계도를 모두 만족하는 입체는 한 가지뿐이야. 완성하면 확인을 눌러!",
    tutorialNext: "다음", tutorialStart: "시작", audioOn: "음성 켜짐", audioOff: "음성 켜기",
    docssam: "큐비", close: "닫기", levelName: "레벨 {level}", problemCount: "5문제"
  },
  zh: { ...common,
    title: "方块设计图", instruction: "根据上面、前面和右边三张设计图，搭出唯一的积木造型。",
    modelTitle: "我的立体", answerTitle: "三向设计图", cardsTitle: "设计图", buildPrompt: "点击俯视格子，设定每个位置的高度。",
    viewFront: "前视图", viewSide: "右视图", viewTop: "俯视图", check: "确认", clear: "清空",
    front: "前面", side: "右边", top: "上面", free: "旋转", revealShow: "右边", example: "示例", hint: "提示", reset: "重来", next: "下一题", level: "选择等级", height: "高度",
    progress: "等级 {level} · {current}/{total}", blueprintWrong: "还有设计图没有对应。看看红色边框吧。", blueprintEmpty: "先点击俯视格子放置积木。",
    guideStart: "观察三张设计图，搭出对应的立体。", guideBuild: "用俯视图定位置，用前视图和右视图定高度。", guideHint: "只使用俯视图中涂色的格子，再比较前面和右边的高度。", guideSuccess: "完成！你找到了唯一满足三张设计图的立体。",
    tutorialBlueprint1: "设计图同时显示上面、前面和右边看到的形状。", tutorialBlueprint2: "点击俯视格子，每次让该位置升高一层。", tutorialBlueprint3: "满足三张设计图的立体只有一个。完成后点确认！",
    tutorialNext: "下一步", tutorialStart: "开始", audioOn: "语音已开", audioOff: "开启语音", docssam: "Cubi", close: "关闭", levelName: "等级 {level}", problemCount: "5题"
  },
  ja: { ...common,
    title: "キューブ設計図", instruction: "上・前・右の設計図をすべて満たす、ただ一つの積み木を作ろう。",
    modelTitle: "作った立体", answerTitle: "3方向の設計図", cardsTitle: "設計図", buildPrompt: "上から見たマスを押して各場所の高さを決めよう。",
    viewFront: "前から見た形", viewSide: "右から見た形", viewTop: "上から見た形", check: "確認", clear: "空にする",
    front: "前", side: "右", top: "上", free: "回して見る", revealShow: "右", example: "見本", hint: "ヒント", reset: "やり直し", next: "次の問題", level: "レベル選択", height: "高さ",
    progress: "レベル {level} · {current}/{total}", blueprintWrong: "まだ合わない設計図があるよ。赤い枠を見直そう。", blueprintEmpty: "まず上から見たマスを押して積み木を置こう。",
    guideStart: "3方向の設計図を見て立体を作ろう。", guideBuild: "上の図で場所を、前と右の図で高さを決めよう。", guideHint: "上の図で塗られたマスだけを使い、前と右の高さを比べよう。", guideSuccess: "完成！3つの設計図を満たすただ一つの立体だよ。",
    tutorialBlueprint1: "設計図には上・前・右から見た形が一緒に出るよ。", tutorialBlueprint2: "上から見たマスを押すたびに、その場所が1段高くなるよ。", tutorialBlueprint3: "3つの設計図を満たす立体は一つだけ。完成したら確認を押そう！",
    tutorialNext: "次へ", tutorialStart: "スタート", audioOn: "音声オン", audioOff: "音声を聞く", docssam: "Cubi", close: "閉じる", levelName: "レベル {level}", problemCount: "5問"
  },
  en: { ...common,
    title: "Cube Blueprint", instruction: "Build the one solid that matches the top, front, and right-side blueprints.",
    modelTitle: "My Solid", answerTitle: "Three-View Blueprint", cardsTitle: "Blueprints", buildPrompt: "Tap the top-view cells to set each column height.",
    viewFront: "Front View", viewSide: "Right View", viewTop: "Top View", check: "Check", clear: "Clear",
    front: "Front", side: "Right", top: "Top", free: "Rotate", revealShow: "Right", example: "Example", hint: "Hint", reset: "Retry", next: "Next", level: "Choose Level", height: "Height",
    progress: "Level {level} · {current}/{total}", blueprintWrong: "One blueprint still does not match. Check the cards outlined in red.", blueprintEmpty: "Tap a top-view cell to place cubes first.",
    guideStart: "Use the three blueprints to build the solid.", guideBuild: "Use the top view for positions and the front and right views for heights.", guideHint: "Use only filled top-view cells, then compare the front and right heights.", guideSuccess: "Perfect! You found the single solid that matches all three blueprints.",
    tutorialBlueprint1: "The blueprint shows the top, front, and right views together.", tutorialBlueprint2: "Tap a top-view cell to raise that column one level.", tutorialBlueprint3: "Only one solid matches all three views. Tap Check when you finish!",
    tutorialNext: "Next", tutorialStart: "Start", audioOn: "Voice on", audioOff: "Voice", docssam: "Cubi", close: "Close", levelName: "Level {level}", problemCount: "5 challenges"
  }
};

export function text(lang, key) {
  return messages[lang]?.[key] ?? messages.ko[key] ?? key;
}
