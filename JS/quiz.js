let questionCount = document.querySelector(".right span");
let points = document.querySelector(".points");
let infoQuestion = document.querySelector(".info-question");
let submitBottun = document.querySelector(".submit-bottun");
let result = document.querySelector(".result");
let box = document.querySelector(".box");
let container = document.querySelector(".container");
let showTime = document.querySelector(".time");

let currentIndex = 0;
let rightAnswers = 0;
let countDownInterval;
let durationTime = 150;
// Get Question Form JSON Fill

function getQuestion() {
  let myRequest = new XMLHttpRequest();

  myRequest.onreadystatechange = function () {
    if (this.readyState === 4 && this.status === 200) {
      let getResponseText = JSON.parse(this.responseText);
      let questionCounts = getResponseText.length;
      count(questionCounts);
      addDataToPage(getResponseText[currentIndex], questionCounts);
      countDown(durationTime, questionCounts);
      
      addToPageDiv(currentIndex ,questionCounts);
      submitBottun.onclick = function () {
        let rightAnswer = getResponseText[currentIndex].right_answer;
        currentIndex++;
        chackRightAnswer(rightAnswer, questionCounts);
     
        // Count Down
        clearInterval(countDownInterval);
        countDown(durationTime, questionCounts);

        // Remove Question
        infoQuestion.innerHTML = "";
        addDataToPage(getResponseText[currentIndex], questionCounts);
        handlePoints();
        showResulte(questionCounts);
      };
    }
  };
  myRequest.open("GET", "JS/quiz.answer.json", true);
  myRequest.send();
}
getQuestion();

// Count Question

function count(num) {
  questionCount.innerHTML = num;
  for (let i = 0; i < num; i++) {
    let createSpan = document.createElement("span");
    points.appendChild(createSpan);
    if (i == 0) {
      createSpan.classList = "active";
    }
  }
}

// Add To Page

function addDataToPage(obj, count) {
  if (currentIndex < count) {
    let head = document.createElement("h2");
    let question = document.createTextNode(obj.title);
    head.appendChild(question);
    infoQuestion.appendChild(head);

    // create Answers
    for (let i = 0; i <= 3; i++) {
      let answerDiv = document.createElement("div");
      answerDiv.classList = "answer";
      infoQuestion.appendChild(answerDiv);

      let input = document.createElement("input");

      // Add name, type, data-attri, id
      input.setAttribute("name", "answer");
      input.setAttribute("type", "radio");
      input.setAttribute("id", `answer_${i + 1}`);
      input.setAttribute("data-answer", obj[`answer_${i + 1}`]);
      answerDiv.appendChild(input);
      // create label
      let label = document.createElement("label");
      label.setAttribute("for", `answer_${i + 1}`);

      let textLabel = document.createTextNode(obj[`answer_${i + 1}`]);
      if (i === 0) {
        input.checked = true;
      }
      label.appendChild(textLabel);

      answerDiv.appendChild(label);
    }
  }
}

// Chack Right Answer
function chackRightAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("answer");
  let chackAnswer;
  for (let i = 0; i < answers.length; i++) {
    if (answers[i].checked) {
      chackAnswer = answers[i].dataset.answer;
    }
  }
  if (chackAnswer === rightAnswer) {
    rightAnswers++;
  }
}

//  Handle Points

function handlePoints() {
  let points = document.querySelectorAll(".points span");
  let arrayPoints = Array.from(points);
  arrayPoints.forEach((span, index) => {
    if (currentIndex == index) {
      span.classList = "active";
    }
  });
}
// #########
function addToPageDiv(currentIndex, count) { 
  currentIndex++;
  let resulteDiv = document.createElement("div");
  resulteDiv.classList = "result";
  let resultSpan = document.createElement("span");
  resulteDiv.appendChild(resultSpan);
  box.prepend(resulteDiv);
  let text = document.createTextNode("Perfict");
  resultSpan.appendChild(text);
  let textDiv = document.createTextNode(`You Answered ${currentIndex} From ${count}`);
  resulteDiv.appendChild(textDiv);
 }


function showResulte(index) {
  let resultShow;
  if (currentIndex === index) {
    infoQuestion.remove();
    submitBottun.remove();
    points.remove();
    box.remove();

    if (rightAnswers > index / 2 && rightAnswers < index) {
      resultShow = `It Is Bad ${rightAnswers} form ${index}`;
    } else if (rightAnswers === index) {
      resultShow = `It Is Good ${rightAnswers} form ${index}`;
    } else {
      resultShow = `It Is Bad ${rightAnswers} form ${index}`;
    }

    container.innerHTML = resultShow;
  }
}

// Count Down

function countDown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countDownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
      seconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

      showTime.innerHTML = `${minutes}:${seconds}`;
      if (--duration < 0) {
        clearInterval(countDownInterval);
        submitBottun.onclick();
      }
    }, 1000);
  }
}
