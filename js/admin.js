<<<<<<< Updated upstream
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

const majorKeys = ["cs", "se", "cyber", "ds"];
const adminUser = "admin";
const adminPass = "admin123";

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

function showDashboard() {
  loginPanel.classList.add("hidden");
  dashboardPanel.classList.remove("hidden");
  renderQuestions();
  renderRecords();
  renderAnalytics();
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

function deleteQuestion(index) {
  if (!confirm("Delete this question?")) {
    return;
  }

  questions.splice(index, 1);
  saveQuestionsToStorage(questions);
  clearQuestionForm();
  renderQuestions();
}

questionForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = questionText.value.trim();
  if (!text) {
    alert("Please enter the question text.");
    return;
  }

  const newQuestion = {
    id: editIndex.value === "" ? Date.now() : questions[Number(editIndex.value)].id,
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

  if (editIndex.value === "") {
    questions.push(newQuestion);
  } else {
    questions[Number(editIndex.value)] = newQuestion;
  }

  saveQuestionsToStorage(questions);
  clearQuestionForm();
  renderQuestions();
  alert("Question saved successfully.");
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
  if (confirm("Reset all questions to the default version?")) {
    questions = JSON.parse(JSON.stringify(defaultQuestions));
    saveQuestionsToStorage(questions);
    clearQuestionForm();
    renderQuestions();
  }
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
    const question = questions[questionIndex] || defaultQuestions[questionIndex];
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

renderOptionInputs();

if (isLoggedIn()) {
  showDashboard();
} else {
  showLogin();
}
=======
const questionForm = document.getElementById("questionForm");
const questionIdInput = document.getElementById("questionId");
const questionTextInput = document.getElementById("questionText");
const optionCountInput = document.getElementById("optionCount");
const optionFields = document.getElementById("optionFields");
const questionList = document.getElementById("questionList");
const messageBox = document.getElementById("message");
const publishBtn = document.getElementById("publishBtn");
const draftBtn = document.getElementById("draftBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const refreshBtn = document.getElementById("refreshBtn");

const allOptionKeys = ["A", "B", "C", "D", "E", "F"];
let optionKeys = allOptionKeys.slice(0, 4);
let editingQuestionId = null;
let currentQuestions = [];

function getOptionCount() {
  const value = Number(optionCountInput.value);
  const safeValue = Number.isInteger(value) ? Math.max(2, Math.min(6, value)) : 4;
  optionCountInput.value = safeValue;
  return safeValue;
}

function updateOptionKeys() {
  optionKeys = allOptionKeys.slice(0, getOptionCount());
}

function createOptionField(key) {
  return `
    <div class="col-12">
      <div class="card card-body bg-light">
        <div class="mb-3 d-flex align-items-center justify-content-between">
          <strong>Option ${key}</strong>
          <span class="badge bg-secondary">Weighting</span>
        </div>
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label" for="option-${key}-text">Answer text</label>
            <input id="option-${key}-text" class="form-control" type="text" required />
          </div>
          <div class="col-md-6">
            <label class="form-label" for="option-${key}-subtext">Subtext</label>
            <input id="option-${key}-subtext" class="form-control" type="text" />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="option-${key}-cs">CS score</label>
            <input id="option-${key}-cs" class="form-control" type="number" value="0" />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="option-${key}-se">SE score</label>
            <input id="option-${key}-se" class="form-control" type="number" value="0" />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="option-${key}-cyber">Cyber score</label>
            <input id="option-${key}-cyber" class="form-control" type="number" value="0" />
          </div>
          <div class="col-md-3">
            <label class="form-label" for="option-${key}-ds">DS score</label>
            <input id="option-${key}-ds" class="form-control" type="number" value="0" />
          </div>
          <div class="col-12">
            <label class="form-label" for="option-${key}-feedback">Feedback</label>
            <textarea id="option-${key}-feedback" class="form-control" rows="2"></textarea>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderOptionFields() {
  updateOptionKeys();
  optionFields.innerHTML = optionKeys.map((key) => createOptionField(key)).join("");
}

function setMessage(text, type = "success") {
  messageBox.className = `alert alert-${type}`;
  messageBox.textContent = text;
  messageBox.classList.remove("d-none");
}

function clearMessage() {
  messageBox.classList.add("d-none");
  messageBox.textContent = "";
}

function getOptionData(key) {
  const text = document.getElementById(`option-${key}-text`).value.trim();
  const subtext = document.getElementById(`option-${key}-subtext`).value.trim();
  const cs = Number(document.getElementById(`option-${key}-cs`).value) || 0;
  const se = Number(document.getElementById(`option-${key}-se`).value) || 0;
  const cyber = Number(document.getElementById(`option-${key}-cyber`).value) || 0;
  const ds = Number(document.getElementById(`option-${key}-ds`).value) || 0;
  const feedback = document.getElementById(`option-${key}-feedback`).value.trim();

  return {
    key,
    text,
    subtext,
    scores: { cs, se, cyber, ds },
    feedback
  };
}

function buildPayload(status = "published") {
  const questionText = questionTextInput.value.trim();
  const questionId = questionIdInput.value ? Number(questionIdInput.value) : undefined;

  if (!questionText) {
    throw new Error("Please enter the question text.");
  }

  const options = optionKeys.map(getOptionData);

  for (const option of options) {
    if (!option.text) {
      throw new Error(`Please enter the text for option ${option.key}.`);
    }
    if (!option.feedback) {
      throw new Error(`Please enter feedback for option ${option.key}.`);
    }
  }

  return {
    ...(questionId ? { id: questionId } : {}),
    text: questionText,
    status,
    options
  };
}

function populateForm(question) {
  editingQuestionId = question.id;
  questionIdInput.value = question.id;
  questionIdInput.disabled = true;
  questionTextInput.value = question.text;
  optionCountInput.value = question.options.length;
  renderOptionFields();

  optionKeys.forEach((key) => {
    const option = question.options.find((entry) => entry.key === key);
    if (!option) return;

    document.getElementById(`option-${key}-text`).value = option.text;
    document.getElementById(`option-${key}-subtext`).value = option.subtext || "";
    document.getElementById(`option-${key}-cs`).value = option.scores.cs || 0;
    document.getElementById(`option-${key}-se`).value = option.scores.se || 0;
    document.getElementById(`option-${key}-cyber`).value = option.scores.cyber || 0;
    document.getElementById(`option-${key}-ds`).value = option.scores.ds || 0;
    document.getElementById(`option-${key}-feedback`).value = option.feedback || "";
  });

  publishBtn.textContent = "Update & Publish";
  draftBtn.textContent = "Save Changes as Draft";
  cancelEditBtn.classList.remove("d-none");
  clearMessage();
}

function resetForm() {
  editingQuestionId = null;
  questionIdInput.value = "";
  questionIdInput.disabled = false;
  questionTextInput.value = "";
  optionCountInput.value = 4;
  renderOptionFields();
  optionKeys.forEach((key) => {
    document.getElementById(`option-${key}-text`).value = "";
    document.getElementById(`option-${key}-subtext`).value = "";
    document.getElementById(`option-${key}-cs`).value = "0";
    document.getElementById(`option-${key}-se`).value = "0";
    document.getElementById(`option-${key}-cyber`).value = "0";
    document.getElementById(`option-${key}-ds`).value = "0";
    document.getElementById(`option-${key}-feedback`).value = "";
  });
  publishBtn.textContent = "Publish Question";
  draftBtn.textContent = "Save as Draft";
  cancelEditBtn.classList.add("d-none");
  clearMessage();
}

async function fetchQuestions() {
  try {
    const response = await fetch("/api/questions");
    if (!response.ok) {
      throw new Error("Unable to load questions.");
    }
    currentQuestions = await response.json();
    renderQuestionList();
  } catch (error) {
    setMessage(error.message, "danger");
  }
}

function renderQuestionList() {
  if (!currentQuestions.length) {
    questionList.innerHTML = `<div class="alert alert-info">No questions found yet. Add one with the editor above.</div>`;
    return;
  }

  questionList.innerHTML = currentQuestions
    .map((question) => {
      const isDraft = question.status === "draft";
      const statusBadge = isDraft ? `<span class="badge bg-warning">Draft</span>` : `<span class="badge bg-success">Published</span>`;
      const optionHtml = question.options
        .sort((a, b) => a.key.localeCompare(b.key))
        .map((option) => {
          return `
            <div class="mb-2">
              <strong>${option.key}.</strong> ${option.text}
              <div class="small text-muted">CS ${option.scores.cs} · SE ${option.scores.se} · Cyber ${option.scores.cyber} · DS ${option.scores.ds}</div>
            </div>
          `;
        })
        .join("");

      return `
        <div class="card mb-3 ${isDraft ? "border-warning" : ""}">
          <div class="card-body">
            <div class="d-flex flex-column flex-md-row justify-content-between gap-3 align-items-start">
              <div>
                <div class="d-flex align-items-center gap-2 mb-2">
                  <h3 class="h6 mb-0">ID ${question.id}: ${question.text}</h3>
                  ${statusBadge}
                </div>
                ${optionHtml}
              </div>
              <div class="d-flex flex-column gap-2">
                <button data-action="edit" data-id="${question.id}" class="btn btn-outline-primary btn-sm">Edit</button>
                ${isDraft ? `<button data-action="publish" data-id="${question.id}" class="btn btn-success btn-sm">Publish</button>` : ""}
                <button data-action="delete" data-id="${question.id}" class="btn btn-outline-danger btn-sm">Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

async function submitQuestion(event, status = "published") {
  event.preventDefault();

  try {
    const payload = buildPayload(status);
    let response;

    if (editingQuestionId) {
      response = await fetch(`/api/questions/${editingQuestionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } else {
      response = await fetch("/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    }

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to save question.");
    }

    const action = status === "draft" ? "saved as draft" : "published";
    setMessage(editingQuestionId ? `Question ${action} successfully.` : `Question ${action} successfully.`);
    resetForm();
    await fetchQuestions();
  } catch (error) {
    setMessage(error.message, "danger");
  }
}

async function publishQuestion(questionId) {
  try {
    const response = await fetch(`/api/questions/${questionId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "published" })
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to publish question.");
    }

    setMessage("Question published successfully.");
    await fetchQuestions();
  } catch (error) {
    setMessage(error.message, "danger");
  }
}

async function handleListClick(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const questionId = Number(button.dataset.id);
  if (!questionId) return;

  if (action === "edit") {
    const question = currentQuestions.find((item) => item.id === questionId);
    if (!question) return;
    populateForm(question);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (action === "publish") {
    await publishQuestion(questionId);
  }

  if (action === "delete") {
    if (!confirm(`Delete question ${questionId}? This cannot be undone.`)) {
      return;
    }
    await deleteQuestion(questionId);
  }
}

async function deleteQuestion(questionId) {
  try {
    const response = await fetch(`/api/questions/${questionId}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Unable to delete question.");
    }
    setMessage("Question deleted successfully.");
    await fetchQuestions();
  } catch (error) {
    setMessage(error.message, "danger");
  }
}

function cancelEdit() {
  resetForm();
}

function initAdmin() {
  renderOptionFields();
  fetchQuestions();
  optionCountInput.addEventListener("change", renderOptionFields);
  publishBtn.addEventListener("click", (e) => submitQuestion(e, "published"));
  draftBtn.addEventListener("click", (e) => submitQuestion(e, "draft"));
  questionList.addEventListener("click", handleListClick);
  cancelEditBtn.addEventListener("click", cancelEdit);
  refreshBtn.addEventListener("click", fetchQuestions);
}

window.addEventListener("DOMContentLoaded", initAdmin);
>>>>>>> Stashed changes
