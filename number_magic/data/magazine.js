/* ============================================================
   Numbers of Magic — 매거진(읽을거리)

   왜 따로 있나 (2026-09-20, 원장: "도형이 여기 있을 리는 없어 — 매거진인 거야")
   ------------------------------------------------------------
   「수의 마법」은 연산 앱이다. 그런데 수학 이야기 자료에는 연산 유닛에 붙일 자리가
   없는 최상급 소재가 잔뜩 있다 — 평균의 함정, 축구공과 정이십면체, 삼각 탁자,
   지어낸 숫자 가려내기. 억지로 유닛에 붙이면 유닛이 망가지고, 안 쓰면 자료가 썩는다.
   그래서 **유닛에 안 붙는 읽을거리는 매거진 기사로 싣는다.**

   세 군데에서 같은 글을 쓴다:
     · 마을 — 가판대(S.view='magazine')에서 언제든 읽는다
     · 학습지 — 회차 상황에 맞는 기사 한 편이 문제 뒤에 실린다(app/exam.js)
     · (앞으로) 편지함·리포트에서도 같은 데이터를 쓸 수 있다

   기사 하나 = 이 배열의 원소 하나. **글만 있으면 안 된다** — 표제 그림 1장과
   본문 그림이 함께 있어야 한다(원장: "글로만이 아니라 잘 이해하고 설명되도록").

   상황 매칭(fit)
   ------------------------------------------------------------
   `fit.units`·`fit.threads` 에 닿으면 그 회차에 그 기사를 싣는다. 비어 있으면
   나이대(age)로만 고르고 봉투 코드로 돌린다 — **과정 번호(주차)로는 고르지 않는다.**

   그림 규칙: viewBox 는 표제 320×170 · 본문 320×130 고정, 색은 아래 C 만,
   그림 속 글자는 숫자·기호·단위만(3개 언어가 그림 한 벌을 공유한다).
   검사기: node scripts/check-magazine.js
   ============================================================ */
(function(){
'use strict';

const C = {
  ink:'#1A2233', blue:'#16417C', bluedeep:'#0E2C57', gold:'#C9A063',
  goldbright:'#F5D98B', red:'#D9534F', ok:'#2E9E6B', purple:'#8B6BC7',
  paper:'#fdf6e3', mist:'#f1f0ec', brown:'#8a6d46', sub:'#4a5468',
  grey:'#b0b7c3', cream:'#fdfaf3', sky:'#7ea4d6', water:'#5b8dd9',
  /* 당구대 나사천 — 팔레트에 '면으로 깔 초록'이 없다(C.ok 는 글자용이라 너무 진하다) */
  felt:'#dfe7db'
};
const head = inner => '<svg viewBox="0 0 320 170" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'+inner+'</svg>';
const fig  = inner => '<svg viewBox="0 0 320 130" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">'+inner+'</svg>';
const T = (x,y,s,c,str,extra) => '<text x="'+x+'" y="'+y+'" text-anchor="middle" font-size="'+s
  +'" font-weight="800" fill="'+c+'"'+(extra?' '+extra:'')+'>'+str+'</text>';
const line = (x1,y1,x2,y2,c,w,dash) => '<line x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2
  +'" stroke="'+c+'" stroke-width="'+(w||2)+'" stroke-linecap="round"'+(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
const box = (x,y,w,h,f,s) => '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="6" fill="'+(f||C.paper)
  +'" stroke="'+(s||C.gold)+'" stroke-width="2.5"/>';
/* 화살표 — 선 + 삼각 머리. 만화 헬퍼에는 있는데 여기엔 없어서 한 번 걸렸다. */
const arrow = (x1,y1,x2,y2,c,w) => {
  const a = Math.atan2(y2-y1, x2-x1), L = 10;
  const h1x = x2 - L*Math.cos(a-0.42), h1y = y2 - L*Math.sin(a-0.42);
  const h2x = x2 - L*Math.cos(a+0.42), h2y = y2 - L*Math.sin(a+0.42);
  return line(x1,y1,x2,y2,c||C.gold,w||3)
    + '<polygon points="'+x2+','+y2+' '+h1x.toFixed(1)+','+h1y.toFixed(1)+' '
    + h2x.toFixed(1)+','+h2y.toFixed(1)+'" fill="'+(c||C.gold)+'"/>';
};
const dot = (x,y,r,c) => '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'"/>';

/* ── 깎은 정이십면체 ───────────────────────────────────────────────────────
   축구공 기사의 그림은 **진짜 그 입체를 계산해서** 그린다. 처음엔 원 하나에 오각형을
   대충 얹어 그렸는데 원장이 바로 "축구공 넘 대충"이라고 했다 — 정오각형 12·정육각형 20이
   기사의 본문인데 그림이 그걸 안 보여 주면 글과 그림이 따로 논다.

   ① 정이십면체 꼭짓점 = (0, ±1, ±φ) 의 순환치환 12개, 모서리는 거리 2 인 쌍 30개
   ② 각 모서리를 1/3 지점에서 끊으면 점 60개 — 원래 꼭짓점마다 오각형 12개,
      원래 삼각형마다 육각형 20개가 생긴다(= 깎은 정이십면체)
   ③ 정사영해서 앞면만 그린다(면 중심의 z 로 자르고 z 순으로 쌓는다)
   그래서 본문의 60·90·32 와 그림이 같은 물체를 말한다. */
const PHI=(1+Math.sqrt(5))/2;
function solid(){
  if(solid._c) return solid._c;
  const v=[];
  [[0,1,PHI],[0,1,-PHI],[0,-1,PHI],[0,-1,-PHI]].forEach(p=>{
    v.push([p[0],p[1],p[2]],[p[1],p[2],p[0]],[p[2],p[0],p[1]]);
  });
  const E=[], adj=v.map(()=>[]);
  for(let i=0;i<12;i++) for(let j=i+1;j<12;j++){
    const d=Math.hypot(v[i][0]-v[j][0],v[i][1]-v[j][1],v[i][2]-v[j][2]);
    if(Math.abs(d-2)<1e-6){ E.push([i,j]); adj[i].push(j); adj[j].push(i); }
  }
  const F=[];
  for(let a=0;a<12;a++) for(const b of adj[a]) for(const c of adj[b])
    if(c>b && b>a && adj[a].indexOf(c)>=0) F.push([a,b,c]);
  const key=(a,b)=>a+'_'+b, P={}, pts=[];
  const cut=(a,b)=>{ P[key(a,b)]=pts.length; pts.push([0,1,2].map(k=>v[a][k]+(v[b][k]-v[a][k])/3)); };
  E.forEach(([a,b])=>{ cut(a,b); cut(b,a); });
  const sub=(a,b)=>[a[0]-b[0],a[1]-b[1],a[2]-b[2]];
  const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
  const crs=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const nrm=a=>{const L=Math.hypot(a[0],a[1],a[2]);return [a[0]/L,a[1]/L,a[2]/L];};
  const pent=[];
  for(let a=0;a<12;a++){
    const ns=adj[a].slice(), n=nrm(v[a]), u=nrm(sub(v[ns[0]],v[a])), w=crs(n,u);
    ns.sort((x,y)=>Math.atan2(dot(sub(v[x],v[a]),w),dot(sub(v[x],v[a]),u))
                  -Math.atan2(dot(sub(v[y],v[a]),w),dot(sub(v[y],v[a]),u)));
    pent.push(ns.map(b=>P[key(a,b)]));
  }
  const hex=F.map(([a,b,c])=>[P[key(a,b)],P[key(b,a)],P[key(b,c)],P[key(c,b)],P[key(c,a)],P[key(a,c)]]);
  return (solid._c={icoV:v, icoF:F, pts, pent, hex});
}
function spin(p,ax,ay){
  let x=p[0],y=p[1],z=p[2],c=Math.cos(ay),s=Math.sin(ay);
  const x2=x*c+z*s, z2=-x*s+z*c; c=Math.cos(ax); s=Math.sin(ax);
  return [x2, y*c-z2*s, y*s+z2*c];
}
const AX=0.36, AY=0.30;
function poly(pts,fill,stroke,w,dash){
  return '<polygon points="'+pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')
    +'" fill="'+fill+'" stroke="'+stroke+'" stroke-width="'+w+'" stroke-linejoin="round"'
    +(dash?' stroke-dasharray="'+dash+'"':'')+'/>';
}
/* 축구공 — hi 를 주면 그 번호의 오각형만 빨강(어느 꼭짓점이 잘렸는지 가리킬 때) */
function ballArt(cx,cy,R,hi){
  const S=solid(), rad=Math.hypot(S.pts[0][0],S.pts[0][1],S.pts[0][2]);
  const P=S.pts.map(p=>spin([p[0]/rad,p[1]/rad,p[2]/rad],AX,AY));
  const out=[];
  const put=(idx,fill)=>{
    let z=0; idx.forEach(i=>{ z+=P[i][2]; }); z/=idx.length;
    if(z<=-0.04) return;
    out.push({z:z, fill:fill, pts:idx.map(i=>[cx+P[i][0]*R, cy-P[i][1]*R])});
  };
  S.hex.forEach(f=>put(f,C.paper));
  S.pent.forEach((f,i)=>put(f, hi===i ? C.red : C.ink));
  out.sort((a,b)=>a.z-b.z);
  return '<circle cx="'+cx+'" cy="'+cy+'" r="'+R+'" fill="'+C.paper+'" stroke="'+C.ink+'" stroke-width="2.5"/>'
    +out.map(f=>poly(f.pts,f.fill,C.ink,1.6)).join('');
}
/* 정이십면체 — 앞면은 채우고 뒷면은 점선으로(입체가 보이게). mark 를 주면 그 꼭짓점에 빨간 점 */
function icoArt(cx,cy,R,mark){
  const S=solid(), rad=Math.hypot(S.icoV[0][0],S.icoV[0][1],S.icoV[0][2]);
  const V=S.icoV.map(p=>spin([p[0]/rad,p[1]/rad,p[2]/rad],AX,AY));
  const f=S.icoF.map(idx=>{
    let z=0; idx.forEach(i=>{ z+=V[i][2]; }); z/=3;
    return {z:z, pts:idx.map(i=>[cx+V[i][0]*R, cy-V[i][1]*R])};
  }).sort((a,b)=>a.z-b.z);
  return f.map(x=>x.z>0 ? poly(x.pts,C.mist,C.blue,2) : poly(x.pts,'none',C.grey,1.4,'4 3')).join('')
    + (mark===undefined ? '' : dot(cx+V[mark][0]*R, cy-V[mark][1]*R, 5.5, C.red));
}

/* 강 단면 — 바닥 곡선 + 물. depth(0~1) 배열을 받아 가운데가 깊은 강을 그린다 */
function riverBed(pts, top, bottom){
  let d = 'M 20 '+top;
  pts.forEach((v,i) => { d += ' L '+(20+i*(280/(pts.length-1)))+' '+(top+v*(bottom-top)); });
  d += ' L 300 '+top+' Z';
  return '<path d="'+d+'" fill="'+C.water+'" opacity="0.55"/><path d="'+d.replace(/ Z$/,'')+'" fill="none" stroke="'+C.brown+'" stroke-width="2.5"/>';
}

/* ── 뫼비우스의 띠 ─────────────────────────────────────────────────────────
   띠를 "대충 꼬인 고리"로 그리면 **면이 하나**라는 기사의 본문이 그림에 안 보인다.
   그래서 축구공과 같은 원칙으로 실제 곡면을 매개변수로 그린다.
     x = (R + v·cos(u/2))·cos u ,  y = (R + v·cos(u/2))·sin u ,  z = v·sin(u/2)
   u 를 한 바퀴 돌리는 동안 v 축(띠의 폭)이 **반 바퀴만** 돌기 때문에, 한 바퀴를 돌고
   오면 앞뒤가 뒤집혀 있다 — 그게 면이 하나인 이유다. 조각마다 깊이로 정렬해 겹침을
   맞춘다. */
function mobiusArt(cx, cy, R, w, n){
  const quads = [];
  const P = (u, v) => {
    const r = R + v * Math.cos(u / 2);
    const x = r * Math.cos(u), y = r * Math.sin(u), z = v * Math.sin(u / 2);
    return [cx + x, cy - (y * 0.40 + z * 0.92), y];      /* 살짝 기울여 본 투영 */
  };
  for(let i = 0; i < n; i++){
    const u0 = i * 2 * Math.PI / n, u1 = (i + 1) * 2 * Math.PI / n;
    const a = P(u0, -w), b = P(u0, w), c = P(u1, w), d = P(u1, -w);
    quads.push({ z: (a[2] + c[2]) / 2, i: i,
      pts: [a, b, c, d].map(q => [q[0], q[1]]) });
  }
  quads.sort((p, q) => p.z - q.z);
  return quads.map(q =>
    poly(q.pts, q.i % 2 ? C.paper : C.goldbright, C.brown, 1.2)).join('');
}

window.NM_MAGAZINE = {
  name:{ ko:'수의 마법 매거진', en:'Numbers of Magic Magazine', zh:'数的魔法杂志' },
  tagline:{ ko:'유닛에 안 들어가는, 그래도 꼭 읽어야 할 수학',
            en:'The mathematics that does not fit a unit — and still has to be read',
            zh:'放不进单元、却一定要读的数学' },
  articles:[

/* ── 1. 평균 ───────────────────────────────────────────── */
{ id:'mz-average', no:1,
  kicker:{ ko:'통계', en:'Statistics', zh:'统计' },
  title:{ ko:'평균만 믿고 강을 건너면', en:'Crossing a River on an Average', zh:'只信平均数就过河' },
  lede:{ ko:'강의 평균 수심은 140 cm, 병사들의 평균 키는 165 cm였습니다. 건널 수 있을까요?',
         en:'The river was 140 cm deep on average; the soldiers were 165 cm tall on average. Can they wade across?',
         zh:'河的平均水深140厘米，士兵的平均身高165厘米。能蹚过去吗？' },
  art: head(
    line(10,44,310,44,C.grey,2,'6 6')
    +riverBed([0.05,0.3,0.62,0.86,0.95,0.86,0.62,0.3,0.05],44,150)
    +line(10,86,310,86,C.red,3)
    +T(96,80,15,C.red,'140')
    +line(160,86,160,146,C.ink,3)
    +T(196,124,15,C.ink,'220')
    +line(40,30,40,86,C.bluedeep,4)
    +line(32,30,48,30,C.bluedeep,3)
    +T(40,22,15,C.bluedeep,'165')),
  body:[
    { h:{ ko:'평균은 가운데만 말해 준다', en:'An average speaks only for the middle', zh:'平均数只说中间' },
      p:{ ko:'두 마을의 평균 소득이 똑같아도 속은 전혀 다를 수 있어요. 한쪽은 모두 비슷하게 살고, 다른 한쪽은 아주 부자와 아주 가난한 사람이 섞여 있을 수 있거든요. 평균은 그 차이를 하나도 보여 주지 못합니다.',
         en:'Two villages can share the same average income and be nothing alike. In one, everybody earns about the same; in the other, the very rich and the very poor live side by side. The average shows none of that.',
         zh:'两个村子的平均收入可以完全一样，内情却天差地别。一个村人人相近，另一个村里既有巨富也有赤贫。平均数把这些差别全抹平了。' },
      art: fig(
        line(20,100,300,100,C.grey,2)
        +[0,1,2,3,4,5,6].map(i=>dot(70+i*8,60,5,C.blue)).join('')
        +T(94,120,13,C.sub,'A')
        +[0,1,2].map(i=>dot(190+i*7,92,5,C.blue)).join('')
        +[0,1,2].map(i=>dot(250+i*7,24,5,C.blue)).join('')
        +T(240,120,13,C.sub,'B')
        +line(20,58,300,58,C.red,2.5,'7 5')
        +T(160,32,15,C.red,'A = B')) },
    { h:{ ko:'강은 평균으로 건너지 않는다', en:'You do not wade an average', zh:'过河靠的不是平均' },
      p:{ ko:'강을 건널 때 중요한 것은 평균 수심이 아니라 가장 깊은 곳의 수심이에요. 평균이 140 cm라도 한가운데가 220 cm라면, 키 165 cm인 사람은 거기서 발이 닿지 않습니다. 평균은 가장 깊은 곳을 숨깁니다.',
         en:'What matters at a river is not the average depth but the depth at the deepest point. Even if the average is 140 cm, a middle that drops to 220 cm is over the head of someone 165 cm tall. The average hides the deep part.',
         zh:'过河要紧的不是平均水深，而是最深处有多深。就算平均是140厘米，河心若有220厘米，165厘米高的人到那儿就踩不到底。平均数把最深的地方藏了起来。' },
      art: fig(
        riverBed([0.05,0.34,0.7,0.92,1,0.92,0.7,0.34,0.05],26,118)
        +line(10,62,310,62,C.red,3)
        +T(36,56,13,C.red,'140')
        +line(160,62,160,116,C.ink,3)
        +T(196,98,13,C.ink,'220')
        +T(66,22,13,C.ok,'165')) },
    { h:{ ko:'평균 옆에 두 수를 더 적는다', en:'Write two more numbers beside the average', zh:'在平均数旁再写两个数' },
      p:{ ko:'그래서 어른들은 평균을 말할 때 가장 큰 값과 가장 작은 값, 또는 얼마나 흩어져 있는지를 함께 말해요. 숫자 하나로 전체를 말하려고 할 때마다, 그 하나가 무엇을 숨기고 있는지 물어보세요.',
         en:'That is why grown-ups quote the highest and the lowest value — or how widely the numbers are spread — right next to the average. Whenever one number is asked to speak for everything, ask what that one number is hiding.',
         zh:'所以大人们说平均数时，会把最大值和最小值、或者数据有多分散一起说出来。每当有人用一个数代表全部，就该问：这个数藏起了什么？' },
      art: fig(
        box(20,30,280,66,C.paper,C.gold)
        +T(84,62,15,C.sub,'?')+T(160,62,20,C.red,'140')+T(236,62,15,C.sub,'?')
        +line(112,62,132,62,C.gold,2.5)+line(188,62,208,62,C.gold,2.5)
        +T(84,88,15,C.ok,'↓')+T(236,88,15,C.ok,'↑')) }
  ],
  close:{ ko:'평균은 거짓말을 하지 않아요. 다만 혼자서는 이야기의 절반만 합니다.',
          en:'An average never lies. It simply tells only half the story on its own.',
          zh:'平均数不说谎，它只是单独出场时只讲了一半的故事。' },
  source:{ ko:'강을 건너다 빠졌다는 장수 이야기는 옛날부터 전해 오는 이야기예요. 진짜 있었던 일인지는 알 수 없지만, 평균이 무엇을 숨기는지는 분명합니다.',
           en:'The tale of the general who marched his soldiers into the river has been passed down for a long time. Whether it truly happened we cannot say — but what an average hides is certain.',
           zh:'将军带兵蹚河的故事流传已久，是否真有其事无从确认，但平均数藏起了什么，却是确定的。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] },

/* ── 2. 축구공 ─────────────────────────────────────────── */
{ id:'mz-soccer', no:2,
  kicker:{ ko:'도형', en:'Shapes', zh:'图形' },
  title:{ ko:'축구공은 정이십면체에서 태어났다', en:'A Football Is a Cut-Down Icosahedron', zh:'足球是被削角的正二十面体' },
  lede:{ ko:'둥글어 보이지만 축구공은 구가 아니에요. 정오각형과 정육각형을 이어 붙인 다면체랍니다.',
         en:'It looks round, but a football is not a sphere. It is a polyhedron stitched from pentagons and hexagons.',
         zh:'看着是圆的，足球却不是球。它是用正五边形和正六边形缝起来的多面体。' },
  art: head(
    ballArt(160,84,68)
    +T(44,150,16,C.ink,'12')+T(276,150,16,C.gold,'20')),
  body:[
    { h:{ ko:'출발은 삼각형 스무 개', en:'It starts with twenty triangles', zh:'起点是二十个三角形' },
      p:{ ko:'정이십면체는 정삼각형 20개로 이루어진 입체예요. 꼭짓점은 12개, 모서리는 30개. 정다면체 중에서 면이 가장 많은 도형이랍니다.',
         en:'An icosahedron is built from twenty equilateral triangles. It has twelve vertices and thirty edges — the regular solid with the most faces.',
         zh:'正二十面体由二十个正三角形组成，有十二个顶点、三十条棱——是面数最多的正多面体。' },
      art: fig(
        icoArt(160,57,56)
        +T(160,124,17,C.blue,'20')) },
    { h:{ ko:'꼭짓점 열두 개를 잘라 낸다', en:'Slice off the twelve corners', zh:'把十二个角削掉' },
      p:{ ko:'뾰족한 꼭짓점 12개를 하나씩 싹둑 자르면, 잘린 자리마다 정오각형이 생겨요. 오각형 12개! 그리고 원래 삼각형 20개는 모서리가 깎여 정육각형 20개가 됩니다.',
         en:'Cut each of the twelve sharp corners straight off and a regular pentagon appears at every cut — twelve of them. Meanwhile the twenty triangles lose their tips and become twenty hexagons.',
         zh:'把十二个尖角一个个削平，每削一处就露出一个正五边形——一共十二个。原来的二十个三角形被削去尖端，正好变成二十个正六边形。' },
      art: fig(
        /* 같은 각도로 놓은 두 입체 — 왼쪽 꼭짓점 하나가 오른쪽에서 오각형이 된다 */
        icoArt(74,58,42,0)
        +'<path d="M 142 58 L 176 58" stroke="'+C.gold+'" stroke-width="3.5" stroke-linecap="round"/>'
        +'<polygon points="184,58 172,51 172,65" fill="'+C.gold+'"/>'
        +ballArt(246,58,44,0)
        +T(74,120,15,C.red,'1')+T(246,120,15,C.red,'5')) },
    { h:{ ko:'세어 보면 딱 맞는다', en:'Count them and it works out', zh:'数一数正好对上' },
      p:{ ko:'면은 12 + 20 = 32개, 꼭짓점은 60개, 모서리는 90개예요. 입체도형에는 늘 성립하는 규칙이 하나 있어요. (꼭짓점) − (모서리) + (면) = 2. 60 − 90 + 32 = 2, 정확히 맞습니다!',
         en:'That makes 12 + 20 = 32 faces, 60 vertices and 90 edges. Solids obey one unbreakable rule: vertices minus edges plus faces equals two. 60 − 90 + 32 = 2. It fits exactly.',
         zh:'于是面是12 + 20 = 32个，顶点60个，棱90条。立体图形有一条永远成立的规律：顶点数减棱数加面数等于2。60 − 90 + 32 = 2，分毫不差。' },
      art: fig(
        box(24,26,272,54,C.paper,C.gold)
        +T(160,60,19,C.ink,'60 - 90 + 32 = 2')
        +T(74,106,13,C.red,'60')+T(160,106,13,C.blue,'90')+T(246,106,13,C.gold,'32')) }
  ],
  close:{ ko:'바람을 넣어 빵빵해졌을 뿐, 축구공의 속마음은 여전히 다면체예요.',
          en:'Pump it full of air and it bulges — but a football is a polyhedron at heart.',
          zh:'充足气它鼓起来，可足球的骨子里还是个多面体。' },
  source:{ ko:'두 가지 이상의 정다각형으로 이루어지고 구에 내접하는 다면체를 준정다면체라고 불러요. 축구공 모양은 그중 하나랍니다.',
           en:'A solid made of two or more kinds of regular polygon and fitting inside a sphere is called a semi-regular solid. The football shape is one of them.',
           zh:'由两种以上正多边形组成、又能内接于球的多面体叫半正多面体。足球的形状就是其中之一。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] },

/* ── 3. 삼각 탁자 ──────────────────────────────────────── */
{ id:'mz-tripod', no:3,
  kicker:{ ko:'도형', en:'Shapes', zh:'图形' },
  title:{ ko:'다리가 셋이면 흔들리지 않는다', en:'Three Legs Never Wobble', zh:'三条腿从不晃' },
  lede:{ ko:'다리가 넷인 식탁은 덜거덕거리는데, 다리가 셋인 삼각대는 왜 한 번도 흔들리지 않을까요?',
         en:'A four-legged table rocks, yet a three-legged tripod never does. Why?',
         zh:'四条腿的餐桌会晃，三条腿的三脚架却从不晃。为什么？' },
  art: head(
    line(16,132,304,132,C.brown,3)
    +'<rect x="44" y="40" width="100" height="9" rx="3" fill="'+C.gold+'"/>'
    +line(56,49,64,132,C.brown,3)+line(132,49,124,132,C.brown,3)+line(98,49,96,132,C.brown,3)
    +T(94,28,15,C.ok,'3')
    +'<rect x="176" y="40" width="100" height="9" rx="3" fill="'+C.gold+'" transform="rotate(-4 226 44)"/>'
    +line(186,52,194,132,C.brown,3)+line(266,46,258,132,C.brown,3)
    +line(212,50,216,132,C.brown,3)+line(240,47,236,124,C.brown,3)
    +T(226,28,15,C.red,'4')
    +T(252,120,17,C.red,'!')),
  body:[
    { h:{ ko:'점 세 개는 언제나 한 평면 위에 있다', en:'Three points always share one plane', zh:'三个点总在同一个平面上' },
      p:{ ko:'점을 세 개 찍어 보세요. 아무리 삐뚤빼뚤 찍어도, 그 셋을 모두 지나는 평평한 면은 반드시 하나 있어요. 그래서 다리가 셋이면 바닥이 아무리 울퉁불퉁해도 세 발끝이 만드는 면 위에 그냥 서 있게 됩니다.',
         en:'Mark three points anywhere you like. However crooked they are, there is always exactly one flat surface through all three. So a three-legged stand simply settles onto the plane its three feet make, however bumpy the floor.',
         zh:'随便点三个点，无论多歪，一定有且只有一个平面同时穿过它们。所以三条腿的架子，不管地面多不平，都会稳稳落在三只脚决定的那个平面上。' },
      art: fig(
        '<path d="M 40 96 L 150 62 L 280 84 L 170 118 Z" fill="'+C.mist+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +dot(40,96,6,C.red)+dot(150,62,6,C.red)+dot(280,84,6,C.red)
        +T(160,30,15,C.blue,'3')) },
    { h:{ ko:'네 번째 다리가 문제를 만든다', en:'The fourth leg is the troublemaker', zh:'第四条腿才是麻烦' },
      p:{ ko:'다리가 넷이면 세 다리가 이미 면 하나를 정해 버려요. 네 번째 다리는 그 면 위에 있을 수도, 조금 떠 있을 수도 있죠. 조금이라도 뜨면 탁자는 그 다리를 축으로 덜거덕거립니다.',
         en:'With four legs, three of them already fix a plane. The fourth may sit on that plane — or hover just above it. A hair of a gap is enough to set the table rocking about that leg.',
         zh:'有四条腿时，其中三条已经定死了一个平面。第四条腿可能正好落在上面，也可能悬空一点点。哪怕只差一丝，桌子就会绕着那条腿摇晃。' },
      art: fig(
        '<path d="M 36 92 L 150 60 L 284 80 L 168 114 Z" fill="'+C.mist+'" stroke="'+C.blue+'" stroke-width="2.5"/>'
        +dot(36,92,6,C.ok)+dot(150,60,6,C.ok)+dot(284,80,6,C.ok)
        +dot(168,92,6,C.red)+line(168,92,168,114,C.red,2.5,'4 3')
        +T(206,110,13,C.red,'?')) },
    { h:{ ko:'흔들리면 돌려 보세요', en:'If it rocks, turn it', zh:'晃了就转一转' },
      p:{ ko:'식당에서 탁자가 덜거덕거리면 종이를 접어 괴는 대신 탁자를 조금 돌려 보세요. 돌리는 동안 네 다리가 닿는 높이가 조금씩 바뀌다가, 네 다리가 동시에 바닥에 닿는 자리를 지나가게 되거든요. 측량 기구와 사진기 받침대가 하나같이 삼각대인 것도 같은 이유랍니다.',
         en:'When a restaurant table wobbles, try turning it instead of folding paper under a leg. As it turns, the heights the four feet meet keep shifting, and it passes through a position where all four touch at once. It is the same reason surveying instruments and camera stands are tripods.',
         zh:'餐厅里桌子晃时，别急着折纸垫脚，试试把桌子转一转。转动时四只脚接触的高度不断变化，总会经过四脚同时着地的位置。测量仪器和相机支架一律用三脚架，也是同一个道理。' },
      art: fig(
        '<path d="M 96 40 A 56 56 0 1 1 90 44" fill="none" stroke="'+C.gold+'" stroke-width="3"/>'
        +'<polygon points="90,44 104,36 104,52" fill="'+C.gold+'"/>'
        +'<rect x="128" y="62" width="64" height="8" rx="3" fill="'+C.gold+'"/>'
        +line(136,70,132,108,C.brown,3)+line(184,70,188,108,C.brown,3)
        +line(160,70,160,108,C.brown,3)
        +line(100,108,220,108,C.brown,3)
        +T(160,36,15,C.ok,'360')) }
  ],
  close:{ ko:'다리 하나를 더 다는 것이 늘 더 튼튼한 건 아니에요. 셋은 흔들릴 수가 없습니다.',
          en:'One more leg is not always sturdier. Three simply cannot wobble.',
          zh:'多加一条腿未必更稳。三条腿根本晃不起来。' },
  source:{ ko:'세 점을 지나는 평면이 반드시 하나 있다는 것은 기하학의 기본 성질이에요. 흔들리는 탁자를 돌리면 멈추는 자리가 있다는 것도 수학으로 설명할 수 있답니다.',
           en:'That exactly one plane passes through three points is a basic fact of geometry. That a rocking table can always be turned to a resting position can be proved mathematically too.',
           zh:'过三点必有且只有一个平面，这是几何学的基本性质。晃动的桌子转一转总能找到不晃的位置，同样可以用数学证明。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] },

/* ── 4. 지어낸 숫자 ────────────────────────────────────── */
{ id:'mz-faked', no:4,
  kicker:{ ko:'확률', en:'Chance', zh:'概率' },
  title:{ ko:'지어낸 숫자는 티가 난다', en:'Made-Up Numbers Give Themselves Away', zh:'编出来的数字藏不住' },
  lede:{ ko:'"동전을 200번 던져 기록하거나, 던진 척하고 지어내서 내세요." 선생님은 어떻게 한눈에 가려냈을까요?',
         en:'"Toss a coin 200 times and record it — or just make the record up." How did the teacher spot the fakes at a glance?',
         zh:'"把硬币抛200次记下来，或者干脆编一份交上来。"老师怎么一眼就看出谁是编的？' },
  art: head(
    box(18,26,136,116,C.paper,C.ok)+T(86,48,13,C.ok,'O')
    +[0,1,2,3,4,5].map(i=>T(38+i*20,78,15,C.ink,i%2?'H':'T')).join('')
    +[0,1,2,3,4,5].map(i=>T(38+i*20,106,15,i<4?C.red:C.ink,i<4?'H':'T')).join('')
    +box(166,26,136,116,C.paper,C.red)+T(234,48,13,C.red,'X')
    +[0,1,2,3,4,5].map(i=>T(186+i*20,78,15,C.ink,i%2?'H':'T')).join('')
    +[0,1,2,3,4,5].map(i=>T(186+i*20,106,15,C.ink,i%2?'T':'H')).join('')),
  body:[
    { h:{ ko:'사람은 긴 줄을 무서워한다', en:'People are afraid of long runs', zh:'人害怕长串' },
      p:{ ko:'숫자를 지어내는 사람은 같은 면이 여러 번 이어지는 걸 못 견뎌요. 앞면이 네 번쯤 이어지면 "이건 너무 이상해 보여" 하고 슬쩍 뒷면을 끼워 넣습니다. 그래서 지어낸 기록은 앞뒤가 지나치게 사이좋게 번갈아 나와요.',
         en:'Anyone inventing a record cannot bear the same side repeating. After about four heads they think "this looks wrong" and quietly slip in a tail. So a faked record alternates far too politely.',
         zh:'编数据的人受不了同一面连着出现。连出四次正面，他就想"这也太怪了"，悄悄插进一个反面。于是编出来的记录，正反面交替得过分整齐。' },
      art: fig(
        [0,1,2,3,4,5,6,7].map(i=>T(40+i*34,50,17,C.ink,i%2?'H':'T')).join('')
        +line(24,50,296,50,C.red,3)
        +T(160,98,17,C.red,'X')) },
    { h:{ ko:'진짜 동전은 겁이 없다', en:'A real coin has no such fear', zh:'真硬币可不怕' },
      p:{ ko:'진짜로 200번을 던지면 같은 면이 6번 이상 이어지는 일이 거의 반드시 생겨요. 계산해 보면 100번 중 96번은 그런 줄이 나타납니다. 한 번도 안 나올 확률은 4%도 되지 않아요.',
         en:'Toss a real coin 200 times and a run of six or more of the same side is nearly certain: work it out and it happens in 96 of every 100 attempts. The chance of no such run at all is under four percent.',
         zh:'真的抛200次，同一面连出六次以上几乎一定会发生：算下来一百次里有九十六次会出现这样的长串。一次都不出现的概率还不到百分之四。' },
      art: fig(
        box(24,26,272,46,C.paper,C.ok)
        +[0,1,2,3,4,5].map(i=>T(104+i*22,58,17,C.red,'H')).join('')
        +T(60,58,15,C.ink,'T')+T(268,58,15,C.ink,'T')
        +T(160,104,19,C.ok,'96 / 100')) },
    { h:{ ko:'첫 자리 숫자에도 버릇이 있다', en:'First digits have habits too', zh:'首位数字也有脾气' },
      p:{ ko:'회계 장부처럼 큰 자료에서는 맨 앞자리 숫자가 어떤 숫자인지에도 뚜렷한 버릇이 있어요. 지어낸 숫자는 그 버릇을 못 흉내 내기 때문에, 세무 감사에서 이 성질로 손댄 장부를 골라내기도 한답니다.',
         en:'In large records such as accounting ledgers, even the leading digit follows a clear pattern. Invented figures cannot imitate it, and auditors use exactly this to flag books that have been tampered with.',
         zh:'在账簿这类大量数据里，就连最前面那位数字也有明显的规律。编造的数字模仿不来，税务稽查正是靠这一点挑出被动过手脚的账本。' },
      art: fig(
        line(28,104,296,104,C.grey,2)
        +[38,30,22,17,14,12,10,8,7].map((h,i)=>
          '<rect x="'+(36+i*29)+'" y="'+(104-h*2)+'" width="20" height="'+(h*2)+'" rx="3" fill="'+(i?C.blue:C.red)+'"/>').join('')
        +[1,2,3,4,5,6,7,8,9].map((n,i)=>T(46+i*29,122,12,C.sub,String(n))).join('')) }
  ],
  close:{ ko:'우연은 우리 생각보다 훨씬 고집이 세요. 그 고집을 아는 사람만 진짜와 가짜를 가려낼 수 있답니다.',
          en:'Chance is far more stubborn than we imagine — and only those who know its stubbornness can tell the real from the invented.',
          zh:'偶然比我们想的固执得多。只有懂得这份固执的人，才分得出真假。' },
  source:{ ko:'200번 가운데 6연속이 나올 확률 96%는 앞면·뒷면이 똑같이 나오는 공정한 동전으로 직접 계산한 값이에요.',
           en:'The 96% figure for a run of six in 200 tosses was computed directly, assuming a fair coin with equal chances of heads and tails.',
           zh:'200次中出现六连的96%，是按正反面机会均等的公平硬币直接算出来的。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] }
,
/* ── 5. 생일 ───────────────────────────────────────────── */
{ id:'mz-birthday', no:5,
  kicker:{ ko:'확률', en:'Chance', zh:'概率' },
  title:{ ko:'축구장에 생일이 같은 사람이 있다', en:'Two People on a Football Pitch Share a Birthday', zh:'球场上有人生日相同' },
  lede:{ ko:'선수 22명에 심판 3명, 모두 25명. 이 중에 생일이 같은 사람이 있을 확률은 얼마일까요?',
         en:'Twenty-two players and three officials — twenty-five people. What are the chances two of them share a birthday?',
         zh:'22名球员加3名裁判，一共25人。其中有两人生日相同的概率是多少？' },
  art: head(
    (function(){
      let g = '';
      for(let i = 0; i < 25; i++){
        const x = 34 + (i % 9) * 32, y = 40 + Math.floor(i / 9) * 30;
        const hit = (i === 4 || i === 17);
        g += dot(x, y, hit ? 8 : 6, hit ? C.red : C.grey);
      }
      return g;
    })()
    + line(162, 40, 98, 100, C.red, 2.5, '5 4')
    + T(160, 148, 26, C.red, '56.9%')),
  body:[
    { h:{ ko:'거꾸로 세는 것이 쉽다', en:'Counting backwards is easier', zh:'反着数更容易' },
      p:{ ko:'"같은 사람이 있을 확률"은 세기 어려워요. 대신 "모두 다를 확률"을 셉니다. 첫 사람은 365일 아무 날이나 되고, 두 번째는 그 날을 뺀 364일, 세 번째는 363일… 이렇게 곱해 나간 뒤 1에서 빼면 됩니다.',
         en:'The chance that two people match is hard to count. Count the chance that everyone differs instead: the first can have any of 365 days, the second 364, the third 363 — multiply them, then subtract from one.',
         zh:'"有两人相同"的概率不好数。那就数"所有人都不同"的概率：第一个人365天随便哪天，第二个人剩364天，第三个人363天——连乘之后，再用1减掉。' },
      art: fig(
        T(160, 44, 17, C.ink, '365/365')
        + T(160, 44, 17, C.ink, '')
        + T(62, 78, 15, C.blue, '364') + T(62, 96, 15, C.blue, '365')
        + line(46, 84, 78, 84, C.blue, 2)
        + T(104, 87, 15, C.sub, '×')
        + T(146, 78, 15, C.blue, '363') + T(146, 96, 15, C.blue, '365')
        + line(130, 84, 162, 84, C.blue, 2)
        + T(188, 87, 15, C.sub, '×')
        + T(214, 87, 15, C.grey, '⋯')
        + T(268, 87, 17, C.red, '1 -')) },
    { h:{ ko:'스물세 명이 넘으면 반반보다 높다', en:'Past twenty-three it is better than even', zh:'超过二十三人就过半了' },
      p:{ ko:'놀랍게도 23명만 모여도 같은 생일이 있을 확률이 50.7%로 절반을 넘어요. 축구장 25명은 56.9%, 한 반 30명이면 70.6%입니다. 우리 반을 한번 세어 보세요.',
         en:'Astonishingly, just twenty-three people give a 50.7% chance — better than even. The twenty-five on a pitch reach 56.9%, and a class of thirty is at 70.6%. Try counting your own classroom.',
         zh:'令人吃惊的是，只要23个人，概率就有50.7%，已经过半。球场上的25人是56.9%，一个班30人则是70.6%。数数自己班上试试看。' },
      art: fig(
        line(30, 106, 300, 106, C.grey, 2)
        + [[23, 50.7, C.blue], [25, 56.9, C.red], [30, 70.6, C.ok]].map(function(r, i){
            const x = 70 + i * 90, h = r[1] * 0.9;
            return '<rect x="' + (x - 22) + '" y="' + (106 - h) + '" width="44" height="' + h
              + '" rx="4" fill="' + r[2] + '"/>'
              + T(x, 100 - h, 14, r[2], r[1] + '%') + T(x, 124, 13, C.sub, r[0]);
          }).join('')
        + line(30, 61, 300, 61, C.red, 2, '6 5')
        + T(300, 55, 12, C.red, '50')) },
    { h:{ ko:'왜 그렇게 높을까', en:'Why so high?', zh:'为什么这么高？' },
      p:{ ko:'"나와 같은 생일"을 찾는 게 아니라 "아무 두 사람"을 찾기 때문이에요. 25명이면 짝을 지을 수 있는 방법이 300가지나 됩니다. 사람이 25명이어도 비교는 300번 일어나는 거예요.',
         en:'Because you are not looking for someone who matches *you* — you are looking for any two people at all. Among twenty-five there are three hundred possible pairs. Twenty-five people, but three hundred comparisons.',
         zh:'因为要找的不是"和我同一天"，而是"任意两个人"。25个人可以配成300对。人只有25个，比较却发生了300次。' },
      art: fig(
        (function(){
          let g = '';
          const cx = 160, cy = 62, R = 44;
          const pts = [];
          for(let i = 0; i < 9; i++){
            const a = i * 2 * Math.PI / 9 - Math.PI / 2;
            pts.push([cx + Math.cos(a) * R, cy + Math.sin(a) * R]);
          }
          for(let i = 0; i < 9; i++) for(let j = i + 1; j < 9; j++)
            g += line(pts[i][0], pts[i][1], pts[j][0], pts[j][1], C.mist, 1);
          pts.forEach(q => { g += dot(q[0], q[1], 5, C.blue); });
          return g;
        })()
        + T(160, 124, 15, C.red, '25 → 300')) }
  ],
  close:{ ko:'우연은 우리가 생각하는 것보다 훨씬 자주 일어나요. 세는 방법을 알면 그 놀라움이 계산이 됩니다.',
          en:'Coincidence happens far more often than we expect. Learn how to count it and the surprise becomes arithmetic.',
          zh:'巧合发生的频率远超我们的想象。学会怎么数，惊讶就变成了算术。' },
  source:{ ko:'23명 50.7%, 25명 56.9%, 30명 70.6%는 1년을 365일로 보고 직접 계산한 값이에요.',
           en:'The figures 50.7%, 56.9% and 70.6% were computed directly, taking a year as 365 days.',
           zh:'50.7%、56.9%、70.6%都是按一年365天直接计算出来的。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] },

/* ── 6. 뫼비우스의 띠 ──────────────────────────────────── */
{ id:'mz-mobius', no:6,
  kicker:{ ko:'도형', en:'Shapes', zh:'图形' },
  title:{ ko:'안과 밖이 없는 종이', en:'The Paper With No Inside or Outside', zh:'没有正反面的纸' },
  lede:{ ko:'종이띠를 한 번만 꼬아서 붙이면, 앞면과 뒷면이 사라집니다. 정말로요.',
         en:'Give a paper strip a single twist before joining the ends, and the front and back vanish. Really.',
         zh:'把纸条扭一下再粘起来，正面和反面就消失了。真的。' },
  art: head(mobiusArt(160, 86, 62, 20, 44)),
  body:[
    { h:{ ko:'만드는 법은 아주 쉽다', en:'Making one is easy', zh:'做起来非常简单' },
      p:{ ko:'긴 종이띠를 하나 자르세요. 한쪽 끝을 반 바퀴만 비틀고, 그대로 양 끝을 붙입니다. 비틀지 않고 붙이면 그냥 고리지만, 한 번 비틀면 전혀 다른 것이 됩니다.',
         en:'Cut a long strip of paper. Give one end a half turn, then join the two ends. Join it without the twist and you get an ordinary ring; add the twist and you get something else entirely.',
         zh:'剪一条长纸带。把一端扭转半圈，再把两端粘起来。不扭就是普通的圆环，扭了一下就完全不同了。' },
      art: fig(
        '<rect x="20" y="52" width="72" height="18" rx="3" fill="' + C.goldbright + '" stroke="' + C.brown + '" stroke-width="2"/>'
        + arrow(100, 61, 122, 61, C.gold, 3)
        + '<path d="M 132 52 L 186 52 L 186 70 L 132 70 Z" fill="' + C.goldbright + '" stroke="' + C.brown + '" stroke-width="2"/>'
        + '<path d="M 186 52 L 204 70 L 204 52 L 186 70 Z" fill="' + C.paper + '" stroke="' + C.brown + '" stroke-width="2"/>'
        + arrow(214, 61, 236, 61, C.gold, 3)
        + mobiusArt(276, 61, 28, 9, 30)
        + T(56, 96, 13, C.sub, '1') + T(168, 96, 13, C.sub, '2') + T(276, 104, 13, C.sub, '3')) },
    { h:{ ko:'가운데를 따라 선을 그어 보세요', en:'Draw a line down the middle', zh:'沿着中间画一条线' },
      p:{ ko:'띠 가운데에 연필을 대고 쭉 따라가 보세요. 종이를 뒤집지 않았는데도 어느새 처음 그리던 자리의 <b>반대쪽</b>을 지나고, 계속 가면 출발점으로 돌아옵니다. 면이 하나라는 뜻이에요.',
         en:'Put a pencil on the middle of the band and follow it without lifting. You never flip the paper, yet you pass along what was the <b>other side</b>, and keep going until you arrive back where you began. That means there is only one surface.',
         zh:'把铅笔放在带子中间一路画下去。纸没有翻面，笔却经过了原来的<b>另一侧</b>，一直走还会回到起点。这说明它只有一个面。' },
      art: fig(
        mobiusArt(160, 58, 46, 15, 40)
        + dot(206, 58, 5, C.red)
        + T(160, 118, 14, C.red, '1')) },
    { h:{ ko:'방앗간 벨트가 오래 가는 이유', en:'Why a mill belt lasts longer', zh:'磨坊皮带更耐用的道理' },
      p:{ ko:'기계 축을 돌리는 벨트를 한 번 꼬아서 걸면, 면이 하나뿐이라 벨트 전체가 골고루 닿습니다. 한쪽만 닳지 않으니 그만큼 오래 쓰죠. 놀이공원의 어떤 롤러코스터 레일도 같은 원리로 만들어졌어요.',
         en:'Put a single twist in a belt that drives a machine and, because there is only one surface, the whole belt wears evenly. No single face takes all the punishment, so it lasts far longer. Some roller-coaster tracks are built on the same idea.',
         zh:'给驱动机器的皮带加上一个扭转，因为只有一个面，整条皮带就会均匀受力。不会只磨一侧，寿命自然长得多。游乐园里有些过山车轨道也用了同样的道理。' },
      art: fig(
        '<circle cx="80" cy="64" r="26" fill="none" stroke="' + C.sub + '" stroke-width="4"/>'
        + '<circle cx="240" cy="64" r="26" fill="none" stroke="' + C.sub + '" stroke-width="4"/>'
        + dot(80, 64, 5, C.sub) + dot(240, 64, 5, C.sub)
        + '<path d="M 80 38 L 152 38 L 168 90 L 240 90" fill="none" stroke="' + C.gold + '" stroke-width="4"/>'
        + '<path d="M 80 90 L 152 90 L 168 38 L 240 38" fill="none" stroke="' + C.brown + '" stroke-width="4"/>'
        + T(160, 120, 13, C.sub, '1')) }
  ],
  close:{ ko:'당연해 보이는 것을 한 번 비틀어 보는 것 — 수학은 거기서 자랍니다.',
          en:'Taking the obvious and giving it one twist — that is where mathematics grows.',
          zh:'把理所当然的东西扭一下看看——数学就是从这里长出来的。' },
  source:{ ko:'독일의 수학자이자 천문학자 뫼비우스(1790~1868)가 생각해 냈어요. 처음에는 사람들이 그런 종이가 정말 있겠냐며 의아해했다고 합니다.',
           en:'It was conceived by Möbius (1790-1868), a German mathematician and astronomer. People at the time doubted such a paper could exist at all.',
           zh:'这是德国数学家兼天文学家莫比乌斯（1790-1868）想出来的。当时人们还怀疑真有这样的纸吗。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] },

/* ── 7. 당구대 ─────────────────────────────────────────── */
{ id:'mz-billiard', no:7,
  kicker:{ ko:'도형', en:'Shapes', zh:'图形' },
  title:{ ko:'벽을 맞히고 싶으면 벽 너머를 겨눠라', en:'To Hit Off the Cushion, Aim Through It', zh:'想打库边，就瞄准库边的那一侧' },
  lede:{ ko:'흰 공으로 벽을 한 번 맞힌 뒤 빨간 공을 맞히려면, 벽의 어디를 겨눠야 할까요?',
         en:'You want the white ball to bounce off the cushion and then hit the red one. Where on the cushion do you aim?',
         zh:'想让白球先撞库边再击中红球，该瞄准库边的哪一点？' },
  art: head(
    '<rect x="24" y="24" width="272" height="122" rx="8" fill="' + C.felt + '" stroke="' + C.brown + '" stroke-width="5"/>'
    + dot(84, 62, 9, '#fff') + '<circle cx="84" cy="62" r="9" fill="none" stroke="' + C.ink + '" stroke-width="2"/>'
    + dot(232, 74, 9, C.red)
    + line(84, 62, 168, 142, C.blue, 2.5) + line(168, 142, 232, 74, C.blue, 2.5)
    + dot(168, 142, 5, C.gold)
    + T(168, 130, 15, C.gold, 'P')),
  body:[
    { h:{ ko:'공은 거울처럼 튕긴다', en:'A ball bounces like a mirror', zh:'球像镜子一样反弹' },
      p:{ ko:'공의 한가운데를 쳐서 벽에 부딪히면, <b>들어가는 각과 나오는 각이 똑같습니다.</b> 빛이 거울에 반사될 때와 정확히 같아요. 이 성질 하나만 알면 나머지는 작도로 풀립니다.',
         en:'Strike a ball through its centre and, when it meets the cushion, <b>the angle going in equals the angle coming out</b> — exactly as light reflects in a mirror. Know that one fact and the rest is a drawing problem.',
         zh:'击打球心，球碰到库边时，<b>入射角和反射角相等</b>——和光线在镜子上反射完全一样。只要知道这一点，剩下的用作图就能解决。' },
      art: fig(
        line(24, 96, 296, 96, C.brown, 4)
        + line(96, 30, 160, 96, C.blue, 2.5) + line(160, 96, 224, 30, C.blue, 2.5)
        + line(160, 96, 160, 44, C.grey, 1.6, '4 3')
        + '<path d="M 160 74 A 22 22 0 0 0 145 82" fill="none" stroke="' + C.red + '" stroke-width="2"/>'
        + '<path d="M 175 82 A 22 22 0 0 0 160 74" fill="none" stroke="' + C.red + '" stroke-width="2"/>'
        + T(132, 66, 14, C.red, '=') + T(190, 66, 14, C.red, '=')) },
    { h:{ ko:'벽 너머에 가짜 공을 놓는다', en:'Put a phantom ball beyond the cushion', zh:'在库边的另一侧放一个假球' },
      p:{ ko:'흰 공을 벽에 대고 접었을 때 겹치는 자리에 점을 하나 찍습니다. 벽을 거울이라고 보면 거기 비치는 <b>거울 속 공</b>이에요. 벽에서 같은 거리, 반대쪽입니다.',
         en:'Fold the white ball across the cushion and mark where it lands. Treat the cushion as a mirror and that dot is the <b>ball in the mirror</b> — the same distance from the cushion, on the other side.',
         zh:'把白球以库边为轴翻折过去，在落点画一个点。把库边看成镜子，那就是<b>镜中的球</b>——离库边同样远，在另一侧。' },
      art: fig(
        line(24, 70, 296, 70, C.brown, 4)
        + dot(96, 38, 9, '#fff') + '<circle cx="96" cy="38" r="9" fill="none" stroke="' + C.ink + '" stroke-width="2"/>'
        + line(96, 38, 96, 102, C.grey, 1.6, '4 3')
        + '<circle cx="96" cy="102" r="9" fill="none" stroke="' + C.red + '" stroke-width="2" stroke-dasharray="4 3"/>'
        + T(126, 44, 14, C.sub, 'A') + T(126, 108, 14, C.red, "A'")
        + T(210, 44, 13, C.sub, 'd') + T(210, 108, 13, C.sub, 'd')
        + line(198, 38, 198, 70, C.sub, 1.6) + line(198, 70, 198, 102, C.sub, 1.6)) },
    { h:{ ko:'가짜 공과 목표를 직선으로 잇는다', en:'Join the phantom to the target', zh:'把假球和目标连成直线' },
      p:{ ko:'거울 속 공과 빨간 공을 자로 곧게 잇습니다. 그 직선이 벽과 만나는 자리가 바로 <b>겨눌 점</b>이에요. 거기를 맞히면 튕긴 공이 빨간 공으로 정확히 갑니다.',
         en:'Draw a straight line from the mirrored ball to the red ball. Where that line crosses the cushion is <b>the point to aim at</b>. Hit it and the rebound runs straight to the red ball.',
         zh:'用尺把镜中的球和红球连成一条直线。这条线与库边的交点，就是<b>要瞄准的点</b>。打中那里，反弹的球正好撞上红球。' },
      art: fig(
        line(24, 70, 296, 70, C.brown, 4)
        + dot(78, 38, 9, '#fff') + '<circle cx="78" cy="38" r="9" fill="none" stroke="' + C.ink + '" stroke-width="2"/>'
        + '<circle cx="78" cy="102" r="9" fill="none" stroke="' + C.red + '" stroke-width="2" stroke-dasharray="4 3"/>'
        + dot(248, 38, 9, C.red)
        + line(78, 102, 248, 38, C.grey, 1.8, '5 4')
        + line(78, 38, 163, 70, C.blue, 2.5) + line(163, 70, 248, 38, C.blue, 2.5)
        + dot(163, 70, 5, C.gold) + T(163, 92, 15, C.gold, 'P')) }
  ],
  close:{ ko:'어려운 길을 한 번 접으면 곧은 길이 됩니다. 수학이 자주 쓰는 꾀예요.',
          en:'Fold the awkward path once and it becomes a straight one. Mathematics uses that trick again and again.',
          zh:'把绕远的路折一次，就变成了直路。这是数学常用的巧劲。' },
  source:{ ko:'벽을 두 번 맞히는 문제도 같은 방법을 두 번 쓰면 풀려요. 타원 당구대에서는 한쪽 초점에서 아무 방향으로나 쳐도 다른 초점으로 모입니다.',
           en:'A two-cushion shot is solved by using the same trick twice. On an elliptical table, a ball struck from one focus in any direction gathers at the other focus.',
           zh:'两次撞库的问题，把同样的办法用两次就能解决。在椭圆形球台上，从一个焦点朝任意方向击球，都会汇到另一个焦点。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] },

/* ── 8. 수막새 ─────────────────────────────────────────── */
{ id:'mz-tile', no:8,
  kicker:{ ko:'도형', en:'Shapes', zh:'图形' },
  title:{ ko:'깨진 기와에서 원을 되찾는 법', en:'Finding the Circle in a Broken Roof Tile', zh:'从破瓦片里找回圆' },
  lede:{ ko:'신라의 얼굴무늬수막새는 발굴될 때 온전한 모습이 아니었어요. 조각만 있는데 원래 크기를 어떻게 알까요?',
         en:'The smiling roof-end tile from Silla was not whole when it was dug up. With only a fragment, how do you recover its original size?',
         zh:'新罗的人面纹瓦当出土时并不完整。只剩碎片，怎么知道它原来的大小？' },
  art: head(
    /* 깨진 조각 — 얇은 활꼴로 그렸더니 조각이 아니라 실선처럼 보였다(눈으로 확인).
       바깥 호와 안쪽 호로 둘러싼 **두께 있는 고리 조각**으로 다시 그린다. */
    (function(){
      const cx = 160, cy = 86, R = 62, r = 34;
      const A = [-118, 52];                       /* 남아 있는 각 범위(도) */
      const P = (deg, rad) => [cx + Math.cos(deg * Math.PI / 180) * rad,
                               cy + Math.sin(deg * Math.PI / 180) * rad];
      const o0 = P(A[0], R), o1 = P(A[1], R), i1 = P(A[1], r), i0 = P(A[0], r);
      const d = 'M ' + o0[0].toFixed(1) + ' ' + o0[1].toFixed(1)
        + ' A ' + R + ' ' + R + ' 0 0 1 ' + o1[0].toFixed(1) + ' ' + o1[1].toFixed(1)
        + ' L ' + i1[0].toFixed(1) + ' ' + i1[1].toFixed(1)
        + ' A ' + r + ' ' + r + ' 0 0 0 ' + i0[0].toFixed(1) + ' ' + i0[1].toFixed(1) + ' Z';
      return '<circle cx="' + cx + '" cy="' + cy + '" r="' + R + '" fill="none" stroke="'
        + C.grey + '" stroke-width="2.5" stroke-dasharray="7 6"/>'
        + '<path d="' + d + '" fill="' + C.goldbright + '" stroke="' + C.brown + '" stroke-width="3"/>'
        + [A[0], -33, A[1]].map(function(a){ const q = P(a, R); return dot(q[0], q[1], 6, C.red); }).join('')
        + dot(cx, cy, 5, C.blue) + T(cx, cy + 26, 15, C.blue, '3');
    })()),
  body:[
    { h:{ ko:'테두리에 점 세 개를 찍는다', en:'Mark three points on the rim', zh:'在边缘上点三个点' },
      p:{ ko:'남아 있는 조각의 둥근 테두리 위에 아무 데나 점 세 개를 찍습니다. 딱 세 개면 충분해요 — 세 점을 지나는 원은 <b>세상에 하나뿐</b>이기 때문입니다.',
         en:'Mark any three points along the curved rim of the surviving fragment. Three is enough, because <b>only one circle in the world</b> passes through three given points.',
         zh:'在残片的弧形边缘上随便点三个点。三个就够了——因为经过三个点的圆<b>全世界只有一个</b>。' },
      art: fig(
        '<path d="M 96 108 A 66 66 0 0 1 224 108" fill="none" stroke="' + C.brown + '" stroke-width="4"/>'
        + dot(100, 92, 6, C.red) + dot(160, 42, 6, C.red) + dot(220, 92, 6, C.red)
        + T(160, 126, 15, C.red, '3')) },
    { h:{ ko:'두 현의 수직이등분선을 긋는다', en:'Bisect two chords at right angles', zh:'作两条弦的垂直平分线' },
      p:{ ko:'점 세 개를 이어 삼각형을 만들고, 두 변의 한가운데에서 <b>직각으로</b> 선을 올립니다. 두 선이 만나는 한 점 — 그곳이 원의 중심이에요. 삼각형의 <b>외심</b>이라고 부릅니다.',
         en:'Join the three points into a triangle, then raise a line <b>at right angles</b> from the midpoint of two sides. Where those lines cross is the centre of the circle — the triangle’s <b>circumcentre</b>.',
         zh:'把三个点连成三角形，再从两条边的中点<b>作垂线</b>。两条垂线的交点就是圆心——叫作三角形的<b>外心</b>。' },
      art: fig(
        '<polygon points="100,92 160,42 220,92" fill="none" stroke="' + C.blue + '" stroke-width="2"/>'
        + dot(100, 92, 5, C.red) + dot(160, 42, 5, C.red) + dot(220, 92, 5, C.red)
        + line(130, 67, 168, 98, C.ok, 2, '5 4')
        + line(190, 67, 152, 98, C.ok, 2, '5 4')
        + dot(130, 67, 4, C.ok) + dot(190, 67, 4, C.ok)
        + dot(160, 88, 6, C.gold)
        + T(160, 124, 14, C.gold, '1')) },
    { h:{ ko:'그 중심에서 원을 그린다', en:'Draw the circle from that centre', zh:'以那个圆心画圆' },
      p:{ ko:'찾은 중심에 컴퍼스 바늘을 꽂고 점 하나까지 벌려 한 바퀴 돌리면, 사라진 부분까지 포함한 <b>원래 기와의 크기</b>가 그대로 나옵니다. 조각 하나로 천 년 전의 지름을 아는 거예요.',
         en:'Put the compass point on that centre, open it to one of the marks, and sweep a full turn: out comes <b>the tile’s original size</b>, missing parts included. One fragment gives you a diameter from a thousand years ago.',
         zh:'把圆规针尖扎在圆心，张开到其中一个点，转一整圈——<b>瓦片原本的大小</b>就出来了，连缺失的部分也在内。一块碎片，就能知道一千年前的直径。' },
      art: fig(
        '<circle cx="160" cy="66" r="52" fill="none" stroke="' + C.grey + '" stroke-width="2" stroke-dasharray="6 5"/>'
        + '<path d="M 108 66 A 52 52 0 0 1 212 66" fill="none" stroke="' + C.brown + '" stroke-width="4"/>'
        + dot(160, 66, 6, C.gold)
        + line(160, 66, 212, 66, C.gold, 2.5)
        + T(186, 58, 13, C.gold, 'r')
        + dot(108, 66, 5, C.red) + dot(160, 14, 5, C.red) + dot(212, 66, 5, C.red)) }
  ],
  close:{ ko:'사라진 부분을 지어내지 않고, 남은 부분이 말해 주는 것만으로 되찾는 것 — 그게 수학의 복원입니다.',
          en:'Recovering what is gone without inventing it, using only what the surviving part can tell you — that is restoration by mathematics.',
          zh:'不去臆造缺失的部分，只凭残存部分给出的信息把它找回来——这就是数学的修复。' },
  source:{ ko:'7세기경 신라 유물로 알려진 얼굴무늬수막새는 경주 영묘사 터에서 발굴됐어요. 삼각형의 외심은 실제로 유물을 복원할 때 쓰입니다.',
           en:'The face-patterned roof tile, known as a Silla relic from around the seventh century, was excavated at the Yeongmyosa temple site in Gyeongju. The circumcentre really is used to restore artefacts.',
           zh:'这件被认为是七世纪新罗遗物的人面纹瓦当，出土于庆州灵庙寺遗址。三角形的外心确实用于文物修复。' },
  fit:{ units:[], threads:[] }, age:['mid','senior'] }


]};
})();
