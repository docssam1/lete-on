#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "hsm-cloud.js"), "utf8");
const key = source.match(/const ANON_KEY = "([^"]+)"/)?.[1];
if (!key) throw new Error("publishable key not found");

(async () => {
  const endpoint = "https://fgahqumaldheqettmvqg.supabase.co/functions/v1/hsmiddle-records";
  const call = (body, token = "") => fetch(endpoint, {
    method: "POST",
    headers: Object.assign({ apikey: key, "Content-Type": "application/json" }, token ? { "x-hsm-session": token } : {}),
    body: JSON.stringify(body),
  });
  const response = await call({ action: "login", name: "__gfield_probe__", code: "INVALID-PROBE" });
  const body = await response.json();
  if (response.status !== 401 || body.error !== "credentials_invalid") {
    throw new Error(`unexpected response: ${response.status} ${JSON.stringify(body)}`);
  }
  const blockedStatuses = [];
  for (const table of ["hsm_students", "hsm_attempts"]) {
    const direct = await fetch(`https://fgahqumaldheqettmvqg.supabase.co/rest/v1/${table}?select=*&limit=1`, {
      headers: { apikey: key, Authorization: `Bearer ${key}` },
    });
    if (![401, 403].includes(direct.status)) throw new Error(`direct ${table} access not blocked: ${direct.status}`);
    blockedStatuses.push(direct.status);
  }
  const probeName = String(process.env.HSMIDDLE_PROBE_NAME || "").trim();
  const probeCode = String(process.env.HSMIDDLE_PROBE_CODE || "").trim();
  if (!probeName || !probeCode) {
    console.log(`HSMIDDLE_EDGE_LIVE_PROBE_OK invalid_login=401 direct_access=${blockedStatuses.join(",")}`);
    return;
  }
  const loginResponse = await call({ action: "login", name: probeName, code: probeCode });
  const login = await loginResponse.json();
  if (!loginResponse.ok || typeof login.token !== "string" || login.token.length !== 64 || !Array.isArray(login.access)) {
    throw new Error(`valid login probe failed: ${loginResponse.status}`);
  }
  const sessionResponse = await call({ action: "session" }, login.token);
  const session = await sessionResponse.json();
  if (!sessionResponse.ok || !session.ok || !Array.isArray(session.access)) throw new Error(`session probe failed: ${sessionResponse.status}`);
  const attemptsResponse = await call({ action: "listAttempts", round: "diagnostic" }, login.token);
  const attempts = await attemptsResponse.json();
  if (!attemptsResponse.ok || !Array.isArray(attempts.attempts)) throw new Error(`attempt probe failed: ${attemptsResponse.status}`);
  let writeResult = "skipped";
  if (process.env.HSMIDDLE_PROBE_WRITE === "1") {
    const record = { score: 2.5, correct: 1, answered: 2, states: { 1: "o", 2: "x" } };
    const firstResponse = await call({ action: "addAttempt", round: "diagnostic", record }, login.token);
    const first = await firstResponse.json();
    if (!firstResponse.ok || !first.ok || !Number.isInteger(first.attempt)) throw new Error(`attempt write failed: ${firstResponse.status}`);
    const duplicateResponse = await call({ action: "addAttempt", round: "diagnostic", record }, login.token);
    const duplicate = await duplicateResponse.json();
    if (!duplicateResponse.ok || !duplicate.ok || duplicate.duplicate !== true || duplicate.attempt !== first.attempt) {
      throw new Error(`attempt dedupe failed: ${duplicateResponse.status}`);
    }
    const afterResponse = await call({ action: "listAttempts", round: "diagnostic" }, login.token);
    const after = await afterResponse.json();
    if (!afterResponse.ok || !Array.isArray(after.attempts) || after.attempts.length !== attempts.attempts.length + 1) {
      throw new Error(`attempt write count failed: ${afterResponse.status}`);
    }
    writeResult = "saved,deduped";
  }
  const logoutResponse = await call({ action: "logout" }, login.token);
  const logout = await logoutResponse.json();
  if (!logoutResponse.ok || !logout.ok) throw new Error(`logout probe failed: ${logoutResponse.status}`);
  console.log(`HSMIDDLE_EDGE_LIVE_PROBE_OK invalid_login=401 direct_access=${blockedStatuses.join(",")} valid_login=200 attempts=${attempts.attempts.length} write=${writeResult} logout=200`);
})().catch(error => { console.error(error.stack || error); process.exit(1); });
