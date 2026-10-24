/* Course series design only. It never changes problems, seeds or schedules. */
(function(root){
'use strict';
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const L=(v,lang)=>typeof v==='string'?v:v?.[lang]||v?.ko||'';
function model(cv,lang='ko'){
 const C=root.NM_COURSES||{},keys=(cv.assignedCourseKeys||[]).filter(k=>C[k]);
 if(!keys.length&&Number.isInteger(+cv.courseNum)&&C['C'+cv.courseNum])keys.push('C'+cv.courseNum);
 const courses=keys.map(k=>C[k]),academic=courses.some(c=>/^(middle|highmath|algebra|calculus)/.test(c.tier))||!!cv.compactHigh;
 const stages=[...new Set(keys.map(k=>(root.NM_STAGES||[]).find(s=>+k.slice(1)>=s.courses.from&&+k.slice(1)<=s.courses.to)).filter(Boolean).map(s=>L(s.name,lang)))];
 const title=cv.middleExtension?String(cv.courseTitle||'').replace(/ · (이번 주 학습|This week’s learning|本周学习)$/,'')
   :courses.length?courses.map(c=>L(c.title,lang)).join(' / '):cv.courseTitle||'Numbers of Magic';
 const number=keys.map(k=>k.slice(1)).join('·'),tier=courses[0]?.tier||'level1';
 const nth=Number(courses[0]?.order)||0,levelIndex={level0:0,level1:0,level2:1,level3:2,challenge:2,middle1:0,middle2:1,middle3:2,highmath1:0,highmath2:1,algebra:2,calculus1:1}[tier]||0,themeIndex=(nth+levelIndex)%3;
 const heroes=tier==='level0'?['numi-0-happy','poco-3-think','momo-8-happy']:['kid-boy','kid-girl','numi-wizard'];
 const hero=heroes[themeIndex],topicText=title+' '+courses.map(c=>c.title.ko).join(' ');
 let motif=/제곱근|무리수|Square Root/.test(topicText)?'C35':/곱셈구구|구구단|Times Tables/.test(topicText)?'C4':/분수|Fraction/.test(topicText)?'fraction':/나눗셈|Division/.test(topicText)?'C13':/소인수|정수의/.test(topicText)?'C29':/함수|극한|미분|적분/.test(topicText)?'C70':/다항식|인수|방정식|항등식/.test(topicText)||cv.middleExtension?'C38':academic?'C54':'C0';
 const buddy=/곱셈|구구/.test(topicText)?'sym-times':/나눗셈/.test(topicText)?'sym-divide':/뺄셈/.test(topicText)?'sym-minus':'sym-plus';
 return {academic,keys,level:stages.join(' → ')||(academic?'MATHEMATICS':'NUMBERS'),title,number,hero,buddy,motif,ground:['#16382a','#4a1f2a','#2a241c'][themeIndex],accent:['#2f6b4a','#a66c20','#8b4d3b'][themeIndex],lang};
}
function art(kind,key){
  const dark=kind!=='a',ink=kind==='b'?'#d9a62e':kind==='c'?'#f7f2e7':'#2f6b4a',palette=kind==='b'?['none','none','none']:kind==='c'?['#e8734a','#d9a62e','#2f8f5b']:['url(#'+kind+'Green)','url(#'+kind+'Gold)','url(#'+kind+'Coral)'];
  const shape=(tag,attrs,fill=0)=>`<${tag} ${attrs} fill="${palette[fill]}" stroke="${ink}" stroke-width="${kind==='b'?1.1:1}"/>`;
  const text=(x,y,s,size=24)=>`<text x="${x}" y="${y}" fill="${ink}" font-family="NM Series Sans,Pretendard,sans-serif" font-size="${size}" text-anchor="middle">${s}</text>`;
  const line=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${ink}" stroke-width="1.4" fill="none"/>`;
  let body='';
  if(key==='C0'){
    for(let i=0;i<5;i++){body+=shape('circle',`cx="${80+i*60}" cy="120" r="24"`,i%3)+text(80+i*60,188,i+1,22);}
  }else if(key==='C4'){
    for(let row=0;row<3;row++)for(let col=0;col<4;col++)body+=shape('circle',`cx="${104+col*64}" cy="${58+row*64}" r="22"`,row%3);
    body+=text(200,245,'3 × 4',26);
  }else if(key==='C13'){
    for(let g=0;g<3;g++){body+=`<rect x="${35+g*120}" y="45" width="100" height="150" rx="50" stroke="${ink}" fill="none"/>`;for(let n=0;n<4;n++)body+=shape('circle',`cx="${67+g*120+(n%2)*36}" cy="${94+Math.floor(n/2)*53}" r="12"`,g);}
    body+=text(200,240,'12 ÷ 3',26);
  }else if(key==='C29'){
    body+=line(200,57,95,125)+line(200,57,290,125)+line(290,145,250,210)+line(290,145,335,210);
    [[200,36,'12'],[95,143,'3'],[290,143,'4'],[250,235,'2'],[335,235,'2']].forEach(([x,y,s])=>body+=text(x,y,s,32));
  }else if(key==='C35'){
    for(let row=0;row<8;row++)for(let col=0;col<8;col++)body+=shape('rect',`x="${112+col*22}" y="${20+row*22}" width="22" height="22"`,Math.floor(row/3)%3);
    body+=line(112,211,288,211)+text(200,242,'8',25)+text(85,119,'8',25);
  }else if(key==='C38'||key==='M3E'){
    body+=shape('rect','x="115" y="25" width="110" height="110"',0)+shape('rect','x="225" y="25" width="55" height="110"',1)+shape('rect','x="115" y="135" width="110" height="55"',1)+shape('rect','x="225" y="135" width="55" height="55"',2);
    body+=text(170,90,'a²',26)+text(252,89,'ab',22)+text(170,170,'ab',22)+text(253,170,'b²',22)+text(200,240,'(a + b)²',25);
  }else if(key==='C54'){
    body+=line(65,200,340,200)+line(200,220,200,25)+`<path d="M80 40Q200 360 320 40" fill="none" stroke="${ink}" stroke-width="2"/>`+text(200,240,'x² ≥ 0',28);
  }else{
    body+=line(45,207,355,207)+line(73,235,73,20)+`<path d="M85 185C150 185 154 65 215 65S297 177 340 38" stroke="${ink}" stroke-width="2" fill="none"/>`+`<path d="M215 65V207M73 65H215" stroke="${ink}" stroke-width="1" stroke-dasharray="4 5" fill="none"/>`+shape('circle','cx="215" cy="65" r="6"',1);
  }
  return `<svg class="nm-series-math-art" viewBox="0 0 400 260" aria-hidden="true"><defs><linearGradient id="${kind}Green" x2=".9" y2="1"><stop stop-color="#88b99a"/><stop offset="1" stop-color="#2f6b4a"/></linearGradient><linearGradient id="${kind}Gold" x2=".9" y2="1"><stop stop-color="#f0d995"/><stop offset="1" stop-color="#bd8d2c"/></linearGradient><linearGradient id="${kind}Coral" x2=".9" y2="1"><stop stop-color="#f2b395"/><stop offset="1" stop-color="#b4512e"/></linearGradient></defs>${body}</svg>`;
}
function illustration(m){
 if(m.motif==='fraction')return '<svg class="nm-series-math-art" viewBox="0 0 400 260" aria-hidden="true"><g transform="translate(200 130)" stroke="'+(m.academic?'#d9a62e':'#2f6b4a')+'" stroke-width="2"><circle r="90" fill="none"/><path d="M0 0V-90A90 90 0 1 1 -90 0H0" fill="'+(m.academic?'#d9a62e22':'#e9f0e7')+'"/><path d="M-90 0H90M0 -90V90" fill="none"/></g></svg>';
 return art(m.academic?'b':'a',m.motif);
}
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
     hero.querySelector('.nm-cv-kicker').textContent=m.level;
     hero.querySelector('.nm-cvw-cover-teaser')?.remove();hero.querySelector('.nm-cvw-cover-character')?.remove();
     const banner=document.createElement('div');banner.className='nm-series-mentor';
     banner.innerHTML=(!m.academic?'<img src="assets/characters/'+m.hero+'.png" alt="">':'<span class="nm-series-mentor-mark" aria-hidden="true">∑</span>')+'<div><b>'+esc(m.lang==='ko'?'나의 학습 순서':m.lang==='zh'?'我的学习顺序':'My learning sequence')+'</b><p>'+esc(m.lang==='ko'?'개념을 살펴보고, 예시를 따라 풀고, 스스로 풀어 보세요.':m.lang==='zh'?'先看概念，再跟着例题练习，最后独立解答。':'Explore the concept, follow an example, then try it yourself.')+'</p></div>';
     hero.after(banner);
   }
 }
 if(!m.academic)sheet.querySelectorAll('.nm-w2-head-tier').forEach(el=>{el.textContent='';el.innerHTML='<img src="assets/characters/'+m.buddy+'.png" alt="">';});
}
root.NM_WORKSHEET_SERIES={version:'20261024-course-series3',model,front,decorate};
})(typeof window!=='undefined'?window:globalThis);

