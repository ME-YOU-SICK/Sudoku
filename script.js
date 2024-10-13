// Select elements
const startGameButton = document.getElementById('start-game');
const modeSelect = document.getElementById('mode-select');
const difficultySelect = document.getElementById('difficulty-select');
const sudokuBoard = document.getElementById('sudoku-board');
const sudokuCells = Array.from(sudokuBoard.querySelectorAll('td'));
const numberButtons = document.querySelectorAll('.number-btn');
const statusText = document.getElementById('status-text');

// Initialize game state
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

// Event listeners
startGameButton.addEventListener('click', startGame);
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        selectedNumber = parseInt(button.dataset.num);
        highlightSelectedNumber(selectedNumber);
    });
});

// Start the game
function startGame() {
    const selectedMode = modeSelect.value;
    const selectedDifficulty = difficultySelect.value;

    // Load the Sudoku puzzle based on selected difficulty
    loadSudokuPuzzle(selectedDifficulty);

    // Update status
    updateStatus(`Game started in ${selectedMode} mode on ${selectedDifficulty} difficulty!`);
}

// Load Sudoku Puzzle based on selected difficulty
function loadSudokuPuzzle(difficulty) {
    const dummyData = {
        easy: [
            [5, 3, 0, 0, 7, 0, 0, 0, 0],
            [6, 0, 0, 1, 9, 5, 0, 0, 0],
            [0, 9, 8, 0, 0, 0, 0, 6, 0],
            [8, 0, 0, 0, 6, 0, 0, 0, 3],
            [4, 0, 0, 8, 0, 3, 0, 0, 1],
            [7, 0, 0, 0, 2, 0, 0, 0, 6],
            [0, 6, 0, 0, 0, 0, 2, 8, 0],
            [0, 0, 0, 4, 1, 9, 0, 0, 5],
            [0, 0, 0, 0, 8, 0, 0, 7, 9]
        ],
        medium: [
            [0, 0, 4, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 2, 0],
            [0, 5, 0, 8, 1, 0, 0, 0, 0],
            [3, 0, 0, 0, 0, 0, 5, 0, 0],
            [0, 4, 0, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 0, 6, 0, 0, 0, 4],
            [0, 0, 1, 0, 4, 0, 0, 5, 0],
            [0, 9, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 7, 4, 0, 0]
        ],
        hard: [
            [0, 0, 0, 1, 0, 3, 0, 0, 0],
            [2, 0, 0, 0, 0, 0, 5, 0, 0],
            [0, 6, 4, 0, 0, 0, 3, 0, 0],
            [0, 3, 0, 0, 5, 0, 0, 0, 0],
            [0, 9, 0, 7, 0, 6, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 8, 4],
            [0, 0, 3, 0, 0, 0, 2, 7, 0],
            [0, 0, 8, 0, 0, 0, 0, 0, 1],
            [0, 0, 0, 4, 0, 9, 0, 0, 0]
        ]
    };

    // Fill the Sudoku board based on selected difficulty
    const boardData = dummyData[difficulty];
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cellIndex = row * 9 + col;
            sudokuCells[cellIndex].textContent = boardData[row][col] !== 0 ? boardData[row][col] : "";
            sudokuCells[cellIndex].classList.remove('editable'); // Make filled cells non-editable
            if (boardData[row][col] === 0) {
                sudokuCells[cellIndex].classList.add('editable'); // Add class for editable cells
            }
        }
    }
}

// Highlight the selected number button
function highlightSelectedNumber(number) {
    numberButtons.forEach(button => {
        button.classList.remove('active');
        if (parseInt(button.dataset.num) === number) {
            button.classList.add('active');
        }
    });
}

// Update the status message
function updateStatus(message) {
    statusText.textContent = message;
}

// Reset game
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
    updateStatus("Make your move!");
}
