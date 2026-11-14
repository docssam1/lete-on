import{photoFigureHtml}from'../../v2/photo-figure.js?v=20261115-biology-observation-photos';
export const BIOLOGY_OBSERVATION_PHOTO_VERSION='20261115-biology-observation-photos';
const clone=x=>JSON.parse(JSON.stringify(x));
const photos={
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
