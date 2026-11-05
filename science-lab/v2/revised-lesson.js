import{termParticleCurrentItems,guidanceParticleCurrentItems}from'../data/book/term-particle-language.js?v=20261105-guidance-particles';
import{observationCurrentItems}from'../data/book/observation-language.js';
import{mountCareerCompare}from'./lab-career-compare.js?v=20261104-student-science-language';
import{careerCompareValues,validCareerCompareRow}from'./career-compare-model.js?v=20261104-student-science-language';
import{inquiry as careerInquiry}from'../data/activities/c22-s62-u04.inquiry.js?v=20261104-career-class';
import{mountElectricityCompare}from'./lab-electricity-compare.js?v=20261104-student-science-language';
import{electricityCompareValues,validElectricityCompareRow}from'./electricity-compare-model.js?v=20261104-student-science-language';
import{inquiry as electricityInquiry}from'../data/activities/c22-s62-u03.inquiry.js?v=20261104-electricity-class';
import{mountCombustionCompare}from'./lab-combustion-compare.js?v=20261104-combustion-class';
import{combustionCompareValues,validCombustionCompareRow}from'./combustion-compare-model.js';
import{inquiry as combustionInquiry}from'../data/activities/c22-s62-u02.inquiry.js?v=20261104-combustion-class';
import{mountSeasonCompare}from'./lab-season-compare.js?v=20261104-season-class';
import{seasonCompareValues,validSeasonCompareRow}from'./season-compare-model.js';
import{inquiry as seasonInquiry}from'../data/activities/c22-s62-u01.inquiry.js?v=20261104-season-class';
import{mountEarthMotionCompare}from'./lab-earth-motion-compare.js?v=20261104-earth-motion-class';
import{earthMotionCompareValues,validEarthMotionCompareRow}from'./earth-motion-compare-model.js';
import{inquiry as earthMotionInquiry}from'../data/activities/c22-s61-u04.inquiry.js?v=20261104-earth-motion-class';
import{mountPlantStructureCompare}from'./lab-plant-structure-compare.js?v=20261104-plant-structure-class';
import{plantStructureCompareValues,validPlantStructureCompareRow}from'./plant-structure-compare-model.js';
import{inquiry as plantStructureInquiry}from'../data/activities/c22-s61-u03.inquiry.js?v=20261104-plant-structure-class';
import{mountMotionCompare}from'./lab-motion-compare.js?v=20261104-motion-class';
import{motionCompareValues,validMotionCompareRow}from'./motion-compare-model.js';
import{inquiry as motionInquiry}from'../data/activities/c22-s61-u02.inquiry.js?v=20261104-motion-class';
// 검수한 사고력 수업만 선택 적용한다. 원래 실제 활동·기록 교재는 그대로 둔다.
import {revisedTextbook} from './revised-textbook.js?v=20261105-plant-observation-questions';
import {FORCE_PREDICTIONS} from './force-model.js';
import {mountAnimalCompare} from './lab-animal-compare.js';
import {classifyRowValues,validClassifyRow} from './animal-classify.js';
import {mountPlantCompare} from './lab-plant-compare.js';
import {leafRowValues,validLeafCompareRow} from './plant-classify.js';
import {mountLifeCompare} from './lab-life-compare.js';
import {lifeCompareValues,validLifeCompareRow} from './life-compare-model.js';
import {mountEcologyCompare} from './lab-ecology-compare.js';
import {ecologyCompareValues,validEcologyCompareRow} from './ecology-compare-model.js';
import {mountMaterialCompare} from './lab-material-compare.js';
import {materialCompareValues,validMaterialCompareRow} from './material-compare-model.js';
import {mountEarthSeaCompare} from './lab-earth-sea-compare.js';
import {earthSeaCompareValues,validEarthSeaCompareRow} from './earth-sea-compare-model.js';
import {mountSoundCompare} from './lab-sound-compare.js';
import {soundCompareValues,validSoundCompareRow} from './sound-compare-model.js';
import {mountInfectionCompare} from './lab-infection-compare.js';
import {infectionCompareValues,validInfectionCompareRow} from './infection-compare-model.js';
import {mountClimateCompare} from './lab-climate-compare.js';
import {climateCompareValues,validClimateCompareRow} from './climate-compare-model.js';
import {mountSkyCompare} from './lab-sky-compare.js';
import {skyCompareValues,validSkyCompareRow} from './sky-compare-model.js';
import {mountWaterCompare} from './lab-water-compare.js';
import {waterCompareValues,validWaterCompareRow} from './water-compare-model.js';
import {mountSolutionCompare} from './lab-solution-compare.js';
import {solutionCompareValues,validSolutionCompareRow} from './solution-compare-model.js';
import {mountGroundCompare} from './lab-ground-compare.js';
import {groundCompareValues,validGroundCompareRow} from './ground-compare-model.js';
import {mountBiologyCompare} from './lab-biology-compare.js';
import {biologyCompareValues,validBiologyCompareRow,biologyBreadProgress} from './biology-compare-model.js';
import {mountMagnetCompare} from './lab-magnet-compare.js';
import {magnetCompareValues,validMagnetCompareRow,magnetTowerProgress} from './magnet-compare-model.js';
import {mountGasCompare} from './lab-gas-compare.js';
import {gasCompareValues,validGasCompareRow} from './gas-compare-model.js';
import {mountGeologyCompare} from './lab-geology-compare.js';
import {geologyCompareValues,validGeologyCompareRow} from './geology-compare-model.js';
import {mountLightCompare} from './lab-light-compare.js';
import {lightCompareValues,validLightCompareRow} from './light-compare-model.js';
import {mountMixtureCompare} from './lab-mixture-compare.js?v=20261104-table-fix';
import {mixtureCompareValues,validMixtureCompareRow} from './mixture-compare-model.js';
import {mountBodyCompare} from './lab-body-compare.js';
import {bodyCompareValues,validBodyCompareRow} from './body-compare-model.js';
import {mountHeatCompare} from './lab-heat-compare.js';
import {heatCompareValues,validHeatCompareRow} from './heat-compare-model.js';
import {mountWeatherCompare} from './lab-weather-compare.js?v=20261104-weather-class';
import {weatherCompareValues,validWeatherCompareRow} from './weather-compare-model.js';
import {mountEnergyCompare} from './lab-energy-compare.js?v=20261104-energy-class';
import {energyCompareValues,validEnergyCompareRow} from './energy-compare-model.js';
import{mountAcidCompare}from'./lab-acid-compare.js?v=20261104-acid-class';
import{acidCompareValues,validAcidCompareRow}from'./acid-compare-model.js';
import{inquiry as acidInquiry}from'../data/activities/c22-s61-u01.inquiry.js?v=20261104-acid-class';
const comparisonMounts={'career-compare':mountCareerCompare,'electricity-compare':mountElectricityCompare,'combustion-compare':mountCombustionCompare,'season-compare':mountSeasonCompare,'earth-motion-compare':mountEarthMotionCompare,'plant-structure-compare':mountPlantStructureCompare,'motion-compare':mountMotionCompare,'acid-compare':mountAcidCompare,'energy-compare':mountEnergyCompare,'weather-compare':mountWeatherCompare,'heat-compare':mountHeatCompare,'mixture-compare':mountMixtureCompare,'body-compare':mountBodyCompare,'light-compare':mountLightCompare,'geology-compare':mountGeologyCompare,'gas-compare':mountGasCompare,'magnet-compare':mountMagnetCompare,'biology-compare':mountBiologyCompare,'ground-compare':mountGroundCompare,'water-compare':mountWaterCompare,'solution-compare':mountSolutionCompare,'sky-compare':mountSkyCompare,'climate-compare':mountClimateCompare,'infection-compare':mountInfectionCompare,'animal-compare':mountAnimalCompare,'plant-compare':mountPlantCompare,'life-compare':mountLifeCompare,'ecology-compare':mountEcologyCompare,'material-compare':mountMaterialCompare,'earth-sea-compare':mountEarthSeaCompare,'sound-compare':mountSoundCompare};
const lessons = new Map([
 ['c22-s62-u04',()=>import('../data/book/c22-s62-u04.thinking-lesson.js?v=20261104-student-science-language')],
 ['c22-s62-u03',()=>import('../data/book/c22-s62-u03.thinking-lesson.js?v=20261104-student-science-language')],
 ['c22-s62-u02',()=>import('../data/book/c22-s62-u02.thinking-lesson.js?v=20261104-combustion-class')],
 ['c22-s62-u01',()=>import('../data/book/c22-s62-u01.thinking-lesson.js?v=20261104-season-class')],
 ['c22-s61-u04',()=>import('../data/book/c22-s61-u04.thinking-lesson.js?v=20261104-earth-motion-class')],
 ['c22-s61-u03',()=>import('../data/book/c22-s61-u03.thinking-lesson.js?v=20261104-plant-structure-class')],
 ['c22-s61-u02',()=>import('../data/book/c22-s61-u02.thinking-lesson.js?v=20261104-motion-class')],
 ['c22-s61-u01',()=>import('../data/book/c22-s61-u01.thinking-lesson.js?v=20261105-acid-student-language')],
 ['c22-s52-u04', () => import('../data/book/c22-s52-u04.thinking-lesson.js?v=20261105-current-bank-revisions')],
 ['c22-s52-u03', () => import('../data/book/c22-s52-u03.thinking-lesson.js?v=20261104-weather-class')],
 ['c22-s52-u02', () => import('../data/book/c22-s52-u02.thinking-lesson.js?v=20261105-activity-guide')],
 ['c22-s52-u01', () => import('../data/book/c22-s52-u01.thinking-lesson.js?v=20261104-mixture-class')],
 ['c22-s51-u04', () => import('../data/book/c22-s51-u04.thinking-lesson.js?v=20261104-body-class')],
 ['c22-s51-u02', () => import('../data/book/c22-s51-u02.thinking-lesson.js?v=20261105-light-student-language')],
 ['c22-s51-u01', () => import('../data/book/c22-s51-u01.thinking-lesson.js?v=20261105-geology-student-language')],
 ['c22-s42-u03', () => import('../data/book/c22-s42-u03.thinking-lesson.js?v=20261104-gas-class')],
 ['s41-u01', () => import('../data/book/s41-u01.thinking-lesson.js?v=20261105-magnet-sky-student-language')],
 ['s41-u04', () => import('../data/book/s41-u04.thinking-lesson.js?v=20261105-biology-question-language')],
 ['s41-u03', () => import('../data/book/s41-u03.thinking-lesson.js?v=20261104-ground-class')],
 ['s41-u02', () => import('../data/book/s41-u02.thinking-lesson.js?v=20261103-water-class')],
 ['c22-s51-u03', () => import('../data/book/c22-s51-u03.thinking-lesson.js?v=20261105-solution-student-language')],
 ['c22-s42-u01', () => import('../data/book/c22-s42-u01.thinking-lesson.js?v=20261105-magnet-sky-student-language')],
 ['c22-s42-u04', () => import('../data/book/c22-s42-u04.thinking-lesson.js?v=20261103-climate-class')],
 ['c22-s32-u04', () => import('../data/book/c22-s32-u04.thinking-lesson.js?v=20261103-infection-class')],
 ['c22-s32-u03', () => import('../data/book/c22-s32-u03.thinking-lesson.js?v=20261105-ecology-sound-bank')],
 ['c22-s32-u02', () => import('../data/book/c22-s32-u02.thinking-lesson.js?v=20261105-material-earth-student-language')],
 ['c22-s32-u01', () => import('../data/book/c22-s32-u01.thinking-lesson.js?v=20261105-material-earth-student-language')],
 ['s31-u01', () => import('../data/book/s31-u01.thinking-lesson.js?v=20261105-classroom-narration')],
 ['s31-u02', () => import('../data/book/s31-u02.thinking-lesson.js?v=20261102-animal')],
 ['s31-u03', () => import('../data/book/s31-u03.thinking-lesson.js?v=20261102-plant')],
 ['c22-s42-u02', () => import('../data/book/c22-s42-u02.thinking-lesson.js?v=20261105-ecology-sound-bank')],
 ['s31-u04', () => import('../data/book/s31-u04.thinking-lesson.js?v=20261102-life')],
]);
export async function revisedClassroom(unit, mod) {
 const load = lessons.get(unit);
 if (!load) return mod;
 const [book, lesson] = await Promise.all([
  mod.chapter?.revisedCurriculumWorkbook ? mod : revisedTextbook(unit, mod),
  load(),
 ]);
 if(lesson.lab&&!Object.hasOwn(comparisonMounts,lesson.lab.kind))throw Error('수업 비교 활동이 연결되지 않았습니다.');
 const classroomLab=lesson.lab?{...lesson.lab,mount:comparisonMounts[lesson.lab.kind]}:undefined;
 return {...book, chapter:{...book.chapter, ...lesson.chapter,revisedThinkingClassroom:true}, plan:lesson.plan, classroomItems:guidanceParticleCurrentItems(termParticleCurrentItems(observationCurrentItems(lesson.classroomItems||lesson.checks,unit),unit),unit),classroomLab};
}

export function classroomQuestions(mod, pool) {
 if(!mod?.classroomItems) return pool;
 const updated=new Map(mod.classroomItems.map(item=>[item.id,item]));
 return pool.map(item=>updated.get(item.id) || item);
}

export function classroomTableData(unit, lab, rows) {
 const data={cols:lab?.columns || [],rows:rows || []};
 if(unit==='c22-s62-u04')data.rowValues=r=>validCareerCompareRow(r)?careerCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s62-u03')data.rowValues=r=>validElectricityCompareRow(r)?electricityCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s62-u02')data.rowValues=r=>validCombustionCompareRow(r)?combustionCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s62-u01')data.rowValues=r=>validSeasonCompareRow(r)?seasonCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s61-u04')data.rowValues=r=>validEarthMotionCompareRow(r)?earthMotionCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s61-u03')data.rowValues=r=>validPlantStructureCompareRow(r)?plantStructureCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s61-u02')data.rowValues=r=>validMotionCompareRow(r)?motionCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s61-u01')data.rowValues=r=>validAcidCompareRow(r)?acidCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s52-u04') data.rowValues=r=>validEnergyCompareRow(r)?energyCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s52-u03') data.rowValues=r=>validWeatherCompareRow(r)?weatherCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s52-u02') data.rowValues=r=>validHeatCompareRow(r)?heatCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s52-u01') data.rowValues=r=>validMixtureCompareRow(r)?mixtureCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s51-u04') data.rowValues=r=>validBodyCompareRow(r)?bodyCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s51-u02') data.rowValues=r=>validLightCompareRow(r)?lightCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s51-u01') data.rowValues=r=>validGeologyCompareRow(r)?geologyCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s42-u03') data.rowValues=r=>validGasCompareRow(r)?gasCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='s41-u01') data.rowValues=r=>validMagnetCompareRow(r)?magnetCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='s41-u04') data.rowValues=r=>validBiologyCompareRow(r)?biologyCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='s41-u03') data.rowValues=r=>validGroundCompareRow(r)?groundCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='s41-u02') data.rowValues=r=>validWaterCompareRow(r)?waterCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='s31-u01') data.rowValues=r=>[
  `${r.leftName} · ${r.left}칸`,`${r.rightName} · ${r.right}칸`,
  FORCE_PREDICTIONS[r.prediction],r.observation,
 ];
 if(unit==='s31-u02') data.rowValues=r=>validClassifyRow(r)?classifyRowValues(r):['확인이 필요한 자료','',''];
 if(unit==='s31-u03') data.rowValues=r=>validLeafCompareRow(r)?leafRowValues(r):['확인이 필요한 자료','',''];
 if(unit==='s31-u04') data.rowValues=r=>validLifeCompareRow(r)?lifeCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s42-u02') data.rowValues=r=>validEcologyCompareRow(r)?ecologyCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s32-u01') data.rowValues=r=>validMaterialCompareRow(r)?materialCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s32-u02') data.rowValues=r=>validEarthSeaCompareRow(r)?earthSeaCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s32-u03') data.rowValues=r=>validSoundCompareRow(r)?soundCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s32-u04') data.rowValues=r=>validInfectionCompareRow(r)?infectionCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s42-u04') data.rowValues=r=>validClimateCompareRow(r)?climateCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s42-u01') data.rowValues=r=>validSkyCompareRow(r)?skyCompareValues(r):['확인이 필요한 자료','',''];
 if(unit==='c22-s51-u03') data.rowValues=r=>validSolutionCompareRow(r)?solutionCompareValues(r):['확인이 필요한 자료','',''];
 return data;
}

// 원래 용액 기록의 설정·키와 물·땅의 기존3D 모형을 순수 adapter로 연결한다.
export function withOptionalClassroomRecords(unit,lesson){
 if(unit==='c22-s62-u04'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:careerInquiry,rowsKey:'careerInquiryRows',title:'과학과 나의 진로 활동 기록장(선택)',note:'조사하거나 관찰한 내용을 자세히 남기고 싶을 때 써요. 화면 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s62-u03'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:electricityInquiry,rowsKey:'electricityInquiryRows',title:'전기의 이용 관찰·실험·실천 기록장(선택)',note:'직접 관찰하거나 실제로 실천한 내용을 자세히 남기고 싶을 때 써요. 화면 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s62-u02'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:combustionInquiry,rowsKey:'combustionInquiryRows',title:'물질의 연소 관찰·실험·조사 기록장(선택)',note:'직접 관찰·실험하거나 조사하고 공유한 내용을 자세히 남기고 싶을 때 써요. 화면 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s62-u01'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:seasonInquiry,rowsKey:'seasonInquiryRows',title:'계절의 변화 관찰·실험 기록장(선택)',note:'측정한 값과 자료, 모형실험에서 알아낸 것을 자세히 남기고 싶을 때 써요. 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s61-u04'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:earthMotionInquiry,rowsKey:'earthMotionInquiryRows',title:'지구의 운동 관찰·실험 기록장(선택)',note:'관찰 조건과 모형실험에서 알아낸 것을 자세히 남기고 싶을 때 써요. 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s61-u03'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:plantStructureInquiry,rowsKey:'plantStructureInquiryRows',title:'식물의 구조와 기능 탐구 기록장(선택)',note:'직접 관찰하고 실험하거나 조사한 내용을 자세히 남기고 싶을 때 써요. 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s61-u02'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:motionInquiry,rowsKey:'motionInquiryRows',title:'물체의 운동 탐구 기록장(선택)',note:'직접 관찰하고 측정하거나 조사한 내용을 자세히 남기고 싶을 때 써요. 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s61-u01'&&lesson?.explore&&!lesson.explore.records)return{...lesson,explore:{...lesson.explore,records:{kind:'inquiry',config:acidInquiry,rowsKey:'acidInquiryRows',title:'산과 염기 탐구 기록장(선택)',note:'직접 관찰하고 조사하고 소개한 내용을 자세히 남기고 싶을 때 써요. 자료 비교와 별도로 보관해요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s52-u04'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'자원과 에너지 탐구 기록장(선택)',note:'직접 조사하고 집 모형을 만들고 시험하며 생활에서 실천한 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s52-u03'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'날씨 탐구 기록장(선택)',note:'직접 관측하고 실험하고 날씨 카드를 만든 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s52-u02'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'온도와 열 탐구 기록장(선택)',note:'직접 측정하고 장치를 만들고 시험한 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s52-u01'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'혼합물 탐구 기록장(선택)',note:'직접 분리하고 장치를 만들고 조사한 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s51-u04'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'우리 몸 탐구 기록장(선택)',note:'직접 관찰하고 모형을 만들고 생활에서 실천한 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s51-u02'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'빛 탐구 기록장(선택)',note:'직접 관찰하고 장치를 만들고 시험한 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s51-u01'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'지층·화석 탐구 기록장(선택)',note:'직접 관찰하고 분류하고 모형을 만든 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='c22-s42-u03'&&lesson?.explore?.lab?.kind==='inquiry'&&!lesson.explore.records)return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'기체 탐구 기록장(선택)',note:'직접 실험하고 조사하고 만든 내용을 자세히 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}},elaborate:{...lesson.elaborate,report:false}};
 if(unit==='s41-u01'&&lesson?.explore?.lab?.kind==='ring-tower'&&!lesson.explore.modelLab)return {...lesson,explore:{...lesson.explore,modelLab:{...lesson.explore.lab,progress:magnetTowerProgress}}};
 if(unit==='s41-u04'&&lesson?.explore?.lab?.kind==='bread'&&!lesson.explore.modelLab)return {...lesson,explore:{...lesson.explore,modelLab:{...lesson.explore.lab,progress:biologyBreadProgress}}};
 if(unit==='s41-u03'&&lesson?.explore?.lab?.kind==='hill'&&!lesson.explore.modelLab)return {...lesson,explore:{...lesson.explore,modelLab:{...lesson.explore.lab}}};
 if(unit==='s41-u02'&&lesson?.explore?.lab?.kind==='freeze'&&!lesson.explore.modelLab)return {...lesson,explore:{...lesson.explore,modelLab:{...lesson.explore.lab}}};
 if(unit!=='c22-s51-u03'||!lesson?.explore?.lab||lesson.explore.records)return lesson;
 return {...lesson,explore:{...lesson.explore,records:{...lesson.explore.lab,title:'실제 용액 탐구 기록(선택)',note:'직접 비교·조사·자료 제작·실제 전달과 받은 의견을 따로 남길 때 써요. 예전에 쓴 기록도 그대로 있어요.'}}};
}
