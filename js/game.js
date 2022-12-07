const question = document.getElementById("question");
const choices = Array.from(document.getElementsByClassName("choice-text"));
const counterText = document.getElementById("counter");
const scoreText = document.getElementById("score");
const gameContent = document.getElementById("game");
const loading = document.getElementById("loading");

let currentQuestion = {};
let answerable = false;
let score = 0;
let counter = 0;
let questions = [];
let params = new URLSearchParams(location.search);
let amount = params.get("amount");

const CORRECT_POINTS = 1;
const MAX_QUESTIONS = amount;

gameContent.classList.add("hidden");
loading.classList.remove("hidden");

fetch(`https://opentdb.com/api.php?amount=30&category=22&type=multiple`) // get questions from Open Trivia Database API
  .then((res) => {
    return res.json();
  })
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((element) => {
      const formattedQuestion = {
        question: htmlUnescape(element.question),
      };
      const answerChoices = [...element.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 3 + 1);
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        element.correct_answer
      );
      answerChoices.forEach((choice, index) => {
        formattedQuestion["choice-" + (index + 1)] = htmlUnescape(choice);
      });
      return formattedQuestion;
    });
    startGame();
  })
  .catch((error) => {
    console.log(error);
  });

startGame = () => {
  loading.classList.add("hidden");
  gameContent.classList.remove("hidden");
  questionCounter = 0;
  score = 0;
  scoreText.innerText = score;
  getNewQuestion();
};

getNewQuestion = () => {
  if (counter >= MAX_QUESTIONS) {
    return window.location.assign(
      `gameOver.html?score=${score}&total=${MAX_QUESTIONS}`
    );
  }

  updateQuestion();
  updateChoices();
  updateCounter();

  answerable = true;
};

choices.forEach((choice) => {
  choice.addEventListener("click", (e) => {
    if (!answerable) return;
    answerable = false;

    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset["number"];

    if (currentQuestion.answer == selectedAnswer) {
      updateScore(CORRECT_POINTS);
    }

    const classToApply =
      selectedAnswer == currentQuestion.answer ? "correct" : "incorrect";

    selectedChoice.parentElement.classList.add(classToApply);
    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 800);
  });
});

updateScore = (num) => {
  score += num;
  scoreText.innerText = score;
};

updateCounter = () => {
  counter++;
  counterText.innerText = counter + "/" + MAX_QUESTIONS;
};

updateQuestion = () => {
  const questionIndex = Math.floor(Math.random() * questions.length);
  currentQuestion = questions[questionIndex];
  question.innerText = currentQuestion.question;
  questions.splice(questionIndex, 1);
};

updateChoices = () => {
  choices.forEach((choice) => {
    const number = choice.dataset["number"];
    choice.innerText = currentQuestion["choice-" + number];
  });
};

function htmlUnescape(str) {
  return str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&uuml;/g, "ü")
    .replace(/&ouml;/g, "ö")
    .replace(/&deg;/g, "°")
    .replace(/&aacute;/g, "á")
    .replace(/&amp;/g, "&")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&atilde;/g, "ã");
}
