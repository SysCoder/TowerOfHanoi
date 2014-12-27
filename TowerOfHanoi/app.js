 

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
      this.p.x += 25;
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
    activeRing.drop();
    gameState[this.position][gameState[this.position].length] = activeRing;
    activeRing = undefined;
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
  
  addKeyListeners: function(p) {
    Q.input.on("right", this, "moveRight");
    Q.input.on("left", this, "moveLeft");
    Q.input.on("up", this, "moveUp");
    Q.input.on("down", this, "moveDown");
    Q.input.on("fire", this, "moveDown");
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
  var startFirstPeg = [new Q.Ring({x: 300, y: 150, color: 'red', start: true}), new Q.Ring({x: 300, y: 100, color: 'blue', start: true}),new Q.Ring({x: 300, y: 50, color: 'green', start: true})]
  
  gameState[0] = startFirstPeg;
  
  
  stage.insert(startFirstPeg[2]);
  stage.insert(startFirstPeg[1]);
  stage.insert(startFirstPeg[0]);
  
  stage.insert(new Q.UnderHover({x: 300, h: 5}));
});


Q.load("sprites.png", function() {
  Q.stageScene("level1");
});
