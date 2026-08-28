
CREATE DATABASE IF NOT EXISTS major_quiz
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE major_quiz;

-- Stores quiz questions (replaces localStorage "majorQuizQuestions")
CREATE TABLE IF NOT EXISTS questions (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  sort_order  INT NOT NULL DEFAULT 0,
  question_text TEXT NOT NULL,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Each row is one answer option for a question
CREATE TABLE IF NOT EXISTS options (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  question_id  INT NOT NULL,
  option_key   CHAR(1) NOT NULL,         -- A, B, C, D
  option_text  VARCHAR(512) NOT NULL,
  subtext      VARCHAR(512) NOT NULL,
  feedback     VARCHAR(512) NOT NULL,
  score_cs     TINYINT NOT NULL DEFAULT 0,
  score_se     TINYINT NOT NULL DEFAULT 0,
  score_cyber  TINYINT NOT NULL DEFAULT 0,
  score_ds     TINYINT NOT NULL DEFAULT 0,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

-- Stores quiz submissions (replaces localStorage "majorQuizRecords")
CREATE TABLE IF NOT EXISTS records (
  id                  INT AUTO_INCREMENT PRIMARY KEY,
  submitted_at        DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  top_major           VARCHAR(20) NOT NULL,
  top_major_title     VARCHAR(100) NOT NULL,
  match_percent       TINYINT NOT NULL,
  second_major        VARCHAR(20) NOT NULL,
  second_major_title  VARCHAR(100) NOT NULL,
  second_percent      TINYINT NOT NULL,
  answers_json        TEXT NOT NULL,   -- JSON array of selected option indices
  totals_json         TEXT NOT NULL    -- JSON object of major score totals
);

-- Stores editable result descriptions shown on the quiz results screen
CREATE TABLE IF NOT EXISTS major_info (
  code         VARCHAR(20) PRIMARY KEY,
  title        VARCHAR(100) NOT NULL,
  careers      TEXT NOT NULL,
  result_reason TEXT NOT NULL,
  explore_text TEXT NOT NULL,
  updated_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO major_info (code, title, careers, result_reason, explore_text) VALUES
('cs', 'Computer Science', 'You may enjoy roles such as computer scientist, systems analyst, research developer, or algorithm-focused engineer.', 'Your answers show strong interest in logical reasoning, complex technical problem-solving, and computational thinking.', 'Computer Science focuses on algorithms, programming concepts, systems thinking, and solving technical problems at a deeper level.'),
('se', 'Software Development', 'You may enjoy roles such as software developer, web developer, mobile app developer, or application engineer.', 'Your answers show strong interest in building applications, designing practical solutions, and creating digital products for users.', 'Software Development focuses on designing, building, testing, and improving applications, websites, and digital systems.'),
('cyber', 'Cyber Security', 'You may enjoy roles such as cyber security analyst, security consultant, penetration tester, or security operations specialist.', 'Your answers show strong interest in protecting systems, managing risks, and identifying digital threats and vulnerabilities.', 'Cyber Security focuses on defending systems, networks, and data against cyber threats and improving digital safety.'),
('ds', 'Data Science', 'You may enjoy roles such as data analyst, data specialist, business intelligence analyst, or insight-driven technical professional.', 'Your answers show strong interest in patterns, data interpretation, and using information to support understanding and decisions.', 'Data Science focuses on analysing data, finding trends, visualising results, and supporting data-driven decision-making.')
ON DUPLICATE KEY UPDATE code = VALUES(code);

-- ─── Seed default questions ───────────────────────────────────────────────────

INSERT INTO questions (id, sort_order, question_text) VALUES
(1, 1, 'What kind of activity do you enjoy the most?'),
(2, 2, 'Which type of project sounds most interesting to you?'),
(3, 3, 'Which strength describes you best?'),
(4, 4, 'Which topic would you most like to study?'),
(5, 5, 'Which future career sounds most appealing?');

INSERT INTO options (question_id, option_key, option_text, subtext, feedback, score_cs, score_se, score_cyber, score_ds) VALUES
-- Q1
(1,'A','Solving complex technical problems','You enjoy logic, analysis, and deep problem-solving.','You seem to enjoy analytical and problem-solving work.',3,1,0,0),
(1,'B','Building applications or websites','You like creating practical digital solutions.','You seem to enjoy creative and development-focused tasks.',1,3,0,0),
(1,'C','Protecting systems and data','You care about digital safety and security.','You seem interested in security and risk prevention.',1,0,3,0),
(1,'D','Monitoring systems and detecting risks','You like observing, checking, and preventing issues.','You seem to have strong risk-awareness and attention to detail.',0,0,3,1),
-- Q2
(2,'A','Designing smart algorithms','You enjoy abstract thinking and technical design.','You seem drawn to theoretical and computational thinking.',3,0,0,0),
(2,'B','Creating mobile or web applications','You like making useful systems for people.','You seem motivated by creating practical software products.',0,3,0,0),
(2,'C','Investigating security incidents','You want to solve digital threats and attacks.','You seem interested in protecting systems from cyber threats.',0,0,3,0),
(2,'D','Finding patterns in data','You enjoy analysis and discovering insights.','You seem interested in data-driven thinking and insights.',0,0,0,3),
-- Q3
(3,'A','Logical reasoning','You like working through problems step by step.','You appear to be a strong logical thinker.',3,0,0,0),
(3,'B','Creativity in building solutions','You enjoy turning ideas into useful systems.','You seem comfortable with practical and creative development.',0,3,0,0),
(3,'C','Risk awareness and attention to detail','You notice issues others may miss.','You seem detail-oriented and careful with risks.',0,0,3,0),
(3,'D','Interpreting numbers and trends','You like understanding what data means.','You seem comfortable interpreting information and patterns.',0,0,0,3),
-- Q4
(4,'A','Algorithms and computational thinking','Learn how systems think and solve problems.','You seem interested in the core theory behind computing.',3,0,0,0),
(4,'B','Software design and application development','Build systems that people actually use.','You seem interested in designing and building software products.',0,3,0,0),
(4,'C','Network security and ethical hacking','Protect digital environments and user data.','You seem strongly interested in cyber defence and protection.',0,0,3,0),
(4,'D','Data analysis and visualisation','Use data to support decisions and insights.','You seem interested in understanding and explaining data.',0,0,0,3),
-- Q5
(5,'A','Computer scientist or systems researcher','Work on deep technical problem-solving.','You may enjoy technically demanding and analytical roles.',3,0,0,0),
(5,'B','Software developer or app engineer','Create digital products and services.','You may enjoy building real-world digital solutions.',0,3,0,0),
(5,'C','Cyber security analyst or consultant','Protect systems and manage digital risk.','You may enjoy defending organisations from cyber threats.',0,0,3,0),
(5,'D','Data analyst or business intelligence specialist','Turn information into insight and action.','You may enjoy extracting meaning from data and trends.',0,0,0,3);
