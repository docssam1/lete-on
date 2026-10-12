#!/usr/bin/env node
"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const http = require("node:http");
const path = require("node:path");
const catalog = require("../competition/sasmo-mock-catalog.js");
const session = require("../assessment/sasmo-local-paper-session.js");

const HOST = "127.0.0.1";
const PRIVATE_ROUTE = "/__gfield_private/";
const REQUIRED_FLAGS = Object.freeze(["--paper", "--pack", "--student-review", "--teacher-review"]);
const MAX_BYTES = Object.freeze({ paper: 30 * 1024 * 1024, pack: 1024 * 1024, review: 5 * 1024 * 1024 });
const STATIC_ROUTE_FILES = Object.freeze({
  "/boarding-school-math/sasmo-real-paper.html": "boarding-school-math/sasmo-real-paper.html",
  "/boarding-school-math/gfield-tokens.css": "boarding-school-math/gfield-tokens.css",
  "/boarding-school-math/sasmo-real-paper.css": "boarding-school-math/sasmo-real-paper.css",
  "/boarding-school-math/competition/sasmo-mock-catalog.js": "boarding-school-math/competition/sasmo-mock-catalog.js",
  "/boarding-school-math/assessment/sasmo-mock-readiness.js": "boarding-school-math/assessment/sasmo-mock-readiness.js",
  "/boarding-school-math/assessment/sasmo-local-paper-session.js": "boarding-school-math/assessment/sasmo-local-paper-session.js",
  "/boarding-school-math/shared/gmap-local-learning-record.js": "boarding-school-math/shared/gmap-local-learning-record.js",
  "/boarding-school-math/sasmo-real-paper.js": "boarding-school-math/sasmo-real-paper.js",
  "/boarding-school-math/learning-plan.html": "boarding-school-math/learning-plan.html",
  "/boarding-school-math/favicon.svg": "boarding-school-math/favicon.svg",
  "/boarding-school-math/academy-ui.css": "boarding-school-math/academy-ui.css",
  "/boarding-school-math/learning-plan.css": "boarding-school-math/learning-plan.css",
  "/boarding-school-math/learning/learner-plan-engine.js": "boarding-school-math/learning/learner-plan-engine.js",
  "/boarding-school-math/learning-plan.js": "boarding-school-math/learning-plan.js",
  "/boarding-school-math/concept-learning.html": "boarding-school-math/concept-learning.html",
  "/boarding-school-math/concept-learning.css": "boarding-school-math/concept-learning.css",
  "/boarding-school-math/shared/program-contract.js": "boarding-school-math/shared/program-contract.js",
  "/boarding-school-math/curriculum/us-k8-domain-spine.js": "boarding-school-math/curriculum/us-k8-domain-spine.js",
  "/boarding-school-math/curriculum/us-k8-cluster-map.js": "boarding-school-math/curriculum/us-k8-cluster-map.js",
  "/boarding-school-math/curriculum/us-k8-content-registry.js": "boarding-school-math/curriculum/us-k8-content-registry.js",
  "/boarding-school-math/learning/grade6-concept-lessons.js": "boarding-school-math/learning/grade6-concept-lessons.js",
  "/boarding-school-math/learning/clinic-paths.js": "boarding-school-math/learning/clinic-paths.js",
  "/boarding-school-math/concept-learning.js": "boarding-school-math/concept-learning.js",
  "/boarding-school-math/unit-workbook.html": "boarding-school-math/unit-workbook.html",
  "/boarding-school-math/unit-workbook.css": "boarding-school-math/unit-workbook.css",
  "/boarding-school-math/learning/grade6-rp-clinic-pack.js": "boarding-school-math/learning/grade6-rp-clinic-pack.js",
  "/boarding-school-math/learning/grade6-rp-a-unit-workbook.js": "boarding-school-math/learning/grade6-rp-a-unit-workbook.js",
  "/boarding-school-math/learning/grade6-ns-a-clinic-pack.js": "boarding-school-math/learning/grade6-ns-a-clinic-pack.js",
  "/boarding-school-math/learning/grade6-ns-a-unit-workbook.js": "boarding-school-math/learning/grade6-ns-a-unit-workbook.js",
  "/boarding-school-math/learning/grade6-ns-b-clinic-pack.js": "boarding-school-math/learning/grade6-ns-b-clinic-pack.js",
  "/boarding-school-math/learning/grade6-ns-b-unit-workbook.js": "boarding-school-math/learning/grade6-ns-b-unit-workbook.js",
  "/boarding-school-math/learning/grade6-ns-c-clinic-pack.js": "boarding-school-math/learning/grade6-ns-c-clinic-pack.js",
  "/boarding-school-math/learning/grade6-ns-c-unit-workbook.js": "boarding-school-math/learning/grade6-ns-c-unit-workbook.js",
  "/boarding-school-math/learning/grade6-ee-a-clinic-pack.js": "boarding-school-math/learning/grade6-ee-a-clinic-pack.js",
  "/boarding-school-math/learning/grade6-ee-a-unit-workbook.js": "boarding-school-math/learning/grade6-ee-a-unit-workbook.js",
  "/boarding-school-math/learning/grade6-ee-b-clinic-pack.js": "boarding-school-math/learning/grade6-ee-b-clinic-pack.js",
  "/boarding-school-math/learning/grade6-ee-b-unit-workbook.js": "boarding-school-math/learning/grade6-ee-b-unit-workbook.js",
  "/boarding-school-math/learning/grade6-ee-c-clinic-pack.js": "boarding-school-math/learning/grade6-ee-c-clinic-pack.js",
  "/boarding-school-math/learning/grade6-ee-c-unit-workbook.js": "boarding-school-math/learning/grade6-ee-c-unit-workbook.js",
  "/boarding-school-math/learning/grade6-g-a-clinic-pack.js": "boarding-school-math/learning/grade6-g-a-clinic-pack.js",
  "/boarding-school-math/learning/grade6-g-a-unit-workbook.js": "boarding-school-math/learning/grade6-g-a-unit-workbook.js",
  "/boarding-school-math/learning/grade6-sp-a-unit-workbook.js": "boarding-school-math/learning/grade6-sp-a-unit-workbook.js",
  "/boarding-school-math/learning/grade6-sp-b-unit-workbook.js": "boarding-school-math/learning/grade6-sp-b-unit-workbook.js",
  "/boarding-school-math/learning/grade7-rp-a-unit-workbook.js": "boarding-school-math/learning/grade7-rp-a-unit-workbook.js",
  "/boarding-school-math/unit-workbook.js": "boarding-school-math/unit-workbook.js",
  "/geometry/worksheet/render.js": "geometry/worksheet/render.js",
  "/reading-world/vendor/pdfjs/pdf.min.js": "reading-world/vendor/pdfjs/pdf.min.js",
  "/reading-world/vendor/pdfjs/pdf.worker.min.js": "reading-world/vendor/pdfjs/pdf.worker.min.js"
});

function fail(code) {
  const error = new Error(code);
  error.code = code;
  throw error;
}

function sha256(bytes) {
  return crypto.createHash("sha256").update(bytes).digest("hex");
}

function isInside(parent, child) {
  const relative = path.relative(parent, child);
  return relative === "" || (!relative.startsWith("..") && !path.isAbsolute(relative));
}

function readExternalFile(file, repositoryRoot, maxBytes, code) {
  const requested = path.resolve(file);
  const requestedStat = fs.lstatSync(requested);
  if (!requestedStat.isFile() || requestedStat.isSymbolicLink()) fail(`${code}_INVALID`);
  const resolved = fs.realpathSync(requested);
  const repository = fs.realpathSync(repositoryRoot);
  if (isInside(repository, resolved)) fail(`${code}_INSIDE_GIT`);
  const stat = fs.lstatSync(resolved);
  if (!stat.isFile() || stat.size <= 0 || stat.size > maxBytes) fail(`${code}_INVALID`);
  return Object.freeze({ file: resolved, bytes: fs.readFileSync(resolved), size: stat.size });
}

function assertExternalOutputRoot(outputRoot, repositoryRoot) {
  const requested = path.resolve(outputRoot);
  const repository = fs.realpathSync(repositoryRoot);
  if (isInside(repository, requested)) fail("PRIVATE_STUDIO_QA_OUTPUT_INSIDE_GIT");
  let existingAncestor = requested;
  while (!fs.existsSync(existingAncestor)) {
    const parent = path.dirname(existingAncestor);
    if (parent === existingAncestor) fail("PRIVATE_STUDIO_QA_OUTPUT_INVALID");
    existingAncestor = parent;
  }
  const resolvedAncestor = fs.realpathSync(existingAncestor);
  const resolvedRequested = path.resolve(resolvedAncestor, path.relative(existingAncestor, requested));
  if (isInside(repository, resolvedRequested)) fail("PRIVATE_STUDIO_QA_OUTPUT_INSIDE_GIT");
  return requested;
}

function hasMeta(html, name, value) {
  const escapedName = name.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  const escapedValue = value.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");
  return new RegExp(`<meta\\s+name=["']${escapedName}["']\\s+content=["']${escapedValue}["']`, "iu").test(html);
}

function validateReview(record, audience, reviewContract) {
  const expectedHash = audience === "teacher" ? reviewContract.teacherSha256 : reviewContract.studentSha256;
  if (sha256(record.bytes) !== expectedHash) fail(`PRIVATE_REVIEW_${audience.toUpperCase()}_HASH_MISMATCH`);
  const html = record.bytes.toString("utf8");
  if (!hasMeta(html, "gfield-private-review-pack-id", reviewContract.packId)
    || !hasMeta(html, "gfield-private-review-audience", audience)
    || !hasMeta(html, "gfield-source-image-index-sha256", reviewContract.imageIndexSha256)
    || /(?:[A-Za-z]:\\\\|file:\/\/)/u.test(html)) fail(`PRIVATE_REVIEW_${audience.toUpperCase()}_CONTRACT_INVALID`);
  return record;
}

function prepareRuntime(options) {
  const repositoryRoot = path.resolve(options.repositoryRoot);
  const form = catalog.getForm(session.FORM_ID);
  const reviewContract = typeof catalog.getPrivateReview === "function" ? catalog.getPrivateReview(session.FORM_ID) : null;
  if (!form || !reviewContract) fail("PRIVATE_STUDIO_FORM_INVALID");
  const paper = readExternalFile(options.paperFile, repositoryRoot, MAX_BYTES.paper, "PRIVATE_PAPER");
  if (sha256(paper.bytes) !== form.sourceFingerprintSha256) fail("PRIVATE_PAPER_HASH_MISMATCH");
  const pack = readExternalFile(options.packFile, repositoryRoot, MAX_BYTES.pack, "PRIVATE_PACK");
  if (sha256(pack.bytes) !== form.packFingerprintSha256) fail("PRIVATE_PACK_HASH_MISMATCH");
  let parsedPack;
  try { parsedPack = JSON.parse(pack.bytes.toString("utf8")); } catch (error) { fail("PRIVATE_PACK_JSON_INVALID"); }
  session.validatePack(parsedPack);
  const studentReview = validateReview(readExternalFile(options.studentReviewFile, repositoryRoot, MAX_BYTES.review, "PRIVATE_STUDENT_REVIEW"), "student", reviewContract);
  const teacherReview = validateReview(readExternalFile(options.teacherReviewFile, repositoryRoot, MAX_BYTES.review, "PRIVATE_TEACHER_REVIEW"), "teacher", reviewContract);
  return Object.freeze({ repositoryRoot, form, reviewContract, paper, pack, studentReview, teacherReview });
}

function contentType(file) {
  const extension = path.extname(file).toLowerCase();
  return ({ ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".pdf": "application/pdf" })[extension] || "application/octet-stream";
}

function send(response, requestMethod, status, type, bytes, extraHeaders) {
  response.writeHead(status, Object.assign({
    "content-type": type,
    "content-length": bytes.length,
    "cache-control": "no-store",
    "x-content-type-options": "nosniff",
    "referrer-policy": "no-referrer",
    "cross-origin-resource-policy": "same-origin"
  }, extraHeaders || {}));
  response.end(requestMethod === "HEAD" ? undefined : bytes);
}

function staticFile(repositoryRoot, pathname) {
  let decoded;
  try { decoded = decodeURIComponent(pathname); } catch (error) { return null; }
  const relativeFile = STATIC_ROUTE_FILES[decoded];
  if (!relativeFile) return null;
  const candidate = path.resolve(repositoryRoot, relativeFile);
  if (!isInside(repositoryRoot, candidate) || !fs.existsSync(candidate)) return null;
  const stat = fs.lstatSync(candidate);
  if (!stat.isFile() || stat.isSymbolicLink()) return null;
  const real = fs.realpathSync(candidate);
  return isInside(repositoryRoot, real) ? real : null;
}

function createPrivateSasmoStudio(options) {
  const runtime = prepareRuntime(options);
  const token = options.token || crypto.randomBytes(24).toString("base64url");
  if (!/^[A-Za-z0-9_-]{32}$/u.test(token)) fail("PRIVATE_STUDIO_TOKEN_INVALID");
  const privateBase = `${PRIVATE_ROUTE}${token}`;
  const privateFiles = new Map([
    [`${privateBase}/paper.pdf`, { record: runtime.paper, type: "application/pdf" }],
    [`${privateBase}/pack.json`, { record: runtime.pack, type: "application/json; charset=utf-8" }],
    [`${privateBase}/review/student.html`, { record: runtime.studentReview, type: "text/html; charset=utf-8", review: true }],
    [`${privateBase}/review/teacher.html`, { record: runtime.teacherReview, type: "text/html; charset=utf-8", review: true }]
  ]);
  const server = http.createServer(function (request, response) {
    if (!new Set(["GET", "HEAD"]).has(request.method || "")) {
      send(response, request.method, 405, "text/plain; charset=utf-8", Buffer.from("Method not allowed"), { allow: "GET, HEAD" });
      return;
    }
    const requestUrl = new URL(request.url, `http://${HOST}`);
    const privateFile = privateFiles.get(requestUrl.pathname);
    if (privateFile) {
      const headers = { "x-gfield-private-studio": "sasmo-2019-g6-v1" };
      if (privateFile.review) headers["content-security-policy"] = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; script-src 'unsafe-inline'; font-src data:; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'";
      send(response, request.method, 200, privateFile.type, privateFile.record.bytes, headers);
      return;
    }
    if (requestUrl.pathname.startsWith(PRIVATE_ROUTE)) {
      send(response, request.method, 404, "text/plain; charset=utf-8", Buffer.from("Not found"));
      return;
    }
    const file = staticFile(runtime.repositoryRoot, requestUrl.pathname);
    if (!file) {
      send(response, request.method, 404, "text/plain; charset=utf-8", Buffer.from("Not found"));
      return;
    }
    send(response, request.method, 200, contentType(file), fs.readFileSync(file));
  });
  return Object.freeze({ server, token, privateBase, runtime });
}

function parseArguments(argv) {
  const values = Object.create(null);
  for (let index = 0; index < argv.length; index += 2) {
    const key = argv[index];
    const value = argv[index + 1];
    if (!key || !key.startsWith("--") || value == null) fail("PRIVATE_STUDIO_COMMAND_INVALID");
    values[key] = value;
  }
  REQUIRED_FLAGS.forEach(function (flag) { if (!values[flag]) fail("PRIVATE_STUDIO_COMMAND_INVALID"); });
  const port = values["--port"] == null ? 0 : Number(values["--port"]);
  if (!Number.isInteger(port) || port < 0 || port > 65535) fail("PRIVATE_STUDIO_PORT_INVALID");
  return Object.freeze({
    paperFile: path.resolve(values["--paper"]),
    packFile: path.resolve(values["--pack"]),
    studentReviewFile: path.resolve(values["--student-review"]),
    teacherReviewFile: path.resolve(values["--teacher-review"]),
    port
  });
}

function main() {
  try {
    const args = parseArguments(process.argv.slice(2));
    const repositoryRoot = path.resolve(__dirname, "..", "..");
    const studio = createPrivateSasmoStudio(Object.assign({ repositoryRoot }, args));
    studio.server.on("error", function (error) {
      process.stderr.write(`PRIVATE_SASMO_STUDIO_FAILED code=${error.code || "SERVER_ERROR"}\n`);
      process.exitCode = 1;
    });
    studio.server.listen(args.port, HOST, function () {
      const address = studio.server.address();
      const base = `http://${HOST}:${address.port}/boarding-school-math/sasmo-real-paper.html?runtime=local-private&token=${studio.token}`;
      process.stdout.write(`PRIVATE_SASMO_STUDENT_URL ${base}&audience=student\n`);
      process.stdout.write(`PRIVATE_SASMO_TEACHER_URL ${base}&audience=teacher\n`);
      process.stdout.write("PRIVATE_SASMO_STUDIO_READY source=verified-local-files storage=none upload=none\n");
    });
  } catch (error) {
    process.stderr.write(`PRIVATE_SASMO_STUDIO_BLOCKED code=${error.code || "INVALID"}\n`);
    process.exitCode = 2;
  }
}

if (require.main === module) main();

module.exports = Object.freeze({ HOST, PRIVATE_ROUTE, assertExternalOutputRoot, createPrivateSasmoStudio, parseArguments, prepareRuntime, sha256 });
