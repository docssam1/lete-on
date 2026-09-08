import assert from "node:assert/strict";
import { chromium } from "file:///C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs";
const browser=await chromium.launch();
const page=await browser.newPage({viewport:{width:1200,height:1000}});
const base=process.env.GFIELD_BASE_URL || "http://127.0.0.1:8765";
try{
  await page.goto(base+"/geometry/games/perimeter/");
  const result=await page.evaluate(async()=>{
    const core=await import("./core.js?v=perimeter-1"),{renderProblem}=await import("./render.js?v=perimeter-1");
    let cases=0;const errors=[];
    for(const d of core.domains)for(const p of core.problemsFor(d.id))for(const lang of ["ko","en","zh","ja"])for(const reveal of [false,true])for(const layout of ["vertical","horizontal"]){
      const source=renderProblem(p,{lang,reveal,layout}),doc=new DOMParser().parseFromString(source,"image/svg+xml"),label=`${p.id}/${lang}/${reveal}/${layout}`;
      if(doc.querySelector("parsererror")){errors.push(`${label}:invalid XML`);continue;}
      const root=doc.documentElement,figures=[p.cells];
      if(p.domain==="compare")figures.push(p.other);
      if(p.domain==="build"&&reveal)figures.push(p.example);
      const fills=[...root.querySelectorAll("rect")].filter(el=>["#c4e6dd","#ead5dc","#dbe8ee"].includes(el.getAttribute("fill")));
      if(fills.length!==figures.reduce((n,c)=>n+c.length,0))errors.push(`${label}:cell fill mismatch or answer leak`);
      const expected=figures.reduce((sum,cells)=>{
        const set=new Set(cells.map(c=>`${c.x},${c.y}`));
        return sum+cells.reduce((n,{x,y})=>n+[[x-1,y],[x+1,y],[x,y-1],[x,y+1]].filter(a=>!set.has(a.join(","))).length,0);
      },0);
      const lines=[...root.querySelectorAll("line")].filter(el=>el.getAttribute("stroke-dasharray")===null);
      if(lines.length!==expected)errors.push(`${label}:boundary line count`);
      for(const el of lines){const x1=+el.getAttribute("x1"),x2=+el.getAttribute("x2"),y1=+el.getAttribute("y1"),y2=+el.getAttribute("y2");if(Math.abs(x2-x1)+Math.abs(y2-y1)!==44)errors.push(`${label}:changed unit length`);}
      if(root.querySelector("[role=button],[data-cell],[data-edge]"))errors.push(`${label}:interactive print surface`);
      cases++;
    }
    return {cases,errors};
  });
  assert.equal(result.cases,1280);assert.deepEqual(result.errors,[]);console.log(JSON.stringify(result));
}finally{await browser.close();}
