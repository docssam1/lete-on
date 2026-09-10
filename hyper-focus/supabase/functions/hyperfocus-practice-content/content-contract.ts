export type Obj=Record<string,any>;
export const TYPE_IDS=Object.freeze(Array.from({length:54},(_,i)=>i+1));
export const TYPE_KEYS=new Set(TYPE_IDS.map(i=>'q'+String(i).padStart(2,'0')));
export const MODE_KEY='hyperfocus-bank-individual-mode';
export const DIFFICULTIES=new Set(['easy','same','hard']);
export function object(v:unknown):v is Obj{return !!v&&typeof v==='object'&&!Array.isArray(v);}
export function exact(v:unknown,keys:string[],optional:string[]=[]):v is Obj{return object(v)&&keys.every(k=>Object.hasOwn(v,k))&&Object.keys(v).every(k=>keys.includes(k)||optional.includes(k));}
export function requireValid(v:unknown):asserts v{if(!v)throw Error('invalid_private_package');}
export function typeKey(id:number){return 'q'+String(id).padStart(2,'0');}
export function requestTarget(body:unknown):Obj|null{
 if(!exact(body,['action','types','countPerType','seed','accessTier','part'])||body.action!=='practice'||!['questions','answers'].includes(body.part)||!['free','paid'].includes(body.accessTier)||!Number.isInteger(body.seed)||body.seed<0||body.seed>4294967295||!Number.isInteger(body.countPerType)||body.countPerType<1||body.countPerType>(body.accessTier==='free'?2:20)||!Array.isArray(body.types)||!body.types.length||body.types.length>20)return null;
 const ids=new Set();for(const t of body.types){if(!exact(t,['typeId','difficulty'])||!Number.isInteger(t.typeId)||!TYPE_IDS.includes(t.typeId)||!DIFFICULTIES.has(t.difficulty)||ids.has(t.typeId))return null;ids.add(t.typeId);}
 return {...body,types:body.types.map((t:Obj)=>({...t,key:typeKey(t.typeId)}))};
}
function reference(value:unknown,path:string){requireValid(exact(value,['path','sha256'])&&value.path===path&&typeof value.sha256==='string'&&/^[a-f0-9]{64}$/.test(value.sha256));}
export function validateManifest(m:unknown):asserts m is Obj{
 requireValid(exact(m,['schemaVersion','contentVersion','bank'])&&m.schemaVersion===1&&typeof m.contentVersion==='string'&&/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,79}$/.test(m.contentVersion)&&object(m.bank));
 for(const [key,levels]of Object.entries(m.bank)){requireValid(TYPE_KEYS.has(key)&&object(levels));for(const[difficulty,tiers]of Object.entries(levels)){requireValid(DIFFICULTIES.has(difficulty)&&object(tiers));for(const[tier,pool]of Object.entries(tiers)){
  requireValid(['free','paid'].includes(tier)&&exact(pool,['shards','totalCount'],['releaseStatus'])&&(pool.releaseStatus===undefined||['held','verified'].includes(pool.releaseStatus))&&Number.isInteger(pool.totalCount)&&pool.totalCount>=1&&pool.totalCount<=(tier==='free'?2:1000)&&Array.isArray(pool.shards)&&pool.shards.length>=1&&pool.shards.length<=1000);
  let total=0;pool.shards.forEach((s:unknown,i:number)=>{requireValid(exact(s,['questions','answers','count'])&&Number.isInteger(s.count)&&s.count>=1&&s.count<=1000);total+=s.count;for(const part of ['questions','answers'])reference(s[part],`v1/bank/${key}/${difficulty}.${tier}.${part}.${i}.json`);});requireValid(total===pool.totalCount);
 }}}
}
export function selectReferences(manifest:Obj,target:Obj):Obj[]{
 const selections:Obj[]=[];let number=0;
 for(const type of target.types){const pool=manifest.bank[type.key]?.[type.difficulty]?.[target.accessTier];requireValid(pool&&pool.releaseStatus==='verified'&&pool.totalCount>=target.countPerType);
  // Free seed cannot enumerate paid content: its physically separate pool has at most two entries.
  const start=target.accessTier==='free'?0:target.seed%pool.totalCount;
  for(let offset=0;offset<target.countPerType;offset++){let index=(start+offset)%pool.totalCount;let found=false;
   for(let shardIndex=0;shardIndex<pool.shards.length;shardIndex++){const shard=pool.shards[shardIndex];if(index<shard.count){selections.push({...shard[target.part],typeId:type.typeId,key:type.key,difficulty:type.difficulty,accessTier:target.accessTier,part:target.part,number:++number,itemIndex:index,shardIndex,expectedCount:shard.count});found=true;break;}index-=shard.count;}requireValid(found);
  }
 }return selections;
}
function plain(v:unknown,max:number){return typeof v==='string'&&v.length<=max&&!/[<>\u0000]/.test(v);}
// Only pinned, reviewed, privately built HTML. This rejection scan is not a general HTML sanitizer.
export function safeHtml(v:unknown,part:string){
 if(typeof v!=='string'||v.length>8000000||/<!--|<\s*(?:script|iframe|object|embed|foreignobject|base|meta|link|form)\b|\bon[a-z]+\s*=|(?:javascript|vbscript)\s*:|\bsrcdoc\s*=/i.test(v))return false;
 if(part==='questions'&&/\bdata-(?:answer|solution|payload)\b/i.test(v))return false;
 for(const m of v.matchAll(/\b(?:href|src|xlink:href)\s*=\s*(["'])(.*?)\1/gi))if(!/^#[a-zA-Z0-9_-]+$/.test(m[2])&&!/^data:image\/(?:png|jpeg|webp);base64,[a-zA-Z0-9+/=]+$/.test(m[2]))return false;
 for(const m of v.matchAll(/url\(\s*(["']?)([^)]*?)\1\s*\)/gi))if(!/^#[a-zA-Z0-9_-]+$/.test(m[2].trim()))return false;
 return !/@import\b|expression\s*\(/i.test(v);
}
function question(v:unknown){requireValid(exact(v,['id','prompt','problemHtml'])&&plain(v.id,160)&&v.id.length>0&&plain(v.prompt,12000)&&v.prompt.length>0&&safeHtml(v.problemHtml,'questions'));return {id:v.id,prompt:v.prompt,problemHtml:v.problemHtml};}
function answer(v:unknown){requireValid(exact(v,['id','answerHtml','solution'],['solutionDiagram'])&&plain(v.id,160)&&v.id.length>0&&safeHtml(v.answerHtml,'answers')&&plain(v.solution,20000)&&(v.solutionDiagram===undefined||safeHtml(v.solutionDiagram,'answers')));return {id:v.id,answerHtml:v.answerHtml,solution:v.solution,...(v.solutionDiagram===undefined?{}:{solutionDiagram:v.solutionDiagram})};}
export function selectContent(file:unknown,manifest:Obj,selection:Obj):Obj{
 requireValid(exact(file,['schemaVersion','contentVersion','typeId','difficulty','accessTier','part','shardIndex','items'])&&file.schemaVersion===1&&file.contentVersion===manifest.contentVersion&&file.typeId===selection.typeId&&file.difficulty===selection.difficulty&&file.accessTier===selection.accessTier&&file.part===selection.part&&file.shardIndex===selection.shardIndex&&Array.isArray(file.items)&&file.items.length===selection.expectedCount);
 const ids=new Set();for(const item of file.items){const validated=selection.part==='questions'?question(item):answer(item);requireValid(!ids.has(validated.id));ids.add(validated.id);}
 const selected=selection.part==='questions'?question(file.items[selection.itemIndex]):answer(file.items[selection.itemIndex]);
 return {...selected,number:selection.number,typeId:selection.typeId,difficulty:selection.difficulty};
}
