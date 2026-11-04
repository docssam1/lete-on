(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC10_12ItemResponseReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const letters = Object.freeze(["A", "B", "C", "D", "E"]);
  const defaultSourceUrl = "https://web.archive.org/web/20210121212429id_/https://www.99cef.org.tw/userfiles/2020AMC10A12AReport.pdf";
  const sources = Object.freeze({
    "amc10-2014-B": Object.freeze({ raw: `
1,C,1.11,2.40,82.05,1.69,7.93,4.79,0.01
2,E,5.33,1.35,12.19,1.53,72.73,6.85,0.02
3,E,1.98,2.98,5.86,3.94,75.87,9.37,0.01
4,B,3.43,75.53,2.96,2.48,4.12,11.47,0.01
5,A,64.16,4.19,3.76,7.75,3.48,16.62,0.03
6,C,3.73,4.99,60.80,5.18,12.24,13.02,0.04
7,A,56.17,3.40,2.24,13.47,12.46,12.22,0.03
8,E,5.93,3.84,15.54,3.95,51.68,19.02,0.03
9,A,49.84,4.86,13.85,2.60,13.71,15.09,0.04
10,C,10.02,11.13,34.50,11.48,10.44,22.39,0.03
11,C,5.66,7.61,42.24,23.96,3.37,17.14,0.02
12,C,15.06,13.85,32.66,15.10,3.09,20.22,0.02
13,B,4.84,54.48,4.55,4.10,4.43,27.58,0.02
14,D,6.54,10.12,4.74,36.01,3.45,39.10,0.03
15,A,43.16,4.11,5.65,6.57,3.05,37.45,0.02
16,B,25.79,17.71,9.66,9.17,7.13,30.51,0.02
17,D,24.11,5.48,12.10,12.47,4.88,40.92,0.04
18,E,8.07,6.37,6.78,24.61,12.63,41.50,0.02
19,D,4.21,11.31,8.61,18.93,8.77,48.13,0.03
20,C,13.31,6.11,29.84,9.81,3.08,37.82,0.02
21,B,5.43,16.79,7.01,6.81,3.00,60.94,0.03
22,B,6.69,28.62,5.92,3.67,2.05,53.01,0.03
23,E,4.31,6.91,4.66,6.21,10.79,67.09,0.03
24,B,2.93,6.50,9.46,9.04,5.45,66.59,0.03
25,C,3.73,6.01,7.88,5.19,8.88,68.28,0.02`.trim(), respondentCount: 41682, population: "2014 AMC 10B global response cohort; report p.4 score-distribution total", sourceUrl: "https://www.gemt.org.tw/wp-content/uploads/2013/10/2014AMC10B12B%E5%88%86%E6%9E%90%E5%A0%B1%E5%91%8A0415.pdf", sourceStatus: "GEMT 2014 analysis report; printed p.8 global item-response table recovered from indexed PDF text; correct answers cross-checked with LIVE" }),
    "amc10-2020-A": Object.freeze({ raw: `
1,E,0.89,0.19,0.96,1.92,95.30,0.72,0.02
2,C,1.85,6.12,80.72,2.71,4.62,3.95,0.04
3,A,68.86,12.19,2.22,2.20,1.68,12.79,0.06
4,E,1.93,5.18,2.62,1.44,82.03,6.73,0.06
5,C,24.24,2.25,52.59,2.43,1.30,17.15,0.04
6,B,8.00,49.09,8.47,10.96,7.63,15.79,0.06
7,C,13.73,12.42,32.61,5.08,2.01,34.07,0.08
8,B,8.56,37.24,5.99,6.83,4.22,37.09,0.07
9,B,3.00,60.90,2.26,3.24,13.90,16.66,0.05
10,B,5.53,43.57,6.51,5.80,11.47,27.01,0.09
11,C,3.39,7.45,24.77,6.33,3.67,54.34,0.06
12,C,3.11,7.05,28.64,8.92,6.08,46.11,0.09
13,B,22.68,16.96,6.28,7.68,2.17,44.15,0.07
14,D,4.79,3.84,8.56,15.57,2.89,64.27,0.07
15,E,3.05,9.61,7.51,9.21,17.40,53.15,0.07
16,B,8.98,14.33,10.52,4.65,3.71,57.74,0.07
17,E,3.44,5.82,7.01,8.98,9.50,65.21,0.04
18,C,5.66,9.00,13.38,7.40,2.53,62.00,0.04
19,E,5.83,7.81,6.28,7.77,5.57,66.67,0.08
20,D,3.96,5.06,5.68,9.82,2.82,72.59,0.07
21,C,3.13,5.30,6.78,7.00,2.34,75.37,0.07
22,A,3.89,4.98,6.27,4.08,2.99,77.75,0.04
23,A,6.53,5.50,5.60,3.97,3.36,75.00,0.04
24,C,5.38,6.19,6.77,4.57,2.47,74.58,0.04
25,A,7.05,5.92,6.67,6.08,4.57,69.65,0.06`.trim(), respondentCount: 36010, population: "2020 AMC 10A United States and Canada response cohort" }),
    "amc12-2020-A": Object.freeze({ raw: `
1,C,13.17,0.66,84.92,0.55,0.26,0.40,0.03
2,C,5.75,1.83,89.47,0.53,0.54,1.86,0.01
3,E,1.54,4.28,1.65,1.04,86.54,4.89,0.04
4,B,8.22,53.38,7.64,10.56,5.92,14.21,0.05
5,C,12.53,12.31,34.80,4.46,1.86,33.97,0.06
6,D,3.78,20.16,6.80,59.16,1.43,8.63,0.04
7,B,5.17,54.84,5.61,4.88,10.07,19.37,0.05
8,C,3.21,7.62,29.69,5.71,3.63,50.09,0.05
9,E,12.83,16.34,7.66,12.28,14.41,36.43,0.05
10,E,6.07,5.68,8.65,3.61,31.25,44.69,0.05
11,B,22.19,20.03,6.59,6.81,1.97,42.35,0.05
12,B,7.27,23.51,8.56,5.68,3.70,51.24,0.04
13,B,3.13,26.89,6.46,5.41,4.47,53.58,0.06
14,B,5.87,18.47,4.95,8.41,5.90,56.35,0.04
15,D,3.70,13.31,3.48,12.10,4.29,63.07,0.05
16,B,8.56,17.56,9.30,3.88,3.22,57.43,0.04
17,D,2.99,5.14,4.30,7.30,2.22,78.02,0.03
18,D,3.47,4.98,5.62,9.22,2.54,74.14,0.03
19,C,2.82,5.37,7.93,8.10,1.82,73.93,0.02
20,A,6.99,4.90,4.99,3.57,2.50,77.04,0.01
21,D,3.72,5.91,4.66,5.39,1.51,78.76,0.05
22,B,2.38,4.19,3.02,3.78,3.94,82.62,0.07
23,A,6.14,5.17,5.66,5.35,3.42,74.21,0.04
24,B,5.26,5.89,3.68,3.67,5.10,76.37,0.03
25,C,1.95,2.94,4.20,4.40,2.40,84.09,0.01`.trim(), respondentCount: 27416, population: "2020 AMC 12A United States and Canada response cohort" })
  });
  function responseFor(program, year, form, question, answer) {
    const selectedProgram = String(program || "").toLowerCase();
    const selectedYear = Number(year);
    const selectedForm = String(form || "").toUpperCase();
    const source = sources[selectedProgram + "-" + selectedYear + "-" + selectedForm];
    if (!source || !Number.isInteger(Number(question)) || Number(question) < 1 || Number(question) > 25) return null;
    const values = source.raw.split("\n")[Number(question) - 1].split(",");
    const responsePercent = Object.freeze(Object.fromEntries(letters.map(function (letter, index) { return [letter, Number(values[index + 2])]; })));
    const correctAnswer = values[1];
    const choice = answer == null || answer === "" ? "" : String(answer).toUpperCase();
    if (choice && !letters.includes(choice)) return null;
    const distractor = letters.filter(function (letter) { return letter !== correctAnswer; }).map(function (letter) { return { answer: letter, percent: responsePercent[letter] }; }).sort(function (a, b) { return b.percent - a.percent; })[0];
    return Object.freeze({ program: selectedProgram, year: selectedYear, form: selectedForm, question: Number(question), answer: choice, correctAnswer: correctAnswer, acceptedAnswers: Object.freeze([correctAnswer]), responsePercent: responsePercent, omittedPercent: Number(values[7]), unreadablePercent: Number(values[8]), selectedResponsePercent: choice ? responsePercent[choice] : null, correctResponsePercent: responsePercent[correctAnswer], mostCommonDistractor: Object.freeze(distractor), respondentCount: source.respondentCount, population: source.population, sourceStatus: source.sourceStatus || "99CEF 2020 analysis report; printed US/Canada item-response table; correct answers checked against LIVE answer key", sourceUrl: source.sourceUrl || defaultSourceUrl });
  }
  return Object.freeze({ sources: sources, responseFor: responseFor });
});
