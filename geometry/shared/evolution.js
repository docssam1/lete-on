// GFIELD Geometry World — character growth / evolution system.
//
// Level model (per the project owner):
//  * You LEVEL UP each time you CLEAR a whole game level — finish all of a
//    level's problems ("1레벨 끝나면 level up"), not every N problems.
//  * Player Level = 1 + (number of cleared levels). Start at Lv.1.
//  * A cleared level fires a FLASHY level-up celebration (confetti + burst),
//    a persistent "Lv.N" badge stays at the top of the screen, and Cubi visibly
//    evolves: a new accessory + a bolder, differently-coloured aura.
//
// Hard constraints (never break existing saves):
//  * Only ADD `profile.evolution`; APPEND to `unlocked`; touch `equipped` only
//    for empty slots or our own prior gift; touch `color` only when the child
//    hasn't picked one themselves (see releaseColorLock / releaseGiftSlot).
//
// Cleared levels are detected from `gfield-rewarded-games`, whose entries the three
// games already write one-per-solved-problem, and which encode the level:
//   copy-build:{levelIndex 0..2}:{problemIndex 0..9}   (3 levels × 10)
//   count-cubes:height-l{level 1..5}-{nn}              (5 levels × 5)
//   shape-build:{level 4|5}:{problemIndex 0..4}        (2 levels × 5)

import { readProfile, writeProfile } from "./profile-storage.js?v=evolve2-20260719a";

const REWARD_KEY = "gfield-rewarded-games";

const COPY_LEVELS = 3, COPY_PER_LEVEL = 10;
const COUNT_LEVELS = 5, COUNT_PER_LEVEL = 5;
const SHAPE_LEVELS = [4, 5], SHAPE_PER_LEVEL = 5;
export const MAX_LEVELS = COPY_LEVELS + COUNT_LEVELS + SHAPE_LEVELS.length; // 10 clearable levels → up to Lv.11

// One evolution step per cleared level. Each grants an accessory (dropped into an
// empty slot) and a display colour + aura tier so Cubi visibly changes.
export const EVOLUTION_STEPS = [
  { gift: { category: "hat",   id: "cap" },       color: "ocean"  },
  { gift: { category: "face",  id: "glasses" },   color: "berry"  },
  { gift: { category: "hand",  id: "telescope" }, color: "sunset" },
  { gift: { category: "aura",  id: "sparkles" },  color: "mono"   },
  { gift: { category: "hat",   id: "crown" },     color: "ocean"  },
  { gift: { category: "face",  id: "goggles" },   color: "berry"  },
  { gift: { category: "hand",  id: "wand" },      color: "sunset" },
  { gift: { category: "badge", id: "medal" },     color: "mono"   }
];

export const MAX_STAGE = EVOLUTION_STEPS.length;
const CONFETTI_COLORS = ["#ffd23d", "#ff6fae", "#5b8cff", "#58c47a", "#ff8a3d", "#b06bff", "#46c3d0"];

const TEXT = {
  ko: {
    levelUp: "캐릭터 레벨 업!", level: "Lv.{n}", charLevel: "캐릭터 Lv.{n}",
    gift: "새 아이템 “{item}” 획득!",
    stageName: { 1: "새싹 탐험가", 2: "호기심 관찰가", 3: "쌓기 명탐정", 4: "반짝이는 도형가", 5: "큐브 기사", 6: "도형 연구가", 7: "마법 건축가", 8: "큐브 마스터" },
    itemName: { cap: "탐험 모자", glasses: "둥근 안경", telescope: "관찰 망원경", sparkles: "반짝 효과", crown: "황금 왕관", goggles: "연구 고글", wand: "마법봉", medal: "도전 메달" }
  },
  zh: {
    levelUp: "角色升级了！", level: "Lv.{n}", charLevel: "角色 Lv.{n}",
    gift: "获得新道具“{item}”！",
    stageName: { 1: "新芽探险家", 2: "好奇观察家", 3: "积木名侦探", 4: "闪耀几何家", 5: "立方骑士", 6: "几何研究家", 7: "魔法建筑师", 8: "立方大师" },
    itemName: { cap: "探险帽", glasses: "圆眼镜", telescope: "观察望远镜", sparkles: "闪亮特效", crown: "金色王冠", goggles: "研究护目镜", wand: "魔法棒", medal: "挑战奖牌" }
  },
  ja: {
    levelUp: "キャラレベルアップ！", level: "Lv.{n}", charLevel: "キャラ Lv.{n}",
    gift: "新アイテム「{item}」ゲット！",
    stageName: { 1: "新芽の探検家", 2: "好奇心の観察者", 3: "つみき名探偵", 4: "きらめく図形家", 5: "キューブ騎士", 6: "図形研究家", 7: "魔法の建築家", 8: "キューブマスター" },
    itemName: { cap: "たんけん帽", glasses: "丸めがね", telescope: "観察望遠鏡", sparkles: "きらきら", crown: "金の王冠", goggles: "研究ゴーグル", wand: "魔法の杖", medal: "チャレンジメダル" }
  },
  en: {
    levelUp: "Character Level Up!", level: "Lv.{n}", charLevel: "My Lv.{n}",
    gift: "New item “{item}” unlocked!",
    stageName: { 1: "Sprout Explorer", 2: "Curious Observer", 3: "Cube Detective", 4: "Shining Builder", 5: "Cube Knight", 6: "Shape Researcher", 7: "Magic Architect", 8: "Cube Master" },
    itemName: { cap: "Explorer Cap", glasses: "Round Glasses", telescope: "Telescope", sparkles: "Sparkles", crown: "Golden Crown", goggles: "Lab Goggles", wand: "Magic Wand", medal: "Challenge Medal" }
  }
};

const dict = (lang) => TEXT[lang] || TEXT.ko;

function readRewards() {
  try {
    const list = JSON.parse(localStorage.getItem(REWARD_KEY) || "[]");
    return Array.isArray(list) ? list.filter((id) => typeof id === "string") : [];
  } catch {
    return [];
  }
}

// How many whole game levels have been cleared (all their problems solved).
export function computeClearedLevels() {
  const solved = new Set(readRewards());
  let cleared = 0;

  for (let li = 0; li < COPY_LEVELS; li += 1) {
    let count = 0;
    for (let pi = 0; pi < COPY_PER_LEVEL; pi += 1) {
      if (solved.has(`copy-build:${li}:${pi}`)) count += 1;
    }
    if (count >= COPY_PER_LEVEL) cleared += 1;
  }

  for (let n = 1; n <= COUNT_LEVELS; n += 1) {
    let count = 0;
    for (const id of solved) {
      if (id.startsWith(`count-cubes:height-l${n}-`)) count += 1;
    }
    if (count >= COUNT_PER_LEVEL) cleared += 1;
  }

  for (const lv of SHAPE_LEVELS) {
    let count = 0;
    for (let pi = 0; pi < SHAPE_PER_LEVEL; pi += 1) {
      if (solved.has(`shape-build:${lv}:${pi}`)) count += 1;
    }
    if (count >= SHAPE_PER_LEVEL) cleared += 1;
  }

  return cleared;
}

export const levelFor = (cleared) => Math.max(1, cleared + 1);
export const stageFor = (cleared) => Math.min(cleared, MAX_STAGE);

// Bring `profile.evolution`, gifts and colour up to date with cleared levels.
// Returns what NEWLY happened so callers can celebrate. Pure-additive; idempotent.
export function syncEvolution() {
  const profile = readProfile();
  const cleared = computeClearedLevels();
  const level = levelFor(cleared);
  const stage = stageFor(cleared);

  const prev = (profile.evolution && typeof profile.evolution === "object") ? profile.evolution : {};
  const firstSync = !Number.isFinite(Number(prev.cleared)) && !Number.isFinite(Number(prev.solved));
  const prevLevel = Number.isFinite(Number(prev.level)) ? Number(prev.level) : level;
  const prevStage = Number.isFinite(Number(prev.stage)) ? Number(prev.stage) : (firstSync ? stage : 0);

  profile.unlocked = Array.isArray(profile.unlocked) ? profile.unlocked : [];
  profile.equipped = (profile.equipped && typeof profile.equipped === "object") ? profile.equipped : {};
  const gifts = (prev.gifts && typeof prev.gifts === "object") ? { ...prev.gifts } : {};
  let autoColor = typeof prev.autoColor === "string" ? prev.autoColor : null;
  const colorLocked = Boolean(prev.colorLocked); // child chose their own colour → never override

  const earnedGifts = [];
  for (let s = 1; s <= stage; s += 1) {
    const step = EVOLUTION_STEPS[s - 1];
    if (!step) continue;
    const { category, id } = step.gift;
    if (!profile.unlocked.includes(id)) profile.unlocked.push(id);
    const occupant = profile.equipped[category];
    if (!occupant || occupant === gifts[category]) {
      profile.equipped[category] = id;
      gifts[category] = id;
    }
    if (!firstSync && s > prevStage) earnedGifts.push({ stage: s, id });
  }

  // Colour change on evolution — only when the child hasn't picked their own.
  if (!colorLocked && stage >= 1) {
    const targetColor = EVOLUTION_STEPS[stage - 1].color;
    const current = typeof profile.color === "string" ? profile.color : "original";
    if (current === "original" || current === autoColor) {
      profile.color = targetColor;
      autoColor = targetColor;
    }
  }

  const newStages = firstSync
    ? []
    : EVOLUTION_STEPS.map((_, i) => i + 1).filter((s) => s > prevStage && s <= stage);
  const leveledUp = !firstSync && level > prevLevel;

  profile.evolution = { cleared, stage, level, gifts, autoColor, colorLocked, updatedAt: Date.now() };
  writeProfile(profile);

  return { cleared, level, stage, prevLevel, prevStage, leveledUp, newStages, earnedGifts, firstSync, maxStage: MAX_STAGE, maxLevels: MAX_LEVELS };
}

export function getEvolution() {
  const profile = readProfile();
  const evo = (profile.evolution && typeof profile.evolution === "object") ? profile.evolution : {};
  const cleared = Number.isFinite(Number(evo.cleared)) ? Number(evo.cleared) : computeClearedLevels();
  return {
    cleared,
    level: Number(evo.level) || levelFor(cleared),
    stage: Number(evo.stage) || stageFor(cleared),
    maxStage: MAX_STAGE,
    maxLevels: MAX_LEVELS
  };
}

// Child equipped/removed a cosmetic themselves → stop auto-managing that slot.
export function releaseGiftSlot(profile, category) {
  if (profile && profile.evolution && profile.evolution.gifts) {
    delete profile.evolution.gifts[category];
  }
}

// Child picked their own colour → lock it so evolution never recolours again.
export function releaseColorLock(profile) {
  if (profile && profile.evolution && typeof profile.evolution === "object") {
    profile.evolution.colorLocked = true;
    profile.evolution.autoColor = null;
  }
}

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  stylesInjected = true;
  const style = document.createElement("style");
  style.id = "evo-styles";
  style.textContent = `
  /* Persistent level badge, pinned top-centre on every screen. */
  .evo-top-badge {
    position: fixed; top: 8px; left: 50%; transform: translateX(-50%);
    z-index: 8500; pointer-events: none;
    display: flex; align-items: center; gap: 5px;
    padding: 5px 15px; border-radius: 999px;
    border: 2px solid rgba(23,38,83,.85);
    background: linear-gradient(135deg, #ffe98a, #f6c445); color: #6b4300;
    font: 950 16px/1 "Pretendard","Noto Sans KR",system-ui,sans-serif;
    box-shadow: 0 3px 10px rgba(160,110,0,.32), inset 0 1px 0 rgba(255,255,255,.6);
    transition: transform .2s ease;
  }
  .evo-top-badge .evo-top-star { color: #e79c00; font-size: 15px; }
  .evo-top-badge.evo-top-max { background: linear-gradient(135deg, #fff1c0, #ffcf3a); border-color: #a9761a; }
  .evo-top-badge.evo-bump { animation: evo-badge-bump .6s cubic-bezier(.2,.9,.25,1); }
  @keyframes evo-badge-bump { 0%{transform:translateX(-50%) scale(1);} 35%{transform:translateX(-50%) scale(1.35);} 100%{transform:translateX(-50%) scale(1);} }

  /* Flashy level-up celebration. */
  .evo-celebrate { position: fixed; inset: 0; z-index: 9000; pointer-events: none; overflow: hidden; }
  .evo-confetti { position: absolute; top: -14px; left: 50%; width: 11px; height: 15px; border-radius: 2px; opacity: 0; }
  .evo-confetti.go { animation: evo-fall var(--dur,2200ms) cubic-bezier(.2,.6,.5,1) forwards; }
  @keyframes evo-fall {
    0% { opacity: 0; transform: translate(0,0) rotate(0deg) scale(.6); }
    8% { opacity: 1; }
    100% { opacity: 0; transform: translate(var(--dx,0), 86vh) rotate(var(--rot,540deg)) scale(1); }
  }
  .evo-toast {
    position: absolute; left: 50%; top: 20%; transform: translate(-50%, -12px);
    display: grid; justify-items: center; gap: 8px;
    padding: 20px 36px; border-radius: 22px;
    border: 3px solid #14683a; background: rgba(255,253,235,.98);
    box-shadow: 0 20px 46px rgba(23,38,83,.34), inset 0 2px 0 rgba(255,255,255,.75);
    color: #172653; font-family: "Pretendard","Noto Sans KR",system-ui,sans-serif;
    text-align: center; opacity: 0;
  }
  .evo-toast::before {
    content: ""; position: absolute; inset: -10px; border-radius: 30px; z-index: -1;
    background: radial-gradient(closest-side, rgba(255,214,80,.55), transparent 72%);
    animation: evo-ring 2.2s ease-out forwards;
  }
  @keyframes evo-ring { 0%{transform:scale(.4);opacity:0;} 20%{opacity:1;} 100%{transform:scale(1.5);opacity:0;} }
  .evo-toast.show { animation: evo-pop 2.6s cubic-bezier(.2,.8,.25,1) forwards; }
  .evo-toast .evo-head { font-size: clamp(22px,4.2vw,34px); font-weight: 950; letter-spacing: -.4px; color: #14683a; }
  .evo-toast .evo-lv {
    min-width: 104px; padding: 8px 24px; border-radius: 999px;
    background: linear-gradient(135deg,#ffe07a,#f4a71b); color: #5c3a00;
    font-size: clamp(30px,6vw,46px); font-weight: 950; line-height: 1.02;
    box-shadow: 0 5px 0 rgba(150,96,0,.35), inset 0 2px 0 rgba(255,255,255,.6);
    animation: evo-lv-pop 2.6s ease;
  }
  @keyframes evo-lv-pop { 0%,14%{transform:scale(.3) rotate(-8deg);} 26%{transform:scale(1.18) rotate(3deg);} 34%{transform:scale(1);} }
  .evo-toast .evo-sub { font-size: clamp(13px,2.2vw,16px); font-weight: 850; color: #2c9a50; }
  .evo-toast .evo-spark { font-size: clamp(26px,5vw,38px); }
  @keyframes evo-pop {
    0% { opacity: 0; transform: translate(-50%,6px) scale(.55); }
    9% { opacity: 1; transform: translate(-50%,-12px) scale(1.12); }
    18% { transform: translate(-50%,-12px) scale(1); }
    84% { opacity: 1; transform: translate(-50%,-12px) scale(1); }
    100% { opacity: 0; transform: translate(-50%,-24px) scale(.96); }
  }

  /* Bold, colour-shifting evolution aura — one distinct colour per level. */
  .evo-glow { position: relative; }
  .evo-glow-1 { filter: drop-shadow(0 0 8px rgba(88,196,122,.95)) drop-shadow(0 0 3px rgba(88,196,122,.7)); }
  .evo-glow-2 { filter: drop-shadow(0 0 8px rgba(70,195,208,.95)) drop-shadow(0 0 3px rgba(70,195,208,.7)); }
  .evo-glow-3 { filter: drop-shadow(0 0 9px rgba(91,140,255,.95)) drop-shadow(0 0 3px rgba(91,140,255,.7)); }
  .evo-glow-4 { filter: drop-shadow(0 0 9px rgba(176,107,255,.95)) drop-shadow(0 0 3px rgba(176,107,255,.7)); }
  .evo-glow-5 { filter: drop-shadow(0 0 10px rgba(255,194,61,1)) drop-shadow(0 0 4px rgba(255,150,40,.8)); }
  .evo-glow-6 { filter: drop-shadow(0 0 10px rgba(255,111,174,1)) drop-shadow(0 0 4px rgba(255,111,174,.8)); }
  .evo-glow-7 { filter: drop-shadow(0 0 10px rgba(255,138,61,1)) drop-shadow(0 0 4px rgba(255,138,61,.8)); }
  .evo-glow-8 { filter: drop-shadow(0 0 12px rgba(120,167,255,1)) drop-shadow(0 0 7px rgba(255,120,89,.85)) drop-shadow(0 0 4px rgba(255,196,64,.85)); }
  @media (prefers-reduced-motion: reduce) {
    .evo-toast.show, .evo-toast::before, .evo-toast .evo-lv, .evo-confetti.go, .evo-top-badge.evo-bump { animation: none; }
    .evo-toast.show { opacity: 1; }
  }`;
  document.head.append(style);
}

// Persistent "Lv.N" badge pinned to the top of the screen. Safe to call often.
// opts.left sets the horizontal centre (default "50%") so each game can dodge
// its own top-bar content.
export function updateLevelBadge(lang = "ko", opts = {}) {
  if (typeof document === "undefined") return;
  injectStyles();
  const evo = getEvolution();
  let badge = document.getElementById("evoTopBadge");
  if (!badge) {
    badge = document.createElement("div");
    badge.id = "evoTopBadge";
    badge.className = "evo-top-badge";
    document.body.append(badge);
  }
  if (opts.left) badge.style.left = opts.left;
  const label = dict(lang).charLevel.replace("{n}", evo.level);
  const prev = badge.dataset.level;
  badge.innerHTML = `<span class="evo-top-star" aria-hidden="true">★</span><span>${label}</span>`;
  badge.classList.toggle("evo-top-max", evo.stage >= evo.maxStage);
  if (prev !== undefined && prev !== String(evo.level)) {
    badge.classList.remove("evo-bump");
    void badge.offsetWidth;
    badge.classList.add("evo-bump");
  }
  badge.dataset.level = String(evo.level);
}

function launchConfetti(layer) {
  for (let i = 0; i < 22; i += 1) {
    const piece = document.createElement("span");
    piece.className = "evo-confetti";
    const dx = Math.round((Math.random() * 2 - 1) * 46);
    piece.style.left = `${20 + Math.random() * 60}%`;
    piece.style.background = CONFETTI_COLORS[i % CONFETTI_COLORS.length];
    piece.style.setProperty("--dx", `${dx}vw`);
    piece.style.setProperty("--rot", `${Math.round((Math.random() * 2 - 1) * 720)}deg`);
    piece.style.setProperty("--dur", `${1800 + Math.round(Math.random() * 900)}ms`);
    piece.style.animationDelay = `${Math.round(Math.random() * 220)}ms`;
    layer.append(piece);
    requestAnimationFrame(() => piece.classList.add("go"));
  }
}

// Flashy level-up celebration. No-op on migration and when nothing new happened.
export function celebrateEvolution(result, lang = "ko") {
  if (!result || result.firstSync || typeof document === "undefined") return;
  if (!result.leveledUp && (!result.newStages || result.newStages.length === 0)) return;
  injectStyles();
  updateLevelBadge(lang);
  const d = dict(lang);
  const topStage = (result.newStages && result.newStages.length) ? result.newStages[result.newStages.length - 1] : result.stage;
  const stageTitle = d.stageName[topStage] || "";
  const gift = (result.earnedGifts || []).slice(-1)[0];
  const giftLine = gift ? d.gift.replace("{item}", d.itemName[gift.id] || gift.id) : "";

  const layer = document.createElement("div");
  layer.className = "evo-celebrate";
  const toast = document.createElement("div");
  toast.className = "evo-toast";
  toast.setAttribute("role", "status");
  toast.innerHTML =
    `<span class="evo-spark">🎉</span>` +
    `<span class="evo-head">${d.levelUp}</span>` +
    `<span class="evo-lv">${d.level.replace("{n}", result.level)}</span>` +
    (stageTitle ? `<span class="evo-sub">${stageTitle}</span>` : "") +
    (giftLine ? `<span class="evo-sub">${giftLine}</span>` : "");
  layer.append(toast);
  document.body.append(layer);
  launchConfetti(layer);
  requestAnimationFrame(() => toast.classList.add("show"));
  window.setTimeout(() => layer.remove(), 2900);
}

export function applyCharacterGlow(el, stage) {
  if (!el) return;
  injectStyles();
  el.classList.add("evo-glow");
  for (let i = 1; i <= MAX_STAGE; i += 1) el.classList.remove(`evo-glow-${i}`);
  if (stage >= 1) el.classList.add(`evo-glow-${Math.min(stage, MAX_STAGE)}`);
}

export function stageName(stage, lang = "ko") {
  return dict(lang).stageName[stage] || "";
}

// "캐릭터 Lv.N" style label — clearly the CHARACTER's level, never a game level.
export function levelLabel(level, lang = "ko") {
  return dict(lang).charLevel.replace("{n}", level);
}
