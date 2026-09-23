/**
 * data.js — data layer
 * Loads questions + majors from the MySQL database via PHP.
 * Exposes init(), loadQuestions(), loadMajors().
 *
 * This is the only file that fetches quiz data, so swapping the backend
 * (e.g. to the api/ folder) only means changing the two loaders below.
 */

let majorInfo   = {};
let questions   = [];
let userAnswers = [];

// Fallback profile tags for the four original majors.
// Majors added through the admin page use their own personalityTags field.
const personalityTags = {
  cs: "Problem Solver",
  se: "Creative Builder",
  cyber: "Risk Protector",
  ds: "Insight Explorer"
};

async function loadQuestions() {
  const res = await fetch("get_questions.php");
  if (!res.ok) throw new Error("get_questions.php returned " + res.status);
  return res.json();
}

async function loadMajors() {
  const res = await fetch("get_majors.php");
  if (!res.ok) throw new Error("get_majors.php returned " + res.status);
  return res.json();
}

// Returns true when data loaded, false otherwise (callers show an error).
async function init() {
  try {
    questions = await loadQuestions();
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions returned from the database.");
    }
    userAnswers = new Array(questions.length).fill(null);

    const majorsArray = await loadMajors();
    majorInfo = {};
    majorsArray.forEach(function (major) {
      majorInfo[major.code] = major;
    });

    return true;
  } catch (err) {
    console.error("Failed to load quiz data:", err);
    return false;
  }
}
