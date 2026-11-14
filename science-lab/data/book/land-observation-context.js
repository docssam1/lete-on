import{photoFigureHtml}from'../../v2/photo-figure.js?v=20261115-biology-comparison-photos';
export const LAND_OBSERVATION_CONTEXT_VERSION='20261115-land-observation-context';
const clone=x=>JSON.parse(JSON.stringify(x));
const runoff={figure:'assets/book/s41-u03-runoff-before-after-v1.png',figureNote:'흙 언덕의 변화를 나타낸 두 설명 그림. 왼쪽은 색 모래가 꼭대기에만 있고, 오른쪽은 흙 표면에 홈이 파이고 아래 평평한 곳에도 색 모래가 모여 있습니다.',photoLabels:['물을 흘리기 전','물을 흘린 뒤'],photoCredit:'흐르는 물에 의한 흙 언덕의 변화를 설명하는 그림'};
const river={figure:'assets/bank/s41-u03/s3-q04.webp',figureNote:'푸른 물 옆에 밝은색 부분과 나무가 있는 강 주변의 사진.',photoLabels:['강 주변의 모습'],photoCredit:'자료: 지필드 과학 교재'};
const make=(sourceType,sourceOf,version,prompt,previousChoices,presentation,nextPrompt,replacements,explanation)=>({unit:'s41-u03',sourceType,...(sourceOf?{sourceOf}:{}),version,currentVersion:LAND_OBSERVATION_CONTEXT_VERSION,preserveDiagnosticVersion:true,prompt,previousChoices,choiceReplacements:replacements,fields:{...clone(presentation),prompt:nextPrompt,choices:previousChoices.map(x=>replacements[x]||x),explanation}});
export const landObservationEntries=Object.freeze({
 's41-u03-v001':make('similar',{set:1,no:1},1,
  '색 모래를 흙 언덕 꼭대기에만 놓고 물을 흘렸습니다. 뒤쪽 사진을 처음 사진과 비교할 때 물이 흙을 옮겼다는 가장 알맞은 증거는 무엇입니까?',
  ['꼭대기의 색 모래가 처음 위치에만 남았다.','색 모래의 색 이름을 처음과 다르게 적었다.','처음 없던 색 모래가 아래 평평한 곳에 모였다.','물을 붓기 전에 아래쪽 모래를 따로 보탰다.','물을 흘리지 않은 사진만 나란히 놓았다.'],runoff,
  '다음은 흙 언덕에 물을 흘리기 전과 뒤를 나타낸 설명 그림이에요. 물이 흙을 옮겼다는 증거를 고르세요.',
  {'물을 흘리지 않은 사진만 나란히 놓았다.':'물을 흘리지 않은 그림만 나란히 놓았다.'},
  '처음 그림의 꼭대기에 있던 색 모래가 뒤 그림에서는 아래 평평한 곳에도 모여 있어요. 물이 흙과 모래를 옮겨 쌓는 모습을 나타낸 것이에요.'),
 's41-u03-b27':make('authored-supplement',null,'20261108-land-elementary',
  '물길 사진에서 침식으로 흙이 깎였다는 것을 알 수 있는 모습을 고르세요.',
  ['다른 장소에서 쓰던 흙을 사진 옆에 놓았다.','물을 붓기 전 흙의 이름표를 다시 붙였다.','모형을 본 학생이 재미있었다고 말하였다.','처음 표시한 흙 표면보다 깊은 홈이 생겼다.','물길의 예상 그림에 깊은 홈을 그려 넣었다.'],runoff,
  '다음 두 설명 그림을 비교해 보세요. 물이 흙을 깎았다는 것을 알 수 있는 모습을 고르세요.',
  {'다른 장소에서 쓰던 흙을 사진 옆에 놓았다.':'다른 장소에서 쓰던 흙을 그림 옆에 놓았다.','처음 표시한 흙 표면보다 깊은 홈이 생겼다.':'처음 그림에는 없던 깊은 홈이 흙 표면에 생겼다.'},
  '두 설명 그림에서 흙 표면에 없던 홈이 생긴 모습은 침식을 나타내요. 예상이나 소감, 따로 가져온 흙은 이 변화의 근거가 아니에요.'),
 's41-u03-b30':make('authored-supplement',null,1,
  '강 사진 한 장만으로 알기 어려운 것을 고르세요.',
  ['사진에 보이는 큰 바위의 존재','사진에 보이는 모래밭의 위치','그 장소에서 한 해 동안 깎인 흙의 양','사진에 드러난 물길의 생김새','사진 속 물가 주변에 나무가 있는지'],river,
  '다음 강 사진 한 장만 보고 알기 어려운 것을 고르세요.',
  {'사진에 보이는 큰 바위의 존재':'사진에서 물이 푸르게 보이는 부분','사진에 보이는 모래밭의 위치':'물가에서 밝게 보이는 부분의 위치'},
  '한 해 동안의 변화량은 서로 다른 시점의 조사와 측정이 필요해요. 사진에서 보이는 특징과 시간에 따른 측정값을 나누어요.'),
});
export function withLandObservationArt(art){
 if(!art?.groundRiver?.includes('../'+river.figure)||!art.groundOpener?.includes('s41-u03-photo-preparation.webp')||Object.hasOwn(art,'groundRunoffComparison')||Object.hasOwn(art,'groundRiverObservation'))return art;
 return {...art,groundRunoffComparison:photoFigureHtml(runoff),groundRiverObservation:photoFigureHtml(river)};
}
export function withLandObservationWorkbook(workbook){
 if(workbook.unit!=='s41-u03'||!Array.isArray(workbook.questions))return workbook;
 const links={'s41-u03-w001':['s41-u03-v001','groundRunoffComparison'],'s41-u03-w009':['s41-u03-b27','groundRunoffComparison'],'s41-u03-w010':['s41-u03-b30','groundRiverObservation']},figures=withLandObservationArt(workbook.figures);let changed=false;
 const questions=workbook.questions.map(q=>{
  const link=links[q.id],e=link&&landObservationEntries[link[0]];
  if(!e||q.sourceId!==link[0]||q.sourceRef?.type!==e.sourceType||(e.sourceOf&&JSON.stringify(q.sourceRef.of)!==JSON.stringify(e.sourceOf))||q.prompt!==e.prompt||!Array.isArray(q.choices)||!Number.isInteger(q.key)||q.figure||q.given||q.givens||q.table||!figures?.[link[1]]||JSON.stringify([...q.choices].sort())!==JSON.stringify([...e.previousChoices].sort()))return q;
  changed=true;const choices=q.choices.map(x=>e.choiceReplacements[x]||x);return {...q,prompt:e.fields.prompt,choices,explanation:e.fields.explanation,answer:'①②③④⑤'[q.key]+' '+choices[q.key],figure:link[1]};
 });
 if(!changed)return workbook;
 const summaries=pages=>pages?.map(page=>{
  if(!page.blocks?.some(b=>b.type==='questions'&&b.ids?.includes('s41-u03-w009')&&b.ids.includes('s41-u03-w010')))return page;
  let edited=false;const rail=page.rail.map(note=>{if(note.title!=='핵심 정리'||note.text!=='사진에 보이는 파임과 사진에 없는 속도 자료를 구별해요.')return note;edited=true;return {...note,text:'설명 그림에서 흙이 깎인 곳을 살피고, 강 사진의 모습과 시간에 따른 변화량을 구별해요.'};});return edited?{...page,rail}:page;
 });
 return {...workbook,questions,figures,pages:summaries(workbook.pages),teacherStudentPages:summaries(workbook.teacherStudentPages)};
}
