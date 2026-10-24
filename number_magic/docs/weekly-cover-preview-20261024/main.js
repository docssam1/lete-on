'use strict';
const $=id=>document.getElementById(id);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const styles={a:['A · 흰 바탕과 수학 오브젝트','초등·유아에 어울리는 밝은 표지. 실제 과정에 맞춰 수 배열·묶음·수학 모형이 바뀝니다.'],b:['B · 깊은 색과 금 라인','중등·고등에 어울리는 선 중심 표지. 큰 과정명과 과정을 나타내는 수학 모형을 강조합니다.'],c:['C · 수학 포스터','밝은 제목 영역과 아래 수학 그림을 나눕니다. 과정별 수·기호·도형으로 시리즈를 만듭니다.']};
let catalog=[];
function weekLabel(value){
  if(!/^\d{4}-\d{2}-\d{2}$/.test(value))return '학습 주를 선택해 주세요';
  const d=new Date(value+'T00:00:00Z');if(!Number.isFinite(+d)||d.toISOString().slice(0,10)!==value)return '학습 주를 선택해 주세요';
  d.setUTCDate(d.getUTCDate()-(d.getUTCDay()+6)%7);
  return `${d.getUTCFullYear()}년 ${d.getUTCMonth()+1}월 ${Math.floor((d.getUTCDate()-1)/7)+1}주차`;
}
function art(kind,key){
  const dark=kind!=='a',ink=kind==='b'?'#d9a62e':kind==='c'?'#f7f2e7':'#2f6b4a',palette=kind==='b'?['none','none','none']:kind==='c'?['#e8734a','#d9a62e','#2f8f5b']:['url(#'+kind+'Green)','url(#'+kind+'Gold)','url(#'+kind+'Coral)'];
  const shape=(tag,attrs,fill=0)=>`<${tag} ${attrs} fill="${palette[fill]}" stroke="${ink}" stroke-width="${kind==='b'?1.1:1}"/>`;
  const text=(x,y,s,size=24)=>`<text x="${x}" y="${y}" fill="${ink}" font-family="Cover Sans,sans-serif" font-size="${size}" text-anchor="middle">${s}</text>`;
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
  return `<svg class="art" viewBox="0 0 400 260" aria-hidden="true"><defs><linearGradient id="${kind}Green" x2=".9" y2="1"><stop stop-color="#88b99a"/><stop offset="1" stop-color="#2f6b4a"/></linearGradient><linearGradient id="${kind}Gold" x2=".9" y2="1"><stop stop-color="#f0d995"/><stop offset="1" stop-color="#bd8d2c"/></linearGradient><linearGradient id="${kind}Coral" x2=".9" y2="1"><stop stop-color="#f2b395"/><stop offset="1" stop-color="#b4512e"/></linearGradient></defs>${body}</svg>`;
}
function render(){
  const course=catalog.find(c=>c.key===$('course').value)||catalog[1],name=$('student').value.trim()||'이름을 적어 주세요',week=weekLabel($('date').value),speed=$('speed').value,ground={green:'#16382a',wine:'#4a1f2a',ink:'#2a241c'}[$('ground').value];
  $('covers').innerHTML=Object.entries(styles).map(([kind,[label,note]])=>`<section class="cover-option"><h2 class="option-title">${label}</h2><article class="cover cover-${kind}" style="--ground:${ground}" aria-label="${esc(label+' '+course.title)}"><div class="cover-top"><img src="../../assets/gfield-logo.svg" alt="GFIELD"><span>NUMBERS OF MAGIC</span></div><div class="cover-heading"><p class="course-label">수의 마법 · ${course.extension?'중3 선택 심화':'과정 '+esc(course.number)}</p><h2 class="course-title">${esc(course.title)}</h2><p class="cover-sub">${esc(week)}<br>주간 연산 · ${speed==='1'?'표준 속도':esc(speed)+'배 속도'}</p></div><span class="faint-number" aria-hidden="true">${course.extension?'+':esc(course.number)}</span>${art(kind,course.key)}<div class="cover-meta"><div><small>나의 학습 노트</small><br><strong>${esc(name)}</strong></div><div><small>GFIELD ACADEMY</small><br>수의 마법</div></div></article><p class="option-note">${note}</p></section>`).join('');
  window.NM_COVER_REVIEW_READY=true;
}
fetch('catalog.json').then(r=>{if(!r.ok)throw Error('catalog');return r.json();}).then(data=>{catalog=data;$('course').innerHTML=catalog.map(c=>`<option value="${esc(c.key)}">${c.key} · ${esc(c.title)}</option>`).join('');$('course').value='C4';document.querySelector('.controls').addEventListener('input',render);document.querySelector('.controls').addEventListener('change',render);render();}).catch(()=>{$('covers').textContent='과정 정보를 불러오지 못했어요. 페이지를 다시 열어 주세요.';});
