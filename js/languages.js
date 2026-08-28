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

// Result page translations
const resultTranslations = {
  en: {
    majors: {
      cs: "Computer Science",
      se: "Software Development",
      cyber: "Cyber Security",
      ds: "Data Science"
    },

    strongMatch: "Strong Match",
    goodMatch: "Good Match",
    possibleMatch: "Possible Match",

    alternativeMatch: "Alternative match",

    resultReason: {
      cs: "Your answers show strong interest in logical reasoning, complex technical problem-solving, and computational thinking.",
      se: "Your answers show strong interest in building practical systems, creating applications, and developing useful digital solutions.",
      cyber: "Your answers show strong interest in protecting systems, managing risks, and identifying digital threats and vulnerabilities.",
      ds: "Your answers show strong interest in analysing data, identifying patterns, and turning information into useful insights."
    },

    careers: {
      cs: "You may enjoy roles such as computer scientist, systems analyst, research developer, or algorithm-focused engineer.",
      se: "You may enjoy roles such as software developer, application engineer, web developer, or software engineer.",
      cyber: "You may enjoy roles such as cyber security analyst, security consultant, penetration tester, or security operations specialist.",
      ds: "You may enjoy roles such as data analyst, business intelligence specialist, data scientist, or analytics consultant."
    },

    profileTags: {
      problemSolver: "Problem Solver",
      riskProtector: "Risk Protector",
      creativeBuilder: "Creative Builder",
      dataExplorer: "Data Explorer"
    },

    resultMajors: {
      cs: {
        title: "Computer Science",
        exploreText: "Computer Science focuses on algorithms, programming concepts, systems thinking, and solving technical problems at a deeper level."
      },
      se: {
        title: "Software Development",
        exploreText: "Software Development focuses on designing, building, testing, and improving applications, websites, and digital systems."
      },
      cyber: {
        title: "Cyber Security",
        exploreText: "Cyber Security focuses on defending systems, networks, and data against cyber threats and improving digital safety."
      },
      ds: {
        title: "Data Science",
        exploreText: "Data Science focuses on analysing data, finding trends, visualising results, and supporting data-driven decision-making."
      }
    }
  },

  zh: {
    majors: {
      cs: "计算机科学",
      se: "软件开发",
      cyber: "网络安全",
      ds: "数据科学"
    },

    strongMatch: "强匹配",
    goodMatch: "良好匹配",
    possibleMatch: "可能匹配",

    alternativeMatch: "其他匹配",

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

    profileTags: {
      problemSolver: "问题解决者",
      riskProtector: "风险保护者",
      creativeBuilder: "创意构建者",
      dataExplorer: "数据探索者"
    }
  },

  es: {
    majors: {
      cs: "Ciencias de la Computación",
      se: "Desarrollo de Software",
      cyber: "Ciberseguridad",
      ds: "Ciencia de Datos"
    },

    strongMatch: "Coincidencia fuerte",
    goodMatch: "Buena coincidencia",
    possibleMatch: "Coincidencia posible",

    alternativeMatch: "Coincidencia alternativa",

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

    profileTags: {
      problemSolver: "Solucionador de problemas",
      riskProtector: "Protector de riesgos",
      creativeBuilder: "Constructor creativo",
      dataExplorer: "Explorador de datos"
    }
  },

  fr: {
    majors: {
      cs: "Informatique",
      se: "Développement logiciel",
      cyber: "Cybersécurité",
      ds: "Science des données"
    },

    strongMatch: "Forte correspondance",
    goodMatch: "Bonne correspondance",
    possibleMatch: "Correspondance possible",

    alternativeMatch: "Correspondance alternative",

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

    profileTags: {
      problemSolver: "Résolveur de problèmes",
      riskProtector: "Protecteur des risques",
      creativeBuilder: "Créateur de solutions",
      dataExplorer: "Explorateur de données"
    }
  }
};