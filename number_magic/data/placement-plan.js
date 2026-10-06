/* Numbers Magic: fixed, source-referenced diagnosis plans.
 * This module does not change courses, generators, progress, or storage.
 * Foundation stages are learning topics, not age or admission standards.
 */
(function () {
  'use strict';
  const W = typeof window !== 'undefined' ? window : globalThis;
  const BAND_COUNTS = { previous: 6, current: 10, next: 4 };
  const text = (ko, en, zh) => ({ ko, en, zh });
  const localized = (value, fallback) => typeof value === 'string' ? text(value, value, value) :
    text(value && value.ko || fallback, value && value.en || value && value.ko || fallback, value && value.zh || value && value.ko || fallback);
  const clone = value => JSON.parse(JSON.stringify(value));
  const FOUNDATION = [
    { id: 'f-count5', label: text('5까지 수 세기', 'Counting to 5', '数数到5'), course: 'C0', session: 1, kind: 'foundation', refs: [{ t: 'NL1', lv: 1, session: 1 }] },
    { id: 'f-quantity5', label: text('5까지 수량과 숫자', 'Quantity and numerals to 5', '5以内数量与数字'), course: 'C0', session: 11, kind: 'foundation', refs: [{ t: 'NL1', lv: 3, session: 11 }, { t: 'NL7', lv: 3, session: 17 }] },
    { id: 'f-compare5', label: text('5까지 많고 적음', 'More and less to 5', '5以内比较多少'), course: 'C0', session: 3, kind: 'foundation', refs: [{ t: 'NL10', lv: 1, session: 3 }] },
    { id: 'f-order10', label: text('10까지 수의 순서', 'Number order to 10', '10以内数的顺序'), course: 'C0', session: 1, kind: 'foundation', refs: [{ t: 'NL4', lv: 1, session: 2 }, { t: 'NL7', lv: 1, session: 1 }] },
    { id: 'f-split5', label: text('5까지 가르기', 'Splitting to 5', '5以内分一分'), course: 'C0', session: 6, kind: 'foundation', refs: [{ t: 'NL2', lv: 1, session: 6 }] },
    { id: 'f-split9', label: text('9까지 가르기와 0', 'Splitting to 9, including 0', '9以内分一分和0'), course: 'C0', session: 9, kind: 'foundation', refs: [{ t: 'NL2', lv: 2, session: 9 }] },
    { id: 'f-join9', label: text('9까지 모으기', 'Joining to 9', '9以内合一合'), course: 'C0', session: 16, kind: 'foundation', refs: [{ t: 'NL2', lv: 3, session: 16 }] },
    { id: 'f-ten10', label: text('10의 짝꿍', 'Partners to 10', '凑10好朋友'), course: 'C0', session: 7, kind: 'foundation', refs: [{ t: 'NL6', lv: 1, session: 7, diagnosticTransform: 'single-target-and-empty-full-boundaries' }] }
  ];
  let stageCache = null;

  function fail(message) { throw new Error('NM_PLACEMENT_PLAN: ' + message); }
  function dependencies() {
    if (!W.NM_THREADS || !W.NM_TGEN || !W.NM_RNG || !W.NM_COURSES || !W.NM_COURSE_SPEC) fail('missing source dependencies');
  }
  function source(ref, seed) {
    const th = W.NM_THREADS[ref.t];
    const lv = th && (th.levels || []).find(x => x.id === ref.lv);
    const gen = th && W.NM_TGEN[th.gen];
    if (!lv || !gen) fail('missing generator/level ' + ref.t + '@' + ref.lv);
    return gen(clone(lv.params || {}), W.NM_RNG.mulberry32(W.NM_RNG.hashSeed(String(seed))));
  }
  function numericAnswer(value) {
    return typeof value === 'number' && Number.isFinite(value) ||
      Array.isArray(value) && value.length > 0 && value.every(x => typeof x === 'number' && Number.isFinite(x));
  }
  function numberSafe(p) {
    if (!p || !numericAnswer(p.answer) || typeof p.tex !== 'string' || !p.tex.trim()) return false;
    // A formula cannot replace an unrendered drawing/graph or a free response.
    if (['graphDraw', 'geometryDraw', 'freeDraw', 'draw', 'selectPairs', 'sortBasket', 'matchLine', 'dotToDot'].includes(p.widget)) return false;
    if (p.graph || p.diagram || p.figure || p.drawing || p.geometry || p.freeAnswer) return false;
    if (p.answerType === 'steps' && !(Array.isArray(p.steps) && p.steps.length)) return false;
    return true;
  }
  function safeRef(ref) {
    try { return [7, 59, 113].every(seed => numberSafe(source(ref, 'placement-safe-' + seed))); }
    catch (_) { return false; }
  }
  function sourceRefs(course) {
    const c = W.NM_COURSES[course], spec = W.NM_COURSE_SPEC.find(s => 'C' + s.id === course);
    if (!c || !spec) return [];
    const own = new Set((spec.drills || []).map(x => String(x).split('@')[0]));
    const refs = [], seen = new Set();
    (c.sessions || []).forEach((s, i) => (s.drills || []).forEach(d => {
      const key = d.t + '@' + d.lv;
      if (own.has(d.t) && !seen.has(key)) { seen.add(key); refs.push({ t: d.t, lv: d.lv, session: i + 1 }); }
    }));
    return refs;
  }
  function allStages() {
    dependencies();
    if (stageCache) return stageCache;
    const out = clone(FOUNDATION);
    W.NM_COURSE_SPEC.forEach(spec => {
      if (spec.id === 0) return;
      const course = 'C' + spec.id, c = W.NM_COURSES[course];
      if (!c || c.comingSoon) return;
      const refs = sourceRefs(course).filter(safeRef);
      // Unsupported sources are not silently replaced with unrelated arithmetic.
      if (!refs.length) return;
      out.push({ id: course.toLowerCase(), label: localized(c.title, course), course,
        session: Math.min(...refs.map(r => r.session)), kind: 'course', refs });
    });
    stageCache = out;
    return out;
  }
  function stages() { return clone(allStages()); }

  const DOMAINS = {
    counting: text('수 세기', 'Counting', '数数'), quantity: text('수량과 숫자', 'Quantity and numerals', '数量与数字'),
    comparison: text('많고 적음', 'More and less', '比较多少'), order: text('수의 순서', 'Number order', '数的顺序'),
    splitting: text('가르기', 'Splitting', '分一分'), joining: text('모으기', 'Joining', '合一合'),
    tenComplement: text('10의 짝꿍', 'Partners to 10', '凑10'), numberBonds: text('수의 짝', 'Number bonds', '数的组成'), placeValue: text('자릿값', 'Place value', '数位'),
    addition: text('덧셈', 'Addition', '加法'), subtraction: text('뺄셈', 'Subtraction', '减法'),
    multiplication: text('곱셈', 'Multiplication', '乘法'), division: text('나눗셈', 'Division', '除法'),
    fraction: text('분수', 'Fractions', '分数'), decimal: text('소수', 'Decimals', '小数')
  };
  function domainFor(t) {
    if (t === 'NS1') return 'placeValue';
    if (t === 'NS2') return 'splitting';
    if (t === 'NS3') return 'numberBonds';
    if (/^AD/.test(t)) return 'addition';
    if (/^SB/.test(t)) return 'subtraction';
    if (/^ML/.test(t)) return 'multiplication';
    if (/^DV/.test(t)) return 'division';
    if (/^FR/.test(t)) return 'fraction';
    if (/^DC/.test(t)) return 'decimal';
    return t; // Keep distinct source domains instead of inventing a mastery claim.
  }
  function foundation(stage, ref, p, small, variant) {
    const symbol = p.emoji || '●';
    let domain, responseMode, renderData, prompt = p.prompt, answer = p.answer;
    switch (stage.id) {
      case 'f-count5':
        if (!Array.isArray(p.items) || p.widget !== 'tapCount' || p.answer > (small ? 3 : 5)) return null;   // 숫자·틀 위젯 굴림은 진단의 '그림 눌러 세기'가 아니다
        domain = 'counting'; responseMode = 'count-tap';
        renderData = { items: p.items.map(x => ({ symbol: x.e, target: x.t === true })), targetSymbol: p.emoji };
        prompt = text('목표 그림과 같은 그림을 모두 눌러요.', 'Tap every object matching the target picture.', '点选所有与目标图形相同的物体。');
        break;
      case 'f-quantity5':
        domain = 'quantity';
        if (ref.t === 'NL1') {
          if (p.target > 5) return null;
          responseMode = 'make'; renderData = { target: p.target, symbol, max: 5 };
          prompt = text('말한 수만큼 만들어요.', 'Make the requested quantity.', '做出指定的数量。');
        } else {
          if (!p.right || p.right.some(x => x > 5)) return null;
          // One target only: do not treat completion of a whole matching board as a correct answer.
          const target = p.left[0], index = p.right.indexOf(target);
          responseMode = 'match-number'; renderData = { dots: p.right.slice(), target }; answer = index;
          prompt = text('숫자와 같은 개수의 점 그림 하나를 골라요.', 'Choose the dot picture matching the numeral.', '选出与数字数量相同的点图。');
        }
        break;
      case 'f-compare5':
        if (p.left > 5 || p.right > 5) return null;
        domain = 'comparison'; responseMode = 'compare';
        // Preserve the source's heavier/lighter choice without showing its tilted answer.
        const asksMore = p.answer === (p.left > p.right ? 0 : 1);
        renderData = { left: p.left, right: p.right, symbol, ask: asksMore ? 'more' : 'less' };
        answer = p.answer + 1;
        prompt = asksMore ? text('더 많은 쪽을 골라요.', 'Choose the side with more.', '选数量更多的一边。') : text('더 적은 쪽을 골라요.', 'Choose the side with fewer.', '选数量更少的一边。');
        break;
      case 'f-order10':
        if (!p.seq || p.seq.some(x => x < 1 || x > 10)) return null;
        domain = 'order'; responseMode = 'sequence'; renderData = { seq: p.seq.slice(), blank: p.blank };
        prompt = text('빈칸에 들어갈 수를 쓰세요.', 'Write the number that belongs in the blank.', '填写空格中的数字。');
        break;
      case 'f-split5': case 'f-split9':
        if (p.whole > (stage.id === 'f-split5' ? 5 : 9)) return null;
        domain = 'splitting'; responseMode = 'split'; renderData = { whole: p.whole, known: p.a, symbol };
        prompt = text('전체 ' + p.whole + '개 중 ' + p.a + '개를 한쪽에 놓았어요. 다른 쪽은 몇 개일까요?', 'Of ' + p.whole + ' objects, ' + p.a + ' are in one group. How many are in the other?', '一共有' + p.whole + '个，一边放了' + p.a + '个。另一边有几个？');
        break;
      case 'f-join9':
        if (p.a + p.b > 9) return null;
        domain = 'joining'; responseMode = 'join'; renderData = { left: p.a, right: p.b, symbol };
        prompt = text('두 묶음을 모으면 모두 몇 개인가요?', 'How many objects are there when the two groups are joined?', '把两组物体合起来，一共有几个？');
        break;
      case 'f-ten10':
        domain = 'tenComplement'; responseMode = 'ten-bond';
        // Diagnosis-only, approved single-target transforms: swap the source's
        // two partners, or show the empty/full ten-frame boundary. This adds no
        // learning level and does not claim all decompositions of ten are mastered.
        const filled = variant % 4 === 2 ? 0 : variant % 4 === 3 ? 10 : variant % 4 === 1 ? p.answer : p.cubes.piles[0];
        renderData = { filled, total: 10 }; answer = 10 - filled;
        prompt = text('10칸에서 비어 있는 칸은 몇 칸인가요?', 'How many of the ten spaces are empty?', '十格中有几个空格？');
        break;
      default: return null;
    }
    return { domain, responseMode, renderData, prompt: clone(prompt), answer: clone(answer) };
  }
  // These source questions are complete in their displayed arithmetic statement
  // and response template. Their learning prompts may give a strategy or even
  // intermediate numbers (AD2's move-to-ten, SB5's adjustment, FR4's LCM).
  // Do not apply a family-prefix rewrite: NS1's requested place, DV6's digit
  // constraints, DV7/20's factor/multiple task, and algebra conditions matter.
  const COMPLETE_ARITHMETIC = new Set([
    'NS2', 'NS3', 'NS4', 'NS5',
    'AD1', 'AD2', 'AD3', 'AD4', 'AD5', 'AD6', 'AD7', 'AD8', 'AD9', 'AD10',
    'SB1', 'SB2', 'SB3', 'SB4', 'SB5', 'SB6', 'SB7',
    'ML1', 'ML2', 'ML3', 'ML4', 'ML5', 'ML6', 'ML7', 'ML8', 'ML9', 'ML10', 'ML11',
    'ML18', 'ML19', 'ML20', 'ML22', 'ML25',
    'DV1', 'DV2', 'DV3', 'DV4', 'DV5', 'DV12', 'DV13', 'DV14', 'DV15', 'DV17', 'DV18', 'DV19',
    'FR1', 'FR2', 'FR3', 'FR4', 'FR5', 'FR6', 'FR7', 'FR8', 'DC1', 'DC2', 'DC3',
    'MD2', 'MD4', 'MD5', 'MD6', 'MD7', 'MX1'
  ]);
  const NEUTRAL_BLANK = text('제시된 식의 빈칸에 알맞은 수를 쓰세요.', 'Enter the number that makes the shown statement true.', '在所示算式的空格中填写合适的数。');
  // Source-reviewed refs only, not a family-prefix policy. The displayed tex
  // already states the task in these refs. Other refs need the definitions,
  // domains, answer order or normalization conditions curated below.
  const COMPLETE_REFS = new Set([
    'CH3@4', 'CH3@5', 'CH4@1', 'CH4@2', 'CH4@3', 'CH4@4',
    'EL1@1', 'EL1@2', 'EL1@3', 'EL1@5', 'EL1@6', 'EL1@7', 'EL1@8', 'EL1@9',
    'EL2@1', 'EL2@2', 'EL2@3', 'CH2@1', 'CH2@2', 'CH2@3', 'CH2@4',
    'MD47@1', 'MD11@2', 'MD13@1', 'MD14@3', 'MD15@1',
    'MD21@1', 'MD21@3', 'MD23@1', 'MD24@2', 'MD95@1', 'MD94@3',
    'MD26@1', 'MD27@2', 'MD78@2', 'MD79@1', 'MD33@1',
    'MD123@3', 'MD132@2', 'MD134@1', 'MD134@2', 'MD134@3',
    'MD38@1', 'MD38@3', 'MD142@2', 'MD142@3', 'MD154@2',
    'MD45@1', 'MD45@2', 'MD46@1', 'MD46@2', 'MD159@1',
    'MD10@1', 'MD10@2', 'MD10@3', 'MD13@2', 'MD14@1', 'MD14@2',
    'MD15@2', 'MD17@1', 'MD17@2', 'MD22@2', 'MD22@3', 'MD23@2',
    'MD33@2', 'MD33@3', 'MD37@2', 'MD42@2', 'MD43@1', 'MD44@3',
    'MD49@1', 'MD50@1', 'MD51@1', 'MD51@2', 'MD51@3', 'MD52@3',
    'MD53@1', 'MD53@2', 'MD53@3', 'MD54@1', 'MD54@2',
    'MD64@1', 'MD64@2', 'MD64@3', 'MD65@3', 'MD66@2',
    'MD73@1', 'MD73@2', 'MD74@1', 'MD74@3', 'MD78@1', 'MD83@2',
    'MD91@1', 'MD91@2', 'MD91@3', 'MD94@1', 'MD95@2', 'MD97@3',
    'MD98@2', 'MD132@3', 'MD143@2', 'MD143@3'
  ]);
  const CURATED_CUES = Object.create(null);
  function cue(refs, ko, en, zh) { refs.split(' ').forEach(ref => { CURATED_CUES[ref] = text(ko, en, zh); }); }
  cue('CH6@1 CH6@2 CH6@3 CH6@4', '몫의 빈칸을 채우세요. 나머지는 식에 표시되어 있습니다.', 'Fill in the missing quotient. The remainder is shown in the statement.', '填写商的空格，余数已在算式中给出。');
  cue('MX2@1', '제시된 수열의 모든 항의 합을 구하세요.', 'Find the sum of all terms in the shown series.', '求所示数列所有项的和。');
  cue('DV8@2', '제시된 수를 소인수분해하여 모든 소인수를 작은 수부터 입력하세요. 같은 소인수가 여러 번 나오면 각각 입력하세요.', 'Prime-factorize the shown number. Enter all prime factors in increasing order, repeating a factor when needed.', '对所示数进行质因数分解，按从小到大的顺序输入所有质因数，重复出现的质因数要分别输入。');
  cue('DV8@3', '제시된 수의 양의 약수의 개수를 구하세요.', 'Count the positive divisors of the shown number.', '求所示数的正约数的个数。');
  cue('MD16@1 MD16@2 MD16@3', '근호 밖의 수는 양수이고, 근호 안에는 1보다 큰 완전제곱수 인수가 남지 않는 표준형으로 나타내세요.', 'Use standard radical form: the outside coefficient is positive and the radicand has no perfect-square factor greater than one.', '写成标准根式：根号外的系数为正，根号内不含大于1的完全平方因子。');
  cue('MD20@1 MD20@2', '표시된 인수분해의 두 빈칸을 작은 수부터 입력하세요.', 'Fill the two factorization blanks in increasing order.', '按从小到大的顺序填写所示因式分解的两个空格。');
  cue('MD20@3', '표시된 인수분해 형식의 빈칸을 채우세요.', 'Fill the blank in the shown factored form.', '填写所示因式分解形式的空格。');
  cue('MD20@4', '표시된 인수분해 형식의 두 빈칸에는 같은 양수를 입력하세요.', 'Enter the same positive number in both blanks of the shown factored form.', '在所示因式分解形式的两个空格中输入相同的正数。');
  cue('MD20@5', '정수 인수분해 형식으로 바깥 계수, 이어 두 괄호의 상수를 작은 수부터 입력하세요.', 'Use integer factorization: enter the outside coefficient, then the two bracket constants in increasing order.', '按整数因式分解形式输入括号外的系数，再按从小到大输入两个括号中的常数。');
  cue('MD20@6', '정수 인수분해 형식으로 앞 괄호의 x계수, 앞 괄호의 상수, 뒤 괄호의 상수 순서로 입력하세요.', 'Use integer factorization: enter the x-coefficient in the first bracket, its constant, then the constant in the second bracket.', '按整数因式分解形式，依次输入前括号中x的系数、前括号的常数、后括号的常数。');
  cue('MD28@1 MD28@2 MD28@3', '근의 공식의 약분하지 않은 표준형으로 나타내세요. 제시된 분자 상수, 근호 안의 수, 분모 순서로 입력하세요.', 'Use the unreduced standard quadratic-formula form. Enter the shown numerator constant, radicand, then denominator.', '使用求根公式未经约分的标准形式，按所示分子常数、根号内的数、分母的顺序输入。');
  cue('MD29@1 MD29@2 MD29@3', '해의 범위의 두 경계값을 작은 수부터 입력하세요. 부등호는 제시된 그대로 사용합니다.', 'Enter the two bounds of the solution interval in increasing order, using the shown inequalities.', '按从小到大的顺序输入解区间的两个界限，使用所示不等号。');
  cue('MD30@1 MD30@3', '행렬의 빈칸을 첫째 행 왼쪽부터, 이어 둘째 행 왼쪽부터 입력하세요.', 'Enter the matrix blanks left to right in the first row, then left to right in the second row.', '先从左到右输入矩阵第一行的空格，再从左到右输入第二行。');
  cue('MD31@1 MD31@2 MD31@3', '두 점 사이 거리의 빈칸을 표준 근호 형식으로 채우세요. 근호 밖의 수는 양수이고, 근호 안에는 1보다 큰 완전제곱수 인수가 남지 않아야 합니다.', 'Fill the distance between the two points in standard radical form, with a positive outside coefficient and no perfect-square factor greater than one in the radicand.', '用标准根式填写两点间距离：根号外系数为正，根号内不含大于1的完全平方因子。');
  cue('MD32@1', 'M은 선분 AB의 중점입니다. M의 x좌표, y좌표 순서로 입력하세요.', 'M is the midpoint of segment AB. Enter its x-coordinate, then y-coordinate.', 'M是线段AB的中点。按M的x坐标、y坐标的顺序输入。');
  cue('MD35@1 MD35@2 MD35@3', '원의 중심의 x좌표, y좌표, 양수인 반지름 순서로 입력하세요.', 'Enter the center’s x-coordinate, y-coordinate, then the positive radius.', '按圆心x坐标、y坐标、正的半径的顺序输入。');
  cue('MD55@1 MD55@2 MD55@3', '삼각형에서 A는 각이고 a는 그 맞은편 변의 길이, R은 외접원의 반지름입니다. 표시된 빈칸을 채우세요.', 'In the triangle, A is an angle, a its opposite side length, and R the circumradius. Fill the shown blank.', '三角形中A是角，a是其对边长，R是外接圆半径。填写所示空格。');
  cue('MD56@1 MD56@2 MD56@3', '삼각형 ABC에서 a=BC, b=CA, c=AB입니다. 표시된 양수인 변의 길이를 구하세요.', 'In triangle ABC, a=BC, b=CA and c=AB. Find the positive side length shown in the blank.', '三角形ABC中a=BC，b=CA，c=AB。求空格所示的正的边长。');
  cue('MD58@1', '제시된 극한값을 구하세요.', 'Evaluate the shown limit.', '求所示极限的值。');
  cue('MD58@2', '제시된 극한값을 기약분수로 나타내세요.', 'Express the shown limit as a fraction in lowest terms.', '把所示极限写成最简分数。');
  cue('MD59@1 MD59@2 MD59@3', '주어진 함수가 식이 나뉘는 경계점에서 연속이 되도록 빈칸을 채우세요.', 'Fill the blank so the given function is continuous at the boundary between its pieces.', '填写空格，使所给函数在分段边界点连续。');
  cue('MD60@1', 'f′(x)=0의 두 해를 작은 수부터 입력하세요.', 'Enter the two solutions of f′(x)=0 in increasing order.', '按从小到大的顺序输入f′(x)=0的两个解。');
  cue('MD61@1 MD61@2', '제시된 정적분의 값을 구하세요.', 'Evaluate the shown definite integral.', '求所示定积分的值。');
  cue('MD62@1', '제시된 도함수의 값을 구하세요.', 'Evaluate the shown derivative.', '求所示导函数的值。');
  cue('MD63@1 MD63@2 MD63@3', '연립방정식을 만족하는 x, y를 순서대로 입력하세요.', 'Enter x, then y, satisfying the system of equations.', '按x、y的顺序输入方程组的解。');
  cue('MD67@1 MD67@2 MD67@3', '꼭짓점의 x좌표, y좌표 순서로 입력하세요.', 'Enter the vertex’s x-coordinate, then y-coordinate.', '按顶点x坐标、y坐标的顺序输入。');
  cue('MD73@3', '제시된 일차함수 f(x)=ax+b의 계수 a, b를 순서대로 입력하세요. 크기순으로 정렬하지 않습니다.', 'For the shown linear function f(x)=ax+b, enter a, then b; do not sort them by size.', '对于所示一次函数f(x)=ax+b，按a、b的顺序输入，不按大小排序。');
  cue('MD92@1 MD92@2', 'ax+b는 표시된 다항식 나눗셈의 나머지입니다. 표시된 계수의 빈칸을 채우세요.', 'ax+b is the remainder of the shown polynomial division. Fill the indicated coefficient.', 'ax+b是所示多项式除法的余式。填写所示系数空格。');
  cue('MD26@1', 'D는 주어진 이차방정식의 판별식입니다. D를 구하세요.', 'D is the discriminant of the given quadratic equation. Find D.', 'D是所给一元二次方程的判别式，求D。');
  cue('MD27@2', 'α, β는 주어진 이차방정식의 두 근입니다. 표시된 합, 곱 순서로 입력하세요.', 'α and β are the two roots of the given quadratic equation. Enter their shown sum, then product.', 'α、β是所给一元二次方程的两个根。按所示两根之和、积的顺序输入。');
  cue('MD33@1 MD65@3', '표시된 두 점을 지나는 직선의 식을 제시된 형식으로 완성하세요.', 'Complete the equation of the line through the two shown points in the displayed form.', '按所示形式完成经过给定两点的直线方程。');
  cue('MD74@1 MD74@3', '제시된 직선 위의 두 점에서 빠진 y좌표를 왼쪽 점부터 입력하세요.', 'Enter the missing y-coordinates of the two points on the shown line, left point first.', '先左后右输入所示直线上两个点空缺的y坐标。');
  cue('MD95@1 MD95@2', 'a, b는 실수인 계수입니다. 표시된 복소수 식을 만족하는 a, b를 순서대로 입력하세요.', 'a and b are real coefficients. Enter a, then b, satisfying the shown complex-number statement.', 'a、b是实数系数。按a、b的顺序输入满足所示复数等式的数。');
  cue('MD98@2', 'α, β는 처음 이차방정식의 두 근입니다. 화살표 뒤에 표시된 두 수를 근으로 하는 새 방정식의 계수 a, b를 순서대로 입력하세요.', 'α and β are the roots of the first quadratic equation. Enter a, then b, for the new equation whose roots are the two numbers shown after the arrow.', 'α、β是原一元二次方程的两个根。以箭头后所示的两个数为根，按a、b的顺序输入新方程的系数。');
  cue('MD96@3', 'x, y는 실수입니다. 표시된 복소수 등식을 만족하는 x, y를 순서대로 입력하세요.', 'x and y are real. Enter x, then y, satisfying the shown complex-number equation.', 'x、y是实数。按x、y的顺序输入满足所示复数等式的解。');
  cue('MD100@1 MD100@2 MD100@3', 'M은 주어진 범위에서 함수의 최댓값, m은 최솟값입니다. 표시된 빈칸을 채우세요.', 'M is the maximum and m the minimum of the function over the given range. Fill the shown blank.', 'M是函数在给定范围内的最大值，m是最小值。填写所示空格。');
  cue('MD103@1 MD103@2 MD103@3', 'ω는 x³=1의 한 허근이고 ω̄는 ω의 켤레복소수입니다. 식의 값을 구하세요.', 'ω is a non-real root of x³=1 and ω̄ is its complex conjugate. Evaluate the shown expression.', 'ω是x³=1的一个非实根，ω̄是ω的共轭复数。求所示式子的值。');
  cue('MD105@3', 'x, y는 실수입니다. x, y 순서로 입력하세요.', 'x and y are real. Enter x, then y.', 'x、y是实数。按x、y的顺序输入。');
  cue('MD106@2 MD106@3', '주어진 범위에서 식의 최솟값, 최댓값 순서로 빈칸을 채우세요.', 'Fill the bounds with the minimum, then maximum of the expression over the given ranges.', '在给定范围内，按最小值、最大值的顺序填写界限。');
  cue('MD109@3', '연립부등식의 해가 없도록 하는 a의 범위를 완성하세요.', 'Complete the range of a for which the system has no solution.', '填写使不等式组无解的a的范围。');
  cue('MD108@2', '주어진 부등식을 만족하는 정수 x의 개수를 구하세요.', 'Count the integers x satisfying the given inequality.', '求满足所给不等式的整数x的个数。');
  cue('MD115@1 MD115@3', 'G는 삼각형 ABC의 무게중심입니다. 표시된 빈칸을 채우세요.', 'G is the centroid of triangle ABC. Fill the shown blank.', 'G是三角形ABC的重心。填写所示空格。');
  cue('MD116@3', 'd는 점 P와 직선 사이의 거리입니다. 표시된 부호 조건에 맞게 빈칸을 채우세요.', 'd is the distance from P to the line. Fill the blank subject to the shown sign condition.', 'd是点P到直线的距离。按所示符号条件填空。');
  cue('MD118@1', '주어진 원과 직선의 서로 다른 교점의 개수를 구하세요.', 'Count the distinct intersection points of the given circle and line.', '求所给圆与直线的不同交点的个数。');
  cue('MD119@2', '표시된 직선은 주어진 원의 접선입니다. 식에 표시된 부호 조건을 만족하는 n을 구하세요.', 'The indicated line is tangent to the given circle. Find n satisfying the sign condition shown.', '所示直线与所给圆相切。求满足所示符号条件的n。');
  cue('MD119@3', 'P에서 원에 그은 접선의 접점을 T라 하고 두 접선의 기울기를 m₁, m₂라 합니다. 표시된 빈칸을 채우세요.', 'T is a point of tangency of a tangent from P; m₁ and m₂ are the slopes of the two tangents from P. Fill the shown blank.', 'T是从P引圆的切线的切点，m₁、m₂是从P引出的两条切线的斜率。填写所示空格。');
  cue('MD120@1 MD120@3', '표시된 평행이동 관계의 빈칸을 왼쪽부터 채우세요. 이동량 a, b가 질문이면 (x,y)→(x+a,y+b)의 관계를 뜻합니다.', 'Fill the blanks in the shown translation relation from left to right. When asked, a and b denote the translation (x,y)→(x+a,y+b).', '按从左到右的顺序填写所示平移关系中的空格。若求a、b，它们表示平移(x,y)→(x+a,y+b)。');
  cue('MD121@1 MD121@2', '화살표의 순서와 기준에 따라 대칭이동한 관계의 빈칸을 채우세요. O는 원점, y=0은 x축, x=0은 y축입니다. 제시된 식의 형식과 고정된 계수를 그대로 사용하세요.', 'Reflect in the order and about the mirrors shown by the arrows, then fill the blanks. O is the origin, y=0 the x-axis and x=0 the y-axis. Keep the shown equation form and fixed coefficients.', '按箭头所示顺序和对称基准变换后填空。O是原点，y=0是x轴，x=0是y轴。保留所示方程形式和固定系数。');
  cue('MD128@1', '제시된 합성함수의 값을 구하세요.', 'Evaluate the shown composite function.', '求所示复合函数的值。');
  cue('MD128@2', '모든 정의되는 x에서 주어진 합성함수 관계를 만족하는 a, b를 순서대로 구하세요.', 'Enter a, then b, so the shown composite-function identity holds wherever it is defined.', '按a、b的顺序输入，使所示复合函数关系在所有有定义的x处成立。');
  cue('MD128@3', 'fⁿ은 f를 n번 합성한 함수입니다. 제시된 함수의 값을 구하세요.', 'fⁿ denotes f composed with itself n times. Evaluate the shown function.', 'fⁿ表示f自身复合n次。求所示函数的值。');
  cue('MD126@1 MD126@3', '변수는 제시된 범위를 만족하는 실수입니다. M은 최댓값, m은 최솟값입니다. 표시된 빈칸을 채우세요.', 'The variables are real and satisfy the shown domain. M is the maximum and m the minimum. Fill the shown blank.', '变量是满足所示范围的实数。M是最大值，m是最小值。填写所示空格。');
  cue('MD127@3', 'X와 Y는 제시된 실수 구간입니다. f:X→Y가 일대일대응이 되도록, 식에 표시된 a의 부호 조건을 만족하는 실수 a, b를 a, b 순서로 입력하세요.', 'X and Y are the shown real intervals. Enter real a, then b, so f:X→Y is a one-to-one correspondence satisfying the shown sign condition on a.', 'X和Y是所示的实数区间。求实数a、b，使f:X→Y为一一对应且满足所示a的符号条件，按a、b的顺序输入。');
  cue('MD130@1', '모든 정의되는 x에서 제시된 식의 관계가 성립하도록 계수 a, b를 순서대로 입력하세요.', 'Enter a, then b, so the shown identity holds wherever it is defined.', '按a、b的顺序输入系数，使所示等式在所有有定义的x处成立。');
  cue('MD129@3', '주어진 함수와 역함수의 관계를 만족하는 a, b를 순서대로 구하세요.', 'Find a, then b, satisfying the given function–inverse relation.', '按a、b的顺序求满足所给函数与反函数关系的数。');
  cue('MD131@1', '점근선 x=□, y=□의 값을 순서대로 구하세요.', 'Find the constants in the asymptotes x=□, then y=□.', '按顺序求渐近线x=□、y=□中的数。');
  cue('MD135@1', 'log는 밑이 10인 상용로그입니다. n은 정수이고 0≤α<1입니다. 제시된 n의 빈칸을 채우세요.', 'log denotes the base-ten logarithm. n is an integer and 0≤α<1. Fill the shown blank for n.', 'log表示以10为底的常用对数，n是整数且0≤α<1。填写所示n的空格。');
  cue('MD136@3', '제시된 세 수 가운데 가장 큰 수는 M, 가장 작은 수는 m입니다. 표시된 빈칸을 채우세요.', 'M is the largest and m the smallest of the three shown numbers. Fill the shown blank.', 'M是所示三个数中最大的数，m是最小的数。填写所示空格。');
  cue('MD137@1 MD137@2 MD139@1 MD139@2', '주어진 범위에서 함수의 최댓값 M, 최솟값 m을 순서대로 구하세요.', 'Find the maximum M, then minimum m of the function over the given range.', '在给定范围内，按最大值M、最小值m的顺序作答。');
  cue('MD141@1 MD141@2', '부채꼴에서 r은 반지름, θ는 중심각, l은 호의 길이, S는 넓이입니다. 도 기호가 없는 각은 라디안입니다. 표시된 빈칸을 채우세요.', 'For the sector, r is the radius, θ the central angle, l the arc length and S the area. Angles without a degree symbol are in radians. Fill the shown blank.', '扇形中r是半径，θ是圆心角，l是弧长，S是面积。没有度数符号的角以弧度表示。填写所示空格。');
  cue('MD144@1', '주어진 범위에서 방정식의 해의 개수 N을 구하세요.', 'Find N, the number of solutions of the equation in the given range.', '求方程在给定范围内的解的个数N。');
  cue('MD145@1', '삼각형 ABC에서 a=BC, b=CA, c=AB이고 S는 넓이입니다. 빈칸을 채우세요.', 'In triangle ABC, a=BC, b=CA, c=AB, and S is its area. Fill the blank.', '三角形ABC中a=BC，b=CA，c=AB，S是面积。填写空格。');
  cue('MD146@2', 'Sₙ은 수열의 첫 n개 항의 합입니다. 표시된 빈칸을 채우세요.', 'Sₙ is the sum of the first n terms of the sequence. Fill the shown blank.', 'Sₙ是数列前n项的和。填写所示空格。');
  cue('MD147@1', '등차수열이며 a₁은 첫째항, d는 공차, n은 자연수입니다. 조건에 맞게 빈칸을 채우세요.', 'The sequence is arithmetic; a₁ is its first term, d its common difference, and n a natural number. Complete the shown condition.', '数列是等差数列，a₁是首项，d是公差，n是自然数。按条件填空。');
  cue('MD40@1 MD40@3', '등차수열에서 a₁은 첫째항, d는 공차, Sₙ은 첫 n개 항의 합입니다. 표시된 빈칸을 채우세요.', 'For the arithmetic sequence, a₁ is the first term, d the common difference and Sₙ the sum of the first n terms. Fill the shown blank.', '等差数列中a₁是首项，d是公差，Sₙ是前n项的和。填写所示空格。');
  cue('MD41@1', '등비수열에서 a₁은 첫째항이고 r은 공비입니다. 표시된 항의 값을 구하세요.', 'For the geometric sequence, a₁ is the first term and r the common ratio. Find the indicated term.', '等比数列中a₁是首项，r是公比。求所示项的值。');
  cue('MD42@1 MD42@3', '제시된 합을 구하세요.', 'Evaluate the shown sum.', '求所示和的值。');
  cue('MD151@1 MD151@2', '모든 자연수 n에 대해 제시된 점화식이 성립하는 수열입니다. 표시된 항의 값을 구하세요.', 'The sequence satisfies the shown recurrence for every natural number n. Find the indicated term.', '数列对所有自然数n满足所示递推式。求所示项的值。');
  cue('MD150@1', '괄호 하나가 한 군이며 앞에서부터 제1군, 제2군, …입니다. 괄호를 떼어 순서대로 놓은 수열을 aₙ이라 합니다. 표시된 수 또는 항이 속한 군의 번호 g를 구하세요.', 'Each bracket is one group, numbered 1, 2, … from the front. Removing the brackets in order gives the sequence aₙ. Find the group number g containing the indicated number or term.', '每个括号是一个群，从前往后编号为第1群、第2群等。依次去掉括号得到数列aₙ。求所示数或项所在群的编号g。');
  cue('MD150@3', '괄호 하나가 한 군이며 앞에서부터 제1군, 제2군, …입니다. T_g는 제g군에 있는 수의 합입니다. 표시된 빈칸을 채우세요.', 'Each bracket is one group, numbered 1, 2, … from the front. T_g is the sum of the numbers in group g. Fill the shown blank.', '每个括号是一个群，从前往后编号为第1群、第2群等。T_g是第g群中各数的和。填写所示空格。');
  cue('MD149@2 MD149@3', '제시된 합 또는 조건을 만족하도록 빈칸을 채우세요.', 'Fill the blank to satisfy the shown sum or condition.', '填写空格使所示求和式或条件成立。');
  cue('MD152@2', '제시된 수열의 조건을 만족하는 빈칸의 값을 구하세요.', 'Find the value in the blank satisfying the given sequence conditions.', '求满足所给数列条件的空格中的数。');
  cue('MD153@3', '모든 자연수 n에 대해 등식이 성립하도록 빈칸을 채우세요.', 'Fill the blank so the identity holds for every natural number n.', '填写空格，使等式对每个自然数n都成立。');
  cue('MD153@1', 'n₀은 n≥n₀인 모든 자연수 n에서 주어진 부등식이 성립하는 가장 작은 자연수입니다. d는 모든 자연수 n에서 f(n)을 나누어떨어지게 하는 가장 큰 자연수입니다. 표시된 빈칸을 채우세요.', 'n₀ is the least natural number such that the given inequality holds for every natural n≥n₀. d is the greatest natural number dividing f(n) for every natural n. Fill the shown blank.', 'n₀是使所给不等式对所有自然数n≥n₀成立的最小自然数。d是对每个自然数n都能整除f(n)的最大自然数。填写所示空格。');
  cue('MD156@1', 'α<β입니다. ↗는 증가하는 구간, ↘는 감소하는 구간을 뜻합니다. 표시된 구간의 경계값 α, β로 빈칸의 값을 구하세요.', 'α<β. ↗ marks an increasing interval and ↘ a decreasing interval. Evaluate the blank using the indicated interval bounds α and β.', 'α<β。↗表示递增区间，↘表示递减区间。用所示区间的界限α、β求空格中的数。');
  cue('MD157@1', 'M은 주어진 닫힌구간에서 함수의 최댓값, m은 최솟값입니다. 표시된 빈칸을 채우세요.', 'M is the maximum and m the minimum of the function on the given closed interval. Fill the shown blank.', 'M是函数在给定闭区间上的最大值，m是最小值。填写所示空格。');
  cue('MD158@1', 'N은 주어진 방정식의 서로 다른 실근의 개수입니다. N을 구하세요.', 'N is the number of distinct real roots of the given equation. Find N.', 'N是所给方程不同实根的个数，求N。');
  function diagnosticNumberPrompt(ref, p) {
    const params = W.NM_THREADS[ref.t].levels.find(l => l.id === ref.lv).params || {};
    const key = ref.t + '@' + ref.lv;
    if (CURATED_CUES[key]) return clone(CURATED_CUES[key]);
    if (COMPLETE_REFS.has(key)) return clone(NEUTRAL_BLANK);
    if (key === 'MD105@2')
      return (p.prompt.ko || '').includes('가장 큰') ? text('x, y는 자연수입니다. 주어진 식을 만족하는 x+y의 최댓값을 구하세요.', 'x and y are natural numbers. Find the largest value of x+y satisfying the given equation.', 'x、y是自然数。求满足所给等式的x+y的最大值。') :
        text('x, y는 자연수입니다. 주어진 식을 만족하는 순서쌍 (x, y)의 개수를 구하세요.', 'x and y are natural numbers. Count the ordered pairs (x, y) satisfying the given equation.', 'x、y是自然数。求满足所给等式的有序数对(x、y)的个数。');
    if (key === 'MD110@1' && (p.prompt.ko || '').includes('순서쌍'))
      return text('x, y는 자연수입니다. 주어진 부등식을 만족하는 순서쌍 (x, y)의 개수를 구하세요.', 'x and y are natural numbers. Count the ordered pairs (x, y) satisfying the given inequality.', 'x、y是自然数。求满足所给不等式的有序数对(x、y)的个数。');
    if (key === 'MD111@1' && p.tex.includes('\\mathrm{P}'))
      return text('제시된 순열의 경우의 수를 구하세요.', 'Evaluate the shown number of permutations.', '求所示排列的个数。');
    if (key === 'MD130@2')
      return p.tex.includes('=\\dfrac{a}{b}') ? text('합을 분모가 양수인 기약분수 a/b로 나타내고 a, b 순서로 입력하세요.', 'Express the sum as a/b in lowest terms with b positive. Enter a, then b.', '把和写成分母为正的最简分数a/b，按a、b的顺序输入。') :
        text('모든 정의되는 x에서 제시된 식의 관계가 성립하도록 a, b를 순서대로 입력하세요.', 'Enter a, then b, so the shown identity holds wherever it is defined.', '按a、b的顺序输入，使所示等式在所有有定义的x处成立。');
    if (key === 'MD130@3')
      return (p.prompt.ko || '').includes('c≥2') ? text('a, b, c는 자연수이고 c≥2입니다. 제시된 조건에서 a+b+c를 구하세요.', 'a, b and c are natural numbers and c≥2. Find a+b+c under the shown condition.', 'a、b、c是自然数且c≥2。按所示条件求a+b+c。') : clone(NEUTRAL_BLANK);
    if (key === 'CH5@1') {
      const divisor = p.tex.match(/\\div\s*(9+)\s*=/);
      if (!divisor) fail('repeating-block divisor is not explicit');
      const width = divisor[1].length;
      return text('몫의 반복마디를 ' + width + '자리 블록으로 보고, 그 블록을 나타내는 수를 입력하세요. 맨 앞의 0은 생략해서 입력할 수 있습니다.', 'Treat the quotient’s repeating block as a ' + width + '-digit block and enter the number represented by that block. Leading zeros may be omitted.', '把商的循环节看作' + width + '位数字块，输入这个数字块表示的数，开头的0可以省略。');
    }
    if (key === 'CH5@4')
      return text('순환소수를 분수로 나타내세요. 분모는 제시된 반복마디의 자리 수와 같은 개수의 9로 이루어진 수로 쓰고, 약분하지 마세요.', 'Write the repeating decimal as a fraction whose denominator consists of as many 9s as there are digits in the shown repeating block. Do not simplify.', '把循环小数写成分数，分母由与所示循环节位数相同个数的9组成，不要约分。');
    if (key === 'MD57@1' || key === 'MD57@2' || key === 'MD57@3')
      return p.tex.includes('\\pi') && p.tex.includes('\\dfrac{\\square') ? text('주기의 π 계수를 기약분수로 나타내세요.', 'Express the coefficient of π in the period as a fraction in lowest terms.', '把周期中π的系数写成最简分数。') :
        text('함수의 최댓값, 최솟값 순서로 입력하세요.', 'Enter the maximum, then the minimum of the function.', '按最大值、最小值的顺序输入。');
    if (key === 'MD110@2' && (p.prompt.ko || '').includes('동류항'))
      return text('제시된 식을 전개했을 때 항의 개수를 구하세요.', 'Count the terms after expanding the shown expression.', '求所示式子展开后的项数。');
    if (key === 'MD110@3') {
      const question = p.prompt.ko || '';
      if (question.includes('총합')) return text('제시된 수의 양의 약수의 총합을 구하세요.', 'Find the sum of the positive divisors of the shown number.', '求所示数的正约数之和。');
      if (question.includes('짝수')) return text('제시된 수의 양의 약수 가운데 짝수의 개수를 구하세요.', 'Count the even positive divisors of the shown number.', '求所示数的正约数中偶数的个数。');
      return text('제시된 수의 양의 약수의 개수를 구하세요.', 'Count the positive divisors of the shown number.', '求所示数的正约数的个数。');
    }
    if (key === 'MD111@4') {
      if (/n=\\square/.test(p.tex)) return text('n은 자연수입니다. 표시된 조건을 만족하는 n을 구하세요.', 'n is a natural number. Find n satisfying the shown condition.', 'n是自然数。求满足所示条件的n。');
      if (/^\d+!\s*\\;\\Rightarrow/.test(p.tex)) return text('표시된 팩토리얼의 끝자리에서 연속되는 0의 개수를 구하세요.', 'Count the trailing zeros of the shown factorial.', '求所示阶乘末尾连续0的个数。');
      return clone(NEUTRAL_BLANK);
    }
    if (key === 'MD149@1')
      return /n=\\square/.test(p.tex) ? text('n은 자연수입니다. 주어진 합을 만족하는 n을 구하세요.', 'n is a natural number. Find n satisfying the given sum.', 'n是自然数。求满足所给求和条件的n。') :
        text('주어진 분모를 그대로 두고 합의 분자 빈칸을 채우세요.', 'Keep the shown denominator and fill in the numerator of the sum.', '保留所示分母，填写和的分子空格。');
    if (key === 'MD150@2') {
      const definition = text('괄호 하나가 한 군이며, 괄호를 떼어 순서대로 놓은 수열을 aₙ이라 합니다.', 'Each bracket is one group; removing the brackets in order gives the sequence aₙ.', '每个括号是一个群；依次去掉括号得到数列aₙ。');
      const target = /h=\\square/.test(p.tex) ? text('h는 그 수가 속한 군에서 앞에서부터 센 위치입니다. h를 구하세요.', 'h is the position of that number within its group, counted from the front. Find h.', 'h是该数在所在群中从前往后数的位置，求h。') :
        p.tex.includes('\\frac{\\square') || p.tex.includes('\\dfrac{\\square') ? text('주어진 분모를 그대로 두고 분자 빈칸을 채우세요.', 'Keep the shown denominator and fill the missing numerator.', '保留所示分母，填写空缺的分子。') :
        text('표시된 항의 값을 구하세요.', 'Find the value of the indicated term.', '求所示项的值。');
      return text(definition.ko + ' ' + target.ko, definition.en + ' ' + target.en, definition.zh + ' ' + target.zh);
    }
    if (key === 'MD159@2')
      return /x_0=\\square/.test(p.tex) ? text('x₀는 F(x)가 극대가 되는 x입니다. x₀를 구하세요.', 'x₀ is where F(x) has a local maximum. Find x₀.', 'x₀是F(x)取得极大值时的x。求x₀。') : clone(NEUTRAL_BLANK);
    if (ref.t === 'FR1')
      return text('제시된 분모를 그대로 두고 분자 빈칸을 채우세요.', 'Keep the shown denominator and fill in the missing numerator.', '保留所示分母，填写空缺的分子。');
    if (ref.t === 'FR2') {
      const mixedTarget = /=\s*\\square\\frac/.test(p.tex);
      return mixedTarget ? text('제시된 대분수의 자연수 부분 빈칸을 채우세요.', 'Fill in the missing whole-number part of the shown mixed number.', '填写所示带分数空缺的整数部分。') :
        text('제시된 가분수의 분자 빈칸을 채우세요.', 'Fill in the missing numerator of the shown improper fraction.', '填写所示假分数空缺的分子。');
    }
    if (ref.t === 'FR3')
      return text('제시된 대분수 형식에 맞게 빈칸을 채우세요.', 'Fill in the blanks in the shown mixed-number form.', '按所示带分数形式填写空格。');
    if (ref.t === 'FR5')
      return params.mode === 'common' ? text('두 분수를 제시된 공통분모에 맞게 통분하여 분자 빈칸을 채우세요.', 'Express both fractions using the shown common denominator and fill in the numerators.', '把两个分数通分到所示公分母，填写分子空格。') :
        text('제시된 분모에 맞게 약분하여 분자 빈칸을 채우세요.', 'Reduce the fraction to the shown denominator and fill in the numerator.', '把分数约分到所示分母，填写分子空格。');
    if (['FR6', 'FR7', 'FR8'].includes(ref.t))
      return text('계산 결과를 제시된 분수 또는 소수 형식에 맞게 나타내세요.', 'Express the result in the shown fraction or decimal form.', '按所示分数或小数形式表示结果。');
    // These rational-number generators require a reduced fraction, unlike
    // CH5's intentionally unreduced conversion. Keep that answer condition,
    // without their common-denominator, reciprocal, or repeating-decimal recipe.
    if (['MD3', 'MD7', 'MD9'].includes(ref.t) && p.answerShape === 'fraction')
      return text('계산 결과를 기약분수로 나타내세요.', 'Express the result as a fraction in lowest terms.', '把结果写成最简分数。');
    if (ref.t === 'MD9' && params.mode === 'digitAt')
      return text('제시된 순환소수의 소수점 아래 ' + p.digitIndex + '번째 자리 숫자를 구하세요.', 'Find digit number ' + p.digitIndex + ' after the decimal point of the shown repeating decimal.', '求所示循环小数小数点后第' + p.digitIndex + '位数字。');
    // These two DV6 modes already show the required arithmetic transformation;
    // ordinary DV6 asks for a constrained digit and must retain that condition.
    const arithmeticRule = ref.t === 'DV6' && ['rule7', 'rule11'].includes(params.mode);
    if (COMPLETE_ARITHMETIC.has(ref.t) || arithmeticRule)
      return clone(NEUTRAL_BLANK);
    const prompt = clone(p.prompt || text('빈칸의 값을 쓰세요.', 'Enter the missing value.', '填写空格的值。'));
    // Define acronyms in concept notes, not in learner-facing test questions.
    if (prompt.en) prompt.en = prompt.en.replace(/\bGCD\b/g, 'greatest common divisor').replace(/\bLCM\b/g, 'least common multiple');
    return prompt;
  }
  /* 유아 → 과정 1 경계 문항: 과정 1 첫 회차의 10 이하 계산만(2026-10-05 과정 1 재편성 — 보수 10·세 수 연이은 덧뺄). */
  const TRANSITION = { NS3: [1, 2], AD10: [1], NS2: [1], AD1: [1], SB1: [1] };
  const TRANSITION_OK = (t, lv) => !!(TRANSITION[t] && TRANSITION[t].includes(lv));
  function numberQuestion(ref, p, transition) {
    if (!numberSafe(p)) return null;
    // The next sample after C0 is still a small-number arithmetic sample, not 3-digit place value.
    if (transition) {
      if (!TRANSITION_OK(ref.t, ref.lv)) return null;
      const numbers = (p.tex.match(/\d+(?:\.\d+)?/g) || []).map(Number);
      if (numbers.some(x => x > 10) || (Array.isArray(p.answer) ? p.answer : [p.answer]).some(x => x < 0 || x > 10)) return null;
    }
    // Show the source's final response template, not worked intermediate answers.
    // In FR4 the requested scalar is the common-denominator numerator; its final
    // fraction template is essential, whereas an unrelated LCM blank is not asked.
    const targets = (p.steps || []).concat(p.solution || []).filter(s =>
      s && typeof s.tex === 'string' && s.tex.includes('\\square') && canonical(s.blank) === canonical(p.answer));
    const count = Array.isArray(p.answer) ? p.answer.length : 1;
    const target = targets[targets.length - 1];
    const squareCount = (p.tex.match(/\\square/g) || []).length;
    const needsTemplate = squareCount === 0 || p.answerShape === 'fraction' && squareCount < count;
    // If the question itself specifies the blanks, do not append a worked
    // solution. FR4@3's worked step even spells out its missing denominator.
    // In source templates the left side may be a worked conversion/result.
    // Keep only the blank answer format: showing the converted numerators or
    // an already-computed rational value would disclose diagnostic answers.
    let responseTex = target && target.tex;
    if (responseTex && responseTex.includes('=')) {
      const right = responseTex.slice(responseTex.lastIndexOf('=') + 1).trim();
      // An x=blank,y=blank template must not lose its first input or its names.
      // Strip a worked left side only when every answer blank is on the RHS.
      if ((right.match(/\\square/g) || []).length === (responseTex.match(/\\square/g) || []).length)
        responseTex = right;
    }
    const steps = needsTemplate && target ? [{ tex: responseTex }] : [];
    if (ref.t === 'FR4' && !Array.isArray(p.answer) && needsTemplate && !target) return null;
    let prompt = diagnosticNumberPrompt(ref, p);
    if (p.answerShape === 'mixed') {
      prompt = text(prompt.ko + ' 자연수 부분, 분자, 분모 순서로 입력해요.', prompt.en + ' Enter the whole part, numerator, then denominator.', prompt.zh + ' 按整数部分、分子、分母的顺序输入。');
    } else if (p.answerShape === 'fraction') {
      prompt = text(prompt.ko + ' 분자, 분모 순서로 입력해요.', prompt.en + ' Enter the numerator, then denominator.', prompt.zh + ' 按分子、分母的顺序输入。');
    } else if (ref.t === 'FR4' && count === 1) {
      const params = W.NM_THREADS[ref.t].levels.find(l => l.id === ref.lv).params || {};
      if (params.mode === 'split' || params.mode === 'chain')
        prompt = text(prompt.ko + ' 정답 줄의 분모 빈칸만 입력해요.', prompt.en + ' Enter only the missing denominator in the answer line.', prompt.zh + ' 只填写答案行空缺的分母。');
      else if (params.mixed)
        prompt = text(prompt.ko + ' 자연수 정답의 빈칸을 입력해요.', prompt.en + ' Enter the missing whole-number answer.', prompt.zh + ' 填写空缺的整数答案。');
      else
        prompt = text(prompt.ko + ' 주어진 분모를 그대로 두고 분자 빈칸만 입력해요.', prompt.en + ' Keep the given denominator and enter only the missing numerator.', prompt.zh + ' 保留给定的分母，只填写空缺的分子。');
    } else if (/^DV/.test(ref.t) && count === 2 && p.tex.includes('\\cdots')) {
      prompt = text(prompt.ko + ' 몫, 나머지 순서로 입력해요.', prompt.en + ' Enter the quotient, then the remainder.', prompt.zh + ' 按商、余数的顺序输入。');
    } else if (count > 1) {
      prompt = text(prompt.ko + ' 답 ' + count + '개를 제시된 순서대로 입력해요.', prompt.en + ' Enter the ' + count + ' answers in the shown order.', prompt.zh + ' 按显示的顺序输入' + count + '个答案。');
    }
    return { domain: domainFor(ref.t), responseMode: 'number', prompt, answer: clone(p.answer),
      renderData: { tex: p.tex, steps, answerType: p.answerType || 'number', answerCount: count } };
  }
  function canonical(value) {
    if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
    if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
    return JSON.stringify(value);
  }
  function fingerprint(q) {
    // No thread id: NL4/NL7 equivalent visible questions are de-duplicated together.
    return canonical({ mode: q.responseMode, data: q.renderData });
  }
  function build(baselineId, seed) {
    const list = allStages(), at = list.findIndex(s => s.id === baselineId);
    if (at < 0) fail('unknown or unsupported baseline ' + baselineId);
    const baseline = list[at], seedText = seed == null ? '0' : String(seed), items = [], seen = new Set();
    const bands = [ ['previous', at ? list[at - 1] : baseline], ['current', baseline], ['next', list[at + 1] || baseline] ];
    for (const [band, stage] of bands) {
      const transition = baseline.id === 'f-ten10' && band === 'next' && stage.kind === 'course';
      const refs = transition ? stage.refs.filter(r => TRANSITION_OK(r.t, r.lv)) : stage.refs;
      if (!refs.length) fail('no supported source refs for ' + stage.id + ' / ' + band);
      let accepted = 0;
      for (let attempt = 0; attempt < 8192 && accepted < BAND_COUNTS[band]; attempt++) {
        const ref = refs[attempt % refs.length], p = source(ref, seedText + '|' + baseline.id + '|' + band + '|' + attempt);
        const q = stage.kind === 'foundation' ? foundation(stage, ref, p, at === 0 && band === 'previous', attempt) : numberQuestion(ref, p, transition);
        if (!q) continue;
        const fp = fingerprint(q);
        if (seen.has(fp)) continue;
        seen.add(fp);
        let label = clone(stage.label);
        if (at === 0 && band === 'previous') label = text(label.ko + ' · 시작 경계: 같은 기초의 더 작은 수', label.en + ' · starting boundary: smaller quantities in the same foundation', label.zh + ' · 起点边界：相同基础中的较小数量');
        if (at === list.length - 1 && band === 'next') label = text(label.ko + ' · 다음 범위 없음: 같은 과정 추가 확인', label.en + ' · no next range: additional checks in the same course', label.zh + ' · 无下一范围：在同一课程继续确认');
        items.push({ id: baseline.id + ':' + band + ':' + (accepted + 1), band, stageId: stage.id, domain: q.domain, label,
          course: stage.course, session: ref.session || stage.session, thread: ref.t, level: ref.lv, responseMode: q.responseMode,
          renderData: q.renderData, prompt: q.prompt, answer: q.answer, fingerprint: fp });
        accepted++;
      }
      if (accepted !== BAND_COUNTS[band]) fail('insufficient unique supported items for ' + stage.id + ' / ' + band + ' (' + accepted + '/' + BAND_COUNTS[band] + ')');
    }
    return { baseline: clone(baseline), counts: clone(BAND_COUNTS), items, seed: seedText,
      boundaries: { previous: at === 0 ? 'same-foundation-smaller' : null, next: at === list.length - 1 ? 'same-course' : null } };
  }
  function normalize(value, array) {
    if (Array.isArray(value)) return array && value.length && value.every(x => normalize(x, false) !== null) ? value.map(x => normalize(x, false)) : null;
    if (typeof value === 'number') return Number.isFinite(value) && !array ? value : null;
    if (typeof value !== 'string') return null;
    const s = value.trim().replace(/[−﹣－]/g, '-').replace(/[０-９]/g, c => String(c.charCodeAt(0) - 0xFF10)).replace(/．/g, '.');
    if (array) {
      const parts = s.replace(/^\[|\]$/g, '').split(/[,，;；\s]+/).filter(Boolean);
      return parts.length ? normalize(parts, true) : null;
    }
    if (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(s)) return null;
    const n = Number(s); return Number.isFinite(n) ? n : null;
  }
  function equal(value, answer) {
    const n = normalize(value, Array.isArray(answer));
    if (n === null) return false;
    if (Array.isArray(answer)) return n.length === answer.length && n.every((x, i) => Math.abs(x - answer[i]) < 1e-9);
    return Math.abs(n - answer) < 1e-9;
  }
  function selectionValid(item, response) {
    if (item.responseMode !== 'count-tap') return true;
    return !!(response.validationFlags && response.validationFlags.validTargets === true);
  }
  function recommendation(plan, profile) {
    const baseline = plan.baseline, confirmed = profile.filter(x => !x.skipped);
    const addTopic = (rec, stage, items) => {
      const practiceSessions = [], refs = items ? items.map(item => ({ course: item.course, session: item.session, t: item.thread, lv: item.level })) :
        stage.refs.map(ref => ({ course: stage.course, session: ref.session || stage.session, t: ref.t, lv: ref.lv }));
      refs.forEach(ref => { if (!practiceSessions.some(r => canonical(r) === canonical(ref))) practiceSessions.push(ref); });
      return Object.assign(rec, { stageId: stage.id, label: clone(stage.label), practiceSessions });
    };
    if (baseline.kind === 'foundation' && !profile.some(x => x.ok === true)) {
      return addTopic({ course: 'C0', session: 1, threads: [{ t: 'NL1', lv: 1 }], reason: confirmed.length ? '기초 확인 문항에서 정답이 확인되지 않았어요. 수 세기부터 함께 확인해요. 회차 번호는 능력 순서가 아닙니다.' : '아직 정답 근거가 없어요. 수 세기부터 함께 확인해요. 회차 번호는 능력 순서가 아닙니다.' }, allStages()[0]);
    }
    const candidates = profile.filter(x => x.band !== 'next' && !x.skipped && x.ok === false);
    if (!candidates.length) return addTopic({ course: baseline.course, session: baseline.kind === 'foundation' ? 1 : baseline.session,
      threads: baseline.refs.map(r => ({ t: r.t, lv: r.lv })), reason: '이전·현재 확인에서 다른 보강 주제가 필요한 오답 근거가 없어 선택한 주제를 유지해요. 다음 4문항만으로 진도를 확정하지 않아요. 유아 회차 번호는 능력 순서가 아닙니다.' }, baseline);
    if (baseline.kind === 'foundation') {
      // C0 sessions spiral through topics; session 17 is not a higher ability
      // than session 3. Choose the earliest tested foundation TOPIC, and record
      // its real activity locations separately without advancing course progress.
      const foundations = allStages().filter(stage => stage.kind === 'foundation');
      const selected = foundations.find(stage => candidates.some(p => p.stageId === stage.id));
      if (!selected) fail('foundation recommendation has no source stage');
      const misses = candidates.filter(p => p.stageId === selected.id).map(p => plan.items.find(item => item.id === p.id));
      const threads = [];
      misses.forEach(item => { if (!threads.some(r => r.t === item.thread && r.lv === item.level)) threads.push({ t: item.thread, lv: item.level }); });
      return addTopic({ course: 'C0', session: 1, threads,
        reason: '이전·현재 문항에서 연습이 필요한 가장 이른 기초 주제를 권해요. 실제 보강 활동 위치는 별도로 표시하며, 회차 번호를 능력 순위나 진도 승급으로 해석하지 않습니다.' }, selected, misses);
    }
    const order = new Map(W.NM_COURSE_SPEC.map((s, i) => ['C' + s.id, i]));
    const misses = candidates.map(p => ({ p, item: plan.items.find(x => x.id === p.id) }));
    misses.sort((a, b) => (order.get(a.item.course) - order.get(b.item.course)) || a.item.session - b.item.session);
    const first = misses[0].item, threads = [];
    misses.filter(x => x.item.course === first.course && x.item.session === first.session).forEach(x => {
      if (!threads.some(r => r.t === x.item.thread && r.lv === x.item.level)) threads.push({ t: x.item.thread, lv: x.item.level });
    });
    return addTopic({ course: first.course, session: first.session, threads, reason: '이전·현재 문항에서 확인한 연습 필요 영역 중 실제로 가장 이른 학습 회차를 권해요. 미검사 영역의 숙달이나 입학 합격을 뜻하지 않아요.' },
      allStages().find(stage => stage.id === first.stageId), misses.filter(x => x.item.course === first.course && x.item.session === first.session).map(x => x.item));
  }
  function summarize(plan, responses) {
    dependencies();
    if (!plan || !plan.baseline || !Array.isArray(plan.items) || plan.items.length !== 20 || new Set(plan.items.map(x => x.id)).size !== 20) fail('invalid fixed 20-item plan');
    const submitted = new Map();
    (responses || []).forEach(r => { if (r && typeof r.id === 'string' && !submitted.has(r.id)) submitted.set(r.id, r); });
    const bands = {}, domains = {}, profile = [];
    Object.keys(BAND_COUNTS).forEach(b => { bands[b] = { correct: 0, asked: 0, skipped: 0 }; });
    let correct = 0;
    plan.items.forEach(item => {
      const r = submitted.get(item.id), skipped = !r || r.skipped === true;
      const ok = skipped ? null : equal(r.value, item.answer) && selectionValid(item, r);
      const sec = r && typeof r.sec === 'number' && Number.isFinite(r.sec) && r.sec >= 0 ? r.sec : null;
      const domainLabel = DOMAINS[item.domain] || (W.NM_THREADS[item.thread] && W.NM_THREADS[item.thread].name) || text(item.domain, item.domain, item.domain);
      if (!domains[item.domain]) domains[item.domain] = { label: clone(domainLabel), correct: 0, asked: 0, skipped: 0 };
      const b = bands[item.band], d = domains[item.domain];
      if (!b) fail('invalid band');
      b.asked++; d.asked++;
      if (skipped) { b.skipped++; d.skipped++; }
      if (ok) { correct++; b.correct++; d.correct++; }
      profile.push({ id: item.id, t: item.thread, lv: item.level, ok, skipped, sec, domain: item.domain, band: item.band, stageId: item.stageId });
    });
    return { correct, asked: 20, bands, domains, profile, recommendation: recommendation(plan, profile) };
  }
  W.NM_PLACEMENT_PLAN = { stages, build, summarize };
  if (typeof module !== 'undefined' && module.exports) module.exports = W.NM_PLACEMENT_PLAN;
})();
