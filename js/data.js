// js/data.js
// All question data now lives in MySQL. This file holds:
//   - personalityTags (static, no DB needed)
//   - API helpers used by app.js, quiz.js, admin.js

// ── API base path ─────────────────────────────────────────────────────────────
// Keep the API path relative so the project can run from any XAMPP sub-folder.
const API_BASE = './api';

// ── Static major metadata ─────────────────────────────────────────────────────
const majorInfo = {};
const majorKeys = [];
const personalityTags = {};

/** Fetch editable result descriptions from MySQL. */
async function loadMajorInfoFromServer() {
  const res = await fetch(`${API_BASE}/major_info.php`);
  if (!res.ok) throw new Error(`Failed to load major information: ${res.status}`);
  const rows = await res.json();
  majorKeys.length = 0;
  Object.keys(majorInfo).forEach((key) => delete majorInfo[key]);
  rows.forEach((row) => {
    majorKeys.push(row.code);
    majorInfo[row.code] = row;
    personalityTags[row.code] = row.personalityTag || row.title;
  });
  return majorInfo;
}

async function createMajor(payload) {
  const res = await fetch(`${API_BASE}/major_info.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error((await res.json()).error || `Failed to create major: ${res.status}`);
  return res.json();
}

async function deleteMajor(code) {
  const res = await fetch(`${API_BASE}/major_info.php?code=${encodeURIComponent(code)}`, { method: 'DELETE' });
  if (!res.ok) throw new Error((await res.json()).error || `Failed to delete major: ${res.status}`);
  return res.json();
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
  const counts = Object.fromEntries(majorKeys.map((major) => [major, 0]));

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
