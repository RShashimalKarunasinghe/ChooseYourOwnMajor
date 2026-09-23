<?php
/**
 * update_question.php
 * -----------------
 * POST   { text, options:[...] }             → Add question
 * PUT    { question_id, text, options:[...] } → Edit question
 * DELETE { question_id }                      → Delete question
 *
 * options item: { key, text, subtext, feedback, scores:{ major_code: score } }
 */

header("Content-Type: application/json");
include "db.php";

$method = $_SERVER["REQUEST_METHOD"];
$input  = json_decode(file_get_contents("php://input"), true);

// ── Shared helper: insert options + scores for a question_id ───────────────
function insertOptions($mysqli, $questionId, $options) {
    foreach ($options as $option) {
        $optionKey  = $mysqli->real_escape_string($option["key"]      ?? "");
        $optionText = $mysqli->real_escape_string($option["text"]     ?? "");
        $subtext    = $mysqli->real_escape_string($option["subtext"]  ?? "");
        $feedback   = $mysqli->real_escape_string($option["feedback"] ?? "");

        $mysqli->query(
            "INSERT INTO options (question_id, option_key, option_text, subtext, feedback)
             VALUES ($questionId, '$optionKey', '$optionText', '$subtext', '$feedback')"
        );
        $optionId = (int)$mysqli->insert_id;

        if (!$optionId) continue;

        if (!empty($option["scores"])) {
            foreach ($option["scores"] as $majorCode => $score) {
                $majorCode = $mysqli->real_escape_string($majorCode);
                $score     = (int)$score;
                if ($score > 0) {
                    $mysqli->query(
                        "INSERT INTO option_scores (option_id, major_code, score)
                         VALUES ($optionId, '$majorCode', $score)"
                    );
                }
            }
        }
    }
}

// ── Shared helper: delete all options + scores for a question_id ───────────
function deleteOptions($mysqli, $questionId) {
    $res       = $mysqli->query("SELECT option_id FROM options WHERE question_id = $questionId");
    $optionIds = [];
    while ($row = $res->fetch_assoc()) {
        $optionIds[] = (int)$row["option_id"];
    }
    if (!empty($optionIds)) {
        $ids = implode(",", $optionIds);
        $mysqli->query("DELETE FROM option_scores WHERE option_id IN ($ids)");
    }
    $mysqli->query("DELETE FROM options WHERE question_id = $questionId");
}

// ── DELETE ─────────────────────────────────────────────────────────────────
if ($method === "DELETE") {
    $questionId = (int)($input["question_id"] ?? 0);
    if ($questionId <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid question_id."]);
        exit;
    }

    deleteOptions($mysqli, $questionId);
    $mysqli->query("DELETE FROM questions WHERE question_id = $questionId");

    echo json_encode(["success" => true]);
    $mysqli->close();
    exit;
}

// ── PUT (edit question) ────────────────────────────────────────────────────
if ($method === "PUT") {
    $questionId = (int)($input["question_id"] ?? 0);
    $text       = trim($input["text"] ?? "");

    if ($questionId <= 0) {
        http_response_code(400);
        echo json_encode(["error" => "Invalid question_id."]);
        exit;
    }
    if ($text === "") {
        http_response_code(400);
        echo json_encode(["error" => "Question text is required."]);
        exit;
    }
    if (empty($input["options"]) || count($input["options"]) < 2) {
        http_response_code(400);
        echo json_encode(["error" => "At least 2 options are required."]);
        exit;
    }

    // Update question text
    $safeText = $mysqli->real_escape_string($text);
    $mysqli->query("UPDATE questions SET text = '$safeText' WHERE question_id = $questionId");

    // Replace all options + scores
    deleteOptions($mysqli, $questionId);
    insertOptions($mysqli, $questionId, $input["options"]);

    echo json_encode(["success" => true, "question_id" => $questionId]);
    $mysqli->close();
    exit;
}

// ── POST (add question) ────────────────────────────────────────────────────
if ($method === "POST") {
    $text = trim($input["text"] ?? "");

    if ($text === "") {
        http_response_code(400);
        echo json_encode(["error" => "Question text is required."]);
        exit;
    }
    if (empty($input["options"]) || count($input["options"]) < 2) {
        http_response_code(400);
        echo json_encode(["error" => "At least 2 options are required."]);
        exit;
    }

    $safeText = $mysqli->real_escape_string($text);
    $mysqli->query("INSERT INTO questions (text) VALUES ('$safeText')");
    $questionId = (int)$mysqli->insert_id;

    if (!$questionId) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to insert question."]);
        exit;
    }

    insertOptions($mysqli, $questionId, $input["options"]);

    echo json_encode(["success" => true, "question_id" => $questionId]);
    $mysqli->close();
    exit;
}

// ── Method not allowed ─────────────────────────────────────────────────────
http_response_code(405);