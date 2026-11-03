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

/**
 * Clean up a QR link typed by an admin. Returns '' (no link), a normalised
 * http(s) URL, or null if it is not a valid web link.
 */
function normaliseQrLink($value): ?string {
    $value = trim((string) $value);
    if ($value === '') return '';
    if (strlen($value) > 500) return null;
    if (!preg_match('#^[a-z][a-z0-9+.-]*:#i', $value)) $value = 'https://' . $value;
    if (!filter_var($value, FILTER_VALIDATE_URL)) return null;
    $scheme = strtolower((string) parse_url($value, PHP_URL_SCHEME));
    return in_array($scheme, ['http', 'https'], true) ? $value : null;
}

/**
 * Clean up a list of related courses/minors: [ { name, url } ].
 * Returns the cleaned array (url may be ''), or null if the input is invalid.
 */
function cleanRelatedCourses($value): ?array {
    if (!is_array($value) || count($value) > 12) return null;
    $clean = [];
    foreach ($value as $item) {
        if (!is_array($item)) return null;
        $name = trim((string) ($item['name'] ?? ''));
        if ($name === '') continue;                      // ignore empty rows
        if (mb_strlen($name) > 100) return null;
        $url = normaliseQrLink($item['url'] ?? '');      // same rules as the QR link
        if ($url === null) return null;
        $clean[] = ['name' => $name, 'url' => $url];
    }
    return $clean;
}

// Starter related courses (used to fill the column on databases created before it existed)
const DEFAULT_RELATED_COURSES = [
    'cs'    => ['Artificial Intelligence', 'Mathematics', 'Computational Physics'],
    'se'    => ['UX/UI Interaction Design', 'Games Development', 'Digital Media'],
    'cyber' => ['Criminology', 'Digital Forensics', 'Network Engineering'],
    'ds'    => ['Data Analytics', 'Statistics', 'Financial Technology'],
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
    try { $db->exec("ALTER TABLE major_info ADD COLUMN qr_link VARCHAR(500) NOT NULL DEFAULT ''"); } catch (Throwable $e) {}
    try { $db->exec('ALTER TABLE major_info ADD COLUMN related_courses TEXT NULL'); } catch (Throwable $e) {}
    // Only rows that have never had a list (NULL) get the starter courses; an admin who
    // clears the list saves '[]', which is left alone.
    $fill = $db->prepare('UPDATE major_info SET related_courses = ? WHERE code = ? AND related_courses IS NULL');
    foreach (DEFAULT_RELATED_COURSES as $code => $names) {
        $fill->execute([json_encode(array_map(fn($n) => ['name' => $n, 'url' => ''], $names), JSON_UNESCAPED_UNICODE), $code]);
    }
}

try {
    // Anyone can read result text; only admins can add, edit or remove majors.
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') requireAdminApi();

    $db = getDB();
    ensureMajorInfoTable($db, $defaults);

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $rows = $db->query("SELECT code, title, careers, result_reason, explore_text, personality_tag, qr_link, related_courses FROM major_info ORDER BY sort_order, code")->fetchAll();
        echo json_encode(array_map(fn($row) => [
            'code' => $row['code'],
            'title' => $row['title'],
            'careers' => $row['careers'],
            'resultReason' => $row['result_reason'],
            'exploreText' => $row['explore_text'],
            'personalityTag' => $row['personality_tag'] ?: $row['title'],
            'qrLink' => $row['qr_link'],
            'relatedCourses' => json_decode($row['related_courses'] ?? '[]', true) ?: [],
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
        $qrLink = normaliseQrLink($body['qrLink'] ?? '');
        if ($qrLink === null) {
            http_response_code(400);
            echo json_encode(['error' => 'The QR link must be a valid web address (http or https)']);
            exit;
        }
        if (!preg_match('/^[a-z0-9]+(?:-[a-z0-9]+)*$/', $code) || !$title || !$careers || !$resultReason || !$exploreText) {
            http_response_code(400);
            echo json_encode(['error' => 'code, title, and all result descriptions are required']);
            exit;
        }
        $related = array_key_exists('relatedCourses', $body) ? cleanRelatedCourses($body['relatedCourses']) : [];
        if ($related === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Related courses need a name and, optionally, a valid web link']);
            exit;
        }
        $sortOrder = (int) $db->query('SELECT COALESCE(MAX(sort_order), 0) + 1 FROM major_info')->fetchColumn();
        $stmt = $db->prepare('INSERT INTO major_info (code, title, careers, result_reason, explore_text, personality_tag, sort_order, qr_link, related_courses) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        $stmt->execute([$code, $title, $careers, $resultReason, $exploreText, $personalityTag, $sortOrder, $qrLink, json_encode($related, JSON_UNESCAPED_UNICODE)]);
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

        // Optional QR link: '' removes it, a web address sets it, absent leaves it unchanged.
        $qrLink = array_key_exists('qrLink', $body) ? normaliseQrLink($body['qrLink']) : false;
        if ($qrLink === null) {
            http_response_code(400);
            echo json_encode(['error' => 'The QR link must be a valid web address (http or https)']);
            exit;
        }

        // Optional related courses: absent leaves them unchanged; an array replaces the list.
        $related = array_key_exists('relatedCourses', $body) ? cleanRelatedCourses($body['relatedCourses']) : false;
        if ($related === null) {
            http_response_code(400);
            echo json_encode(['error' => 'Related courses need a name and, optionally, a valid web link']);
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
        if ($qrLink !== false) {
            $db->prepare('UPDATE major_info SET qr_link = ? WHERE code = ?')->execute([$qrLink, $code]);
        }
        if ($related !== false) {
            $db->prepare('UPDATE major_info SET related_courses = ? WHERE code = ?')
               ->execute([json_encode($related, JSON_UNESCAPED_UNICODE), $code]);
        }
        echo json_encode([
            'ok' => true,
            'qrLink' => $qrLink === false ? null : $qrLink,
            'relatedCourses' => $related === false ? null : $related,
        ]);
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