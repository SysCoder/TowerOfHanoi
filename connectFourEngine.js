var gameState = 
  [[0, 0, 0, 0, 0, 0],
   [1, 1, 1, 1, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
  ];
  

printGameState(gameState);
console.log(dropPieceInColumn(1, 1, gameState));
printGameState(gameState);
console.log(dropPieceInColumn(2, 2, gameState));
printGameState(gameState);
   
console.log(searchForPieces(1,  1, 1, 1, 0, gameState, 0));

console.log(isSlotPartOfWinningPosition(gameState, 0, 1));

function dropPieceInColumn(column, piece, gameState) {
  var availableRow = lowestAvailablePositionInColumn(column, gameState);
  if (availableRow === -1) {
    return undefined;
  }
  gameState[column][availableRow] = piece;
  return isSlotPartOfWinningPosition(gameState, column, availableRow);
}

function lowestAvailablePositionInColumn(column, gameState) {
  var columnData = gameState[column];
  if (columnData[columnData.length - 1] !== 0) {
    return -1;
  }
  for(var i = columnData.length - 1;i >= 0;i--) {
    if (columnData[i] !== 0) {
      return i + 1;
    }
  }
  
  return 0;
}

function isSlotPartOfWinningPosition(gameState, column, row) {
  if (gameState[column][row] === 0) {
    return false;
  }
  // horizontal check
  sumLeft = searchForPieces(column - 1, row, 0, -1, gameState[column][row], gameState, 0);
  sumRight = searchForPieces(column + 1, row, 0, 1, gameState[column][row], gameState, 0);
  if (sumLeft + sumRight >= 3) {
    return true;
  }
  
  // positive diagonal check
  sumDown = searchForPieces(column, row - 1, -1, 0, gameState[column][row], gameState, 0);
  sumUp = searchForPieces(column, row + 1, 1, 0, gameState[column][row], gameState, 0);
  if (sumDown + sumUp >= 3) {
    return true;
  }
  
  // negative diagonal check
  sumLeftUp = searchForPieces(column - 1, row + 1, 1, -1, gameState[column][row], gameState, 0);
  sumRightDown = searchForPieces(column + 1, row - 1, -1, 1, gameState[column][row], gameState, 0);
  if (sumLeftUp + sumRightDown >= 3) {
    return true;
  }
    
  // vertical check
  
  sumUpRight = searchForPieces(column + 1, row + 1, 1, 1, gameState[column][row], gameState, 0);
  sumDownLeft = searchForPieces(column - 1, row - 1, -1, -1, gameState[column][row], gameState, 0);
  if (sumUpRight + sumDownLeft >= 3) {
    return true;
  }
  return false;
}

// Return how many pieces are the same in a given direction (rise/run)
function searchForPieces(column, row, rise, run, piece, gameState, count) {
  if (column < 0 || column > 6 || row < 0 || row > 5) {
    return count;
  }
  if (gameState[column][row] == piece) {
    return searchForPieces(column + run, row + rise, rise, run, piece, gameState, count + 1);
  } else {
    return count;
  }
}

function printGameState(gameState) {
  console.log("**********************")
  for(var i = 0;i < gameState.length;i++) {
    console.log(gameState[i]);
  }
}