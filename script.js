let quizData = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

const userName = document.getElementById("userName");
const startBtn = document.getElementById("startBtn");
const categorySelect = document.getElementById("categorySelect");
const difficultySelect = document.getElementById("difficultySelect");

const questionBox = document.getElementById("questionBox");
const optionsBox = document.getElementById("optionsBox");
const nextBtn = document.getElementById("nextBtn");
const scoreBox = document.getElementById("scoreBox");
const timerBox = document.getElementById("timer");
const quizScreen = document.getElementById("quizScreen");
const startScreen = document.getElementById("startScreen");
const userGreeting = document.getElementById("userGreeting");

startBtn.addEventListener("click", () => {
  const name = userName.value.trim();
  if (!name) {
    alert("Please enter your name.");
    return;
  }
  userGreeting.innerText = `Hello, ${name}! Let's begin 🎯`;
  startScreen.style.display = "none";
  quizScreen.style.display = "block";
  fetchQuestions();
});

async function fetchQuestions() {
  let url = `https://opentdb.com/api.php?amount=5&type=multiple`;
  const category = categorySelect.value;
  const difficulty = difficultySelect.value;

  if (category) url += `&category=${category}`;
  if (difficulty) url += `&difficulty=${difficulty}`;

  const res = await fetch(url);
  const data = await res.json();
  quizData = data.results.map(q => ({
    question: decodeHTML(q.question),
    options: shuffle([...q.incorrect_answers, q.correct_answer].map(decodeHTML)),
    answer: decodeHTML(q.correct_answer)
  }));
  loadQuestion();
}

function decodeHTML(html) {
  const txt = document.createElement("textarea");
  txt.innerHTML = html;
  return txt.value;
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function loadQuestion() {
  clearOptions();
  resetTimer();

  if (currentIndex >= quizData.length) {
    questionBox.innerText = "Quiz Completed!";
    scoreBox.innerText = `Final Score: ${score} / ${quizData.length}`;
    nextBtn.style.display = "none";
    clearInterval(timer);
    return;
  }

  const current = quizData[currentIndex];
  questionBox.innerText = current.question;

  current.options.forEach(option => {
    const btn = document.createElement("button");
    btn.classList.add("option");
    btn.innerText = option;
    btn.addEventListener("click", () => checkAnswer(btn, current.answer));
    optionsBox.appendChild(btn);
  });

  startTimer();
}

function checkAnswer(selectedBtn, correctAnswer) {
  clearInterval(timer);
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === correctAnswer) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });

  if (selectedBtn.innerText === correctAnswer) {
    score++;
  }
}

function clearOptions() {
  optionsBox.innerHTML = "";
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 15;
  timerBox.innerText = timeLeft;
}

function startTimer() {
  timer = setInterval(() => {
    timeLeft--;
    timerBox.innerText = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      autoSubmitAnswer();
    }
  }, 1000);
}

function autoSubmitAnswer() {
  const correctAnswer = quizData[currentIndex].answer;
  const allOptions = document.querySelectorAll(".option");
  allOptions.forEach(btn => {
    btn.disabled = true;
    if (btn.innerText === correctAnswer) {
      btn.classList.add("correct");
    } else {
      btn.classList.add("wrong");
    }
  });
}

nextBtn.addEventListener("click", () => {
  currentIndex++;
  loadQuestion();
});
