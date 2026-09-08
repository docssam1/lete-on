export const COPY = {
  ko: {
    title:"원 탐구", brand:"GFIELD 학습지", worksheet:"학습지", activity:"활동", count:"문항 수", language:"언어", cover:"표지", answers:"정답·풀이", all:"전체 활동",
    back:"원 게임으로", refresh:"다음 회차", print:"인쇄", retry:"다시 불러오기", loading:"학습지를 불러오는 중입니다.", error:"학습지를 불러오지 못했습니다.", unavailable:"선택한 활동을 찾을 수 없습니다.",
    name:"이름", date:"날짜", contents:"학습 순서", sample:"원의 중심과 반지름", center:"중심", radius:"반지름",
    convention:"원 위의 모든 점은 중심에서 같은 거리에 있습니다.", learnerFit:"학습 준비", criteria:"점판의 점을 읽고, cm 단위를 알며, 두 배와 반을 구할 수 있어요.",
    enrichment:"원의 중심, 반지름, 지름을 알아보고 컴퍼스로 원을 그려요.",
    select:"조건에 맞는 그림을 모두 골라 표시하세요.", mark:"원의 중심인 점에 표시하세요.", draw:"점 O에 컴퍼스 바늘을 놓고 주어진 반지름으로 원을 그리세요.",
    reason:"생각한 방법", working:"풀이 공간", answer:"정답", measure:"길이", grid:"이웃한 점 사이: 1 cm", printScale:"A4 · 실제 크기(100%)",
    descriptions:{center:"원의 중심 찾기",parts:"반지름과 지름 구별하기",measure:"반지름과 지름의 길이 관계",draw:"중심과 반지름에 맞게 원 그리기"},
    questions:(n)=>n+"문항", total:(n,p)=>n+"문항 · "+p+"쪽"
  },
  en: {
    title:"Circle Studio", brand:"GFIELD Worksheets", worksheet:"Worksheet", activity:"Activity", count:"Questions", language:"Language", cover:"Cover", answers:"Answers", all:"All activities",
    back:"Circle game", refresh:"Next round", print:"Print", retry:"Reload", loading:"Loading worksheet.", error:"The worksheet could not be loaded.", unavailable:"This activity is unavailable.",
    name:"Name", date:"Date", contents:"Learning sequence", sample:"Center and radius", center:"Center", radius:"Radius",
    convention:"Every point on a circle is the same distance from its center.", learnerFit:"Ready to learn", criteria:"Read grid points, use cm, and find doubles and halves.",
    enrichment:"Explore the center, radius and diameter, then draw circles with a compass.",
    select:"Tick every diagram that meets the condition.", mark:"Mark the grid point at the center of the circle.", draw:"Place the compass point at O. Draw a circle with the given radius.",
    reason:"My reasoning", working:"Working space", answer:"Answer", measure:"Length", grid:"Adjacent grid points: 1 cm", printScale:"A4 · Actual size (100%)",
    descriptions:{center:"Find the center",parts:"Identify radii and diameters",measure:"Relate radius and diameter lengths",draw:"Draw with a given center and radius"},
    questions:(n)=>n+" questions", total:(n,p)=>n+" questions · "+p+" pages"
  },
  zh: {
    title:"圆的探索", brand:"GFIELD 学习单", worksheet:"学习单", activity:"活动", count:"题数", language:"语言", cover:"封面", answers:"答案与解析", all:"全部活动",
    back:"圆的游戏", refresh:"下一轮", print:"打印", retry:"重新加载", loading:"正在加载学习单。", error:"无法加载学习单。", unavailable:"找不到所选活动。",
    name:"姓名", date:"日期", contents:"学习顺序", sample:"圆心与半径", center:"圆心", radius:"半径",
    convention:"圆上所有点到圆心的距离都相等。", learnerFit:"学习准备", criteria:"能读懂点阵，认识厘米，并能求两倍和一半。",
    enrichment:"认识圆心、半径和直径，再用圆规画圆。",
    select:"勾选所有符合条件的图。", mark:"在圆心所在的格点上做标记。", draw:"把圆规针尖放在 O 点，以给定的半径画圆。",
    reason:"我的思路", working:"解题空间", answer:"答案", measure:"长度", grid:"相邻格点间距：1 cm", printScale:"A4 · 实际大小（100%）",
    descriptions:{center:"寻找圆心",parts:"区分半径与直径",measure:"半径与直径的长度关系",draw:"根据圆心和半径画圆"},
    questions:(n)=>n+"题", total:(n,p)=>n+"题 · "+p+"页"
  },
  ja: {
    title:"円の探究", brand:"GFIELD 学習プリント", worksheet:"学習プリント", activity:"活動", count:"問題数", language:"言語", cover:"表紙", answers:"答えと解説", all:"すべての活動",
    back:"円のゲームへ", refresh:"次の回", print:"印刷", retry:"再読み込み", loading:"プリントを読み込んでいます。", error:"プリントを読み込めませんでした。", unavailable:"選んだ活動が見つかりません。",
    name:"名前", date:"日付", contents:"学習の順序", sample:"円の中心と半径", center:"中心", radius:"半径",
    convention:"円の上のどの点も、中心からの距離は同じです。", learnerFit:"学習の準備", criteria:"点の位置と cm の単位がわかり、2倍と半分を求められます。",
    enrichment:"中心・半径・直径を調べ、コンパスで円をかきます。",
    select:"条件に合う図をすべて選んでチェックしましょう。", mark:"円の中心にあたる点に印をつけましょう。", draw:"コンパスの針を点 O に置き、指定された半径の円をかきましょう。",
    reason:"考えた方法", working:"考えを書く欄", answer:"答え", measure:"長さ", grid:"となり合う点の間：1 cm", printScale:"A4 · 実際のサイズ（100%）",
    descriptions:{center:"円の中心を見つける",parts:"半径と直径を見分ける",measure:"半径と直径の長さの関係",draw:"中心と半径に合わせて円をかく"},
    questions:(n)=>n+"問", total:(n,p)=>n+"問 · "+p+"ページ"
  }
};
