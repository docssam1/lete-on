import { levels, validateLevels, validateCuts, findSolutions, cutsForRegions } from "./levels.js";
validateLevels();
if(levels.length!==5)throw new Error("Expected five levels.");
const ids=new Set();let solved=0;
for(const level of levels){if(level.problems.length!==10)throw new Error(`L${level.id} count`);for(const problem of level.problems){if(ids.has(problem.id))throw new Error(`duplicate ${problem.id}`);ids.add(problem.id);if(!validateCuts(problem,problem.sampleCuts).valid)throw new Error(`bad sample ${problem.id}`);const missingOne=new Set(problem.sampleCuts);missingOne.delete(missingOne.values().next().value);if(validateCuts(problem,missingOne).valid)throw new Error(`incomplete partition accepted ${problem.id}`);const solution=findSolutions(problem,1)[0];if(!solution)throw new Error(`unsolved ${problem.id}`);if(!validateCuts(problem,cutsForRegions(solution)).valid)throw new Error(`solver mismatch ${problem.id}`);solved++;}}
let alternateCount=0;
const alternateSamples=[levels[0].problems[0],levels[1].problems[0],levels[2].problems[0],levels[3].problems[0],levels[4].problems[3]];
for(const problem of alternateSamples){const solutions=findSolutions(problem,4);if(solutions.length<2)throw new Error(`Expected alternate answers for ${problem.id}.`);for(const regions of solutions){if(!validateCuts(problem,cutsForRegions(regions)).valid)throw new Error(`Valid alternate answer rejected for ${problem.id}.`);}alternateCount+=solutions.length;}
const markerProblem=levels[2].problems[0],missingMarker={...markerProblem,markers:{...markerProblem.markers}};delete missingMarker.markers[Object.keys(missingMarker.markers)[0]];
if(validateCuts(missingMarker,missingMarker.sampleCuts).valid)throw new Error("Missing marker was accepted.");
const sumProblem=levels[2].problems[6],wrongSum={...sumProblem,markers:{...sumProblem.markers}},firstNumber=Object.keys(wrongSum.markers)[0];wrongSum.markers[firstNumber]+=1;
if(validateCuts(wrongSum,wrongSum.sampleCuts).valid)throw new Error("Unequal sums were accepted.");
console.log(`equal-partition selftest: ${solved} problems, ${alternateCount} alternate solutions accepted`);
