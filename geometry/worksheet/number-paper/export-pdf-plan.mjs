// Export the same selection, page plan and vector diagrams used by the browser.
import {writeFileSync,mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {bank} from '../../games/number-paper/core.js';
import {selectionFor,pagePlan,solutionFor} from './workbook-core.js';
import {questionFigures,answerFigures} from './render.js';
import {translation} from './i18n.js';
const args=process.argv.slice(2),arg=(key,fallback)=>args.includes(key)?args[args.indexOf(key)+1]:fallback;
const output=resolve(arg('--output','output/pdf/number-paper')),lang=arg('--lang','ko'),t=translation(lang);
mkdirSync(output,{recursive:true});
const current=selectionFor(new URLSearchParams({activity:'remain',ids:arg('--ids',bank.filter(p=>p.activity==='remain').slice(0,5).map(p=>p.id).join(','))}));
if(current.error)throw Error('Invalid current paper selection');
const specs=[...['cut','remain'].flatMap(activity=>['questions','answers'].map(mode=>({name:`number-paper-${activity}-${mode}-20`,entries:bank.filter(p=>p.activity===activity),mode,duplex:false}))),{name:'number-paper-current-five-duplex',entries:current.entries,mode:'both',duplex:true},{name:'number-paper-quick-answers-40',entries:bank,mode:'quick',duplex:false}];
const documents=specs.map(spec=>({name:spec.name,mode:spec.mode,lang,text:t,ids:spec.entries.map(p=>p.id),pages:pagePlan(spec.entries,spec.mode,spec.duplex).map(page=>({...page,entries:page.entries.map(p=>({id:p.id,number:spec.entries.indexOf(p)+1,activity:p.activity,label:t[p.activity],prompt:p.activity==='cut'?t.promptCut:t.promptRemain,questionFigures:questionFigures(p,t),answerFigures:answerFigures(p,t),solution:solutionFor(p)}))}))}));
writeFileSync(resolve(output,'print-plan.json'),JSON.stringify({documents},null,2));
console.log(JSON.stringify({output,documents:documents.map(d=>({name:d.name,pages:d.pages.length,questions:d.ids.length}))}));
