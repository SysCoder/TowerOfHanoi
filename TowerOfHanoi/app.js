 

var Q = Quintus()
        .include("Sprites, Scenes, Input, 2D, Touch, UI")
        .setup({ maximize: true })
        .controls().touch()
   
Q.scene("level1",function(stage) {
  stage.insert(new Q.Sprite({ x:50, y:50, w:50 * 2, h:50 + 5, color: "black"}));
});


Q.load("sprites.png", function() {
  Q.stageScene("level1");
});
