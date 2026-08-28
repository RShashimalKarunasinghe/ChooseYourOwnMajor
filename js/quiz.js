let currentQuestionIndex = 0;
const userAnswers = new Array(questions.length).fill(null);

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

function isLastQuestion() {
  return currentQuestionIndex === questions.length - 1;
}

function getProgressPercent() {
  return Math.round(((currentQuestionIndex + 1) / questions.length) * 100);
}

function calculateResult() {
  const totals = {
    cs: 0,
    se: 0,
    cyber: 0,
    ds: 0
  };

  userAnswers.forEach((selectedOptionIndex, questionIndex) => {
    const option = questions[questionIndex].options[selectedOptionIndex];
    if (!option) return;

    Object.entries(option.scores).forEach(([major, score]) => {
      totals[major] += score;
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

  const parsed = JSON.parse(data);

  currentQuestionIndex = parsed.currentQuestionIndex || 0;

  parsed.userAnswers.forEach((ans, i) => {
    userAnswers[i] = ans;
  });
}

// Call loadProgress when the quiz is initialized
function areAllQuestionsAnswered() {
  return userAnswers.every(answer => answer !== null);
}

function findFirstUnanswered() {
  return userAnswers.findIndex(answer => answer === null);
}

// This function can be used to find all unanswered questions if you want to show a list of them
function findAllUnanswered() {
  const missing = [];

  userAnswers.forEach((answer, index) => {
    if (answer === null) {
      missing.push(index + 1); // question number
    }
  });

  return missing;
}

function updateQuizStats() {
  const answered = userAnswers.filter(answer => answer !== null).length;

  const skipped = userAnswers.filter(answer => answer === null).length;

  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  document.getElementById("quizStats").textContent =
    `${translations[lang].answered}: ${answered} | ${translations[lang].skippedCount}: ${skipped}`;
}