# Choose Your Major (merged)

Quiz questions, majors, results and records all live in MariaDB/MySQL and are
managed from the admin pages. Nothing about the quiz is hard-coded.

## Setup
1. Create a database (XAMPP: `major_quiz`; FeeNIX: the database you were given) and import `api/schema.sql` with phpMyAdmin.
2. Edit `api/config.php`: `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`.
3. Copy the folder to `htdocs` (XAMPP) or your Mercury web folder, then open `index.html`.

The student quiz page has no links to the admin area. Admins go straight to `login.php` (keep that address to yourselves).
Admin login: `login.php` — default `admin` / `admin123` (change the hash in `api/config.php`).

## What's where
- `login.php`, `logout.php`, `admin.php`, `major-manager.php` — PHP session login; admin pages and every write API call require it.
- `api/*.php` — JSON API (questions, majors, records). Public: read active questions/majors, submit a record, record summary counts. Admin only: everything else.
- `js/languages.js` — English / 中文 / Español / Français. Interface text is built in; quiz and major text is translated from the `translations` table.
- `js/auto-translate.js` + `api/translations.php` — when an admin saves a question or major, the admin's browser translates any new text (free MyMemory service, no key) and stores it in the database. If the service is unavailable or over its free daily limit the text stays in English; use **Translate missing text** in the admin sidebar to retry. Machine translations can be corrected in the `translations` table (phpMyAdmin).
- Result screen: match level, answers that contributed, score breakdown, profile tags, student analytics.
- Accessibility: A- / A+ text size and high-contrast mode (remembered per browser). Quiz progress can be resumed.
- Look: white background with Swinburne red/black/grey (colours are variables at the top of `css/style.css`).
- QR codes: in **Manage Results**, each major has an optional *QR code link*. Students who get that major see it as a QR code on their result; clearing the box removes it. The QR code is drawn in the browser with the bundled `js/vendor/qrcode.js` (MIT licence), so nothing is loaded from the internet. Existing databases get the new `qr_link` column automatically.
- Related courses & minors: in **Manage Results**, each major has a list of related courses (name + optional web link, up to 12). They appear on the student's result for that major; a course with a link is clickable, one without is plain text. The **Add Major** form has the same related-courses editor, so new majors can have courses from the start, and they stay editable in Manage Results afterwards. Names are translated automatically like the rest of the quiz text. The four starter majors come with starter lists, and existing databases are filled in automatically.
- Compare majors: the result page has a side-by-side comparison (profile tag, careers, why it fits, core focus, related courses). It starts with the recommended major vs the alternative, lists every major in the database (including ones added later), and follows the selected language.
