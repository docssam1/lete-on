import {openPdf,pdfPages,decodePdf,privateDrive,driveRef,MAX_FILE} from './knowledge-import.mjs?v=20261114-import1';
const $=id=>document.getElementById(id),A=window.GFIELD_FIELDS_ADMIN_AUTH,dialog=$('kImportDialog');
const message={drive_url_invalid:'Google Drive의 문서 또는 파일 링크를 넣어 주세요. 폴더 링크는 사용할 수 없습니다.',drive_access_required:'공개 링크로 읽을 수 없습니다. 비공개 자료는 Google 계정을 연결한 뒤 읽거나, Drive에서 PDF로 내려받아 올려 주세요.',drive_download_denied:'이 파일의 다운로드 권한이 없습니다.',drive_unavailable:'Drive 자료를 읽지 못했습니다. 연결과 공유 권한을 확인해 주세요.',google_expired:'Google 연결이 만료됐습니다. 계정을 다시 연결해 주세요.',file_too_large:'12MB 이하 파일이나 더 작은 범위로 나눈 PDF를 선택해 주세요.',file_type_invalid:'PDF·Google 문서·슬라이드·스프레드시트·텍스트 파일을 이용해 주세요.',pdf_password:'암호가 없는 PDF로 저장한 뒤 다시 올려 주세요.',pdf_unreadable:'PDF를 읽지 못했습니다. 파일이 정상적으로 열리는지 확인해 주세요.',pages_invalid:'실제 쪽수 안에서 시작과 끝을 정해 주세요. 한 번에 최대 12쪽입니다.',text_too_large:'선택한 원문이 너무 깁니다. 범위를 줄이거나 PDF를 나누어 올려 주세요.',extract_too_large:'발췌할 원문이 깁니다. 더 적은 쪽을 선택하거나 AI 정리를 이용해 주세요.',consent_required:'개인정보와 자료 사용 범위를 먼저 확인해 주세요.',scan_needs_ai:'이미지로 읽은 쪽은 AI 정리가 필요합니다. 글자가 있는 PDF를 사용하면 AI 없이 발췌할 수 있습니다.',evidence_invalid:'원문 근거를 정확히 대조하지 못해 저장하지 않았습니다. 범위를 줄이거나 원문 발췌로 등록해 주세요.',evidence_missing:'근거 발췌가 없어 저장하지 않았습니다. 원문 발췌로 등록하거나 다른 범위를 선택해 주세요.',draft_invalid:'상담용으로 정리할 내용을 확인하지 못해 저장하지 않았습니다. 원문 발췌로 등록해 주세요.',organize_unavailable:'추가 정리를 완료하지 못했습니다. 잠시 후 다시 시도하거나 AI 없이 원문을 발췌해 주세요.',ai_not_configured:'AI 연결을 확인하지 못했습니다. 원문 발췌는 이용할 수 있습니다.',import_limit:'오늘의 자료 AI 정리 횟수를 마쳤습니다. 원문 발췌는 계속 이용할 수 있습니다.',admin_required:'관리자 로그인 후 다시 이용해 주세요.'};
let current=null,pages=[],busy=false,googleToken='',googleExpires=0,tokenClient=null,epoch=0;
const say=(s,error=false)=>{$('kiStatus').textContent=s;$('kiStatus').classList.toggle('ki-error',error);};
const lock=value=>{busy=value;$('kiControls').disabled=value;$('kiClose').disabled=value;dialog.setAttribute('aria-busy',String(value));};
const validPages=()=>pages.length&&current;
function enable(){ $('kiImport').disabled=!validPages()||!$('kiConsent').checked; }
async function run(job){
 if(busy)return;const generation=epoch;lock(true);
 try{await job(generation);}catch(e){if(generation===epoch)say(message[e.message]||'요청을 완료하지 못했습니다. 관리자 로그인과 연결을 확인해 주세요.',true);}
 finally{if(generation===epoch){lock(false);enable();}}
}
function clearDocument(){
 if(current?.pdf)current.pdf.destroy().catch(()=>{});current=null;pages=[];$('kiDocument').hidden=true;$('kiDone').hidden=true;$('kiPreview').textContent='';$('kiConsent').checked=false;enable();
}
function preview(){
 const scans=pages.filter(p=>p.image).length;
 $('kiPreview').textContent=pages.map(p=>p.image?`[원문 ${p.page}쪽 · 이미지 함께 읽음 · AI 정리 후 원문 대조 필요]\n${p.text}`:`[${current.location==='text'?'본문 구간 '+p.page:'원문 '+p.page+'쪽'}]\n${p.text}`).join('\n\n');
 $('kiPreviewTitle').textContent=`추출한 원문 확인 · ${pages.length}개 구간${scans?' · 이미지 '+scans+'쪽':''}`;enable();
}
async function receive(data,type,generation){
 let pdf=null;if(data.type==='pdf')pdf=await openPdf(data.bytes||decodePdf(data.base64));
 if(generation!==epoch){await pdf?.destroy();return;}
 clearDocument();current={pdf,type,source:data.source||data.title,location:data.type==='text'?'text':'pages'};
 $('kiTitle').value=data.title.slice(0,120);$('kiFileInfo').textContent=pdf?`${data.title} · 전체 ${pdf.numPages}쪽`:data.title+' · 문서 본문';
 $('kiFrom').value=1;$('kiTo').value=pdf?Math.min(12,pdf.numPages):1;$('kiFrom').max=$('kiTo').max=pdf?pdf.numPages:1;
 $('kiFrom').disabled=$('kiTo').disabled=$('kiExtract').disabled=$('kiImages').disabled=!pdf;
 $('kiDocument').hidden=false;
 if(!pdf){if(!data.text.trim())throw new Error('file_empty');pages=[{page:1,text:data.text}];preview();say('문서 본문을 읽었습니다. 대상 학년과 정리 방법을 확인해 주세요.');}
 else say('PDF를 열었습니다. 읽을 쪽을 정하고 ‘선택 범위 읽기’를 눌러 주세요.');
}
$('kImportOpen').onclick=()=>{dialog.showModal();$('kiDate').value||=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Seoul'}).format(new Date());};
$('kiClose').onclick=()=>dialog.close();dialog.addEventListener('cancel',e=>{if(busy)e.preventDefault();});
$('kiFile').onchange=()=>run(async generation=>{
 const file=$('kiFile').files[0];if(!file)return;clearDocument();
 if(file.size>MAX_FILE)throw new Error('file_too_large');say('PDF를 여는 중입니다.');
 await receive({type:'pdf',bytes:new Uint8Array(await file.arrayBuffer()),title:file.name,source:file.name},'pdf',generation);
});
$('kiDriveRead').onclick=()=>run(async generation=>{
 driveRef($('kiDriveUrl').value);clearDocument();$('kiFile').value='';say('선택한 Drive 파일을 읽고 있습니다.');
 const data=await A.functionCall('roadmap-knowledge',{action:'drive-source',url:$('kiDriveUrl').value});
 if(generation===epoch)await receive(data,'drive',generation);
});
$('kiExtract').onclick=()=>run(async generation=>{
 if(!current?.pdf)return;pages=[];preview();
 const result=await pdfPages(current.pdf,Number($('kiFrom').value),Number($('kiTo').value),(n,to)=>say(`${n} / ${to}쪽을 읽고 있습니다.`),$('kiImages').checked);
 if(generation!==epoch)return;pages=result;preview();say('선택 범위를 읽었습니다. 원문과 개인정보를 확인한 뒤 승인 대기에 올려 주세요.');
});
for(const id of ['kiFrom','kiTo','kiImages'])$(id).oninput=()=>{pages=[];$('kiPreview').textContent='범위를 바꿨습니다. 선택 범위를 다시 읽어 주세요.';enable();};
$('kiConsent').onchange=enable;
$('kiImport').onclick=()=>run(async generation=>{
 if(!validPages())return;
 if($('kiMode').value==='extract'&&pages.some(p=>p.image))throw new Error('scan_needs_ai');
 if(!$('kiTitle').reportValidity())return;
 say($('kiMode').value==='ai'?'상담용 핵심과 원문 근거를 정리하고 있습니다. 최대 1분 정도 걸릴 수 있습니다.':'원문 발췌를 승인 대기에 넣고 있습니다.');
 const data=await A.functionCall('roadmap-knowledge',{action:'import-document',document:{type:current.type,location:current.location,source:current.source,title:$('kiTitle').value,stage:$('kiStage').value,checkedOn:$('kiDate').value||null,pages,mode:$('kiMode').value,consent:$('kiConsent').checked}});
 if(generation!==epoch)return;
 say(data.duplicate?`이미 등록된 자료입니다. 기존 ${data.count}개 항목을 보존했습니다. 새 AI 정리는 요청하지 않았습니다.`:`${data.count}개 상담 초안을 승인 대기에 올렸습니다. 내용을 검토하고 승인해야 상담에 반영됩니다.`);
 $('kiDone').hidden=false;document.dispatchEvent(new Event('roadmap-knowledge-imported'));
});
$('kiDone').onclick=()=>{dialog.close();$('adminKnowledge').scrollIntoView({behavior:'smooth',block:'start'});};
function disconnect(){googleToken='';googleExpires=0;$('kiGoogleRead').disabled=true;$('kiGoogleDisconnect').hidden=true;$('kiGoogleStatus').textContent='이 화면의 Google 연결을 해제했습니다.';}
let googleScript;
function loadGoogle(){
 if(window.google?.accounts?.oauth2)return Promise.resolve();
 if(!googleScript)googleScript=new Promise((resolve,reject)=>{const s=document.createElement('script'),timer=setTimeout(()=>{s.remove();googleScript=null;reject(new Error('google_unavailable'));},20000);s.src='https://accounts.google.com/gsi/client';s.onload=()=>{clearTimeout(timer);resolve();};s.onerror=()=>{clearTimeout(timer);googleScript=null;reject(new Error('google_unavailable'));};document.head.append(s);});
 return googleScript;
}
try{$('kiClientId').value=localStorage.getItem('roadmap.google.client-id.v1')||'';}catch{}
$('kiGooglePrepare').onclick=()=>run(async()=>{
 const id=$('kiClientId').value.trim();if(!/^\d+-[\w-]+\.apps\.googleusercontent\.com$/.test(id)){say('Google 웹 클라이언트 ID를 확인해 주세요.',true);return;}
 await loadGoogle();try{localStorage.setItem('roadmap.google.client-id.v1',id);}catch{}
 const generation=epoch;
 tokenClient=window.google.accounts.oauth2.initTokenClient({client_id:id,scope:'https://www.googleapis.com/auth/drive.readonly',include_granted_scopes:false,
 callback:r=>{
  if(generation!==epoch)return;
  if(r.error||!r.access_token){$('kiGoogleStatus').textContent='Google 연결을 완료하지 못했습니다. 권한을 확인해 주세요.';return;}
  googleToken=r.access_token;googleExpires=Date.now()+Number(r.expires_in||3600)*1000;$('kiGoogleRead').disabled=false;$('kiGoogleDisconnect').hidden=false;$('kiGoogleStatus').textContent='연결했습니다. 붙여넣은 파일만 이 화면에서 읽습니다.';
 },error_callback:()=>{$('kiGoogleStatus').textContent='Google 연결 창을 완료하지 않았습니다. 필요할 때 다시 연결해 주세요.';}});
 $('kiGoogleConnect').disabled=false;say('준비됐습니다. ‘Google 계정 연결’을 눌러 계정과 권한을 직접 확인해 주세요.');
});
$('kiGoogleConnect').onclick=()=>tokenClient?.requestAccessToken({prompt:'select_account'});
$('kiGoogleDisconnect').onclick=disconnect;
$('kiGoogleRead').onclick=()=>run(async generation=>{
 if(!googleToken||googleExpires<Date.now()){disconnect();throw new Error('google_expired');}
 driveRef($('kiDriveUrl').value);clearDocument();$('kiFile').value='';say('Google 계정 권한으로 선택한 파일을 읽고 있습니다.');
 await receive(await privateDrive($('kiDriveUrl').value,googleToken),'drive',generation);
});
document.addEventListener('roadmap-admin-signed-out',()=>{epoch++;lock(false);dialog.close();clearDocument();disconnect();tokenClient=null;$('kiGoogleConnect').disabled=true;$('kiDriveUrl').value='';$('kiFile').value='';say('');});
