import { syncEvolution, getEvolution, applyCharacterGlow, stageName, levelLabel, releaseColorLock } from "../shared/evolution.js?v=paper-fold-20260815a";

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  intro: $("#intro"),
  introVideo: $("#introVideo"),
  introSound: $("#introSound"),
  skipIntro: $("#skipIntro"),
  worldGate: $("#worldGate"),
  castle: $("#cubeCastle"),
  origami: $("#origamiStudio"),
  mirrorManor: $("#mirrorManor"),
  geoboardYard: $("#geoboardYard"),
  crystalPlaza: $("#crystalPlaza"),
  shapeGarden: $("#shapeGarden"),
  walkers: $("#walkers"),
  mapStage: $(".map-stage"),
  guide: $("#mapGuide"),
  guideName: $("#guideName"),
  moveHint: $("#mapMoveHint"),
  placePrompt: $("#placePrompt"),
  placePromptName: $("#placePromptName"),
  placePromptDescription: $("#placePromptDescription"),
  enterPlace: $("#enterPlace"),
  npcPrompt: $("#npcPrompt"),
  npcAvatar: $("#npcAvatar"),
  npcName: $("#npcName"),
  npcText: $("#npcText"),
  npcNext: $("#npcNext"),
  roadmapModal: $("#roadmapModal"),
  roadmapEyebrow: $("#roadmapEyebrow"),
  roadmapTitle: $("#roadmapTitle"),
  roadmapDescription: $("#roadmapDescription"),
  roadmapProgression: $("#roadmapProgression"),
  roadmapStages: $("#roadmapStages"),
  roadmapNote: $("#roadmapNote"),
  roadmapStatus: $("#roadmapStatus"),
  roadmapClose: $("#roadmapClose"),
  sound: $("#soundToggle"),
  profileButton: $("#profileButton"),
  profileAvatar: $("#profileAvatar"),
  toolbarName: $("#toolbarName"),
  characterModal: $("#characterModal"),
  closeCharacter: $("#closeCharacter"),
  selectedSprite: $("#selectedSprite"),
  selectedName: $("#selectedName"),
  selectedRole: $("#selectedRole"),
  equippedItems: $("#equippedItems"),
  playerName: $("#playerName"),
  nameHint: $("#nameHint"),
  saveProfile: $("#saveProfile"),
  characterGrid: $("#characterGrid"),
  colorPalette: $("#colorPalette"),
  itemCategories: $("#itemCategories"),
  itemGrid: $("#itemGrid")
};

const characters = [
  { id: "cubi", name: "큐비", sprite: 0, role: "Cube Town Guide" },
  { id: "orbi", name: "오르비", sprite: 1, role: "Sphere Garden Explorer" },
  { id: "pyra", name: "파이라", sprite: 2, role: "Pyramid Peak Keeper" },
  { id: "cylo", name: "사일로", sprite: 3, role: "Cylinder Harbor Captain" },
  { id: "recto", name: "렉토", sprite: 4, role: "Solid Block Builder" },
  { id: "arco", name: "아르코", sprite: 5, role: "Angle Lab Scholar" },
  { id: "coni", name: "코니", sprite: 6, role: "Cone Valley Ranger" },
  { id: "pris", name: "프리즈", sprite: 7, role: "Prism Light Runner" },
  { id: "nova", name: "노바", sprite: 8, role: "Compass Trail Finder" },
  { id: "foldy", name: "폴디", sprite: 9, role: "Origami Studio Guide" }
];

const places = [
  { id: "cubeCastle", element: elements.castle, entrance: { x: 24, y: 46 }, href: "../cube-town/", nameKey: "cubeTown", descriptionKey: "cubeTownHint" },
  { id: "origamiStudio", element: elements.origami, entrance: { x: 47, y: 49 }, href: "../origami-studio/", nameKey: "origamiStudio", descriptionKey: "origamiStudioHint" },
  { id: "mirrorManor", element: elements.mirrorManor, entrance: { x: 63, y: 48 }, href: "../games/mirror-manor/", nameKey: "mirrorManor", descriptionKey: "mirrorManorHint" },
  { id: "geoboardYard", element: elements.geoboardYard, entrance: { x: 84, y: 51 }, href: "../games/geoboard/", nameKey: "geoboardYard", descriptionKey: "geoboardYardHint" },
  { id: "crystalPlaza", element: elements.crystalPlaza, entrance: { x: 32, y: 64 }, href: "../lab/index.html", nameKey: "geometryLab", descriptionKey: "geometryLabHint" },
  { id: "shapeGarden", element: elements.shapeGarden, entrance: { x: 53, y: 76 }, href: "../shape-garden/", nameKey: "shapeGarden", descriptionKey: "shapeGardenHint" }
];

const districtPlaces = [
  { id: "spatialDistrict", nameKey: "spatialDistrict", descriptionKey: "spatialDistrictHint", roadmap: true },
  { id: "coordinateDistrict", nameKey: "coordinateDistrict", descriptionKey: "coordinateDistrictHint", roadmap: true }
];

const curriculumLevels = {
  ko: ["킨더", "키즈", "PRE", "입문", "초급", "중급"],
  zh: ["幼儿", "儿童", "PRE", "入门", "初级", "中级"],
  ja: ["キンダー", "キッズ", "PRE", "入門", "初級", "中級"],
  en: ["Kinder", "Kids", "PRE", "Starter", "Elementary", "Intermediate"]
};

const roadmapActivities = {
  shapeDistrict: {
    ko: ["모양 짝 찾기", "대칭 완성하기", "합동·뒤집기", "각과 다각형 탐구", "도형 이동·작도", "합동 조건·닮음"],
    zh: ["寻找相同图形", "完成对称图形", "全等与翻转", "探索角与多边形", "图形变换与作图", "全等条件与相似"],
    ja: ["形のペア探し", "対称を完成", "合同と裏返し", "角と多角形の探究", "図形の移動と作図", "合同条件と相似"],
    en: ["Match shape pairs", "Complete symmetry", "Congruence and flips", "Angles and polygons", "Transformations and construction", "Congruence rules and similarity"]
  },
  spatialDistrict: {
    ko: ["입체 모양 만나기", "쌓기와 방향", "전개도 맞추기", "여러 방향·단면", "회전체·겨냥도", "공간좌표·입체 추론"],
    zh: ["认识立体图形", "堆叠与方向", "匹配展开图", "多视图与截面", "旋转体与立体图", "空间坐标与立体推理"],
    ja: ["立体に出会う", "積み方と方向", "展開図を合わせる", "いろいろな方向と断面", "回転体と見取図", "空間座標と立体推理"],
    en: ["Meet solid shapes", "Stacking and direction", "Match nets", "Views and cross-sections", "Solids of revolution", "3D coordinates and reasoning"]
  },
  coordinateDistrict: {
    ko: ["위치 말하기", "모눈길 찾기", "좌표 읽기", "좌표로 도형 그리기", "평행·대칭 이동", "닮음·피타고라스"],
    zh: ["描述位置", "寻找方格路线", "读取坐标", "用坐标画图形", "平移与对称变换", "相似与勾股定理"],
    ja: ["位置を伝える", "方眼の道探し", "座標を読む", "座標で図形を描く", "平行移動と対称移動", "相似とピタゴラス"],
    en: ["Describe position", "Find grid paths", "Read coordinates", "Draw with coordinates", "Translations and reflections", "Similarity and Pythagoras"]
  }
};

const npcDialogue = {
  ko: {
    builder: ["쌓기나무 성에는 눈에 보이지 않는 블록도 숨어 있어.", "높이와 방향을 바꾸면 같은 블록도 전혀 다르게 보여."],
    folder: ["색종이는 접은 선을 따라 거꾸로 펼치면 답이 보여.", "한 번 접기부터 시작하면 대칭이 금방 눈에 들어와."],
    observer: ["거울 저택에서는 왼쪽과 오른쪽을 천천히 비교해 봐.", "중등 지구에는 합동과 닮음의 길도 이어질 거야."],
    explorer: ["지오메트리 월드는 계속 넓어져. 길 끝의 표지판을 찾아봐.", "좌표와 도형의 이동까지 배우면 새로운 지구가 열릴 거야."]
  },
  zh: {
    builder: ["积木城堡里还藏着看不见的积木。", "改变高度和方向，同样的积木也会看起来完全不同。"],
    folder: ["沿着折痕倒着展开，就能找到答案。", "从一次折叠开始，对称会很快变清楚。"],
    observer: ["在镜子庄园里慢慢比较左右两边。", "中学区域还会通往全等与相似的道路。"],
    explorer: ["几何世界会继续扩展，去找路尽头的路牌吧。", "学会坐标和图形变换后，新的区域会开启。"]
  },
  ja: {
    builder: ["つみき城には見えないブロックもかくれているよ。", "高さと向きを変えると、同じブロックもまったく違って見えるよ。"],
    folder: ["折り目をたどって逆に開くと答えが見えるよ。", "一回折りから始めると、対称がすぐ見えてくるよ。"],
    observer: ["鏡の館では左と右をゆっくり比べてみて。", "中学エリアには合同と相似の道も続くよ。"],
    explorer: ["ジオメトリーワールドはもっと広がるよ。道の先の看板を探してね。", "座標と図形の移動を学ぶと、新しいエリアが開くよ。"]
  },
  en: {
    builder: ["Some blocks in Cube Castle are hidden from view.", "Change the height or direction and the same blocks can look completely different."],
    folder: ["Unfold backward along the crease to reveal the answer.", "Start with one fold and symmetry soon becomes easy to see."],
    observer: ["At Mirror Manor, compare the left and right sides slowly.", "The middle-school district will lead to congruence and similarity too."],
    explorer: ["Geometry World will keep growing. Look for the signs at the ends of the paths.", "Learn coordinates and transformations to open new districts."]
  }
};
const npcNextLabel = { ko: "다음 이야기", zh: "下一句", ja: "つぎの話", en: "Next" };

const colors = [
  { id: "original", swatch: "swatch-original" },
  { id: "ocean", swatch: "swatch-ocean" },
  { id: "berry", swatch: "swatch-berry" },
  { id: "sunset", swatch: "swatch-sunset" },
  { id: "mono", swatch: "swatch-mono" }
];

const itemCategories = [
  { id: "hat", iconId: "cat-crown", label: { ko: "모자", zh: "帽子", ja: "ぼうし", en: "Hats" } },
  { id: "face", iconId: "cat-glasses", label: { ko: "얼굴", zh: "脸部", ja: "かお", en: "Face" } },
  { id: "badge", iconId: "cat-star", label: { ko: "배지", zh: "徽章", ja: "バッジ", en: "Badges" } },
  { id: "hand", iconId: "cat-wand", label: { ko: "소품", zh: "道具", ja: "こもの", en: "Props" } },
  { id: "aura", iconId: "cat-sparkles", label: { ko: "효과", zh: "特效", ja: "エフェクト", en: "Effects" } }
];

const items = [
  { id: "cap", category: "hat", iconId: "cat-hat", cost: 100, name: { ko: "탐험 모자", zh: "探险帽", ja: "たんけん帽", en: "Explorer Cap" } },
  { id: "crown", category: "hat", iconId: "cat-crown", cost: 400, name: { ko: "황금 왕관", zh: "金色王冠", ja: "金の王冠", en: "Golden Crown" } },
  { id: "helmet", category: "hat", iconId: "cat-helmet", cost: 220, name: { ko: "안전 헬멧", zh: "安全帽", ja: "ヘルメット", en: "Builder Helmet" } },
  { id: "wizard-hat", category: "hat", iconId: "cat-wizard", cost: 320, name: { ko: "마법사 모자", zh: "魔法帽", ja: "魔法の帽子", en: "Wizard Hat" } },
  { id: "flower-crown", category: "hat", iconId: "cat-flower", cost: 280, name: { ko: "꽃 왕관", zh: "花冠", ja: "花かんむり", en: "Flower Crown" } },

  { id: "glasses", category: "face", iconId: "cat-glasses", cost: 180, name: { ko: "둥근 안경", zh: "圆眼镜", ja: "丸めがね", en: "Round Glasses" } },
  { id: "star-glasses", category: "face", iconId: "cat-stars", cost: 240, name: { ko: "별 안경", zh: "星星眼镜", ja: "スターめがね", en: "Star Glasses" } },
  { id: "monocle", category: "face", iconId: "cat-monocle", cost: 220, name: { ko: "탐정 렌즈", zh: "侦探镜", ja: "探偵レンズ", en: "Detective Lens" } },
  { id: "mask", category: "face", iconId: "cat-mask", cost: 300, name: { ko: "변신 가면", zh: "变身面具", ja: "変身マスク", en: "Funny Mask" } },
  { id: "goggles", category: "face", iconId: "cat-goggles", cost: 260, name: { ko: "연구 고글", zh: "研究护目镜", ja: "研究ゴーグル", en: "Lab Goggles" } },

  { id: "star", category: "badge", iconId: "cat-star", cost: 0, name: { ko: "별 배지", zh: "星星徽章", ja: "星バッジ", en: "Star Badge" } },
  { id: "heart", category: "badge", iconId: "cat-heart", cost: 60, name: { ko: "마음 배지", zh: "爱心徽章", ja: "ハートバッジ", en: "Heart Badge" } },
  { id: "medal", category: "badge", iconId: "cat-medal", cost: 140, name: { ko: "도전 메달", zh: "挑战奖牌", ja: "チャレンジメダル", en: "Challenge Medal" } },
  { id: "gem", category: "badge", iconId: "cat-gem", cost: 220, name: { ko: "보석 배지", zh: "宝石徽章", ja: "宝石バッジ", en: "Gem Badge" } },
  { id: "compass", category: "badge", iconId: "cat-compass", cost: 260, name: { ko: "나침반 배지", zh: "指南针徽章", ja: "コンパスバッジ", en: "Compass Badge" } },

  { id: "wand", category: "hand", iconId: "cat-wand", cost: 260, name: { ko: "마법봉", zh: "魔法棒", ja: "魔法の杖", en: "Magic Wand" } },
  { id: "flag", category: "hand", iconId: "cat-flag", cost: 140, name: { ko: "탐험 깃발", zh: "探险旗", ja: "探検フラッグ", en: "Explorer Flag" } },
  { id: "telescope", category: "hand", iconId: "cat-telescope", cost: 240, name: { ko: "관찰 망원경", zh: "观察望远镜", ja: "観察望遠鏡", en: "Telescope" } },
  { id: "camera", category: "hand", iconId: "cat-camera", cost: 300, name: { ko: "작품 카메라", zh: "作品相机", ja: "作品カメラ", en: "Studio Camera" } },
  { id: "blueprint", category: "hand", iconId: "cat-blueprint", cost: 180, name: { ko: "설계 도구", zh: "设计工具", ja: "設計ツール", en: "Design Tool" } },

  { id: "sparkles", category: "aura", iconId: "cat-sparkles", cost: 180, name: { ko: "반짝 효과", zh: "闪亮特效", ja: "きらきら", en: "Sparkles" } },
  { id: "rainbow", category: "aura", iconId: "cat-rainbow", cost: 320, name: { ko: "무지개 효과", zh: "彩虹特效", ja: "虹エフェクト", en: "Rainbow" } },
  { id: "flame", category: "aura", iconId: "cat-flame", cost: 280, name: { ko: "열정 불꽃", zh: "热情火焰", ja: "情熱の炎", en: "Power Flame" } },
  { id: "snow", category: "aura", iconId: "cat-snow", cost: 250, name: { ko: "눈꽃 효과", zh: "雪花特效", ja: "雪エフェクト", en: "Snow Glow" } },
  { id: "galaxy", category: "aura", iconId: "cat-galaxy", cost: 450, name: { ko: "은하 효과", zh: "银河特效", ja: "銀河エフェクト", en: "Galaxy Aura" } }
];

const messages = {
  ko: {
    skipIntro: "건너뛰기 ›", gatewayTitle: "지오메트리 월드로 이동 중…", gatewayHint: "도형 친구들이 기다리고 있어요", crystalPlaza: "크리스털 광장 · 지오메트리 랩", mapGuide: "{name}, 가고 싶은 곳을 눌러 마을을 둘러봐!", origamiGuide: "{name}, 가고 싶은 곳을 눌러 마을을 둘러봐!", mapMoveHint: "가고 싶은 곳을 눌러 걸어가요", enterPlace: "들어가기", movingToPlace: "입구로 걸어가는 중…", cubeTown: "쌓기나무 성", cubeTownHint: "쌓기나무 게임을 만나 봐요", origamiStudio: "색종이 공방", origamiStudioHint: "접고 펼치며 도형을 탐험해요", mirrorManor: "거울 저택", mirrorManorHint: "거울에 비친 모양을 찾아봐요", geoboardYard: "점판 공작소", geoboardYardHint: "점과 선으로 도형을 만들어요", geometryLab: "지오메트리 랩", geometryLabHint: "도형 학습지를 만들고 인쇄해요", myPartner: "나의 도형 파트너", chooseCharacter: "캐릭터 선택", setupCharacter: "내 도형 친구 만들기", friends: "도형 친구들", color: "색상", items: "포인트 몰", itemHint: "포인트로 해금하고 여러 장식을 함께 착용해요", playerName: "내 이름", namePlaceholder: "이름이나 별명", nameHint: "이 이름으로 학습 기록이 저장돼요.", saveProfile: "이 이름으로 시작하기", updateProfile: "변경 내용 저장", nameRequired: "이름이나 별명을 먼저 적어 주세요.", removeItem: "장착 해제",
    needPoints: "포인트가 조금 더 필요해!", unlocked: "새 아이템을 얻었어!"
  },
  zh: {
    skipIntro: "跳过 ›", gatewayTitle: "正在进入几何世界…", gatewayHint: "几何伙伴们正在等你", crystalPlaza: "水晶广场 · 几何实验室", mapGuide: "{name}，点击想去的地方探索小镇！", origamiGuide: "{name}，点击想去的地方探索小镇！", mapMoveHint: "点击想去的地方，走过去吧", enterPlace: "进入", movingToPlace: "正在走向入口…", cubeTown: "积木城堡", cubeTownHint: "来玩积木游戏吧", origamiStudio: "折纸工坊", origamiStudioHint: "通过折叠与展开探索图形", mirrorManor: "镜子庄园", mirrorManorHint: "寻找镜子里的图形", geoboardYard: "钉板工坊", geoboardYardHint: "用点和线创造图形", geometryLab: "几何实验室", geometryLabHint: "制作并打印几何练习纸", myPartner: "我的几何伙伴", chooseCharacter: "选择角色", setupCharacter: "创建我的几何伙伴", friends: "几何朋友", color: "颜色", items: "积分商城", itemHint: "用积分解锁并同时佩戴多件装饰", playerName: "我的名字", namePlaceholder: "名字或昵称", nameHint: "学习记录会保存在这个名字下。", saveProfile: "用这个名字开始", updateProfile: "保存更改", nameRequired: "请先填写名字或昵称。", removeItem: "卸下",
    needPoints: "还需要更多积分！", unlocked: "获得了新道具！"
  },
  ja: {
    skipIntro: "スキップ ›", gatewayTitle: "ジオメトリーワールドへ移動中…", gatewayHint: "図形のなかまたちが待っているよ", crystalPlaza: "クリスタル広場・ジオメトリーラボ", mapGuide: "{name}、行きたい場所をタップして町を歩こう！", origamiGuide: "{name}、行きたい場所をタップして町を歩こう！", mapMoveHint: "行きたい場所をタップして歩こう", enterPlace: "入る", movingToPlace: "入口へ移動中…", cubeTown: "つみき城", cubeTownHint: "つみきゲームで遊ぼう", origamiStudio: "おりがみ工房", origamiStudioHint: "折って開いて図形を探検しよう", mirrorManor: "鏡の館", mirrorManorHint: "鏡に映る形を見つけよう", geoboardYard: "ジオボード工房", geoboardYardHint: "点と線で図形を作ろう", geometryLab: "ジオメトリーラボ", geometryLabHint: "図形プリントを作って印刷しよう", myPartner: "わたしの図形パートナー", chooseCharacter: "キャラクター選択", setupCharacter: "図形パートナーをつくる", friends: "図形のなかま", color: "カラー", items: "ポイントモール", itemHint: "ポイントで解放して複数のアイテムを装備", playerName: "なまえ", namePlaceholder: "なまえ・ニックネーム", nameHint: "この名前で学習記録を保存します。", saveProfile: "この名前ではじめる", updateProfile: "変更を保存", nameRequired: "名前かニックネームを入力してください。", removeItem: "はずす",
    needPoints: "ポイントがもう少し必要！", unlocked: "新しいアイテムをゲット！"
  },
  en: {
    skipIntro: "Skip ›", gatewayTitle: "Entering Geometry World…", gatewayHint: "Your geometry friends are waiting", crystalPlaza: "Crystal Plaza · Geometry Lab", mapGuide: "{name}, tap a place and explore the town!", origamiGuide: "{name}, tap a place and explore the town!", mapMoveHint: "Tap anywhere to walk there", enterPlace: "Enter", movingToPlace: "Walking to the entrance…", cubeTown: "Cube Castle", cubeTownHint: "Discover the stacking block games", origamiStudio: "Origami Studio", origamiStudioHint: "Explore shapes by folding and unfolding", mirrorManor: "Mirror Manor", mirrorManorHint: "Find the shapes reflected in mirrors", geoboardYard: "Geoboard Workshop", geoboardYardHint: "Create shapes with points and lines", geometryLab: "Geometry Lab", geometryLabHint: "Create and print geometry worksheets", myPartner: "My Geometry Partner", chooseCharacter: "Choose a Character", setupCharacter: "Create My Geometry Partner", friends: "Geometry Friends", color: "Color", items: "Point Mall", itemHint: "Unlock items with points and wear several together", playerName: "My name", namePlaceholder: "Name or nickname", nameHint: "Your learning progress is saved under this name.", saveProfile: "Start with this name", updateProfile: "Save changes", nameRequired: "Enter a name or nickname first.", removeItem: "Remove",
    needPoints: "You need a few more points!", unlocked: "New item unlocked!"
  }
};

Object.assign(messages.ko, { mapMoveHint: "바닥을 누르거나 조이스틱으로 걸어가요", loading3d: "3D 도형 마을을 만드는 중…", cameraView: "시점 변경" });
Object.assign(messages.zh, { mapMoveHint: "点击地面或使用摇杆移动", loading3d: "正在创建3D几何小镇…", cameraView: "切换视角" });
Object.assign(messages.ja, { mapMoveHint: "地面をタップするかスティックで歩こう", loading3d: "3D図形の町を作っています…", cameraView: "視点切替" });
Object.assign(messages.en, { mapMoveHint: "Tap the ground or use the joystick", loading3d: "Building the 3D Geometry Town…", cameraView: "Change view" });
Object.assign(messages.ko, {
  viewRoadmap: "학습 로드맵", roadmapEyebrow: "앞으로 열릴 도형 세계", roadmapNote: "기초부터 중등까지 차례로 확장됩니다.", roadmapStatus: "확장 예정", roadmapClose: "로드맵 닫기",
  shapeDistrict: "평면도형 거리", shapeDistrictHint: "합동·대칭·도형 이동을 배우는 길",
  spatialDistrict: "공간·입체 지구", spatialDistrictHint: "전개도·단면·공간 추론을 탐험하는 곳",
  coordinateDistrict: "좌표·변환 지구", coordinateDistrictHint: "좌표·닮음·중등 기하로 이어지는 길",
  shapeGarden: "도형 조각 정원", shapeGardenHint: "조각을 맞추고 조건에 따라 똑같이 나누는 곳"
});
Object.assign(messages.zh, {
  viewRoadmap: "学习路线", roadmapEyebrow: "即将开放的几何世界", roadmapNote: "从基础到中学内容将依次开放。", roadmapStatus: "计划扩展", roadmapClose: "关闭路线图",
  shapeDistrict: "平面图形街", shapeDistrictHint: "学习全等、对称与图形变换",
  spatialDistrict: "空间立体区", spatialDistrictHint: "探索展开图、截面与空间推理",
  coordinateDistrict: "坐标变换区", coordinateDistrictHint: "通往坐标、相似与中学几何",
  shapeGarden: "图形拼片花园", shapeGardenHint: "拼合图形并按条件等分"
});
Object.assign(messages.ja, {
  viewRoadmap: "学習ロードマップ", roadmapEyebrow: "これから開く図形の世界", roadmapNote: "基礎から中学内容まで順番に広がります。", roadmapStatus: "拡張予定", roadmapClose: "ロードマップを閉じる",
  shapeDistrict: "平面図形ストリート", shapeDistrictHint: "合同・対称・図形の移動を学ぶ道",
  spatialDistrict: "空間・立体エリア", spatialDistrictHint: "展開図・断面・空間推理を探究する場所",
  coordinateDistrict: "座標・変換エリア", coordinateDistrictHint: "座標・相似・中学幾何へ続く道",
  shapeGarden: "図形ピースの庭", shapeGardenHint: "ピースを合わせ、条件にそって分ける場所"
});
Object.assign(messages.en, {
  viewRoadmap: "Learning roadmap", roadmapEyebrow: "Geometry worlds opening next", roadmapNote: "The path will grow from foundations through middle-school geometry.", roadmapStatus: "Planned expansion", roadmapClose: "Close roadmap",
  shapeDistrict: "Plane Shapes Street", shapeDistrictHint: "A path through congruence, symmetry, and transformations",
  spatialDistrict: "Spatial Solids District", spatialDistrictHint: "Explore nets, sections, and spatial reasoning",
  coordinateDistrict: "Coordinates District", coordinateDistrictHint: "Continue into coordinates, similarity, and middle-school geometry",
  shapeGarden: "Shape Garden", shapeGardenHint: "Match pieces and partition shapes by rules"
});

function readStoredProfile() {
  try { return JSON.parse(localStorage.getItem("gfield-profile") || "{}"); }
  catch { return {}; }
}

// Bring earned level/stage/gifts up to date (migrates returning players
// silently) BEFORE we snapshot the profile, so `stored` already reflects any
// newly-applied gifts and the new `evolution` field.
syncEvolution();
const stored = readStoredProfile();
const legacyItem = items.find((item) => item.id === stored.item);
const profile = {
  version: 2,
  name: typeof stored.name === "string" ? stored.name : "",
  setupComplete: Boolean(stored.setupComplete && stored.name),
  character: stored.character || "cubi",
  color: stored.color || "original",
  equipped: stored.equipped && typeof stored.equipped === "object"
    ? { ...stored.equipped }
    : legacyItem ? { [legacyItem.category]: legacyItem.id } : { badge: "star" },
  unlocked: Array.isArray(stored.unlocked) ? [...new Set([...stored.unlocked, "star"])] : ["star"],
  progress: stored.progress && typeof stored.progress === "object" ? stored.progress : {},
  evolution: (stored.evolution && typeof stored.evolution === "object") ? { ...stored.evolution } : undefined,
  createdAt: stored.createdAt || Date.now(),
  lastPlayedAt: Date.now()
};
let language = localStorage.getItem("gfield-language") || "ko";
const storedPoints = localStorage.getItem("gfield-points");
let points = storedPoints === null ? 120 : Number(storedPoints);
if (!Number.isFinite(points)) points = 120;
let audioEnabled = localStorage.getItem("gfield-audio-muted") !== "true";
let activeItemCategory = "hat";
let onboarding = !profile.setupComplete;
let activePlace = null;
let activeRoadmapPlace = null;
let activeNpc = null;
let activeNpcLine = 0;
let isNavigating = false;
let mapPointer = null;
let moveFrame = 0;
let cameraFrame = 0;
const walkerPosition = { x: 48, y: 72 };
const cameraPosition = { x: 0, y: 0, initialized: false };

function message(key) {
  return messages[language]?.[key] || messages.ko[key] || key;
}

function saveProfile() {
  profile.version = 2;
  profile.lastPlayedAt = Date.now();
  localStorage.setItem("gfield-profile", JSON.stringify(profile));
  localStorage.setItem("gfield-points", String(points));
}

function selectedCharacter() {
  return characters.find((character) => character.id === profile.character) || characters[0];
}

function spriteClasses(character = selectedCharacter()) {
  return `character-sprite sprite-${character.sprite} color-${profile.color}`;
}

function applyLanguage() {
  document.documentElement.lang = language;
  $$("[data-i18n]").forEach((node) => { node.textContent = message(node.dataset.i18n); });
  $$("[data-i18n-placeholder]").forEach((node) => {
    node.placeholder = message(node.dataset.i18nPlaceholder);
  });
  $$("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === language));
  elements.characterModal.classList.toggle("onboarding", onboarding);
  $("#characterTitle").textContent = message(onboarding ? "setupCharacter" : "chooseCharacter");
  elements.saveProfile.textContent = message(onboarding ? "saveProfile" : "updateProfile");
  elements.sound.textContent = audioEnabled ? "♫" : "♪";
  elements.sound.setAttribute("aria-pressed", String(audioEnabled));
  if (activePlace) showPlacePrompt(activePlace);
  if (activeNpc) renderNpcPrompt(false);
  if (activeRoadmapPlace) renderRoadmap();
  setGuide("mapGuide");
  renderCharacterRoom();
}

function updatePoints() {
  $$(".point-value").forEach((node) => { node.textContent = String(points); });
}

function setGuide(textKey) {
  elements.guideName.textContent = selectedCharacter().name;
  const key = textKey === "mapGuide" && selectedCharacter().id === "foldy" ? "origamiGuide" : textKey;
  elements.guide.querySelector("p").textContent = message(key).replace("{name}", profile.name || selectedCharacter().name);
}

function itemName(item) {
  return item.name?.[language] || item.name?.ko || item.id;
}

function iconMarkup(iconId, className = "mall-icon") {
  if (!iconId) return "";
  return `<svg class="${className}" aria-hidden="true" focusable="false"><use href="./assets/point-mall-icons.svg#${iconId}"></use></svg>`;
}

function equippedItemList() {
  return Object.values(profile.equipped)
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter(Boolean);
}

function primaryEquippedIcon() {
  return equippedItemList()[0]?.iconId || "";
}

function renderEquippedItems() {
  elements.equippedItems.replaceChildren();
  equippedItemList().forEach((item) => {
    const icon = document.createElement("span");
    icon.className = `equipped-slot equipped-${item.category}`;
    icon.innerHTML = iconMarkup(item.iconId, "mall-icon equipped-icon");
    elements.equippedItems.append(icon);
  });
}

function updateProfileVisuals() {
  const character = selectedCharacter();
  elements.profileAvatar.className = spriteClasses(character);
  elements.selectedSprite.className = spriteClasses(character);
  elements.selectedName.textContent = character.name;
  elements.selectedRole.textContent = character.role;
  elements.toolbarName.textContent = profile.name || "";
  if (elements.characterModal.hidden) elements.playerName.value = profile.name;
  renderEquippedItems();
  elements.guideName.textContent = character.name;
  elements.profileButton.setAttribute("aria-label", profile.name ? `${profile.name} profile` : message("chooseCharacter"));
  updatePoints();
  renderWalkers();
  updateEvolutionDisplay();
  window.dispatchEvent(new CustomEvent("geometry-profile-change", {
    detail: { character: profile.character, color: profile.color, equipped: { ...profile.equipped } }
  }));
}

function updateEvolutionDisplay() {
  const evo = getEvolution();
  const sname = stageName(evo.stage, language);
  applyCharacterGlow(elements.selectedSprite, evo.stage);

  let chip = document.querySelector("#evoLevelChip");
  if (!chip) {
    chip = document.createElement("button");
    chip.type = "button";
    chip.id = "evoLevelChip";
    chip.className = "evo-level-chip";
    chip.addEventListener("click", () => openCharacterRoom(false));
    elements.profileButton.insertAdjacentElement("afterend", chip);
  }
  const chipLabel = levelLabel(evo.level, language);
  chip.textContent = chipLabel;
  chip.setAttribute("aria-label", sname ? `${sname} · ${chipLabel}` : chipLabel);
  chip.title = sname || chipLabel;
  chip.classList.toggle("evo-max", evo.stage >= evo.maxStage);

  let line = document.querySelector("#evoStageLine");
  if (!line && elements.selectedRole) {
    line = document.createElement("p");
    line.id = "evoStageLine";
    line.className = "evo-stage-line";
    elements.selectedRole.insertAdjacentElement("afterend", line);
  }
  if (line) line.textContent = (evo.stage > 0 && sname) ? `${levelLabel(evo.level, language)} · ${sname}` : levelLabel(evo.level, language);
}

function renderCharacterRoom() {
  elements.characterGrid.replaceChildren();
  characters.forEach((character) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "character-choice";
    button.classList.toggle("active", character.id === profile.character);
    button.innerHTML = `<span class="character-sprite sprite-${character.sprite} color-${profile.color}"></span><strong>${character.name}</strong>`;
    button.addEventListener("click", () => {
      profile.character = character.id;
      saveProfile();
      updateProfileVisuals();
      renderCharacterRoom();
    });
    elements.characterGrid.append(button);
  });

  elements.colorPalette.replaceChildren();
  colors.forEach((color) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `color-swatch ${color.swatch}`;
    button.classList.toggle("active", color.id === profile.color);
    button.setAttribute("aria-label", color.id);
    button.addEventListener("click", () => {
      profile.color = color.id;
      releaseColorLock(profile);
      saveProfile();
      updateProfileVisuals();
      renderCharacterRoom();
    });
    elements.colorPalette.append(button);
  });

  elements.itemCategories.replaceChildren();
  itemCategories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "item-category";
    button.classList.toggle("active", category.id === activeItemCategory);
    button.innerHTML = `${iconMarkup(category.iconId, "mall-icon category-icon")}<strong>${category.label[language] || category.label.ko}</strong>`;
    button.addEventListener("click", () => {
      activeItemCategory = category.id;
      renderCharacterRoom();
    });
    elements.itemCategories.append(button);
  });

  elements.itemGrid.replaceChildren();
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "item-choice remove-item";
  remove.classList.toggle("active", !profile.equipped[activeItemCategory]);
  remove.innerHTML = `<span class="item-icon remove-glyph">×</span><strong>${message("removeItem")}</strong><small>✓</small>`;
  remove.addEventListener("click", () => {
    delete profile.equipped[activeItemCategory];
    if (profile.evolution?.gifts) delete profile.evolution.gifts[activeItemCategory];
    saveProfile();
    updateProfileVisuals();
    renderCharacterRoom();
  });
  elements.itemGrid.append(remove);

  items.filter((item) => item.category === activeItemCategory).forEach((item) => {
    const unlocked = profile.unlocked.includes(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "item-choice";
    button.classList.toggle("active", item.id === profile.equipped[item.category]);
    button.classList.toggle("locked", !unlocked);
    const itemStatus = unlocked
      ? "✓"
      : `${iconMarkup("cat-gem", "mall-icon cost-icon")}<span>${item.cost}</span>`;
    button.innerHTML = `${iconMarkup(item.iconId, "mall-icon item-art")}<strong>${itemName(item)}</strong><small>${itemStatus}</small>`;
    button.addEventListener("click", () => {
      if (!unlocked) {
        if (points < item.cost) {
          setGuide("needPoints");
          speak(message("needPoints"));
          return;
        }
        points -= item.cost;
        profile.unlocked.push(item.id);
        setGuide("unlocked");
      }
      profile.equipped[item.category] = item.id;
      if (profile.evolution?.gifts) delete profile.evolution.gifts[item.category];
      saveProfile();
      updateProfileVisuals();
      renderCharacterRoom();
    });
    elements.itemGrid.append(button);
  });
  updateProfileVisuals();
}

function sampleWalkers() {
  const selected = selectedCharacter();
  const others = characters.filter((character) => character.id !== selected.id).sort(() => Math.random() - .5);
  return [selected, ...others.slice(0, 2)];
}

function renderWalkers() {
  const evo = getEvolution();
  elements.walkers.replaceChildren();
  sampleWalkers().forEach((character, index) => {
    const walker = document.createElement("div");
    const selected = character.id === profile.character;
    walker.className = `walker route-${["a", "b", "c"][index]}${selected ? " selected" : ""}`;
    const color = selected ? profile.color : "original";
    walker.innerHTML = `<span class="character-sprite sprite-${character.sprite} color-${color}"></span>${selected && primaryEquippedIcon() ? `<span class="walker-item">${iconMarkup(primaryEquippedIcon(), "mall-icon walker-icon")}</span>` : ""}`;
    if (selected) applyCharacterGlow(walker.querySelector(".character-sprite"), evo.stage);
    if (selected) {
      walker.style.left = `${walkerPosition.x}%`;
      walker.style.top = `${walkerPosition.y}%`;
      walker.dataset.x = String(walkerPosition.x);
      walker.dataset.y = String(walkerPosition.y);
    }
    elements.walkers.append(walker);
  });
  requestAnimationFrame(() => updateMapCamera(true));
}

function configureMapWorld() {
  const world = document.querySelector(".world");
  const stage = elements.mapStage;
  if (!world || !stage) return;
  const ratio = 1907 / 1277;
  const coarse = matchMedia("(pointer: coarse)").matches;
  const scale = coarse ? 1.9 : 1.55;
  const width = Math.min(2700, Math.max(1500, world.clientWidth * scale, world.clientHeight * ratio * 1.25));
  stage.style.width = `${Math.round(width)}px`;
  stage.style.height = `${Math.round(width / ratio)}px`;
  updateMapCamera(true);
}

function updateMapCamera(immediate = false) {
  const world = document.querySelector(".world");
  const stage = elements.mapStage;
  if (!world || !stage || !stage.offsetWidth || !stage.offsetHeight) return;
  const focusX = stage.offsetWidth * walkerPosition.x / 100;
  const focusY = stage.offsetHeight * walkerPosition.y / 100;
  const desiredX = Math.min(0, Math.max(world.clientWidth - stage.offsetWidth, world.clientWidth * .5 - focusX));
  const desiredY = Math.min(0, Math.max(world.clientHeight - stage.offsetHeight, world.clientHeight * .58 - focusY));
  if (immediate || !cameraPosition.initialized) {
    cameraPosition.x = desiredX;
    cameraPosition.y = desiredY;
    cameraPosition.initialized = true;
  } else {
    cameraPosition.x += (desiredX - cameraPosition.x) * .16;
    cameraPosition.y += (desiredY - cameraPosition.y) * .16;
  }
  stage.style.transform = `translate3d(${cameraPosition.x}px, ${cameraPosition.y}px, 0)`;
}

function distanceFromPlace(place) {
  const stage = elements.mapStage;
  if (!stage) return Infinity;
  const dx = (walkerPosition.x - place.entrance.x) * stage.offsetWidth / 100;
  const dy = (walkerPosition.y - place.entrance.y) * stage.offsetHeight / 100;
  return Math.hypot(dx, dy);
}

function hidePlacePrompt() {
  activePlace = null;
  elements.placePrompt.hidden = true;
  elements.placePrompt.classList.remove("arrived");
  delete elements.placePrompt.dataset.place;
  delete document.body.dataset.activePlace;
  places.forEach((place) => place.element?.classList.remove("nearby"));
}

function hideNpcPrompt() {
  activeNpc = null;
  activeNpcLine = 0;
  elements.npcPrompt.hidden = true;
  elements.npcPrompt.classList.remove("arrived");
  delete elements.npcPrompt.dataset.role;
}

function renderNpcPrompt(animate = false) {
  if (!activeNpc || activePlace) return;
  const character = characters.find((candidate) => candidate.id === activeNpc.characterId) || characters[1];
  const lines = npcDialogue[language]?.[activeNpc.id] || npcDialogue.ko[activeNpc.id] || [];
  const line = lines[activeNpcLine % Math.max(1, lines.length)] || "";
  elements.npcAvatar.className = `character-sprite sprite-${character.sprite} color-original`;
  elements.npcName.textContent = character.name;
  elements.npcText.textContent = line;
  elements.npcNext.textContent = npcNextLabel[language] || npcNextLabel.ko;
  elements.npcPrompt.dataset.role = activeNpc.id;
  elements.npcPrompt.hidden = false;
  if (animate) {
    elements.npcPrompt.classList.remove("arrived");
    requestAnimationFrame(() => elements.npcPrompt.classList.add("arrived"));
  }
}

function showNpcPrompt(detail) {
  if (!detail?.id || activePlace) return;
  const changed = activeNpc?.id !== detail.id || activeNpc?.characterId !== detail.characterId;
  activeNpc = { id: detail.id, characterId: detail.characterId };
  if (changed) activeNpcLine = 0;
  renderNpcPrompt(changed);
}

function advanceNpcDialogue() {
  if (!activeNpc) return;
  const lines = npcDialogue[language]?.[activeNpc.id] || npcDialogue.ko[activeNpc.id] || [];
  if (!lines.length) return;
  activeNpcLine = (activeNpcLine + 1) % lines.length;
  renderNpcPrompt(false);
  speak(lines[activeNpcLine]);
}

function showPlacePrompt(place) {
  const changed = activePlace?.id !== place.id;
  hideNpcPrompt();
  activePlace = place;
  elements.placePromptName.textContent = message(place.nameKey);
  elements.placePromptDescription.textContent = message(place.descriptionKey);
  elements.enterPlace.textContent = message(place.roadmap ? "viewRoadmap" : "enterPlace");
  elements.enterPlace.disabled = false;
  elements.placePrompt.dataset.place = place.id;
  document.body.dataset.activePlace = place.id;
  elements.placePrompt.hidden = false;
  if (changed) {
    elements.placePrompt.classList.remove("arrived");
    requestAnimationFrame(() => elements.placePrompt.classList.add("arrived"));
  }
  places.forEach((candidate) => candidate.element?.classList.toggle("nearby", candidate === place));
}

function renderRoadmap() {
  if (!activeRoadmapPlace) return;
  const levels = curriculumLevels[language] || curriculumLevels.ko;
  const activities = roadmapActivities[activeRoadmapPlace.id]?.[language]
    || roadmapActivities[activeRoadmapPlace.id]?.ko
    || [];
  elements.roadmapModal.dataset.district = activeRoadmapPlace.id;
  elements.roadmapEyebrow.textContent = message("roadmapEyebrow");
  elements.roadmapTitle.textContent = message(activeRoadmapPlace.nameKey);
  elements.roadmapDescription.textContent = message(activeRoadmapPlace.descriptionKey);
  elements.roadmapNote.textContent = message("roadmapNote");
  elements.roadmapStatus.textContent = message("roadmapStatus");
  elements.roadmapClose.setAttribute("aria-label", message("roadmapClose"));

  const progression = levels.map((level, index) => {
    const step = document.createElement("span");
    step.textContent = level;
    step.dataset.step = String(index + 1);
    return step;
  });
  elements.roadmapProgression.replaceChildren(...progression);

  const stages = levels.map((level, index) => {
    const stage = document.createElement("article");
    stage.className = "roadmap-stage";
    const number = document.createElement("span");
    number.className = "roadmap-stage-number";
    number.textContent = String(index + 1).padStart(2, "0");
    const copy = document.createElement("div");
    const levelName = document.createElement("strong");
    levelName.textContent = level;
    const title = document.createElement("h3");
    title.textContent = activities[index] || "";
    copy.append(levelName, title);
    const status = document.createElement("small");
    status.textContent = message("roadmapStatus");
    stage.append(number, copy, status);
    return stage;
  });
  elements.roadmapStages.replaceChildren(...stages);
}

function openRoadmap(place) {
  activeRoadmapPlace = place;
  renderRoadmap();
  elements.roadmapModal.hidden = false;
  document.body.classList.add("roadmap-open");
  requestAnimationFrame(() => elements.roadmapModal.classList.add("open"));
  setTimeout(() => elements.roadmapClose.focus({ preventScroll: true }), 80);
}

function closeRoadmap(restoreFocus = true) {
  if (elements.roadmapModal.hidden) return;
  elements.roadmapModal.classList.remove("open");
  elements.roadmapModal.hidden = true;
  document.body.classList.remove("roadmap-open");
  activeRoadmapPlace = null;
  if (restoreFocus) elements.enterPlace?.focus({ preventScroll: true });
}

function updateNearbyPlace() {
  places.forEach((place) => place.element?.classList.remove("destination"));
  const nearest = places
    .map((place) => ({ place, distance: distanceFromPlace(place) }))
    .sort((a, b) => a.distance - b.distance)[0];
  if (nearest && nearest.distance <= 105) showPlacePrompt(nearest.place);
  else hidePlacePrompt();
}

function moveSelectedWalkerTo(clientX, clientY, place = null) {
  const walker = elements.walkers.querySelector(".walker.selected");
  const stage = elements.mapStage;
  if (!walker || !stage) return;
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const targetX = Math.min(92, Math.max(6, ((clientX - rect.left) / rect.width) * 100));
  const targetY = Math.min(88, Math.max(14, ((clientY - rect.top) / rect.height) * 100));
  moveSelectedWalkerToPercent(targetX, targetY, place);
}

function moveSelectedWalkerToPercent(targetX, targetY, place = null) {
  const walker = elements.walkers.querySelector(".walker.selected");
  if (!walker) return;
  cancelAnimationFrame(moveFrame);
  hidePlacePrompt();
  places.forEach((candidate) => candidate.element?.classList.toggle("destination", candidate === place));
  const fromX = walkerPosition.x;
  const fromY = walkerPosition.y;
  const dx = targetX - fromX;
  if (Math.abs(dx) > 1) walker.classList.toggle("facing-left", dx < 0);
  const distance = Math.hypot(targetX - fromX, targetY - fromY);
  const duration = Math.min(6400, Math.max(700, distance * 80));
  const startedAt = performance.now();
  walker.classList.add("moving");
  elements.guide?.classList.add("hide");
  elements.moveHint?.classList.add("hide");
  const tick = (now) => {
    const progress = Math.min(1, (now - startedAt) / duration);
    const eased = progress < .5 ? 2 * progress * progress : 1 - Math.pow(-2 * progress + 2, 2) / 2;
    walkerPosition.x = fromX + (targetX - fromX) * eased;
    walkerPosition.y = fromY + (targetY - fromY) * eased;
    walker.style.left = `${walkerPosition.x}%`;
    walker.style.top = `${walkerPosition.y}%`;
    walker.dataset.x = String(walkerPosition.x);
    walker.dataset.y = String(walkerPosition.y);
    updateMapCamera();
    if (progress < 1) {
      moveFrame = requestAnimationFrame(tick);
      return;
    }
    walker.classList.remove("moving");
    updateNearbyPlace();
  };
  moveFrame = requestAnimationFrame(tick);
}

function beginMapPointer(event) {
  if (!elements.characterModal.hidden || event.button > 0) return;
  mapPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
  elements.mapStage.setPointerCapture?.(event.pointerId);
}

function finishMapPointer(event) {
  if (!mapPointer || mapPointer.id !== event.pointerId || !elements.characterModal.hidden) return;
  const distance = Math.hypot(event.clientX - mapPointer.x, event.clientY - mapPointer.y);
  mapPointer = null;
  if (distance > 12) return;
  const hotspot = event.target.closest(".place-hotspot");
  const place = hotspot ? places.find((candidate) => candidate.element === hotspot) : null;
  if (place) moveSelectedWalkerToPercent(place.entrance.x, place.entrance.y, place);
  else moveSelectedWalkerTo(event.clientX, event.clientY);
}

function cancelMapPointer() {
  mapPointer = null;
}

function enterActivePlace() {
  if (!activePlace || isNavigating) return;
  if (activePlace.roadmap) {
    openRoadmap(activePlace);
    return;
  }
  isNavigating = true;
  elements.enterPlace.disabled = true;
  elements.enterPlace.classList.add("loading");
  location.href = activePlace.href;
}

function preferredVoice() {
  const locale = { ko: "ko", zh: "zh", ja: "ja", en: "en" }[language];
  const voices = speechSynthesis.getVoices().filter((voice) => voice.lang.toLowerCase().startsWith(locale));
  const male = /injoon|hyunsu|bongjin|yunxi|keita|ichiro|david|guy|mark|male/i;
  const female = /sunhi|xiaoxiao|nanami|zira|jenny|aria|susan|samantha|female/i;
  return voices.find((voice) => male.test(voice.name)) || voices.find((voice) => !female.test(voice.name)) || voices[0];
}

function speak(text) {
  if (!audioEnabled || !("speechSynthesis" in window)) return;
  speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = preferredVoice();
  if (voice) utterance.voice = voice;
  utterance.lang = { ko: "ko-KR", zh: "zh-CN", ja: "ja-JP", en: "en-US" }[language];
  utterance.pitch = .9;
  utterance.rate = .9;
  speechSynthesis.speak(utterance);
}

let introFinishing = false;

function enterWorldMap() {
  if (onboarding) {
    openCharacterRoom(true);
  } else {
    const focusOrigami = new URLSearchParams(location.search).get("focus") === "origami";
    const target = focusOrigami ? elements.origami : elements.castle;
    target?.classList.add("attention");
    setTimeout(() => target?.classList.remove("attention"), 3700);
  }
}

function finishIntro({ skipGateway = false } = {}) {
  if (introFinishing || !document.body.contains(elements.intro)) return;
  introFinishing = true;
  elements.introVideo.pause();
  elements.intro.classList.add("hide");
  setTimeout(() => elements.intro.remove(), 700);

  if (skipGateway) {
    elements.worldGate?.remove();
    setTimeout(enterWorldMap, 80);
    return;
  }

  elements.worldGate.setAttribute("aria-hidden", "false");
  elements.worldGate.classList.add("show");
  setTimeout(() => elements.worldGate.classList.add("leaving"), 2050);
  setTimeout(() => {
    elements.worldGate.remove();
    enterWorldMap();
  }, 2650);
}

function openCharacterRoom(forceOnboarding = false) {
  onboarding = forceOnboarding || !profile.setupComplete;
  elements.characterModal.classList.toggle("onboarding", onboarding);
  $("#characterTitle").textContent = message(onboarding ? "setupCharacter" : "chooseCharacter");
  elements.saveProfile.textContent = message(onboarding ? "saveProfile" : "updateProfile");
  elements.playerName.value = profile.name;
  elements.characterModal.hidden = false;
  setTimeout(() => elements.playerName.focus({ preventScroll: true }), 80);
}

function closeCharacterRoom() {
  if (onboarding) return;
  elements.characterModal.hidden = true;
}

function completeProfile() {
  const name = elements.playerName.value.trim().replace(/\s+/g, " ").slice(0, 16);
  if (!name) {
    elements.nameHint.textContent = message("nameRequired");
    elements.nameHint.classList.add("error");
    elements.playerName.focus();
    return;
  }
  profile.name = name;
  profile.setupComplete = true;
  onboarding = false;
  elements.nameHint.textContent = message("nameHint");
  elements.nameHint.classList.remove("error");
  saveProfile();
  updateProfileVisuals();
  setGuide("mapGuide");
  elements.characterModal.hidden = true;
  elements.characterModal.classList.remove("onboarding");
  const firstTarget = profile.character === "foldy" ? elements.origami : elements.castle;
  firstTarget?.classList.add("attention");
  setTimeout(() => firstTarget?.classList.remove("attention"), 2900);
}

if (new URLSearchParams(location.search).get("enter") === "1") finishIntro({ skipGateway: true });
elements.skipIntro.addEventListener("click", finishIntro);
elements.introVideo.addEventListener("ended", finishIntro);
elements.introVideo.addEventListener("error", finishIntro);
setTimeout(() => { if (document.body.contains(elements.intro)) finishIntro(); }, 12000);
elements.introSound.addEventListener("click", () => {
  elements.introVideo.muted = !elements.introVideo.muted;
  elements.introSound.textContent = elements.introVideo.muted ? "♪" : "♫";
  if (!elements.introVideo.muted) elements.introVideo.play().catch(() => {});
});

elements.mapStage?.addEventListener("pointerdown", beginMapPointer);
elements.mapStage?.addEventListener("pointerup", finishMapPointer);
elements.mapStage?.addEventListener("pointercancel", cancelMapPointer);
elements.enterPlace?.addEventListener("click", enterActivePlace);
elements.npcNext?.addEventListener("click", advanceNpcDialogue);
elements.roadmapClose?.addEventListener("click", () => closeRoadmap());
elements.roadmapModal?.addEventListener("click", (event) => {
  if (event.target === elements.roadmapModal) closeRoadmap();
});
places.forEach((place) => place.element?.addEventListener("click", (event) => {
  if (event.detail === 0) moveSelectedWalkerToPercent(place.entrance.x, place.entrance.y, place);
}));
elements.profileButton.addEventListener("click", () => openCharacterRoom(false));
elements.closeCharacter.addEventListener("click", closeCharacterRoom);
elements.characterModal.addEventListener("click", (event) => {
  if (event.target === elements.characterModal) closeCharacterRoom();
});
elements.saveProfile.addEventListener("click", completeProfile);
elements.playerName.addEventListener("input", () => {
  elements.nameHint.textContent = message("nameHint");
  elements.nameHint.classList.remove("error");
});
elements.playerName.addEventListener("keydown", (event) => {
  if (event.key === "Enter") completeProfile();
});
elements.sound.addEventListener("click", () => {
  audioEnabled = !audioEnabled;
  localStorage.setItem("gfield-audio-muted", String(!audioEnabled));
  elements.sound.textContent = audioEnabled ? "♫" : "♪";
  elements.sound.setAttribute("aria-pressed", String(audioEnabled));
  if (audioEnabled) speak(message(selectedCharacter().id === "foldy" ? "origamiGuide" : "mapGuide").replace("{name}", profile.name || selectedCharacter().name));
  else speechSynthesis?.cancel();
});
$$("[data-lang]").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.lang;
  localStorage.setItem("gfield-language", language);
  applyLanguage();
}));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    if (!elements.roadmapModal.hidden) closeRoadmap();
    else closeCharacterRoom();
  }
  if ((event.key === "Enter" || event.key.toLowerCase() === "e") && activePlace && elements.characterModal.hidden && elements.roadmapModal.hidden) enterActivePlace();
});
window.addEventListener("resize", () => {
  cancelAnimationFrame(cameraFrame);
  cameraFrame = requestAnimationFrame(configureMapWorld);
});
window.addEventListener("geometry-world-move", () => {
  closeRoadmap(false);
  elements.guide?.classList.add("hide");
  elements.moveHint?.classList.add("hide");
  if (!document.body.classList.contains("world-3d-ready")) hidePlacePrompt();
});
window.addEventListener("geometry-zone-change", (event) => {
  const place = places.find((candidate) => candidate.id === event.detail?.id);
  if (place) showPlacePrompt(place);
  else if (activePlace && !activePlace.roadmap) hidePlacePrompt();
});
window.addEventListener("geometry-district-change", (event) => {
  const place = districtPlaces.find((candidate) => candidate.id === event.detail?.id);
  if (place) showPlacePrompt(place);
  else if (activePlace?.roadmap) hidePlacePrompt();
});
window.addEventListener("geometry-npc-change", (event) => {
  if (event.detail?.id) showNpcPrompt(event.detail);
  else hideNpcPrompt();
});
saveProfile();
updateProfileVisuals();
applyLanguage();
setGuide("mapGuide");
configureMapWorld();
