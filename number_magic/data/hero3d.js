/* 수학 이야기 3D 대표 그림(2026-09-26, 원장 "좀 실사 느낌이 되었으면 좋겠어 막대도 실제 막대처럼 정 안되면 3d로").
   그림은 scripts/build-hero3d.js 가 scripts/hero3d/scenes.js 로 구운 assets/hero3d/<유닛>.webp.
   여기 등록된 유닛만 앱 발견 단계·인쇄 수학 이야기 쪽에 싣는다. alt = 그림에 실제로 놓인 것(3개 언어).
   장면은 그 유닛 이야기(hook·history)나 개념 단계에 나오는 물건만 쓴다 — 새 이야기를 지어내지 않는다. */
window.NM_HERO3D = {
  'M-01': { alt:{ ko:'한지 위 붉은 산가지 셋(+)과 검은 산가지 둘(−)', en:'Three red counting rods (+) and two black rods (−) on paper', zh:'纸上三根红算筹(+)和两根黑算筹(−)' } },
  'M-82': { alt:{ ko:'눕힌 온도계와 그 아래 수직선 −5부터 +5까지, 붉은 액체가 +2까지', en:'A thermometer laid flat above a number line from −5 to +5, red liquid up to +2', zh:'平放的温度计和下面从−5到+5的数轴，红色液柱到+2' } },
  'M-02': { alt:{ ko:'+ 동전 다섯과 − 칩 셋, 짝지은 셋은 점선으로 묶임', en:'Five + coins and three − chips, three pairs circled', zh:'五枚+硬币和三枚−筹码，三对用虚线圈起' } },
  'M-03': { alt:{ ko:'산 모형과 굽은 오르막·곧은 내리막 길, 오르막 쪽 모래시계 셋과 내리막 쪽 하나', en:'A model mountain with a winding way up and a straight way down; three hourglasses on the way up, one on the way down', zh:'山模型，弯曲上坡与笔直下坡；上坡旁三个沙漏，下坡旁一个' } },
  'M-47': { alt:{ ko:'사탕 병에 붙은 가격표 a, 사탕 셋과 3 × a = 3a', en:'A candy jar with price tag a, three candies and 3 × a = 3a', zh:'糖果罐上的价签a，三颗糖和3 × a = 3a' } },
  'M-48': { alt:{ ko:'x 상자 셋(하나는 열려 4개)과 낱개 둘, 3x + 2 와 x = 4', en:'Three x boxes (one open with 4 cubes) and two single cubes, 3x + 2 and x = 4', zh:'三个x盒子(一个打开，里面4块)和两块单独的木块，3x + 2与x = 4' } },
  'M-04': { alt:{ ko:'바로 선 컵(+), 뒤집힌 컵(−), 다시 바로 선 컵(+) — × (−1) 할 때마다 뒤집힘', en:'Cup upright (+), flipped (−), upright again (+): each × (−1) flips it', zh:'正放的杯(+)、倒扣的杯(−)、再正放(+)——每乘一次(−1)翻转一次' } },
  'M-05': { alt:{ ko:'나무 패 (−2)⁴ = 16 과 −2⁴ = −16, 괄호 패만 붉은색', en:'Wooden tiles (−2)⁴ = 16 and −2⁴ = −16, the brackets in red', zh:'木牌(−2)⁴ = 16和−2⁴ = −16，括号牌为红色' } },
  'M-06': { alt:{ ko:'나무 패 −5 + 3 × (−4), 곱셈 위에 조약돌 1, 덧셈 위에 조약돌 2', en:'Wooden tiles −5 + 3 × (−4), pebble 1 above ×, pebble 2 above +', zh:'木牌−5 + 3 × (−4)，乘号上放石子1，加号上放石子2' } },
  'M-49': { alt:{ ko:'같은 상자 셋, 상자마다 x 막대 둘과 1 블록 다섯 — 3(2x + 5)', en:'Three identical boxes, each with two x bars and five unit blocks: 3(2x + 5)', zh:'三个相同的盒子，每个装两根x条和五个单位块——3(2x + 5)' } },
  'M-50': { alt:{ ko:'평형을 이룬 양팔저울: 왼쪽 x 상자와 추 셋, 오른쪽 추 아홉', en:'A balanced scale: an x box and three weights on the left, nine weights on the right', zh:'平衡的天平：左边x箱和三个砝码，右边九个砝码' } },
  'M-70': { alt:{ ko:'블록 기둥 x − 1, x, x + 1 — 가장 높은 기둥의 한 칸을 가장 낮은 기둥으로 옮기는 중', en:'Block towers x − 1, x, x + 1; one block moving from the tallest to the shortest', zh:'积木柱x − 1、x、x + 1——把最高柱的一块移到最矮柱上' } },
  'M-07': { alt:{ ko:'3/4 ÷ 2/5 에서 2/5 카드를 뒤집어 × 5/2', en:'3/4 ÷ 2/5, flipping the 2/5 card to × 5/2', zh:'3/4 ÷ 2/5，把2/5卡片翻过来变成× 5/2' } },
  'M-08': { alt:{ ko:'3/8 = 0.375 짧은 띠, 1/3 = 0.333… 두루마리에서 끝없이 풀리는 띠', en:'3/8 = 0.375 on a short strip; 1/3 = 0.333… unrolling from a spool', zh:'3/8 = 0.375短纸条；1/3 = 0.333…从纸卷上不断展开' } },
  'M-09': { alt:{ ko:'3이 끝없이 도는 종이 고리, 0.3̇ = 1/3', en:'A paper ring of repeating 3s, 0.3̇ = 1/3', zh:'写满循环3的纸环，0.3̇ = 1/3' } },
  'M-51': { alt:{ ko:'연필 1·2·3자루 옆에 동전 1·2·3개', en:'One, two, three pencils beside one, two, three coins', zh:'1、2、3支铅笔旁边分别放1、2、3枚硬币' } },
  'M-68': { alt:{ ko:'영화관 객석, 한 자리만 금빛으로 밝게', en:'Cinema seats with one seat lit in gold', zh:'电影院座位，只有一个座位亮成金色' } },
  'M-69': { alt:{ ko:'좌표판 위 곧은 철사(정비례)와 둘로 갈라진 구리 곡선(반비례)', en:'On a coordinate board: a straight wire (direct) and a two-part copper curve (inverse)', zh:'坐标板上笔直的铁丝(正比例)和分成两支的铜曲线(反比例)' } },
  'M-84': { alt:{ ko:'블록 기둥 2, 5, 7, 9, 12 — 가운데 7만 초록', en:'Block towers 2, 5, 7, 9, 12, only the middle 7 in green', zh:'积木柱2、5、7、9、12——只有中间的7是绿色' } },
  /* 중2 C32 (2026-09-26, 에이전트 작성 · 검수) */
  'M-10': { alt:{ ko:"나무 책상 위에 a가 새겨진 나무 블록이 3개와 4개 두 묶음으로 놓여 있고, 그 앞에 a³ 카드, × 블록, a⁴ 카드, = 블록, a⁷ 카드가 한 줄로 놓여 있습니다.", en:"On a wooden desk, wooden blocks marked a lie in two groups of 3 and 4. In front of them is a row: an a³ card, a × block, an a⁴ card, an = block and an a⁷ card.", zh:"木桌上，刻着a的木块分成3个和4个两组；前面一排依次是a³卡片、×木块、a⁴卡片、=木块和a⁷卡片。" } },
  'M-11': { alt:{ ko:"나무 책상 위에 3 블록, 윗면에 x²가 붙은 상자, × 블록, 4 블록, 윗면에 x³가 붙은 상자, = 블록, 12x⁵ 카드가 한 줄로 놓여 있습니다.", en:"On a wooden desk, a row: a 3 block, a box labeled x² on top, a × block, a 4 block, a box labeled x³ on top, an = block and a 12x⁵ card.", zh:"木桌上排成一排：3木块、顶面贴着x²的盒子、×木块、4木块、顶面贴着x³的盒子、=木块和12x⁵卡片。" } },
  'M-12': { alt:{ ko:"나무 책상 왼쪽에 빨간 사과 3개, 오른쪽에 노란 배 2개가 놓여 있고, 그 앞에 3x 카드, + 블록, 2y 카드가 놓여 있습니다.", en:"On a wooden desk, three red apples sit on the left and two yellow pears on the right, with a 3x card, a + block and a 2y card in front.", zh:"木桌左边放着3个红苹果，右边放着2个黄梨，前面是3x卡片、+木块和2y卡片。" } },
  'M-13': { alt:{ ko:"나무 책상 위에 3, (, 2x, +, 5, ) 블록과 = 블록, 6x + 15 카드가 한 줄로 놓여 있고, 3에서 2x와 5로 구리 철사 화살 두 개가 휘어 이어지며 3 위에 작은 황동 구슬이 있습니다.", en:"On a wooden desk, blocks 3, (, 2x, +, 5, ) and = sit in a row with a 6x + 15 card. Two curved copper-wire arrows run from 3 to 2x and from 3 to 5, and a small brass bead rests on the 3.", zh:"木桌上排着3、(、2x、+、5、)木块和=木块，以及6x + 15卡片；两根弯曲的铜丝箭头从3分别连到2x和5，3上面有一颗小铜珠。" } },
};
