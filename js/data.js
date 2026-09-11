const defaultQuestions = [
  {
    id: 1,
    text: "What kind of activity do you enjoy the most?",
    options: [
      {
        key: "A",
        text: "Solving complex technical problems",
        subtext: "You enjoy logic, analysis, and deep problem-solving.",
        scores: { cs: 3, se: 1 },
        feedback: "You seem to enjoy analytical and problem-solving work."
      },
      {
        key: "B",
        text: "Building applications or websites",
        subtext: "You like creating practical digital solutions.",
        scores: { se: 3, cs: 1 },
        feedback: "You seem to enjoy creative and development-focused tasks."
      },
      {
        key: "C",
        text: "Protecting systems and data",
        subtext: "You care about digital safety and security.",
        scores: { cyber: 3, cs: 1 },
        feedback: "You seem interested in security and risk prevention."
      },
      {
        key: "D",
        text: "Monitoring systems and detecting risks",
        subtext: "You like observing, checking, and preventing issues.",
        scores: { cyber: 3, ds: 1 },
        feedback: "You seem to have strong risk-awareness and attention to detail."
      }
    ]
  },
  {
    id: 2,
    text: "Which type of project sounds most interesting to you?",
    options: [
      {
        key: "A",
        text: "Designing smart algorithms",
        subtext: "You enjoy abstract thinking and technical design.",
        scores: { cs: 3 },
        feedback: "You seem drawn to theoretical and computational thinking."
      },
      {
        key: "B",
        text: "Creating mobile or web applications",
        subtext: "You like making useful systems for people.",
        scores: { se: 3 },
        feedback: "You seem motivated by creating practical software products."
      },
      {
        key: "C",
        text: "Investigating security incidents",
        subtext: "You want to solve digital threats and attacks.",
        scores: { cyber: 3 },
        feedback: "You seem interested in protecting systems from cyber threats."
      },
      {
        key: "D",
        text: "Finding patterns in data",
        subtext: "You enjoy analysis and discovering insights.",
        scores: { ds: 3 },
        feedback: "You seem interested in data-driven thinking and insights."
      }
    ]
  },
  {
    id: 3,
    text: "Which strength describes you best?",
    options: [
      {
        key: "A",
        text: "Logical reasoning",
        subtext: "You like working through problems step by step.",
        scores: { cs: 3 },
        feedback: "You appear to be a strong logical thinker."
      },
      {
        key: "B",
        text: "Creativity in building solutions",
        subtext: "You enjoy turning ideas into useful systems.",
        scores: { se: 3 },
        feedback: "You seem comfortable with practical and creative development."
      },
      {
        key: "C",
        text: "Risk awareness and attention to detail",
        subtext: "You notice issues others may miss.",
        scores: { cyber: 3 },
        feedback: "You seem detail-oriented and careful with risks."
      },
      {
        key: "D",
        text: "Interpreting numbers and trends",
        subtext: "You like understanding what data means.",
        scores: { ds: 3 },
        feedback: "You seem comfortable interpreting information and patterns."
      }
    ]
  },
  {
    id: 4,
    text: "Which topic would you most like to study?",
    options: [
      {
        key: "A",
        text: "Algorithms and computational thinking",
        subtext: "Learn how systems think and solve problems.",
        scores: { cs: 3 },
        feedback: "You seem interested in the core theory behind computing."
      },
      {
        key: "B",
        text: "Software design and application development",
        subtext: "Build systems that people actually use.",
        scores: { se: 3 },
        feedback: "You seem interested in designing and building software products."
      },
      {
        key: "C",
        text: "Network security and ethical hacking",
        subtext: "Protect digital environments and user data.",
        scores: { cyber: 3 },
        feedback: "You seem strongly interested in cyber defence and protection."
      },
      {
        key: "D",
        text: "Data analysis and visualisation",
        subtext: "Use data to support decisions and insights.",
        scores: { ds: 3 },
        feedback: "You seem interested in understanding and explaining data."
      }
    ]
  },
  {
    id: 5,
    text: "Which future career sounds most appealing?",
    options: [
      {
        key: "A",
        text: "Computer scientist or systems researcher",
        subtext: "Work on deep technical problem-solving.",
        scores: { cs: 3 },
        feedback: "You may enjoy technically demanding and analytical roles."
      },
      {
        key: "B",
        text: "Software developer or app engineer",
        subtext: "Create digital products and services.",
        scores: { se: 3 },
        feedback: "You may enjoy building real-world digital solutions."
      },
      {
        key: "C",
        text: "Cyber security analyst or consultant",
        subtext: "Protect systems and manage digital risk.",
        scores: { cyber: 3 },
        feedback: "You may enjoy defending organisations from cyber threats."
      },
      {
        key: "D",
        text: "Data analyst or business intelligence specialist",
        subtext: "Turn information into insight and action.",
        scores: { ds: 3 },
        feedback: "You may enjoy extracting meaning from data and trends."
      }
    ]
  }
];

const majorInfo = {
  cs: {
    code: "cs",
    title: "Computer Science",
    careers: "You may enjoy roles such as computer scientist, systems analyst, research developer, or algorithm-focused engineer.",
    resultReason:
      "Your answers show strong interest in logical reasoning, complex technical problem-solving, and computational thinking.",
    exploreText:
      "Computer Science focuses on algorithms, programming concepts, systems thinking, and solving technical problems at a deeper level."
  },
  se: {
    code: "se",
    title: "Software Development",
    careers: "You may enjoy roles such as software developer, web developer, mobile app developer, or application engineer.",
    resultReason:
      "Your answers show strong interest in building applications, designing practical solutions, and creating digital products for users.",
    exploreText:
      "Software Development focuses on designing, building, testing, and improving applications, websites, and digital systems."
  },
  cyber: {
    code: "cyber",
    title: "Cyber Security",
    careers: "You may enjoy roles such as cyber security analyst, security consultant, penetration tester, or security operations specialist.",
    resultReason:
      "Your answers show strong interest in protecting systems, managing risks, and identifying digital threats and vulnerabilities.",
    exploreText:
      "Cyber Security focuses on defending systems, networks, and data against cyber threats and improving digital safety."
  },
  ds: {
    code: "ds",
    title: "Data Science",
    careers: "You may enjoy roles such as data analyst, data specialist, business intelligence analyst, or insight-driven technical professional.",
    resultReason:
      "Your answers show strong interest in patterns, data interpretation, and using information to support understanding and decisions.",
    exploreText:
      "Data Science focuses on analysing data, finding trends, visualising results, and supporting data-driven decision-making."
  }
};

const personalityTags = {
  cs: "Problem Solver",
  se: "Creative Builder",
  cyber: "Risk Protector",
  ds: "Insight Explorer"
};

function loadQuestions() {
  const savedQuestions = localStorage.getItem("majorQuizQuestions");

  if (!savedQuestions) {
    return JSON.parse(JSON.stringify(defaultQuestions));
  }

  try {
    const parsedQuestions = JSON.parse(savedQuestions);
    if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
      return JSON.parse(JSON.stringify(defaultQuestions));
    }
    return parsedQuestions;
  } catch (error) {
    return JSON.parse(JSON.stringify(defaultQuestions));
  }
}

function saveQuestionsToStorage(updatedQuestions) {
  localStorage.setItem("majorQuizQuestions", JSON.stringify(updatedQuestions));
}

let questions = loadQuestions();