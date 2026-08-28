#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const path = require("node:path");
const { createGrade6LocalRuntime, createGrade6LocalServer } = require("../assessment/private-grade6-local-runtime.cjs");

function readPort(argv) {
  const index = argv.indexOf("--port");
  if (index === -1) return 0;
  const value = Number(argv[index + 1]);
  if (!Number.isInteger(value) || value < 0 || value > 65535) throw new Error("--port must be an integer from 0 to 65535");
  return value;
}

function main() {
  const host = "127.0.0.1";
  const port = readPort(process.argv.slice(2));
  const projectRoot = path.resolve(__dirname, "..");
  const teacherPin = crypto.randomBytes(9).toString("base64url").toUpperCase();
  const runtime = createGrade6LocalRuntime({ projectRoot, teacherPin, qaOnly: true });
  const server = createGrade6LocalServer({ runtime, projectRoot, staticRoot: projectRoot });
  server.on("error", function (error) {
    process.stderr.write(`PRIVATE_GRADE6_LOCAL_SERVER_FAILED code=${error.code || "SERVER_ERROR"}\n`);
    process.exitCode = 1;
  });
  server.listen(port, host, function () {
    const address = server.address();
    const localUrl = `http://${host}:${address.port}/diagnostic.html?runtime=local-qa`;
    process.stdout.write(`PRIVATE_GRADE6_LOCAL_URL ${localUrl}\n`);
    process.stdout.write(`PRIVATE_GRADE6_TEACHER_PIN ${teacherPin}\n`);
  });
}

if (require.main === module) main();

module.exports = Object.freeze({ readPort });
