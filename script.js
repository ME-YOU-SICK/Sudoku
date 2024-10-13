// Sudoku Blitz Game Logic

// Selectors
const numberButtons = document.querySelectorAll('.number-btn');
const sudokuCells = document.querySelectorAll('#sudoku-board td');
const statusText = document.getElementById('status-text');

// Game Data
let selectedNumber = null;
let availableNumbers = {
  1: 3,
  2: 3,
  3: 3,
  4: 3,
  5: 3,
  6: 3,
  7: 3,
  8: 3,
  9: 3
};

// Event listener for selecting numbers
numberButtons.forEach(button => {
  button.addEventListener('click', () => {
    const number = parseInt(button.dataset.num);
    if (availableNumbers[number] > 0) {
      selectedNumber = number;
      highlightSelectedNumber(number);
      updateStatus(`Selected number: ${number}`);
    }
  });
});

// Event listener for placing numbers in the grid
sudokuCells.forEach(cell => {
  cell.addEventListener('click', () => {
    if (selectedNumber && cell.textContent === "") {
      cell.textContent = selectedNumber;
      availableNumbers[selectedNumber]--;
      updateNumberCounts();
      checkNumberAvailability();
      selectedNumber = null;
      updateStatus("Make your move!");
    }
  });
});

// Highlight the selected number button
function highlightSelectedNumber(number) {
  numberButtons.forEach(button => {
    button.classList.remove('active');
    if (parseInt(button.dataset.num) === number) {
      button.classList.add('active');
    }
  });
}

// Update the number counts in the UI
function updateNumberCounts() {
  for (let num = 1; num <= 9; num++) {
    document.getElementById(`count-${num}`).textContent = availableNumbers[num];
  }
}

// Disable number buttons if their count reaches zero
function checkNumberAvailability() {
  numberButtons.forEach(button => {
    const number = parseInt(button.dataset.num);
    if (availableNumbers[number] === 0) {
      button.disabled = true;
    }
  });
}

// Update the status message
function updateStatus(message) {
  statusText.textContent = message;
}

// Reset game (for future extensions like restart functionality)
function resetGame() {
  // Clear grid and reset counts
  sudokuCells.forEach(cell => (cell.textContent = ""));
  selectedNumber = null;
  availableNumbers = {
    1: 3,
    2: 3,
    3: 3,
    4: 3,
    5: 3,
    6: 3,
    7: 3,
    8: 3,
    9: 3
  };
  updateNumberCounts();
  numberButtons.forEach(button => {
    button.disabled = false;
    button.classList.remove('active');
  });
  updateStatus("Make your move!");
}

