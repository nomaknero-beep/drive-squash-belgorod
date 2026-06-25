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
    . "Имя: " . htmlspecialchars($name, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "\n"
    . "Телефон: " . htmlspecialchars($phone, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "\n"
    . "Дата: " . htmlspecialchars($date, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "\n"
    . "Время: " . htmlspecialchars($time, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "\n"
    . "Корт: " . htmlspecialchars($court, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8') . "\n"
    . "Тренер: " . htmlspecialchars($coach !== '' ? $coach : 'без тренера', ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');

$sent = sendTelegram($text);
if (!$sent) {
    // не теряем заявку — пишем в лог
    @file_put_contents(__DIR__ . '/booking.log', date('c') . " " . $raw . "\n", FILE_APPEND);
    http_response_code(502);
    echo json_encode(['ok' => false, 'error' => 'Не удалось отправить. Позвоните: +7 (919) 227-02-37']);
    exit;
}

echo json_encode(['ok' => true]);
