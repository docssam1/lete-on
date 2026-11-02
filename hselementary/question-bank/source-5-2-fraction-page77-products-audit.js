'use strict';
const assert=require('node:assert/strict'),api=require('./source-5-2-fraction-page76-practice.js');const gcd=(a,b)=>b?gcd(b,a%b):a;function product(terms){let n=1n,d=1n;for(const [a,b] of terms){n*=BigInt(a);d*=BigInt(b);const g=gcd(n,d);n/=g;d/=g}return [n,d]}
for(const [terms,expected] of [[[[4,9],[3,7],[5,8]],[5n,42n]],[[[5,6],[9,1],[6,5]],[9n,1n]],[[[35,6],[16,7],[11,4]],[110n,3n]],[[[33,8],[56,11],[11,6]],[77n,2n]]])assert.deepEqual(product(terms),expected);
const staggered=[];for(let n=4;n<=12;n+=2)staggered.push([n,n-1],[n+1,n]);assert.deepEqual(product(staggered),[13n,3n]);assert.deepEqual(product(Array.from({length:990},(_,i)=>[i+10,i+11])),[1n,100n]);
for(const n of [22,23,24]){assert.equal(api.build(n).sourcePrintedPage,77);assert.equal(api.build(n).automaticGrading,false)}console.log('PASS: each subquestion and both telescoping products with exact fractions');
