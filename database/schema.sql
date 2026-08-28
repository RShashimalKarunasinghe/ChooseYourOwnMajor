CREATE DATABASE IF NOT EXISTS `choose_major`;
USE `choose_major`;

CREATE TABLE IF NOT EXISTS questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  text TEXT NOT NULL,
  status ENUM('draft', 'published') DEFAULT 'published',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS options (
  id INT PRIMARY KEY AUTO_INCREMENT,
  question_id INT NOT NULL,
  `key` CHAR(1) NOT NULL,
  text TEXT NOT NULL,
  subtext TEXT,
  cs_score INT DEFAULT 0,
  se_score INT DEFAULT 0,
  cyber_score INT DEFAULT 0,
  ds_score INT DEFAULT 0,
  feedback TEXT,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
  UNIQUE KEY question_option(question_id, `key`)
) ENGINE=InnoDB;
