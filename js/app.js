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
});