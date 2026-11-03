<?php
require_once __DIR__ . '/api/config.php';
require_once __DIR__ . '/api/auth.php';

if (isAdmin()) {
    header('Location: admin.php');
    exit;
}

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (hash_equals(ADMIN_USER, $username) && password_verify($password, ADMIN_PASS_HASH)) {
        session_regenerate_id(true);
        $_SESSION['admin_logged_in'] = true;
        header('Location: admin.php');
        exit;
    }

    $error = 'Incorrect username or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Login | Choose Your Major</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@500;600;700;800&display=swap" rel="stylesheet">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
  <link rel="stylesheet" href="css/style.css" />
  <link rel="stylesheet" href="css/admin.css" />
</head>
<body class="admin-body">
  <nav class="navbar navbar-expand-lg admin-topbar">
    <div class="container-fluid px-3 px-lg-4">
      <a class="navbar-brand admin-brand" href="index.html" aria-label="Go to quiz homepage">
        <span class="brand-mark"><img src="logo.svg" alt="Logo" /></span>
        <span class="brand-copy d-none d-sm-block">
          <strong>Choose Your Major</strong>
          <small>Admin Login</small>
        </span>
      </a>
      <a class="nav-link" href="index.html">Quiz Page</a>
    </div>
  </nav>

  <main class="admin-page">
    <section class="admin-login-screen">
      <div class="container">
        <div class="row align-items-center justify-content-center g-4 min-vh-login">
          <div class="col-lg-6">
            <div class="login-intro-card">
              <p class="section-label">Administration Area</p>
              <h1>Control your quiz content from one place.</h1>
              <p>
                Manage questions, review submissions, and monitor recommendation trends using a cleaner red and black dashboard.
              </p>

              <div class="login-feature-grid">
                <div>
                  <span>01</span>
                  <strong>Edit quiz content</strong>
                  <p>Add, update, delete, or reset quiz questions.</p>
                </div>
                <div>
                  <span>02</span>
                  <strong>Review records</strong>
                  <p>Check submitted results and export a CSV file.</p>
                </div>
                <div>
                  <span>03</span>
                  <strong>Track analytics</strong>
                  <p>View recommendation patterns and match levels.</p>
                </div>
              </div>
            </div>
          </div>

          <div class="col-lg-5">
            <div class="admin-panel login-card">
              <p class="section-label">Secure Login</p>
              <h2>Admin Access</h2>
              <p class="panel-subtitle">Sign in with your administrator account to manage quiz content.</p>

              <form method="post" action="login.php">
                <div class="mb-3">
                  <label class="form-label" for="username">Username</label>
                  <input id="username" name="username" class="form-control" type="text" autocomplete="username" required />
                </div>

                <div class="mb-3">
                  <label class="form-label" for="password">Password</label>
                  <input id="password" name="password" class="form-control" type="password" autocomplete="current-password" required />
                </div>

                <div class="demo-credentials">
                  <span>Demo Login</span>
                  <strong>admin / admin123</strong>
                </div>

                <?php if ($error !== ''): ?>
                <p class="form-message" role="alert"><?= htmlspecialchars($error, ENT_QUOTES, 'UTF-8') ?></p>
                <?php endif; ?>
                <button class="btn btn--primary w-100" type="submit">Login to Dashboard</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>

  </main>
</body>
</html>
