/* Écran fixe : pas de zoom, pas de rebond, pas de saut. Désactiver : ?fixe=0 */
(function () {
  if (/[?&]fixe=0/.test(location.search)) return;
  try {
    var m = document.querySelector('meta[name="viewport"]');
    if (m) m.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover");
    var s = document.createElement("style");
    s.textContent = "html,body{overscroll-behavior:none;-webkit-text-size-adjust:100%;text-size-adjust:100%;-webkit-tap-highlight-color:transparent}" +
      "html,body,button,a,input,select,textarea,[onclick]{touch-action:manipulation}" +
      "body{-webkit-user-select:none;user-select:none}input,textarea{-webkit-user-select:text;user-select:text}" +
      "html{scrollbar-gutter:stable}";
    document.head.appendChild(s);
    ["gesturestart", "gesturechange", "gestureend"].forEach(function (n) { document.addEventListener(n, function (e) { e.preventDefault(); }, { passive: false }); });
    document.addEventListener("dblclick", function (e) { e.preventDefault(); }, { passive: false });
  } catch (e) {}
})();
