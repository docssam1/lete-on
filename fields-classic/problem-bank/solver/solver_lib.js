// ============================================================
// GFIELD 모의고사 문제은행 - Solver Library v1
// 20유형 파라미터 생성 + Solver + Validator
// ============================================================

const R = (min,max) => Math.floor(Math.random()*(max-min+1))+min;
const shuffle = arr => [...arr].sort(()=>Math.random()-.5);
const unique = arr => [...new Set(arr)];

// q1 stacking_front_back_count
function gen_q1(difficulty=1) {
  const cols = difficulty<=2 ? 2 : 3;
  const rows = difficulty<=1 ? 2 : 3;
  const maxH = difficulty<=1 ? 2 : 3;
  const grid = Array.from({length:rows}, ()=>Array.from({length:cols},()=>R(0,maxH)));
  const frontVisible = Array.from({length:cols},(_,c)=>Math.max(...grid.map(r=>r[c]))).reduce((a,b)=>a+b,0);
  const total = grid.flat().reduce((a,b)=>a+b,0);
  const rearHidden = total - frontVisible;
  return { type:'stacking_front_back_count', difficulty, params:{grid, cols, rows}, answer: total,
    hint:`앞에서 보이는 블록(${frontVisible}) + 뒤에만 있는 블록(${rearHidden}) = ${total}` };
}

// q3 주고받기(같게)
function gen_q3(difficulty=1) {
  const diff = R(2,6)*2;
  const base = R(3,10);
  const A = base + diff, B = base, give = diff/2;
  const names = shuffle(['유비','유준','민지','지수','수아','태오']).slice(0,2);
  return { type:'give_to_equal', difficulty, params:{nameA:names[0], nameB:names[1], countA:A, countB:B},
    answer: give, hint:`(${A}-${B})÷2=${give}` };
}

// q5 주고받기(더 많이)
function gen_q5(difficulty=1) {
  const give = R(1,5);
  const moreThan = R(2,8)*2;
  const B_init = R(3,10);
  const A_init = B_init + moreThan + give*2;
  const names = shuffle(['유비','유준','민지','지수','수아','태오','현준','서연']).slice(0,2);
  return { type:'give_more', difficulty, params:{nameA:names[0], nameB:names[1], countA:A_init, countB:B_init, give, moreThan},
    answer: A_init - give,
    hint:`${names[0]}가 ${names[1]}에게 ${give}개 주면 ${names[0]}는 ${A_init-give}개, ${names[1]}는 ${B_init+give}개 → 차이 ${moreThan}개` };
}

// q10/q13 도형이 나타내는 수 (2개 미지수)
function gen_q10(difficulty=1) {
  const circle = R(2,9);
  const triangle = R(2,9);
  const eq1 = circle*2;
  const eq2 = triangle+circle;
  const shapes = ['○','△','□','☆'];
  return { type:'shape_equation_2', difficulty,
    params:{ shapeA:shapes[0], shapeB:shapes[1],
      eq1:{left:[shapes[0],shapes[0]], right:eq1}, eq2:{left:[shapes[1],shapes[0]], right:eq2} },
    answer: triangle, hint:`${shapes[0]}=${circle}, ${shapes[1]}=${triangle}` };
}

// q14 마방진 (3×3, 합=target)
function gen_q14(difficulty=1) {
  const base = [ [[2,7,6],[9,5,1],[4,3,8]], [[2,9,4],[7,5,3],[6,1,8]] ];
  const offset = R(0, difficulty<=1?3:6);
  const pattern = base[R(0,base.length-1)].map(row=>row.map(v=>v+offset));
  const target = 15 + offset*3;
  const ri=R(0,2), ci=R(0,2);
  const answer = pattern[ri][ci];
  const display = pattern.map((row,r)=>row.map((v,c)=>r===ri&&c===ci?'△':v));
  return { type:'magic_square', difficulty, params:{grid:display, target}, answer,
    hint:`각 행·열·대각선 합=${target}` };
}

// q16 수 피라미드 (두 번 모으기)
function gen_q16(difficulty=1) {
  const a=R(1,4), b=R(1,4), c=R(1,4);
  const ab=a+b, bc=b+c, top=ab+bc;
  const answer = b;
  return { type:'number_pyramid', difficulty, params:{bottom:[a,'△',c], mid:[ab,bc], top},
    answer, hint:`△+${a}=${ab} → △=${b}` };
}

// q20 복면산
function gen_q20(difficulty=1) {
  const a=R(1,9), b=R(0,9), c=R(1,9), d=R(0,9);
  const sum = (a*10+b)+(c*10+d);
  return { type:'masked_addition', difficulty,
    params:{ numA:[a,b], numB:[c,d], sum, masks:['□','○'], maskPos:[{num:0,digit:0},{num:0,digit:1}] },
    answer:[a,b], answerText:`□=${a}, ○=${b}`, hint:`□○ + ${c}${d} = ${sum} → □=${a}, ○=${b}` };
}

// q22 도형 증가 규칙
function gen_q22(difficulty=1) {
  const useSquare = Math.random()>.5;
  const n = R(4,7);
  const answer = useSquare ? n*n : n*(n+1)/2;
  const examples = [1,2,3].map(i=>useSquare?i*i:i*(i+1)/2);
  return { type:'shape_count_rule', difficulty, params:{rule: useSquare?'square':'triangle_number', n, examples},
    answer, hint:useSquare?`n번째: n²=${n}²=${answer}`:`n번째: n(n+1)/2=${n}×${n+1}/2=${answer}` };
}

// q24 도형이 나타낸 수 (3개 미지수)
function gen_q24() {
  const o=R(2,8), t=R(2,8), s=R(2,8);
  return { type:'shape_equation_3',
    params:{ shapes:['○','△','□'],
      eqs:[ {left:['○','△','□'], right:o+t+s}, {left:['○','△'], right:o+t}, {left:['△','□'], right:t+s} ] },
    answer:s, hint:`□=${s}` };
}

// q30 과녁 점수 경우의 수
function gen_q30(difficulty=1) {
  const shots = difficulty<=1 ? 3 : 4;
  const zones = difficulty<=1 ? [1,2,3,4] : [1,2,3,4,5];
  const target = R(shots*zones[0], shots*zones[zones.length-1]);
  const { combos } = (() => {
    const results = [];
    const find = (rem, minZ, current) => {
      if(rem===0){results.push([...current]);return;}
      for(const z of zones.filter(z=>z>=minZ)){ if(z<=rem) find(rem-z, z, [...current,z]); }
    };
    find(target, zones[0], []);
    return {combos: results};
  })();
  if(combos.length===0 || combos.length>8) return gen_q30(difficulty);
  return { type:'target_score_cases', difficulty, params:{shots, zones, target},
    answer: combos.length, hint:`경우: ${combos.map(c=>c.join('+')).join(' / ')}`, cases: combos };
}

// q51 시계 종소리 개수
function gen_q51(difficulty=1) {
  const start = R(1,6);
  const end = R(start+1, start+4 <= 12 ? start+4 : 12);
  let total = 0;
  for(let h=start+1; h<=end; h++){ total += h; if(h<end) total += 1; }
  return { type:'clock_bell_count', difficulty, params:{startHour:start, endHour:end}, answer: total,
    hint:`${start}시 이후~${end}시: ${Array.from({length:end-start},(_,i)=>start+i+1).join('+')} + 30분 ${end-start-1}번 = ${total}` };
}

// q2 조건에 따른 수 구하기
function gen_q2(difficulty=1) {
  const center = R(5, difficulty<=1?12:20);
  const gap = R(1, difficulty<=1?3:5);
  const lo = center - gap, hi = center + gap;
  const conds = difficulty<=1 ? [`${lo}보다 크고 ${hi}보다 작아요`] : [`${lo}보다 커요`, `${hi}보다 작아요`, `홀수예요`];
  const valid = [];
  for(let n=lo+1; n<hi; n++) { if(difficulty<=1) { valid.push(n); continue; } if(n%2===1) valid.push(n); }
  if(valid.length===0 || valid.length>5) return gen_q2(difficulty);
  const answer = valid[R(0,valid.length-1)];
  return { type:'conditional_number', difficulty, params:{conditions:conds, valid}, answer,
    hint:`${conds.join(', ')} → ${valid.join(', ')} 중 하나` };
}

// q6 수열 규칙 (두 패턴 교대)
function gen_q6(difficulty=1) {
  const fixVal = R(1,5);
  const start = R(2,6), step = R(1,3);
  const len = difficulty<=1 ? 6 : 8;
  const seq = [];
  let bVal = start;
  for(let i=0; i<len; i++) { if(i%2===0) seq.push(fixVal); else { seq.push(bVal); bVal+=step; } }
  const answerIdx = len;
  const answer = answerIdx%2===0 ? fixVal : bVal;
  seq.push('□');
  return { type:'sequence_dual', difficulty, params:{sequence:seq.slice(0,-1), targetIdx:answerIdx}, answer,
    hint:`홀수 번째: ${fixVal} 고정 / 짝수 번째: ${start},${start+step},${start+step*2}... (+${step}씩)` };
}

// q7 집합·포함 관계
function gen_q7(difficulty=1) {
  const total = R(15, difficulty<=1?25:35);
  const both = R(2,6);
  const onlyA = R(3,8), onlyB = R(3,8);
  const A = onlyA + both, B = onlyB + both;
  const neither = total - A - B + both;
  if(neither<0) return gen_q7(difficulty);
  const names = shuffle(['수학','과학','미술','음악','체육','영어']).slice(0,2);
  return { type:'venn_diagram', difficulty,
    params:{total, A, B, both, onlyA, onlyB, neither, nameA:names[0], nameB:names[1]},
    answer: onlyA, hint:`A만=${A}-${both}=${onlyA}` };
}

// q12 도형 패턴 (기호 규칙)
function gen_q12(difficulty=1) {
  const symbols = ['□','○','△','☆','◇'];
  const periodLen = difficulty<=1 ? R(2,3) : R(3,4);
  const pattern = shuffle(symbols).slice(0,periodLen);
  const seqLen = R(7,10);
  const seq = Array.from({length:seqLen},(_,i)=>pattern[i%periodLen]);
  const targetIdx = seqLen;
  const answer = pattern[targetIdx%periodLen];
  const blankIdx = R(Math.floor(seqLen/2), seqLen-1);
  const display = [...seq];
  const midAnswer = display[blankIdx];
  display[blankIdx] = '□';
  return { type:'symbol_pattern', difficulty, params:{pattern, display, blankIdx}, answer: midAnswer,
    hint:`${pattern.join('→')} 패턴이 반복 → ${blankIdx+1}번째=${midAnswer}` };
}

// q15 타고 내린 승객 수
function gen_q15(difficulty=1) {
  const stops = difficulty<=1 ? 3 : 4;
  let current = R(5,15);
  const initial = current;
  const events = [];
  for(let i=0; i<stops; i++) {
    const off = R(1, Math.min(current-1, 5));
    const on  = R(1,6);
    events.push({stop:i+1, off, on});
    current = current - off + on;
  }
  return { type:'passengers', difficulty, params:{initial, events}, answer: current,
    hint:`${initial}명 출발 → ${events.map(e=>`(${e.off}명 내리고 ${e.on}명 탑승)`).join(' → ')} = ${current}명` };
}

// q17 숫자 배치 (이웃 금지 조건)
function gen_q17(difficulty=1) {
  const n = difficulty<=1 ? 3 : 4;
  function isValid(arr) { for(let i=0;i<arr.length-1;i++) if(Math.abs(arr[i]-arr[i+1])===1) return false; return true; }
  const validN3=[[1,3,2],[2,3,1],[3,1,2],[2,1,3]].filter(isValid);
  const validN4=[];
  for(let a=1;a<=4;a++) for(let b=1;b<=4;b++) for(let c=1;c<=4;c++) for(let d=1;d<=4;d++) {
    if(new Set([a,b,c,d]).size===4 && isValid([a,b,c,d])) validN4.push([a,b,c,d]);
  }
  const valid = n===3 ? validN3 : validN4;
  if(valid.length===0) return {type:'number_placement',difficulty,params:{n,display:[1,3,2],blankIdx:0},answer:1,hint:'□=1'};
  const answer = valid[R(0,valid.length-1)];
  const blankIdx = R(0,n-1);
  const display = [...answer];
  const blankAns = display[blankIdx];
  display[blankIdx] = '□';
  return { type:'number_placement', difficulty, params:{n, display, blankIdx}, answer: blankAns,
    hint:`이웃한 수의 차가 1이 되면 안됨 → □=${blankAns}` };
}

// q18 조건에 맞는 두 자리 수
function gen_q18(difficulty=1) {
  const digitSum = R(5, difficulty<=1?9:13);
  const valid = [];
  for(let tens=1;tens<=9;tens++) { const ones = digitSum - tens; if(ones>=0&&ones<=9&&tens>ones) valid.push(tens*10+ones); }
  if(valid.length===0) return gen_q18(difficulty);
  const answer = valid[R(0,valid.length-1)];
  return { type:'two_digit_condition', difficulty, params:{digitSum, condition:'십의 자리 > 일의 자리', valid}, answer,
    hint:`각 자리 합=${digitSum}, 십>일 → 가능한 수: ${valid.join(', ')}` };
}

// q21 수 배열 규칙 (화살표 방향)
function gen_q21(difficulty=1) {
  const rowStep = R(2,5), colStep = R(2,5);
  const rows = difficulty<=1 ? 2 : 3;
  const cols = difficulty<=1 ? 3 : 4;
  const start = R(1,10);
  const grid = Array.from({length:rows},(_,r)=>Array.from({length:cols},(_,c)=>start+r*rowStep+c*colStep));
  const br=R(0,rows-1), bc=R(0,cols-1);
  const answer = grid[br][bc];
  const display = grid.map(row=>[...row]);
  display[br][bc]='□';
  return { type:'grid_arrow_rule', difficulty, params:{grid:display, rowStep, colStep, start, rows, cols}, answer,
    hint:`→ +${colStep}, ↓ +${rowStep} 규칙 → □=${answer}` };
}

// q23 바둑돌 규칙 (홀짝 교대)
function gen_q23(difficulty=1) {
  const len = R(difficulty<=1?6:8, difficulty<=1?12:16);
  const colors = ['흰','검'];
  const seq = Array.from({length:len},(_,i)=>colors[i%2]);
  const targetN = len+1;
  const answer = colors[targetN%2===1?0:1];
  const whiteCount = seq.filter(s=>s==='흰').length;
  const blackCount = seq.filter(s=>s==='검').length;
  return { type:'parity_stones', difficulty, params:{len, seq, targetN, whiteCount, blackCount}, answer,
    hint:`흰검 교대 → ${targetN}번째=${answer}바둑돌` };
}

// ===== Export =====
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    gen_q1, gen_q2, gen_q3, gen_q5, gen_q6, gen_q7, gen_q10, gen_q12,
    gen_q14, gen_q15, gen_q16, gen_q17, gen_q18, gen_q20, gen_q21,
    gen_q22, gen_q23, gen_q24, gen_q30, gen_q51
  };
}
