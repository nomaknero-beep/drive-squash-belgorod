(function () {
  var grid = document.getElementById("gallery-grid");
  var empty = document.getElementById("gallery-empty");
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightbox-img");
  if (!grid) return;

  var list = (window.CLUB_DATA && window.CLUB_DATA.gallery) || [];
  var pending = list.length;
  var loaded = 0;

  if (empty) empty.style.display = "none";
  if (!list.length) { showEmpty(); return; }

  list.forEach(function (src) {
    var item = document.createElement("button");
    item.className = "gallery-item";
    item.type = "button";
    var img = document.createElement("img");
    img.loading = "lazy";
    img.alt = "Фото клуба «Драйв»";
    img.src = src;
    img.addEventListener("load", function () { loaded++; done(); });
    img.addEventListener("error", function () { item.remove(); done(); });
    item.addEventListener("click", function () { openLb(src); });
    item.appendChild(img);
    grid.appendChild(item);
  });

  function done() {
    pending--;
    if (pending <= 0 && loaded === 0) showEmpty();
  }

  function showEmpty() {
    grid.style.display = "none";
    if (empty) empty.style.display = "";
  }

  function openLb(src) {
    if (!lb) return;
    lbImg.src = src;
    lb.classList.add("open");
  }
  function closeLb() {
    if (!lb) return;
    lb.classList.remove("open");
    lbImg.src = "";
  }

  if (lb) {
    lb.addEventListener("click", function (e) {
      if (e.target === lb || e.target.classList.contains("lightbox-close")) closeLb();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLb();
    });
  }
})();
