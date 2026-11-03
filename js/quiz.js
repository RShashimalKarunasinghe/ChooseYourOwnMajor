// js/quiz.js
// Quiz state and scoring. Questions come from the database (see data.js / app.js).

let currentQuestionIndex = 0;
const userAnswers = []; // populated after questions load from server (see app.js)

const PROGRESS_KEY = 'quizProgress';

function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

function saveAnswer(questionIndex, optionIndex) {
  userAnswers[questionIndex] = optionIndex;
  saveProgress();
}

function getSavedAnswer(questionIndex) {
  return userAnswers[questionIndex];
}

function isCurrentQuestionAnswered() {
  return userAnswers[currentQuestionIndex] !== null;
}

function goToNextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    saveProgress();
  }
}

function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    saveProgress();
  }
}

function isLastQuestion() {
  return currentQuestionIndex === questions.length - 1;
}

function getProgressPercent() {
  return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
}

function calculateResult() {
  const totals = Object.fromEntries(majorKeys.map((major) => [major, 0]));

  userAnswers.forEach((selectedOptionIndex, questionIndex) => {
    const option = questions[questionIndex].options[selectedOptionIndex];
    if (!option) return;

    Object.entries(option.scores).forEach(([major, score]) => {
      // Ignore scores for majors an admin has since removed.
      if (major in totals) totals[major] += score;
    });
  });

  const ranking = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);

  const [topMajor, topScore] = ranking[0];
  const [secondMajor, secondScore] = ranking[1];

  const totalPoints = Object.values(totals).reduce((sum, score) => sum + score, 0);
  const topPercent = totalPoints ? Math.round((topScore / totalPoints) * 100) : 0;
  const secondPercent = totalPoints ? Math.round((secondScore / totalPoints) * 100) : 0;

  return {
    totals,
    topMajor,
    secondMajor,
    topPercent,
    secondPercent
  };
}

function buildPersonalitySummary(result) {
  const rankedMajors = Object.entries(result.totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([major]) => personalityTags[major]);

  return rankedMajors;
}

function resetQuizState() {
  currentQuestionIndex = 0;
  for (let i = 0; i < userAnswers.length; i++) {
    userAnswers[i] = null;
  }
  clearProgress();
}

// ── answered / skipped tracking ───────────────────────────────────────────────

function areAllQuestionsAnswered() {
  return userAnswers.every((answer) => answer !== null);
}

/** Question numbers (1-based) that have no answer yet. */
function findAllUnanswered() {
  const missing = [];
  userAnswers.forEach((answer, index) => {
    if (answer === null) missing.push(index + 1);
  });
  return missing;
}

// ── saved progress (resume later) ─────────────────────────────────────────────
// Progress is stored in this browser only, together with the ids of the
// questions it belongs to, so it is ignored if an admin changes the quiz.

function saveProgress() {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify({
      questionIds: questions.map((q) => q.id),
      currentQuestionIndex,
      userAnswers
    }));
  } catch (e) { /* storage unavailable — progress just won't be saved */ }
}

function clearProgress() {
  try { localStorage.removeItem(PROGRESS_KEY); } catch (e) {}
}

/** Restore saved progress if it still matches the current questions. Returns true if restored. */
function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY) || 'null');
    if (!saved) return false;

    const sameQuestions =
      Array.isArray(saved.questionIds) &&
      saved.questionIds.length === questions.length &&
      saved.questionIds.every((id, i) => id === questions[i].id);

    if (!sameQuestions || !Array.isArray(saved.userAnswers)) {
      clearProgress();
      return false;
    }

    saved.userAnswers.forEach((answer, i) => {
      const valid = Number.isInteger(answer) && questions[i].options[answer];
      userAnswers[i] = valid ? answer : null;
    });
    currentQuestionIndex = Math.min(
      Math.max(saved.currentQuestionIndex || 0, 0),
      questions.length - 1
    );
    return userAnswers.some((answer) => answer !== null);
  } catch (e) {
    clearProgress();
    return false;
  }
}
