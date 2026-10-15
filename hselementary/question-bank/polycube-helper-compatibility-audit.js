"use strict";
const fs=require("node:fs"),path=require("node:path"),crypto=require("node:crypto"),assert=require("node:assert/strict");
const out=process.env.HSE_SCREENSHOT_DIR;assert(out&&/^E:[/\\]/i.test(out));fs.mkdirSync(out,{recursive:true});
require("./runtime-availability-audit.js");
const api=window.HSE_GENERATORS,types=window.HSE_CURRICULUM.semesters.flatMap(s=>s.units.flatMap(u=>u.subunits.flatMap(s=>s.types))).filter(t=>!t.reviewLocked&&api.generatorKey(t));
const hash=bytes=>crypto.createHash("sha256").update(bytes).digest("hex"),records=[];
for(const type of types)for(const offset of[-1,0,1])for(const variant of[0,1,2])records.push({id:type.id,sourceItemId:type.sourceItemId||null,offset,variant,sha256:hash(JSON.stringify(api.generate(type,1,offset,123456,variant)))});
const file=path.join(out,"before.json"),result={types:types.length,cases:records.length,records,generatorsSha256:hash(fs.readFileSync(path.join(__dirname,"generators.js")))};
if(process.argv.includes("--checkpoint")){assert(!fs.existsSync(file),"Preserve existing baseline");fs.writeFileSync(file,JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify({status:"baseline-saved",types:result.types,cases:result.cases}));}
else{const before=JSON.parse(fs.readFileSync(file,"utf8"));assert.deepEqual(result.records,before.records);fs.writeFileSync(path.join(out,"result.json"),JSON.stringify({status:"passed-existing-output-byte-equivalence",types:result.types,cases:result.cases,beforeGeneratorsSha256:before.generatorsSha256,afterGeneratorsSha256:result.generatorsSha256},null,2)+"\n");console.log(JSON.stringify({status:"passed-existing-output-byte-equivalence",types:result.types,cases:result.cases}));}
