// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
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

/*
setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);
*/

game = new Game();

function Game(){
  // 0: Lobby 1: In Game
  this.mode = 0;
  this.players = {};
}

function communication(socket){
  socket.on('new player', function(player) {

    playerNumber = Object.keys(game.players).length;

    if (playerNumber == 0){
      playerHosts = true;
    }else{
      playerHosts = false;
    }

    game.players[socket.id] = {
      username: player.username,
      color: player.color,
      host: playerHosts
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
    game.mode = 1;
  });

  socket.on('player data', function(data) {
    var player = game.players[socket.id] || {};
    player.x = data.x;
    player.y = data.y;
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

setInterval(function() {
  io.sockets.emit('state', game);
}, 1000 / 60);

