export const CHARACTER_PROFILES = [
  {
    id: 'ari', name: { ko: '아리', zh: '阿丽', ja: 'アリ', en: 'Ari' },
    role: { ko: '균형 잡힌 세계 탐험가', zh: '全能型世界探险家', ja: 'バランス型の世界探検家', en: 'All-round world explorer' },
    skin: 0xf2c8a5, hair: 0x3f2c24, jacket: 0x3d8164, jacketDark: 0x285c48, scarf: 0xe06855, trousers: 0x314f66, backpack: 0x9a5d32,
    hairStyle: 'short', hat: 'cap'
  },
  {
    id: 'mina', name: { ko: '미나', zh: '米娜', ja: 'ミナ', en: 'Mina' },
    role: { ko: '문화와 기록을 좋아하는 탐험가', zh: '热爱文化与记录的探险家', ja: '文化と記録が好きな探検家', en: 'Culture and journal explorer' },
    skin: 0xd99d73, hair: 0x241c1a, jacket: 0xd89a35, jacketDark: 0xa86724, scarf: 0x4a83a6, trousers: 0x464b65, backpack: 0x865632,
    hairStyle: 'bob', hat: 'round'
  },
  {
    id: 'luca', name: { ko: '루카', zh: '卢卡', ja: 'ルカ', en: 'Luca' },
    role: { ko: '지도와 길 찾기에 능숙한 탐험가', zh: '擅长地图与寻路的探险家', ja: '地図と道探しが得意な探検家', en: 'Map and navigation explorer' },
    skin: 0x8f5d3f, hair: 0x1f1b19, jacket: 0x376f9f, jacketDark: 0x254b70, scarf: 0xe1b84b, trousers: 0x283b50, backpack: 0x6f4932,
    hairStyle: 'curly', hat: 'wide'
  },
  {
    id: 'sora', name: { ko: '소라', zh: '索拉', ja: 'ソラ', en: 'Sora' },
    role: { ko: '하늘과 날씨를 관찰하는 탐험가', zh: '观察天空的探险家', ja: '空を観察する探検家', en: 'Sky-watching explorer' },
    skin: 0xeec19a, hair: 0x4a3626, jacket: 0x4a83a6, jacketDark: 0x35617a, scarf: 0xf0c457, trousers: 0x3a4a5f, backpack: 0x7a5a3a,
    hairStyle: 'short', hat: 'round', npcOnly: true
  },
  {
    id: 'robin', name: { ko: '로빈', zh: '罗宾', ja: 'ロビン', en: 'Robin' },
    role: { ko: '식물과 동물을 채집하는 탐험가', zh: '采集植物和动物的探险家', ja: '動植物を集める探検家', en: 'Nature-collecting explorer' },
    skin: 0xc98760, hair: 0x2c2938, jacket: 0x5b8d69, jacketDark: 0x3f6349, scarf: 0x9a5e91, trousers: 0x39493a, backpack: 0x6f4932,
    hairStyle: 'curly', hat: 'wide', npcOnly: true
  }
];

export const SKIN_PRESETS = [0xf5d0b4, 0xe2ad84, 0xc98760, 0x9c6547, 0x70452f];
export const HAIR_PRESETS = [0x201a18, 0x4b3025, 0x7a4a28, 0xb07c42, 0x2c2938];
export const JACKET_PRESETS = [0x3d8164, 0x376f9f, 0xd89a35, 0x9a5e91, 0xc5524b];
export const SCARF_PRESETS = [0xe06855, 0x4a83a6, 0xe1b84b, 0x58a46b, 0x9a5e91];

export const HAT_OPTIONS = [
  { id: 'cap', icon: '🧢', name: { ko: '탐험 캡', zh: '探险帽', ja: '探検キャップ', en: 'Explorer cap' }, price: 0 },
  { id: 'round', icon: '👒', name: { ko: '기록가 모자', zh: '记录员帽', ja: '記録家の帽子', en: 'Journal hat' }, price: 0 },
  { id: 'wide', icon: '🤠', name: { ko: '지도 제작자 모자', zh: '制图师帽', ja: '地図製作者の帽子', en: 'Cartographer hat' }, price: 0 },
  { id: 'none', icon: '🙂', name: { ko: '모자 없음', zh: '不戴帽子', ja: '帽子なし', en: 'No hat' }, price: 0 },
  { id: 'crown', icon: '👑', name: { ko: '탐험왕 왕관', zh: '探险王冠', ja: '探検王の王冠', en: 'Explorer crown' }, price: 120 },
  { id: 'safari', icon: '🪖', name: { ko: '사파리 헬멧', zh: '野外探险盔', ja: 'サファリヘルメット', en: 'Safari helmet' }, price: 80 },
  { id: 'wizard', icon: '🧙', name: { ko: '마법사 모자', zh: '魔法师帽', ja: '魔法使いの帽子', en: 'Wizard hat' }, price: 150 }
];

export const COMPANION_SKINS = [
  { id: 'classic', icon: '🟫', wood: 0xe2b45c, dark: 0x76502d, name: { ko: '큐비(기본)', zh: 'Qubi(经典)', ja: 'キュービ（きほん）', en: 'Cubi (classic)' }, price: 0 },
  { id: 'sky', icon: '🟦', wood: 0x6fb0d9, dark: 0x2f5a76, name: { ko: '하늘 큐비', zh: '天空Qubi', ja: 'そらのキュービ', en: 'Sky Cubi' }, price: 60 },
  { id: 'blossom', icon: '🌸', wood: 0xe98fae, dark: 0x9c4d68, name: { ko: '벚꽃 큐비', zh: '樱花Qubi', ja: 'さくらのキュービ', en: 'Blossom Cubi' }, price: 90 },
  { id: 'shadow', icon: '⬛', wood: 0x4a4652, dark: 0x201e26, name: { ko: '그림자 큐비', zh: '暗影Qubi', ja: 'かげのキュービ', en: 'Shadow Cubi' }, price: 140 }
];

const KEY = 'gfield-world-character-v2';

export function defaultCharacterState() {
  const p = CHARACTER_PROFILES[0];
  return {
    profileId: p.id,
    skin: p.skin,
    hair: p.hair,
    jacket: p.jacket,
    scarf: p.scarf,
    hat: p.hat,
    companionSkin: 'classic',
    playerName: ''
  };
}

export function loadCharacterState() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { ...defaultCharacterState(), ...saved };
  } catch {
    return defaultCharacterState();
  }
}

export function saveCharacterState(state) {
  localStorage.setItem(KEY, JSON.stringify(state));
}

export function applyProfile(state, profileId) {
  const p = CHARACTER_PROFILES.find(item => item.id === profileId) || CHARACTER_PROFILES[0];
  return {
    ...state,
    profileId: p.id,
    skin: p.skin,
    hair: p.hair,
    jacket: p.jacket,
    scarf: p.scarf,
    hat: p.hat
  };
}

export function profileFor(state) {
  return CHARACTER_PROFILES.find(item => item.id === state.profileId) || CHARACTER_PROFILES[0];
}
