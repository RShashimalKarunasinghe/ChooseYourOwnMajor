CREATE DATABASE IF NOT EXISTS chooseyourmajor;
USE chooseyourmajor;


CREATE TABLE IF NOT EXISTS questions (
question_id int AUTO_INCREMENT PRIMARY KEY,
text varchar(255)

);


CREATE TABLE IF NOT EXISTS majors (
major_code char(10) PRIMARY KEY,
title varchar(255),
careers text,
result_reason text,
explore_text text,
personality_tags varchar(255)
);


CREATE TABLE IF NOT EXISTS options (
option_id int AUTO_INCREMENT PRIMARY KEY,
question_id int not null,
option_key CHAR(1),
option_text varchar(255),
subtext varchar(255),
feedback varchar(255),
FOREIGN KEY(question_id) REFERENCES questions(question_id)

);




CREATE TABLE IF NOT EXISTS option_scores (
option_id int,
major_code char(10) not null,
score int not null,
PRIMARY KEY (option_id, major_code),
FOREIGN KEY (option_id) REFERENCES  options(option_id),
FOREIGN KEY (major_code) REFERENCES majors(major_code)

);

INSERT INTO majors (major_code, title, careers,
 result_reason, explore_text, personality_tags) 
 VALUES (
 'cs', 'Computer Science', 'You may enjoy roles such as computer scientist, systems analyst, research developer, or algorithm-focused engineer.',
 'Your answers show strong interest in logical reasoning, complex technical problem-solving, and computational thinking.',
 'Computer Science focuses on algorithms, programming concepts, systems thinking, and solving technical problems at a deeper level.',
 'Problem Solver'
 ),
 (
 'se', 'Software Development', 'You may enjoy roles such as software developer, web developer, mobile app developer, or application engineer.',
 'Your answers show strong interest in building applications, designing practical solutions, and creating digital products for users.',
 'Software Development focuses on designing, building, testing, and improving applications, websites, and digital systems.',
 'Creative Builder'
 ),
 (
 'cyber', 'Cyber Security', 'You may enjoy roles such as cyber security analyst, security consultant, penetration tester, or security operations specialist.',
 'Your answers show strong interest in protecting systems, managing risks, and identifying digital threats and vulnerabilities.',
 'Cyber Security focuses on defending systems, networks, and data against cyber threats and improving digital safety.',
 'Risk Protector'
 ),
 (
 'ds', 'Data Science', 'You may enjoy roles such as data analyst, data specialist, business intelligence analyst, or insight-driven technical professional.',
 'Your answers show strong interest in patterns, data interpretation, and using information to support understanding and decisions.',
 'Data Science focuses on analysing data, finding trends, visualising results, and supporting data-driven decision-making.',
 'Insight Explorer'
 );
 
INSERT INTO questions (text) VALUES ('What kind of activity do you enjoy the most?'),
('Which type of project sounds most interesting to you?'),
('Which strength describes you best?'),
('Which topic would you most like to study?'),
('Which future career sounds most appealing?');

INSERT INTO options (question_id, option_key, option_text, subtext, feedback)
 VALUES 
(1, 'A', 'Solving complex technical problems', 'You enjoy logic, analysis, and deep problem-solving.', 'You seem to enjoy analytical and problem-solving work.'),
(1, 'B', 'Building applications or websites', 'You like creating practical digital solutions.', 'You seem to enjoy creative and development-focused tasks.'),
(1, 'C', 'Protecting systems and data', 'You care about digital safety and security.', 'You seem interested in security and risk prevention.'),
(1, 'D', 'Monitoring systems and detecting risks', 'You like observing, checking, and preventing issues.', 'You seem to have strong risk-awareness and attention to detail.'),
(2, 'A', 'Designing smart algorithms', 'You enjoy abstract thinking and technical design.', 'You seem drawn to theoretical and computational thinking.'),
(2, 'B', 'Creating mobile or web applications', 'You like making useful systems for people.', 'You seem motivated by creating practical software products.'),
(2, 'C', 'Investigating security incidents', 'You want to solve digital threats and attacks.', 'You seem interested in protecting systems from cyber threats.'),
(2, 'D', 'Finding patterns in data', 'You enjoy analysis and discovering insights.', 'You seem interested in data-driven thinking and insights.'),
(3, 'A', 'Logical reasoning', 'You like working through problems step by step.', 'You appear to be a strong logical thinker.'),
(3, 'B', 'Creativity in building solutions', 'You enjoy turning ideas into useful systems.', 'You seem comfortable with practical and creative development.'),
(3, 'C', 'Risk awareness and attention to detail', 'You notice issues others may miss.', 'You seem detail-oriented and careful with risks.'),
(3, 'D', 'Interpreting numbers and trends', 'You like understanding what data means.', 'You seem comfortable interpreting information and patterns.'),
(4, 'A', 'Algorithms and computational thinking', 'Learn how systems think and solve problems.', 'You seem interested in the core theory behind computing.'),
(4, 'B', 'Software design and application development', 'Build systems that people actually use.', 'You seem interested in designing and building software products.'),
(4, 'C', 'Network security and ethical hacking', 'Protect digital environments and user data.', 'You seem strongly interested in cyber defence and protection.'),
(4, 'D', 'Data analysis and visualisation', 'Use data to support decisions and insights.', 'You seem interested in understanding and explaining data.'),
(5, 'A', 'Computer scientist or systems researcher', 'Work on deep technical problem-solving.', 'You may enjoy technically demanding and analytical roles.'),
(5, 'B', 'Software developer or app engineer', 'Create digital products and services.', 'You may enjoy building real-world digital solutions.'),
(5, 'C', 'Cyber security analyst or consultant', 'Protect systems and manage digital risk.', 'You may enjoy defending organisations from cyber threats.'),
(5, 'D', 'Data analyst or business intelligence specialist', 'Turn information into insight and action.', 'You may enjoy extracting meaning from data and trends.');

INSERT INTO option_scores (option_id, major_code, score) VALUES 
(1, 'cs', 3),
(1, 'se', 1),
(2, 'se', 3),
(2, 'cs', 1),
(3, 'cyber', 3),
(3, 'cs', 1),
(4, 'cyber', 3),
(4, 'ds', 1),
(5, 'cs', 3),
(6, 'se', 3),
(7, 'cyber', 3),
(8, 'ds', 3),
(9, 'cs', 3),
(10, 'se', 3),
(11, 'cyber', 3),
(12, 'ds', 3),
(13, 'cs', 3),
(14, 'se', 3),
(15, 'cyber', 3),
(16, 'ds', 3),
(17, 'cs', 3),
(18, 'se', 3),
(19, 'cyber', 3),
(20, 'ds', 3);






