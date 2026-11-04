const assert = require("node:assert/strict");
const reference = require("../competition/amc8-item-response-reference.js");

for (const year of [2004, 2009, 2010, 2011]) assert.equal(reference.questionsByYear[year].length, 25);
const official2004Key = ["B", "B", "A", "B", "D", "C", "B", "B", "D", "E", "C", "B", "E", "C", "C", "C", "D", "A", "B", "D", "D", "B", "D", "C", "D"];
for (let question = 1; question <= 25; question++) {
  const item = reference.questionsByYear[2004][question - 1];
  assert.equal(item.correctAnswer, official2004Key[question - 1]);
  assert.equal(item.respondentCount, 154590);
  const row = reference.responseFor(2004, question, "");
  if (question === 1) {
    assert.equal(row, null, "2004 question 1 source percentages total 99.74% and stay suppressed");
    continue;
  }
  assert.ok(row, `2004 question ${question} should have a reconciled cohort reference`);
  const total = Object.values(row.responsePercent).reduce((sum, value) => sum + value, row.omittedPercent + row.unreadablePercent);
  assert.ok(Math.abs(total - 100) < 0.15, `2004 question ${question} sums to ${total}`);
}
assert.equal(reference.responseFor(2004, 8, "E").correctResponsePercent, 51);
assert.equal(reference.responseFor(2004, 8, "E").selectedResponsePercent, 7.09);
const official2007Key = ["D", "E", "C", "D", "B", "E", "D", "B", "B", "D", "D", "A", "C", "C", "A", "A", "C", "D", "C", "A", "D", "C", "B", "C", "B"];
assert.equal(reference.questionsByYear[2007].length, 25);
for (let question = 1; question <= 25; question++) {
  const row = reference.responseFor(2007, question, "", 7);
  assert.equal(reference.questionsByYear[2007][question - 1].correctAnswer, official2007Key[question - 1]);
  if ([15, 19, 20, 21, 22, 23].includes(question)) {
    assert.equal(row, null, `2007 question ${question} source percentages do not reconcile within tolerance`);
    continue;
  }
  assert.ok(row, `2007 question ${question} should have a reconciled national reference`);
  assert.equal(row.respondentCount, 150618);
  const total = Object.values(row.responsePercent).reduce((sum, value) => sum + value, row.omittedPercent);
  assert.ok(Math.abs(total - 100) < 0.15, `2007 question ${question} sums to ${total}`);
}
assert.equal(reference.responseFor(2007, 10, "C").correctResponsePercent, 22.12);
assert.equal(reference.responseFor(2007, 10, "C").selectedResponsePercent, 31.59);
const official2008Key = ["B", "A", "A", "C", "E", "D", "E", "D", "D", "D", "A", "C", "C", "C", "B", "D", "D", "E", "B", "B", "C", "A", "C", "C", "A"];
assert.equal(reference.questionsByYear[2008].length, 25);
for (let question = 1; question <= 25; question++) {
  const item = reference.questionsByYear[2008][question - 1];
  assert.equal(item.correctAnswer, official2008Key[question - 1]);
  assert.equal(item.respondentCount, 148731);
  if ([12].includes(question)) assert.deepEqual(item.acceptedAnswers, ["C", "D", "E"]);
}
for (const question of [18, 19, 22, 23, 24]) assert.equal(reference.responseFor(2008, question, ""), null);
assert.equal(reference.responseFor(2008, 12, "D").correctAnswer, "C");
assert.equal(reference.responseFor(2008, 12, "D").correctResponsePercent, 63.68);
assert.equal(reference.responseFor(2008, 12, "D").selectedResponsePercent, 17.87);
for (const year of [2012, 2013, 2014, 2015]) {
  assert.equal(reference.questionsByYear[year].length, 25);
  for (let question = 1; question <= 25; question++) {
    const row = reference.responseFor(year, question, "", 7);
    if (year === 2013 && question === 20) {
      assert.equal(row, null, "2013 question 20 source percentages do not reconcile to 100%");
      continue;
    }
    assert.ok(row, `${year} question ${question} should have a Global reference`);
    const total = Object.values(row.responsePercent).reduce((sum, value) => sum + value, row.omittedPercent + row.unreadablePercent);
    assert.ok(Math.abs(total - 100) < 0.15, `${year} question ${question} sums to ${total}`);
  }
}
assert.equal(reference.responseFor(2013, 1, "", 7).correctAnswer, "A");
assert.equal(reference.responseFor(2013, 25, "", 8).correctAnswer, "A");
assert.equal(reference.responseFor(2013, 8, "B", 7).correctResponsePercent, 24.36);
assert.equal(reference.responseFor(2013, 8, "B", 7).selectedResponsePercent, 29.06);
assert.equal(reference.responseFor(2013, 8, "", 7).respondentCount, 149709);
assert.equal(reference.responseFor(2013, 8, "", 7).population, "2013 AMC 8 global participant response cohort");
assert.equal(reference.responseFor(2013, 8, "", 6).respondentCount, 149709);
assert.equal(reference.responseFor(2013, 8, "", 9).respondentCount, 149709);
assert.equal(reference.responseFor(2013, 8, "", undefined).respondentCount, 149709);
assert.equal(reference.responseFor(2013, 20, "", 7), null);
assert.equal(reference.responseFor(2014, 1, "", 7).correctAnswer, "A");
assert.equal(reference.responseFor(2014, 25, "", 7).correctAnswer, "B");
assert.equal(reference.responseFor(2014, 25, "B", 7).correctResponsePercent, 16.74);
for (const [year, key] of [[2013, ["A", "D", "E", "C", "E", "C", "C", "C", "C", "C", "D", "B", "A", "C", "B", "E", "B", "B", "D", "C", "E", "E", "B", "C", "A"]], [2014, ["A", "E", "B", "E", "C", "D", "B", "D", "D", "A", "A", "B", "D", "B", "C", "B", "B", "D", "A", "B", "A", "E", "A", "C", "B"]]]) {
  for (let question = 1; question <= 25; question++) {
    assert.equal(reference.questionsByYear[year][question - 1].correctAnswer, key[question - 1]);
  }
}
const official2015Key = ["A", "D", "D", "E", "A", "B", "E", "D", "D", "B", "B", "C", "D", "D", "D", "B", "D", "B", "A", "D", "C", "C", "D", "B", "C"];
for (let question = 1; question <= 25; question++) {
  const row = reference.responseFor(2015, question, "", 7);
  assert.equal(row.respondentCount, 149844);
  assert.equal(row.correctAnswer, official2015Key[question - 1]);
}
assert.equal(reference.responseFor(2015, 8, "C", 7).correctResponsePercent, 26.46);
assert.equal(reference.responseFor(2015, 8, "C", 7).selectedResponsePercent, 25.75);
assert.equal(reference.responseFor(2015, 8, "", 6).respondentCount, 149844);
assert.equal(reference.responseFor(2015, 8, "", 8).respondentCount, 149844);
assert.equal(reference.responseFor(2008, 3, "B").correctAnswer, "A");
assert.equal(reference.responseFor(2008, 3, "B").selectedResponsePercent, 6.22);
assert.equal(reference.responseFor(2010, 26, "B"), null);
assert.equal(reference.responseFor(2010, 3, "B").correctAnswer, "C");
assert.equal(reference.responseFor(2010, 3, "B").selectedResponsePercent, 20.97);
assert.equal(reference.responseFor(2010, 3, "B").correctResponsePercent, 64.41);
assert.deepEqual(reference.responseFor(2010, 3, "").mostCommonDistractor, { answer: "B", percent: 20.97 });
assert.equal(reference.responseFor(2010, 25, "E").correctResponsePercent, 18.41);
assert.equal(reference.responseFor(2009, 3, "A").correctAnswer, "C");
assert.equal(reference.responseFor(2009, 1, "", undefined, "maa-national").respondentCount, 151367);
assert.equal(reference.responseFor(2009, 1, "", undefined, "maa-national").population, "2009 AMC 8 MAA annual report item-response cohort");
assert.equal(reference.responseFor(2009, 1, "A", undefined, "maa-national").correctResponsePercent, 94.76);
assert.equal(reference.responseFor(2009, 1, "A", undefined, "maa-national").selectedResponsePercent, 0.15);
assert.equal(reference.responseFor(2009, 3, "", undefined, "maa-national"), null);
assert.equal(reference.responseFor(2009, 4, "", undefined, "maa-national"), null);
assert.equal(reference.responseFor(2009, 9, "", undefined, "maa-national"), null);
assert.equal(reference.responseFor(2009, 12, "", undefined, "maa-national"), null);
assert.equal(reference.responseFor(2009, 17, "", undefined, "maa-national"), null);
assert.equal(reference.responseFor(2009, 3, "", undefined, "unknown-population").respondentCount, 741);
assert.equal(reference.responseFor(2009, 3, "A").respondentCount, 741);
assert.deepEqual(reference.responseFor(2009, 12, "A").acceptedAnswers, ["D", "E"]);
assert.equal(reference.responseFor(2009, 12, "A").correctResponsePercent, 65.18);
assert.equal(reference.responseFor(2009, 12, "").mostCommonDistractor.answer, "B");
assert.equal(reference.responseFor(2011, 4, "A").correctAnswer, "C");
assert.equal(reference.responseFor(2011, 4, "A").respondentCount, 899);
assert.equal(reference.responseFor(2011, 4, "A").correctResponsePercent, 59.96);
for (const year of [2009, 2010, 2011, 2012, 2013, 2014, 2015]) {
  for (const item of reference.questionsByYear[year]) {
    const total = Object.values(item.responsePercent).reduce((sum, value) => sum + value, item.omittedPercent + item.unreadablePercent);
    if (year === 2013 && item.number === 20) continue;
    assert.ok(Math.abs(total - 100) < 0.15, `${year} question ${item.number} response percentages sum to ${total}`);
    assert.ok(item.acceptedAnswers.every((answer) => Object.hasOwn(item.responsePercent, answer)));
    const expected = item.acceptedAnswers.reduce((sum, answer) => sum + item.responsePercent[answer], 0);
    assert.equal(item.correctResponsePercent, Number(expected.toFixed(2)));
  }
}
