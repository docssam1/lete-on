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
  }
];

export const SKIN_PRESETS = [0xf5d0b4, 0xe2ad84, 0xc98760, 0x9c6547, 0x70452f];
export const HAIR_PRESETS = [0x201a18, 0x4b3025, 0x7a4a28, 0xb07c42, 0x2c2938];
export const JACKET_PRESETS = [0x3d8164, 0x376f9f, 0xd89a35, 0x9a5e91, 0xc5524b];
export const SCARF_PRESETS = [0xe06855, 0x4a83a6, 0xe1b84b, 0x58a46b, 0x9a5e91];

export const HAT_OPTIONS = [
  { id: 'cap', icon: '🧢', name: { ko: '탐험 캡', zh: '探险帽', ja: '探検キャップ', en: 'Explorer cap' } },
  { id: 'round', icon: '👒', name: { ko: '기록가 모자', zh: '记录员帽', ja: '記録家の帽子', en: 'Journal hat' } },
  { id: 'wide', icon: '🤠', name: { ko: '지도 제작자 모자', zh: '制图师帽', ja: '地図製作者の帽子', en: 'Cartographer hat' } },
  { id: 'none', icon: '🙂', name: { ko: '모자 없음', zh: '不戴帽子', ja: '帽子なし', en: 'No hat' } }
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
    hat: p.hat
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
