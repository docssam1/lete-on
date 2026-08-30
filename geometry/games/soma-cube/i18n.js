const copy = {
  ko: {
    brand:"소마큐브 공방", level:"단계", target:"만들 모양", build:"내가 만든 모양", tray:"조각 보관함",
    hint:"힌트", clear:"비우기", skip:"다음 문제", levelPick:"단계를 골라요", pieces:"{done}/{total}조각", rotateActions:["옆으로 돌리기","위로 돌리기","뒤집기"],
    targetViewerLabel:"목표 입체 3차원 보기. 단위정육면체 {count}개로 이루어져 있어요.", buildViewerLabel:"내가 만든 입체 3차원 보기. {done}/{total}조각을 놓았어요.", choiceLabel:"보기 {number}", pieceLabel:"소마 조각 {id} 선택", soundOn:"소리 끄기", soundOff:"소리 켜기",
    selectPiece:"조각을 먼저 골라 주세요.", selectPlace:"옅게 빛나는 자리를 눌러 놓아 보세요.", invalid:"그 자리에는 놓을 수 없어요.", removed:"조각을 보관함으로 돌려놓았어요.",
    solved:"모든 조각이 빈틈없이 맞았어요!", twoWaysSolved:"서로 다른 두 가지 방법으로 완성했어요!", firstWaySolved:"첫 번째 방법 성공! 잠시 후 다른 방법으로 다시 만들어요.", secondWayPrompt:"첫 번째와 다른 위치와 방향으로 다시 완성해 보세요.", wrongChoice:"돌려 보면 다른 조각이에요.", correctChoice:"맞아요. 돌려도 같은 조각이에요!", anotherWay:"첫 번째 방법과 같아요. 마지막 조각의 위치를 바꿔 보세요.",
    hintText:"반짝이는 조각과 자리를 살펴보세요.", clearConfirm:"고정된 조각을 빼고 모두 비울까요?", skipConfirm:"이 문제는 포인트 없이 넘어갈까요?",
    rotate:"가로로 돌려 주세요", exit:"마을로 나가기", nextLevel:"다음 단계", practice:"같은 단계 더 풀기", district:"입체 지구로",
    completeTitle:"한 회차 완성!", completeText:"다섯 문제를 끝냈어요. 다음 단계로 갈까요?",
    tutorialSkip:"건너뛰기", tutorialNext:"다음", tutorialDone:"시작하기",
    tutorial:["소마큐브는 서로 다른 일곱 조각으로 입체를 만드는 퍼즐이에요.","아래 조각을 고른 뒤 옆으로 돌리기, 위로 돌리기, 뒤집기로 방향을 바꿔요.","옅게 빛나는 자리를 누르면 조각이 놓여요. 놓은 조각을 누르면 다시 보관함으로 돌아와요."],
    prompts:["돌려도 같은 조각을 찾아보세요.","두 조각을 돌려 왼쪽 모양과 똑같이 만드세요.","서로 다른 세 조각으로 왼쪽과 같은 모양을 만드세요.","고정된 조각을 살펴보고 빈 큐브를 채우세요.","먼저 일곱 조각 큐브를 한 가지 방법으로 완성하세요."],
    stageNames:["키즈","Pre","입문","초급","중급"], difficultyLabels:{하:"하",중:"중",상:"상"}, levelTitles:["같은 조각 찾기","두 조각 맞추기","다른 조각, 같은 모양","빈 큐브 채우기","두 가지 조립법"], levelDescriptions:["돌려도 같은 조각을 찾아요.","두 조각으로 작은 입체를 만들어요.","서로 다른 세 조각으로 같은 모양을 만들어요.","일부가 채워진 3×3×3 큐브를 완성해요.","일곱 조각 큐브를 서로 다른 두 방법으로 완성해요."]
  },
  en: {
    brand:"Soma Cube Workshop", level:"Stages", target:"Target", build:"Your build", tray:"Piece tray",
    hint:"Hint", clear:"Clear", skip:"Next", levelPick:"Choose a stage", pieces:"{done}/{total} pieces", rotateActions:["Side turn","Up turn","Flip"],
    targetViewerLabel:"3D target made of {count} unit cubes.", buildViewerLabel:"3D build with {done} of {total} pieces placed.", choiceLabel:"Choice {number}", pieceLabel:"Select Soma piece {id}", soundOn:"Mute sound", soundOff:"Turn sound on",
    selectPiece:"Choose a piece first.", selectPlace:"Tap a softly glowing valid place.", invalid:"That piece cannot go there.", removed:"The piece returned to the tray.",
    solved:"Every piece fits with no gaps!", twoWaysSolved:"You completed two different assemblies!", firstWaySolved:"First assembly complete! Now rebuild it a different way.", secondWayPrompt:"Complete the cube again with different piece positions and directions.", wrongChoice:"It becomes a different piece when turned.", correctChoice:"Yes. It is the same piece after rotation!", anotherWay:"That matches your first assembly. Move the last piece and try another way.",
    hintText:"Look at the glowing piece and place.", clearConfirm:"Clear every movable piece?", skipConfirm:"Skip this problem without points?",
    rotate:"Turn your device sideways", exit:"Exit to district", nextLevel:"Next stage", practice:"More at this stage", district:"Solids district",
    completeTitle:"Session complete!", completeText:"You finished five problems. Move to the next stage?",
    tutorialSkip:"Skip", tutorialNext:"Next", tutorialDone:"Start",
    tutorial:["A Soma cube puzzle builds solids with seven different pieces.","Choose a piece, then use Turn sideways, Turn upward, or Flip to change its direction.","Tap a softly glowing valid place. Tap a placed piece to return it to the tray."],
    prompts:["Find the same piece after rotation.","Turn two pieces to copy the target.","Use three different pieces to make the same target.","Study the fixed pieces and fill the cube.","First, complete the 3×3×3 cube one way."],
    stageNames:["Kids","Pre","Starter","Elementary","Intermediate"], difficultyLabels:{하:"Easy",중:"Medium",상:"Hard"}, levelTitles:["Find the Same Piece","Fit Two Pieces","Different Pieces, Same Solid","Fill the Cube","Two Assemblies"], levelDescriptions:["Recognize a piece after rotation.","Build a small solid with two pieces.","Build the same target with three different pieces.","Complete a partly filled 3×3×3 cube.","Complete the seven-piece cube in two different ways."]
  },
  zh: {
    brand:"索玛立方工坊", level:"阶段", target:"目标形状", build:"我的作品", tray:"拼块托盘", hint:"提示", clear:"清空", skip:"下一题", levelPick:"选择阶段", pieces:"{done}/{total}块", rotateActions:["侧转","上转","翻转"], targetViewerLabel:"由{count}个单位立方体组成的三维目标。", buildViewerLabel:"三维作品，已放置{done}/{total}块。", choiceLabel:"选项{number}", pieceLabel:"选择索玛拼块{id}", soundOn:"关闭声音", soundOff:"打开声音",
    selectPiece:"请先选择一个拼块。", selectPlace:"点击淡淡发光的可放位置。", invalid:"这里不能放。", removed:"拼块已放回托盘。", solved:"所有拼块严丝合缝！", twoWaysSolved:"你用两种不同方法完成了立方体！", firstWaySolved:"第一种拼法完成！接着换一种方法再拼。", secondWayPrompt:"请用不同的位置和方向再次完成立方体。", wrongChoice:"转动后会发现是不同的拼块。", correctChoice:"对！转动后还是同一个拼块。", hintText:"看看发光的拼块和位置。", clearConfirm:"清空所有可移动拼块吗？", skipConfirm:"不计分跳过这题吗？", rotate:"请横放设备", exit:"返回立体区", nextLevel:"下一阶段", practice:"同阶段再练", district:"返回立体区", completeTitle:"本轮完成！", completeText:"完成了五题。要进入下一阶段吗？", tutorialSkip:"跳过", tutorialNext:"下一步", tutorialDone:"开始", tutorial:["索玛立方用七个不同拼块组成各种立体。","先选择下方拼块，再用向侧面旋转、向上旋转或翻转来改变方向。","点击淡淡发光的位置放下拼块。点击已放拼块可收回托盘。"], prompts:["找出旋转后相同的拼块。","旋转两个拼块，搭成左边的形状。","用三个不同拼块搭成同样的目标形状。","观察固定拼块，填满立方体。","先用一种方法完成七块立方体。"], stageNames:["儿童","Pre","入门","初级","中级"]
  },
  ja: {
    brand:"ソーマキューブ工房", level:"段階", target:"作る形", build:"自分の形", tray:"ピース置き場", hint:"ヒント", clear:"空にする", skip:"次の問題", levelPick:"段階を選ぼう", pieces:"{done}/{total}ピース", rotateActions:["横回転","上回転","裏返す"], targetViewerLabel:"単位立方体{count}個でできた3Dの目標。", buildViewerLabel:"{total}ピース中{done}ピースを置いた3D作品。", choiceLabel:"選択肢{number}", pieceLabel:"ソーマピース{id}を選ぶ", soundOn:"音を消す", soundOff:"音を出す",
    selectPiece:"先にピースを選んでください。", selectPlace:"うすく光る場所をタップしてください。", invalid:"そこには置けません。", removed:"ピースをトレイに戻しました。", solved:"すき間なく全部入りました！", twoWaysSolved:"2つの違う組み方で完成しました！", firstWaySolved:"1つ目の組み方が完成！次は別の方法で作ります。", secondWayPrompt:"ピースの位置と向きを変えて、もう一度完成させましょう。", wrongChoice:"回してみると別のピースです。", correctChoice:"正解！回しても同じピースです。", hintText:"光っているピースと場所を見てください。", clearConfirm:"動かせるピースを全部戻しますか？", skipConfirm:"ポイントなしで次へ進みますか？", rotate:"横向きにしてください", exit:"エリアへ戻る", nextLevel:"次の段階", practice:"同じ段階を続ける", district:"立体エリアへ", completeTitle:"1回分クリア！", completeText:"5問終わりました。次の段階へ進みますか？", tutorialSkip:"スキップ", tutorialNext:"次へ", tutorialDone:"始める", tutorial:["ソーマキューブは7つの違うピースで立体を作るパズルです。","下のピースを選び、横に回す・上に回す・裏返すボタンで向きを変えます。","うすく光る場所をタップして置きます。置いたピースをタップするとトレイへ戻ります。"], prompts:["回転しても同じピースを探しましょう。","2つのピースで左と同じ形を作りましょう。","3つの違うピースで同じ目標の形を作りましょう。","固定されたピースを見て立方体を埋めましょう。","まず1つの方法で7ピースの立方体を完成させましょう。"], stageNames:["キッズ","Pre","入門","初級","中級"]
  }
};
copy.zh.anotherWay = "这和之前的拼法相同。请移动最后一个拼块，寻找另一种拼法。";
copy.zh.levelTitles = ["寻找相同拼块","两个拼块","不同拼块，相同形状","填满立方体","两种拼法"];
copy.zh.levelDescriptions = ["判断旋转后的相同拼块。","用两个拼块搭成小立体。","用三个不同拼块搭成相同目标。","完成部分填好的3×3×3立方体。","用两种不同方法完成七块立方体。"];
copy.zh.difficultyLabels = {하:"下",중:"中",상:"上"};
copy.ja.anotherWay = "前と同じ組み方です。最後のピースを動かして別の方法を探しましょう。";
copy.ja.levelTitles = ["同じピース探し","2ピース組み立て","違うピース、同じ形","立方体を埋める","2つの組み方"];
copy.ja.levelDescriptions = ["回転後も同じピースを見分けます。","2つのピースで小さな立体を作ります。","違う3ピースで同じ形を作ります。","一部が入った3×3×3を完成します。","7ピースの立方体を2つの違う方法で完成します。"];
copy.ja.difficultyLabels = {하:"やさしい",중:"ふつう",상:"むずかしい"};

export function getLanguage() {
  const profile = JSON.parse(localStorage.getItem("gfield-profile") || "{}");
  const language = profile.language || localStorage.getItem("gfield-language") || "ko";
  return copy[language] ? language : "ko";
}

export function t(language, name, values = {}) {
  let value = copy[language]?.[name] ?? copy.ko[name] ?? name;
  Object.entries(values).forEach(([key, replacement]) => { value = String(value).replaceAll(`{${key}}`, String(replacement)); });
  return value;
}
