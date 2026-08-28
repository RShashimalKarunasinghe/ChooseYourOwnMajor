// js/app.js
// Initialises the quiz page. Loads questions from MySQL on page load.

window.addEventListener('DOMContentLoaded', async () => {
  resetUI();

  try {
    await loadMajorInfoFromServer();
    questions = await loadQuestionsFromServer();
    // Keep userAnswers in sync with however many questions were returned
    userAnswers.length = 0;
    for (let i = 0; i < questions.length; i++) userAnswers.push(null);
  } catch (err) {
    console.error('Could not load questions:', err);
    alert('Could not connect to the server. Make sure XAMPP is running and the database is set up.');
    return;
  }

  startBtn.addEventListener('click', () => {
    showQuizSection();
    renderCurrentQuestion();
  });

  prevBtn.addEventListener('click', () => {
    goToPreviousQuestion();
    renderCurrentQuestion();
  });

  nextBtn.addEventListener('click', () => {
    if (!isCurrentQuestionAnswered()) {
      formMessage.textContent = 'Please select an option before continuing.';
      return;
    }
    goToNextQuestion();
    renderCurrentQuestion();
  });

  document.getElementById('quizForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuiz();
  });

  restartBtn.addEventListener('click', () => {
    resetQuizState();
    resetUI();
  });
});

async function submitQuiz() {
  if (!isCurrentQuestionAnswered()) {
    formMessage.textContent = 'Please select an option before submitting the quiz.';
    return;
  }

  const result = calculateResult();

  try {
    await saveRecordToServer({
      topMajor:         result.topMajor,
      topMajorTitle:    majorInfo[result.topMajor].title,
      matchPercent:     result.topPercent,
      secondMajor:      result.secondMajor,
      secondMajorTitle: majorInfo[result.secondMajor].title,
      secondPercent:    result.secondPercent,
      answers:          [...userAnswers],
      totals:           result.totals
    });
  } catch (err) {
    console.error('Could not save record:', err);
    // Non-fatal — still show result even if save fails
  }

  await renderResult(result);
  showResultSection();
}
