#!/usr/bin/env node
'use strict';

const assert = require('assert/strict');
const childProcess = require('child_process');
const fs = require('fs');
const http = require('http');
const os = require('os');
const path = require('path');
const { chromium } = require('./lib/playwright');

const root = path.resolve(__dirname, '..');
const artifactDir = process.env.NM_LOGO_ARTIFACTS && path.resolve(process.env.NM_LOGO_ARTIFACTS);
const server = http.createServer((req, res) => {
  const file = path.resolve(root, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!file.startsWith(root + path.sep) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404);
    return res.end();
  }
  res.setHeader('Content-Type', ({
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.svg': 'image/svg+xml',
    '.png': 'image/png'
  })[path.extname(file)] || 'application/octet-stream');
  fs.createReadStream(file).pipe(res);
});

function ppm(buffer) {
  let i = 0;
  const tokens = [];
  while (tokens.length < 4) {
    while (i < buffer.length && /\s/.test(String.fromCharCode(buffer[i]))) i++;
    if (buffer[i] === 35) {
      while (i < buffer.length && buffer[i] !== 10) i++;
      continue;
    }
    const start = i;
    while (i < buffer.length && !/\s/.test(String.fromCharCode(buffer[i]))) i++;
    tokens.push(buffer.slice(start, i).toString('ascii'));
  }
  while (i < buffer.length && /\s/.test(String.fromCharCode(buffer[i]))) i++;
  assert.equal(tokens[0], 'P6');
  assert.equal(Number(tokens[3]), 255);
  return { width: Number(tokens[1]), height: Number(tokens[2]), data: buffer.subarray(i) };
}

function logoPixels(file) {
  const image = ppm(fs.readFileSync(file));
  const x0 = Math.round(image.width * 0.045);
  const x1 = Math.round(image.width * 0.16);
  const y0 = Math.round(image.height * 0.03);
  const y1 = Math.round(image.height * 0.068);
  let colored = 0, minX = x1, minY = y1, maxX = x0, maxY = y0;
  for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
    const p = (y * image.width + x) * 3;
    const r = image.data[p], g = image.data[p + 1], b = image.data[p + 2];
    if (Math.max(r, g, b) - Math.min(r, g, b) > 24 && Math.min(r, g, b) < 225) {
      colored++;
      minX = Math.min(minX, x); minY = Math.min(minY, y); maxX = Math.max(maxX, x); maxY = Math.max(maxY, y);
    }
  }
  return { width: image.width, height: image.height, colored, bounds: { minX, minY, maxX, maxY } };
}

(async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'nm-print-logo-'));
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch(process.env.NM_CHROMIUM ? { executablePath: process.env.NM_CHROMIUM } : {});
    const page = await browser.newPage({ viewport: { width: 1100, height: 1100 } });
    await page.route('**/*', route => !['GET', 'HEAD'].includes(route.request().method()) || /supabase|google-analytics/.test(route.request().url()) ? route.abort() : route.continue());
    await page.addInitScript(() => { window.NM_NO_AUTOPRINT = true; window.print = () => {}; });
    await page.goto(`http://127.0.0.1:${server.address().port}/drill.html`, { waitUntil: 'networkidle' });
    const screen = await page.evaluate(async () => {
      NM_EXAM.renderPrint({ thread: 'MD79', level: 4, count: 12, seed: 'logo-screen-proof' });
      const mark = document.querySelector('.nm-w2-brand-mark');
      const image = mark.querySelector('.nm-w2-brand-logo');
      await image.decode();
      return {
        imageDisplay: getComputedStyle(image).display,
        printDisplay: getComputedStyle(mark.querySelector('.nm-w2-brand-logo-print')).display,
        complete: image.complete,
        naturalWidth: image.naturalWidth
      };
    });
    assert.deepEqual(screen, { imageDisplay: 'block', printDisplay: 'none', complete: true, naturalWidth: 357 });
    await page.emulateMedia({ media: 'print' });
    const dom = await page.evaluate(async () => {
      NM_EXAM.renderPrint({ thread: 'MD79', level: 4, count: 12, seed: 'logo-multipage-proof' });
      await document.fonts.ready;
      await Promise.all([...document.images].map(image => image.decode().catch(() => {})));
      await new Promise(requestAnimationFrame);
      await new Promise(requestAnimationFrame);
      const marks = [...document.querySelectorAll('.nm-w2-brand-mark')];
      return {
        studentPages: document.querySelectorAll('.nm-w2-page').length,
        marks: marks.length,
        rows: marks.map(mark => ({
          aria: mark.getAttribute('aria-label'),
          imageDisplay: getComputedStyle(mark.querySelector('.nm-w2-brand-logo')).display,
          printDisplay: getComputedStyle(mark.querySelector('.nm-w2-brand-logo-print')).display,
          printText: mark.querySelector('.nm-w2-brand-logo-print').textContent.trim()
        }))
      };
    });
    assert.equal(dom.studentPages, 4);
    assert.equal(dom.marks, 5);
    assert.ok(dom.rows.every(row => row.aria === 'GFIELD' && row.imageDisplay === 'none' && row.printDisplay === 'flex' && row.printText === 'GFIELD'));

    const pdf = path.join(temp, 'md79-logo-proof.pdf');
    await page.pdf({ path: pdf, format: 'A4', printBackground: true });
    const info = childProcess.execFileSync('pdfinfo', [pdf], { encoding: 'utf8' });
    const match = info.match(/^Pages:\s+(\d+)/m);
    assert.ok(match, 'pdfinfo page count missing');
    const pages = Number(match[1]);
    assert.equal(pages, 5);

    const prefix = path.join(temp, 'page');
    childProcess.execFileSync('pdftoppm', ['-r', '96', pdf, prefix]);
    const ppmFiles = fs.readdirSync(temp).filter(name => /^page-\d+\.ppm$/.test(name)).sort((a, b) => Number(a.match(/\d+/)[0]) - Number(b.match(/\d+/)[0]));
    assert.equal(ppmFiles.length, pages);
    const raster = ppmFiles.map(name => logoPixels(path.join(temp, name)));
    assert.ok(raster.every(result => result.colored >= 45), JSON.stringify(raster));
    if (artifactDir) {
      fs.mkdirSync(artifactDir, { recursive: true });
      fs.copyFileSync(pdf, path.join(artifactDir, 'MD79-L4-logo-proof.pdf'));
      for (const name of ppmFiles) fs.copyFileSync(path.join(temp, name), path.join(artifactDir, `MD79-L4-logo-proof-${name}`));
    }
    console.log(JSON.stringify({ pass: true, pages, screen, dom, raster }, null, 2));
  } finally {
    if (browser) await browser.close();
    await new Promise(resolve => server.close(resolve));
    if (temp.startsWith(os.tmpdir() + path.sep)) fs.rmSync(temp, { recursive: true, force: true });
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
