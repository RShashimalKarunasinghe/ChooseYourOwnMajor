let currentMessageType = null;
let currentResult = null;

startBtn.addEventListener("click", () => {
  const saved = localStorage.getItem("quizProgress");

  if (saved) {
    loadProgress(); // resume
  } else {
    resetQuizState(); // fresh start
  }

  showQuizSection();
  renderCurrentQuestion();
  updateQuizStats();
});

prevBtn.addEventListener("click", () => {
  goToPreviousQuestion();
  renderCurrentQuestion();
  applyLanguage(localStorage.getItem("selectedLanguage") || "en");
  updateQuizStats();
});

nextBtn.addEventListener("click", () => {
  if (!isCurrentQuestionAnswered()) {
    showSkippedMessage(); // Show message and remember its type
  } else {
    formMessage.textContent = "";
    currentMessageType = null;
  }

  goToNextQuestion();
  renderCurrentQuestion();
  applyLanguage(localStorage.getItem("selectedLanguage") || "en");
  updateQuizStats();
});

document.getElementById("quizForm").addEventListener("submit", (event) => {
  event.preventDefault();
  submitQuiz();
});

restartBtn.addEventListener("click", () => {
  resetQuizState();
  resetUI();
  localStorage.removeItem("quizProgress"); // Clear saved progress
  const lang =
    localStorage.getItem("selectedLanguage") || "en";

  startBtn.textContent =
    translations[lang].startQuiz; // Reset start button text
});

function submitQuiz() {
  if (!areAllQuestionsAnswered()) {
    showValidationMessage();
    return;
  }

  const result = calculateResult();

  currentResult = result;

  saveQuizRecord(result);
  renderResult(result);
  showResultSection();

  localStorage.removeItem("quizProgress");
}

function saveQuizRecord(result) {
  const records = JSON.parse(localStorage.getItem("majorQuizRecords") || "[]");

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
    totals: result.totals
  });

  localStorage.setItem("majorQuizRecords", JSON.stringify(records));
}

window.addEventListener("DOMContentLoaded", () => {
 
  resetUI();
  loadProgress();

  // Load saved language
  const savedLanguage =
    localStorage.getItem("selectedLanguage") || "en";

  renderLanguageOptions();

  languageSelect.value = savedLanguage;

  applyLanguage(savedLanguage);

  // Check saved progress
  const saved = localStorage.getItem("quizProgress");

  if (saved) {
    startBtn.textContent =
      translations[savedLanguage].resumeQuiz;
    renderCurrentQuestion();
  } else {
    startBtn.textContent =
      translations[savedLanguage].startQuiz;
  }

  applyLanguage(savedLanguage);
  updateQuizStats();
});

const translations = {
  en: {
    // Home page
    heroTitle: "Discover Your Ideal Tech Path",
    heroDescription:
      "Take a short quiz to explore which ICT major may fit your interests, strengths, and working preferences best.",
    quickAndSimple: "Takes 2–3 minutes",
    quickAndSimpleDesc:
      "Quick, focused, and simple to complete.",
    personalised: "Personalised recommendation",
    personalisedDesc:
      "Based on your work and learning preferences.",
    eyebrow: "ICT Project Sprint 1 Prototype",
    pathwayMatch: "Pathway match",
    pathwayMatchText: "Computer Science, Software, Cyber Security, or Data Science",
    resultSummary: "Result summary",
    resultSummaryText: "Major recommendation with score breakdown",

    // Navigation / controls
    startQuiz: "Start Quiz",
    resumeQuiz: "Resume Quiz",
    adminLogin: "Admin Login",
    accessibilityMode: "Accessibility Mode",
    navQuiz: "Quiz",
    navAdmin: "Admin",
    accessibilityMode: "Accessibility Mode",

    // Quiz
    questionnaire: "QUESTIONNAIRE",
    quizTitle: "Find the ICT Major That Fits You Best",
    questionOf: "Question",
    of: "of",
    answered: "Answered",
    skippedCount: "Skipped",

    // Buttons
    next: "Next",
    skip: "Skip",
    restart: "Restart Quiz",
    previous: "Previous",
    seeResult: "See Result",

    // Messages
    skippedMessage: "You skipped this question.",
    selectAnswerMessage:
      "Please select an option before submitting the quiz.",
    unansweredMessage:
      "You have skipped question(s):",
    answerBeforeSubmit:
      "Please answer them before submitting.",

    // Result page
    recommendation: "Recommendation",
    yourResult: "Your Result",
    recommendedMajor: "Recommended Major",
    matchLevel: "Match Level",
    whyResult: "Why this result?",
    alternativeMatch: "Alternative Match",
    alternativeMatchText: "Alternative match",
    whatThisMeans: "What this means",
    yourProfile: "Your Profile",
    scoreBreakdown: "Score Breakdown",
    exploreMajor: "Explore This Major",
    restartQuiz: "Restart Quiz",
    strongMatch: "Strong Match",
    goodMatch: "Good Match",
    possibleMatch: "Possible Match",
    resultMajors: {
      cs: {
        title: "Computer Science",
        careers:
          "You may enjoy roles such as computer scientist, systems analyst, research developer, or algorithm-focused engineer.",
        resultReason:
          "Your answers show strong interest in logical reasoning, complex technical problem-solving, and computational thinking.",
        exploreText:
          "Computer Science focuses on algorithms, programming concepts, systems thinking, and solving technical problems at a deeper level."
      },
      se: {
        title: "Software Development",
        careers:
          "You may enjoy roles such as software developer, web developer, mobile app developer, or application engineer.",
        resultReason:
          "Your answers show strong interest in building applications, designing practical solutions, and creating digital products for users.",
        exploreText:
          "Software Development focuses on designing, building, testing, and improving applications, websites, and digital systems."
      },
      cyber: {
        title: "Cyber Security",
        careers:
          "You may enjoy roles such as cyber security analyst, security consultant, penetration tester, or security operations specialist.",
        resultReason:
          "Your answers show strong interest in protecting systems, managing risks, and identifying digital threats and vulnerabilities.",
        exploreText:
          "Cyber Security focuses on defending systems, networks, and data against cyber threats and improving digital safety."
      },
      ds: {
        title: "Data Science",
        careers:
          "You may enjoy roles such as data analyst, data specialist, business intelligence analyst, or insight-driven technical professional.",
        resultReason:
          "Your answers show strong interest in patterns, data interpretation, and using information to support understanding and decisions.",
        exploreText:
          "Data Science focuses on analysing data, finding trends, visualising results, and supporting data-driven decision-making."
      }
    },

    personalityTags: {
      cs: "Problem Solver",
      se: "Creative Builder",
      cyber: "Risk Protector",
      ds: "Insight Explorer"
    }
  },

  zh: {
    // Home page
    heroTitle: "探索最适合你的科技发展方向",
    heroDescription:
      "完成一个简短的测验，探索最符合你的兴趣、优势和工作偏好的信息通信技术专业。",
    quickAndSimple: "只需 2–3 分钟",
    quickAndSimpleDesc:
      "快速、专注且简单易完成。",
    personalised: "个性化推荐",
    personalisedDesc:
      "根据你的工作方式和学习偏好进行推荐。",
    eyebrow: "ICT 项目 Sprint 1 原型",
    pathwayMatch: "专业方向匹配",
    pathwayMatchText: "计算机科学、软件工程、网络安全或数据科学",
    resultSummary: "结果摘要",
    resultSummaryText: "专业推荐及分数明细",

    // Navigation / controls
    startQuiz: "开始测验",
    resumeQuiz: "继续测验",
    adminLogin: "管理员登录",
    accessibilityMode: "无障碍模式",
    navQuiz: "测验",
    navAdmin: "管理员",
    accessibilityMode: "无障碍模式",

    // Quiz
    questionnaire: "问卷",
    quizTitle: "找到最适合你的信息通信技术专业",
    questionOf: "第",
    of: "题，共",
    answered: "已回答",
    skippedCount: "已跳过",

    // Buttons
    next: "下一题",
    skip: "跳过",
    restart: "重新开始",
    previous: "上一题",
    seeResult: "查看结果",

    // Messages
    skippedMessage: "你跳过了这道题。",
    selectAnswerMessage:
      "提交测验前，请选择一个选项。",
    unansweredMessage:
      "你跳过了以下问题：",
    answerBeforeSubmit:
      "请在提交前回答这些问题。",

    // Result page
    recommendation: "推荐",
    yourResult: "你的结果",
    recommendedMajor: "推荐专业",
    matchLevel: "匹配程度",
    whyResult: "为什么是这个结果？",
    alternativeMatch: "其他匹配",
    alternativeMatchText: "其他匹配",
    whatThisMeans: "这意味着什么",
    yourProfile: "你的个人画像",
    scoreBreakdown: "分数明细",
    exploreMajor: "探索此专业",
    restartQuiz: "重新开始测验",
    strongMatch: "高度匹配",
    goodMatch: "良好匹配",
    possibleMatch: "可能匹配",
    resultMajors: {
      cs: {
        title: "计算机科学",
        careers:
          "你可能适合计算机科学家、系统分析师、研究开发人员或算法工程师等职业。",
        resultReason:
          "你的回答显示出你对逻辑推理、复杂技术问题解决和计算思维有浓厚兴趣。",
        exploreText:
          "计算机科学专注于算法、编程概念、系统思维以及深入解决技术问题。"
      },
      se: {
        title: "软件开发",
        careers:
          "你可能适合软件开发人员、网页开发人员、移动应用开发人员或应用工程师等职业。",
        resultReason:
          "你的回答显示出你对构建应用程序、设计实用解决方案以及为用户创建数字产品有浓厚兴趣。",
        exploreText:
          "软件开发专注于设计、构建、测试和改进应用程序、网站和数字系统。"
      },
      cyber: {
        title: "网络安全",
        careers:
          "你可能适合网络安全分析师、安全顾问、渗透测试人员或安全运营专家等职业。",
        resultReason:
          "你的回答显示出你对保护系统、管理风险以及识别数字威胁和漏洞有浓厚兴趣。",
        exploreText:
          "网络安全专注于保护系统、网络和数据免受网络威胁，并提高数字安全性。"
      },
      ds: {
        title: "数据科学",
        careers:
          "你可能适合数据分析师、数据专家、商业智能分析师或数据驱动型技术专业人员等职业。",
        resultReason:
          "你的回答显示出你对发现规律、解释数据以及利用信息支持理解和决策有浓厚兴趣。",
        exploreText:
          "数据科学专注于分析数据、发现趋势、可视化结果以及支持数据驱动的决策。"
      }
    },

    personalityTags: {
      cs: "问题解决者",
      se: "创意构建者",
      cyber: "风险保护者",
      ds: "洞察探索者"
    }
  },

  es: {
    // Home page
    heroTitle: "Descubre tu camino tecnológico ideal",
    heroDescription:
      "Realiza un breve cuestionario para descubrir qué especialidad de TIC se adapta mejor a tus intereses, fortalezas y preferencias de trabajo.",
    quickAndSimple: "Solo 2–3 minutos",
    quickAndSimpleDesc:
      "Rápido, sencillo y fácil de completar.",
    personalised: "Recomendación personalizada",
    personalisedDesc:
      "Basada en tus preferencias de trabajo y aprendizaje.",
    eyebrow: "Prototipo del Sprint 1 del Proyecto ICT",
    pathwayMatch: "Coincidencia de trayectoria",
    pathwayMatchText: "Ciencias de la Computación, Software, Ciberseguridad o Ciencia de Datos",
    resultSummary: "Resumen del resultado",
    resultSummaryText: "Recomendación de especialidad con desglose de puntuación",

    // Navigation / controls
    startQuiz: "Comenzar cuestionario",
    resumeQuiz: "Reanudar cuestionario",
    adminLogin: "Inicio de sesión de administrador",
    accessibilityMode: "Modo de accesibilidad",
    navQuiz: "Cuestionario",
    navAdmin: "Administrador",
    accessibilityMode: "Modo de accesibilidad",

    // Quiz
    questionnaire: "CUESTIONARIO",
    quizTitle: "Encuentra la especialidad de TIC que mejor se adapta a ti",
    questionOf: "Pregunta",
    of: "de",
    answered: "Respondidas",
    skippedCount: "Saltadas",

    // Buttons
    next: "Siguiente",
    skip: "Saltar",
    restart: "Reiniciar cuestionario",
    previous: "Anterior",
    seeResult: "Ver resultado",

    // Messages
    skippedMessage: "Has saltado esta pregunta.",
    selectAnswerMessage:
      "Selecciona una opción antes de enviar el cuestionario.",
    unansweredMessage:
      "Has omitido las siguientes preguntas:",
    answerBeforeSubmit:
      "Respóndelas antes de enviar el cuestionario.",

    // Result page
    recommendation: "Recomendación",
    yourResult: "Tu resultado",
    recommendedMajor: "Especialidad recomendada",
    matchLevel: "Nivel de coincidencia",
    whyResult: "¿Por qué este resultado?",
    alternativeMatch: "Coincidencia alternativa",
    alternativeMatchText: "Coincidencia alternativa",
    whatThisMeans: "Qué significa esto",
    yourProfile: "Tu perfil",
    scoreBreakdown: "Desglose de puntuación",
    exploreMajor: "Explorar esta especialidad",
    restartQuiz: "Reiniciar cuestionario",
    strongMatch: "Coincidencia fuerte",
    goodMatch: "Buena coincidencia",
    possibleMatch: "Posible coincidencia",
    resultMajors: {
      cs: {
        title: "Ciencias de la Computación",
        careers:
          "Podrías disfrutar de roles como científico informático, analista de sistemas, desarrollador de investigación o ingeniero especializado en algoritmos.",
        resultReason:
          "Tus respuestas muestran un gran interés por el razonamiento lógico, la resolución de problemas técnicos complejos y el pensamiento computacional.",
        exploreText:
          "Las Ciencias de la Computación se centran en algoritmos, conceptos de programación, pensamiento sistémico y resolución profunda de problemas técnicos."
      },
      se: {
        title: "Desarrollo de Software",
        careers:
          "Podrías disfrutar de roles como desarrollador de software, desarrollador web, desarrollador de aplicaciones móviles o ingeniero de aplicaciones.",
        resultReason:
          "Tus respuestas muestran un gran interés por crear aplicaciones, diseñar soluciones prácticas y desarrollar productos digitales para los usuarios.",
        exploreText:
          "El Desarrollo de Software se centra en diseñar, crear, probar y mejorar aplicaciones, sitios web y sistemas digitales."
      },
      cyber: {
        title: "Ciberseguridad",
        careers:
          "Podrías disfrutar de roles como analista de ciberseguridad, consultor de seguridad, especialista en pruebas de penetración o especialista en operaciones de seguridad.",
        resultReason:
          "Tus respuestas muestran un gran interés por proteger sistemas, gestionar riesgos e identificar amenazas y vulnerabilidades digitales.",
        exploreText:
          "La Ciberseguridad se centra en proteger sistemas, redes y datos frente a amenazas digitales y mejorar la seguridad."
      },
      ds: {
        title: "Ciencia de Datos",
        careers:
          "Podrías disfrutar de roles como analista de datos, especialista en datos, analista de inteligencia empresarial o profesional técnico especializado en información.",
        resultReason:
          "Tus respuestas muestran un gran interés por encontrar patrones, interpretar datos y utilizar información para comprender situaciones y apoyar decisiones.",
        exploreText:
          "La Ciencia de Datos se centra en analizar datos, encontrar tendencias, visualizar resultados y apoyar la toma de decisiones basada en datos."
      }
    },

    personalityTags: {
      cs: "Solucionador de problemas",
      se: "Constructor creativo",
      cyber: "Protector de riesgos",
      ds: "Explorador de información"
    }
  },

  fr: {
    // Home page
    heroTitle: "Découvrez votre parcours technologique idéal",
    heroDescription:
      "Répondez à un court questionnaire pour découvrir quelle spécialité en TIC correspond le mieux à vos intérêts, vos points forts et vos préférences de travail.",
    quickAndSimple: "Seulement 2 à 3 minutes",
    quickAndSimpleDesc:
      "Rapide, ciblé et simple à compléter.",
    personalised: "Recommandation personnalisée",
    personalisedDesc:
      "Basée sur vos préférences de travail et d’apprentissage.",
    eyebrow: "Prototype du Sprint 1 du projet TIC",
    pathwayMatch: "Correspondance de parcours",
    pathwayMatchText: "Informatique, logiciels, cybersécurité ou science des données",
    resultSummary: "Résumé du résultat",
    resultSummaryText: "Recommandation de spécialité avec détail du score",

    // Navigation / controls
    startQuiz: "Commencer le quiz",
    resumeQuiz: "Reprendre le quiz",
    adminLogin: "Connexion administrateur",
    accessibilityMode: "Mode d’accessibilité",
    navQuiz: "Quiz",
    navAdmin: "Administrateur",
    accessibilityMode: "Mode d’accessibilité",

    // Quiz
    questionnaire: "QUESTIONNAIRE",
    quizTitle: "Trouvez la spécialité en TIC qui vous correspond le mieux",
    questionOf: "Question",
    of: "sur",
    answered: "Répondues",
    skippedCount: "Passées",

    // Buttons
    next: "Suivant",
    skip: "Passer",
    restart: "Redémarrer le quiz",
    previous: "Précédent",
    seeResult: "Voir le résultat",

    // Messages
    skippedMessage: "Vous avez passé cette question.",
    selectAnswerMessage:
      "Veuillez sélectionner une option avant de soumettre le quiz.",
    unansweredMessage:
      "Vous avez ignoré les questions suivantes :",
    answerBeforeSubmit:
      "Veuillez y répondre avant de soumettre le quiz.",

    // Result page
    recommendation: "Recommandation",
    yourResult: "Votre résultat",
    recommendedMajor: "Spécialité recommandée",
    matchLevel: "Niveau de correspondance",
    whyResult: "Pourquoi ce résultat ?",
    alternativeMatch: "Correspondance alternative",
    alternativeMatchText: "Correspondance alternative",
    whatThisMeans: "Ce que cela signifie",
    yourProfile: "Votre profil",
    scoreBreakdown: "Détail des scores",
    exploreMajor: "Explorer cette spécialité",
    restartQuiz: "Recommencer le quiz",
    strongMatch: "Forte correspondance",
    goodMatch: "Bonne correspondance",
    possibleMatch: "Correspondance possible",
    resultMajors: {
      cs: {
        title: "Informatique",
        careers:
          "Vous pourriez apprécier des rôles tels que scientifique informatique, analyste systèmes, développeur en recherche ou ingénieur spécialisé en algorithmes.",
        resultReason:
          "Vos réponses montrent un fort intérêt pour le raisonnement logique, la résolution de problèmes techniques complexes et la pensée computationnelle.",
        exploreText:
          "L'informatique se concentre sur les algorithmes, les concepts de programmation, la pensée systémique et la résolution approfondie de problèmes techniques."
      },
      se: {
        title: "Développement logiciel",
        careers:
          "Vous pourriez apprécier des rôles tels que développeur logiciel, développeur web, développeur d'applications mobiles ou ingénieur logiciel.",
        resultReason:
          "Vos réponses montrent un fort intérêt pour la création d'applications, la conception de solutions pratiques et le développement de produits numériques pour les utilisateurs.",
        exploreText:
          "Le développement logiciel se concentre sur la conception, la création, les tests et l'amélioration des applications, sites web et systèmes numériques."
      },
      cyber: {
        title: "Cybersécurité",
        careers:
          "Vous pourriez apprécier des rôles tels qu'analyste en cybersécurité, consultant en sécurité, testeur d'intrusion ou spécialiste des opérations de sécurité.",
        resultReason:
          "Vos réponses montrent un fort intérêt pour la protection des systèmes, la gestion des risques et l'identification des menaces et vulnérabilités numériques.",
        exploreText:
          "La cybersécurité se concentre sur la protection des systèmes, réseaux et données contre les cybermenaces et sur l'amélioration de la sécurité numérique."
      },
      ds: {
        title: "Science des données",
        careers:
          "Vous pourriez apprécier des rôles tels qu'analyste de données, spécialiste des données, analyste en intelligence d'affaires ou professionnel technique spécialisé dans l'analyse.",
        resultReason:
          "Vos réponses montrent un fort intérêt pour les tendances, l'interprétation des données et l'utilisation des informations pour comprendre les situations et soutenir les décisions.",
        exploreText:
          "La science des données se concentre sur l'analyse des données, la recherche de tendances, la visualisation des résultats et la prise de décision basée sur les données."
      }
    },

    personalityTags: {
      cs: "Résolveur de problèmes",
      se: "Créateur innovant",
      cyber: "Protecteur des risques",
      ds: "Explorateur de données"
    }
  }
};

function applyLanguage(lang) {

  document.getElementById("heroTitle").textContent =
    translations[lang].heroTitle;
  document.getElementById("heroDescription").textContent =
    translations[lang].heroDescription;
  document.getElementById("quickAndSimple").textContent =
    translations[lang].quickAndSimple;
  document.getElementById("quickAndSimpleDesc").textContent =
    translations[lang].quickAndSimpleDesc;
  document.getElementById("personalised").textContent =
    translations[lang].personalised;
  document.getElementById("personalisedDesc").textContent =
    translations[lang].personalisedDesc;
  document.getElementById("eyebrow").textContent =
    translations[lang].eyebrow;
  document.getElementById("navQuiz").textContent =
    translations[lang].navQuiz;
  document.getElementById("navAdmin").textContent =
    translations[lang].navAdmin;
  document.getElementById("pathwayMatch").textContent =
    translations[lang].pathwayMatch;
  document.getElementById("pathwayMatchText").textContent =
    translations[lang].pathwayMatchText;
  document.getElementById("resultSummary").textContent =
    translations[lang].resultSummary;
  document.getElementById("resultSummaryText").textContent =
    translations[lang].resultSummaryText;
  document.getElementById("adminLoginBtn").textContent =
    translations[lang].adminLogin;
  document.querySelector("#quizSection .section-label").textContent =
  translations[lang].questionnaire;
  document.querySelector("#quizSection > .quiz-top h2").textContent =
    translations[lang].quizTitle;

  const saved = localStorage.getItem("quizProgress");

  // Start button
  if (saved) {
    startBtn.textContent = translations[lang].resumeQuiz;
  } else {
    startBtn.textContent = translations[lang].startQuiz;
  }

  // Restart button
  restartBtn.textContent = translations[lang].restart;

  // Next / Skip button
  if (!isCurrentQuestionAnswered()) {
    nextBtn.textContent = translations[lang].skip;
  } else {
    nextBtn.textContent = translations[lang].next;
  }

  prevBtn.textContent = translations[lang].previous;
  
  submitBtn.textContent = translations[lang].seeResult;

  // Result page
  document.querySelector("#resultSection .section-label").textContent =
    translations[lang].recommendation;
  document.querySelector("#resultSection > h2").textContent =
    translations[lang].yourResult;
  document.querySelector("#resultSection .result-hero .result-small-title").textContent =
    translations[lang].recommendedMajor;
  document.querySelector("#resultSection .match-box .result-small-title").textContent =
    translations[lang].matchLevel;

  const resultPanels = document.querySelectorAll("#resultSection .result-panel");

  if (resultPanels.length >= 5) {
    resultPanels[0].querySelector("h4").textContent =
      translations[lang].whyResult;

    resultPanels[1].querySelector("h4").textContent =
      translations[lang].alternativeMatch;

    resultPanels[2].querySelector("h4").textContent =
      translations[lang].whatThisMeans;

    resultPanels[3].querySelector("h4").textContent =
      translations[lang].yourProfile;

    resultPanels[4].querySelector("h4").textContent =
      translations[lang].scoreBreakdown;
  }

  exploreBtn.textContent = translations[lang].exploreMajor;
  restartBtn.textContent = translations[lang].restartQuiz;

  // Accessibility button
  contrastToggle.textContent = translations[lang].accessibilityMode;
}

const languageSelect = document.getElementById("languageSelect");

function renderLanguageOptions() {
  const enabledLanguages = ["en", "zh", "es", "fr"];

  languageSelect.innerHTML = "";

  enabledLanguages.forEach((lang) => {
    const option = document.createElement("option");

    option.value = lang;

    const names = {
      en: "English",
      zh: "中文",
      es: "Español",
      fr: "Français"
    };

    option.textContent = names[lang];

    languageSelect.appendChild(option);
  });
}

languageSelect.addEventListener("change", () => {
  const lang = languageSelect.value;

  localStorage.setItem("selectedLanguage", lang);

  // Translate the general website
  applyLanguage(lang);

  // Re-render quiz if it is open
  if (!quizSection.classList.contains("hidden")) {
    renderCurrentQuestion();
  }

  // Re-render result if it is open
  if (!resultSection.classList.contains("hidden") && currentResult) {
    renderResult(currentResult);
  }

  updateQuizStats();

  // Restore skipped/validation message
  if (currentMessageType === "skipped") {
    showSkippedMessage();
  } else if (currentMessageType === "validation") {
    showValidationMessage();
  } else {
    formMessage.textContent = "";
  }
});

let currentFontSize = 16;

const increaseFont = document.getElementById("increaseFont");
const decreaseFont = document.getElementById("decreaseFont");

increaseFont.addEventListener("click", () => {
  currentFontSize += 2;
  document.body.style.fontSize = currentFontSize + "px";
});

decreaseFont.addEventListener("click", () => {
  if (currentFontSize > 12) {
    currentFontSize -= 2;
    document.body.style.fontSize = currentFontSize + "px";
  }
});

const contrastToggle = document.getElementById("contrastToggle");

contrastToggle.addEventListener("click", () => {
  document.body.classList.toggle("high-contrast");
});
