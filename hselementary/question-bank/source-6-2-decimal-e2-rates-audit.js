"use strict";

global.window = {};
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");

const assert = require("node:assert/strict");
const ids = ["6-2-u2-e2-example-3", "6-2-u2-e2-mission-5"];
const rawItems = require("./source-inventory/6-2-source-items.json").items;
const types = window.HSE_CURRICULUM.semesters.find(semester => semester.id === "6-2")
  .units.find(unit => unit.id === "6-2-u2").subunits.flatMap(subunit => subunit.types);

function hundredths(value) {
  const [whole, fraction = ""] = value.split(".");
  assert(fraction.length <= 2, `소수 자릿수가 너무 많음: ${value}`);
  return Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
}

function clockMinutes(hour, minute, afternoon = false) {
  return (Number(hour) % 12 + (afternoon ? 12 : 0)) * 60 + Number(minute);
}

function boatFromPrompt(prompt) {
  const speed = prompt.match(/한 시간에 (\d+(?:\.\d+)?)km씩 가는 배/);
  const distance = prompt.match(/(\d+(?:\.\d+)?)km 떨어진 지점/);
  assert(speed && distance, "배의 원래 빠르기와 이동 거리 표시");
  const decimal = prompt.match(/내려가는 데 (\d+(?:\.\d+)?)시간이 걸렸습니다/);
  const mixed = prompt.match(/내려가는 데 (\d+)시간 (\d+)분이 걸렸습니다/);
  const clocks = prompt.match(/오전 (\d+)시 (\d+)분에 출발해.*오후 (\d+)시 (\d+)분에 도착했습니다/);
  assert.equal(Number(Boolean(decimal)) + Number(Boolean(mixed)) + Number(Boolean(clocks)), 1, "걸린 시간 표현 하나");
  const minutes = decimal ? hundredths(decimal[1]) * 60 / 100
    : mixed ? Number(mixed[1]) * 60 + Number(mixed[2])
      : clockMinutes(clocks[3], clocks[4], true) - clockMinutes(clocks[1], clocks[2]);
  assert(Number.isInteger(minutes) && minutes > 0, "배의 이동 시간");
  const downstreamSixths = hundredths(distance[1]) * 6;
  assert.equal(downstreamSixths % minutes, 0, "표시된 거리와 시간의 정확한 몫");
  const currentTenths = downstreamSixths / minutes - hundredths(speed[1]) / 10;
  assert(Number.isInteger(currentTenths) && currentTenths > 0, "강물의 빠르기가 소수 첫째 자리의 양수");
  return { answer: `${currentTenths / 10}km`, minutes, still: speed[1], distance: distance[1] };
}

function meetingFromPrompt(prompt) {
  const distance = prompt.match(/(\d+(?:\.\d+)?)km 떨어진 곳/);
  const start = prompt.match(/오전 (\d+)시 (정각|\d+분)에/);
  const speeds = prompt.match(/정은이는 한 시간에 (\d+(?:\.\d+)?)km, 우석이는 한 시간에 (\d+(?:\.\d+)?)km/);
  assert(distance && start && speeds, "두 사람의 거리·출발 시각·빠르기 표시");
  const distance100 = hundredths(distance[1]);
  const first10 = hundredths(speeds[1]) / 10;
  const second10 = hundredths(speeds[2]) / 10;
  const delay = prompt.includes("우석이는 30분 뒤 출발했습니다") ? 30 : 0;
  assert(Number.isInteger(first10) && Number.isInteger(second10), "빠르기 소수 첫째 자리");
  assert.equal(delay > 0, !prompt.includes("동시에 출발했습니다"), "출발 조건 모순");
  const startMinute = start[2] === "정각" ? 0 : Number(start[2].replace("분", ""));
  const firstOnlySixths = first10 * delay;
  assert(distance100 * 6 > firstOnlySixths, "두 번째 사람이 출발하기 전에 만나지 않음");
  const together = (distance100 * 6 - firstOnlySixths) / (first10 + second10);
  assert(Number.isInteger(together) && together > 0, "만남이 정확한 분에 한 번 일어남");
  const elapsed = delay + together;
  const when = clockMinutes(start[1], startMinute) + elapsed;
  const hour = Math.floor(when / 60) - 12;
  const minute = when % 60;
  assert(hour > 0 && hour < 12, "만남이 오후에 일어남");
  return { answer: `오후 ${hour}시 ${minute ? `${minute}분` : "정각"}`, delay, elapsed, distance: distance[1] };
}

let checks = 0;
for (const id of ids) {
  const raw = rawItems.find(item => item.sourceItemId === id);
  const type = types.find(item => item.sourceItemId === id);
  const readinessFile = id.endsWith("example-3") ? "6-2-u2-e2-example3-readiness-review.json" : "6-2-u2-e2-mission5-readiness-review.json";
  const readiness = require(`./source-inventory/${readinessFile}`);
  assert(raw && type && !type.reviewLocked && type.rawSourceItemId === id, `${id}: 원문·출제 유형 연결`);
  assert.equal(raw.publicSourceItemId, id);
  assert.equal(raw.pdfPage, id.endsWith("example-3") ? 18 : 19);
  assert.equal(readiness.sourceItemId, id);
  assert.equal(readiness.sourceIdentity.pdfPage, raw.pdfPage);
  assert.equal(readiness.releaseStatus, "verified");
  assert.equal(readiness.verifiedVariantCount, 3);
  const pools = new Set();
  for (const difficulty of [-1, 0, 1]) for (let seed = 1; seed <= 120; seed += 1) {
    const generated = window.HSE_GENERATORS.generate(type, 0, difficulty, seed, seed % 3);
    assert.equal(generated.sourceItemId, id);
    assert.equal(generated.generationMode, "fixed-verified-pool");
    assert.equal(generated.verifiedVariantCount, 3);
    const independently = id.endsWith("example-3") ? boatFromPrompt(generated.prompt) : meetingFromPrompt(generated.prompt);
    assert.equal(generated.answer, independently.answer, `${id}: 표시된 문제만으로 답 독립 계산`);
    assert(generated.solution.includes(generated.answer) && generated.answerVisual.includes(generated.answer), `${id}: 문제·풀이·답 연결`);
    assert(!/<svg|<img/.test(generated.prompt), `${id}: 원문에 없는 그림 추가 금지`);
    assert(!/NaN|Infinity|undefined/.test(JSON.stringify(generated)), `${id}: 잘못된 출력값`);
    if (id.endsWith("example-3")) {
      assert.equal(generated.prompt.includes("오전에 출발"), false);
      assert.equal(generated.prompt.includes("에 출발해"), difficulty === 1, "어려움은 출발·도착 시각을 계산");
      if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
        assert.equal(independently.still, "42.7");
        assert.equal(independently.distance, "245.7");
        assert.equal(independently.minutes, 252);
        assert.equal(independently.answer, "15.8km");
      }
    } else {
      assert.equal(independently.delay, difficulty === 1 ? 30 : 0, "어려움은 30분 늦게 출발");
      if (difficulty === 0 && generated.verifiedPoolIndex === 0) {
        assert.equal(independently.distance, "31.9");
        assert.equal(independently.answer, "오후 2시 30분");
      }
    }
    pools.add(generated.verifiedPoolIndex);
    checks += 1;
  }
  assert.equal(pools.size, 3, `${id}: 검증된 3개 풀 모두 사용`);
}
console.log(`6-2 소수의 나눗셈 속력 2유형: ${checks}회 표시 문항 독립 검산 통과`);
