 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI");

Q.setup({ maximize: true })
 //.controls()
 .touch(Q.SPRITE_ALL);

var gameState = [6, 8];

var headsOfLines = [];

Q.Sprite.extend("Ball",{
  init: function(p) {
    console.log('Ball init');
    this._super(p, { sheet: "player", shape: "ball", vy:0, x: 200 , y: 300, w: 40, h: 40, color: 'black', position: 0                      });
    
    
    this.on("touchEnd");
  },
  cascadeDestroy: function() {
    if (this.nextBall !== undefined) {
      this.nextBall.cascadeDestroy();
    }
    this.destroy();
  },
  
  touchEnd: function(touch) {
    console.log("Touch End event called");
    this.cascadeDestroy();
  },
  
  draw: function(ctx) {
    ctx.fillStyle = this.p.color;
    ctx.beginPath();
    ctx.arc(0, 0, 20, 0, Math.PI*2, true); 
    ctx.closePath();
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
  var ball;
  var previousBall;
  for (var i = 0;i < gameState.length;i++)  {
    for (var j = 0;j < gameState[i];j++) {
      ball = new Q.Ball({x: 400 + 45 * j, y: 200 + 45 * i});
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



Q.load("sprites.png", function() {
  Q.stageScene("level1", 1);
});



// Game solver
