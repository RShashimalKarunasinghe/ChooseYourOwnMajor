const languageConfig = {
  en: {
    name: "English",
    nativeName: "English"
  },

  zh: {
    name: "Chinese",
    nativeName: "中文"
  },

  es: {
    name: "Spanish",
    nativeName: "Español"
  },

  fr: {
    name: "French",
    nativeName: "Français"
  }
};

const defaultEnabledLanguages = ["en", "zh", "es", "fr"];

function getEnabledLanguages() {
  const saved = localStorage.getItem("enabledLanguages");

  if (!saved) {
    return [...defaultEnabledLanguages];
  }

  try {
    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed) || parsed.length === 0) {
      return [...defaultEnabledLanguages];
    }

    // English must always be available
    if (!parsed.includes("en")) {
      parsed.unshift("en");
    }

    return parsed.filter(
      (lang) => languageConfig[lang]
    );

  } catch (error) {
    return [...defaultEnabledLanguages];
  }
}

function saveEnabledLanguages(languages) {
  localStorage.setItem(
    "enabledLanguages",
    JSON.stringify(languages)
  );
}

function saveSelectedLanguage(lang) {
  localStorage.setItem("selectedLanguage", lang);
}

const questionTranslations = {
  en: [
    {
      text: "What kind of activity do you enjoy the most?",
      options: [
        {
          text: "Solving complex technical problems",
          subtext: "You enjoy logic, analysis, and deep problem-solving."
        },
        {
          text: "Building applications or websites",
          subtext: "You like creating practical digital solutions."
        },
        {
          text: "Protecting systems and data",
          subtext: "You care about digital safety and security."
        },
        {
          text: "Monitoring systems and detecting risks",
          subtext: "You like observing, checking, and preventing issues."
        }
      ],
      feedback: [
        "You seem to enjoy analytical and problem-solving work.",
        "You seem to enjoy creative and development-focused tasks.",
        "You seem interested in security and risk prevention.",
        "You seem to have strong risk-awareness and attention to detail."
      ]
    },
    {
      text: "Which type of project sounds most interesting to you?",
      options: [
        {
          text: "Designing smart algorithms",
          subtext: "You enjoy abstract thinking and technical design."
        },
        {
          text: "Creating mobile or web applications",
          subtext: "You like making useful systems for people."
        },
        {
          text: "Investigating security incidents",
          subtext: "You want to solve digital threats and attacks."
        },
        {
          text: "Finding patterns in data",
          subtext: "You enjoy analysis and discovering insights."
        }
      ],
      feedback: [
        "You seem drawn to theoretical and computational thinking.",
        "You seem motivated by creating practical software products.",
        "You seem interested in protecting systems from cyber threats.",
        "You seem interested in data-driven thinking and insights."
      ]
    },
    {
      text: "Which strength describes you best?",
      options: [
        {
          text: "Logical reasoning",
          subtext: "You like working through problems step by step."
        },
        {
          text: "Creativity in building solutions",
          subtext: "You enjoy turning ideas into useful systems."
        },
        {
          text: "Risk awareness and attention to detail",
          subtext: "You notice issues others may miss."
        },
        {
          text: "Interpreting numbers and trends",
          subtext: "You like understanding what data means."
        }
      ],
      feedback: [
        "You appear to be a strong logical thinker.",
        "You seem comfortable with practical and creative development.",
        "You seem detail-oriented and careful with risks.",
        "You seem comfortable interpreting information and patterns."
      ]
    },
    {
      text: "Which topic would you most like to study?",
      options: [
        {
          text: "Algorithms and computational thinking",
          subtext: "Learn how systems think and solve problems."
        },
        {
          text: "Software design and application development",
          subtext: "Build systems that people actually use."
        },
        {
          text: "Network security and ethical hacking",
          subtext: "Protect digital environments and user data."
        },
        {
          text: "Data analysis and visualisation",
          subtext: "Use data to support decisions and insights."
        }
      ],
      feedback: [
        "You seem interested in the core theory behind computing.",
        "You seem interested in designing and building software products.",
        "You seem strongly interested in cyber defence and protection.",
        "You seem interested in understanding and explaining data."
      ]
    },
    {
      text: "Which future career sounds most appealing?",
      options: [
        {
          text: "Computer scientist or systems researcher",
          subtext: "Work on deep technical problem-solving."
        },
        {
          text: "Software developer or app engineer",
          subtext: "Create digital products and services."
        },
        {
          text: "Cyber security analyst or consultant",
          subtext: "Protect systems and manage digital risk."
        },
        {
          text: "Data analyst or business intelligence specialist",
          subtext: "Turn information into insight and action."
        }
      ],
      feedback: [
        "You may enjoy technically demanding and analytical roles.",
        "You may enjoy building real-world digital solutions.",
        "You may enjoy defending organisations from cyber threats.",
        "You may enjoy extracting meaning from data and trends."
      ]
    }
  ],

  zh: [
    {
      text: "你最喜欢哪种活动？",
      options: [
        {
          text: "解决复杂的技术问题",
          subtext: "你喜欢逻辑、分析和深入解决问题。"
        },
        {
          text: "开发应用程序或网站",
          subtext: "你喜欢创建实用的数字解决方案。"
        },
        {
          text: "保护系统和数据",
          subtext: "你重视数字安全和数据保护。"
        },
        {
          text: "监控系统并发现风险",
          subtext: "你喜欢观察、检查和预防问题。"
        }
      ],
      feedback: [
        "你似乎喜欢分析和解决问题。",
        "你似乎喜欢具有创造性和开发性质的任务。",
        "你似乎对安全和风险预防感兴趣。",
        "你似乎具有较强的风险意识和注重细节的特点。"
      ]
    },
    {
      text: "哪种类型的项目听起来最有趣？",
      options: [
        {
          text: "设计智能算法",
          subtext: "你喜欢抽象思考和技术设计。"
        },
        {
          text: "创建移动应用或网页应用",
          subtext: "你喜欢为人们制作实用的系统。"
        },
        {
          text: "调查网络安全事件",
          subtext: "你希望解决数字威胁和网络攻击。"
        },
        {
          text: "寻找数据中的规律",
          subtext: "你喜欢分析数据并发现其中的洞察。"
        }
      ],
      feedback: [
        "你似乎喜欢理论和计算思维。",
        "你似乎喜欢创建实用的软件产品。",
        "你似乎对保护系统免受网络威胁感兴趣。",
        "你似乎对数据驱动的思维和洞察感兴趣。"
      ]
    },
    {
      text: "以下哪项最能描述你的优势？",
      options: [
        {
          text: "逻辑推理",
          subtext: "你喜欢一步一步地解决问题。"
        },
        {
          text: "创造性地构建解决方案",
          subtext: "你喜欢将想法转化为实用的系统。"
        },
        {
          text: "风险意识和注重细节",
          subtext: "你能发现其他人可能忽略的问题。"
        },
        {
          text: "理解数字和趋势",
          subtext: "你喜欢理解数据所表达的意义。"
        }
      ],
      feedback: [
        "你似乎具有很强的逻辑思维能力。",
        "你似乎擅长实用且具有创造性的开发工作。",
        "你似乎注重细节，并且具有较强的风险意识。",
        "你似乎擅长理解信息和发现规律。"
      ]
    },
    {
      text: "你最想学习以下哪个主题？",
      options: [
        {
          text: "算法和计算思维",
          subtext: "学习系统如何思考和解决问题。"
        },
        {
          text: "软件设计和应用开发",
          subtext: "构建人们真正使用的系统。"
        },
        {
          text: "网络安全和道德黑客技术",
          subtext: "保护数字环境和用户数据。"
        },
        {
          text: "数据分析和可视化",
          subtext: "利用数据支持决策并发现洞察。"
        }
      ],
      feedback: [
        "你似乎对计算机领域的核心理论感兴趣。",
        "你似乎对设计和构建软件产品感兴趣。",
        "你似乎对网络防御和保护非常感兴趣。",
        "你似乎对理解和解释数据感兴趣。"
      ]
    },
    {
      text: "以下哪个未来职业最吸引你？",
      options: [
        {
          text: "计算机科学家或系统研究员",
          subtext: "从事深入的技术问题解决工作。"
        },
        {
          text: "软件开发人员或应用工程师",
          subtext: "创建数字产品和服务。"
        },
        {
          text: "网络安全分析师或顾问",
          subtext: "保护系统并管理数字风险。"
        },
        {
          text: "数据分析师或商业智能专家",
          subtext: "将信息转化为洞察和行动。"
        }
      ],
      feedback: [
        "你可能喜欢具有技术挑战性和分析性的职业。",
        "你可能喜欢构建现实世界中的数字解决方案。",
        "你可能喜欢保护组织免受网络威胁。",
        "你可能喜欢从数据和趋势中发现有意义的信息。"
      ]
    }
  ],

  es: [
    {
      text: "¿Qué tipo de actividad disfrutas más?",
      options: [
        {
          text: "Resolver problemas técnicos complejos",
          subtext: "Te gustan la lógica, el análisis y la resolución profunda de problemas."
        },
        {
          text: "Crear aplicaciones o sitios web",
          subtext: "Te gusta crear soluciones digitales prácticas."
        },
        {
          text: "Proteger sistemas y datos",
          subtext: "Te preocupan la seguridad digital y la protección de datos."
        },
        {
          text: "Supervisar sistemas y detectar riesgos",
          subtext: "Te gusta observar, comprobar y prevenir problemas."
        }
      ],
      feedback: [
        "Parece que disfrutas del trabajo analítico y de la resolución de problemas.",
        "Parece que disfrutas de las tareas creativas y orientadas al desarrollo.",
        "Parece que tienes interés en la seguridad y la prevención de riesgos.",
        "Parece que tienes una gran conciencia de los riesgos y atención a los detalles."
      ]
    },
    {
      text: "¿Qué tipo de proyecto te parece más interesante?",
      options: [
        {
          text: "Diseñar algoritmos inteligentes",
          subtext: "Te gustan el pensamiento abstracto y el diseño técnico."
        },
        {
          text: "Crear aplicaciones móviles o web",
          subtext: "Te gusta crear sistemas útiles para las personas."
        },
        {
          text: "Investigar incidentes de seguridad",
          subtext: "Quieres resolver amenazas y ataques digitales."
        },
        {
          text: "Encontrar patrones en los datos",
          subtext: "Disfrutas del análisis y de descubrir información útil."
        }
      ],
      feedback: [
        "Parece que te atraen el pensamiento teórico y computacional.",
        "Parece que te motiva crear productos de software prácticos.",
        "Parece que tienes interés en proteger los sistemas frente a amenazas digitales.",
        "Parece que tienes interés en el análisis basado en datos y en descubrir información útil."
      ]
    },
    {
      text: "¿Qué fortaleza te describe mejor?",
      options: [
        {
          text: "Razonamiento lógico",
          subtext: "Te gusta resolver problemas paso a paso."
        },
        {
          text: "Creatividad para crear soluciones",
          subtext: "Te gusta convertir ideas en sistemas útiles."
        },
        {
          text: "Conciencia de riesgos y atención al detalle",
          subtext: "Notas problemas que otros pueden pasar por alto."
        },
        {
          text: "Interpretación de números y tendencias",
          subtext: "Te gusta comprender lo que significan los datos."
        }
      ],
      feedback: [
        "Parece que tienes una gran capacidad de razonamiento lógico.",
        "Parece que te sientes cómodo con el desarrollo práctico y creativo.",
        "Parece que prestas atención a los detalles y eres cuidadoso con los riesgos.",
        "Parece que te sientes cómodo interpretando información y patrones."
      ]
    },
    {
      text: "¿Qué tema te gustaría estudiar más?",
      options: [
        {
          text: "Algoritmos y pensamiento computacional",
          subtext: "Aprende cómo los sistemas piensan y resuelven problemas."
        },
        {
          text: "Diseño de software y desarrollo de aplicaciones",
          subtext: "Construye sistemas que las personas realmente utilizan."
        },
        {
          text: "Seguridad de redes y hacking ético",
          subtext: "Protege entornos digitales y datos de usuarios."
        },
        {
          text: "Análisis y visualización de datos",
          subtext: "Utiliza datos para apoyar decisiones y obtener información."
        }
      ],
      feedback: [
        "Parece que tienes interés en los fundamentos teóricos de la informática.",
        "Parece que tienes interés en diseñar y desarrollar productos de software.",
        "Parece que tienes un gran interés en la defensa y protección digital.",
        "Parece que tienes interés en comprender y explicar los datos."
      ]
    },
    {
      text: "¿Qué carrera profesional te resulta más atractiva?",
      options: [
        {
          text: "Científico informático o investigador de sistemas",
          subtext: "Trabaja en la resolución de problemas técnicos profundos."
        },
        {
          text: "Desarrollador de software o ingeniero de aplicaciones",
          subtext: "Crea productos y servicios digitales."
        },
        {
          text: "Analista o consultor de ciberseguridad",
          subtext: "Protege sistemas y gestiona riesgos digitales."
        },
        {
          text: "Analista de datos o especialista en inteligencia empresarial",
          subtext: "Convierte la información en conocimiento y acción."
        }
      ],
      feedback: [
        "Podrías disfrutar de roles técnicamente exigentes y analíticos.",
        "Podrías disfrutar creando soluciones digitales para problemas del mundo real.",
        "Podrías disfrutar protegiendo a las organizaciones frente a amenazas digitales.",
        "Podrías disfrutar extrayendo información útil de los datos y las tendencias."
      ]
    }
  ],

  fr: [
    {
      text: "Quel type d’activité appréciez-vous le plus ?",
      options: [
        {
          text: "Résoudre des problèmes techniques complexes",
          subtext: "Vous aimez la logique, l’analyse et la résolution approfondie de problèmes."
        },
        {
          text: "Créer des applications ou des sites web",
          subtext: "Vous aimez créer des solutions numériques pratiques."
        },
        {
          text: "Protéger les systèmes et les données",
          subtext: "Vous accordez de l’importance à la sécurité numérique et aux données."
        },
        {
          text: "Surveiller les systèmes et détecter les risques",
          subtext: "Vous aimez observer, vérifier et prévenir les problèmes."
        }
      ],
      feedback: [
        "Vous semblez apprécier le travail analytique et la résolution de problèmes.",
        "Vous semblez apprécier les tâches créatives et axées sur le développement.",
        "Vous semblez vous intéresser à la sécurité et à la prévention des risques.",
        "Vous semblez avoir une forte sensibilisation aux risques et une grande attention aux détails."
      ]
    },
    {
      text: "Quel type de projet vous semble le plus intéressant ?",
      options: [
        {
          text: "Concevoir des algorithmes intelligents",
          subtext: "Vous aimez la pensée abstraite et la conception technique."
        },
        {
          text: "Créer des applications mobiles ou web",
          subtext: "Vous aimez créer des systèmes utiles pour les utilisateurs."
        },
        {
          text: "Enquêter sur des incidents de sécurité",
          subtext: "Vous souhaitez résoudre les menaces et attaques numériques."
        },
        {
          text: "Trouver des tendances dans les données",
          subtext: "Vous aimez analyser les données et découvrir des informations."
        }
      ],
      feedback: [
        "Vous semblez attiré par la pensée théorique et computationnelle.",
        "Vous semblez motivé par la création de produits logiciels pratiques.",
        "Vous semblez vous intéresser à la protection des systèmes contre les cybermenaces.",
        "Vous semblez vous intéresser à l’analyse basée sur les données et aux découvertes d’informations."
      ]
    },
    {
      text: "Quelle force vous décrit le mieux ?",
      options: [
        {
          text: "Raisonnement logique",
          subtext: "Vous aimez résoudre les problèmes étape par étape."
        },
        {
          text: "Créativité dans la création de solutions",
          subtext: "Vous aimez transformer les idées en systèmes utiles."
        },
        {
          text: "Sens des risques et attention aux détails",
          subtext: "Vous remarquez les problèmes que d’autres peuvent manquer."
        },
        {
          text: "Interprétation des chiffres et des tendances",
          subtext: "Vous aimez comprendre ce que signifient les données."
        }
      ],
      feedback: [
        "Vous semblez avoir de solides capacités de raisonnement logique.",
        "Vous semblez à l’aise avec le développement pratique et créatif.",
        "Vous semblez attentif aux détails et prudent face aux risques.",
        "Vous semblez à l’aise avec l’interprétation des informations et des tendances."
      ]
    },
    {
      text: "Quel sujet aimeriez-vous le plus étudier ?",
      options: [
        {
          text: "Algorithmes et pensée computationnelle",
          subtext: "Apprenez comment les systèmes réfléchissent et résolvent les problèmes."
        },
        {
          text: "Conception logicielle et développement d’applications",
          subtext: "Construisez des systèmes réellement utilisés par les personnes."
        },
        {
          text: "Sécurité des réseaux et hacking éthique",
          subtext: "Protégez les environnements numériques et les données des utilisateurs."
        },
        {
          text: "Analyse et visualisation des données",
          subtext: "Utilisez les données pour soutenir les décisions et obtenir des informations."
        }
      ],
      feedback: [
        "Vous semblez vous intéresser aux fondements théoriques de l’informatique.",
        "Vous semblez vous intéresser à la conception et au développement de produits logiciels.",
        "Vous semblez avoir un fort intérêt pour la défense et la protection numériques.",
        "Vous semblez vous intéresser à la compréhension et à l’interprétation des données."
      ]
    },
    {
      text: "Quelle future carrière vous semble la plus intéressante ?",
      options: [
        {
          text: "Informaticien ou chercheur en systèmes",
          subtext: "Travaillez sur des problèmes techniques complexes."
        },
        {
          text: "Développeur logiciel ou ingénieur d’applications",
          subtext: "Créez des produits et services numériques."
        },
        {
          text: "Analyste ou consultant en cybersécurité",
          subtext: "Protégez les systèmes et gérez les risques numériques."
        },
        {
          text: "Analyste de données ou spécialiste en intelligence d’affaires",
          subtext: "Transformez les informations en connaissances et en actions."
        }
      ],
      feedback: [
        "Vous pourriez apprécier des rôles techniquement exigeants et analytiques.",
        "Vous pourriez apprécier la création de solutions numériques pour des problèmes réels.",
        "Vous pourriez apprécier la protection des organisations contre les cybermenaces.",
        "Vous pourriez apprécier l’extraction d’informations utiles à partir des données et des tendances."
      ]
    }
  ]
};

// ── Major text per language ─────────────────────────────────────────────────
// English title / resultReason / careers / exploreText / personalityTags come
// from the database (so admin edits show straight away). Other languages use
// the tables below, keyed by major code; a major added in admin has no entry
// here and falls back to its English database text.
// nextSteps and relatedMajors are not stored in the database, so English
// is listed here too.
const resultTranslations = {
  en: {
    nextSteps: {
      cs:    ["Explore algorithms and data structures online (e.g. CS50, Coursera)", "Practice coding challenges on LeetCode or HackerRank", "Look into Bachelor of Computer Science programs at your preferred uni", "Build a small project — a CLI tool or basic game"],
      se:    ["Start with HTML, CSS, JavaScript if you haven't already", "Follow a full-stack tutorial (React + Node, or Laravel)", "Build and deploy a real web app to show employers", "Explore open-source projects on GitHub to contribute"],
      cyber: ["Study CompTIA Security+ as an entry-level certification", "Try free labs on TryHackMe or Hack The Box", "Learn networking basics — TCP/IP, firewalls, VPNs", "Follow cyber security news (Krebs on Security, SANS)"],
      ds:    ["Learn Python and the pandas / matplotlib libraries", "Take a statistics or probability course (Khan Academy, edX)", "Work through a Kaggle beginner dataset challenge", "Explore Power BI or Tableau for data visualisation"]
    },
    relatedMajors: {
      cs:    ["Mathematics", "Artificial Intelligence", "Computer Engineering", "Information Systems"],
      se:    ["Web Development", "Mobile App Development", "Cloud Computing", "DevOps Engineering"],
      cyber: ["Network Engineering", "Digital Forensics", "Information Security Management", "Criminology (Computing)"],
      ds:    ["Data Analytics", "Business Intelligence", "Artificial Intelligence", "Statistics"]
    }
  },

  zh: {
    title: {
      cs: "计算机科学",
      se: "软件开发",
      cyber: "网络安全",
      ds: "数据科学"
    },
    resultReason: {
      cs: "你的回答显示出你对逻辑推理、复杂技术问题解决和计算思维有浓厚兴趣。",
      se: "你的回答显示出你对构建实用系统、创建应用程序和开发数字解决方案有浓厚兴趣。",
      cyber: "你的回答显示出你对保护系统、管理风险以及发现数字威胁和漏洞有浓厚兴趣。",
      ds: "你的回答显示出你对分析数据、发现规律以及将信息转化为有用洞察有浓厚兴趣。"
    },
    careers: {
      cs: "你可能会喜欢计算机科学家、系统分析师、研究开发人员或算法工程师等职业。",
      se: "你可能会喜欢软件开发人员、应用工程师、网页开发人员或软件工程师等职业。",
      cyber: "你可能会喜欢网络安全分析师、安全顾问、渗透测试人员或安全运营专家等职业。",
      ds: "你可能会喜欢数据分析师、商业智能专家、数据科学家或数据分析顾问等职业。"
    },
    exploreText: {
      cs: "计算机科学专注于算法、编程概念、系统思维以及深入解决技术问题。",
      se: "软件开发专注于设计、构建、测试和改进应用程序、网站和数字系统。",
      cyber: "网络安全专注于保护系统、网络和数据免受网络威胁，并提高数字安全性。",
      ds: "数据科学专注于分析数据、发现趋势、可视化结果以及支持数据驱动的决策。"
    },
    personalityTags: {
      cs: "问题解决者",
      se: "创意构建者",
      cyber: "风险保护者",
      ds: "洞察探索者"
    },
    nextSteps: {
      cs:    ["在线学习算法和数据结构（例如 CS50、Coursera）", "在 LeetCode 或 HackerRank 上练习编程题", "了解你心仪大学的计算机科学学士课程", "做一个小项目——例如命令行工具或简单游戏"],
      se:    ["如果还没学过，先从 HTML、CSS 和 JavaScript 开始", "跟着一个全栈教程学习（React + Node 或 Laravel）", "构建并部署一个真实的网页应用，向雇主展示", "在 GitHub 上寻找开源项目并参与贡献"],
      cyber: ["学习入门级认证 CompTIA Security+", "在 TryHackMe 或 Hack The Box 上尝试免费实验", "学习网络基础——TCP/IP、防火墙、VPN", "关注网络安全新闻（Krebs on Security、SANS）"],
      ds:    ["学习 Python 以及 pandas / matplotlib 库", "学习统计或概率课程（Khan Academy、edX）", "完成一个 Kaggle 入门数据集挑战", "探索使用 Power BI 或 Tableau 进行数据可视化"]
    },
    relatedMajors: {
      cs:    ["数学", "人工智能", "计算机工程", "信息系统"],
      se:    ["网页开发", "移动应用开发", "云计算", "DevOps 工程"],
      cyber: ["网络工程", "数字取证", "信息安全管理", "犯罪学（计算方向）"],
      ds:    ["数据分析", "商业智能", "人工智能", "统计学"]
    }
  },

  es: {
    title: {
      cs: "Ciencias de la Computación",
      se: "Desarrollo de Software",
      cyber: "Ciberseguridad",
      ds: "Ciencia de Datos"
    },
    resultReason: {
      cs: "Tus respuestas muestran un gran interés por el razonamiento lógico, la resolución de problemas técnicos complejos y el pensamiento computacional.",
      se: "Tus respuestas muestran un gran interés por crear sistemas prácticos, desarrollar aplicaciones y construir soluciones digitales útiles.",
      cyber: "Tus respuestas muestran un gran interés por proteger sistemas, gestionar riesgos e identificar amenazas y vulnerabilidades digitales.",
      ds: "Tus respuestas muestran un gran interés por analizar datos, encontrar patrones y convertir información en conocimientos útiles."
    },
    careers: {
      cs: "Podrías disfrutar de roles como científico informático, analista de sistemas, desarrollador de investigación o ingeniero especializado en algoritmos.",
      se: "Podrías disfrutar de roles como desarrollador de software, ingeniero de aplicaciones, desarrollador web o ingeniero de software.",
      cyber: "Podrías disfrutar de roles como analista de ciberseguridad, consultor de seguridad, especialista en pruebas de penetración o seguridad informática.",
      ds: "Podrías disfrutar de roles como analista de datos, especialista en inteligencia empresarial, científico de datos o consultor de análisis."
    },
    exploreText: {
      cs: "Las Ciencias de la Computación se centran en algoritmos, conceptos de programación, pensamiento sistémico y resolución profunda de problemas técnicos.",
      se: "El Desarrollo de Software se centra en diseñar, crear, probar y mejorar aplicaciones, sitios web y sistemas digitales.",
      cyber: "La Ciberseguridad se centra en proteger sistemas, redes y datos frente a amenazas digitales y mejorar la seguridad.",
      ds: "La Ciencia de Datos se centra en analizar datos, encontrar tendencias, visualizar resultados y apoyar la toma de decisiones basada en datos."
    },
    personalityTags: {
      cs: "Solucionador de problemas",
      se: "Constructor creativo",
      cyber: "Protector de riesgos",
      ds: "Explorador de información"
    },
    nextSteps: {
      cs:    ["Explora algoritmos y estructuras de datos en línea (p. ej., CS50, Coursera)", "Practica retos de programación en LeetCode o HackerRank", "Infórmate sobre los grados en Ciencias de la Computación de tu universidad preferida", "Crea un proyecto pequeño: una herramienta de línea de comandos o un juego sencillo"],
      se:    ["Empieza con HTML, CSS y JavaScript si aún no lo has hecho", "Sigue un tutorial full-stack (React + Node o Laravel)", "Crea y publica una aplicación web real para mostrarla a empleadores", "Explora proyectos de código abierto en GitHub en los que contribuir"],
      cyber: ["Estudia la certificación de nivel inicial CompTIA Security+", "Prueba los laboratorios gratuitos de TryHackMe o Hack The Box", "Aprende los fundamentos de redes: TCP/IP, cortafuegos, VPN", "Sigue las noticias de ciberseguridad (Krebs on Security, SANS)"],
      ds:    ["Aprende Python y las librerías pandas / matplotlib", "Haz un curso de estadística o probabilidad (Khan Academy, edX)", "Completa un reto de datos para principiantes en Kaggle", "Explora Power BI o Tableau para la visualización de datos"]
    },
    relatedMajors: {
      cs:    ["Matemáticas", "Inteligencia Artificial", "Ingeniería Informática", "Sistemas de Información"],
      se:    ["Desarrollo Web", "Desarrollo de Aplicaciones Móviles", "Computación en la Nube", "Ingeniería DevOps"],
      cyber: ["Ingeniería de Redes", "Informática Forense", "Gestión de la Seguridad de la Información", "Criminología (Informática)"],
      ds:    ["Analítica de Datos", "Inteligencia Empresarial", "Inteligencia Artificial", "Estadística"]
    }
  },

  fr: {
    title: {
      cs: "Informatique",
      se: "Développement logiciel",
      cyber: "Cybersécurité",
      ds: "Science des données"
    },
    resultReason: {
      cs: "Vos réponses montrent un fort intérêt pour le raisonnement logique, la résolution de problèmes techniques complexes et la pensée informatique.",
      se: "Vos réponses montrent un fort intérêt pour la création de systèmes pratiques, le développement d’applications et les solutions numériques utiles.",
      cyber: "Vos réponses montrent un fort intérêt pour la protection des systèmes, la gestion des risques et l’identification des menaces et vulnérabilités numériques.",
      ds: "Vos réponses montrent un fort intérêt pour l’analyse des données, l’identification des tendances et la transformation des informations en connaissances utiles."
    },
    careers: {
      cs: "Vous pourriez apprécier des métiers tels qu’informaticien, analyste systèmes, développeur de recherche ou ingénieur spécialisé en algorithmes.",
      se: "Vous pourriez apprécier des métiers tels que développeur logiciel, ingénieur d’applications, développeur web ou ingénieur logiciel.",
      cyber: "Vous pourriez apprécier des métiers tels qu’analyste en cybersécurité, consultant en sécurité, testeur d’intrusion ou spécialiste des opérations de sécurité.",
      ds: "Vous pourriez apprécier des métiers tels qu’analyste de données, spécialiste en intelligence d’affaires, data scientist ou consultant en analyse."
    },
    exploreText: {
      cs: "L'informatique se concentre sur les algorithmes, les concepts de programmation, la pensée systémique et la résolution approfondie de problèmes techniques.",
      se: "Le développement logiciel se concentre sur la conception, la création, les tests et l'amélioration des applications, sites web et systèmes numériques.",
      cyber: "La cybersécurité se concentre sur la protection des systèmes, réseaux et données contre les cybermenaces et sur l'amélioration de la sécurité numérique.",
      ds: "La science des données se concentre sur l'analyse des données, la recherche de tendances, la visualisation des résultats et la prise de décision basée sur les données."
    },
    personalityTags: {
      cs: "Résolveur de problèmes",
      se: "Créateur innovant",
      cyber: "Protecteur des risques",
      ds: "Explorateur de données"
    },
    nextSteps: {
      cs:    ["Découvrez les algorithmes et les structures de données en ligne (ex. CS50, Coursera)", "Entraînez-vous avec des défis de programmation sur LeetCode ou HackerRank", "Renseignez-vous sur les licences en informatique de l’université de votre choix", "Réalisez un petit projet : un outil en ligne de commande ou un jeu simple"],
      se:    ["Commencez par HTML, CSS et JavaScript si ce n’est pas déjà fait", "Suivez un tutoriel full-stack (React + Node ou Laravel)", "Créez et déployez une vraie application web à montrer aux employeurs", "Explorez des projets open source sur GitHub auxquels contribuer"],
      cyber: ["Préparez la certification d’entrée CompTIA Security+", "Essayez les labs gratuits de TryHackMe ou Hack The Box", "Apprenez les bases des réseaux : TCP/IP, pare-feu, VPN", "Suivez l’actualité de la cybersécurité (Krebs on Security, SANS)"],
      ds:    ["Apprenez Python et les bibliothèques pandas / matplotlib", "Suivez un cours de statistiques ou de probabilités (Khan Academy, edX)", "Relevez un défi Kaggle pour débutants", "Découvrez Power BI ou Tableau pour la visualisation des données"]
    },
    relatedMajors: {
      cs:    ["Mathématiques", "Intelligence artificielle", "Génie informatique", "Systèmes d’information"],
      se:    ["Développement web", "Développement d’applications mobiles", "Informatique en nuage", "Ingénierie DevOps"],
      cyber: ["Ingénierie réseau", "Criminalistique numérique", "Gestion de la sécurité de l’information", "Criminologie (informatique)"],
      ds:    ["Analyse de données", "Informatique décisionnelle", "Intelligence artificielle", "Statistiques"]
    }
  }
};

// ── Interface text ──────────────────────────────────────────────────────────
// Every label on the quiz page lives here. {name} placeholders are filled in by t().
// A key missing from a language falls back to English, then to the key itself.
const uiText = {
  en: {
    // Home page
    eyebrow: "ICT Project · Sprint 1 Prototype",
    heroTitle: "Discover Your Ideal Tech Path",
    heroDescription: "Take a short quiz to explore which ICT major may fit your interests, strengths, and working preferences best.",
    quickAndSimple: "Takes 2–3 minutes",
    quickAndSimpleDesc: "Quick, focused, and simple to complete.",
    personalised: "Personalised recommendation",
    personalisedDesc: "Based on your work and learning preferences.",
    pathwayMatch: "Pathway match",
    pathwayMatchText: "Computer Science, Software, Cyber Security, or Data Science",
    resultSummary: "Result summary",
    resultSummaryText: "Major recommendation with score breakdown",
    navQuiz: "Quiz",
    navAdmin: "Admin",
    startQuiz: "Start Quiz",
    adminLogin: "Admin Login",
    accessibilityMode: "Accessibility Mode",
    decreaseFont: "Decrease text size",
    increaseFont: "Increase text size",
    languageLabel: "Language",
    loading: "Loading quiz…",
    loadError: "Could not load quiz data. Make sure the PHP server and database are running.",

    // Resume banner
    resumeTitle: "Welcome back!",
    resumeText: "You have a quiz in progress.",
    continueQuiz: "Continue Quiz",
    startFresh: "Start Fresh",

    // Quiz
    questionnaire: "Questionnaire",
    quizTitle: "Find the ICT Major That Fits You Best",
    quizHint: "Skip any question and come back using the numbered dots below.",
    progressLabel: "Question {current} of {total}",
    quizStats: "Answered: {answered} | Skipped: {skipped}",
    jumpToQuestion: "Jump to question",
    goToQuestion: "Go to question {n}",
    questionShort: "Q{n}",
    dotAnswered: "Q{n} ✓",
    dotUnanswered: "Q{n} – unanswered",
    previous: "Previous",
    next: "Next",
    skipForNow: "Skip for now",
    seeResult: "See Result",
    submitAnyway: "Submit anyway ({count} skipped)",
    selectOrSkip: "Please select an option, or use Skip to come back later.",
    skippedWarning: "You skipped: {list}. You can go back using the numbered dots above, or submit with the answers you have.",
    answerAtLeastOne: "Please answer at least one question before seeing your result.",

    // Result page
    recommendation: "Recommendation",
    yourResult: "Your Result",
    recommendedMajor: "Recommended Major",
    matchLevel: "Match Level",
    strongMatch: "Strong Match",
    goodMatch: "Good Match",
    possibleMatch: "Possible Match",
    whyResult: "Why this result?",
    alternativeMatch: "Alternative Match",
    alternativePercent: "Alternative match: {percent}%",
    answersTitle: "Answers that led to this result",
    answerBadge: "+{score} {major}",
    whatThisMeans: "What this means",
    relatedTitle: "Related Majors & Disciplines",
    nextStepsTitle: "Suggested Next Steps",
    adviceFallback: "Talk to a course advisor about this major.",
    yourProfile: "Your Profile",
    scoreBreakdown: "Score Breakdown",
    downloadTitle: "Download Your Summary",
    downloadDesc: "Get a plain-text copy of your result to keep or share.",
    downloadBtn: "Download Summary",
    shareTitle: "Share This Major",
    qrCaption: "Scan to share this major",
    qrAlt: "QR code for the {major} major page",
    emailTitle: "Get Your Report by Email",
    emailDesc: "Enter your email address to receive a summary of your result.",
    emailPlaceholder: "your@email.com",
    sendReport: "Send Report",
    sending: "Sending…",
    sent: "✓ Sent!",
    invalidEmail: "Please enter a valid email address.",
    noResult: "No result found yet.",
    sendFailed: "Could not send email: ",
    exploreMajor: "Explore This Major",
    restartQuiz: "Restart Quiz",

    // Downloaded summary
    summaryHeading: "CHOOSE YOUR MAJOR — RESULT SUMMARY",
    summaryRecommended: "Recommended major",
    summaryAlternative: "Alternative match",
    summaryCompleted: "Completed",
    summaryMatch: "{percent}% match",
    summaryQuestion: "Q",
    summaryAnswer: "A",
    summaryFooter: "Generated by Choose Your Major — ICT Pathway Finder",

    // Admin page (login, top bar, sidebar)
    adminNavQuiz: "Quiz Page",
    adminNavDashboard: "Admin Dashboard",
    loginArea: "Administration Area",
    loginTitle: "Control your quiz content from one place.",
    loginIntro: "Manage questions, review submissions, and monitor recommendation trends using a cleaner red and black dashboard.",
    loginFeature1: "Edit quiz content",
    loginFeature1Desc: "Add, update, delete, or reset quiz questions.",
    loginFeature2: "Review records",
    loginFeature2Desc: "Check submitted results and export a CSV file.",
    loginFeature3: "Track analytics",
    loginFeature3Desc: "View recommendation patterns and match levels.",
    secureLogin: "Secure Login",
    adminAccess: "Admin Access",
    loginSubtitle: "Enter the demo admin credentials to continue.",
    username: "Username",
    password: "Password",
    demoLogin: "Demo Login",
    loginButton: "Login to Dashboard",
    loginError: "Incorrect username or password.",
    sidebarSubtitle: "Control Centre",
    sidebarStatus: "Logged in as administrator",
    tabQuestions: "Manage Questions",
    tabMajors: "Manage Majors",
    tabRecords: "View Records",
    tabAnalytics: "Analytics",
    tabLanguages: "Manage Languages",
    openQuizPage: "Open Quiz Page",
    logout: "Logout",

    // Admin dashboard
    dashLabel: "Dashboard",
    dashTitle: "Admin Control Centre",
    dashIntro: "Manage quiz questions, records, and analytics with consistent typography across both pages.",
    systemStatus: "System Status",
    statusActive: "Active",
    cardQuizLabel: "Quiz Management",
    cardQuizTitle: "Question Builder",
    cardQuizDesc: "Add, edit, delete, and reset questions.",
    cardRecordsLabel: "Submissions",
    cardRecordsTitle: "Records Table",
    cardRecordsDesc: "View attempts and export results.",
    cardInsightsLabel: "Insights",
    cardInsightsTitle: "Analytics View",
    cardInsightsDesc: "Track common recommendations.",
    pillEditor: "Editor",
    pillLiveList: "Live List",
    pillInsights: "Insights",
    pillSettings: "Settings",
    edit: "Edit",
    delete: "Delete",
    clear: "Clear",
    resetDefault: "Reset Default",
    unknownError: "Unknown error",
    questionEditor: "Question Editor",
    addQuestion: "Add Question",
    editQuestion: "Edit Question",
    questionTextLabel: "Question Text",
    questionTextPlaceholder: "Enter the question shown to students",
    optionWord: "Option",
    answerText: "Answer Text",
    subtextLabel: "Subtext",
    feedbackLabel: "Feedback",
    scoreHint: "Use 3 for the main matching major and 0 or 1 for weaker related majors.",
    saveQuestion: "Save Question",
    currentQuiz: "Current Quiz",
    questionsHeading: "Questions",
    noQuestions: "No questions available. Add a question using the form.",
    questionNumber: "Question {n}",
    answerOptions: "{count} answer options",
    confirmDeleteQuestion: "Delete this question?",
    questionDeleteFailed: "Failed to delete question: ",
    questionDeleteError: "Error deleting question: ",
    enterQuestionText: "Please enter the question text.",
    completeOptions: "Please complete all option text, subtext, and feedback fields.",
    questionSaved: "Question saved successfully.",
    questionSaveFailed: "Failed to save question: ",
    questionSaveError: "Error saving question: ",
    resetQuestionsInfo: "To reset questions to default, re-run the SQL file (chooseyourmajor.sql) in your database.",
    majorEditor: "Major Editor",
    addMajor: "Add New Major",
    editMajor: "Edit Major",
    majorCodeLabel: "Major Code (e.g., 'ai')",
    majorCodePlaceholder: "Short unique code",
    majorTitleLabel: "Title",
    majorTitlePlaceholder: "e.g., Artificial Intelligence",
    careersLabel: "Career Suggestions",
    careersPlaceholder: "List potential careers",
    reasonLabel: "Result Reason",
    reasonPlaceholder: "Why did they get this result?",
    exploreLabel: "Explore Text",
    explorePlaceholder: "What is this major about?",
    tagLabel: "Personality Tag",
    tagPlaceholder: "e.g., Future Innovator",
    saveMajor: "Save Major",
    currentOfferings: "Current Offerings",
    ictMajors: "ICT Majors",
    majorCode: "Code: {code}",
    majorTag: "Tag: {tag}",
    enterMajorCode: "Please enter a valid Major Code.",
    majorSaved: "Major saved to the database.",
    majorSaveFailed: "Could not save major: ",
    minTwoMajors: "You must have at least two majors for the quiz to work.",
    confirmDeleteMajor: "Delete the {title} major? This also removes its scores from all questions.",
    majorDeleteFailed: "Could not delete major: ",
    majorsLoadFailed: "Could not load majors from the database: ",
    recordsTitle: "Quiz Records",
    recordsDesc: "Review submitted quiz attempts and export records for reporting.",
    exportCsv: "Export CSV",
    clearRecords: "Clear Records",
    colDate: "Date",
    colRecommended: "Recommended Major",
    colMatch: "Match",
    colAlternative: "Alternative",
    colDetails: "Details",
    noRecords: "No quiz records yet.",
    view: "View",
    recordDetails: "Record Details",
    submittedOn: "Submitted: {date}",
    close: "Close",
    questionUnavailable: "Question unavailable",
    answerUnavailable: "Answer unavailable",
    skippedAnswer: "Skipped",
    confirmClearRecords: "Clear all quiz records?",
    noRecordsToExport: "There are no records to export.",
    totalRecordsLabel: "Total Records",
    mostCommonMajor: "Most Common Major",
    averageMatchLabel: "Average Match",
    quizStartsLabel: "Quiz Starts",
    completionsLabel: "Completions",
    notFinishedLabel: "Started but Not Finished",
    majorDistribution: "Major Distribution",
    recAnalytics: "Recommendation Analytics",
    recAnalyticsDesc: "See how often each major appears as the top recommendation.",
    none: "None",
    noAnalytics: "No analytics available yet. Complete the quiz to generate records.",
    langManagement: "Language Management",
    availableLanguages: "Available Languages",
    langDesc: "Choose which languages are available to quiz users.",
    saveLanguages: "Save Languages",
    enabled: "Enabled",
    disabled: "Disabled",
    languagesSaved: "Languages saved. The quiz page shows them after a refresh.",
    languagesReset: "All languages enabled again."
  },

  zh: {
    eyebrow: "ICT 项目 · Sprint 1 原型",
    heroTitle: "探索最适合你的科技发展方向",
    heroDescription: "完成一个简短的测验，探索最符合你的兴趣、优势和工作偏好的信息通信技术专业。",
    quickAndSimple: "只需 2–3 分钟",
    quickAndSimpleDesc: "快速、专注且简单易完成。",
    personalised: "个性化推荐",
    personalisedDesc: "根据你的工作方式和学习偏好进行推荐。",
    pathwayMatch: "专业方向匹配",
    pathwayMatchText: "计算机科学、软件工程、网络安全或数据科学",
    resultSummary: "结果摘要",
    resultSummaryText: "专业推荐及分数明细",
    navQuiz: "测验",
    navAdmin: "管理员",
    startQuiz: "开始测验",
    adminLogin: "管理员登录",
    accessibilityMode: "无障碍模式",
    decreaseFont: "缩小文字",
    increaseFont: "放大文字",
    languageLabel: "语言",
    loading: "正在加载测验…",
    loadError: "无法加载测验数据。请确认 PHP 服务器和数据库正在运行。",

    resumeTitle: "欢迎回来！",
    resumeText: "你有一个尚未完成的测验。",
    continueQuiz: "继续测验",
    startFresh: "重新开始",

    questionnaire: "问卷",
    quizTitle: "找到最适合你的信息通信技术专业",
    quizHint: "你可以跳过任何问题，之后通过下方的数字圆点返回作答。",
    progressLabel: "第 {current} 题，共 {total} 题",
    quizStats: "已回答：{answered} | 已跳过：{skipped}",
    jumpToQuestion: "跳转到问题",
    goToQuestion: "跳转到第 {n} 题",
    questionShort: "第 {n} 题",
    dotAnswered: "第 {n} 题 ✓",
    dotUnanswered: "第 {n} 题 – 未回答",
    previous: "上一题",
    next: "下一题",
    skipForNow: "暂时跳过",
    seeResult: "查看结果",
    submitAnyway: "仍然提交（跳过 {count} 题）",
    selectOrSkip: "请选择一个选项，或点击“暂时跳过”稍后再答。",
    skippedWarning: "你跳过了：{list}。你可以通过上方的数字圆点返回作答，或直接用已有答案提交。",
    answerAtLeastOne: "查看结果前，请至少回答一道题。",

    recommendation: "推荐",
    yourResult: "你的结果",
    recommendedMajor: "推荐专业",
    matchLevel: "匹配程度",
    strongMatch: "强匹配",
    goodMatch: "良好匹配",
    possibleMatch: "可能匹配",
    whyResult: "为什么是这个结果？",
    alternativeMatch: "其他匹配",
    alternativePercent: "其他匹配：{percent}%",
    answersTitle: "得出此结果的答案",
    answerBadge: "+{score} {major}",
    whatThisMeans: "这意味着什么",
    relatedTitle: "相关专业与学科",
    nextStepsTitle: "建议的下一步",
    adviceFallback: "请向课程顾问咨询该专业。",
    yourProfile: "你的个人画像",
    scoreBreakdown: "分数明细",
    downloadTitle: "下载你的结果摘要",
    downloadDesc: "获取一份纯文本格式的结果，方便保存或分享。",
    downloadBtn: "下载摘要",
    shareTitle: "分享此专业",
    qrCaption: "扫码分享此专业",
    qrAlt: "{major} 专业页面的二维码",
    emailTitle: "通过电子邮件获取报告",
    emailDesc: "输入你的电子邮件地址，接收你的结果摘要。",
    emailPlaceholder: "your@email.com",
    sendReport: "发送报告",
    sending: "发送中…",
    sent: "✓ 已发送！",
    invalidEmail: "请输入有效的电子邮件地址。",
    noResult: "还没有结果。",
    sendFailed: "无法发送电子邮件：",
    exploreMajor: "探索此专业",
    restartQuiz: "重新开始测验",

    summaryHeading: "选择你的专业 — 结果摘要",
    summaryRecommended: "推荐专业",
    summaryAlternative: "其他匹配",
    summaryCompleted: "完成时间",
    summaryMatch: "匹配度 {percent}%",
    summaryQuestion: "问",
    summaryAnswer: "答",
    summaryFooter: "由 Choose Your Major — ICT 专业方向测评生成",

    // Admin page (login, top bar, sidebar)
    adminNavQuiz: "测验页面",
    adminNavDashboard: "管理后台",
    loginArea: "管理区域",
    loginTitle: "在一个地方管理你的测验内容。",
    loginIntro: "通过简洁的红黑配色后台管理问题、查看提交记录并跟踪推荐趋势。",
    loginFeature1: "编辑测验内容",
    loginFeature1Desc: "添加、更新、删除或重置测验问题。",
    loginFeature2: "查看记录",
    loginFeature2Desc: "查看提交的结果并导出 CSV 文件。",
    loginFeature3: "跟踪数据分析",
    loginFeature3Desc: "查看推荐规律和匹配程度。",
    secureLogin: "安全登录",
    adminAccess: "管理员登录",
    loginSubtitle: "请输入演示管理员账号以继续。",
    username: "用户名",
    password: "密码",
    demoLogin: "演示账号",
    loginButton: "登录后台",
    loginError: "用户名或密码错误。",
    sidebarSubtitle: "控制中心",
    sidebarStatus: "已以管理员身份登录",
    tabQuestions: "管理问题",
    tabMajors: "管理专业",
    tabRecords: "查看记录",
    tabAnalytics: "数据分析",
    tabLanguages: "管理语言",
    openQuizPage: "打开测验页面",
    logout: "退出登录",

    // Admin dashboard
    dashLabel: "仪表板",
    dashTitle: "管理控制中心",
    dashIntro: "管理测验问题、记录和数据分析，两个页面使用统一的排版风格。",
    systemStatus: "系统状态",
    statusActive: "运行中",
    cardQuizLabel: "测验管理",
    cardQuizTitle: "问题编辑器",
    cardQuizDesc: "添加、编辑、删除和重置问题。",
    cardRecordsLabel: "提交记录",
    cardRecordsTitle: "记录表",
    cardRecordsDesc: "查看作答记录并导出结果。",
    cardInsightsLabel: "洞察",
    cardInsightsTitle: "数据分析",
    cardInsightsDesc: "跟踪常见的推荐结果。",
    pillEditor: "编辑器",
    pillLiveList: "实时列表",
    pillInsights: "洞察",
    pillSettings: "设置",
    edit: "编辑",
    delete: "删除",
    clear: "清空",
    resetDefault: "恢复默认",
    unknownError: "未知错误",
    questionEditor: "问题编辑器",
    addQuestion: "添加问题",
    editQuestion: "编辑问题",
    questionTextLabel: "问题内容",
    questionTextPlaceholder: "输入展示给学生的问题",
    optionWord: "选项",
    answerText: "答案内容",
    subtextLabel: "副标题",
    feedbackLabel: "反馈",
    scoreHint: "主要匹配的专业填 3，关联较弱的专业填 0 或 1。",
    saveQuestion: "保存问题",
    currentQuiz: "当前测验",
    questionsHeading: "问题列表",
    noQuestions: "暂无问题。请使用表单添加问题。",
    questionNumber: "第 {n} 题",
    answerOptions: "{count} 个选项",
    confirmDeleteQuestion: "确定删除这道题吗？",
    questionDeleteFailed: "删除问题失败：",
    questionDeleteError: "删除问题时出错：",
    enterQuestionText: "请输入问题内容。",
    completeOptions: "请填写所有选项的答案内容、副标题和反馈。",
    questionSaved: "问题已保存。",
    questionSaveFailed: "保存问题失败：",
    questionSaveError: "保存问题时出错：",
    resetQuestionsInfo: "如需恢复默认问题，请在数据库中重新运行 SQL 文件（chooseyourmajor.sql）。",
    majorEditor: "专业编辑器",
    addMajor: "添加新专业",
    editMajor: "编辑专业",
    majorCodeLabel: "专业代码（例如 'ai'）",
    majorCodePlaceholder: "简短且唯一的代码",
    majorTitleLabel: "名称",
    majorTitlePlaceholder: "例如：人工智能",
    careersLabel: "职业建议",
    careersPlaceholder: "列出可能的职业",
    reasonLabel: "结果原因",
    reasonPlaceholder: "为什么会得到这个结果？",
    exploreLabel: "专业介绍",
    explorePlaceholder: "这个专业是做什么的？",
    tagLabel: "个性标签",
    tagPlaceholder: "例如：未来创新者",
    saveMajor: "保存专业",
    currentOfferings: "当前开设",
    ictMajors: "ICT 专业",
    majorCode: "代码：{code}",
    majorTag: "标签：{tag}",
    enterMajorCode: "请输入有效的专业代码。",
    majorSaved: "专业已保存到数据库。",
    majorSaveFailed: "无法保存专业：",
    minTwoMajors: "测验至少需要两个专业才能运行。",
    confirmDeleteMajor: "确定删除“{title}”专业吗？这也会删除所有问题中该专业的分数。",
    majorDeleteFailed: "无法删除专业：",
    majorsLoadFailed: "无法从数据库加载专业：",
    recordsTitle: "测验记录",
    recordsDesc: "查看已提交的测验记录，并导出用于报告。",
    exportCsv: "导出 CSV",
    clearRecords: "清空记录",
    colDate: "日期",
    colRecommended: "推荐专业",
    colMatch: "匹配度",
    colAlternative: "其他匹配",
    colDetails: "详情",
    noRecords: "暂无测验记录。",
    view: "查看",
    recordDetails: "记录详情",
    submittedOn: "提交时间：{date}",
    close: "关闭",
    questionUnavailable: "问题已不存在",
    answerUnavailable: "答案不可用",
    skippedAnswer: "已跳过",
    confirmClearRecords: "确定清空所有测验记录吗？",
    noRecordsToExport: "没有可导出的记录。",
    totalRecordsLabel: "记录总数",
    mostCommonMajor: "最常见专业",
    averageMatchLabel: "平均匹配度",
    quizStartsLabel: "开始测验次数",
    completionsLabel: "完成次数",
    notFinishedLabel: "开始但未完成",
    majorDistribution: "专业分布",
    recAnalytics: "推荐数据分析",
    recAnalyticsDesc: "查看每个专业作为首选推荐出现的频率。",
    none: "无",
    noAnalytics: "暂无分析数据。完成测验后即可生成记录。",
    langManagement: "语言管理",
    availableLanguages: "可用语言",
    langDesc: "选择测验用户可以使用的语言。",
    saveLanguages: "保存语言设置",
    enabled: "已启用",
    disabled: "已停用",
    languagesSaved: "语言设置已保存。刷新测验页面后生效。",
    languagesReset: "已重新启用所有语言。"
  },

  es: {
    eyebrow: "Proyecto ICT · Prototipo del Sprint 1",
    heroTitle: "Descubre tu camino tecnológico ideal",
    heroDescription: "Realiza un breve cuestionario para descubrir qué especialidad de TIC se adapta mejor a tus intereses, fortalezas y preferencias de trabajo.",
    quickAndSimple: "Solo 2–3 minutos",
    quickAndSimpleDesc: "Rápido, sencillo y fácil de completar.",
    personalised: "Recomendación personalizada",
    personalisedDesc: "Basada en tus preferencias de trabajo y aprendizaje.",
    pathwayMatch: "Coincidencia de trayectoria",
    pathwayMatchText: "Ciencias de la Computación, Software, Ciberseguridad o Ciencia de Datos",
    resultSummary: "Resumen del resultado",
    resultSummaryText: "Recomendación de especialidad con desglose de puntuación",
    navQuiz: "Cuestionario",
    navAdmin: "Administrador",
    startQuiz: "Comenzar cuestionario",
    adminLogin: "Inicio de sesión de administrador",
    accessibilityMode: "Modo de accesibilidad",
    decreaseFont: "Reducir el tamaño del texto",
    increaseFont: "Aumentar el tamaño del texto",
    languageLabel: "Idioma",
    loading: "Cargando cuestionario…",
    loadError: "No se pudieron cargar los datos del cuestionario. Comprueba que el servidor PHP y la base de datos estén en funcionamiento.",

    resumeTitle: "¡Bienvenido de nuevo!",
    resumeText: "Tienes un cuestionario sin terminar.",
    continueQuiz: "Continuar cuestionario",
    startFresh: "Empezar de nuevo",

    questionnaire: "Cuestionario",
    quizTitle: "Encuentra la especialidad de TIC que mejor se adapta a ti",
    quizHint: "Puedes saltar cualquier pregunta y volver a ella con los puntos numerados de abajo.",
    progressLabel: "Pregunta {current} de {total}",
    quizStats: "Respondidas: {answered} | Saltadas: {skipped}",
    jumpToQuestion: "Ir a una pregunta",
    goToQuestion: "Ir a la pregunta {n}",
    questionShort: "P{n}",
    dotAnswered: "P{n} ✓",
    dotUnanswered: "P{n} – sin responder",
    previous: "Anterior",
    next: "Siguiente",
    skipForNow: "Saltar por ahora",
    seeResult: "Ver resultado",
    submitAnyway: "Enviar de todos modos ({count} saltadas)",
    selectOrSkip: "Selecciona una opción o usa «Saltar» para volver más tarde.",
    skippedWarning: "Has saltado: {list}. Puedes volver con los puntos numerados de arriba o enviar con las respuestas que tienes.",
    answerAtLeastOne: "Responde al menos una pregunta antes de ver tu resultado.",

    recommendation: "Recomendación",
    yourResult: "Tu resultado",
    recommendedMajor: "Especialidad recomendada",
    matchLevel: "Nivel de coincidencia",
    strongMatch: "Coincidencia fuerte",
    goodMatch: "Buena coincidencia",
    possibleMatch: "Coincidencia posible",
    whyResult: "¿Por qué este resultado?",
    alternativeMatch: "Coincidencia alternativa",
    alternativePercent: "Coincidencia alternativa: {percent}%",
    answersTitle: "Respuestas que llevaron a este resultado",
    answerBadge: "+{score} {major}",
    whatThisMeans: "Qué significa esto",
    relatedTitle: "Especialidades y disciplinas relacionadas",
    nextStepsTitle: "Próximos pasos sugeridos",
    adviceFallback: "Habla con un asesor académico sobre esta carrera.",
    yourProfile: "Tu perfil",
    scoreBreakdown: "Desglose de puntuación",
    downloadTitle: "Descarga tu resumen",
    downloadDesc: "Obtén una copia en texto de tu resultado para guardarla o compartirla.",
    downloadBtn: "Descargar resumen",
    shareTitle: "Comparte esta especialidad",
    qrCaption: "Escanea para compartir esta especialidad",
    qrAlt: "Código QR de la página de {major}",
    emailTitle: "Recibe tu informe por correo electrónico",
    emailDesc: "Introduce tu dirección de correo electrónico para recibir un resumen de tu resultado.",
    emailPlaceholder: "tu@correo.com",
    sendReport: "Enviar informe",
    sending: "Enviando…",
    sent: "✓ ¡Enviado!",
    invalidEmail: "Introduce una dirección de correo electrónico válida.",
    noResult: "Todavía no hay ningún resultado.",
    sendFailed: "No se pudo enviar el correo: ",
    exploreMajor: "Explorar esta especialidad",
    restartQuiz: "Reiniciar cuestionario",

    summaryHeading: "ELIGE TU ESPECIALIDAD — RESUMEN DEL RESULTADO",
    summaryRecommended: "Especialidad recomendada",
    summaryAlternative: "Coincidencia alternativa",
    summaryCompleted: "Completado",
    summaryMatch: "{percent}% de coincidencia",
    summaryQuestion: "P",
    summaryAnswer: "R",
    summaryFooter: "Generado por Choose Your Major — Buscador de trayectorias TIC",

    // Admin page (login, top bar, sidebar)
    adminNavQuiz: "Cuestionario",
    adminNavDashboard: "Panel de administración",
    loginArea: "Área de administración",
    loginTitle: "Gestiona el contenido del cuestionario desde un solo lugar.",
    loginIntro: "Gestiona preguntas, revisa envíos y sigue las tendencias de recomendación con un panel rojo y negro más limpio.",
    loginFeature1: "Editar el cuestionario",
    loginFeature1Desc: "Añade, actualiza, elimina o restablece preguntas.",
    loginFeature2: "Revisar registros",
    loginFeature2Desc: "Consulta los resultados enviados y exporta un archivo CSV.",
    loginFeature3: "Seguir las estadísticas",
    loginFeature3Desc: "Consulta los patrones de recomendación y los niveles de coincidencia.",
    secureLogin: "Inicio de sesión seguro",
    adminAccess: "Acceso de administrador",
    loginSubtitle: "Introduce las credenciales de demostración para continuar.",
    username: "Usuario",
    password: "Contraseña",
    demoLogin: "Acceso de demostración",
    loginButton: "Entrar al panel",
    loginError: "Usuario o contraseña incorrectos.",
    sidebarSubtitle: "Centro de control",
    sidebarStatus: "Sesión iniciada como administrador",
    tabQuestions: "Gestionar preguntas",
    tabMajors: "Gestionar especialidades",
    tabRecords: "Ver registros",
    tabAnalytics: "Estadísticas",
    tabLanguages: "Gestionar idiomas",
    openQuizPage: "Abrir el cuestionario",
    logout: "Cerrar sesión",

    // Admin dashboard
    dashLabel: "Panel",
    dashTitle: "Centro de control de administración",
    dashIntro: "Gestiona preguntas, registros y estadísticas del cuestionario con una tipografía coherente en ambas páginas.",
    systemStatus: "Estado del sistema",
    statusActive: "Activo",
    cardQuizLabel: "Gestión del cuestionario",
    cardQuizTitle: "Editor de preguntas",
    cardQuizDesc: "Añade, edita, elimina y restablece preguntas.",
    cardRecordsLabel: "Envíos",
    cardRecordsTitle: "Tabla de registros",
    cardRecordsDesc: "Consulta los intentos y exporta los resultados.",
    cardInsightsLabel: "Estadísticas",
    cardInsightsTitle: "Vista de estadísticas",
    cardInsightsDesc: "Sigue las recomendaciones más frecuentes.",
    pillEditor: "Editor",
    pillLiveList: "Lista en vivo",
    pillInsights: "Estadísticas",
    pillSettings: "Ajustes",
    edit: "Editar",
    delete: "Eliminar",
    clear: "Limpiar",
    resetDefault: "Restablecer",
    unknownError: "Error desconocido",
    questionEditor: "Editor de preguntas",
    addQuestion: "Añadir pregunta",
    editQuestion: "Editar pregunta",
    questionTextLabel: "Texto de la pregunta",
    questionTextPlaceholder: "Escribe la pregunta que verán los estudiantes",
    optionWord: "Opción",
    answerText: "Texto de la respuesta",
    subtextLabel: "Subtexto",
    feedbackLabel: "Comentario",
    scoreHint: "Usa 3 para la especialidad que mejor coincide y 0 o 1 para las especialidades menos relacionadas.",
    saveQuestion: "Guardar pregunta",
    currentQuiz: "Cuestionario actual",
    questionsHeading: "Preguntas",
    noQuestions: "No hay preguntas. Añade una con el formulario.",
    questionNumber: "Pregunta {n}",
    answerOptions: "{count} opciones de respuesta",
    confirmDeleteQuestion: "¿Eliminar esta pregunta?",
    questionDeleteFailed: "No se pudo eliminar la pregunta: ",
    questionDeleteError: "Error al eliminar la pregunta: ",
    enterQuestionText: "Escribe el texto de la pregunta.",
    completeOptions: "Completa el texto, el subtexto y el comentario de todas las opciones.",
    questionSaved: "Pregunta guardada correctamente.",
    questionSaveFailed: "No se pudo guardar la pregunta: ",
    questionSaveError: "Error al guardar la pregunta: ",
    resetQuestionsInfo: "Para restablecer las preguntas, vuelve a ejecutar el archivo SQL (chooseyourmajor.sql) en tu base de datos.",
    majorEditor: "Editor de especialidades",
    addMajor: "Añadir especialidad",
    editMajor: "Editar especialidad",
    majorCodeLabel: "Código de la especialidad (p. ej., 'ai')",
    majorCodePlaceholder: "Código corto y único",
    majorTitleLabel: "Nombre",
    majorTitlePlaceholder: "p. ej., Inteligencia Artificial",
    careersLabel: "Salidas profesionales",
    careersPlaceholder: "Enumera posibles profesiones",
    reasonLabel: "Motivo del resultado",
    reasonPlaceholder: "¿Por qué obtuvieron este resultado?",
    exploreLabel: "Texto descriptivo",
    explorePlaceholder: "¿De qué trata esta especialidad?",
    tagLabel: "Etiqueta de personalidad",
    tagPlaceholder: "p. ej., Innovador del futuro",
    saveMajor: "Guardar especialidad",
    currentOfferings: "Oferta actual",
    ictMajors: "Especialidades de TIC",
    majorCode: "Código: {code}",
    majorTag: "Etiqueta: {tag}",
    enterMajorCode: "Introduce un código de especialidad válido.",
    majorSaved: "Especialidad guardada en la base de datos.",
    majorSaveFailed: "No se pudo guardar la especialidad: ",
    minTwoMajors: "El cuestionario necesita al menos dos especialidades para funcionar.",
    confirmDeleteMajor: "¿Eliminar la especialidad {title}? También se eliminarán sus puntuaciones de todas las preguntas.",
    majorDeleteFailed: "No se pudo eliminar la especialidad: ",
    majorsLoadFailed: "No se pudieron cargar las especialidades de la base de datos: ",
    recordsTitle: "Registros del cuestionario",
    recordsDesc: "Revisa los intentos enviados y exporta los registros para tus informes.",
    exportCsv: "Exportar CSV",
    clearRecords: "Borrar registros",
    colDate: "Fecha",
    colRecommended: "Especialidad recomendada",
    colMatch: "Coincidencia",
    colAlternative: "Alternativa",
    colDetails: "Detalles",
    noRecords: "Todavía no hay registros.",
    view: "Ver",
    recordDetails: "Detalles del registro",
    submittedOn: "Enviado: {date}",
    close: "Cerrar",
    questionUnavailable: "Pregunta no disponible",
    answerUnavailable: "Respuesta no disponible",
    skippedAnswer: "Saltada",
    confirmClearRecords: "¿Borrar todos los registros del cuestionario?",
    noRecordsToExport: "No hay registros para exportar.",
    totalRecordsLabel: "Total de registros",
    mostCommonMajor: "Especialidad más frecuente",
    averageMatchLabel: "Coincidencia media",
    quizStartsLabel: "Cuestionarios iniciados",
    completionsLabel: "Completados",
    notFinishedLabel: "Iniciados sin terminar",
    majorDistribution: "Distribución por especialidad",
    recAnalytics: "Estadísticas de recomendaciones",
    recAnalyticsDesc: "Consulta con qué frecuencia aparece cada especialidad como recomendación principal.",
    none: "Ninguna",
    noAnalytics: "Aún no hay estadísticas. Completa el cuestionario para generar registros.",
    langManagement: "Gestión de idiomas",
    availableLanguages: "Idiomas disponibles",
    langDesc: "Elige qué idiomas pueden usar los usuarios del cuestionario.",
    saveLanguages: "Guardar idiomas",
    enabled: "Activado",
    disabled: "Desactivado",
    languagesSaved: "Idiomas guardados. El cuestionario los mostrará al actualizar la página.",
    languagesReset: "Todos los idiomas vuelven a estar activados."
  },

  fr: {
    eyebrow: "Projet TIC · Prototype du Sprint 1",
    heroTitle: "Découvrez votre parcours technologique idéal",
    heroDescription: "Répondez à un court questionnaire pour découvrir quelle spécialité en TIC correspond le mieux à vos intérêts, vos points forts et vos préférences de travail.",
    quickAndSimple: "Seulement 2 à 3 minutes",
    quickAndSimpleDesc: "Rapide, ciblé et simple à compléter.",
    personalised: "Recommandation personnalisée",
    personalisedDesc: "Basée sur vos préférences de travail et d’apprentissage.",
    pathwayMatch: "Correspondance de parcours",
    pathwayMatchText: "Informatique, logiciels, cybersécurité ou science des données",
    resultSummary: "Résumé du résultat",
    resultSummaryText: "Recommandation de spécialité avec détail du score",
    navQuiz: "Quiz",
    navAdmin: "Administrateur",
    startQuiz: "Commencer le quiz",
    adminLogin: "Connexion administrateur",
    accessibilityMode: "Mode d’accessibilité",
    decreaseFont: "Réduire la taille du texte",
    increaseFont: "Augmenter la taille du texte",
    languageLabel: "Langue",
    loading: "Chargement du quiz…",
    loadError: "Impossible de charger les données du quiz. Vérifiez que le serveur PHP et la base de données fonctionnent.",

    resumeTitle: "Bon retour !",
    resumeText: "Vous avez un quiz en cours.",
    continueQuiz: "Continuer le quiz",
    startFresh: "Recommencer à zéro",

    questionnaire: "Questionnaire",
    quizTitle: "Trouvez la spécialité en TIC qui vous correspond le mieux",
    quizHint: "Passez n’importe quelle question et revenez-y grâce aux pastilles numérotées ci-dessous.",
    progressLabel: "Question {current} sur {total}",
    quizStats: "Répondues : {answered} | Passées : {skipped}",
    jumpToQuestion: "Aller à une question",
    goToQuestion: "Aller à la question {n}",
    questionShort: "Q{n}",
    dotAnswered: "Q{n} ✓",
    dotUnanswered: "Q{n} – sans réponse",
    previous: "Précédent",
    next: "Suivant",
    skipForNow: "Passer pour l’instant",
    seeResult: "Voir le résultat",
    submitAnyway: "Envoyer quand même ({count} passées)",
    selectOrSkip: "Veuillez choisir une option, ou utilisez « Passer » pour y revenir plus tard.",
    skippedWarning: "Vous avez passé : {list}. Vous pouvez y revenir grâce aux pastilles numérotées ci-dessus, ou envoyer avec vos réponses actuelles.",
    answerAtLeastOne: "Veuillez répondre à au moins une question avant de voir votre résultat.",

    recommendation: "Recommandation",
    yourResult: "Votre résultat",
    recommendedMajor: "Spécialité recommandée",
    matchLevel: "Niveau de correspondance",
    strongMatch: "Forte correspondance",
    goodMatch: "Bonne correspondance",
    possibleMatch: "Correspondance possible",
    whyResult: "Pourquoi ce résultat ?",
    alternativeMatch: "Correspondance alternative",
    alternativePercent: "Correspondance alternative : {percent} %",
    answersTitle: "Les réponses à l’origine de ce résultat",
    answerBadge: "+{score} {major}",
    whatThisMeans: "Ce que cela signifie",
    relatedTitle: "Spécialités et disciplines associées",
    nextStepsTitle: "Prochaines étapes suggérées",
    adviceFallback: "Parlez à un conseiller pédagogique de cette filière.",
    yourProfile: "Votre profil",
    scoreBreakdown: "Détail des scores",
    downloadTitle: "Téléchargez votre résumé",
    downloadDesc: "Obtenez une copie texte de votre résultat à conserver ou à partager.",
    downloadBtn: "Télécharger le résumé",
    shareTitle: "Partager cette spécialité",
    qrCaption: "Scannez pour partager cette spécialité",
    qrAlt: "Code QR de la page {major}",
    emailTitle: "Recevez votre rapport par e-mail",
    emailDesc: "Saisissez votre adresse e-mail pour recevoir un résumé de votre résultat.",
    emailPlaceholder: "votre@email.com",
    sendReport: "Envoyer le rapport",
    sending: "Envoi en cours…",
    sent: "✓ Envoyé !",
    invalidEmail: "Veuillez saisir une adresse e-mail valide.",
    noResult: "Aucun résultat pour l’instant.",
    sendFailed: "Impossible d’envoyer l’e-mail : ",
    exploreMajor: "Explorer cette spécialité",
    restartQuiz: "Recommencer le quiz",

    summaryHeading: "CHOISISSEZ VOTRE SPÉCIALITÉ — RÉSUMÉ DU RÉSULTAT",
    summaryRecommended: "Spécialité recommandée",
    summaryAlternative: "Correspondance alternative",
    summaryCompleted: "Terminé le",
    summaryMatch: "{percent} % de correspondance",
    summaryQuestion: "Q",
    summaryAnswer: "R",
    summaryFooter: "Généré par Choose Your Major — Guide des parcours TIC",

    // Admin page (login, top bar, sidebar)
    adminNavQuiz: "Page du quiz",
    adminNavDashboard: "Tableau de bord admin",
    loginArea: "Espace d’administration",
    loginTitle: "Gérez le contenu de votre quiz depuis un seul endroit.",
    loginIntro: "Gérez les questions, consultez les réponses envoyées et suivez les tendances de recommandation grâce à un tableau de bord rouge et noir épuré.",
    loginFeature1: "Modifier le quiz",
    loginFeature1Desc: "Ajoutez, modifiez, supprimez ou réinitialisez les questions.",
    loginFeature2: "Consulter les résultats",
    loginFeature2Desc: "Consultez les résultats envoyés et exportez un fichier CSV.",
    loginFeature3: "Suivre les statistiques",
    loginFeature3Desc: "Visualisez les tendances de recommandation et les niveaux de correspondance.",
    secureLogin: "Connexion sécurisée",
    adminAccess: "Accès administrateur",
    loginSubtitle: "Saisissez les identifiants de démonstration pour continuer.",
    username: "Nom d’utilisateur",
    password: "Mot de passe",
    demoLogin: "Identifiants de démonstration",
    loginButton: "Se connecter au tableau de bord",
    loginError: "Nom d’utilisateur ou mot de passe incorrect.",
    sidebarSubtitle: "Centre de contrôle",
    sidebarStatus: "Connecté en tant qu’administrateur",
    tabQuestions: "Gérer les questions",
    tabMajors: "Gérer les spécialités",
    tabRecords: "Voir les résultats",
    tabAnalytics: "Statistiques",
    tabLanguages: "Gérer les langues",
    openQuizPage: "Ouvrir le quiz",
    logout: "Se déconnecter",

    // Admin dashboard
    dashLabel: "Tableau de bord",
    dashTitle: "Centre de contrôle admin",
    dashIntro: "Gérez les questions, les résultats et les statistiques du quiz avec une typographie cohérente sur les deux pages.",
    systemStatus: "État du système",
    statusActive: "Actif",
    cardQuizLabel: "Gestion du quiz",
    cardQuizTitle: "Éditeur de questions",
    cardQuizDesc: "Ajoutez, modifiez, supprimez et réinitialisez les questions.",
    cardRecordsLabel: "Réponses",
    cardRecordsTitle: "Tableau des résultats",
    cardRecordsDesc: "Consultez les tentatives et exportez les résultats.",
    cardInsightsLabel: "Statistiques",
    cardInsightsTitle: "Vue statistiques",
    cardInsightsDesc: "Suivez les recommandations les plus fréquentes.",
    pillEditor: "Éditeur",
    pillLiveList: "Liste en direct",
    pillInsights: "Statistiques",
    pillSettings: "Paramètres",
    edit: "Modifier",
    delete: "Supprimer",
    clear: "Effacer",
    resetDefault: "Réinitialiser",
    unknownError: "Erreur inconnue",
    questionEditor: "Éditeur de questions",
    addQuestion: "Ajouter une question",
    editQuestion: "Modifier la question",
    questionTextLabel: "Texte de la question",
    questionTextPlaceholder: "Saisissez la question affichée aux étudiants",
    optionWord: "Option",
    answerText: "Texte de la réponse",
    subtextLabel: "Sous-texte",
    feedbackLabel: "Retour",
    scoreHint: "Mettez 3 pour la spécialité principale et 0 ou 1 pour les spécialités moins liées.",
    saveQuestion: "Enregistrer la question",
    currentQuiz: "Quiz actuel",
    questionsHeading: "Questions",
    noQuestions: "Aucune question. Ajoutez-en une avec le formulaire.",
    questionNumber: "Question {n}",
    answerOptions: "{count} options de réponse",
    confirmDeleteQuestion: "Supprimer cette question ?",
    questionDeleteFailed: "Échec de la suppression de la question : ",
    questionDeleteError: "Erreur lors de la suppression de la question : ",
    enterQuestionText: "Veuillez saisir le texte de la question.",
    completeOptions: "Veuillez remplir le texte, le sous-texte et le retour de chaque option.",
    questionSaved: "Question enregistrée.",
    questionSaveFailed: "Échec de l’enregistrement de la question : ",
    questionSaveError: "Erreur lors de l’enregistrement de la question : ",
    resetQuestionsInfo: "Pour rétablir les questions par défaut, relancez le fichier SQL (chooseyourmajor.sql) dans votre base de données.",
    majorEditor: "Éditeur de spécialités",
    addMajor: "Ajouter une spécialité",
    editMajor: "Modifier la spécialité",
    majorCodeLabel: "Code de la spécialité (ex. 'ai')",
    majorCodePlaceholder: "Code court et unique",
    majorTitleLabel: "Nom",
    majorTitlePlaceholder: "ex. Intelligence artificielle",
    careersLabel: "Métiers possibles",
    careersPlaceholder: "Listez des métiers possibles",
    reasonLabel: "Raison du résultat",
    reasonPlaceholder: "Pourquoi ont-ils obtenu ce résultat ?",
    exploreLabel: "Texte de présentation",
    explorePlaceholder: "En quoi consiste cette spécialité ?",
    tagLabel: "Profil de personnalité",
    tagPlaceholder: "ex. Innovateur de demain",
    saveMajor: "Enregistrer la spécialité",
    currentOfferings: "Offre actuelle",
    ictMajors: "Spécialités TIC",
    majorCode: "Code : {code}",
    majorTag: "Profil : {tag}",
    enterMajorCode: "Veuillez saisir un code de spécialité valide.",
    majorSaved: "Spécialité enregistrée dans la base de données.",
    majorSaveFailed: "Impossible d’enregistrer la spécialité : ",
    minTwoMajors: "Le quiz a besoin d’au moins deux spécialités pour fonctionner.",
    confirmDeleteMajor: "Supprimer la spécialité {title} ? Ses scores seront aussi retirés de toutes les questions.",
    majorDeleteFailed: "Impossible de supprimer la spécialité : ",
    majorsLoadFailed: "Impossible de charger les spécialités depuis la base de données : ",
    recordsTitle: "Résultats du quiz",
    recordsDesc: "Consultez les tentatives envoyées et exportez les résultats pour vos rapports.",
    exportCsv: "Exporter en CSV",
    clearRecords: "Effacer les résultats",
    colDate: "Date",
    colRecommended: "Spécialité recommandée",
    colMatch: "Correspondance",
    colAlternative: "Alternative",
    colDetails: "Détails",
    noRecords: "Aucun résultat pour l’instant.",
    view: "Voir",
    recordDetails: "Détails du résultat",
    submittedOn: "Envoyé le : {date}",
    close: "Fermer",
    questionUnavailable: "Question indisponible",
    answerUnavailable: "Réponse indisponible",
    skippedAnswer: "Passée",
    confirmClearRecords: "Effacer tous les résultats du quiz ?",
    noRecordsToExport: "Aucun résultat à exporter.",
    totalRecordsLabel: "Nombre de résultats",
    mostCommonMajor: "Spécialité la plus fréquente",
    averageMatchLabel: "Correspondance moyenne",
    quizStartsLabel: "Quiz commencés",
    completionsLabel: "Quiz terminés",
    notFinishedLabel: "Commencés, non terminés",
    majorDistribution: "Répartition par spécialité",
    recAnalytics: "Statistiques des recommandations",
    recAnalyticsDesc: "Voyez à quelle fréquence chaque spécialité apparaît en première recommandation.",
    none: "Aucune",
    noAnalytics: "Pas encore de statistiques. Terminez le quiz pour générer des résultats.",
    langManagement: "Gestion des langues",
    availableLanguages: "Langues disponibles",
    langDesc: "Choisissez les langues proposées aux utilisateurs du quiz.",
    saveLanguages: "Enregistrer les langues",
    enabled: "Activée",
    disabled: "Désactivée",
    languagesSaved: "Langues enregistrées. Le quiz les affichera après actualisation.",
    languagesReset: "Toutes les langues sont de nouveau activées."
  }
};

// ── Lookup helpers ──────────────────────────────────────────────────────────

// Current language — only one that is enabled in admin and has interface text,
// otherwise English (e.g. a language that was switched off after being chosen).
function getLang() {
  const saved = localStorage.getItem("selectedLanguage");
  return saved && uiText[saved] && getEnabledLanguages().includes(saved) ? saved : "en";
}

// Interface text for a key, with {name} placeholders filled from vars.
function t(key, vars) {
  const table = uiText[getLang()] || uiText.en;
  let text = table[key] !== undefined ? table[key] : uiText.en[key];
  if (text === undefined) return key;

  if (vars) {
    Object.keys(vars).forEach((name) => {
      text = text.split("{" + name + "}").join(vars[name]);
    });
  }
  return text;
}

// Language menu (quiz page and admin page): only languages enabled in
// Manage Languages that have interface text.
function renderLanguageOptions(select) {
  select.innerHTML = "";

  getEnabledLanguages()
    .filter((code) => languageConfig[code] && uiText[code])
    .forEach((code) => {
      const option = document.createElement("option");
      option.value = code;
      option.textContent = languageConfig[code].nativeName;
      select.appendChild(option);
    });

  select.value = getLang();
}

// Fill every element tagged with data-i18n / data-i18n-placeholder /
// data-i18n-aria. Elements are found by tag, not by position, so adding or
// reordering panels can't put a heading on the wrong box.
function applyLanguage() {
  document.documentElement.lang = getLang();

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.placeholder = t(el.dataset.i18nPlaceholder);
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  });
}

// Major text for the result page. field is one of the database fields
// (title, resultReason, careers, exploreText, personalityTags) or one of the
// list fields that only exist here (nextSteps, relatedMajors).
function getMajorText(code, field) {
  const lang = getLang();
  const own = resultTranslations[lang] && resultTranslations[lang][field];
  if (lang !== "en" && own && own[code]) return own[code];

  const major = majorInfo[code];
  if (major && major[field]) return major[field];

  const english = resultTranslations.en[field];
  if (english && english[code]) return english[code];

  return field === "title" ? code : "";
}

// A translation is only used when the English entry it was written for still
// matches the database question exactly — same question text, same number of
// options, same option text. Otherwise an edited or reordered question could
// show a translated label next to an option that scores for another major.
// Mismatches fall back to English and are reported once in the console.
const warnedQuestions = new Set();

function getDisplayQuestion(question) {
  const english = {
    text: question.text,
    options: question.options.map((o) => ({ text: o.text, subtext: o.subtext })),
    feedback: question.options.map((o) => o.feedback)
  };

  const lang = getLang();
  if (lang === "en") return english;

  const englishList = questionTranslations.en || [];
  const i = englishList.findIndex((entry) => entry.text === question.text);
  const source = i >= 0 ? englishList[i] : null;
  const translated = i >= 0 && questionTranslations[lang] ? questionTranslations[lang][i] : null;

  const matches =
    source && translated &&
    source.options.length === question.options.length &&
    translated.options.length === question.options.length &&
    source.options.every((o, n) => o.text === question.options[n].text);

  if (matches) return translated;

  if (!warnedQuestions.has(question.id + lang)) {
    warnedQuestions.add(question.id + lang);
    console.warn(
      `No up-to-date "${lang}" translation for question ${question.id} ("${question.text}"). ` +
      "Showing English. Update questionTranslations in js/languages.js."
    );
  }
  return english;
}
