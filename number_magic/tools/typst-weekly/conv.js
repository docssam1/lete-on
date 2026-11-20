// TeX 묶음 → Typst 수식. node conv.js in.json out.json  (in: [tex,...] → out: [typst,...])
const fs=require('fs');const {tex2typst}=require('tex2typst');
const arg=(s,i)=>{ // s[i]==='{' → [inner, next]
  let d=0;for(let j=i;j<s.length;j++){if(s[j]==='{')d++;else if(s[j]==='}'){d--;if(!d)return [s.slice(i+1,j),j+1];}}return [s.slice(i+1),s.length];};
function conv(tex){
  const ph=[];let s=String(tex);
  // 빈칸 \boxed{...\phantom{00}...} → 자리표
  s=s.replace(/\\boxed\s*/g,'\\BOXED');
  let out='',i=0;
  while(i<s.length){
    if(s.startsWith('\\underline',i)){const m=s.slice(i).match(/^\\underline\s*\{\s*\\phantom\{([^}]*)\}\s*\}/);
      if(m){ph.push(`#box(width: ${(0.62*m[1].length+0.6).toFixed(2)}em, height: 1.1em, stroke: (bottom: 0.8pt + luma(60)))`);out+=` \\text{ph${ph.length-1}x} `;i+=m[0].length;continue;}}
    if(s.startsWith('\\BOXED',i)){i+=6;while(s[i]===' ')i++;let inner='';if(s[i]==='{'){[inner,i]=arg(s,i);}
      const m=inner.match(/\\phantom\{([^}]*)\}/);const n=m?m[1].length:1;ph.push(`#blank(${n})`);out+=` \\text{ph${ph.length-1}x} `;continue;}
    if(s.startsWith('\\color',i)&&s[i+6]==='{'){let col,inner;[col,i]=arg(s,i+6);while(s[i]===' ')i++;
      if(s[i]==='{'){[inner,i]=arg(s,i);}else{inner=s.slice(i);i=s.length;}
      ph.push(`#text(fill: rgb("${col}"))[$${conv(inner)}$]`);out+=` \\text{ph${ph.length-1}x} `;continue;}
    out+=s[i++];}
  s=out.replace(/\\(small|scriptsize|footnotesize|normalsize|large|Large|tiny)\b/g,'').replace(/\\hline/g,'').replace(/\\displaystyle/g,'').replace(/\\(v)?phantom\{[^}]*\}/g,'').replace(/\\rule(\[[^\]]*\])?\{[^}]*\}\{[^}]*\}/g,'').replace(/\\kern\s*\{?[-\d.]+\w*\}?/g,'')
       .replace(/\{\}_/g,'\\mathstrut_').replace(/\\;/g,' ');
  let t;
  try{t=tex2typst(s);}catch(e){return null;}
  t=t.replace(/"ph(\d+)x"/g,(_,k)=>ph[+k]).replace(/mathstrut/g,'""').replace(/(^|[\s(])_(?=\S)/g,'$1""_');
  // 숫자 사이 소수점: "0 . 5" → "0.5"
  t=t.replace(/(\d) \. (?=[\d#])/g,'$1.').replace(/(\d) \.$/g,'$1.');
  return t;}
const xs=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
fs.writeFileSync(process.argv[3],JSON.stringify(xs.map(x=>{try{return conv(x)}catch(e){return null}})));
