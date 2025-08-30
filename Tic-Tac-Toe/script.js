const boardEl = document.getElementById("board");
const messageEl = document.getElementById("message");
let board, currentPlayer, gameActive, mode;

// Winning combinations
const winningCombos = [
  [0,1,2], [3,4,5], [6,7,8], // rows
  [0,3,6], [1,4,7], [2,5,8], // columns
  [0,4,8], [2,4,6]           // diagonals
];

// Initialize
function startGame(selectedMode) {
  board = ["", "", "", "", "", "", "", "", ""];
  currentPlayer = "X";
  gameActive = true;
  mode = selectedMode;
  boardEl.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    boardEl.appendChild(cell);
  }
  messageEl.textContent = "Player X's turn";
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (!gameActive || board[index] !== "") return;
  makeMove(index, currentPlayer);

  if (mode === "ai" && gameActive && currentPlayer === "O") {
    setTimeout(aiMove, 500); // delay AI move
  }
}

function makeMove(index, player) {
  board[index] = player;
  document.querySelectorAll(".cell")[index].textContent = player;

  if (checkWin(player)) {
    messageEl.textContent = `Player ${player} wins! 🎉`;
    gameActive = false;
    return;
  }

  if (board.every(cell => cell !== "")) {
    messageEl.textContent = "It's a draw! 🤝";
    gameActive = false;
    return;
  }

  currentPlayer = currentPlayer === "X" ? "O" : "X";
  messageEl.textContent = `Player ${currentPlayer}'s turn`;
}

function checkWin(player) {
  return winningCombos.some(combo =>
    combo.every(index => board[index] === player)
  );
}

function aiMove() {
  // Simple AI: win if possible, block if needed, else random
  let move = findBestMove("O") || findBestMove("X") || randomMove();
  makeMove(move, "O");
}

function findBestMove(player) {
  for (let combo of winningCombos) {
    const [a, b, c] = combo;
    const values = [board[a], board[b], board[c]];
    if (values.filter(v => v === player).length === 2 && values.includes("")) {
      return combo[values.indexOf("")];
    }
  }
  return null;
}

function randomMove() {
  const emptyIndices = board.map((v, i) => v === "" ? i : null).filter(v => v !== null);
  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function resetGame() {
  startGame(mode || "pvp");
}

// Start default game
startGame("pvp");