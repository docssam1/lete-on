import{mixtureMixedItems}from'../mixture-mixed-response.js';
import{energyMixedItems}from'../energy-mixed-response.js';
import{weatherMixedItems}from'../weather-mixed-response.js';
import{motionMixedItems}from'../motion-mixed-response.js';
import{acidMixedItems}from'../acid-mixed-response.js';
import{careerGuidedItems}from'../career-guided-review.js';
import{electricityGuidedItems}from'../electricity-guided-review.js';
import{combustionGuidedItems}from'../combustion-guided-review.js';
import{seasonGuidedItems}from'../season-guided-review.js';
import{earthMotionGuidedItems}from'../earth-motion-guided-review.js';
import{plantStructureGuidedItems}from'../plant-structure-guided-review.js';
import{motionGuidedItems}from'../motion-guided-review.js';
import{acidGuidedItems}from'../acid-guided-review.js';
import{energyGuidedItems}from'../energy-guided-review.js';
import{weatherGuidedItems}from'../weather-guided-review.js';
import{heatGuidedItems}from'../heat-guided-review.js';
import{mixtureGuidedItems}from'../mixture-guided-review.js';
import{bodyGuidedItems}from'../body-guided-review.js';
import{solutionGuidedItems}from'../solution-guided-review.js';
import{lightGuidedItems}from'../light-guided-review.js';
import{geologyGuidedItems}from'../geology-guided-review.js';
import{climateGuidedItems}from'../climate-guided-review.js';
import{gasGuidedItems}from'../gas-guided-review.js';
import{skyGuidedItems}from'../sky-guided-review.js';
import{biologyGuidedItems}from'../biology-guided-review.js';
import{groundGuidedItems}from'../ground-guided-review.js';
import{waterGuidedItems}from'../water-guided-review.js';
import{magnetGuidedItems}from'../magnet-guided-review.js';
import{infectionGuidedItems}from'../infection-guided-review.js';
import{soundGuidedItems}from'../sound-guided-review.js';
import{earthSeaGuidedItems}from'../earth-sea-guided-review.js';
import{materialGuidedItems}from'../material-guided-review.js';
import{lifeGuidedItems}from'../life-guided-review.js';
import{plantGuidedItems}from'../plant-guided-review.js';
import{animalGuidedItems}from'../animal-guided-review.js';
import{forceGuidedItems}from'../force-guided-review.js';
import fs from'node:fs';import vm from'node:vm';import path from'node:path';import assert from'node:assert/strict';import{fileURLToPath,pathToFileURL}from'node:url';
const root=path.resolve(fileURLToPath(new URL('../../../',import.meta.url))),load=p=>import(pathToFileURL(root+'/'+p)),{withThink}=await load('science-lab/v2/think-merge.js'),{revisedTextbookUnits}=await load('science-lab/v2/revised-textbook.js'),{classroomQuestions}=await load('science-lab/v2/revised-lesson.js'),{priorWritingClassroom:revisedClassroom}=await load('science-lab/v2/tests/ecology-writing-stage.mjs'),{buildSlides}=await load('science-lab/v2/deck.js'),{deckSlideRecordKey,deckQuestionSnapshot,withVersionedQuestionSlides}=await load('science-lab/v2/deck-answer-state.js'),src=fs.readFileSync(root+'/science-lab/v2/v2.js','utf8'),context=vm.createContext({withThink}),dynamic=async spec=>{const exports=await load(path.posix.normalize('science-lab/v2/'+spec.split('?')[0])),m=new vm.SyntheticModule(Object.keys(exports),function(){for(const[k,v]of Object.entries(exports))this.setExport(k,v);},{context});await m.link(()=>{});await m.evaluate();return m;},start=src.indexOf('const UNITS = ')+14,end=src.indexOf('\n// 문제은행만',start),loaders=new vm.Script('('+src.slice(start,end).trim().replace(/;$/,'')+')',{importModuleDynamically:dynamic}).runInContext(context);let reads=0,writes=0,network=0,linked=0,canonicalItems=0,canonicalOverlays=0,selected=0,versionedSlides=0;
globalThis.localStorage={getItem(){reads++;throw Error('student read');},setItem(){writes++;throw Error('student write');}};globalThis.fetch=()=>{network++;throw Error('network');};
for(const unit of revisedTextbookUnits){
 const loaded=await loaders[unit](),guided=rows=>[careerGuidedItems,electricityGuidedItems,combustionGuidedItems,seasonGuidedItems,earthMotionGuidedItems,forceGuidedItems,animalGuidedItems,plantGuidedItems,lifeGuidedItems,materialGuidedItems,earthSeaGuidedItems,soundGuidedItems,infectionGuidedItems,magnetGuidedItems,waterGuidedItems,groundGuidedItems,biologyGuidedItems,skyGuidedItems,gasGuidedItems,climateGuidedItems,geologyGuidedItems,lightGuidedItems,solutionGuidedItems,bodyGuidedItems,mixtureGuidedItems,mixtureMixedItems,heatGuidedItems,weatherGuidedItems,weatherMixedItems,energyGuidedItems,energyMixedItems,acidGuidedItems,acidMixedItems,motionGuidedItems,motionMixedItems,plantStructureGuidedItems].reduce((items,review)=>review(items,unit),rows),data={...loaded,items:guided(loaded.items),similar:guided(loaded.similar)},mod=await revisedClassroom(unit,await load('science-lab/data/book/'+unit+'.book.js')),pool=classroomQuestions(mod,[...(data.similar||[]),...data.items]);
 for(const q of mod.classroomItems){if(['similar','original'].includes(q.sourceRef?.type)){const canonical=[...(data.similar||[]),...data.items,...(data.source||[])].find(it=>it.id===q.id);assert(canonical,`${unit}: missing canonical ${q.id}`);for(const key of['answerContract','responseContract','sourceRef'])assert.deepEqual(q[key],canonical[key],`${unit}: changed canonical contract ${q.id}`);canonicalItems++;if(![q.prompt,q.explanation,q.choices,q.givens].every((value,i)=>JSON.stringify(value)===JSON.stringify([canonical.prompt,canonical.explanation,canonical.choices,canonical.givens][i])))canonicalOverlays++;continue;}const current=data.items.find(it=>it.id===q.id);assert(current,`${unit}: missing current authored ${q.id}`);if(unit==='c22-s52-u03'&&q.weatherGuidedResponse){const{previousVersions:oldHistory,...c}=current,{previousVersions:classHistory,...d}=q;assert.deepEqual(c,d,`${unit}: bank/classroom current display differs ${q.id}`);assert(oldHistory&&classHistory);}else assert.deepEqual(current,q,`${unit}: bank/classroom version differs ${q.id}`);linked++;}
 for(const mode of['self','teach']){const slides=buildSlides(mod.chapter,mod.art,mod.plan,pool,mode);assert.equal(withVersionedQuestionSlides(slides,pool),slides);for(const slide of slides){const q=pool.find(q=>q.id===slide.item);if(!q?.contentVersion)continue;versionedSlides++;assert.equal(slide.questionVersion,q.contentVersion,`${unit}: missing slide version ${q.id}`);assert(deckSlideRecordKey(mod.chapter,slide).includes(':version:'+q.contentVersion));assert.deepEqual(deckQuestionSnapshot(slide,pool),q);for(const match of slide.body.matchAll(/data-k="([^"]*)"/g))assert(match[1].startsWith(`test:item:${q.id}:version:${q.contentVersion}`),`${unit}: old input key ${match[1]}`);}}
 for(const key of mod.chapter.check){assert(pool.find(q=>q.id===key)||pool.find(q=>q.sourceRef?.of&&`${q.sourceRef.of.set}-${q.sourceRef.of.no}`===key),`${unit}: unresolved check ${key}`);selected++;}
}
assert.equal(reads,0);assert.equal(writes,0);assert.equal(network,0);console.log(JSON.stringify({units:revisedTextbookUnits.size,linkedAuthoredItems:linked,canonicalClassroomItems:canonicalItems,canonicalContextChanges:canonicalOverlays,resolvedChecks:selected,versionedSlides,studentStorageReads:reads,studentStorageWrites:writes,networkRequests:network,browserVerified:false}));
