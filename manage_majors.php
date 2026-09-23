<?php
/**
 * manage_majors.php
 * -----------------
 * Write endpoint for the `majors` table (JOE-12).
 *
 * Reading majors stays in get_majors.php. This file handles the writes so
 * that admin edits persist in the database instead of localStorage.
 *
 *   POST   -> create a new major
 *   PUT    -> update an existing major (?code=xx)
 *   DELETE -> delete a major (?code=xx)
 *
 * All statements are prepared to avoid SQL injection.
 */

header("Content-Type: application/json");

include("db.php");

$method = $_SERVER["REQUEST_METHOD"];
$code   = isset($_GET["code"]) ? trim($_GET["code"]) : "";
$input  = json_decode(file_get_contents("php://input"), true);

/** Send a JSON error and stop. */
function fail($message, $status = 400) {
    http_response_code($status);
    echo json_encode(["error" => $message]);
    exit;
}

/** Pull and trim the six major fields from the request body. */
function readMajorFields($input) {
    return [
        "title"           => trim($input["title"]           ?? ""),
        "careers"         => trim($input["careers"]         ?? ""),
        "result_reason"   => trim($input["resultReason"]    ?? ""),
        "explore_text"    => trim($input["exploreText"]     ?? ""),
        "personality_tags"=> trim($input["personalityTags"] ?? "")
    ];
}

// ── CREATE ────────────────────────────────────────────────────────────────────
if ($method === "POST") {
    $newCode = strtolower(trim($input["code"] ?? ""));

    if ($newCode === "") {
        fail("A major code is required.");
    }

    // Reject duplicates up front so the user gets a clear message
    $check = $mysqli->prepare("SELECT major_code FROM majors WHERE major_code = ?");
    $check->bind_param("s", $newCode);
    $check->execute();
    if ($check->get_result()->num_rows > 0) {
        $check->close();
        fail("That major code already exists. Please use a unique code.", 409);
    }
    $check->close();

    $f = readMajorFields($input);

    $stmt = $mysqli->prepare(
        "INSERT INTO majors
         (major_code, title, careers, result_reason, explore_text, personality_tags)
         VALUES (?, ?, ?, ?, ?, ?)"
    );
    $stmt->bind_param(
        "ssssss",
        $newCode,
        $f["title"],
        $f["careers"],
        $f["result_reason"],
        $f["explore_text"],
        $f["personality_tags"]
    );

    if (!$stmt->execute()) {
        $stmt->close();
        fail("Could not create the major.", 500);
    }

    $stmt->close();
    echo json_encode(["success" => true, "code" => $newCode]);
    exit;
}

// ── UPDATE ────────────────────────────────────────────────────────────────────
if ($method === "PUT") {
    if ($code === "") {
        fail("No major code supplied.");
    }

    $f = readMajorFields($input);

    $stmt = $mysqli->prepare(
        "UPDATE majors
         SET title = ?, careers = ?, result_reason = ?, explore_text = ?, personality_tags = ?
         WHERE major_code = ?"
    );
    $stmt->bind_param(
        "ssssss",
        $f["title"],
        $f["careers"],
        $f["result_reason"],
        $f["explore_text"],
        $f["personality_tags"],
        $code
    );

    if (!$stmt->execute()) {
        $stmt->close();
        fail("Could not update the major.", 500);
    }

    $stmt->close();
    echo json_encode(["success" => true, "code" => $code]);
    exit;
}

// ── DELETE ────────────────────────────────────────────────────────────────────
if ($method === "DELETE") {
    if ($code === "") {
        fail("No major code supplied.");
    }

    // Keep at least two majors so the quiz still has something to compare
    $countResult = $mysqli->query("SELECT COUNT(*) AS total FROM majors");
    $total = (int)$countResult->fetch_assoc()["total"];
    if ($total <= 2) {
        fail("You must keep at least two majors for the quiz to work.", 409);
    }

    // option_scores has a foreign key to majors, so clear its rows first
    $clearScores = $mysqli->prepare("DELETE FROM option_scores WHERE major_code = ?");
    $clearScores->bind_param("s", $code);
    $clearScores->execute();
    $clearScores->close();

    $stmt = $mysqli->prepare("DELETE FROM majors WHERE major_code = ?");
    $stmt->bind_param("s", $code);

    if (!$stmt->execute()) {
        $stmt->close();
        fail("Could not delete the major.", 500);
    }

    $stmt->close();
    echo json_encode(["success" => true, "code" => $code]);
    exit;
}

fail("Unsupported request method.", 405);
