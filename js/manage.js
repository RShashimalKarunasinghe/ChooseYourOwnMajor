const questionList = document.getElementById("questionList");
const activeQuestionList = document.getElementById("activeQuestionList");
const messageBox = document.getElementById("message");
const refreshBtn = document.getElementById("refreshBtn");
const activeCount = document.getElementById("activeCount");

let allPublishedQuestions = [];
let activeQuestions = [];

function setMessage(text, type = "success") {
  messageBox.className = `alert alert-${type}`;
  messageBox.textContent = text;
  messageBox.classList.remove("d-none");
}

function clearMessage() {
  messageBox.classList.add("d-none");
  messageBox.textContent = "";
}

async function loadQuestions() {
  try {
    const response = await fetch("/api/questions");
    if (!response.ok) {
      throw new Error("Unable to load questions.");
    }

    const allQuestions = await response.json();
    allPublishedQuestions = allQuestions.filter((q) => q.status === "published");
    activeQuestions = JSON.parse(localStorage.getItem("activeQuestions")) || [];

    renderQuestions();
    updateActiveCount();
  } catch (error) {
    setMessage(error.message, "danger");
  }
}

function saveActiveQuestions() {
  localStorage.setItem("activeQuestions", JSON.stringify(activeQuestions));
}

function renderQuestions() {
  if (!allPublishedQuestions.length) {
    questionList.innerHTML = `<div class="col-12"><div class="alert alert-info">No published questions available.</div></div>`;
    return;
  }

  questionList.innerHTML = allPublishedQuestions
    .map((question) => {
      const isActive = activeQuestions.includes(question.id);
      const optionHtml = question.options
        .sort((a, b) => a.key.localeCompare(b.key))
        .map((option) => `<small class="d-block text-muted">${option.key}. ${option.text}</small>`)
        .join("");

      return `
        <div class="col-lg-6">
          <div class="card h-100 ${isActive ? "border-success" : ""}">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                <h6 class="card-title mb-0">ID ${question.id}: ${question.text}</h6>
                ${isActive ? '<span class="badge bg-success">Active</span>' : ""}
              </div>
              <div class="mb-3">${optionHtml}</div>
              <button 
                data-action="${isActive ? "remove" : "add"}" 
                data-id="${question.id}" 
                class="btn btn-sm ${isActive ? "btn-outline-danger" : "btn-outline-success"} w-100"
              >
                ${isActive ? "Remove from Quiz" : "Add to Quiz"}
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderActiveQuestions() {
  const active = allPublishedQuestions.filter((q) => activeQuestions.includes(q.id));

  if (!active.length) {
    activeQuestionList.innerHTML = `<div class="col-12"><div class="alert alert-warning">No questions added to the quiz yet. Add some from the published list above.</div></div>`;
    return;
  }

  activeQuestionList.innerHTML = active
    .map((question, index) => {
      const optionHtml = question.options
        .sort((a, b) => a.key.localeCompare(b.key))
        .map((option) => `<small class="d-block text-muted">${option.key}. ${option.text}</small>`)
        .join("");

      return `
        <div class="col-lg-6">
          <div class="card border-success h-100">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start gap-3 mb-2">
                <h6 class="card-title mb-0">Question ${index + 1} - ID ${question.id}</h6>
                <span class="badge bg-success">Active</span>
              </div>
              <p class="mb-2"><strong>${question.text}</strong></p>
              <div class="mb-3">${optionHtml}</div>
              <button 
                data-action="remove" 
                data-id="${question.id}" 
                class="btn btn-sm btn-outline-danger w-100"
              >
                Remove from Quiz
              </button>
            </div>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateActiveCount() {
  activeCount.textContent = activeQuestions.length;
}

async function handleQuestionAction(event) {
  const button = event.target.closest("button");
  if (!button) return;

  const action = button.dataset.action;
  const questionId = Number(button.dataset.id);
  if (!questionId) return;

  if (action === "add") {
    if (!activeQuestions.includes(questionId)) {
      activeQuestions.push(questionId);
      saveActiveQuestions();
      renderQuestions();
      renderActiveQuestions();
      updateActiveCount();
      setMessage("Question added to quiz.");
    }
  }

  if (action === "remove") {
    activeQuestions = activeQuestions.filter((id) => id !== questionId);
    saveActiveQuestions();
    renderQuestions();
    renderActiveQuestions();
    updateActiveCount();
    setMessage("Question removed from quiz.");
  }
}

function initManage() {
  loadQuestions();
  questionList.addEventListener("click", handleQuestionAction);
  activeQuestionList.addEventListener("click", handleQuestionAction);
  refreshBtn.addEventListener("click", loadQuestions);
}

window.addEventListener("DOMContentLoaded", initManage);
