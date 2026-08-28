<?php
// api/records.php
// GET    /api/records.php            → list all records (newest first)
// POST   /api/records.php            → save a new record
// DELETE /api/records.php            → clear all records

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    $db = getDB();

    // GET — list all records
    if ($method === 'GET') {
        $rows = $db->query(
            'SELECT * FROM records ORDER BY submitted_at DESC'
        )->fetchAll();

        $records = array_map(fn($r) => [
            'id'               => (int) $r['id'],
            'date'             => $r['submitted_at'],
            'topMajor'         => $r['top_major'],
            'topMajorTitle'    => $r['top_major_title'],
            'matchPercent'     => (int) $r['match_percent'],
            'secondMajor'      => $r['second_major'],
            'secondMajorTitle' => $r['second_major_title'],
            'secondPercent'    => (int) $r['second_percent'],
            'answers'          => json_decode($r['answers_json'], true),
            'totals'           => json_decode($r['totals_json'],  true),
        ], $rows);

        echo json_encode($records);
        exit;
    }

    // POST — save a record
    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);

        $required = ['topMajor','topMajorTitle','matchPercent','secondMajor','secondMajorTitle','secondPercent','answers','totals'];
        foreach ($required as $key) {
            if (!isset($body[$key])) {
                http_response_code(400);
                echo json_encode(['error' => "Missing field: $key"]);
                exit;
            }
        }

        $stmt = $db->prepare(
            'INSERT INTO records
               (top_major, top_major_title, match_percent,
                second_major, second_major_title, second_percent,
                answers_json, totals_json)
             VALUES (?,?,?,?,?,?,?,?)'
        );
        $stmt->execute([
            $body['topMajor'],
            $body['topMajorTitle'],
            (int) $body['matchPercent'],
            $body['secondMajor'],
            $body['secondMajorTitle'],
            (int) $body['secondPercent'],
            json_encode($body['answers']),
            json_encode($body['totals']),
        ]);

        echo json_encode(['ok' => true, 'id' => (int) $db->lastInsertId()]);
        exit;
    }

    // DELETE — clear all records
    if ($method === 'DELETE') {
        $db->exec('DELETE FROM records');
        echo json_encode(['ok' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
