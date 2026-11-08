import {GRADE3_STUDY_NOTES_VERSION,GRADE3_STUDY_NOTE_UNITS} from '../data/book/grade3-study-notes.js?v=20261108-grade3-term2-study-notes';
import {FORCE_ELEMENTARY_VERSION} from '../data/book/s31-u01.elementary.js?v=20261108-force-elementary';
import {LIFE_ELEMENTARY_VERSION} from '../data/book/s31-u04.elementary.js?v=20261108-life-elementary';
import {GRADE3_LIVING_DIRECTIONS_VERSION} from '../data/book/s31-living-practice-directions.js?v=20261108-grade3-living-directions';
import{ECOLOGY_ELEMENTARY_VERSION}from'../data/book/c22-s42-u02.elementary.js?v=20261108-ecology-elementary';
import{GAS_WORKBOOK_LINK_VERSION}from'../data/book/c22-s42-u03.editorial.js?v=20261108-gas-workbook-links';
import{LAND_ELEMENTARY_VERSION}from'../data/book/s41-u03.elementary.js?v=20261108-land-elementary';
import{WATER_ELEMENTARY_VERSION}from'../data/book/s41-u02.elementary.js?v=20261108-water-elementary';
import{MAGNET_ELEMENTARY_VERSION}from'../data/book/s41-u01.elementary.js?v=20261108-magnet-elementary';
import{GRADE3_PRACTICE_LANGUAGE_VERSION,GRADE3_PRACTICE_UNITS}from'../data/book/c22-s32-practice-language.js?v=20261108-grade3-material-language';
import{LAND_REASONING_VERSION}from'../data/book/s41-u03.editorial.js?v=20261105-land-learner-reasoning';
import{EARTH_SEA_ELEMENTARY_VERSION}from'../data/book/c22-s32-u02.elementary.js?v=20261108-earth-sea-elementary';
import{WATER_REASONING_VERSION}from'../data/book/s41-u02.editorial.js?v=20261105-water-learner-reasoning';
import{MAGNET_REASONING_VERSION}from'../data/book/s41-u01.rail-notes.js?v=20261105-magnet-learner-reasoning';
import{INFECTION_REASONING_VERSION}from'../data/book/c22-s32-u04.rail-notes.js?v=20261105-infection-learner-reasoning';
import{SOUND_REASONING_VERSION}from'../data/book/c22-s32-u03.rail-notes.js?v=20261105-sound-learner-reasoning';
import{EARTH_SEA_REASONING_VERSION}from'../data/book/c22-s32-u02.rail-notes.js?v=20261105-earth-sea-learner-reasoning';
import{MATERIAL_REASONING_VERSION}from'../data/book/c22-s32-u01.rail-notes.js?v=20261105-material-learner-reasoning';
import{PLANT_QUESTION_VERSION}from'../data/book/learner-explanations.js?v=20261105-plant-observation-questions';
import{ANIMAL_QUESTION_VERSION}from'../data/book/learner-explanations.js?v=20261105-animal-question-language';
import{FORCE_OBSERVATION_VERSION}from'../data/book/force-workbook-guidance.js?v=20261105-force-life-learner-reasoning';
import{LIFE_LEARNER_VERSION}from'../data/book/learner-explanations.js?v=20261105-force-life-learner-reasoning';
import{MATERIAL_PHOTO_VERSION}from'../data/book/c22-s32-u01.rail-notes.js?v=20261105-material-water-photo-language';
import{WATER_PHOTO_VERSION}from'../data/book/s41-u02.editorial.js?v=20261105-material-water-photo-language';
import{SOUND_PHOTO_VERSION}from'../data/book/c22-s32-u03.rail-notes.js?v=20261105-sound-motion-photo-language';
import{MOTION_PHOTO_VERSION}from'../data/book/c22-s61-u02.editorial.js?v=20261105-sound-motion-photo-language';
import{LAND_PHOTO_VERSION}from'../data/book/s41-u03.editorial.js?v=20261105-land-photo-language';
import{ECOLOGY_PHOTO_VERSION}from'../data/book/c22-s42-u02.workbook-art.js?v=20261105-ecology-photo-language';
import{LIGHT_PICTURE_VERSION}from'../data/book/c22-s51-u02.editorial.js?v=20261105-light-picture-guide';
import{CAREER_READING_VERSION}from'../data/book/c22-s62-u04.editorial.js?v=20261105-career-reading-science';
import{WEATHER_PHOTO_VERSION}from'../data/book/c22-s52-u03.editorial.js?v=20261105-weather-photo-labels';
import{SEASON_CONCEPT_VERSION}from'../data/book/c22-s62-u01.editorial.js?v=20261105-season-concept-language';
import{BODY_UPPER_VERSION}from'../data/book/c22-s51-u04.editorial.js?v=20261105-body-upper-progression';
import{INFECTION_UPPER_VERSION}from'../data/book/c22-s32-u04.rail-notes.js?v=20261105-infection-upper-science';
import{CLIMATE_UPPER_VERSION}from'../data/book/c22-s42-u04.rail-notes.js?v=20261105-climate-upper-science';
import{WATER_UPPER_VERSION}from'../data/book/s41-u02.editorial.js?v=20261105-water-upper-science';
import{SOUND_UPPER_VERSION}from'../data/book/c22-s32-u03.rail-notes.js?v=20261105-sound-upper-science';
import{GAS_UPPER_VERSION}from'../data/book/c22-s42-u03.editorial.js?v=20261105-gas-upper-science';
import{LAND_UPPER_VERSION}from'../data/book/s41-u03.editorial.js?v=20261105-land-upper-science';
import{TERM_PARTICLE_UNITS,TERM_PARTICLE_VERSION,GUIDANCE_PARTICLE_UNITS,GUIDANCE_PARTICLE_VERSION}from'../data/book/term-particle-language.js?v=20261105-guidance-particles';
import{FORCE_GUIDANCE_VERSION}from'../data/book/force-workbook-guidance.js';
import{BIOLOGY_CRITERIA_VERSION}from'../data/book/biology-student-language.js?v=20261105-biology-criteria';
import{LEARNER_EXPLANATIONS_UNITS,LEARNER_EXPLANATIONS_VERSION}from'../data/book/learner-explanations.js';
import{OBSERVATION_LANGUAGE_UNITS,OBSERVATION_LANGUAGE_VERSION}from'../data/book/observation-language.js';
import {WORKBOOK_ANSWER_LANGUAGE_UNITS,WORKBOOK_ANSWER_LANGUAGE_VERSION} from '../data/book/workbook-answer-language.js';
import {STUDENT_OPENING_UNITS,STUDENT_GUIDE_UNITS,STUDENT_GUIDE_VERSION,ACTIVITY_GUIDE_UNITS,ACTIVITY_GUIDE_VERSION} from '../data/book/student-opening-language.js?v=20261105-activity-guide';
// 검수한 교재만 연결한다. 기존 수업·보고서·문제은행 모듈은 그대로 둔다.
import {withPrintedWorkbook} from './revised-learning-book.js?v=20261108-learning-note-roles';
import {makeWorkbookPaper} from './revised-workbook-paper.js?v=20261108-elementary-task-language';
export const revisedTextbookUnits = new Set(["c22-s62-u04", "c22-s62-u03", "c22-s62-u02", "c22-s62-u01", "c22-s32-u01", "c22-s32-u02", "s41-u01", "c22-s42-u01", "c22-s51-u03", "s31-u01", "s31-u02", "s31-u03", "s31-u04", "c22-s42-u02", "c22-s32-u03", "c22-s32-u04", "c22-s42-u04", "s41-u02", "s41-u03", "s41-u04", "c22-s42-u03", "c22-s51-u01", "c22-s51-u02", "c22-s51-u04", "c22-s52-u01", "c22-s52-u02", "c22-s52-u03", "c22-s52-u04", "c22-s61-u01", "c22-s61-u02", "c22-s61-u03", "c22-s61-u04"]);
const cache = new Map();
async function data(unit) {
 if (!revisedTextbookUnits.has(unit)) return null;
 const version=GRADE4_STUDY_NOTE_UNITS.includes(unit)?GRADE4_STUDY_NOTES_VERSION:['c22-s32-u04','c22-s42-u04'].includes(unit)?'20261108-reviewed-workbook-source':GRADE3_STUDY_NOTE_UNITS.includes(unit)?GRADE3_STUDY_NOTES_VERSION:unit==='s31-u01'?FORCE_ELEMENTARY_VERSION:unit==='s31-u04'?LIFE_ELEMENTARY_VERSION:['s31-u02','s31-u03'].includes(unit)?GRADE3_LIVING_DIRECTIONS_VERSION:unit==='c22-s42-u02'?ECOLOGY_ELEMENTARY_VERSION:unit==='c22-s42-u03'?GAS_WORKBOOK_LINK_VERSION:unit==='s41-u03'?LAND_ELEMENTARY_VERSION:unit==='s41-u02'?WATER_ELEMENTARY_VERSION:unit==='s41-u01'?MAGNET_ELEMENTARY_VERSION:GRADE3_PRACTICE_UNITS.includes(unit)?GRADE3_PRACTICE_LANGUAGE_VERSION:unit==='c22-s32-u02'?EARTH_SEA_ELEMENTARY_VERSION:unit==='c22-s62-u04'?CAREER_READABILITY_VERSION:unit==='c22-s62-u03'?ELECTRICITY_READABILITY_VERSION:unit==='c22-s62-u02'?COMBUSTION_READABILITY_VERSION:unit==='c22-s62-u01'?SEASON_READABILITY_VERSION:unit==='c22-s61-u04'?EARTH_MOTION_READABILITY_VERSION:unit==='c22-s61-u03'?PLANT_STRUCTURE_READABILITY_VERSION:unit==='c22-s61-u02'?MOTION_READABILITY_VERSION:unit==='c22-s61-u01'?ACID_READABILITY_VERSION:unit==='c22-s52-u04'?ENERGY_READABILITY_VERSION:unit==='c22-s52-u03'?WEATHER_READABILITY_VERSION:unit==='c22-s52-u02'?HEAT_READABILITY_VERSION:unit==='c22-s52-u01'?MIXTURE_READABILITY_VERSION:unit==='c22-s51-u04'?BODY_READABILITY_VERSION:unit==='c22-s51-u03'?SOLUTION_READABILITY_VERSION:unit==='c22-s51-u02'?LIGHT_READABILITY_VERSION:unit==='c22-s51-u01'?GEOLOGY_READABILITY_VERSION:unit==='c22-s42-u04'?CLIMATE_READABILITY_VERSION:unit==='c22-s42-u03'?GAS_READABILITY_VERSION:unit==='c22-s42-u02'?ECOLOGY_READABILITY_VERSION:unit==='c22-s42-u01'?SKY_READABILITY_VERSION:unit==='s41-u04'?BIOLOGY_ELEMENTARY_VERSION:unit==='s41-u03'?LAND_REASONING_VERSION:unit==='s41-u02'?WATER_REASONING_VERSION:unit==='s41-u01'?MAGNET_REASONING_VERSION:unit==='c22-s32-u04'?INFECTION_REASONING_VERSION:unit==='c22-s32-u03'?SOUND_REASONING_VERSION:unit==='c22-s32-u02'?EARTH_SEA_REASONING_VERSION:unit==='c22-s32-u01'?MATERIAL_REASONING_VERSION:unit==='s31-u03'?PLANT_QUESTION_VERSION:unit==='s31-u02'?ANIMAL_QUESTION_VERSION:unit==='s31-u01'?FORCE_OBSERVATION_VERSION:unit==='s31-u04'?LIFE_LEARNER_VERSION:unit==='c22-s32-u01'?MATERIAL_PHOTO_VERSION:unit==='s41-u02'?WATER_PHOTO_VERSION:unit==='c22-s32-u03'?SOUND_PHOTO_VERSION:unit==='c22-s61-u02'?MOTION_PHOTO_VERSION:unit==='s41-u03'?LAND_PHOTO_VERSION:unit==='c22-s42-u02'?ECOLOGY_PHOTO_VERSION:unit==='c22-s51-u02'?LIGHT_PICTURE_VERSION:unit==='c22-s62-u04'?CAREER_READING_VERSION:ACTIVITY_GUIDE_UNITS.includes(unit)?ACTIVITY_GUIDE_VERSION:unit==='c22-s52-u03'?WEATHER_PHOTO_VERSION:unit==='c22-s62-u01'?SEASON_CONCEPT_VERSION:unit==='c22-s51-u04'?BODY_UPPER_VERSION:unit==='c22-s32-u04'?INFECTION_UPPER_VERSION:unit==='c22-s42-u04'?CLIMATE_UPPER_VERSION:unit==='s41-u02'?WATER_UPPER_VERSION:unit==='c22-s32-u03'?SOUND_UPPER_VERSION:unit==='c22-s42-u03'?GAS_UPPER_VERSION:unit==='s41-u03'?LAND_UPPER_VERSION:STUDENT_GUIDE_UNITS.includes(unit)?STUDENT_GUIDE_VERSION:unit==='s41-u04'?BIOLOGY_CRITERIA_VERSION:GUIDANCE_PARTICLE_UNITS.includes(unit)?GUIDANCE_PARTICLE_VERSION:TERM_PARTICLE_UNITS.includes(unit)?TERM_PARTICLE_VERSION:unit==='s31-u01'?FORCE_GUIDANCE_VERSION:LEARNER_EXPLANATIONS_UNITS.includes(unit)?LEARNER_EXPLANATIONS_VERSION:OBSERVATION_LANGUAGE_UNITS.includes(unit)?OBSERVATION_LANGUAGE_VERSION:WORKBOOK_ANSWER_LANGUAGE_UNITS.includes(unit)?WORKBOOK_ANSWER_LANGUAGE_VERSION:unit==='c22-s61-u01'?'20261105-acid-student-language':unit==='s41-u04'?'20261105-biology-question-language':(unit==='c22-s32-u01'||unit==='c22-s32-u02')?'20261105-material-earth-student-language':(unit==='s41-u01'||unit==='c22-s42-u01')?'20261105-magnet-sky-student-language':unit==='c22-s51-u03'?'20261105-solution-student-language':(unit==='s41-u01'||unit==='c22-s42-u01')?'20261105-magnet-night-body-language':(unit==='c22-s32-u01'||unit==='c22-s32-u02')?'20261105-material-earth-body-language':unit==='c22-s51-u03'?'20261105-solution-body-language':(unit==='c22-s32-u02'||unit==='c22-s51-u03')?'20261105-earth-solution-rails':(unit==='c22-s32-u01'||unit==='s41-u01')?'20261105-material-magnet-rails':unit==='c22-s42-u01'?'20261105-night-sky-rails':STUDENT_OPENING_UNITS.includes(unit)?'20261105-student-opening':unit==='c22-s62-u04'?'20261104-student-science-language':unit==='c22-s62-u03'?'20261104-student-science-language':unit==='c22-s62-u02'?'20261104-combustion-book':unit==='c22-s62-u01'?'20261104-season-book':unit==='c22-s61-u04'?'20261104-earth-motion-questions':unit==='c22-s61-u03'?'20261104-earth-motion-book':unit==='c22-s61-u02'?'20261104-motion-book':unit==='c22-s61-u01'?'20261104-acid-book':unit==='c22-s52-u04'?'20261104-acid-book':unit==='c22-s52-u03'?'20261104-weather-book':unit==='c22-s52-u02'?'20261104-heat-book':unit==='c22-s52-u01'?'20261104-mixture-book':unit==='c22-s51-u04'?'20261104-body-book':unit==='c22-s51-u02'?'20261105-light-student-language':unit==='c22-s51-u01'?'20261105-geology-student-language':unit==='c22-s42-u03'?'20261104-gas-book':unit==='s41-u04'?'20261104-biology-student-language':unit==='s41-u03'?'20261103-land-book':unit==='s41-u02'?'20261103-water-book':unit==='c22-s42-u04'?'20261103-climate':'20261102';
 if (!cache.has(unit)) cache.set(unit, Promise.all([
  import(`../data/book/${unit}.workbook.js?v=${version}`),
  import(`../data/book/${unit}.workbook-art.js?v=${version}`),
 ]).then(([{workbook}, {art}])=>({workbook,art})));
 return cache.get(unit);
}
export async function revisedTextbook(unit, mod) {
 const d=await data(unit); if(!d)return mod;
 const {chapter}=mod;
 const merged=withPrintedWorkbook({...mod,art:{...mod.art,...d.art},chapter:{...chapter,thinkWorkbook:true,editorial:false}},d.workbook);
 return {...merged,chapter:{...merged.chapter,revisedCurriculumWorkbook:true,workbookRoute:'workbook',...(unit==='c22-s61-u01'?{startNote:'지시약으로 용액을 분류하고 성질과 혼합 변화를 알아보아요. 생활 속 이용과 산성화의 환경 피해를 조사해 소개해요.'}:{})}};
}
export async function revisedTextbookPaper(unit) {
 const d=await data(unit);return d?makeWorkbookPaper(d.workbook,d.art):null;
}
import{BIOLOGY_ELEMENTARY_VERSION}from'../data/book/s41-u04.editorial.js?v=20261108-elementary-task-language';
import{SKY_READABILITY_VERSION}from'../data/book/c22-s42-u01.rail-notes.js?v=20261106-sky-readable-workbook';
import{ECOLOGY_READABILITY_VERSION}from'../data/book/c22-s42-u02.editorial.js?v=20261106-ecology-readable-workbook';
import{GAS_READABILITY_VERSION}from'../data/book/c22-s42-u03.editorial.js?v=20261106-gas-readable-workbook';

import{CLIMATE_READABILITY_VERSION}from'../data/book/c22-s42-u04.rail-notes.js?v=20261106-climate-readable-workbook';

import{GEOLOGY_READABILITY_VERSION}from'../data/book/c22-s51-u01.editorial.js?v=20261106-geology-readable-workbook';

import{LIGHT_READABILITY_VERSION}from'../data/book/c22-s51-u02.editorial.js?v=20261106-light-readable-workbook';

import{SOLUTION_READABILITY_VERSION}from'../data/book/c22-s51-u03.rail-notes.js?v=20261106-solution-readable-workbook';

import{BODY_READABILITY_VERSION}from'../data/book/c22-s51-u04.editorial.js?v=20261106-body-readable-workbook';

import{MIXTURE_READABILITY_VERSION}from'../data/book/c22-s52-u01.editorial.js?v=20261106-mixture-readable-workbook';

import{HEAT_READABILITY_VERSION}from'../data/book/c22-s52-u02.editorial.js?v=20261106-heat-readable-workbook';

import{WEATHER_READABILITY_VERSION}from'../data/book/c22-s52-u03.editorial.js?v=20261106-weather-readable-workbook';

import{ENERGY_READABILITY_VERSION}from'../data/book/c22-s52-u04.editorial.js?v=20261106-energy-readable-workbook';

import{ACID_READABILITY_VERSION}from'../data/book/c22-s61-u01.editorial.js?v=20261106-acid-readable-workbook';

import{MOTION_READABILITY_VERSION}from'../data/book/c22-s61-u02.editorial.js?v=20261106-motion-readable-workbook';

import{PLANT_STRUCTURE_READABILITY_VERSION}from'../data/book/c22-s61-u03.editorial.js?v=20261106-plant-structure-readable-workbook';

import{EARTH_MOTION_READABILITY_VERSION}from'../data/book/c22-s61-u04.editorial.js?v=20261106-earth-motion-readable-workbook';

import{SEASON_READABILITY_VERSION}from'../data/book/c22-s62-u01.editorial.js?v=20261106-season-readable-workbook';

import{COMBUSTION_READABILITY_VERSION}from'../data/book/c22-s62-u02.editorial.js?v=20261106-combustion-readable-workbook';

import{ELECTRICITY_READABILITY_VERSION}from'../data/book/c22-s62-u03.editorial.js?v=20261106-electricity-readable-workbook';

import{CAREER_READABILITY_VERSION}from'../data/book/c22-s62-u04.editorial.js?v=20261107-career-readable-workbook';

import{GRADE4_STUDY_NOTE_UNITS,GRADE4_STUDY_NOTES_VERSION}from'../data/book/grade4-study-notes.js?v=20261108-grade4-study-notes';
