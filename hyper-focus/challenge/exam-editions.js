(function (root) {
  'use strict';
  // Exam-only editorial layer. Concept lessons and source banks are not changed.
  const esc = s => String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const sum = a => a.reduce((s,n)=>s+n,0);
  const topic = s => s + ((s.charCodeAt(s.length-1)-44032)%28===0?'는':'은');
  const txt = (x,y,s,size=20,anchor='middle') => `<text x="${x}" y="${y}" text-anchor="${anchor}" dominant-baseline="middle" font-size="${size}" fill="#25384a" stroke="none">${esc(s)}</text>`;
  const rect = (x,y,w,h,fill='#fff',extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#536b7f" stroke-width="1.5" ${extra}/>`;
  const line = (x,y,a,b,extra='')=>`<path d="M${x} ${y}L${a} ${b}" fill="none" stroke="#536b7f" stroke-width="1.7" ${extra}/>`;
  const svg = (body,w=660,h=220,label='수학 문제 그림')=>`<svg class="challenge-visual edition-visual" viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${body}</svg>`;
  const box = (lines) => `<div class="edition-conditions">${lines.map(s=>`<p>${esc(s)}</p>`).join('')}</div>`;
  const table = (headers)=>`<table class="edition-table"><thead><tr>${headers.map(s=>`<th>${esc(s)}</th>`).join('')}</tr></thead><tbody><tr>${headers.map(()=>'<td></td>').join('')}</tr></tbody></table>`;
  const sprite = (kind,x,y,size=56)=>{const k={apple:0,pear:1,berry:2,orange:3,candy:4,bird:5}[kind];return `<svg x="${x}" y="${y}" width="${size}" height="${size}" viewBox="${k%3*512} ${Math.floor(k/3)*512} 512 512" overflow="hidden"><image href="assets/exam-objects-illustration.png" width="1536" height="1024"/></svg>`;};
  const arrow = (a,b) => {
    const dx=b[0]-a[0],dy=b[1]-a[1],length=Math.hypot(dx,dy),trim=23,shaft=length-trim*2;
    return `<g transform="translate(${a[0]} ${a[1]}) rotate(${Math.atan2(dy,dx)*180/Math.PI})"><path d="M${trim} -4 H${trim+shaft-10} V-9 L${length-trim} 0 L${trim+shaft-10} 9 V4 H${trim}Z" fill="white" stroke="#274d6e" stroke-width="2" stroke-linejoin="round"/></g>`;
  };
  function fruitBalances(p) {
    const balance=root.HFChallengeBalance||(typeof require==='function'?require('./balance-diagram.js'):null);
    return svg(balance.render(0,320,['apple'],Array(p.pearsPerApple).fill('pear'))+balance.render(340,320,['pear'],Array(p.berriesPerPear).fill('berry')),660,190,'접시와 받침이 연결된 사과와 배, 배와 딸기의 수평 저울');
  }
  function arrowPath(p) {
    const step=p.verticalStep??10,center=[129,132],neighbors=[[54,132,34],[204,132,36],[129,57,35-step],[129,207,35+step]];
    let art=rect(5,8,245,235)+txt(129,26,'보기',17);
    for(const [x,y,v]of neighbors)art+=arrow(center,[x,y])+rect(x-20,y-20,40,40)+txt(x,y,v,22);
    art+=rect(109,112,40,40)+txt(129,132,35,22);
    const points=p.points.map(([x,y])=>[295+x*85,220-y*62]);
    for(let i=1;i<points.length;i++)art+=arrow(points[i-1],points[i]);
    points.forEach(([x,y],i)=>{art+=i===0||i===points.length-1?rect(x-20,y-20,40,40):`<circle cx="${x}" cy="${y}" r="19" fill="white" stroke="#536b7f" stroke-width="1.6"/>`;if(i===0)art+=txt(x,y,p.start,22);if(i===points.length-1)art+=txt(x,y,'㉠',20);});
    return svg(art,660,250,'보기와 꺾인 경로, 속이 빈 굵은 화살표와 사이의 빈칸');
  }
  function cubeTarget(p,original) {
    const project=(x,y,z)=>[330+(x-y)*43,152+(x+y)*23-z*43],h=Math.max(...p.heights.flat());
    // Geometry's boxWireframe convention: 12 outer edges, no unit-cell grid.
    // The supplied reference uses solid lines: rear edges behind blocks,
    // front/top edges in front, as on a transparent enclosing box.
    const seg=(a,b)=>{const [x,y]=project(...a),[u,v]=project(...b);return line(x,y,u,v);};
    let back=seg([0,0,0],[2,0,0])+seg([0,0,0],[0,2,0])+seg([0,0,0],[0,0,h]);
    let front=seg([2,0,0],[2,2,0])+seg([2,2,0],[0,2,0]);
    front+=seg([0,0,h],[2,0,h])+seg([2,0,h],[2,2,h])+seg([2,2,h],[0,2,h])+seg([0,2,h],[0,0,h]);
    for(const [x,y] of [[0,2],[2,0],[2,2]])front+=seg([x,y,0],[x,y,h]);
    return original.replace(/(<svg\b[^>]*>)/,`$1<g class="fill-target fill-target-back" data-border="outer-solid" data-edge-count="3">${back}</g>`).replace('</svg>',`<g class="fill-target fill-target-front" data-border="outer-solid" data-edge-count="9">${front}</g></svg>`).replace('네 기둥을 가장 높은 기둥과 같게 하려면, 모두 몇 개를 더 쌓아야 합니까?','빈칸을 가득 채우려면 몇 개 더 필요할까요?');
  }
  function rectangleGroups(p) {
    const set=new Set(p.edges),groups={};
    for(let w=1;w<=p.cols;w++)for(let h=1;h<=p.rows;h++)for(let x=0;x+w<=p.cols;x++)for(let y=0;y+h<=p.rows;y++){
      let ok=true;for(let k=0;k<w;k++)if(!set.has(`h:${x+k}:${y}`)||!set.has(`h:${x+k}:${y+h}`))ok=false;
      for(let k=0;k<h;k++)if(!set.has(`v:${x}:${y+k}`)||!set.has(`v:${x+w}:${y+k}`))ok=false;
      if(ok)groups[`${w}×${h}`]=(groups[`${w}×${h}`]||0)+1;
    }return groups;
  }
  function explain(q) {
    const p=q.payload,a=q.answer,v=p.values||{};
    switch(q.typeId){
      case 'line-position-total':return `윤지를 두 번 세지 않도록 전체는 ${p.before+1}+${p.after+1}-1=${p.before+p.after+1}명입니다. 민수와 그 뒤의 학생 ${p.otherBackRank}명을 빼면 ${p.before+p.after+1}-${p.otherBackRank}=${a}명입니다.`;
      case 'split-merge-chain':return p.panels.map((t,i)=>`(${i+1}) ${t.nodes.a}+${t.nodes.b}=${t.nodes.p0}, ${t.nodes.b}+${t.nodes.c}=${t.nodes.p1}, ${t.nodes.p0}+${t.nodes.p1}=${t.nodes.total}입니다. 빈칸은 위에서 아래로, 같은 높이에서는 왼쪽부터 ${a[i].join(', ')}입니다.`).join(' ');
      case 'number-property-filter':return `먼저 짝수를 고르고, 일의 자리 숫자가 십의 자리 숫자보다 큰지 확인합니다. ${a.map(n=>`${n}은 ${n%10}>${Math.floor(n/10)}`).join(', ')}이므로 조건을 모두 만족합니다.`;
      case 'triangle-number-rule':return `위의 수와 왼쪽 아래 수를 더한 뒤 오른쪽 아래 수를 빼면 가운데 수가 됩니다. 보기에서 5+6-4=7, 8+3-5=6, 4+7-8=3입니다. 따라서 ${p.top}+${p.left}-□=${p.center}이고, □=${a}입니다.`;
      case 'cyclic-picture-pattern':return `모양은 ${p.pattern.join(' → ')} 순서로 ${p.pattern.length}개씩, 색은 ${p.colors.join(' → ')} 순서로 ${p.colors.length}개씩 반복됩니다. ${p.position}번째는 ${a[0]}입니다. ${p.through}번째까지 ${p.target}가 나오는 자리는 ${Array.from({length:p.through},(_,i)=>i+1).filter(i=>p.pattern[(i-1)%p.pattern.length]===p.target).join(', ')}번째로, 모두 ${a[1]}개입니다.`;
      case 'total-difference':return `많은 접시에서 차이인 ${p.difference}개를 덜어 놓으면 두 접시의 수가 같습니다. 남은 ${p.total}-${p.difference}=${p.total-p.difference}개를 반씩 나누면 ${a[1]}개입니다. 많은 접시는 ${a[1]}+${p.difference}=${a[0]}개입니다.`;
      case 'rotated-grid-pair':{
        const norm=c=>c.map(([r,col])=>r*3+col).sort((x,y)=>x-y).join(',');let cells=p.options[a[0]-1],turn=0;while(norm(cells)!==norm(p.options[a[1]-1])&&turn<4){cells=cells.map(([r,c])=>[c,2-r]);turn++;}
        return `${a[0]}번을 시계 방향으로 ${turn*90}도 돌리면 ${a[1]}번과 색칠한 칸이 모두 겹칩니다. 뒤집지 않고 돌리는 경우를 비교하면 다른 짝은 없습니다.`;}
      case 'mountain-digit-count':return `${p.digit}번째 줄에서 ${p.digit}가 한 번 나오고, 그 아래 줄마다 두 번씩 나옵니다. 아래에 ${p.figure-p.digit}줄이 더 있으므로 1+${Array(p.figure-p.digit).fill(2).join('+')}=${a}번입니다.`;
      case 'apartment-floor-order':return `${p.bridgeLower}의 바로 위에 ${p.bridgeUpper}가 살면서 두 사람이 각각 아래 두 층과 위 세 층에 속하려면 2층과 3층이어야 합니다. ${p.top}은 5층에 삽니다. 남은 사람을 넣으면 1층부터 ${a.join(', ')}입니다.`;
      case 'balance-weight-order':return `배 1개는 딸기 ${p.berriesPerPear}개와 같습니다. 사과 1개는 배 ${p.pearsPerApple}개이므로 딸기 ${p.pearsPerApple*p.berriesPerPear}개와 같습니다. 사과 ${p.appleCount}개와 배 ${p.pearCount}개를 딸기로 바꾸면 ${Array(p.appleCount).fill(p.pearsPerApple*p.berriesPerPear).concat(Array(p.pearCount).fill(p.berriesPerPear)).join('+')}=${a}개입니다.`;
      case 'card-sum-count':return `${p.ways.map(w=>w.join('+')+'='+p.target).join(', ')}의 ${a}가지입니다. 같은 수끼리의 순서만 바뀐 경우는 더 세지 않고, 같은 숫자가 적힌 카드는 주어진 장수까지만 사용합니다.`;
      case 'animal-race-order':return `주어진 등수를 먼저 정하고 앞뒤 관계를 적용합니다. ${p.relations.map(r=>r.type==='rank'?`${r.person}는 ${r.rank}등`:r.type==='before'?`${r.first}는 ${r.second}보다 앞`:r.type==='between'?`${r.middle}는 ${r.first} 뒤, ${r.last} 앞`:`${r.behind}는 ${r.ahead} 바로 뒤`).join(', ')}입니다. 이를 모두 만족하는 순서는 ${a.join(' → ')}입니다.`;
      case 'arrow-number-move':{let n=p.start;const step=p.verticalStep??10,steps=p.moves.map(m=>(n+=({R:1,L:-1,U:-step,D:step})[m]));return `보기에서 오른쪽은 1 커지고, 왼쪽은 1 작아지며, 위쪽은 ${step} 작아지고, 아래쪽은 ${step} 커집니다. 출발점 ${p.start}에서 경로를 따라가면 ${steps.join(' → ')}입니다. 따라서 ㉠은 ${a}입니다.`;}
      case 'symbol-equation':{const c=p.sum1-p.constant,d=p.sum2-c,t=d-p.diff;return `첫째 식에서 ○=${p.sum1}-${p.constant}=${c}, 둘째 식에서 ◇=${p.sum2}-${c}=${d}, 셋째 식에서 △=${d}-${p.diff}=${t}입니다. 따라서 □=${c}+${t}=${a}입니다.`;}
      case 'minimum-sum-pyramid':{const s=[...p.cards].sort((x,y)=>x-y),lo=sum(s)+2*(s[0]+s[1]),hi=sum(s)+2*(s[2]+s[3]);return `가운데 두 카드의 수는 꼭대기까지 각각 세 번, 양 끝의 수는 각각 한 번 더해집니다. 가운데에 ${s[0]}, ${s[1]}을 놓으면 최솟값 ${lo}, ${s[2]}, ${s[3]}을 놓으면 최댓값 ${hi}입니다. 물은 것은 ${p.operation==='sum'?'합':'차'}이므로 ${hi}${p.operation==='sum'?'+':'-'}${lo}=${a}입니다.`;}
      case 'inverse-story-problem':return p.schema==='bus'?`마지막 ${v.final}명에서 둘째 정류장에서 내린 ${v.off2}명을 다시 더하면 ${v.final+v.off2}명입니다. 첫 정류장에서 탄 ${v.on1}명을 빼고 내린 ${v.off1}명을 더하면 ${v.final}+${v.off2}-${v.on1}+${v.off1}=${a}명입니다.`:p.schema==='birds'?`처음 ${v.initial}마리에 나중에 온 ${v.arrive}마리를 더하고 현재 ${v.final}마리를 빼면 날아간 수입니다. ${v.initial}+${v.arrive}-${v.final}=${a}마리입니다.`:p.schema==='relation'?`어떤 수는 ${v.smaller}+${v.gap}이고, 그보다 ${v.gap} 큰 수는 ${v.smaller}+${v.gap}+${v.gap}=${a}입니다.`:`사 오기 전은 ${v.final}-${v.added}개입니다. 먹은 ${v.ate}개를 다시 더하면 처음 수는 ${v.final}-${v.added}+${v.ate}=${a}개입니다.`;
      case 'family-comparison':return `동생은 나보다 ${p.siblingLess}개 적고, 아빠는 동생보다 ${p.dadAboveSibling}개 많습니다. 따라서 아빠는 나보다 ${p.dadAboveSibling}-${p.siblingLess}=${a}개 많습니다. 엄마의 수는 이 차이를 구하는 데 필요하지 않습니다.`;
      case 'cube-count-fill':return `각 기둥의 높이는 ${p.heights.flat().join(', ')}개이므로 모두 ${p.heights.flat().join('+')}=${a[0]}개입니다. 상자 안을 채우면 한 층에 4개씩 ${Math.max(...p.heights.flat())}층, 모두 ${4*Math.max(...p.heights.flat())}개입니다. 더 필요한 수는 ${4*Math.max(...p.heights.flat())}-${a[0]}=${a[1]}개입니다.`;
      case 'rectangle-count':{
        const groups=rectangleGroups(p);
        if(q.responsePart===1){const widths=Array.from({length:p.cols},(_,i)=>Object.entries(groups).filter(([s])=>Number(s.split('×')[0])===i+1).reduce((n,[,count])=>n+count,0));return `가로로 ${widths.map((n,i)=>`${i+1}칸인 사각형이 ${n}개`).join(', ')}입니다. 모두 ${widths.join('+')}=${a}개입니다. 선이 끊어진 곳을 이어져 있는 것으로 세지 않습니다.`;}
        return `가로 칸 수×세로 칸 수별로 ${Object.entries(groups).map(([s,n])=>`${s}: ${n}개`).join(', ')}입니다. 가로와 세로가 같은 것만 모으면 정사각형 ${a[0]}개, 모두 모으면 직사각형 ${a[1]}개입니다. 끊어진 선을 이어진 것으로 세면 안 됩니다.`;}
      case 'four-cell-code':return `왼쪽부터 각 칸은 1, 2, 4, 8을 나타내며 색칠한 칸의 수를 더합니다. (1) ${p.encode}=${a[0].map(i=>2**(i-1)).join('+')}이므로 왼쪽에서 ${a[0].join(', ')}번째 칸을 칠합니다. (2) ${p.shown.flatMap((v,i)=>v?[2**i]:[]).join('+')}=${a[1]}입니다.`;
      default:throw new Error('풀이 누락: '+q.typeId);
    }
  }
  function reviseRound1(exam,bank) {
    const domains=['지문이해','수','수','논리추리','도형','지문이해','도형','논리추리','논리추리','논리추리','수','논리추리','논리추리','수','수','지문이해','지문이해','도형','도형','도형'];
    const questions=exam.questions.map(base=>{
      let q=JSON.parse(JSON.stringify(base));
      if([4,7,13].includes(q.number)){q={...q.subquestions[0],number:q.number};delete q.subquestions;}
      const p=q.payload;
      if(q.number===3)q.prompt='상자에 적힌 조건을 모두 만족하는 수를 찾으려고 합니다. 아래 수 카드에서 알맞은 수를 모두 찾아 동그라미 하세요.';
      if(q.number===4)q.problemHtml=q.problemHtml.replace(/logic-label logic-small/g,'logic-label triangle-large');
      if([6,11].includes(q.number))q.problemHtml=q.problemHtml.replace(/<text\b[^>]*>[^<]*(?:차이가 나게 담습니다|합이[^<]*카드를 골라 보세요)[^<]*<\/text>/g,'');
      if(q.number===8)q.prompt=q.prompt.replace(/숫자 (\d+)은 모두/,'숫자 $1이 모두');
      if(q.number===9)q.problemHtml=`<div class="apartment-layout">${box([`${p.lower.join(', ')} 두 사람은 1층 또는 2층에 살고 있습니다.`,`${p.upper.join(', ')} 세 사람은 1층이나 2층에 살고 있지 않습니다.`,`${topic(p.top)} 가장 위층에 살고 있습니다.`,`${topic(p.bridgeLower)} ${p.bridgeUpper}의 바로 아래층에 살고 있습니다.`])}<table class="edition-table apartment-table"><tbody>${[5,4,3,2,1].map(f=>`<tr><th>${f}층</th><td></td></tr>`).join('')}</tbody></table></div>`;
      if(q.number===10){q.prompt=`다음 양팔저울은 모두 수평입니다. 같은 종류의 과일은 무게가 서로 같습니다. 사과 ${p.appleCount}개와 배 ${p.pearCount}개는 딸기 몇 개와 무게가 같습니까?`;q.answer=p.answer[1];q.answerHtml=q.answer+'개';q.answerCandidates=[q.answer];q.responsePart=1;q.problemHtml=fruitBalances(p);}
      if(q.number===12){const conditions=q.problemHtml.match(/<text\b[^>]*class="condition"[^>]*>.*?<\/text>/g)||[];q.problemHtml=svg(conditions.join(''),680,150)+table(p.participants.map((_,i)=>(i+1)+'등'));}
      if(q.number===13){p.start=61+(p.seed%19);p.verticalStep=8;p.moves=['R','U','R','R','U','L','L','U'];p.points=[[0,0],[1,0],[1,1],[2,1],[3,1],[3,2],[2,2],[1,2],[1,3]];p.end=p.moves.reduce((n,m)=>n+({R:1,L:-1,U:-p.verticalStep,D:p.verticalStep})[m],p.start);p.missing='end';p.answer=p.end;q.answer=p.end;q.answerHtml=String(p.end);q.answerCandidates=[p.end];q.prompt='보기의 수와 화살표에서 같은 규칙을 찾아보세요. 오른쪽 그림에서 출발하는 수부터 화살표를 따라 빈칸을 채우고, 마지막 ㉠에 알맞은 수를 쓰세요.';q.problemHtml=arrowPath(p);}
      if(q.number===18){q.prompt='그림의 상자 안에 같은 크기의 쌓기나무를 네 기둥으로 쌓았습니다. 각 기둥에는 위아래로 빈 곳이 없습니다. 그림을 보고 두 물음에 답하세요.';q.problemHtml=cubeTarget(p,q.problemHtml);}
      if(q.number===19){q.prompt='그림에 그어진 선을 따라 그릴 수 있는 크고 작은 사각형은 모두 몇 개입니까?';q.problemHtml=q.problemHtml.match(/<svg\b[\s\S]*?<\/svg>/)[0];q.answer=p.answer[1];q.answerHtml=q.answer+'개';q.answerCandidates=[q.answer];q.responsePart=1;}
      q.domain=domains[q.number-1];q.solution=explain(q);return q;
    });
    return {...exam,title:'챌린지 모의고사',editionId:'challenge-r1-editorial-v3',questions,answerMode:'solutions',generationPolicy:'generated'};
  }

  function makeRound2() {
    const questions=[];
    const add=(id,domain,prompt,problemHtml,answer,solution,payload={})=>{
      const n=questions.length+1;questions.push({number:n,typeId:id,domain,prompt,problemHtml,answer,answerHtml:Array.isArray(answer)?answer.map((v,i)=>`(${i+1}) ${Array.isArray(v)?v.join(', '):v}`).join('  '):String(answer),solution,payload:{typeId:id,...payload},answerCandidates:[answer]});
    };
    add('r2-bird-departure','지문이해','나뭇가지에 참새 34마리가 앉아 있었습니다. 그중 몇 마리가 날아가고 다른 참새 8마리가 날아와 앉았더니, 나뭇가지에 남아 있는 참새가 17마리가 되었습니다. 처음에 날아간 참새는 몇 마리입니까?',
      svg(sprite('bird',240,6,155),660,175,'참새 이야기의 삽화'),25,
      '새로 온 8마리를 빼면 날아간 직후에는 17-8=9마리가 있었습니다. 처음 34마리 중 9마리가 남았으므로 날아간 참새는 34-9=25마리입니다.',{initial:34,arrived:8,final:17});
    const machine=(x,input,output)=>`<g class="vertical-number-machine">${txt(x,25,input,27)}<path d="M${x} 44v19m-6-7 6 7 6-7" fill="none" stroke="#2788c4" stroke-width="2.5"/>${rect(x-40,73,80,80,'#eaf5fc')}${txt(x,113,'수 상자',18)}<path d="M${x} 165v22m-6-7 6 7 6-7" fill="none" stroke="#2788c4" stroke-width="2.5"/>${txt(x,211,output,27)}</g>`;
    add('r2-number-machines','수','수 상자에 수를 넣으면 일정한 규칙에 따라 다른 수가 나옵니다. 각 물음에서 수 상자는 모두 같은 규칙으로 움직입니다. 빈칸에 들어갈 수를 쓰세요.',
      svg(txt(24,113,'(1)',18)+machine(89,8,4)+machine(184,14,7)+machine(279,18,'□')+txt(350,113,'(2)',18)+machine(415,4,10)+machine(510,9,15)+machine(605,'□',20),660,235),[9,14],
      '(1) 들어간 수를 똑같이 둘로 나눈 수가 나옵니다. 18을 반으로 나누면 9입니다. (2) 들어간 수보다 6 큰 수가 나옵니다. □+6=20이므로 □=14입니다.',{half:18,increase:6,end:20});
    const mirrorPolygon=[[1,1],[4,0],[5,2],[3,3],[4,5],[1,4]],mirrorAnswer=mirrorPolygon.map(([x,y])=>[12-x,y]);
    const mirrorDrawing=(answer=false)=>{
      const grid=Array.from({length:13},(_,i)=>line(150+i*30,35,150+i*30,215)).join('')+Array.from({length:7},(_,i)=>line(150,35+i*30,510,35+i*30)).join('');
      const polygon=(points,fill)=>`<polygon points="${points.map(([x,y])=>`${150+x*30},${35+y*30}`).join(' ')}" fill="${fill}" stroke="#2788c4" stroke-width="2.5"/>`;
      return svg(`<g opacity=".30">${grid}</g>`+polygon(mirrorPolygon,'#cbe9f7')+(answer?polygon(mirrorAnswer,'#ffe3ac'):'')+`<path d="M330 29V221" stroke="#9a6aba" stroke-width="4"/>`+txt(330,19,'거울',18),660,235,'모눈 위 다각형과 세로 거울');
    };
    add('r2-grid-mirror-polygon','도형','모눈종이에 그린 파란 도형의 오른쪽에 거울을 세웠습니다. 보라색 선이 거울이 놓인 자리입니다. 거울에 비친 도형은 어떤 모습일지 생각하여 오른쪽 빈 모눈에 그리세요.',
      mirrorDrawing(),mirrorAnswer,
      '거울에 비친 도형은 위아래 높이가 그대로이고 왼쪽과 오른쪽이 바뀝니다. 각 꼭짓점에서 거울까지의 칸 수를 세어 오른쪽에도 같은 칸 수만큼 떨어진 점을 찍고, 원래 도형과 같은 순서로 이으면 됩니다.',{vertices:mirrorPolygon,mirrorX:6,columns:12,rows:6});
    questions.at(-1).solutionDiagram=mirrorDrawing(true);
    add('r2-object-position','논리추리','책상 위에 가위, 필통, 지우개, 연필을 한 줄로 놓았습니다. 다음 설명을 모두 만족하도록 앞에서부터 물건의 이름을 빈칸에 차례대로 쓰세요.',
      box(['연필은 가장 뒤에 있습니다.','지우개는 가위보다 뒤에 있고, 연필보다 앞에 있습니다.','필통은 지우개 바로 앞에 있습니다.'])+`<div class="table-direction">앞 ${table(['','','',''])} 뒤</div>`,['가위','필통','지우개','연필'],
      '연필을 맨 뒤에 둡니다. 지우개 바로 앞에 필통을 놓아야 하고, 가위는 지우개보다 앞에 있어야 합니다. 지우개를 둘째 자리에 놓으면 가위를 놓을 수 없으므로 지우개는 셋째입니다. 순서는 가위, 필통, 지우개, 연필입니다.',{items:['가위','필통','지우개','연필']});
    let growing='';for(let n=1;n<=4;n++){const x=30+(n-1)*158;for(let k=0;k<2*n+1;k++)growing+=rect(x+(k%n)*24,25+Math.floor(k/n)*26,22,22,'#cbdbe6');growing+=txt(x+42,132,n+'번째',18);}
    add('r2-growing-tile-sequence','논리추리','색종이 조각의 수를 같은 규칙으로 늘려 가며 모양을 만들었습니다. 앞의 모양을 살펴보고, 여섯째 모양과 일곱째 모양에 사용한 조각 수의 합을 구하세요.',svg(growing),28,
      '사용한 조각은 3, 5, 7, 9개로 두 개씩 늘어납니다. 다섯째 11개, 여섯째 13개, 일곱째 15개이므로 합은 13+15=28개입니다.',{counts:[3,5,7,9],positions:[6,7]});
    add('r2-orange-reverse','지문이해','바구니에 있던 귤 중 6개를 먹었습니다. 그 뒤 아버지가 귤 15개를 더 넣어 주셔서 모두 28개가 되었습니다. 처음에 바구니에 들어 있던 귤은 몇 개입니까?',
      '',19,
      '아버지가 넣기 전에는 28-15=13개입니다. 먹기 전에는 6개가 더 있었으므로 13+6=19개입니다.',{ate:6,added:15,final:28});
    add('r2-digit-constraint','수','상자에 적힌 설명은 모두 같은 두 자리 수에 대한 것입니다. 설명을 빠짐없이 읽고, 그 수보다 9 작은 수를 구하세요.',box(['짝수입니다.','십의 자리 숫자와 일의 자리 숫자의 합은 13입니다.','십의 자리 숫자는 일의 자리 숫자보다 1 큽니다.']),67,
      '합이 13이고 십의 자리 숫자가 1 크므로 두 숫자는 7과 6입니다. 짝수인 76이 조건을 모두 만족합니다. 마지막으로 9 작은 수를 구해야 하므로 76-9=67입니다.',{digitSum:13,tensExcess:1,subtract:9});
    const nested=(x,order)=>{let s='',r=61;order.forEach(kind=>{const half=r/Math.sqrt(2);s+=kind==='circle'?`<circle cx="${x}" cy="80" r="${r}" fill="none" stroke="#425a70" stroke-width="1.7"/>`:kind==='square'?rect(x-half,80-half,half*2,half*2,'none'):`<path d="M${x} ${80-r}L${x+r*.866} ${80+r/2}H${x-r*.866}Z" fill="none" stroke="#425a70" stroke-width="1.7"/>`;r*=kind==='circle'?.86:kind==='square'?.62:.44;});return s;};
    add('r2-nested-shape-order','도형','왼쪽 그림이 화살표를 따라 어떻게 바뀌었는지 살펴보세요. 같은 방법으로 오른쪽 그림을 바꿀 때, 새 그림의 가장 바깥쪽 도형과 가장 안쪽 도형을 차례대로 쓰세요.',
      svg(nested(86,['square','circle','triangle'])+txt(165,80,'→',30)+nested(242,['triangle','circle','square'])+txt(327,80,':',27)+nested(413,['circle','triangle','square'])+txt(491,80,'→',30)+rect(535,29,105,105)),['정사각형','원'],
      '왼쪽은 바깥 정사각형과 안쪽 삼각형의 순서만 바뀌고 가운데 원은 그대로입니다. 오른쪽은 바깥 원과 안쪽 정사각형을 바꾸므로 바깥은 정사각형, 가운데는 삼각형, 안쪽은 원입니다.',{initial:['circle','triangle','square']});
    const seat=[[330,25],[440,96],[398,208],[263,208],[220,96]];
    add('r2-circular-seating','논리추리','다섯 친구가 둥근 탁자 둘레에 앉았습니다. 다음 설명의 시계 방향은 그림에서 시계 바늘이 도는 방향입니다. 지우의 자리를 기준으로 시계 방향으로 나머지 네 친구의 이름을 쓰세요.',
      `<div class="seating-layout">${box(['서아는 지우에서 시계 방향으로 한 사람 건너 앉았습니다.','민호는 서아에서 시계 방향으로 바로 다음에 앉았습니다.','다은은 지우와 서아 두 사람 모두의 바로 옆에 앉았습니다.','하준은 남은 자리에 앉았습니다.'])}${svg(`<circle cx="330" cy="121" r="63" fill="#edf2f5" stroke="#7890a2"/>`+seat.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="27" fill="white" stroke="#536b7f"/>${txt(x,y,i===0?'지우':'',17)}`).join(''),660,250)}</div>`,['다은','서아','민호','하준'],
      '지우를 첫 자리로 보면 서아는 시계 방향으로 셋째 자리입니다. 사이의 둘째 자리는 다은, 서아 바로 다음 넷째 자리는 민호입니다. 마지막 다섯째 자리에 하준이 앉습니다.',{order:['지우','다은','서아','민호','하준']});
    add('r2-card-distribution','수','1부터 8까지 적힌 숫자 카드를 네 친구가 두 장씩 나누어 가졌습니다. 카드를 빠뜨리거나 두 번 쓰지 않았습니다. 각 친구의 카드에 적힌 수의 합이 다음과 같을 때, 빈칸에 카드 두 장의 수를 쓰세요.',
      svg(Array.from({length:8},(_,i)=>rect(34+i*77,12,50,42)+txt(59+i*77,34,i+1,24)).join(''),660,70)+table(['가은: 합 15','나연: 합 9','다솔: 합 8','라온: 합 4']),[[7,8],[4,5],[2,6],[1,3]],
      '합 15는 7과 8뿐이고, 합 4는 1과 3뿐입니다. 남은 2, 4, 5, 6 중 합 9는 4와 5입니다. 남은 2와 6의 합이 8이 됩니다.',{cards:[1,2,3,4,5,6,7,8],sums:[15,9,8,4]});
    const beam=(x,y,left,right,tilt)=>{
      const cy=y+50,dy=tilt*10;return `<circle cx="${x+42}" cy="${cy-dy-27}" r="23" fill="#edf2fa" stroke="#62798d"/>${txt(x+42,cy-dy-27,left,20)}<circle cx="${x+197}" cy="${cy+dy-27}" r="23" fill="#edf2fa" stroke="#62798d"/>${txt(x+197,cy+dy-27,right,20)}`+line(x+12,cy-dy,x+72,cy-dy)+line(x+167,cy+dy,x+227,cy+dy)+line(x+42,cy-dy,x+197,cy+dy)+`<path d="M${x+120} ${cy+3} l-13 21 h26Z" fill="#b6c8d8"/>`;
    };
    add('r2-weight-transitivity','논리추리','네 가지 구슬의 무게를 양팔저울로 비교하였습니다. 저울의 아래로 내려간 쪽이 더 무겁습니다. 가장 무거운 구슬의 번호를 쓰고, 가장 가벼운 구슬의 번호를 모두 쓰세요.',
      svg(beam(30,12,'①','②',1)+beam(365,12,'②','③',1)+beam(197,123,'①','④',0),660,235),[3,'1번과 4번'],
      '첫째 저울에서 ②가 ①보다 무겁고, 둘째 저울에서 ③이 ②보다 무겁습니다. 셋째 저울은 ①과 ④의 무게가 같습니다. 따라서 가장 무거운 것은 ③, 가장 가벼운 것은 ①과 ④입니다.',{relations:[[2,1],[3,2]],equal:[1,4]});
    add('r2-ticket-inventory','지문이해','유나는 놀이기구 이용권 20장을 가지고 있었습니다. 친구에게 4장을 주고, 기차와 회전목마를 한 번씩 탔습니다. 안내판을 보고, 유나에게 남은 이용권은 몇 장인지 구하세요.',
      box(['기차: 한 번 탈 때 이용권 3장을 냅니다.','회전목마: 한 번 탈 때 이용권 5장을 냅니다.','관람차: 한 번 탈 때 이용권 6장을 냅니다.']),8,
      '친구에게 준 뒤에는 20-4=16장입니다. 기차에 3장, 회전목마에 5장을 썼으므로 16-3-5=8장이 남습니다. 타지 않은 관람차의 6장은 빼지 않습니다.',{initial:20,gift:4,used:[3,5],unused:6});
    // Four dominoes around a square; the four side sums must each be ten.
    const domino=(x,y,a,b,vertical=false)=>rect(x,y,vertical?46:92,vertical?92:46)+line(x+(vertical?0:46),y+(vertical?46:0),x+46,y+46)+txt(x+23,y+23,a,21)+txt(x+(vertical?23:69),y+(vertical?69:23),b,21);
    add('r2-domino-side-sums','수','도미노 네 장을 그림과 같이 놓았습니다. 큰 정사각형의 위쪽, 오른쪽, 아래쪽, 왼쪽에 놓인 수의 합이 각각 10이 되도록 빈칸을 채우세요. 같은 도미노는 두 번 사용할 수 없습니다.',
      svg(domino(200,5,'',1)+domino(300,5,'',2,true)+domino(254,105,'',3)+domino(200,59,'',4,true),660,165),[4,5,3,2],
      '아래쪽은 □+3+4=10이므로 빈칸은 3입니다. 오른쪽은 □+2+3=10이므로 5입니다. 위쪽은 □+1+5=10이므로 4입니다. 왼쪽은 4+□+4=10이므로 2입니다. 도미노는 (4,1), (5,2), (3,3), (2,4)로 서로 다릅니다.',{target:10,fixed:[1,2,3,4]});
    const foldOptions=[[0,2],[1,3],[0,1],[2,3]];
    let fold=rect(32,38,112,112)+line(88,38,88,150,'stroke-dasharray="5 4"')+txt(88,177,'접기 전',16)+txt(180,95,'→',28)+rect(219,38,56,112,'#eef3f7')+`<circle cx="244.2" cy="68.8" r="8.4" fill="#354d65"/>`+txt(247,177,'접은 뒤',16);
    fold+=foldOptions.map((filled,i)=>{const x=322+(i%2)*149,y=18+Math.floor(i/2)*110;return rect(x,y,80,80)+filled.map(k=>`<circle cx="${x+(k%2?58:22)}" cy="${y+(k<2?22:58)}" r="6" fill="#354d65"/>`).join('')+txt(x+102,y+40,['①','②','③','④'][i],19);}).join('');
    add('r2-paper-hole-unfold','도형','정사각형 종이의 왼쪽 절반을 오른쪽으로 접었습니다. 접힌 종이의 위쪽에 그림처럼 구멍 하나를 뚫었습니다. 종이를 다시 펼친 모양을 찾아 번호에 동그라미 하세요.',svg(fold,660,235),3,
      '왼쪽을 오른쪽으로 접었으므로 구멍은 세로 접는 선을 기준으로 양쪽에 생깁니다. 구멍의 위아래 높이는 바뀌지 않아 위쪽 좌우에 두 구멍이 있는 ③입니다.',{fold:'vertical',holeRow:0,options:foldOptions});
    let eq='';const fruitLine=(y,kinds,ops,total)=>{let x=180;for(let i=0;i<kinds.length;i++){eq+=sprite(kinds[i],x,y,48);x+=57;if(i<kinds.length-1){eq+=txt(x,y+24,ops[i],23);x+=27;}}eq+=txt(x+9,y+24,'=',22)+txt(x+57,y+24,total,24);};
    fruitLine(5,['apple','apple','apple'],['+','+'],12);fruitLine(60,['apple','berry'],['+'],11);fruitLine(115,['berry','pear'],['-'],2);fruitLine(170,['apple','berry','pear'],['+','+'],'□');
    add('r2-fruit-equations','수','같은 종류의 과일은 항상 같은 수를 나타냅니다. 앞의 식을 차례로 살펴보고, 마지막 식의 네모 안에 들어갈 수를 구하세요.',svg(eq,660,230),16,
      '사과 3개의 합이 12이므로 사과는 4입니다. 4+딸기=11이므로 딸기는 7입니다. 7-배=2이므로 배는 5입니다. 따라서 4+7+5=16입니다.',{triple:12,pair:11,difference:2});
    add('r2-number-reference-reading','지문이해','지수가 수수께끼 카드에 어떤 수에 대한 설명을 적었습니다. 카드의 두 문장을 모두 읽고, 지수가 마지막에 묻는 수를 구하세요.',
      box(['어떤 수보다 16 작은 수는 23입니다.','그 어떤 수보다 16 큰 수는 얼마일까요?']),55,
      '어떤 수는 23+16=39입니다. 그 어떤 수보다 16 큰 수를 구하므로 39+16=55입니다. 23에 16을 한 번만 더한 39는 중간에 구한 수입니다.',{less:16,result:23,more:16});
    const balance=root.HFChallengeBalance||(typeof require==='function'?require('./balance-diagram.js'):null);
    const weightPans=[{left:['apple','berry'],right:['orange','berry'],tilt:12},{left:['pear'],right:['orange'],tilt:-12},{left:['pear'],right:['berry'],tilt:12}];
    add('r2-three-balance-order','논리추리','같은 종류의 과일은 무게가 서로 같습니다. 아래 세 저울을 모두 살펴보고, 사과·배·귤·딸기를 무거운 것부터 가벼운 것까지 차례대로 쓰세요.',
      svg(weightPans.map((p,i)=>balance.render(4+i*220,210,p.left,p.right,p.tilt)).join(''),660,190,'네 가지 과일의 무게를 비교하는 세 양팔저울'),['사과','귤','배','딸기'],
      '첫째 저울의 양쪽에서 딸기 한 개씩을 빼면 사과가 귤보다 무겁습니다. 둘째 저울에서는 귤이 배보다 무겁고, 셋째에서는 배가 딸기보다 무겁습니다. 따라서 무거운 순서는 사과 → 귤 → 배 → 딸기입니다.',{kinds:['apple','pear','orange','berry'],pans:weightPans});
    add('r2-days-inclusive','지문이해','서준이는 월요일부터 토요일까지 하루에 문제를 2개씩 풀기로 하였습니다. 그런데 수요일에는 풀지 못했고, 토요일에는 약속한 수보다 3개 더 풀었습니다. 이 기간에 서준이가 푼 문제는 모두 몇 개입니까?',
      table(['월','화','수','목','금','토']),13,
      '월요일부터 토요일까지는 6일입니다. 수요일을 빼면 5일 동안 2개씩 풀어 10개입니다. 토요일에 3개를 더 풀었으므로 10+3=13개입니다.',{days:6,skip:1,perDay:2,extra:3});
    const triangleLines=line(330,15,206,185)+line(330,15,454,185)+line(206,185,454,185)+line(330,15,289,185)+line(330,15,371,185)+line(268,100,392,100);
    add('r2-triangle-enumeration','도형','그림에 그어진 선을 따라 그릴 수 있는 삼각형은 모두 몇 개입니까?',svg(triangleLines),12,
      '맨 위 꼭짓점에서 내려오는 선은 4개입니다. 그중 두 선을 골라 삼각형의 양옆으로 쓰는 방법은 6가지입니다. 밑변을 가운데 가로선에 놓는 6개와 아래 가로선에 놓는 6개를 합하면 12개입니다.',{rays:4,bases:2,vertices:[[330,15],[206,185],[289,185],[371,185],[454,185]],middleY:100});
    const logicNames=['가은','나래','다솔','라온'],logicFruits=['사과','배','딸기','귤'],logicTotals=[3,2,1,2],logicAnswer=[[1,1,0,0],[0,1,0,1],[1,0,1,0],[1,0,0,1]];
    const logicTable=(filled=false)=>`<table class="edition-table fruit-logic-table"><thead><tr><th></th>${logicFruits.map(f=>`<th>${f}</th>`).join('')}</tr></thead><tbody>${logicNames.map((n,r)=>`<tr><th>${n}</th>${logicFruits.map((_,c)=>`<td>${filled?(logicAnswer[r][c]?'○':'×'):''}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    add('r2-fruit-logic-table','논리추리','네 친구는 사과·배·딸기·귤 중 각각 두 가지를 좋아합니다. 아래 설명을 읽고, 좋아하는 과일에는 ○, 좋아하지 않는 과일에는 ×를 표시하여 표를 완성하세요.',
      `<div class="fruit-logic-layout">${box(['가은이는 사과와 배를 좋아합니다.','나래는 배와 귤을 좋아합니다.','다솔이는 귤을 좋아하지 않습니다.',`사과를 좋아하는 친구는 ${logicTotals[0]}명이고, 배를 좋아하는 친구는 ${logicTotals[1]}명입니다.`,`딸기를 좋아하는 친구는 ${logicTotals[2]}명이고, 귤을 좋아하는 친구는 ${logicTotals[3]}명입니다.`])}${logicTable()}</div>`,logicAnswer,
      '가은과 나래를 표시하면 배를 좋아하는 두 명이 모두 정해집니다. 다솔은 배와 귤을 좋아하지 않으므로 사과와 딸기를 좋아합니다. 사과를 좋아하는 친구는 세 명, 귤은 두 명이어야 하므로 라온은 사과와 귤을 좋아합니다.',{names:logicNames,fruits:logicFruits,totals:logicTotals,likesPerPerson:2,known:{0:[0,1],1:[1,3]},dislikes:{2:[3]}});
    const answerLabels=['25마리','(1) 9  (2) 14','②, ③, ④','앞부터 가위 → 필통 → 지우개 → 연필','28개','19개','67','바깥쪽: 정사각형 / 안쪽: 원','지우 다음부터 다은 → 서아 → 민호 → 하준','가은: 7, 8 / 나연: 4, 5 / 다솔: 2, 6 / 라온: 1, 3','가장 무거운 것: ③ / 가장 가벼운 것: ①, ④','8장','위쪽 4 / 오른쪽 5 / 아래쪽 3 / 왼쪽 2','③','16','55','12개','13개','12개','①'];
    questions.forEach((q,i)=>{if(![3,17,20].includes(q.number))q.answerHtml=answerLabels[i];});
    questions[2].answerHtml='오른쪽 풀이 그림 참고';
    questions[16].answerHtml='사과 → 귤 → 배 → 딸기';
    questions[19].answerHtml='가은: 사과·배 / 나래: 배·귤 / 다솔: 사과·딸기 / 라온: 사과·귤';
    return {id:'challenge-mock-2',round:2,title:'챌린지 모의고사',status:'review',editionId:'challenge-r2-independent-v1',generationPolicy:'fixed-authored',questionCount:20,layout:{paper:'A4 portrait',questionsPerPage:3,coverPage:1,blankPage:2,watermarkLines:3},answerMode:'solutions',questions};
  }
  const replacements=root.HFChallengeReplacements || (typeof require==='function'?require('./exam-replacements.js'):null);
  const apply=exam=>{if(!replacements)throw new Error('추가 유형 구성이 로드되지 않았습니다.');return replacements.apply(exam);};
  const api=Object.freeze({reviseRound1:exam=>apply(reviseRound1(exam)),makeRound2:()=>apply(makeRound2()),rectangleGroups,arrowPath});
  root.HFChallengeEditions=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
