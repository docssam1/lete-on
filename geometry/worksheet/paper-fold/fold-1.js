const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=(list)=>list[R(0,list.length-1)];

/* ===== 접기 엔진 (연속 도형) =====
   접기를 "반평면으로 자르기"로 다룬다. 가로·세로뿐 아니라 대각선도 같은 방식이다.
   keep(p) >= 0 인 쪽이 남는 조각, 나머지는 접혀서 그 위에 포개진다. */
const FOLDS = {
  v : { keep:p=>0.5-p.x,   mirror:p=>({x:1-p.x,y:p.y}),   label:'세로'   },
  h : { keep:p=>0.5-p.y,   mirror:p=>({x:p.x,y:1-p.y}),   label:'가로'   },
  d1: { keep:p=>p.x-p.y,   mirror:p=>({x:p.y,y:p.x}),     label:'대각선' },
  d2: { keep:p=>1-p.x-p.y, mirror:p=>({x:1-p.y,y:1-p.x}), label:'대각선' }
};
function clipHalfPlane(poly, keep){
  const out=[];
  for(let i=0;i<poly.length;i++){
    const a=poly[i], b=poly[(i+1)%poly.length];
    const da=keep(a), db=keep(b);
    if(da>=-1e-9) out.push(a);
    if((da>1e-9&&db<-1e-9)||(da<-1e-9&&db>1e-9)){
      const t=da/(da-db);
      out.push({x:a.x+(b.x-a.x)*t, y:a.y+(b.y-a.y)*t});
    }
  }
  return out;
}
function polyArea(poly){
  let s=0;
  for(let i=0;i<poly.length;i++){const a=poly[i], b=poly[(i+1)%poly.length]; s+=a.x*b.y-b.x*a.y;}
  return Math.abs(s)/2;
}
const centroid=(poly)=>({x:poly.reduce((s,p)=>s+p.x,0)/poly.length, y:poly.reduce((s,p)=>s+p.y,0)/poly.length});
function edgeDist(poly,p){
  let best=Infinity;
  for(let i=0;i<poly.length;i++){
    const a=poly[i], b=poly[(i+1)%poly.length];
    const dx=b.x-a.x, dy=b.y-a.y, l2=dx*dx+dy*dy;
    const t=l2===0?0:Math.max(0,Math.min(1,((p.x-a.x)*dx+(p.y-a.y)*dy)/l2));
    best=Math.min(best, Math.hypot(p.x-(a.x+dx*t), p.y-(a.y+dy*t)));
  }
  return best;
}
function inPoly(poly,p){
  let ins=false;
  for(let i=0,j=poly.length-1;i<poly.length;j=i,i++){
    const a=poly[i], b=poly[j];
    if((a.y>p.y)!==(b.y>p.y) && p.x < (b.x-a.x)*(p.y-a.y)/(b.y-a.y)+a.x) ins=!ins;
  }
  return ins;
}
function foldSegment(poly, dir){
  const {keep}=FOLDS[dir];
  const pts=[];
  for(let i=0;i<poly.length;i++){
    const a=poly[i], b=poly[(i+1)%poly.length];
    const da=keep(a), db=keep(b);
    if(Math.abs(da)<1e-9) pts.push(a);
    if((da>1e-9&&db<-1e-9)||(da<-1e-9&&db>1e-9)){
      const t=da/(da-db); pts.push({x:a.x+(b.x-a.x)*t, y:a.y+(b.y-a.y)*t});
    }
  }
  if(pts.length<2) return null;
  let best=null, far=-1;
  for(let i=0;i<pts.length;i++) for(let j=i+1;j<pts.length;j++){
    const d=Math.hypot(pts[i].x-pts[j].x, pts[i].y-pts[j].y);
    if(d>far){far=d; best=[pts[i],pts[j]];}
  }
  return far>1e-6 ? best : null;
}

/* ===== 유형 1·2: 구멍 개수 ===== */
function genHole(diagonal,difficulty='mid'){
  let dirs;
  if(diagonal){
    const foldCount=difficulty==='easy'?1:difficulty==='mid'?2:3;
    dirs=[pick(['d1','d2'])];
    while(dirs.length<foldCount) dirs.push(pick(['v','h','d1','d2']));
  } else {
    const n=difficulty==='easy'?1:difficulty==='hard'?2:R(1,2), first=pick(['v','h']);
    dirs = n===1 ? [first] : [first, first==='v'?'h':'v'];
  }
  const nHoles = difficulty==='easy'?1:difficulty==='hard'?R(1,2):R(1,dirs.length===1?2:1);
  const margin = diagonal ? 0.05 : 0.07;

  let poly=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  const stages=[];
  for(const d of dirs){ stages.push({poly, fold:d}); poly=clipHalfPlane(poly, FOLDS[d].keep); }
  stages.push({poly, fold:null});

  const holes=[]; let tries=0;
  while(holes.length<nHoles && tries<800){
    tries++;
    const p={x:Math.random(), y:Math.random()};
    if(!inPoly(poly,p)) continue;
    if(edgeDist(poly,p)<margin) continue;
    if(holes.some(o=>Math.hypot(o.x-p.x,o.y-p.y)<margin*2.4)) continue;
    holes.push(p);
  }
  if(holes.length<nHoles) return genHole(diagonal,difficulty);

  // 접는 선이 이미 조각의 가장자리이면 실제로는 접히지 않는다(같은 방향 연속 등).
  for(let i=0;i<dirs.length;i++){
    if(polyArea(stages[i+1].poly) >= polyArea(stages[i].poly)-1e-9) return genHole(diagonal,difficulty);
  }
  // 답을 2의 거듭제곱으로 가정하지 않고 실제로 되접어 세어 확인한다.
  let pts=holes.map(h=>({...h}));
  for(let i=dirs.length-1;i>=0;i--){
    const mirror=FOLDS[dirs[i]].mirror;
    const next=[...pts];
    for(const p of pts){
      const r=mirror(p);
      if(!next.some(q=>Math.hypot(q.x-r.x,q.y-r.y)<1e-6)) next.push(r);
    }
    if(next.some(q=>!inPoly(stages[i].poly,q))) return genHole(diagonal,difficulty);
    pts=next;
  }
  if(pts.length!==nHoles*2**dirs.length) return genHole(diagonal,difficulty);

  const times=['','한 번','두 번','세 번'][dirs.length];
  return {
    kind:'hole', dirs, stages, holes, unfolded:pts, nHoles, answer:pts.length,
    text:[`아래와 같이 색종이를 ${diagonal?'대각선을 따라':'반으로'} ${times} 접은 다음 구멍을 ${nHoles}개 뚫었습니다.`,
          '색종이를 펼쳤을 때, 구멍은 모두 몇 개입니까?'],
    info:`접기 ${dirs.length}회 (${dirs.map(k=>FOLDS[k].label+':'+k).join(' → ')}) · 구멍 ${nHoles}개 · 정답 ${pts.length}개`,
    src:''
  };
}

/* ===== 유형 3·4: 수가 쓰인 색종이 (교재 41·50쪽 문법) =====
   4x4 숫자판을 가로로 한 번, 세로로 한 번 접는다. 교재는 항상 가로 접기가 먼저다
   (중간 조각이 넓은 직사각형). 접는 방향(위로/아래로, 왼쪽으로/오른쪽으로)에 따라
   접힌 묶음이 원본의 어느 사분면에 놓이는지가 정해지고, 색칠 칸이 가리키는 원본
   칸도 그에 따라 달라진다. 잘리는 칸은 색칠 칸의 거울 궤도 {r,3-r} x {c,3-c} 네 개. */
function genNumber(askCut, preset, difficulty='mid'){
  const N=4;
  const numberMax=difficulty==='easy'?4:difficulty==='hard'?9:6;
  const grid = preset ? preset.grid.map(row=>[...row])
                      : Array.from({length:N},()=>Array.from({length:N},()=>R(1,numberMax)));
  const hDir = preset ? preset.hDir : pick(['up','down']);     // up: 아래가 위로 / down: 위가 아래로
  const vDir = preset ? preset.vDir : pick(['left','right']);  // left: 오른쪽이 왼쪽으로 / right: 왼쪽이 오른쪽으로
  const packetRow = hDir==='up' ? 0 : 2;                       // 접힌 묶음이 놓이는 사분면
  const packetCol = vDir==='left' ? 0 : 2;

  const cutCount = preset ? 1 : difficulty==='easy'?1:difficulty==='hard'?2:R(1,2);
  const cells=[];                                              // 묶음 안 좌표 (0~1, 0~1)
  if(preset){ cells.push({...preset.cell}); }
  else while(cells.length<cutCount){
    const c={r:R(0,1), c:R(0,1)};
    if(!cells.some(o=>o.r===c.r&&o.c===c.c)) cells.push(c);
  }

  const removed=new Set();
  for(const cell of cells){
    const gr=packetRow+cell.r, gc=packetCol+cell.c;            // 색칠 칸의 원본 좌표
    for(const r of [gr, N-1-gr]) for(const c of [gc, N-1-gc]) removed.add(r*N+c);
  }

  let total=0, cut=0;
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    total+=grid[r][c];
    if(removed.has(r*N+c)) cut+=grid[r][c];
  }
  const remain=total-cut;
  if(remain<=0) return genNumber(askCut,null,difficulty);

  return {
    kind:'number', grid, hDir, vDir, packetRow, packetCol, cells, removed, total, cut, remain,
    answer: askCut ? cut : remain,
    text:[`다음과 같이 수가 쓰인 색종이를 접어서 색칠된 부분을 자른 후 펼쳤을 때,`,
          askCut ? '잘려나간 수들의 합을 구하시오.' : '남아 있는 수들의 합을 구하시오.'],
    info:`가로 ${hDir==='up'?'위로':'아래로'} → 세로 ${vDir==='left'?'왼쪽으로':'오른쪽으로'} · 색칠 ${cells.length}칸 · 잘린 칸 ${removed.size}개(합 ${cut}) · 전체 ${total} · 남은 합 ${remain}`,
    src:''
  };
}

/* ===== 유형 6: 수가 쓰인 색종이 — 대각선 한 번 접기 (실전 1회 18번·2회 15번 유형) =====
   4x4 숫자판을 대각선으로 한 번 접고, 접힌 삼각형 위에 색칠한 부분을 잘라낸다.
   대각선에서 떨어진 온전한 칸은 거울짝 {(r,c),(c,r)}이 함께 잘리고,
   대각선 위에 걸친 칸은 반쪽 두 겹이 곧 그 칸의 양쪽 반이라 그 칸 하나만 잘린다. */
function genDiagNumber(askCut,difficulty='mid'){
  const N=4;
  const numberMax=difficulty==='easy'?4:difficulty==='hard'?9:6;
  const grid=Array.from({length:N},()=>Array.from({length:N},()=>R(1,numberMax)));
  const keepLower=Math.random()<0.5;              // true: 아래 삼각형이 남고 위가 접혀 내려온다 (r>c 쪽)
  const inKeep=(r,c)=> keepLower ? r>c : c>r;

  // 색칠 단위: 남은 삼각형의 온전한 칸(6개) + 대각선 반칸(4개)
  const units=[];
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    if(inKeep(r,c)) units.push({r,c,half:false});
    if(r===c) units.push({r,c,half:true});
  }
  // 연결된 묶음을 무작위로 키운다 — 교재·시험 그림이 전부 이어진 한 덩어리다
  const key=(u)=>u.r+','+u.c;
  const adj=(a,b)=>Math.abs(a.r-b.r)+Math.abs(a.c-b.c)===1;
  const want=R(3,5);
  const start=units[R(0,units.length-1)];
  const region=[start];
  let guard=0;
  while(region.length<want && guard<200){
    guard++;
    const cand=units.filter(u=>!region.some(v=>key(v)===key(u)) && region.some(v=>adj(u,v)));
    if(!cand.length) break;
    region.push(cand[R(0,cand.length-1)]);
  }
  if(!region.some(u=>!u.half)) return genDiagNumber(askCut,difficulty);   // 온전한 칸이 하나도 없으면 거울 효과가 없다

  const removed=new Set();
  for(const u of region){
    removed.add(u.r*N+u.c);
    if(!u.half) removed.add(u.c*N+u.r);
  }
  let total=0, cut=0;
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    total+=grid[r][c];
    if(removed.has(r*N+c)) cut+=grid[r][c];
  }
  const remain=total-cut;
  if(remain<=0 || cut<=0) return genDiagNumber(askCut,difficulty);

  return {
    kind:'diag-number', grid, keepLower, region, removed, total, cut, remain,
    answer: askCut ? cut : remain,
    text:['색종이를 한 번 접은 후 칠해진 부분을 잘라내었습니다.',
          askCut ? '잘려나간 부분에 있는 수들의 합을 구하시오.' : '남아 있는 수들의 합을 구하시오.'],
    info:`대각선 접기(${keepLower?'위→아래':'아래→위'}) · 색칠 ${region.length}단위 · 잘린 칸 ${removed.size}개(합 ${cut}) · 전체 ${total} · 남은 합 ${remain}`,
    src:''
  };
}

function renderDiagNumber(ctx,d){
  header(ctx, d.text);
  const size=230, baseY=130, ox=90, u=size/4;
  // 펼친 자리(유령): 옅은 바탕 + 옅은 점선 격자
  ctx.fillStyle='#fdeeec'; ctx.fillRect(ox,baseY,size,size);
  ctx.strokeStyle='#eec6c1'; ctx.lineWidth=1; ctx.setLineDash([5,4]);
  for(let k=0;k<=4;k++){
    ctx.beginPath(); ctx.moveTo(ox+k*u,baseY); ctx.lineTo(ox+k*u,baseY+size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox,baseY+k*u); ctx.lineTo(ox+size,baseY+k*u); ctx.stroke();
  }
  ctx.setLineDash([]);
  // 접힌 두 겹 삼각형: 진한 바탕 + 실선 테두리 (대각선 y=x, keepLower면 아래쪽)
  const tri = d.keepLower
    ? [{x:0,y:0},{x:0,y:4},{x:4,y:4}]
    : [{x:0,y:0},{x:4,y:0},{x:4,y:4}];
  ctx.beginPath();
  tri.forEach((p,i)=>{const X=ox+p.x*u, Y=baseY+p.y*u; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y);});
  ctx.closePath();
  ctx.fillStyle='#fbdad6'; ctx.fill();
  ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=2.4; ctx.stroke();
  // 삼각형 안 격자
  ctx.save(); ctx.clip();
  ctx.strokeStyle='#e8b7b1'; ctx.lineWidth=1;
  for(let k=1;k<4;k++){
    ctx.beginPath(); ctx.moveTo(ox+k*u,baseY); ctx.lineTo(ox+k*u,baseY+size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox,baseY+k*u); ctx.lineTo(ox+size,baseY+k*u); ctx.stroke();
  }
  // 색칠: 온전한 칸은 사각형, 대각선 칸은 접힌 쪽 반쪽 삼각형
  ctx.fillStyle=CUT;
  for(const q of d.region){
    const X=ox+q.c*u, Y=baseY+q.r*u;
    if(!q.half){ ctx.fillRect(X,Y,u,u); continue; }
    ctx.beginPath();
    if(d.keepLower){ ctx.moveTo(X,Y); ctx.lineTo(X,Y+u); ctx.lineTo(X+u,Y+u); }
    else           { ctx.moveTo(X,Y); ctx.lineTo(X+u,Y); ctx.lineTo(X+u,Y+u); }
    ctx.closePath(); ctx.fill();
  }
  ctx.restore();
  // 접는 방향 화살표: 접혀 온 쪽 유령의 중심 → 그 거울점
  const g=d.keepLower ? {x:2.6,y:1.4} : {x:1.4,y:2.6};
  const m={x:g.y,y:g.x};
  const sx=ox+g.x*u, sy=baseY+g.y*u, ex=ox+m.x*u, ey=baseY+m.y*u;
  ctx.strokeStyle=ARROW; ctx.fillStyle=ARROW; ctx.lineWidth=4; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo((sx+ex)/2+14,(sy+ey)/2+14,ex,ey); ctx.stroke();
  const ang=Math.atan2(ey-((sy+ey)/2+14), ex-((sx+ex)/2+14));
  ctx.beginPath();
  ctx.moveTo(ex+5*Math.cos(ang), ey+5*Math.sin(ang));
  ctx.lineTo(ex-11*Math.cos(ang-0.5), ey-11*Math.sin(ang-0.5));
  ctx.lineTo(ex-11*Math.cos(ang+0.5), ey-11*Math.sin(ang+0.5));
  ctx.closePath(); ctx.fill();
  // 오른쪽: 펼친 숫자판 전체 (교재 문법 — 잘린 칸을 지우지 않는다)
  let x=ox+size+40; drawStepArrow(ctx, x, baseY+size/2); x+=64;
  drawNumberGrid(ctx, d.grid, x, baseY, size);
}

/* ===== 유형 7: 접고 선 따라 자르기 — 조각 개수 (교재 39·43쪽·실전 유형) =====
   자르는 선은 접은 선이 아니라 접힌 조각 위에 그은 선이다(대각선 X, 모서리 클립).
   조각 수는 공식이 없다 — 잘린 선을 거울 반사로 펼친 뒤, 종이 평면을 가는 격자로
   깔고 차단 셀을 표시해 실제로 몇 덩어리로 나뉘는지 센다. 두 해상도가 일치할 때만 낸다. */
function unfoldSegments(segs, dirs){
  let cur=segs.map(s=>[{...s[0]},{...s[1]}]);
  for(let i=dirs.length-1;i>=0;i--){
    const mirror=FOLDS[dirs[i]].mirror;
    cur=cur.concat(cur.map(sg=>[mirror(sg[0]),mirror(sg[1])]));
  }
  return cur;
}
function countPieces(segs, N){
  const blocked=new Uint8Array(N*N);
  for(const [a,b] of segs){
    const steps=Math.max(2, Math.ceil(Math.hypot(b.x-a.x,b.y-a.y)*N*8));
    for(let k=0;k<=steps;k++){
      const t=k/steps;
      const ci=Math.min(N-1,Math.max(0,Math.floor((a.x+(b.x-a.x)*t)*N)));
      const cj=Math.min(N-1,Math.max(0,Math.floor((a.y+(b.y-a.y)*t)*N)));
      blocked[cj*N+ci]=1;
    }
  }
  let count=0;
  const seen=new Uint8Array(N*N), stack=[];
  for(let start=0;start<N*N;start++){
    if(blocked[start]||seen[start]) continue;
    count++; seen[start]=1; stack.push(start);
    while(stack.length){
      const v=stack.pop(), vi=v%N;
      if(vi>0   && !blocked[v-1] && !seen[v-1]){seen[v-1]=1; stack.push(v-1);}
      if(vi<N-1 && !blocked[v+1] && !seen[v+1]){seen[v+1]=1; stack.push(v+1);}
      if(v-N>=0   && !blocked[v-N] && !seen[v-N]){seen[v-N]=1; stack.push(v-N);}
      if(v+N<N*N  && !blocked[v+N] && !seen[v+N]){seen[v+N]=1; stack.push(v+N);}
    }
  }
  return count;
}
function genPieces(){
  const dirs = pick([['h'],['v'],['h','v'],['v','h']]);
  let poly=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  const stages=[];
  for(const d of dirs){ stages.push({poly, fold:d}); poly=clipHalfPlane(poly, FOLDS[d].keep); }
  stages.push({poly, fold:null});
  // 접힌 조각은 항상 [0,w]x[0,h] 직사각형 (가로·세로 접기의 keep이 왼쪽·위쪽이므로)
  const w=Math.max(...poly.map(p=>p.x)), h=Math.max(...poly.map(p=>p.y));
  const diagA=[{x:0,y:0},{x:w,y:h}], diagB=[{x:0,y:h},{x:w,y:0}];
  const clips=[
    [{x:w/2,y:0},{x:0,y:h/2}], [{x:w/2,y:0},{x:w,y:h/2}],
    [{x:0,y:h/2},{x:w/2,y:h}], [{x:w,y:h/2},{x:w/2,y:h}]
  ];
  const cutChoice=pick(['X','A','B','clip1','clip2']);
  const cuts = cutChoice==='X' ? [diagA,diagB]
             : cutChoice==='A' ? [diagA]
             : cutChoice==='B' ? [diagB]
             : cutChoice==='clip1' ? [pick(clips)]
             : (()=>{ const a=R(0,3); let b=R(0,3); while(b===a) b=R(0,3); return [clips[a],clips[b]]; })();

  const unfolded=unfoldSegments(cuts, dirs);
  const n1=countPieces(unfolded, 401), n2=countPieces(unfolded, 643);
  if(n1!==n2 || n1<2 || n1>24) return genPieces();

  const times=['','한 번','두 번'][dirs.length];
  return {
    kind:'pieces', dirs, stages, cuts, unfolded, answer:n1,
    text:[`정사각형 모양의 색종이를 다음과 같이 ${times} 접어서 선을 따라 잘랐을 때,`,
          '모두 몇 조각이 되는지 구하시오.'],
    info:`접기 ${dirs.length}회 (${dirs.join(' → ')}) · 자르는 선 ${cuts.length}개(${cutChoice}) · 정답 ${n1}조각`,
    src:''
  };
}

function renderPieces(ctx,d){
  header(ctx, d.text);
  const n=d.stages.length, size=170, gap=52, baseY=150;
  let x=50;
  d.stages.forEach((stage,i)=>{
    drawPoly(ctx, stage.poly, x, baseY, size);
    if(stage.fold){
      drawCrease(ctx, foldSegment(stage.poly, stage.fold), x, baseY, size);
      drawFoldArrow(ctx, stage.poly, stage.fold, x, baseY, size);
    } else {
      // 자르는 선 + 가위
      ctx.strokeStyle=CUT; ctx.lineWidth=2.6;
      for(const [a,b] of d.cuts){
        ctx.beginPath();
        ctx.moveTo(x+a.x*size, baseY+a.y*size);
        ctx.lineTo(x+b.x*size, baseY+b.y*size);
        ctx.stroke();
        const ang=Math.atan2(b.y-a.y, b.x-a.x);
        ctx.save();
        ctx.translate(x+a.x*size-10*Math.cos(ang), baseY+a.y*size-10*Math.sin(ang));
        ctx.rotate(ang);
        ctx.font='18px sans-serif'; ctx.fillStyle='#444';
        ctx.fillText('✂', -6, 6);
        ctx.restore();
      }
    }
    x+=size+14;
    if(i<n-1){ drawStepArrow(ctx, x, baseY+size/2); x+=gap; }
  });
  // 펼친 종이(작업용) — 접은 선만 점선으로, 자른 선은 그리지 않는다
  x+=gap-14; drawStepArrow(ctx, x-38, baseY+size/2);
  drawPoly(ctx, [{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}], x+14, baseY, size);
  ctx.setLineDash([6,5]); ctx.strokeStyle=CREASE; ctx.lineWidth=1.6;
  for(const dd of d.dirs){
    ctx.beginPath();
    if(dd==='v'){ ctx.moveTo(x+14+size/2, baseY+3); ctx.lineTo(x+14+size/2, baseY+size-3); }
    else        { ctx.moveTo(x+14+3, baseY+size/2); ctx.lineTo(x+14+size-3, baseY+size/2); }
    ctx.stroke();
  }
  ctx.setLineDash([]);
}

/* ===== 유형 8: 반원·원 펀치 — 모양별 개수 =====
   접힌 조각의 안쪽에는 원을, 가장자리에는 반원(평평한 면이 가장자리에 붙게)을 뚫는다.
   접은 선 위의 반원은 펼치면 거울짝과 붙어 온전한 원이 되고,
   원래 가장자리의 반원은 반원인 채로 거울 수만큼 늘어난다.
   개수는 병합 논리로 세고, 독립적으로 격자 래스터 분할로 재검산한다. */
function genPunch(){
  const dirs = pick([['h'],['v'],['h','v'],['v','h']]);
  let poly=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  const stages=[];
  for(const d of dirs){ stages.push({poly, fold:d}); poly=clipHalfPlane(poly, FOLDS[d].keep); }
  stages.push({poly, fold:null});
  const w=Math.max(...poly.map(pt=>pt.x)), h=Math.max(...poly.map(pt=>pt.y));
  const hasV=dirs.includes('v'), hasH=dirs.includes('h');
  // 접힌 조각의 네 가장자리: 오른쪽(x=w)은 v 접은 선, 아래(y=h)는 h 접은 선
  const edges=[
    {name:'left',  crease:false}, {name:'top', crease:false},
    {name:'right', crease:hasV},  {name:'bottom', crease:hasH}
  ];
  const punches=[];
  const rOf=()=>0.05+Math.random()*0.02;
  const clash=(cx,cy,r)=>punches.some(q=>Math.hypot(q.cx-cx,q.cy-cy)<q.r+r+0.05);
  let guard=0;
  while(punches.filter(q=>q.type==='full').length<1 && guard++<300){
    const r=rOf();
    const cx=r+0.05+Math.random()*(w-2*(r+0.05)), cy=r+0.05+Math.random()*(h-2*(r+0.05));
    if(!clash(cx,cy,r)) punches.push({type:'full',cx,cy,r});
  }
  const wantHalf=R(1,2);
  while(punches.filter(q=>q.type==='half').length<wantHalf && guard++<600){
    const e=pick(edges), r=rOf(), t=0.18+Math.random()*0.64;
    let cx,cy,nx=0,ny=0;
    if(e.name==='left'){cx=0; cy=t*h; nx=-1;}
    else if(e.name==='right'){cx=w; cy=t*h; nx=1;}
    else if(e.name==='top'){cy=0; cx=t*w; ny=-1;}
    else {cy=h; cx=t*w; ny=1;}
    if(e.name==='left'||e.name==='right'){ if(cy<r+0.06||cy>h-r-0.06) continue; }
    else { if(cx<r+0.06||cx>w-r-0.06) continue; }
    if(clash(cx,cy,r)) continue;
    punches.push({type:'half',cx,cy,r,nx,ny,edge:e.name,crease:e.crease});
  }
  if(punches.filter(q=>q.type==='half').length<1 || punches.filter(q=>q.type==='full').length<1) return genPunch();

  // 펼치기: 조각을 거울로 복제 (반원의 법선도 반사). 같은 자리·같은 법선은 중복이므로 안 넣는다.
  let pieces=punches.map(q=>({...q}));
  for(let i=dirs.length-1;i>=0;i--){
    const mirror=FOLDS[dirs[i]].mirror;
    const add=pieces.map(q=>{
      const m=mirror({x:q.cx,y:q.cy});
      const out={...q,cx:m.x,cy:m.y};
      if(q.type==='half'){ if(dirs[i]==='v') out.nx=-q.nx; if(dirs[i]==='h') out.ny=-q.ny; }
      return out;
    });
    for(const q of add){
      if(!pieces.some(pp=>Math.hypot(pp.cx-q.cx,pp.cy-q.cy)<1e-9 && pp.type===q.type
        && (pp.type==='full' || (pp.nx===q.nx && pp.ny===q.ny)))) pieces.push(q);
    }
  }
  // 병합: 같은 중심·반지름에 법선이 반대인 반원 두 개 = 온전한 원
  const merged=[], used=new Array(pieces.length).fill(false);
  for(let i=0;i<pieces.length;i++){
    if(used[i]) continue;
    const a=pieces[i];
    if(a.type==='full'){ merged.push({kind:'circle',cx:a.cx,cy:a.cy,r:a.r}); used[i]=true; continue; }
    let mate=-1;
    for(let j=i+1;j<pieces.length;j++){
      if(used[j]) continue;
      const b=pieces[j];
      if(b.type==='half' && Math.hypot(a.cx-b.cx,a.cy-b.cy)<1e-9 && Math.abs(a.r-b.r)<1e-9
        && a.nx===-b.nx && a.ny===-b.ny){ mate=j; break; }
    }
    used[i]=true;
    if(mate>=0){ used[mate]=true; merged.push({kind:'circle',cx:a.cx,cy:a.cy,r:a.r}); }
    else merged.push({kind:'semi',cx:a.cx,cy:a.cy,r:a.r,nx:a.nx,ny:a.ny});
  }
  // 남은 반원의 평평한 면은 반드시 펼친 종이의 가장자리에 있어야 한다 — 아니면 병합이 틀렸다는 뜻
  for(const m of merged) if(m.kind==='semi'){
    const onEdge=(m.nx===-1&&Math.abs(m.cx)<1e-9)||(m.nx===1&&Math.abs(m.cx-1)<1e-9)
              ||(m.ny===-1&&Math.abs(m.cy)<1e-9)||(m.ny===1&&Math.abs(m.cy-1)<1e-9);
    if(!onEdge) return genPunch();
  }
  const circles=merged.filter(m=>m.kind==='circle').length;
  const semis=merged.filter(m=>m.kind==='semi').length;

  const times=['','한 번','두 번'][dirs.length];
  return {
    kind:'punch', dirs, stages, punches, pieces, merged, circles, semis,
    answer:`반원 ${semis}개, 원 ${circles}개`,
    text:[`다음 그림과 같이 색종이를 ${times} 접은 후 펀치로 반원과 원을 뚫었습니다.`,
          '색종이를 펼쳤을 때 반원과 원 모양이 각각 몇 개씩 나오는지 구하시오.'],
    info:`접기 ${dirs.length}회 (${dirs.join(' → ')}) · 펀치 ${punches.length}개 → 반원 ${semis}·원 ${circles}`,
    src:''
  };
}
