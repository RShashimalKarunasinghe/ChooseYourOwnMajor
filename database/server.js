const path = require("path");
const express = require("express");
const mysql = require("mysql2/promise");
const dotenv = require("dotenv");

dotenv.config();

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_NAME = process.env.DB_NAME || "choose_major";
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "..")));

async function createDatabaseAndTables() {
  const connection = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    multipleStatements: true
  });

  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await connection.end();

  const pool = mysql.createPool({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS questions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      text TEXT NOT NULL,
      status ENUM('draft', 'published') DEFAULT 'published',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS options (
      id INT PRIMARY KEY AUTO_INCREMENT,
      question_id INT NOT NULL,
      \`key\` CHAR(1) NOT NULL,
      text TEXT NOT NULL,
      subtext TEXT,
      cs_score INT DEFAULT 0,
      se_score INT DEFAULT 0,
      cyber_score INT DEFAULT 0,
      ds_score INT DEFAULT 0,
      feedback TEXT,
      FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
      UNIQUE KEY question_option(question_id, \`key\`)
    ) ENGINE=InnoDB;
  `);

  return pool;
}

function formatQuestionRows(rows) {
  const questionMap = new Map();

  rows.forEach((row) => {
    if (!questionMap.has(row.id)) {
      questionMap.set(row.id, {
        id: row.id,
        text: row.text,
        status: row.status,
        options: []
      });
    }

    questionMap.get(row.id).options.push({
      id: row.option_id,
      key: row.key,
      text: row.opt_text,
      subtext: row.subtext,
      scores: {
        cs: row.cs_score,
        se: row.se_score,
        cyber: row.cyber_score,
        ds: row.ds_score
      },
      feedback: row.feedback
    });
  });

  return Array.from(questionMap.values());
}

function validateQuestionPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return "Payload must be a JSON object.";
  }

  if (!payload.text || typeof payload.text !== "string") {
    return "Question text is required.";
  }

  if (!Array.isArray(payload.options) || payload.options.length < 2 || payload.options.length > 6) {
    return "Please provide between 2 and 6 options.";
  }

  const validKeys = ["A", "B", "C", "D", "E", "F"];
  const seen = new Set();

  for (const option of payload.options) {
    if (!option || typeof option !== "object") {
      return "Each option must be an object.";
    }

    if (!validKeys.includes(option.key)) {
      return "Each option must have a key of A, B, C, D, E, or F.";
    }

    if (seen.has(option.key)) {
      return "Option keys must be unique.";
    }

    seen.add(option.key);

    if (!option.text || typeof option.text !== "string") {
      return `Text is required for option ${option.key}.`;
    }

    if (!option.feedback || typeof option.feedback !== "string") {
      return `Feedback is required for option ${option.key}.`;
    }

    if (!option.scores || typeof option.scores !== "object") {
      return `Scores are required for option ${option.key}.`;
    }

    const scoreFields = ["cs", "se", "cyber", "ds"];
    for (const field of scoreFields) {
      const value = Number(option.scores[field]);
      if (!Number.isFinite(value)) {
        return `Score ${field} must be a number for option ${option.key}.`;
      }
    }
  }

  return null;
}

function buildInsertOptionQuery(questionId, option) {
  return [
    questionId,
    option.key,
    option.text,
    option.subtext || "",
    option.scores.cs || 0,
    option.scores.se || 0,
    option.scores.cyber || 0,
    option.scores.ds || 0,
    option.feedback || ""
  ];
}

async function startServer() {
  const pool = await createDatabaseAndTables();

  app.get("/api/questions", async (req, res) => {
    try {
      const publishedOnly = req.query.published === "true";
      const statusFilter = publishedOnly ? "WHERE q.status = 'published'" : "";
      const [rows] = await pool.query(
        `SELECT q.id, q.text, q.status, o.id AS option_id, o.\`key\` AS \`key\`, o.text AS opt_text, o.subtext, o.cs_score, o.se_score, o.cyber_score, o.ds_score, o.feedback
         FROM questions q
         LEFT JOIN options o ON o.question_id = q.id
         ${statusFilter}
         ORDER BY q.id ASC, o.\`key\` ASC`
      );

      return res.json(formatQuestionRows(rows));
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to fetch questions." });
    }
  });

  app.post("/api/questions", async (req, res) => {
    const validationError = validateQuestionPayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { id, text, options, status } = req.body;
    const questionStatus = status === "draft" ? "draft" : "published";
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      let insertResult;

      if (id && Number.isInteger(Number(id)) && Number(id) > 0) {
        insertResult = await connection.query(
          "INSERT INTO questions (id, text, status) VALUES (?, ?, ?)",
          [Number(id), text, questionStatus]
        );
      } else {
        insertResult = await connection.query(
          "INSERT INTO questions (text, status) VALUES (?, ?)",
          [text, questionStatus]
        );
      }

      const questionId = Number(insertResult[0].insertId || id);

      for (const option of options) {
        await connection.query(
          `INSERT INTO options (question_id, \`key\`, text, subtext, cs_score, se_score, cyber_score, ds_score, feedback)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          buildInsertOptionQuery(questionId, option)
        );
      }

      await connection.commit();
      return res.status(201).json({ id: questionId, text, status: questionStatus, options });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      return res.status(500).json({ error: "Unable to add question." });
    } finally {
      connection.release();
    }
  });

  app.patch("/api/questions/:id/status", async (req, res) => {
    const questionId = Number(req.params.id);
    const { status } = req.body;

    if (!questionId) {
      return res.status(400).json({ error: "Question ID must be a positive number." });
    }

    if (!status || !["draft", "published"].includes(status)) {
      return res.status(400).json({ error: "Status must be 'draft' or 'published'." });
    }

    try {
      const [result] = await pool.query(
        "UPDATE questions SET status = ? WHERE id = ?",
        [status, questionId]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Question not found." });
      }

      return res.json({ id: questionId, status });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to update question status." });
    }
  });

  app.put("/api/questions/:id", async (req, res) => {
    const questionId = Number(req.params.id);
    if (!questionId) {
      return res.status(400).json({ error: "Question ID must be a positive number." });
    }

    const validationError = validateQuestionPayload(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const { text, options } = req.body;
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();
      const [updateResult] = await connection.query(
        "UPDATE questions SET text = ? WHERE id = ?",
        [text, questionId]
      );

      if (updateResult.affectedRows === 0) {
        await connection.rollback();
        return res.status(404).json({ error: "Question not found." });
      }

      await connection.query("DELETE FROM options WHERE question_id = ?", [questionId]);

      for (const option of options) {
        await connection.query(
          `INSERT INTO options (question_id, \`key\`, text, subtext, cs_score, se_score, cyber_score, ds_score, feedback)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          buildInsertOptionQuery(questionId, option)
        );
      }

      await connection.commit();
      return res.json({ id: questionId, text, status: req.body.status || "published", options });
    } catch (error) {
      await connection.rollback();
      console.error(error);
      return res.status(500).json({ error: "Unable to update question." });
    } finally {
      connection.release();
    }
  });

  app.delete("/api/questions/:id", async (req, res) => {
    const questionId = Number(req.params.id);
    if (!questionId) {
      return res.status(400).json({ error: "Question ID must be a positive number." });
    }

    try {
      const [result] = await pool.query("DELETE FROM questions WHERE id = ?", [questionId]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Question not found." });
      }
      return res.json({ success: true });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Unable to delete question." });
    }
  });

  app.get("/api/status", (req, res) => {
    return res.json({ status: "ok" });
  });

  app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});
