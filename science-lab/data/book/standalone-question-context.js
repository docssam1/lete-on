import{BATTERY_POLARITY_CARD_VERSION,batteryPolarityCardEntries}from'./battery-polarity-card.js?v=20261115-battery-polarity-card';
import{MOTION_ELECTRICITY_REFERENCE_VERSION,motionElectricityReferenceEntries}from'./motion-electricity-reference-context.js?v=20261115-motion-electricity-reference';
import{volcanoReferenceEntries}from'./volcano-reference-context.js?v=20261115-volcano-reference-context';
import{landObservationEntries}from'./land-observation-context.js?v=20261115-land-observation-context';
export const EARTH_SURFACE_PHOTO_VERSION='20261115-earth-surface-photo';
export const REFERENCE_CONTEXT_CACHE_VERSION=BATTERY_POLARITY_CARD_VERSION;
import{biologyObservationPhotos,BIOLOGY_OBSERVATION_PHOTO_VERSION,BIOLOGY_REFERENCE_PHOTO_VERSION,BIOLOGY_COMPARISON_VERSION,BIOLOGY_COMPARISON_PROMPTS,BIOLOGY_SHAPES_NOTE}from'./biology-observation-photos.js?v=20261115-biology-comparison-photos';
export const STANDALONE_CONTEXT_VERSION='20261115-standalone-question-context';
export const OBSERVATION_CONTEXT_VERSION='20261115-observation-question-context';
export const BIOLOGY_OBSERVATION_CHOICE_VERSION='20261115-biology-photo-observations';
export const MATERIAL_OBSERVATION_CONTEXT_VERSION='20261115-material-observation-context';
export const GEOLOGY_OBSERVATION_CONTEXT_VERSION='20261115-geology-observation-context';
const clone=value=>JSON.parse(JSON.stringify(value));
const priorBiologyChoices=['갓 안쪽에 여러 주름이 보였다.','이 버섯을 먹으면 모든 병이 낫는다.','이 세균은 누구에게나 해롭다.','이 사진 하나면 모든 균류를 분류할 수 있다.','한 가닥 안에 마디가 이어져 보였다.'];
const priorBiologyExplanation='주름과 마디는 사진의 형태를 기록한 것입니다. 치료 효과·보편적 해로움·모든 생물의 분류는 추가 근거가 필요합니다.';
const choiceCache=new WeakMap();
// Keep the photographed version as a full snapshot before replacing its three inference distractors.
export function biologyObservationChoiceItems(rows,unit){
 if(unit!=='s41-u04'||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  if(q.id!=='s41-u04-b14'||q.status!=='authored'||q.sourceRef?.type!=='authored-supplement'||q.contentVersion!==BIOLOGY_OBSERVATION_PHOTO_VERSION||q.prompt!=='다음 두 사진에서 직접 본 생김새를 바르게 적은 문장 두 개를 고르세요.'||JSON.stringify(q.choices)!==JSON.stringify(priorBiologyChoices)||q.explanation!==priorBiologyExplanation||JSON.stringify(q.observationPhotos)!==JSON.stringify(biologyObservationPhotos('mushroom','spirogyra'))||q.sourceContent)return q;
  changed=true;if(choiceCache.has(q))return choiceCache.get(q);
  const current={...q,choices:[q.choices[0],'이 버섯은 비가 온 다음 날 자랐다.','이 해캄이 살던 물은 깨끗했다.','이 해캄은 따뜻한 물에서 더 잘 자란다.',q.choices[4]],explanation:'버섯의 주름과 해캄의 마디는 사진에서 직접 볼 수 있어요. 비가 언제 왔는지, 물이 깨끗했는지, 어떤 물에서 더 잘 자라는지는 이 사진만으로 알 수 없어요.',contentVersion:BIOLOGY_OBSERVATION_CHOICE_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion,snapshotKind:'full-question'}]};
  if(q.diagnosticOverride?.version===q.contentVersion)current.diagnosticOverride={...clone(q.diagnosticOverride),version:current.contentVersion};
  choiceCache.set(q,current);return current;
 });
 return changed?next:rows;
}
const bacteriaFigure='assets/bank/s41-u04/s3-q11.webp';
const bacteriaNote='세균의 네 가지 확대 사진. 오른쪽 위에는 초록색으로 표현된 길쭉한 막대 모양의 세균이 보입니다.';
// The three existing rows from career question 18, shared without loading its full manuscript.
const waterTable={머리:['상황','쓸 수 있는 물','필요한 물'],행:[['ㄱ','60 L','50 L'],['ㄴ','60 L','70 L'],['ㄷ','60 L','55 L']]};
const waterNotice='연습을 위해 만든 자료예요. 실제 지역·인물의 통계나 학생이 직접 조사한 결과, 진로 검사 결과는 아니에요.';
// Reuse season question 28's five samples without claiming an exact transit time.
const altitudeTable={머리:['시각(KST)','고도'],행:[['10:15','41°'],['11:15','53°'],['12:15','62°'],['13:15','60°'],['14:15','49°']]};
const altitudeNotice='고도를 비교하는 연습용 기록이에요. 직접 관측하거나 정밀하게 계산한 천문 자료는 아니에요. 정확한 남중 시각은 따로 주어지지 않았어요.';
const geologyHorizontal='assets/book/c22-s51-u01-source-horizontal.png',geologyBroken='assets/book/c22-s51-u01-source-broken.png';
const preparationPhoto='assets/activities/c22-s51-u03/mixing-photo-v1.webp',environmentPicture='assets/activities/c22-s61-u01/environment.webp';
export const earthSurfacePhoto=Object.freeze({figure:'assets/activities/c22-s32-u02/earth-apollo17-nasa.jpg',figureNote:'아폴로17호가 촬영한 지구. 아프리카와 주변 바다, 표면을 가리는 구름이 보입니다.',photoLabels:['우주에서 촬영한 지구'],photoCredit:'사진: NASA/JSC · Apollo17 · AS17-148-22727'});
const entries={
 ...batteryPolarityCardEntries,
 ...motionElectricityReferenceEntries,
 'c22-s32-u02-b20':{unit:'c22-s32-u02',version:1,currentVersion:EARTH_SURFACE_PHOTO_VERSION,prompt:'구름 때문에 일부 표면이 가려진 사진을 읽는 방법은 무엇인가요?',previousChoices:['흰 곳은 모두 육지라고 정해 놓는다.','안 보이는 곳에는 표면이 없다고 한다.','구름의 넓이를 바다 넓이라고 바꾼다.','한쪽 반구로 지구 전체를 확정한다.','가려진 곳은 다른 자료로 더 확인한다.'],fields:{...earthSurfacePhoto,prompt:'다음 지구 사진에는 구름에 가린 곳이 있어요. 가려진 곳을 더 알아보는 방법을 고르세요.',explanation:'구름에 가려 안 보이는 곳은 아직 표면을 확인하지 못한 부분이에요. 육지나 바다로 임의로 넣지 않고 다른 사진·지도 등으로 확인해요. 확대와 복사만으로 가려진 정보가 생기지는 않아요.'}},
 'c22-s32-u02-b24':{unit:'c22-s32-u02',version:'20261108-earth-sea-elementary',currentVersion:EARTH_SURFACE_PHOTO_VERSION,prompt:'구름이 많은 지구 사진 한 장만 보고 육지와 바다의 넓이를 알아내기 어려운 까닭을 쓰세요. 더 알아볼 방법도 설명해 보세요.',fields:{...earthSurfacePhoto,prompt:'다음 지구 사진 한 장만으로 육지와 바다의 넓이를 비교하기 어려운 까닭을 쓰세요. 더 알아볼 방법도 쓰세요.',explanation:'한 장의 사진에는 지구 뒤쪽이 빠지고 구름에 가린 부분도 있을 수 있어요. 사진을 크게 인쇄하는 것으로 해결하지 않고 전체 표면을 다룬 자료와 범례·설명을 함께 확인해요.'}},
 ...volcanoReferenceEntries,
 ...landObservationEntries,
 's41-u04-v031':{
  unit:'s41-u04',sourceType:'similar',sourceOf:{set:3,no:1},version:1,currentVersion:BIOLOGY_COMPARISON_VERSION,
  prompt:'교사가 제공한 서로 다른 빵곰팡이 사진 세 장에서 흰색·초록색·검은색 부분을 보았습니다. 기록으로 알맞은 것을 고르세요.',
  fields:{prompt:BIOLOGY_COMPARISON_PROMPTS.mold,observationPhotos:biologyObservationPhotos('moldBread','moldOrange','moldRice')},
 },
 's41-u04-v040':{
  unit:'s41-u04',sourceType:'similar',sourceOf:{set:3,no:10},version:1,currentVersion:BIOLOGY_COMPARISON_VERSION,
  prompt:'연구 사진에는 공·막대·나선 모양의 아주 작은 생물이 있고, 자료에는 종류에 따라 흙·물·몸 안에 산다고 합니다. 이 단원에서 어떤 무리를 다룬 자료인지 고르세요.',
  fields:{prompt:BIOLOGY_COMPARISON_PROMPTS.shapes,figure:'assets/bank/s41-u04/s3-q11.webp',figureNote:BIOLOGY_SHAPES_NOTE},
 },
 'c22-s62-u02-b002':{
  unit:'c22-s62-u02',version:'20261106-combustion-readable-workbook',currentVersion:MATERIAL_OBSERVATION_CONTEXT_VERSION,
  prompt:'흰 가루가 담긴 사진 한 장만 있습니다. 사진을 읽는 방법으로 알맞은 것을 고르세요.',
  fields:{prompt:'다음 사진의 흰 가루를 살펴보세요. 어떤 가루인지 알아보는 방법으로 알맞은 것을 고르세요.',figure:preparationPhoto,figureNote:'흰 가루 옆에 투명한 액체가 든 용기 두 개가 놓인 모습.'},
 },
 'c22-s62-u02-b010':{
  unit:'c22-s62-u02',version:'20261106-combustion-readable-workbook',currentVersion:MATERIAL_OBSERVATION_CONTEXT_VERSION,
  prompt:'사진을 넘어 추가 확인이 필요한 주장을 모두 고르세요. (정답 3개)',
  fields:{prompt:'다음 사진을 보고 한 말이에요. 더 확인해야 하는 말을 모두 고르세요. (정답 3개)',figure:preparationPhoto,figureNote:'흰 가루 옆에 투명한 액체가 든 용기 두 개가 놓인 모습.'},
 },
 'c22-s61-u01-b078':{
  unit:'c22-s61-u01',version:'20261104-acid-class',currentVersion:MATERIAL_OBSERVATION_CONTEXT_VERSION,preserveDiagnosticVersion:true,
  prompt:'제공된 바다 설명 사진으로 할 수 있는 말과 활용을 모두 고르세요.',
  fields:{prompt:'다음은 조개가 사는 바다 환경을 설명하는 그림이에요. 이 그림을 알맞게 활용한 것을 모두 고르세요. (정답 3개)',figure:environmentPicture,figureNote:'바닷속 바위에 조개류가 붙어 있고 주변에 해초가 보이는 설명 그림. 산성화 측정값이나 특정 장소의 피해를 기록한 자료는 아니에요.'},
 },
 'c22-s51-u01-b001':{
  unit:'c22-s51-u01',version:'20261106-geology-readable-workbook',currentVersion:GEOLOGY_OBSERVATION_CONTEXT_VERSION,
  prompt:'절벽의 지층 사진을 관찰할 때 먼저 기록할 특징은 무엇인가요?',
  fields:{prompt:'다음 지층 사진을 보세요. 직접 관찰하여 기록할 수 있는 특징을 고르세요.',figure:geologyHorizontal,figureNote:'밝고 어두운 여러 층과 경계가 보이는 지층 사진. 자료: 지필드 과학 교재.'},
 },
 'c22-s51-u01-b010':{
  unit:'c22-s51-u01',version:'20261106-geology-readable-workbook',currentVersion:GEOLOGY_OBSERVATION_CONTEXT_VERSION,
  prompt:'사진에서 층이 끊어져 서로 어긋나 있어요. 관찰한 모습을 바르게 적은 것은?',
  fields:{prompt:'다음 지층 사진을 보세요. 관찰한 모습을 바르게 적은 문장을 고르세요.',figure:geologyBroken,figureNote:'밝고 어두운 층이 이어지다가 가운데에서 끊기고 높이가 어긋나 보이는 지층 사진. 자료: 지필드 과학 교재.'},
 },
 's41-u04-v006':{
  unit:'s41-u04',sourceType:'similar',sourceOf:{set:1,no:6},version:1,currentVersion:BIOLOGY_REFERENCE_PHOTO_VERSION,
  prompt:'사진 설명에서 세균의 특징을 바르게 정리한 문장을 고르세요.',
  fields:{prompt:'다음 세균 확대 자료를 보고, 생김새를 바르게 정리한 문장을 고르세요.',figure:bacteriaFigure,figureNote:'서로 다른 모양의 세균을 보여 주는 네 칸 확대 자료. 원문 세트3 11번 그림.'},
 },
 's41-u04-v011':{
  unit:'s41-u04',sourceType:'similar',sourceOf:{set:2,no:1},version:1,currentVersion:BIOLOGY_REFERENCE_PHOTO_VERSION,
  prompt:'교사가 제공한 곰팡이 확대 사진에서 가느다란 실들이 엉킨 모습이 보입니다. 관찰 기록으로 알맞은 것을 고르세요.',
  fields:{prompt:'다음 곰팡이 확대 사진을 보세요. 관찰한 모습을 바르게 적은 것을 고르세요.',observationPhotos:biologyObservationPhotos('mold')},
 },
 's41-u04-b04':{
  unit:'s41-u04',version:'20261108-biology-elementary-bank',currentVersion:BIOLOGY_OBSERVATION_PHOTO_VERSION,preserveDiagnosticVersion:true,
  prompt:'확대 사진 두 장만 보고 생물의 실제 크기를 비교하려고 해요. 먼저 확인할 정보를 고르세요.',
  fields:{prompt:'다음 두 사진만 보고 생물의 실제 크기를 비교하려고 해요. 먼저 확인할 정보를 고르세요.',observationPhotos:biologyObservationPhotos('mushroom','spirogyra')},
 },
 's41-u04-b11':{
  unit:'s41-u04',version:'20261108-biology-elementary-bank',currentVersion:BIOLOGY_OBSERVATION_PHOTO_VERSION,preserveDiagnosticVersion:true,
  prompt:'해캄 사진에서 마디가 보였어요. 이 사진만 보고는 알 수 없는 것을 고르세요.',
  fields:{observationPhotos:biologyObservationPhotos('spirogyra')},
 },
 's41-u04-b12':{
  unit:'s41-u04',version:'20261108-biology-elementary-bank',currentVersion:BIOLOGY_OBSERVATION_PHOTO_VERSION,preserveDiagnosticVersion:true,
  prompt:'버섯 전체를 찍은 사진에서는 가는 실이 잘 보이지 않아요. 이 사진을 보고 알맞게 설명한 것을 고르세요.',
  fields:{prompt:'다음 버섯 사진에서는 가는 실이 잘 보이지 않아요. 이 사진을 보고 알맞게 설명한 것을 고르세요.',observationPhotos:biologyObservationPhotos('mushroom')},
 },
 's41-u04-b14':{
  unit:'s41-u04',version:'20261108-biology-elementary-bank',currentVersion:BIOLOGY_OBSERVATION_PHOTO_VERSION,preserveDiagnosticVersion:true,
  prompt:'사진에서 직접 본 생김새를 바르게 적은 문장 두 개를 고르세요.',
  fields:{prompt:'다음 두 사진에서 직접 본 생김새를 바르게 적은 문장 두 개를 고르세요.',observationPhotos:biologyObservationPhotos('mushroom','spirogyra')},
 },
 'c22-s62-u01-b030':{
  unit:'c22-s62-u01',version:'20261106-season-readable-workbook',currentVersion:OBSERVATION_CONTEXT_VERSION,
  prompt:'친구가 “표에서 12:15의 고도가 가장 높으니 정확히 그때 남중했어”라고 했어요. 이 기록만으로 그렇게 말할 수 있을까요?',
  fields:{givens:{조건:altitudeNotice,자료표:altitudeTable}},
 },
 'c22-s42-u01-b02':{
  unit:'c22-s42-u01',version:1,currentVersion:OBSERVATION_CONTEXT_VERSION,
  prompt:'교사가 달의 확대 사진에서 움푹 팬 둥근 지형을 가리켰습니다. 기록할 말로 알맞은 것을 고르세요.',
  fields:{prompt:'다음 달 표면 확대 사진을 보세요. 관찰한 모습을 바르게 적은 문장을 고르세요.',figure:'assets/book/c22-s42-u01-moltke-apollo10-nasa.jpg',figureNote:'달 표면의 확대 사진. NASA · Apollo 10 · Moltke 분화구.'},
 },
 's41-u04-b09':{
  unit:'s41-u04',version:'20261106-biology-readable-workbook',
  prompt:'세균의 전자 현미경 사진을 초록색으로 처리했습니다. 사진만으로 말할 수 있는 것을 고르세요.',
  fields:{prompt:'다음 확대 사진의 오른쪽 위를 보세요. 초록색은 구별하기 쉽게 입힌 색이라고 정했어요. 사진만 보고 말할 수 있는 것을 고르세요.',figure:bacteriaFigure,figureNote:bacteriaNote},
 },
 's41-u04-b16':{
  unit:'s41-u04',version:'20261106-biology-readable-workbook',
  prompt:'초록색으로 색을 입힌 세균 사진을 보고 “초록색이니 식물처럼 잎이 있다”고 적었어요. 이 기록을 어떻게 고쳐야 할까요?',
  fields:{prompt:'다음 확대 사진의 오른쪽 위를 보고 “초록색이니 식물처럼 잎이 있다”고 적었어요. 초록색은 구별하기 쉽게 입힌 색이라고 정했어요. 이 기록을 어떻게 고쳐야 할까요?',figure:bacteriaFigure,figureNote:bacteriaNote},
 },
 'c22-s62-u04-b032':{
  unit:'c22-s62-u04',version:'20261107-career-readable-workbook',
  prompt:'이 연습 자료에서 물이 부족한 까닭을 더 알아보려 해요. 물이 오는 곳·쓰이는 곳·시기와 알아볼 질문을 연결해 그리세요.',
  fields:{givens:{조건:waterNotice,자료표:waterTable}},
 },
};
const cache=new WeakMap();
export function standaloneQuestionContexts(rows,unit){
 if(!['s41-u04','c22-s62-u04','c22-s62-u01','c22-s42-u01','c22-s51-u01','c22-s62-u02','c22-s61-u01','s41-u03','c22-s32-u02','c22-s61-u02','c22-s62-u03'].includes(unit)||!Array.isArray(rows))return rows;
 let changed=false;
 const next=rows.map(q=>{
  const entry=Object.hasOwn(entries,q.id)?entries[q.id]:null;
  if(!entry||entry.unit!==unit||q.status!=='authored'||q.sourceRef?.type!==(entry.sourceType||'authored-supplement')||(entry.sourceOf&&JSON.stringify(q.sourceRef.of)!==JSON.stringify(entry.sourceOf))||(q.contentVersion||1)!==entry.version||q.prompt!==entry.prompt||(entry.previousChoices&&JSON.stringify(q.choices)!==JSON.stringify(entry.previousChoices))||q.givens!=null||q.figure||q.photoLabels||q.observationPhotos||q.sourceContent||q.visualModel)return q;
  changed=true;if(cache.has(q))return cache.get(q);
  const current={...q,...clone(entry.fields),contentVersion:entry.currentVersion||STANDALONE_CONTEXT_VERSION,previousVersions:[...(q.previousVersions?clone(q.previousVersions):[]),{...clone(q),version:q.contentVersion||1,snapshotKind:'full-question'}]};
  if(entry.preserveDiagnosticVersion&&q.diagnosticOverride?.version===(q.contentVersion||1))current.diagnosticOverride={...clone(q.diagnosticOverride),version:current.contentVersion};
  cache.set(q,current);return current;
 });
 return biologyObservationChoiceItems(changed?next:rows,unit);
}
export function withStandaloneContextClassroom(unit,mod){
 const items=standaloneQuestionContexts(mod.classroomItems,unit);
 return items===mod.classroomItems?mod:{...mod,classroomItems:items};
}
export function withCareerStandaloneContext(workbook){
 if(workbook.unit!=='c22-s62-u04')return workbook;
 const entry=entries['c22-s62-u04-b032'];let changed=false;
 const questions=workbook.questions.map(q=>{
  if(q.id!=='c22-s62-u04-w032'||q.prompt!==entry.prompt||q.given||q.givens||q.figure||q.table)return q;
  if(!workbook.figures?.['career-question-data-18'])return q;
  changed=true;
  return {...q,givens:waterNotice,given:[waterNotice],table:clone(waterTable),figure:'career-question-data-18'};
 });
 return changed?{...workbook,questions}:workbook;
}
export function withSeasonStandaloneContext(workbook){
 if(workbook.unit!=='c22-s62-u01')return workbook;
 const entry=entries['c22-s62-u01-b030'];let changed=false;
 const questions=workbook.questions.map(q=>{
  if(q.id!=='c22-s62-u01-w030'||q.prompt!==entry.prompt||q.given||q.givens||q.figure||q.table||!workbook.figures?.['season-question-data-28'])return q;
  changed=true;return {...q,givens:altitudeNotice,given:[altitudeNotice],table:clone(altitudeTable),figure:'season-question-data-28'};
 });
 return changed?{...workbook,questions}:workbook;
}
export function withGeologyStandaloneArt(art){
 if(!art?.geoHorizontal?.includes('../'+geologyHorizontal)||!art.geoShapes?.includes('../'+geologyBroken)||Object.hasOwn(art,'geoBroken'))return art;
 return {...art,geoBroken:`<figure class="ed-photo"><img src="../${geologyBroken}" alt="밝고 어두운 층이 가운데에서 끊기고 높이가 어긋나 보이는 지층 사진"><figcaption>자료: 지필드 과학 교재.</figcaption></figure>`};
}
export function withGeologyStandaloneContext(workbook){
 if(workbook.unit!=='c22-s51-u01'||!Array.isArray(workbook.questions))return workbook;
 const figures=withGeologyStandaloneArt(workbook.figures),links={'c22-s51-u01-w001':['c22-s51-u01-b001','geoHorizontal'],'c22-s51-u01-w004':['c22-s51-u01-b010','geoBroken']};let changed=false;
 const questions=workbook.questions.map(q=>{
  const link=links[q.id],entry=link&&entries[link[0]];if(!entry||q.sourceRef?.type!=='authored-supplement'||q.sourceId!==link[0]||q.prompt!==entry.prompt||q.figure||q.table||q.given||q.givens||!figures?.[link[1]])return q;
  changed=true;return {...q,prompt:entry.fields.prompt,figure:link[1]};
 });
 return changed?{...workbook,questions,figures}:workbook;
}

// Link only the reviewed authored exercises; the existing figures and answer contracts stay intact.
export function withMaterialStandaloneContext(workbook){
 if(!['c22-s62-u02','c22-s61-u01'].includes(workbook.unit)||!Array.isArray(workbook.questions))return workbook;
 const links={'c22-s62-u02-w002':['c22-s62-u02-b002','book-preparation'],'c22-s62-u02-w010':['c22-s62-u02-b010','book-preparation'],'c22-s61-u01-w078':['c22-s61-u01-b078','environment']};let changed=false;
 const questions=workbook.questions.map(q=>{
  const link=links[q.id],entry=link&&entries[link[0]];
  if(!entry||entry.unit!==workbook.unit||q.no!==Number(link[0].slice(-3))||(q.status&&q.status!=='authored')||(q.sourceRef&&q.sourceRef.type!=='authored')||q.prompt!==entry.prompt||q.figure||q.table||q.given||q.givens||!workbook.figures?.[link[1]]?.includes('../'+entry.fields.figure))return q;
  if(workbook.unit==='c22-s62-u02'?(q.status!=='authored'||q.sourceRef?.type!=='authored'||q.origin!=='independently-authored-current-curriculum'):q.origin!=='previous128')return q;
  changed=true;return {...q,prompt:entry.fields.prompt,figure:link[1]};
 });
 return changed?{...workbook,questions}:workbook;
}

export function withEarthSeaStandaloneContext(workbook){
 if(workbook.unit!=='c22-s32-u02'||!Array.isArray(workbook.questions)||!workbook.figures?.earthSeaEarthPhoto?.includes('../'+earthSurfacePhoto.figure))return workbook;
 const links={'c22-s32-u02-w009':'c22-s32-u02-b20','c22-s32-u02-w035':'c22-s32-u02-b24'};let changed=false;
 const questions=workbook.questions.map(q=>{const sourceId=links[q.id],entry=sourceId&&entries[sourceId];if(!entry||q.sourceId!==sourceId||q.sourceRef?.type!=='authored-supplement'||q.prompt!==entry.prompt||q.figure||q.given||q.givens||q.table)return q;changed=true;return {...q,prompt:entry.fields.prompt,figure:'earthSeaEarthPhoto'};});
 return changed?{...workbook,questions}:workbook;
}
