let currentQuestionIndex = 0;
// userAnswers is declared in data.js and filled by init() once questions load

function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

function saveAnswer(questionIndex, optionIndex) {
  userAnswers[questionIndex] = optionIndex;
  saveProgress(); // Save progress whenever an answer is saved
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
    saveProgress(); // Save progress whenever we move to the next question
  }
}

function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    saveProgress(); // Save progress whenever we move to the previous question
  }
}

// Jump straight to a question (used by the dot navigator)
function goToQuestion(index) {
  if (index >= 0 && index < questions.length) {
    currentQuestionIndex = index;
    saveProgress();
  }
}

function isLastQuestion() {
  return currentQuestionIndex === questions.length - 1;
}

function getAnsweredCount() {
  return userAnswers.filter((answer) => answer !== null).length;
}

// Progress is how many questions are answered, not how far along you are,
// so skipping ahead doesn't fill the bar.
function getProgressPercent() {
  return Math.round((getAnsweredCount() / questions.length) * 100);
}

// Indexes (0-based) of questions with no answer
function getUnansweredIndexes() {
  const missing = [];
  userAnswers.forEach((answer, index) => {
    if (answer === null) missing.push(index);
  });
  return missing;
}

function calculateResult() {
  // One total per major from the database, so majors added in admin are scored too
  const totals = {};
  Object.keys(majorInfo).forEach((code) => {
    totals[code] = 0;
  });

  userAnswers.forEach((selectedOptionIndex, questionIndex) => {
    if (selectedOptionIndex === null) return;
    const option = questions[questionIndex].options[selectedOptionIndex];
    if (!option) return;

    Object.entries(option.scores).forEach(([major, score]) => {
      // Ignore scores for a major that has since been deleted in admin
      if (totals[major] !== undefined) totals[major] += score;
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

// Codes of the three highest-scoring majors; ui.js turns them into
// translated profile tags.
function buildPersonalitySummary(result) {
  return Object.entries(result.totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([major]) => major);
}

function resetQuizState() {
  currentQuestionIndex = 0;
  for (let i = 0; i < userAnswers.length; i++) {
    userAnswers[i] = null;
  }
  localStorage.removeItem("quizProgress"); // Clear saved progress when resetting state
}

// Save progress to localStorage whenever the user answers a question or navigates
function saveProgress() {
  const data = {
    currentQuestionIndex,
    userAnswers
  };
  localStorage.setItem("quizProgress", JSON.stringify(data));
}

// Load progress from localStorage
function loadProgress() {
  const data = localStorage.getItem("quizProgress");
  if (!data) return;

  let parsed;
  try {
    parsed = JSON.parse(data);
  } catch (error) {
    localStorage.removeItem("quizProgress");
    return;
  }

  // Questions are editable in admin, so a save from before an add/delete
  // would put answers on the wrong questions. Discard it instead.
  if (!parsed || !Array.isArray(parsed.userAnswers) ||
      parsed.userAnswers.length !== questions.length) {
    localStorage.removeItem("quizProgress");
    return;
  }

  currentQuestionIndex = Math.min(parsed.currentQuestionIndex || 0, questions.length - 1);

  parsed.userAnswers.forEach((ans, i) => {
    userAnswers[i] = ans;
  });
}

// True when saved progress has at least one answer (drives the resume banner)
function hasInProgressAnswers() {
  return getAnsweredCount() > 0;
}
