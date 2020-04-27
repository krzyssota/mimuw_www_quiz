
interface IQuestions {
    [index: number]: [string, string, number]; // index : questions, anwser, fine (in seconds)
};
interface IQuiz {
    introduction: string;
    questions: IQuestions;
    size: number;
};
let jsonQuiz_1: string = `{
    "introduction": "Welcome to my quiz",
    "questions":{
        "1": ["10+2", "12", 4],
        "2": ["2-(-24:4)", "8", 10],
        "3": ["2*5", "10", 10],
        "4": ["3:1", "3", 10]
    },
    "size": "4"
}`;

let curr_quiz: IQuiz = JSON.parse(jsonQuiz_1);

let introduction_el = (<HTMLInputElement>document.getElementById("introduction"));
let your_anwser_label = (<HTMLInputElement>document.getElementById("your_anwser_label"));
let question_el = (<HTMLInputElement>document.getElementById("question"));

introduction_el.innerHTML = "Introduction: " + "<br>" + curr_quiz.introduction;

let card_number = 0;

let players_anwser_el = (<HTMLInputElement>document.getElementById("players_anwser"))
players_anwser_el.addEventListener('input', (ev: InputEvent) => { // TODO zmienić to na przycisk submit anwser ktory koloruje pole
    if(players_anwser_el.value === curr_quiz.questions[card_number][1]) {
        players_anwser_el.style.backgroundColor = "rgb(55, 196, 55)"
    } else {
        players_anwser_el.style.backgroundColor = "red";
    }
})

let button_prev_el = (<HTMLInputElement>document.getElementById("prev_button"))
button_prev_el.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault();

    if(card_number > 0) {
        card_number--;
    }
    let question_el = (<HTMLInputElement>document.getElementById("question"));
    if(card_number == 0) {
        // hide question number
        introduction_el.style.visibility = "visible";

        question_el.style.visibility = "hidden";
        players_anwser_el.style.visibility = "hidden";
    } else {
        question_el.style.visibility = "visible";
        question_el.innerHTML = curr_quiz.questions[card_number][0] + " = ";

        // reset input text value
        (<HTMLFormElement>document.querySelector(".quiz_card > form:nth-child(1)")).reset();
        players_anwser_el.style.backgroundColor = "white";
    }
})

let button_next_el = (<HTMLInputElement>document.getElementById("next_button"))
button_next_el.addEventListener('click', (ev: MouseEvent) => {
    ev.preventDefault();

    if(card_number < curr_quiz.size) {
        card_number++;
    }
    if(card_number == 1) {
        // start the clock
        // display question number
    
        introduction_el.style.visibility = "hidden";
        players_anwser_el.style.visibility = "visible";
        question_el.style.visibility = "visible";
    }
    question_el.innerHTML = curr_quiz.questions[card_number][0] + " = ";
    // reset input text value
    (<HTMLFormElement>document.querySelector(".quiz_card > form:nth-child(1)")).reset();
    players_anwser_el.style.backgroundColor = "white";

})
