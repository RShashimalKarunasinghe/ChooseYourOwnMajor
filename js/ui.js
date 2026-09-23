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

const dotNav = document.getElementById("dotNav");
const nextStepsList = document.getElementById("nextStepsList");

// ── Text lookup: database first, translations when available ─────────────
// English always comes from the database, so edits made in admin show straight
// away. Other languages use languages.js, matched by the English question text
// rather than by position — so an edited, added or reordered question falls
// back to English instead of showing someone else's translation.

function getLang() {
  return localStorage.getItem("selectedLanguage") || "en";
}

function getDisplayQuestion(question) {
  const lang = getLang();

  if (lang !== "en" && typeof questionTranslations !== "undefined") {
    const englishList = questionTranslations.en || [];
    const i = englishList.findIndex((t) => t.text === question.text);
    const translated = i >= 0 && questionTranslations[lang] ? questionTranslations[lang][i] : null;
    if (translated) return translated;
  }

  return {
    text: question.text,
    options: question.options.map((o) => ({ text: o.text, subtext: o.subtext })),
    feedback: question.options.map((o) => o.feedback)
  };
}

// Same rule for major text on the result page (title / resultReason / careers)
function getMajorText(code, field) {
  const lang = getLang();

  if (lang !== "en" && typeof resultTranslations !== "undefined") {
    const t = resultTranslations[lang];
    const map = t && (field === "title" ? t.majors : t[field]);
    if (map && map[code]) return map[code];
  }

  const major = majorInfo[code];
  return (major && major[field]) || code;
}

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

  const translatedQuestion = getDisplayQuestion(question);

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
      (translatedQuestion.options && translatedQuestion.options[optionIndex]) ||
      { text: option.text, subtext: option.subtext };

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
  renderDotNav();
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

  const translatedQuestion = getDisplayQuestion(getCurrentQuestion());

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
    title: getMajorText(result.topMajor, "title"),
    resultReason: getMajorText(result.topMajor, "resultReason"),
    careers: getMajorText(result.topMajor, "careers")
  };

  const secondMajor = {
    title: getMajorText(result.secondMajor, "title")
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

  // Suggested next steps (majors added in admin get a general fallback)
  renderNextSteps(result.topMajor);

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
        getMajorText(major, "title");

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

// ── Dot navigator ────────────────────────────────────────────────────────

function renderDotNav() {
  if (!dotNav) return;
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
    btn.title = "Q" + (i + 1) + (answered ? " \u2713" : " \u2013 unanswered");
    btn.setAttribute("aria-label", "Go to question " + (i + 1));

    btn.addEventListener("click", () => {
      goToQuestion(i);
      renderCurrentQuestion();
      if (typeof applyLanguage === "function") applyLanguage(getLang());
      if (typeof updateQuizStats === "function") updateQuizStats();
    });

    dotNav.appendChild(btn);
  });
}

// ── Suggested next steps ─────────────────────────────────────────────────


const extraText = {
  en: {
    nextStepsTitle: "Suggested Next Steps",
    emailTitle: "Get Your Report by Email",
    emailDesc: "Enter your email address to receive a summary of your result.",
    emailPlaceholder: "your@email.com",
    sendReport: "Send Report",
    sending: "Sending…",
    sent: "✓ Sent!",
    invalidEmail: "Please enter a valid email address.",
    noResult: "No result found to send.",
    sendFailed: "Could not send email: ",
    adviceFallback: "Talk to a course advisor about this major."
  },
  zh: {
    nextStepsTitle: "建议的下一步",
    emailTitle: "通过电子邮件获取报告",
    emailDesc: "输入你的电子邮件地址，接收你的结果摘要。",
    emailPlaceholder: "your@email.com",
    sendReport: "发送报告",
    sending: "发送中…",
    sent: "✓ 已发送！",
    invalidEmail: "请输入有效的电子邮件地址。",
    noResult: "没有可发送的结果。",
    sendFailed: "无法发送电子邮件：",
    adviceFallback: "请向课程顾问咨询该专业。"
  },
  es: {
    nextStepsTitle: "Próximos pasos sugeridos",
    emailTitle: "Recibe tu informe por correo electrónico",
    emailDesc: "Introduce tu dirección de correo electrónico para recibir un resumen de tu resultado.",
    emailPlaceholder: "tu@correo.com",
    sendReport: "Enviar informe",
    sending: "Enviando…",
    sent: "✓ ¡Enviado!",
    invalidEmail: "Introduce una dirección de correo electrónico válida.",
    noResult: "No hay ningún resultado para enviar.",
    sendFailed: "No se pudo enviar el correo: ",
    adviceFallback: "Habla con un asesor académico sobre esta carrera."
  },
  fr: {
    nextStepsTitle: "Prochaines étapes suggérées",
    emailTitle: "Recevez votre rapport par e-mail",
    emailDesc: "Saisissez votre adresse e-mail pour recevoir un résumé de votre résultat.",
    emailPlaceholder: "votre@email.com",
    sendReport: "Envoyer le rapport",
    sending: "Envoi en cours…",
    sent: "✓ Envoyé !",
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    noResult: "Aucun résultat à envoyer.",
    sendFailed: "Impossible d’envoyer l’e-mail : ",
    adviceFallback: "Parlez à un conseiller pédagogique de cette filière."
  }
};

function getExtraText() {
  return extraText[getLang()] || extraText.en;
}

const nextStepsText = {
  en: {
    cs:    ["Explore algorithms and data structures online (e.g. CS50, Coursera)", "Practice coding challenges on LeetCode or HackerRank", "Look into Bachelor of Computer Science programs at your preferred uni", "Build a small project — a CLI tool or basic game"],
    se:    ["Start with HTML, CSS, JavaScript if you haven't already", "Follow a full-stack tutorial (React + Node, or Laravel)", "Build and deploy a real web app to show employers", "Explore open-source projects on GitHub to contribute"],
    cyber: ["Study CompTIA Security+ as an entry-level certification", "Try free labs on TryHackMe or Hack The Box", "Learn networking basics — TCP/IP, firewalls, VPNs", "Follow cyber security news (Krebs on Security, SANS)"],
    ds:    ["Learn Python and the pandas / matplotlib libraries", "Take a statistics or probability course (Khan Academy, edX)", "Work through a Kaggle beginner dataset challenge", "Explore Power BI or Tableau for data visualisation"]
  },
  zh: {
    cs:    ["在线学习算法和数据结构（例如 CS50、Coursera）", "在 LeetCode 或 HackerRank 上练习编程题", "了解你心仪大学的计算机科学学士课程", "做一个小项目——例如命令行工具或简单游戏"],
    se:    ["如果还没学过，先从 HTML、CSS 和 JavaScript 开始", "跟着一个全栈教程学习（React + Node 或 Laravel）", "构建并部署一个真实的网页应用，向雇主展示", "在 GitHub 上寻找开源项目并参与贡献"],
    cyber: ["学习入门级认证 CompTIA Security+", "在 TryHackMe 或 Hack The Box 上尝试免费实验", "学习网络基础——TCP/IP、防火墙、VPN", "关注网络安全新闻（Krebs on Security、SANS）"],
    ds:    ["学习 Python 以及 pandas / matplotlib 库", "学习统计或概率课程（Khan Academy、edX）", "完成一个 Kaggle 入门数据集挑战", "探索使用 Power BI 或 Tableau 进行数据可视化"]
  },
  es: {
    cs:    ["Explora algoritmos y estructuras de datos en línea (p. ej., CS50, Coursera)", "Practica retos de programación en LeetCode o HackerRank", "Infórmate sobre los grados en Ciencias de la Computación de tu universidad preferida", "Crea un proyecto pequeño: una herramienta de línea de comandos o un juego sencillo"],
    se:    ["Empieza con HTML, CSS y JavaScript si aún no lo has hecho", "Sigue un tutorial full-stack (React + Node o Laravel)", "Crea y publica una aplicación web real para mostrarla a empleadores", "Explora proyectos de código abierto en GitHub en los que contribuir"],
    cyber: ["Estudia la certificación de nivel inicial CompTIA Security+", "Prueba los laboratorios gratuitos de TryHackMe o Hack The Box", "Aprende los fundamentos de redes: TCP/IP, cortafuegos, VPN", "Sigue las noticias de ciberseguridad (Krebs on Security, SANS)"],
    ds:    ["Aprende Python y las librerías pandas / matplotlib", "Haz un curso de estadística o probabilidad (Khan Academy, edX)", "Completa un reto de datos para principiantes en Kaggle", "Explora Power BI o Tableau para la visualización de datos"]
  },
  fr: {
    cs:    ["Découvrez les algorithmes et les structures de données en ligne (ex. CS50, Coursera)", "Entraînez-vous avec des défis de programmation sur LeetCode ou HackerRank", "Renseignez-vous sur les licences en informatique de l’université de votre choix", "Réalisez un petit projet : un outil en ligne de commande ou un jeu simple"],
    se:    ["Commencez par HTML, CSS et JavaScript si ce n’est pas déjà fait", "Suivez un tutoriel full-stack (React + Node ou Laravel)", "Créez et déployez une vraie application web à montrer aux employeurs", "Explorez des projets open source sur GitHub auxquels contribuer"],
    cyber: ["Préparez la certification d’entrée CompTIA Security+", "Essayez les labs gratuits de TryHackMe ou Hack The Box", "Apprenez les bases des réseaux : TCP/IP, pare-feu, VPN", "Suivez l’actualité de la cybersécurité (Krebs on Security, SANS)"],
    ds:    ["Apprenez Python et les bibliothèques pandas / matplotlib", "Suivez un cours de statistiques ou de probabilités (Khan Academy, edX)", "Relevez un défi Kaggle pour débutants", "Découvrez Power BI ou Tableau pour la visualisation des données"]
  }
};

function renderNextSteps(majorCode) {
  if (!nextStepsList) return;
  nextStepsList.innerHTML = "";

  const byMajor = nextStepsText[getLang()] || nextStepsText.en;
  // Majors added in admin have no steps written yet, so show general advice
  const steps = byMajor[majorCode] || nextStepsText.en[majorCode] || [getExtraText().adviceFallback];

  steps.forEach((step) => {
    const li = document.createElement("li");
    li.textContent = step;
    nextStepsList.appendChild(li);
  });
}

// Headings and email panel text (called from applyLanguage)
function applyExtraTranslations(lang) {
  const t = extraText[lang] || extraText.en;

  const stepsPanel = nextStepsList && nextStepsList.closest(".result-panel");
  if (stepsPanel) stepsPanel.querySelector("h4").textContent = t.nextStepsTitle;

  const emailPanel = document.querySelector(".email-panel");
  if (emailPanel) {
    emailPanel.querySelector("h4").textContent = t.emailTitle;
    emailPanel.querySelector("p").textContent = t.emailDesc;
  }

  const emailInput = document.getElementById("emailInput");
  if (emailInput) emailInput.placeholder = t.emailPlaceholder;

  const emailButton = document.getElementById("emailBtn");
  if (emailButton && !emailButton.disabled) emailButton.textContent = t.sendReport;
}