function Maps(){
  this.index = [new BattleGrounds()];
}

function BattleGrounds(){
  this.name = "Battle Grounds";

  this.width = 1600;
  this.height = 900;

  this.backGround = "rgb(240, 240, 240)";

  this.walls = [
    new Wall(100, 100, 100, 20, "gray")
  ];
};

function Wall(x, y, width, height, color){
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;

  this.color = color;
};