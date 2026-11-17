const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..", "..");
const confidentialityMarker = "GFIELD_PRIVATE_WORKBOOK_DO_NOT_COMMIT";
const assessmentConfidentialityMarker = "GFIELD_PRIVATE_ASSESSMENT_DO_NOT_COMMIT";
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
  },
  {
    path: "boarding-school-math/private-sasmo-authoring",
    unavailableCode: "PRIVATE_SASMO_AUTHORING_TRACKING_AUDIT_UNAVAILABLE",
    trackedCode: "PRIVATE_SASMO_AUTHORING_TRACKED",
    historyUnavailableCode: "PRIVATE_SASMO_AUTHORING_HISTORY_AUDIT_UNAVAILABLE",
    historyCode: "PRIVATE_SASMO_AUTHORING_HISTORY_PRESENT",
    message: "A SASMO year-paper intake draft is tracked in the public Git index."
  }
];
const markerSourcePathExclusions = [
  ":!boarding-school-math/scripts/audit-public-exposure.cjs",
  ":!boarding-school-math/scripts/validate-private-grade6-workbook.cjs",
  ":!boarding-school-math/tests/private-workbook-authoring-guard.test.cjs"
];
const markerScopePaths = ["boarding-school-math"];
const markerExcludedFiles = new Set(markerSourcePathExclusions.map(function (pathspec) { return pathspec.replace(/^:!/, ""); }));
const maxUntrackedAuditBytes = 16 * 1024 * 1024;
const assessmentMarkerSourcePathExclusions = [
  ":!boarding-school-math/scripts/audit-public-exposure.cjs",
  ":!boarding-school-math/scripts/validate-private-grade7-ns-a-authoring.cjs",
  ":!boarding-school-math/tests/private-grade7-ns-a-authoring.test.cjs"
];
// Assessment drafts can be renamed or misplaced anywhere in this repository.
// Keep each marker's source exclusions independent; a workbook implementation
// file is not an exemption for accidentally copied assessment content.
const markerPolicies = [
  {
    marker: confidentialityMarker,
    label: "workbook",
    scopePaths: markerScopePaths,
    findingScope: "boarding-school-math",
    exclusions: markerSourcePathExclusions,
    codes: {
      markerUnavailable: "PRIVATE_WORKBOOK_MARKER_AUDIT_UNAVAILABLE",
      markerTracked: "PRIVATE_WORKBOOK_MARKER_TRACKED",
      untrackedUnavailable: "PRIVATE_WORKBOOK_UNTRACKED_AUDIT_UNAVAILABLE",
      markerUntracked: "PRIVATE_WORKBOOK_MARKER_UNTRACKED",
      historyDepthUnavailable: "PRIVATE_WORKBOOK_HISTORY_DEPTH_AUDIT_UNAVAILABLE",
      historyIncomplete: "PRIVATE_WORKBOOK_HISTORY_INCOMPLETE",
      markerHistoryUnavailable: "PRIVATE_WORKBOOK_MARKER_HISTORY_AUDIT_UNAVAILABLE",
      markerHistoryPresent: "PRIVATE_WORKBOOK_MARKER_HISTORY_PRESENT"
    }
  },
  {
    marker: assessmentConfidentialityMarker,
    label: "private assessment",
    scopePaths: ["."],
    findingScope: "repository",
    exclusions: assessmentMarkerSourcePathExclusions,
    codes: {
      markerUnavailable: "PRIVATE_ASSESSMENT_MARKER_AUDIT_UNAVAILABLE",
      markerTracked: "PRIVATE_ASSESSMENT_MARKER_TRACKED",
      untrackedUnavailable: "PRIVATE_ASSESSMENT_UNTRACKED_AUDIT_UNAVAILABLE",
      markerUntracked: "PRIVATE_ASSESSMENT_MARKER_UNTRACKED",
      historyDepthUnavailable: "PRIVATE_ASSESSMENT_HISTORY_DEPTH_AUDIT_UNAVAILABLE",
      historyIncomplete: "PRIVATE_ASSESSMENT_HISTORY_INCOMPLETE",
      markerHistoryUnavailable: "PRIVATE_ASSESSMENT_MARKER_HISTORY_AUDIT_UNAVAILABLE",
      markerHistoryPresent: "PRIVATE_ASSESSMENT_MARKER_HISTORY_PRESENT"
    }
  }
];

function runGit(targetRepoRoot, argumentsList) {
  return spawnSync("git", argumentsList, {
    cwd: targetRepoRoot,
    encoding: "utf8",
    // A local audit must report missing promisor objects, not fetch history.
    env: Object.assign({}, process.env, { GIT_NO_LAZY_FETCH: "1" }),
    // Whole-repository history can exceed 30 seconds in a complete clone.
    // Retain a finite limit and fail closed on timeout or missing objects.
    timeout: 180000,
    maxBuffer: 4 * 1024 * 1024
  });
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

  markerPolicies.forEach(function (policy) {
    findings.push(...collectMarkerFindings(targetRepoRoot, executeGit, policy));
  });
  return findings;
}

function collectMarkerFindings(targetRepoRoot, executeGit, policy) {
  const findings = [];
  const confidentialityMarker = policy.marker;
  const markerScopePaths = policy.scopePaths;
  const markerSourcePathExclusions = policy.exclusions;
  const markerExcludedFiles = new Set(markerSourcePathExclusions.map(function (pathspec) { return pathspec.replace(/^:!/, ""); }));
  [
    { label: "working tree", argumentsList: ["grep", "-l", confidentialityMarker, "--", ...markerScopePaths, ...markerSourcePathExclusions] },
    { label: "staged index", argumentsList: ["grep", "--cached", "-l", confidentialityMarker, "--", ...markerScopePaths, ...markerSourcePathExclusions] }
  ].forEach(function (scan) {
    const markerSearch = executeGit(targetRepoRoot, scan.argumentsList);
    if (![0, 1].includes(markerSearch.status)) {
      findings.push({
        code: policy.codes.markerUnavailable,
        file: policy.findingScope,
        message: `The public audit could not scan the ${scan.label} for a workbook confidentiality marker.`
      });
    } else if (markerSearch.status === 0) {
      findings.push({
        code: policy.codes.markerTracked,
        file: policy.findingScope,
        message: `A workbook confidentiality marker appears in an unexpected tracked ${scan.label} file.`
      });
    }
  });

  const untracked = executeGit(targetRepoRoot, ["ls-files", "--others", "--exclude-standard", "-z", "--", ...markerScopePaths]);
  if (untracked.status !== 0) {
    findings.push({
      code: policy.codes.untrackedUnavailable,
      file: policy.findingScope,
      message: "The public audit could not enumerate untracked workbook files."
    });
  } else {
    const marker = Buffer.from(confidentialityMarker, "utf8");
    for (const relativePath of listedPaths(untracked)) {
      if (markerExcludedFiles.has(relativePath)) continue;
      try {
        const target = path.join(targetRepoRoot, relativePath);
        const stat = fs.lstatSync(target);
        if (!stat.isFile() || stat.size > maxUntrackedAuditBytes) {
          findings.push({
            code: policy.codes.untrackedUnavailable,
            file: relativePath,
            message: "The public audit refuses to follow an untracked link or read an oversized untracked file."
          });
          continue;
        }
        if (fs.readFileSync(target).includes(marker)) {
          findings.push({
            code: policy.codes.markerUntracked,
            file: relativePath,
            message: "A workbook confidentiality marker appears in an unexpected untracked file."
          });
        }
      } catch (_error) {
        findings.push({
          code: policy.codes.untrackedUnavailable,
          file: relativePath,
          message: "The public audit could not read an untracked workbook file."
        });
      }
    }
  }

  const shallowState = executeGit(targetRepoRoot, ["rev-parse", "--is-shallow-repository"]);
  if (shallowState.status !== 0) {
    findings.push({
      code: policy.codes.historyDepthUnavailable,
      file: policy.findingScope,
      message: "The public audit could not verify that Git history is complete before scanning for a workbook confidentiality marker."
    });
  } else if (String(shallowState.stdout || "").trim() !== "false") {
    findings.push({
      code: policy.codes.historyIncomplete,
      file: policy.findingScope,
      message: "The public audit refuses to claim complete workbook-marker history from a shallow Git repository."
    });
  } else {
    const markerHistory = executeGit(targetRepoRoot, [
      "log", "--all", `-S${confidentialityMarker}`, "--format=", "--name-only", "--", ...markerScopePaths, ...markerSourcePathExclusions
    ]);
    if (markerHistory.status !== 0) {
      findings.push({
        code: policy.codes.markerHistoryUnavailable,
        file: policy.findingScope,
        message: "The public audit could not inspect all Git history for a workbook confidentiality marker."
      });
    } else if (listedPaths(markerHistory).length) {
      findings.push({
        code: policy.codes.markerHistoryPresent,
        file: policy.findingScope,
        message: "A workbook confidentiality marker exists in unexpected public Git history."
      });
    }
  }
  return findings.map(function (finding) {
    return Object.assign({}, finding, { message: finding.message.replace(/workbook/g, policy.label) });
  });
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
  assessmentConfidentialityMarker,
  assessmentMarkerSourcePathExclusions,
  markerScopePaths,
  markerExcludedFiles,
  maxUntrackedAuditBytes,
  markerSourcePathExclusions,
  reportFindings
});
