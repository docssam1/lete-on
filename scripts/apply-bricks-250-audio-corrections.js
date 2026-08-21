#!/usr/bin/env node
'use strict';

/** Apply Level 2 source corrections verified against the local publisher MP3s. */
const fs = require('fs');
const path = require('path');

const dataArg = process.argv[2];
if (!dataArg) {
  console.error('Usage: node scripts/apply-bricks-250-audio-corrections.js <private-normalized-json>');
  process.exit(2);
}

const dataPath = path.resolve(dataArg);
const cachePath = dataPath.replace(/\.json$/i, '.build-cache.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

function replaceOnce(text, search, replacement, unit) {
  if (!text.includes(search)) throw new Error(`Unit ${unit}: expected source text not found: ${search}`);
  return text.replace(search, replacement);
}

function correct(unit) {
  const paragraphs = [...unit.original.paragraphs];
  switch (Number(unit.unit)) {
    case 1:
      paragraphs[paragraphs.length - 1] = replaceOnce(
        paragraphs.at(-1),
        'but I like the mummies the best! I hope',
        'but I like the mummies the best! Which place would you like to visit? I hope',
        1,
      );
      break;
    case 2:
      paragraphs.unshift('Dear Diary, I had an exciting day! I went on a field trip to the Musée du Louvre. We went to see what the guards do. Our class followed a guard around the museum. The guard’s name was Marc. He takes care of the museum’s security.');
      paragraphs.push('Marc said the museum is protected twenty-four hours a day. Guards really have to stay focused so that the art and visitors are safe. I think they all have a very hard job.');
      break;
    case 3: {
      const index = paragraphs.findIndex(paragraph => paragraph.startsWith('Schools should keep using'));
      if (index < 0) throw new Error('Unit 3: final paragraph not found');
      paragraphs[index] = `KiVa does take some time to have an effect. ${paragraphs[index]}`;
      break;
    }
    case 4:
      paragraphs[paragraphs.length - 1] += ' We can stop bullies if we work together.';
      paragraphs.push('We’ll have a new subject from her in a few days. I’m excited about the next role-playing activity.');
      break;
    case 7:
    case 8:
      break;
    case 13:
      paragraphs.splice(
        1,
        0,
        'James Cook Born in England (1728-1779)',
        '“Ambition leads me not only farther than any other man has been before me, but as far as I think it possible for man to go.”',
      );
      break;
    case 14:
      paragraphs[2] = replaceOnce(
        paragraphs[2],
        'They used oars to move the boat across the water. “Maybe',
        'They used oars to move the boat across the water. “What do you think we will find?” Stuart asked. Betty smiled. “Maybe',
        14,
      );
      break;
    case 15:
      paragraphs[1] = replaceOnce(
        paragraphs[1],
        'there was in the kingdom and it picked on people',
        'there was a bad spirit in the kingdom, and it picked on people',
        15,
      );
      break;
    default:
      throw new Error(`Unexpected correction unit ${unit.unit}`);
  }

  const wordCount = paragraphs.join(' ').trim().split(/\s+/).filter(Boolean).length;
  unit.original = {
    paragraphs,
    wordCount,
    needsReview: false,
    reviewNote: `Verified locally against Track${String(Number(unit.unit) + 1).padStart(2, '0')}.mp3 with faster-whisper small.en and publisher test/teacher-guide text.`,
  };
}

const ids = [1, 2, 3, 4, 7, 8, 13, 14, 15];
for (const collection of [data.levels['2'], cache.source['2'], cache.authored['2']]) {
  for (const id of ids) {
    const unit = collection.find(item => Number(item.unit) === id);
    if (!unit) throw new Error(`Missing Unit ${id} in private collection`);
    correct(unit);
  }
}

fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
console.log(`Applied ${ids.length} audio-verified corrections to normalized data and build cache.`);
