const unchangedClassroomItems=(rows,unit)=>rows;
const classroomReadingDefaults={biologyReadableCurrentItems:unchangedClassroomItems,skyReadableCurrentItems:unchangedClassroomItems,ecologyReadableCurrentItems:unchangedClassroomItems,gasReadableCurrentItems:unchangedClassroomItems,climateReadableCurrentItems:unchangedClassroomItems,geologyReadableCurrentItems:unchangedClassroomItems,lightReadableCurrentItems:unchangedClassroomItems,solutionReadableCurrentItems:unchangedClassroomItems,bodyReadableCurrentItems:unchangedClassroomItems,mixtureReadableCurrentItems:unchangedClassroomItems,heatReadableCurrentItems:unchangedClassroomItems,weatherReadableCurrentItems:unchangedClassroomItems,energyReadableCurrentItems:unchangedClassroomItems,acidReadableCurrentItems:unchangedClassroomItems,motionReadableCurrentItems:unchangedClassroomItems,plantStructureReadableCurrentItems:unchangedClassroomItems,earthMotionReadableCurrentItems:unchangedClassroomItems,seasonReadableCurrentItems:unchangedClassroomItems,combustionReadableCurrentItems:unchangedClassroomItems,electricityReadableCurrentItems:unchangedClassroomItems,careerReadableCurrentItems:unchangedClassroomItems};
const classroomReadingLoaders={
"s41-u04":()=>import("../data/book/s41-u04.editorial.js?v=20261106-biology-opening-guide").then(module=>({biologyReadableCurrentItems:module.biologyReadableCurrentItems})),
"c22-s42-u01":()=>import("../data/book/c22-s42-u01.rail-notes.js?v=20261106-sky-readable-workbook").then(module=>({skyReadableCurrentItems:module.skyReadableCurrentItems})),
"c22-s42-u02":()=>import("../data/book/c22-s42-u02.editorial.js?v=20261106-ecology-readable-workbook").then(module=>({ecologyReadableCurrentItems:module.ecologyReadableCurrentItems})),
"c22-s42-u03":()=>import("../data/book/c22-s42-u03.editorial.js?v=20261106-gas-readable-workbook&photo=20261115-gas-photo-context").then(module=>({gasReadableCurrentItems:module.gasReadableCurrentItems})),
"c22-s42-u04":()=>import("../data/book/c22-s42-u04.rail-notes.js?v=20261106-climate-readable-workbook").then(module=>({climateReadableCurrentItems:module.climateReadableCurrentItems})),
"c22-s51-u01":()=>import("../data/book/c22-s51-u01.editorial.js?v=20261106-geology-readable-workbook&review=20261115-geology-response-review").then(module=>({geologyReadableCurrentItems:module.geologyReadableCurrentItems})),
"c22-s51-u02":()=>import("../data/book/c22-s51-u02.editorial.js?v=20261106-light-readable-workbook").then(module=>({lightReadableCurrentItems:module.lightReadableCurrentItems})),
"c22-s51-u03":()=>import("../data/book/c22-s51-u03.rail-notes.js?v=20261106-solution-readable-workbook").then(module=>({solutionReadableCurrentItems:module.solutionReadableCurrentItems})),
"c22-s51-u04":()=>import("../data/book/c22-s51-u04.editorial.js?v=20261106-body-readable-workbook").then(module=>({bodyReadableCurrentItems:module.bodyReadableCurrentItems})),
"c22-s52-u01":()=>import("../data/book/c22-s52-u01.editorial.js?v=20261106-mixture-readable-workbook").then(module=>({mixtureReadableCurrentItems:module.mixtureReadableCurrentItems})),
"c22-s52-u02":()=>import("../data/book/c22-s52-u02.editorial.js?v=20261106-heat-readable-workbook").then(module=>({heatReadableCurrentItems:module.heatReadableCurrentItems})),
"c22-s52-u03":()=>import("../data/book/c22-s52-u03.editorial.js?v=20261106-weather-readable-workbook").then(module=>({weatherReadableCurrentItems:module.weatherReadableCurrentItems})),
"c22-s52-u04":()=>import("../data/book/c22-s52-u04.editorial.js?v=20261106-energy-readable-workbook").then(module=>({energyReadableCurrentItems:module.energyReadableCurrentItems})),
"c22-s61-u01":()=>import("../data/book/c22-s61-u01.editorial.js?v=20261106-acid-readable-workbook").then(module=>({acidReadableCurrentItems:module.acidReadableCurrentItems})),
"c22-s61-u02":()=>import("../data/book/c22-s61-u02.editorial.js?v=20261106-motion-readable-workbook").then(module=>({motionReadableCurrentItems:module.motionReadableCurrentItems})),
"c22-s61-u03":()=>import("../data/book/c22-s61-u03.editorial.js?v=20261106-plant-structure-readable-workbook").then(module=>({plantStructureReadableCurrentItems:module.plantStructureReadableCurrentItems})),
"c22-s61-u04":()=>import("../data/book/c22-s61-u04.editorial.js?v=20261106-earth-motion-readable-workbook").then(module=>({earthMotionReadableCurrentItems:module.earthMotionReadableCurrentItems})),
"c22-s62-u01":()=>import("../data/book/c22-s62-u01.editorial.js?v=20261106-season-readable-workbook").then(module=>({seasonReadableCurrentItems:module.seasonReadableCurrentItems})),
"c22-s62-u02":()=>import("../data/book/c22-s62-u02.editorial.js?v=20261106-combustion-readable-workbook").then(module=>({combustionReadableCurrentItems:module.combustionReadableCurrentItems})),
"c22-s62-u03":()=>import("../data/book/c22-s62-u03.editorial.js?v=20261106-electricity-readable-workbook").then(module=>({electricityReadableCurrentItems:module.electricityReadableCurrentItems})),
"c22-s62-u04":()=>import("../data/book/c22-s62-u04.editorial.js?v=20261107-career-readable-workbook").then(module=>({careerReadableCurrentItems:module.careerReadableCurrentItems})),
};
async function classroomReadingFor(unit){return{...classroomReadingDefaults,...(classroomReadingLoaders[unit]?await classroomReadingLoaders[unit]():{})};}

const unchangedClassroom=(unit,book)=>book;
const classroomContextDefaults={withCareerContextClassroom:unchangedClassroom,withElectricityContextClassroom:unchangedClassroom,withCombustionContextClassroom:unchangedClassroom,withSeasonContextClassroom:unchangedClassroom,withEarthMotionContextClassroom:unchangedClassroom,withPlantContextClassroom:unchangedClassroom,withMotionContextClassroom:unchangedClassroom,withAcidContextClassroom:unchangedClassroom,withEnergyContextClassroom:unchangedClassroom,withHeatContextClassroom:unchangedClassroom,withWeatherContextClassroom:unchangedClassroom,withMixtureContextClassroom:unchangedClassroom,withBodyContextClassroom:unchangedClassroom,withSolutionContextClassroom:unchangedClassroom};
const classroomContextLoaders={
"c22-s62-u04":()=>import("../data/book/career-workbook-context.js?v=20261116-career-workbook-context&temperatureCondition=20261116-career-temperature-condition").then(module=>({withCareerContextClassroom:module.withCareerContextClassroom})),
"c22-s62-u03":()=>import("../data/book/electricity-workbook-context.js?v=20261116-electricity-workbook-context").then(module=>({withElectricityContextClassroom:module.withElectricityContextClassroom})),
"c22-s62-u02":()=>import("../data/book/combustion-workbook-context.js?v=20261116-combustion-workbook-context").then(module=>({withCombustionContextClassroom:module.withCombustionContextClassroom})),
"c22-s62-u01":()=>import("../data/book/season-workbook-context.js?v=20261116-season-workbook-context").then(module=>({withSeasonContextClassroom:module.withSeasonContextClassroom})),
"c22-s61-u04":()=>import("../data/book/earth-motion-workbook-context.js?v=20261116-earth-motion-workbook-context").then(module=>({withEarthMotionContextClassroom:module.withEarthMotionContextClassroom})),
"c22-s61-u03":()=>import("../data/book/plant-workbook-context.js?v=20261116-plant-workbook-context").then(module=>({withPlantContextClassroom:module.withPlantContextClassroom})),
"c22-s61-u02":()=>import("../data/book/motion-workbook-context.js?v=20261116-motion-workbook-context").then(module=>({withMotionContextClassroom:module.withMotionContextClassroom})),
"c22-s61-u01":()=>import("../data/book/acid-workbook-context.js?v=20261116-acid-workbook-context").then(module=>({withAcidContextClassroom:module.withAcidContextClassroom})),
"c22-s52-u04":()=>import("../data/book/energy-workbook-context.js?v=20261116-energy-workbook-context").then(module=>({withEnergyContextClassroom:module.withEnergyContextClassroom})),
"c22-s52-u02":()=>import("../data/book/heat-workbook-context.js?v=20261116-heat-workbook-context").then(module=>({withHeatContextClassroom:module.withHeatContextClassroom})),
"c22-s52-u03":()=>import("../data/book/weather-workbook-context.js?v=20261116-weather-workbook-context").then(module=>({withWeatherContextClassroom:module.withWeatherContextClassroom})),
"c22-s52-u01":()=>import("../data/book/mixture-workbook-context.js?v=20261116-mixture-workbook-context").then(module=>({withMixtureContextClassroom:module.withMixtureContextClassroom})),
"c22-s51-u04":()=>import("../data/book/body-workbook-context.js?v=20261115-body-workbook-context").then(module=>({withBodyContextClassroom:module.withBodyContextClassroom})),
"c22-s51-u03":()=>import("../data/book/solution-workbook-context.js?v=20261115-solution-workbook-context").then(module=>({withSolutionContextClassroom:module.withSolutionContextClassroom})),
};
async function classroomContextFor(unit){return{...classroomContextDefaults,...(classroomContextLoaders[unit]?await classroomContextLoaders[unit]():{})};}

import{withEarthSeaChoiceClassroom}from'../data/book/earth-sea-choice-review.js?v=20261115-earth-sea-linked-choice-review&safety=20261115-earth-sea-safety-feedback';
import{withRepresentationClassroom}from'../data/book/representation-question-review.js?v=20261115-representation-response-review';
import{withMaterialReadingClassroom}from'../data/book/material-reading-criteria.js?v=20261115-material-reading-criteria';
import{withGrade6QuestionReviewClassroom}from'../data/book/grade6-question-review.js?v=20261115-grade6-question-review';
import{withGrade5QuestionReviewClassroom}from'../data/book/grade5-question-review.js?v=20261115-grade5-question-review';
import{withGrade4QuestionReviewClassroom}from'../data/book/grade4-question-review.js?v=20261115-grade4-question-review&biology=20261115-biology-example-card&ecology=20261115-ecology-food-web-material&sky=20261115-sky-response-review';
import{withReviewedCriteriaClassroom}from'../data/book/reviewed-question-criteria.js?v=20261115-reviewed-answer-criteria';
import{withLinkedWorkbookAnswersClassroom}from'../data/book/linked-workbook-answers.js?v=20261115-linked-workbook-answers';
import{withWeatherDrawingCriteriaClassroom}from'../data/book/c22-s52-u03.editorial.js?v=20261115-drawing-answer-criteria';
import{withSeasonComparisonClassroom}from'../data/book/c22-s62-u01.editorial.js?v=20261115-season-comparison-conditions';
import{withBiologyOpinionClassroom}from'../data/book/s41-u04.editorial.js?v=20261115-biology-peer-opinions';
import{withStandaloneContextClassroom}from'../data/book/standalone-question-context.js?v=20261115-battery-polarity-card';
import{withElementaryPromptClassroom}from'../data/book/elementary-question-prompts.js?v=20261108-elementary-question-prompts';
import {withLifeElementaryClassroom} from '../data/book/s31-u04.elementary.js?v=20261108-life-elementary';
import{withLessonReferenceClassroom}from'../data/book/lesson-reference-data.js?v=20261115-standalone-model-data';
import{withEcologyElementaryClassroom}from'../data/book/c22-s42-u02.elementary.js?v=20261108-ecology-elementary';
import{withVersionedClassroomQuestions}from'./classroom-question-versions.js?v=20261108-classroom-review-versions';
import{withBiologyElementaryBankClassroom}from'../data/book/s41-u04.editorial.js?v=20261108-biology-elementary-bank';
import{withLandElementaryClassroom}from'../data/book/s41-u03.elementary.js?v=20261108-land-elementary';
import{withWaterElementaryClassroom}from'../data/book/s41-u02.elementary.js?v=20261108-water-elementary';
import{withMagnetElementaryClassroom}from'../data/book/s41-u01.elementary.js?v=20261108-magnet-elementary';
import{withGrade3PracticeClassroom}from'../data/book/c22-s32-practice-language.js?v=20261108-grade3-material-language&sound=20261115-sound-comparison-prompt&noise=20261115-sound-noise-practice&linked=20261115-sound-linked-explanations';
import{earthMotionPairCurrentItems}from'./earth-motion-pair-language.js?v=20261108-earth-motion-pair-language';
import{seasonPairCurrentItems}from'./season-pair-language.js?v=20261108-season-pair-language';
import{combustionPairCurrentItems}from'./combustion-pair-language.js?v=20261108-combustion-pair-language';
import{electricityPairCurrentItems}from'./electricity-pair-language.js?v=20261108-electricity-pair-language';
import{withComparisonLearnerCues}from'./comparison-material-language.js?v=20261123-comparison-school-language';
import{withSolutionLearnerCues}from'./solution-learning-language.js?v=20261108-solution-learning-language';
import{withLearnerClassGuidance}from'./learner-class-guidance.js?v=20261108-student-reading';
import{landReasoningCurrentItems}from'../data/book/s41-u03.editorial.js?v=20261105-land-learner-reasoning';
import{magnetReasoningCurrentItems}from'../data/book/s41-u01.rail-notes.js?v=20261105-magnet-learner-reasoning';
import{earthSeaReasoningCurrentItems}from'../data/book/c22-s32-u02.rail-notes.js?v=20261105-earth-sea-learner-reasoning';
import{withEarthSeaElementaryClassroom}from'../data/book/c22-s32-u02.elementary.js?v=20261108-earth-sea-elementary';
import{termParticleCurrentItems,guidanceParticleCurrentItems}from'../data/book/term-particle-language.js?v=20261105-guidance-particles';
import{observationCurrentItems}from'../data/book/observation-language.js';

import{careerCompareValues,validCareerCompareRow}from'./classroom-record-readers.js?v=20261116-lazy-unit-imports';
import{careerRecordInquiry as careerInquiry}from'./classroom-record-readers.js?v=20261116-lazy-unit-imports';

import{electricityCompareValues,validElectricityCompareRow}from'./classroom-record-readers.js?v=20261116-lazy-unit-imports';
import{inquiry as electricityInquiry}from'../data/activities/c22-s62-u03.inquiry.js?v=20261104-electricity-class';

import{combustionCompareValues,validCombustionCompareRow}from'./classroom-record-readers.js?v=20261116-lazy-unit-imports';
import{inquiry as combustionInquiry}from'../data/activities/c22-s62-u02.inquiry.js?v=20261104-combustion-class';

import{seasonCompareValues,validSeasonCompareRow}from'./classroom-record-readers.js?v=20261116-lazy-unit-imports';
import{inquiry as seasonInquiry}from'../data/activities/c22-s62-u01.inquiry.js?v=20261104-season-class';

import{earthMotionCompareValues,validEarthMotionCompareRow}from'./earth-motion-compare-model.js';
import{inquiry as earthMotionInquiry}from'../data/activities/c22-s61-u04.inquiry.js?v=20261104-earth-motion-class';

import{plantStructureCompareValues,validPlantStructureCompareRow}from'./plant-structure-compare-model.js';
import{inquiry as plantStructureInquiry}from'../data/activities/c22-s61-u03.inquiry.js?v=20261104-plant-structure-class';

import{motionCompareValues,validMotionCompareRow}from'./motion-compare-model.js';
import{inquiry as motionInquiry}from'../data/activities/c22-s61-u02.inquiry.js?v=20261104-motion-class';
// 검수한 사고력 수업만 선택 적용한다. 원래 실제 활동·기록 교재는 그대로 둔다.
import {revisedTextbook} from './revised-textbook.js?v=20261115-ecology-food-web-material&soundDirections=20261115-sound-workbook-directions&skyDirections=20261115-sky-workbook-directions&skyResponse=20261115-sky-response-review&gasContext=20261115-gas-workbook-context&gasPhoto=20261115-gas-photo-context&climateContext=20261115-climate-workbook-context&geologyReview=20261115-geology-response-review&lightContext=20261115-light-workbook-context&solutionContext=20261115-solution-workbook-context&bodyContext=20261115-body-workbook-context&mixtureContext=20261116-mixture-workbook-context&weatherContext=20261116-weather-workbook-context&heatContext=20261116-heat-workbook-context&energyContext=20261116-energy-workbook-context&acidContext=20261116-acid-workbook-context&motionContext=20261116-motion-workbook-context&plantContext=20261116-plant-workbook-context&earthMotionContext=20261116-earth-motion-workbook-context&seasonContext=20261116-season-workbook-context&combustionContext=20261116-combustion-workbook-context&electricityContext=20261116-electricity-workbook-context&careerContext=20261116-career-workbook-context&unitImports=20261116-lazy-unit-imports&railNotes=20261116-upper-notes&infectionWordAnswer=20261116-infection-word-answer-and-count&earthSeaFeedback=20261116-earth-sea-workbook-feedback&careerTemperature=20261116-career-temperature-condition&studentLanguage=20261117-student-language-review&exampleResponse=20261123-weather-example-response&tableLanguage=20261123-student-table-language&careerLanguage=20261123-career-comparison-language&comparisonWords=20261123-comparison-school-language&ecologyGuidance=20261123-ecology-guided-workbook&ecologyWriting=20261123-ecology-guided-writing&ecologyConservation=20261123-ecology-conservation&ecologyFoodweb=20261123-ecology-foodweb-tasks&forceDrawing=20261123-force-drawing-panels&forceGuided=20261123-force-guided-tasks&forceConcepts=20261123-force-concept-pages&animalGuided=20261123-animal-guided-tasks&animalConcepts=20261124-animal-concept-pages&plantGuided=20261124-plant-guided-tasks&plantConcepts=20261124-plant-concept-pages&lifeGuided=20261124-life-guided-tasks&lifeConcepts=20261124-life-concept-pages&materialGuided=20261124-material-guided-tasks&earthSeaGuided=20261124-earth-sea-guided-tasks&soundGuided=20261124-sound-guided-tasks&soundMixed=20261124-sound-mixed-responses&soundMixedLayout=1&infectionGuided=20261124-infection-guided-tasks&magnetGuided=20261124-magnet-guided-tasks&magnetMixed=20261124-magnet-mixed-responses&magnetMixedLayout=1&waterGuided=20261124-water-guided-tasks&waterProof=20261124-water-guided-layout&waterMixed=20261124-water-mixed-responses&waterMixedLayout=1&groundGuided=20261124-ground-guided-tasks&groundLayout=20261124-ground-photo-pages-final&groundMixed=20261124-ground-mixed-responses&groundMixedLayout=2&earlyDensity=20261124-early-science-page-density&earlyDensityLayout=4&biologyGuided=20261124-biology-guided-tasks&biologyLayout=6&biologyMixed=20261124-biology-mixed-responses&biologyMixedLayout=2&skyGuided=20261124-sky-guided-tasks&skyLayout=3&skyMixed=20261124-sky-mixed-responses&skyMixedLayout=1&gasGuided=20261124-gas-guided-tasks&gasLayout=6&gasMixed=20261124-gas-mixed-responses&gasMixedLayout=1&gasDensity=20261124-gas-page-density&gasDensityLayout=2&ecologyMixed=20261124-ecology-mixed-responses&ecologyMixedLayout=2&ecologyDensity=20261124-ecology-page-density&ecologyDensityLayout=2&climateGuided=20261124-climate-guided-tasks&climateLayout=5&climateMixed=20261124-climate-mixed-responses&climateMixedLayout=1&geologyGuided=20261124-geology-guided-tasks&geologyLayout=6&geologyMixed=20261124-geology-mixed-responses&geologyMixedLayout=2&lightGuided=20261124-light-guided-tasks&lightLayout=3&lightMixed=20261124-light-mixed-responses&lightMixedLayout=1&solutionGuided=20261124-solution-guided-tasks&solutionLayout=5&solutionMixed=20261124-solution-mixed-responses&solutionMixedLayout=1&solutionChoice=20261124-solution-choice-meaning&bodyGuided=20261124-body-guided-tasks&bodyLayout=2&bodyMixed=20261124-body-mixed-responses&bodyMixedLayout=1&bodyDensity=20261124-body-page-density&bodyDensityLayout=4&mixtureGuided=20261124-mixture-guided-tasks&mixtureLayout=3&mixtureMixed=20261124-mixture-mixed-responses&mixtureMixedLayout=1&heatGuided=20261124-heat-guided-tasks&heatLayout=3&heatMixed=20261124-heat-mixed-responses&heatMixedLayout=1&weatherGuided=20261124-weather-guided-tasks&weatherLayout=6&energyGuided=20261124-energy-guided-tasks&energyLayout=4&acidGuided=20261124-acid-guided-tasks&acidLayout=4&motionGuided=20261124-motion-guided-tasks&motionLayout=4&plantStructureGuided=20261124-plant-structure-mixed-responses&plantStructureLayout=6&earthMotionGuided=20261124-earth-motion-mixed-responses&earthMotionLayout=2&seasonGuided=20261124-season-mixed-responses&seasonLayout=2&combustionGuided=20261124-combustion-mixed-responses&combustionLayout=3&electricityGuided=20261124-electricity-mixed-responses&electricityLayout=2&careerGuided=20261124-career-mixed-responses&careerLayout=2&acidMixed=20261124-acid-mixed-responses&acidMixedLayout=1&motionMixed=20261124-motion-mixed-responses&motionMixedLayout=1&weatherMixed=20261124-weather-mixed-responses&weatherMixedLayout=1&energyMixed=20261124-energy-mixed-responses&energyMixedLayout=1';
import {FORCE_PREDICTIONS} from './force-model.js';

import {classifyRowValues,validClassifyRow} from './animal-classify.js';

import {leafRowValues,validLeafCompareRow} from './plant-classify.js';

import {lifeCompareValues,validLifeCompareRow} from './life-compare-model.js';

import {ecologyCompareValues,validEcologyCompareRow} from './ecology-compare-model.js';

import {materialCompareValues,validMaterialCompareRow} from './material-compare-model.js';

import {earthSeaCompareValues,validEarthSeaCompareRow} from './earth-sea-compare-model.js';

import {soundCompareValues,validSoundCompareRow} from './sound-compare-model.js';

import {infectionCompareValues,validInfectionCompareRow} from './infection-compare-model.js';

import {climateCompareValues,validClimateCompareRow} from './climate-compare-model.js';

import {skyCompareValues,validSkyCompareRow} from './sky-compare-model.js';

import {waterCompareValues,validWaterCompareRow} from './water-compare-model.js';

import {solutionCompareValues,validSolutionCompareRow} from './solution-compare-model.js';

import {groundCompareValues,validGroundCompareRow} from './ground-compare-model.js';

import {biologyCompareValues,validBiologyCompareRow,biologyBreadProgress} from './biology-compare-model.js';

import {magnetCompareValues,validMagnetCompareRow,magnetTowerProgress} from './magnet-compare-model.js';

import {gasCompareValues,validGasCompareRow} from './gas-compare-model.js';

import {geologyCompareValues,validGeologyCompareRow} from './geology-compare-model.js';

import {lightCompareValues,validLightCompareRow} from './light-compare-model.js';

import {mixtureCompareValues,validMixtureCompareRow} from './mixture-compare-model.js';

import {bodyCompareValues,validBodyCompareRow} from './body-compare-model.js';

import {heatCompareValues,validHeatCompareRow} from './heat-compare-model.js';

import {weatherCompareValues,validWeatherCompareRow} from './weather-compare-model.js';

import {energyCompareValues,validEnergyCompareRow} from './energy-compare-model.js';

import{acidCompareValues,validAcidCompareRow}from'./acid-compare-model.js';
import{acidRecordInquiry as acidInquiry}from'./classroom-record-readers.js?v=20261116-lazy-unit-imports';
const comparisonMounts={'career-compare':()=>import("./lab-career-compare.js?v=20261115-standalone-question-context&careerLanguage=20261123-career-comparison-language&comparisonWords=20261123-comparison-school-language").then(module=>module.mountCareerCompare),'electricity-compare':()=>import("./lab-electricity-compare.js?v=20261104-student-science-language&comparisonWords=20261123-comparison-school-language").then(module=>module.mountElectricityCompare),'combustion-compare':()=>import("./lab-combustion-compare.js?v=20261108-comparison-material-language&comparisonWords=20261123-comparison-school-language").then(module=>module.mountCombustionCompare),'season-compare':()=>import("./lab-season-compare.js?v=20261115-observation-question-context&comparisonWords=20261123-comparison-school-language").then(module=>module.mountSeasonCompare),'earth-motion-compare':()=>import("./lab-earth-motion-compare.js?v=20261104-earth-motion-class&comparisonWords=20261123-comparison-school-language").then(module=>module.mountEarthMotionCompare),'plant-structure-compare':()=>import("./lab-plant-structure-compare.js?v=20261108-grade3-class-guidance&comparisonWords=20261123-comparison-school-language").then(module=>module.mountPlantStructureCompare),'motion-compare':()=>import("./lab-motion-compare.js?v=20261104-motion-class&comparisonWords=20261123-comparison-school-language").then(module=>module.mountMotionCompare),'acid-compare':()=>import("./lab-acid-compare.js?v=20261104-acid-class&comparisonWords=20261123-comparison-school-language").then(module=>module.mountAcidCompare),'energy-compare':()=>import("./lab-energy-compare.js?v=20261104-energy-class&comparisonWords=20261123-comparison-school-language").then(module=>module.mountEnergyCompare),'weather-compare':()=>import("./lab-weather-compare.js?v=20261104-weather-class&comparisonWords=20261123-comparison-school-language").then(module=>module.mountWeatherCompare),'heat-compare':()=>import("./lab-heat-compare.js?comparisonWords=20261123-comparison-school-language").then(module=>module.mountHeatCompare),'mixture-compare':()=>import("./lab-mixture-compare.js?v=20261104-table-fix&comparisonWords=20261123-comparison-school-language").then(module=>module.mountMixtureCompare),'body-compare':()=>import("./lab-body-compare.js").then(module=>module.mountBodyCompare),'light-compare':()=>import("./lab-light-compare.js").then(module=>module.mountLightCompare),'geology-compare':()=>import("./lab-geology-compare.js?comparisonWords=20261123-comparison-school-language").then(module=>module.mountGeologyCompare),'gas-compare':()=>import("./lab-gas-compare.js?comparisonWords=20261123-comparison-school-language").then(module=>module.mountGasCompare),'magnet-compare':()=>import("./lab-magnet-compare.js?v=20261108-comparison-material-language&comparisonWords=20261123-comparison-school-language").then(module=>module.mountMagnetCompare),'biology-compare':()=>import("./lab-biology-compare.js?comparisonWords=20261123-comparison-school-language").then(module=>module.mountBiologyCompare),'ground-compare':()=>import("./lab-ground-compare.js?v=20261108-comparison-material-language&comparisonWords=20261123-comparison-school-language").then(module=>module.mountGroundCompare),'water-compare':()=>import("./lab-water-compare.js?v=20261108-comparison-material-language&comparisonWords=20261123-comparison-school-language").then(module=>module.mountWaterCompare),'solution-compare':()=>import("./lab-solution-compare.js?v=20261108-solution-learning-language&comparisonWords=20261123-comparison-school-language").then(module=>module.mountSolutionCompare),'sky-compare':()=>import("./lab-sky-compare.js?v=20261108-comparison-activity-guidance&comparisonWords=20261123-comparison-school-language").then(module=>module.mountSkyCompare),'climate-compare':()=>import("./lab-climate-compare.js?v=20261108-comparison-activity-guidance").then(module=>module.mountClimateCompare),'infection-compare':()=>import("./lab-infection-compare.js?v=20261108-comparison-activity-guidance").then(module=>module.mountInfectionCompare),'animal-compare':()=>import("./lab-animal-compare.js").then(module=>module.mountAnimalCompare),'plant-compare':()=>import("./lab-plant-compare.js").then(module=>module.mountPlantCompare),'life-compare':()=>import("./lab-life-compare.js?v=20261108-comparison-activity-guidance&comparisonWords=20261123-comparison-school-language").then(module=>module.mountLifeCompare),'ecology-compare':()=>import("./lab-ecology-compare.js?v=20261108-comparison-activity-guidance").then(module=>module.mountEcologyCompare),'material-compare':()=>import("./lab-material-compare.js?v=20261108-grade3-class-guidance").then(module=>module.mountMaterialCompare),'earth-sea-compare':()=>import("./lab-earth-sea-compare.js?v=20261108-comparison-activity-guidance").then(module=>module.mountEarthSeaCompare),'sound-compare':()=>import("./lab-sound-compare.js?v=20261108-comparison-activity-guidance").then(module=>module.mountSoundCompare)};
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
 ['c22-s42-u04', () => import('../data/book/c22-s42-u04.thinking-lesson.js?v=20261115-curriculum-area')],
 ['c22-s32-u04', () => import('../data/book/c22-s32-u04.thinking-lesson.js?v=20261115-curriculum-area')],
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
 const [book, lesson, contexts, readings] = await Promise.all([
  mod.chapter?.revisedCurriculumWorkbook ? mod : revisedTextbook(unit, mod),
  load(),
  classroomContextFor(unit),
  classroomReadingFor(unit),
 ]);
 const {biologyReadableCurrentItems,skyReadableCurrentItems,ecologyReadableCurrentItems,gasReadableCurrentItems,climateReadableCurrentItems,geologyReadableCurrentItems,lightReadableCurrentItems,solutionReadableCurrentItems,bodyReadableCurrentItems,mixtureReadableCurrentItems,heatReadableCurrentItems,weatherReadableCurrentItems,energyReadableCurrentItems,acidReadableCurrentItems,motionReadableCurrentItems,plantStructureReadableCurrentItems,earthMotionReadableCurrentItems,seasonReadableCurrentItems,combustionReadableCurrentItems,electricityReadableCurrentItems,careerReadableCurrentItems}=readings;
 const {withCareerContextClassroom,withElectricityContextClassroom,withCombustionContextClassroom,withSeasonContextClassroom,withEarthMotionContextClassroom,withPlantContextClassroom,withMotionContextClassroom,withAcidContextClassroom,withEnergyContextClassroom,withHeatContextClassroom,withWeatherContextClassroom,withMixtureContextClassroom,withBodyContextClassroom,withSolutionContextClassroom}=contexts;
 if(lesson.lab&&!Object.hasOwn(comparisonMounts,lesson.lab.kind))throw Error('수업 비교 활동이 연결되지 않았습니다.');
 const classroomLab=lesson.lab?{...lesson.lab,mount:await comparisonMounts[lesson.lab.kind]()} :undefined;
 const result=withCareerContextClassroom(unit,withElectricityContextClassroom(unit,withCombustionContextClassroom(unit,withSeasonContextClassroom(unit,withEarthMotionContextClassroom(unit,withPlantContextClassroom(unit,withMotionContextClassroom(unit,withAcidContextClassroom(unit,withEnergyContextClassroom(unit,withHeatContextClassroom(unit,withWeatherContextClassroom(unit,withMixtureContextClassroom(unit,withBodyContextClassroom(unit,withSolutionContextClassroom(unit,withEarthSeaChoiceClassroom(unit,withRepresentationClassroom(unit,withMaterialReadingClassroom(unit,withGrade6QuestionReviewClassroom(unit,withGrade5QuestionReviewClassroom(unit,withGrade4QuestionReviewClassroom(unit,withReviewedCriteriaClassroom(unit,withLinkedWorkbookAnswersClassroom(unit,withWeatherDrawingCriteriaClassroom(unit,withSeasonComparisonClassroom(unit,withBiologyOpinionClassroom(unit,withStandaloneContextClassroom(unit,withElementaryPromptClassroom(unit,withLifeElementaryClassroom(unit,withLessonReferenceClassroom(unit,withEcologyElementaryClassroom(unit,await withVersionedClassroomQuestions(unit,withBiologyElementaryBankClassroom(unit,withLandElementaryClassroom(unit,withWaterElementaryClassroom(unit,withMagnetElementaryClassroom(unit,withGrade3PracticeClassroom(unit,withEarthSeaElementaryClassroom(unit,withLearnerClassGuidance(withSolutionLearnerCues(withComparisonLearnerCues({...book, chapter:{...book.chapter, ...lesson.chapter,revisedThinkingClassroom:true}, plan:lesson.plan, classroomItems:earthMotionPairCurrentItems(seasonPairCurrentItems(combustionPairCurrentItems(electricityPairCurrentItems(careerReadableCurrentItems(electricityReadableCurrentItems(combustionReadableCurrentItems(seasonReadableCurrentItems(earthMotionReadableCurrentItems(plantStructureReadableCurrentItems(motionReadableCurrentItems(acidReadableCurrentItems(energyReadableCurrentItems(weatherReadableCurrentItems(heatReadableCurrentItems(mixtureReadableCurrentItems(bodyReadableCurrentItems(solutionReadableCurrentItems(lightReadableCurrentItems(geologyReadableCurrentItems(climateReadableCurrentItems(gasReadableCurrentItems(ecologyReadableCurrentItems(skyReadableCurrentItems(biologyReadableCurrentItems(landReasoningCurrentItems(magnetReasoningCurrentItems(earthSeaReasoningCurrentItems(guidanceParticleCurrentItems(termParticleCurrentItems(observationCurrentItems(lesson.classroomItems||lesson.checks,unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),unit),classroomLab}))))))))))))))))))))))))))))))))))))))));
 if(unit==='s31-u02')return(await import('./animal-guided-review.js?v=20261123-animal-guided-tasks')).withAnimalGuidedClassroom(unit,result);
 if(unit==='s31-u03')return(await import('./plant-guided-review.js?v=20261124-plant-guided-tasks')).withPlantGuidedClassroom(unit,result);
 if(unit==='c22-s62-u04')return(await import('./career-guided-review.js?v=20261124-career-mixed-responses&layout=2')).withCareerGuidedClassroom(unit,result);
 if(unit==='c22-s62-u03')return(await import('./electricity-guided-review.js?v=20261124-electricity-mixed-responses&layout=2')).withElectricityGuidedClassroom(unit,result);
 if(unit==='c22-s62-u02')return(await import('./combustion-guided-review.js?v=20261124-combustion-mixed-responses&layout=3')).withCombustionGuidedClassroom(unit,result);
 if(unit==='c22-s62-u01')return(await import('./season-guided-review.js?v=20261124-season-mixed-responses&layout=2')).withSeasonGuidedClassroom(unit,result);
 if(unit==='c22-s61-u04')return(await import('./earth-motion-guided-review.js?v=20261124-earth-motion-mixed-responses&layout=2')).withEarthMotionGuidedClassroom(unit,result);
 if(unit==='c22-s61-u03')return(await import('./plant-structure-guided-review.js?v=20261124-plant-structure-mixed-responses&layout=6')).withPlantStructureGuidedClassroom(unit,result);
 if(unit==='c22-s61-u02'){const guided=(await import('./motion-guided-review.js?v=20261124-motion-guided-tasks&layout=4')).withMotionGuidedClassroom(unit,result);return(await import('./motion-mixed-response.js?v=20261124-motion-mixed-responses&layout=1')).withMotionMixedClassroom(unit,guided);}
 if(unit==='c22-s61-u01'){const guided=(await import('./acid-guided-review.js?v=20261124-acid-guided-tasks&layout=4')).withAcidGuidedClassroom(unit,result);return(await import('./acid-mixed-response.js?v=20261124-acid-mixed-responses&layout=1')).withAcidMixedClassroom(unit,guided);}
 if(unit==='c22-s52-u04'){const guided=(await import('./energy-guided-review.js?v=20261124-energy-guided-tasks&layout=4')).withEnergyGuidedClassroom(unit,result);return(await import('./energy-mixed-response.js?v=20261124-energy-mixed-responses&layout=1')).withEnergyMixedClassroom(unit,guided);}
 if(unit==='c22-s52-u03'){const guided=(await import('./weather-guided-review.js?v=20261124-weather-guided-tasks&layout=6')).withWeatherGuidedClassroom(unit,result);return(await import('./weather-mixed-response.js?v=20261124-weather-mixed-responses&layout=1')).withWeatherMixedClassroom(unit,guided);}
 if(unit==='c22-s52-u02'){const guided=(await import('./heat-guided-review.js?v=20261124-heat-guided-tasks&layout=3')).withHeatGuidedClassroom(unit,result);return(await import('./heat-mixed-response.js?v=20261124-heat-mixed-responses&layout=1')).withHeatMixedClassroom(unit,guided);}
 if(unit==='c22-s52-u01'){const guided=(await import('./mixture-guided-review.js?v=20261124-mixture-guided-tasks&layout=3')).withMixtureGuidedClassroom(unit,result);return(await import('./mixture-mixed-response.js?v=20261124-mixture-mixed-responses&layout=1')).withMixtureMixedClassroom(unit,guided);}
 if(unit==='c22-s51-u04'){const guided=(await import('./body-guided-review.js?v=20261124-body-guided-tasks&layout=2')).withBodyGuidedClassroom(unit,result);return(await import('./body-mixed-response.js?v=20261124-body-mixed-responses&layout=1')).withBodyMixedClassroom(unit,guided);}
 if(unit==='c22-s51-u03'){const guided=(await import('./solution-guided-review.js?v=20261124-solution-guided-tasks&layout=5')).withSolutionGuidedClassroom(unit,result);return(await import('./solution-mixed-response.js?v=20261124-solution-mixed-responses&layout=1&solutionChoice=20261124-solution-choice-meaning')).withSolutionMixedClassroom(unit,guided);}
 if(unit==='c22-s51-u02'){const guided=(await import('./light-guided-review.js?v=20261124-light-guided-tasks&layout=3')).withLightGuidedClassroom(unit,result);return(await import('./light-mixed-response.js?v=20261124-light-mixed-responses&layout=1')).withLightMixedClassroom(unit,guided);}
 if(unit==='c22-s51-u01'){const guided=(await import('./geology-guided-review.js?v=20261124-geology-guided-tasks&layout=6')).withGeologyGuidedClassroom(unit,result);return(await import('./geology-mixed-response.js?v=20261124-geology-mixed-responses&layout=2')).withGeologyMixedClassroom(unit,guided);}
 if(unit==='c22-s42-u04'){const guided=(await import('./climate-guided-review.js?v=20261124-climate-guided-tasks&layout=5')).withClimateGuidedClassroom(unit,result);return(await import('./climate-mixed-response.js?v=20261124-climate-mixed-responses&layout=1')).withClimateMixedClassroom(unit,guided);}
 if(unit==='c22-s42-u03'){const guided=(await import('./gas-guided-review.js?v=20261124-gas-guided-tasks&layout=6')).withGasGuidedClassroom(unit,result);return(await import('./gas-mixed-response.js?v=20261124-gas-mixed-responses&layout=1')).withGasMixedClassroom(unit,guided);}
 if(unit==='c22-s42-u01'){const{withSkyGuidedClassroom}=await import('./sky-guided-review.js?v=20261124-sky-guided-tasks&layout=3');return(await import('./sky-mixed-response.js?v=20261124-sky-mixed-responses&layout=1')).withSkyMixedClassroom(unit,withSkyGuidedClassroom(unit,result));}
 if(unit==='s41-u04'){const{withBiologyGuidedClassroom}=await import('./biology-guided-review.js?v=20261124-biology-guided-tasks&layout=4');return(await import('./biology-mixed-response.js?v=20261124-biology-mixed-responses&layout=2')).withBiologyMixedClassroom(unit,withBiologyGuidedClassroom(unit,result));}
 if(unit==='s41-u03'){const{withGroundGuidedClassroom}=await import('./ground-guided-review.js?v=20261124-ground-guided-tasks&groundLayout=20261124-ground-photo-pages-final&groundMixed=20261124-ground-mixed-responses&groundMixedLayout=2&earlyDensity=20261124-early-science-page-density&earlyDensityLayout=4');return(await import('./ground-mixed-response.js?v=20261124-ground-mixed-responses&layout=2')).withGroundMixedClassroom(unit,withGroundGuidedClassroom(unit,result));}
 if(unit==='s41-u02'){const{withWaterGuidedClassroom}=await import('./water-guided-review.js?v=20261124-water-guided-tasks&waterProof=20261124-water-guided-layout&waterMixed=20261124-water-mixed-responses&waterMixedLayout=1');return(await import('./water-mixed-response.js?v=20261124-water-mixed-responses&layout=1')).withWaterMixedClassroom(unit,withWaterGuidedClassroom(unit,result));}
 if(unit==='s41-u01'){const{withMagnetGuidedClassroom}=await import('./magnet-guided-review.js?v=20261124-magnet-guided-tasks');return(await import('./magnet-mixed-response.js?v=20261124-magnet-mixed-responses&layout=1')).withMagnetMixedClassroom(unit,withMagnetGuidedClassroom(unit,result));}
 if(unit==='c22-s32-u04')return(await import('./infection-guided-review.js?v=20261124-infection-guided-tasks')).withInfectionGuidedClassroom(unit,result);
 if(unit==='c22-s32-u03'){const{withSoundGuidedClassroom}=await import('./sound-guided-review.js?v=20261124-sound-guided-tasks');return(await import('./sound-mixed-response.js?v=20261124-sound-mixed-responses&layout=1')).withSoundMixedClassroom(unit,withSoundGuidedClassroom(unit,result));}
 if(unit==='c22-s32-u02')return(await import('./earth-sea-guided-review.js?v=20261124-earth-sea-guided-tasks')).withEarthSeaGuidedClassroom(unit,result);
 if(unit==='c22-s32-u01')return(await import('./material-guided-review.js?v=20261124-material-guided-tasks')).withMaterialGuidedClassroom(unit,result);
 if(unit==='s31-u04')return(await import('./life-guided-review.js?v=20261124-life-guided-tasks')).withLifeGuidedClassroom(unit,result);
 if(unit==='s31-u01')return(await import('./force-guided-review.js?v=20261123-force-guided-tasks')).withForceGuidedClassroom(unit,result);
 if(unit!=='c22-s42-u02')return result;
 const written=(await import('./ecology-writing-review.js?v=20261123-ecology-guided-writing')).withEcologyWritingClassroom(unit,result);
 const conserved=(await import('./ecology-conservation-review.js?v=20261123-ecology-conservation')).withEcologyConservationClassroom(unit,written);
 const foodweb=(await import('./ecology-foodweb-review.js?v=20261123-ecology-foodweb-tasks')).withEcologyFoodwebClassroom(unit,conserved);return(await import('./ecology-mixed-response.js?v=20261124-ecology-mixed-responses&layout=1')).withEcologyMixedClassroom(unit,foodweb);
}

export function classroomQuestions(mod, pool) {
 if(!mod?.classroomItems) return pool;
 const updated=new Map(mod.classroomItems.map(item=>[item.id,item]));
 return pool.map(item=>(item.contentVersion==='20261117-student-language-review'||item.id==='c22-s52-u03-b050'&&item.contentVersion==='20261123-weather-example-response')?item:updated.get(item.id) || item);
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
