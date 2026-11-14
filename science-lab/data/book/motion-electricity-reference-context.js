import{photoFigureHtml}from'../../v2/photo-figure.js?v=20261115-biology-comparison-photos';
export const MOTION_ELECTRICITY_REFERENCE_VERSION='20261115-motion-electricity-reference';
const clone=x=>JSON.parse(JSON.stringify(x));
const plane={figure:'assets/bank/c22-s61-u02/s4-q05.webp',figureNote:'활주로 가까이에서 촬영한 비행기. 한 장의 사진에는 시간에 따른 위치 변화가 기록되어 있지 않습니다.',photoLabels:['활주로 가까이의 비행기'],photoCredit:'자료: 지필드 과학 교재'};
export const damagedCordPhoto=Object.freeze({src:'assets/book/c22-s62-u03-damaged-cord-dmahalko.jpg',label:'겉부분이 갈라진 전선',alt:'바닥에 놓인 갈색 전선의 겉부분이 여러 군데 갈라져 있고, 주변에 작은 조각들이 떨어져 있는 사진.',creator:'Dale Mahalko',sourceUrl:'https://commons.wikimedia.org/wiki/File:Plastic_lamp_cord_-_brittle_after_50_yrs.jpg',license:'CC BY-SA 3.0',licenseUrl:'https://creativecommons.org/licenses/by-sa/3.0/'});
export const motionElectricityReferenceEntries=Object.freeze({
 'c22-s61-u02-b029':{unit:'c22-s61-u02',version:'20261106-motion-readable-workbook',currentVersion:MOTION_ELECTRICITY_REFERENCE_VERSION,prompt:'내려오는 비행기의 사진 한 장으로 알맞게 말한 것을 고르세요.',previousChoices:['하늘에 있으니 위치가 변하지 않는다.','빠르기 변화는 시간별 자료로 더 확인한다.','높이가 낮아지는 방향이면 반드시 느려진다.','땅에 가까워지는 비행기는 반드시 빨라진다.','비행기이므로 언제나 일정하다.'],fields:{...plane,prompt:'다음은 활주로 가까이에서 촬영한 비행기 사진이에요. 이 사진만 보고 말할 수 있는 것을 고르세요.',explanation:'사진 한 장에는 시간에 따라 위치가 어떻게 달라졌는지 나와 있지 않아요. 빠르기가 빨라지는지 느려지는지 알려면 시간에 따른 위치나 이동 거리 자료를 더 살펴야 해요.'}},
 'c22-s62-u03-b110':{unit:'c22-s62-u03',version:'20261106-electricity-readable-workbook',currentVersion:MOTION_ELECTRICITY_REFERENCE_VERSION,preserveDiagnosticVersion:true,prompt:'손상된 전선 사진을 보고 “테이프를 붙이면 모두 해결된다”고 했습니다. 어떤 안내가 필요한가요?',fields:{observationPhotos:[clone(damagedCordPhoto)],photoLabels:[damagedCordPhoto.label],prompt:'다음은 겉부분이 손상된 전선 사진이에요. “테이프를 붙이면 모두 해결된다”는 말에 어떤 안내를 해야 할까요?'}},
});
export function withElectricityReferenceArt(art){
 if(!art||Object.hasOwn(art,'electricityDamagedCord'))return art;
 return {...art,electricityDamagedCord:photoFigureHtml(motionElectricityReferenceEntries['c22-s62-u03-b110'].fields)};
}
export function withMotionElectricalWorkbook(workbook){
 if(!['c22-s61-u02','c22-s62-u03'].includes(workbook.unit)||!Array.isArray(workbook.questions))return workbook;
 const links={'c22-s61-u02-w029':['c22-s61-u02-b029','motion-plane'],'c22-s62-u03-w110':['c22-s62-u03-b110','electricityDamagedCord']},figures=workbook.unit==='c22-s62-u03'?withElectricityReferenceArt(workbook.figures):workbook.figures;let changed=false;
 const questions=workbook.questions.map(q=>{const link=links[q.id],entry=link&&motionElectricityReferenceEntries[link[0]];if(!entry||entry.unit!==workbook.unit||q.origin!=='independently-authored-current-curriculum'||q.sourceRef?.type!=='authored'||!['authored','authored-draft'].includes(q.status)||q.prompt!==entry.prompt||q.figure||q.given||q.givens||q.table||!figures?.[link[1]])return q;
  if(workbook.unit==='c22-s61-u02'&&(!figures[link[1]].includes('../'+plane.figure)||JSON.stringify(q.choices)!==JSON.stringify(entry.previousChoices)))return q;
  changed=true;return {...q,prompt:entry.fields.prompt,...(entry.fields.explanation?{explanation:entry.fields.explanation}:{}),figure:link[1]};
 });
 return changed?{...workbook,questions,figures}:workbook;
}
