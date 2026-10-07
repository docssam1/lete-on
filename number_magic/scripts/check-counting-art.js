'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),H=require('./comic-helpers');
/* N-07(2026-10-06 다시 그림) — 주사위·도미노의 눈이 캡션의 수와 같은가: 4 → 4+3 → 3 → 도미노 4+3=7. 수직선은 0~10 열한 눈금. */
const panels=require('../data/story-comics-src/N-07')(H).panels;
for(const [i,n] of [4,7,3,7].entries()){
 const p=panels[i];assert.equal((p.art.match(/r="2.6" fill="#D9534F"/g)||[]).length,n,'N-07 panel '+(i+1)+' pips');
 if(i<3)assert.equal((p.art.match(/y1="106" x2="[\d.]+" y2="118"/g)||[]).length,11,'N-07 panel '+(i+1)+' number line ticks');
}
const rods=require('../data/story-comics-src/M-01')(H).panels;
for(const [i,n] of [3,2].entries())assert.equal((rods[i].art.match(/href="assets\/images\/concepts\/counting-rod.png"/g)||[]).length,n);
assert.match(rods[1].art,/nm-dark-counting-rod/);
const png=fs.readFileSync(path.join(root,'assets/images/characters/numi.png'));
assert.equal(png.readUInt32BE(16),512);assert.equal(png.readUInt32BE(20),512);assert.equal(png[25],6,'RGBA PNG');
for(const id of ['N-07','N-10']){const svg=fs.readFileSync(path.join(root,'assets/images/story/'+id+'.svg'),'utf8');assert.match(svg,/href="data:image\/png;base64,/);assert(!/href="assets\//.test(svg));}
assert(/<img class="nm-story-numi" src="assets\/images\/characters\/numi.png"/.test(fs.readFileSync(path.join(root,'app/main.js'),'utf8')),'Story guide must use the official PNG');
console.log('PASS — N-07 dice/domino pips 4/7/3/7 with a 0–10 number line; 512px alpha guide; self-contained printable story art');
