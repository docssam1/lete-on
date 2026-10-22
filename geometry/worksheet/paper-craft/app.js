import {selectionFor,pagePlan,modes} from './workbook-core.js?v=20261021-4';
import {translation} from './i18n.js?v=20261021-4';
import {renderPages} from './render.js?v=20261021-4';
const $=s=>document.querySelector(s),url=new URL(location.href),families=['cut','punch','sort','number','top','reverse','stack'];
let lang=['ko','en','zh','ja'].includes(url.searchParams.get('lang'))?url.searchParams.get('lang'):'ko',mode=modes.includes(url.searchParams.get('print'))?url.searchParams.get('print'):'questions',selection=selectionFor(url.searchParams);
$('#duplex').checked=url.searchParams.get('duplex')==='1';
function render(){
  const t={...translation(lang),lang};document.documentElement.lang=lang;document.title='GFIELD '+t.title;
  for(const [id,key] of [['title','title'],['back','back'],['languageLabel','language'],['familyLabel','family'],['countLabel','count'],['nameLabel','name'],['modeLabel','mode'],['duplexLabel','duplex'],['print','print'],['selectionNote','sameNote']])$('#'+id).textContent=t[key];
  $('#language').value=lang;$('#family').innerHTML=`<option value="all">${t.all}</option>`+families.map((key,i)=>`<option value="${key}">${t.families[i]}</option>`).join('');$('#family').value=url.searchParams.get('family')||'all';
  $('#count').querySelectorAll('[data-custom]').forEach(o=>o.remove());if(selection.entries.length&&![5,10,20,33].includes(selection.entries.length)){const o=document.createElement('option');o.value=String(selection.entries.length);o.textContent=o.value;o.dataset.custom='true';$('#count').append(o);}$('#count').value=String(selection.entries.length||5);
  $('#printMode').innerHTML=modes.map(key=>`<option value="${key}">${t[key]}</option>`).join('');$('#printMode').value=mode;$('#duplex').disabled=mode!=='both';$('#print').disabled=selection.error;$('#error').textContent=selection.error?t.invalid:'';
  $('#selectionStatus').textContent=selection.error?'':`${selection.fromGame?t.same:t.pool} · ${selection.entries.length}`;
  $('#back').href='../../games/paper-craft/?lang='+lang+(selection.entries.length?'&id='+selection.entries[0].id:'')+(url.searchParams.get('method')==='connect'?'&method=connect':'');$('#pages').innerHTML=renderPages(pagePlan(selection.entries,mode,$('#duplex').checked),selection.entries,t,$('#studentName').value);
  url.searchParams.set('lang',lang);url.searchParams.set('print',mode);url.searchParams.set('duplex',$('#duplex').checked?'1':'0');history.replaceState(null,'',url);
}
function changeSelection(){url.searchParams.delete('ids');url.searchParams.delete('pattern');url.searchParams.set('family',$('#family').value);url.searchParams.set('count',$('#count').value);selection=selectionFor(url.searchParams);render();}
$('#family').addEventListener('change',changeSelection);$('#count').addEventListener('change',changeSelection);$('#language').addEventListener('change',()=>{lang=$('#language').value;render();});$('#printMode').addEventListener('change',()=>{mode=$('#printMode').value;render();});$('#duplex').addEventListener('change',render);$('#studentName').addEventListener('input',render);$('#print').addEventListener('click',async()=>{if(selection.error)return;await document.fonts.ready;window.print();});render();
