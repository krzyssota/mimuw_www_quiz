var jsonQuiz1 = "{\n    \"introduction\": \"Welcome to the first quiz. Baba jajko Baba jajko Baba jajko Baba jajko Baba jajko Baba jajko \",\n    \"questions\":{\n        \"1\": [\"10+2\", \"12\", 4],\n        \"2\": [\"2-(-24:4)\", \"8\", 10],\n        \"3\": [\"2*5\", \"10\", 10],\n        \"4\": [\"3:1\", \"3\", 10]\n    },\n    \"size\": \"4\"\n}";
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
var userTimes = {};
for (var i = 1; i <= currQuiz.size; i++) {
    userTimes[i] = 0;
}
var enterTime = 0;
var leftTime = 0;
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
    console.log("halo");
    ev.preventDefault();
    saveTimeStatistics();
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
    saveTimeStatistics();
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
// SUBMIT ANSWER
submitAnswerEl.addEventListener('click', function (ev) {
    if (inputEl.value !== "") {
        userAnswers[cardNumber] = inputEl.value;
    }
    if (allAnswersSubmitted()) {
        submitQuizButtonEl.removeAttribute("disabled");
    }
});
// SUBMIT QUIZ
submitQuizButtonEl.addEventListener('click', function (ev) {
    ev.preventDefault();
    stopTimer();
    var scoreWrapperEl = document.getElementById("scoreWrapper");
    scoreWrapperEl.setAttribute("style", "visibility: visible");
    fillScoreTable();
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
// INDEX DB
/* if (!window.indexedDB) {
    console.log("Your browser doesn't support a stable version of IndexedDB. Such and such feature will not be available.");
}
var db = window.indexedDB.open("QuizDatabase");
  db.onerror = (event) => {
    // Generic error handler for all errors targeted at this database's
    // requests!
    console.error("Database error: " + event.target.errorCode);
  }; */
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
function saveTimeStatistics() {
    if (cardNumber !== 0) {
        leftTime = timeSpent;
        userTimes[cardNumber] += (leftTime - enterTime);
        enterTime = timeSpent;
    }
}
function fillScoreTable() {
    var rows = "";
    var timeSummary = 0;
    for (var i = 1; i <= currQuiz.size; i++) {
        var correctAns = (userAnswers[i] === currQuiz.questions[i][1]);
        var fine = (correctAns ? 0 : currQuiz.questions[i][2]);
        var row = "<tr style=\"background-color:" + (correctAns ? " green" : "red") + "\">"
            + "<td>" + currQuiz.questions[i][0] + "</td>"
            + "<td>" + userAnswers[i] + "</td>"
            + "<td>" + userTimes[i] + "</td>"
            + "<td>" + fine + "s" + "</td>"
            + "</tr>";
        rows = rows + row;
        timeSummary += userTimes[i] + fine;
    }
    document.getElementById("scoreTableBody").innerHTML = rows;
    document.getElementById("overallScore").innerHTML = timeSummary.toString();
}
