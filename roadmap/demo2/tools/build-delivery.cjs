/* Concatenate the existing public classic scripts in their verified load order.
 * No private documents, credentials or generated questions enter this build. */
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {execFileSync}=require('node:child_process');
const source=path.resolve(__dirname,'..'),root=path.resolve(source,'../..');
function read(file){
 const full=path.resolve(source,file.split('?')[0]);
 if(!full.startsWith(root+path.sep))throw Error('Delivery source outside repository');
 return fs.existsSync(full)?fs.readFileSync(full,'utf8'):execFileSync('git',['show','HEAD:'+path.relative(root,full)],{cwd:root,encoding:'utf8'});
}
function build(out){
 const html=read('planner.html'),scripts=[...html.matchAll(/<script\b([^>]*data-member-src="([^"]+)"[^>]*)>/g)].map(m=>({src:m[2],entry:m[1].includes('data-parent-boot')}));
 const styles=[...html.matchAll(/data-member-href="([^"]+)"/g)].map(m=>m[1]);
 if(scripts.filter(s=>s.entry).length!==7||scripts.length<100||styles.length<20)throw Error('Unexpected roadmap delivery manifest');
 const files={},publish=(kind,extension,body)=>{const hash=crypto.createHash('sha256').update(body).digest('hex').slice(0,16),name='planner-'+kind+'.'+hash+'.'+extension;files[name]=body;return name;};
 function scriptBundle(entry){const list=scripts.filter(s=>s.entry===entry);const body=list.map(s=>'\n/* '+s.src+' */\n'+read(s.src)+'\n;\n').join('');new vm.Script(body,{filename:entry?'planner-entry':'planner-runtime'});return publish(entry?'entry':'runtime','js',body);}
 const entry=scriptBundle(true),runtime=scriptBundle(false),style=publish('runtime','css',styles.map(s=>'\n/* '+s+' */\n'+read(s)).join('\n'));
 const prepared=html.replace('<html lang="ko" class="member-checking">','<html lang="ko" class="member-checking" data-entry-bundle="'+entry+'" data-runtime-bundle="'+runtime+'" data-runtime-style="'+style+'">');
 if(prepared===html)throw Error('Missing protected roadmap document root');
 fs.mkdirSync(out,{recursive:true});for(const [name,body]of Object.entries(files))fs.writeFileSync(path.join(out,name),body);
 fs.writeFileSync(path.join(out,'planner.html'),prepared);
 const manifest={entry,runtime,style,assets:Object.keys(files),entryScripts:7,runtimeScripts:scripts.length-7,styles:styles.length};
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(manifest,null,2));return manifest;
}
if(require.main===module){const out=process.argv[2];if(!out)throw Error('Usage: node tools/build-delivery.cjs DESTINATION');console.log(JSON.stringify(build(path.resolve(out))));}
module.exports={build};
