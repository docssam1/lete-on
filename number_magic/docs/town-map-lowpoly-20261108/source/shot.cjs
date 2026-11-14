const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const p=await b.newPage({viewport:{width:2000,height:1342}});
p.on('console',m=>{if(m.type()!=='log')console.log('C:',m.text())});p.on('pageerror',e=>{console.log('ERR',e.message);process.exit(1)});
await p.goto('http://localhost:8811/index.html'+(process.argv[3]||''));
await p.waitForFunction(()=>window.DONE,null,{timeout:300000});
console.log(JSON.stringify(await p.evaluate(()=>window.REPORT)));
const o=process.argv[2]||'out.png';await p.screenshot(o.endsWith('.jpg')?{path:o,type:'jpeg',quality:86}:{path:o});await b.close();})();
