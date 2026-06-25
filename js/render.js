window.renderList = function (containerId, items, htmlFn) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(htmlFn).join("");
};

(function () {
  var d = window.CLUB_DATA;
  if (!d) return;
  document.getElementById("advantages").innerHTML =
    '<h2>Почему «Драйв»</h2><div class="cards">' +
    d.advantages.map(function (a) {
      return '<div class="card"><div class="card-icon">' + a.icon +
        '</div><h3>' + a.title + '</h3><p>' + a.text + '</p></div>';
    }).join("") + '</div>';

  document.getElementById("prices").innerHTML =
    '<h2>Цены</h2><div class="cards">' +
    d.prices.map(function (p) {
      return '<div class="card price-card"><h3>' + p.name + '</h3><div class="price">' +
        p.price + '</div><p class="muted">' + p.note + '</p></div>';
    }).join("") + '</div>';

  document.getElementById("coaches").innerHTML =
    '<h2>Тренеры</h2><div class="cards">' +
    d.coaches.map(function (c) {
      return '<div class="card"><h3>' + c.name + '</h3><p class="muted">' + c.role +
        '</p><p>' + c.schedule + '</p></div>';
    }).join("") + '</div>';
})();
