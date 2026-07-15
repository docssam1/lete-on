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
  characterModal: $("#characterModal"),
  closeCharacter: $("#closeCharacter"),
  selectedSprite: $("#selectedSprite"),
  selectedName: $("#selectedName"),
  selectedRole: $("#selectedRole"),
  equippedItem: $("#equippedItem"),
  characterGrid: $("#characterGrid"),
  colorPalette: $("#colorPalette"),
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

const items = [
  { id: "none", icon: "·", cost: 0, key: "itemNone" },
  { id: "star", icon: "⭐", cost: 0, key: "itemStar" },
  { id: "cap", icon: "🧢", cost: 100, key: "itemCap" },
  { id: "glasses", icon: "👓", cost: 180, key: "itemGlasses" },
  { id: "wand", icon: "🪄", cost: 260, key: "itemWand" },
  { id: "crown", icon: "👑", cost: 400, key: "itemCrown" }
];

const messages = {
  ko: {
    skipIntro: "건너뛰기 ›", mapGuide: "쌓기나무 성에 새로운 게임이 있어!", myPartner: "나의 도형 파트너", chooseCharacter: "캐릭터 선택", friends: "도형 친구들", color: "색상", items: "포인트 아이템", itemHint: "포인트로 해금하고 장착해요",
    itemNone: "장식 없음", itemStar: "별 배지", itemCap: "탐험 모자", itemGlasses: "둥근 안경", itemWand: "마법봉", itemCrown: "황금 왕관", needPoints: "포인트가 조금 더 필요해!", unlocked: "새 아이템을 얻었어!"
  },
  zh: {
    skipIntro: "跳过 ›", mapGuide: "积木城堡里有新游戏！", myPartner: "我的几何伙伴", chooseCharacter: "选择角色", friends: "几何朋友", color: "颜色", items: "积分道具", itemHint: "用积分解锁并装备",
    itemNone: "无装饰", itemStar: "星星徽章", itemCap: "探险帽", itemGlasses: "圆眼镜", itemWand: "魔法棒", itemCrown: "金色王冠", needPoints: "还需要更多积分！", unlocked: "获得了新道具！"
  },
  ja: {
    skipIntro: "スキップ ›", mapGuide: "つみき城に新しいゲームがあるよ！", myPartner: "わたしの図形パートナー", chooseCharacter: "キャラクター選択", friends: "図形のなかま", color: "カラー", items: "ポイントアイテム", itemHint: "ポイントで解放して装備",
    itemNone: "飾りなし", itemStar: "星バッジ", itemCap: "探検ぼうし", itemGlasses: "丸めがね", itemWand: "魔法の杖", itemCrown: "金の王冠", needPoints: "ポイントがもう少し必要！", unlocked: "新しいアイテムをゲット！"
  },
  en: {
    skipIntro: "Skip ›", mapGuide: "There is a new game in the cube castle!", myPartner: "My Geometry Partner", chooseCharacter: "Choose a Character", friends: "Geometry Friends", color: "Color", items: "Point Items", itemHint: "Unlock and equip with points",
    itemNone: "No item", itemStar: "Star badge", itemCap: "Explorer cap", itemGlasses: "Round glasses", itemWand: "Magic wand", itemCrown: "Golden crown", needPoints: "You need a few more points!", unlocked: "New item unlocked!"
  }
};

const stored = JSON.parse(localStorage.getItem("gfield-profile") || "{}");
const profile = {
  character: stored.character || "cubi",
  color: stored.color || "original",
  item: stored.item || "star",
  unlocked: Array.isArray(stored.unlocked) ? stored.unlocked : ["none", "star"]
};
let language = localStorage.getItem("gfield-language") || "ko";
let points = Number(localStorage.getItem("gfield-points"));
if (!Number.isFinite(points)) points = 120;
let audioEnabled = false;

function message(key) {
  return messages[language]?.[key] || messages.ko[key] || key;
}

function saveProfile() {
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
  $$("[data-lang]").forEach((button) => button.classList.toggle("active", button.dataset.lang === language));
  renderCharacterRoom();
}

function updatePoints() {
  $$(".point-value").forEach((node) => { node.textContent = String(points); });
}

function setGuide(textKey) {
  elements.guideName.textContent = selectedCharacter().name;
  elements.guide.querySelector("p").textContent = message(textKey);
}

function itemIcon() {
  return items.find((item) => item.id === profile.item)?.icon || "";
}

function updateProfileVisuals() {
  const character = selectedCharacter();
  elements.profileAvatar.className = spriteClasses(character);
  elements.selectedSprite.className = spriteClasses(character);
  elements.selectedName.textContent = character.name;
  elements.selectedRole.textContent = character.role;
  elements.equippedItem.textContent = itemIcon();
  elements.guideName.textContent = character.name;
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

  elements.itemGrid.replaceChildren();
  items.forEach((item) => {
    const unlocked = profile.unlocked.includes(item.id);
    const button = document.createElement("button");
    button.type = "button";
    button.className = "item-choice";
    button.classList.toggle("active", item.id === profile.item);
    button.classList.toggle("locked", !unlocked);
    button.innerHTML = `<span class="item-icon">${item.icon}</span><strong>${message(item.key)}</strong><small>${unlocked ? "✓" : `◆ ${item.cost}`}</small>`;
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
      profile.item = item.id;
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
    walker.innerHTML = `<span class="character-sprite sprite-${character.sprite} color-${color}"></span>${selected && profile.item !== "none" ? `<span class="walker-item">${itemIcon()}</span>` : ""}`;
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
  elements.intro.classList.add("hide");
  setTimeout(() => elements.intro.remove(), 700);
  setTimeout(() => elements.castle.classList.add("attention"), 850);
  setTimeout(() => elements.castle.classList.remove("attention"), 3700);
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
elements.profileButton.addEventListener("click", () => { elements.characterModal.hidden = false; });
elements.closeCharacter.addEventListener("click", () => { elements.characterModal.hidden = true; });
elements.characterModal.addEventListener("click", (event) => {
  if (event.target === elements.characterModal) elements.characterModal.hidden = true;
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
  if (event.key === "Escape") elements.characterModal.hidden = true;
});

if (matchMedia("(max-aspect-ratio: 4 / 5)").matches) {
  document.querySelector(".world").scrollLeft = Math.round(innerHeight * .035);
}
applyLanguage();
updateProfileVisuals();
setGuide("mapGuide");
