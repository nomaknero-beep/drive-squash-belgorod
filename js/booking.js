(function () {
  var form = document.getElementById("booking-form");
  if (!form) return;
  var msg = document.getElementById("booking-msg");

  // Заполнить время (08:00–22:00) и тренеров
  var timeSel = form.querySelector('select[name="time"]');
  for (var h = 8; h <= 22; h++) {
    var t = (h < 10 ? "0" + h : h) + ":00";
    var o = document.createElement("option");
    o.value = t; o.textContent = t; timeSel.appendChild(o);
  }
  var coachSel = form.querySelector('select[name="coach"]');
  (window.CLUB_DATA.coaches || []).forEach(function (c) {
    var o = document.createElement("option");
    o.value = c.name; o.textContent = c.name + " (" + c.role + ")";
    coachSel.appendChild(o);
  });

  // Минимальная дата — сегодня
  var dateInput = form.querySelector('input[name="date"]');
  dateInput.min = new Date().toISOString().split("T")[0];

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    msg.textContent = "";
    var data = {
      name: form.name.value.trim(),
      phone: form.phone.value.trim(),
      date: form.date.value,
      time: form.time.value,
      court: form.court.value,
      coach: form.coach.value
    };
    var digits = data.phone.replace(/\D/g, "");
    if (!data.name || digits.length < 10 || !data.date || !data.time) {
      setMsg("Заполните имя, телефон, дату и время.", false);
      return;
    }
    var btn = form.querySelector('button[type="submit"]');
    btn.disabled = true; btn.textContent = "Отправляем…";
    fetch("api/booking.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    })
      .then(function (r) { return r.json().catch(function () { return { ok: false, error: "Ошибка сервера" }; }); })
      .then(function (res) {
        if (res.ok) { setMsg("Заявка принята! Мы перезвоним для подтверждения.", true); form.reset(); }
        else { setMsg(res.error || "Не удалось отправить. Позвоните: +7 (919) 227-02-37", false); }
      })
      .catch(function () { setMsg("Сеть недоступна. Позвоните: +7 (919) 227-02-37", false); })
      .finally(function () { btn.disabled = false; btn.textContent = "Отправить заявку"; });
  });

  function setMsg(text, ok) {
    msg.textContent = text;
    msg.className = "booking-msg " + (ok ? "ok" : "err");
  }
})();
