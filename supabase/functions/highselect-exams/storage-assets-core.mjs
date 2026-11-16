// Private page metadata only. No original questions, answers, or upload routes.
export const assetOrigins = new Set(['https://lete-on.gfieldacademy.net', 'https://docssam1.github.io', 'http://127.0.0.1:8879']);
const encoder = new TextEncoder();
export const hex = buffer => Array.from(new Uint8Array(buffer), b => b.toString(16).padStart(2, '0')).join('');
export async function sha256(value) {
  return hex(await crypto.subtle.digest('SHA-256', typeof value === 'string' ? encoder.encode(value) : value));
}
export function equal(a, b) {
  if (a.length !== b.length) return false;
  let d = 0;
  for (let i = 0; i < a.length; i++) d |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return d === 0;
}
export function responseContext(req, methods = 'GET, OPTIONS') {
  const origin = req.headers.get('origin');
  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'private, no-store', 'Pragma': 'no-cache',
    'X-Content-Type-Options': 'nosniff', 'Vary': 'Origin',
    'Access-Control-Allow-Headers': 'authorization, apikey, content-type',
    'Access-Control-Allow-Methods': methods,
  });
  if (origin && assetOrigins.has(origin)) headers.set('Access-Control-Allow-Origin', origin);
  const json = (body, status = 200) => new Response(JSON.stringify(body), {status, headers});
  return {headers, json, fail: (error, status = 403) => json({error}, status), originAllowed: !origin || assetOrigins.has(origin)};
}
// The caller enforces its own method/action before invoking this shared verifier.
// The legacy GET signature stays id|sub|kind|page|exp.
export async function authorizePage(req, {db, signingKey, now = Date.now}, ctx) {
  const q = new URL(req.url).searchParams;
  const id = q.get('exam') || '', sub = q.get('sub') || '', kind = q.get('kind') || '';
  const page = Number(q.get('page')), exp = Number(q.get('exp')), sig = q.get('sig') || '';
  const seconds = Math.floor(now() / 1000);
  if (!/^[a-f0-9]{64}$/.test(sub) || !['paper', 'answers', 'analysis'].includes(kind) ||
      !Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(exp) || exp < seconds || exp > seconds + 600) return ctx.fail('page_expired');
  const expected = hex(await crypto.subtle.sign('HMAC', await signingKey, encoder.encode([id, sub, kind, page, exp].join('|'))));
  if (!equal(expected, sig)) return ctx.fail('page_invalid');
  const s = await db.from('highselect_sessions').select('student_id,expires_at').eq('token_hash', sub).maybeSingle();
  if (s.error) return ctx.fail('storage_unavailable', 503);
  if (!s.data || !Number.isFinite(Date.parse(s.data.expires_at)) || Date.parse(s.data.expires_at) <= now()) return ctx.fail('login_required', 401);
  const a = await db.from('highselect_students').select('id,active,expires_at,exam_grants').eq('id', s.data.student_id).maybeSingle();
  if (a.error) return ctx.fail('storage_unavailable', 503);
  if (!a.data?.active || !Number.isFinite(Date.parse(a.data.expires_at)) || Date.parse(a.data.expires_at) <= now()) return ctx.fail('login_required', 401);
  if (!Array.isArray(a.data.exam_grants) || !a.data.exam_grants.includes(id)) return ctx.fail('exam_not_approved');
  return {id, sub, kind, page, studentId: s.data.student_id};
}
export async function downloadPage(db, bank, page) {
  if (bank.bucket !== 'highselect-private-pages' || !page || !/^[a-f0-9]{64}$/.test(page.sha256) || !Number.isSafeInteger(page.bytes) || page.bytes < 1) throw Error('invalid_manifest');
  const bucket = await db.storage.getBucket(bank.bucket);
  if (bucket.error || !bucket.data || bucket.data.id !== bank.bucket || bucket.data.public !== false) throw Error('private_bucket_required');
  const result = await db.storage.from(bank.bucket).download(page.path);
  if (result.error || !result.data) throw Error('page_unavailable');
  const bytes = new Uint8Array(await result.data.arrayBuffer());
  if (bytes.byteLength !== page.bytes || !equal(await sha256(bytes), page.sha256)) throw Error('page_integrity');
  return bytes;
}
export function createAssetHandler(options) {
  return async req => {
    const ctx = responseContext(req);
    if (!ctx.originAllowed) return ctx.fail('origin_not_allowed');
    if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: ctx.headers});
    if (req.method !== 'GET' || new URL(req.url).searchParams.get('action') !== 'asset') return ctx.fail('route_not_found', 404);
    try {
      const auth = await authorizePage(req, options, ctx);
      if (auth instanceof Response) return auth;
      const exam = options.bank.exams.find(e => e.id === auth.id);
      const field = {paper: 'pages', answers: 'answerPages', analysis: 'analysisPages'}[auth.kind];
      const page = exam?.[field]?.[auth.page - 1];
      if (!page) return ctx.fail('page_not_found', 404);
      const bytes = await downloadPage(options.db, options.bank, page);
      ctx.headers.set('Content-Type', 'image/jpeg');
      return new Response(bytes, {headers: ctx.headers});
    } catch { return ctx.fail('service_unavailable', 503); }
  };
}
