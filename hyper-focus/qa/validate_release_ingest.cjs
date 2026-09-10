// Executes the actual function with synthetic deployment settings and in-memory Storage only.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { webcrypto, createHash } = require('node:crypto');
const filename = path.resolve(__dirname, '../supabase/functions/hf-release-ingest/index.ts');
const source = fs.readFileSync(filename, 'utf8');
const hash = b => createHash('sha256').update(b).digest('hex');
const token = 'a'.repeat(64); // Synthetic fixture, never an operating credential.
const body = Buffer.from('{"fixture":"private-release"}');
const objectPath = 'releases/qa/manifest.json';
const bucketName = 'hf-challenge-private';
let checks = 0;
function harness(options = {}) {
  let now = 2_000_000_000_000;
  const calls = [], objects = new Map();
  let bucket = options.missingBucket ? null : { id: bucketName, public: !!options.publicBucket };
  if (options.existing) objects.set(objectPath, options.existing === true ? body : Buffer.from(options.existing));
  const release = { issuedAt: now - 1000, expiresAt: now + 60_000, tokenSha256: hash(token),
    files: { [objectPath]: { sha256: hash(body), bytes: body.length } }, ...options.release };
  const storage = {
    async getBucket(name) {
      calls.push(['getBucket', name]); assert.equal(name, bucketName);
      if (options.bucketError) return { error: { statusCode: '500' } };
      return bucket ? { data: bucket } : { error: { statusCode: '404' } };
    },
    async createBucket(name, config) {
      calls.push(['createBucket', name, config]);
      assert.equal(name, bucketName); assert.equal(config.public, false);
      assert.equal(config.fileSizeLimit, 6 * 1024 * 1024);
      assert.equal(JSON.stringify(config.allowedMimeTypes), '["application/json"]');
      bucket = { id: name, public: !!options.createPublic };
      if (options.createFailure) { bucket = null; return { error: { statusCode: '500' } }; }
      return options.createRace ? { error: { statusCode: '409' } } : { data: bucket };
    },
    from(name) {
      calls.push(['from', name]); assert.equal(name, bucketName);
      return {
        async upload(p, data, config) {
          calls.push(['upload', p, config]); assert.equal(p, objectPath);
          assert.equal(config.upsert, false); assert.equal(config.contentType, 'application/json');
          if (options.expireOnUpload) now += 100_000;
          if (objects.has(p) || options.uploadFailure) return { error: { statusCode: '409', message: 'SECRET ERROR MUST NOT ESCAPE' } };
          objects.set(p, Buffer.from(data)); return { data: { path: p } };
        },
        async download(p) {
          calls.push(['download', p]); assert.equal(p, objectPath);
          if (options.readError || !objects.has(p)) return { error: { message: 'SECRET ERROR MUST NOT ESCAPE' } };
          const bytes = options.corrupt ? Buffer.alloc(body.length, 33) : options.readOversize ? Buffer.alloc(6 * 1024 * 1024 + 1) : objects.get(p);
          return { data: new Blob([bytes]) };
        }
      };
    }
  };
  const context = { RELEASE: release, Request, Response, Headers, Uint8Array, TextEncoder, TextDecoder,
    crypto: webcrypto, Date: class extends Date { static now() { return now; } },
    createClient(url, key, settings) {
      calls.push(['createClient']); assert.equal(url, 'https://fixture.invalid'); assert.equal(key, 'service-fixture');
      assert.equal(settings.auth.persistSession, false);
      // Any accidental Auth or DB access fails immediately.
      return new Proxy({ storage }, { get(target, prop) { if (prop !== 'storage') throw Error('Forbidden service API ' + String(prop)); return target[prop]; } });
    },
    Deno: { env: { get: k => options.noEnv ? undefined : ({ SUPABASE_URL: 'https://fixture.invalid', SUPABASE_SERVICE_ROLE_KEY: 'service-fixture' })[k] }, serve: fn => { context.handler = fn; } }
  };
  vm.createContext(context);
  vm.runInContext(source.replace(/^import .*;\r?\n/gm, ''), context, { filename });
  return { calls, objects, release, expire() { now += 100_000; }, async request(opts = {}) {
    const headers = { authorization: 'Bearer ' + token, 'x-release-path': objectPath, 'content-type': 'application/json', ...opts.headers };
    for (const k of opts.removeHeaders || []) delete headers[k];
    const method = opts.method || 'POST';
    const req = new Request('https://fixture.invalid/functions/v1/hf-release-ingest', { method, headers,
      ...(!['GET', 'HEAD'].includes(method) ? { body: opts.body ?? body, duplex: 'half' } : {}) });
    const result = await context.handler(req), text = await result.text();
    assert(!text.includes(token) && !text.includes('service-fixture') && !text.includes('private-release') && !text.includes('SECRET ERROR'));
    assert.equal(result.headers.get('access-control-allow-origin'), null);
    assert.equal(result.headers.get('cache-control'), 'no-store');
    return { code: result.status, body: JSON.parse(text) };
  } };
}
async function test(name, options, request, code, verify = () => {}) {
  const h = harness(options), r = await h.request(request);
  assert.equal(r.code, code, name); await verify(h, r); checks++;
}
async function main() {
  const noAccess = h => assert.equal(h.calls.length, 0);
  await test('upload + download verification', {}, {}, 200, (h, r) => {
    assert.deepEqual(r.body, { path: objectPath, sha256: hash(body), bytes: body.length, status: 'uploaded' });
    assert.equal(h.calls.filter(x => x[0] === 'upload').length, 1);
    assert.equal(h.calls.filter(x => x[0] === 'download').length, 1);
  });
  await test('octet stream accepted', {}, { headers: { 'content-type': 'application/octet-stream' } }, 200);
  await test('idempotent identical existing object', { existing: true }, {}, 200, (h, r) => assert.equal(r.body.status, 'already_present'));
  await test('existing conflict cannot overwrite', { existing: 'different file' }, {}, 409, h => assert.equal(h.objects.get(objectPath).toString(), 'different file'));
  await test('private bucket creation', { missingBucket: true }, {}, 200, h => assert(h.calls.some(x => x[0] === 'createBucket')));
  await test('concurrent bucket create is read back', { missingBucket: true, createRace: true }, {}, 200);
  await test('existing public bucket refused', { publicBucket: true }, {}, 503, h => assert(!h.calls.some(x => ['upload', 'createBucket'].includes(x[0]))));
  await test('created bucket unexpectedly public', { missingBucket: true, createPublic: true }, {}, 503, h => assert(!h.calls.some(x => x[0] === 'upload')));
  await test('create error', { missingBucket: true, createFailure: true }, {}, 503);
  await test('bucket outage never creates', { bucketError: true }, {}, 503, h => assert(!h.calls.some(x => x[0] === 'createBucket')));
  await test('download mismatch', { corrupt: true }, {}, 502);
  await test('download unavailable', { readError: true }, {}, 502);
  await test('oversized readback', { readOversize: true }, {}, 502);
  await test('failed upload without matching object', { uploadFailure: true }, {}, 409);
  for (const method of ['GET', 'OPTIONS', 'PUT', 'DELETE']) await test(method + ' disallowed', {}, { method }, 405, noAccess);
  for (const origin of ['https://browser.invalid', 'null', '']) await test('origin denied ' + origin, {}, { headers: { origin } }, 403, noAccess);
  for (const authorization of ['Bearer ' + 'b'.repeat(64), 'Bearer short', '', 'Basic ' + token]) await test('bad token', {}, { headers: { authorization } }, 401, noAccess);
  for (const p of ['elsewhere.json', '../manifest.json', '/manifest.json', 'a//b.json', 'a/./b.json', 'a/%2e%2e/b.json', 'a\\b.json', '__proto__', 'releases/qa/manifest.json?x']) await test('unapproved path ' + p, {}, { headers: { 'x-release-path': p } }, 403, noAccess);
  await test('hash mismatch', {}, { body: Buffer.alloc(body.length, 32) }, 422, noAccess);
  await test('short body', {}, { body: Buffer.from('{}') }, 400, noAccess);
  await test('body greater than pinned file', {}, { body: Buffer.concat([body, Buffer.from(' ')]) }, 413, noAccess);
  await test('body beyond 6MB', {}, { body: Buffer.alloc(6 * 1024 * 1024 + 1) }, 413, noAccess);
  await test('oversize content length', {}, { headers: { 'content-length': String(6 * 1024 * 1024 + 1) } }, 413, noAccess);
  await test('incorrect declared length', {}, { headers: { 'content-length': '2' } }, 400, noAccess);
  await test('wrong MIME', {}, { headers: { 'content-type': 'text/plain' } }, 415, noAccess);
  await test('encoded body refused', {}, { headers: { 'content-encoding': 'gzip' } }, 415, noAccess);
  await test('no environment', { noEnv: true }, {}, 503, noAccess);
  for (const release of [
    { expiresAt: 1 }, { issuedAt: 2_000_000_001_000 },
    { expiresAt: 2_000_000_000_000 + 6 * 3600_000 }, { tokenSha256: 'bad' },
    { files: {} }, { files: { '../escape.json': { sha256: hash(body), bytes: body.length } } },
    { files: { [objectPath]: { sha256: hash(body), bytes: 6 * 1024 * 1024 + 1 } } }
  ]) await test('invalid or expired settings', { release }, {}, 404, noAccess);
  const invalid = Buffer.from('not JSON');
  await test('pinned invalid JSON still refused', { release: { files: { [objectPath]: { sha256: hash(invalid), bytes: invalid.length } } } }, { body: invalid }, 422, noAccess);
  await test('expiry during write cannot report success', { expireOnUpload: true }, {}, 404);
  const h = harness(); h.expire(); assert.equal((await h.request()).code, 404); noAccess(h); checks++;
  const streamH = harness();
  const stream = new ReadableStream({ start(controller) { controller.enqueue(body.subarray(0, 2)); streamH.expire(); controller.enqueue(body.subarray(2)); controller.close(); } });
  assert.equal((await streamH.request({ body: stream })).code, 404); noAccess(streamH); checks++;
  assert(!/\.auth\.|\.rpc\(|\.updateBucket\(|\.remove\(|upsert:\s*true/.test(source)); checks++;
  console.log(JSON.stringify({ status: 'passed', checks, storage: 'in-memory fixture only', remoteWrites: 0,
    note: 'No operating release-settings file or token was created. Parent must deploy, upload, then seal the function.' }));
}
if (require.main === module) main().catch(error => { console.error(error); process.exitCode = 1; });
module.exports = { harness, main };
