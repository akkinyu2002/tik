const winningLines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cells = Array.from(document.querySelectorAll(".cell"));
const statusText = document.querySelector("#status");
const newRoundButton = document.querySelector("#new-round");
const resetScoreButton = document.querySelector("#reset-score");
const switchStarterButton = document.querySelector("#switch-starter");
const scoreX = document.querySelector("#score-x");
const scoreO = document.querySelector("#score-o");
const scoreDraw = document.querySelector("#score-draw");
const scoreCards = {
  x: document.querySelector('[data-score-card="x"]'),
  o: document.querySelector('[data-score-card="o"]'),
  draw: document.querySelector('[data-score-card="draw"]'),
};

let board = Array(9).fill("");
let currentPlayer = "X";
let startingPlayer = "X";
let isRoundOver = false;
let scores = {
  X: 0,
  O: 0,
  draw: 0,
};

function markCell(cell, player) {
  cell.textContent = player;
  cell.classList.add(player.toLowerCase());
  cell.setAttribute("aria-label", `${cell.getAttribute("aria-label")}: ${player}`);
}

function updateActiveScoreCard(activeKey) {
  Object.values(scoreCards).forEach((card) => card.classList.remove("active"));
  scoreCards[activeKey].classList.add("active");
}

function updateStatus(message) {
  statusText.textContent = message;
}

function findWinner() {
  return winningLines.find(([a, b, c]) => {
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function finishRound(winningLine) {
  isRoundOver = true;
  cells.forEach((cell) => {
    cell.disabled = true;
  });

  if (winningLine) {
    const winner = board[winningLine[0]];
    scores[winner] += 1;
    winningLine.forEach((index) => cells[index].classList.add("win"));
    updateStatus(`Player ${winner} wins`);
    updateActiveScoreCard(winner.toLowerCase());
  } else {
    scores.draw += 1;
    updateStatus("The round is a draw");
    updateActiveScoreCard("draw");
  }

  renderScores();
}

function renderScores() {
  scoreX.textContent = scores.X;
  scoreO.textContent = scores.O;
  scoreDraw.textContent = scores.draw;
}

function switchTurn() {
  currentPlayer = currentPlayer === "X" ? "O" : "X";
  updateStatus(`Player ${currentPlayer}'s turn`);
  updateActiveScoreCard(currentPlayer.toLowerCase());
}

function playTurn(event) {
  const cell = event.currentTarget;
  const index = Number(cell.dataset.index);

  if (board[index] || isRoundOver) {
    return;
  }

  board[index] = currentPlayer;
  markCell(cell, currentPlayer);
  cell.disabled = true;

  const winningLine = findWinner();
  if (winningLine) {
    finishRound(winningLine);
    return;
  }

  if (board.every(Boolean)) {
    finishRound(null);
    return;
  }

  switchTurn();
}

function resetBoard() {
  board = Array(9).fill("");
  isRoundOver = false;
  currentPlayer = startingPlayer;
  updateStatus(`Player ${currentPlayer}'s turn`);
  updateActiveScoreCard(currentPlayer.toLowerCase());

  cells.forEach((cell) => {
    const baseLabel = cell.getAttribute("aria-label").split(":")[0];
    cell.textContent = "";
    cell.disabled = false;
    cell.className = "cell";
    cell.setAttribute("aria-label", baseLabel);
  });
}

function resetScore() {
  scores = {
    X: 0,
    O: 0,
    draw: 0,
  };
  renderScores();
  resetBoard();
}

function switchStarter() {
  startingPlayer = startingPlayer === "X" ? "O" : "X";
  switchStarterButton.textContent = `${startingPlayer === "X" ? "O" : "X"} Starts Next`;
  resetBoard();
}

cells.forEach((cell) => {
  cell.addEventListener("click", playTurn);
});

newRoundButton.addEventListener("click", resetBoard);
resetScoreButton.addEventListener("click", resetScore);
switchStarterButton.addEventListener("click", switchStarter);

renderScores();
resetBoard();
