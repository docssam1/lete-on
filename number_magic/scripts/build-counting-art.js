'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert/strict');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'assets/images/concepts/hands-nine.png'));
assert.equal(src.toString('hex',0,8),'89504e470d0a1a0a');
// SVG loaded through <img> cannot fetch an external PNG reliably. Embed the
// reviewed raster once; typeset the equation, not AI-generated numerals.
const html=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 340" role="img" aria-label="Nine open fingers: ten minus one"><rect width="640" height="340" rx="18" fill="#FBFAF7"/><image href="data:image/png;base64,${src.toString('base64')}" x="75" y="18" width="490" height="274" preserveAspectRatio="xMidYMid meet"/><text x="320" y="318" text-anchor="middle" font-family="sans-serif" font-size="30" font-weight="700" fill="#16417C">9 = 10 − 1</text></svg>\n`;
const file=path.join(root,'assets/images/story/N-07.svg');
if(process.argv.includes('--check'))assert.equal(fs.readFileSync(file,'utf8'),html,'Rebuild counting art');
else fs.writeFileSync(file,html);
const chart=path.join(root,'assets/images/story/N-10.svg');
const original=fs.readFileSync(chart,'utf8');
const numi=fs.readFileSync(path.join(root,'assets/images/characters/numi.png')).toString('base64');
const rendered=original.replace(/<image href="[^"]*" x="123" y="7" width="42" height="55"\/>/,`<image href="data:image/png;base64,${numi}" x="123" y="7" width="42" height="55"/>`);
assert.match(rendered,/href="data:image\/png;base64,/,'Missing chart guide');
if(process.argv.includes('--check'))assert.equal(original,rendered,'Rebuild chart guide');
else fs.writeFileSync(chart,rendered);
console.log('PASS — nine-finger reviewed illustration and exact typeset equation');
