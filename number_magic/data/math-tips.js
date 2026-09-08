/* ============================================================
   Numbers of Magic — 수학 팁(기억 고리) 데이터  ※ 생성 파일, 손으로 고치지 말 것
   만드는 법: node scripts/build-math-tips.js /tmp/md-tips-A.json /tmp/md-tips-B.json
   원장 2026-09-08: "중고등 수학 팁 — 잘 기억하고 이해할 수 있는 스킬이나 팁들",
   "이런 것들을 검색해서 제일 꿀팁을 넣어".

   학습지 회차 첫 장의 개념 패널(exam.js w2ConceptPanelHtml) 안, 개념 문장 아래에 붙는다.
   온라인 회차 탭도 같은 마크업이라 화면에도 같이 나온다. 팁이 없는 스레드는 조용히 생략.

   형식: NM_MATH_TIPS[스레드id] = { source, hook, why, mistake }  (뒤 셋은 {ko,en,zh})
     hook    — 기억 고리. 외워지는 한 줄.
     why     — 왜 그런지 한 문장. 규칙을 되풀이하지 않는다.
     mistake — 가장 흔한 실수 하나와 그걸 잡는 확인법.
     source  — 'owner' 원장이 직접 준 문장 · 'known' 실제로 쓰이는 암기법 · 'own' 자체 작성
   평문만(LaTeX 금지 — 개념 패널은 esc() 로 그대로 찍는다).
   ============================================================ */
(function(){
'use strict';
window.NM_MATH_TIPS = window.NM_MATH_TIPS || {};
const T = window.NM_MATH_TIPS;

T["DV8"] = { source:"owner",
  hook:{ ko:"제곱수만 약수가 홀수 개! 소수의 제곱은 딱 3개.",
         en:"Only perfect squares have an odd number of divisors — a prime squared has exactly 3.",
         zh:"只有平方数的约数是奇数个——质数的平方恰好3个。" },
  why:{ ko:"약수는 a×b 짝으로 세는데, 제곱수는 √n×√n 한 짝이 같은 수라 하나로만 세어져요.",
         en:"Divisors come in pairs a×b; for a square the pair √n×√n is one number, so it counts once.",
         zh:"约数按a×b成对出现，平方数里√n×√n这一对是同一个数，只算一次。" },
  mistake:{ ko:"36의 약수를 짝으로 세다 6을 두 번 세지 않기 — 답은 9개.",
         en:"Counting 6 twice in the pairs of 36 — the answer is 9, not 10.",
         zh:"数36的约数时把6算两次——答案是9个，不是10个。" } };

T["MD1"] = { source:"known",
  hook:{ ko:"절댓값은 부호만 떼면 끝 — 원점까지 거리거든요",
         en:"Finding absolute value? Just drop the sign — it's the distance from zero",
         zh:"求绝对值就是去掉符号——因为它是到原点的距离" },
  why:{ ko:"거리는 항상 0 이상이라, 부호를 없앤 숫자가 곧 원점까지 거리가 되기 때문이에요",
         en:"Distance is never negative, so stripping the sign leaves exactly the distance from zero",
         zh:"距离永远不会是负数，去掉符号后的数字正好就是到原点的距离" },
  mistake:{ ko:"-5>-2로 착각 주의 — 수직선에서 더 오른쪽인 -2가 더 커요",
         en:"Don't think -5 > -2 just because 5>2 — -2 sits further right, so it's bigger",
         zh:"别以为-5>-2(因为5>2)——数轴上更靠右的-2才更大" } };

T["MD10"] = { source:"known",
  hook:{ ko:"밑이 같아야만 지수를 더해요 — 2³×3²은 6⁵가 아니에요!",
         en:"Exponents only add when the base is the same — 2³×3² is NOT 6⁵!",
         zh:"底数相同才能加指数——2³×3²可不是6⁵!" },
  why:{ ko:"지수법칙은 같은 수를 반복해서 곱한 걸 정리한 것이라 밑이 다르면 규칙이 깨지기 때문이에요",
         en:"The law just counts repeats of the same base, so a different base breaks it",
         zh:"指数律只是在数同一底数乘了几次,底数不同规则就不成立" },
  mistake:{ ko:"밑이 다른데도 지수를 더하거나 곱하는 실수 — 먼저 밑이 같은지 확인하세요",
         en:"Don't add or multiply exponents when the bases differ — check the base first",
         zh:"底数不同时别把指数相加或相乘——先看底数是否一样" } };

T["MD11"] = { source:"known",
  hook:{ ko:"단항식 나눗셈은 분수로 바꿔 약분하듯 풀면 실수가 줄어요",
         en:"Turn monomial division into a fraction and cancel — like reducing a fraction",
         zh:"单项式除法写成分数来约分,更不容易出错" },
  why:{ ko:"분수 꼴로 쓰면 계수는 계수끼리, 문자는 문자끼리 약분이 눈에 보이기 때문이에요",
         en:"Writing it as a fraction shows coefficients and letters cancel separately",
         zh:"写成分数形式能清楚看到系数和字母分别怎么约分" },
  mistake:{ ko:"계수만 나누고 문자엔 지수법칙 잊는 실수 — 문자도 꼭 계산해요",
         en:"Don't just divide coefficients and forget the letters — apply the exponent law too",
         zh:"别只除了系数就完事——字母部分也要用指数律相减" } };

T["MD12"] = { source:"known",
  hook:{ ko:"동류항은 문자'와' 차수가 똑같아야 짝이에요 — x²과 x는 남남",
         en:"Like terms need the SAME letter AND same exponent — x² and x are strangers",
         zh:"同类项要字母和次数都一样——x²和x是陌生人" },
  why:{ ko:"차수가 다르면 나타내는 양의 종류 자체가 달라서 더하거나 뺄 수 없기 때문이에요",
         en:"Different exponents represent different kinds of quantities, so they can't combine",
         zh:"次数不同代表的量本质不同,没法合并" },
  mistake:{ ko:"x²+x를 3x³처럼 합치는 실수 — 차수가 다르면 절대 못 더해요",
         en:"Don't combine x²+x into something like 3x³ — different exponents never merge",
         zh:"别把x²+x合并成3x³之类——次数不同绝对不能合并" } };

T["MD13"] = { source:"known",
  hook:{ ko:"괄호 안 항마다 화살표를 그어 빠짐없이 곱했는지 확인해요",
         en:"Draw an arrow from the outside term to every term inside, so none gets skipped",
         zh:"从外面的单项式向括号内每一项画箭头,确保一个都没漏乘" },
  why:{ ko:"분배법칙은 곱하는 수를 괄호 안 항 전부에 똑같이 곱하라는 규칙이기 때문이에요",
         en:"The distributive law multiplies the outside factor into every single term inside",
         zh:"分配律要求外面的因子和括号里每一项都相乘" },
  mistake:{ ko:"삼항식을 전개할 때 마지막 항 곱하는 걸 깜빡하는 실수 흔해요",
         en:"When expanding a trinomial, don't forget to multiply the very last term too",
         zh:"展开三项式时,别忘了把最后一项也乘上" } };

T["MD14"] = { source:"known",
  hook:{ ko:"등식은 저울이에요 — 한쪽에 한 건 반대쪽에도 똑같이 해야 해요",
         en:"An equation is a balance scale — whatever you do to one side, do to the other",
         zh:"等式就像天平——对一边做的事,另一边也要做" },
  why:{ ko:"양변에 같은 걸 더하거나 나누면 두 변의 차이(=0)가 그대로 유지되기 때문이에요",
         en:"Adding or dividing both sides by the same thing keeps their difference at zero",
         zh:"两边同时加或除以同一个数,差值仍然是0" },
  mistake:{ ko:"-x=5에서 부호만 떼고 x=5로 쓰는 실수 — 양변을 -1로 나눠야 해요",
         en:"For -x=5, don't just drop the sign to get x=5 — divide both sides by -1",
         zh:"-x=5时别直接去掉负号写成x=5——要两边都除以-1" } };

T["MD15"] = { source:"own",
  hook:{ ko:"근호(√)는 늘 0 이상만 내보내는 일방통행 문이에요",
         en:"The √ sign is a one-way door — only non-negative numbers walk out",
         zh:"根号√是单行道大门——出来的永远是非负数" },
  why:{ ko:"제곱은 음수를 넣어도 결과가 양수가 되어, √로 되돌려도 원래 부호를 알 수 없기 때문이에요",
         en:"Squaring always turns negatives positive, so √ can't recover the original sign",
         zh:"平方会把负数变正,所以用√还原时也没法知道原来的符号" },
  mistake:{ ko:"√((-3)²)을 -3으로 잘못 계산 — 답은 항상 3(절댓값)이에요",
         en:"Don't compute √((-3)²) as -3 — it's always 3, the absolute value",
         zh:"别把√((-3)²)算成-3——答案永远是3,也就是绝对值" } };

T["MD16"] = { source:"known",
  hook:{ ko:"지수를 2로 나눠요 — 몫은 밖으로, 나머지는 안에 (2⁵→2²√2)",
         en:"Divide the exponent by 2 — quotient steps outside, remainder stays inside (2⁵→2²√2)",
         zh:"指数除以2:商出来,余数留在根号里(2⁵→2²√2)" },
  why:{ ko:"같은 인수가 두 개씩 짝지어질 때마다 그 인수가 통째로 근호를 빠져나가기 때문이에요",
         en:"Every pair of the same prime factor is a complete square that leaves the root",
         zh:"每两个相同的质因数凑成一对,就能整对跳出根号" },
  mistake:{ ko:"소인수분해 없이 눈대중으로 정리하다 인수를 놓치는 실수 조심하세요",
         en:"Don't eyeball it without prime factoring first — it's easy to miss a hidden pair",
         zh:"别不做质因数分解就凭感觉化简——容易漏掉藏着的一对" } };

T["MD17"] = { source:"known",
  hook:{ ko:"곱셈·나눗셈만 안이 합쳐져요 — 덧셈은 √2+√3=√5 절대 아니에요!",
         en:"Only multiplication/division merge inside the root — addition never does: √2+√3≠√5",
         zh:"只有乘除能把根号内合并——加法绝不是√2+√3=√5!" },
  why:{ ko:"√a×√b=√(ab)는 곱셈의 성질이라 덧셈에는 적용되지 않기 때문이에요",
         en:"√a×√b=√(ab) is a multiplication property; it simply doesn't hold for addition",
         zh:"√a×√b=√(ab)是乘法的性质,加法并不适用" },
  mistake:{ ko:"곱셈 규칙을 덧셈에도 써서 √2+√3을 √5로 잘못 계산하는 실수 흔해요",
         en:"Don't apply the multiply rule to addition — √2+√3 is not √5",
         zh:"别把乘法规则用到加法上——√2+√3不等于√5" } };

T["MD18"] = { source:"known",
  hook:{ ko:"분모의 근호를 쫓아내는 열쇠는 '자기 자신' 곱하기예요 (√a×√a=a)",
         en:"The key to evicting a root from the denominator is multiplying by itself (√a×√a=a)",
         zh:"赶走分母里的根号,诀窍是乘以它自己(√a×√a=a)" },
  why:{ ko:"분자·분모에 같은 수를 곱하는 건 1을 곱하는 것과 같아 값이 안 변하기 때문이에요",
         en:"Multiplying top and bottom by the same thing is really multiplying by 1",
         zh:"分子分母同乘一个数,其实是乘以1,数值不会变" },
  mistake:{ ko:"분모에만 √를 곱하고 분자엔 안 곱해 값 자체를 바꾸는 실수 주의",
         en:"Don't multiply only the denominator by √a — the numerator needs it too",
         zh:"别只在分母乘√a却漏了分子——那样数值就变了" } };

T["MD19"] = { source:"own",
  hook:{ ko:"전개는 앞·밖·안·뒤 순서로: 넉 줄로 쪼개 곱해보세요",
         en:"Expand in four steps — First, Outer, Inner, Last — then combine the middle two",
         zh:"展开按'先外内后'四步来,把式子拆成四项相乘" },
  why:{ ko:"분배법칙을 두 번 쓰면 항이 네 개 나오고 가운데 두 개가 동류항이라 합쳐지기 때문이에요",
         en:"Distributing twice creates four terms, and the middle two are like terms that merge",
         zh:"分配律用两次会产生四项,中间两项刚好是同类项可以合并" },
  mistake:{ ko:"(x+a)²을 x²+a²으로 줄이는 실수 — 가운데 2ax를 빼먹으면 안 돼요",
         en:"Don't shrink (x+a)² to x²+a² — you're dropping the middle term 2ax",
         zh:"别把(x+a)²简化成x²+a²——中间的2ax不能丢" } };

T["MD2"] = { source:"own",
  hook:{ ko:"뺄셈은 수직선에서 방향을 180도 돌리는 것뿐이에요",
         en:"Subtracting is just spinning around 180° on the number line",
         zh:"减法就是在数轴上转身180度" },
  why:{ ko:"빼는 수의 부호를 바꾸면 반대 방향으로 가는 것과 똑같아지기 때문이에요",
         en:"Flipping the sign of the number you subtract sends you the opposite way",
         zh:"把要减的数变号,就等于朝相反方向走" },
  mistake:{ ko:"-(-3)을 -3으로 잘못 계산 주의 — 마이너스 두 개는 +3으로 돌아가요",
         en:"Don't simplify -(-3) to -3 — two minus signs flip you back to +3",
         zh:"别把-(-3)算成-3——两个负号会翻回+3" } };

T["MD20"] = { source:"known",
  hook:{ ko:"곱이 양수면 부호 둘 다 b와 같게, 음수면 큰 쪽이 b 부호를 가져가요",
         en:"If the product is positive, both signs match b; if negative, the bigger number takes b's sign",
         zh:"积为正,两数符号都跟b一样;积为负,绝对值大的那个跟b同号" },
  why:{ ko:"곱의 부호와 합의 부호를 함께 보면 각 수의 부호 조합이 하나로 좁혀지기 때문이에요",
         en:"Checking both the product's and sum's sign narrows the combination to one option",
         zh:"同时看积和和的符号,就能把符号组合锁定到唯一一种" },
  mistake:{ ko:"c만 보고 급히 짝을 골라 합이 b와 안 맞는데도 쓰는 실수 조심하세요",
         en:"Don't pick a factor pair from c alone without checking the sum equals b",
         zh:"别只看c就选数对,一定要验证两数之和真的等于b" } };

T["MD21"] = { source:"known",
  hook:{ ko:"빠진 차수는 0으로 채워야 조립제법이 안 어긋나요 (x³+1→1,0,0,1)",
         en:"Fill missing degrees with 0 or synthetic division shifts out of place (x³+1→1,0,0,1)",
         zh:"缺项要补0,不然综合除法的位置会错(x³+1→1,0,0,1)" },
  why:{ ko:"조립제법은 계수를 자리 순서대로 쓰는 방법이라 중간 항이 없으면 자리가 비기 때문이에요",
         en:"Synthetic division lines up coefficients by position, so a missing term leaves an empty slot",
         zh:"综合除法是按位置排列系数的,缺了一项那个位置就会空出来" },
  mistake:{ ko:"x²항이 없다고 계수 칸을 건너뛰는 실수 — 반드시 0을 적으세요",
         en:"Don't skip the slot when a term (like x²) is missing — write a 0 to hold its place",
         zh:"别因为没有x²项就跳过那一格——一定要写0占位" } };

T["MD22"] = { source:"known",
  hook:{ ko:"1-3-3-1은 파스칼 삼각형 4번째 줄 — 계수를 따로 안 외워도 돼요",
         en:"1-3-3-1 is row four of Pascal's Triangle — no need to memorize it separately",
         zh:"1-3-3-1就是帕斯卡三角形第4行——不用单独硬背" },
  why:{ ko:"(x+a)³=(x+a)²(x+a)로 전개하면 이항계수 1,3,3,1이 자연스레 나오기 때문이에요",
         en:"Expanding (x+a)³ as (x+a)²(x+a) naturally produces those coefficients 1,3,3,1",
         zh:"把(x+a)³展开成(x+a)²(x+a),自然就会出现1,3,3,1这组系数" },
  mistake:{ ko:"(x-a)³ 전개 시 부호를 전부 +로 쓰는 실수 — +,-,+,-로 번갈아야 해요",
         en:"For (x-a)³, don't forget the signs alternate +,-,+,- — not all plus",
         zh:"展开(x-a)³时别忘了符号要+,-,+,-交替,不是全部正号" } };

T["MD23"] = { source:"known",
  hook:{ ko:"계수 비교가 헷갈리면 x에 0, 1, -1을 대입해 검산해보세요",
         en:"If comparing coefficients feels shaky, plug in x=0, 1, -1 to double-check",
         zh:"比较系数没把握时,直接代入x=0、1、-1来验算" },
  why:{ ko:"항등식은 모든 x에서 성립하니 아무 숫자를 넣어도 등식이 맞아야 하기 때문이에요",
         en:"An identity holds for every x, so it stays true for any number you substitute",
         zh:"恒等式对所有x都成立,所以随便代哪个数,等式都该成立" },
  mistake:{ ko:"항등식 아닌 방정식에도 계수비교법을 쓰는 실수 — 먼저 '모든 x'인지 확인하세요",
         en:"Don't compare coefficients on an equation that isn't an identity — check it holds for ALL x",
         zh:"别把系数比较法用在不是恒等式的普通方程上——先确认是否对所有x都成立" } };

T["MD24"] = { source:"known",
  hook:{ ko:"(x+3)으로 나눌 땐 a=3이 아니라 a=-3을 대입해요",
         en:"Dividing by (x+3) means plugging in a=-3, not 3",
         zh:"除以(x+3)时要代入a=-3,不是3" },
  why:{ ko:"나눗셈식을 0으로 만드는 x값이 a라서, x+3=0이면 a=-3이어야 하기 때문이에요",
         en:"The theorem uses the root of the divisor, and x+3=0 means x=-3",
         zh:"定理用的是除式的根,而x+3=0时x=-3" },
  mistake:{ ko:"(x+3)을 보고 무조건 a=3을 대입하는 실수 아주 흔해요 — 부호를 꼭 확인하세요",
         en:"Don't automatically plug in a=3 just because you see (x+3) — check the sign",
         zh:"看到(x+3)别不假思索代入a=3——一定要先确认符号" } };

T["MD25"] = { source:"own",
  hook:{ ko:"부호는 '같-반-플': 첫 부호 같게, 가운데 반대로, 마지막은 항상 +",
         en:"Signs go 'Same-Opposite-Always+': first matches, middle flips, last is always plus",
         zh:"符号口诀'同-反-恒正':首符号相同,中间相反,末项恒为正" },
  why:{ ko:"x³±a³=(x±a)(x²∓ax+a²)에서 부호가 정확히 이 순서로 배열되기 때문이에요",
         en:"That's exactly how x³±a³=(x±a)(x²∓ax+a²) lines up its signs",
         zh:"x³±a³=(x±a)(x²∓ax+a²)的符号正是这样排列的" },
  mistake:{ ko:"가운데 항 부호를 원래 식과 똑같이 쓰는 실수 흔해요 — 가운데는 반대예요",
         en:"Don't copy the original sign onto the middle term — it always flips",
         zh:"别把中间项的符号写得跟原式一样——中间项符号一定要反过来" } };

T["MD26"] = { source:"own",
  hook:{ ko:"판별식은 포물선이 x축을 몇 번 스치는지 알려주는 정찰병이에요",
         en:"The discriminant scouts ahead: how many times the parabola touches the x-axis",
         zh:"判别式是侦察兵,提前告诉你抛物线碰x轴几次" },
  why:{ ko:"D>0은 두 번 교차, D=0은 한 번 접함, D<0은 안 만나는 그래프와 정확히 대응해요",
         en:"D>0 crosses twice, D=0 just grazes once, D<0 never touches — matching the graph",
         zh:"D>0对应交两次,D=0对应刚好碰一次,D<0则完全不相交,与图像完全对应" },
  mistake:{ ko:"D=0을 '근이 없다'로 착각 주의 — D=0은 중근(근 1개, 겹침)이에요",
         en:"Don't read D=0 as 'no roots' — it means one repeated (double) root",
         zh:"别把D=0理解成'无解'——它表示有一个重根,不是没有根" } };

T["MD27"] = { source:"known",
  hook:{ ko:"α²+β²=(α+β)²-2αβ — 합·곱만 알면 뭐든 만들 수 있어요",
         en:"α²+β² = (α+β)² − 2αβ — once you know the sum and product, you can build almost anything",
         zh:"α²+β²=(α+β)²-2αβ——知道和与积,几乎什么都能算出来" },
  why:{ ko:"(α+β)²을 전개하면 α²+2αβ+β²가 되므로 2αβ를 빼면 α²+β²만 남기 때문이에요",
         en:"Expanding (α+β)² gives α²+2αβ+β², so subtracting 2αβ leaves exactly α²+β²",
         zh:"展开(α+β)²得到α²+2αβ+β²,减去2αβ正好剩下α²+β²" },
  mistake:{ ko:"α²+β²을 (α+β)²으로 착각하는 실수 — 2αβ를 반드시 빼야 해요",
         en:"Don't mistake α²+β² for (α+β)² itself — you must subtract 2αβ",
         zh:"别把α²+β²误当成(α+β)²——一定要减去2αβ" } };

T["MD28"] = { source:"known",
  hook:{ ko:"근의 공식 속 b²-4ac는 이미 배운 판별식 D예요 — 새로 외울 게 아니에요",
         en:"b²-4ac inside the formula is just the discriminant D you already know",
         zh:"求根公式里的b²-4ac其实就是你已经学过的判别式D,不用额外背" },
  why:{ ko:"근의 공식은 D의 값을 그대로 근호 안에 써서 근을 구하는 식이기 때문이에요",
         en:"The quadratic formula simply reuses that D value inside the square root",
         zh:"求根公式其实就是把判别式D的值直接放进根号里来求根" },
  mistake:{ ko:"분모 2a를 근호 앞부분에만 적용하는 실수 — 2a는 -b까지 전체를 나눠요",
         en:"Don't divide only the √ part by 2a — 2a divides the whole numerator, including -b",
         zh:"别只把根号部分除以2a——2a要除整个分子,包括-b" } };

T["MD29"] = { source:"known",
  hook:{ ko:"웃는 얼굴(∪) 그래프: 축 아래(<0)는 두 근 사이, 위(>0)는 두 근 바깥",
         en:"Smile-shaped graph (∪): below the axis (<0) is between the roots, above (>0) is outside",
         zh:"开口向上的笑脸图:x轴下方(<0)在两根之间,上方(>0)在两根之外" },
  why:{ ko:"이차식 계수가 양수면 그래프가 두 근 사이에서만 x축 아래로 내려가기 때문이에요",
         en:"With a positive leading coefficient, the curve dips below the axis only between its roots",
         zh:"当二次项系数为正时,图像只有在两根之间才会落到x轴下方" },
  mistake:{ ko:"부등호가 >로 바뀌어도 '두 근 사이'로 쓰는 실수 — 이땐 두 근 바깥이에요",
         en:"Don't keep 'between the roots' when the inequality flips to >0 — it becomes outside",
         zh:"不等号变成>时别还写'两根之间'——这时答案是两根之外" } };

T["MD3"] = { source:"known",
  hook:{ ko:"-3/4 = 3/-4 예요, 부호는 어디 있든 하나만 쥐면 돼요",
         en:"-3/4 = 3/-4 — the minus sign can sit anywhere, it's still one sign",
         zh:"-3/4 = 3/-4——负号放哪儿都一样,只算一次" },
  why:{ ko:"분수의 부호는 분자든 분모든 전체에 곱해진 것과 같은 값이기 때문이에요",
         en:"A sign on the numerator or denominator multiplies the whole fraction the same way",
         zh:"分子或分母上的负号,效果都是乘以整个分数" },
  mistake:{ ko:"통분할 때 분모만 곱하고 분자엔 안 곱하는 실수 조심하세요",
         en:"When finding a common denominator, don't forget to multiply the numerator too",
         zh:"通分时别只乘分母,分子也要跟着乘" } };

T["MD30"] = { source:"known",
  hook:{ ko:"행렬곱은 순서가 생명이에요 — AB와 BA는 보통 답이 달라요",
         en:"Order matters in matrix multiplication — AB and BA usually differ",
         zh:"矩阵乘法顺序很关键——AB和BA通常结果不同" },
  why:{ ko:"행렬곱은 앞 행렬의 행과 뒤 행렬의 열을 짝짓는 방식이라 순서가 바뀌면 다른 조합이 되기 때문이에요",
         en:"Matrix multiplication pairs rows of the first with columns of the second, so order changes the pairing",
         zh:"矩阵乘法是把前一个矩阵的行和后一个矩阵的列配对相乘,交换顺序配对对象就变了" },
  mistake:{ ko:"숫자처럼 AB=BA라고 생각하는 실수 조심 — 행렬은 순서를 바꾸면 안 돼요",
         en:"Don't assume AB=BA like with regular numbers — matrices generally don't commute",
         zh:"别以为像数字一样AB=BA——矩阵乘法一般不满足交换律" } };

T["MD31"] = { source:"known",
  hook:{ ko:"어느 점을 먼저 빼도 상관없어요 — 제곱하면 부호는 사라져요",
         en:"It doesn't matter which point you subtract first — squaring erases the sign",
         zh:"先减哪个点都无所谓——平方后符号反正会消失" },
  why:{ ko:"(a-b)²과 (b-a)²은 부호만 반대인 수를 제곱한 것이라 항상 같은 값이 나오기 때문이에요",
         en:"(a-b)² and (b-a)² only differ by sign before squaring, so squaring makes them equal",
         zh:"(a-b)²和(b-a)²平方前只差一个符号,平方后就相等了" },
  mistake:{ ko:"음수 좌표를 뺄 때 부호를 잘못 처리해 차를 반대로 계산하는 실수 흔해요",
         en:"With negative coordinates, watch the subtraction sign — it's easy to flip the difference",
         zh:"遇到负数坐标时小心减法符号——很容易把差值算反" } };

T["MD32"] = { source:"known",
  hook:{ ko:"외분점 공식은 내분점에서 부호 하나만 바꾼 쌍둥이예요",
         en:"The external-division formula is the internal one with one sign flipped.",
         zh:"外分点公式就是内分点公式,只把一个符号变了。" },
  why:{ ko:"외분은 선분 밖에서 반대 방향으로 나누는 거라 분모의 뺄셈이 그 방향을 나타내요",
         en:"External division goes outside the segment the opposite way, so the minus in the denominator marks that direction.",
         zh:"外分是在线段外朝相反方向分割,分母的减号就表示这个方向。" },
  mistake:{ ko:"m=n이면 외분점이 없어요(분모가 0) — 계산 전에 먼저 확인해요",
         en:"If m=n, there's no external point (denominator is 0) — check first.",
         zh:"如果m=n,外分点不存在(分母为0)——计算前先检查。" } };

T["MD33"] = { source:"own",
  hook:{ ko:"일반형 Ax+By=C는 기울기 -A/B, y절편 C/B로 바로 읽어요",
         en:"In Ax+By=C, read the slope as -A/B and the y-intercept as C/B directly.",
         zh:"一般式Ax+By=C中,斜率直接读作-A/B,y截距读作C/B。" },
  why:{ ko:"이미 이항된 계수라 부호만 뒤집으면 기울기고, 상수를 B로 나누면 절편이에요",
         en:"Those coefficients are already rearranged, so flipping the sign gives slope and dividing by B gives the intercept.",
         zh:"这些系数已是移项结果,符号取反就是斜率,常数除以B就是截距。" },
  mistake:{ ko:"B로 나눌 때 부호를 안 바꾸면 기울기가 반대로 나와요",
         en:"Forget to flip the sign when dividing by B and the slope comes out backwards.",
         zh:"除以B时忘记变号,算出的斜率就会正负颠倒。" } };

T["MD34"] = { source:"known",
  hook:{ ko:"수직인 직선은 x,y 계수를 서로 바꾸고 부호 하나만 반대로 해요",
         en:"For a perpendicular line, swap the x and y coefficients and flip one sign.",
         zh:"垂直直线只需交换x、y的系数,再把一个符号变号。" },
  why:{ ko:"Ax+By+C=0의 법선은 (A,B)라서 (B,-A)로 바꾸면 내적이 0이 돼 직각이 돼요",
         en:"The line's normal is (A,B); swapping to (B,-A) makes the dot product zero — a right angle.",
         zh:"直线Ax+By+C=0的法向量是(A,B),换成(B,-A)后内积为0,正好垂直。" },
  mistake:{ ko:"부호를 안 바꾸고 계수만 바꾸면 평행선이 나와요 — 반드시 하나는 반대로",
         en:"Swap the coefficients without flipping a sign and you get a parallel line instead.",
         zh:"只交换系数不变号,得到的会是平行线而不是垂直线。" } };

T["MD35"] = { source:"known",
  hook:{ ko:"가운데항 계수를 반으로 나눠 부호를 바꾸면 중심 좌표가 바로 나와요",
         en:"Halve the middle-term coefficient and flip its sign — that's the center coordinate.",
         zh:"把一次项系数减半再变号,就是圆心坐标。" },
  why:{ ko:"(x-a)²를 전개하면 -2a가 x항 계수가 되니, 거꾸로 반으로 나누고 부호를 바꾸면 a예요",
         en:"Expanding (x-a)² gives -2a as the x-term coefficient, so working backward recovers a.",
         zh:"展开(x-a)²,一次项系数是-2a,反过来减半、变号就能得到a。" },
  mistake:{ ko:"반지름 제곱이 0 이하로 나오면 원이 아니에요 — 계산 후 꼭 부호를 확인해요",
         en:"If r-squared is zero or negative, it isn't a circle — always check that sign.",
         zh:"如果算出的r²小于等于0,这就不是圆——算完一定要检查符号。" } };

T["MD36"] = { source:"own",
  hook:{ ko:"분수지수도 지수법칙 그대로예요 — 곱셈은 분수끼리 더하면 끝이에요",
         en:"Fractional exponents still follow the exponent laws — for multiplication, just add the fractions.",
         zh:"分数指数照样遵守指数法则——相乘时把分数指数相加就行。" },
  why:{ ko:"유리수 지수를 만든 이유가 지수법칙을 분수까지 넓혀 그대로 쓰기 위해서예요",
         en:"Rational exponents exist so the same exponent laws keep working, extended to fractions.",
         zh:"引入有理数指数,就是为了让指数法则同样适用于分数。" },
  mistake:{ ko:"밑이 음수인데 분모가 짝수면 실수 범위에서 정의가 안 돼요 — 밑 부호부터 확인",
         en:"If the base is negative and the denominator is even, it's undefined for real numbers — check the base's sign first.",
         zh:"如果底数为负且分母是偶数,这在实数范围内没有意义——先检查底数的符号。" } };

T["MD37"] = { source:"own",
  hook:{ ko:"밑은 사다리 기둥이라 0보다 크고 1이 아니어야, 진수는 칸이라 항상 양수예요",
         en:"The base is the ladder's post — it must be positive and not 1; the true number is a rung, always positive.",
         zh:"底数是梯子的支柱,必须大于0且不等于1;真数是梯级,必须永远为正。" },
  why:{ ko:"밑이 1이면 아무리 곱해도 그대로라 몇 번째 칸인지 알 수 없기 때문이에요",
         en:"If the base were 1, multiplying it never changes anything, so no rung could ever be identified.",
         zh:"如果底数是1,不管乘多少次结果都一样,根本分不清是第几级。" },
  mistake:{ ko:"log_a N에서 a≤0, a=1, N≤0 중 하나라도 걸리면 애초에 정의되지 않아요",
         en:"If a≤0, a=1, or N≤0, log_a N simply isn't defined at all.",
         zh:"只要a≤0、a=1或N≤0中有一个成立,log_a N就没有定义。" } };

T["MD38"] = { source:"own",
  hook:{ ko:"진수의 지수는 앞으로 뛰어내려요 — log_a Xⁿ = n log_a X",
         en:"An exponent inside the log jumps out front: log_a Xⁿ = n log_a X.",
         zh:"真数里的指数会跳到前面:log_a Xⁿ = n log_a X。" },
  why:{ ko:"로그는 거듭제곱을 곱셈으로 바꿔주는 도구라서 지수가 곱셈으로 앞에 붙어요",
         en:"A log turns repeated multiplication into addition, so the exponent becomes a multiplier out front.",
         zh:"对数把乘方变成乘法,所以指数就变成前面的乘数。" },
  mistake:{ ko:"n이 짝수면 X가 음수여도 성립할 수 있어요 — 이땐 지수를 함부로 빼면 안 돼요",
         en:"If n is even, X could be negative — don't pull the exponent out blindly then.",
         zh:"如果n是偶数,X可能为负,这时不能随便把指数提到前面。" } };

T["MD39"] = { source:"known",
  hook:{ ko:"sin은 √(0/4)에서 √(4/4)까지, cos는 그 순서를 거꾸로 읽어요",
         en:"Sine runs √(0/4) up to √(4/4); cosine is the same list read backward.",
         zh:"sin从√(0/4)一直到√(4/4),cos就是把这串顺序倒过来读。" },
  why:{ ko:"각이 커질수록 sin값도 커지는 방향과 분자가 0에서 4로 늘어나는 방향이 같아요",
         en:"As the angle grows, sine grows too — matching the numerator climbing from 0 up to 4.",
         zh:"角度越大sin值越大,正好对应分子从0增大到4的方向。" },
  mistake:{ ko:"tan90°는 정의되지 않아요(분모 cos가 0) — 표에서 빈칸으로 남겨요",
         en:"tan90° is undefined (cosine in the denominator is 0) — leave that cell blank.",
         zh:"tan90°没有定义(分母cos为0)——表格里这一格要留空。" } };

T["MD4"] = { source:"known",
  hook:{ ko:"음수를 두 개씩 묶어 지워보세요 — 남으면 그게 부호예요",
         en:"Cross out negatives two at a time — whatever's left over decides the sign",
         zh:"把负号两两配对划掉——剩下的那个就是最终符号" },
  why:{ ko:"음수 두 개를 곱하면 방향이 두 번 바뀌어 다시 +로 돌아오기 때문이에요",
         en:"Multiplying by a negative flips direction once, so two flips return to positive",
         zh:"乘一个负数就翻转一次方向,翻两次又变回正的" },
  mistake:{ ko:"음수 3개(홀수)면 결과가 음수인데 짝수로 착각해 +로 쓰는 실수 흔해요",
         en:"With 3 negatives (odd), the answer is negative — don't mistake it for even",
         zh:"3个负数是奇数,结果应为负——别误当成偶数变正" } };

T["MD40"] = { source:"known",
  hook:{ ko:"등차수열 합은 사실 (첫째항+끝항)×항수÷2, 사다리꼴 넓이 공식과 같아요",
         en:"The sum is really (first+last term)×count÷2 — the same as a trapezoid's area formula.",
         zh:"等差数列的和其实是(首项+末项)×项数÷2,和梯形面积公式一样。" },
  why:{ ko:"일정하게 늘거나 줄어드는 항들을 나열하면 사다리꼴 모양이 되기 때문이에요",
         en:"Terms rising or falling by a steady amount, laid out in order, literally form a trapezoid shape.",
         zh:"等差递增或递减的项排列起来,形状正好是一个梯形。" },
  mistake:{ ko:"항수 n이 몇 번째 항까지인지 헷갈리면 통째로 틀려요 — 끝항 번호부터 확인",
         en:"Miscounting how many terms n covers throws off the whole sum — confirm the last term's index first.",
         zh:"数错项数n会导致整个结果出错——先确认末项是第几项。" } };

T["MD41"] = { source:"known",
  hook:{ ko:"Sn에서 rSn을 빼면 가운데 항들이 줄줄이 사라지고 양 끝만 남아요",
         en:"Subtract rSn from Sn and the middle terms cancel in a chain, leaving only the two ends.",
         zh:"用Sn减去rSn,中间的项会一个个抵消,只剩下两端。" },
  why:{ ko:"각 항에 공비를 곱해 한 칸 밀어서 빼면 겹치는 항끼리 상쇄되기 때문이에요",
         en:"Multiplying by r shifts every term over one slot, so subtracting cancels the overlaps.",
         zh:"乘以公比后每一项都错位一格,相减时重叠的项正好抵消。" },
  mistake:{ ko:"r=1이면 분모가 0이 되어 공식을 못 써요 — 이땐 그냥 Sn=n×a1이에요",
         en:"If r=1 the denominator becomes 0 and the formula breaks — then it's simply Sn=n×a1.",
         zh:"如果r=1,分母会变成0,公式失效——这时直接用Sn=n×a1。" } };

T["MD42"] = { source:"owner",
  hook:{ ko:"Σ는 \"여기서부터 저기까지 더해라\"예요 — 그냥 가우스 덧셈!",
         en:"Σ just says \"add from here to there\" — it is Gauss addition in a coat.",
         zh:"Σ就是\"从这里加到那里\"——不过是高斯求和换了件衣服。" },
  why:{ ko:"아래 k=1은 시작, 위 n은 끝. 항을 하나씩 늘어놓으면 늘 하던 덧셈이에요.",
         en:"k=1 below is the start, n on top is the end; write the terms out and it is ordinary addition.",
         zh:"下面的k=1是起点，上面的n是终点；把各项写出来，就是普通的加法。" },
  mistake:{ ko:"상수를 Σ 안에 두면 개수만큼 더해요 — Σ(k=1~n) 3은 3이 아니라 3n.",
         en:"A constant inside Σ is added n times — Σ 3 from 1 to n is 3n, not 3.",
         zh:"常数在Σ里要加n次——Σ 3（k从1到n）是3n，不是3。" } };

T["MD43"] = { source:"known",
  hook:{ ko:"분모의 최고차항으로 위아래를 나누면 다항식 극한은 계수만 남아요",
         en:"Divide top and bottom by the denominator's leading term — only the leading coefficients survive.",
         zh:"用分母的最高次项去除分子分母,极限就只剩下首项系数。" },
  why:{ ko:"x가 무한히 커지면 차수가 낮은 항들은 상대적으로 0에 가까워 무시돼요",
         en:"As x grows without bound, lower-degree terms shrink to nothing next to the leading one.",
         zh:"当x趋于无穷,次数较低的项相对越来越小,可以忽略。" },
  mistake:{ ko:"분자·분모 차수가 다르면 몫이 아니라 0 또는 무한대가 나와요",
         en:"If the degrees differ, the limit isn't a ratio — it's 0 or infinity.",
         zh:"如果分子分母次数不同,极限不是系数比,而是0或无穷大。" } };

T["MD44"] = { source:"own",
  hook:{ ko:"상수항은 미분하면 감쪽같이 사라져요 — 기울기가 없으니까요",
         en:"A constant term vanishes when you differentiate — it has no slope to give.",
         zh:"常数项一求导就消失——因为它没有斜率。" },
  why:{ ko:"상수함수는 그래프가 수평선이라 어디서나 순간 변화율이 0이기 때문이에요",
         en:"A constant function graphs as a flat line, so its instantaneous rate of change is 0 everywhere.",
         zh:"常数函数的图象是水平线,任何一点的瞬时变化率都是0。" },
  mistake:{ ko:"naxⁿ⁻¹에서 계수 곱하는 걸 빼먹기 쉬워요 — 3x²→'2x'말고 '6x'예요",
         en:"It's easy to forget the coefficient multiply in naxⁿ⁻¹ — 3x² gives 6x, not just 2x.",
         zh:"容易漏乘naxⁿ⁻¹里的系数——3x²求导是6x,不是仅仅2x。" } };

T["MD45"] = { source:"known",
  hook:{ ko:"접선은 그냥 점 기울기 공식이에요: y-f(x0)=f'(x0)(x-x0)",
         en:"A tangent line is just point-slope form: y-f(x0)=f'(x0)(x-x0).",
         zh:"切线其实就是点斜式:y-f(x0)=f'(x0)(x-x0)。" },
  why:{ ko:"접점 (x0,f(x0))을 지나고 기울기가 f'(x0)인 직선을 바로 쓰는 식이라서예요",
         en:"It's the line through the point (x0,f(x0)) with slope f'(x0), written directly.",
         zh:"这就是过切点(x0,f(x0))、斜率为f'(x0)的直线方程,直接写出来。" },
  mistake:{ ko:"x0를 f'에 넣을 자리에 f에, f에 넣을 자리에 f'에 넣는 실수가 잦아요",
         en:"It's common to mix up which x0 goes into f and which goes into f'.",
         zh:"常把该代入f的x0和该代入f'的x0弄混。" } };

T["MD46"] = { source:"own",
  hook:{ ko:"부정적분엔 +C, 정적분엔 C가 서로 빼져서 통째로 사라져요",
         en:"Indefinite integrals keep +C; in a definite integral, the C's subtract away completely.",
         zh:"不定积分要加+C,定积分中C相减后会完全消失。" },
  why:{ ko:"정적분은 F(q)-F(p)라서 C가 있어도 빼는 과정에서 지워지기 때문이에요",
         en:"A definite integral is F(q)-F(p), so any C cancels out when you subtract.",
         zh:"定积分是F(q)-F(p),不管C是多少,相减时都会被抵消。" },
  mistake:{ ko:"n=-1일 때(1/x의 적분)는 이 공식이 아니라 로그가 나와요 — 예외로 기억해요",
         en:"When n=-1 (integrating 1/x), this power rule doesn't apply — it gives a logarithm instead.",
         zh:"当n=-1时(积分1/x),这个幂法则不适用,结果是对数。" } };

T["MD47"] = { source:"own",
  hook:{ ko:"계수 1은 안 쓰고, 문자는 알파벳 순서로 나란히 써요",
         en:"Skip writing a coefficient of 1, and list letters in alphabetical order.",
         zh:"系数为1时省略不写,字母按字母顺序排列。" },
  why:{ ko:"1을 곱해도 값이 그대로라 표기에서 굳이 남기지 않는 약속이기 때문이에요",
         en:"Multiplying by 1 changes nothing, so by convention it's simply left out of the notation.",
         zh:"乘以1结果不变,所以按惯例干脆省略不写。" },
  mistake:{ ko:"0.1×a를 0.a로 쓰면 안 돼요 — 소수와 문자 사이의 ×는 생략하지 않아요",
         en:"Never write 0.1×a as 0.a — the × between a decimal and a letter is never dropped.",
         zh:"0.1×a不能写成0.a——小数和字母之间的×不能省略。" } };

T["MD48"] = { source:"known",
  hook:{ ko:"(-3)²과 -3²은 달라요 — 괄호가 있어야 마이너스도 제곱돼요",
         en:"(-3)² and -3² are different — you need parentheses for the minus to be squared too.",
         zh:"(-3)²和-3²不一样——只有加括号,负号才会一起被平方。" },
  why:{ ko:"-3²은 3²부터 계산하고 마이너스는 나중에 붙는 것으로 읽히기 때문이에요",
         en:"-3² is read as squaring 3 first, then attaching the minus sign afterward.",
         zh:"-3²的读法是先算3²,负号最后才加上去。" },
  mistake:{ ko:"x=-2를 x²에 넣을 때 괄호 없이 -2²이라 쓰면 -4로 잘못 나와요",
         en:"Substituting x=-2 into x² without parentheses gives the wrong answer, -4.",
         zh:"把x=-2代入x²时不加括号写成-2²,会算错成-4。" } };

T["MD49"] = { source:"known",
  hook:{ ko:"괄호 앞에 마이너스가 있으면 괄호 안 부호가 전부 뒤집혀요",
         en:"A minus sign in front of parentheses flips every sign inside them.",
         zh:"括号前有负号时,括号里所有符号都要变号。" },
  why:{ ko:"-(A+B)는 -1을 A와 B 모두에 곱해서 분배하는 것과 같기 때문이에요",
         en:"-(A+B) means distributing -1 to both A and B, so both signs change.",
         zh:"-(A+B)相当于把-1分配给A和B两项,两个符号都要变。" },
  mistake:{ ko:"-(2x-3)을 -2x-3으로 쓰는 실수가 잦아요 — 정답은 -2x+3",
         en:"-(2x-3) is often mis-written as -2x-3, but the correct answer is -2x+3.",
         zh:"-(2x-3)常被误写成-2x-3,正确答案是-2x+3。" } };

T["MD5"] = { source:"known",
  hook:{ ko:"-2⁴처럼 괄호가 없으면 −는 지수 밖 — 답은 음수예요",
         en:"In -2⁴ the minus sits outside the exponent, so the answer is negative",
         zh:"像-2⁴这样没有括号，负号在指数外面——答案是负数" },
  why:{ ko:"지수는 a에만 걸리고, -는 계산이 끝난 뒤 맨 마지막에 딱 한 번 붙기 때문이에요",
         en:"The exponent applies only to a; the minus is applied once, at the very end",
         zh:"指数只作用在a上,负号是最后才加的一次" },
  mistake:{ ko:"(-2)⁴는 +16, -2⁴는 -16 — 괄호가 있는지부터 보세요",
         en:"(-2)⁴ is +16 but -2⁴ is -16 — check for the parentheses first",
         zh:"(-2)⁴是+16，而-2⁴是-16——先看有没有括号" } };

T["MD50"] = { source:"known",
  hook:{ ko:"분수·소수 계수는 먼저 양변에 곱해 정수로 만들고 시작해요",
         en:"Clear fractions or decimals first — multiply both sides so every coefficient is a whole number.",
         zh:"遇到分数或小数系数,先在两边同乘一个数把系数变成整数。" },
  why:{ ko:"분모의 최소공배수(또는 10의 거듭제곱)를 곱하면 계산이 훨씬 간단해지기 때문이에요",
         en:"Multiplying by the LCM of the denominators (or a power of 10) makes the rest much simpler.",
         zh:"乘以分母的最小公倍数(或10的幂),后面的计算会简单很多。" },
  mistake:{ ko:"양변에 곱할 때 상수항까지 빠짐없이 곱해야 해요 — 일부만 곱하는 실수가 잦아요",
         en:"Multiply every term on both sides, including constants — it's easy to miss one.",
         zh:"两边相乘时连常数项也要乘,漏乘某一项是常见错误。" } };

T["MD51"] = { source:"known",
  hook:{ ko:"정비례는 원점을 지나는 직선, 반비례는 원점을 피해가는 곡선이에요",
         en:"Direct proportion is a straight line through the origin; inverse proportion is a curve that avoids it.",
         zh:"正比例是过原点的直线,反比例是绕开原点的曲线。" },
  why:{ ko:"반비례는 x=0에서 정의되지 않아 그래프가 원점을 지날 수 없기 때문이에요",
         en:"Inverse proportion isn't defined at x=0, so its graph can never touch the origin.",
         zh:"反比例在x=0时没有意义,图象永远不会经过原点。" },
  mistake:{ ko:"반비례 그래프가 좌표축에 닿는다고 그리면 안 돼요 — 축에 가까워지기만 해요",
         en:"Don't draw the inverse-proportion graph touching the axes — it only gets closer without touching.",
         zh:"反比例的图象不能画成碰到坐标轴——它只是无限接近。" } };

T["MD52"] = { source:"known",
  hook:{ ko:"지수식이 이차식 모양이면 aˣ=t로 치환해 이차방정식처럼 풀어요",
         en:"If the exponential equation looks quadratic, substitute t=aˣ and solve it like one.",
         zh:"如果指数方程长得像二次方程,就设t=aˣ,当二次方程解。" },
  why:{ ko:"같은 밑의 거듭제곱이 반복되면 새 문자로 바꿔서 낯익은 식으로 만들 수 있어요",
         en:"When the same power of the base keeps repeating, renaming it turns the equation into a familiar shape.",
         zh:"同一底数的幂反复出现时,换元就能把方程变成熟悉的形式。" },
  mistake:{ ko:"t=aˣ는 항상 양수예요 — 치환해서 나온 t의 음수 해는 버려요",
         en:"Since t=aˣ is always positive, discard any negative solution for t.",
         zh:"t=aˣ永远是正数——解出t为负的解要舍去。" } };

T["MD53"] = { source:"known",
  hook:{ ko:"로그방정식은 풀고 나서 꼭 진수 조건에 다시 넣어봐야 해요",
         en:"After solving a log equation, plug the answer back to check the true-number condition.",
         zh:"解完对数方程后,一定要把解代回去检查真数条件。" },
  why:{ ko:"로그의 정의역(진수>0)은 방정식을 푸는 과정에서 저절로 지켜지지 않기 때문이에요",
         en:"The log's domain (true number > 0) isn't automatically preserved while solving.",
         zh:"对数的定义域(真数>0)在解方程过程中不会自动被满足。" },
  mistake:{ ko:"구한 해를 대입했을 때 진수가 0 이하가 되면 그 해는 버려야 해요",
         en:"If a solution makes the true number zero or negative, that solution must be rejected.",
         zh:"如果代入后真数变成0或负数,这个解就必须舍去。" } };

T["MD54"] = { source:"known",
  hook:{ ko:"밑이 0과 1 사이면 감소함수라서 부등호가 뒤집혀요",
         en:"If the base is between 0 and 1, the function decreases, so the inequality sign flips.",
         zh:"底数在0到1之间时函数是减函数,不等号方向要反过来。" },
  why:{ ko:"밑이 작을수록 지수가 커질 때 오히려 값이 작아지는 반대 방향이기 때문이에요",
         en:"With a small base, a bigger exponent actually gives a smaller value — the opposite direction.",
         zh:"底数越小,指数越大时值反而越小,方向正好相反。" },
  mistake:{ ko:"로그부등식은 진수 조건도 함께 만족해야 해요 — 부등호만 풀면 안 돼요",
         en:"A log inequality must also satisfy the true-number condition — solving it alone isn't enough.",
         zh:"对数不等式还必须同时满足真数条件——只解不等号是不够的。" } };

T["MD55"] = { source:"own",
  hook:{ ko:"각 2개+변 1개, 또는 변+그 대각을 알면 사인법칙을 써요",
         en:"Know two angles and a side, or a side with its opposite angle? Use the law of sines.",
         zh:"知道两个角加一条边,或一条边和它的对角,就用正弦定理。" },
  why:{ ko:"사인법칙은 '변÷대각의 사인'이 항상 같다는 비율 관계라 각을 아는 상황에 강해요",
         en:"The law of sines is a ratio — side over sine of its opposite angle stays constant — so it shines when angles are known.",
         zh:"正弦定理是'边长÷对角正弦值'恒定的比例关系,已知角度时特别好用。" },
  mistake:{ ko:"변+대각(SSA) 조건은 삼각형이 두 가지로 그려질 수 있어요 — 실제로 성립하는지 확인",
         en:"A side-side-angle (SSA) setup can sometimes form two different triangles — check the solution is actually valid.",
         zh:"边边角(SSA)条件有时能画出两个不同的三角形——要检查解是否成立。" } };

T["MD56"] = { source:"known",
  hook:{ ko:"각을 구할 땐 코사인법칙을 뒤집어 cosA=(b²+c²-a²)÷2bc로 써요",
         en:"To find an angle, flip the law of cosines around: cosA=(b²+c²-a²)÷2bc.",
         zh:"求角度时把余弦定理反过来用:cosA=(b²+c²-a²)÷2bc。" },
  why:{ ko:"변 세 개를 다 알 때는 거꾸로 풀어서 각의 코사인값부터 구하는 게 더 빨라요",
         en:"When all three sides are known, working backward to the angle's cosine is faster.",
         zh:"已知三边时,反过来先求出角的余弦值会更快。" },
  mistake:{ ko:"분자에서 구하려는 각의 대변(a)만 빼요 — b,c는 그 각을 낀 나머지 두 변이에요",
         en:"In the numerator, only subtract the side opposite the angle you want — b and c form it.",
         zh:"分子里只减去所求角的对边a——b、c是夹这个角的另外两边。" } };

T["MD57"] = { source:"known",
  hook:{ ko:"진폭은 항상 절댓값 |a|예요 — a가 음수여도 흔들리는 폭은 같아요",
         en:"The amplitude is always |a| — even if a is negative, the swing's width stays the same.",
         zh:"振幅永远是|a|——即使a是负数,摆动的幅度也不变。" },
  why:{ ko:"a가 음수면 그래프가 위아래로 뒤집힐 뿐, 최댓값과 최솟값 사이 폭은 그대로예요",
         en:"A negative a just flips the graph upside down; the gap between max and min stays the same.",
         zh:"a为负只是把图象上下翻转,最大值和最小值之间的差距不变。" },
  mistake:{ ko:"a가 음수일 때 최댓값을 c+a로 쓰기 쉬워요 — 최댓값은 c+|a|, 최솟값은 c-|a|",
         en:"When a is negative it's tempting to write the max as c+a — it's actually c+|a|, min is c-|a|.",
         zh:"a为负时容易把最大值写成c+a——其实最大值是c+|a|,最小值是c-|a|。" } };

T["MD58"] = { source:"known",
  hook:{ ko:"켤레를 곱해도 값은 그대로예요 — 분모분자에 1을 곱한 것뿐이니까요",
         en:"Multiplying by the conjugate doesn't change the value — it's really just multiplying by 1.",
         zh:"乘以共轭式不会改变数值——本质上只是乘了个1。" },
  why:{ ko:"(근호-a)(근호+a)=근호²-a² 공식으로 근호가 사라져 약분할 인수가 드러나요",
         en:"The formula (√-a)(√+a)=(√)²-a² clears the root and reveals a factor you can cancel.",
         zh:"利用(根号-a)(根号+a)=根号²-a²消去根号,就能露出可以约分的因式。" },
  mistake:{ ko:"켤레를 분자에만 곱하고 분모에는 빼먹는 실수가 흔해요 — 둘 다 곱해야 해요",
         en:"It's common to multiply the conjugate into the numerator but forget the denominator — do both.",
         zh:"常见错误是只在分子乘共轭式而漏了分母——两边都要乘。" } };

T["MD59"] = { source:"known",
  hook:{ ko:"좌극한·우극한이 먼저 같아야 극한이 있고, 그다음 함숫값과 맞춰요",
         en:"The left and right limits must match first for the limit to exist — then match it to the function value.",
         zh:"左极限和右极限先要相等,极限才存在,然后再对上函数值。" },
  why:{ ko:"나뉜 구간에서 양쪽 식이 다르면 좌극한·우극한도 따로 계산되기 때문이에요",
         en:"When the pieces use different formulas, the left and right limits are computed separately.",
         zh:"分段函数两边公式不同,左极限和右极限也要分别计算。" },
  mistake:{ ko:"좌극한=우극한만 확인하고 함숫값 비교를 빼먹기 쉬워요 — 세 값이 다 같아야 연속",
         en:"It's easy to check only that the two limits match and forget the function value — all three must agree.",
         zh:"容易只检查左右极限相等就漏掉函数值——三者都相等才算连续。" } };

T["MD6"] = { source:"known",
  hook:{ ko:"같은 급수는 왼쪽부터! 6÷2×3=(6÷2)×3=9예요",
         en:"Same rank goes left to right: 6÷2×3 = (6÷2)×3 = 9",
         zh:"同级运算从左到右算:6÷2×3=(6÷2)×3=9" },
  why:{ ko:"곱셈·나눗셈은 순위가 같아서 등장한 순서(왼쪽부터) 그대로 계산해야 하기 때문이에요",
         en:"Multiplication and division share one rank, so you work them in reading order",
         zh:"乘除同级,加减同级,同级运算要按从左到右的顺序算" },
  mistake:{ ko:"나눗셈보다 곱셈을 무조건 먼저 하는 실수 — 둘은 순서가 같아요",
         en:"Don't always do multiplication before division — they're equal rank",
         zh:"别以为乘法总要先算——乘除同级,谁在左先算谁" } };

T["MD60"] = { source:"known",
  hook:{ ko:"f'(x)=0이라고 다 극값은 아니에요 — 부호가 안 바뀌면 극값이 아니에요",
         en:"f'(x)=0 doesn't guarantee an extremum — if the sign doesn't flip, it isn't one.",
         zh:"f'(x)=0不代表一定是极值——如果符号没有变化,就不是极值。" },
  why:{ ko:"x³처럼 x=0에서 기울기가 0이어도 앞뒤 부호가 그대로 +인 경우가 있기 때문이에요",
         en:"Take x³ — the slope is 0 at x=0, but the sign stays positive on both sides.",
         zh:"比如x³在x=0处斜率为0,但前后符号都保持为正。" },
  mistake:{ ko:"f'(x0)=0인 x를 다 극값으로 답하면 틀려요 — 증감표로 부호 변화를 꼭 확인",
         en:"Marking every x where f'(x0)=0 as an extremum is wrong — confirm the sign change with a table.",
         zh:"把所有f'(x0)=0的x都当成极值是错的——一定要用增减表确认符号变化。" } };

T["MD61"] = { source:"known",
  hook:{ ko:"곡선이 x축 아래로 내려가면 정적분값은 음수, 넓이는 그 절댓값이에요",
         en:"When the curve dips below the x-axis, the definite integral goes negative — area is its absolute value.",
         zh:"当曲线落到x轴下方,定积分值就是负数,面积则是它的绝对值。" },
  why:{ ko:"정적분은 부호가 있는 면적이라 x축 아래 구간에서는 음수로 계산되기 때문이에요",
         en:"A definite integral is a signed area, so anything below the x-axis comes out negative.",
         zh:"定积分是带符号的面积,x轴下方的部分算出来自然是负的。" },
  mistake:{ ko:"구간 중간에 x축을 넘나들면 통째로 적분하면 안 돼요 — 교점마다 나눠 절댓값을 더해요",
         en:"If the curve crosses the x-axis partway through, split at each crossing and add absolute values.",
         zh:"如果曲线中途穿过x轴,要在每个交点处分段,再把绝对值加起来。" } };

T["MD62"] = { source:"known",
  hook:{ ko:"속도가 중간에 음수가 되면, 이동거리는 속도에 절댓값을 씌워 적분해요",
         en:"If velocity turns negative partway, find total distance by integrating its absolute value.",
         zh:"如果速度中途变成负数,总路程要对速度取绝对值后再积分。" },
  why:{ ko:"위치변화량은 앞뒤 이동이 상쇄되지만, 이동거리는 방향과 상관없이 다 더해요",
         en:"Displacement lets forward and backward movement cancel out, but distance adds everything regardless of direction.",
         zh:"位移会让前进和后退相互抵消,而路程不管方向,全部都要加起来。" },
  mistake:{ ko:"위치의 변화량과 이동거리를 같은 값으로 헷갈리면 안 돼요 — 속도 부호가 바뀔 때만 달라요",
         en:"Don't assume displacement and distance are the same — they differ only when velocity changes sign.",
         zh:"不要把位移和路程当成同一个值——只有速度变号时两者才会不同。" } };

T["MD7"] = { source:"known",
  hook:{ ko:"역수는 분자·분모만 뒤집어요, 부호는 그대로예요 ((-2/3)의 역수는 -3/2)",
         en:"A reciprocal flips numerator and denominator only, never the sign",
         zh:"取倒数只交换分子分母,不变号——(-2/3)的倒数是-3/2" },
  why:{ ko:"역수는 곱해서 1이 되는 수인데, 부호까지 뒤집으면 곱이 -1이 되어버리기 때문이에요",
         en:"A reciprocal must multiply back to 1, but flipping the sign too gives -1 instead",
         zh:"倒数要乘回1,如果连符号也翻,乘出来就变成-1了" },
  mistake:{ ko:"역수 구할 때 부호까지 반대로 바꾸는 실수 조심 — 분자분모만 바꿔요",
         en:"Don't flip the sign when taking a reciprocal — only numerator and denominator swap",
         zh:"求倒数时别把符号也翻了,只交换分子和分母" } };

T["MD8"] = { source:"known",
  hook:{ ko:"판별 전에 약분부터! 안 줄인 분모엔 엉뚱한 소인수가 숨어요",
         en:"Reduce the fraction first — an un-simplified denominator can hide the wrong prime",
         zh:"判断前先约分!没约分的分母可能藏着不该有的质因数" },
  why:{ ko:"약분 안 된 분모엔 분자와 겹치는 소인수가 남아 판별이 틀릴 수 있기 때문이에요",
         en:"Before reducing, the denominator may still carry a factor shared with the numerator",
         zh:"没约分时分母可能和分子有公因数,不能反映真正的质因数" },
  mistake:{ ko:"6/15을 그대로 보고 3이 있다며 순환소수로 착각 — 약분하면 2/5(유한)예요",
         en:"6/15 looks like it has a 3 in the denominator, but reduced to 2/5 it's finite",
         zh:"6/15看着有质因数3,但约成2/5后其实是有限小数" } };

T["MD9"] = { source:"known",
  hook:{ ko:"분모는 순환마디 수만큼 9, 비순환마디 수만큼 0 — 예: 990",
         en:"Denominator = one 9 per repeating digit, then one 0 per non-repeating digit, like 990",
         zh:"分母:循环节几位就几个9,不循环几位就几个0,比如990" },
  why:{ ko:"10ⁿ×(10ᵐ-1)을 실제로 쓰면 9가 m개 나온 뒤 0이 n개 이어지기 때문이에요",
         en:"10ⁿ×(10ᵐ−1) literally writes out as m nines followed by n zeros",
         zh:"10ⁿ×(10ᵐ-1)展开正好是m个9后面跟n个0" },
  mistake:{ ko:"9와 0의 개수를 바꿔 쓰는 실수 주의 — 9는 순환마디, 0은 비순환마디 개수예요",
         en:"Don't swap the counts — 9s count repeating digits, 0s count non-repeating ones",
         zh:"别把9和0的个数弄反——9对应循环位数,0对应不循环位数" } };
})();
