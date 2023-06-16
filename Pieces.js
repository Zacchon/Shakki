const deltaToPos = (piece, delta) => {
    return [piece.row + delta[0], piece.column + delta[1]];
};

const movesFromDeltas = (deltas, piece) => {
    const moves = [];
    for (const dpos of deltas) {
        const newPos = deltaToPos(piece, dpos);
        if (piece.board.isWithinBounds(...newPos) && !piece.board.isAllied(...newPos, piece.color)) {
            moves.push(newPos);
        }
    }
    return moves;
};

const movesFromDDeltas = (ddeltas, piece) => {
    const moves = [];
    for (const dd of ddeltas) {
        let delta = [0, 0];

        let DEBUG_iters = 100;
        while (DEBUG_iters--) {
            delta = [delta[0] + dd[0], delta[1] + dd[1]];
            newPos = deltaToPos(piece, delta);

            if (!piece.board.isWithinBounds(...newPos) || piece.board.isAllied(...newPos, piece.color)) break;
            moves.push(newPos);
            if (piece.board.isEnemy(...newPos, piece.color)) break;
        }
        if (DEBUG_iters === 0) console.log("DANGEROUS LOOP in movesFromDDeltas");
    }
    return moves;
}

class Piece {
    constructor(color) {
        this.color = color;
        this.board = undefined;
        this.row = undefined;
        this.column = undefined;
        this.symbol = "X";
        this.hasMoved = false;
    }

    move(row, col) {
        this.board.setPiece(undefined, this.row, this.column);
        this.row = row;
        this.column = col;
        this.board.setPiece(this, row, col);
        this.hasMoved = true;
    }
}

class Pawn extends Piece {
    constructor(color) {
        super(color);
        this.symbol = (this.color === 1 ? "♙" : "♟");
    }

    legalMoves() {
        const moves = [];
        const direction = -1 * this.color;
        if (this.board.isEmpty(this.row + direction, this.column)) {
            moves.push([this.row + direction, this.column]);

            if (!this.hasMoved && this.board.isEmpty(this.row + 2*direction, this.column)) {
                moves.push([this.row + 2*direction, this.column]);
            }
        }
        if (this.board.isEnemy(this.row + direction, this.column + 1, this.color)) {
            moves.push([this.row + direction, this.column + 1]);
        }
        if (this.board.isEnemy(this.row + direction, this.column - 1, this.color)) {
            moves.push([this.row + direction, this.column - 1]);
        }
        // TODO: handle promotion
        // TODO: en passant
        return moves;
    }
}

class Knight extends Piece {
    constructor(color) {
        super(color);
        this.symbol = (this.color === 1 ? "♘" : "♞");
    }

    legalMoves() {
        const deltas = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [2,-1], [-2,1], [-2,-1]];
        return movesFromDeltas(deltas, this);
    }
}

class Bishop extends Piece {
    constructor(color) {
        super(color);
        this.symbol = (this.color === 1 ? "♗" : "♝");
    }

    legalMoves() {
        const ddeltas = [[-1,-1], [-1,1], [1,-1], [1,1]];
        return movesFromDDeltas(ddeltas, this);
    }
}

class Rook extends Piece {
    constructor(color) {
        super(color);
        this.symbol = (this.color === 1 ? "♖" : "♜");
    }

    legalMoves() {
        const ddeltas = [[0,-1], [0,1], [-1,0], [1,0]];
        return movesFromDDeltas(ddeltas, this);
    }
}

class Queen extends Piece {
    constructor(color) {
        super(color);
        this.symbol = (this.color === 1 ? "♕" : "♛");
    }

    legalMoves() {
        const ddeltas = [[-1,-1], [-1,1], [1,-1], [1,1], [0,-1], [0,1], [-1,0], [1,0]];
        return movesFromDDeltas(ddeltas, this);
    }
}

class King extends Piece {
    constructor(color) {
        super(color);
        this.symbol = (this.color === 1 ? "♔" : "♚");
    }

    legalMoves() {
        const deltas = [[-1,-1], [-1,1], [1,-1], [1,1], [0,-1], [0,1], [-1,0], [1,0]];
        const candidateMoves = movesFromDeltas(deltas, this);
        const moves = [];
        for (const move of candidateMoves) {
            if (this.board.isSafeFor(this.row, this.column, this.color)) {
                moves.push(move);
            }
        }
        // TODO: castling -- tell rook to move as well
        if (!this.hasMoved && this.board.isSafeFor(this.row, this.column, this.color)) {
            const pieceLeft = this.board.state[this.row][0].piece;
            const pieceRight = this.board.state[this.row][this.board.NCOLS-1].piece;

            for (const piece of [pieceLeft, pieceRight]) {
                if (piece instanceof Rook && !piece.hasMoved && piece.color === this.color) {
                    const dir = Math.sign(this.column - piece.column);
                    let canCastle = true;
                    for (let col = this.column; col != piece.column; col+=dir) {
                        if (Math.abs(this.column - col) <= 2) {
                            if (!this.board.isSafeFor(this.row, col, this.color)) {
                                canCastle = false;
                                break;
                            }
                        }
                        if (this.board.state[this.row][col].piece) {
                            canCastle = false;
                            break;
                        }
                    }
                    if (canCastle) {
                        moves.push([this.row, this.column + 2*dir]);
                    }
                }
            }
        }
        return moves;
    }
}
