<?php
// ─────────────────────────────────────────────────────────────────────────────
// question_manager.php
// Place this file in:  htdocs/major-quiz/question_manager.php
// Access at:           http://localhost/major-quiz/question_manager.php
//
// DB CONFIG — change DB_PASS if your XAMPP root has a password
// ─────────────────────────────────────────────────────────────────────────────
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'major_quiz');

// ── helpers ───────────────────────────────────────────────────────────────────
function db(): PDO {
    static $pdo;
    if (!$pdo) {
        $pdo = new PDO(
            'mysql:host='.DB_HOST.';dbname='.DB_NAME.';charset=utf8mb4',
            DB_USER, DB_PASS,
            [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
             PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC]
        );
    }
    return $pdo;
}

function h($v): string { return htmlspecialchars((string)$v, ENT_QUOTES); }

// ── handle POST actions ───────────────────────────────────────────────────────
$message = '';
$messageType = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $action = $_POST['action'] ?? '';

    // ── ADD / EDIT question ───────────────────────────────────────────────────
    if ($action === 'save_question') {
        $editId  = !empty($_POST['edit_id']) ? (int)$_POST['edit_id'] : null;
        $qText   = trim($_POST['question_text'] ?? '');
        $letters = ['A','B','C','D'];
        $options = [];
        $valid   = true;

        if (!$qText) { $valid = false; $message = 'Question text is required.'; }

        foreach ($letters as $i => $letter) {
            $oText     = trim($_POST["opt_text_$i"]     ?? '');
            $oSubtext  = trim($_POST["opt_subtext_$i"]  ?? '');
            $oFeedback = trim($_POST["opt_feedback_$i"] ?? '');
            $scores = [
                'cs'    => max(0, min(5, (int)($_POST["score_cs_$i"]    ?? 0))),
                'se'    => max(0, min(5, (int)($_POST["score_se_$i"]    ?? 0))),
                'cyber' => max(0, min(5, (int)($_POST["score_cyber_$i"] ?? 0))),
                'ds'    => max(0, min(5, (int)($_POST["score_ds_$i"]    ?? 0))),
            ];
            if (!$oText || !$oSubtext || !$oFeedback) {
                $valid = false;
                $message = "Please complete all fields for Option $letter.";
                break;
            }
            $options[] = compact('letter','oText','oSubtext','oFeedback','scores');
        }

        if ($valid) {
            $pdo = db();
            if ($editId) {
                $pdo->prepare('UPDATE questions SET question_text=? WHERE id=?')
                    ->execute([$qText, $editId]);
                $pdo->prepare('DELETE FROM options WHERE question_id=?')
                    ->execute([$editId]);
                $qId = $editId;
                $message = 'Question updated successfully.';
            } else {
                $count = (int)$pdo->query('SELECT COUNT(*) FROM questions')->fetchColumn();
                $pdo->prepare('INSERT INTO questions (question_text,sort_order) VALUES (?,?)')
                    ->execute([$qText, $count+1]);
                $qId = (int)$pdo->lastInsertId();
                $message = 'Question added successfully.';
            }
            $stmt = $pdo->prepare(
                'INSERT INTO options
                   (question_id,option_key,option_text,subtext,feedback,score_cs,score_se,score_cyber,score_ds)
                 VALUES (?,?,?,?,?,?,?,?,?)'
            );
            foreach ($options as $opt) {
                $stmt->execute([
                    $qId, $opt['letter'],
                    $opt['oText'], $opt['oSubtext'], $opt['oFeedback'],
                    $opt['scores']['cs'], $opt['scores']['se'],
                    $opt['scores']['cyber'], $opt['scores']['ds'],
                ]);
            }
            $messageType = 'success';
        } else {
            $messageType = 'error';
        }
    }

    // ── DELETE question ───────────────────────────────────────────────────────
    if ($action === 'delete_question') {
        $delId = (int)($_POST['delete_id'] ?? 0);
        if ($delId) {
            db()->prepare('DELETE FROM questions WHERE id=?')->execute([$delId]);
            $message = 'Question deleted.';
            $messageType = 'success';
        }
    }

    // ── TOGGLE active (add/remove from quiz) ──────────────────────────────────
    if ($action === 'toggle_active') {
        $togId = (int)($_POST['toggle_id'] ?? 0);
        if ($togId) {
            // Add active column if it doesn't exist yet
            try {
                db()->exec('ALTER TABLE questions ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1');
            } catch (Exception $e) { /* already exists */ }
            $row = db()->prepare('SELECT active FROM questions WHERE id=?');
            $row->execute([$togId]);
            $current = (int)($row->fetchColumn() ?? 1);
            $new = $current ? 0 : 1;
            db()->prepare('UPDATE questions SET active=? WHERE id=?')->execute([$new, $togId]);
            $message     = $new ? 'Question added to quiz.' : 'Question removed from quiz.';
            $messageType = 'success';
        }
    }

    // ── RESET defaults ────────────────────────────────────────────────────────
    if ($action === 'reset_defaults') {
        $pdo = db();
        $pdo->exec('DELETE FROM options');
        $pdo->exec('DELETE FROM questions');
        $pdo->exec('ALTER TABLE questions AUTO_INCREMENT = 1');

        $defaults = [
            [1,'What kind of activity do you enjoy the most?',[
                ['A','Solving complex technical problems','You enjoy logic, analysis, and deep problem-solving.','You seem to enjoy analytical and problem-solving work.',3,1,0,0],
                ['B','Building applications or websites','You like creating practical digital solutions.','You seem to enjoy creative and development-focused tasks.',1,3,0,0],
                ['C','Protecting systems and data','You care about digital safety and security.','You seem interested in security and risk prevention.',1,0,3,0],
                ['D','Monitoring systems and detecting risks','You like observing, checking, and preventing issues.','You seem to have strong risk-awareness and attention to detail.',0,0,3,1],
            ]],
            [2,'Which type of project sounds most interesting to you?',[
                ['A','Designing smart algorithms','You enjoy abstract thinking and technical design.','You seem drawn to theoretical and computational thinking.',3,0,0,0],
                ['B','Creating mobile or web applications','You like making useful systems for people.','You seem motivated by creating practical software products.',0,3,0,0],
                ['C','Investigating security incidents','You want to solve digital threats and attacks.','You seem interested in protecting systems from cyber threats.',0,0,3,0],
                ['D','Finding patterns in data','You enjoy analysis and discovering insights.','You seem interested in data-driven thinking and insights.',0,0,0,3],
            ]],
            [3,'Which strength describes you best?',[
                ['A','Logical reasoning','You like working through problems step by step.','You appear to be a strong logical thinker.',3,0,0,0],
                ['B','Creativity in building solutions','You enjoy turning ideas into useful systems.','You seem comfortable with practical and creative development.',0,3,0,0],
                ['C','Risk awareness and attention to detail','You notice issues others may miss.','You seem detail-oriented and careful with risks.',0,0,3,0],
                ['D','Interpreting numbers and trends','You like understanding what data means.','You seem comfortable interpreting information and patterns.',0,0,0,3],
            ]],
            [4,'Which topic would you most like to study?',[
                ['A','Algorithms and computational thinking','Learn how systems think and solve problems.','You seem interested in the core theory behind computing.',3,0,0,0],
                ['B','Software design and application development','Build systems that people actually use.','You seem interested in designing and building software products.',0,3,0,0],
                ['C','Network security and ethical hacking','Protect digital environments and user data.','You seem strongly interested in cyber defence and protection.',0,0,3,0],
                ['D','Data analysis and visualisation','Use data to support decisions and insights.','You seem interested in understanding and explaining data.',0,0,0,3],
            ]],
            [5,'Which future career sounds most appealing?',[
                ['A','Computer scientist or systems researcher','Work on deep technical problem-solving.','You may enjoy technically demanding and analytical roles.',3,0,0,0],
                ['B','Software developer or app engineer','Create digital products and services.','You may enjoy building real-world digital solutions.',0,3,0,0],
                ['C','Cyber security analyst or consultant','Protect systems and manage digital risk.','You may enjoy defending organisations from cyber threats.',0,0,3,0],
                ['D','Data analyst or business intelligence specialist','Turn information into insight and action.','You may enjoy extracting meaning from data and trends.',0,0,0,3],
            ]],
        ];

        $qStmt = $pdo->prepare('INSERT INTO questions (id,sort_order,question_text) VALUES (?,?,?)');
        $oStmt = $pdo->prepare('INSERT INTO options (question_id,option_key,option_text,subtext,feedback,score_cs,score_se,score_cyber,score_ds) VALUES (?,?,?,?,?,?,?,?,?)');
        foreach ($defaults as [$id,$text,$opts]) {
            $qStmt->execute([$id,$id,$text]);
            foreach ($opts as $o) {
                $oStmt->execute([$id,$o[0],$o[1],$o[2],$o[3],$o[4],$o[5],$o[6],$o[7]]);
            }
        }
        $message = 'Questions reset to defaults.';
        $messageType = 'success';
    }
}

// ── ensure active column exists ───────────────────────────────────────────────
try { db()->exec('ALTER TABLE questions ADD COLUMN active TINYINT(1) NOT NULL DEFAULT 1'); }
catch (Exception $e) {}

// ── fetch questions ───────────────────────────────────────────────────────────
$editQuestion = null;
$editId = isset($_GET['edit']) ? (int)$_GET['edit'] : null;

$questions = db()->query('SELECT * FROM questions ORDER BY sort_order, id')->fetchAll();
$options   = db()->query('SELECT * FROM options ORDER BY question_id, option_key')->fetchAll();
$optMap    = [];
foreach ($options as $opt) $optMap[$opt['question_id']][] = $opt;

if ($editId) {
    foreach ($questions as $q) {
        if ($q['id'] == $editId) { $editQuestion = $q; break; }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>Question Manager | Choose Your Major</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700;800&family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet">
<style>
:root {
  --bg:      #070708;
  --surface: rgba(255,255,255,0.055);
  --border:  rgba(255,248,239,0.11);
  --text:    #fff8ef;
  --muted:   #b8aa9c;
  --soft:    #eadfd2;
  --red:     #ef3d3d;
  --red-dim: rgba(239,61,61,0.13);
  --red-border: rgba(239,61,61,0.3);
  --green:   #4ade80;
  --title:   "Sora", sans-serif;
  --body:    "Manrope", sans-serif;
  --radius:  22px;
  --shadow:  0 20px 60px rgba(0,0,0,0.5);
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }
body {
  font-family: var(--body);
  background:
    radial-gradient(circle at 8% 12%, rgba(239,61,61,0.32), transparent 26rem),
    radial-gradient(circle at 92% 6%,  rgba(255,248,239,0.13), transparent 22rem),
    linear-gradient(145deg, #070708, #101013);
  color: var(--text);
  min-height: 100vh;
  -webkit-font-smoothing: antialiased;
}
body::before {
  content:""; position:fixed; inset:0; pointer-events:none; z-index:0;
  background-image:
    linear-gradient(rgba(255,248,239,.022) 1px,transparent 1px),
    linear-gradient(90deg,rgba(255,248,239,.022) 1px,transparent 1px);
  background-size: 48px 48px;
  mask-image: linear-gradient(to bottom,rgba(0,0,0,.9),transparent 80%);
}

/* ── layout ── */
.wrap { position:relative; z-index:1; max-width:1200px; margin:0 auto; padding:32px 20px 80px; }

/* ── topbar ── */
.topbar {
  position:sticky; top:0; z-index:100;
  display:flex; align-items:center; justify-content:space-between; gap:16px;
  padding:14px 24px;
  background: rgba(7,7,8,0.82);
  border-bottom: 1px solid var(--border);
  backdrop-filter: blur(24px);
}
.topbar-brand { display:flex; align-items:center; gap:12px; text-decoration:none; color:var(--text); }
.topbar-brand strong { font-family:var(--title); font-size:1rem; letter-spacing:-.03em; }
.topbar-brand small { display:block; color:var(--muted); font-size:.75rem; }
.topbar-links { display:flex; gap:8px; }
.topbar-links a {
  padding:8px 14px; border-radius:12px; color:var(--soft);
  text-decoration:none; font-weight:700; font-size:.88rem;
  border:1px solid transparent; transition:.18s;
}
.topbar-links a:hover { background:var(--surface); border-color:var(--border); color:var(--text); }

/* ── page header ── */
.page-header { margin:40px 0 32px; }
.eyebrow { color:#ff8e8e; font-size:.72rem; letter-spacing:.14em; font-weight:800; text-transform:uppercase; margin-bottom:10px; }
.page-header h1 {
  font-family:var(--title); font-size:clamp(2.4rem,5vw,4rem);
  letter-spacing:-.06em; line-height:1; font-weight:700; color:var(--text);
}
.page-header p { color:var(--soft); margin-top:14px; max-width:640px; line-height:1.7; }

/* ── two-col grid ── */
.grid { display:grid; grid-template-columns:420px 1fr; gap:24px; align-items:start; }
@media(max-width:900px){ .grid { grid-template-columns:1fr; } }

/* ── panel ── */
.panel {
  border:1px solid var(--border);
  background: linear-gradient(145deg,rgba(255,255,255,.06),rgba(255,255,255,.028));
  border-radius:28px; padding:28px;
  box-shadow: var(--shadow);
  backdrop-filter: blur(22px);
}
.panel-head {
  display:flex; justify-content:space-between; align-items:flex-start; gap:12px;
  margin-bottom:22px;
}
.panel-head h2 { font-family:var(--title); font-size:1.45rem; letter-spacing:-.05em; font-weight:700; }
.pill {
  padding:6px 12px; border-radius:999px; font-size:.7rem; font-weight:900;
  letter-spacing:.1em; text-transform:uppercase; white-space:nowrap;
  background: var(--red-dim); border:1px solid var(--red-border); color:#ffaca6;
}
.pill.green { background:rgba(74,222,128,.12); border-color:rgba(74,222,128,.3); color:#86efac; }

/* ── form elements ── */
label.lbl { display:block; color:var(--soft); font-weight:800; font-size:.84rem; margin-bottom:6px; }
input[type=text],input[type=number],textarea,select {
  width:100%; min-height:44px; padding:10px 14px;
  background:rgba(255,248,239,.07); border:1px solid var(--border);
  border-radius:14px; color:var(--text); font-family:var(--body); font-size:.95rem;
  outline:none; transition:.18s;
}
input[type=text]:focus,input[type=number]:focus,textarea:focus {
  border-color:rgba(239,61,61,.7);
  box-shadow:0 0 0 3px rgba(239,61,61,.12);
}
input::placeholder,textarea::placeholder { color:rgba(234,223,210,.38); }
textarea { resize:vertical; min-height:80px; line-height:1.6; }
input[type=number] { min-height:40px; }
.mb { margin-bottom:14px; }

/* ── option block ── */
.opt-block {
  padding:16px; border:1px solid var(--border);
  border-radius:18px; background:rgba(255,255,255,.038);
  margin-bottom:12px;
}
.opt-block h4 {
  font-family:var(--title); font-size:.92rem; font-weight:700;
  letter-spacing:-.03em; margin-bottom:12px; color:var(--text);
}
.score-row { display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-top:10px; }
.score-row label.lbl { font-size:.74rem; }

/* ── buttons ── */
.btn {
  display:inline-flex; align-items:center; justify-content:center; gap:7px;
  padding:10px 18px; border-radius:14px; border:1px solid transparent;
  font-family:var(--body); font-weight:800; font-size:.9rem; cursor:pointer;
  transition:.18s; text-decoration:none; min-height:42px;
}
.btn-primary {
  background:linear-gradient(135deg,var(--red),#b91616);
  color:#fff; box-shadow:0 12px 28px rgba(239,61,61,.22);
}
.btn-primary:hover { transform:translateY(-1px); filter:brightness(1.08); }
.btn-secondary {
  background:var(--surface); color:var(--text); border-color:var(--border);
}
.btn-secondary:hover { background:rgba(255,255,255,.09); transform:translateY(-1px); }
.btn-danger {
  background:rgba(239,61,61,.12); color:#ffa7a0; border-color:rgba(239,61,61,.28);
}
.btn-danger:hover { background:rgba(239,61,61,.22); }
.btn-ghost { background:transparent; color:var(--muted); border-color:transparent; font-size:.82rem; }
.btn-ghost:hover { color:var(--text); }
.btn-sm { padding:6px 12px; min-height:34px; font-size:.82rem; border-radius:11px; }
.btn-actions { display:flex; gap:8px; flex-wrap:wrap; margin-top:20px; }

/* ── message banner ── */
.banner {
  padding:13px 18px; border-radius:16px; font-weight:700; margin-bottom:22px;
  display:flex; align-items:center; gap:10px;
}
.banner.success { background:rgba(74,222,128,.1); border:1px solid rgba(74,222,128,.28); color:#86efac; }
.banner.error   { background:rgba(239,61,61,.1);  border:1px solid rgba(239,61,61,.28);  color:#ffa7a0; }

/* ── question list ── */
.q-list { display:grid; gap:12px; }
.q-card {
  padding:18px 20px; border-radius:20px;
  border:1px solid var(--border); background:rgba(255,255,255,.042);
  transition:.18s;
}
.q-card:hover { border-color:rgba(239,61,61,.32); background:rgba(255,255,255,.058); }
.q-card.inactive { opacity:.5; border-style:dashed; }
.q-card-top { display:flex; justify-content:space-between; gap:12px; align-items:flex-start; }
.q-card-top h3 {
  font-family:var(--title); font-size:1rem; font-weight:700;
  letter-spacing:-.04em; line-height:1.4; color:var(--text);
}
.q-card-meta { display:flex; align-items:center; gap:8px; flex-wrap:wrap; margin-top:8px; }
.q-card-meta span { font-size:.78rem; color:var(--muted); }
.status-dot {
  width:8px; height:8px; border-radius:50%; flex:0 0 auto;
  background:var(--green); box-shadow:0 0 0 4px rgba(74,222,128,.15);
}
.status-dot.off { background:#555; box-shadow:none; }
.q-card-actions { display:flex; gap:6px; flex-shrink:0; }
.num-badge {
  width:28px; height:28px; border-radius:8px; display:inline-flex;
  align-items:center; justify-content:center;
  background:var(--red-dim); color:#ffaca6; font-weight:900; font-size:.8rem;
  font-family:var(--title);
}
.empty-state { text-align:center; padding:40px 20px; color:var(--muted); }
.empty-state p { margin-top:8px; font-size:.95rem; }

/* ── stats row ── */
.stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; margin-bottom:24px; }
.stat-mini {
  padding:16px 18px; border-radius:18px;
  border:1px solid var(--border); background:var(--surface);
}
.stat-mini span { display:block; color:var(--muted); font-size:.74rem; font-weight:800; text-transform:uppercase; letter-spacing:.08em; }
.stat-mini strong { display:block; font-family:var(--title); font-size:1.9rem; letter-spacing:-.05em; margin-top:4px; }
@media(max-width:600px){ .stats-row { grid-template-columns:1fr 1fr; } }

/* ── section divider ── */
.sec-divider { display:flex; align-items:center; gap:12px; margin:24px 0 16px; }
.sec-divider span { color:#ff8e8e; font-size:.7rem; letter-spacing:.12em; font-weight:900; text-transform:uppercase; white-space:nowrap; }
.sec-divider::after { content:""; flex:1; height:1px; background:var(--border); }
</style>
</head>
<body>

<!-- topbar -->
<nav class="topbar">
  <a class="topbar-brand" href="index.html">
    <div>
      <strong>Choose Your Major</strong>
      <small>Question Manager</small>
    </div>
  </a>
  <div class="topbar-links">
    <a href="index.html">Quiz Page</a>
    <a href="admin.html">Admin Dashboard</a>
  </div>
</nav>

<div class="wrap">

  <!-- page header -->
  <div class="page-header">
    <p class="eyebrow">Admin Tools</p>
    <h1>Question Manager</h1>
    <p>Create, edit, and manage quiz questions. Toggle questions on or off to control what appears in the live quiz.</p>
  </div>

  <?php if ($message): ?>
  <div class="banner <?= $messageType ?>">
    <?= $messageType === 'success' ? '✓' : '✕' ?>
    <?= h($message) ?>
  </div>
  <?php endif; ?>

  <!-- stats -->
  <?php
    $total  = count($questions);
    $active = count(array_filter($questions, fn($q) => ($q['active'] ?? 1) == 1));
    $inactive = $total - $active;
  ?>
  <div class="stats-row">
    <div class="stat-mini">
      <span>Total Questions</span>
      <strong><?= $total ?></strong>
    </div>
    <div class="stat-mini">
      <span>In Quiz</span>
      <strong style="color:#86efac"><?= $active ?></strong>
    </div>
    <div class="stat-mini">
      <span>Hidden</span>
      <strong style="color:#ffa7a0"><?= $inactive ?></strong>
    </div>
  </div>

  <div class="grid">

    <!-- ── LEFT: editor form ─────────────────────────────────────────────── -->
    <div>
      <div class="panel" style="position:sticky;top:80px">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Question Editor</p>
            <h2><?= $editQuestion ? 'Edit Question' : 'Add New Question' ?></h2>
          </div>
          <span class="pill"><?= $editQuestion ? 'Editing #'.$editQuestion['id'] : 'New' ?></span>
        </div>

        <form method="POST" action="question_manager.php">
          <input type="hidden" name="action" value="save_question"/>
          <?php if ($editQuestion): ?>
          <input type="hidden" name="edit_id" value="<?= $editQuestion['id'] ?>"/>
          <?php endif; ?>

          <!-- question text -->
          <div class="mb">
            <label class="lbl">Question Text</label>
            <textarea name="question_text" placeholder="e.g. What kind of activity do you enjoy most?" required><?= $editQuestion ? h($editQuestion['question_text']) : '' ?></textarea>
          </div>

          <!-- options A–D -->
          <?php
          $letters  = ['A','B','C','D'];
          $majors   = ['cs'=>'Comp. Sci','se'=>'Software','cyber'=>'Cyber Sec','ds'=>'Data Sci'];
          $editOpts = [];
          if ($editQuestion) {
              foreach ($optMap[$editQuestion['id']] ?? [] as $o) $editOpts[$o['option_key']] = $o;
          }
          foreach ($letters as $i => $letter):
              $eo = $editOpts[$letter] ?? null;
          ?>
          <div class="opt-block">
            <h4>Option <?= $letter ?></h4>
            <div class="mb">
              <label class="lbl">Answer Text</label>
              <input type="text" name="opt_text_<?= $i ?>"
                     value="<?= $eo ? h($eo['option_text']) : '' ?>"
                     placeholder="Short answer label" required/>
            </div>
            <div class="mb">
              <label class="lbl">Subtext</label>
              <input type="text" name="opt_subtext_<?= $i ?>"
                     value="<?= $eo ? h($eo['subtext']) : '' ?>"
                     placeholder="One-line description" required/>
            </div>
            <div class="mb">
              <label class="lbl">Feedback (shown after selecting)</label>
              <input type="text" name="opt_feedback_<?= $i ?>"
                     value="<?= $eo ? h($eo['feedback']) : '' ?>"
                     placeholder="Feedback shown to the student" required/>
            </div>
            <div class="score-row">
              <?php foreach ($majors as $key => $label): ?>
              <div>
                <label class="lbl"><?= $label ?></label>
                <input type="number" name="score_<?= $key ?>_<?= $i ?>"
                       value="<?= $eo ? (int)$eo["score_$key"] : 0 ?>"
                       min="0" max="5"/>
              </div>
              <?php endforeach; ?>
            </div>
            <p style="color:var(--muted);font-size:.76rem;margin-top:8px">
              Score 0–5 per major. Use <strong style="color:var(--soft)">3</strong> for the primary match, <strong style="color:var(--soft)">1</strong> for a secondary.
            </p>
          </div>
          <?php endforeach; ?>

          <div class="btn-actions">
            <button type="submit" class="btn btn-primary">
              <?= $editQuestion ? '💾 Save Changes' : '＋ Add Question' ?>
            </button>
            <?php if ($editQuestion): ?>
            <a href="question_manager.php" class="btn btn-secondary">Cancel</a>
            <?php endif; ?>
          </div>
        </form>

        <!-- reset -->
        <div class="sec-divider"><span>Danger Zone</span></div>
        <form method="POST" onsubmit="return confirm('Reset ALL questions to defaults? This cannot be undone.')">
          <input type="hidden" name="action" value="reset_defaults"/>
          <button type="submit" class="btn btn-danger" style="width:100%">↺ Reset to Default Questions</button>
        </form>
      </div>
    </div>

    <!-- ── RIGHT: question list ──────────────────────────────────────────── -->
    <div>
      <div class="panel">
        <div class="panel-head">
          <div>
            <p class="eyebrow">Current Questions</p>
            <h2>Question List</h2>
          </div>
          <span class="pill green"><?= $active ?> Active</span>
        </div>

        <?php if (empty($questions)): ?>
        <div class="empty-state">
          <div style="font-size:2.5rem">📋</div>
          <p>No questions yet. Use the form to add your first question.</p>
        </div>
        <?php else: ?>
        <div class="q-list">
          <?php foreach ($questions as $idx => $q):
            $isActive = ($q['active'] ?? 1) == 1;
            $qOpts    = $optMap[$q['id']] ?? [];
          ?>
          <div class="q-card <?= !$isActive ? 'inactive' : '' ?>">
            <div class="q-card-top">
              <div style="display:flex;gap:10px;align-items:flex-start">
                <span class="num-badge"><?= $idx+1 ?></span>
                <div>
                  <h3><?= h($q['question_text']) ?></h3>
                  <div class="q-card-meta">
                    <span class="status-dot <?= !$isActive ? 'off' : '' ?>"></span>
                    <span><?= $isActive ? 'In quiz' : 'Hidden from quiz' ?></span>
                    <span>·</span>
                    <span><?= count($qOpts) ?> options</span>
                  </div>
                </div>
              </div>
              <div class="q-card-actions">
                <!-- toggle on/off -->
                <form method="POST" style="display:inline">
                  <input type="hidden" name="action" value="toggle_active"/>
                  <input type="hidden" name="toggle_id" value="<?= $q['id'] ?>"/>
                  <button type="submit"
                          class="btn btn-sm <?= $isActive ? 'btn-secondary' : 'btn-primary' ?>"
                          title="<?= $isActive ? 'Remove from quiz' : 'Add to quiz' ?>">
                    <?= $isActive ? '✕ Remove' : '＋ Add' ?>
                  </button>
                </form>
                <!-- edit -->
                <a href="question_manager.php?edit=<?= $q['id'] ?>"
                   class="btn btn-sm btn-secondary">Edit</a>
                <!-- delete -->
                <form method="POST" style="display:inline"
                      onsubmit="return confirm('Delete this question permanently?')">
                  <input type="hidden" name="action" value="delete_question"/>
                  <input type="hidden" name="delete_id" value="<?= $q['id'] ?>"/>
                  <button type="submit" class="btn btn-sm btn-danger">Delete</button>
                </form>
              </div>
            </div>

            <!-- option preview -->
            <?php if ($qOpts): ?>
            <div style="margin-top:12px;display:grid;grid-template-columns:repeat(2,1fr);gap:6px">
              <?php foreach ($qOpts as $opt): ?>
              <div style="padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.032);border:1px solid var(--border);font-size:.8rem;">
                <strong style="color:var(--soft)"><?= h($opt['option_key']) ?>.</strong>
                <?= h($opt['option_text']) ?>
              </div>
              <?php endforeach; ?>
            </div>
            <?php endif; ?>
          </div>
          <?php endforeach; ?>
        </div>
        <?php endif; ?>
      </div>
    </div>

  </div><!-- /grid -->
</div><!-- /wrap -->

</body>
</html>
