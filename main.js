;
;
var jsonQuiz_1 = "{\n    \"introduction\": \"Welcome to my quiz\",\n    \"questions\":{\n        \"1\": [\"10+2\", \"12\", 4],\n        \"2\": [\"2-(-24:4)\", \"8\", 10],\n        \"3\": [\"2*5\", \"10\", 10],\n        \"4\": [\"3:1\", \"3\", 10]\n    },\n    \"size\": \"4\"\n}";
var curr_quiz = JSON.parse(jsonQuiz_1);
var introduction_el = document.getElementById("introduction");
var your_anwser_label = document.getElementById("your_anwser_label");
var question_el = document.getElementById("question");
introduction_el.innerHTML = "Introduction: " + "<br>" + curr_quiz.introduction;
var card_number = 0;
var players_anwser_el = document.getElementById("players_anwser");
players_anwser_el.addEventListener('input', function (ev) {
    if (players_anwser_el.value === curr_quiz.questions[card_number][1]) {
        players_anwser_el.style.backgroundColor = "rgb(55, 196, 55)";
    }
    else {
        players_anwser_el.style.backgroundColor = "red";
    }
});
var button_prev_el = document.getElementById("prev_button");
button_prev_el.addEventListener('click', function (ev) {
    ev.preventDefault();
    if (card_number > 0) {
        card_number--;
    }
    var question_el = document.getElementById("question");
    if (card_number == 0) {
        // hide question number
        introduction_el.style.visibility = "visible";
        question_el.style.visibility = "hidden";
        players_anwser_el.style.visibility = "hidden";
    }
    else {
        question_el.style.visibility = "visible";
        question_el.innerHTML = curr_quiz.questions[card_number][0] + " = ";
        // reset input text value
        document.querySelector(".quiz_card > form:nth-child(1)").reset();
        players_anwser_el.style.backgroundColor = "white";
    }
});
var button_next_el = document.getElementById("next_button");
button_next_el.addEventListener('click', function (ev) {
    ev.preventDefault();
    if (card_number < curr_quiz.size) {
        card_number++;
    }
    if (card_number == 1) {
        // start the clock
        // display question number
        introduction_el.style.visibility = "hidden";
        players_anwser_el.style.visibility = "visible";
        question_el.style.visibility = "visible";
    }
    question_el.innerHTML = curr_quiz.questions[card_number][0] + " = ";
    // reset input text value
    document.querySelector(".quiz_card > form:nth-child(1)").reset();
    players_anwser_el.style.backgroundColor = "white";
});
