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
