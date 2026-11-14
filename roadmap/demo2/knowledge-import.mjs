// 파일 읽기는 브라우저에서 한다. Google 접근 토큰을 서버나 저장소에 남기지 않는다.
export const MAX_FILE=12*1024*1024,MAX_PAGES=12;
export function driveRef(input){
 let u;try{u=new URL(input);}catch{throw new Error('drive_url_invalid');}
 if(u.protocol!=='https:'||u.port||u.username||u.password||!['drive.google.com','docs.google.com'].includes(u.hostname))throw new Error('drive_url_invalid');
 const native=u.pathname.match(/^\/(document|presentation|spreadsheets)\/d\/([\w-]{10,200})(?:\/|$)/);
 const file=u.pathname.match(/^\/file\/d\/([\w-]{10,200})(?:\/|$)/);
 const id=native?.[2]||file?.[1]||(/^\/(open|uc)$/.test(u.pathname)?u.searchParams.get('id'):null);
 if(!/^[\w-]{10,200}$/.test(id||''))throw new Error('drive_url_invalid');
 return {id,source:native?`https://docs.google.com/${native[1]}/d/${id}/edit`:`https://drive.google.com/file/d/${id}/view`,resourceKey:u.searchParams.get('resourcekey')||''};
}
let engine;
async function pdfjs(){
 if(!engine)engine=import('./vendor/pdfjs/pdf.min.mjs').then(lib=>{lib.GlobalWorkerOptions.workerSrc=new URL('./vendor/pdfjs/pdf.worker.min.mjs',import.meta.url).href;return lib;}).catch(e=>{engine=null;throw e;});
 return engine;
}
export async function openPdf(bytes){
 if(bytes.byteLength>MAX_FILE)throw new Error('file_too_large');
 if(new TextDecoder().decode(bytes.slice(0,5))!=='%PDF-')throw new Error('file_type_invalid');
 const lib=await pdfjs(),support='https://cdn.jsdelivr.net/npm/pdfjs-dist@6.5.438/';
 let task;
 try{
  task=lib.getDocument({data:bytes,isEvalSupported:false,withCredentials:false,cMapUrl:support+'cmaps/',cMapPacked:true,standardFontDataUrl:support+'standard_fonts/',wasmUrl:support+'wasm/'});
  const pdf=await task.promise;
  return {numPages:pdf.numPages,getPage:n=>pdf.getPage(n),destroy:()=>task.destroy()};
 }
 catch(e){await task?.destroy();throw new Error(e.name==='PasswordException'?'pdf_password':'pdf_unreadable');}
}
export async function pdfPages(pdf,from,to,progress=()=>{},includeImages=false){
 if(!Number.isInteger(from)||!Number.isInteger(to)||from<1||to<from||to>pdf.numPages||to-from+1>MAX_PAGES)throw new Error('pages_invalid');
 const pages=[];let chars=0;
 for(let n=from;n<=to;n++){
  progress(n,to);const page=await pdf.getPage(n),tc=await page.getTextContent();
  const text=tc.items.map(x=>(x.str||'')+(x.hasEOL?'\n':' ')).join('').trim();chars+=text.length;
  if(chars>60000)throw new Error('text_too_large');
  if(text.length>=20&&!includeImages){pages.push({page:n,text});}
  else{
   const base=page.getViewport({scale:1}),view=page.getViewport({scale:Math.min(1.7,1200/Math.max(base.width,base.height))});
   const canvas=document.createElement('canvas');canvas.width=Math.ceil(view.width);canvas.height=Math.ceil(view.height);
   await page.render({canvasContext:canvas.getContext('2d'),viewport:view,background:'white'}).promise;
   const image=canvas.toDataURL('image/jpeg',.8).split(',')[1];canvas.width=0;canvas.height=0;
   if(image.length>700000)throw new Error('file_too_large');
   pages.push({page:n,text:text.length>=20?text:'',image});
  }
  page.cleanup();
 }
 return pages;
}
export function decodePdf(base64){
 if(typeof base64!=='string'||base64.length>MAX_FILE*1.4)throw new Error('file_too_large');
 const binary=atob(base64);return Uint8Array.from(binary,c=>c.charCodeAt(0));
}
async function limited(response){
 if(Number(response.headers.get('content-length')||0)>MAX_FILE)throw new Error('file_too_large');
 const reader=response.body.getReader(),parts=[];let count=0;
 while(true){const {done,value}=await reader.read();if(done)break;count+=value.length;if(count>MAX_FILE){await reader.cancel();throw new Error('file_too_large');}parts.push(value);}
 const bytes=new Uint8Array(count);let pos=0;for(const p of parts){bytes.set(p,pos);pos+=p.length;}return bytes;
}
export async function privateDrive(input,token,fetcher=fetch){
 const ref=driveRef(input),base='https://www.googleapis.com/drive/v3/files/'+encodeURIComponent(ref.id);
 const headers={Authorization:'Bearer '+token,...(ref.resourceKey?{'X-Goog-Drive-Resource-Keys':ref.id+'/'+ref.resourceKey}:{})};
 const get=async url=>{const r=await fetcher(url,{headers,signal:AbortSignal.timeout(30000),redirect:'error'});if(!r.ok)throw new Error(r.status===401?'google_expired':'drive_access_required');return r;};
 const meta=await (await get(base+'?fields=id,name,mimeType,size,capabilities(canDownload)&supportsAllDrives=true')).json();
 if(meta.capabilities?.canDownload===false)throw new Error('drive_download_denied');
 if(Number(meta.size||0)>MAX_FILE)throw new Error('file_too_large');
 const native={
  'application/vnd.google-apps.document':'text/plain',
  'application/vnd.google-apps.presentation':'application/pdf',
  'application/vnd.google-apps.spreadsheet':'application/pdf'
 }[meta.mimeType];
 if(!native&&!['application/pdf','text/plain'].includes(meta.mimeType))throw new Error('file_type_invalid');
 const response=await get(native?base+'/export?mimeType='+encodeURIComponent(native):base+'?alt=media&supportsAllDrives=true');
 const bytes=await limited(response),title=String(meta.name||'Drive 자료').slice(0,120);
 if((native||meta.mimeType)==='text/plain'){
  const text=new TextDecoder().decode(bytes);if(text.length>60000)throw new Error('text_too_large');
  return {title,source:ref.source,type:'text',text};
 }
 return {title,source:ref.source,type:'pdf',bytes};
}
