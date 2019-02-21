function Maps(){
  this.index = [new TinyIsland(), new Duel, new BattleGrounds, new ArchipelagoAssault];
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

function BattleGrounds(){
  this.name = "Battle Grounds";
  this.size = "Medium";

  this.width = 1400;
  this.height = 2100;

  this.background = "rgb(230, 230, 230)";

  this.island = false;

  this.walls = [
    // Outer box
    new Wall(500, 0, 1310, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1800, 0, 35, 500, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1100, 465, 710, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(500, 0, 35, 810, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(-75, 800, 610, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(-75, 800, 35, 1000, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(-75, 1775, 310, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(200, 1775, 400, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(600, 1775, 35, 600, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(600, 2350, 1300, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1890, 1785, 35, 600, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1890, 1785, 600, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(2455, 800, 35, 1000, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1100, 800, 1380, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1100, 490, 35, 320, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1100, 490, 35, 320, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    // Obstacles
    new Wall(650, 400, 250, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(900, 185, 35, 250, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(400, 950, 35, 300, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(400, 1350, 35, 300, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(2000, 1000, 460, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(2000, 1000, 35, 225, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(2000, 1550, 460, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(2000, 1350, 35, 225, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(600, 1900, 900, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(1000, 2100, 900, 35, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)")
  ];

  this.spawnZones = [
    new Zone(600, 100, 600, 100),
    new Zone(20, 900, 2330, 800),
    new Zone(700, 1700, 1000, 500)
  ];

}

function ArchipelagoAssault(){
  this.name = "Archipelago Assault";
  this.size = "Huge"

  this.width = 8000;
  this.height = 6000;

  this.background = "rgb(9, 133, 234)";

  this.walls = [
    // Outer Box
    new Wall(0, 0, 8000, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(0, 0, 30, 6000, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(8000, 0, 30, 6000, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(0, 6000, 8000, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    // Central Island
    new Wall(4300, 3300, 30, 1200, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(4300, 3300, 500, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(5200, 3300, 500, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(5700, 3300, 30, 1200, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(4300, 4470, 500, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(5200, 4470, 510, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(4600, 3900, 800, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    // Upper Island
    new Wall(2200, 2300, 2500, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(5200, 2300, 1500, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    new Wall(3200, 1200, 30, 800, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(4400, 1200, 30, 800, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(5430, 1200, 30, 800, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(6500, 1200, 30, 800, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),

    // Lower Island
    new Wall(4000, 5200, 500, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)"),
    new Wall(5500, 5200, 500, 30, "rgb(160, 160, 160)", 4, "rgb(114, 114, 114)")

  ];

  this.island = true;

  this.islands = [
    // Central Island
    new Island(4000, 3000, 2000, 2000, "rgb(45, 172, 32)", 2, "rgb(41, 155, 29)"),

    // Upper Island
    new Island(2000, 1000, 5000, 1500, "rgb(45, 172, 32)", 2, "rgb(41, 155, 29)"),

    // Bridge
    new Island(4900, 2500, 100, 500, "rgb(160, 160, 160)", 2, "rgb(114, 114, 114)"),

    // Lower Island
    new Island(3000, 5100, 4000, 600, "rgb(45, 172, 32)", 2, "rgb(41, 155, 29)")
  ];

  this.spawnZones = [
    new Zone(4000, 3000, 2000, 2000),
    new Zone(1000, 1000, 6000, 1500),
    new Island(3000, 5100, 4000, 600)
  ];
};

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