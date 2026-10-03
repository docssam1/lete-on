'use strict';
const assert=require('assert/strict'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..'),H=require('./comic-helpers');
const panels=require('../data/story-comics-src/N-07')(H).panels;
for(const [i,n] of [8,8,9,7].entries()){
 const p=panels[i];assert.equal((p.art.match(/href="assets\/images\/concepts\/counting-tile.png"/g)||[]).length,n);
 assert.equal((p.art.match(/width="22" height="22"/g)||[]).length,10);
}
const rods=require('../data/story-comics-src/M-01')(H).panels;
for(const [i,n] of [3,2].entries())assert.equal((rods[i].art.match(/href="assets\/images\/concepts\/counting-rod.png"/g)||[]).length,n);
assert.match(rods[1].art,/nm-dark-counting-rod/);
const png=fs.readFileSync(path.join(root,'assets/images/characters/numi.png'));
assert.equal(png.readUInt32BE(16),512);assert.equal(png.readUInt32BE(20),512);assert.equal(png[25],6,'RGBA PNG');
for(const id of ['N-07','N-10']){const svg=fs.readFileSync(path.join(root,'assets/images/story/'+id+'.svg'),'utf8');assert.match(svg,/href="data:image\/png;base64,/);assert(!/href="assets\//.test(svg));}
assert(/<img class="nm-story-numi" src="assets\/images\/characters\/numi.png"/.test(fs.readFileSync(path.join(root,'app/main.js'),'utf8')),'Story guide must use the official PNG');
console.log('PASS — ten-frame counts 8/8/9/7; 512px alpha guide; self-contained printable story art');
