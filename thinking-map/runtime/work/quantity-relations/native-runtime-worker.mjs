// One bounded request per process. No historical audit loops or application bootstrap.
import fs from'node:fs';import crypto from'node:crypto';import{fileURLToPath,pathToFileURL}from'node:url';import path from'node:path';
import{solveQuantity,solveFamily}from'./native-reused-verifiers.mjs';
const W=path.dirname(fileURLToPath(import.meta.url)),O=path.resolve(W,'../../outputs'),config=JSON.parse(fs.readFileSync(path.join(O,'native-runtime-config.json'))),root=path.join(W,'upstream-runtime',config.sourceSnapshot),hash=x=>crypto.createHash('sha256').update(x).digest('hex');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'manifest.json')));
for(const f of manifest.files){const b=fs.readFileSync(path.join(root,f.file));if(crypto.createHash('sha1').update('blob '+b.length+'\0').update(b).digest('hex')!==f.gitBlobSHA)throw Error('Pinned dependency changed: '+f.file);}
const{GENERATORS}=await import(pathToFileURL(path.join(root,'generators.js'))),{FIELDS_QUESTION_BANK_ADAPTER:adapter}=await import(pathToFileURL(path.join(root,'fields-question-bank-adapter.js'))),{book08Markup}=await import(pathToFileURL(path.join(root,'book08-renderers.js'))),{book03Markup}=await import(pathToFileURL(path.join(root,'book03-renderers.js'))),{book07Markup}=await import(pathToFileURL(path.join(root,'book07-renderers.js'))),{equalizeBagsMarkup,numberSequencesMarkup}=await import(pathToFileURL(path.join(root,'book02-visuals.js')));
const request=JSON.parse(fs.readFileSync(0,'utf8')),def=config.generators.find(r=>r.nativeTypeId===request.nativeTypeId&&r.typeId===request.typeId);
if(!def||!def.settings.includes(request.setting)||!Number.isInteger(request.seed)||request.seed<0||request.seed>2147483647)throw Error('Unapproved request');
const generatorId=def.generatorId||adapter.typeById(def.nativeTypeId)?.generator,fn=GENERATORS[generatorId];if(!fn)throw Error('No registered generator');
function random(seed){let a=seed>>>0;return()=>{a+=0x6D2B79F5;let t=Math.imul(a^a>>>15,1|a);t^=t+Math.imul(t^t>>>7,61|t);return((t^t>>>14)>>>0)/4294967296;};}
const previous=Math.random;Math.random=random(request.seed);let p;try{p=fn({difficulty:request.setting});}finally{Math.random=previous;}
const nums=s=>[...String(s).matchAll(/\d+/g)].map(m=>Number(m[0]));let certificate;
if(def.family==='quantity')certificate=solveQuantity(def.nativeTypeId,p,request.setting);
else if(def.family==='multiple'){
 const ns=nums(p.prompt),sum=def.typeId==='QR11',multiplier=sum?ns[1]:ns[0],known=sum?ns[0]:ns[1],values=[];
 for(let small=1;small<=known;small++){const large=small*multiplier;if((sum?small+large:large-small)===known)values.push(p.prompt.includes('큰 수를')?large:small);}
 if(values.length!==1||values[0]!==nums(p.answer)[0])throw Error('Multiple relation mismatch');
 const coefficient=sum?multiplier+1:multiplier-1;certificate={uniqueAnswer:values[0],explanation:`작은 수를 한 몫으로 보면 ${coefficient}몫이 ${known}입니다. 한 몫은 ${known}÷${coefficient}=${known/coefficient}이고, 물은 수는 ${values[0]}입니다.`,method:'reused-integer-enumeration-from-prompt'};
}else if(def.typeId==='MG02'||def.typeId==='MG03')certificate={method:'python-exact-visible-line-equations-required'};
else certificate={explanation:solveFamily({id:def.typeId},p),method:'reused-student-visible-givens-verifier'};
if(def.typeId.startsWith('VN')){
 const v=p.visual,a=v.leftTotal,b=v.rightTotal,o=v.overlap,total=v.total,out=v.neither;let text;
 if(def.typeId==='VN02')text=`두 활동 인원을 더하면 공통 학생을 두 번 셉니다. 적어도 하나를 하는 인원을 빼면 ${a}+${b}−${total}=${a+b-total}명입니다.`;
 if(def.typeId==='VN03')text=`두 활동 인원의 합에서 두 번 센 공통 학생을 한 번 빼면 ${a}+${b}−${o}=${a+b-o}명입니다.`;
 if(def.typeId==='VN04')text=`첫 활동만 ${a}−${o}=${a-o}명, 둘째 활동만 ${b}−${o}=${b-o}명입니다. 합하면 ${a+b-2*o}명입니다.`;
 if(def.typeId==='VN05')text=`적어도 하나를 하는 학생은 ${a}+${b}−${o}=${a+b-o}명입니다. 전체에서 빼면 ${total}−${a+b-o}=${total-(a+b-o)}명입니다.`;
 if(def.typeId==='VN06')text=`적어도 하나를 하는 학생은 ${total}−${out}=${total-out}명입니다. 공통 학생은 ${a}+${b}−${total-out}=${a+b-(total-out)}명입니다.`;
 certificate.explanation=text;
}
if(def.family==='quantity'||def.family==='multiple')p.solution=certificate.explanation;
if(def.typeId.startsWith('VN'))p.solution=certificate.explanation;
const helpers=new Set(['equalize-transfer-b8','total-difference','total-difference-bars-b8','sum-multiple-bars-b8','difference-multiple-bars-b8']);
const textOnly=def.typeId==='SQ05'||def.typeId.startsWith('VN');
if(textOnly&&def.typeId.startsWith('VN')){
 const v=p.visual,required=[v.leftTotal,v.rightTotal,...(['VN03','VN04','VN05'].includes(def.typeId)?[v.overlap]:[]),...(['VN02','VN05','VN06'].includes(def.typeId)?[v.total]:[]),...(def.typeId==='VN06'?[v.neither]:[])],given=nums(p.prompt).slice();
 for(const n of required){const at=given.indexOf(n);if(at<0)throw Error('A required quantity is not in the student prompt');given.splice(at,1);}
}
const removed=helpers.has(def.nativeTypeId)||textOnly||p.visual?.kind==='total-difference-bars'||p.visual?.layoutRole==='support'&&p.visual?.compactPolicy==='omit';
let visual='';
if(!removed&&p.visual){
 const v=p.visual;
 if(v.kind==='equalize-bags')visual=equalizeBagsMarkup(v);
 else if(v.kind==='book8')visual=book08Markup(v);
 else if(v.kind==='book3')visual=book03Markup(v);
 else if(v.kind==='book7')visual=book07Markup(v);
 else if(v.kind==='number-sequences')visual=numberSequencesMarkup(v);
 else throw Error('Unsupported required visual');
}
if(p.visual?.subtype==='magic-grid')visual=visual.replace(/<strong>한 줄의 합[^<]*<\/strong>/g,'');
if(def.typeId==='SQ05')visual=visual.replace(/<strong>[^<]*<\/strong>/g,'');
if(p.visual?.subtype==='venn'&&p.visual.neither==='-')visual=visual.replace(/<text[^>]*>밖 -명<\/text>/g,'');
const solutionVisual=p.answerVisual?book03Markup(p.answerVisual):'';
const result={problem:{prompt:p.prompt,answer:String(p.answer),solution:p.solution,visual:p.visual},visualMarkup:visual,solutionVisualMarkup:solutionVisual,certificate,generatorId,generatorFunctionSHA256:hash(fn.toString()),pinnedDependenciesChecked:manifest.files.length,helperDiagramRemoved:removed};
process.stdout.write(JSON.stringify(result));
