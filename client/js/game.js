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

colors = ["green", "blue", "purple", "red", "yellow", "orange", "violet", "brown"];

username = prompt("Enter your username"); //makeid();
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

document.body.addEventListener('touchstart', function(e){ e.preventDefault(); });

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
      ui.update();
      break;
  }

  player.update();

  requestAnimationFrame(update);
}


function updateGame(data){
  world.players = data.players;
  world.mode = data.mode;
}

function changeHost(){
  socket.emit('change host');
}

function findDistance(width, height){
    total = width * width + height * height;
    return Math.sqrt(total);
}

function World(){
  // 0: In Lobby 1: In game
  this.mode;
  this.players = {};

  World.prototype.update = function(){
    pCtx.clearRect(0, 0, windowWidth, windowHeight);

    if (this.mode == 1){
        for (var id in this.players) {

          var player = this.players[id];
          pCtx.fillStyle = player.color;
          pCtx.beginPath();
          pCtx.arc(player.x, player.y, 10, 0, 2 * Math.PI);
          pCtx.fill();

          pCtx.font = "16px Arial";
          pCtx.fillStyle = "black";
          textWidth = pCtx.measureText(player.username).width;
          pCtx.fillText(player.username, player.x - (textWidth / 2), player.y - 20);
      }
    }
  }
}

function Player(){
  this.socketID = null;
  this.username = username;
  this.color = color;
  this.x = 100;
  this.y = 100;

  this.movement = {
    up: 0,
    down: 0,
    left: 0,
    right: 0
  };


  this.host;

  Player.prototype.update = function(){
    this.x += this.movement.right;
    this.x -= this.movement.left;
    this.y += this.movement.down;
    this.y -= this.movement.up;

    socket.emit('player data', player);
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
      player.movement.left = 3;
      break;
    case 87: // W
      player.movement.up = 3;
      break;
    case 68: // D
      player.movement.right = 3;
      break;
    case 83: // S
      player.movement.down = 3;
      break;
  }
}

function unSet(key){
  switch (key) {
    case 65: // A
      player.movement.left = 0;
      break;
    case 87: // W
      player.movement.up = 0;
      break;
    case 68: // D
      player.movement.right = 0;
      break;
    case 83: // S
      player.movement.down = 0;
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