const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

const elements = {
  intro: $("#intro"),
  introVideo: $("#introVideo"),
  introSound: $("#introSound"),
  skipIntro: $("#skipIntro"),
  castle: $("#cubeCastle"),
  walkers: $("#walkers"),
  guide: $("#mapGuide"),
  guideName: $("#guideName"),
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
  { id: "nova", name: "노바", sprite: 8, role: "Compass Trail Finder" }
];

const colors = [
  { id: "original", swatch: "swatch-original" },
  { id: "ocean", swatch: "swatch-ocean" },
  { id: "berry", swatch: "swatch-berry" },
  { id: "sunset", swatch: "swatch-sunset" },
  { id: "mono", swatch: "swatch-mono" }
];

const itemCategories = [
  { id: "hat", icon: "♛", label: { ko: "모자", zh: "帽子", ja: "ぼうし", en: "Hats" } },
  { id: "face", icon: "◉", label: { ko: "얼굴", zh: "脸部", ja: "かお", en: "Face" } },
  { id: "badge", icon: "★", label: { ko: "배지", zh: "徽章", ja: "バッジ", en: "Badges" } },
  { id: "hand", icon: "✦", label: { ko: "소품", zh: "道具", ja: "こもの", en: "Props" } },
  { id: "aura", icon: "✧", label: { ko: "효과", zh: "特效", ja: "エフェクト", en: "Effects" } }
];

const items = [
  { id: "cap", category: "hat", icon: "🧢", cost: 100, name: { ko: "탐험 모자", zh: "探险帽", ja: "たんけん帽", en: "Explorer Cap" } },
  { id: "crown", category: "hat", icon: "👑", cost: 400, name: { ko: "황금 왕관", zh: "金色王冠", ja: "金の王冠", en: "Golden Crown" } },
  { id: "helmet", category: "hat", icon: "⛑️", cost: 220, name: { ko: "안전 헬멧", zh: "安全帽", ja: "ヘルメット", en: "Builder Helmet" } },
  { id: "wizard-hat", category: "hat", icon: "🧙", cost: 320, name: { ko: "마법사 모자", zh: "魔法帽", ja: "魔法の帽子", en: "Wizard Hat" } },
  { id: "flower-crown", category: "hat", icon: "🌼", cost: 280, name: { ko: "꽃 왕관", zh: "花冠", ja: "花かんむり", en: "Flower Crown" } },

  { id: "glasses", category: "face", icon: "👓", cost: 180, name: { ko: "둥근 안경", zh: "圆眼镜", ja: "丸めがね", en: "Round Glasses" } },
  { id: "star-glasses", category: "face", icon: "🤩", cost: 240, name: { ko: "별 안경", zh: "星星眼镜", ja: "スターめがね", en: "Star Glasses" } },
  { id: "monocle", category: "face", icon: "🧐", cost: 220, name: { ko: "탐정 렌즈", zh: "侦探镜", ja: "探偵レンズ", en: "Detective Lens" } },
  { id: "mask", category: "face", icon: "🥸", cost: 300, name: { ko: "변신 가면", zh: "变身面具", ja: "変身マスク", en: "Funny Mask" } },
  { id: "goggles", category: "face", icon: "🥽", cost: 260, name: { ko: "연구 고글", zh: "研究护目镜", ja: "研究ゴーグル", en: "Lab Goggles" } },

  { id: "star", category: "badge", icon: "⭐", cost: 0, name: { ko: "별 배지", zh: "星星徽章", ja: "星バッジ", en: "Star Badge" } },
  { id: "heart", category: "badge", icon: "💛", cost: 60, name: { ko: "마음 배지", zh: "爱心徽章", ja: "ハートバッジ", en: "Heart Badge" } },
  { id: "medal", category: "badge", icon: "🏅", cost: 140, name: { ko: "도전 메달", zh: "挑战奖牌", ja: "チャレンジメダル", en: "Challenge Medal" } },
  { id: "gem", category: "badge", icon: "💎", cost: 220, name: { ko: "보석 배지", zh: "宝石徽章", ja: "宝石バッジ", en: "Gem Badge" } },
  { id: "compass", category: "badge", icon: "🧭", cost: 260, name: { ko: "나침반 배지", zh: "指南针徽章", ja: "コンパスバッジ", en: "Compass Badge" } },

  { id: "wand", category: "hand", icon: "🪄", cost: 260, name: { ko: "마법봉", zh: "魔法棒", ja: "魔法の杖", en: "Magic Wand" } },
  { id: "flag", category: "hand", icon: "🚩", cost: 140, name: { ko: "탐험 깃발", zh: "探险旗", ja: "探検フラッグ", en: "Explorer Flag" } },
  { id: "telescope", category: "hand", icon: "🔭", cost: 240, name: { ko: "관찰 망원경", zh: "观察望远镜", ja: "観察望遠鏡", en: "Telescope" } },
  { id: "camera", category: "hand", icon: "📷", cost: 300, name: { ko: "작품 카메라", zh: "作品相机", ja: "作品カメラ", en: "Studio Camera" } },
  { id: "blueprint", category: "hand", icon: "📐", cost: 180, name: { ko: "설계 도구", zh: "设计工具", ja: "設計ツール", en: "Design Tool" } },

  { id: "sparkles", category: "aura", icon: "✨", cost: 180, name: { ko: "반짝 효과", zh: "闪亮特效", ja: "きらきら", en: "Sparkles" } },
  { id: "rainbow", category: "aura", icon: "🌈", cost: 320, name: { ko: "무지개 효과", zh: "彩虹特效", ja: "虹エフェクト", en: "Rainbow" } },
  { id: "flame", category: "aura", icon: "🔥", cost: 280, name: { ko: "열정 불꽃", zh: "热情火焰", ja: "情熱の炎", en: "Power Flame" } },
  { id: "snow", category: "aura", icon: "❄️", cost: 250, name: { ko: "눈꽃 효과", zh: "雪花特效", ja: "雪エフェクト", en: "Snow Glow" } },
  { id: "galaxy", category: "aura", icon: "🌌", cost: 450, name: { ko: "은하 효과", zh: "银河特效", ja: "銀河エフェクト", en: "Galaxy Aura" } }
];

const messages = {
  ko: {
    skipIntro: "건너뛰기 ›", mapGuide: "{name}, 쌓기나무 성에 새로운 게임이 있어!", myPartner: "나의 도형 파트너", chooseCharacter: "캐릭터 선택", setupCharacter: "내 도형 친구 만들기", friends: "도형 친구들", color: "색상", items: "포인트 몰", itemHint: "포인트로 해금하고 여러 장식을 함께 착용해요", playerName: "내 이름", namePlaceholder: "이름이나 별명", nameHint: "이 이름으로 학습 기록이 저장돼요.", saveProfile: "이 이름으로 시작하기", updateProfile: "변경 내용 저장", nameRequired: "이름이나 별명을 먼저 적어 주세요.", removeItem: "장착 해제",
    needPoints: "포인트가 조금 더 필요해!", unlocked: "새 아이템을 얻었어!"
  },
  zh: {
    skipIntro: "跳过 ›", mapGuide: "{name}，积木城堡里有新游戏！", myPartner: "我的几何伙伴", chooseCharacter: "选择角色", setupCharacter: "创建我的几何伙伴", friends: "几何朋友", color: "颜色", items: "积分商城", itemHint: "用积分解锁并同时佩戴多件装饰", playerName: "我的名字", namePlaceholder: "名字或昵称", nameHint: "学习记录会保存在这个名字下。", saveProfile: "用这个名字开始", updateProfile: "保存更改", nameRequired: "请先填写名字或昵称。", removeItem: "卸下",
    needPoints: "还需要更多积分！", unlocked: "获得了新道具！"
  },
  ja: {
    skipIntro: "スキップ ›", mapGuide: "{name}、つみき城に新しいゲームがあるよ！", myPartner: "わたしの図形パートナー", chooseCharacter: "キャラクター選択", setupCharacter: "図形パートナーをつくる", friends: "図形のなかま", color: "カラー", items: "ポイントモール", itemHint: "ポイントで解放して複数のアイテムを装備", playerName: "なまえ", namePlaceholder: "なまえ・ニックネーム", nameHint: "この名前で学習記録を保存します。", saveProfile: "この名前ではじめる", updateProfile: "変更を保存", nameRequired: "名前かニックネームを入力してください。", removeItem: "はずす",
    needPoints: "ポイントがもう少し必要！", unlocked: "新しいアイテムをゲット！"
  },
  en: {
    skipIntro: "Skip ›", mapGuide: "{name}, there is a new game in the cube castle!", myPartner: "My Geometry Partner", chooseCharacter: "Choose a Character", setupCharacter: "Create My Geometry Partner", friends: "Geometry Friends", color: "Color", items: "Point Mall", itemHint: "Unlock items with points and wear several together", playerName: "My name", namePlaceholder: "Name or nickname", nameHint: "Your learning progress is saved under this name.", saveProfile: "Start with this name", updateProfile: "Save changes", nameRequired: "Enter a name or nickname first.", removeItem: "Remove",
    needPoints: "You need a few more points!", unlocked: "New item unlocked!"
  }
};

function readStoredProfile() {
  try { return JSON.parse(localStorage.getItem("gfield-profile") || "{}"); }
  catch { return {}; }
}

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
  createdAt: stored.createdAt || Date.now(),
  lastPlayedAt: Date.now()
};
let language = localStorage.getItem("gfield-language") || "ko";
const storedPoints = localStorage.getItem("gfield-points");
let points = storedPoints === null ? 120 : Number(storedPoints);
if (!Number.isFinite(points)) points = 120;
let audioEnabled = false;
let activeItemCategory = "hat";
let onboarding = !profile.setupComplete;

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
  setGuide("mapGuide");
  renderCharacterRoom();
}

function updatePoints() {
  $$(".point-value").forEach((node) => { node.textContent = String(points); });
}

function setGuide(textKey) {
  elements.guideName.textContent = selectedCharacter().name;
  elements.guide.querySelector("p").textContent = message(textKey).replace("{name}", profile.name || selectedCharacter().name);
}

function itemName(item) {
  return item.name?.[language] || item.name?.ko || item.id;
}

function equippedItemList() {
  return Object.values(profile.equipped)
    .map((itemId) => items.find((item) => item.id === itemId))
    .filter(Boolean);
}

function primaryEquippedIcon() {
  return equippedItemList()[0]?.icon || "";
}

function renderEquippedItems() {
  elements.equippedItems.replaceChildren();
  equippedItemList().forEach((item) => {
    const icon = document.createElement("span");
    icon.className = `equipped-slot equipped-${item.category}`;
    icon.textContent = item.icon;
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
    button.innerHTML = `<span>${category.icon}</span><strong>${category.label[language] || category.label.ko}</strong>`;
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
  remove.innerHTML = `<span class="item-icon">×</span><strong>${message("removeItem")}</strong><small>✓</small>`;
  remove.addEventListener("click", () => {
    delete profile.equipped[activeItemCategory];
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
    button.innerHTML = `<span class="item-icon">${item.icon}</span><strong>${itemName(item)}</strong><small>${unlocked ? "✓" : `◆ ${item.cost}`}</small>`;
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
  elements.walkers.replaceChildren();
  sampleWalkers().forEach((character, index) => {
    const walker = document.createElement("div");
    const selected = character.id === profile.character;
    walker.className = `walker route-${["a", "b", "c"][index]}${selected ? " selected" : ""}`;
    const color = selected ? profile.color : "original";
    walker.innerHTML = `<span class="character-sprite sprite-${character.sprite} color-${color}"></span>${selected && primaryEquippedIcon() ? `<span class="walker-item">${primaryEquippedIcon()}</span>` : ""}`;
    elements.walkers.append(walker);
  });
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

function finishIntro() {
  if (!document.body.contains(elements.intro)) return;
  elements.intro.classList.add("hide");
  setTimeout(() => elements.intro.remove(), 700);
  if (onboarding) {
    setTimeout(() => openCharacterRoom(true), 760);
  } else {
    setTimeout(() => elements.castle.classList.add("attention"), 850);
    setTimeout(() => elements.castle.classList.remove("attention"), 3700);
  }
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
  elements.castle.classList.add("attention");
  setTimeout(() => elements.castle.classList.remove("attention"), 2900);
}

if (new URLSearchParams(location.search).get("enter") === "1") finishIntro();
elements.skipIntro.addEventListener("click", finishIntro);
elements.introVideo.addEventListener("ended", finishIntro);
elements.introVideo.addEventListener("error", finishIntro);
setTimeout(() => { if (document.body.contains(elements.intro)) finishIntro(); }, 12000);
elements.introSound.addEventListener("click", () => {
  elements.introVideo.muted = !elements.introVideo.muted;
  elements.introSound.textContent = elements.introVideo.muted ? "♪" : "♫";
  if (!elements.introVideo.muted) elements.introVideo.play().catch(() => {});
});

elements.castle.addEventListener("click", () => { location.href = "../cube-town/"; });
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
  elements.sound.textContent = audioEnabled ? "♫" : "♪";
  if (audioEnabled) speak(message("mapGuide"));
  else speechSynthesis?.cancel();
});
$$("[data-lang]").forEach((button) => button.addEventListener("click", () => {
  language = button.dataset.lang;
  localStorage.setItem("gfield-language", language);
  applyLanguage();
}));
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCharacterRoom();
});

if (matchMedia("(max-aspect-ratio: 4 / 5)").matches) {
  document.querySelector(".world").scrollLeft = Math.round(innerHeight * .035);
}
saveProfile();
updateProfileVisuals();
applyLanguage();
setGuide("mapGuide");
