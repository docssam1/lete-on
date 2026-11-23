// Exact wording reviews preserve contracts. Separately versioned response revisions follow this layer.
export const STUDENT_LANGUAGE_VERSION='20261117-student-language-review';
export const STUDENT_TABLE_LANGUAGE_VERSION='20261123-student-table-language';
export function languageFingerprint(value){let a=2166136261,b=3335557771;for(const c of JSON.stringify(value)){const n=c.charCodeAt(0);a=Math.imul(a^n,16777619);b=Math.imul(b^n,2246822519);}return(a>>>0).toString(16).padStart(8,'0')+(b>>>0).toString(16).padStart(8,'0');}
const clone=x=>JSON.parse(JSON.stringify(x)),modules=new Map(),revised=new WeakMap();
const units=new Set(['s31-u01','s31-u02','s31-u03','s31-u04','c22-s32-u01','c22-s32-u02','c22-s32-u03','c22-s32-u04','s41-u01','s41-u02','s41-u03','s41-u04','c22-s42-u01','c22-s42-u02','c22-s42-u03','c22-s42-u04','c22-s51-u01','c22-s51-u02','c22-s51-u03','c22-s51-u04','c22-s52-u01','c22-s52-u02','c22-s52-u03','c22-s52-u04','c22-s61-u01','c22-s61-u02','c22-s61-u03','c22-s61-u04','c22-s62-u01','c22-s62-u02','c22-s62-u03','c22-s62-u04','s31-mid','s31-fin','c22-s32-mid','c22-s32-fin','c22-s41-mid','c22-s41-fin','c22-s42-mid','c22-s42-fin','c22-s51-mid','c22-s51-fin','s41-mid','s32-mid','s32-fin']);
async function reviewOf(unit){if(!units.has(unit))return null;if(!modules.has(unit))modules.set(unit,import(`../data/language/${unit}.js?v=${STUDENT_LANGUAGE_VERSION}&tableLanguage=${STUDENT_TABLE_LANGUAGE_VERSION}`).then(m=>m.review));return modules.get(unit);}
const protectedKeys=new Set(['sourceRef','evidence','previousVersions','taxonomy','answer','accepted','vocabulary','answerContract','responseContract','diagnosticOverride','figures','art','verificationModel','sources','standards']);
export function reviewTextTree(value,text){
 if(typeof value==='string')return Object.hasOwn(text,value)?text[value]:value;
 if(Array.isArray(value)){const out=value.map(v=>reviewTextTree(v,text));return out.every((v,i)=>v===value[i])?value:out;}
 if(!value||typeof value!=='object')return value;
 const pairs=Object.entries(value).map(([k,v])=>[k,protectedKeys.has(k)&&!(k==='answer'&&value.type==='example')?v:reviewTextTree(v,text)]);return pairs.every(([k,v])=>v===value[k])?value:Object.fromEntries(pairs);
}
export function reviewQuestionRows(rows,review){
 if(!rows?.length||!review)return rows;let changed=false;
 const next=rows.map(q=>{
  if(q.status!=='authored')return q;const key=q.id+':'+languageFingerprint(q);if(!Object.hasOwn(review.questions,key))return q;
  changed=true;if(revised.has(q))return revised.get(q);const oldVersion=q.contentVersion||1,changes=review.questions[key],fields={};
  for(const k of ['prompt','givens','choices','explanation'])if(q[k]!=null)fields[k]=reviewTextTree(q[k],changes);
  if(Object.entries(fields).every(([k,v])=>v===q[k]))return q;
  const diagnostic=q.diagnosticOverride?.version===oldVersion?{diagnosticOverride:{...q.diagnosticOverride,version:STUDENT_LANGUAGE_VERSION}}:{};
  const result={...q,...fields,...diagnostic,contentVersion:STUDENT_LANGUAGE_VERSION,previousVersions:[...clone(q.previousVersions||[]),{...clone(q),version:oldVersion,snapshotKind:'full-question'}]};revised.set(q,result);return result;
 });return changed?next:rows;
}
const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function reviewPaperText(html,review){if(!review)return html;const map=Object.fromEntries(Object.entries(review.text).map(([a,b])=>[escape(a),escape(b)]));return html.replace(/<[^>]*>|[^<]+/g,part=>{if(part.startsWith('<'))return part;const trimmed=part.trim();return Object.hasOwn(map,trimmed)?part.replace(trimmed,map[trimmed]):part;});}
// Authored tables are stored as HTML separately from question data. Match the
// complete reviewed table before changing exact text nodes; keep all markup,
// pictures, numerical data and unregistered/future tables untouched.
export function reviewWorkbookTableText(workbook,review){
 if(!review?.tableFigures||!workbook.figures)return workbook;
 const refs=new Set((workbook.questions||[]).filter(q=>q.status==='authored').map(q=>q.figure));let figures=workbook.figures;
 for(const [key,fingerprint]of Object.entries(review.tableFigures)){
  const html=workbook.figures[key];if(!refs.has(key)||typeof html!=='string'||!html.includes('<table')||languageFingerprint(html)!==fingerprint)continue;
  const next=reviewPaperText(html,review);if(next===html)continue;
  if(figures===workbook.figures)figures={...figures};figures[key]=next;
 }
 return figures===workbook.figures?workbook:{...workbook,figures};
}
export async function reviewStudentModule(unit,mod){
 const review=await reviewOf(unit);if(!review)return mod;
 const result={...mod};for(const k of ['items','source','similar'])if(mod[k])result[k]=reviewQuestionRows(mod[k],review);
 if(mod.bankPaper)result.bankPaper=args=>reviewPaperText(mod.bankPaper(args),args.mode==='student'?{...review,text:{...review.text,...review.studentHeaders}}:review);
 if(unit==='c22-s42-u02'){const{ecologyWritingItems}=await import('./ecology-writing-review.js?v=20261123-ecology-guided-writing');const{ecologyConservationItems}=await import('./ecology-conservation-review.js?v=20261123-ecology-conservation');const{ecologyFoodwebItems}=await import('./ecology-foodweb-review.js?v=20261123-ecology-foodweb-tasks');for(const key of ['items','similar'])result[key]=ecologyFoodwebItems(ecologyConservationItems(ecologyWritingItems(result[key],unit),unit),unit);}
 if(unit==='s31-u02'){const{animalGuidedItems}=await import('./animal-guided-review.js?v=20261123-animal-guided-tasks');for(const key of ['items','similar'])result[key]=animalGuidedItems(result[key],unit);}
 if(unit==='s31-u03'){const{plantGuidedItems}=await import('./plant-guided-review.js?v=20261124-plant-guided-tasks');for(const key of ['items','similar'])result[key]=plantGuidedItems(result[key],unit);}
 if(unit==='c22-s42-u03'){const{gasGuidedItems}=await import('./gas-guided-review.js?v=20261124-gas-guided-tasks&layout=6');for(const key of ['items','similar'])result[key]=gasGuidedItems(result[key],unit);}
 if(unit==='c22-s42-u01'){const{skyGuidedItems}=await import('./sky-guided-review.js?v=20261124-sky-guided-tasks&layout=3');for(const key of ['items','similar'])result[key]=skyGuidedItems(result[key],unit);}
 if(unit==='s41-u04'){const{biologyGuidedItems}=await import('./biology-guided-review.js?v=20261124-biology-guided-tasks&layout=4');for(const key of ['items','similar'])result[key]=biologyGuidedItems(result[key],unit);}
 if(unit==='s41-u03'){const{groundGuidedItems}=await import('./ground-guided-review.js?v=20261124-ground-guided-tasks&groundLayout=20261124-ground-photo-pages-final');for(const key of ['items','similar'])result[key]=groundGuidedItems(result[key],unit);}
 if(unit==='s41-u02'){const{waterGuidedItems}=await import('./water-guided-review.js?v=20261124-water-guided-tasks&waterProof=20261124-water-guided-layout');for(const key of ['items','similar'])result[key]=waterGuidedItems(result[key],unit);}
 if(unit==='s41-u01'){const{magnetGuidedItems}=await import('./magnet-guided-review.js?v=20261124-magnet-guided-tasks');for(const key of ['items','similar'])result[key]=magnetGuidedItems(result[key],unit);}
 if(unit==='c22-s32-u04'){const{infectionGuidedItems}=await import('./infection-guided-review.js?v=20261124-infection-guided-tasks');for(const key of ['items','similar'])result[key]=infectionGuidedItems(result[key],unit);}
 if(unit==='c22-s32-u03'){const{soundGuidedItems,withSoundGuidedTaxonomy}=await import('./sound-guided-review.js?v=20261124-sound-guided-tasks');for(const key of ['items','similar'])result[key]=soundGuidedItems(result[key],unit);result.taxonomy=withSoundGuidedTaxonomy(result.taxonomy);}
 if(unit==='c22-s32-u02'){const{earthSeaGuidedItems,withEarthSeaGuidedTaxonomy}=await import('./earth-sea-guided-review.js?v=20261124-earth-sea-guided-tasks');for(const key of ['items','similar'])result[key]=earthSeaGuidedItems(result[key],unit);result.taxonomy=withEarthSeaGuidedTaxonomy(result.taxonomy);}
 if(unit==='c22-s32-u01'){const{materialGuidedItems,withMaterialGuidedTaxonomy}=await import('./material-guided-review.js?v=20261124-material-guided-tasks');for(const key of ['items','similar'])result[key]=materialGuidedItems(result[key],unit);result.taxonomy=withMaterialGuidedTaxonomy(result.taxonomy);}
 if(unit==='s31-u04'){const{lifeGuidedItems}=await import('./life-guided-review.js?v=20261124-life-guided-tasks');for(const key of ['items','similar'])result[key]=lifeGuidedItems(result[key],unit);}
 if(unit==='s31-u01'){const{forceGuidedItems}=await import('./force-guided-review.js?v=20261123-force-guided-tasks');for(const key of ['items','similar'])result[key]=forceGuidedItems(result[key],unit);}
 if(unit==='c22-s52-u03'){const{weatherExampleItems}=await import('./weather-example-response.js?v=20261123-weather-example-response');result.items=weatherExampleItems(result.items,unit);}
 return result;
}
export async function reviewStudentWorkbook(unit,workbook){
 const review=await reviewOf(unit);
 const result=review?reviewWorkbookTableText(reviewTextTree(workbook,review.text),review):workbook;
 if(unit==='s31-u02'){const guided=(await import('./animal-guided-review.js?v=20261123-animal-guided-tasks')).withAnimalGuidedWorkbook(result);return(await import('./animal-concept-review.js?v=20261124-animal-concept-pages')).withAnimalConceptWorkbook(guided);}
 if(unit==='s31-u03'){const guided=(await import('./plant-guided-review.js?v=20261124-plant-guided-tasks')).withPlantGuidedWorkbook(result);return(await import('./plant-concept-review.js?v=20261124-plant-concept-pages')).withPlantConceptWorkbook(guided);}
 if(unit==='c22-s42-u03')return(await import('./gas-guided-review.js?v=20261124-gas-guided-tasks&layout=6')).withGasGuidedWorkbook(result);
 if(unit==='c22-s42-u01')return(await import('./sky-guided-review.js?v=20261124-sky-guided-tasks&layout=3')).withSkyGuidedWorkbook(result);
 if(unit==='s41-u04')return(await import('./biology-guided-review.js?v=20261124-biology-guided-tasks&layout=4')).withBiologyGuidedWorkbook(result);
 if(unit==='s41-u03')return(await import('./ground-guided-review.js?v=20261124-ground-guided-tasks&groundLayout=20261124-ground-photo-pages-final')).withGroundGuidedWorkbook(result);
 if(unit==='s41-u02')return(await import('./water-guided-review.js?v=20261124-water-guided-tasks&waterProof=20261124-water-guided-layout')).withWaterGuidedWorkbook(result);
 if(unit==='s41-u01')return(await import('./magnet-guided-review.js?v=20261124-magnet-guided-tasks')).withMagnetGuidedWorkbook(result);
 if(unit==='c22-s32-u04')return(await import('./infection-guided-review.js?v=20261124-infection-guided-tasks')).withInfectionGuidedWorkbook(result);
 if(unit==='c22-s32-u03')return(await import('./sound-guided-review.js?v=20261124-sound-guided-tasks')).withSoundGuidedWorkbook(result);
 if(unit==='c22-s32-u02')return(await import('./earth-sea-guided-review.js?v=20261124-earth-sea-guided-tasks')).withEarthSeaGuidedWorkbook(result);
 if(unit==='c22-s32-u01')return(await import('./material-guided-review.js?v=20261124-material-guided-tasks')).withMaterialGuidedWorkbook(result);
 if(unit==='s31-u04'){const guided=(await import('./life-guided-review.js?v=20261124-life-guided-tasks')).withLifeGuidedWorkbook(result);return(await import('./life-concept-review.js?v=20261124-life-concept-pages')).withLifeConceptWorkbook(guided);}
 if(unit==='s31-u01'){const drawn=(await import('./force-drawing-review.js?v=20261123-force-drawing-panels')).withForceDrawingWorkbook(result);const guided=(await import('./force-guided-review.js?v=20261123-force-guided-tasks')).withForceGuidedWorkbook(drawn);return(await import('./force-concept-review.js?v=20261123-force-concept-pages')).withForceConceptWorkbook(guided);}
 if(unit==='c22-s42-u02'){const guided=(await import('./ecology-guided-workbook.js?v=20261123-ecology-guided-workbook')).withEcologyGuidedWorkbook(result);const written=(await import('./ecology-writing-review.js?v=20261123-ecology-guided-writing')).withEcologyWritingWorkbook(guided);const conserved=(await import('./ecology-conservation-review.js?v=20261123-ecology-conservation')).withEcologyConservationWorkbook(written);return(await import('./ecology-foodweb-review.js?v=20261123-ecology-foodweb-tasks')).withEcologyFoodwebWorkbook(conserved);}
 return unit==='c22-s52-u03'?(await import('./weather-example-response.js?v=20261123-weather-example-response')).withWeatherExampleWorkbook(result):result;
}
export async function reviewClassroomLanguage(unit,mod){const review=await reviewOf(unit);if(!review||!mod.classroomItems)return mod;const items=reviewQuestionRows(mod.classroomItems,review);return items===mod.classroomItems?mod:{...mod,classroomItems:items};}
