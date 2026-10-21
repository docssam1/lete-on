(function () {
  'use strict';

  var KEY = 'nm_guardian_session_v1';
  var SKEW = 60;
  var cfg = null;
  var session = null; // internal: {access_token, refresh_token, expires_at, user:{id,email}}
  var listeners = [];
  var refreshPromise = null;
  var readyPromise = null;
  var refreshVersion = -1;
  var authVersion = 0;
  var candidate = null; // private, unconfirmed session from a URL hash; never persisted until confirmLink()

  function now() { return Math.floor(Date.now() / 1000); }
  function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
  function str(v) { return typeof v === 'string' && v.length > 0 ? v : null; }

  function makeError(message, status, code) {
    var e = new Error(message);
    if (typeof status === 'number') e.status = status;
    if (code) e.code = code;
    return e;
  }

  function sanitize(text) {
    return String(text == null ? '' : text)
      .replace(/[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{5,}/g, '[redacted]')
      .replace(/[^\s@]+@[^\s@]+/g, '[redacted]')
      .slice(0, 200);
  }

  function store() {
    try { return window.localStorage || null; } catch (e) { return null; }
  }

  function readStored() {
    var s = store();
    if (!s) return null;
    var raw;
    try { raw = s.getItem(KEY); } catch (e) { return null; }
    if (!raw) return null;
    var parsed;
    try { parsed = JSON.parse(raw); } catch (e) { return null; }
    return normalize(parsed);
  }

  function persist(sess) {
    var s = store();
    if (!s) throw makeError('Storage unavailable', undefined, 'storage');
    var json = JSON.stringify(sess);
    try {
      s.setItem(KEY, json);
      if (s.getItem(KEY) !== json) throw new Error('mismatch');
    } catch (e) {
      throw makeError('Could not save sign-in on this device', undefined, 'storage');
    }
  }

  function removeStored() {
    var s = store();
    if (!s) return true;
    try {
      s.removeItem(KEY);
      return s.getItem(KEY) == null;
    } catch (e) { return false; }
  }

  // Identity comes only from user.id and user.email; metadata is ignored.
  function normalize(raw, fallbackUser) {
    if (!isObj(raw)) return null;
    var access = str(raw.access_token);
    if (!access) return null;
    var u = isObj(raw.user) ? raw.user : fallbackUser;
    if (!isObj(u) || !str(u.id)) return null;
    var exp = null;
    if (typeof raw.expires_at === 'number' && isFinite(raw.expires_at)) exp = Math.floor(raw.expires_at);
    else if (typeof raw.expires_in === 'number' && isFinite(raw.expires_in)) exp = now() + Math.floor(raw.expires_in);
    if (exp == null) return null;
    return {
      access_token: access,
      refresh_token: str(raw.refresh_token) || '',
      expires_at: exp,
      user: { id: u.id, email: typeof u.email === 'string' ? u.email : '' }
    };
  }

  function publicView(sess) {
    return sess ? { user: { id: sess.user.id, email: sess.user.email }, expires_at: sess.expires_at } : null;
  }

  function emit() {
    var view = publicView(session);
    listeners.slice().forEach(function (fn) {
      try { fn(view ? { user: { id: view.user.id, email: view.user.email }, expires_at: view.expires_at } : null); } catch (e) { /* ignore */ }
    });
  }

  function clearAuth() {
    authVersion++;
    var had = !!session || !!candidate;
    session = null;
    candidate = null;
    var ok = removeStored();
    if (had) emit();
    return ok;
  }

  function request(method, path, opts) {
    opts = opts || {};
    if (!cfg) return Promise.reject(makeError('Auth not configured', undefined, 'config'));
    var headers = { apikey: cfg.anonKey, 'Content-Type': 'application/json' };
    if (opts.token) headers.Authorization = 'Bearer ' + opts.token;
    var init = { method: method, headers: headers };
    if (opts.body !== undefined) init.body = JSON.stringify(opts.body);
    var f = window.fetch;
    var p;
    try { p = Promise.resolve(f.call(window, cfg.url + path, init)); } catch (e) { p = Promise.reject(e); }
    return p.then(function (res) {
      return Promise.resolve(res.text ? res.text() : '').then(function (t) { return t; }, function () { return ''; })
        .then(function (text) {
          var data = null;
          try { data = text ? JSON.parse(text) : null; } catch (e) { data = null; }
          if (!res.ok) {
            var msg = isObj(data) ? (data.msg || data.message || data.error_description || data.error || data.error_code) : null;
            throw makeError(sanitize(msg || 'Request failed'), res.status, 'http');
          }
          return data;
        });
    }, function () {
      throw makeError('Network error', undefined, 'network');
    });
  }

  function configure(c) {
    if (!isObj(c) || !str(c.url) || !str(c.anonKey)) throw makeError('Invalid auth configuration', undefined, 'config');
    cfg = { url: c.url.replace(/\/+$/, ''), anonKey: c.anonKey };
  }

  function parseHash() {
    var h;
    try { h = String(window.location.hash || ''); } catch (e) { return null; }
    if (h.charAt(0) === '#') h = h.slice(1);
    if (!h || h.indexOf('=') < 0) return null;
    var out = {};
    h.split('&').forEach(function (pair) {
      var i = pair.indexOf('=');
      if (i < 1) return;
      try {
        out[decodeURIComponent(pair.slice(0, i))] = decodeURIComponent(pair.slice(i + 1).replace(/\+/g, ' '));
      } catch (e) { /* skip malformed */ }
    });
    var isAuth = out.access_token !== undefined || out.refresh_token !== undefined || out.error_description !== undefined || out.error_code !== undefined;
    return isAuth ? out : null;
  }

  function removeHash() {
    try {
      var l = window.location;
      window.history.replaceState(null, '', l.pathname + (l.search || ''));
    } catch (e) { /* ignore */ }
  }

  // Validates the hash tokens and holds them privately; nothing is persisted or logged in.
  function acceptHash(p, version) {
    var access = str(p.access_token), refresh = str(p.refresh_token);
    if (!access || !refresh) return Promise.resolve();
    return request('GET', '/auth/v1/user', { token: access }).then(function (user) {
      if (version !== authVersion) return; // stale: signed out / changed meanwhile
      if (!isObj(user) || !str(user.id)) throw makeError('Invalid sign-in link', undefined, 'invalid');
      var exp = parseInt(p.expires_at, 10);
      var sess = normalize({
        access_token: access,
        refresh_token: refresh,
        expires_at: isFinite(exp) ? exp : undefined,
        expires_in: isFinite(parseInt(p.expires_in, 10)) ? parseInt(p.expires_in, 10) : 3600
      }, user);
      if (!sess) throw makeError('Invalid sign-in link', undefined, 'invalid');
      candidate = sess;
      emit();
    }).catch(function () { /* not accepted */ });
  }

  function pendingLink() {
    return candidate ? { id: candidate.user.id, email: candidate.user.email } : null;
  }

  function cancelLink() {
    if (!candidate) return;
    candidate = null;
    emit();
  }

  function confirmLink() {
    var cand = candidate;
    if (!cand) return Promise.reject(makeError('No sign-in link to confirm', undefined, 'nolink'));
    if (session && session.user.id !== cand.user.id) {
      return Promise.reject(makeError('Sign out before using a link for a different account', undefined, 'identity'));
    }
    try { persist(cand); } catch (e) { return Promise.reject(e); }
    authVersion++;
    candidate = null;
    session = cand;
    emit();
    return Promise.resolve(publicView(cand));
  }

  function ready() {
    if (readyPromise) return readyPromise;
    var startVersion = authVersion;
    readyPromise = Promise.resolve().then(function () {
      var stored = readStored();
      if (stored && (stored.expires_at > now() || stored.refresh_token)) session = stored;
      else if (stored) removeStored();
      var h = parseHash();
      if (!h) return;
      removeHash();
      return acceptHash(h, startVersion);
    }).then(function () { return publicView(session); }, function () { return publicView(session); });
    return readyPromise;
  }

  if (typeof window.addEventListener === 'function') window.addEventListener('hashchange', function () {
    var h = parseHash();
    if (!h) return;
    removeHash();
    acceptHash(h, authVersion);
  });

  function peek() { return publicView(session); }

  function doRefresh() {
    if (refreshPromise && refreshVersion === authVersion) return refreshPromise;
    var current = session;
    var version = authVersion;
    refreshVersion = version;
    var mine = null;
    mine = refreshPromise = request('POST', '/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: current.refresh_token } })
      .then(function (data) {
        if (version !== authVersion) return null;
        var sess = normalize(data);
        if (!sess) throw makeError('Invalid refresh response', 502, 'invalid');
        session = sess;
        try { persist(sess); } catch (e) { /* keep in memory; stored copy may be stale */ }
        emit();
        return sess;
      })
      .catch(function (err) {
        if (version !== authVersion) return null;
        if (err && (err.status === 400 || err.status === 401)) {
          clearAuth();
          return null;
        }
        // network or server failure: keep stored refresh token for retry
        if (session && session.expires_at > now()) return session;
        return null;
      })
      .then(function (r) { if (refreshPromise === mine) refreshPromise = null; return r; });
    return refreshPromise;
  }

  function copy(s) {
    return { access_token: s.access_token, refresh_token: s.refresh_token, expires_at: s.expires_at, user: { id: s.user.id, email: s.user.email } };
  }

  function getSession() {
    return ready().then(function () {
      if (!session) return null;
      if (session.expires_at - now() > SKEW) return copy(session);
      if (!session.refresh_token) {
        if (session.expires_at > now()) return copy(session);
        clearAuth();
        return null;
      }
      return doRefresh().then(function (s) { return s ? copy(s) : null; });
    });
  }

  function validEmail(email) {
    return typeof email === 'string' && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  function sendEmail(email) {
    if (!validEmail(email)) return Promise.reject(makeError('Enter a valid email address', 400, 'invalid_email'));
    var l = window.location;
    var redirect = l.origin + l.pathname + '?enter=1';
    return request('POST', '/auth/v1/otp?redirect_to=' + encodeURIComponent(redirect), {
      body: { email: email.trim(), create_user: true }
    }).then(function () { return undefined; });
  }

  function verifyEmail(email, token) {
    if (!validEmail(email)) return Promise.reject(makeError('Enter a valid email address', 400, 'invalid_email'));
    if (typeof token !== 'string' || !token.trim()) return Promise.reject(makeError('Enter the code from the email', 400, 'invalid_token'));
    var version = ++authVersion;
    return request('POST', '/auth/v1/verify', {
      body: { email: email.trim(), token: token.trim(), type: 'email' }
    }).then(function (data) {
      if (version !== authVersion) throw makeError('Sign-in was cancelled', undefined, 'cancelled');
      var sess = normalize(data);
      if (!sess || !sess.refresh_token) throw makeError('Invalid sign-in response', 502, 'invalid');
      persist(sess);
      session = sess;
      emit();
      return publicView(sess);
    });
  }

  function signOut() {
    // Snapshot tokens, then clear local state immediately (bumps authVersion, drops candidate).
    var snap = session ? copy(session) : readStored();
    var ok = clearAuth();
    var remote = Promise.resolve();
    if (snap) {
      var tokenP;
      if (snap.expires_at > now()) tokenP = Promise.resolve(snap.access_token);
      else if (snap.refresh_token) {
        // direct request with snapshot; result is never applied to local state
        tokenP = request('POST', '/auth/v1/token?grant_type=refresh_token', { body: { refresh_token: snap.refresh_token } })
          .then(function (d) { return isObj(d) ? str(d.access_token) : null; });
      } else tokenP = Promise.resolve(null);
      remote = tokenP.then(function (token) {
        if (token) return request('POST', '/auth/v1/logout?scope=local', { token: token });
      }).catch(function () { /* offline ok */ });
    }
    return remote.then(function () {
      if (!ok) throw makeError('Could not clear sign-in on this device', undefined, 'storage');
    });
  }

  function onChange(fn) {
    if (typeof fn !== 'function') return function () {};
    listeners.push(fn);
    return function () {
      var i = listeners.indexOf(fn);
      if (i >= 0) listeners.splice(i, 1);
    };
  }

  if (typeof window.addEventListener === 'function') window.addEventListener('storage', function (event) {
    if (event.key !== KEY && event.key !== null) return;
    authVersion++;
    candidate = null;
    session = readStored();
    emit();
  });

  window.NM_PROFILE_AUTH = {
    configure: configure,
    ready: ready,
    peek: peek,
    getSession: getSession,
    sendEmail: sendEmail,
    verifyEmail: verifyEmail,
    signOut: signOut,
    pendingLink: pendingLink,
    confirmLink: confirmLink,
    cancelLink: cancelLink,
    onChange: onChange
  };
})();
