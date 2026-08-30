/* ============================================================
   Numbers of Magic — WP 문장제 스레드 (문장제-설계.md 구현)
   계약: NM_TGEN[genKey] = function(params, rng) { return problem; }
   절대 Math.random() 사용 금지 — R(rng,a,b) / pick(rng,arr) / shuffle(rng,arr) 만.

   ── 이 파일의 핵심: 상황(situation) 하나에서 여러 스레드가 파생된다 ──
   문장제-설계.md §1이 말하는 그대로다. 상황은 데이터고, 문장은 그 데이터에서
   조립된다. 그래서 "이 문제는 더하기인가 빼기인가"의 정답이 사람이 쓴 문자열이
   아니라 데이터(`kind`)에서 나온다 — 채점 근거가 생긴다.

     situation = { 주체, 대상, n1, n2, 연산, 의미유형, 단위 }

   의미 유형(§3-2)은 네 가지 + 곱셈 + (레벨 B) 나눗셈:
     합병(+) 둘을 합친다     · 첨가(+) 더 받는다
     구잔(−) 먹고/주고 남은 것 · 구차(−) ~보다 몇 개 더 많은가
     배수(×) 몇씩 몇 묶음     · 등분(÷) 똑같이 나누어 갖기 · 포함(÷) 몇씩 담기

   ⚠️ 구차가 이 파일에서 가장 중요한 자리다. "몇 개 더 많은가"는 빼는 상황인데
   문장에 '주었다·먹었다·남은'이 하나도 없고 오히려 **'더'가 들어간다** — 신호어만
   외운 아이가 반드시 +를 고른다. 그래서 첨가('더 받았어요' → +)와 구차('더
   많을까요' → −)가 같은 낱말 '더'를 쓰도록 일부러 붙여 놓았다. '더'만 보고 고르면
   반은 틀린다. WP3의 오답과 kind 가중치가 전부 여기에 걸려 있다.

   ⚠️ 문장은 번역이 아니다(§5-4). 언어마다 이름·조사·수량사가 다르므로 ko/en/zh를
   각각 그 언어로 자연스럽게 쓴다 — 한국어 수량사(마리·송이·자루·장·권)와 중국어
   양사(只·朵·支·张·本)는 대상마다 따로 못 박아 두었다.

   ⚠️ 창작 콘텐츠다. 「언어사고력 프로그램」 이해편의 지문·상황을 옮기지 않는다
   (§0). 우리는 제너레이터라 상황을 매번 새로 만든다.
   ============================================================ */
(function () {
  'use strict';

  const { R, pick, shuffle } = NM_RNG;

  /* ── 한국어 조사 ─────────────────────────────────────────
     받침이 있으면 은/이/을/과, 없으면 는/가/를/와. 대상 낱말이 데이터라
     문장을 조립할 때마다 이걸 태워야 "꽃를 3송이"가 안 나온다. */
  function hasBatchim(w) {
    const c = w.charCodeAt(w.length - 1);
    return c >= 0xAC00 && c <= 0xD7A3 && (c - 0xAC00) % 28 > 0;
  }
  const EUN = w => w + (hasBatchim(w) ? '은' : '는');
  const IGA = w => w + (hasBatchim(w) ? '이' : '가');
  const EUL = w => w + (hasBatchim(w) ? '을' : '를');
  /* 사람 이름은 받침이 있으면 '이'를 끼운다 — 하준이는·서연이가.
     '하준은·서연가'로 쓰면 어린이 교재 말투가 아니다(app/exam.js kJosa와 같은 관례). */
  const NEUN = w => w + (hasBatchim(w) ? '이는' : '는');
  const NGA  = w => w + (hasBatchim(w) ? '이가' : '가');
  const NUI  = w => w + (hasBatchim(w) ? '이의' : '의');
  const NBODA= w => w + (hasBatchim(w) ? '이보다' : '보다');
  const WA   = w => w + (hasBatchim(w) ? '과' : '와');

  /* ── 사람 이름 — 언어마다 그 언어에서 자연스러운 이름을 따로 쓴다 ── */
  const NAMES = [
    { ko: '민수', en: 'Emma',   zh: '小明' },
    { ko: '지우', en: 'Liam',   zh: '小红' },
    { ko: '서연', en: 'Olivia', zh: '小刚' },
    { ko: '하준', en: 'Noah',   zh: '小美' },
    { ko: '다은', en: 'Mia',    zh: '小强' },
    { ko: '시우', en: 'Lucas',  zh: '小丽' },
    { ko: '유나', en: 'Ava',    zh: '小龙' },
    { ko: '도윤', en: 'Ethan',  zh: '小雨' },
    { ko: '예린', en: 'Sophie', zh: '小云' },
    { ko: '재호', en: 'Ben',    zh: '小杰' }
  ];

  /* ── 대상(사물) ────────────────────────────────────────────
     ko.u = 한국어 수량사 · zh.u = 중국어 양사 · en.n = 복수형 명사구.
     kinds = 그 사물이 자연스럽게 들어갈 수 있는 의미 유형.
       동물은 합병·구차(세고 비교하기)에만 쓴다 — "병아리 3마리를 먹었어요"나
       "병아리를 봉지에 담아요"가 되면 한국어가 통째로 망가진다.
     away = 줄어드는 방식(구잔): eat 먹다 · give 주다 · use 쓰다.
     groups = 묶음 단위(배수·포함)로 쓸 수 있는 그릇. */
  const ALL = ['합병', '첨가', '구잔', '구차', '배수', '등분', '포함'];
  const OBJECTS = [
    { id:'apple',   kinds:ALL, away:'eat',  groups:['box','bag'],
      ko:{n:'사과', u:'개'},   en:{n:'apples'},               zh:{n:'苹果', u:'个'} },
    { id:'tangerine', kinds:ALL, away:'eat', groups:['box','bag'],
      ko:{n:'귤', u:'개'},     en:{n:'tangerines'},           zh:{n:'橘子', u:'个'} },
    { id:'cookie',  kinds:ALL, away:'eat',  groups:['box','bag'],
      ko:{n:'쿠키', u:'개'},   en:{n:'cookies'},              zh:{n:'饼干', u:'块'} },
    { id:'candy',   kinds:ALL, away:'eat',  groups:['bag','box'],
      ko:{n:'사탕', u:'개'},   en:{n:'candies'},              zh:{n:'糖果', u:'颗'} },
    { id:'block',   kinds:ALL, away:'give', groups:['box','row'],
      ko:{n:'블록', u:'개'},   en:{n:'blocks'},               zh:{n:'积木', u:'块'} },
    { id:'paper',   kinds:ALL, away:'use',  groups:['bundle','bag'],
      ko:{n:'색종이', u:'장'}, en:{n:'sheets of colored paper'}, zh:{n:'彩纸', u:'张'} },
    { id:'sticker', kinds:ALL, away:'use',  groups:['bundle','bag'],
      ko:{n:'스티커', u:'장'}, en:{n:'stickers'},             zh:{n:'贴纸', u:'张'} },
    /* 딱지는 요즘 아이가 모르는 말이라 카드로 바꿨다(원장 지적, 2026-08-30).
       단위(장)·away·groups가 같아 그대로 대체된다. 소재를 새로 넣을 때도
       "지금 아이가 실제로 아는 물건인가"를 먼저 볼 것. */
    { id:'card',    kinds:ALL, away:'give', groups:['bundle','box'],
      ko:{n:'캐릭터 카드', u:'장'}, en:{n:'character cards'},  zh:{n:'角色卡片', u:'张'} },
    { id:'jelly',   kinds:ALL, away:'eat',  groups:['bag','box'],
      ko:{n:'젤리', u:'개'},   en:{n:'gummies'},              zh:{n:'软糖', u:'颗'} },
    { id:'doll',    kinds:ALL, away:'give', groups:['box'],
      ko:{n:'인형', u:'개'},   en:{n:'dolls'},                zh:{n:'玩偶', u:'个'} },
    { id:'pencil',  kinds:ALL, away:'give', groups:['bundle','box'],
      ko:{n:'연필', u:'자루'}, en:{n:'pencils'},              zh:{n:'铅笔', u:'支'} },
    { id:'note',    kinds:ALL, away:'give', groups:['box','bundle'],
      ko:{n:'공책', u:'권'},   en:{n:'notebooks'},            zh:{n:'笔记本', u:'本'} },
    { id:'storybook', kinds:['합병','첨가','구잔','구차','배수'], away:'give', groups:['box'],
      ko:{n:'동화책', u:'권'}, en:{n:'storybooks'},           zh:{n:'故事书', u:'本'} },
    { id:'rose',    kinds:['합병','첨가','구잔','구차','배수','등분'], away:'give', groups:['bundle'],
      ko:{n:'장미', u:'송이'}, en:{n:'roses'},                zh:{n:'玫瑰', u:'朵'} },
    { id:'chick',   kinds:['합병','구차'], away:null, groups:[],
      ko:{n:'병아리', u:'마리'}, en:{n:'chicks'},             zh:{n:'小鸡', u:'只'} },
    { id:'goldfish', kinds:['합병','구차'], away:null, groups:[],
      ko:{n:'금붕어', u:'마리'}, en:{n:'goldfish'},           zh:{n:'金鱼', u:'条'} },
    { id:'rabbit',  kinds:['합병','구차'], away:null, groups:[],
      ko:{n:'토끼', u:'마리'}, en:{n:'rabbits'},              zh:{n:'兔子', u:'只'} }
  ];

  /* 묶음 그릇 — 한국어는 그릇 이름이 곧 수량사다(4상자·4봉지·4줄·4묶음). */
  const GROUPS = {
    box:    { ko:{ n:'상자', u:'상자' }, en:{ one:'box',    many:'boxes'   }, zh:{ n:'盒子', u:'盒' } },
    bag:    { ko:{ n:'봉지', u:'봉지' }, en:{ one:'bag',    many:'bags'    }, zh:{ n:'袋子', u:'袋' } },
    row:    { ko:{ n:'줄',   u:'줄'   }, en:{ one:'row',    many:'rows'    }, zh:{ n:'排',   u:'排' } },
    bundle: { ko:{ n:'묶음', u:'묶음' }, en:{ one:'bundle', many:'bundles' }, zh:{ n:'捆',   u:'捆' } }
  };

  const GIVERS = [
    { ko:'삼촌', en:'an uncle',  zh:'叔叔' },
    { ko:'이모', en:'an aunt',   zh:'阿姨' },
    { ko:'선생님', en:'a teacher', zh:'老师' },
    { ko:'친구', en:'a friend',  zh:'朋友' }
  ];
  const TAKERS = [
    { ko:'동생', en:'a younger brother', zh:'弟弟' },
    { ko:'친구', en:'a friend',          zh:'朋友' },
    { ko:'짝꿍', en:'a classmate',       zh:'同桌' }
  ];

  /* ── 레벨 C: 분수·소수의 덧뺄. 재는 것이라 대상이 다르다 ──────
     cat = length(m·길이) · volume(L·양) · weight(kg·무게)
     표기는 나라별 초등 관례를 따른다 — 한국은 "1.4 m", 중국은 "1.4米",
     영어는 "1.4 meters". 분수는 세 언어 모두 3/5 꼴로 쓴다.
     vessel = 그것을 담는 그릇(병·물통·봉지). 큰/작은 두 개로 두 값을 가른다.
     ※ 길이는 그릇이 없어 빨강/파랑 두 개로 가른다. */
  const MEASURES = [
    { id:'ribbon', cat:'length', ko:{ n:'리본' }, en:{ n:'ribbon' }, zh:{ n:'丝带', mw:'条' } },
    { id:'string', cat:'length', ko:{ n:'끈' },   en:{ n:'string' }, zh:{ n:'绳子', mw:'条' } },
    { id:'wire',   cat:'length', ko:{ n:'철사' }, en:{ n:'wire' },   zh:{ n:'铁丝', mw:'根' } },
    { id:'juice',  cat:'volume', ko:{ n:'주스', v:'병' }, en:{ n:'juice', v:'bottle' }, zh:{ n:'果汁', v:'瓶' } },
    { id:'milk',   cat:'volume', ko:{ n:'우유', v:'병' }, en:{ n:'milk',  v:'bottle' }, zh:{ n:'牛奶', v:'瓶' } },
    { id:'water',  cat:'volume', ko:{ n:'물',   v:'물통' }, en:{ n:'water', v:'jug' },  zh:{ n:'水',   v:'水桶' } },
    { id:'flour',  cat:'weight', ko:{ n:'밀가루', v:'봉지' }, en:{ n:'flour', v:'bag' }, zh:{ n:'面粉', v:'袋' } },
    { id:'sugar',  cat:'weight', ko:{ n:'설탕', v:'봉지' }, en:{ n:'sugar', v:'bag' },  zh:{ n:'白糖', v:'袋' } }
  ];
  /* 재는 것의 단위·비교말·양 이름. 단위 뒤 조사는 한국어로 읽었을 때를 따른다
     — m·L은 '미터를·리터를'이라 를, kg는 '킬로그램을'이라 을. */
  const CAT = {
    length: { unit:{ ko:'m', en:'meters', zh:'米' }, unitEul:'를',
              qty: { ko:'길이', en:'length', zh:'长度' },
              moreQ:{ ko:'더 길까요', en:'longer', zh:'长' },
              addV:{ ko:'더 이어 붙였어요', en:'joined to it', zh:'又接上了' },
              cutV:{ ko:'잘라 썼어요', en:'cut off', zh:'剪掉了' },
              cutN:{ ko:'잘라 쓴', en:'cut off', zh:'剪掉的' } },
    volume: { unit:{ ko:'L', en:'liters', zh:'升' }, unitEul:'를',
              qty: { ko:'양', en:'amount', zh:'量' },
              moreQ:{ ko:'더 많을까요', en:'more', zh:'多' },
              addV:{ ko:'더 부었어요', en:'poured in', zh:'又倒进去了' },
              cutV:{ ko:'마셨어요', en:'drunk', zh:'喝掉了' },
              cutN:{ ko:'마신', en:'drunk', zh:'喝掉的' } },
    weight: { unit:{ ko:'kg', en:'kilograms', zh:'千克' }, unitEul:'을',
              qty: { ko:'무게', en:'weight', zh:'重量' },
              moreQ:{ ko:'더 무거울까요', en:'heavier', zh:'重' },
              addV:{ ko:'더 넣었어요', en:'added', zh:'又加进去了' },
              cutV:{ ko:'썼어요', en:'used', zh:'用掉了' },
              cutN:{ ko:'쓴', en:'used', zh:'用掉的' } }
  };

  /* ── 문제 푸는 데 필요 없는 수(WP1 need 모드) ────────────────
     "도움이 되는 내용 찾기"(§2 Ⅰ)를 기계로 옮긴 것. 값은 늘 정수라
     레벨 C(분수·소수)에서도 답이 정수로 남는다. */
  const EN_ORD = { 2:'2nd', 3:'3rd', 4:'4th', 5:'5th' };
  const NOISES = [
    { v:(rng)=>R(rng,6,11), ko:(A,v)=>`${NEUN(A)} ${v}살이에요.`,
      en:(A,v)=>`${A} is ${v} years old.`, zh:(A,v)=>`${A}今年${v}岁。` },
    { v:(rng)=>R(rng,2,5),  ko:(A,v)=>`교실은 ${v}층에 있어요.`,
      en:(A,v)=>`The classroom is on the ${EN_ORD[v]} floor.`, zh:(A,v)=>`教室在${v}楼。` },
    { v:(rng)=>R(rng,2,9),  ko:(A,v)=>`${NEUN(A)} ${v}번 버스를 타고 학교에 가요.`,
      en:(A,v)=>`${A} takes bus number ${v} to school.`, zh:(A,v)=>`${A}坐${v}路公交车上学。` }
  ];

  /* ── 수량 표기 ──────────────────────────────────────────── */
  const koQ = (o, n) => `${n}${o.ko.u}`;                 /* 5개 · 3송이 */
  const enQ = (o, n) => `${n} ${o.en.n}`;                /* 5 apples */
  const zhQ = (o, n) => `${n}${o.zh.u}${o.zh.n}`;        /* 5个苹果 */

  const OPS = { 합병:'+', 첨가:'+', 구잔:'−', 구차:'−', 배수:'×', 등분:'÷', 포함:'÷' };

  /* ============================================================
     상황 생성 — 이 함수 하나가 WP1·WP3의 공용 원천이다.
     반환값의 story/compact가 곧 문장이고, kind/op/n1/n2가 곧 채점 근거다.
     ============================================================ */
  function makeSituation(rng, opt) {
    const range = opt.range;                    /* 'A' | 'B' | 'C' */
    const kind  = opt.kind;
    if (range === 'C') return measureSituation(rng, kind, opt);
    return countSituation(rng, kind, range, opt);
  }

  /* ── 자연수 상황 (레벨 A·B) ───────────────────────────────── */
  function countSituation(rng, kind, range, opt) {
    const big = range === 'B';
    const objPool = OBJECTS.filter(o => o.kinds.indexOf(kind) >= 0);
    const o = pick(rng, objPool);
    const nameIdx = shuffle(rng, NAMES.map((_, i) => i)).slice(0, 2);
    const A = NAMES[nameIdx[0]], B = NAMES[nameIdx[1]];

    let n1, n2, gid = null, g = null;
    if (kind === '배수') {
      const pool = o.groups.length ? o.groups : ['box'];
      gid = pick(rng, pool); g = GROUPS[gid];
      n1 = big ? R(rng, 3, 12) : R(rng, 2, 9);
      n2 = big ? R(rng, 3, 9)  : R(rng, 2, 6);
      if (n2 === n1) n2 = n1 > 4 ? n1 - 1 : n1 + 1;   /* 두 수가 같으면 주어진 것이 흐려진다 */
    } else if (kind === '등분') {
      n2 = R(rng, 2, big ? 8 : 5);
      n1 = n2 * R(rng, 2, big ? 9 : 6);
    } else if (kind === '포함') {
      const pool = o.groups.filter(x => x === 'box' || x === 'bag');
      gid = pool.length ? pick(rng, pool) : 'bag'; g = GROUPS[gid];
      n2 = R(rng, 2, big ? 8 : 5);
      n1 = n2 * R(rng, 2, big ? 9 : 6);
    } else if (kind === '합병' || kind === '첨가') {
      n1 = big ? R(rng, 12, 60) : R(rng, 3, 12);
      n2 = big ? R(rng, 8, 40)  : R(rng, 2, 9);
      if (n2 === n1) n2 = n1 > 4 ? n1 - 1 : n1 + 1;
    } else {                                     /* 구잔 · 구차 — n1 > n2 */
      n1 = big ? R(rng, 25, 90) : R(rng, 6, 20);
      n2 = big ? R(rng, 6, n1 - 5) : R(rng, 2, n1 - 2);
    }

    const giver = pick(rng, GIVERS), taker = pick(rng, TAKERS);
    const s = { range, kind, op: OPS[kind], n1, n2, o, A, B, gid, g, giver, taker,
                unitKo: o.ko.u, qty: { ko:'수', en:'number', zh:'数量' } };

    /* 줄어드는 방식에 맞는 서술 — 먹다/주다/쓰다 */
    const away = o.away || 'give';
    const awayKo =
      away === 'eat' ? `그중 ${koQ(o, n2)}${hasBatchim(o.ko.u) ? '을' : '를'} 먹었어요.`
      : away === 'use' ? `그중 ${koQ(o, n2)}${hasBatchim(o.ko.u) ? '을' : '를'} 썼어요.`
      : `그중 ${koQ(o, n2)}${hasBatchim(o.ko.u) ? '을' : '를'} ${taker.ko}에게 주었어요.`;
    const awayEn =
      away === 'eat' ? `${A.en} ate ${n2} of them.`
      : away === 'use' ? `${A.en} used ${n2} of them.`
      : `${A.en} gave ${n2} of them to ${taker.en}.`;
    const awayZh =
      away === 'eat' ? `吃掉了${n2}${o.zh.u}。`
      : away === 'use' ? `用掉了${n2}${o.zh.u}。`
      : `送给${taker.zh}${n2}${o.zh.u}。`;
    s.awayKind = away;

    if (kind === '합병') {
      s.story = {
        ko: { sents: [`${NEUN(A.ko)} ${EUL(o.ko.n)} ${koQ(o, n1)}, ${NEUN(B.ko)} ${koQ(o, n2)} 가지고 있어요.`],
              q: `두 사람이 가진 ${EUN(o.ko.n)} 모두 몇 ${o.ko.u}일까요?` },
        en: { sents: [`${A.en} has ${enQ(o, n1)} and ${B.en} has ${enQ(o, n2)}.`],
              q: `How many ${o.en.n} do they have altogether?` },
        zh: { sents: [`${A.zh}有${zhQ(o, n1)}，${B.zh}有${zhQ(o, n2)}。`],
              q: `两个人一共有几${o.zh.u}${o.zh.n}？` }
      };
      s.compact = {
        ko: `${NEUN(A.ko)} ${EUL(o.ko.n)} ${koQ(o, n1)}, ${NEUN(B.ko)} ${koQ(o, n2)} 가지고 있어요. 모두 몇 ${o.ko.u}일까요?`,
        en: `${A.en} has ${enQ(o, n1)} and ${B.en} has ${enQ(o, n2)}. How many in all?`,
        zh: `${A.zh}有${zhQ(o, n1)}，${B.zh}有${zhQ(o, n2)}。一共有几${o.zh.u}？`
      };
      s.targets = {
        ko: [`두 사람이 가진 ${o.ko.n}의 수`, `${NGA(A.ko)} 가진 ${o.ko.n}의 수`, `${NGA(B.ko)} 가진 ${o.ko.n}의 수`],
        en: [`the number of ${o.en.n} they have altogether`, `the number of ${o.en.n} ${A.en} has`, `the number of ${o.en.n} ${B.en} has`],
        zh: [`两个人一共有的${o.zh.n}数`, `${A.zh}有的${o.zh.n}数`, `${B.zh}有的${o.zh.n}数`]
      };
      s.givens = [
        { v: n1, ko:`${NGA(A.ko)} 가진 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} does ${A.en} have?`, zh:`${A.zh}有几${o.zh.u}${o.zh.n}？` },
        { v: n2, ko:`${NGA(B.ko)} 가진 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} does ${B.en} have?`, zh:`${B.zh}有几${o.zh.u}${o.zh.n}？` }
      ];
    } else if (kind === '첨가') {
      s.story = {
        ko: { sents: [`${NEUN(A.ko)} ${EUL(o.ko.n)} ${koQ(o, n1)} 가지고 있었어요.`,
                      `${giver.ko}에게 ${koQ(o, n2)}${hasBatchim(o.ko.u) ? '을' : '를'} 더 받았어요.`],
              q: `${NUI(A.ko)} ${EUN(o.ko.n)} 모두 몇 ${o.ko.u}일까요?` },
        en: { sents: [`${A.en} had ${enQ(o, n1)}.`,
                      `${A.en} got ${n2} more ${o.en.n} from ${giver.en}.`],
              q: `How many ${o.en.n} does ${A.en} have now?` },
        zh: { sents: [`${A.zh}原来有${zhQ(o, n1)}。`,
                      `${giver.zh}又给了${A.zh}${n2}${o.zh.u}。`],
              q: `${A.zh}现在一共有几${o.zh.u}${o.zh.n}？` }
      };
      s.compact = {
        ko: `${NEUN(A.ko)} ${EUL(o.ko.n)} ${koQ(o, n1)} 가지고 있었는데 ${koQ(o, n2)}${hasBatchim(o.ko.u) ? '을' : '를'} 더 받았어요. 모두 몇 ${o.ko.u}일까요?`,
        en: `${A.en} had ${enQ(o, n1)} and got ${n2} more. How many in all?`,
        zh: `${A.zh}原来有${zhQ(o, n1)}，又得到了${n2}${o.zh.u}。一共有几${o.zh.u}？`
      };
      s.targets = {
        ko: [`${NGA(A.ko)} 지금 가진 ${o.ko.n}의 수`, `${NGA(A.ko)} 처음에 가지고 있던 ${o.ko.n}의 수`, `${NGA(A.ko)} 더 받은 ${o.ko.n}의 수`],
        en: [`the number of ${o.en.n} ${A.en} has now`, `the number of ${o.en.n} ${A.en} had at first`, `the number of ${o.en.n} ${A.en} got`],
        zh: [`${A.zh}现在有的${o.zh.n}数`, `${A.zh}原来有的${o.zh.n}数`, `${A.zh}又得到的${o.zh.n}数`]
      };
      s.givens = [
        { v: n1, ko:`${NGA(A.ko)} 처음에 가지고 있던 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} did ${A.en} have at first?`, zh:`${A.zh}原来有几${o.zh.u}${o.zh.n}？` },
        { v: n2, ko:`${NGA(A.ko)} 더 받은 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many more ${o.en.n} did ${A.en} get?`, zh:`${A.zh}又得到了几${o.zh.u}${o.zh.n}？` }
      ];
    } else if (kind === '구잔') {
      const awayNounKo = away === 'eat' ? '먹은' : away === 'use' ? '쓴' : `${taker.ko}에게 준`;
      const awayNounEn = away === 'eat' ? 'ate' : away === 'use' ? 'used' : 'gave away';
      /* did 뒤에는 원형이 와야 한다 — "did Ethan gave away"는 비문이다.
         과거형(awayNounEn)은 평서문에, 원형(awayVerbEn)은 의문문에 쓴다. */
      const awayVerbEn = away === 'eat' ? 'eat' : away === 'use' ? 'use' : 'give away';
      const awayNounZh = away === 'eat' ? '吃掉的' : away === 'use' ? '用掉的' : '送出的';
      s.story = {
        ko: { sents: [`${NEUN(A.ko)} ${EUL(o.ko.n)} ${koQ(o, n1)} 가지고 있었어요.`, awayKo],
              q: `남은 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?` },
        en: { sents: [`${A.en} had ${enQ(o, n1)}.`, awayEn],
              q: `How many ${o.en.n} are left?` },
        zh: { sents: [`${A.zh}原来有${zhQ(o, n1)}。`, awayZh],
              q: `还剩几${o.zh.u}${o.zh.n}？` }
      };
      s.compact = {
        ko: `${o.ko.n} ${koQ(o, n1)} 중에서 ${koQ(o, n2)}${hasBatchim(o.ko.u) ? '을' : '를'} ${away === 'eat' ? '먹었어요' : away === 'use' ? '썼어요' : taker.ko + '에게 주었어요'}. 남은 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`,
        en: `${A.en} had ${enQ(o, n1)} and ${awayNounEn} ${n2}. How many are left?`,
        zh: `原来有${zhQ(o, n1)}，${away === 'eat' ? '吃掉' : away === 'use' ? '用掉' : '送出'}了${n2}${o.zh.u}。还剩几${o.zh.u}？`
      };
      s.targets = {
        ko: [`남은 ${o.ko.n}의 수`, `${NGA(A.ko)} 처음에 가지고 있던 ${o.ko.n}의 수`, `${NGA(A.ko)} ${awayNounKo} ${o.ko.n}의 수`],
        en: [`the number of ${o.en.n} that are left`, `the number of ${o.en.n} ${A.en} had at first`, `the number of ${o.en.n} ${A.en} ${awayNounEn}`],
        zh: [`剩下的${o.zh.n}数`, `${A.zh}原来有的${o.zh.n}数`, `${awayNounZh}${o.zh.n}数`]
      };
      s.givens = [
        { v: n1, ko:`${NGA(A.ko)} 처음에 가지고 있던 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} did ${A.en} have at first?`, zh:`${A.zh}原来有几${o.zh.u}${o.zh.n}？` },
        { v: n2, ko:`${NGA(A.ko)} ${awayNounKo} ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} did ${A.en} ${awayVerbEn}?`, zh:`${awayNounZh}${o.zh.n}有几${o.zh.u}？` }
      ];
    } else if (kind === '구차') {
      s.story = {
        ko: { sents: [`${NEUN(A.ko)} ${EUL(o.ko.n)} ${koQ(o, n1)}, ${NEUN(B.ko)} ${koQ(o, n2)} 가지고 있어요.`],
              q: `${NEUN(A.ko)} ${NBODA(B.ko)} ${EUL(o.ko.n)} 몇 ${o.ko.u} 더 많이 가지고 있을까요?` },
        en: { sents: [`${A.en} has ${enQ(o, n1)} and ${B.en} has ${enQ(o, n2)}.`],
              q: `How many more ${o.en.n} does ${A.en} have than ${B.en}?` },
        zh: { sents: [`${A.zh}有${zhQ(o, n1)}，${B.zh}有${zhQ(o, n2)}。`],
              q: `${A.zh}比${B.zh}多几${o.zh.u}${o.zh.n}？` }
      };
      s.compact = {
        ko: `${NEUN(A.ko)} ${EUL(o.ko.n)} ${koQ(o, n1)}, ${NEUN(B.ko)} ${koQ(o, n2)} 가지고 있어요. ${NEUN(A.ko)} ${NBODA(B.ko)} 몇 ${o.ko.u} 더 많을까요?`,
        en: `${A.en} has ${enQ(o, n1)} and ${B.en} has ${enQ(o, n2)}. How many more does ${A.en} have?`,
        zh: `${A.zh}有${zhQ(o, n1)}，${B.zh}有${zhQ(o, n2)}。${A.zh}比${B.zh}多几${o.zh.u}？`
      };
      s.targets = {
        ko: [`${NGA(A.ko)} ${NBODA(B.ko)} 더 많이 가진 ${o.ko.n}의 수`, `${NGA(A.ko)} 가진 ${o.ko.n}의 수`, `${NGA(B.ko)} 가진 ${o.ko.n}의 수`],
        en: [`how many more ${o.en.n} ${A.en} has than ${B.en}`, `the number of ${o.en.n} ${A.en} has`, `the number of ${o.en.n} ${B.en} has`],
        zh: [`${A.zh}比${B.zh}多的${o.zh.n}数`, `${A.zh}有的${o.zh.n}数`, `${B.zh}有的${o.zh.n}数`]
      };
      s.givens = [
        { v: n1, ko:`${NGA(A.ko)} 가진 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} does ${A.en} have?`, zh:`${A.zh}有几${o.zh.u}${o.zh.n}？` },
        { v: n2, ko:`${NGA(B.ko)} 가진 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} does ${B.en} have?`, zh:`${B.zh}有几${o.zh.u}${o.zh.n}？` }
      ];
    } else if (kind === '배수') {
      const gk = g.ko.n, gu = g.ko.u;
      const inKo = gid === 'row'
        ? `${EUL(o.ko.n)} 한 줄에 ${koQ(o, n1)}씩 ${n2}줄로 놓았어요.`
        /* 묶음은 "들어 있다"가 아니라 "묶여 있다" — 그릇마다 서술이 다르다 */
        : `한 ${gk}에 ${IGA(o.ko.n)} ${koQ(o, n1)}씩 ${gid === 'bundle' ? '묶여' : '들어'} 있어요. 이런 ${IGA(gk)} ${n2}${gu} 있어요.`;
      const inEn = gid === 'row'
        ? `${enQ(o, n1)} are placed in each row, and there are ${n2} ${g.en.many}.`
        : `Each ${g.en.one} holds ${enQ(o, n1)}, and there are ${n2} ${g.en.many}.`;
      const inZh = gid === 'row'
        ? `每排摆${zhQ(o, n1)}，一共有${n2}${g.zh.u}。`
        : `每${g.zh.u}装${zhQ(o, n1)}，一共有${n2}${g.zh.u}。`;
      s.story = {
        ko: { sents: [inKo], q: `${EUN(o.ko.n)} 모두 몇 ${o.ko.u}일까요?` },
        en: { sents: [inEn], q: `How many ${o.en.n} are there in all?` },
        zh: { sents: [inZh], q: `${o.zh.n}一共有几${o.zh.u}？` }
      };
      s.compact = {
        ko: `${inKo} ${EUN(o.ko.n)} 모두 몇 ${o.ko.u}일까요?`,
        en: `${inEn} How many ${o.en.n} in all?`,
        zh: `${inZh}${o.zh.n}一共有几${o.zh.u}？`
      };
      s.targets = {
        ko: [`${gk} 전체에 있는 ${o.ko.n}의 수`, `한 ${gk}에 ${gid === 'bundle' ? '묶인' : '든'} ${o.ko.n}의 수`, `${gk}의 수`],
        en: [`the total number of ${o.en.n}`, `the number of ${o.en.n} in one ${g.en.one}`, `the number of ${g.en.many}`],
        zh: [`${o.zh.n}的总数`, `每${g.zh.u}里的${o.zh.n}数`, `${g.zh.n}的数量`]
      };
      s.givens = [
        { v: n1, ko:`한 ${gk}에 ${gid === 'bundle' ? '묶인' : '든'} ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} are in one ${g.en.one}?`, zh:`每${g.zh.u}里有几${o.zh.u}${o.zh.n}？` },
        { v: n2, ko:`${EUN(gk)} 몇 ${gu} 있을까요?`, en:`How many ${g.en.many} are there?`, zh:`一共有几${g.zh.u}？` }
      ];
    } else if (kind === '등분') {
      s.story = {
        ko: { sents: [`${o.ko.n} ${koQ(o, n1)}${hasBatchim(o.ko.u) ? '을' : '를'} ${n2}명이 똑같이 나누어 가져요.`],
              q: `한 명이 몇 ${o.ko.u}씩 가지게 될까요?` },
        en: { sents: [`${enQ(o, n1)} are shared equally among ${n2} children.`],
              q: `How many ${o.en.n} does each child get?` },
        zh: { sents: [`把${zhQ(o, n1)}平均分给${n2}个小朋友。`],
              q: `每人分到几${o.zh.u}${o.zh.n}？` }
      };
      s.compact = {
        ko: `${o.ko.n} ${koQ(o, n1)}${hasBatchim(o.ko.u) ? '을' : '를'} ${n2}명이 똑같이 나누어 가져요. 한 명이 몇 ${o.ko.u}씩일까요?`,
        en: `${enQ(o, n1)} are shared equally among ${n2} children. How many does each get?`,
        zh: `把${zhQ(o, n1)}平均分给${n2}个小朋友。每人分到几${o.zh.u}？`
      };
      s.targets = {
        ko: [`한 명이 가지게 되는 ${o.ko.n}의 수`, `전체 ${o.ko.n}의 수`, `나누어 가지는 사람의 수`],
        en: [`the number of ${o.en.n} each child gets`, `the total number of ${o.en.n}`, `the number of children`],
        zh: [`每人分到的${o.zh.n}数`, `${o.zh.n}的总数`, `分的人数`]
      };
      s.givens = [
        { v: n1, ko:`전체 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} are there in all?`, zh:`${o.zh.n}一共有几${o.zh.u}？` },
        { v: n2, ko:`나누어 가지는 사람은 몇 명일까요?`, en:`How many children share them?`, zh:`有几个小朋友一起分？` }
      ];
    } else {                                    /* 포함 */
      const gk = g.ko.n, gu = g.ko.u;
      s.story = {
        ko: { sents: [`${o.ko.n} ${koQ(o, n1)}${hasBatchim(o.ko.u) ? '을' : '를'} 한 ${gk}에 ${koQ(o, n2)}씩 담아요.`],
              q: `${IGA(gk)} 몇 ${gu} 필요할까요?` },
        en: { sents: [`${enQ(o, n1)} are packed ${n2} to a ${g.en.one}.`],
              q: `How many ${g.en.many} are needed?` },
        zh: { sents: [`把${zhQ(o, n1)}每${n2}${o.zh.u}装一${g.zh.u}。`],
              q: `需要几${g.zh.u}？` }
      };
      s.compact = {
        ko: `${o.ko.n} ${koQ(o, n1)}${hasBatchim(o.ko.u) ? '을' : '를'} 한 ${gk}에 ${koQ(o, n2)}씩 담아요. ${IGA(gk)} 몇 ${gu} 필요할까요?`,
        en: `${enQ(o, n1)} are packed ${n2} to a ${g.en.one}. How many ${g.en.many} are needed?`,
        zh: `把${zhQ(o, n1)}每${n2}${o.zh.u}装一${g.zh.u}。需要几${g.zh.u}？`
      };
      s.targets = {
        ko: [`필요한 ${gk}의 수`, `전체 ${o.ko.n}의 수`, `한 ${gk}에 담는 ${o.ko.n}의 수`],
        en: [`the number of ${g.en.many} needed`, `the total number of ${o.en.n}`, `the number of ${o.en.n} in one ${g.en.one}`],
        zh: [`需要的${g.zh.n}数`, `${o.zh.n}的总数`, `每${g.zh.u}装的${o.zh.n}数`]
      };
      s.givens = [
        { v: n1, ko:`전체 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} are there in all?`, zh:`${o.zh.n}一共有几${o.zh.u}？` },
        { v: n2, ko:`한 ${gk}에 담는 ${EUN(o.ko.n)} 몇 ${o.ko.u}일까요?`, en:`How many ${o.en.n} go into one ${g.en.one}?`, zh:`每${g.zh.u}装几${o.zh.u}${o.zh.n}？` }
      ];
    }
    return s;
  }

  /* ── 분수·소수 상황 (레벨 C) ───────────────────────────────
     계산은 일부러 쉽게 둔다 — 여기서 재는 것은 계산력이 아니라 이해력이다
     (같은 분모의 진분수, 또는 소수 첫째 자리까지).
     ⚠️ 이야기에 사람이 반드시 나와야 한다. WP1 need 모드가 "민수는 8살이에요"
     같은 잡음 문장을 이야기 중간에 끼워 넣기 때문에, 주인공 없는 문장 사이에
     넣으면 글이 통째로 어색해진다.
     ⚠️ 답이 정수여야 하므로 C에는 givens(주어진 값 찾아 쓰기)를 두지 않는다 —
     주어진 값이 분수·소수라 숫자패드로 받을 수 없다. */
  function measureSituation(rng, kind, opt) {
    const m = pick(rng, MEASURES);
    const c = CAT[m.cat];
    const isLen = m.cat === 'length';
    const frac = opt.numeric === 'fraction' || (opt.numeric === 'mix' && rng() < 0.4);
    let n1, n2, t1, t2;
    if (frac) {
      const d = pick(rng, [4, 5, 6, 8, 10]);
      if (kind === '합병' || kind === '첨가') {
        let a = R(rng, 1, d - 2), b = R(rng, 1, d - 1 - a);
        /* 두 분자가 같으면 WP3 expr의 보기 `t1 − t2`와 `t2 − t1`이 같은 글자가 되어
           정답이 둘이 된다 — 검사기가 잡아 준 자리다(2026-08-29). */
        if (a === b) b = (b > 1) ? b - 1 : 2;
        n1 = a / d; n2 = b / d; t1 = a + '/' + d; t2 = b + '/' + d;
      } else {                                   /* 구잔·구차 — n1 > n2 */
        const a = R(rng, 2, d - 1), b = R(rng, 1, a - 1);
        n1 = a / d; n2 = b / d; t1 = a + '/' + d; t2 = b + '/' + d;
      }
    } else {
      if (kind === '합병' || kind === '첨가') {
        n1 = R(rng, 11, 45) / 10; n2 = R(rng, 2, 9) / 10;
      } else {
        n1 = R(rng, 15, 48) / 10;
        n2 = R(rng, 2, Math.max(3, Math.round(n1 * 10) - 4)) / 10;
      }
      n1 = Math.round(n1 * 10) / 10; n2 = Math.round(n2 * 10) / 10;
      /* 소수 첫째 자리가 0이면 "1 kg"으로 찍혀 소수 문제로 안 보인다 */
      if (Math.round(n1 * 10) % 10 === 0) n1 = Math.round(n1 * 10 - 1) / 10;
      if (Math.round(n2 * 10) % 10 === 0) n2 = Math.round(n2 * 10 + 1) / 10;
      if (kind !== '합병' && kind !== '첨가' && n2 >= n1) n2 = Math.round(n1 * 10 - 3) / 10;
      t1 = String(n1); t2 = String(n2);
    }

    const A = pick(rng, NAMES);
    const u = c.unit, n = m.ko.n, uE = c.unitEul;
    const s = { range:'C', kind, op: OPS[kind], n1, n2, t1, t2, o: m, cat: m.cat, A, B: null,
                unitKo: u.ko, frac, qty: c.qty, givens: null };

    /* 두 값을 가르는 이름표 — 길이는 빨강/파랑, 나머지는 큰 그릇/작은 그릇 */
    const labA = isLen
      ? { ko:`빨간 ${n}`, en:`the red ${m.en.n}`, zh:`红色的${m.zh.n}` }
      : { ko:`큰 ${m.ko.v}에 든 ${n}`, en:`the ${m.en.n} in the big ${m.en.v}`, zh:`大${m.zh.v}里的${m.zh.n}` };
    const labB = isLen
      ? { ko:`파란 ${n}`, en:`the blue ${m.en.n}`, zh:`蓝色的${m.zh.n}` }
      : { ko:`작은 ${m.ko.v}에 든 ${n}`, en:`the ${m.en.n} in the small ${m.en.v}`, zh:`小${m.zh.v}里的${m.zh.n}` };
    /* 영어에서 "the ~ of" 뒤에 붙일 꼴. labA를 그대로 넣으면 관사가 겹친다
       ("the amount of the milk in the big bottle"). */
    const ofA = isLen ? `the red ${m.en.n}` : `${m.en.n} in the big ${m.en.v}`;
    const ofB = isLen ? `the blue ${m.en.n}` : `${m.en.n} in the small ${m.en.v}`;

    const pairKo = isLen
      ? `${NEUN(A.ko)} 빨간 ${n} ${t1} ${u.ko}와 파란 ${n} ${t2} ${u.ko}를 가지고 있어요.`
      : `${NUI(A.ko)} 큰 ${m.ko.v}에는 ${IGA(n)} ${t1} ${u.ko}, 작은 ${m.ko.v}에는 ${t2} ${u.ko} 들어 있어요.`;
    const pairEn = isLen
      ? `${A.en} has a red ${m.en.n} ${t1} ${u.en} long and a blue ${m.en.n} ${t2} ${u.en} long.`
      : `${A.en}'s big ${m.en.v} holds ${t1} ${u.en} of ${m.en.n}, and the small ${m.en.v} holds ${t2} ${u.en}.`;
    const pairZh = isLen
      ? `${A.zh}有一${m.zh.mw}长${t1}${u.zh}的红色${m.zh.n}和一${m.zh.mw}长${t2}${u.zh}的蓝色${m.zh.n}。`
      : `${A.zh}的大${m.zh.v}里有${t1}${u.zh}${m.zh.n}，小${m.zh.v}里有${t2}${u.zh}。`;

    /* 한 덩이짜리 첫 문장(첨가·구잔) */
    const oneKo = isLen
      ? `${NEUN(A.ko)} 길이가 ${t1} ${u.ko}인 ${EUL(n)} 가지고 있었어요.`
      : `${NUI(A.ko)} ${m.ko.v}에 ${IGA(n)} ${t1} ${u.ko} 있었어요.`;
    const oneEn = isLen
      ? `${A.en} had a ${m.en.n} ${t1} ${u.en} long.`
      : `${A.en}'s ${m.en.v} held ${t1} ${u.en} of ${m.en.n}.`;
    const oneZh = isLen
      ? `${A.zh}有一${m.zh.mw}长${t1}${u.zh}的${m.zh.n}。`
      : `${A.zh}的${m.zh.v}里有${t1}${u.zh}${m.zh.n}。`;

    if (kind === '합병') {
      s.story = {
        ko: { sents:[pairKo], q: isLen ? `두 ${EUL(n)} 이으면 모두 몇 ${u.ko}일까요?` : `${EUN(n)} 모두 몇 ${u.ko}일까요?` },
        en: { sents:[pairEn], q: isLen ? `How long are the two ${m.en.n}s together?` : `How much ${m.en.n} is there altogether?` },
        zh: { sents:[pairZh], q: isLen ? `两${m.zh.mw}${m.zh.n}接起来一共有多长？` : `${m.zh.n}一共有多少${u.zh}？` }
      };
      s.targets = {
        ko: [ isLen ? `두 ${EUL(n)} 합한 ${c.qty.ko}` : `두 ${m.ko.v}에 든 ${EUL(n)} 합한 ${c.qty.ko}`,
              `${labA.ko}의 ${c.qty.ko}`, `${labB.ko}의 ${c.qty.ko}` ],
        en: [ `the total ${c.qty.en} of both`, `the ${c.qty.en} of ${ofA}`, `the ${c.qty.en} of ${ofB}` ],
        zh: [ `两者合起来的${c.qty.zh}`, `${labA.zh}的${c.qty.zh}`, `${labB.zh}的${c.qty.zh}` ]
      };
    } else if (kind === '구차') {
      s.story = {
        ko: { sents:[pairKo], q:`${EUN(labA.ko)} ${labB.ko}보다 몇 ${u.ko} ${c.moreQ.ko}?` },
        en: { sents:[pairEn], q:`How much ${c.moreQ.en} is ${labA.en} than ${labB.en}?` },
        zh: { sents:[pairZh], q:`${labA.zh}比${labB.zh}${c.moreQ.zh}多少${u.zh}？` }
      };
      s.targets = {
        /* "더 무거운 무게"처럼 겹말이 되지 않게 '차이'로 쓴다 */
        ko: [ `${WA(labA.ko)} ${labB.ko}의 ${c.qty.ko} 차이`, `${labA.ko}의 ${c.qty.ko}`, `${labB.ko}의 ${c.qty.ko}` ],
        en: [ isLen ? `how much ${c.moreQ.en} the red ${m.en.n} is`
                    : `how much ${c.moreQ.en} ${m.en.n} is in the big ${m.en.v}`,
              `the ${c.qty.en} of ${ofA}`, `the ${c.qty.en} of ${ofB}` ],
        zh: [ `${labA.zh}比${labB.zh}${c.moreQ.zh}出的部分`, `${labA.zh}的${c.qty.zh}`, `${labB.zh}的${c.qty.zh}` ]
      };
    } else if (kind === '첨가') {
      s.story = {
        ko: { sents:[oneKo, `여기에 ${t2} ${u.ko}${uE} ${c.addV.ko}.`],
              q: isLen ? `${EUN(n)} 모두 몇 ${u.ko}가 되었을까요?` : `${m.ko.v}의 ${EUN(n)} 모두 몇 ${u.ko}일까요?` },
        en: { sents:[oneEn, `${t2} ${u.en} more was ${c.addV.en}.`],
              q: isLen ? `How long is the ${m.en.n} now?` : `How much ${m.en.n} is in the ${m.en.v} now?` },
        zh: { sents:[oneZh, `${c.addV.zh}${t2}${u.zh}。`],
              q: isLen ? `现在${m.zh.n}一共有多长？` : `现在${m.zh.v}里一共有多少${u.zh}？` }
      };
      s.targets = {
        ko: [ `더한 뒤의 전체 ${c.qty.ko}`, `처음에 있던 ${c.qty.ko}`, `나중에 더한 ${c.qty.ko}` ],
        en: [ `the total ${c.qty.en} after adding`, `the ${c.qty.en} at first`, `the ${c.qty.en} that was added` ],
        zh: [ `加进去以后的总${c.qty.zh}`, `原来的${c.qty.zh}`, `后来加进去的${c.qty.zh}` ]
      };
    } else {                                     /* 구잔 */
      s.story = {
        ko: { sents:[oneKo, `그중 ${t2} ${u.ko}${uE} ${c.cutV.ko}.`], q:`남은 ${EUN(n)} 몇 ${u.ko}일까요?` },
        en: { sents:[oneEn, `${t2} ${u.en} of it was ${c.cutV.en}.`],
              q: isLen ? `How long is the ${m.en.n} that is left?` : `How much ${m.en.n} is left?` },
        zh: { sents:[oneZh, `${c.cutV.zh}${t2}${u.zh}。`],
              q: isLen ? `剩下的${m.zh.n}有多长？` : `还剩多少${u.zh}？` }
      };
      s.targets = {
        ko: [ `남은 ${c.qty.ko}`, `처음에 있던 ${c.qty.ko}`, `${c.cutN.ko} ${c.qty.ko}` ],
        en: [ `the ${c.qty.en} that is left`, `the ${c.qty.en} at first`, `the ${c.qty.en} that was ${c.cutN.en}` ],
        zh: [ `剩下的${c.qty.zh}`, `原来的${c.qty.zh}`, `${c.cutN.zh}${c.qty.zh}` ]
      };
    }
    /* WP3 same 모드의 보기로 쓰는 짧은 꼴 — C는 문장이 원래 짧아 그대로 쓴다 */
    s.compact = {
      ko: s.story.ko.sents.join(' ') + ' ' + s.story.ko.q,
      en: s.story.en.sents.join(' ') + ' ' + s.story.en.q,
      zh: s.story.zh.sents.join('') + s.story.zh.q
    };
    return s;
  }

  /* ── 문장 조립 ──────────────────────────────────────────── */
  function storyText(s, lang, noise) {
    const st = s.story[lang];
    const sents = st.sents.slice();
    if (noise) sents.splice(Math.min(noise.pos, sents.length), 0, noise.text[lang]);
    /* 중국어는 문장 사이에 빈칸을 두지 않는다 — 한국어·영어와 같이 join하면
       "小明有5个苹果。 小红有3个。"처럼 어색해진다. */
    const sep = lang === 'zh' ? '' : ' ';
    return sents.join(sep) + sep + st.q;
  }
  function numStr(s, which) {                    /* 식에 쓸 수 표기 */
    return s.range === 'C' ? (which === 1 ? s.t1 : s.t2) : String(which === 1 ? s.n1 : s.n2);
  }

  /* 의미 유형 뽑기 — 구차에 가중치를 준다(§3-2의 함정 자리) */
  function pickKind(rng, range, weights) {
    const bag = [];
    Object.keys(weights).forEach(k => { for (let i = 0; i < weights[k]; i++) bag.push(k); });
    return pick(rng, bag);
  }
  const KIND_W = {
    A: { 합병:2, 첨가:2, 구잔:2, 구차:3, 배수:2 },
    B: { 합병:2, 첨가:2, 구잔:2, 구차:3, 배수:2, 등분:2, 포함:2 },
    C: { 합병:2, 첨가:2, 구잔:2, 구차:3 }
  };

  /* 보기 묶음 만들기 — 정답 위치를 매번 섞어 답이 한쪽으로 쏠리지 않게 한다 */
  function buildChoices(rng, langsArr, correctIdx) {
    const order = shuffle(rng, langsArr[0].map((_, i) => i));
    const out = { ko:[], en:[], zh:[] }, keys = ['ko', 'en', 'zh'];
    order.forEach(src => keys.forEach((k, ki) => out[k].push(langsArr[ki][src])));
    return { choices: out, answer: order.indexOf(correctIdx) + 1 };
  }

  /* 문항 조립 — 화면(prompt 3개 언어)과 인쇄(word·wordAsk·choices)를 같이 낸다.
     word 계열은 예전엔 한국어 문자열이었다. 인쇄가 한국어 한 벌만 찍었기 때문인데
     (app/exam.js), 그 전제가 2026-08-30에 없어졌다 — 인쇄도 세 언어를 찍는다.
     그렇다고 같은 문장을 또 만들지는 않는다: prompt를 조립할 때 이미 쓴 story·ask·
     choices 세 벌을 그대로 넘겨, 인쇄·화면이 그때그때 한 벌을 고른다.
     ⚠️ 이 셋은 {ko,en,zh} 객체다 — 읽는 쪽은 exam.js의 pickL/pickChoices를 쓸 것. */
  function assemble(s, ask, choices, answer, meta) {
    const pr = {};
    ['ko', 'en', 'zh'].forEach(lang => {
      /* 보기는 목록이라 어느 언어든 사이를 띄우지만, 본문과 물음 사이는
         중국어에서 붙여 쓴다(문장 사이에 빈칸을 두지 않는 표기). */
      const opts = choices ? ' ' + choices[lang].map((c, i) => `${i + 1}) ${c}`).join('  ') : '';
      const sep = lang === 'zh' ? '' : ' ';
      /* 식 틀(WP4 fill)은 기호뿐이라 번역이 없다. 어느 언어에서나 빈칸 앞뒤를
         띄운다 — 중국어도 수식 둘레는 띄우는 것이 읽기 쉽다. */
      pr[lang] = meta.story[lang] + sep + ask[lang] + opts + (meta.eqn ? ' ' + meta.eqn : '');
    });
    const p = {
      prompt: pr,
      word: meta.story,
      wordAsk: ask,
      answer: answer,
      answerType: 'number',
      widget: 'numpad',
      wp: {
        kind: s.kind, op: s.op, range: s.range, mode: meta.mode,
        n1: s.n1, n2: s.n2, unitKo: s.unitKo,
        /* 식에 찍히는 표기 — C는 3/5·1.4처럼 값과 표기가 다르다 */
        t1: s.t1 != null ? s.t1 : String(s.n1), t2: s.t2 != null ? s.t2 : String(s.n2),
        objKo: s.o.ko.n, actorA: s.A ? s.A.ko : null, actorB: s.B ? s.B.ko : null,
        noise: meta.noiseValue == null ? null : meta.noiseValue,
        correct: meta.correctText || null
      }
    };
    /* 정답지에 붙는 짧은 설명. 보기 문장이 긴 모드(same)는 연산 이름만 싣는다 —
       한 문항이 정답지에서 세 줄을 먹으면 채점표로 못 쓴다. */
    /* 정답 메모도 언어를 따라간다 — 채점하는 사람이 읽는 줄이라 정답지에 그대로
       찍힌다. 보기 번호만으로는 그 번호가 무엇인지 알 수 없다(exam.js 정답지 참조). */
    /* 식 틀 — 인쇄·화면의 문장제 분기가 본문·물음 아래에 그대로 그린다.
       기호만 있어 세 언어가 같으므로 문자열 하나로 둔다(exam.js pickL이 받는다). */
    if (meta.eqn) p.wordEqn = meta.eqn;
    if (choices) {
      p.choices = choices;
      p.answerNote = meta.note ||
        { ko: choices.ko[answer - 1], en: choices.en[answer - 1], zh: choices.zh[answer - 1] };
    } else if (meta.note) {
      /* 보기가 없어도 정답지에 식을 실어 준다 — "20, 8, 12"만 찍히면 채점하는
         사람이 그 세 수가 어떤 식이었는지 알 수 없다(WP4 fill). */
      p.answerNote = meta.note;
    }
    return p;
  }

  /* ============================================================
     WP1 — 문제 이해 (주어진 것과 구하고자 하는 것)
       target : 이 문제가 구하려는 것은?      (보기 번호)
       given  : 문제에 주어진 값 하나 찾아 쓰기 (정수)
       need   : 문제를 푸는 데 필요 없는 수는? (정수)
     레벨 C는 주어진 값이 분수·소수라 given을 뺀다 — 답 환원 원칙(정수/보기 번호)을
     지키기 위해서다. C의 need는 넣은 잡음 수가 늘 정수라 그대로 성립한다.
     ============================================================ */
  NM_TGEN['wp1_understand'] = function (params, rng) {
    const range = (params && params.range) || 'A';
    const modes = range === 'C' ? ['target', 'need', 'target'] : ['target', 'given', 'need'];
    const mode  = pick(rng, modes);
    const ACTOR_KINDS = { 합병:1, 첨가:1, 구잔:1, 구차:1 };
    let kind = pickKind(rng, range, KIND_W[range]);
    if (mode === 'need' && !ACTOR_KINDS[kind]) {
      const w = {}; Object.keys(KIND_W[range]).forEach(k => { if (ACTOR_KINDS[k]) w[k] = KIND_W[range][k]; });
      kind = pickKind(rng, range, w);
    }
    /* need는 소수로만 낸다 — 분수를 쓰면 분모(3/8의 8)까지 "필요 없는 수" 후보로
       읽혀 유일해가 깨진다. 정수 잡음 하나만 맨 수로 남아야 한다. */
    const numeric = mode === 'need' ? 'decimal' : ((params && params.numeric) || 'mix');
    const s = makeSituation(rng, { range, kind, numeric });

    if (mode === 'need') {
      /* ⚠️ 잡음 문장("민수는 8살이에요")은 주인공을 부른다. 배수·등분·포함은
         이야기에 사람이 안 나오므로 그 문장을 끼우면 누구 얘긴지 알 수 없는 글이
         된다 — need는 사람이 나오는 네 가지 의미 유형에서만 낸다. */
      const nz = pick(rng, NOISES);
      let v = nz.v(rng), guard = 0;
      /* 잡음 수가 문제에 실제로 쓰이는 수와 같으면 "필요 없는 수"가 흐려진다 */
      while (guard++ < 20 && (v === s.n1 || v === s.n2)) v = nz.v(rng);
      if (v === s.n1 || v === s.n2) v = (s.n1 > 11 ? 5 : 13);
      const actor = s.A;
      const noise = { pos: 1, text: { ko: nz.ko(actor.ko, v), en: nz.en(actor.en, v), zh: nz.zh(actor.zh, v) } };
      const story = { ko: storyText(s, 'ko', noise), en: storyText(s, 'en', noise), zh: storyText(s, 'zh', noise) };
      const ask = { ko:'이 문제를 푸는 데 필요 없는 수는 얼마일까요?',
                    en:'Which number is NOT needed to solve this problem?',
                    zh:'解这道题时用不到的数是几？' };
      return assemble(s, ask, null, v, { story, mode, noiseValue: v });
    }

    const story = { ko: storyText(s, 'ko'), en: storyText(s, 'en'), zh: storyText(s, 'zh') };

    if (mode === 'given' && s.givens) {
      const gv = pick(rng, s.givens);
      const ask = { ko:`${gv.ko} 문제에서 찾아 쓰세요.`, en:`${gv.en} Find it in the problem.`, zh:`${gv.zh}请从题目中找出来。` };
      return assemble(s, ask, null, gv.v, { story, mode: 'given', correctText: String(gv.v) });
    }

    /* target — 오답은 전부 '문제에 이미 주어진 것'이다. 구하는 것과 주어진 것을
       가르는 훈련이므로 오답이 엉뚱한 소리면 훈련이 안 된다. */
    const t = s.targets;
    const { choices, answer } = buildChoices(rng, [t.ko, t.en, t.zh], 0);
    const ask = { ko:'이 문제에서 구하려고 하는 것은 무엇일까요? 알맞은 번호를 쓰세요.',
                  en:'What does this problem ask you to find? Write the number.',
                  zh:'这道题要求的是什么？请写出序号。' };
    return assemble(s, ask, choices, answer, { story, mode: 'target', correctText: t.ko[0] });
  };

  /* ============================================================
     WP3 — 연산 찾기 (더할까 뺄까 곱할까)
       op   : 어떤 계산을 해야 하나       (보기 번호)
       expr : 알맞은 식은                 (보기 번호)
       same : 같은 계산을 하는 문제는     (보기 번호)
     ⚠️ 세 모드 전부 구차가 함정이다. '더 많은가'는 신호어 표(§3-1)에서 +로 분류되는
     '더'를 쓰지만 실제로는 −다. same 모드의 오답에는 반드시 '더 받았다'(첨가, +)를
     하나 섞어 넣어, 낱말만 맞춰 고르면 틀리게 만든다.
     ============================================================ */
  const OPNAME = {
    '+': { ko:'더하기', en:'addition', zh:'加法' },
    '−': { ko:'빼기',   en:'subtraction', zh:'减法' },
    '×': { ko:'곱하기', en:'multiplication', zh:'乘法' },
    '÷': { ko:'나누기', en:'division', zh:'除法' }
  };

  /* 의미 유형(§3-2)의 이름 — 정답지의 메모에만 쓴다. 채점하는 사람에게 "왜 이 답인가"를
     한 낱말로 알려 주는 자리라, 학술 용어가 아니라 그 언어의 교실 말로 적는다. */
  const KINDNAME = {
    합병: { ko:'합병', en:'putting together', zh:'合并' },
    첨가: { ko:'첨가', en:'adding on',        zh:'添加' },
    구잔: { ko:'구잔', en:'taking away',      zh:'求剩' },
    구차: { ko:'구차', en:'comparing',        zh:'求差' },
    배수: { ko:'배수', en:'equal groups',     zh:'倍数' },
    등분: { ko:'등분', en:'sharing equally',  zh:'等分' },
    포함: { ko:'포함', en:'making groups',    zh:'包含除' }
  };

  /* 그 레벨 안에 '연산은 같고 의미 유형은 다른' 짝이 있는가 */
  function hasPartner(range, kind) {
    return Object.keys(KIND_W[range]).some(k => k !== kind && OPS[k] === OPS[kind]);
  }

  NM_TGEN['wp3_operation'] = function (params, rng) {
    const range = (params && params.range) || 'A';
    const mode  = pick(rng, ['op', 'expr', 'same']);
    let kind = pickKind(rng, range, KIND_W[range]);
    /* same 모드의 문두는 '같은 연산을 쓰는 다른 의미 유형'이 있는 유형에서만 뽑는다.
       배수는 ×를 쓰는 유일한 유형이라 정답 보기가 문두와 판박이가 되어, 구조가 아니라
       겉모습만 맞춰도 풀려 버린다(실제 인쇄물에서 그렇게 나왔다). */
    if (mode === 'same' && !hasPartner(range, kind)) {
      const w = {};
      Object.keys(KIND_W[range]).forEach(k => { if (hasPartner(range, k)) w[k] = KIND_W[range][k]; });
      kind = pickKind(rng, range, w);
    }
    const s = makeSituation(rng, { range, kind, numeric: (params && params.numeric) || 'mix' });
    const story = { ko: storyText(s, 'ko'), en: storyText(s, 'en'), zh: storyText(s, 'zh') };
    /* 보기로 내놓는 연산 목록 — 정답이 나올 수 있는 범위보다 넓게 둔다.
       레벨 C는 +와 −만 쓰지만 ×를 보기에 남겨 찍기 확률을 1/3로 낮춘다. */
    const opSet = range === 'B' ? ['+', '−', '×', '÷'] : ['+', '−', '×'];

    if (mode === 'op') {
      const ko = opSet.map(x => OPNAME[x].ko), en = opSet.map(x => OPNAME[x].en), zh = opSet.map(x => OPNAME[x].zh);
      const ci = opSet.indexOf(s.op);
      const { choices, answer } = buildChoices(rng, [ko, en, zh], ci);
      const ask = { ko:'이 문제는 어떤 계산을 해야 할까요? 알맞은 번호를 쓰세요.',
                    en:'Which operation should you use? Write the number.',
                    zh:'这道题应该用哪种运算？请写出序号。' };
      return assemble(s, ask, choices, answer, { story, mode:'op', correctText: OPNAME[s.op].ko });
    }

    if (mode === 'expr') {
      const a = numStr(s, 1), b = numStr(s, 2);
      let texts;
      if (range === 'C') {
        /* +·− 두 가지뿐이라 세 번째 보기는 '거꾸로 뺀 식'으로 채운다 */
        texts = [`${a} ${s.op} ${b}`, `${a} ${s.op === '+' ? '−' : '+'} ${b}`, `${b} − ${a}`];
      } else {
        const others = opSet.filter(x => x !== s.op);
        texts = [`${a} ${s.op} ${b}`, `${a} ${others[0]} ${b}`, `${a} ${others[1]} ${b}`];
      }
      const { choices, answer } = buildChoices(rng, [texts, texts.slice(), texts.slice()], 0);
      const ask = { ko:'이 문제에 알맞은 식은 무엇일까요? 알맞은 번호를 쓰세요.',
                    en:'Which number sentence fits this problem? Write the number.',
                    zh:'哪个算式适合这道题？请写出序号。' };
      return assemble(s, ask, choices, answer, { story, mode:'expr', correctText: texts[0] });
    }

    /* same — 같은 연산을 하는 상황 고르기.
       정답은 '연산은 같고 의미 유형은 다른' 상황이라 낱말이 아니라 구조를 봐야 한다. */
    const sameKinds = Object.keys(OPS).filter(k => OPS[k] === s.op && k !== s.kind && KIND_W[range][k]);
    const otherKinds = Object.keys(OPS).filter(k => OPS[k] !== s.op && KIND_W[range][k]);
    const okKind = sameKinds.length ? pick(rng, sameKinds) : s.kind;
    /* 오답 두 개 — 하나는 반드시 '더'가 들어가는 유형(첨가·구차)을 우선한다 */
    const lure = otherKinds.filter(k => k === '첨가' || k === '구차');
    const restKinds = shuffle(rng, otherKinds.filter(k => lure.indexOf(k) < 0));
    const wrongKinds = [];
    if (lure.length) wrongKinds.push(pick(rng, lure));
    while (wrongKinds.length < 2 && restKinds.length) wrongKinds.push(restKinds.pop());
    while (wrongKinds.length < 2) wrongKinds.push(pick(rng, otherKinds));

    const opts = [okKind].concat(wrongKinds).map(k =>
      makeSituation(rng, { range, kind: k, numeric: (params && params.numeric) || 'mix' }).compact);
    const { choices, answer } = buildChoices(rng, [opts.map(x => x.ko), opts.map(x => x.en), opts.map(x => x.zh)], 0);
    const ask = { ko:'위 문제와 같은 계산을 해야 하는 문제는 무엇일까요? 알맞은 번호를 쓰세요.',
                  en:'Which problem needs the same operation as the one above? Write the number.',
                  zh:'下面哪道题和上面用同样的运算？请写出序号。' };
    return assemble(s, ask, choices, answer,
      { story, mode:'same', correctText: opts[0].ko,
        note: { ko: `${OPNAME[s.op].ko} — ${KINDNAME[okKind].ko}`,
                en: `${OPNAME[s.op].en} — ${KINDNAME[okKind].en}`,
                zh: `${OPNAME[s.op].zh} — ${KINDNAME[okKind].zh}` } });
  };


  /* ============================================================
     WP4 — 식으로 나타내어라 (계획 수립, §2 Ⅳ)
       fill : □ ○ □ = □ 를 채워 식을 완성       (정수 세 칸)  — 말→식 · 곱셈식
       info : 필요한 수만 골라 만든 식은        (보기 번호)  — 적절한 정보를 찾아 식으로
       box  : □가 있는 덧셈식·곱셈식으로 쓰면   (보기 번호)  — 그림→□식 · 수직선→□식

     ⚠️ 이 스레드의 가장 큰 함정은 문제가 아니라 **정답 키**에 있다. `□ + □ = □`을
     그대로 물으면 합병 상황에서 `4 + 7`과 `7 + 4`가 둘 다 맞는 식이 되어 유일해가
     깨진다(교환법칙). 이 저장소는 예전에 DV6에서 유일해 없는 키를 낸 적이 있다.
     그래서 두 갈래로 갈랐다:
       · fill — **문제에 나온 차례**로 못 박는다. 물음에 그렇게 적혀 있고, 상황
         생성기가 늘 n1을 먼저 말하므로(합병 "A는 n1, B는 n2" · 배수 "한 상자에 n1씩
         n2상자" …) 차례가 데이터로 정해져 있다. n1 ≠ n2도 생성기가 이미 보장한다.
       · info · box — 아예 **보기 번호**로 받는다. 식을 글자로 비교하지 않으니
         교환법칙이 끼어들 자리가 없다. 레벨 C는 수가 분수·소수라 빈칸으로 받을 수
         없으므로(답 환원 원칙: 정수 또는 보기 번호) 이 두 모드만 쓴다.

     ⚠️ 구차는 여기서도 함정이다(§3-2). info의 오답에는 반드시 `t1 + t2`를,
     box의 오답에는 `t1 + t2 = □`를 넣는다 — '몇 개 더 많은가'를 '더'만 보고
     덧셈으로 옮기는 아이가 정확히 그 보기를 고른다. fill은 연산 기호 자리를 ○로
     비워 두고 답에 **계산 결과까지** 넣어, 더하기로 옮긴 아이는 셋째 칸에서 걸린다.

     ⚠️ 식이 인쇄물에 닿는 길은 `steps`가 아니라 `wordEqn`이다. exam.js의
     printSteps()는 p.word가 있으면 ''을 돌려준다 — 문장제 레이아웃의 주인이 word
     분기 하나여야 하기 때문이다. steps에 식을 실으면 화면엔 나오고 **인쇄물에서만
     조용히 사라진다**. 그래서 word 분기가 식 틀도 직접 그린다(exam.js).
     ============================================================ */
  function resultOf(s) {
    return s.op === '+' ? s.n1 + s.n2
         : s.op === '−' ? s.n1 - s.n2
         : s.op === '×' ? s.n1 * s.n2
         : s.n1 / s.n2;
  }
  /* 식 채우기의 유일해 확인 — 후보를 **전부** 훑는다.
     학생이 틀에 채울 수 있는 수는 본문에 나온 두 수뿐이므로, (앞 수, 뒤 수, 기호)
     조합 4×4가지를 모두 계산해 결과가 답과 같아지는 것이 정확히 하나인지 센다.
     교환되는 연산은 첫 수가 이미 찍혀 있으므로 앞 수가 n1로 고정된 경우만 센다.
     ⚠️ 이 함수는 생성기와 검사기(scripts/check-wp4-unique.js) 양쪽이 같은 뜻으로
     쓰지만, 검사기는 이 함수를 부르지 않고 따로 다시 짠다 — 여기가 틀리면 검사기도
     같이 틀리는 것을 막기 위해서다. */
  function uniqueFill(s, r) {
    const pinned = s.op === '+' || s.op === '×';
    const ev = (x, o, y) => o === '+' ? x + y : o === '−' ? x - y : o === '×' ? x * y : x / y;
    const nums = [s.n1, s.n2];
    let hits = 0;
    nums.forEach(x => {
      if (pinned && x !== s.n1) return;              /* 첫 수는 인쇄물에 이미 찍혀 있다 */
      nums.forEach(y => {
        ['+', '−', '×', '÷'].forEach(o => { if (ev(x, o, y) === r) hits++; });
      });
    });
    return hits === 1;
  }

  /* 오답으로 붙일 '반대쪽' 연산 — 구차(−)에는 반드시 +가 붙는다 */
  const LURE_OP = { '+':'−', '−':'+', '×':'+', '÷':'−' };
  /* 뺄셈은 덧셈으로, 나눗셈은 곱셈으로 되짚는다(□가 있는 식) */
  const INV_OP  = { '−':'+', '÷':'×' };
  /* box는 되짚을 수 있는 유형에서만 낸다 — 덧셈 상황은 구하는 것이 이미 합이라
     □를 앞에 둘 자리가 없다(`n1 + n2 = □`가 되어 되짚기가 아니다). */
  const BOX_KINDS = { A:{ 구잔:3, 구차:3 }, B:{ 구잔:2, 구차:3, 등분:2, 포함:2 }, C:{ 구잔:3, 구차:3 } };
  /* info는 잡음 문장이 주인공을 부르므로 사람이 나오는 네 유형에서만 낸다
     (WP1 need와 같은 이유 — 배수·등분·포함 이야기엔 사람이 없다). */
  const INFO_KINDS = { 합병:2, 첨가:2, 구잔:2, 구차:3 };

  NM_TGEN['wp4_equation'] = function (params, rng) {
    const range   = (params && params.range) || 'A';
    const numeric = (params && params.numeric) || 'mix';
    /* C는 수가 분수·소수라 빈칸(정수)으로 받을 수 없다 — fill을 뺀다 */
    const mode = pick(rng, range === 'C' ? ['info', 'box'] : ['fill', 'info', 'box']);

    if (mode === 'fill') {
      /* ── 유일해를 지시문이 아니라 **산술**로 만든다 ──────────────────
         처음에는 `□ ○ □ = □`을 통째로 비우고 "문제에 나온 차례대로 쓰세요"로
         차례를 못 박았다. 그걸 기계로 세어 보니 못 박은 것이 아니었다:
           · 합병 4와 7 → `4 + 7 = 11`도 `7 + 4 = 11`도 틀 안에서 참이다.
             13,384개 중 **6,266개(47%)**가 이 경우였다. 7+4로 쓴 아이를 정답
             키가 오답 처리한다 — DV6에서 겪은 것과 똑같은 자리다.
           · 게다가 같은 수를 두 번 써서 맞는 것도 801개 있었다
             (합병 3·6이면 `3 × 3 = 9`가 틀 안에서 참이고 결과도 9다).
         그래서 **교환되는 연산(+·×)은 첫 수를 미리 찍어 준다**:
             `6 ○ □ = □`  → 남은 자유도는 (두 번째 수, 결과)뿐
         −·÷는 차례가 산술로 이미 정해져 있으므로(4−7·7÷56은 답이 안 된다)
         세 칸을 다 비운다. 어느 쪽이든 아래 uniqueFill()이 **후보를 전부 훑어**
         정답이 하나뿐임을 확인한 상황만 내보낸다.

         ⚠️ 연산 기호 자리(○)는 비워 둔다. 채점은 수로만 하지만, 더하기로 잘못
         옮긴 아이는 마지막 칸(결과)에서 반드시 걸린다 — 구차 함정이 여기 있다. */
      let s = null, r = 0, ok = false;
      for (let tryN = 0; tryN < 30 && !ok; tryN++) {
        const kind = pickKind(rng, range, KIND_W[range]);
        s = makeSituation(rng, { range, kind, numeric });
        r = resultOf(s);
        ok = uniqueFill(s, r);
      }
      const pinned = s.op === '+' || s.op === '×';     /* 교환되는 연산만 첫 수를 찍어 준다 */
      const story = { ko: storyText(s, 'ko'), en: storyText(s, 'en'), zh: storyText(s, 'zh') };
      const shown = `${numStr(s, 1)} ${s.op} ${numStr(s, 2)} = ${r}`;
      const ask = pinned ? {
        ko: '○에는 알맞은 계산 기호를, □에는 알맞은 수를 넣어 식을 완성하세요. □에 들어갈 두 수를 차례대로 쓰세요.',
        en: 'Put the right sign in the circle and the right numbers in the boxes to finish the number sentence. Then write the two box numbers in order.',
        zh: '在○里填上合适的运算符号，在方框里填上合适的数，完成算式。再按顺序写出两个方框里的数。'
      } : {
        ko: '○에는 알맞은 계산 기호를, □에는 알맞은 수를 넣어 식을 완성하세요. □에 들어갈 세 수를 차례대로 쓰세요.',
        en: 'Put the right sign in the circle and the right numbers in the boxes to finish the number sentence. Then write the three box numbers in order.',
        zh: '在○里填上合适的运算符号，在方框里填上合适的数，完成算式。再按顺序写出三个方框里的数。'
      };
      /* 식 틀은 어느 언어에서나 같은 기호다 — 번역하지 않는다(언어 혼입도 없다) */
      return assemble(s, ask, null, pinned ? [s.n2, r] : [s.n1, s.n2, r],
        { story, mode: 'fill',
          eqn: pinned ? `${numStr(s, 1)} ○ □ = □` : '□ ○ □ = □',
          correctText: shown, note: { ko: shown, en: shown, zh: shown } });
    }

    if (mode === 'info') {
      const kind = pickKind(rng, range, INFO_KINDS);
      const s = makeSituation(rng, { range, kind, numeric });
      /* 문제를 푸는 데 필요 없는 수를 하나 끼운다 — 그 수를 쓴 식이 오답이 된다 */
      const nz = pick(rng, NOISES);
      let v = nz.v(rng), guard = 0;
      while (guard++ < 20 && (v === s.n1 || v === s.n2)) v = nz.v(rng);
      if (v === s.n1 || v === s.n2) v = (s.n1 > 11 ? 5 : 13);
      /* 잡음은 본문 **끝**(물음 바로 앞)에 넣는다. WP1 need처럼 첫 문장 뒤에 끼우면
         구잔 이야기가 "…가지고 있었어요. 3번 버스를 타요. 그중 5개를 먹었어요."가 되어
         '그중'이 가리킬 것을 잃는다 — 잡음은 글을 흐트러뜨리되 비문을 만들면 안 된다. */
      const noise = { pos: s.story.ko.sents.length,
                      text: { ko: nz.ko(s.A.ko, v), en: nz.en(s.A.en, v), zh: nz.zh(s.A.zh, v) } };
      const story = { ko: storyText(s, 'ko', noise), en: storyText(s, 'en', noise), zh: storyText(s, 'zh', noise) };
      const a = numStr(s, 1), b = numStr(s, 2);
      /* 오답 둘 — ①필요 없는 수를 쓴 식 ②연산을 반대로 고른 식(구차엔 덧셈) */
      const texts = [`${a} ${s.op} ${b}`, `${a} ${s.op} ${v}`, `${a} ${LURE_OP[s.op]} ${b}`];
      const { choices, answer } = buildChoices(rng, [texts, texts.slice(), texts.slice()], 0);
      /* 물음을 "필요한 수만 쓴 식은?"으로 적으면 안 된다 — 연산만 틀린 오답(`a − b`)도
         '필요한 수만' 쓴 식이라 정답이 둘이 된다. 묻는 것은 어디까지나 '문제를 푸는 식'이고,
         쓰지 않는 수가 하나 있다는 사실만 알려 준다(적절한 정보를 찾아 식으로, §2 Ⅳ). */
      const ask = { ko:'이 문제를 푸는 데 알맞은 식은 무엇일까요? 문제에는 쓰지 않는 수도 하나 들어 있어요. 알맞은 번호를 쓰세요.',
                    en:'Which number sentence solves this problem? One number in the story is not used. Write the number.',
                    zh:'哪个算式能解这道题？题目里有一个数是用不到的。请写出序号。' };
      return assemble(s, ask, choices, answer,
        { story, mode: 'info', noiseValue: v, correctText: texts[0] });
    }

    /* box — 뺄셈 상황을 덧셈식으로, 나눗셈 상황을 곱셈식으로 되짚어 쓴다.
       구잔 "먹은 것 + 남은 것 = 처음 것" · 구차 "적은 쪽 + 차이 = 많은 쪽"
       등분 "사람 수 × 한 명 몫 = 전체" · 포함 "한 상자 몫 × 상자 수 = 전체" */
    const kind = pickKind(rng, range, BOX_KINDS[range]);
    const s = makeSituation(rng, { range, kind, numeric });
    const story = { ko: storyText(s, 'ko'), en: storyText(s, 'en'), zh: storyText(s, 'zh') };
    const a = numStr(s, 1), b = numStr(s, 2), iv = INV_OP[s.op];
    /* 오답 둘 — ①두 수를 뒤바꾼 식 ②되짚지 않고 그냥 두 수를 계산한 식(구차 함정) */
    const texts = [`${b} ${iv} □ = ${a}`, `${a} ${iv} □ = ${b}`, `${a} ${iv} ${b} = □`];
    const { choices, answer } = buildChoices(rng, [texts, texts.slice(), texts.slice()], 0);
    const isAdd = iv === '+';
    const ask = {
      ko: `이 문제를 □가 있는 ${isAdd ? '덧셈식' : '곱셈식'}으로 나타내면 무엇일까요? 알맞은 번호를 쓰세요.`,
      en: `Which ${isAdd ? 'addition' : 'multiplication'} sentence with a box fits this problem? Write the number.`,
      zh: `哪个带□的${isAdd ? '加法' : '乘法'}算式适合这道题？请写出序号。`
    };
    return assemble(s, ask, choices, answer,
      { story, mode: 'box', correctText: texts[0] });
  };

})();
