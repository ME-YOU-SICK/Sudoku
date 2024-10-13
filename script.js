let sudokuBoard;
let originalBoard;
let mode;
let difficulty;
let timerInterval;
let timeLeft;

document.getElementById('start-game').addEventListener('click', () => {
    mode = document.getElementById('mode-select').value;
    difficulty = document.getElementById('difficulty-select').value;

    generateSudokuBoard();
    updateStatus("Make your move!");

    if (mode === "mission") {
        startTimer();
    }
});

function generateSudokuBoard() {
    originalBoard = createSudoku();
    sudokuBoard = JSON.parse(JSON.stringify(originalBoard)); // Copy the original board
    hideNumbers(sudokuBoard);
    renderBoard();
}

function createSudoku() {
    const board = Array.from({ length: 9 }, () => Array(9).fill(null));
    fillBoard(board);
    return board;
}

function fillBoard(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === null) {
                const numbers = shuffleArray([...Array(9).keys()].map(i => i + 1));
                for (let number of numbers) {
                    if (isSafe(board, row, col, number)) {
                        board[row][col] = number;
                        if (fillBoard(board)) {
                            return true;
                        }
                        board[row][col] = null; // Backtrack
                    }
                }
                return false; // Trigger backtracking
            }
        }
    }
    return true; // Successfully filled the board
}

function hideNumbers(board) {
    let totalCellsToRemove;
    switch (difficulty) {
        case 'easy':
            totalCellsToRemove = 20;
            break;
        case 'medium':
            totalCellsToRemove = 30;
            break;
        case 'hard':
            totalCellsToRemove = 40;
            break;
    }

    let count = 0;
    while (count < totalCellsToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (board[row][col] !== null) {
            board[row][col] = null;
            count++;
        }
    }
}

function isSafe(board, row, col, number) {
    // Check row and column
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === number || board[i][col] === number) return false;
    }

    // Check 3x3 box
    const boxRowStart = Math.floor(row / 3) * 3;
    const boxColStart = Math.floor(col / 3) * 3;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRowStart + i][boxColStart + j] === number) return false;
        }
    }
    return true;
}

function renderBoard() {
    const boardElement = document.getElementById('sudoku-board');
    boardElement.innerHTML = ''; // Clear previous board
    sudokuBoard.forEach((row, rowIndex) => {
        const tr = document.createElement('tr');
        row.forEach((cellValue, colIndex) => {
            const td = document.createElement('td');
            td.contentEditable = cellValue === null; // Make the cell editable only if empty
            td.classList.add('editable');
            td.innerText = cellValue !== null ? cellValue : ''; // Show number if present

            td.addEventListener('input', (event) => {
                const value = event.target.innerText;

                // Ensure the cell is editable
                if (cellValue === null) { // Only check for empty cells
                    if (value && (value < 1 || value > 9 || isNaN(value))) {
                        event.target.innerText = ''; // Clear invalid input
                        event.target.style.backgroundColor = 'red'; // Set red color for mistakes
                    } else {
                        event.target.style.backgroundColor = ''; // Reset color
                        if (value !== "") {
                            const correctValue = originalBoard[rowIndex][colIndex]; // Compare with the original number
                            if (Number(value) === correctValue) {
                                event.target.style.backgroundColor = 'blue'; // Turn blue for correct
                                setTimeout(() => {
                                    event.target.style.backgroundColor = ''; // Reset color after 3 seconds
                                }, 3000);
                            } else {
                                event.target.style.backgroundColor = 'red'; // Set red color for mistakes
                            }
                        }
                    }
                }
                checkWinCondition();
            });

            td.addEventListener('dragover', (event) => {
                event.preventDefault(); // Allow drop
            });

            td.addEventListener('drop', (event) => {
                const number = event.dataTransfer.getData('text');
                event.preventDefault();
                if (cellValue === null) { // Only allow dropping in empty cells
                    td.innerText = number; // Set the dropped number
                    // Add correct value check for the dropped number
                    if (number !== "") {
                        const correctValue = originalBoard[rowIndex][colIndex]; // Value to check
                        if (Number(number) === correctValue) {
                            td.style.backgroundColor = 'blue'; // Turn blue for correct
                            setTimeout(() => {
                                td.style.backgroundColor = ''; // Reset color after 3 seconds
                            }, 3000);
                        } else {
                            td.style.backgroundColor = 'red'; // Set red color for mistakes
                        }
                    }
                }
                checkWinCondition();
            });

            tr.appendChild(td);
        });
        boardElement.appendChild(tr);
    });
}

function updateStatus(message) {
    document.getElementById('status-text').innerText = message;
}

function startTimer() {
    let timeLimit;
    switch (difficulty) {
        case 'easy':
            timeLimit = 180; // 3 minutes
            break;
        case 'medium':
            timeLimit = 120; // 2 minutes
            break;
        case 'hard':
            timeLimit = 60; // 1 minute
            break;
    }
    timeLeft = timeLimit;
    document.getElementById('timer').style.display = 'block';
    document.getElementById('time-left').innerText = timeLeft;

    timerInterval = setInterval(() => {
        timeLeft--;
        document.getElementById('time-left').innerText = timeLeft;

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            updateStatus("Time's up! Game Over!");
            endGame();
        }
    }, 1000);
}

function endGame() {
    const cells = document.querySelectorAll('#sudoku-board td');
    cells.forEach(cell => {
        cell.contentEditable = false; // Make all cells non-editable
    });
}

function checkWinCondition() {
    const cells = document.querySelectorAll('#sudoku-board td');
    const allCellsFilled = Array.from(cells).every(cell => cell.innerText !== '');
    if (allCellsFilled) {
        updateStatus("You win!");
        clearInterval(timerInterval); // Stop the timer
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
}
