const boardTable = document.getElementById("board");

const Piece = {
    White: {pawn: 1, knight: 2, bishop: 3, rook: 4, queen: 5, king: 6, },
    Black: {pawn:-1, knight:-2, bishop:-3, rook:-4, queen:-5, king:-6, },
    empty: 0,
};

const valueMapping = [0, 1, 3, 3, 5, 9, 420];
const _pieceValue = (x) => {
    return valueMapping[abs(x)];
};

const chessBoard = [
    [   
        Piece.Black.rook, Piece.Black.knight, Piece.Black.bishop, Piece.Black.queen, 
        Piece.Black.king, Piece.Black.bishop, Piece.Black.knight, Piece.Black.rook
    ],
    Array(8).fill(Piece.Black.pawn),
    Array(8).fill(Piece.empty),
    Array(8).fill(Piece.empty),
    Array(8).fill(Piece.empty),
    Array(8).fill(Piece.empty),
    Array(8).fill(Piece.White.pawn),
    [   
        Piece.White.rook, Piece.White.knight, Piece.White.bishop, Piece.White.queen, 
        Piece.White.king, Piece.White.bishop, Piece.White.knight, Piece.White.rook
    ]
];

const pieceSymbol = {
};
pieceSymbol[Piece.White.pawn] = "♙";
pieceSymbol[Piece.White.knight] = "♘";
pieceSymbol[Piece.White.bishop] = "♗";
pieceSymbol[Piece.White.rook] = "♖";
pieceSymbol[Piece.White.queen] = "♕";
pieceSymbol[Piece.White.king] = "♔";

pieceSymbol[Piece.Black.pawn] = "♟";
pieceSymbol[Piece.Black.knight] = "♞";
pieceSymbol[Piece.Black.bishop] = "♝";
pieceSymbol[Piece.Black.rook] = "♜";
pieceSymbol[Piece.Black.queen] = "♛";
pieceSymbol[Piece.Black.king] = "♚";

pieceSymbol[Piece.empty] = "";

let activeSquare = [null, null];

const createBoardElements = () => {
    for (let row=0; row<8; row++) {
        const trElem = document.createElement("tr");
        for (let col=0; col<8; col++) {
            const tdElem = document.createElement("td");
            
            tdElem.classList.add("square");
            tdElem.onclick = () => squareClickFunction(row, col);
            
            const color = ((row+col) % 2 == 0) ? "white" : "black";
            tdElem.classList.add(color);
            
            const indicatorDiv = document.createElement("div");
            indicatorDiv.classList.add("moveIndicator");
            const pieceDiv = document.createElement("div");
            pieceDiv.classList.add("pieceText");

            tdElem.appendChild(pieceDiv);
            tdElem.appendChild(indicatorDiv);

            trElem.appendChild(tdElem);
        }
        boardTable.appendChild(trElem);
    }
};

const getSquareElem = (row, col) => {
    const rowElem = boardTable.getElementsByTagName("tr")[row];
    const squareElem = rowElem.getElementsByTagName("td")[col];
    return squareElem;
};

const updateSquare = (row, col) => {
    const piece = chessBoard[row][col];
    const squareElem = getSquareElem(row, col);
    const pieceTextElem = squareElem.getElementsByClassName("pieceText")[0];

    pieceTextElem.innerText = pieceSymbol[piece];
};

const updateAllSquares = () => {
    for (let row=0; row<8; row++) {
        for (let col=0; col<8; col++) {
            updateSquare(row, col);
        }
    }
};

const getPossibleMoves = () => {
    const row = activeSquare[0];
    const col = activeSquare[1];
    const movedPiece = chessBoard[row][col];
    const moves = [];
    if (movedPiece === 0) {
        return false;
    }
    const pieceType = Math.abs(movedPiece);
    
    const deltaStatus = (delta) => {
        const rnew = row + delta[0];
        const cnew = col + delta[1];

        if (rnew < 0 || rnew > 7 || cnew < 0 || cnew > 7 || chessBoard[rnew][cnew] * movedPiece > 0) return "blocked";
        return chessBoard[rnew][cnew] === Piece.empty ? "empty" : "enemy";
    };

    const pushIfDeltaOk = (deltas) => {
        for (const dpos of deltas) {
            const rnew = row + dpos[0];
            const cnew = col + dpos[1];

            if (0 <= rnew && rnew <= 7 && 0 <= cnew && cnew <= 7 && chessBoard[rnew][cnew] * movedPiece <= 0) {
                moves.push([rnew, cnew]);
            }
        }
    };

    if (pieceType === Piece.White.pawn) {
        // 1 for white, -1 for black
        const direction = movedPiece / Math.abs(movedPiece);
        if (row === 0 || row === 7) return false;
        
        if (chessBoard[row-direction][col] === Piece.empty) {
            moves.push([row-direction, col]);
            
            const doubleMove = direction === 1 && row === 6 || direction === -1 && row === 1;
            if (doubleMove && chessBoard[row-2*direction][col] === Piece.empty) {
                moves.push([row-2*direction, col]);
            }
        }
        if (col > 0 && chessBoard[row-direction][col-1] * movedPiece < 0) {
            moves.push([row-direction, col-1]);
        }
        if (col < 7 && chessBoard[row-direction][col+1] * movedPiece < 0) {
            moves.push([row-direction, col+1]);
        }

    } else if (pieceType === Piece.White.knight) {
        const deltas = [[1,2], [1,-2], [-1,2], [-1,-2], [2,1], [2,-1], [-2,1], [-2,-1]];
        pushIfDeltaOk(deltas);

    } else if (pieceType === Piece.White.king) {
        const deltas = [[-1,-1], [-1,0], [-1,1], [0,-1], [0,1], [1,-1], [1,0], [1,1]];
        pushIfDeltaOk(deltas);
        
    } else {
        const deltaDeltas = [];
        if (pieceType === Piece.White.bishop || pieceType === Piece.White.queen) {
            deltaDeltas.push([-1,-1, 0], [-1,1, 1], [1,-1, 2], [1,1, 3]);
        }
        if (pieceType === Piece.White.rook || pieceType === Piece.White.queen) {
            deltaDeltas.push([0,-1, 4], [0,1, 5], [-1,0, 6], [1,0, 7]);
        }
        const lastDeltas = Array(8).fill([0,0]);
        const deltas = [];

        let DEBUG_iters = 100;
        while (deltaDeltas.length, DEBUG_iters--) {
            for (const dd of deltaDeltas) {
                const prevDelta = lastDeltas[dd[2]];
                const drnew = dd[0] + prevDelta[0];
                const dcnew = dd[1] + prevDelta[1];
                
                const status = deltaStatus([drnew, dcnew]);
                if (status === "enemy" || status === "empty") {
                    deltas.push([drnew, dcnew]);
                    lastDeltas[dd[2]] = [drnew, dcnew];
                }
                if (status === "blocked" || status === "enemy") {
                    deltaDeltas.splice(deltaDeltas.indexOf(dd), 1);
                }
            }
        }
        if (DEBUG_iters === 0) console.log("DANGEROUS LOOP in getPossibleMoves");

        pushIfDeltaOk(deltas);
    }
    return moves;
};


const showPossibleMoves = () => {
    const moves = getPossibleMoves();
    if (!moves) return;

    for (const move of moves) {
        const row = move[0];
        const col = move[1];
        const square = getSquareElem(row, col);
        square.getElementsByClassName("moveIndicator")[0].classList.add("active");
    }
};


const tryMove = (row, col) => {
    const movedPiece = chessBoard[activeSquare[0]][activeSquare[1]];
    chessBoard[activeSquare[0]][activeSquare[1]] = Piece.empty;
    
    chessBoard[row][col] = movedPiece;

    updateSquare(...activeSquare);
    updateSquare(row, col);

    activeSquare = [null, null];
};

const squareClickFunction = (row, col) => {
    const columns = "abcdefgh";
    console.log(`Clicked: ${columns[col]}${8-row}`);
    
    for (elem of document.getElementsByClassName("moveIndicator")) {
        elem.classList.remove("active");
    }

    if (activeSquare[0] === row && activeSquare[1] === col) {
        getSquareElem(...activeSquare).classList.remove("selected");
        activeSquare = [null, null];
    } else if (activeSquare[0] === null && activeSquare[1] === null) {
        activeSquare = [row, col];
        getSquareElem(...activeSquare).classList.add("selected");
        showPossibleMoves();
    } else {
        getSquareElem(...activeSquare).classList.remove("selected");
        tryMove(row, col);
    }
};


createBoardElements();
updateAllSquares();