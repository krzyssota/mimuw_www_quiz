
interface IQuestions {
    [index: number]: [string, string, number]; // index : questions, anwser, fine (in seconds)
};
interface IQuiz {
    introduction: string;
    questions: IQuestions;
};
let jsonQuiz_1: string = `{
    "introduction":"Welcome to my quiz",
    "questions":{
        "1": ["2+3", "5", 4],
        "2": ["2-(-24:4)", "8", 10],
        "3": ["2*5", "10", 10],
        "4": ["3:1", "3", 10]
    }
}`;

let quiz_1: IQuiz = JSON.parse(jsonQuiz_1);
console.log(quiz_1.introduction)
console.log(quiz_1.questions[2][0])

let card_numer = 1;

let ans_el = (<HTMLInputElement>document.getElementById("players_anwser"))
ans_el.addEventListener('input', (ev: InputEvent) => {
    if(ans_el.value === quiz_1.questions[card_numer][1]) {
        ans_el.style.backgroundColor = "rgb(55, 196, 55)"
    } else {
        ans_el.style.backgroundColor = "white";
    }
})