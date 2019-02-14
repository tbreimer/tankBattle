function Maps(){
  this.index = [new BattleGrounds()];
}

function BattleGrounds(){
  this.name = "Battle Grounds";

  this.width = 1600;
  this.height = 900;

  this.backGround = "rgb(240, 240, 240)";

  this.walls = [
    new Wall(0, 0, 1000, 35, "gray"),
    new Wall(0, 0, 35, 1000, "gray"),
    new Wall(1000, 0, 35, 1000, "gray"),
    new Wall(0, 1000, 1035, 35, "gray"),

    new Wall(490, 200, 35, 600, "gray"),
    new Wall(200, 490, 600, 35, "gray")
  ];
};

function Wall(x, y, width, height, color){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.color = color;
};