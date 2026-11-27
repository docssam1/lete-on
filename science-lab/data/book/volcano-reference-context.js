import{photoFigureHtml}from'../../v2/photo-figure.js?v=20261115-biology-comparison-photos';
export const VOLCANO_REFERENCE_VERSION='20261115-volcano-reference-context';
const clone=x=>JSON.parse(JSON.stringify(x));
export const volcanoFormationSources=Object.freeze([
 {title:'미국 지질 조사국 · 킬라우에아산의 지질과 역사',url:'https://www.usgs.gov/volcanoes/kilauea/science/geology-and-history-kilauea'},
 {title:'베수비오 국립공원 · 지질과 화산 활동',url:'https://www.parconazionaledelvesuvio.it/en/the-volcano/geology-and-vulcanology/'},
]);
export const volcanoFormationTable=Object.freeze({머리:['산','조사한 내용'],행:[['킬라우에아산','여러 차례 흘러나온 용암 등이 쌓여 만들어졌어요.'],['베수비오산','여러 차례 나온 용암과 화산재 등이 쌓여 만들어졌어요.']]});
const picture={figure:'assets/bank/s41-u03/s3-q06.webp',figureNote:'왼쪽은 넓게 움푹 팬 곳이 보이는 킬라우에아산, 오른쪽은 꼭대기의 둥글게 팬 곳과 비탈이 보이는 베수비오산 사진.',photoLabels:['킬라우에아산','베수비오산'],photoCredit:'사진: 지필드 과학 교재'};
const formationPicture={...picture,photoCredit:picture.photoCredit+' · 조사 내용: 미국 지질 조사국·베수비오 국립공원'};
export const volcanoReferenceEntries=Object.freeze({
 's41-u03-v026':{
  unit:'s41-u03',sourceType:'similar',sourceOf:{set:2,no:6},version:1,currentVersion:VOLCANO_REFERENCE_VERSION,
  prompt:'화산 사진 세 장의 모양이 서로 달랐습니다. 이 자료를 읽은 설명으로 알맞은 것을 고르세요.',
  previousChoices:['화산은 모두 같은 높이를 가져야 한다.','화산의 모양은 서로 다를 수 있다.','화산은 모두 한 개의 뾰족한 봉우리다.','화산은 모두 분화구에 물이 차 있다.','화산은 모두 지금 용암이 흐르고 있다.'],
  fields:{...picture,prompt:'다음 두 화산 사진을 보고 바르게 설명한 것을 고르세요.',explanation:'두 사진에서는 꼭대기 주변의 생김새와 비탈의 모습이 서로 달라요. 화산의 모양이 모두 같다고 할 수는 없어요.'},
 },
 's41-u03-v068':{
  unit:'s41-u03',sourceType:'similar',sourceOf:{set:4,no:8},version:1,currentVersion:VOLCANO_REFERENCE_VERSION,
  prompt:'사진의 겉모양 대신 형성 자료를 확인해야 하는 까닭으로 알맞은 것을 고르세요.',
  previousChoices:['뾰족한 산은 모두 마그마 분출로 형성되기 때문이다.','분화구에 물이 있는 산만 화산에 포함되기 때문이다.','연기가 없는 산은 모두 물의 퇴적으로 형성되기 때문이다.','모양이 달라도 마그마 분출로 생긴 화산이기 때문이다.','높이가 같은 산들은 모두 같은 과정으로 생기기 때문이다.'],
  fields:{...formationPicture,prompt:'다음 사진과 조사 자료를 함께 읽어 보세요. 모양이 다른 두 산을 모두 화산이라고 하는 까닭을 고르세요.',givens:{조사자료:clone(volcanoFormationTable)},explanation:'모양이 달라도 두 산의 조사 자료에는 용암 등 화산 분출물이 쌓여 만들어졌다고 쓰여 있어요. 땅속 마그마가 지표로 분출해 만들어진 지형을 화산이라고 해요.'},
 },
});
export function withVolcanoReferenceArt(art){
 if(!art?.volcano?.includes('../'+picture.figure)||Object.hasOwn(art,'groundVolcanoPhotos')||Object.hasOwn(art,'groundVolcanoFormation'))return art;
 return {...art,groundVolcanoPhotos:photoFigureHtml(picture),groundVolcanoFormation:photoFigureHtml(formationPicture)};
}
export function withVolcanoReferenceWorkbook(workbook){
 if(workbook.unit!=='s41-u03'||!Array.isArray(workbook.questions))return workbook;
 const links={'s41-u03-w024':['s41-u03-v026','groundVolcanoPhotos'],'s41-u03-w026':['s41-u03-v068','groundVolcanoFormation']},figures=withVolcanoReferenceArt(workbook.figures);let changed=false;
 const questions=workbook.questions.map(q=>{
  const link=links[q.id],e=link&&volcanoReferenceEntries[link[0]];
  if(!e||q.sourceId!==link[0]||q.sourceRef?.type!=='similar'||JSON.stringify(q.sourceRef.of)!==JSON.stringify(e.sourceOf)||q.prompt!==e.prompt||!Array.isArray(q.choices)||JSON.stringify([...q.choices].sort())!==JSON.stringify([...e.previousChoices].sort())||q.figure||q.given||q.givens||q.table||!figures?.[link[1]])return q;
  changed=true;return {...q,prompt:e.fields.prompt,explanation:e.fields.explanation,figure:link[1],...(q.id==='s41-u03-w026'?{given:volcanoFormationTable.행.map(([name,text])=>name+': '+text)}:{})};
 });
 if(!changed)return workbook;
 const directions=pages=>pages?.map(page=>{
  if(!page.blocks?.some(b=>b.type==='questions'&&b.ids?.includes('s41-u03-w026')))return page;
  let edited=false;const rail=(page.rail||[]).map(note=>{if(note.title!=='내가 정리할 것'||note.text!=='관측 자료에서 직접 알 수 있는 내용을 쓰세요. 어떻게 만들어졌는지 알아야 설명할 수 있는 내용도 따로 적으세요.')return note;edited=true;return {...note,text:'사진에서 보이는 모습과 조사 자료로 알아본 형성 과정을 나누어 정리하세요.'};});return edited?{...page,rail}:page;
 });
 return {...workbook,questions,figures,pages:directions(workbook.pages),teacherStudentPages:directions(workbook.teacherStudentPages)};
}
