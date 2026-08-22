const test = require("node:test");
const assert = require("node:assert/strict");
const responses = require("../shared/response-contract.js");

test("exposes exactly the five canonical response modes", () => {
  assert.deepEqual(responses.RESPONSE_TYPES, ["input", "multi_input", "ordered_list", "unordered_set", "self_check"]);
  assert.equal(responses.canonicalType("ox"), "self_check");
});

test("ordered lists retain input order while unordered sets receive a canonical order", () => {
  assert.deepEqual(responses.collect({ responseType: "ordered_list" }, "3, １, 2").value, ["3", "1", "2"]);
  assert.deepEqual(responses.collect({ responseType: "unordered_set" }, "3, １, 2").value, ["1", "2", "3"]);
});

test("multi-input collection retains blank slots, slot ids, and groups", () => {
  const question = {
    responseType: "multi_input",
    fields: [
      { slotId: "left-x", groupId: "point-a" },
      { slotId: "left-y", groupId: "point-a" },
      { slotId: "right-x", groupId: "point-b" }
    ]
  };
  assert.deepEqual(responses.collect(question, JSON.stringify(["2", "", "5"])), {
    value: ["2", "", "5"],
    slotIds: ["left-x", "left-y", "right-x"],
    groupIds: ["point-a", "point-a", "point-b"]
  });
  assert.equal(responses.isAnswered(question, "[\"\",\"\",\"\"]"), false);
  assert.equal(responses.isAnswered(question, "[\"\",\"4\",\"\"]"), true);
});

test("self-check accepts only an explicit O or X learner confirmation", () => {
  assert.deepEqual(responses.collect({ responseType: "self_check" }, "O"), { value: "o" });
  assert.deepEqual(responses.collect({ responseType: "ox" }, "x"), { value: "x" });
  assert.deepEqual(responses.collect({ responseType: "self_check" }, "yes"), { value: "" });
});
