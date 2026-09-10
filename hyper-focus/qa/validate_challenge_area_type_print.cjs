/* Local teacher-preview QA only. No real student records or remote writes. */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {execFileSync}=require('node:child_process'),{chromium}=require('playwright');
const root=path.resolve(__dirname,'../..'),out=path.join(root,'hyper-focus/output/qa/challenge-area-type-print');
const mime={'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png','.svg':'image/svg+xml'};
const server=http.createServer((req,res)=>{const target=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://local').pathname));if(!target.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(target,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',mime[path.extname(target)]||'application/octet-stream');res.end(data);});});
const checks=[];function check(name,value){assert.ok(value,name);checks.push(name);}
(async()=>{
 fs.mkdirSync(out,{recursive:true});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:1440,height:1050}}),errors=[],external=[];
 page.on('pageerror',error=>errors.push(error.message));page.on('request',request=>{const host=new URL(request.url()).hostname;if(!['127.0.0.1','localhost'].includes(host))external.push(request.url());});
 try{
  const url=`http://127.0.0.1:${server.address().port}/hyper-focus/challenge/studio.html?teacherPreview=1&tab=bank`;
  await page.goto(url,{waitUntil:'networkidle'});await page.waitForFunction(()=>!!window.HFChallengeStudio);
  await page.evaluate(()=>{window.__qaIdentity={studentId:'qa-print-student',name:'워터마크학생'};window.HFChallengeAccess={allow:()=>true,watermarkIdentity:()=>window.__qaIdentity,refresh:async()=>({verified:true})};window.dispatchEvent(new CustomEvent('hfchallengeaccesschange',{detail:{reason:'verified'}}));});
  check('bank defaults to all four rounds',await page.locator('#bankRoundFilter').inputValue()==='all'&&await page.locator('.bank-row').count()===104);
  check('preview buttons removed',await page.locator('#bankRows button[data-preview]').count()===0);
  await page.locator('#areaFilter').selectOption('space');const areaCount=await page.locator('[data-select]:not(:disabled)').count();check('area filter has selectable rows',areaCount>1&&!await page.locator('#selectArea').isDisabled());
  await page.locator('#selectArea').click();check('whole area selected',await page.evaluate(()=>HFChallengeStudio.getSelection().length)===areaCount);await page.locator('#clearSelection').click();
  const diceOption=page.locator('#typeFilter option').filter({hasText:'주사위 굴리기'}).first(),diceValue=await diceOption.getAttribute('value');check('dice type filter exists',!!diceValue);await page.locator('#typeFilter').selectOption(diceValue);
  const typeRows=page.locator('[data-hover-preview]'),typeCount=await typeRows.count();check('type filter spans repeated source occurrences',typeCount>=2&&!await page.locator('#selectType').isDisabled());
  await typeRows.first().hover();await page.waitForFunction(()=>!document.getElementById('hoverPreview').hidden&&document.querySelector('#hoverPreview .studio-prompt'));
  check('hover loads question and drawing only',(await page.locator('#hoverPreview .studio-prompt').innerText()).length>10&&await page.locator('#hoverPreview #previewAnswer').count()===0);
  check('hover preview has three identity lines',await page.locator('#hoverPreview .hover-watermark>span').count()===3&&await page.locator('#hoverPreview .watermark-name').evaluateAll(nodes=>nodes.every(node=>node.textContent==='워터마크학생')));
  await typeRows.first().focus();await page.keyboard.press('Enter');check('keyboard opens accessible detail',await page.locator('#questionPreview').isVisible());await page.keyboard.press('Escape');
  await page.locator('#selectType').click();check('whole type selected',await page.evaluate(()=>HFChallengeStudio.getSelection().length)===typeCount);
  await page.locator('#variantCount').fill('1');await page.locator('#buildPractice').click();await page.waitForFunction(()=>document.body.dataset.printReady==='true'&&document.body.dataset.watermarkReady==='true',{},{timeout:30000});
  const snapshot=await page.evaluate(()=>HFChallengeStudio.getSnapshot());check('type-labelled worksheet snapshot',snapshot.scope.kind==='type'&&snapshot.entries.length===typeCount&&snapshot.title.includes('주사위 굴리기 유형'));
  const nonblank=await page.locator('.studio-page:not(.blank)').count(),lines=await page.locator('.studio-page:not(.blank)>.page-watermark>span').count();check('every printable page has exactly three watermark lines',nonblank>0&&lines===nonblank*3);
  check('every line uses approved name and brand',await page.locator('.studio-page:not(.blank)>.page-watermark>span').evaluateAll(nodes=>nodes.every(line=>line.querySelector('.watermark-name')?.textContent==='워터마크학생'&&line.querySelector('.watermark-brand')?.textContent.includes('GFIELD · LETE-ON'))));
  const ratio=await page.locator('.page-watermark>span').first().evaluate(line=>parseFloat(getComputedStyle(line.querySelector('.watermark-name')).fontSize)/parseFloat(getComputedStyle(line.querySelector('.watermark-brand')).fontSize));check('watermark name is thirty percent larger',ratio>=1.295&&ratio<=1.305);
  await page.evaluate(()=>{document.querySelector('.studio-page:not(.blank)>.page-watermark').remove();document.body.dataset.watermarkReady='false';window.dispatchEvent(new Event('beforeprint'));});check('beforeprint repairs mandatory watermark',await page.evaluate(()=>document.body.dataset.printReady==='true'&&document.body.dataset.watermarkReady==='true')&&await page.locator('.studio-page:not(.blank)>.page-watermark').count()===nonblank);
  await page.emulateMedia({media:'print'});const overflow=await page.locator('.studio-page').evaluateAll(nodes=>nodes.flatMap((node,index)=>node.scrollHeight>node.clientHeight+2||node.scrollWidth>node.clientWidth+2?[index+1]:[]));check('A4 pages do not overflow',overflow.length===0);
  const pdf=path.join(out,'challenge-area-type-watermark-qa.pdf');await page.pdf({path:pdf,preferCSSPageSize:true,printBackground:true});const info=execFileSync('pdfinfo',[pdf],{encoding:'utf8'}),pdfPages=Number(info.match(/^Pages:\s+(\d+)/m)?.[1]),size=info.match(/^Page size:\s+([\d.]+) x ([\d.]+) pts \(A4\)/m);check('PDF page count and A4 size',pdfPages===await page.locator('.studio-page').count()&&size&&Math.abs(Number(size[1])-594.96)<.1&&Math.abs(Number(size[2])-841.92)<.1);
  const nameMatches=Number(execFileSync('python',['-c','from pypdf import PdfReader; import sys; text="\\n".join((p.extract_text() or "") for p in PdfReader(sys.argv[1]).pages); print(text.count("\\uc6cc\\ud130\\ub9c8\\ud06c\\ud559\\uc0dd"))',pdf],{encoding:'utf8'}).trim());check('PDF embeds at least three watermark names per printable page',nameMatches>=nonblank*3);
  execFileSync('pdftoppm',['-f','1','-singlefile','-png',pdf,path.join(out,'challenge-area-type-watermark-page1')]);
  await page.emulateMedia({media:'screen'});await page.locator('#closeWorksheet').click();await page.setViewportSize({width:390,height:844});check('mobile filters have no horizontal overflow',await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));check('hover card hidden on mobile',await page.locator('#hoverPreview').evaluate(node=>getComputedStyle(node).display==='none'));
  check('browser errors none',errors.length===0);check('remote requests none',external.length===0);
  const report={checks:checks.length,passed:checks,areaCount,typeCount,nonblank,pdfPages,watermarkLines:lines,nameMatches,ratio,overflow,errors,external};fs.writeFileSync(path.join(out,'report.json'),JSON.stringify(report,null,2));console.log(JSON.stringify({passed:checks.length,pdf,png:path.join(out,'challenge-area-type-watermark-page1.png'),report},null,2));
 }finally{await browser.close();await new Promise(resolve=>server.close(resolve));}
})().catch(error=>{console.error(error);process.exitCode=1;server.close();});
