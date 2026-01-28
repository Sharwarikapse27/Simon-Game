let gameSeq = [];
let userSeq = [];
let btns = ["red", "green", "yellow", "blue"];

let started = false;
let level = 0;
let highest = localStorage.getItem("highScore") || 0;

const levelText = document.getElementById("level-text");
const highScoreText = document.getElementById("high-score");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");

// NEW: Restart button
const restartBtn = document.getElementById("restart-btn");

highScoreText.innerText = `High Score: ${highest}`;

/* START GAME */
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");
  restartBtn.classList.add("hidden"); // hide restart button if visible
  startGame();
});

/* RESTART GAME */
restartBtn.addEventListener("click", () => {
  restartBtn.classList.add("hidden");
  startGame();
});

function startGame() {
  started = true;
  level = 0;
  gameSeq = [];
  levelUp();
}

/* GAME LOGIC */
function levelUp() {
  userSeq = [];
  level++;
  levelText.innerText = `Level ${level}`;

  let randColor = btns[Math.floor(Math.random() * 4)];
  gameSeq.push(randColor);

  let btn = document.getElementById(randColor);
  setTimeout(() => gameFlash(btn), 400);
}

function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 150);
}

function checkAnswer(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 800);
    }
  } else {
    gameOver();
  }
}

/* GAME OVER */
function gameOver() {
  if (level - 1 > highest) {
    highest = level - 1;
    localStorage.setItem("highScore", highest);
  }

  levelText.innerHTML = `💀 Game Over<br>Score: ${level - 1}`;
  highScoreText.innerText = `High Score: ${highest}`;
  started = false;

  // SHOW RESTART BUTTON
  restartBtn.classList.remove("hidden");
}

/* BUTTON CLICKS */
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function () {
    if (!started) return;

    let color = this.id;
    userSeq.push(color);
    userFlash(this);
    checkAnswer(userSeq.length - 1);
  });
});

/* SECRET DEV RESET (T key) */
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t") {
    localStorage.setItem("highScore", 0);
    highest = 0;
    highScoreText.innerText = `High Score: 0`;
    console.log("High score reset 👀");
  }
});
