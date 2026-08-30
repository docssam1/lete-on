/* ============================================================
   Numbers of Magic — 수학사 네 컷 만화 (story comics)
   개념 노트의 수학사(story.history)가 "설명 한 줄"로만 나오던 것을
   네 컷 만화로 보여준다. 여기 등록된 유닛은 개념 노트에서 🏛 한 줄
   대신 만화가 렌더되고, 등록 안 된 유닛은 기존 한 줄이 그대로 나온다.

   - art: 전부 원본 도형 SVG (viewBox 200×140). 라이선스 그림·트레이스 없음.
     그림 속 글자는 이야기의 대상인 기호·낱말(minus, radix, dy/dx…)과 숫자만 —
     3개 언어가 그림 한 벌을 공유한다.
   - text: {ko,en,zh} 세 언어 캡션. 내용은 해당 유닛 story.history를
     네 컷으로 다시 쓴 것(공지의 역사적 사실, 창작 문장).
   - 새 만화 추가 = 이 파일에 유닛 id로 항목 추가. 렌더러 수정 불필요.
   ============================================================ */
(function(){
'use strict';

/* 자주 쓰는 도형 조각 — 양(구름 몸통+머리+다리) */
function sheep(x,y,s,flip){
  const f=flip?'scale(-1,1) translate('+(-2*x)+',0)':'';
  return '<g transform="translate('+x+','+y+') scale('+s+') '+f+'">'
    +'<ellipse cx="0" cy="0" rx="16" ry="10" fill="#f5f1e6" stroke="#1A2233" stroke-width="2"/>'
    +'<circle cx="14" cy="-6" r="6" fill="#1A2233"/>'
    +'<circle cx="16" cy="-7" r="1.4" fill="#fff"/>'
    +'<line x1="-8" y1="9" x2="-8" y2="16" stroke="#1A2233" stroke-width="2"/>'
    +'<line x1="6" y1="9" x2="6" y2="16" stroke="#1A2233" stroke-width="2"/></g>';
}
/* 막대 사람 */
function stick(x,y,s,col){
  col=col||'#16417C';
  return '<g transform="translate('+x+','+y+') scale('+s+')" stroke="'+col+'" stroke-width="2.4" stroke-linecap="round" fill="none">'
    +'<circle cx="0" cy="-18" r="6" fill="#fff"/>'
    +'<line x1="0" y1="-12" x2="0" y2="6"/>'
    +'<line x1="0" y1="-6" x2="-9" y2="0"/><line x1="0" y1="-6" x2="9" y2="0"/>'
    +'<line x1="0" y1="6" x2="-7" y2="18"/><line x1="0" y1="6" x2="7" y2="18"/></g>';
}
/* 주머니 + 조약돌 n개 */
function pouch(x,y,n){
  let dots='';
  for(let i=0;i<n;i++){dots+='<circle cx="'+(x-8+(i%3)*8)+'" cy="'+(y+2+Math.floor(i/3)*8)+'" r="3.2" fill="#4a5468"/>';}
  return '<path d="M '+(x-15)+' '+(y-6)+' Q '+x+' '+(y-16)+' '+(x+15)+' '+(y-6)+' L '+(x+12)+' '+(y+16)+' Q '+x+' '+(y+22)+' '+(x-12)+' '+(y+16)+' Z" fill="#EAC996" stroke="#1A2233" stroke-width="2"/>'
    +'<line x1="'+(x-15)+'" y1="'+(y-6)+'" x2="'+(x+15)+'" y2="'+(y-6)+'" stroke="#1A2233" stroke-width="2"/>'+dots;
}
function svg(inner){return '<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'+inner+'</svg>';}

window.NM_COMICS = {

  /* ── N-01 · 숫자가 없던 시절의 양치기 ── */
  'N-01': { panels: [
    { art: svg(
        '<line x1="0" y1="112" x2="200" y2="112" stroke="#C9A063" stroke-width="3"/>'
        +'<rect x="18" y="62" width="6" height="50" fill="#8a6d46"/><rect x="52" y="62" width="6" height="50" fill="#8a6d46"/>'
        +'<line x1="21" y1="70" x2="55" y2="70" stroke="#8a6d46" stroke-width="4"/>'
        +sheep(95,98,1,false)
        +stick(150,92,1.15)
        +pouch(150,120,1)
        +'<path d="M 138 92 Q 132 104 144 112" fill="none" stroke="#2E9E6B" stroke-width="2" stroke-dasharray="3 3" marker-end="none"/>'),
      text: { ko:'옛날 양치기는 숫자를 몰랐어요. 양이 한 마리 나갈 때마다 조약돌 하나를 주머니에 넣었죠.',
              en:'Long ago, a shepherd knew no numbers. Each time a sheep went out, he dropped one pebble into his pouch.',
              zh:'很久以前，牧羊人不认识数字。每出去一只羊，他就往袋子里放一颗小石子。' } },
    { art: svg(
        sheep(40,40,0.9,false)+sheep(100,40,0.9,false)+sheep(160,40,0.9,false)
        +'<line x1="40" y1="62" x2="60" y2="96" stroke="#b0b7c3" stroke-width="1.5" stroke-dasharray="3 3"/>'
        +'<line x1="100" y1="62" x2="100" y2="96" stroke="#b0b7c3" stroke-width="1.5" stroke-dasharray="3 3"/>'
        +'<line x1="160" y1="62" x2="140" y2="96" stroke="#b0b7c3" stroke-width="1.5" stroke-dasharray="3 3"/>'
        +'<circle cx="60" cy="106" r="6" fill="#4a5468"/><circle cx="100" cy="106" r="6" fill="#4a5468"/><circle cx="140" cy="106" r="6" fill="#4a5468"/>'),
      text: { ko:'양 세 마리 = 조약돌 세 개. 수를 몰라도 하나씩 짝을 지으면 돼요!',
              en:'Three sheep = three pebbles. No numbers needed — just pair them one to one!',
              zh:'三只羊＝三颗石子。不用数字，一一配对就行！' } },
    { art: svg(
        '<circle cx="170" cy="26" r="14" fill="#F5D98B"/><circle cx="164" cy="22" r="12" fill="#fdfaf3"/>'
        +'<line x1="0" y1="112" x2="200" y2="112" stroke="#C9A063" stroke-width="3"/>'
        +sheep(70,98,1,true)
        +stick(140,92,1.15)
        +pouch(140,120,2)
        +'<path d="M 152 112 Q 162 100 156 92" fill="none" stroke="#D9534F" stroke-width="2" stroke-dasharray="3 3"/>'
        +'<circle cx="158" cy="88" r="3.2" fill="#4a5468"/>'),
      text: { ko:'저녁이 되어 양이 돌아올 때마다 조약돌을 하나씩 꺼냈어요.',
              en:'In the evening, for every sheep that came home, he took one pebble back out.',
              zh:'到了傍晚，每回来一只羊，他就取出一颗石子。' } },
    { art: svg(
        '<path d="M 120 112 Q 150 78 200 104 L 200 140 L 120 140 Z" fill="#dfe7db"/>'
        +sheep(168,96,0.8,true)
        +pouch(56,100,1)
        +'<text x="56" y="60" text-anchor="middle" font-size="34" font-weight="800" fill="#D9534F">!</text>'
        +'<line x1="0" y1="126" x2="200" y2="126" stroke="#C9A063" stroke-width="3"/>'),
      text: { ko:'돌이 하나 남았다면? 아직 한 마리가 안 돌아온 거예요. 이것이 수 세기의 시작이었답니다!',
              en:'One pebble left? Then one sheep is still missing. That was the very beginning of counting!',
              zh:'还剩一颗石子？说明还有一只羊没回来。这就是数数的开始！' } },
  ]},

  /* ── A-10 · 빼기 기호의 탄생 ── */
  'A-10': { panels: [
    { art: svg(
        '<rect x="34" y="24" width="132" height="92" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<line x1="48" y1="44" x2="152" y2="44" stroke="#e0d6bd" stroke-width="2"/>'
        +'<line x1="48" y1="96" x2="152" y2="96" stroke="#e0d6bd" stroke-width="2"/>'
        +'<text x="100" y="78" text-anchor="middle" font-size="24" font-style="italic" fill="#1A2233" font-family="Georgia,serif">minus</text>'),
      text: { ko:'옛날 책은 "모자라다"를 라틴어로 minus라고 길게 적었어요.',
              en:'Old books wrote out the Latin word minus — meaning "less" — in full.',
              zh:'从前的书要把"不足"完整写成拉丁语minus。' } },
    { art: svg(
        stick(36,74,1.2,'#4a5468')
        +'<rect x="70" y="34" width="112" height="72" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<text x="106" y="80" text-anchor="middle" font-size="20" font-style="italic" fill="#b0b7c3" font-family="Georgia,serif" text-decoration="line-through">minus</text>'
        +'<text x="156" y="80" text-anchor="middle" font-size="24" font-weight="700" fill="#16417C" font-family="Georgia,serif">−m</text>'),
      text: { ko:'바쁜 필경사들은 점점 줄여서 −m이라고만 썼죠.',
              en:'Busy scribes shortened it more and more, down to just −m.',
              zh:'忙碌的抄写员越写越短，只剩下−m。' } },
    { art: svg(
        '<text x="60" y="84" text-anchor="middle" font-size="34" font-weight="700" fill="#b0b7c3" font-family="Georgia,serif">−m</text>'
        +'<path d="M 92 74 L 128 74 M 120 66 L 128 74 L 120 82" fill="none" stroke="#C9A063" stroke-width="3" stroke-linecap="round"/>'
        +'<text x="158" y="86" text-anchor="middle" font-size="44" font-weight="800" fill="#16417C">−</text>'),
      text: { ko:'나중엔 m마저 떨어져 나가고, 작대기 하나만 남았어요.',
              en:'In the end even the m fell away, leaving only the little stroke.',
              zh:'最后连m也掉了，只剩下一道小横杠。' } },
    { art: svg(
        '<rect x="56" y="20" width="88" height="104" rx="5" fill="#16417C"/>'
        +'<rect x="64" y="28" width="72" height="88" rx="3" fill="#fdf6e3"/>'
        +'<text x="100" y="58" text-anchor="middle" font-size="16" font-weight="800" fill="#1A2233">1489</text>'
        +'<text x="100" y="102" text-anchor="middle" font-size="40" font-weight="800" fill="#D9534F">−</text>'),
      text: { ko:'1489년 독일 책에 처음 등장! 빼기 기호는 스스로도 "빼기"로 만들어진 셈이에요.',
              en:'It first appeared in a German book in 1489. The minus sign was itself made by subtracting!',
              zh:'它最早出现在1489年的一本德文书里。减号本身就是"减"出来的！' } },
  ]},

  /* ── B-01 · 체스판과 두 배의 마법 ── */
  'B-01': { panels: [
    { art: svg(
        stick(40,80,1.3)
        +'<path d="M 28 50 L 34 40 L 40 48 L 46 38 L 52 48 L 58 40 L 62 50 Z" fill="#F5D98B" stroke="#C9A063" stroke-width="2"/>'
        +stick(160,84,1.15,'#4a5468')
        +'<g transform="translate(84,92)">'
        +'<rect x="0" y="0" width="48" height="24" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="0" y="0" width="12" height="12" fill="#1A2233"/><rect x="24" y="0" width="12" height="12" fill="#1A2233"/>'
        +'<rect x="12" y="12" width="12" height="12" fill="#1A2233"/><rect x="36" y="12" width="12" height="12" fill="#1A2233"/></g>'),
      text: { ko:'체스를 만든 현자에게 왕이 상을 내리려 했어요. 현자의 소원: "첫 칸에 쌀 1톨, 다음 칸마다 두 배씩만 주세요."',
              en:'A king offered a reward to the sage who invented chess. The wish: "One grain of rice on the first square, then double it on each next square."',
              zh:'国王要奖赏发明国际象棋的智者。他的愿望是："第一格放1粒米，之后每格翻一倍。"' } },
    { art: svg(
        '<g transform="translate(20,50)">'
        +'<rect x="0" y="0" width="40" height="40" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="40" y="0" width="40" height="40" fill="#f1f0ec" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="80" y="0" width="40" height="40" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<rect x="120" y="0" width="40" height="40" fill="#f1f0ec" stroke="#1A2233" stroke-width="2"/>'
        +'<text x="20" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">1</text>'
        +'<text x="60" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">2</text>'
        +'<text x="100" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">4</text>'
        +'<text x="140" y="26" text-anchor="middle" font-size="15" font-weight="800" fill="#16417C">8</text></g>'
        +'<text x="100" y="122" text-anchor="middle" font-size="14" font-weight="800" fill="#C9A063">×2 → ×2 → ×2</text>'),
      text: { ko:'왕은 웃으며 승낙했어요. 1, 2, 4, 8, 16… 칸마다 겨우 두 배인걸요?',
              en:'The king laughed and agreed. 1, 2, 4, 8, 16 … it is only doubling, after all?',
              zh:'国王笑着答应了。1、2、4、8、16……不过是翻倍而已嘛？' } },
    { art: svg(
        '<polyline points="16,120 44,118 72,112 100,100 128,76 156,40 180,14" fill="none" stroke="#D9534F" stroke-width="3.5" stroke-linecap="round"/>'
        +'<polygon points="180,14 168,18 174,28" fill="#D9534F"/>'
        +'<line x1="16" y1="124" x2="184" y2="124" stroke="#1A2233" stroke-width="2"/>'
        +'<circle cx="44" cy="118" r="3" fill="#16417C"/><circle cx="100" cy="100" r="3" fill="#16417C"/><circle cx="156" cy="40" r="3" fill="#16417C"/>'),
      text: { ko:'그런데 두 배는 반복될수록 무섭게 커져요. 64번째 칸에는 온 나라의 쌀을 다 모아도 모자랐대요!',
              en:'But doubling grows frighteningly fast. By the 64th square, all the rice in the kingdom was not enough!',
              zh:'可是翻倍越来越吓人。到第64格，全国的米加起来都不够！' } },
    { art: svg(
        stick(50,84,1.3)
        +'<path d="M 38 54 L 44 44 L 50 52 L 56 42 L 62 52 L 68 44 L 72 54 Z" fill="#F5D98B" stroke="#C9A063" stroke-width="2"/>'
        +'<text x="44" y="34" text-anchor="middle" font-size="22" font-weight="800" fill="#D9534F">!</text>'
        +'<polygon points="130,116 160,56 190,116" fill="#f5f1e6" stroke="#C9A063" stroke-width="2.5"/>'
        +'<polygon points="142,92 160,56 178,92" fill="#fdf6e3"/>'
        +'<text x="160" y="134" text-anchor="middle" font-size="12" font-weight="800" fill="#4a5468">2⁶³</text>'),
      text: { ko:'두 배(×2)의 반복 = 거듭제곱. 몇 번만 반복돼도 감당할 수 없이 커지는 것, 그게 이 유닛의 마법이에요!',
              en:'Repeated doubling is a power of 2. Just a few repeats and it grows beyond control — that is the magic of this unit!',
              zh:'反复翻倍就是2的乘方。重复几次就大得不得了——这正是本单元的魔法！' } },
  ]},

  /* ── M-01 · 붉은 산가지, 검은 산가지 ── */
  'M-01': { panels: [
    { art: svg(
        '<rect x="30" y="30" width="140" height="80" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<line x1="56" y1="46" x2="56" y2="94" stroke="#D9534F" stroke-width="5" stroke-linecap="round"/>'
        +'<line x1="76" y1="46" x2="76" y2="94" stroke="#D9534F" stroke-width="5" stroke-linecap="round"/>'
        +'<line x1="96" y1="46" x2="96" y2="94" stroke="#D9534F" stroke-width="5" stroke-linecap="round"/>'
        +'<text x="138" y="80" text-anchor="middle" font-size="26" font-weight="800" fill="#D9534F">+</text>'),
      text: { ko:'2,000년 전 중국 『구장산술』은 산가지 막대로 계산했어요. 붉은 가지는 더하는 수(+)!',
              en:'Two thousand years ago, Chinese mathematicians computed with counting rods. Red rods meant positive numbers (+)!',
              zh:'两千年前，《九章算术》用算筹来计算。红色的筹表示正数(+)！' } },
    { art: svg(
        '<rect x="30" y="30" width="140" height="80" rx="6" fill="#fdf6e3" stroke="#C9A063" stroke-width="2.5"/>'
        +'<line x1="56" y1="46" x2="56" y2="94" stroke="#1A2233" stroke-width="5" stroke-linecap="round"/>'
        +'<line x1="76" y1="46" x2="76" y2="94" stroke="#1A2233" stroke-width="5" stroke-linecap="round"/>'
        +'<text x="130" y="80" text-anchor="middle" font-size="26" font-weight="800" fill="#1A2233">−</text>'),
      text: { ko:'검은 가지는 빼는 수(−). 색만 봐도 부호가 한눈에 보였죠!',
              en:'Black rods meant negative numbers (−). One glance at the colour told you the sign!',
              zh:'黑色的筹表示负数(−)。一看颜色就知道正负！' } },
    { art: svg(
        stick(52,78,1.3,'#4a5468')
        +'<ellipse cx="134" cy="52" rx="44" ry="26" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<path d="M 104 70 L 92 84 L 112 74 Z" fill="#fff" stroke="#1A2233" stroke-width="2"/>'
        +'<text x="126" y="60" text-anchor="middle" font-size="20" font-weight="800" fill="#D9534F">−5</text>'
        +'<text x="152" y="60" text-anchor="middle" font-size="20" font-weight="800" fill="#4a5468">?</text>'),
      text: { ko:'한편 유럽은 오랫동안 음수를 "거짓 수"라 부르며 의심했어요.',
              en:'Europe, meanwhile, long distrusted negatives, calling them "false numbers."',
              zh:'而欧洲长期怀疑负数，把它叫作"假数"。' } },
    { art: svg(
        '<line x1="16" y1="82" x2="184" y2="82" stroke="#1A2233" stroke-width="2.5"/>'
        +'<polygon points="184,82 176,78 176,86" fill="#1A2233"/>'
        +[-3,-2,-1,0,1,2,3].map(function(n,i){var x=34+i*22;
          return '<line x1="'+x+'" y1="77" x2="'+x+'" y2="87" stroke="#1A2233" stroke-width="2"/>'
            +'<text x="'+x+'" y="104" text-anchor="middle" font-size="11" font-weight="700" fill="'+(n<0?'#D9534F':'#16417C')+'">'+n+'</text>';}).join('')
        +'<rect x="88" y="22" width="10" height="34" rx="5" fill="#fff" stroke="#4a5468" stroke-width="2"/>'
        +'<circle cx="93" cy="56" r="7" fill="#D9534F"/>'
        +'<rect x="90.5" y="34" width="5" height="20" fill="#D9534F"/>'),
      text: { ko:'지금은요? 영하 온도, 지하층, 통장의 빚 — 음수는 우리 곁 어디에나 있답니다!',
              en:'And today? Sub-zero temperatures, basement floors, money owed — negatives are everywhere around us!',
              zh:'现在呢？零下的气温、地下楼层、欠的钱——负数无处不在！' } },
  ]},

  /* ── M-15 · √ 기호의 뿌리 ── */
  'M-15': { panels: [
    { art: svg(
        '<line x1="0" y1="92" x2="200" y2="92" stroke="#C9A063" stroke-width="3"/>'
        +'<rect x="92" y="58" width="14" height="34" fill="#8a6d46"/>'
        +'<circle cx="99" cy="40" r="28" fill="#2E9E6B"/>'
        +'<path d="M 99 92 L 84 116 M 99 92 L 99 122 M 99 92 L 114 116" stroke="#8a6d46" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
        +'<text x="99" y="136" text-anchor="middle" font-size="15" font-style="italic" font-weight="700" fill="#1A2233" font-family="Georgia,serif">radix</text>'),
      text: { ko:'라틴어 radix는 "뿌리"라는 뜻이에요. 제곱근을 영어로 root(뿌리)라 부르는 이유죠.',
              en:'The Latin word radix means "root" — which is exactly why we call it the square root.',
              zh:'拉丁语radix的意思是"根"。这正是平方根叫root的原因。' } },
    { art: svg(
        '<text x="100" y="96" text-anchor="middle" font-size="72" font-style="italic" fill="#16417C" font-family="Georgia,serif">r</text>'
        +'<path d="M 140 40 Q 158 30 168 44" fill="none" stroke="#C9A063" stroke-width="2.5" stroke-dasharray="4 3"/>'),
      text: { ko:'radix의 첫 글자 r. 수학자들은 이 글자를 빠르게 흘려 썼는데…',
              en:'Its first letter is r. Mathematicians wrote it faster and faster, in a flowing hand …',
              zh:'radix的第一个字母是r。数学家们写得越来越快、越来越潦草……' } },
    { art: svg(
        '<text x="52" y="92" text-anchor="middle" font-size="52" font-style="italic" fill="#b0b7c3" font-family="Georgia,serif">r</text>'
        +'<path d="M 82 70 L 116 70 M 108 62 L 116 70 L 108 78" fill="none" stroke="#C9A063" stroke-width="3" stroke-linecap="round"/>'
        +'<path d="M 132 78 L 140 96 L 152 44 L 184 44" fill="none" stroke="#16417C" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
      text: { ko:'흘려 쓴 r이 점점 지금의 √ 모양이 됐다고 전해져요.',
              en:'That hurried r, the story goes, slowly turned into the √ sign we use today.',
              zh:'据说那个潦草的r，渐渐变成了今天的√。' } },
    { art: svg(
        '<line x1="0" y1="86" x2="200" y2="86" stroke="#C9A063" stroke-width="3"/>'
        +'<rect x="92" y="56" width="14" height="30" fill="#8a6d46"/>'
        +'<circle cx="99" cy="38" r="26" fill="#2E9E6B"/>'
        +'<text x="99" y="45" text-anchor="middle" font-size="20" font-weight="800" fill="#fff">9</text>'
        +'<path d="M 99 86 L 86 108 M 99 86 L 99 114 M 99 86 L 112 108" stroke="#8a6d46" stroke-width="3.5" stroke-linecap="round" fill="none"/>'
        +'<text x="99" y="132" text-anchor="middle" font-size="15" font-weight="800" fill="#8a6d46">3</text>'
        +'<text x="164" y="70" text-anchor="middle" font-size="17" font-weight="800" fill="#16417C">√9=3</text>'),
      text: { ko:'나무(9)를 보고 땅속의 뿌리(3)를 찾기 — 기호 하나에 이야기가 숨어 있죠!',
              en:'See the tree (9), find its root (3) underground — a whole story hides inside one symbol!',
              zh:'看见树(9)，找出地下的根(3)——一个符号里藏着一个故事！' } },
  ]},

  /* ── M-45 · 접선을 향한 경주 ── */
  'M-45': { panels: [
    { art: svg(
        '<path d="M 20 116 Q 100 -30 180 116" fill="none" stroke="#16417C" stroke-width="3"/>'
        +'<circle cx="100" cy="43" r="4.5" fill="#D9534F"/>'
        +'<line x1="100" y1="43" x2="100" y2="20" stroke="#4a5468" stroke-width="2"/>'
        +'<polygon points="100,20 122,25 100,32" fill="#D9534F"/>'
        +stick(38,58,1.1,'#4a5468')),
      text: { ko:'가장 먼저 페르마가 곡선의 꼭대기와 바닥을 찾는 방법을 고안했어요 — 뉴턴보다 13년이나 앞서서요!',
              en:'Fermat was first to find the tops and bottoms of curves — a full 13 years before Newton!',
              zh:'费马最早想出找曲线顶点和谷底的方法——比牛顿早了整整13年！' } },
    { art: svg(
        '<path d="M 10 96 Q 40 84 70 96 T 130 96 T 190 96" fill="none" stroke="#16417C" stroke-width="3"/>'
        +'<path d="M 10 110 Q 40 98 70 110 T 130 110 T 190 110" fill="none" stroke="#7ea4d6" stroke-width="2.5"/>'
        +'<text x="100" y="52" text-anchor="middle" font-size="30" font-style="italic" font-weight="700" fill="#1A2233" font-family="Georgia,serif">ẋ</text>'
        +'<polygon points="168,90 184,96 168,102" fill="#16417C"/>'),
      text: { ko:'뉴턴은 "흐르는 양"의 순간 변화를 유율(fluxion)이라 부르고, 점을 찍은 ẋ로 적었어요.',
              en:'Newton called the instant change of a "flowing quantity" a fluxion, writing it with a dot: ẋ.',
              zh:'牛顿把"流动的量"的瞬时变化叫作流数，用带点的ẋ表示。' } },
    { art: svg(
        '<text x="100" y="86" text-anchor="middle" font-size="44" font-style="italic" font-weight="700" fill="#16417C" font-family="Georgia,serif">dy/dx</text>'
        +'<path d="M 30 108 Q 100 122 170 108" fill="none" stroke="#C9A063" stroke-width="2.5" stroke-dasharray="4 3"/>'),
      text: { ko:'라이프니츠는 dy/dx라는 기호를 만들었죠. 오늘 교과서에 있는 바로 그 기호예요!',
              en:'Leibniz invented the symbol dy/dx — the very notation in your textbook today!',
              zh:'莱布尼茨发明了dy/dx这个符号——正是今天课本里用的那个！' } },
    { art: svg(
        '<path d="M 20 120 Q 100 -20 180 120" fill="none" stroke="#16417C" stroke-width="3"/>'
        +'<circle cx="140" cy="66" r="4.5" fill="#D9534F"/>'
        +'<line x1="96" y1="110 " x2="184" y2="22" stroke="#D9534F" stroke-width="2.5"/>'
        +stick(38,52,1,'#4a5468')+stick(66,52,1,'#16417C')
        +'<path d="M 47 44 Q 52 40 57 44" fill="none" stroke="#2E9E6B" stroke-width="2.5" stroke-linecap="round"/>'),
      text: { ko:'두 사람은 서로 다투었지만 — 우리는 오늘 두 발명을 모두 물려받아 쓰고 있답니다!',
              en:'The two men quarrelled bitterly — yet today we happily use both of their inventions!',
              zh:'两人曾激烈争论——但今天我们把他们的发明都继承下来用了！' } },
  ]},

};
})();
