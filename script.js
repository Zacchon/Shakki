const boardTable = document.getElementById("board");

const chessBoard = new Board(8, 8);
const WHITE = 1;
const BLACK = -1;
chessBoard.setRow([new Rook(BLACK), new Knight(BLACK), new Bishop(BLACK), new Queen(BLACK), new King(BLACK), new Bishop(BLACK), new Knight(BLACK), new Rook(BLACK)], 0);
chessBoard.setRow([new Pawn(BLACK), new Pawn(BLACK), new Pawn(BLACK), new Pawn(BLACK), new Pawn(BLACK), new Pawn(BLACK), new Pawn(BLACK), new Pawn(BLACK)], 1);
chessBoard.setRow([new Pawn(WHITE), new Pawn(WHITE), new Pawn(WHITE), new Pawn(WHITE), new Pawn(WHITE), new Pawn(WHITE), new Pawn(WHITE), new Pawn(WHITE)], 6);
chessBoard.setRow([new Rook(WHITE), new Knight(WHITE), new Bishop(WHITE), new Queen(WHITE), new King(WHITE), new Bishop(WHITE), new Knight(WHITE), new Rook(WHITE)], 7);


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
    const squareElem = getSquareElem(row, col);
    const pieceTextElem = squareElem.getElementsByClassName("pieceText")[0];

    pieceTextElem.innerText = chessBoard.state[row][col].getSymbol();
};

const updateAllSquares = () => {
    for (let row=0; row<8; row++) {
        for (let col=0; col<8; col++) {
            updateSquare(row, col);
        }
    }
};

const getPossibleMoves = () => {
    if (activeSquare[0] === null || !chessBoard.state[activeSquare[0]][activeSquare[1]].piece) return [];
    return chessBoard.state[activeSquare[0]][activeSquare[1]].piece.legalMoves();
};

const showPossibleMoves = () => {
    const moves = getPossibleMoves();
    if (!moves) return;

    for (const move of moves) {
        const [row, col] = move;
        const square = getSquareElem(row, col);
        square.getElementsByClassName("moveIndicator")[0].classList.add("active");
    }
};

/** 
 * Try moving a piece from the currently active square to (row, col). 
 * It is assumed that activeSquare is not empty.
 * */  
const tryMove = (row, col) => {
    const movedPiece = chessBoard.state[activeSquare[0]][activeSquare[1]].piece;
    if (!movedPiece) {
        activeSquare = [null, null];
        return;
    }
    
    chessBoard.state[activeSquare[0]][activeSquare[1]].piece = undefined;

    chessBoard.setPiece(movedPiece, row, col);

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

    // The currently active square was clicked
    if (activeSquare[0] === row && activeSquare[1] === col) {
        getSquareElem(...activeSquare).classList.remove("selected");
        activeSquare = [null, null];
    // A new active square was chosen
    } else if (activeSquare[0] === null && activeSquare[1] === null) {
        activeSquare = [row, col];
        getSquareElem(...activeSquare).classList.add("selected");
        showPossibleMoves();
    // Try moving a piece from the currently active square to the selected location 
    } else {
        getSquareElem(...activeSquare).classList.remove("selected");
        tryMove(row, col);
    }
};


createBoardElements();
updateAllSquares();