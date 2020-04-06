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
  io.sockets.emit('state', game);
  game.update();
}

// Every second this method is executed
function everySecond(){
  // Calculate fps
  fps = frame;
  frame = 0;

  console.log("#Of Bullets: " + game.bullets.length);

  console.log("FPS: " + fps);
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
  this.mapIndex = 0;

  this.startingHealth = 30;

  this.bulletBounces = 0;
  this.bulletSpeed = 13;
  
  this.players = {};
  this.bullets = [];
  this.powerUps = [new PowerUp(1200, 300, "health"), new PowerUp(1700, 300, "speed"), new PowerUp(1700, 800, "reload"), new PowerUp(1500, 800, "reload"), new PowerUp(1700, 600, "speed")];

  this.powerUpSetting = "None";
  this.maxPowerUps = 0;

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
    //this.updatePowerUps();

    frame += 1;
  }

  Game.prototype.updateBullets = function(){
    for (var x = 0; x < this.bullets.length; x++){

      bullet = this.bullets[x];

      bullet.frames += 1;

      if (bullet.frames > 180){
        this.bullets.splice(x, 1);
      }

      bullet.x += bullet.cX;
      bullet.y += bullet.cY;

      bullet.x = bullet.x;
      bullet.y = bullet.y;

      // Player collision detection
      for (var id in game.players) {
        user = game.players[id];
        
        if (user.dead == false){
          if (bullet.owner != id || bullet.bounces > 0){
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

              io.sockets.emit('explosion', user.midX, user.midY, "large");

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
      }

      
      map = this.maps.index[this.mapIndex];

      // Loop through walls

      for (var y = 0; y < map.walls.length; y++){
        wall = map.walls[y];

        // Test if there is collision with wall

        if (bullet.x > wall.x && bullet.x < wall.x + wall.width){
          if (bullet.y > wall.y && bullet.y < wall.y + wall.height){

            // See if bullet can bounce

            if (bullet.bouncesRemaining < 1){
              this.bullets.splice(x, 1);
              io.sockets.emit('explosion', bullet.x, bullet.y, "small");
            }else{

              // Test if backing up the x component would stop this collision

              testX = bullet.x - bullet.cX;

              if (testX > wall.x && testX < wall.x + wall.width && bullet.y > wall.y && bullet.y < wall.y + wall.height){
                // If so, reverse the y direction
                bullet.cY = -bullet.cY;
              }else{
                // If not, reverse the x direction
                bullet.cX = -bullet.cX;
              }

              bullet.frames = 0;
              bullet.bouncesRemaining -= 1;
              bullet.bounces += 1;
            }

            
          }
        }

      }
    }
  }

  Game.prototype.updatePowerUps = function(){
    for (var x = 0; x < this.powerUps.length; x++){
      powerUp = this.powerUps[x];
      for (var id in game.players) {
        player = game.players[id];

        distX = (player.x + 15) - powerUp.x;
        distY = (player.y + 30) - powerUp.y;

        dist = Math.sqrt((distX * distX) + (distY * distY));

        if (dist < 30){
          timeUntilNextSpawn = random(10000, 45000);

          if (powerUp.type == "health" && player.health < this.startingHealth){
            this.powerUps.splice(x, 1);
            io.to(id).emit("health powerUp");

            setTimeout(function(){ game.spawnPowerUp(); }, timeUntilNextSpawn);
          }

          if (powerUp.type == "speed"){
            this.powerUps.splice(x, 1);
            io.to(id).emit("speed powerUp");

            setTimeout(function(){ game.spawnPowerUp(); }, timeUntilNextSpawn);
          }

           if (powerUp.type == "reload"){
            this.powerUps.splice(x, 1);
            io.to(id).emit("reload powerUp");

            setTimeout(function(){ game.spawnPowerUp(); }, timeUntilNextSpawn);
          }
        }
      }
    }
  }

  Game.prototype.start = function(){

    io.sockets.emit('game was started');

    for (var id in game.players) {
      user = game.players[id];

      coords = this.choosePosition();

      io.to(id).emit('change position', coords.x, coords.y);
      user.type = 'playing';
    }

    this.initPowerUps();

    game.mode = 1;
  }

  Game.prototype.initPowerUps = function(){

    this.powerUps = [];

    // Count number of players
    number = 0;
    for (var id in game.players) {
      user = game.players[id];
      if (user.type == 'playing'){
        number += 1;
      }
    }

    if (this.powerUpSetting == "None"){
      this.maxPowerUps = 0;
    }else if (this.powerUpSetting == "Sparse"){
      this.maxPowerUps = Math.ceil(number / 4);
    }else if (this.powerUpSetting == "Normal"){
      this.maxPowerUps = Math.ceil(number / 2);
    }else if (this.powerUpSetting == "Abundant"){
      this.maxPowerUps = number;
    }

    for (var x = 0; x < this.maxPowerUps; x++){
      this.spawnPowerUp();
    }
  }

  Game.prototype.spawnPowerUp = function(){

    numberOfPowerUps = this.powerUps.length;

    if (numberOfPowerUps < this.maxPowerUps){

      coords = this.choosePosition();

      types = ["speed", "health", "reload"];

      type = types[Math.floor(Math.random() * types.length)];

      this.powerUps.push(new PowerUp(coords.x, coords.y, type));

    }
  }

  Game.prototype.choosePosition = function(){
    map = this.maps.index[this.mapIndex];

    zoneIndex = random(0, map.spawnZones.length);

    zone = map.spawnZones[zoneIndex];

    spawnX = random(zone.x, zone.x + zone.width);
    spawnY = random(zone.y, zone.y + zone.height);

    return {x: spawnX, y: spawnY};
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

function Bullet(x, y, targetX, targetY, rotation, cX, cY, owner, bouncesRemaining){
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
  this.bouncesRemaining = bouncesRemaining;
  this.bounces = 0;
  this.frames = 0;
}

function PowerUp(x, y, type){
  this.x = x;
  this.y = y;
  this.type = type;
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
      coords.x = 1600;
      coords.y =  700;

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

    io.sockets.emit('starting health changed', game.startingHealth);

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

  socket.on('fire', function(x, y, endX, endY, rotation, cX, cY, owner, bouncesRemaining) {
    game.bullets.push(new Bullet(x, y, endX, endY, rotation, cX, cY, owner, bouncesRemaining));
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

  socket.on('change bullet bounces', function(value) {
    game.bulletBounces = value;
  });

  socket.on('change bullet speed', function(value) {
    game.bulletSpeed = value;
  });

  socket.on('change powerUp setting', function(value) {
    game.powerUpSetting = value;
  });

  socket.on('new message', function(message) {
    game.chat = game.chat.concat(message);
  });
}

io.on('connection', function(socket) {communication(socket)});

init();


