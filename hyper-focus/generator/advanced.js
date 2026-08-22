(function (global) {
  "use strict";

  function makeRng(seed) {
    let state = (Number(seed) >>> 0) || 1;
    return {
      next() {
        state += 0x6D2B79F5;
        let value = state;
        value = Math.imul(value ^ value >>> 15, value | 1);
        value ^= value + Math.imul(value ^ value >>> 7, value | 61);
        return ((value ^ value >>> 14) >>> 0) / 4294967296;
      },
      int(min, max) { return min + Math.floor(this.next() * (max - min + 1)); },
      pick(values) { return values[this.int(0, values.length - 1)]; }
    };
  }

  function shuffle(values, rng) {
    const copy = values.slice();
    for (let index = copy.length - 1; index > 0; index -= 1) {
      const other = rng.int(0, index);
      [copy[index], copy[other]] = [copy[other], copy[index]];
    }
    return copy;
  }

  const Q28_SPEC = {
    easy: { circleCount: 2, target: [30, 55] },
    same: { circleCount: 3, target: [70, 110] },
    hard: { circleCount: 3, target: [110, 180] }
  };
  function generateQ28(difficulty, seed) {
    const spec = Q28_SPEC[difficulty] || Q28_SPEC.same, rng = makeRng(seed);
    if (spec.circleCount === 2) {
      const target = rng.int(spec.target[0], spec.target[1]), overlap = rng.int(4, Math.floor(target / 3));
      return { circleCount: 2, target, overlap, leftOnly: target - overlap, rightOnly: target - overlap, answer: target - overlap, difficulty, seed: Number(seed) || 1 };
    }
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const target = rng.int(spec.target[0], spec.target[1]), leftOnly = rng.int(18, Math.floor(target / 2)), topLeft = rng.int(4, 14), topRight = rng.int(3, 13), rightOnly = leftOnly + topLeft - topRight;
      const remaining = target - leftOnly - topLeft;
      if (rightOnly < 10 || remaining < 12) continue;
      const triple = rng.int(3, remaining - 5), bottom = remaining - triple, topOnly = target - topLeft - topRight - triple;
      if (bottom < 3 || topOnly < 3) continue;
      return { circleCount: 3, target, leftOnly, rightOnly, topLeft, topRight, triple, bottom, topOnly, answer: topOnly + triple, difficulty, seed: Number(seed) || 1 };
    }
    throw new Error(`q28 ${difficulty} 생성 실패`);
  }
  function enumerateQ28AnswerCandidates(payload) {
    if (!payload) return [];
    if (payload.circleCount === 2) return [payload.target - payload.overlap];
    const remaining = payload.target - payload.leftOnly - payload.topLeft, answers = new Set();
    for (let triple = 0; triple <= remaining; triple += 1) {
      const bottom = remaining - triple, topRight = payload.target - payload.rightOnly - triple - bottom, topOnly = payload.target - payload.topLeft - topRight - triple;
      if (topRight < 0 || topOnly < 0) continue;
      answers.add(topOnly + triple);
    }
    return [...answers].sort((a,b) => a-b);
  }
  function validateQ28(payload) {
    const spec = Q28_SPEC[payload && payload.difficulty], candidates = enumerateQ28AnswerCandidates(payload);
    if (!spec || payload.circleCount !== spec.circleCount || candidates.length !== 1 || candidates[0] !== payload.answer) return false;
    if (payload.circleCount === 2) return payload.leftOnly + payload.overlap === payload.target && payload.rightOnly + payload.overlap === payload.target;
    return payload.leftOnly + payload.topLeft + payload.triple + payload.bottom === payload.target
      && payload.rightOnly + payload.topRight + payload.triple + payload.bottom === payload.target
      && payload.topOnly + payload.topLeft + payload.topRight + payload.triple === payload.target;
  }
  function deriveQ28Answer(payload) { return payload.answer; }
  function renderQ28Problem(payload) {
    if (payload.circleCount === 2) return `<svg class="hf-advanced hf-venn" viewBox="0 0 680 280" role="img" aria-label="두 원의 합 맞추기"><rect width="680" height="280" rx="18" fill="#fff"/><text x="340" y="30" text-anchor="middle" font-size="18" font-weight="900" fill="#8f5b43">한 원 안의 수의 합은 ${payload.target}</text><circle cx="285" cy="145" r="100" fill="#dcebe7" fill-opacity=".5" stroke="#426c64" stroke-width="3"/><circle cx="395" cy="145" r="100" fill="#e8dfca" fill-opacity=".5" stroke="#8a7040" stroke-width="3"/><text x="235" y="155" text-anchor="middle" font-size="31" font-weight="950">ㄱ</text><text x="340" y="155" text-anchor="middle" font-size="28" font-weight="950">${payload.overlap}</text><text x="445" y="155" text-anchor="middle" font-size="28" font-weight="950">${payload.rightOnly}</text><text x="340" y="265" text-anchor="middle" font-size="16" font-weight="850" fill="#59636a">ㄱ의 값을 구하세요.</text></svg>`;
    return `<svg class="hf-advanced hf-venn" viewBox="0 0 680 340" role="img" aria-label="세 원의 겹치는 영역 합 맞추기"><rect width="680" height="340" rx="18" fill="#fff"/><text x="340" y="27" text-anchor="middle" font-size="18" font-weight="900" fill="#8f5b43">한 원 안의 네 수의 합은 ${payload.target}</text><circle cx="340" cy="125" r="96" fill="#e8dfca" fill-opacity=".38" stroke="#7d6740" stroke-width="3"/><circle cx="272" cy="210" r="96" fill="#dcebe7" fill-opacity=".38" stroke="#426c64" stroke-width="3"/><circle cx="408" cy="210" r="96" fill="#dfe5f2" fill-opacity=".38" stroke="#526b91" stroke-width="3"/><text x="340" y="78" text-anchor="middle" font-size="27" font-weight="950">ㄱ</text><text x="270" y="140" text-anchor="middle" font-size="24" font-weight="900">${payload.topLeft}</text><text x="410" y="140" text-anchor="middle" font-size="27" font-weight="950">ㄷ</text><text x="340" y="174" text-anchor="middle" font-size="27" font-weight="950">ㄴ</text><text x="225" y="222" text-anchor="middle" font-size="24" font-weight="900">${payload.leftOnly}</text><text x="455" y="222" text-anchor="middle" font-size="24" font-weight="900">${payload.rightOnly}</text><text x="340" y="266" text-anchor="middle" font-size="27" font-weight="950">ㄹ</text><text x="340" y="326" text-anchor="middle" font-size="16" font-weight="850" fill="#59636a">ㄱ+ㄴ의 값을 구하세요.</text></svg>`;
  }
  function renderQ28Answer(payload) {
    if (payload.circleCount === 2) return `정답: ${payload.answer} — ${payload.target}-${payload.overlap}=${payload.answer}입니다.`;
    return `정답: ${payload.answer} — 왼쪽 원과 오른쪽 원을 비교하면 ㄷ=${payload.topRight}이고, 위 원에서 ${payload.target}-${payload.topLeft}-${payload.topRight}=${payload.answer}입니다.`;
  }

  const Q29_POSITIONS = [[0,0],[0,1],[0,2],[1,2],[2,0],[2,1],[2,2],[2,3],[3,1],[3,3],[3,4]];
  const Q29_SPEC = {
    easy: { blanks: [[2,1],[2,3]], row: [1,3], column: [5,8] },
    same: { blanks: [[2,1],[2,3],[3,3]], row: [2,5], column: [7,12] },
    hard: { blanks: [[2,1],[2,3],[3,1],[3,3]], row: [3,7], column: [9,16] }
  };
  function q29Value(start, rowStep, columnStep, row, col) { return start + col * rowStep + row * columnStep; }
  function q29Key(row, col) { return `${row},${col}`; }
  function q29RuleCandidates(payload) {
    const known = payload.cells.filter((cell) => cell.value !== null), answers = [];
    for (let start = 1; start <= 30; start += 1) for (let rowStep = 1; rowStep <= 10; rowStep += 1) for (let columnStep = 3; columnStep <= 20; columnStep += 1) {
      if (!known.every((cell) => q29Value(start, rowStep, columnStep, cell.row, cell.col) === cell.value)) continue;
      answers.push({ start, rowStep, columnStep, answer: payload.cells.filter((cell) => cell.value === null).sort((a,b) => a.slot-b.slot).map((cell) => q29Value(start, rowStep, columnStep, cell.row, cell.col)) });
    }
    return answers;
  }
  function generateQ29(difficulty, seed) {
    const spec = Q29_SPEC[difficulty] || Q29_SPEC.same, rng = makeRng(seed), start = rng.int(2, 18), rowStep = rng.int(spec.row[0], spec.row[1]), columnStep = rng.int(Math.max(spec.column[0], rowStep + 3), spec.column[1]), blankKeys = new Set(spec.blanks.map(([row,col]) => q29Key(row,col)));
    let slot = 0;
    const cells = Q29_POSITIONS.map(([row,col]) => ({ row, col, value: blankKeys.has(q29Key(row,col)) ? null : q29Value(start,rowStep,columnStep,row,col), ...(blankKeys.has(q29Key(row,col)) ? {slot: ++slot} : {}) }));
    const answer = cells.filter((cell) => cell.value === null).sort((a,b) => a.slot-b.slot).map((cell) => q29Value(start,rowStep,columnStep,cell.row,cell.col));
    return { cells, rowStep, columnStep, answer, difficulty, seed: Number(seed) || 1 };
  }
  function enumerateQ29AnswerCandidates(payload) {
    if (!payload) return [];
    const unique = new Map();
    q29RuleCandidates(payload).forEach((row) => unique.set(JSON.stringify(row.answer), row.answer));
    return [...unique.values()];
  }
  function validateQ29(payload) {
    const spec = Q29_SPEC[payload && payload.difficulty], rules = q29RuleCandidates(payload), candidates = enumerateQ29AnswerCandidates(payload);
    return Boolean(spec && payload.cells.filter((cell) => cell.value === null).length === spec.blanks.length && rules.length === 1 && candidates.length === 1 && JSON.stringify(candidates[0]) === JSON.stringify(payload.answer));
  }
  function deriveQ29Answer(payload) { return payload.answer; }
  function renderQ29Problem(payload) {
    const cellW = 82, cellH = 54, ox = 125, oy = 34;
    const boxes = payload.cells.map((cell) => { const x=ox+cell.col*cellW,y=oy+cell.row*cellH; return `<rect x="${x}" y="${y}" width="${cellW}" height="${cellH}" fill="#fff" stroke="#687581" stroke-width="2"/><text x="${x+cellW/2}" y="${y+36}" text-anchor="middle" font-size="23" font-weight="950" fill="#243746">${cell.value===null?`?${cell.slot}`:cell.value}</text>`; }).join("");
    return `<svg class="hf-advanced hf-number-grid" viewBox="0 0 680 285" role="img" aria-label="가로와 세로 규칙 수 배열"><rect width="680" height="285" rx="18" fill="#fff"/>${boxes}<text x="340" y="270" text-anchor="middle" font-size="16" font-weight="850" fill="#59636a">가로 규칙과 세로 규칙을 모두 확인하세요.</text></svg>`;
  }
  function renderQ29Answer(payload) { return `정답: ${payload.answer.join(", ")} — 가로로 ${payload.rowStep}씩, 세로로 ${payload.columnStep}씩 커집니다.`; }

  const Q30_SPEC = {
    easy: { scoreCount: 2, scoreMax: 7, shots: [2,3] },
    same: { scoreCount: 3, scoreMax: 9, shots: [3,3] },
    hard: { scoreCount: 4, scoreMax: 12, shots: [3,3] }
  };
  function q30Totals(scores, shots) {
    const totals = new Set();
    function choose(start, left, sum) {
      if (!left) { totals.add(sum); return; }
      for (let index = start; index < scores.length; index += 1) choose(index, left - 1, sum + scores[index]);
    }
    choose(0, shots, 0);
    return [...totals].sort((a,b) => a-b);
  }
  function generateQ30(difficulty, seed) {
    const spec = Q30_SPEC[difficulty] || Q30_SPEC.same, rng = makeRng(seed);
    for (let attempt = 0; attempt < 500; attempt += 1) {
      const scores = [...new Set(Array.from({length: spec.scoreCount * 4}, () => rng.int(1, spec.scoreMax)))].slice(0, spec.scoreCount).sort((a,b) => b-a);
      if (scores.length !== spec.scoreCount) continue;
      const shots = rng.int(spec.shots[0], spec.shots[1]), totals = q30Totals(scores, shots);
      return { scores, shots, totals, answer: totals.length, difficulty, seed: Number(seed) || 1 };
    }
    throw new Error(`q30 ${difficulty} 생성 실패`);
  }
  function enumerateQ30AnswerCandidates(payload) { return payload ? [q30Totals(payload.scores, payload.shots).length] : []; }
  function validateQ30(payload) {
    const spec = Q30_SPEC[payload && payload.difficulty], candidates = enumerateQ30AnswerCandidates(payload);
    return Boolean(spec && payload.scores.length === spec.scoreCount && payload.shots >= spec.shots[0] && payload.shots <= spec.shots[1] && candidates.length === 1 && candidates[0] === payload.answer && JSON.stringify(q30Totals(payload.scores,payload.shots)) === JSON.stringify(payload.totals));
  }
  function deriveQ30Answer(payload) { return payload.answer; }
  function renderQ30Problem(payload) {
    const cx=340,cy=132,maxR=105,step=maxR/payload.scores.length,circles=payload.scores.map((score,index)=>{const r=maxR-index*step,x=cx+r-step/2;return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${index%2?'#edf3f7':'#fff8e9'}" stroke="#5c6872" stroke-width="2"/><text x="${x}" y="${cy+6}" text-anchor="middle" font-size="18" font-weight="950">${score}</text>`;}).join("");
    return `<svg class="hf-advanced hf-target" viewBox="0 0 680 275" role="img" aria-label="점수가 적힌 과녁"><rect width="680" height="275" rx="18" fill="#fff"/>${circles}<text x="340" y="260" text-anchor="middle" font-size="16" font-weight="850" fill="#59636a">${payload.shots}번 모두 맞힙니다. 같은 총점은 한 번만 셉니다.</text></svg>`;
  }
  function renderQ30Answer(payload) { return `정답: ${payload.answer}가지 — 서로 다른 총점은 ${payload.totals.join(", ")}점입니다.`; }

  function q31EquationSymbols(equation) { return [...new Set((equation.match(/[A-Z]/g) || []))]; }
  function q31SideValue(side, assignment) {
    if (side.includes("x")) return side.split("x").map((term) => assignment[term.trim()]).reduce((a,b) => a*b, 1);
    return side.split("+").map((term) => assignment[term.trim()]).reduce((a,b) => a+b, 0);
  }
  function q31EquationPass(equation, assignment) {
    const [left,right] = equation.split("=").map((part) => part.trim());
    return q31SideValue(left,assignment) === q31SideValue(right,assignment);
  }
  function q31Assignments(payload, limit) {
    const equations = payload.equations, symbols = [...new Set(equations.flatMap(q31EquationSymbols))], frequency = Object.fromEntries(symbols.map((symbol) => [symbol, equations.filter((equation) => equation.includes(symbol)).length]));
    symbols.sort((a,b) => frequency[b]-frequency[a]);
    const out=[];
    function visit(index, assignment, used) {
      if (out.length >= (limit || Infinity)) return;
      if (index === symbols.length) { if (equations.every((equation) => q31EquationPass(equation,assignment))) out.push({...assignment}); return; }
      const symbol=symbols[index];
      for (const digit of payload.domain) {
        if (used.has(digit)) continue;
        assignment[symbol]=digit; used.add(digit);
        const impossible=equations.some((equation)=>{const vars=q31EquationSymbols(equation);return vars.every((name)=>Object.hasOwn(assignment,name))&&!q31EquationPass(equation,assignment);});
        if (!impossible) visit(index+1,assignment,used);
        used.delete(digit); delete assignment[symbol];
      }
    }
    visit(0,{},new Set());
    return out;
  }
  function q31Rename(baseAnswer, equations, rng) {
    const oldNames=Object.keys(baseAnswer),newNames=shuffle(oldNames,rng),rename=Object.fromEntries(oldNames.map((name,index)=>[name,newNames[index]])),answer={};
    oldNames.forEach((name)=>{answer[rename[name]]=baseAnswer[name];});
    return { answer, equations: equations.map((equation)=>equation.replace(/[A-Z]/g,(name)=>rename[name])) };
  }
  function q31SortedAnswer(answer){return Object.fromEntries(Object.keys(answer).sort().map((key)=>[key,answer[key]]));}
  const Q31_BASES = [
    { answer:{A:4,B:2,C:3,D:1,E:6,F:8,G:0}, equations:["A + G = A","C + D = A","B + B + B = E","B x B x B = F","D + D + D = C","C x D = C"] },
    { answer:{A:5,B:2,C:4,D:1,E:6,F:8,G:0}, equations:["A + G = A","C + D = A","B + B + B = E","B x B x B = F","D + D + D + D = C","C x D = C"] },
    { answer:{A:6,B:2,C:5,D:1,E:4,F:8,G:0}, equations:["A + G = A","C + D = A","B + B = E","B x B x B = F","D + D + D + D + D = C","C x D = C"] }
  ];
  function generateQ31(difficulty, seed) {
    const rng=makeRng(seed);
    let domain,base;
    if (difficulty === "easy") { domain=[0,1,2,3,4,5]; base={answer:{A:3,B:1,C:2,D:0},equations:["A + D = A","B + B = C","B + B + B = A"]}; }
    else { domain=[0,1,2,3,4,5,6,7,8]; base=JSON.parse(JSON.stringify(rng.pick(Q31_BASES))); if(difficulty === "hard"){base.answer.H=7;base.equations.push("D + D + D + D + D + D + D = H");} }
    const renamed=q31Rename(base.answer,base.equations,rng),payload={domain,equations:renamed.equations,answer:q31SortedAnswer(renamed.answer),difficulty,seed:Number(seed)||1};
    if(q31Assignments(payload,2).length!==1)throw new Error(`q31 ${difficulty} 단일 배정 생성 실패`);
    return payload;
  }
  function enumerateQ31AnswerCandidates(payload) { return payload ? q31Assignments(payload,2).map(q31SortedAnswer) : []; }
  function q31SameAnswer(left,right){const keys=Object.keys(left).sort();return JSON.stringify(keys.map((key)=>[key,left[key]]))===JSON.stringify(keys.map((key)=>[key,right[key]]));}
  function validateQ31(payload) {
    const expectedCount={easy:4,same:7,hard:8}[payload&&payload.difficulty],candidates=enumerateQ31AnswerCandidates(payload);
    return Boolean(expectedCount&&Object.keys(payload.answer).length===expectedCount&&candidates.length===1&&q31SameAnswer(candidates[0],payload.answer));
  }
  function deriveQ31Answer(payload){return q31SortedAnswer(payload.answer);}
  function renderQ31Problem(payload){const height=75+payload.equations.length*38,rows=payload.equations.map((equation,index)=>`<text x="340" y="${55+index*38}" text-anchor="middle" font-size="22" font-weight="900" fill="#243746">${equation}</text>`).join("");return `<svg class="hf-advanced hf-symbol-equations" viewBox="0 0 680 ${height}" role="img" aria-label="문자값 식"><rect width="680" height="${height}" rx="18" fill="#fff"/>${rows}<text x="340" y="${height-15}" text-anchor="middle" font-size="15" font-weight="850" fill="#59636a">각 문자는 서로 다른 수입니다.</text></svg>`;}
  function renderQ31Answer(payload){return `정답: ${Object.keys(payload.answer).sort().map((key)=>`${key}=${payload.answer[key]}`).join(", ")} — 조건이 가장 강한 식부터 차례로 찾습니다.`;}

  const Q32_DIGITS=[0,1,2,4,5,8],Q32_MIRROR={"0":"0","1":"1","2":"5","4":"4","5":"2","8":"8","+":"+","-":"-","=":"=","□":"□"};
  function q32ValidNumber(value,digits){const text=String(value);return text.length===digits&&[...text].every((digit)=>Q32_DIGITS.includes(Number(digit)));}
  function q32Numbers(digits){const start=10**(digits-1),end=10**digits;return Array.from({length:end-start},(_,i)=>start+i).filter((value)=>q32ValidNumber(value,digits));}
  function q32HasCarry(a,b){const aa=String(a).split("").reverse().map(Number),bb=String(b).split("").reverse().map(Number);return aa.some((digit,index)=>digit+(bb[index]||0)>=10);}
  function q32Mirror(expression){return [...expression].reverse().map((char)=>Q32_MIRROR[char]||char).join("");}
  function q32EquationPool(digits,carryMode){const numbers=q32Numbers(digits),out=[];for(const a of numbers)for(const b of numbers){const total=a+b;if(!q32ValidNumber(total,digits))continue;const carry=q32HasCarry(a,b);if(carryMode==="none"&&carry)continue;if(carryMode==="required"&&!carry)continue;out.push({a,b,total});}return out;}
  function generateQ32(difficulty,seed){const rng=makeRng(seed),digits=difficulty==="hard"?3:2,carryMode=difficulty==="easy"?"none":"required",pool=q32EquationPool(digits,carryMode);for(let attempt=0;attempt<500;attempt+=1){const first=rng.pick(pool),second=rng.pick(pool);if(first.a===second.total)continue;const original=[`□+${first.b}=${first.total}`,`${second.a}+${second.b}=□`],visible=original.map(q32Mirror),answer=first.a+second.total,payload={digits,original,visible,blankValues:[first.a,second.total],answer,difficulty,seed:Number(seed)||1};if(enumerateQ32AnswerCandidates(payload)[0]===answer)return payload;}throw new Error(`q32 ${difficulty} 생성 실패`);}
  function q32SolveVisible(visible){const original=q32Mirror(visible),leftBlank=original.match(/^□\+(\d+)=(\d+)$/),rightBlank=original.match(/^(\d+)\+(\d+)=□$/);if(leftBlank)return Number(leftBlank[2])-Number(leftBlank[1]);if(rightBlank)return Number(rightBlank[1])+Number(rightBlank[2]);return null;}
  function enumerateQ32AnswerCandidates(payload){if(!payload)return[];const blanks=payload.visible.map(q32SolveVisible);return blanks.every((value)=>Number.isInteger(value))?[blanks[0]+blanks[1]]:[];}
  function validateQ32(payload){const digits=payload&&payload.difficulty==="hard"?3:2,candidates=enumerateQ32AnswerCandidates(payload);return Boolean(payload&&payload.digits===digits&&payload.visible.every((line,index)=>q32Mirror(line)===payload.original[index])&&candidates.length===1&&candidates[0]===payload.answer);}
  function deriveQ32Answer(payload){return payload.answer;}
  const Q32_SEGMENTS={0:"abcdef",1:"bc",2:"abdeg",4:"bcfg",5:"acdfg",8:"abcdefg"};
  function q32CharSvg(char,x,y){const w=26,h=44,t=5,segments={a:[x+5,y,x+w-5,y],b:[x+w,y+5,x+w,y+h/2-3],c:[x+w,y+h/2+3,x+w,y+h-5],d:[x+5,y+h,x+w-5,y+h],e:[x,y+h/2+3,x,y+h-5],f:[x,y+5,x,y+h/2-3],g:[x+5,y+h/2,x+w-5,y+h/2]};if(/\d/.test(char))return[...(Q32_SEGMENTS[char]||"")].map((name)=>`<line x1="${segments[name][0]}" y1="${segments[name][1]}" x2="${segments[name][2]}" y2="${segments[name][3]}" stroke="#172b3d" stroke-width="${t}" stroke-linecap="round"/>`).join("");if(char==="+")return`<line x1="${x+4}" y1="${y+h/2}" x2="${x+w-4}" y2="${y+h/2}" stroke="#172b3d" stroke-width="4"/><line x1="${x+w/2}" y1="${y+10}" x2="${x+w/2}" y2="${y+h-10}" stroke="#172b3d" stroke-width="4"/>`;if(char==="-")return`<line x1="${x+4}" y1="${y+h/2}" x2="${x+w-4}" y2="${y+h/2}" stroke="#172b3d" stroke-width="4"/>`;if(char==="=")return`<line x1="${x+4}" y1="${y+h/2-6}" x2="${x+w-4}" y2="${y+h/2-6}" stroke="#172b3d" stroke-width="4"/><line x1="${x+4}" y1="${y+h/2+6}" x2="${x+w-4}" y2="${y+h/2+6}" stroke="#172b3d" stroke-width="4"/>`;return`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="4" fill="none" stroke="#9b6a3f" stroke-width="3"/>`;}
  function q32LineSvg(line,y){const gap=14,charW=26,total=line.length*(charW+gap)-gap,start=(620-total)/2;return [...line].map((char,index)=>q32CharSvg(char,30+start+index*(charW+gap),y)).join("");}
  function renderQ32Problem(payload){return `<svg class="hf-advanced hf-digital-mirror" viewBox="0 0 680 235" role="img" aria-label="오른쪽 거울에 비친 디지털 식"><rect width="680" height="235" rx="18" fill="#eef4f7"/><text x="340" y="28" text-anchor="middle" font-size="17" font-weight="900" fill="#52636f">오른쪽 거울에 비친 모습</text>${q32LineSvg(payload.visible[0],48)}${q32LineSvg(payload.visible[1],120)}<line x1="640" y1="42" x2="640" y2="190" stroke="#70a5ba" stroke-width="6"/><text x="340" y="220" text-anchor="middle" font-size="15" font-weight="850" fill="#59636a">원래 방향으로 돌려 읽은 뒤 두 빈칸의 수를 더하세요.</text></svg>`;}
  function renderQ32Answer(payload){return `정답: ${payload.answer} — 거울을 원래 방향으로 읽으면 빈칸은 ${payload.blankValues.join(", ")}이고, 합은 ${payload.answer}입니다.`;}

  const Q33_SPEC={easy:{rounds:3,win:[1,2],lose:1},same:{rounds:5,win:2,lose:1},hard:{rounds:6,win:[2,4],lose:[1,3]}};
  function generateQ33(difficulty,seed){const spec=Q33_SPEC[difficulty]||Q33_SPEC.same,rng=makeRng(seed),rounds=spec.rounds,winStep=Array.isArray(spec.win)?rng.int(spec.win[0],spec.win[1]):spec.win,loseStep=Array.isArray(spec.lose)?rng.int(spec.lose[0],spec.lose[1]):spec.lose;let winsA=rng.int(Math.floor(rounds/2)+1,rounds),lossesA=rounds-winsA;if(lossesA===0){winsA-=1;lossesA=1;}const moveA=winsA*winStep-lossesA*loseStep,moveB=lossesA*winStep-winsA*loseStep,answer=moveA-moveB;return{rounds,winStep,loseStep,winsA,lossesA,moveA,moveB,answer,difficulty,seed:Number(seed)||1};}
  function enumerateQ33AnswerCandidates(payload){return payload?[(payload.winsA-payload.lossesA)*(payload.winStep+payload.loseStep)]:[];}
  function validateQ33(payload){const spec=Q33_SPEC[payload&&payload.difficulty],c=enumerateQ33AnswerCandidates(payload);return Boolean(spec&&payload.winsA+payload.lossesA===payload.rounds&&payload.winsA>payload.lossesA&&c.length===1&&c[0]===payload.answer&&payload.moveA-payload.moveB===payload.answer);}
  function deriveQ33Answer(payload){return payload.answer;}
  function renderQ33Problem(payload){const base=140,maxMove=Math.max(1,Math.abs(payload.moveA),Math.abs(payload.moveB)),scale=58/maxMove,ay=base-payload.moveA*scale,by=base-payload.moveB*scale;return `<svg class="hf-advanced hf-rps-stairs" viewBox="0 0 680 260" role="img" aria-label="가위바위보 계단 이동"><rect width="680" height="260" rx="18" fill="#fff"/><text x="340" y="30" text-anchor="middle" font-size="17" font-weight="900" fill="#59636a">같은 계단에서 시작 · 이기면 ${payload.winStep}칸 위 · 지면 ${payload.loseStep}칸 아래</text><line x1="150" y1="${base}" x2="530" y2="${base}" stroke="#9aa5ae" stroke-width="3" stroke-dasharray="7 7"/><rect x="190" y="${Math.min(ay,base)}" width="110" height="${Math.abs(base-ay)||4}" rx="10" fill="#d7e7e2" stroke="#426c64"/><rect x="380" y="${Math.min(by,base)}" width="110" height="${Math.abs(base-by)||4}" rx="10" fill="#e8dfca" stroke="#8a7040"/><text x="245" y="220" text-anchor="middle" font-size="17" font-weight="900">재이</text><text x="435" y="220" text-anchor="middle" font-size="17" font-weight="900">지용</text><text x="245" y="242" text-anchor="middle" font-size="14">${payload.winsA}승 ${payload.lossesA}패</text><text x="435" y="242" text-anchor="middle" font-size="14">${payload.lossesA}승 ${payload.winsA}패</text></svg>`;}
  function renderQ33Answer(payload){return `정답: ${payload.answer}계단 — 재이는 ${payload.moveA}칸, 지용이는 ${payload.moveB}칸 움직여 차이는 ${payload.answer}계단입니다.`;}

  function q34Permutations(values){const out=[];function visit(rest,chosen){if(!rest.length){out.push(chosen);return;}rest.forEach((value,index)=>visit(rest.slice(0,index).concat(rest.slice(index+1)),chosen.concat(value)));}visit(values,[]);return out;}
  function q34Results(cards){const rows=[];for(const p of q34Permutations(cards)){if(p[0]===0||p[2]===0)continue;const left=10*p[0]+p[1],right=10*p[2]+p[3];if(left>right)rows.push({left,right,value:left-right,equation:`${left}-${right}=${left-right}`});}return rows;}
  const Q34_SPEC={easy:{max:6,min:1},same:{max:9,min:1},hard:{max:9,min:0}};
  function generateQ34(difficulty,seed){const spec=Q34_SPEC[difficulty]||Q34_SPEC.same,rng=makeRng(seed);for(let attempt=0;attempt<500;attempt+=1){const cards=[...new Set(Array.from({length:20},()=>rng.int(spec.min,spec.max)))].slice(0,4).sort((a,b)=>a-b);if(cards.length!==4||!cards.some((value)=>cards.includes(value+1)))continue;const rows=q34Results(cards);if(!rows.length)continue;const min=Math.min(...rows.map((row)=>row.value)),max=Math.max(...rows.map((row)=>row.value)),minRow=rows.find((row)=>row.value===min),maxRow=rows.find((row)=>row.value===max);return{cards,answer:{max,min},minEquation:minRow.equation,maxEquation:maxRow.equation,difficulty,seed:Number(seed)||1};}throw new Error(`q34 ${difficulty} 생성 실패`);}
  function enumerateQ34AnswerCandidates(payload){if(!payload)return[];const rows=q34Results(payload.cards);return rows.length?[{max:Math.max(...rows.map((row)=>row.value)),min:Math.min(...rows.map((row)=>row.value))}]:[];}
  function validateQ34(payload){const spec=Q34_SPEC[payload&&payload.difficulty],c=enumerateQ34AnswerCandidates(payload);return Boolean(spec&&payload.cards.length===4&&new Set(payload.cards).size===4&&payload.cards.some((value)=>payload.cards.includes(value+1))&&c.length===1&&JSON.stringify(c[0])===JSON.stringify(payload.answer));}
  function deriveQ34Answer(payload){return payload.answer;}
  function renderQ34Problem(payload){const cards=payload.cards.map((digit,index)=>`<rect x="${170+index*88}" y="62" width="66" height="82" rx="10" fill="#fff8e9" stroke="#a88442" stroke-width="3"/><text x="${203+index*88}" y="116" text-anchor="middle" font-size="35" font-weight="950" fill="#243746">${digit}</text>`).join("");return `<svg class="hf-advanced hf-digit-cards" viewBox="0 0 680 220" role="img" aria-label="숫자 카드로 두 자리 수 뺄셈 만들기"><rect width="680" height="220" rx="18" fill="#fff"/><text x="340" y="32" text-anchor="middle" font-size="17" font-weight="900" fill="#59636a">각 카드를 한 번씩 써서 두 자리 수 2개 만들기</text>${cards}<text x="340" y="192" text-anchor="middle" font-size="16" font-weight="850" fill="#59636a">큰 수에서 작은 수를 뺍니다.</text></svg>`;}
  function renderQ34Answer(payload){return `정답: 최댓값 ${payload.answer.max}, 최솟값 ${payload.answer.min} — ${payload.maxEquation}, ${payload.minEquation}입니다.`;}

  global.HFQ28={generateQ28,validateQ28,enumerateQ28AnswerCandidates,renderQ28Problem,deriveQ28Answer,renderQ28Answer};
  global.HFQ29={generateQ29,validateQ29,enumerateQ29AnswerCandidates,renderQ29Problem,deriveQ29Answer,renderQ29Answer};
  global.HFQ30={generateQ30,validateQ30,enumerateQ30AnswerCandidates,renderQ30Problem,deriveQ30Answer,renderQ30Answer};
  global.HFQ31={generateQ31,validateQ31,enumerateQ31AnswerCandidates,renderQ31Problem,deriveQ31Answer,renderQ31Answer};
  global.HFQ32={generateQ32,validateQ32,enumerateQ32AnswerCandidates,renderQ32Problem,deriveQ32Answer,renderQ32Answer};
  global.HFQ33={generateQ33,validateQ33,enumerateQ33AnswerCandidates,renderQ33Problem,deriveQ33Answer,renderQ33Answer};
  global.HFQ34={generateQ34,validateQ34,enumerateQ34AnswerCandidates,renderQ34Problem,deriveQ34Answer,renderQ34Answer};
})(typeof window !== "undefined" ? window : globalThis);
