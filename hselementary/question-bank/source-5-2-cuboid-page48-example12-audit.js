"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-cuboid-page48-example12.js");

const fail = message => { console.error(`Example 1-2 audit failed: ${message}`); process.exitCode = 1; };
const model = source.verifyModel();
const type = window.HSE_CURRICULUM.semesters.find(item => item.id === "5-2")
  .units.find(item => item.id === "5-2-u5")
  .subunits.find(item => item.name === "직육면체의 성질")
  .types.find(item => item.sourceItemId === source.definition.sourceItemId);
if (!type) fail("curriculum type is missing");
if (type?.reviewLocked !== false || type?.sourceVerified !== true) fail("verified local release metadata is inconsistent");
if (window.HSE_GENERATORS.generatorKey(type) !== source.definition.generatorKey) fail("generator is not registered for the source type");
const generated = window.HSE_GENERATORS.generate(type, 2, 0, 48, 0);
if (!generated) fail("fixed source variant did not generate");
if (window.HSE_GENERATORS.generate(type, 2, 0, 48, 1) !== null) fail("invented variant was allowed");
if (model.width !== 12 || model.depth !== 4 || model.height !== 10 || model.edgeCount !== 12 || model.answerCm !== 104) fail("source dimensions or independent answer are incorrect");
if (!generated?.prompt.includes("위와 옆에서 본 그림") || !generated.prompt.includes("모든 모서리의 합은 몇 cm인가")) fail("source prompt structure was not preserved");
if ((generated?.prompt.match(/<svg /g) || []).length !== 3) fail("problem should contain one desktop and two mobile source views");
if (!generated?.solution.includes("4 × (12 + 4 + 10) = 104") || !generated.solution.includes("답: 104cm")) fail("worked solution is incomplete");
if (generated?.answer !== "104cm" || generated?.answerVisualRequired !== false) fail("answer contract is inconsistent");

if (!process.exitCode) console.log("Example 1-2 audit passed: source views preserve 12cm×4cm and 4cm×10cm; all 12 edges total 104cm; one fixed verified item only.");
