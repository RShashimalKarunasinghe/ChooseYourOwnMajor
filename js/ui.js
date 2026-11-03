// js/ui.js
// Rendering for the student quiz page. All quiz/major text comes from the
// database; t() translates the interface and tc() translates stored content.

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
const quizStats = document.getElementById("quizStats");

const progressLabel = document.getElementById("progressLabel");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const recommendedMajor = document.getElementById("recommendedMajor");
const matchLevel = document.getElementById("matchLevel");
const resultAnalytics = document.getElementById("resultAnalytics");
const resultReason = document.getElementById("resultReason");
const recommendationEvidence = document.getElementById("recommendationEvidence");
const alternativeMajor = document.getElementById("alternativeMajor");
const alternativeMatch = document.getElementById("alternativeMatch");
const careerSuggestion = document.getElementById("careerSuggestion");
const profileTags = document.getElementById("profileTags");
const scoreBreakdown = document.getElementById("scoreBreakdown");
const qrPanel = document.getElementById("qrPanel");
const qrCode = document.getElementById("qrCode");
const qrLinkEl = document.getElementById("qrLink");
const relatedPanel = document.getElementById("relatedPanel");
const relatedList = document.getElementById("relatedList");
const compareSelect1 = document.getElementById("compareMajor1");
const compareSelect2 = document.getElementById("compareMajor2");
const compareMessage = document.getElementById("compareMessage");
const comparisonTableContainer = document.getElementById("comparisonTableContainer");
const comparisonTableBody = document.getElementById("comparisonTableBody");

let comparisonKey = null;        // which result the comparison selects were last set up for

// Shared UI state
let currentMessageType = null;   // "skipped" | "validation" | null
let currentResult = null;        // last calculated result (re-rendered on language change)
let renderToken = 0;             // guards against out-of-order async result renders

// ── language ──────────────────────────────────────────────────────────────────

/** Translate all fixed text on the page for the current language. */
function applyLanguage() {
  document.documentElement.lang = getLanguage();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });

  // Buttons whose label depends on state
  startBtn.textContent = hasAnyAnswer() ? t("resumeQuiz") : t("startQuiz");
  updateNextButtonLabel();
}

function hasAnyAnswer() {
  return userAnswers.some((answer) => answer !== null);
}

function updateNextButtonLabel() {
  nextBtn.textContent = isCurrentQuestionAnswered() ? t("next") : t("skip");
}

function renderLanguageOptions() {
  const languageSelect = document.getElementById("languageSelect");
  languageSelect.innerHTML = "";

  Object.entries(languageConfig).forEach(([code, language]) => {
    const option = document.createElement("option");
    option.value = code;
    option.textContent = language.nativeName;
    languageSelect.appendChild(option);
  });

  languageSelect.value = getLanguage();
}

// ── sections ──────────────────────────────────────────────────────────────────

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

// ── questions ─────────────────────────────────────────────────────────────────

function renderCurrentQuestion() {
  const question = getCurrentQuestion();
  const savedAnswer = getSavedAnswer(currentQuestionIndex);

  questionContainer.innerHTML = "";

  const card = document.createElement("article");
  card.className = "question-card";

  const title = document.createElement("h3");
  title.textContent = `Q${currentQuestionIndex + 1}. ${tc(question.text)}`;

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
      currentMessageType = null;
      formMessage.textContent = "";
      renderCurrentQuestion();
      updateNextButtonLabel();
      updateQuizStats();
    });

    const textBox = document.createElement("div");

    const strong = document.createElement("strong");
    strong.textContent = `${option.key}. ${tc(option.text)}`;

    const small = document.createElement("small");
    small.textContent = tc(option.subtext);

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

function restoreFeedback() {
  const savedAnswer = getSavedAnswer(currentQuestionIndex);

  if (savedAnswer === null) {
    answerFeedback.textContent = "";
    answerFeedback.classList.add("hidden");
    return;
  }

  const option = getCurrentQuestion().options[savedAnswer];
  showAnswerFeedback(tc(option.feedback));
}

// ── messages ──────────────────────────────────────────────────────────────────

function showSkippedMessage() {
  currentMessageType = "skipped";
  formMessage.textContent = t("skippedMessage");
}

function showValidationMessage() {
  currentMessageType = "validation";
  const missing = findAllUnanswered();
  formMessage.textContent =
    `${t("unansweredMessage")} ${missing.join(", ")}. ${t("answerBeforeSubmit")}`;
}

/** Re-render whichever message is showing, in the current language. */
function restoreMessage() {
  if (currentMessageType === "skipped") {
    showSkippedMessage();
  } else if (currentMessageType === "validation") {
    showValidationMessage();
  } else {
    formMessage.textContent = "";
  }
}

// ── progress / buttons ────────────────────────────────────────────────────────

function updateProgressUI() {
  const percent = getProgressPercent();
  progressLabel.textContent =
    `${t("questionOf")} ${currentQuestionIndex + 1} ${t("of")} ${questions.length}`;
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
}

function updateQuizStats() {
  const answered = userAnswers.filter((answer) => answer !== null).length;
  const skipped = userAnswers.length - answered;
  quizStats.textContent = `${t("answered")}: ${answered} | ${t("skippedCount")}: ${skipped}`;
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

// ── result ────────────────────────────────────────────────────────────────────

function getMatchLabel(percent) {
  if (percent >= 40) return t("strongMatch");
  if (percent >= 30) return t("goodMatch");
  return t("possibleMatch");
}

async function renderResult(result) {
  const token = ++renderToken;
  const topInfo = majorInfo[result.topMajor];
  const secondInfo = majorInfo[result.secondMajor];
  const topTitle = tc(topInfo.title);

  recommendedMajor.textContent = topTitle;
  matchLevel.textContent = `${getMatchLabel(result.topPercent)} (${result.topPercent}%)`;
  resultReason.textContent = tc(topInfo.resultReason);
  alternativeMajor.textContent = tc(secondInfo.title);
  alternativeMatch.textContent = `${t("alternativeMatchText")}: ${result.secondPercent}%`;
  careerSuggestion.textContent = tc(topInfo.careers);

  renderRelatedCourses(topInfo.relatedCourses);
  renderQrPanel(topInfo.qrLink);
  renderRecommendationEvidence(result.topMajor);
  renderProfileTags(buildPersonalitySummary(result));
  renderScoreBreakdown(result.totals);
  renderComparison(result);

  exploreBtn.onclick = () => {
    alert(tc(topInfo.exploreText));
  };

  // Public "how many students got this" figure from the database
  resultAnalytics.textContent = t("loading");
  try {
    const summary = await fetchRecordSummary();
    if (token !== renderToken) return; // a newer render has started
    const count = summary.counts[result.topMajor] || 0;
    const percent = summary.total ? Math.round((count / summary.total) * 100) : 0;
    resultAnalytics.textContent = t("analyticsLine", { percent, major: topTitle });
  } catch (err) {
    console.error("Could not load result analytics:", err);
    if (token === renderToken) resultAnalytics.textContent = t("unavailable");
  }
}

// ── related courses ───────────────────────────────────────────────────────────

/** Badges for a list of { name, url }. A badge is a link when the admin gave a web address. */
function buildCourseTags(courses) {
  const fragment = document.createDocumentFragment();

  (Array.isArray(courses) ? courses : []).forEach((course) => {
    if (!course || !course.name) return;
    const url = normaliseQrLink(course.url);
    const name = tc(course.name);

    const tag = document.createElement(url ? "a" : "span");
    tag.className = "course-tag";
    tag.textContent = name;
    if (url) {
      tag.href = url;
      tag.target = "_blank";
      tag.rel = "noopener noreferrer";
      tag.title = url;
    }
    fragment.appendChild(tag);
  });

  return fragment;
}

/** "Related courses & minors" for the recommended major; hidden when the admin lists none. */
function renderRelatedCourses(courses) {
  relatedList.innerHTML = "";
  relatedList.appendChild(buildCourseTags(courses));
  relatedPanel.classList.toggle("hidden", relatedList.children.length === 0);
}

// ── side-by-side comparison ───────────────────────────────────────────────────

/** Fill the two selects from every major in the database (so new majors appear automatically). */
function renderComparison(result) {
  const keys = majorKeys.filter((key) => majorInfo[key]);
  const resultKey = `${result.topMajor}|${result.secondMajor}`;
  const previous = [compareSelect1.value, compareSelect2.value];

  [compareSelect1, compareSelect2].forEach((select) => {
    select.innerHTML = "";
    keys.forEach((key) => {
      const option = document.createElement("option");
      option.value = key;
      option.textContent = tc(majorInfo[key].title);
      select.appendChild(option);
    });
  });

  // New result: compare the recommended major with the alternative.
  // Same result re-drawn (e.g. language change): keep the student's choice.
  let first = result.topMajor;
  let second = result.secondMajor;
  if (comparisonKey === resultKey && keys.includes(previous[0]) && keys.includes(previous[1])) {
    [first, second] = previous;
  }
  comparisonKey = resultKey;
  compareSelect1.value = first;
  compareSelect2.value = second;

  renderComparisonTable();
}

function renderComparisonTable() {
  const key1 = compareSelect1.value;
  const key2 = compareSelect2.value;
  const m1 = majorInfo[key1];
  const m2 = majorInfo[key2];

  comparisonTableBody.innerHTML = "";

  if (!m1 || !m2 || key1 === key2) {
    compareMessage.textContent = t("compareSame");
    comparisonTableContainer.classList.add("hidden");
    return;
  }

  compareMessage.textContent = "";
  document.getElementById("thMajor1").textContent = tc(m1.title);
  document.getElementById("thMajor2").textContent = tc(m2.title);

  const textCell = (value) => {
    const cell = document.createElement("td");
    cell.textContent = tc(value || "");
    return cell;
  };
  const coursesCell = (major) => {
    const cell = document.createElement("td");
    cell.appendChild(buildCourseTags(major.relatedCourses));
    if (!cell.children.length) cell.textContent = t("noneListed");
    return cell;
  };

  const rows = [
    ["compareTag", (m, key) => textCell(personalityTags[key] || m.title)],
    ["compareCareers", (m) => textCell(m.careers)],
    ["compareWhy", (m) => textCell(m.resultReason)],
    ["compareFocus", (m) => textCell(m.exploreText)],
    ["compareRelated", (m) => coursesCell(m)]
  ];

  rows.forEach(([labelKey, makeCell]) => {
    const tr = document.createElement("tr");
    const th = document.createElement("th");
    th.scope = "row";
    th.textContent = t(labelKey);
    tr.appendChild(th);
    tr.appendChild(makeCell(m1, key1));
    tr.appendChild(makeCell(m2, key2));
    comparisonTableBody.appendChild(tr);
  });

  comparisonTableContainer.classList.remove("hidden");
}

compareSelect1.addEventListener("change", renderComparisonTable);
compareSelect2.addEventListener("change", renderComparisonTable);

/** QR code for the recommended major. The panel only appears when the admin has set a link. */
function renderQrPanel(link) {
  const clean = normaliseQrLink(link);

  if (!clean || !renderQr(qrCode, clean)) {
    qrCode.innerHTML = "";
    qrLinkEl.textContent = "";
    qrLinkEl.removeAttribute("href");
    qrPanel.classList.add("hidden");
    return;
  }

  qrCode.setAttribute("aria-label", t("qrAlt", { url: clean }));
  qrLinkEl.href = clean;
  qrLinkEl.textContent = clean;
  qrPanel.classList.remove("hidden");
}

/** "Your answers that contributed to this result" */
function renderRecommendationEvidence(topMajor) {
  recommendationEvidence.innerHTML = "";

  const topTitle = tc(majorInfo[topMajor].title);
  const list = document.createElement("ul");
  list.className = "recommendation-evidence-list";

  questions.forEach((question, questionIndex) => {
    const selectedAnswer = userAnswers[questionIndex];
    if (selectedAnswer === null) return;

    const option = question.options[selectedAnswer];
    const contribution = option && option.scores ? option.scores[topMajor] : 0;
    if (!contribution) return; // only answers that scored for the recommended major

    const item = document.createElement("li");

    const questionText = document.createElement("strong");
    questionText.textContent = `Q${questionIndex + 1}: ${tc(question.text)}`;

    const answerText = document.createElement("span");
    answerText.textContent = `${tc(option.text)} (+${contribution} ${topTitle})`;

    item.appendChild(questionText);
    item.appendChild(answerText);
    list.appendChild(item);
  });

  if (list.children.length === 0) {
    const none = document.createElement("p");
    none.textContent = t("noRecommendationEvidence");
    recommendationEvidence.appendChild(none);
    return;
  }

  const heading = document.createElement("h5");
  heading.textContent = t("recommendationEvidenceTitle");
  recommendationEvidence.appendChild(heading);
  recommendationEvidence.appendChild(list);
}

function renderProfileTags(tags) {
  profileTags.innerHTML = "";

  tags.forEach((tag) => {
    const span = document.createElement("span");
    span.className = "profile-tag";
    span.textContent = tc(tag);
    profileTags.appendChild(span);
  });
}

function renderScoreBreakdown(totals) {
  scoreBreakdown.innerHTML = "";

  Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([major, score]) => {
      const card = document.createElement("div");
      card.className = "score-card";

      const title = document.createElement("span");
      title.textContent = tc(majorInfo[major].title);

      const strong = document.createElement("strong");
      strong.textContent = score;

      card.appendChild(title);
      card.appendChild(strong);
      scoreBreakdown.appendChild(card);
    });
}

function resetUI() {
  currentMessageType = null;
  currentResult = null;
  formMessage.textContent = "";
  answerFeedback.textContent = "";
  answerFeedback.classList.add("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  qrPanel.classList.add("hidden");
  relatedPanel.classList.add("hidden");
  comparisonKey = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
}
