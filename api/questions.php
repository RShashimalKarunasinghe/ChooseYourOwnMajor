<?php
// api/questions.php
// GET    /api/questions.php          → list all questions with options
// POST   /api/questions.php          → create question  { text, options[] }
// PUT    /api/questions.php?id=N     → update question  { text, options[] }
// DELETE /api/questions.php?id=N     → delete question
// POST   /api/questions.php?reset=1  → reset to defaults

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];
$id     = isset($_GET['id'])    ? (int) $_GET['id']    : null;
$reset  = isset($_GET['reset']) && $_GET['reset'] === '1';

// ── helpers ──────────────────────────────────────────────────────────────────

function fetchAllQuestions(PDO $db, bool $showAll = false): array {
    // Add active column if it doesn't exist yet
    try { $db->exec('ALTER TABLE questions ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1'); }
    catch (Throwable $e) {}

    $where = $showAll ? '' : 'WHERE active = 1';
    $questions = $db->query("SELECT * FROM questions $where ORDER BY sort_order, id")->fetchAll();
    if (empty($questions)) return [];

    $opts = $db->query('SELECT * FROM options ORDER BY question_id, option_key')->fetchAll();
    $map  = [];
    foreach ($opts as $opt) {
        $map[$opt['question_id']][] = [
            'key'      => $opt['option_key'],
            'text'     => $opt['option_text'],
            'subtext'  => $opt['subtext'],
            'feedback' => $opt['feedback'],
            'scores'   => array_filter([
                'cs'    => (int) $opt['score_cs'],
                'se'    => (int) $opt['score_se'],
                'cyber' => (int) $opt['score_cyber'],
                'ds'    => (int) $opt['score_ds'],
            ])
        ];
    }

    return array_map(fn($q) => [
        'id'      => (int) $q['id'],
        'text'    => $q['question_text'],
        'options' => $map[$q['id']] ?? [],
    ], $questions);
}

function upsertOptions(PDO $db, int $questionId, array $options): void {
    $db->prepare('DELETE FROM options WHERE question_id = ?')->execute([$questionId]);
    $stmt = $db->prepare(
        'INSERT INTO options
           (question_id, option_key, option_text, subtext, feedback,
            score_cs, score_se, score_cyber, score_ds)
         VALUES (?,?,?,?,?,?,?,?,?)'
    );
    foreach ($options as $opt) {
        $scores = $opt['scores'] ?? [];
        $stmt->execute([
            $questionId,
            $opt['key'],
            $opt['text'],
            $opt['subtext'],
            $opt['feedback'],
            (int) ($scores['cs']    ?? 0),
            (int) ($scores['se']    ?? 0),
            (int) ($scores['cyber'] ?? 0),
            (int) ($scores['ds']    ?? 0),
        ]);
    }
}

// ── routing ──────────────────────────────────────────────────────────────────

try {
    $db = getDB();

    // GET — list questions
    // ?all=1 used by admin tools; default returns only active questions for the quiz
    if ($method === 'GET') {
        $showAll = isset($_GET['all']) && $_GET['all'] === '1';
        echo json_encode(fetchAllQuestions($db, $showAll));
        exit;
    }

    // POST reset
    if ($method === 'POST' && $reset) {
        // Wipe and re-seed using the same SQL from schema.sql (options only —
        // questions rows keep their IDs so foreign keys stay valid).
        $db->exec('DELETE FROM options');
        $db->exec('DELETE FROM questions');
        $db->exec('ALTER TABLE questions AUTO_INCREMENT = 1');

        // Re-run the seed (same data as schema.sql)
        $seed = file_get_contents(__DIR__ . '/../schema.sql');
        // Extract only INSERT statements
        preg_match_all('/INSERT INTO (?:questions|options)[^;]+;/s', $seed, $matches);
        foreach ($matches[0] as $insert) {
            $db->exec($insert);
        }

        echo json_encode(['ok' => true, 'questions' => fetchAllQuestions($db)]);
        exit;
    }

    // POST — create question
    if ($method === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true);
        if (empty($body['text']) || empty($body['options'])) {
            http_response_code(400);
            echo json_encode(['error' => 'text and options are required']);
            exit;
        }

        $count = (int) $db->query('SELECT COUNT(*) FROM questions')->fetchColumn();
        $stmt  = $db->prepare('INSERT INTO questions (question_text, sort_order) VALUES (?, ?)');
        $stmt->execute([$body['text'], $count + 1]);
        $newId = (int) $db->lastInsertId();

        upsertOptions($db, $newId, $body['options']);
        echo json_encode(['ok' => true, 'id' => $newId]);
        exit;
    }

    // PUT — update question
    if ($method === 'PUT' && $id) {
        $body = json_decode(file_get_contents('php://input'), true);
        if (empty($body['text']) || empty($body['options'])) {
            http_response_code(400);
            echo json_encode(['error' => 'text and options are required']);
            exit;
        }

        $db->prepare('UPDATE questions SET question_text = ? WHERE id = ?')
           ->execute([$body['text'], $id]);
        upsertOptions($db, $id, $body['options']);
        echo json_encode(['ok' => true]);
        exit;
    }

    // DELETE — delete question
    if ($method === 'DELETE' && $id) {
        $db->prepare('DELETE FROM questions WHERE id = ?')->execute([$id]);
        echo json_encode(['ok' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);

} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
