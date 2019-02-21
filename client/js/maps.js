function Maps(){
  this.index = [new TinyIsland(), new Duel];
}

function TinyIsland(){
  this.name = "Tiny Island";
  this.size = "Small"

  this.width = 1000;
  this.height = 1000;

  this.background = "rgb(9, 133, 234)";

  this.walls = [
    // Outer Box
    new Wall(-1000, -1000, 3000, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(-1000, -1000, 35, 3000, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(2000, -1000, 35, 3000, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(-1000, 2000, 3000, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    
    // Inner Plus
    new Wall(490, 200, 35, 600, "rgb(160, 160, 160)", 4, "rgb(130, 130, 130)"),
    new Wall(200, 490, 600, 35, "rgb(160, 160, 160)", 4, "rgb(130, 130, 130)")
  ];

  this.island = true;

  this.islands = [
    new Island(0, 0, 1000, 1000, "rgb(45, 172, 32)", 2, "rgb(41, 155, 29)")
  ];

  this.spawnZones = [
    new Zone(100, 100, 900, 900)
  ];
};

function Duel(){
  this.name = "Duel";
  this.size = "Small";

  this.width = 2000;
  this.height = 1000;

  this.background = "rgb(230, 230, 230)";

  this.island = false;

  this.walls = [
    // Outer box
    new Wall(0, 0, 1500, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(0, 0, 35, 800, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1465, 0, 35, 800, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(0, 765, 1500, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    // Left Area
    new Wall(200, 0, 35, 325, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(200, 475, 35, 325, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(400, 200, 35, 400, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    // Right Area
    new Wall(1000, 125, 35, 200, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1000, 475, 35, 200, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(1275, 200, 35, 400, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
  ];

  this.spawnZones = [
    new Zone(100, 100, 1400, 700)
  ];

}

function Wall(x, y, width, height, color, stroke, strokeColor){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.color = color;
  this.strokeColor = strokeColor;

  this.stroke = stroke;
};

function Island(x, y, width, height, color, stroke, strokeColor){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.color = color;
  this.strokeColor = strokeColor;

  this.stroke = stroke;
}

function Zone(x, y, width, height){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}