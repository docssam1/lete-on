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
  /* 기호 마법단 — 이름·배역·소개는 작화(2026-09-01 납품 시안)에 실린 설정 그대로.
     role=칭호 · desc=성격 소개 · power=마법 능력(옷장 카드에 보여 준다). */
  symbols:[
    {id:'plus', glyph:'+', course:1, price:15,
      ko:'플러스', en:'Plus', zh:'加号',
      role:{ko:'합체대장',en:'Captain Combine',zh:'合体队长'},
      desc:{ko:'친구들을 모으고 힘을 합치게 하는 숫자 마을의 리더예요. 모두가 함께하면 무엇이든 해낼 수 있어요!',
            en:'The leader who gathers friends and joins their strength. Together, anything is possible!',
            zh:'把朋友们聚在一起、齐心协力的数字小镇领袖。大家一起就无所不能！'},
      power:{ko:'모든 것을 더해서 더 큰 힘을 만들어요.',en:'Adds everything up into a greater force.',zh:'把一切相加，变成更大的力量。'}},
    {id:'equal', glyph:'=', course:2, price:20,
      ko:'이퀄', en:'Equals', zh:'等号',
      role:{ko:'균형의 수호자',en:'Guardian of Balance',zh:'平衡守护者'},
      desc:{ko:'항상 균형을 지키고 공정하게 판단해요. 싸움이 나면 가운데 서서 모두를 평화롭게 만들어 줘요.',
            en:'Always keeps balance and judges fairly. Steps in the middle to bring peace.',
            zh:'始终保持平衡、公正判断。有争执时站在中间让大家和好。'},
      power:{ko:'양쪽을 같게 만들어 균형을 회복해요.',en:'Makes both sides equal and restores balance.',zh:'让两边相等，恢复平衡。'}},
    {id:'minus', glyph:'−', course:3, price:25,
      ko:'마이너스', en:'Minus', zh:'减号',
      role:{ko:'정리 마법사',en:'Tidy-up Wizard',zh:'整理魔法师'},
      desc:{ko:'불필요한 것을 깔끔하게 정리해요. 말은 적지만 머리가 아주 빠르고 정확해요.',
            en:'Tidies away what is not needed. Quiet, but quick and precise.',
            zh:'把不需要的东西整理干净。话不多，但头脑飞快又准确。'},
      power:{ko:'필요 없는 것을 빼고 가볍게 만들어요.',en:'Takes away the extra and makes things light.',zh:'减去多余，让一切变轻。'}},
    {id:'times', glyph:'×', course:5, price:35,
      ko:'곱하기', en:'Times', zh:'乘号',
      role:{ko:'증폭 전사',en:'Amplify Warrior',zh:'增幅战士'},
      desc:{ko:'에너지가 넘치고 무엇이든 여러 번, 여러 배로 키워요. 힘도 용기도 세계 최고예요!',
            en:'Full of energy, growing everything many times over. Strongest and bravest!',
            zh:'活力满满，把任何东西放大好几倍。力气和勇气都是世界第一！'},
      power:{ko:'같은 것을 여러 번 더 크게 만들어요.',en:'Repeats the same thing to make it bigger.',zh:'把相同的东西重复放大。'}},
    {id:'divide', glyph:'÷', course:8, price:45,
      ko:'나누기', en:'Divide', zh:'除号',
      role:{ko:'공평한 배분가',en:'Fair Sharer',zh:'公平分配者'},
      desc:{ko:'모두가 공평하게 나눌 수 있도록 도와줘요. 누구도 손해 보지 않게 정확하게 나눠 준답니다.',
            en:'Helps everyone share fairly, so no one loses out.',
            zh:'帮助大家公平分配，谁都不吃亏。'},
      power:{ko:'똑같은 양으로 나누어 모두 행복하게 해요.',en:'Splits into equal parts so everyone is happy.',zh:'分成同样多，让大家都开心。'}},
    {id:'sqrt', glyph:'√', course:20, price:90,
      ko:'루트', en:'Root', zh:'根号',
      role:{ko:'루트 숲의 현자',en:'Sage of Root Forest',zh:'根号森林的贤者'},
      desc:{ko:'숫자 속 깊은 비밀을 연구하는 현자예요. 복잡한 문제의 뿌리를 찾아 지혜를 알려줘요.',
            en:'A sage who studies the deep secrets of numbers and finds the root of hard problems.',
            zh:'研究数字深处秘密的贤者，能找到难题的根源。'},
      power:{ko:'숨겨진 근본을 찾아 정답의 길을 열어요.',en:'Finds the hidden root and opens the way to the answer.',zh:'找出隐藏的根本，打开答案之路。'}},
    {id:'percent', glyph:'%', course:29, price:130,
      ko:'퍼센트', en:'Percent', zh:'百分号',
      role:{ko:'비율 연금술사',en:'Ratio Alchemist',zh:'比例炼金术士'},
      desc:{ko:'비율과 백분율을 자유자재로 다뤄요. 장난기도 많지만 계산은 정확하게 한답니다!',
            en:'Handles ratios and percentages freely. Playful, but the numbers are always exact!',
            zh:'自如地驾驭比例和百分比。虽然爱玩，计算却分毫不差！'},
      power:{ko:'비율을 바꾸어 새로운 결과를 만들어요.',en:'Changes the ratio to create a new result.',zh:'改变比例，创造新的结果。'}},
    {id:'pi', glyph:'π', course:34, price:150,
      ko:'파이', en:'Pi', zh:'圆周率',
      role:{ko:'원의 건축가',en:'Architect of Circles',zh:'圆的建筑师'},
      desc:{ko:'원을 그리고 곡선을 만드는 건축가예요. 호기심이 많아 세계 곳곳을 빙글빙글 탐험해요.',
            en:'An architect of circles and curves, endlessly curious and always exploring.',
            zh:'画圆造曲线的建筑师，好奇心旺盛，绕着世界到处探险。'},
      power:{ko:'완벽한 원과 곡선을 그려내요.',en:'Draws perfect circles and curves.',zh:'画出完美的圆与曲线。'}},
    {id:'sigma', glyph:'Σ', course:40, price:180,
      ko:'시그마', en:'Sigma', zh:'西格玛',
      role:{ko:'숫자 수집가',en:'Number Collector',zh:'数字收藏家'},
      desc:{ko:'흩어진 숫자들을 모아 한 번에 정리해요. 많은 것도 한눈에 파악하는 묵직한 선배랍니다.',
            en:'Gathers scattered numbers and sums them at once — a steady senior who sees the whole at a glance.',
            zh:'把散落的数字聚起来一次整理，一眼看穿全局的稳重前辈。'},
      power:{ko:'여러 개를 모아 하나의 결과로 만들어요.',en:'Gathers many into a single result.',zh:'把许多聚成一个结果。'}},
    {id:'infinity', glyph:'∞', course:42, price:190,
      ko:'무한', en:'Infinity', zh:'无穷大',
      role:{ko:'무한의 문지기',en:'Keeper of the Endless',zh:'无限的守门人'},
      desc:{ko:'가장 오래된 존재로 끝없이 이어지는 가능성을 지켜요. 모든 마법의 근원이자 숫자 마을의 수호자예요.',
            en:'The oldest of all, guarding endless possibility — the source of every magic and protector of the town.',
            zh:'最古老的存在，守护无尽的可能。是所有魔法的源头，也是数字小镇的守护者。'},
      power:{ko:'끝없이 이어지는 힘으로 모두를 지켜요.',en:'Protects everyone with never-ending power.',zh:'以永不间断的力量守护大家。'}},
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
