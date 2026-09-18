"use strict";

const test=require("node:test");
const assert=require("node:assert/strict");
const fs=require("node:fs");
const path=require("node:path");

const repoRoot=path.resolve(__dirname,"..","..");
const skillRoot=path.join(repoRoot,"skills","gmap-local-question-coach");
const script=fs.readFileSync(path.join(skillRoot,"assets","gmap-local-question-coach.js"),"utf8");
const css=fs.readFileSync(path.join(skillRoot,"assets","gmap-local-question-coach.css"),"utf8");
const page=fs.readFileSync(path.join(repoRoot,"boarding-school-math","competition-practice.html"),"utf8");
const publicScript=fs.readFileSync(path.join(repoRoot,"boarding-school-math","shared","gmap-local-question-coach.js"),"utf8");
const publicCss=fs.readFileSync(path.join(repoRoot,"boarding-school-math","shared","gmap-local-question-coach.css"),"utf8");
const canonicalGeometry=fs.readFileSync(path.join(repoRoot,"geometry","worksheet","render.js"),"utf8");
const publicGeometry=fs.readFileSync(path.join(repoRoot,"boarding-school-math","shared","geometry-worksheet-render.js"),"utf8");
function normalizedSource(value){return value.replace(/\r\n/g,"\n").trimEnd();}

test("competition practice loads the reusable local coach",function(){
  assert.match(page,/gmap-local-question-coach\.css/);
  assert.match(page,/gmap-local-question-coach\.js/);
  assert.match(page,/competition-practice-analysis\.js/);
});

test("folder-scoped preview assets stay source-identical to their reviewed copies",function(){
  assert.equal(normalizedSource(publicScript),normalizedSource(script));
  assert.equal(normalizedSource(publicCss),normalizedSource(css));
  assert.equal(normalizedSource(publicGeometry),normalizedSource(canonicalGeometry));
  assert.match(page,/\.\/shared\/geometry-worksheet-render\.js/);
  assert.match(page,/\.\/shared\/gmap-local-question-coach\.js/);
});

test("the coach has no network or credential surface",function(){
  assert.doesNotMatch(script,/\bfetch\s*\(|XMLHttpRequest|WebSocket|EventSource|sendBeacon/i);
  assert.doesNotMatch(script,/https?:\/\/|apiKey|authorization|localStorage|sessionStorage/i);
  assert.match(script,/student view does not reveal the answer immediately/i);
  assert.match(script,/학생용에서는 정답을 바로 제시하지 않습니다/);
});

test("the coach remains keyboard-sized, mobile bounded, and absent from print",function(){
  assert.match(css,/min-height:44px/);
  assert.match(css,/@media \(max-width:560px\)/);
  assert.match(css,/@media print\s*\{\s*\.gmap-ai-launch,\.gmap-ai-dialog\s*\{\s*display:none !important/);
});
