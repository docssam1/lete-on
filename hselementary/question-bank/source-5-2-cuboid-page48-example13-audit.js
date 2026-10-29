"use strict";

global.window = {};
require("./source-inventory-4-1.js");
require("./source-inventory-grade6.js");
require("./curriculum.js");
require("./generators.js");
const source = require("./source-5-2-cuboid-page48-example13.js");

const fail = message => { console.error(`Example 1-3 audit failed: ${message}`); process.exitCode = 1; };
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
if (model.pieces.length !== 4 || model.width !== 7 || model.depth !== 5 || model.height !== 3) fail("source dimensions or four-piece partition are incorrect");
if (model.sumWidth !== 14 || model.sumDepth !== 10 || model.sumHeight !== 12 || model.answerCm !== 144) fail("independent partition-edge sum is incorrect");
if (!generated?.prompt.includes("네 개의 작은 직육면체로 잘랐다") || !generated.prompt.includes("네 개의 직육면체에 있는 모서리의 길이")) fail("source prompt structure was not preserved");
if ((generated?.prompt.match(/source52-p48e13-cut-edge/g) || []).length !== 4) fail("two through-cuts must appear on the reconstructed cuboid");
if (generated?.prompt.includes('x1="560" y1="170" x2="210" y2="170"')) fail("hidden rear-bottom edge must not cross the visible front face");
if ((generated?.prompt.match(/class="source52-p48e13-edge"/g) || []).length !== 9) fail("the nine visible outer edges must be retained");
if (!generated?.solution.includes("4×(14+10+12)=144cm") || !generated.solution.includes("답: 144cm")) fail("worked solution is incomplete");
if (generated?.answer !== "144cm" || generated?.answerVisualRequired !== false) fail("answer contract is inconsistent");

if (!process.exitCode) console.log("Example 1-3 audit passed: source 7×5×3cm cuboid, two base cuts, four pieces; dimension-independent total 144cm; one fixed source item only.");
