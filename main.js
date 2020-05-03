import { addToDatabase, diplayDataByIndex } from './dbModule.js';
import { introductionEl, questionEl, timerEl, submitAnswerButtonEl, submitQuizButtonEl, prevButtonEl, nextButtonEl, saveScoreButtonEl, saveScoreAndStatisticsButtonEl, inputEl, startquizButtonEl, scoreWrapperEl, startWrapperEl, cardWrapperEl, cancelQuizButtonEl, bestScoresTableBodyEl, scoreTableBodyEl, numberEl, overallScoreEl } from "./htmlElements.js";
const jsonQuiz1 = `{
    "introduction": "Welcome to the first quiz. Baba jajko Baba jajko Baba jajko Baba jajko Baba jajko Baba jajko ",
    "questions":{
        "1": ["10+2", "12", 4],
        "2": ["2-(-24:4)", "8", 10],
        "3": ["2*5", "10", 10],
        "4": ["3:1", "3", 10]
    },
    "size": "4"
}`;
// GLOBAL VARIABLES AND INIT
const currQuiz = JSON.parse(jsonQuiz1);
let cardNumber;
let userAnswers;
let userTimes;
let enterTime;
let leftTime;
let nIntervId;
let currTime;
let timeSpent;
resetVariables();
diplayDataByIndex(bestScoresTableBodyEl);
// TIMER
function startTimer() {
    nIntervId = setInterval(() => {
        currTime++;
        timerEl.innerHTML = currTime + "s";
    }, 1000);
}
function stopTimer() {
    clearInterval(nIntervId);
}
// START QUIZ
startquizButtonEl.addEventListener('click', (ev) => {
    introductionEl.innerHTML = currQuiz.introduction;
    startWrapperEl.style.visibility = "hidden";
    cardWrapperEl.style.visibility = "visible";
});
// NEXT QUESTION
nextButtonEl.addEventListener('click', (ev) => {
    ev.preventDefault();
    saveTimeStatistics();
    if (cardNumber < currQuiz.size) {
        cardNumber++;
    }
    if (cardNumber === 1) { // first question card
        // hide introduction and display gameplay elements
        introductionEl.style.opacity = "0.1";
        timerEl.style.visibility = "visible";
        setQuizCardElementsVisibility("visible");
        startTimer();
    }
    // display current question
    questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
    resetInput();
    // update question number
    setQuestionNumber();
    // mark if question was already answered
    markBorderIfAnswerGiven();
});
// PREVIOUS QUESTION
prevButtonEl.addEventListener('click', (ev) => {
    ev.preventDefault();
    saveTimeStatistics();
    if (cardNumber > 0) {
        cardNumber--;
    }
    if (cardNumber === 0) {
        stopTimer();
        // show introduction and hide gameplay elements
        introductionEl.style.opacity = "1.0";
        setQuizCardElementsVisibility("hidden");
    }
    else {
        // display current question
        questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
        resetInput();
        // mark if the answer was already given
        markBorderIfAnswerGiven();
    }
    // update question number
    setQuestionNumber();
});
// SUBMIT ANSWER
submitAnswerButtonEl.addEventListener('click', (ev) => {
    if (inputEl.value !== "") {
        userAnswers[cardNumber] = inputEl.value;
    }
    if (allAnswersSubmitted()) {
        submitQuizButtonEl.removeAttribute("disabled");
    }
    markBorderIfAnswerGiven();
});
// CANCEL QUIZ SESSION
cancelQuizButtonEl.addEventListener('click', (ev) => {
    alert("Cancelling session. Redirecting to the home page. Click \"OK\"");
    cardWrapperEl.style.visibility = "hidden";
    setQuizCardElementsVisibility("hidden");
    timerEl.style.visibility = "hidden";
    startWrapperEl.style.visibility = "visible";
    resetVariables();
});
// SUBMIT QUIZ
submitQuizButtonEl.addEventListener('click', (ev) => {
    ev.preventDefault();
    stopTimer();
    scoreWrapperEl.style.visibility = "visible";
    cardWrapperEl.style.visibility = "hidden";
    timerEl.style.visibility = "hidden";
    setQuizCardElementsVisibility("hidden");
    fillScoreTable();
});
// SAVE SCORE
saveScoreButtonEl.addEventListener('click', (ev) => {
    const score = timeSpent;
    const statistics = [];
    addToDatabase(score, statistics);
    scoreWrapperEl.style.visibility = "hidden";
    startWrapperEl.style.visibility = "visible";
    diplayDataByIndex(bestScoresTableBodyEl);
    resetVariables();
});
// SAVE SCORE AND STATISTICS
saveScoreAndStatisticsButtonEl.addEventListener('click', (ev) => {
    const score = timeSpent;
    const statistics = userTimes;
    addToDatabase(score, statistics);
    scoreWrapperEl.style.visibility = "hidden";
    startWrapperEl.style.visibility = "visible";
    diplayDataByIndex(bestScoresTableBodyEl);
    resetVariables();
});
function resetInput() {
    document.getElementById("playersAnswer").value = "";
}
function setQuestionNumber() {
    if (cardNumber !== 0) {
        numberEl.innerHTML = cardNumber.toString() + ". question";
    }
    else {
        numberEl.innerHTML = "";
    }
}
function setQuizCardElementsVisibility(state) {
    questionEl.style.visibility = state;
    inputEl.style.visibility = state;
    numberEl.style.visibility = state;
    submitAnswerButtonEl.style.visibility = state;
}
function allAnswersSubmitted() {
    for (let i = 1; i <= currQuiz.size; i++) {
        if (userAnswers[i] === undefined) {
            return false;
        }
    }
    return true;
}
function saveTimeStatistics() {
    if (cardNumber !== 0) {
        leftTime = currTime;
        userTimes[cardNumber] += (leftTime - enterTime);
        enterTime = currTime;
    }
}
function fillScoreTable() {
    let rows = "";
    for (let i = 1; i <= currQuiz.size; i++) {
        const correctAns = (userAnswers[i] === currQuiz.questions[i][1]);
        const fine = (correctAns ? 0 : currQuiz.questions[i][2]);
        const row = "<tr style=\"background-color:" + (correctAns ? " green" : "red") + "\">"
            + "<td>" + currQuiz.questions[i][0] + "</td>"
            + "<td>" + userAnswers[i] + "</td>"
            + "<td>" + userTimes[i] + "</td>"
            + "<td>" + fine + "s" + "</td>"
            + "</tr>";
        rows = rows + row;
        timeSpent += userTimes[i] + fine;
    }
    scoreTableBodyEl.innerHTML = rows;
    overallScoreEl.innerHTML = timeSpent.toString() + "s";
}
function resetVariables() {
    cardNumber = 0;
    userAnswers = [];
    userTimes = [];
    enterTime = 0;
    leftTime = 0;
    currTime = 0;
    timeSpent = 0;
}
function markBorderIfAnswerGiven() {
    if (userAnswers[cardNumber] !== undefined) {
        numberEl.style.border = "2px yellow solid";
    }
    else {
        numberEl.style.border = "2px grey solid";
    }
}
