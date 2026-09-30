/**
 * ui.js — all DOM reads and writes for the quiz page.
 *
 * Every piece of text comes from t() / getMajorText() / getDisplayQuestion()
 * in languages.js, and every render function works out its text from the
 * quiz state below. That way switching language just re-runs the renders and
 * nothing (e.g. "Submit anyway", "Sending…") gets reset by accident.
 */

const startBtn = document.getElementById("startBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const skipBtn = document.getElementById("skipBtn");
const submitBtn = document.getElementById("submitBtn");
const restartBtn = document.getElementById("restartBtn");
const exploreBtn = document.getElementById("exploreBtn");
const emailBtn = document.getElementById("emailBtn");
const downloadBtn = document.getElementById("downloadBtn");

const resumeBanner = document.getElementById("resumeBanner");
const resumeBtn = document.getElementById("resumeBtn");
const discardBtn = document.getElementById("discardBtn");
const loadingOverlay = document.getElementById("loadingOverlay");

const quizSection = document.getElementById("quizSection");
const resultSection = document.getElementById("resultSection");

const questionContainer = document.getElementById("questionContainer");
const answerFeedback = document.getElementById("answerFeedback");
const formMessage = document.getElementById("formMessage");
const skippedWarning = document.getElementById("skippedWarning");
const dotNav = document.getElementById("dotNav");
const quizStats = document.getElementById("quizStats");

const progressLabel = document.getElementById("progressLabel");
const progressPercent = document.getElementById("progressPercent");
const progressFill = document.getElementById("progressFill");

const recommendedMajor = document.getElementById("recommendedMajor");
const matchLevel = document.getElementById("matchLevel");
const resultReason = document.getElementById("resultReason");
const alternativeMajor = document.getElementById("alternativeMajor");
const alternativeMatch = document.getElementById("alternativeMatch");
const careerSuggestion = document.getElementById("careerSuggestion");
const answerBreakdown = document.getElementById("answerBreakdown");
const relatedMajorsList = document.getElementById("relatedMajors");
const nextStepsList = document.getElementById("nextStepsList");
const profileTags = document.getElementById("profileTags");
const scoreBreakdown = document.getElementById("scoreBreakdown");
const qrCode = document.getElementById("qrCode");

// ── Page state that decides which text is shown ─────────────────────────────

let warnedSkipped = false;     // first submit with skipped questions shows the warning
let formMessageKey = null;     // uiText key for the message under the question, or null
let currentResult = null;      // last calculated result (re-rendered on language change)
let resultAnswers = [];        // answers the result was calculated from
let emailState = "idle";       // idle | sending | sent
let slideDirection = null;     // left | right | null — animation for the next render

// ── Sections ────────────────────────────────────────────────────────────────

function showSection(section) {
  section.classList.remove("hidden");
  section.classList.remove("section-enter");
  void section.offsetWidth; // restart the entrance animation
  section.classList.add("section-enter");
  section.scrollIntoView({ behavior: "smooth" });
}

function showQuizSection() {
  resultSection.classList.add("hidden");
  showSection(quizSection);
}

function showResultSection() {
  quizSection.classList.add("hidden");
  showSection(resultSection);
}

function resetUI() {
  warnedSkipped = false;
  formMessageKey = null;
  formMessage.textContent = "";
  answerFeedback.textContent = "";
  answerFeedback.classList.add("hidden");
  skippedWarning.classList.add("hidden");
  quizSection.classList.add("hidden");
  resultSection.classList.add("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function hideLoading() {
  if (!loadingOverlay) return;
  loadingOverlay.classList.add("fade-out");
  setTimeout(() => loadingOverlay.remove(), 600);
}

// ── Question ────────────────────────────────────────────────────────────────

function renderCurrentQuestion() {
  const question = getCurrentQuestion();
  const savedAnswer = getSavedAnswer(currentQuestionIndex);
  const display = getDisplayQuestion(question);

  questionContainer.innerHTML = "";

  const card = document.createElement("article");
  card.className = "question-card" + (slideDirection ? " slide-" + slideDirection : "");
  slideDirection = null;

  const title = document.createElement("h3");
  title.textContent = `${t("questionShort", { n: currentQuestionIndex + 1 })}. ${display.text}`;

  const optionsWrapper = document.createElement("div");
  optionsWrapper.className = "option-list";

  question.options.forEach((option, optionIndex) => {
    const label = document.createElement("label");
    label.className = "option-item" + (savedAnswer === optionIndex ? " selected" : "");

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `question-${question.id}`;
    input.value = optionIndex;
    input.checked = savedAnswer === optionIndex;

    input.addEventListener("change", () => {
      saveAnswer(currentQuestionIndex, optionIndex);
      formMessageKey = null;
      renderCurrentQuestion();
    });

    const shown = display.options[optionIndex];

    const textBox = document.createElement("div");
    const strong = document.createElement("strong");
    strong.textContent = `${option.key}. ${shown.text}`;
    const small = document.createElement("small");
    small.textContent = shown.subtext || "";

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
  updateQuizStats();
  updateButtons();
  restoreFeedback(display);
  renderMessages();
  renderDotNav();
}

function restoreFeedback(display) {
  const savedAnswer = getSavedAnswer(currentQuestionIndex);
  const text = savedAnswer !== null && display.feedback ? display.feedback[savedAnswer] : "";

  if (!text) {
    answerFeedback.textContent = "";
    answerFeedback.classList.add("hidden");
    return;
  }
  answerFeedback.textContent = text;
  answerFeedback.classList.remove("hidden");
}

// Message under the question + the skipped-questions warning
function renderMessages() {
  formMessage.textContent = formMessageKey ? t(formMessageKey) : "";

  const missing = getUnansweredIndexes();
  if (warnedSkipped && missing.length > 0) {
    const list = missing.map((i) => t("questionShort", { n: i + 1 })).join(", ");
    skippedWarning.textContent = "⚠ " + t("skippedWarning", { list });
    skippedWarning.classList.remove("hidden");
  } else {
    skippedWarning.textContent = "";
    skippedWarning.classList.add("hidden");
  }
}

function updateProgressUI() {
  const percent = getProgressPercent();
  progressLabel.textContent = t("progressLabel", {
    current: currentQuestionIndex + 1,
    total: questions.length
  });
  progressPercent.textContent = `${percent}%`;
  progressFill.style.width = `${percent}%`;
  progressFill.setAttribute("aria-valuenow", percent);
}

function updateQuizStats() {
  const answered = getAnsweredCount();
  quizStats.textContent = t("quizStats", {
    answered,
    skipped: questions.length - answered
  });
}

function updateButtons() {
  prevBtn.disabled = currentQuestionIndex === 0;

  const last = isLastQuestion();
  nextBtn.classList.toggle("hidden", last);
  skipBtn.classList.toggle("hidden", last);
  submitBtn.classList.toggle("hidden", !last);

  const skipped = getUnansweredIndexes().length;
  submitBtn.textContent = warnedSkipped && skipped > 0
    ? t("submitAnyway", { count: skipped })
    : t("seeResult");
}

// ── Dot navigator ───────────────────────────────────────────────────────────

function renderDotNav() {
  dotNav.innerHTML = "";

  questions.forEach((_, i) => {
    const answered = userAnswers[i] !== null && userAnswers[i] !== undefined;
    const active = i === currentQuestionIndex;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dot-btn" +
      (active ? " dot-btn--active" : "") +
      (answered && !active ? " dot-btn--answered" : "") +
      (!answered && !active ? " dot-btn--unanswered" : "");
    btn.textContent = i + 1;
    btn.title = t(answered ? "dotAnswered" : "dotUnanswered", { n: i + 1 });
    btn.setAttribute("aria-label", t("goToQuestion", { n: i + 1 }));
    if (active) btn.setAttribute("aria-current", "step");

    btn.addEventListener("click", () => {
      if (i === currentQuestionIndex) return;
      slideDirection = i > currentQuestionIndex ? "left" : "right";
      formMessageKey = null;
      goToQuestion(i);
      renderCurrentQuestion();
    });

    dotNav.appendChild(btn);
  });
}

// ── Result ──────────────────────────────────────────────────────────────────

function getMatchLabel(percent) {
  if (percent >= 40) return t("strongMatch");
  if (percent >= 30) return t("goodMatch");
  return t("possibleMatch");
}

function renderResult(result) {
  recommendedMajor.textContent = getMajorText(result.topMajor, "title");
  matchLevel.textContent = `${getMatchLabel(result.topPercent)} (${result.topPercent}%)`;
  resultReason.textContent = getMajorText(result.topMajor, "resultReason");

  alternativeMajor.textContent = getMajorText(result.secondMajor, "title");
  alternativeMatch.textContent = t("alternativePercent", { percent: result.secondPercent });

  careerSuggestion.textContent = getMajorText(result.topMajor, "careers");

  renderAnswerBreakdown(result);
  renderList(relatedMajorsList, getMajorText(result.topMajor, "relatedMajors") || [], "span", "related-tag");
  renderNextSteps(result.topMajor);
  renderProfileTags(buildPersonalitySummary(result));
  renderScoreBreakdown(result.totals);
  renderQRCode(result.topMajor);

  exploreBtn.onclick = () => {
    alert(getMajorText(result.topMajor, "exploreText"));
  };
}

// Which answers pushed the top major up (highlighted rows score for it)
function renderAnswerBreakdown(result) {
  answerBreakdown.innerHTML = "";
  const topTitle = getMajorText(result.topMajor, "title");

  resultAnswers.forEach((optionIndex, questionIndex) => {
    if (optionIndex === null) return;
    const question = questions[questionIndex];
    const option = question.options[optionIndex];
    if (!option) return;

    const display = getDisplayQuestion(question);
    const scoreForTop = (option.scores && option.scores[result.topMajor]) || 0;

    const row = document.createElement("div");
    row.className = "breakdown-row" + (scoreForTop > 0 ? " breakdown-row--match" : "");

    const q = document.createElement("div");
    q.className = "breakdown-q";
    q.textContent = `${t("questionShort", { n: questionIndex + 1 })}. ${display.text}`;

    const a = document.createElement("div");
    a.className = "breakdown-a";

    const key = document.createElement("span");
    key.className = "breakdown-key";
    key.textContent = option.key;
    a.appendChild(key);
    a.appendChild(document.createTextNode(" " + display.options[optionIndex].text));

    if (scoreForTop > 0) {
      const badge = document.createElement("span");
      badge.className = "breakdown-badge";
      badge.textContent = t("answerBadge", { score: scoreForTop, major: topTitle });
      a.appendChild(badge);
    }

    row.appendChild(q);
    row.appendChild(a);
    answerBreakdown.appendChild(row);
  });
}

function renderNextSteps(majorCode) {
  // Majors added in admin have no steps written yet, so show general advice
  const steps = getMajorText(majorCode, "nextSteps");
  renderList(nextStepsList, steps && steps.length ? steps : [t("adviceFallback")], "li");
}

function renderProfileTags(majorCodes) {
  const tags = majorCodes
    .map((code) => getMajorText(code, "personalityTags"))
    .filter(Boolean);
  renderList(profileTags, tags, "span", "profile-tag");
}

function renderScoreBreakdown(totals) {
  scoreBreakdown.innerHTML = "";

  Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .forEach(([major, score]) => {
      const card = document.createElement("div");
      card.className = "score-card";

      const title = document.createElement("span");
      title.textContent = getMajorText(major, "title");

      const strong = document.createElement("strong");
      strong.textContent = score;

      card.appendChild(title);
      card.appendChild(strong);
      scoreBreakdown.appendChild(card);
    });
}

// QR code from the free goqr.me API. It links to the quiz page with the
// major code only — nothing personal is sent.
function renderQRCode(majorCode) {
  qrCode.innerHTML = "";
  const link = window.location.origin + window.location.pathname + "?major=" + encodeURIComponent(majorCode);

  const img = document.createElement("img");
  img.src = "https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=" + encodeURIComponent(link);
  img.alt = t("qrAlt", { major: getMajorText(majorCode, "title") });
  img.width = 140;
  img.height = 140;

  const caption = document.createElement("p");
  caption.className = "qr-caption";
  caption.textContent = t("qrCaption");

  qrCode.appendChild(img);
  qrCode.appendChild(caption);
}

function renderList(container, items, tag, className) {
  container.innerHTML = "";
  items.forEach((item) => {
    const el = document.createElement(tag);
    if (className) el.className = className;
    el.textContent = item;
    container.appendChild(el);
  });
}

function updateEmailButton() {
  const labels = { idle: "sendReport", sending: "sending", sent: "sent" };
  emailBtn.textContent = t(labels[emailState]);
  emailBtn.disabled = emailState === "sending";
}
