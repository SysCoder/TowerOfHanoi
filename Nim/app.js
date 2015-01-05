 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI");

Q.setup({ maximize: true })
 //.controls()
 .touch(Q.SPRITE_ALL);

var gameState = [6, 8];

var playerOneTurn = true;

var headsOfLines = [];

Q.Sprite.extend("Ball",{
  init: function(p) {
    console.log('Ball init');
    this._super(p, { 
      sheet: "player",
      shape: "ball", 
      vy:0,
      x: 200,
      y: 300,
      w: 40,
      h: 40,
      color: 'black',
      position: 0
    });
    
    this.removed = false;
    this.on("touchEnd");
  },
  cascadeDestroy: function() {
    if (this.removed) {
      return;
    }
    if (this.nextBall !== undefined) {
      this.nextBall.cascadeDestroy();
    }
    
    gameState[this.p.row] -= 1;
    this.off("touchEnd");
    this.removed = true;
    this.destroy();
    
  },
  
  touchEnd: function(touch) {
    console.log("Touch End event called");
    
    
    this.cascadeDestroy();
    console.log("Sum after removal: " + sumOfStones());
    if(sumOfStones() === 0) {
      Q.stageScene("endGame", 0);
    } else {
      playerOneTurn = !playerOneTurn;
      Q.stageScene("playerTurnText", 0);
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

Q.scene('playerTurnText',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: 40, fill: "rgba(0,0,0,0.5)"
  }));
         
  var text = "";
  if (playerOneTurn) {
    text = "Player One";
  } else {
    text = "Player Two";
  }
  
  var label = box.insert(new Q.UI.Text({x:10, y: -10, 
                                        label: text }));
  box.fit(20);
});

Q.scene('endGame',function(stage) {
  var box = stage.insert(new Q.UI.Container({
    x: Q.width/2, y: 100, fill: "rgba(0,0,0,0.5)"
  }));
         
  var text = "";
  if (playerOneTurn) {
    text = "Player One";
  } else {
    text = "Player Two";
  }
  
  var label = box.insert(new Q.UI.Text({x:10, y: -10, 
                                        label: text + " Wins!!" }));
  box.fit(20);
});

Q.scene("level1",function(stage) {
  var ball;
  var previousBall;
  for (var i = 0;i < gameState.length;i++)  {
    for (var j = 0;j < gameState[i];j++) {
      ball = new Q.Ball({x: 400 + 45 * j, y: 200 + 45 * i, row: i});
      if (previousBall !== undefined) {
        previousBall.nextBall = ball;
      }
      if (j === 0) {
        headsOfLines[i] = ball;
      }
      previousBall = ball;
      stage.insert(ball);
    }
    previousBall = undefined;
  }
});

function sumOfStones() {
  var sum = 0;
  for (var i = 0;i < gameState.length;i++)  {
    sum += gameState[i];
  }
  return sum;
}

Q.load("sprites.png", function() {
  Q.stageScene("level1", 1);
  Q.stageScene("playerTurnText", 0);
});



// Game solver
