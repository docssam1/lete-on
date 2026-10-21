/* Numbers of Magic — 사람 아바타 외형/의상 카탈로그 (NM_HUMANS)
   looks: 무료 프리셋 8종(boy/girl = 원본 아트 그대로, 나머지 6종 = 피부·머리·옷 팔레트 변형)
   outfits: 원본(빈 팔레트) + 옷 스타일 8종 — 3D(char3d PALETTES 필드)와 SVG(walker PALETTE 필드) 양쪽에 색이 반영된다.
   이름은 프리셋 id가 아니라 사용자가 입력한 free text(clean 참고). 표시 문구는 호출 측에서 item[lang]. */
(function(root){
'use strict';

function h2r(hex){hex=hex.replace('#','');return [0,2,4].map(i=>parseInt(hex.slice(i,i+2),16));}
function shade(hex,amt){ // amt>0 밝게, <0 어둡게(0~255 단위 가감)
  return '#'+h2r(hex).map(v=>Math.max(0,Math.min(255,Math.round(v+amt))).toString(16).padStart(2,'0')).join('');
}

/* look(kind, 피부/머리/눈/옷) → 3D·SVG 팔레트 */
function look(id,kind,ko,en,zh,c){
  const girl = kind==='girl';
  const main=c.cloth, dk=shade(main,-45);
  const pal3 = { skin:c.skin, hair:c.hair, iris:c.eyes,
    outfit:main, outfit2:dk, trim:c.trim, shirt:c.shirt, shoe:main, sole:c.sole };
  const palW = { skin:c.skin, hair:c.hair, hairHi:shade(c.hair,28), hairDk:shade(c.hair,-30), eyes:c.eyes,
    robe:main, robeDk:dk, trim:c.trim, boot:main, bootDk:dk, bootAccent:c.trim,
    accent:shade(main,-20), accentDk:shade(main,-60) };
  if(girl){ pal3.bow=c.trim; palW.bow=c.trim; }
  else { pal3.leg=c.skin; palW.leg=main; palW.legDk=dk; }
  return { id, kind, ko, en, zh, palette:pal3, walkerPalette:palW };
}

const LOOKS = [
  { id:'boy',  kind:'boy',  ko:'파랑 마법사', en:'Blue wizard', zh:'蓝色魔法师', palette:{}, walkerPalette:{} },
  { id:'girl', kind:'girl', ko:'보라 마법사', en:'Violet wizard', zh:'紫色魔法师', palette:{}, walkerPalette:{} },
  look('forest-boy','boy','청록 탐험가','Teal explorer','青绿探险家',
    {skin:'#e9b98a',hair:'#1f1a1a',eyes:'#5a3b22',cloth:'#1f9a8a',trim:'#f4c542',shirt:'#f3efe6',sole:'#f3efe6'}),
  look('sunset-girl','girl','노을 탐험가','Sunset explorer','晚霞探险家',
    {skin:'#c68a5c',hair:'#241a17',eyes:'#4a2e1c',cloth:'#e9782c',trim:'#fff1b8',shirt:'#fff1dc',sole:'#7a3a12'}),
  look('ginger-boy','boy','구름 탐험가','Cloud explorer','云朵探险家',
    {skin:'#ffe0cc',hair:'#c2531f',eyes:'#2f7f5a',cloth:'#5b6b82',trim:'#f4c542',shirt:'#e8edf4',sole:'#e8edf4'}),
  look('blonde-girl','girl','딸기 탐험가','Berry explorer','莓果探险家',
    {skin:'#ffe3d0',hair:'#e8b94a',eyes:'#3b8be8',cloth:'#e8588f',trim:'#ffffff',shirt:'#ffe3ee',sole:'#a62d5c'}),
  look('night-boy','boy','별빛 탐험가','Starlight explorer','星光探险家',
    {skin:'#8d5a3b',hair:'#1a2548',eyes:'#2b1a10',cloth:'#c0392b',trim:'#ffd24d',shirt:'#f3efe6',sole:'#f3efe6'}),
  look('mint-girl','girl','민트 탐험가','Mint explorer','薄荷探险家',
    {skin:'#d9a878',hair:'#5a3220',eyes:'#6b4a2e',cloth:'#2fb58a',trim:'#fff6c2',shirt:'#e6fff5',sole:'#1c6b53'})
];

/* outfit(main, trim, shirt, shoe) — 옷 색/트림/신발이 SVG·3D 모두에서 바뀐다 */
function outfit(id,ko,en,zh,price,c){
  const dk=shade(c.main,-45);
  return { id, ko, en, zh, price, free:price===0,
    palette:{ outfit:c.main, outfit2:dk, trim:c.trim, shirt:c.shirt, shoe:c.shoe, sole:c.sole, bow:c.trim },
    walkerPalette:{ robe:c.main, robeDk:dk, trim:c.trim, boot:c.shoe, bootDk:shade(c.shoe,-45), bootAccent:c.trim,
      accent:shade(c.main,-20), accentDk:shade(c.main,-60), bow:c.trim } };
}
const OUTFITS = [
  { id:'original', ko:'원래 옷', en:'Original outfit', zh:'原来的衣服', price:0, free:true, palette:{}, walkerPalette:{} },
  outfit('sunny','해바라기 옷','Sunflower outfit','向日葵装',0,{main:'#f2b632',trim:'#ffffff',shirt:'#fff6d6',shoe:'#c9780f',sole:'#fff6d6'}),
  outfit('meadow','초원 옷','Meadow outfit','草地装',0,{main:'#4caf50',trim:'#fff3a0',shirt:'#eaf7dc',shoe:'#2e7d32',sole:'#eaf7dc'}),
  outfit('ocean','바다 옷','Ocean outfit','海洋装',10,{main:'#1e88e5',trim:'#ffffff',shirt:'#e3f2ff',shoe:'#0d47a1',sole:'#e3f2ff'}),
  outfit('berry','딸기 옷','Berry outfit','莓果装',15,{main:'#d81b72',trim:'#ffe0f0',shirt:'#ffe9f3',shoe:'#7b1050',sole:'#ffe9f3'}),
  outfit('ember','노을 옷','Sunset outfit','晚霞装',20,{main:'#e8581c',trim:'#ffd166',shirt:'#fff0dc',shoe:'#6d2a0c',sole:'#fff0dc'}),
  outfit('royal','왕자·공주 옷','Royal outfit','王室装',30,{main:'#6a3fc4',trim:'#ffd34d',shirt:'#efe6ff',shoe:'#3a1f7a',sole:'#ffd34d'}),
  outfit('snow','눈꽃 옷','Snowflake outfit','雪花装',40,{main:'#9fc4e8',trim:'#ffffff',shirt:'#ffffff',shoe:'#5f86b0',sole:'#ffffff'}),
  outfit('starry','별밤 옷','Starry-night outfit','星夜装',55,{main:'#1f2a5e',trim:'#ffd84a',shirt:'#c9d3ff',shoe:'#0f1638',sole:'#ffd84a'})
];

function byId(list,id){ for(let i=0;i<list.length;i++) if(list[i].id===id) return list[i]; return null; }

function cleanName(v){
  if(typeof v!=='string') return '';
  let s=v;
  try{ s=s.normalize('NFC'); }catch(e){}
  // 제어문자(Cc)·서식/양방향 제어(Cf)·줄/문단 구분자 제거 후 공백 정리
  s=s.replace(/[\p{Cc}\p{Cf}\u2028\u2029]/gu,'').replace(/\s+/g,' ').trim();
  s=Array.from(s).slice(0,16).join('').trim();
  return s;
}
function cleanId(v){
  const s=(typeof v==='string'||typeof v==='number') ? String(v).replace(/[^A-Za-z0-9_.-]/g,'').slice(0,60) : '';
  return s||'legacy';
}

function clean(raw){
  if(typeof raw==='string') raw={kind:raw, look:raw};
  if(!raw || typeof raw!=='object') raw={};
  const rk = (raw.kind==='girl') ? 'girl' : 'boy';
  const lk = byId(LOOKS, raw.look) || byId(LOOKS, rk);
  const ot = byId(OUTFITS, raw.outfit) || OUTFITS[0];
  return { id:cleanId(raw.id), name:cleanName(raw.name), kind:lk.kind, look:lk.id, outfit:ot.id };
}

function model(raw){
  const c=clean(raw), lk=byId(LOOKS,c.look), ot=byId(OUTFITS,c.outfit);
  return { kind:lk.kind, palette:Object.assign({}, lk.palette, ot.palette) };
}
function walker(raw){
  const c=clean(raw), lk=byId(LOOKS,c.look), ot=byId(OUTFITS,c.outfit);
  const p=Object.assign({}, lk.walkerPalette, ot.walkerPalette);
  if(lk.kind==='boy' && ot.id!=='original'){ p.leg=ot.walkerPalette.robe; p.legDk=ot.walkerPalette.robeDk; }
  return { kind:lk.kind, palette:p };
}

const api = { looks:LOOKS, outfits:OUTFITS, clean, model, walker };
root.NM_HUMANS = api;
if(typeof module!=='undefined' && module.exports) module.exports = api;
})(typeof window!=='undefined' ? window : globalThis);
