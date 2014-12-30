 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()

var gameState = [[],[],[]];

var activeRing;

Q.Sprite.extend("Ring", {
  init: function(p) {
    this.onPeg = false;
    this._super(p, { x: 100, y: 50, w:100 * 2, h:20, color: "black"});
    
    if (this.p.color === 'red') {
      this.p.w -= 50;
      this.p.x += 25
    }
    
    if (this.p.color === 'blue') {
      this.p.w -= 100;
      this.p.x += 50;
    }
    
    if (this.p.color === 'green') {
      this.p.w -= 150;
      this.p.x += 75;
    }
    
    if (this.p.start === true) {
      this.drop();
    }
  },
 
  getRingSize: function() {
    if (this.p.color === 'green') {
      return 0;
    } else if (this.p.color === 'blue') {
      return 1;
    } else if (this.p.color === 'red') {
      return 2;
    }
    return -1;
  },
  
  drop: function(p) {
    this.add('2d');
  },
  
  moveRight: function(p) {
    this.p.x += 250;
  },
  
  moveLeft: function(p) {
    this.p.x -= 250;
  },
  
  // this activates the piece
  moveUp: function(p) {
    this.del('2d');
    this.p.y = 50;
  },
  
  draw: function(ctx) {
     this._super(ctx);
  },
});

Q.Sprite.extend("UnderHover", {
  init: function(p) {
    this._super(p, { x: 100, y: 50, w:100 * 2, h:20, color: "black"});
    this.p.y += this.p.w + 50;
    this.addKeyListeners();
    this.position = 0;
  },
  
  moveUp: function(p) {
    // Alread holding a piece
    if(activeRing !== undefined) {
      return;
    }
    activeRing = gameState[this.position][gameState[this.position].length - 1];
    gameState[this.position].length = gameState[this.position].length - 1;
    activeRing.moveUp();
  },
  
  moveDown: function(p) {
    // Alread holding a piece
    if(activeRing === undefined) {
      return;
    }
    if(gameState[this.position].length > 0 && 
       gameState[this.position][gameState[this.position].length - 1].p.w < activeRing.p.w) {
      return;
    }
    gameState[this.position][gameState[this.position].length] = activeRing;
    
    activeRing.drop();
    activeRing = undefined;
    
    
    if(gameState[2].length == 3) {
      Q.stageScene("endGame", 2, { label: "You Did It!" });
    }
  },
  
  moveRight: function(p) {
    if (this.position < 2) {
      this.p.x += 250;
      this.position += 1;
      if(activeRing !== undefined) {
        activeRing.moveRight();
       }
    }

  },
  
  moveLeft: function(p) {
    if (this.position > 0) {
      this.p.x -= 250;
      this.position -= 1;
      if(activeRing !== undefined) {
        activeRing.moveLeft();
      }
    }
    
  },
  
  moveToPeg: function(peg) {
    if (peg === 0) {
      this.moveLeft();
      this.moveLeft();
    }
    
    if (peg === 2) {
      this.moveRight();
      this.moveRight();
    }
    
    if (peg === 1) {
      this.moveRight();
      this.moveRight();
      this.moveLeft();
    }
  },
  
  addKeyListeners: function(p) {
    Q.input.on("right", this, "moveRight");
    Q.input.on("left", this, "moveLeft");
    Q.input.on("up", this, "moveUp");
    Q.input.on("fire", this, "moveUp");
    Q.input.on("down", this, "moveDown");
    Q.input.on("action", this, "moveDown");
    
  },
});

Q.Sprite.extend("Peg", {
  init: function(p) {
    this._super(p, { x: 100, y: 50, w:100 * 2, h:20, color: "black"});
    this.p.y += this.p.w;
  },
  draw: function(ctx) {
     this._super(ctx);
     ctx.rect(-(this.p.h/2), -this.p.w, this.p.h, this.p.w);
     ctx.fillStyle = this.p.color;
     ctx.fill();
  }
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
         
  var label = box.insert(new Q.UI.Text({x:10, y: -10, 
                                        label: stage.options.label }));
  button.on("click",function() {

  });
  
  box.fit(20);
});

Q.scene("level1",function(stage) {
  stage.insert(new Q.Peg({x: 300}));
  stage.insert(new Q.Peg({x: 550}));
  stage.insert(new Q.Peg({x: 800}));
  var startFirstPeg = [new Q.Ring({x: 300, y: 150, color: 'red', start: true}), new Q.Ring({x: 300, y: 100, color: 'blue', start: true}),new Q.Ring({x: 300, y: 50, color: 'green', start: true})]
  
  gameState[0] = startFirstPeg;
  
  
  stage.insert(startFirstPeg[2]);
  stage.insert(startFirstPeg[1]);
  stage.insert(startFirstPeg[0]);
  var hoverPiece = new Q.UnderHover({x: 300, h: 5});
  stage.insert(new Q.UI.Button({
      label: "Another Button",
      y: 100,
      x: 1000,
      fill: "#990000",
      border: 5,
      shadow: 10,
      shadowColor: "rgba(0,0,0,0.5)",
    }, function() {
      makeNextBestMove(gameState, hoverPiece);
    }));
  
  stage.insert(hoverPiece);
});

function makeNextBestMove(gameState, hoverPiece) {
  console.log("Gamestate: " + gameState);
  console.log("HoverPiece: " + hoverPiece);
  var solverState = adapterToSolver(gameState);
  console.log(solverState);
  var nextMoveSolverState = getNextMove(solverState);
    
  console.log(nextMoveSolverState);
  var moveTuple = getMoveTuple(solverState, nextMoveSolverState);
  console.log(moveTuple);
}

Q.load("sprites.png", function() {
  Q.stageScene("level1", 1);
});



// Game solver



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
  var solverGameState = [];
  
  for(var i = 0;i < gameState.length;i++) {
    for(var j = 0;j < gameState[i].length;j++) {
      console.log("Put location: " + gameState[i][j]);
      solverGameState[gameState[i][j].getRingSize()] = pegNumberToPegLetter(i);
    }
  }
  console.log("Solver format: " + solverGameState);
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