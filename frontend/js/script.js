let currentQuestion = 0;
let score = 0;
let timer;
let timeLeft = 30;
let selectedQuestions = [];
let userAnswers = [];

/* =========================
   START QUIZ
========================= */

function startQuiz() {

    const username =
        document.getElementById("username").value.trim();

    const category =
        document.getElementById("category").value;

    if (username === "") {
        alert("Please enter your name");
        return;
    }

    if (category === "") {
        alert("Please select a category");
        return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("category", category);

    window.location.href = "quiz.html";
}

const category = localStorage.getItem("category");
async function loadQuestionsFromJSON() {

    let fileName = "";

    switch(category) {

        case "Java":
            fileName = "data/java_questions.json";
            break;

        case "Python":
            fileName = "data/python_questions.json";
            break;

        case "C Programming":
            fileName = "data/c_questions.json";
            break;

        case "Aptitude":
            fileName = "data/aptitude_questions.json";
            break;
    }

    const response = await fetch(fileName);

if (!response.ok) {
    throw new Error(
        "Failed to load " + fileName
    );
}

const questions =
    await response.json();

    const shuffled =
        [...questions].sort(() => Math.random() - 0.5);

    selectedQuestions =
        shuffled.slice(0, 10);

    loadQuestion();
}

/* =========================
   QUESTIONS
========================= */


/* =========================
   LOAD QUESTION
========================= */

function loadQuestion() {

    if (
        !selectedQuestions ||
        selectedQuestions.length === 0
    ) {
        console.log("No questions loaded");
        return;
    }

    const questionData =
        selectedQuestions[currentQuestion];

    document.getElementById("categoryTitle").innerText =
        category + " Quiz";

    document.getElementById("questionCounter").innerText =
        `Question ${currentQuestion + 1} of ${selectedQuestions.length}`;

    const progress =
        ((currentQuestion + 1) / selectedQuestions.length) * 100;

    document.getElementById("progressBar").style.width =
        progress + "%";

    document.getElementById("question").innerText =
        questionData.question;

    const optionsDiv =
        document.getElementById("options");

    optionsDiv.innerHTML = "";

    questionData.options.forEach((option, index) => {

        optionsDiv.innerHTML += `
        <div class="option">
            <input type="radio" name="answer" value="${index}">
            ${option}
        </div>
        `;
    });

    startTimer();
}

function startTimer() {

    clearInterval(timer);

    timeLeft = 30;

    document.getElementById("timer").innerText =
        timeLeft;

    timer = setInterval(() => {

        timeLeft--;

        document.getElementById("timer").innerText =
            timeLeft;

        if (timeLeft === 0) {

    alert(
        "Time's up! Please answer before proceeding."
    );

    clearInterval(timer);

    document.getElementById("timer").innerText =
        "0";
}

    }, 1000);
}

function nextQuestion() {

    const selected =
        document.querySelector(
            'input[name="answer"]:checked'
        );

    if (!selected) {

        alert(
            "Please select an answer before moving to the next question."
        );

        return;
    }

    clearInterval(timer);

    const answer =
    parseInt(selected.value);

userAnswers.push(answer);

if (
    answer ===
    selectedQuestions[currentQuestion].answer
) {

    score++;
}

    currentQuestion++;

    if (
        currentQuestion <
        selectedQuestions.length
    ) {

        loadQuestion();
    }
    else {

    localStorage.setItem(
        "score",
        score
    );

    localStorage.setItem(
        "total",
        selectedQuestions.length
    );

    localStorage.setItem(
        "userAnswers",
        JSON.stringify(userAnswers)
    );

    localStorage.setItem(
        "reviewQuestions",
        JSON.stringify(selectedQuestions)
    );

    window.location.href =
        "result.html";
}
}

if (
    window.location.pathname.includes("quiz.html")
) {
    loadQuestionsFromJSON();
}

/* Existing Result + Leaderboard code remains below */

/* =========================
   RESULT PAGE
========================= */

function loadResult() {

    const username = localStorage.getItem("username");
    const categoryName = localStorage.getItem("category");

    const score = parseInt(
        localStorage.getItem("score")
    );

    const total = parseInt(
        localStorage.getItem("total")
    );

    const percentage =
        Math.round((score / total) * 100);

    document.getElementById("userName").innerText =
        "Name: " + username;

    document.getElementById("categoryName").innerText =
        "Category: " + categoryName;

    document.getElementById("scoreText").innerText =
        "Score: " + score + " / " + total;

    document.getElementById("percentageText").innerText =
        "Percentage: " + percentage + "%";

    let message = "";

    if (percentage >= 80) {
        message = "Excellent Performance 🔥";
    }
    else if (percentage >= 60) {
        message = "Good Job 👍";
    }
    else if (percentage >= 40) {
        message = "Keep Practicing 📚";
    }
    else {
        message = "Need More Practice 💪";
    }

    document.getElementById("message").innerText =
        message;

    if (score === total) {

    document.getElementById(
        "certificateBtn"
    ).style.display = "inline-block";
}
    
    saveScore(username, score);
}

function saveScore(username, score) {

    let leaderboard =
        JSON.parse(
            localStorage.getItem("leaderboard")
        ) || [];

    leaderboard.push({
        username: username,
        score: score
    });

    leaderboard.sort(
        (a, b) => b.score - a.score
    );

    localStorage.setItem(
        "leaderboard",
        JSON.stringify(leaderboard)
    );
}

function goToLeaderboard() {

    window.location.href =
        "leaderboard.html";
}

if (
    window.location.pathname.includes(
        "result.html"
    )
) {
    loadResult();
}

/* =========================
   LEADERBOARD PAGE
========================= */

function loadLeaderboard() {

    const leaderboard =
        JSON.parse(
            localStorage.getItem("leaderboard")
        ) || [];

    const tbody =
        document.getElementById(
            "leaderboardBody"
        );

    if (!tbody) return;

    tbody.innerHTML = "";

    leaderboard.forEach(
        (player, index) => {

            tbody.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${player.username}</td>
                <td>${player.score}</td>
            </tr>
            `;
        }
    );
}

function playAgain() {

    window.location.href =
        "index.html";
}

if (
    window.location.pathname.includes(
        "leaderboard.html"
    )
) {
    loadLeaderboard();
}

function generateCertificate() {

    window.location.href =
        "certificate.html";
}

function reviewAnswers() {

    window.location.href =
        "review.html";
}

function loadReview() {

    const reviewQuestions =
        JSON.parse(
            localStorage.getItem(
                "reviewQuestions"
            )
        );

    const userAnswers =
        JSON.parse(
            localStorage.getItem(
                "userAnswers"
            )
        );

        if (!reviewQuestions || !userAnswers) {

    document.getElementById(
        "reviewContainer"
    ).innerHTML =
    "<h2>No quiz data found.</h2>";

    return;
}

    const container =
        document.getElementById(
            "reviewContainer"
        );

    if (!container) return;

    container.innerHTML = "";

    reviewQuestions.forEach(
        (question,index) => {

            const userAnswer =
                question.options[
                    userAnswers[index]
                ];

            const correctAnswer =
                question.options[
                    question.answer
                ];

            const isCorrect =
                userAnswers[index] ===
                question.answer;

            container.innerHTML += `

            <div class="review-box">

                <h3>
                    Q${index+1}.
                    ${question.question}
                </h3>

                <p>
                    Your Answer:
                    <strong
                    style="color:${
                        isCorrect
                        ? 'lime'
                        : 'red'
                    }">
                    ${userAnswer}
                    </strong>
                </p>

                <p>
                    Correct Answer:
                    <strong
                    style="color:lime">
                    ${correctAnswer}
                    </strong>
                </p>

                <hr>

            </div>
            `;
        }
    );
}

if (
    window.location.pathname.includes(
        "review.html"
    )
) {
    loadReview();
}