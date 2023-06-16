class Square {
    constructor() {
        this.piece = undefined;
        this.seerPieces = new Set();
    }

    getSymbol() {
        return this.piece ? this.piece.symbol : "";
    }
}

class Board {
    constructor(num_rows, num_cols) {
        this.NROWS = num_rows;
        this.NCOLS = num_cols;
        this.playerToMove = 1;  // 1 for white, -1 for black
        this.initializeState();
    }

    initializeState() {
        this.state = Array(this.NROWS);
        for (let i=0; i<this.NROWS; i++) {
            const rowArray = new Array(this.NCOLS);
            for (let j=0; j<this.NCOLS; j++) {
                rowArray[j] = new Square();
            }
            this.state[i] = rowArray;
        }
    }

    setPiece(piece, row, col) {
        this.state[row][col].piece = piece;
        piece.board = this;
        piece.row = row;
        piece.column = col;
    }

    setRow(pieces, row) {
        if (pieces.length !== this.NCOLS) throw new Error("Number of pieces given differs from the length of the rows");

        for (let i=0; i<this.NCOLS; i++) {
            this.setPiece(pieces[i], row, i);
        }
    }

    isWithinBounds(row, col) {
        return (0 <= row && row < this.NROWS && 0 <= col && col < this.NCOLS);
    }

    isEmpty(row, col) {
        const piece = this.state[row][col].piece;
        if (!piece) {
            return true;
        }
        return false;
    }

    isAllied(row, col, color) {
        return !this.isEmpty(row, col) && this.state[row][col].piece.color === color;
    }

    isEnemy(row, col, color) {
        return !this.isEmpty(row, col) && this.state[row][col].piece.color !== color;
    }

    isSafeFor(row, col, color) {
        for (const piece of this.state[row][col].seerPieces) {
            if (piece.color !== color) {
                return false;
            }
        }
        return true; 
    }
    
}