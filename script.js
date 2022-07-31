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

            trElem.appendChild(tdElem);
        }
        boardTable.appendChild(trElem);
    }
};


const getSquareElem = (row, col) => {
    const rowElem = boardTable.getElementsByTagName("tr")[row];
    const squareElem = rowElem.getElementsByTagName("td")[col];
    return squareElem;
}

const updateSquare = (row, col) => {
    const piece = chessBoard[row][col];
    const squareElem = getSquareElem(row, col);

    squareElem.innerText = pieceSymbol[piece];
};

const updateAllSquares = () => {
    for (let row=0; row<8; row++) {
        for (let col=0; col<8; col++) {
            updateSquare(row, col);
        }
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
    
    if (activeSquare[0] === row && activeSquare[1] === col) {
        getSquareElem(...activeSquare).classList.remove("selected");
        activeSquare = [null, null];
    } else if (activeSquare[0] === null && activeSquare[1] === null) {
        activeSquare = [row, col];
        getSquareElem(...activeSquare).classList.add("selected");
    } else {
        getSquareElem(...activeSquare).classList.remove("selected");
        tryMove(row, col);
    }
};


createBoardElements();
updateAllSquares();