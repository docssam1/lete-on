import {selectionFor,pagePlan,PRINT_MODES} from './workbook-core.js?v=1';
import {translation,languages} from './i18n.js?v=1';
import {renderPages} from './render.js?v=1';
const $=s=>document.querySelector(s),url=new URL(location.href);
let lang=languages.includes(url.searchParams.get('lang'))?url.searchParams.get('lang'):'ko';
let mode=PRINT_MODES.includes(url.searchParams.get('print'))?url.searchParams.get('print'):'questions';
let selection=selectionFor(url.searchParams);
$('#duplex').checked=url.searchParams.get('duplex')==='1';
function render(){
  const t=translation(lang);document.documentElement.lang=lang;document.title=`GFIELD ${t.title}`;
  for(const [id,key] of [['title','title'],['back','back'],['languageLabel','language'],['activityLabel','activity'],['countLabel','count'],['nameLabel','name'],['modeLabel','mode'],['duplexLabel','duplex'],['print','print'],['selectionNote','selectionNote']])$('#'+id).textContent=t[key];
  $('#language').value=lang;$('#activity').innerHTML=['cut','remain','all'].map(a=>`<option value="${a}">${t[a]}</option>`).join('');$('#activity').value=selection.activity;
  const available=selection.activity==='all'?40:20;$('#count').querySelectorAll('[data-custom]').forEach(o=>o.remove());if(selection.entries.length&&![5,10,20,40].includes(selection.entries.length)){const o=document.createElement('option');o.value=String(selection.entries.length);o.textContent=o.value;o.dataset.custom='true';$('#count').append(o);}$('#count').querySelector('option[value="40"]').disabled=available<40;$('#count').value=String(selection.entries.length||5);
  $('#printMode').innerHTML=PRINT_MODES.map(k=>`<option value="${k}">${t[k]}</option>`).join('');$('#printMode').value=mode;
  $('#duplex').disabled=mode!=='both';$('#print').disabled=selection.error;$('#error').textContent=selection.error?t.invalid:'';
  $('#selectionStatus').textContent=selection.error?'':`${selection.fromGame?t.same:t.pool} · ${selection.entries.length}`;
  $('#back').href=`../../games/number-paper/?activity=${selection.activity==='remain'?'remain':'cut'}&difficulty=${url.searchParams.get('difficulty')==='challenge'?'challenge':'play'}&lang=${lang}`;
  $('#pages').innerHTML=renderPages(pagePlan(selection.entries,mode,$('#duplex').checked),selection.entries,t,$('#studentName').value);
  url.searchParams.set('lang',lang);url.searchParams.set('print',mode);url.searchParams.set('duplex',$('#duplex').checked?'1':'0');history.replaceState(null,'',url);
}
function changeSelection(){url.searchParams.delete('ids');url.searchParams.set('activity',$('#activity').value);url.searchParams.set('count',$('#count').value);selection=selectionFor(url.searchParams);render();}
$('#activity').addEventListener('change',changeSelection);$('#count').addEventListener('change',changeSelection);
$('#language').addEventListener('change',()=>{lang=$('#language').value;render();});$('#printMode').addEventListener('change',()=>{mode=$('#printMode').value;render();});$('#duplex').addEventListener('change',render);$('#studentName').addEventListener('input',render);
$('#print').addEventListener('click',async()=>{if(selection.error)return;await document.fonts.ready;window.print();});
render();
