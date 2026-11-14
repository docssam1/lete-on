import{photoFigureHtml}from'../../v2/photo-figure.js?v=20261115-biology-observation-photos';
export const BIOLOGY_OBSERVATION_PHOTO_VERSION='20261115-biology-observation-photos';
export const BIOLOGY_REFERENCE_PHOTO_VERSION='20261115-biology-reference-photos';
const clone=x=>JSON.parse(JSON.stringify(x));
const photos={
 mold:{src:'assets/book/s41-u04-mold-hyphae-wdkeeper.jpg',alt:'가는 흰 실 모양 구조가 여러 방향으로 얽혀 있고 그 사이에 작은 검은 점들이 보이는 곰팡이 확대 사진.',label:'곰팡이 확대 사진',creator:'WDKeeper',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',sourceUrl:'https://commons.wikimedia.org/wiki/File:Rhizopus_stolonifer4.JPG'},
 spirogyra:{src:'assets/book/s41-u04-spirogyra-reischig.jpg',alt:'초록색의 긴 해캄 가닥 안에서 가로 경계가 이어져 보이는 현미경 사진. 왼쪽 아래에 0.1 mm 길이 기준이 있습니다.',label:'해캄의 현미경 사진',creator:'Josef Reischig',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/',sourceUrl:'https://commons.wikimedia.org/wiki/File:Spirogyra_(248_00)_Native_preparation.jpg'},
 mushroom:{src:'assets/book/s41-u04-mushroom-gills-rosser1954.jpg',alt:'나무에 자란 버섯의 갓 안쪽을 아래에서 본 사진. 여러 갓 아래에 가는 주름이 나란히 보입니다.',label:'버섯 갓 안쪽 사진',creator:'Rosser1954',license:'CC BY-SA 4.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/4.0/',sourceUrl:'https://commons.wikimedia.org/wiki/File:Pleurotus_ostreatus_(Oyster_Mushroom),_gills_from_below._Sycamore_tree_host.jpg'},
};
export function biologyObservationPhotos(...keys){if(!keys.length||keys.length>4||keys.some(key=>!Object.hasOwn(photos,key)))throw Error('관찰 사진 이름을 확인하세요.');return keys.map((key,i)=>({...clone(photos[key]),...(keys.length>1?{label:'가나다라'[i]+'. '+photos[key].label}:{})}));}
export function withBiologyObservationArt(art){
 const old=art?.biologySpirogyra;
 if(typeof old!=='string'||!old.includes('../assets/book/s41-u04-source-spirogyra.webp'))return art;
 return {...art,biologySpirogyra:photoFigureHtml({observationPhotos:biologyObservationPhotos('spirogyra')})};
}
export function withBiologyObservationWorkbook(workbook){
 if(workbook.unit!=='s41-u04')return workbook;
 const figures=withBiologyObservationArt(workbook.figures);
 return figures===workbook.figures?workbook:{...workbook,figures};
}
export function withBiologyReferenceArt(art){
 if(!art?.biologyBacteria?.includes('../assets/bank/s41-u04/s3-q11.webp')||Object.hasOwn(art,'biologyMoldHyphae'))return art;
 return {...art,biologyMoldHyphae:photoFigureHtml({observationPhotos:biologyObservationPhotos('mold')})};
}
export function withBiologyReferenceWorkbook(workbook){
 if(workbook.unit!=='s41-u04'||!Array.isArray(workbook.questions))return workbook;
 const entries={
  's41-u04-w004':{sourceId:'s41-u04-v006',previous:'사진 설명에서 세균의 특징을 바르게 정리한 문장을 고르세요.',prompt:'다음 세균 확대 자료를 보고, 생김새를 바르게 정리한 문장을 고르세요.',figure:'biologyBacteria'},
  's41-u04-w005':{sourceId:'s41-u04-v011',previous:'선생님이 보여 준 곰팡이 확대 사진에서 가는 실이 엉켜 있는 모습이 보여요. 관찰한 모습을 바르게 적은 것을 고르세요.',prompt:'다음 곰팡이 확대 사진을 보세요. 관찰한 모습을 바르게 적은 것을 고르세요.',figure:'biologyMoldHyphae'},
 };
 const figures=withBiologyReferenceArt(workbook.figures);let changed=false;
 const questions=workbook.questions.map(q=>{
  const e=entries[q.id];if(!e||q.sourceId!==e.sourceId||q.prompt!==e.previous||q.figure||q.table||q.given||q.givens||!figures?.[e.figure])return q;
  changed=true;return {...q,prompt:e.prompt,figure:e.figure};
 });
 return changed?{...workbook,questions,figures}:workbook;
}
