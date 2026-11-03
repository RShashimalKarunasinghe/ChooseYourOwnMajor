// js/app.js
// Initialises the quiz page. Majors and questions are loaded from the database.

window.addEventListener('DOMContentLoaded', async () => {
  resetUI();
  renderLanguageOptions();
  applyLanguage();
  setupAccessibility();

  try {
    await loadMajorInfoFromServer();
    questions = await loadQuestionsFromServer();
    // Keep userAnswers in sync with however many questions were returned
    userAnswers.length = 0;
    for (let i = 0; i < questions.length; i++) userAnswers.push(null);
  } catch (err) {
    console.error('Could not load questions:', err);
    alert(t('serverError'));
    return;
  }

  await loadContentTranslations(getLanguage());

  // Resume an unfinished quiz if one was saved in this browser
  if (questions.length > 0) loadProgress();
  applyLanguage();
  updateQuizStats();

  startBtn.addEventListener('click', () => {
    if (questions.length === 0) return;
    showQuizSection();
    renderCurrentQuestion();
    updateQuizStats();
  });

  prevBtn.addEventListener('click', () => {
    goToPreviousQuestion();
    renderCurrentQuestion();
    updateNextButtonLabel();
  });

  nextBtn.addEventListener('click', () => {
    if (!isCurrentQuestionAnswered()) {
      showSkippedMessage();
    } else {
      currentMessageType = null;
      formMessage.textContent = '';
    }
    goToNextQuestion();
    renderCurrentQuestion();
    updateNextButtonLabel();
    updateQuizStats();
  });

  document.getElementById('quizForm').addEventListener('submit', (event) => {
    event.preventDefault();
    submitQuiz();
  });

  restartBtn.addEventListener('click', () => {
    resetQuizState();
    resetUI();
    applyLanguage();
    updateQuizStats();
  });

  document.getElementById('languageSelect').addEventListener('change', async (event) => {
    setLanguage(event.target.value);
    applyLanguage();                                 // interface text switches straight away
    await loadContentTranslations(getLanguage());    // then quiz/result text from the database
    refreshLanguage();
  });
});

/** Re-draw everything that is currently on screen in the selected language. */
function refreshLanguage() {
  applyLanguage();
  if (!quizSection.classList.contains('hidden')) {
    renderCurrentQuestion();
    restoreMessage();
  }
  if (!resultSection.classList.contains('hidden') && currentResult) {
    renderResult(currentResult);
  }
  updateQuizStats();
}

async function submitQuiz() {
  if (!areAllQuestionsAnswered()) {
    showValidationMessage();
    return;
  }

  const result = calculateResult();
  currentResult = result;

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

  clearProgress();
  showResultSection();
  await renderResult(result);
}

// ── accessibility: text size and high-contrast mode ──────────────────────────

function setupAccessibility() {
  const MIN = 12, MAX = 24, STEP = 2;
  let fontSize = 16;
  const contrastToggle = document.getElementById('contrastToggle');

  const read = (key) => { try { return localStorage.getItem(key); } catch (e) { return null; } };
  const write = (key, value) => { try { localStorage.setItem(key, value); } catch (e) {} };

  const savedSize = Number(read('fontSize'));
  if (savedSize >= MIN && savedSize <= MAX) fontSize = savedSize;
  document.documentElement.style.fontSize = fontSize + 'px';

  const applyContrast = (on) => {
    document.body.classList.toggle('high-contrast', on);
    contrastToggle.setAttribute('aria-pressed', String(on));
  };
  applyContrast(read('highContrast') === '1');

  const setSize = (size) => {
    fontSize = Math.min(MAX, Math.max(MIN, size));
    document.documentElement.style.fontSize = fontSize + 'px';
    write('fontSize', fontSize);
  };

  document.getElementById('increaseFont').addEventListener('click', () => setSize(fontSize + STEP));
  document.getElementById('decreaseFont').addEventListener('click', () => setSize(fontSize - STEP));
  contrastToggle.addEventListener('click', () => {
    const on = !document.body.classList.contains('high-contrast');
    applyContrast(on);
    write('highContrast', on ? '1' : '0');
  });
}
