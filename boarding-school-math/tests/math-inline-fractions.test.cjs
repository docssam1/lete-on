"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const test = require("node:test");

function makeElement(tagName) {
  return {
    tagName: tagName,
    className: "",
    attributes: {},
    children: [],
    textContent: "",
    append: function () { this.children.push.apply(this.children, arguments); },
    setAttribute: function (name, value) { this.attributes[name] = value; }
  };
}

test("shared fraction renderer stacks a fraction before sentence punctuation and preserves rates", function () {
  const document = {
    createElement: makeElement,
    createTextNode: function (text) { return { textContent: text, nodeType: 3 }; }
  };
  const window = {};
  const sourcePath = path.join(__dirname, "..", "shared", "math-inline.js");
  vm.runInNewContext(fs.readFileSync(sourcePath, "utf8"), { document: document, window: window });
  const target = makeElement("p");
  window.GFIELDMathText.append(target, "답은 p=11/3. 다른 예는 1/2개. AMC 10/12와 km/h, 2.50달러/병, 300원/개는 비율 표기를 유지합니다.");

  const fractions = target.children.filter(function (child) { return child.className === "math-fraction"; });
  assert.deepEqual(fractions.map(function (fraction) { return fraction.attributes["aria-label"]; }), [
    "3분의 11", "2분의 1"
  ]);
  assert.equal(fractions.every(function (fraction) {
    return fraction.children[0].className === "math-fraction-numerator"
      && fraction.children[1].className === "math-fraction-denominator";
  }), true);
  const plainText = target.children.filter(function (child) { return child.nodeType === 3; })
    .map(function (child) { return child.textContent; }).join("");
  assert.match(plainText, /AMC 10\/12/);
  assert.match(plainText, /km\/h/);
  assert.match(plainText, /2\.50달러\/병/);
  assert.match(plainText, /300원\/개/);
  assert.equal(fractions.some(function (fraction) { return fraction.children[0].textContent === "러" || fraction.children[0].textContent === "원"; }), false);
});
