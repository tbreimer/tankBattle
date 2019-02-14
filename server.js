// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');

// Get map data
var fs = require('fs');
eval(fs.readFileSync('client/js/maps.js')+'');

var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', process.env.PORT || 5000);
app.use('/client', express.static(__dirname + '/client'));

// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'client/index.html'));
});

// Starts the server.
server.listen(process.env.PORT || 5000, function() {
  console.log('Starting server on port 5000');
});

game = new Game();

var devMode = false;

// Variables to calculate fps
var fps;
var frame = 0;

function init(){
  setInterval(everySecond, 1000);
  setInterval(function() { update(); }, 1000 / 60);
}

function update(){ 
  frame += 1;

  io.sockets.emit('state', game);
  game.update();
}

// Every second this method is executed
function everySecond(){
  // Calculate fps
  fps = frame;
  frame = 0;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function Game(){
  // 0: Lobby 1: In Game 2: End Game Screen

  this.mode = 0;

  this.maps = new Maps();
  this.mapIndex = 0;
  
  this.players = {};
  this.bullets = [];

  this.winner; // Username of who won the last game

  Game.prototype.update = function(){

    if (Object.keys(game.players).length == 0 && devMode == false){
      this.mode = 0;
    }

    if (devMode == true){
      this.mode = 1;
    }
    
    if (this.mode == 1 && devMode == false){
      this.checkEndGame();
    }

    this.updateBullets();
  }

  Game.prototype.updateBullets = function(){
    for (var x = 0; x < this.bullets.length; x++){
      bullet = this.bullets[x];

      bullet.x += bullet.cX;
      bullet.y += bullet.cY;

      // Player collision detection
      for (var id in game.players) {
        user = game.players[id];
        
        if (bullet.owner != id){
          if (bullet.x >= user.x && bullet.x <= user.x + user.width){
            if (bullet.y >= user.y && bullet.y <= user.y + user.height){
              io.to(id).emit('hit by bullet');
              this.bullets.splice(x, 1);
            }
          }
        }
      }

      
      map = this.maps.index[this.mapIndex];

      for (var y = 0; y < map.walls.length; y++){
        wall = map.walls[y];

        if (bullet.x > wall.x && bullet.x < wall.x + wall.width){
          if (bullet.y > wall.y && bullet.y < wall.y + wall.height){
            this.bullets.splice(x, 1);
          }
        }

      }

    }
  }

  Game.prototype.start = function(){
    game.mode = 1;

    for (var id in game.players) {
      user = game.players[id];

      // Temorary
      randomNum = Math.floor(Math.random() * 4);

      x = 100;
      y = 100;

      if (randomNum == 0){
        x = random(100, 300);
        y = random(100, 300);
      }

      if (randomNum == 1){
        x = random(600, 900);
        y = random(600, 900); 
      }

      if (randomNum == 2){
        x = random(100, 300);
        y = random(600, 900);
      }

      if (randomNum == 3){
        x = random(600, 900);
        y = random(100, 300);
      }

      io.to(id).emit('change position', x, y);
      user.type = 'playing';
    }
  }

  Game.prototype.checkEndGame = function(){
    number = 0;
    name = "";

    for (var id in game.players) {
      user = game.players[id];

      
      if (user.type == 'playing'){
        number += 1;
        name = user.username;
      }
    }

    if (number < 2){
      game.winner = name;
      game.mode = 2;
      setTimeout(function(){ game.reset(); }, 3000);
    }
  }

  Game.prototype.reset = function(){
    io.sockets.emit("reset");

    this.bullets = [];

    for (var id in game.players) {
      game.players[id].type = "lobby";
    }

    game.mode = 0;
  }
}

function Bullet(x, y, targetX, targetY, rotation, cX, cY, owner){
  this.x = x;
  this.y = y;
  this.targetX = targetX;
  this.targetY = targetY;
  this.rotation = rotation;
  this.cX = cX;
  this.cY = cY;
  this.width = 10;
  this.height = 12;
  this.owner = owner;
}

function communication(socket){
  socket.on('new player', function(player) {

    playerNumber = Object.keys(game.players).length;

    if (playerNumber == 0){
      playerHosts = true;
    }else{
      playerHosts = false;
    }

    if (game.mode == 0){
      type = 'lobby';
    }else if (game.mode == 1){
      type = 'spectator';
    }

    // Ensures new players automatically start playing in devMode
    if (devMode == true){
      type = 'playing';
      io.to(socket.id).emit('change position', 150, 150);
    }

    game.players[socket.id] = {
      username: player.username,
      color: player.color,
      host: playerHosts,
      type: type
    };
  });

  // Triggered when user closes tab
  socket.on('disconnect', function() {
    if (game.players.hasOwnProperty(socket.id) == true){ // Ensures that socket ID is in game.players, preventing posible error
      newHostRequired = false;
      if (game.players[socket.id].host == true){
        newHostRequired = true;
      }

      delete game.players[socket.id];

      if (newHostRequired == true && Object.keys(game.players).length > 0){
        obj_keys = Object.keys(game.players);
        ran_key = obj_keys[Math.floor(Math.random() * obj_keys.length)];

        game.players[ran_key].host = true;
      }
    }
  });

  // Triggered when user goes back to main menu
  socket.on('leave', function() {
    if (game.players.hasOwnProperty(socket.id) == true){ // Ensures that socket ID is in game.players, preventing posible error
      newHostRequired = false;
      if (game.players[socket.id].host == true){
        newHostRequired = true;
      }

      delete game.players[socket.id];

      if (newHostRequired == true && Object.keys(game.players).length > 0){
        obj_keys = Object.keys(game.players);
        ran_key = obj_keys[Math.floor(Math.random() * obj_keys.length)];

        game.players[ran_key].host = true;
      }
    }
  });

  socket.on('kick', function(socketID) {
    io.to(socketID).emit('get kicked');
  });

  socket.on('start game', function(){
    game.start();
  });

  socket.on('player died', function(socketID){
    game.players[socketID].type = 'spectator';
  });

  socket.on('player data', function(data) {
    var player = game.players[socket.id] || {};

    player.x = data.x;
    player.y = data.y;

    player.rotation = data.rotation;
    player.turretRot = data.turretRot;

    player.health = data.health;

    player.width = data.width;
    player.height = data.height;
  });

  socket.on('fire', function(x, y, endX, endY, rotation, cX, cY, owner) {
    game.bullets.push(new Bullet(x, y, endX, endY, rotation, cX, cY, owner));
  });

  socket.on('change host', function() {
    for (var id in game.players) {
      var player = game.players[id];
      player.host = false;
    }

    var player = game.players[socket.id] || {};
    player.host = true;
  });
}

io.on('connection', function(socket) {communication(socket)});

init();


