/* ================= VARIABLES ================= */
let gameSeq = [];
let userSeq = [];
let started = false;
let level = 0;
let difficulty = "easy";

// Level-wise buttons
const levelConfig = {
  easy: ["red", "green", "yellow", "blue"],
  medium: ["red", "green", "yellow", "blue", "purple"],
  hard: ["red", "green", "yellow", "blue", "purple", "orange"]
};

let btns = levelConfig.easy;

// High score per difficulty
let highScores = {
  easy: parseInt(localStorage.getItem("hs_easy")) || 0,
  medium: parseInt(localStorage.getItem("hs_medium")) || 0,
  hard: parseInt(localStorage.getItem("hs_hard")) || 0
};

/* ================= ELEMENTS ================= */
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const homeBtn = document.getElementById("home-btn");


const levelText = document.getElementById("level-text");
const highScoreText = document.getElementById("high-score");

const levelPopup = document.getElementById("level-popup");
const overlay = document.getElementById("overlay");
const easyBtn = document.getElementById("easy-btn");
const mediumBtn = document.getElementById("medium-btn");
const hardBtn = document.getElementById("hard-btn");
const goHomeLink = document.getElementById("go-home-link");


const gameBoard = document.querySelector(".game-board");

highScoreText.innerText = `High Score: ${highScores[difficulty]}`;

let levelChosen = false;

goHomeLink.onclick = () => {
  // Close popup smoothly
  levelPopup.classList.remove("active");
  overlay.classList.remove("active");

  setTimeout(() => {
    levelPopup.classList.add("hidden");
    overlay.classList.add("hidden");
  }, 300);

  // Reuse existing home logic
  homeBtn.onclick();
};

/* ================= START BUTTON ================= */
startBtn.addEventListener("click", () => {
  startScreen.classList.add("hidden");
  gameScreen.classList.remove("hidden");

  if (!levelChosen) {
    overlay.classList.remove("hidden");
    setTimeout(() => overlay.classList.add("active"), 10);

    levelPopup.classList.remove("hidden");
    setTimeout(() => levelPopup.classList.add("active"), 10);
  } else {
    startGame();
  }
});


/* ================= LAYOUT RESET ================= */
function resetLayoutClasses() {
  gameBoard.classList.remove("square-layout", "circular-layout");

  ["red","green","yellow","blue","purple","orange"].forEach(id => {
    const btn = document.getElementById(id);
    btn.classList.remove(
      "center","center1","center2",
      "left1","left2","right1","right2"
    );
  });
}

/* ================= LEVEL SELECTION ================= */
easyBtn.onclick = () => selectLevel("easy");
mediumBtn.onclick = () => selectLevel("medium");
hardBtn.onclick = () => selectLevel("hard");

function selectLevel(levelName) {
  difficulty = levelName;
  btns = levelConfig[levelName];
  levelChosen = true;

  resetLayoutClasses();

  // Easy
  if (levelName === "easy") {
    gameBoard.classList.add("square-layout");
    document.getElementById("red").classList.add("left1");
    document.getElementById("green").classList.add("left2");
    document.getElementById("yellow").classList.add("right1");
    document.getElementById("blue").classList.add("right2");
  }
  // Medium
  else if (levelName === "medium") {
    gameBoard.classList.add("circular-layout");
    document.getElementById("red").classList.add("center");
    document.getElementById("green").classList.add("left1");
    document.getElementById("yellow").classList.add("left2");
    document.getElementById("blue").classList.add("right1");
    document.getElementById("purple").classList.add("right2");
  }
  // Hard
  else if (levelName === "hard") {
    gameBoard.classList.add("circular-layout");
    document.getElementById("red").classList.add("center1");
    document.getElementById("green").classList.add("left1");
    document.getElementById("yellow").classList.add("left2");
    document.getElementById("blue").classList.add("right1");
    document.getElementById("purple").classList.add("right2");
    document.getElementById("orange").classList.add("center2");
  }

  // Show only active buttons
  document.querySelectorAll(".btn").forEach(btn => {
    if (btns.includes(btn.id)) btn.classList.remove("hidden");
    else btn.classList.add("hidden");
  });

  


  highScoreText.innerText = `High Score: ${highScores[difficulty]}`;

  levelPopup.classList.remove("active");
  overlay.classList.remove("active");

  setTimeout(() => {
    levelPopup.classList.add("hidden");
    overlay.classList.add("hidden");
    startGame();
  }, 350);

}

/* ================= START GAME ================= */
function startGame() {
  started = true;
  level = 0;
  gameSeq = [];
  userSeq = [];
  homeBtn.classList.add("hidden");   // 👈 important
  restartBtn.classList.add("hidden");
  levelUp();
}


/* ================= GAME LOGIC ================= */
function levelUp() {
  userSeq = [];
  level++;
  levelText.innerText = `Level ${level}`;

  const randColor = btns[Math.floor(Math.random() * btns.length)];
  gameSeq.push(randColor);

  playSequence(0);
}

function playSequence(i) {
  if (i >= gameSeq.length) return;
  const btn = document.getElementById(gameSeq[i]);
  gameFlash(btn);
  setTimeout(() => playSequence(i + 1), 600);
}

/* ================= FLASH EFFECTS ================= */
function gameFlash(btn) {
  btn.classList.add("flash");
  setTimeout(() => btn.classList.remove("flash"), 300);
}

function userFlash(btn) {
  btn.classList.add("userflash");
  setTimeout(() => btn.classList.remove("userflash"), 150);
}

/* ================= USER INPUT ================= */
document.querySelectorAll(".btn").forEach(btn => {
  btn.addEventListener("click", function () {
    if (!started) return;
    if (!btns.includes(this.id)) return;

    userSeq.push(this.id);
    userFlash(this);
    checkAnswer(userSeq.length - 1);
  });
});

/* ================= CHECK ANSWER ================= */
function checkAnswer(idx) {
  if (userSeq[idx] === gameSeq[idx]) {
    if (userSeq.length === gameSeq.length) {
      setTimeout(levelUp, 700);
    }
  } else {
    gameOver();
  }
}

/* ================= GAME OVER ================= */
function gameOver() {
  started = false;
  const score = level - 1;

  if (score > highScores[difficulty]) {
    highScores[difficulty] = score;
    localStorage.setItem(`hs_${difficulty}`, score);
  }

  levelText.innerHTML = `💀 Game Over<br>Score: ${score}`;
  highScoreText.innerText = `High Score: ${highScores[difficulty]}`;
  restartBtn.classList.remove("hidden");
  homeBtn.classList.remove("hidden");
}

/* ================= RESTART ================= */
restartBtn.onclick = () => {
  restartBtn.classList.add("hidden");
  startGame();
};

/* ================= HOME BUTTON ================= */
homeBtn.onclick = () => {
  started = false;
  level = 0;
  gameSeq = [];
  userSeq = [];

  gameScreen.classList.add("hidden");
  startScreen.classList.remove("hidden");

  overlay.classList.remove("hidden");
  setTimeout(() => overlay.classList.add("active"), 10);

  levelPopup.classList.remove("hidden");
  setTimeout(() => levelPopup.classList.add("active"), 10);

  restartBtn.classList.add("hidden");
  homeBtn.classList.add("hidden");
};




/* ================= HIGH SCORE RESET ================= */
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "t") {
    ["easy","medium","hard"].forEach(lvl => {
      localStorage.setItem(`hs_${lvl}`, 0);
      highScores[lvl] = 0;
    });

    highScoreText.innerText = `High Score: ${highScores[difficulty]}`;
    console.log("All high scores reset");
  }
});
