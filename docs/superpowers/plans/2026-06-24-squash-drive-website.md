# Сайт сквош-клуба «Драйв» — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Современный сайт сквош-клуба «Драйв» (Белгород) с интерактивным бронированием через Telegram, тёмной темой и рейтингом игроков.

**Architecture:** Статический фронтенд (HTML + CSS + ванильный JS) обслуживается напрямую. Лёгкий PHP-бэкенд принимает заявки на бронь и пересылает их в Telegram через Bot API, а также отдаёт данные рейтинга/турниров из MySQL. Секреты лежат в серверном `api/config.php` вне публичного доступа.

**Tech Stack:** HTML5, CSS3 (CSS-переменные для темизации), ванильный JavaScript (ES6, IntersectionObserver, fetch), PHP 7.4+, MySQL 5.7+, Telegram Bot API.

## Global Constraints

- Язык интерфейса: русский. Все тексты, подписи, сообщения — на русском.
- Никаких тяжёлых JS-фреймворков (React/Vue/и т.п.) и сборщиков. Только ванильный JS.
- Секреты (токен бота, пароль БД) — только в `api/config.php`, никогда в фронтенд-коде и не в git (добавить в `.gitignore`, хранить `api/config.example.php`).
- Совместимость с обычным shared-хостингом RuCenter: PHP без Composer-зависимостей, MySQL через mysqli.
- Адаптивность: корректное отображение на мобильном (от 360px) и десктопе.
- Палитра/контент клуба: Сквош-клуб «Драйв», г. Белгород, ул. Чехова 2А, тел. +7 (919) 227-02-37, ВК vk.com/club145913352. Реальные цены/тренеры/фото подставляются позже — в коде использовать помеченные плейсхолдеры-данные в одном месте.

---

## File Structure

- `index.html` — разметка лендинга (все секции).
- `css/styles.css` — стили и темизация (CSS-переменные dark/light).
- `js/theme.js` — переключатель темы с сохранением выбора.
- `js/animations.js` — анимации появления секций (IntersectionObserver).
- `js/data.js` — данные клуба (цены, тренеры, расписание) в одном месте для правки.
- `js/booking.js` — пошаговый календарь брони и отправка заявки.
- `js/rating.js` — загрузка и отрисовка рейтинга/турниров.
- `api/config.example.php` — шаблон конфига (токен, chat_id, доступ к БД).
- `api/telegram.php` — функция отправки сообщения в Telegram.
- `api/booking.php` — приём заявки, валидация, отправка в Telegram, лог.
- `api/db.php` — подключение к MySQL.
- `api/rating.php` — выдача рейтинга/турниров в JSON.
- `db/schema.sql` — структура таблиц и тестовые данные.
- `.gitignore` — исключить `api/config.php` и логи.
- `README.md` — как развернуть на RuCenter, как создать бота, как наполнить рейтинг.

---

### Task 1: Каркас страницы и базовые стили

**Files:**
- Create: `index.html`
- Create: `css/styles.css`
- Create: `.gitignore`

**Interfaces:**
- Consumes: ничего.
- Produces: HTML-страница с секциями, имеющими `id`: `hero`, `advantages`, `booking`, `prices`, `coaches`, `rating`, `gallery`, `contacts`. CSS-переменные темы на `:root` и `[data-theme="dark"]`. Шапка с навигацией по якорям и кнопкой-переключателем темы `#theme-toggle`.

- [ ] **Step 1: Создать `.gitignore`**

```
api/config.php
api/*.log
.DS_Store
```

- [ ] **Step 2: Создать каркас `index.html`**

```html
<!DOCTYPE html>
<html lang="ru" data-theme="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Сквош-клуб «Драйв» — Белгород</title>
  <meta name="description" content="Сквош-клуб «Драйв» в Белгороде: 2 корта, тренировки, прокат. Бесплатная пробная по субботам. Онлайн-запись.">
  <link rel="stylesheet" href="css/styles.css">
</head>
<body>
  <header class="site-header">
    <a href="#hero" class="logo">Драйв<span>сквош</span></a>
    <nav class="nav">
      <a href="#booking">Запись</a>
      <a href="#prices">Цены</a>
      <a href="#coaches">Тренеры</a>
      <a href="#rating">Рейтинг</a>
      <a href="#contacts">Контакты</a>
    </nav>
    <button id="theme-toggle" class="theme-toggle" aria-label="Сменить тему">🌙</button>
  </header>

  <main>
    <section id="hero" class="section hero"></section>
    <section id="advantages" class="section"></section>
    <section id="booking" class="section"></section>
    <section id="prices" class="section"></section>
    <section id="coaches" class="section"></section>
    <section id="rating" class="section"></section>
    <section id="gallery" class="section"></section>
    <section id="contacts" class="section"></section>
  </main>

  <footer class="site-footer">
    <p>Сквош-клуб «Драйв» · г. Белгород, ул. Чехова, 2А · +7 (919) 227-02-37</p>
  </footer>

  <script src="js/data.js"></script>
  <script src="js/theme.js"></script>
  <script src="js/animations.js"></script>
  <script src="js/booking.js"></script>
  <script src="js/rating.js"></script>
</body>
</html>
```

- [ ] **Step 3: Создать `css/styles.css` с темизацией и базовой сеткой**

```css
:root {
  --bg: #ffffff;
  --bg-alt: #f4f6f8;
  --text: #16181d;
  --muted: #5b6470;
  --accent: #ff5a1f;
  --accent-text: #ffffff;
  --border: #e2e6ea;
  --shadow: 0 8px 30px rgba(0,0,0,.08);
  --radius: 16px;
}
[data-theme="dark"] {
  --bg: #0f1115;
  --bg-alt: #171a21;
  --text: #f2f4f7;
  --muted: #9aa3af;
  --accent: #ff6a33;
  --accent-text: #0f1115;
  --border: #262b34;
  --shadow: 0 8px 30px rgba(0,0,0,.4);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  background: var(--bg); color: var(--text);
  transition: background .3s, color .3s; line-height: 1.6;
}
.site-header {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; gap: 24px;
  padding: 14px 24px; background: var(--bg);
  border-bottom: 1px solid var(--border);
}
.logo { font-weight: 800; font-size: 22px; text-decoration: none; color: var(--text); }
.logo span { color: var(--accent); }
.nav { display: flex; gap: 18px; margin-left: auto; }
.nav a { text-decoration: none; color: var(--muted); font-weight: 500; }
.nav a:hover { color: var(--accent); }
.theme-toggle {
  background: var(--bg-alt); border: 1px solid var(--border);
  border-radius: 999px; width: 40px; height: 40px; cursor: pointer; font-size: 18px;
}
.section { max-width: 1100px; margin: 0 auto; padding: 80px 24px; }
.hero { text-align: center; }
.site-footer { padding: 32px 24px; text-align: center; color: var(--muted); border-top: 1px solid var(--border); }
@media (max-width: 720px) {
  .nav { display: none; }
  .section { padding: 56px 16px; }
}
```

- [ ] **Step 4: Проверить визуально**

Открыть `index.html` в браузере. Ожидаемо: видна шапка с навигацией и кнопкой темы, пустые секции, футер с контактами. Ошибок в консоли нет.

- [ ] **Step 5: Commit**

```bash
git add index.html css/styles.css .gitignore
git commit -m "feat: каркас страницы и базовая темизация"
```

---

### Task 2: Данные клуба и переключатель темы

**Files:**
- Create: `js/data.js`
- Create: `js/theme.js`

**Interfaces:**
- Consumes: `#theme-toggle`, атрибут `data-theme` на `<html>` из Task 1.
- Produces: глобальный объект `window.CLUB_DATA` с полями `prices` (массив `{name, price, note}`), `coaches` (массив `{name, role, schedule}`), `advantages` (массив `{icon, title, text}`). Тема сохраняется в `localStorage` под ключом `drive-theme`.

- [ ] **Step 1: Создать `js/data.js` с данными клуба (плейсхолдеры — заменить реальными)**

```javascript
// ВНИМАНИЕ: данные-плейсхолдеры. Заменить реальными цифрами/именами от клуба.
window.CLUB_DATA = {
  advantages: [
    { icon: "🎯", title: "2 профессиональных корта", text: "Современное покрытие и освещение." },
    { icon: "🎽", title: "Прокат инвентаря", text: "Ракетки, мячи, обувь — всё на месте." },
    { icon: "🧑‍🏫", title: "Опытные тренеры", text: "Индивидуальные и групповые тренировки." },
    { icon: "🚿", title: "Раздевалки и душ", text: "Комфорт после игры." }
  ],
  prices: [
    { name: "Аренда корта (час)", price: "от 800 ₽", note: "В зависимости от времени" },
    { name: "Индивидуальная тренировка", price: "1 500 ₽", note: "60 минут с тренером" },
    { name: "Групповая тренировка", price: "700 ₽", note: "До 4 человек" },
    { name: "Бесплатная пробная", price: "0 ₽", note: "Суббота 11:00–12:00" }
  ],
  coaches: [
    { name: "Имя тренера", role: "Старший тренер", schedule: "Пн, Ср, Пт 18:00" },
    { name: "Имя тренера", role: "Тренер", schedule: "Вт, Чт 19:00" }
  ]
};
```

- [ ] **Step 2: Создать `js/theme.js`**

```javascript
(function () {
  var KEY = "drive-theme";
  var root = document.documentElement;
  var btn = document.getElementById("theme-toggle");
  var saved = localStorage.getItem(KEY);
  if (saved) root.setAttribute("data-theme", saved);
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
```

- [ ] **Step 3: Проверить визуально**

Открыть страницу, нажать кнопку темы. Ожидаемо: цвета переключаются light↔dark, иконка меняется ☀️/🌙, после перезагрузки тема сохраняется.

- [ ] **Step 4: Commit**

```bash
git add js/data.js js/theme.js
git commit -m "feat: данные клуба и переключатель темы"
```

---

### Task 3: Контентные секции (hero, преимущества, цены, тренеры, контакты)

**Files:**
- Modify: `index.html` (наполнить секции)
- Create: `js/render.js`
- Modify: `index.html` (подключить `js/render.js` перед `booking.js`)
- Modify: `css/styles.css` (стили карточек)

**Interfaces:**
- Consumes: `window.CLUB_DATA` из Task 2; контейнеры секций по `id` из Task 1.
- Produces: заполненные секции hero/advantages/prices/coaches/contacts. Функция `renderList(containerId, items, htmlFn)` доступна как `window.renderList` для переиспользования.

- [ ] **Step 1: Наполнить hero и contacts статической разметкой в `index.html`**

Заменить `<section id="hero" ...></section>` на:

```html
<section id="hero" class="section hero">
  <h1>Сквош-клуб «Драйв»</h1>
  <p class="hero-sub">Белгород, ул. Чехова, 2А. 2 корта, прокат, тренеры. Играй уже сегодня.</p>
  <div class="hero-actions">
    <a href="#booking" class="btn btn-primary">Записаться онлайн</a>
    <a href="#booking" class="btn btn-ghost">Бесплатная пробная (сб 11:00)</a>
  </div>
</section>
```

Заменить `<section id="contacts" ...></section>` на:

```html
<section id="contacts" class="section">
  <h2>Контакты</h2>
  <p>📍 г. Белгород, ул. Чехова, 2А</p>
  <p>📞 <a href="tel:+79192270237">+7 (919) 227-02-37</a></p>
  <p>💬 <a href="https://vk.com/club145913352" target="_blank" rel="noopener">Сообщество ВКонтакте</a></p>
  <p>🕐 Ежедневно. Бесплатная пробная — суббота 11:00–12:00.</p>
</section>
```

- [ ] **Step 2: Создать `js/render.js`**

```javascript
window.renderList = function (containerId, items, htmlFn) {
  var el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = items.map(htmlFn).join("");
};

(function () {
  var d = window.CLUB_DATA;
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
```

- [ ] **Step 3: Подключить `js/render.js` в `index.html`**

В блоке скриптов добавить после `js/data.js` и до `js/booking.js`:

```html
  <script src="js/data.js"></script>
  <script src="js/theme.js"></script>
  <script src="js/render.js"></script>
  <script src="js/animations.js"></script>
  <script src="js/booking.js"></script>
  <script src="js/rating.js"></script>
```

- [ ] **Step 4: Добавить стили карточек и кнопок в `css/styles.css`**

```css
h1 { font-size: clamp(32px, 6vw, 56px); margin-bottom: 16px; }
h2 { font-size: clamp(26px, 4vw, 36px); margin-bottom: 28px; }
.hero-sub { font-size: 20px; color: var(--muted); margin-bottom: 28px; }
.hero-actions { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
.btn { display: inline-block; padding: 14px 26px; border-radius: var(--radius); font-weight: 700; text-decoration: none; cursor: pointer; border: 1px solid transparent; }
.btn-primary { background: var(--accent); color: var(--accent-text); }
.btn-ghost { background: transparent; color: var(--text); border-color: var(--border); }
.cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px; }
.card { background: var(--bg-alt); border: 1px solid var(--border); border-radius: var(--radius); padding: 24px; box-shadow: var(--shadow); }
.card-icon { font-size: 32px; margin-bottom: 8px; }
.card h3 { margin-bottom: 8px; }
.price { font-size: 28px; font-weight: 800; color: var(--accent); margin: 8px 0; }
.muted { color: var(--muted); }
```

- [ ] **Step 5: Проверить визуально**

Открыть страницу. Ожидаемо: hero с заголовком и двумя кнопками; секции «Почему Драйв», «Цены», «Тренеры» — карточками сеткой; контакты с кликабельным телефоном и ВК. Тёмная тема корректно красит карточки.

- [ ] **Step 6: Commit**

```bash
git add index.html js/render.js css/styles.css
git commit -m "feat: контентные секции hero/преимущества/цены/тренеры/контакты"
```

---

### Task 4: Анимации появления секций

**Files:**
- Create: `js/animations.js`
- Modify: `css/styles.css` (классы анимации)

**Interfaces:**
- Consumes: элементы `.section` из Task 1.
- Produces: секции плавно появляются при прокрутке (класс `.in-view` добавляется через IntersectionObserver).

- [ ] **Step 1: Добавить CSS анимации в `css/styles.css`**

```css
.section { opacity: 0; transform: translateY(24px); transition: opacity .6s ease, transform .6s ease; }
.section.in-view { opacity: 1; transform: none; }
@media (prefers-reduced-motion: reduce) {
  .section { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 2: Создать `js/animations.js`**

```javascript
(function () {
  var sections = document.querySelectorAll(".section");
  if (!("IntersectionObserver" in window)) {
    sections.forEach(function (s) { s.classList.add("in-view"); });
    return;
  }
  var obs = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add("in-view"); obs.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  sections.forEach(function (s) { obs.observe(s); });
})();
```

- [ ] **Step 3: Проверить визуально**

Прокрутить страницу. Ожидаемо: секции плавно «выезжают» снизу при появлении в зоне видимости. При включённом «уменьшении движения» в ОС анимаций нет, контент виден сразу.

- [ ] **Step 4: Commit**

```bash
git add js/animations.js css/styles.css
git commit -m "feat: анимации появления секций при прокрутке"
```

---

### Task 5: Бэкенд брони — отправка в Telegram (PHP)

**Files:**
- Create: `api/config.example.php`
- Create: `api/telegram.php`
- Create: `api/booking.php`

**Interfaces:**
- Consumes: ничего из фронтенда (вызывается по HTTP POST).
- Produces: эндпоинт `POST api/booking.php`, принимает JSON `{name, phone, date, time, court, coach}`, возвращает JSON `{ok: true}` или `{ok: false, error: "..."}` с HTTP-кодом. Функция `sendTelegram($text): bool` в `api/telegram.php`. Константы `TG_TOKEN`, `TG_CHAT_ID` в `api/config.php`.

- [ ] **Step 1: Создать `api/config.example.php`**

```php
<?php
// Скопировать в api/config.php и заполнить реальными значениями.
// config.php в .gitignore — не коммитить.
define('TG_TOKEN', 'PASTE_BOT_TOKEN_HERE');   // от @BotFather
define('TG_CHAT_ID', 'PASTE_ADMIN_CHAT_ID');  // id чата админа
// Данные БД (для рейтинга, Task 7):
define('DB_HOST', 'localhost');
define('DB_NAME', 'squash');
define('DB_USER', 'root');
define('DB_PASS', '');
```

- [ ] **Step 2: Создать `api/telegram.php`**

```php
<?php
require_once __DIR__ . '/config.php';

function sendTelegram($text) {
    $url = 'https://api.telegram.org/bot' . TG_TOKEN . '/sendMessage';
    $payload = http_build_query([
        'chat_id' => TG_CHAT_ID,
        'text' => $text,
        'parse_mode' => 'HTML',
    ]);
    $ctx = stream_context_create([
        'http' => [
            'method' => 'POST',
            'header' => 'Content-Type: application/x-www-form-urlencoded',
            'content' => $payload,
            'timeout' => 10,
        ],
    ]);
    $res = @file_get_contents($url, false, $ctx);
    if ($res === false) return false;
    $data = json_decode($res, true);
    return isset($data['ok']) && $data['ok'] === true;
}
```

- [ ] **Step 3: Создать `api/booking.php`**

```php
<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/telegram.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['ok' => false, 'error' => 'Метод не поддерживается']);
    exit;
}

$raw = file_get_contents('php://input');
$in = json_decode($raw, true);
if (!is_array($in)) {
    http_response_code(400);
    echo json_encode(['ok' => false, 'error' => 'Некорректные данные']);
    exit;
}

function clean($s) { return trim(strip_tags((string)($s ?? ''))); }

$name  = clean($in['name'] ?? '');
$phone = clean($in['phone'] ?? '');
$date  = clean($in['date'] ?? '');
$time  = clean($in['time'] ?? '');
$court = clean($in['court'] ?? '');
$coach = clean($in['coach'] ?? '');

$digits = preg_replace('/\D/', '', $phone);
if ($name === '' || strlen($digits) < 10) {
    http_response_code(422);
    echo json_encode(['ok' => false, 'error' => 'Укажите имя и корректный телефон']);
    exit;
}

$text = "🎾 <b>Новая заявка на бронь</b>\n"
    . "Имя: " . htmlspecialchars($name) . "\n"
    . "Телефон: " . htmlspecialchars($phone) . "\n"
    . "Дата: " . htmlspecialchars($date) . "\n"
    . "Время: " . htmlspecialchars($time) . "\n"
    . "Корт: " . htmlspecialchars($court) . "\n"
    . "Тренер: " . htmlspecialchars($coach !== '' ? $coach : 'без тренера');

$sent = sendTelegram($text);
if (!$sent) {
    // не теряем заявку — пишем в лог
    @file_put_contents(__DIR__ . '/booking.log', date('c') . " " . $raw . "\n", FILE_APPEND);
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Не удалось отправить. Позвоните: +7 (919) 227-02-37']);
    exit;
}

echo json_encode(['ok' => true]);
```

- [ ] **Step 4: Проверить синтаксис PHP**

Run: `php -l api/booking.php && php -l api/telegram.php`
Expected: `No syntax errors detected` для обоих файлов. (Если `php` не установлен локально — пропустить, проверить на хостинге.)

- [ ] **Step 5: Commit**

```bash
git add api/config.example.php api/telegram.php api/booking.php
git commit -m "feat: PHP-бэкенд приёма заявки и отправки в Telegram"
```

---

### Task 6: Интерактивный календарь брони (фронтенд)

**Files:**
- Modify: `index.html` (наполнить секцию booking)
- Create: `js/booking.js`
- Modify: `css/styles.css` (стили формы брони)

**Interfaces:**
- Consumes: эндпоинт `POST api/booking.php` из Task 5; `window.CLUB_DATA.coaches` для списка тренеров.
- Produces: рабочая форма брони в секции `#booking`, отправляющая JSON на бэкенд и показывающая результат.

- [ ] **Step 1: Наполнить секцию booking в `index.html`**

Заменить `<section id="booking" ...></section>` на:

```html
<section id="booking" class="section">
  <h2>Онлайн-запись</h2>
  <p class="muted">Выберите дату, время и корт — заявка моментально уйдёт администратору. Подтвердим по телефону.</p>
  <form id="booking-form" class="booking-form" novalidate>
    <div class="field">
      <label>Дата</label>
      <input type="date" name="date" required>
    </div>
    <div class="field">
      <label>Время</label>
      <select name="time" required>
        <option value="">—</option>
      </select>
    </div>
    <div class="field">
      <label>Корт</label>
      <select name="court" required>
        <option value="Корт 1">Корт 1</option>
        <option value="Корт 2">Корт 2</option>
      </select>
    </div>
    <div class="field">
      <label>Тренер (необязательно)</label>
      <select name="coach">
        <option value="">Без тренера</option>
      </select>
    </div>
    <div class="field">
      <label>Имя</label>
      <input type="text" name="name" required placeholder="Как к вам обращаться">
    </div>
    <div class="field">
      <label>Телефон</label>
      <input type="tel" name="phone" required placeholder="+7 (___) ___-__-__">
    </div>
    <button type="submit" class="btn btn-primary">Отправить заявку</button>
    <p id="booking-msg" class="booking-msg" role="status"></p>
  </form>
</section>
```

- [ ] **Step 2: Создать `js/booking.js`**

```javascript
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
```

- [ ] **Step 3: Добавить стили формы в `css/styles.css`**

```css
.booking-form { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; max-width: 640px; }
.booking-form .field { display: flex; flex-direction: column; gap: 6px; }
.booking-form label { font-size: 14px; color: var(--muted); }
.booking-form input, .booking-form select {
  padding: 12px 14px; border-radius: 12px; border: 1px solid var(--border);
  background: var(--bg); color: var(--text); font-size: 15px;
}
.booking-form button[type="submit"] { grid-column: 1 / -1; }
.booking-msg { grid-column: 1 / -1; margin: 0; font-weight: 600; }
.booking-msg.ok { color: #1a9c5b; }
.booking-msg.err { color: #d33; }
@media (max-width: 560px) { .booking-form { grid-template-columns: 1fr; } }
```

- [ ] **Step 4: Проверить визуально и логику валидации**

Открыть страницу. Ожидаемо: форма с полями дата/время/корт/тренер/имя/телефон. При пустом имени/телефоне и клике «Отправить» — красное сообщение об ошибке, запрос не уходит. (Полная проверка отправки — в Task 8 после настройки бота.)

- [ ] **Step 5: Commit**

```bash
git add index.html js/booking.js css/styles.css
git commit -m "feat: интерактивная форма брони с валидацией и отправкой"
```

---

### Task 7: Рейтинг и турниры (MySQL + PHP + фронтенд)

**Files:**
- Create: `db/schema.sql`
- Create: `api/db.php`
- Create: `api/rating.php`
- Modify: `index.html` (наполнить секцию rating)
- Create: `js/rating.js`
- Modify: `css/styles.css` (стили таблицы)

**Interfaces:**
- Consumes: константы БД из `api/config.php` (Task 5); секция `#rating` из Task 1.
- Produces: эндпоинт `GET api/rating.php` → JSON `{players: [{rank, name, points, wins, losses}], tournaments: [{title, date, status}]}`. Таблица рейтинга и список турниров в секции `#rating`.

- [ ] **Step 1: Создать `db/schema.sql`**

```sql
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  points INT NOT NULL DEFAULT 0,
  wins INT NOT NULL DEFAULT 0,
  losses INT NOT NULL DEFAULT 0
) DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tournaments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  event_date DATE NULL,
  status VARCHAR(40) NOT NULL DEFAULT 'анонс'
) DEFAULT CHARSET=utf8mb4;

-- Тестовые данные
INSERT INTO players (name, points, wins, losses) VALUES
  ('Игрок А', 120, 12, 3),
  ('Игрок Б', 95, 9, 5),
  ('Игрок В', 80, 7, 6);

INSERT INTO tournaments (title, event_date, status) VALUES
  ('Открытый турнир «Драйв»', '2026-07-12', 'анонс'),
  ('Кубок Белгородской области', '2026-05-18', 'завершён');
```

- [ ] **Step 2: Создать `api/db.php`**

```php
<?php
require_once __DIR__ . '/config.php';

function db() {
    static $conn = null;
    if ($conn === null) {
        $conn = @new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_errno) return null;
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}
```

- [ ] **Step 3: Создать `api/rating.php`**

```php
<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/db.php';

$conn = db();
if (!$conn) {
    echo json_encode(['players' => [], 'tournaments' => [], 'error' => 'db']);
    exit;
}

$players = [];
$rank = 1;
$res = $conn->query("SELECT name, points, wins, losses FROM players ORDER BY points DESC, wins DESC");
if ($res) {
    while ($row = $res->fetch_assoc()) {
        $players[] = [
            'rank' => $rank++,
            'name' => $row['name'],
            'points' => (int)$row['points'],
            'wins' => (int)$row['wins'],
            'losses' => (int)$row['losses'],
        ];
    }
}

$tournaments = [];
$res2 = $conn->query("SELECT title, event_date, status FROM tournaments ORDER BY event_date DESC");
if ($res2) {
    while ($row = $res2->fetch_assoc()) {
        $tournaments[] = [
            'title' => $row['title'],
            'date' => $row['event_date'],
            'status' => $row['status'],
        ];
    }
}

echo json_encode(['players' => $players, 'tournaments' => $tournaments]);
```

- [ ] **Step 4: Наполнить секцию rating в `index.html`**

Заменить `<section id="rating" ...></section>` на:

```html
<section id="rating" class="section">
  <h2>Рейтинг игроков</h2>
  <p class="muted">Турнирная таблица клуба. Поднимайся в рейтинге, выигрывая матчи.</p>
  <div id="rating-table"></div>
  <h3 class="tour-title">Турниры</h3>
  <div id="tournaments-list" class="cards"></div>
</section>
```

- [ ] **Step 5: Создать `js/rating.js`**

```javascript
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
```

- [ ] **Step 6: Добавить стили таблицы в `css/styles.css`**

```css
.rating { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
.rating th, .rating td { padding: 12px 14px; text-align: left; border-bottom: 1px solid var(--border); }
.rating th { color: var(--muted); font-weight: 600; }
.rating tbody tr:hover { background: var(--bg-alt); }
.tour-title { margin: 24px 0 16px; }
```

- [ ] **Step 7: Проверить логику без БД**

Открыть страницу (без настроенной БД). Ожидаемо: секция «Рейтинг игроков» показывает заглушки «Рейтинг скоро появится» / «Турниры скоро анонсируем», страница не падает. (Полная проверка с данными — после настройки MySQL на хостинге.)

- [ ] **Step 8: Подключить `js/rating.js` (уже в index.html из Task 1) — проверить порядок**

Убедиться, что `js/rating.js` присутствует в конце `<body>`. Если нет — добавить последним.

- [ ] **Step 9: Commit**

```bash
git add db/schema.sql api/db.php api/rating.php index.html js/rating.js css/styles.css
git commit -m "feat: рейтинг игроков и турниры (MySQL + PHP + фронт)"
```

---

### Task 8: Документация развёртывания и финальная проверка

**Files:**
- Create: `README.md`

**Interfaces:**
- Consumes: всё предыдущее.
- Produces: инструкция по развёртыванию на RuCenter, созданию Telegram-бота, наполнению рейтинга.

- [ ] **Step 1: Создать `README.md`**

````markdown
# Сайт сквош-клуба «Драйв»

Статический фронтенд + PHP-бэкенд (заявки в Telegram) + MySQL (рейтинг).

## Настройка Telegram-бота
1. В Telegram написать @BotFather → `/newbot`, задать имя → получить **токен**.
2. Создать бота-получателя: написать своему боту любое сообщение.
3. Узнать свой **chat_id**: открыть `https://api.telegram.org/bot<ТОКЕН>/getUpdates`
   после отправки сообщения боту — найти `"chat":{"id":...}`.

## Развёртывание на RuCenter
1. Скопировать `api/config.example.php` → `api/config.php`, вписать `TG_TOKEN`,
   `TG_CHAT_ID` и доступы к БД.
2. Загрузить все файлы в корень сайта через файловый менеджер/FTP.
3. Создать БД MySQL в панели, импортировать `db/schema.sql`.
4. Прописать доступы к БД в `api/config.php`.
5. Проверить, что `api/config.php` НЕ доступен публично и не в git.

## Наполнение данными
- Цены/тренеры/преимущества — `js/data.js`.
- Рейтинг/турниры — таблицы `players`, `tournaments` в MySQL (правка через
  phpMyAdmin в панели хостинга).
````

- [ ] **Step 2: Финальная сквозная проверка (чек-лист)**

Открыть сайт и проверить:
- Переключение темы работает и сохраняется.
- Все секции на месте, карточки и контакты заполнены.
- Анимации появления работают.
- Форма брони валидирует пустые поля.
- Секция рейтинга показывает данные или корректные заглушки.
- Адаптив: на ширине ~375px нет горизонтального скролла, форма в один столбец.

- [ ] **Step 3: Commit**

```bash
git add README.md
git commit -m "docs: инструкция по развёртыванию и наполнению"
```

---

## Notes для исполнителя

- Реальные данные (цены, тренеры, фото, логотип) заменяют плейсхолдеры в `js/data.js` и `index.html` — это отдельный проход после получения от владельца.
- Полная проверка отправки в Telegram и работы MySQL выполняется на хостинге RuCenter (локально может не быть PHP/MySQL).
- Фото/галерея в этом плане — заглушка-секция; наполнение реальными изображениями добавим, когда будут файлы.
