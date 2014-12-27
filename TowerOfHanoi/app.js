 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()
Q.Sprite.extend("Ring", {
  init: function(p) {
    this.onPeg = false;
    this._super(p, { x: 100, y: 50, w:100 * 2, h:20, color: "black"});
    
    this.addKeyListeners();
    
    Q.input.on("up", this, "moveUp");
  },

  
  drop: function(p) {
    this.add('2d');
    this.onPeg = true;
    this.removeKeyListeners();
  },
  
  moveRight: function(p) {
    this.p.x += 250;
  },
  
  moveLeft: function(p) {
    this.p.x -= 250;
  },
  
  // this activates the piece
  moveUp: function(p) {
    if(this.onPeg !== true) {
      return;
    }
    this.del('2d');
    this.p.y = 50;
    this.addKeyListeners();
  },
  
  draw: function(ctx) {
     this._super(ctx);
     ctx.rect((this.p.h/2), this.p.w, this.p.h, this.p.w);
     ctx.fillStyle = 'red';
     ctx.fill();
     ctx.fillStyle = 'black';
    ctx.fill();
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
