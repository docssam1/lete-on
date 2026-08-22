#!/usr/bin/env node
'use strict';

/** Extend three reviewed passages after audio verification increased source length. */
const fs = require('fs');
const path = require('path');

const dataArg = process.argv[2];
if (!dataArg) {
  console.error('Usage: node scripts/apply-bricks-250-practice-length-fixes.js <private-normalized-json>');
  process.exit(2);
}

const dataPath = path.resolve(dataArg);
const cachePath = dataPath.replace(/\.json$/i, '.build-cache.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

const additions = [
  {
    unit: 2,
    set: 'extraLearning',
    sentence: 'Their careful work lets thousands of families enjoy every exhibit without worrying about damaged machines or unsafe rooms.',
  },
  {
    unit: 2,
    set: 'newPassage',
    sentence: 'He also checks every alarm before visitors arrive and reports any damaged display to the gallery’s repair team.',
  },
  {
    unit: 4,
    set: 'newPassage',
    sentence: 'The class agreed that speaking up together can make the hallway safer for everyone.',
  },
  {
    unit: 13,
    set: 'extraLearning',
    sentence: 'She also supports young researchers around the world who design tools for exploring places that people cannot safely reach on their own.',
  },
  {
    unit: 13,
    set: 'newPassage',
    sentence: 'Many students later joined flight schools after hearing him describe the mission.',
  },
  {
    unit: 14,
    set: 'extraLearning',
    sentence: 'Grandfather smiled when they showed him the box.',
  },
];

for (const collection of [data.levels['2'], cache.authored['2']]) {
  for (const addition of additions) {
    const unit = collection.find(item => Number(item.unit) === addition.unit);
    if (!unit) throw new Error(`Missing Unit ${addition.unit}`);
    const passage = unit[addition.set]?.passage;
    if (!Array.isArray(passage) || !passage.length) throw new Error(`Missing Unit ${addition.unit} ${addition.set}`);
    if (passage.some(paragraph => paragraph.includes(addition.sentence))) continue;
    passage[passage.length - 1] = `${passage.at(-1)} ${addition.sentence}`;
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
console.log(`Applied ${additions.length} reviewed practice-length additions.`);
