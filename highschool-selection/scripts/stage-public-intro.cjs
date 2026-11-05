'use strict';
// Explicit public allowlist: never copy the whole program, server, bank or tests.
const fs = require('node:fs');
const path = require('node:path');
const source = path.resolve(__dirname, '..');
const files = [
  ['promo/index.html', 'promo/index.html'],
  ['promo/promo.css', 'promo/promo.css'],
  ['promo/notices.js', 'promo/notices.js'],
  ['data/academy-notices.js', 'data/academy-notices.js'],
  ['data/available-mocks.js', 'data/available-mocks.js'],
  ['data/official-exam-specs.js', 'data/official-exam-specs.js'],
  ['promo/assets/fonts/pretendard-var.woff2', 'promo/assets/fonts/pretendard-var.woff2'],
  ['promo/assets/fonts/OFL-Pretendard.txt', 'promo/assets/fonts/OFL-Pretendard.txt'],
  ['promo/assets/logos/sh.png', 'promo/assets/logos/sh.png'],
  ['promo/assets/logos/dp.png', 'promo/assets/logos/dp.png'],
  ['promo/assets/logos/wm-transparent-v2.png', 'promo/assets/logos/wm-transparent-v2.png'],
  ['promo/assets/logos/ed-transparent-v2.png', 'promo/assets/logos/ed-transparent-v2.png'],
  ['promo/assets/logos/dg.webp', 'promo/assets/logos/dg.webp'],
  ['promo/assets/logos/sm-transparent-v2.png', 'promo/assets/logos/sm-transparent-v2.png'],

  ['shared/app.css', 'shared/app.css'],
  ['data/public-exam-profiles.js', 'data/public-exam-profiles.js'],
  ['data/catalog.js', 'data/catalog.js'],
  ['data/academy-engagement.js', 'data/academy-engagement.js'],
  ['data/standard-exam-policy.js', 'data/standard-exam-policy.js'],
  ['public/exam-entry.html', 'login.html'],
  ['public/exam-entry.js', 'exams/app.js'],
  ['public/exam-entry.css', 'exams/app.css'],
  ['public/index.html', 'index.html']
];
function stagePublicIntro(dest) {
  if (!dest) throw new Error('A new --dest directory is required');
  const target = path.resolve(dest);
  if (fs.existsSync(target)) throw new Error('Destination must not exist; refusing to overwrite');
  // Read and validate all inputs before creating the destination.
  const entries = files.map(([from,to]) => {
    const filename=path.join(source,from);
    if (fs.lstatSync(filename).isSymbolicLink()) throw new Error('Symlink source rejected');
    return [to,fs.readFileSync(filename)];
  });
  fs.mkdirSync(target,{recursive:true});
  for (const [to,bytes] of entries) {
    const filename=path.join(target,to);
    fs.mkdirSync(path.dirname(filename),{recursive:true});
    fs.writeFileSync(filename,bytes,{flag:'wx'});
  }
  return entries.map(([to])=>to);
}
if (require.main===module) {
  const i=process.argv.indexOf('--dest');
  console.log(JSON.stringify({files:stagePublicIntro(i<0?null:process.argv[i+1])}));
}
module.exports={stagePublicIntro};
