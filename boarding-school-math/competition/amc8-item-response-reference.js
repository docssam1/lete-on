(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GFIELDAMC8ItemResponseReference = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";

  // 2010 was transcribed from an MAA table scan using Apple Vision and checked against
  // the image. 2009 and 2011 are HTML tables in AMC Study's republication of MAA reports.
  // The 2009 response table marks D and E correct for item 12, while LIVE's key lists D.
  // Preserve the MAA table's accepted response rates without replacing the official key.
  // AMC Study's own red prediction marks are intentionally excluded.
  const raw2010 = `
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
  const raw2009 = `
1,E,0.00,0.00,1.89,1.35,96.76,0.00,0.00
2,D,2.02,1.89,3.51,90.42,1.89,0.27,0.00
3,C,7.42,1.21,90.28,0.40,0.67,0.00,0.00
4,B,1.75,88.39,1.62,4.72,3.10,0.27,0.13
5,D,2.97,4.86,12.42,73.55,3.37,2.83,0.00
6,A,91.09,2.83,1.48,2.02,1.89,0.54,0.13
7,C,1.21,3.91,66.40,9.45,15.92,2.83,0.27
8,B,9.31,63.02,15.92,5.67,5.13,0.81,0.13
9,B,9.99,50.88,13.50,13.23,8.37,3.78,0.27
10,D,2.56,18.49,11.07,62.89,4.05,0.94,0.00
11,D,5.53,10.93,17.95,40.76,17.14,7.56,0.13
12,DE,9.99,19.43,3.91,61.13,4.05,1.48,0.00
13,B,4.86,85.56,2.56,3.78,2.29,0.94,0.00
14,B,3.91,31.71,50.88,6.61,3.51,3.24,0.13
15,D,9.99,7.83,11.61,53.44,11.20,5.67,0.27
16,D,21.46,11.74,15.92,30.23,17.54,3.10,0.00
17,B,11.20,36.30,20.78,13.77,10.26,7.56,0.13
18,C,9.45,7.83,62.62,8.37,7.56,4.18,0.00
19,D,11.34,11.61,10.53,42.51,20.24,3.78,0.00
20,D,17.81,24.83,14.30,28.48,10.80,3.78,0.00
21,D,11.34,38.60,17.68,19.43,5.40,7.56,0.00
22,D,9.58,13.50,16.46,41.43,12.15,6.61,0.27
23,B,9.58,39.68,14.98,19.16,9.31,7.29,0.00
24,E,10.66,9.58,18.35,11.88,41.43,8.10,0.00
25,E,9.99,13.90,21.86,18.22,26.05,9.99,0.00`.trim();
  const raw2011 = `
1,E,1.45,0.56,0.89,1.11,95.66,0.33,0.00
2,E,2.67,0.78,5.90,1.56,88.88,0.22,0.00
3,D,32.70,3.45,2.78,59.18,1.22,0.67,0.00
4,C,14.57,9.57,59.96,8.90,6.34,0.56,0.11
5,D,3.89,4.45,7.45,79.76,3.56,0.78,0.11
6,D,6.34,27.81,4.78,59.62,0.67,0.78,0.00
7,C,9.79,9.68,66.63,7.90,3.45,2.34,0.22
8,B,5.78,39.60,10.23,4.23,39.04,1.11,0.00
9,E,4.45,6.67,5.56,8.45,73.86,1.00,0.00
10,C,5.78,8.68,67.19,9.12,6.45,2.67,0.11
11,A,70.63,6.12,2.34,13.13,6.79,1.00,0.00
12,B,26.47,43.60,18.69,7.01,3.34,0.89,0.00
13,C,11.90,10.57,60.18,5.12,10.12,2.11,0.00
14,C,4.12,8.57,63.74,14.13,8.34,1.11,0.00
15,D,6.23,8.68,16.69,40.38,26.03,2.00,0.00
16,C,10.68,38.60,24.81,16.69,6.12,3.11,0.00
17,A,38.26,8.68,16.57,19.02,13.46,3.78,0.22
18,D,14.35,18.24,10.46,47.16,7.68,2.11,0.00
19,D,22.80,19.24,28.92,21.13,5.78,1.78,0.33
20,D,6.79,12.12,14.24,51.06,9.57,6.23,0.00
21,C,4.34,10.79,52.84,18.58,9.68,3.78,0.00
22,D,14.57,13.13,21.58,30.92,14.46,5.12,0.22
23,D,13.57,21.25,23.03,19.69,16.24,6.23,0.00
24,A,29.81,16.91,16.69,22.02,8.34,6.23,0.00
25,A,40.04,12.90,17.69,13.90,9.79,5.67,0.00`.trim();
  const sources = Object.freeze({
    2009: Object.freeze({ raw: raw2009, respondentCount: 741, population: "2009 AMC 8 South Korea reported participant cohort", sourceUrl: "https://www.amcstudy.net/43", sourceStatus: "secondary-html-transcription-of-MAA-result-table" }),
    2010: Object.freeze({ raw: raw2010, respondentCount: 153211, population: "2010 AMC 8 MAA-reported student response cohort", sourceUrl: "https://www.amcstudy.net/71", sourceStatus: "secondary-image-transcription-apple-vision-reviewed" }),
    2011: Object.freeze({ raw: raw2011, respondentCount: 899, population: "2011 AMC 8 South Korea reported participant cohort", sourceUrl: "https://www.amcstudy.net/79", sourceStatus: "secondary-html-transcription-of-MAA-result-table" })
  });
  function parseQuestions(raw, respondentCount) {
    return Object.freeze(raw.split("\n").map(function (line) {
      const values = line.split(",");
      const percentages = Object.freeze(Object.fromEntries(letters.map(function (letter, index) {
        return [letter, Number(values[index + 2])];
      })));
      const acceptedAnswers = Object.freeze(values[1].split(""));
      return Object.freeze({
        number: Number(values[0]),
        correctAnswer: acceptedAnswers[0],
        acceptedAnswers: acceptedAnswers,
        responsePercent: percentages,
        omittedPercent: Number(values[7]),
        unreadablePercent: Number(values[8]),
        correctResponsePercent: acceptedAnswers.reduce(function (sum, answer) { return sum + percentages[answer]; }, 0),
        respondentCount: respondentCount
      });
    }));
  }
  const questionsByYear = Object.freeze(Object.fromEntries(Object.entries(sources).map(function (entry) {
    return [entry[0], parseQuestions(entry[1].raw, entry[1].respondentCount)];
  })));

  function responseFor(year, question, answer) {
    const selectedYear = Number(year);
    const source = sources[selectedYear];
    const questions = questionsByYear[selectedYear];
    if (!source || !Number.isInteger(Number(question)) || Number(question) < 1 || Number(question) > questions.length) return null;
    const item = questions[Number(question) - 1];
    const choice = answer == null || answer === "" ? "" : String(answer).toUpperCase();
    if (choice && !letters.includes(choice)) return null;
    const mostCommonDistractor = letters.filter(function (letter) { return !item.acceptedAnswers.includes(letter); })
      .map(function (letter) { return { answer: letter, percent: item.responsePercent[letter] }; })
      .sort(function (a, b) { return b.percent - a.percent; })[0];
    return Object.freeze({
      year: selectedYear,
      question: item.number,
      answer: choice,
      correctAnswer: item.correctAnswer,
      acceptedAnswers: item.acceptedAnswers,
      selectedResponsePercent: choice ? item.responsePercent[choice] : null,
      correctResponsePercent: item.correctResponsePercent,
      mostCommonDistractor: mostCommonDistractor,
      respondentCount: item.respondentCount,
      population: source.population,
      sourceStatus: source.sourceStatus,
      sourceUrl: source.sourceUrl
    });
  }

  return Object.freeze({ questionsByYear: questionsByYear, responseFor: responseFor });
});
