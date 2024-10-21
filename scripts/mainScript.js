class TicTacToeBoard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.gameCtx = Array.from({ length: 3 }, () => Array(3).fill("_"));
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
        if (this.gameCtx[row][col] !== "_") {
            console.log("Cell already taken!");
            return;
        }

        this.gameCtx[row][col] = this.turn;
        const cell = document.getElementById(`${row}-${col}`);

        cell.innerHTML = this.turn === 0 ? "X" : "O";
        cell.style.color = this.turn === 0 ? "#72CFF9" : "#DCBF3F";

        if (this.checkWinner() !== -1) return this.displayWinner(this.checkWinner());

        this.turn = 1 - this.turn; 
        console.log(this.gameCtx); 
    }

    checkWinner() {
        for (let i = 0; i < 3; i++) {
            if (this.isWinningLine(this.gameCtx[i][0], this.gameCtx[i][1], this.gameCtx[i][2])) {
                return this.gameCtx[i][0];
            }
            if (this.isWinningLine(this.gameCtx[0][i], this.gameCtx[1][i], this.gameCtx[2][i])) {
                return this.gameCtx[0][i];
            }
        }

        if (this.isWinningLine(this.gameCtx[0][0], this.gameCtx[1][1], this.gameCtx[2][2])) {
            return this.gameCtx[0][0];
        }
        if (this.isWinningLine(this.gameCtx[0][2], this.gameCtx[1][1], this.gameCtx[2][0])) {
            return this.gameCtx[0][2];
        }

        return this.isBoardFull() ? 2 : -1;
    }

    isWinningLine(a, b, c) {
        return a !== "_" && a === b && b === c;
    }

    isBoardFull() {
        return this.gameCtx.every(row => row.every(cell => cell !== "_"));
    }

    displayWinner(winner) {
        const label = document.getElementById("winner");
        const message = winner === 2 ? "It's a Draw!" : `Player ${winner === 0 ? "X" : "O"} Wins!`;
        label.style.display = "flex";
        label.innerHTML = message;
        if(winner === 2){
            label.style.color = "#BCDBF9";

            var draws = parseInt(document.getElementById("drawscore").innerHTML);
            draws += 1;

            document.getElementById("drawscore").innerHTML = draws;
        } else if(winner === 0){
            label.style.color = "#48D2FE";

            var x = parseInt(document.getElementById("xscore").innerHTML);
            x += 1;

            document.getElementById("xscore").innerHTML = x;
        } else {
            label.style.color = "#E2BE00";

            var y = parseInt(document.getElementById("yscore").innerHTML);
            y += 1;

            document.getElementById("yscore").innerHTML = y;
        }
        this.lockBoard(1);
    }

    resetBoard() {
        this.gameCtx = Array.from({ length: 3 }, () => Array(3).fill("_"));
        this.turn = 0;
        this.initBoard();
    }

    handleNewGame(){
        document.getElementById("winner").innerHTML = "";
        this.resetBoard();
    }
    handleNewMatch(){
        document.getElementById("winner").innerHTML = "";
        document.getElementById("drawscore").innerHTML = "0";
        document.getElementById("xscore").innerHTML = "0";
        document.getElementById("yscore").innerHTML = "0";
        this.resetBoard();
    }

    lockBoard(lock) {
        const rows = this.container.querySelectorAll(".row");
        rows.forEach(row => {
            const cells = row.querySelectorAll(".cell");
            cells.forEach(cell => {
                if (lock) {
                    cell.onclick = null; 
                } else {
                    const [row, col] = cell.id.split("-").map(Number);
                    cell.onclick = () => this.handleMove(row, col); 
                }
            });
        });
    }
}

document.addEventListener("DOMContentLoaded", () => {
    new TicTacToeBoard("grid");
});
