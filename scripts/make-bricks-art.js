#!/usr/bin/env node
'use strict';

/*
 * Draws one lesson plate per Bricks Reading 250 Level 1 unit.
 *
 *   node scripts/make-bricks-art.js
 *
 * Original geometry only — nothing is traced from or based on the textbook's
 * own artwork, so these are safe to commit. One motif per themed pair, tinted
 * differently for the nonfiction unit and its companion story, so a pair reads
 * as a pair without the two plates looking identical.
 *
 * These are plates, not illustrations: a frame, the unit number, the title and
 * a simple emblem. The three earlier books are already down as needing real
 * artwork, and these are deliberately in the same holding pattern rather than
 * pretending to be more than they are.
 */

const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'reading-world', 'assets', 'images', 'bricks-reading-250-1');

const PAPER = '#faf4ec';
const INK = '#4a2415';
const DEEP = '#8c3a1f';
const MID = '#c1502e';
const WARM = '#e07a4f';
const PALE = '#f3b89f';

// One emblem per themed pair of units.
const MOTIF = {
  1: `<circle cx="400" cy="250" r="86" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <path d="M400 164v172M314 250h172" stroke="${INK}" stroke-width="7"/>
      <rect x="330" y="330" width="140" height="86" rx="10" fill="${PAPER}" stroke="${INK}" stroke-width="8"/>
      <path d="M400 330v86" stroke="${INK}" stroke-width="6"/>`,
  2: `<rect x="286" y="286" width="228" height="96" rx="12" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <rect x="312" y="212" width="176" height="80" rx="12" fill="${PALE}" stroke="${INK}" stroke-width="8"/>
      <circle cx="400" cy="188" r="20" fill="${WARM}" stroke="${INK}" stroke-width="7"/>`,
  3: `<circle cx="372" cy="248" r="58" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <path d="M330 210q42-44 84 0" fill="none" stroke="${INK}" stroke-width="7"/>
      <path d="M470 300q56-30 76 18t-76 26z" fill="${PALE}" stroke="${INK}" stroke-width="8"/>
      <path d="M372 306v96" stroke="${INK}" stroke-width="7"/>`,
  4: `<circle cx="400" cy="228" r="66" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <path d="M400 294v52M368 346h64" stroke="${INK}" stroke-width="8"/>
      <path d="M356 372h88M364 396h72" stroke="${INK}" stroke-width="7"/>
      <path d="M400 130v26M318 172l18 18M482 172l-18 18" stroke="${INK}" stroke-width="7"/>`,
  5: `<path d="M300 196h200l-24 190H324z" fill="${PAPER}" stroke="${INK}" stroke-width="8"/>
      <path d="M300 196q100-40 200 0" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <path d="M352 250h96M348 300h104" stroke="${INK}" stroke-width="6"/>`,
  6: `<circle cx="400" cy="266" r="34" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <path d="M400 232V150" stroke="${INK}" stroke-width="8"/>
      <path d="M330 386q70-56 140 0" fill="none" stroke="${INK}" stroke-width="8"/>
      <circle cx="330" cy="386" r="18" fill="${PALE}" stroke="${INK}" stroke-width="7"/>
      <circle cx="470" cy="386" r="18" fill="${PALE}" stroke="${INK}" stroke-width="7"/>`,
  7: `<path d="M330 380h140l-16-140H346z" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <path d="M346 240q54-48 108 0" fill="none" stroke="${INK}" stroke-width="8"/>
      <path d="M366 300h68M362 340h76" stroke="${INK}" stroke-width="6"/>`,
  8: `<path d="M296 322q104-64 208 0" fill="none" stroke="${INK}" stroke-width="8"/>
      <path d="M296 322q104 64 208 0" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <circle cx="400" cy="212" r="46" fill="${PALE}" stroke="${INK}" stroke-width="8"/>`,
  9: `<path d="M300 350q50-40 100 0t100 0" fill="none" stroke="{a}" stroke-width="12"/>
      <path d="M300 300q50-40 100 0t100 0" fill="none" stroke="${MID}" stroke-width="10"/>
      <path d="M300 250q50-40 100 0t100 0" fill="none" stroke="${PALE}" stroke-width="8"/>`,
  10:`<ellipse cx="400" cy="270" rx="30" ry="52" fill="{a}" stroke="${INK}" stroke-width="8"/>
      <path d="M370 240q-56-46-92-16M430 240q56-46 92-16" fill="none" stroke="${INK}" stroke-width="7"/>
      <path d="M400 322v66" stroke="${INK}" stroke-width="8"/>`,
};

const TITLES = [
  'Awesome After-School Activities', 'A New School',
  'Great Easter Cakes', 'A Busy Pasen',
  'A World without Bees', "A Garden's Best Friends",
  'Accidental Inventions', "Gorden's Invention Contest",
  "UNESCO's Memory of the World", 'Field Trip to Wieliczka Salt Mine',
  'Triathlon: Sports of Champions', 'The Road to Paratriathlon',
  'A Problem with Food Waste', 'The Nicholson Promise',
  'Odd Occupations', 'Ice Cream makers for a Day',
  'Disaster! Floods', 'B Class Saves the Day',
  'Mosquitoes: An Itchy Annoyance', 'Itchy Times at Camp Sunshine',
];

const esc = s => s.replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

fs.mkdirSync(OUT, { recursive: true });

TITLES.forEach((title, i) => {
  const n = i + 1;
  const pair = Math.floor(i / 2) + 1;
  const nonfiction = i % 2 === 0;
  const emblem = MOTIF[pair].replace(/\{a\}/g, nonfiction ? WARM : MID);
  const svg =
`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 520" width="800" height="520" role="img" aria-label="${esc(title)}">
<rect width="800" height="520" rx="38" fill="${PAPER}"/>
<rect x="18" y="18" width="764" height="484" rx="26" fill="none" stroke="${nonfiction ? MID : DEEP}" stroke-width="3" opacity="0.55"/>
<g stroke-linecap="round" stroke-linejoin="round" fill="none">
${emblem}
</g>
<text x="60" y="92" font-family="Georgia,serif" font-size="30" fill="${DEEP}" opacity="0.85">Unit ${n}</text>
<text x="60" y="470" font-family="Georgia,serif" font-size="27" fill="${INK}">${esc(title)}</text>
<text x="740" y="92" text-anchor="end" font-family="Georgia,serif" font-size="19" fill="${MID}" opacity="0.8">${nonfiction ? 'Nonfiction' : 'Story'}</text>
</svg>
`;
  fs.writeFileSync(path.join(OUT, `br${n}.svg`), svg);
});

console.log(`wrote ${TITLES.length} plates to ${path.relative(process.cwd(), OUT)}`);
