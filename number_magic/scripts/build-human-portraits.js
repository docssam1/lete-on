#!/usr/bin/env node
'use strict';
// Render the very same local Three.js models used in town. No image API or paid service.
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require('./lib/playwright'),H=require('../data/human-avatars');
const ROOT=path.resolve(__dirname,'../..'),OUT=path.join(ROOT,'number_magic/assets/characters/portraits');
const preview=process.argv.includes('--preview');
const fixture=`<!doctype html><meta charset="utf-8"><script src="/number_magic/data/human-avatars.js"></script><script type="module">
import * as THREE from '/world-explorer/vendor/three.module.js';
import {makeCharacter,disposeCharacterCache} from '/number_magic/app/char3d/char3d.js';
const r=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});r.setSize(240,300);r.setClearColor(0,0);r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.12;
document.body.appendChild(r.domElement);const scene=new THREE.Scene();scene.add(new THREE.HemisphereLight('#ffffff','#b9c4b0',1.5));const key=new THREE.DirectionalLight('#fff4e6',2.2);key.position.set(4,8,6);scene.add(key);const rim=new THREE.DirectionalLight('#cfe2ff',.8);rim.position.set(-5,4,-6);scene.add(rim);
const cam=new THREE.PerspectiveCamera(36,.8,.1,30);cam.position.set(0,1.05,3.3);cam.lookAt(0,.82,0);
window.portrait=raw=>{const c=makeCharacter(THREE,{...NM_HUMANS.model(raw),height:1.6,blob:true,props:false});scene.add(c.object);c.faceNow(.12);r.render(scene,cam);const url=r.domElement.toDataURL('image/png');c.dispose();disposeCharacterCache(THREE);return url;};window.ready=true;
</script>`;
const server=http.createServer((req,res)=>{if(req.url==='/portrait.html'){res.setHeader('Content-Type','text/html');return res.end(fixture);}const f=path.resolve(ROOT,'.'+decodeURIComponent(req.url.split('?')[0]));if(!f.startsWith(ROOT+path.sep)||!fs.existsSync(f)||!fs.statSync(f).isFile()){res.writeHead(404);return res.end();}res.setHeader('Content-Type',f.endsWith('.js')?'application/javascript':'application/octet-stream');fs.createReadStream(f).pipe(res);});
(async()=>{await new Promise(r=>server.listen(0,'127.0.0.1',r));const b=await chromium.launch({args:['--enable-unsafe-swiftshader']});try{const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));await p.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());await p.goto('http://127.0.0.1:'+server.address().port+'/portrait.html');await p.waitForFunction(()=>window.ready);fs.mkdirSync(OUT,{recursive:true});let count=0;for(const look of H.looks)for(const outfit of H.outfits){if((look.id==='boy'||look.id==='girl')&&outfit.id==='original')continue;if(preview&&(look.id!=='forest-boy'||outfit.id!=='original'))continue;const data=await p.evaluate(raw=>window.portrait(raw),{look:look.id,outfit:outfit.id});fs.writeFileSync(path.join(OUT,look.id+'-'+outfit.id+'.png'),Buffer.from(data.split(',')[1],'base64'));count++;}if(errors.length)throw Error(errors.join('\n'));console.log('OK: '+count+' transparent240×300 portraits rendered from the town model and allowlisted palettes');}finally{await b.close();await new Promise(r=>server.close(r));}})().catch(e=>{console.error(e);process.exitCode=1;});
