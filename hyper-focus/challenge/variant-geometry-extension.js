(function(root){
 'use strict';
 // Geometry is derived from integer cells, face ownership, or segment models.
 // Projection conventions reuse render_challenge_more/priority and challenge-bank.
 const LEVELS=['easy','same','hard'],INK='#294b60',BLUE='#3184af',GREEN='#519478',ORANGE='#d68c37';
 const clone=x=>JSON.parse(JSON.stringify(x)),esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const sum=a=>a.reduce((s,v)=>s+v,0),key=a=>JSON.stringify(a),sortCells=a=>a.slice().sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
 const norm=a=>{const x=Math.min(...a.map(p=>p[0])),y=Math.min(...a.map(p=>p[1]));return sortCells(a.map(p=>[p[0]-x,p[1]-y]));};
 function rng(seed){let a=seed>>>0;return(lo,hi)=>{a+=0x6D2B79F5;let t=Math.imul(a^(a>>>15),1|a);t^=t+Math.imul(t^(t>>>7),61|t);return lo+Math.floor(((t^(t>>>14))>>>0)/4294967296*(hi-lo+1));};}
 function shuffle(a,r){a=a.slice();for(let i=a.length-1;i>0;i--){const j=r(0,i);[a[i],a[j]]=[a[j],a[i]];}return a;}
 const txt=(x,y,s,z=19)=>`<text x="${x}" y="${y}" text-anchor="middle" dominant-baseline="middle" fill="${INK}" font-size="${z}">${esc(s)}</text>`;
 const line=(a,b,color=INK,width=1.6,dash='')=>`<path d="M${a.join(' ')}L${b.join(' ')}" stroke="${color}" stroke-width="${width}" fill="none"${dash?` stroke-dasharray="${dash}"`:''}/>`;
 const poly=(a,color='#fff',stroke=INK,width=1.5)=>`<polygon points="${a.map(p=>p.join(',')).join(' ')}" fill="${color}" stroke="${stroke}" stroke-width="${width}" stroke-linejoin="round"/>`;
 const rect=(x,y,w,h,color='#fff',stroke='#8ba6b7')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" stroke="${stroke}" stroke-width="1.2"/>`;
 const svg=(art,w=660,h=250,label='조건에 따라 그린 기하 문제')=>`<svg xmlns="http://www.w3.org/2000/svg" class="challenge-visual variant-visual geometry-extension" viewBox="0 -12 ${w} ${h+12}" role="img" aria-label="${esc(label)}" style="width:100%;height:auto;max-height:none;font-family:'Malgun Gothic',sans-serif">${art}</svg>`;
 function shape(s,x,y,r=17,color=BLUE,fill=true){const f=fill?color:'none';if(s==='circle')return `<circle cx="${x}" cy="${y}" r="${r}" fill="${f}" stroke="${color}" stroke-width="2"/>`;if(s==='square')return rect(x-r*.72,y-r*.72,r*1.44,r*1.44,f,color);if(s==='triangle')return poly([[x,y-r],[x+r*.866,y+r*.5],[x-r*.866,y+r*.5]],f,color,2);return poly(Array.from({length:10},(_,i)=>{const a=-Math.PI/2+i*Math.PI/5,z=r*(i%2?.44:1);return[x+z*Math.cos(a),y+z*Math.sin(a)];}),f,color,1.5);}
const compound=(a,x,y,r=31)=>shape(a[0],x,y,r,BLUE,false)+shape(a[1],x,y,r*(a[0]==='triangle'?.37:a[0]==='star'?.30:.50),ORANGE,false);
 const grid=(w,h,u=42,x=(660-w*u)/2,y=15)=>Array.from({length:w*h},(_,i)=>rect(x+i%w*u,y+Math.floor(i/w)*u,u,u)).join('');
 function transform(a,t){let ps=a.map(([x,y])=>[t&4?-x:x,y]);for(let i=0;i<(t&3);i++)ps=ps.map(([x,y])=>[-y,x]);return norm(ps);}
 const TRI=[[[0,0],[1,0],[0,1]],[[1,0],[1,1],[0,1]],[[1,0],[2,1],[1,1]],[[1,0],[2,0],[2,1]],[[2,1],[2,2],[1,2]],[[1,1],[2,1],[1,2]],[[0,1],[1,1],[1,2]],[[0,1],[1,2],[0,2]]];
 const square=(filled,x,y,s=67)=>TRI.map((p,i)=>poly(p.map(([a,b])=>[x+a*s/2,y+b*s/2]),filled.includes(i)?BLUE:'#fff','#7ca3b9',.9)).join('');
 const FAMILIES={
  'replace-divided-square-cycle':'cycle','cube-count-fill':'cubes','priority-cube-top-view':'top','priority-fold-holes':'fold','extra-congruent-partition':'partition','extra-inside-outside-analogy':'analogy','extra-digital-mirror':'digital','replace-missing-star-combination':'stars','replace-compound-matrix':'matrix','priority-route-count':'route-count','replace-line-rotation-series':'rotation','extra-general-quadrilateral-count':'quadrilaterals',
  'r3-main-9':'links','r4-main-11':'links','r3-main-19':'walk','r4-extra-3':'walk','r3-main-12':'tiles','r4-main-4':'tiles','r4-extra-5':'tiles','r3-main-18':'opposite','r4-extra-2':'opposite','r3-extra-1':'pattern','r3-extra-6':'bricks','r4-main-12':'stack','r4-extra-6':'symbol-roll'
 };
 const SAME_ONLY=new Set();
   const POLICY={cycle:['세 모양의 반복과 빈 그림 두 개','네 모양의 반복과 빈 그림 세 개','다섯 모양의 반복과 빈 그림 네 개'],cubes:['높이 2층인 네 기둥','높이 3층인 네 기둥','높이 4층인 네 기둥'],top:['네 칸의 발자국과 보기 세 개','여섯 칸의 발자국과 2층 쌓기','일곱 칸의 발자국과 3층 쌓기'],fold:['한 번 접어 펼치기','오른쪽과 아래를 차례로 두 번 접어 펼치기','서로 다른 대각선으로 두 번 접어 펼치기'],stars:['네 별 중 두 개 색칠','위·아래 세 별에서 각각 한 개 색칠','위·아래 세 별에서 각각 한 개 색칠'],digital:['작은 수의 두 식을 거울에서 되돌리기','두 자리 수의 두 식을 되돌려 합하기','더하기와 빼기 두 식의 빈 수를 되돌려 합하기'],'route-count':['별을 지나는 길','별과 막힌 길 하나','별과 막힌 길 두 개'],rotation:['시계 방향으로 도는 네 모양','네 모양을 두 묶음 넘겨 찾기','거울상 보기와 회전 방향을 함께 구별'],quadrilaterals:['가로선 둘 사이의 사각형','가로선 셋 사이의 사각형','가로선 넷 사이의 사각형'],tiles:['보기 세 조각 중 두 조각','보기 네 조각 중 두 조각','보기 다섯 조각 중 두 조각'],stack:['2층과 안쪽에 가려진 블록','3층과 세운 블록·눕힌 블록','4층과 가려진 여러 높이의 블록']};
 function family(source){const f=FAMILIES[source?.typeId];return source?.payload&&f?f:null;}
 function supports(source){return !!family(source);}
 function levels(source){const f=family(source);return {easy:!!f&&!SAME_ONLY.has(f),same:!!f,hard:!!f&&!SAME_ONLY.has(f)};}
 function notes(source){return POLICY[family(source)]||['기초 구조 검수 전','원형의 활동과 조건 수를 유지','심화 구조 검수 전'];}
 function cycle(source,d,r){const level=LEVELS.indexOf(d),n=[3,4,5][level],missingCount=[2,3,4][level],pool=shuffle([[0,4],[1,5],[2,6],[3,7],[0,3],[1,6]],r).slice(0,n),sequence=Array.from({length:n+1},(_,i)=>pool[i%n]),answer=Array.from({length:missingCount},(_,i)=>pool[(i+1)%n]);const all=[...sequence,...Array.from({length:missingCount},()=>[])],s=Math.min(66,560/all.length),word=['','한','두','세','네'][missingCount];return {payload:{kind:'geo-cycle',sequence,missingCount},prompt:`같은 모양의 작은 세모 여덟 개로 나누어 색칠했습니다. 색칠이 반복되는 규칙을 찾아 마지막 ${word} 그림에 이어서 색칠하세요.`,problemHtml:svg(all.map((a,i)=>square(a,22+i*(s+13),35,s)+(i>=sequence.length?txt(22+i*(s+13)+s/2,65+s,'('+ (i-sequence.length+1)+')',16):'')).join(''),660,s+105),answer,answerHtml:'아래 그림처럼 색칠',solutionDiagram:svg(answer.map((a,i)=>square(a,30+i*130,15,100)).join(''),Math.max(390,answer.length*130+30),130),solution:`앞의 ${n}개가 한 묶음입니다. 마지막 ${word} 그림은 다음 묶음의 ${Array.from({length:missingCount},(_,i)=>i+2).join('·')}번째 순서입니다.`};}
 function analogy(source,d,r){
  const names=shuffle(['circle','triangle','square'],r),a=d==='hard'?names:[names[0],names[1]],examples=d==='hard'?[[names[1],names[2],names[0]],[names[2],names[0],names[1]]]:[[names[1],names[2]],[names[2],names[0]]],correct=a.slice().reverse();
  const candidates=d==='hard'?[correct,a,[a[1],a[0],a[2]],[a[0],a[2],a[1]]]:[correct,a,[a[0],names[2]],[names[2],a[1]]],options=shuffle(d==='easy'?candidates.slice(0,3):candidates,r),answer=options.findIndex(x=>key(x)===key(correct))+1;
  const nested=(a,x,y,radius)=>a.length===2?compound(a,x,y,radius):a.map((s,i)=>shape(s,x,y,radius*[1,.48,.18][i],[BLUE,GREEN,ORANGE][i],false)).join('');
  const art=d==='hard'?examples.map((x,i)=>nested(x,84+i*330,62,47)+txt(164+i*330,62,'→',26)+nested(x.slice().reverse(),244+i*330,62,47)).join('')+nested(a,87,221,54)+txt(168,221,'→',26)+txt(234,221,'?',34)+options.map((a,i)=>nested(a,367+i%2*162,184+Math.floor(i/2)*145,52)+txt(367+i%2*162,248+Math.floor(i/2)*145,i+1,17)).join(''):examples.map((x,i)=>nested(x,80+i*330,50,31)+txt(151+i*330,50,'→',26)+nested(x.slice().reverse(),224+i*330,50,31)).join('')+nested(a,85,150,31)+txt(155,150,'→',26)+txt(224,150,'?',34)+options.map((a,i)=>nested(a,330+i*86,150,28)+txt(330+i*86,204,i+1,17)).join('');
  return{payload:{kind:'geo-analogy',examples,query:a,options},prompt:source.prompt,problemHtml:svg(art,660,d==='hard'?420:230),answer,solution:d==='hard'?'가운데 모양은 그대로 두고 가장 바깥 모양과 가장 안쪽 모양의 자리를 서로 바꿉니다.':'바깥 모양과 안쪽 모양의 자리를 서로 바꾸면 됩니다.'};
 }
function matrix(source,d,r){if(d==='hard')return hardMatrix(source,r);const names=shuffle(['circle','triangle','square'],r),pairs=names.map((a,i)=>[a,names[(i+1)%3]]),perm=shuffle([0,1,2],r),offset=r(0,2),matrix=perm.map(a=>perm.map(b=>(a+b+offset)%3)),row=r(0,2),col=r(0,2),missing=matrix[row][col];matrix[row][col]=null;const bad=[pairs[missing][1],pairs[missing][0]],options=shuffle(d==='easy'?pairs:[...pairs,bad],r),answer=options.findIndex(x=>key(x)===key(pairs[missing]))+1;return{payload:{kind:'geo-matrix',pairs,matrix,options},prompt:source.prompt,problemHtml:svg(matrix.map((a,y)=>a.map((v,x)=>rect(24+x*88,10+y*78,88,78,'#fff')+(v===null?txt(68+x*88,49+y*78,'?',31):compound(pairs[v],68+x*88,49+y*78,30))).join('')).join('')+options.map((a,i)=>compound(a,390+i%2*150,67+Math.floor(i/2)*121,32)+txt(390+i%2*150,113+Math.floor(i/2)*121,i+1,18)).join(''),660,255),answer,solution:'각 가로줄과 세로줄에 세 종류의 그림이 한 번씩 들어갑니다. 빈자리의 가로줄과 세로줄에서 모두 빠진 모양을 고릅니다.'};}
 function stars(source,d,r){
  const grouped=d==='hard',n=grouped?6:(d==='easy'?3:4),k=grouped?2:(d==='easy'?1:2),all=[];
  if(grouped){
   for(let upper=0;upper<3;upper++)for(let lower=3;lower<6;lower++)all.push([upper,lower]);
  }else{
   for(let mask=0;mask<1<<n;mask++){
    const picked=Array.from({length:n},(_,index)=>index).filter(index=>mask&(1<<index));
    if(picked.length===k)all.push(picked);
   }
  }
  const order=shuffle(all,r),answer=order.pop(),shown=order,cols=grouped?5:3,s=grouped?112:110,rowStep=grouped?126:120,rows=Math.ceil((shown.length+1)/cols);
  const tile=(picked,index,blank)=>{
   const x=grouped?16+index%cols*128:17+index%cols*128,y=18+Math.floor(index/cols)*rowStep;
   let art=rect(x,y,s,grouped?92:84,'#fff');
   if(!blank){
    if(grouped){
     for(let row=0;row<2;row++)for(let col=0;col<3;col++){
      const slot=row*3+col;
      art+=shape('star',x+25+col*31,y+27+row*37,10,picked.includes(slot)?ORANGE:'#b8c7d0',picked.includes(slot));
     }
    }else art+=Array.from({length:n},(_,slot)=>shape('star',x+18+slot*19,y+41,8,picked.includes(slot)?ORANGE:'#b8c7d0',picked.includes(slot))).join('');
   }
   return art+txt(x+s/2,y+(grouped?111:103),blank?'그리기':index+1,16);
  };
  const answerArt=grouped?Array.from({length:6},(_,slot)=>shape('star',52+slot%3*52,32+Math.floor(slot/3)*54,17,answer.includes(slot)?ORANGE:'#93a9b8',answer.includes(slot))).join(''):Array.from({length:n},(_,slot)=>shape('star',40+slot*47,40,18,answer.includes(slot)?ORANGE:'#93a9b8',answer.includes(slot))).join('');
  return{
   payload:{kind:'geo-stars',slots:n,choose:k,shown,...(grouped?{rules:[{indices:[0,1,2],choose:1},{indices:[3,4,5],choose:1}]}:{})},
   prompt:grouped?'위쪽 별 3개에서 1개, 아래쪽 별 3개에서 1개를 색칠하여 만들 수 있는 그림에서 한 가지가 빠졌습니다. 마지막 빈 틀에 별을 두 줄로 그리고 빠진 한 가지를 색칠하세요.':`별 ${n}개 중 ${k}개에 색칠하여 만들 수 있는 그림에서 한 가지가 빠졌습니다. 색칠한 위치가 다르면 다른 그림입니다. 마지막 빈 틀에 별을 그리고 빠진 한 가지를 색칠하세요.`,
   problemHtml:svg(shown.map((picked,index)=>tile(picked,index,false)).join('')+tile([],shown.length,true),660,rows*rowStep+18),
   answer,
   answerHtml:grouped?`위쪽 왼쪽에서 ${answer[0]+1}번째 · 아래쪽 왼쪽에서 ${answer[1]-2}번째`:answer.map(index=>`왼쪽에서 ${index+1}번째`).join(' · '),
   solutionDiagram:svg(answerArt,grouped?208:n*47+40,grouped?125:82),
   solution:grouped?`위쪽에서 고르는 3가지와 아래쪽에서 고르는 3가지를 짝지으면 3×3=9가지입니다. 이미 나온 여덟 그림을 지우면 위쪽 ${answer[0]+1}번째와 아래쪽 ${answer[1]-2}번째 별을 색칠한 그림이 남습니다.`:`${all.length}가지 중 이미 나온 그림을 하나씩 지우면, ${answer.map(index=>index+1).join('·')}번째 별에 색칠한 그림이 남습니다.`
  };
 }
 const SEG={a:[0,0,22,0],b:[22,0,22,26],c:[22,26,22,52],d:[0,52,22,52],e:[0,26,0,52],f:[0,0,0,26],g:[0,26,22,26]},DIG=['abcdef','bc','abged','abgcd','fgbc','afgcd','afgecd','abc','abcdefg','abfgcd'];
 function digitalEquation(tokens,y,reflect){const widths=tokens.map(t=>t==='blank'?60:typeof t==='number'?String(t).length*34-12:28);let x=(660-sum(widths)-24*(tokens.length-1))/2;const art=tokens.map((t,i)=>{const x0=x;x+=widths[i]+24;if(t==='blank')return rect(x0,y-5,60,62);if(t==='+'||t==='-'||t==='=')return line([x0,y+23],[x0+28,y+23],INK,3)+(t==='+'?line([x0+14,y+9],[x0+14,y+37],INK,3):t==='='?line([x0,y+34],[x0+28,y+34],INK,3):'');return String(t).split('').map((v,j)=>Object.values([...DIG[+v]].map(k=>{const[a,b,c,d]=SEG[k];return line([x0+j*34+a,y+b],[x0+j*34+c,y+d],BLUE,3.5);})).join('')).join('');}).join('');return reflect?`<g class="reflected-equation" transform="translate(660 0) scale(-1 1)">${art}</g>`:art;}
function digital(source,d,r){const low=d==='easy'?2:11,high=d==='easy'?8:27,a=r(low,high),b=r(low,high),c=r(low,high),e=r(low,high),equations=d==='hard'?[[a+b,'-','blank','=',a],[c+e,'-',c,'=','blank']]:[[a,'+','blank','=',a+b],[c,'+',e,'=','blank']],missing=d==='hard'?[b,e]:[b,c+e],answer=sum(missing);return{payload:{kind:'geo-digital',equations},prompt:source.prompt,problemHtml:svg(equations.map((a,i)=>digitalEquation(a,18+i*100,true)).join(''),660,200),answer,answerHtml:String(answer),solutionDiagram:svg(equations.map((a,i)=>digitalEquation(a.map(t=>t==='blank'?missing[i]:t),18+i*100,false)).join(''),660,200),solution:`거울에 비친 모습을 좌우로 뒤집어 원래 식을 읽습니다. ${equations.map((eq,i)=>{const restored=eq.map(t=>t==='blank'?'□':t).join(' '),calculation=eq[2]==='blank'?(eq[1]==='+'?`${eq[4]}−${eq[0]}`:`${eq[0]}−${eq[4]}`):(eq[1]==='+'?`${eq[0]}+${eq[2]}`:`${eq[0]}−${eq[2]}`);return `${i===0?'첫째':'둘째'} 식은 ${restored}입니다. ${eq[2]==='blank'?(eq[1]==='+'?'합에서 알고 있는 수를 빼면':'처음 수에서 남은 수를 빼면'):'왼쪽을 계산하면'} 빈칸은 ${calculation}=${missing[i]}입니다.`;}).join(' ')} 두 빈칸의 수를 더하면 ${missing.join('+')}=${answer}입니다.`};}
 const turn=ps=>ps.map(([x,y])=>[2-y,x]);
 function rotationOptions(sequence,correct,d,r){const options=shuffle(sequence.slice(0,4),r);if(d==='hard'){const reflected=correct.map(([x,y])=>[2-x,y]),edgeKey=a=>a.slice(1).map((v,i)=>[String(a[i]),String(v)].sort().join(':')).sort().join('|');if(!options.some(a=>edgeKey(a)===edgeKey(reflected))){const i=options.findIndex(a=>edgeKey(a)!==edgeKey(correct));options[i]=reflected;}}return options;}
function rotation(source,d,r){let first=clone(source.payload.examples[0]);for(let i=r(0,3);i;i--)first=turn(first);if(r(0,1))first=first.map(([x,y])=>[2-x,y]);const step=d==='hard'&&r(0,1)?3:1,sequence=[first];for(let i=1;i<9;i++){let a=sequence.at(-1);for(let j=0;j<step;j++)a=turn(a);sequence.push(a);}const position=d==='easy'?r(10,13):d==='same'?r(17,21):r(25,31),correct=sequence[(position-1)%4],options=rotationOptions(sequence,correct,d,r),answer=options.findIndex(p=>key(p)===key(correct))+1;const draw=(a,x,y,s)=>`<path d="M${a.map(([u,v])=>[x+u*s,y+v*s].join(' ')).join('L')}" fill="none" stroke="${BLUE}" stroke-width="3" stroke-linejoin="round"/>`;return{payload:{kind:'geo-rotation',examples:sequence,options,targetPosition:position},prompt:`선으로 만든 도형이 일정한 규칙으로 돌아갑니다. 같은 규칙이 계속될 때 ${position}번째에 올 도형의 번호를 쓰세요.`,problemHtml:svg(sequence.map((p,i)=>draw(p,20+i*67,20,20)+txt(40+i*67,81,i+1,16)).join('')+txt(634,45,'…',28)+txt(330,119,'보기',18)+options.map((p,i)=>draw(p,73+i*155,151,24)+txt(97+i*155,227,i+1,19)).join(''),660,250),answer,solution:`네 가지 모양이 반복됩니다. ${position}번째는 한 묶음의 ${(position-1)%4+1}번째 모양입니다.`,solutionDiagram:svg(draw(correct,40,15,48),180,135)};}
function drawGridPaths(p,answer){const w=p.w,h=p.h,u=48,x=(660-w*u)/2,y=20,point=n=>[x+(n%w+.5)*u,y+(Math.floor(n/w)+.5)*u];let art=grid(w,h,u,x,y);if(answer)answer.forEach((path,i)=>{for(let j=1;j<path.length;j++)art+=line(point(path[j-1]),point(path[j]),[BLUE,GREEN,ORANGE][i%3],4);});if(p.kind==='geo-links')p.pairs.forEach((a,i)=>a.forEach(n=>{const[u,v]=point(n);art+=shape(p.symbols[i],u,v,12,[BLUE,GREEN,ORANGE][i]);}));else p.checkpoints.forEach((n,i)=>{const[u,v]=point(n);art+=`<circle cx="${u}" cy="${v}" r="17" fill="#fff"/>`+txt(u,v,i+1,20);});return svg(art,660,h*u+40);}
 function allPaths(w,h,start,end,forbidden=[]){const out=[],blocked=new Set(forbidden),neigh=n=>[n%w?n-1:-1,n%w<w-1?n+1:-1,n>=w?n-w:-1,n<w*(h-1)?n+w:-1].filter(n=>n>=0);function visit(n,path,seen){if(n===end){out.push(path);return;}for(const v of neigh(n))if(!seen.has(v)&&!blocked.has(v)){seen.add(v);visit(v,[...path,v],seen);seen.delete(v);}}visit(start,[start],new Set([start]));return out;}
 const LINK_MODELS={
  easy:{kind:'links',w:4,h:3,options:[[[5,2],[3,7],[6,4]],[[5,3],[11,7],[1,9]]],detour:2},
  same:{kind:'links',w:5,h:3,options:[[[1,8],[0,4],[6,7]],[[1,10],[9,7],[8,6]]],detour:4},
  hard:{kind:'links',w:4,h:4,options:[[[0,4],[5,13],[8,6]],[[1,6],[5,7],[10,9]]],detour:6}
 };
 function pathQuestion(source,d,r){const base=source.payload,linking=family(source)==='links',model=LINK_MODELS[d],p=linking?{...model,pairs:model.options[r(0,model.options.length-1)]}:d==='same'?base:d==='easy'?{kind:'walk',w:3,h:3,checkpoints:[0,1,3,8]}:{kind:'walk',w:4,h:4,checkpoints:[0,3,4,11,12]},swap=r(0,1),flipX=r(0,1),flipY=r(0,1),w=swap?p.h:p.w,h=swap?p.w:p.h,map=n=>{let x=n%p.w,y=Math.floor(n/p.w);if(flipX)x=p.w-1-x;if(flipY)y=p.h-1-y;if(swap)[x,y]=[y,x];return y*w+x;};let payload,solutions;
  if(p.kind==='links'){const pairs=p.pairs.map(a=>a.map(map)),symbols=shuffle(['circle','triangle','star','square'],r).slice(0,pairs.length);payload={kind:'geo-links',w,h,pairs,symbols};solutions=[];function cover(i,used,chosen){if(i===pairs.length){solutions.push(chosen);return;}for(const path of allPaths(w,h,...pairs[i],[...used,...pairs.slice(i+1).flat()]))cover(i+1,[...used,...path],[...chosen,path]);}cover(0,[],[]);}
  else{const checkpoints=p.checkpoints.map(map);payload={kind:'geo-walk',w,h,checkpoints};solutions=allPaths(w,h,checkpoints[0],checkpoints.at(-1)).filter(a=>a.length===w*h&&checkpoints.every((n,i)=>!i||a.indexOf(n)>a.indexOf(checkpoints[i-1]))).map(a=>[a]);}
  if(solutions.length!==1)throw Error('연결선의 해가 한 가지로 정해지지 않았습니다.');
  if(linking){const detour=solutions[0].reduce((n,path,i)=>{const[a,b]=payload.pairs[i];return n+path.length-1-Math.abs(a%w-b%w)-Math.abs(Math.floor(a/w)-Math.floor(b/w));},0);if(payload.pairs.length!==3||new Set(payload.symbols).size!==3||detour!==model.detour)throw Error('세 쌍 연결의 우회 난도 검증에 실패했습니다.');}
  return{payload,prompt:p.kind==='links'?'서로 다른 도형 세 종류가 두 개씩 있습니다. 같은 도형끼리 세 개의 선으로 연결하세요. 가로 또는 세로로 이웃한 칸의 가운데로만 지나갑니다. 다른 도형의 칸을 지나거나, 두 선이 같은 칸에서 만나서는 안 됩니다. 빈칸이 남아도 됩니다.':`1부터 ${p.checkpoints.length}까지 순서대로 연결하며 모든 칸을 한 번씩 지나세요. 선은 가로나 세로로 이웃한 칸의 가운데를 지나며, 지나간 칸으로 되돌아갈 수 없습니다.`,problemHtml:drawGridPaths(payload),answer:solutions[0],answerHtml:'아래 풀이 그림처럼 선으로 연결',solutionDiagram:drawGridPaths(payload,solutions[0]),solution:p.kind==='links'?'다른 도형이 있는 칸을 피해 같은 모양끼리 연결합니다. 각 도형에서 다른 도형을 지나지 않고 나갈 수 있는 방향을 먼저 살핍니다. 막힌 쪽 대신 바깥 칸으로 돌아갑니다. 세 선이 같은 칸에서 만나지 않는지 확인합니다.':'숫자 순서대로 지나면서 모든 칸을 한 번씩 연결합니다. 풀이의 선을 따라가며 같은 칸을 다시 지나지 않는지 확인합니다.'};}
 function countRoutes(p){const states=new Map;function go(x,y,seen){if(x===p.columns&&y===p.rows)return Number(seen);const k=[x,y,seen].join();if(states.has(k))return states.get(k);let n=0;for(const [u,v]of [[x+1,y],[x,y+1]])if(u<=p.columns&&v<=p.rows&&!p.blocked.some(a=>key(a)===key([[x,y],[u,v]])))n+=go(u,v,seen||(u===p.via[0]&&v===p.via[1]));states.set(k,n);return n;}return go(0,0,false);}
 function routeSteps(p,answer){
  function segment(start,end){const paths=[];function visit(a,moves){if(key(a)===key(end)){paths.push(moves);return;}for(const [next,arrow]of [[[a[0]+1,a[1]],'→'],[[a[0],a[1]+1],'↑']])if(next[0]<=end[0]&&next[1]<=end[1]&&!p.blocked.some(edge=>key(edge)===key([a,next])))visit(next,[...moves,arrow]);}visit(start,[]);return paths;}
  const before=segment([0,0],p.via),after=segment(p.via,[p.columns,p.rows]);
  if(before.length*after.length!==answer)throw Error('경로 분기별 개수가 정답과 다릅니다.');
  const pathText=a=>a.join(' '),solutionDiagram=`<table class="edition-table" style="width:100%;border-collapse:collapse;font-size:14px"><thead><tr><th>출발 → 별</th><th>이어서 별 → 도착</th><th>가지 수</th></tr></thead><tbody>${before.map(a=>`<tr><td>${pathText(a)}</td><td>${after.map(pathText).join('<br>')}</td><td>${after.length}가지</td></tr>`).join('')}</tbody></table>`;
  return {solutionDiagram,solution:`먼저 별까지 가는 길을 셉니다. 막힌 길을 제외하면 ${before.map(pathText).join(' / ')}의 ${before.length}가지입니다. 별에서 도착까지는 ${after.map(pathText).join(' / ')}의 ${after.length}가지입니다. 별까지 가는 길 하나마다 그 뒤에 갈 수 있는 길이 ${after.length}가지씩 이어집니다. 표의 각 줄을 더하면 ${before.map(()=>after.length).join('+')}=${answer}가지입니다. →는 오른쪽 한 칸, ↑는 위쪽 한 칸입니다.`};
 }
function routeCount(source,d,r){const columns=d==='hard'?4:3,rows=2,via=[r(1,columns-1),1],edges=[];for(let y=0;y<=rows;y++)for(let x=0;x<=columns;x++){if(x<columns)edges.push([[x,y],[x+1,y]]);if(y<rows)edges.push([[x,y],[x,y+1]]);}let payload,answer;for(let n=0;n<100;n++){payload={kind:'geo-route-count',columns,rows,via,blocked:shuffle(edges,r).slice(0,LEVELS.indexOf(d))};answer=countRoutes(payload);if(answer>=2&&answer<=20)break;}if(answer<2)throw Error('길의 경우가 부족합니다.');const u=75,x=(660-columns*u)/2,y=190,point=([a,b])=>[x+a*u,y-b*u];let art=edges.map(a=>line(point(a[0]),point(a[1]),'#7297a9',3)).join('');for(const[a,b]of payload.blocked){const s=point(a),t=point(b),m=[(s[0]+t[0])/2,(s[1]+t[1])/2];art+=`<circle cx="${m[0]}" cy="${m[1]}" r="11" fill="#fff"/>`+line([m[0]-6,m[1]-6],[m[0]+6,m[1]+6],'#bc6159',3)+line([m[0]+6,m[1]-6],[m[0]-6,m[1]+6],'#bc6159',3);}const[vx,vy]=point(via);art+=shape('star',vx,vy,15,ORANGE)+txt(x-36,y,'출발',17)+txt(x+columns*u+35,y-rows*u,'도착',17);return{payload,prompt:`출발에서 도착까지 오른쪽이나 위쪽으로만 움직입니다. 별을 꼭 지나고${payload.blocked.length?' ×로 막힌 길은 피할 때,':','} 갈 수 있는 길은 모두 몇 가지입니까?`,problemHtml:svg(art,660,230),answer,...routeSteps(payload,answer)};}
function reflectFold([x,y],fold,size){
  if(fold.startsWith('diag-main-'))return[y,x];
  if(fold.startsWith('diag-anti-'))return[size-1-y,size-1-x];
  if(fold==='right-to-left'||fold==='left-to-right')return[size-1-x,y];
  if(fold==='bottom-to-top'||fold==='top-to-bottom')return[x,size-1-y];
  throw Error('알 수 없는 종이 접기 방향입니다.');
 }
  function unfoldHoles(size,folds,holes){
  let current=holes.map(hole=>hole.slice());
  for(let index=folds.length-1;index>=0;index--){
   current=[...current,...current.map(hole=>reflectFold(hole,folds[index],size))];
   current=[...new Map(current.map(hole=>[key(hole),hole])).values()];
  }
   return current.sort((a,b)=>a[1]-b[1]||a[0]-b[0]);
  }
  function foldRule(fold){
   if(fold==='right-to-left')return{keep:p=>.5-p.x,mirror:p=>({x:1-p.x,y:p.y})};
   if(fold==='left-to-right')return{keep:p=>p.x-.5,mirror:p=>({x:1-p.x,y:p.y})};
   if(fold==='bottom-to-top')return{keep:p=>.5-p.y,mirror:p=>({x:p.x,y:1-p.y})};
   if(fold==='top-to-bottom')return{keep:p=>p.y-.5,mirror:p=>({x:p.x,y:1-p.y})};
   if(fold==='diag-main-lower-to-upper')return{keep:p=>p.x-p.y,mirror:p=>({x:p.y,y:p.x})};
   if(fold==='diag-main-upper-to-lower')return{keep:p=>p.y-p.x,mirror:p=>({x:p.y,y:p.x})};
   if(fold==='diag-anti-upper-left-to-lower-right')return{keep:p=>p.x+p.y-1,mirror:p=>({x:1-p.y,y:1-p.x})};
   if(fold==='diag-anti-lower-right-to-upper-left')return{keep:p=>1-p.x-p.y,mirror:p=>({x:1-p.y,y:1-p.x})};
   throw Error('알 수 없는 종이 접기 방향입니다.');
  }
  function clipFoldPolygon(polygon,keep){
   const out=[];
   for(let i=0;i<polygon.length;i++){
    const a=polygon[i],b=polygon[(i+1)%polygon.length],da=keep(a),db=keep(b);
    if(da>=-1e-9)out.push(a);
    if((da>1e-9&&db< -1e-9)||(da< -1e-9&&db>1e-9)){
     const t=da/(da-db);out.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});
    }
   }
   return out;
  }
  function buildFoldStages(folds){
   let polygon=[{x:0,y:0},{x:1,y:0},{x:1,y:1},{x:0,y:1}],stages=[];
   for(const fold of folds){stages.push({polygon:polygon.map(p=>({...p})),fold});polygon=clipFoldPolygon(polygon,foldRule(fold).keep);}
   stages.push({polygon:polygon.map(p=>({...p})),fold:null});return stages;
  }
  function foldSegment(polygon,keep){
   const points=[];
   for(let i=0;i<polygon.length;i++){
    const a=polygon[i],b=polygon[(i+1)%polygon.length],da=keep(a),db=keep(b);
    if(Math.abs(da)<1e-9)points.push(a);
    if((da>1e-9&&db< -1e-9)||(da< -1e-9&&db>1e-9)){const t=da/(da-db);points.push({x:a.x+(b.x-a.x)*t,y:a.y+(b.y-a.y)*t});}
   }
   const unique=[...new Map(points.map(p=>[`${p.x.toFixed(8)},${p.y.toFixed(8)}`,p])).values()];let best=null,distance=-1;
   for(let i=0;i<unique.length;i++)for(let j=i+1;j<unique.length;j++){const d=Math.hypot(unique[i].x-unique[j].x,unique[i].y-unique[j].y);if(d>distance){distance=d;best=[unique[i],unique[j]];}}
   return distance>1e-8?best:null;
  }
  function clippedGrid(polygon,left,top,paperSize,cells){
   let art='';const segment=(axis,value)=>{
    const hits=[];
    for(let i=0;i<polygon.length;i++){
     const a=polygon[i],b=polygon[(i+1)%polygon.length],da=a[axis]-value,db=b[axis]-value,other=axis==='x'?'y':'x';
     if(Math.abs(da)<1e-9)hits.push(a[other]);
     if(da*db< -1e-12){const t=da/(da-db);hits.push(a[other]+(b[other]-a[other])*t);}
    }
    const values=[...new Set(hits.map(n=>n.toFixed(8)))].map(Number).sort((a,b)=>a-b);return values.length>1?[values[0],values.at(-1)]:null;
   };
   for(let n=1;n<cells;n++)for(const axis of ['x','y']){const value=n/cells,s=segment(axis,value);if(!s)continue;const a=axis==='x'?[left+value*paperSize,top+s[0]*paperSize]:[left+s[0]*paperSize,top+value*paperSize],b=axis==='x'?[left+value*paperSize,top+s[1]*paperSize]:[left+s[1]*paperSize,top+value*paperSize];art+=line(a,b,'#9eb9c5',1);}
   return art;
  }
  function foldStageArt(stage,index,left,top,paperSize,cells,holes=[]){
   const point=p=>[left+p.x*paperSize,top+p.y*paperSize],points=stage.polygon.map(point);let art=`<g data-fold-stage="${index}"${stage.fold?` data-fold-direction="${stage.fold}"`:''}>${poly(points,'#f2cabc','#b67b70',1.6)}${clippedGrid(stage.polygon,left,top,paperSize,cells)}`;
   if(stage.fold){
    const rule=foldRule(stage.fold),boundary=foldSegment(stage.polygon,rule.keep);if(boundary)art+=line(point(boundary[0]),point(boundary[1]),'#ad5f57',1.7,'5 4');
    const away=clipFoldPolygon(stage.polygon,p=>-rule.keep(p));if(away.length>=3){const from={x:sum(away.map(p=>p.x))/away.length,y:sum(away.map(p=>p.y))/away.length},to=rule.mirror(from),a=point(from),b=point(to),nx=-(b[1]-a[1]),ny=b[0]-a[0],length=Math.hypot(nx,ny)||1,bulge=Math.min(19,paperSize*.2),c=[(a[0]+b[0])/2+nx/length*bulge,(a[1]+b[1])/2+ny/length*bulge],angle=Math.atan2(b[1]-c[1],b[0]-c[0]),head=[b,[b[0]-9*Math.cos(angle-.5),b[1]-9*Math.sin(angle-.5)],[b[0]-9*Math.cos(angle+.5),b[1]-9*Math.sin(angle+.5)]];art+=`<path data-fold-arrow="${stage.fold}" d="M${a[0]} ${a[1]}Q${c[0]} ${c[1]} ${b[0]} ${b[1]}" fill="none" stroke="#bd4f48" stroke-width="3" stroke-linecap="round"/>${poly(head,'#bd4f48','#bd4f48',1)}`;}
   }else art+=holes.map(([x,y])=>`<circle data-fold-hole="${x},${y}" cx="${left+(x+.5)*paperSize/cells}" cy="${top+(y+.5)*paperSize/cells}" r="5.5" fill="#fff" stroke="#a9445c" stroke-width="2.2"/>`).join('');
   return art+'</g>';
  }
  function fold(source,d,r){
  const size=4;
  const diagonalModels=[
   {folds:['diag-main-lower-to-upper','diag-anti-upper-left-to-lower-right'],holes:[[3,1]]},
   {folds:['diag-main-upper-to-lower','diag-anti-lower-right-to-upper-left'],holes:[[0,1]]}
  ];
  const model=d==='easy'?{folds:['right-to-left'],holes:[[1,1]]}:d==='same'?{folds:['right-to-left','bottom-to-top'],holes:[[1,0]]}:diagonalModels[r(0,diagonalModels.length-1)];
   const folds=model.folds,holes=model.holes,answerCells=unfoldHoles(size,folds,holes),answer=answerCells.map(([x,y])=>y*size+x),paperSize=108,top=20,stages=buildFoldStages(folds),panelCount=stages.length+1,gap=(660-48-panelCount*paperSize)/(panelCount-1),starts=Array.from({length:panelCount},(_,index)=>24+index*(paperSize+gap));
   const gridArt=left=>Array.from({length:size*size},(_,index)=>rect(left+index%size*paperSize/size,top+Math.floor(index/size)*paperSize/size,paperSize/size,paperSize/size,'#fff')).join('');
   let art=stages.map((stage,index)=>foldStageArt(stage,index,starts[index],top,paperSize,size,index===stages.length-1?holes:[])+txt(starts[index]+paperSize/2,156,index===0?'처음':index===stages.length-1?'접고 구멍 뚫기':`${index}번 접은 뒤`,14)).join('');
   const finalLeft=starts.at(-1);art+=`<g data-fold-response="true">${gridArt(finalLeft)}</g>`+txt(finalLeft+paperSize/2,156,'펼쳐서 그리기',14);
   const diagonal=folds.some(fold=>/diag/.test(fold));
   return{
    payload:{kind:'geo-fold',size,folds,holes,stagePolygons:stages.map(stage=>stage.polygon.map(p=>[p.x,p.y]))},
    prompt:`종이를 그림의 화살표대로 ${folds.length===1?'한 번':'두 번'} 접고 구멍 1개를 끝까지 뚫었습니다. 모두 펼쳤을 때 구멍이 생기는 칸을 마지막 모눈에 모두 동그라미 하세요.`,
    problemHtml:svg(`<g data-fold-engine="half-plane-mirror">${art}</g>`,660,184,'실제 종이 모양대로 두 번 접는 방향과 구멍, 빈 응답 모눈'),
   answer,
   answerHtml:'아래 표시한 칸에 동그라미',
   solutionDiagram:foldSolutionDiagram(size,folds,holes),
   solution:diagonal?`마지막 대각선부터 거꾸로 펼칩니다. 구멍을 대각선 건너 같은 거리에 옮기면 2개가 되고, 첫 대각선을 펼쳐 다시 각각 옮기면 모두 ${answer.length}개입니다.`:`마지막으로 접은 가로선을 먼저 펼쳐 구멍을 위아래 같은 거리에 표시합니다. 이어 세로선을 펼쳐 두 구멍을 좌우 같은 거리에 표시하면 모두 ${answer.length}개입니다.`
  };
 }
 function foldSolutionDiagram(size,folds,holes){
  const states=[{remaining:folds.length,holes:holes.map(h=>h.slice())}];let current=holes.map(h=>h.slice());
  for(let k=folds.length-1;k>=0;k--){current=[...current,...current.map(hole=>reflectFold(hole,folds[k],size))];current=[...new Map(current.map(h=>[key(h),h])).values()];states.push({remaining:k,holes:current});}
  const span=220,u=144/size;
  return '<div class="solution-step-panels" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">'+states.map((state,i)=>{const x=(span-144)/2,y=38,k=state.remaining;let art=txt(span/2,16,i===0?'접은 종이':k===0?'모두 펼치기':'한 번 펼치기',17);
   for(let b=0;b<size;b++)for(let a=0;a<size;a++)art+=rect(x+a*u,y+b*u,u,u,k?'#f5dfd8':'#fff');
   if(k>0){const fold=folds[k-1];if(fold.startsWith('diag-main-'))art+=line([x,y],[x+144,y+144],'#a44d69',1.5,'4 3');else if(fold.startsWith('diag-anti-'))art+=line([x+144,y],[x,y+144],'#a44d69',1.5,'4 3');else if(fold==='right-to-left'||fold==='left-to-right')art+=line([x+72,y],[x+72,y+144],'#a44d69',1.5,'4 3');else art+=line([x,y+72],[x+144,y+72],'#a44d69',1.5,'4 3');}
   art+=state.holes.map(([a,b])=>`<circle data-hole="${b*size+a}" cx="${x+(a+.5)*u}" cy="${y+(b+.5)*u}" r="${u*.22}" fill="#fff" stroke="#a44d69" stroke-width="2"/>`).join('');
   return '<div style="flex:1 1 190px;max-width:250px;min-width:0">'+svg(`<g data-fold-remaining="${k}">${art+txt(span/2,205,`구멍 ${state.holes.length}개`,16)}</g>`,220,224,'접은 종이를 역순으로 펼쳤을 때의 구멍 위치')+'</div>';
  }).join('')+'</div>';
 }
 function stackLayerDiagram(heights){
  const count=Math.max(...heights.flat()),width=heights[0].length,depth=heights.length,span=220,u=Math.min(27,(span-22)/width);
  return '<div class="solution-step-panels" style="display:flex;flex-wrap:wrap;gap:10px;justify-content:center">'+Array.from({length:count},(_,z)=>{const x=(span-width*u)/2,y=40;let art=txt(span/2,16,`${z+1}층`,18),cells=0;
   for(let b=0;b<depth;b++)for(let a=0;a<width;a++){const filled=heights[b][a]>z;if(filled)cells++;art+=`<g data-layer-cell="${a},${b}" data-filled="${filled}">${rect(x+a*u,y+b*u,u,u,filled?'#dcece6':'#f5f6f8',filled?'#537f73':'#d8dee8')}</g>`;}
   return '<div style="flex:1 1 190px;max-width:250px;min-width:0">'+svg(`<g data-solution-layer="${z+1}">${art+txt(span/2,y+depth*u+24,`작은 칸 ${cells}개`,16)}</g>`,220,166,'뒤쪽부터 앞쪽까지 같은 위치로 맞춘 층별 작은 칸')+'</div>';
  }).join('')+'</div>';
 }
 function voxels(bricks){const map=new Map;for(let i=0;i<bricks.length;i++){const[x,y,z,dx,dy,dz]=bricks[i];for(let a=x;a<x+dx;a++)for(let b=y;b<y+dy;b++)for(let c=z;c<z+dz;c++){const k=[a,b,c].join();if(map.has(k))throw Error('블록이 겹칩니다.');map.set(k,i);}}return map;}
 function pile(bricks,cx,cy,u){
  const map=voxels(bricks),project=([x,y,z])=>[cx+(x-y)*u*Math.sqrt(3)/2,cy+(x+y)*u/2-z*u];
  const cubeFaces=[
   {normal:[1,0,0],corners:[[1,0,0],[1,1,0],[1,1,1],[1,0,1]],tangent:[[0,0,-1],[0,1,0],[0,0,1],[0,-1,0]],color:'#99bcae'},
   {normal:[0,1,0],corners:[[0,1,0],[0,1,1],[1,1,1],[1,1,0]],tangent:[[-1,0,0],[0,0,1],[1,0,0],[0,0,-1]],color:'#bad5c8'},
   {normal:[0,0,1],corners:[[0,0,1],[1,0,1],[1,1,1],[0,1,1]],tangent:[[0,-1,0],[1,0,0],[0,1,0],[-1,0,0]],color:'#e3efe8'}
  ];
  const entries=[...map].map(([s,owner])=>({p:s.split(',').map(Number),owner})).sort((a,b)=>sum(a.p)-sum(b.p)||a.p[2]-b.p[2]);let art='';
  for(const{p,owner}of entries)for(const f of cubeFaces){
   if(map.has(p.map((v,i)=>v+f.normal[i]).join()))continue;
   const pts=f.corners.map(c=>project(c.map((v,i)=>v+p[i])));art+=poly(pts,f.color,'none');
   f.tangent.forEach((t,i)=>{const adjacent=p.map((v,j)=>v+t[j]),next=adjacent.map((v,j)=>v+f.normal[j]);if(map.get(adjacent.join())!==owner||map.has(next.join()))art+=line(pts[i],pts[(i+1)%4],'#456b5d',1.35);});
  }return art;
 }
 function heightBricks(heights){return heights.flatMap((a,y)=>a.flatMap((h,x)=>Array.from({length:h},(_,z)=>[x,y,z,1,1,1])));}
 function elevatedOpenBox(heights,boxH){
   // Reuse the Geometry worksheet's standard isometric projection exactly.
   const width=heights[0].length,depth=heights.length,u=43,cx=330,cy=145,project=([x,y,z])=>[cx+(x-y)*u*.87,cy+(x+y)*u*.5-z*u];
  const qTop=(x,y,z)=>[[x,y,z],[x+1,y,z],[x+1,y+1,z],[x,y+1,z]].map(project);
  const qFront=(x,y,z)=>[[x,y+1,z],[x+1,y+1,z],[x+1,y+1,z+1],[x,y+1,z+1]].map(project);
  const qSide=(x,y,z)=>[[x+1,y,z],[x+1,y+1,z],[x+1,y+1,z+1],[x+1,y,z+1]].map(project);
  let art='';
  for(let y=0;y<depth;y++)for(let x=0;x<width;x++)for(let z=0;z<heights[y][x];z++)art+=poly(qTop(x,y,z+1),'#e5f0eb','#55776d',1)+poly(qFront(x,y,z),'#bad5c8','#55776d',1)+poly(qSide(x,y,z),'#99bcae','#55776d',1);
  const corners={};for(const x of [0,width])for(const y of [0,depth])for(const z of [0,boxH])corners[`${x}${y}${z}`]=project([x,y,z]);
  for(const [a,b] of [['000',`${width}00`],[`00${boxH}`,`${width}0${boxH}`],[`0${depth}0`,`${width}${depth}0`],[`0${depth}${boxH}`,`${width}${depth}${boxH}`],['000',`0${depth}0`],[`${width}00`,`${width}${depth}0`],[`00${boxH}`,`0${depth}${boxH}`],[`${width}0${boxH}`,`${width}${depth}${boxH}`],['000',`00${boxH}`],[`${width}00`,`${width}0${boxH}`],[`0${depth}0`,`0${depth}${boxH}`],[`${width}${depth}0`,`${width}${depth}${boxH}`]])art+=line(corners[a],corners[b],'#71838c',1.3,'5 4');
  return art;
 }
  function cubes(source,d,r){
   const easy=[[[2,2,1],[2,2,0],[2,0,0]]],same=[[[3,3,1],[3,3,0],[3,1,0]],[[3,3,1],[3,1,1],[3,1,0]]],models=d==='easy'?easy:same,heights=clone(models[r(0,models.length-1)]),width=3,depth=3,boxH=d==='easy'?2:3,placed=sum(heights.flat());
   return{
    payload:{kind:'geo-cubes',width,depth,boxH,heights,viewpoint:'geometry-standard-iso',placed,responseMode:'cube-count'},
    prompt:'점선 상자 안에 같은 크기의 쌓기나무를 쌓았습니다. 쌓기나무는 모두 몇 개일까요?',
    problemHtml:svg(elevatedOpenBox(heights,boxH),660,290,'3×3 바닥의 높은 겨냥도로 본 쌓기나무와 점선 상자'),
    answer:placed,
    answerHtml:`${placed}개`,
    solutionDiagram:stackLayerDiagram(heights),
    solution:`아래층부터 차례로 세면 ${Array.from({length:boxH},(_,level)=>heights.flat().filter(height=>height>level).length).join(', ')}개입니다. 모두 더하면 ${placed}개입니다.`
   };
  }
function top(source,d,r){const count=d==='easy'?4:d==='same'?6:7,all=shuffle([0,1,2,3,4,5,6,7,8],r),occupied=all.slice(0,count).sort((a,b)=>a-b),heights=Array.from({length:3},()=>Array(3).fill(0));occupied.forEach(n=>heights[Math.floor(n/3)][n%3]=1);const high=occupied.slice().sort((a,b)=>a%3+Math.floor(a/3)-b%3-Math.floor(b/3))[0];heights[Math.floor(high/3)][high%3]=d==='easy'?1:2;let options=[occupied];const optionCount=d==='easy'?3:d==='same'?4:5;while(options.length<optionCount){const a=shuffle([0,1,2,3,4,5,6,7,8],r).slice(0,count).sort((a,b)=>a-b);if(!options.some(b=>key(a)===key(b)))options.push(a);}options=shuffle(options,r);const answer=options.findIndex(a=>key(a)===key(occupied))+1,base=(()=>{let a='';for(let y=0;y<3;y++)for(let x=0;x<3;x++)a+=poly([[x,y,0],[x+1,y,0],[x+1,y+1,0],[x,y+1,0]].map(([u,v,z])=>[153+(u-v)*26,97+(u+v)*15-z*30]),'#f5f9f7','#abc1b4',.8);return a;})();const drawTop=(a,x,y,u,label)=>grid(3,3,u,x,y)+a.map(n=>rect(x+n%3*u,y+Math.floor(n/3)*u,u,u,'#a9d0d5')).join('')+txt(x+1.5*u,y+3*u+15,'앞',14)+(label?txt(x+1.5*u,y-18,label,17):'');let art=base+pile(heightBricks(heights),153,97,30)+line([100,186],[115,177],INK,2)+poly([[115,177],[105,178],[111,185]],INK,INK)+txt(90,207,'앞',17);art+=options.map((a,i)=>drawTop(a,282+i%3*119,25+Math.floor(i/3)*149,26,i+1)).join('');return{payload:{kind:'geo-top',heights,options},prompt:source.prompt,problemHtml:svg(art,660,options.length>3?305:245,'앞 방향이 표시된 쌓기나무와 위에서 본 보기'),answer,solution:'앞 방향을 맞춘 다음, 쌓기나무가 놓인 자리만 위에서 내려다봅니다. 같은 자리에 여러 개 쌓아도 위에서 보이는 칸은 하나입니다.',solutionDiagram:svg(drawTop(occupied,265,25,43,''),660,185)};}
 function promotedTop(source,d,r){
  const q=top(source,d,r),p=q.payload;
  if(d==='hard'){
   for(const row of p.heights)for(let x=0;x<row.length;x++)if(row[x]===2)row[x]=3;
  }
  const occupied=p.heights.flatMap((row,y)=>row.flatMap((height,x)=>height?[y*3+x]:[]));
  const base=(()=>{let art='';for(let y=0;y<3;y++)for(let x=0;x<3;x++)art+=poly([[x,y,0],[x+1,y,0],[x+1,y+1,0],[x,y+1,0]].map(([u,v,z])=>[153+(u-v)*26,97+(u+v)*15-z*30]),'#f5f9f7','#abc1b4',.8);return art;})();
  const drawTop=(cells,x,y,u,label)=>grid(3,3,u,x,y)+cells.map(n=>rect(x+n%3*u,y+Math.floor(n/3)*u,u,u,'#a9d0d5')).join('')+txt(x+1.5*u,y+3*u+15,'앞',14)+(label?txt(x+1.5*u,y-18,label,17):'');
  let art=base+pile(heightBricks(p.heights),153,97,30)+line([100,186],[115,177],INK,2)+poly([[115,177],[105,178],[111,185]],INK,INK)+txt(90,207,'앞',17);
  art+=p.options.map((cells,index)=>drawTop(cells,282+index%3*119,25+Math.floor(index/3)*149,26,index+1)).join('');
  q.problemHtml=svg(art,660,p.options.length>3?305:245,'앞 방향이 표시된 3층 쌓기나무와 위에서 본 보기');
  q.solutionDiagram=svg(drawTop(occupied,265,25,43,''),660,185);
  return q;
 }
function stack(source,d,r){const width=d==='hard'?6:4,depth=3,max=d==='easy'?2:d==='same'?3:4,highWidth=r(0,1)?2:width-2;
 // Monotone profiles keep the answer-bearing roofs visible; each unit is occupied.
 const profiles=[[[3,3,2,2],[3,3,2,2],[1,1,1,1]],[[3,3,3,3],[3,3,2,2],[1,1,1,1]],[[3,3,3,3],[3,3,3,3],[1,1,1,1]],[[3,3,2,2],[2,2,2,2],[1,1,1,1]]];
 const heights=d==='same'?clone(profiles[r(0,profiles.length-1)]):Array.from({length:depth},(_,y)=>Array.from({length:width},(_,x)=>y===depth-1?1:x<highWidth?max:2));const bricks=[],used=new Set;const free=(x,y,z)=>x>=0&&x<width&&y>=0&&y<depth&&z>=0&&z<heights[y][x]&&!used.has([x,y,z].join());for(let y=0;y<depth;y++)for(let x=0;x<width;x++)for(let z=0;z<heights[y][x];z++){if(!free(x,y,z))continue;let dims;if(z===0&&x<highWidth&&(d==='easy'?y===1:y<2)&&free(x,y,z+1))dims=[1,1,2];else if(free(x+1,y,z))dims=[2,1,1];else if(free(x,y+1,z))dims=[1,2,1];else if(free(x,y,z+1))dims=[1,1,2];else throw Error('두 칸 블록으로 빈틈없이 덮을 수 없습니다.');bricks.push([x,y,z,...dims]);for(let a=x;a<x+dims[0];a++)for(let b=y;b<y+dims[1];b++)for(let c=z;c<z+dims[2];c++)used.add([a,b,c].join());}const answer=bricks.length,layers=Array.from({length:max},(_,i)=>heights.flat().filter(h=>h>i).length),u=width===6?23:30;let art=txt(86,34,'보기',16)+pile([[0,0,0,2,1,1]],76,91,21)+txt(90,143,'블록 1개',15)+pile(bricks,300,130,u);const side=heights.map(a=>Math.max(...a));art+=side.map((h,i)=>Array.from({length:h},(_,z)=>rect(520+i*27,40+(max-1-z)*27,27,27,'#e8f1ec')).join('')).join('')+txt(560,65+max*27,'옆에서 본 모양',15);return{payload:{kind:'geo-stack',bricks,heights,solid:true},prompt:source.prompt,problemHtml:svg(art,660,280,'눕힌 블록과 세운 블록, 가려진 안쪽, 옆모양'),answer,answerHtml:answer+'개',solutionDiagram:stackLayerDiagram(heights),solution:`작은 네모 블록 크기로 나누어 세면 아래층부터 ${layers.join(', ')}칸입니다. 모두 ${layers.join('+')}=${sum(layers)}칸이며 길쭉한 블록 한 개가 두 칸을 차지합니다. 두 칸씩 짝지으면 ${answer}개입니다. 세운 블록을 층마다 중복해서 세지 않습니다.`};}
function bricks(source,d,r){const count=r(2,3),bricks=[];if(d==='hard'){for(let y=0;y<2;y++)for(let i=0;i<count;i++)bricks.push([i*2,y,0,2,1,1]);bricks.push([0,0,1,1,2,1],[count*2-1,0,1,1,1,2]);}else{for(let i=0;i<count;i++)bricks.push([i*2,0,0,2,1,1]);for(let i=0;i<count;i++){const x=i*2+r(0,1);bricks.push([x,0,1,1,1,2]);}}const help=d==='easy'?txt(85,133,'한 개를 눕히기',14)+pile([[0,0,0,1,1,2]],80,199,22)+txt(85,240,'같은 한 개를 세우기',14):'';return{payload:{kind:'geo-bricks',bricks,orientationExample:d==='easy'},prompt:source.prompt.replace(/작은 정육면체/g,'작은 네모 블록'),problemHtml:svg(txt(87,26,'보기',17)+pile([[0,0,0,2,1,1]],80,80,22)+help+pile(bricks,300,120,30),660,295),answer:bricks.length,solution:d==='hard'?'바닥에서 좌우로 눕힌 블록, 앞뒤로 길게 놓은 블록, 위로 세운 블록을 나누어 셉니다. 방향이 달라도 모두 같은 두 칸짜리 블록이며 완전히 가려진 블록은 없습니다.':'바닥에 눕힌 블록과 그 위에 세운 블록을 따로 셉니다. 세운 한 블록은 작은 네모 블록 두 개 높이이지만 블록 한 개입니다.'};}
 const TILE_BASES=[[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[0,1],[1,1]],[[1,0],[2,0],[0,1],[1,1]],[[0,0],[1,0],[2,0],[1,1]]];
 const transforms=a=>[...new Map(Array.from({length:8},(_,t)=>{const v=transform(a,t);return[key(v),v];})).values()];
 const TILE_VARS=TILE_BASES.map(transforms);
 function tileFits(target){const found=[],set=new Set(target.map(String)),mx=Math.max(...target.map(a=>a[0])),my=Math.max(...target.map(a=>a[1]));for(let i=0;i<5;i++)for(const v of TILE_VARS[i])for(let x=0;x<=mx;x++)for(let y=0;y<=my;y++){const a=v.map(([u,w])=>[u+x,w+y]);if(!a.every(p=>set.has(String(p))))continue;const rest=target.filter(p=>!a.some(q=>key(p)===key(q)));for(let j=i+1;j<5;j++)if(TILE_VARS[j].some(q=>key(q)===key(norm(rest))))found.push({pair:[i,j],parts:[a,rest]});}return found;}
function tiles(source,d,r){let target,fits;for(let attempt=0;attempt<(d==='hard'?1500:200);attempt++){const ids=shuffle(d==='hard'?[1,3,4]:[0,1,2,3,4],r).slice(0,2),a=TILE_VARS[ids[0]][r(0,TILE_VARS[ids[0]].length-1)],b=TILE_VARS[ids[1]][r(0,TILE_VARS[ids[1]].length-1)].map(([x,y])=>[x+r(0,0),y]);const dx=r(-3,3),dy=r(-3,3),c=b.map(([x,y])=>[x+dx,y+dy]);if(a.some(p=>c.some(q=>key(p)===key(q)))||!a.some(p=>c.some(q=>Math.abs(p[0]-q[0])+Math.abs(p[1]-q[1])===1)))continue;target=norm([...a,...c]);if(Math.max(...target.map(p=>p[0]))>4||Math.max(...target.map(p=>p[1]))>4)continue;fits=tileFits(target);if(new Set(fits.map(s=>key(s.pair))).size===1&&(d!=='hard'||fits.every(s=>s.parts.every((p,i)=>key(norm(p))!==key(norm(TILE_BASES[s.pair[i]]))))))break;}if(!fits?.length||new Set(fits.map(s=>key(s.pair))).size!==1||(d==='hard'&&!fits.every(s=>s.parts.every((p,i)=>key(norm(p))!==key(norm(TILE_BASES[s.pair[i]]))))))throw Error('두 조각의 선택이 한 가지가 아닙니다.');const selected=fits[0].pair,ids=d==='easy'?shuffle([...selected,[0,1,2,3,4].find(i=>!selected.includes(i))],r):shuffle([0,1,2,3,4],r),options=ids.map(i=>TILE_BASES[i]),answer=selected.map(i=>ids.indexOf(i)+1).sort((a,b)=>a-b),tw=Math.max(...target.map(p=>p[0]))+1,th=Math.max(...target.map(p=>p[1]))+1,u=29,x=(660-tw*u)/2;const draw=(cells,x,y,u,fill)=>cells.map(([a,b])=>rect(x+a*u,y+b*u,u,u,fill)).join('');return{payload:{kind:'geo-tiles',target,options,requiresBothTransforms:d==='hard'},prompt:source.prompt,problemHtml:svg(draw(target,x,12,u,'#fff')+options.map((a,i)=>draw(a,46+i*(570/options.length),th*u+43,19,['#85bdb5','#abcddd','#edcf8f','#c1acd3','#dda49e'][i])+txt(75+i*(570/options.length),th*u+134,i+1,18)).join(''),660,th*u+157),answer,answerHtml:answer.map(n=>n+'번').join(', '),solutionDiagram:svg(fits[0].parts.map((a,i)=>draw(a,x,12,u,['#b8d8d5','#f0d8ab'][i])).join(''),660,th*u+26),solution:`${answer.join('번과 ')}번 조각을 돌리거나 뒤집어 위 모양에 넣습니다. 색을 달리한 풀이 그림에서 겹친 칸과 빈칸이 없는지 확인합니다.`};}
function partition(source,d,r){const basis=d==='hard'?{payload:{apples:[0,3,4,10],berries:[1,6,8,13]},answer:[[0,1,2,5],[3,6,7,11],[4,8,9,12],[10,13,14,15]]}:source;const t=r(0,7),swap=r(0,1),map=n=>{let x=n%4,y=Math.floor(n/4);if(t&4)x=3-x;for(let k=0;k<(t&3);k++)[x,y]=[3-y,x];return y*4+x;},apples=(swap?basis.payload.berries:basis.payload.apples).map(map).sort((a,b)=>a-b),berries=(swap?basis.payload.apples:basis.payload.berries).map(map).sort((a,b)=>a-b),parts=basis.answer.map(a=>a.map(map).sort((a,b)=>a-b)).sort((a,b)=>a[0]-b[0]);const sprite=(kind,x,y)=>`<svg x="${x}" y="${y}" width="32" height="32" viewBox="${kind==='apple'?0:1024} 0 512 512" overflow="hidden"><image href="assets/exam-objects-illustration.png" width="1536" height="1024"/></svg>`;const draw=(answer)=>{let art='';for(let i=0;i<16;i++){const x=226+i%4*52,y=15+Math.floor(i/4)*52,g=parts.findIndex(a=>a.includes(i));art+=rect(x,y,52,52,answer?['#cce4df','#f2d9b3','#d6e4f1','#e1d6ed'][g]:'#fff');if(apples.includes(i))art+=sprite('apple',x+10,y+10);if(berries.includes(i))art+=sprite('berry',x+10,y+10);if(answer){if(i%4<3&&parts.findIndex(a=>a.includes(i+1))!==g)art+=line([x+52,y],[x+52,y+52],INK,3);if(i<12&&parts.findIndex(a=>a.includes(i+4))!==g)art+=line([x,y+52],[x+52,y+52],INK,3);}}return svg(art+(!answer&&d==='easy'?regionBoundary(parts[0],4,52,226,15):''),660,240);};return{payload:{kind:'geo-partition',size:4,apples,berries,givenRegion:d==='easy'?parts[0]:[]},prompt:source.prompt.replace(/과일 그림이 있는 정사각형|정사각형/g,'과일 그림이 있는 모양')+(d==='easy'?' 이미 굵은 선으로 나눈 한 부분은 그대로 두세요.':''),problemHtml:draw(false),answer:parts,answerHtml:'아래 그림과 같이 네 부분으로 나누기',solutionDiagram:draw(true),solution:'각 부분은 네 칸으로 이루어진 같은 모양입니다. 돌리거나 뒤집어 겹쳐 보았을 때 같고, 각 부분에 사과와 딸기가 하나씩 있는지 확인합니다.'};}
 const LABELS={circle:['파란 동그라미',BLUE],square:['빨간 네모','#c9655b'],triangle:['초록 세모',GREEN],star:['노란 별','#c59a30'],'purple-circle':['보라 동그라미','#8b66a6','circle'],'orange-square':['주황 네모','#d68c37','square']};
function box(x,y,labels,w=93,h=87,depth=45){const f=[[x,y],[x+w,y],[x+w,y+h],[x,y+h]],t=[[x,y],[x+depth,y-depth*.66],[x+w+depth,y-depth*.66],[x+w,y]],r=[[x+w,y],[x+w+depth,y-depth*.66],[x+w+depth,y+h-depth*.66],[x+w,y+h]];const mark=(name,p)=>{if(!name)return '';if(p===f)return shape(LABELS[name][2]||name,x+w/2,y+h/2,Math.min(w,h)*.18,LABELS[name][1]);const a=p[0],b=p[1],d=p[3];return `<g transform="matrix(${(b[0]-a[0])/60} ${(b[1]-a[1])/60} ${(d[0]-a[0])/60} ${(d[1]-a[1])/60} ${a[0]} ${a[1]})">${shape(LABELS[name][2]||name,30,30,12,LABELS[name][1])}</g>`;};return poly(t,'#eef5f7')+poly(r,'#c8dce5')+poly(f,'#f6fafb')+mark(labels[0],f)+mark(labels[1],t)+mark(labels[2],r);}
 function opposite(source,d,r){const names=shuffle(d==='hard'?Object.keys(LABELS):['circle','square','triangle','star'],r),views=d==='hard'?[[names[2],names[0],names[4]],[names[2],names[1],names[5]],[names[3],names[0],names[5]]]:[[names[0],names[1],names[2]],[names[0],names[3],names[1]]],query=names[2],answer=LABELS[names[3]][0];return{payload:{kind:'geo-opposite',views,query},prompt:`같은 상자를 ${views.length===3?'세':'두'} 방향에서 본 그림입니다. 여섯 면의 색과 모양의 짝은 모두 다릅니다. ${d==='easy'?`두 그림의 앞면에는 모두 ${LABELS[names[0]][0]}가 있습니다. `:''}${LABELS[query][0]}가 있는 면과 마주 보는 면의 색과 도형을 쓰세요.`,problemHtml:svg(views.map((a,i)=>d==='hard'?box(45+i*211,72,a,80,91,33):box(100+i*315,73,a,i?83:107,i?107:83,45)).join(''),660,225),answer,solution:d==='hard'?`첫째와 둘째 그림에서 ${LABELS[query][0]}와 이웃한 네 면은 ${[names[0],names[4],names[1],names[5]].map(n=>LABELS[n][0]).join(', ')}입니다. 남은 ${LABELS[names[3]][0]}가 마주 보는 면입니다.`:`두 그림에 함께 보이는 ${LABELS[names[0]][0]}와 ${LABELS[names[1]][0]}를 맞춥니다. 그 두 면을 기준으로 양쪽에 있는 ${LABELS[names[2]][0]}와 ${LABELS[names[3]][0]}가 서로 마주 봅니다.`};}
 function symbolRoll(source,d,r){
  const mark=shuffle(Object.keys(LABELS),r)[0],inverse={R:'L',L:'R',U:'D',D:'U'},word={R:'오른쪽',L:'왼쪽',U:'종이 위쪽',D:'종이 아래쪽'};
  const m=d==='easy'?['R','D'][r(0,1)]:['R','L','U','D'][r(0,3)],out=d==='hard'?[m,m==='R'||m==='L'?['U','D'][r(0,1)]:['R','L'][r(0,1)],m]:[m],moves=[...out,...out.slice().reverse().map(m=>inverse[m])];
  let art='';
  if(d==='easy'){const intermediate=m==='R'?[null,null,mark]:[mark,null,null];art=box(50,72,[null,mark,null],69,70,31)+txt(89,178,'처음',17)+txt(197,102,'→',28)+box(272,72,intermediate,69,70,31)+txt(307,178,'첫 번째 굴린 뒤',17)+txt(437,102,'→',28)+txt(554,106,'?',40)+txt(554,178,'마지막 윗면',17);}
else{art=box(62,90,[null,mark,null],72,75,34);const points=[[0,0]];for(const move of moves){const[a,b]=points.at(-1);points.push([a+(move==='R'?1:move==='L'?-1:0),b+(move==='D'?1:move==='U'?-1:0)]);}const minX=Math.min(...points.map(p=>p[0])),minY=Math.min(...points.map(p=>p[1])),point=([x,y])=>[290+(x-minX)*90,32+(y-minY)*90],seen=new Set;points.forEach(p=>{if(seen.has(String(p)))return;seen.add(String(p));const[x,y]=point(p);art+=rect(x,y,90,90,'#f4f8fa');});for(let i=0;i<moves.length;i++){const[a,b]=[point(points[i]),point(points[i+1])],horizontal=a[1]===b[1],off=i<out.length?-15:15,s=[a[0]+45+(horizontal?0:off),a[1]+45+(horizontal?off:0)],t=[b[0]+45+(horizontal?0:off),b[1]+45+(horizontal?off:0)],angle=Math.atan2(t[1]-s[1],t[0]-s[0]);art+=line(s,t,BLUE,2.2)+poly([t,[t[0]-8*Math.cos(angle-.5),t[1]-8*Math.sin(angle-.5)],[t[0]-8*Math.cos(angle+.5),t[1]-8*Math.sin(angle+.5)]],BLUE,BLUE)+shape('circle',(s[0]+t[0])/2,(s[1]+t[1])/2,13,'#fff')+txt((s[0]+t[0])/2,(s[1]+t[1])/2,i+1,20);}art+=txt(115,202,'처음 모습',17);}
return{payload:{kind:'geo-symbol-roll',mark,moves,givenFirstState:d==='easy'},prompt:(d==='hard'?'주사위를 그림의 1번부터 6번 화살표 순서대로 한 칸씩 굴립니다.':'주사위를 '+moves.map(m=>word[m]+'으로 한 칸').join(', ')+' 굴립니다.')+' 처음 윗면에는 '+LABELS[mark][0]+'가 있습니다. 마지막 윗면의 색과 도형을 쓰세요.',problemHtml:svg(art,660,d==='hard'?348:245),answer:LABELS[mark][0],solution:'앞에서 굴린 순서를 거꾸로 되돌리는 움직임입니다. '+(d==='hard'?'뒤의 세 번을 앞의 세 번과 하나씩 짝지어 확인하면 ':'굴렸던 반대 방향으로 한 번 되돌리면 ')+'처음의 면이 다시 위로 옵니다.'};
 }
 function quadrilaterals(source,d,r){const n=LEVELS.indexOf(d),height=2+r(0,2),a=1+r(0,2)/4,slants=[[[a,0],[0,height]],[[a,0],[2,height]],[[4-a,0],[2,height]],[[4-a,0],[4,height]]],ys=Array.from({length:n+2},(_,i)=>i*height/(n+1)),segments=[...slants,...ys.map(y=>[[a*(1-y/height),y],[4-a*(1-y/height),y]])],points=[...new Map(ys.flatMap(y=>slants.map(([p,q])=>{const t=y/height,v=[p[0]+(q[0]-p[0])*t,y];return[key(v),v];}))).values()],answer=3*(n+1)**2,pr=([x,y])=>[160+x*85,18+y/height*195];return{payload:{kind:'geo-quadrilaterals',points,segments,horizontalLevels:ys},prompt:source.prompt,problemHtml:svg(segments.map(a=>line(pr(a[0]),pr(a[1]),BLUE,2.3)).join(''),660,235),answer,answerHtml:answer+'개',solution:n===0?'위와 아래의 가로선을 골라 네 변으로 닫히는 모양을 찾으면 3개입니다.':n===1?'위·가운데 사이에 4개, 가운데·아래 사이에 5개, 위·아래 사이에 3개입니다. 4+5+3=12개입니다.':'가로선 두 줄씩 골라 셉니다. 맨 위와 중간선은 각각 4개씩, 맨 아래와 중간선은 각각 5개씩, 두 중간선 사이 6개, 맨 위와 맨 아래 사이 3개입니다. 4+4+5+5+6+3=27개입니다.'};}
function pattern(source,d,r){const ring=[[1,0],[0,1],[-1,1],[-1,0],[0,-1],[1,-1]],target=ring.map((v,i)=>[[0,0],v,ring[(i+1)%6]]),extensions=d==='easy'?0:d==='same'?r(1,2):r(3,4),start=r(0,5);for(let i=0;i<extensions;i++){const a=ring[(start+i)%6],b=ring[(start+i+1)%6];target.push([a,b,[a[0]+b[0],a[1]+b[1]]]);}const red=target.slice(0,3),answer=target.length-3,pr=([x,y],cx,cy,u)=>[cx+u*(x+y/2),cy+u*y*Math.sqrt(3)/2];const draw=trianglePiece;return{payload:{kind:'geo-pattern',target,redPiece:red,greenPiece:[target[0]]},prompt:'큰 모양을 빨간 조각 한 개와 초록 조각으로만 빈틈없이 채우려고 합니다. 조각을 겹치거나 자를 수 없습니다. 초록 조각은 몇 개 필요합니까?',problemHtml:svg(draw(target,166,128,43,'#fff')+draw(red,405,114,38,'#dc7970')+draw([target[0]],555,102,38,'#71a88d')+txt(401,205,'빨간 조각',17)+txt(567,205,'초록 조각',17),660,250),answer,answerHtml:answer+'개',solutionDiagram:svg(draw(red,330,121,43,'#e2a09a')+draw(target.slice(3),330,121,43,'#a9cfb9'),660,248),solution:`빨간 조각은 작은 세모 세 칸을 채웁니다. 나머지를 초록 조각으로 하나씩 채우면 ${answer}개가 필요합니다.`};}
 function trianglePiece(cells,cx,cy,u,fill){const pr=([x,y])=>[cx+u*(x+y/2),cy+u*y*Math.sqrt(3)/2],edges=new Map;let art=cells.map(t=>poly(t.map(pr),fill,'none')).join('');for(const t of cells)for(let i=0;i<3;i++){const a=t[i],b=t[(i+1)%3],k=[String(a),String(b)].sort().join('|');if(!edges.has(k))edges.set(k,{a,b,count:0});edges.get(k).count++;}for(const e of edges.values())if(e.count===1)art+=line(pr(e.a),pr(e.b),'#6d9686',1.5);else if(fill==='#fff'||fill==='#a9cfb9')art+=line(pr(e.a),pr(e.b),'#b1c2b9',1,'3 3');return art;}
 POLICY.pattern=['여섯 칸 모양을 조각으로 채우기','바깥에 이어진 칸까지 조각으로 채우기','여러 방향으로 이어진 모양을 조각으로 채우기'];
 POLICY.links=['12칸에서 세 쌍 연결·두 칸 더 돌아가기','15칸에서 세 쌍 연결·네 칸 더 돌아가기','16칸에서 세 쌍 연결·여섯 칸 더 돌아가기'];
 POLICY.walk=['9칸을 모두 한 번씩 지나는 선','12칸을 모두 한 번씩 지나는 선','16칸과 숫자 다섯 개를 차례로 연결'];
 POLICY.analogy=['안팎 교환, 보기 세 개에서 선택','안팎 교환, 보기 네 개에서 선택','세 겹에서 가운데를 유지하며 안팎 교환'];
 POLICY.matrix=['세 종류의 도형, 보기 세 개','세 종류의 도형, 보기 네 개','네 종류의 도형과 빈자리 세 곳을 함께 판단'];
 POLICY.partition=['한 부분의 경계를 보고 나머지 세 부분 나누기','두 방향으로 놓인 꺾인 네 칸 모양 찾기','네 방향으로 놓인 가운데가 튀어나온 모양 찾기'];
 POLICY.opposite=['공통 앞면을 글로 짚어 두 방향 비교','두 그림의 공통 면을 찾아 반대면 추론','세 그림에서 네 이웃 면을 제외해 반대면 추론'];
 POLICY.tiles=['보기 세 조각 중 두 조각','보기 다섯 조각 중 두 조각','두 조각 모두 돌리거나 뒤집어 넣기'];
 POLICY['symbol-roll']=['첫 굴림의 중간 모습을 보고 한 단계 되돌리기','두 번 굴린 뒤 윗면의 표시 추론','두 방향으로 세 번 간 뒤 역순으로 세 번 되돌리기'];
 POLICY.bricks=['같은 블록의 눕힌 모습과 세운 보기를 제시','눕힌 블록과 세운 블록을 그림에서 구별','좌우·앞뒤·위아래 세 방향의 같은 블록 구별'];
 function regionBoundary(region,n,u,x,y){let art='';for(const i of region){const c=i%n,r=Math.floor(i/n),s=[x+c*u,y+r*u];for(const [dx,dy,a,b]of [[-1,0,[0,0],[0,1]],[1,0,[1,0],[1,1]],[0,-1,[0,0],[1,0]],[0,1,[0,1],[1,1]]])if(c+dx<0||c+dx>=n||r+dy<0||r+dy>=n||!region.includes(i+dx+dy*n))art+=line([s[0]+a[0]*u,s[1]+a[1]*u],[s[0]+b[0]*u,s[1]+b[1]*u],INK,3);}return art;}
 function hardMatrix(source,r){const names=shuffle(['circle','triangle','square','star'],r),pairs=names.map((a,i)=>[a,names[(i+1)%4]]),perm=shuffle([0,1,2,3],r),matrix=Array.from({length:4},(_,y)=>Array.from({length:4},(_,x)=>perm[(x+y)%4])),query=[2,2],missing=matrix[2][2];for(const[y,x]of [[2,2],[2,0],[3,2]])matrix[y][x]=null;const options=shuffle(pairs,r),answer=options.findIndex(a=>key(a)===key(pairs[missing]))+1;return{payload:{kind:'geo-matrix',pairs,matrix,options,query},prompt:'큰 상자의 가로줄과 세로줄에서 모양이 바뀌는 규칙을 찾으세요. 비어 있는 곳에도 같은 규칙이 이어집니다. ㉠에 들어갈 그림을 보기에서 고르고 번호를 쓰세요.',problemHtml:svg(matrix.map((a,y)=>a.map((v,x)=>rect(20+x*70,10+y*70,70,70)+(v===null?y===query[0]&&x===query[1]?txt(55+x*70,45+y*70,'㉠',25):'':compound(pairs[v],55+x*70,45+y*70,27))).join('')).join('')+options.map((a,i)=>compound(a,395+i%2*160,82+Math.floor(i/2)*148,37)+txt(395+i%2*160,134+Math.floor(i/2)*148,i+1,18)).join(''),660,315),answer,solution:'각 가로줄과 세로줄에 네 종류의 그림이 한 번씩 들어갑니다. ㉠의 가로줄에서 빠진 두 그림과 세로줄에서 빠진 두 그림을 비교하면 공통으로 빠진 한 그림을 찾을 수 있습니다.'};}
 function fourOptionTiles(source,d,r){
  const q=tiles(source,d,r);
  if(d!=='same')return q;
  const p=q.payload,removeIndex=Array.from({length:p.options.length},(_,index)=>index).reverse().find(index=>!q.answer.includes(index+1));
  if(removeIndex===undefined)throw Error('유제에서 빼도 되는 오답 조각이 없습니다.');
  p.options=p.options.filter((_,index)=>index!==removeIndex);
  q.answer=q.answer.map(position=>position-(position>removeIndex+1?1:0));
  const target=p.target,tw=Math.max(...target.map(cell=>cell[0]))+1,th=Math.max(...target.map(cell=>cell[1]))+1,u=29,x=(660-tw*u)/2;
  const draw=(cells,left,top,unit,fill)=>cells.map(([a,b])=>rect(left+a*unit,top+b*unit,unit,unit,fill)).join('');
  q.problemHtml=svg(draw(target,x,12,u,'#fff')+p.options.map((cells,index)=>draw(cells,58+index*145,th*u+43,19,['#85bdb5','#abcddd','#edcf8f','#c1acd3'][index])+txt(87+index*145,th*u+134,index+1,18)).join(''),660,th*u+157);
  q.answerHtml=q.answer.map(number=>number+'번').join(', ');
  q.solution=`${q.answer.join('번과 ')}번 조각을 돌리거나 뒤집어 위 모양에 넣습니다. 네 보기 중 다른 조합으로는 빈틈과 겹침이 없이 채울 수 없습니다.`;
  return q;
 }
 const GENERATORS={cycle,cubes,top,fold,partition,analogy,digital,stars,matrix,'route-count':routeCount,rotation,quadrilaterals,links:pathQuestion,walk:pathQuestion,tiles,opposite,bricks,stack,pattern,'symbol-roll':symbolRoll};
 GENERATORS.top=promotedTop;
 GENERATORS.tiles=fourOptionTiles;
 const FIT={language:'짧은 한국어 지시문과 보기의 번호·색·모양 사용',representations:'원형의 접기·입체·모눈·도형 그림을 좌표에서 생성',prerequisites:'세기, 같은 모양 찾기, 간단한 더하기·빼기; 넓이 공식·곱셈·각도 계산 불필요','reasoning-load':'단순히 보이는 수를 세지 않고 원형의 접기·가림·회전·배치 조건을 적용','response-mode':'원형의 그리기·색칠·수 또는 번호 쓰기를 보존'};
 function generate(source,difficulty,seed){if(!supports(source))throw Error('지원하지 않는 기하 세부 유형입니다.');if(!LEVELS.includes(difficulty)||!levels(source)[difficulty])throw Error('이 난이도는 검수 전입니다.');if(!Number.isInteger(seed)||seed<0||seed>4294967295)throw Error('seed는 32비트 양의 정수 또는 0이어야 합니다.');const f=family(source),q=GENERATORS[f](source,difficulty,rng(seed));q.typeId=source.typeId;q.domain=source.domain;q.number=source.number;q.difficulty=difficulty;q.seed=seed;q.answerHtml=q.answerHtml===undefined?String(q.answer):q.answerHtml;q.payload.sourceTypeId=source.typeId;q.learnerFit={learner_stage:'6세 유치원',...FIT,representations:f,reasoningLoad:notes(source)[LEVELS.indexOf(difficulty)],responseMode:Array.isArray(q.answer)?'원형의 그림·색칠 또는 순서 있는 응답':'원형의 수·번호·도형 이름 쓰기'};q.evidence={owner:'challenge_studio',reviewer:'parent-pending',release:'locked',sourceLocator:source.typeId,gate:'learner-fit',learner_stage:'6세 유치원',criteria:Object.keys(FIT)};if(!q.prompt||q.answer===undefined||/undefined|NaN/.test(q.problemHtml||''))throw Error('기하 표현 검증 실패');return q;}
 const api=Object.freeze({supports,levels,notes,generate});root.HFChallengeGeometryExtension=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
