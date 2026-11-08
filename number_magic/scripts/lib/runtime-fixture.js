'use strict';
// Use the same source graph as index.html. Avoid eval inheriting a check's
// CommonJS require path (nested browser thread modules then resolve incorrectly).
const fs=require('fs'),path=require('path'),vm=require('vm');
function load(){
 const root=path.resolve(__dirname,'../..'),box={console,URL,URLSearchParams,Math,Date,Set,Map,JSON,TextEncoder,setTimeout,clearTimeout};box.window=box;vm.createContext(box);
 const run=file=>vm.runInContext(fs.readFileSync(path.join(root,file),'utf8'),box,{filename:file,timeout:10000});
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8').replace(/<!--[\s\S]*?-->/g,'');
 for(const m of html.matchAll(/<script\b[^>]*\bsrc=["']([^"']+)["']/g)){const file=m[1].split(/[?#]/)[0];if(/^(engine\/|data\/)/.test(file))run(file);}
 return {world:box,run};
}
module.exports={load};
