// js/data.js
// All question data now lives in MySQL. This file holds:
//   - personalityTags (static, no DB needed)
//   - API helpers used by app.js, quiz.js, admin.js

// ── API base path ─────────────────────────────────────────────────────────────
// Keep the API path relative so the project can run from any XAMPP sub-folder.
const API_BASE = './api';

// ── Static major metadata ─────────────────────────────────────────────────────
const majorInfo = {
  cs: {
    code: 'cs',
    title: 'Computer Science',
    careers: 'You may enjoy roles such as computer scientist, systems analyst, research developer, or algorithm-focused engineer.',
    resultReason: 'Your answers show strong interest in logical reasoning, complex technical problem-solving, and computational thinking.',
    exploreText: 'Computer Science focuses on algorithms, programming concepts, systems thinking, and solving technical problems at a deeper level.'
  },
  se: {
    code: 'se',
    title: 'Software Development',
    careers: 'You may enjoy roles such as software developer, web developer, mobile app developer, or application engineer.',
    resultReason: 'Your answers show strong interest in building applications, designing practical solutions, and creating digital products for users.',
    exploreText: 'Software Development focuses on designing, building, testing, and improving applications, websites, and digital systems.'
  },
  cyber: {
    code: 'cyber',
    title: 'Cyber Security',
    careers: 'You may enjoy roles such as cyber security analyst, security consultant, penetration tester, or security operations specialist.',
    resultReason: 'Your answers show strong interest in protecting systems, managing risks, and identifying digital threats and vulnerabilities.',
    exploreText: 'Cyber Security focuses on defending systems, networks, and data against cyber threats and improving digital safety.'
  },
  ds: {
    code: 'ds',
    title: 'Data Science',
    careers: 'You may enjoy roles such as data analyst, data specialist, business intelligence analyst, or insight-driven technical professional.',
    resultReason: 'Your answers show strong interest in patterns, data interpretation, and using information to support understanding and decisions.',
    exploreText: 'Data Science focuses on analysing data, finding trends, visualising results, and supporting data-driven decision-making.'
  }
};

const personalityTags = {
  cs:    'Problem Solver',
  se:    'Creative Builder',
  cyber: 'Risk Protector',
  ds:    'Insight Explorer'
};

/** Fetch editable result descriptions from MySQL. */
async function loadMajorInfoFromServer() {
  const res = await fetch(`${API_BASE}/major_info.php`);
  if (!res.ok) throw new Error(`Failed to load major information: ${res.status}`);
  const rows = await res.json();
  rows.forEach((row) => {
    if (majorInfo[row.code]) Object.assign(majorInfo[row.code], row);
  });
  return majorInfo;
}

/** Admin: update one major's result descriptions. */
async function updateMajorInfo(code, payload) {
  const res = await fetch(`${API_BASE}/major_info.php?code=${encodeURIComponent(code)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to update major information: ${res.status}`);
  return res.json();
}

// ── API helpers ───────────────────────────────────────────────────────────────

/** Fetch questions from MySQL.
 *  Pass 'all' to get every question (admin use); omit for quiz (active only). */
async function loadQuestionsFromServer(mode) {
  const url = mode === 'all'
    ? `${API_BASE}/questions.php?all=1`
    : `${API_BASE}/questions.php`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to load questions: ${res.status}`);
  return res.json();
}

/** Save a new quiz record to MySQL. */
async function saveRecordToServer(record) {
  const res = await fetch(`${API_BASE}/records.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(record)
  });
  if (!res.ok) throw new Error(`Failed to save record: ${res.status}`);
  return res.json();
}

/** Fetch all records from MySQL. */
async function fetchRecordsFromServer() {
  const res = await fetch(`${API_BASE}/records.php`, { cache: 'no-store' });
  if (!res.ok) throw new Error(`Failed to fetch records: ${res.status}`);
  return res.json();
}

function calculateMajorAnalytics(records) {
  const counts = { cs: 0, se: 0, cyber: 0, ds: 0 };

  records.forEach((record) => {
    if (counts[record.topMajor] !== undefined) counts[record.topMajor]++;
  });

  return {
    total: records.length,
    counts,
    percentageFor(major) {
      return records.length === 0 ? 0 : Math.round((counts[major] / records.length) * 100);
    }
  };
}

/** Delete all records from MySQL. */
async function clearRecordsOnServer() {
  const res = await fetch(`${API_BASE}/records.php`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to clear records: ${res.status}`);
  return res.json();
}

/** Admin: create a new question. */
async function createQuestion(payload) {
  const res = await fetch(`${API_BASE}/questions.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create question: ${res.status}`);
  return res.json();
}

/** Admin: update an existing question by id. */
async function updateQuestion(id, payload) {
  const res = await fetch(`${API_BASE}/questions.php?id=${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to update question: ${res.status}`);
  return res.json();
}

/** Admin: delete a question by id. */
async function deleteQuestionOnServer(id) {
  const res = await fetch(`${API_BASE}/questions.php?id=${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(`Failed to delete question: ${res.status}`);
  return res.json();
}

/** Admin: reset all questions to defaults. */
async function resetQuestionsOnServer() {
  const res = await fetch(`${API_BASE}/questions.php?reset=1`, { method: 'POST' });
  if (!res.ok) throw new Error(`Failed to reset questions: ${res.status}`);
  return res.json(); // returns { ok, questions }
}

// questions array is populated async; quiz.js / admin.js await loadQuestionsFromServer()
let questions = [];
