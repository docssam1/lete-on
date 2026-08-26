const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const confidentialityMarker = "GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT";
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
const privateAuthoringPaths = [
  {
    path: "boarding-school-math/private-authoring",
    unavailableCode: "PRIVATE_AUTHORING_TRACKING_AUDIT_UNAVAILABLE",
    trackedCode: "PRIVATE_AUTHORING_TRACKED",
    historyUnavailableCode: "PRIVATE_AUTHORING_HISTORY_AUDIT_UNAVAILABLE",
    historyCode: "PRIVATE_AUTHORING_HISTORY_PRESENT",
    message: "An assessment authoring draft is tracked in the public Git index."
  },
  {
    path: "boarding-school-math/private-workbook-authoring",
    unavailableCode: "PRIVATE_WORKBOOK_AUTHORING_TRACKING_AUDIT_UNAVAILABLE",
    trackedCode: "PRIVATE_WORKBOOK_AUTHORING_TRACKED",
    historyUnavailableCode: "PRIVATE_WORKBOOK_HISTORY_AUDIT_UNAVAILABLE",
    historyCode: "PRIVATE_WORKBOOK_HISTORY_PRESENT",
    message: "A workbook authoring draft is tracked in the public Git index."
  }
];
const markerSourcePathExclusions = [
  ":!boarding-school-math/scripts/audit-public-exposure.cjs",
  ":!boarding-school-math/scripts/validate-private-grade6-workbook.cjs",
  ":!boarding-school-math/tests/private-workbook-authoring-guard.test.cjs"
];

function runGit(targetRepoRoot, argumentsList) {
  return spawnSync("git", argumentsList, { cwd: targetRepoRoot, encoding: "utf8" });
}

function listedPaths(result) {
  return String(result.stdout || "").split(/\0|\r?\n/).filter(Boolean);
}

function collectFindings(targetRepoRoot = repoRoot, executeGit = runGit) {
  const findings = [];
  checks.forEach(function (check) {
    const target = path.join(targetRepoRoot, check.file);
    if (!fs.existsSync(target)) return;
    const content = fs.readFileSync(target, "utf8");
    if (check.pattern.test(content)) findings.push({ code: check.code, file: check.file, message: check.message });
  });

  privateAuthoringPaths.forEach(function (privatePath) {
    const tracked = executeGit(targetRepoRoot, ["ls-files", "-z", "--", privatePath.path]);
    if (tracked.status !== 0) {
      findings.push({
        code: privatePath.unavailableCode,
        file: privatePath.path,
        message: "The public audit could not verify that local authoring drafts are absent from the Git index."
      });
    } else if (listedPaths(tracked).length) {
      findings.push({ code: privatePath.trackedCode, file: privatePath.path, message: privatePath.message });
    }

    const history = executeGit(targetRepoRoot, ["log", "--all", "--format=", "--name-only", "--", privatePath.path]);
    if (history.status !== 0) {
      findings.push({
        code: privatePath.historyUnavailableCode,
        file: privatePath.path,
        message: "The public audit could not inspect local authoring-draft path history."
      });
    } else if (listedPaths(history).length) {
      findings.push({
        code: privatePath.historyCode,
        file: privatePath.path,
        message: "Local authoring-draft path history exists in the public Git repository."
      });
    }
  });

  [
    { label: "working tree", argumentsList: ["grep", "-l", confidentialityMarker, "--", ".", ...markerSourcePathExclusions] },
    { label: "staged index", argumentsList: ["grep", "--cached", "-l", confidentialityMarker, "--", ".", ...markerSourcePathExclusions] }
  ].forEach(function (scan) {
    const markerSearch = executeGit(targetRepoRoot, scan.argumentsList);
    if (![0, 1].includes(markerSearch.status)) {
      findings.push({
        code: "PRIVATE_WORKBOOK_MARKER_AUDIT_UNAVAILABLE",
        file: "boarding-school-math",
        message: `The public audit could not scan the ${scan.label} for a workbook confidentiality marker.`
      });
    } else if (markerSearch.status === 0) {
      findings.push({
        code: "PRIVATE_WORKBOOK_MARKER_TRACKED",
        file: "boarding-school-math",
        message: `A workbook confidentiality marker appears in an unexpected tracked ${scan.label} file.`
      });
    }
  });

  const shallowState = executeGit(targetRepoRoot, ["rev-parse", "--is-shallow-repository"]);
  if (shallowState.status !== 0) {
    findings.push({
      code: "PRIVATE_WORKBOOK_HISTORY_DEPTH_AUDIT_UNAVAILABLE",
      file: "boarding-school-math",
      message: "The public audit could not verify that Git history is complete before scanning for a workbook confidentiality marker."
    });
  } else if (String(shallowState.stdout || "").trim() !== "false") {
    findings.push({
      code: "PRIVATE_WORKBOOK_HISTORY_INCOMPLETE",
      file: "boarding-school-math",
      message: "The public audit refuses to claim complete workbook-marker history from a shallow Git repository."
    });
  } else {
    const markerHistory = executeGit(targetRepoRoot, [
      "log", "--all", `-S${confidentialityMarker}`, "--format=", "--name-only", "--", ".", ...markerSourcePathExclusions
    ]);
    if (markerHistory.status !== 0) {
      findings.push({
        code: "PRIVATE_WORKBOOK_MARKER_HISTORY_AUDIT_UNAVAILABLE",
        file: "boarding-school-math",
        message: "The public audit could not inspect all Git history for a workbook confidentiality marker."
      });
    } else if (listedPaths(markerHistory).length) {
      findings.push({
        code: "PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT",
        file: "boarding-school-math",
        message: "A workbook confidentiality marker exists in unexpected public Git history."
      });
    }
  }
  return findings;
}

function reportFindings(findings) {
  if (!findings.length) {
    console.log("PASS public exposure audit: no targeted legacy findings");
    return 0;
  }
  console.error(`BLOCKED public exposure audit: ${findings.length} finding(s)`);
  findings.forEach(function (finding) {
    console.error(`- ${finding.code} ${finding.file}: ${finding.message}`);
  });
  console.error("No secret values or student identifiers were printed.");
  return 2;
}

if (require.main === module) process.exitCode = reportFindings(collectFindings());

module.exports = Object.freeze({
  collectFindings,
  confidentialityMarker,
  markerSourcePathExclusions,
  reportFindings
});
