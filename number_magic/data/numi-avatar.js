/* Numbers of Magic — 캐릭터 꾸미기 아이템 데이터 */
(function(){
'use strict';

window.NM_AVATAR = {
  /* 오라(캐릭터 뒤 글로우) 색 — 캐릭터 몸 색은 아트에 내장 */
  colors:[
    {id:'blue',   ko:'하늘',en:'Sky',   zh:'天蓝',fg:'#2980b9',bg:'#d6eaf8',free:true},
    {id:'green',  ko:'초록',en:'Green', zh:'绿',  fg:'#27ae60',bg:'#d5f5e3',free:true},
    {id:'red',    ko:'빨강',en:'Red',   zh:'红',  fg:'#e74c3c',bg:'#fadbd8',free:true},
    {id:'gold',   ko:'황금',en:'Gold',  zh:'金',  fg:'#e6ac00',bg:'#fef9e7',price:15},
    {id:'purple', ko:'보라',en:'Purple',zh:'紫',  fg:'#8e44ad',bg:'#f5eef8',price:15},
    {id:'pink',   ko:'분홍',en:'Pink',  zh:'粉',  fg:'#e91e8c',bg:'#fce4f5',price:20},
    {id:'teal',   ko:'청록',en:'Teal',  zh:'青绿',fg:'#1abc9c',bg:'#d1f2eb',price:20},
    {id:'navy',   ko:'남색',en:'Navy',  zh:'深蓝',fg:'#2c3e50',bg:'#d6e4f0',price:25},
  ],
  bgs:[
    {id:'plain',   ko:'깔끔',  en:'Plain',   zh:'简洁',free:true},
    {id:'stars',   ko:'별',    en:'Stars',   zh:'星星',price:10},
    {id:'hearts',  ko:'하트',  en:'Hearts',  zh:'爱心',price:10},
    {id:'sparks',  ko:'반짝',  en:'Sparkle', zh:'闪耀',price:15},
    {id:'rainbow', ko:'무지개',en:'Rainbow', zh:'彩虹',price:25},
    {id:'magic',   ko:'마법',  en:'Magic',   zh:'魔法',price:40},
  ],
  /* 망토 — 캐릭터 뒤에 걸치는 액세서리 (신발·무늬와 별개로 코인 잠금) */
  capes:[
    {id:'none',   ko:'없음',    en:'None',       zh:'无',   free:true},
    {id:'red',    ko:'빨강 망토',en:'Red Cape',   zh:'红斗篷',fg:'#e74c3c',price:20},
    {id:'blue',   ko:'파랑 망토',en:'Blue Cape',  zh:'蓝斗篷',fg:'#2980b9',price:20},
    {id:'green',  ko:'초록 망토',en:'Green Cape', zh:'绿斗篷',fg:'#27ae60',price:20},
    {id:'gold',   ko:'황금 망토',en:'Gold Cape',  zh:'金斗篷',fg:'#e6ac00',price:35},
    {id:'purple', ko:'보라 망토',en:'Purple Cape',zh:'紫斗篷',fg:'#8e44ad',price:35},
    {id:'rainbow',ko:'무지개 망토',en:'Rainbow Cape',zh:'彩虹斗篷',price:60},
  ],
  /* 캐릭터 숫자 — 0~9 무료, 10 이상은 두 자리 수 "특별 보상"(코인으로 잠금 해제) */
  numbers:[
    {id:'0',free:true},{id:'1',free:true},{id:'2',free:true},{id:'3',free:true},
    {id:'4',free:true},{id:'5',free:true},{id:'6',free:true},{id:'7',free:true},
    {id:'8',free:true},{id:'9',free:true},
    {id:'10',price:40},{id:'11',price:55},{id:'20',price:70},{id:'25',price:85},
    {id:'33',price:100},{id:'50',price:130},{id:'77',price:160},{id:'99',price:200},
  ]
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_AVATAR;
})();
