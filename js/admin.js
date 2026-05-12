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
