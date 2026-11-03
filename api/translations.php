<?php
// api/translations.php
// GET  /api/translations.php?lang=zh  → { "English text": "translated text", ... }   (public)
// POST /api/translations.php          → save translations                             (admin)
//      body: { items: [ { lang, source, translated }, ... ] }

require_once __DIR__ . '/db.php';

const TRANSLATION_LANGS = ['zh', 'es', 'fr'];

function ensureTranslationsTable(PDO $db): void {
    $db->exec('CREATE TABLE IF NOT EXISTS translations (
        id              INT AUTO_INCREMENT PRIMARY KEY,
        lang            VARCHAR(5) NOT NULL,
        source_hash     CHAR(32)   NOT NULL,
        source_text     TEXT       NOT NULL,
        translated_text TEXT       NOT NULL,
        updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uq_translation (lang, source_hash)
    )');
}

try {
    $method = $_SERVER['REQUEST_METHOD'];
    if ($method === 'POST') requireAdminApi();

    $db = getDB();
    ensureTranslationsTable($db);

    if ($method === 'GET') {
        $lang = $_GET['lang'] ?? '';
        $map  = [];
        if (in_array($lang, TRANSLATION_LANGS, true)) {
            $stmt = $db->prepare('SELECT source_text, translated_text FROM translations WHERE lang = ?');
            $stmt->execute([$lang]);
            foreach ($stmt->fetchAll() as $row) {
                $map[$row['source_text']] = $row['translated_text'];
            }
        }
        echo json_encode((object) $map);   // {} when empty
        exit;
    }

    if ($method === 'POST') {
        $body  = json_decode(file_get_contents('php://input'), true);
        $items = $body['items'] ?? null;
        if (!is_array($items)) {
            http_response_code(400);
            echo json_encode(['error' => 'items array is required']);
            exit;
        }

        $stmt = $db->prepare(
            'INSERT INTO translations (lang, source_hash, source_text, translated_text)
             VALUES (?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE translated_text = VALUES(translated_text)'
        );
        $saved = 0;
        foreach ($items as $item) {
            $lang       = $item['lang'] ?? '';
            $source     = trim((string) ($item['source'] ?? ''));
            $translated = trim((string) ($item['translated'] ?? ''));
            if (!in_array($lang, TRANSLATION_LANGS, true) || $source === '' || $translated === '') continue;
            $stmt->execute([$lang, md5($source), $source, $translated]);
            $saved++;
        }
        echo json_encode(['ok' => true, 'saved' => $saved]);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
