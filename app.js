var BALL_DIAMETER = 40,
    GRID_BOTTOM = 400,
    GRID_TOP = 90,
    LINE_THICKNESS = 5,
    WIDTH = 800,
    HEIGHT = 600;

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ 
          width:   WIDTH, // Set the default width to 800 pixels
          height:  HEIGHT // Set the default height to 600 pixels
        })
        .controls().touch();

function getLineObject (x, y, w, h){
  var line = new Q.Sprite({ x:x, y:y, w:w, h:h});
  console.log('drawing line with width of ', w, 'px and height of ', h ,'px');
  line.draw = function (context) {
    context.fillStyle = 'black';
    context.fillRect(-this.p.cx,-this.p.cy,this.p.w,this.p.h);
  }
  return line;
}
        
Q.Sprite.extend("Player",{
  init: function(p) {
    console.log('Player init');
    this._super(p, { sheet: "player", vy:0, x: (WIDTH / 4), y: (BALL_DIAMETER / 2), w: BALL_DIAMETER, h: BALL_DIAMETER, color: 'black' });
    
    
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
    Q.stage().insert(new Q.Player({color: this.p.color == "yellow" ? "red" : "yellow"}));
    Q.input.off("down", this);
    Q.input.off("left", this);
    Q.input.off("right", this);
  },
  moveRight: function() {
   	this.p.x = this.p.x + (BALL_DIAMETER + LINE_THICKNESS);
    Q.input.off("down", this, "moveRight");
  },
  moveLeft: function() {
    this.p.x = this.p.x - (BALL_DIAMETER + LINE_THICKNESS);
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

//Q.scene("balls", function (stage) {
  //stage.insert(new Q.Player({Color: "red"}));
//});

Q.scene("backdrop",function(stage) {
  stage.insert(new Q.Player({Color: "red"}));
  /*for(var loc = HEIGHT; loc >= BALL_DIAMETER; loc -= BALL_DIAMETER){ //render horizontal lines
    console.log('rendering line at ', loc);
    stage.insert(getLineObject(0, loc, WIDTH * 2, LINE_THICKNESS));
  }
  
  for(var loc = WIDTH; loc >= 0; loc -= BALL_DIAMETER){
    console.log('rendering line at ', loc);
    stage.insert(getLineObject(loc, 0, LINE_THICKNESS, HEIGHT * 2));
  }*/
  
  stage.insert(getLineObject(0, HEIGHT, WIDTH, LINE_THICKNESS));
  //stage.insert(new Q.Tower({ x: 180, y: 50 })) // WTF?  This throws an error
  
  /*var sprite2 = new Q.Sprite({ x:0, y: GRID_BOTTOM, w: GRID_DIMS, h: 10 });
  sprite2.draw= function(ctx) {
    ctx.fillStyle = 'black';
    ctx.fillRect(-this.p.cx,-this.p.cy,this.p.w,this.p.h);
  };
 
  //stage.add("viewport").follow(player);
  //Here we should render out the grid completely
  stage.insert(sprite2);*/
  
  //stage.insert(new Q.Tower({ x: 180, y: 50 }));
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
});