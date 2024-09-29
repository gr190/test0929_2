{\rtf1\ansi\ansicpg932\cocoartf2761
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\paperw11900\paperh16840\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 const BOARD_SIZE = 8;\
const EMPTY = 0;\
const BLACK = 1;\
const WHITE = 2;\
const HUMAN = BLACK;\
const AI = WHITE;\
\
let board = [];\
let currentPlayer = BLACK;\
let gameOver = false;\
let aiLevel = 'medium';\
let timeLimit = 0;\
let timer;\
let remainingTime;\
\
function initializeBoard() \{\
    board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(EMPTY));\
    const mid = BOARD_SIZE / 2;\
    board[mid-1][mid-1] = WHITE;\
    board[mid-1][mid] = BLACK;\
    board[mid][mid-1] = BLACK;\
    board[mid][mid] = WHITE;\
\}\
\
function renderBoard() \{\
    const boardElement = document.getElementById('board');\
    boardElement.innerHTML = '';\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            const cell = document.createElement('div');\
            cell.className = 'cell';\
            cell.onclick = () => makeMove(i, j);\
            if (board[i][j] !== EMPTY) \{\
                const disc = document.createElement('div');\
                disc.className = `disc $\{board[i][j] === BLACK ? 'black' : 'white'\}`;\
                cell.appendChild(disc);\
            \}\
            boardElement.appendChild(cell);\
        \}\
    \}\
    updateScore();\
    updateStatus();\
\}\
\
function updateScore() \{\
    let blackCount = 0;\
    let whiteCount = 0;\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (board[i][j] === BLACK) blackCount++;\
            if (board[i][j] === WHITE) whiteCount++;\
        \}\
    \}\
    document.getElementById('black-score').textContent = `\uc0\u40658 : $\{blackCount\}`;\
    document.getElementById('white-score').textContent = `\uc0\u30333 : $\{whiteCount\}`;\
\}\
\
function updateStatus() \{\
    const statusElement = document.getElementById('status');\
    if (gameOver) \{\
        const blackCount = board.flat().filter(cell => cell === BLACK).length;\
        const whiteCount = board.flat().filter(cell => cell === WHITE).length;\
        if (blackCount > whiteCount) \{\
            showResult('\uc0\u12503 \u12524 \u12452 \u12516 \u12540 \u12398 \u21213 \u21033 !');\
        \} else if (whiteCount > blackCount) \{\
            showResult('AI\uc0\u12398 \u21213 \u21033 !');\
        \} else \{\
            showResult('\uc0\u24341 \u12365 \u20998 \u12369 !');\
        \}\
    \} else \{\
        statusElement.textContent = `\uc0\u29694 \u22312 \u12398 \u25163 \u30058 : $\{currentPlayer === HUMAN ? '\u12503 \u12524 \u12452 \u12516 \u12540 ' : 'AI'\}`;\
    \}\
\}\
\
function showResult(message) \{\
    gameOver = true;\
    const modal = document.getElementById('result-modal');\
    const messageElement = document.getElementById('result-message');\
    messageElement.textContent = message;\
    modal.classList.remove('hidden');\
\}\
\
function hideResult() \{\
    const modal = document.getElementById('result-modal');\
    modal.classList.add('hidden');\
\}\
\
function isValidMove(row, col, player) \{\
    if (board[row][col] !== EMPTY) return false;\
\
    const directions = [\
        [-1, -1], [-1, 0], [-1, 1],\
        [0, -1],           [0, 1],\
        [1, -1],  [1, 0],  [1, 1]\
    ];\
\
    for (const [dx, dy] of directions) \{\
        let x = row + dx;\
        let y = col + dy;\
        let flipped = false;\
\
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) \{\
            if (board[x][y] === EMPTY) break;\
            if (board[x][y] === player) \{\
                if (flipped) return true;\
                break;\
            \}\
            flipped = true;\
            x += dx;\
            y += dy;\
        \}\
    \}\
\
    return false;\
\}\
\
function makeMove(row, col) \{\
    if (gameOver || currentPlayer !== HUMAN || !isValidMove(row, col, currentPlayer)) return;\
\
    flipDiscs(row, col, currentPlayer);\
    currentPlayer = AI;\
    renderBoard();\
    clearInterval(timer);\
\
    if (canMove(currentPlayer)) \{\
        setTimeout(makeAIMove, 500);\
    \} else \{\
        currentPlayer = HUMAN;\
        if (!canMove(currentPlayer)) \{\
            gameOver = true;\
            renderBoard();\
            return;\
        \}\
        renderBoard();\
        startTimer();\
    \}\
\}\
\
function flipDiscs(row, col, player) \{\
    board[row][col] = player;\
\
    const directions = [\
        [-1, -1], [-1, 0], [-1, 1],\
        [0, -1],           [0, 1],\
        [1, -1],  [1, 0],  [1, 1]\
    ];\
\
    for (const [dx, dy] of directions) \{\
        let x = row + dx;\
        let y = col + dy;\
        const toFlip = [];\
\
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) \{\
            if (board[x][y] === EMPTY) break;\
            if (board[x][y] === player) \{\
                for (const [fx, fy] of toFlip) \{\
                    board[fx][fy] = player;\
                \}\
                break;\
            \}\
            toFlip.push([x, y]);\
            x += dx;\
            y += dy;\
        \}\
    \}\
\}\
\
function canMove(player) \{\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (isValidMove(i, j, player)) \{\
                return true;\
            \}\
        \}\
    \}\
    return false;\
\}\
\
function makeAIMove() \{\
    const moves = [];\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (isValidMove(i, j, AI)) \{\
                const score = evaluateMove(i, j);\
                moves.push(\{ row: i, col: j, score: score \});\
            \}\
        \}\
    \}\
\
    if (moves.length > 0) \{\
        let bestMove;\
        switch (aiLevel) \{\
            case 'god':\
                bestMove = minimaxMove(AI, 5); // \uc0\u28145 \u12373 5\u12398 \u12511 \u12491 \u12510 \u12483 \u12463 \u12473 \
                break;\
            case 'very-hard':\
                bestMove = minimaxMove(AI, 4); // \uc0\u28145 \u12373 4\u12398 \u12511 \u12491 \u12510 \u12483 \u12463 \u12473 \
                break;\
            case 'hard':\
                bestMove = minimaxMove(AI, 3); // \uc0\u28145 \u12373 3\u12398 \u12511 \u12491 \u12510 \u12483 \u12463 \u12473 \
                break;\
            case 'medium':\
                moves.sort((a, b) => b.score - a.score);\
                bestMove = moves[Math.floor(Math.random() * Math.min(3, moves.length))];\
                break;\
            case 'easy':\
                bestMove = moves[Math.floor(Math.random() * moves.length)];\
                break;\
            default:\
                bestMove = moves[Math.floor(Math.random() * moves.length)];\
        \}\
        flipDiscs(bestMove.row, bestMove.col, AI);\
    \}\
\
    currentPlayer = HUMAN;\
    if (!canMove(currentPlayer)) \{\
        currentPlayer = AI;\
        if (!canMove(currentPlayer)) \{\
            gameOver = true;\
        \}\
    \}\
\
    renderBoard();\
    startTimer();\
\}\
\
function evaluateMove(row, col) \{\
    // \uc0\u12471 \u12531 \u12503 \u12523 \u12394 \u35413 \u20385 \u38306 \u25968 \u65306 \u35282 \u12289 \u12456 \u12483 \u12472 \u12289 \u12381 \u12398 \u20182 \u12398 \u20301 \u32622 \u12395 \u22522 \u12389 \u12367 \u37325 \u12415 \u20184 \u12369 \
    const weights = [\
        [100, -20, 10, 5, 5, 10, -20, 100],\
        [-20, -50, -2, -2, -2, -2, -50, -20],\
        [10, -2, -1, -1, -1, -1, -2, 10],\
        [5, -2, -1, -1, -1, -1, -2, 5],\
        [5, -2, -1, -1, -1, -1, -2, 5],\
        [10, -2, -1, -1, -1, -1, -2, 10],\
        [-20, -50, -2, -2, -2, -2, -50, -20],\
        [100, -20, 10, 5, 5, 10, -20, 100]\
    ];\
    return weights[row][col];\
\}\
\
function minimaxMove(player, depth) \{\
    let bestScore = -Infinity;\
    let move = null;\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (isValidMove(i, j, player)) \{\
                const tempBoard = JSON.parse(JSON.stringify(board));\
                flipDiscsForMinimax(i, j, player, tempBoard);\
                const score = minimax(tempBoard, depth - 1, false, player, AI);\
                if (score > bestScore) \{\
                    bestScore = score;\
                    move = \{ row: i, col: j \};\
                \}\
            \}\
        \}\
    \}\
    return move || randomMove(player);\
\}\
\
function minimax(boardState, depth, isMaximizing, originalPlayer, aiPlayer) \{\
    if (depth === 0 || isGameOver(boardState)) \{\
        return evaluateBoard(boardState, aiPlayer);\
    \}\
\
    if (isMaximizing) \{\
        let maxEval = -Infinity;\
        for (let i = 0; i < BOARD_SIZE; i++) \{\
            for (let j = 0; j < BOARD_SIZE; j++) \{\
                if (isValidMoveState(boardState, i, j, aiPlayer)) \{\
                    const newBoard = JSON.parse(JSON.stringify(boardState));\
                    flipDiscsForMinimax(i, j, aiPlayer, newBoard);\
                    const evalScore = minimax(newBoard, depth - 1, false, originalPlayer, aiPlayer);\
                    maxEval = Math.max(maxEval, evalScore);\
                \}\
            \}\
        \}\
        return maxEval;\
    \} else \{\
        let minEval = Infinity;\
        const opponent = originalPlayer === AI ? HUMAN : AI;\
        for (let i = 0; i < BOARD_SIZE; i++) \{\
            for (let j = 0; j < BOARD_SIZE; j++) \{\
                if (isValidMoveState(boardState, i, j, opponent)) \{\
                    const newBoard = JSON.parse(JSON.stringify(boardState));\
                    flipDiscsForMinimax(i, j, opponent, newBoard);\
                    const evalScore = minimax(newBoard, depth - 1, true, originalPlayer, aiPlayer);\
                    minEval = Math.min(minEval, evalScore);\
                \}\
            \}\
        \}\
        return minEval;\
    \}\
\}\
\
function evaluateBoard(boardState, aiPlayer) \{\
    let score = 0;\
    const weights = [\
        [100, -20, 10, 5, 5, 10, -20, 100],\
        [-20, -50, -2, -2, -2, -2, -50, -20],\
        [10, -2, -1, -1, -1, -1, -2, 10],\
        [5, -2, -1, -1, -1, -1, -2, 5],\
        [5, -2, -1, -1, -1, -1, -2, 5],\
        [10, -2, -1, -1, -1, -1, -2, 10],\
        [-20, -50, -2, -2, -2, -2, -50, -20],\
        [100, -20, 10, 5, 5, 10, -20, 100]\
    ];\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (boardState[i][j] === aiPlayer) \{\
                score += weights[i][j];\
            \} else if (boardState[i][j] === (aiPlayer === BLACK ? WHITE : BLACK)) \{\
                score -= weights[i][j];\
            \}\
        \}\
    \}\
    return score;\
\}\
\
function isGameOver(boardState) \{\
    return !canMoveState(boardState, HUMAN) && !canMoveState(boardState, AI);\
\}\
\
function flipDiscsForMinimax(row, col, player, boardState) \{\
    boardState[row][col] = player;\
\
    const directions = [\
        [-1, -1], [-1, 0], [-1, 1],\
        [0, -1],           [0, 1],\
        [1, -1],  [1, 0],  [1, 1]\
    ];\
\
    for (const [dx, dy] of directions) \{\
        let x = row + dx;\
        let y = col + dy;\
        const toFlip = [];\
\
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) \{\
            if (boardState[x][y] === EMPTY) break;\
            if (boardState[x][y] === player) \{\
                for (const [fx, fy] of toFlip) \{\
                    boardState[fx][fy] = player;\
                \}\
                break;\
            \}\
            toFlip.push([x, y]);\
            x += dx;\
            y += dy;\
        \}\
    \}\
\}\
\
function canMoveState(boardState, player) \{\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (isValidMoveState(boardState, i, j, player)) \{\
                return true;\
            \}\
        \}\
    \}\
    return false;\
\}\
\
function isValidMoveState(boardState, row, col, player) \{\
    if (boardState[row][col] !== EMPTY) return false;\
\
    const directions = [\
        [-1, -1], [-1, 0], [-1, 1],\
        [0, -1],           [0, 1],\
        [1, -1],  [1, 0],  [1, 1]\
    ];\
\
    for (const [dx, dy] of directions) \{\
        let x = row + dx;\
        let y = col + dy;\
        let flipped = false;\
\
        while (x >= 0 && x < BOARD_SIZE && y >= 0 && y < BOARD_SIZE) \{\
            if (boardState[x][y] === EMPTY) break;\
            if (boardState[x][y] === player) \{\
                if (flipped) return true;\
                break;\
            \}\
            flipped = true;\
            x += dx;\
            y += dy;\
        \}\
    \}\
\
    return false;\
\}\
\
function randomMove(player) \{\
    const validMoves = [];\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (isValidMove(i, j, player)) \{\
                validMoves.push(\{ row: i, col: j \});\
            \}\
        \}\
    \}\
    if (validMoves.length > 0) \{\
        return validMoves[Math.floor(Math.random() * validMoves.length)];\
    \}\
    return null;\
\}\
\
document.getElementById('start-game').addEventListener('click', () => \{\
    aiLevel = document.getElementById('ai-level').value;\
    timeLimit = parseInt(document.getElementById('time-limit').value);\
    initializeBoard();\
    renderBoard();\
    gameOver = false;\
    currentPlayer = HUMAN;\
    hideResult();\
    startTimer();\
\});\
\
document.getElementById('restart-game').addEventListener('click', () => \{\
    initializeBoard();\
    renderBoard();\
    gameOver = false;\
    currentPlayer = HUMAN;\
    hideResult();\
    startTimer();\
\});\
\
function startTimer() \{\
    clearInterval(timer);\
    if (timeLimit > 0 && !gameOver) \{\
        remainingTime = timeLimit;\
        updateTimerDisplay();\
        timer = setInterval(() => \{\
            remainingTime--;\
            updateTimerDisplay();\
            if (remainingTime <= 0) \{\
                clearInterval(timer);\
                makeRandomMove();\
            \}\
        \}, 1000);\
    \} else \{\
        document.getElementById('timer').textContent = '';\
    \}\
\}\
\
function updateTimerDisplay() \{\
    const timerElement = document.getElementById('timer');\
    timerElement.textContent = `\uc0\u27531 \u12426 \u26178 \u38291 : $\{remainingTime\}\u31186 `;\
\}\
\
function makeRandomMove() \{\
    const validMoves = [];\
    for (let i = 0; i < BOARD_SIZE; i++) \{\
        for (let j = 0; j < BOARD_SIZE; j++) \{\
            if (isValidMove(i, j, HUMAN)) \{\
                validMoves.push(\{ row: i, col: j \});\
            \}\
        \}\
    \}\
    if (validMoves.length > 0) \{\
        const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];\
        makeMove(randomMove.row, randomMove.col);\
    \}\
\}\
\
// \uc0\u21021 \u26399 \u21270 \
initializeBoard();\
renderBoard();\
}