import { addToDatabase, diplayDataByIndex } from './dbModule.js';
import {
    introductionEl, questionEl, timerEl, submitAnswerButtonEl, submitQuizButtonEl,
    prevButtonEl, nextButtonEl, saveScoreButtonEl, saveScoreAndStatisticsButtonEl, inputEl,
    startquizButtonEl, scoreWrapperEl, startWrapperEl, cardWrapperEl, cancelQuizButtonEl,
    bestScoresTableBodyEl, scoreTableBodyEl, numberEl, overallScoreEl
} from "./htmlElements.js"

interface IQuestions {
    [index: number]: [string, string, number] // question number -> (questions, answer, fine)
}
interface IQuiz {
    introduction: string
    questions: IQuestions
    size: number // number of questions in the quiz
}
const jsonQuiz1: string = `{
    "introduction": "Hope you will enjoy this quiz. All answers are integrals. Answered questions will be signalled with yellow border around question number.",
    "questions":{
        "1": ["10+2", "12", 4],
        "2": ["2-(-24:4)", "8", 30],
        "3": ["2*5", "10", 20],
        "4": ["3-5", "-2", 10]
    },
    "size": "4"
}`
// GLOBAL VARIABLES AND INIT
const currQuiz: IQuiz = JSON.parse(jsonQuiz1)
let cardNumber: number;
let userAnswers: string[];
let userTimes: number[];
let enterTime: number;
let leftTime: number;
let nIntervId: any;
let currTime: number;
let timeSpent: number;

resetVariables();
diplayDataByIndex(bestScoresTableBodyEl);

// TIMER
function startTimer(): void {
    nIntervId = setInterval(() => {
        currTime++;
        timerEl.innerHTML = currTime + "s";
    }, 1000);
}

function stopTimer(): void {
    clearInterval(nIntervId);
}

// START QUIZ
startquizButtonEl.addEventListener('click', (ev: MouseEvent) => {
    // display introduction card
    introductionEl.innerHTML = currQuiz.introduction
    introductionEl.style.opacity = "1.0";
    startWrapperEl.style.visibility = "hidden";
    cardWrapperEl.style.visibility = "visible";
})

// NEXT QUESTION
nextButtonEl.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()
    saveTimeStatistics();

    if (cardNumber < currQuiz.size) {
        cardNumber++
    }
    if (cardNumber === 1) {
        // hide introduction and display gameplay elements
        introductionEl.style.opacity = "0.1";
        timerEl.style.visibility = "visible";
        setQuizCardElementsVisibility("visible")
        startTimer();
    }
    // display current question
    questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
    resetInput()
    // update question number
    displayQuestionNumber();
    // mark if question was already answered
    markBorderIfAnswerGiven();
})

// PREVIOUS QUESTION
prevButtonEl.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()
    saveTimeStatistics();

    if (cardNumber > 0) {
        cardNumber--
    }
    if (cardNumber === 0) {
        stopTimer();
        // show introduction and hide gameplay elements
        introductionEl.style.opacity = "1.0"
        setQuizCardElementsVisibility("hidden")
    } else {
        // display current question
        questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
        resetInput()
        // mark if the answer was already given
        markBorderIfAnswerGiven();
    }
    // update question number
    displayQuestionNumber();
})

// SUBMIT ANSWER
submitAnswerButtonEl.addEventListener('click', (ev: MouseEvent) => {
    if (inputEl.value !== "") {
        userAnswers[cardNumber] = inputEl.value;
    }
    if (allAnswersSubmitted()) {
        submitQuizButtonEl.removeAttribute("disabled")
    }
    markBorderIfAnswerGiven();
})

// CANCEL QUIZ SESSION
cancelQuizButtonEl.addEventListener('click', (ev: MouseEvent) => {
    alert("Cancelling session. Redirecting to the home page. Click \"OK\"");
    cardWrapperEl.style.visibility = "hidden";
    setQuizCardElementsVisibility("hidden");
    timerEl.style.visibility = "hidden";
    startWrapperEl.style.visibility = "visible";
    resetVariables();
})

// SUBMIT QUIZ
submitQuizButtonEl.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()
    stopTimer();
    // hide gameplay, display summary
    scoreWrapperEl.style.visibility = "visible";
    cardWrapperEl.style.visibility = "hidden";
    timerEl.style.visibility = "hidden";
    setQuizCardElementsVisibility("hidden");

    fillScoreTable();
})

// SAVE SCORE
saveScoreButtonEl.addEventListener('click', (ev: MouseEvent) => {
    // save to database
    const score: number = timeSpent;
    const statistics: number[] = [];
    addToDatabase(score, statistics);
    // hide summary, display home page
    scoreWrapperEl.style.visibility = "hidden";
    startWrapperEl.style.visibility = "visible";
    diplayDataByIndex(bestScoresTableBodyEl);
    resetVariables();
})

// SAVE SCORE AND STATISTICS
saveScoreAndStatisticsButtonEl.addEventListener('click', (ev: MouseEvent) => {
    // save to database
    const score: number = timeSpent;
    const statistics: number[] = userTimes;
    addToDatabase(score, statistics);
    // hide summary, display home page
    scoreWrapperEl.style.visibility = "hidden";
    startWrapperEl.style.visibility = "visible";
    diplayDataByIndex(bestScoresTableBodyEl);
    resetVariables();
})

// clear player's answer input field
function resetInput() {
    (document.getElementById("playersAnswer") as HTMLInputElement).value = "";
}

function displayQuestionNumber() {
    if (cardNumber !== 0) {
        numberEl.innerHTML = cardNumber.toString() + ". question";
    } else {
        numberEl.innerHTML = "";
    }
}

function setQuizCardElementsVisibility(state: string) {
    questionEl.style.visibility = state
    inputEl.style.visibility = state
    numberEl.style.visibility = state
    submitAnswerButtonEl.style.visibility = state
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
        const timeOnQuestion: number = leftTime - enterTime;
        userTimes[cardNumber] = userTimes[cardNumber] + +timeOnQuestion;
        enterTime = currTime;
    }
}

// prepare score table for summary
function fillScoreTable(): void {
    let rows: string = "";

    for (let i = 1; i <= currQuiz.size; i++) {
        const correctAns: boolean = (userAnswers[i] === currQuiz.questions[i][1]);
        const fine: number = (correctAns ? 0 : currQuiz.questions[i][2])

        const row = "<tr style=\"background-color:" + (correctAns ? " green" : "red") + "\">"
            + "<td>" + currQuiz.questions[i][0] + "</td>"
            + "<td>" + userAnswers[i] + "</td>"
            + "<td>" + userTimes[i] + "</td>"
            + "<td>" + fine + "</td>"
            + "</tr>"

        rows = rows + row;
        timeSpent += +userTimes[i] + +fine;
    }
    scoreTableBodyEl.innerHTML = rows;
    overallScoreEl.innerHTML = timeSpent.toString();
}

function resetVariables() {
    cardNumber = 0
    userAnswers = [];
    userTimes = [];
    for(let i: number = 1; i <= currQuiz.size; i++) {
        userTimes[i] = 0;
    }
    enterTime = 0;
    leftTime = 0;
    currTime = 0;
    timeSpent = 0;
}

function markBorderIfAnswerGiven() {
    if (userAnswers[cardNumber] !== undefined) {
        numberEl.style.border = "2px yellow solid";
    } else {
        numberEl.style.border = "2px grey solid";
    }
}