#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");

const source = fs.readFileSync(path.join(__dirname, "hsm-cloud.js"), "utf8");
const key = source.match(/const ANON_KEY = "([^"]+)"/)?.[1];
if (!key) throw new Error("publishable key not found");

(async () => {
  const response = await fetch("https://fgahqumaldheqettmvqg.supabase.co/functions/v1/hsmiddle-records", {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ action: "login", name: "__gfield_probe__", code: "INVALID-PROBE" }),
  });
  const body = await response.json();
  if (response.status !== 401 || body.error !== "credentials_invalid") {
    throw new Error(`unexpected response: ${response.status} ${JSON.stringify(body)}`);
  }
  console.log("HSMIDDLE_EDGE_LIVE_PROBE_OK invalid_login=401");
})().catch(error => { console.error(error.stack || error); process.exit(1); });
