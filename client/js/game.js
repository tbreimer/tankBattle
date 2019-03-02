/*
-kills
-hits
-wins
*/

var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

devMode = false;

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

colors = ["Gold", "Khaki", "Coral", "darkorange", "green", "Aquamarine", "CornflowerBlue", "red", "orange", "DeepPink", "MediumSpringGreen", "MediumSeaGreen", "LightSeaGreen", "Crimson", "HotPink", "Burlywood", "Sienna", "Orchid", "SlateBlue", "SlateGray"];

color = colors[Math.floor(Math.random() * colors.length)]; //prompt("Enter your color");

// Canvas
var bCanvas = document.getElementById('bgLayer');
var bCtx = bCanvas.getContext("2d");
var pCanvas = document.getElementById('playerLayer');
var pCtx = pCanvas.getContext("2d");
var uCanvas = document.getElementById('uiLayer');
var uCtx = uCanvas.getContext("2d");

// Keys
document.body.addEventListener("keydown", keyDown, false);
document.body.addEventListener("keyup", keyUp, false);

// Create entities
var ui = new UI();

var title = new Title();

var world = new World();

var player = new Player();

windowWidth = 1280;
windowHeight = 720;

// Variables to calculate fps
var fps;
var frame = 0;

// 0: Title Screen 1: In Game
mode = 0;

// Joins server in a fraction of a second to let everything settle
if (devMode == true){
  setTimeout(function(){ world.join(); }, 150);
}

window.addEventListener('resize', resize);

function resize(){
  // Get window size
  windowWidth = window.innerWidth || document.body.clientWidth;
  windowHeight =  window.innerHeight || document.body.clientHeight;
  
  // Change canvas size to window size
  bCanvas.width = windowWidth; 
  pCanvas.width = windowWidth;
  uCanvas.width = windowWidth;
  bCanvas.height = windowHeight;
  pCanvas.height = windowHeight;
  uCanvas.height = windowHeight;
}

// Every second this method is executed
function everySecond(){
  // Calculate fps
  fps = frame;
  frame = 0;

  // Update stats
  player.updateStats();

}

setInterval(everySecond, 1000);

function init(){
  resize();
  player.getStats();
  update();
}

function update(){
  frame += 1;

  pCtx.clearRect(0, 0, windowWidth, windowHeight);
  bCtx.clearRect(0, 0, windowWidth, windowHeight);

  windowWidth = window.innerWidth || document.body.clientWidth;
  windowHeight =  window.innerHeight || document.body.clientHeight;

  switch (mode){
    case 0:
      title.update();
      break;
    case 1:
      world.update();
      player.update();
      ui.update();
      break;
  }

  requestAnimationFrame(update);
}


function updateGame(data){
  world.players = data.players;
  world.mode = data.mode;
  world.winner = data.winner;

  world.mapIndex = data.mapIndex;
  player.maxHealth = data.startingHealth;

  world.chat = data.chat;

  for (var id in world.players) {
    if (id == player.socketID){
      player.type = data.players[id].type;
    }
  }

  world.bullets = data.bullets;
}

function changeHost(){
  socket.emit('change host');
}

function findDistance(width, height){
    total = width * width + height * height;
    return Math.sqrt(total);
}

function drawImageRot(ctx, img, x , y, width, height, deg){

    // Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    // Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    // Rotate the canvas around the origin
    ctx.rotate(rad);

    // Draw the image    
    ctx.drawImage(img, Math.floor(width / 2 * (-1)), Math.floor(height / 2 * (-1)), width, height);

    // Reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function drawRectRot(ctx, x , y, width, height, deg){

    // Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    // Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    // Rotate the canvas around the origin
    ctx.rotate(rad);

    // Draw the image    
    ctx.fillRect(Math.floor(width / 2 * (-1)), Math.floor(height / 2 * (-1)), width, height);

    // Reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function strokeRectRot(ctx, x , y, width, height, deg){

    // Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    // Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    // Rotate the canvas around the origin
    ctx.rotate(rad);

    // Draw the image    
    ctx.strokeRect(Math.floor(width / 2 * (-1)), Math.floor(height / 2 * (-1)), width, height);

    // Reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function turretRot(ctx, x , y, width, height, deg){

    // Convert degrees to radian 
    var rad = deg * Math.PI / 180;

    // Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    // Rotate the canvas around the origin
    ctx.rotate(rad);

    // Draw the image
    ctx.fillRect(Math.floor(width / 2 * (-1)) - 3, Math.floor(height / 2 * (-1)) - 25, 6, 25);
    ctx.strokeRect(Math.floor(width / 2 * (-1)) - 3, Math.floor(height / 2 * (-1)) - 25, 6, 25);


    ctx.beginPath();
    ctx.arc(Math.floor(width / 2 * (-1)), Math.floor(height / 2 * (-1)), 13, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}

function getMidPoint(x, y, width, height, angle_degrees) {
    var angle_rad = angle_degrees * Math.PI / 180;
    var cosa = Math.cos(angle_rad);
    var sina = Math.sin(angle_rad);
    var wp = width / 2;
    var hp = height / 2;
    return { px: ( x + wp * cosa - hp * sina ),
             py: ( y + wp * sina + hp * cosa ) };
}

function calcAngleDegrees(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI;
}

function calcAngleCoords(deg, speed){
  rad = ((deg + 90) * (Math.PI / 180));

  x = speed * Math.cos(rad);
  y = speed * Math.sin(rad);

  return {x: x, y: y};
}

function rotatePoint(pivot, point, angle) {
  // Converts degrees to radians
  angle = angle * Math.PI / 180;

  // Rotate clockwise, angle in radians
  var x = ((Math.cos(angle) * (point[0] - pivot[0])) -
                     (Math.sin(angle) * (point[1] - pivot[1])) +
                     pivot[0]),
      y = ((Math.sin(angle) * (point[0] - pivot[0])) +
                     (Math.cos(angle) * (point[1] - pivot[1])) +
                     pivot[1]);
  return {x: x, y: y};
};


function World(){
  // 0: In Lobby 1: In game 2: Spectating
  this.mode;
  this.players = {};

  this.bullets = [];
  this.bulletSpeed = 13;
  this.bulletDamage = 10;

  this.explosions = [];

  this.maps = new Maps();
  this.mapIndex = 0;

  this.chat = [];

  World.prototype.update = function(){

    if (this.mode == 1 || this.mode == 2){

      this.canvasTopX = player.x - ((windowWidth / 2));
      this.canvasTopY = player.y - ((windowHeight / 2));

      // Draw Background
      map = this.maps.index[this.mapIndex];
      bCtx.fillStyle = map.background;
      bCtx.fillRect(0, 0, windowWidth, windowHeight);

      // Draw Islands

      if (map.island == true){
        // Stroke islands
        for (var x = 0; x < map.islands.length; x++){
          island = map.islands[x];

          screenX = island.x - player.x + (windowWidth / 2);
          screenY = island.y - player.y + (windowHeight / 2);

          bCtx.strokeStyle = island.strokeColor;
          bCtx.strokeRect(screenX, screenY, island.width, island.height);

        }

        // Fill islands
        for (var x = 0; x < map.islands.length; x++){
          island = map.islands[x];

          screenX = island.x - player.x + (windowWidth / 2);
          screenY = island.y - player.y + (windowHeight / 2);

          bCtx.fillStyle = island.color;
          bCtx.fillRect(screenX, screenY, island.width, island.height);

        }
      }

      // Draw Bullets

      for (var x = 0; x < this.bullets.length; x++){
          bullet = this.bullets[x];

          screenX = bullet.x - player.x + (windowWidth / 2);
          screenY = bullet.y - player.y + (windowHeight / 2);

          pCtx.fillStyle = "red";
          pCtx.strokeStyle = "black";

          pCtx.beginPath();
          pCtx.arc(screenX, screenY, 4, 0, 2 * Math.PI);
          pCtx.fill();
          pCtx.stroke();
      }

      // Draw other players

      
        for (var id in this.players) {
          var user = this.players[id];

          if (user.type == 'playing' && id != player.socketID){
            screenX = user.x - player.x + (windowWidth / 2);
            screenY = user.y - player.y + (windowHeight / 2);

            pCtx.fillStyle = user.color;
            drawRectRot(pCtx, screenX , screenY, user.width, user.height, user.rotation);

            pCtx.lineWidth = 2;
            pCtx.strokeStyle = "black";

            strokeRectRot(pCtx, screenX , screenY, user.width, user.height, user.rotation);

            midX = user.x + (user.width / 2);
            midY = user.y + (user.height / 2);

            turretRot(pCtx, screenX + user.width / 2, screenY + user.height / 2, 0, 0, user.turretRot);

            pCtx.font = "16px Arial";
            pCtx.fillStyle = "black";
            textWidth = pCtx.measureText(user.username).width;
            pCtx.fillText(user.username, screenX - (textWidth / 2) + (player.width / 2), screenY - 20);
          }
        

        // Stroke Walls
        
        map = this.maps.index[this.mapIndex];

        for (var x = 0; x < map.walls.length; x++){
          wall = map.walls[x];

          screenX = wall.x - player.x + (windowWidth / 2);
          screenY = wall.y - player.y + (windowHeight / 2);

          bCtx.strokeStyle = wall.strokeColor;
          bCtx.lineWidth = wall.stroke;
          bCtx.strokeRect(screenX, screenY, wall.width, wall.height);

        }

        // Fill Walls

        for (var x = 0; x < map.walls.length; x++){
          wall = map.walls[x];

          screenX = wall.x - player.x + (windowWidth / 2);
          screenY = wall.y - player.y + (windowHeight / 2);

          bCtx.fillStyle = wall.color;
          bCtx.fillRect(screenX, screenY, wall.width, wall.height);

        }

        // Explosions

        for (var x = 0; x < this.explosions.length; x++){
          explosion = this.explosions[x];

          screenX = explosion.x - player.x + (windowWidth / 2);
          screenY = explosion.y - player.y + (windowHeight / 2);

          pCtx.fillStyle = "orange";
          pCtx.strokeStyle = "darkorange";

          pCtx.beginPath();
          pCtx.globalAlpha = Math.round(explosion.transparency * 100) / 100;
          pCtx.arc(screenX, screenY, explosion.radius, 0, 2 * Math.PI);
          pCtx.fill();
          pCtx.stroke();
          pCtx.globalAlpha = 1;

          if (explosion.type == "small"){
            explosion.radius += 0.5;
            explosion.transparency -= 0.05;

          }else if (explosion.type == "large"){
            explosion.radius += 2;
            explosion.transparency -= 0.05;
          }

          if (explosion.transparency <= 0){
            this.explosions.splice(x, 1);
          }
        }
      }
    }
  }

  World.prototype.join = function(){
    socket.emit('new player', player);
    this.mode = 1;
    mode = 1;
  }

  World.prototype.changeMap = function(mapIndex){
    socket.emit('change map', mapIndex);
  }

  World.prototype.changeStartingHealth = function(value){
    socket.emit('change starting health', value);
  }
}

function Player(){
  this.health = 30;
  this.maxHealth = 30;

  this.socketID = null;
  this.username = makeid();
  this.color = color;
  this.x = 0;
  this.y = 0;

  this.screenX;
  this.screenY;

  this.midX; // Midpoint of tank
  this.midY;

  this.speed = 3;

  this.rotation = 0;
  this.rotationSpeed = 3;

  this.turretRot = 0;

  this.width = 30;
  this.height = 60;

  this.reload = 0; // 0 Means player can fire
  this.reloadTime = 18;

  this.tl; // x: and y: of each vertex
  this.tr;
  this.br;
  this.bl;

  // Whether player will hit into wall on next frame if pushing the W S A or D key
  this.wCol = false;
  this.sCol = false;

  this.aCol = false;
  this.dCol = false;

  this.type;

  this.movement = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  this.dead = false;

  this.host;

  this.kills = 0;
  this.deaths = 0;

  this.hits = 0;
  this.shots = 0;

  this.wins = 0;
  this.games = 0;

  this.gameKills = 0;
  this.gameDeaths = 0;

  this.gameHits = 0;
  this.gameShots = 0;

  this.gameWins = 0;
  this.gameGames = 0;

  Player.prototype.update = function(){

    if (this.type == 'playing'){

      if (ui.pauseScreenUp == false){

        if (this.reload > 0){
          this.reload -= 1;
        }

        this.midX = this.x + (this.width / 2);
        this.midY = this.y + (this.height / 2);

        this.tl = rotatePoint([this.midX, this.midY], [this.x, this.y], this.rotation);
        this.tr = rotatePoint([this.midX, this.midY], [this.x + this.width, this.y], this.rotation);
        this.br = rotatePoint([this.midX, this.midY], [this.x + this.width, this.y + this.height], this.rotation);
        this.bl = rotatePoint([this.midX, this.midY], [this.x, this.y + this.height], this.rotation);

        // Calcs deltaX and deltaY based on rotation and speed
        movement = calcAngleCoords(this.rotation, this.speed);

        this.wallCollision(movement);

        // If map has island collision, test it
        if (world.maps.index[world.mapIndex].island == true){
          this.islandCollision(movement);
        }

        if (this.movement.left == true && this.aCol == false){
          this.rotation -= this.rotationSpeed;
        }

        if (this.movement.right == true && this.dCol == false){
          this.rotation += this.rotationSpeed;
        }

        if (this.movement.up == true && this.wCol == false){
          this.x -= movement.x;
          this.y -= movement.y;
        }

        if (this.movement.down == true && this.sCol == false){
          this.x += movement.x;
          this.y += movement.y;
        }
        

        if (this.rotation >= 360){
          this.rotation = this.rotation - 360;
        }

        if (this.rotation < 0){
          this.rotation = 360 + this.rotation;
        }

        // Recalculate vertexes based on new movement
        this.midX = this.x + (this.width / 2);
        this.midY = this.y + (this.height / 2);

        this.tl = rotatePoint([this.midX, this.midY], [this.x, this.y], this.rotation);
        this.tr = rotatePoint([this.midX, this.midY], [this.x + this.width, this.y], this.rotation);
        this.br = rotatePoint([this.midX, this.midY], [this.x + this.width, this.y + this.height], this.rotation);
        this.bl = rotatePoint([this.midX, this.midY], [this.x, this.y + this.height], this.rotation);

        this.turretRot = calcAngleDegrees((this.screenX + (this.width / 2)) - ui.mouseX, ((this.screenY + (this.height / 2)) - ui.mouseY)) - 90;

        if (ui.click == true){
          this.fire();
        }
      }

      socket.emit('player data', player);

      this.render();

    }else if (this.type == "spectator"){
      if (ui.diedScreenUp == false){
        if (this.movement.up == true){
          this.y -= (this.speed * 1.5);
        }

        if (this.movement.down == true){
          this.y += (this.speed * 1.5);
        }

        if (this.movement.left == true){
          this.x -= (this.speed * 1.5);
        }

        if (this.movement.right == true){
          this.x += (this.speed * 1.5);
        }
      }
      
    }
  }

  Player.prototype.render = function(){
    // Draw Player
    this.screenX = windowWidth / 2;
    this.screenY = windowHeight / 2;

    pCtx.fillStyle = this.color;
    drawRectRot(pCtx, this.screenX , this.screenY, this.width, this.height, this.rotation);

    pCtx.lineWidth = 2;
    pCtx.strokeStyle = "black";

    strokeRectRot(pCtx, this.screenX , this.screenY, this.width, this.height, this.rotation);

    // Lines on tank
    pCtx.beginPath();
    pCtx.moveTo(Math.floor(this.midX - player.x + (windowWidth / 2)), Math.floor(this.midY - player.y + (windowHeight / 2)));
    pCtx.lineTo(Math.floor(this.bl.x - player.x + (windowWidth / 2)), Math.floor(this.bl.y - player.y + (windowHeight / 2)));
    pCtx.stroke();

    pCtx.beginPath();
    pCtx.moveTo(Math.floor(this.midX - player.x + (windowWidth / 2)), Math.floor(this.midY - player.y + (windowHeight / 2)));
    pCtx.lineTo(Math.floor(this.br.x - player.x + (windowWidth / 2)), Math.floor(this.br.y - player.y + (windowHeight / 2)));
    pCtx.stroke();

    pCtx.beginPath();
    pCtx.moveTo(Math.floor(this.midX - player.x + (windowWidth / 2)), Math.floor(this.midY - player.y + (windowHeight / 2)));
    pCtx.lineTo(Math.floor(((this.tr.x + this.tl.x) / 2) - player.x + (windowWidth / 2)), Math.floor(((this.tr.y + this.tl.y) / 2) - player.y + (windowHeight / 2)));
    pCtx.stroke();

    turretRot(pCtx, this.screenX + (this.width / 2), this.screenY + (this.height / 2), 0, 0, this.turretRot);

    
  }

  Player.prototype.wallCollision = function(movement){
    // This code predicts the coords if the player goes forward or backward, and if player is coliding with a wall
    // in those coords, set wCol or sCol to true

    this.wCol = false;
    this.sCol = false;
    this.aCol = false;
    this.dCol = false;

    newX = this.x;
    newY = this.y;

    newMidX = this.midX;
    newMidY = this.midY;

    map = world.maps.index[world.mapIndex];

    if (this.movement.up == true){

      newX -= movement.x;
      newY -= movement.y;

      newMidX -= movement.x;
      newMidY -= movement.y;

      // Top left vertex

      coords = rotatePoint([newMidX, newMidY], [newX, newY], this.rotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.wCol = true;
          }
        }
      }

      // Top right vertex

      coords = rotatePoint([newMidX, newMidY], [newX + this.width, newY], this.rotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.wCol = true;
          }
        }
      }
    }

    if (this.movement.down == true){

      newX += movement.x;
      newY += movement.y;

      newMidX += movement.x;
      newMidY += movement.y;

      // Bottom left vertex

      coords = rotatePoint([newMidX, newMidY], [newX, newY + this.height], this.rotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.sCol = true;
          }
        }
      }

      // Bottom right vertex

      coords = rotatePoint([newMidX, newMidY], [newX + this.width, newY + this.height], this.rotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.sCol = true;
          }
        }
      }
    }

    if (this.movement.left == true){
      newRotation = this.rotation;

      newRotation -= this.rotationSpeed;

      // Top left vertex
      coords = rotatePoint([this.midX, this.midY], [this.x, this.y], newRotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.aCol = true;
          }
        }
      }

      // Bottom right vertex
      coords = rotatePoint([this.midX, this.midY], [this.x + this.width, this.y + this.height], newRotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.aCol = true;
          }
        }
      }
    }

    if (this.movement.right == true){
      newRotation = this.rotation;

      newRotation -= this.rotationSpeed;

      // Top right vertex
      coords = rotatePoint([this.midX, this.midY], [this.x + this.width, this.y], newRotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.dCol = true;
          }
        }
      }

      // Bottom left vertex
      coords = rotatePoint([this.midX, this.midY], [this.x, this.y + this.height], newRotation);
      
      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (coords.x > wall.x && coords.x < wall.x + wall.width){
          if (coords.y > wall.y && coords.y < wall.y + wall.height){
            this.dCol = true;
          }
        }
      }
    }

  }

  Player.prototype.islandCollision = function(movement){

    this.speed = 3;

    newMidX = this.midX;
    newMidY = this.midY;

    map = world.maps.index[world.mapIndex];

    inside = false;

    newMidX -= movement.x;
    newMidY -= movement.y;

    // Top left vertex
    
    for (var x = 0; x < map.islands.length; x++){
      wall = map.islands[x];
      
      if (newMidX > wall.x && newMidX < wall.x + wall.width && newMidY > wall.y && newMidY < wall.y + wall.height){
        inside = true;
      }
    }

    if (inside == true){
      this.speed = 3;
    }else{
      this.speed = 1;
    }
  }

  Player.prototype.fire = function(){
    this.shots += 1;
    this.gameShots += 1;

    if (this.reload <= 0){
      this.reload = this.reloadTime;

      this.degrees = calcAngleDegrees(this.midX - this.targetX, this.midY - this.targetY) - 90;
      
      // The change per frame in x and y coords to move arrow to target
      cX = 0;
      cY = 0;

      targetX = ui.mouseWx;
      targetY = ui.mouseWy;
      
      // Finds how many pixels arrow has to travel in X axis for every pixel in Y axis
      cX = (this.midX - targetX) / (this.midY - targetY); // Change (x / y)
      cY = 1;

      // Solves for a ratio that makes the arrow travel at the speed
      ratio = (Math.sqrt((cX * cX) + (cY * cY))) / (world.bulletSpeed);
      
      // Redefine using ratio
      cX = cX / ratio;
      cY = cY / ratio;

      // Negate values if target needs to go the opposite way
      if (this.midY - targetY > 0){
        cX = -cX;
        cY = -cY;
      }

      degrees = calcAngleDegrees(player.midX - targetX, player.midY - targetY) - 90;
      socket.emit('fire', player.midX, player.midY, ui.mouseX, ui.mouseY, degrees, cX, cY, this.socketID);
    }
  }

  Player.prototype.damage = function(amount){
    this.health -= amount;

    if (this.health <= 0){
      this.dead = true;
      ui.diedScreenUp = true;

      this.movement.up = false;
      this.movement.down = false;
      this.movement.right = false;
      this.movement.left = false;

      this.deaths += 1;
      this.gameDeaths += 1;

      socket.emit("player died", this.socketID, this.midX, this.midY);
    }
  }

  Player.prototype.changePosition = function(x, y){
    this.x = x;
    this.y = y;
  }

  Player.prototype.reset = function(){
    this.health = this.maxHealth;
    this.dead = false;
    ui.diedScreenUp = false;

    this.games += 1;
    this.gameGames += 1;
  }

  Player.prototype.newMessage = function(){
    message = prompt("Enter a message");

    if (message == "$: host"){ // Host Command
      socket.emit('change host');

    }else if (message == "$: kick"){
      username = prompt("Kick Who?");

      for (var id in world.players) {
        var user = world.players[id];

        if (username == user.username){
          socket.emit('kick', id);
        }
      }

    }else if(message == "$: health"){
      this.health = prompt("Health");

    }else if(message == "$: reload"){
      this.reloadTime = prompt("Reload");

    }else if (message == "$: map"){
      mapID = prompt("Map ID");

      world.changeMap(mapID);

    }else if (message == "$: tp"){
      x = prompt("X");
      y = prompt("Y");

      this.changePosition(x, y);

    }else if (message != null && message != ""){

      message = this.username + ": " + message;

      // Splits message up into 20 character chunks
      length = message.length;

      newMessage = [];

      lastSplice = null;

      for (var x = 0; x < length; x++){
        if (x % 27 == 0 && x != 0){

          selectedSection = message.slice(x - 27, x);

          lastSplice = x;

          newMessage.push(selectedSection);
        }
      }

      if (lastSplice != null){
        newMessage.push(message.slice(lastSplice, length));
      }

      if (length < 27){
        newMessage = message;
      }

      socket.emit('new message', newMessage);
    }
  }

  Player.prototype.getStats = function(){
    kills = parseInt(localStorage.getItem("kills"));

    if (kills == null || isNaN(kills)){
      this.kills = 0;
    }else{
      this.kills = kills;
    }

    deaths = parseInt(localStorage.getItem("deaths"));

    if (deaths == null || isNaN(kills)){
      this.deaths = 0;
    }else{
      this.deaths = deaths;
    }

    hits = parseInt(localStorage.getItem("hits"));

    if (hits == null || isNaN(kills)){
      this.hits = 0;
    }else{
      this.hits = hits;
    }

    shots = parseInt(localStorage.getItem("shots"));

    if (shots == null || isNaN(kills)){
      this.shots = 0;
    }else{
      this.shots = shots;
    }

    wins = parseInt(localStorage.getItem("wins"));

    if (wins == null || isNaN(kills)){
      this.wins = 0;
    }else{
      this.wins = wins;
    }

    games = parseInt(localStorage.getItem("games"));

    if (games == null || isNaN(kills)){
      this.games = 0;
    }else{
      this.games = games;
    }

    username = localStorage.getItem("username");

    if (username == null){
      // :)
    }else{
      this.username = username;
    }
  }

  Player.prototype.updateStats = function(){
    localStorage.setItem("kills", this.kills);
    localStorage.setItem("deaths", this.deaths);
    localStorage.setItem("hits", this.hits);
    localStorage.setItem("shots", this.shots);
    localStorage.setItem("wins", this.wins);
    localStorage.setItem("games", this.games);
  }

  Player.prototype.changeUsername = function(){
    newUsername = prompt("Enter new username (limit 15 characters)");
    this.username = newUsername.substring(0, 15);
    localStorage.setItem("username", this.username);
  }

  Player.prototype.resetStats = function(){
    localStorage.setItem("kills", 0);
    localStorage.setItem("deaths", 0);
    localStorage.setItem("hits", 0);
    localStorage.setItem("shots", 0);
    localStorage.setItem("wins", 0);
    localStorage.setItem("games", 0);

    this.getStats();
  }
}

socket.on('state', function(data) {

  updateGame(data);

  // If in-game, check if player is host
  
  if (mode == 1){
    if (world.players[player.socketID].host){
      player.host = true;
    }else{
      player.host = false;
    }
  }
});

function Explosion(x, y, type){
  this.x = x;
  this.y = y;
  this.type = type;
  this.time = 0;

  this.transparency = 1;


  switch (this.type) {
    case "small":
      this.radius = 4;
      break;
    case "large":
      this.radius = 25;
      break;
  }


}

socket.on('connect', function() {
  player.socketID = socket.io.engine.id;; // Player knows its own socketID
});

socket.on('explosion', function(x, y, type){
  world.explosions.push(new Explosion(x, y, type));
});

socket.on('change position', function(x, y) {
  player.changePosition(x, y);
});

socket.on('hit by bullet', function(){
  player.damage(10);
});

socket.on('reset', function() {
  player.reset();
});

socket.on('get kicked', function(){
  console.log("Uh oh")
  window.location.replace("http://forestquest.net/kicked/kicked.html");
});

socket.on('map changed', function(mapIndex){
  world.mapIndex = mapIndex;
});

socket.on('starting health changed', function(value){
  player.health = value;
  player.maxHealth = value;
});

socket.on('hit', function(value){
  player.hits += 1;
  player.gameHits += 1;
});

socket.on('kill', function(value){
  player.kills += 1;
  player.gameKills += 1;
});

socket.on('you won', function(value){
  player.wins += 1;
  player.gameWins += 1;
});

function keyDown(evt){
  evt.preventDefault();
  set(evt.keyCode);
  evt.stopPropagation();
  return;
}

function keyUp(evt){
  evt.preventDefault();
  unSet(evt.keyCode);
  evt.stopPropagation();
  return;
}

function set(key){
  switch (key) {
    case 65: // A
      player.movement.left = true;
      break;
    case 87: // W
      player.movement.up = true;
      break;
    case 68: // D
      player.movement.right = true;
      break;
    case 83: // S
      player.movement.down = true;
      break;
  }
}

function unSet(key){
  switch (key) {
    case 65: // A
      player.movement.left = false;
      break;
    case 87: // W
      player.movement.up = false;
      break;
    case 68: // D
      player.movement.right = false;
      break;
    case 83: // S
      player.movement.down = false;
      break;
  }
}

// Mouse 
function getMousePos(evt) {
  var rect = bCanvas.getBoundingClientRect();

  ui.mouseX = evt.clientX - rect.left;
  ui.mouseY = evt.clientY - rect.top;

}

// Mouse clicked event listeners
function mouseDown(evt){
  ui.mousePressed = true;
  ui.press = true; // Will be true for one frame

}
function mouseUp(evt){
  ui.mousePressed = false;
  ui.click = true; // Will be true for one frame
}
