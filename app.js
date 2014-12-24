var BALL_DIAMETER = 40,
    GRID_BOTTOM = 400,
    GRID_TOP = 90,
    LINE_THICKNESS = 5,
    WIDTH = 500,
    HEIGHT = 400;

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
    this._super(p, { sheet: "player", vy:0, x: BALL_DIAMETER + BALL_DIAMETER/2 , y: (BALL_DIAMETER / 2), w: BALL_DIAMETER, h: BALL_DIAMETER, color: 'black' });
    
    
    this.on("hit.sprite",function(collision) {
      if(collision.obj.isA("Tower")) {
        Q.stageScene("endGame",1, { label: "You Won!" }); 
        this.destroy();
      }
    });
    Q.input.on("down", this, "newPiece");
    Q.input.on("right", this, "moveRight");
    Q.input.on("left", this, "moveLeft");    
  },
  newPiece: function() {
    this.add('2d');
    Q.stage().insert(new Q.Player({color: this.p.color == "yellow" ? "red" : "yellow", x: this.p.x}));
    Q.input.off("down", this);
    Q.input.off("left", this);
    Q.input.off("right", this);
  },
  moveRight: function() {
   	this.p.x = this.p.x + (BALL_DIAMETER);
    Q.input.off("down", this, "moveRight");
  },
  moveLeft: function() {
    this.p.x = this.p.x - (BALL_DIAMETER);
    Q.input.off("down", this, "moveLeft");
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
  stage.insert(new Q.Player({color: "red"}));
  
  stage.insert(getLineObject(0, HEIGHT, WIDTH, LINE_THICKNESS));
  //stage.insert(new Q.Tower({ x: 180, y: 50 })) // WTF?  This throws an error
});

function getLineObject (x, y, w, h){
  var line = new Q.Sprite({ x:x, y:y, w:w, h:h});
  console.log('drawing line with width of ', w, 'px and height of ', h ,'px');
  line.draw = function (context) {
    context.fillStyle = 'black';
    context.fillRect(-this.p.cx,-this.p.cy,this.p.w,this.p.h);
  }
  return line;
}

Q.scene("Slots",function(stage) {
  var width = BALL_DIAMETER + LINE_THICKNESS;
  var height = BALL_DIAMETER + LINE_THICKNESS;
  var x = 0;
  //var y = 560 - LINE_THICKNESS + 3;
  var y = HEIGHT - height;
  for (var i = 0; i <= 7; i++)
  {
    for (var j = 0; j <= 6; j++)
    {
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
    Q.clearStages();
    Q.stageScene('backdrop');
  });
  box.fit(20);
});

Q.load("sprites.png", function() {
  Q.stageScene("backdrop");
  Q.stageScene("Slots",1);
});