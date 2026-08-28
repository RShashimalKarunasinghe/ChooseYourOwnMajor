<<<<<<< Updated upstream
startBtn.addEventListener("click", () => {
  showQuizSection();
  renderCurrentQuestion();
});

prevBtn.addEventListener("click", () => {
  goToPreviousQuestion();
  renderCurrentQuestion();
});

nextBtn.addEventListener("click", () => {
  if (!isCurrentQuestionAnswered()) {
    formMessage.textContent = "Please select an option before continuing.";
    return;
  }

  goToNextQuestion();
  renderCurrentQuestion();
});

document.getElementById("quizForm").addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuiz();
});

restartBtn.addEventListener("click", () => {
  resetQuizState();
  resetUI();
});

function submitQuiz() {
  if (!isCurrentQuestionAnswered()) {
    formMessage.textContent = "Please select an option before submitting the quiz.";
    return;
  }

  const result = calculateResult();
  saveQuizRecord(result);
  renderResult(result);
  showResultSection();
}

function saveQuizRecord(result) {
  const records = JSON.parse(localStorage.getItem("majorQuizRecords") || "[]");

  records.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    topMajor: result.topMajor,
    topMajorTitle: majorInfo[result.topMajor].title,
    matchPercent: result.topPercent,
    secondMajor: result.secondMajor,
    secondMajorTitle: majorInfo[result.secondMajor].title,
    secondPercent: result.secondPercent,
    answers: [...userAnswers],
    totals: result.totals
  });

  localStorage.setItem("majorQuizRecords", JSON.stringify(records));
}

window.addEventListener("DOMContentLoaded", () => {
  resetUI();
});
=======
async function loadQuizQuestions() {
  try {
    const response = await fetch("/api/questions?published=true");
    if (!response.ok) {
      throw new Error("Unable to load quiz questions.");
    }

    const allPublished = await response.json();
    const activeQuestionIds = JSON.parse(localStorage.getItem("activeQuestions")) || [];

    if (activeQuestionIds.length === 0) {
      questions = allPublished;
    } else {
      questions = allPublished.filter((q) => activeQuestionIds.includes(q.id));
    }

    resetQuizState();

    if (questions.length === 0) {
      formMessage.textContent = "No quiz questions are available yet. Please add them from the admin page.";
      startBtn.disabled = true;
      return;
    }

    formMessage.textContent = "";
    startBtn.disabled = false;
  } catch (error) {
    formMessage.textContent = "Unable to connect to the question database. Check the server.";
    console.error(error);
    startBtn.disabled = true;
  }
}

startBtn.addEventListener("click", () => {
  showQuizSection();
  renderCurrentQuestion();
});

prevBtn.addEventListener("click", () => {
  goToPreviousQuestion();
  renderCurrentQuestion();
});

nextBtn.addEventListener("click", () => {
  if (!isCurrentQuestionAnswered()) {
    formMessage.textContent = "Please select an option before continuing.";
    return;
  }

  goToNextQuestion();
  renderCurrentQuestion();
});

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();

  if (!isCurrentQuestionAnswered()) {
    formMessage.textContent = "Please select an option before submitting the quiz.";
    return;
  }

  const result = calculateResult();
  renderResult(result);
  showResultSection();
});

restartBtn.addEventListener("click", () => {
  resetQuizState();
  resetUI();
});

window.addEventListener("DOMContentLoaded", () => {
  resetUI();
  startBtn.disabled = true;
  loadQuizQuestions();
});
>>>>>>> Stashed changes
