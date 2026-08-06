"use strict";
const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const EPS=1e-9;
const INITIAL_PANEL="extremaPanel";

/* ---------- Shared polynomial engine ---------- */
const trim=a=>{a=[...a];while(a.length>1&&Math.abs(a[a.length-1])<EPS)a.pop();return a.length?a:[0]};
const add=(a,b)=>{const n=Math.max(a.length,b.length),c=Array(n).fill(0);for(let i=0;i<n;i++)c[i]=(a[i]||0)+(b[i]||0);return trim(c)};
const scale=(a,k)=>trim(a.map(v=>v*k));
const mul=(a,b)=>{const c=Array(a.length+b.length-1).fill(0);for(let i=0;i<a.length;i++)for(let j=0;j<b.length;j++)c[i+j]+=a[i]*b[j];return trim(c)};
const powPoly=(a,n)=>{if(!Number.isInteger(n)||n<0||n>12)throw Error("지수는 0 이상 12 이하의 정수만 입력하세요.");let r=[1],b=a;while(n){if(n&1)r=mul(r,b);b=mul(b,b);n>>=1}return r};
const evalP=(a,x)=>{let y=0;for(let i=a.length-1;i>=0;i--)y=y*x+a[i];return y};
const deriv=a=>a.length<=1?[0]:a.slice(1).map((v,i)=>v*(i+1));
const integratePoly=a=>{const r=[0];for(let i=0;i<a.length;i++)r[i+1]=a[i]/(i+1);return trim(r)};
const isZeroPoly=a=>trim(a).length===1&&Math.abs(a[0])<EPS;
const samePoly=(a,b)=>{a=trim(a);b=trim(b);if(a.length!==b.length)return false;return a.every((v,i)=>Math.abs(v-b[i])<1e-7)};

function polyDiv(n,d){
  n=trim(n);d=trim(d);
  if(isZeroPoly(d))throw Error("분모는 0이 될 수 없습니다.");
  if(n.length<d.length)return{q:[0],r:n};
  const q=Array(n.length-d.length+1).fill(0),r=[...n],dd=d.length-1,lead=d[dd];
  for(let k=r.length-1;k>=dd;k--){
    const coef=(r[k]||0)/lead,idx=k-dd;q[idx]=coef;
    for(let j=0;j<=dd;j++)r[idx+j]=(r[idx+j]||0)-coef*d[j];
  }
  return{q:trim(q),r:trim(r.slice(0,dd))};
}
function tokenize(raw,variable="x"){
  let s=String(raw||"").replace(/−|–/g,"-").replace(/\*\*/g,"^").replace(/\s+/g,"");
  if(s.includes("="))s=s.split("=").slice(1).join("=");
  s=s.replaceAll(variable.toUpperCase(),variable);
  const other=variable==="x"?"y":"x";
  if(new RegExp(other,"i").test(s))throw Error(`현재 변수는 ${variable}입니다. ${other}가 섞여 있습니다.`);
  const out=[];let i=0;
  while(i<s.length){
    const ch=s[i];
    if(/[0-9.]/.test(ch)){let j=i+1;while(j<s.length&&/[0-9.]/.test(s[j]))j++;const num=Number(s.slice(i,j));if(!Number.isFinite(num))throw Error("숫자 표기를 확인하세요.");out.push({t:"num",v:num});i=j}
    else if(ch===variable){out.push({t:"v"});i++}
    else if("+-*/^()".includes(ch)){out.push({t:ch});i++}
    else throw Error(`읽을 수 없는 문자 '${ch}'가 있습니다.`);
  }
  const r=[],left=t=>t&&(t.t==="num"||t.t==="v"||t.t===")"),right=t=>t&&(t.t==="v"||t.t==="(");
  for(let k=0;k<out.length;k++){if(k>0&&left(out[k-1])&&right(out[k]))r.push({t:"*"});r.push(out[k])}
  return r;
}
function parsePoly(raw,variable="x"){
  const ts=tokenize(raw,variable);let i=0;
  if(!ts.length)throw Error("가운데 식을 입력하세요.");
  const peek=()=>ts[i]?.t,take=t=>{if(peek()!==t)throw Error(`'${t}'가 필요합니다.`);return ts[i++]};
  function expr(){let a=term();while(peek()==="+"||peek()==="-"){const op=ts[i++].t,b=term();a=add(a,scale(b,op==="+"?1:-1))}return a}
  function term(){let a=power();while(peek()==="*"||peek()==="/"){const op=ts[i++].t,b=power();if(op==="*")a=mul(a,b);else{if(b.length!==1||Math.abs(b[0])<EPS)throw Error("이 칸에서는 다항식끼리 나누지 말고 분수 버튼을 사용하세요.");a=scale(a,1/b[0])}}return a}
  function power(){let a=unary();if(peek()==="^"){i++;let sg=1;if(peek()==="-"){i++;sg=-1}const n=take("num").v*sg;a=powPoly(a,n)}return a}
  function unary(){if(peek()==="+"){i++;return unary()}if(peek()==="-"){i++;return scale(unary(),-1)}return base()}
  function base(){if(peek()==="num")return[ts[i++].v];if(peek()==="v"){i++;return[0,1]}if(peek()==="("){i++;const a=expr();take(")");return a}throw Error("식을 읽을 수 없습니다. 괄호와 연산기호를 확인하세요.")}
  const p=trim(expr());if(i!==ts.length)throw Error("식의 뒷부분을 읽지 못했습니다.");return p;
}
function rationalApprox(x,maxDen=60){
  if(Math.abs(x)<1e-10)return[0,1];
  const sign=x<0?-1:1,v=Math.abs(x);let best=[Math.round(v),1],err=Math.abs(v-best[0]);
  for(let q=1;q<=maxDen;q++){const p=Math.round(v*q),e=Math.abs(v-p/q);if(e<err){best=[p,q];err=e}}
  return[sign*best[0],best[1]];
}
const nice=n=>{if(Math.abs(n)<1e-9)n=0;const r=Math.round(n);if(Math.abs(n-r)<1e-8)return String(r);const[p,q]=rationalApprox(n);if(Math.abs(n-p/q)<1e-8)return q===1?String(p):`${p}/${q}`;return String(Number(n.toFixed(5)))};
const fracHTML=(p,q)=>q===1?String(p):`<span class="frac"><span>${p}</span><span>${q}</span></span>`;
function numHTML(n,abs=false){
  if(abs)n=Math.abs(n);const[p,q]=rationalApprox(n);
  if(Math.abs(n-p/q)<1e-8)return fracHTML(p,q);
  return String(Number(n.toFixed(5)));
}
function polyHTML(a,v="x",name="",opts={}){
  a=trim(a);const terms=[];
  for(let d=a.length-1;d>=0;d--){
    const c=a[d];if(Math.abs(c)<EPS)continue;
    const first=terms.length===0,neg=c<0,ac=Math.abs(c);
    let core="";
    if(d===0)core=numHTML(ac);
    else{
      const coef=Math.abs(ac-1)<EPS?"":numHTML(ac);
      core=coef+v+(d===1?"":`<span class="sup">${d}</span>`);
    }
    terms.push(`${neg?"−":first?"":"＋"}${core}`);
  }
  const body=terms.join(" ")||"0";return name?`${name} = ${body}`:body;
}
function termDerivativeHTML(c,d,v="x"){
  const before=polyHTML(Array(d).fill(0).concat([c]),v);
  const after=d===0?"0":polyHTML(Array(d-1).fill(0).concat([c*d]),v);
  return `<span class="term">${before} → ${after}</span>`;
}
function expressionHTML(n,d,v){
  if(d.length===1&&Math.abs(d[0]-1)<EPS)return polyHTML(n,v);
  return `<span class="frac"><span>${polyHTML(n,v)}</span><span>${polyHTML(d,v)}</span></span>`;
}
function integralBlockHTML(block){
  return `∫ ${expressionHTML(block.numer,block.denom,block.variable)} d${block.variable}`;
}

/* ---------- Complex roots for extrema ---------- */
const C=(re,im=0)=>({re,im}),cAdd=(a,b)=>C(a.re+b.re,a.im+b.im),cSub=(a,b)=>C(a.re-b.re,a.im-b.im);
const cMul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const cDiv=(a,b)=>{const q=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/q,(a.im*b.re-a.re*b.im)/q)};
const cAbs=a=>Math.hypot(a.re,a.im);
function evalC(a,z){let y=C(0);for(let i=a.length-1;i>=0;i--)y=cAdd(cMul(y,z),C(a[i]));return y}
function realRoots(a){
  a=trim(a);const n=a.length-1;if(n<=0)return[];if(n===1)return[-a[0]/a[1]];
  const lead=a[n];a=a.map(v=>v/lead);const R=1+Math.max(...a.slice(0,n).map(Math.abs));
  let roots=Array.from({length:n},(_,k)=>{const t=2*Math.PI*k/n+.173;return C(R*Math.cos(t),R*Math.sin(t))});
  for(let it=0;it<1500;it++){let mx=0,next=[];for(let k=0;k<n;k++){let den=C(1);for(let j=0;j<n;j++)if(j!==k)den=cMul(den,cSub(roots[k],roots[j]));if(cAbs(den)<1e-18)den=C(1e-18);const delta=cDiv(evalC(a,roots[k]),den);next[k]=cSub(roots[k],delta);mx=Math.max(mx,cAbs(delta))}roots=next;if(mx<1e-11)break}
  const da=deriv(a),rr=[];
  for(const z of roots)if(Math.abs(z.im)<1e-3){let x=z.re;for(let k=0;k<18;k++){const dv=evalP(da,x);if(Math.abs(dv)<1e-12)break;x-=evalP(a,x)/dv}if(Number.isFinite(x))rr.push(x)}
  rr.sort((a,b)=>a-b);const merged=[];for(const x of rr){if(!merged.length||Math.abs(x-merged.at(-1))>1e-4)merged.push(x);else merged[merged.length-1]=(merged.at(-1)+x)/2}
  return merged.map(x=>Math.abs(x-Math.round(x))<1e-7?Math.round(x):x);
}
function extremaAnalysis(P){
  const D=deriv(P),critical=realRoots(D);
  const extrema=critical.map(x=>{const g=Math.max(.001,Math.min(.04,(1+Math.abs(x))*.002)),l=evalP(D,x-g),r=evalP(D,x+g);
    return{x,y:evalP(P,x),type:l>0&&r<0?"max":l<0&&r>0?"min":"flat"}});
  return{D,critical,extrema};
}

/* ---------- Main tabs ---------- */
function openPanel(id){
  $$(".panel").forEach(p=>p.classList.toggle("active",p.id===id));
  $$(".main-tab").forEach(b=>b.classList.toggle("active",b.dataset.panel===id));
  if(id==="extremaPanel")setTimeout(drawExtremaGraph,0);
  if(id==="integralPanel"&&!integralBlocks.length)loadIntegralExample(1);
  if(id==="testPanel"&&!testState.problem)newTestProblem();
  if(id==="conditionPanel")initConditionModule();
}
$$(".main-tab").forEach(b=>b.addEventListener("click",()=>openPanel(b.dataset.panel)));
