<?php
// api/major_info.php
// GET /api/major_info.php        -> list result descriptions
// PUT /api/major_info.php?code=cs -> update one major's descriptions

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
}

try {
    $db = getDB();
    ensureMajorInfoTable($db, $defaults);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $rows = $db->query("SELECT code, title, careers, result_reason, explore_text FROM major_info ORDER BY FIELD(code, 'cs', 'se', 'cyber', 'ds')")->fetchAll();
        echo json_encode(array_map(fn($row) => [
            'code' => $row['code'],
            'title' => $row['title'],
            'careers' => $row['careers'],
            'resultReason' => $row['result_reason'],
            'exploreText' => $row['explore_text'],
        ], $rows));
        exit;
    }

    if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
        $code = $_GET['code'] ?? '';
        $body = json_decode(file_get_contents('php://input'), true);
        if (!isset($defaults[$code]) || empty($body['careers']) || empty($body['resultReason']) || empty($body['exploreText'])) {
            http_response_code(400);
            echo json_encode(['error' => 'code and all result descriptions are required']);
            exit;
        }

        $stmt = $db->prepare('UPDATE major_info SET careers = ?, result_reason = ?, explore_text = ? WHERE code = ?');
        $stmt->execute([$body['careers'], $body['resultReason'], $body['exploreText'], $code]);
        echo json_encode(['ok' => true]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}