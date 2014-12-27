 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()
Q.Sprite.extend("Ring", {
  init: function(p) {
    this._super(p, { x: 100, y: 50, w:100 * 2, h:20, color: "black"});
    
    this.addKeyListeners();
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
  
  draw: function(ctx) {
     this._super(ctx);
     
  },
  removeKeyListeners: function(p) {
    Q.input.off("down", this);
    Q.input.off("right", this);
    Q.input.off("left", this);
  },
  addKeyListeners: function(p) {
    Q.input.on("down", this, "drop");
    Q.input.on("right", this, "moveRight");
    Q.input.on("left", this, "moveLeft");
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
     ctx.fillStyle = 'black';
     ctx.fill();
  }
});

Q.scene("level1",function(stage) {
  stage.insert(new Q.Peg({x: 300}));
  stage.insert(new Q.Peg({x: 550}));
  stage.insert(new Q.Peg({x: 800}));
  
  stage.insert(new Q.Ring({x: 300}));
});


Q.load("sprites.png", function() {
  Q.stageScene("level1");
});
