const fs = require("node:fs");
const path = require("node:path");

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
