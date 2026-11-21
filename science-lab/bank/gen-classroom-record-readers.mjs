import fs from'node:fs';import assert from'node:assert/strict';import{fileURLToPath}from'node:url';
const target=new URL('../v2/classroom-record-readers.js',import.meta.url);
const names=['career','electricity','combustion','season'];
export async function classroomRecordReadersSource(){
 const blocks=[];
 for(const name of names){
  const module=await import(new URL('../v2/'+name+'-compare-model.js',import.meta.url)),prefix=name[0].toUpperCase()+name.slice(1),idsName=name.toUpperCase()+'_CASE_IDS',validName='valid'+prefix+'CompareRow',valuesName=name+'CompareValues',cases=Object.fromEntries(module[idsName].map(id=>[id,module[name+'Case'](id)]));
  blocks.push('const '+name+'Readers=(()=>{\nconst cases='+JSON.stringify(cases,null,1)+';\nconst '+idsName+'=Object.freeze(Object.keys(cases));\nreturn{'+validName+':'+module[validName].toString()+','+valuesName+':'+module[valuesName].toString()+'};\n})();\nexport const{'+validName+','+valuesName+'}='+name+'Readers;\n');
 }
 for(const[name,unit]of[['careerRecordInquiry','c22-s62-u04'],['acidRecordInquiry','c22-s61-u01']]){const{inquiry}=await import(new URL('../data/activities/'+unit+'.inquiry.js',import.meta.url)),json=JSON.stringify(inquiry,null,1);assert.deepEqual(JSON.parse(json),inquiry,'Optional records must be lossless JSON data');blocks.push('export const '+name+'='+json+';\n');}
 return '// Generated from the canonical compare models and optional record configurations.\n// Refresh: node science-lab/bank/gen-classroom-record-readers.mjs --write\n// Validate: node science-lab/bank/gen-classroom-record-readers.mjs --check\n'+blocks.join('\n');
}
if(process.argv[1]&&fs.existsSync(process.argv[1])&&fileURLToPath(import.meta.url)===fs.realpathSync(process.argv[1])){
 const flags=process.argv.slice(2);if(flags.length!==1||!['--write','--check'].includes(flags[0]))throw Error('Use --write or --check.');
 const source=await classroomRecordReadersSource();
 if(flags[0]==='--write'){fs.writeFileSync(target,source);console.log(JSON.stringify({file:fileURLToPath(target),bytes:Buffer.byteLength(source)}));}
 else{if(!fs.existsSync(target)||fs.readFileSync(target,'utf8')!==source)throw Error('Classroom readers differ from current canonical models; run the generator with --write.');console.log('Classroom readers match the canonical models.');}
}
