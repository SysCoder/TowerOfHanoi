 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()

var gameState = [];


Q.Sprite.extend("Ball",{
  init: function(p) {
    console.log('Ball init');
    this._super(p, { sheet: "player", vy:0, x: 200 , y: 300, w: 40, h: 40, color: 'black', position: 0 });
    
    
    
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
  stage.insert(new Q.Ball({x: 400, y: 200}));
});



Q.load("sprites.png", function() {
  Q.stageScene("level1", 1);
});



// Game solver
