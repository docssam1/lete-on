import test from 'node:test';
import assert from 'node:assert/strict';
import { access, readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { reading } from '../data/reading/s41-u03b.reading.js';
import { media } from '../data/media/s41-u03b.media.js';
import { lesson } from '../data/units/s41-u03b.lesson.js';
import { chapter, art } from '../data/book/s41-u03b.book.js';
import { chapter as hillChapter, art as hillArt } from '../data/book/s41-u03.book.js';
import { similar } from '../data/units/s41-u03.similar.js';
import { readingHtml } from './reading.js';
import { renderChapter } from './book.js';

const pages = (html) => html.split(/(?=<section class="bk-page\b)/).slice(1);
const rail = (html) => html.match(/<aside class="bk-rail">[\s\S]*?<\/aside>/)?.[0] || '';
const escape = (text) => String(text).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

test('lesson, print chapter and standalone article share one reading object', () => {
  assert.equal(lesson.elaborate.reading.magazine, reading);
  assert.equal(chapter.reading, reading);
  assert.equal(reading.unit, lesson.unitId);
  assert.equal(reading.unit, chapter.unit);
  assert.equal(reading.sections.length, 4);
  assert.match(reading.kicker, /독쌤/);
  assert.doesNotMatch(readingHtml(reading), /MSG|우루사/);
});

test('reading reuses the existing photo, video and existing local QR asset', async () => {
  const original = media.gallery.find((image) => image.src === reading.hero.src);
  assert.ok(original, 'hero must come from the existing gallery');
  assert.equal(reading.hero.page, original.page);
  assert.equal(reading.video, media.explore);
  assert.equal(reading.qr, chapter.qr.lab);
  await access(new URL(reading.qr, import.meta.url));
  assert.match(reading.hero.credit, /USGS.*Public domain/);
  const html = readingHtml(reading);
  assert.ok(html.includes(`src="${escape(original.src)}"`));
  assert.ok(html.includes(`href="${escape(original.page)}"`));
  assert.ok(html.includes(`href="${escape(media.explore.page)}"`));
  for (const source of reading.sources) {
    assert.equal(new URL(source.href).protocol, 'https:');
    assert.ok(source.label.trim());
    assert.ok(html.includes(`href="${escape(source.href)}"`));
  }
});

test('student HTML omits teacher guidance rather than hiding it with CSS', () => {
  const student = readingHtml(reading);
  const teacher = readingHtml(reading, { teacher: true });
  assert.doesNotMatch(student, /sl-reading-teacher|교사용/);
  assert.ok(!student.includes(escape(reading.teacherTip)));
  assert.ok(teacher.includes(escape(reading.teacherTip)));
  assert.match(teacher, /class="sl-reading-teacher"/);
  for (const section of reading.sections) {
    assert.ok(student.includes(escape(section.title)));
    assert.ok(teacher.includes(escape(section.title)));
  }
});

test('article text is escaped while only authored bold markers become markup', () => {
  const hostile = '<img src=x onerror="alert(1)"> & "quoted"';
  const article = {
    ...reading, id: hostile, title: hostile, kicker: hostile, issue: hostile,
    topic: hostile, lead: hostile, question: hostile, teacherTip: hostile,
    hero: { ...reading.hero, cap: hostile, credit: hostile, look: hostile },
    sections: [{ title: hostile, text: `**${hostile}**` }],
    sources: [{ href: 'https://example.test/?x=" onmouseover="alert(1)', label: hostile }],
  };
  const html = readingHtml(article, { teacher: true });
  assert.doesNotMatch(html, /<img src=x|<script\b|\son(?:error|mouseover)="/);
  assert.ok(html.includes(`<strong>${escape(hostile)}</strong>`));
  assert.ok(html.includes(`aria-label="${escape(hostile)}"`));
  assert.ok(html.includes('href="https://example.test/?x=&quot; onmouseover=&quot;alert(1)"'));
});

test('unsafe navigation and hero URLs are rejected; approved relative lab links remain usable', () => {
  for (const unsafe of ['javascript:alert(1)', 'data:text/html,<script>alert(1)</script>', '//example.test', 'http://example.test', '../other/#/s41-u03b/2/lab']) {
    const article = {
      ...reading,
      hero: { ...reading.hero, src: unsafe, page: unsafe },
      video: { ...reading.video, page: unsafe }, labHref: unsafe, publicLabHref: unsafe,
      sources: [{ label: '검사', href: unsafe }],
    };
    const html = readingHtml(article);
    assert.ok([...html.matchAll(/\bhref="([^"]*)"/g)].every((m) => m[1] === '#'), unsafe);
    assert.match(html, /<img src="#" alt=/, unsafe);
  }
  const html = readingHtml(reading);
  assert.equal([...html.matchAll(/\bhref="([^"]*)"/g)].filter((m) => m[1] === reading.labHref).length, 1);
  assert.equal([...html.matchAll(/\bhref="([^"]*)"/g)].filter((m) => m[1] === reading.publicLabHref).length, 2);
  for (const [, tag] of html.matchAll(/(<a\b[^>]*target="_blank"[^>]*>)/g)) assert.match(tag, /rel="noopener"/);
  assert.match(html, /<article[^>]+aria-label=/);
  assert.match(html, /<img[^>]+alt="[^"]+"/);
});

test('one magazine page is inserted as physical page 7 without shifting original side notes', () => {
  const { reading: omitted, ...withoutReading } = chapter;
  assert.equal(omitted, reading);
  for (const teacher of [false, true]) {
    const original = pages(renderChapter(withoutReading, art, similar, { teacher }));
    const current = pages(renderChapter(chapter, art, similar, { teacher }));
    assert.equal(original.length, 11);
    assert.equal(current.length, 12);
    assert.equal(current.filter((page) => /class="bk-page [^"]*bk-magazine/.test(page)).length, 1);
    assert.match(current[6], /class="bk-page odd bk-magazine"/);
    assert.ok(current[6].includes(`data-reading-id="${reading.id}"`));
    assert.equal(rail(current[6]), '');
    for (let i = 0; i < original.length; i++) {
      const physicalIndex = i < 6 ? i : i + 1;
      assert.equal(rail(current[physicalIndex]), rail(original[i]), `side notes for original page ${i + 1}, teacher=${teacher}`);
    }
    assert.deepEqual(current.map((page) => Number(page.match(/class="bk-pn">(\d+)/)?.[1])), Array.from({ length: 12 }, (_, i) => i + 1));
    assert.equal(current[6].includes('sl-reading-teacher'), teacher);
    assert.doesNotMatch(current[7], /class="bk-read"/);
  }
});

test('chapters without magazine data preserve their original reading and question pages', () => {
  assert.equal(hillChapter.reading, undefined);
  const html = renderChapter(hillChapter, hillArt, similar);
  assert.doesNotMatch(html, /bk-magazine|sl-reading/);
  assert.match(html, /class="bk-read"/);
  assert.ok(html.includes(escape(hillChapter.note.plus.title)));
  assert.ok(html.includes(escape(hillChapter.note.plus.text)));
  const { reading: omitted, ...withoutReading } = chapter;
  const baseline = renderChapter(withoutReading, art, similar);
  const current = renderChapter(chapter, art, similar);
  const itemIds = (value) => [...value.matchAll(/class="bk-choices"[^>]*data-id="([^"]+)"/g)].map((m) => m[1]);
  assert.ok(itemIds(baseline).length > 0);
  assert.deepEqual(itemIds(current), itemIds(baseline));
});

test('web routing keeps the old reading fallback and loads the shared stylesheet in both entry points', async () => {
  const code = await readFile(new URL('./v2.js', import.meta.url), 'utf8');
  assert.match(code, /x\.reading\.magazine\s*\?/);
  assert.match(code, /readingHtml\(x\.reading\.magazine\)/);
  assert.match(code, /class="card reading"/);
  assert.match(code, /if \(!article\)/);
  assert.match(code, /if \(a === 'reading'\) return pageReading\(u, L, b\)/);
  for (const entry of ['./index.html', '../intro/index.html']) {
    const html = await readFile(new URL(entry, import.meta.url), 'utf8');
    assert.match(html, /rel="stylesheet" href="[^"\n]*reading\.css/);
  }
});

test('intro narration follows the inserted reading page without changing existing voice keys', async () => {
  const code = await readFile(new URL('../intro/intro.js', import.meta.url), 'utf8');
  // Run the actual small narration functions without starting DOM/audio side effects.
  const declaration = (name) => {
    const source = code.match(new RegExp(`function ${name}\\([^]*?\\n\\}`))?.[0];
    assert.ok(source, `${name} is testable independently of the browser`);
    return source;
  };
  const voiceSource = declaration('chapterVoiceKey');
  const narrateSource = declaration('narrate');
  const findReading = code.match(/state\.readingPage = chSecs\.findIndex\([^\n]+?;/)?.[0];
  assert.ok(findReading, 'build locates the magazine from rendered pages, not the unit name');
  const adSay = runInNewContext(`${code.match(/const AD_SAY = \[[^\n]+;/)?.[0]}\nAD_SAY`);
  assert.equal(adSay.length, 13);
  const expectedOriginal = ['live', 'steps', 'steps', 'steps', 'results', 'concept', 'concept', 'gifted', 'report', 'formative', 'check'];
  const expectedReading = [...expectedOriginal.slice(0, 6), 'ad1', ...expectedOriginal.slice(6)];
  const { reading: omitted, ...withoutReading } = chapter;
  const variants = [
    { ch: chapter, artwork: art, expected: expectedReading, readingPage: 7 },
    { ch: withoutReading, artwork: art, expected: expectedOriginal, readingPage: 0 },
    { ch: hillChapter, artwork: hillArt, expected: expectedOriginal, readingPage: 0 },
  ];
  for (const variant of variants) {
    const pageHtml = pages(renderChapter(variant.ch, variant.artwork, similar));
    const state = { readingPage: 999, chCount: pageHtml.length, said: '' };
    const chSecs = pageHtml.map((html) => ({ classList: { contains: (value) => html.match(/^<section class="([^"]+)"/)[1].split(/\s+/).includes(value) } }));
    runInNewContext(findReading, { state, chSecs });
    assert.equal(state.readingPage, variant.readingPage, 'unit changes reset magazine mapping');
    const run = (visible) => {
      const captured = [];
      const currentState = { ...state, said: '' };
      runInNewContext(`${voiceSource}\n${narrateSource}\nnarrate(); narrate();`, {
        state: currentState, AD_SAY: adSay, visiblePages: () => visible,
        document: { querySelector: () => null },
        say: (ids) => captured.push(Array.from(ids)),
      });
      assert.equal(captured.length, 1, 'unchanged pages do not replay narration');
      return captured[0];
    };
    for (let i = 0; i < variant.expected.length; i++) assert.deepEqual(run([adSay.length + i]), [variant.expected[i]], `physical page ${i + 1}, inserted=${state.readingPage}`);
    assert.deepEqual(run([0]), ['cover']);
    assert.deepEqual(run([adSay.length + pageHtml.length]), ['myreport']);
    assert.deepEqual(run([adSay.length + pageHtml.length + 1]), ['sample']);
    assert.deepEqual(run([adSay.length + pageHtml.length + 2]), ['print', 'cta']);
    assert.deepEqual(run([adSay.length + 1, adSay.length + 2]), ['steps'], 'spread deduplicates equal narration');
    if (state.readingPage) assert.deepEqual(run([adSay.length + 6, adSay.length + 7]), ['ad1', 'concept']);
  }
  const narration = JSON.parse(await readFile(new URL('../intro/narration.json', import.meta.url), 'utf8'));
  for (const key of new Set([...expectedReading, ...adSay, 'myreport', 'sample', 'print', 'cta'])) assert.ok(narration.lines.some((line) => line.id === key), `existing narration ${key}`);
});
