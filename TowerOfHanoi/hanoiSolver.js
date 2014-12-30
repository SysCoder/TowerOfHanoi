
PEGS = ['a', 'b', 'c'];

//console.log(possibleMoves(['a', 'c', 'a']))
CornerEnum = {
    TOP : 0,
    LEFT : 1,
    RIGHT : 2
}

//console.log(figureOutTriangle(0, 'a', true));

//console.log(currentTriangle(['a', 'b', 'a']));
console.log(getNextMove(['a', 'c', 'a']));



function adapterToSolver(gameState) {
  solverGameState = [];
  
  for(var i = 0;i < gameState.length;i++) {
    for(var j = 0;j < gameState[0].length;j++) {
      solverGameState[gameState[i][j]] = pegNumberToPegLetter(i);
    }
  }
  return solverGameState;
}

function getMoveTuple(initialPosition, nextPosition) {
  reVal = [];
  
  for(var i = 0;i < initialPosition.length;i++) {
    if (initialPosition[i] !== nextPosition[i]) {
      reVal[reVal.length] = pegLetterToPegNumber(initialPosition[i]);
      reVal[reVal.length] = pegLetterToPegNumber(nextPosition[i]);
      break;
    }
  }
  return reVal;
}

function getNextMove(position) {
  var triangle = currentTriangle(position);
  var locationOnTriangle = triangle.indexOf(position[0]);
  
  // Top
  if (locationOnTriangle === 0  || locationOnTriangle === 1) {
    return [triangle[2], position[1], position[2]];
  } else if (locationOnTriangle === 2) {
    var possiblePositions = possibleMoves(position);
    var nextMovePosition = [];
    for (var i = 0;i < possiblePositions.length;i++) {
      console.log("Possible position: " + possiblePositions[i].slice(1));
      console.log("Position: " + position.slice(1));
      if (!eq(position.slice(1), possiblePositions[i].slice(1))) {
        nextMovePosition = possiblePositions[i];
        break;
      }
    }
    return nextMovePosition;
  }
}
  
function currentTriangle(position) {
  var currentTriangle = PEGS.slice(0);
  var forwards = false;
  var corner = currentTriangle.indexOf(position[position.length - 1]);
  for(var i = position.length - 1;i >= 1;i--) {
    currentRing = position[i];
    currentTriangle = figureOutTriangle(corner, currentRing, forwards);
    forwards = !forwards;
    corner = currentTriangle.indexOf(position[i - 1])
  }
  return currentTriangle;
}

function figureOutTriangle(corner, valueInCorner, forwards) {
  triangle = getTriangleThreeNodesValues(valueInCorner, forwards);
  if (corner === CornerEnum.RIGHT) {
    var firstElement = triangle[0];
    triangle.shift();
    triangle[triangle.length] = firstElement;
  }
  
  if (corner === CornerEnum.LEFT) {
    var lastElement = triangle[triangle.length - 1];
    triangle.length = triangle.length - 1;
    triangle.unshift(lastElement);
  }
  return triangle;
}

function getTriangleThreeNodesValues(valueInCorner, forwards) {
  reVal = [];
  indexInListOfPegs = PEGS.indexOf(valueInCorner);

  for(var i = 0;i < PEGS.length;i++) {
    reVal[reVal.length] = PEGS[(indexInListOfPegs + PEGS.length) % PEGS.length];
    if (forwards) {
      indexInListOfPegs++;
    } else {
      indexInListOfPegs--;
    }
    
  }
  return reVal;
}

function possibleMoves(gameState) {
  positions = [];
  for(var i = 0;i < gameState.length;i++) {
    Array.prototype.push.apply(positions, movesForRing(i, gameState));
  }
  return positions;
}

function movesForRing(ringSize, gameState) {
  var positions = [];
  // rings are ordered by ring sizes in gameState.
  // ring size 0 is at gameState[0].
  // The value at gameState[x] is the location where the ring is located.
  // moveToTry are the locations to try for the current ring.
  var movesToTry = otherValues(gameState[ringSize]);
  for(i = 0;i < movesToTry.length;i++) {
    var continueToken = false;
    // Check if the pieces an be move to movesToTry[i]
    // by checking if a smaller ring is already at that location.
    // If a smaller ring is at that location, then the current ring cannot go there.
    // Look all the way up to the current ring size.
    // No need to look further rings that is equal or greater than the ringSize
    // because the current ring size can go on top larger.
    // Therefore we stop at ringSize.
    // gameState[i] == gameState[ringSize] checks if there is a ring is on top of the current ring.
    for(j = 0;j < ringSize;j++) {
      console.log(gameState[j]);
      console.log(gameState[ringSize]);
      if (gameState[j] === movesToTry[i] || gameState[j] === gameState[ringSize]) {
        continueToken = true;
        continue;
      }
      
    }
    if(continueToken) {
      continue;
    }
    var newPosition = gameState.slice(0);
    newPosition[ringSize] = movesToTry[i];
    positions[positions.length] = newPosition;
  }
  return positions;
}

function otherValues(current) {
  var allValues = ['a', 'b', 'c'];
  return allValues.filter(function(element) { return element != current;});
}

function eq(a,b){return !(a<b || b<a);}

function pegLetterToPegNumber(peg) { return peg.charCodeAt(0) - 97;}
function pegNumberToPegLetter(peg) { return String.fromCharCode(97 + peg);}