export const CHARACTER_PROFILES = [
  { id:'ari', names:{ko:'아리',zh:'Ari',ja:'アリ',en:'Ari'}, icon:'🧭', skin:'#e8b58d', hair:'#3f2c24', jacket:'#3d8164', scarf:'#e06855', hat:'explorer' },
  { id:'luca', names:{ko:'루카',zh:'Luca',ja:'ルカ',en:'Luca'}, icon:'🌍', skin:'#a96f4f', hair:'#211914', jacket:'#3f6f9d', scarf:'#efb04e', hat:'cap' },
  { id:'mina', names:{ko:'미나',zh:'Mina',ja:'ミナ',en:'Mina'}, icon:'📚', skin:'#f0c6a2', hair:'#6b3d2a', jacket:'#8a5ca4', scarf:'#6abf9b', hat:'beret' },
  { id:'yujun', names:{ko:'유준',zh:'Yujun',ja:'Yujun',en:'Yujun'}, icon:'🗺️', skin:'#dca37d', hair:'#26201d', jacket:'#238778', scarf:'#ed7c45', hat:'explorer' },
  { id:'yubin', names:{ko:'유빈',zh:'Yubin',ja:'Yubin',en:'Yubin'}, icon:'🔭', skin:'#efc2a0', hair:'#593728', jacket:'#7c5aa6', scarf:'#e5b744', hat:'beret' }
];

export const HAT_OPTIONS = [
  { id:'none', names:{ko:'모자 없음',zh:'无帽子',ja:'帽子なし',en:'No hat'}, icon:'✨', cost:0 },
  { id:'explorer', names:{ko:'탐험 모자',zh:'探险帽',ja:'探検帽',en:'Explorer hat'}, icon:'🧢', cost:0 },
  { id:'cap', names:{ko:'여행 캡',zh:'旅行帽',ja:'トラベルキャップ',en:'Travel cap'}, icon:'🧢', cost:0 },
  { id:'beret', names:{ko:'문화 베레모',zh:'贝雷帽',ja:'ベレー帽',en:'Culture beret'}, icon:'🎨', cost:0 },
  { id:'crown', names:{ko:'세계 왕관',zh:'世界王冠',ja:'世界の王冠',en:'World crown'}, icon:'👑', cost:180 },
  { id:'safari', names:{ko:'사파리 모자',zh:'猎游帽',ja:'サファリ帽',en:'Safari hat'}, icon:'🤠', cost:140 },
  { id:'wizard', names:{ko:'별빛 마법사',zh:'星光法师帽',ja:'星の魔法使い帽',en:'Starlight wizard'}, icon:'🧙', cost:220 }
];

const KEY='gfield-world-character-v2';
export function profileFor(id){ return CHARACTER_PROFILES.find(p=>p.id===id)||CHARACTER_PROFILES[0]; }
export function loadCharacterState(){
  try { return { profile:'ari', hat:'explorer', ownedHats:['none','explorer','cap','beret'], ...JSON.parse(localStorage.getItem(KEY)||'{}') }; }
  catch { return { profile:'ari', hat:'explorer', ownedHats:['none','explorer','cap','beret'] }; }
}
export function saveCharacterState(state){ localStorage.setItem(KEY,JSON.stringify(state)); }
export function displayName(profile,lang='ko'){ return profile.names[lang]||profile.names.en; }
