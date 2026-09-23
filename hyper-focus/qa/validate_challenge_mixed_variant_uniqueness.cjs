'use strict';

const assert=require('node:assert/strict');
const identity=require('../challenge/question-identity.js');
const provider=require('../challenge/variant-provider.js');

let checks=0;
function ok(value,message){assert.ok(value,message);checks++;}
function canonical(question){const signatures=identity.signatures(question);return `${signatures.visible}\u241e${signatures.payload}`;}
function selectedSeeds(result){return result.selections.map(selection=>selection.selectedSeed);}

const first={
 id:'generated-a',
 prompt:'그림을 보고 답하세요.',
 problemHtml:'<svg id="seed-a"><defs><clipPath id="clip-a"/></defs><g data-seed="1"></g></svg>',
 payload:{kind:'fixed-picture',layout:[[1,0],[0,1]],seed:1,difficulty:'same',sourceTypeId:'source-a',typeId:'type-a',answer:4}
};
const sameVariantWithDifferentMetadata={
 id:'generated-b',
 prompt:'  그림을 보고  답하세요. ',
 problemHtml:'<svg id="seed-b"><defs><clipPath id="clip-b"/></defs><g data-seed="999"></g></svg>',
 payload:{answer:99,typeId:'type-b',sourceTypeId:'source-b',difficulty:'hard',seed:999,layout:[[1,0],[0,1]],kind:'fixed-picture'}
};
const differentVariant={...sameVariantWithDifferentMetadata,problemHtml:'<svg><g><circle cx="10" cy="10" r="4"/></g></svg>',payload:{kind:'fixed-picture',layout:[[1,1],[0,1]],seed:999}};

ok(canonical(first)===canonical(sameVariantWithDifferentMetadata),'seed, difficulty, type, source and answer metadata must not change canonical identity');
ok(canonical(first)!==canonical(differentVariant),'a genuinely different drawing and condition must have a different canonical identity');

// These two source occurrences are known to produce the same initial visible
// pencil/eraser/clip task. The batch selector must advance the second seed,
// not hold the whole worksheet and not accept the duplicate.
const collisionRequests=[
 {round:1,section:'main',number:14,difficulty:'easy',seed:8},
 {round:3,section:'extra',number:4,difficulty:'easy',seed:4}
];
const initialCollision=collisionRequests.map(request=>provider.generate(request));
ok(initialCollision.every(result=>result.status==='verified'),'known collision controls must generate');
ok(canonical(initialCollision[0].question)===canonical(initialCollision[1].question),'known collision controls must begin with the same canonical task');
const resolved=provider.generateBatch(collisionRequests);
ok(resolved.status==='verified'&&resolved.count===2,'known collision mix must return the requested two questions');
ok(new Set(resolved.questions.map(canonical)).size===2,'known collision mix must contain two canonical-unique questions');
ok(resolved.selections[1].selectedSeed!==collisionRequests[1].seed&&resolved.selections[1].duplicateCandidates>=1,'known collision must deterministically advance to the next unique seed candidate');
const resolvedReplay=provider.generateBatch(collisionRequests);
ok(JSON.stringify(selectedSeeds(resolved))===JSON.stringify(selectedSeeds(resolvedReplay)),'collision resolution must be reproducible');
ok(JSON.stringify(resolved.questions.map(canonical))===JSON.stringify(resolvedReplay.questions.map(canonical)),'resolved canonical tasks must be reproducible');

// A payload-only difference must not make the exact same learner-visible task
// eligible twice. This pair previously bypassed the combined signature check.
const visibleOnlyCollisionRequests=[
 {round:1,section:'main',number:9,difficulty:'easy',seed:31},
 {round:1,section:'main',number:9,difficulty:'easy',seed:49}
];
const visibleOnlyInitial=visibleOnlyCollisionRequests.map(request=>provider.generate(request));
ok(visibleOnlyInitial.every(result=>result.status==='verified'),'visible-only collision controls must generate');
const visibleOnlyInitialSignatures=visibleOnlyInitial.map(result=>identity.signatures(result.question));
ok(visibleOnlyInitialSignatures[0].visible===visibleOnlyInitialSignatures[1].visible,'visible-only collision controls must begin with the same learner-visible task');
ok(visibleOnlyInitialSignatures[0].payload!==visibleOnlyInitialSignatures[1].payload,'visible-only collision controls must differ only in canonical payload');
const visibleOnlyResolved=provider.generateBatch(visibleOnlyCollisionRequests);
ok(visibleOnlyResolved.status==='verified'&&visibleOnlyResolved.count===2,'visible-only collision mix must return the requested two questions');
ok(new Set(visibleOnlyResolved.questions.map(question=>identity.signatures(question).visible)).size===2,'payload metadata must never permit a repeated learner-visible task');
ok(visibleOnlyResolved.selections[1].duplicateCandidates>=1,'visible-only collision must advance past the duplicate candidate');

// The easy paper-fold source has exactly four visible+condition models. Four
// repeated requests must all be filled; only the fifth may be held after the
// deterministic candidate pool proves that no fifth canonical model remains.
const finiteFoldRequest={round:1,section:'extra',number:3,difficulty:'easy',seed:123};
const fourFoldModels=provider.generateBatch(Array.from({length:4},()=>({...finiteFoldRequest})),{poolCapacity:256});
ok(fourFoldModels.status==='verified'&&fourFoldModels.count===4,'all four available fixed fold variants must be returned');
ok(new Set(fourFoldModels.questions.map(canonical)).size===4,'the four returned fold variants must be canonical-unique');
const exhaustedFoldModels=provider.generateBatch(Array.from({length:5},()=>({...finiteFoldRequest})),{poolCapacity:256});
ok(exhaustedFoldModels.status==='held'&&exhaustedFoldModels.index===4&&exhaustedFoldModels.acceptedUnique===4,'held is allowed only after the finite four-variant fold pool is exhausted');

const rows=provider.list();
const reports=[];
for(const difficulty of ['easy','same','hard']){
 const baseSeed=730000+difficulty.length*10000;
 const requests=rows.filter(row=>row.eligibility[difficulty]).map((row,index)=>({...row,difficulty,seed:(baseSeed+index*1009)>>>0}));
 const result=provider.generateBatch(requests);
 assert.equal(result.status,'verified',`${difficulty} mixed worksheet must resolve duplicate candidates: ${result.reason||''}`);
 assert.equal(result.questions.length,requests.length,`${difficulty} mixed worksheet must return the requested count`);
 const signatures=result.questions.map(canonical);
 assert.equal(new Set(signatures).size,signatures.length,`${difficulty} mixed worksheet must have no repeated canonical task`);
 const signatureFields=result.questions.map(question=>identity.signatures(question));
 for(const kind of ['visible','payload','id']){
  const values=signatureFields.map(item=>item[kind]).filter(Boolean);
  assert.equal(new Set(values).size,values.length,`${difficulty} mixed worksheet must have no repeated ${kind} signature`);
 }
 assert.equal(result.uniqueCanonicalVariants,requests.length,`${difficulty} mixed worksheet must report its unique canonical count`);
 const replay=provider.generateBatch(requests);
 assert.equal(replay.status,'verified',`${difficulty} mixed worksheet replay must generate`);
 assert.deepEqual(selectedSeeds(replay),selectedSeeds(result),`${difficulty} mixed worksheet selected seeds must be deterministic`);
 assert.deepEqual(replay.questions.map(canonical),signatures,`${difficulty} mixed worksheet canonical tasks must be deterministic`);
 reports.push({
  difficulty,
  requested:requests.length,
  returned:result.questions.length,
  uniqueCanonical:new Set(signatures).size,
  uniqueVisible:new Set(signatureFields.map(item=>item.visible).filter(Boolean)).size,
  uniquePayload:new Set(signatureFields.map(item=>item.payload).filter(Boolean)).size,
  uniqueIds:new Set(signatureFields.map(item=>item.id).filter(Boolean)).size,
  collisionCandidatesSkipped:result.selections.reduce((sum,selection)=>sum+selection.duplicateCandidates,0),
  advancedSelections:result.selections.filter(selection=>selection.attempts>1).length
 });
 checks+=10;
}

console.log(JSON.stringify({status:'passed',checks,knownCollisionResolved:true,visibleOnlyCollisionResolved:true,finitePoolHeldOnlyAfterExhaustion:true,reports,metadataCannotBypassCanonicalIdentity:true},null,2));
