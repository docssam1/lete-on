'use strict';

const assert=require('node:assert/strict');
const provider=require('../challenge/variant-provider.js');
const diagnosis=require('../challenge/diagnosis-core.js');
const guide=require('../challenge/concept-guide.js');
const conceptCatalog=require('../challenge/concept-catalog.js');

const providerRows=provider.list();
const providerByKey=new Map(providerRows.map(row=>[row.key,row]));
const rows=[];
for(let round=1;round<=4;round++){
  const described=diagnosis.describeRound(round);
  rows.push(...described.questions,...described.extra);
}
assert.equal(providerRows.length,104,'all four rounds and additional-practice occurrences must be registered');
assert.equal(rows.length,104,'all taxonomy occurrences must resolve');
assert.equal(new Set(rows.map(row=>row.occurrenceId)).size,104,'occurrence keys must be unique');

const areas=new Set();
const majorTypes=new Set();
const subtypes=new Set();
const evidenceCounts={catalog:0,solution:0};
let resolved=0;

for(const row of rows){
  const taxonomy=row.taxonomy;
  assert.ok(taxonomy&&taxonomy.areaId&&taxonomy.areaLabel,'area taxonomy is required');
  assert.ok(taxonomy.subareaId&&taxonomy.subareaLabel,'major-type taxonomy is required');
  assert.ok(taxonomy.typeId&&taxonomy.typeLabel,'subtype taxonomy is required');
  areas.add(taxonomy.areaId);
  majorTypes.add(`${taxonomy.areaId}:${taxonomy.subareaId}`);
  subtypes.add(`${taxonomy.areaId}:${taxonomy.subareaId}:${taxonomy.typeId}`);

  const concept=guide.forRow(row);
  assert.equal(concept.typeId,taxonomy.typeId,'concept subtype must match taxonomy');
  assert.equal(concept.hierarchy.area.id,taxonomy.areaId,'concept area must match taxonomy');
  assert.equal(concept.hierarchy.majorType.id,taxonomy.subareaId,'concept major type must match taxonomy');
  assert.equal(concept.hierarchy.subtype.id,taxonomy.typeId,'concept subtype hierarchy must match taxonomy');
  assert.equal(concept.status,'verified','unverified concepts must not be shown');
  assert.equal(concept.evidenceStatus,'verified','concept evidence must be verified');
  assert.equal(concept.steps.length,3,'each concept must have exactly three child-sized steps');
  for(const field of ['title','rule','commonMistake','selfCheck','evidenceLabel','evidenceId']){
    assert.equal(typeof concept[field],'string',`${field} must be text`);
    assert.ok(concept[field].trim(),`${field} must not be empty`);
  }
  concept.steps.forEach(step=>assert.ok(typeof step==='string'&&step.trim(),'concept step must be text'));
  assert.ok(!Object.prototype.hasOwnProperty.call(concept,'answer'),'concept must not expose an answer');
  assert.ok(!Object.prototype.hasOwnProperty.call(concept,'prompt'),'concept must not expose the source prompt');
  assert.ok(!Object.prototype.hasOwnProperty.call(concept,'solution'),'concept must not expose a worked source solution');
  const providerRow=providerByKey.get(`${row.round}-${row.section}-${row.number}`);
  assert.ok(providerRow,'taxonomy occurrence must have a generator registration');
  assert.notEqual(concept.rule,provider.getSource(providerRow).prompt,'concept rule must not copy a complete source prompt');
  const evidenceFamily=concept.evidenceId.split(':',1)[0];
  assert.ok(Object.prototype.hasOwnProperty.call(evidenceCounts,evidenceFamily),'known evidence family is required');
  evidenceCounts[evidenceFamily]++;
  resolved++;
}

assert.equal(areas.size,8,'taxonomy must expose eight areas');
assert.equal(majorTypes.size,14,'taxonomy must expose fourteen area-scoped major types');
assert.equal(subtypes.size,60,'taxonomy must expose sixty area-scoped subtypes');
assert.equal(guide.typeCount,60,'concept registry must cover every subtype exactly once');
assert.equal(guide.catalogBackedCount,53,'catalog-backed concept count changed unexpectedly');
assert.equal(guide.solutionBackedCount,7,'solution-backed concept count changed unexpectedly');
assert.equal(evidenceCounts.catalog+evidenceCounts.solution,resolved,'every occurrence must have one evidence family');

const catalogIds=new Set(conceptCatalog.build().map(lesson=>lesson.id));
const taxonomyByType=new Map(rows.map(row=>[row.taxonomy.typeId,row.taxonomy]));
let catalogReferences=0,solutionReferences=0;
for(const typeId of guide.listTypeIds()){
  const taxonomy=taxonomyByType.get(typeId);
  assert.ok(taxonomy,`concept subtype ${typeId} must occur in the registered bank`);
  const evidenceId=guide.get(taxonomy).evidenceId;
  if(evidenceId.startsWith('catalog:')){
    const lessonId=evidenceId.slice('catalog:'.length);
    assert.ok(catalogIds.has(lessonId),`catalog evidence must exist: ${evidenceId}`);
    catalogReferences++;
    continue;
  }
  const match=evidenceId.match(/^solution:source:(\d+)-(main|extra)-(\d+)$/);
  assert.ok(match,`solution evidence must name a stable source occurrence: ${evidenceId}`);
  const sourceKey=`${match[1]}-${match[2]}-${Number(match[3])}`,providerRow=providerByKey.get(sourceKey);
  assert.ok(providerRow,`solution evidence source must exist: ${sourceKey}`);
  const described=rows.find(row=>row.round===Number(match[1])&&row.section===match[2]&&row.number===Number(match[3]));
  assert.equal(described.taxonomy.typeId,typeId,`solution evidence must belong to subtype ${typeId}`);
  const difficulty=providerRow.eligibility.same?'same':providerRow.eligibility.easy?'easy':'hard';
  let generated=null;
  for(const seed of [17,41,73,101]){
    const result=provider.generate({...providerRow,difficulty,seed});
    if(result.status==='verified'){generated=result.question;break;}
  }
  assert.ok(generated&&typeof generated.solution==='string'&&generated.solution.trim(),`solution evidence must resolve to a verified explanation: ${sourceKey}`);
  solutionReferences++;
}
assert.equal(catalogReferences,guide.catalogBackedCount,'every catalog-backed concept must resolve');
assert.equal(solutionReferences,guide.solutionBackedCount,'every solution-backed concept must resolve');

const sample=guide.forRow(rows[0]);
assert.ok(Object.isFrozen(sample)&&Object.isFrozen(sample.steps)&&Object.isFrozen(sample.hierarchy),'returned concepts must be immutable');

console.log(JSON.stringify({
  status:'passed',
  occurrences:rows.length,
  areas:areas.size,
  majorTypes:majorTypes.size,
  subtypes:subtypes.size,
  conceptProfiles:guide.typeCount,
  evidenceReferences:{catalog:catalogReferences,solution:solutionReferences},
  occurrenceEvidence:evidenceCounts,
  answerFieldsExposed:0,
  promptFieldsExposed:0
},null,2));
