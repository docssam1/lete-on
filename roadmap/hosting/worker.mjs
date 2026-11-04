// Static alias only. Membership API requests still go directly to Supabase.
export const PUBLIC_HOST = 'roadmap.gfieldacademy.net';
export const PREVIEW_HOST = 'gfield-roadmap.pages.dev';
export const SOURCE_ORIGIN = 'https://lete-on.gfieldacademy.net';
export const INTRO_PATH = '/roadmap/demo2/account.html';
export function target(request) {
  const input = new URL(request.url);
  if (![PUBLIC_HOST, PREVIEW_HOST].includes(input.hostname)) return null;
  const root = input.pathname === '/' || input.pathname === '/index.html';
  const url = new URL(SOURCE_ORIGIN);
  url.pathname = root ? INTRO_PATH : input.pathname;
  url.search = input.search;
  const headers = new Headers();
  for (const name of ['accept', 'accept-language', 'range', 'if-range', ...(!root ? ['if-none-match', 'if-modified-since'] : [])]) {
    if (request.headers.has(name)) headers.set(name, request.headers.get(name));
  }
  return { input, url, headers, root };
}
export async function serve(request, fetcher = fetch, Rewriter = globalThis.HTMLRewriter) {
  const route = target(request);
  if (!route) return new Response('Unknown site', { status: 421 });
  if (!['GET', 'HEAD'].includes(request.method)) return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
  if (['/planner.html', '/account.html', '/admin.html'].includes(route.input.pathname)) {
    const canonical = new URL('/roadmap/demo2' + route.input.pathname, route.input.origin); canonical.search = route.input.search;
    return Response.redirect(canonical.href, 302);
  }
  let origin;
  try { origin = await fetcher(route.url.href, { method: request.method, headers: route.headers, redirect: 'manual' }); }
  catch { return new Response('The roadmap is temporarily unavailable. Please try again.', { status: 502, headers: { 'Cache-Control': 'no-store' } }); }
  const response = new Response(origin.body, origin);
  response.headers.delete('set-cookie');
  const location = response.headers.get('location');
  if (location) {
    const next = new URL(location, route.url);
    if (next.origin === SOURCE_ORIGIN) { next.host = route.input.host; next.protocol = route.input.protocol; response.headers.set('location', next.href); }
  }
  if (route.root && response.ok && response.headers.get('content-type')?.includes('text/html')) {
    response.headers.delete('content-length'); response.headers.delete('etag');
    response.headers.set('cache-control', 'no-cache');
    if (request.method === 'GET') return new Rewriter().on('head', {
      element(element) { element.prepend('<base href="/roadmap/demo2/">', { html: true }); }
    }).on('a[href^="#"]', {
      element(element) { element.setAttribute('href', route.input.pathname + route.input.search + element.getAttribute('href')); }
    }).transform(response);
  }
  return response;
}
export default { fetch: request => serve(request) };
