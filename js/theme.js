(function () {
  var KEY = "drive-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var saved = localStorage.getItem(KEY);
  if (saved) root.setAttribute("data-theme", saved);
  if (!btn) return;
  updateIcon();
  btn.addEventListener("click", function () {
    var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
    updateIcon();
  });
  function updateIcon() {
    btn.textContent = root.getAttribute("data-theme") === "dark" ? "☀️" : "🌙";
  }
})();
