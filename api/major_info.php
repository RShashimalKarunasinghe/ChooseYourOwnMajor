<?php
// api/major_info.php
// GET /api/major_info.php        -> list majors and result descriptions
// POST /api/major_info.php       -> create a major
// PUT /api/major_info.php?code=cs -> update one major's descriptions
// DELETE /api/major_info.php?code=cs -> remove a major

require_once __DIR__ . '/db.php';

$defaults = [
    'cs' => ['Computer Science', 'You may enjoy roles such as computer scientist, systems analyst, research developer, or algorithm-focused engineer.', 'Your answers show strong interest in logical reasoning, complex technical problem-solving, and computational thinking.', 'Computer Science focuses on algorithms, programming concepts, systems thinking, and solving technical problems at a deeper level.'],
    'se' => ['Software Development', 'You may enjoy roles such as software developer, web developer, mobile app developer, or application engineer.', 'Your answers show strong interest in building applications, designing practical solutions, and creating digital products for users.', 'Software Development focuses on designing, building, testing, and improving applications, websites, and digital systems.'],
    'cyber' => ['Cyber Security', 'You may enjoy roles such as cyber security analyst, security consultant, penetration tester, or security operations specialist.', 'Your answers show strong interest in protecting systems, managing risks, and identifying digital threats and vulnerabilities.', 'Cyber Security focuses on defending systems, networks, and data against cyber threats and improving digital safety.'],
    'ds' => ['Data Science', 'You may enjoy roles such as data analyst, data specialist, business intelligence analyst, or insight-driven technical professional.', 'Your answers show strong interest in patterns, data interpretation, and using information to support understanding and decisions.', 'Data Science focuses on analysing data, finding trends, visualising results, and supporting data-driven decision-making.'],
];

function ensureMajorInfoTable(PDO $db, array $defaults): void {
    $db->exec('CREATE TABLE IF NOT EXISTS major_info (
        code VARCHAR(20) PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        careers TEXT NOT NULL,
        result_reason TEXT NOT NULL,
        explore_text TEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )');
    $stmt = $db->prepare('INSERT IGNORE INTO major_info (code, title, careers, result_reason, explore_text) VALUES (?, ?, ?, ?, ?)');
    foreach ($defaults as $code => $values) {
        $stmt->execute([$code, ...$values]);
    }
    try { $db->exec("ALTER TABLE major_info ADD COLUMN personality_tag VARCHAR(100) NOT NULL DEFAULT ''"); } catch (Throwable $e) {}
    try { $db->exec('ALTER TABLE major_info ADD COLUMN sort_order INT NOT NULL DEFAULT 0'); } catch (Throwable $e) {}
}

try {
    $db = getDB();
    ensureMajorInfoTable($db, $defaults);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $rows = $db->query("SELECT code, title, careers, result_reason, explore_text, personality_tag FROM major_info ORDER BY sort_order, code")->fetchAll();
        echo json_encode(array_map(fn($row) => [
            'code' => $row['code'],
            'title' => $row['title'],
            'careers' => $row['careers'],
            'resultReason' => $row['result_reason'],
            'exploreText' => $row['explore_text'],
            'personalityTag' => $row['personality_tag'] ?: $row['title'],
        ], $rows));
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        $body = json_decode(file_get_contents('php://input'), true) ?: [];
        $code = strtolower(trim($body['code'] ?? ''));
        $title = trim($body['title'] ?? '');
        $careers = trim($body['careers'] ?? '');
        $resultReason = trim($body['resultReason'] ?? '');
        $exploreText = trim($body['exploreText'] ?? '');
        $personalityTag = trim($body['personalityTag'] ?? '') ?: $title;
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $code) || !$title || !$careers || !$resultReason || !$exploreText) {
            http_response_code(400);
            echo json_encode(['error' => 'code, title, and all result descriptions are required']);
            exit;
        }
        $sortOrder = (int) $db->query('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM major_info')->fetchColumn();
        $stmt = $db->prepare('INSERT INTO major_info (code, title, careers, result_reason, explore_text, personality_tag, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$code, $title, $careers, $resultReason, $exploreText, $personalityTag, $sortOrder]);
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $code = $_GET['code'] ?? '';
        $body = json_decode(file_get_contents('php://input'), true);
        if (!$code || empty($body['careers']) || empty($body['resultReason']) || empty($body['exploreText'])) {
            http_response_code(400);
            echo json_encode(['error' => 'code and all result descriptions are required']);
            exit;
        }

        if (array_key_exists('title', $body) || array_key_exists('personalityTag', $body)) {
            $current = $db->prepare('SELECT title, personality_tag FROM major_info WHERE code = ?');
            $current->execute([$code]);
            $existing = $current->fetch() ?: ['title' => $code, 'personality_tag' => $code];
            $stmt = $db->prepare('UPDATE major_info SET title = ?, careers = ?, result_reason = ?, explore_text = ?, personality_tag = ? WHERE code = ?');
            $stmt->execute([$body['title'] ?? $existing['title'], $body['careers'], $body['resultReason'], $body['exploreText'], $body['personalityTag'] ?? $existing['personality_tag'], $code]);
        } else {
            $stmt = $db->prepare('UPDATE major_info SET careers = ?, result_reason = ?, explore_text = ? WHERE code = ?');
            $stmt->execute([$body['careers'], $body['resultReason'], $body['exploreText'], $code]);
        }
        echo json_encode(['ok' => true]);
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
        $code = strtolower(trim($_GET['code'] ?? ''));
        $count = (int) $db->query('SELECT COUNT(*) FROM major_info')->fetchColumn();
        if (!$code || $count <= 2) {
            http_response_code(400);
            echo json_encode(['error' => 'At least two majors must remain']);
            exit;
        }
        $stmt = $db->prepare('DELETE FROM major_info WHERE code = ?');
        $stmt->execute([$code]);
        echo json_encode(['ok' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}