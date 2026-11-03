<?php
// api/auth.php — shared session helpers for the admin login.

if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_start();
}

function isAdmin(): bool {
    return !empty($_SESSION['admin_logged_in']);
}

/** For admin web pages: send the visitor to the login form. */
function requireAdminPage(): void {
    if (!isAdmin()) {
        header('Location: login.php');
        exit;
    }
}

/** For JSON API endpoints: reply 401 instead of redirecting. */
function requireAdminApi(): void {
    if (!isAdmin()) {
        http_response_code(401);
        header('Content-Type: application/json');
        echo json_encode(['error' => 'Admin login required']);
        exit;
    }
}
