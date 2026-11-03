<?php
require_once __DIR__ . '/api/auth.php';
requireAdminPage();
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Manage Majors | Choose Your Major</title>
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
      <a class="navbar-brand admin-brand" href="admin.php">
        <span class="brand-copy"><strong>Choose Your Major</strong><small>Major Management</small></span>
      </a>
      <a class="nav-link" href="admin.php">Back to Dashboard</a>
    </div>
  </nav>

  <main class="admin-page">
    <section id="dashboardPanel">
      <div class="container py-5">
        <div class="workspace-hero mb-4"><p class="section-label">Major Catalogue</p><h1>Add or remove quiz majors</h1><p>New majors automatically become score options in question management and editable result entries.</p></div>
        <div class="row g-4 align-items-start">
          <div class="col-lg-5"><div class="admin-panel">
            <div class="panel-heading"><div><p class="section-label">New Major</p><h2>Add Major</h2></div></div>
            <form id="majorForm">
              <label class="form-label" for="majorCode">Code</label><input id="majorCode" class="form-control mb-3" placeholder="e.g. ux-design" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" />
              <label class="form-label" for="majorTitle">Title</label><input id="majorTitle" class="form-control mb-3" required />
              <label class="form-label" for="personalityTag">Profile tag</label><input id="personalityTag" class="form-control mb-3" placeholder="e.g. Experience Designer" />
              <label class="form-label" for="careers">Career suggestions</label><textarea id="careers" class="form-control mb-3" rows="3" required></textarea>
              <label class="form-label" for="resultReason">Why this major was recommended</label><textarea id="resultReason" class="form-control mb-3" rows="3" required></textarea>
              <label class="form-label" for="exploreText">Explore description</label><textarea id="exploreText" class="form-control mb-3" rows="3" required></textarea>
              <label class="form-label" for="qrLink">QR code link (optional)</label><input id="qrLink" class="form-control mb-3" type="text" inputmode="url" autocomplete="off" placeholder="https://www.swinburne.edu.au/..." />
              <label class="form-label">Related courses &amp; minors (optional)</label>
              <p class="small text-secondary-emphasis mb-2">Shown on the result page for this major. Add a web link to make a course clickable.</p>
              <div class="rc-list" data-rc-list></div>
              <button type="button" class="btn btn--secondary btn-sm mb-3" data-rc-add>+ Add related course</button>
              <p id="formMessage" class="form-message"></p><p id="translateStatus" class="form-message" role="status" aria-live="polite"></p><button class="btn btn--primary" type="submit">Add Major</button>
            </form>
          </div></div>
          <div class="col-lg-7"><div class="admin-panel"><div class="panel-heading"><div><p class="section-label">Live Catalogue</p><h2>Current Majors</h2></div></div><div id="majorList" class="major-info-list mt-4"></div></div></div>
        </div>
      </div>
    </section>
  </main>

  <script src="js/data.js"></script>
  <script src="js/vendor/qrcode.js"></script>
  <script src="js/qr.js"></script>
  <script src="js/related-editor.js"></script>
  <script src="js/auto-translate.js"></script>
  <script src="js/major-manager.js"></script>
</body>
</html>
