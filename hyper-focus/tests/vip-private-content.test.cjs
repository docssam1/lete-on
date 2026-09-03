"use strict";
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const root = path.resolve(__dirname, "..");
const read = relative => fs.readFileSync(path.join(root, relative), "utf8");
const migration = read("supabase/migrations/20260831123000_vip_private_visibility.sql");
const edge = read("supabase/functions/admin-vip/index.ts");
const app = read("vip/app.js");
const admin = read("vip/admin.js");
const config = read("supabase-config.js");

assert.match(migration, /source_content\.status = 'published'/);
assert.match(migration, /target_content\.status = 'published'/);
assert.match(migration, /permission_key = 'vip'/);
assert.match(migration, /hf_private\.is_active_student/);
assert.match(edge, /metadata\?\.hf_role !== "admin"/);
assert.match(edge, /hf_admin_accounts/);
assert.match(edge, /createSignedUploadUrl/);
assert.match(edge, /uploaded_asset_mismatch/);
assert.doesNotMatch(edge, /SUPABASE_SERVICE_ROLE_KEY\s*=\s*["']/);
assert.match(app, /hf_vip_relations/);
assert.match(app, /hf_vip_assets/);
assert.match(app, /signedAssetUrl\("vip", assetId\)/);
assert.match(admin, /uploadToSignedUrl/);
assert.match(admin, /action: "finalizeUpload"/);
assert.match(config, /securePracticeDelivery:\s*false/);

const context = { window: {}, globalThis: null, localStorage: { getItem(){return null;}, setItem(){}, removeItem(){} } };
context.globalThis = context;
vm.createContext(context);
vm.runInContext(config, context);
vm.runInContext(read("mock/access-policy.js"), context);
assert.equal(context.window.HFAccessPolicy.paidPracticeReady(), false);
assert.throws(() => context.window.HFAccessPolicy.validatePracticeRequest({ countPerType: 3, difficulty: "same", accessTier: "paid" }), /서버 전달 준비 중/);
assert.equal(context.window.HFAccessPolicy.validatePracticeRequest({ countPerType: 2, difficulty: "hard", accessTier: "paid" }).countPerType, 2);

console.log("PASS vip-private-content");
