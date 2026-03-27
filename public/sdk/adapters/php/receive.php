<?php
/**
 * Keystroke Tracker - PHP Backend Receiver
 *
 * A simple endpoint to receive and store keystroke tracking data.
 * Validates the incoming JSON and saves it to a file or database.
 *
 * Usage:
 *   POST /receive.php
 *   Content-Type: application/json
 *   Body: { "keypresses": 42, "pastes": 1, ... }
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit;
}

$input = file_get_contents('php://input');
$data = json_decode($input, true);

if ($data === null) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid JSON']);
    exit;
}

// Validate required fields
$required = ['keypresses', 'pastes', 'copies', 'keystroke_order', 'text'];
foreach ($required as $field) {
    if (!array_key_exists($field, $data)) {
        http_response_code(400);
        echo json_encode(['error' => "Missing required field: $field"]);
        exit;
    }
}

// Add server-side metadata
$record = [
    'received_at' => date('c'),
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'data' => $data
];

// Option 1: Save to a JSON file (one record per line)
$logFile = __DIR__ . '/keystroke_log.jsonl';
file_put_contents($logFile, json_encode($record) . "\n", FILE_APPEND | LOCK_EX);

// Option 2: Save to database (uncomment and configure)
// $pdo = new PDO('mysql:host=localhost;dbname=survey', 'user', 'pass');
// $stmt = $pdo->prepare('INSERT INTO keystroke_data (data, received_at) VALUES (?, NOW())');
// $stmt->execute([json_encode($data)]);

http_response_code(200);
echo json_encode(['status' => 'ok', 'received' => count($data['keystroke_order']) . ' events']);
