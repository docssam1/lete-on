'use strict';

const fs=require('node:fs');
const path=require('node:path');
const spatial=require('../challenge/variant-replacement-spatial.js');

const output=path.resolve(process.argv[2]||path.join(__dirname,'challenge-spatial-audit.html'));
const specs=[
  ['r3-main-15-checker-stack-count','checker-stack-count','hard',19],
  ['r3-main-18-tetra-cube-hole-count','tetra-cube-hole-count','same',23],
  ['r3-extra-6-stack-box-fill','cube-count-fill-custom','same',31],
  ['r3-extra-3-block-build-count','block-build-count','same',37]
];

const cards=specs.map(([typeId,kind,difficulty,seed])=>{
  const question=spatial.generate({typeId,number:1,domain:'도형',payload:{kind}},difficulty,seed);
  return `<section><h2>${kind}</h2><p>${question.prompt}</p>${question.problemHtml}</section>`;
}).join('');

fs.mkdirSync(path.dirname(output),{recursive:true});
fs.writeFileSync(output,`<!doctype html><html lang="ko"><meta charset="utf-8"><title>Hyper Focus 공간 유형 시각 검증</title><style>*{box-sizing:border-box}body{margin:20px;background:#edf2f4;font-family:Arial,'Malgun Gothic',sans-serif;display:grid;grid-template-columns:1fr 1fr;gap:18px}section{background:#fff;border:1px solid #cbd6dc;padding:14px;overflow:hidden}h2{font-size:16px;margin:0 0 7px}p{font-size:15px;line-height:1.45;min-height:44px}.challenge-visual{display:block}@media(max-width:520px){body{display:block;width:374px;max-width:calc(100vw - 16px);margin:8px}section{width:100%;margin-bottom:12px;padding:10px}p{font-size:14px;min-height:0}.challenge-visual{width:100%}}@media print{body{margin:8mm;background:#fff;gap:5mm}section{break-inside:avoid;padding:3mm}h2{font-size:11pt}p{font-size:10pt}}</style>${cards}</html>`,'utf8');
console.log(JSON.stringify({output,moduleVersion:spatial.version,cards:specs.length}));
