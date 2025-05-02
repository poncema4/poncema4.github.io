class TicTacToe {
    constructor() {
        this.gameContainer = document.querySelector('.game-container');
        this.loadingScreen = document.querySelector('.loading-screen');
        this.gameBoard = document.querySelector('.game-board');
        this.cells = document.querySelectorAll('.cell');
        this.resetButton = document.querySelector('.reset-game');
        this.closeButton = document.querySelector('.close-game');
        this.statusDisplay = document.querySelector('.game-status');
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        this.init();
    }

    init() {
        document.querySelector('[href="#play-tictactoe"]').addEventListener('click', (e) => {
            e.preventDefault();
            this.showGame();
        });

        this.cells.forEach(cell => {
            cell.addEventListener('click', () => this.handleCellClick(cell));
        });

        this.resetButton.addEventListener('click', () => this.resetGame());
        this.closeButton.addEventListener('click', () => this.closeGame());
    }

    showGame() {
        this.gameContainer.style.display = 'block';
        this.resetGame(); // Reset game state
        this.showLoadingScreen();
    }

    showLoadingScreen() {
        const loadingScreen = document.querySelector('.loading-screen');
        const loadingBar = document.querySelector('.loading-bar');
        const gameBoard = document.querySelector('.game-board');
        
        loadingScreen.style.display = 'flex';
        gameBoard.style.display = 'none';
        loadingBar.style.width = '0%';
        
        let progress = 0;
        
        const animate = () => {
            progress += 2;
            loadingBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    gameBoard.style.display = 'grid';
                }, 200); // Small delay before showing game
                return;
            }
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }

    closeGame() {
        this.gameContainer.style.display = 'none';
        this.resetGame();
    }

    handleCellClick(cell) {
        const index = cell.getAttribute('data-index');

        if (this.gameState[index] === '' && this.gameActive) {
            this.gameState[index] = this.currentPlayer;
            cell.textContent = this.currentPlayer;
            cell.classList.add(this.currentPlayer.toLowerCase());

            if (this.checkWin()) {
                this.statusDisplay.textContent = `Player ${this.currentPlayer} wins!`;
                this.gameActive = false;
                return;
            }

            if (this.checkDraw()) {
                return;
            }

            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
        }
    }

    checkWin() {
        return this.winningConditions.some(condition => {
            return condition.every(index => {
                return this.gameState[index] === this.currentPlayer;
            });
        });
    }

    checkDraw() {
        if (!this.gameState.includes('') && !this.checkWin()) {
            this.statusDisplay.textContent = "It's a draw!";
            this.gameActive = false;
            return true;
        }
        return false;
    }

    resetGame() {
        this.gameActive = true;
        this.currentPlayer = 'X';
        this.gameState = ['', '', '', '', '', '', '', '', ''];
        this.statusDisplay.textContent = `Player ${this.currentPlayer}'s turn`;
        this.cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x', 'o');
        });
        // Remove this line to prevent loading screen on reset
        // this.showLoadingScreen();
    }
}

// Initialize game when document is ready
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});
