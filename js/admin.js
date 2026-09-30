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
const quizStarts = document.getElementById("quizStarts");
const quizCompletions = document.getElementById("quizCompletions");
const quizAbandoned = document.getElementById("quizAbandoned");
const languageSelect = document.getElementById("languageSelect");

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

// ── Translation ──────────────────────────────────────────────────────────────
// All text comes from uiText in languages.js via t(). Fixed labels use
// data-i18n attributes (also inside generated HTML), so applyLanguage()
// updates them without redrawing — form fields keep what was typed.
// Text with values in it (counts, codes, dates) is redrawn on language change.

let loginFailed = false;          // show the "incorrect password" message
let languageMessageKey = null;    // message under the Manage Languages buttons
let openRecordId = null;          // record whose details are open

function renderLoginMessage() {
  loginMessage.textContent = loginFailed ? t("loginError") : "";
}

function renderLanguageMessage() {
  languageSaveMessage.textContent = languageMessageKey ? t(languageMessageKey) : "";
}

// Questions and majors are edited in English (that's what the database holds).
// When the card shows a translation, the English original goes underneath so
// it's clear what the edit form will change.
function englishOriginal(shown, english) {
  if (!english || shown === english) return "";
  return `<p class="admin-card-original" lang="en">EN: ${escapeHtml(english)}</p>`;
}

// Switch a heading to another key (e.g. Add Question -> Edit Question) and keep
// it that way when the language changes.
function setI18n(element, key) {
  element.dataset.i18n = key;
  element.textContent = t(key);
}

languageSelect.addEventListener("change", () => {
  saveSelectedLanguage(languageSelect.value);
  refreshAdminLanguage();
});

// Also used after Save / Reset in Manage Languages: if the current language
// was switched off, the menu and page drop back to English straight away.
function refreshAdminLanguage() {
  renderLanguageOptions(languageSelect);
  applyLanguage();
  renderLoginMessage();
  renderLanguageMessage();

  // Score box labels in the question editor (relabelled, not redrawn, so
  // anything typed in the form stays)
  document.querySelectorAll(".score-label").forEach((label) => {
    label.textContent = getMajorText(label.dataset.major, "title");
  });

  if (!dashboardPanel.classList.contains("hidden")) {
    renderMajors();
    renderQuestions();
    renderRecords();
    renderAnalytics();
  }
}

// ── Data ─────────────────────────────────────────────────────────────────────

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
        <h5><span data-i18n="optionWord">${t("optionWord")}</span> ${letter}</h5>
        <label class="form-label" data-i18n="answerText">${t("answerText")}</label>
        <input class="form-control mb-2 option-text" data-index="${index}" required />

        <label class="form-label" data-i18n="subtextLabel">${t("subtextLabel")}</label>
        <input class="form-control mb-2 option-subtext" data-index="${index}" required />

        <label class="form-label" data-i18n="feedbackLabel">${t("feedbackLabel")}</label>
        <input class="form-control mb-2 option-feedback" data-index="${index}" required />

        <div class="row g-2 mt-2">
          ${majorKeys.map((major) => `
            <div class="col-6 score-field">
              <label class="form-label score-label" data-major="${major}">${escapeHtml(getMajorText(major, "title"))}</label>
              <input class="form-control option-score" data-index="${index}" data-major="${major}" type="number" min="0" max="5" value="0" />
            </div>`).join("")}
        </div>
        <p class="small text-secondary-emphasis mt-2 mb-0" data-i18n="scoreHint">${t("scoreHint")}</p>
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
    alert(t("majorsLoadFailed") + err.message);
    return;
  }

  renderMajors();
  renderQuestions();
  renderRecords();
  renderAnalytics();
  renderLanguageManagement();
}

// ── Manage Languages ─────────────────────────────────────────────────────────

function renderLanguageManagement() {
  const enabledLanguages = getEnabledLanguages();

  languageManagementList.innerHTML = "";

  Object.entries(languageConfig).forEach(([code, language]) => {
    const isEnabled = enabledLanguages.includes(code);
    const stateKey = isEnabled ? "enabled" : "disabled";

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

        <span data-i18n="${stateKey}">${t(stateKey)}</span>
      </label>
    `;

    languageManagementList.appendChild(card);
  });

  languageManagementList.querySelectorAll(".language-toggle").forEach((toggle) => {
    toggle.addEventListener("change", () => {
      setI18n(toggle.nextElementSibling, toggle.checked ? "enabled" : "disabled");
      languageMessageKey = null;
      renderLanguageMessage();
    });
  });
}

// English can't be switched off (its checkbox is disabled, so add it back)
saveLanguagesBtn.addEventListener("click", () => {
  const enabled = ["en"];
  languageManagementList.querySelectorAll(".language-toggle:checked").forEach((toggle) => {
    if (!enabled.includes(toggle.value)) enabled.push(toggle.value);
  });

  saveEnabledLanguages(enabled);
  languageMessageKey = "languagesSaved";
  renderLanguageManagement();
  refreshAdminLanguage();
});

resetLanguagesBtn.addEventListener("click", () => {
  localStorage.removeItem("enabledLanguages");
  languageMessageKey = "languagesReset";
  renderLanguageManagement();
  refreshAdminLanguage();
});

// ── Login ────────────────────────────────────────────────────────────────────

function showLogin() {
  loginPanel.classList.remove("hidden");
  dashboardPanel.classList.add("hidden");
}

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  loginFailed = !(username === adminUser && password === adminPass);
  renderLoginMessage();

  if (!loginFailed) {
    sessionStorage.setItem("majorAdminLoggedIn", "true");
    showDashboard();
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
    const title = getMajorText(code, "title");
    const div = document.createElement("div");
    div.className = "question-admin-card";
    div.innerHTML = `
      <div class="admin-card-row">
        <div class="admin-card-text">
          <span class="section-label">${escapeHtml(t("majorCode", { code }))}</span>
          <h5>${escapeHtml(title)}</h5>
          ${englishOriginal(title, major.title)}
          <p class="mb-0 text-secondary-emphasis">${escapeHtml(t("majorTag", { tag: getMajorText(code, "personalityTags") }))}</p>
        </div>
        <div class="admin-card-actions">
          <button class="btn btn--secondary btn-sm" data-edit-major="${escapeHtml(code)}">${t("edit")}</button>
          <button class="btn btn--secondary btn-sm" data-delete-major="${escapeHtml(code)}">${t("delete")}</button>
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
    alert(t("enterMajorCode"));
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

    alert(t("majorSaved"));
  } catch (err) {
    alert(t("majorSaveFailed") + err.message);
  }
});

function clearMajorForm() {
  editMajorCode.value = "";
  majorCodeInput.disabled = false;
  setI18n(majorFormTitle, "addMajor");
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

  setI18n(majorFormTitle, "editMajor");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function deleteMajor(code) {
  if (majorKeys.length <= 2) {
    alert(t("minTwoMajors"));
    return;
  }

  const title = majorInfo[code] ? majorInfo[code].title : code;
  if (!confirm(t("confirmDeleteMajor", { title }))) {
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
    alert(t("majorDeleteFailed") + err.message);
  }
}

// ── Questions ────────────────────────────────────────────────────────────────

function renderQuestions() {
  questionsList.innerHTML = "";

  if (questions.length === 0) {
    questionsList.innerHTML = `<p class="mb-0" data-i18n="noQuestions">${t("noQuestions")}</p>`;
    return;
  }

  questions.forEach((question, index) => {
    const display = getDisplayQuestion(question);
    const div = document.createElement("div");
    div.className = "question-admin-card";
    div.innerHTML = `
      <div class="admin-card-row">
        <div class="admin-card-text">
          <span class="section-label">${t("questionNumber", { n: index + 1 })}</span>
          <h5>${escapeHtml(display.text)}</h5>
          ${englishOriginal(display.text, question.text)}
          <p class="mb-0 text-secondary-emphasis">${t("answerOptions", { count: question.options.length })}</p>
        </div>
        <div class="admin-card-actions">
          <button class="btn btn--secondary btn-sm" data-edit="${index}">${t("edit")}</button>
          <button class="btn btn--secondary btn-sm" data-delete="${index}">${t("delete")}</button>
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
  setI18n(formTitle, "editQuestion");
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
  if (!confirm(t("confirmDeleteQuestion"))) {
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
      alert(t("questionDeleteFailed") + (result.error || t("unknownError")));
    }
  } catch (error) {
    alert(t("questionDeleteError") + error.message);
  }
}

questionForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const text = questionText.value.trim();
  if (!text) {
    alert(t("enterQuestionText"));
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
    alert(t("completeOptions"));
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
      alert(t("questionSaved"));
    } else {
      alert(t("questionSaveFailed") + (result.error || t("unknownError")));
    }
  } catch (error) {
    alert(t("questionSaveError") + error.message);
  }
});

function clearQuestionForm() {
  editIndex.value = "";
  setI18n(formTitle, "addQuestion");
  questionForm.reset();
  document.querySelectorAll(".option-score").forEach((input) => {
    input.value = 0;
  });
}

clearFormBtn.addEventListener("click", clearQuestionForm);

resetQuestionsBtn.addEventListener("click", () => {
  alert(t("resetQuestionsInfo"));
});

// ── Records ──────────────────────────────────────────────────────────────────

function renderRecords() {
  const records = getRecords();
  recordDetails.classList.add("hidden");
  recordDetails.innerHTML = "";

  if (records.length === 0) {
    openRecordId = null;
    recordsTable.innerHTML = `<tr><td colspan="6" data-i18n="noRecords">${t("noRecords")}</td></tr>`;
    return;
  }

  recordsTable.innerHTML = records.slice().reverse().map((record, index) => `
    <tr>
      <td>${records.length - index}</td>
      <td>${escapeHtml(record.date)}</td>
      <td>${escapeHtml(recordMajorTitle(record.topMajor, record.topMajorTitle))}</td>
      <td>${record.matchPercent}%</td>
      <td>${escapeHtml(recordMajorTitle(record.secondMajor, record.secondMajorTitle))} (${record.secondPercent}%)</td>
      <td><button class="btn btn--secondary btn-sm" data-record="${record.id}" data-i18n="view">${t("view")}</button></td>
    </tr>`).join("");

  document.querySelectorAll("[data-record]").forEach((btn) => {
    btn.addEventListener("click", () => showRecordDetails(Number(btn.dataset.record)));
  });

  // Redrawn after a language change: keep the open record open
  if (openRecordId !== null) showRecordDetails(openRecordId);
}

// Major name for a saved record in the chosen language. A record can outlive
// its major (deleted in admin), so fall back to the title stored with it.
function recordMajorTitle(code, storedTitle) {
  return majorInfo[code] ? getMajorText(code, "title") : storedTitle;
}

function showRecordDetails(recordId) {
  const record = getRecords().find((item) => item.id === recordId);

  if (!record) {
    openRecordId = null;
    return;
  }
  openRecordId = recordId;

  const answers = record.answers.map((answerIndex, questionIndex) => {
    const question = questions[questionIndex] || null;
    const option = question && question.options ? question.options[answerIndex] : null;
    const display = question ? getDisplayQuestion(question) : null;
    const answerText = answerIndex === null
      ? t("skippedAnswer")
      : (option ? display.options[answerIndex].text : t("answerUnavailable"));
    return `
      <li>
        <strong>${escapeHtml(t("questionShort", { n: questionIndex + 1 }))}:</strong> ${escapeHtml(display ? display.text : t("questionUnavailable"))}<br />
        <span>${escapeHtml(answerText)}</span>
      </li>`;
  }).join("");

  recordDetails.innerHTML = `
    <div class="d-flex justify-content-between gap-3 flex-wrap">
      <div>
        <p class="section-label">${t("recordDetails")}</p>
        <h4>${escapeHtml(recordMajorTitle(record.topMajor, record.topMajorTitle))} - ${record.matchPercent}%</h4>
        <p class="mb-2">${escapeHtml(t("submittedOn", { date: record.date }))}</p>
      </div>
      <button class="btn btn--secondary btn-sm" id="closeRecordDetails">${t("close")}</button>
    </div>
    <ul class="record-answer-list mt-3">${answers}</ul>`;

  recordDetails.classList.remove("hidden");

  document.getElementById("closeRecordDetails").addEventListener("click", () => {
    openRecordId = null;
    recordDetails.classList.add("hidden");
  });
}

clearRecordsBtn.addEventListener("click", () => {
  if (confirm(t("confirmClearRecords"))) {
    localStorage.removeItem("majorQuizRecords");
    openRecordId = null;
    renderRecords();
    renderAnalytics();
  }
});

exportRecordsBtn.addEventListener("click", exportRecordsAsCsv);

// CSV headers stay in English so exported files are the same whoever exports them
function exportRecordsAsCsv() {
  const records = getRecords();

  if (records.length === 0) {
    alert(t("noRecordsToExport"));
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

// ── Analytics  JOE-31 ────────────────────────────────────────────────────────────────

function renderQuizStats() {
  let stats = {};
  try {
    stats = JSON.parse(localStorage.getItem("majorQuizStats") || "{}");
  } catch (e) { /* corrupted — show zeros */ }

  const starts = stats.starts || 0;
  const completions = stats.completions || 0;
  quizStarts.textContent = starts;
  quizCompletions.textContent = completions;
  quizAbandoned.textContent = Math.max(starts - completions, 0);
}

function renderAnalytics() {
  const records = getRecords();
  totalRecords.textContent = records.length;
  renderQuizStats();

  if (records.length === 0) {
    topMajorStat.textContent = t("none");
    averageMatch.textContent = "0%";
    analyticsChart.innerHTML = `<p data-i18n="noAnalytics">${t("noAnalytics")}</p>`;
    return;
  }

  // Every current major, so majors added in admin show up too
  const counts = {};
  majorKeys.forEach((code) => { counts[code] = 0; });
  let matchTotal = 0;

  records.forEach((record) => {
    if (counts[record.topMajor] !== undefined) {
      counts[record.topMajor]++;
    }
    matchTotal += Number(record.matchPercent || 0);
  });

  const topMajor = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
  topMajorStat.textContent = getMajorText(topMajor, "title");
  averageMatch.textContent = `${Math.round(matchTotal / records.length)}%`;

  analyticsChart.innerHTML = Object.entries(counts).map(([major, count]) => {
    const percent = Math.round((count / records.length) * 100);
    return `
      <div class="chart-bar">
        <strong>${escapeHtml(getMajorText(major, "title"))}</strong>
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

refreshAdminLanguage();

if (isLoggedIn()) {
  showDashboard();
} else {
  showLogin();
}
