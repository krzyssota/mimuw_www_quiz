interface IQuestions {
    [index: number]: [string, string, number] // index : questions, Answer, fine (in seconds)
}
interface IQuiz {
    introduction: string
    questions: IQuestions
    size: number
}
let jsonQuiz1: string = `{
    "introduction": "Welcome to my quiz",
    "questions":{
        "1": ["10+2", "12", 4],
        "2": ["2-(-24:4)", "8", 10],
        "3": ["2*5", "10", 10],
        "4": ["3:1", "3", 10]
    },
    "size": "4"
}`

let introductionEl = document.getElementById("introduction") as HTMLParagraphElement
let questionEl = document.getElementById("question") as HTMLParagraphElement

let timerEl = document.getElementById("timer") as HTMLParagraphElement
let numberEl = document.getElementById("number") as HTMLParagraphElement

let submitAnswerEl = document.getElementById("submitAnswerButton") as HTMLButtonElement;
let submitQuizButtonEl = document.getElementById("submitQuizButton") as HTMLButtonElement
let prevButtonEl = document.getElementById("prevButton") as HTMLButtonElement
let nextButtonEl = document.getElementById("nextButton") as HTMLButtonElement

let inputEl = document.getElementById("playersAnswer") as HTMLInputElement;

// INIT
let currQuiz: IQuiz = JSON.parse(jsonQuiz1)
let cardNumber = 0
introductionEl.innerHTML = currQuiz.introduction
let userAnswers = {};


// TIMER
let nIntervId;
let timeSpent: number = 0;

function startTimer() {
  nIntervId = setInterval(() => {
    timeSpent++;
    timerEl.innerHTML = timeSpent + "s";
    }, 1000);
}

function stopTimer() {
  clearInterval(nIntervId);
}


// BUTTON NEXT
nextButtonEl.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()

    if(cardNumber < currQuiz.size) {
        cardNumber++
    }
    if(cardNumber === 1) { // first question card

        // hide introduction and display gameplay elements
        introductionEl.style.opacity = "0.1";
        timerEl.style.visibility = "visible";
        setQuizCardVisibility("visible")
        startTimer();
    }
    // display current question
    questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
    resetInput()
    // update question number
    setQuestionNumber();
})

// PREV BUTTON
prevButtonEl.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()

    if(cardNumber > 0) {
        cardNumber--
    }
    if(cardNumber === 0) {
        stopTimer();
        // show introduction and hide gameplay elements
        introductionEl.style.opacity = "1.0"

        setQuizCardVisibility("hidden")
    } else {
        // display current question
        questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
        resetInput()
    }
    setQuestionNumber();
})

// INPUT
submitAnswerEl.addEventListener('click', (ev: MouseEvent) => {
    if(inputEl.value !== "") {
        userAnswers[cardNumber] = inputEl.value;
    }
    if(allAnswersSubmitted()) {
        submitQuizButtonEl.removeAttribute("disabled")
    }
})

// SUBMIT
submitQuizButtonEl.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault()
    stopTimer();
    alert("konczymy")
    // todo tu skonczylem
})

// CANCEL BUTTON
function cancelQuiz() {
    alert("Cancelling session. Redirecting to the home page. Click \"OK\"");
    window.location.replace('start.html');
}


function resetInput() {
    (document.getElementById("playersAnswer") as HTMLInputElement).value = "";
}
function setQuestionNumber() {
    if(cardNumber !== 0) {
        numberEl.innerHTML = cardNumber.toString() + ". question";
    } else {
        numberEl.innerHTML = "";
    }
}

function setQuizCardVisibility(state: string) {
    questionEl.style.visibility = state
    inputEl.style.visibility = state
    numberEl.style.visibility = state
    submitAnswerEl.style.visibility = state
}

function allAnswersSubmitted() {
    for(let i = 1; i <= currQuiz.size; i++) {
        if(userAnswers[i] === undefined) {
            return false;
        }
    }
    return true;
}
