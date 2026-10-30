'use strict';
// Checks one coordinate interpretation; it does not assert that the source has a unique answer.
const assert=require('node:assert/strict'),api=require('./source-5-2-u3-page28-exploration-synthetic.js'),inventory=require('./source-inventory/5-2-source-items.json');
const o=inventory.sourceItems.find(x=>x.sourceItemId==='5-2-u3-e3-exploration');assert(o&&o.sourceVerified&&o.implementationStatus==='review-locked');
const p=api.points({a:65,t:20}),sub=(a,b)=>({x:a.x-b.x,y:a.y-b.y}),dot=(a,b)=>a.x*b.x+a.y*b.y,cross=(a,b)=>a.x*b.y-a.y*b.x,norm=a=>Math.hypot(a.x,a.y),angle=(a,v,b)=>{const u=sub(a,v),w=sub(b,v);return Math.acos(Math.max(-1,Math.min(1,dot(u,w)/norm(u)/norm(w))))*180/Math.PI},near=(a,b)=>assert(Math.abs(a-b)<1e-8);
near(norm(sub(p.G,p.N)),norm(sub(p.G,p.D)));near(norm(sub(p.R,p.M)),norm(sub(p.R,p.D)));near(norm(sub(p.G,p.D)),norm(sub(p.R,p.D)));near(norm(sub(p.N,p.D)),norm(sub(p.M,p.D)));near(cross(sub(p.B,p.G),sub(p.D,p.G)),0);near(cross(sub(p.B,p.R),sub(p.M,p.R)),0);assert(dot(sub(p.B,p.G),sub(p.B,p.D))<0&&dot(sub(p.B,p.R),sub(p.B,p.M))<0);near(angle(p.G,p.N,p.D),65);near(angle(p.M,p.B,p.D),70);near(angle(p.D,p.G,p.R),80);
console.log('PASS: one ordered-correspondence source interpretation yields 80°; uniqueness and publisher key remain unverified');
