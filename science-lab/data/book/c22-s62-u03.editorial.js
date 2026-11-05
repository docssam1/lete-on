import{questionPatches as ELECTRICITY_QUESTION_PATCHES,railNotes as ELECTRICITY_RAIL_NOTES,pageTitles,fieldTitles}from'./c22-s62-u03.editorial-data.js?v=20261104-electricity-book';
import{electricityCircuitFigure,electricitySeriesFigure}from'./c22-s62-u03.diagrams.js?v=20261104-electricity-book';
export{ELECTRICITY_QUESTION_PATCHES,ELECTRICITY_RAIL_NOTES};
const replacements=[['서로 돕는 두 전지 연결','전지 두 개의 직렬연결'],['서로 돕는 한 줄 연결','전지의 직렬연결'],['서로 돕는 가운데 연결','직렬연결에서 가운데의 연결'],['돕는 한 줄 연결','직렬연결'],['서로 다른 극끼리 한 줄로 이어 돕게 연결한다','서로 다른 극끼리 이어 직렬연결한다'],['서로 다른 극끼리 한 줄로 연결한다','서로 다른 극끼리 이어 직렬연결한다'],['서로 돕게 이은 두 개의 전지','직렬연결한 두 개의 전지'],['한 줄로 이어 돕게','직렬로'],['닫힌 연결','끊기지 않은 전기 회로'],['통전 중','전류가 흐르는 동안'],['통전 시간','전류가 흐르는 시간'],['통전 안전','전류가 흐를 때의 안전'],['허용 통전','전류가 흐르도록 허용한'],['통전 ㄷ','전류가 흐르는 동안인 ㄷ'],['통전 방법','전지를 연결하는 방법'],['통전 전에','전류가 흐르기 전에'],['정격','규격'],['원기록','처음 기록'],['미관찰로','관찰하지 못했다고'],['미실행 이유','하지 못한 까닭'],['미실행·미관찰','하지 못했거나 관찰하지 못한 내용'],['미관찰','관찰하지 못함'],['미실행','아직 하지 않음'],['미실천','아직 실천하지 않음'],['미검토','아직 돌아보기 전'],['미확인','아직 확인하지 않은'],['전류 연결','전지 연결'],['두 전지가 직렬연결','두 전지의 직렬연결']];
export const electricityLanguage=v=>typeof v==='string'?replacements.reduce((s,[a,b])=>s.replaceAll(a,b),v):Array.isArray(v)?v.map(electricityLanguage):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,electricityLanguage(x)])):v;
const clone=x=>JSON.parse(JSON.stringify(x));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const table=(heads,rows)=>`<table class="ed-table electricity-book-table"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((v,i)=>`<${i?'td':'th'}${i?'':' scope="row"'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
const photo=m=>`<figure class="electricity-book-photo"><img src="${m.src}" alt="${esc(m.alt)}"><figcaption class="electricity-book-photo-caption">${esc(m.caption)}</figcaption></figure>`;
export function withElectricityEditorial(base){
 if(base.unit!=='c22-s62-u03'||base.pages.length!==125||base.questions.length!==128)throw Error('전기의 이용 교재 원고가 다릅니다.');
 const questions=base.questions.map(q=>{
  const next=electricityLanguage({...q,...clone(ELECTRICITY_QUESTION_PATCHES[q.no]||{})});
  if(next.options)next.given=clone(next.options);else if(next.givens)next.given=[next.givens];
  if(next.slots&&next.responseContract.parts)next.slots=clone(next.responseContract.parts);
  if(next.table&&!next.figure)next.figure='electricity-question-data-'+next.no;
  if(ELECTRICITY_QUESTION_PATCHES[q.no]&&!next.responseContract.teacherRequired){const c=next.responseContract;
   next.criteria=c.kind==='single-choice'?'조건에 맞는 보기 한 개를 고른다: '+next.answer:c.kind==='multi-choice'?'빠짐·추가·중복 없이 고른다: '+next.answer:c.kind==='ordered-term-parts'?c.parts.map(p=>p.label+' '+p.accepted.join(' 또는 ')+(p.unitRequired?' (단위 필요)':'')).join(' / ')+'. 부분별 답의 대응을 유지한다.':q.criteria;
  }
  return next;
 });
 const figures=Object.fromEntries(Object.entries(base.figures).map(([k,v])=>[k,electricityLanguage(v).replaceAll('#2456c4','#2f6b4a').replaceAll('#f5f7fb','#e9f0e7')]));
 const figureModels=electricityLanguage(base.figureModels);
 for(const[k,caption]of Object.entries({bulb:'전구 밑부분의 옆 금속과 바닥 금속 사이에는 절연 부분이 있어요. 서로 다른 두 금속 접점을 찾아보아요.',coil:'절연된 전선과 철심을 준비한 모습이에요. 아직 철심에 전선을 감아 만든 전자석의 완성 모습은 아니에요.'})){figureModels[k]={...figureModels[k],caption,credit:''};figures[k]=photo(figureModels[k]);}
 for(const[k,m]of Object.entries(figureModels))if(m.kind==='table'){figures[k]=table(m.heads,m.rows);m.caption='문제 풀이를 위한 연습 자료';}
 for(const q of questions)if(q.table&&q.figure){figures[q.figure]=table(q.table.머리,q.table.행);figureModels[q.figure]={kind:'table',heads:q.table.머리,rows:q.table.행,caption:'문제 풀이를 위한 연습 자료'};}
 figures.circuit=electricityCircuitFigure;figures.series=electricitySeriesFigure;
 figureModels.circuit={kind:'svg',model:'one-bulb-open-closed'};figureModels.series={kind:'svg',model:'two-cells-series'};
 figureModels.sources.links.push({label:'ENERGY STAR · 밝기와 전기 사용',url:'https://www.energystar.gov/products/learn-about-brightness'});
 figureModels.sources.caption='전자석의 원리와 쓰임, 전지 관리, 같은 밝기의 조명을 비교하는 방법을 알아볼 자료예요.';
 figures.sources='<div class="electricity-book-sources">'+figureModels.sources.links.map(l=>`<a href="${esc(l.url)}" target="_blank" rel="noopener noreferrer">${esc(l.label)}</a>`).join('')+`<p>${figureModels.sources.caption}</p></div>`;
 for(let start=0;start<128;start+=24){const rows=questions.slice(start,start+24);figures['electricity-quick-'+start]='<div class="electricity-quick-grid">'+[rows.slice(0,12),rows.slice(12)].filter(r=>r.length).map(r=>table(['번호','형식','정답'],r.map(q=>[q.no,q.formLabel,q.responseContract.teacherRequired?'교사 확인':q.answer]))).join('')+'</div>';}
 const conceptHints={3:'전구의 옆 금속과 바닥 금속은 왜 서로 구별해야 할까요?',16:'스위치를 열었을 때 전구에 불이 켜지지 않는 까닭을 연결 상태로 설명해요.',32:'두 전지에서 서로 이어진 극과 남은 두 극을 표시해요.',46:'전지 수에 따른 밝기를 비교할 때 같게 해야 할 조건을 써요.',61:'전자석과 영구 자석은 전지가 연결되지 않았을 때 어떤 차이가 있나요?',77:'전지 수와 연결 방향을 바꾸면 전자석의 어떤 성질을 비교할 수 있나요?',93:'손상된 전선이나 기구를 발견하면 어떻게 해야 하나요?',106:'필요한 기능을 유지하면서 전기를 덜 쓰는 방법을 설명해요.'};
 const revise=(p,i)=>{
  if(p.kind==='duplex-blank')return p;
  const[core,upper,self]=ELECTRICITY_RAIL_NOTES[i];let blocks=p.blocks.map(b=>{const n=electricityLanguage(b);if(b.type==='field'){
   n.title=fieldTitles[b.title]||n.title;
   if(n.title==='워밍업')n.hint='전구를 켜려면 전선을 어디에 연결해야 할까요? 처음 생각을 자유롭게 적어요.';
   if(n.title==='궁금한 점')n.hint='전기 회로나 전자석, 전기 사용에서 알아보고 싶은 것을 적어요.';
   if(n.title==='관찰하거나 실천한 내용')n.hint='관찰한 결과나 실천한 방법을 쓰고, 더 알아볼 점을 적어요.';
   if(n.title==='알아본 내용과 설명')n.hint='관찰·실험·조사에서 알아낸 내용을 근거와 함께 설명해요.';
   if(n.title==='개념 확인'){n.hint=conceptHints[i+1];n.lines=4;}
  }return n;});
  if(i===0)blocks.unshift({type:'table',heads:['이름','공부한 날'],rows:[['','']]});
  if(i===1)blocks=blocks.map(b=>b.type==='table'?{...b,heads:['배울 내용','해 볼 활동'],rows:[['불이 켜지는 전기 회로','전지·전구·전선을 연결하고 회로의 특징 설명하기'],['전지 한 개와 두 개의 직렬연결','같은 조건에서 전구의 밝기 비교하기'],['전자석의 성질과 쓰임','전자석을 만들어 영구 자석과 비교하고 이용 사례 조사하기'],['효율적이고 안전한 전기 사용','사용 방법을 조사하고 생활 속에서 실천하기']]}:b.type==='text'?{...b,text:'여덟 형식의128문항으로 관찰·비교·설명을 연습해요. 오른쪽 더 알아보기에서는 상위 학년의 전기와 자기 개념을 살펴보아요.'}:b);
  if(i===15)blocks=[{type:'diagram',key:'circuit'},{type:'text',text:'전지의 +극과 −극에서 전구의 서로 다른 두 접점을 거쳐 끊기지 않게 이어지면 불이 켜져요. 스위치를 열면 그 길이 끊겨 불이 꺼져요.'},{type:'table',heads:['재료','전기 회로에서의 역할'],rows:[['도체','구리·철 등과 같이 전기가 잘 통하는 물질'],['부도체','고무·플라스틱 등과 같이 전기가 잘 통하지 않는 물질']]},{type:'text',text:'전지의 두 극을 전선만으로 직접 잇지 않아요. 재료를 비교할 때는 정상인 전구·전지와 닿는 부분을 먼저 확인해요.'},{type:'field',title:'개념 확인',hint:conceptHints[16],lines:4,draw:false}];
  if(i===31)blocks=[{type:'diagram',key:'series'},{type:'text',text:'한 전지의 +극과 다른 전지의 −극을 이어 전지 두 개를 직렬연결해요. 남은 두 극을 같은 전구가 있는 회로에 연결하여 전지 한 개일 때와 비교해요.'},{type:'table',heads:['같게 둘 조건','비교할 것'],rows:[['전구·전선·관찰 위치·주변 밝기','전지 한 개와 두 개의 직렬연결에서 전구의 밝기']]},{type:'text',text:'같은 종류와 상태의 전지를 사용하고 새 전지와 헌 전지를 섞지 않아요. 전지 수와 부품의 알맞은 규격, 연결하는 시간은 교사가 점검해요.'},{type:'field',title:'개념 확인',hint:conceptHints[32],lines:4,draw:false}];
  if(i===60){const first=blocks.findIndex(b=>b.type==='table');blocks.splice(first,1);const t=blocks.find(b=>b.type==='text');t.text='철심에 절연된 전선을 같은 방향으로 감아요. 감긴 부분의 절연은 유지하고, 양 끝의 금속 부분은 교사가 준비해요. 전지에 연결해 자석의 작용을 이용하는 장치를 전자석이라고 해요. 부품과 전원, 연결 시간을 점검받은 뒤 관찰해요.';}
  if(i===76){blocks=blocks.filter(b=>b.type!=='diagram');blocks.unshift({type:'table',heads:['자석','전지 연결과 성질'],rows:[['전자석','전지를 연결하고 끊어 자석의 작용을 조절할 수 있어요.'],['영구 자석','전지를 연결하지 않아도 자석의 성질을 지녀요.']]});blocks=blocks.map(b=>b.type==='text'?{...b,text:'같은 코일과 철심에서 전지 수에 따른 세기를 비교해요. 전지의 연결 방향을 반대로 바꾼 뒤에는 같은 끝에서 나침반의 반응을 살펴 극의 변화를 알아보아요.'}:b);}
  if(i===105){const t=blocks.filter(b=>b.type==='text');t[0].text='전기를 효율적으로 쓰려면 필요한 밝기·환기·식품 보관 등의 기능과 안전을 유지하면서 낭비를 줄여요. 같은 밝기의 조명은 사용 시간과 전기 사용량을 비교해 고를 수 있어요. 생활 속에서 실천할 방법과 기간을 정하고 결과를 돌아보아요.';}
  return{...p,title:pageTitles[i],section:electricityLanguage(p.section).replace('실제 활동','탐구 활동').replace(/ · 6과15-\d+/g,''),blocks,rail:[{title:'핵심 정리',text:core},{title:'더 알아보기',text:upper},{title:'내가 정리할 것',text:self,write:5}]};
 };
 return{...base,theme:'#2f6b4a',questions,figures,figureModels,pages:base.pages.map(revise),teacherStudentPages:base.teacherStudentPages.map(revise),teacherPages:base.teacherPages.map(p=>({...electricityLanguage(p),rail:p.rail.map((r,i)=>i===1?{title:'지도할 때',text:'연결한 부분과 비교 조건을 확인하고, 전자석의 성질과 효율적이고 안전한 사용 방법을 근거로 설명하도록 도와요.'}:electricityLanguage(r))}))};
}
