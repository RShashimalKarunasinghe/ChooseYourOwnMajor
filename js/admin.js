// js/admin.js
// Admin dashboard — all data operations hit the PHP/MySQL API.

const loginPanel      = document.getElementById('loginPanel');
const dashboardPanel  = document.getElementById('dashboardPanel');
const loginForm       = document.getElementById('loginForm');
const loginMessage    = document.getElementById('loginMessage');
const logoutBtn       = document.getElementById('logoutBtn');
const questionForm    = document.getElementById('questionForm');
const optionInputs    = document.getElementById('optionInputs');
const questionsList   = document.getElementById('questionsList');
const editIndex       = document.getElementById('editIndex');
const questionText    = document.getElementById('questionText');
const formTitle       = document.getElementById('formTitle');
const clearFormBtn    = document.getElementById('clearFormBtn');
const resetQuestionsBtn = document.getElementById('resetQuestionsBtn');
const recordsTable    = document.getElementById('recordsTable');
const clearRecordsBtn = document.getElementById('clearRecordsBtn');
const exportRecordsBtn = document.getElementById('exportRecordsBtn');
const recordDetails   = document.getElementById('recordDetails');
const totalRecords    = document.getElementById('totalRecords');
const topMajorStat    = document.getElementById('topMajorStat');
const averageMatch    = document.getElementById('averageMatch');
const analyticsChart  = document.getElementById('analyticsChart');
const majorInfoList   = document.getElementById('majorInfoList');

const majorKeys = ['cs', 'se', 'cyber', 'ds'];
const adminUser = 'admin';
const adminPass = 'admin123';

function isLoggedIn() {
  return sessionStorage.getItem('majorAdminLoggedIn') === 'true';
}

// ── auth ──────────────────────────────────────────────────────────────────────

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();

  if (username === adminUser && password === adminPass) {
    sessionStorage.setItem('majorAdminLoggedIn', 'true');
    loginMessage.textContent = '';
    showDashboard();
  } else {
    loginMessage.textContent = 'Incorrect username or password.';
  }
});

logoutBtn.addEventListener('click', () => {
  sessionStorage.removeItem('majorAdminLoggedIn');
  showLogin();
});

async function showDashboard() {
  loginPanel.classList.add('hidden');
  dashboardPanel.classList.remove('hidden');
  await renderMajorInfo();
  renderQuestions();
  renderRecords();
  renderAnalytics();
}

// ── result descriptions panel ────────────────────────────────────────────────

async function renderMajorInfo() {
  majorInfoList.innerHTML = '<p class="mb-0">Loading result descriptions...</p>';
  try {
    await loadMajorInfoFromServer();
  } catch (err) {
    majorInfoList.innerHTML = `<p class="mb-0 text-danger">Failed to load result descriptions: ${escapeHtml(err.message)}</p>`;
    return;
  }

  majorInfoList.innerHTML = majorKeys.map((major) => {
    const info = majorInfo[major];
    return `
      <form class="major-info-editor question-admin-card" data-major-form="${major}">
        <div class="panel-heading mb-3">
          <div>
            <p class="section-label">${escapeHtml(info.code.toUpperCase())}</p>
            <h3>${escapeHtml(info.title)}</h3>
          </div>
          <span class="panel-pill">Editable</span>
        </div>
        <div class="mb-3">
          <label class="form-label" for="${major}-resultReason">Why this major was recommended</label>
          <textarea id="${major}-resultReason" class="form-control" name="resultReason" rows="3" required>${escapeHtml(info.resultReason)}</textarea>
        </div>
        <div class="mb-3">
          <label class="form-label" for="${major}-careers">Career suggestions</label>
          <textarea id="${major}-careers" class="form-control" name="careers" rows="3" required>${escapeHtml(info.careers)}</textarea>
        </div>
        <div class="mb-3">
          <label class="form-label" for="${major}-exploreText">Explore description</label>
          <textarea id="${major}-exploreText" class="form-control" name="exploreText" rows="3" required>${escapeHtml(info.exploreText)}</textarea>
        </div>
        <div class="editor-actions align-items-center">
          <button class="btn btn--primary" type="submit">Save ${escapeHtml(info.title)}</button>
          <span class="form-message major-info-message" aria-live="polite"></span>
        </div>
      </form>`;
  }).join('');

  document.querySelectorAll('[data-major-form]').forEach((form) => {
    form.addEventListener('submit', handleMajorInfoSubmit);
  });
}

async function handleMajorInfoSubmit(event) {
  event.preventDefault();
  const form = event.currentTarget;
  const code = form.dataset.majorForm;
  const message = form.querySelector('.major-info-message');
  const payload = Object.fromEntries(new FormData(form).entries());
  message.textContent = 'Saving...';

  try {
    await updateMajorInfo(code, payload);
    Object.assign(majorInfo[code], payload);
    message.textContent = 'Saved successfully.';
  } catch (err) {
    message.textContent = `Save failed: ${err.message}`;
  }
}

function showLogin() {
  loginPanel.classList.remove('hidden');
  dashboardPanel.classList.add('hidden');
}

// ── option input builder ──────────────────────────────────────────────────────

function renderOptionInputs() {
  optionInputs.innerHTML = '';
  ['A', 'B', 'C', 'D'].forEach((letter, index) => {
    const div = document.createElement('div');
    div.className = 'col-12';
    div.innerHTML = `
      <div class="question-admin-card">
        <h5>Option ${letter}</h5>
        <label class="form-label">Answer Text</label>
        <input class="form-control mb-2 option-text" data-index="${index}" required />
        <label class="form-label">Subtext</label>
        <input class="form-control mb-2 option-subtext" data-index="${index}" required />
        <label class="form-label">Feedback</label>
        <input class="form-control mb-2 option-feedback" data-index="${index}" required />
        <div class="row g-2 mt-2">
          ${majorKeys.map((major) => `
            <div class="col-6 col-md-3">
              <label class="form-label">${majorInfo[major].title}</label>
              <input class="form-control option-score" data-index="${index}" data-major="${major}" type="number" min="0" max="5" value="0" />
            </div>`).join('')}
        </div>
        <p class="small text-secondary-emphasis mt-2 mb-0">Use 3 for the main matching major and 0–1 for weaker related majors.</p>
      </div>`;
    optionInputs.appendChild(div);
  });
}

// ── questions panel ───────────────────────────────────────────────────────────

async function renderQuestions() {
  questionsList.innerHTML = '<p class="mb-0">Loading…</p>';
  try {
    questions = await loadQuestionsFromServer('all'); // admins see all questions
  } catch (err) {
    questionsList.innerHTML = `<p class="mb-0 text-danger">Failed to load questions: ${escapeHtml(err.message)}</p>`;
    return;
  }

  if (questions.length === 0) {
    questionsList.innerHTML = '<p class="mb-0">No questions yet. Add one using the form.</p>';
    return;
  }

  questionsList.innerHTML = '';
  questions.forEach((question, index) => {
    const div = document.createElement('div');
    div.className = 'question-admin-card';
    div.innerHTML = `
      <div class="d-flex justify-content-between gap-3 flex-wrap">
        <div>
          <span class="section-label">Question ${index + 1}</span>
          <h5>${escapeHtml(question.text)}</h5>
          <p class="mb-0 text-secondary-emphasis">${question.options.length} answer options</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn--secondary btn-sm" data-edit="${question.id}">Edit</button>
          <button class="btn btn--secondary btn-sm" data-delete="${question.id}">Delete</button>
        </div>
      </div>`;
    questionsList.appendChild(div);
  });

  document.querySelectorAll('[data-edit]').forEach((btn) =>
    btn.addEventListener('click', () => loadQuestionForEdit(Number(btn.dataset.edit)))
  );
  document.querySelectorAll('[data-delete]').forEach((btn) =>
    btn.addEventListener('click', () => handleDeleteQuestion(Number(btn.dataset.delete)))
  );
}

function loadQuestionForEdit(id) {
  const question = questions.find((q) => q.id === id);
  if (!question) return;

  editIndex.value = id;
  formTitle.textContent = 'Edit Question';
  questionText.value = question.text;

  question.options.forEach((option, i) => {
    document.querySelector(`.option-text[data-index="${i}"]`).value     = option.text     || '';
    document.querySelector(`.option-subtext[data-index="${i}"]`).value  = option.subtext  || '';
    document.querySelector(`.option-feedback[data-index="${i}"]`).value = option.feedback || '';
    majorKeys.forEach((major) => {
      document.querySelector(`.option-score[data-index="${i}"][data-major="${major}"]`).value =
        option.scores?.[major] ?? 0;
    });
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function handleDeleteQuestion(id) {
  if (!confirm('Delete this question?')) return;
  try {
    await deleteQuestionOnServer(id);
    clearQuestionForm();
    renderQuestions();
  } catch (err) {
    alert('Failed to delete question: ' + err.message);
  }
}

questionForm.addEventListener('submit', async (event) => {
  event.preventDefault();

  const text = questionText.value.trim();
  if (!text) { alert('Please enter the question text.'); return; }

  const options = ['A', 'B', 'C', 'D'].map((letter, i) => {
    const scores = {};
    majorKeys.forEach((major) => {
      const val = Number(document.querySelector(`.option-score[data-index="${i}"][data-major="${major}"]`).value || 0);
      if (val > 0) scores[major] = val;
    });
    if (Object.keys(scores).length === 0) scores.cs = 1;

    return {
      key:      letter,
      text:     document.querySelector(`.option-text[data-index="${i}"]`).value.trim(),
      subtext:  document.querySelector(`.option-subtext[data-index="${i}"]`).value.trim(),
      feedback: document.querySelector(`.option-feedback[data-index="${i}"]`).value.trim(),
      scores
    };
  });

  if (options.some((o) => !o.text || !o.subtext || !o.feedback)) {
    alert('Please complete all option text, subtext, and feedback fields.');
    return;
  }

  try {
    const id = editIndex.value ? Number(editIndex.value) : null;
    if (id) {
      await updateQuestion(id, { text, options });
    } else {
      await createQuestion({ text, options });
    }
    clearQuestionForm();
    renderQuestions();
    alert('Question saved successfully.');
  } catch (err) {
    alert('Failed to save question: ' + err.message);
  }
});

function clearQuestionForm() {
  editIndex.value = '';
  formTitle.textContent = 'Add Question';
  questionForm.reset();
  document.querySelectorAll('.option-score').forEach((input) => { input.value = 0; });
}

clearFormBtn.addEventListener('click', clearQuestionForm);

resetQuestionsBtn.addEventListener('click', async () => {
  if (!confirm('Reset all questions to the default version?')) return;
  try {
    const result = await resetQuestionsOnServer();
    questions = result.questions;
    clearQuestionForm();
    renderQuestions();
  } catch (err) {
    alert('Failed to reset questions: ' + err.message);
  }
});

// ── records panel ─────────────────────────────────────────────────────────────

async function renderRecords() {
  recordDetails.classList.add('hidden');
  recordDetails.innerHTML = '';
  recordsTable.innerHTML = '<tr><td colspan="6">Loading…</td></tr>';

  let records;
  try {
    records = await fetchRecordsFromServer();
  } catch (err) {
    recordsTable.innerHTML = `<tr><td colspan="6">Failed to load records: ${escapeHtml(err.message)}</td></tr>`;
    return;
  }

  if (records.length === 0) {
    recordsTable.innerHTML = '<tr><td colspan="6">No quiz records yet.</td></tr>';
    return;
  }

  recordsTable.innerHTML = records.map((record, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${escapeHtml(record.date)}</td>
      <td>${escapeHtml(record.topMajorTitle)}</td>
      <td>${record.matchPercent}%</td>
      <td>${escapeHtml(record.secondMajorTitle)} (${record.secondPercent}%)</td>
      <td><button class="btn btn--secondary btn-sm" data-record="${record.id}">View</button></td>
    </tr>`).join('');

  // Stash records for the detail view
  window._adminRecords = records;

  document.querySelectorAll('[data-record]').forEach((btn) =>
    btn.addEventListener('click', () => showRecordDetails(Number(btn.dataset.record)))
  );
}

function showRecordDetails(recordId) {
  const record = (window._adminRecords || []).find((r) => r.id === recordId);
  if (!record) return;

  const answers = record.answers.map((answerIndex, questionIndex) => {
    const question = questions[questionIndex];
    const option   = question?.options?.[answerIndex];
    return `
      <li>
        <strong>Q${questionIndex + 1}:</strong> ${escapeHtml(question?.text ?? 'Question unavailable')}<br />
        <span>${escapeHtml(option?.text ?? 'Answer unavailable')}</span>
      </li>`;
  }).join('');

  recordDetails.innerHTML = `
    <div class="d-flex justify-content-between gap-3 flex-wrap">
      <div>
        <p class="section-label">Record Details</p>
        <h4>${escapeHtml(record.topMajorTitle)} — ${record.matchPercent}%</h4>
        <p class="mb-2">Submitted: ${escapeHtml(record.date)}</p>
      </div>
      <button class="btn btn--secondary btn-sm" id="closeRecordDetails">Close</button>
    </div>
    <ul class="record-answer-list mt-3">${answers}</ul>`;

  recordDetails.classList.remove('hidden');
  document.getElementById('closeRecordDetails').addEventListener('click', () => {
    recordDetails.classList.add('hidden');
  });
}

clearRecordsBtn.addEventListener('click', async () => {
  if (!confirm('Clear all quiz records?')) return;
  try {
    await clearRecordsOnServer();
    renderRecords();
    renderAnalytics();
  } catch (err) {
    alert('Failed to clear records: ' + err.message);
  }
});

exportRecordsBtn.addEventListener('click', async () => {
  let records;
  try {
    records = await fetchRecordsFromServer();
  } catch (err) {
    alert('Failed to fetch records: ' + err.message);
    return;
  }

  if (records.length === 0) { alert('No records to export.'); return; }

  const headers = ['Date', 'Recommended Major', 'Match Percent', 'Alternative Major', 'Alternative Percent'];
  const rows    = records.map((r) => [r.date, r.topMajorTitle, r.matchPercent, r.secondMajorTitle, r.secondPercent]);
  const csv     = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'major-quiz-records.csv';
  link.click();
  URL.revokeObjectURL(url);
});

// ── analytics panel ───────────────────────────────────────────────────────────

async function renderAnalytics() {
  let records;
  try {
    records = await fetchRecordsFromServer();
  } catch (err) {
    analyticsChart.innerHTML = `<p>Failed to load analytics: ${escapeHtml(err.message)}</p>`;
    return;
  }

  totalRecords.textContent = records.length;

  if (records.length === 0) {
    topMajorStat.textContent   = 'None';
    averageMatch.textContent   = '0%';
    analyticsChart.innerHTML   = '<p>No analytics yet. Complete the quiz to generate records.</p>';
    return;
  }

  const analytics = calculateMajorAnalytics(records);
  let matchTotal = 0;

  records.forEach((record) => {
    matchTotal += Number(record.matchPercent || 0);
  });

  const topMajor = Object.entries(analytics.counts).sort((a, b) => b[1] - a[1])[0][0];
  topMajorStat.textContent = majorInfo[topMajor].title;
  averageMatch.textContent = `${Math.round(matchTotal / records.length)}%`;

  analyticsChart.innerHTML = Object.entries(analytics.counts).map(([major, count]) => {
    const percent = analytics.percentageFor(major);
    return `
      <div class="chart-bar">
        <strong>${majorInfo[major].title}</strong>
        <div class="chart-track"><div class="chart-fill" style="width:${percent}%"></div></div>
        <span>${count}</span>
      </div>`;
  }).join('');
}

// ── tab refresh ───────────────────────────────────────────────────────────────

document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tabButton) => {
  tabButton.addEventListener('shown.bs.tab', () => {
    renderRecords();
    renderAnalytics();
  });
});

// ── utils ─────────────────────────────────────────────────────────────────────

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

// ── init ──────────────────────────────────────────────────────────────────────

renderOptionInputs();

if (isLoggedIn()) {
  showDashboard();
} else {
  showLogin();
}
