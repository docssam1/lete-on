import{questionPatches as SEASON_QUESTION_PATCHES,railNotes as SEASON_RAIL_NOTES,pageTitles as SEASON_PAGE_TITLES,fieldTitles as FIELD_TITLES}from'./c22-s62-u01.editorial-data.js?v=20261104-season-book';
import{altitudeDevice,altitudeDeviceModel}from'./c22-s62-u01.diagrams.js?v=20261104-season-book';
export{SEASON_QUESTION_PATCHES,SEASON_RAIL_NOTES,SEASON_PAGE_TITLES};
export const seasonLanguage=v=>typeof v==='string'?v.replaceAll('근삿낮길이','낮의 길이(근삿값)').replaceAll('낮길이','낮의 길이').replaceAll('단위면적','단위 면적').replaceAll('창하단','창문 아래쪽').replaceAll('남향 벽','남쪽을 향한 벽'):Array.isArray(v)?v.map(seasonLanguage):v&&typeof v==='object'?Object.fromEntries(Object.entries(v).map(([k,x])=>[k,seasonLanguage(x)])):v;
const clone=v=>JSON.parse(JSON.stringify(v));
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const table=(heads,rows)=>`<table class="ed-table season-book-table"><thead><tr>${heads.map(h=>`<th scope="col">${esc(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(row=>`<tr>${row.map((v,i)=>`<${i?'td':'th'}${i?'':' scope="row"'}>${esc(v)}</${i?'td':'th'}>`).join('')}</tr>`).join('')}</tbody></table>`;
export function withSeasonEditorial(base){
 if(base.unit!=='c22-s62-u01'||base.pages.length!==135||base.questions.length!==128)throw Error('계절의 변화 교재 원고가 다릅니다.');
 const questions=base.questions.map(q=>{const revised=seasonLanguage({...q,...clone(SEASON_QUESTION_PATCHES[q.no]||{})});if(revised.options)revised.given=clone(revised.options);if(revised.slots&&revised.responseContract.parts)revised.slots=clone(revised.responseContract.parts);return revised;});
 const figures=Object.fromEntries(Object.entries(base.figures).map(([k,v])=>[k,seasonLanguage(v).replaceAll('#2456c4','#2f6b4a').replaceAll('#f5f7fb','#e9f0e7')]));
 figures.altitudeDevice=altitudeDevice;
 const materialsCaption='받침판·막대·실·테이프·연필이에요. 각도기·자·기온계도 준비해요.';
 figures.materials=figures.materials.replace(/<p class="season-book-photo-caption">[\s\S]*?<\/p>/,`<p class="season-book-photo-caption">${materialsCaption}</p>`);
 const q124=questions[123];figures[q124.figure]=table(q124.table.머리,q124.table.행);
 for(let start=0;start<128;start+=24){const rows=questions.slice(start,start+24);figures['season-quick-'+start]='<div class="season-quick-grid">'+[rows.slice(0,12),rows.slice(12)].filter(r=>r.length).map(r=>table(['번호','형식','정답'],r.map(q=>[q.no,q.formLabel,q.responseContract.teacherRequired?'교사 확인':q.answer]))).join('')+'</div>';}
 const revise=(p,i)=>{
  if(p.kind==='duplex-blank')return p;
  const[core,upper,self]=SEASON_RAIL_NOTES[i];
  const blocks=p.blocks.map(b=>{const next=seasonLanguage(b);if(b.type==='field'){next.title=FIELD_TITLES[b.title]||next.title;if(next.title==='워밍업')next.hint='여름과 겨울에는 햇빛과 그림자가 어떻게 다를까요? 처음 생각을 자유롭게 적어요.';if(next.title==='궁금한 점')next.hint='측정이나 모형실험으로 알아보고 싶은 계절의 변화를 적어요.';}return next;});
  if(i===0)blocks.unshift({type:'table',heads:['이름','공부한 날'],rows:[['','']]});
  if(i===1)for(const b of blocks){
   if(b.type==='table')b.rows=b.rows.map(row=>row.map(cell=>typeof cell==='string'?cell.replace('같은 방향의 자전축으로 공전해요','자전축이 기울어진 채 공전해요'):cell));
   if(b.type==='text')b.text='여덟 가지 형식으로 128문항을 풀어요. 오른쪽의 핵심 정리와 더 알아보기를 읽고, 내가 정리할 것에 생각을 적어요. 답이 여러 개인 문항은 각 답을 나누어 쓰고, 그림에는 이름표와 설명을 붙여요.';
  }
  if(i===2)blocks.splice(0,1,{type:'diagram',key:'altitudeDevice'});
  return{...p,title:SEASON_PAGE_TITLES[i].replace(/(?:같은 방향의|기울어진) 자전축으로 공전해요/g,'자전축이 기울어진 채 공전해요'),section:seasonLanguage(p.section).replace('실제 활동','탐구 활동'),blocks,rail:[{title:'핵심 정리',text:core.replace('기울어진 자전축을 유지한 공전으로 고도·낮의 길이가 달라져 받는 태양 에너지에 차이가 생겨요.','지구가 자전축이 기울어진 채 공전하면 태양의 남중 고도와 낮의 길이가 달라져 받는 태양 에너지에 차이가 생겨요.')},{title:'더 알아보기',text:upper},{title:'내가 정리할 것',text:self,write:5}]};
 };
 const teacherPages=base.teacherPages.map(p=>({...p,blocks:seasonLanguage(p.blocks),rail:p.rail.map((r,i)=>i===1?{...r,title:'지도할 때',text:'관측 장소와 시각, 수평·수직 기준을 살펴보고 고도·그림자·기온 또는 계절의 두 관계를 설명하도록 도와요.'}:seasonLanguage(r))}));
 const figureModels={...seasonLanguage(base.figureModels),altitudeDevice:altitudeDeviceModel};figureModels.materials={...figureModels.materials,caption:materialsCaption,credit:''};figureModels[q124.figure]={...figureModels[q124.figure],heads:q124.table.머리,rows:q124.table.행};
 return{...base,theme:'#2f6b4a',questions,figures,figureModels,pages:base.pages.map(revise),teacherStudentPages:base.teacherStudentPages.map(revise),teacherPages};
}

// Student concept/observation guidance only; preserve source figures, values and all questions.
export const SEASON_CONCEPT_VERSION='20261105-season-concept-language';
const seasonConceptTables=[
 {
  "page": 16,
  "before": [
   [
    "같은 막대",
    "높이·방향을 바꾸지 않는 비교 대상"
   ],
   [
    "고도와 그림자",
    "같은 수평면의 수직 막대에서 고도가 높을수록 그림자가 짧아지는 관계"
   ],
   [
    "반복 읽기",
    "같은 설정에서 다시 읽어 차이와 기준을 확인하는 일"
   ]
  ],
  "after": [
   [
    "비교할 막대",
    "관찰하는 동안 막대의 높이와 세운 방향을 바꾸지 않아요."
   ],
   [
    "태양 고도와 그림자 길이",
    "같은 수평면에 수직으로 세운 막대는 태양 고도가 높을수록 그림자가 짧아요."
   ],
   [
    "다시 측정하기",
    "같은 조건에서 값을 다시 읽고 눈금을 읽은 기준도 확인해요."
   ]
  ]
 },
 {
  "page": 34,
  "before": [
   [
    "기온",
    "통풍되는 그늘에서 읽는 공기의 온도"
   ],
   [
    "최고 시각",
    "각 자료에서 가장 큰 기록이 나온 시각"
   ],
   [
    "시간차",
    "시계 시각을 분 단위로 바꾸어 비교한 차이"
   ]
  ],
  "after": [
   [
    "기온",
    "공기의 온도예요. 햇빛이 직접 닿지 않고 바람이 통하는 곳에서 재요."
   ],
   [
    "최고값의 시각",
    "태양 고도와 기온에서 가장 큰 값이 나타난 시각을 각각 찾아요."
   ],
   [
    "시간차",
    "두 시각 사이에 지난 시간이에요. 시간과 분을 구별하여 구해요."
   ]
  ]
 },
 {
  "page": 52,
  "before": [
   [
    "일출·일몰",
    "해가 뜨고 지는 시각"
   ],
   [
    "낮의 길이",
    "일출부터 일몰까지의 시간"
   ],
   [
    "표시 정밀도",
    "분 단위 시각과 따로 계산한 낮의 길이가 조금 다를 수 있는 특성"
   ]
  ],
  "after": [
   [
    "일출 시각·일몰 시각",
    "해가 뜨고 지는 시각이에요."
   ],
   [
    "낮의 길이",
    "같은 날 해가 뜬 때부터 질 때까지의 시간이에요."
   ],
   [
    "표의 시각",
    "이 표의 일출·일몰 시각은 분 단위로 나타냈어요."
   ]
  ]
 },
 {
  "page": 70,
  "before": [
   [
    "남중 고도",
    "태양이 남쪽에 왔을 때의 고도"
   ],
   [
    "같은 장소 비교",
    "위도·경도 기준을 맞추고 날짜를 바꾼 비교"
   ],
   [
    "계절 경향",
    "여러 조건 속에서 계절별로 나타나는 일반적 관계"
   ]
  ],
  "after": [
   [
    "남중 고도",
    "우리나라에서 태양이 남쪽 하늘에 왔을 때의 고도예요."
   ],
   [
    "같은 장소의 계절별 비교",
    "장소를 같게 하고 날짜를 달리하여 남중 고도와 낮의 길이를 비교해요."
   ],
   [
    "계절에 따른 관계",
    "우리나라에서는 여름에 태양의 남중 고도가 높고 낮의 길이가 길어요."
   ]
  ]
 },
 {
  "page": 88,
  "before": [
   [
    "빛의 총량",
    "비교에서 같게 맞춘 전체 빛"
   ],
   [
    "단위 넓이",
    "한 칸처럼 같은 크기로 나눈 면적"
   ],
   [
    "빛 받는 각",
    "같은 양의 빛이 퍼지는 면적을 바꾸는 조건"
   ]
  ],
  "after": [
   [
    "비교할 빛의 양",
    "빛의 양은 같게 하고 비추는 각도를 달리하여 비교해요."
   ],
   [
    "단위 넓이",
    "한 칸처럼 비교를 위해 같게 정한 넓이예요."
   ],
   [
    "빛이 비추는 각도",
    "같은 양의 빛이라도 비스듬히 비추면 더 넓게 퍼져요."
   ]
  ]
 },
 {
  "page": 103,
  "before": [
   [
    "자전축 기울기",
    "지구의 자전축이 공전 궤도면의 수직 방향에서 기울어진 상태"
   ],
   [
    "방향 유지",
    "공전 중 축이 우주에서 거의 같은 방향을 향하는 조건"
   ],
   [
    "모형 비교",
    "수직 축과 기울어진 축에서 같은 지역의 남중을 맞춰 살피는 방법"
   ]
  ],
  "after": [
   [
    "자전축의 기울기",
    "지구의 자전축이 공전 궤도면에 수직인 방향에서 기울어져 있어요."
   ],
   [
    "자전축의 방향",
    "지구가 공전하는 동안 자전축은 거의 같은 방향을 향해요."
   ],
   [
    "모형에서 같게 할 조건",
    "광원과 관찰할 지역을 같게 하고, 각 모형에서 남중할 때를 비교해요."
   ]
  ]
 },
 {
  "page": 117,
  "before": [
   [
    "주장",
    "자료로 설명하려는 계절 관계"
   ],
   [
    "근거",
    "같은 장소·조건이 드러난 고도와 낮의 길이의 값"
   ],
   [
    "설명 보완",
    "원기록을 보존하고 질문에 맞춰 근거와 설명을 다시 확인하는 일"
   ]
  ],
  "after": [
   [
    "주장",
    "자료를 보고 계절의 변화에 대해 설명하려는 생각이에요."
   ],
   [
    "근거",
    "같은 장소에서 살핀 태양 고도와 낮의 길이 등의 자료예요."
   ],
   [
    "설명 고치기",
    "기록한 값은 그대로 두고, 질문에 맞춰 근거와 설명을 다시 살펴요."
   ]
  ]
 }
];
const seasonConceptRowsByText=new Map(seasonConceptTables.map(({before,after})=>[JSON.stringify(before),after]));
const seasonConceptText=new Map([["표시된 일몰−일출은 낮의 길이(근삿값)예요. 사이트가 따로 표시한 낮의 길이와 봄·겨울에는 1분 차이가 있어요. 두 값을 고치거나 합치지 않아요.", "여기서는 표의 일몰 시각에서 일출 시각을 빼서 낮의 길이(근삿값)를 구해요. 누리집이 따로 보여 주는 낮의 길이는 봄·겨울 자료에서 1분 차이가 나요. 두 값은 구별하여 적어요."], ["사이트 낮의 길이와 표시 시각의 뺄셈을 기록에서 어떻게 구별할까요?", "누리집이 보여 준 낮의 길이와 내가 계산한 낮의 길이를 어떻게 구별해 적을까요?"]]);
export function withSeasonConceptLanguage(workbook){
 if(workbook.unit!=='c22-s62-u01')return workbook;
 const block=value=>{
  if(value.type==='table'&&value.heads?.join('|')==='낱말|이번 공부에서의 뜻'){const rows=seasonConceptRowsByText.get(JSON.stringify(value.rows));if(rows)return {...value,heads:['살펴볼 내용','뜻과 확인할 점'],rows:rows.map(row=>[...row])};}
  if(value.type==='text'&&seasonConceptText.has(value.text))return {...value,text:seasonConceptText.get(value.text)};
  if(value.type==='field'&&seasonConceptText.has(value.hint))return {...value,hint:seasonConceptText.get(value.hint)};
  return value;
 };
 const revise=page=>page.kind==='duplex-blank'?page:{...page,blocks:page.blocks.map(block)};
 return {...workbook,pages:workbook.pages.map(revise),...(workbook.teacherStudentPages?{teacherStudentPages:workbook.teacherStudentPages.map(revise)}:{})};
}
