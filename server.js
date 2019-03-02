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

function isUndefined(variable){
  if (variable === undefined){
    return true;
  }else{
    return false;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function findDistance(width, height){
  total = width * width + height * height;
  return Math.sqrt(total);
}

function Game(){
  // 0: Lobby 1: In Game 2: End Game Screen

  this.mode = 0;

  this.maps = new Maps();
  this.mapIndex = 1;

  this.startingHealth = 30;
  
  this.players = {};
  this.bullets = [];

  this.chat = ["Server Started!"];

  this.winner; // Username of who won the last game

  Game.prototype.update = function(){

    if (Object.keys(game.players).length == 0 && devMode == false){
      this.mode = 0;
      this.chat = ["Server Started!"];
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

      bullet.x = bullet.x;
      bullet.y = bullet.y;

      // Player collision detection
      for (var id in game.players) {
        user = game.players[id];
        
        if (bullet.owner != id && user.dead == false){
          // Approximates tank collision with 3 circles

          // Collision with bullet

          // Get midpoint of bottom and top edge of tank
          tmX = (user.tl.x + user.tr.x) / 2;
          tmY = (user.tl.y + user.tr.y) / 2;

          bmX = (user.bl.x + user.br.x) / 2;
          bmY = (user.bl.y + user.br.y) / 2;

          // Midpoint of each midpoint from before and midpoint of tank
          tmX = (tmX + user.midX) / 2;
          tmY = (tmY + user.midY) / 2;

          bmX = (bmX + user.midX) / 2;
          bmY = (bmY + user.midY) / 2;

          radius = (user.width / 2) + 5;
          collision = false;

          // Top circle
          dist = findDistance(bullet.x - tmX, bullet.y - tmY);
        
          if (dist < radius){
            collision = true;
          }

          // Bottom circle
          dist = findDistance(bullet.x - bmX, bullet.y - bmY);
          
          if (dist < radius){
            collision = true;
          }

          // Mid circle
          dist = findDistance(bullet.x - user.midX, bullet.y - user.midY);
          
          if (dist < radius){
            collision = true;
          }

          if (collision == true){
            this.bullets.splice(x, 1);
            io.to(id).emit('hit by bullet');
            io.sockets.emit('explosion', bullet.x, bullet.y, "small");

            io.to(bullet.owner).emit('hit'); // For stats
            
            if (user.health <= 10){
              died = user.username;
              killed = this.players[bullet.owner].username;

              io.to(bullet.owner).emit('kill');

              this.newMessage(died + " was killed by " + killed);
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
            io.sockets.emit('explosion', bullet.x, bullet.y, "small");
          }
        }

      }

    }
  }

  Game.prototype.start = function(){

    for (var id in game.players) {
      user = game.players[id];

      coords = this.choosePosition();

      io.to(id).emit('change position', coords.x, coords.y);
      user.type = 'playing';
    }

    game.mode = 1;
  }

  Game.prototype.choosePosition = function(){
    map = this.maps.index[this.mapIndex];


    // Try 15 times to get a good random spawn, if that fails spawn at 100, 100
    for (var x = 0; x < 30; x++){
      // Choose random spawnZone and get a random coordinate inside it
      zoneIndex = random(0, map.spawnZones.length);

      zone = map.spawnZones[zoneIndex];

      spawnX = random(zone.x, zone.x + zone.width);
      spawnY = random(zone.y, zone.y + zone.height);

      // If player will spawn inside a wall, loops runs again and a new random coord is picked

      goodSpawn = true;

      for (var x = 0; x < map.walls.length; x++){
        wall = map.walls[x];

        if (spawnX + 30 > wall.x && spawnX < wall.x + wall.width){
          if (spawnY + 60 > wall.y && spawnY < wall.y + wall.height){
            goodSpawn = false;
          }
        }
      }

      if (goodSpawn == true){
        return {x: spawnX, y: spawnY};
      }
    }

    return {x: 100, y: 100};
  
  }

  Game.prototype.checkEndGame = function(){
    number = 0;
    name = "";
    winnerId = "";

    for (var id in game.players) {
      user = game.players[id];

      if (user.type == 'playing'){
        number += 1;
        name = user.username;
        winnerId = id;
      }
    }

    if (number < 2){
      game.winner = name;
      game.mode = 2;

      io.to(winnerId).emit('you won');

      this.newMessage(name + " Won!");

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

  Game.prototype.newMessage = function(message){

    if (message != null && message != ""){

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

      game.chat = game.chat.concat(newMessage);
    }
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
      io.to(socket.id).emit('change position', game.maps.index[game.mapIndex].width / 2, game.maps.index[game.mapIndex].height / 2);
      type = 'spectator';
      
    }

    // Ensures new players automatically start playing in devMode
    if (devMode == true){
      type = 'playing';
      coords = game.choosePosition();
      io.to(socket.id).emit('change position', coords.x, coords.y);
    }

    game.players[socket.id] = {
      username: player.username,
      color: player.color,
      host: playerHosts,
      type: type,

      gameKills: 0,
      gameDeaths: 0,
      gameHits: 0,
      gameShots: 0,
      gameWins: 0,
      gameGames: 0
    };

    game.newMessage(player.username + " joined the game");
  });

  // Triggered when user closes tab
  socket.on('disconnect', function() {
    if (game.players.hasOwnProperty(socket.id) == true){ // Ensures that socket ID is in game.players, preventing posible error
      game.newMessage(game.players[socket.id].username + " left the game");

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

      game.newMessage(game.players[socket.id].username + " left the game");

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

  socket.on('player died', function(socketID, x, y){
    game.players[socketID].type = 'spectator';
    io.sockets.emit('explosion', x, y, "large");
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

    player.dead = data.dead;

    player.midX = data.midX;
    player.midY = data.midY;

    player.tl = data.tl;
    player.tr = data.tr;
    player.br = data.br;
    player.bl = data.bl;

    player.gameKills = data.gameKills;
    player.gameDeaths = data.gameDeaths;
    player.gameHits = data.gameHits;
    player.gameShots = data.gameShots;
    player.gameWins = data.gameWins;
    player.gameGames = data.gameGames;
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

  socket.on('change map', function(mapIndex) {
    game.mapIndex = mapIndex;
    io.sockets.emit('map changed', mapIndex);
  });

  socket.on('change starting health', function(value) {
    game.startingHealth = value;
    io.sockets.emit('starting health changed', value);
  });

  socket.on('new message', function(message) {
    game.chat = game.chat.concat(message);
  });
}

io.on('connection', function(socket) {communication(socket)});

init();


