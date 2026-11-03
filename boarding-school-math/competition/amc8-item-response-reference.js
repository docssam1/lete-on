(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8ItemResponseReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // The 2010 MAA item-response table was published as a scan. Percentages below were
  // read with Apple Vision and checked against the source image. The source's red
  // tutoring-center prediction marks are intentionally excluded.
  const raw = `
1,C,1.13,2.85,94.41,0.98,0.33,0.29,0.01
2,D,4.53,1.85,2.21,70.34,20.12,0.89,0.05
3,C,7.37,20.97,64.41,4.22,1.27,1.73,0.03
4,C,7.60,12.70,58.75,12.15,7.55,1.21,0.04
5,B,6.88,68.05,9.46,6.29,7.89,1.36,0.07
6,E,5.99,6.01,4.29,8.67,73.80,1.04,0.20
7,B,33.51,32.15,12.33,7.72,12.35,1.87,0.08
8,D,22.16,24.07,20.95,23.37,5.72,3.68,0.05
9,D,15.63,9.13,27.63,40.32,5.60,1.63,0.06
10,B,19.03,27.51,19.12,17.77,13.25,3.27,0.05
11,B,16.58,60.65,7.27,8.93,4.58,1.93,0.06
12,D,42.93,13.36,10.19,24.91,6.56,1.96,0.10
13,E,9.47,12.36,27.41,19.85,25.80,4.95,0.15
14,C,10.16,11.94,39.15,19.67,14.50,4.49,0.09
15,C,25.97,16.39,37.61,10.24,5.04,4.68,0.07
16,B,34.16,19.95,11.24,16.25,12.57,5.75,0.07
17,D,11.68,29.99,22.16,18.77,10.00,7.27,0.13
18,C,10.18,17.14,37.44,15.62,13.16,6.32,0.14
19,C,22.35,18.06,33.96,11.48,5.75,8.30,0.11
20,A,31.96,15.82,23.23,13.20,8.54,7.13,0.12
21,C,8.30,18.03,35.42,16.70,11.70,9.73,0.13
22,E,10.46,19.85,18.94,18.92,21.16,10.45,0.22
23,B,14.54,22.78,22.27,17.60,10.95,11.70,0.17
24,A,17.19,23.28,17.40,20.80,11.06,10.11,0.15
25,E,14.98,30.79,12.44,11.57,18.41,11.71,0.10`.trim();
  const letters = Object.freeze(["A", "B", "C", "D", "E"]);
  const questions = Object.freeze(raw.split("\n").map(function (line) {
    const values = line.split(",");
    const percentages = Object.freeze(Object.fromEntries(letters.map(function (letter, index) {
      return [letter, Number(values[index + 2])];
    })));
    return Object.freeze({
      number: Number(values[0]),
      correctAnswer: values[1],
      responsePercent: percentages,
      omittedPercent: Number(values[7]),
      unreadablePercent: Number(values[8]),
      correctResponsePercent: percentages[values[1]],
      respondentCount: 153211
    });
  }));
  const sourceUrl = "https://www.amcstudy.net/71";

  function responseFor(year, question, answer) {
    if (Number(year) !== 2010 || !Number.isInteger(Number(question)) || Number(question) < 1 || Number(question) > questions.length) return null;
    const item = questions[Number(question) - 1];
    const choice = answer == null || answer === "" ? "" : String(answer).toUpperCase();
    if (choice && !letters.includes(choice)) return null;
    const mostCommonDistractor = letters.filter(function (letter) { return letter !== item.correctAnswer; })
      .map(function (letter) { return { answer: letter, percent: item.responsePercent[letter] }; })
      .sort(function (a, b) { return b.percent - a.percent; })[0];
    return Object.freeze({
      year: 2010,
      question: item.number,
      answer: choice,
      correctAnswer: item.correctAnswer,
      selectedResponsePercent: choice ? item.responsePercent[choice] : null,
      correctResponsePercent: item.correctResponsePercent,
      mostCommonDistractor: mostCommonDistractor,
      respondentCount: item.respondentCount,
      population: "2010 AMC 8 responses tabulated in the source (153,211 students)",
      sourceStatus: "secondary-image-transcription-apple-vision-reviewed",
      sourceUrl: sourceUrl
    });
  }

  return Object.freeze({ questions: questions, sourceUrl: sourceUrl, responseFor: responseFor });
});
