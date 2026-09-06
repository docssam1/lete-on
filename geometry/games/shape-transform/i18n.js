export const messages = {
  ko: {
    workshop:"도형 변환 공방", garden:"도형 정원", domains:"학습 영역", target:"기준 도형", choice:"보기", example:"생각 열기",
    principle:"오늘의 원리", hint:"생각 단서", retry:"다시 풀기", worksheet:"학습지", next:"다음 문제", finish:"학습 마치기",
    observe:"모양을 살펴보세요", correct:"이유까지 확인해요", review:"변화를 확인해요", replay:"다시 보기",
    before:"처음", after:"결과", same:"포개어 비교", difference:"다른 부분", move:"이동", right:"오른쪽", left:"왼쪽", up:"위", down:"아래",
    cells:"{n}칸", clockwise:"시계 방향으로 반의 반 바퀴 · 90°", counterclockwise:"반시계 방향으로 반의 반 바퀴 · 90°", halfturn:"시계 방향으로 반 바퀴 · 180°",
    enlarge:"가로·세로 길이 2배", reduce:"가로·세로 길이 절반", center:"중심", complete:"한 영역을 끝까지 살펴봤어요",
    solved:"{n}문제 완료", helped:"다시 살펴본 문제 {n}개", practice:"한 번 더 연습", nextDomain:"다음 영역", close:"닫기",
    soundOn:"소리 켜기", soundOff:"소리 끄기", edge:"대응하는 변", reasoning:"무엇이 달라졌나요?",
    domainsData:[
      {title:"모양 관찰",goal:"꺾인 구간의 위치와 길이를 비교해요.",prompt:"기준과 정확히 같은 모양을 고르세요.",rule:"크기와 방향은 같아요. 꺾인 구간이 같은 위치에 있는지 살펴봐요.",hint:"꺾인 곳을 하나씩 따라가며 앞뒤 선의 길이를 비교해 보세요.",wrong:"꺾인 구간의 위치와 앞뒤 선의 길이를 함께 비교해 보세요.",proof:"크기나 방향을 바꾸지 않고 포개면 모든 선이 겹쳐요."},
      {title:"평행이동",goal:"모든 점을 같은 방향으로 같은 거리만큼 옮겨요.",prompt:"표시된 방향과 칸 수만큼 옮긴 도형을 고르세요.",rule:"평행이동해도 모양, 크기, 방향은 바뀌지 않아요.",hint:"표시한 꼭짓점부터 가로와 세로 칸 수를 각각 세어 보세요.",wrong:"모양만 보지 말고, 표시한 점이 도착한 위치를 확인하세요.",proof:"처음의 모든 점이 같은 방향과 거리만큼 옮겨졌어요."},
      {title:"회전",goal:"중심을 정하고 방향과 회전량을 따라가요.",prompt:"표시된 중심 둘레로 돌렸을 때의 도형을 고르세요.",rule:"중심은 그대로이고, 각 점은 중심에서 같은 거리를 유지하며 돌아요.",hint:"중심과 빨간 점을 이은 선을 지정된 방향으로 돌려 보세요.",wrong:"중심을 그대로 두고, 방향과 회전량을 다시 확인하세요.",proof:"중심은 움직이지 않고 도형 전체가 같은 만큼 돌아갔어요."},
      {title:"확대",goal:"대응하는 가로·세로 길이를 모두 2배로 해요.",prompt:"표시한 기준점에서 가로·세로 길이를 모두 2배로 늘린 도형을 고르세요.",rule:"가로만 늘리지 않아요. 모든 변의 길이를 2배로 해요.",hint:"짧은 가로변 하나와 세로변 하나의 칸 수를 각각 비교하세요.",wrong:"가로와 세로가 모두 2배가 되었는지 확인하세요.",proof:"가로변도 세로변도 2배가 되어 전체 모양이 유지돼요."},
      {title:"줄이기",goal:"대응하는 가로·세로 길이를 모두 절반으로 해요.",prompt:"표시한 기준점에서 가로·세로 길이를 모두 절반으로 줄인 도형을 고르세요.",rule:"가로와 세로를 함께 절반으로 줄여야 모양이 유지돼요.",hint:"2칸이 1칸으로, 4칸이 2칸으로 바뀌는지 확인하세요.",wrong:"한 방향만 줄지 않았는지 가로·세로를 함께 비교하세요.",proof:"모든 변의 길이가 절반이 되어 원래 모양이 유지돼요."}
    ]
  },
  en:{
    workshop:"Transform Workshop",garden:"Shape Garden",domains:"Learning areas",target:"Target",choice:"Choice",example:"Explore the idea",
    principle:"Key idea",hint:"Clue",retry:"Try again",worksheet:"Worksheet",next:"Next problem",finish:"Finish",observe:"Look closely",
    correct:"Check your reasoning",review:"See what changes",replay:"Replay",before:"Before",after:"After",same:"Compare by overlay",difference:"Different part",
    move:"Move",right:"Right",left:"Left",up:"Up",down:"Down",cells:"{n} cells",clockwise:"Clockwise quarter turn · 90°",counterclockwise:"Counterclockwise quarter turn · 90°",halfturn:"Clockwise half turn · 180°",
    enlarge:"Double width and height",reduce:"Half width and height",center:"Center",complete:"You explored this learning area",
    solved:"{n} problems completed",helped:"{n} problems revisited",practice:"Practise again",nextDomain:"Next area",close:"Close",soundOn:"Sound on",soundOff:"Sound off",edge:"Matching edge",reasoning:"What changed?",
    domainsData:[
      {title:"Observe Shapes",goal:"Compare bend positions and lengths.",prompt:"Choose exactly the same shape.",rule:"Size and orientation stay the same. Compare the position of each bend.",hint:"Trace each bend and compare the lengths of nearby lines.",wrong:"Compare the bend positions and nearby line lengths.",proof:"Every line matches when overlaid without resizing or turning."},
      {title:"Translation",goal:"Move every point the same distance in the same direction.",prompt:"Choose the shape moved by the indicated number of cells.",rule:"A slide preserves the shape, size, and orientation.",hint:"Count horizontal and vertical cells from the marked point.",wrong:"Check where the marked point ends up, not just the shape.",proof:"Every point moves the same distance and direction."},
      {title:"Rotation",goal:"Follow a turn around a fixed center.",prompt:"Choose the shape after the shown turn around the marked center.",rule:"The center stays still. Each point stays the same distance from it.",hint:"Imagine a line from the center to the marked point, then turn it.",wrong:"Keep the center fixed and check the turn direction.",proof:"The center stays fixed while the whole shape turns equally."},
      {title:"Enlargement",goal:"Double every horizontal and vertical length.",prompt:"Choose the shape with all lengths doubled about the marked point.",rule:"Double every edge, not just the width.",hint:"Compare one horizontal and one vertical edge.",wrong:"Check that both width and height are doubled.",proof:"Every edge doubles, preserving the shape."},
      {title:"Reduction",goal:"Halve every horizontal and vertical length.",prompt:"Choose the shape with all lengths halved about the marked point.",rule:"Halve width and height together to preserve the shape.",hint:"Check that 2 cells become 1 and 4 become 2.",wrong:"Compare both width and height.",proof:"Every edge halves, preserving the shape."}
    ]
  },
  zh:{
    workshop:"图形变换工坊",garden:"图形花园",domains:"学习领域",target:"基准图形",choice:"选项",example:"想一想",
    principle:"今天的原理",hint:"思考线索",retry:"重新做",worksheet:"练习纸",next:"下一题",finish:"完成学习",observe:"仔细观察",
    correct:"确认理由",review:"观察变化",replay:"再看一次",before:"开始",after:"结果",same:"重叠比较",difference:"不同的部分",
    move:"移动",right:"右",left:"左",up:"上",down:"下",cells:"{n}格",clockwise:"顺时针转四分之一圈 · 90°",counterclockwise:"逆时针转四分之一圈 · 90°",halfturn:"顺时针转半圈 · 180°",
    enlarge:"横向和纵向长度2倍",reduce:"横向和纵向长度一半",center:"中心",complete:"你完成了这个学习领域",
    solved:"完成{n}题",helped:"重新观察了{n}题",practice:"再练一次",nextDomain:"下一个领域",close:"关闭",soundOn:"开启声音",soundOff:"关闭声音",edge:"对应的边",reasoning:"哪里发生了变化？",
    domainsData:[
      {title:"图形观察",goal:"比较拐弯的位置和长度。",prompt:"选择完全相同的图形。",rule:"大小和方向不变，比较每个拐弯的位置。",hint:"沿着每个拐弯，比较相邻线段的长度。",wrong:"一起比较拐弯的位置和相邻线段的长度。",proof:"不改变大小和方向，重叠后每条线都重合。"},
      {title:"平移",goal:"每个点向同方向移动相同距离。",prompt:"选择按指定方向和格数移动的图形。",rule:"平移不改变形状、大小和方向。",hint:"从标记点分别数横向和纵向的格数。",wrong:"确认标记点到达的位置。",proof:"每个点都向同一方向移动相同距离。"},
      {title:"旋转",goal:"围绕固定中心按方向旋转。",prompt:"选择绕标记中心按提示旋转的图形。",rule:"中心不动，各点到中心的距离不变。",hint:"想象中心到标记点的线，然后旋转。",wrong:"保持中心不动，重新确认旋转方向。",proof:"中心不动，整个图形旋转相同角度。"},
      {title:"放大",goal:"所有横向和纵向长度都变成2倍。",prompt:"选择以标记点为基准把所有长度变成2倍的图形。",rule:"不只是横向，所有边都变成2倍。",hint:"分别比较一条横边和一条竖边。",wrong:"确认宽和高都变成2倍。",proof:"所有边都变成2倍，形状保持不变。"},
      {title:"缩小",goal:"所有横向和纵向长度都变成一半。",prompt:"选择以标记点为基准把所有长度变成一半的图形。",rule:"宽和高一起减半，形状才能保持不变。",hint:"确认2格变成1格、4格变成2格。",wrong:"同时比较宽和高。",proof:"所有边都变成一半，形状保持不变。"}
    ]
  },
  ja:{
    workshop:"図形変換工房",garden:"図形の庭",domains:"学習分野",target:"もとの図形",choice:"選択肢",example:"考えてみよう",
    principle:"今日の原理",hint:"手がかり",retry:"やり直す",worksheet:"プリント",next:"次の問題",finish:"学習を終える",observe:"よく見よう",
    correct:"理由も確かめよう",review:"変化を確かめよう",replay:"もう一度見る",before:"はじめ",after:"結果",same:"重ねて比べる",difference:"違う部分",
    move:"移動",right:"右",left:"左",up:"上",down:"下",cells:"{n}マス",clockwise:"時計回りに4分の1回転 · 90°",counterclockwise:"反時計回りに4分の1回転 · 90°",halfturn:"時計回りに半回転 · 180°",
    enlarge:"縦と横の長さを2倍",reduce:"縦と横の長さを半分",center:"中心",complete:"この分野を最後まで学びました",
    solved:"{n}問完了",helped:"見直した問題 {n}問",practice:"もう一度練習",nextDomain:"次の分野",close:"閉じる",soundOn:"音を出す",soundOff:"音を消す",edge:"対応する辺",reasoning:"何が変わりましたか？",
    domainsData:[
      {title:"図形の観察",goal:"曲がる位置と長さを比べます。",prompt:"まったく同じ形を選びましょう。",rule:"大きさと向きは同じです。曲がる位置を比べましょう。",hint:"曲がる部分をたどって前後の線の長さを比べましょう。",wrong:"曲がる位置と前後の線の長さを比べましょう。",proof:"大きさや向きを変えずに重ねると、すべての線が重なります。"},
      {title:"平行移動",goal:"すべての点を同じ向きに同じ距離動かします。",prompt:"指定された向きとマス数だけ動かした図形を選びましょう。",rule:"平行移動では形、大きさ、向きは変わりません。",hint:"印の点から横と縦のマス数を数えましょう。",wrong:"印の点が着く位置を確かめましょう。",proof:"すべての点が同じ向きに同じ距離動きます。"},
      {title:"回転",goal:"動かない中心のまわりに回します。",prompt:"印の中心のまわりに指定された分だけ回した図形を選びましょう。",rule:"中心は動かず、各点と中心の距離は変わりません。",hint:"中心と印の点をつなぐ線を思い浮かべて回しましょう。",wrong:"中心を動かさずに回す向きを確認しましょう。",proof:"中心は動かず、図形全体が同じ分だけ回ります。"},
      {title:"拡大",goal:"縦と横のすべての長さを2倍にします。",prompt:"印の点を基準に、すべての長さを2倍にした図形を選びましょう。",rule:"横だけでなく、すべての辺を2倍にします。",hint:"横の辺と縦の辺を一つずつ比べましょう。",wrong:"縦と横がどちらも2倍か確かめましょう。",proof:"すべての辺が2倍になり、形が保たれます。"},
      {title:"縮小",goal:"縦と横のすべての長さを半分にします。",prompt:"印の点を基準に、すべての長さを半分にした図形を選びましょう。",rule:"縦と横を一緒に半分にすると形が保たれます。",hint:"2マスが1マス、4マスが2マスになるか確かめましょう。",wrong:"縦と横を一緒に比べましょう。",proof:"すべての辺が半分になり、形が保たれます。"}
    ]
  }
};

export function translation(language) {
  const copy = messages[language] || messages.ko;
  const t = (key, vars = {}) => Object.entries(vars).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, String(value)), copy[key] || messages.ko[key] || key);
  return { t, domains: copy.domainsData };
}

export function operationLabel(problem, t) {
  const op = problem.operation;
  if (op.kind === "same-bends") return t("same");
  if (op.kind === "translate") return [[op.dx, "right", "left"], [op.dy, "down", "up"]]
    .filter(([value]) => value)
    .map(([value, positive, negative]) => `${t(value > 0 ? positive : negative)} ${t("cells", { n: Math.abs(value) / 10 })}`).join(" · ");
  if (op.kind === "rotate") return t(op.angle === 90 ? "clockwise" : op.angle === -90 ? "counterclockwise" : "halfturn");
  return t(op.kind === "enlarge" ? "enlarge" : "reduce");
}
