/* GFIELD Geometry World — viewport height fix.
 * Browsers that support the dvh unit handle browser-chrome show/hide natively
 * (see the @supports rule in each stylesheet). For browsers WITHOUT dvh
 * support, this script keeps --app-dvh equal to the real visible height in px,
 * so full-screen layouts never extend behind the address bar or bottom bar.
 */
(function () {
  try {
    if (window.CSS && CSS.supports && CSS.supports("height", "100dvh")) return;
  } catch (e) {
    /* fall through to JS sizing */
  }
  var root = document.documentElement;
  function apply() {
    var vv = window.visualViewport;
    var h = vv && vv.height ? vv.height : window.innerHeight;
    if (h) root.style.setProperty("--app-dvh", Math.round(h) + "px");
  }
  apply();
  window.addEventListener("resize", apply);
  window.addEventListener("orientationchange", apply);
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", apply);
    window.visualViewport.addEventListener("scroll", apply);
  }
})();

/* Load the PWA helper (install banner + floating fullscreen toggle) on any page
 * that doesn't already include it explicitly. The hubs add pwa.js themselves;
 * every game loads this shared file, so they get the in-game fullscreen button
 * here without each game page having to be edited. */
(function () {
  function inject() {
    if (document.querySelector('script[data-gf-pwa]') ||
        document.querySelector('script[src*="shared/pwa.js"]')) return;
    var vf = document.querySelector('script[src*="shared/viewport-fit.js"]');
    var href = vf ? vf.getAttribute("src") : "../shared/viewport-fit.js";
    var prefix = href.replace(/viewport-fit\.js.*$/, ""); // ".../shared/"
    if (!document.querySelector('link[href*="shared/pwa.css"]')) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = prefix + "pwa.css?v=1";
      document.head.appendChild(link);
    }
    var s = document.createElement("script");
    s.src = prefix + "pwa.js?v=1";
    s.defer = true;
    s.setAttribute("data-gf-pwa", "1");
    document.body.appendChild(s);
  }
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", inject);
  } else {
    inject();
  }
})();
