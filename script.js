const grid = document.getElementById("grid");
const movesElement = document.getElementById("moves");
const timerElement = document.getElementById("timer");
const newGameBtn = document.getElementById("new-game");
const congratsMsg = document.getElementById("congrats");
const finalMsg = document.getElementById("final");
const nextBtn = document.getElementById("next");
const levelTitle = document.getElementById("level-title");

const emojis = ["🐶", "🐱", "🐼", "🐸", "🦊", "🐵", "🐰", "🦁"];
const numbers = ["1", "2", "3", "4", "5", "6", "7", "8"];

let cards = [];
let moves = 0;
let timer;
let seconds = 0;
let firstCard = null;
let lockBoard = false;
let level = 1; // Level 1 = emoji, Level 2 = numbers

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function startTimer() {
  timer = setInterval(() => {
    seconds++;
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    timerElement.textContent = `${mins}:${secs}`;
  }, 1000);
}

function stopTimer() {
  clearInterval(timer);
}

function startGame() {
  grid.innerHTML = "";
  congratsMsg.style.display = "none";
  finalMsg.style.display = "none";
  firstCard = null;
  lockBoard = false;
  moves = 0;
  seconds = 0;
  movesElement.textContent = "0";
  timerElement.textContent = "00:00";
  stopTimer();

  let baseCards = level === 1 ? emojis : numbers;
  cards = shuffle([...baseCards, ...baseCards]);

  // Update heading
  levelTitle.innerText = level === 1 ? "Using Emoji" : "Using Numbers";

  // Create cards
  cards.forEach(content => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.value = content;
    card.innerText = "❓";
    card.addEventListener("click", flipCard);
    grid.appendChild(card);
  });

  startTimer();
}

function flipCard() {
  if (lockBoard || this.innerText !== "❓") return;

  this.innerText = this.dataset.value;

  if (!firstCard) {
    firstCard = this;
    return;
  }

  moves++;
  movesElement.textContent = moves;

  if (firstCard.dataset.value === this.dataset.value) {
    firstCard = null;
    checkWin();
  } else {
    lockBoard = true;
    setTimeout(() => {
      this.innerText = "❓";
      firstCard.innerText = "❓";
      firstCard = null;
      lockBoard = false;
    }, 800);
  }
}

function checkWin() {
  const allCards = document.querySelectorAll(".card");
  const matched = [...allCards].every(card => card.innerText !== "❓");

  if (matched) {
    stopTimer();

    if (level === 1) {
      congratsMsg.style.display = "block"; // Show next button
    } else {
      finalMsg.style.display = "block"; // Game complete
    }
  }
}

// Event Listeners
newGameBtn.addEventListener("click", startGame);

nextBtn.addEventListener("click", () => {
  level = 2;
  startGame();
});
