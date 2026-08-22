const assert = require("node:assert/strict");
const grading = require("../shared/grading.js");

assert.equal(grading.normalize(" １，２００ cm ", { ignoreUnit: true }), "1200");
assert.deepEqual(grading.fraction("6/8"), [3, 4]);
assert.deepEqual(grading.fraction("8분의 6"), [3, 4]);
assert.deepEqual(grading.fraction("-3"), [-3, 1]);
assert.equal(grading.normalize(" ① "), "1");

assert.equal(grading.evaluate("1,200 cm", {
  type: "input",
  mode: "numeric",
  answers: ["1200"],
  normalize: { ignoreUnit: true }
}).state, "correct");

assert.equal(grading.evaluate("3, 1, 2", {
  type: "unordered_set",
  answers: ["1", "2", "3"]
}).state, "correct");

assert.equal(grading.evaluate("3, 1, 2", {
  type: "ordered_list",
  answers: ["1", "2", "3"]
}).state, "wrong");

assert.equal(grading.evaluate(["3", "1", "2"], {
  type: "ordered_list",
  answers: ["3", "1", "2"]
}).state, "correct");

assert.equal(grading.evaluate(["3/4", "2/3"], {
  type: "unordered_set",
  mode: "fraction-equivalent",
  answers: ["4/6", "6/8"]
}).state, "correct");

assert.equal(grading.evaluate("8분의 6", {
  type: "input",
  mode: "fraction-equivalent",
  answers: ["3/4"]
}).state, "correct");

assert.equal(grading.evaluate(["2", "5"], {
  type: "multi_input",
  answers: ["2", "5"]
}).state, "correct");

assert.equal(grading.evaluate({
  value: ["2", "5"],
  slotIds: ["x", "y"],
  groupIds: ["point-a", "point-a"]
}, {
  type: "multi_input",
  slots: [
    { slotId: "x", groupId: "point-a", answers: ["2"] },
    { slotId: "y", groupId: "point-a", answers: ["5"] }
  ]
}).state, "correct");

assert.equal(grading.evaluate({
  value: ["3/4", "2", "-1", "5/6"],
  slotIds: ["p-x", "p-y", "q-x", "q-y"],
  groupIds: ["point-p", "point-p", "point-q", "point-q"]
}, {
  type: "multi_input",
  mode: "fraction-equivalent",
  slots: [
    { slotId: "p-x", groupId: "point-p", answer: "6/8" },
    { slotId: "p-y", groupId: "point-p", answer: "2" },
    { slotId: "q-x", groupId: "point-q", answer: "-1" },
    { slotId: "q-y", groupId: "point-q", answer: "10/12" }
  ]
}).state, "correct");

assert.equal(grading.evaluate({
  value: ["2", "5"],
  slotIds: ["y", "x"],
  groupIds: ["point-a", "point-a"]
}, {
  type: "multi_input",
  slots: [
    { slotId: "x", groupId: "point-a", answers: ["2"] },
    { slotId: "y", groupId: "point-a", answers: ["5"] }
  ]
}).state, "wrong");

assert.equal(grading.evaluate({
  value: ["1", "0", "0", "2"],
  slotIds: ["pair-a-x", "pair-a-y", "pair-b-x", "pair-b-y"],
  groupIds: ["pair-a", "pair-a", "pair-b", "pair-b"]
}, {
  type: "multi_input",
  mode: "numeric",
  variants: [
    [
      { slotId: "pair-a-x", groupId: "pair-a", answer: "1" },
      { slotId: "pair-a-y", groupId: "pair-a", answer: "0" },
      { slotId: "pair-b-x", groupId: "pair-b", answer: "0" },
      { slotId: "pair-b-y", groupId: "pair-b", answer: "2" }
    ],
    [
      { slotId: "pair-a-x", groupId: "pair-a", answer: "0" },
      { slotId: "pair-a-y", groupId: "pair-a", answer: "2" },
      { slotId: "pair-b-x", groupId: "pair-b", answer: "1" },
      { slotId: "pair-b-y", groupId: "pair-b", answer: "0" }
    ]
  ]
}).state, "correct");

assert.equal(grading.evaluate({
  value: ["0", "2", "1", "0"],
  slotIds: ["pair-a-x", "pair-a-y", "pair-b-x", "pair-b-y"],
  groupIds: ["pair-a", "pair-a", "pair-b", "pair-b"]
}, {
  type: "multi_input",
  mode: "numeric",
  variants: [
    [
      { slotId: "pair-a-x", groupId: "pair-a", answer: "1" },
      { slotId: "pair-a-y", groupId: "pair-a", answer: "0" },
      { slotId: "pair-b-x", groupId: "pair-b", answer: "0" },
      { slotId: "pair-b-y", groupId: "pair-b", answer: "2" }
    ],
    [
      { slotId: "pair-a-x", groupId: "pair-a", answer: "0" },
      { slotId: "pair-a-y", groupId: "pair-a", answer: "2" },
      { slotId: "pair-b-x", groupId: "pair-b", answer: "1" },
      { slotId: "pair-b-y", groupId: "pair-b", answer: "0" }
    ]
  ]
}).state, "correct");

assert.deepEqual(grading.evaluate("o", { type: "ox" }), { state: "correct", manual: true });
assert.deepEqual(grading.evaluate("x", { type: "ox" }), { state: "wrong", manual: true });
assert.deepEqual(grading.evaluate("O", { type: "self_check" }), { state: "correct", manual: true });

console.log("highschool-selection grading tests: OK");
