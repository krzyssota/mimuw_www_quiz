;
;
var jsonQuiz_1 = "{\n    \"introduction\":\"Welcome to my quiz\",\n    \"questions\":{\n        \"1\": [\"2+3\", \"5\", 4],\n        \"2\": [\"2-(-24:4)\", \"8\", 10],\n        \"3\": [\"2*5\", \"10\", 10],\n        \"4\": [\"3:1\", \"3\", 10]\n    }\n}";
var quiz_1 = JSON.parse(jsonQuiz_1);
console.log(quiz_1.introduction);
console.log(quiz_1.questions[2][0]);
var card_numer = 1;
var ans_el = document.getElementById("players_anwser");
ans_el.addEventListener('input', function (ev) {
    if (ans_el.value === quiz_1.questions[card_numer][1]) {
        ans_el.style.backgroundColor = "rgb(55, 196, 55)";
    }
    else {
        ans_el.style.backgroundColor = "white";
    }
});
