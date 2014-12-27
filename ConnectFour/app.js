var BALL_DIAMETER = 40,
    GRID_BOTTOM = 400,
    GRID_TOP = 90,
    LINE_THICKNESS = 5,
    WIDTH = 500,
    HEIGHT = 350;

var gameState = 
  [[0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
   [0, 0, 0, 0, 0, 0],
  ];
   
var gameEnded = false;

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ 
          width:   WIDTH,
          height:  HEIGHT
        })
        .controls().touch();
        
Q.Sprite.extend("Player",{
  init: function(p) {
    console.log('Player init');
    this._super(p, { sheet: "player", vy:0, x: BALL_DIAMETER/2 , y: (BALL_DIAMETER / 2), w: BALL_DIAMETER, h: BALL_DIAMETER, color: 'black', position: 0 });
    
    
    this.on("hit.sprite",function(collision) {
      if(collision.obj.isA("Tower")) {
        Q.stageScene("endGame",1, { label: "You Won!" }); 
        this.destroy();
      }
    });
    if (this.p.color === "yellow") {
       var self = this;
       setTimeout(function () {self.computerMove()}, 1000);
    } else {
     Q.input.on("down", this, "newPiece");
     Q.input.on("fire", this, "newPiece");
     Q.input.on("right", this, "moveRight");
     Q.input.on("left", this, "moveLeft");    
     Q.input.on("up", this, "computerMove"); 
   }
    
  },
  computerMove: function() {
    this.p.position  = nextMove(gameState, this.p.color == "red" ? 1 : 2);
   console.log("The position that the computer chose: " + this.p.position);
   var attemptToDropPiece = dropPieceInColumn(this.p.position, this.p.color == "red" ? 1 : 2, gameState);
   
   if(attemptToDropPiece === undefined || gameEnded) {
     return;
    } else if (attemptToDropPiece) {
       gameEnded = true;
       Q.stageScene("endGame", 2, { label: "Computer Won!" });
    }
    //this.p.position  = 5;
    this.p.x = (BALL_DIAMETER / 2) + this.p.position  * BALL_DIAMETER;
    this.add('2d');
   Q.stage().insert(new Q.Player({color: this.p.color == "yellow" ? "red" : "yellow", x: this.p.x, position: this.p.position}));
    Q.input.off("down", this);
    Q.input.off("left", this);
    Q.input.off("right", this);
   Q.input.off("up", this);
  },
  newPiece: function() {
   attemptToDropPiece = dropPieceInColumn(this.p.position, this.p.color == "red" ? 1 : 2, gameState);
   
    if(attemptToDropPiece === undefined || gameEnded) {
     return;
    } else if (attemptToDropPiece) {
       gameEnded = true;
       Q.stageScene("endGame", 2, { label: this.p.color.toUpperCase() + " Won!" });
    }
    
    this.add('2d');
    Q.stage().insert(new Q.Player({color: this.p.color == "yellow" ? "red" : "yellow", x: this.p.x, position: this.p.position}));
    Q.input.off("down", this);
    Q.input.off("fire", this, "newPiece");
    Q.input.off("left", this);
    Q.input.off("right", this);
    Q.input.off("up", this);
  },
  moveRight: function() {
    if (this.p.x + (BALL_DIAMETER) < (BALL_DIAMETER + LINE_THICKNESS) * 6) {
      this.p.position += 1;
     	this.p.x = (BALL_DIAMETER / 2) + this.p.position * BALL_DIAMETER;
    }
  },
  moveLeft: function() {
    if (this.p.x - (BALL_DIAMETER) > 0) {
      this.p.position -= 1;
      this.p.x = (BALL_DIAMETER / 2) + this.p.position * BALL_DIAMETER;
    }
  },
  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI*2, true); 
    ctx.closePath();
    ctx.fill();
    
  }
});

Q.scene("backdrop",function(stage) {
  stage.insert(new Q.Player({color: "red", position: 0}));
  
  stage.insert(getLineObject(0, HEIGHT, WIDTH, LINE_THICKNESS));
  //stage.insert(new Q.Tower({ x: 180, y: 50 })) // WTF?  This throws an error
});

function getLineObject (x, y, w, h){
  var line = new Q.Sprite({ x:x, y:y, w:w * 2, h:h + 5});
  console.log('drawing line with width of ', w, 'px and height of ', h ,'px');
  
  return line;
}

Q.scene("Slots",function(stage) {
  var width = BALL_DIAMETER + LINE_THICKNESS;
  var height = BALL_DIAMETER + LINE_THICKNESS;
  var x = 0;
  //var y = 560 - LINE_THICKNESS + 3;
  var y = HEIGHT - height;
  for (var i = 0; i < 7; i++) {
    for (var j = 0; j < 6; j++) {
      stage.insert(new Q.Slot({Color: "red", x: x + BALL_DIAMETER * i, y: y - BALL_DIAMETER *j}));
    }
  }
  
});

Q.Sprite.extend("Slot",{
  init: function(p) {
    console.log('Player init');
    this._super(p, { sheet: "player", vy:0, x: (WIDTH / 4), y: (BALL_DIAMETER / 2), w: BALL_DIAMETER, h: BALL_DIAMETER, color: 'black' });
    
  },

  draw: function(ctx) {
    var inMemoryCanvas = document.createElement('canvas');
    inMemoryCanvasCtx = inMemoryCanvas.getContext("2d");

    inMemoryCanvasCtx.fillStyle = "orange";
    inMemoryCanvasCtx.fillRect(0,0,40,40);
    inMemoryCanvasCtx.globalCompositeOperation = 'destination-out';
    inMemoryCanvasCtx.beginPath();
    inMemoryCanvasCtx.arc(20,20,17,0,2*Math.PI);
    inMemoryCanvasCtx.fill();
    
    ctx.drawImage(inMemoryCanvas, 0, 0);
  }
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: Q.height/2, fill: "rgba(0,0,0,0.5)"
  }));
  
  var button = box.insert(new Q.UI.Button({ x: 0, y: 0, fill: "#CCCCCC",
                                           label: "Play Again" }))         
  var label = box.insert(new Q.UI.Text({x:10, y: -10 - button.p.h, 
                                        label: stage.options.label }));
  button.on("click",function() {
   gameEnded = false;
    Q.clearStages();
    Q.stageScene('backdrop');
    Q.stageScene("Slots",1);
   gameState = 
      [[0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
       [0, 0, 0, 0, 0, 0],
      ];
  });
  box.fit(20);
});

Q.load("sprites.png", function() {
  Q.stageScene("backdrop");
  Q.stageScene("Slots",1);
});

// Game Engine
function nextMove(gameState, player) {
  console.log('==============Looking for move ============');
  var moves = availableMoves(gameState);
  var otherPlayer = player === 1 ? 2 : 1;
  console.log("The number of moves: " + moves.length)
  var maxMove = -1;
  var maxValue = -100;
  var minMove = -1;
  var minValue = 100;
  
  for (var i = 0;i < moves.length;i++) {
    var newGameState = createNewGameState(moves[i], player, gameState);
    var moveValue = minMaxAlg(newGameState, moves[i], otherPlayer, 5);
    
    if (moveValue > maxValue) {
      maxValue = moveValue;
      maxMove = moves[i];
    }

    if (moveValue < minValue) {
      minValue = moveValue;
      minMove = moves[i];
    }
    
  }
  //printGameState(gameState);
  if (player == 1) {
    console.log("!!!!Grand Max value: " + maxValue);
    console.log("!!!!Grand Max move: " + maxMove);
    return maxMove;
  } else {
    console.log("!!!!Grand Min value: " + minValue);
    console.log("!!!!Grand Min move: " + minMove);
    return minMove;
  }
}

function minMaxAlg(gameStateInMethod, lastMove, player, depthToGo) {
  if (depthToGo === 3) {
    //printGameState(gameStateInMethod);
    //console.log("$$$$$$$$$$$$$$$4");
  }
  var row = lowestAvailablePositionInColumn(lastMove, gameStateInMethod);
  
  // If this iteration is given a winning position, then the other player
  // has won.
  if (isSlotPartOfWinningPosition(gameStateInMethod, lastMove, row - 1)) {
    return player == 1 ? -1 : 1;
  }
  if (depthToGo === 0) {
    return 0;
  }
  var moves = availableMoves(gameStateInMethod);
  var otherPlayer = player === 1 ? 2 : 1;

  var maxMove = -1;
  var maxValue = -100;
  var minMove = -1;
  var minValue = 100;
  
  
  for (var i = 0;i < moves.length;i++) {
    var newGameState = createNewGameState(moves[i], player, gameStateInMethod);
    var moveValue = minMaxAlg(newGameState, moves[i], otherPlayer, depthToGo - 1);
    if (depthToGo === 5) {
      //console.log("Move value: " + moveValue);
      //printGameState(newGameState);
      //console.log("$$$$$$$$$$$$$$$$$$$$$");
    }
    
    if (moveValue > maxValue) {
      maxValue = moveValue;
      maxMove = moves[i];
    }

    if (moveValue < minValue) {
      minValue = moveValue;
      minMove = moves[i];
    }
  }
  if (player == 1) {
    if (depthToGo === 5) {
      //console.log("Max value: " + maxValue);
      //console.log("Max move: " + maxMove);
    }
    return maxValue;
  } else {
    if (depthToGo === 5) {
      //console.log("Min value: " + maxValue);
      //console.log("Min move: " + minMove);
    }
    return minValue;
  }
}

function createNewGameState(move, player, gameState) {
  var newGameState = [];
  
  for (var i = 0;i < gameState.length;i++) {
    newGameState[newGameState.length] = gameState[i].slice(0);
  }
  dropPieceInColumn(move, player, newGameState);
  return newGameState;
}

function availableMoves(gameState) {
  var moves = [];
  for(var i = 0;i < 7;i++) {
    if (gameState[i][gameState[i].length - 1] === 0) {
      moves[moves.length] = i;
    }
  }
  return moves;
}

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
  //printGameState(gameState);
  return 0;
}

function isSlotPartOfWinningPosition(gameState, column, row) {
  if (gameState[column][row] === 0) {
    return false;
  }
  // horizontal check
  var sumLeft = searchForPieces(column - 1, row, 0, -1, gameState[column][row], gameState, 0);
  var sumRight = searchForPieces(column + 1, row, 0, 1, gameState[column][row], gameState, 0);
  if (sumLeft + sumRight >= 3) {
    return true;
  }
  
  // positive diagonal check
  var sumDown = searchForPieces(column, row - 1, -1, 0, gameState[column][row], gameState, 0);
  var sumUp = searchForPieces(column, row + 1, 1, 0, gameState[column][row], gameState, 0);
  if (sumDown + sumUp >= 3) {
    return true;
  }
  
  // negative diagonal check
  var sumLeftUp = searchForPieces(column - 1, row + 1, 1, -1, gameState[column][row], gameState, 0);
  var sumRightDown = searchForPieces(column + 1, row - 1, -1, 1, gameState[column][row], gameState, 0);
  if (sumLeftUp + sumRightDown >= 3) {
    return true;
  }
    
  // vertical check
  
  var sumUpRight = searchForPieces(column + 1, row + 1, 1, 1, gameState[column][row], gameState, 0);
  var sumDownLeft = searchForPieces(column - 1, row - 1, -1, -1, gameState[column][row], gameState, 0);
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
  //console.log("**********************")
  for(var i = 0;i < gameState.length;i++) {
    console.log(gameState[i]);
  }
}