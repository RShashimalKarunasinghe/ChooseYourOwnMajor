const loginPanel = document.getElementById("loginPanel");
const dashboardPanel = document.getElementById("dashboardPanel");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const logoutBtn = document.getElementById("logoutBtn");
const questionForm = document.getElementById("questionForm");
const optionInputs = document.getElementById("optionInputs");
const questionsList = document.getElementById("questionsList");
const editIndex = document.getElementById("editIndex");
const questionText = document.getElementById("questionText");
const formTitle = document.getElementById("formTitle");
const clearFormBtn = document.getElementById("clearFormBtn");
const resetQuestionsBtn = document.getElementById("resetQuestionsBtn");
const recordsTable = document.getElementById("recordsTable");
const clearRecordsBtn = document.getElementById("clearRecordsBtn");
const exportRecordsBtn = document.getElementById("exportRecordsBtn");
const recordDetails = document.getElementById("recordDetails");
const totalRecords = document.getElementById("totalRecords");
const topMajorStat = document.getElementById("topMajorStat");
const averageMatch = document.getElementById("averageMatch");
const analyticsChart = document.getElementById("analyticsChart");
const languageManagementList = document.getElementById("languageManagementList");
const saveLanguagesBtn = document.getElementById("saveLanguagesBtn");
const resetLanguagesBtn = document.getElementById("resetLanguagesBtn");
const languageSaveMessage = document.getElementById("languageSaveMessage");

// Majors editor (JOE-9 / JOE-12)
const majorForm = document.getElementById("majorForm");
const majorsList = document.getElementById("majorsList");
const editMajorCode = document.getElementById("editMajorCode");
const majorCodeInput = document.getElementById("majorCodeInput");
const majorTitleInput = document.getElementById("majorTitleInput");
const majorCareersInput = document.getElementById("majorCareersInput");
const majorReasonInput = document.getElementById("majorReasonInput");
const majorExploreInput = document.getElementById("majorExploreInput");
const majorTagInput = document.getElementById("majorTagInput");
const majorFormTitle = document.getElementById("majorFormTitle");
const clearMajorFormBtn = document.getElementById("clearMajorFormBtn");

// Majors are loaded from the database, so this is derived rather than hardcoded
let majorKeys = [];
const adminUser = "admin";
const adminPass = "admin123";

/** Load majors from the database into majorInfo + majorKeys. */
async function refreshMajors() {
  const res = await fetch("get_majors.php");
  const majorsArray = await res.json();

  majorInfo = {};
  majorsArray.forEach(function (major) {
    majorInfo[major.code] = major;
  });

  majorKeys = Object.keys(majorInfo);
}

function isLoggedIn() {
  return sessionStorage.getItem("majorAdminLoggedIn") === "true";
}

function getRecords() {
  try {
    return JSON.parse(localStorage.getItem("majorQuizRecords") || "[]");
  } catch (error) {
    return [];
  }
}

function renderOptionInputs() {
  optionInputs.innerHTML = "";

  ["A", "B", "C", "D"].forEach((letter, index) => {
    const optionBlock = document.createElement("div");
    optionBlock.className = "col-12";
    optionBlock.innerHTML = `
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
            </div>`).join("")}
        </div>
        <p class="small text-secondary-emphasis mt-2 mb-0">Use 3 for the main matching major and 0 or 1 for weaker related majors.</p>
      </div>`;

    optionInputs.appendChild(optionBlock);
  });
}

async function showDashboard() {
  loginPanel.classList.add("hidden");
  dashboardPanel.classList.remove("hidden");

  // Majors must load first — the question editor builds score inputs from them
  try {
    await refreshMajors();
  } catch (err) {
    alert("Could not load majors from the database: " + err.message);
    return;
  }

  renderMajors();
  renderQuestions();
  renderRecords();
  renderAnalytics();
  renderLanguageManagement();
}

function renderLanguageManagement() {
  const enabledLanguages = getEnabledLanguages();

  languageManagementList.innerHTML = "";

  Object.entries(languageConfig).forEach(([code, language]) => {
    const isEnabled = enabledLanguages.includes(code);

    const card = document.createElement("div");

    card.className = "language-admin-card";

    card.innerHTML = `
      <div>
        <strong>${language.nativeName}</strong>
        <span>${language.name}</span>
      </div>

      <label class="language-switch">
        <input
          type="checkbox"
          class="language-toggle"
          value="${code}"
          ${isEnabled ? "checked" : ""}
          ${code === "en" ? "disabled" : ""}
        />

        <span>
          ${isEnabled ? "Enabled" : "Disabled"}
        </span>
      </label>
    `;

    languageManagementList.appendChild(card);
  });
}

function showLogin() {
  loginPanel.classList.remove("hidden");
  dashboardPanel.classList.add("hidden");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (username === adminUser && password === adminPass) {
    sessionStorage.setItem("majorAdminLoggedIn", "true");
    loginMessage.textContent = "";
    showDashboard();
  } else {
    loginMessage.textContent = "Incorrect username or password.";
  }
});

logoutBtn.addEventListener("click", () => {
  sessionStorage.removeItem("majorAdminLoggedIn");
  showLogin();
});

// ── Majors CRUD (JOE-9 / JOE-12) ──────────────────────────────────────────────
// Every change below is written straight to the `majors` table via
// manage_majors.php, so admin edits survive a reload and are shared by
// every visitor — not just this browser.

function renderMajors() {
  majorsList.innerHTML = "";

  majorKeys.forEach((code) => {
    const major = majorInfo[code];
    const div = document.createElement("div");
    div.className = "question-admin-card";
    div.innerHTML = `
      <div class="d-flex justify-content-between gap-3 flex-wrap">
        <div>
          <span class="section-label">Code: ${escapeHtml(code)}</span>
          <h5>${escapeHtml(major.title)}</h5>
          <p class="mb-0 text-secondary-emphasis">Tag: ${escapeHtml(major.personalityTags || "")}</p>
        </div>
        <div class="d-flex gap-2 align-items-start">
          <button class="btn btn--secondary btn-sm" data-edit-major="${escapeHtml(code)}">Edit</button>
          <button class="btn btn--secondary btn-sm" data-delete-major="${escapeHtml(code)}">Delete</button>
        </div>
      </div>`;
    majorsList.appendChild(div);
  });

  document.querySelectorAll("[data-edit-major]").forEach((btn) => {
    btn.addEventListener("click", () => loadMajorForEdit(btn.dataset.editMajor));
  });

  document.querySelectorAll("[data-delete-major]").forEach((btn) => {
    btn.addEventListener("click", () => deleteMajor(btn.dataset.deleteMajor));
  });
}

majorForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const isEditing = editMajorCode.value !== "";
  const code = isEditing
    ? editMajorCode.value
    : majorCodeInput.value.trim().toLowerCase();

  if (!code) {
    alert("Please enter a valid Major Code.");
    return;
  }

  const payload = {
    code:            code,
    title:           majorTitleInput.value.trim(),
    careers:         majorCareersInput.value.trim(),
    resultReason:    majorReasonInput.value.trim(),
    exploreText:     majorExploreInput.value.trim(),
    personalityTags: majorTagInput.value.trim()
  };

  const url = isEditing
    ? `manage_majors.php?code=${encodeURIComponent(code)}`
    : "manage_majors.php";

  try {
    const res = await fetch(url, {
      method: isEditing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

    // Re-read from the database so the UI reflects what was actually stored
    await refreshMajors();
    clearMajorForm();
    renderMajors();
    renderOptionInputs(); // question editor needs a score box for the new major

    alert("Major saved to the database.");
  } catch (err) {
    alert("Could not save major: " + err.message);
  }
});

function clearMajorForm() {
  editMajorCode.value = "";
  majorCodeInput.disabled = false;
  majorFormTitle.textContent = "Add New Major";
  majorForm.reset();
}

clearMajorFormBtn.addEventListener("click", clearMajorForm);

function loadMajorForEdit(code) {
  const major = majorInfo[code];
  if (!major) return;

  editMajorCode.value = code;
  majorCodeInput.value = code;
  majorCodeInput.disabled = true; // the code is the primary key — don't allow edits

  majorTitleInput.value = major.title || "";
  majorCareersInput.value = major.careers || "";
  majorReasonInput.value = major.resultReason || "";
  majorExploreInput.value = major.exploreText || "";
  majorTagInput.value = major.personalityTags || "";

  majorFormTitle.textContent = "Edit Major";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteMajor(code) {
  if (majorKeys.length <= 2) {
    alert("You must have at least two majors for the quiz to work.");
    return;
  }

  const title = majorInfo[code] ? majorInfo[code].title : code;
  if (!confirm(`Delete the ${title} major? This also removes its scores from all questions.`)) {
    return;
  }

  try {
    const res = await fetch(`manage_majors.php?code=${encodeURIComponent(code)}`, {
      method: "DELETE"
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);

    await refreshMajors();//bug
    clearMajorForm();
    renderMajors();
    renderOptionInputs();
  } catch (err) {
    alert("Could not delete major: " + err.message);
  }
}

function renderQuestions() {
  questionsList.innerHTML = "";

  if (questions.length === 0) {
    questionsList.innerHTML = `<p class="mb-0">No questions available. Add a question using the form.</p>`;
    return;
  }

  questions.forEach((question, index) => {
    const div = document.createElement("div");
    div.className = "question-admin-card";
    div.innerHTML = `
      <div class="d-flex justify-content-between gap-3 flex-wrap">
        <div>
          <span class="section-label">Question ${index + 1}</span>
          <h5>${escapeHtml(question.text)}</h5>
          <p class="mb-0 text-secondary-emphasis">${question.options.length} answer options</p>
        </div>
        <div class="d-flex gap-2">
          <button class="btn btn--secondary btn-sm" data-edit="${index}">Edit</button>
          <button class="btn btn--secondary btn-sm" data-delete="${index}">Delete</button>
        </div>
      </div>`;

    questionsList.appendChild(div);
  });

  document.querySelectorAll("[data-edit]").forEach((btn) => {
    btn.addEventListener("click", () => loadQuestionForEdit(Number(btn.dataset.edit)));
  });

  document.querySelectorAll("[data-delete]").forEach((btn) => {
    btn.addEventListener("click", () => deleteQuestion(Number(btn.dataset.delete)));
  });
}

function loadQuestionForEdit(index) {
  const question = questions[index];
  editIndex.value = index;
  formTitle.textContent = "Edit Question";
  questionText.value = question.text;

  question.options.forEach((option, i) => {
    document.querySelector(`.option-text[data-index="${i}"]`).value = option.text || "";
    document.querySelector(`.option-subtext[data-index="${i}"]`).value = option.subtext || "";
    document.querySelector(`.option-feedback[data-index="${i}"]`).value = option.feedback || "";

    majorKeys.forEach((major) => {
      const input = document.querySelector(`.option-score[data-index="${i}"][data-major="${major}"]`);
      input.value = option.scores && option.scores[major] ? option.scores[major] : 0;
    });
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteQuestion(index) {
  if (!confirm("Delete this question?")) {
    return;
  }

  const questionId = questions[index].id;

  try {
    const response = await fetch("update_questions.php", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId })
    });
    const result = await response.json();

    if (result.success) {
      // reload questions from database
      questions = await loadQuestions();
      userAnswers = new Array(questions.length).fill(null);
      clearQuestionForm();
      renderQuestions();
    } else {
      alert("Failed to delete question: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    alert("Error deleting question: " + error.message);
  }
}

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = questionText.value.trim();
  if (!text) {
    alert("Please enter the question text.");
    return;
  }

  const newQuestion = {
    text,
    options: ["A", "B", "C", "D"].map((letter, i) => {
      const scores = {};
      majorKeys.forEach((major) => {
        const score = Number(document.querySelector(`.option-score[data-index="${i}"][data-major="${major}"]`).value || 0);
        if (score > 0) {
          scores[major] = score;
        }
      });

      if (Object.keys(scores).length === 0) {
        scores.cs = 1;
      }

      return {
        key: letter,
        text: document.querySelector(`.option-text[data-index="${i}"]`).value.trim(),
        subtext: document.querySelector(`.option-subtext[data-index="${i}"]`).value.trim(),
        feedback: document.querySelector(`.option-feedback[data-index="${i}"]`).value.trim(),
        scores
      };
    })
  };

  const hasEmptyOption = newQuestion.options.some((option) => !option.text || !option.subtext || !option.feedback);
  if (hasEmptyOption) {
    alert("Please complete all option text, subtext, and feedback fields.");
    return;
  }

  try {
    let body;

    if (editIndex.value === "") {
      // adding a new question
      body = newQuestion;
    } else {
      // updating an existing question
      body = newQuestion;
      body.question_id = questions[Number(editIndex.value)].id;
    }

    const response = await fetch("update_questions.php", {
      method:  editIndex.value === "" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    const result = await response.json();

    if (result.success) {
      // reload questions from database
      questions = await loadQuestions();
      userAnswers = new Array(questions.length).fill(null);
      clearQuestionForm();
      renderQuestions();
      alert("Question saved successfully.");
    } else {
      alert("Failed to save question: " + (result.error || "Unknown error"));
    }
  } catch (error) {
    alert("Error saving question: " + error.message);
  }
});

function clearQuestionForm() {
  editIndex.value = "";
  formTitle.textContent = "Add Question";
  questionForm.reset();
  document.querySelectorAll(".option-score").forEach((input) => {
    input.value = 0;
  });
}

clearFormBtn.addEventListener("click", clearQuestionForm);

resetQuestionsBtn.addEventListener("click", () => {
  alert("To reset questions to default, re-run the SQL file (chooseyourmajor.sql) in your database.");
});

function renderRecords() {
  const records = getRecords();
  recordDetails.classList.add("hidden");
  recordDetails.innerHTML = "";

  if (records.length === 0) {
    recordsTable.innerHTML = `<tr><td colspan="6">No quiz records yet.</td></tr>`;
    return;
  }

  recordsTable.innerHTML = records.slice().reverse().map((record, index) => `
    <tr>
      <td>${records.length - index}</td>
      <td>${escapeHtml(record.date)}</td>
      <td>${escapeHtml(record.topMajorTitle)}</td>
      <td>${record.matchPercent}%</td>
      <td>${escapeHtml(record.secondMajorTitle)} (${record.secondPercent}%)</td>
      <td><button class="btn btn--secondary btn-sm" data-record="${record.id}">View</button></td>
    </tr>`).join("");

  document.querySelectorAll("[data-record]").forEach((btn) => {
    btn.addEventListener("click", () => showRecordDetails(Number(btn.dataset.record)));
  });
}

function showRecordDetails(recordId) {
  const record = getRecords().find((item) => item.id === recordId);

  if (!record) {
    return;
  }

  const answers = record.answers.map((answerIndex, questionIndex) => {
    const question = questions[questionIndex] || null;
    const option = question && question.options ? question.options[answerIndex] : null;
    return `
      <li>
        <strong>Q${questionIndex + 1}:</strong> ${escapeHtml(question ? question.text : "Question unavailable")}<br />
        <span>${escapeHtml(option ? option.text : "Answer unavailable")}</span>
      </li>`;
  }).join("");

  recordDetails.innerHTML = `
    <div class="d-flex justify-content-between gap-3 flex-wrap">
      <div>
        <p class="section-label">Record Details</p>
        <h4>${escapeHtml(record.topMajorTitle)} - ${record.matchPercent}%</h4>
        <p class="mb-2">Submitted: ${escapeHtml(record.date)}</p>
      </div>
      <button class="btn btn--secondary btn-sm" id="closeRecordDetails">Close</button>
    </div>
    <ul class="record-answer-list mt-3">${answers}</ul>`;

  recordDetails.classList.remove("hidden");

  document.getElementById("closeRecordDetails").addEventListener("click", () => {
    recordDetails.classList.add("hidden");
  });
}

clearRecordsBtn.addEventListener("click", () => {
  if (confirm("Clear all quiz records?")) {
    localStorage.removeItem("majorQuizRecords");
    renderRecords();
    renderAnalytics();
  }
});

exportRecordsBtn.addEventListener("click", exportRecordsAsCsv);

function exportRecordsAsCsv() {
  const records = getRecords();

  if (records.length === 0) {
    alert("There are no records to export.");
    return;
  }

  const headers = ["Date", "Recommended Major", "Match Percent", "Alternative Major", "Alternative Percent"];
  const rows = records.map((record) => [record.date, record.topMajorTitle, record.matchPercent, record.secondMajorTitle, record.secondPercent]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "major-quiz-records.csv";
  link.click();
  URL.revokeObjectURL(url);
}

function renderAnalytics() {
  const records = getRecords();
  totalRecords.textContent = records.length;

  if (records.length === 0) {
    topMajorStat.textContent = "None";
    averageMatch.textContent = "0%";
    analyticsChart.innerHTML = "<p>No analytics available yet. Complete the quiz to generate records.</p>";
    return;
  }

  const counts = { cs: 0, se: 0, cyber: 0, ds: 0 };
  let matchTotal = 0;

  records.forEach((record) => {
    if (counts[record.topMajor] !== undefined) {
      counts[record.topMajor]++;
    }
    matchTotal += Number(record.matchPercent || 0);
  });

  const topMajor = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  topMajorStat.textContent = majorInfo[topMajor].title;
  averageMatch.textContent = `${Math.round(matchTotal / records.length)}%`;

  analyticsChart.innerHTML = Object.entries(counts).map(([major, count]) => {
    const percent = Math.round((count / records.length) * 100);
    return `
      <div class="chart-bar">
        <strong>${majorInfo[major].title}</strong>
        <div class="chart-track"><div class="chart-fill" style="width:${percent}%"></div></div>
        <span>${count}</span>
      </div>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tabButton) => {
  tabButton.addEventListener("shown.bs.tab", () => {
    renderRecords();
    renderAnalytics();
  });
});

// data.js init() has already populated majorInfo by the time this file loads,
// so seed majorKeys from it before the first render.
majorKeys = Object.keys(majorInfo);

renderOptionInputs();

if (isLoggedIn()) {
  showDashboard();
} else {
  showLogin();
}
