/**
 * app.js — entry point and event wiring for the quiz page.
 *
 * - Start Quiz always starts fresh; a separate resume banner offers
 *   Continue Quiz / Start Fresh when there are saved answers.
 * - Next needs an answer; Skip moves on without one.
 * - Submitting with skipped questions warns once, then "Submit anyway".
 * - Saved progress is cleared after submit so a finished quiz doesn't
 *   show up as "in progress" next time.
 * - Quiz starts / completions are counted for the admin analytics.
 */

// ── Start / resume ──────────────────────────────────────────────────────────

function startQuiz() {
  resumeBanner.classList.add("hidden");
  warnedSkipped = false;
  formMessageKey = null;
  slideDirection = null;
  showQuizSection();
  renderCurrentQuestion();
}

function startFreshQuiz() {
  resetQuizState();
  trackQuizStart();
  startQuiz();
}

startBtn.addEventListener("click", startFreshQuiz);
discardBtn.addEventListener("click", startFreshQuiz);
resumeBtn.addEventListener("click", startQuiz);

// ── Navigation ──────────────────────────────────────────────────────────────

prevBtn.addEventListener("click", () => {
  formMessageKey = null;
  warnedSkipped = false;
  slideDirection = "right";
  goToPreviousQuestion();
  renderCurrentQuestion();
});

nextBtn.addEventListener("click", () => {
  if (!isCurrentQuestionAnswered()) {
    formMessageKey = "selectOrSkip";
    renderMessages();
    return;
  }
  formMessageKey = null;
  warnedSkipped = false;
  slideDirection = "left";
  goToNextQuestion();
  renderCurrentQuestion();
});

skipBtn.addEventListener("click", () => {
  formMessageKey = null;
  warnedSkipped = false;
  slideDirection = "left";
  goToNextQuestion();
  renderCurrentQuestion();
});

// ── Submit ──────────────────────────────────────────────────────────────────

document.getElementById("quizForm").addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuiz();
});

function submitQuiz() {
  const missing = getUnansweredIndexes();

  // With nothing answered every major scores 0, so there is no real result
  if (missing.length === questions.length) {
    formMessageKey = "answerAtLeastOne";
    renderMessages();
    return;
  }

  // First submit with skipped questions: warn and turn the button into "Submit anyway"
  if (missing.length > 0 && !warnedSkipped) {
    warnedSkipped = true;
    formMessageKey = null;
    renderMessages();
    updateButtons();
    return;
  }

  const result = calculateResult();
  currentResult = result;
  resultAnswers = userAnswers.slice();

  saveQuizRecord(result);
  localStorage.removeItem("quizProgress"); // finished — don't offer to resume it
  trackQuizCompletion();

  warnedSkipped = false;
  emailState = "idle";
  updateEmailButton();
  renderResult(result);
  showResultSection();
}

function saveQuizRecord(result) {
  const records = JSON.parse(localStorage.getItem("majorQuizRecords") || "[]");

  // Which answers were given (stored in English for the admin records page)
  const answerBreakdown = userAnswers.map((optionIndex, questionIndex) => {
    if (optionIndex === null) return null;
    const question = questions[questionIndex];
    const option = question.options[optionIndex];
    return option ? { question: question.text, answer: option.text, scores: option.scores } : null;
  }).filter(Boolean);

  records.push({
    id: Date.now(),
    date: new Date().toLocaleString(),
    topMajor: result.topMajor,
    topMajorTitle: majorInfo[result.topMajor].title,
    matchPercent: result.topPercent,
    secondMajor: result.secondMajor,
    secondMajorTitle: majorInfo[result.secondMajor].title,
    secondPercent: result.secondPercent,
    answers: [...userAnswers],
    answerBreakdown,
    totals: result.totals
  });

  localStorage.setItem("majorQuizRecords", JSON.stringify(records));
}

// ── Quiz start / completion counts (shown in admin Analytics) ───────────────
// A "start" is a click on Start Quiz / Start Fresh, not a page load, so the
// abandonment number (starts - completions) isn't inflated by visitors who
// only looked at the home page.

function getStats() {
  try {
    return JSON.parse(localStorage.getItem("majorQuizStats") || "{}");
  } catch (e) {
    return {};
  }
}

function saveStats(stats) {
  try {
    localStorage.setItem("majorQuizStats", JSON.stringify(stats));
  } catch (e) { /* storage blocked — stats are optional */ }
}

function trackQuizStart() {
  const stats = getStats();
  stats.starts = (stats.starts || 0) + 1;
  saveStats(stats);
}

function trackQuizCompletion() {
  const stats = getStats();
  stats.completions = (stats.completions || 0) + 1;
  saveStats(stats);
}

// ── Result actions ──────────────────────────────────────────────────────────

restartBtn.addEventListener("click", () => {
  resetQuizState();
  resetUI();
  currentResult = null;
  resultAnswers = [];
  resumeBanner.classList.add("hidden");
});

// Plain-text summary in the language currently selected
downloadBtn.addEventListener("click", () => {
  if (!currentResult) {
    alert(t("noResult"));
    return;
  }
  const r = currentResult;

  const lines = [
    t("summaryHeading"),
    "=".repeat(40),
    "",
    `${t("summaryRecommended")}: ${getMajorText(r.topMajor, "title")} (${t("summaryMatch", { percent: r.topPercent })})`,
    `${t("summaryAlternative")}: ${getMajorText(r.secondMajor, "title")} (${t("summaryMatch", { percent: r.secondPercent })})`,
    `${t("summaryCompleted")}: ${new Date().toLocaleString(getLang())}`,
    "",
    t("whyResult").toUpperCase(),
    "-".repeat(40),
    getMajorText(r.topMajor, "resultReason"),
    "",
    t("answersTitle").toUpperCase(),
    "-".repeat(40)
  ];

  let n = 0;
  resultAnswers.forEach((optionIndex, questionIndex) => {
    if (optionIndex === null) return;
    const display = getDisplayQuestion(questions[questionIndex]);
    n++;
    lines.push(`${n}. ${t("summaryQuestion")}: ${display.text}`);
    lines.push(`   ${t("summaryAnswer")}: ${display.options[optionIndex].text}`);
  });

  lines.push("", t("nextStepsTitle").toUpperCase(), "-".repeat(40));
  const steps = getMajorText(r.topMajor, "nextSteps");
  (steps && steps.length ? steps : [t("adviceFallback")]).forEach((step) => lines.push("• " + step));

  lines.push("", t("summaryFooter"));

  // BOM so Notepad opens Chinese / accented text as UTF-8
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-major-result.txt";
  a.click();
  URL.revokeObjectURL(url);
});

// ── Email report ────────────────────────────────────────────────────────────

emailBtn.addEventListener("click", () => {
  const emailInput = document.getElementById("emailInput");
  const email = emailInput ? emailInput.value.trim() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert(t("invalidEmail"));
    return;
  }
  sendEmailReport(email);
});

function sendEmailReport(email) {
  const records = JSON.parse(localStorage.getItem("majorQuizRecords") || "[]");
  if (records.length === 0) {
    alert(t("noResult"));
    return;
  }
  const latest = records[records.length - 1];

  emailState = "sending";
  updateEmailButton();

  fetch("send_email.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: email,
      topMajor: latest.topMajorTitle,
      matchPercent: latest.matchPercent,
      secondMajor: latest.secondMajorTitle,
      secondPercent: latest.secondPercent,
      date: latest.date
    })
  })
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) throw new Error(data.error || "Unknown error");
      emailState = "sent";
      updateEmailButton();
      setTimeout(() => {
        emailState = "idle";
        updateEmailButton();
      }, 3000);
    })
    .catch((err) => {
      alert(t("sendFailed") + err.message);
      emailState = "idle";
      updateEmailButton();
    });
}

// ── Language ────────────────────────────────────────────────────────────────

const languageSelect = document.getElementById("languageSelect");

// Re-run every render so all visible text follows the new language
function refreshLanguage() {
  applyLanguage();

  if (!quizSection.classList.contains("hidden")) {
    renderCurrentQuestion();
  }
  if (!resultSection.classList.contains("hidden") && currentResult) {
    renderResult(currentResult);
  }
  updateEmailButton();
}

languageSelect.addEventListener("change", () => {
  saveSelectedLanguage(languageSelect.value);
  refreshLanguage();
});

// ── Accessibility ───────────────────────────────────────────────────────────

let currentFontSize = 16;

document.getElementById("increaseFont").addEventListener("click", () => {
  currentFontSize += 2;
  document.body.style.fontSize = currentFontSize + "px";
});

document.getElementById("decreaseFont").addEventListener("click", () => {
  if (currentFontSize > 12) {
    currentFontSize -= 2;
    document.body.style.fontSize = currentFontSize + "px";
  }
});

document.getElementById("contrastToggle").addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});

// ── Page load ───────────────────────────────────────────────────────────────

window.addEventListener("DOMContentLoaded", async () => {
  // Language first, so the loading screen is already translated
  renderLanguageOptions(languageSelect);
  applyLanguage();

  // Questions and majors come from the database
  const ok = await init();
  hideLoading();

  if (!ok) {
    const message = document.createElement("p");
    message.style.cssText = "color:#ff8e8e;padding:2rem;";
    message.textContent = t("loadError");
    document.body.innerHTML = "";
    document.body.appendChild(message);
    return;
  }

  resetUI();
  loadProgress();
  updateEmailButton();

  if (hasInProgressAnswers()) {
    resumeBanner.classList.remove("hidden");
  }
});
