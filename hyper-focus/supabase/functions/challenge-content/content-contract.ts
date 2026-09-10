export const SOURCE_TYPES:Record<string,string>=Object.freeze({
  "1-main-1": "replace-count-constraints",
  "1-main-2": "split-merge-chain",
  "1-main-3": "mock-balance-substitution-pictures",
  "1-main-4": "triangle-number-rule",
  "1-main-5": "replace-divided-square-cycle",
  "1-main-6": "total-difference",
  "1-main-7": "rotated-grid-pair",
  "1-main-8": "mountain-digit-count",
  "1-main-9": "apartment-floor-order",
  "1-main-10": "replace-house-between",
  "1-main-11": "card-sum-count",
  "1-main-12": "mock-dice-target-bottom",
  "1-main-13": "arrow-number-move",
  "1-main-14": "mock-object-length-equivalence",
  "1-main-15": "minimum-sum-pyramid",
  "1-main-16": "replace-paper-remainder",
  "1-main-17": "replace-age-chain",
  "1-main-18": "cube-count-fill",
  "1-main-19": "rectangle-count",
  "1-main-20": "four-cell-code",
  "1-extra-1": "extra-digit-multiselect",
  "1-extra-2": "priority-cube-top-view",
  "1-extra-3": "priority-fold-holes",
  "1-extra-4": "extra-congruent-partition",
  "1-extra-5": "extra-inside-outside-analogy",
  "1-extra-6": "extra-digital-mirror",
  "2-main-1": "r2-fruit-equations",
  "2-main-2": "r2-number-machines",
  "2-main-3": "r2-grid-mirror-polygon",
  "2-main-4": "replace-student-queue",
  "2-main-5": "replace-missing-star-combination",
  "2-main-6": "r2-orange-reverse",
  "2-main-7": "r2-digit-constraint",
  "2-main-8": "replace-compound-matrix",
  "2-main-9": "r2-circular-seating",
  "2-main-10": "replace-magic-triangle",
  "2-main-11": "replace-fruit-pair-cancel",
  "2-main-12": "priority-route-count",
  "2-main-13": "r2-domino-side-sums",
  "2-main-14": "replace-line-rotation-series",
  "2-main-15": "r2-bird-departure",
  "2-main-16": "r2-number-reference-reading",
  "2-main-17": "r2-three-balance-order",
  "2-main-18": "priority-diagonal-length",
  "2-main-19": "r2-triangle-enumeration",
  "2-main-20": "r2-fruit-logic-table",
  "2-extra-1": "extra-maximum-under-conditions",
  "2-extra-2": "priority-card-rank",
  "2-extra-3": "extra-card-distribution",
  "2-extra-4": "extra-general-quadrilateral-count",
  "2-extra-5": "extra-independent-color-shape-period",
  "2-extra-6": "extra-circle-bar-code",
  "3-main-1": "r3-main-1",
  "3-main-2": "r3-main-2",
  "3-main-3": "r3-main-3",
  "3-main-4": "r3-main-4",
  "3-main-5": "r3-main-5",
  "3-main-6": "r3-main-6",
  "3-main-7": "r3-main-7",
  "3-main-8": "r3-main-8",
  "3-main-9": "r3-main-9-shortest-path-grid",
  "3-main-10": "r3-main-10",
  "3-main-11": "r3-main-11",
  "3-main-12": "r3-main-12",
  "3-main-13": "r3-main-13",
  "3-main-14": "r3-main-14",
  "3-main-15": "r3-main-15-checker-stack-count",
  "3-main-16": "r3-main-16",
  "3-main-17": "r3-main-17",
  "3-main-18": "r3-main-18-tetra-cube-hole-count",
  "3-main-19": "r3-main-19",
  "3-main-20": "r3-main-20",
  "3-extra-1": "r3-extra-1-congruent-marked-partition",
  "3-extra-2": "r3-extra-2",
  "3-extra-3": "r3-extra-3-block-build-count",
  "3-extra-4": "r3-extra-4-object-length-equivalence",
  "3-extra-5": "r3-extra-5",
  "3-extra-6": "r3-extra-6-stack-box-fill",
  "4-main-1": "r4-main-1",
  "4-main-2": "r4-main-2",
  "4-main-3": "r4-main-3",
  "4-main-4": "r4-main-4",
  "4-main-5": "r4-main-5",
  "4-main-6": "r4-main-6",
  "4-main-7": "r4-main-7",
  "4-main-8": "r4-main-8",
  "4-main-9": "r4-main-9",
  "4-main-10": "r4-main-10",
  "4-main-11": "r4-main-11",
  "4-main-12": "r4-main-12",
  "4-main-13": "r4-main-13",
  "4-main-14": "r4-main-14",
  "4-main-15": "r4-main-15",
  "4-main-16": "r4-main-16",
  "4-main-17": "r4-main-17",
  "4-main-18": "r4-main-18-congruent-marked-partition",
  "4-main-19": "r4-main-19",
  "4-main-20": "r4-main-20",
  "4-extra-1": "r4-extra-1-object-length-equivalence",
  "4-extra-2": "r4-extra-2-checker-stack-count",
  "4-extra-3": "r4-extra-3-tetra-cube-hole-count",
  "4-extra-4": "r4-extra-4-shortest-path-grid",
  "4-extra-5": "r4-extra-5-stack-box-fill",
  "4-extra-6": "r4-extra-6-simple-path-network"
});
export const DOCUMENT_KEYS=new Set(["challenge-concept-1","challenge-concept-2","challenge-mock-1","challenge-mock-2","challenge-mock-3","challenge-mock-4"]);
export const BANK_TYPES=new Set(Object.values(SOURCE_TYPES));
export const STYLE_KEYS=new Set(['exam.css','exam-print-revision.css','concepts.css','concepts-two.css','studio.css']);
export type Obj=Record<string,any>;
export function object(v:unknown):v is Obj{return !!v&&typeof v==='object'&&!Array.isArray(v);}
export function exact(v:unknown,keys:string[],optional:string[]=[]):v is Obj{return object(v)&&keys.every(k=>Object.hasOwn(v,k))&&Object.keys(v).every(k=>keys.includes(k)||optional.includes(k));}
export function requireValid(v:unknown):asserts v{if(!v)throw Error('invalid_private_package');}
export function requestTarget(body:unknown):Obj|null{
 if(!object(body)||!['questions','answers'].includes(body.part))return null;
 if(body.action==='document'&&exact(body,['action','productKey','part'])&&DOCUMENT_KEYS.has(body.productKey))return {kind:'document',id:body.productKey,part:body.part,permissionKeys:[body.productKey],path:`v1/documents/${body.productKey}.${body.part}.json`};
 if(body.action==='bank'&&exact(body,['action','typeId','difficulty','seed','part'])&&BANK_TYPES.has(body.typeId)&&['easy','same','hard'].includes(body.difficulty)&&Number.isInteger(body.seed)&&body.seed>=0&&body.seed<=4294967295)return {kind:'bank',id:body.typeId,difficulty:body.difficulty,seed:body.seed,part:body.part,permissionKeys:['challenge-bank-'+body.typeId],path:`v1/bank/${body.typeId}/${body.difficulty}.${body.part}.json`};
 if(body.action==='source'&&exact(body,['action','round','section','number','part'])&&Number.isInteger(body.round)&&Number.isInteger(body.number)&&['main','extra'].includes(body.section)){
  const id=`${body.round}-${body.section}-${body.number}`,typeId=SOURCE_TYPES[id];if(!typeId)return null;
  return {kind:'source',id,typeId,part:body.part,permissionKeys:['challenge-mock-'+body.round,'challenge-bank-'+typeId],path:`v1/sources/${id}.${body.part}.json`};
 }return null;
}
function reference(v:unknown,path:string){requireValid(exact(v,['path','sha256'])&&v.path===path&&typeof v.sha256==='string'&&/^[a-f0-9]{64}$/.test(v.sha256));}
export function validateManifest(m:unknown):asserts m is Obj{
 requireValid(exact(m,['schemaVersion','contentVersion','documents','bank','sources'])&&m.schemaVersion===1&&typeof m.contentVersion==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(m.contentVersion)&&object(m.documents)&&object(m.bank)&&object(m.sources));
 for(const [key,value]of Object.entries(m.documents)){requireValid(DOCUMENT_KEYS.has(key)&&exact(value,['questions','answers']));for(const part of ['questions','answers'])reference(value[part],`v1/documents/${key}.${part}.json`);}
 for(const [id,pools]of Object.entries(m.bank)){requireValid(BANK_TYPES.has(id)&&object(pools));for(const [difficulty,parts]of Object.entries(pools)){
  requireValid(['easy','same','hard'].includes(difficulty)&&object(parts));
  if(Object.hasOwn(parts,'shards')){
   requireValid(exact(parts,['shards','totalCount'])&&Array.isArray(parts.shards)&&parts.shards.length>0&&parts.shards.length<=1000&&Number.isInteger(parts.totalCount)&&parts.totalCount>0&&parts.totalCount<=1000);
   let total=0;parts.shards.forEach((shard:unknown,index:number)=>{requireValid(exact(shard,['questions','answers','count'])&&Number.isInteger(shard.count)&&shard.count>0&&shard.count<=1000);total+=shard.count;for(const part of ['questions','answers'])reference(shard[part],`v1/bank/${id}/${difficulty}.${part}.${index}.json`);});requireValid(total===parts.totalCount);
  }else{requireValid(exact(parts,['questions','answers']));for(const part of ['questions','answers'])reference(parts[part],`v1/bank/${id}/${difficulty}.${part}.json`);}
 }}
 for(const [id,value]of Object.entries(m.sources)){requireValid(Object.hasOwn(SOURCE_TYPES,id)&&exact(value,['typeId','questions','answers'])&&value.typeId===SOURCE_TYPES[id]);for(const part of ['questions','answers'])reference(value[part],`v1/sources/${id}.${part}.json`);}
}
export function selectReference(manifest:Obj,target:Obj):Obj{
 const entry=target.kind==='document'?manifest.documents[target.id]:target.kind==='bank'?manifest.bank[target.id]?.[target.difficulty]:manifest.sources[target.id];
 requireValid(entry);
 if(target.kind==='bank'&&Array.isArray(entry.shards)){
  let itemIndex=target.seed%entry.totalCount;for(let shardIndex=0;shardIndex<entry.shards.length;shardIndex++){const shard=entry.shards[shardIndex];if(itemIndex<shard.count)return {...shard[target.part],itemIndex,expectedCount:shard.count,shardIndex};itemIndex-=shard.count;}throw Error('invalid_private_package');
 }
 requireValid(entry[target.part]);return {...entry[target.part]};
}
function plain(v:unknown,max:number){return typeof v==='string'&&v.length<=max&&!/[<>\u0000]/.test(v);}
// Pinned teacher-built HTML only. This rejection scan is defense in depth, not a general HTML sanitizer.
function html(v:unknown,part:string){
 if(typeof v!=='string'||v.length>8000000)return false;
 if(/<!--|<\s*(?:script|iframe|object|embed|foreignobject|base|meta|link|form)\b|\bon[a-z]+\s*=|(?:javascript|vbscript)\s*:|\bsrcdoc\s*=/i.test(v))return false;
 if(part==='questions'&&/\bdata-(?:answer|solution|payload)\b/i.test(v))return false;
 for(const m of v.matchAll(/\b(?:href|src|xlink:href)\s*=\s*(["'])(.*?)\1/gi)){if(!/^#[a-zA-Z0-9_-]+$/.test(m[2])&&!/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(m[2])&&m[2]!=='assets/gfield-logo.png')return false;}
 for(const m of v.matchAll(/url\(\s*(["']?)([^)]*?)\1\s*\)/gi))if(!/^#[a-zA-Z0-9_-]+$/.test(m[2].trim()))return false;
 return !/@import\b|expression\s*\(/i.test(v);
}
function question(v:unknown){requireValid(exact(v,['id','prompt','problemHtml'])&&plain(v.id,160)&&v.id.length>0&&plain(v.prompt,12000)&&html(v.problemHtml,'questions'));return {id:v.id,prompt:v.prompt,problemHtml:v.problemHtml};}
function answer(v:unknown){requireValid(exact(v,['id','answerHtml','solution'],['solutionDiagram'])&&plain(v.id,160)&&v.id.length>0&&html(v.answerHtml,'answers')&&plain(v.solution,20000)&&(v.solutionDiagram===undefined||html(v.solutionDiagram,'answers')));return {id:v.id,answerHtml:v.answerHtml,solution:v.solution,...(v.solutionDiagram===undefined?{}:{solutionDiagram:v.solutionDiagram})};}
export function selectContent(file:unknown,manifest:Obj,target:Obj):Obj{
 requireValid(object(file)&&file.schemaVersion===1&&file.contentVersion===manifest.contentVersion&&file.part===target.part);
 if(target.kind==='document'){
  requireValid(exact(file,['schemaVersion','contentVersion','productKey','part','document'])&&file.productKey===target.id&&exact(file.document,['title','html','styles'])&&plain(file.document.title,200)&&html(file.document.html,target.part)&&Array.isArray(file.document.styles)&&file.document.styles.every((s:unknown)=>typeof s==='string'&&STYLE_KEYS.has(s)));
  return {document:{title:file.document.title,html:file.document.html,styles:[...file.document.styles]}};
 }
 if(target.kind==='source'){
  const member=target.part==='questions'?'question':'answer';requireValid(exact(file,['schemaVersion','contentVersion','sourceId','typeId','part',member])&&file.sourceId===target.id&&file.typeId===target.typeId);return {[member]:target.part==='questions'?question(file[member]):answer(file[member])};
 }
 const selection=selectReference(manifest,target),sharded=Number.isInteger(selection.shardIndex);
 requireValid(exact(file,['schemaVersion','contentVersion','typeId','difficulty','part','items',...(sharded?['shardIndex']:[])])&&file.typeId===target.id&&file.difficulty===target.difficulty&&Array.isArray(file.items)&&file.items.length>0&&file.items.length<=1000&&(!sharded||(file.shardIndex===selection.shardIndex&&file.items.length===selection.expectedCount)));
 const ids=new Set();for(const item of file.items){const validated=target.part==='questions'?question(item):answer(item);requireValid(!ids.has(validated.id));ids.add(validated.id);}
 const item=file.items[sharded?selection.itemIndex:target.seed%file.items.length];return target.part==='questions'?{question:question(item)}:{answer:answer(item)};
}
