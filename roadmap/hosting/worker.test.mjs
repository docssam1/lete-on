import test from 'node:test';
import assert from 'node:assert/strict';
import {target,serve} from './worker.mjs';
const root='https://roadmap.gfieldacademy.net';
test('the dedicated root serves the current introduction with queries and safe relative asset paths',async()=>{
 const route=target(new Request(root+'/?goal=medicine'));
 assert.equal(route.url.href,'https://lete-on.gfieldacademy.net/roadmap/demo2/account.html?goal=medicine');
 let inserted='',anchor='';class Rewriter {on(selector,h){if(selector==='head')h.element({prepend(html){inserted=html;}});else h.element({getAttribute(){return '#introduction';},setAttribute(k,v){anchor=v;}});return this;}transform(r){return r;}}
 const r=await serve(new Request(root),async()=>new Response('<html><head></head></html>',{headers:{'content-type':'text/html','etag':'old','content-length':'100','set-cookie':'private=1'}}),Rewriter);
 assert.equal(inserted,'<base href="/roadmap/demo2/">');assert.equal(anchor,'/#introduction');assert.equal(r.headers.get('etag'),null);assert.equal(r.headers.get('set-cookie'),null);
});
test('shared scripts, images, media ranges and conditional asset requests keep the fixed source host',async()=>{
 const request=new Request(root+'/reading-world/fonts/pretendard.woff2?v=2',{headers:{range:'bytes=0-100',cookie:'secret=1',authorization:'Bearer secret','x-roadmap-session':'secret'}}),route=target(request);
 assert.equal(route.url.origin,'https://lete-on.gfieldacademy.net');assert.equal(route.url.pathname,'/reading-world/fonts/pretendard.woff2');
 assert.equal(route.headers.get('range'),'bytes=0-100');for(const name of ['cookie','authorization','x-roadmap-session'])assert.equal(route.headers.get(name),null);
 const staticResponse=await serve(request,async(url,options)=>{assert.equal(options.redirect,'manual');return new Response('media',{status:206,headers:{'content-range':'bytes 0-100/200'}});});assert.equal(staticResponse.status,206);assert.equal(staticResponse.headers.get('content-range'),'bytes 0-100/200');
 assert.equal(target(new Request(root+'//example.invalid/a')).url.host,'lete-on.gfieldacademy.net');
});
test('only read-only static requests and known hostnames reach the source; redirects stay on the new hostname',async()=>{
 let calls=0;const fetcher=async()=>{calls++;return new Response(null,{status:302,headers:{location:'https://lete-on.gfieldacademy.net/roadmap/demo2/planner.html?goal=medicine'}});};
 assert.equal((await serve(new Request(root,{method:'POST',body:'private'}),fetcher)).status,405);assert.equal((await serve(new Request('https://other.example.invalid'),fetcher)).status,421);assert.equal(calls,0);
 const r=await serve(new Request(root),fetcher);assert.equal(r.headers.get('location'),root+'/roadmap/demo2/planner.html?goal=medicine');
 const failed=await serve(new Request(root),async()=>{throw Error('private upstream detail');});assert.equal(failed.status,502);assert.ok(!(await failed.text()).includes('private upstream detail'));
});

test('short plan and account links preserve their query on the canonical application path',async()=>{const r=await serve(new Request(root+'/planner.html?goal=medicine'),()=>{throw Error('must not reach source');});assert.equal(r.status,302);assert.equal(r.headers.get('location'),root+'/roadmap/demo2/planner.html?goal=medicine');});
