const startBtn = document.getElementById("startBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");
const exploreBtn = document.getElementById("exploreBtn");

const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");

const questionContainer = document.getElementById("questionContainer");
const answerFeedback = document.getElementById("answerFeedback");
const formMessage = document.getElementById("formMessage");

const progressLabel = document.getElementById("progressLabel");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const recommendedMajor = document.getElementById("recommendedMajor");
const matchLevel = document.getElementById("matchLevel");
const resultReason = document.getElementById("resultReason");
const alternativeMajor = document.getElementById("alternativeMajor");
const alternativeMatch = document.getElementById("alternativeMatch");
const careerSuggestion = document.getElementById("careerSuggestion");
const profileTags = document.getElementById("profileTags");
const scoreBreakdown = document.getElementById("scoreBreakdown");

function showQuizSection() {
  quizSection.classList.remove("hidden");
  resultSection.classList.add("hidden");
  quizSection.scrollIntoView({ behavior: "smooth" });
}

function showResultSection() {
  resultSection.classList.remove("hidden");
  quizSection.classList.add("hidden");
  resultSection.scrollIntoView({ behavior: "smooth" });
}

function renderCurrentQuestion() {
  const question = getCurrentQuestion();
  const savedAnswer = getSavedAnswer(currentQuestionIndex);

  const lang = localStorage.getItem("selectedLanguage") || "en";
  const translatedQuestion =
    questionTranslations[lang]?.[currentQuestionIndex] ||
    questionTranslations.en[currentQuestionIndex];

  questionContainer.innerHTML = "";

  const card = document.createElement("article");
  card.className = "question-card";

  const title = document.createElement("h3");
  title.textContent = `Q${currentQuestionIndex + 1}. ${translatedQuestion.text}`;

  const optionsWrapper = document.createElement("div");
  optionsWrapper.className = "option-list";

  question.options.forEach((option, optionIndex) => {
    const label = document.createElement("label");
    label.className = "option-item";

    if (savedAnswer === optionIndex) {
      label.classList.add("selected");
    }

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${question.id}`;
    input.value = optionIndex;
    input.checked = savedAnswer === optionIndex;

    input.addEventListener("change", () => {
      saveAnswer(currentQuestionIndex, optionIndex);
      renderCurrentQuestion();
      applyLanguage(
        localStorage.getItem("selectedLanguage") || "en"
      );
      updateQuizStats();
      showAnswerFeedback(
        translatedQuestion.feedback?.[optionIndex] ||
        option.feedback
      );
      formMessage.textContent = "";
    });

    const textBox = document.createElement("div");

    const translatedOption =
      translatedQuestion.options[optionIndex] ||
      questionTranslations.en[currentQuestionIndex].options[optionIndex];

    const strong = document.createElement("strong");
    strong.textContent = `${option.key}. ${translatedOption.text}`;

    const small = document.createElement("small");
    small.textContent = translatedOption.subtext;

    textBox.appendChild(strong);
    textBox.appendChild(small);

    label.appendChild(input);
    label.appendChild(textBox);
    optionsWrapper.appendChild(label);
  });

  card.appendChild(title);
  card.appendChild(optionsWrapper);
  questionContainer.appendChild(card);

  updateProgressUI();
  updateButtons();
  restoreFeedback();
}

function showAnswerFeedback(text) {
  answerFeedback.textContent = text;
  answerFeedback.classList.remove("hidden");
}

function showSkippedMessage() {
  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  currentMessageType = "skipped";

  formMessage.textContent =
    translations[lang].skippedMessage;
}

function showValidationMessage() {
  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  const missing = findAllUnanswered();

  currentMessageType = "validation";

  formMessage.textContent =
    `${translations[lang].unansweredMessage} ${missing.join(", ")}. ${translations[lang].answerBeforeSubmit}`;
}

function restoreFeedback() {
  const savedAnswer = getSavedAnswer(currentQuestionIndex);

  if (savedAnswer === null) {
    answerFeedback.textContent = "";
    answerFeedback.classList.add("hidden");
    return;
  }

  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  const translatedQuestion =
    questionTranslations[lang]?.[currentQuestionIndex] ||
    questionTranslations.en[currentQuestionIndex];

  const option =
    getCurrentQuestion().options[savedAnswer];

  showAnswerFeedback(
    translatedQuestion.feedback?.[savedAnswer] ||
    option.feedback
  );
}

function updateProgressUI() {
  const percent = getProgressPercent();

  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  const t = translations[lang];

  progressLabel.textContent =
    `${t.questionOf} ${currentQuestionIndex + 1} ${t.of} ${questions.length}`;

  progressPercent.textContent = `${percent}%`;

  progressFill.style.width = `${percent}%`;
}

function updateButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;

  if (isLastQuestion()) {
    nextBtn.classList.add("hidden");
    submitBtn.classList.remove("hidden");
  } else {
    nextBtn.classList.remove("hidden");
    submitBtn.classList.add("hidden");
  }
}

function renderResult(result) {
  const lang = localStorage.getItem("selectedLanguage") || "en";

  const t = resultTranslations[lang] || resultTranslations.en;

  const topMajor = {
    title: t.majors[result.topMajor],
    resultReason: t.resultReason[result.topMajor],
    careers: t.careers[result.topMajor]
  };

  const secondMajor = {
    title: t.majors[result.secondMajor]
  };

  // Recommended major
  recommendedMajor.textContent =
    topMajor.title;

  // Match level
  let matchLabel;

  if (result.topPercent >= 40) {
    matchLabel = t.strongMatch;
  } else if (result.topPercent >= 30) {
    matchLabel = t.goodMatch;
  } else {
    matchLabel = t.possibleMatch;
  }

  matchLevel.textContent =
    `${matchLabel} (${result.topPercent}%)`;

  // Result reason
  resultReason.textContent =
    topMajor.resultReason;

  // Alternative major
  alternativeMajor.textContent =
    secondMajor.title;

  alternativeMatch.textContent =
    `${t.alternativeMatch}: ${result.secondPercent}%`;

  // Career suggestion
  careerSuggestion.textContent =
    topMajor.careers;

  // Profile tags
  renderProfileTags(buildPersonalitySummary(result));

  // Score breakdown
  renderScoreBreakdown(result.totals);

  // Explore button
  exploreBtn.onclick = () => {
    alert(
      majorInfo[result.topMajor].exploreText
    );
  };
}

function renderProfileTags(tags) {
  profileTags.innerHTML = "";

  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  const t =
    translations[lang] || translations.en;

  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "profile-tag";

    const tagKey = Object.keys(personalityTags).find(
      (key) => personalityTags[key] === tag
    );

    span.textContent =
      t.personalityTags[tagKey] || tag;

    profileTags.appendChild(span);
  });
}

function renderScoreBreakdown(totals) {
  scoreBreakdown.innerHTML = "";

  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  const t =
    translations[lang] || translations.en;

  Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([major, score]) => {
      const card = document.createElement("div");
      card.className = "score-card";

      const title = document.createElement("span");
      title.textContent =
        t.resultMajors[major].title;

      const strong = document.createElement("strong");
      strong.textContent = score;

      card.appendChild(title);
      card.appendChild(strong);
      scoreBreakdown.appendChild(card);
    });
}

function getMatchLabel(percent) {
  if (percent >= 40) return "Strong Match";
  if (percent >= 30) return "Good Match";
  return "Possible Match";
}

function resetUI() {
  formMessage.textContent = "";
  answerFeedback.textContent = "";
  answerFeedback.classList.add("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}