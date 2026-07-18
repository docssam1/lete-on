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
