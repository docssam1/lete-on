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
    {id:'lime',   ko:'라임',en:'Lime',  zh:'青柠',fg:'#8bc34a',bg:'#eef7df',price:20},
    {id:'orange', ko:'오렌지',en:'Orange',zh:'橙色',fg:'#ff8c00',bg:'#fff0db',price:25},
    {id:'silver', ko:'은빛',en:'Silver',zh:'银色',fg:'#95a5a6',bg:'#eef2f3',price:35},
    /* 무지개오라 — 단색이 아니라 렌더러(numi-render.js)에서 conic-gradient로 특수
       처리되는 유일한 색. fg는 캐릭터 그림 톤 입힘(tint)에만 쓰이는 대표색. */
    {id:'aurora', ko:'무지개오라',en:'Aurora',zh:'极光',fg:'#a15fd6',bg:'#f5eefc',price:50},
  ],
  bgs:[
    {id:'plain',   ko:'깔끔',  en:'Plain',   zh:'简洁',free:true},
    {id:'stars',   ko:'별',    en:'Stars',   zh:'星星',price:10},
    {id:'hearts',  ko:'하트',  en:'Hearts',  zh:'爱心',price:10},
    {id:'sparks',  ko:'반짝',  en:'Sparkle', zh:'闪耀',price:15},
    {id:'rainbow', ko:'무지개',en:'Rainbow', zh:'彩虹',price:25},
    {id:'magic',   ko:'마법',  en:'Magic',   zh:'魔法',price:40},
    {id:'snow',    ko:'눈꽃',  en:'Snowflake',zh:'雪花',price:15},
    {id:'bolt',    ko:'번개',  en:'Lightning',zh:'闪电',price:20},
    {id:'notes',   ko:'음표',  en:'Music Notes',zh:'音符',price:20},
    {id:'crownpat',ko:'왕관무늬',en:'Crown Pattern',zh:'皇冠图案',price:45},
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
    /* 별무늬 망토 — 짙은 남색 바탕 + 렌더러가 얹는 작은 별 장식(hex는 바탕색) */
    {id:'starcape',ko:'별무늬 망토',en:'Starry Cape',zh:'星纹斗篷',fg:'#1b2a4a',price:45},
    /* 은하 망토 — 무지개처럼 렌더러에서 그라디언트로 특수 처리(fg는 예비값) */
    {id:'galaxy', ko:'은하 망토',en:'Galaxy Cape',zh:'银河斗篷',fg:'#4a2a82',price:70},
  ],
  /* 캐릭터 숫자 — 0~9 무료, 10 이상은 두 자리 수 "특별 보상"(코인 또는 과정 진도로
     잠금 해제). course = 캐릭터-승급-설계.md §0 수정사항 표(티어→과정)의 과정 번호 —
     currentCourseKey()의 과정 order가 이 값 이상이면 무료로 열린다(코인 구매와 별개
     경로, 먼저 산 것은 유지). 0~9는 course 없음(항상 자유). */
  numbers:[
    {id:'0',free:true},{id:'1',free:true},{id:'2',free:true},{id:'3',free:true},
    {id:'4',free:true},{id:'5',free:true},{id:'6',free:true},{id:'7',free:true},
    {id:'8',free:true},{id:'9',free:true},
    {id:'10',price:40, course:10},{id:'11',price:55, course:10},
    {id:'20',price:70, course:16},{id:'25',price:85, course:16},
    {id:'33',price:100,course:25},{id:'42',price:105,course:25},{id:'50',price:130,course:25},
    {id:'64',price:140,course:28},{id:'77',price:160,course:28},
    {id:'81',price:170,course:35},{id:'88',price:180,course:35},
    {id:'99',price:200,course:39},
  ],
  /* 수학 기호 캐릭터 10종 — 캐릭터-승급-설계.md §2. course = 그 기호를 배우는
     data/courses.js의 과정 order(진도로 열림). 코인으로도 미리 살 수 있다(price).
     그림은 numi-render.js가 PNG 우선(assets/characters/sym-<id>.png)·없으면 SVG로
     직접 그린다(§0 수정사항). */
  symbols:[
    {id:'plus',    glyph:'+', ko:'더하기', en:'Plus',        zh:'加号',  course:1,  price:15},
    {id:'equal',   glyph:'=', ko:'같다',   en:'Equals',      zh:'等号',  course:2,  price:20},
    {id:'minus',   glyph:'−', ko:'빼기',   en:'Minus',       zh:'减号',  course:3,  price:25},
    {id:'times',   glyph:'×', ko:'곱하기', en:'Times',       zh:'乘号',  course:5,  price:35},
    {id:'divide',  glyph:'÷', ko:'나누기', en:'Divide',      zh:'除号',  course:8,  price:45},
    {id:'sqrt',    glyph:'√', ko:'제곱근', en:'Square Root', zh:'平方根',course:20, price:90},
    {id:'percent', glyph:'%', ko:'퍼센트', en:'Percent',     zh:'百分号',course:29, price:130},
    {id:'pi',      glyph:'π', ko:'파이',   en:'Pi',          zh:'圆周率',course:34, price:150},
    {id:'sigma',   glyph:'Σ', ko:'시그마', en:'Sigma',       zh:'西格玛',course:40, price:180},
    {id:'infinity',glyph:'∞', ko:'무한대', en:'Infinity',    zh:'无穷大',course:42, price:190},
  ],
  /* 모자 — 캐릭터 PNG 위에 얹는 SVG 오버레이(numi-render.js의 hatSVG). 전부 원본
     도형(path/circle/polygon)만 사용, 어떤 기존 그림도 베끼지 않음. */
  hats:[
    {id:'none',   ko:'없음',    en:'None',     zh:'无',   free:true},
    {id:'party',  ko:'고깔모자',en:'Party Hat',zh:'派对帽',price:15},
    {id:'ribbon', ko:'리본',    en:'Ribbon',   zh:'蝴蝶结',price:20},
    {id:'wizard', ko:'마법사 별모자',en:'Wizard Star Hat',zh:'魔法星帽',price:35},
    {id:'crown',  ko:'왕관',    en:'Crown',    zh:'皇冠',price:45},
    {id:'laurel', ko:'월계관',  en:'Laurel Wreath',zh:'桂冠',price:50},
  ]
};

if(typeof module!=='undefined'&&module.exports)module.exports=window.NM_AVATAR;
})();
