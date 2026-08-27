const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const links = require("../competition/official-original-links.js");
const profiles = require("../competition/k8-competition-profiles.js");

const projectRoot = path.resolve(__dirname, "..");
const allowedHosts = new Set(["form.simcc.org", "sasmo.simcc.org"]);

test("official original links are organizer-hosted English external delivery records", function () {
  assert.equal(links.useMode, "noncommercial_educational");
  assert.ok(links.records.length >= 2);

  links.records.forEach(function (record) {
    const url = new URL(record.organizerHostedUrl);
    assert.equal(url.protocol, "https:");
    assert.equal(url.hostname, record.officialHost);
    assert.equal(allowedHosts.has(url.hostname), true);
    assert.equal(record.organizer, "SIMCC");
    assert.equal(record.originalLanguage, "en");
    assert.equal(record.delivery, "external-official-link");
    assert.equal(record.uiLocalizationOnly, true);
    assert.equal(record.rehosted, false);
    assert.equal(record.storedCopy, false);
    assert.equal(record.translationAvailable, false);
    assert.match(record.lastVerified, /^\d{4}-\d{2}-\d{2}$/);

    const profile = profiles.profiles.find(function (entry) { return entry.programId === record.programId; });
    assert.ok(profile, `${record.id} must bind to an official profile`);
    record.officialGradeKeys.forEach(function (grade) {
      assert.equal(profile.officialGradeKeys.some(function (official) { return String(official) === String(grade); }), true);
    });
  });
});

test("SASMO original lookup never maps K or K2 to an unverified paper", function () {
  assert.equal(links.findForGrade("sasmo-k2-8", "K").length, 0);
  assert.equal(links.findForGrade("sasmo-k2-8", "K2").length, 0);
  assert.equal(links.findForGrade("sasmo-k2-8", 1).length, 1);
  assert.ok(links.findForGrade("sasmo-k2-8", 6).length >= 2);
});

test("public home links to organizer sources without embedding a contest copy", function () {
  const html = fs.readFileSync(path.join(projectRoot, "index.html"), "utf8");
  assert.match(html, /competition\/official-original-links\.js/);
  assert.doesNotMatch(html, /<(?:iframe|embed|object)\b/iu);
  assert.doesNotMatch(html, /href=["'][^"']*sasmo[^"']*\.pdf/iu);

  const trackedPublicFiles = [];
  function walk(directory) {
    fs.readdirSync(directory, { withFileTypes: true }).forEach(function (entry) {
      if (["node_modules", ".git"].includes(entry.name)) return;
      const absolute = path.join(directory, entry.name);
      if (entry.isDirectory()) walk(absolute);
      else trackedPublicFiles.push(absolute);
    });
  }
  walk(projectRoot);
  assert.deepEqual(trackedPublicFiles.filter(function (file) { return /sasmo.*\.pdf$/iu.test(path.basename(file)); }), []);
});
