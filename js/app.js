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
