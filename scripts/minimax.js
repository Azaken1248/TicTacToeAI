export class Game {
    constructor() {
        this.board = Array(3).fill(null).map(() => Array(3).fill('_')); 
        this.currentPlayer = 0; 
    }

    printBoard() {
        console.log(this.board);
    }

    makeMove(row, col) {
        if (this.board[row][col] === '_') {
            this.board[row][col] = this.currentPlayer === 0 ? 0 : 1; 
            this.currentPlayer = this.currentPlayer === 0 ? 1 : 0; 
        } else {
            console.log(`Cell already taken at position [${row}, ${col}]`);
        }
    }

    isTerminal() {
        return this.checkWinner() !== -1 || this.isBoardFull();
    }

    isBoardFull() {
        return this.board.every(row => row.every(cell => cell !== '_'));
    }

    checkWinner() {

        for (let i = 0; i < 3; i++) {
            if (this.board[i][0] !== '_' && this.board[i][0] === this.board[i][1] && this.board[i][1] === this.board[i][2]) {
                return this.board[i][0]; 
            }
            if (this.board[0][i] !== '_' && this.board[0][i] === this.board[1][i] && this.board[1][i] === this.board[2][i]) {
                return this.board[0][i]; 
            }
        }
        if (this.board[0][0] !== '_' && this.board[0][0] === this.board[1][1] && this.board[1][1] === this.board[2][2]) {
            return this.board[0][0]; 
        }
        if (this.board[0][2] !== '_' && this.board[0][2] === this.board[1][1] && this.board[1][1] === this.board[2][0]) {
            return this.board[0][2]; 
        }
    
        return this.isBoardFull() ? 2 : -1; 
    }

    minimax(depth, isMaximizing) {
        const winner = this.checkWinner();
        if (winner !== -1) {
            return winner === 0 ? -10 : winner === 1 ? 10 : 0; 
        }

        if (this.isBoardFull()) {
            return 0; 
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === '_') {
                        this.board[i][j] = 1; 
                        const score = this.minimax(depth + 1, false);
                        this.board[i][j] = '_'; 
                        bestScore = Math.max(score, bestScore);
                    }
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (this.board[i][j] === '_') {
                        this.board[i][j] = 0; 
                        const score = this.minimax(depth + 1, true);
                        this.board[i][j] = '_'; 
                        bestScore = Math.min(score, bestScore);
                    }
                }
            }
            return bestScore;
        }
    }

    findBestMove() {
        let bestScore = -Infinity;
        let move = { row: -1, col: -1 };

        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (this.board[i][j] === '_') {
                    this.board[i][j] = 1; 
                    const score = this.minimax(0, false);
                    this.board[i][j] = '_'; 

                    if (score > bestScore) {
                        bestScore = score;
                        move.row = i;
                        move.col = j;
                    }
                }
            }
        }
        return move; 
    }
}
