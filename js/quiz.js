let currentQuestionIndex = 0;
const userAnswers = new Array(questions.length).fill(null);

function getCurrentQuestion() {
  return questions[currentQuestionIndex];
}

function saveAnswer(questionIndex, optionIndex) {
  userAnswers[questionIndex] = optionIndex;
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
  }
}

function goToPreviousQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
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
}