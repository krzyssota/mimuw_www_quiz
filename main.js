var jsonQuiz1 = "{\n    \"introduction\": \"Welcome to my quiz\",\n    \"questions\":{\n        \"1\": [\"10+2\", \"12\", 4],\n        \"2\": [\"2-(-24:4)\", \"8\", 10],\n        \"3\": [\"2*5\", \"10\", 10],\n        \"4\": [\"3:1\", \"3\", 10]\n    },\n    \"size\": \"4\"\n}";
var introductionEl = document.getElementById("introduction");
var questionEl = document.getElementById("question");
var timerEl = document.getElementById("timer");
var numberEl = document.getElementById("number");
var submitAnswerEl = document.getElementById("submitAnswerButton");
var submitQuizButtonEl = document.getElementById("submitQuizButton");
var prevButtonEl = document.getElementById("prevButton");
var nextButtonEl = document.getElementById("nextButton");
var inputEl = document.getElementById("playersAnswer");
// INIT
var currQuiz = JSON.parse(jsonQuiz1);
var cardNumber = 0;
introductionEl.innerHTML = currQuiz.introduction;
var userAnswers = {};
// TIMER
var nIntervId;
var timeSpent = 0;
function startTimer() {
    nIntervId = setInterval(function () {
        timeSpent++;
        timerEl.innerHTML = timeSpent + "s";
    }, 1000);
}
function stopTimer() {
    clearInterval(nIntervId);
}
// BUTTON NEXT
nextButtonEl.addEventListener('click', function (ev) {
    ev.preventDefault();
    if (cardNumber < currQuiz.size) {
        cardNumber++;
    }
    if (cardNumber === 1) { // first question card
        // hide introduction and display gameplay elements
        introductionEl.style.opacity = "0.1";
        timerEl.style.visibility = "visible";
        setQuizCardVisibility("visible");
        startTimer();
    }
    // display current question
    questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
    resetInput();
    // update question number
    setQuestionNumber();
});
// PREV BUTTON
prevButtonEl.addEventListener('click', function (ev) {
    ev.preventDefault();
    if (cardNumber > 0) {
        cardNumber--;
    }
    if (cardNumber === 0) {
        stopTimer();
        // show introduction and hide gameplay elements
        introductionEl.style.opacity = "1.0";
        setQuizCardVisibility("hidden");
    }
    else {
        // display current question
        questionEl.innerHTML = currQuiz.questions[cardNumber][0] + " = ";
        resetInput();
    }
    setQuestionNumber();
});
// INPUT
submitAnswerEl.addEventListener('click', function (ev) {
    console.log("jestem w listenerze submit answer");
    if (inputEl.value !== "") {
        userAnswers[cardNumber] = inputEl.value;
        console.log("input niepusty");
    }
    if (allAnswersSubmitted()) {
        console.log("odblokowuje");
        submitQuizButtonEl.removeAttribute("disabled");
    }
});
// SUBMIT
submitQuizButtonEl.addEventListener('click', function (ev) {
    ev.preventDefault();
    stopTimer();
    alert("konczymy");
    // todo tu skonczylem
});
// CANCEL BUTTON
function cancelQuiz() {
    alert("Cancelling session. Redirecting to the home page. Click \"OK\"");
    window.location.replace('start.html');
}
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
function setQuizCardVisibility(state) {
    questionEl.style.visibility = state;
    inputEl.style.visibility = state;
    numberEl.style.visibility = state;
    submitAnswerEl.style.visibility = state;
}
function allAnswersSubmitted() {
    for (var i = 1; i <= currQuiz.size; i++) {
        if (userAnswers[i] === undefined) {
            return false;
        }
    }
    return true;
}
