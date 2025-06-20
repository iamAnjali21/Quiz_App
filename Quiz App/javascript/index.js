

const mainContainer=document.querySelector(".main-continer")
const quizContainer=document.querySelector(".quiz-container")
const answerOptions = document.querySelector(".answer-options");
const nextQuestionBtn = document.querySelector(".next-question-btn");
const questionStatus = document.querySelector(".question-status");
const timerDisplay = document.querySelector(".time-duration");
const resultContainer =document.querySelector(".result-container");

resultContainer.style.display="none";
//quiz variable 
const QUIZ_TIME_LIMIT = 15;
let currentTime = QUIZ_TIME_LIMIT;
let timer = null;

let currentQuestion = null;
const questionIndexHistory = [];
let correctAnswerCount=0;

////diaply the quiz result and hide the container
const showQuizResult =() =>{
   quizContainer.style.display="none";
   resultContainer.style.display="block";

    const resultText= `Your answered <b>${correctAnswerCount}</b> out of <b>${numberOfQuestions}</b> question correclty. Great effort!`;
    document.querySelector(".result-message").innerHTML= resultText;
  }

const resetTimer = () => {
  clearInterval(timer);
  currentTime = QUIZ_TIME_LIMIT;
  timerDisplay.textContent = `${currentTime}s`;
};

const startTimer = () => {
  timerDisplay.textContent = `${currentTime}s`; // Ensure visible immediately
  timer = setInterval(() => {
    currentTime--;
    timerDisplay.textContent = `${currentTime}s`;

    if (currentTime <= 0) {
      clearInterval(timer);
      HighlightCorrectAnswer();
      nextQuestionBtn.style.visibility = "visible";
      quizContainer.querySelector(".quiz-timer").style.background="#c31402";
      // Disable all answer options
      answerOptions.querySelectorAll(".answer-option").forEach(option => {
        option.style.pointerEvents = "none";
      });
    }
  }, 1000);
};

const getRandomQuestion = () => {
  const categoryObj = questions.find(
    (cat) => cat.category.toLowerCase() === quizCategory.toLowerCase()
  );

  if (questionIndexHistory.length >= Math.min(categoryObj.questions.length, numberOfQuestions)) {
    // console.log("Quiz Completed!");
    return showQuizResult();
  }

  const availableQuestions = categoryObj.questions
    .map((q, index) => ({ q, index }))
    .filter(({ index }) => !questionIndexHistory.includes(index));

  const randomItem = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
  questionIndexHistory.push(randomItem.index);
  return randomItem.q;
};

const HighlightCorrectAnswer = () => {
  const correctOption = answerOptions.querySelectorAll(".answer-option")[currentQuestion.correctAnswer];
  if (correctOption) {
    correctOption.classList.add("correct");
    const iconHTML = `<span class="material-symbols-rounded">check_circle</span>`;
    correctOption.insertAdjacentHTML("beforeend", iconHTML);
  }
};

const handleAnswer = (option, answerIndex) => {
  clearInterval(timer);
  const isCorrect = currentQuestion.correctAnswer === answerIndex;
  option.classList.add(isCorrect ? "correct" : "incorrect");
  !isCorrect ? HighlightCorrectAnswer() :  correctAnswerCount++;

  const iconHTML = `<span class="material-symbols-rounded">${isCorrect ? 'check_circle' : 'cancel'}</span>`;
  option.insertAdjacentHTML("beforeend", iconHTML);

  // Disable all options
  answerOptions.querySelectorAll(".answer-option").forEach(opt => {
    opt.style.pointerEvents = "none";
  });

  nextQuestionBtn.style.visibility = "visible";
};

const renderQuestion = () => {
  currentQuestion = getRandomQuestion();

  if (!currentQuestion) {
    // document.querySelector(".question-text").textContent = "🎉 Quiz Completed!";
    // answerOptions.innerHTML = "";
    // nextQuestionBtn.style.display = "none";
    // questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;
    // timerDisplay.textContent = "--";
    return;
  }

  resetTimer();
  startTimer();

  answerOptions.innerHTML = "";
  nextQuestionBtn.style.visibility = "hidden";
  quizContainer.querySelector(".quiz-timer").style.background="#32313C";

  document.querySelector(".question-text").textContent = currentQuestion.question;

  questionStatus.innerHTML = `<b>${questionIndexHistory.length}</b> of <b>${numberOfQuestions}</b> Questions`;

  currentQuestion.options.forEach((option, index) => {
    const li = document.createElement("li");
    li.classList.add("answer-option");
    li.textContent = option;
    li.style.pointerEvents = "auto"; // Re-enable for new question
    answerOptions.appendChild(li);
    li.addEventListener("click", () => handleAnswer(li, index));
  });
};

//start the quiz

const startQuiz =() =>{
  mainContainer.style.display="none";
   quizContainer.style.display="block";

quizCategory = mainContainer.querySelector(".Category-option.active").textContent;
 numberOfQuestions = parseInt(mainContainer.querySelector(".question-option.active").textContent);

   renderQuestion();
}
//higlight the selcted option on click -category  or no of questions
document.querySelectorAll(".Category-option, .question-option ").forEach(option =>{
  option.addEventListener("click",()=>{
    option.parentNode.querySelector(".active").classList.remove("active");
    option.classList.add("active");
  })
})


///Resett the quiz and retrun to the configurtaion container
const resetQuiz =() =>{
  resetTimer();
  correctAnswerCount=0;
  questionIndexHistory.length=0;
 mainContainer.style.display="block";
 resultContainer.style.display="none";

}

nextQuestionBtn.addEventListener("click", renderQuestion);
document.querySelector(".try-again-btn").addEventListener("click",resetQuiz);
document.querySelector(".start-quiz-btn").addEventListener("click",startQuiz);
