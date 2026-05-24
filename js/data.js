

async function loadQuestions() {
  const response = await fetch('get_questions.php');
  const data = await response.json();
  return data;
}
async function loadMajors() {
  const response = await fetch('get_majors.php');
  const data2 = await response.json();
  return data2;
}
let majorInfo = {};
let questions = [];
let userAnswers = [];



async function init() {

  questions = await loadQuestions();
  userAnswers = new Array(questions.length).fill(null);

  const majorsArray = await loadMajors();
  majorsArray.forEach(major => {
  majorInfo[major.code] = major;
  
});
 console.log("questions:", questions);
    console.log("majorInfo:", majorInfo);
}
 

init();
