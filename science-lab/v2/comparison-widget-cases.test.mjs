import test from 'node:test';import assert from 'node:assert/strict';
import {exerciseComparisonWidgets,assertComparisonCaseControls} from './tests/comparison-widget-cases.mjs';
import {CLIMATE_LEVELS} from './climate-compare-model.js';
test('every production comparison uses every model case value, including all four climate levels, and restores its original record',async()=>{
 const result=await exerciseComparisonWidgets();assert.equal(result.units.length,31);assert.equal(result.snapshots.length,206);assert.equal(result.reads+result.writes+result.network+result.audio,0);
 const climate=result.snapshots.filter(s=>s.kind==='climate-compare');assert.deepEqual(climate.map(s=>s.emitted.rows[0].level),[...CLIMATE_LEVELS]);assert.equal(result.units.find(s=>s.kind==='climate-compare').cases,CLIMATE_LEVELS.length);
});
test('case coverage rejects a missing level selector, missing values and an unclassified extra selector',async()=>{
 await assert.rejects(assertComparisonCaseControls('climate-compare',[]));const controls=[{attrs:{'data-climate-compare-level':''},options:CLIMATE_LEVELS.map(value=>({value:String(value)}))}];await assertComparisonCaseControls('climate-compare',controls);
 await assert.rejects(assertComparisonCaseControls('climate-compare',[{...controls[0],options:controls[0].options.slice(0,1)}]));await assert.rejects(assertComparisonCaseControls('climate-compare',[...controls,{attrs:{'data-climate-compare-new-control':''},options:[{value:'a'}]}]));
});
