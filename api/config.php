<?php
// api/config.php — the only file you need to edit when moving the site.
//
// XAMPP (local):  leave as is.
// FeeNIX / Mercury: replace DB_HOST, DB_USER, DB_PASS and DB_NAME with the
//                   details Swinburne gives you for your MariaDB database.

define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');            // XAMPP default is an empty password
define('DB_NAME', 'major_quiz');

// Admin login (checked on the server in login.php).
// The password is stored as a hash. Default login is admin / admin123.
// To change it, run:  php -r 'echo password_hash("NewPassword", PASSWORD_DEFAULT);'
// and paste the result below.
define('ADMIN_USER', 'admin');
define('ADMIN_PASS_HASH', '$2y$10$ba6U05EkPRorMxxfYLhGEeu6Z01pTweRfslBKhps6fZwHx6MAWkfG');
