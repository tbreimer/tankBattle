var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

function makeid() {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 5; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }

  return text;
}

colors = ["green", "blue", "purple", "red", "orange", "violet", "brown"];

username = makeid();
color = colors[Math.floor(Math.random() * colors.length)];; //prompt("Enter your color")

/*
socket.emit('new player', username, color);
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 60);
*/

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

// 0: Title Screen 1: In Game
mode = 0;

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

function init(){
  resize();
  update();
}

function update(){
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

function calcAngleDegrees(x, y) {
  return Math.atan2(y, x) * 180 / Math.PI;
}

function calcAngleCoords(deg, speed){
  rad = ((deg + 90) * (Math.PI / 180));

  x = speed * Math.cos(rad);
  y = speed * Math.sin(rad);

  return {x: x, y: y};
}


function World(){
  // 0: In Lobby 1: In game
  this.mode;
  this.players = {};

  this.bullets = [];
  this.bulletSpeed = 10;
  this.bulletDamage = 10;

  World.prototype.update = function(){
    pCtx.clearRect(0, 0, windowWidth, windowHeight);


    if (this.mode == 1){
        for (var id in this.players) {
          var user = this.players[id];
 
          if (user.type == 'playing' && id != player.socketID){
            screenX = user.x - player.x + (windowWidth / 2);
            screenY = user.y - player.y + (windowHeight / 2);

            pCtx.fillStyle = user.color;
            drawRectRot(pCtx, screenX , screenY, player.width, player.height, user.rotation);
            pCtx.font = "16px Arial";
            pCtx.fillStyle = "black";
            textWidth = pCtx.measureText(user.username).width;
            pCtx.fillText(user.username, screenX - (textWidth / 2) + (player.width / 2), screenY - 20);
          }
      }

      for (var x = 0; x < this.bullets.length; x++){
        bullet = this.bullets[x];

        screenX = bullet.x - player.x + (windowWidth / 2);
        screenY = bullet.y - player.y + (windowHeight / 2);

        pCtx.fillStyle = "gray";

        drawRectRot(pCtx, screenX, screenY, bullet.width, bullet.height, bullet.rotation);

      }
    }
  }
}

function Player(){
  this.health = 30;
  this.maxHealth = 30;

  this.socketID = null;
  this.username = username;
  this.color = color;
  this.x = 100;
  this.y = 100;
  this.speed = 3;

  this.rotation = 0;
  this.rotationSpeed = 3;

  this.width = 30;
  this.height = 60;

  this.type;

  this.movement = {
    up: false,
    down: false,
    left: false,
    right: false
  };

  this.bulletSpeed = 10;

  this.host;

  Player.prototype.update = function(){


    if (this.type == 'playing'){

      if (ui.pauseScreenUp == false){

        if (this.movement.left == true){
          this.rotation -= this.rotationSpeed;
        }

        if (this.movement.right == true){
          this.rotation += this.rotationSpeed;
        }

        movement = calcAngleCoords(this.rotation, this.speed);


        if (this.movement.up == true){
          this.x -= movement.x;
          this.y -= movement.y;
        }

        if (this.movement.down == true){
          this.x += movement.x;
          this.y += movement.y;
        }
        

        if (this.rotation >= 360){
          this.rotation = this.rotation - 360;
        }

        if (this.rotation < 0){
          this.rotation = 360 + this.rotation;
        }

        if (ui.click == true){
          this.fire();
        }

        this.bulletCollision();
      }

      socket.emit('player data', player);

      this.render();

    }else if(this.type == 'spectator'){
      if (this.movement.up == true){
        this.y -= this.speed;
      }

      if (this.movement.down == true){
        this.y += this.speed;
      }

      if (this.movement.left == true){
        this.x -= this.speed;
      }

      if (this.movement.right == true){
        this.x += this.speed;
      }
    }

    
  }

  Player.prototype.bulletCollision = function(){
    for (var x = 0; x < world.bullets.length; x ++){
      bullet = world.bullets[x];

      // If player did not fire bullet and the bullet didn't already damage the player
      if (bullet.owner != this.socketID && bullet.alreadyDamaged != true){

        if (bullet.x >= this.x && bullet.x <= this.x + this.width){
          if (bullet.y >= this.y && bullet.y <= this.y + this.height){

            world.bullets.splice(x);
            this.damage(world.bulletDamage);
            socket.emit('bullet hit', x);
          }
        }
      }
    }
  }

  Player.prototype.render = function(){
    // Draw Player
    screenX = (windowWidth / 2) - (this.width / 2);
    screenY = (windowHeight / 2) - (this.height / 2);

    pCtx.fillStyle = this.color;
    drawRectRot(pCtx, screenX , screenY, this.width, this.height, this.rotation)
  }

  Player.prototype.fire = function(){
    this.degrees = calcAngleDegrees(this.x - this.targetX, this.y - this.targetY) - 90;
    
    // The change per frame in x and y coords to move arrow to target
    cX = 0;
    cY = 0;

    targetX = ui.mouseWx;
    targetY = ui.mouseWy;
    
    // Finds how many pixels arrow has to travel in X axis for every pixel in Y axis
    cX = (this.x - targetX) / (this.y - targetY); // Change (x / y)
    cY = 1;

    // Solves for a ratio that makes the arrow travel at the speed
    ratio = (Math.sqrt((cX * cX) + (cY * cY))) / (world.bulletSpeed);
    
    // Redefine using ratio
    cX = cX / ratio;
    cY = cY / ratio;

    // Negate values if target needs to go the opposite way
    if (this.y - targetY > 0){
      cX = -cX;
      cY = -cY;
    }

    degrees = calcAngleDegrees(player.x - targetX, player.y - targetY) - 90;
    socket.emit('fire', player.x, player.y, ui.mouseX, ui.mouseY, degrees, cX, cY, this.socketID);
  }

  Player.prototype.damage = function(amount){
    this.health -= amount;

    if (this.health <= 0){
      this.dead == true;
      ui.diedScreenUp = true;
      socket.emit("player died", this.socketID);
    }
  }

  Player.prototype.changePosition = function(x, y){
    this.x = x;
    this.y = y;
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

socket.on('connect', function() {
  player.socketID = socket.io.engine.id;; // Player knows its own socketID
});

socket.on('change position', function(x, y) {
  player.changePosition(x, y);
})

socket.on('get kicked', function(){
  console.log("Uh oh")
  window.location.replace("http://forestquest.net/kicked/kicked.html");
})

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
