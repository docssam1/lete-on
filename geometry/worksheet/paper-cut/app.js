import {bank,piecesAfter,tally,solutions,center} from '../../games/paper-cut/model.js?v=straight-cut-1';
import {copy,shapeKey,firstCutPrompt,answerCopy} from '../../games/paper-cut/copy.js?v=straight-cut-2';
const lang=Object.hasOwn(copy,localStorage.getItem('gfield-language'))?localStorage.getItem('gfield-language'):'ko',c=copy[lang];document.documentElement.lang=lang;
const countQuestion=answerCopy[lang].problem+' '+answerCopy[lang].question;
let teacher=new URLSearchParams(location.search).get('answers')==='1';
for(const key of ['student','teacher','print'])document.querySelector('#'+key).textContent=c[key];
document.querySelector('#student').onclick=()=>{teacher=false;render();};document.querySelector('#teacher').onclick=()=>{teacher=true;render();};document.querySelector('#print').onclick=()=>window.print();
const points=polygon=>polygon.map(p=>`${p.x*100},${p.y*100}`).join(' ');
function diagram(task,cut=null,separate=false){
 const pieces=separate?piecesAfter([...task.cuts,...(cut?[cut]:[])]):piecesAfter([]);
 return `<svg viewBox="-10 -10 120 120" role="img" aria-label="${c.title}">${pieces.map(p=>{const at=center(p);return `<polygon transform="translate(${separate?(at.x-.5)*12:0} ${separate?(at.y-.5)*12:0})" points="${points(p)}" fill="#ffecac" stroke="#ab8351" stroke-width=".6"/>`;}).join('')}${!separate?task.cuts.map(([a,b])=>`<path d="M${a.x*100} ${a.y*100}L${b.x*100} ${b.y*100}" fill="none" stroke="#a0587a" stroke-width="1"/>`).join(''):''}${cut&&!separate?`<path d="M${cut[0].x*100} ${cut[0].y*100}L${cut[1].x*100} ${cut[1].y*100}" stroke="#23836c" stroke-width="1.2" stroke-dasharray="3 2"/>`:''}</svg>`;
}
function render(){
 document.body.classList.toggle('teacher',teacher);const items=[...bank.count,...bank.make],pages=Math.ceil(items.length/3);
 document.querySelector('#sheets').innerHTML=Array.from({length:pages},(_,page)=>`<section class="sheet"><header><strong>GFIELD · ${c.title}</strong><span>${page+1} / ${pages} · ${teacher?c.teacher:c.student}</span></header>${items.slice(page*3,page*3+3).map((task,i)=>{const count=task.id.startsWith('count'),answer=count?tally(piecesAfter(task.cuts)):task.target,cut=!count&&teacher?solutions(task)[0]:null;return `<article><h2>${page*3+i+1}. ${count?countQuestion:task.cuts.length?c.makePrompt:firstCutPrompt[lang]}</h2><div class="question">${diagram(task,cut)}${count?diagram(task,null,true):''}<div class="values">${Object.entries(shapeKey).filter(([n])=>answer[n]).map(([n,key])=>`<p>${c[key]}: ${count&&!teacher?'______':answer[n]||0}</p>`).join('')}${teacher&&!count?`<p class="note">${c.example}</p>${diagram(task,cut,true)}`:''}</div></div></article>`;}).join('')}<footer>GFIELD · ${c.title}</footer></section>`).join('');
}
render();
