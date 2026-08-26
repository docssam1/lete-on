const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const checks = [
  {
    file: "admin.html",
    code: "STATIC_ADMIN_FALLBACK",
    pattern: /FALLBACK_PASS\s*=\s*["'][^"']+["']/,
    message: "A browser-delivered fallback administrator credential is present."
  },
  {
    file: "gfield-on-admin.html",
    code: "STATIC_ADMIN_FALLBACK",
    pattern: /FALLBACK_PASS\s*=\s*["'][^"']+["']/,
    message: "A browser-delivered fallback administrator credential is present."
  },
  {
    file: "hsmiddle/data.js",
    code: "PUBLIC_STUDENT_RECORDS",
    pattern: /(?:studentCode|students|승인번호|approvalCode)/,
    message: "Student access records are stored in a public static data bundle."
  }
];

const findings = checks.flatMap(function (check) {
  const target = path.join(repoRoot, check.file);
  if (!fs.existsSync(target)) return [];
  const content = fs.readFileSync(target, "utf8");
  return check.pattern.test(content) ? [{ code: check.code, file: check.file, message: check.message }] : [];
});

const trackedPrivateDrafts = spawnSync(
  "git",
  ["ls-files", "-z", "--", "boarding-school-math/private-authoring"],
  { cwd: repoRoot, encoding: "utf8" }
);
if (trackedPrivateDrafts.status !== 0) {
  findings.push({
    code: "PRIVATE_AUTHORING_TRACKING_AUDIT_UNAVAILABLE",
    file: "boarding-school-math/private-authoring",
    message: "The public audit could not verify that local assessment drafts are absent from the Git index."
  });
} else if (String(trackedPrivateDrafts.stdout || "").split("\0").filter(Boolean).length) {
  findings.push({
    code: "PRIVATE_AUTHORING_TRACKED",
    file: "boarding-school-math/private-authoring",
    message: "An assessment authoring draft is tracked in the public Git index."
  });
}

if (!findings.length) {
  console.log("PASS public exposure audit: no targeted legacy findings");
  process.exit(0);
}

console.error(`BLOCKED public exposure audit: ${findings.length} finding(s)`);
findings.forEach(function (finding) {
  console.error(`- ${finding.code} ${finding.file}: ${finding.message}`);
});
console.error("No secret values or student identifiers were printed.");
process.exitCode = 2;
