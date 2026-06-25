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
