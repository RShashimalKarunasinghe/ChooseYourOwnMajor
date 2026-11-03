// js/languages.js
// Language switching for the student quiz.
//
//  - uiStrings            : fixed interface text (buttons, headings, messages)
//  - contentTranslations  : translations of quiz questions, answers and major
//                           text. They are stored in the `translations` table and
//                           created automatically when an admin saves a question
//                           or major (see js/auto-translate.js). Text with no
//                           translation yet is shown in English.

const languageConfig = {
  "en": {
    "name": "English",
    "nativeName": "English"
  },
  "zh": {
    "name": "Chinese",
    "nativeName": "中文"
  },
  "es": {
    "name": "Spanish",
    "nativeName": "Español"
  },
  "fr": {
    "name": "French",
    "nativeName": "Français"
  }
};

const uiStrings = {
  "en": {
    "heroTitle": "Discover Your Ideal Tech Path",
    "heroDescription": "Take a short quiz to explore which ICT major may fit your interests, strengths, and working preferences best.",
    "quickAndSimple": "Takes 2–3 minutes",
    "quickAndSimpleDesc": "Quick, focused, and simple to complete.",
    "personalised": "Personalised recommendation",
    "personalisedDesc": "Based on your work and learning preferences.",
    "eyebrow": "ICT Project Sprint 1 Prototype",
    "pathwayMatch": "Pathway match",
    "pathwayMatchText": "Computer Science, Software, Cyber Security, or Data Science",
    "resultSummary": "Result summary",
    "resultSummaryText": "Major recommendation with score breakdown",
    "startQuiz": "Start Quiz",
    "resumeQuiz": "Resume Quiz",
    "accessibilityMode": "Accessibility Mode",
    "navQuiz": "Quiz",
    "questionnaire": "Questionnaire",
    "quizTitle": "Find the ICT Major That Fits You Best",
    "questionOf": "Question",
    "of": "of",
    "answered": "Answered",
    "skippedCount": "Skipped",
    "next": "Next",
    "skip": "Skip",
    "restart": "Restart Quiz",
    "previous": "Previous",
    "seeResult": "See Result",
    "skippedMessage": "You skipped this question.",
    "selectAnswerMessage": "Please select an option before submitting the quiz.",
    "unansweredMessage": "You have skipped question(s):",
    "answerBeforeSubmit": "Please answer them before submitting.",
    "recommendation": "Recommendation",
    "yourResult": "Your Result",
    "recommendedMajor": "Recommended Major",
    "matchLevel": "Match Level",
    "whyResult": "Why this result?",
    "alternativeMatch": "Alternative Match",
    "alternativeMatchText": "Alternative match",
    "whatThisMeans": "What this means",
    "yourProfile": "Your Profile",
    "scoreBreakdown": "Score Breakdown",
    "exploreMajor": "Explore This Major",
    "restartQuiz": "Restart Quiz",
    "strongMatch": "Strong Match",
    "goodMatch": "Good Match",
    "possibleMatch": "Possible Match",
    "recommendationEvidenceTitle": "Your answers that contributed to this result:",
    "noRecommendationEvidence": "No specific answer contributed directly to this recommendation.",
    "quizAnalytics": "Quiz Analytics",
    "scanToLearnMore": "Scan to learn more",
    "qrCaption": "Scan the QR code with your phone's camera, or open the link below.",
    "qrAlt": "QR code linking to {url}",
    "relatedTitle": "Related courses & minors",
    "relatedIntro": "Other areas of study that pair well with this major.",
    "compareTitle": "Compare majors side by side",
    "compareIntro": "Choose any two majors to compare their careers and focus areas.",
    "compareMajorOne": "Major one",
    "compareMajorTwo": "Major two",
    "compareSame": "Please choose two different majors to compare.",
    "compareFeature": "Feature",
    "compareTag": "Profile tag",
    "compareCareers": "Career pathways",
    "compareWhy": "Why it fits",
    "compareFocus": "Core focus",
    "compareRelated": "Related courses",
    "noneListed": "None listed",
    "analyticsLine": "{percent}% of students also got: {major}",
    "loading": "Loading...",
    "unavailable": "Unavailable",
    "serverError": "Could not connect to the server. Please try again later.",
    "languageLabel": "Language",
    "fontSmaller": "Smaller text",
    "fontLarger": "Larger text"
  },
  "zh": {
    "heroTitle": "探索最适合你的科技发展方向",
    "heroDescription": "完成一个简短的测验，探索最符合你的兴趣、优势和工作偏好的信息通信技术专业。",
    "quickAndSimple": "只需 2–3 分钟",
    "quickAndSimpleDesc": "快速、专注且简单易完成。",
    "personalised": "个性化推荐",
    "personalisedDesc": "根据你的工作方式和学习偏好进行推荐。",
    "eyebrow": "ICT 项目 Sprint 1 原型",
    "pathwayMatch": "专业方向匹配",
    "pathwayMatchText": "计算机科学、软件工程、网络安全或数据科学",
    "resultSummary": "结果摘要",
    "resultSummaryText": "专业推荐及分数明细",
    "startQuiz": "开始测验",
    "resumeQuiz": "继续测验",
    "accessibilityMode": "无障碍模式",
    "navQuiz": "测验",
    "questionnaire": "问卷",
    "quizTitle": "找到最适合你的信息通信技术专业",
    "questionOf": "第",
    "of": "题，共",
    "answered": "已回答",
    "skippedCount": "已跳过",
    "next": "下一题",
    "skip": "跳过",
    "restart": "重新开始",
    "previous": "上一题",
    "seeResult": "查看结果",
    "skippedMessage": "你跳过了这道题。",
    "selectAnswerMessage": "提交测验前，请选择一个选项。",
    "unansweredMessage": "你跳过了以下问题：",
    "answerBeforeSubmit": "请在提交前回答这些问题。",
    "recommendation": "推荐",
    "yourResult": "你的结果",
    "recommendedMajor": "推荐专业",
    "matchLevel": "匹配程度",
    "whyResult": "为什么是这个结果？",
    "alternativeMatch": "其他匹配",
    "alternativeMatchText": "其他匹配",
    "whatThisMeans": "这意味着什么",
    "yourProfile": "你的个人画像",
    "scoreBreakdown": "分数明细",
    "exploreMajor": "探索此专业",
    "restartQuiz": "重新开始测验",
    "strongMatch": "高度匹配",
    "goodMatch": "良好匹配",
    "possibleMatch": "可能匹配",
    "recommendationEvidenceTitle": "促成这一推荐结果的答案：",
    "noRecommendationEvidence": "没有具体答案直接促成这一推荐结果。",
    "quizAnalytics": "测验统计",
    "scanToLearnMore": "扫码了解更多",
    "qrCaption": "用手机摄像头扫描二维码，或打开下方链接。",
    "qrAlt": "指向 {url} 的二维码",
    "relatedTitle": "相关课程与辅修",
    "relatedIntro": "与该专业搭配良好的其他学习领域。",
    "compareTitle": "并排比较专业",
    "compareIntro": "选择任意两个专业，比较其职业方向和重点领域。",
    "compareMajorOne": "专业一",
    "compareMajorTwo": "专业二",
    "compareSame": "请选择两个不同的专业进行比较。",
    "compareFeature": "项目",
    "compareTag": "个人特质标签",
    "compareCareers": "职业发展路径",
    "compareWhy": "为何适合你",
    "compareFocus": "核心内容",
    "compareRelated": "相关课程",
    "noneListed": "暂无",
    "analyticsLine": "{percent}% 的学生也得到了：{major}",
    "loading": "加载中...",
    "unavailable": "暂不可用",
    "serverError": "无法连接到服务器，请稍后再试。",
    "languageLabel": "语言",
    "fontSmaller": "缩小文字",
    "fontLarger": "放大文字"
  },
  "es": {
    "heroTitle": "Descubre tu camino tecnológico ideal",
    "heroDescription": "Realiza un breve cuestionario para descubrir qué especialidad de TIC se adapta mejor a tus intereses, fortalezas y preferencias de trabajo.",
    "quickAndSimple": "Solo 2–3 minutos",
    "quickAndSimpleDesc": "Rápido, sencillo y fácil de completar.",
    "personalised": "Recomendación personalizada",
    "personalisedDesc": "Basada en tus preferencias de trabajo y aprendizaje.",
    "eyebrow": "Prototipo del Sprint 1 del Proyecto ICT",
    "pathwayMatch": "Coincidencia de trayectoria",
    "pathwayMatchText": "Ciencias de la Computación, Software, Ciberseguridad o Ciencia de Datos",
    "resultSummary": "Resumen del resultado",
    "resultSummaryText": "Recomendación de especialidad con desglose de puntuación",
    "startQuiz": "Comenzar cuestionario",
    "resumeQuiz": "Reanudar cuestionario",
    "accessibilityMode": "Modo de accesibilidad",
    "navQuiz": "Cuestionario",
    "questionnaire": "CUESTIONARIO",
    "quizTitle": "Encuentra la especialidad de TIC que mejor se adapta a ti",
    "questionOf": "Pregunta",
    "of": "de",
    "answered": "Respondidas",
    "skippedCount": "Saltadas",
    "next": "Siguiente",
    "skip": "Saltar",
    "restart": "Reiniciar cuestionario",
    "previous": "Anterior",
    "seeResult": "Ver resultado",
    "skippedMessage": "Has saltado esta pregunta.",
    "selectAnswerMessage": "Selecciona una opción antes de enviar el cuestionario.",
    "unansweredMessage": "Has omitido las siguientes preguntas:",
    "answerBeforeSubmit": "Respóndelas antes de enviar el cuestionario.",
    "recommendation": "Recomendación",
    "yourResult": "Tu resultado",
    "recommendedMajor": "Especialidad recomendada",
    "matchLevel": "Nivel de coincidencia",
    "whyResult": "¿Por qué este resultado?",
    "alternativeMatch": "Coincidencia alternativa",
    "alternativeMatchText": "Coincidencia alternativa",
    "whatThisMeans": "Qué significa esto",
    "yourProfile": "Tu perfil",
    "scoreBreakdown": "Desglose de puntuación",
    "exploreMajor": "Explorar esta especialidad",
    "restartQuiz": "Reiniciar cuestionario",
    "strongMatch": "Coincidencia fuerte",
    "goodMatch": "Buena coincidencia",
    "possibleMatch": "Posible coincidencia",
    "recommendationEvidenceTitle": "Tus respuestas que contribuyeron a este resultado:",
    "noRecommendationEvidence": "Ninguna respuesta específica contribuyó directamente a esta recomendación.",
    "quizAnalytics": "Estadísticas del cuestionario",
    "scanToLearnMore": "Escanea para saber más",
    "qrCaption": "Escanea el código QR con la cámara de tu teléfono o abre el enlace de abajo.",
    "qrAlt": "Código QR que enlaza a {url}",
    "relatedTitle": "Cursos y especializaciones relacionados",
    "relatedIntro": "Otras áreas de estudio que combinan bien con esta especialidad.",
    "compareTitle": "Compara especialidades lado a lado",
    "compareIntro": "Elige dos especialidades cualesquiera para comparar sus salidas profesionales y áreas de enfoque.",
    "compareMajorOne": "Especialidad uno",
    "compareMajorTwo": "Especialidad dos",
    "compareSame": "Elige dos especialidades diferentes para comparar.",
    "compareFeature": "Característica",
    "compareTag": "Etiqueta de perfil",
    "compareCareers": "Trayectorias profesionales",
    "compareWhy": "Por qué encaja",
    "compareFocus": "Enfoque principal",
    "compareRelated": "Cursos relacionados",
    "noneListed": "Ninguno",
    "analyticsLine": "El {percent}% de los estudiantes también obtuvo: {major}",
    "loading": "Cargando...",
    "unavailable": "No disponible",
    "serverError": "No se pudo conectar con el servidor. Inténtalo de nuevo más tarde.",
    "languageLabel": "Idioma",
    "fontSmaller": "Texto más pequeño",
    "fontLarger": "Texto más grande"
  },
  "fr": {
    "heroTitle": "Découvrez votre parcours technologique idéal",
    "heroDescription": "Répondez à un court questionnaire pour découvrir quelle spécialité en TIC correspond le mieux à vos intérêts, vos points forts et vos préférences de travail.",
    "quickAndSimple": "Seulement 2 à 3 minutes",
    "quickAndSimpleDesc": "Rapide, ciblé et simple à compléter.",
    "personalised": "Recommandation personnalisée",
    "personalisedDesc": "Basée sur vos préférences de travail et d’apprentissage.",
    "eyebrow": "Prototype du Sprint 1 du projet TIC",
    "pathwayMatch": "Correspondance de parcours",
    "pathwayMatchText": "Informatique, logiciels, cybersécurité ou science des données",
    "resultSummary": "Résumé du résultat",
    "resultSummaryText": "Recommandation de spécialité avec détail du score",
    "startQuiz": "Commencer le quiz",
    "resumeQuiz": "Reprendre le quiz",
    "accessibilityMode": "Mode d’accessibilité",
    "navQuiz": "Quiz",
    "questionnaire": "Questionnaire",
    "quizTitle": "Trouvez la spécialité en TIC qui vous correspond le mieux",
    "questionOf": "Question",
    "of": "sur",
    "answered": "Répondues",
    "skippedCount": "Passées",
    "next": "Suivant",
    "skip": "Passer",
    "restart": "Redémarrer le quiz",
    "previous": "Précédent",
    "seeResult": "Voir le résultat",
    "skippedMessage": "Vous avez passé cette question.",
    "selectAnswerMessage": "Veuillez sélectionner une option avant de soumettre le quiz.",
    "unansweredMessage": "Vous avez ignoré les questions suivantes :",
    "answerBeforeSubmit": "Veuillez y répondre avant de soumettre le quiz.",
    "recommendation": "Recommandation",
    "yourResult": "Votre résultat",
    "recommendedMajor": "Spécialité recommandée",
    "matchLevel": "Niveau de correspondance",
    "whyResult": "Pourquoi ce résultat ?",
    "alternativeMatch": "Correspondance alternative",
    "alternativeMatchText": "Correspondance alternative",
    "whatThisMeans": "Ce que cela signifie",
    "yourProfile": "Votre profil",
    "scoreBreakdown": "Détail des scores",
    "exploreMajor": "Explorer cette spécialité",
    "restartQuiz": "Recommencer le quiz",
    "strongMatch": "Forte correspondance",
    "goodMatch": "Bonne correspondance",
    "possibleMatch": "Correspondance possible",
    "recommendationEvidenceTitle": "Vos réponses qui ont contribué à ce résultat :",
    "noRecommendationEvidence": "Aucune réponse spécifique n’a directement contribué à cette recommandation.",
    "quizAnalytics": "Statistiques du quiz",
    "scanToLearnMore": "Scannez pour en savoir plus",
    "qrCaption": "Scannez le code QR avec l’appareil photo de votre téléphone ou ouvrez le lien ci-dessous.",
    "qrAlt": "Code QR menant à {url}",
    "relatedTitle": "Cours et mineures connexes",
    "relatedIntro": "D’autres domaines d’étude qui se marient bien avec cette majeure.",
    "compareTitle": "Comparer les majeures côte à côte",
    "compareIntro": "Choisissez deux majeures pour comparer leurs débouchés et leurs domaines d’intérêt.",
    "compareMajorOne": "Majeure un",
    "compareMajorTwo": "Majeure deux",
    "compareSame": "Veuillez choisir deux majeures différentes à comparer.",
    "compareFeature": "Critère",
    "compareTag": "Étiquette de profil",
    "compareCareers": "Parcours professionnels",
    "compareWhy": "Pourquoi cela convient",
    "compareFocus": "Domaine principal",
    "compareRelated": "Cours connexes",
    "noneListed": "Aucun",
    "analyticsLine": "{percent} % des étudiants ont aussi obtenu : {major}",
    "loading": "Chargement...",
    "unavailable": "Indisponible",
    "serverError": "Impossible de se connecter au serveur. Veuillez réessayer plus tard.",
    "languageLabel": "Langue",
    "fontSmaller": "Texte plus petit",
    "fontLarger": "Texte plus grand"
  }
};

// Translations of quiz and result text, loaded from the database per language:
// contentTranslations[lang] = { "English text": "translated text" }
const contentTranslations = {};

async function loadContentTranslations(lang) {
  if (lang === 'en' || contentTranslations[lang]) return;
  try {
    const res = await fetch(`./api/translations.php?lang=${encodeURIComponent(lang)}`, { cache: 'no-store' });
    if (res.ok) contentTranslations[lang] = await res.json();
  } catch (e) { /* offline or API error: text stays in English */ }
}

function getLanguage() {
  let lang = 'en';
  try { lang = localStorage.getItem('selectedLanguage') || 'en'; } catch (e) {}
  return languageConfig[lang] ? lang : 'en';
}

function setLanguage(lang) {
  try { localStorage.setItem('selectedLanguage', lang); } catch (e) {}
}

/** Interface string for the current language (falls back to English). */
function t(key, vars) {
  const lang = getLanguage();
  let text = (uiStrings[lang] && uiStrings[lang][key]) ?? uiStrings.en[key] ?? key;
  if (vars) {
    Object.entries(vars).forEach(([name, value]) => {
      text = text.replaceAll(`{${name}}`, value);
    });
  }
  return text;
}

/** Translate database content (question, answer, major text); unknown text is returned unchanged. */
function tc(text) {
  const lang = getLanguage();
  return (contentTranslations[lang] && contentTranslations[lang][text]) || text;
}
