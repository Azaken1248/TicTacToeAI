import { Game } from './minimax.js'; 
import { renderGameTree } from './treeGenerator.js'; 

class TicTacToeBoard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.game = new Game(); 
        this.turn = 0; 
        this.initBoard();
    }

    initBoard() {
        this.container.innerHTML = ""; 
        for (let i = 0; i < 3; i++) {
            const row = document.createElement("div");
            row.className = "row";

            for (let j = 0; j < 3; j++) {
                const cell = this.createCell(i, j);
                row.appendChild(cell);
            }

            this.container.appendChild(row);
        }

        document.getElementById("rstBoard").onclick = () => this.handleNewMatch();
        document.getElementById("rstGame").onclick = () => this.handleNewGame();
    }

    createCell(row, col) {
        const cell = document.createElement("div");
        cell.id = `${row}-${col}`;
        cell.className = "cell";
        cell.onclick = () => this.handleMove(row, col);
        return cell;
    }

    handleMove(row, col) {
        if (this.game.board[row][col] !== '_') {
            console.log("Cell already taken!");
            return;
        }

        this.game.makeMove(row, col);
        const cell = document.getElementById(`${row}-${col}`);
        cell.innerHTML = this.turn === 0 ? "X" : "O";
        cell.style.color = this.turn === 0 ? "#72CFF9" : "#DCBF3F";

        var winner = this.game.checkWinner();

        if (winner !== -1) return this.displayWinner(winner);

        this.turn = 1 - this.turn;  
        console.log(this.game.board); 

        

        if (this.turn === 1) {
            this.aiMove();
            renderGameTree(this.game.board, 800, 600); 
        }
    }

    aiMove() {
        const optimalMove = this.game.findBestMove();
        this.game.visualization += `\n<span class = 'optimal-move'>Choosen Move: [${optimalMove.row}, ${optimalMove.col}]</span>\n<hr>`;
        if (optimalMove.row !== -1 && optimalMove.col !== -1) {
            this.handleMove(optimalMove.row, optimalMove.col);
        }

        var visualization = this.game.getVisualization();
        document.getElementById("logs").innerHTML = `<pre class = 'move-data'>${visualization}\n</pre>`;
    }

    displayWinner(winner) {
        const label = document.getElementById("winner");
        const message = winner === 2 ? "It's a Draw!" : `Player ${winner === 0 ? "X" : "O"} Wins!`;
        label.style.display = "flex";
        label.innerHTML = message;

        if (winner === 2) {
            label.style.color = "#BCDBF9";  
            const draws = parseInt(document.getElementById("drawscore").innerHTML);
            document.getElementById("drawscore").innerHTML = draws + 1;
        } else {
            label.style.color = winner === 0 ? "#72CFF9" : "#DCBF3F";  
            const scoreElement = document.getElementById(winner === 0 ? "xscore" : "yscore");
            const wins = parseInt(scoreElement.innerHTML);
            scoreElement.innerHTML = wins + 1;
        }

        this.lockBoard(true);  
    }

    resetBoard() {
        this.game = new Game(); 
        this.turn = 0;
        this.initBoard();
    }

    handleNewGame() {
        document.getElementById("winner").innerHTML = "";
        document.getElementById("logs").innerHTML = "";
        this.game.visualization = "";
        this.resetBoard();
    }

    handleNewMatch() {
        document.getElementById("winner").innerHTML = "";
        document.getElementById("drawscore").innerHTML = "0";
        document.getElementById("xscore").innerHTML = "0";
        document.getElementById("yscore").innerHTML = "0"; 
        document.getElementById("logs").innerHTML = ""; 
        this.game.visualization = "";
        this.resetBoard();
    }

    lockBoard(lock) {
        const rows = this.container.querySelectorAll(".row");
        rows.forEach(row => {
            const cells = row.querySelectorAll(".cell");
            cells.forEach(cell => {
                cell.onclick = lock ? null : () => {
                    const [row, col] = cell.id.split("-").map(Number);
                    this.handleMove(row, col);
                };
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TicTacToeBoard("grid");
});
