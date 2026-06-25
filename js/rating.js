(function () {
  var table = document.getElementById("rating-table");
  var tours = document.getElementById("tournaments-list");
  if (!table) return;

  fetch("api/rating.php")
    .then(function (r) { return r.json(); })
    .then(function (d) {
      if (!d.players || !d.players.length) {
        table.innerHTML = '<p class="muted">Рейтинг скоро появится.</p>';
      } else {
        var rows = d.players.map(function (p) {
          var medal = p.rank === 1 ? "🥇" : p.rank === 2 ? "🥈" : p.rank === 3 ? "🥉" : p.rank;
          return "<tr><td>" + medal + "</td><td>" + esc(p.name) + "</td><td>" + p.points +
            "</td><td>" + p.wins + "</td><td>" + p.losses + "</td></tr>";
        }).join("");
        table.innerHTML =
          '<table class="rating"><thead><tr><th>#</th><th>Игрок</th><th>Очки</th><th>Победы</th><th>Поражения</th></tr></thead><tbody>' +
          rows + "</tbody></table>";
      }
      if (d.tournaments && d.tournaments.length) {
        tours.innerHTML = d.tournaments.map(function (t) {
          return '<div class="card"><h3>' + esc(t.title) + '</h3><p class="muted">' +
            (t.date || "") + " · " + esc(t.status) + "</p></div>";
        }).join("");
      } else {
        tours.innerHTML = '<p class="muted">Турниры скоро анонсируем.</p>';
      }
    })
    .catch(function () {
      table.innerHTML = '<p class="muted">Рейтинг временно недоступен.</p>';
    });

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
})();
