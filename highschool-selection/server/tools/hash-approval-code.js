"use strict";

const { hashApprovalCode } = require("../security.js");

const code = process.argv[2];
if (!code) {
  process.stderr.write("Usage: node hash-approval-code.js <approval-code>\n");
  process.exitCode = 1;
} else {
  process.stdout.write(hashApprovalCode(code) + "\n");
}
