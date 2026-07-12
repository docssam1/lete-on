/* Numbers of Magic — 캐릭터 꾸미기 아이템 데이터 */
(function(){
'use strict';

window.NM_AVATAR = {
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
  faces:[
    {id:'happy',     ko:'활짝',  en:'Happy',    zh:'开心',free:true},
    {id:'cool',      ko:'쿨',    en:'Cool',     zh:'酷',  free:true},
    {id:'excited',   ko:'신남',  en:'Excited',  zh:'兴奋',free:true},
    {id:'sleepy',    ko:'졸림',  en:'Sleepy',   zh:'困',  price:10},
    {id:'wink',      ko:'윙크',  en:'Wink',     zh:'眨眼',price:10},
    {id:'surprised', ko:'깜짝',  en:'Surprised',zh:'惊讶',price:10},
    {id:'love',      ko:'사랑',  en:'Love',     zh:'爱',  price:20},
    {id:'fire',      ko:'파이팅',en:'Fierce',   zh:'斗志',price:30},
  ],
  hats:[
    {id:'none',   ko:'없음',  en:'None',   zh:'无',   free:true},
    {id:'wizard', ko:'마법사',en:'Wizard', zh:'魔法师',free:true},
    {id:'crown',  ko:'왕관',  en:'Crown',  zh:'皇冠', price:20},
    {id:'bow',    ko:'리본',  en:'Bow',    zh:'蝴蝶结',price:15},
    {id:'party',  ko:'파티',  en:'Party',  zh:'派对', price:15},
    {id:'halo',   ko:'후광',  en:'Halo',   zh:'光环', price:30},
  ],
  bgs:[
    {id:'plain',   ko:'깔끔',  en:'Plain',   zh:'简洁',free:true},
    {id:'stars',   ko:'별',    en:'Stars',   zh:'星星',price:10},
    {id:'hearts',  ko:'하트',  en:'Hearts',  zh:'爱心',price:10},
    {id:'sparks',  ko:'반짝',  en:'Sparkle', zh:'闪耀',price:15},
    {id:'rainbow', ko:'무지개',en:'Rainbow', zh:'彩虹',price:25},
    {id:'magic',   ko:'마법',  en:'Magic',   zh:'魔法',price:40},
  ]
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_AVATAR;
})();
