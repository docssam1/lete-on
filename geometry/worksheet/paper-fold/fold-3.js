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

/* ===== 게임 1~5단계 공용 문항 어댑터 =====
   게임의 levels.js를 그대로 읽어 학습지에서도 같은 문항 ID와 정답 근거를 쓴다. */
let sharedGameLevels=[];
const sharedModeLevel=(mode)=>Number(mode.replace('game-l',''));
const sharedAxisLabel={vertical:'세로',horizontal:'가로','diag-main':'왼쪽 위-오른쪽 아래 대각선','diag-anti':'오른쪽 위-왼쪽 아래 대각선'};

async function loadSharedGameLevels(){
  try{
    const module=await import('../../games/paper-fold/levels.js?v=paper-fold-6');
    module.validateLevels();
    sharedGameLevels=module.levels;
  }catch(error){
    console.error('게임 연계 문항을 불러오지 못했습니다.',error);
    document.querySelectorAll('.mode-button').forEach(button=>{
      if(button.textContent.includes('게임 연계')) button.disabled=true;
    });
  }
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
  const source=level.problems[questionNumber%level.problems.length];
  const prompts={
    1:['색종이를 한 번 접은 뒤 진한 부분을 잘랐습니다.','펼쳤을 때 잘린 위치를 모두 표시하세요.'],
    2:['접기 순서에 따라 색종이를 두 번 접은 뒤 진한 부분을 잘랐습니다.','두 번 모두 펼쳤을 때 잘린 위치를 모두 표시하세요.'],
    3:['색종이를 주어진 순서로 접은 뒤 표시된 곳에 구멍을 뚫었습니다.','펼쳤을 때 생기는 구멍의 위치를 모두 표시하세요.'],
    4:['수가 쓰인 색종이를 접은 뒤 진한 부분을 잘랐습니다.','펼쳤을 때 잘려 나간 칸의 수를 모두 더하세요.'],
    5:['각 칸의 앞뒤에 같은 수가 쓰인 색종이를 순서대로 접습니다.','모두 접었을 때 맨 위에 오는 수를 쓰세요.']
  };
  let answer;
  if(levelNumber<=3) answer=source.targetRegions.map(sharedRegionLabel).join(', ');
  else if(levelNumber===4) answer=source.answer.sum;
  else answer=source.answer;
  const foldNames=(source.folds||[source.fold]).map(step=>sharedAxisLabel[step.axis]).join(' → ');
  return {kind:'game-level',gameLevel:levelNumber,source,answer,text:prompts[levelNumber],info:`${source.id} · ${foldNames}`,src:'게임과 동일한 확정 문항'};
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

function drawSharedGrid(ctx,x,y,size,{values=null,regions=[],axis=null,answer=false}={}){
  const cell=size/4;
  ctx.save();ctx.fillStyle='#edf8fb';ctx.fillRect(x,y,size,size);
  regions.forEach(region=>{
    if(sharedRegionPath(ctx,x,y,size,region)){
      ctx.fillStyle=answer?'rgba(63,164,118,.5)':'rgba(31,125,151,.82)';ctx.fill();
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

function renderSharedGame(ctx,d,showAnswer=false){
  header(ctx,d.text);
  const p=d.source,level=d.gameLevel;
  const foldNames=(p.folds||[p.fold]).map((step,index)=>`${index+1}. ${sharedAxisLabel[step.axis]}`).join('   ');
  ctx.fillStyle='#52616b';ctx.font='700 16px sans-serif';ctx.fillText(`${p.id} · ${foldNames}`,54,112);
  if(level<=3){
    drawSharedGrid(ctx,175,155,235,{regions:p.sourceRegions,axis:p.fold.axis});drawStepArrow(ctx,500,272);drawSharedGrid(ctx,710,135,275,{regions:showAnswer?p.targetRegions:[],answer:showAnswer});
  }else if(level===4){
    drawSharedGrid(ctx,130,150,235,{regions:p.cutRegions,axis:p.fold.axis});drawStepArrow(ctx,430,268);drawSharedGrid(ctx,615,125,285,{values:p.grid.values,regions:showAnswer?p.answer.cells:[],axis:p.fold.axis,answer:showAnswer});
    ctx.fillStyle='#25313b';ctx.font='800 24px sans-serif';ctx.fillText(showAnswer?`${p.answer.expression} = ${p.answer.sum}`:'합: __________',950,285);
  }else{
    const rows=p.topGrid.length,cols=p.topGrid[0].length,cell=Math.min(82,260/Math.max(rows,cols)),x=260,y=150;
    ctx.fillStyle='#fff';ctx.fillRect(x,y,cols*cell,rows*cell);ctx.strokeStyle='#915f35';ctx.lineWidth=2;ctx.font=`900 ${Math.round(cell*.42)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
    p.topGrid.forEach((row,r)=>row.forEach((value,c)=>{ctx.fillStyle=(r+c)%3===0?'#edbd4f':(r+c)%3===1?'#e78375':'#69b8aa';ctx.fillRect(x+c*cell,y+r*cell,cell,cell);ctx.strokeRect(x+c*cell,y+r*cell,cell,cell);ctx.fillStyle='#24323c';ctx.fillText(String(value),x+(c+.5)*cell,y+(r+.5)*cell);}));
    ctx.textAlign='left';ctx.textBaseline='alphabetic';ctx.fillStyle='#52616b';ctx.font='800 18px sans-serif';ctx.fillText(foldNames,x+cols*cell+70,215);ctx.fillStyle='#25313b';ctx.font='900 26px sans-serif';ctx.fillText(showAnswer?`맨 위 수: ${p.answer}`:'맨 위 수: ______',x+cols*cell+70,290);
  }
}

