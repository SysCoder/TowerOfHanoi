 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()

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
});


Q.load("sprites.png", function() {
  Q.stageScene("level1");
});
