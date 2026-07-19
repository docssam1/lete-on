// GFIELD Geometry World — character growth / evolution system.
//
// Design goals (hard constraints from the project owner):
//  * NEVER overwrite or destroy the existing `gfield-profile` schema.
//    We only ADD one new field (`profile.evolution`) and APPEND to the
//    already-present `unlocked` / `equipped` structures.
//  * A returning player who already solved problems is migrated silently:
//    their earned level/stage/gifts are applied on first sync, with no popup.
//  * Cosmetic gifts auto-equip ONLY into a slot that is empty or that still
//    holds a previous evolution gift. A slot the child chose themselves in the
//    Point Mall is never touched (world-map clears the gift flag on manual equip).
//
// "Solved problems" are counted from `gfield-rewarded-games` — the same set the
// two games already write one entry to per correctly-finished problem. So the
// total is a reliable, already-tracked signal that needs no new bookkeeping.

import { readProfile, writeProfile } from "./profile-storage.js?v=evolve-20260719a";

const REWARD_KEY = "gfield-rewarded-games";
const SOLVE_PREFIXES = ["copy-build:", "count-cubes:"];

// One player level per this many solved problems (min level 1).
export const LEVEL_STEP = 5;

// Evolution stages — bigger milestones that grant a visible cosmetic gift.
// Gift slots are ordered to prefer categories that are EMPTY by default
// (the default profile only fills the `badge` slot), so the gifts actually
// show on the character. The final stage upgrades the hat it already gave.
export const EVOLUTION_STAGES = [
  { stage: 1, need: 3,  gift: { category: "hat",  id: "cap" } },
  { stage: 2, need: 8,  gift: { category: "face", id: "glasses" } },
  { stage: 3, need: 16, gift: { category: "hand", id: "telescope" } },
  { stage: 4, need: 28, gift: { category: "aura", id: "sparkles" } },
  { stage: 5, need: 42, gift: { category: "hat",  id: "crown" } }
];

export const MAX_STAGE = EVOLUTION_STAGES[EVOLUTION_STAGES.length - 1].stage;

const TEXT = {
  ko: {
    levelUp: "레벨 업!", level: "Lv.{n}",
    evolved: "큐비가 진화했어요!",
    gift: "새 아이템 “{item}” 획득!",
    stageName: { 1: "새싹 탐험가", 2: "호기심 관찰가", 3: "쌓기 명탐정", 4: "반짝이는 도형가", 5: "큐브 마스터" },
    itemName: { cap: "탐험 모자", glasses: "둥근 안경", telescope: "관찰 망원경", sparkles: "반짝 효과", crown: "황금 왕관" }
  },
  zh: {
    levelUp: "升级了！", level: "Lv.{n}",
    evolved: "库比进化了！",
    gift: "获得新道具“{item}”！",
    stageName: { 1: "新芽探险家", 2: "好奇观察家", 3: "积木名侦探", 4: "闪耀几何家", 5: "立方大师" },
    itemName: { cap: "探险帽", glasses: "圆眼镜", telescope: "观察望远镜", sparkles: "闪亮特效", crown: "金色王冠" }
  },
  ja: {
    levelUp: "レベルアップ！", level: "Lv.{n}",
    evolved: "キュービが進化した！",
    gift: "新アイテム「{item}」ゲット！",
    stageName: { 1: "新芽の探検家", 2: "好奇心の観察者", 3: "つみき名探偵", 4: "きらめく図形家", 5: "キューブマスター" },
    itemName: { cap: "たんけん帽", glasses: "丸めがね", telescope: "観察望遠鏡", sparkles: "きらきら", crown: "金の王冠" }
  },
  en: {
    levelUp: "Level Up!", level: "Lv.{n}",
    evolved: "Cubi evolved!",
    gift: "New item “{item}” unlocked!",
    stageName: { 1: "Sprout Explorer", 2: "Curious Observer", 3: "Cube Detective", 4: "Shining Builder", 5: "Cube Master" },
    itemName: { cap: "Explorer Cap", glasses: "Round Glasses", telescope: "Telescope", sparkles: "Sparkles", crown: "Golden Crown" }
  }
};

function dict(lang) {
  return TEXT[lang] || TEXT.ko;
}

export function computeSolvedCount() {
  let list;
  try {
    list = JSON.parse(localStorage.getItem(REWARD_KEY) || "[]");
  } catch {
    list = [];
  }
  if (!Array.isArray(list)) return 0;
  return list.filter((id) => typeof id === "string" && SOLVE_PREFIXES.some((p) => id.startsWith(p))).length;
}

export function levelFor(solved) {
  return Math.floor(Math.max(0, solved) / LEVEL_STEP) + 1;
}

export function stageFor(solved) {
  let stage = 0;
  for (const step of EVOLUTION_STAGES) {
    if (solved >= step.need) stage = step.stage;
  }
  return stage;
}

// Bring `profile.evolution` and the earned gifts up to date with the current
// solved count. Returns a summary describing what NEWLY happened, so the caller
// can celebrate. Pure-additive persistence; safe to call as often as you like.
export function syncEvolution() {
  const profile = readProfile();
  const solved = computeSolvedCount();
  const level = levelFor(solved);
  const stage = stageFor(solved);

  const prev = (profile.evolution && typeof profile.evolution === "object") ? profile.evolution : {};
  const firstSync = !Number.isFinite(Number(prev.solved));
  const prevLevel = Number.isFinite(Number(prev.level)) ? Number(prev.level) : level;
  const prevStage = Number.isFinite(Number(prev.stage)) ? Number(prev.stage) : (firstSync ? stage : 0);

  // Ensure the containers we append to exist, without discarding what's there.
  profile.unlocked = Array.isArray(profile.unlocked) ? profile.unlocked : [];
  profile.equipped = (profile.equipped && typeof profile.equipped === "object") ? profile.equipped : {};
  const gifts = (prev.gifts && typeof prev.gifts === "object") ? { ...prev.gifts } : {};

  const earnedGifts = [];
  for (const step of EVOLUTION_STAGES) {
    if (solved < step.need) continue;
    const { category, id } = step.gift;
    if (!profile.unlocked.includes(id)) profile.unlocked.push(id);
    const occupant = profile.equipped[category];
    // Auto-equip only when the slot is empty or still holds our own prior gift,
    // so a cosmetic the child deliberately chose is never overridden.
    if (!occupant || occupant === gifts[category]) {
      profile.equipped[category] = id;
      gifts[category] = id;
    }
    if (!firstSync && step.stage > prevStage) earnedGifts.push({ stage: step.stage, id });
  }

  const newStages = firstSync
    ? []
    : EVOLUTION_STAGES.filter((s) => s.stage > prevStage && s.stage <= stage).map((s) => s.stage);
  const leveledUp = !firstSync && level > prevLevel;

  profile.evolution = { stage, level, solved, gifts, updatedAt: Date.now() };
  writeProfile(profile);

  return { solved, level, stage, prevLevel, prevStage, leveledUp, newStages, earnedGifts, firstSync, maxStage: MAX_STAGE };
}

// Read-only snapshot for display (no side effects).
export function getEvolution() {
  const profile = readProfile();
  const evo = (profile.evolution && typeof profile.evolution === "object") ? profile.evolution : {};
  const solved = Number.isFinite(Number(evo.solved)) ? Number(evo.solved) : computeSolvedCount();
  return {
    solved,
    level: Number(evo.level) || levelFor(solved),
    stage: Number(evo.stage) || stageFor(solved),
    maxStage: MAX_STAGE
  };
}

// When the child equips/removes a cosmetic themselves, drop our gift claim on
// that slot so future evolutions respect their choice permanently.
export function releaseGiftSlot(profile, category) {
  if (profile && profile.evolution && profile.evolution.gifts) {
    delete profile.evolution.gifts[category];
  }
}

let stylesInjected = false;
function injectStyles() {
  if (stylesInjected || typeof document === "undefined") return;
  stylesInjected = true;
  const style = document.createElement("style");
  style.id = "evo-styles";
  style.textContent = `
  .evo-toast {
    position: fixed; left: 50%; top: 16%; z-index: 9000;
    transform: translate(-50%, -12px); pointer-events: none;
    display: grid; justify-items: center; gap: 6px;
    padding: 14px 26px; border-radius: 16px;
    border: 3px solid #14683a; background: rgba(255,253,235,.98);
    box-shadow: 0 14px 34px rgba(23,38,83,.28), inset 0 2px 0 rgba(255,255,255,.7);
    color: #172653; font-family: "Pretendard","Noto Sans KR",system-ui,sans-serif;
    text-align: center; opacity: 0;
  }
  .evo-toast.show { animation: evo-pop 2.1s cubic-bezier(.2,.8,.25,1) forwards; }
  .evo-toast strong { font-size: clamp(18px,3.4vw,26px); font-weight: 950; letter-spacing: -.3px; }
  .evo-toast .evo-sub { font-size: clamp(12px,2vw,15px); font-weight: 850; color: #2c9a50; }
  .evo-toast .evo-badge {
    min-width: 46px; padding: 3px 12px; border-radius: 999px;
    background: linear-gradient(135deg,#ffd85a,#f4a71b); color: #5c3a00;
    font-size: clamp(15px,2.6vw,20px); font-weight: 950;
    box-shadow: 0 3px 0 rgba(150,96,0,.35);
  }
  .evo-toast .evo-spark { font-size: clamp(20px,4vw,30px); }
  @keyframes evo-pop {
    0% { opacity: 0; transform: translate(-50%,-4px) scale(.7); }
    12% { opacity: 1; transform: translate(-50%,-12px) scale(1.06); }
    22% { transform: translate(-50%,-12px) scale(1); }
    80% { opacity: 1; transform: translate(-50%,-12px) scale(1); }
    100% { opacity: 0; transform: translate(-50%,-20px) scale(.96); }
  }
  /* Character glow tiers — applied to sprite host elements on the world map. */
  .evo-glow { position: relative; }
  .evo-glow-1 { filter: drop-shadow(0 0 5px rgba(126,214,150,.7)); }
  .evo-glow-2 { filter: drop-shadow(0 0 6px rgba(96,197,209,.75)); }
  .evo-glow-3 { filter: drop-shadow(0 0 8px rgba(120,167,255,.8)); }
  .evo-glow-4 { filter: drop-shadow(0 0 9px rgba(214,140,255,.82)); }
  .evo-glow-5 { filter: drop-shadow(0 0 11px rgba(255,196,64,.9)) drop-shadow(0 0 4px rgba(255,120,89,.7)); }
  @media (prefers-reduced-motion: reduce) {
    .evo-toast.show { animation: none; opacity: 1; }
  }`;
  document.head.append(style);
}

// Show a transient celebration for a syncEvolution() result. No-op on migration
// (firstSync) and when nothing new happened.
export function celebrateEvolution(result, lang = "ko") {
  if (!result || result.firstSync || typeof document === "undefined") return;
  if (!result.leveledUp && (!result.newStages || result.newStages.length === 0)) return;
  injectStyles();
  const d = dict(lang);
  const evolved = result.newStages && result.newStages.length > 0;
  const topStage = evolved ? result.newStages[result.newStages.length - 1] : 0;

  const toast = document.createElement("div");
  toast.className = "evo-toast";
  toast.setAttribute("role", "status");

  const heading = evolved ? d.evolved : d.levelUp;
  let subLine = d.level.replace("{n}", result.level);
  if (evolved && d.stageName[topStage]) subLine = d.stageName[topStage];

  const gift = evolved ? (result.earnedGifts || []).slice(-1)[0] : null;
  const giftLine = gift ? d.gift.replace("{item}", d.itemName[gift.id] || gift.id) : "";

  toast.innerHTML =
    `<span class="evo-spark">${evolved ? "✨" : "⭐"}</span>` +
    `<strong>${heading}</strong>` +
    `<span class="evo-badge">${d.level.replace("{n}", result.level)}</span>` +
    `<span class="evo-sub">${subLine}</span>` +
    (giftLine ? `<span class="evo-sub">${giftLine}</span>` : "");

  document.body.append(toast);
  requestAnimationFrame(() => toast.classList.add("show"));
  window.setTimeout(() => toast.remove(), 2300);
}

// Apply the glow tier for a stage to a sprite host element.
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
