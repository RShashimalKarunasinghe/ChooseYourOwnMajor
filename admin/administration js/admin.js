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
