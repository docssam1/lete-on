/* Course series design only. It never changes problems, seeds or schedules. */
(function(root){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L=(v,lang)=>typeof v==='string'?v:v?.[lang]||v?.ko||'';
function model(cv,lang='ko'){
 const C=root.NM_COURSES||{},keys=(cv.assignedCourseKeys||[]).filter(k=>C[k]);
 if(!keys.length&&Number.isInteger(+cv.courseNum)&&C['C'+cv.courseNum])keys.push('C'+cv.courseNum);
 const courses=keys.map(k=>C[k]),academic=courses.some(c=>/^(middle|highmath|algebra|calculus)/.test(c.tier))||!!cv.compactHigh||!!cv.middleExtension;
 const stages=[...new Set(keys.map(k=>(root.NM_STAGES||[]).find(s=>+k.slice(1)>=s.courses.from&&+k.slice(1)<=s.courses.to)).filter(Boolean).map(s=>L(s.name,lang)))];
 const title=cv.middleExtension?String(cv.courseTitle||'').replace(/ · (이번 주 학습|This week’s learning|本周学习)$/,'')
   :courses.length?courses.map(c=>L(c.title,lang)).join(' / '):cv.courseTitle||'Numbers of Magic';
 const number=keys.map(k=>k.slice(1)).join('·'),tier=courses[0]?.tier||'level1';
 const nth=Number(courses[0]?.order)||0,levelIndex={level0:0,level1:0,level2:1,level3:2,challenge:2,middle1:0,middle2:1,middle3:2,highmath1:0,highmath2:1,algebra:2,calculus1:1}[tier]||0,themeIndex=(nth+levelIndex)%3;
 const heroes=tier==='level0'?['numi-0-happy','poco-3-think','momo-8-happy']:['kid-boy','kid-girl','numi-wizard'];
 const hero=heroes[themeIndex],topicText=title+' '+courses.map(c=>c.title.ko).join(' ');
 /* 그림은 과정 번호로 정한다(COURSE_ART). 선택 심화만 있는 주는 학년(M1E~M3E)으로 */
 const extGrade=+((cv.extensionGrades||[])[0]||cv.extensionGrade||0),motif=keys[0]&&COURSE_ART[keys[0]]?keys[0]:cv.middleExtension&&extGrade?'M'+extGrade+'E':cv.middleExtension?'M3E':'C0';
 const buddy=/곱셈|구구/.test(topicText)?'sym-times':/나눗셈/.test(topicText)?'sym-divide':/뺄셈/.test(topicText)?'sym-minus':'sym-plus';
 return {academic,keys,level:stages.join(' → ')||(cv.middleExtension?L(((root.NM_STAGES||[]).find(s=>s.courses.from<=29&&29<=s.courses.to)||{}).name,lang):'')||(academic?'MATHEMATICS':'NUMBERS'),title,number,hero,buddy,motif,ground:['#16382a','#4a1f2a','#2a241c'][themeIndex],accent:['#2f6b4a','#a66c20','#8b4d3b'][themeIndex],lang};
}
/* 과정별 표지 그림(2026-11-03 표지 검수). 과정 번호마다 그 과정에서 실제로 배우는 내용을 그린다.
   예전에는 과정 이름 글자로 8가지 그림 중 하나를 골라 「약수와 배수」에 1~5 세기, 중1 「문자식·방정식」과
   「직선·원의 방정식」에 곱셈공식 (a+b)², 「복소수·집합·로그」에 x² ≥ 0이 들어갔다.
   모양 규칙: viewBox 400×260 · 유아·초등(a)은 초록 선 + 초록·금·산호 채움 · 중·고등(b)은 금색 선 + 옅은 금 칠.
   분수는 분수선(frac)으로, 거듭제곱·첨자는 위·아래 글자(sup/sub)로 쓴다. 글자는 숫자·기호·라틴 문자만 — 한·영·중 표지에 같이 쓴다. */
const COURSE_ART={C0:'count',C1:'tens',C2:'borrow',C3:'place3',C4:'array',C5:'colAdd',C6:'place4',C7:'skip',C8:'areaMul',C9:'groups',C10:'remainder',C11:'longDiv',C12:'area2',C13:'longDiv2',C14:'fracSame',C15:'factFamily',C16:'decimal',C17:'factors',C18:'equivFrac',C19:'order',C20:'fracMul',C21:'squares',C22:'fracDiv',C23:'fracDec',C24:'ratio',C25:'forms',C26:'area3',C27:'primes',C28:'oddSquares',
 C29:'factorTree',C30:'signs',C31:'balance',C32:'repeating',C33:'system',C34:'linear',C35:'sqrt',C36:'factorArea',C37:'parabola',
 C38:'square',C39:'synthetic',C40:'complex',C41:'roots',C42:'parabolaLine',C43:'cubic',C44:'twoParab',C45:'interval',C46:'tree',C47:'pascal',C48:'matrix',
 C49:'points',C50:'perpLines',C51:'circle',C52:'reflect',C53:'venn',C54:'nonneg',C55:'mapping',C56:'hyperbola',C57:'sqrtCurve',
 C58:'expLaw',C59:'log',C60:'expLog',C61:'expLine',C62:'unitCircle',C63:'sine',C64:'sineLine',C65:'triangle',C66:'arith',C67:'geom',C68:'sigma',C69:'domino',
 C70:'limit',C71:'tangent',C72:'extrema',C73:'integral',M1E:'balance',M2E:'system',M3E:'square'};
function art(kind,key){
  const kids=kind==='a',ink=kids?'#2f6b4a':'#d9a62e',F='NM Series Sans,Pretendard,sans-serif';
  const fills=kids?['url(#aGreen)','url(#aGold)','url(#aCoral)']:[ink,ink,ink],op=kids?'':' fill-opacity=".22"';
  const fill=i=>`fill="${fills[i%3]}"${op}`;
  const T=(x,y,s,size=24,anchor='middle',extra='')=>`<text x="${x}" y="${y}" fill="${ink}" font-family="${F}" font-size="${size}" text-anchor="${anchor}"${extra}>${s}</text>`;
  const L=(x1,y1,x2,y2,w=1.6,dash='')=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${ink}" stroke-width="${w}" fill="none"${dash?` stroke-dasharray="${dash}"`:''}/>`;
  const P=(d,w=2,extra='')=>`<path d="${d}" stroke="${ink}" stroke-width="${w}" fill="none"${extra}/>`;
  const R=(x,y,w,h,i=-1,sw=1.4)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" stroke="${ink}" stroke-width="${sw}" ${i<0?'fill="none"':fill(i)}/>`;
  const C=(x,y,r,i=-1,sw=1.4)=>`<circle cx="${x}" cy="${y}" r="${r}" stroke="${ink}" stroke-width="${sw}" ${i<0?'fill="none"':fill(i)}/>`;
  const dot=(x,y,r=4.5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${ink}"/>`;
  const hole=(x,y,r=5)=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${kids?'#fdfbf5':'none'}" stroke="${ink}" stroke-width="1.8"/>`;
  /* 분수: 가운데 x, 분수선 y */
  const frac=(x,y,n,d,s=20)=>T(x,y-s*0.3,n,s)+L(x-s*0.55*Math.max(String(n).length,String(d).length)-2,y,x+s*0.55*Math.max(String(n).length,String(d).length)+2,y,1.4)+T(x,y+s*0.95,d,s);
  const sup=(b,e,s=24)=>`${b}<tspan font-size="${Math.round(s*0.62)}" dy="${-Math.round(s*0.42)}">${e}</tspan><tspan dy="${Math.round(s*0.42)}"> </tspan>`;
  const sub=(b,e,s=24)=>`${b}<tspan font-size="${Math.round(s*0.62)}" dy="${Math.round(s*0.25)}">${e}</tspan><tspan dy="${-Math.round(s*0.25)}"> </tspan>`;
  /* 좌표축: 원점(ox,oy), 화살표 끝 */
  const axes=(ox,oy,x0,x1,y0,y1)=>P(`M${x0} ${oy}H${x1}M${x1-7} ${oy-4}L${x1} ${oy}L${x1-7} ${oy+4}M${ox} ${y0}V${y1}M${ox-4} ${y1+7}L${ox} ${y1}L${ox+4} ${y1+7}`,1.3);
  const plot=(f,a,b,ox,oy,ux,uy,n=80)=>{let d='';for(let i=0;i<=n;i++){const x=a+(b-a)*i/n,y=f(x);d+=(i?'L':'M')+(ox+x*ux).toFixed(1)+' '+(oy-y*uy).toFixed(1);}return d;};
  const tenFrame=(x,y,n,cross=0,i=1)=>{let s='';for(let c=0;c<10;c++){const cx=x+(c%5)*30,cy=y+Math.floor(c/5)*30;s+=R(cx,cy,30,30);if(c<n){s+=C(cx+15,cy+15,10,i);if(c>=n-cross)s+=L(cx+5,cy+25,cx+25,cy+5,2.2);}}return s;};
  const longDiv=(x,divisor,dividend,quot)=>{const w=26*dividend.length;let s=T(x-14,118,divisor,30,'end')+P(`M${x} 88H${x+w+16}M${x} 88C${x+12} 102 ${x+12} 120 ${x} 132`,2);
    [...dividend].forEach((d,i)=>s+=T(x+22+i*26,118,d,30));[...quot].forEach((d,i)=>s+=T(x+22+(dividend.length-quot.length+i)*26,74,d,30));return s;};
  const area=(x,y,cols,rows,cw,rh,cells,top,left)=>{let s='',yy=y;rows.forEach((r,ri)=>{let xx=x;cols.forEach((c,ci)=>{s+=R(xx,yy,cw[ci],rh[ri],(ri+ci)%3);s+=T(xx+cw[ci]/2,yy+rh[ri]/2+8,cells[ri][ci],22);xx+=cw[ci];});s+=T(x-10,yy+rh[ri]/2+8,left[ri],22,'end');yy+=rh[ri];});
    let xx=x;cols.forEach((c,ci)=>{s+=T(xx+cw[ci]/2,y-10,top[ci],22);xx+=cw[ci];});return s;};
  let b='';
  switch(COURSE_ART[key]||key){
  case 'count':for(let i=0;i<5;i++)b+=C(80+i*60,120,24,i)+T(80+i*60,188,i+1,22);break;
  case 'tens':b+=tenFrame(40,70,10,0,0)+tenFrame(210,70,3,0,1)+T(200,200,'10 + 3 = 13',28);break;
  case 'borrow':b+=tenFrame(40,70,10,2,0)+tenFrame(210,70,3,3,1)+T(200,200,'13 − 5 = 8',28);break;
  case 'place3':{b+=R(50,40,120,120,0);for(let i=1;i<10;i++)b+=L(50+i*12,40,50+i*12,160,0.8)+L(50,40+i*12,170,40+i*12,0.8);
    for(let r=0;r<2;r++){b+=R(200+r*28,40,14,120,1);for(let i=1;i<10;i++)b+=L(200+r*28,40+i*12,214+r*28,40+i*12,0.8);}
    for(let o=0;o<3;o++)b+=R(272+o*24,148,12,12,2);b+=T(200,215,'100 + 20 + 3 = 123',26);break;}
  case 'array':for(let row=0;row<3;row++)for(let col=0;col<4;col++)b+=C(104+col*64,58+row*64,22,row);b+=T(200,245,'3 × 4 = 12',26);break;
  case 'colAdd':b+=T(232,52,'1',18)+['2','4','5'].map((d,i)=>T(200+i*34,92,d,34)).join('')+T(150,138,'+',34)+['1','3','8'].map((d,i)=>T(200+i*34,138,d,34)).join('')+L(140,154,290,154,2)+['3','8','3'].map((d,i)=>T(200+i*34,198,d,34)).join('');break;
  case 'place4':['3','5','0','7'].forEach((d,i)=>{b+=R(80+i*62,60,60,80,i===0?0:i===1?1:i===2?-1:2)+T(110+i*62,114,d,40)+T(110+i*62,168,['1000','100','10','1'][i],16);});b+=T(200,225,'3507',28);break;
  case 'skip':b+=L(40,170,360,170,1.8);for(let i=0;i<=20;i++)b+=L(48+i*15,i%5?165:160,48+i*15,i%5?175:180,1.4);
    for(let j=0;j<4;j++)b+=P(`M${48+j*75} 160Q${85.5+j*75} 95 ${123+j*75} 160`,2)+C(85.5+j*75,118,9,j);[0,5,10,15,20].forEach((v,i)=>b+=T(48+i*75,205,v,20));b+=T(200,245,'5 × 4 = 20',26);break;
  case 'areaMul':b+=area(90,60,[0,1],[0],[200,60],[110],[['80','12']],['20','3'],['4'])+T(200,232,'23 × 4 = 92',26);break;
  case 'groups':for(let g=0;g<3;g++){b+=`<rect x="${35+g*120}" y="45" width="100" height="150" rx="50" stroke="${ink}" fill="none"/>`;for(let n=0;n<4;n++)b+=C(67+g*120+(n%2)*36,94+Math.floor(n/2)*53,12,g);}b+=T(200,240,'12 ÷ 3 = 4',26);break;
  case 'remainder':for(let g=0;g<3;g++){b+=`<rect x="${30+g*96}" y="50" width="82" height="130" rx="41" stroke="${ink}" fill="none"/>`;for(let n=0;n<4;n++)b+=C(56+g*96+(n%2)*30,92+Math.floor(n/2)*46,11,g);}b+=C(330,92,11,2)+C(330,138,11,2)+T(200,232,'14 ÷ 4 = 3 … 2',26);break;
  case 'longDiv':b+=longDiv(160,'3','126','42')+T(200,215,'126 ÷ 3 = 42',26);break;
  case 'longDiv2':b+=longDiv(160,'12','156','13')+T(200,215,'156 ÷ 12 = 13',26);break;
  case 'area2':b+=area(110,50,[0,1],[0,1],[170,40],[90,50],[['200','30'],['80','12']],['20','3'],['10','4'])+T(200,240,'23 × 14 = 322',24);break;
  case 'area3':b+=area(110,50,[0,1],[0,1],[170,40],[90,50],[['600','80'],['180','24']],['30','4'],['20','6'])+T(200,240,'34 × 26 = 884',24);break;
  case 'fracSame':for(let i=0;i<5;i++)b+=R(75+i*50,60,50,60,i<2?0:i<3?1:-1);b+=frac(110,190,2,5,24)+T(150,198,'+',24)+frac(190,190,1,5,24)+T(232,198,'=',24)+frac(275,190,3,5,24);break;
  case 'factFamily':b+=P('M200 40L320 190H80Z',2)+C(200,72,26,0)+C(110,170,24,1)+C(290,170,24,2)+T(200,82,'12',24)+T(110,179,'3',24)+T(290,179,'4',24)+T(200,240,'3 × 4 = 12,  12 ÷ 3 = 4',22);break;
  case 'decimal':for(let i=0;i<10;i++)b+=R(50+i*30,70,30,60,i<3?0:i<7?1:-1);b+=T(50,160,'0',18)+T(350,160,'1',18)+T(200,215,'0.3 + 0.4 = 0.7',28);break;
  case 'factors':for(let i=0;i<12;i++)b+=C(112+i*16,48,6,0);for(let r=0;r<2;r++)for(let c=0;c<6;c++)b+=C(70+c*18,100+r*18,6,1);for(let r=0;r<3;r++)for(let c=0;c<4;c++)b+=C(256+c*18,96+r*18,6,2);
    b+=T(200,195,'12 = 1 × 12 = 2 × 6 = 3 × 4',22)+T(200,232,'1, 2, 3, 4, 6, 12',22);break;
  case 'equivFrac':[[2,1],[4,2],[8,4]].forEach(([n,k],r)=>{for(let i=0;i<n;i++)b+=R(150+i*(200/n),35+r*70,200/n,46,i<k?r:-1);b+=frac(100,58+r*70,k,n,20);});break;
  case 'order':b+=T(105,130,'(3 + 5)',30)+T(190,130,'× 2',30)+T(255,130,'− 4',30)+T(325,130,'= 12',30);[[105,'1'],[190,'2'],[255,'3']].forEach(([x,n])=>b+=C(x,72,14,+n-1)+T(x,78,n,16));break;
  case 'fracMul':for(let r=0;r<4;r++)for(let c=0;c<3;c++)b+=R(130+c*50,30+r*40,50,40,c<2&&r<3?0:c<2?1:r<3?2:-1);b+=frac(130,222,2,3,20)+T(160,228,'×',22)+frac(190,222,3,4,20)+T(220,228,'=',22)+frac(250,222,1,2,20);break;
  case 'squares':[1,2,3,4].forEach((n,k)=>{const x0=[45,90,150,230][k];for(let r=0;r<n;r++)for(let c=0;c<n;c++)b+=C(x0+c*20,170-(n-1-r)*20,7,k);b+=T(x0+(n-1)*10,210,sup(n,'2',22),22);});b+=T(200,248,'1, 4, 9, 16',22);break;
  case 'fracDiv':for(let w=0;w<2;w++)for(let i=0;i<4;i++)b+=R(60+w*150+i*35,70,35,60,(w*4+i)%3);b+=T(196,190,'2 ÷',26,'end')+frac(220,183,1,4,22)+T(244,190,'= 8',26,'start');break;
  case 'fracDec':b+=R(50,108,225,44,1)+L(50,130,350,130,2);for(let i=0;i<=10;i++)b+=L(50+i*30,i%5?124:118,50+i*30,i%5?136:142,1.4);b+=dot(275,130,6)+T(50,172,'0',18)+T(350,172,'1',18)+T(275,96,'0.75',18)+frac(176,215,3,4,22)+T(196,222,'= 0.75',24,'start');break;
  case 'ratio':for(let i=0;i<2;i++)b+=R(60+i*42,50,36,36,0);for(let i=0;i<3;i++)b+=R(206+i*42,50,36,36,1);b+=T(172,78,':',30)+R(50,120,300,40)+R(50,120,120,40,0)+T(110,147,'40%',18)+frac(140,215,2,5,22)+T(170,222,'= 40%',24,'start');break;
  case 'forms':b+=R(40,70,90,90,0)+frac(85,112,3,4,26)+T(152,124,'=',30)+R(175,70,90,90,1)+T(220,126,'0.75',26)+T(287,124,'=',30)+R(305,70,70,90,2)+T(340,126,'75%',22);break;
  case 'primes':for(let n=1;n<=30;n++){const x=70+((n-1)%6)*52,y=40+Math.floor((n-1)/6)*42;if([2,3,5,7,11,13,17,19,23,29].includes(n))b+=C(x,y-7,16,n%3);b+=T(x,y,n,18);}break;
  case 'oddSquares':for(let k=0;k<4;k++)for(let r=0;r<=k;r++)for(let c=0;c<=k;c++)if(r===k||c===k)b+=R(130+c*34,30+r*34,34,34,k);b+=T(200,232,'1 + 3 + 5 + 7 = '+sup('4','2',26),26);break;
  case 'factorTree':b+=L(200,57,95,125)+L(200,57,290,125)+L(290,145,250,210)+L(290,145,335,210);[[200,36,'12'],[95,143,'3'],[290,143,'4'],[250,235,'2'],[335,235,'2']].forEach(([x,y,s])=>b+=T(x,y,s,32));break;
  case 'signs':{b+=P('M110 80H290M170 40V200',1.8);const H=[['×','+','−'],['+','+','−'],['−','−','+']];H.forEach((row,r)=>row.forEach((v,c)=>{const x=140+c*60,y=68+r*50;if(r&&c&&v==='+')b+=R(x-24,y-30,48,40,0);b+=T(x,y,v,30);}));b+=T(200,240,'(−2) × (−3) = +6',26);break;}
  case 'balance':b+=P('M200 60V200M170 200H230M100 60H300',2.2)+P('M120 60L75 90M120 60L165 90M280 60L235 90M280 60L325 90',1.2)+P('M70 90H170M230 90H330',2)+P('M75 90Q120 140 165 90M235 90Q280 140 325 90',1.6)+T(120,150,'x + 3',22)+T(280,150,'7',22)+dot(200,60,5)+P('M190 60L200 44L210 60',1.6)+T(200,240,'x + 3 = 7  →  x = 4',22);break;
  case 'repeating':b+=frac(110,110,1,3,34)+T(150,121,'=',34)+T(226,121,'0.',34,'end')+T(240,121,'3',34)+dot(240,84,4)+T(200,200,'0.333…',30);break;
  case 'system':b+=axes(140,180,60,350,230,25);b+=P(`M${140+(-1)*40} ${180-4*40}L${140+4*40} ${180-(-1)*40}`,2)+P(`M${140+0.5*40} ${180+0.5*40}L${140+4.5*40} ${180-3.5*40}`,2);b+=dot(220,140)+T(206,146,'(2, 1)',18,'end')+T(280,252,'x + y = 3,  x − y = 1',18);break;
  case 'linear':b+=axes(170,170,60,350,240,20)+P(plot(x=>2*x+1,-1.4,2.2,170,170,40,30),2.2)+P('M170 140H210V80',1.4,' stroke-dasharray="4 4"')+dot(170,140)+T(218,118,'2',18,'start')+T(190,160,'1',18)+T(300,62,'y = 2x + 1',22);break;
  case 'sqrt':b+=R(140,40,120,120);b+=L(200,40,200,160,0.8)+L(140,100,260,100,0.8);b+=`<path d="M200 40L260 100L200 160L140 100Z" stroke="${ink}" stroke-width="2" ${fill(0)}/>`+T(234,66,'√2',18,'start')+T(200,215,'(√2)'+'<tspan font-size="16" dy="-10">2</tspan><tspan dy="10"> = 2</tspan>',28);break;
  case 'factorArea':b+=area(130,45,[0,1],[0,1],[110,50],[110,40],[[sup('x','2',22),'3x'],['2x','6']],['x','3'],['x','2'])+T(200,232,sup('x','2',22)+'+ 5x + 6 = (x + 2)(x + 3)',22);break;
  case 'parabola':b+=axes(160,140,50,360,245,20)+P(plot(x=>(x-1)**2-2,-1.3,3.3,160,140,40,26),2.2)+L(200,30,200,210,1.2,'4 4')+dot(200,192)+T(320,232,'y = (x − 1)'+'<tspan font-size="14" dy="-9">2</tspan><tspan dy="9"> − 2</tspan>',18);break;
  case 'square':b+=R(115,25,110,110,0)+R(225,25,55,110,1)+R(115,135,110,55,1)+R(225,135,55,55,2);b+=T(170,90,sup('a','2',26),26)+T(252,89,'ab',22)+T(170,170,'ab',22)+T(253,170,sup('b','2',22),22)+T(200,240,'(a + b)'+'<tspan font-size="15" dy="-10">2</tspan>',25);break;
  case 'synthetic':{const xs=[150,200,250,300];b+=T(108,80,'1',26)+P('M125 55V170M125 140H340',1.8);['1','−6','11','−6'].forEach((v,i)=>b+=T(xs[i]+12,80,v,24));['1','−5','6'].forEach((v,i)=>b+=T(xs[i+1]+12,122,v,24));['1','−5','6'].forEach((v,i)=>b+=T(xs[i]+12,168,v,24));b+=R(290,145,44,32)+T(312,168,'0',24)+T(200,230,'P(1) = 0',24);break;}
  case 'complex':b+=axes(130,180,50,360,240,20)+L(130,180,250,90,1.8)+L(250,90,250,180,1.2,'4 4')+L(130,90,250,90,1.2,'4 4')+dot(250,90)+T(262,82,'2 + 3i',20,'start')+T(250,202,'2',16)+T(118,96,'3',16,'end')+T(300,238,'i'+'<tspan font-size="14" dy="-9">2</tspan><tspan dy="9"> = −1</tspan>',22);break;
  case 'roots':b+=axes(200,150,40,360,240,20)+P(plot(x=>x*x/1.6-2,-2.7,2.7,200,150,60,26),2.2)+dot(200-60*Math.sqrt(3.2),150)+dot(200+60*Math.sqrt(3.2),150)+T(200-60*Math.sqrt(3.2)-4,172,'α',20,'end')+T(200+60*Math.sqrt(3.2)+4,172,'β',20,'start')+T(200,250,'a'+'<tspan>x</tspan><tspan font-size="14" dy="-9">2</tspan><tspan dy="9"> + bx + c = 0</tspan>',20);break;
  case 'parabolaLine':b+=axes(200,190,60,350,235,15)+P(plot(x=>x*x,-1.9,2.4,200,190,50,30),2.2)+P(plot(x=>x+2,-2.2,2.6,200,190,50,30),1.8)+dot(150,160)+dot(300,70)+T(300,250,sup('x','2',20)+'= x + 2',20);break;
  case 'cubic':b+=axes(200,130,60,345,235,20)+P(plot(x=>x*x*x-x,-1.35,1.35,200,130,90,90),2.2)+dot(110,130)+dot(200,130)+dot(290,130)+T(200,252,sup('x','3',20)+'− x = 0',20);break;
  case 'twoParab':b+=axes(200,130,60,345,235,20)+P(plot(x=>x*x-1,-1.75,1.75,200,130,80,50),2)+P(plot(x=>1-x*x,-1.75,1.75,200,130,80,50),2,' stroke-dasharray="7 4"')+dot(120,130)+dot(280,130)+T(200,252,'y = '+sup('x','2',18)+'− 1,  y = 1 − '+sup('x','2',18),18);break;
  case 'interval':b+=L(40,120,360,120,1.8);for(let i=-3;i<=5;i++)b+=L(80+(i+3)*30,114,80+(i+3)*30,126,1.4)+T(80+(i+3)*30,152,i<0?'−'+(-i):i,16);b+=`<path d="M140 120H260" stroke="${ink}" stroke-width="7"/>`+hole(140,120,7)+dot(260,120,7)+T(200,215,'−1 &lt; x ≤ 3',28);break;
  case 'tree':{const Ls=['A','B','C'];b+=dot(60,130,5);Ls.forEach((a,i)=>{const y=60+i*70;b+=L(60,130,150,y,1.6)+T(165,y+7,a,20);Ls.filter(x=>x!==a).forEach((c,j)=>{const y2=y-18+j*36;b+=L(180,y,260,y2,1.3)+T(275,y2+6,c,18);b+=L(290,y2,330,y2,1.1)+T(345,y2+6,Ls.find(z=>z!==a&&z!==c),16);});});b+=T(200,252,'3 × 2 × 1 = 6',20);break;}
  case 'pascal':[[1],[1,1],[1,2,1],[1,3,3,1],[1,4,6,4,1]].forEach((row,r)=>row.forEach((v,i)=>{const x=200+(i-r/2)*44,y=40+r*38;if(r===4&&i===2)b+=C(x,y-7,16,0);b+=T(x,y,v,22);}));b+=T(200,245,'<tspan font-size="15" dy="6">4</tspan><tspan dy="-6">C</tspan><tspan font-size="15" dy="6">2</tspan><tspan dy="-6"> = 6</tspan>',24);break;
  case 'matrix':{const br=(x,y,h,l)=>P(l?`M${x+8} ${y}Q${x-6} ${y+h/2} ${x+8} ${y+h}`:`M${x-8} ${y}Q${x+6} ${y+h/2} ${x-8} ${y+h}`,2);b+=br(60,70,90,1)+T(92,105,'1',26)+T(132,105,'2',26)+T(92,145,'3',26)+T(132,145,'4',26)+br(162,70,90,0)+br(180,70,90,1)+T(204,105,'1',26)+T(204,145,'2',26)+br(226,70,90,0)+T(256,124,'=',28)+br(282,70,90,1)+T(312,105,'5',26)+T(312,145,'11',26)+br(342,70,90,0);break;}
  case 'points':b+=axes(170,170,50,355,240,20)+L(110,140,290,80,1.8)+dot(110,140)+dot(290,80)+dot(200,110)+L(110,140,290,140,1.1,'4 4')+L(290,80,290,140,1.1,'4 4')+T(102,132,'A',20,'end')+T(298,74,'B',20,'start')+T(200,100,'M',18);break;
  case 'perpLines':b+=axes(170,170,50,355,240,20)+P(plot(x=>0.5*x+1,-2.5,4.2,170,170,40,40),2)+P(plot(x=>-2*x+6,1.4,3.4,170,170,40,40),2)+dot(250,90)+P('M236 97L243 111L257 104',1.4)+T(200,252,'m'+'<tspan font-size="14" dy="6">1</tspan><tspan dy="-6"> × m</tspan><tspan font-size="14" dy="6">2</tspan><tspan dy="-6"> = −1</tspan>',22);break;
  case 'circle':b+=axes(140,190,50,355,240,15)+C(220,110,70,0,2)+dot(220,110)+L(220,110,269.5,60.5,1.6)+T(252,96,'r',20,'start')+T(206,128,'(a, b)',16,'end')+T(205,255,'(x − a)'+'<tspan font-size="13" dy="-8">2</tspan><tspan dy="8"> + (y − b)</tspan><tspan font-size="13" dy="-8">2</tspan><tspan dy="8"> = r</tspan><tspan font-size="13" dy="-8">2</tspan>',18);break;
  case 'reflect':b+=axes(130,200,50,350,240,20)+L(110,220,330,0,1.2,'6 5')+`<path d="M170 180L230 180L190 140Z" stroke="${ink}" stroke-width="2" ${fill(0)}/>`+`<path d="M150 160L150 100L190 140Z" stroke="${ink}" stroke-width="2" stroke-dasharray="5 4" ${fill(1)}/>`+T(302,64,'y = x',18,'start')+T(250,240,'(x, y) → (y, x)',20);break;
  case 'venn':b+=R(60,30,280,180)+`<path d="M200 72.6A70 70 0 0 1 200 187.4A70 70 0 0 1 200 72.6Z" stroke="none" ${fill(0)}/>`+C(160,130,70)+C(240,130,70)+T(120,100,'A',22)+T(280,100,'B',22)+T(200,245,'A ∩ B',24);break;
  case 'nonneg':b+=L(65,200,340,200)+L(200,220,200,25)+`<path d="M80 40Q200 360 320 40" fill="none" stroke="${ink}" stroke-width="2"/>`+T(200,240,sup('x','2',28)+'≥ 0',28);break;
  case 'mapping':b+=`<ellipse cx="120" cy="120" rx="55" ry="85" stroke="${ink}" stroke-width="1.6" fill="none"/><ellipse cx="280" cy="120" rx="55" ry="85" stroke="${ink}" stroke-width="1.6" fill="none"/>`;[['1','a'],['2','b'],['3','c']].forEach(([p,q],i)=>{const y=70+i*50;b+=dot(130,y,4)+dot(270,y,4)+T(110,y+7,p,20)+T(292,y+7,q,20)+P(`M136 ${y}H262M255 ${y-4}L262 ${y}L255 ${y+4}`,1.5);});b+=T(120,28,'X',18)+T(280,28,'Y',18)+T(200,248,'f : X → Y',22);break;
  case 'hyperbola':b+=axes(200,130,50,350,240,20)+P(plot(x=>1/x,0.28,3.6,200,130,40,40),2.2)+P(plot(x=>1/x,-3.6,-0.28,200,130,40,40),2.2)+T(280,250,'y = ',22,'end')+frac(298,243,1,'x',18);break;
  case 'sqrtCurve':b+=axes(110,190,60,355,240,20)+P(plot(x=>Math.sqrt(x),0,5.8,110,190,40,55),2.2)+dot(110,190,4.5)+P('M262 252L270 248L278 258L288 230H306',1.6)+T(254,252,'y =',20,'end')+T(297,252,'x',20);break;
  case 'expLaw':b+=T(200,100,'2'+'<tspan font-size="18" dy="-14">3</tspan><tspan dy="14"> × 2</tspan><tspan font-size="18" dy="-14">2</tspan><tspan dy="14"> = 2</tspan><tspan font-size="18" dy="-14">5</tspan>',34)+T(200,180,'2'+'<tspan font-size="18" dy="-14">0</tspan><tspan dy="14"> = 1</tspan>',34);break;
  case 'log':b+=T(200,100,'2'+'<tspan font-size="18" dy="-14">3</tspan><tspan dy="14"> = 8</tspan>',34)+T(200,140,'⇕',26)+T(200,192,'log'+'<tspan font-size="18" dy="8">2</tspan><tspan dy="-8"> 8 = 3</tspan>',34);break;
  case 'expLog':b+=axes(150,170,50,355,240,15)+L(80,240,300,20,1.1,'6 5')+P(plot(x=>2**x,-3,2.55,150,170,32,32),2.2)+P(plot(x=>Math.log2(x),0.125,6.2,150,170,32,32),2.2)+dot(150,138,3.5)+dot(182,170,3.5)+T(306,30,'y = x',16,'start');break;
  case 'expLine':b+=axes(170,200,50,355,240,15)+P(plot(x=>2**x,-2.8,2.4,170,200,40,40),2.2)+L(60,40,350,40,1.6)+L(250,40,250,200,1.2,'4 4')+dot(250,40)+T(250,222,'2',16)+T(300,250,'2'+'<tspan font-size="14" dy="-9">x</tspan><tspan dy="9"> = 4</tspan>',22);break;
  case 'unitCircle':{const a=50*Math.PI/180,px=200+90*Math.cos(a),py=125-90*Math.sin(a);b+=axes(200,125,90,320,226,15)+C(200,125,90)+L(200,125,px,py,2)+L(px,py,px,125,1.2,'4 4')+dot(px,py)+P(`M230 125A30 30 0 0 0 ${200+30*Math.cos(a)} ${125-30*Math.sin(a)}`,1.6)+T(240,116,'θ',18,'start')+T(px+8,py-6,'P',18,'start')+T(200,252,'(cos θ, sin θ)',20);break;}
  case 'sine':b+=axes(60,130,45,365,235,20)+P(plot(x=>Math.sin(x),0,2*Math.PI,60,130,45,70),2.2)+L(60+Math.PI*45,124,60+Math.PI*45,136,1.2)+T(60+Math.PI*45,154,'π',18)+T(60+2*Math.PI*45,154,'2π',18)+T(52,66,'1',16,'end')+T(52,206,'−1',16,'end')+T(300,250,'y = sin x',20);break;
  case 'sineLine':{b+=axes(60,120,45,365,215,20)+P(plot(x=>Math.sin(x),0,2*Math.PI,60,120,45,70),2.2)+L(50,85,360,85,1.4,'6 4');const x1=60+Math.PI/6*45,x2=60+5*Math.PI/6*45;b+=dot(x1,85)+dot(x2,85)+T(222,250,'sin x =',22,'end')+frac(244,243,1,2,18);break;}
  case 'triangle':b+=`<path d="M80 200L330 200L150 50Z" stroke="${ink}" stroke-width="2" ${fill(0)}/>`+P('M138.2 75.4A28 28 0 0 0 171.5 67.9',1.4)+T(150,40,'A',20)+T(70,214,'B',20,'end')+T(340,214,'C',20,'start')+T(205,222,'a',20)+T(255,120,'b',20,'start')+T(105,120,'c',20,'end')+T(200,252,'a'+'<tspan font-size="13" dy="-8">2</tspan><tspan dy="8"> = b</tspan><tspan font-size="13" dy="-8">2</tspan><tspan dy="8"> + c</tspan><tspan font-size="13" dy="-8">2</tspan><tspan dy="8"> − 2bc cos A</tspan>',18);break;
  case 'arith':for(let i=0;i<5;i++){const h=24*(i+1);b+=R(60+i*62,200-h,40,h,i);if(i)b+=T(49+i*62,190-h,'+2',14);}b+=T(200,240,'a'+'<tspan font-size="15" dy="6">n</tspan><tspan dy="-6"> = 2n</tspan>',24);break;
  case 'geom':for(let i=0;i<5;i++){const h=9*2**i;b+=R(60+i*62,200-h,40,h,i);if(i)b+=T(49+i*62,190-Math.max(h,24),'×2',14);}b+=T(200,240,'a'+'<tspan font-size="15" dy="6">n</tspan><tspan dy="-6"> = 2</tspan><tspan font-size="15" dy="-12">n−1</tspan>',24);break;
  case 'sigma':for(let k=1;k<=5;k++)for(let j=0;j<k;j++)b+=R(50+(k-1)*30,190-(j+1)*30,30,30,k);b+=T(275,150,'Σ',52)+T(275,95,'5',16)+T(275,172,'k=1',14)+T(296,140,'k = 15',24,'start');break;
  case 'domino':for(let i=0;i<6;i++){const ang=i<3?-62+i*14:0,x=70+i*48;b+=`<rect x="${x}" y="80" width="18" height="100" rx="3" transform="rotate(${ang} ${x+18} 180)" stroke="${ink}" stroke-width="1.6" ${fill(i)}/>`;}b+=L(40,181,360,181,1.6)+T(200,240,'P(1),  P(k) → P(k + 1)',22);break;
  case 'limit':b+=axes(80,200,50,355,240,20)+P(plot(x=>0.15*x*x+1,0,5.2,80,200,50,30),2.2)+hole(230,200-30*(0.15*9+1))+L(230,200,230,200-30*2.35,1.2,'4 4')+L(80,200-30*2.35,230,200-30*2.35,1.2,'4 4')+T(230,220,'a',18)+T(72,135,'L',18,'end')+T(270,248,'lim',22,'end')+T(255,262,'x→a',11)+T(276,248,'f(x) = L',22,'start');break;
  case 'tangent':b+=axes(120,200,50,355,240,20)+P(plot(x=>0.5*x*x,-0.8,3.8,120,200,50,30),2.2)+P(plot(x=>2*(x-2)+2,0.4,3.7,120,200,50,30),1.8)+dot(220,140)+L(220,140,220,200,1.1,'4 4')+T(220,220,'a',18)+T(300,250,"f ′(a)",22);break;
  case 'extrema':b+=axes(200,130,50,355,240,20)+P(plot(x=>x*x*x-3*x,-2.1,2.1,200,130,60,24),2.2)+dot(140,82)+dot(260,178)+L(115,82,165,82,1.6)+L(235,178,285,178,1.6)+T(300,250,"f ′(x) = 0",22);break;
  case 'integral':{const f=x=>0.12*x*x+1.2,ox=70,oy=200,u=45;let d=`M${ox+1*u} ${oy}`;for(let i=0;i<=40;i++){const x=1+4*i/40;d+=`L${ox+x*u} ${oy-f(x)*u*0.6}`;}d+=`L${ox+5*u} ${oy}Z`;b+=`<path d="${d}" stroke="none" ${fill(0)}/>`+axes(ox,oy,45,360,240,20)+P(plot(x=>f(x)*0.6,0,6.3,ox,oy,u,u),2.2)+L(ox+u,oy,ox+u,oy-f(1)*u*0.6,1.4)+L(ox+5*u,oy,ox+5*u,oy-f(5)*u*0.6,1.4)+T(ox+u,oy+20,'a',18)+T(ox+5*u,oy+20,'b',18)+T(250,252,'∫',30,'end')+T(258,234,'b',12,'start')+T(252,258,'a',12,'start')+T(268,252,'f(x) dx',22,'start');break;}
  default:b+=L(45,207,355,207)+L(73,235,73,20)+P('M85 185C150 185 154 65 215 65S297 177 340 38',2);
  }
  return `<svg class="nm-series-math-art" viewBox="0 0 400 260" aria-hidden="true"><defs><linearGradient id="aGreen" x2=".9" y2="1"><stop stop-color="#88b99a"/><stop offset="1" stop-color="#2f6b4a"/></linearGradient><linearGradient id="aGold" x2=".9" y2="1"><stop stop-color="#f0d995"/><stop offset="1" stop-color="#bd8d2c"/></linearGradient><linearGradient id="aCoral" x2=".9" y2="1"><stop stop-color="#f2b395"/><stop offset="1" stop-color="#b4512e"/></linearGradient></defs>${b}</svg>`;
}
function illustration(m){return art(m.academic?'b':'a',m.motif);}
function front(cv,m){
 const ko=m.lang==='ko',zh=m.lang==='zh',course=ko?'과정':zh?'课程':'Course',nameLabel=ko?'이름':zh?'姓名':'Name';
 return '<section class="nm-print-cover nm-series-front '+(m.academic?'nm-series-academic':'nm-series-children')+'" style="--series-ground:'+m.ground+';--series-accent:'+m.accent+'" data-series-level="'+esc(m.level)+'">'
 +'<div class="nm-series-brand"><img src="assets/gfield-logo.svg" alt="GFIELD"><span>NUMBERS OF MAGIC</span></div>'
 +'<div class="nm-series-front-copy"><p class="nm-series-level">'+esc(m.level)+(m.number?' · '+course+' '+esc(m.number):'')+'</p><h1>'+esc(m.title)+'</h1></div>'
 +'<div class="nm-series-front-art">'+illustration(m)+(!m.academic?'<img class="nm-series-hero" src="assets/characters/'+m.hero+'.png" alt="">':'')+'</div>'
 +'<div class="nm-series-front-bottom"><div><span>'+nameLabel+'</span><b>'+esc(cv.name||'________________')+'</b></div><div><span>'+esc(ko?'나의 수학 노트':zh?'我的数学笔记':'My mathematics notebook')+'</span><b>'+esc(ko?'수의 마법':'Numbers of Magic')+'</b></div></div></section>';
}
function decorate(sheet,cv){
 const m=model(cv,sheet.lang||'ko');
 sheet.classList.add('nm-series-sheet',m.academic?'nm-series-academic':'nm-series-children');
 sheet.style.setProperty('--series-accent',m.academic?'#2f6b4a':m.accent);
 sheet.dataset.seriesLevel=m.level;
 const toc=sheet.querySelector('.nm-cvw');
 if(toc){
   toc.classList.add('nm-series-contents');
   const hero=toc.querySelector('.nm-cvw-hero');
   if(hero){hero.querySelector('.nm-cvw-title').textContent=m.lang==='ko'?'이번 주 학습 안내':m.lang==='zh'?'本周学习指南':'This week’s learning guide';
     /* 표준 학습지 링크(ws.html r=회차)만 「N회차 · 연습량」을 붙인다(2026-10-28). 날짜는 붙이지 않는다(과정만 — 2026-10-24). */
     hero.querySelector('.nm-cv-kicker').textContent=m.level+(cv&&cv.roundLabel?' · '+cv.roundLabel:'');
     hero.querySelector('.nm-cvw-cover-teaser')?.remove();hero.querySelector('.nm-cvw-cover-character')?.remove();
     const banner=document.createElement('div');banner.className='nm-series-mentor';
     banner.innerHTML=(!m.academic?'<img src="assets/characters/'+m.hero+'.png" alt="">':'<span class="nm-series-mentor-mark" aria-hidden="true">∑</span>')+'<div><b>'+esc(m.lang==='ko'?'나의 학습 순서':m.lang==='zh'?'我的学习顺序':'My learning sequence')+'</b><p>'+esc(m.lang==='ko'?'개념을 살펴보고, 예시를 따라 풀고, 스스로 풀어 보세요.':m.lang==='zh'?'先看概念，再跟着例题练习，最后独立解答。':'Explore the concept, follow an example, then try it yourself.')+'</p></div>';
     hero.after(banner);
   }
 }
 if(!m.academic)sheet.querySelectorAll('.nm-w2-head-tier').forEach(el=>{el.textContent='';el.innerHTML='<img src="assets/characters/'+m.buddy+'.png" alt="">';});
}
root.NM_WORKSHEET_SERIES={version:'20261103-course-art1',model,front,decorate,artKind:key=>COURSE_ART[key]||''};
})(typeof window!=='undefined'?window:globalThis);

