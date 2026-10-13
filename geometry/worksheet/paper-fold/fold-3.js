/* ===== 렌더 공통 ===== */
const PAPER='#f9c8c4', PAPER_EDGE='#e8968f', CREASE='#d4756c', ARROW='#c0392b', CUT='#b03a5b';

function drawPoly(ctx, poly, ox, oy, size){
  ctx.beginPath();
  poly.forEach((p,i)=>{ const X=ox+p.x*size, Y=oy+p.y*size; i?ctx.lineTo(X,Y):ctx.moveTo(X,Y); });
  ctx.closePath();
  ctx.fillStyle=PAPER; ctx.fill();
  ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=2.5; ctx.stroke();
}
function drawCrease(ctx, seg, ox, oy, size){
  if(!seg) return;
  ctx.setLineDash([7,6]); ctx.strokeStyle=CREASE; ctx.lineWidth=2;
  ctx.beginPath();
  ctx.moveTo(ox+seg[0].x*size, oy+seg[0].y*size);
  ctx.lineTo(ox+seg[1].x*size, oy+seg[1].y*size);
  ctx.stroke(); ctx.setLineDash([]);
}
// 접히는 쪽 무게중심에서 그 거울점으로 넘어가는 굵은 호. 어느 쪽이 어디로 가는지 보여준다.
function drawFoldArrow(ctx, poly, dir, ox, oy, size){
  const {keep, mirror}=FOLDS[dir];
  const away=clipHalfPlane(poly, p=>-keep(p));
  if(away.length<3) return;
  const from=centroid(away), to=mirror(from);
  const sx=ox+from.x*size, sy=oy+from.y*size, ex=ox+to.x*size, ey=oy+to.y*size;
  const nx=-(ey-sy), ny=ex-sx, len=Math.hypot(nx,ny)||1;
  const cpx=(sx+ex)/2+nx/len*Math.min(38,size*0.22), cpy=(sy+ey)/2+ny/len*Math.min(38,size*0.22);
  ctx.strokeStyle=ARROW; ctx.fillStyle=ARROW; ctx.lineWidth=6; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(sx,sy); ctx.quadraticCurveTo(cpx,cpy,ex,ey); ctx.stroke();
  const ang=Math.atan2(ey-cpy, ex-cpx);
  ctx.beginPath();
  ctx.moveTo(ex+8*Math.cos(ang), ey+8*Math.sin(ang));
  ctx.lineTo(ex-16*Math.cos(ang-0.5), ey-16*Math.sin(ang-0.5));
  ctx.lineTo(ex-16*Math.cos(ang+0.5), ey-16*Math.sin(ang+0.5));
  ctx.closePath(); ctx.fill();
}
function drawStepArrow(ctx,x,y){
  ctx.strokeStyle='#95a5a6'; ctx.fillStyle='#95a5a6'; ctx.lineWidth=4;
  ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+40,y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+40,y); ctx.lineTo(x+29,y-8); ctx.lineTo(x+29,y+8); ctx.closePath(); ctx.fill();
}
function drawHoles(ctx, holes, ox, oy, size, r){
  for(const h of holes){
    ctx.beginPath(); ctx.arc(ox+h.x*size, oy+h.y*size, r, 0, Math.PI*2);
    ctx.fillStyle='#fff'; ctx.fill(); ctx.strokeStyle=ARROW; ctx.lineWidth=2.2; ctx.stroke();
  }
}
// 문항 번호. v4_2 시안이 교재 4번을 흉내 낸 '4'를 그대로 물려받아 유형과 무관하게
// 늘 4번으로 찍히고 있었다. 랩에서는 "새 문제"를 누를 때마다 1부터 세어 올린다.
let questionNumber = 0;
function header(ctx, lines){
  ctx.fillStyle='#16417C'; ctx.font='900 26px sans-serif';
  ctx.fillText(String(questionNumber), 30, 46);
  ctx.fillStyle='#333'; ctx.font='600 21px sans-serif';
  lines.forEach((line,i)=>ctx.fillText(line, 66, 44+i*32));
}

/* ===== 렌더: 구멍 유형 ===== */
function renderHole(ctx,d){
  header(ctx, d.text);
  const n=d.stages.length, size=n<=3?200:168, gap=n<=3?62:48, baseY=150;
  let x=50;
  d.stages.forEach((stage,i)=>{
    drawPoly(ctx, stage.poly, x, baseY, size);
    if(stage.fold){
      drawCrease(ctx, foldSegment(stage.poly, stage.fold), x, baseY, size);
      drawFoldArrow(ctx, stage.poly, stage.fold, x, baseY, size);
    } else {
      drawHoles(ctx, d.holes, x, baseY, size, size>180?13:11);
    }
    x+=size+14;
    if(i<n-1){ drawStepArrow(ctx, x, baseY+size/2); x+=gap; }
  });
}

function uniqueHolePoints(points){
  const seen=new Set();
  return points.filter(p=>{
    const key=Math.round(p.x*10000)+','+Math.round(p.y*10000);
    if(seen.has(key)) return false;
    seen.add(key); return true;
  });
}

function renderHoleSolution(ctx,d){
  ctx.fillStyle='#fff'; ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
  ctx.fillStyle='#17345f'; ctx.font='900 24px sans-serif';
  ctx.fillText('접은 순서를 거꾸로 펼쳐 구멍의 위치를 확인합니다.',38,48);
  let points=d.holes.map(p=>({x:p.x,y:p.y}));
  const panels=[{poly:d.stages[d.stages.length-1].poly,points:points.map(p=>({...p}))}];
  for(let i=d.dirs.length-1;i>=0;i--){
    points=uniqueHolePoints(points.concat(points.map(p=>FOLDS[d.dirs[i]].mirror(p))));
    panels.push({poly:d.stages[i].poly,points:points.map(p=>({...p}))});
  }
  const size=panels.length>3?185:220, gap=panels.length>3?52:72, baseY=130;
  let x=44;
  panels.forEach((panel,i)=>{
    drawPoly(ctx,panel.poly,x,baseY,size);
    drawHoles(ctx,panel.points,x,baseY,size,size>200?12:10);
    ctx.fillStyle='#b34b68'; ctx.font='800 18px sans-serif'; ctx.textAlign='center';
    ctx.fillText(panel.points.length+'개',x+size/2,baseY+size+30);
    ctx.textAlign='left';
    x+=size+12;
    if(i<panels.length-1){
      drawStepArrow(ctx,x,baseY+size/2); x+=gap;
      ctx.fillStyle='#68766f'; ctx.font='700 14px sans-serif';
      ctx.fillText('펼치기',x-gap+2,baseY+size/2+28);
    }
  });
}

/* ===== 렌더: 수 유형 — 교재 4단계 =====
   [숫자판+접선+화살표1] → [접힌 중간(뒷면, 숫자 없음)+화살표2] → [접힌 2x2에 색칠] → [다시 펼친 숫자판] */
function drawNumberGrid(ctx, grid, ox, oy, size){
  const N=grid.length, cell=size/N;
  // 종이 바탕
  ctx.fillStyle=PAPER; ctx.fillRect(ox,oy,size,size);
  // 칸 경계는 옅은 점선, 가운데 접는선 두 개는 진한 점선 (교재 문법)
  ctx.strokeStyle='#e0aaa4'; ctx.lineWidth=1; ctx.setLineDash([4,3]);
  for(let k=1;k<N;k++){
    ctx.beginPath(); ctx.moveTo(ox+k*cell,oy); ctx.lineTo(ox+k*cell,oy+size); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(ox,oy+k*cell); ctx.lineTo(ox+size,oy+k*cell); ctx.stroke();
  }
  ctx.setLineDash([7,5]); ctx.strokeStyle=CREASE; ctx.lineWidth=1.8;
  ctx.beginPath(); ctx.moveTo(ox+size/2,oy); ctx.lineTo(ox+size/2,oy+size); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(ox,oy+size/2); ctx.lineTo(ox+size,oy+size/2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.font='600 '+Math.round(cell*0.5)+'px sans-serif';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillStyle='#333';
  for(let r=0;r<N;r++) for(let c=0;c<N;c++)
    ctx.fillText(String(grid[r][c]), ox+c*cell+cell/2, oy+r*cell+cell/2+1);
  ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=2.5; ctx.strokeRect(ox,oy,size,size);
  ctx.textAlign='left'; ctx.textBaseline='alphabetic';
}
// 겹이 진 종이 느낌 — 뒤에 살짝 어긋난 테두리 하나
function layeredRect(ctx, x, y, w, h){
  ctx.strokeStyle='#e8c4bf'; ctx.lineWidth=2; ctx.strokeRect(x+3,y+3,w,h);
  ctx.fillStyle='#fbdad6'; ctx.fillRect(x,y,w,h);
  ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=2.2; ctx.strokeRect(x,y,w,h);
}
// 종이 가장자리를 넘어가는 작은 말림 화살표 (교재 문법)
function edgeCurl(ctx, x1,y1, x2,y2, bulgeX, bulgeY){
  ctx.strokeStyle=ARROW; ctx.fillStyle=ARROW; ctx.lineWidth=3.4; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(x1,y1); ctx.quadraticCurveTo(bulgeX,bulgeY,x2,y2); ctx.stroke();
  const ang=Math.atan2(y2-bulgeY, x2-bulgeX);
  ctx.beginPath();
  ctx.moveTo(x2+6*Math.cos(ang), y2+6*Math.sin(ang));
  ctx.lineTo(x2-11*Math.cos(ang-0.5), y2-11*Math.sin(ang-0.5));
  ctx.lineTo(x2-11*Math.cos(ang+0.5), y2-11*Math.sin(ang+0.5));
  ctx.closePath(); ctx.fill();
}
function renderNumber(ctx,d){
  header(ctx, d.text);
  const size=190, baseY=140, half=size/2;
  let x=56;

  // ── 1) 원본 숫자판 + 첫 접기(가로) 말림 화살표: 종이 옆 가장자리에서 접선을 넘는 작은 호
  drawNumberGrid(ctx, d.grid, x, baseY, size);
  const ex = d.vDir==='left' ? x+size+12 : x-12;   // 화살표를 붙일 쪽 (둘째 접기와 겹치지 않게 반대쪽)
  if(d.hDir==='up') edgeCurl(ctx, ex, baseY+size*0.72, ex, baseY+size*0.30, ex+(d.vDir==='left'?16:-16), baseY+size/2);
  else              edgeCurl(ctx, ex, baseY+size*0.28, ex, baseY+size*0.70, ex+(d.vDir==='left'?16:-16), baseY+size/2);
  x+=size+34; drawStepArrow(ctx, x, baseY+size/2); x+=58;

  // ── 2) 접힌 중간: 넓은 직사각형(뒷면, 숫자 없음) + 세로 접선 + 둘째 접기 말림 화살표
  const midY = baseY + (d.hDir==='up' ? size*0.22 : size*0.28);
  layeredRect(ctx, x, midY, size, half);
  ctx.setLineDash([7,5]); ctx.strokeStyle=CREASE; ctx.lineWidth=1.8;
  ctx.beginPath(); ctx.moveTo(x+size/2, midY+4); ctx.lineTo(x+size/2, midY+half-4); ctx.stroke();
  ctx.setLineDash([]);
  const cy = d.hDir==='up' ? midY-12 : midY+half+12;   // 접힌 열린 쪽 반대 가장자리에
  if(d.vDir==='left') edgeCurl(ctx, x+size*0.72, cy, x+size*0.30, cy, x+size/2, cy+(d.hDir==='up'?-16:16));
  else                edgeCurl(ctx, x+size*0.28, cy, x+size*0.70, cy, x+size/2, cy+(d.hDir==='up'?-16:16));
  x+=size+22; drawStepArrow(ctx, x, baseY+size/2); x+=58;

  // ── 3) 접힌 2x2 묶음(뒷면) + 색칠 칸
  const py = baseY + size*0.25;
  layeredRect(ctx, x, py, half, half);
  ctx.setLineDash([6,4]); ctx.strokeStyle=CREASE; ctx.lineWidth=1.6;
  ctx.beginPath(); ctx.moveTo(x+half/2, py+3); ctx.lineTo(x+half/2, py+half-3); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x+3, py+half/2); ctx.lineTo(x+half-3, py+half/2); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle=CUT;
  for(const cell of d.cells) ctx.fillRect(x+cell.c*half/2, py+cell.r*half/2, half/2, half/2);
  x+=half+22; drawStepArrow(ctx, x, baseY+size/2); x+=58;

  // ── 4) 다시 펼친 숫자판 — 교재처럼 전부 보여준다 (잘린 칸을 지우지 않는다)
  drawNumberGrid(ctx, d.grid, x, baseY, size);
}

/* ===== 한 번 접기 게임의 두 유형 공용 문항 어댑터 =====
   게임의 levels.js를 그대로 읽어 학습지에서도 같은 문항 ID와 정답 근거를 쓴다. */
let sharedGameLevels=[];
const sharedModeLevel=(mode)=>Number(mode.replace('game-l',''));
const sharedAxisLabel={vertical:'세로',horizontal:'가로','diag-main':'왼쪽 위-오른쪽 아래 대각선','diag-anti':'오른쪽 위-왼쪽 아래 대각선'};

async function loadSharedGameLevels(){
  try{
    const module=await import('../../games/paper-fold/levels.js?v=paper-fold-14');
    module.validateLevels();
    sharedGameLevels=module.levels;
  }catch(error){
    console.error('게임 연계 문항을 불러오지 못했습니다.',error);
    document.querySelectorAll('.mode-button').forEach(button=>{
      if(button.textContent.includes('게임 연계')) button.disabled=true;
    });
  }
}

/* ===== 게임 연계 3단계: 접는 방법 거꾸로 찾기 =====
   게임 레벨 3의 문항(종이, 후보 접는 선, 한 번 접은 결과, 보기 모양)을 그대로 그린다.
   게임은 선을 직접 누르지만 학습지는 기호로 답하므로, 후보 선에 가·나·다를 붙인다.
   게임 데이터의 선 순서대로 붙이면 정답이 '가'·'나'에 몰리므로(12문항 중 '다' 1개)
   정답 자리를 고르게 나눈다(아래 REVERSE_LINE_SLOTS). 같은 문항은 언제나 같은 기호·번호다.
   규칙: 접힌 상태는 겹 수 숫자 없이 두께로만, 화살표는 정답 풀이의 첫 그림에만. */
const REVERSE_LINE_LABELS=['가','나','다'];
/* 정답 자리. 문항 수가 적어(종류마다 12문항) 무작위로 섞으면 한쪽으로 몰리기 쉬우므로,
   고르게 나누되 차례가 드러나지 않는 순서를 정해 둔다.
   접는 선: 가·나·다가 4번씩. 모두 고르기: 여섯 가지 두 자리(1·2, 1·3, 1·4, 2·3, 2·4, 3·4)가 2번씩. */
const REVERSE_LINE_SLOTS=[2,0,1,1,2,0,0,1,2,1,0,2];
const REVERSE_PAIRS=[[0,1],[0,2],[0,3],[1,2],[1,3],[2,3]];
const REVERSE_PAIR_SLOTS=[3,0,5,2,4,1,0,4,2,5,1,3];

function reverseIndex(level,source){
  return level.problems.filter(problem=>problem.interaction===source.interaction).findIndex(problem=>problem.id===source.id);
}

function buildReverseProblem(level){
  const source=level.problems[questionNumber%level.problems.length];
  const index=reverseIndex(level,source);
  if(source.interaction==='fold-line-pick'){
    const answer=source.lineChoices.find(choice=>choice.key===source.answerKey);
    const others=source.lineChoices.filter(choice=>choice!==answer);
    if(Math.floor(index/3)%2) others.reverse();
    const slot=REVERSE_LINE_SLOTS[index%REVERSE_LINE_SLOTS.length];
    const ordered=others.slice(); ordered.splice(slot,0,answer);
    const lines=ordered.map((choice,position)=>({...choice,label:REVERSE_LINE_LABELS[position]}));
    return {kind:'game-reverse',source,lines,answer:REVERSE_LINE_LABELS[slot],
      text:['색종이를 한 번 접었더니 오른쪽 모양이 되었습니다.','어느 선을 따라 접었는지 기호를 쓰세요.'],
      info:`${source.id} · 접는 선 고르기`,src:'게임과 동일한 확정 문항'};
  }
  const correct=source.resultOptions.filter(option=>source.answerKeys.includes(option.key));
  const wrong=source.resultOptions.filter(option=>!source.answerKeys.includes(option.key));
  if(index%2) correct.reverse();
  if(Math.floor(index/2)%2) wrong.reverse();
  const pair=REVERSE_PAIRS[REVERSE_PAIR_SLOTS[index%REVERSE_PAIR_SLOTS.length]];
  const ordered=[];
  for(let position=0;position<4;position+=1) ordered.push(pair.includes(position)?correct.shift():wrong.shift());
  const options=ordered.map((option,position)=>({...option,number:position+1}));
  const answer=pair.map(position=>`${position+1}번`).join(', ');
  return {kind:'game-reverse',source,options,answer,
    text:['왼쪽 종이를 한 번만 접어서 만들 수 있는 모양을 모두 고르세요.','정답은 두 개입니다.'],
    info:`${source.id} · 만들 수 있는 모양 모두 고르기`,src:'게임과 동일한 확정 문항'};
}

function reversePoint(frame,x,y,size,point){
  return {X:x+(point.x-frame.x)/frame.size*size,Y:y+(point.y-frame.y)/frame.size*size};
}
function reverseTrace(ctx,frame,x,y,size,polygon){
  ctx.beginPath();
  polygon.forEach((point,index)=>{ const q=reversePoint(frame,x,y,size,point); index?ctx.lineTo(q.X,q.Y):ctx.moveTo(q.X,q.Y); });
  ctx.closePath();
}
/* 여러 조각을 한 장처럼: 테두리를 먼저 모두 긋고 같은 조각으로 다시 덮어 안쪽 선을 지운다. */
function reverseSilhouette(ctx,frame,x,y,size,pieces,fill,edge,width){
  pieces.forEach(piece=>{ reverseTrace(ctx,frame,x,y,size,piece); ctx.fillStyle=fill; ctx.fill(); ctx.strokeStyle=edge; ctx.lineWidth=width; ctx.lineJoin='round'; ctx.stroke(); });
  pieces.forEach(piece=>{ reverseTrace(ctx,frame,x,y,size,piece); ctx.fillStyle=fill; ctx.fill(); });
}
function drawReverseFolded(ctx,frame,x,y,size,pieces,{thickness=6,layerEdge=null}={}){
  ctx.save();
  ctx.translate(thickness,thickness);
  reverseSilhouette(ctx,frame,x,y,size,pieces,'#eaa9a2',PAPER_EDGE,2.6);
  ctx.restore();
  reverseSilhouette(ctx,frame,x,y,size,pieces,PAPER,PAPER_EDGE,3);
  if(layerEdge){
    reverseTrace(ctx,frame,x,y,size,layerEdge);
    ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=1.4; ctx.globalAlpha=.85; ctx.stroke(); ctx.globalAlpha=1;
  }
}
function drawReversePaper(ctx,frame,x,y,size,paper){
  reverseTrace(ctx,frame,x,y,size,paper);
  ctx.fillStyle=PAPER; ctx.fill(); ctx.strokeStyle=PAPER_EDGE; ctx.lineWidth=2.6; ctx.lineJoin='round'; ctx.stroke();
}
function drawReverseCrease(ctx,frame,x,y,size,chord,{strong=false,faded=false}={}){
  const a=reversePoint(frame,x,y,size,chord[0]), b=reversePoint(frame,x,y,size,chord[1]);
  ctx.save();
  ctx.globalAlpha=faded?.35:1;
  ctx.setLineDash(strong?[]:[9,7]);
  ctx.strokeStyle=strong?ARROW:'#7c5d57'; ctx.lineWidth=strong?4:2.4;
  ctx.beginPath(); ctx.moveTo(a.X,a.Y); ctx.lineTo(b.X,b.Y); ctx.stroke();
  ctx.restore();
}
function drawReverseArrow(ctx,frame,x,y,size,arrow){
  const from=reversePoint(frame,x,y,size,arrow.from), to=reversePoint(frame,x,y,size,arrow.to);
  const angle=Math.atan2(to.Y-from.Y,to.X-from.X);
  ctx.save();
  ctx.strokeStyle=ARROW; ctx.fillStyle=ARROW; ctx.lineWidth=6; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(from.X,from.Y); ctx.lineTo(to.X-10*Math.cos(angle),to.Y-10*Math.sin(angle)); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(to.X+6*Math.cos(angle),to.Y+6*Math.sin(angle));
  ctx.lineTo(to.X-16*Math.cos(angle-0.5),to.Y-16*Math.sin(angle-0.5));
  ctx.lineTo(to.X-16*Math.cos(angle+0.5),to.Y-16*Math.sin(angle+0.5));
  ctx.closePath(); ctx.fill();
  ctx.restore();
}
/* 기호는 선의 한 끝을 종이 밖으로 조금 늘린 자리에 둔다. 종이 밖에 있는 끝을 먼저 쓰고
   (L자 종이의 안쪽 모서리처럼 끝이 종이 안이면 다른 끝), 다른 선에 24px 안으로 붙거나
   다른 기호와 34px 안이면 다른 끝을 쓴다. */
function reverseInside(polygon,point){
  let inside=false;
  for(let i=0,j=polygon.length-1;i<polygon.length;j=i,i+=1){
    const a=polygon[i], b=polygon[j];
    if((a.y>point.y)!==(b.y>point.y) && point.x<((b.x-a.x)*(point.y-a.y))/(b.y-a.y)+a.x) inside=!inside;
  }
  return inside;
}
function reverseLabelSpots(frame,x,y,size,lines,paper){
  const placed=[];
  return lines.map(line=>{
    const ends=[[line.chord[0],line.chord[1]],[line.chord[1],line.chord[0]]].map(([end,other])=>{
      const e=reversePoint(frame,x,y,size,end), o=reversePoint(frame,x,y,size,other);
      const length=Math.hypot(e.X-o.X,e.Y-o.Y)||1;
      const spot={X:e.X+(e.X-o.X)/length*22,Y:e.Y+(e.Y-o.Y)/length*22};
      const unitOf=(X,Y)=>({x:frame.x+(X-x)/size*frame.size,y:frame.y+(Y-y)/size*frame.size});
      /* 둘레 8방향 30px 중 종이에 닿는 수. L자 안쪽 모서리처럼 종이에 둘러싸인 자리는 크다. */
      const crowded=Array.from({length:8},(_,k)=>unitOf(spot.X+30*Math.cos(k*Math.PI/4),spot.Y+30*Math.sin(k*Math.PI/4))).filter(point=>reverseInside(paper,point)).length;
      return {...spot,outside:!reverseInside(paper,unitOf(spot.X,spot.Y)),crowded};
    });
    const gap=(spot)=>Math.min(Infinity,...placed.map(other=>Math.hypot(spot.X-other.X,spot.Y-other.Y)));
    const clear=(spot)=>Math.min(Infinity,...lines.filter(other=>other!==line).map(other=>{
      const a=reversePoint(frame,x,y,size,other.chord[0]), b=reversePoint(frame,x,y,size,other.chord[1]);
      const dx=b.X-a.X, dy=b.Y-a.Y, t=Math.max(0,Math.min(1,((spot.X-a.X)*dx+(spot.Y-a.Y)*dy)/(dx*dx+dy*dy||1)));
      return Math.hypot(spot.X-a.X-dx*t,spot.Y-a.Y-dy*t);
    }));
    const rank=(spot)=>((spot.outside?4:0)+(clear(spot)>=24?2:0)+(gap(spot)>=34?1:0))*10-spot.crowded;
    const spot=rank(ends[1])>rank(ends[0])?ends[1]:ends[0];
    placed.push(spot);
    return spot;
  });
}
function drawReverseLabel(ctx,spot,text,{correct=false}={}){
  ctx.save();
  ctx.beginPath(); ctx.arc(spot.X,spot.Y,15,0,Math.PI*2);
  ctx.fillStyle=correct?'#e9f6ee':'#fff'; ctx.fill();
  ctx.strokeStyle=correct?'#2e8b57':'#16417C'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle=correct?'#1f6d43':'#16417C'; ctx.font='900 17px sans-serif'; ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText(text,spot.X,spot.Y+1);
  ctx.restore();
}
function renderReverseGame(ctx,d,showAnswer=false){
  header(ctx,d.text);
  const p=d.source, frame=p.frame;
  ctx.fillStyle='#52616b'; ctx.font='700 16px sans-serif'; ctx.textAlign='left';
  ctx.fillText(`${p.id} · ${p.paperLabel?.ko||'종이'}`,54,112);
  ctx.textAlign='center';
  if(p.interaction==='fold-line-pick'){
    const size=330, left=150, top=140, right=760;
    drawReversePaper(ctx,frame,left,top,size,p.paper);
    const spots=reverseLabelSpots(frame,left,top,size,d.lines,p.paper);
    d.lines.forEach(line=>drawReverseCrease(ctx,frame,left,top,size,line.chord,{strong:showAnswer&&line.key===p.answerKey,faded:showAnswer&&line.key!==p.answerKey}));
    if(showAnswer){ const answer=d.lines.find(line=>line.key===p.answerKey); drawReverseArrow(ctx,frame,left,top,size,answer.arrow); }
    d.lines.forEach((line,index)=>drawReverseLabel(ctx,spots[index],line.label,{correct:showAnswer&&line.key===p.answerKey}));
    drawStepArrow(ctx,600,top+size/2);
    drawReverseFolded(ctx,frame,right,top,size,p.resultPieces);
    ctx.fillStyle='#4b5a5f'; ctx.font='800 16px sans-serif';
    ctx.fillText('펼친 종이',left+size/2,top+size+42);
    ctx.fillText('한 번 접은 모양',right+size/2,top+size+42);
    ctx.textAlign='left';
    return;
  }
  const size=300, left=70, top=150;
  drawReversePaper(ctx,frame,left,top,size,p.paper);
  if(showAnswer){
    p.creaseHints.forEach(hint=>drawReverseCrease(ctx,frame,left,top,size,hint.chord,{strong:true}));
    drawReverseArrow(ctx,frame,left,top,size,p.creaseHints[0].arrow);
  }
  ctx.fillStyle='#4b5a5f'; ctx.font='800 16px sans-serif';
  ctx.fillText('펼친 종이',left+size/2,top+size+42);
  const box=200, gap=14, startX=430, boxTop=165;
  d.options.forEach((option,index)=>{
    const bx=startX+index*(box+gap), correct=showAnswer&&p.answerKeys.includes(option.key);
    ctx.fillStyle=correct?'#f0faf3':'#fff'; ctx.fillRect(bx,boxTop,box,box);
    ctx.strokeStyle=correct?'#2e8b57':'#abb8b1'; ctx.lineWidth=correct?4:1.6; ctx.strokeRect(bx,boxTop,box,box);
    drawReverseFolded(ctx,frame,bx+16,boxTop+12,box-36,option.pieces,{thickness:5,layerEdge:option.pieces[1]||null});
    ctx.beginPath(); ctx.arc(bx+20,boxTop+20,14,0,Math.PI*2); ctx.fillStyle=correct?'#2e8b57':'#16417C'; ctx.fill();
    ctx.fillStyle='#fff'; ctx.font='900 15px sans-serif'; ctx.textBaseline='middle'; ctx.fillText(String(option.number),bx+20,boxTop+21); ctx.textBaseline='alphabetic';
  });
  ctx.textAlign='left';
}

/* ===== 두 번째 게임 코스: 접고 돌리고 뒤집기 ===== */
let turnGameLevels=[];
let turnOperations={};
const turnModeLevel=(mode)=>Number(mode.replace('turn-l',''));

async function loadTurnGameLevels(){
  try{
    const module=await import('../../games/paper-turn/levels.js?v=paper-turn-1');
    module.validateLevels();
    turnGameLevels=module.levels;
    turnOperations=module.operationMeta;
  }catch(error){
    console.error('돌리기·뒤집기 연계 문항을 불러오지 못했습니다.',error);
    document.querySelectorAll('.mode-button').forEach(button=>{
      if(button.textContent.includes('2코스')) button.disabled=true;
    });
  }
}

function buildTurnProblem(mode){
  const levelNumber=turnModeLevel(mode);
  const level=turnGameLevels[levelNumber-1];
  if(!level) return null;
  const source=level.problems[questionNumber%level.problems.length];
  const titles={1:'접힌 종이를 화살표 방향으로 뒤집은 결과를 고르세요.',2:'펼친 결과를 보고 접힌 종이의 자른 선을 되짚어 고르세요.',3:'모눈의 모양을 화살표 방향으로 돌린 결과를 고르세요.',4:'모눈의 모양을 거울선 방향으로 뒤집은 결과를 고르세요.',5:'화살표를 왼쪽부터 순서대로 적용한 마지막 모양을 고르세요.'};
  return {kind:'paper-turn',turnLevel:levelNumber,source,answer:`${source.answer+1}번`,text:[titles[levelNumber]],info:`${source.id} · 두 번째 색종이 코스`,src:'게임과 동일한 확정 문항'};
}

function drawTurnMatrix(ctx,matrix,x,y,size,{highlight=false}={}){
  const n=matrix.length,cell=size/n;
  ctx.save();ctx.fillStyle='#f7fbf9';ctx.fillRect(x,y,size,size);
  for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(matrix[r][c]){
    ctx.fillStyle=highlight?'#73bd91':'#de7569';ctx.fillRect(x+c*cell,y+r*cell,cell,cell);
    ctx.fillStyle='rgba(255,255,255,.34)';ctx.beginPath();ctx.arc(x+(c+.38)*cell,y+(r+.34)*cell,cell*.13,0,Math.PI*2);ctx.fill();
  }
  ctx.strokeStyle='#5b9fa6';ctx.lineWidth=1.5;
  for(let i=0;i<=n;i++){ctx.beginPath();ctx.moveTo(x+i*cell,y);ctx.lineTo(x+i*cell,y+size);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+i*cell);ctx.lineTo(x+size,y+i*cell);ctx.stroke();}
  ctx.restore();
}

function renderTurnGame(ctx,d,showAnswer=false){
  header(ctx,d.text);
  const p=d.source;
  drawTurnMatrix(ctx,p.start,80,145,220);
  ctx.fillStyle='#25313b';ctx.textAlign='center';ctx.font='800 16px sans-serif';ctx.fillText('시작 모양',190,390);
  const operationX=340,stepGap=94;
  p.operations.forEach((operation,index)=>{
    const meta=turnOperations[operation]||{};
    ctx.fillStyle='#e8f4ef';ctx.beginPath();ctx.arc(operationX+index*stepGap,255,34,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#17676c';ctx.font='900 38px sans-serif';ctx.fillText(meta.symbol||'→',operationX+index*stepGap,267);
    ctx.fillStyle='#536b6c';ctx.font='700 11px sans-serif';ctx.fillText(meta.ko||operation,operationX+index*stepGap,310);
  });
  const startX=590,choiceSize=170,gap=205;
  p.choices.forEach((matrix,index)=>{
    drawTurnMatrix(ctx,matrix,startX+index*gap,150,choiceSize,{highlight:showAnswer&&index===p.answer});
    ctx.fillStyle=showAnswer&&index===p.answer?'#228459':'#17345f';ctx.beginPath();ctx.arc(startX+index*gap+choiceSize/2,355,18,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#fff';ctx.font='900 16px sans-serif';ctx.fillText(String(index+1),startX+index*gap+choiceSize/2,361);
    if(showAnswer&&index===p.answer){ctx.strokeStyle='#228459';ctx.lineWidth=5;ctx.strokeRect(startX+index*gap-5,145,choiceSize+10,choiceSize+10);}
  });
  ctx.textAlign='left';
}

function sharedRegionLabel(region){
  const match=/^r(\d)c(\d)(?:-(ne|nw|se|sw))?$/.exec(region);
  if(!match) return region;
  const corner={ne:'오른쪽 위 삼각형',nw:'왼쪽 위 삼각형',se:'오른쪽 아래 삼각형',sw:'왼쪽 아래 삼각형'};
  return `${match[1]}행 ${match[2]}열${match[3]?` ${corner[match[3]]}`:''}`;
}

function buildSharedProblem(mode){
  const levelNumber=sharedModeLevel(mode);
  const level=sharedGameLevels[levelNumber-1];
  if(!level) return null;
  if(level.strand==='reverse-fold') return buildReverseProblem(level);
  const source=level.problems[questionNumber%level.problems.length];
  const prompts={
    1:['색종이를 한 번 또는 두 번 접어 선을 따라 잘랐습니다.','접은 순서의 반대로 펼쳐 절단선을 완성하고 조각 수를 구하세요.'],
    2:['색종이를 한 번 또는 두 번 접어 구멍을 뚫었습니다.','접은 순서의 반대로 펼쳐 구멍의 위치와 개수를 알아보세요.']
  };
  let answer='선 잇기';
  if(source.interaction==='piece-count') answer=`${source.pieceCount}조각`;
  if(source.interaction==='hole-count') answer=`${source.unfoldedPoints.length}개`;
  if(source.interaction==='hole-result') answer=`${source.choices.findIndex(choice=>choice.key===source.answer)+1}번`;
  if(source.completeOnUnfold) answer='펼친 모양';
  const foldNames=(source.folds||[source.fold]).map(step=>sharedAxisLabel[step.axis]).join(' → ');
  const text=source.interaction==='region-unfold'
    ? ['색종이를 접어 색칠한 부분을 잘랐습니다.','접은 순서의 반대로 펼친 뒤 잘린 부분을 그리세요.']
    : source.interaction==='mixed-hole-result'
      ? ['색종이를 두 번 접어 서로 다른 모양의 구멍을 뚫었습니다.','거꾸로 펼쳤을 때 구멍 모양과 위치를 그리세요.']
      : prompts[levelNumber];
  return {kind:'game-level',gameLevel:levelNumber,source,answer,text,info:`${source.id} · ${foldNames}`,src:'게임과 동일한 확정 문항'};
}

function sharedRegionPath(ctx,x,y,size,region){
  const match=/^r(\d)c(\d)(?:-(ne|nw|se|sw))?$/.exec(region);
  if(!match) return false;
  const cell=size/4,c=Number(match[2])-1,r=Number(match[1])-1,cx=x+c*cell,cy=y+r*cell;
  ctx.beginPath();
  if(!match[3]) ctx.rect(cx,cy,cell,cell);
  else{
    const points={
      ne:[[0,0],[1,0],[1,1]],nw:[[0,0],[1,0],[0,1]],
      se:[[1,0],[1,1],[0,1]],sw:[[0,0],[1,1],[0,1]]
    }[match[3]];
    points.forEach(([px,py],index)=>index?ctx.lineTo(cx+px*cell,cy+py*cell):ctx.moveTo(cx+px*cell,cy+py*cell));
    ctx.closePath();
  }
  return true;
}

function drawSharedCrease(ctx,x,y,size,axis){
  ctx.save();ctx.strokeStyle='#548bac';ctx.lineWidth=2;ctx.setLineDash([7,6]);ctx.beginPath();
  if(axis==='vertical'){ctx.moveTo(x+size/2,y);ctx.lineTo(x+size/2,y+size);}
  else if(axis==='horizontal'){ctx.moveTo(x,y+size/2);ctx.lineTo(x+size,y+size/2);}
  else if(axis==='diag-main'){ctx.moveTo(x,y);ctx.lineTo(x+size,y+size);}
  else{ctx.moveTo(x+size,y);ctx.lineTo(x,y+size);}
  ctx.stroke();ctx.restore();
}

function drawSharedGrid(ctx,x,y,size,{values=null,regions=[],axis=null,answer=false,markType='cut'}={}){
  const cell=size/4;
  ctx.save();ctx.fillStyle='#edf8fb';ctx.fillRect(x,y,size,size);
  regions.forEach(region=>{
    if(!sharedRegionPath(ctx,x,y,size,region)) return;
    if(markType==='punch'){
      const match=/^r(\d)c(\d)/.exec(region),cx=x+(Number(match[2])-.5)*cell,cy=y+(Number(match[1])-.5)*cell;
      ctx.save();ctx.clip();ctx.beginPath();ctx.arc(cx,cy,cell*.3,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.strokeStyle=answer?'#27835d':'#c4475d';ctx.lineWidth=4;ctx.stroke();ctx.restore();
    }else{
      ctx.fillStyle=answer?'rgba(63,164,118,.5)':'rgba(223,117,117,.28)';ctx.fill();ctx.strokeStyle=answer?'#27835d':'#c4475d';ctx.lineWidth=3;ctx.stroke();
    }
  });
  ctx.strokeStyle='#63a6c4';ctx.lineWidth=1.5;
  for(let i=0;i<=4;i++){ctx.beginPath();ctx.moveTo(x+i*cell,y);ctx.lineTo(x+i*cell,y+size);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+i*cell);ctx.lineTo(x+size,y+i*cell);ctx.stroke();}
  if(axis) drawSharedCrease(ctx,x,y,size,axis);
  if(values){ctx.fillStyle='#24323c';ctx.font=`600 ${Math.round(cell*.34)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';for(let r=0;r<4;r++)for(let c=0;c<4;c++)ctx.fillText(String(values[r][c]),x+(c+.5)*cell,y+(r+.5)*cell);}
  ctx.restore();
}

function drawSharedMark(ctx,x,y,size,point,type){
  const px=x+point[0]*size,py=y+point[1]*size;
  ctx.save();ctx.strokeStyle='#c4475d';ctx.fillStyle='rgba(196,71,93,.2)';ctx.lineWidth=4;
  if(type==='punch'){ctx.beginPath();ctx.arc(px,py,12,0,Math.PI*2);ctx.fill();ctx.stroke();}
  else{ctx.beginPath();ctx.moveTo(px-14,py+10);ctx.lineTo(px,py-12);ctx.lineTo(px+14,py+10);ctx.stroke();}
  ctx.restore();
}

function drawSharedShape(ctx,x,y,size,item,{answer=false}={}){
  ctx.save();ctx.translate(x+item.x*size,y+item.y*size);ctx.rotate((item.rotation||0)*Math.PI/180);ctx.scale(item.flipped?-1:1,1);
  ctx.fillStyle=answer?'rgba(63,164,118,.48)':'rgba(67,137,181,.35)';ctx.strokeStyle=answer?'#267b58':'#397da7';ctx.lineWidth=4;
  const unit=size*.12;ctx.beginPath();
  if(item.shape==='square') ctx.rect(-unit,-unit,unit*2,unit*2);
  else if(item.shape==='right-triangle'){ctx.moveTo(-unit,unit);ctx.lineTo(-unit,-unit);ctx.lineTo(unit,unit);ctx.closePath();}
  else{ctx.moveTo(0,-unit*1.15);ctx.lineTo(unit,unit);ctx.lineTo(-unit,unit);ctx.closePath();}
  ctx.fill();ctx.stroke();ctx.restore();
}

function sharedReflectPoint(point,axis){
  if(axis==='vertical') return {x:1-point.x,y:point.y};
  if(axis==='horizontal') return {x:point.x,y:1-point.y};
  if(axis==='diag-main') return {x:point.y,y:point.x};
  return {x:1-point.y,y:1-point.x};
}

function sharedFoldedPolygon(fold){
  const shapes={
    'vertical-left':[[.5,0],[1,0],[1,1],[.5,1]],'vertical-right':[[0,0],[.5,0],[.5,1],[0,1]],
    'horizontal-top':[[0,.5],[1,.5],[1,1],[0,1]],'horizontal-bottom':[[0,0],[1,0],[1,.5],[0,.5]],
    'diag-main-upper':[[0,0],[1,1],[0,1]],'diag-main-lower':[[0,0],[1,0],[1,1]],
    'diag-anti-upper':[[1,0],[1,1],[0,1]],'diag-anti-lower':[[0,0],[1,0],[0,1]]
  };
  return shapes[`${fold.axis}-${fold.side}`].map(([x,y])=>({x,y}));
}

function sharedTracePolygon(ctx,x,y,size,polygon){
  ctx.beginPath();
  polygon.forEach((point,index)=>index?ctx.lineTo(x+point.x*size,y+point.y*size):ctx.moveTo(x+point.x*size,y+point.y*size));
  ctx.closePath();
}

function drawSharedPaper(ctx,x,y,size,{polygon=null,folds=[],segments=[],holes=[],marks=[],answer=false}={}){
  const shape=polygon||[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}];
  ctx.save();
  sharedTracePolygon(ctx,x,y,size,shape);
  ctx.fillStyle='#f9dc72';ctx.fill();ctx.strokeStyle='#d19935';ctx.lineWidth=2.5;ctx.stroke();
  ctx.save();sharedTracePolygon(ctx,x,y,size,shape);ctx.clip();
  folds.forEach(step=>drawSharedCrease(ctx,x,y,size,step.axis));
  ctx.strokeStyle=answer?'#27835d':'#b03a5b';ctx.lineWidth=4;ctx.lineCap='round';ctx.lineJoin='round';
  segments.forEach(([a,b])=>{ctx.beginPath();ctx.moveTo(x+a.x*size,y+a.y*size);ctx.lineTo(x+b.x*size,y+b.y*size);ctx.stroke();});
  holes.forEach(point=>{ctx.beginPath();ctx.arc(x+point.x*size,y+point.y*size,Math.max(5,size*.045),0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();ctx.stroke();});
  marks.forEach(mark=>{
    ctx.save();
    ctx.fillStyle=mark.kind==='polygon'?'#ef8b91':'#fff';
    ctx.strokeStyle=answer?'#27835d':'#b03a5b';
    ctx.lineWidth=2.5;
    ctx.beginPath();
    if(mark.kind==='polygon') sharedTracePolygon(ctx,x,y,size,mark.points);
    else{
      const cx=x+mark.center.x*size,cy=y+mark.center.y*size,r=mark.radius*size;
      ctx.translate(cx,cy);
      ctx.rotate(Math.atan2(mark.direction.y,mark.direction.x));
      if(mark.parity==='mirrored') ctx.scale(1,-1);
      if(mark.shape==='circle') ctx.arc(0,0,r,0,Math.PI*2);
      else if(mark.shape==='triangle'){
        ctx.moveTo(0,-r);ctx.lineTo(Math.sqrt(3)*r/2,r/2);ctx.lineTo(-Math.sqrt(3)*r/2,r/2);ctx.closePath();
      }else{
        const h=r/Math.sqrt(2);ctx.rect(-h,-h,2*h,2*h);
      }
    }
    ctx.fill();ctx.stroke();ctx.restore();
  });
  ctx.restore();ctx.restore();
}

function sharedFinalPolygon(item){
  if(item.stagePolygons?.length) return item.stagePolygons[item.stagePolygons.length-1];
  return sharedFoldedPolygon(item.fold);
}

function sharedUnfoldText(problem){
  const names={left:'왼쪽',right:'오른쪽',top:'위쪽',bottom:'아래쪽',upper:'대각선 위쪽',lower:'대각선 아래쪽'};
  return problem.unfoldSteps.map((step,index)=>`${index+1}단계: ${names[step.answer]||step.answer}`).join('  ·  ');
}

function drawSharedFoldSequence(ctx,item,{startX=55,y=145,size=150,gap=195}={}){
  const stages=item.stagePolygons||[[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],sharedFinalPolygon(item)];
  stages.forEach((polygon,index)=>{
    const last=index===stages.length-1;
    drawSharedPaper(ctx,startX+index*gap,y,size,{polygon,folds:index<item.folds.length?[item.folds[index]]:[],segments:last?(item.cutSegments||[]):[],holes:last&&!item.completeOnUnfold?(item.punches||[]):[],marks:last&&item.completeOnUnfold?(item.cutMarks||item.punches||[]):[]});
    if(index<stages.length-1) drawStepArrow(ctx,startX+index*gap+size+12,y+size/2);
  });
}

function renderSharedSolo(ctx,p,showAnswer){
  const isDouble=p.interaction==='hole-result';
  if(p.completeOnUnfold){
    drawSharedFoldSequence(ctx,p,{startX:45,y:145,size:175,gap:230});
    const resultX=p.folds.length===2?805:595;
    drawStepArrow(ctx,resultX-72,245);
    drawSharedPaper(ctx,resultX,145,210,{folds:p.folds,marks:showAnswer?p.markStages.at(-1):[],answer:showAnswer});
    ctx.fillStyle='#52616b';ctx.font='700 15px sans-serif';
    ctx.fillText(showAnswer?'펼친 결과':'펼친 결과를 그려 보세요.',resultX,375);
  }else if(isDouble){
    drawSharedFoldSequence(ctx,p,{startX:45,y:150,size:130,gap:185});
    p.choices.forEach((choice,index)=>{
      const x=670+index*205,size=150,isCorrect=choice.key===p.answer;
      drawSharedPaper(ctx,x,155,size,{folds:p.folds,holes:choice.points,answer:showAnswer&&isCorrect});
      ctx.fillStyle=showAnswer&&isCorrect?'#27835d':'#17345f';ctx.beginPath();ctx.arc(x+size/2,335,17,0,Math.PI*2);ctx.fill();
      ctx.fillStyle='#fff';ctx.textAlign='center';ctx.font='900 15px sans-serif';ctx.fillText(String(index+1),x+size/2,341);
      if(showAnswer&&isCorrect){ctx.strokeStyle='#27835d';ctx.lineWidth=5;ctx.strokeRect(x-6,149,size+12,size+12);}
    });
    ctx.textAlign='left';
  }else{
    const firstPolygon=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],folded=sharedFinalPolygon(p);
    drawSharedPaper(ctx,75,150,190,{polygon:firstPolygon,folds:p.folds});drawStepArrow(ctx,285,245);
    drawSharedPaper(ctx,355,150,190,{polygon:folded,segments:p.cutSegments||[],holes:p.punches||[]});drawStepArrow(ctx,565,245);
    drawSharedPaper(ctx,635,150,190,{folds:p.folds,segments:showAnswer?(p.unfoldedSegments||[]):[],holes:showAnswer?(p.unfoldedPoints||[]):[],answer:showAnswer});
    ctx.fillStyle='#52616b';ctx.font='700 15px sans-serif';ctx.fillText(showAnswer?'펼친 결과':'펼친 결과를 생각해 보세요.',635,375);
    ctx.fillStyle='#17345f';ctx.font='800 18px sans-serif';
    const result=p.interaction==='piece-count'?`조각 수: ${showAnswer?p.pieceCount:'____'}조각`:`구멍 수: ${showAnswer?p.unfoldedPoints.length:'____'}개`;
    ctx.fillText(result,900,235);
  }
  ctx.fillStyle='#52616b';ctx.font='700 16px sans-serif';ctx.fillText(`거꾸로 펼칠 때 새 표시가 생기는 쪽  ${showAnswer?sharedUnfoldText(p):'____________________________'}`,55,455);
}

function drawSharedMatchItem(ctx,x,y,size,item,view,answer=false){
  if(view==='folded') drawSharedPaper(ctx,x,y,size,{polygon:sharedFinalPolygon(item),segments:item.cutSegments||[],holes:item.punches||[]});
  else drawSharedPaper(ctx,x,y,size,{folds:item.folds,segments:item.unfoldedSegments||[],holes:item.unfoldedPoints||[],answer});
}

function renderSharedConnections(ctx,p,showAnswer){
  const leftX=95,rightX=1050,itemSize=102,startY=130,gap=125;
  p.pairs.forEach((item,index)=>{drawSharedMatchItem(ctx,leftX,startY+index*gap,itemSize,item,'folded');ctx.fillStyle='#17345f';ctx.font='900 15px sans-serif';ctx.fillText(String(index+1),leftX-28,startY+index*gap+58);});
  p.results.forEach((item,index)=>{drawSharedMatchItem(ctx,rightX,startY+index*gap,itemSize,item,'result',showAnswer);ctx.fillStyle='#17345f';ctx.font='900 15px sans-serif';ctx.fillText(String.fromCharCode(65+index),rightX+itemSize+14,startY+index*gap+58);});
  if(showAnswer){
    ctx.strokeStyle='#27835d';ctx.lineWidth=4;
    p.pairs.forEach((item,leftIndex)=>{const rightIndex=p.results.findIndex(result=>result.key===item.key);ctx.beginPath();ctx.moveTo(leftX+itemSize+6,startY+leftIndex*gap+itemSize/2);ctx.bezierCurveTo(430,startY+leftIndex*gap+itemSize/2,730,startY+rightIndex*gap+itemSize/2,rightX-6,startY+rightIndex*gap+itemSize/2);ctx.stroke();});
  }
}

function renderSharedGame(ctx,d,showAnswer=false){
  header(ctx,d.text);
  const p=d.source,foldNames=p.folds.map(step=>sharedAxisLabel[step.axis]).join(' → ');
  ctx.fillStyle='#52616b';ctx.font='700 16px sans-serif';ctx.fillText(`${p.id} · ${foldNames}`,54,112);
  if(p.interaction==='connect-match') renderSharedConnections(ctx,p,showAnswer);
  else renderSharedSolo(ctx,p,showAnswer);
}

