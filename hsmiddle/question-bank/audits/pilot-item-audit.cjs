#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const bankRoot = path.resolve(__dirname, "..");
const schema = require("../data/schema.js");
const pageIndex = require("../data/source-page-index.js");
const itemIndex = require("../data/item-index.js");
const issues = [];

const EXPECTED_COUNTS = new Map([[1, 10], [2, 8], [3, 10], [4, 15], [5, 10], [6, 4], [7, 10], [8, 6], [9, 10], [10, 10], [11, 5], [12, 5], [13, 10], [14, 10], [15, 11], [16, 5], [17, 6], [18, 10], [19, 7], [20, 5], [21, 3], [22, 2], [23, 10], [24, 6], [25, 4], [26, 5], [27, 4], [28, 15], [29, 7], [30, 13], [31, 2], [32, 15], [33, 12], [34, 5], [35, 5], [36, 6], [37, 2], [38, 6], [39, 7], [40, 6]]);
const SOURCE_BUNDLE_CONFLICT_NUMBERS = new Set();
const RELEASE_LOCKED_NUMBERS = new Set();
const RELEASE_ELIGIBLE_NUMBERS = new Set([...EXPECTED_COUNTS.keys()].filter(number => !RELEASE_LOCKED_NUMBERS.has(number)));
function hasEvidenceConflict(number, itemNumber) {
  return (number === 25 && itemNumber === 3) || (number === 39 && itemNumber === 4);
}
const EXPECTED_ANSWERS = new Map([
  ["1:1", { value: "팔천사백오십육만 구천구백칠십칠", unit: null }],
  ["1:2", { value: "6871203", unit: null }],
  ["1:3", { value: "56041237", unit: null }],
  ["1:4", { value: "10431008", unit: null }],
  ["1:5", { value: "394762581", unit: null }],
  ["1:6", { values: ["3439998", "3439999", "3440000"], unit: null }],
  ["1:7", { value: "오백칠십사만 구천구백육십육", unit: null }],
  ["1:8", { value: "5", unit: "개" }],
  ["1:9", { value: "9846123", unit: null }],
  ["1:10", { rubricResult: { value: "9", unit: "개" } }],
  ["2:1", { value: "9", unit: null }],
  ["2:2", { value: "1777776888889", unit: null }],
  ["2:3", { value: "㉡", unit: null }],
  ["2:4", { rubricResult: { value: "17777688889", unit: null } }],
  ["2:5", { value: "11111", unit: null }],
  ["2:6", { value: "777776222223", unit: null }],
  ["2:7", { value: "999999", unit: null }],
  ["2:8", { rubricResult: { value: "9", unit: null } }],
  ["3:1", { value: "83", unit: "타" }],
  ["3:2", { value: "21", unit: "개" }],
  ["3:3", { value: "24", unit: "개" }],
  ["3:4", { value: "5시 58분", unit: null }],
  ["3:5", { value: "오후 6시 23분", unit: null }],
  ["3:6", { value: "45", unit: "개" }],
  ["3:7", { value: "20", unit: "개" }],
  ["3:8", { value: "10", unit: "개" }],
  ["3:9", { value: "81", unit: "분" }],
  ["3:10", { value: "38", unit: "분" }],
  ["4:1", { orderedValues: ["699", "23", "30", "9"], unit: null }],
  ["4:2", { value: "2", unit: "개" }],
  ["4:3", { value: "23", unit: null }],
  ["4:4", { values: ["724", "725", "729", "742", "745"], unit: null }],
  ["4:5", { value: "28", unit: null }],
  ["4:6", { value: "16", unit: null }],
  ["4:7", { value: "18", unit: "개" }],
  ["4:8", { value: "16", unit: "개" }],
  ["4:9", { value: "3", unit: "개" }],
  ["4:10", { values: ["742", "812", "882", "952"], unit: null }],
  ["4:11", { orderedValues: ["966", "102"], unit: null }],
  ["4:12", { value: "519", unit: null }],
  ["4:13", { values: ["309", "318"], unit: null }],
  ["4:14", { value: "3", unit: "개" }],
  ["4:15", { value: "6", unit: "개" }],
  ["5:1", { orderedValues: ["25", "20"], unit: "도" }],
  ["5:2", { value: "20", unit: "도" }],
  ["5:3", { value: "22", unit: "도" }],
  ["5:4", { value: "30", unit: "도" }],
  ["5:5", { value: "50", unit: "도" }],
  ["5:6", { value: "50", unit: "도" }],
  ["5:7", { value: "55", unit: "도" }],
  ["5:8", { value: "60", unit: "도" }],
  ["5:9", { value: "70", unit: "도" }],
  ["5:10", { value: "30", unit: "도" }],
  ["6:1", { value: "90", unit: "쌍" }],
  ["6:2", { value: "2", unit: "쌍" }],
  ["6:3", { value: "12", unit: "쌍" }],
  ["6:4", { value: "2", unit: "쌍" }],
  ["7:1", { value: "오후 1시 8분", unit: null }],
  ["7:2", { value: "11시 42분 30초", unit: null }],
  ["7:3", { value: "1시간 26분", unit: null }],
  ["7:4", { value: "6", unit: "일" }],
  ["7:5", { value: "6시 38분", unit: null }],
  ["7:6", { value: "오전 11시 30분", unit: null }],
  ["7:7", { value: "1시 15분", unit: null }],
  ["7:8", { value: "오전 10시 42분 30초", unit: null }],
  ["7:9", { value: "8시 24분", unit: null }],
  ["7:10", { mixed: ["9", "16", "21"], unit: "분" }],
  ["8:1", { value: "1.16", unit: "m" }],
  ["8:2", { value: "1.61", unit: "m" }],
  ["8:3", { value: "70.03", unit: "km" }],
  ["8:4", { value: "98.35", unit: "km" }],
  ["8:5", { value: "0.12", unit: "m" }],
  ["8:6", { value: "104.63", unit: "km" }],
  ["9:1", { value: "0.435", unit: "km" }],
  ["9:2", { value: "1.685", unit: "km" }],
  ["9:3", { value: "412.5", unit: "km" }],
  ["9:4", { value: "13", unit: "L" }],
  ["9:5", { value: "18", unit: "km" }],
  ["9:6", { value: "159", unit: "m" }],
  ["9:7", { value: "9", unit: "시간" }],
  ["9:8", { value: "0.825", unit: "km" }],
  ["9:9", { value: "9.792", unit: "km" }],
  ["9:10", { value: "0.84", unit: "km" }],
  ["10:1", { value: "30", unit: "도" }],
  ["10:2", { value: "55", unit: "도" }],
  ["10:3", { value: "80", unit: "도" }],
  ["10:4", { value: "35", unit: "도" }],
  ["10:5", { value: "120", unit: "도" }],
  ["10:6", { value: "35", unit: "도" }],
  ["10:7", { value: "85", unit: "도" }],
  ["10:8", { value: "20", unit: "도" }],
  ["10:9", { value: "30", unit: "도" }],
  ["10:10", { value: "30", unit: "도" }],
  ["11:1", { value: "1080", unit: "도" }],
  ["11:2", { value: "20", unit: "도" }],
  ["11:3", { value: "20", unit: "도" }],
  ["11:4", { value: "15", unit: "도" }],
  ["11:5", { value: "20", unit: "도" }],
  ["12:1", { value: "144", unit: "명" }],
  ["12:2", { value: "84", unit: "개" }],
  ["12:3", { value: "128", unit: "명" }],
  ["12:4", { value: "42", unit: "명" }],
  ["12:5", { value: "78", unit: "개" }],
  ["13:1", { value: "654", unit: null }],
  ["13:2", { value: "13", unit: "개" }],
  ["13:3", { value: "5", unit: "개" }],
  ["13:4", { values: ["516", "612"], unit: null }],
  ["13:5", { value: "873", unit: null }],
  ["13:6", { value: "864", unit: null }],
  ["13:7", { value: "664", unit: null }],
  ["13:8", { value: "9516", unit: null }],
  ["13:9", { value: "1824", unit: null }],
  ["13:10", { value: "16", unit: "개" }],
  ["14:1", { value: "146", unit: "개" }],
  ["14:2", { orderedValues: ["4", "8", "12", "16", "20"], unit: "개" }],
  ["14:3", { orderedValues: ["4", "5", "6", "7", "8"], unit: "개" }],
  ["14:4", { value: "55", unit: "개" }],
  ["14:5", { rubricResult: { value: "3개씩 늘어나는 관계가 있습니다.", unit: null } }],
  ["14:6", { orderedValues: ["4", "6", "8", "10", "12"], unit: "개" }],
  ["14:7", { orderedValues: ["6", "7", "8", "9", "10"], unit: "개" }],
  ["14:8", { orderedValues: ["노란색", "249개"], unit: null }],
  ["14:9", { orderedValues: ["2", "4", "6", "8", "10"], unit: "개" }],
  ["14:10", { orderedValues: ["3", "6", "9", "12", "15"], unit: "개" }],
  ["15:1", { rubricResult: { value: "△=◇×11", unit: null } }],
  ["15:2", { rubricResult: { value: "△=◇×7+2", unit: null } }],
  ["15:3", { rubricResult: { value: "☆=♡×5-4", unit: null } }],
  ["15:4", { rubricResult: { value: "☆=◇÷2", unit: null } }],
  ["15:5", { rubricResult: { value: "●=(■+2)×(■+2)", unit: null } }],
  ["15:6", { rubricResult: { value: "●=(◆-2)÷2", unit: null } }],
  ["15:7", { rubricResult: { value: "☆=◇÷11+1", unit: null } }],
  ["15:8", { rubricResult: { value: "■=(♣-1)×(♣-1)", unit: null } }],
  ["15:9", { rubricResult: { value: "△=□+65", unit: null } }],
  ["15:10", { rubricResult: { value: "◇=♡×5-3", unit: null } }],
  ["15:11", { rubricResult: { value: "△=○÷19", unit: null } }],
  ["16:1", { orderedValues: ["7", "5", "2"], unit: null }],
  ["16:2", { orderedValues: ["1", "2", "8", "9", "3", "6", "4"], unit: null }],
  ["16:3", { orderedValues: ["4", "5", "1", "6", "2"], unit: null }],
  ["16:4", { orderedValues: ["4", "3"], unit: null }],
  ["16:5", { orderedValues: ["2", "1", "3", "4"], unit: null }],
  ["17:1", { value: "89460", unit: null }],
  ["17:2", { value: "99030", unit: null }],
  ["17:3", { value: "99756", unit: null }],
  ["17:4", { values: ["6120", "6624", "6228"], unit: null }],
  ["17:5", { value: "6", unit: "개" }],
  ["17:6", { values: ["8820", "8325"], unit: null }],
  ["18:1", { value: "6", unit: "바퀴" }],
  ["18:2", { value: "7", unit: "바퀴" }],
  ["18:3", { value: "3", unit: "바퀴" }],
  ["18:4", { value: "5", unit: "바퀴" }],
  ["18:5", { value: "6", unit: "바퀴" }],
  ["18:6", { orderedValues: ["3", "2"], unit: "바퀴" }],
  ["18:7", { value: "7", unit: "번" }],
  ["18:8", { value: "2", unit: "바퀴" }],
  ["18:9", { value: "8", unit: "바퀴" }],
  ["18:10", { value: "5분 후", unit: null }],
  ["19:1", { orderedValues: ["5", "4", "6"], unit: null }],
  ["19:2", { value: "10", unit: null }],
  ["19:3", { value: "24", unit: null }],
  ["19:4", { value: "58", unit: null }],
  ["19:5", { value: "29", unit: null }],
  ["19:6", { value: "16", unit: null }],
  ["19:7", { value: "7", unit: null }],
  ["20:1", { value: "7/15", unit: null }],
  ["20:2", { value: "16/27", unit: null }],
  ["20:3", { value: "10/21", unit: null }],
  ["20:4", { value: "㉢", unit: null }],
  ["20:5", { orderedValues: ["강릉", "부산", "목포", "대구", "부안"], unit: null }],
  ["21:1", { value: "3", unit: "개" }],
  ["21:2", { value: "3", unit: "개" }],
  ["21:3", { value: "4", unit: "개" }],
  ["22:1", { value: "1/126", unit: null }],
  ["22:2", { value: "19/512", unit: null }],
  ["23:1", { value: "3000", unit: "개" }],
  ["23:2", { value: "600", unit: "cm" }],
  ["23:3", { value: "2800", unit: "kg" }],
  ["23:4", { value: "560", unit: "cm" }],
  ["23:5", { value: "150", unit: "cm" }],
  ["23:6", { value: "7", unit: "개" }],
  ["23:7", { value: "18", unit: "m²" }],
  ["23:8", { value: "24", unit: "권" }],
  ["23:9", { value: "5/24", unit: null }],
  ["23:10", { value: "8", unit: "km" }],
  ["24:1", { mixed: ["12", "7", "36"], unit: null }],
  ["24:2", { value: "365", unit: null }],
  ["24:3", { value: "4/45", unit: null }],
  ["24:4", { value: "5/66", unit: null }],
  ["24:5", { value: "18", unit: null }],
  ["24:6", { value: "4/65", unit: null }],
  ["25:1", { value: "1400", unit: "m²" }],
  ["25:2", { value: "680", unit: "m²" }],
  ["25:3", { value: "228", unit: "m²" }],
  ["25:4", { value: "666", unit: "m²" }],
  ["26:1", { value: "27", unit: "cm²" }],
  ["26:2", { value: "22", unit: "cm²" }],
  ["26:3", { value: "16", unit: "cm²" }],
  ["26:4", { value: "30", unit: "cm²" }],
  ["26:5", { value: "24", unit: "cm²" }],
  ["27:1", { value: "오후 12시 42분", unit: null }],
  ["27:2", { value: "③", unit: null }],
  ["27:3", { value: "오전 11시 4분", unit: null }],
  ["27:4", { value: "⑤", unit: null }],
  ["28:1", { orderedValues: ["120", "15", "135"], unit: "도" }],
  ["28:2", { values: ["2", "10"], unit: "시" }],
  ["28:3", { value: "105", unit: "도" }],
  ["28:4", { value: "75", unit: "도" }],
  ["28:5", { value: "오후 2시", unit: null }],
  ["28:6", { value: "115", unit: "도" }],
  ["28:7", { value: "120", unit: "도" }],
  ["28:8", { orderedValues: ["150", "18", "168"], unit: "도" }],
  ["28:9", { value: "165", unit: "도" }],
  ["28:10", { value: "85", unit: "도" }],
  ["28:11", { value: "8시 20분", unit: null }],
  ["28:12", { value: "50", unit: "도" }],
  ["28:13", { value: "135", unit: "도" }],
  ["28:14", { value: "125", unit: "도" }],
  ["28:15", { orderedValues: ["3", "40"], unit: "시·분" }],
  ["29:1", { value: "12", unit: "분" }],
  ["29:2", { value: "25", unit: "분" }],
  ["29:3", { value: "47", unit: "분" }],
  ["29:4", { value: "㉡ 수도꼭지", unit: null }],
  ["29:5", { value: "25", unit: "분" }],
  ["29:6", { value: "107.7", unit: "L" }],
  ["29:7", { orderedValues: ["4", "30"], unit: "분·초" }],
  ["30:1", { value: "2", unit: "쌍" }],
  ["30:2", { value: "15", unit: "쌍" }],
  ["30:3", { value: "6", unit: "쌍" }],
  ["30:4", { value: "7", unit: "쌍" }],
  ["30:5", { value: "9", unit: "쌍" }],
  ["30:6", { value: "8", unit: "쌍" }],
  ["30:7", { value: "15", unit: "쌍" }],
  ["30:8", { value: "6", unit: "쌍" }],
  ["30:9", { value: "6", unit: "쌍" }],
  ["30:10", { value: "6", unit: "쌍" }],
  ["30:11", { value: "6", unit: "쌍" }],
  ["30:12", { value: "9", unit: "쌍" }],
  ["30:13", { value: "4", unit: "쌍" }],
  ["31:1", { value: "180", unit: "m" }],
  ["31:2", { value: "120", unit: "m" }],
  ["32:1", { value: "6.3", unit: null }],
  ["32:2", { value: "31.25", unit: null }],
  ["32:3", { value: "7.2", unit: null }],
  ["32:4", { value: "16", unit: "개" }],
  ["32:5", { value: "8", unit: null }],
  ["32:6", { value: "6.55", unit: null }],
  ["32:7", { value: "16", unit: null }],
  ["32:8", { value: "14.84", unit: null }],
  ["32:9", { value: "16", unit: null }],
  ["32:10", { value: "9.95", unit: null }],
  ["32:11", { value: "2.4", unit: null }],
  ["32:12", { orderedValues: ["7.08", "7.1"], unit: null }],
  ["32:13", { value: "3.5", unit: null }],
  ["32:14", { orderedValues: ["14.05", "14.1"], unit: null }],
  ["32:15", { orderedValues: ["8.83", "8.8"], unit: null }],
  ["33:1", { orderedValues: ["6", "5"], unit: null }],
  ["33:2", { value: "0.24", unit: null }],
  ["33:3", { value: "3.5", unit: null }],
  ["33:4", { orderedValues: ["2", "3.3"], unit: null }],
  ["33:5", { value: "4.8", unit: null }],
  ["33:6", { orderedValues: ["5", "0.4"], unit: null }],
  ["33:7", { value: "8.5", unit: null }],
  ["33:8", { value: "2.11", unit: null }],
  ["33:9", { value: "0.04", unit: null }],
  ["33:10", { value: "8.2", unit: null }],
  ["33:11", { value: "77.3", unit: null }],
  ["33:12", { value: "7.3", unit: null }],
  ["34:1", { value: "햇살반", unit: null }],
  ["34:2", { value: "유진", unit: null }],
  ["34:3", { value: "18", unit: "명" }],
  ["34:4", { value: "36000", unit: "원" }],
  ["34:5", { value: "20000", unit: "원" }],
  ["35:1", { value: "94.2", unit: "cm" }],
  ["35:2", { value: "251.2", unit: "cm" }],
  ["35:3", { value: "840.96", unit: "cm²" }],
  ["35:4", { value: "218.24", unit: "cm²" }],
  ["35:5", { value: "744.96", unit: "cm²" }],
  ["36:1", { orderedValues: ["10", "21"], unit: null }],
  ["36:2", { value: "80", unit: "m³" }],
  ["36:3", { value: "25", unit: "m³" }],
  ["36:4", { value: "2.6", unit: "cm" }],
  ["36:5", { value: "9", unit: null }],
  ["36:6", { value: "3.05", unit: "cm" }],
  ["37:1", { value: "20", unit: "cm" }],
  ["37:2", { value: "21", unit: "cm" }],
  ["38:1", { value: "1", unit: null }],
  ["38:2", { value: "12", unit: null }],
  ["38:3", { value: "10", unit: null }],
  ["38:4", { value: "3", unit: null }],
  ["38:5", { value: "4/5", unit: null }],
  ["38:6", { value: "15/56", unit: null }],
  ["39:1", { value: "6", unit: null }],
  ["39:2", { value: "9", unit: null }],
  ["39:3", { value: "5", unit: null }],
  ["39:4", { value: "6", unit: null }],
  ["39:5", { value: "7", unit: null }],
  ["39:6", { value: "7", unit: null }],
  ["39:7", { value: "6", unit: null }],
  ["40:1", { value: "6", unit: "개" }],
  ["40:2", { value: "16", unit: "개" }],
  ["40:3", { value: "14", unit: "개" }],
  ["40:4", { value: "12", unit: "개" }],
  ["40:5", { value: "12", unit: "개" }],
  ["40:6", { value: "20", unit: "개" }]
]);
const TYPE_DETAILS = new Map([
  [13, { name: "수 카드로 배수를 만들고 조건에 맞는 수 찾기", conceptFamilyId: "multiples-divisibility" }],
  [17, { name: "가려진 자리에 수를 넣어 여러 배수 조건 맞추기", conceptFamilyId: "multiples-divisibility" }]
]);
const Q01_ITEM_DETAILS = new Map([
  [1, "자리값과 범위를 함께 보고 가장 작은 수 읽기"],
  [2, "주어진 숫자를 한 번씩 써서 조건에 맞는 수 만들기"],
  [3, "서로 다른 숫자의 자리 조건으로 가장 작은 수 만들기"],
  [4, "보기에서 자리값과 짝수 조건을 모두 만족하는 수 찾기"],
  [5, "서로 다른 숫자의 자리 조건으로 가장 큰 수 만들기"],
  [6, "두 수 사이에 있는 모든 자연수 찾기"],
  [7, "자리 숫자와 범위 조건으로 수 읽기"],
  [8, "가장 작은 수를 만들고 0의 개수 세기"],
  [9, "주어진 숫자로 범위와 여러 자리 조건 맞추기"],
  [10, "자리 숫자 관계와 합으로 가능한 수의 개수 구하기"]
]);
const Q03_ITEM_DETAILS = new Map([
  [1, ["두 번 나누어 준 물건의 처음 수 구하기", "reverse-division-word-problems"]],
  [2, ["똑같이 나누고 남은 수로 한 묶음의 수 구하기", "reverse-division-word-problems"]],
  [3, ["나누어 만들고 남은 수로 처음 묶음 수 구하기", "reverse-division-word-problems"]],
  [4, ["몇 분 뒤의 시각 구하기", "time-calculation"]],
  [5, ["걸린 시간을 더해 끝난 시각 구하기", "time-calculation"]],
  [6, ["쉬지 않고 만드는 물건 수 구하기", "work-time-rate"]],
  [7, ["쉬는 시간을 빼고 만드는 물건 수 구하기", "work-time-rate"]],
  [8, ["일정한 시간 동안 만드는 물건 수 구하기", "work-time-rate"]],
  [9, ["같은 거리를 갈 때 느린 탈것의 시간 구하기", "distance-speed-time"]],
  [10, ["같은 거리를 갈 때 빠르기가 다른 탈것의 시간 구하기", "distance-speed-time"]]
]);
const Q04_ITEM_DETAILS = new Map([
  [1, "조건에 맞는 나눗셈식의 수 모두 쓰기"],
  [2, "수 카드로 몫과 나머지 조건에 맞는 수의 개수 구하기"],
  [3, "수 카드로 만든 가장 큰 수와 가장 작은 수를 나누어 나머지 구하기"],
  [4, "수 카드로 몫 조건에 맞고 나누어떨어지지 않는 수 모두 찾기"],
  [5, "수 카드로 만든 두 수의 나눗셈 몫 구하기"],
  [6, "자리 조건으로 만든 두 수의 나눗셈 몫 구하기"],
  [7, "몫과 나머지가 같은 세 자리 수의 개수 구하기"],
  [8, "몫과 나머지가 같은 수의 개수 구하기"],
  [9, "수 카드로 몫 조건에 맞는 수의 개수 구하기"],
  [10, "몫과 나머지 조건에 맞는 세 자리 수 모두 찾기"],
  [11, "몫과 나머지 조건에 맞는 가장 큰 수와 작은 수 찾기"],
  [12, "두 나눗셈 조건과 자리 숫자의 합에 맞는 수 찾기"],
  [13, "두 나눗셈 조건과 자리 숫자의 합에 맞는 수 모두 찾기"],
  [14, "수 카드로 몫이 정해진 수의 개수 구하기"],
  [15, "수 카드로 몫과 나머지가 생기는 수의 개수 구하기"]
]);
const Q05_ITEM_DETAILS = new Map([
  [1, "여러 삼각형과 사각형을 이용해 두 각 구하기"],
  [2, "겹친 두 삼각형의 맞꼭지각으로 돌린 각 구하기"],
  [3, "맞꼭지각과 바깥쪽 각으로 돌린 각 구하기"],
  [4, "맞꼭지각과 나뉜 각으로 돌린 각 구하기"],
  [5, "세로선 양쪽 삼각형의 같은 각으로 가운데 각 구하기"],
  [6, "이어 붙인 두 삼각형의 같은 각으로 가운데 각 구하기"],
  [7, "직각삼각형에서 나뉜 꼭짓각과 밑각의 합 구하기"],
  [8, "직각삼각형의 꼭짓각 일부로 두 표시 각의 합 구하기"],
  [9, "직각삼각형의 나뉜 각을 빼 두 표시 각의 합 구하기"],
  [10, "큰 직각삼각형과 안쪽 삼각형으로 남은 각 구하기"]
]);
const Q07_ITEM_DETAILS = new Map([
  [1, "한 시간에 빨라지는 시계의 다음 날 시각 구하기"],
  [2, "하루에 느려지는 시계의 일주일 뒤 시각 구하기"],
  [3, "느린 시계와 빠른 시계가 가리키는 시각의 차 구하기"],
  [4, "두 사람이 함께 일할 때 걸리는 날짜 구하기"],
  [5, "한 시간에 느려지는 시계의 몇 시간 뒤 시각 구하기"],
  [6, "하루에 느려지는 시계의 여러 주 뒤 시각 구하기"],
  [7, "하루에 빨라지는 시계의 여러 날 뒤 시각 구하기"],
  [8, "하루에 느려지는 시계의 일주일 뒤 시각과 초 구하기"],
  [9, "하루에 느려지는 시계의 한 달 뒤 시각 구하기"],
  [10, "빠른 두 시계가 가리키는 시각의 차를 대분수로 구하기"]
]);
const Q08_ITEM_DETAILS = new Map([
  [1, "세 사람의 앞뒤 위치로 두 거리의 차 구하기"],
  [2, "네 사람의 앞뒤 위치와 단위 바꾸기로 두 거리의 차 구하기"],
  [3, "겹쳐 나타낸 세 전체 거리로 연이은 두 구간의 차 구하기"],
  [4, "두 끝점 거리와 두 부분 거리로 가운데 구간의 차 구하기"],
  [5, "네 사람의 앞뒤 위치로 한 사람에서 두 사람까지 거리 차 구하기"],
  [6, "다섯 지점의 겹친 거리에서 안쪽 두 구간의 차 구하기"]
]);
const Q09_ITEM_DETAILS = new Map([
  [1, "같은 방향으로 달리는 두 사람 사이의 거리 구하기"],
  [2, "기차가 터널을 완전히 통과할 때 터널 길이 구하기"],
  [3, "출발·도착 시각과 빠르기로 기차 이동 거리 구하기"],
  [4, "빠르기와 시간으로 필요한 휘발유의 양 구하기"],
  [5, "같은 시간 달린 기차와 버스의 거리 차 구하기"],
  [6, "시속을 초속으로 바꾸어 몇 초 동안 간 거리 구하기"],
  [7, "주말 수와 하루 공부 시간으로 전체 공부 시간 구하기"],
  [8, "같은 시간 걸은 두 사람의 거리 차 구하기"],
  [9, "반대 방향으로 달린 두 자동차 사이의 거리 구하기"],
  [10, "같은 방향으로 달린 두 자동차 사이의 거리 구하기"]
]);
const Q10_ITEM_DETAILS = new Map([
  [1, "직각과 사각형의 네 각을 이용해 표시한 각 구하기"],
  [2, "윗선의 각과 사각형의 네 각으로 꺾인 각 구하기"],
  [3, "꺾인 점을 지나는 평행선을 그어 두 각 더하기"],
  [4, "직각과 사각형의 네 각으로 아래쪽 각 구하기"],
  [5, "한 점을 지나는 평행선을 그어 맞은편 두 각 더하기"],
  [6, "직각과 사각형의 네 각으로 남은 작은 각 구하기"],
  [7, "두 점에 평행선을 그어 세 번 꺾인 선의 각 구하기"],
  [8, "평행선의 두 각과 두 배 조건으로 나뉜 각 구하기"],
  [9, "두 주어진 각과 두 배 조건으로 남은 각 구하기"],
  [10, "수선을 긋고 20도 차 조건으로 꺾인 각 구하기"]
]);
const Q11_ITEM_DETAILS = new Map([
  [1, "평행선 사이의 여러 꺾인 각을 모두 더하기"],
  [2, "보조 평행선을 그어 식으로 표시한 각 구하기"],
  [3, "두 보조 평행선으로 네 주어진 각 사이의 각 구하기"],
  [4, "두 보조 평행선으로 가까이 붙은 각의 차 구하기"],
  [5, "여러 보조 평행선과 각의 비로 두 각의 차 구하기"]
]);
const Q12_ITEM_DETAILS = new Map([
  [1, "두 줄 세우기에서 같은 수가 남는 학생 수 찾기"],
  [2, "상자에 담는 두 방법으로 나누어떨어지는 가장 적은 수 찾기"],
  [3, "두 모둠 만들기에서 남거나 모자라는 학생 수 찾기"],
  [4, "두 줄 세우기로 나누어떨어지는 범위의 학생 수 찾기"],
  [5, "두 가지씩 나누어 줄 때 모자라는 가장 큰 두 자리 수 찾기"]
]);
const Q14_ITEM_DETAILS = new Map([
  [1, "이어 붙인 정팔각형의 수로 둘레의 변 수 구하기"],
  [2, "세로 네 개짜리 육각형 줄 배열의 순서별 조각 수 쓰기"],
  [3, "위쪽 세 칸이 고정된 T자 배열의 순서별 사각형 수 쓰기"],
  [4, "한 줄씩 늘어나는 삼각형 점 배열의 열째 점 수 구하기"],
  [5, "가로와 아래쪽이 함께 자라는 사각형 배열의 늘어나는 수 설명하기"],
  [6, "왼쪽 두 칸이 고정된 ㄴ자 배열의 순서별 사각형 수 쓰기"],
  [7, "세로 다섯 칸이 고정된 옆으로 자라는 배열의 사각형 수 쓰기"],
  [8, "색이 번갈아 나타나는 십자 타일 배열의 색과 개수 구하기"],
  [9, "두 개씩 계단처럼 이어 붙인 육각형 배열의 순서별 조각 수 쓰기"],
  [10, "세로 세 개짜리 육각형 줄 배열의 순서별 조각 수 쓰기"]
]);
const Q15_ITEM_DETAILS = new Map([
  [1, "뒤의 수가 앞의 수의 11배인 대응 관계를 식으로 나타내기"],
  [2, "앞의 수에 7을 곱하고 2를 더한 대응 관계를 식으로 나타내기"],
  [3, "나온 수가 넣은 수의 5배보다 4 작은 대응 관계를 식으로 나타내기"],
  [4, "뒤의 수가 앞의 수의 절반인 대응 관계를 식으로 나타내기"],
  [5, "앞의 수에 2를 더한 뒤 같은 수끼리 곱하는 대응 관계 나타내기"],
  [6, "앞의 수에서 2를 빼고 2로 나눈 대응 관계를 식으로 나타내기"],
  [7, "앞의 수를 11로 나누고 1을 더한 대응 관계를 식으로 나타내기"],
  [8, "앞의 수에서 1을 뺀 뒤 같은 수끼리 곱하는 대응 관계 나타내기"],
  [9, "나온 수가 넣은 수보다 65 큰 대응 관계를 식으로 나타내기"],
  [10, "나온 수가 넣은 수의 5배보다 3 작은 대응 관계를 식으로 나타내기"],
  [11, "나온 수가 넣은 수를 19로 나눈 값인 대응 관계를 식으로 나타내기"]
]);
const Q15_EQUIVALENTS = new Map([
  [1, ["△=◇×11", "◇=△÷11"]],
  [2, ["△=◇×7+2", "◇=(△-2)÷7"]],
  [3, ["☆=♡×5-4", "♡=(☆+4)÷5"]],
  [4, ["☆=◇÷2", "◇=☆×2"]],
  [5, ["●=(■+2)×(■+2)"]],
  [6, ["●=(◆-2)÷2"]],
  [7, ["☆=◇÷11+1", "◇=(☆-1)×11"]],
  [8, ["■=(♣-1)×(♣-1)"]],
  [9, ["△=□+65", "□=△-65"]],
  [10, ["◇=♡×5-3", "♡=(◇+3)÷5"]],
  [11, ["△=○÷19", "○=△×19"]]
]);
const Q16_ITEM_DETAILS = new Map([
  [1, "몫·나머지와 두 모양 숫자의 합으로 숨은 세 숫자 찾기"],
  [2, "서로 다른 일곱 글자가 있는 나눗셈에서 숨은 숫자 찾기"],
  [3, "서로 다른 다섯 글자와 합 조건이 있는 나눗셈 숫자 찾기"],
  [4, "같은 색 도형으로 만든 두 수와 나머지 조건으로 숫자 찾기"],
  [5, "네 글자의 합·크기 조건이 있는 나눗셈에서 숨은 숫자 찾기"]
]);
const Q18_ITEM_DETAILS = new Map([
  [1, "톱니 수가 주어진 두 톱니바퀴가 처음 다시 만날 때 첫째 바퀴의 회전 수 구하기"],
  [2, "두 톱니 수를 공배수로 맞추어 첫째 바퀴의 회전 수 구하기"],
  [3, "처음 맞물린 톱니가 다시 만날 때 가 톱니바퀴의 회전 수 구하기"],
  [4, "그림으로 맞물린 두 톱니바퀴가 처음 다시 만날 때 작은 바퀴의 회전 수 구하기"],
  [5, "처음 맞물린 곳에서 다시 만날 때 나 톱니바퀴의 회전 수 구하기"],
  [6, "두 톱니바퀴가 처음 다시 만날 때 각각의 회전 수 구하기"],
  [7, "크기가 다른 두 톱니바퀴가 같은 위치에서 다시 맞물릴 때 작은 바퀴의 회전 횟수 구하기"],
  [8, "같은 자리에서 다시 만날 때 가 톱니바퀴의 최소 회전 수 구하기"],
  [9, "맞물렸던 톱니가 다시 만날 때 가 톱니바퀴의 회전 수 구하기"],
  [10, "톱니바퀴가 처음 위치에서 다시 만날 때까지 걸리는 시간 구하기"]
]);
const Q19_ITEM_DETAILS = new Map([
  [1, "마주 보는 면의 수의 합이 7인 전개도의 빈칸 채우기"],
  [2, "같은 전개도로 만든 네 정육면체의 보이지 않는 뒤 면 수의 합 구하기"],
  [3, "붙인 정육면체 네 개의 보이지 않는 뒤 면 수의 합 구하기"],
  [4, "정육면체 16개의 앞면으로 뒷면 수의 합 구하기"],
  [5, "정육면체 9개의 앞면으로 뒷면 수의 합 구하기"],
  [6, "같은 전개도로 만든 세 정육면체의 뒤 면 수의 합 구하기"],
  [7, "주사위 전개도에서 두 면에 함께 수직인 면의 눈 수 합 구하기"]
]);
const Q20_ITEM_DETAILS = new Map([
  [1, "네 분수를 큰 수부터 늘어놓아 세 번째 분수 찾기"],
  [2, "다섯 분수를 큰 수부터 늘어놓아 세 번째 분수 찾기"],
  [3, "네 분수를 큰 수부터 늘어놓아 두 번째 분수 찾기"],
  [4, "음료 양의 분수 크기와 선호 조건으로 알맞은 병 찾기"],
  [5, "대분수로 나타낸 다섯 도시의 거리를 먼 곳부터 늘어놓기"]
]);
const Q21_ITEM_DETAILS = new Map([
  [1, "7/15와 같고 분모가 50~100, 분자가 20~60인 분수 개수 구하기"],
  [2, "9/16과 같고 분모가 40~100, 분자가 30~70인 분수 개수 구하기"],
  [3, "5/12와 같고 분모가 30~80, 분자가 10~40인 분수 개수 구하기"]
]);
const Q22_ITEM_DETAILS = new Map([
  [1, "분자는 2씩 분모는 3씩 늘어나는 분수의 두 항 차 구하기"],
  [2, "분자는 1씩 늘고 분모는 두 배가 되는 분수의 두 항 차 구하기"]
]);
const Q23_ITEM_DETAILS = new Map([
  [1, "닷새 동안 판 분수와 남은 사과 수로 처음 개수 구하기"],
  [2, "두 용도에 쓴 분수와 남은 끈 길이로 처음 길이 구하기"],
  [3, "닷새 동안 판 분수와 남은 쌀 무게로 처음 무게 구하기"],
  [4, "두 번 쓴 분수와 남은 끈 길이로 처음 길이 구하기"],
  [5, "두 용도로 쓴 리본 분수와 남은 길이로 처음 길이 구하기"],
  [6, "세 사람의 구슬 수와 남은 수로 동생 구슬 수 구하기"],
  [7, "두 꽃밭의 분수를 빼 꽃을 심지 않은 넓이 구하기"],
  [8, "세 종류 책의 분수와 나머지 권수로 전체 권수 구하기"],
  [9, "전체 쪽수와 날짜별 읽은 양으로 남은 부분의 분수 구하기"],
  [10, "교통수단별 이동 분수와 걸은 거리로 전체 거리 구하기"]
]);
const Q24_ITEM_DETAILS = new Map([
  [1, "세 분수 묶음에서 큰 수를 골라 덧셈과 뺄셈하기"],
  [2, "같은 수를 여러 번 곱해 만든 단위분수 합에서 두 수의 차 구하기"],
  [3, "연속한 두 수의 곱을 분모로 한 단위분수 네 개 더하기"],
  [4, "연속한 두 수의 곱을 분모로 한 단위분수 다섯 개 더하기"],
  [5, "가장 가까운 자연수 약속으로 두 분수 식 계산하기"],
  [6, "두 칸 차이 수의 곱을 분모로 한 단위분수 네 개 더하기"]
]);
const Q26_ITEM_DETAILS = new Map([
  [1, "정사각형의 나뉜 변과 바깥 꼭짓점으로 만든 삼각형 넓이 구하기"],
  [2, "사각형이 삼각형 넓이의 4배일 때 나뉜 밑변의 삼각형 넓이 구하기"],
  [3, "사각형이 삼각형 넓이의 5배일 때 색칠한 삼각형 넓이 구하기"],
  [4, "평행사변형 안에서 같은 넓이를 빼 색칠한 삼각형 넓이 구하기"],
  [5, "사각형이 삼각형 넓이의 5배이고 밑변이 6배일 때 색칠한 넓이 구하기"]
]);
const Q25_ITEM_DETAILS = new Map([
  [1, "가로와 세로에 폭 5m인 길을 내고 남은 넓이 구하기"],
  [2, "가로와 비스듬한 폭 3m인 길을 내고 남은 넓이 구하기"],
  [3, "가로 폭 3m와 비스듬한 폭 4m인 길을 내고 남은 넓이 구하기"],
  [4, "가로 폭 6m와 세로 폭 5m인 길을 내고 남은 넓이 구하기"]
]);
const Q27_ITEM_DETAILS = new Map([
  [1, "하루에 빨라지는 분과 초를 8일 동안 더해 시각 구하기"],
  [2, "하루에 느려지는 분과 초를 15일 동안 더해 알맞은 시각 고르기"],
  [3, "하루에 느려지는 분과 초를 20일 동안 더해 시각 구하기"],
  [4, "하루에 빨라지는 분과 초를 9일 동안 더해 알맞은 시각 고르기"]
]);
const Q28_ITEM_DETAILS = new Map([
  [1, "시계 눈금의 각과 반눈금, 두 각의 합 구하기"],
  [2, "긴바늘이 12일 때 작은 각이 60도인 시각 모두 찾기"],
  [3, "9시 30분 두 바늘의 작은 각 구하기"],
  [4, "3시 30분 두 바늘의 작은 각 구하기"],
  [5, "30분마다 시작하는 수업에서 60도인 시작 시각 찾기"],
  [6, "1시 50분 두 바늘의 작은 각 구하기"],
  [7, "4시 정각 두 바늘의 작은 각 구하기"],
  [8, "그림에 표시한 눈금각과 두 바늘 사이 각을 차례로 구하기"],
  [9, "11시 30분 두 바늘의 작은 각 구하기"],
  [10, "버스 이동 시간 동안 짧은바늘이 움직인 각 구하기"],
  [11, "긴바늘이 240도 움직인 뒤의 시각 구하기"],
  [12, "운동하는 동안 짧은바늘이 움직인 각 구하기"],
  [13, "계기판의 눈금 범위와 바늘 이동 값으로 움직인 각 구하기"],
  [14, "5시 50분 두 바늘의 작은 각 구하기"],
  [15, "숫자가 없는 시계의 바늘 위치와 10도로 시각 구하기"]
]);
const Q29_ITEM_DETAILS = new Map([
  [1, "욕조의 들이와 1분당 물의 양으로 채우는 시간 구하기"],
  [2, "소수인 들이와 1분당 물의 양으로 채우는 시간 구하기"],
  [3, "두 수도꼭지의 1분당 물의 양을 더해 채우는 시간 구하기"],
  [4, "서로 다른 시간에 나온 물의 양으로 1분당 양 비교하기"],
  [5, "몇 분 동안 나온 물의 양으로 1분당 양과 채우는 시간 구하기"],
  [6, "분으로 주어진 시간과 물의 양으로 1시간당 양을 반올림하기"],
  [7, "두 수도꼭지를 함께 틀어 물을 받는 시간을 분과 초로 구하기"]
]);
const Q30_ITEM_DETAILS = new Map([
  [1, "정사각형을 두 평행선으로 나누어 합동인 사각형 세기"],
  [2, "길이가 다른 격자에서 합동인 직사각형 세기"],
  [3, "평행사변형의 두 대각선으로 생긴 합동인 도형 세기"],
  [4, "부분 격자에서 여러 칸을 합친 합동인 사각형 세기"],
  [5, "대각선과 가운데 평행선으로 나눈 합동인 삼각형과 사각형 세기"],
  [6, "세 갈래와 네 높이로 나눈 이등변삼각형에서 합동인 삼각형 세기"],
  [7, "대각선을 5등분한 평행사변형에서 합동인 삼각형 세기"],
  [8, "대각선을 3등분한 평행사변형에서 합동인 삼각형 세기"],
  [9, "한 변을 5등분한 정삼각형에서 합동인 삼각형 세기"],
  [10, "세 갈래와 세 높이로 나눈 이등변삼각형에서 합동인 삼각형 세기"],
  [11, "밑변을 5등분한 이등변삼각형에서 합동인 삼각형 세기"],
  [12, "밑변을 6등분한 이등변삼각형에서 풀이를 쓰며 합동인 삼각형 세기"],
  [13, "밑변을 4등분한 이등변삼각형에서 합동인 삼각형 세기"]
]);
const Q31_ITEM_DETAILS = new Map([
  [1, "짧은 터널의 통과 시간으로 빠르기를 구해 열차 길이 찾기"],
  [2, "두 터널의 길이와 걸린 시간이 다를 때 열차 길이 찾기"]
]);
const Q32_ITEM_DETAILS = new Map([
  [1, "잘못 구한 몫이 바른 몫보다 작을 때 나누는 수 구하기"],
  [2, "자연수 부분과 소수 부분이 들어간 식에서 두 부분의 몫 구하기"],
  [3, "잘못 구한 몫이 바른 몫보다 클 때 나누는 수 구하기"],
  [4, "몫을 반올림한 값으로 소수 한 자리 어떤 수의 개수 구하기"],
  [5, "75 대신 0.75를 곱해 생긴 차로 어떤 수 구하기"],
  [6, "8.3으로 나눌 것을 곱한 결과로 바른 몫 구하기"],
  [7, "25 대신 0.25를 곱해 생긴 차로 어떤 수 구하기"],
  [8, "0.6으로 나눈 몫을 반올림한 값으로 가장 큰 소수 두 자리 수 찾기"],
  [9, "0.5 대신 5를 곱해 생긴 차로 어떤 수 구하기"],
  [10, "0.8로 나눈 몫을 반올림한 값으로 가장 큰 소수 두 자리 수 찾기"],
  [11, "7.3으로 나눌 것을 더한 결과로 반올림한 바른 몫 구하기"],
  [12, "2.4로 나눌 것을 곱한 결과로 두 가지 자리의 몫 구하기"],
  [13, "8.6으로 나눌 것을 뺀 결과로 반올림한 바른 몫 구하기"],
  [14, "3.7로 나눌 것을 곱한 결과로 두 가지 자리의 몫 구하기"],
  [15, "4.3으로 나눌 것을 곱한 결과로 두 가지 자리의 몫 구하기"]
]);
const Q33_ITEM_DETAILS = new Map([
  [1, "나누는 수가 작아졌을 때 새 몫과 자연수인 나머지 구하기"],
  [2, "몫을 소수 첫째 자리까지만 구했을 때 남는 수 찾기"],
  [3, "세 소수의 합·곱·차례로 나누기 조건으로 한 수 찾기"],
  [4, "나누는 수가 커졌을 때 새 몫과 소수인 나머지 구하기"],
  [5, "첫 몫이 11일 때 가장 큰 한 자리 소수 나머지로 새 몫 반올림하기"],
  [6, "나누는 수가 작아졌을 때 새 몫과 1보다 작은 나머지 구하기"],
  [7, "첫 몫이 31일 때 가장 큰 한 자리 소수 나머지로 새 몫 반올림하기"],
  [8, "두 수의 합과 차로 큰 수와 작은 수를 구해 몫 반올림하기"],
  [9, "나누어지는 수에 가장 작은 소수를 더해 몫이 소수 첫째 자리에서 끝나게 하기"],
  [10, "첫 몫이 17일 때 가장 큰 한 자리 소수 나머지로 새 몫 반올림하기"],
  [11, "두 소수 곱셈식에서 숨은 두 수를 구해 합하기"],
  [12, "첫 나눗셈으로 어떤 수를 구해 두 번째 나눗셈의 나머지만 찾기"]
]);
const Q34_ITEM_DETAILS = new Map([
  [1, "학급 인원수와 참여율로 실제 참여 학생이 더 많은 반 찾기"],
  [2, "시도 횟수와 성공률로 실제 성공 횟수가 더 많은 사람 찾기"],
  [3, "두 조건과 어느 쪽에도 속하지 않는 비율로 겹치는 학생 수 구하기"],
  [4, "정가를 원가보다 15% 높이고 할인했을 때 실제 이익으로 원가 구하기"],
  [5, "정가를 원가보다 30% 높이고 할인했을 때 실제 이익으로 원가 구하기"]
]);
const Q35_ITEM_DETAILS = new Map([
  [1, "지름이 다른 두 굴렁쇠가 3바퀴 굴러간 거리의 차 구하기"],
  [2, "지름이 다른 두 바퀴가 4바퀴 굴러간 거리의 차 구하기"],
  [3, "반지름을 아는 원이 정사각형 바깥 둘레를 돌 때 지나간 자리 넓이 구하기"],
  [4, "지름 4cm인 원이 9cm×12cm 직사각형 둘레를 돌 때 지나간 자리 넓이 구하기"],
  [5, "지름 8cm인 원이 24cm×10cm 직사각형 둘레를 돌 때 지나간 자리 넓이 구하기"]
]);
const Q36_ITEM_DETAILS = new Map([
  [1, "일정하게 물을 넣은 그래프에서 칸막이 높이와 모두 채우는 시간 구하기"],
  [2, "분당 20m³씩 넣은 그래프에서 직육면체 나무토막 부피 구하기"],
  [3, "분당 10m³씩 넣은 그래프에서 직육면체 나무토막 부피 구하기"],
  [4, "두 칸의 물 높이와 밑면 크기로 칸막이를 없앤 뒤 물 높이 구하기"],
  [5, "합친 물 높이와 한쪽 물 높이로 다른 쪽의 처음 물 높이 구하기"],
  [6, "크기가 다른 두 칸의 물 높이로 칸막이를 없앤 뒤 물 높이 구하기"]
]);
const Q37_ITEM_DETAILS = new Map([
  [1, "삼각기둥 옆면을 한 바퀴 감은 45° 실로 높이 구하기"],
  [2, "삼각기둥 옆면의 두 꼭짓점을 잇는 45°의 가장 짧은 선으로 높이 구하기"]
]);
const Q38_ITEM_DETAILS = new Map([
  [1, "267/32를 자연수 네 개가 있는 겹분수로 나타내 합과 차 구하기"],
  [2, "197/90을 맨 안쪽이 1/2인 겹분수로 나타내 네 자연수의 합 구하기"],
  [3, "155/48을 맨 안쪽이 1/3인 겹분수로 나타내 네 자연수의 합 구하기"],
  [4, "1에서 세 번 차례로 빼는 겹분수 계산하기"],
  [5, "2와 1/2가 이어진 세 겹 뺄셈 분수 계산하기"],
  [6, "4와 1/4가 이어진 두 겹 뺄셈 분수 계산하기"]
]);
const Q39_ITEM_DETAILS = new Map([
  [1, "0.8을 60번 곱한 수의 소수 60번째 자리 숫자 구하기"],
  [2, "0.9를 75번 곱한 수의 소수 75번째 자리 숫자 구하기"],
  [3, "0.5를 100번 곱한 수의 소수 100번째 자리 숫자 구하기"],
  [4, "0.4를 80번 곱한 수의 소수 80번째 자리 숫자 구하기"],
  [5, "0.3을 71번 곱한 수의 소수 71번째 자리 숫자 구하기"],
  [6, "0.7을 65번 곱한 수의 소수 65번째 자리 숫자 구하기"],
  [7, "0.6을 360번 곱한 수의 소수 360번째 자리 숫자 구하기"]
]);
const Q40_ITEM_DETAILS = new Map([
  [1, "0·1·6·8·9로 6119보다 작은 점대칭 네 자리 수 세기"],
  [2, "0·1·5·6·9로 9116보다 작은 점대칭 네 자리 수 세기"],
  [3, "0·1·2·5·6·8·9로 8000과 9999 사이의 점대칭 네 자리 수 세기"],
  [4, "0·1·2·6·7·9에서 쓸 수 있는 숫자를 골라 점대칭 세 자리 수 세기"],
  [5, "0·4·5·6·8·9에서 쓸 수 있는 숫자를 골라 점대칭 세 자리 수 세기"],
  [6, "0·1·3·5·6·8·9에서 쓸 수 있는 숫자를 골라 점대칭 세 자리 수 세기"]
]);
const PAGE_LAYOUTS = new Map([
  [1, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 8], [6, "solution", 9, 10]]],
  [2, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "quick-answer", 1, 8], [4, "solution", 1, 8]]],
  [3, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 10]]],
  [4, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 12], [4, "problem", 13, 15], [5, "quick-answer", 1, 15], [6, "solution", 1, 9], [7, "solution", 10, 15]]],
  [5, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 6], [6, "solution", 7, 10]]],
  [6, [[1, "problem", 1, 4], [2, "quick-answer", 1, 4], [3, "solution", 1, 4]]],
  [7, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 7], [6, "solution", 8, 10]]],
  [8, [[1, "problem", 1, 4], [2, "problem", 5, 6], [3, "quick-answer", 1, 6], [4, "solution", 1, 6]]],
  [9, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 9], [6, "solution", 10, 10]]],
  [10, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 7], [6, "solution", 8, 10]]],
  [11, [[1, "problem", 1, 4], [2, "problem", 5, 5], [3, "quick-answer", 1, 5], [4, "solution", 1, 5]]],
  [12, [[1, "problem", 1, 4], [2, "problem", 5, 5], [3, "quick-answer", 1, 5], [4, "solution", 1, 5]]],
  [13, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 8], [6, "solution", 9, 10]]],
  [14, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 10]]],
  [15, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 11], [4, "quick-answer", 1, 11], [5, "solution", 1, 8], [6, "solution", 9, 11]]],
  [16, [[1, "problem", 1, 4], [2, "problem", 5, 5], [3, "quick-answer", 1, 5], [4, "solution", 1, 5]]],
  [17, [[1, "problem", 1, 4], [2, "problem", 5, 6], [3, "quick-answer", 1, 6], [4, "solution", 1, 6]]],
  [18, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 9], [6, "solution", 10, 10]]],
  [19, [[1, "problem", 1, 4], [2, "problem", 5, 7], [3, "quick-answer", 1, 7], [4, "solution", 1, 7]]],
  [20, [[1, "problem", 1, 4], [2, "problem", 5, 5], [3, "quick-answer", 1, 5], [4, "solution", 1, 5]]],
  [21, [[1, "problem", 1, 3], [2, "quick-answer", 1, 3], [3, "solution", 1, 3]]],
  [22, [[1, "problem", 1, 2], [2, "quick-answer", 1, 2], [3, "solution", 1, 2]]],
  [23, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 10], [4, "quick-answer", 1, 10], [5, "solution", 1, 7], [6, "solution", 8, 10]]],
  [24, [[1, "problem", 1, 4], [2, "problem", 5, 6], [3, "quick-answer", 1, 6], [4, "solution", 1, 5], [5, "solution", 6, 6]]],
  [25, [[1, "problem", 1, 4], [2, "blank"], [3, "answer-solution", 1, 4], [4, "blank"]]],
  [26, [[1, "problem", 1, 4], [2, "problem", 5, 5], [3, "quick-answer", 1, 5], [4, "solution", 1, 5]]],
  [27, [[1, "problem", 1, 4], [2, "blank"], [3, "answer-solution", 1, 4], [4, "blank"]]],
  [28, [[1, "problem", 1, 5], [2, "problem", 6, 11], [3, "problem", 12, 15], [4, "blank"], [5, "answer-solution", 1, 15, { answer: [1, 15], solution: [1, 7] }], [6, "solution", 7, 15], [7, "solution", 15, 15], [8, "blank"]]],
  [29, [[1, "problem", 1, 4], [2, "problem", 5, 7], [3, "quick-answer", 1, 7], [4, "solution", 1, 7]]],
  [30, [[1, "problem", 1, 4], [2, "problem", 5, 9], [3, "problem", 10, 13], [4, "blank"], [5, "answer-solution", 1, 13, { answer: [1, 13], solution: [1, 6] }], [6, "solution", 6, 12], [7, "solution", 13, 13], [8, "blank"]]],
  [31, [[1, "problem", 1, 2], [2, "quick-answer", 1, 2], [3, "solution", 1, 2]]],
  [32, [[1, "problem", 1, 4], [2, "problem", 5, 8], [3, "problem", 9, 12], [4, "problem", 13, 15], [5, "quick-answer", 1, 15], [6, "solution", 1, 7], [7, "solution", 8, 15]]],
  [33, [[1, "problem", 1, 6], [2, "problem", 7, 12], [3, "answer-solution", 1, 12, { answer: [1, 12], solution: [1, 10] }], [4, "solution", 10, 12]]],
  [34, [[1, "problem", 1, 4], [2, "problem", 5, 5], [3, "quick-answer", 1, 5], [4, "solution", 1, 5]]],
  [35, [[1, "problem", 1, 4], [2, "problem", 5, 5], [3, "quick-answer", 1, 5], [4, "solution", 1, 5]]],
  [36, [[1, "problem", 1, 4], [2, "problem", 5, 6], [3, "quick-answer", 1, 6], [4, "solution", 1, 6]]],
  [37, [[1, "problem", 1, 2], [2, "quick-answer", 1, 2], [3, "solution", 1, 2]]],
  [38, [[1, "problem", 1, 4], [2, "problem", 5, 6], [3, "quick-answer", 1, 6], [4, "solution", 1, 5], [5, "solution", 6, 6]]],
  [39, [[1, "problem", 1, 4], [2, "problem", 5, 7], [3, "quick-answer", 1, 7], [4, "solution", 1, 7]]],
  [40, [[1, "problem", 1, 4], [2, "problem", 5, 6], [3, "quick-answer", 1, 6], [4, "solution", 1, 6]]]
]);

function check(condition, message) {
  if (!condition) issues.push(message);
}

function unique(values) {
  return new Set(values).size === values.length;
}

function assetId(number, pageNumber) {
  return `diagnostic-similar-q${String(number).padStart(2, "0")}-p${String(pageNumber).padStart(2, "0")}`;
}

function expectedAssets(number, role, itemNumber) {
  const layout = PAGE_LAYOUTS.get(number) || [];
  return layout.filter(function (candidate) {
    const roleMatches = candidate[1] === role || (candidate[1] === "answer-solution" && (role === "quick-answer" || role === "solution"));
    if (!roleMatches) return false;
    const roleRange = candidate[1] === "answer-solution" && candidate[4]
      ? candidate[4][role === "quick-answer" ? "answer" : "solution"]
      : [candidate[2], candidate[3]];
    return roleRange && itemNumber >= roleRange[0] && itemNumber <= roleRange[1];
  }).map(function (entry) { return assetId(number, entry[0]); });
}

function expectedAsset(number, role, itemNumber) {
  return expectedAssets(number, role, itemNumber)[0] || null;
}

function sameAnswer(actual, expected) {
  if (expected.rubricResult) {
    return actual && actual.result && actual.result.value === expected.rubricResult.value && actual.result.unit === expected.rubricResult.unit
      && actual.rubric && Array.isArray(actual.rubric.required) && actual.rubric.required.length >= 2;
  }
  if (expected.mixed) {
    return actual && actual.whole === expected.mixed[0] && actual.numerator === expected.mixed[1] && actual.denominator === expected.mixed[2] && actual.unit === expected.unit;
  }
  if (expected.values) {
    return actual && Array.isArray(actual.values) && actual.values.join("|") === expected.values.join("|") && actual.unit === expected.unit && actual.orderMatters === false;
  }
  if (expected.orderedValues) {
    return actual && Array.isArray(actual.values) && actual.values.join("|") === expected.orderedValues.join("|") && actual.unit === expected.unit && actual.orderMatters === true;
  }
  return actual && actual.value === expected.value && actual.unit === expected.unit;
}

function verifyPublicText() {
  const files = [
    path.join(bankRoot, "data", "schema.js"),
    path.join(bankRoot, "data", "type-registry.js"),
    path.join(bankRoot, "data", "source-page-index.js"),
    path.join(bankRoot, "data", "item-index.js"),
    __filename
  ];
  const forbidden = new RegExp([
    "[A-Za-z]:[\\\\/]",
    "\\/Users\\/",
    "student" + "Code",
    "student" + "Name",
    "students\\s*:"
  ].join("|"), "i");
  files.forEach(function (file) {
    check(!forbidden.test(fs.readFileSync(file, "utf8")), `public text has protected data: ${path.basename(file)}`);
  });
}

const items = itemIndex.items || [];
const pages = pageIndex.pages || [];
const pagesById = new Map(pages.map(function (page) { return [page.assetId, page]; }));

check(itemIndex.schemaVersion === schema.SCHEMA_VERSION, "item index schema mismatch");
check(items.length === 302, "pilot must contain 302 items");
check(unique(items.map(function (entry) { return entry.itemId; })), "duplicate item ID");
check(unique(items.map(function (entry) { return `${entry.diagnosticNumber}:${entry.itemNumber}`; })), "duplicate diagnostic item number");

EXPECTED_COUNTS.forEach(function (expectedCount, diagnosticNumber) {
  const group = items.filter(function (entry) { return entry.diagnosticNumber === diagnosticNumber; });
  check(group.length === expectedCount, `wrong item count: q${String(diagnosticNumber).padStart(2, "0")}`);
  check(unique(group.map(function (entry) { return entry.itemNumber; })), `duplicate item number: q${String(diagnosticNumber).padStart(2, "0")}`);
  for (let itemNumber = 1; itemNumber <= expectedCount; itemNumber += 1) {
    check(group.some(function (entry) { return entry.itemNumber === itemNumber; }), `missing item: q${String(diagnosticNumber).padStart(2, "0")} i${itemNumber}`);
  }
});

items.forEach(function (entry) {
  const label = `q${String(entry.diagnosticNumber).padStart(2, "0")} i${entry.itemNumber}`;
  const eligible = RELEASE_ELIGIBLE_NUMBERS.has(entry.diagnosticNumber);
  check(entry.itemId === `diagnostic-similar-q${String(entry.diagnosticNumber).padStart(2, "0")}-i${String(entry.itemNumber).padStart(2, "0")}`, `wrong item ID: ${label}`);
  check(entry.sourceExamId === "diagnostic-similar", `wrong source exam: ${label}`);
  check(entry.typeId === `diagnostic-similar-q${String(entry.diagnosticNumber).padStart(2, "0")}`, `wrong type ID: ${label}`);
  check(schema.RESPONSE_CONTRACTS.includes(entry.responseContract), `invalid response contract: ${label}`);
  check(Boolean(entry.canonicalAnswer), `missing canonical answer: ${label}`);
  check(sameAnswer(entry.canonicalAnswer, EXPECTED_ANSWERS.get(`${entry.diagnosticNumber}:${entry.itemNumber}`)), `official answer mismatch: ${label}`);
  check(Boolean(entry.structureSummary) && entry.structureSummary.length < 100, `missing short structure summary: ${label}`);
  check(entry.workStatus === "complete", `wrong work state: ${label}`);
  check(entry.evidenceStatus === (hasEvidenceConflict(entry.diagnosticNumber, entry.itemNumber) ? "conflict" : "verified"), `wrong evidence state: ${label}`);
  check(entry.releaseStatus === (eligible ? "eligible" : "locked"), `wrong release state: ${label}`);
  schema.VALIDATION_AXES.filter(function (axis) { return axis !== "release"; }).forEach(function (axis) {
    check(entry.evidence && Object.prototype.hasOwnProperty.call(entry.evidence, axis), `missing evidence axis ${axis}: ${label}`);
  });

  ["source", "officialAnswer", "solution", "visual"].forEach(function (axis) {
    const officialAnswerConflict = axis === "officialAnswer" && entry.diagnosticNumber === 25 && entry.itemNumber === 3;
    const solutionConflict = axis === "solution" && hasEvidenceConflict(entry.diagnosticNumber, entry.itemNumber);
    const expectedStatus = officialAnswerConflict || solutionConflict ? "conflict" : "verified";
    check(entry.evidence && entry.evidence[axis] === expectedStatus, `wrong ${axis} evidence state: ${label}`);
  });
  ["independentMath", "uniqueness"].forEach(function (axis) {
    check(entry.evidence && entry.evidence[axis] === "verified", `missing verified ${axis}: ${label}`);
  });
  check(entry.evidence && entry.evidence.learnerFit === "verified", `wrong learnerFit state: ${label}`);
  check(entry.evidence && entry.evidence.sourceBundleCompleteness === "verified", `wrong source bundle completeness: ${label}`);
  if (!eligible) check(entry.releaseStatus === "locked", `unverified item must stay locked: ${label}`);
  check(entry.learnerStage && entry.learnerStage.sourceLevel && entry.learnerStage.curriculumReference && entry.learnerStage.program === "중등 성취도 진단·선발 대비", `missing learner stage: ${label}`);
  const fit = entry.learnerFitCriteria;
  check(fit && fit.language && fit.representation && Array.isArray(fit.prerequisites) && fit.prerequisites.length && fit.reasoningLoad && fit.responseMode, `incomplete learner fit criteria: ${label}`);

  const locator = entry.sourceLocator || {};
  ["problemAssetId", "problemSlot", "answerAssetId", "solutionAssetId", "problemAssetIds", "answerAssetIds", "solutionAssetIds"].forEach(function (field) {
    check(locator[field] !== undefined && locator[field] !== null && locator[field] !== "", `missing locator ${field}: ${label}`);
  });
  [["problemAssetId", "problemAssetIds", "problem"], ["answerAssetId", "answerAssetIds", "quick-answer"], ["solutionAssetId", "solutionAssetIds", "solution"]].forEach(function (pair) {
    const page = pagesById.get(locator[pair[0]]);
    const expectedIds = expectedAssets(entry.diagnosticNumber, pair[2], entry.itemNumber);
    const expectedId = expectedIds[0] || null;
    check(Boolean(page), `source-page-index asset missing: ${label} ${pair[0]}`);
    check(locator[pair[0]] === expectedId, `wrong ${pair[2]} page role or item range: ${label}`);
    check(Array.isArray(locator[pair[1]]) && locator[pair[1]].join("|") === expectedIds.join("|"), `wrong ${pair[2]} page list: ${label}`);
    if (page) {
      check(page.sourceExamId === entry.sourceExamId && page.diagnosticNumber === entry.diagnosticNumber, `wrong source page linkage: ${label} ${pair[0]}`);
      check(page.role === pair[2] || (page.role === "answer-solution" && (pair[2] === "quick-answer" || pair[2] === "solution")), `wrong indexed page role: ${label} ${pair[0]}`);
      check(page.workStatus === "complete" && page.evidenceStatus === "verified", `wrong indexed page state: ${label} ${pair[0]}`);
      check(page.releaseStatus === (eligible ? "eligible" : "locked"), `wrong indexed page release state: ${label} ${pair[0]}`);
    }
    expectedIds.forEach(function (id) {
      const linkedPage = pagesById.get(id);
      check(Boolean(linkedPage), `source-page-index asset missing: ${label} ${id}`);
      if (!linkedPage) return;
      const indexedRange = pair[2] === "quick-answer" ? (linkedPage.answerItemRange || linkedPage.itemRange) : pair[2] === "solution" ? (linkedPage.solutionItemRange || linkedPage.itemRange) : linkedPage.itemRange;
      check(indexedRange && entry.itemNumber >= indexedRange.from && entry.itemNumber <= indexedRange.to, `item outside indexed page range: ${label} ${id}`);
    });
  });
  check(locator.problemSlot === entry.itemNumber, `wrong problem slot: ${label}`);
});

const expectedSourceLevels = new Map([[1, "초4"], [2, "초4"], [3, "초4"], [4, "초4"], [5, "초4"], [6, "중1"], [7, "초5"], [8, "초4"], [9, "초5"], [10, "초4"], [11, "중1"], [12, "초5"], [13, "초5"], [14, "초5"], [15, "초5"], [16, "초4"], [17, "초5"], [18, "초5"], [19, "초5"], [20, "초5"], [21, "초5"], [22, "초5"], [23, "초5"], [24, "초5"], [25, "초5"], [26, "초5"], [27, "초5"], [28, "초4"], [29, "초6"], [30, "초5"], [31, "초6"], [32, "초6"], [33, "초6"], [34, "초6"], [35, "초6"], [36, "초6"], [37, "초6"], [38, "중1"], [39, "초5"], [40, "초5"]]);
items.forEach(function (entry) {
  check(entry.learnerStage.sourceLevel === expectedSourceLevels.get(entry.diagnosticNumber), `wrong source level: ${entry.itemId}`);
});

TYPE_DETAILS.forEach(function (detail, diagnosticNumber) {
  const group = items.filter(function (entry) { return entry.diagnosticNumber === diagnosticNumber; });
  check(group.length > 0, `missing detail type: q${String(diagnosticNumber).padStart(2, "0")}`);
  group.forEach(function (entry) {
    check(entry.detailTypeName === detail.name, `wrong detail type name: ${entry.itemId}`);
    check(entry.conceptFamilyId === detail.conceptFamilyId, `wrong concept family: ${entry.itemId}`);
  });
});

const q01Items = items.filter(function (entry) { return entry.diagnosticNumber === 1; });
check(q01Items.length === 10, "q01 must contain ten source items");
check(unique(q01Items.map(function (entry) { return entry.detailTypeName; })), "q01 needs one distinct Korean detail type per source problem");
q01Items.forEach(function (entry) {
  check(entry.detailTypeName === Q01_ITEM_DETAILS.get(entry.itemNumber), `wrong q01 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "large-number-condition-search", `wrong q01 concept family: ${entry.itemId}`);
});

const q03Items = items.filter(function (entry) { return entry.diagnosticNumber === 3; });
check(q03Items.length === 10, "q03 must contain ten source items");
check(unique(q03Items.map(function (entry) { return entry.detailTypeName; })), "q03 needs one distinct Korean detail type per source problem");
q03Items.forEach(function (entry) {
  const expected = Q03_ITEM_DETAILS.get(entry.itemNumber);
  check(expected && entry.detailTypeName === expected[0], `wrong q03 detail type name: ${entry.itemId}`);
  check(expected && entry.conceptFamilyId === expected[1], `wrong q03 concept family: ${entry.itemId}`);
});

const q04Items = items.filter(function (entry) { return entry.diagnosticNumber === 4; });
check(q04Items.length === 15, "q04 must contain fifteen source items");
check(unique(q04Items.map(function (entry) { return entry.detailTypeName; })), "q04 needs one distinct Korean detail type per source problem");
q04Items.forEach(function (entry) {
  check(entry.detailTypeName === Q04_ITEM_DETAILS.get(entry.itemNumber), `wrong q04 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q04 concept family: ${entry.itemId}`);
});

const q05Items = items.filter(function (entry) { return entry.diagnosticNumber === 5; });
check(q05Items.length === 10, "q05 must contain ten source items");
check(unique(q05Items.map(function (entry) { return entry.detailTypeName; })), "q05 needs one distinct Korean detail type per source problem");
q05Items.forEach(function (entry) {
  check(entry.detailTypeName === Q05_ITEM_DETAILS.get(entry.itemNumber), `wrong q05 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q05 concept family: ${entry.itemId}`);
});

const q07Items = items.filter(function (entry) { return entry.diagnosticNumber === 7; });
check(q07Items.length === 10, "q07 must contain ten source items");
check(unique(q07Items.map(function (entry) { return entry.detailTypeName; })), "q07 needs one distinct Korean detail type per source problem");
q07Items.forEach(function (entry) {
  check(entry.detailTypeName === Q07_ITEM_DETAILS.get(entry.itemNumber), `wrong q07 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q07 concept family: ${entry.itemId}`);
});

const q08Items = items.filter(function (entry) { return entry.diagnosticNumber === 8; });
check(q08Items.length === 6, "q08 must contain six source items");
check(unique(q08Items.map(function (entry) { return entry.detailTypeName; })), "q08 needs one distinct Korean detail type per source problem");
q08Items.forEach(function (entry) {
  check(entry.detailTypeName === Q08_ITEM_DETAILS.get(entry.itemNumber), `wrong q08 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q08 concept family: ${entry.itemId}`);
});

const q09Items = items.filter(function (entry) { return entry.diagnosticNumber === 9; });
check(q09Items.length === 10, "q09 must contain ten source items");
check(unique(q09Items.map(function (entry) { return entry.detailTypeName; })), "q09 needs one distinct Korean detail type per source problem");
q09Items.forEach(function (entry) {
  check(entry.detailTypeName === Q09_ITEM_DETAILS.get(entry.itemNumber), `wrong q09 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q09 concept family: ${entry.itemId}`);
});

const q10Items = items.filter(function (entry) { return entry.diagnosticNumber === 10; });
check(q10Items.length === 10, "q10 must contain ten source items");
check(unique(q10Items.map(function (entry) { return entry.detailTypeName; })), "q10 needs one distinct Korean detail type per source problem");
q10Items.forEach(function (entry) {
  check(entry.detailTypeName === Q10_ITEM_DETAILS.get(entry.itemNumber), `wrong q10 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q10 concept family: ${entry.itemId}`);
});

const q11Items = items.filter(function (entry) { return entry.diagnosticNumber === 11; });
check(q11Items.length === 5, "q11 must contain five source items");
check(unique(q11Items.map(function (entry) { return entry.detailTypeName; })), "q11 needs one distinct Korean detail type per source problem");
q11Items.forEach(function (entry) {
  check(entry.detailTypeName === Q11_ITEM_DETAILS.get(entry.itemNumber), `wrong q11 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q11 concept family: ${entry.itemId}`);
});

const q12Items = items.filter(function (entry) { return entry.diagnosticNumber === 12; });
check(q12Items.length === 5, "q12 must contain five source items");
check(unique(q12Items.map(function (entry) { return entry.detailTypeName; })), "q12 needs one distinct Korean detail type per source problem");
q12Items.forEach(function (entry) {
  check(entry.detailTypeName === Q12_ITEM_DETAILS.get(entry.itemNumber), `wrong q12 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q12 concept family: ${entry.itemId}`);
});

const q14Items = items.filter(function (entry) { return entry.diagnosticNumber === 14; });
check(q14Items.length === 10, "q14 must contain ten source items");
check(unique(q14Items.map(function (entry) { return entry.detailTypeName; })), "q14 needs one distinct Korean detail type per source problem");
q14Items.forEach(function (entry) {
  check(entry.detailTypeName === Q14_ITEM_DETAILS.get(entry.itemNumber), `wrong q14 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q14 concept family: ${entry.itemId}`);
});
check(new Set(q14Items.filter(function (entry) { return [2, 9, 10].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q14 repeated shape-unit problems must share one concept family");
check(new Set(q14Items.filter(function (entry) { return [3, 6, 7].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q14 fixed-and-growing problems must share one concept family");

const q15Items = items.filter(function (entry) { return entry.diagnosticNumber === 15; });
check(q15Items.length === 11, "q15 must contain eleven source items");
check(unique(q15Items.map(function (entry) { return entry.detailTypeName; })), "q15 needs one distinct Korean detail type per source problem");
q15Items.forEach(function (entry) {
  check(entry.detailTypeName === Q15_ITEM_DETAILS.get(entry.itemNumber), `wrong q15 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q15 concept family: ${entry.itemId}`);
  check(entry.responseContract === "rubric", `q15 relation must use a formula rubric: ${entry.itemId}`);
  const accepted = entry.canonicalAnswer && entry.canonicalAnswer.rubric && entry.canonicalAnswer.rubric.acceptedEquivalent;
  check(Array.isArray(accepted) && accepted.join("|") === Q15_EQUIVALENTS.get(entry.itemNumber).join("|"), `wrong q15 equivalent formula list: ${entry.itemId}`);
});
check(new Set(q15Items.filter(function (entry) { return [1, 2, 3, 10].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q15 multiply/add relations must share one concept family");
check(new Set(q15Items.filter(function (entry) { return [4, 6, 7, 11].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q15 divide/add relations must share one concept family");

const q16Items = items.filter(function (entry) { return entry.diagnosticNumber === 16; });
check(q16Items.length === 5, "q16 must contain five source items");
check(unique(q16Items.map(function (entry) { return entry.detailTypeName; })), "q16 needs one distinct Korean detail type per source problem");
q16Items.forEach(function (entry) {
  check(entry.detailTypeName === Q16_ITEM_DETAILS.get(entry.itemNumber), `wrong q16 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "division-hidden-digit", `wrong q16 concept family: ${entry.itemId}`);
  check(entry.responseContract === "ordered", `q16 answers must follow the source symbol order: ${entry.itemId}`);
});

const q18Items = items.filter(function (entry) { return entry.diagnosticNumber === 18; });
check(q18Items.length === 10, "q18 must contain ten source items");
check(unique(q18Items.map(function (entry) { return entry.detailTypeName; })), "q18 needs one distinct Korean detail type per source problem");
q18Items.forEach(function (entry) {
  check(entry.detailTypeName === Q18_ITEM_DETAILS.get(entry.itemNumber), `wrong q18 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q18 concept family: ${entry.itemId}`);
});
check(new Set(q18Items.filter(function (entry) { return [1, 2, 3, 4, 7, 8, 9].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q18 one-gear rotation problems must share one concept family");
check(q18Items.find(function (entry) { return entry.itemNumber === 6; }).responseContract === "ordered", "q18 i6 must keep the two source answers in order");

const q19Items = items.filter(function (entry) { return entry.diagnosticNumber === 19; });
check(q19Items.length === 7, "q19 must contain seven source items");
check(unique(q19Items.map(function (entry) { return entry.detailTypeName; })), "q19 needs one distinct Korean detail type per source problem");
q19Items.forEach(function (entry) {
  check(entry.detailTypeName === Q19_ITEM_DETAILS.get(entry.itemNumber), `wrong q19 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q19 concept family: ${entry.itemId}`);
});
check(q19Items.filter(function (entry) { return [2, 3, 4, 5, 6].includes(entry.itemNumber); }).every(function (entry) { return entry.conceptFamilyId === "cube-net-hidden-back-sum"; }), "q19 hidden-back problems must share one concept family");
check(q19Items[0].responseContract === "ordered", "q19 i1 must keep the three source blanks in order");

const q20Items = items.filter(function (entry) { return entry.diagnosticNumber === 20; });
check(q20Items.length === 5, "q20 must contain five source items");
check(unique(q20Items.map(function (entry) { return entry.detailTypeName; })), "q20 needs one distinct Korean detail type per source problem");
q20Items.forEach(function (entry) {
  check(entry.detailTypeName === Q20_ITEM_DETAILS.get(entry.itemNumber), `wrong q20 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q20 concept family: ${entry.itemId}`);
});
check(q20Items.slice(0, 3).every(function (entry) { return entry.conceptFamilyId === "fraction-size-ranking"; }), "q20 direct fraction ranks must share one concept family");
check(q20Items[4].responseContract === "ordered", "q20 i5 must keep the source city order contract");

const q21Items = items.filter(function (entry) { return entry.diagnosticNumber === 21; });
check(q21Items.length === 3, "q21 must contain three source items");
check(unique(q21Items.map(function (entry) { return entry.detailTypeName; })), "q21 needs one distinct Korean detail type per source problem");
q21Items.forEach(function (entry) {
  check(entry.detailTypeName === Q21_ITEM_DETAILS.get(entry.itemNumber), `wrong q21 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "equivalent-fraction-range-count", `wrong q21 concept family: ${entry.itemId}`);
});

const q22Items = items.filter(function (entry) { return entry.diagnosticNumber === 22; });
check(q22Items.length === 2, "q22 must contain two source items");
check(unique(q22Items.map(function (entry) { return entry.detailTypeName; })), "q22 needs one distinct Korean detail type per source problem");
q22Items.forEach(function (entry) {
  check(entry.detailTypeName === Q22_ITEM_DETAILS.get(entry.itemNumber), `wrong q22 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "fraction-sequence-term-difference", `wrong q22 concept family: ${entry.itemId}`);
});

const q23Items = items.filter(function (entry) { return entry.diagnosticNumber === 23; });
check(q23Items.length === 10, "q23 must contain ten source items");
check(unique(q23Items.map(function (entry) { return entry.detailTypeName; })), "q23 needs one distinct Korean detail type per source problem");
q23Items.forEach(function (entry) {
  check(entry.detailTypeName === Q23_ITEM_DETAILS.get(entry.itemNumber), `wrong q23 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q23 concept family: ${entry.itemId}`);
});
check(new Set(q23Items.filter(function (entry) { return [1, 2, 3, 4, 5, 8, 10].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q23 whole-from-remainder problems must share one concept family");

const q24Items = items.filter(function (entry) { return entry.diagnosticNumber === 24; });
check(q24Items.length === 6, "q24 must contain six source items");
check(unique(q24Items.map(function (entry) { return entry.detailTypeName; })), "q24 needs one distinct Korean detail type per source problem");
q24Items.forEach(function (entry) {
  check(entry.detailTypeName === Q24_ITEM_DETAILS.get(entry.itemNumber), `wrong q24 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q24 concept family: ${entry.itemId}`);
});
check(new Set(q24Items.filter(function (entry) { return [3, 4].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q24 consecutive-product fraction sums must share one concept family");

const q25Items = items.filter(function (entry) { return entry.diagnosticNumber === 25; });
check(q25Items.length === 4, "q25 must contain four source items");
check(unique(q25Items.map(function (entry) { return entry.detailTypeName; })), "q25 needs one distinct Korean detail type per source problem");
q25Items.forEach(function (entry) {
  check(entry.detailTypeName === Q25_ITEM_DETAILS.get(entry.itemNumber), `wrong q25 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "cut-strips-rearrange-area", `wrong q25 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q25 resolved source-unit correction must be eligible: ${entry.itemId}`);
});
const q25Conflict = q25Items.find(function (entry) { return entry.itemNumber === 3; });
check(q25Items.filter(function (entry) { return Boolean(entry.sourceConflict); }).length === 1, "q25 must record exactly one source conflict");
check(q25Conflict && q25Conflict.sourceConflict.solutionPrinted.unit === "cm²" && q25Conflict.sourceConflict.problemRequestedUnit === "m²" && q25Conflict.sourceConflict.independentAnswer.unit === "m²", "q25 i3 unit conflict evidence is incomplete");
check(q25Conflict && q25Conflict.sourceConflict.resolutionStatus === "resolved" && q25Conflict.sourceConflict.correctedExplanation.includes("228"), "q25 i3 correction resolution is incomplete");

const q26Items = items.filter(function (entry) { return entry.diagnosticNumber === 26; });
check(q26Items.length === 5, "q26 must contain five source items");
check(unique(q26Items.map(function (entry) { return entry.detailTypeName; })), "q26 needs one distinct Korean detail type per source problem");
q26Items.forEach(function (entry) {
  check(entry.detailTypeName === Q26_ITEM_DETAILS.get(entry.itemNumber), `wrong q26 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q26 concept family: ${entry.itemId}`);
});
check(new Set(q26Items.filter(function (entry) { return [2, 3, 5].includes(entry.itemNumber); }).map(function (entry) { return entry.conceptFamilyId; })).size === 1, "q26 nested-area ratio problems must share one concept family");

const q27Items = items.filter(function (entry) { return entry.diagnosticNumber === 27; });
check(q27Items.length === 4, "q27 must contain four source items");
check(unique(q27Items.map(function (entry) { return entry.detailTypeName; })), "q27 needs one distinct Korean detail type per source problem");
q27Items.forEach(function (entry) {
  check(entry.detailTypeName === Q27_ITEM_DETAILS.get(entry.itemNumber), `wrong q27 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "fractional-clock-drift", `wrong q27 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q27 verified source item should be eligible: ${entry.itemId}`);
});

const q28Items = items.filter(function (entry) { return entry.diagnosticNumber === 28; });
check(q28Items.length === 15, "q28 must contain fifteen source items");
check(unique(q28Items.map(function (entry) { return entry.detailTypeName; })), "q28 needs one distinct Korean detail type per source problem");
q28Items.forEach(function (entry) {
  check(entry.detailTypeName === Q28_ITEM_DETAILS.get(entry.itemNumber), `wrong q28 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q28 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q28 verified source item should be eligible: ${entry.itemId}`);
});
check(q28Items[6].sourceLocator.solutionAssetIds.join("|") === `${assetId(28, 5)}|${assetId(28, 6)}`, "q28 i7 continuation pages are wrong");
check(q28Items[14].sourceLocator.solutionAssetIds.join("|") === `${assetId(28, 6)}|${assetId(28, 7)}`, "q28 i15 continuation pages are wrong");

const q29Items = items.filter(function (entry) { return entry.diagnosticNumber === 29; });
check(q29Items.length === 7, "q29 must contain seven source items");
check(unique(q29Items.map(function (entry) { return entry.detailTypeName; })), "q29 needs one distinct Korean detail type per source problem");
q29Items.forEach(function (entry) {
  check(entry.detailTypeName === Q29_ITEM_DETAILS.get(entry.itemNumber), `wrong q29 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q29 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q29 verified source item should be eligible: ${entry.itemId}`);
});

const q30Items = items.filter(function (entry) { return entry.diagnosticNumber === 30; });
check(q30Items.length === 13, "q30 must contain thirteen source items");
check(unique(q30Items.map(function (entry) { return entry.detailTypeName; })), "q30 needs one distinct Korean detail type per source problem");
q30Items.forEach(function (entry) {
  check(entry.detailTypeName === Q30_ITEM_DETAILS.get(entry.itemNumber), `wrong q30 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q30 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q30 verified source item should be eligible: ${entry.itemId}`);
});
check(q30Items[5].sourceLocator.solutionAssetIds.join("|") === `${assetId(30, 5)}|${assetId(30, 6)}`, "q30 i6 continuation pages are wrong");

const q31Items = items.filter(function (entry) { return entry.diagnosticNumber === 31; });
check(q31Items.length === 2, "q31 must contain two source items");
check(unique(q31Items.map(function (entry) { return entry.detailTypeName; })), "q31 needs one distinct Korean detail type per source problem");
q31Items.forEach(function (entry) {
  check(entry.detailTypeName === Q31_ITEM_DETAILS.get(entry.itemNumber), `wrong q31 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "train-tunnel-length", `wrong q31 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q31 verified source item should be eligible: ${entry.itemId}`);
});

const q32Items = items.filter(function (entry) { return entry.diagnosticNumber === 32; });
check(q32Items.length === 15, "q32 must contain fifteen source items");
check(unique(q32Items.map(function (entry) { return entry.detailTypeName; })), "q32 needs one distinct Korean detail type per source problem");
q32Items.forEach(function (entry) {
  check(entry.detailTypeName === Q32_ITEM_DETAILS.get(entry.itemNumber), `wrong q32 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q32 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q32 verified source item should be eligible: ${entry.itemId}`);
});

const q33Items = items.filter(function (entry) { return entry.diagnosticNumber === 33; });
check(q33Items.length === 12, "q33 must contain twelve source items");
check(unique(q33Items.map(function (entry) { return entry.detailTypeName; })), "q33 needs one distinct Korean detail type per source problem");
q33Items.forEach(function (entry) {
  check(entry.detailTypeName === Q33_ITEM_DETAILS.get(entry.itemNumber), `wrong q33 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q33 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q33 verified source item should be eligible: ${entry.itemId}`);
});
check(q33Items[9].sourceLocator.solutionAssetIds.join("|") === `${assetId(33, 3)}|${assetId(33, 4)}`, "q33 i10 continuation pages are wrong");

const q34Items = items.filter(function (entry) { return entry.diagnosticNumber === 34; });
check(q34Items.length === 5, "q34 must contain five source items");
check(unique(q34Items.map(function (entry) { return entry.detailTypeName; })), "q34 needs one distinct Korean detail type per source problem");
q34Items.forEach(function (entry) {
  check(entry.detailTypeName === Q34_ITEM_DETAILS.get(entry.itemNumber), `wrong q34 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q34 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q34 verified source item should be eligible: ${entry.itemId}`);
});
check(q34Items[0].conceptFamilyId === q34Items[1].conceptFamilyId, "q34 i1/i2 must share the percent-count comparison concept");
check(q34Items[3].conceptFamilyId === q34Items[4].conceptFamilyId, "q34 i4/i5 must share the markup-discount-profit concept");

const q35Items = items.filter(function (entry) { return entry.diagnosticNumber === 35; });
check(q35Items.length === 5, "q35 must contain five source items");
check(unique(q35Items.map(function (entry) { return entry.detailTypeName; })), "q35 needs one distinct Korean detail type per source problem");
q35Items.forEach(function (entry) {
  check(entry.detailTypeName === Q35_ITEM_DETAILS.get(entry.itemNumber), `wrong q35 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q35 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q35 complete source item should be eligible: ${entry.itemId}`);
  check(entry.evidence.sourceBundleCompleteness === "verified", `q35 source bundle should be verified: ${entry.itemId}`);
});
check(q35Items[0].conceptFamilyId === q35Items[1].conceptFamilyId, "q35 i1/i2 must share the rolling-distance concept");
check(q35Items[2].conceptFamilyId === q35Items[3].conceptFamilyId && q35Items[3].conceptFamilyId === q35Items[4].conceptFamilyId, "q35 i3/i4/i5 must share the swept-area concept");

const q36Items = items.filter(function (entry) { return entry.diagnosticNumber === 36; });
check(q36Items.length === 6, "q36 must contain six source items");
check(unique(q36Items.map(function (entry) { return entry.detailTypeName; })), "q36 needs one distinct Korean detail type per source problem");
q36Items.forEach(function (entry) {
  check(entry.detailTypeName === Q36_ITEM_DETAILS.get(entry.itemNumber), `wrong q36 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q36 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q36 complete source item should be eligible: ${entry.itemId}`);
  check(entry.evidence.sourceBundleCompleteness === "verified", `q36 source bundle should be verified: ${entry.itemId}`);
});
check(q36Items[1].conceptFamilyId === q36Items[2].conceptFamilyId, "q36 i2/i3 must share the fill-graph block-volume concept");
check(q36Items[3].conceptFamilyId === q36Items[5].conceptFamilyId, "q36 i4/i6 must share the partition water-height concept");

const q37Items = items.filter(function (entry) { return entry.diagnosticNumber === 37; });
check(q37Items.length === 2, "q37 must contain two source items");
check(unique(q37Items.map(function (entry) { return entry.detailTypeName; })), "q37 needs one distinct Korean detail type per source problem");
q37Items.forEach(function (entry) {
  check(entry.detailTypeName === Q37_ITEM_DETAILS.get(entry.itemNumber), `wrong q37 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "triangular-prism-lateral-strip-height", `wrong q37 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q37 complete source item should be eligible: ${entry.itemId}`);
  check(entry.evidence.sourceBundleCompleteness === "verified", `q37 source bundle should be verified: ${entry.itemId}`);
});

const q38Items = items.filter(function (entry) { return entry.diagnosticNumber === 38; });
check(q38Items.length === 6, "q38 must contain six source items");
check(unique(q38Items.map(function (entry) { return entry.detailTypeName; })), "q38 needs one distinct Korean detail type per source problem");
q38Items.forEach(function (entry) {
  check(entry.detailTypeName === Q38_ITEM_DETAILS.get(entry.itemNumber), `wrong q38 detail type name: ${entry.itemId}`);
  check(Boolean(entry.conceptFamilyId), `missing q38 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q38 complete source item should be eligible: ${entry.itemId}`);
  check(entry.evidence.sourceBundleCompleteness === "verified", `q38 source bundle should be verified: ${entry.itemId}`);
});
check(q38Items.slice(0, 3).every(function (entry) { return entry.conceptFamilyId === "continued-fraction-natural-parts"; }), "q38 i1/i2/i3 must share the natural-parts concept");
check(q38Items.slice(3).every(function (entry) { return entry.conceptFamilyId === "nested-fraction-subtraction"; }), "q38 i4/i5/i6 must share the nested-subtraction concept");

const q39Items = items.filter(function (entry) { return entry.diagnosticNumber === 39; });
check(q39Items.length === 7, "q39 must contain seven source items");
check(unique(q39Items.map(function (entry) { return entry.detailTypeName; })), "q39 needs one distinct Korean detail type per source problem");
q39Items.forEach(function (entry) {
  check(entry.detailTypeName === Q39_ITEM_DETAILS.get(entry.itemNumber), `wrong q39 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "decimal-power-last-digit-cycle", `wrong q39 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q39 resolved solution correction must be eligible: ${entry.itemId}`);
  check(entry.evidence.sourceBundleCompleteness === "verified", `q39 source bundle should be verified: ${entry.itemId}`);
});
const q39Conflict = q39Items.find(function (entry) { return entry.itemNumber === 4; });
check(q39Items.filter(function (entry) { return Boolean(entry.sourceConflict); }).length === 1, "q39 must record exactly one solution conflict");
check(q39Conflict && q39Conflict.sourceConflict.solutionPrintedDivision === "80÷4" && q39Conflict.sourceConflict.verifiedCycleLength === 2 && q39Conflict.sourceConflict.independentAnswer.value === "6", "q39 i4 cycle conflict evidence is incomplete");
check(q39Conflict && q39Conflict.sourceConflict.resolutionStatus === "resolved" && q39Conflict.sourceConflict.correctedExplanation.includes("80÷2"), "q39 i4 correction resolution is incomplete");

const q40Items = items.filter(function (entry) { return entry.diagnosticNumber === 40; });
check(q40Items.length === 6, "q40 must contain six source items");
check(unique(q40Items.map(function (entry) { return entry.detailTypeName; })), "q40 needs one distinct Korean detail type per source problem");
q40Items.forEach(function (entry) {
  check(entry.detailTypeName === Q40_ITEM_DETAILS.get(entry.itemNumber), `wrong q40 detail type name: ${entry.itemId}`);
  check(entry.conceptFamilyId === "rotational-digit-symmetry", `wrong q40 concept family: ${entry.itemId}`);
  check(entry.releaseStatus === "eligible", `q40 complete source item should be eligible: ${entry.itemId}`);
  check(entry.evidence.sourceBundleCompleteness === "verified", `q40 source bundle should be verified: ${entry.itemId}`);
});

const q13TypeIds = new Set(items.filter(function (entry) { return entry.diagnosticNumber === 13; }).map(function (entry) { return entry.typeId; }));
const q17TypeIds = new Set(items.filter(function (entry) { return entry.diagnosticNumber === 17; }).map(function (entry) { return entry.typeId; }));
check(q13TypeIds.size === 1 && q17TypeIds.size === 1 && [...q13TypeIds][0] !== [...q17TypeIds][0], "q13 and q17 must have separate type IDs");
check(items.filter(function (entry) { return entry.diagnosticNumber === 13 || entry.diagnosticNumber === 17; }).every(function (entry) { return entry.conceptFamilyId === "multiples-divisibility"; }), "q13/q17 must share the multiples-divisibility concept family");

verifyPublicText();

if (issues.length) {
  console.error(`FAIL pilot item audit (${issues.length})`);
  issues.forEach(function (issue) { console.error(`- ${issue}`); });
  process.exit(1);
}

console.log("PASS pilot item audit: items=302 eligible=302 locked=0 q06=4(learner-fit-verified) q25=4(unit-correction-i3,resolved) q39=7(solution-cycle-correction-i4,resolved) sourceBundle=40pdf-191pages-complete visual=verified independentMath=verified uniqueness=verified");
